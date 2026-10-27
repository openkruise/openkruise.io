import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 休眠与唤醒

OpenKruise Agents 允许将运行中的沙箱 **休眠**（pause），使其停止消耗 CPU / 内存；之后再 **唤醒**（resume），回到运行态。整个过程中沙箱身份保持不变（同一个 `sandboxID`、同一个 Pod）。

> ⚠️ 该能力仍在持续演进。底层的捕获机制（是否保留内存状态、是否对文件系统做检查点等）依赖集群环境（例如内存态保留目前仅在阿里云 ACS 支持）。本文只介绍如何使用 API；关于状态保留的具体保证请参考平台运维手册。

## 概述

提供两种并列的接入方式，底层操作的都是同一个 `Sandbox` 资源：

| 接入方式                       | 面向的使用者                                                  | 典型场景                                      |
|-------------------------------|--------------------------------------------------------------|----------------------------------------------|
| E2B SDK（pause / connect）    | 基于 E2B Python / JavaScript SDK 的应用代码                   | 在空闲时编程式休眠、按需唤醒                  |
| Kubernetes CRD                | 集群运维、声明式 GitOps、`kubectl` 或自定义控制器             | 切换 `spec.paused` 或配置 `spec.pauseTime`    |

休眠 / 唤醒是 **一对一** 的：整个 pause → resume 过程中，沙箱 ID 保持不变。若需要「快照后克隆多个新沙箱」这种一对多的工作流，请参考 [快照管理](./checkpoint.md)。

如需在 `SandboxSet` 层面进行自动化生命周期管理——休眠策略、基于空闲状态的自动休眠、定时唤醒以及入站流量唤醒——请参考[自动休眠与唤醒](./auto-pause-resume.md)。

## 工作原理（简述）

1. **休眠（Pause）**：冻结沙箱 Pod。所有活动的 WebSocket / PTY / 命令流连接都会断开，客户端需要在唤醒后重连。
2. **唤醒（Resume）**：将 Pod 恢复为运行态。沙箱 ID 保持不变。
3. 捕获的具体范围（内存 / 文件系统）取决于运行时平台以及其背后 `SandboxSpec` 的配置。

## 休眠沙箱

<Tabs>
<TabItem value="E2B" label="E2B SDK">

E2B SDK 在沙箱句柄上暴露了 `pause()` 方法，底层调用 `POST /sandboxes/{sandboxID}/pause`。

```python
from e2b_code_interpreter import Sandbox

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    sbx.run_code("a = 1")
    sbx.pause()  # 沙箱进入 paused 状态；sandboxID 保持不变
```

```ts
import { Sandbox } from 'e2b'

const sbx = await Sandbox.create({ template: 'code-interpreter', timeoutMs: 300_000 })
await sbx.betaPause()
```

注意事项：

- 对非 `running` 状态的沙箱执行 pause 会返回 `409 Conflict`。
- 休眠沙箱的存活时间与运行态 timeout 分开控制。`sandbox-manager` 默认使用 `forever` 休眠保留策略；如需设置更短的
  保留窗口，请参考[保留休眠沙箱](#保留休眠沙箱)。

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

在 `Sandbox` CR 上设置 `spec.paused: true`，控制器会将 Pod 驱动进入休眠状态。

```shell
kubectl patch sbx my-sandbox -n default --type=merge -p '{"spec":{"paused":true}}'
```

也可以通过 `spec.pauseTime` 配置定时自动休眠：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  pauseTime: "2026-05-13T10:00:00Z"   # RFC3339；到期后自动进入 paused
```

查看 Phase：

```shell
kubectl get sbx my-sandbox -n default -o jsonpath='{.status.phase}'
# → Paused
```

</TabItem>
</Tabs>

## 自动休眠（Auto Pause）

除了显式调用 `pause`，还可以在创建沙箱时声明 **到期自动进入 `paused`**——到时间后沙箱不会被销毁，而是转为 `paused` 状态，保留身份等待后续唤醒。

<Tabs>
<TabItem value="E2B" label="E2B SDK">

参考 [E2B 官方文档 - Auto-pause](https://e2b.dev/docs/sandbox/persistence#auto-pause)：创建沙箱时将 `lifecycle.on_timeout` 设为 `"pause"`。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(
    template="demo",
    timeout=600,  # 10 分钟；到期后进入 paused，而不是被删除
    lifecycle={
        "on_timeout": "pause",
        "auto_resume": True,
    },
)
```

```ts
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create({
  template: 'demo',
  timeoutMs: 10 * 60 * 1000, // 10 分钟；到期后进入 paused
  lifecycle: {
    onTimeout: 'pause',
    autoResume: true,
  },
})
```

启用 `auto_resume` 后，经 `sandbox-gateway` 路由的访问请求会先唤醒休眠中的 Sandbox，再转发请求。Gateway
配置必须启用 `enable-wake-on-traffic`，否则访问请求不会唤醒 Sandbox。

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

在 `SandboxClaim`（或底层的 `Sandbox` CR）上设置 `spec.pauseTime`，到达指定的 **绝对时间** 后控制器会将沙箱驱动进入 `paused` 状态。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 绝对时间；到期后由控制器自动进入 paused 状态。
  # 建议通过编程方式设置，例如：
  # sbc.Spec.PauseTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  pauseTime: "2026-02-06T07:33:30Z"
```

> `Sandbox` CR 本身也有同名字段 `spec.pauseTime`（见上一节）。CRD 路径使用的是 **绝对时间**，而非 E2B SDK 那种「到 timeout 就 pause」的偏移语义——若需要后者请走 E2B SDK。

</TabItem>
</Tabs>

## 收到访问流量时自动唤醒

流量唤醒适用于自动休眠后需要在下一次数据面访问时恢复的 Sandbox。E2B 的 `auto_resume` 选项会保存为
`spec.autoPausePolicy.resume.onIngressTraffic`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  autoPausePolicy:
    resume:
      onIngressTraffic:
        pauseTimeout: 5m
```

当 `pauseTimeout` 为正数且 Sandbox 已使用自动休眠时，流量唤醒成功后会从唤醒时刻重新计时，并在该时长后再次
休眠。省略该字段时，Sandbox 会持续运行，直到再次被休眠或删除。并发请求会共享同一次恢复操作；触发请求会等待
Sandbox 就绪，如果恢复超时则请求失败，客户端应按自身的幂等策略决定是否重试。

## 保留休眠沙箱

`reserve-paused-sandbox-duration` 用于控制一个带 timeout 的 Sandbox 在 **实际执行 pause 转换后** 继续保留多久。
Sandbox 休眠时，OpenKruise Agents 会按下面的方式重新计算 `spec.shutdownTime`：

```text
pause 转换执行时间 + reserve-paused-sandbox-duration
```

该值必须是正数 [Go duration](https://pkg.go.dev/time#ParseDuration)，例如 `30m`、`2h` 或 `168h`。特殊值
`forever` 表示内置的 **100 年** 保留窗口，并不是真正无限期的 deadline。`0`、负数以及 `1d` 都是非法值
（`time.ParseDuration` 不支持 `d` 单位）。

该策略只会重新计算已有的 timeout。通过 `never-timeout` 扩展创建的 Sandbox 没有 `shutdownTime`，休眠保留策略不会
为其创建 deadline。

<Tabs>
<TabItem value="E2B" label="E2B SDK">

创建时通过 `e2b.agents.kruise.io/reserve-paused-sandbox-duration` metadata 扩展设置持久化保留策略。
该策略同时适用于自动休眠和后续的手动休眠：

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(
    template="demo",
    timeout=600,
    lifecycle={"on_timeout": "pause", "auto_resume": False},
    metadata={
        "e2b.agents.kruise.io/reserve-paused-sandbox-duration": "2h",
    },
)
```

手动 pause 时，可以通过 `x-e2b-kruise-reserve-paused-sandbox-duration` 请求头覆盖持久化值。
当该请求实际执行 running → paused 转换时，成功接受的覆盖值会持久化，供后续 pause 操作继续使用：

```python
sbx.pause(
    headers={
        "x-e2b-kruise-reserve-paused-sandbox-duration": "30m",
    }
)
```

取值优先级为 **pause 请求头 → 已持久化策略 → `forever` 默认值**。创建 metadata 或 pause 请求头包含非法值时，
`sandbox-manager` 会返回 `400 Bad Request`。由 manager 创建且未显式设置该值的 Sandbox 使用 `forever`，并将其
持久化到内部注解 `agents.kruise.io/reserve-paused-sandbox-duration`。

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

使用控制器自动休眠时，添加 `agents.kruise.io/reserve-paused-sandbox-duration` 注解，并同时设置
`spec.pauseTime` 和 `spec.shutdownTime`。该注解会让控制器先执行已经到期的 pause，再把 `shutdownTime` 改为
pause 转换执行时间加上保留窗口：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
  annotations:
    agents.kruise.io/reserve-paused-sandbox-duration: "2h"
spec:
  pauseTime: "2026-05-13T10:00:00Z"
  shutdownTime: "2026-05-13T10:00:00Z"
```

直接使用 CRD 的路径不会在注解缺失时应用默认策略：没有该注解，控制器就不会重新计算 `shutdownTime`。
如果显式存在的注解值非法，控制器会记录错误，并在本次自动休眠中使用 `forever` 对应的 100 年窗口，但不会改写非法注解。

控制器只会在 `spec.pauseTime` 触发自动休眠时解析该注解。直接 patch `spec.paused: true` **不会** 据此计算保留窗口；
通过 CRD 手动休眠时，请在同一个 patch 中写入期望的绝对时间 `spec.shutdownTime`。

</TabItem>
</Tabs>

## 唤醒沙箱

E2B SDK 侧 **推荐** 使用 `Sandbox.connect(...)`——它会隐式地唤醒一个休眠中的沙箱，同时刷新其 timeout。遗留的 `resume` 端点仅出于向后兼容而保留，新代码不应再使用。

<Tabs>
<TabItem value="E2B" label="E2B SDK">

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.connect(sandbox_id, timeout=300)  # 如果休眠则唤醒，并刷新 timeout
sbx.run_code("print(a)")
```

```ts
import { Sandbox } from 'e2b'

const sbx = await Sandbox.connect(sandboxId, { timeoutMs: 300_000 })
```

注意事项：

- 若沙箱已经在运行，`connect` 只会刷新 timeout，并且是 **只延长（extend-only）** 策略：永远不会缩短剩余时间。（例外：paused → running 的唤醒会直接采用请求的 timeout。）
- 对不存在或不属于当前 API-key 用户的沙箱调用 `connect` 会返回 `404 Not Found`。

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

将 `spec.paused` 置回 `false`，控制器会唤醒 Pod。也可以在同一次 patch 中同时调整 `spec.pauseTime` / `spec.shutdownTime`，以达到「唤醒的同时刷新 timeout」的效果：

```shell
kubectl patch sbx my-sandbox -n default --type=merge -p '{"spec":{"paused":false}}'

# 唤醒的同时把下次自动停机时间延后 1 小时（示例）
kubectl patch sbx my-sandbox -n default --type=merge \
  -p '{"spec":{"paused":false,"shutdownTime":"2026-05-13T11:00:00Z"}}'
```

> **CRD 路径没有 extend-only 保护。** E2B SDK 的 `connect + timeoutMs` 在运行态下只延长、不缩短；CRD 则完全由用户写入的值决定，可能会缩短剩余存活时间。请按需选择。

</TabItem>
</Tabs>

## 生命周期钩子（prePause / postResume）

生命周期钩子自 **v0.7.0** 起可用。

OpenKruise Agents 允许在沙箱的休眠 / 唤醒转换点挂载 **用户自定义命令**：

- **`prePause`** 在 Pod 仍运行时、真正休眠 **之前** 执行——可用于刷新缓冲区、提交事务、关闭外部连接，或将应用状态落盘。
- **`postResume`** 在唤醒后的 Pod Ready 且运行时 / 凭证 / 存储初始化完成之后、沙箱对外报告 `Ready` **之前** 执行——可用于重建连接池、重新初始化应用，或校验恢复后的状态。

所有休眠 / 唤醒来源共享同一条钩子执行路径：手动休眠（`spec.paused`）、到 timeout 自动休眠、`PauseTime` 到期、探针驱动的自动休眠，以及所有正常唤醒（SDK `connect`、流量唤醒、定时唤醒）。

### 配置钩子

钩子声明在 `Sandbox` 的 `spec.lifecycle`（池化创建的沙箱则声明在 `SandboxSet` 上）：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo-hooks
  namespace: default
spec:
  lifecycle:
    prePause:
      exec:
        command: ["/bin/bash", "-c", "/workspace/flush.sh"]
      timeoutSeconds: 10
    postResume:
      exec:
        command: ["/bin/bash", "-c", "/workspace/reconnect.sh"]
      timeoutSeconds: 10
  # ... 其余 template 等字段
```

| 字段            | 行为                                                                                                                                          |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `exec.command`   | 必填。第一个元素是可执行文件，其余是参数。如需 shell 请显式声明，例如 `["/bin/bash", "-c", "..."]`。                                              |
| `timeoutSeconds` | 可选，默认 `60`，取值范围 `1–60`。限定单次执行的时长——到期后命令会在服务端被终止。                                                                |

说明：

- 钩子以 `root` 身份在沙箱内执行（与升级钩子使用的身份一致）。
- `prePause` 在 Pod 删除 **之前**（以及平台做检查点的场景下、检查点捕获之前）执行，因此钩子的效果会被包含在捕获的状态里。`postResume` 仅在运行时重新初始化完成后才会执行；沙箱初次创建时不会执行。
- 池级配置：`SandboxSet.spec.lifecycle` 会被复制到每个池化创建的沙箱，并参与 revision hash 计算——修改池级钩子会触发未认领池成员的滚动更新。已认领的沙箱不会被静默覆盖；需要变更时请显式更新（或使用 [沙箱更新](./sandbox-update.md)）。由于复制后的 `spec.lifecycle` 已是沙箱自身的一部分，池级配置的钩子**同样会被**任何休眠来源触发——包括 E2B SDK（`beta_pause`）与到 timeout 自动休眠；只有钩子的**声明**本身仅支持 Kubernetes API。

### 失败语义

钩子失败是 **终态且不阻塞**：每个钩子在每个休眠 / 唤醒周期内只执行 **一次**，失败的执行会记录结果并放行生命周期转换——`prePause` 失败后休眠照常完成，`postResume` 失败后沙箱仍会变为 `Ready`。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo-hooks
  namespace: default
status:
  phase: Paused
  conditions:
    - type: PrePauseHook
      status: "False"
      reason: Failed
      message: "hook failed: execution error; lifecycle transition continues"
    - type: SandboxPaused
      status: "True"
      reason: StopPauseSucceed
```

- 结果可通过 `PrePauseHook` / `PostResumeHook` 条件（`Succeeded`、`Failed`、`Skipped`）以及 Warning 事件观测；条件在转换完成后仍会保留，作为该周期的记录。
- `prePause` 在 Pod 已经不存在（例如被带外删除）时记录 `Skipped`——不做任何执行，休眠继续。
- 当前版本不支持对失败的钩子重试；请将钩子写成「一次运行要么成功、要么快速失败」。

### 编写钩子脚本

> **命令必须幂等。** 控制器可能会重放结果不确定的钩子（例如控制器在命令执行后、结果持久化前崩溃）。请在沙箱内部用锁或标记保护非幂等操作。

- 优先使用原子写（先写临时文件再 rename），避免超时留下半写状态。
- 若钩子 fork 了后台子进程，退出时请显式终止它们——超时只会终止命令进程本身，不会杀掉整个进程树。不允许自我重叠的脚本请自行加互斥锁（如 `flock`）。
- `timeoutSeconds` 建议保持较短（10 秒是个好默认值）；注意休眠 / 唤醒时延包含一次钩子执行，流量唤醒请求应为 Pod 启动 + 初始化 + 钩子运行时间预留预算。

## 能力矩阵

| 能力                                           | E2B SDK                          | Kubernetes CRD                          |
|------------------------------------------------|----------------------------------|-----------------------------------------|
| 休眠运行中的沙箱                                | ✅ `sbx.beta_pause()`             | ✅ `spec.paused: true`                   |
| 唤醒休眠中的沙箱                                | ✅ `Sandbox.connect(id, ...)`     | ✅ `spec.paused: false`                  |
| 到 timeout 时自动触发 pause                     | ✅ `lifecycle.on_timeout='pause'` | ❌                                       |
| 在绝对时间点自动触发 pause                      | ❌                                | ✅ `spec.pauseTime`                      |
| 收到访问流量时自动唤醒                         | ✅ `lifecycle.auto_resume=true`    | ✅ `spec.autoPausePolicy.resume.onIngressTraffic` |
| 配置进入 paused 后的删除时间                    | ✅ 创建 metadata 或 pause 请求头    | ✅ 自动休眠使用注解；手动休眠写 `spec.shutdownTime` |
| 唤醒的同时设置 / 刷新 timeout                   | ✅ `Sandbox.connect(id, timeout=...)` | ✅ 同一次 patch 中写 `spec.shutdownTime` / `spec.pauseTime` |
| 运行态下对 timeout 的只延长（extend-only）保护  | ✅                                | ❌ 用户写入值可缩短                    |
| 观察 paused / running 状态                      | 通过 SDK 响应                     | `status.phase`（`Paused` / `Running`）   |
| 在休眠前执行命令（`prePause`）                     | ❌（SDK 无钩子字段）           | ✅ `spec.lifecycle.prePause`           |
| 在唤醒后执行命令（`postResume`）                   | ❌（SDK 无钩子字段）           | ✅ `spec.lifecycle.postResume`        |

如果你需要「只延长、永不缩短」的 timeout 刷新语义，请走 E2B SDK；CRD 路径更适合声明式 / GitOps 批量管控「暂停 / 运行 + 绝对时间」的场景。

## 注意事项

- **连接会断开。** 休眠时 Pod 被冻结，所有活动连接（WebSocket / PTY / 命令流）都会断开，客户端需要在唤醒后重连。
- **休眠期间的生命周期。** 运行态 timeout 不会在休眠后原样继续倒计时；自动删除由 `spec.shutdownTime` 控制，
  休眠保留策略可以基于 pause 转换执行时间重新计算它。
- **旧版 SDK。** 遗留的 `POST /sandboxes/{sandboxID}/resume` 端点仅为旧版 SDK 兼容保留。新代码一律使用 `Sandbox.connect(...)`。
- **状态保留取决于平台。** 跨休眠/唤醒是否保留内存状态依赖具体的运行时平台。若需控制休眠过程中文件系统的保留内容，可在 `SandboxSet` 上配置休眠策略（参见[休眠策略](./auto-pause-resume.md#休眠策略)）。如果你需要显式的内存 + 文件系统快照、并且希望能克隆出全新沙箱，请使用 [快照管理](./checkpoint.md)。
- **钩子仅限 CRD。** E2B SDK 未暴露钩子字段；钩子对任何来源触发的休眠 / 唤醒都生效，但只能通过 Kubernetes API 声明。
- **钩子随快照传播。** 从 checkpoint / 快照创建的沙箱会继承捕获的 `prePause` / `postResume` 配置，克隆出的沙箱会以相同的钩子休眠 / 唤醒。升级钩子（`preUpgrade` / `postUpgrade`）不会被复制进克隆。

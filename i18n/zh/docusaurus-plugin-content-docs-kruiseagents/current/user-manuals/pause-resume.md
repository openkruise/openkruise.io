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
- 休眠期间沙箱 **不会** 被自动删除——空闲超时计时会在休眠期间被关闭。

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
        "auto_resume": False,  # 见下方说明
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
    autoResume: false, // 见下方说明
  },
})
```

> ⚠️ **当前 OpenKruise Agents 尚未实现 `auto_resume`。** 即使将其显式设为 `true`，休眠中的沙箱也 **不会** 被自动唤醒；客户端仍需在需要时显式调用 `Sandbox.connect(sandbox_id, ...)`（见下一节）。建议显式写为 `false` 以表明语义。

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

## 能力矩阵

| 能力                                           | E2B SDK                          | Kubernetes CRD                          |
|------------------------------------------------|----------------------------------|-----------------------------------------|
| 休眠运行中的沙箱                                | ✅ `sbx.beta_pause()`             | ✅ `spec.paused: true`                   |
| 唤醒休眠中的沙箱                                | ✅ `Sandbox.connect(id, ...)`     | ✅ `spec.paused: false`                  |
| 到 timeout 时自动触发 pause                     | ✅ `lifecycle.on_timeout='pause'` | ❌                                       |
| 在绝对时间点自动触发 pause                      | ❌                                | ✅ `spec.pauseTime`                      |
| 自动唤醒（auto-resume）                         | ❌ 暂不支持                        | ❌ 暂不支持                               |
| 唤醒的同时设置 / 刷新 timeout                   | ✅ `Sandbox.connect(id, timeout=...)` | ✅ 同一次 patch 中写 `spec.shutdownTime` / `spec.pauseTime` |
| 运行态下对 timeout 的只延长（extend-only）保护  | ✅                                | ❌ 用户写入值可缩短                    |
| 观察 paused / running 状态                      | 通过 SDK 响应                     | `status.phase`（`Paused` / `Running`）   |

如果你需要「只延长、永不缩短」的 timeout 刷新语义，请走 E2B SDK；CRD 路径更适合声明式 / GitOps 批量管控「暂停 / 运行 + 绝对时间」的场景。

## 注意事项

- **连接会断开。** 休眠时 Pod 被冻结，所有活动连接（WebSocket / PTY / 命令流）都会断开，客户端需要在唤醒后重连。
- **休眠期间的生命周期。** 休眠中的沙箱不会因为空闲超时而被自动删除，自动删除由 `spec.shutdownTime` 独立控制。
- **旧版 SDK。** 遗留的 `POST /sandboxes/{sandboxID}/resume` 端点仅为旧版 SDK 兼容保留。新代码一律使用 `Sandbox.connect(...)`。
- **状态保留取决于平台。** 跨休眠/唤醒是否保留内存状态依赖具体的运行时平台。如果你需要显式的内存 + 文件系统快照、并且希望能克隆出全新沙箱，请使用 [快照管理](./checkpoint.md)。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 自动休眠与唤醒

在大规模运行 AI Agent 任务期间，闲置的沙箱仍会占用 CPU 和内存。OpenKruise Agents 可以在沙箱持续报告空闲后自动将其休眠，
并在下一次定时任务执行前或收到入站流量时自动唤醒，从而提升集群资源利用率，降低闲置算力成本。

自动休眠与唤醒通过在 `SandboxSet` 上配置运行状态探针和生命周期策略实现。本文同时介绍休眠策略，即沙箱休眠时保留哪些内容。
如需按需休眠和唤醒单个沙箱（E2B SDK 的 `pause()` / `connect()`、`Sandbox` CR 的 `spec.paused` 字段）以及基于超时的自动休眠，
请参考[休眠与唤醒](./pause-resume.md)。

## 前提条件

- 已创建 `SandboxSet`，且沙箱已被 Agent 认领。参见[温池管理](./warmpool-management.md)和[沙箱认领](./sandbox-claim.md)。
- 探针驱动的自动休眠与定时唤醒要求 `sandbox-controller` 已开启 `AutoPauseController` 特性门控（Feature Gate）。
- 入站流量唤醒仅对经由 [Sandbox Gateway](../architecture.md#sandbox-gateway) 路由到沙箱的请求生效，且网关需启用
  `enable-wake-on-traffic` 配置。

## 休眠策略

`spec.pauseStrategy` 是 `SandboxSet.spec` 的可选字段，用于指定 `spec.paused` 置为 `true` 时的休眠方式。不配置时默认使用
基于存储卷的休眠方式，与存量行为一致，已有配置无需改动。

| 策略 | 配置方式 | 保留内容 |
|------|----------|----------|
| 默认（存储卷） | 不配置 `spec.pauseStrategy` | 休眠前将沙箱的文件系统状态（`rootfs`）保存到沙箱挂载的存储卷。 |
| Stop | `pauseStrategy.type: Stop` | 不保存任何状态，仅保留 PVC 数据，`rootfs` 文件系统丢失。 |
| 快照（Snapshot） | `pauseStrategy.type: Hibernate` 且 `hibernateStrategy.type: Snapshot` | 休眠前将沙箱的文件系统状态（`rootfs`）保存到快照。 |

配置 `Stop` 策略：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: code-interpreter
  namespace: default
spec:
  replicas: 4
  pauseStrategy:
    type: Stop
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
          resources:
            limits:
              cpu: "1"
              memory: 1Gi
            requests:
              cpu: "1"
              memory: 1Gi
```

配置 `Snapshot` 策略：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: code-interpreter
  namespace: default
spec:
  replicas: 4
  pauseStrategy:
    type: Hibernate
    hibernateStrategy:
      type: Snapshot
  persistentContents:   # 当前仅支持 filesystem（rootfs）
    - filesystem
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
          resources:
            limits:
              cpu: "1"
              memory: 1Gi
            requests:
              cpu: "1"
              memory: 1Gi
```

:::note
`probes`、`autoPausePolicy`、`pauseStrategy` 和 `persistentContents` 都是 `SandboxSet.spec` 的顶层字段；
`spec.template.spec` 只配置容器、资源和调度等 Pod 模板字段。
:::

对沙箱进行休眠可释放闲置资源以优化运行成本。请在无活跃请求和长连接时再触发休眠，完整限制请参见[使用限制](#使用限制)。

## 探针工作机制和公共配置

`spec.probes` 是 `SandboxSet.spec` 的顶层字段，用于定义沙箱运行期间需要周期执行的探针。Probe 本身只负责执行命令并报告结果，
不决定沙箱是否休眠或唤醒；`spec.autoPausePolicy` 通过 Probe 名称引用对应结果，并根据不同规则解释标准输出：

- **休眠规则**使用 `messageRegex` 匹配 Probe 输出，判断 Agent 是否空闲。
- **唤醒规则**使用 `timeFormat` 将 Probe 输出解析为下一次任务时间。

`spec.probes` 不依赖 `autoPausePolicy`：即使未配置任何策略，Probe 也会执行，并可通过 `Sandbox` 的 Condition 查看结果。
配置策略后，策略通过名称读取对应 Probe 的 Condition。同一个 Probe 可以被一个或多个策略引用，但自动休眠和定时唤醒通常需要
不同的输出格式，建议分别定义 Probe，例如下文示例中的 `Active` 和 `Cron`。

当前仅支持 `exec` 类型的 Probe。

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| `name` | 是 | Probe 的自定义名称。同一 `SandboxSet` 内必须唯一，并与 `autoPausePolicy` 中 `probe` 字段的取值完全一致。Probe 结果对应的 Sandbox Condition 类型为 `agents.kruise.io/<name>`。 |
| `containerName` | 否 | 执行 Probe 的容器名称。未配置时默认使用 Pod 中的第一个容器。 |
| `exec.command` | 是 | 在目标容器中执行的命令及其参数。命令不会自动通过 Shell 执行；使用管道、重定向或条件判断时，需要像示例一样显式配置 `sh -c`。 |
| `periodSeconds` | 否 | Probe 的执行周期，单位为秒。示例值 `30` 表示每 30 秒执行一次，建议显式配置。 |
| `timeoutSeconds` | 否 | 单次 Probe 执行的超时时间，单位为秒。示例值 `5` 表示命令执行超过 5 秒即视为失败，建议显式配置。 |

Probe 命令退出码为 `0` 时，Condition 的 `status` 为 `True`，标准输出记录在 Condition 的 `message` 中；命令执行失败或超时时，
不会使用其输出触发自动休眠或定时唤醒。业务状态和任务时间都应通过标准输出表达，调试日志请勿写入标准输出。

## 根据运行状态自动休眠

以下 `SandboxSet` 示例每 30 秒检测一次 Agent 是否活跃。已认领的沙箱在 `Active` 探针连续 10 分钟报告空闲后自动休眠。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: agent-sandbox-pool
  namespace: default
spec:
  replicas: 4
  probes:
    - name: Active
      containerName: sandbox
      periodSeconds: 30
      timeoutSeconds: 5
      exec:
        command:
          - sh
          - -c
          - |
            # 示例，请根据实际业务定义空闲状态。
            if openclaw sessions list --active 900 2>/dev/null | grep -q .; then
              echo "active"
            else
              echo "inactive"
            fi
  autoPausePolicy:
    pause:
      whenProbedIdleState:
        probe: Active
        messageRegex: "^inactive$"
        thresholdDuration: 10m
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
```

- `Active` Probe 每 30 秒在 `sandbox` 容器中执行一次空闲检测命令。该名称与
  `autoPausePolicy.pause.whenProbedIdleState.probe` 的取值保持一致。
- 示例命令查询最近 900 秒（15 分钟）内的活跃会话，`grep -q .` 判断命令是否返回非空结果：存在活跃会话时输出 `active`，
  否则输出 `inactive`。`2>/dev/null` 用于避免错误信息写入 Probe 的标准输出。参数 `900` 仅为示例，请根据业务对空闲状态
  的定义进行调整。
- Probe 应以退出码 `0` 结束，并在标准输出中仅返回 `active` 或 `inactive`。Condition 的 `status` 表示 Probe 是否执行成功，
  业务状态由 `message` 表示。
- `pause.whenProbedIdleState.probe` 引用 `spec.probes` 中定义的 `Active` 探针，`messageRegex: "^inactive$"` 用于匹配
  探针返回的空闲状态。
- `thresholdDuration` 为必填项且不能为负数。设置为 `10m` 时，从探针首次返回 `inactive` 开始计时；如果之后连续 10 分钟均
  返回 `inactive`，沙箱将自动休眠。设置为 `0` 时，探针首次返回 `inactive` 后立即休眠。示例中的 `--active 900` 会将最近
  15 分钟内存在活动的会话判定为活跃，因此在没有新活动的情况下，从最后一次会话活动到沙箱休眠通常约需 25 分钟，即 15 分钟的
  活动判定窗口加上 10 分钟的持续空闲时间。

空闲探针超时、执行错误或配置无效时，系统按保守策略保持沙箱运行。由 `SandboxSet` 管理但尚未被认领的预热沙箱可以执行探针，
但不参与自动休眠决策；认领后才按策略自动休眠。

以下示例展示沙箱尚未休眠、正在等待空闲阈值到期时的 Status。`Active` 探针首次成功返回 `inactive` 后，Controller 会立即
根据该 Condition 的 `lastTransitionTime` 和 `thresholdDuration` 计算预计休眠时间并写入 `nextPauseTime`。例如，探针从
`2026-09-09T10:00:00Z` 开始持续报告空闲，`thresholdDuration` 为 10 分钟时，状态如下：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
status:
  phase: Running
  conditions:
    - type: agents.kruise.io/Active
      status: "True"
      reason: Succeeded
      message: inactive
      lastTransitionTime: "2026-09-09T10:00:00Z"
  schedules:
    - reason: probedIdle
      nextPauseTime: "2026-09-09T10:10:00Z"
```

- Condition 的 `type` 由固定前缀 `agents.kruise.io/` 和 Probe 名称 `Active` 组成；如果修改 Probe 名称，Condition 类型
  也会相应变化。
- `status: "True"` 表示探针执行成功，实际的业务状态由 `message: inactive` 表示。
- `nextPauseTime` 是根据当前空闲状态计算出的预计休眠时间，并不表示休眠已经触发。如果探针在到达该时间前返回 `active`，
  Controller 会清除 `nextPauseTime`，沙箱继续运行；如果探针持续返回 `inactive` 直至该时间，Controller 将触发休眠并清除
  `nextPauseTime`。

## 在定时任务前自动唤醒

以下 `SandboxSet` 示例每 30 秒获取下一次定时任务的 Unix 秒级时间戳，并在任务执行前 5 分钟自动唤醒已休眠的沙箱。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: agent-sandbox-pool
  namespace: default
spec:
  replicas: 4
  probes:
    - name: Cron
      containerName: sandbox
      periodSeconds: 30
      timeoutSeconds: 5
      exec:
        command:
          - sh
          - -c
          - |
            # 示例，请根据实际业务获取下一次任务时间。
            NEXT_MS=$(openclaw cron list --json 2>/dev/null \
              | jq -r '[.[] | select(.enabled != false) | .nextRunAtMs] | map(select(. != null)) | sort | .[0]')
            if [ -n "$NEXT_MS" ] && [ "$NEXT_MS" != "null" ]; then
              echo $((NEXT_MS / 1000))
            else
              echo "none"
            fi
  autoPausePolicy:
    resume:
      whenProbedScheduleTime:
        probe: Cron
        timeFormat: unix
        leadTime: 5m
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
```

- `Cron` Probe 每 30 秒在 `sandbox` 容器中获取一次下一次任务时间。该名称与
  `autoPausePolicy.resume.whenProbedScheduleTime.probe` 的取值保持一致。
- 示例命令先获取定时任务列表，再筛选已启用且包含 `nextRunAtMs` 的任务，按时间排序并取最早的任务。`nextRunAtMs` 是
  Unix 毫秒级时间戳，因此必须除以 1000 后再输出。
- Probe 应以退出码 `0` 结束，并在标准输出中仅返回一个值。当前示例配置了 `timeFormat: unix`，因此返回值必须是正整数形式的
  Unix 秒级时间戳，例如 `1788516000`。Controller 会去除输出首尾的空格和换行，但不能解析毫秒级时间戳、带单位的值、日期
  字符串、JSON 或混入的日志内容。
- 没有下一次任务时，脚本输出 `none`。该值表示当前没有可用的任务时间，Controller 不会生成定时唤醒计划。
- `resume.whenProbedScheduleTime.probe` 引用 `spec.probes` 中定义的 `Cron` 探针。
- `timeFormat` 指定如何解析 Probe 标准输出。示例值 `unix` 表示按 Unix 秒级时间戳解析；未配置时默认值也为 `unix`。
  还可以设置为 `datetime`，按带时区信息的 RFC3339 时间解析。
- `leadTime` 指定提前唤醒时长。示例值 `5m` 表示将 Probe 上报的下一次任务时间减去 5 分钟，得到沙箱的预计唤醒时间；
  未配置时默认为 5 分钟，设置为 `0` 表示在任务时刻唤醒，不能设置为负数。

该示例仅配置自动唤醒。沙箱需先通过手动操作、`spec.pauseTime` 或其他自动休眠规则进入休眠状态。如需同时实现闲时自动休眠和
定时唤醒，可以组合两个示例中的 `pause` 和 `resume` 配置。

定时唤醒 Probe 尚不可用或执行失败时，不会生成定时唤醒计划；如果同时配置了自动休眠规则，系统也不会触发自动休眠。Probe
执行成功但输出无法解析时，不生成定时唤醒计划，但空闲规则仍可触发休眠。

以下示例展示 `Cron` Probe 成功返回下一次任务时间后的 Status。`1788516000` 表示 `2026-09-04T10:00:00Z`，`leadTime`
为 5 分钟，因此 Controller 将预计唤醒时间写入 `nextResumeTime`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
status:
  phase: Running
  conditions:
    - type: agents.kruise.io/Cron
      status: "True"
      reason: Succeeded
      message: "1788516000"
      lastTransitionTime: "2026-09-04T09:50:00Z"
  schedules:
    - reason: probedSchedule
      nextResumeTime: "2026-09-04T09:55:00Z"
```

- Condition 的 `type` 由固定前缀 `agents.kruise.io/` 和 Probe 名称 `Cron` 组成。
- `status: "True"` 表示探针执行成功，`message` 是 Probe 的标准输出。
- `nextResumeTime` 是根据任务时间和 `leadTime` 计算出的预计唤醒时间；沙箱进入休眠后，Controller 将使用已记录的
  `nextResumeTime` 触发唤醒。如果 Probe 后续上报新的任务时间，Controller 会重新计算该值；如果输出 `none` 或其他无法
  解析的内容，则清除该值。

### 定时唤醒的时间和时区要求

系统按「Probe 上报的下一次任务时间减去 `leadTime`」计算唤醒时间。`leadTime` 是纯时长，默认值为 5 分钟，允许设置为
`0`，但不能为负数。

- `timeFormat: unix`：Probe 必须输出正整数形式的 Unix 秒级时间戳，例如 `1788516000`。Unix 时间戳表示从
  `1970-01-01T00:00:00Z` 开始累计的秒数，对应全球统一的绝对时刻，本身不携带时区。只要 Probe 返回正确的秒级时间戳，
  Controller 部署在不同地域或采用不同时区都不会改变唤醒时刻。`timeFormat` 未配置时默认按 `unix` 解析。
- `timeFormat: datetime`：Probe 必须输出包含时区信息的 RFC3339 时间，例如 `2026-09-04T18:00:00+08:00` 或
  `2026-09-04T10:00:00Z`，这两个值表示同一时刻。不包含时区且格式不符合 RFC3339 的 `2026-09-04 18:00:00` 无法解析。

时区风险主要发生在 Probe 将本地业务时间转换为 Unix 时间戳时。例如，业务时间为 `2026-09-04 18:00:00`（UTC+8），转换时
必须明确使用 `+08:00` 或 `Asia/Shanghai` 时区；如果错误地按 UTC 解析，将产生 8 小时偏差。已经生成的正确 Unix 时间戳
不会再受 Controller 所在时区影响。

请同时确认时间戳单位。JavaScript 的 `Date.now()` 和示例中的 `nextRunAtMs` 返回毫秒级时间戳，必须除以 1000 后再输出。
Controller 不会自动识别或转换毫秒级时间戳。

推荐使用 `unix`，并确保 Probe 直接输出正整数形式的秒级时间戳。如果下一次任务发生在 `2026-09-04T18:00:00+08:00`，
其 Unix 秒级时间戳为 `1788516000`；当 `leadTime` 为 5 分钟时，系统将在同一绝对时间线上的
`2026-09-04T17:55:00+08:00` 自动唤醒沙箱。

## autoPausePolicy、pauseTime 和 E2B timeout 的关系

- `spec.autoPausePolicy` 是持续生效的探针决策策略，可根据空闲状态休眠，并根据下一次任务时间唤醒。
- `Sandbox.spec.pauseTime` 是 RFC3339 格式的一次性绝对休眠时间。到达该时间后，Controller 会将 `spec.paused` 设置为
  `true`。
- 两者可以同时配置且独立生效，先满足的条件先触发休眠。即使探针报告 Agent 活跃，也不会取消已经到期的 `pauseTime`。
- 通过 E2B SDK 创建沙箱时，客户端只传递相对秒数 `timeout`。当 `lifecycle.on_timeout` 为 `pause` 时，`sandbox-manager`
  将其转换为「服务端当前时间 + timeout」的 `spec.pauseTime`；E2B 客户端不直接感知 `pauseTime`。
- 如果希望休眠完全由 Probe 策略决定，请勿在 `Sandbox` CR 中设置 `spec.pauseTime`。通过 E2B 创建或认领沙箱时，可设置
  `"e2b.agents.kruise.io/never-timeout": "true"`，避免生成 `pauseTime` 或 `shutdownTime`；该设置不影响
  `autoPausePolicy` 修改 `spec.paused`。

## 根据入站流量自动唤醒

休眠中的沙箱也可以通过入站请求自动唤醒。该能力仅对经由 Sandbox Gateway 路由到沙箱的流量生效。

<Tabs>
<TabItem value="E2B" label="E2B SDK">

创建沙箱时，将 `lifecycle.on_timeout` 设置为 `pause`，并将 `lifecycle.auto_resume` 设置为 `True`：

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox.create(
    template="code-interpreter",
    timeout=600,
    lifecycle={
        "on_timeout": "pause",
        "auto_resume": True,
    },
)

# 获取指定端口的沙箱访问地址
host = sandbox.get_host(3000)
print(f"https://{host}")
```

沙箱在超时后自动休眠。休眠期间，向沙箱访问地址发送请求会触发自动唤醒，无需先调用 `Sandbox.connect()`。唤醒后将从唤醒
时刻重新按创建时的 `timeout` 计算自动休眠倒计时；小于 5 分钟的正值按 5 分钟处理。

当前 `auto_resume` 仅支持通过沙箱访问地址发起的入站流量自动唤醒。`sandbox.commands`、`sandbox.files` 等 SDK 操作不会
直接触发自动唤醒；如需执行此类操作，请先调用 `Sandbox.connect(...)`。

</TabItem>
<TabItem value="CRD" label="SandboxSet CRD">

配置 `spec.autoPausePolicy.resume.onIngressTraffic`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
spec:
  autoPausePolicy:
    resume:
      onIngressTraffic:
        pauseTimeout: 5m
```

`pauseTimeout` 用于在流量唤醒后重新设置基于超时时间的自动休眠倒计时。该值仅对已配置 `spec.pauseTime` 的沙箱生效；
未配置或取值不大于 0 时，不会重新设置倒计时。小于 5 分钟的正值按 5 分钟处理。

</TabItem>
</Tabs>

关于客户端如何解析沙箱访问地址和域名，请参考 [E2B Client](./e2b-client.md)。关于在单个 `Sandbox` CR 上配置流量唤醒，
以及并发请求共享同一次恢复操作的行为，请参考[休眠与唤醒](./pause-resume.md#收到访问流量时自动唤醒)。

## 验证自动休眠和唤醒配置

执行以下命令查看探针结果和下一次自动休眠、唤醒时间。将 `<RESOURCE_NAME>` 和 `<NAMESPACE>` 替换为实际值：

```shell
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.conditions}'
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.schedules}'
```

探针执行成功时，对应 Condition 的 `status` 为 `True`，`message` 为探针标准输出。空闲匹配期间，`status.schedules` 会
显示 `nextPauseTime`；存在有效定时任务时会显示 `nextResumeTime`。

## 观测休眠沙箱

处于休眠状态的 Pod 不占用集群 CPU 及内存资源。可通过以下命令查看沙箱 Phase：

```shell
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.phase}'
# → Paused
```

如需观测沙箱 Pod 的资源使用情况，请使用您的监控体系，例如基于 Prometheus 的监控面板。

## 删除休眠的沙箱

如需彻底移除休眠的沙箱，可以删除 `Sandbox` 资源。

<Tabs>
<TabItem value="E2B" label="E2B SDK">

将 `<YOUR_SANDBOX_ID>` 替换为实际的沙箱 ID：

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox.connect("<YOUR_SANDBOX_ID>")
sandbox.kill()
```

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

```shell
kubectl -n <NAMESPACE> delete sandbox <RESOURCE_NAME>
```

</TabItem>
</Tabs>

## 使用限制

- **唤醒失败风险**：休眠会回收沙箱的计算资源（CPU 和内存），唤醒时可能因集群资源不足导致实例启动失败。请稍后重试，
  或调整实例的资源规格后再唤醒。
- **请求中断与长连接丢失**：执行休眠后系统将立即冻结沙箱 CPU，正在处理的请求会因冻结而超时失败；唤醒后 WebSocket、
  SSE、gRPC 等长连接不会自动恢复，需客户端主动重连。建议确认无活跃请求与长连接后再触发休眠。
- **Stop 策略的数据丢失风险**：使用 `pauseStrategy.type: Stop` 休眠时，沙箱的 `rootfs` 与内存状态不会保留，唤醒后容器内
  未写入 PVC 的数据将丢失。如需在唤醒后保留容器文件系统状态，请使用默认策略或快照休眠，配置方式请参见
  [休眠策略](#休眠策略)。

## 相关文档

- [休眠与唤醒](./pause-resume.md)：手动休眠唤醒、基于超时的自动休眠、休眠保留时间。
- [温池管理](./warmpool-management.md)：通过 `SandboxSet` 创建和管理沙箱。
- [快照管理](./checkpoint.md)：沙箱的检查点与克隆工作流。
- [E2B Client](./e2b-client.md)：将 E2B SDK 接入 `sandbox-manager`。

# 预热池自动扩缩容

PoolAutoscaler 用于自动调整预热池的大小。它以未被领取的可用 Sandbox 数量和用户配置的 Cron 计划为依据，修改 SandboxSet 的 `spec.replicas`：可用 Sandbox 不足时补池，空闲 Sandbox 过多时缩池，也可以在已知高峰前提前预热。

与基于 CPU、QPS 的自动伸缩不同，PoolAutoscaler 不采集业务指标，也不预测流量。它只管理预热池容量；Sandbox 被领取后的业务生命周期仍由 Agent Sandbox 服务处理。预热池的基础概念见[预热池管理](./warmpool-management.md)。

## 背景与适用场景

该能力适合以下场景：

- **请求量随时变化**：例如用户通过 E2B API 创建、使用并释放 Sandbox，希望始终保留一定数量的可用实例以降低领取等待时间。
- **高峰时间可预期**：例如工作日上班前、定时任务开始前或活动开始前，可在指定时间提前创建预热池。
- **两类流量并存**：日常通过容量策略补池，并在已知高峰时由 Cron 策略指定预热规模。

## 前提条件与使用限制

使用前请确认：

1. 已安装 `agent-sandbox-controller` 且版本支持 PoolAutoscaler：较新版本已默认启用，无需额外配置；旧版本需通过启动参数 `--feature-gates=PoolAutoscaler=true` 显式开启（安装方式见[安装](../installation.md)）。
2. 已按[预热池管理](./warmpool-management.md)创建待管理的 SandboxSet，且 SandboxSet controller 正常运行。
3. 同一 namespace 内，一个 SandboxSet 最多只能由一个 PoolAutoscaler 管理。
4. PoolAutoscaler 至少配置一种策略：`capacityPolicy` 或 `cronPolicies`。

PoolAutoscaler 仅修改目标 SandboxSet 的 `spec.replicas`。不要让 HPA、AHPA、脚本或其他控制器同时修改同一个字段；它也不直接创建或删除 Pod。

## 场景一：按可用容量自动补池

此场景适用于请求量难以准确预估、但希望稳定获得低领取延迟的业务。例如，业务通过 E2B API 不断创建 Sandbox、执行代码或命令、完成后释放 Sandbox。每次领取都会消耗预热池中的可用 Sandbox；容量策略据此补充未被领取的实例。

### 步骤一：通过 SandboxSet 创建预热池

已按[预热池管理](./warmpool-management.md)创建 SandboxSet 的用户可直接使用现有预热池。以下为最小示意，各字段含义见注释；请将标注“必须替换”的字段改为当前集群已验证的值。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: sandbox-pool        # SandboxSet 名称，后续 PoolAutoscaler 通过此名称引用；可按需修改
  namespace: default        # 部署命名空间；PoolAutoscaler 必须与它同 namespace
spec:
  replicas: 2               # 初始预热池大小；应用 PoolAutoscaler 后由其接管，可按成本设小一些
  runtimes:
    - name: agent-runtime   # 注入 envd 兼容运行时，步骤三的 E2B 代码执行/文件/命令能力依赖它
  template:
    spec:
      containers:
        - name: sandbox
          image: <your-agent-sandbox-image>   # 必须替换：集群内可拉取的 Agent Sandbox 运行时镜像
          resources:
            requests:         # 调度申请资源，影响预热池单实例成本和可放置的节点范围
              cpu: "1"
              memory: 1Gi
            limits:           # 资源上限；按实际运行时需要调整，过大浪费预热成本，过小影响启动
              cpu: "1"
              memory: 1Gi
```

:::note
`runtimes: agent-runtime` 是步骤三 E2B 验证的必要条件（`run_code`、文件读写、命令执行均依赖注入的 envd 运行时）。运行时注入机制及其对 `sandbox-injection-config` ConfigMap 的依赖见[运行时注入](./runtime-injection.md)。
:::

```bash
kubectl apply -f sandboxset.yaml
kubectl get sandboxset sandbox-pool -n default
```

### 步骤二：配置 PoolAutoscaler

以下策略按比例维护预热池：目标可用比例为 50%，使用默认容差 10%，近期平均可用比例低于 40% 时扩容，高于 60% 时缩容，两者之间不调整。百分比水位随池规模弹性伸缩，适合负载波动的业务。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: PoolAutoscaler
metadata:
  name: sandbox-pool-autoscaler   # PoolAutoscaler 名称，仅用于标识和后续 kubectl 查询，可按需修改
  namespace: default              # 必须与目标 SandboxSet 同 namespace
spec:
  scaleTargetRef:
    apiVersion: agents.kruise.io/v1alpha1
    kind: SandboxSet              # 仅支持 SandboxSet，不可修改
    name: sandbox-pool            # 步骤一中创建的 SandboxSet 名称
  minReplicas: 2                 # 预热池下限；百分比目标需满足缩容可达性，见下方说明
  maxReplicas: 50                 # 预热池上限；按业务峰值并发量与集群容量设置
  capacityPolicy:
    targetAvailable: "50%"        # 目标可用（未被领取的）Sandbox 占副本数的比例，随池规模弹性伸缩
    # tolerance 未设置时默认为 10%，与目标合并后形成 40%~60% 的不调整区间
    scaleUp:
      stabilizationWindowSeconds: 60    # 连续扩容最小间隔；设小可加快补池，但过小会导致扩容过于频繁
    scaleDown:
      stabilizationWindowSeconds: 300   # 连续缩容最小间隔；拉长可避免夜间流量波动频繁回收预热池
```

```bash
kubectl apply -f pool-autoscaler.yaml
kubectl get poolautoscaler sandbox-pool-autoscaler -n default
```

`minReplicas` 和 `maxReplicas` 始终生效，所有策略计算出的副本数都会被限制在这个范围内。`targetAvailable`、`tolerance` 和 `minReplicas` 的取值共同决定空闲预热池能否收缩到 `minReplicas`，配置规则见[容量策略参数调优指南](#容量策略参数调优指南)。

### 步骤三：使用 E2B 业务流量验证

以下单文件脚本模拟真实业务流量：每个并发循环从预热池领取一个 Sandbox，执行代码、读写文件、执行命令，短暂持有后释放。预热池的扩缩容状态可通过步骤四的命令另行观察。

准备工作：

1. 本地已安装 Python 3.9+，并已配置目标集群的 kubeconfig（用于 kubectl 观察状态）。
2. 安装 E2B SDK：`pip install e2b-code-interpreter`。
3. 准备可访问的 E2B 服务域名、自签 CA 证书（如集群使用自签证书）及 API Key。

将脚本保存为 `poolautoscaler-verify.py`：

```python
#!/usr/bin/env python3
"""Generate E2B business traffic against a PoolAutoscaler-managed pool.

Usage:
  E2B_API_KEY='<api-key>' \
  E2B_DOMAIN='<e2b-domain>' \
  SSL_CERT_FILE='<ca-file>' \
  python poolautoscaler-verify.py --template sandbox-pool
"""
import argparse, os, sys, threading, time
from concurrent.futures import ThreadPoolExecutor

stop = threading.Event()


def business_loop(loop_id, template, hold, startup_timeout, deadline):
    """One worker: claim a sandbox, run business calls, hold, then release."""
    from e2b_code_interpreter import Sandbox
    seq = 0
    while time.monotonic() < deadline and not stop.is_set():
        seq += 1
        try:
            sandbox = Sandbox.create(template=template, timeout=startup_timeout)
            sandbox.run_code(f"print('loop={loop_id} seq={seq}')")
            path = f"verify-{loop_id}-{seq}.txt"
            content = f"loop={loop_id} seq={seq}\n"
            sandbox.files.write(path, content)
            assert sandbox.files.read(path) == content, "file content mismatch"
            assert sandbox.commands.run(f"cat {path}").stdout == content
            stop.wait(hold)          # simulate the business holding the sandbox
            sandbox.kill()
        except Exception as exc:
            print(f"loop {loop_id} seq {seq} failed: "
                  f"{type(exc).__name__}: {exc}", file=sys.stderr, flush=True)
            stop.wait(5)             # back off before the next attempt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--template", default="sandbox-pool",
                        help="SandboxSet name, i.e. the E2B template")
    parser.add_argument("--concurrency", type=int, default=10,
                        help="simultaneous business sandboxes; each consumes one pool slot")
    parser.add_argument("--duration-seconds", type=int, default=300)
    parser.add_argument("--hold-seconds", type=int, default=30,
                        help="how long each loop holds its sandbox before releasing")
    parser.add_argument("--startup-timeout", type=int, default=600,
                        help="seconds to wait for each sandbox to start")
    args = parser.parse_args()
    if not os.getenv("E2B_API_KEY"):
        parser.error("E2B_API_KEY must be set")

    deadline = time.monotonic() + args.duration_seconds
    print(f"load: {args.concurrency} loops x {args.duration_seconds}s, "
          f"hold={args.hold_seconds}s (Ctrl+C stops early)", flush=True)
    try:
        with ThreadPoolExecutor(max_workers=args.concurrency) as pool:
            futures = [pool.submit(business_loop, i, args.template,
                                   args.hold_seconds, args.startup_timeout, deadline)
                       for i in range(args.concurrency)]
            for future in futures:
                future.result()
    except KeyboardInterrupt:
        print("interrupted; waiting for in-flight sandboxes to settle...", flush=True)
    finally:
        stop.set()
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

运行（另开一个终端执行步骤四的 `kubectl get ... -w` 可实时观察扩容）：

```bash
E2B_API_KEY='<api-key>' \
E2B_DOMAIN='<e2b-domain>' \
SSL_CERT_FILE='<ca-file>' \
python poolautoscaler-verify.py \
  --template sandbox-pool \
  --concurrency 10 \
  --duration-seconds 300 \
  --hold-seconds 30
```

参数说明：

- `--concurrency`：并发业务循环数。每个循环同时持有一个业务 Sandbox，等于从预热池领取的速率上限；调大后预热池消耗更快，PoolAutoscaler 扩容更明显。请确认 `maxReplicas` 大于该值，否则预热池无法补齐。
- `--hold-seconds`：每个 Sandbox 的业务持有时长；越长则单位时间领取次数越少。
- `--duration-seconds`：压测总时长，建议不小于扩容稳定窗口（默认 60 秒）的 3 倍，以观察至少两轮扩容。
- `--startup-timeout`：单个 Sandbox 的创建超时时间，默认 600 秒；底层供给较慢时可调大。

预期现象：压测期间用步骤四的命令观察，`currentCapacity.available` 持续下降、`desiredReplicas` 逐步抬升，说明容量策略检测到领取消耗并补充预热池。

验证缩容（可选）：流量结束后，手动调低 `targetAvailable` 并观察预热池收敛：

```bash
kubectl patch poolautoscaler sandbox-pool-autoscaler -n default \
  --type merge -p '{"spec":{"capacityPolicy":{"targetAvailable":"10%"}}}'
kubectl get sandboxset sandbox-pool -n default -w
```

预热池应逐步缩至 `minReplicas`（示例为 2）。验证完成后，将 `targetAvailable` 改回原值即可。

### 步骤四：观测扩缩容节奏与启动保护

```bash
kubectl get poolautoscaler sandbox-pool-autoscaler -n default -o yaml
kubectl get sandboxset sandbox-pool -n default -o yaml
kubectl describe poolautoscaler sandbox-pool-autoscaler -n default
```

重点查看 `status.currentReplicas`、`status.desiredReplicas`、`status.currentCapacity.available` 和 `status.conditions`。这些是最近一次调谐的观测值，可能与 SandboxSet 的实时状态存在短暂偏差。

容量策略基于近期一段观察时间内的平均可用数量做决策，以平滑瞬时波动；首次扩缩容可以立即执行，后续按稳定窗口节奏执行：扩容默认间隔 60 秒，缩容默认间隔 300 秒，可通过 `stabilizationWindowSeconds` 调整（见[参数配置约束](#参数配置约束)）。扩容间隔的默认值已包含 Pending 超时的安全余量；配置更大的值时以配置值为准。

当 SandboxSet 当前 generation 的 `ScalingLimited=True` 时，PoolAutoscaler 暂停继续扩容，避免在启动失败或 Pending 超时已耗尽预算时继续提高目标；缩容不受此限制。正在创建的 Sandbox 的创建并发由 SandboxSet 控制，PoolAutoscaler 不直接管理 Pod。限流的触发条件、恢复方式与排查步骤见[异常场景：扩容限流的触发与恢复](#异常场景扩容限流的触发与恢复)。

调参建议：从小范围配置起步——较小的 `minReplicas`、`maxReplicas` 和较长的缩容间隔，结合启动成功率、领取延迟及预热成本逐步调整。若需临时观察或人工接管，可暂停自动扩缩容（恢复时设为 `false` 或删除该字段）：

```bash
kubectl patch poolautoscaler sandbox-pool-autoscaler -n default \
  --type merge -p '{"spec":{"suspend":true}}'
```

### 步骤五（可选）：删除策略

本步骤是可选操作。不再需要自动扩缩容时（例如业务下线或改为固定规模），可删除 PoolAutoscaler。删除后，SandboxSet 和现有 Sandbox 均会保留，SandboxSet 副本数维持在删除前的值，不会自动缩容；如需回收预热池，请再手动调整 `spec.replicas` 或删除 SandboxSet。

```bash
kubectl delete poolautoscaler sandbox-pool-autoscaler -n default
```

## 场景二：按时间提前预热

此场景适用于高峰时间明确的业务，例如每天工作日 09:00 前会有大量用户创建开发环境。Cron 策略会在高峰开始前直接设定预热池目标，避免等到可用实例耗尽后再扩容。

以下示例在工作日 08:30 将预热池设为 30 个副本，20:00 调整为 5 个副本：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: PoolAutoscaler
metadata:
  name: sandbox-pool-schedule   # 仅用于标识，可按需修改
  namespace: default            # 必须与目标 SandboxSet 同 namespace
spec:
  scaleTargetRef:
    apiVersion: agents.kruise.io/v1alpha1
    kind: SandboxSet            # 仅支持 SandboxSet
    name: sandbox-pool          # 必须替换：已创建的 SandboxSet 名称
  minReplicas: 2               # 平台下限；Cron 目标也会被限制在该范围内
  maxReplicas: 50              # 平台上限；需覆盖所有 Cron 策略中最大的 targetReplicas
  cronPolicies:
    - name: weekday-peak        # 策略名，同一 PoolAutoscaler 内必须唯一
      timeZone: Asia/Shanghai   # 不设置时默认使用 controller 所在时区，建议显式指定
      schedule: "30 8 * * 1-5"  # 五段 Cron：分 时 日 月 星期；此处为工作日 08:30
      targetReplicas: 30        # 触发时直接把预热池设为 30，需不超过 maxReplicas
    - name: weekday-offpeak
      timeZone: Asia/Shanghai
      schedule: "0 20 * * 1-5"  # 工作日 20:00 缩回夜间规模
      targetReplicas: 5
```

`cronPolicies` 使用五段 Cron 表达式：分、时、日、月、星期。未设置 `timeZone` 时使用 controller manager 进程的时区。Cron 触发时优先于容量策略，且不受容量策略稳定窗口限制；最终副本数仍受 `minReplicas` 和 `maxReplicas` 限制，扩容同样受 SandboxSet 启动保护限制（见[异常场景：扩容限流的触发与恢复](#异常场景扩容限流的触发与恢复)）。

若同时配置容量策略，则未触发 Cron 时按容量策略补池，Cron 触发时以 Cron 目标为准。Cron 策略直接设定目标副本数，不受容量策略水位和缩容可达性规则约束，但仍会遵守扩容限流：Cron 抬升目标时若 SandboxSet 启动预算耗尽，同样会被阻塞并等待预算恢复。

## 异常场景：扩容限流的触发与恢复

扩容限流是 SandboxSet 的启动保护机制：当同一时间存在过多启动失败或长期 Pending 的 Sandbox 时，暂停进一步提高副本数，避免在异常状态下制造更多无法启动的实例。PoolAutoscaler 读取该信号并暂停扩容。

### 限流的触发

SandboxSet 的 `spec.scaleStrategy.maxUnavailable` 同时作为启动预算；未设置时默认为当前副本数（相当于 100%，即不限制并发扩容量）。注意它与 `updateStrategy.maxUnavailable`（滚动更新用，默认 20%）是不同字段。处于创建阶段的 Sandbox 按以下两类计数占用预算：

- **Failed**：Ready condition 为 `False` 且 reason 为 `StartContainerFailed`、`PodCreateFailed` 或 `Unschedulable`，即明确的启动失败（容器启动失败、镜像/配置错误、创建 API 失败、调度失败如节点资源不足或底层调度错误等）。
- **TimedOut**：长期停留在 Creating/ResourcePending 状态、创建时间超过 Pending 超时阈值（默认 50 秒）仍未 Ready。

当 `Failed + TimedOut >= 启动预算` 时，SandboxSet 写入：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: sandbox-pool
  namespace: default
status:
  conditions:
    - type: ScalingLimited
      status: "True"
      reason: StartupBudgetExhausted
      message: '2 of 2 startup slots are blocked: Timeout=1, Failed=1'
```

同时发出 Warning 级 `ScalingLimited` 事件。PoolAutoscaler 检测到该 condition 后：

- 暂停扩容：`status.desiredReplicas` 不再抬升，即使可用数量已低于下水位；等待期间周期性发出 Normal 级 `ScaleBlocked` 事件。
- 缩容不受影响：上水位触发的缩容照常执行。
- 容错处理：仅当 SandboxSet 报告的是当前 generation 的显式 `True` 才阻塞；condition 缺失、陈旧或 `Unknown` 时按无信号处理，扩容照常，避免升级或首次调谐期间误阻塞。

注意区分两个同名 condition：这里的 `ScalingLimited` 位于 **SandboxSet** status，表示启动预算耗尽；PoolAutoscaler 自身的 `ScalingLimited`（见 CRD 字段说明）表示期望副本数触及 `minReplicas`/`maxReplicas` 边界，两者含义不同。

### 限流的恢复

恢复不需要人工干预，满足任一条件后预算自动释放：

- 失败的 Sandbox 被删除（手动删除或业务侧清理），或其 Pod 恢复 Running 且 Ready 变为 `True`；
- Pending 超时的 Sandbox 完成启动进入 Running，或被删除。

当 `Failed + TimedOut` 降回预算以下，SandboxSet 下一次调谐会将 `ScalingLimited` 改回 `False`，PoolAutoscaler 随即恢复扩容并继续补池。

### 排查与应对

```bash
# 查看限流状态与 Timeout/Failed 计数
kubectl get sandboxset sandbox-pool -n default -o jsonpath='{.status.conditions[?(@.type=="ScalingLimited")]}'
kubectl describe sandboxset sandbox-pool -n default

# 查看限流与阻塞事件
kubectl get events -n default --field-selector involvedObject.name=sandbox-pool

# 列出预热池中的 Sandbox 及其状态
kubectl get sandbox -n default -l agents.kruise.io/sandbox-pool=sandbox-pool

# 查看某个失败实例的 Ready condition 及具体原因
kubectl get sandbox <name> -n default -o jsonpath='{.status.conditions[?(@.type=="Ready")]}'
```

根据 `message` 中的计数定位主要问题：

- **Failed 为主**：多为镜像拉取失败、资源配置错误或 quota 不足。查看失败 Sandbox 的 Ready condition message 确认具体原因，修正 SandboxSet 配置后删除失败实例：

```bash
kubectl delete sandbox <name> -n default
```

SandboxSet 会自动重建新实例；若配置未修复，新实例仍会失败并再次触发限流。

- **TimedOut 为主**：底层创建速度跟不上扩容节奏。可调小 SandboxSet 的 `scaleStrategy.maxUnavailable` 降低单批创建量，或联系集群管理员评估底层供给能力。

## 容量策略参数调优指南

容量策略根据“目标值 + 容差”计算上下水位：

- `targetAvailable` 为绝对值（如 `10`）时：下水位 = 目标值 - 容差，上水位 = 目标值 + 容差。
- `targetAvailable` 为百分比（如 `"60%"`）时：以近期平均副本数为基准，先将目标与容差的百分比合并，再向上取整，即下水位 = ceil(平均副本数 × (目标 - 容差)%)，上水位 = ceil(平均副本数 × (目标 + 容差)%)。
- `tolerance` 未设置时默认为 `10%`。目标是百分比时按百分比合并；目标是绝对值时，默认容差为该目标值的 10% 向上取整（例如目标为 10 时容差为 1，目标为 15 时容差为 2）。

平均可用数量低于下水位时扩容，并补足到目标值附近；高于上水位时缩容；位于两者之间时不调整。

:::caution
特别避免 `targetAvailable: "100%"`：可用数量最多等于副本数，永远不会严格高于上水位，因此无论容差如何配置，空闲预热池都永不缩容，只增不减。若确实希望池规模只增不减，再考虑使用 100% 目标。
:::

### 确保空闲预热池能收缩到 minReplicas

容量策略应保证空闲预热池能够收缩到 `minReplicas`，否则预热池会停留在 `minReplicas` 之上，空闲资源无法回收到预期下限。判定方法是检查最后一步缩容：当预热池副本数为 `minReplicas + 1` 时，上水位必须不大于 `minReplicas`，这一步缩容才能触发。

- 绝对值目标 `T` 与解析后的容差 `D`（含默认容差）：需满足 `T + D <= minReplicas`。满足时，空闲预热池的稳定规模就是 `minReplicas`。
- 百分比目标 `p%` 与百分比容差 `q%`（含默认容差）：需满足 `p + q <= 100 × minReplicas / (minReplicas + 1)`。百分比水位随预热池缩小而降低，空闲时会逐步收敛到 `minReplicas`。
- 百分比目标配绝对容差 `D`：在 `minReplicas + 1` 个副本处评估，需满足 `ceil((minReplicas + 1) × p%) + D <= minReplicas`。
- 绝对目标 `T` 配百分比容差 `q%`：容差按 `ceil(T × q%)` 解析，需满足 `T + ceil(T × q%) <= minReplicas`。

常见配置的效果如下：

| minReplicas | targetAvailable | tolerance | 在 minReplicas+1 个副本处的上水位 | 效果 |
| --- | --- | --- | --- | --- |
| 1 | `"40%"` | 默认（`"10%"`） | 1 | 可从 2 个副本缩到 1 个 |
| 1 | `"50%"` | 默认（`"10%"`） | 2 | 上水位为 2，停留在 2 个副本 |
| 1 | `1` | `0` | 1 | 固定保底 1 个可用 Sandbox |
| 1 | `1` | 默认（`"10%"`） | 2 | 默认容差将上水位抬高到 2，停留在 2 个副本 |
| 2 | `"50%"` | 默认（`"10%"`） | 2 | 可从 3 个副本缩到 2 个（即场景一示例） |
| 1 | `"100%"` | 任意（含 `0`） | `>= 副本数` | 可用数最多等于副本数，永不高于上水位，空闲池永不缩容 |
| 4 | `"70%"` | `"10%"` | 4 | 可从 5 个副本缩到 4 个 |

场景一演示了百分比目标的配置方式：水位随池规模弹性伸缩，适合负载波动的业务。需要固定规模的预热池时，可改用绝对值目标并设置 `tolerance: 0`，同时让 `minReplicas` 不小于目标值。无论哪种方式，都请按上述规则核对 `minReplicas`。

如果预热池长期停留在高于 `minReplicas` 的规模且 `status.conditions` 无异常，通常是上述规则未满足：此时可调低 `targetAvailable` 或 `tolerance`，或调高 `minReplicas`，然后观察 `status.desiredReplicas` 与 `status.currentCapacity.available` 是否逐步收敛。

## 参数配置约束

创建或更新 PoolAutoscaler 时，Webhook 会校验以下规则；违反时请求被拒绝（HTTP 422）并返回具体原因。

### 通用约束

| 字段 | 约束 |
| --- | --- |
| `spec.scaleTargetRef.kind` | 仅支持 `SandboxSet`。 |
| `spec.scaleTargetRef.name` | 必填，指向同 namespace 内已存在的 SandboxSet。 |
| `spec.maxReplicas` | 必填且大于 0。 |
| `spec.minReplicas` | 大于等于 0，且不能大于 `maxReplicas`。 |
| `spec.capacityPolicy` / `spec.cronPolicies` | 至少配置一项，否则没有任何策略驱动扩缩容。 |
| 同 namespace 内唯一性 | 一个 SandboxSet 只能由一个 PoolAutoscaler 管理。 |

### 容量策略约束

| 字段 | 约束 |
| --- | --- |
| `targetAvailable` | 绝对值必须 `>= 0` 且 `<= maxReplicas`（超出则目标永远无法达到）；百分比格式为 `"<number>%"`，数值范围 0 到 100。 |
| `targetAvailable` 为百分比时 | 必须同时设置 `minReplicas >= 1`，否则空池时水位全部归 0，预热池无法自举。 |
| `tolerance` | 格式约束同 `targetAvailable`；且必须**小于** `targetAvailable`（同为百分比或同为绝对值时可静态判定），否则下水位被钳制为 0，扩容永不触发。绝对目标配百分比容差时，容差百分比必须小于 100%。 |
| `scaleUp.stabilizationWindowSeconds` | 不设置时默认 60 秒；显式设置必须在 60 到 3600 秒之间。 |
| `scaleDown.stabilizationWindowSeconds` | 不设置时默认 300 秒；显式设置必须在 60 到 3600 秒之间。 |

缩容可达性虽然不是当前版本的硬性校验，但配置不当会导致预热池无法缩至 `minReplicas`，建议按[确保空闲预热池能收缩到 minReplicas](#确保空闲预热池能收缩到-minreplicas)的规则核对。

Cron 策略的校验规则（最多 20 条、name 唯一、五段合法 Cron 表达式、合法时区、`targetReplicas >= 0`）已在下方 CRD 字段说明中标注，此处不再重复。

## CRD 字段说明

| 字段 | 说明 |
| --- | --- |
| `spec.scaleTargetRef` | 待管理的 SandboxSet 引用；`kind` 必须为 `SandboxSet`，目标与 PoolAutoscaler 必须位于同一 namespace。 |
| `spec.minReplicas` / `spec.maxReplicas` | 预热池副本下限和上限。`maxReplicas` 必须大于 0，`minReplicas` 不能大于 `maxReplicas`。容量策略需能将空闲预热池收缩到 `minReplicas`，取值约束见[容量策略参数调优指南](#容量策略参数调优指南)。 |
| `spec.capacityPolicy.targetAvailable` | 目标可用 Sandbox 数，可填绝对值或百分比，例如 `10`、`"60%"`。百分比以近期平均副本数为基准；使用百分比时必须设置 `minReplicas: 1` 或更大。取值需与 `tolerance`、`minReplicas` 共同满足缩容可达性规则，详见[容量策略参数调优指南](#容量策略参数调优指南)。 |
| `spec.capacityPolicy.tolerance` | 目标允许偏差，可填绝对值或百分比；未设置时默认为 `10%`。例如目标为 10、偏差为 2 时，低于 8 扩容、高于 12 缩容。解析方式与缩容可达性约束见[容量策略参数调优指南](#容量策略参数调优指南)。 |
| `spec.capacityPolicy.scaleUp.stabilizationWindowSeconds` | 连续扩容间隔。显式设置范围为 60 到 3600 秒，不设置时默认 60 秒。 |
| `spec.capacityPolicy.scaleDown.stabilizationWindowSeconds` | 连续缩容间隔。显式设置范围为 60 到 3600 秒，默认 300 秒。 |
| `spec.cronPolicies` | 定时策略列表，最多 20 条，Webhook 校验：`name` 必填且同一列表内唯一；`schedule` 必填且必须是合法的五段 Cron 表达式（分 时 日 月 星期）；`timeZone` 可选，设置时必须是合法时区（如 `Asia/Shanghai`）；`targetReplicas` 必须大于等于 0，超过 `maxReplicas` 时会被限制在 `maxReplicas`。 |
| `spec.suspend` | 设为 `true` 后暂停后续自动扩缩容，不会删除已有 Sandbox。恢复时设为 `false` 或删除该字段。 |
| `status.currentReplicas` | 目标 SandboxSet 最近观测到的当前副本数。 |
| `status.desiredReplicas` | PoolAutoscaler 最近计算出的期望副本数。 |
| `status.currentCapacity.available` | 最近观测到的可用 Sandbox 数量。 |
| `status.conditions` | `ScalingActive` 表示控制器是否可用，`AbleToScale` 表示是否可计算和写入目标，`ScalingLimited` 表示是否受副本边界限制。 |
| `status.appliedCronPolicies` | 每条 Cron 策略最近一次成功执行的时间。 |

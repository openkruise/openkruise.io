# 预热池管理

本文将介绍如何通过 `SandboxSet` 创建、扩缩容和升级预热池。

## 预热池的作用

预热池是一组提前创建好的 `Sandbox` 副本。当 Agent 希望获取一个 Sandbox 时，可以直接从预热池中快速获取，大大提高 Sandbox
的交付效率。

## 通过 `SandboxSet` 创建预热池

`SandboxSet` 是管理多个相同 `Sandbox` 副本的工作负载，类似于 K8s 中管理多个 `Pod` 的 `ReplicaSet`。其特点包括：

- 为高频扩缩容场景特别优化的低延迟扩容
- 作为 Sandbox 模板（见 [获取沙箱](./sandbox-claim.md)）

一个典型的 `SandboxSet` 如下：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo
  namespace: default
spec:
  # 预热池的大小，建议比预估的请求突发量略大
  replicas: 10
  # 创建的沙箱在休眠、唤醒过程中需要保留的内容
  persistentContents:
    - ip
  # Sandbox 模板，与 Sandbox CRD 一致
  template:
    # 为最终创建的 Pod 添加元数据
    metadata:
      annotations:
        foo: bar
    # 最终创建的 Pod Spec
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
```

> `SandboxSet` 的缩写为 `sbs`，你可以通过类似 `kubectl get sbs` 的命令操作该资源。

## 预热沙箱状态

`SandboxSet` 对于其预热 `Sandbox` 采用一套简化的状态模型，包含两种状态（state）：

- **creating**：沙箱正在创建中，可能是 Pod 正在创建中，也可能是 Pod 已创建但沙箱容器未完成启动。这些沙箱无法被获取。
- **available**：沙箱已就绪，随时可以被获取。

你可以通过 `status.availableReplicas` 字段查看 available 状态的沙箱数量，也可以直接通过 `kubectl get` 命令查看：

```shell
$ kubectl get sbs -n default
NAME   REPLICAS   AVAILABLE   UPDATEREVISION   AGE
demo   10         10          78dd8599cf       19m
```

## 预热池扩缩容

预热池的大小由 SandboxSet 的 `spec.replicas` 控制。由于控制器会持续将预热池的状态（沙箱的创建、删除、可用数量、版本等）写回 SandboxSet 对象，繁忙的 SandboxSet 会被频繁更新，**因此修改副本数必须通过 SandboxSet 的 `scale` 子资源进行，而不是更新整个对象**。整体更新会携带此前读取到的 `resourceVersion`，与控制器的写入相互冲突，在繁忙的 SandboxSet 上会频繁出现写冲突；而 `scale` 子资源只修改 `spec.replicas`，可以避免这些冲突。

例如，使用直接操作 `scale` 子资源的 `kubectl scale` 命令对预热池进行扩缩容：

```bash
# 将预热池扩容到 20 个沙箱
kubectl scale sbs demo --replicas=20 -n default

# 将预热池缩容到 5 个沙箱
kubectl scale sbs demo --replicas=5 -n default
```

:::caution
不要在客户端中发起整体 `Update` 来扩缩容——对于繁忙的 SandboxSet，这会导致频繁的 `409 Conflict` 错误；也不要通过 `kubectl edit` 将 `replicas` 与其他模板字段一起修改。扩缩容请始终通过 `scale` 子资源进行。如果你通过 Kubernetes 客户端（Go client、REST API 等）操作 SandboxSet，同样应当使用 `scale` 子资源，例如 controller-runtime 中的 `client.SubResource("scale").Update(...)`，而不是发起整体 `Update`。
:::

`SandboxSet` 还提供策略字段，用于控制扩容和滚动更新的节奏，从而尽量减少对集群资源和服务可用性的影响。

### `scaleStrategy.maxUnavailable`

该字段限制在 **扩容操作** 期间允许处于 **不可用** 状态（即处于 `creating` 状态）的沙箱最大数量。当你希望避免 Pod 创建突发增长对集群造成压力时，该字段非常有用。

- 可以是绝对值（如 `5`）或百分比字符串（如 `"20%"`）。
- 默认值：无限制（所有新沙箱同时创建）。

```yaml
spec:
  replicas: 20
  scaleStrategy:
    # 在扩容期间，最多允许 5 个沙箱处于 creating 状态
    maxUnavailable: 5
```

:::tip
扩容时，新创建的沙箱会按照该限制分批启动。例如，若 `maxUnavailable: 5`，从 0 扩容到 20，沙箱会以每批 5 个的方式创建——每一批只有在上一批变为 `available` 后才会开始创建。
:::

## 升级预热池沙箱

当你修改 SandboxSet 的 `spec.template` 字段时，控制器会检测到模板变更并对池中的沙箱执行 **滚动升级**。

### 工作原理

控制器会：

1. 根据更新后的模板计算出新的 `updateRevision` 哈希。
2. 按批次删除旧版本的沙箱（遵循 `maxUnavailable` 限制）。
3. 使用更新后的模板创建新的沙箱，以维持期望的副本数。

在 **扩容** 时，新创建的沙箱会使用最新的模板。在 **缩容** 时，会优先移除旧版本的沙箱。

### 配置

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: my-sandbox-pool
  namespace: default
spec:
  replicas: 10
  updateStrategy:
    # 在升级过程中允许不可用的沙箱最大数量或百分比。
    # 可以是绝对值（如 5）或百分比（如 "10%"）。
    # 默认值："20%"
    maxUnavailable: "20%"
  template:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2   # 在此处更新镜像版本
          resources:
            requests:
              cpu: "1"
              memory: "512Mi"
            limits:
              cpu: "2"
              memory: "1Gi"
```

要触发升级，只需修改 `spec.template` 下的任意字段（如容器镜像、资源、环境变量），并以 patch 的方式提交变更，见 [使用 Patch 而不是整体更新](#使用-patch-而不是整体更新)。

### `updateStrategy.maxUnavailable`

该字段控制在 **滚动更新** 期间（通过修改 `spec.template` 触发）允许处于 **不可用** 状态的沙箱最大数量或百分比。它决定了滚动更新的批次大小。

- 可以是绝对值（如 `5`）或百分比字符串（如 `"20%"`）。
- 默认值：`"20%"`。

```yaml
spec:
  replicas: 10
  updateStrategy:
    # 在滚动更新期间，最多允许 3 个沙箱不可用
    maxUnavailable: 3
```

### 使用 Patch 而不是整体更新

对 SandboxSet 的修改（例如更新 `spec.template`）**必须以 patch 的方式提交，而不是整体更新**。控制器会持续将预热池的状态（沙箱的创建、删除、可用数量、版本等）写回 SandboxSet 对象；整体 `Update` 会把整个对象连同此前读取到的 `resourceVersion` 一起提交，因此会频繁出现写冲突（`409 Conflict`），迫使客户端反复重试。而 patch 只携带发生变更的字段，不会与控制器的写入冲突。

例如，使用 `kubectl patch` 更新沙箱镜像：

```bash
kubectl patch sbs my-sandbox-pool --type merge -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"sandbox","image":"my-registry/sandbox-image:v2"}]}}}}'
```

`kubectl edit` 同理：它会计算原始对象与你编辑结果的差异，并以 patch 的方式提交，因此对繁忙的 SandboxSet 同样安全：

```bash
kubectl edit sbs my-sandbox-pool -n default
```

在编辑器中修改 `spec.template` 下的字段（如容器镜像）并保存，kubectl 会以 patch 的方式提交变更。

:::caution
不要通过整体 `Update`/`Replace` 操作来升级 SandboxSet（例如 `kubectl replace`，或代码中的整体 `Update` 调用）。对于繁忙的 SandboxSet，这会造成频繁的写冲突。
:::

### 监控进度

通过查看 SandboxSet 状态来监控滚动升级：

```bash
kubectl get sandboxset my-sandbox-pool -o wide
```

输出示例：

```
NAME              REPLICAS   AVAILABLE   UPDATEDREPLICAS   UPDATEDAVAILABLEREPLICAS   UPDATEREVISION   AGE
my-sandbox-pool   10         8           6                 5                          a1b2c3d4         30m
```

| 字段 | 说明 |
|---|---|
| `REPLICAS` | 沙箱总数（创建中 + 可用 + 运行中 + 已暂停） |
| `AVAILABLE` | 可被认领的沙箱数量 |
| `UPDATEDREPLICAS` | 已更新到最新版本的沙箱数量 |
| `UPDATEDAVAILABLEREPLICAS` | 已更新且可用的沙箱数量 |
| `UPDATEREVISION` | 当前期望模板版本的哈希值 |

当 `UPDATEDAVAILABLEREPLICAS` 等于期望的 `REPLICAS` 数量时，滚动升级即告完成。

你也可以查看单个沙箱的版本：

```bash
kubectl get sandboxes -l agents.kruise.io/sandbox-template=my-sandbox-pool -o custom-columns=\
NAME:.metadata.name,\
PHASE:.status.phase,\
REVISION:.status.updateRevision
```

## 预热沙箱的获取与补充

你可以通过多种方式从预热池中获取一个 available 状态的沙箱，参考 [获取沙箱](./sandbox-claim.md)。当一个沙箱被获取后，
`SandboxSet` 会立刻进行扩容以补充库存。`SandboxSet` 的副本数不包括已分配的沙箱。下面是一个案例：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 1: Initial State - Warm Pool Ready                                    │
│ SandboxSet: replicas=3, availableReplicas=3                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"
    +-------------------------------------+
    |  +-----------+  +-----------+       |
    |  | Sandbox-1 |  | Sandbox-2 |       |
    |  | available |  | available |       |
    |  +-----------+  +-----------+       |
    |                                     |
    |       +-----------+                 |
    |       | Sandbox-3 |                 |
    |       | available |                 |
    |       +-----------+                 |
    +-------------------------------------+


                        |
                        | Agent claims a Sandbox
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Sandbox Claimed - Scale-up Triggered                               │
│ SandboxSet: replicas=2, availableReplicas=2                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |--->|  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |  [!] Replicas shortage detected |
    |      Starting scale-up...       |
    +---------------------------------+


                        |
                        | SandboxSet auto-scales
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 3: Creating New Sandbox - Restoring Replicas                          │
│ SandboxSet: replicas=3, availableReplicas=2                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |    |  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |  . . . . . . . .                |
    |  . Sandbox-4   . [Pod Starting] |
    |  . creating    .                |
    |  . . . . . . . .                |
    +---------------------------------+


                        |
                        | New Sandbox ready
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 4: Warm Pool Restored - Back to Initial State                         │
│ SandboxSet: replicas=3, availableReplicas=3                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |    |  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |       +-----------+             |
    |       | Sandbox-4 |  [Ready]    |
    |       | available |             |
    |       +-----------+             |
    |                                 |
    |  [OK] Pool replenished          |
    |       Ready for next claim      |
    +---------------------------------+
```
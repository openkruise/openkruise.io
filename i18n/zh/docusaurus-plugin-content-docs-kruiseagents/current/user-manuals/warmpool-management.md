# 预热池管理

本文将介绍如何通过 `SandboxSet` 创建预热池。

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

## 扩容与更新策略

`SandboxSet` 提供两个策略字段，用于控制扩容和滚动更新的节奏，从而尽量减少对集群资源和服务可用性的影响。

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

关于滚动更新工作原理的详细说明，包括监控进度和故障排查，请参考 [升级预热池沙箱（SandboxSet）](./sandbox-update.md#升级预热池沙箱sandboxset)。

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
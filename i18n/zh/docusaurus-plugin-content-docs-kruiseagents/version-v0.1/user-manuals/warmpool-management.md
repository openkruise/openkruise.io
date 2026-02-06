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
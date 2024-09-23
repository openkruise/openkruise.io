---
title: Advanced StatefulSet
---

这个控制器基于原生 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) 上增强了发布能力，比如 maxUnavailable 并行发布、原地升级等。

如果你对原生 StatefulSet 不是很了解，我们强烈建议你先阅读它的文档（在学习 Advanced StatefulSet 之前）：
- [Concept of Kubernetes StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Deploying a stateful application](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/)

注意 `Advanced StatefulSet` 是一个 CRD，kind 名字也是 `StatefulSet`，但是 apiVersion 是 `apps.kruise.io/v1beta1`。
这个 CRD 的所有默认字段、默认行为与原生 StatefulSet 完全一致，除此之外还提供了一些 optional 字段来扩展增强的策略。

因此，用户从原生 `StatefulSet` 迁移到 `Advanced StatefulSet`，只需要把 `apiVersion` 修改后提交即可：

```yaml
-  apiVersion: apps/v1
+  apiVersion: apps.kruise.io/v1beta1
  kind: StatefulSet
  metadata:
    name: sample
  spec:
  #...
```

注意从 Kruise 0.7.0 开始，Advanced StatefulSet 版本升级到了 `v1beta1`，并与 `v1alpha1` 兼容。对于低于 v0.7.0 版本的 Kruise，只能使用 `v1alpha1`。

## Pod 标识
StatefulSet Pod 具有唯一的标识，该标识包括顺序标识、稳定的网络标识和稳定的存储。 该标识和 Pod 是绑定的，与该 Pod 调度到哪个节点上无关。

### 序号索引
**FEATURE STATE:** Kruise v1.7.0

对于具有 N 个副本的 StatefulSet，该 StatefulSet 中的每个 Pod 将被分配一个整数序号，该序号在此 StatefulSet 中是唯一的。
默认情况下，这些 Pod 将被赋予从 0 到 N-1 的序号。StatefulSet 控制器也会添加一个包含此索引的 Pod 标签：**apps.kubernetes.io/pod-index**，如下：
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: sample
    apps.kubernetes.io/pod-index: "0"
  name: sample-0
```

### 起始序号
**FEATURE STATE:** Kruise v1.7.0

Pod 起始序号默认都是从 0 开始的，此外，你也可以通过设置 **.spec.ordinals.start** 字段来设置 Pod 起始序号。使用该能力，你需要开启 FeatureGate **StatefulSetStartOrdinal=true**。

- spec.ordinals.start：如果 .spec.ordinals.start 字段被设置，则 Pod 将被分配从 .spec.ordinals.start 到 .spec.ordinals.start + .spec.replicas - 1 的序号。
  比如：replicas=5、ordinals.start=3，Pod 序号 = [3, 7]。

```
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
metadata:
  name: sample
spec:
  replicas: 5
  ordinals:
    start: 3
  serviceName: fake-service
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - name: main
        image: nginx:alpine
```

#### User Stories

起始序号能力主要是为了使 StatefulSet 更加灵活，基于该能力有状态应用可以自动化的方式在 Kubernetes 集群间迁移。如下：

##### Story 1

**Migrating across namespaces**: 许多公司使用命名空间进行隔离，考虑到用户正在将 StatefulSet 迁移到集群中的新命名空间。
迁移的原因可能是组织架构变动，也可能是要求迁出共享命名空间。如下，有 **replicas：5** 在共享命名空间中运行：

```
name: my-app
namespace: shared
replicas: 5
-----------------------------------------------
[ nginx-0, nginx-1, nginx-2, nginx-3, nginx-4 ]
```

为了迁移两个pod，可将共享命名空间中的 `my-app` StatefulSet 缩减为 **replicas: 3, ordinals.start: 0**，`app-team`命名空间中的 StatefulSet 可调整为为 **replicas: 2, ordinals.start: 3** ，如下：

```
name: my-app						name: my-app
namespace: shared					namespace: app-team
replicas: 3						    replicas: 2
ordinals.start: 0				    ordinals.start: 3
------------------------------		---------------------
[ nginx-0, nginx-1, nginx-2 ]		[ nginx-3, nginx-4 ]
```

##### Story 2

**Migrating across clusters**: 由于容量限制、基础设施限制或为了更好地隔离应用程序，采用多集群的方式可能需要在集群间移动工作负载。

##### Story 3

**Non-Zero Based Indexing:** 用户可能希望从序号 “1 ”而不是序号 “0 ” 开始对其 StatefulSet 进行编号。使用 ”1 “ 的编号可能更容易推理和概念化（例如：序号 ”k “ 是第 ”k “ 个副本，而不是第 ”k+1 “ 个副本）。

## 扩缩容功能

### PersistentVolumeClaim 保留

**FEATURE STATE:** Kruise v1.1.0

如果你在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用了 `StatefulSetAutoDeletePVC` feature-gate，
你可以使用 `.spec.persistentVolumeClaimRetentionPolicy` 字段来控制在StatefulSet生命周期中是否以及何时删除它所创建的PVC。

这个功能与上游 StatefulSet (K8s >= 1.23 [alpha]) 提供的相同，可以参考[上游文档](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)。

### 流式扩容

**FEATURE STATE:** Kruise v0.10.0

为了避免在一个新 Advanced StatefulSet 创建后有大量失败的 pod 被创建出来，从 Kruise `v0.10.0` 版本开始引入了在 scale strategy 中的 `maxUnavailable` 策略。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  replicas: 100
  scaleStrategy:
    maxUnavailable: 10% # percentage or absolute number
```

当这个字段被设置之后，Advanced StatefulSet 会保证创建 pod 之后不可用 pod 数量不超过这个限制值。

比如说，上面这个 StatefulSet 一开始只会一次性创建 10 个 pod。在此之后，每当一个 pod 变为 running、ready 状态后，才会再创建一个新 pod 出来。

注意，这个功能只允许在 podManagementPolicy 是 `Parallel` 的 StatefulSet 中使用。

### 序号保留（跳过）

从 Advanced StatefulSet 的 v1beta1 版本开始（Kruise >= v0.7.0），支持序号保留功能。

通过在 `reserveOrdinals` 字段中写入需要保留的序号，Advanced StatefulSet 会自动跳过创建这些序号的 Pod。如果 Pod 已经存在，则会被删除。
注意，`spec.replicas` 是期望运行的 Pod 数量，`spec.reserveOrdinals` 是要跳过的序号。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  replicas: 4
  reserveOrdinals:
  - 1
```

对于一个 `replicas=4, reserveOrdinals=[1]` 的 Advanced StatefulSet，实际运行的 Pod 序号为 `[0,2,3,4]`。

- 如果要把 Pod-3 做迁移并保留序号，则把 `3` 追加到 `reserveOrdinals` 列表中。控制器会把 Pod-3 删除并创建 Pod-5（此时运行中 Pod 为 `[0,2,4,5]`）。
- 如果只想删除 Pod-3，则把 `3` 追加到 `reserveOrdinals` 列表并同时把 `replicas` 减一修改为 `3`。控制器会把 Pod-3 删除（此时运行中 Pod 为 `[0,2,4]`）。

### 指定 Pod 删除

**FEATURE STATE:** Kruise v1.5.5, Kruise v1.6.4, Kruise v1.7.2+

相比于手动直接删除 Pod，使用 `apps.kruise.io/specified-delete: true` 指定 Pod 删除方式会有 Advanced StatefulSet 的 `maxUnavailable` 来保护删除， 并且会触发 `PreparingDelete` 生命周期 hook （见下文）。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # ...
    apps.kruise.io/specified-delete: true
spec:
  containers:
  - name: main
  # ...
```

当控制器收到上面这个 Pod 更新之后，会优先处理存在指定删除标签的 pod 的删除流程，并保证不突破 `maxUnavailable` 的限制。

## 升级功能

### 原地升级

Advanced StatefulSet 增加了 `podUpdatePolicy` 来允许用户指定重建升级还是原地升级。

- `ReCreate`: 控制器会删除旧 Pod 和它的 PVC，然后用新版本重新创建出来。
- `InPlaceIfPossible`: 控制器会优先尝试原地升级 Pod，如果不行再采用重建升级。具体参考下方阅读文档。
- `InPlaceOnly`: 控制器只允许采用原地升级。因此，用户只能修改上一条中的限制字段，如果尝试修改其他字段会被 Kruise 拒绝。

**请阅读[该文档](../core-concepts/inplace-update)了解更多原地升级的细节。**

我们还在原地升级中提供了 **graceful period** 选项，作为优雅原地升级的策略。用户如果配置了 `gracePeriodSeconds` 这个字段，控制器在原地升级的过程中会先把 Pod status 改为 not-ready，然后等一段时间（`gracePeriodSeconds`），最后再去修改 Pod spec 中的镜像版本。
这样，就为 endpoints-controller 这些控制器留出了充足的时间来将 Pod 从 endpoints 端点列表中去除。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  podManagementPolicy: Parallel
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      inPlaceUpdateStrategy:
        gracePeriodSeconds: 10
```

**更重要的是**，如果使用 `InPlaceIfPossible` 或 `InPlaceOnly` 策略，必须要增加一个 `InPlaceUpdateReady` readinessGate，用来在原地升级的时候控制器将 Pod 设置为 NotReady。

一个完整的原地升级 StatefulSet 例子如下：

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
metadata:
  name: sample
spec:
  replicas: 3
  serviceName: fake-service
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      readinessGates:
         # A new condition that ensures the pod remains at NotReady state while the in-place update is happening
      - conditionType: InPlaceUpdateReady
      containers:
      - name: main
        image: nginx:alpine
  podManagementPolicy: Parallel # allow parallel updates, works together with maxUnavailable
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      # Do in-place update if possible, currently only image update is supported for in-place update
      podUpdatePolicy: InPlaceIfPossible
      # Allow parallel updates with max number of unavailable instances equals to 2
      maxUnavailable: 2
```

### 原地升级自动预热

**FEATURE STATE:** Kruise v0.10.0

如果你在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用了 `PreDownloadImageForInPlaceUpdate` feature-gate，
Advanced StatefulSet 控制器会自动在所有旧版本 pod 所在 node 节点上预热你正在灰度发布的新版本镜像。 这对于应用发布加速很有帮助。

默认情况下 Advanced StatefulSet 每个新镜像预热时的并发度都是 `1`，也就是一个个节点拉镜像。
如果需要调整，你可以通过 `apps.kruise.io/image-predownload-parallelism` annotation 来设置并发度。

另外从 Kruise v1.1.0 开始，你可以使用 `apps.kruise.io/image-predownload-min-updated-ready-pods` 来控制在少量新版本 Pod 已经升级成功之后再执行镜像预热。它的值可能是绝对值数字或是百分比。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "10"
    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"
```

注意，为了避免大部分不必要的镜像拉取，目前只针对 replicas > 3 的 Advanced StatefulSet 做自动预热。

### 升级顺序

Advanced StatefulSet 在 `spec.updateStrategy.rollingUpdate` 下面新增了 `unorderedUpdate` 结构，提供给不按 order 顺序的升级策略。
如果 `unorderedUpdate` 不为空，所有 Pod 的发布顺序就不一定会按照 order 顺序了。注意，`unorderedUpdate` 只能配合 Parallel podManagementPolicy 使用。

目前，`unorderedUpdate` 下面只包含 `priorityStrategy` 一个优先级策略。

#### 优先级策略

这个策略定义了控制器计算 Pod 发布优先级的规则，所有需要更新的 Pod 都会通过这个优先级规则计算后排序。
目前 `priority` 可以通过 weight(权重) 和 order(序号) 两种方式来指定。

- `weight`: Pod 优先级是由所有 weights 列表中的 term 来计算 match selector 得出。如下：

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      unorderedUpdate:
        priorityStrategy:
          weightPriority:
          - weight: 50
            matchSelector:
              matchLabels:
                test-key: foo
          - weight: 30
            matchSelector:
              matchLabels:
                test-key: bar
```

- `order`: Pod 优先级是由 orderKey 的 value 决定，这里要求对应的 value 的结尾能解析为 int 值。比如 value "5" 的优先级是 5，value "sts-10" 的优先级是 10。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      unorderedUpdate:
        priorityStrategy:
          orderPriority:
          - orderedKey: some-label-key
```

### MaxUnavailable 最大不可用

Advanced StatefulSet 在 `RollingUpdateStatefulSetStrategy` 中新增了 `maxUnavailable` 策略来支持并行 Pod 发布，它会保证发布过程中最多有多少个 Pod 处于不可用状态。注意，`maxUnavailable` 只能配合 podManagementPolicy 为 `Parallel` 来使用。

这个策略的效果和 `Deployment` 中的类似，但是可能会导致发布过程中的 order 顺序不能严格保证。
如果不配置 `maxUnavailable`，它的默认值为 1，也就是和原生 `StatefulSet` 一样只能 one by one 串行发布 Pod，即使把 podManagementPolicy 配置为 `Parallel` 也是这样。

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  podManagementPolicy: Parallel
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 20%
```

比如说，一个 Advanced StatefulSet 下面有 P0 到 P4 五个 Pod，并且应用能容忍 3 个副本不可用。
当我们把 StatefulSet 里的 Pod 升级版本的时候，可以通过以下步骤来做：

1. 设置 `maxUnavailable=3`
2. (可选) 如果需要灰度升级，设置 `partition=4`。Partition 默认的意思是 order 大于等于这个数值的 Pod 才会更新，在这里就只会更新 P4，即使我们设置了 `maxUnavailable=3`。
3. 在 P4 升级完成后，把 `partition` 调整为 0。此时，控制器会同时升级 P1、P2、P3 三个 Pod。注意，如果是原生 `StatefulSet`，只能串行升级 P3、P2、P1。
4. 一旦这三个 Pod 中有一个升级完成了，控制器会立即开始升级 P0。

### 发布暂停

用户可以通过设置 paused 为 true 暂停发布，不过控制器还是会做 replicas 数量管理：

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      paused: true
```


## 生命周期钩子

**FEATURE STATE:** Kruise v0.8.0

与 [CloneSet 提供的生命周期钩子](./cloneset#lifecycle-hook) 能力相似。

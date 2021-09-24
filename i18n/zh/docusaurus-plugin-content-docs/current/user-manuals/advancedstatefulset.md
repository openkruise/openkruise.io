---
title: Advanced StatefulSet
---

这个控制器基于原生 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) 上增强了发布能力，比如 maxUnavailable 并行发布、原地升级等。

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

## MaxUnavailable 最大不可用

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

## 原地升级

Advanced StatefulSet 增加了 `podUpdatePolicy` 来允许用户指定重建升级还是原地升级。

- `ReCreate`: 控制器会删除旧 Pod 和它的 PVC，然后用新版本重新创建出来。
- `InPlaceIfPossible`: 控制器会优先尝试原地升级 Pod，如果不行再采用重建升级。目前，只有修改 `spec.template.metadata.*` 和 `spec.template.spec.containers[x].image` 这些字段才可以走原地升级。
- `InPlaceOnly`: 控制器只允许采用原地升级。因此，用户只能修改上一条中的限制字段，如果尝试修改其他字段会被 Kruise 拒绝。

当一个 Pod 被原地升级时，控制器会先把 Pod status 中修改为 not-ready 状态，然后再更新 Pod spec 中的 image 字段来触发 Kubelet 重建对应的容器。
不过这样可能存在的一个风险：有时候 Kubelet 重建容器太快，还没等到其他控制器如 endpoints-controller 感知到 Pod not-ready，可能会导致流量受损。

因此我们又在原地升级中提供了 **graceful period** 选项，作为优雅原地升级的策略。用户如果配置了 `gracePeriodSeconds` 这个字段，控制器在原地升级的过程中会先把 Pod status 改为 not-ready，然后等一段时间（`gracePeriodSeconds`），最后再去修改 Pod spec 中的镜像版本。
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

## 升级顺序

Advanced StatefulSet 在 `spec.updateStrategy.rollingUpdate` 下面新增了 `unorderedUpdate` 结构，提供给不按 order 顺序的升级策略。
如果 `unorderedUpdate` 不为空，所有 Pod 的发布顺序就不一定会按照 order 顺序了。注意，`unorderedUpdate` 只能配合 Parallel podManagementPolicy 使用。

目前，`unorderedUpdate` 下面只包含 `priorityStrategy` 一个优先级策略。

### 优先级策略

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

## 发布暂停

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

## 原地升级自动预热

**FEATURE STATE:** Kruise v0.10.0

如果你在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用了 `PreDownloadImageForInPlaceUpdate` feature-gate，
Advanced StatefulSet 控制器会自动在所有旧版本 pod 所在 node 节点上预热你正在灰度发布的新版本镜像。 这对于应用发布加速很有帮助。

默认情况下 Advanced StatefulSet 每个新镜像预热时的并发度都是 `1`，也就是一个个节点拉镜像。
如果需要调整，你可以在 annotation 上设置并发度：

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "5"
```

注意，为了避免大部分不必要的镜像拉取，目前只针对 replicas > 3 的 Advanced StatefulSet 做自动预热。

## 序号保留（跳过）

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

## 流式扩容

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

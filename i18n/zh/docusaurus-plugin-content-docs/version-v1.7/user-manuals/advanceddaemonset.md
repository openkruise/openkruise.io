---
title: Advanced DaemonSet
---

这个控制器基于原生 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 上增强了发布能力，比如 灰度分批、按 Node label 选择、暂停、热升级等。

如果你对原生 DaemonSet 不是很了解，我们强烈建议你先阅读它的文档（在学习 Advanced DaemonSet 之前）：
- [Concept of Kubernetes DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
- [Perform a Rolling Update on a DaemonSet](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/)
- [Perform a Rollback on a DaemonSet](https://kubernetes.io/docs/tasks/manage-daemon/rollback-daemon-set/)

注意 `Advanced DaemonSet` 是一个 CRD，kind 名字也是 `DaemonSet`，但是 apiVersion 是 `apps.kruise.io/v1alpha1`。
这个 CRD 的所有默认字段、默认行为与原生 DaemonSet 完全一致，除此之外还提供了一些 optional 字段来扩展增强的策略。

因此，用户从原生 `DaemonSet` 迁移到 `Advanced DaemonSet`，只需要把 `apiVersion` 修改后提交即可：

```yaml
-  apiVersion: apps/v1
+  apiVersion: apps.kruise.io/v1alpha1
   kind: DaemonSet
   metadata:
     name: sample-ds
   spec:
     #...
```

## 增强策略

在 RollingUpdateDaemonSet 中我们新增了以下字段：

```go
const (
+    // StandardRollingUpdateType replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.
+    // this is the default type for RollingUpdate.
+    StandardRollingUpdateType RollingUpdateType = "Standard"

+    // InplaceRollingUpdateType update container image without killing the pod if possible.
+    InplaceRollingUpdateType RollingUpdateType = "InPlaceIfPossible"
)

// Spec to control the desired behavior of daemon set rolling update.
type RollingUpdateDaemonSet struct {
+    // Type is to specify which kind of rollingUpdate.
+    Type RollingUpdateType `json:"rollingUpdateType,omitempty" protobuf:"bytes,1,opt,name=rollingUpdateType"`

    // ...
    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty" protobuf:"bytes,2,opt,name=maxUnavailable"`

    // ...
    MaxSurge *intstr.IntOrString `json:"maxSurge,omitempty" protobuf:"bytes,7,opt,name=maxSurge"`

+    // A label query over nodes that are managed by the daemon set RollingUpdate.
+    // Must match in order to be controlled.
+    // It must match the node's labels.
+    Selector *metav1.LabelSelector `json:"selector,omitempty" protobuf:"bytes,3,opt,name=selector"`

+    // The number of DaemonSet pods remained to be old version.
+    // Default value is 0.
+    // Maximum value is status.DesiredNumberScheduled, which means no pod will be updated.
+    // +optional
+    Partition *int32 `json:"partition,omitempty" protobuf:"varint,4,opt,name=partition"`

+    // Indicates that the daemon set is paused and will not be processed by the
+    // daemon set controller.
+    // +optional
+    Paused *bool `json:"paused,omitempty" protobuf:"varint,5,opt,name=paused"`
}
```

### 升级方式

Advanced DaemonSet 在 `spec.updateStrategy.rollingUpdate` 中有一个 `rollingUpdateType` 字段，标识了如何进行滚动升级：

- `Standard`: 对于每个 node，控制器会先删除旧的 daemon Pod，再创建一个新 Pod，和原生 DaemonSet 行为一致。
- `Surging`: 对于每个 node，控制器会先创建一个新 Pod，等它 ready 之后再删除老 Pod。

- `Standard` (默认): 控制器会重建升级 Pod，与原生 DaemonSet 行为一致。你可以通过 `maxUnavailable` 或 `maxSurge` 来控制重建新旧 Pod 的顺序。
- `InPlaceIfPossible`: 控制器会尽量采用原地升级的方式，如果不行则重建升级。请阅读[该文档](../core-concepts/inplace-update)了解更多原地升级的细节。
  注意，在这个类型下，只能使用 `maxUnavailable` 而不能用 `maxSurge`。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      rollingUpdateType: Standard
```

### Selector 标签选择升级

这个策略支持用户通过配置 node 标签的 selector，来指定灰度升级某些特定类型 node 上的 Pod。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      selector:
        matchLabels:
          nodeType: canary
```

### 分批灰度升级或扩容

Partition 的语义是 **保留旧版本 Pod 的数量**，默认为 `0`。
如果在发布过程中设置了 `partition`，则控制器只会将 `(status.DesiredNumberScheduled - partition)` 数量的 Pod 更新到最新版本。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 10
```

另外如果你在 Advanced DaemonSet 中定义了 `daemonset.kruise.io/progressive-create-pod: "true"` annotation，
`partition` 同样会在扩容的时候控制创建出来 Pod 的数量。

<!--
### 热升级

MaxSurge 是 DaemonSet pods 最大扩出来超过预期的数量，只有在 `rollingUpdateType=Surging` 的时候会生效。

MaxSurge 可以设置为绝对值或者一个百分比，控制器针对百分比会基于 status.desiredNumberScheduled 做计算并向上取整，默认值为 1。

比如当设置为 30% 时，最多有总数的 30% 的 node 上会同时有 2 个 Pod 在运行。
当新 Pod 变为 available 之后控制器会下线老 Pod，然后开始更新下一个 node，在整个过程中所有正常 Pod 数量不会超过总 node 数量的 130%。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      rollingUpdateType: Surging
      maxSurge: 30%
``` -->

### 暂停升级

用户可以通过设置 paused 为 true 暂停发布，不过控制器还是会做 replicas 数量管理：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      paused: true
```

### 升级镜像自动预热

**FEATURE STATE:** Kruise v1.3.0

如果你在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用了 `PreDownloadImageForDaemonSetUpdate` feature-gate，
DaemonSet 控制器会自动在所有旧版本 pod 所在 node 节点上预热你正在灰度发布的新版本镜像。 这对于应用发布加速很有帮助。

默认情况下 DaemonSet 每个新镜像预热时的并发度都是 `1`，也就是一个个节点拉镜像。
如果需要调整，你可以通过 `apps.kruise.io/image-predownload-parallelism` annotation 来设置并发度。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "10"
```

### 生命周期钩子

**FEATURE STATE:** Kruise v1.1.0

与 [CloneSet 提供的生命周期钩子](./cloneset#lifecycle-hook) 能力相似。

目前 Advanced DaemonSet 只支持 PreDelete hook，它允许用户在 daemon Pod 被删除前执行一些自定义的逻辑。

```go
type LifecycleStateType string

// Lifecycle contains the hooks for Pod lifecycle.
type Lifecycle struct {
    // PreDelete is the hook before Pod to be deleted.
    PreDelete *LifecycleHook `json:"preDelete,omitempty"`
}

type LifecycleHook struct {
    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`
    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`

    /**********************  FEATURE STATE: 1.2.0 ************************/
    // MarkPodNotReady = true means:
    // - Pod will be set to 'NotReady' at preparingDelete/preparingUpdate state.
    // - Pod will be restored to 'Ready' at Updated state if it was set to 'NotReady' at preparingUpdate state.
    // Default to false.
    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`
    /*********************************************************************/
}
```

例如:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:

  # define with label
  lifecycle:
    preDelete:
      labelsHandler:
        example.io/block-deleting: "true"
```

当 DaemonSet 删除一个 Pod 时（包括缩容和重建升级）：
- 如果没有定义 lifecycle hook 或者 Pod 不符合 preDelete 条件，则直接删除
- 否则，会先将 Pod 更新为 `PreparingDelete` 状态，并等待用户的 controller 将 Pod 中关联的 label/finalizer 去除，再执行 Pod 删除

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    example.io/block-deleting: "true"                   # the pod is hooked by PreDelete hook label
    lifecycle.apps.kruise.io/state: PreparingDelete     # so we update it to `PreparingDelete` state and wait for user controller to do something and remove the label
```

#### 删除 Pod 前将其置为 NotReady
**FEATURE STATE:** Kruise v1.2.0

```yaml
  lifecycle:
    preDelete:
      markPodNotReady: true
      finalizersHandler:
      - example.io/unready-blocker
```
如果设置 `preDelete.markPodNotReady=true`, Kruise 将会在 Pod 进入 `PreparingDelete` 状态时，将 `KruisePodReady` 这个 Pod Condition 设置为 `False`, Pod 将变为 **NotReady**。

**用户可以利用这一特性，在容器真正被停止之前将 Pod 上的流量先行排除，防止流量损失。**

*注意: 该特性仅在 Pod 被注入 `KruisePodReady` 这个 ReadinessGate 时生效。*

#### 用户 controller 逻辑示例

与上述 yaml 例子类似，我们需要先将 `example.io/block-deleting` label 定义在 Advanced DaemonSet 的 template 和 lifecycle 中。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  template:
    metadata:
      labels:
        example.io/block-deleting: "true"
  # ...
  lifecycle:
    preDelete:
      labelsHandler:
        example.io/block-deleting: "true"
```

用户自定义 controller 的执行逻辑:

- 当发现 Pod 进入 `PreparingDelete` 状态，检查它的节点是否存在，并执行一些处理逻辑（例如资源预留等），最后将 Pod 中的 `example.io/block-deleting` label 去掉。

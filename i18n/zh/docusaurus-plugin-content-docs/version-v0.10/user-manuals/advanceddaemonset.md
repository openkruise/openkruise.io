---
title: Advanced DaemonSet
---

这个控制器基于原生 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 上增强了发布能力，比如 灰度分批、按 Node label 选择、暂停、热升级等。

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

+    // SurgingRollingUpdateType replaces the old daemons by new ones using rolling update i.e replace them on each node one
+    // after the other, creating the new pod and then killing the old one.
+    SurgingRollingUpdateType RollingUpdateType = "Surging"
)

// Spec to control the desired behavior of daemon set rolling update.
type RollingUpdateDaemonSet struct {
+    // Type is to specify which kind of rollingUpdate.
+    Type RollingUpdateType `json:"rollingUpdateType,omitempty" protobuf:"bytes,1,opt,name=rollingUpdateType"`

    // ...
    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty" protobuf:"bytes,2,opt,name=maxUnavailable"`

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

+    // ...
+    MaxSurge *intstr.IntOrString `json:"maxSurge,omitempty" protobuf:"bytes,7,opt,name=maxSurge"`
}
```

### 升级方式

Advanced DaemonSet 在 `spec.updateStrategy.rollingUpdate` 中有一个 `rollingUpdateType` 字段，标识了如何进行滚动升级：

- `Standard`: 对于每个 node，控制器会先删除旧的 daemon Pod，再创建一个新 Pod，和原生 DaemonSet 行为一致。
- `Surging`: 对于每个 node，控制器会先创建一个新 Pod，等它 ready 之后再删除老 Pod。

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

### 分批灰度升级

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
```

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

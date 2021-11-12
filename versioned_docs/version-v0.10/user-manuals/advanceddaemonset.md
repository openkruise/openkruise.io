---
title: Advanced DaemonSet
---

This controller enhances the rolling update workflow of default [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
controller from aspects, such as partition, selector, pause and surging strategies.

Note that Advanced DaemonSet extends the same CRD schema of default DaemonSet with newly added fields.
The CRD kind name is still `DaemonSet`.
This is done on purpose so that user can easily migrate workload to the Advanced DaemonSet from the
default DaemonSet. For example, one may simply replace the value of `apiVersion` in the DaemonSet yaml
file from `apps/v1` to `apps.kruise.io/v1alpha1` after installing Kruise manager.

```yaml
-  apiVersion: apps/v1
+  apiVersion: apps.kruise.io/v1alpha1
   kind: DaemonSet
   metadata:
     name: sample-ds
   spec:
     #...
```

## Enhanced strategies

These new fields have been added into RollingUpdateDaemonSet:

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

### Type for rolling update

Advanced DaemonSet has a `rollingUpdateType` field in `spec.updateStrategy.rollingUpdate`
which controls the way to rolling update.

- `Standard`: controller will replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.
  It is the same behavior as default DaemonSet.
- `Surging`: controller will replace the old daemons by new ones using rolling update i.e replace them on each node one
  after the other, creating the new pod and then killing the old one.

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

### Selector for rolling update

It helps users to update Pods on specific nodes whose labels could be matched with the selector.

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

### Partition for rolling update

This strategy defines rules for calculating the priority of updating pods.
Partition is the number of DaemonSet pods that should be remained to be old version.

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

### MaxSurge for rolling update

MaxSurge is the maximum number of DaemonSet pods that can be scheduled above the desired number of pods during the update.
Only when `rollingUpdateType=Surging`, it works.

Value can be an absolute number (ex: 5) or a percentage of the total number of DaemonSet pods at the start of the update (ex: 10%).
The absolute number is calculated from the percentage by rounding up. This cannot be 0. The default value is 1.

Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have 2 pods running at any given time.
The update starts by starting replacements for at most 30% of those DaemonSet pods.
Once the new pods are available it then stops the existing pods before proceeding onto other DaemonSet pods,
thus ensuring that at most 130% of the desired final number of DaemonSet pods are running at all times during the update.

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

### Paused for rolling update

`paused` indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      paused: true
```

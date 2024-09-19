---
title: Advanced DaemonSet
---

This controller enhances the rolling update workflow of Kubernetes [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
controller in large-scale scenarios, such as support for image pre-download, in-place upgrade, etc.

If you don't know much about the Kubernetes DaemonSet, we strongly recommend you read its documents before learning Advanced DaemonSet.
- [Concept of Kubernetes DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
- [Perform a Rolling Update on a DaemonSet](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/)
- [Perform a Rollback on a DaemonSet](https://kubernetes.io/docs/tasks/manage-daemon/rollback-daemon-set/)

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

### Type for rolling update

Advanced DaemonSet has a `rollingUpdateType` field in `spec.updateStrategy.rollingUpdate`
which controls the way to rolling update.

- `Standard` (default): controller will update daemon Pods by recreating them. It is the same behavior as upstream DaemonSet.
  You can use `maxUnavailable` or `maxSurge` to control order of recreating old and new pods.
- `InPlaceIfPossible`: controller will try to in-place update Pod instead of recreating them if possible.
  You may need to read the [concept doc](../core-concepts/inplace-update) for more details of in-place update.
  Note that in this type, you can only use `maxUnavailable` without `maxSurge`.

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

### Partition for rolling update and scaling up

This strategy defines rules for calculating the priority of updating pods.
**Partition is the number of DaemonSet pods that should be remained to be old version.**

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

And if you put `daemonset.kruise.io/progressive-create-pod: "true"` annotation into Advanced DaemonSet,
the `partition` will also control the number of pods to be created when scaling up.

<!--
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
``` -->

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

### In-Place Update Support for Modifying Resources

**FEATURE STATE:** Kruise v1.8.0

If you have enabled `InPlaceWorkloadVerticalScaling` during [Kruise installation or upgrade](../installation##optional-feature-gate),
Advanced DaemonSet supports modifying container resources (CPU/Memory) during in-place updates.
This feature allows users to directly update the following fields without triggering Pod recreation:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
spec:
  #...
  template:
    spec:
      containers:
      - name: <container-name>
        resources:
          requests:
            cpu: "2"       # Can be modified
            memory: "2Gi"  # Can be modified
          limits:
            cpu: "4"       # Can be modified
            memory: "4Gi"  # Can be modified
```
#### Notes

1. This feature requires the Kubernetes cluster to have the `InPlacePodVerticalScaling` feature-gate enabled. Ensure your cluster supports this capability. For more information, refer to the [Kubernetes documentation](https://kubernetes.io/zh-cn/blog/2023/05/12/in-place-pod-resize-alpha/).

2. **Cgroupv1 Limitations**:
- In a Cgroupv1 environment, **modifying both image and resource fields simultaneously is prohibited** (e.g., updating both the image and CPU quota at the same time). The operation must be performed in two steps:
  1. First, complete the in-place update for resource modifications.
  2. Then, trigger an in-place update for image changes.
- For more details, see the community [Issue #127356](https://github.com/kubernetes/kubernetes/issues/127356).

3. **Resource Type Restrictions**:
- Only modifications to `cpu` and `memory` fields within `requests` and `limits` are supported.
- Other resource types (e.g., GPU) will trigger Pod recreation.
- Modifications to resources must not alter the Pod's QoS. If the Pod's QoS changes, it will trigger Pod recreation.


### Pre-download image for update

**FEATURE STATE:** Kruise v1.3.0

If you have enabled the `PreDownloadImageForDaemonSetUpdate` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate),
DaemonSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.
It is quite useful to accelerate the progress of applications upgrade.

The parallelism of each new image pre-downloading by DaemonSet is `1`, which means the image is downloaded on nodes one by one.
You can change the parallelism using `apps.kruise.io/image-predownload-parallelism` annotation on DaemonSet according to the capability of image registry,
for registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: DaemonSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "10"
```

### Lifecycle hook

**FEATURE STATE:** Kruise v1.1.0

This is similar to [Lifecycle hook of CloneSet](./cloneset#lifecycle-hook).

Now Advanced DaemonSet only supports PreDelete hook,
which means it allows users to do something (for example check node resources) before Pod deleting.

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

Examples:

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

- When Advanced DaemonSet delete a Pod (including scale in and recreate update):
  - Delete it directly if no lifecycle hook definition or Pod not matched preDelete hook
  - Otherwise, Advanced DaemonSet will firstly update Pod to `PreparingDelete` state and wait for user controller to remove the label/finalizer and Pod not matched preDelete hook

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    example.io/block-deleting: "true"                   # the pod is hooked by PreDelete hook label
    lifecycle.apps.kruise.io/state: PreparingDelete     # so we update it to `PreparingDelete` state and wait for user controller to do something and remove the label
```

#### MarkPodNotReady
**FEATURE STATE:** Kruise v1.2.0

```yaml
  lifecycle:
    preDelete:
      markPodNotReady: true
      finalizersHandler:
      - example.io/unready-blocker
```
If you set `markPodNotReady=true` for `preDelete`, Kruise will try to set `KruisePodReady` condition to `False` when Pods enter `PreparingDelete` lifecycle state, and Pods will be **NotReady**, but containers still `Running`.

**One can use this `markPodNotReady` feature to drain service traffic before terminating containers.**

*Note: this feature only works when pod has `KruisePodReady` ReadinessGate.*

#### Example for user controller logic

Same as yaml example above, we should firstly define `example.io/block-deleting` label in template and lifecycle of Advanced DaemonSet.

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

User controller logic:

- For Pod in `PreparingDelete`, check if its Node existing, do something (for example reserve resources) and then remove the label.

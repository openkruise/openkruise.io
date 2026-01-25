---
title: CloneSet
---

This controller provides advanced features to efficiently manage stateless applications in large-scale scenarios that
do not have instance order requirement during scaling and rollout.
Analogously, CloneSet can be recognized as an enhanced version of upstream `Deployment` workload, but it does many more.

As name suggests, CloneSet is a [**Set** -suffix controller](/blog/workload-classification-guidance) which
manages Pods directly. A sample CloneSet yaml looks like following:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: sample
  name: sample
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```

## Scale features

### Support PVCs

CloneSet allows user to define PVC templates `volumeClaimTemplates` in `CloneSetSpec`, which can support PVCs per Pod.
This cannot be done with `Deployment`. If not specified, CloneSet will only create Pods without PVCs.

A few reminders:

- Each PVC created by CloneSet has an owner reference. So when a CloneSet has been deleted, its PVCs will be cascading deleted.
- Each Pod and PVC created by CloneSet has a "apps.kruise.io/cloneset-instance-id" label key. The associated Pod and PVC will have the same **instance-id**. They use the same string as label value which is composed of a unique  **instance-id** as suffix of the CloneSet name.
- When a Pod has been deleted by CloneSet controller, all PVCs related to it will be deleted together.
- When a Pod has been deleted manually, all PVCs related to the Pod are preserved, and CloneSet controller will create a new Pod with the same **instance-id** and reuse the PVCs.
- When a Pod is updated using **recreate** policy, all PVCs related to it will be deleted together.
- When a Pod is updated using **in-place** policy, all PVCs related to it are preserved.

The following shows a sample CloneSet yaml file which contains PVC templates.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: sample
  name: sample-data
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        volumeMounts:
        - name: data-vol
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: data-vol
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 20Gi
```

**FEATURE STATE:** Kruise v1.4.0

When a Pod has been deleted manually, all PVCs related to the Pod are preserved, and CloneSet controller will create a new Pod with the same **instance-id** and reuse the PVCs.

However, if the Node where the Pod is located experiences an exception, reusing the PVCs may result in the failure of the new Pod to start. For more details, please refer to [issue 1099](https://github.com/openkruise/kruise/issues/1099).
To address this issue, you can set the **DisablePVCReuse=true** field, and the PVCs associated with the Pod will be automatically deleted and no longer reused.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  ...
  replicas: 4
  scaleStrategy:
    disablePVCReuse: true
```

#### When volumeClaimTemplates changed, always recreate pods and related volumes
**FEATURE STATE:** Kruise v1.7.0

By default, if the image and volumeClaimTemplates change at the same time, CloneSet will in-place update Pod and does not rebuild the volume,
causing the volumeClaimTemplates configuration to not take effect.

1. Initially, image=nginx:v1, volumeClaimTemplates storage=20G
```
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  template:
  spec:
    containers:
    - name: nginx
      image: nginx:v1
      volumeMounts:
      - name: data-vol
        mountPath: /usr/share/nginx/html
    volumeClaimTemplates:
    - metadata:
        name: data-vol
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 20Gi
```
2. Change image to nginx:v2, and volumeClaimTemplates storage to 40G
3. CloneSet in-place update Pod and does not rebuild the volume, so the volume size corresponding to the new Pod is still 20 Gi and is not up-to-date.

For the above scenario, you can turn on feature-gate **RecreatePodWhenChangeVCTInCloneSetGate=true**. CloneSet will rebuild the Pod and the related volume.
At this point, the volume of the new Pod will be 40Gi.

**Note: If you only change the volumeClaimTemplates field, the Pod upgrade will not be triggered, you need to trigger the rolling upgrade by changing Labels, Annotations, Image, Env, etc.**

### Selective Pod deletion

When a CloneSet is scaled down, sometimes user has preference to deleting specific Pods.
This cannot be done using `StatefulSet` or `Deployment`, because `StatefulSet` always delete Pod
in order and `Deployment`/`ReplicaSet` only delete Pod by its own sorted sequence.

CloneSet allows user to specify to-be-deleted Pod names when scaling down `replicas`. Take the following
sample as an example,

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  replicas: 4
  scaleStrategy:
    podsToDelete:
    - sample-9m4hp
```

when controller receives above update request, it ensures the number of replicas to be 4. If some Pods needs to be
deleted, the Pods listed in `podsToDelete` will be deleted first.
Controller will clear `podsToDelete` automatically once the listed Pods are deleted. Note that:

If one just adds a Pod name to `podsToDelete` and do not modify `replicas`, controller will delete this Pod, and create a new Pod.
If one is unable to change CloneSet directly, an alternative way is to add a label `apps.kruise.io/specified-delete: true` onto the Pod waiting to delete.

Comparing to delete the Pod directly, using `podsToDelete` or `apps.kruise.io/specified-delete: true`
will have CloneSet protection by `maxUnavailable`/`maxSurge` and lifecycle `PreparingDelete` triggering (See below).

### Deletion Sequence

1. Node unassigned < assigned
2. PodPending < PodUnknown < PodRunning
3. Not ready < ready
4. [Lower pod-deletion cost < higher pod-deletion-cost](#pod-deletion-cost)
5. [Higher spread rank < lower spread rank](#deletion-by-spread-constraints)
6. Been ready for empty time < less time < more time
7. Pods with containers with higher restart counts < lower restart counts
8. Empty creation time pods < newer pods < older pods

#### Pod deletion cost

**FEATURE STATE:** Kruise v0.9.0

The [controller.kubernetes.io/pod-deletion-cost](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost) annotation
is defined in Kubernetes since `v1.21`, Deployment/ReplicaSet will remove pods according to this cost when downscaling.
And CloneSet has also supported it since Kruise `v0.9.0`.

The annotation should be set on the pod, the range is [-2147483647, 2147483647].
It represents the cost of deleting a pod compared to other pods belonging to the same CloneSet.
Pods with lower deletion cost are preferred to be deleted before pods with higher deletion cost.

The implicit value for this annotation for pods that don't set it is 0; negative values are permitted.

#### Deletion by Spread Constraints

**FEATURE STATE:** Kruise v0.10.0

The original proposal(design doc) is [here](https://github.com/openkruise/kruise/blob/master/docs/proposals/20210624-cloneset-scaledown-topology-spread.md).

Currently, it supports **deletion by same node spread** and **deletion by [pod topolocy spread constraints](https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/)**.

If there are Pod Topology Spread Constraints defined in CloneSet template, controller will choose pods according to spread constraints when the cloneset needs to scale down.
Otherwise, controller will choose pods by same node spread by default when scaling down.

### Short hash label

**FEATURE STATE:** Kruise v0.9.0

By default, CloneSet set the `controller-revision-hash` in Pod label to the full name of ControllerRevision, such as:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    controller-revision-hash: demo-cloneset-956df7994
```

It is joined by the name of CloneSet and the hash of the ControllerRevision.
Length of the hash is usually 8~10 characters, and the label value in Kubernetes can not be more than 63 characters.
So the name of CloneSet should be less than 52 characters.

A new feature-gate named `CloneSetShortHash` has been introduced.
If it is enabled, CloneSet will only set the `controller-revision-hash` to the real hash, such as `956df7994`.
So there will be no limit to CloneSet name.

Don't worry. Even if you enable the `CloneSetShortHash`, CloneSet will still recognize and manage the old Pods with full revision label.

Since Kruise v1.1.0, CloneSet will add another `pod-template-hash` label into Pods, which will always be the short hash.

### Scale up with rate limit

**FEATURE STATE:** Kruise v1.0.0

Users can specify `ScaleStrategy.MaxUnavailable` to limit the step size of CloneSet **Scaling Up**, so as to minimize the impact on application services.
This value can be an **absolute number** (e.g., 5) or a **percentage** of desired number of Pods (e.g., 10%). Default value is `nil` (i.e., empty pointer), which indicates non-limitation.

`ScaleStrategy.MaxUnavailable` field can cooperate with 'Spec.MinReadySeconds' field to work, for example:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  minReadySeconds: 60
  scaleStrategy:
    maxUnavailable: 1
```

The effect of the above configuration is that during scaling up, CloneSet will not create the next pod until the previous pod has been ready for more than one minute.

## Update features

### Update types

CloneSet provides three update types, defaults to `ReCreate`.

- `ReCreate`: controller will delete old Pods and PVCs and create new ones.
- `InPlaceIfPossible`: controller will try to in-place update Pod instead of recreating them if possible. Current only image and other fields are supported for in-place update.
- `InPlaceOnly`: controller will in-place update Pod instead of recreating them. With `InPlaceOnly` policy, user cannot modify any fields other than the fields that supported to in-place update.

**You may need to read the [concept doc](../core-concepts/inplace-update) for more details of in-place update.**

We also bring **graceful period** into in-place update. CloneSet has supported `gracePeriodSeconds`, which is a period
duration between controller update pod status and update pod images.
So that endpoints-controller could have enough time to remove this Pod from endpoints.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    type: InPlaceIfPossible
    inPlaceUpdateStrategy:
      gracePeriodSeconds: 10
```

### Template and revision

`spec.template` defines the latest pod template in the CloneSet.
Controller will calculate a revision hash for each version of `spec.template` when it has been initialized or modified.
For example, when we create a sample CloneSet, controller will calculate the revision hash `sample-744d4796cc` and
present the hash in CloneSet Status.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  generation: 1
  # ...
spec:
  replicas: 5
  # ...
status:
  observedGeneration: 1
  readyReplicas: 5
  replicas: 5
  currentRevision: sample-d4d4fb5bd
  updateRevision: sample-d4d4fb5bd
  updatedReadyReplicas: 5
  updatedReplicas: 5
  # ...
```

Here are the explanations for the counters presented in CloneSet status:

- `status.replicas`: Number of pods
- `status.readyReplicas`: Number of **ready** pods
- `status.availableReplicas`: Number of **ready and available** pods (satisfied with `minReadySeconds` and pod lifecycle state is `Normal`)
- `status.currentRevision`: Latest revision hash that has used to be updated to all Pods
- `status.updateRevision`: Latest revision hash of this CloneSet
- `status.updatedReplicas`: Number of pods with the latest revision
- `status.updatedReadyReplicas`: Number of **ready** pods with the latest revision

**FEATURE STATE:** Kruise v1.2.0
- `status.expectedUpdatedReplicas`: Number of the pods that were updated or will be updated with the latest revision under the current `partition` settings.

### Partition

Partition is the **desired number or percent of Pods in old revisions**, defaults to `0`.  This field does **NOT** imply any update order.

When `partition` is set during update:

- If it is a number: `(replicas - partition)` number of pods will be updated with the new version.
- If it is a percent: `(replicas * (100% - partition))` number of pods will be updated with the new version.

**FEATURE STATE:** Kruise v1.2.0
- If `partition` is a percent, and `partition < 100% && replicas > 1` , CloneSet will ensure **at least one pod** will be updated with the new version.
- One can use the condition `.status.updatedReplicas >= .status.expectedUpdatedReplicas` to decide whether workload had finish rolling out new revision under partition restriction.

For example, when we update sample CloneSet's container image to `nginx:mainline` and set `partition=3`, after a while, the sample CloneSet yaml looks like the following:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  # ...
  generation: 2
spec:
  replicas: 5
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - image: nginx:mainline
        imagePullPolicy: Always
        name: nginx
  updateStrategy:
    partition: 3
  # ...
status:
  observedGeneration: 2
  readyReplicas: 5
  replicas: 5
  currentRevision: sample-d4d4fb5bd
  updateRevision: sample-56dfb978d4
  updatedReadyReplicas: 2
  updatedReplicas: 2
```

Note that `status.updateRevision` has been updated to `sample-56dfb978d4`, a new hash.
Since we set `partition=3`, controller only updates two Pods to the latest revision.

```bash
$ kubectl get pod -L controller-revision-hash
NAME           READY   STATUS    RESTARTS   AGE     CONTROLLER-REVISION-HASH
sample-chvnr   1/1     Running   0          6m46s   sample-d4d4fb5bd
sample-j6c4s   1/1     Running   0          6m46s   sample-d4d4fb5bd
sample-ns85c   1/1     Running   0          6m46s   sample-d4d4fb5bd
sample-jnjdp   1/1     Running   0          10s     sample-56dfb978d4
sample-qqglp   1/1     Running   0          18s     sample-56dfb978d4
```

#### Rollback by partition

**FEATURE STATE:** Kruise v0.9.0

By default, `partition` can only control Pods updating to the `status.updateRevision`.
Which means for this CloneSet, when changes `partition 5 -> 3`, CloneSet will update 2 Pods to `status.updateRevision`.
Then changes `partition 3 -> 5` back, CloneSet will do nothing.

But if you have enabled `CloneSetPartitionRollback` feature-gate, in this case,
CloneSet will update the 2 Pods in `status.updateRevision` back to `status.currentRevision`.

### MaxUnavailable

MaxUnavailable is the maximum number of Pods that can be unavailable.
Value can be an **absolute number** (e.g., 5) or a **percentage** of desired number of Pods (e.g., 10%).
Default value is 20%.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    maxUnavailable: 20%
```

Since Kruise `v0.9.0`, `maxUnavailable` not only controls Pods update, but also affect Pods specified deletion.

Which means if you declare to delete a Pod via `podsToDelete` or `apps.kruise.io/specified-delete: true`,
CloneSet will delete it only if the number of unavailable Pods (comparing to the replicas number) is less than `maxUnavailable`.

### MaxSurge

MaxSurge is the maximum number of pods that can be scheduled above the desired replicas.
Value can be an **absolute number** (ex: 5) or a **percentage** of desired pods (ex: 10%).
Defaults to 0.

If maxSurge is set somewhere, cloneset-controller will create `maxSurge` number of Pods above the `replicas`,
when it finds multiple active revisions of Pods which means the CloneSet is in the update stage.
After all Pods except `partition` number have been updated to the latest revision, `maxSurge` number Pods will be deleted,
and the number of Pods will be equal to the `replica` number.

What's more, maxSurge is forbidden to use with `InPlaceOnly` policy.
When maxSurge is used with `InPlaceIfPossible`, controller will create additional Pods with latest revision first,
and then update the rest Pods with old revisions,

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    maxSurge: 3
```

Since Kruise `v0.9.0`, `maxSurge` not only controls Pods update, but also affect Pods specified deletion.

Which means if you declare to delete a Pod via `podsToDelete` or `apps.kruise.io/specified-delete: true`,
CloneSet may create new a Pod, wait it to be ready, and them delete the old one.
It depends on `maxUnavailable` and the current number of unavailable Pods.

For example:

- For a CloneSet `maxUnavailable=2, maxSurge=1` and currently only one unavailable Pods is `pod-a`,
  if you patch `apps.kruise.io/specified-delete: true` onto `pod-b` or put the Pod name into `podsToDelete`,
  CloneSet will delete it directly.
- For a CloneSet `maxUnavailable=1, maxSurge=1` and currently only one unavailable Pods is `pod-a`,
  if you patch `apps.kruise.io/specified-delete: true` onto `pod-b` or put the Pod name into `podsToDelete`,
  CloneSet will create a new Pod, waiting it to be ready, and finally delete `pod-b`.
- For a CloneSet `maxUnavailable=1, maxSurge=1` and currently only one unavailable Pods is `pod-a`,
  if you patch `apps.kruise.io/specified-delete: true` onto `pod-a` or put the Pod name into `podsToDelete`,
  CloneSet will delete it directly.
- ...

### Update sequence

When controller chooses Pods to update, it has default sort logic based on Pod phase and conditions:
**unscheduled < scheduled, pending < unknown < running, not-ready < ready**.
In addition, CloneSet also supports advanced `priority` and `scatter` strategies to allow users to specify the update order.

#### priority

This strategy defines rules for calculating the priority of updating pods.
All update candidates will be applied with the priority terms.
`priority` can be calculated either by weight or by order.

- `weight`: Priority is determined by the sum of weights for terms that match selector. For example,

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
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

- `order`: Priority will be determined by the value of the orderKey. The update candidates are sorted based on the "int" part of the value string. For example, 5 in string "5" and 10 in string "sts-10".

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    priorityStrategy:
      orderPriority:
        - orderedKey: some-label-key
```

#### scatter

This strategy defines rules to make certain Pods be scattered during update.
For example, if a CloneSet has `replica=10`, and we add `foo=bar` label in 3 Pods and specify the following scatter rule. These 3 Pods will
be the 1st, 6th and 10th updated Pods.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    scatterStrategy:
    - key: foo
      value: bar
```

Note that:

- Although `priority` strategy and `scatter` strategy can be applied together, we strongly suggest to just use one of them to avoid confusion.
- If `scatter` strategy is used, we suggest to just use one term. Otherwise, the update order can be hard to understand.

Last but not the least, the above advanced update strategies require independent Pod labeling mechanisms, which are not provided by CloneSet.

### Paused update

`paused` indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  # ...
  updateStrategy:
    paused: true
```

### Progress Deadline Seconds

**FEATURE STATE:** Kruise v1.9.0

The `.spec.progressDeadlineSeconds` field is an optional field that defines the maximum time (in seconds) the CloneSet controller waits before determining that a rollout has failed to make progress. When this deadline is exceeded without progress, the CloneSet controller records the following condition in the resource status:
```yaml
type: Progressing
status: False
reason: ProgressDeadlineExceeded
```

By default, CloneSet does not set this value, so the CloneSet controller will not record the condition to `.status.conditions` while the rollout is ongoing.

Once this value is set, the CloneSet controller will continuously check the rollout status within the specified time. Higher-level orchestration systems can leverage this status to trigger corresponding actions, e.g.rollback the CloneSet (even when this status is marked as timeout, it does not affect the underlying CloneSet controller's continued rolling updates of Pods).
> **Note:**
>
> If specified, this field value must be greater than `.spec.minReadySeconds`.

Therefore, by configuring `.spec.progressDeadlineSeconds`, a CloneSet will traverse multiple states during its lifecycle:
- Progressing: the rollout is ongoing.
- Available: the partition update is successful or the rollout is successful.
- Failed: the rollout is timeout.

#### Progressing State Reason

The following are cases where the Progressing condition status is True:

| Reason                             | Message                                         | Description                        |
|------------------------------------|-------------------------------------------------|------------------------------------|
| CloneSetUpdated                    | CloneSet is progressing/CloneSet is resumed     | Rollout is in progress             |
| CloneSetAvailable                  | CloneSet is available                           | Rollout has completed successfully |
| CloneSetProgressPaused             | CloneSet is paused                              | Rollout is paused                  |
| CloneSetProgressPartitionAvailable | CloneSet has been paused due to partition ready | Partition update is successful     |

#### Progressing CloneSet
A CloneSet is marked as Progressing when performing any of the following operations:

- Rolling out a new revision.
- Scaling up the newest revision during upgrade.
- Scaling down older revisions during upgrade.
- New Pods are ready or available (satisfying MinReadySeconds condition).

When the rollout enters the "Progressing" state, the CloneSet controller adds the following condition to the CloneSet's `.status.conditions`:
```yaml
type: Progressing
status: "True"
reason: CloneSetUpdated
```

#### Available CloneSet
**Partition Paused:** 

A CloneSet enters the partition paused state when:
- All replicas associated with the CloneSet partition have been updated to the specified latest revision.
- All replicas associated with the CloneSet partition are available.

The CloneSet controller adds the following condition to the CloneSet's `.status.conditions`:
```yaml
type: Progressing
status: "True"
reason: ProgressPartitionAvailable
```

**Available:** 

A CloneSet is marked as available when:

- All replicas have been updated to the latest specified revision.
- All replicas are available.
- No old revision replicas are running.

The CloneSet controller adds the following condition to the CloneSet's `.status.conditions`:
```yaml
type: Progressing
status: "True"
reason: CloneSetAvailable
```

The Progressing condition maintains a status value of "True" until a new revision is initiated. This condition persists even when replica availability changes (which affects the Available condition instead).

#### Failed CloneSet
A CloneSet enters the Failed state when it cannot successfully deploy the latest revision. Common causes include:

- Insufficient quota
- Readiness probe failures
- Image pull errors
- Insufficient permissions
- Limit ranges
- Application runtime misconfiguration

This condition can be detected by configuring the `.spec.progressDeadlineSeconds` parameter. Once the deadline is exceeded, the CloneSet controller adds the following condition to the CloneSet's `.status.conditions`:
```yaml
type: Progressing
status: "False"
reason: ProgressDeadlineExceeded
```

> **Note:**
>
> When a CloneSet rollout is paused, the controller stops progress checking against the specified deadline. Users can safely pause and resume a CloneSet rollout in the middle of the rollout without triggering the deadline exceeded condition.

#### Operations on Failed CloneSet
All operations applicable to a Complete CloneSet can also be applied to a Failed CloneSet, including:
- Rolling back to a previous revision.
- Pausing the rollout to make multiple adjustments to the Pod template.

### In-Place Update Support for Modifying Resources

**FEATURE STATE:** Kruise v1.8.0

If you have enabled `InPlaceWorkloadVerticalScaling` during [Kruise installation or upgrade](../installation##optional-feature-gate),
CloneSet supports modifying container resources (CPU/Memory) during in-place updates.
This feature allows users to directly update the following fields without triggering Pod recreation:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
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


### Pre-download image for in-place update

**FEATURE STATE:** Kruise v0.9.0

If you have enabled the `PreDownloadImageForInPlaceUpdate` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate),
CloneSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.
It is quite useful to accelerate the progress of applications upgrade.

The parallelism of each new image pre-downloading by CloneSet is `1`, which means the image is downloaded on nodes one by one.
You can change the parallelism using `apps.kruise.io/image-predownload-parallelism` annotation on CloneSet according to the capability of image registry,
for registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process.

Since Kruise v1.1.0, you can use `apps.kruise.io/image-predownload-min-updated-ready-pods` to make sure the new image starting pre-download after a few new Pods have been updated ready. Its value can be absolute number or percentage.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "10"
    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"
```

Note that to avoid most unnecessary image downloading, now controller will only pre-download images for CloneSet with replicas > `3`.

## Lifecycle hook

Each Pod managed by CloneSet has a clear state defined in `lifecycle.apps.kruise.io/state` label:

- Normal
- PreparingUpdate
- Updating
- Updated
- PreparingDelete

Lifecycle hook allows users to do something (for example remove pod from service endpoints) during Pod deleting and before/after in-place update.

```go
type LifecycleStateType string

// Lifecycle contains the hooks for Pod lifecycle.
type Lifecycle struct
    // PreDelete is the hook before Pod to be deleted.
    PreDelete *LifecycleHook `json:"preDelete,omitempty"`
    // InPlaceUpdate is the hook before Pod to update and after Pod has been updated.
    InPlaceUpdate *LifecycleHook `json:"inPlaceUpdate,omitempty"`
    // PreNormal is the hook after Pod to be created and ready to be Normal.
    PreNormal *LifecycleHook `json:"preNormal,omitempty"`
}

type LifecycleHook struct {
    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`
    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`

    /**********************  FEATURE STATE: 1.2.0 ************************/
    // MarkPodNotReady = true means:
    // - Pod will be set to 'NotReady' at preparingDelete/preparingUpdate state.
    // - Pod will be restored to 'Ready' at Updated state if it was set to 'NotReady' at preparingUpdate state.
    // Currently, MarkPodNotReady only takes effect on InPlaceUpdate & PreDelete hook.
    // Default to false.
    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`
    /*********************************************************************/
}
```

Examples:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:

  # define with finalizer
  lifecycle:
    preNormal:
      finalizersHandler:
      - example.io/unready-blocker
    preDelete:
      finalizersHandler:
      - example.io/unready-blocker
    inPlaceUpdate:
      finalizersHandler:
      - example.io/unready-blocker

  # or define with label
  # lifecycle:
  #   inPlaceUpdate:
  #     labelsHandler:
  #       example.io/block-unready: "true"
```

### MarkPodNotReady
**FEATURE STATE:** Kruise v1.2.0

```yaml
  lifecycle:
    preDelete:
      markPodNotReady: true
      finalizersHandler:
      - example.io/unready-blocker
    inPlaceUpdate:
      markPodNotReady: true
      finalizersHandler:
      - example.io/unready-blocker
```
- If you set `markPodNotReady=true` for `preDelete`:
  - Kruise will try to set `KruisePodReady` condition to `False` when Pods enter `PreparingDelete` lifecycle state, and Pods will be set to **NotReady**, but containers still `Running`.
- If you set `markPodNotReady=true` for `inPlaceUpdate`:
  - Kruise will try to set `KruisePodReady` condition to `False` when Pods enter `PreparingUpdate` lifecycle state, and Pods will be set to **NotReady**, but containers still `Running`.
  - Kruise will try to set `KruisePodReady` condition to `True` when Pods enter `Updated` lifecycle state.

**One can use this `markPodNotReady` feature to drain service traffic before terminating containers.**

*Note: this feature only works when pod has `KruisePodReady` ReadinessGate.*

### State circulation

![Lifecycle circulation](/img/docs/user-manuals/cloneset-lifecycle.png)

- When CloneSet create a Pod (including scaling up and recreate update):
  - The Pod will be regarded as `Available` only after PreNormal hook is satisfied.
  - `PreNormal` hook can be used for post-checks after pod creation. For example, one can check if the pod have been added as the SLB backends successfully. Without preNormal hook, one may encounter traffic loss during rolling upgrades if Operator(e.g., CCM) fails to add new pods to the SLB backends.
- When CloneSet delete a Pod (including scale in and recreate update):
  - Delete it directly if no lifecycle hook definition or Pod not matched preDelete hook
  - Otherwise, CloneSet will firstly update Pod to `PreparingDelete` state and wait for user controller to remove the label/finalizer and Pod not matched preDelete hook
  - Note that Pods in `PreparingDelete` state will not be updated
- When CloneSet update a Pod in-place:
  - If lifecycle hook defined and Pod matched inPlaceUpdate hook, CloneSet will update Pod to `PreparingUpdate` state
  - After user controller remove the label/finalizer (thus Pod not matched inPlaceUpdate hook), CloneSet will update it to `Updating` state and start updating
  - After in-place update completed, CloneSet will update Pod to `Updated` state if lifecycle hook defined and Pod not matched inPlaceUpdate hook
  - When user controller add label/finalizer into Pod and it matched inPlaceUpdate hook, CloneSet will finally update it to `Normal` state

Besides, although our design supports to change a Pod from `PreparingDelete` back to `Normal` (through cancel specified delete), but it is not recommended. Because Pods in `PreparingDelete` state will not be updated by CloneSet, it might be updating immediately if comes back to `Normal`. This case is hard for user controller to handle.

### Example for user controller logic

Same as yaml example above, we can firstly define：

- `example.io/unready-blocker` finalizer as hook

Add these fields into CloneSet template:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  lifecycle:
    preNormal:
      finalizersHandler:
      - example.io/unready-blocker
    preDelete:
      finalizersHandler:
      - example.io/unready-blocker
    inPlaceUpdate:
      finalizersHandler:
      - example.io/unready-blocker
  template:
  # ...
```

User controller logic:
- For Pod in `PreparingNormal` state, if there is no `example.io/unready-blocker`, patch the finalizer to Pod, and Pod will be available for CloneSet, and will enter `Normal` state.
- For Pod in `PreparingDelete` and `PreparingUpdate` states, delete it from endpoints and remove `example.io/unready-blocker` finalizer
- For Pod in `Updated` state, add it to endpoints and add `example.io/unready-blocker` finalizer

### Scaling with PreparingDelete
FEATURE STATE: Kruise v1.3.0

CloneSet considers Pods in `PreparingDelete` state as normal by default, which means these Pods will still be calculated in the `replicas` number.

In this situation:

- if you scale down `replicas` from `N` to `N-1`, when the Pod to be deleted is still in `PreparingDelete`, you scale up `replicas` to `N`, the CloneSet will move the Pod back to `Normal`.
- if you scale down `replicas` from `N` to `N-1` and put a Pod into `podsToDelete`, when the specific Pod is still in `PreparingDelete`, you scale up `replicas` to `N`, the CloneSet will not create a new Pod until the specific Pod goes into terminating.
- if you specifically delete a Pod without `replicas` changed, when the specific Pod is still in `PreparingDelete`, the CloneSet will not create a new Pod until the specific Pod goes into terminating.

Since Kruise v1.3.0, you can put a `apps.kruise.io/cloneset-scaling-exclude-preparing-delete: "true"` label into CloneSet, which indicates Pods in `PreparingDelete` will not be calculated in the `replicas` number.

In this situation:

- if you scale down `replicas` from `N` to `N-1`, when the Pod to be deleted is still in `PreparingDelete`, you scale up `replicas` to `N`, the CloneSet will move the Pod back to `Normal`.
- if you scale down `replicas` from `N` to `N-1` and put a Pod into `podsToDelete`, even if the specific Pod is still in `PreparingDelete`, you scale up `replicas` to `N`, the CloneSet will create a new Pod immediately.
- if you specifically delete a Pod without `replicas` changed, even if the specific Pod is still in `PreparingDelete`, the CloneSet will create a new Pod immediately.

## Performance optimization

**FEATURE STATE:** Kruise v1.4.0

Currently, both status and metadata changes of Pods will trigger the reconcile of CloneSet Controller. CloneSet Reconcile is configured by default with three workers, it works normally in small-scale clusters.

However, for larger clusters or scenarios with frequent Pod update events, these unnecessary reconciles will block the real CloneSet reconciles, resulting in delayed rolling updates and other changes.
To solve this problem, you can enable the **feature-gate CloneSetEventHandlerOptimization** to reduce some unnecessary reconcile enqueues.

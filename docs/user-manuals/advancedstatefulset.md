---
title: Advanced StatefulSet
---

This controller enhances the rolling update workflow of [Kubernetes StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
controller in large-scale scenarios, such as adding maxUnavailable and introducing in-place update strategy.

If you don't know much about the Kubernetes StatefulSet, we strongly recommend you read its documents before learning Advanced StatefulSet.
- [Concept of Kubernetes StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Deploying a stateful application](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/)

Note that Advanced StatefulSet extends the same CRD schema of default StatefulSet with newly added fields.
The CRD kind name is still `StatefulSet`.
This is done on purpose so that user can easily migrate workload to the Advanced StatefulSet from the
default StatefulSet. For example, one may simply replace the value of `apiVersion` in the StatefulSet yaml
file from `apps/v1` to `apps.kruise.io/v1beta1` after installing Kruise manager.

```yaml
-  apiVersion: apps/v1
+  apiVersion: apps.kruise.io/v1beta1
   kind: StatefulSet
   metadata:
     name: sample
   spec:
     #...
```

Note that since Kruise v0.7.0, Advanced StatefulSet has been promoted to `v1beta1`, which is compatible with `v1alpha1`.
And for Kruise version lower than v0.7.0, you can only use `v1alpha1`.

## Pod Identity
StatefulSet Pods have a unique identity that consists of an ordinal, a stable network identity, and stable storage. The identity sticks to the Pod, regardless of which node it's (re)scheduled on.

### Ordinal Index
**FEATURE STATE:** Kruise v1.7.0

For a StatefulSet with N replicas, each Pod in the StatefulSet will be assigned an integer ordinal, that is unique over the Set. By default, pods will be assigned ordinals from 0 up through N-1. The StatefulSet controller will also add a pod label with this index: **apps.kubernetes.io/pod-index**, as follows:
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: sample
    apps.kubernetes.io/pod-index: "0"
  name: sample-0
```

### Start ordinal
**FEATURE STATE:** Kruise v1.7.0

Pod start ordinal numbers start at 0 by default, and you can also set the pod start ordinal number by setting the **.spec.ordinals.start** field. To use this capability, you need to enable FeatureGate **StatefulSetStartOrdinal=true**.

- .spec.ordinals.start: If the .spec.ordinals.start field is set, Pods will be assigned ordinals from .spec.ordinals.start up through .spec.ordinals.start + .spec.replicas - 1.
For example: replicas=5, ordinals.start=3, Pod Range = [3, 7].

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
The main motivation of this feature is to support a more flexible StatefulSet, a building block in an ecosystem where Stateful applications can be migrated across Kubernetes clusters with more automation. As follows:

##### Story 1

**Migrating across namespaces**: Many organizations use namespaces for team isolation. Consider a team that is migrating a `StatefulSet` to a new namespace in a cluster. Migration could be motivated by a branding change, or a requirement to move out of a shared namespace. Consider the StatefulSet `my-app` with `replicas: 5`, running in a shared namespace.


```
name: my-app
namespace: shared
replicas: 5
-----------------------------------------------
[ nginx-0, nginx-1, nginx-2, nginx-3, nginx-4 ]
```


To move two pods, the `my-app` StatefulSet in the `shared` namespace can be scaled down to `replicas: 3, ordinals.start: 0`, and an analogous StatefulSet in the `app-team` namespace scaled up to `replicas: 2, ordinals.start: 3`. This allows for pod ordinals to be managed during migration. The application operator should manage network connectivity, volumes and slice orchestration (when to migrate and by how many replicas).


```
name: my-app						name: my-app
namespace: shared					namespace: app-team
replicas: 3						    replicas: 2
ordinals.start: 0				    ordinals.start: 3
------------------------------		---------------------
[ nginx-0, nginx-1, nginx-2 ]		[ nginx-3, nginx-4 ]
```


The `replicasStatefulSet` and `replicas` fields should be updated jointly, depending on the requirements of the migration.

##### Story 2

**Migrating across clusters**: Organizations taking a multi cluster approach may need to move workloads across clusters due to capacity constraints, infrastructure constraints, or for better application isolation. Similar to namespace migration, the application operator should manage network connectivity, volumes and slice orchestration.

##### Story 3

**Non-Zero Based Indexing:** A user may want to number their StatefulSet starting from ordinal `1`, rather than ordinal `0`. Using
`1` based numbering may be easier to reason about and conceptualize (eg: ordinal `k` is the `k`'th replica, not the `k+1`'th replica).

## Scale features

### PersistentVolumeClaim retention

**FEATURE STATE:** Kruise v1.1.0

If you have enabled the `StatefulSetAutoDeletePVC` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate),
you can use `.spec.persistentVolumeClaimRetentionPolicy` field to control if and how PVCs are deleted during the lifecycle of a StatefulSet.

This is same to the upstream StatefulSet (K8s >= 1.23 [alpha]), please refer to [the upstream document for it](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention).

### Scaling with rate limiting

**FEATURE STATE:** Kruise v0.10.0

To avoid creating all failure pods at once when a new CloneSet applied, a `maxUnavailable` field for scale strategy has been added since Kruise `v0.10.0`.

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  replicas: 100
  scaleStrategy:
    maxUnavailable: 10% # percentage or absolute number
```

When this field has been set, Advanced StatefulSet will create pods with the guarantee that the number of unavailable pods during the update cannot exceed this value.

For example, the StatefulSet will firstly create 10 pods. After that, it will create one more pod only if one pod created has been running and ready.

Note that it can just be allowed to work with Parallel podManagementPolicy.

### Ordinals reserve(skip)

Since Advanced StatefulSet `v1beta1` (Kruise >= v0.7.0), it supports ordinals reserve.

By adding the ordinals to reserve into `reserveOrdinals` fields, Advanced StatefulSet will skip to create Pods with those ordinals.
If these Pods have already existed, controller will delete them.
Note that `spec.replicas` is the expectation number of running Pods and `spec.reserveOrdinals` is the ordinals that should be skipped.

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  replicas: 4
  reserveOrdinals:
  - 1
```

For an Advanced StatefulSet with `replicas=4, reserveOrdinals=[1]`, the ordinals of running Pods will be `[0,2,3,4]`.

- If you want to migrate Pod-3 and reserve this ordinal, just append `3` into `reserveOrdinals` list.
  Then controller will delete Pod-3 and create Pod-5 (existing Pods will be `[0,2,4,5]`).
- If you just want to delete Pod-3, you should append `3` into `reserveOrdinals` list and set `replicas` to `3`.
  Then controller will delete Pod-3 (existing Pods will be `[0,2,4]`).

### Specified Pod Deletion

**FEATURE STATE:** Kruise v1.5.5, Kruise v1.6.4, Kruise v1.7.2+

Compared to manually deleting a Pod directly, pod deletion by labeling pod with `apps.kruise.io/specified-delete: true` will be protected by the `maxUnavailable` of the Advanced StatefulSet during deletion,
and it will trigger the `PreparingDelete` lifecycle hook (see below).

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

When the controller receives the above Pod update, it will trigger the deletion process of the pod with specified deletion label and ensure that the `maxUnavailable` limit is not exceeded.
The pod will be re-built by the workload if the ordinal is not reserved.

## Update features
### In-Place Update

Advanced StatefulSet adds a `podUpdatePolicy` field in `spec.updateStrategy.rollingUpdate`
which controls recreate or in-place update for Pods.

- `ReCreate` controller will delete old Pods and create new ones. This is the same behavior as default StatefulSet.
- `InPlaceIfPossible` controller will try to in-place update Pod instead of recreating them if possible. Please read the concept doc below.
- `InPlaceOnly` controller will in-place update Pod instead of recreating them. With `InPlaceOnly` policy, user cannot modify any fields other than the fields that supported to in-place update.

**You may need to read the [concept doc](../core-concepts/inplace-update) for more details of in-place update.**

We also bring **graceful period** into in-place update. Advanced StatefulSet has supported `gracePeriodSeconds`, which is a period
duration between controller update pod status and update pod images.
So that endpoints-controller could have enough time to remove this Pod from endpoints.

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

**More importantly**, a readiness-gate named `InPlaceUpdateReady` must be  added into `template.spec.readinessGates`
when using `InPlaceIfPossible` or `InPlaceOnly`. The condition `InPlaceUpdateReady` in podStatus will be updated to False before in-place
update and updated to True after the update is finished. This ensures that pod remain at NotReady state while the in-place
update is happening.

An example for StatefulSet using in-place update:

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

### Pre-download image for in-place update

**FEATURE STATE:** Kruise v0.10.0

If you have enabled the `PreDownloadImageForInPlaceUpdate` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate),
Advanced StatefulSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.
It is quite useful to accelerate the progress of applications upgrade.

The parallelism of each new image pre-downloading by Advanced StatefulSet is `1`, which means the image is downloaded on nodes one by one.
You can change the parallelism using `apps.kruise.io/image-predownload-parallelism` annotation on Advanced StatefulSet according to the capability of image registry,
for registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process.

Since Kruise v1.1.0, you can use `apps.kruise.io/image-predownload-min-updated-ready-pods` to make sure the new image starting pre-download after a few new Pods have been updated ready. Its value can be absolute number or percentage.

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "10"
    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"
```

Note that to avoid most unnecessary image downloading, now controller will only pre-download images for Advanced StatefulSet with replicas > `3`.

### Update sequence

Advanced StatefulSet adds a `unorderedUpdate` field in `spec.updateStrategy.rollingUpdate`, which contains strategies for non-ordered update.
If `unorderedUpdate` is not nil, pods will be updated with non-ordered sequence. Noted that UnorderedUpdate can only be allowed to work with Parallel podManagementPolicy.

Currently `unorderedUpdate` only contains one field: `priorityStrategy`.
#### Priority strategy

This strategy defines rules for calculating the priority of updating pods.
All update candidates will be applied with the priority terms.
`priority` can be calculated either by weight or by order.

- `weight`: Priority is determined by the sum of weights for terms that match selector. For example,

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

- `order`: Priority will be determined by the value of the orderKey. The update candidates are sorted based on the "int" part of the value string. For example, 5 in string "5" and 10 in string "sts-10".

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

### MaxUnavailable

Advanced StatefulSet adds a `maxUnavailable` capability in the `RollingUpdateStatefulSetStrategy` to allow parallel Pod
updates with the guarantee that the number of unavailable pods during the update cannot exceed this value.
It is only allowed to use when the podManagementPolicy is `Parallel`.

This feature achieves similar update efficiency like Deployment for cases where the order of
update is not critical to the workload. Without this feature, the native `StatefulSet` controller can only
update Pods one by one even if the podManagementPolicy is `Parallel`.

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

For example, assuming an Advanced StatefulSet has five Pods named P0 to P4, and the application can
tolerate losing three replicas temporally. If we want to update the StatefulSet Pod spec from v1 to
v2, we can perform the following steps using the `MaxUnavailable` feature for fast update.

1. Set `MaxUnavailable` to 3 to allow three unavailable Pods maximally.
2. Optionally, Set `Partition` to 4 in case canary update is needed. Partition means all Pods with an ordinal that is
   greater than or equal to the partition will be updated. In this case P4 will be updated even though `MaxUnavailable`
   is 3.
3. After P4 finish update, change `Partition` to 0. The controller will update P1,P2 and P3 concurrently.
   Note that with default StatefulSet, the Pods will be updated sequentially in the order of P3, P2, P1.
4. Once one of P1, P2 and P3 finishes update, P0 will be updated immediately.

### Paused update

`paused` indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas.

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: StatefulSet
spec:
  # ...
  updateStrategy:
    rollingUpdate:
      paused: true
```

## Lifecycle hook

**FEATURE STATE:** Kruise v0.8.0

This is similar to [Lifecycle hook of CloneSet](./cloneset#lifecycle-hook).

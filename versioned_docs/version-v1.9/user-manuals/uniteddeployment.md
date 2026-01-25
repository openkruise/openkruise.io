---
title: UnitedDeployment
---

This controller provides a new way to manage pods in multi-domain by using multiple workloads.
A high level description about this workload can be found in this [blog post](/blog/uniteddeployment).

Different domains in one Kubernetes cluster are represented by multiple groups of
nodes identified by labels. UnitedDeployment controller provisions one type of workload
for each group of with corresponding matching `NodeSelector`, so that
the pods created by individual workload will be scheduled to the target domain.

Each workload managed by UnitedDeployment is called a `subset`.
Each domain should at least provide the capacity to run the `replicas` number of pods.
Currently `StatefulSet`, `Advanced StatefulSet`, `CloneSet` and `Deployment` are the supported workloads.

API definition: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go

The below sample yaml presents a UnitedDeployment which manages three StatefulSet instances in three domains.
The total number of managed pods is 6.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 6
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    statefulSetTemplate:
      metadata:
        labels:
          app: sample
      spec:
        selector:
          matchLabels:
            app: sample
        template:
          metadata:
            labels:
              app: sample
          spec:
            containers:
            - image: nginx:alpine
              name: nginx
  topology:
    subsets:
    - name: subset-a
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-a
      replicas: 1
    - name: subset-b
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-b
      replicas: 50%
    - name: subset-c
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-c
  updateStrategy:
    manualUpdate:
      partitions:
        subset-a: 0
        subset-b: 0
        subset-c: 0
    type: Manual
...
```

## Capacity Planning For Subsets

**FEATURE STATE:** Kruise v1.5.1

UnitedDeployment offer the option to define the `MaxReplicas` for each subset, allowing you to effectively manage your resource allocation.

### MaxReplicas Limits the Maximum Number of Replicas for a Subset

For example, assuming there is an application that typically runs with a maximum of 4 replicas on regular nodes. However, if the number of replicas exceeds 4, the exceeded Pods will automatically scale them to elastic nodes.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    cloneSetTemplate:
      ......
  topology:
    subsets:
    - name: normal-nodes
      maxReplicas: 4
      ......
    - name: elastic-nodes
      maxReplicas: null
      ......
```

The UnitedDeployment controller follows the following rules for scaling each subset if you set `MaxReplicas`:
1. When scaling up, the UnitedDeployment controller considers the order specified in the subsets list;
2. When scaling down, it obeys the reverse order of scaling up.

Please **Note** the following:
1. You can **NOT** set both `MaxReplicas` and `Replicas` for any subset simultaneously.
2. If `MaxReplicas` is left empty (null), there are no limitations imposed on the number of replicas for that particular subset.
3. To prevent situations where all `MaxReplicas` requirements are met and no subsets can be scaled up, it is crucial to have **at least one** subset with an empty(null) `MaxReplicas` value.

### MinReplicas Ensures the Minimum Number of Replicas for a Subset
For example, when scattering by region, you can use `minReplicas` to ensure that each region has at least one replica, while the remaining replicas are elastically deployed according to an adaptive scheduling strategy.

## Customize pod configuration of subset
**FEATURE STATE:** Kruise v1.5.0

Since v1.5.0, one can customize pod spec field other than nodeSelectorTerm and tolerations, e.g. env, resources.

**Note:** it is not recommended to customize subset image since it may cause chaos into update function.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 6
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    statefulSetTemplate:
      ...
  topology:
    subsets:
    - name: subset-a
      ...
      # patch container resources, env:
      patch:
        spec:
          containers:
          - name: main
            resources:
              limits:
                cpu: "2"
                memory: 800Mi
            env:
            - name: subset
              value: subset-a
    - name: subset-b
      ...
      # patch container resources, env:
      patch:
        spec:
          containers:
          - name: main
            resources:
              limits:
                cpu: "2"
                memory: 800Mi
            env:
            - name: subset
              value: subset-b
```

## HPA UnitedDeployment
**FEATURE STATE:** Kruise v1.5.0

Horizontal Pod Autoscaler can support Custom Resource workload which has [scale subresource](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource).
Since v1.5.0 you can HPA UnitedDeployment directly, as follows:

```yaml
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: example-hpa
  namespace: default
spec:
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - resource:
      name: cpu
      targetAverageUtilization: 2
    type: Resource
  scaleTargetRef:
    apiVersion: apps.kruise.io/v1alpha1
    kind: UnitedDeployment
    name: sample-ud
```


## Adaptive Scheduling Strategy
**FEATURE STATE:** Kruise v1.8.0

UnitedDeployment supports configuring two different scheduling strategies through the `scheduleStrategy` field: **Fixed** and **Adaptive**. The behaviors of these two strategies are as follows:

### Fixed Strategy
- **Behavior**: Strictly follows the predefined Subset distribution rules to schedule Pods. Even if Pod scheduling fails due to insufficient node resources or scheduling conflicts, it will continue attempting to schedule within the original Subset.
- **Use Cases**: Scenarios requiring precise control over workload distribution, such as environments with specific node resource isolation or high compliance requirements.

### Adaptive Strategy
- **Behavior**: When the target Subset cannot schedule a Pod, it automatically schedules the Pod to other Subsets with available resources. The scheduling priority follows the order of the Subset list.
- **Features**:
  - **Dynamic Resource Reschedule**: When a Subset has insufficient resources, pods are automatically rescheduled to other subsets.
  - **Configurable Rescheduling Timeout**: The rescheduling determination time window can be set using the `rescheduleCriticalSeconds` parameter (default is 30 seconds).
- **Use Cases**: Scenarios requiring highly elastic resource scheduling, such as hybrid usage of regular node pools and elastic node pools.

#### Example: Hybrid Node Pool Scheduling Strategy

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: ud-demo
spec:
  #...
  topology:
    subsets:
    - name: subset-a
      maxReplicas: 3
      #...
    - name: subset-b
      #...
    scheduleStrategy:
      # Scheduling strategy. Adaptive mode will reschedule failed Pods to other
      type: Adaptive
      adaptive:
        rescheduleCriticalSeconds: 30
```

#### Scenario Description
- **Off-Peak Period**: Prioritizes scheduling Pods in the regular node pool (subset-a) to fully utilize fixed resources.
- **Peak Period**: When subset-a's node resources are insufficient, Pods exceeding `maxReplicas` are automatically scheduled to the elastic node pool (subset-b).
- **Failure Recovery**: When all nodes in subset-a become unavailable, all new Pods will automatically migrate to subset-b.


## Pod Distribution Management

This controller provides `spec.topology` to describe the pod distribution specification.

```go
// Topology defines the spread detail of each subset under UnitedDeployment.
// A UnitedDeployment manages multiple homogeneous workloads which are called subset.
// Each of subsets under the UnitedDeployment is described in Topology.
type Topology struct {
    // Contains the details of each subset. Each element in this array represents one subset
    // which will be provisioned and managed by UnitedDeployment.
    // +optional
    Subsets []Subset `json:"subsets,omitempty"`
}

// Subset defines the detail of a subset.
type Subset struct {
    // Indicates subset name as a DNS_LABEL, which will be used to generate
    // subset workload name prefix in the format '<deployment-name>-<subset-name>-'.
    // Name should be unique between all of the subsets under one UnitedDeployment.
    Name string `json:"name"`

    // Indicates the node selector to form the subset. Depending on the node selector,
    // pods provisioned could be distributed across multiple groups of nodes.
    // A subset's nodeSelectorTerm is not allowed to be updated.
    // +optional
    NodeSelectorTerm corev1.NodeSelectorTerm `json:"nodeSelectorTerm,omitempty"`

    // Indicates the tolerations the pods under this subset have.
    // A subset's tolerations is not allowed to be updated.
    // +optional
    Tolerations []corev1.Toleration `json:"tolerations,omitempty"`

    // Indicates the number of the pod to be created under this subset. Replicas could also be
    // percentage like '10%', which means 10% of UnitedDeployment replicas of pods will be distributed
    // under this subset. If nil, the number of replicas in this subset is determined by controller.
    // Controller will try to keep all the subsets with nil replicas have average pods.
    // +optional
    Replicas *intstr.IntOrString `json:"replicas,omitempty"`
}
```

`topology.subsets` specifies the desired group of `subset`s.
A subset added to or removed from this array will be created or deleted by controller during reconcile.
Each subset workload is created based on the description of UnitedDeployment `spec.template`.
`subset` provides the necessary topology information to create a subset workload.
Each subset has a unique name.  A subset workload is created with the name prefix in
format of `<UnitedDeployment-name>-<Subset-name>-`. Each subset will also be configured with
the `nodeSelector`.
When provisioning a StatefulSet `subset`, the `nodeSelector` will be added
to the StatefulSet's `podTemplate`, so that the Pods of the StatefulSet will be created with the
expected node affinity.

By default, UnitedDeployment's Pods are evenly distributed across all subsets.
There are two scenarios the controller does not follow this policy:

The first one is to customize the distribution policy by indicating `subset.replicas`.
A valid `subset.replicas` could be integer to represent a **real replicas of pods** or
**string in format of percentage** like '40%' to represent a fixed proportion of pods.
Once a `subset.replicas` is given, the controller is going to reconcile to make sure
each subset has the expected replicas.
The subsets with empty `subset.replicas` will divide the remaining replicas evenly.

The other scenario is that the indicated subset replicas policy becomes invalid.
For example, the UnitedDeployment's `spec.replicas` is decremented to be less
than the sum of all `subset.replicas`.
In this case, the indicated `subset.replicas` is ineffective and the controller
will automatically scale each subset's replicas to match the total replicas number.
The controller will try its best to apply this adjustment smoothly.

## Pod Update Management

When `spec.template` is updated, a upgrade progress will be triggered.
New template will be patch to each subset workload, which triggers subset controller
to update their pods.
Furthermore, if subset workload supports `partition`, like StatefulSet, AdvancedStatefulSet
is also able to provide `Manual` update strategy.

```go
// UnitedDeploymentUpdateStrategy defines the update performance
// when template of UnitedDeployment is changed.
type UnitedDeploymentUpdateStrategy struct {
    // Type of UnitedDeployment update strategy.
    // Default is Manual.
    // +optional
    Type UpdateStrategyType `json:"type,omitempty"`
    // Includes all of the parameters a Manual update strategy needs.
    // +optional
    ManualUpdate *ManualUpdate `json:"manualUpdate,omitempty"`
}

// ManualUpdate is a update strategy which allows users to control the update progress
// by providing the partition of each subset.
type ManualUpdate struct {
    // Indicates number of subset partition.
    // +optional
    Partitions map[string]int32 `json:"partitions,omitempty"`
}
```

`Manual` update strategy allows users to control the update progress by indicating
the `partition` of each subset. The controller will pass the `partition` to each subset.

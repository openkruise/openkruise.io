---
title: PodUnavailableBudget
---

**FEATURE STATE:** Kruise v0.10.0

Kubernetes offers [Pod Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) to help you run highly available applications even when you introduce frequent [voluntary disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/).
PDB limits the number of Pods of a replicated application that are down simultaneously from voluntary disruptions. However, it can only constrain the voluntary disruption triggered by the [Eviction API](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#eviction-api).
For example, when you run kubectl drain, the tool tries to evict all of the Pods on the Node you're taking out of service.

In the following voluntary disruption scenarios, there are still business disruption or SLA degradation situations:
1. The application owner update deployment's pod template for general upgrading, while cluster administrator drain nodes to scale the cluster down(learn about [Cluster Autoscaling](https://github.com/kubernetes/autoscaler/#readme)).
2. The middleware team is using [SidecarSet](./sidecarset) to rolling upgrade the sidecar containers of the cluster, e.g. ServiceMesh envoy, while HPA triggers the scale-down of business applications.
3. The application owner and middleware team release the same Pods at the same time based on OpenKruise cloneSet, sidecarSet in-place upgrades

In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or SLA degradation, which greatly improves the high availability of application services.

A sample PodUnavailableBudget yaml looks like following:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: PodUnavailableBudget
metadata:
  name: web-server-pub
  namespace: web
spec:
  targetRef:
    apiVersion: apps.kruise.io/v1alpha1
    # cloneset, deployment, statefulset etc.
    kind: CloneSet
    name: web-server
  # selector label query over pods managed by the budget
  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.
  # selector is commonly used in scenarios where applications are deployed using multiple workloads,
  # and targetRef is used for protection against a single workload.
# selector:
#   matchLabels:
#     app: web-server
  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3
  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect
  maxUnavailable: 60%
  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2
# minAvailable: 40%
-----------------------

apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: web-server
  name: web-server
  namespace: web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web-server
  template:
    metadata:
      labels:
        app: web-server
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```
## Implementation
This program customizes the PodUnavailableBudget (later referred to as PUB) CRD resource to describe the desired state of the application, and the working mechanism is shown below:

![PodUnavailableBudget](/img/docs/user-manuals/podunavailablebudget.png)

## Comparison with Kubernetes native PDB
Kubernetes PodDisruptionBudget implements protection against Pod Eviction based on the EvictionREST interface,
while PodUnavailableBudget intercepts all pod modification requests through the admission webhook validating mechanism (Many voluntary disruption scenarios can be summarized as modifications to Pod resources),
and reject the request if the modification does not satisfy the desired state of the PUB.

**Pub contains all the protection capabilities of kubernetes PDB, you can use both, or use pub independently to implement your application protection (Recommend).**

## feature-gates
PodUnavailableBudget protection against Pods is turned off by default, if you want to turn it on set feature-gates *PodUnavailableBudgetDeleteGate* and *PodUnavailableBudgetUpdateGate*.

```bash
$ helm install kruise https://... --set featureGates="PodUnavailableBudgetDeleteGate=true\,PodUnavailableBudgetUpdateGate=true"
```

## PodUnavailableBudget Status
```yaml
# kubectl describe podunavailablebudgets web-server-pub
Name:         web-server-pub
Kind:         PodUnavailableBudget
Status:
  unavailableAllowed:   3   # unavailableAllowed number of pod unavailable that are currently allowed
  currentAvailable:     5   # currentAvailable current number of available pods
  desiredAvailable:     2   # desiredAvailable minimum desired number of available pods
  totalReplicas:        5   # totalReplicas total number of pods counted by this PUB
```

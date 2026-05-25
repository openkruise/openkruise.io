---
title: WorkloadSpread
---

**FEATURE STATE:** OpenKruise v1.7.0+

WorkloadSpread can distribute Pods of a workload across different types of nodes according to defined policies, which empowers a single workload with the capabilities for multi-domain deployment and elastic deployment.

### Key Capabilities

*   **Fault-tolerant spread:** Spread pods evenly among hosts, availability zones (AZ), etc.
*   **Ratio-based spread:** Deploy pods to specific zones according to a defined proportion.
*   **Subset management with priority:**
    *   Deploy pods to ECS nodes first, and spill over to ECI when resources are insufficient.
    *   Deploy a fixed number of pods to one domain, and the remainder to another.
*   **Subset customization:**
    *   Control how many pods are deployed across different CPU architectures.
    *   Apply architecture-specific resource requirements or environment variables.

WorkloadSpread is conceptually similar to **UnitedDeployment** in the OpenKruise community. Each WorkloadSpread defines multiple domains called `subsets`. Each subset can define a `maxReplicas` limit. WorkloadSpread injects domain-specific configurations into the Pod via a Webhook and manages the scaling order.

## Prerequisites

*   A Kubernetes cluster running version 1.21+.
*   OpenKruise installed (v1.3.0+ for `StatefulSet` support, v1.5.0+ for customized workloads with scale sub-resources).
*   `PodWebhook` feature-gate enabled in OpenKruise.

## Installation

WorkloadSpread is disabled by default. You must configure the `WorkloadSpread` feature-gate during Helm installation or upgrade:

```bash
helm install kruise openkruise/kruise --namespace kruise-system --set featureGates="WorkloadSpread=true"
```

## Demo

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: workloadspread-demo
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: workload-xxx
  subsets:
    - name: subset-a
      requiredNodeSelectorTerm:
        matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
              - zone-a
      maxReplicas: 3
      patch:
        metadata:
          labels:
            zone: zone-a
    - name: subset-b
      requiredNodeSelectorTerm:
        matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
              - zone-b
  scheduleStrategy:
    type: Adaptive
    adaptive:
      rescheduleCriticalSeconds: 30
```

`targetRef`: Specifies the target workload. This is immutable; one workload can only be managed by one WorkloadSpread.

## Subsets

`subsets` consist of multiple domain definitions.

### Sub-fields
*   **name**: Unique identifier for the subset.
*   **maxReplicas**: The maximum number of replicas allowed in this subset. If left nil, there is no limit.
*   **minReplicas**: The minimum number of replicas expected to be scheduled for this subset.
*   **requiredNodeSelectorTerm / preferredNodeSelectorTerms**: Used to define node affinity constraints for the subset.
*   **tolerations**: Specific tolerations for Pods in this subset.
*   **patch**: Customize the Pod configuration (Annotations, Labels, Env, Resources, etc.).

### Example: Patching Pod Container Resources
```yaml
patch:
  spec:
    containers:
      - name: main
        resources:
          limits:
            cpu: "2"
            memory: 800Mi
```

## Schedule Strategy

WorkloadSpread provides two strategies; the default is `Fixed`.

*   **Fixed**: Workload is strictly spread according to the definition of the subsets.
*   **Adaptive**: Kruise monitors unschedulable Pods. If a Pod remains unschedulable beyond `rescheduleCriticalSeconds`, it is rescheduled to another subset.

## Scale Order

The workload managed by WorkloadSpread scales according to the defined order in `spec.subsets`.

*   **Scale out**: Pods are scheduled following the order of `subsets`. It moves to the next subset once `maxReplicas` is reached.
*   **Scale in**: Pods in subsets that exceed `maxReplicas` are removed first. Otherwise, pods are deleted starting from the last subset in the list.

## Using WorkloadSpread with Customized Workloads

To use WorkloadSpread with non-native workloads (e.g., Argo Rollouts), you must:
1.  Add the workload to the `WorkloadSpread_Watch_Custom_Workload_WhiteList` in the `kruise-configuration` ConfigMap.
2.  Grant the `kruise-manager` ServiceAccount read permissions via RBAC for the target resource.
3.  Ensure the target workload supports the `scale` sub-resource.

*Note: The WorkloadSpread Webhook does not set a deletion cost for Pods created by custom workloads, which may affect scale-down order.*

## Troubleshooting

1.  **Workload not scaling?** Ensure the `WorkloadSpread` feature-gate is enabled in the `kruise-manager` controller.
2.  **Pods not landing in correct subset?** Verify the `requiredNodeSelectorTerm` matches your nodes' labels exactly.
3.  **Webhook errors?** Ensure the `kruise-admission-controller` is running and that no other mutating webhooks are conflicting with the pod patching logic.

For more technical details on the implementation of subset management, refer to the [OpenKruise source code](https://github.com/openkruise/kruise/blob/master/pkg/util/workloadspread/workloadspread.go).

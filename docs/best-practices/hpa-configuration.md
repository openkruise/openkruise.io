---
title: HPA configuration
---

Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,
which means they allow systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with these resources.

Examples use `apiVersion: autoscaling/v2` (stable since Kubernetes 1.23). The older `autoscaling/v2beta1` and `autoscaling/v2beta2` APIs were removed in Kubernetes 1.25 and 1.26, respectively. For resource metrics, use `resource.target.type: Utilization` and `averageUtilization` instead of the deprecated `targetAverageUtilization` field.

### Example

Just set the CloneSet's type and name into `scaleTargetRef`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
# ...
spec:
  scaleTargetRef:
    apiVersion: apps.kruise.io/v1alpha1
    kind: CloneSet
    name: your-cloneset-name
```

Note that:

1. The HPA's namespace should be same as the namespace of your CloneSet.
2. The `apiVersion` in `scaleTargetRef` should be same as the `apiVersion` in your workload resource, such as `apps.kruise.io/v1alpha1` or `apps.kruise.io/v1beta1`.
   It depends on which version you are using for those workloads that have multiple versions, such as Advanced StatefulSet.

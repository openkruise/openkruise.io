---
title: HPA configuration
---

Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,
which means they allow systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with these resources.

### Example

Just set the CloneSet's type and name into `scaleTargetRef`:

```yaml
apiVersion: autoscaling/v2beta2
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

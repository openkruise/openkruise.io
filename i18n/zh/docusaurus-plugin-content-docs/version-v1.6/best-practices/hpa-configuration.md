---
title: HPA configuration
---

Kruise 中的 Workload，比如 CloneSet、Advanced StatefulSet、UnitedDeployment，都实现了 scale subresource。
这表示它们都可以适配 HorizontalPodAutoscaler、PodDisruptionBudget 等原生操作。

### 例子

只需要将 CloneSet 的类型、名字写入 `scaleTargetRef` 即可：

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

注意：

1. HPA 的 namespace 需要和你的 CloneSet 相同。
2. `scaleTargetRef` 中的 `apiVersion` 需要和你的 workload 中的相同，比如 `apps.kruise.io/v1alpha1` 或 `apps.kruise.io/v1beta1`。
   对于 Advanced StatefulSet 这种存在多个版本的 workload，它取决于你所使用的版本。

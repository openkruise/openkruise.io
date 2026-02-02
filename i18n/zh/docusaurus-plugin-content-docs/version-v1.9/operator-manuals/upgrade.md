# API 升级指南

OpenKruise API 正在从 v1alpha1 迁移到 v1beta1。由于使用了转换 webhook，升级过程在几个版本内是平滑的。但是，转换 webhook 会产生性能和稳定性方面的开销，建议用户在升级 OpenKruise 之前先将自己的应用程序升级到 v1beta1。

## API 更新历史

| API | 从 v1alpha1 升级到 v1beta1 | v1alpha1 移除计划 |
| --- | --- | --- |
| Advanced Statefulset | 0.8 | 2.0 |
| SidecarSet | 1.9 | 暂无计划 |
| Advanced DaemonSet | 1.9 | 暂无计划 |
| Advanced CronJob | 1.9 | 暂无计划 |
| BroadcastJob | 1.9 | 暂无计划 |
| ImageListPullJob | 1.9 | 暂无计划 |
| ImagePullJob | 1.9 | 暂无计划 |
| NodeImage | 1.9 | 暂无计划 |
| CloneSet | 2.0（计划中） | 暂无计划 |
| WorkloadSpread | 2.0（计划中） | 暂无计划 |
| UnitedDeployment | 2.0（计划中） | 暂无计划 |
| PersistentPodState | 2.0（计划中） | 暂无计划 |
| PodUnavailableBudget | 2.0（计划中） | 暂无计划 |
| PodProbeMarker | 2.0（计划中） | 暂无计划 |
| NodePodProbe | 2.0（计划中） | 暂无计划 |

## API 更新详情

| API | v1alpha1 | v1beta1 | 说明 |
| --- | --- | --- | --- |
| SidecarSet | `spec.namespace` | 使用带 `"kubernetes.io/metadata.name"` 标签的 `spec.namespaceSelector` | `spec.namespace` 已被弃用，可以用带 `"kubernetes.io/metadata.name"` 标签的 `namespaceSelector` 替代 |
| | `"apps.kruise.io/sidecarset-custom-version"` 注解 | `spec.customVersion` | - |
| advanced DaemonSet | `"daemonset.kruise.io/progressive-create-pod"` 注解 | `Spec.ScaleStrategy` | - |
| | `status.DaemonSetHash` | `status.UpdateRevision` | - |
| | `spec.Partition *int32` | `spec.Partition *intstr.IntOrString` | `spec.Partition` 现在可以是指向字符串的指针，例如 50% |
| | `Spec.UpdateStrategy.RollingUpdate.Type`: Surging | `Spec.UpdateStrategy.RollingUpdate.Type`: Standard | `Surging RollingUpdate.Type` 已被弃用，将被视为标准类型 |
---
title: API Upgrade Guide
---

OpenKruise API is migrating from v1alpha1 to v1beta1. The upgrade process is smooth within several versions 
since conversion webhook is used. However, conversion webhook incur performance and resilience overheads, 
and the users are suggested to upgrade their applications to v1beta1 before upgrading OpenKruise.

## API Update History



| API                                                                                                                                            | promoted from v1alpha1 to v1beta1 | v1alpha1 removal plan |
|------------------------------------------------------------------------------------------------------------------------------------------------| --- |-----------------------|
| Advanced Statefulset                                                                                                                           | 0.8 | 2.0                   | 
| SidecarSet                                                                                                                                     | 1.9 | not planed yet        |
| Advanced DaemonSet                                                                                                                             | 1.9 | not planed yet        |
| Advanced CronJob                                                                                                                               | 1.9 | not planed yet        |
| BroadcastJob                                                                                                                                   | 1.9 | not planed yet        |
| ImageListPullJob                                                                                                                               | 1.9 | not planed yet        |
| ImagePullJob                                                                                                                                   | 1.9 | not planed yet        |
| NodeImage<br/>                                                                                                                                 | 1.9 | not planed yet        |
| CloneSet                                                                                                                                       | 2.0 (planned) | not planed yet        |
| WorkloadSpread                                                                                                                                 | 2.0 (planned) | not planed yet        |
| UnitedDeployment                          | 2.0 (planned) | not planed yet        |
| PersistentPodState | 2.0 (planned) | not planed yet        |
| PodUnavailableBudget | 2.0 (planned) | not planed yet        |
| PodProbeMarker | 2.0 (planned) | not planed yet        |
| NodePodProbe | 2.0 (planned) | not planed yet        |


## API Update Detail

| API | v1alpha1 | v1beta1 | Description |
| --- | --- | --- | --- |
| SidecarSet | spec.namespace | using spec.namespaceSelector with "kubernetes.io/metadata.name" label | spec.namespace is deprecated, and one can use namespaceSelector with "kubernetes.io/metadata.name" label instead |
| | "apps.kruise.io/sidecarset-custom-version" annotation<br/> | spec.customVersion<br/> |  |
| advanced DaemonSet | "daemonset.kruise.io/progressive-create-pod" annotation | Spec.ScaleStrategy |  |
| | status.DaemonSetHash | status.UpdateRevision |  |
| | spec.Partition *int32 | spec.Partition *intstr.IntOrString | spec.Partition now can be a pointer to string, e.g. 50% |
| | Spec.UpdateStrategy.RollingUpdate.Type: Surging<br/> | Spec.UpdateStrategy.RollingUpdate.Type: Standard | Surging RollingUpdate.Type is deprecated, and will be treated as standard type.  |


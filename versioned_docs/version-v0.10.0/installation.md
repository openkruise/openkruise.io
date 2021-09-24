---
title: Installation
---

Although OpenKruise now can work with Kubernetes version >= `1.13`, we strongly recommend you to use Kruise with **Kubernetes version >= 1.16**. 

Note that:
1. For Kubernetes 1.13 and 1.14, users must enable `CustomResourceWebhookConversion` feature-gate in kube-apiserver before install or upgrade Kruise.
2. Currently Kruise can not be installed into Kubernetes 1.22, for it has dropped v1beta1 version of some resources like CRD/WebhookConfiguration.
   The comming Kruise v1.0 will fix it and do not support Kubernetes version lower than 1.16 any more.

## Install with helm charts

Kruise can be simply installed by helm v3.1+, which is a simple command-line tool and you can get it from [here](https://github.com/helm/helm/releases).

```bash
# Kubernetes 1.13 and 1.14
helm install kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz --disable-openapi-validation

# Kubernetes 1.15 and newer versions
helm install kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz
```

## Upgrade with helm charts

If you are using Kruise with an old version, it is recommended that you should upgrade to the latest version for safety and more features:

```bash
# Kubernetes 1.13 and 1.14
helm upgrade kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz --disable-openapi-validation

# Kubernetes 1.15 and newer versions
helm upgrade kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz
```

Note that:

1. Before upgrade, you **must** firstly read the [Change Log](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md)
   to make sure that you have understand the breaking changes in the new version.
2. If you want to drop the chart parameters you configured for the old release or set some new parameters,
   it is recommended to add `--reset-values` flag in `helm upgrade` command.

## Options

Note that installing this chart directly means it will use the default template values for Kruise.

You may have to set your specific configurations if it is deployed into a production cluster, or you want to configure feature-gates.

### Optional: chart parameters

The following table lists the configurable parameters of the chart and their default values.

| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `featureGates`                            | Feature gates for Kruise, empty string means all by default  | ``                            |
| `installation.namespace`                  | namespace for kruise installation                            | `kruise-system`               |
| `manager.log.level`                       | Log level that kruise-manager printed                        | `4`                           |
| `manager.replicas`                        | Replicas of kruise-controller-manager deployment             | `2`                           |
| `manager.image.repository`                | Repository for kruise-manager image                          | `openkruise/kruise-manager`   |
| `manager.image.tag`                       | Tag for kruise-manager image                                 | `v0.10.0`                     |
| `manager.resources.limits.cpu`            | CPU resource limit of kruise-manager container               | `100m`                        |
| `manager.resources.limits.memory`         | Memory resource limit of kruise-manager container            | `256Mi`                       |
| `manager.resources.requests.cpu`          | CPU resource request of kruise-manager container             | `100m`                        |
| `manager.resources.requests.memory`       | Memory resource request of kruise-manager container          | `256Mi`                       |
| `manager.metrics.port`                    | Port of metrics served                                       | `8080`                        |
| `manager.webhook.port`                    | Port of webhook served                                       | `9443`                        |
| `manager.nodeAffinity`                    | Node affinity policy for kruise-manager pod                  | `{}`                          |
| `manager.nodeSelector`                    | Node labels for kruise-manager pod                           | `{}`                          |
| `manager.tolerations`                     | Tolerations for kruise-manager pod                           | `[]`                          |
| `daemon.log.level`                        | Log level that kruise-daemon printed                         | `4`                           |
| `daemon.port`                             | Port of metrics and healthz that kruise-daemon served        | `10221`                       |
| `daemon.resources.limits.cpu`             | CPU resource limit of kruise-daemon container                | `50m`                         |
| `daemon.resources.limits.memory`          | Memory resource limit of kruise-daemon container             | `128Mi`                       |
| `daemon.resources.requests.cpu`           | CPU resource request of kruise-daemon container              | `0`                           |
| `daemon.resources.requests.memory`        | Memory resource request of kruise-daemon container           | `0`                           |
| `daemon.affinity`                         | Affinity policy for kruise-daemon pod                        | `{}`                          |
| `daemon.socketLocation`                   | Location of the container manager control socket             | `/var/run`                    |
| `webhookConfiguration.failurePolicy.pods` | The failurePolicy for pods in mutating webhook configuration | `Ignore`                      |
| `webhookConfiguration.timeoutSeconds`     | The timeoutSeconds for all webhook configuration             | `30`                          |
| `crds.managed`                            | Kruise will not install CRDs with chart if this is false     | `true`                        |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install` or `helm upgrade`.

### Optional: feature-gate

Feature-gate controls some influential features in Kruise:

| Name                   | Description                                                  | Default | Effect (if closed)                   |
| ---------------------- | ------------------------------------------------------------ | ------- | --------------------------------------
| `PodWebhook`           | Whether to open a webhook for Pod **create**                 | `true`  | SidecarSet/KruisePodReadinessGate disabled    |
| `KruiseDaemon`         | Whether to deploy `kruise-daemon` DaemonSet                  | `true`  | ImagePulling/ContainerRecreateRequest disabled |
| `DaemonWatchingPod`    | Should each `kruise-daemon` watch pods on the same node      | `true`  | For in-place update with same imageID or env from labels/annotations |
| `CloneSetShortHash`    | Enables CloneSet controller only set revision hash name to pod label | `false` | CloneSet name can not be longer than 54 characters |
| `KruisePodReadinessGate` | Enables Kruise webhook to inject 'KruisePodReady' readiness-gate to all Pods during creation | `false` | The readiness-gate will only be injected to Pods created by Kruise workloads |
| `PreDownloadImageForInPlaceUpdate` | Enables CloneSet controller to create ImagePullJobs to pre-download images for in-place update | `false` | No image pre-download for in-place update |
| `CloneSetPartitionRollback` | Enables CloneSet controller to rollback Pods to currentRevision when number of updateRevision pods is bigger than (replicas - partition) | `false` | CloneSet will only update Pods to updateRevision |
| `ResourcesDeletionProtection` | Enables protection for resources deletion              | `false` | No protection for resources deletion |
| `TemplateNoDefaults` | Whether to disable defaults injection for pod/pvc template in workloads | `false` | Should not close this feature if it has open |
| `PodUnavailableBudgetDeleteGate` | Enables PodUnavailableBudget for pod deletion, eviction              | `false` | No protection for pod deletion, eviction |
| `PodUnavailableBudgetUpdateGate` | Enables PodUnavailableBudget for pod.Spec update              | `false` | No protection for in-place update |
| `WorkloadSpread`                 | Enables WorkloadSpread to manage multi-domain and elastic deploy  | `false` | WorkloadSpread disabled | 

If you want to configure the feature-gate, just set the parameter when install or upgrade. Such as:

```bash
$ helm install kruise https://... --set featureGates="ResourcesDeletionProtection=true\,PreDownloadImageForInPlaceUpdate=true"
```

If you want to enable all feature-gates, set the parameter as `featureGates=AllAlpha=true`.

### Optional: the local image for China

If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:

```bash
$ helm install kruise https://... --set  manager.image.repository=openkruise-registry.cn-hangzhou.cr.aliyuncs.com/openkruise/kruise-manager
```

## Uninstall

Note that this will lead to all resources created by Kruise, including webhook configurations, services, namespace, CRDs, CR instances and Pods managed by Kruise controller, to be deleted!

Please do this ONLY when you fully understand the consequence.

To uninstall kruise if it is installed with helm charts:

```bash
$ helm uninstall kruise
release "kruise" uninstalled
```

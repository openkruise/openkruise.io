---
title: Installation
---

- Since v1.0.0 (alpha/beta), OpenKruise requires **Kubernetes version >= 1.16**.

- Since v1.5.0(alpha/beta), OpenKruise no longer supports dockershim. If you still use Docker Engine to run containers in Kubernetes,
you can [Migrate Docker Engine nodes from dockershim to cri-dockerd.](https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)

- Since v1.6.0 (alpha/beta), OpenKruise requires **Kubernetes version >= 1.18**. However it's still possible to use OpenKruise with Kubernetes versions 1.16 and 1.17 as long as KruiseDaemon is not enabled(install/upgrade kruise charts with featureGates="KruiseDaemon=false")

- Since v1.6.0 (alpha/beta), KruiseDaemon will **no longer support v1alpha2 CRI runtimes**. However, it is still possible to use OpenKruise on Kubernetes clusters with nodes that only support v1alpha2 CRI, as long as KruiseDaemon is not enabled (install/upgrade Kruise charts with featureGates="KruiseDaemon=false").

## Install with helm

Kruise can be simply installed by helm v3.5+, which is a simple command-line tool and you can get it from [here](https://github.com/helm/helm/releases).

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.7.0
```
**Note:** [Changelog](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md).

## Upgrade with helm

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Upgrade to the latest version.
$ helm upgrade kruise openkruise/kruise --version 1.7.0 [--force]
```

Note that:

1. Before upgrade, you **must** firstly read the [Change Log](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md)
   to make sure that you have understand the breaking changes in the new version.
2. If you want to drop the chart parameters you configured for the old release or set some new parameters,
   it is recommended to add `--reset-values` flag in `helm upgrade` command.
   Otherwise you should use `--reuse-values` flag to reuse the last release's values.
3. If you are **upgrading Kruise from 0.x to 1.x**, you must add `--force` for upgrade command. Otherwise it is an optional flag.

## Optional: download charts manually

If you have problem with connecting to `https://openkruise.github.io/charts/` in production, you might need to download the chart from [here](https://github.com/openkruise/charts/releases) manually and install or upgrade with it.

```bash
$ helm install/upgrade kruise /PATH/TO/CHART
```

## Options

Note that installing this chart directly means it will use the default template values for Kruise.

You may have to set your specific configurations if it is deployed into a production cluster, or you want to configure feature-gates.

### Optional: chart parameters

The following table lists the configurable parameters of the chart and their default values.

#### setup parameters
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `featureGates`                            | Feature gates for Kruise, empty string means all enabled     | `""`                           |
| `installation.namespace`                  | Namespace for kruise installation                            | `kruise-system`               |
| `installation.createNamespace`            | Whether to create the installation.namespace                 | `true`                        |
| `installation.roleListGroups` | ApiGroups which kruise is permit to list, default set to be all | `*` |
| `crds.managed`                            | Kruise will not install CRDs with chart if this is false     | `true`                        |
| `imagePullSecrets`                        | The list of image pull secrets for kruise image              | `[]`                       |

#### manager parameters
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `manager.log.level`                       | Log level that kruise-manager printed                        | `4`                           |
| `manager.replicas`                        | Replicas of kruise-controller-manager deployment             | `2`                           |
| `manager.image.repository`                | Repository for kruise-manager image                          | `openkruise/kruise-manager`   |
| `manager.image.tag`                       | Tag for kruise-manager image                                 | `v1.7.0`                      |
| `manager.resources.limits.cpu`            | CPU resource limit of kruise-manager container               | `200m`                        |
| `manager.resources.limits.memory`         | Memory resource limit of kruise-manager container            | `512Mi`                       |
| `manager.resources.requests.cpu`          | CPU resource request of kruise-manager container             | `100m`                        |
| `manager.resources.requests.memory`       | Memory resource request of kruise-manager container          | `256Mi`                       |
| `manager.metrics.port`                    | Port of metrics served                                       | `8080`                        |
| `manager.webhook.port`                    | Port of webhook served                                       | `9443`                        |
| `manager.pprofAddr`                       | Address of pprof served                                      | `localhost:8090`              |
| `manager.nodeAffinity`                    | Node affinity policy for kruise-manager pod                  | `{}`                          |
| `manager.nodeSelector`                    | Node labels for kruise-manager pod                           | `{}`                          |
| `manager.tolerations`                     | Tolerations for kruise-manager pod                           | `[]`                          |
| `manager.resyncPeriod`                    | Resync period of informer kruise-manager, defaults no resync | `0`                           |
| `manager.hostNetwork`                     | Whether kruise-manager pod should run with hostnetwork       | `false`                       |
| `manager.loggingFormat`                   | Logging format, valid formats includes ` `(plain text), `json` | ` `                       |

#### daemon parameters
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `daemon.extraEnvs`                        | Extra environment variables that will be pass onto pods      | `[]`                          |
| `daemon.log.level`                        | Log level that kruise-daemon printed                         | `4`                           |
| `daemon.port`                             | Port of metrics and healthz that kruise-daemon served        | `10221`                       |
| `daemon.pprofAddr`                        | Address of pprof served                                      | `localhost:10222`             |
| `daemon.resources.limits.cpu`             | CPU resource limit of kruise-daemon container                | `50m`                         |
| `daemon.resources.limits.memory`          | Memory resource limit of kruise-daemon container             | `128Mi`                       |
| `daemon.resources.requests.cpu`           | CPU resource request of kruise-daemon container              | `0`                           |
| `daemon.resources.requests.memory`        | Memory resource request of kruise-daemon container           | `0`                           |
| `daemon.affinity`                         | Affinity policy for kruise-daemon pod                        | `{}`                          |
| `daemon.socketLocation`                   | Location of the container manager control socket             | `/var/run`                    |
| `daemon.socketFile`                       | Specify the socket file name in `socketLocation` (if you are not using containerd/docker/pouch/cri-o) | ` ` |
| `daemon.credentialProvider.enable`        | Whether to enable credential provider for image pull job     | `false`                       |
| `daemon.credentialProvider.hostPath`      | node dir of the credential provider plugin, kruise-daemon will mount the dir as a hostpath volume | `credential-provider-plugin` |
| `daemon.credentialProvider.configmap`     | configmap name of the credential provider in kruise-system ns  | `credential-provider-config`  |
| `daemon.credentialProvider.awsCredentialsDir`     | aws credentials dir if using AWS, for example: `/root/.aws`  | ` `  |

#### other parameters
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `enableKubeCacheMutationDetector`         | Whether to enable KUBE_CACHE_MUTATION_DETECTOR               | `false`                       |
| `webhookConfiguration.timeoutSeconds`     | The timeoutSeconds for all webhook configuration             | `30`                          |
| `serviceAccount.annotations`      | Annotations to patch for serviceAccounts | `{}` |
| `externalCerts.annotations`       | Annotations to patch for webhook configuration and crd when featuregate `EnableExternalCerts` is enabled. For example, `cert-manager.io/inject-ca-from: kruise-system/kruise-webhook-certs`. | `{}` |

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
| `ResourcesDeletionProtection` | Enables protection for resources deletion              | `true` | No protection for resources deletion |
| `TemplateNoDefaults` | Whether to disable defaults injection for pod/pvc template in workloads | `false` | Should not close this feature if it has open |
| `PodUnavailableBudgetDeleteGate` | Enables PodUnavailableBudget for pod deletion, eviction           | `true` | No protection for pod deletion, eviction |
| `PodUnavailableBudgetUpdateGate` | Enables PodUnavailableBudget for pod.Spec update                  | `false` | No protection for in-place update |
| `WorkloadSpread`                 | Enables WorkloadSpread to manage multi-domain and elastic deploy  | `true` | WorkloadSpread disabled |
| `InPlaceUpdateEnvFromMetadata`   | Enables Kruise to in-place update a container in Pod when its env from labels/annotations changed and pod is in-place updating | `true` | Only container image can be in-place update |
| `StatefulSetAutoDeletePVC`       | Enables policies controlling deletion of PVCs created by a StatefulSet  | `true` | No deletion of PVCs by StatefulSet |
| `PreDownloadImageForDaemonSetUpdate`       | Enables DaemonSet controller to create ImagePullJobs to pre-download images for in-place update  | `false` | No image pre-download for in-place update |
| `PodProbeMarkerGate`   | Whether to turn on PodProbeMarker ability  | `true` | PodProbeMarker disabled |
| `SidecarSetPatchPodMetadataDefaultsAllowed`   | Allow SidecarSet patch any annotations to Pod Object | `false` | Annotations are not allowed to patch randomly and need to be configured via SidecarSet_PatchPodMetadata_WhiteList |
| `SidecarTerminator`   | SidecarTerminator enables SidecarTerminator to stop sidecar containers when all main containers exited | `false` | SidecarTerminator disabled |
| `CloneSetEventHandlerOptimization`   | CloneSetEventHandlerOptimization enable optimization for cloneset-controller to reduce the queuing frequency cased by pod update | `false` | optimization for cloneset-controller to reduce the queuing frequency cased by pod update disabled |
| `ImagePullJobGate`                 | Enables ImagePullJob to pre-download images  | `false` | ImagePullJob disabled |
| `ResourceDistributionGate`         | Enables ResourceDistribution to distribute configmaps or secret resources  | `false` | ResourceDistribution disabled |
| `DeletionProtectionForCRDCascadingGate`         | Enables DeletionProtection for crd cascading deletion  | `false` | DeletionProtection for crd cascading deletion disabled |

If you want to configure the feature-gate, just set the parameter when install or upgrade. Such as:

```bash
$ helm install kruise https://... --set featureGates="ResourcesDeletionProtection=true\,PreDownloadImageForInPlaceUpdate=true"
```

If you want to enable all feature-gates, set the parameter as `featureGates=AllAlpha=true`.

### Optional: the local image for China

If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:

```bash
$ helm install kruise https://... --set  manager.image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/kruise-manager
```

## Best Practices

### Installation parameters for K3s

Usually K3s has the different runtime path from the default `/var/run`. So you have to set `daemon.socketLocation` to the real runtime socket path on your K3s node (e.g. `/run/k3s` or `/var/run/k3s/`).

### Installation parameters for AWS EKS

When using a custom CNI (such as Weave or Calico) on EKS, the webhook cannot be reached by default. This happens because the control plane cannot be configured to run on a custom CNI on EKS, so the CNIs differ between control plane and worker nodes.

To address this, the webhook can be run in the host network so it can be reached, by setting `--set manager.hostNetwork=true` when use helm install or upgrade.

### Support webhook CA injection using external certification management tool
**FEATURE STATE:** Kruise v1.7.0

Kruise needs certificates to enable mutating, validating and conversion webhooks. By default, kruise will generate self-signed certificates for webhook server.
If you want to use external certification management tool, e.g. cert-manager, you can follow these steps when install or upgrade:

1. Install external certification management tool, e.g. [cert-manager](https://cert-manager.io/docs/installation/helm/).
2. Create issuer and certificate resources if you have not done this before.
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kruise-webhook-certs
  # consistent with installation.namespace
  namespace: kruise-system
spec:
  # where to store the certificates
  # cert-manager would generate a secret kruise-system/kruise-webhook-certs with the certificates
  # DO NOT CHANGE THE SECRET NAME SINCE KRUISE READ CERTS FROM THIS SECRET
  secretName: kruise-webhook-certs
  dnsNames:
  - kruise-webhook-service.kruise-system.svc
  - localhost
  issuerRef:
    name: selfsigned-kruise
    kind: Issuer
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned-kruise
  namespace: kruise-system
spec:
  selfSigned: {}
```
3. During installation and upgrade, enable external certs support by setting featureGates=EnableExternalCerts=true and specify extra annotations that should be added to webhookconfiguration and CRD.
```
helm install kruise https://... --set featureGates="EnableExternalCerts=true" --set-json externalCerts.annotations='{"cert-manager.io/inject-ca-from":"kruise-system/kruise-webhook-certs"}'
```

Visit [CA Injector - cert manager](https://cert-manager.io/docs/concepts/ca-injector/) for more details.

### Structured Logs
**FEATURE STATE:** Kruise v1.7.0

Logs are an essential aspect of observability and a critical tool for debugging. But OpenKruise logs have traditionally been unstructured strings, making any automated parsing difficult and any downstream processing, analysis, or querying challenging to do reliably.

From OpenKruise 1.7, we are adding support for structured logs, which natively support (key, value) pairs and object references.
And logs can also be outputted in JSON format using `helm install ... --set manager.loggingFormat=json`.

For example, this invocation of InfoS:

```
klog.V(3).InfoS("SidecarSet updated status success", "sidecarSet", klog.KObj(sidecarSet), "matchedPods", status.MatchedPods,
"updatedPods", status.UpdatedPods, "readyPods", status.ReadyPods, "updateReadyPods", status.UpdatedReadyPods)
```

will result in this log:

```
I0821 14:22:35.587919       1 sidecarset_processor.go:280] "SidecarSet updated status success" sidecarSet="test-sidecarset" matchedPods=1 updatedPods=1 readyPods=1 updateReadyPods=1
```

Or, if `helm install ... --set manager.loggingFormat=json`, it will result in this output:

```json
{
  "ts": 1724239224606.642,
  "caller": "sidecarset/sidecarset_processor.go:280",
  "msg": "SidecarSet updated status success",
  "v": 3,
  "sidecarSet": {
    "name": "test-sidecarset"
  },
  "matchedPods": 1,
  "updatedPods": 1,
  "readyPods": 0,
  "updateReadyPods": 0
}
```

## Uninstall

Note that this will lead to all resources created by Kruise, including webhook configurations, services, namespace, CRDs, CR instances and Pods managed by Kruise controller, to be deleted!

Please do this ONLY when you fully understand the consequence.

To uninstall kruise if it is installed with helm charts:

```bash
$ helm uninstall kruise
release "kruise" uninstalled
```

## Kruise State Metrics

[kruise-state-metrics](https://github.com/openkruise/kruise-state-metrics) is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.
It is not focused on the health of the individual OpenKruise components, but rather on the health of the various objects inside, such as clonesets, advanced statefulsets and sidecarsets.

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise-state-metrics --version 0.1.0
```

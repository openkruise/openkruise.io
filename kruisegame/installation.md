# Installation

## Install OpenKruiseGame（OKG)

### Installation Instructions

Installing OpenKruiseGame requires Kruise and Kruise-Game to be installed and Kubernetes version >= 1.18.

### Install Kruise

We recommend that you use Helm V3.5 or later to install Kruise.

```shell
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/
# [Optional]
$ helm repo update
# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.8.0
```

### Install Kruise-Game

```shell
$ helm install kruise-game openkruise/kruise-game --version 1.0.0
```

### Upgrade Kruise-Game

```shell
$ helm upgrade kruise-game openkruise/kruise-game --version 1.0.0 [--force]
```

### Options

#### Optional: install/upgrade with customized configurations

The following table lists the configurable parameters of the kruise-game chart and their default values.

| Parameter                                  | Description                                                                                      | Default                          |
|--------------------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------|
| `installation.namespace`                   | Namespace for kruise-game operation installation                                                 | `kruise-game-system`             |
| `installation.createNamespace`             | Whether to create the installation.namespace                                                     | `true`                           |
| `kruiseGame.fullname`                      | Nick name for kruise-game deployment and other configurations                                    | `kruise-game-controller-manager` |
| `kruiseGame.healthBindPort`                | Port for checking health of kruise-game container                                                | `8082`                           |
| `kruiseGame.webhook.port`                  | Port of webhook served by kruise-game container                                                  | `443`                            |
| `kruiseGame.webhook.targetPort`            | ObjectSelector for workloads in MutatingWebhookConfigurations                                    | `9876`                           |
| `kruiseGame.apiServerQps`                  | Maximum sustained queries per second to send to the API server of kruise-game-controller-manager | `5`                              |
| `kruiseGame.apiServerQpsBurst`             | Maximum burst queries per second to send to the API server of kruise-game-controller-manager     | `10`                             |
| `replicaCount`                             | Replicas of kruise-game deployment                                                               | `1`                              |
| `image.repository`                         | Repository for kruise-game image                                                                 | `openkruise/kruise-game-manager` |
| `image.tag`                                | Tag for kruise-game image                                                                        | `v0.10.0`                        |
| `image.pullPolicy`                         | ImagePullPolicy for kruise-game container                                                        | `Always`                         |
| `serviceAccount.annotations`               | The annotations for serviceAccount of kruise-game                                                | ` `                              |
| `resources.limits.cpu`                     | CPU resource limit of kruise-game container                                                      | `500m`                           |
| `resources.limits.memory`                  | Memory resource limit of kruise-game container                                                   | `1Gi`                            |
| `resources.requests.cpu`                   | CPU resource request of kruise-game container                                                    | `10m`                            |
| `resources.requests.memory`                | Memory resource request of kruise-game container                                                 | `64Mi`                           |
| `prometheus.enabled`                       | Whether to bind metric endpoint                                                                  | `false`                          |
| `prometheus.monitorService.port`           | Port of the monitorservice bind to                                                               | `8080`                           |
| `scale.service.port`                       | Port of the external scaler server binds to                                                      | `6000`                           |
| `scale.service.targetPort`                 | TargetPort of the external scaler server binds to                                                | `6000`                           |
| `network.totalWaitTime`                    | Maximum time to wait for network ready, the unit is seconds                                      | `60`                             |
| `network.probeIntervalTime`                | Time interval for detecting network status, the unit is seconds                                  | `5`                              |
| `cloudProvider.installCRD`                 | Whether to install CloudProvider CRD                                                             | `true`                           |
| `indexOffsetScheduler.enabled`             | Whether to install index-offset-scheduler                                                        | `false`                          |
| `certificates.autoGenerated`               | Whether to auto-generate webhook certificates                                                    | `true`                           |
| `certificates.secretName`                  | Name of the secret containing webhook certificates                                               | `kruise-game-certs`              |
| `certificates.mountPath`                   | Path to mount webhook certificates in container                                                  | `/tmp/webhook-certs/`            |
| `certificates.certManager.enabled`         | Whether to use cert-manager for certificate management                                           | `false`                          |
| `certificates.certManager.duration`        | Certificate validity duration                                                                    | `8760h0m0s`                      |
| `certificates.certManager.renewBefore`     | Time before expiry to renew certificate                                                          | `5840h0m0s`                      |
| `certificates.certManager.generateCA`      | Whether to generate a Certificate Authority                                                      | `true`                           |
| `certificates.certManager.caSecretName`    | Name of the secret containing the CA certificate                                                 | `kruise-game-ca`                 |
| `certificates.certManager.issuer.generate` | Whether to generate the issuer automatically                                                     | `true`                           |
| `certificates.certManager.issuer.name`     | Name of the certificate issuer                                                                   | `kruise-ca`                      |
| `certificates.certManager.issuer.kind`     | Type of the certificate issuer                                                                   | `ClusterIssuer`                  |
| `certificates.certManager.issuer.group`    | API group of the certificate issuer                                                              | `cert-manager.io`                |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

#### Optional: the local image for China

If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:

```bash
$ helm install kruise-game https://... --set image.repository=registry-cn-hangzhou.ack.aliyuncs.com/acs/kruise-game-manager
```

## Uninstall OpenKruiseGame（OKG）

Note that this will lead to all resources created by kruise-game, including webhook configurations, services, namespace, CRDs and CR instances kruise-game controller, to be deleted!

Please do this ONLY when you fully understand the consequence.

To uninstall kruise-game if it is installed with helm charts:

```bash
$ helm uninstall kruise-game
release "kruise-game" uninstalled
```

## FAQ

Q: Error `no matches for kind "ServiceMonitor" in version "monitoring.coreos.com/v1"`
A: This is because the cluster does not have the prometheus operator installed. enabling the playsuit monitoring feature requires the prometheus operator to be installed on the Kubernetes cluster. If you do not use this feature, you can set prometheus.enabled to false during installation (the default is true)

Q: Error `CustomResourceDefinition "poddnats.alibabacloud.com" in namespace "" exists and cannot be imported into the cureent release`
A: This is because the CRD is already installed in the cluster and you can set cloudProvider.installCRD to false during installation (default is true)

## What's Next
Here are some recommended next steps:
- Learn kruise-game's [Deploy GameServers](user-manuals/deploy-gameservers.md).

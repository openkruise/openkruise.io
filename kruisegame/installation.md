# Installation

## Requirements

Install Kubernetes Cluster, requires **Kubernetes version >= 1.16**.
## Install Kruise

We recommend that you use Helm V3.5 or later to install Kruise.

```shell
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.4.0
```

## Install Kruise-Game

```shell
$ helm install kruise-game openkruise/kruise-game --version 0.2.1
```

## Optional: install/upgrade with customized configurations

The following table lists the configurable parameters of the kruise-game chart and their default values.

| Parameter                        | Description                                                       | Default                             |
|----------------------------------|-------------------------------------------------------------------|-------------------------------------|
| `installation.namespace`         | Namespace for kruise-game operation installation                  | `kruise-game-system`                |
| `installation.createNamespace`   | Whether to create the installation.namespace                      | `true`                              |
| `kruiseGame.fullname`            | Nick name for kruise-game deployment and other configurations     | `kruise-game-controller-manager`    |
| `kruiseGame.healthBindPort`      | Port for checking health of kruise-game container                 | `8082`                              |
| `kruiseGame.webhook.port`        | Port of webhook served by kruise-game container                   | `443`                               |
| `kruiseGame.webhook.targetPort`  | ObjectSelector for workloads in MutatingWebhookConfigurations     | `9876`                              |
| `replicaCount`                   | Replicas of kruise-game deployment                                | `1`                                 |
| `image.repository`               | Repository for kruise-game image                                  | `openkruise/kruise-game-manager`    |
| `image.tag`                      | Tag for kruise-game image                                         | `v0.2.1`                            |
| `image.pullPolicy`               | ImagePullPolicy for kruise-game container                         | `Always`                            |
| `serviceAccount.annotations`     | The annotations for serviceAccount of kruise-game                 | ` `                                 |
| `resources.limits.cpu`           | CPU resource limit of kruise-game container                       | `500m`                              |
| `resources.limits.memory`        | Memory resource limit of kruise-game container                    | `1Gi`                               |
| `resources.requests.cpu`         | CPU resource request of kruise-game container                     | `10m`                               |
| `resources.requests.memory`      | Memory resource request of kruise-game container                  | `64Mi`                              |


Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

### Optional: the local image for China

If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:

```bash
$ helm install kruise-game https://... --set image.repository=registry.cn-hangzhou.aliyuncs.com/acs/kruise-game-manager:v0.2.1
...
```

## Uninstall

Note that this will lead to all resources created by kruise-game, including webhook configurations, services, namespace, CRDs and CR instances kruise-game controller, to be deleted!

Please do this ONLY when you fully understand the consequence.

To uninstall kruise-game if it is installed with helm charts:

```bash
$ helm uninstall kruise-game
release "kruise-game" uninstalled
```

## What's Next
Here are some recommended next steps:
- Learn kruise-game's [Deploy GameServers](user-manuals/deploy-gameservers.md).

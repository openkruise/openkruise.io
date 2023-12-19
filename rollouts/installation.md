# Installation

## Requirements

- Install Kubernetes Cluster, requires **Kubernetes version >= 1.19**.
- (Optional, If Use CloneSet) Helm installation of OpenKruise, **Since v1.1.0**, Reference [Install OpenKruise](https://openkruise.io/docs/installation).

## Install with helm

Kruise Rollout can be simply installed by helm v3.1+, which is a simple command-line tool and you can get it from [here](https://github.com/helm/helm/releases).

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise-rollout openkruise/kruise-rollout --version 0.5.0
```
**Note:** [Changelog](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md).
## Upgrade with helm

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Upgrade to the latest version.
$ helm upgrade kruise-rollout openkruise/kruise-rollout --version 0.5.0 [--force]
```

Note that:

1. Before upgrade, you **must** firstly read the [Change Log](https://github.com/openkruise/rollouts/blob/master/CHANGELOG.md)
   to make sure that you have understand the breaking changes in the new version.
2. If you want to drop the chart parameters you configured for the old release or set some new parameters,
   it is recommended to add `--reset-values` flag in `helm upgrade` command.
   Otherwise you should use `--reuse-values` flag to reuse the last release's values.

## Optional: install/upgrade with customized configurations

The following table lists the configurable parameters of the kruise chart and their default values, more details can be found in [this chart repo](https://github.com/openkruise/charts/blob/master/versions/kruise-rollout/0.3/values.yaml).

| Parameter                        | Description                                                       | Default                             |
|----------------------------------|-------------------------------------------------------------------|-------------------------------------|
| `installation.namespace`         | Namespace for kruise-rollout operation installation               | `kruise-rollout`                    |
| `installation.createNamespace`   | Whether to create the installation.namespace                      | `true`                              |
| `rollout.fullname`               | Nick name for kruise-rollout deployment and other configurations  | `kruise-rollout-controller-manager` |
| `rollout.featureGates`           | Feature gates for kruise-rollout, empty string means all disabled | `AdvancedDeployment=true`           |
| `rollout.healthBindPort`         | Port for checking health of kruise-rollout container              | `8081`                              |
| `rollout.metricsBindAddr`        | Port of metrics served by kruise-rollout container                | `127.0.0.1:8080`                    |
| `rollout.log.level`              | Log level that kruise-rollout printed                             | `4`                                 |
| `rollout.webhook.port`           | Port of webhook served by kruise-rollout container                | `9876`                              |
| `rollout.webhook.objectSelector` | ObjectSelector for workloads in MutatingWebhookConfigurations     | ` `                                 |
| `image.repository`               | Repository for kruise-rollout image                               | `openkruise/kruise-rollout`         |
| `image.tag`                      | Tag for kruise-rollout image                                      | `v0.3.0`                            |
| `image.pullPolicy`               | ImagePullPolicy for kruise-rollout container                      | `Always`                            |
| `imagePullSecrets`               | The list of image pull secrets for kruise-rollout image           | ` `                                 |
| `resources.limits.cpu`           | CPU resource limit of kruise-rollout container                    | `500m`                              |
| `resources.limits.memory`        | Memory resource limit of kruise-rollout container                 | `1Gi`                               |
| `resources.requests.cpu`         | CPU resource request of kruise-rollout container                  | `100m`                              |
| `resources.requests.memory`      | Memory resource request of kruise-rollout container               | `256Mi`                             |
| `replicaCount`                   | Replicas of kruise-rollout deployment                             | `2`                                 |
| `service.port`                   | Port of webhook served by kruise-rollout webhook service          | `443`                               |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,
```bash
$ helm install kruise-rollout openkruise/kruise-rollout --version 0.5.0 --set resources.limits.memory=2Gi
```

#### Optional: the local image for China

If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:

```bash
$ helm install kruise https://... --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/kruise-rollout
...
```

## Uninstall

Note that this will lead to all resources created by Kruise Rollout, including webhook configurations, services, namespace, CRDs and CR instances Kruise Rollout controller, to be deleted!

Please do this ONLY when you fully understand the consequence.

To uninstall kruise rollout if it is installed with helm charts:

```bash
$ helm uninstall kruise-rollout
release "kruise-rollout" uninstalled
```

## What's Next
Here are some recommended next steps:
- Learn Kruise Rollout's [Basic Usage Guide](user-manuals/basic-usage.md).

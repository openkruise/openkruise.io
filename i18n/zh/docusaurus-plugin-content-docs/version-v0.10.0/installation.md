---
title: 安装
---

尽管目前 OpenKruise 能够兼容 Kubernetes >= 1.13 版本的集群，但我们强烈建议在 **Kubernetes >= 1.16** 以上版本的集群中使用。

注意:
1. 在 1.13 和 1.14 版本中必须先在 kube-apiserver 中打开 `CustomResourceWebhookConversion` feature-gate。
2. 由于 Kubernetes 1.22 版本中去除了 CRD/WebhookConfiguration 等资源的 v1beta1 版本，目前 Kruise 无法部署到该版本的集群中。
   即将到来的 Kruise v1.0 会解决这个兼容性问题，并不再支持 Kubernetes 1.16 之前的版本。

## 通过 helm charts 安装

建议采用 helm v3.1+ 来安装 Kruise，helm 是一个简单的命令行工具可以从 [这里](https://github.com/helm/helm/releases) 获取。

```bash
# Kubernetes 1.13 或 1.14 版本
helm install kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz --disable-openapi-validation

# Kubernetes 1.15 和更新的版本
helm install kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz
```

## 通过 helm charts 升级

如果你在使用旧版本的 Kruise，建议为了安全性和更丰富的功能，升级到最新版本：

```bash
# Kubernetes 1.13 and 1.14
helm upgrade kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz --disable-openapi-validation

# Kubernetes 1.15 and newer versions
helm upgrade kruise https://github.com/openkruise/kruise/releases/download/v0.10.0/kruise-chart.tgz
```

注意：

1. 在升级之前，**必须** 先阅读 [Change Log](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md) ，确保你已经了解新版本的不兼容变化。
2. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。

## 可选项

注意直接安装 chart 会使用默认的 template values，你也可以根据你的集群情况指定一些特殊配置，比如修改 resources 限制或者配置 feature-gates。

### 可选: chart 安装参数

下表展示了 chart 所有可配置的参数和它们的默认值：

| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `featureGates`                            | 可配置的 feature gates 参数，空表示按默认开关处理                  | ``                            |
| `installation.namespace`                  | kruise 安装到的 namespace，一般不建议修改                        | `kruise-system`               |
| `manager.log.level`                       | kruise-manager 日志输出级别                                    | `4`                           |
| `manager.replicas`                        | kruise-manager 的期望副本数                                    | `2`                           |
| `manager.image.repository`                | kruise-manager/kruise-daemon 镜像仓库                         | `openkruise/kruise-manager`   |
| `manager.image.tag`                       | kruise-manager/kruise-daemon 镜像版本                         | `v0.10.0`                     |
| `manager.resources.limits.cpu`            | kruise-manager 的 limit CPU 资源                              | `100m`                        |
| `manager.resources.limits.memory`         | kruise-manager 的 limit memory 资源                           | `256Mi`                       |
| `manager.resources.requests.cpu`          | kruise-manager 的 request CPU 资源                            | `100m`                        |
| `manager.resources.requests.memory`       | kruise-manager 的 request memory 资源                         | `256Mi`                       |
| `manager.metrics.port`                    | metrics 服务的监听端口                                         | `8080`                        |
| `manager.webhook.port`                    | webhook 服务的监听端口                                         | `9443`                        |
| `manager.nodeAffinity`                    | kruise-manager 部署的 node affinity 亲和性                     | `{}`                          |
| `manager.nodeSelector`                    | kruise-manager 部署的 node selector 亲和性                     | `{}`                          |
| `manager.tolerations`                     | kruise-manager 部署的 tolerations                             | `[]`                          |
| `daemon.log.level`                        | kruise-daemon 日志输出级别                                     | `4`                           |
| `daemon.port`                             | kruise-daemon 的 metrics/healthz 服务监听端口                  | `10221`                       |
| `daemon.resources.limits.cpu`             | kruise-daemon 的 limit CPU 资源                               | `50m`                         |
| `daemon.resources.limits.memory`          | kruise-daemon 的 limit memory 资源                            | `128Mi`                       |
| `daemon.resources.requests.cpu`           | kruise-daemon 的 request CPU 资源                             | `0`                           |
| `daemon.resources.requests.memory`        | kruise-daemon 的 request memory 资源                          | `0`                           |
| `daemon.affinity`                         | kruise-daemon 部署的 affinity 亲和性 (可以排除一些 node 不部署 daemon) | `{}`                     |
| `daemon.socketLocation`                   | Node 节点上 CRI socket 文件所在目录                              | `/var/run`                    |
| `webhookConfiguration.failurePolicy.pods` | Pod webhook 的失败策略                                         | `Ignore`                      |
| `webhookConfiguration.timeoutSeconds`     | 所有 Kruise webhook 的调用超时时间                               | `30`                          |
| `crds.managed`                            | 是否安装 Kruise CRD (如何关闭则 chart 不会安装任何 CRD)            | `true`                        |

这些参数可以通过 `--set key=value[,key=value]` 参数在 `helm install` 或 `helm upgrade` 命令中生效。

### 可选: feature-gate

Feature-gate 控制了 Kruise 中一些有影响性的功能：

| Name                   | Description                                                  | Default | Side effect (if closed)                 |
| ---------------------- | ------------------------------------------------------------ | ------- | -----------------------------------------
| `PodWebhook`           | 启用对于 Pod **创建** 的 webhook (不建议关闭)                 | `true`  | SidecarSet/KruisePodReadinessGate 不可用    |
| `KruiseDaemon`         | 启用 `kruise-daemon` DaemonSet (不建议关闭)                 | `true`  | 镜像预热/容器重启 不可用                       |
| `DaemonWatchingPod`    | 每个 `kruise-daemon` 会 watch 与自己同节点的 pod （不建议关闭）  | `true`  | 同 imageID 的原地升级，以及支持 env from labels/annotation 原地升级 不可用 |
| `CloneSetShortHash`    | 启用 CloneSet controller 只在 pod label 中设置短 hash 值     | `false` | CloneSet 名字不能超过 54 个字符（默认行为）     |
| `KruisePodReadinessGate` | 启用 Kruise webhook 将 'KruisePodReady' readiness-gate 在所有 Pod 创建时注入 | `false` | 只会注入到 Kruise workloads 创建的 Pod 中 |
| `PreDownloadImageForInPlaceUpdate` | 启用 CloneSet 自动为原地升级的过程创建 ImagePullJob 来预热镜像 | `false` | 原地升级无镜像提前预热 |
| `CloneSetPartitionRollback` | 启用如果 partition 被调大， CloneSet controller 会回滚 Pod 到 currentRevision 老版本 | `false` | CloneSet 只会正向发布 Pod 到 updateRevision |
| `ResourcesDeletionProtection` | 资源删除防护           | `false` | 资源删除无保护 |
| `TemplateNoDefaults` | 是否取消对 workload 中 pod/pvc template 的默认值注入 | `false` | Should not close this feature if it has open |
| `PodUnavailableBudgetDeleteGate` | 启用 PodUnavailableBudget 保护 pod 删除、驱逐   | `false` | 不防护 pod 删除、驱逐 |
| `PodUnavailableBudgetUpdateGate` | 启用 PodUnavailableBudget 保护 pod 原地升级   | `false` | 不防护 pod 原地升级 |
| `WorkloadSpread`                 | 启用 WorkloadSpread 管理应用多分区弹性与拓扑部署 | `false` | 不支持 WorkloadSpread | 

如果你要配置 feature-gate，只要在安装或升级时配置参数即可，比如：

```bash
$ helm install kruise https://... --set featureGates="ResourcesDeletionProtection=true\,PreDownloadImageForInPlaceUpdate=true"
```

如果你希望打开所有 feature-gate 功能，配置参数 `featureGates=AllAlpha=true`。

### 可选: 中国本地镜像

如果你在中国、并且很难从官方 DockerHub 上拉镜像，那么你可以使用托管在阿里云上的镜像仓库：

```bash
$ helm install kruise https://... --set  manager.image.repository=openkruise-registry.cn-hangzhou.cr.aliyuncs.com/openkruise/kruise-manager
```

## 卸载

注意：卸载会导致所有 Kruise 下的资源都会删除掉，包括 webhook configurations, services, namespace, CRDs, CR instances 以及所有 Kruise workload 下的 Pod。 请务必谨慎操作！

卸载使用 helm chart 安装的 Kruise：

```bash
$ helm uninstall kruise
release "kruise" uninstalled
```

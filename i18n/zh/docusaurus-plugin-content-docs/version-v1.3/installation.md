---
title: 安装
---

从 v1.0.0 (alpha/beta) 开始，OpenKruise 要求在 **Kubernetes >= 1.16** 以上版本的集群中安装和使用。

## 通过 helm 安装

建议采用 helm v3.5+ 来安装 Kruise，helm 是一个简单的命令行工具可以从 [这里](https://github.com/helm/helm/releases) 获取。

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.3.0
```
**注意:** [Changelog](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md)。
## 通过 helm 升级

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Upgrade to the latest version.
$ helm upgrade kruise openkruise/kruise --version 1.3.0 [--force]
```

注意：

1. 在升级之前，**必须** 先阅读 [Change Log](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md) ，确保你已经了解新版本的不兼容变化。
2. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。
3. 如果你在**将 Kruise 从 0.x 升级到 1.x 版本**，你需要为 upgrade 命令添加 `--force` 参数，其他情况下这个参数是可选的。

## 可选的：手工下载 charts 包

如果你在生产环境无法连接到 `https://openkruise.github.io/charts/`，可以先在[这里](https://github.com/openkruise/charts/releases)手工下载 chart 包，再用它安装或更新到集群中。

```bash
$ helm install/upgrade kruise /PATH/TO/CHART
```

## 可选项

注意直接安装 chart 会使用默认的 template values，你也可以根据你的集群情况指定一些特殊配置，比如修改 resources 限制或者配置 feature-gates。

### 可选: chart 安装参数

下表展示了 chart 所有可配置的参数和它们的默认值：

| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `featureGates`                            | 可配置的 feature gates 参数，空表示按默认开关处理                  | ` `                           |
| `installation.namespace`                  | kruise 安装到的 namespace，一般不建议修改                        | `kruise-system`               |
| `installation.createNamespace`            | 是否需要创建上述 namespace，一般不建议修改，除非指定安装到已有的 ns 中 | `true`                        |
| `manager.log.level`                       | kruise-manager 日志输出级别                                    | `4`                           |
| `manager.replicas`                        | kruise-manager 的期望副本数                                    | `2`                           |
| `manager.image.repository`                | kruise-manager/kruise-daemon 镜像仓库                         | `openkruise/kruise-manager`   |
| `manager.image.tag`                       | kruise-manager/kruise-daemon 镜像版本                         | `1.2.0`                       |
| `manager.resources.limits.cpu`            | kruise-manager 的 limit CPU 资源                              | `200m`                        |
| `manager.resources.limits.memory`         | kruise-manager 的 limit memory 资源                           | `512Mi`                       |
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
| `daemon.socketFile`                       | 指定 `socketLocation` 目录下的 socket 文件名 (如果你使用的 CRI 类型不是 containerd/docker/pouch/cri-o) | ` ` |
| `webhookConfiguration.failurePolicy.pods` | Pod webhook 的失败策略                                         | `Ignore`                      |
| `webhookConfiguration.timeoutSeconds`     | 所有 Kruise webhook 的调用超时时间                               | `30`                          |
| `crds.managed`                            | 是否安装 Kruise CRD (如何关闭则 chart 不会安装任何 CRD)            | `true`                        |
| `manager.resyncPeriod`                    | kruise-manager 中 informer 的 resync 周期，默认不做 resync       | `0`                           |
| `manager.hostNetwork`                     | kruise-manager pod 是否采用 hostnetwork 网络                    | `false`                       |
| `imagePullSecrets`                        | kruise 镜像用的 imagePullSecrets 列表                           | `false`                       |

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
| `InPlaceUpdateEnvFromMetadata`   | 启用 Kruise 原地升级容器当它存在 env from 的 labels/annotations 发生了变化 | `false` | 容器中只有 image 能够原地升级 |
| `StatefulSetAutoDeletePVC`       | 启用 StatefulSet 自动删除它所创建的 PVC | `false` | StatefulSet 不会清理 PVC |
| `PreDownloadImageForDaemonSetUpdate`       | 启用 DaemonSet 自动为原地升级过程中创建 ImagePullJob 来镜像预热  | `false` | 原地升级无镜像提前预热 |
| `PodProbeMarkerGate`   | 启用 PodProbeMarker 能力  | `false` | PodProbeMarker 关闭 |
| `SidecarSetPatchPodMetadataDefaultsAllowed`   | 允许 SidecarSet Patch 任意 Annotations 到 Pob Object, no more whitelist checks | `false` | Annotations不允许随意Patch，需要通过 SidecarSet_PatchPodMetadata_WhiteList 配置 |

如果你要配置 feature-gate，只要在安装或升级时配置参数即可，比如：

```bash
$ helm install kruise https://... --set featureGates="ResourcesDeletionProtection=true\,PreDownloadImageForInPlaceUpdate=true"
```

如果你希望打开所有 feature-gate 功能，配置参数 `featureGates=AllAlpha=true`。

### 可选: 中国本地镜像

如果你在中国、并且很难从官方 DockerHub 上拉镜像，那么你可以使用托管在阿里云上的镜像仓库：

```bash
$ helm install kruise https://... --set  manager.image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/kruise-manager
```

## 最佳实践

### K3s 安装参数

通常来说 K3s 有着与默认 `/var/run` 不同的 runtime socket 路径。所以你需要将 `daemon.socketLocation` 参数设置为你的 K3s 节点上真实的路径（比如 `/run/k3s` 或 `/var/run/k3s/`）。

### AWS EKS 安装参数

当在 EKS 上使用自定义 CNI 插件（如 Weave 或 Calico）时，默认情况下 webhook 无法被连接到。这是因为在 EKS 上 control plane 不能被配置为运行到一个自定义的 CNI 上，所以 control plane 和 worker 节点的 CNI 是不同的。

可以通过给 webhook 配置 host network 网络来解决这个问题，在 helm install/upgrade 的时候加入 `--set manager.hostNetwork=true` 参数即可。

## 卸载

注意：卸载会导致所有 Kruise 下的资源都会删除掉，包括 webhook configurations, services, namespace, CRDs, CR instances 以及所有 Kruise workload 下的 Pod。 请务必谨慎操作！

卸载使用 helm chart 安装的 Kruise：

```bash
$ helm uninstall kruise
release "kruise" uninstalled
```

---
title: 安装
---
## 版本和k8s兼容性

| Kruise Version | 1.18 | 1.20 | 1.22 | 1.24 | 1.26 | 1.28 | 1.30 | 1.32 |
|----------------|------|------|------|------|------|------|------|------|
| 1.4.x          | +    | +    | ✓    | -    | ?    | ?    | ?    | ?    |
| 1.5.x          | +    | +    | +    | ✓    | -    | ?    | ?    | ?    |
| 1.6.x          | +    | +    | +    | +    | ✓    | ?    | ?    | ?    |
| 1.7.x          | +    | +    | +    | +    | +    | ✓    | ?    | ?    |
| 1.8.x          | +    | +    | +    | +    | +    | +    | ✓    | ?    |
| HEAD           | ?    | ?    | ?    | +    | +    | +    | +    | ✓    |


标记:
* ✓: Kruise 与对应 Kubernetes 版本中的 API 对象/字段完全一致。
* +: Kruise 中包含的一些 API 对象/字段在当前 Kubernetes 集群中可能不存在，但两者共有的功能是兼容的。
* -: Kubernetes 集群中存在一些 Kruise 无法使用的功能（例如额外的 API 对象、字段等）。
* ?: Kruise 尚未在该版本的 Kubernetes 集群中进行测试。

如下是一些重要的OpenKruise和Kubernetes的兼容性说明：

- 从 v1.0.0 (alpha/beta) 开始，OpenKruise 要求在 **Kubernetes >= 1.16** 以上版本的集群中安装和使用。

- 从 v1.5.0 (alpha/beta) 开始，OpenKruise 不再支持 dockershim。如果你依然在 K8S 集群中使用 docker 引擎运行容器，
你可以 [将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd。](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)

- 从 v1.6.0 (alpha/beta) 开始，OpenKruise 要求在 **Kubernetes >= 1.18** 以上版本的集群中安装和使用。如果你关闭了 Kruise-Daemon 组件（featureGates="KruiseDaemon=false"），你依然可以在 K8S 1.16 和 1.17 的集群上安装和使用。

- 从 v1.6.0 (alpha/beta) 开始，Kruise-Daemon 将**不再支持 v1alpha2 CRI 的运行时**。如果你关闭了 Kruise-Daemon 组件（featureGates="KruiseDaemon=false"），你依然可以在只支持 v1alpha2 CRI 的运行时节点所在集群上安装和使用 OpenKruise。

## 通过 helm 安装

建议采用 helm v3.5+ 来安装 Kruise，helm 是一个简单的命令行工具可以从 [这里](https://github.com/helm/helm/releases) 获取。

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.7.2
```
**注意:** [Changelog](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md)。
## 通过 helm 升级

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Upgrade to the latest version.
$ helm upgrade kruise openkruise/kruise --version 1.7.1 [--force]
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

#### 启动参数

| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `featureGates`                            | 可配置的 feature gates 参数，空表示按默认开关处理                  | ` `                           |
| `installation.namespace`                  | kruise 安装到的 namespace，一般不建议修改                        | `kruise-system`               |
| `installation.createNamespace`            | 是否需要创建上述 namespace，一般不建议修改，除非指定安装到已有的 ns 中 | `true`                        |
| `crds.managed`                            | 是否安装 Kruise CRD (若关闭则 chart 不会安装任何 CRD)            | `true`                        |
| `imagePullSecrets`                        | kruise 镜像用的 imagePullSecrets 列表                           | `false`                       |

#### manager参数
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `manager.log.level`                       | kruise-manager 日志输出级别                                    | `4`                           |
| `manager.replicas`                        | kruise-manager 的期望副本数                                    | `2`                           |
| `manager.image.repository`                | kruise-manager/kruise-daemon 镜像仓库                         | `openkruise/kruise-manager`   |
| `manager.image.tag`                       | kruise-manager/kruise-daemon 镜像版本                         | `1.7.1`                       |
| `manager.resources.limits.cpu`            | kruise-manager 的 limit CPU 资源                              | `200m`                        |
| `manager.resources.limits.memory`         | kruise-manager 的 limit memory 资源                           | `512Mi`                       |
| `manager.resources.requests.cpu`          | kruise-manager 的 request CPU 资源                            | `100m`                        |
| `manager.resources.requests.memory`       | kruise-manager 的 request memory 资源                         | `256Mi`                       |
| `manager.metrics.port`                    | metrics 服务的监听端口                                         | `8080`                        |
| `manager.webhook.port`                    | webhook 服务的监听端口                                         | `9443`                        |
| `manager.nodeAffinity`                    | kruise-manager 部署的 node affinity 亲和性                     | `{}`                          |
| `manager.nodeSelector`                    | kruise-manager 部署的 node selector 亲和性                     | `{}`                          |
| `manager.tolerations`                     | kruise-manager 部署的 tolerations                             | `[]`                          |
| `manager.resyncPeriod`                    | kruise-manager 中 informer 的 resync 周期，默认不做 resync       | `0`                           |
| `manager.hostNetwork`                     | kruise-manager pod 是否采用 hostnetwork 网络                    | `false`                       |
| `manager.loggingFormat`                   | 结构化日志，有效的format包括：` `(plain text)、`json` | ` `                       |

#### daemon参数
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `daemon.log.level`                        | kruise-daemon 日志输出级别                                     | `4`                           |
| `daemon.port`                             | kruise-daemon 的 metrics/healthz 服务监听端口                  | `10221`                       |
| `daemon.resources.limits.cpu`             | kruise-daemon 的 limit CPU 资源                               | `50m`                         |
| `daemon.resources.limits.memory`          | kruise-daemon 的 limit memory 资源                            | `128Mi`                       |
| `daemon.resources.requests.cpu`           | kruise-daemon 的 request CPU 资源                             | `0`                           |
| `daemon.resources.requests.memory`        | kruise-daemon 的 request memory 资源                          | `0`                           |
| `daemon.affinity`                         | kruise-daemon 部署的 affinity 亲和性 (可以排除一些 node 不部署 daemon) | `{}`                     |
| `daemon.socketLocation`                   | Node 节点上 CRI socket 文件所在目录                              | `/var/run`                    |
| `daemon.socketFile`                       | 指定 `socketLocation` 目录下的 socket 文件名 (如果你使用的 CRI 类型不是 containerd/docker/pouch/cri-o/cri-docker) | ` ` |
| `daemon.credentialProvider.enable`        | 针对镜像预热是否开启免密插件     | `false`                       |
| `daemon.credentialProvider.hostPath`      | 免密插件的Node目录，将会挂载到 krusie-daemon 上 | `credential-provider-plugin` |
| `daemon.credentialProvider.configmap`     | 免密插件的 configmap 配置文件名字  | `credential-provider-config`  |
| `daemon.credentialProvider.awsCredentialsDir`     | aws的共享凭证目录，比如：`/root/.aws`  | ` `  |

#### 其它参数
| Parameter                                 | Description                                                  | Default                       |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `enableKubeCacheMutationDetector`         | 是否开启 KUBE_CACHE_MUTATION_DETECTOR                          | `false`                       |
| `webhookConfiguration.failurePolicy.pods` | Pod webhook 的失败策略                                         | `Ignore`                      |
| `webhookConfiguration.timeoutSeconds`     | 所有 Kruise webhook 的调用超时时间                               | `30`                          |
| `externalCerts.annotations`       | Patch 到 kruise webbhook 和 crd 的 Annotations 配置。比如：`cert-manager.io/inject-ca-from: kruise-system/kruise-webhook-certs`. | `{}` |

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
| `ResourcesDeletionProtection` | 资源删除防护           | `true` | 资源删除无保护 |
| `TemplateNoDefaults` | 是否取消对 workload 中 pod/pvc template 的默认值注入 | `false` | Should not close this feature if it has open |
| `PodUnavailableBudgetDeleteGate` | 启用 PodUnavailableBudget 保护 pod 删除、驱逐   | `true` | 不防护 pod 删除、驱逐 |
| `PodUnavailableBudgetUpdateGate` | 启用 PodUnavailableBudget 保护 pod 原地升级   | `false` | 不防护 pod 原地升级 |
| `WorkloadSpread`                 | 启用 WorkloadSpread 管理应用多分区弹性与拓扑部署 | `true` | 不支持 WorkloadSpread |
| `InPlaceUpdateEnvFromMetadata`   | 启用 Kruise 原地升级容器当它存在 env from 的 labels/annotations 发生了变化 | `true` | 容器中只有 image 能够原地升级 |
| `StatefulSetAutoDeletePVC`       | 启用 StatefulSet 自动删除它所创建的 PVC | `true` | StatefulSet 不会清理 PVC |
| `PreDownloadImageForDaemonSetUpdate`       | 启用 DaemonSet 自动为原地升级过程中创建 ImagePullJob 来镜像预热  | `false` | 原地升级无镜像提前预热 |
| `PodProbeMarkerGate`   | 启用 PodProbeMarker 能力  | `true` | PodProbeMarker 关闭 |
| `SidecarSetPatchPodMetadataDefaultsAllowed`   | 允许 SidecarSet Patch 任意 Annotations 到 Pob Object，不再进行白名单校验 | `false` | Annotations不允许随意Patch，需要通过 SidecarSet_PatchPodMetadata_WhiteList 配置 |
| `SidecarTerminator`   | 启用 SidecarTerminator 能力，在 Job 场景中当主容器退出后，能够停止 Sidecar 容器 | `false` | SidecarTerminator 不可用 |
| `CloneSetEventHandlerOptimization`   | 性能优化，减少 Pod Update 触发的无效 Reconcile 逻辑 | `false` | CloneSetEventHandlerOptimization 不启用 |
| `ImagePullJobGate`                 | 启用 ImagePullJob 能力  | `false` | ImagePullJob 关闭 |
| `ResourceDistributionGate`         | 启用 ResourceDistribution 能力  | `false` | ResourceDistribution 关闭 |
| `DeletionProtectionForCRDCascadingGate`         | 启用 DeletionProtection 针对CRD资源的级联删除能力  | `false` | DeletionProtection 针对CRD资源的级联删除能力 关闭 |

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

### 支持第三方工具注入Webhook CA证书
**FEATURE STATE:** Kruise v1.7.0

Kruise 需要 CA 证书来实现 webhook 认证。默认情况下，Kruise 会生成自签名 CA 证书。此外，也可以通过第三方工具来注入和管理，如下：

1. 安装第三方CA管理工具，比如：[cert-manager](https://cert-manager.io/docs/installation/helm/)。
2. 创建 issuer 和 certificate 资源：
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
3. OpenKruise 需要开启 `featureGates=EnableExternalCerts=true`，并在 webhookConfiguration 和 CRD 注入对应的 cert annotations：
```
helm install kruise https://... --set featureGates="EnableExternalCerts=true" --set-json externalCerts.annotations='{"cert-manager.io/inject-ca-from":"kruise-system/kruise-webhook-certs"}'
```

详情参考：[CA Injector - cert manager](https://cert-manager.io/docs/concepts/ca-injector/)。

### 结构化日志
**FEATURE STATE:** Kruise v1.7.0

日志是可观察性的一个重要方面，也是调试的重要工具。 但是 OpenKruise 日志传统上是非结构化的字符串，因此很难进行自动解析，以及任何可靠的后续处理、分析或查询。

从 OpenKruise 1.17 版本开始，我们增加了结构化日志的支持，该日志本身支持（键，值）对和对象引用。为了保持向后兼容性，结构化日志仍将作为字符串输出，其中该字符串包含这些“键” =“值”对的表示。
也可以通过设置 `helm install ... --set manager.loggingFormat=json` 以 json 格式输出。

如下 InfoS 调用：

```
klog.V(3).InfoS("SidecarSet updated status success", "sidecarSet", klog.KObj(sidecarSet), "matchedPods", status.MatchedPods,
"updatedPods", status.UpdatedPods, "readyPods", status.ReadyPods, "updateReadyPods", status.UpdatedReadyPods)
```

将得到下面的日志输出：

```
I0821 14:22:35.587919       1 sidecarset_processor.go:280] "SidecarSet updated status success" sidecarSet="test-sidecarset" matchedPods=1 updatedPods=1 readyPods=1 updateReadyPods=1
```

或者 `helm install ... --set manager.loggingFormat=json` 以 json 格式输出：

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

## 卸载

注意：卸载会导致所有 Kruise 下的资源都会删除掉，包括 webhook configurations, services, namespace, CRDs, CR instances 以及所有 Kruise workload 下的 Pod。 请务必谨慎操作！

卸载使用 helm chart 安装的 Kruise：

```bash
$ helm uninstall kruise
release "kruise" uninstalled
```

## Kruise State Metrics

[kruise-state-metrics](https://github.com/openkruise/kruise-state-metrics) 监听 Kubernetes API 并生成 OpenKruise 有关对象状态的度量指标。它不关注单个 OpenKruise 组件的健康状况，而是关注内部各种对象的健康状况，例如：clonesets，advanced statefulsets and sidecarsets。

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise-state-metrics --version 0.1.0
```

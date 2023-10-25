# 安装

## 要求

- 安装 Kubernetes 集群，需要 **Kubernetes 版本 >= 1.19**。
- (可选，如果使用 CloneSet) Helm 安装 OpenKruise，**自 v1.1.0 起**
  ，参考[安装 OpenKruise](https://openkruise.io/docs/installation)。

## 使用 Helm 安装

Kruise Rollout 可以简单地通过 Helm v3.1+ 安装，Helm
是一个简单的命令行工具，您可以从[这里](https://github.com/helm/helm/releases)获取。

```bash
# 首先，如果您还没有添加 openkruise Charts库，请执行以下命令。
$ helm repo add openkruise https://openkruise.github.io/charts/

# [可选]
$ helm repo update

# 安装最新版本。
$ helm install kruise-rollout openkruise/kruise-rollout --version 0.3.0
```

**注意：** [更新日志](https://github.com/openkruise/kruise/blob/master/CHANGELOG.md)。

## 使用 Helm 升级

```bash
# 首先，如果您还没有添加 openkruise Charts库，请执行以下命令。
$ helm repo add openkruise https://openkruise.github.io/charts/

# [可选]
$ helm repo update

# 升级到最新版本。
$ helm upgrade kruise-rollout openkruise/kruise-rollout --version 0.3.0 [--force]
```

请注意：

1. 在升级之前，您**必须**首先阅读[变更日志](https://github.com/openkruise/rollouts/blob/master/CHANGELOG.md)，
   确保您理解新版本中的破坏性更改。
2. 如果您想删除为旧版本配置的Charts参数或设置一些新参数，建议在 helm upgrade 命令中添加 `--reset-values` 标志。
   否则，您应该使用 `--reuse-values` 标志来重用上一个版本的值。

## 可选：使用自定义配置安装/升级

以下表格列出了Kruise
Charts的可配置参数以及它们的默认值，更多详细信息可以在[此Charts库](https://github.com/openkruise/charts/blob/master/versions/kruise-rollout/0.3/values.yaml)
中找到。

| 参数                               | 描述                                                  | 默认值                                 |
|----------------------------------|-----------------------------------------------------|-------------------------------------|
| `installation.namespace`         | 操作安装的命名空间                                           | `kruise-rollout`                    |
| `installation.createNamespace`   | 是否创建 `installation.namespace` 命名空间                  | `true`                              |
| `rollout.fullname`               | kruise-rollout 部署和其他配置的昵称                           | `kruise-rollout-controller-manager` |
| `rollout.featureGates`           | kruise-rollout 的特性开关，空字符串表示全部禁用                     | `AdvancedDeployment=true`           |
| `rollout.healthBindPort`         | 用于检查 kruise-rollout 容器健康的端口                         | `8081`                              |
| `rollout.metricsBindAddr`        | kruise-rollout 容器提供的指标的端口                           | `127.0.0.1:8080`                    |
| `rollout.log.level`              | kruise-rollout 打印的日志级别                              | `4`                                 |
| `rollout.webhook.port`           | kruise-rollout 容器提供的 Webhook 的端口                    | `9876`                              |
| `rollout.webhook.objectSelector` | MutatingWebhookConfigurations 中工作负载的 ObjectSelector | ` `                                 |
| `image.repository`               | kruise-rollout 镜像的仓库                                | `openkruise/kruise-rollout`         |
| `image.tag`                      | kruise-rollout 镜像的标签                                | `v0.3.0`                            |
| `image.pullPolicy`               | kruise-rollout 容器的 ImagePullPolicy                  | `Always`                            |
| `imagePullSecrets`               | kruise-rollout 镜像的 ImagePullSecrets 列表              | ` `                                 |
| `resources.limits.cpu`           | kruise-rollout 容器的 CPU 资源限制                         | `500m`                              |
| `resources.limits.memory`        | kruise-rollout 容器的内存资源限制                            | `1Gi`                               |
| `resources.requests.cpu`         | kruise-rollout 容器的 CPU 资源请求                         | `100m`                              |
| `resources.requests.memory`      | kruise-rollout 容器的内存资源请求                            | `256Mi`                             |
| `replicaCount`                   | kruise-rollout 部署的副本数                               | `2`                                 |
| `service.port`                   | kruise-rollout Webhook 服务提供的端口                      | `443`                               |

使用 `--set key=value[,key=value]` 参数来指定每个参数，例如，

```bash
$ helm install kruise-rollout openkruise/kruise-rollout --version 0.3.0 --set resources.limits.memory=2Gi
```

#### 可选：中国本地镜像

如果您在中国并且在官方 DockerHub 上拉取镜像时遇到问题，您可以使用阿里云托管的镜像库：

```bash
$ helm install kruise https://... --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/kruise-rollout
...
```

## 卸载

请注意，这将导致 Kruise Rollout 创建的所有资源被删除，包括 Webhook 配置、服务、命名空间、CRDs 和 CR 实例以及 Kruise Rollout
控制器！

只有在您充分理解后才执行此操作。

要卸载使用 Helm Charts安装的 kruise rollout：

```bash
$ helm uninstall kruise-rollout
release "kruise-rollout" uninstalled
```

## 接下来的步骤

以下是一些推荐的下一步操作：

- 学习 Kruise Rollout 的[基本使用指南](./user-manuals/basic-usage.md)。

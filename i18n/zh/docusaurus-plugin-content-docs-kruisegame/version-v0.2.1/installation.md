# 安装

安装OpenKruiseGame需安装Kruise与Kruise-Game，且要求 Kubernetes版本 >= 1.16

## 安装Kruise

建议采用 helm v3.5+ 来安装 Kruise

```shell
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --version 1.4.0
```

## 安装Kruise-Game

```shell
$ helm install kruise-game openkruise/kruise-game --version 0.2.1
```

## 可选：使用自定义配置安装/升级

下表列出了 kruise-game 的可配置参数及其默认值。

| Parameter                        | Description                                                       | Default                             |
|----------------------------------|-------------------------------------------------------------------|-------------------------------------|
| `installation.namespace`         | kruise-game 安装到的 namespace，一般不建议修改                        | `kruise-game-system`                |
| `installation.createNamespace`   | 是否需要创建上述 namespace，一般不建议修改，除非指定安装到已有的 ns 中     | `true`                              |
| `kruiseGame.fullname`            | kruise-game 部署和其他配置的名称                                     | `kruise-game-controller-manager`    |
| `kruiseGame.healthBindPort`      | 用于检查 kruise-game 容器健康检查的端口                               | `8082`                              |
| `kruiseGame.webhook.port`        | kruise-game 容器服务的 webhook 端口                                 | `443`                               |
| `kruiseGame.webhook.targetPort`  | 用于 MutatingWebhookConfigurations 中工作负载的 ObjectSelector       | `9876`                              |
| `replicaCount`                   | kruise-game 的期望副本数                                            | `1`                                 |
| `image.repository`               | kruise-game 的镜像仓库                                              | `openkruise/kruise-game-manager`    |
| `image.tag`                      | kruise-game 的镜像版本                                              | `v0.2.1`                            |
| `image.pullPolicy`               | kruise-game 的镜像拉取策略                                           | `Always`                            |
| `serviceAccount.annotations`     | kruise-game的serviceAccount注解                                     | ` `                                 |
| `resources.limits.cpu`           | kruise-game容器的CPU资源限制                                         | `500m`                              |
| `resources.limits.memory`        | kruise-game容器的内存资源限制                                         | `1Gi`                               |
| `resources.requests.cpu`         | kruise-game容器的CPU资源请求                                          | `10m`                              |
| `resources.requests.memory`      | kruise-game容器的内存资源请求                                          | `64Mi`                             |


使用 `--set key=value[,key=value]` 参数指定每个参数到 `helm install`,例如,

### 可选：中国地区的镜像

如果你在中国并且无法从官方 DockerHub 拉取镜像，你可以使用托管在阿里云上的镜像:

```bash
$ helm install kruise-game https://... --set image.repository=registry.cn-hangzhou.aliyuncs.com/acs/kruise-game-manager:v0.2.1
...
```

## 卸载

请注意，这将导致删除 kruise-game 创建的所有资源，包括 webhook 配置、服务、命名空间、CRD 和 CR 实例 kruise-game 控制器！
请仅在您完全了解后果后才这样做。
如果安装了 helm charts，则卸载 kruise-game:

```bash
$ helm uninstall kruise-game
release "kruise-game" uninstalled
```

## What's Next
接下来，我们推荐你:
- 了解 kruise-game 的 [部署游戏服](user-manuals/deploy-gameservers.md).
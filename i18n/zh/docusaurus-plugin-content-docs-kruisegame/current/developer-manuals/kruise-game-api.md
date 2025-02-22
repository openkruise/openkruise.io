# Kruise Game API

kruise-game-api 是通过 Golang package、gRPC、REST、命令行多种接口类型，提供对 OKG 的 GSS/GS 资源的查询、修改、删除操作，主要功能如下：
* 使用类似 MongoDB 的结构化查询语法 [structured-filter-go](https://github.com/CloudNativeGame/structured-filter-go)，实现对 GSS/GS 较复杂筛选规则的查询，例如有查询满足以下条件的 GS 的需求：
    * opsState 为 None
    * status.networkStatus.currentState 为 Ready
    * 包含名为 nginx 和 sidecar 的容器，nginx 的 image 为 nginx:1.27.4，sidecar 的 image 为 busybox:1.37.0

可以用以下 filter 查询满足以上所有条件的 GS 列表：

```JSON
{
  "$and": [
    {
      "opsState": "None"
    },
    {
      "currentNetworkState": "Ready"
    },
    {
      "images": {
        "$all": ["nginx,nginx:1.27.4", "sidecar,busybox:1.37.0"]
      }
    }
  ]
}
```

* 使用 [JsonPatch](https://jsonpatch.com/) 作为更新语法，配合 filter，实现对满足一定筛选规则的 GSS/GS 进行状态更新
* 提供 Golang Package 使用链式调用简化查询及更新语法：

```golang
// 构造 Filter
filter := filterbuilder.NewGsFilterBuilder().OpsState("None")

// 构造 JsonPatch
patcher := jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1)
```

* 提供 gRPC/REST client 进一步简化 GSS/GS 的操作：

```golang
// 创建 HttpClient，用于向 kruise-game-api-server 发送请求
client := kruisegameapiclient.NewKruiseGameApiHttpClient()

// 向 kruise-game-api-server 发送 HTTP 请求，将 opsState 为 None 的 GS 的 updatePriority 设置为1
results, err := client.UpdateGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"),
    jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1))
```

* 提供 kruisegamectl 命令行工具，在无需额外部署的情况下实现 GSS/GS 的结构化查询/更新：

```shell
# 将 opsState 为 None 的 GS 的 updatePriority 设置为1
kruisegamectl -k "${kube_config_path}" \
    -r gameserver \
    -p -f '{"opsState":"None"}' \
    -j '[{"op":"replace","path":"/spec/updatePriority","value":3}]'
```

# 使用方法

* 代码示例：https://github.com/CloudNativeGame/kruise-game-api/tree/main/examples
* 更详细的接口说明，以及支持的 GSS/GS 的 filter 等内容可以参考 [README](https://github.com/CloudNativeGame/kruise-game-api/blob/main/README.md)
* 以下是 Golang Package、REST、命令行几种接口类型的使用方法：

## Golang Package

获取 package：

```shell
go get github.com/CloudNativeGame/kruise-game-api
```

在代码中使用：

```golang
// 创建 GS 过滤器
gsFilter := filter.NewGsFilter(&filter.FilterOption{
    KubeOption: options.KubeOption{
        KubeConfigPath:          "~/.kube/config",
        InformersReSyncInterval: time.Second * 30,
    },
})

//rawFilter := "{\"$and\":[{\"opsState\": \"None\"}, {\"updatePriority\": 0}]}"
// 获取 opsState 为 None 且 updatePriority 为0的 GS 列表
gameServers, err := gsFilter.GetFilteredGameServers(filterBuilder.And().OpsState("None").UpdatePriority(0).Build())
```

## REST

将 kruise-game-api-server 部署到 kruise-game-system namespace 中：

```shell
git clone git@github.com:CloudNativeGame/kruise-game-api.git
cd kruise-game-api/deploy/ && kubectl apply -f .
```

使用 curl 或提供的 REST client Golang Package，在业务容器内请求 kruise-game-api-server：

```shell
# 获取 opsState 为 None 的 GS 列表
curl -G --data-urlencode 'filter={"opsState":"None"}' http://kruise-game-api-server.kruise-game-system/v1/gameservers
```

```golang
// 创建 HttpClient，用于向 kruise-game-api-server 发送请求
client := kruisegameapiclient.NewKruiseGameApiHttpClient()

// 向 kruise-game-api-server 发送 HTTP 请求，获取 opsState 为 None 的 GS 列表
gameServers, err := client.GetGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"))
```

## 命令行

```shell
go install github.com/CloudNativeGame/kruise-game-api/facade/kruisegamectl@latest
# go/bin 目录需要添加到 PATH 环境变量
kruisegamectl -k ~/.kube/config -r gameserver -f '{"opsState":"None"}'
```

# 使用场景

## GS 状态查询与上报

* 通过 gRPC/REST 请求与 kruise-game-api-server 交互，实现 GS 的状态查询与上报，代替自定义服务质量脚本的方式更新 GS 的状态，减少对带外系统的依赖。
* GS 可以通过 sidecar 或 kruise-game-system 命名空间下的 kruise-game-api-server Service 调用请求管理自身状态。

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-1.png').default} style={{  width: '800px'}} />

## GS 路由选择

* 可以在网关的 sidecar 中使用 kruise-game-api-server 帮助网关选择及分配满足需求的 GS。

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-2.png').default} style={{  width: '800px'}} />

## 集成进 PaaS 平台

* 如果使用自研的 PaaS 平台，可以快速集成 GSS/GS 的筛选、更新等功能，例如下图中的 GSS 根据镜像等条件筛选、对筛选后的 GSS 执行更新镜像操作等功能：

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-3.png').default} style={{  width: '800px'}} />

## 代替 kubectl 客户端管理 GSS&GS

* 提供 kruisegamectl 命令行工具，不依赖 kruise-game-api-server 服务器实现 GSS/GS 的筛选和更新。

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-4.png').default} style={{  width: '800px'}} />

## 作为 CI/workflow 的 step 执行自动化运维

以下面的 Argo Workflow 为例，省略了一些 steps，最后一步 clean-old-none-gs 的作用是将满足一定条件（opsState 为 None、包含容器名为 game-server 且该容器的镜像为 nginx:1.27.4）的 GS 的 opsState 设置为 Kill：

```yaml
# kubectl create -f workflow.yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: frame-sync-server-lossless-update-
  namespace: kruise-game-system
spec:
  serviceAccountName: kruise-game-controller-manager
  entrypoint: main
  templates:
    - name: main
      steps:
        - - name: clean-old-none-gs
            template: clean-old-none-gs
    - name: clean-old-none-gs
      script:
          image: crpi-8cm99ihkk1hz8ju9.cn-shenzhen.personal.cr.aliyuncs.com/scottliu/kruisegamectl:v0.0.5
          command: ["/kruisegamectl"]
          args:
              - -r
              - gameserver
              - -f
              - '{"$and":[{"opsState":"None"},{"images":{"$all":["game-server,nginx:1.27.4"]}}]}'
              - -j
              - '[{"op":"replace","path":"/spec/opsState","value":"Kill"}]'
```

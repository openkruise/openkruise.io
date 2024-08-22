# Higress × OpenKruiseGame 游戏网关最佳实践

> 作者：赵伟基/刘秋阳/张添翼
> 
> 时间：2024-01-24

OpenKruiseGame（OKG）是一个面向多云的开源游戏服 Kubernetes 工作负载，是 CNCF 工作负载开源项目 OpenKruise 在游戏领域的子项目，其提供了热更新、原地升级、定向管理等常用的游戏服管理功能。而游戏作为典型的流量密集型场景，在吞吐量、延迟性能、弹性与安全性等方面对入口网关提出了很高的要求。

Higress 是基于阿里内部两年多的 Envoy 网关实践沉淀，以开源 Istio 与 Envoy 为核心构建的下一代云原生网关。Higress 实现了安全防护网关、流量网关、微服务网关三层网关合一，可以显著降低网关的部署和运维成本。Higress 可以作为 K8s 集群的 Ingress 入口网关，并且兼容了大量 K8s Nginx Ingress 的注解，可以从 K8s Nginx Ingress 快速平滑迁移到 Higress。同时也支持 K8s Gateway API 标准，支持用户从 Ingress API 平滑迁移到 Gateway API。

本文将演示 Higress 如何无缝对接 OKG 游戏服，并为其带来的优秀特性

## Higress 无缝接入 OKG

前置步骤：
1. [安装 OpenKruiseGame](../installation.md)。
2. [安装 Higress](https://higress.io/zh-cn/docs/user/quickstart/)。

OKG 提供诸多游戏服热更新和游戏服伸缩的优秀特性，便于游戏运维人员管理游戏服的全生命周期。游戏不同于无状态类型的服务，玩家战斗的网络流量是不允许被负载均衡的，因此每一个游戏服需要独立的访问地址。

使用原生工作负载（如 Deployment 或 StatefulSet）时，运维工程师需要为众多游戏服一一配置接入层网络，这无疑阻碍了开服效率，同时手动配置也无形中增加了故障的概率。OKG 提供的 GameServerSet 工作负载可以自动化地管理游戏服的接入网络，大幅度降低运维工程师的负担。

对于 TCP/UDP 网络游戏，OKG 提供了诸如 HostPort、SLB、NATGW 等网络模型；而对于 H5/WebSocket 类型的网络游戏，OKG 也相应提供了 Ingress 网络模型，如 Higress、Nginx、ALB 等。

<img src={require('/static/img/kruisegame/blog-video/gss-workload-comparison.png').default} />

本文采用了一款开源游戏 Posio 来构建 demo 游戏服。下述配置中，IngressClassName="higress" 指定了 Higress 作为游戏服的网络层，Higress 通过下面配置可以无缝接入 Posio 游戏服，并且可以基于 Annotation 实现 Higress 定义的高阶流量治理等功能。示例 Yaml 如下所示，GameServerSet 生成的游戏服对应的访问域名与游戏服 ID 相关。

在此例中，游戏服 0 的访问域名为 game0.postio.example.com，游戏服 1 的访问域名为 game1.postio.example.com. 客户端以此来访问不同的游戏服。

```yaml
piVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: postio
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: Kubernetes-Ingress
    networkConf:
    - name: IngressClassName
      value: "higress"
    - name: Port
      value: "5000"
    - name: Path
      value: /
    - name: PathType
      value: Prefix
    - name: Host
      value: game<id>.postio.example.com
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/posio:8-24
          name: postio
```

OKG [水平伸缩](../user-manuals/gameservers-scale.md)提供自动扩容、根据游戏服的 OpsState 缩容、根据 DeletionPriority 缩容、根据游戏服序号缩容等功能来支持游戏运维的业务需求。水平伸缩的特性在给游戏开发者带来便利的同时，也对入口网关提出了更高的要求：入口网关必须具备配置热更新的能力，完成路由配置的平滑下发。
原因在于：在进行游戏服的扩容时，OKG 会同步创建 Ingress 等相关网络相关资源，以此来保障游戏服的自动上线。如果入口网关不具备配置热更新的能力，在扩容时就，线上玩家就会遇到连接断开等问题，影响游玩体验。


## Nginx reload 无法优雅热更新

在游戏服出现扩容，或者定义的路由策略发生变更时，Nginx 的配置变更会触发 reload，导致上下游的连接都断开并触发重连。

我们以 Posio 游戏服为例，模拟 Nginx+OKG 在游戏服扩容时出现的问题。Posio 服务端依赖于 Socket 连接与客户端通信。游戏服扩容时，触发对应的 Ingress 资源创建，此时 Nginx-ingress-controller 监听到 Ingress 资源变更，触发自身 reload 机制，此时原来与游戏服建立的连接（如本例中的 Socket 连接会被断开）。在正在游戏的玩家侧的体感便是出现了异常卡顿。

为了直观的展示 Nginx Ingress reload 带来的影响，我们对 Nginx 默认配置参数进行一些更改：

```shell
kubectl edit configmap nginx-configuration -n kube-system

data:
  ...
  worker-shutdown-timeout: 30s # 一个很难做权衡的配置

```

Nginx 配置参数中 worker-shutdown-timeout 是 Nginx 的 worker 进程优雅下线的超时配置，worker 进程会先停止接收新的连接，并等待老的连接逐渐关闭，达到超时时间后，才会去强制关闭当前的所有连接，完成进程退出。

此参数配置过小，会导致大量活跃连接瞬间断开；而此参数配置过大时，又会导致 websocket 长连接始终维持住 Nginx 进程，当发生频繁 reload 时会产生大量 shutting down 状态的 worker 进程，老 worker 占有的内存迟迟得不到释放，可能会导致 OOM 引发线上故障：

<img src={require('/static/img/kruisegame/blog-video/oom.png').default} />

实际游玩的测试过程如下：客户端访问游戏服，进行正常游玩。在此过程中通过 OKG 能力触发游戏服扩容，查看此时客户端的响应。通过网页开发者工具可以看到，出现了两条 Socket 连接，一条是原先浏览器访问游戏服建立，另一条是由于 Nginx 断连后重连产生的 Socket 连接。

<img src={require('/static/img/kruisegame/blog-video/nginx-config-update.jpg').default} style={{ height: '400px' , width: '700px'}} />

原有连接收到的最后一个包时间戳是 15:10:26。

<img src={require('/static/img/kruisegame/blog-video/socket1.png').default} />

而新建连接到获取第一个正常游戏包的时间是 15:10:37，网页与游戏服的断连大概持续 5s 左右。

<img src={require('/static/img/kruisegame/blog-video/socket2.png').default} />

除了玩家的游玩体验受影响，这个机制也会给业务整体稳定性埋雷。在高并发场景下，因为连接瞬断，导致大批量客户端的并发重连，会导致 Nginx 的 CPU 瞬间飙升；而后端游戏服务器需要处理更多业务逻辑，一般比网关的资源需求更高，因此 Nginx 透传过来的大量并发重连，也更容易打垮后端，造成业务雪崩。

## Higress 如何实现优雅热更新

Higress 支持采用 K8s Ingress 暴露游戏服外部 IP 端口，供玩家连接访问。当游戏服伸缩或者定义的路由配置发生变化时，Higress 支持路由配置的热更新，以此保障玩家连接的稳定性。

<img src={require('/static/img/kruisegame/blog-video/higress-config.png').default} />

Higress 基于 Envoy 的精确配置变更管理，做到了真正的配置动态热更新。在  Envoy 中 downstream 对应 listener 配置，交由 LDS 实现配置发现；upstream 对应 cluster 配置，交由 CDS 实现配置发现。listener 配置更新重建，只会导致 downstream 连接断开，不会影响 upstream 的连接；downstream 和 upstream 的配置可以独立变更，互不影响。再进一步，listener 下的证书(cert)，过滤器插件(filter)，路由(router)均可以实现配置独立变更，这样不论是证书/插件/路由配置变更都不再会引起 downstream 连接断开。

精确的配置变更机制，除了让 Envoy 可以实现真正的热更新，也让 Envoy 的架构变的更可靠，Envoy 配置管理从设计之初就是为数据面(DP)和控制面(CP)分离而设计的，因此使用 gRPC 实现远程配置动态拉取，并借助 proto 来规范配置字段，并保持版本兼容。这个设计实现了数据面和控制面的安全域隔离，增强了架构的安全性。

使用 OKG 接入 Higress 后，下面依然模拟客户端访问游戏服，进行正常游玩。在此过程中通过 OKG 能力触发游戏服扩容，查看此时客户端的响应。通过网页开发者工具可以看到，在此过程中客户端与游戏服建立的连接稳定不受影响。

<img src={require('/static/img/kruisegame/blog-video/router-config-update.jpg').default} style={{ height: '400px' , width: '700px'}} />

此外，在大规模游戏服场景下，每个游戏服对应一个独立的 Ingress，会产生大量的 Ingress 资源，我们测试在达到 1k 级别规模时，Nginx Ingress 要新扩一个游戏服需要分钟级生效，而 Higress 可以在秒级生效。Nginx Ingress 的这一问题也被 Sealos 踩坑，并最终通过切换到 Higress 解决，有兴趣可以阅读这篇文章了解：[《云原生网关哪家强：Sealos 网关血泪史》](https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247561453&idx=1&sn=de22e31a1ab59311072b468de907e282&scene=21#wechat_redirect)


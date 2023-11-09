# 会话类游戏（PvP开房间）最佳实践

会话类（session based）游戏，是指在有限的时间内，将玩家汇聚到特定游戏场景下的游戏类型。在通常意义下，会话等同对局，一局结束后，玩家间的游戏关系也在此结束，该会话也同时结束。因此，在业界也会将会话类游戏通俗的理解为“开房间游戏”，一个房间承载了对应的游戏会话。这类游戏往往存在着以下特点：

- 游戏时间非连续，存在明显的起停时间节点
- 常见于MOBA、FPS类游戏，对时延要求较高
- 会话中至少存在2个及以上的玩家，相互战斗、交互
- 业务波峰与波谷时，对局数量差距明显

根据以上特点，一个理想的会话类游戏云原生架构图如下所示

<img src={require('/static/img/kruisegame/best-practices/session-based-game-arch.png').default} style={{  width: '500px'}} />


它应该具备以下能力：

- 提供网络直连功能，为每个房间提供独立的公网访问地址，玩家客户端可直接访问。
- 提供游戏匹配功能，为玩家找到合适的队友与对手组成会话对局，并为其分配合适的游戏房间。
- 提供状态管理功能，自动化管理游戏房间的业务状态与生命周期。
- 提供弹性伸缩功能，根据业务波峰与波谷自动申请和释放基础设施资源，控制成本。
- 可高效地进行游戏交付及运维管理，自动化水平高。

## 网络直连

会话类游戏需要网络直连，通常有以下考虑：

- 降低游戏时延，增加玩家游戏体验
- 去掉不必要的网关或代理，节约资源成本的同时简化技术架构

### 选择OpenKruiseGame网络模型

在传统游戏运维时代，游戏服业务与基础设施较为耦合，往往开发服务端程序时需要设计额外的端口分配管理器来避免同个机器上不同房间的端口冲突问题。理想状态，在云原生化后，游戏业务无需再关注游戏房间的端口分配问题，房间服可水平扩展，因此需要每个房间服拥有独自的公网访问地址，然而Kubernetes原生的service负载均衡模型却无法满足该需求。

OpenKruiseGame(OKG)提供了多种网络模型，自动化管理（创建&回收）房间服的公网地址（EIP+端口），自此以后游戏开发者无需关注基础设施的网络配置，而游戏运维者只需填写简单的参数就可以高效部署并自动化管理房间服网络。在OKG的模式下，**每个房间服对应一个pod**，针对会话类游戏，当前可使用的网络模型包括：Kubernetes-HostPort、AlibabaCloud-NATGW、 AlibabaCloud-SLB、AlibabaCloud-EIP。每种网络模型特点不同，适用于不同的场景。

**Kubernetes-HostPort**

利用宿主机EIP + 端口作为公网地址，这种模式适合节点pod高密部署的情况。当房间服较小且数量很多时，调度到每个node上的pod数就会很多，此时充分利用该node上EIP的带宽，能够最大程度地节约EIP资源成本。

**AlibabaCloud-SLB**

将同个SLB的不同端口映射到对应不同的房间服上，以实现房间服具有独立公网地址的效果。该模式配置最为简单，同时使用EIP的数量非常少。但注意SLB受限于后端最大实例数限制，每个SLB最多关联200个房间服，当GameServerSet下房间服的数量即将超过200时，需要新增SLB实例以满足扩容需求。

**AlibabaCloud-NATGW**

将自动化管理房间服相关联的Dnat映射规则，用户需要安装ack-extend-network-controller组件，配置NAT网关相关参数。NATGW模型相对SLB模型可扩展性更强、更灵活，但同时配置起来也更加复杂。

**AlibabaCloud-EIP**

为每个房间服pod分配独立的EIP。这种模式下消耗的EIP将比较多，适合于刚做容器化迁移时，游戏服存在端口管理器的情况。容器暴露的端口段即为被访问的端口段，不存在映射行为。

详细说明与示例可参考[OKG网络模型文档](https://openkruise.io/zh/kruisegame/user-manuals/network)

### 获取房间服网络信息

游戏房间拥有了独立的公网访问地址，剩下的问题就是如何将该地址提供给玩家客户端。一般来说，会话类游戏会存在匹配服务这样的角色，而匹配服务又通常存在两种方式感知房间服的网络地址：1）主动获取；2）房间服自注册上报。

**主动获取**

匹配服务会主动获取到当前集群中可用的房间服，并获取到对应公网地址，选择合适的房间服返回给客户端。这时匹配服务需要调用Kubernetes API，来获取GameServer对象中NetworkStatus。对于GameServer的CURD操作可以参考Kruise-Game官方仓库的[e2e用例](https://github.com/openkruise/kruise-game/tree/master/test/e2e)

**注册上报**

当然，也存在着房间服业务上报网络信息的情况。此时，利用[Kubernetes的DownwardAPI机制](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/downward-api/)可将网络信息下沉至容器内被业务感知到，业务程序解析到对应地址后再上报即可。具体示例可参考[文档](https://openkruise.io/zh/kruisegame/user-manuals/network#downwardapi)

## 游戏匹配

会话类游戏匹配的过程大致分为两个阶段 —— 1）玩家寻找队友/对手，形成对局；2）为对局分配合适的房间服，并将网络地址返回给玩家。

### 基于OpenMatch实现游戏匹配服务

在开源社区中有像Open Match这样的游戏匹配框架，用户只需按照框架标准实现匹配逻辑即可。OKG基于Open Match提供了 [kruise-game-open-match-director](https://github.com/CloudNativeGame/kruise-game-open-match-director) 组件，主要帮助实现上述匹配过程的第二阶段——为对局找到游戏服并返回地址。这样一来，用户只需关注第一阶段的匹配逻辑即可。有关基于Open Match 与 OKG 的匹配服务开发指南可以观看[云原生游戏系列课程](https://edu.aliyun.com/course/316831/lesson/19791?spm=a2cwt.28120015.316831.13.577431dbdxbMkD)，也可以加入云原生游戏社区群（钉钉群ID：44862615）参与讨论或提问。

### 自研游戏匹配服务

当然，如果存在自研的匹配框架/系统，也可以通过简单的二次开发接入OKG。如上文中获取网络信息一节中所提到的，匹配服务联动房间服有两种方式，一种是主动获取房间服状态及网络信息；另一种是房间服自注册上报。但对于第二种方式，值得注意的是真正执行分配地址给玩家客户端前，需要确认一次对应房间服的状态，因为网络地址的获取和分配是异步的，中间过程中存在房间服不可用的情况。而对于第一种方式，推荐的做法是基于Kubernetes Informer机制监听GameServer对象，在存在为对局分配房间服需求时，获取当前可用的GameServer，并将对应的网络信息返回，此时的网络信息的获取和分配是同步的，具体实现方式可以参考[kruise-game-open-match-director的allocator代码](https://github.com/CloudNativeGame/kruise-game-open-match-director/blob/main/pkg/allocator.go)。

## 状态管理

### 会话类游戏状态设置

在上一节游戏匹配中，我们提到匹配服务在为形成对局的各个玩家客户端分配房间服地址时需要获取房间服的状态来保证给玩家分配的房间服是可用的。那么房间服状态可用应如何界定呢？在OKG的设计思想里，一个可用的游戏服应该 = 基础设施运行时状态可用（State Ready） + 基础设施网络可用（Network Ready） + 业务状态可用。

何为业务状态可用？这涉及到游戏业务对于房间服状态的定义。我们推荐房间服业务至少包含以下几种状态：

- None(不存在任何异常或特殊的状态，表明可用，也是房间服初始化启动后的默认状态)
- Allocated(已被分配，表明正在或即将有玩家进行游戏)
- WaitToBeDeleted(即将被删除，等待OKG回收pod)

以上三种状态可用GameServer Spec中的OpsState记录。OKG提供两种方式进行状态标记：

- 调用Kubernetes API 直接更改GameServer.Spec.OpsState （通常为匹配系统分配完房间服后将其标记为Allocated）
- 通过[自定义服务质量](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities)将容器中的业务状态暴露并转化为对应的GameServer.Spec.OpsState

最简单的状态转化模式如图所示：

1. 房间服被拉起后的默认状态可用，此时OpsState为**None**
2. 当匹配需求产生时，匹配服务查找可用的（基础设施Ready & OpsState为None）房间服，分配后将其OpsState置为**Allocated** （通过Kubernetes API进行设置，可参考[kruise-game-open-match-director的allocator代码](https://github.com/CloudNativeGame/kruise-game-open-match-director/blob/main/pkg/allocator.go)。若使用OKG + Open Match则无需设置，Director已经做了上述工作）
3. 当对局结束，游戏业务通过[自定义服务质量](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities)将OpsState置为**WaitToBeDeleted**。这样对应的pod将被OKG自动进行回收删除，后续弹性伸缩部分将展开介绍。

<img src={require('/static/img/kruisegame/best-practices/session-based-game-state-1.png').default} style={{  width: '150px'}} />


当然，如果希望不频繁的起停pod，在对局结束后也可以更改OpsState为None。整体状态转化模式如图所示：

1. 同上，房间服被拉起后的默认状态可用，此时OpsState为**None**
2. 同上，分配房间服后，匹配系统将其设置为**Allocated**
3. 当对局结束，通过[自定义服务质量](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities)将OpsState置为**None**
4. 通过协程判断房间服状态长期处于None状态时，将通过[自定义服务质量](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities)将OpsState置为**WaitToBeDeleted。**

<img src={require('/static/img/kruisegame/best-practices/session-based-game-state-2.png').default} style={{  width: '200px'}} />

### 通过服务质量透出房间服状态

在完成房间服状态流转设计后，我们会发现有些状态是有房间服业务决定的，而这些状态同时也需要透出到Kubernetes层面，这样才能联动自动伸缩器、匹配系统等。因此，需要一种机制将业务状态标志到Kubernetes对象上，也就是GameServer上，而这就是**自定义服务质量**功能。

自定义服务质量通过**执行探测脚本**的结果，以及用户设置的**探测结果对应状态**来自动化地将房间服状态标记到GameServer上。

下面是一个状态探测脚本名为waitToBeDeleted.sh，探测容器中GS_STATE环境变量的值是否为WaitToBeDeleted

```bash
#!/bin/bash
if [ -z "$GS_STATE" ]; then
  exit 1
elif [ "$GS_STATE" = "WaitToBeDeleted" ]; then
  echo "$GS_STATE"
else
  exit 1
fi
```

对应的GameServerSet yaml应该如下

```bash
...
spec:
  ...
  serviceQualities: 
    - name: waitToBeDeleted
      containerName: battle #探测容器名为battle的容器
      permanent: false
      exec:
        #OKG将周期性执行battle容器中./waitToBeDeleted.sh脚本（需要注意将脚本放置到对应的路径下）
        command: ["bash", "./waitToBeDeleted.sh"]
      serviceQualityAction:
        #当探测结果为true，也就是脚本执行结果为正常退出（退出码为0）时，标记GameServer的opsState为WaitToBeDeleted
        - state: true
          opsState: WaitToBeDeleted
```

当然，自定义服务质量可以有多个，比如当房间服需要将自身None状态透出时，名为none.sh的脚本如下：

```bash
#!/bin/bash
if [ -z "$GS_STATE" ]; then
  exit 1
elif [ "$GS_STATE" = "None" ]; then
  echo "$GS_STATE"
else
  exit 1
fi
```

对应的GameServerSet yaml应该如下：

```bash
...
spec:
  ...
  serviceQualities: 
    - name: waitToBeDeleted
      containerName: battle #探测容器名为battle的容器
      permanent: false
      exec:
        #OKG将周期性执行battle容器中./waitToBeDeleted.sh脚本（需要注意将脚本放置到对应的路径下）
        command: ["bash", "./waitToBeDeleted.sh"]
      serviceQualityAction:
        #当探测结果为true，也就是脚本执行结果为正常退出（退出码为0）时，标记GameServer的opsState为WaitToBeDeleted
        - state: true
          opsState: WaitToBeDeleted
    - name: none
      containerName: battle #探测容器名为battle的容器
      permanent: false
      exec:
        #OKG将周期性执行battle容器中./none.sh脚本（需要注意将脚本放置到对应的路径下）
        command: ["bash", "./none.sh"]
      serviceQualityAction:
        #当探测结果为true，也就是脚本执行结果为正常退出（退出码为0）时，标记GameServer的opsState为None
        - state: true
          opsState: None
```

至此，我们发现房间服业务程序只需要在合适的时刻节点设置对应的GS_STATE的环境变量值即可。比如：

- 当房间服刚刚拉起，设置GS_STATE=None；
- 当房间服有玩家进入，设置GS_STATE=Allocated（尽管不需要透出到opsState，但依然可以做状态变迁，避免自身状态与在Kubernetes显示的不一致）；
- 当房间服对局结束，再设置GS_STATE=None；
- 当房间服长时间空闲，设置GS_STATE=WaitToBeDeleted。

## 弹性伸缩

在上一节中，我们设计了三种房间服状态：None / Allocated / WaitToBeDeleted。在本节，我们将根据以上房间服状态进行相应的弹性伸缩配置。

对于会话类游戏弹性伸缩的理想状态就是，在业务高峰期房间服数量足够多，可以让玩家秒级接入；而业务低峰期的时候减少房间服的数量，节约资源成本。OKG提供了自动伸缩器，可以感知房间服状态，来自动调节GameServerSet的replicas值，从而实现根据游戏业务状态伸缩的理想效果。

### 房间服自动减少

在状态管理一节中，我们也有所提到，opsState为WaitToBeDeleted的GameServer将会自动被OKG回收。这样一来，只要业务决定了自身不再提供服务了，通过自定义服务质量设置WaitToBeDeleted即可。关于缩容策略的具体的配置可以参考 [https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#使用示例](https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)

### 房间服自动增加

OKG提供自动扩容的核心策略就是保证房间服存在可用且充足的数量。这个数量等同于buffer，是由用户决定的，在OKG中这个参数叫做 **minAvailable**。

在当前所有opsState为None的游戏服数量少于设置**minAvailable**值时，OKG将自动扩容出新的游戏服，使opsState为None的游戏服数量满足设置的最小个数。

### 资源自动伸缩

Kubernetes的弹性伸缩涵盖两个层面，应用层弹性 与 资源层弹性。其中OKG提供了房间服应用层弹性的能力，自动地调节房间服对应pod的数量。而仅调节pod的数量是无法实现资源成本的节约，需要自动地调节节点数量，这正是Kubernetes cluster-autoscaler实现资源层弹性的方式。cluster-autoscaler核心原理是：

- 当pod由于资源不足而处于pending状态时，自动弹出节点。
- 当节点利用率过低/节点空闲时，自动回收节点。

对于游戏场景，自动伸缩最佳实践建议如下：

- 根据节点规格设置OKG **minAvailable** 大小。节点的启动是需要时间的，所以需要提前准备好空闲可用的房间服供玩家连接。空闲的房间服本质上将节点水平扩容的触发时间前置了，弥补了启动机器的时间差。这样一来，节点规格和minAvailable就关联密切了，举个例子：集群中使用的节点规格为8核16G，而运行在其上的房间服pod需要1核2G的资源，这样理论上该节点可以运行7个房间服（节点会有保留资源，所以不是8个）。在这种情况下，minAvailable 设置为7以上，则集群中会一直存在着一个“空闲”节点（这里的空闲指的不是没有pod，而是没有玩家）；设置14以上，则集群中会一直存在着两个“空闲”节点，这样也就将**房间服备用数量**转化为了**节点备用数量**，用户可以按照业务场景、成本控制的角度具体设置。

- 设置节点完全空闲时才使cluster autoscaler自动回收节点，保障游戏运行正常。根据资源阈值的方式缩容对游戏并不友好，由于游戏是有状态的服务，存在极大的可能性遇到节点上资源负载较小但玩家依然正在游戏的情况，不能轻易删除。
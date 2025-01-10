# 游戏服敏捷交付与运维管理最佳实践

在传统的运维模式中，游戏服务器的部署不可避免地导致业务与底层基础设施的紧密耦合。这种面向过程的交付方式，由于自动化程度不高和缺乏有效的批量管理能力，常常导致部署效率低下并且一旦出现问题，排障变得异常困难。

相较之下，云原生技术以其声明式和一致性交付的特性，为游戏服务器的部署与运维提供了显著的效率提升。然而，在实际的应用过程中，我们观察到，由于游戏服务器具有状态性的特质，其交付逻辑与传统的无状态服务存在显著的差别。本文旨在阐明这些差异，并提出最佳实践方案，旨在为云原生环境下游戏服务器的敏捷部署和运维管理开辟新的思路。

## 使用ArgoCD进行游戏服交付

在执行示例具体的发布操作之前，我们一起认识下云原生的交付思想 —— 声明式而非面向过程，这也就意味着云原生式的应用交付关注的并不是应用的部署过程而是对应用的定义。而应用的定义就是Yaml，它通过配置参数化的方式描述这个应用该是什么样子。因此，一切有关应用的变更和发布实际上都是对应用描述（Yaml）的更改。至此我们发现，我们需要一个仓库将Yaml落盘，记录当前对应用的描述，并且能够追溯和审计过去Yaml的变更。说到这里我相信大家会发现git repo天然符合该特点，运维工程师可以通过提交Commit和Merge Request的方式将Yaml上传并落盘，权限管理、审计都遵循git规范。在理想状态下，我们只需要维护一套对游戏服描述的Yaml，一键触发全球多地域的游戏服发布，无需面向过程一一操作集群，去执行部署动作。这就是GitOps的思想。
在GitOps落地过程中最富有挑战的事情实际上是对游戏服应用的描述抽象。GameServerSet是一批同属性的游戏服集合，属于Kubernetes中的面向游戏服管理的工作负载，因此每个GameServerSet是无法跨Kubernetes集群部署的。因此在某些情境，比如多集群的场景下，每一个集群需要至少一个GameServerSet，且每个GameServerSet的描述或多或少存在着一些差异，似乎难以通过一个Yaml将所有游戏服都概括。举个例子，考虑全球开服的场景 —— 计划在上海、东京、法兰克福三地开服，因此我们需要这三个地区的基础设施资源。在上海我希望发布10个游戏区服，而在法兰克福我只希望发布3个区服，这样一来，一个Yaml因为replicas字段的差异就无法描述不同地域的游戏服。难道我们需要为每一个地域维护一个Yaml吗？这样也非合理的做法，当进行非差异性字段变更时（例如，为所有地域的游戏服打上一个标签），我们需要重复地执行多个Yaml的更改，集群数量多的时候容易造成遗漏或者错误，这并不符合云原生交付思想。
实际上，我们可以通过Helm Chart进行游戏服应用的进一步抽象，将差异性的部分作为Value提取出来。在我们本次的示例中(https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game),
我们抽象出这样几个差异性字段：

* 主镜像 —— 每个地域/集群的主镜像可能存在差异
* sidecar镜像 —— 每个地域/集群的sidecar镜像可能存在差异
* 副本数 —— 每个地域/集群的发布的游戏服数量可能存在差异
* 是否自动伸缩 —— 每个地域/集群对于自动伸缩的要求可能存在差异

除此之外的其他字段都保持一致，意味着不存在地域差异性影响。
ArgoCD(https://argo-cd.readthedocs.io/en/stable/),
其很好地继承了GitOps的思想，本文将利用ArgoCD进行游戏服交付的实操。接下来我们展开具体的操作：

### 连接Git仓库
我们需要将描述了游戏服应用的Git仓库连接起来。操作步骤如下：
1. 在ArgoCD UI左侧导航栏选择Settings，然后选择Repositories > + Connect Repo
2. 在弹出的面板中配置以下信息，然后单击CONNECT添加连接

| 区域                                 | 参数                             | 参数值                                                              |
|------------------------------------|--------------------------------|------------------------------------------------------------------|
| Choose your connection method      |                                | VIA HTTPS                                                        |
| CONNECT REPO USING HTTPS           |                                | git                                                              |
|                                    | Project                        | default                                                          |
|                                    | Repository URL                 | https://github.com/AliyunContainerService/gitops-demo.git        |
|                                    | Skip server verification       | 勾选                                                               |

<img src={require('/static/img/kruisegame/best-practices/git1.png').default} style={{  width: '800px'}} />
<img src={require('/static/img/kruisegame/best-practices/git2.png').default} style={{  width: '800px'}} />

### PvE类型游戏发
PvE 类型游戏通常存在区服概念，大多情况下由运维工程师手动控制各地域的开服数量。关于 PvE 游戏云原生化最佳实践可参考 OKG PvE 游戏最佳实践文档（https://openkruise.io/zh/kruisegame/best-practices/pve-game)
在初次尝试ArgoCD时，我们可以使用白屏控制台为每个地域的集群分别创建Application：
1. 在ArgoCD UI左侧导航栏选择Applications，然后单击+ NEW APP
2. 在弹出的面板配置以下信息，然后单击CREATE进行创建。（以opengame-demo-shanghai-dev为例）

| 区域                           | 参数                       | 参数值                                                                           |
|------------------------------|--------------------------|---------------------------------------------------------------------------------|
| GENERAL                      | Application Name         | opengame-demo-shanghai-dev                                                      |
|                              | Project Name             | default                                                                         |
|                              | SYNC POLICY              | 在下拉列表中选择Automatic。参数取值如下：                                                       |
| Manual：手动同步Git仓库变化           |                          |                                                                                 |
| Automatic：自动同步Git仓库变化，间隔3min |                          |                                                                                 |
|                              | SYNC OPTIONS             | 勾选AUTO-CREATE NAMESPACE                                                         |
| SOURCE                       | Repository URL           | 在下拉列表选择已有Git Repo，此处选择https://github.com/AliyunContainerService/gitops-demo.git |
|                              | Revision                 | HEAD                                                                            |
|                              | Path                     | manifests/helm/open-game                                                        |
| DESTINATION                  | Cluster URL/Cluster Name | 在下拉列表中选择目标集群                                                                    |
|                              | Namespace                | opengame                                                                        |
| HELM                         | VALUES FILES             | values.yaml                                                                     |
| PARAMETERS                   | replicas                 | 3 #发布三个游戏服                                                                      |
|                              | scaled.enabled           | false # 不开启自动弹性伸缩                                                               |
3. 创建完成后，在Application页面，即可看到opengame-demo-shanghai-dev的应用状态。如果SYNC POLICY选择的是Manual方式，需要手动点击SYNC，将应用同步部署至目标集群。应用的Status为Healthy和Synced，表示已经成功同步。

<img src={require('/static/img/kruisegame/best-practices/argo.png').default} style={{  width: '850px'}} />

4. 单击opengame-demo-shanghai-dev应用名称，即可查看应用详情，展示应用相关的Kubernetes资源的拓扑结构及相应状态。

对ArgoCD有所熟悉了之后，我们也可以通过ApplicationSet对象来一键发布游戏服。各个集群的差异性通过elements抽象出来，例如下面Yaml中，以集群维度抽象出三个字段：cluster集群名称用于区分Application名称；url用于区分目标集群地址；replicas用于区别不同集群发布的游戏服数量。
编写完成该ApplicationSet Yaml 后，将其部署到ACK One舰队集群即可自动创建出四个Application。
```bash
kubectl apply -f pve.yaml -n argocd

# pve.yaml 内容如下：
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: minecraft
spec:
  generators:
  - list:
      elements:
      - cluster: shanghai-dev
        url: <https://47.100.237.xxx:6443>
        replicas: '1'
      - cluster: shanghai-prod
        url: <https://47.101.214.xxx:6443>
        replicas: '3'
      - cluster: frankfurt-prod
        url: <https://8.209.103.xxx:6443>
        replicas: '2'
      - cluster: japan-prod
        url: <https://10.0.0.xxx:6443>
        replicas: '2'
  template:
    metadata:
      name: '{{cluster}}-minecraft'
    spec:
      project: default
      source:
        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'
        targetRevision: HEAD
        path: manifests/helm/open-game
        helm:
          valueFiles:
          - values.yaml
          parameters: #对应helm chart中提取的value参数
          - name: replicas
            value: '{{replicas}}'
          - name: scaled.enabled 
            value: 'false'
      destination:
        server: '{{url}}'
        namespace: game-server #部署到对应集群的game-server命名空间下
      syncPolicy:
        syncOptions:
          - CreateNamespace=true #若集群中命名空间不存在则自动创建
```
在该Yaml中，所有的镜像版本都一致，若希望各集群镜像版本出现差异，可以仿照replicas的方式，添加新的parameters参数。

### PvP类型游戏发布

对于 PvP 类型的游戏，房间服的数量由自身伸缩器调配，而非运维工程师手动指定。有关 PvP 类型游戏的云原生化最佳实践可参考 OKG PvP 游戏最佳实践文档（https://openkruise.io/zh/kruisegame/best-practices/session-based-game)

在 OKG 中我们通过为 GameServerSet 配置 ScaledObject 对象来实现房间服的弹性伸缩。因此，Helm Chart Value中的scaled.enabled 在此场景下需要开启。此外，房间服的副本数有 ArgoCD 和 OKG 2 个控制者而冲突，可以通过让 ArgoCD 忽略 GameServerSet 资源的副本数变化来解决，具体在 spec.ignoreDifferences 设置相应字段即可。考虑以上情况，该 pvp.yaml 如下所示：

```bash
kubectl apply -f pvp.yaml -n argocd

# pvp.yaml 内容如下：

apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: pvp
spec:
  generators:
  - list:
      elements:
      - cluster: shanghai-dev
        url: <https://47.100.237.xxx:6443>
      - cluster: shanghai-prod
        url: <https://47.101.214.xxx:6443>
      - cluster: frankfurt-prod
        url: <https://8.209.103.xxx:6443>
      - cluster: japan-prod
        url: <https://10.0.0.xxx:6443>
  template:
    metadata:
      name: '{{cluster}}-pvp'
    spec:
      project: defaultminecraft
      ignoreDifferences: # 设置 GameServerSet minecraft副本数目由集群自控制
      - group: game.kruise.io
        kind: GameServerSet
        name: minecraft
        namespace: game
        jsonPointers:
        - /spec/replicas
      source:
        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'
        targetRevision: HEAD
        path: manifests/helm/open-game
        helm:
          valueFiles:
          - values.yaml
      destination:
        server: '{{url}}'
        namespace: pvp-server
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
```

在该Yaml中，所有的镜像版本都一致，若希望各集群镜像版本出现差异，可以仿照replicas的方式，添加新的parameters参数。

### 经验总结
通过上面的示例，我们会发现做好应用的抽象是游戏服敏捷交付的关键之处。我们需要尽量保持GameServerSet大多字段一致，将有差异性的字段提取出来，这样只需要针对不同环境更改维护特定的相应字段即可，真正做到敏捷交付。

## 游戏服运维管理
即使是同个工作负载（GameServerSet），游戏服之间的状态也是存在差异性的。在这种情况下，交付后的游戏服也需要持续地进行定向运维管理，这是与无状态业务最大的不同。

### OKG Dashboard 白屏化主动运维
通常，我们需要主动运维游戏服 —— 统计和查询游戏服状态；定向更改游戏服版本、资源规格、运维状态等。通过OKG Dashboard可以实现游戏服的主动运维： 
* 有关OKG Dashboard使用说明可参考：https://openkruise.io/zh/kruisegame/user-manuals/game-dashboard
* 对OKG Dashboard的更多需求可在issue下评论：https://github.com/openkruise/kruise-game/issues/139

### 建设监控告警机制，加强游戏服稳定性
除了主动运维以外，我们需要建立稳定性问题订阅机制。当游戏服非预期运行时，运维工程师能够及时响应并处理。
OKG提供了自定义服务质量的功能，灵活运用此功能可以实现定向游戏服异常状态透出并告警。可阅读文档：
* https://openkruise.io/zh/kruisegame/user-manuals/service-qualities#%E6%B8%B8%E6%88%8F%E6%9C%8D%E7%8A%B6%E6%80%81%E5%BC%82%E5%B8%B8%E8%AE%BE%E7%BD%AE%E7%BB%B4%E6%8A%A4%E4%B8%AD
* https://openkruise.io/zh/kruisegame/best-practices/pve-game#%E6%B8%B8%E6%88%8F%E6%9C%8D%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E8%B4%A8%E9%87%8F

此外，若希望游戏服通过监控指标来实现定向告警，也可以通过在自定义服务质量脚本中调用prometheus API（pod name可利用DownwardAPI获取），对比指标阈值来决定GameServer OpsState的值。
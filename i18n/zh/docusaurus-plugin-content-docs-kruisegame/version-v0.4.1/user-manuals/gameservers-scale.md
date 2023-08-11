# 游戏服伸缩
## OpenKruiseGame的水平伸缩特性

### 缩容顺序

OKG提供游戏服状态设置的能力，您可以手动/自动(服务质量功能)地设置游戏服的运维状态或删除优先级。当缩容时，GameServerSet负载会根据游戏服的状态进行缩容选择，缩容规则如下：

1）根据游戏服的opsState缩容。按顺序依次缩容opsState为`WaitToBeDeleted`、`None`、`Maintaining`的游戏服

2）当opsState相同时，按照DeletionPriority(删除优先级)缩容，优先删除DeletionPriority大的游戏服

3）当opsState与DeletionPriority都相同时，优先删除名称尾部序号较大的游戏服

#### 示例

部署一个副本为5的游戏服：

```bash
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 5
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
EOF
```

生成5个GameServer：

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

对minecraft-2设置删除优先级为10：

```bash
kubectl edit gs minecraft-2

...
spec:
  deletionPriority: 10 #初始为0，调大到10
  opsState: None
  updatePriority: 0
...
```

手动缩容到4个副本：

```bash
kubectl scale gss minecraft --replicas=4
gameserverset.game.kruise.io/minecraft scale
```

游戏服的数目最终变为4，可以看到2号游戏服因为删除优先级最大所以被删除：

```bash
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP
minecraft-0   Ready      None       0     0
minecraft-1   Ready      None       0     0
minecraft-2   Deleting   None       10    0
minecraft-3   Ready      None       0     0
minecraft-4   Ready      None       0     0

# After a while
...

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

设置minecraft-3的opsState为WaitToBeDeleted：

```bash
kubectl edit gs minecraft-3

...
spec:
  deletionPriority: 0 
  opsState: WaitToBeDeleted #初始为None, 将其改为WaitToBeDeleted
  updatePriority: 0
...
```

手动缩容到3个副本：

```bash
kubectl scale gss minecraft --replicas=3
gameserverset.game.kruise.io/minecraft scaled
```

游戏服的数目最终变为3，可以看到3号游戏服因为处于WaitToBeDeleted状态所以被删除：

```bash
kubectl get gs
NAME          STATE      OPSSTATE          DP    UP
minecraft-0   Ready      None              0     0
minecraft-1   Ready      None              0     0
minecraft-3   Deleting   WaitToBeDeleted   0     0
minecraft-4   Ready      None              0     0

# After a while
...

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

手动扩容回5个副本：

```bash
kubectl scale gss minecraft --replicas=5
gameserverset.game.kruise.io/minecraft scaled
```

游戏服的数目最终变为5，此时扩容出的游戏服序号为2与3：

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

### 游戏服 ID Reserve

GameServerSet提供了`Spec.ReserveGameServerIds`字段。通过该字段，用户指定ID，将对应的游戏服删除；或者在创建新游戏服时避免该序号对应的游戏服生成。

例如，gss下存在5个游戏服，ID分别为0、1、2、3、4。此时设置`ReserveGameServerIds`，填写3和4，在不更改副本数目的情况下，gss将会删除3和4，同时生成5和6的游戏服，如下所示：

```bash
kubectl edit gss minecraft
...
spec:
  reserveGameServerIds:
  - 3
  - 4
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     79s
minecraft-1   Ready      None       0     0     79s
minecraft-2   Ready      None       0     0     79s
minecraft-3   Deleting   None       0     0     78s
minecraft-4   Deleting   None       0     0     78s
minecraft-5   Ready      None       0     0     23s
minecraft-6   Ready      None       0     0     23s
```

如若填写在`ReserveGameServerIds`字段增加5和6，同时减少副本数目到3，则gss会删除5和6的游戏服，如下所示：

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 3
  reserveGameServerIds:
  - 3
  - 4
  - 5
  - 6
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     10m
minecraft-1   Ready      None       0     0     10m
minecraft-2   Ready      None       0     0     10m
minecraft-5   Deleting   None       0     0     9m55s
minecraft-6   Deleting   None       0     0     9m55s
```

**在缩容时，OKG将优先考虑被Reserve的游戏服，再按照上文提到的缩容顺序进行缩容**

### 缩容策略

OKG 提供两种缩容策略：1）General；2）ReserveIds。您可在`GameServerSet.Spec.ScaleStrategy.ScaleDownStrategyType`设置对应策略

#### General

当用户不配置ScaleDownStrategyType字段，General为默认配置。缩容行为如上文中所述。

#### ReserveIds

用户设置ScaleDownStrategyType为`ReserveIds`，当游戏服集合发生缩容时，被删掉的游戏服尾部序号会被记录在reserveGameServerIds中，后续发生扩容时，这些尾部序号不会再使用；如果想再使用这些尾部序号，只需要将它们从reserveGameServerIds中拿出来同时调整副本数即可。

#### 示例

例如，gss下存在5个游戏服，ID分别为0、1、2、3、4。此时设置`GameServerSet.Spec.ScaleStrategy.ScaleDownStrategyType`为`ReserveIds`，同时减少副本数目到3

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 3
  scaleStrategy:
    scaleDownStrategyType: ReserveIds
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     10m
minecraft-1   Ready      None       0     0     10m
minecraft-2   Ready      None       0     0     10m
minecraft-3   Deleting   None       0     0     9m55s
minecraft-4   Deleting   None       0     0     9m55s
...

kubectl get gss minecraft -o yaml
spec:
  replicas: 3
  reserveGameServerIds:
  - 3
  - 4
  scaleStrategy:
  scaleDownStrategyType: ReserveIds
```

可以看到，序号为3和4的游戏服被回填到了`reserveGameServerIds`字段，此时若希望指定4号游戏服扩容，则将4从reserveGameServerIds去除，并增加副本数到4：

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 4
  reserveGameServerIds:
  - 3
  scaleStrategy:
    scaleDownStrategyType: ReserveIds
...

# After a while

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     17m
minecraft-1   Ready   None       0     0     17m
minecraft-2   Ready   None       0     0     17m
minecraft-4   Ready   None       0     0     6s
```

通过该功能可以实现指定序号游戏服扩容。

## 游戏服的水平自动伸缩

游戏服与无状态业务类型不同，对于自动伸缩特性有着更高的要求，其要求主要体现在缩容方面。

由于游戏为强有状态业务，随着时间的推移，游戏服之间的差异性愈加明显，缩容的精确度要求极高，粗糙的缩容机制容易造成玩家断线等负面影响，给业务造成巨大损失。

原生Kubernetes中的水平伸缩机制如下图所示

<img src={require('/static/img/kruisegame/user-manuals/autoscaling-k8s.png').default} style={{ height: '400px' , width: '700px'}} />

在游戏场景下，它的主要问题在于：

- 在pod层面，无法感知游戏服业务状态，进而无法通过业务状态设置删除优先级
- 在workload层面，无法根据业务状态选择缩容对象
- 在autoscaler层面，无法定向感知游戏服业务状态计算合适的副本数目

这样一来，基于原生Kubernetes的自动伸缩机制将在游戏场景下造成两大问题：

- 缩容数目不精确。容易删除过多或过少的游戏服。
- 缩容对象不精确。容易删除业务负载水平高的游戏服。

OKG 的自动伸缩机制如下所示

<img src={require('/static/img/kruisegame/user-manuals/autoscaling-okg.png').default} style={{ height: '400px' , width: '700px'}} />

- 在游戏服层面，每个游戏服可以上报自身状态，通过自定义服务质量或外部组件来暴露自身是否为WaitToBeDeleted状态。
- 在workload层面，GameServerSet可根据游戏服上报的业务状态来决定缩容的对象，如[游戏服水平伸缩](gameservers-scale.md)中所述，WaitToBeDeleted的游戏服是删除优先级最高的游戏服，缩容时最优先删除。
- 在autoscaler层面，精准计算WaitToBeDeleted的游戏服个数，将其作为缩容数量，不会造成误删的情况。

如此一来，OKG的自动伸缩器在缩容窗口期内只会删除处于WaitToBeDeleted状态的游戏服，真正做到定向缩容、精准缩容。

### 使用示例

_**前置条件：在集群中安装 [KEDA](https://keda.sh/docs/2.10/deploy/)**_

部署ScaledObject对象来设置自动伸缩策略，具体字段含义可参考 [ScaledObject API](https://github.com/kedacore/keda/blob/main/apis/keda/v1alpha1/scaledobject_types.go)

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: minecraft #填写对应GameServerSet的名称
spec:
  scaleTargetRef:
    name: minecraft #填写对应GameServerSet的名称
    apiVersion: game.kruise.io/v1alpha1 
    kind: GameServerSet
  pollingInterval: 30
  minReplicaCount: 0
  advanced:
    horizontalPodAutoscalerConfig: 
      behavior: #继承HPA策略，可参考文档 https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior
        scaleDown:
          stabilizationWindowSeconds: 45 #设置缩容稳定窗口时间为45秒
          policies:
            - type: Percent
              value: 100
              periodSeconds: 15
  triggers:
    - type: external
      metricType: AverageValue
      metadata:
        scalerAddress: kruise-game-external-scaler.kruise-game-system:6000
```

部署完成后，更改gs minecraft-0 的 opsState 为 WaitToBeDeleted（可参考[自定义服务质量](service-qualities.md)实现自动化设置游戏服状态）

```bash
kubectl edit gs minecraft-0

...
spec:
  deletionPriority: 0 
  opsState: WaitToBeDeleted #初始为None, 将其改为WaitToBeDeleted
  updatePriority: 0
...
```

经过缩容窗口期后，游戏服minecraft-0自动被删除
```bash
kubectl get gs
NAME          STATE      OPSSTATE          DP    UP
minecraft-0   Deleting   WaitToBeDeleted   0     0
minecraft-1   Ready      None              0     0
minecraft-2   Ready      None              0     0

# After a while


kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
```

除了设置自动缩容策略，也可以设置自动扩容策略。自动扩容的方式有很多，比如，利用资源指标或自定义指标进行扩容。使用CPU利用率进行扩容，其完整的yaml如下。

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: minecraft #填写对应GameServerSet的名称
spec:
  scaleTargetRef:
    name: minecraft #填写对应GameServerSet的名称
    apiVersion: game.kruise.io/v1alpha1
    kind: GameServerSet
  pollingInterval: 30
  minReplicaCount: 0
  advanced:
    horizontalPodAutoscalerConfig:
      behavior: #继承HPA策略，可参考文档 https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior
        scaleDown:
          stabilizationWindowSeconds: 45 #设置缩容稳定窗口时间为45秒
          policies:
            - type: Percent
              value: 100
              periodSeconds: 15
  triggers:
    - type: external
      metricType: AverageValue
      metadata:
        scalerAddress: kruise-game-external-scaler.kruise-game-system:6000
    - type: cpu
      metricType: Utilization # 允许的类型是 "利用率 "或 "平均值"
      metadata:
        value: "50"
```

对游戏服进行压测，可以看到游戏服开始扩容

```bash
kubectl get gss
NAME        DESIRED   CURRENT   UPDATED   READY   MAINTAINING   WAITTOBEDELETED   AGE
minecraft   5         5         5         0       0             0                 7s

# After a while

kubectl get gss
NAME        DESIRED   CURRENT   UPDATED   READY   MAINTAINING   WAITTOBEDELETED   AGE
minecraft   20        20        20        20      0             0                 137s
```

### 其他设置

Kubernetes对于自动伸缩行为具备一定容忍度，该值由kube-controller-manager 参数 --horizontal-pod-autoscaler-tolerance 决定，默认为0.1，这意味着理想副本数与当前副本数的差值在10%以内时不会触发扩容或缩容。
如果做到更加精准地自动伸缩，可以调低该参数，例如设置0.0时，OKG将会缩容所有WaitToBeDeleted的游戏服。
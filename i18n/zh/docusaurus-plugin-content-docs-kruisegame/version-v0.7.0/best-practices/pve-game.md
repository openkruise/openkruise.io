# 传统区服类游戏（PvE）最佳实践

## PvE区服类游戏落地Kubernetes的挑战

首先，PvE区服类游戏有以下特点：

1. 单个区服运行时间较长，应尽量避免停服操作，利于玩家游戏体验
2. 开服时（或）存在配置差异 
3. 单区服容器中（或）存在多进程，区服服务质量需由用户定义 
4. 随着时间推移，各区服状态存在差异，需定向管理，如更改资源规格、镜像版本、定向合服等

该类游戏在落地Kubernetes通常遇到**左右为难**的困境：

- 若使用Kubernetes原生workload，则无法进行游戏服精细化管理，具体地：
    - 若使用Deployment管理：
        - 生成的pod没有类似序号的状态标识，导致：1）无法基于序号进行有状态的服务发现了；2）无法区别游戏服之间状态差异性；3）异常重启时状态丢失，配置/存储等无法自动重定向。
    - 若使用StatefulSet管理：
        - 生成的pod虽然有序号作为状态标识，但是：1）只能从序号大到小进行更新或删除，无法定向管理游戏服；2）无法感知游戏服之间的状态差异特性。
- 若不使用Kubernetes原生workload，则无法利用上K8s的编排能力：
    - 若使用脚本程序批量开服：
        - 属于面向过程的方式，参数无法落盘，出错率高。
    - 若使用gitops管理：
        - 区服数量较多时需要维护大量有着相同字段的yaml文件，有时甚至超过文件长度限制；批量发布时也十分复杂。
    - 若通过自建PaaS平台管理：
        - 需要引入大量开发工作，且与业务属性耦合较重，导致后续迭代复杂

本篇最佳实践将介绍如何利用OKG管理区服类游戏服务。

## 游戏服热更新

OKG提供的原地升级热更新是一种更加云原生的游戏服热更落地方式，通过该方式可以实现游戏服热更文件的版本化管理、灰度更新、更新状态感知、以及故障恢复后热更版本一致性。
具体实现方式可参考相应文档 https://openkruise.io/zh/kruisegame/user-manuals/hot-update

## 游戏服配置管理

GameServerSet管理的GameServer具有序号属性，其名称是固定不变的，这一点与StatefulSet相同。因此，「GameServerSet名称+序号」可作为游戏服的唯一标识，联动分布式存储或配置管理系统进行配置的差异化管理。

### 挂载对象存储

通过对象存储，将不同游戏服的不同配置分别放在以游戏服名称命名的路径下，保证bucket的路径与游戏服一一对应，以PVC在GameServerSet上声明。该方式示意图如下：

<img src={require('/static/img/kruisegame/best-practices/gss-oss-config.png').default} style={{  width: '500px'}} />

GameServerSet Yaml示例如下：

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gameserver
  namespace: default
spec:
  replicas: 2
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
      - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
        name: minecraft
        env:
        - name: POD_NAME #把pod name作为环境变量传入
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        volumeMounts:
        - name: pvc-oss #挂载oss对应pvc
          mountPath: "/app/sgame.config" #容器中的目录及文件
          subPathExpr: $(POD_NAME)/sgame.config #对应oss目录及文件
      volumes:
      - name: pvc-oss
        persistentVolumeClaim:
          claimName: pvc-oss
```

这样一来，开服前只需准备好游戏服对应配置并上传到bucket对应路径中，再部署GameServerSet或调整Replicas即可。
如图所示，gameserver-0 与 gameserver-1两个目录下的文件内容不同，将分别挂载到对应的游戏服gameserver-0 与 gameserver-1上：

<img src={require('/static/img/kruisegame/best-practices/oss-bucket-dir.jpg').default} style={{  width: '500px'}} />

### 动态拉取

如果业务存在配置中心服务（如Nacos），可以通过游戏服名称是固定且唯一的特性，在游戏服容器启动时，将自身的名称作为请求参数向配置中心发生请求拉取对应配置。
容器自身名称的获取方式与挂载对象存储中类似，通过 DownwardAPI将其作为环境变量传入。

## 游戏服自定义服务质量

### 背景与概念

传统区服类游戏容器化落地时往往以“富容器”的形态存在，也就是一个容器中存在着多种进程，每个进程负责单个区服的不同功能。此时单个游戏服的状态错综复杂。而原生 Kubernetes 对业务状态管理停留在容器层面，无法精细化感知容器中特定进程状态，造成故障或异常难以定位处理。

OKG 认为游戏服的服务质量应由用户定义，用户可根据业务针对性地设置游戏服所处的状态，并精细化地进行相应处理。通过 OKG 的”自定义服务质量“探测到具体进程异常状态，并将其透出至 Kubernetes 侧，再利用 kube-event 等事件通知组件将异常告警至运维群中，帮助运维工程师快速发现问题，实现秒级故障定位，分钟级的故障处理。

下图是自定义服务质量功能示意图，通过 probe.sh 脚本的返回结果，对应更改GameServer的运维状态，实现故障/异常的快速定位：

<img src={require('/static/img/kruisegame/best-practices/service-quality.png').default} style={{  width: '500px'}} />

### 示例

我们来通过一个示例看下如何通过一个探测脚本实现游戏服多种状态感知。

在制作容器镜像时，编写探测容器状态的脚本。该示例脚本 probe.sh 将探测gate进程、data进程是否存在。
当gate进程不存在则输出“gate”，并正常退出；当data进程不存在则输出“data”，并正常退出；当不存在异常，以退出码1退出。

probe.sh 是业务容器中探测脚本，将被OKG周期性调用，原理类似于Kubernetes原生的liveness/readiness探针。在上述场景下，其代码如下：

```shell
#!/bin/bash

gate=$(ps -ef | grep gate | grep -v grep | wc -l)
data=$(ps -ef | grep data | grep -v grep | wc -l)

if [ $gate != 1 ]
then
  echo "gate"
  exit 0
fi

if [ $data != 1 ]
then
  echo "data"
  exit 0
fi

exit 1
```

而对应的GameServerSet的yaml如下所示：

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0
          name: minecraft
  serviceQualities:
    - name: healthy
      containerName: minecraft
      permanent: false
      exec:
        command: ["bash", "./probe.sh"]
      serviceQualityAction:
        - state: true
          result: gate
          opsState: GateMaintaining
        - state: true
          result: data
          opsState: DataMaintaining
        - state: false
          opsState: None
```
部署完成后，生成3个Pod与GameServer

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     14s
minecraft-1   Ready   None       0     0     14s
minecraft-2   Ready   None       0     0     14s

kubectl get po
NAME          READY   STATUS    RESTARTS   AGE
minecraft-0   1/1     Running   0          15s
minecraft-1   1/1     Running   0          15s
minecraft-2   1/1     Running   0          15s
```

进入minecraft-0容器中，模拟gate进程故障，将其对应的进程号kil

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 7

/data# exit
```

获取当前gs的opsState，已经变为GateMaintaining

```bash

kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     2m14s
minecraft-1   Ready   None              0     0     2m14s
minecraft-2   Ready   None              0     0     2m14s
```

进入minecraft-1容器中，模拟data进程故障，将其对应的进程号kil

```bash
kubectl exec -it minecraft-1 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 8

/data# exit
```

获取当前gs的opsState，已经变为DataMaintaining

```bash
kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     3m10s
minecraft-1   Ready   DataMaintaining   0     0     3m10s
minecraft-2   Ready   None              0     0     3m10s
```

分别进入minecraft-0，minecraft-1，手动拉起挂掉的进程：

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# bash ./gate.sh &

/data# exit

kubectl exec -it minecraft-1 /bin/bash

/data# bash ./data.sh &

/data# exit
```

此时，gs的运维状态已经都恢复为None

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     5m6s
minecraft-1   Ready   None       0     0     5m6s
minecraft-2   Ready   None       0     0     5m6s
```

## 游戏服定向管理

### 设置GameServer回收策略

GameServer存在两种生命周期回收策略 —— Cascade 与 Delete，在GameServerSet.Spec.GameServerTemplate.ReclaimPolicy设置。

- Cascade：GameServer在pod删除时被回收，与pod生命周期保持一致。Cascade为ReclaimPolicy的默认值。
- Delete：GameServer在GameServerSet副本数缩小时被回收。当对应的pod被手动删除、更新重建、被驱逐时，GameServer都不会被删除。

`Cascade`策略适合短生命周期游戏服，存在频繁启动删除而状态需要及时清空的情景，如大部分的PvP会话类游戏。
而`Delete`策略更适合传统区服类PvE游戏，游戏服的状态需要长期被记录在GameServer上，避免状态丢失。只有用户执行合服/删服操作时才会将其回收。
在创建GameServerSet时显式声明GameServer回收策略为Delete，能够更好地实现区服类游戏的定向管理功能。

### 定向更新游戏服镜像与资源规格

存在对特定游戏服存在定向更新镜像的场景，例如：

- 在灰度或测试环境中，不同区对应着不同的镜像版本；
- SLG类型游戏存在玩法副本的概念，不同区的玩法可能不尽相同，对应着不同的镜像。

针对这种一个GameServerSet下可能存在多个版本的镜像游戏服，可以通过设置GameServer.Spec.Containers中image字段来指定更新特定游戏服镜像版本。

存在对特定游戏服存在定向更新镜像的场景，例如：

- 随着时间增长，出现玩家增加过多、或者流失的情况，某些区服的计算资源无法满足当前需求。

针对这种一个GameServerSet下可能存在多种资源规格游戏服，可以通过设置GameServer.Spec.Containers中resources字段来指定游戏服特定资源规格。

定向更新游戏服镜像与资源规格的示意图如下：

<img src={require('/static/img/kruisegame/best-practices/gs-update-images-resources.png').default} style={{  width: '500px'}} />

#### 示例说明

接下来通过一个示例来展示如何进行定向更新游戏服的镜像与资源规格。

首先部署一个3副本的GameServerSet

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
spec:
  replicas: 3
  gameServerTemplate:
    reclaimPolicy: Delete
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
```
定向更新minecraft-0的镜像，将其改为 registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new

```yaml
kubectl edit gs minecraft-0

...
spec:
  deletionPriority: 0
  opsState: None
  updatePriority: 0
  # 新增containers
  containers:
  - name: minecraft
    image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new
...
```

保存退出后，过一段时间过后，pod完成更新（由于指定原地升级策略，故容器重启次数+1）：

```bash
kubectl get po
NAME                  READY   STATUS    RESTARTS      AGE
minecraft-0           1/1     Running   1 (13s ago)   3m28s
```

此时，假如pod故障/或被手动删除，生成的pod镜像会以GameServer声明的spec为准，例如：

```bash
# delete pod
kubectl delete po minecraft-0

# pod state is Terminating, gs state is Deleting
kubectl get gs minecraft-0
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Deleting   None       0     0     8m19s

kubectl get po minecraft-0
NAME          READY   STATUS        RESTARTS        AGE
minecraft-0   1/1     Terminating   1 (5m12s ago)   8m19s

# after a while
# pod running again，age of GameServer is different from age of pod
kubectl get po minecraft-0
NAME          READY   STATUS    RESTARTS   AGE
minecraft-0   1/1     Running   0          28s

kubectl get gs minecraft-0
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     9m18s
```

由于设置了gs回收策略为Delete，所以游戏服的设置的状态不会因为pod的消失而消失。
当前游戏服的镜像依然是更新后的registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new

接下来定向更新游戏服minecraft-1的资源规格，将requests调整为cpu: 500m：

```yaml
kubectl edit gs minecraft-1

...
spec:
  deletionPriority: 0
  opsState: None
  updatePriority: 0
  # 新增containers
  containers:
  - name: minecraft
    resources:
      requests:
        cpu: 500m
...
```

资源配置不会立即原地更新。等待停服维护时，运维工程师手动使pod重建，新的资源规格即可生效，例如：

```bash
kubectl delete po minecraft-1

# after a while

# gs won't be deleted
kubectl get gs minecraft-1
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-1   Ready   None       0     0     15m

# pod recreated
kubectl get po minecraft-1
NAME          READY   STATUS    RESTARTS   AGE
minecraft-1   1/1     Running   0          11s
```

此时，pod的资源规格requests调整为cpu: 500m

### 游戏服合服

当某一区服游戏玩家流失到一定程度，需要进行合服操作，此时可以定向将游戏服进行删除。

- 通过ReserveGameServerIds与replicas设置可以实现批量合服动作，例如，存在5个游戏服，id分别为0、1、2、3、4，希望删除游戏服2、3，则设置ReserveGameServerIds为2和3，同时replicas调整为3即可。详情可参考文档：[游戏服伸缩文档/游戏服 id reserve](https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#%E6%B8%B8%E6%88%8F%E6%9C%8D-id-reserve)

- 而通过设置gs的opsState为Kill也可以实现快速对一个游戏服进行删除操作。详情可参考文档：[游戏服伸缩文档/游戏服Kill](https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#%E6%B8%B8%E6%88%8F%E6%9C%8D-kill)


## OKG管理PvE游戏服常见问题

### Q：如何决定GameServerSet的纳管范围？

首先需要明确的是GameServerSet(简称gss)是集群维度的资源，不可跨集群声明。其次，PvE类型游戏通常会涉及到zone、group等概念，维度较多。这样一来，同个zone使用一个gss？还是同个group使用一个gss呢？实际上，判断条件主要取决于这些游戏服初始的差异性如何。

差异性的考量一般可以从两个方面来看：

1. 配置差异性。如上文配置管理所述，可以通过游戏服GameServer集群命名空间内唯一名称的特性屏蔽掉内容的差异。故可以使用同一个GameServerSet管理。
2. 资源规格差异性与镜像版本差异性。这类差异性存在两种情况：1）初始时一致，随着时间拉长开始出现差异性。2）初始就不一致。对于情况1，使用使用同一个GameServerSet管理游戏服，再利用上文提到的OKG定向更新功能即可。对于情况2，实际上也可以使用同一个GameServerSet管理游戏服，只不过在开新服时，做的操作就更加复杂一些，不仅需要调整副本数目，还需要调整对应的GameServer的Spec，使其拥有独立的镜像或资源配置。这种方式比较适合测试环境或区服数目较少的生产环境。在区服数目规模较大时，建议进行规格限定，使同种镜像同种资源规格的游戏服用同一个GameServerSet管理。

### Q：如何进行开新服？

新开服的步骤如下：

1. 确保集群中部署了相应的GameServerSet（初始副本数目或为0）
2. 若存在差异配置，则提前将配置文件准备好并上传至oss或用户自定义配置中心（若不存在差异性配置，则使用创建GameServerSet时配置configmap即可）
3. 找到对应的gss，调整副本数目使增加相应开服的数量
4. 若开新服的镜像版本/资源规格与GameServerSet中声明的不一致，则可以更改对应的GameServerSpec的containers字段的镜像或资源。需要注意的是，如果要调整资源规格，需要手动删除pod，使其完成一次重建。
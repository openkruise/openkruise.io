# 部署游戏服

## "Hello World" of OKG
您可以使用GameServerSet进行游戏服的部署，一个简单的部署案例如下：

```bash
cat <<EOF | kubectl apply -f -
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
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
EOF
```

当前GameServerSet创建完成后，由于指定的副本数为3，故在集群中将会出现3个GameServer，以及对应的3个Pod：

```bash
kubectl get gss
NAME        AGE
minecraft   9s

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP   AGE
minecraft-0   Ready   None       0     0    10s
minecraft-1   Ready   None       0     0    10s
minecraft-2   Ready   None       0     0    10s

kubectl get pod
NAME            READY   STATUS    RESTARTS   AGE
minecraft-0     1/1     Running   0          10s
minecraft-1     1/1     Running   0          10s
minecraft-2     1/1     Running   0          10s
```

## ID业务感知

游戏服由于有状态的特性，通常需要唯一标识来区别彼此，这也是GameServerSet管理的GameServer的名称会以ID序号结尾的原因。

在有些情况下，游戏服业务自身需要感知到自己的ID，以作为区服属性标志或配置管理的依据等。
这个时候，通过 DownwardAPI 可以实现将对应标识ID下沉至容器中。下面是一个示例：

部署一个GameServerSet，其生成的游戏服容器中的环境变量GS_NAME会以对应名称为值：

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
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
          env:
          - name: GS_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
```

同样会生成3个游戏服：

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     31s
minecraft-1   Ready   None       0     0     31s
minecraft-2   Ready   None       0     0     31s
```

分别查看这三个游戏服的GS_NAME环境变量，发现三个游戏服的GS_NAME与自身的名称一一对应。

```bash
kubectl exec  minecraft-0 -- env | grep GS_NAME
GS_NAME=minecraft-0

kubectl exec  minecraft-1 -- env | grep GS_NAME
GS_NAME=minecraft-1

kubectl exec  minecraft-2 -- env | grep GS_NAME
GS_NAME=minecraft-2
```

这样一来，业务程序在启动时可以通过解析GS_NAME环境变量来进行配置管理等操作了。

## 游戏服有状态实例的服务发现

游戏服由于有状态的特性，访问时往往需要具体到pod实例，无法使用传统k8s service负载均衡的特性。OKG支持有状态服务的DNS机制，以实现**集群内**游戏服之间的相互访问。

接下来示例中将涉及两个服务，minecraft游戏服，与accessor，minecraft被accessor调用。

### 服务注册

通常，游戏服需要被内部访问时需要将自身信息注册到对应服务中，以便accessor能够知道哪些pod是可访问状态；相对应地，游戏服退出时也需要相应的析构动作，反注册以便accessor知道该pod已经不提供服务了。

如上文所提到的，游戏服的唯一标志即其ID（或名称），利用上文提到的DownwardAPI，将GS_NAME下沉至容器中之后，在容器启动时将其注册至对应的服务即可。

按照前文Yaml部署完成后，集群存在3个minecraft pod：

```bash
kubectl get po -owide
...
minecraft-0     1/1     Running   0     10s     172.16.0.64     xxx       <none>           2/2
minecraft-1     1/1     Running   0     10s     172.16.0.6      xxx       <none>           2/2
minecraft-2     1/1     Running   0     10s     172.16.0.12     xxx       <none>           2/2
```

### DNS

为了使游戏服的pod能够单独被访问，除了部署GameServerSet之外，还需部署与GameServerSet同名称的headless service，在本例中其Yaml如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minecraft
spec:
  clusterIP: None # 设置为 None 使得服务成为 Headless
  selector:
    game.kruise.io/owner-gss: minecraft # 填写GameServerSet的名称
```

部署一个简单的accessor Yaml，目的是在该容器内访问对应的minecraft pod

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: accessor
  namespace: default
spec:
  replicas: 1
  gameServerTemplate:
    spec:
      containers:
        - image: busybox
          name: accessor
          args:
            - sleep
            - "3600"
          command: ["/bin/sh", "-c", "sleep 3600"]
```

进入accessor容器中ping对应的minecraft pod（这一步模拟真实环境中的访问逻辑，当然选择访问哪一个pod需要一定的筛选规则）：

```bash
kubectl exec -it accessor-0 /bin/sh
/ # 
/ # ping minecraft-2.minecraft.default.svc.cluster.local
PING minecraft-2.minecraft.default.svc.cluster.local (172.16.0.12): 56 data bytes
64 bytes from 172.16.0.12: seq=0 ttl=63 time=0.082 ms
64 bytes from 172.16.0.12: seq=1 ttl=63 time=0.061 ms
64 bytes from 172.16.0.12: seq=2 ttl=63 time=0.072 ms
```

可以发现，accessor访问minecraft-2成功，DNS成功解析到对应的内网IP地址。在这里的DNS访问规则如下：{pod-name}.{gss-name}.{namespace-name}.svc.cluster.local

## GameServer 与 Pod 注释同步

如上所述，通过 DownwardAPI 可以将 pod annotation的信息下沉至容器中。我们有时希望将 GameServer 的 annotation 可以同步到 Pod 上，以完成GameServer元数据信息的下沉动作。

OKG 支持以 "gs-sync/" 开头的 annotation 从 GameServer 同步到 Pod 之上，如下所示：

```bash
kubectl patch gs minecraft-0 --type='merge'  -p  '{"metadata":{"annotations":{"gs-sync/test-key":"some-value"}}}'
gameserver.game.kruise.io/minecraft-0 patched
```

此时查看 pod 注释，发现可以找到对应key-value：

```bash
kubectl get po minecraft-0 -oyaml | grep gs-sync
    gs-sync/test-key: some-value
```
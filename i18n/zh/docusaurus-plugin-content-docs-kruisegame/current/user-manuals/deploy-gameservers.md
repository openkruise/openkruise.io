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
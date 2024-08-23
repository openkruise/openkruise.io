# Golang Client

如果要在一个 Golang 项目中对 OKG 的资源做 create/get/update/delete 这些操作、或者通过 informer 做 list-watch，你需要一个支持 OKG 的 client。


你需要在你的项目中引入 [kruise-game](https://github.com/openkruise/kruise-game) 仓库

## 使用方式

首先，在你的 `go.mod` 中引入 `kruise-game` 依赖 （版本号最好和你安装的 kruise-game 版本相同）：

```
require github.com/openkruise/kruise-game v0.7.0
```

使用kruise-game要求Kubernetes版本>= 1.16。

### 使用 OKG api

这里我们使用GameServerSet作为示例，GameServer的使用方法与GameServerSet相同

1. 使用您的rest config新建 kruise-game 客户端:

```go
kruisegameclientset "github.com/openkruise/kruise-game/pkg/client/clientset/versioned"

// cfg 是在client-go中定义的rest config，你可以使用 kubeconfig 或 serviceaccount 获取
kruisegameClient := kruisegameclientset.NewForConfigOrDie(cfg)
```

2. 查询/列出 kruise-game 资源:

```go
gamekruiseiov1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"

gameServerSet, err := kruisegameClient.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})

// gss 是 GameServerSet 对象
gssName := gss.GetName()

// labelSelector用于过滤 GameServer，示例中我们使用GameServerSet名称筛选出归属GameServerSet管理的GameServer，你也可以使用自定义的labelSelector。
labelSelector := labels.SelectorFromSet(map[string]string{
gamekruiseiov1alpha1.GameServerOwnerGssKey: gssName,
}).String()

gameServerList, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).List(context.TODO(), metav1.ListOptions{LabelSelector: labelSelector})
```

3. 创建/更新 kruise-game resources:

```go
import gameKruiseV1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"

cloneSet := &gameKruiseV1alpha1.GameServerSet{
    // ...
}
gameServerSet, err = kruisegameclientset.GameV1alpha1().GameServerSet(namespace).Create(context.TODO(), cloneSet, metav1.CreateOptions{})
```

```go

gameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})
if err != nil {
    return err
}

// 修改对象, 例如副本数
gameServerSet.Spec.Replicas = pointer.Int32Ptr(3)

newGameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Update(context.TODO(), gameServerSet, metav1.UpdateOptions{})
if err != nil{
return err
}
```

4. 删除现有的GameServerSet:

```go
// 删除 gss
err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Delete(context.TODO(), "GameServerSetName", metav1.DeleteOptions{})
if err != nil {
return err
}
```

5. 监测Kruise-Game资源:

```go
import gameinformer "github.com/openkruise/kruise-api/client/informers/externalversions"

gameInformerFactory := gameinformer.NewSharedInformerFactory(kruisegameclientset, 0)
gameInformerFactory.Game().V1alpha1().GameServerSets().Informer().AddEventHandler(...)
gameInformerFactory.Start(...)
```

### RABC

当您的组件部署在k8s集群内部时，您需要赋予组件操作 OKG 资源的权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  creationTimestamp: null
  name: okg-role
rules:
- apiGroups:
  - game.kruise.io
  resources:
  - gameserversets
  verbs:
  - create
  - delete
  - get
  - list
  - patch
  - update
  - watch
- apiGroups:
  - game.kruise.io
  resources:
  - gameservers
  verbs:
  - create
  - delete
  - get
  - list
  - patch
  - update
  - watch
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: okg-sa       # 为你的pod设置serviceAccount名字
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: okg-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: okg-role
subjects:
- kind: ServiceAccount
  name: okg-sa
  namespace: kube-system

```

## 代码示例
以下项目都使用了OKG API，开发者可作为示例阅读源码参考：
- https://github.com/CloudNativeGame/aigc-gateway
- https://github.com/CloudNativeGame/kruise-game-open-match-director
- https://github.com/CloudNativeGame/palworld-okg-playground
---
title: PersistentPodState
---

**FEATURE STATE:** Kruise v1.2.0

随着云原生的发展，越来越多的公司开始将有状态服务（如：Etcd、MQ）进行Kubernetes部署。K8S StatefulSet是管理有状态服务的工作负载，它在很多方面考虑了有状态服务的部署特征。
然而，StatefulSet只能保持有限的Pod状态，如：Pod Name有序且不变，PVC持久化，并不能满足其它Pod状态的保持需求，例如：固定IP调度，优先调度到之前部署的Node等。典型案例有：

- **服务发现中间件服务对部署之后的Pod IP异常敏感，要求IP不能随意改变**

- **数据库服务将数据持久化到宿主机磁盘，所属Node改变将导致数据丢失**

针对上述描述，Kruise通过自定义PersistentPodState CRD，能够保持Pod其它相关状态，例如："固定IP调度"。
详细设计请参考：[PPS Proposal](https://github.com/openkruise/kruise/blob/master/docs/proposals/20220421-persistent-pod-state.md)。

## Usage
### Annotations自动生成PersistentPodState
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: StatefulSet
metadata:
  annotations:
    # 自动生成PersistentPodState对象
    kruise.io/auto-generate-persistent-pod-state: "true"
    # preferred node affinity，如下：Pod重建后将尽量部署到同Node
    kruise.io/preferred-persistent-topology: kubernetes.io/hostname[,other node labels]
    # required node affinity，如下：Pod重建后将强制部署到同Zone
    kruise.io/required-persistent-topology: failure-domain.beta.kubernetes.io/zone[,other node labels]
```
通过 annotation 的方式能生成一些常见的PersistentPodState，来满足绝大多数的场景。而对于一些复杂场景而言，可以直接使用 PersistentPodState CRD 的方式定义。

### 定义PersistentPodState CRD
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: PersistentPodState
metadata:
  name: echoserver
  namespace: echoserver
spec:
  targetRef:
    # 原生k8s 或 kruise StatefulSet
    # 只支持 StatefulSet 类型
    apiVersion: apps.kruise.io/v1beta1
    kind: StatefulSet
    name: echoserver
  # required node affinity，如下：Pod重建后将强制部署到同Zone
  requiredPersistentTopology:
    nodeTopologyKeys:
      failure-domain.beta.kubernetes.io/zone[,other node labels]
  # preferred node affinity，如下：Pod重建后将尽量部署到同Node
  preferredPersistentTopology:
    - preference:
        nodeTopologyKeys:
          kubernetes.io/hostname[,other node labels]
      # int, [1 - 100]
      weight: 100
```

## 固定IP调度实践
"固定IP调度"应该是比较常见的有状态服务的K8S部署要求，它的含义不是"指定Pod IP部署"，而是要求Pod在第一次部署之后，业务发布或机器驱逐等常规性运维操作都不会导致Pod IP发生变化。
达到上述效果，首先就需要K8S网络组件能够支持Pod IP保留以及尽量保持IP不变的能力，本文将flannel网络组件中的Host-local插件做了一些代码改造，
使之能够达到同Node下保持Pod IP不变的效果，相关原理就不在此陈述，代码请参考：[host-local](https://github.com/openkruise/samples)。

"固定IP调度"好像有网络组件支持就好了，这跟PersistentPodState有什么关系呢？因为，网络组件实现"Pod IP保持不变"都有一定的限制，
例如：flannel只能支持同Node保持Pod IP不变。但是，K8S调度的最大特性就是"不确定性"，所以"如何保证Pod重建后调度到同Node上"就是PersistentPodState解决的问题。

**1. 部署有状态服务echoserver，通过annotations声明"固定IP调度"：**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: StatefulSet
metadata:
  name: echoserver
  labels:
    app: echoserver
  annotations:
    kruise.io/auto-generate-persistent-pod-state: "true"
    kruise.io/preferred-persistent-topology: kubernetes.io/hostname
spec:
  serviceName: echoserver
  replicas: 2
  selector:
    matchLabels:
      app: echoserver
  template:
    metadata:
      labels:
        app: echoserver
      annotations:
        # 通知host-local插件，Pod重建保持IP不变，"10" 代表Pod删除到下次调度成功，中间最多保留10分钟
        # 主要考虑到 删除、缩容等场景
        io.kubernetes.cri/reserved-ip-duration: "10"
    spec:
      terminationGracePeriodSeconds: 5
      containers:
      - name: echoserver
        image: cilium/echoserver:latest
        imagePullPolicy: IfNotPresent
```

**2. 根据上述配置，kruise自动生成PersistentPodState资源，且status中记录Pod第一次部署的节点状态：**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: PersistentPodState
metadata:
  name: configserver
  namespace: configserver
spec:
  targetRef:
    apiVersion: apps.kruise.io/v1beta1
    kind: StatefulSet
    name: configserver
  preferredPersistentTopology:
  - preference:
      nodeTopologyKeys:
        kubernetes.io/hostname
    weight: 100
status:
  podStates:
    # status记录pod-0部署在worker2节点，pod-1部署在worker1节点
    configserver-0:
      nodeName: worker2
      nodeTopologyLabels:
      kubernetes.io/hostname: worker2
    configserver-1:
      nodeName: worker1
      nodeTopologyLabels:
        kubernetes.io/hostname: worker1
```

**3. 业务发布或Node驱逐等导致Pod重建后，kruise将记录的Pod节点信息注入到Pod NodeAffinity中，进而实现Pod IP保持不变，如下：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configserver-0
  namespace: configserver
  annotations:
    io.kubernetes.cri/reserved-ip-duration: 10
spec:
  # kruise注入
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - preference:
          matchExpressions:
          - key: kubernetes.io/hostname
            operator: In
            values:
            - worker2
        weight: 100
  containers:
  ...
```

![staticIP](/img/docs/user-manuals/static-ip.png)

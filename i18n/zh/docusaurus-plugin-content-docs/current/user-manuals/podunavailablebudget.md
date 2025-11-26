---
title: PodUnavailableBudget
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**FEATURE STATE:** Kruise v0.10.0

**注意: v1beta1 从 Kruise v1.9.0 版本开始可用。**

在诸多[Voluntary Disruption](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) 场景中 Kubernetes [Pod Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/)
通过限制同时中断的Pod数量，来保证应用的高可用性。然而，PDB只能防控通过 [Eviction API](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#eviction-api) 来触发的Pod Disruption，例如：kubectl drain驱逐node上面的所有Pod。

但在如下voluntary disruption场景中，即便有kubernetes PDB防护依然将会导致业务中断、服务降级：

1. 应用owner通过deployment正在进行版本升级，与此同时集群管理员由于机器资源利用率过低正在进行node缩容。
2. 中间件团队利用sidecarSet正在原地升级集群中的sidecar版本（例如：ServiceMesh envoy），同时HPA正在对同一批应用进行缩容。
3. 应用owner和中间件团队利用cloneSet、sidecarSet原地升级的能力，正在对同一批Pod进行升级。

在上面这些 kubernetes PDB 无法很好防护的场景中，Kruise PodUnavailableBudget 通过对Pod Mutating Webhook的拦截，能够覆盖更多的Voluntary Disruption场景，进而提供应用更加强大的防护能力。

## API定义

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: policy.kruise.io/v1beta1
kind: PodUnavailableBudget
metadata:
  name: web-server-pub
  namespace: web
spec:
  targetRef:
    apiVersion: apps.kruise.io/v1beta1
    # cloneset, deployment, statefulset etc.
    kind: CloneSet
    name: web-server
  # selector label query over pods managed by the budget
  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.
  # selector is commonly used in scenarios where applications are deployed using multiple workloads,
  # and targetRef is used for protection against a single workload.
# selector:
#   matchLabels:
#     app: web-server
  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3
  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect
  maxUnavailable: 60%
  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2
# minAvailable: 40%
-----------------------

apiVersion: apps.kruise.io/v1beta1
kind: CloneSet
metadata:
  labels:
    app: web-server
  name: web-server
  namespace: web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web-server
  template:
    metadata:
      labels:
        app: web-server
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: policy.kruise.io/v1alpha1
kind: PodUnavailableBudget
metadata:
  name: web-server-pub
  namespace: web
spec:
  targetRef:
    apiVersion: apps.kruise.io/v1alpha1
    # cloneset, deployment, statefulset etc.
    kind: CloneSet
    name: web-server
  # selector label query over pods managed by the budget
  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.
  # selector is commonly used in scenarios where applications are deployed using multiple workloads,
  # and targetRef is used for protection against a single workload.
# selector:
#   matchLabels:
#     app: web-server
  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3
  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect
  maxUnavailable: 60%
  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2
# minAvailable: 40%
-----------------------

apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: web-server
  name: web-server
  namespace: web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web-server
  template:
    metadata:
      labels:
        app: web-server
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```

  </TabItem>
</Tabs>

### 支持自定义 Workload

**FEATURE STATE:** Kruise v1.2.0

很多公司为满足复杂性更高的应用部署需求，往往会通过实现定制化Workload的方式来管理业务Pod。从kruise v1.2.0开始，pub能够防护实现了scale子资源的自定义Workload，如下防护Argo-Rollout：

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: policy.kruise.io/v1beta1
kind: PodUnavailableBudget
metadata:
  name: rollouts-demo
spec:
  targetRef:
    apiVersion: argoproj.io/v1alpha1
    kind: Rollout
    name: rollouts-demo
  minAvailable: 80%
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: policy.kruise.io/v1alpha1
kind: PodUnavailableBudget
metadata:
  name: rollouts-demo
spec:
  targetRef:
    apiVersion: argoproj.io/v1alpha1
    kind: Rollout
    name: rollouts-demo
  minAvailable: 80%
```

  </TabItem>
</Tabs>

### 支持未实现 Scale 子资源的自定义 Workload

**FEATURE STATE:** Kruise v1.8.0

在部分特殊场景下，存在一些未实现 Scale 子资源的 Workload 但也有防护的需求。此时用户可以直接指定目标防护的总副本数，不同版本的配置方式有所差异：

- **v1alpha1**：通过 annotation `pub.kruise.io/protect-total-replicas` 来声明目标防护副本数（值为字符串类型）
- **v1beta1**：通过 `spec.protectTotalReplicas` 字段来声明目标防护副本数（值为整数类型）

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: policy.kruise.io/v1beta1
kind: PodUnavailableBudget
metadata:
  name: crd-demo
spec:
  # 通过 spec 字段直接声明目标防护副本数
  protectTotalReplicas: 5
  ...
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: policy.kruise.io/v1alpha1
kind: PodUnavailableBudget
metadata:
  name: crd-demo
  annotations:
    # 通过 annotation 声明目标防护副本数（字符串类型）
    pub.kruise.io/protect-total-replicas: "5"
spec:
  ...
```

  </TabItem>
</Tabs>

## Implementation
PUB实现原理如下，详细设计请参考：[Pub Proposal](https://github.com/openkruise/kruise/blob/master/docs/proposals/20210614-podunavailablebudget.md)

![PodUnavailableBudget](/img/docs/user-manuals/podunavailablebudget.png)

## Comparison with Kubernetes native PDB
Kubernetes PDB是通过Eviction API接口来实现Pod安全防护，而Kruise PDB则是拦截了Pod Validating Request来实现诸多Voluntary Disruption场景的防护能力。
**Kruise PUB包含了PDB的所有能力（防护Pod Eviction），业务可以根据需要两者同时使用，也可以单独使用Kruise PUB（推荐方式）。**

## feature-gates
PodUnavailableBudget Pod安全防护默认是关闭的，如果要开启请通过设置 feature-gates *PodUnavailableBudgetDeleteGate* 和 *PodUnavailableBudgetUpdateGate*.

```bash
$ helm install kruise https://... --set featureGates="PodUnavailableBudgetDeleteGate=true\,PodUnavailableBudgetUpdateGate=true"
```

## PodUnavailableBudget Status
```yaml
# kubectl describe podunavailablebudgets web-server-pub
Name:         web-server-pub
Kind:         PodUnavailableBudget
Status:
  unavailableAllowed:   3   # unavailableAllowed number of pod unavailable that are currently allowed
  currentAvailable:     5   # currentAvailable current number of available pods
  desiredAvailable:     2   # desiredAvailable minimum desired number of available pods
  totalReplicas:        5   # totalReplicas total number of pods counted by this PUB
```

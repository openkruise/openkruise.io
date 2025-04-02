---
title: WorkloadSpread
---

**FEATURE STATE:** Kruise v0.10.0

WorkloadSpread能够将workload的Pod按一定规则分布到不同类型的Node节点上，赋予单一workload多区域部署和弹性部署的能力。

常见的一些规则包括：
- 水平打散（比如按host、az等维度的平均打散）。
- 按指定比例打散（比如按比例部署Pod到几个指定的 az 中）。
- 带优先级的分区管理，比如：
  - 优先部署到ecs，资源不足时部署到eci。
  - 优先部署固定数量个pod到ecs，其余到eci。
- 定制化分区管理，比如：
  - 控制workload部署不同数量的Pod到不同的cpu架构上。
  - 确保不同的cpu架构上的Pod配有不同的资源配额。

WorkloadSpread与OpenKruise社区的UnitedDeployment功能相似，每一个WorkloadSpread定义多个区域（定义为`subset`），
每个`subset`对应一个`maxReplicas`数量。WorkloadSpread利用Webhook注入`subset`定义的域信息，同时控制Pod的扩缩容顺序。
与UnitedDeployment**不同**的是，UnitedDeployment是帮助用户创建并管理多个workload，WorkloadSpread仅作用在单个workload之上，用户提供workload即可。

当前支持的workload类型：`Job`,`CloneSet`、`Deployment`、`ReplicaSet`、`StatefulSet`。

注：`StatefulSet` 从 Kruise 1.3.0 版本开始支持。

特别地，WorkloadSpread 对 `StatefulSet` 只支持扩容管理，缩容仍旧保留 StatefulSet 固有的缩容顺序, 且扩容管理时按照Pod序号进行划分 Subset, 详情可以参照[注释](https://github.com/openkruise/kruise/blob/f46097db1fa5a4ed9c002eba050b888344884e11/pkg/util/workloadspread/workloadspread.go#L305)。

从 Kruise `1.5.0` 版本开始，WorkloadSpread 支持包含 [scale sub-resource](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource) 的自定义工作负载。

## Demo

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: workloadspread-demo
spec:
  targetRef:
    apiVersion: apps/v1 | apps.kruise.io/v1alpha1
    kind: Deployment | CloneSet
    name: workload-xxx
  subsets:
    - name: subset-a
      requiredNodeSelectorTerm:
        matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
              - zone-a
      preferredNodeSelectorTerms:
        - weight: 1
          preference:
            matchExpressions:
              - key: another-node-label-key
                operator: In
                values:
                  - another-node-label-value
      maxReplicas: 3
      tolerations: [ ]
      patch:
        metadata:
          labels:
            xxx-specific-label: xxx
    - name: subset-b
      requiredNodeSelectorTerm:
        matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
              - zone-b
  scheduleStrategy:
    type: Adaptive | Fixed
    adaptive:
      rescheduleCriticalSeconds: 30
```

`targetRef`: 指定WorkloadSpread管理的workload。不可以变更，且一个workload只能对应一个WorkloadSpread。

## subsets

`subsets`定义了多个区域(`subset`),每个区域配置不同的subset信息

### sub-fields

- `name`: subset的名称，在同一个WorkloadSpread下name唯一，代表一个topology区域。

- `maxReplicas`：该subset所期望调度的最大副本数，需为 >= 0的整数。若设置为空，代表不限制subset的副本数。
> 当前版本暂不支持百分比类型。

- `minReplicas`：该subset所期望调度的最小副本数，需为 >= 0的整数。若设置为空，代表不限制subset的副本数。比如，按照地域打散时，可以使用minReplicas保证每个地域至少有一个副本，其余副本按照自适应调度策略弹性部署。
> 当前版本暂不支持百分比类型。

- `requiredNodeSelectorTerm`: 强制匹配到某个zone。

- `preferredNodeSelectorTerms`: 尽量匹配到某个zone。

**注意**：requiredNodeSelectorTerm对应k8s nodeAffinity的requiredDuringSchedulingIgnoredDuringExecution。
preferredNodeSelectorTerms对应nodeAffinity preferredDuringSchedulingIgnoredDuringExecution。

- `tolerations`: `subset`Pod的Node容忍度。
```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

- `patch`: 定制`subset`中的Pod配置，可以是Annotations、Labels、Env等。

例子：

```yaml
# patch pod with a topology label:
patch:
  metadata:
    labels:
      topology.application.deploy/zone: "zone-a"
```

```yaml
# patch pod container resources:
patch:
  spec:
    containers:
    - name: main
      resources:
        limit:
          cpu: "2"
          memory: 800Mi
```

```yaml
# patch pod container env with a zone name:
patch:
  spec:
    containers:
    - name: main
      env:
      - name: K8S_AZ_NAME
        value: zone-a
```

## 调度策略

WorkloadSpread提供了两种调度策略，默认为`Fixed`:

```yaml
  scheduleStrategy:
    type: Adaptive | Fixed
    adaptive:
      rescheduleCriticalSeconds: 30
```

- Fixed:

  workload严格按照`subsets`定义分布。

- Adaptive:

  **Reschedule**：Kruise检查`subset`中调度失败的Pod，若超过用户定义的时间就将其调度到其他有可用的`subset`上。

## 配置要求

WorkloadSpread 功能默认是关闭的，你需要在 安装/升级 Kruise 的时候打开 feature-gate：*WorkloadSpread*

```bash
$ helm install kruise https://... --set featureGates="WorkloadSpread=true"
```

### Pod Webhook
WorkloadSpread 利用 `webhook` 向Pod注入域规则。

如果`PodWebhook` feature-gate 被设置为 `false`，WorkloadSpread 也将不可用。

### deletion-cost feature
`CloneSet` 已经支持该特性。

其他 native workload 需 kubernetes version >= 1.21。且 1.21 版本需要显式开启 `PodDeletionCost` feature-gate，自 1.22 起默认开启。

## 扩缩容顺序：

WorkloadSpread所管理的workload会按照`subsets`中定义的顺序扩缩容，**`subset`的顺序允许改变**，即通过改变`subset`的顺序来调整扩缩容的顺序。

规则如下：

### 扩容
- 按照`spec.subsets`中`subset`定义的顺序调度Pod，当前`subset`的active Pod数量达到`maxReplicas`时再调度到下一个`subset`。

### 缩容
- 当`subset`的副本数(active)大于定义的maxReplicas时，优先缩容多余的Pod。
- 依据`spec.subsets`中`subset`定义的顺序，后面`subset`的Pod先于前面的被删除。

例如：

```yaml
#             subset-a   subset-b  subset-c
# maxReplicas    10          10        nil
# pods number    10          10        10
# deletion order: c -> b -> a

#             subset-a   subset-b  subset-c
# maxReplicas    10          10        nil
# pods number    20          20        20
# deletion order: b -> a -> c
```

## 在自定义工作负载上使用 WorkloadSpread

WorkloadSpread 默认不会监听自定义工作负载。如果想要在自定义工作负载上使用 WorkloadSpread，需要进行额外的配置。本节以 [Argo
社区的 Rollout Workload](https://argoproj.github.io/argo-rollouts/) 为例，介绍如何将其与 WorkloadSpread 配合使用。

**注意**：WorkloadSpread Webhook 不会为自定义工作负载所创建的 Pod 设置 deletion cost，因而无法保证自定义工作负载的缩容顺序。

### 配置自定义工作负载监听白名单

首先，需要将自定义工作负载加入`WorkloadSpread_Watch_Custom_Workload_WhiteList` 白名单，以使其能够被 WorkloadSpread 读取并理解。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kruise-configuration
  namespace: kruise-system
data:
  "WorkloadSpread_Watch_Custom_Workload_WhiteList": |
    {
      "workloads": [
        {
          "Group": "argoproj.io",
          "Kind": "Rollout",
          "replicasPath": "spec.replicas",
        }
      ]
    }
```

具体的配置项说明如下：

- **Group:** 自定义工作负载的 ApiGroup。
- **Kind:** 自定义工作负载的 Kind。
- **subResources:** 自定义工作负载的子资源，字段包括 Group 与 Kind。例如：Deployment 的 ReplicaSet。该字段为可选字段，如果自定义资源不包含子资源，那么可以留空。
- **replicasPath:** 自定义工作负载中用于指定副本数的资源字段路径，例如：spec.replicas。

### 向 kruise-manager 授予权限

要在自定义工作负载上使用 WorkloadSpread，需要给 kruise-manager 服务账号授予相应资源的读取权限。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kruise-rollouts-access
rules:
  - apiGroups: [ "argoproj.io" ]
    resources: [ "rollouts" ]
    verbs: [ "get" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kruise-rollouts-access-binding
subjects:
  - kind: ServiceAccount
    name: kruise-manager
    namespace: kruise-system
roleRef:
  kind: ClusterRole
  name: kruise-rollouts-access
  apiGroup: rbac.authorization.k8s.io
```

### 指定自定义工作负载

当配置完成后，即可在 WorkloadSpread 的 `targetRef` 字段中指定自定义工作负载。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: workloadspread-demo
spec:
  targetRef:
    apiVersion: argoproj.io/v1alpha1
    kind: Rollout
    name: rollouts-demo
  subsets:
    ...
```

### 支持 AI 负载

**FEATURE STATE:** Kruise v1.8.0

在AI场景中，某些工作负载（如 Kubeflow 的 TFJob）包含多个角色（如 PS、Worker），其副本数定义可能与标准 Scale 子资源不一致。
WorkloadSpread 通过新增的 `targetFilter` 字段，支持对这类负载进行细粒度的资源打散。

#### 典型场景示例
以 TFJob 为例，需要将 Worker 角色的 Pod 分布到不同区域：
```yaml
apiVersion: kubeflow.org/v1
kind: TFJob
metadata:
  name: tfjob-demo
spec:
  tfReplicaSpecs:
  PS:
    replicas: 1
    # ...
  Worker:
    replicas: 2
    # ...
```

#### 配置步骤
1. **配置自定义工作负载白名单**  
   参考[章节：在自定义工作负载上使用 WorkloadSpread](#在自定义工作负载上使用-workloadspread)，将 TFJob 加入白名单并配置 rbac 权限。


2. **定义WorkloadSpread配置**
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: ws-tfjob-demo
spec:
  targetRef:
    apiVersion: kubeflow.org/v1alpha1
    kind: TFJob
    name: tfjob-demo
  targetFilter: 
    selector:
      matchLabels:
        role: worker
    replicasPathList:
    - spec.tfReplicaSpecs.Worker.replicas
  #...
```

#### 关键参数说明
| 参数              | 作用                                                                 |
|-------------------|----------------------------------------------------------------------|
| `targetFilter`    | 用于筛选目标工作负载中的特定角色（如Worker），并指定其副本数路径。   |
| `replicasPathList`| 指定目标角色的副本数在CRD中的路径，例如`spec.tfReplicaSpecs.Worker.replicas`。|

#### 预期行为
- WorkloadSpread 将仅管理 TFJob 中 Worker 角色的 Pod 分布，PS 角色的 Pod 不受影响。
- 扩缩容时，Worker 的 Pod 将按照 `subsets` 定义的规则分布到不同区域。

## feature-gates
WorkloadSpread 默认是关闭的，如果要开启请通过设置 feature-gates *WorkloadSpread*.

```bash
$ helm install kruise https://... --set featureGates="WorkloadSpread=true"
```

## 例子

### 弹性部署

zone-a（ack）固定100个Pod，zone-b（eci）做弹性区域

1. 创建WorkloadSpread实例
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: ws-demo
  namespace: deploy
spec:
  targetRef: # 相同namespace下的workload
    apiVersion: apps.kruise.io/v1alpha1
    kind: CloneSet
    name: cs-demo
  subsets:
  - name: ack # zone ack，最多100个副本。
    requiredNodeSelectorTerm:
      matchExpressions:
      - key: topology.kubernetes.io/zone
        operator: In
        values:
        - ack
    maxReplicas: 100
    patch: # 注入label
      metadata:
        labels:
          topology.application.deploy/zone: ack
  - name: eci # 弹性区域eci，副本数量不限。
    requiredNodeSelectorTerm:
      matchExpressions:
      - key: topology.kubernetes.io/zone
        operator: In
        values:
        - eci
    patch:
      metadata:
        labels:
          topology.application.deploy/zone: eci
```
2. 创建workload，副本数可以自由调整。

#### 部署效果
- 当`replicas <= 100` 时，Pod被调度到ack上。
- 当`replicas > 100` 时，100个在ack，多余的Pod在弹性域eci。
- 缩容时优先从弹性域eci上缩容。

### 多域部署

分别部署100个副本的Pod到两个机房（zone-a, zone-b）

1. 创建WorkloadSpread实例
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: WorkloadSpread
metadata:
  name: ws-demo
  namespace: deploy
spec:
  targetRef: # 相同namespace下的workload
    apiVersion: apps.kruise.io/v1alpha1
    kind: CloneSet
    name: cs-demo
  subsets:
  - name: subset-a # 区域A，100个副本。
    requiredNodeSelectorTerm:
      matchExpressions:
      - key: topology.kubernetes.io/zone
        operator: In
        values:
        - zone-a
    maxReplicas: 100
    patch:
      metadata:
        labels:
          topology.application.deploy/zone: zone-a
  - name: subset-b # 区域B，100个副本。
    requiredNodeSelectorTerm:
      matchExpressions:
      - key: topology.kubernetes.io/zone
        operator: In
        values:
        - zone-b
    maxReplicas: 100
    patch:
      metadata:
        labels:
          topology.application.deploy/zone: zone-b
```

2. 创建一个200副本的新`CloneSet`，或者对现有的`CloneSet`执行滚动更新。

3. 若`subset`副本分布需要变动，先调整对应`subset`的`maxReplicas`，再调整workload副本数。

---
title: UnitedDeployment
---

这个控制器提供了一个新模式来通过多个 workload 管理多个区域下的 Pod。
这篇 [博客文章](/blog/uniteddeployment) 提供了对 UnitedDeployment 一个高层面的描述。

在一个 Kubernetes 集群中可能存在不同的 node 类型，比如多个可用区、或不同的节点技术（比如 Virtual kueblet）等，这些不同类型的 node 上有 label/taint 标识。
UnitedDeployment 控制器可以提供一个模板来定义应用，并通过管理多个 workload 来匹配下面不同的区域。
每个 UnitedDeployment 下每个区域的 workload 被称为 `subset`，有一个期望的 `replicas` Pod 数量。
目前 subset 支持使用 `StatefulSet`、`Advanced StatefulSet`、`CloneSet`、`Deployment`。

API 定义: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go

下面用一个简单例子来演示如何定义一个 UnitedDeployment 来管理下面三个区域的 StatefulSet，所有区域的 Pod 总数为 6。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 6
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    statefulSetTemplate:
      metadata:
        labels:
          app: sample
      spec:
        selector:
          matchLabels:
            app: sample
        template:
          metadata:
            labels:
              app: sample
          spec:
            containers:
            - image: nginx:alpine
              name: nginx
  topology:
    subsets:
    - name: subset-a
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-a
      replicas: 1
    - name: subset-b
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-b
      replicas: 50%
    - name: subset-c
      nodeSelectorTerm:
        matchExpressions:
        - key: node
          operator: In
          values:
          - zone-c
  updateStrategy:
    manualUpdate:
      partitions:
        subset-a: 0
        subset-b: 0
        subset-c: 0
    type: Manual
...
```

## Subset容量精细规划

**FEATURE STATE:** Kruise v1.5.1

您可以为每个subset规划副本数量的上下限，从而帮助你更加精细化地管理您的资源使用。

### MaxReplicas 限制 subset 最多副本
例如，一个应用在常规节点池上最多运行4个副本，如果副本数量超过4个，超出的Pod将自动调度到弹性节点。
类似场景下，您可以参考以下配置方式：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    cloneSetTemplate:
      ......
  topology:
    subsets:
    - name: normal-nodes
      maxReplicas: 4
      ......
    - name: elastic-nodes
      maxReplicas: null
      ......
```

UnitedDeployment 控制器遵循以下规则来对各个 Subset 做扩缩容，当然前提是您已设置了 `MaxReplicas`：
1. 在扩容时，UnitedDeployment 控制器会按照 Subset 列表的顺序进行扩容；
2. 在缩容时，UnitedDeployment 控制器会按照 Subset 列表相反顺序进行缩容。

**其他重要注意事项：**
1. 当前 Subset 的 `MaxReplicas` 和 `Replicas` 的配置目前是互斥的，您只能配置其中的一种。
2. `MaxReplicas`为空表示该 Subset 没有副本数量限制。
3. 为了避免所有 Subset 的 `MaxReplicas` 要求都得到满足后，导致无法扩容任何 Subset，您需要保证**至少有一个 Subset** 的 `MaxReplicas` 值为空。

### MinReplicas 保障 subset 最少副本
例如，按照地域打散时，可以使用 minReplicas 保证每个地域至少有一个副本，其余副本按照自适应调度策略弹性部署。

## 支持 Customize 不同 subset 的 Pod Template
**FEATURE STATE:** Kruise v1.5.0

从 kruise v1.5.0版本开始，你可以 customize 任意 pod.spec 字段，比如：env、resources。

**Note:** 建议不要在 subset 中 customize image 字段，它可能会导致发布的异常。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: sample-ud
spec:
  replicas: 6
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: sample
  template:
    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate
    statefulSetTemplate:
      ...
  topology:
    subsets:
    - name: subset-a
      ...
      # patch container resources, env:
      patch:
        spec:
          containers:
          - name: main
            resources:
              limits:
                cpu: "2"
                memory: 800Mi
            env:
            - name: subset
              value: subset-a
    - name: subset-b
      ...
      # patch container resources, env:
      patch:
        spec:
          containers:
          - name: main
            resources:
              limits:
                cpu: "2"
                memory: 800Mi
            env:
            - name: subset
              value: subset-b
```

## HPA UnitedDeployment
**FEATURE STATE:** Kruise v1.5.0

Horizontal Pod Autoscaler 能够支持包含 [scale subresource](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource) 的自定义工作负载.
从 kruise v1.5.0版本开始，你可以直接 HPA UnitedDeployment，如下：

```yaml
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: example-hpa
  namespace: default
spec:
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - resource:
      name: cpu
      targetAverageUtilization: 2
    type: Resource
  scaleTargetRef:
    apiVersion: apps.kruise.io/v1alpha1
    kind: UnitedDeployment
    name: sample-ud
```

## 自适应调度策略

**FEATURE STATE:** Kruise v1.8.0

UnitedDeployment 支持通过 scheduleStrategy 字段配置两种不同的调度策略：Fixed 与 Adaptive。两种策略的行为如下：

### Fixed 固定策略
- **行为**：严格遵循预定义的 Subset 分布规则调度 Pod，即使因节点资源不足或调度冲突导致 Pod 调度失败，仍会持续尝试在原 Subset 中调度。
- **适用场景**：需要精确控制工作负载分布的场景，例如对特定节点资源隔离或合规性要求高的环境。

### Adaptive 自适应策略
- **行为**：在目标 Subset 无法调度时，自动将 Pod 调度到其他具有可用资源的 Subset。调度优先级遵循 Subset 列表顺序。
- **特性**：
  - 动态资源补偿：当某 Subset 资源不足时，自动将 Pod 调度到其他 Subset
  - 可配置重调度超时：通过 `rescheduleCriticalSeconds` 参数设置重调度判定时间窗口（默认30秒）
- **适用场景**：需要高弹性资源调度的场景，例如混合使用常规节点池与弹性节点池

#### 示例：混合节点池调度策略
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: UnitedDeployment
metadata:
  name: ud-demo
spec:
  #...
  topology:
    subsets:
    - name: subset-a
      maxReplicas: 3
      #...
    - name: subset-b
      #...
    scheduleStrategy:
      # 调度策略，Adaptive 模式会将调度失败的 Pod 重新调度到其他 Subset
      type: Adaptive
      adaptive:
        rescheduleCriticalSeconds: 30
```

#### 场景说明
- **低峰期**：优先在常规节点池（subset-a）调度 Pod，充分利用固定资源
- **高峰期**：当 subset-a 的节点资源不足时，自动将超出 `maxReplicas` 的 Pod 调度到弹性节点池（subset-b）
- **故障恢复**：当 subset-a 节点全部不可用时，所有新 Pod 将自动迁移到 subset-b

## Pod 分发管理

上述例子中可以看到，`spec.topology` 中可以定义 Pod 分发的规则：

```go
// Topology defines the spread detail of each subset under UnitedDeployment.
// A UnitedDeployment manages multiple homogeneous workloads which are called subset.
// Each of subsets under the UnitedDeployment is described in Topology.
type Topology struct {
    // Contains the details of each subset. Each element in this array represents one subset
    // which will be provisioned and managed by UnitedDeployment.
    // +optional
    Subsets []Subset `json:"subsets,omitempty"`
}

// Subset defines the detail of a subset.
type Subset struct {
    // Indicates subset name as a DNS_LABEL, which will be used to generate
    // subset workload name prefix in the format '<deployment-name>-<subset-name>-'.
    // Name should be unique between all of the subsets under one UnitedDeployment.
    Name string `json:"name"`

    // Indicates the node selector to form the subset. Depending on the node selector,
    // pods provisioned could be distributed across multiple groups of nodes.
    // A subset's nodeSelectorTerm is not allowed to be updated.
    // +optional
    NodeSelectorTerm corev1.NodeSelectorTerm `json:"nodeSelectorTerm,omitempty"`

    // Indicates the tolerations the pods under this subset have.
    // A subset's tolerations is not allowed to be updated.
    // +optional
    Tolerations []corev1.Toleration `json:"tolerations,omitempty"`

    // Indicates the number of the pod to be created under this subset. Replicas could also be
    // percentage like '10%', which means 10% of UnitedDeployment replicas of pods will be distributed
    // under this subset. If nil, the number of replicas in this subset is determined by controller.
    // Controller will try to keep all the subsets with nil replicas have average pods.
    // +optional
    Replicas *intstr.IntOrString `json:"replicas,omitempty"`
}
```

在 `topology.subsets` 里面我们指定了多个 `subset` 组，每个 subset 其实对应了一个下属的 workload。
当一个 subset 从这个列表里增加或去除时，UnitedDeployment 控制器会创建或删除相应的 subset workload。

- 每个 subset workload 有一个独立的名字，前缀是 `<UnitedDeployment-name>-<Subset-name>-`。
- subset workload 是根据 UnitedDeployment 的 `spec.template` 做基础来创建，同时将 `subset` 中定义的一些特殊配置（如 `nodeSelector`, `replicas`）合并进去成为一个完整的 workload。

  - `subset.replicas` 可以设置**绝对值**或**百分比**。其中，百分比会根据 UnitedDeployment 的 `replicas` 总数计算出来 subset 需要的数量；而如果不设置这个 `subset.replicas`，控制器会根据总数划分给每个 subset 对应的数量。
  - `subset.nodeSelector` 会合并到 subset workload 的 `spec.template` 下面，因此这个 workload 创建出来的 Pod 都带有对应的调度规则。

## Pod 更新管理

如果用户修改了 `spec.template` 下面的字段，相当于触发了升级流程。
控制器会把新的 template 更新到各个 subset workload 里面，来触发 subset 控制器升级 Pod。

同时，如果 subset workload 支持 `partition` 策略（目前可用的 `AdvancedStatefulSet`, `StatefulSet` 都是支持的），还可以使用 `manual` 升级策略。

```go
// UnitedDeploymentUpdateStrategy defines the update performance
// when template of UnitedDeployment is changed.
type UnitedDeploymentUpdateStrategy struct {
    // Type of UnitedDeployment update strategy.
    // Default is Manual.
    // +optional
    Type UpdateStrategyType `json:"type,omitempty"`
    // Includes all of the parameters a Manual update strategy needs.
    // +optional
    ManualUpdate *ManualUpdate `json:"manualUpdate,omitempty"`
}

// ManualUpdate is a update strategy which allows users to control the update progress
// by providing the partition of each subset.
type ManualUpdate struct {
    // Indicates number of subset partition.
    // +optional
    Partitions map[string]int32 `json:"partitions,omitempty"`
}
```

通过 `manual` 升级策略，用户可以指定 UnitedDeployment 下面每个 subset workload 的灰度升级数量，控制器会把不同的 `partition` 数值同步给对应的 subset workload 里面。

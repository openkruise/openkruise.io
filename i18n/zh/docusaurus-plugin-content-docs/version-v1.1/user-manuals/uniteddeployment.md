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

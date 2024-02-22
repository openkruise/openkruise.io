# API 规范

Kruise Rollouts 资源 YAML 的基本示例：

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  # Rollout 资源需要与相应的工作负载在相同的命名空间中
  namespace: defaults
  # 此注释可以帮助我们使用分区升级 Deployment，类似于 StatefulSet/CloneSet。
  annotations:
    rollouts.kruise.io/rolling-style: partition
spec:
  objectRef:
    # 发布工作负载的 Rollout，当前仅支持 Deployment、CloneSet、StatefulSet、Advanced StatefulSet
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: echoserver
  strategy:
    canary:
      steps:
      ### 第一批 ###
      # 将 5% 的流量路由到新版本
      - weight: 5
      # 需要手动确认才能进入下一批
        pause: {}
      # 可选，发布副本的第一步。如果未设置，则默认使用“weight”，如上所示为 5%。
        replicas: 1
      ### 第二批 ###
      - replicas: 50%
      # 等待 2 小时后自动进入下一批
        pause:
          duration: 7200
      ### 第三批 ###
      - replicas: 100%
      trafficRoutings:
      # 与工作负载相关的服务名称
      - service: echoserver
      # 与服务相关的 Ingress 名称
        ingress:
          name: echoserver
```

API 规范的主要部分包括 3 部分，您应该注意：

- 绑定工作负载：告诉 Rollout 应该在哪个工作负载上工作。
- 绑定流量配置：告诉 Rollout 应该关注哪个流量配置。
- 在发布之前配置部署策略：告诉 Rollout 如何滚动您的工作负载和流量。

## API 详细信息

### 工作负载绑定 API（必填）

告诉 Kruise Rollout 应该绑定哪个工作负载：

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: StatefulSet
      name: <your-workload-name>
```

| 字段           | 类型	 | 默认值	 | 说明           |
|--------------|-----|------|--------------|
| `apiVersion` | 字符串 | ""   | 工作负载的 API 版本 |
| `kind`       | 字符串 | ""   | 工作负载种类       |
| `name`       | 字符串 | ""   | 工作负载名称       |

目前，Kruise Rollout 支持 Deployment、CloneSet、StatefulSet 和Advanced StatefulSet。

注意：

- 工作负载应该与 Rollout 在相同的命名空间中。

### 流量绑定 API（可选）

与“工作负载绑定”不同，流量绑定是可选的。如果不设置以下规范，流量配置将保持其原始行为，例如，为所有版本的 Pod 保持负载均衡。

如果您需要为流量路由执行特殊操作，请告诉 Kruise Rollout 应该绑定哪些流量配置：

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      trafficRoutings:
        - service: <service-name-that-is-related-your-workload>
          ingress:
            classType: <traffic-type> # 例如：nginx | higress，默认为 "nginx"
            name: <ingress-name-that-is-related-the-service>
          gateway: # 或者选择使用 Ingress 或 GatewayAPI
            httpRouteName: <gateway-api-httpRoute-name>
```

| 字段                      | 类型  | 默认值     | 说明                                                                                            |
|-------------------------|-----|---------|-----------------------------------------------------------------------------------------------|
| `service`               | 字符串 | ""      | 选择绑定工作负载的服务名称                                                                                 |
| `ingress`               | 对象  | nil     | （可选）您想要绑定的Ingress对象的描述                                                                        |
| `gateway`               | 对象  | nil     | （可选）您想要绑定的[Gateway API](https://gateway-api.sigs.k8s.io/)资源的描述                                |
| `ingress.classType`     | 字符串 | "nginx" | Ingress类型，如"nginx"、"higress"或其他                                                               |
| `ingress.name`          | 字符串 | ""      | 绑定服务的Ingress资源的名称                                                                             |
| `gateway.httpRouteName` | 字符串 | ""      | Gateway API的[HTTPRoute](https://gateway-api.sigs.k8s.io/concepts/api-overview/#httproute)资源名称 |

注意：

- 如果决定使用`trafficRoutings`，则`ingress`和`gateway`不能同时为nil。

### 策略API（必填）

描述您的发布策略：

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      steps:
        # the first step
        - weight: 5
          replicas:
          pause:
            duration: 1000
          matches:
            - headers:
                - type: Exact # 或者 "RegularExpression"
                  name: <matched-header-name>
                  value: <matched-header-value, or reg-expression>
        # the second step
        - weight: 10
          ... ....
```

| 字段                        | 类型       | 默认值     | 说明                                             |
|---------------------------|----------|---------|------------------------------------------------|
| `steps[x].weight`         | *整数      | nil     | （可选）金丝雀流量新版本Pod的百分比权重。                         |
| `steps[x].replicas`       | *整数或*字符串 | nil     | （可选）新版本Pod的绝对数量或百分比。如果为nil，则默认使用'weight'作为副本数。 |
| `steps[x].pause`          | 对象       | {}      | （可选）进入下一步之前需要手动确认或自动确认。                        |
| `steps[x].pause.duration` | *整数      | nil     | （可选）自动确认之前的持续时间。如果为nil，则表示需要手动确认。              |
| `steps[x].matches`        | []对象     | []      | （可选）您想要将流量引导到新版本Pod的HTTP标头匹配规则。                |
| `headers[x].type`         | 字符串      | "Exact" | 匹配键和值的规则，可以是"Exact"或"RegularExpression"。       |
| `headers[x].name`         | 字符串      | ""      | 匹配的HTTP标头名称。（headers[i]和headers[j]之间的And关系）    |
| `headers[x].value`        | 字符串      | ""      | 匹配的HTTP标头值。                                    |

注意：

- `steps[x].weight`和`steps[x].replicas`不能同时为nil。
- `steps[x].matches[i]和steps[x].matches[j]`之间具有**或**关系；
- `steps[x].matches[y].headers[i]和steps[x].matches[y].header[j]`之间具有**且**关系。

### Rollout的特殊注释（可选）

Rollout中有一些特殊的注释，用于启用特定功能。

| 注释                                | 值                    | 默认值      | 说明                                                                  |
|-----------------------------------|----------------------|----------|---------------------------------------------------------------------|
| `rollouts.kruise.io/rolling-type` | "canary"或"partition" | "canary" | "canary"表示使用金丝雀升级策略进行Deployment；"partition"表示使用多批次升级策略进行Deployment； |

### 工作负载的特殊注释（可选）

绑定工作负载中有一些特殊的注释，用于启用特定功能。

| 注释                              | 值     | 默认值 | 说明                                                    |
|---------------------------------|-------|-----|-------------------------------------------------------|
| `rollouts.kruise.io/rollout-id` | 任意字符串 | ""  | 这个概念类似于发布顺序号。用于解决用户是否观察到Kruise Rollout控制器当前工作负载更改的问题。 |

### 您应该了解的Rollout状态

```yaml
kind: Rollout
status:
  phase: Healthy
  observedGeneration: 2
  canaryStatus:
    canaryReplicas: 10
    canaryReadyReplicas: 10
    canaryRevision: 76fd76f75b
    currentStepIndex: 3
    currentStepState: Completed
    observedRolloutID: "20230313093823"
    observedWorkloadGeneration: 20
    podTemplateHash: 76fd76f75b
    stableRevision: b76b6f48f
```

| 字段                                 | 类型  | 模式    | 说明                                                                    |
|------------------------------------|-----|-------|-----------------------------------------------------------------------|
| `phase`                            | 字符串 | 只读    | "Initial" 表示没有绑定的工作负载；"Healthy" 表示绑定的工作负载已推进；"Progressing" 表示卷出正在进行中。 |
| `observedGeneration`               | 整数  | 只读    | 观察到的卷出规范的生成。                                                          |
| `canaryStatus`                     | *对象 | 只读    | 有关卷出进展的信息。                                                            |
| `canaryStatus.canaryReplicas`      | 整数  | 只读    | 工作负载更新的副本数。                                                           |
| `canaryStatus.canaryReadyReplicas` | 整数  | 只读    | 工作负载更新的就绪副本数。                                                         |
| `canaryStatus.podTemplateHash`     | 字符串 | 只读    | 工作负载更新（新版本）的哈希值。                                                      |
| `canaryStatus.canaryRevision`      | 字符串 | 只读    | 由Kruise Rollout控制器计算的工作负载更新（新版本）的修订哈希值。                               |
| `canaryStatus.stableRevision`      | 字符串 | 只读    | 进展之前记录的工作负载稳定（旧版本）的修订哈希值。                                             |
| `canaryStatus.observedRolloutID`   | 字符串 | 只读    | 对应于工作负载的`rollouts.kruise.io/rollout-id`注释。如果它们相等，意味着卷出控制器观察到了工作负载的更改。 |
| `canaryStatus.currentStepIndex`    | 整数  | 只读    | 卷出当前步骤索引。从1开始。                                                        |
| `canaryStatus.currentStepState`    | 字符串 | 只读和写入 | 卷出当前步骤状态。"StepReady"和"Complete"都表示当前步骤就绪。                             |
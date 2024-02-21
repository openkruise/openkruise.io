# A/B 测试

## A/B 测试流程

A/B测试流程结合了**金丝雀发布**：

<center><img src={require('/static/img/rollouts/ab-testing.jpg').default} width="90%" /></center>

## 配置示例

**注意：目前，A/B测试策略可用于CloneSet、StatefulSet、Advanced StatefulSet和Deployment。**

实际上，A/B测试需要与金丝雀或多批次发布策略结合使用，如上图所示。

接下来，我们将提供一个关于**A/B测试与多批次发布策略**的示例：

```YAML
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  annotations:
    rollouts.kruise.io/rolling-style: partition
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: workload-demo
  strategy:
    canary:
      steps:
        - replicas: 1
          matches:
            - headers:
                - name: user-agent
                  type: Exact
                  value: pc
        - replicas: 50%
        - replicas: 100%
      trafficRoutings:
        - service: service-demo
          ingress:
            classType: nginx
            name: ingress-demo
```

### 行为解释

当您为 `workload-demo` 应用新修订版本时：

- 在第一批中将更新`1`个Pod，具有HTTP头`user-agent=pc`的流量将被引导到新版本Pod，其他流量将被引导到稳定版本Pod。需要手动确认到下一批。
- 在第二批中将更新`50%`的Pod，Header匹配规则将被取消，所有流量将遵循原始负载均衡规则。需要手动确认到下一批。
- 在第三批中将更新`100%`的Pod，Header匹配规则将被取消，所有流量将遵循原始负载均衡规则。
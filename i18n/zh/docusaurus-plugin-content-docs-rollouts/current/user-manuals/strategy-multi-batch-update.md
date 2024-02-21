# 多批次发布

## 多批次策略流程

<center><img src={require('/static/img/rollouts/multi-batch.jpg').default} width="90%" /></center>

## 推荐配置

**注意：目前，多批次策略可用于CloneSet、StatefulSet、Advanced StatefulSet和Deployment。**

```YAML
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollouts-demo
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: workload-demo
  strategy:
    canary:
      enableExtraWorkloadForCanary: false
      steps:
      - replicas: 1
      - replicas: 50%
      - replicas: 100%
```

### 行为解释

当您为`workload-demo`应用新修订版本时：

- 在第一批中，将更新`1`个Pod，而`replicas-1`个Pod仍然保持在稳定版本，需要手动确认到下一批。
- 在第二批中，将更新`50%`的Pod，而`50%`的Pod仍然保持在稳定版本，需要手动确认到下一批。
- 在第三批中，将更新`100%`的Pod，而`0`个Pod仍然保持在稳定版本。

与[金丝雀发布策略](./strategy-canary-update.md)不同，**在发布过程中不会创建额外的部署**。

# 多批次发布

## 概述

多批次策略是一种特殊的金丝雀发布方式，它在预定义的阶段中更新应用副本，无需单独的金丝雀工作负载或流量路由配置。这种方法特别适用于：  

- 运行多个副本的应用 
- 需要逐步发布验证但不需要复杂流量管理的场景 
- 可以通过副本级别监控而非基于流量分析进行验证的工作负载

<center><img src={require('/static/img/rollouts/multi-batch.jpg').default} width="90%" /></center>

多批次策略按顺序执行发布，每批更新指定数量或百分比的 Pod。批次之间的手动审批关卡为验证提供了控制点，然后再进入后续阶段。

## 推荐配置

**注意：v1beta1 API 从 Kruise Rollout v0.5.0 版本开始可用。**

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
      - replicas: 50%
      - replicas: 100%
```

### 支持的工作负载类型

多批次策略兼容以下 Kubernetes 工作负载资源：

- Deployment
- StatefulSet
- DaemonSet（仅 rollout v1beta1）
- Kruise Advanced StatefulSet
- Kruise Advanced DaemonSet
- Kruise CloneSet



### 行为解释

当为 `workload-demo` 应用新版本时，发布将按照定义的批次进行，具体如下：

- 在第 1 批中，将更新 `1` 个 Pod，而 `replicas-1` 个 Pod 仍然保持在稳定版本，需要手动确认到下一批。
- 在第 2 批中，将更新 `50%` 的 Pod，而 `50%` 的 Pod 仍然保持在稳定版本，需要手动确认到下一批。
- 在第 3 批中，将更新 `100%` 的 Pod，而 `0` 个 Pod 仍然保持在稳定版本。

与[金丝雀发布策略](strategy-canary-update.md)不同，**在发布过程中不会创建额外的 Deployment**。

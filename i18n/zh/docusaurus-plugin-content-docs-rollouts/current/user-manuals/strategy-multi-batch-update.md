# 多批次发布

## 概述

多批次策略是一种特殊的金丝雀发布方式，它在预定义的阶段中更新应用副本，无需单独的金丝雀工作负载或流量路由配置。这种方法特别适用于：  

- 运行多个副本的应用 
- 需要逐步发布验证但不需要复杂流量管理的场景 
- 可以通过副本级别监控而非基于流量分析进行验证的工作负载


## 发布流程

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

## MinReadySeconds 策略（Alpha）

原生 Deployment 可以使用基于 Deployment 自身 `minReadySeconds` 字段的另一种多批次发布策略。这是一个 **alpha** 功能，由 `MinReadySecondsStrategy` 特性开关选择，**默认关闭**。

### 设计思路

Kubernetes 只有在 Pod 保持 `Ready` 达到 `minReadySeconds` 之后，才会把它视为 `Available`。默认的多批次路径会暂停原生 Deployment，并把 `spec.strategy.type` 改写成 `Recreate`，由 Rollout 控制器自己推进分区。这条路径是可用的，但改写的是一个破坏性字段：如果在恢复原策略之前 Rollout 控制器或 webhook 不可用，之后对 pod template 的更新就可能被原生 Deployment 控制器按 Recreate 语义处理。

MinReadySeconds 策略从头到尾都不改 `strategy.type`。它把 `minReadySeconds` 膨胀到极大值，让新更新的 Pod 可以 `Ready` 但暂时不是 `Available`，再按批次扩大 `maxUnavailable`。原生 `RollingUpdate` 控制器继续负责替换 Pod，Rollout 只控制节奏。最坏情况下 Pod 会停留在 Ready-but-not-Available，而不会被一次性 Recreate。

### 如何开启

安装或升级 kruise-rollout 时，通过 Helm 的 `rollout.featureGates` 参数开启特性开关：

```bash
$ helm install kruise-rollout openkruise/kruise-rollout \
  --set rollout.featureGates="AdvancedDeployment=true,MinReadySecondsStrategy=true"
```

或者，在已有安装上直接修改 controller manager 的启动参数：

```bash
$ kubectl patch deployment kruise-rollout-controller-manager -n kruise-rollout --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/args/1", "value": "--feature-gates=AdvancedDeployment=true,MinReadySecondsStrategy=true"}]'
```

开启后，集群中所有 partition 风格的 Deployment 发布都将使用 MinReadySeconds 策略。Rollout CR 的形态不变：

```yaml
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

### 与默认策略的区别

HPA / 外部扩缩容和 PodDisruptionBudget 在**两种策略下都生效**。Paused 的 Deployment 仍然会处理副本数变化，因此 Recreate 路径并不会把 HPA 冻住；PDB 同样继续约束驱逐。真正的差异在于：各自改了 Deployment 的哪些字段，以及由谁驱动更新。

| Deployment 上改了什么 | 默认（基于 Recreate） | MinReadySeconds |
|---|---|---|
| `spec.paused` | 设为 `true`（暂停原生更新控制器） | 保持 `false`（原生控制器继续运行） |
| `spec.strategy.type` | 改写为 `Recreate` | 保持 `RollingUpdate` |
| `spec.minReadySeconds` | 不改 | 发布期间膨胀 |
| `spec.progressDeadlineSeconds` | 不改 | 发布期间膨胀 |
| `spec.strategy.rollingUpdate.maxUnavailable` | 随 `RollingUpdate` 清空，分区由 Rollout 驱动 | 先膨胀，再按批次推进 |
| `spec.strategy.rollingUpdate.maxSurge` | 由 Rollout 控制器驱动 | 交给原生 Deployment 控制器（尊重用户配置） |
| 注解 | 发布进行中标记 | 额外写入三条 `rollouts.kruise.io/original-*` 快照（见下） |
| 批次就绪条件 | 等待更新后的 Pod 变为 `Ready` | 等待更新后的 Pod 在**原始** `minReadySeconds` 下变为 `Available` |
| 发布中控制器故障 | 批次停止推进，直到 Rollout 恢复；若此时有人改 pod template，残留的 `Recreate` 是风险 | 原生 Deployment 控制器仍按当前 `maxUnavailable` 预算继续更新 |

MinReadySeconds 发布开始时，控制器会把用户原来的 `minReadySeconds`、`progressDeadlineSeconds` 和 `maxUnavailable` 保存到：

- `rollouts.kruise.io/original-min-ready-seconds`
- `rollouts.kruise.io/original-progress-deadline-seconds`
- `rollouts.kruise.io/original-max-unavailable`

然后膨胀这三个 spec 字段以接管发布节奏，并逐步提高 `maxUnavailable` 驱动每一批。发布结束后恢复原始字段并删除这些注解。

因为 `progressDeadlineSeconds` 被膨胀了，MinReadySeconds 接管期间原生 Deployment 控制器**不会**打上 `ProgressDeadlineExceeded`。批次等待较久时，不要把它当成一次失败的原生 Deployment 发布。请看 Rollout / BatchRelease 的状态，以及 MinReady 的 stuck / degraded 信号。

### 操作注意

**不要手工修改** `rollouts.kruise.io/original-*` 注解。它们是恢复原始字段的契约：一旦被删除或改坏，发布会进入 degraded，并**卡住等待人工介入**（把注解恢复正确，或取消 / finalize 这次发布以便回收原始字段）。

发布过程中，也不要指望手工改 `minReadySeconds`、`progressDeadlineSeconds` 或 `maxUnavailable` 会生效。这些 spec 字段由 MinReadySeconds 控制器持有：admission 会把可用性字段重新膨胀回去，`maxUnavailable` 也会被收敛回当前批次预算。需要换节奏时改 Rollout 的 steps；需要改 Deployment 自己的可用性配置时，等这次发布结束再改。

### 行为说明

- **批次进度**：每批把 `maxUnavailable` 提高到批次目标；控制器会等待更新的 Pod 在原始 `minReadySeconds` 下变为可用后再扩大预算。当金丝雀批次较小、后续批次很大时，预算会按用户原始 `maxUnavailable` 滑动窗口逐步放开，而不是一次性跳变。
- **回滚 / 连续发布**：与默认策略一致；重新膨胀时刷新原始可用性字段。
- **升级兼容性**：如果升级控制器开启特性开关时，某个 Deployment 正处于之前基于 Recreate 策略的发布中，该进行中的发布会继续使用 Recreate 策略直到完成，而不会中途切换。
- **发布中关闭开关**：仍带 `rollouts.kruise.io/original-*` 注解的 Deployment 会继续由 MinReadySeconds 控制器接管直到 finalize，从而干净地恢复原始字段，而不会被卡在中间状态。
- **限制（alpha）**：该策略仅适用于原生 Deployment；其他工作负载类型（CloneSet、StatefulSet、DaemonSet）继续使用默认的 partition 策略。用户 Deployment 上的 `strategy.type=Recreate` 会被拒绝并上报为 degraded。

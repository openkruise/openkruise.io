# 基本使用指南

本文档重点介绍如何使 Kruise Rollout 生效以及如何完成一个完整的发布，并回答一些关于用法的问题。

## 完整的发布流程

### 步骤 0：要求

- [安装](../installation.md) Kruise Rollouts。

- 假设您的 Kubernetes 集群中已经有一个部署（Deployment），如下所示：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workload-demo
  namespace: default
spec:
  replicas: 10
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: busybox
        image: busybox:latest
        command: ["/bin/sh", "-c", "sleep 100d"]
        env:
        - name: VERSION
          value: "version-1"
```

### 步骤 1：准备并应用 Rollout 配置

假设您想要使用多批次更新策略将部署从 "version-1" 升级到 "version-2"：

- 在第一批次：只升级 **1个Pod**；
- 在第二批次：升级 **50%** 的 Pods，即 **5个已更新的Pod**；
- 在第三批次：升级 **100%** 的 Pods，即 **10个已更新的Pod**。

```bash
$ kubectl apply -f - <<EOF
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  namespace: default
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
EOF
```

### 步骤 2：将部署升级到 "version-2" 并发布第一批次

```bash
$ kubectl patch deployment workload-demo -p \
'{"spec":{"template":{"spec":{"containers":[{"name":"busybox", "env":[{"name":"VERSION", "value":"version-2"}]}]}}}}'
```

稍等片刻，我们将看到部署状态显示已升级 **1个Pod**。
<center><img src={require('/static/img/rollouts/basic-1st-batch.jpg').default} width="90%" /></center>

### 步骤 3：继续发布第二批次

```bash
$ kubectl-kruise rollout approve rollout/rollouts-demo -n default
```

注意：[kubectl-kruise](https://github.com/openkruise/kruise-tools) 也由 OpenKruise 社区提供。

稍等片刻，我们将看到部署状态显示已升级 **5个Pod**。
<center><img src={require('/static/img/rollouts/basic-2nd-batch.jpg').default} width="90%" /></center>

### 步骤 4：继续发布第三批次

```bash
$ kubectl-kruise rollout approve rollout/rollouts-demo -n default
```

稍等片刻，我们将看到部署状态显示所有 **10个Pod** 已升级。
<center><img src={require('/static/img/rollouts/basic-3rd-batch.jpg').default} width="90%" /></center>

## 如何手动继续下一步？

目前有两种方法。例如，**如果您已完成第一批次并希望发送第二批次：**

- 方法一： 您可以将第一批次的 `pause.duration` 字段设置为 `duration:0`，这将自动进入下一批次。
- 方法二： 您可以将 `rollout.status.canaryStatus.currentStepState` 字段更新为 `"StepReady"`，这也将自动进入下一批次。

每种方法都有其 **优点** 和 **缺点**：

- **对于方法一**，它可以确保您的操作的幂等性，但在下一次发布之前，您需要将 Rollout 的策略重置回其原始状态（例如，将持续时间字段重置为
  nil）。

```yaml
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - replicas: 1
        pause: 
          duration: 0 
      - ... ...
```

- **对于方法二**，在下一次发布之前，您无需更改任何内容。然而，在确认之前，您需要检查 Rollout 的状态，并使用 Kubernetes
  客户端的更新接口而不是修补接口，或者使用我们的 [kubectl-kruise](https://github.com/openkruise/kruise-tools) 工具。

```bash
$ kubectl-kruise rollout approve rollout/<your-rollout-name> -n <your-rollout-namespace>
```

## 如何知道当前步骤是否已准备就绪？

关于当前步骤的所有状态信息都记录在 Rollout 的 `status.canaryStatus` 字段中：

- 如果 `status.canaryStatus.CurrentStepIndex` 不等于您期望的步骤索引，则当前步骤 **尚未准备就绪**。
- 如果 `status.canaryStatus.CurrentStepState` 不等于 "StepReady" 或 "Complete"，则当前步骤 **尚未准备就绪**。

```go
func IsRolloutCurrentStepReady(rollout *rolloutsv1alpha1.Rollout, stepIndex int32) bool {
	if rollout.Status.CanaryStatus != nil {
		if rollout.Status.CanaryStatus.CurrentStepIndex != stepIndex {
			return false
        }
		switch rollout.Status.CanaryStatus.CurrentSetpState {
		case "StepReady", "Complete":
            return true
		}
	}
	return false
}
```

但在一些自动化场景（例如 PaaS 平台），在判断当前步骤是否准备就绪之前，我们应该知道 `canaryStatus` 是否与当前的 Rollout
进程对应（也许它对应上一个 Rollout 进程）。我们可以使用 `rollout-id` 机制来解决这个问题。

```go
func IsRolloutCurrentStepReady(workload appsv1.Deployment, rollout *rolloutsv1alpha1.Rollout, stepIndex int32) bool {
	if rollout.Status.CanaryStatus != nil {
		rolloutId := workload.Labels["rollouts.kruise.io/rollout-id"]
		if rolloutId != rollout.Status.CanaryStatus.ObservedRolloutID {
			return false
        }
		if rollout.Status.CanaryStatus.CurrentStepIndex != stepIndex {
			return false
		}
		switch rollout.Status.CanaryStatus.CurrentSetpState {
		case "StepReady", "Complete":
			return true
		}
	}
	return false
}
```

## 如何回滚

事实上，Kruise Rollout **不提供** 直接回滚的功能。**Kruise Rollout
更倾向于让用户能够直接回滚工作负载规范以回滚其应用程序。** 当用户需要从“version-2”回滚到“version-1”时，Kruise Rollout
将使用本机的滚动升级策略来快速执行回滚，而不是采用多批次检查点策略。

## 其他声明

- **连续发布**：假设 Rollout 正在从“version-1”进展到“version-2”（尚未完成）。现在，工作负载被修改为“version-3”，Rollout
  将从开始步骤（第一步）重新开始进展。
- **HPA兼容**：假设您为工作负载配置了水平Pod自动伸缩（HPA）并使用多批次升级策略，我们建议使用“百分比”来指定“steps[x]
  .replicas”。如果在升级进行过程中扩展或缩小副本数量，旧版本和新版本的副本将根据“百分比”配置进行伸缩，以确保伸缩与升级进展保持一致。

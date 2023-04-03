---
title: BroadcastJob
---

这个控制器将 Pod 分发到集群中每个 node 上，类似于 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)，
但是 BroadcastJob 管理的 Pod 并不是长期运行的 daemon 服务，而是类似于 [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的任务类型 Pod。

最终在每个 node 上的 Pod 都执行完成退出后，BroadcastJob 和这些 Pod 并不会占用集群资源。
这个控制器非常有利于做升级基础软件、巡检等过一段时间需要在整个集群中跑一次的工作。

此外，BroadcastJob 还可以维持每个 node 跑成功一个 Pod 任务。如果采取这种模式，当后续集群中新增 node 时 BroadcastJob 也会分发 Pod 任务上去执行。
  
## Spec 定义

### Template

`Template` 描述了 Pod 模板，用于创建任务 Pod。
注意，由于是任务类型的 Pod，其中的 restart policy 只能设置为 `Never` 或 `OnFailure`，不允许设为 `Always`。

### Parallelism

`Parallelism` 指定了最多能允许多少个 Pod 同时在执行任务，默认不做限制。

比如，一个集群里有 10 个 node、并设置了 `Parallelism` 为 3，那么 BroadcastJob 会保证同时只会有 3 个 node 上的 Pod 在执行。每当一个 Pod 执行完成，BroadcastJob 才会创建一个新 Pod 执行。

### CompletionPolicy

`CompletionPolicy` 支持指定 BroadcastJob 控制器的 reconciling 行为，可以设置为 `Always` 或 `Never`：

#### Always

`Always` 策略意味着 job 最终会完成，不管是执行成功还是失败了。在 `Always` 策略下还可以设置以下参数：

- `ActiveDeadlineSeconds`：指定一个超时时间，如果 BroadcastJob 开始运行超过了这个时间，所有还在跑着的 job 都会被停止、并标记为失败。

- `BackoffLimit`：指定一个重试次数，超过这个次数后才标记 job 失败，默认没有限制。目前，Pod 实际的重试次数是看 Pod status 中上报所有容器的 [ContainerStatus.RestartCount](https://github.com/kruiseio/kruise/blob/d61c12451d6a662736c4cfc48682fa75c73adcbc/vendor/k8s.io/api/core/v1/types.go#L2314) 重启次数。如果这个重启次数超过了 `BackoffLimit`，这个 job 就会被标记为失败、并把运行的 Pod 删除掉。

- `TTLSecondsAfterFinished` 限制了 BroadcastJob 在完成之后的存活时间，默认没有限制。比如设置了 `TTLSecondsAfterFinished` 为 10s，那么当 job 结束后超过了 10s，控制器就会把 job 和下面的所有 Pod 删掉。

#### Never

`Never` 策略意味着 BroadcastJob 永远都不会结束（标记为 Succeeded 或 Failed），即使当前 job 下面的 Pod 都已经执行成功了。
这也意味着 `ActiveDeadlineSeconds`、 `BackoffLimit`、 `TTLSecondsAfterFinished` 这三个参数是不能使用的。

比如说，用户希望对集群中每个 node 都下发一个配置，包括后续新增的 node 都需要做，那么就可以创建一个 `Never` 策略的 BroadcastJob。

## 例子

### 监控 BroadcastJob status

在一个单 node 集群中创建一个 BroadcastJob，执行 `kubectl get bcj` （BroadcastJob 的 short name）看到以下状态：

```shell
 NAME                 DESIRED   ACTIVE   SUCCEEDED   FAILED
 broadcastjob-sample  1         0        1           0
```

- `Desired` : 期望的 Pod 数量（等同于当前集群中匹配的 node 数量）
- `Active`: 运行中的 Pod 数量
- `SUCCEEDED`: 执行成功的 Pod 数量
- `FAILED`: 执行失败的 Pod 数量

### ttlSecondsAfterFinished

创建 BroadcastJob 配置 `ttlSecondsAfterFinished` 为 30。
这个 job 会在执行结束后 30s 被删除。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-ttl
spec:
  template:
    spec:
      containers:
        - name: pi
          image: perl
          command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  completionPolicy:
    type: Always
    ttlSecondsAfterFinished: 30
```

### activeDeadlineSeconds

创建 BroadcastJob 配置 `activeDeadlineSeconds` 为 10。
这个 job 会在运行超过 10s 之后被标记为失败，并把下面还在运行的 Pod 删除掉。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-active-deadline
spec:
  template:
    spec:
      containers:
        - name: sleep
          image: busybox
          command: ["sleep",  "50000"]
      restartPolicy: Never
  completionPolicy:
    type: Always
    activeDeadlineSeconds: 10
```

### completionPolicy

创建 BroadcastJob 配置 `completionPolicy` 为 `Never`。
这个 job 会持续运行即使当前所有 node 上的 Pod 都执行完成了。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-never-complete
spec:
  template:
    spec:
      containers:
        - name: sleep
          image: busybox
          command: ["sleep",  "5"]
      restartPolicy: Never
  completionPolicy:
    type: Never
```

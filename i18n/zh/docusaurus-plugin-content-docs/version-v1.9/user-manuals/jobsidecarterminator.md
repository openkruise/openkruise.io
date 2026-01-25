---
title: Job Sidecar Terminator
---

**FEATURE STATE:** Kruise v1.4.0

对于 Job 类型的 Workload，我们通常希望当这些 Pod 中执行业务逻辑的主容器完成任务并退出后，日志收集等 sidecar 容器也能够主动退出，从而使得这些 Job Controller 能够正确判断 Pod 所处的完成状态，避免一些错误的信息上报和流程异常。

为了解决这个问题，我们在 Kruise 中加入了一个名为 `SidecarTerminator` 的控制器，专门用于在此类场景下，监听主容器的完成状态，并选择合适的时机终止掉 Pod 中的 sidecar 容器，而且无需对业务进行侵入式改造。

**注意：** 如果 K8S 版本>=1.28，推荐使用K8S原生的 [Sidecar Container](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers) 来解决上述问题。

## 使用前提

- 在安装或升级 Kruise 时启用 `SidecarTerminator` Feature-Gate（默认关闭）
- 在安装或升级 Kruise 时启用 `KruiseDaemon` Feature-Gate（默认开启）。

## 使用方式

### 对于运行于普通节点的 Pod
对于运行于普通节点的 Pod，使用该特性非常简单，用户只需要在要在目标 sidecar 容器中添加一个特殊的 env 对其进行标识，控制器会在恰当的时机利用 Kruise Daemon 提供的 [CRR](./containerrecreaterequest.md) 的能力，将这些 sidecar 容器终止：

```yaml
kind: Job
spec:
  template:
    spec:
      containers:
        - name: sidecar
          env:
            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT
              value: "true"
        - name: main
... ...
```
### 对于运行于虚拟节点的 Pod
对于一些提供 Serverless 容器的平台，例如 [ECI](https://www.aliyun.com/product/eci) 或者 [Fargate](https://aws.amazon.com/cn/fargate/), 其 Pods 只能运行于 [Virtual-Kubelet](https://virtual-kubelet.io/#:~:text=Virtual%20Kubelet%20is%20an%20open,as%20serverless%20cloud%20container%20platforms.) 之类的虚拟节点。 然而，Kruise Daemon 无法部署和工作在这些虚拟节点之上，导致无法使用 CRR 能力将容器终止。
但幸运地是，我们可以借助原生 Kubernetes 提供的 Pod 原地升级机制来达到同样的目的：只需要构造一个特殊镜像，这个镜像的唯一作用就是当被拉起后，会快速地主动退出，这样一来，只需要在退出 sidecar 时，将原本的 sidecar 镜像替换为快速退出镜像，即可达到退出 sidecar 的目的。

#### 步骤一: 准备一个快速退出镜像
- 该镜像只需要具备非常简单的逻辑：当其被拉起后，直接退出，且退出码为 0。
- 该镜像需要兼容原 sidecar 镜像的 `commands` 和 `args`，以防容器被拉起时报错。

#### 步骤二: 配置你的 sidecar 容器
```yaml
kind: Job
spec:
  template:
    spec:
      containers:
        - name: sidecar
          env:
            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE
              value: "example/quick-exit:v1.0.0"
        - name: main
... ...
```
 使用你自己准备的快速退出镜像来替换上述 `"example/quick-exit:v1.0.0"`.

### 忽略 Sidecar 容器退出码非0

**FEATURE STATE:** Kruise v1.6.0

在之前的版本，要求 Sidecar 容器能够接受、处理 `SIGTERM` 信号，并且退出码为`0`。否则，将会导致 Pod Phase=Failed。

从 Kruise 1.6.0 版本开始，将忽略 Sidecar 容器退出码 `非0` 的情况，Pod Phase 状态只依赖于 Main 容器成功与否。

### 注意事项

- sidecar 容器必须能够响应 `SIGTERM` 信号。当收到此信号时，`EntryPoint` 进程必须退出(即 sidecar 容器退出)，且退出码应当为 `0`。
- 该特性适用于任意 Job 类型 Workload 所管理的 Pod，只要它们的 `RestartPolicy` 为 `Never/OnFailure` 即可。
- 具有环境变量 `KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT` 的容器将被视为 sidecar 容器，其他容器将被视为主容器，当**所有**主容器完成后，sidecar 容器才会被终止：
  - 在 `Never` 重启策略下，主容器一旦退出，将被视为"已完成"。
  - 在 `OnFailure` 重启策略下，主容器退出代码必须为`0`，才会被视为"已完成"。
- 且运行在普通节点方式下，`KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT` 的优先级高于`KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE`


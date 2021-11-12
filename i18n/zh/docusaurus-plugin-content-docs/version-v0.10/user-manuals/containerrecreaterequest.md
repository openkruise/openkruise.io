---
title: Container Restart
---

**FEATURE STATE:** Kruise v0.9.0

ContainerRecreateRequest 可以帮助用户**重启/重建**存量 Pod 中一个或多个容器。

和 Kruise 提供的原地升级类似，当一个容器重建的时候，Pod 中的其他容器还保持正常运行。重建完成后，Pod 中除了该容器的 restartCount 增加以外不会有什么其他变化。
注意，之前临时写到旧容器 **rootfs** 中的文件会丢失，但是 volume mount 挂载卷中的数据都还存在。

这个功能依赖于 `kruise-daemon` 组件来停止 Pod 容器。
如果 `KruiseDaemon` feature-gate 被关闭了，ContainerRecreateRequest 也将无法使用。

## 使用方法

### 提交请求

为要重建容器的 Pod 提交一个 `ContainerRecreateRequest` 自定义资源（缩写 `CRR`）：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ContainerRecreateRequest
metadata:
  namespace: pod-namespace
  name: xxx
spec:
  podName: pod-name
  containers:       # 要重建的容器名字列表，至少要有 1 个
  - name: app
  - name: sidecar
  strategy:
    failurePolicy: Fail                 # 'Fail' 或 'Ignore'，表示一旦有某个容器停止或重建失败， CRR 立即结束
    orderedRecreate: false              # 'true' 表示要等前一个容器重建完成了，再开始重建下一个
    terminationGracePeriodSeconds: 30   # 等待容器优雅退出的时间，不填默认用 Pod 中定义的
    unreadyGracePeriodSeconds: 3        # 在重建之前先把 Pod 设为 not ready，并等待这段时间后再开始执行重建
    minStartedSeconds: 10               # 重建后新容器至少保持运行这段时间，才认为该容器重建成功
  activeDeadlineSeconds: 300        # 如果 CRR 执行超过这个时间，则直接标记为结束（未结束的容器标记为失败）
  ttlSecondsAfterFinished: 1800     # CRR 结束后，过了这段时间自动被删除掉
```

*所有 `strategy` 中的字段、以及 `spec` 中的 `activeDeadlineSeconds`/`ttlSecondsAfterFinished` 都是可选的。*

1. 一般来说，列表中的容器会一个个被停止，但可能同时在被重建和启动，除非 `orderedRecreate` 被设置为 `true`。
2. `unreadyGracePeriodSeconds` 功能依赖于 `KruisePodReadinessGate` 这个 feature-gate 要打开，后者会在每个 Pod 创建的时候注入一个 readinessGate。
   否则，默认只会给 Kruise workload 创建的 Pod 注入 readinessGate，也就是说只有这些 Pod 才能在 CRR 重建时使用 `unreadyGracePeriodSeconds`。

```bash
# for commandline you can
$ kubectl get containerrecreateqequest -n pod-namespace
# or just short name
$ kubectl get crr -n pod-namespace
```

### 检查状态

CRR status 如下：

```yaml
status:
  completionTime: "2021-03-22T11:53:48Z"
  containerRecreateStates:
  - name: app
    phase: Succeeded
  - name: sidecar
    phase: Succeeded
  phase: Completed
```

`status.phase` 包括:

- `Pending`: CRR 等待被执行
- `Recreating`: CRR 正在被执行
- `Completed`: CRR 已经执行完成，完成时间在 `status.completionTime` 字段可见

注意，`status.phase=Completed` 只表示 CRR 完成，并不代表 CRR 中声明的容器都重建成功了，因此还需要检查 `status.containerRecreateStates` 中的信息。

`status.containerRecreateStates[x].phase` 包括:

- `Pending`: container 等待被重建
- `Recreating`: container 正在被重建
- `Failed`: container 重建失败，此时 `status.containerRecreateStates[x].message` 应有错误信息
- `Succeeded`: container 重建成功

**因此，当 CRR 结束了，只有上述 container 状态是 `Succeeded` phase 的才表示重建成功了。**

## 实现介绍

当用户创建了一个 CRR，Kruise webhook 会把当时容器的 containerID/restartCount 记录到 `spec.containers[x].statusContext` 之中。
在 **kruise-daemon** 执行的过程中，如果它发现实际容器当前的 containerID 与 `statusContext` 不一致或 restartCount 已经变大，
则认为容器已经被重建成功了（比如可能发生了一次原地升级）。

![ContainerRecreateRequest](/img/docs/user-manuals/containerrecreaterequest.png)

一般情况下，**kruise-daemon** 会执行 preStop hook 后把容器停掉，然后 **kubelet** 感知到容器退出，则会新建一个容器并启动。
最后 **kruise-daemon** 看到新容器已经启动成功超过 `minStartedSeconds` 时间后，会上报这个容器的 phase 状态为 `Succeeded`。

如果容器重建和原地升级操作同时触发了：

- 如果 **Kubelet** 根据原地升级要求已经停止或重建了容器，**kruise-daemon** 会判断容器重建已经完成。
- 如果 **kruise-daemon** 先停了容器，**Kubelet** 会继续执行原地升级，即创建一个新版本容器并启动。

如果针对一个 Pod 提交了多个 ContainerRecreateRequest 资源，会按时间先后一个个执行。

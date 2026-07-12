# 提交沙箱镜像

## 概述

`Commit` 是 OpenKruise Agents 中的命名空间级 CRD，用于把运行中 Sandbox 容器的可写文件系统保存为一个新的容器镜像，并推送到镜像仓库。

它适用于以下场景：

- 将配置完成的开发环境保存为可复用镜像。
- 把运行中 Sandbox 内产生的修改固化为一个带版本的镜像。
- 将 Sandbox 工作区状态分享给其他用户，或作为后续 Sandbox 模板的基础镜像。

### Commit 可以保存的内容

- 目标容器可写层内的文件系统变更，例如安装的软件包、源代码、配置文件、构建产物、日志文件等磁盘上的数据。
- 已经存在于容器 rootfs 中的数据。

### Commit 不会保存的内容

- 进程内存中的状态。
- GPU 显存、GPU 设备状态或加速器上下文。
- 活跃网络连接、已打开的文件描述符或进程表。
- PVC、hostPath 以及非容器可写层的外部挂载卷。

与[快照管理](./checkpoint.md)不同，Checkpoint 更偏向捕获 Sandbox 运行时状态，用于休眠/恢复或 Fork；`Commit` 产出的是普通容器镜像，可被兼容的容器运行时直接拉取使用。

## Feature Gate

`Commit` 受 `Commit` feature gate 控制。当前社区实现中，该能力是 Alpha 功能，默认关闭。

需要在 sandbox controller 上显式开启：

```shell
--feature-gates=Commit=true
```

## 前置条件

创建 `Commit` 前，请确认：

- OpenKruise Agents controller 已安装并正常运行。
- 集群中已注册 `Commit` CRD（`commits.agents.kruise.io`）。
- 目标 Sandbox Pod 正在运行且已经调度，目标容器由 containerd 管理。Pod status 中该容器的 container ID 必须带有 `containerd://` 前缀；仅使用 Docker 或 CRI-O 的节点暂不支持。
- 目标节点在 `/run/containerd/containerd.sock` 暴露 containerd socket。commit Job 会从目标节点挂载 `/run/containerd/`，并通过 nerdctl 连接该 socket。
- sandbox controller 已配置 `AGENT_JOB_IMAGE`，且该镜像包含 `commit-job` 二进制和 `nerdctl`。
- 目标节点能够访问要推送的镜像仓库。
- 对于 registry TLS 校验，commit Job 默认使用 nerdctl 的 hosts 目录 `/etc/containerd/certs.d`，该目录来自目标节点挂载。若 registry 使用私有 CA、自定义 endpoint 或 mirror 配置，需要在所有可能运行目标 Sandbox Pod 的节点上准备对应的 `/etc/containerd/certs.d/<registry-host>/hosts.toml` 和 CA 文件。
- 如果镜像仓库需要认证，同 namespace 下已创建 Docker config Secret，且该 registry 用户对目标镜像仓库具备 push 权限。

## Commit Job 镜像

`commit-job` 二进制源码位于 `cmd/commit-job`，执行逻辑位于 `pkg/controller/commit/job`。它通过 `dockerfiles/commit-job.Dockerfile` 打包成独立镜像；该镜像同时包含 `/commit-job` 和 `nerdctl` 二进制。

可以用以下命令构建本地镜像：

```shell
docker build -f dockerfiles/commit-job.Dockerfile \
  --build-arg NERDCTL_BRANCH=v2.0.0 \
  -t openkruise/commit-job:<version> .
```

构建完成后，将该镜像配置为 sandbox controller 的 `AGENT_JOB_IMAGE`。

## Commit CRD

`Commit` 资源（`agents.kruise.io/v1alpha1`，缩写 `cmt`）的关键字段如下：

| 字段 | 类型 | 说明 |
|---|---|---|
| `spec.podName` | `string` | 必填。目标 Sandbox Pod 名称。创建后不可变更。 |
| `spec.containerName` | `string` | 必填。要提交文件系统的容器名称。创建后不可变更。 |
| `spec.image` | `string` | 必填。要推送的目标镜像地址，例如 `registry.example.com/team/my-env:v1`。创建后不可变更。 |
| `spec.squashLayer` | `int32` | 可选。为后续镜像层 squash 优化预留，`0` 表示不 squash。创建后不可变更。 |
| `spec.timeoutSeconds` | `int32` | 可选。commit Job 的最长运行时间，`0` 表示不限制。创建后不可变更。 |
| `spec.ttl` | `duration` | 可选。`Commit` 进入 `Succeeded` 或 `Failed` 后的保留时长，例如 `24h` 或 `168h`。不配置表示不自动删除。 |
| `spec.registryAuth.secrets` | `[]string` | 可选。同 namespace 下 `kubernetes.io/dockerconfigjson` 类型 Secret 的名称列表。第一个有效 Secret 会挂载给 commit Job，用于 `nerdctl push`。 |
| `status.phase` | `string` | `Pending`、`Running`、`Succeeded` 或 `Failed`。 |
| `status.commitID` | `string` | Commit 标识。当前在 commit 启动后设置为 `Commit` 对象名称。 |
| `status.conditions` | `[]Condition` | commit Job 写入的详细条件信息。常见条件类型包括 `CommitContainer` 和 `PushCommittedImage`；`PullBaseImage` 为未来能力预留。 |
| `status.startTime` | `Time` | commit Job 开始时间。 |
| `status.completionTime` | `Time` | Commit 进入终态的时间。 |

## 创建 Commit

创建一个 `Commit` 对象，指向运行中的 Sandbox Pod 及目标容器。如果目标镜像仓库需要认证，可以通过 `spec.registryAuth.secrets` 引用 Docker config Secret。

先在同 namespace 下创建 registry 认证 Secret。该 Secret 中配置的 registry 用户必须对目标镜像仓库具备 push 权限：

```shell
kubectl create secret docker-registry push-secret \
  -n sandbox-system \
  --docker-server=registry.example.com \
  --docker-username=<username> \
  --docker-password=<password>
```

再创建 `Commit`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Commit
metadata:
  name: commit-demo-01
  namespace: sandbox-system
spec:
  podName: code-interpreter-28rvn
  containerName: workspace
  image: registry.example.com/team/code-interpreter:demo-01
  registryAuth:
    secrets:
      - push-secret
  timeoutSeconds: 600
  ttl: 168h
```

提交配置：

```shell
kubectl apply -f commit.yaml
```

controller 会在目标 Pod 所在节点上创建一个 Kubernetes Job。该 Job 会执行：

```text
nerdctl commit <container-id> <image>
nerdctl push <image>
```

如果未配置 `registryAuth`，或没有找到有效 Secret，commit Job 会尝试匿名推送。`registryAuth.credentials` 字段为未来能力预留，当前不会生效。

## 查看进度

使用缩写 `cmt` 查看 Commit 对象：

```shell
kubectl get cmt -n sandbox-system
```

示例输出：

```text
NAME               PHASE       TTL    AGE
commit-demo-01     Running     168h   12s
commit-demo-auth   Succeeded   168h   2m
```

查看单个 Commit 详情：

```shell
kubectl get cmt commit-demo-01 -n sandbox-system -o yaml
```

直接查看 phase：

```shell
kubectl get cmt commit-demo-01 -n sandbox-system -o jsonpath='{.status.phase}'
```

当 `status.phase` 变为 `Succeeded` 后，表示目标镜像已提交并推送成功。

## 失败排查

当 controller 或 commit Job 无法完成流程时，`Commit` 会进入 `Failed`。常见原因如下：

| 现象 | 条件类型 | 可能原因 | 检查项 |
|---|---|---|---|
| `Commit` 很快失败 | - | 目标 Pod 不存在或正在删除 | 检查 `spec.podName` 和 namespace。 |
| Job 生成失败 | - | Pod 状态中找不到目标容器、Pod 尚未调度，或 `AGENT_JOB_IMAGE` 为空 | 检查 `spec.containerName`、Pod 状态和 controller 环境变量。 |
| 镜像提交失败 | `CommitContainer` | 目标节点上 `nerdctl commit` 执行失败 | 查看 Job Pod 日志，检查目标节点的 containerd 访问权限。 |
| 镜像推送失败 | `PushCommittedImage` | 镜像仓库认证、权限、DNS、网络或 TLS 配置问题 | 检查 registry Secret、节点网络和 `/etc/containerd/certs.d`。 |
| Job 超时 | - | `spec.timeoutSeconds` 相对镜像大小或网络速度过小 | 调大 `timeoutSeconds`，或保持为 `0`。 |

可以查看生成的 Job 及其 Pod 日志获取更多信息：

```shell
kubectl get job -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
kubectl get pod -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
kubectl logs -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
```

## 清理 Commit

手动删除 `Commit` 对象：

```shell
kubectl delete cmt commit-demo-01 -n sandbox-system
```

也可以设置 `spec.ttl`，让 controller 在 `Commit` 进入终态后自动删除该对象：

```yaml
spec:
  ttl: 24h
```

删除 `Commit` 对象不会删除已经推送到镜像仓库中的镜像。

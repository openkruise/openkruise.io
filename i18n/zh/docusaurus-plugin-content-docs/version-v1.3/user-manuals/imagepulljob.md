---
title: ImagePullJob
---

NodeImage 和 ImagePullJob 是从 Kruise v0.8.0 版本开始提供的 CRD。

Kruise 会自动为每个 Node 创建一个 NodeImage，它包含了哪些镜像需要在这个 Node 上做预热。

用户能创建 ImagePullJob 对象，来指定一个镜像要在哪些 Node 上做预热。

![Image Pulling](/img/docs/user-manuals/imagepulling.png)

注意，NodeImage 是一个**偏底层的 API**，一般只在你要明确在某一个节点上做一次预热的时候才使用，否则你都应该**使用 ImagePullJob 来指定某个镜像在一批节点上做预热**。

## ImagePullJob (high-level)

ImagePullJob 是一个 **namespaced-scope** 的资源。

API 定义: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
metadata:
  name: job-with-always
spec:
  image: nginx:1.9.1   # [required] 完整的镜像名 name:tag
  parallelism: 10      # [optional] 最大并发拉取的节点梳理, 默认为 1
  selector:            # [optional] 指定节点的 名字列表 或 标签选择器 (只能设置其中一种)
    names:
    - node-1
    - node-2
    matchLabels:
      node-type: xxx
  # podSelector:         # [optional] pod label 选择器来在这些 pod 所在节点上拉取镜像, 与 selector 不能同时设置.
  #  pod-label: xxx
  completionPolicy:
    type: Always                  # [optional] 默认为 Always
    activeDeadlineSeconds: 1200   # [optional] 无默认值, 只对 Alway 类型生效
    ttlSecondsAfterFinished: 300  # [optional] 无默认值, 只对 Alway 类型生效
  pullPolicy:                     # [optional] 默认 backoffLimit=3, timeoutSeconds=600
    backoffLimit: 3
    timeoutSeconds: 300
```

你可以在 `selector` 字段中指定节点的 名字列表 或 标签选择器 **(只能设置其中一种)**，如果没有设置 `selector` 则会选择所有节点做预热。

或者你可以配置 `podSelector` 来在这些 pod 所在节点上拉取镜像，`podSelector` 与 `selector` 不能同时设置。

同时，ImagePullJob 有两种 completionPolicy 类型:

- `Always` 表示这个 job 是一次性预热，不管成功、失败都会结束
    - `activeDeadlineSeconds`: 整个 job 的 deadline 结束时间
    - `ttlSecondsAfterFinished`: 结束后超过这个时间，自动清理删除 job
- `Never` 表示这个 job 是长期运行、不会结束，并且会每天都会在匹配的节点上重新预热一次指定的镜像

### 配置 secrets

如果这个镜像来自一个私有仓库，你可能需要配置一些 secret：

```yaml
# ...
spec:
  pullSecrets:
  - secret-name1
  - secret-name2
```

因为 ImagePullJob 是一种 namespaced-scope 资源，这些 secret 必须存在 ImagePullJob 所在的 namespace 中。
然后你只需要在 `pullSecrets` 字段中写上这些 secret 的名字即可。

## NodeImage (low-level)

NodeImage 是一个 **cluster-scope** 的资源。

API 定义: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go

当 Kruise 被安装后，nodeimage-controller 会自动为每个 Node 创建一个同名的 NodeImage。
并且当 Node 发生伸缩时，nodeimage-controller 也会对应的创建或删除 NodeImage。

除此之外，nodeimage-controller 也会将 Node 上的 labels 标签持续同步到 NodeImage 上面，因此对应的 NodeImage 与 Node 拥有相同的名字和标签。
用户可以用 Node 名字来查询一个 NodeImage，或者用 Node labels 做 selector 来查询一批 NodeImage。

通常来说一个空的 NodeImage 如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: NodeImage
metadata:
  labels:
    kubernetes.io/arch: amd64
    kubernetes.io/os: linux
    # ...
  name: node-xxx
  # ...
spec: {}
status:
  desired: 0
  failed: 0
  pulling: 0
  succeeded: 0
```

如果你希望在这个节点上拉去一个 `ubuntu:latest` 镜像，你可以有两种方式

1. 执行 `kubectl edit nodeimage node-xxx` 并将以下写入其中（忽略注释）:

```yaml
# ...
spec:
  images:
    ubuntu:  # 镜像 name
      tags:
      - tag: latest  # 镜像 tag
        pullPolicy:
          ttlSecondsAfterFinished: 300  # [required] 拉取完成（成功或失败）超过 300s 后，将这个任务从 NodeImage 中清除
          timeoutSeconds: 600           # [optional] 每一次拉取的超时时间, 默认为 600
          backoffLimit: 3               # [optional] 拉取的重试次数，默认为 3
          activeDeadlineSeconds: 1200   # [optional] 整个任务的超时时间，无默认值
```

2. `kubectl patch nodeimage node-xxx --type=merge -p '{"spec":{"images":{"ubuntu":{"tags":[{"tag":"latest","pullPolicy":{"ttlSecondsAfterFinished":300}}]}}}}'`

你可以执行 `kubectl get nodeimage node-xxx -o yaml`，从 status 中看到拉取进度以及结果，并且你会发现拉取完成 600s 后任务会被清除。

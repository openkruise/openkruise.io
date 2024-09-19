---
title: ImagePullJob
---

NodeImage 和 ImagePullJob 是从 Kruise v0.8.0 版本开始提供的 CRD。

Kruise 会自动为每个 Node 创建一个 NodeImage，它包含了哪些镜像需要在这个 Node 上做预热。

用户能创建 ImagePullJob 对象，来指定一个镜像要在哪些 Node 上做预热。

![Image Pulling](/img/docs/user-manuals/imagepulling.png)

注意，NodeImage 是一个**偏底层的 API**，一般只在你要明确在某一个节点上做一次预热的时候才使用，否则你都应该**使用 ImagePullJob 来指定某个镜像在一批节点上做预热**。

## Feature-gate
**从kruise v1.5.0**版本开始，ImagePullJob/ImageListPullJob 功能默认关闭，以降低默认安装的权限，你可以通过 feature-gate *ImagePullJobGate* 来开启。

```bash
$ helm install/upgrade kruise https://... --set featureGates="ImagePullJobGate=true"
```

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
# podSelector:         # [optional] 通过 podSelector 匹配Pod，在这些 Pod 所在节点上拉取镜像, 与 selector 不能同时设置.
#   matchLabels:
#     pod-label: xxx
#   matchExpressions:
#   - key: pod-label
#      operator: In
#        values:
#        - xxx
  completionPolicy:
    type: Always                  # [optional] 默认为 Always
    activeDeadlineSeconds: 1200   # [optional] 无默认值, 只对 Always 类型生效
    ttlSecondsAfterFinished: 300  # [optional] 无默认值, 只对 Always 类型生效
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

此外，你也可以使用 **免密插件方式** 来认证私有仓库。

### 支持免密插件
**FEATURE STATE:** Kruise v1.7.0

从 Kubernetes v1.20 开始，kubelet 可以使用 exec 插件动态获得针对某容器镜像库的凭据，参考[社区文档](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。

OpenKruise也支持类似的方式来进行镜像预热，步骤如下：

#### a. AWS上面支持免密插件
1. 节点上面安装 [AWS](https://github.com/awslabs/amazon-ecr-credential-helper) 的凭据提供插件。
2. 创建 credential-provider-config Configmap：
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: credential-provider-config
  namespace: kruise-system
data:
  CredentialProviderPlugin.yaml: |
    apiVersion: kubelet.config.k8s.io/v1
    kind: CredentialProviderConfig
    providers:
    # 需与免密拉取插件的名称相同
    - name: ecr-credential-provider
      matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.com.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
      defaultCacheDuration: "12h"
      apiVersion: credentialprovider.kubelet.k8s.io/v1
      env:
      - name: AWS_PROFILE
        value: temp
```

3. 基于 [AWS共享凭证文件方式](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html) 安装 OpenKruise：

如果 AWS Worker 机器已经包含凭证文件($HOME/.aws/credentials)，你可以直接将 $HOME/.aws 目录配置到 kruise-daemon 上进行认证，如下：

```
helm install kruise https://... --set installation.createNamespace=false --set daemon.credentialProvider.enable=true --set daemon.credentialProvider.hostPath=/etc/eks/image-credential-provider --set daemon.credentialProvider.configmap=credential-provider-config --set daemon.credentialProvider.awsCredentialsDir=/root/.aws
```

4. 创建 ImagePullJob，通过上述插件进行镜像仓库认证，完成镜像预热。

**说明：** 如果其它的云厂商（比如：腾讯云）有类似的机制，应该也是可以工作的。如果你有类似的场景，请联系我们。

### Attach metadata into cri interface

**FEATURE STATE:** Kruise v1.4.0

当 Kubelet 创建 Pod 时，Kubelet 将会 attach metadata 到 container runtime cri 接口。OpenKruise 镜像预热同样支持类似的能力，如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
spec:
  ...
  image: nginx:1.9.1
  sandboxConfig:
    annotations:
      io.kubernetes.image.metrics.tags: "cluster=cn-shanghai"
    labels:
      io.kubernetes.image.app: "foo"
```

### 镜像拉取支持 'Always' 策略

**FEATURE STATE:** Kruise v1.6.0

- **spec.imagePullPolicy=Always** 表示 kruise 每次都会尝试拉取最新的镜像，哪怕镜像名字没有改变
- **spec.imagePullPolicy=IfNotPresent** 表示 kruise 只有镜像在Node机器不存在时，才会拉取镜像
- 默认策略是 IfNotPresent

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
spec:
  ...
  image: nginx:1.9.1
  imagePullPolicy: Always | IfNotPresent
```

## ImageListPullJob

**FEATURE STATE:** Kruise v1.5.0

ImagePullJob 仅仅能支持单个镜像的预热，为了满足多个镜像的预热需求，新增加 CRD ImageListPullJob 来满足多个镜像的预热，除了 images 它的大部分字段与 ImagePullJob 相同，如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImageListPullJob
metadata:
  name: job-with-always
spec:
  images:
  - nginx:1.9.1   # [required] image to pull
  - busybox:1.29.2
  - ...
  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1
  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)
    names:
    - node-1
    - node-2
    matchLabels:
      node-type: xxx
  completionPolicy:
    type: Always                  # [optional] defaults to Always
    activeDeadlineSeconds: 1200   # [optional] no default, only work for Always type
    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Always type
  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600
    backoffLimit: 3
    timeoutSeconds: 300
```

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

## FAQ
1. 如果 ImagePullJob 失败了：
```
% kubectl get imagepulljob

NAME              TOTAL   ACTIVE   SUCCEED   FAILED   AGE     MESSAGE
job-with-always   4       0        0         4        9m49s   job has completed
```
2. 你可以通过 imagePullJob.status 知道失败的 Node 名字：
```
% kubectl get imagepulljob job-with-always -oyaml

apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
status:
  active: 0
  completionTime: "2024-08-09T10:06:26Z"
  desired: 4
  failed: 4
  failedNodes:
  - cn-hangzhou.x.125
  - cn-hangzhou.x.126
  - cn-hangzhou.x.127
  - cn-hangzhou.x.128
  message: job has completed
  startTime: "2024-08-09T10:03:52Z"
  succeeded: 0
```
3. 通过 NodeImage 你可以了解到具体的失败原因：
```
% kubectl get nodeimage cn-hangzhou.x.125 -oyaml

apiVersion: apps.kruise.io/v1alpha1
kind: NodeImage
status:
  desired: 1
  failed: 1
  imageStatuses:
    nginx:
      tags:
      - completionTime: "2024-08-09T10:06:22Z"
        message: 'Failed to pull image reference "nginx:1.9.1": rpc error: code =
          DeadlineExceeded desc = failed to pull and unpack image "docker.io/library/nginx:1.9.1":
          failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://production.cloudflare.docker.com/registry-v2/docker/registry/v2/blobs/sha256/c5/c5dd085dcc7c78a296c80b87916831fd19a3f447d94b99580ccd19a052720211/data?verify=1723200943-x6RCoD1a2P3aEdh1%!B(MISSING)XcQSFe2h%!B(MISSING)U%!D(MISSING)":
          dial tcp 10.1.1.1:443: i/o timeout'
        phase: Failed
        startTime: "2024-08-09T10:03:52Z"
        tag: 1.9.1
  pulling: 0
  succeeded: 0
```

---
title: 原地升级
---

原地升级是 OpenKruise 提供的核心功能之一。

目前支持原地升级的 Workload：

- [CloneSet](/docs/user-manuals/cloneset)
- [Advanced StatefulSet](/docs/user-manuals/advancedstatefulset)
- [Advanced DaemonSet](/docs/user-manuals/advanceddaemonset)
- [SidecarSet](/docs/user-manuals/advanceddaemonset)

目前 `CloneSet`、`Advanced StatefulSet`、`Advanced DaemonSet` 是复用的同一个代码包 [`./pkg/util/inplaceupdate`](https://github.com/openkruise/kruise/tree/master/pkg/util/inplaceupdate) 并且有类似的原地升级行为。在本文中，我们会介绍它的用法和工作流程。

注意，`SidecarSet` 的原地升级流程和其他 workloads 不太一样，比如它在升级 Pod 之前并不会把 Pod 设置为 not-ready 状态。因此，下文中讨论的内容并不完全适用于 `SidecarSet`。

## 什么是原地升级

当我们要升级一个存量 Pod 中的镜像时，这是 *重建升级* 和 *原地升级* 的区别：

![alt](/img/docs/core-concepts/inplace-update-comparation.png)

**重建升级**时我们要删除旧 Pod、创建新 Pod：

- Pod 名字和 uid 发生变化，因为它们是完全不同的两个 Pod 对象（比如 Deployment 升级）
- Pod 名字可能不变、但 uid 变化，因为它们是不同的 Pod 对象，只是复用了同一个名字（比如 StatefulSet 升级）
- Pod 所在 Node 名字发生变化，因为新 Pod 很大可能性是不会调度到之前所在的 Node 节点的
- Pod IP 发生变化，因为新 Pod 很大可能性是不会被分配到之前的 IP 地址的

但是对于**原地升级**，我们仍然复用同一个 Pod 对象，只是修改它里面的字段。因此：

- 可以避免如 *调度*、*分配 IP*、*分配、挂载盘* 等额外的操作和代价
- 更快的镜像拉取，因为开源复用已有旧镜像的大部分 layer 层，只需要拉取新镜像变化的一些 layer
- 当一个容器在原地升级时，Pod 中的其他容器不会受到影响，仍然维持运行

## 理解 *InPlaceIfPossible*

这种 Kruise workload 的升级类型名为 `InPlaceIfPossible`，它意味着 Kruise 会尽量对 Pod 采取原地升级，如果不能则退化到重建升级。

以下的改动会被允许执行原地升级：

1. 更新 workload 中的 `spec.template.metadata.*`，比如 labels/annotations，Kruise 只会将 metadata 中的改动更新到存量 Pod 上。
2. 更新 workload 中的 `spec.template.spec.containers[x].image`，Kruise 会原地升级 Pod 中这些容器的镜像，而不会重建整个 Pod。
3. **从 Kruise v1.0 版本开始（包括 v1.0 alpha/beta）**，更新 `spec.template.metadata.labels/annotations` 并且 container 中有配置 env from 这些改动的 labels/anntations，Kruise 会原地升级这些容器来生效新的 env 值。

否则，其他字段的改动，比如 `spec.template.spec.containers[x].env` 或 `spec.template.spec.containers[x].resources`，都是会回退为重建升级。

例如对下述 CloneSet YAML：

1. 修改 `app-image:v1` 镜像，会触发原地升级。
2. 修改 annotations 中 `app-config` 的 value 内容，会触发原地升级（参考下文[使用要求](#使用要求)）。
3. 同时修改上述两个字段，会在原地升级中同时更新镜像和环境变量。
4. 直接修改 env 中 `APP_NAME` 的 value 内容或者新增 env 等其他操作，会触发 Pod 重建升级。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  ...
spec:
  replicas: 1
  template:
    metadata:
      annotations:
        app-config: "... the real env value ..."
    spec:
      containers:
      - name: app
        image: app-image:v1
        env:
        - name: APP_CONFIG
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['app-config']
        - name: APP_NAME
          value: xxx
  updateStrategy:
    type: InPlaceIfPossible
```

## 工作流程总览

可以在下图中看到原地升级的整体工作流程（*你可能需要右击在新标签页中打开*）：

![alt](/img/docs/core-concepts/inplace-update-workflow.png)

## 原地升级 - 多容器升级顺序控制

**FEATURE STATE:** Kruise v1.1.0

当你同时原地升级多个具有不同[启动顺序](/docs/user-manuals/containerlaunchpriority)的容器时，Kruise 会按照相同的权重顺序来逐个升级这些容器。

- 对于不存在容器启动顺序的 Pod，在多容器原地升级时没有顺序保证。
- 对于存在容器启动顺序的 Pod：
  - 如果本次原地升级的多个容器具有不同的启动顺序，会按启动顺序来控制原地升级的先后顺序。
  - 如果本地原地升级的多个容器的启动顺序相同，则原地升级时没有顺序保证。

例如，一个包含两个不同启动顺序容器的 CloneSet 如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  ...
spec:
  replicas: 1
  template:
    metadata:
      annotations:
        app-config: "... config v1 ..."
    spec:
      containers:
      - name: sidecar
        env:
        - name: KRUISE_CONTAINER_PRIORITY
          value: "10"
        - name: APP_CONFIG
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['app-config']
      - name: main
        image: main-image:v1
  updateStrategy:
    type: InPlaceIfPossible
```

当我们更新 CloneSet，将其中 `app-config` annotation 和 main 容器的镜像修改后，意味着 sidecar 与 main 容器都需要被更新，Kruise 会先原地升级 Pod 来将其中 sidecar 容器重建来生效新的 env from annotation。

此时，我们可以在已升级的 Pod 中看到 `apps.kruise.io/inplace-update-state` annotation 和它的值：

```json
{
  "revision": "{CLONESET_NAME}-{HASH}",         // 本次原地升级的目标 revision 名字
  "updateTimestamp": "2022-03-22T09:06:55Z",    // 整个原地升级的初次开始时间
  "nextContainerImages": {"main": "main-image:v2"},                // 后续批次中还需要升级的容器镜像
  // "nextContainerRefMetadata": {...},                            // 后续批次中还需要升级的容器 env from labels/annotations
  "preCheckBeforeNext": {"containersRequiredReady": ["sidecar"]},  // pre-check 检查项，符合要求后才能原地升级后续批次的容器
  "containerBatchesRecord":[
    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]}  // 已更新的首个批次容器（它仅仅表明容器的 spec 已经被更新，例如 pod.spec.containers 中的 image 或是 labels/annotations，但并不代表 node 上真实的容器已经升级完成了）
  ]
}
```

当 sidecar 容器升级成功之后，Kruise 会接着再升级 main 容器。最终你会在 Pod 中看到如下的 `apps.kruise.io/inplace-update-state` annotation：

```json
{
  "revision": "{CLONESET_NAME}-{HASH}",
  "updateTimestamp": "2022-03-22T09:06:55Z",
  "lastContainerStatuses":{"main":{"imageID":"THE IMAGE ID OF OLD MAIN CONTAINER"}},
  "containerBatchesRecord":[
    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]},
    {"timestamp":"2022-03-22T09:07:20Z","containers":["main"]}
  ]
}
```

通常来说，用户只需要关注其中 `containerBatchesRecord` 来确保容器是被分为多批升级的。如果这个 Pod 在原地升级的过程中卡住了，你可以检查 `nextContainerImages/nextContainerRefMetadata` 字段，以及 `preCheckBeforeNext` 中前一次升级的容器是否已经升级成功并 ready 了。

## 使用要求

如果要使用 env from metadata 原地升级能力，你需要在安装或升级 Kruise chart 的时候打开 `kruise-daemon`（默认打开）和 `InPlaceUpdateEnvFromMetadata` 两个 feature-gate。

注意，如果你有一些 virtual-kubelet 类型的 Node 节点，kruise-daemon 可能是无法在上面运行的，因此也无法使用 env from metadata 原地升级。

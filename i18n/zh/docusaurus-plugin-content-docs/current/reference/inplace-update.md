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

![alt](/img/docs/reference/inplace-update-comparation.png)

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

## 工作流程总览

可以在下图中看到原地升级的整体工作流程（*你可能需要右击在新标签页中打开*）：

![alt](/img/docs/reference/inplace-update-workflow.png)

## 使用要求

如果要使用 env from metadata 原地升级能力，你需要在安装或升级 Kruise chart 的时候打开 `kruise-daemon`（默认打开）和 `InPlaceUpdateEnvFromMetadata` 两个 feature-gate。

注意，如果你有一些 virtual-kubelet 类型的 Node 节点，kruise-daemon 可能是无法在上面运行的，因此也无法使用 env from metadata 原地升级。

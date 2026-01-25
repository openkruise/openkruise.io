---
title: OpenKruise 简介
slug: /
---

# OpenKruise 是什么

欢迎来到 OpenKruise 的世界！

OpenKruise 是一个基于 Kubernetes 的扩展套件，主要聚焦于云原生应用的自动化，比如*部署、发布、运维以及可用性防护*。

OpenKruise 提供的绝大部分能力都是基于 CRD 扩展来定义，它们不存在于任何外部依赖，可以运行在任意纯净的 Kubernetes 集群中。

## 核心能力

- **高级工作负载**

    OpenKruise 包含了一系列增强版本的 Workloads（工作负载），比如 CloneSet、Advanced StatefulSet、Advanced DaemonSet、BroadcastJob、SidecarSet 等。

    它们不仅支持类似于 Kubernetes 原生 Workloads 的基础功能，还提供了如原地升级、可配置的扩缩容/发布策略、并发操作等。

    其中，原地升级是一种升级应用容器镜像甚至环境变量的全新方式。它只会用新的镜像重建 Pod 中的特定容器，整个 Pod 以及其中的其他容器都不会被影响。因此它带来了更快的发布速度，以及避免了对其他 Scheduler、CNI、CSI 等组件的负面影响。

- **高级应用运维操作**

    OpenKruise 还提供了高级运维功能，帮助您更高效、更具弹性且更节省成本地管理应用程序。

    您可以使用 ImagePullJob 在任意节点上预拉取镜像，甚至可以在不重建 Pod 的情况下，重启正在运行的 Pod 中的一个或多个容器。此外，您还可以约束无状态工作负载在不同域（例如可用区、节点池或 CPU 架构）中的分布，从而赋予单个工作负载跨多域部署和弹性伸缩的能力。

- **高可用性防护**

    OpenKruise 在为应用的高可用性防护方面也做出了很多努力。

    目前它可以保护你的 Kubernetes 资源不受级联删除机制的干扰，包括 CRD、Namespace、以及几乎全部的 Workloads 类型资源。

    相比于 Kubernetes 原生的 PDB 只提供针对 Pod Eviction 的防护，PodUnavailableBudget 能够防护 Pod Deletion、Eviction、Update 等许多种 voluntary disruption 场景。

## 关系对比

### OpenKruise vs. Kubernetes

简单来说，OpenKruise 对于 Kubernetes 是一个辅助扩展角色。

Kubernetes 自身已经提供了一些应用部署管理的功能，比如一些[基础工作负载](https://kubernetes.io/docs/concepts/workloads/)。
但对于大规模应用与集群的场景，这些基础功能是远远不够的。

OpenKruise 可以被很容易地安装到任意 Kubernetes 集群中，它弥补了 Kubernetes 在应用部署、升级、防护、运维 等领域的不足。

### OpenKruise vs. Platform-as-a-Service (PaaS)

OpenKruise **不是**一个 PaaS，但它提供了 PaaS 所需的**核心构建模块**。

PaaS 平台可以通过使用 OpenKruise 提供的这些扩展功能，来使得应用部署、管理流程更加强大与高效。

## What's Next

接下来，我们推荐你：

- 开始 [安装使用 OpenKruise](./docs/installation).
- 了解 OpenKruise 的 [系统架构](./docs/core-concepts/architecture).

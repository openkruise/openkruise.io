---
slug: workload-classification-guidance
title: Kruise Workload Classification Guidance
authors: [Fei-Guo, FillZpp]
tags: [workload]
---

Kubernetes 目前并没有为一个应用应该使用哪个控制器提供明确的指引，这尤其不利于用户理解应用和 workload 的关系。
比如说，用户通常知道什么时候应该用 `Job/CronJob` 或者 `DaemonSet`，这些 workload 的概念是非常明确的 -- 前者是为了任务类型的应用部署、后者则是面向需要分发到每个 node 上的长期运行 Pod。

但是另一些 workload 比如 `Deployment` 和 `StatefulSet` 之间的界限是比较模糊的。一个通过 `Deployment` 部署的应用也可以通过 `StatefulSet` 部署，`StatefulSet` 对 Pod 的 `OrderedReady` 策略并非是强制的。而且，随着 Kubernetes 社区中越来越多的自定义 controllers/operators 变的成熟，用户就越难以为自己的应用找到一个最合适的 workload 来管理，尤其是一些控制器的功能上都存在重合部分。

Kruise 尝试在两个方面来缓解这个问题：

- 在 Kruise 中谨慎设计新的控制器，避免不必要的功能重复给用户来带困扰
- 为所有提供出来的 workload 控制器创建一个分类机制，方便用户更容易理解它们的使用场景。我们下面会详细描述一下，首先是 controller 命名上的规范：

### Controller 命名惯例

一个易于理解的 controller 名字对于用户选用是非常有帮助的。经过对内外部不少 Kubernetes 用户的咨询，我们决定在 Kruise 中实行以下的命名惯例（这些惯例与目前上游的 controller 命名并不冲突）：

- **Set** 后缀：这类 controller 会直接操作和管理 Pod，比如 `CloneSet`, `ReplicaSet`, `SidecarSet` 等。它们提供了 Pod 维度的多种部署、发布策略。
- **Deployment** 后缀：这类 controller 不会直接地操作 Pod，它们通过操作一个或多个 **Set** 类型的 workload 来间接管理 Pod，比如 `Deployment` 管理 `ReplicaSet` 来提供一些额外的滚动策略，以及 `UnitedDeployment` 支持管理多个 `StatefulSet`/`AdvancedStatefulSet` 来将应用部署到不同的可用区。
- **Job** 后缀：这类 controller 主要管理短期执行的任务，比如 `BroadcastJob` 支持将任务类型的 Pod 分发到集群中所有 Node 上。

**Set**, **Deployment** 和 **Job** 都是被 Kubernetes 社区广泛接受的概念，在 Kruise 中给他们定义了明确的扩展规范。

我们能否对有相同后缀的 controller 做进一步区分呢？通常来说前缀前面的名字应该是让人能一目了然的，不过也有一些情况下很难一语描述 controller 自身的行为。可以看一下 `StatefulSet` 来源的这个 [issue](https://github.com/kubernetes/kubernetes/issues/27430)，社区用了四个月的时间才决定用 `StatefulSet` 这个名字代替过去的 `PetSet`，尽管新名字也让人看起来比较困惑。

这个例子说明了有时候一个精心计划的名字也不一定有助于标识这个 controller。因此，Kruise 并不打算解决这个问题，而是通过以下的标准来帮助对 **Set** 类型的 controller 分类。

### 固定 Pod 名字

`StatefulSet` 的一个独有的特性是支持一致的 Pod 网络和存储标识，这在本质上是通过固定 Pod 名字来实现的。Pod 名字可以用于标识网络和存储，因为它是 DNS record 的一部分，并且可以作为 PVC 的名字。既然 `StatefulSet` 下的 Pod 都是通过同一个模板创建出来的，为什么需要这个特性呢？一个常见的例子就是用于管理分布式一致性服务，比如 etcd 或 Zookeeper。这类应用需要知道集群构成的所有成员，并且在重建、发布后都需要保持原有的网络标识和磁盘数据。而像 `ReplicaSet`, `DaemonSet` 这类的控制器是面向无状态的，它们并不会新建 Pod 时并不会复用过去的 Pod 名字。

为了支持有状态，控制器的实现上会比较固定。`StatefulSet` 依赖于给每个 Pod 名字中加入一个序号，在扩缩容和滚动升级的时候都需要按照这个序号的顺序来执行。但这样一来，`StatefulSet` 也就无法做到另一些增强功能，比如：

- 当缩小 replicas 时选择特定的 Pod 来删除，这个功能在跨多个可用区部署的时候会用到。
- 把一个存量的 Pod 接管到另一个 workload 下面（比如 `StatefulSet`）

我们发现很多云原生应用并不需要这个有状态的特性来固定 Pod 名字，而 `StatefulSet` 又很难在其他方面做扩展。为了解决这个问题，Kruise 发布了一个新的控制器 `CloneSet` 来管理无状态应用，`CloneSet` 提供了对 PVC 模板的支持，并且为应用部署提供了丰富的可选策略。以下表中比较了 Advanced StatefulSet 和 CloneSet 一些方面的能力：

| Features   |     Advanced StatefulSet      |  CloneSet |
|----------|:-------------:|:------:|
| PVC | Yes | Yes |
| Pod name | Ordered | Random |
| Inplace upgrade | Yes | Yes |
| Max unavailable | Yes | Yes |
| Selective deletion | No | Yes |
| Selective upgrade | No | Yes |
| Change Pod ownership | No | Yes |

目前对于 Kruise 用户的建议是，如果你的应用需要固定的 Pod 名字（网络和存储标识），你可以使用 `Advanced StatefulSet`，否则 `CloneSet` 应该是 **Set** 类型控制器的首选。

### 总结

Kruise 会为各种 workload 选择明确的名字，本文目标是能为 Kruise 用户提供选择正确 controller 部署应用的指引。
希望对你有帮助！

---
title: ResourceDistribution
---

在对 Secret、ConfigMap 等 namespace-scoped 资源进行跨 namespace 分发及同步的场景中，原生 kubernetes 目前只支持用户 one-by-one 地进行手动分发与同步，十分地不方便。

典型的案例有：
- 当用户需要使用 SidecarSet 的 imagePullSecrets 能力时，要先重复地在相关 namespaces 中创建对应的 Secret，并且需要确保这些 Secret 配置的正确性和一致性。
- 当用户想要采用 ConfigMap 来配置一些**通用**的环境变量时，往往需要在多个 namespaces 做 ConfigMap 的下发，并且后续的修改往往也要求多 namespaces 之间保持同步。

因此，面对这些需要跨 namespaces 进行资源分发和**多次同步**的场景，我们期望一种更便捷的分发和同步工具来自动化地去做这件事，为此我们设计并实现了一个新的CRD --- **ResourceDistribution**。

ResourceDistribution 目前支持 **Secret** 和 **ConfigMap** 两类资源的分发和同步。

## API 说明
ResourceDistribution是一类 **cluster-scoped** 的 CRD，其主要由 **`resource`** 和 **`targets`** 两个字段构成，其中 **`resource`** 字段用于描述用户所要分发的资源，**`targets`** 字段用于描述用户所要分发的目标命名空间。
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
  	... ...
  targets:
  	... ...
```

### Resource 字段说明
**`resource`** 字段必须是一个完整、正确的资源描述。

一个配置正确的 **`resource`** 例子如下所示：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: game-demo
    data:
      game.properties: |
        enemy.types=aliens,monsters
        player.maximum-lives=5
      player_initial_lives: "3"
      ui_properties_file_name: user-interface.properties
      user-interface.properties: |
        color.good=purple
        color.bad=yellow
        allow.textmode=true
  targets:
    ... ...
```
Tips: 用户可以先在本地某个命名空间中创建相应资源并进行测试，确认资源配置正确后再拷贝过来。

### Target 字段说明
**`targets`** 字段目前支持四种规则来描述用户所要分发的目标命名空间，包括 `allNamespaces`、`includedNamespaces`、`namespaceLabelSelector` 以及 `excludedNamespaces`：
- `allNamespaces`: bool值，如果为`true`，则分发至所有命名空间；
- `includedNamespaces`: 通过 Name 来匹配目标命名空间；
- `namespaceLabelSelector`：通过 LabelSelector 来匹配目标命名空间；
- `excludedNamespaces`: 通过 Name 来排除某些不想分发的命名空间；

**目标命名空间的计算规则：**
1. 初始化目标命名空间 *T* = ∅；
2. 如果用户设置了`allNamespaces=true`，*T* 则会匹配所有命名空间；
3. 将`includedNamespaces`中列出的命名空间加入 *T*；
4. 将与`namespaceLabelSelector`匹配的命名空间加入 *T*；
5. 将`excludedNamespaces`中列出的命名空间从 *T* 中剔除；

**`allNamespaces`、`includedNamespaces`、`namespaceLabelSelector` 之间是 或(OR) 的关系，而`excludedNamespaces`一旦被配置，则会显式地排除掉这些命名空间。另外，targets还将自动忽略kube-system 和 kube-public 两个命名空间。**

一个配置正确的targets字段如下所示：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
  	... ...
  targets:
    includedNamespaces:
      list:
      - name: ns-1
      - name: ns-4
    namespaceLabelSelector:
      matchLabels:
        group: test
    excludedNamespaces:
    	list:
      - name: ns-3
```
上例中，该 ResourceDistribution 的目标命名空间一定会包含ns-1和ns-4，并且Labels满足`namespaceLabelSelector`的命名空间也会被包含进目标命名空间，但是，即使ns-3即使满足`namespaceLabelSelector`也不会被包含，因为它已经在`excludedNamespaces`中被显式地排除了。

## 完整用例
### 分发资源
当用户将 ResourceDistribution 的 resource 和 targets 两个字段正确配置，并创建这个 ResourceDistribution 资源后，相应的 Controller 会执行资源分发逻辑，这一资源会自动地在各个目标命名空间中创建。一个完整的用例如下所示：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: game-demo
    data:
      game.properties: |
        enemy.types=aliens,monsters
        player.maximum-lives=5
      player_initial_lives: "3"
      ui_properties_file_name: user-interface.properties
      user-interface.properties: |
        color.good=purple
        color.bad=yellow
        allow.textmode=true
  targets:
    excludedNamespaces:
      list:
      - name: ns-3
    includedNamespaces:
      list:
      - name: ns-1
      - name: ns-4
    namespaceLabelSelector:
      matchLabels:
        group: test
```

### 分发状态跟踪
当然，资源分发并不总是成功的，在分发的过程中可能会遇到各种各样的错误导致分发失败。为此，我们在ResourceDistribution.Status字段中记录了资源分发的一些状态，以便用户对其进行追踪。
首先，Status记录了目标命名空间总数(Desired)、成功分发的目标命名空间数量(Succeeded)、以及失败的目标命名空间数量(Failed)：
```yaml
status:
  Desired:                 3
  Failed:                  1
  Succeeded:               2
```

为了进一步方便用户了解分发失败的原因及地点（命名空间），ResourceDistribution 还对分发错误类型进行了归纳整理，总共分为了六类，并记录在status.conditions之中：
- 四类 condition 记录了操作资源时出现失败的相关原因，即记录资源的 Get、Create、 Update 和 Delete 四类操作出现的错误信息以及对应的失败命名空间；
- 一类 condition 记录了命名空间不存在的错误；
- 一类 condition 记录了资源冲突的情况，即目标命名空间中已经存在Name、Kind、APIVersion都相同的资源，且该资源不是该ResourceDistribution分发，则会发生资源冲突，相应的命名空间会被记录下来。
```yaml
Status:
  Conditions:
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  GetResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  CreateResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  UpdateResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  DeleteResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  ConflictOccurred
    Failed Namespace:
      ns-1
      ns-4
    Last Transition Time:  2021-09-06T08:45:08Z
    Reason:                namespace not found
    Status:                True
    Type:                  NamespaceNotExists
```
上述例子遇到目标命名空间 ns-1 和 ns-4 不存在的错误，相应的错误类型和命名空间被记录了下来。

### 更新并同步资源
ResourceDistribution 允许用户更新resource字段，即更新资源，并且会自动地对所有目标命名空间中的资源进行同步更新。
每一次更新资源时，ResourceDistribution 都会计算新版本资源的哈希值，并记录到资源的Annotations之中，当 ResourceDistribution 发现新版本的资源与目前资源的哈希值不同时，才会对资源进行更新。
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
  annotations:  
    kruise.io/resourcedistribution.resource.from: sample
    kruise.io/resourcedistribution.resource.distributed.timestamp: 2021-09-06 08:44:52.7861421 +0000 UTC m=+12896.810364601
    kruise.io/resourcedistribution.resource.hashcode: 0821a13321b2c76b5bd63341a0d97fb46bfdbb2f914e2ad6b613d10632fa4b63
... ...
```

**特别地，我们非常不建议用户绕过 ResourceDistribution 直接对资源进行修改，除非用户知道自己在做什么**：
- 直接修改资源后，资源的哈希值不会被自动计算，因此，下次 resource字段被修改后，**ResourceDistribution 可能将用户对这些资源的直接修改覆盖掉**；
- ResourceDistribution 通过 kruise.io/resourcedistribution.resource.from 来判断资源是否由该 ResourceDistribution 分发，如果该 Annotation 被修改或删除，则被修改的资源会被 ResourceDistribution 当成冲突资源，并且无法通过  ResourceDistribution 进行同步更新。

### 级联删除
**ResourceDistribution 通过 OwnerReference 来管控所分发的资源。因此，需要特别注意，当 ResourceDistribution 被删除时，其所分发的所有资源也会被删除。**

## Kustomize ResourceDistribution Generator

ResourceDistribution Generator 为 kustomize 的第三方插件，类似于 kustomize 的 configmap generator 和 secret generator，使用该插件可以完成读取文件作为 data 内容来创建 ResourceDistribution 的工作。具体内容参考[此页面](/zh/docs/next/cli-tool/kustomize-plugin)
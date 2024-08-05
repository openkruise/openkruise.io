---
title: SidecarSet
---

这个控制器支持通过 admission webhook 来自动为集群中创建的符合条件的 Pod 注入 sidecar 容器。
这个注入过程和 [istio](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/)
的自动注入方式很类似。
除了在 Pod 创建时候注入外，SidecarSet 还提供了为运行时 Pod 原地升级其中已经注入的 sidecar 容器镜像的能力。

简单来说，SidecarSet 将 sidecar 容器的定义和生命周期与业务容器解耦。
它主要用于管理无状态的 sidecar 容器，比如监控、日志等 agent。

## 范例

### 创建 SidecarSet

如下的 sidecarset.yaml 定义了一个 SidecarSet，其中包括了一个名为 sidecar1 的 sidecar 容器：
```yaml
# sidecarset.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  selector:
    matchLabels:
      app: nginx
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 1
  containers:
  - name: sidecar1
    image: centos:6.7
    command: ["sleep", "999d"] # do nothing at all
    volumeMounts:
    - name: log-volume
      mountPath: /var/log
  volumes: # this field will be merged into pod.spec.volumes
  - name: log-volume
    emptyDir: {}
```
创建这个 YAML:
```bash
kubectl apply -f sidecarset.yaml
```

### 创建 Pod
定义一个匹配 SidecarSet selector 的 Pod：
```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: nginx # matches the SidecarSet's selector
  name: test-pod
spec:
  containers:
  - name: app
    image: nginx:1.15.1
```
创建这个 Pod，你会发现其中被注入了 sidecar1 容器：
```bash
$ kubectl get pod
NAME       READY   STATUS    RESTARTS   AGE
test-pod   2/2     Running   0          118s
```
此时，SidecarSet status 被更新为：
```bash
$ kubectl get sidecarset test-sidecarset -o yaml | grep -A4 status
status:
  matchedPods: 1
  observedGeneration: 1
  readyPods: 1
  updatedPods: 1
```
### 更新sidecar container Image
更新sidecarSet中sidecar container的image=centos:7
```bash
$ kubectl edit sidecarsets test-sidecarset

# sidecarset.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  containers:
    - name: sidecar1
      image: centos:7
```
此时，发现pod中的sidecar容器已经被更新为了centos:7，并且pod以及其它的容器没有重启。
```bash
$ kubectl get pods | grep test-pod
test-pod                            2/2     Running   1          7m34s

$ kubectl get pods test-pod -o yaml | grep 'image: centos'
    image: centos:7

$ kubectl describe pods test-pod
Events:
  Type    Reason     Age                 From               Message
  ----    ------     ----                ----               -------
  Normal  Killing    5m47s               kubelet            Container sidecar1 definition changed, will be restarted
  Normal  Pulling    5m17s               kubelet            Pulling image "centos:7"
  Normal  Created    5m5s (x2 over 12m)  kubelet            Created container sidecar1
  Normal  Started    5m5s (x2 over 12m)  kubelet            Started container sidecar1
  Normal  Pulled     5m5s                kubelet            Successfully pulled image "centos:7"
```
## SidecarSet功能说明
一个简单的 SidecarSet yaml 文件如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  selector:
    matchLabels:
      app: sample
  containers:
  - name: nginx
    image: nginx:alpine
  initContainers:
  - name: init-container
    image: busybox:latest
    command: [ "/bin/sh", "-c", "sleep 5 && echo 'init container success'" ]
  updateStrategy:
    type: RollingUpdate
  namespace: ns-1
```
- spec.selector 通过label的方式选择需要注入、更新的pod，支持matchLabels、MatchExpressions两种方式，详情请参考：https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
- spec.containers 定义需要注入、更新的pod.spec.containers容器，支持完整的k8s container字段，详情请参考：https://kubernetes.io/docs/concepts/containers/
- spec.initContainers 定义需要注入的pod.spec.initContainers容器，支持完整的k8s initContainer字段，详情请参考：https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
    - 注入initContainers容器默认基于container name升级排序
    - initContainers只支持注入，不支持pod原地升级
- spec.updateStrategy sidecarSet更新策略，type表明升级方式：
    - NotUpdate 不更新，此模式下只会包含注入能力
    - RollingUpdate 注入+滚动更新，包含了丰富的滚动更新策略，后面会详细介绍
- spec.namespace sidecarset默认在k8s整个集群范围内生效，即对所有的命名空间生效（除了kube-system, kube-public），当设置该字段时，只对该namespace的pod生效

**注意：**从 Kruise v1.3.0 版本开始，SidecarSet 不再默认排除 Namespace **kube-system, kube-public**。如果你有排除特定 Namespace 的需求，请使用如下 namespace selector 的方式。

#### namespace selector

**FEATURE STATE:** Kruise v1.4.0

spec.namespace 字段只能指定一个Namespace，并且不能排除的一些特定的Namespace。如果面对一些复杂的 namespace selector 场景，推荐使用 **namespaceSelector** 字段：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ...
  namespaceSelector:
    matchLabels:
      environment: production
  # matchExpressions:
  # - {key: tier, operator: In, values: [frontend, middleware]}
```

### sidecar container注入
sidecar 的注入只会发生在 Pod 创建阶段，并且只有 Pod spec 会被更新，不会影响 Pod 所属的 workload template 模板。
spec.containers除了默认的k8s container字段，还扩展了如下一些字段，来方便注入：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  selector:
    matchLabels:
      app: sample
  containers:
    # default K8s Container fields
  - name: nginx
    image: nginx:alpine
    volumeMounts:
    - mountPath: /nginx/conf
      name: nginx.conf
    # extended sidecar container fields
    podInjectPolicy: BeforeAppContainer
    shareVolumePolicy:
      type: disabled | enabled
    transferEnv:
    - sourceContainerName: main
      envName: PROXY_IP
    - sourceContainerNameFrom:
        fieldRef:
          apiVersion: "v1"
          fieldPath: "metadata.labels['cName']"
        # fieldPath: "metadata.annotations['cName']"
      envName: TC
  volumes:
  - name: nginx.conf
    hostPath:
      path: /data/nginx/conf
```
- podInjectPolicy 定义container注入到pod.spec.containers中的位置
    - BeforeAppContainer(默认) 注入到pod原containers的前面
    - AfterAppContainer 注入到pod原containers的后面
- 数据卷共享
    - 共享指定卷：通过 spec.volumes 来定义 sidecar 自身需要的 volume，详情请参考：https://kubernetes.io/docs/concepts/storage/volumes/
    - 共享所有卷：通过 spec.containers[i].shareVolumePolicy.type = enabled | disabled 来控制是否挂载pod应用容器的卷，常用于日志收集等 sidecar，配置为 enabled 后会把应用容器中所有挂载点注入 sidecar 同一路经下(sidecar中本身就有声明的数据卷和挂载点除外）
- 环境变量共享
    - 可以通过 spec.containers[i].transferEnv 来从别的容器获取环境变量，会把名为 sourceContainerName 容器中名为 envName 的环境变量拷贝到本容器
    - sourceContainerNameFrom 支持 downwardAPI 来获取容器name，比如：metadata.name, `metadata.labels['<KEY>']`, `metadata.annotations['<KEY>']`

#### 注入暂停
**FEATURE STATE:** Kruise v0.10.0

对于已经创建的 SidecarSet，可通过设置 `spec.injectionStrategy.paused=true` 实现sidecar container的暂停注入：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ... ...
  injectionStrategy:
    paused: true
```
上述方法只作用于新创建的 Pod，对于已注入 Pod 的存量 sidecar container 不产生任何影响。

#### imagePullSecrets
**FEATURE STATE:** Kruise v0.10.0

SidecarSet 可以通过配置 spec.imagePullSecrets，来配合 [Secret](https://kubernetes.io/zh/docs/concepts/configuration/secret/) 拉取私有 sidecar 镜像。其实现原理为: 当sidecar注入时，SidecarSet 会将其 spec.imagePullSecrets 注入到[ Pod 的 spec.imagePullSecrets](https://kubernetes.io/zh/docs/tasks/configure-pod-container/pull-image-private-registry/)。
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ... ....
  imagePullSecrets:
  - name: my-secret
```
**特别注意**: 对于需要拉取私有 sidecar 镜像的 Pod，用户必需确保这些 Pod 所在的命名空间中已存在对应的 Secret，否则会导致拉取私有镜像失败。

### sidecar注入时版本控制
**FEATURE STATE:** Kruise v1.3.0

SidecarSet 通过 ControllerRevision 记录了关于 `containers`、`volumes`、`initContainers`、`imagePullSecrets` 和 `patchPodMetadata` 等字段的历史版本，并允许用户在 Pod 创建时选择特定的历史版本进行注入。
基于这一特性，用户可以规避在 SidecarSet 灰度发布时，因Deployment 等 Workload 扩容、升级等操作带来的 SidecarSet 发布风险。如果不选择注入版本，SidecarSet 将对重建 Pod 默认全都注入最新版本 Sidecar。

**注：SidecarSet 相关 ControllerRevision 资源被放置在了与 Kruise-Manager 相同的命名空间中，用户可以使用 `kubectl get controllerrevisions -n kruise-system -l kruise.io/sidecarset-name=<your-sidecarset-name>` 来查看。此外，用户还可以通过 SidecarSet 的 `status.latestRevision` 字段看到当前版本对应的 ControllerRevision 名称，以方便自行记录。**

#### 通过 ControllerRevision 名称指定注入的 Sidecar 版本
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ...
  injectionStrategy:
    revision:
      revisionName: <specific-controllerRevision-name>
```

#### 通过自定义版本标识指定注入的 Sidecar 版本
用户可以通过在发版时，同时给 SidecarSet 打上 `apps.kruise.io/sidecarset-custom-version=<your-version-id>` 来标记每一个历史版本，SidecarSet 会将这个 label 向下带入到对应的 ControllerRevision 对象，以便用户进行筛选，并且允许用户在选择注入历史版本时，使用该 `<your-version-id>` 来进行描述。

假设用户只想灰度 `10%` 的 Pods 到 `version-2`，并且对于新创建的 Pod 希望都注入更加稳定的 `version-1` 版本来控制灰度风险：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
  labels:
    apps.kruise.io/sidecarset-custom-version: version-2
spec:
  ...
  updateStrategy:
    partition: 90%
  injectionStrategy:
    revision:
      customVersion: version-1
```
以上两种版本选择方式，任选其一即可。

### 支持 k8s 1.28 Sidecar 容器
**FEATURE STATE:** Kruise v1.7.0

Kubernetes从1.28版本通过 **initContainers[x].restartPolicy=Always** 的方式支持[Sidecar Containers](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/). 该方式对比之前有如下优势：
1. Sidecar容器保证在业务主容器启动之前Ready，比如：日志采集容器已经准备就绪，业务主容器启动Crash的日志也能够及时采集上来。
2. Job类型的Pod，主容器执行完成之后，Sidecar容器也会自行退出不会阻塞Job的完成（之前的模式Sidecar容器没办法自主推出的，会导致Job一直没法结束）。

SidecarSet从 v1.7.0 版本开始也会支持注入Sidecar Containers，如下：
```
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  selector:
    matchLabels:
      app: sample
  updateStrategy:
    type: NotUpdate
  initContainers:
  - name: sidecar
    image: nginx:alpine
    restartPolicy: Always
    lifecycle:
      postStart:
        exec:
          command: ["/bin/sh", "-c", "sleep 10"]
```

**注意：**
- k8s 1.28 feature-gate SidecarContainers 默认是关闭的需要主动打开，k8s 1.29 是默认开启的。
- 如果 K8S 版本<1.28，你可以使用 Kruise 提供的 [Job Sidecar Terminator](/docs/user-manuals/jobsidecarterminator)
和 [Container Launch Priority](/docs/user-manuals/containerlaunchpriority) 来解决上述问题。

**此外，当前版本只支持 Sidecar Containers 自动注入，暂时还不支持原地升级能力。**

### sidecar更新策略
SidecarSet不仅支持sidecar容器的原地升级，而且提供了非常丰富的升级、灰度策略。
#### 分批发布
Partition 的语义是 **保留旧版本 Pod 的数量或百分比**，默认为 `0`。这里的 `partition` **不表示**任何 `order` 序号。

如果在发布过程中设置了 `partition`:

- 如果是数字，控制器会将 `(replicas - partition)` 数量的 Pod 更新到最新版本。
- 如果是百分比，控制器会将 `(replicas * (100% - partition))` 数量的 Pod 更新到最新版本。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    partition: 90
```
假设该SidecarSet关联的pod数量是100个，则本次升级只会升级10个，保留90个。

#### 最大不可用数量
MaxUnavailable 是发布过程中保证的，同一时间下最大不可用的 Pod 数量，默认值为 1。用户可以将其设置为绝对值或百分比（百分比会被控制器按照selected pod做基数来计算出一个背后的绝对值）。
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 20%
```
注意，maxUnavailable 和 partition 两个值是没有必然关联。举例：
- 当 {matched pod}=100,partition=50,maxUnavailable=10，控制器会发布 50 个 Pod 到新版本，但是发布窗口为 10，即同一时间只会发布 10 个 Pod，每发布好一个 Pod 才会再找一个发布，直到 50 个发布完成。
- 当 {matched pod}=100,partition=80,maxUnavailable=30，控制器会发布 20 个 Pod 到新版本，因为满足 maxUnavailable 数量，所以这 20 个 Pod 会同时发布。

#### 更新暂停
用户可以通过设置 paused 为 true 暂停发布，此时对于新创建的、扩容的pod依旧会实现注入能力，已经更新的pod会保持更新后的版本不动，还没有更新的pod会暂停更新。
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    paused: true
```

#### 金丝雀发布
对于有金丝雀发布需求的业务，可以通过strategy.selector来实现。方式：对于需要率先金丝雀灰度的pod打上固定的labels[canary.release] = true，再通过strategy.selector.matchLabels来选中该pod
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    selector:
      matchLabels:
        canary.release: "true"
```

### 发布顺序控制
- 默认对升级的pod排序，保证多次升级的顺序一致
- 默认选择优先顺序是（越小优先级越高）： unscheduled < scheduled, pending < unknown < running, not-ready < ready, newer pods < older pods
- 增强的 `priority`(优先级) 和 `scatter`(打散) 策略来允许用户自定义发布顺序。

#### 优先级策略
**FEATURE STATE:** Kruise v1.5.0

这个策略定义了控制器计算 Pod 发布优先级的规则，所有需要更新的 Pod 都会通过这个优先级规则计算后排序。
目前 `priority` 可以通过 weight(权重) 和 order(序号) 两种方式来指定。

- `weight`: Pod 优先级是由所有 weights 列表中的 term 来计算 match selector 得出。如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
spec:
  # ...
  updateStrategy:
    priorityStrategy:
      weightPriority:
      - weight: 50
        matchSelector:
          matchLabels:
            test-key: foo
      - weight: 30
        matchSelector:
          matchLabels:
            test-key: bar
```

- `order`: Pod 优先级是由 orderKey 的 value 决定，这里要求对应的 value 的结尾能解析为 int 值。比如 value "5" 的优先级是 5，value "sts-10" 的优先级是 10。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
spec:
  # ...
  updateStrategy:
    priorityStrategy:
      orderPriority:
      - orderedKey: some-label-key
```

#### scatter打散顺序
打散策略允许用户定义将符合某些标签的 Pod 打散到整个发布过程中。比如，一个 SidecarSet所管理的pod为10，如果下面有 3 个 Pod 带有 foo=bar 标签，且用户在打散策略中设置了这个标签，那么这 3 个 Pod 会被放在第 1、6、10 个位置发布。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    scatterStrategy:
    - key: foo
      value: bar
```
**注意：如果使用 scatter 策略，建议只设置一对 key-value 做打散，会比较好理解。**

### Sidecar热升级特性
**FEATURE STATE:** Kruise v0.9.0

SidecarSet原地升级会先停止旧版本的容器，然后创建新版本的容器。这种方式更加适合不影响Pod服务可用性的sidecar容器，比如说：日志收集Agent。

但是对于很多代理或运行时的sidecar容器，例如Istio Envoy，这种升级方法就有问题了。Envoy作为Pod中的一个代理容器，代理了所有的流量，如果直接重启，Pod服务的可用性会受到影响。如果需要单独升级envoy sidecar，就需要复杂的grace终止和协调机制。所以我们为这种sidecar容器的升级提供了一种新的解决方案。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: hotupgrade-sidecarset
spec:
  selector:
    matchLabels:
      app: hotupgrade
  containers:
  - name: sidecar
    image: openkruise/hotupgrade-sample:sidecarv1
    imagePullPolicy: Always
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - /migrate.sh
    upgradeStrategy:
      upgradeType: HotUpgrade
      hotUpgradeEmptyImage: openkruise/hotupgrade-sample:empty
```
- upgradeType: HotUpgrade代表该sidecar容器的类型是hot upgrade，将执行热升级方案
- hotUpgradeEmptyImage: 当热升级sidecar容器时，业务必须要提供一个empty容器用于热升级过程中的容器切换。empty容器同sidecar容器具有相同的配置（除了镜像地址），例如：command, lifecycle, probe等，但是它不做任何工作。
- lifecycle.postStart: 状态迁移，该过程完成热升级过程中的状态迁移，该脚本需要由业务根据自身的特点自行实现，例如：nginx热升级需要完成Listen FD共享以及流量排水（reload）

热升级特性总共包含以下两个过程：
1. Pod创建时，注入热升级容器
2. 原地升级时，完成热升级流程

#### 注入热升级容器

Pod创建时，SidecarSet Webhook将会注入两个容器：
1. {sidecarContainer.name}-1: 如下图所示 envoy-1，这个容器代表正在实际工作的sidecar容器，例如：envoy:1.16.0
2. {sidecarContainer.name}-2: 如下图所示 envoy-2，这个容器是业务配置的hotUpgradeEmptyImage容器，例如：empty:1.0，用于后面的热升级机制

![sidecarset hotupgrade_injection](/img/docs/user-manuals/sidecarset_hotupgrade_injection.png)

#### 热升级流程

热升级流程主要分为一下三个步骤：
1. Upgrade: 将empty容器升级为当前最新的sidecar容器，例如：envoy-2.Image = envoy:1.17.0
2. Migration: lifecycle.postStart完成热升级流程中的状态迁移，当迁移完成后退出。(**注意:PostStartHook在迁移过程中必须阻塞，迁移完成后退出。**)
3. Reset: 状态迁移完成后，热升级流程将设置envoy-1容器为empty镜像，例如：envoy-1.Image = empty:1.0

上述三个步骤完成了热升级中的全部流程，当对Pod执行多次热升级时，将重复性的执行上述三个步骤。

![sidecarset hotupgrade](/img/docs/user-manuals/sidecarset_hotupgrade.png)

#### Migration Demo
SidecarSet热升级机制不仅完成了mesh容器的切换，并且提供了新老版本的协调机制（PostStartHook），但是至此还只是万里长征的第一步，Mesh容器同时还需要提供 PostStartHook 脚本来完成mesh服务自身的平滑升级（上述Migration过程），如：Envoy热重启、Mosn无损重启。
为了方便大家能更好的理解Migration过程，在kruise仓库下面提供了一个包含代码和镜像的demo，供大家参考：[Migration Demo](https://github.com/openkruise/samples/tree/master/hotupgrade)

设计文档请参考: [proposals sidecarset hot upgrade](https://github.com/openkruise/kruise/blob/master/docs/proposals/20210305-sidecarset-hotupgrade.md)

当前已知的利用SidecarSet热升级机制的案例：
- [ALIYUN ASM](https://help.aliyun.com/document_detail/193804.html) 实现了Service Mesh中数据面的无损升级

### Inject Pod Metadata
**FEATURE STATE:** Kruise v1.3.0

SidecarSet支持注入Pod Annotations，如下：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
spec:
  containers:
    ...
  patchPodMetadata:
  - annotations:
      oom-score: '{"log-agent": 1}'
      custom.example.com/sidecar-configuration: '{"command": "/home/admin/bin/start.sh", "log-level": "3"}'
    patchPolicy: MergePatchJson
  - annotations:
      apps.kruise.io/container-launch-priority: Ordered
    patchPolicy: Overwrite | Retain
```
patchPolicy为注入的策略，如下：
- **Retain：** 默认策略，如果Pod中存在 annotation[key]=value ，则保留Pod原有的value。只有当 Pod中不存在 annotation[key] 时，才注入 annotations[key]=value。
- **Overwrite：** 与 Retain 对应，当 Pod 中存在 annotation[key]=value，将被强制覆盖为 value2。
- **MergePatchJson：** 与 Overwrite 对应，annotations value为 json 字符串。如果 Pod 不存在该 annotations[key]，则直接注入。如果存在，则进行 json value合并。
例如：Pod中存在 annotations[oom-score]='{"main": 2}'，注入后将 value json合并为 annotations[oom-score]='{"log-agent": 1, "main": 2}'。

**注意：** patchPolicy为Overwrite和MergePatchJson时，SidecarSet原地升级 Sidecar Container时，能够同步更新该 annotations。但是，如果只修改annotations则不能生效，只能搭配Sidecar容器镜像一起原地升级。
patchPolicy为Retain时，SidecarSet原地升级 Sidecar Container时，将不会同步更新该 annotations。

上述配置后，sidecarSet在注入sidecar container时，会注入Pod annotations，如下：
```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    apps.kruise.io/container-launch-priority: Ordered
    oom-score: '{"log-agent": 1, "main": 2}'
    custom.example.com/sidecar-configuration: '{"command": "/home/admin/bin/start.sh", "log-level": "3"}'
  name: test-pod
spec:
  containers:
    ...
```

#### Metadata 白名单
SidecarSet从安全的考虑不应该修改除sidecar container之外的任何Pod字段。但是目前很多的sidecar container的一些配置，需要从Pod Annotations上来获取。
所以如果想要使用该能力，首先需要配置 SidecarSet_PatchPodMetadata_WhiteList 白名单，如下：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kruise-configuration
  namespace: kruise-system
data:
  "SidecarSet_PatchPodMetadata_WhiteList": |
    {
      "rules": [
        {
          "selector":{
            "matchLabels":{
              "sidecar":"log-agent"
            }
          },
          "allowedAnnotationKeyExprs": [
            "^apps.kruise.io/container-launch-priority$",
            "^oom-score$",
            "^custom.example.com/sidecar-configuration$"
          ]
        }
      ]
    }
```
- **selector:** 根据Label选择生效的SidecarSet，MatchLabels和MatchExpressions都支持。如果不配置，则对该集群所有的SidecarSet生效。
- **allowedAnnotationKeyExprs:** 允许修改的Pod annotation key白名单，必须为正则表达式。

#### Feature-gate
SidecarSet_PatchPodMetadata_WhiteList 主要是考虑到安全，如果用户的集群使用场景比较可控，可以通过 Feature-gate 的方式来关闭白名单的校验，如下：
```shell
$ helm install kruise https://... --set featureGates="SidecarSetPatchPodMetadataDefaultsAllowed=true"
```

### SidecarSet状态说明
通过sidecarset原地升级sidecar容器时，可以通过SidecarSet.Status来观察升级的过程
```yaml
# kubectl describe sidecarsets sidecarset-example
Name:         sidecarset-example
Kind:         SidecarSet
Status:
  Matched Pods:         10  # The number of PODs injected and managed by the Sidecarset
  Updated Pods:         5   # 5 PODs have been updated to the container version in the latest SidecarSet
  Ready Pods:           8   # Matched Pods pod.status.condition.Ready = true number
  Updated Ready Pods:   3   # Updated Pods && Ready Pods number
```

## 如何排查 SidecarSet 独立升级 Sidecar 容器卡住？

kubernetes社区只允许 patch pod.spec 中 **image 字段**，进而 SidecarSet 独立升级 Sidecar 容器也只能支持 image 字段。
如果 SidecarSet 中修改了除 image 的其它字段，比如：Env、Resources，将会导致独立升级 Sidecar 容器卡住。

社区当中经常会有同学有此疑问，为了方便大家排查类似的问题，**从 kruise v1.5.0 版本开始**，kruise将会上报相关的信息到 **Pod Condition** 和 **SidecarSet Event**，如下：

```
# kubectl describe sidecarsets test-sidecarset
Status:
  Collision Count:      0
  Latest Revision:      test-sidecarset-5f6d95f777
  Matched Pods:         1
  Observed Generation:  2
  Ready Pods:           1
  Updated Pods:         0
Events:
  Type    Reason             Age   From                   Message
----    ------             ----  ----                   -------
Normal  NotUpgradablePods  63s   sidecarset-controller  SidecarSet in-place update detected 1 not upgradable pod(s) in this round, will skip them

# kubectl get pods test-pod -oyaml
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2023-09-09T11:10:17Z"
    message: '{"test-sidecarset":false}'
    reason: UpdateImmutableField
    status: "False"
    type: SidecarSetUpgradable
```

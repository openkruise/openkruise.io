# CRD字段说明
## GameServerSet

### GameServerSetSpec

```
type GameServerSetSpec struct {
    // 游戏服数目，必须指定，最小值为0
    Replicas *int32 `json:"replicas"`

    // 游戏服模版，新生成的游戏服将以模版定义的参数创建
    GameServerTemplate   GameServerTemplate `json:"gameServerTemplate,omitempty"`
    
    // serviceName 是管理此 GameServerSet 的服务的名称。
    // 该服务必须在GameServerSet之前存在，并负责该集合的网络标识。 
    // Pod 获取遵循以下模式的 DNS/主机名：pod-specific-string.serviceName.default.svc.cluster.local
    // 其中“pod-specific-string”由 GameServerSet 控制器管理。
	ServiceName          string             `json:"serviceName,omitempty"`

    // 保留的游戏服序号，可选项。若指定了该序号，已经存在的游戏服将被删除；而未存在的游戏服，新建时将跳过、不创建该序号
    // 允许指定的序号的范围, 例如 [1, 3, 4, 5] 可以表示为 [1, 3-5]
    ReserveGameServerIds []intintstr.IntOrString `json:"reserveGameServerIds,omitempty"`

    // 游戏服自定义服务质量。用户通过该字段实现游戏服自动化状态感知。
    ServiceQualities     []ServiceQuality   `json:"serviceQualities,omitempty"`

    // 游戏服批量更新策略
    UpdateStrategy       UpdateStrategy     `json:"updateStrategy,omitempty"`
 
    // 游戏服水平伸缩策略
    ScaleStrategy        ScaleStrategy      `json:"scaleStrategy,omitempty"`

    // 游戏服接入层网络设置
    Network              *Network           `json:"network,omitempty"`
    
    // 用户自定义设置生命周期钩子
    Lifecycle            *appspub.Lifecycle `json:"lifecycle,omitempty"`
    
    // PersistentVolumeClaimRetentionPolicy 描述了从 StatefulSet VolumeClaimTemplates 创建的 PVC 所使用的策略。
    // 这需要启用 StatefulSetAutoDeletePVC 特性门控，该特性门控目前处于 alpha 阶段。
	PersistentVolumeClaimRetentionPolicy *kruiseV1beta1.StatefulSetPersistentVolumeClaimRetentionPolicy `json:"persistentVolumeClaimRetentionPolicy,omitempty"`
}
```

#### GameServerTemplate

```
type GameServerTemplate struct {
    // 继承至PodTemplateSpec的所有字段，字段详情参考 https://pkg.go.dev/k8s.io/api/core/v1#PodTemplateSpec
    corev1.PodTemplateSpec `json:",inline"`

    // 对持久卷的请求和声明
    VolumeClaimTemplates   []corev1.PersistentVolumeClaim `json:"volumeClaimTemplates,omitempty"`
    
    // ReclaimPolicy 表明GameServer的回收策略
    // 当前支持两种，Cascade与Delete。默认为Cascade
    ReclaimPolicy GameServerReclaimPolicy `json:"reclaimPolicy,omitempty"`
}

type GameServerReclaimPolicy string

const (
    // Cascade 表明pod删除时GameServer一并删除。GameServer的生命周期与pod相同
    CascadeGameServerReclaimPolicy GameServerReclaimPolicy = "Cascade"
    
    // Delete 表明 GameServers 只会在GameServerSet副本数目减少时被删除。
    // 当对应的pod被手动删除、更新重建、被驱逐时，GameServer都不会被删除。
    DeleteGameServerReclaimPolicy GameServerReclaimPolicy = "Delete"
)
```

#### UpdateStrategy

```
type UpdateStrategy struct {
    // 更新策略类型，可选择 OnDelete 或 RollingUpdate
    Type apps.StatefulSetUpdateStrategyType `json:"type,omitempty"`

    // 当策略类型为RollingUpdate时可用，指定RollingUpdate具体策略
    RollingUpdate *RollingUpdateStatefulSetStrategy `json:"rollingUpdate,omitempty"`
}


type RollingUpdateStatefulSetStrategy struct {
    // 保留旧版本游戏服的数量或百分比，默认为 0。
    Partition *int32 `json:"partition,omitempty"`
	
	
    // 会保证发布过程中最多有多少个游戏服处于不可用状态，默认值为 1。
    // 支持设置百分比，比如：20%，意味着最多有20%个游戏服处于不可用状态。
    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty"`

    // 表明游戏服更新的方式。可选择ReCreate / InPlaceIfPossible / InPlaceOnly。默认为ReCreate。
    PodUpdatePolicy kruiseV1beta1.PodUpdateStrategyType `json:"podUpdatePolicy,omitempty"`

    // 是否暂停发布，默认为false。
    Paused bool `json:"paused,omitempty"`

    // 原地升级的策略
    InPlaceUpdateStrategy *appspub.InPlaceUpdateStrategy `json:"inPlaceUpdateStrategy,omitempty"`
	
    // 游戏服在更新后多久被视为准备就绪，默认为0，最大值为300。
    MinReadySeconds *int32 `json:"minReadySeconds,omitempty"`
}

type InPlaceUpdateStrategy struct {
    // 将游戏服状态设置为NotReady和更新游戏服Spec中的镜像之间的时间跨度。
    GracePeriodSeconds int32 `json:"gracePeriodSeconds,omitempty"`
}
```

#### ScaleStrategy

```
type ScaleStrategy struct {
    // 扩缩期间游戏服最大不可用的数量，可为绝对值或百分比
    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty"`
    
    // 缩容策略类型，目前支持两种：General 与 ReserveIds。
    // 默认为General，缩容时优先考虑reserveGameServerIds字段，
    // 当预留的GameServer数量不满足缩减数量时，继续从当前游戏服务器列表中选择并删除GameServer。
    // 当该字段设置为ReserveIds时，无论是保留的游戏服还是控制器按照优先级删除的游戏服，
    // 被删除的游戏服的序号都会回填至ReserveGameServerIds字段。
    ScaleDownStrategyType ScaleDownStrategyType `json:"scaleDownStrategyType,omitempty"`
}

```

#### ServiceQualities

```
type ServiceQuality struct {
    // 继承至corev1.Probe所有字段，此处指定探测方式，字段详情参考 https://pkg.go.dev/k8s.io/api/core/v1#Probe
    corev1.Probe  `json:",inline"`
    
    // 自定义服务质量的名称，区别定义不同的服务质量
    Name          string `json:"name"`
    
    // 探测的容器名称
    ContainerName string `json:"containerName,omitempty"`
    
    // 是否让GameServerSpec在ServiceQualityAction执行后不发生变化。
    // 当Permanent为true时，无论检测结果如何，ServiceQualityAction只会执行一次。
    // 当Permanent为false时，即使ServiceQualityAction已经执行过，也可以再次执行ServiceQualityAction。
    Permanent            bool                   `json:"permanent"`
    
    // 服务质量对应执行动作
    ServiceQualityAction []ServiceQualityAction `json:"serviceQualityAction,omitempty"`
}

type ServiceQualityAction struct {
    // 用户设定当探测结果为true/false时执行动作
    State          bool `json:"state"`
    
    // Result为对应探测脚本返回的信息。当Result被指定时，只有当探测的结果符合该声明的结果时action才会执行
	Result         string `json:"result,omitempty"`

    // 动作为更改GameServerSpec中的字段
    GameServerSpec `json:",inline"`
    
    // 动作为更改GameServer的Annotations和Labels
    Annotations    map[string]string `json:"annotations,omitempty"`
	Labels         map[string]string `json:"labels,omitempty"`
}
```

#### Network

```
type Network struct {
    // 网络类型
    NetworkType string              `json:"networkType,omitempty"`

    // 网络参数，不同网络类型需要填写不同的网络参数
    NetworkConf []NetworkConfParams `json:"networkConf,omitempty"`
}

type NetworkConfParams KVParams

type KVParams struct {
    // 参数名，名称由网络插件决定
    Name  string `json:"name,omitempty"`

    // 参数值，格式由网络插件决定
    Value string `json:"value,omitempty"`
}
```

#### Lifecycle

```
// Lifecycle contains the hooks for Pod lifecycle.
type Lifecycle struct {
	// 设置在pod删除前卡点
	PreDelete *LifecycleHook `json:"preDelete,omitempty"`
	// 设置在pod原地升级前卡点
	InPlaceUpdate *LifecycleHook `json:"inPlaceUpdate,omitempty"`
}

type LifecycleHook struct {
	LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`
	FinalizersHandler []string          `json:"finalizersHandler,omitempty"`
	MarkPodNotReady bool `json:"markPodNotReady,omitempty"`
}
```

### GameServerSetStatus

```
type GameServerSetStatus struct {
    // 控制器观察到GameServerSet的迭代版本
    ObservedGeneration int64 `json:"observedGeneration,omitempty"`

    // 游戏服数目
    Replicas                int32  `json:"replicas"`

    // 处于Ready的游戏服数目
    ReadyReplicas           int32  `json:"readyReplicas"`

    // 可用的游戏服数目
    AvailableReplicas       int32  `json:"availableReplicas"`

    // 当前的游戏服数目
    CurrentReplicas         int32  `json:"currentReplicas"`

    // 已更新的游戏服数目
    UpdatedReplicas         int32  `json:"updatedReplicas"`

    // 已更新并Ready的游戏服数目
    UpdatedReadyReplicas    int32  `json:"updatedReadyReplicas,omitempty"`

    // 处于Maintaining状态的游戏服数目
    MaintainingReplicas     *int32 `json:"maintainingReplicas,omitempty"`

    // 处于WaitToBeDeleted状态的游戏服数目
    WaitToBeDeletedReplicas *int32 `json:"waitToBeDeletedReplicas,omitempty"`
    
    // 处于PreDelete状态的游戏服数目
    PreDeleteReplicas       *int32 `json:"preDeleteReplicas,omitempty"`

    // LabelSelector 是标签选择器，用于查询应与 HPA 使用的副本数相匹配的游戏服。
    LabelSelector string `json:"labelSelector,omitempty"`
}
```

## GameServer

### GameServerSpec

```
type GameServerSpec struct {
   // 游戏服运维状态，表示业务相关的游戏服状态，可以由用户定义为任何值。
   // OKG提供了一些保留值，有着特殊含义，包括：
   // None —— 默认值，代表不存在任何异常和特殊状态
   // WaitToBeDeleted —— gs缩容优先级最高，且配置自动伸缩策略后会被自动回收
   // Maintaining —— gs缩容优先级最低
   // Allocated —— gs缩容优先级大于Maintaining，小于None。通常代表gs已经被分配，在游戏匹配场景下可以使用。
   // Kill —— 设置Kill的gs将被OKG控制器直接删除
   OpsState         OpsState            `json:"opsState,omitempty"`

   // 更新优先级，优先级高则优先被更新
   UpdatePriority   *intstr.IntOrString `json:"updatePriority,omitempty"`

   // 删除优先级，优先级高则优先被删除
   DeletionPriority *intstr.IntOrString `json:"deletionPriority,omitempty"`

   // 是否进行网络隔离、切断接入层网络，默认为false
   NetworkDisabled  bool                `json:"networkDisabled,omitempty"`
   
   // 使对应的GameServer Containers字段与GameServerSetSpec中GameServerTemplate定义的字段不同，意味着该GameServer可以拥有独立的参数配置。
   // 当前支持更改 Image 与 Resources
   Containers []GameServerContainer `json:"containers,omitempty"`
}

type GameServerContainer struct {
    // Name 表示要更新的容器的名称。
    Name string `json:"name"`
    
    // Image 表示要更新的容器的镜像。
    // 当Image更新时，pod.spec.containers[*].image会立即更新。
    Image string `json:"image,omitempty"`
    
    // Resources 表示要更新的容器的资源。
    // 当Resources更新时，pod.spec.containers[*].Resources不会立即更新，它会在pod重建时更新。
    Resources corev1.ResourceRequirements `json:"resources,omitempty"`
}
```

### GameServerStatus

```
type GameServerStatus struct {
    // 期望游戏服状态，Ready
    DesiredState              GameServerState           `json:"desiredState,omitempty"`

    // 当前游戏服实际状态
    CurrentState              GameServerState           `json:"currentState,omitempty"`

    // 网络状态信息
    NetworkStatus             NetworkStatus             `json:"networkStatus,omitempty"`

    // 游戏服对应pod状态
    PodStatus                 corev1.PodStatus          `json:"podStatus,omitempty"`

    // 游戏服服务质量状况
    ServiceQualitiesCondition []ServiceQualityCondition `json:"serviceQualitiesConditions,omitempty"`
        
    // 与该GameServer相关的Condition集合
    // 当前支持聚合 pod Conditions / node Conditions / pv Conditions
	Conditions []GameServerCondition `json:"conditions,omitempty" `

    // 当前更新优先级
    UpdatePriority     *intstr.IntOrString `json:"updatePriority,omitempty"`

    // 当前删除优先级
    DeletionPriority   *intstr.IntOrString `json:"deletionPriority,omitempty"`

    // 上次变更时间
    LastTransitionTime metav1.Time         `json:"lastTransitionTime,omitempty"`
}
```
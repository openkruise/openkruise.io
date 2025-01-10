# 常见问题

### GameServer 的 State 和 OpsState 分别代表什么？有什么区别？

State代表游戏服运行时状态（Runtime State），跟Pod生命周期有关，用户不可自定义更改。当前的State包含以下值：

- Creating —— 表示Pod创建中，等同于Pod Pending
- Ready —— 表示Pod是Ready的，Pod ready condition 为 true
- NotReady —— 表示Pod是NotReady的，Pod ready condition 为 false
- Crash —— 表示Pod失败，等同于Pod Failed
- Deleting —— 表示Pod正在删除，等同于Pod Terminating
- Updating —— 表示Pod正在进行原地升级
- PreDelete —— 表示Pod处于删除前的状态。设置了删除生命周期钩子且执行Pod删除动作后出现，解除卡点后进入Deleting状态
- PreUpdate —— 表示Pod处于原地升级前的状态。设置了更新生命周期钩子且执行Pod原地升级后出现，解除卡点后进入Updating状态
- Unknown —— 除上述此外的状态

OpsState表示游戏服运维状态，由业务决定，用户可随意修改。OKG提供了一些保留值，有着特殊含义，包括：

- None —— 默认值，代表不存在任何异常和特殊状态
- WaitToBeDeleted —— gs缩容优先级最高，且配置自动伸缩策略后会被自动回收
- Maintaining —— gs缩容优先级最低
- Allocated —— gs缩容优先级大于Maintaining，小于None。通常代表gs已经被分配，在游戏匹配场景下可以使用。
- Kill —— 设置Kill的gs将被OKG控制器直接删除

用户可以通过调用K8s API（或kubectl）更改GameServer opsState，也可以通过自定义服务质量功能自动化由容器内业务触发更改对应的GameServer opsState

### 在配置了ReserveId的情况下，GameServer的水平伸缩逻辑是怎么样的？

在配置ReserveId的情况下，被缩容的GameServer实际上存在两个类别：

1. 被用户指定Reserve的GameServer；
2. 由OKG水平缩容特性而缩容的GameServer。

在这里，可以将前者的集合称为显式缩容列表、后者为隐式缩容列表。

此时，有两条原则：

1. 显式列表具有最高权限，代表用户指令，所指ID一定不会存在于集群
2. 尽量不改动存量GameServer列表，保证最小改动

举几个例子：

1. 当前存在的 ID 为 [0, 2, 3, 5], reserveId 为 [4]. 若将replicas从4调整为6，则扩容后的情况为：reserveId 为 [4], 存在的 ID 为 [0, 1, 2, 3, 5, 6]

   这里比较好理解，ID 1 属于隐式缩容列表，在存在扩容需求时优先被扩容出来，而 ID 4 属于显式缩容列表，只要在reserveId中就不会被扩容出来。

2. 当前存在的 ID 为 [0, 2, 3, 5], reserveId 为 [4]. 若将replicas不变，reserve置空，则变更后的情况为：reserveId 为 [], 存在的 ID 为 [0, 2, 3, 5]

   这里需要注意的是，由于最小改动原则，ID 4 从reserveId拿掉后转变进入隐式缩容列表，此时没有扩容需求所以不会对存量的GameServer产生任何扩容会缩容行为。
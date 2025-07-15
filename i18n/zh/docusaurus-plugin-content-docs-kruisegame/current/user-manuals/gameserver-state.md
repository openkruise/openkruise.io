# 游戏服状态

## 游戏服运行时状态

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

Annotation "game.kruise.io/state-last-changed-time" 记录了最近一次State的变更时间。用户可将其通过DownwardAPI下沉至容器里让业务应用程序获取。

## 游戏服运维状态

OpsState表示游戏服运维状态，由业务决定，用户可随意修改。OKG提供了一些保留值，有着特殊含义，包括：

- None —— 默认值，代表不存在任何异常和特殊状态
- WaitToBeDeleted —— gs缩容优先级最高，且配置自动伸缩策略后会被自动回收
- Maintaining —— gs缩容优先级最低
- Allocated —— gs缩容优先级大于Maintaining，小于None。通常代表gs已经被分配，在游戏匹配场景下可以使用。
- Kill —— 设置Kill的gs将被OKG控制器直接删除

用户可以通过调用K8s API（或kubectl）更改GameServer opsState，也可以通过自定义服务质量功能自动化由容器内业务触发更改对应的GameServer opsState

Annotation "game.kruise.io/opsState-last-changed-time" 记录了最近一次OpsState的变更时间。用户可将其通过DownwardAPI下沉至容器里让业务应用程序获取。
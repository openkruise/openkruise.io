# 游戏服调度器

## 序号偏移调度器

index-offset-scheduler是一个自定义的kubernetes调度器。它可以让属于同一个GameServerSet的pod按照pod的索引编号滚动部署，使得每个节点上的 pod的索引的偏移量/差值尽可能得大。
对于滚动开服类的游戏，这是常见的需求场景：

- 在游戏上线前，由于存在大量预约或者导量，需要提前准备较多的游戏服务。在k8s环境中，游戏服务的id 一般与pod编号存在对应关系。
- 开服后，游戏服对应的pod负载会明显上升并导致所在机器的负载明显上升，如果临近的多个pod位于同一个node上， 例如pod-1和pod-2，短期内的pod的负载快速上升可能导致需要按照两个pod的所需的最高资源准备node配置。而一段时间后，随着活跃玩家的下降，机器的负载又会下降。
- 因此在传统机器部署的场景下，常见的做法是：提前准备多台机器，将游戏服务按照滚动部署的方式部署，以使得节点能够部署较多的服务，并且不会面临短期内 单台机器承载多个游戏服的最高负载的风险。部署效果类似下方的分布:
    ```
    node1: game-1, game-4...
    node2: game-2, game-5...
    node3: game-3, game-6...
    ```
默认的k8s调度器会保障pod尽可能均匀的分布，但是不能确保每个节点上pod之间的编号差值尽可能大，甚至可能出现连续索引编号的两个pod分布在同一个节点上。 因此需要实现一个自定义调度器，使得每个节点上的 pod的索引的偏移量/差值尽可能尽可能得大。

### 安装

```
helm upgrade kruise-game openkruise/kruise-game --version 1.0.0 --set indexOffsetScheduler.enabled=true
```

### 更多信息

https://github.com/CloudNativeGame/index-offset-scheduler
# 游戏匹配

会话类游戏通常需要`匹配服务`让玩家找到合适的队友及对手组成对局，并为该对局分配合适的游戏服。组成对局的玩家拿到游戏服地址后方可进入游戏。

OKG支持云原生游戏匹配框架[Open Match](https://github.com/googleforgames/open-match)，
并基于Open Match构建了[kruise-game-open-match-director](https://github.com/CloudNativeGame/kruise-game-open-match-director)组件，
为形成对局的玩家分配游戏服地址。

## 使用说明

- Kubernetes集群中需要安装 `OpenKruiseGame` 、 `Open Match` 以及 `kruise-game-open-match-director`
- 被GameServerSet管理且待匹配的游戏服需要配置Network字段，使游戏服具备直连网络。详细可参考[网络功能文档](./network.md)
- kruise-game-open-match-director 将选择网络可用且OpsState为None的游戏服，获取对应网络连接信息，分配予Match中的Tickets。
- kruise-game-open-match-director 将已分配的GameServer对应的OpsState字段标记为Allocated，此时该GameServer不会再被分配，且水平缩容时优先级较低，避免被轻易删除。游戏服具体缩容顺序可参考[游戏服伸缩文档](./gameservers-scale.md#openkruisegame的水平伸缩特性)
- kruise-game-open-match-director 更多功能请参考[GitHub](https://github.com/CloudNativeGame/kruise-game-open-match-director)
- 关于OKG + Open Match更多示例请参考[GitHub](https://github.com/CloudNativeGame/kruise-game-open-match-example)
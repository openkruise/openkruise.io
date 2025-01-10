# 自定义生命周期管理

游戏服务器强状态的关键特性使它们对于优雅的下线操作有很高的需求。
一个游戏服务器通常需要等待数据被完全持久化到磁盘上并确保安全后，才能进行彻底的移除。
虽然Kubernetes原生提供了preStop钩子，允许容器在即将关闭前执行特定操作，但存在一个局限性：一旦超出了预设的时间限制，容器将不得不被强制终止，不管数据处理是否完成。在某些情况下，这种方法缺乏真正的优雅性。
我们需要一个更灵活的机制来确保游戏服务器能够在保护了所有关键状态的前提下平滑地退出。

OpenKruise 引入了 Lifecycle Hook 功能，为游戏服务器提供了在关键生命周期节点上的精确控制和等待机制。
这使得服务器能失在满足特定条件后，方才执行真正的删除或更新操作。
通过提供可配置的 Lifecycle 字段，并结合自定义服务质量的能力，OKG 能够确保游戏服务器的下线过程既优雅又可靠。
借助这一进阶特性，维护者可以确保所有必要的数据持久化和内部状态同步在安全无误地完成后，服务器才会被平稳地移除或更新。

## 使用示例

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  lifecycle:
    preDelete:
      labelsHandler:
        gs-sync/delete-block: "true"
  gameServerTemplate:
    metadata:
      labels:
        gs-sync/delete-block: "true"
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0
          name: minecraft
          volumeMounts:
            - name: gsinfo
              mountPath: /etc/gsinfo
      volumes:
        - name: gsinfo
          downwardAPI:
            items:
              - path: "state"
                fieldRef:
                  fieldPath: metadata.labels['game.kruise.io/gs-state']
  serviceQualities:
    - name: healthy
      containerName: minecraft
      permanent: false
      exec:
        command: ["bash", "./probe.sh"]
      serviceQualityAction:
        - state: true
          result: done
          labels:
            gs-sync/delete-block: "false"
        - state: true
          result: WaitToBeDeleted
          opsState: WaitToBeDeleted
        - state: false
          opsState: None
```


对应的脚本如下。该脚本做了以下动作：

- 从 /etc/gsinfo/state 中拿到当前gs的状态，并判断其是否为“PreDelete”
    - 若是PreDelete，则说明当前gs应处于下线阶段。判断数据落盘是否完成（这个示例中通过判断文件以文件存在表示数据落盘完成）
        - 若数据落盘未完成，则执行落盘动作（这个示例是创建一个文件）
        - 若数据落盘完成，则输出“done”，并以1退出。
    - 若不是PreDelete，则说明该gs没有未进入下线阶段。以游戏服人数判断当前是否应该下线。
        - 若游戏服人数等于0，则输出“WaitToBeDeleted”，以1退出。
        - 若游戏服人数不为0，则以0退出。

```
#!/bin/bash

file_path="/etc/gsinfo/state"
data_flushed_file="/etc/gsinfo/data_flushed"

if [[ ! -f "$file_path" ]]; then
    exit 0
fi

state_content=$(cat "$file_path")

if [[ "$state_content" == "PreDelete" ]]; then
    if [[ -f "$data_flushed_file" ]]; then
        echo "done"
        exit 1
    else
        touch "$data_flushed_file"
        echo "WaitToBeDeleted"
        exit 1
    fi
else
    people_count_file="/etc/gsinfo/people_count"

    people_count=$(cat "$people_count_file")
    
    if [[ "$people_count" -eq 0 ]]; then
        echo "WaitToBeDeleted"
        exit 1
    else
        exit 0
    fi
fi
```

![grace-deletion.png](/img/kruisegame/user-manuals/gs-lifecycle-delete.png)

优雅下线的过程如下：
1. 游戏服正常运行，玩家数量不为0
2. 当玩家数量为0，通过自定义服务质量设置opsState为WaitToBeDeleted
3. 通过自动缩容策略，OKG将该GameServer删除。由于配置了lifecycle hook，delete-block 标签为 true，gs不会真正被删除，而进入PreDelete状态，并通过自定义服务质量触发数据落盘过程。
4. 当数据完成落盘，通过自定义服质量将delete-block标签设为false，卡点解除。
5. 卡点解除后，PreDelete阶段将进入Delete阶段。gs真正被删除。
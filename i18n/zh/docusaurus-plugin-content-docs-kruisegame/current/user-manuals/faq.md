# 常见问题

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

### 对于存在 PreDelete 状态 Gs 的 Gss 伸缩逻辑是怎么样的？

处于 PreDelete 状态的 GameServer 真正下线的时间是无法确定的，如果用户一直不解除 lifecycle 卡点，Gs 会一直处于 PreDelete 状态。
此时，当 Gss 的 replicas数量增多时，OKG 不会将处于 PreDelete 状态的 GameServer 作为新扩容的对象。举个例子：

当前 Gss replicas=1，
```
NAME          STATE        OPSSTATE    DP    UP    AGE
minecraft-0   Ready        None        0     0     40s
minecraft-1   PreDelete    None        0     0     30s
```

将Gss replicas 设置为 2，则会扩容出 minecraft-2
```
NAME          STATE        OPSSTATE    DP    UP    AGE
minecraft-0   Ready        None        0     0     50s
minecraft-1   PreDelete    None        0     0     40s
minecraft-2   Ready        None        0     0     10s
```
# 自定义服务质量
## 功能概述

由于游戏是有状态服务，很多时候游戏服是以一种 "富容器" 的形态存在于Pod之中，多个进程在Pod中统一管理。
然而，每个进程重要性却有所不同，对于"轻量级进程"错误的情况，用户并不希望将整个pod删除重建，像k8s原生的liveness probe并不能很好地满足这种需求，过于僵化的模式与游戏场景并不适配。
OKG 认为游戏服的服务质量水平应该交由游戏开发者定义，开发者可以根据不同游戏服状态去设置对应的处理动作。自定义服务质量功能是探测+动作的组合，通过这种方式帮助用户自动化地处理各类游戏服状态问题。

## 使用说明
通过 `GameServerSet.Spec.ServiceQualities` 使用自定义服务质量功能。其详细的数据结构如下：

```
type GameServerSetSpec struct {
	// ...
	ServiceQualities     []ServiceQuality   `json:"serviceQualities,omitempty"`
	// ...
}

type ServiceQuality struct {
	corev1.Probe  `json:",inline"`
	Name          string `json:"name"`
	ContainerName string `json:"containerName,omitempty"`
	// Whether to make GameServerSpec not change after the ServiceQualityAction is executed.
	// When Permanent is true, regardless of the detection results, ServiceQualityAction will only be executed once.
	// When Permanent is false, ServiceQualityAction can be executed again even though ServiceQualityAction has been executed.
	Permanent            bool                   `json:"permanent"`
	ServiceQualityAction []ServiceQualityAction `json:"serviceQualityAction,omitempty"`
}

type ServiceQualityAction struct {
	State bool `json:"state"`
	// Result indicate the probe message returned by the script.
	// When Result is defined, it would exec action only when the according Result is actually returns.
	Result         string `json:"result,omitempty"`
	GameServerSpec `json:",inline"`
	Annotations    map[string]string `json:"annotations,omitempty"`
	Labels         map[string]string `json:"labels,omitempty"`
}
```

用户通过实现一个探测脚本，将容器中的业务/运维状态透出至Kubernetes GameServer对象上。
支持多结果输出：脚本中退出码0 对应 ServiceQualityAction 的 State 为 true；脚本中退出码1 对应 ServiceQualityAction 的 State 为 false；脚本中 echo 的字符串对应 ServiceQualityAction 的 Result 值。
当 State 与 Result 同时满足时，GameServer 的 GameServerSpec/Annotations/Labels 将按照用户填写的参数设置。其中GameServerSpec包括 OpsState/NetworkDisabled等，具体字段如下：

```
type GameServerSpec struct {
	OpsState         OpsState            `json:"opsState,omitempty"`
	UpdatePriority   *intstr.IntOrString `json:"updatePriority,omitempty"`
	DeletionPriority *intstr.IntOrString `json:"deletionPriority,omitempty"`
	NetworkDisabled  bool                `json:"networkDisabled,omitempty"`
	// Containers can be used to make the corresponding GameServer container fields
	// different from the fields defined by GameServerTemplate in GameServerSetSpec.
	Containers []GameServerContainer `json:"containers,omitempty"`
}
```

## 使用示例

我们来通过一个示例看下如何通过一个探测脚本实现游戏服多种状态感知。probe.sh 是业务容器中探测脚本，将被OKG周期性调用，其脚本代码如下：

```shell
#!/bin/bash

gate=$(ps -ef | grep gate | grep -v grep | wc -l)
data=$(ps -ef | grep data | grep -v grep | wc -l)

if [ $gate != 1 ]
then
  echo "gate"
  exit 0
fi

if [ $data != 1 ]
then
  echo "data"
  exit 0
fi

exit 1
```

而对应的GameServerSet的yaml如下所示：

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0
          name: minecraft
  serviceQualities:
    - name: healthy
      containerName: minecraft
      permanent: false
      exec:
        command: ["bash", "./probe.sh"]
      serviceQualityAction:
        - state: true
          result: gate
          opsState: GateMaintaining
        - state: true
          result: data
          opsState: DataMaintaining
        - state: false
          opsState: None
```

部署完成后，生成3个Pod与GameServer

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     14s
minecraft-1   Ready   None       0     0     14s
minecraft-2   Ready   None       0     0     14s

kubectl get po
NAME          READY   STATUS    RESTARTS   AGE
minecraft-0   1/1     Running   0          15s
minecraft-1   1/1     Running   0          15s
minecraft-2   1/1     Running   0          15s
```

进入minecraft-0容器中，模拟gate进程故障，将其对应的进程号kil

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 7

/data# exit
```

获取当前gs的opsState，已经变为GateMaintaining

```bash

kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     2m14s
minecraft-1   Ready   None              0     0     2m14s
minecraft-2   Ready   None              0     0     2m14s
```

进入minecraft-1容器中，模拟data进程故障，将其对应的进程号kil

```bash
kubectl exec -it minecraft-1 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 8

/data# exit
```

获取当前gs的opsState，已经变为DataMaintaining

```bash
kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     3m10s
minecraft-1   Ready   DataMaintaining   0     0     3m10s
minecraft-2   Ready   None              0     0     3m10s
```

分别进入minecraft-0，minecraft-1，手动拉起挂掉的进程：

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# bash ./gate.sh &

/data# exit

kubectl exec -it minecraft-1 /bin/bash

/data# bash ./data.sh &

/data# exit
```

此时，gs的运维状态已经都恢复为None

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     5m6s
minecraft-1   Ready   None       0     0     5m6s
minecraft-2   Ready   None       0     0     5m6s
```

## 使用场景

### 游戏服空闲设置即将下线

部署一个带有自定义服务质量的GameServerSet：
```shell
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:idle
          name: minecraft
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  serviceQualities: # 设置了一个idle的服务质量
    - name: idle
      containerName: minecraft
      permanent: false
      #与原生probe类似，本例使用执行脚本的方式探测游戏服是否空闲，不存在玩家
      exec:
        command: ["bash", "./idle.sh"]
      serviceQualityAction:
          #不存在玩家，标记该游戏服运维状态为WaitToBeDeleted
        - state: true
          opsState: WaitToBeDeleted
          #存在玩家，标记该游戏服运维状态为None
        - state: false
          opsState: None
EOF
```

部署完成后，由于还未导入玩家，故所有游戏服都为空闲状态，可以任意被删除：
```shell
kubectl get gs
NAME          STATE   OPSSTATE          DP    UP
minecraft-0   Ready   WaitToBeDeleted   0     0
minecraft-1   Ready   WaitToBeDeleted   0     0
minecraft-2   Ready   WaitToBeDeleted   0     0
```

当有玩家进入游戏服minecraft-1，则游戏服的运维状态发生变化：
```shell
kubectl get gs
NAME          STATE   OPSSTATE          DP    UP
minecraft-0   Ready   WaitToBeDeleted   0     0
minecraft-1   Ready   None              0     0
minecraft-2   Ready   WaitToBeDeleted   0     0
```

此时若发生缩容，游戏服minecraft-1将得到保护，避免优先删除。

### 游戏服状态异常设置维护中

部署一个带有自定义服务质量的GameServerSet：
```shell
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: demo-gs
  namespace: default
spec:
  replicas: 3
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:healthy
          name: minecraft
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  serviceQualities: # 设置了一个healthy的服务质量
    - name: healthy
      containerName: minecraft
      permanent: false
      #与原生probe类似，本例使用执行脚本的方式探测游戏服是否健康
      exec:
        command: ["bash", "./healthy.sh"]
      serviceQualityAction:
          #探测健康，标记该游戏服运维状态为None
        - state: true
          opsState: None
          #探测不健康，标记该游戏服运维状态为Maintaining
        - state: false
          opsState: Maintaining
EOF
```

部署完成后，由于一切正常，故所有游戏服都为None：
```shell
kubectl get gs
NAME        STATE   OPSSTATE   DP    UP
demo-gs-0   Ready   None       0     0
demo-gs-1   Ready   None       0     0
demo-gs-2   Ready   None       0     0
```

模拟demo-gs-0某进程宕机，游戏服变为Maintaining状态：
```shell
kubectl get gs
NAME        STATE   OPSSTATE     DP    UP
demo-gs-0   Ready   Maintaining  0     0
demo-gs-1   Ready   None         0     0
demo-gs-2   Ready   None         0     0
```

此时gameserver controller会发出 GameServer demo-gs-0 Warning 的 event，配合[kube-event项目](https://github.com/AliyunContainerService/kube-eventer)可实现异常通知：

![](/img/kruisegame/user-manuals/warning-ding.png)

此外，OKG 未来会集成游戏服自动排障/恢复工具，进一步丰富游戏服的自动化运维能力。

## 模板变量支持

自 v1.1.0 起，`ServiceQualityAction` 中的字段（`opsState`、`deletionPriority`、`updatePriority`）支持 Go 模板语法渲染。这允许你根据探测脚本的标准输出动态计算字段值，实现更灵活的游戏服自动化管理。

### 支持的模板变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `.Result` | string | 探测脚本的标准输出（stdout），前后空白已裁剪 |

### 支持的比较函数

以下比较函数可在模板表达式中使用。当两个参数都是合法的数字字符串时，执行数值比较；否则按字典序进行字符串比较。

| 函数 | 说明 | 示例 |
|------|------|------|
| `eq(a, b)` | 相等 | `{{ if eq .Result "ready" }}...{{ end }}` |
| `ne(a, b)` | 不相等 | `{{ if ne .Result "" }}...{{ end }}` |
| `lt(a, b)` | 小于 | `{{ if lt .Result "50" }}...{{ end }}` |
| `le(a, b)` | 小于等于 | `{{ if le .Result "100" }}...{{ end }}` |
| `gt(a, b)` | 大于 | `{{ if gt .Result "2.0" }}...{{ end }}` |
| `ge(a, b)` | 大于等于 | `{{ if ge .Result "1" }}...{{ end }}` |

### 使用场景

#### 根据 CPU 负载动态设置 opsState

当系统负载超过阈值时，自动将游戏服标记为 `Maintaining`：

```yaml
serviceQualities:
  - name: cpu-check
    containerName: game-server
    permanent: false
    exec:
      command: ["bash", "-c", "cat /proc/loadavg | awk '{print $1}'"]
    serviceQualityAction:
      - state: true
        opsState: '{{ if gt .Result "2.0" }}Maintaining{{ else }}None{{ end }}'
```

#### 根据在线玩家数决定是否标记为可删除

当在线玩家数为 0 时，将游戏服标记为 `WaitToBeDeleted`，使其在缩容时优先被删除：

```yaml
serviceQualities:
  - name: player-count
    containerName: game-server
    permanent: false
    exec:
      command: ["bash", "-c", "/opt/get_player_count.sh"]
    serviceQualityAction:
      - state: true
        opsState: '{{ if eq .Result "0" }}WaitToBeDeleted{{ else }}None{{ end }}'
```

#### 根据玩家数量动态设置删除优先级

动态设置 `deletionPriority`，使玩家数更少的游戏服在缩容时优先被删除：

```yaml
serviceQualities:
  - name: player-priority
    containerName: game-server
    permanent: false
    exec:
      command: ["bash", "-c", "/opt/get_player_count.sh"]
    serviceQualityAction:
      - state: true
        deletionPriority: '{{ if eq .Result "0" }}100{{ else }}0{{ end }}'
```

### 完整 GameServerSet 配置示例

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: game-with-template
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:latest
          name: game-server
  serviceQualities:
    - name: load-monitor
      containerName: game-server
      permanent: false
      exec:
        command: ["bash", "-c", "cat /proc/loadavg | awk '{print $1}'"]
      serviceQualityAction:
        # 当探测成功（exit code 0）时，执行模板渲染
        - state: true
          opsState: '{{ if gt .Result "3.0" }}HighLoad{{ else if gt .Result "1.5" }}Busy{{ else }}None{{ end }}'
    - name: player-count
      containerName: game-server
      permanent: false
      exec:
        command: ["bash", "-c", "/opt/get_player_count.sh"]
      serviceQualityAction:
        - state: true
          opsState: '{{ if eq .Result "0" }}WaitToBeDeleted{{ else }}None{{ end }}'
          deletionPriority: '{{ if eq .Result "0" }}100{{ else }}0{{ end }}'
```

### 渲染失败行为

- 如果模板字符串中不包含 `{{`，则原样返回（不尝试渲染）。
- 如果模板解析失败（如语法错误），返回原始字符串，不做任何修改。
- 如果模板执行失败（如引用了未定义的变量），返回原始字符串，不做任何修改。
- 对于 `deletionPriority` 和 `updatePriority` 字段，渲染结果必须是合法的整数。如果不是数字，该动作将被跳过并记录错误日志。

这种安全设计确保模板配置错误不会破坏现有的游戏服状态。

### 注意事项

- 模板语法遵循 Go 的 `text/template` 标准。高级用法请参考 [Go 模板文档](https://pkg.go.dev/text/template)。
- `.Result` 的值是探测脚本的原始标准输出。请确保脚本输出干净的值，不包含多余的换行符或空格。
- 数值比较支持浮点数字符串（如 `"2.5"`、`"0.01"`）。非数值字符串将回退到字典序比较。
- 在 YAML 中使用模板表达式时，务必使用单引号包裹值，以避免 YAML 解析问题（如 `opsState: '{{ ... }}'`）。

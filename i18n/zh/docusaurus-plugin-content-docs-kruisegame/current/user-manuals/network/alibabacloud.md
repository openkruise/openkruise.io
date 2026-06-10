# AlibabaCloud 网络插件

← 返回 [网络模型](../network.md) 总览

## AlibabaCloud-NATGW
### 插件名称

`AlibabaCloud-NATGW`

### Cloud Provider

AlibabaCloud

### 插件说明

- AlibabaCloud-NATGW 使用阿里云公网网关作为游戏服对外服务的承载实体，外网流量通过DNAT规则转发至对应的游戏服中。

- 是否支持网络隔离：否

### 网络参数

Ports

- 含义：填写pod需要暴露的端口
- 填写格式：port1,port2,port3… 例如：80,8080,8888
- 是否支持变更：不支持

Protocol

- 含义：填写服务的网络协议
- 填写格式：例如：tcp，默认为tcp
- 是否支持变更：不支持

Fixed

- 含义：是否固定访问IP/端口。若是，即使pod删除重建，网络内外映射关系不会改变
- 填写格式：false / true
- 是否支持变更：不支持

### 插件配置

无

### 示例说明

OKG支持阿里云下NAT网关模型，使用NATGW的外部IP与端口暴露服务，流量最终将转发至Pod之中。使用方式如下：

```shell
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-natgw
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AlibabaCloud-NATGW
    networkConf:
    - name: Ports
      #暴露的端口，格式如下 {port1},{port2}...
      value: "80"
    - name: Protocol
      #使用的协议，默认为TCP
      value: "tcp"
#   - name: Fixed
#     是否固定映射关系，默认不固定，pod删除后会生成新的外部IP及端口
#     value: "true"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

生成的GameServer中通过networkStatus字段查看游戏服网络信息：

```shell
  networkStatus:
    createTime: "2022-11-23T11:21:34Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 47.97.227.137
      ports:
      - name: "80"
        port: "512"
        protocol: TCP
    internalAddresses:
    - ip: 172.16.0.189
      ports:
      - name: "80"
        port: "80"
        protocol: TCP
    lastTransitionTime: "2022-11-23T11:21:34Z"
    networkType: AlibabaCloud-NATGW
```

访问 47.97.227.137:512 即可

---

## AlibabaCloud-SLB
### 插件名称

`AlibabaCloud-SLB`

### Cloud Provider

AlibabaCloud

### 插件说明

- AlibabaCloud-SLB 使用阿里云经典四层负载均衡（SLB，又称CLB）作为对外服务的承载实体，在此模式下，不同游戏服将使用同一SLB的不同端口，此时SLB只做转发，并未均衡流量。

- 是否支持网络隔离：是

相关设计：https://github.com/openkruise/kruise-game/issues/20

### 网络参数

SlbIds

- 含义：填写slb的id。可填写多个。
- 填写格式：各个slbId用,分割。例如：lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je,...
- 是否支持变更：支持。可追加填写SLB实例id。建议不要更换正在被使用的实例id。

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：支持

Fixed

- 含义：是否固定访问IP/端口。若是，即使pod删除重建，网络内外映射关系不会改变
- 填写格式：false / true
- 是否支持变更：支持

AllowNotReadyContainers

- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：`{containerName_0},{containerName_1},...` 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

LBHealthCheckSwitch

- 含义：是否开启健康检查
- 格式：“on”代表开启，“off”代表关闭。默认为on
- 是否支持变更：支持

LBHealthCheckFlag

- 含义：是否开启http类型健康检查
- 格式：“on”代表开启，“off”代表关闭。默认为off
- 是否支持变更：支持

LBHealthCheckType

- 含义：健康检查协议
- 格式：填写 “tcp” 或者 “http”，默认为tcp
- 是否支持变更：支持

LBHealthCheckConnectTimeout

- 含义：健康检查响应的最大超时时间。
- 格式：单位：秒。取值范围[1, 300]。默认值为“5”
- 是否支持变更：支持

LBHealthyThreshold

- 含义：健康检查连续成功多少次后，将服务器的健康检查状态由失败判定为成功。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBUnhealthyThreshold

- 含义：健康检查连续失败多少次后，将服务器的健康检查状态由成功判定为失败。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBHealthCheckInterval

- 含义：健康检查的时间间隔。
- 格式：单位：秒。取值范围[1, 50]。默认值为“10”
- 是否支持变更：支持

LBHealthCheckProtocolPort

- 含义：http类型健康检查的协议及端口。
- 格式：多个值之间用英文半角逗号（,）分隔。如https:443,http:80
- 是否支持变更：支持

LBHealthCheckUri

- 含义：健康检查类型为HTTP时对应的检查路径。
- 格式：长度为1~80个字符，只能使用字母、数字、字符。 必须以正斜线（/）开头。
- 是否支持变更：支持

LBHealthCheckDomain

- 含义：健康检查类型为HTTP时对应的域名。
- 格式：特定域名长度限制1~80个字符，只能使用小写字母、数字、短划线（-）、半角句号（.）。
- 是否支持变更：支持

LBHealthCheckMethod

- 含义：健康检查类型为HTTP时对应的方法。
- 格式：“GET” 或者 “HEAD”
- 是否支持变更：支持

### 插件配置
```
[alibabacloud]
enable = true
[alibabacloud.slb]
#填写slb可使用的空闲端口段，用于为pod分配外部接入端口，范围为200
max_port = 700
min_port = 500
```

---

## AlibabaCloud-NLB
### 插件名称

`AlibabaCloud-NLB`

### Cloud Provider

AlibabaCloud

### 插件说明

- AlibabaCloud-NLB 使用阿里云网络型负载均衡作为对外服务的承载实体，在此模式下，不同游戏服将使用同一NLB的不同端口，此时NLB只做转发，并未均衡流量。

- 是否支持网络隔离：是

### 网络参数

NlbIds

- 含义：填写nlb的id。可填写多个。
- 填写格式：各个nlbId用,分割。例如：nlb-ji8l844c0qzii1x6mc,nlb-26jbknebrjlejt5abu,...
- 是否支持变更：支持。可追加填写NLB实例id。建议不要更换正在被使用的实例id。

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：支持

Fixed

- 含义：是否固定访问IP/端口。若是，即使pod删除重建，网络内外映射关系不会改变
- 填写格式：false / true
- 是否支持变更：支持

AllowNotReadyContainers

- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：`{containerName_0},{containerName_1},...` 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

LBHealthCheckFlag

- 含义：是否开启健康检查
- 格式：“on”代表开启，“off”代表关闭。默认为on
- 是否支持变更：支持

LBHealthCheckType

- 含义：健康检查协议
- 格式：填写 “tcp” 或者 “http”，默认为tcp
- 是否支持变更：支持

LBHealthCheckConnectPort

- 含义：健康检查的服务器端口。
- 格式：取值范围[0, 65535]。默认值为“0”
- 是否支持变更：支持

LBHealthCheckConnectTimeout

- 含义：健康检查响应的最大超时时间。
- 格式：单位：秒。取值范围[1, 300]。默认值为“5”
- 是否支持变更：支持

LBHealthyThreshold

- 含义：健康检查连续成功多少次后，将服务器的健康检查状态由失败判定为成功。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBUnhealthyThreshold

- 含义：健康检查连续失败多少次后，将服务器的健康检查状态由成功判定为失败。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBHealthCheckInterval

- 含义：健康检查的时间间隔。
- 格式：单位：秒。取值范围[1, 50]。默认值为“10”
- 是否支持变更：支持

LBHealthCheckUri

- 含义：健康检查类型为HTTP时对应的检查路径。
- 格式：长度为1~80个字符，只能使用字母、数字、字符。 必须以正斜线（/）开头。
- 是否支持变更：支持

LBHealthCheckDomain

- 含义：健康检查类型为HTTP时对应的域名。
- 格式：特定域名长度限制1~80个字符，只能使用小写字母、数字、短划线（-）、半角句号（.）。
- 是否支持变更：支持

LBHealthCheckMethod

- 含义：健康检查类型为HTTP时对应的方法。
- 格式：“GET” 或者 “HEAD”
- 是否支持变更：支持

### 插件配置
```
[alibabacloud]
enable = true
[alibabacloud.nlb]
#填写nlb可使用的空闲端口段，用于为pod分配外部接入端口，范围为500
max_port = 1500
min_port = 1000
```

### 示例说明

```
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-nlb
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkConf:
    - name: NlbIds
      value: nlb-muyo7fv6z646ygcxxx
    - name: PortProtocols
      value: "80"
    - name: Fixed
      value: "true"
    networkType: AlibabaCloud-NLB
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

生成的GameServer中通过networkStatus字段查看游戏服网络信息：

```
  networkStatus:
    createTime: "2024-04-28T12:41:56Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - endPoint: nlb-muyo7fv6z646ygcxxx.cn-xxx.nlb.aliyuncs.com
      ip: ""
      ports:
      - name: "80"
        port: 1047
        protocol: TCP
    internalAddresses:
    - ip: 172.16.0.1
      ports:
      - name: "80"
        port: 80
        protocol: TCP
    lastTransitionTime: "2024-04-28T12:41:56Z"
    networkType: AlibabaCloud-NLB
```

访问 nlb-muyo7fv6z646ygcxxx.cn-xxx.nlb.aliyuncs.com:1047 即可

---

## AlibabaCloud-EIP
### 插件名称

`AlibabaCloud-EIP`

### Cloud Provider

AlibabaCloud

### 插件说明

- 为每个GameServer单独分配EIP
- 暴露的公网访问端口与容器中监听的端口一致，通过安全组管理
- 需要在ACK集群安装最新版本ack-extend-network-controller组件，详情请见[组件说明页](https://cs.console.aliyun.com/#/next/app-catalog/ack/incubator/ack-extend-network-controller)

### 网络参数

ReleaseStrategy

- 含义：EIP回收策略。
- 填写格式：
    - Follow：默认值，跟随游戏服生命周期。当游戏服被删除时，EIP也将被回收。
    - Never：不删除podEIP。当不需要时需要手动删除这个podEIP。(通过`kubectl delete podeip {游戏服name} -n {游戏服所在namespace}`)
    - 可直接配置过期时间，例如：5m30s，表示Pod删除5.5分钟后删除podEIP。支持Go类型时间表达式。
- 是否支持变更：否

PoolId

- 含义：EIP地址池ID。可为空，则不使用EIP地址池。
- 是否支持变更：否

ResourceGroupId

- 含义：EIP资源组ID。可为空，则使用默认资源组。
- 是否支持变更：否

Bandwidth

- 含义：峰值带宽。单位：Mbps。可为空，默认为5
- 是否支持变更：否

BandwidthPackageId

- 含义：要绑定已有的共享带宽包ID。可为空，则EIP不绑定共享带宽包。
- 是否支持变更：否

ChargeType

- 含义：EIP的计费方式。
- 填写格式：
    - PayByTraffic：按使用流量计费。
    - PayByBandwidth：按带宽计费，为默认值。
- 是否支持变更：否

Description

- 含义：对EIP资源的描述。
- 是否支持变更：否

### 插件配置

无

### 示例说明

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: eip-nginx
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AlibabaCloud-EIP
    networkConf:
      - name: ReleaseStrategy
        value: Never
      - name: Bandwidth
        value: "3"
      - name: ChargeType
        value: PayByTraffic
  gameServerTemplate:
    spec:
      containers:
        - image: nginx
          name: nginx
```

生成的gameserver eip-nginx-0 networkStatus字段如下所示：

```yaml
  networkStatus:
    createTime: "2023-07-17T10:10:18Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 47.98.xxx.xxx
    internalAddresses:
    - ip: 192.168.1.51
    lastTransitionTime: "2023-07-17T10:10:18Z"
    networkType: AlibabaCloud-EIP
```

生成对应的podeip eip-nginx-0 如下所示：

```yaml
apiVersion: alibabacloud.com/v1beta1
kind: PodEIP
metadata:
  annotations:
    k8s.aliyun.com/eip-controller: ack-extend-network-controller
  creationTimestamp: "2023-07-17T09:58:12Z"
  finalizers:
  - podeip-controller.alibabacloud.com/finalizer
  generation: 1
  name: eip-nginx-1
  namespace: default
  resourceVersion: "41443319"
  uid: 105a9575-998e-4e17-ab91-8f2597eeb55f
spec:
  allocationID: eip-xxx
  allocationType:
    releaseStrategy: Never
    type: Auto
status:
  eipAddress: 47.98.xxx.xxx
  internetChargeType: PayByTraffic
  isp: BGP
  networkInterfaceID: eni-xxx
  podLastSeen: "2023-07-17T10:36:02Z"
  privateIPAddress: 192.168.1.51
  resourceGroupID: rg-xxx
  status: InUse
```

此外，生成的EIP资源在阿里云控制台中会以\{pod namespace\}/\{pod name\}命名，与每一个游戏服一一对应。

---

## AlibabaCloud-SLB-SharedPort

`AlibabaCloud-SLB-SharedPort`

### Cloud Provider

AlibabaCloud

### 插件说明

- AlibabaCloud-SLB-SharedPort 使用阿里云经典四层负载均衡（SLB，又称CLB）作为对外服务的承载实体。但与AlibabaCloud-SLB不同，`AlibabaCloud-SLB-SharedPort` 使用SLB同一端口转发流量，具有负载均衡的特点。
适用于游戏场景下代理（proxy）或网关等无状态网络服务。

- 是否支持网络隔离：是

### 网络参数

SlbIds

- 含义：填写slb的id，支持填写多例
- 填写格式：例如：lb-9zeo7prq1m25ctpfrw1m7
- 是否支持变更：支持。

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：暂不支持。未来将支持

AllowNotReadyContainers

- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：\{containerName_0\},\{containerName_1\},... 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

### 插件配置

无

---

## AlibabaCloud-NLB-SharedPort

### 插件名称

`AlibabaCloud-NLB-SharedPort`

### Cloud Provider

AlibabaCloud

### 插件说明

- AlibabaCloud-NLB-SharedPort 使用阿里云网络型负载均衡（NLB）作为对外服务的承载实体。其与AlibabaCloud-SLB-SharedPort作用类似。
  适用于游戏场景下代理（proxy）或网关等无状态网络服务。

- 是否支持网络隔离：是

### 网络参数

SlbIds

- 含义：填写nlb的id，暂不支持填写多例
- 填写格式：例如：nlb-9zeo7prq1m25ctpfrw1m7
- 是否支持变更：暂不支持。

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：暂不支持。

AllowNotReadyContainers

- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：\{containerName_0\},\{containerName_1\},... 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

### 插件配置

无

### 示例说明

部署一个具有两个容器的GameServerSet，一个容器名为app-2048，另一个为sidecar。
指定网络参数 AllowNotReadyContainers 为 sidecar，则在sidecar原地更新时整个pod依然会提供服务，不会断流。

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gss-2048-nlb
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      maxUnavailable: 100%
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AlibabaCloud-NLB-SharedPort
    networkConf:
      - name: NlbIds
        value: nlb-26jbknebrjlejt5abu
      - name: PortProtocols
        value: 80/TCP
      - name: AllowNotReadyContainers
        value: sidecar
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/acs/2048:v1.0
          name: app-2048
          volumeMounts:
            - name: shared-dir
              mountPath: /var/www/html/js
        - image: registry.cn-beijing.aliyuncs.com/acs/2048-sidecar:v1.0
          name: sidecar
          args:
            - bash
            - -c
            - rsync -aP /app/js/* /app/scripts/ && while true; do echo 11;sleep 2; done
          volumeMounts:
            - name: shared-dir
              mountPath: /app/scripts
      volumes:
        - name: shared-dir
          emptyDir: {}
```

部署成功后，将sidecar镜像更新到v2.0版本，同时观察对应endpoint情况:
```bash
kubectl get ep -w | grep nlb-26jbknebrjlejt5abu
nlb-26jbknebrjlejt5abu      192.168.0.8:80,192.168.0.82:80,192.168.63.228:80    10m
```

等待整个更新过程结束，可以发现ep没有任何变化，说明并未进行摘流。

---

## AlibabaCloud-Multi-NLBs
### 插件名称
`AlibabaCloud-Multi-NLBs`

### Cloud Provider
AlibabaCloud

### 插件说明

在游戏场景，往往有多线接入的需求，即通过两个或两个以上的运营商带宽接入，实现玩家跨运营商快速访问游戏服的目的。
此时，单个游戏服需要多个接入端点，每个接入端点绑定独立运营商的公网IP。

### 网络参数

NlbIdNames

- 含义：填写nlb的id以及对应名称。可填写多个。
- 填写格式：\{nlb-id-0\}/\{name-0\},\{nlb-id-1\}/\{name-1\}。例如：nlb-ji8l844c0qzii1x6mc/DianXin,nlb-26jbknebrjlejt5abu/LianTong,...
- 是否支持变更：不支持

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写)。支持协议如下：TCP、UDP、TCPUDP（表示同时使用TCP与UDP）。
- 是否支持变更：支持

Fixed

- 含义：是否固定访问IP/端口。若是，即使pod删除重建，网络内外映射关系不会改变
- 填写格式：false / true
- 是否支持变更：支持

AllowNotReadyContainers

- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：\{containerName_0\},\{containerName_1\},... 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

LBHealthCheckFlag

- 含义：是否开启健康检查
- 格式：“on”代表开启，“off”代表关闭。默认为on
- 是否支持变更：支持

LBHealthCheckType

- 含义：健康检查协议
- 格式：填写 “tcp” 或者 “http”，默认为tcp
- 是否支持变更：支持

LBHealthCheckConnectPort

- 含义：健康检查的服务器端口。
- 格式：取值范围[0, 65535]。默认值为“0”
- 是否支持变更：支持

LBHealthCheckConnectTimeout

- 含义：健康检查响应的最大超时时间。
- 格式：单位：秒。取值范围[1, 300]。默认值为“5”
- 是否支持变更：支持

LBHealthyThreshold

- 含义：健康检查连续成功多少次后，将服务器的健康检查状态由失败判定为成功。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBUnhealthyThreshold

- 含义：健康检查连续失败多少次后，将服务器的健康检查状态由成功判定为失败。
- 格式：取值范围[2, 10]。默认值为“2”
- 是否支持变更：支持

LBHealthCheckInterval

- 含义：健康检查的时间间隔。
- 格式：单位：秒。取值范围[1, 50]。默认值为“10”
- 是否支持变更：支持

LBHealthCheckUri

- 含义：健康检查类型为HTTP时对应的检查路径。
- 格式：长度为1~80个字符，只能使用字母、数字、字符。 必须以正斜线（/）开头。
- 是否支持变更：支持

LBHealthCheckDomain

- 含义：健康检查类型为HTTP时对应的域名。
- 格式：特定域名长度限制1~80个字符，只能使用小写字母、数字、短划线（-）、半角句号（.）。
- 是否支持变更：支持

LBHealthCheckMethod

- 含义：健康检查类型为HTTP时对应的方法。
- 格式：“GET” 或者 “HEAD”
- 是否支持变更：支持

### 插件配置

复用nlb的参数配置，默认为：

```
[alibabacloud.nlb]
max_port = 1502
min_port = 1000
block_ports = [1025, 1434, 1068]
```

### 示例说明

部署的Gss：
```
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: multi-nlbs
  namespace: default
spec:
  replicas: 2
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkConf:
    - name: NlbIdNames
      value: nlb-ji8l844c0qzii1x6mc/DianXin,nlb-26jbknebrjlejt5abu/LianTong,nlb-qi8lz598c0qzks1x6p2/YiDong
    - name: PortProtocols
      value: "8888/TCPUDP" #支持TCP UDP复用同个端口
    networkType: AlibabaCloud-Multi-NLBs
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

生成的GameServer：
```
  networkStatus:
    createTime: "2024-10-28T12:41:56Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - endPoint: nlb-xxx0.cn.nlb.aliyuncs.com/DianXin,nlb-xxx1.cn.nlb.aliyuncs.com/LianTong,nlb-xxx2.cn.nlb.aliyuncs.com/YiDong
      ip: ""
      ports:
      - name: "8888-udp"
        port: 1047
        protocol: UDP
    - endPoint: nlb-xxx0.cn.nlb.aliyuncs.com/DianXin,nlb-xxx1.cn.nlb.aliyuncs.com/LianTong,nlb-xxx2.cn.nlb.aliyuncs.com/YiDong
      ip: ""
      ports:
      - name: "8888-tcp"
        port: 1047
        protocol: TCP
    internalAddresses:
    - ip: 172.16.0.1
      ports:
      - name: "8888-udp"
        port: 8888
        protocol: UDP
      - name: "8888-tcp"
        port: 8888
        protocol: TCP
    lastTransitionTime: "2024-10-28T12:41:56Z"
    networkType: AlibabaCloud-Multi-NLBs
```

---

## AlibabaCloud-AutoNLBs

### 插件名称
`AlibabaCloud-AutoNLBs`

### Cloud Provider
AlibabaCloud

### 插件说明

高效、灵活、自动化和扩展行更佳。支持：
1. 自动化NLB实例创建
2. 提供自动预热能力，根据用户参数定义，随着pod数量增多提前创建nlb端口，加快pod与nlb端口绑定速率。

### 网络参数

PortProtocols
- 含义：pod暴露的端口及协议，支持填写多个端口/协议
- 格式：port1/protocol1,port2/protocol2,...（协议需大写)。支持协议如下：TCP、UDP、TCPUDP（表示同时使用TCP与UDP）。
- 是否支持变更：不支持

ReserveNlbNum
- 含义：为该GameServerSet预留的NLB个数
- 填写格式：正整数。默认为1。
- 是否支持变更：不支持

ZoneMaps
- 含义：希望创建NLB所在可用区及对应的交换机
- 填写格式：可用区1:vsw实例ID1,可用区2:vsw实例ID2,....例如，ap-southeast-1a:vsw-t4n9vjefpmmvu3uswixxx,ap-southeast-1b:vsw-t4nr8iynqud2mxu1lyxxx
- 是否支持变更：不支持

MinPort
- 含义：NLB实例Listener起始端口号
- 填写格式：正整数，必填
- 是否支持变更：不支持

MaxPort
- 含义：NLB实例Listener最大端口号
- 填写格式：正整数，必填
- 是否支持变更：不支持

BlockPorts
- 含义：NLB实例Listener禁用端口。遇到改列表下的端口号跳过不使用设计原因：https://github.com/openkruise/kruise-game/issues/174
- 填写格式：端口1,端口2,... 如，3127,3128
- 是否支持变更：不支持

---

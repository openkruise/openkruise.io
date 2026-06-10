# TencentCloud 网络插件

← 返回 [网络模型](../network.md) 总览

## TencentCloud-CLB

### 插件名称

`TencentCloud-CLB`

### Cloud Provider

TencentCloud

### 插件说明

- TencentCloud-CLB 使用腾讯云负载均衡器（CLB）作为对外服务的承载实体，在此模式下，不同游戏服使用 CLB 的不同端口对外暴露，此时 CLB 只做转发，并未均衡流量。
- 需安装 [tke-extend-network-controller](https://github.com/tkestack/tke-extend-network-controller) 网络插件(可通过 TKE 应用市场安装)，且最低版本要求为 `2.1.1`；同时也需要安装 [cert-manager](https://cert-manager.io/) （`tke-extend-network-controller` 的依赖，也可通过 TKE 应用市场安装）。
- 是否支持网络隔离：是。

### 网络参数

ClbIds

- 含义：填写clb的id。可填写多个。
- 填写格式：各个clbId用,分割。例如：lb-xxxx,lb-yyyy,...
- 是否支持变更：支持。

PortProtocols

- 含义：pod暴露的端口及协议，支持填写多个端口/协议。
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：支持。

MinPort

- 含义：（可选）指定分配 CLB 端口时的起始端口号，默认值为 30000。
- 格式：数字。例如：30000。
- 是否支持变更：不支持。

ListenerQuota
- 含义：（可选）指定分配 CLB 端口时的起始端口号，默认值为 50（仅在申请调整过 CLB 实例维度的监听器数量配额时才指定此参数，没有调整过或调整的是账号维度的监听器数量配额均无需配置此参数）。
- 格式：数字。例如：50。
- 是否支持变更：不支持。

### 插件配置

```toml
[tencentcloud]
enable = true
```

### 示例说明

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: clb-nginx
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: TencentCloud-CLB
    networkConf:
      - name: ClbIds
        value: "lb-3ip9k5kr,lb-4ia8k0yh"
      - name: PortProtocols
        value: "80/TCP,7777/UDP"
      - name: MinPort
        value: "30000"
  gameServerTemplate:
    spec:
      containers:
        - image: nginx
          name: nginx
```

生成的 gameserver clb-nginx-0 networkStatus 字段如下所示：

```yaml
  networkStatus:
    createTime: "2025-06-09T12:28:39Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 139.155.64.52
      ports:
      - name: "80"
        port: 30000
        protocol: TCP
    - ip: 139.155.64.52
      ports:
      - name: "7777"
        port: 30000
        protocol: UDP
    internalAddresses:
    - ip: 172.16.41.2
      ports:
      - name: "80"
        port: 80
        protocol: TCP
    - ip: 172.16.41.2
      ports:
      - name: "7777"
        port: 7777
        protocol: UDP
    lastTransitionTime: "2025-06-09T12:28:39Z"
    networkType: TencentCloud-CLB
```

---

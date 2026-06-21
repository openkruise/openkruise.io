# AlibabaCloud network plugins

← Back to [Network](../network.md) overview

## AlibabaCloud-NATGW
### Plugin name

`AlibabaCloud-NATGW`

### Cloud Provider

AlibabaCloud

### Plugin description

- AlibabaCloud-NATGW enables game servers to be accessed from the Internet by using an Internet NAT gateway of Alibaba Cloud. Internet traffic is forwarded to the corresponding game servers based on DNAT rules.

- This network plugin does not support network isolation.

### Network parameters

Ports

- Meaning: the ports in the pod to be exposed.
- Value: in the format of port1,port2,port3… Example: 80,8080,8888.
- Configuration change supported or not: no.

Protocol

- Meaning: the network protocol.
- Value: an example value can be tcp. The value is tcp by default.
- Configuration change supported or not: no.

Fixed

- Meaning: whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value: false or true.
- Configuration change supported or not: no.

### Plugin configuration

None

### Example

OpenKruiseGame supports the NAT gateway model of Alibaba Cloud. A NAT gateway exposes its external IP addresses and ports by using which Internet traffic is forwarded to pods. The following example shows the details:

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
      # The ports to be exposed. The value is in the following format: {port1},{port2}...
      value: "80"
    - name: Protocol
      # The protocol. The value is TCP by default.
      value: "tcp"
#   - name: Fixed
# Specify whether the mapping relationship is fixed. By default, the mapping relationship is not fixed, that is, a new external IP address and port are generated after the pod is deleted.
#     value: "true"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

Use the networkStatus field in the generated GameServer to view the network status information of the game server.

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

Clients can access the game server by using 47.97.227.137:512.

---

## AlibabaCloud-SLB
### Plugin name

`AlibabaCloud-SLB`

### Cloud Provider

AlibabaCloud

### Plugin description

- AlibabaCloud-SLB enables game servers to be accessed from the Internet by using Layer 4 Classic Load Balancer (CLB) of Alibaba Cloud. CLB is a type of Server Load Balancer (SLB). AlibabaCloud-SLB uses different ports of the same CLB instance to forward Internet traffic to different game servers. The CLB instance only forwards traffic, but does not implement load balancing.

- This network plugin supports network isolation.

Related design: https://github.com/openkruise/kruise-game/issues/20

### Network parameters

SlbIds

- Meaning: the CLB instance ID. You can fill in multiple ids.
- Value: in the format of slbId-0,slbId-1,... An example value can be "lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je"
- Configuration change supported or not: yes. You can add new slbIds at the end. However, it is recommended not to change existing slbId that is in use.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

Fixed

- Meaning: whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value: false or true.
- Configuration change supported or not: yes.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: `{containerName_0},{containerName_1},...` Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

LBHealthCheckSwitch

- Meaning：Whether to enable health check
- Format："on" means on, "off" means off. Default is on
- Whether to support changes: Yes

LBHealthCheckFlag

- Meaning: Whether to enable http type health check
- Format: "on" means on, "off" means off. Default is on
- Whether to support changes: Yes

LBHealthCheckType

- Meaning: Health Check Protocol
- Format: fill in "tcp" or "http", the default is tcp
- Whether to support changes: Yes

LBHealthCheckConnectTimeout

- Meaning: Maximum timeout for health check response.
- Format: Unit: seconds. The value range is [1, 300]. The default value is "5"
- Whether to support changes: Yes

LBHealthyThreshold

- Meaning: After the number of consecutive successful health checks, the health check status of the server will be determined from failure to success.
- Format: Value range [2, 10]. Default value is "2"
- Whether to support changes: Yes

LBUnhealthyThreshold

- Meaning: After the number of consecutive health check failures, the health check status of the server will be determined from success to failure.
- Format: Value range [2, 10]. The default value is "2"
- Whether to support changes: Yes

LBHealthCheckInterval

- Meaning: health check interval.
- Format: Unit: seconds. The value range is [1, 50]. The default value is "10"
- Whether to support changes: Yes

LBHealthCheckProtocolPort

- Meaning：the protocols & ports of HTTP type health check.
- Format：Multiple values are separated by ','. e.g. https:443,http:80
- Whether to support changes: Yes

LBHealthCheckUri

- Meaning: The corresponding uri when the health check type is HTTP.
- Format: The length is 1~80 characters, only letters, numbers, and characters can be used. Must start with a forward slash (/). Such as "/test/index.html"
- Whether to support changes: Yes

LBHealthCheckDomain

- Meaning: The corresponding domain name when the health check type is HTTP.
- Format: The length of a specific domain name is limited to 1~80 characters. Only lowercase letters, numbers, dashes (-), and half-width periods (.) can be used.
- Whether to support changes: Yes

LBHealthCheckMethod

- Meaning: The corresponding method when the health check type is HTTP.
- Format: "GET" or "HEAD"
- Whether to support changes: Yes

### Plugin configuration
```
[alibabacloud]
enable = true
[alibabacloud.slb]
# Specify the range of available ports of the CLB instance. Ports in this range can be used to forward Internet traffic to pods. In this example, the range includes 200 ports.
max_port = 700
min_port = 500
```

---

## AlibabaCloud-NLB
### Plugin name

`AlibabaCloud-NLB`

### Cloud Provider

AlibabaCloud

### Plugin description

- AlibabaCloud-NLB enables game servers to be accessed from the Internet by using Layer 4 Network Load Balancer (NLB) of Alibaba Cloud. AlibabaCloud-NLB uses different ports of the same NLB instance to forward Internet traffic to different game servers. The NLB instance only forwards traffic, but does not implement load balancing.

- This network plugin supports network isolation.

### Network parameters

NlbIds

- Meaning: the NLB instance ID. You can fill in multiple ids.
- Value: in the format of nlbId-0,nlbId-1,... An example value can be "nlb-ji8l844c0qzii1x6mc,nlb-26jbknebrjlejt5abu"
- Configuration change supported or not: yes. You can add new nlbIds at the end. However, it is recommended not to change existing nlbId that is in use.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

Fixed

- Meaning: whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value: false or true.
- Configuration change supported or not: yes.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: `{containerName_0},{containerName_1},...` Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

LBHealthCheckFlag

- Meaning: Whether to enable health check
- Format: "on" means on, "off" means off. Default is on
- Whether to support changes: Yes

LBHealthCheckType

- Meaning: Health Check Protocol
- Format: fill in "tcp" or "http", the default is tcp
- Whether to support changes: Yes

LBHealthCheckConnectPort

- Meaning: Server port for health check.
- Format: Value range [0, 65535]. Default value is "0"
- Whether to support changes: Yes

LBHealthCheckConnectTimeout

- Meaning: Maximum timeout for health check response.
- Format: Unit: seconds. The value range is [1, 300]. The default value is "5"
- Whether to support changes: Yes

LBHealthyThreshold

- Meaning: After the number of consecutive successful health checks, the health check status of the server will be determined from failure to success.
- Format: Value range [2, 10]. Default value is "2"
- Whether to support changes: Yes

LBUnhealthyThreshold

- Meaning: After the number of consecutive health check failures, the health check status of the server will be determined from success to failure.
- Format: Value range [2, 10]. The default value is "2"
- Whether to support changes: Yes

LBHealthCheckInterval

- Meaning: health check interval.
- Format: Unit: seconds. The value range is [1, 50]. The default value is "10"
- Whether to support changes: Yes

LBHealthCheckUri

- Meaning: The corresponding uri when the health check type is HTTP.
- Format: The length is 1~80 characters, only letters, numbers, and characters can be used. Must start with a forward slash (/). Such as "/test/index.html"
- Whether to support changes: Yes

LBHealthCheckDomain

- Meaning: The corresponding domain name when the health check type is HTTP.
- Format: The length of a specific domain name is limited to 1~80 characters. Only lowercase letters, numbers, dashes (-), and half-width periods (.) can be used.
- Whether to support changes: Yes

LBHealthCheckMethod

- Meaning: The corresponding method when the health check type is HTTP.
- Format: "GET" or "HEAD"
- Whether to support changes: Yes

### Plugin configuration
```
[alibabacloud]
enable = true
[alibabacloud.nlb]
# Specify the range of available ports of the NLB instance. Ports in this range can be used to forward Internet traffic to pods. In this example, the range includes 500 ports.
max_port = 1500
min_port = 1000
```

### Example

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

The network status of GameServer would be as follows:

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

Clients can access the game server by using nlb-muyo7fv6z646ygcxxx.cn-xxx.nlb.aliyuncs.com:1047

---

## AlibabaCloud-EIP
### Plugin name

`AlibabaCloud-EIP`

### Cloud Provider

AlibabaCloud

### Plugin description

- Allocate a separate EIP for each GameServer
- The exposed public access port is consistent with the port monitored in the container, which is managed by security group.
- It is necessary to install the latest version of the ack-extend-network-controller component in the ACK cluster. For details, please refer to the [component description page](https://cs.console.aliyun.com/#/next/app-catalog/ack/incubator/ack-extend-network-controller).
### Network parameters

ReleaseStrategy

- Meaning: Specifies the EIP release policy.
- Value:
  - Follow: follows the lifecycle of the pod that is associated with the EIP. This is the default value.
  - Never: does not release the EIP. You need to manually release the EIP when you no longer need the EIP. ( By `kubectl delete podeip {gameserver name} -n {gameserver namespace}`)
  - You can also specify the timeout period of the EIP. For example, if you set the time period to 5m30s, the EIP is released 5.5 minutes after the pod is deleted. Time expressions written in Go are supported.
- Configuration change supported or not: no.

PoolId

- Meaning: Specifies the EIP address pool. For more information. It could be nil.
- Configuration change supported or not: no.

ResourceGroupId

- Meaning: Specifies the resource group to which the EIP belongs. It could be nil.
- Configuration change supported or not: no.

Bandwidth

- Meaning: Specifies the maximum bandwidth of the EIP. Unit: Mbit/s. It could be nil. Default is 5.
- Configuration change supported or not: no.

BandwidthPackageId

- Meaning: Specifies the EIP bandwidth plan that you want to use.
- Configuration change supported or not: no.

ChargeType

- Meaning: Specifies the metering method of the EIP.
- Value：
  - PayByTraffic: Fees are charged based on data transfer.
  - PayByBandwidth: Fees are charged based on bandwidth usage.
- Configuration change supported or not: no.

Description

- Meaning: The description of EIP resource
- Configuration change supported or not: no.

### Plugin configuration

None

### Example

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

The network status of GameServer would be as follows:

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

The generated podeip eip-nginx-0 would be as follows：

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

In addition, the generated EIP resource will be named after `{pod namespace}/{pod name}` in the Alibaba Cloud console, which corresponds to each game server one by one.

---

## AlibabaCloud-SLB-SharedPort
### Plugin name

`AlibabaCloud-SLB-SharedPort`

### Cloud Provider

AlibabaCloud

### Plugin description

- AlibabaCloud-SLB-SharedPort enables game servers to be accessed from the Internet by using Layer 4 CLB of Alibaba Cloud. Unlike AlibabaCloud-SLB, `AlibabaCloud-SLB-SharedPort` uses the same port of a CLB instance to forward traffic to game servers, and the CLB instance implements load balancing.
  This network plugin applies to stateless network services, such as proxy or gateway, in gaming scenarios.

- This network plugin supports network isolation.

### Network parameters

SlbIds

- Meaning: the CLB instance IDs. You can specify multiple CLB instance IDs.
- Value: an example value can be lb-9zeo7prq1m25ctpfrw1m7.
- Configuration change supported or not: yes.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: no. The configuration change can be supported in future.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: `{containerName_0},{containerName_1},...` Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

---

## AlibabaCloud-NLB-SharedPort

### Plugin name

`AlibabaCloud-NLB-SharedPort`

### Cloud Provider

AlibabaCloud

### Plugin description

- AlibabaCloud-NLB-SharedPort enables game servers to be accessed from the Internet by using Layer 4 NLB of Alibaba Cloud, which is similar to AlibabaCloud-SLB-SharedPort.
  This network plugin applies to stateless network services, such as proxy or gateway, in gaming scenarios.

- This network plugin supports network isolation.

### Network parameters

SlbIds

- Meaning: the CLB instance IDs. You can specify multiple NLB instance IDs.
- Value: an example value can be nlb-9zeo7prq1m25ctpfrw1m7
- Configuration change supported or not: no.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: no.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: `{containerName_0},{containerName_1},...` Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

### Plugin configuration

None

### Example

Deploy a GameServerSet with two containers, one named app-2048 and the other named sidecar.

Specify the network parameter AllowNotReadyContainers as sidecar,
then the entire pod will still provide services when the sidecar is updated in place.

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

After successful deployment, update the sidecar image to v2.0 and observe the corresponding endpoint:

```bash
kubectl get ep -w | grep nlb-26jbknebrjlejt5abu
nlb-26jbknebrjlejt5abu      192.168.0.8:80,192.168.0.82:80,192.168.63.228:80    10m
```

After waiting for the entire update process to end, you can find that there are no changes in the ep, indicating that no extraction has been performed.

### Plugin configuration

None

---

## AlibabaCloud-Multi-NLBs
### Plugin name
`AlibabaCloud-Multi-NLBs`

### Cloud Provider
AlibabaCloud

### Plugin description

In gaming scenarios, there is often a need for multi-line access, that is, access through two or more operators' bandwidth to enable players to quickly access gaming servers across operators.
In this case, a single gaming server requires multiple access endpoints, each of which is bound to an independent operator's public IP.

### Network parameters

NlbIdNames

- Meaning：the NLB instance ID and Name(self-define name). You can fill in multiple ids & names.
- Value：in the format of `{nlb-id-0}/{name-0},{nlb-id-1}/{name-1}`。An example value can be: "nlb-ji8l844c0qzii1x6mc/DianXin,nlb-26jbknebrjlejt5abu/LianTong"
- Configuration change supported or not: yes. You can add new nlbIds at the end. However, it is recommended not to change existing nlbId that is in use.

PortProtocols

- Meaning：the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value：in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters. support protocol types: TCP、UDP、TCPUDP(means use same port for TCP & UDP at same time)
- Configuration change supported or not: yes.

Fixed

- Meaning: whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value: false or true.
- Configuration change supported or not: yes.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: `{containerName_0},{containerName_1},...` Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

LBHealthCheckFlag

- Meaning: Whether to enable health check
- Format: "on" means on, "off" means off. Default is on
- Whether to support changes: Yes

LBHealthCheckType

- Meaning: Health Check Protocol
- Format: fill in "tcp" or "http", the default is tcp
- Whether to support changes: Yes

LBHealthCheckConnectPort

- Meaning: Server port for health check.
- Format: Value range [0, 65535]. Default value is "0"
- Whether to support changes: Yes

LBHealthCheckConnectTimeout

- Meaning: Maximum timeout for health check response.
- Format: Unit: seconds. The value range is [1, 300]. The default value is "5"
- Whether to support changes: Yes

LBHealthyThreshold

- Meaning: After the number of consecutive successful health checks, the health check status of the server will be determined from failure to success.
- Format: Value range [2, 10]. Default value is "2"
- Whether to support changes: Yes

LBUnhealthyThreshold

- Meaning: After the number of consecutive health check failures, the health check status of the server will be determined from success to failure.
- Format: Value range [2, 10]. The default value is "2"
- Whether to support changes: Yes

LBHealthCheckInterval

- Meaning: health check interval.
- Format: Unit: seconds. The value range is [1, 50]. The default value is "10"
- Whether to support changes: Yes

LBHealthCheckUri

- Meaning: The corresponding uri when the health check type is HTTP.
- Format: The length is 1~80 characters, only letters, numbers, and characters can be used. Must start with a forward slash (/). Such as "/test/index.html"
- Whether to support changes: Yes

LBHealthCheckDomain

- Meaning: The corresponding domain name when the health check type is HTTP.
- Format: The length of a specific domain name is limited to 1~80 characters. Only lowercase letters, numbers, dashes (-), and half-width periods (.) can be used.
- Whether to support changes: Yes

LBHealthCheckMethod

- Meaning: The corresponding method when the health check type is HTTP.
- Format: "GET" or "HEAD"
- Whether to support changes: Yes

### Plugin configuration

use the configuration of nlb，default is:

```
[alibabacloud.nlb]
max_port = 1502
min_port = 1000
block_ports = [1025, 1434, 1068]
```

### Example

Deploy a GameServerSet yaml：
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
      value: "8888/TCPUDP"
    networkType: AlibabaCloud-Multi-NLBs
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

The GameServers will be like：
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

### Plugin name
`AlibabaCloud-AutoNLBs`

### Cloud Provider
AlibabaCloud

### Plugin description
Highly efficient, flexible, automated, and with better scalability. Supports:

1. Automated NLB instance creation
2. Provides automatic preheating capability. Based on user-defined parameters, it pre-creates NLB ports in advance as the number of pods increases, accelerating the binding rate between pods and NLB ports.

### Network parameters

PortProtocols
- Meaning: The ports and protocols exposed by the pod. Supports multiple port/protocol entries.
- Format: port1/protocol1,port2/protocol2,... (protocols must be uppercase). Supported protocols: TCP, UDP, TCPUDP (indicating simultaneous use of TCP and UDP).
- Whether to support changes: No

ReserveNlbNum
- Meaning: Number of NLB instances reserved for this GameServerSet.
- Format: Positive integer. Default is 1.
- Whether to support changes: No

ZoneMaps
- Meaning: Desired availability zones for NLB creation and corresponding vSwitches.
- Format: availability_zone1:vsw_instance_id1,availability_zone2:vsw_instance_id2,.... Example: ap-southeast-1a:vsw-t4n9vjefpmmvu3uswixxx,ap-southeast-1b:vsw-t4nr8iynqud2mxu1lyxxx
- Whether to support changes: No

MinPort
- Meaning: Starting port number for NLB instance listener.
- Format: Required positive integer.
- Whether to support changes: No

MaxPort
- Meaning: Maximum port number for NLB instance listener. 
- Format: Required positive integer. 
- Whether to support changes: No

BlockPorts
- Meaning: Disabled ports for NLB instance listener. Ports in this list are skipped and not used (design rationale: GitHub Issue #174). 
- Format: port1,port2,... (e.g., 3127,3128)
- Whether to support changes: No

---

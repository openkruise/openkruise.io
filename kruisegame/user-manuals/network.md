# Network
## Feature overview

As mentioned in [Design concept of OpenKruiseGame](../design-concept.md), the access network of game servers is the main concern of game developers.
For a non-gateway architecture, game developers need to consider how to expose external IP addresses and ports of game servers for access by players.
Different network products are usually required for access in different scenarios, and the network products may be provided by different cloud service providers. This increases the complexity of the access network. Cloud Provider & Network Plugin of OpenKruiseGame is designed to resolve this issue.
OpenKruiseGame integrates different network plugins of different cloud service providers. You can use GameServerSet to set network parameters for game servers. Moreover, you can view network status information in the generated GameServer. This significantly reduces the complexity of the access network of game servers.

## Network plugins

OpenKruiseGame supports the following network plugins:
- Kubernetes-HostPort
- Kubernetes-NodePort
- Kubernetes-Ingress
- AlibabaCloud-NATGW
- AlibabaCloud-SLB
- AlibabaCloud-NLB
- AlibabaCloud-EIP
- AlibabaCloud-SLB-SharedPort
- AlibabaCloud-NLB-SharedPort
- Volcengine-CLB
- AmazonWebServices-NLB
- TencentCloud-CLB
- JdCloud-NLB
- JdCloud-EIP

---
### Kubernetes-HostPort
#### Plugin name

`Kubernetes-HostPort`

#### Cloud Provider

Kubernetes

#### Plugin description
- HostPort enables game servers to be accessed from the Internet by forwarding Internet traffic to the game servers by using the external IP address and ports exposed by the host where the game servers are located. The exposed IP address of the host must be a public IP address so that the host can be accessed from the Internet.

- In the configuration file, you can specify a custom range of available host ports. The default port range is 8000 to 9000. This network plugin can help you allocate and manage host ports to prevent port conflicts.

- This network plugin does not support network isolation.

- Kubernetes-HostPort relies on the hostPort pattern provided by Kubernetes. Note that some CNI plugins exist that do not support hostPort, such as Terway.

#### Network parameters

ContainerPorts

- Meaning: the name of the container that provides services, the ports to be exposed, and the protocols.
- Value: in the format of containerName:port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters. Example: `game-server:25565/TCP`.
- Configuration change supported or not: no. The value of this parameter is effective until the pod lifecycle ends.

#### Plugin configuration

```
[kubernetes]
enable = true
[kubernetes.hostPort]
# Specify the range of available ports of the host. Ports in this range can be used to forward Internet traffic to pods.
max_port = 9000
min_port = 8000
```

#### Example

OpenKruiseGame allows game servers to use the HostPort network in native Kubernetes clusters. The host where game servers are located exposes its external IP address and ports by using which Internet traffic is forwarded to the internal ports of the game servers. The following example shows the details:

Deploy the GameServerSet object that contains the network field.

```
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-hostport
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: Kubernetes-HostPort
    networkConf:
    # The network configuration is specified in the form of a key-value pair. The network configuration is determined by the network plugin. Different network plugins correspond to different network configurations.
    - name: ContainerPorts
      # The value of ContainerPorts is in the following format: {containerName}:{port1}/{protocol1},{port2}/{protocol2},...
      value: "gameserver:80"
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
    createTime: "2022-11-23T10:57:01Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 48.98.98.8
      ports:
      - name: gameserver-80
        port: 8211
        protocol: TCP
    internalAddresses:
    - ip: 172.16.0.8
      ports:
      - name: gameserver-80
        port: 80
        protocol: TCP
    lastTransitionTime: "2022-11-23T10:57:01Z"
    networkType: Kubernetes-HostPort
```

Clients can access the game server by using 48.98.98.8:8211.

---

### Kubernetes-NodePort
#### Plugin name

`Kubernetes-NodePort`

#### Cloud Provider

Kubernetes

#### Plugin description
- Kubernetes NodePort leverages the Kubernetes NodePort type of Service to expose game server services externally. The host machine needs to be configured with a public IP and have the capability to be accessed from the internet.

- This plugin relies on the limitation of the number of NodePorts available. By default, the open ports range from 30000 to 32767. If you wish to open more ports, please modify the APIServer service-node-port-range parameter.

- This plugin does not support network isolation.


#### Network parameters

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

Fixed

- Meaning: whether the ingress object is still retained when the pod is deleted
- Value format: true / false
- Configuration change supported or not: yes.

AllowNotReadyContainers

- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: {containerName_0},{containerName_1},... Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

#### Plugin configuration

无

#### Example

```
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-nodeport
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: Kubernetes-NodePort
    networkConf:
    - name: PortProtocols
      value: "80"
    - name: Fixed
      value: "false"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

Use the networkStatus field in the generated GameServer to view the network status information of the game server:

```shell
  networkStatus:
    createTime: "2024-04-28T12:28:27Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 120.78.78.8
      ports:
      - name: "80"
        port: 31480
        protocol: TCP
    internalAddresses:
    - ip: 172.16.0.82
      ports:
      - name: "80"
        port: 80
        protocol: TCP
    lastTransitionTime: "2024-04-28T12:28:27Z"
    networkType: Kubernetes-NodePort
```

Clients can access the game server by using 120.78.78.8:31480

---

### Kubernetes-Ingress
#### Plugin name

`Kubernetes-Ingress`

#### Cloud Provider

Kubernetes

#### Plugin description

- OKG provides the Ingress network model for games such as H5 games that require the application layer network model. This plugin will automatically set the corresponding path for each game server, which is related to the game server ID and is unique for each game server.

- This network plugin does not support network isolation.

#### Network parameters

Path

- Meaning: Access path. Each game server has its own access path based on its ID.
- Value format: Add <id\> to any position in the original path(consistent with the Path field in HTTPIngressPath), and the plugin will generate the path corresponding to the game server ID. For example, when setting the path to /game<id\>, the path for game server 0 is /game0, the path for game server 1 is /game1, and so on.
- Configuration change supported or not: yes.

PathType

- Meaning: Path type. Same as the PathType field in HTTPIngressPath.
- Value format: Same as the PathType field in HTTPIngressPath.
- Configuration change supported or not: yes.

Port

- Meaning: Port value exposed by the game server.
- Value format: port number
- Configuration change supported or not: yes.

IngressClassName

- Meaning: Specify the name of the IngressClass. Same as the IngressClassName field in IngressSpec.
- Value format: Same as the IngressClassName field in IngressSpec.
- Configuration change supported or not: yes.

Host

- Meaning: Domain name.  Each game server has its own domain based on its ID.
- Value format: Add <id\> to any position in the domain, and the plugin will generate the domain corresponding to the game server ID. For example, when setting the domain to test.game<id\>.cn-hangzhou.ali.com, the domain for game server 0 is test.game0.cn-hangzhou.ali.com, the domain for game server 1 is test.game1.cn-hangzhou.ali.com, and so on.
- Configuration change supported or not: yes.

TlsHosts

- Meaning: List of hosts containing TLS certificates. Similar to the Hosts field in IngressTLS.
- Value format: host1,host2,... For example, xxx.xx1.com,xxx.xx2.com
- Configuration change supported or not: yes.

TlsSecretName

- Meaning: Same as the SecretName field in IngressTLS.
- Value format: Same as the SecretName field in IngressTLS.
- Configuration change supported or not: yes.

Annotation

- Meaning: as an annotation of the Ingress object
- Value format: key: value (note the space after the colon), for example: nginx.ingress.kubernetes.io/rewrite-target: /$2
- Configuration change supported or not: yes.

Fixed

- Meaning: whether the ingress object is still retained when the pod is deleted
- Value format: true / false
- Configuration change supported or not: yes.

_additional explanation_

- If you want to fill in multiple annotations, you can define multiple slices named Annotation in the networkConf.
- Supports filling in multiple paths. The path, path type, and port correspond one-to-one in the order of filling. When the number of paths is greater than the number of path types(or port), non-corresponding paths will match the path type(or port) that was filled in first.


#### Plugin configuration

None

#### Example

Set GameServerSet.Spec.Network:

```yaml
  network:
    networkConf:
    - name: IngressClassName
      value: nginx
    - name: Port
      value: "80"
    - name: Path
      value: /game<id>(/|$)(.*)
    - name: Path
      value: /test-<id>
    - name: Host
      value: test.xxx.cn-hangzhou.ali.com
    - name: PathType
      value: ImplementationSpecific
    - name: TlsHosts
      value: xxx.xx1.com,xxx.xx2.com
    - name: Annotation
      value: 'nginx.ingress.kubernetes.io/rewrite-target: /$2'
    - name: Annotation
      value: 'nginx.ingress.kubernetes.io/random: xxx'
    networkType: Kubernetes-Ingress

```
This will generate a service and an ingress object for each replica of GameServerSet. The configuration for the ingress of the 0th game server is shown below:

```yaml
spec:
  ingressClassName: nginx
  rules:
  - host: test.xxx.cn-hangzhou.ali.com
    http:
      paths:
      - backend:
          service:
            name: ing-nginx-0
            port:
              number: 80
        path: /game0(/|$)(.*)
        pathType: ImplementationSpecific
      - backend:
          service:
            name: ing-nginx-0
            port:
              number: 80
        path: /test-0
        pathType: ImplementationSpecific
  tls:
  - hosts:
    - xxx.xx1.com
    - xxx.xx2.com
status:
  loadBalancer:
    ingress:
    - ip: 47.xx.xxx.xxx
```

The other GameServers only have different path fields and service names, while the other generated parameters are the same.

The network status of GameServer is as follows:

```yaml
  networkStatus:
    createTime: "2023-04-28T14:00:30Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 47.xx.xxx.xxx
      ports:
      - name: /game0(/|$)(.*)
        port: 80
        protocol: TCP
      - name: /test-0
        port: 80
        protocol: TCP
    internalAddresses:
    - ip: 10.xxx.x.xxx
      ports:
      - name: /game0(/|$)(.*)
        port: 80
        protocol: TCP
      - name: /test-0
        port: 80
        protocol: TCP
    lastTransitionTime: "2023-04-28T14:00:30Z"
    networkType: Kubernetes-Ingress
```

---
### AlibabaCloud-NATGW
#### Plugin name

`AlibabaCloud-NATGW`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- AlibabaCloud-NATGW enables game servers to be accessed from the Internet by using an Internet NAT gateway of Alibaba Cloud. Internet traffic is forwarded to the corresponding game servers based on DNAT rules.

- This network plugin does not support network isolation.

#### Network parameters

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

#### Plugin configuration

None

#### Example

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
### AlibabaCloud-SLB
#### Plugin name

`AlibabaCloud-SLB`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- AlibabaCloud-SLB enables game servers to be accessed from the Internet by using Layer 4 Classic Load Balancer (CLB) of Alibaba Cloud. CLB is a type of Server Load Balancer (SLB). AlibabaCloud-SLB uses different ports of the same CLB instance to forward Internet traffic to different game servers. The CLB instance only forwards traffic, but does not implement load balancing.

- This network plugin supports network isolation.

Related design: https://github.com/openkruise/kruise-game/issues/20

#### Network parameters

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
- Value: {containerName_0},{containerName_1},... Example：sidecar
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

#### Plugin configuration
```
[alibabacloud]
enable = true
[alibabacloud.slb]
# Specify the range of available ports of the CLB instance. Ports in this range can be used to forward Internet traffic to pods. In this example, the range includes 200 ports.
max_port = 700
min_port = 500
```

---
### AlibabaCloud-NLB
#### Plugin name

`AlibabaCloud-NLB`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- AlibabaCloud-NLB enables game servers to be accessed from the Internet by using Layer 4 Network Load Balancer (NLB) of Alibaba Cloud. AlibabaCloud-NLB uses different ports of the same NLB instance to forward Internet traffic to different game servers. The NLB instance only forwards traffic, but does not implement load balancing.

- This network plugin supports network isolation.

#### Network parameters

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
- Value: {containerName_0},{containerName_1},... Example：sidecar
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

#### Plugin configuration
```
[alibabacloud]
enable = true
[alibabacloud.nlb]
# Specify the range of available ports of the NLB instance. Ports in this range can be used to forward Internet traffic to pods. In this example, the range includes 500 ports.
max_port = 1500
min_port = 1000
```

#### Example

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

### AlibabaCloud-EIP
#### Plugin name

`AlibabaCloud-EIP`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- Allocate a separate EIP for each GameServer
- The exposed public access port is consistent with the port monitored in the container, which is managed by security group.
- It is necessary to install the latest version of the ack-extend-network-controller component in the ACK cluster. For details, please refer to the [component description page](https://cs.console.aliyun.com/#/next/app-catalog/ack/incubator/ack-extend-network-controller).
#### Network parameters

ReleaseStrategy

- Meaning: Specifies the EIP release policy.
- Value:
  - Follow: follows the lifecycle of the pod that is associated with the EIP. This is the default value.
  - Never: does not release the EIP. You need to manually release the EIP when you no longer need the EIP. ( By 'kubectl delete podeip {gameserver name} -n {gameserver namespace}')
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

#### Plugin configuration

None

#### Example

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

In addition, the generated EIP resource will be named after {pod namespace}/{pod name} in the Alibaba Cloud console, which corresponds to each game server one by one.

---
### AlibabaCloud-SLB-SharedPort
#### Plugin name

`AlibabaCloud-SLB-SharedPort`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- AlibabaCloud-SLB-SharedPort enables game servers to be accessed from the Internet by using Layer 4 CLB of Alibaba Cloud. Unlike AlibabaCloud-SLB, `AlibabaCloud-SLB-SharedPort` uses the same port of a CLB instance to forward traffic to game servers, and the CLB instance implements load balancing.
  This network plugin applies to stateless network services, such as proxy or gateway, in gaming scenarios.

- This network plugin supports network isolation.

#### Network parameters

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
- Value: {containerName_0},{containerName_1},... Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

---
### AlibabaCloud-NLB-SharedPort

#### Plugin name

`AlibabaCloud-NLB-SharedPort`

#### Cloud Provider

AlibabaCloud

#### Plugin description

- AlibabaCloud-NLB-SharedPort enables game servers to be accessed from the Internet by using Layer 4 NLB of Alibaba Cloud, which is similar to AlibabaCloud-SLB-SharedPort.
  This network plugin applies to stateless network services, such as proxy or gateway, in gaming scenarios.

- This network plugin supports network isolation.

#### Network parameters

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
- Value: {containerName_0},{containerName_1},... Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

#### Plugin configuration

None

#### Example

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

#### Plugin configuration

None

---

### Volcengine-CLB

#### Plugin name

`Volcengine-CLB`

#### Cloud Provider

Volcengine

#### Plugin description

- The Volcaengine Kubernetes Engine supports the CLB reuse mechanism in k8s. Different SVCs can use different ports of the same CLB. Therefore, the Volcengine-CLB network plugin will record the port allocation corresponding to each CLB. For the specified network type as Volcengine-CLB, the Volcengine-CLB network plugin will automatically allocate a port and create a service object. Wait for the svc ingress field. After the public network IP is successfully created, the GameServer network is in the Ready state and the process is completed.

- This network plugin supports network isolation.

#### Network parameters

ClbIds

- Meaning：fill in the id of the clb. You can fill in more than one. You need to create the clb in [Volcano Engine].
- Value：each clbId is divided by `,` . For example: `clb-9zeo7prq1m25ctpfrw1m7`,`clb-bp1qz7h50yd3w58h2f8je`,...
- Configurable：Y

PortProtocols

- Meaning：the ports and protocols exposed by the pod, support filling in multiple ports/protocols
- Value：`port1/protocol1`,`port2/protocol2`,... The protocol names must be in uppercase letters.
- Configurable：Y

AllocateLoadBalancerNodePorts

- Meaning：Whether the generated service is assigned nodeport, this can be set to false only in clb passthrough mode
- Value：false / true
- Configurable：Y

Fixed

- Meaning：whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value：false / true
- Configurable：Y

AllowNotReadyContainers

- Meaning：the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value：{containerName_0},{containerName_1},... eg：sidecar
- Configurable：It cannot be changed during the in-place updating process.

Annotations

- Meaning：the anno added to the service
- Value：key1:value1,key2:value2...
- Configurable：Y

#### Plugin configuration
```toml
[volcengine]
enable = true
[volcengine.clb]
#Fill in the free port segment that clb can use to allocate external access ports to pods, The maximum port range is 200.
max_port = 700
min_port = 500
```

#### Example
```yaml
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gss-2048-clb
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: Volcengine-CLB
    networkConf:
      - name: ClbIds
        #Fill in Volcengine Cloud LoadBalancer Id here
        value: clb-xxxxx
      - name: PortProtocols
        #Fill in the exposed ports and their corresponding protocols here. 
        #If there are multiple ports, the format is as follows: {port1}/{protocol1},{port2}/{protocol2}...
        #If the protocol is not filled in, the default is TCP
        value: 80/TCP
      - name: AllocateLoadBalancerNodePorts
        # Whether the generated service is assigned nodeport.
        value: "true"
      - name: Fixed
        #Fill in here whether a fixed IP is required [optional] ; Default is false
        value: "false"
      - name: Annotations
        #Fill in the anno related to clb on the service
        #The format is as follows: {key1}:{value1},{key2}:{value2}...
        value: "key1:value1,key2:value2"
  gameServerTemplate:
    spec:
      containers:
        - image: cr-helm2-cn-beijing.cr.volces.com/kruise/2048:v1.0
          name: app-2048
          volumeMounts:
            - name: shared-dir
              mountPath: /var/www/html/js
        - image: cr-helm2-cn-beijing.cr.volces.com/kruise/2048-sidecar:v1.0
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
EOF
```

Check the network status in GameServer:
```
networkStatus:
    createTime: "2024-01-19T08:19:49Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: xxx.xxx.xx.xxx
      ports:
      - name: "80"
        port: 6611
        protocol: TCP
    internalAddresses:
    - ip: 172.16.200.60
      ports:
      - name: "80"
        port: 80
        protocol: TCP
    lastTransitionTime: "2024-01-19T08:19:49Z"
    networkType: Volcengine-CLB
```

---

### AmazonWebServices-NLB

#### Plugin name

`AmazonWebServices-NLB`

#### Plugin description

For game businesses using OKG in AWS EKS clusters, routing traffic directly to Pod ports via network load balancing is the foundation for achieving high-performance real-time service discovery. Using NLB for dynamic port mapping simplifies the forwarding chain and avoids the performance loss caused by Kubernetes kube-proxy load balancing. These features are particularly crucial for handling replica combat-type game servers. For GameServerSets with the network type specified as AmazonWebServices-NLB, the AmazonWebServices-NLB network plugin will schedule an NLB, automatically allocate ports, create listeners and target groups, and associate the target group with Kubernetes services through the TargetGroupBinding CRD. If the cluster is configured with VPC-CNI, the traffic will be automatically forwarded to the Pod's IP address; otherwise, it will be forwarded through ClusterIP. The process is considered successful when the network of the GameServer is in the Ready state.

#### Preparation

Due to the difference in AWS design, to achieve NLB port-to-Pod port mapping, three types of CRD resources need to be created: Listener/TargetGroup/TargetGroupBinding

##### Deploy elbv2-controller：

Definition and controller for Listener/TargetGroup CRDs: https://github.com/aws-controllers-k8s/elbv2-controller. This project links k8s resources with AWS cloud resources. Download the chart: https://gallery.ecr.aws/aws-controllers-k8s/elbv2-chart, example value.yaml:

```yaml
serviceAccount:
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::xxxxxxxxx:role/test"
aws:
  region: "us-east-1"
  endpoint_url: "https://elasticloadbalancing.us-east-1.amazonaws.com"
```

The key to deploying this project lies in authorizing the k8s ServiceAccount to access the NLB SDK, which is recommended to be done through an IAM role:

###### Step 1：Enable OIDC provider for the EKS cluster

1. Sign in to the AWS Management Console.
2. Navigate to the EKS console：https://console.aws.amazon.com/eks/
3. Select your cluster.
4. On the cluster details page, ensure that the OIDC provider is enabled. Obtain the OIDC provider URL for the EKS cluster. In the "Configuration" section of the cluster details page, find the "OpenID Connect provider URL".

###### Step 2：Configure the IAM role trust policy
1. In the IAM console, create a new identity provider and select "OpenID Connect".
  - For the Provider URL, enter the OIDC provider URL of your EKS cluster.
  - For Audience, enter: `sts.amazonaws.com`

2. In the IAM console, create a new IAM role and select "Custom trust policy".
  - Use the following trust policy to allow EKS to use this role:
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/oidc.eks.<REGION>.amazonaws.com/id/<OIDC_ID>"
          },
          "Action": "sts:AssumeRoleWithWebIdentity",
          "Condition": {
            "StringEquals": {
              "oidc.eks.<REGION>.amazonaws.com/id/<OIDC_ID>:sub": "system:serviceaccount:<NAMESPACE>:ack-elbv2-controller",
              "oidc.eks.<REGION>.amazonaws.com/id/<OIDC_ID>:aud": "sts.amazonaws.com"
            }
          }
        }
      ]
    }
    ```
    - Replace `<AWS_ACCOUNT_ID>`、`<REGION>`、`<OIDC_ID>`、`<NAMESPACE>` and `<SERVICE_ACCOUNT_NAME>` with your actual values.
    - Add the permission `ElasticLoadBalancingFullAccess`

##### Deploy AWS Load Balancer Controller：

CRD and controller for TargetGroupBinding: https://github.com/kubernetes-sigs/aws-load-balancer-controller/

Official deployment documentation: https://docs.aws.amazon.com/eks/latest/userguide/lbc-helm.html, essentially authorizing k8s ServiceAccount in a way similar to an IAM role.

#### Network Parameters

NlbARNs
- Meaning: Fill in the ARN of the nlb, you can fill in multiple, and nlb needs to be created in AWS in advance.
- Format: Separate each nlbARN with a comma. For example: arn:aws:elasticloadbalancing:us-east-1:888888888888:loadbalancer/net/aaa/3b332e6841f23870,arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/net/bbb/5fe74944d794d27e
- Support for change: Yes

NlbVPCId

- Meaning: Fill in the vpcid where nlb is located, needed for creating AWS target groups.
- Format: String. For example: vpc-0bbc9f9f0ffexxxxx
- Support for change: Yes

NlbHealthCheck

- Meaning: Fill in the health check parameters for the nlb target group, can be left blank to use default values.
- Format: Separate each configuration with a comma. For example: "healthCheckEnabled:true,healthCheckIntervalSeconds:30,healthCheckPath:/health,healthCheckPort:8081,healthCheckProtocol:HTTP,healthCheckTimeoutSeconds:10,healthyThresholdCount:5,unhealthyThresholdCount:2"
- Support for change: Yes
- Parameter explanation：
  - **healthCheckEnabled**：Indicates whether health checks are enabled. If the target type is lambda, health checks are disabled by default but can be enabled. If the target type is instance, ip, or alb, health checks are always enabled and cannot be disabled.
  - **healthCheckIntervalSeconds**：The approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP, or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is lambda, the default is 35 seconds.
  - **healthCheckPath**：The destination for health checks on the targets. For HTTP/HTTPS health checks, this is the path. For GRPC protocol version, this is the path of a custom health check method with the format /package.service/method. The default is /Amazon Web Services.ALB/healthcheck.
  - **healthCheckPort**：The port the load balancer uses when performing health checks on targets. The default is traffic-port, which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
  - **healthCheckProtocol**：The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
  - **healthCheckTimeoutSeconds**：The amount of time, in seconds, during which no response from a target means a failed health check. The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS, or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is lambda, the default is 30 seconds.
  - **healthyThresholdCount**：The number of consecutive health check successes required before considering a target healthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP, or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 5. If the target type is lambda, the default is 5.
  - **unhealthyThresholdCount**：The number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP, or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 2. If the target type is lambda, the default is 5.

PortProtocols

- Meaning: Ports and protocols exposed by the pod, supports specifying multiple ports/protocols.
- Format: port1/protocol1,port2/protocol2,... (protocol should be uppercase)
- Support for change: Yes

Fixed

- Meaning: Whether the access port is fixed. If yes, even if the pod is deleted and rebuilt, the mapping between the internal and external networks will not change.
- Format: false / true
- Support for change: Yes

AllowNotReadyContainers

- Meaning: The corresponding container name that allows continuous traffic during in-place upgrades.
- Format: {containerName_0},{containerName_1},... For example: sidecar
- Support for change: Not changeable during in-place upgrades

Annotations

- Meaning: Annotations added to the service, supports specifying multiple annotations.
- Format: key1:value1,key2:value2...
- Support for change: Yes

#### #### Plugin configuration
```toml
[aws]
enable = true
[aws.nlb]
# Specify the range of free ports that NLB can use to allocate external access ports for pods, with a maximum range of 50 (closed interval)
# The limit of 50 comes from AWS's limit on the number of listeners, see: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-limits.html
max_port = 32050
min_port = 32001
```

#### Example
```shell
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-demo
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AmazonWebServices-NLB
    networkConf:
    - name: NlbARNs
      value: "arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxx:loadbalancer/net/okg-test/yyyyyyyyyyyyyyyy"
    - name: NlbVPCId
      value: "vpc-0bbc9f9f0ffexxxxx"
    - name: PortProtocols
      value: "80/TCP"
    - name: NlbHealthCheck
      value: "healthCheckIntervalSeconds:15"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
EOF
```

---

### TencentCloud-CLB

#### Plugin name

`TencentCloud-CLB`

#### Cloud Provider

TencentCloud

#### Plugin description

- TencentCloud-CLB enables game servers to be accessed from the Internet by using Cloud Load Balancer (CLB) of Tencent Cloud. CLB is a type of Server Load Balancer (CLB). TencentCloud-CLB uses different ports for different game servers. The CLB instance only forwards traffic, but does not implement load balancing.
- The [tke-extend-network-controller](https://github.com/tkestack/tke-extend-network-controller) network plugin needs to be installed (can be installed through the TKE application market).
- This network plugin supports network isolation.


#### Network parameters

ClbIds

- Meaning: the CLB instance ID. You can fill in multiple ids.
- Value: in the format of slbId-0,slbId-1,... An example value can be "lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je"
- Configuration change supported or not: yes. You can add new slbIds at the end. However, it is recommended not to change existing slbId that is in use.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

#### Plugin configuration

```toml
[tencentcloud]
enable = true
[tencentcloud.clb]
# Specify the range of available ports of the CLB instance. Ports in this range can be used to forward Internet traffic to pods. In this example, the range includes 200 ports.
min_port = 1000
max_port = 1100
```

#### Example

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
  gameServerTemplate:
    spec:
      containers:
        - image: nginx
          name: nginx
```

The network status of GameServer would be as follows:

```yaml
  networkStatus:
    createTime: "2024-10-28T03:16:20Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: 139.155.64.52
      ports:
      - name: "80"
        port: 1002
        protocol: TCP
    - ip: 139.155.64.52
      ports:
      - name: "7777"
        port: 1003
        protocol: UDP
    internalAddresses:
    - ip: 172.16.7.106
      ports:
      - name: "80"
        port: 80
        protocol: TCP
    - ip: 172.16.7.106
      ports:
      - name: "7777"
        port: 7777
        protocol: UDP
    lastTransitionTime: "2024-10-28T03:16:20Z"
    networkType: TencentCloud-CLB
```

---

### JdCloud-NLB

#### Plugin name

`JdCloud-NLB`

#### Cloud Provider

JDCloud

#### Plugin description

JdCloud Container Service supports the reuse of NLB (Network Load Balancer) in Kubernetes. Different services (svcs) can use different ports of the same NLB. As a result, the JdCloud-NLB network plugin will record the port allocation for each NLB. For services that specify the network type as JdCloud-NLB, the JdCloud-NLB network plugin will automatically allocate a port and create a service object. Once it detects that the public IP of the svc has been successfully created, the GameServer's network will transition to the Ready state, completing the process.

#### Network parameters

NlbIds
- Meaning：fill in the id of the clb. You can fill in more than one. You need to create the clb in [JdCloud].
- Value：each clbId is divided by `,` . For example：`netlb-aaa,netlb-bbb,...`
- Configurable：Y

PortProtocols
- Meaning：the ports and protocols exposed by the pod, support filling in multiple ports/protocols
- Value：`port1/protocol1`,`port2/protocol2`,... The protocol names must be in uppercase letters.
- Configurable：Y

Fixed
- Meaning：whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value：false / true
- Configurable：Y

#### Plugin configuration

```toml
[jdcloud]
enable = true
[jdcloud.nlb]
#To allocate external access ports for Pods, you need to define the idle port ranges that the NLB (Network Load Balancer) can use. The maximum range for each port segment is 200 ports.
max_port = 700
min_port = 500
```

#### Example

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: nlb
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: JdCloud-NLB
    networkConf:
      - name: NlbIds
        #Fill in Jdcloud Cloud LoadBalancer Id here
        value: netlb-xxxxx
      - name: PortProtocols
        #Fill in the exposed ports and their corresponding protocols here. 
        #If there are multiple ports, the format is as follows: {port1}/{protocol1},{port2}/{protocol2}...
        #If the protocol is not filled in, the default is TCP
        value: 80/TCP
      - name: AllocateLoadBalancerNodePorts
        # Whether the generated service is assigned nodeport.
        value: "true"
      - name: Fixed
        #Fill in here whether a fixed IP is required [optional] ; Default is false
        value: "false"
      - name: Annotations
        #Fill in the anno related to clb on the service
        #The format is as follows: {key1}:{value1},{key2}:{value2}...
        value: "key1:value1,key2:value2"
  gameServerTemplate: 
    spec:
      containers:
        - args:
          - /data/server/start.sh
          command:
          - /bin/bash
          image: gss-cn-north-1.jcr.service.jdcloud.com/gsshosting/pal:v1
          name: game-server
```

The network status of GameServer would be as follows:

```yaml
networkStatus:
    createTime: "2024-11-04T08:00:20Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: xxx.xxx.xxx.xxx
      ports:
      - name: "8211"
        port: 531
        protocol: UDP
    internalAddresses:
    - ip: 10.0.0.95
      ports:
      - name: "8211"
        port: 8211
        protocol: UDP
    lastTransitionTime: "2024-11-04T08:00:20Z"
    networkType: JdCloud-NLB
```

---

### JdCloud-EIP

#### Plugin name

`JdCloud-EIP`

#### Cloud Provider

JDCloud

#### Plugin description

JdCloud Container Service supports binding an Elastic Public IP directly to a pod in Kubernetes, allowing the pod to communicate directly with the external network.
- The cluster's network plugin uses Yunjian-CNI and cannot use Flannel to create the cluster.
- For specific usage restrictions of Elastic Public IPs, please refer to the JdCloud Elastic Public IP product documentation.
- Install the EIP-Controller component.
- The Elastic Public IP will not be deleted when the pod is destroyed.

#### Network parameters

BandwidthConfigName
- Meaning：The bandwidth of the Elastic Public IP, measured in Mbps, has a value range of [1, 1024].
- Value：Must be an integer
- Configurable：Y

ChargeTypeConfigName
- Meaning：The billing method for the Elastic Public IP
- Value：string, `postpaid_by_usage`/`postpaid_by_duration`
- Configurable：Y

FixedEIPConfigName
- Meaning：Whether to fixed the Elastic Public IP,if so, the EIP will not be changed when the pod is recreated.
- Value：string, "false" / "true"
- Configurable：Y

AssignEIPConfigName
- Meaning：Whether to designate a specific Elastic Public IP. If true, provide the ID of the Elastic Public IP; otherwise, an EIP will be automatically allocated.
- Value：string, "false" / "true"

EIPIdConfigName
- Meaning：If a specific Elastic Public IP is designated, the ID of the Elastic Public IP must be provided, and the component will automatically perform the lookup and binding.
- Value：string，for example：`fip-xxxxxxxx`

#### Example

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: eip
  namespace: default
spec:
  gameServerTemplate:
    spec:
      containers:
        - image: gss-cn-north-1.jcr.service.jdcloud.com/gsshosting/pal:v1
          name: game-server
  network:
    networkType: JdCloud-EIP
    networkConf:
      - name: "BandWidth"
        value: "10"
      - name: "ChargeType"
        value: postpaid_by_usage
      - name: "Fixed"
        value: "false"
  replicas: 3
```

Check the network status in GameServer:

```yaml
networkStatus:
    createTime: "2024-11-04T10:53:14Z"
    currentNetworkState: Ready
    desiredNetworkState: Ready
    externalAddresses:
    - ip: xxx.xxx.xxx.xxx
    internalAddresses:
    - ip: 10.0.0.95
    lastTransitionTime: "2024-11-04T10:53:14Z"
    networkType: JdCloud-EIP
```



## Network Isolation

Consider the following scenarios, such as:

- A major anomaly occurs in the game server, and players need to be prevented from connecting
- Before the version is updated, the player's network connection is cut off
- Other temporary service-related needs, and the service will be reopened after the operation and maintenance is processed

Compared to the method of directly deleting the game server Pod, network isolation at the access layer is a simpler and lighter operation. It can retain the Pod and GameServer metadata information without reconstruction, which improves the efficiency of reopening the service.

### Usage

GameServer.Spec has a NetworkDisabled field. The default NetworkDisabled of the GameServer generated by the GameServerSet is false, which means that network isolation will not be set when the game server is deployed at first.

When the game server has a network isolation requirement, you can set GameServer.Spec.NetworkDisabled to true manually (kubectl/K8s API) / custom service quality to start network isolation; when it is set to false, the network will be restored.

It should be noted that the network isolation function is provided by each network plugin, and users need to check whether the corresponding plugin supports the network isolation function when using the network plugin.


## Access to network information

GameServer Network Status can be obtained in two ways

### k8s API
Call the K8s API and get the GameServer object. This method is applicable to the central component, usually in the matching service to get the game service network information for routing.

### DownwardAPI
Downward API to sink network information into the business container for use by the game service business container

An example of this method is as follows.

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-slb
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AlibabaCloud-SLB
    networkConf:
    - name: SlbIds
      value: "xxx"
    - name: PortProtocols
      value: "xxx"
    - name: Fixed
      value: "true"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
          volumeMounts:
            - name: podinfo
              mountPath: /etc/podinfo
      volumes:
        - name: podinfo
          downwardAPI:
            items:
              - path: "network"
                fieldRef:
                  fieldPath: metadata.annotations['game.kruise.io/network-status']
```

field description:
- Declare volumeMounts in the corresponding container field, defining the access path, in this case /etc/podinfo
- Declare the downwardAPI in gameServerTemplate.spec, set the filename to "network" and specify to use "game.kruise.io/network-status "Note that the annotation key should be in single quotes '', double quotes pod will fail to be created.

After the successful creation of business pods and containers, a network file exists under the corresponding /etc/podinfo path, which records the serialized network information, which can be decoded into the corresponding structure by json and used in the program to obtain the corresponding fields. The decoded sample is as follows (golang version)

```go
package demo
import (
	"encoding/json"
	"github.com/openkruise/kruise-game/apis/v1alpha1"
    "os"
)

func getNetwork()  {
	network, err := os.ReadFile("/etc/podinfo/network")
	if err != nil {
		return
	}
	
	networkStatus := &v1alpha1.NetworkStatus{}

	err = json.Unmarshal(network, networkStatus)
	if err != nil {
		return
	}
	
	// accessing the networkStatus fields
}

```

When getting network information, you may face the situation that the network status is not ready, you can add a loop in the programme to continuously detect the network status until the network status is Ready and then get the network information data. The following is the corresponding shell script.

```shell
# Initialise JSON string to empty
json=''

# Loop until you get the data
while [ -z "$json" ]; do
    # Reading a JSON string from a file
    json=$(cat /etc/podinfo/network)

    # Check if currentNetworkState is Ready
    currentNetworkState=$(echo $json | jq -r '.currentNetworkState')
    if [ "$currentNetworkState" != "Ready" ]; then
        echo "currentNetworkState is not Ready, sleeping 1 second..."
        sleep 1
        json=''
    fi
done

# Parsing the ip and port of externalAddresses
echo "externalAddresses:"
ip=$(echo $json | jq -r '.externalAddresses[0].ip')
port=$(echo $json | jq -r '.externalAddresses[0].ports[0].port')
echo " IP: $ip, Port: $port"
```

## FAQ

Q: How to change the network plugin configuration?

A: The default parameters can be changed by editing the configmap under the kruise-game-system namespace. After the change, rebuild kruise-game-manager to make the configuration take effect. It is recommended that the cluster game service already uses the OKG network plug-in does not easily change the corresponding configuration, and should do a reasonable network planning in advance.

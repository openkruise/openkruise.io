# Kubernetes 网络插件

← 返回 [网络模型](../network.md) 总览

## Kubernetes-HostPort
### 插件名称

`Kubernetes-HostPort`

### Cloud Provider

Kubernetes

### 插件说明
- Kubernetes-HostPort利用宿主机网络，通过主机上的端口转发实现游戏服对外暴露服务。宿主机需要配置公网IP，有被公网访问的能力。

- 用户在配置文件中可自定义宿主机开放的端口段（默认为8000-9000），该网络插件可以帮助用户分配管理宿主机端口，尽量避免端口冲突。

- 该插件不支持网络隔离。

- Kubernetes-HostPort 依赖Kubernetes提供的hostPort模式。需要注意存在一些CNI插件不支持hostPort，如Terway等。



### 网络参数

ContainerPorts

- 含义：填写提供服务的容器名以及对应暴露的端口和协议
- 填写格式：containerName:port1/protocol1,port2/protocol2,...（协议需大写） 比如：`game-server:25565/TCP`。 port 支持填写 SameAsHost ，表示容器使用与宿主机相同端口 比如: `game-server:SameAsHost/UDP`. protocol 支持填写 TCPUDP，表示TCP与UDP使用同个端口
- 是否支持变更：不支持，在创建时即永久生效，随pod生命周期结束而结束

### 插件配置

```
[kubernetes]
enable = true
[kubernetes.hostPort]
#填写宿主机可使用的空闲端口段，用于为pod分配宿主机转发端口
max_port = 9000
min_port = 8000 
```

### 示例说明

OKG支持在原生Kubernetes集群使用HostPort游戏服网络，使用游戏服所在宿主机暴露外部IP及端口，转发至游戏服内部端口中。使用方式如下。

部署一个带有network的GameServerSet：

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
    #网络配置以k-v键值对的形式传入，由网络插件指定。不同网络插件有着不同的网络配置
    - name: ContainerPorts
      #ContainerPorts对应的值格式如下{containerName}:{port1}/{protocol1},{port2}/{protocol2},...
      value: "gameserver:80"
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

访问 48.98.98.8:8211 即可

---

## Kubernetes-NodePort
### 插件名称

`Kubernetes-NodePort`

### Cloud Provider

Kubernetes

### 插件说明
- Kubernetes-NodePort 利用Kubernetes NodePort 类型Service 实现游戏服对外暴露服务。宿主机需要配置公网IP，有被公网访问的能力。

- 该插件依赖节点NodePort数量限制，默认开放端口为30000-32767。若希望开放更多端口，请更改APIServer service-node-port-range 参数。

- 该插件不支持网络隔离。


### 网络参数

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

### 插件配置

无

### 示例说明

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
    #网络配置以k-v键值对的形式传入，由网络插件指定。不同网络插件有着不同的网络配置
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

生成的GameServer中通过networkStatus字段查看游戏服网络信息：

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

访问 120.78.78.8:31480 即可

---

## Kubernetes-Ingress

### 插件名称

`Kubernetes-Ingress`

### Cloud Provider

Kubernetes

### 插件说明

- 针对页游等需要七层网络模型的游戏场景，OKG提供了Ingress网络模型。该插件将会自动地为每个游戏服设置对应的访问路径，该路径与游戏服ID相关，每个游戏服各不相同。
- 是否支持网络隔离：否

### 网络参数

Path

- 含义：访问路径。每个游戏服依据ID拥有各自的访问路径。
- 填写格式：将{'<id>'}添加到原始路径(与HTTPIngressPath中Path一致)的任意位置，该插件将会生成游戏服ID对应的路径。例如，当设置路径为 /game{'<id>'}，游戏服0对应路径为/game0，游戏服1对应路径为/game1，以此类推。
- 是否支持变更：支持

PathType

- 含义：路径类型。与HTTPIngressPath的PathType字段一致。
- 填写格式：与HTTPIngressPath的PathType字段一致。
- 是否支持变更：支持

Port

- 含义：游戏服暴露的端口值。
- 填写格式：端口数字
- 是否支持变更：支持

IngressClassName

- 含义：指定IngressClass的名称。与IngressSpec的IngressClassName字段一致。
- 填写格式：与IngressSpec的IngressClassName字段一致。
- 是否支持变更：支持

Host

- 含义：域名。每个游戏服依据ID拥有各自的访问域名。
- 填写格式：将{'<id>'}添加域名的任意位置，该插件将会生成游戏服ID对应的域名。例如，当设置域名为 test.game{'<id>'}.cn-hangzhou.ali.com，游戏服0对应域名为test.game0.cn-hangzhou.ali.com，游戏服1对应域名为test.game1.cn-hangzhou.ali.com，以此类推。
- 是否支持变更：支持

TlsHosts

- 含义：包含TLS证书的host列表。含义与IngressTLS的Hosts字段类似。
- 填写格式：host1,host2,... 例如，xxx.xx1.com,xxx.xx2.com
- 是否支持变更：支持

TlsSecretName

- 含义：与IngressTLS的SecretName字段一致。
- 填写格式：与IngressTLS的SecretName字段一致。
- 是否支持变更：支持

Annotation

- 含义：作为ingress对象的annotation
- 格式：key: value（注意:后有空格），例如：nginx.ingress.kubernetes.io/rewrite-target: /$2
- 是否支持变更：支持

Fixed

- 含义：是否需要保持ingress，让其不随pod的删除而删除
- 取值：true / false
- 是否支持变更：支持

_补充说明_

- 支持填写多个annotation，在networkConf中填写多个Annotation以及对应值即可，不区分填写顺序。
- 支持填写多个路径。路径、路径类型、端口按照填写顺序一一对应。当路径数目大于路径类型数目（或端口数目）时，无法找到对应关系的路径按照率先填写的路径类型（或端口）匹配。

### 插件配置

无

### 示例说明

GameServerSet中network字段声明如下：

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

则会生成gss replicas对应数目的service与ingress对象。0号游戏服生成的ingress字段如下所示：

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

其他序号的游戏服只有path字段与service name不同，生成的其他参数都相同。

对应的0号GameServer的networkStatus如下：

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

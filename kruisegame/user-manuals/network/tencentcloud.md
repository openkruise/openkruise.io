# TencentCloud network plugins

← Back to [Network](../network.md) overview

## TencentCloud-CLB

### Plugin name

`TencentCloud-CLB`

### Cloud Provider

TencentCloud

### Plugin description

- TencentCloud-CLB enables game servers to be accessed from the Internet by using Cloud Load Balancer (CLB) of Tencent Cloud. CLB is a type of Server Load Balancer (CLB). TencentCloud-CLB uses different ports for different game servers. The CLB instance only forwards traffic, but does not implement load balancing.
- Requires installation of the [tke-extend-network-controller](https://github.com/tkestack/tke-extend-network-controller) network plugin (available via the TKE Marketplace), with a minimum version requirement of `2.1.1`. Additionally, [cert-manager](https://cert-manager.io/) must be installed (a dependency for `tke-extend-network-controller`, also available through the TKE Marketplace).
- This network plugin supports network isolation.


### Network parameters

ClbIds

- Meaning: the CLB instance ID. You can fill in multiple ids.
- Value: in the format of slbId-0,slbId-1,... An example value can be "lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je"
- Configuration change supported or not: yes. You can add new slbIds at the end. However, it is recommended not to change existing slbId that is in use.

PortProtocols

- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

MinPort

- Meaning: (Optional) Specifies the starting port number when allocating CLB ports. Default value: 30000.
- Format: Numeric (e.g., 30000).
- Configuration change supported or not: no.

ListenerQuota

- Meaning: (Optional) Specifies the listener quota per CLB instance. Default value: 50.
(Note: Configure this parameter only if you have modified the instance-level listener quota. Do not configure if you modified the account-level quota or made no changes)
- Format: Numeric (e.g. 50).
- Configuration change supported or not: no.

### Plugin configuration

```toml
[tencentcloud]
enable = true
```

### Example

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

The network status of GameServer would be as follows:

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

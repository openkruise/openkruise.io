# HwCloud network plugins

← Back to [Network](../network.md) overview

## HwCloud-ELB

### Plugin name

`HwCloud-ELB`

### Cloud Provider

HwCloud

### Plugin description

HwCloud-ELB enables game servers to be accessed from the Internet by using Layer 4 Load Balancer (ELB) of Huawei Cloud. ELB is a type of Server Load Balancer (SLB). HwCloud-ELB uses different ports of the same ELB instance to forward Internet traffic to different game servers. The ELB instance only forwards traffic, but does not implement load balancing.

- This network plugin supports network isolation.

### Network parameters

ElbIds
- Meaning: the ELB instance ID. You can fill in multiple ids. （at least one）
- Value: in the format of elbId-0,elbId-1,... An example value can be "lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je"
- Configuration change supported or not: yes. You can add new elbIds at the end. However, it is recommended not to change existing elbId that is in use.

PortProtocols
- Meaning: the ports in the pod to be exposed and the protocols. You can specify multiple ports and protocols.
- Value: in the format of port1/protocol1,port2/protocol2,... (same protocol port should like 8000/TCPUDP) The protocol names must be in uppercase letters.
- Configuration change supported or not: yes.

Fixed
- Meaning: whether the mapping relationship is fixed. If the mapping relationship is fixed, the mapping relationship remains unchanged even if the pod is deleted and recreated.
- Value: false or true.
- Configuration change supported or not: yes.

AllowNotReadyContainers
- Meaning: the container names that are allowed not ready when inplace updating, when traffic will not be cut.
- Value: containerName_0,containerName_1,... Example：sidecar
- Configuration change supported or not: It cannot be changed during the in-place updating process.

ExternalTrafficPolicyType
- Meaning: Service LB forward type, if Local， Service LB just forward traffice to local node Pod, we can keep source IP without SNAT
- Value: : Local/Cluster Default value is Cluster
- Configuration change supported or not: not. It maybe related to "IP/Port mapping relationship Fixed", recommend not to change

LB config parameters consistent with huawei cloud ccm https://github.com/kubernetes-sigs/cloud-provider-huaweicloud/blob/master/docs/usage-guide.md

LBHealthCheckFlag
- Meaning: Whether to enable health check
- Format: "on" means on, "off" means off. Default is on
- Whether to support changes: Yes

LBHealthCheckOption
- Meaning: Health Check Config
- Format: json string link.
- Whether to support changes: Yes

ElbClass
- Meaning: huawei lb class
- Format: dedicated or shared  (default dedicated)
- Whether to support changes: No


### Plugin configuration

```toml
[hwcloud]
enable = true
[hwcloud.elb]
max_port = 700
min_port = 500
block_ports = []
```

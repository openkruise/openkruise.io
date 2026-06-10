# HwCloud 网络插件

← 返回 [网络模型](../network.md) 总览

## HwCloud-ELB

### Plugin name

`HwCloud-ELB`

### Cloud Provider

HwCloud

### Plugin description
- HwCloud-ELB 使用华为云负载均衡器（ELB）作为对外服务的承载实体，在此模式下，不同游戏服使用 ELB 的不同端口对外暴露，此时 ELB 只做转发，并未均衡流量。
- 需安装https://github.com/kubernetes-sigs/cloud-provider-huaweicloud。
- 是否支持网络隔离：是。

### Network parameters


ElbIds
- 含义: elb 的ID, 可填写多个 (必须至少1)
- 填写格式: 例如 "lb-9zeo7prq1m25ctpfrw1m7,lb-bp1qz7h50yd3w58h2f8je"
- 是否支持变更：支持，只追加

PortProtocols
- 含义：pod暴露的端口及协议，支持填写多个端口/协议。
- 格式：port1/protocol1,port2/protocol2,...（协议需大写）
- 是否支持变更：支持。

Fixed
- 含义：是否固定访问IP/端口。若是，即使pod删除重建，网络内外映射关系不会改变
- 填写格式：false / true
- 是否支持变更：支持

AllowNotReadyContainers
- 含义：在容器原地升级时允许不断流的对应容器名称，可填写多个
- 格式：containerName_0, containerName_1,... 例如：sidecar
- 是否支持变更：在原地升级过程中不可变更。

ExternalTrafficPolicyType
- 含义：Service LB 是否只转发给本地实例。若是Local， 创建Local类型Service, 配合cloud-manager只配置对应Node，可以保留客户端源IP地址
- 填写格式: Local/Cluster 默认Cluster
- 是否支持变更：不支持。跟是否固定IP/端口有关系，建议不更改

LB config parameters consistent with huawei cloud ccm https://github.com/kubernetes-sigs/cloud-provider-huaweicloud/blob/master/docs/usage-guide.md

LBHealthCheckFlag
- 含义：是否开启健康检查
- 填写格式: on 或者 off。默认 on
- 是否支持变更：支持

LBHealthCheckOption
- 含义：健康检查的配置信息
- 填写格式: json 字符串。默认空
- 是否支持变更：支持

ElbClass
- 含义：elb 类型
- 填写格式: 独享（dedicated）或者 共享（shared）默认 dedicated
- 是否支持变更：不支持

ElbConnLimit
- 含义：共享型LB的连接限制数
- 填写格式: -1 到 2147483647。默认-1 不限制
- 是否支持变更：不支持

ElbLbAlgorithm
- 含义：RS 的 LB 算法
- 填写格式:  ROUND_ROBIN,LEAST_CONNECTIONS,SOURCE_IP default ROUND_ROBIN
- 是否支持变更： 支持

ElbSessionAffinityFlag
- 含义：是否开启session亲和
- 填写格式: on 或者 off 默认 off
- 是否支持变更：不支持

ElbSessionAffinityOption
- 含义：session亲和的超时配置
- 填写格式: json 字符串
- 是否支持变更：支持

ElbTransparentClientIP
- 含义：是否透传源IP
- 填写格式: true 或者 false 默认 false
- 是否支持变更：支持

ElbXForwardedHost
- 含义：是否重写X-Forwarded-Host头
- 填写格式: true 或者 false 默认 false
- 是否支持变更：支持

ElbIdleTimeout
- 含义：rs 的空闲超时时间，最后会彻底删除
- 填写格式: 0 到 4000，默认不设置使用LB的默认配置
- 是否支持变更：支持

ElbRequestTimeout
- 含义：http，https请求超时时间
- 填写格式: 1 到 300，默认不设置使用LB的默认配置
- 是否支持变更：支持

ElbResponseTimeout
- 含义：http，https响应超时时间
- 填写格式: 1 到 300，默认不设置使用LB的默认配置
- 是否支持变更：支持

### Plugin configuration

```
[hwcloud]
enable = true
[hwcloud.elb]
max_port = 700
min_port = 500
block_ports = []
```

---
title: 高可用性
---

# 概述

Kruise 控制平面组件 kruise-manager 包含两个部分：webhook 和 controller。Webhook 是多副本的，并通过 Cluster IP Service 在多个副本之间进行流量负载均衡。Controller 则采用主从架构（leader election），其中主实例由选举产生。在默认安装中，webhook 和 controller 是部署在一起的。当然，也可以将 webhook 和 controller 独立部署。


# 异常恢复

kruise-manager 容器的入口是 kruise-manager 进程，因此任何 panic 或 OOM 都会导致容器重启。kruise-manager 的 readiness 探针会检测 webhook 的证书是否就绪、webhook server 是否可达。如果某个 webhook server 不响应，流量将被路由到其他正常的 kruise-manager 实例。此外，kruise-manager 的 controller 组件会定期更新 leader 选举的租约信息，如果主 controller 发生 panic 或卡住，其他健康的 kruise-manager 实例可以成为新的 leader 并继续执行协调操作。


# 节点/区域故障恢复


在 v1.8 之前，kruise-manager 实例会被调度到不同的节点上，以容忍单节点故障。从 v1.8 开始，kruise-manager 实例会被调度到不同的可用区中，从而能够容忍单个可用区的故障。需要注意的是，在某些本地部署环境中的裸金属节点可能没有拓扑信息，请为这些节点手动添加拓扑标签，以便避免因可用区故障导致问题。此外，拓扑打散配置不是必须的，如果您希望强制进行 Pod打散，可以将`whenUnsatisfiable` 设置为 `DoNotSchedule`。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    control-plane: controller-manager
  name: kruise-controller-manager
spec:
  template:
    spec:
      topologySpreadConstraints:
      - labelSelector:
          matchLabels:
            control-plane: controller-manager
        matchLabelKeys:
        - pod-template-hash
        maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable:  ScheduleAnyway # 如果需要强打散，请改为 DoNotSchedule
...
``` 

# 避免循环依赖问题

kruise-manager 包含一个针对 Pod 的 webhook，如果 kruise-manager 出现故障，可能会阻塞 Pod 的创建。为了避免这种循环依赖问题，kruise-manager 自身使用主机网络（host network），这样它就不依赖任何网络组件。此外，kruise-manager 的 webhook 会跳过 kube-system 命名空间下的 Pod 准入控制，该命名空间通常是系统组件的默认安装命名空间，也是 kruise-manager 自身部署的命名空间。请注意，如果没有 webhook 功能，OpenKruise 的一些功能（如 SidecarSet 和 WorkloadSpread）将无法正常工作。


# 避免组件升级过程中的故障

为了在组件滚动更新期间确保最大可用性，kruise-manager 总是会先启动 100% 的新 Pod 副本，并等待这些副本就绪后才删除旧副本。需要注意的是，如果集群资源不足，这种策略可能会导致问题。在这种情况下，您可以调整部署策略并减少 maxSurge 的值。


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    control-plane: controller-manager
  name: kruise-controller-manager
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 100% # 如果资源不足，请适当减小 maxSurge 的值
  ...
```



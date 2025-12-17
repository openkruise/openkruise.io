# 金丝雀发布

## 金丝雀发布流程

<center><img src={require('/static/img/rollouts/canary.jpg').default} width="90%" /></center>

## 推荐配置

**注意：金丝雀策略仅适用于Deployment。**

```YAML
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollouts-demo
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: workload-demo
  strategy:
    canary:
      enableExtraWorkloadForCanary: true
      steps:
      - traffic: 20%
        replicas: 20%
      trafficRoutings:
      - service: service-demo
        ingress:
          classType: nginx
          name: ingress-demo
```

### 行为解释

当您为`workload-demo`应用新修订版本时：

- `workload-demo`工作负载将被暂停，不会更新任何Pod；
- 将创建一个新的金丝雀Deployment，其副本数为`workload-demo`的“20%”（总计将有`120%`的Pods）；
- `20%`的流量将被引导到新的金丝雀Deployment的Pods。

当您认为金丝雀验证已经通过并确认进行下一步时：

- `workload-demo`工作负载将使用本机滚动更新策略进行升级；
- 流量将恢复到原始的负载均衡策略；
- 金丝雀Deployment和Pods将被删除。

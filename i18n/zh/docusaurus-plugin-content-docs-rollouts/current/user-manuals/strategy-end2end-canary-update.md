# 全链路灰度

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 全链路灰度流程
<center><img src={require('/static/img/rollouts/e2e.png').default} width="90%" /></center>

全链路灰度发布是一种特殊的金丝雀发布流程。 在这种金丝雀发布中， 一个微服务系统中的多个应用可以共用一个流量网关，上游应用的灰度副本会把流量传递到下游应用的灰度副本中， 从而保证一个请求的处理尽可能的保持在一个端到端灰度环境中。 这种灰度环境往往被叫做流量泳道， 在这样的泳道中，如果某个应用不存在灰度实例， 请求会引流到稳定版本的应用实例中。 但当下游应用又存在灰度实例的时候，发往下游的请求又会被导流到灰度实例上。 全链路灰度往往被用来在需要多个应用协同的场景下进行业务验证和灰度。 

这里通过一个简单的样例系统来演示全链路灰度， 这个系统的组成为 (gateway -> spring-cloud-a -> spring-cloud-b)， 也就是请求由网关接入，网关会把接入的流量发往`spring-cloud-a`， `spring-cloud-a`接下来会调用下游系统`spring-cloud-b`。 

## 公用网关的配置
因为网关配置需要被多个应用共享， 所以具体的网关配置需要在Rollout外设置。 

```YAML

apiVersion: rollouts.kruise.io/v1alpha1
kind: TrafficRouting
metadata:
  name: mse-traffic
spec:
  objectRef:
  - service: spring-cloud-a
    ingress:
      classType: mse
      name: spring-cloud-a
  strategy:
    matches:
    # optional A/B Testing setting
    - headers:
      - type: Exact
        name: User-Agent
        value: foo
    # alternative gray environment will receive 30% traffic 
    # weight: 20
    # optional request head modification
    requestHeaderModifier:
      set:
      - name: x-mse-tag
        value: gray
```

## 发布配置

**Note: v1beta1 available from Kruise Rollout v0.5.0.**

多个应用的发布配置通过引用公共的网关配置，具体的，可以通过Rollout资源的 `trafficRoutingRef` 字段或者`rollouts.kruise.io/trafficrouting`标注完成。此外，通过Rollout的`patchPodTemplateMetadata`字段，灰度的实例相比稳定版本的实例，可以有不同的实例元数据。 服务发现的实现，例如微服务引擎或者服务网格， 可以利用实例元数据的差异，引导流量到不同的下游服务实例中。 
 
<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```YAML
# a rollout configuration
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollout-a
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: spring-cloud-a
  strategy:
    canary:
      steps:
      - pause: {}
        replicas: 1
      patchPodTemplateMetadata:
        labels:
          alicloud.service.tag: gray
          opensergo.io/canary-gray: gray
      trafficRoutingRef: mse-traffic      
---
# b rollout configuration
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollout-b
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: spring-cloud-b
  strategy:
    canary:
      steps:
        - pause: {}
          replicas: 1
      patchPodTemplateMetadata:
        labels:
          alicloud.service.tag: gray
          opensergo.io/canary-gray: gray
      trafficRoutingRef: mse-traffic
```
  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```YAML
# a rollout configuration
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollout-a
  annotations:
    rollouts.kruise.io/trafficrouting: mse-traffic
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: spring-cloud-a
  strategy:
    canary:
      steps:
      - pause: {}
        replicas: 1
      patchPodTemplateMetadata:
        labels:
          alicloud.service.tag: gray
          opensergo.io/canary-gray: gray
---
# b rollout configuration
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollout-b
  annotations:
    rollouts.kruise.io/trafficrouting: mse-traffic
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: spring-cloud-b
  strategy:
    canary:
      steps:
        - pause: {}
          replicas: 1
      patchPodTemplateMetadata:
        labels:
          alicloud.service.tag: gray
          opensergo.io/canary-gray: gray
```

  </TabItem>
</Tabs>

### 效果解释
当下发`spring-cloud-a`的新版本时：
- 工作负载`spring-cloud-a`的原生滚动发布行为会被暂停，从而确保稳定版本的实例在灰度过程中依然可用
- 具有1个实例的新的灰度Deployment会被创建，并且这个实例会具有`alicloud.service.tag: gray` 和`opensergo.io/canary-gray: gray`的标签。 
- 流量请求头`User-Agent`匹配为foo的入口流量会被引流到这个灰度实例上，同时流量会新增一个请求头`x-mse-tag=gray`, 便于微服务引擎识别灰度流量。
- `spring-cloud-a` 的灰度实例在调用下游服务时 ，会尽量选取`spring-cloud-b`相应的灰度实例，当`spring-cloud-b`不存在灰度实例时，会选取稳定版本的实例。请注意，这个步骤需要对应的服务发现实现的支持

当您认为金丝雀验证已经通过并确认进行下一步时：
- `spring-cloud-a`工作负载将使用本机滚动更新策略进行升级；
- 流量将恢复到原始的负载均衡策略；
- 金丝雀Deployment和Pods将被删除。


### 已知目前支持全链路灰度的网关实现如下:
- [MSE](https://help.aliyun.com/zh/mse/user-guide/implement-mse-based-end-to-end-canary-release-by-using-kruise-rollouts)(阿里云微服务引擎)

# 使用Istio作流量路由

**FEATURE STATE:** Kruise Rollout v0.5.0

这里展示了如何配置Kruise Rollout来使用Istio作为流量路由

## 完整的发布流程
### 部署deploymet `workload-demo` 和 service `service-demo`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-demo
spec:
  ports:
  - port: 80
    name: http
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workload-demo
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        env:
        - name: version
          value: base
        ports:
        - containerPort: 80
```
### 部署 VirtualService `vs-demo`， 配置其路由流量到 `service-demo`
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: vs-demo
spec:
  gateways:
  - simple-gateway
  hosts:
    - "*"
  http:
  - route:
      - destination:
          host: service-demo
```
### 下发Rollout配置 `rollouts-demo`
```yaml
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
      steps:
      - replicas: 1
        matches:
        - headers:
          - type: Exact
            name: version
            value: canary
      - traffic: 50%
        replicas: 50%
      - traffic: 80%
        replicas: 80%
      trafficRoutings:
      - service: mocka
        customNetworkRefs:
        - apiVersion: networking.istio.io/v1alpha3
          kind: VirtualService
          name: vs-demo
```
当您下发了一个deploymet(workload-demo)的新版本时，Kruise Rollout会根据发布策略， 来修改VirtualService的配置, 具体的发布步骤如下：

- 一个新的金丝雀deployment会被创建， 且其实例为1. 带有http头 `version=canary`的流量会被Istio路由到金丝雀pod上， 而其他的流量会被路由到稳定版本的pod上去。 
- 更新金丝雀deployment的实例数为稳定版deployment实例数的50%， 并且路由20%的流量到金丝雀的pod上。
- 更新金丝雀deployment的实例数为稳定版deployment实例数的80%， 并且路由80%的露露到金丝雀的pod上。 

### 更新deployment `workload-demo`
通过运行如下命令来， 修改负载的环境变量， 从而触发发布流程
```shell
$ kubectl patch deployment workload-demo -p \
'{"spec":{"template":{"spec":{"containers":[{"name":"nginx", "env":[{"name":"version", "value":"canary"}]}]}}}}'
```
等待片刻， Kruise Rollout就会执行如下的操作: 

- 暂停老版本deployment对象的原生发布动作
- 用环境变量`version: canary` 来创建一个新的Deployment 
- 创建一个新的Service `service-demo-canary`用来路由流量到新版本的pod
- 更新VirtualService `vs-demo`来修改Istio的流量路由行为

当发布的第一个步骤完成后， 检查VirtualService `vs-demo`, 可以看到如下的变化： 
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  annotations:
    rollouts.kruise.io/original-spec-configuration: '{"spec":{"gateways":["simple-gateway"],"hosts":["*"],"http":[{"route":[{"destination":{"host":"service-demo"}}]}]},"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"networking.istio.io/v1beta1\",\"kind\":\"VirtualService\",\"metadata\":{\"annotations\":{},\"name\":\"vs-demo\",\"namespace\":\"default\"},\"spec\":{\"gateways\":[\"simple-gateway\"],\"hosts\":[\"*\"],\"http\":[{\"route\":[{\"destination\":{\"host\":\"service-demo\"}}]}]}}\n"}}'
  name: vs-demo
spec:
  gateways:
  - simple-gateway
  hosts:
  - '*'
  http:
  # 理由带有http头version=canary的流量到新版本的pod(通过service-demo-canary）
  - match:
    - headers:
        version:
          exact: canary
    route:
    - destination:
        host: service-demo-canary
  - route:
    - destination:
        host: service-demo

```
运行`kubectl-kruise rollout approve rollout/rollouts-demo -n default`来开始发布的第二个步骤. 当第二个发布步骤完成后， 检查VirtualService `vs-demo`， 可以看到如下的变化
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  annotations:
    rollouts.kruise.io/original-spec-configuration: '{"spec":{"gateways":["simple-gateway"],"hosts":["*"],"http":[{"route":[{"destination":{"host":"service-demo"}}]}]},"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"networking.istio.io/v1beta1\",\"kind\":\"VirtualService\",\"metadata\":{\"annotations\":{},\"name\":\"vs-demo\",\"namespace\":\"default\"},\"spec\":{\"gateways\":[\"simple-gateway\"],\"hosts\":[\"*\"],\"http\":[{\"route\":[{\"destination\":{\"host\":\"service-demo\"}}]}]}}\n"}}'
  name: vs-demo
spec:
  gateways:
  - simple-gateway
  hosts:
  - '*'
  http:
  - route:
    - destination:
        host: service-demo
      weight: 50
    - destination:
        host: service-demo-canary
      weight: 50 # 路由50%的流量到新版本pod
```
运行`kubectl-kruise rollout approve rollout/rollouts-demo -n default` 来开始发布的第三个步骤， 当第三个发布步骤完成后， 检查VirtualService `vs-demo`， 可以看到如下的变化

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  annotations:
    rollouts.kruise.io/original-spec-configuration: '{"spec":{"gateways":["simple-gateway"],"hosts":["*"],"http":[{"route":[{"destination":{"host":"service-demo"}}]}]},"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"networking.istio.io/v1beta1\",\"kind\":\"VirtualService\",\"metadata\":{\"annotations\":{},\"name\":\"vs-demo\",\"namespace\":\"default\"},\"spec\":{\"gateways\":[\"simple-gateway\"],\"hosts\":[\"*\"],\"http\":[{\"route\":[{\"destination\":{\"host\":\"service-demo\"}}]}]}}\n"}}'
  name: vs-demo
spec:
  gateways:
  - simple-gateway
  hosts:
  - '*'
  http:
  - route:
    - destination:
        host: service-demo
      weight: 20
    - destination:
        host: service-demo-canary
      weight: 80 # 路由80%的流量到新版本pod
```
运行`kubectl-kruise rollout approve rollout/rollouts-demo -n default`来完成发布流程， Kruise Rollout会进行如下的收尾工作:

- 删除金丝雀Deployment.
- 删除金丝雀Service `service-demo-canary`.
- 恢复Deployment `workload-demo` 的原生发布动作
- 恢复VirtualService `vs-demo`，去除金丝雀流量路由相关的规则


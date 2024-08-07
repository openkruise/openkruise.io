# Traffic Routing with Istio

**FEATURE STATE:** Kruise Rollout v0.5.0

This page is a demo to show how to utilize Kruise Rollout to do traffic routing with Istio.

## A Complete Release Process
### Deploy deployment `workload-demo` and service `service-demo`
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
### Deploy VirtualService `vs-demo` which routes traffic to `service-demo`
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
### Deploy Rollout `rollouts-demo`
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
When you apply a new revision for workload-demo, Kruise Rollout will modify configuration of VirtualService to comply with release strategies:

- A new canary Deployment will be created, and its replicas is 1. Traffic with header `version=canary` will be routed to the new-version pods while other traffic will be routed to stable-version pods.
- Update the replicas of canary Deployment to "50%" of workload-demo and route 50% of traffic to new-version pods.
- Update the replicas of canary Deployment to "80%" of workload-demo and route 80% of traffic to new-version pods.

### Upgrade deployment `workload-demo`
Run the following command to update env `version: base` to `version: canary` to start release.
```shell
$ kubectl patch deployment workload-demo -p \
'{"spec":{"template":{"spec":{"containers":[{"name":"nginx", "env":[{"name":"version", "value":"canary"}]}]}}}}'
```
Wait a while, Kruise Rollout will do the following work for you:

- Pause the base Deployment.
- Create a new Deployment with env `version: canary`.
- Create a new Service `service-demo-canary` to route traffic to new-version pods.
- Update VirtualService `vs-demo` to do traffic routing.

After the first release step is done, check VirtualService `vs-demo` and you will see:
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
  # route traffic with header version=canary to new-version pods
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
Run `kubectl-kruise rollout approve rollout/rollouts-demo -n default` to start second release step. After the second release step is done, check VirtualService `vs-demo` and you will see:
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
      weight: 50 # route 50% traffic to new-version pods
```
Run `kubectl-kruise rollout approve rollout/rollouts-demo -n default` to start third release step. After the third release step is done, check VirtualService `vs-demo` and you will see:

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
      weight: 80 # route 80% traffic to new-version pods
```
Run `kubectl-kruise rollout approve rollout/rollouts-demo -n default` to complete the release, Kruise Rollout will do some finalising work:

- Delete the canary Deployment.
- Delete the canary Service `service-demo-canary`.
- Resume the base Deployment.
- Restore the VirtualService `vs-demo`.

After that, the release is done and your are ready to use the new-version service.

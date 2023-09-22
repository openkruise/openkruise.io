<a name="SGfPX"></a>

# Traffic Routing with Istio API
## Recommended Configuration
```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  annotations:
    rollouts.kruise.io/rolling-style: canary
spec:
  objectRef:
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
      - weight: 50
      - weight: 80
      trafficRoutings:
      - service: mocka 
        customNetworkRefs:
        - apiVersion: networking.istio.io/v1alpha3
          kind: VirtualService
          name: vs-demo
```
<a name="Pexto"></a>

## Behavior Explanation
When you apply a new revision for workload-demo, Kruise Rollout will modify configuration of VirtualService to comply with release strategies:

- A new canary Deployment will be created, and its replicas is 1. Traffic with header `version=canary` will be routed to the new-version pods while other traffic will be routed to stable-version pods.
- Update the replicas of canary Deployment to "50%" of workload-demo and route 20% of traffic to new-version pods.
- Update the replicas of canary Deployment to "80%" of workload-demo and route 80% of traffic to new-version pods.

# Canary Release

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Canary Release Process
![ab](../../static/img/rollouts/canary.jpg)

## Recommended Configuration

**Note: v1beta1 available from Kruise Rollout v0.5.0.**

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

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

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```YAML
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
      - weight: 20
        trafficRoutings:
        - service: service-demo
          ingress:
            classType: nginx
            name: ingress-demo
```

  </TabItem>
</Tabs>

### Behavior Explanation
When you apply a new revision for `workload-demo`:
- The workload `workload-demo` will be paused, and no Pod is updated;
- A new canary Deployment will be created, and its replicas is "20%" of `workload-demo` (There will be `120%` Pods totally);
- `20%` traffic will be guided to the new canary Deployment Pods.

When you thought the verification of canary is ok, and confirmed to next step:
- The workload `workload-demo` will be upgraded using native rolling update strategy;
- The traffic will be restored to native load balance strategy.
- The canary Deployment and Pods will be deleted.

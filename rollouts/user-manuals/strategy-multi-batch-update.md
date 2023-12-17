# Multi-Batch Release

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Multi-Batch Strategy Process
![ab](../../static/img/rollouts/multi-batch.jpg)

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
    enableExtraWorkloadForCanary: false
    steps:
    - replicas: 1
    - replicas: 50%
    - replicas: 100%
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```YAML
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  annotations:
    rollouts.kruise.io/rolling-style: partition
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
      - replicas: 50%
      - replicas: 100%
```

  </TabItem>
</Tabs>


**Note: Currently, multi-batch strategy can work on CloneSet, StatefulSet, Advanced StatefulSet, and Deployment.**

### Behavior Explanation
When you apply a new revision for `workload-demo`:
- `1` Pods will be updated and `replicas-1` Pods is still at stable revision in the 1-st batch, need manual confirmation to next batch.
- `50%` Pods will be updated and `50%` Pods is still at stable revision in the 2-nd batch, need manual confirmation to next batch.
- `100%` Pods will be updated and `0` Pods is still at stable revision in the 3-rd batch.

Different from [canary release strategy](strategy-canary-update.md), **No extra Deployment is created during rollout progressing**.

# Multi-Batch Release

## Multi-Batch Strategy Process
![ab](../../static/img/rollouts/multi-batch.jpg)

## Recommended Configuration
**Note: Currently, multi-batch strategy can work on CloneSet, StatefulSet, Advanced StatefulSet, and Deployment.**

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

### Behavior Explanation
When you apply a new revision for `workload-demo`:
- `1` Pods will be updated and `replicas-1` Pods is still at stable revision in the 1-st batch, need manual confirmation to next batch.
- `50%` Pods will be updated and `50%` Pods is still at stable revision in the 2-nd batch, need manual confirmation to next batch.
- `100%` Pods will be updated and `0` Pods is still at stable revision in the 3-rd batch.

Different from [canary release strategy](strategy-canary-update.md), **No extra Deployment is created during rollout progressing**.

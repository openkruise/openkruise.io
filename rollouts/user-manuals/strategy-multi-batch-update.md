# Multi-Batch Release

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Multi-batch strategy is a special kind of canary release that updates application replicas in predefined stages without requiring separate canary workloads or traffic routing configurations. This approach is particularly suited for:

- Applications running multiple replicas
- Scenarios where gradual rollout validation is needed without complex traffic management
- Workloads that can be validated through replica-level monitoring rather than traffic-based analysis

## Strategy Process

![Multi-Batch Release Flow](../../static/img/rollouts/multi-batch.jpg)

The multi-batch strategy executes rollouts in sequential phases, with each batch updating a specified number or percentage of pods. Manual approval gates between batches provide control points for validation before proceeding to subsequent phases.

## Recommended Configuration

**Note: The v1beta1 API is available from Kruise Rollout v0.5.0.**

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

### Supported Workload Types

The multi-batch strategy is compatible with the following Kubernetes workload resources:

- Deployment
- StatefulSet
- DaemonSet (Rollout v1beta1 only)
- Kruise Advanced StatefulSet
- Kruise Advanced DaemonSet
- Kruise CloneSet

### Behavior Explanation

When applying a new revision to `workload-demo`, the rollout progresses through the defined batches as follows:

- `1` Pods will be updated and `replicas-1` Pods is still at stable revision in the 1-st batch, need manual confirmation to next batch.
- `50%` Pods will be updated and `50%` Pods is still at stable revision in the 2-nd batch, need manual confirmation to next batch.
- `100%` Pods will be updated and `0` Pods is still at stable revision in the 3-rd batch.

Different from [canary release strategy](strategy-canary-update.md), **No extra Deployment is created during rollout progressing**.

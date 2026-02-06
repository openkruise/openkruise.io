# Warm Pool Management

This document introduces how to create a warm pool through `SandboxSet`.

## Purpose of Warm Pool

A warm pool is a collection of pre-created `Sandbox` replicas. When an Agent needs to acquire a Sandbox, it can quickly
obtain one directly from the warm pool, significantly improving the Sandbox delivery efficiency.

## Creating Warm Pool via `SandboxSet`

`SandboxSet` is a workload that manages multiple identical `Sandbox` replicas, similar to `ReplicaSet` in K8s that
manages multiple `Pods`. Its features include:

- Low-latency scaling specially optimized for high-frequency scaling scenarios
- Serving as a Sandbox template (see [Sandbox Claim](./sandbox-claim.md))

A typical `SandboxSet` looks like this:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo
  namespace: default
spec:
  # Size of the warm pool, recommended to be slightly larger than estimated request burst
  replicas: 10
  # Content to be preserved during sandbox hibernation and wake-up
  persistentContents:
    - ip
  # Sandbox template, consistent with Sandbox CRD
  template:
    # Add metadata for the finally created Pod
    metadata:
      annotations:
        foo: bar
    # Final Pod Spec
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
```


> The short name for `SandboxSet` is `sbs`, and you can operate this resource through commands like `kubectl get sbs`.

## Warm Sandbox States

`SandboxSet` adopts a simplified state model for its warm `Sandbox`, containing two states:

- **creating**: The sandbox is being created. It might be that the Pod is being created, or the Pod has been created but the
  sandbox container has not completed startup. These sandboxes cannot be claimed.
- **available**: The sandbox is ready and can be claimed at any time.

You can check the number of sandboxes in available state through the `status.availableReplicas` field, or directly view
it through the `kubectl get` command:

```shell
$ kubectl get sbs -n default
NAME   REPLICAS   AVAILABLE   UPDATEREVISION   AGE
demo   10         10          78dd8599cf       19m
```

## Claiming and Replenishing Warm Sandboxes

You can claim an available sandbox from the warm pool in various ways, refer to [Sandbox Claim](./sandbox-claim.md).
When a sandbox is claimed, `SandboxSet` will immediately scale up to replenish the inventory. The replica count of
`SandboxSet` does not include allocated sandboxes. Here is an example:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 1: Initial State - Warm Pool Ready                                    │
│ SandboxSet: replicas=3, availableReplicas=3                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"
    +-------------------------------------+
    |  +-----------+  +-----------+       |
    |  | Sandbox-1 |  | Sandbox-2 |       |
    |  | available |  | available |       |
    |  +-----------+  +-----------+       |
    |                                     |
    |       +-----------+                 |
    |       | Sandbox-3 |                 |
    |       | available |                 |
    |       +-----------+                 |
    +-------------------------------------+


                        |
                        | Agent claims a Sandbox
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Sandbox Claimed - Scale-up Triggered                               │
│ SandboxSet: replicas=2, availableReplicas=2                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |--->|  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |  [!] Replicas shortage detected |
    |      Starting scale-up...       |
    +---------------------------------+


                        |
                        | SandboxSet auto-scales
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 3: Creating New Sandbox - Restoring Replicas                          │
│ SandboxSet: replicas=3, availableReplicas=2                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |    |  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |  . . . . . . . .                |
    |  . Sandbox-4   . [Pod Starting] |
    |  . creating    .                |
    |  . . . . . . . .                |
    +---------------------------------+


                        |
                        | New Sandbox ready
                        v

┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 4: Warm Pool Restored - Back to Initial State                         │
│ SandboxSet: replicas=3, availableReplicas=3                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    SandboxSet "demo"                      Allocated to Agent
    +---------------------------------+    +------------------+
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |  | Sandbox-2 |  | Sandbox-3 |   |    |  | Sandbox-1   | |
    |  | available |  | available |   |    |  | (claimed)   | |
    |  +-----------+  +-----------+   |    |  +-------------+ |
    |                                 |    +------------------+
    |       +-----------+             |
    |       | Sandbox-4 |  [Ready]    |
    |       | available |             |
    |       +-----------+             |
    |                                 |
    |  [OK] Pool replenished          |
    |       Ready for next claim      |
    +---------------------------------+
```
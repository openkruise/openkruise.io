# Warm Pool Management

This document introduces how to create, scale, and upgrade a warm pool through `SandboxSet`.

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

## Scaling the Warm Pool

The size of a warm pool is controlled by `spec.replicas` of the SandboxSet. Because the controller continuously writes the warm pool's state back to the SandboxSet object (sandbox creation/deletion, available counts, revisions, etc.), a busy SandboxSet is updated very frequently. **Replica count changes must therefore be made through the `scale` subresource of the SandboxSet, instead of updating the whole object**. A full-object update carries the `resourceVersion` read earlier and conflicts with the controller's writes, causing frequent write conflicts on a busy SandboxSet; the `scale` subresource only touches `spec.replicas` and avoids these conflicts.

For example, use `kubectl scale`, which operates on the `scale` subresource directly, to scale the pool:

```bash
# Scale the warm pool up to 20 sandboxes
kubectl scale sbs demo --replicas=20 -n default

# Scale the warm pool down to 5 sandboxes
kubectl scale sbs demo --replicas=5 -n default
```

:::caution
Do not scale by issuing a full-object `Update` from a client — on a busy SandboxSet this leads to frequent `409 Conflict` errors — and do not change `replicas` together with other template fields via `kubectl edit`. Always go through the `scale` subresource. If you operate on SandboxSet through a Kubernetes client (Go client, REST API, etc.), likewise target the `scale` subresource, e.g., `client.SubResource("scale").Update(...)` in controller-runtime, instead of issuing a full-object `Update`.
:::

`SandboxSet` also provides strategy fields to control the pace of scaling and rolling updates, helping to minimize the impact on cluster resources and service availability.

### `scaleStrategy.maxUnavailable`

This field limits the maximum number of sandboxes that can be **unavailable** (i.e., in the `creating` state) during **scaling operations**. It is useful when you want to avoid a sudden surge of Pod creation that could pressure the cluster.

- Can be an absolute number (e.g., `5`) or a percentage string (e.g., `"20%"`).
- Default: no limit (all new sandboxes are created simultaneously).

```yaml
spec:
  replicas: 20
  scaleStrategy:
    # At most 5 sandboxes can be in the creating state at any time during scaling
    maxUnavailable: 5
```

:::tip
When scaling up, newly created sandboxes are launched in batches respecting this limit. For example, if `maxUnavailable: 5` and you scale from 0 to 20, sandboxes are created in groups of 5 — each new batch starts only after the previous batch becomes `available`.
:::

## Upgrading Pre-warmed Pool Sandboxes

When you modify the `spec.template` field of a SandboxSet, the controller detects the template change and performs a **rolling update** of the sandboxes in the pool.

### How It Works

The controller:

1. Computes a new `updateRevision` hash from the updated template.
2. Deletes old-revision sandboxes in batches (respecting `maxUnavailable`).
3. Creates new sandboxes with the updated template to maintain the desired replica count.

During **scale-up**, newly created sandboxes use the latest template. During **scale-down**, sandboxes with the old revision are removed first.

### Configuration

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: my-sandbox-pool
  namespace: default
spec:
  replicas: 10
  updateStrategy:
    # Maximum number or percentage of sandboxes that can be unavailable during the update.
    # Can be an absolute number (e.g., 5) or a percentage (e.g., "10%").
    # Default: "20%"
    maxUnavailable: "20%"
  template:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2   # Update the image version here
          resources:
            requests:
              cpu: "1"
              memory: "512Mi"
            limits:
              cpu: "2"
              memory: "1Gi"
```

To trigger an upgrade, modify any field under `spec.template` (e.g., container image, resources, environment variables) and submit the change as a patch (see [Use Patch, Not Full-Object Update](#use-patch-not-full-object-update)).

### `updateStrategy.maxUnavailable`

This field controls the maximum number or percentage of sandboxes that can be **unavailable** during a **rolling update** (triggered by modifying `spec.template`). It determines the batch size of the rolling update.

- Can be an absolute number (e.g., `5`) or a percentage string (e.g., `"20%"`).
- Default: `"20%"`.

```yaml
spec:
  replicas: 10
  updateStrategy:
    # At most 3 sandboxes can be unavailable during the rolling update
    maxUnavailable: 3
```

### Use Patch, Not Full-Object Update

Modifications to a SandboxSet (e.g., updating `spec.template`) **must be submitted as a patch, not a full-object update**. The controller continuously writes the warm pool's state (sandbox creation/deletion, available counts, revisions) back to the SandboxSet object; a full-object `Update` sends the entire object together with the `resourceVersion` read earlier, so it frequently fails with write conflicts (`409 Conflict`) and forces clients into repeated retries. A patch only carries the changed fields and does not conflict with the controller's writes.

For example, update the sandbox image with `kubectl patch`:

```bash
kubectl patch sbs my-sandbox-pool --type merge -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"sandbox","image":"my-registry/sandbox-image:v2"}]}}}}'
```

`kubectl edit` works in the same way: it computes the diff between the original object and your edits and submits it as a patch, so it is also safe on a busy SandboxSet:

```bash
kubectl edit sbs my-sandbox-pool -n default
```

In the editor, modify the fields under `spec.template` (e.g., the container image) and save; kubectl submits the change as a patch.

:::caution
Do not upgrade a SandboxSet through full-object `Update`/`Replace` operations (e.g., `kubectl replace`, or a full-object `Update` call in code). On a busy SandboxSet this causes frequent write conflicts.
:::

### Monitoring Progress

Check the SandboxSet status to monitor the rolling update:

```bash
kubectl get sandboxset my-sandbox-pool -o wide
```

Example output:

```
NAME              REPLICAS   AVAILABLE   UPDATEDREPLICAS   UPDATEDAVAILABLEREPLICAS   UPDATEREVISION   AGE
my-sandbox-pool   10         8           6                 5                          a1b2c3d4         30m
```

| Field | Description |
|---|---|
| `REPLICAS` | Total number of sandboxes (creating + available + running + paused) |
| `AVAILABLE` | Number of sandboxes ready to be claimed |
| `UPDATEDREPLICAS` | Number of sandboxes that have been updated to the latest revision |
| `UPDATEDAVAILABLEREPLICAS` | Number of updated sandboxes that are available |
| `UPDATEREVISION` | Hash of the current desired template version |

The rolling update is complete when `UPDATEDAVAILABLEREPLICAS` equals the desired `REPLICAS` count.

You can also inspect individual sandbox revisions:

```bash
kubectl get sandboxes -l agents.kruise.io/sandbox-template=my-sandbox-pool -o custom-columns=\
NAME:.metadata.name,\
PHASE:.status.phase,\
REVISION:.status.updateRevision
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
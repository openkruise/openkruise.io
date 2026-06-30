---
id: checkpoint
title: Snapshot Management
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Snapshot Management

## Overview

`Checkpoint` is a first-class CRD in OpenKruise Agents. Each `Checkpoint` object captures a point-in-time state of a
running sandbox Pod — its **memory** and/or **filesystem** — and can later be used to clone (fork) brand-new sandboxes from
that exact state.

OpenKruise Agents exposes Checkpoint capabilities through **two** parallel interfaces; both write to the same
underlying `Checkpoint` CR:

| Interface                | Consumer                                                                 | Typical usage                                  |
|--------------------------|--------------------------------------------------------------------------|------------------------------------------------|
| Kubernetes CRD           | Cluster operators, declarative GitOps, direct `kubectl` / controller use | Create, list, delete, GC Checkpoints natively  |
| E2B SDK (snapshot API)   | Application code using the E2B Python / JavaScript SDK                   | Programmatic snapshot lifecycle from a sandbox |

> In the E2B SDK, the concept is called **snapshot**. In OpenKruise Agents, the underlying object is a
> `Checkpoint` CR — `snapshotId` returned by the E2B API is exactly the `Checkpoint` name. This page documents the
> Checkpoint features and shows both access styles side-by-side.

## Checkpoint vs. Pause / Resume

Checkpoints and [Pause / Resume](./pause-resume.md) share the underlying capture machinery, but they answer different
questions:

|                              | Pause / Resume                                | Checkpoint (Snapshot)                                 |
|------------------------------|-----------------------------------------------|-------------------------------------------------------|
| Effect on the source sandbox | Paused (stopped)                              | Briefly paused, then resumes running (configurable)   |
| Relationship                 | One-to-one — resume restores the same sandbox | One-to-many — one Checkpoint can be cloned into many sandboxes |
| Sandbox ID after the call    | Unchanged                                     | Source unchanged; each cloned sandbox gets a new ID            |
| Typical use case             | Suspend and later resume a single sandbox     | Checkpointing, rollback, forking runtime state        |

## Checkpoint CRD

The `Checkpoint` resource (`agents.kruise.io/v1alpha1`, short name `cp`) has the following key fields:

| Field                       | Type       | Description                                                                                                                            |
|-----------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `spec.podName`              | `string`   | Name of the target Pod to checkpoint. Usually equals the target sandbox name.                                                          |
| `spec.sandboxName`          | `string`   | Optional — explicit source Sandbox name when `podName` is not enough to locate it.                                                     |
| `spec.keepRunning`          | `bool`     | Whether the source Pod keeps running after the checkpoint completes. Defaults to `true`. If `false`, Pod phase becomes `Succeeded`.     |
| `spec.persistentContents`   | `[]string` | What to persist. Valid values: `memory`, `filesystem`. Defaults to both when empty (inherited from the source template).               |
| `spec.ttlAfterFinished`     | `string`   | Go duration (e.g. `30m`, `24h`, `30d`). When set, the Checkpoint is auto-deleted after that period. Unset means keep until manual delete. |
| `status.phase`              | `string`   | `Pending` / `Creating` / `Succeeded` / `Failed` / `Terminating`.                                                                       |
| `status.checkpointId`       | `string`   | Identifier of the captured state in the backing Checkpoint driver. Filled once phase is `Succeeded`.                                   |
| `status.completionTime`     | `Time`     | Set when phase transitions to `Succeeded` or `Failed`.                                                                                 |

## Creating a Checkpoint

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

Apply a `Checkpoint` manifest against the target Pod / Sandbox:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Checkpoint
metadata:
  name: checkpoint-code-demo-01
  namespace: default
spec:
  # Target Pod name
  podName: code-interpreter-28rvn
  # Whether the Pod remains Running after the checkpoint completes.
  # If false, the Pod phase transitions to Succeeded.
  keepRunning: true
  # Auto-GC the Checkpoint CR after this duration. Accepts Go duration format (30m, 30h, 30d).
  # When unset, the Checkpoint is kept until explicitly deleted.
  ttlAfterFinished: 30h
  # What to persist. Currently only "memory" and "filesystem" are supported.
  # Defaults to both.
  persistentContents:
    - memory
    - filesystem
```

Watch the Checkpoint progress:

```shell
$ kubectl get cp
NAME                       STATUS      AGE
checkpoint-code-demo-01    Succeeded   24s
```

Once `STATUS` is `Succeeded`, the Checkpoint is ready to be used as a starting point for new sandboxes.

</TabItem>
<TabItem value="E2B" label="E2B SDK">

Call `createSnapshot` from a running sandbox. The sandbox is briefly paused, the Checkpoint is written, and then the
sandbox resumes. The returned `snapshotId` equals the backing Checkpoint name.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo")

snapshot = sbx.create_snapshot()
print("Snapshot ID:", snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create('demo')

const snapshot = await sandbox.createSnapshot()
console.log('Snapshot ID:', snapshot.snapshotId)
```

#### OpenKruise Agents extensions

`createSnapshot` accepts the following OpenKruise Agents-specific fields via custom HTTP headers. They map directly
onto `Checkpoint.spec` fields and are only effective against the sandbox-manager deployed by OpenKruise Agents.

| Header                                          | Maps to `Checkpoint.spec`         | Example              |
|-------------------------------------------------|-----------------------------------|----------------------|
| `x-e2b-kruise-snapshot-keep-running`            | `keepRunning`                     | `true`               |
| `x-e2b-kruise-snapshot-ttl`                     | `ttlAfterFinished`                | `24h`                |
| `x-e2b-kruise-snapshot-persistent-contents`     | `persistentContents`              | `memory,filesystem`  |
| `x-e2b-kruise-snapshot-wait-success-seconds`    | Server-side wait for `Succeeded`  | `60`                 |

You can inject these headers through your SDK's client factory, or call the REST endpoint directly:

```shell
curl -X POST "https://api.${E2B_DOMAIN}/sandboxes/${SANDBOX_ID}/snapshots" \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  -H "x-e2b-kruise-snapshot-ttl: 24h" \
  -H "x-e2b-kruise-snapshot-persistent-contents: memory,filesystem" \
  -d '{}'
```

</TabItem>
</Tabs>

## Listing Checkpoints

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

Use the short name `cp` with kubectl. Checkpoints are namespaced:

```shell
$ kubectl get cp -n default
NAME                       STATUS      AGE
checkpoint-code-demo-01    Succeeded   5m
checkpoint-code-demo-02    Creating    10s
```

Filter by the source sandbox with the `agents.kruise.io/sandbox-name` label (set automatically on Checkpoints created
through the E2B API; can be set manually on CRD-created ones):

```shell
$ kubectl get cp -l agents.kruise.io/sandbox-name=code-interpreter-28rvn
```

</TabItem>
<TabItem value="E2B" label="E2B SDK">

`listSnapshots` returns only Checkpoints whose phase is `Succeeded` and whose owner matches the caller's API-key user.
Results are sorted by `CreationTimestamp` (descending) and are server-side paginated.

```python
from e2b_code_interpreter import Sandbox

paginator = Sandbox.list_snapshots()
snapshots = []
while paginator.has_next:
    snapshots.extend(paginator.next_items())
```

```ts
import { Sandbox } from 'e2b'

const paginator = Sandbox.listSnapshots()
const snapshots = []
while (paginator.hasNext) {
  snapshots.push(...(await paginator.nextItems()))
}
```

Filter by source sandbox:

```python
paginator = Sandbox.list_snapshots(sandbox_id="your-sandbox-id")
```

Query parameters supported by `GET /snapshots`:

| Query parameter | Description                                                       | Range  |
|-----------------|-------------------------------------------------------------------|--------|
| `limit`         | Maximum entries per page                                          | 1–100  |
| `nextToken`     | Opaque cursor returned via the `x-next-token` response header     | —      |
| `sandboxID`     | Restrict results to Checkpoints produced from the given sandbox   | —      |

</TabItem>
</Tabs>

## Deleting a Checkpoint

Deleting a Checkpoint removes both the `Checkpoint` CR and its paired `SandboxTemplate`. Existing sandboxes already
cloned from it are **not** affected.

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

```shell
kubectl delete cp checkpoint-code-demo-01 -n default
```

You can also let `spec.ttlAfterFinished` handle automatic cleanup.

</TabItem>
<TabItem value="E2B" label="E2B SDK">

`deleteSnapshot` is **idempotent** — deleting a missing snapshot still returns success.

```python
from e2b_code_interpreter import Sandbox

deleted = Sandbox.delete_snapshot(snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const deleted = await Sandbox.deleteSnapshot(snapshot.snapshotId)
```

> The E2B delete endpoint refuses to delete IDs that belong to a user-managed `SandboxSet`-backed template. Those
> templates must be managed through Kubernetes (see [Claiming Sandboxes](./sandbox-claim.md)).

</TabItem>
</Tabs>

## Creating a Sandbox from a Checkpoint

A `Succeeded` Checkpoint can be used as the starting point for new sandboxes. The `Checkpoint.name` is passed as the
template identifier.

<Tabs>
<TabItem value="CRD" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-from-checkpoint
  namespace: default
spec:
  # When a Checkpoint with this name exists in the same namespace,
  # the claim goes through the clone path instead of the warm-pool path.
  templateName: checkpoint-code-demo-01
```

</TabItem>
<TabItem value="E2B" label="E2B SDK">

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const newSandbox = await Sandbox.create(snapshot.snapshotId)
```

</TabItem>
</Tabs>

#### Sandbox Naming (v0.3.0+)

:::note
**v0.3.0+**: Custom sandbox naming is only supported when creating a sandbox from a Checkpoint (clone path).
It is **not** available when claiming from a SandboxSet warm pool — the request will be rejected.
:::

When creating a sandbox from a Checkpoint, you can control the resulting sandbox name instead of relying on a
randomly generated one.

> `e2b.agents.kruise.io/sandbox-name` and `e2b.agents.kruise.io/sandbox-generate-name` are OpenKruise Agents
> extension fields and will not be added to the Sandbox resource as metadata.

**Explicit name:**

Use `e2b.agents.kruise.io/sandbox-name` to assign a fixed name. The name must be a valid
[Kubernetes DNS-1123 label](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
(at most 63 characters, lowercase alphanumeric or `-`, must start and end with an alphanumeric character).

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id, metadata={
    "e2b.agents.kruise.io/sandbox-name": "my-restored-sandbox"
})
```

**Generated name:**

Use `e2b.agents.kruise.io/sandbox-generate-name` to assign a name prefix. A random 5-character suffix will be
appended automatically (e.g., `fork-` → `fork-abcde`). The prefix must end with `-` and follow the same DNS-1123
label rules.

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id, metadata={
    "e2b.agents.kruise.io/sandbox-generate-name": "fork-"
})
# new_sbx.sandbox_id might be "default--fork-x7k9a"
```

> `sandbox-name` and `sandbox-generate-name` are **mutually exclusive**. If both are specified, the request will be
> rejected with an error.

See [Claiming Sandboxes](./sandbox-claim.md) for the full set of claim-time options.

## Checkpoint vs. SandboxTemplate / SandboxSet

Checkpoints and templates both provide reusable starting points for sandboxes, but they solve different problems:

|                 | `SandboxTemplate` / `SandboxSet`                    | `Checkpoint` (Snapshot)                           |
|-----------------|-----------------------------------------------------|---------------------------------------------------|
| Defined by      | Declarative CRD + image                             | Capturing a running sandbox                       |
| Reproducibility | Same definition always produces the same sandbox   | Captures whatever runtime state exists            |
| Best for        | Repeatable base environments, warm pools            | Checkpointing, rollback, forking runtime state    |

Use templates when every sandbox should start from an identical, pre-provisioned base. Use Checkpoints when you need to
capture or fork live runtime state that depends on what happened during execution.

## Notes

1. **Connection drop**: The source sandbox is briefly paused during capture. All active WebSocket, PTY and
   command-stream connections are dropped; clients must be able to reconnect.
2. **Backend dependency**: The actual Checkpoint semantics (what is preserved, speed, size) depend on the Checkpoint
   driver configured in your cluster.
3. **Ownership isolation (E2B)**: `listSnapshots` and the E2B delete path are scoped to the API-key user that owns the
   Checkpoint. Admin-team keys may see Checkpoints across namespaces.
4. **No isolation for CRD access**: Direct `kubectl`/CRD access bypasses the E2B user scoping and is governed purely by
   Kubernetes RBAC on `checkpoints.agents.kruise.io`.
5. **E2B `deleteSnapshot` covers both**: `DELETE /templates/{id}` handles both Checkpoint deletion and template
   deletion. Checkpoints are deletable; `SandboxSet`-backed templates are not.

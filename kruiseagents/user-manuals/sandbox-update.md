# Upgrade Sandboxes

This document describes how to upgrade sandboxes managed by OpenKruise Agents, including both **pre-warmed pool sandboxes** (managed by SandboxSet) and **claimed sandboxes** (already allocated to users).

:::info Version
The base upgrade flow (SandboxSet rolling update and SandboxUpdateOps recreate upgrade) is available since **v0.3.0**.
Upgrading paused sandboxes (`stateFilter`) and the `CheckpointRestore` upgrade mode require **v0.6.0**.
:::

## Overview

OpenKruise Agents supports two upgrade scenarios:

| Scenario | Target Resource | Upgrade Method | Description |
|---|---|---|---|
| Pre-warmed pool | SandboxSet | Rolling update | Modify `spec.template` in SandboxSet to trigger a rolling upgrade of idle sandboxes |
| Claimed sandboxes | SandboxUpdateOps | Batch recreate | Create a SandboxUpdateOps resource to batch upgrade sandboxes that are already claimed and running |

## Prerequisites

- OpenKruise Agents controller is installed and running.
- CRDs (`Sandbox`, `SandboxSet`, `SandboxUpdateOps`) are registered in the cluster.
- For claimed sandbox upgrades with lifecycle hooks, the `agent-runtime` sidecar must be enabled (for executing pre/post upgrade scripts) and `csi` must be enabled (if persistent storage mount is needed).

## Upgrade Pre-warmed Pool Sandboxes (SandboxSet)

Idle sandboxes in a warm pool are upgraded by modifying the SandboxSet template, which triggers a rolling update of the pool. Note that the controller continuously writes the warm pool's state back to the SandboxSet object, so replica count changes must go through the `scale` subresource, and template changes must be submitted as patches instead of full-object updates.

For the complete instructions, including how to use the `scale` subresource and patch-based updates, refer to [Upgrading Pre-warmed Pool Sandboxes](./warmpool-management.md#upgrading-pre-warmed-pool-sandboxes) in [Warm Pool Management](./warmpool-management.md).

## Upgrade Claimed Sandboxes (SandboxUpdateOps)

### How It Works

Claimed sandboxes are already allocated to users and running workloads. To upgrade them, you create a **SandboxUpdateOps** resource that:

1. Selects target sandboxes by label selector.
2. Applies a Strategic Merge Patch to each sandbox's template.
3. Optionally sets lifecycle hooks (pre/post upgrade) for data backup and restoration.
4. The sandbox controller then performs a **Recreate** upgrade for each sandbox — executing the three-phase lifecycle:

```
PreUpgrade (backup) → UpgradePod (delete old pod + create new pod) → PostUpgrade (restore)
```

### Important Constraints

- **Service interruption**: The Recreate upgrade deletes the old pod and creates a new one. The sandbox will be unavailable during the upgrade.
- **Memory and IP loss**: Memory state and IP address are lost during the recreate process (the new pod gets a new IP).
- **One active SandboxUpdateOps per namespace**: Only one SandboxUpdateOps can be actively updating sandboxes in a namespace at a time.
- **Lifecycle hooks require agent-runtime**: Pre/post upgrade scripts are executed via the `agent-runtime` sidecar. Make sure `runtimes: [{name: "agent-runtime"}]` is configured on the target sandboxes.
- **Persistent storage requires CSI**: If the sandbox needs to preserve filesystem data across upgrades, `runtimes: [{name: "csi"}]` must be configured to mount external storage.

### Configuration

#### Basic Example (Image Update Only)

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-my-sandboxes
  namespace: default
spec:
  selector:
    matchLabels:
      agents.kruise.io/sandbox-template: my-sandbox-pool
  updateStrategy:
    # Maximum number of sandboxes that can be upgrading simultaneously.
    # Can be an absolute number or a percentage.
    maxUnavailable: 2
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2
```

#### Full Example with Lifecycle Hooks

Use lifecycle hooks to backup workspace data before upgrade and restore it after the new pod is running:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-with-backup
  namespace: default
spec:
  selector:
    matchLabels:
      agents.kruise.io/sandbox-template: my-sandbox-pool
  updateStrategy:
    maxUnavailable: 1
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2
  lifecycle:
    preUpgrade:
      exec:
        command:
          - /bin/bash
          - -c
          - |
            # Backup workspace data to external storage before pod is destroyed
            tar czf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace .
            echo "Backup completed"
      timeoutSeconds: 120
    postUpgrade:
      exec:
        command:
          - /bin/bash
          - -c
          - |
            # Restore workspace data from external storage after new pod is ready
            if [ -f /mnt/shared/backup-$(hostname).tar.gz ]; then
              tar xzf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace
              rm -f /mnt/shared/backup-$(hostname).tar.gz
              echo "Restore completed"
            fi
      timeoutSeconds: 120
```

**Notes on lifecycle hooks:**
- `preUpgrade`: Executed **before** the old pod is deleted. Use it to save state (e.g., backup files to external/shared storage).
- `postUpgrade`: Executed **after** the new pod is running and ready. Use it to restore state.
- `timeoutSeconds`: Maximum time (in seconds) to wait for the hook to complete. Default is 60 seconds.
- The `exec.command` runs inside the sandbox via the agent-runtime (envd) interface.

### Patch Capabilities

The `spec.patch` field is applied to each selected sandbox as a
[Strategic Merge Patch](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/).
It supports the following operations:

- **Update**: change existing fields, such as a container image or environment variables.
- **Add**: introduce new fields, such as an additional volume or volume mount.
- **Delete**: remove a list item (e.g. a volume or mount) by marking it with `$patch: delete` and its merge key.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: patch-demo
  namespace: default
spec:
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2   # update
          env:
            - name: LOG_LEVEL                    # add
              value: debug
      volumes:
        - name: legacy-cache                     # delete
          $patch: delete
```

### Upgrade Modes

:::info Version
The `CheckpointRestore` mode is available since **v0.6.0**.
:::

`spec.updateStrategy.type` selects how each sandbox is upgraded:

| Mode | Description | Constraints |
|---|---|---|
| `Recreate` (default) | Deletes the old pod and creates a new one. **Does not** preserve rootfs, memory, or IP. | Standard upgrade; use lifecycle hooks to back up and restore data. |
| `CheckpointRestore` | Takes a checkpoint of the rootfs before the upgrade and restores it afterwards, preserving filesystem state. | **Cannot** change the business container image. Only supports updating sidecar versions (via annotation) or non-image fields (env, resources, volumes). |

:::warning
Changing the business container image while using `CheckpointRestore` causes the rootfs to be lost. Use `CheckpointRestore` only for sidecar or non-image field updates; use `Recreate` when the business image must change.
:::

**Example: sidecar update with CheckpointRestore**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-sidecar
  namespace: default
spec:
  updateStrategy:
    type: CheckpointRestore
  patch:
    metadata:
      annotations:
        # Bump this value to trigger a sidecar version update
        agents.kruise.io/upgrade-sidecar: "20260714"
```

### Upgrading Paused Sandboxes

:::info Version
Upgrading paused sandboxes is available since **v0.6.0**.
:::

By default, a SandboxUpdateOps only upgrades sandboxes in the `Running` state. To include paused sandboxes, add
`Paused` to `spec.stateFilter.states`. The controller wakes each paused sandbox, upgrades it, and then re-pauses it if
`spec.paused` remains `true` on the sandbox.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-with-paused
  namespace: default
spec:
  stateFilter:
    states:
      - Running
      - Paused
```

### Applying the Upgrade

```bash
kubectl apply -f sandboxupdateops.yaml
```

### Monitoring Progress

Check the SandboxUpdateOps status:

```bash
kubectl get sandboxupdateops upgrade-my-sandboxes
```

Example output:

```
NAME                    PHASE      TOTAL   UPDATED   UPDATING   FAILED   AGE
upgrade-my-sandboxes    Updating   10      3         2          0        5m
```

| Field | Description |
|---|---|
| `PHASE` | Current phase: `Pending`, `Updating`, `Completed`, or `Failed` |
| `TOTAL` | Total number of sandboxes selected for update |
| `UPDATED` | Number of sandboxes successfully updated |
| `UPDATING` | Number of sandboxes currently being updated |
| `FAILED` | Number of sandboxes that failed to update |

Check individual sandbox status during upgrade:

```bash
kubectl get sandbox -l agents.kruise.io/sandbox-template=my-sandbox-pool
```

A sandbox going through the upgrade will show phase `Upgrading` and transition back to `Running` once the upgrade is complete.

### Detailed Sandbox Upgrade Status

Inspect the conditions on a specific sandbox to see the upgrade progress:

```bash
kubectl get sandbox <sandbox-name> -o yaml
```

The `Upgrading` condition indicates the current stage:

| Condition Reason | Description |
|---|---|
| `PreUpgrade` | Executing the pre-upgrade lifecycle hook |
| `PreUpgradeFailed` | Pre-upgrade hook failed |
| `UpgradePod` | Deleting old pod and creating new pod |
| `UpgradePodFailed` | New pod failed to start (e.g., image pull error, container crash) |
| `PostUpgrade` | Executing the post-upgrade lifecycle hook |
| `PostUpgradeFailed` | Post-upgrade hook failed |
| `Succeeded` | Upgrade completed successfully |

Example condition during upgrade:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  paused: false
status:
  phase: Upgrading
  conditions:
    - type: Ready
      status: "False"
      reason: Upgrading
      message: "sandbox is upgrading"
    - type: Upgrading
      status: "False"
      reason: UpgradePod
      message: ""
```

## Upgrade Lifecycle Flow

The following diagram illustrates the three-phase Recreate upgrade lifecycle for a single sandbox:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Sandbox Upgrade Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Template Changed (revision mismatch detected)                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐   success   ┌────────────┐   success   ┌───────┐ │
│  │PreUpgrade├────────────►│ UpgradePod ├────────────►│Post   │ │
│  │ (backup) │             │(delete old │             │Upgrade│ │
│  └────┬─────┘             │ create new)│             │(restore)││
│       │                   └─────┬──────┘             └───┬───┘ │
│       │ fail                    │ fail                    │fail │
│       ▼                         ▼                        ▼     │
│  PreUpgrade              UpgradePod                PostUpgrade  │
│  Failed                  Failed                    Failed       │
│                                                                 │
│  On success of PostUpgrade:                                     │
│    Phase: Upgrading → Running                                   │
│    Ready: False → True                                          │
│    Upgrading condition: Succeeded                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Diagnosing Upgrade Failures

Check the sandbox conditions for detailed error information:

```bash
kubectl get sandbox <sandbox-name> -o jsonpath='{.status.conditions}' | jq .
```

### Pre-Upgrade Hook Failed

**Symptom**: Sandbox stuck in `Upgrading` phase with condition reason `PreUpgradeFailed`.

**Resolution**:
1. Check the error message in the `Upgrading` condition for script failure details.
2. Fix the pre-upgrade script.
3. Delete the failed SandboxUpdateOps and create a new one to retry.

If backup is not needed, remove the `lifecycle` section from the SandboxUpdateOps spec.

### UpgradePod Failed

**Symptom**: Sandbox stuck in `Upgrading` phase with condition reason `UpgradePodFailed`.

**Common causes**:
- Image pull errors (wrong image name or registry authentication issues).
- Container crash loops (application startup failures).
- Insufficient node resources.

**Resolution**:
1. Check the condition message for container error details.
2. Fix the underlying issue (image, resources, etc.).
3. Delete the failed SandboxUpdateOps and create a new one. If `postUpgrade` hooks are configured, create a new SandboxUpdateOps with only the `postUpgrade` hook (no `preUpgrade` and no `patch`) to complete the recovery.

### Post-Upgrade Hook Failed

**Symptom**: Sandbox stuck in `Upgrading` phase with condition reason `PostUpgradeFailed`.

**Resolution**:
1. Check the error message for script failure details.
2. Fix the post-upgrade script.
3. Delete the failed SandboxUpdateOps and create a new one with only the `postUpgrade` lifecycle (no `preUpgrade` or `patch`) to retry the restoration step.

### Rollback

Two rollback paths are available:

- **Recommended (when a checkpoint exists)**: if a `Checkpoint` was taken before the upgrade (for example, in
  `CheckpointRestore` mode), clone the sandbox from that Checkpoint to restore the previous state. See
  [Snapshot Management](./checkpoint.md#creating-a-sandbox-from-a-checkpoint).
- **Recreate with the original config**: create a new SandboxUpdateOps whose `patch` reverts to the original
  image/configuration.

:::tip
On any retry that runs **after** the pod has already been rebuilt (for example, recovering from an `UpgradePodFailed` or
`PostUpgradeFailed` state), remove the `preUpgrade` hook so the backup step is not executed again. Keep only the
`postUpgrade` hook if restoration is still needed.
:::

To rollback by recreating with the original config:

1. Delete the current SandboxUpdateOps:
   ```bash
   kubectl delete sandboxupdateops <name>
   ```

2. Create a new SandboxUpdateOps that reverts the patch (set the original image/configuration):
   ```yaml
   apiVersion: agents.kruise.io/v1alpha1
   kind: SandboxUpdateOps
   metadata:
     name: rollback-sandboxes
     namespace: default
   spec:
     patch:
       spec:
         containers:
           - name: sandbox
             image: my-registry/sandbox-image:v1  # Revert to the previous version
     lifecycle:
       postUpgrade:
         exec:
           command:
             - /bin/bash
             - -c
             - |
               # Restore data if needed
               if [ -f /mnt/shared/backup-$(hostname).tar.gz ]; then
                 tar xzf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace
               fi
         timeoutSeconds: 120
   ```

## Pausing an Update Operation

You can pause an ongoing SandboxUpdateOps to stop it from upgrading additional sandboxes:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-my-sandboxes
  namespace: default
spec:
  paused: true
```

This prevents new sandboxes from being picked up for upgrade but does not affect sandboxes that are already mid-upgrade.

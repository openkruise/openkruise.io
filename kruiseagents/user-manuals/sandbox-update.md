# Upgrade Sandboxes

This document describes how to upgrade sandboxes managed by OpenKruise Agents, including both **pre-warmed pool sandboxes** (managed by SandboxSet) and **claimed sandboxes** (already allocated to users).

:::info Version
All features described in this document are available since **v0.3.0**.
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

### How It Works

When you modify the `spec.template` field of a SandboxSet, the controller detects the template change and performs a **rolling update** of the sandboxes in the pool. The controller:

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

To trigger an upgrade, simply update any field under `spec.template` (e.g., container image, resources, environment variables) and apply the change:

```bash
kubectl apply -f sandboxset.yaml
```

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

To rollback a failed upgrade:

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
     selector:
       matchLabels:
         agents.kruise.io/sandbox-template: my-sandbox-pool
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
spec:
  paused: true
```

This prevents new sandboxes from being picked up for upgrade but does not affect sandboxes that are already mid-upgrade.

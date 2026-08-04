# On-Demand Volume Mounting

This guide shows how to dynamically mount existing Persistent Volumes (PVs) into a sandbox at claim time. This is useful when you want to share storage across multiple sandboxes or attach pre-existing data volumes without defining them in the `SandboxSet` template.

## Overview

On-demand volume mounting lets you declare one or more PV mounts when claiming a sandbox, rather than provisioning a new PVC per sandbox through `volumeClaimTemplates`. The mount is performed by `agent-runtime` and the CSI sidecars injected into the sandbox Pod.

Key characteristics:

- The PV must already exist in the cluster before claiming.
- The same PV can be mounted into multiple sandboxes (for example, shared datasets or model caches).
- Mounts can be requested through both the E2B SDK and the `SandboxClaim` CRD.

## Prerequisites

1. The `SandboxSet` used to provide sandboxes must enable the `csi` and `agent-runtime` runtimes. For details on runtime injection, see [Runtime Injection](./runtime-injection.md).
2. One or more PVs must already exist in the cluster and be accessible from the sandbox nodes.
3. If your CSI driver requires credentials, the corresponding Secret must be created in advance and referenced by the PV.

## Enable Mount Capability in SandboxSet

Add the `csi` and `agent-runtime` entries to `spec.runtimes` of your `SandboxSet`. The framework will automatically inject the required CSI sidecars and `agent-runtime` into every sandbox created from this template.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: shared-storage-template
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: csi            # Enable dynamic volume mounting
    - name: agent-runtime  # Required for mount orchestration
  template:
    spec:
      containers:
        - name: sandbox
          image: ubuntu:latest
          command: ["sleep", "infinity"]
```

## Prepare a PersistentVolume

Create a PV object backed by your storage system. The example below uses a generic CSI driver; replace the `driver`, `volumeHandle`, and `volumeAttributes` with values appropriate for your CSI provider.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: shared-pv
spec:
  accessModes:
    - ReadWriteMany
  capacity:
    storage: 50Gi
  csi:
    driver: csi-driver.example.com
    volumeHandle: shared-pv
    volumeAttributes:
      server: <STORAGE_SERVER_ADDRESS>
      share: <STORAGE_SHARE_NAME>
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  volumeMode: Filesystem
```

> Replace the CSI driver name and `volumeAttributes` with the actual values required by your storage backend. If your CSI driver requires credentials, configure them according to the driver's documentation.

## Mount Volumes When Claiming

Choose either the E2B SDK or `SandboxClaim` to request the mount at claim time.

### Via E2B SDK

Use the `e2b.agents.kruise.io/csi-volume-config` extension with a JSON array to declare one or more volume mounts.

```python
import json
from e2b_code_interpreter import Sandbox

csi_config = json.dumps([
    {"pvName": "shared-pv-1", "mountPath": "/data1"},
    {"pvName": "shared-pv-2", "mountPath": "/data2", "subPath": "sub/dir", "readOnly": True}
])

sbx = Sandbox.create(template="shared-storage-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-config": csi_config
})
```

| Field       | Type    | Description                                   | Required |
|-------------|---------|-----------------------------------------------|----------|
| `pvName`    | String  | Name of the existing PV                       | Yes      |
| `mountPath` | String  | Mount target path in the container            | Yes      |
| `subPath`   | String  | Sub path within the persistent volume         | No       |
| `readOnly`  | Boolean | Whether to mount the volume as read-only      | No       |

> The mount target path must be an empty directory; otherwise the mount will fail.

### Via SandboxClaim

Declare the `dynamicVolumesMount` field in your `SandboxClaim`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: shared-storage-claim
  namespace: default
spec:
  templateName: shared-storage-template
  replicas: 1
  claimTimeout: 5m
  dynamicVolumesMount:
    - pvName: "shared-pv-1"
      mountPath: "/data1"
    - pvName: "shared-pv-2"
      mountPath: "/data2"
      subPath: "sub/dir"
      readOnly: true
```

Field description:

| Field       | Description                                   | Required |
|-------------|-----------------------------------------------|----------|
| `pvName`    | Name of the existing PV                       | Yes      |
| `mountPath` | Mount target path in the container            | Yes      |
| `subPath`   | Sub path within the persistent volume         | No       |
| `readOnly`  | Whether to mount the volume as read-only      | No       |

## Verify the Mount

After the `SandboxClaim` reaches the `Completed` phase, list the sandboxes allocated by the claim:

```bash
kubectl get sandbox -n default -l agents.kruise.io/claim-name=shared-storage-claim
```

Expected output:

```text
NAME                          STATUS    AGE
shared-storage-template-xxx   Running   22h
```

Run a command inside the sandbox Pod to verify the mount:

```bash
kubectl exec -it <POD_NAME> -- df -h /data1
```

You should see the mounted volume at the requested path.

## Notes

- On-demand volume mounting relies on `agent-runtime` and CSI sidecars. It may affect sandbox delivery speed compared to claiming a sandbox without extra mounts.
- The mount target directory must exist and be empty in the container image; otherwise the CSI mount will fail.
- If `subPath` is specified, the sub-directory is not automatically created on the storage backend. Ensure it exists before mounting, or use a storage driver that creates missing directories.
- This feature currently supports sandboxes claimed from a warm pool, created on no stock, and in-place image upgrades. It does not restore mounts when a sandbox is recovered from a checkpoint.

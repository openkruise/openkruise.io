# Volume Claim Templates

This guide shows how to use `volumeClaimTemplates` in `SandboxSet` to provide persistent storage for OpenKruise Agents sandboxes.

## The Purpose of Sandbox Volumes

By default, containers are ephemeral, meaning any data generated or modified inside a sandbox is lost when the underlying Pod terminates.

The introduction of `volumeClaimTemplates` into the `SandboxSet` API solves this by allowing each sandbox instance to dynamically provision its own Persistent Volume Claim (PVC). Using semantics identical to a Kubernetes StatefulSet, this functionality allows you to define a storage template once and have OpenKruise Agents automatically create, attach, and manage independent storage volumes for every sandbox spawned from that template.

Common use cases include:

- **Caching dependencies**: Storing downloaded packages (such as `node_modules` or pip caches) across agent runs to speed up executions.
- **Preserving state**: Maintaining logs, build artifacts, or internal agent databases uniquely tied to specific sandbox sessions.
- **Warm pools with state**: Pre-warming sandboxes (`SandboxSet`) with attached storage so they are immediately ready to perform heavy I/O operations without waiting for initial storage provisioning.

## How It Works Under the Hood

1. You define a `volumeClaimTemplates` list inside your `SandboxSet`.
2. When the `SandboxSet` controller provisions a new sandbox, the volume claim templates are seamlessly propagated to the individual `Sandbox` custom resources.
3. The controller then provisions the associated PVCs and merges them into the underlying Pod specifications, mounting them inside the container.
4. When a sandbox Pod is recreated (for example, due to node eviction or rolling update), the same PVC is reattached to the new Pod, preserving the data.

## Create a SandboxSet with Volume Claims

To use persistent storage, add the `volumeClaimTemplates` array to your `SandboxSet` specification and reference the claim name in the `volumeMounts` of your container.

The following example assumes a StorageClass named `standard` exists in your cluster. If your cluster does not provide a default StorageClass, create one first or replace `storageClassName` with an available class.

Create a file named `sandboxset-with-volume.yaml`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: stateful-sandboxset
  namespace: default
spec:
  replicas: 3
  # 1. Define the dynamic volume configuration here
  volumeClaimTemplates:
  - metadata:
      name: agent-data
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: standard
      resources:
        requests:
          storage: 1Gi
  # 2. Reference the exact name of the volume claim in the container
  template:
    spec:
      containers:
      - name: sandbox-agent
        image: ubuntu:latest
        command: ["sleep", "infinity"]
        volumeMounts:
        - name: agent-data
          mountPath: /data
```

Apply the template to your Kubernetes cluster:

```bash
kubectl apply -f sandboxset-with-volume.yaml
```

Wait until the warm pool is ready:

```bash
kubectl get sbs stateful-sandboxset
```

Expected output:

```text
NAME                  REPLICAS   AVAILABLE   UPDATEREVISION   AGE
stateful-sandboxset   3          3           xxxxxxxx         92s
```

## Claim a Sandbox via SandboxClaim

Now that the warm pool is ready, you can claim an actual sandbox instance by creating a `SandboxClaim`.

Create a file named `sandbox-claim.yaml`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: my-stateful-sandbox
  namespace: default
spec:
  templateName: stateful-sandboxset
```

Apply the claim:

```bash
kubectl apply -f sandbox-claim.yaml
```

Wait until the claim is completed:

```bash
kubectl get sbc my-stateful-sandbox
```

Expected output:

```text
NAME                    PHASE       TEMPLATE              DESIRED   CLAIMED   AGE
my-stateful-sandbox     Completed   stateful-sandboxset   1         1         41s
```

## Verify the Automatically Provisioned Storage

When you applied the `SandboxClaim`, the `SandboxSet` controller automatically intercepted the `volumeClaimTemplates` definition, created a dedicated PVC, and attached it to your sandbox's Pod.

List the PVCs to confirm the volume was created. The PVC name is composed of the claim name and the sandbox Pod name:

```bash
kubectl get pvc
```

You should see a newly bound PVC named like `agent-data-<sandbox-pod-name>`.

If you execute into the sandbox container, you can verify that the volume is mounted correctly at the `/data` directory:

```bash
kubectl exec -it <sandbox-pod-name> -- df -h /data
```

## Validate Data Persistence

To validate data persistence, destroy the underlying Pod to simulate a crash or eviction, and then verify that the data survived when the controller spins up a replacement.

### 1. Write data to the persistent volume

Execute a command inside your running sandbox container to create a file within the mounted `/data` directory:

```bash
kubectl exec -it <sandbox-pod-name> -- sh -c "echo 'This data will survive a pod crash!' > /data/evidence.txt"
```

### 2. Verify the data exists

Read the file back to ensure it was written successfully:

```bash
kubectl exec -it <sandbox-pod-name> -- cat /data/evidence.txt
```

### 3. Simulate a failure by deleting the Pod

Because sandboxes are managed by the `SandboxSet` controller, deleting the Pod directly simulates an unexpected failure.

```bash
kubectl delete pod <sandbox-pod-name>
```

### 4. Wait for the controller to recreate the sandbox

The `SandboxSet` controller will detect that the Pod is missing and automatically recreate it. Because `volumeClaimTemplates` use StatefulSet-like semantics, the controller will reattach the exact same PVC to the new Pod.

Watch the Pods until the new one is running:

```bash
kubectl get pods -w
```

### 5. Verify the data survived

Once the new replacement Pod is in the `Running` state, execute into it and read the file again:

```bash
kubectl exec -it <new-sandbox-pod-name> -- cat /data/evidence.txt
```

You should see the text `This data will survive a pod crash!` printed in your terminal.

## Notes

- The `volumeClaimTemplates` field is a sibling of `template` in the `SandboxSet` spec, not nested inside `template.spec`.
- Each sandbox spawned from the `SandboxSet` receives its own independent PVC. Sharing the same PVC across multiple sandboxes requires a ReadWriteMany storage class and is not covered by this guide.
- When a sandbox is deleted through the `SandboxClaim` lifecycle (for example, by deleting the `SandboxClaim`), the associated PVC is deleted together with the sandbox by default. If you need to retain the data, configure the PVC `reclaimPolicy` through your StorageClass or back up the data before cleanup.

---
id: runtime-injection
title: Runtime Injection
---

# Runtime Injection

## Overview

Runtime Injection is an automatic configuration injection mechanism in OpenKruise Agents. By configuring the `runtimes`
field in Sandbox-related CRDs (such as SandboxSet, SandboxClaim, SandboxTemplate, or Sandbox), the system will
automatically inject the required sidecar containers, environment variables, volume mounts, and lifecycle hooks into the
Sandbox Pod, eliminating the need for users to write complex YAML configurations manually.

Runtime Injection currently supports the following two injection types:

| Injection Type    | `runtimes.name` | Description                                                                                                                                                    |
|-------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Agent Runtime** | `agent-runtime` | Injects the `agent-runtime` (envd compatible) component, providing E2B command execution (`commands.run`), file system read/write, and other advanced features |
| **CSI Mount**     | `csi`           | Injects the CSI mount sidecar, enabling [dynamic persistent volume mounting](./sandbox-claim.md#dynamic-persistent-volume-mounting)                            |

## How It Works

The Runtime Injection mechanism works as follows:

1. **Configuration Source**: The system reads injection configuration from a ConfigMap named `sandbox-injection-config`
   in the `sandbox-system` namespace. This ConfigMap is typically maintained by the cluster administrator or deployment
   tools.

2. **Injection Trigger**: When a Sandbox is created, the system checks its `spec.runtimes` field. If a matching runtime
   type is configured, the corresponding injection is performed.

3. **Injection Content**: For each runtime type, the injection includes:
    - **Init Containers**: Sidecar containers are appended to the Pod's `initContainers`, executing before the main
      container starts to prepare the runtime environment.
    - **Environment Variables**: Required environment variables are added to the main container (the first container in
      the Pod spec).
    - **Volume Mounts**: Necessary volume mounts are added to the main container.
    - **Volumes**: Required volumes are added to the Pod spec.
    - **Lifecycle Hooks** (agent-runtime only): A `postStart` lifecycle hook may be added to the main container.

4. **Propagation Path**: The `runtimes` field propagates through the following path:
    - `SandboxTemplate` → `SandboxSet` → `Sandbox` (inherited at creation)
    - `SandboxClaim` → `Sandbox` (applied at claim time)

## Usage

### Configuring in SandboxSet

The most common use case is to configure the `runtimes` field in a SandboxSet, so all Sandboxes created from this
SandboxSet will automatically have the configured runtimes injected.

**Inject agent-runtime only:**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: agent-runtime
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

**Inject both agent-runtime and CSI mount:**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo-with-csi
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: agent-runtime
    - name: csi
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

### Configuring in SandboxTemplate

If you use `SandboxTemplate` to define reusable sandbox templates, you can configure the `runtimes` field there:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxTemplate
metadata:
  name: demo-template
  namespace: default
spec:
  runtimes:
    - name: agent-runtime
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

### Configuring in SandboxClaim

When claiming sandboxes, you can also specify the `runtimes` field in SandboxClaim. This is useful when you want to
customize the runtime configuration per claim rather than at pool level:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  runtimes:
    - name: agent-runtime
    - name: csi
```

## When to Use Each Runtime Type

### agent-runtime

You should configure `agent-runtime` injection when:

- You need to use **E2B SDK features** such as `commands.run` (command execution) and file system `read/write`
- You need to **inject environment variables** into sandboxes at claim time
- You need **advanced sandbox management** features provided by `agent-runtime`

> Most use cases that rely on the E2B SDK require `agent-runtime` to be injected. If you are unsure, it is recommended
> to enable it.

For more details, see the [E2B SDK Integration Documentation](../developer-manuals/e2b-client.md).

### csi

You should configure `csi` injection when:

- You need to use [dynamic persistent volume mounting](./sandbox-claim.md#dynamic-persistent-volume-mounting) to mount
  PVs into sandboxes at claim time

> `csi` injection is typically used together with `agent-runtime` injection.

## Conflict Handling

The injection mechanism includes several conflict detection and handling strategies to ensure safety:

### Container Name Conflicts

Before injection, the system checks whether any sidecar container name to be injected already exists in the Pod's
`containers` or `initContainers`. If a conflict is detected, the **entire injection for that runtime type is skipped**
to avoid corruption. This means:

- If you have manually defined a container with the same name as the sidecar in your SandboxSet template, the injection
  will not be performed.
- Each runtime type's injection is independent: a name conflict in one does not affect the other.

### Lifecycle Hook Conflicts (agent-runtime)

When injecting `agent-runtime`, the system may need to add a `postStart` lifecycle hook to the main container. Conflict
handling follows these rules:

- If the main container **does not have** a `postStart` hook, the injected hook is applied.
- If the main container **already has** a valid `postStart` hook and the injection configuration also defines one, the
  injection is **skipped entirely** (including environment variables and volume mounts) to prevent inconsistent state.
- If the main container has a `postStart` hook but the injection configuration does not define one, environment
  variables and volume mounts are still injected normally.

### Environment Variable and Volume Deduplication

- For **CSI injection**: Environment variables and volume mounts are deduplicated by name. If the main container already
  has an environment variable or volume mount with the same name, the existing one is preserved.
- For **agent-runtime injection**: Environment variables and volume mounts are appended directly (no deduplication).
- **Volumes**: Volumes are always deduplicated by name at the Pod spec level. Existing volumes with the same name will
  not be overwritten.

## Important Notes

1. **Performance Impact**: Runtime injection adds init containers to the Pod, which need to run before the main
   container starts. This may increase sandbox startup time.

2. **ConfigMap Dependency**: The injection mechanism depends on the `sandbox-injection-config` ConfigMap in the
   `sandbox-system` namespace. If this ConfigMap does not exist, injection will be silently skipped.

3. **Main Container Convention**: The injection mechanism treats the **first container** in `spec.containers` as the
   main container. Ensure that your sandbox's primary container is listed first.

4. **Skip Injection**: If you do not need any runtime injection (e.g., for highly customized sandbox configurations),
   simply omit the `runtimes` field or leave it empty. For E2B users, you can
   also [skip agent-runtime initialization](./sandbox-claim.md#skip-agent-runtime-initialization) during the claiming
   process.

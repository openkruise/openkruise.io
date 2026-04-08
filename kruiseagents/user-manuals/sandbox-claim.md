---
id: sandbox-claim
title: Claiming Sandboxes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Claiming Sandboxes

Agent applications can obtain a sandbox from OpenKruise Agents in the following ways.

> If there are sandboxes with available status in the warm pool, the delivery speed is sub-second. Otherwise, it will
> wait for sandbox replenishment and readiness, and the delivery efficiency is affected by cluster performance.
> ⚠️ Note: The advanced features of OpenKruise Agents depend on the `agent-runtime` component. `sandbox-manager` or
`sandbox-controller` communicates with this component through port `49983`. If you have firewalls, security groups, or
> other protection mechanisms in your cluster, please ensure that this port is open for all Sandbox Pods. If you confirm
> that you do not need to inject `agent-runtime` and do not need to use any advanced features, please refer
> to [Skip agent-runtime Initialization](#skip-agent-runtime-initialization)

## Claiming Sandboxes via E2B SDK

> ⚠️ Note: Before using the E2B SDK, please refer to
> the [E2B SDK Integration Documentation](../developer-manuals/e2b-client.md) and choose the appropriate
> E2B integration method based on your domain name, certificate, and other conditions, and correctly configure the
`E2B_DOMAIN` for both client and server.

[E2B](https://e2b.dev) is an open-source sandbox SDK. It provides Python and JavaScript clients for users to
conveniently and quickly manage sandboxes.
The `sandbox-manager` component of `OpenKruise Agents` provides backend services compatible with both native E2B
protocol and customized E2B protocol, allowing users to claim and operate sandboxes programmatically.

Here is an example of claiming a sandbox using the E2B Python SDK:

```python
from e2b_code_interpreter import Sandbox

with Sandbox.create(template="demo") as sbx:
    print(sbx.get_info())
```

Description:

- **template parameter**: The name of the `SandboxSet`. If there are `SandboxSet`s with the same name in multiple
  namespaces, one will be selected randomly. Therefore, it is recommended to avoid using
  `SandboxSet`s with the same name, or ensure that `SandboxSet`s with the same name have the same configuration.
- The full functionality of E2B requires `agent-runtime` support, and the `run_code` API requires a dedicated
  `code_interpreter`
  image. For details, please refer to [e2b-code-interpreter](../best-practices/running-e2b-for-code-interpreter.md).

## Claiming Sandboxes via SandboxClaim

`SandboxClaim` CRD allows users to claim sandboxes declaratively. You can claim a sandbox using this simplest
SandboxClaim:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo # SandboxSet name
```

> The short name for `SandboxClaim` is `sbc`

This SandboxClaim will claim a sandbox from the SandboxSet in the **same namespace**. You can check the progress of the
claim with the following command:

```shell
$ kubectl get sbc
NAME                 PHASE       TEMPLATE   DESIRED   CLAIMED   AGE
demo-sandbox-claim   Completed   demo       1         1         41s
```

When you find that `PHASE` becomes `Completed`, it means the claim has successfully claimed the sandbox. You can get the
allocated sandbox using the following label for subsequent use:

```shell
$ kubectl get sbx -l agents.kruise.io/claim-name=demo-sandbox-claim # short name of Sandbox
NAME   STATUS    AGE   SHUTDOWN_TIME   PAUSE_TIME   MESSAGE
demo   Running   20m                                
```

### Batch Claiming Sandboxes

You can specify the replicas parameter for `SandboxClaim` to claim multiple sandboxes in batch:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo

  # Number of sandboxes to claim (default: 1)
  replicas: 10

  # Optional: Claim timeout (default: 1m)
  claimTimeout: 1m

  # Optional: TTL after completion (auto-delete SandboxClaim resource)
  # The claimed sandboxes will NOT be deleted
  ttlAfterCompleted: 5m
```

Parameter description:

- **replicas**: Specifies the number of sandboxes to claim.
- **claimTimeout**: Specifies the timeout for the claim. Maximum time to attempt working.
- **ttlAfterCompleted**: Specifies the TTL time after the claim completes. After the claim task completes and the TTL
  time passes, the SandboxClaim
  resource will be deleted (the claimed sandboxes will not be deleted).

Batch claiming is a best-effort, gradual delivery feature. That means:

- Due to factors such as warm pool inventory and cluster resources, it may not be possible to claim the specified number
  of sandboxes eventually.
- Before the task completes (or times out), sandboxes that have been claimed will be delivered gradually. The
  `agents.kruise.io/claim-name=<sbc-name>` label can be used to filter all delivered sandboxes in real-time.

> In E2B, you can specify the server-side timeout for a single claim by adding the
`e2b.agents.kruise.io/claim-timeout-seconds` metadata, and specify the client-side timeout through the `request_timeout`
> parameter.

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", request_timeout=60.0, metadata={
    "e2b.agents.kruise.io/claim-timeout-seconds": "60"
})
```

## Creating Sandbox Directly from Template

By default, `OpenKruise Agents` always claims sandboxes from the template's warm pool. If there are no available
sandboxes in the warm pool, it will wait for sandbox replenishment and readiness.
For some special scenarios (such as not wanting to pre-warm sandboxes, not wanting in-place upgrades, etc.), users can
choose to create sandboxes directly from the template without waiting for the warm pool to replenish.
When creating directly from a template, the sandbox-manager / SandboxClaim controller will retrieve the SandboxSet
through the passed templateID and create a new sandbox based on its configuration.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/create-on-no-stock": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  createOnNoStock: true
```

  </TabItem>

</Tabs>

## Advanced Features

The sandbox claiming functionality of `OpenKruise Agents` includes a series of advanced features that can be used
through `E2B` and `SandboxClaim` respectively.

### Sandbox Timeout

You can specify a timeout when claiming a sandbox. The sandbox will be automatically deleted after reaching the timeout.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", timeout=600)  # timeout in seconds
```

By default, sandboxes will be automatically deleted after reaching the timeout. If you want the sandbox to never timeout
and persist indefinitely, you can use the never-timeout extension.

> `e2b.agents.kruise.io/never-timeout` is an OpenKruise Agents extension field and
> will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/never-timeout": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 format absolute time to delete the sandboxes claimed。
  # It is recommended to set this field programmatically, for example: 
  # sbc.Spec.ShutdownTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  shutdownTime: 2026-02-06T07:33:30Z
```

  </TabItem>

</Tabs>

### Auto Pause

Auto pause is similar to sandbox timeout. When the sandbox reaches the specified time, it will automatically enter a
paused state.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.beta_create(template="demo", timeout=600, auto_pause=True)  # auto pause in seconds
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 format absolute time to pause the sandboxes claimed.
  # It is recommended to set this field programmatically, for example: 
  # sbc.Spec.PauseTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  pauseTime: 2026-02-06T07:33:30Z
```

  </TabItem>

</Tabs>

### Adding Metadata

You can add some metadata (labels or annotations) to the `Sandbox` resource when claiming a sandbox, to categorize
sandboxes claimed multiple times or add some custom information.

<Tabs>
  <TabItem value="E2B" label="E2B">

> Metadata set through E2B will be stored as annotations

```python
from e2b_code_interpreter import Sandbox, SandboxQuery

Sandbox.create(template="demo", metadata={"userId": "alice"})
paginator = Sandbox.list(query=SandboxQuery(metadata={"userId": "alice"}))
print(paginator.next_items())
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  labels:
    userId: "alice"
  annotations:
    foo: "bar"
```

  </TabItem>
</Tabs>

### Image Replacement

You can specify an image to replace the sandbox's main container image when claiming a sandbox. This is very useful in
some reinforcement learning scenarios. The specific behavior of this feature is:

- If claiming from the SandboxSet warm pool, an in-place upgrade will be performed to replace the running container
  image with the specified image.
- If creating based on the SandboxSet, a new Sandbox will be created directly with the specified image.

Using in-place upgrade will affect the delivery speed of the create interface and may not be able to complete delivery
at sub-second level.

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/image` is an OpenKruise Agents extension field and will not be added to the Sandbox resource as
> metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", metadata={
    "e2b.agents.kruise.io/image": "new-image:latest"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  inplaceUpdate:
    image: "new-image:latest"
```

  </TabItem>
</Tabs>

### Dynamic Persistent Volume Mounting

You can dynamically mount a PV when claiming a sandbox, specifying a separate mount volume for each sandbox. This
capability relies on `agent-runtime` injected into the Sandbox
and will also affect delivery efficiency to some extent.

> ⚠️ To use dynamic persistent volume mounting, you must configure `csi` in the `runtimes` field of your SandboxSet. For
> details, refer to the [Runtime Injection](./runtime-injection.md) documentation.

<Tabs>
  <TabItem value="E2B" label="E2B">

> The following extension keys are OpenKruise Agents extension fields and will not be added to the Sandbox resource as
> metadata.

**Single volume mount:**

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-name": "oss-pv-test",
    "e2b.agents.kruise.io/csi-mount-point": "/data",
    # Optional: specify a sub path within the persistent volume
    "e2b.agents.kruise.io/csi-subpath": "sub/dir"
})
```

**Multiple volumes mount:**

To mount multiple volumes at once, use the `e2b.agents.kruise.io/csi-volume-config` extension with a JSON array:

```python
import json
from e2b_code_interpreter import Sandbox

csi_config = json.dumps([
    {"pvName": "oss-pv-1", "mountPath": "/data1"},
    {"pvName": "oss-pv-2", "mountPath": "/data2", "subPath": "sub/dir", "readOnly": True}
])

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-config": csi_config
})
```

Parameter description:

| Extension Key                            | Description                                   | Required           |
|------------------------------------------|-----------------------------------------------|--------------------|
| `e2b.agents.kruise.io/csi-volume-name`   | Persistent volume name                        | Yes (single mount) |
| `e2b.agents.kruise.io/csi-mount-point`   | Mount target path in container                | Yes (single mount) |
| `e2b.agents.kruise.io/csi-subpath`       | Sub path within the persistent volume         | No                 |
| `e2b.agents.kruise.io/csi-volume-config` | JSON array of mount configs (for multi-mount) | Yes (multi mount)  |

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  dynamicVolumesMount:
    - pvName: "oss-pv-1"
      mountPath: "/data1"
    - pvName: "oss-pv-2"
      mountPath: "/data2"
      subPath: "sub/dir"
      readOnly: true
```

Field description:

| Field       | Description                           | Required |
|-------------|---------------------------------------|----------|
| `pvName`    | Persistent volume name                | Yes      |
| `mountPath` | Mount target path in container        | Yes      |
| `subPath`   | Sub path within the persistent volume | No       |
| `readOnly`  | Whether to mount as read-only         | No       |

  </TabItem>
</Tabs>

### Skip agent-runtime Initialization

Generally, `agent-runtime` should be injected into the sandbox to provide code execution, remote operations, storage
mounting, and other functions. During the sandbox claiming process, `OpenKruise Agents` will initialize the
`agent-runtime`. If users need high customization and do not use `agent-runtime`, they can skip the `agent-runtime`
initialization process when claiming sandboxes.

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/skip-init-runtime` is an OpenKruise Agents extension field and
> will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/skip-init-runtime": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  skipInitRuntime: true
```

  </TabItem>

</Tabs>

### Troubleshooting

Due to various reasons, errors may occur during the sandbox claiming process, causing the claim to fail. By default, the
Sandbox Manager and SandboxClaim Controller will delete sandboxes that encounter errors and retry to claim a new
sandbox. If you need to retain the Sandbox instances and their corresponding Pods that encountered errors for
troubleshooting purposes, you can add the following parameters when claiming sandboxes to skip sandbox deletion:

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/reserve-failed-sandbox` is an OpenKruise Agents extension field and
> will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/reserve-failed-sandbox": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  reserveFailedSandbox: true
```

  </TabItem>
</Tabs>

### Environment Variables

You can inject environment variables into the sandbox when claiming. These environment variables will be passed to
`agent-runtime` for initialization. This feature requires `agent-runtime` to be enabled.

> ⚠️ Note: Currently, environment variables injected through this feature only take effect for the E2B `commands.run`
> API. They are not available as process-level environment variables in the sandbox's main container.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", envs={
    "MY_ENV": "value",
    "API_KEY": "sk-xxx"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  envVars:
    MY_ENV: "value"
    API_KEY: "sk-xxx"
```

  </TabItem>
</Tabs>

### Wait Ready Timeout

When certain operations (such as in-place image update, creating a new sandbox, etc.) are performed during claiming, the
sandbox may need time to become ready. You can specify a wait-ready timeout to control the maximum time to wait for the
sandbox to be ready.

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/wait-ready-timeout-seconds` is an OpenKruise Agents extension field and
> will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/wait-ready-timeout-seconds": "60"  # wait up to 60 seconds
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # Default: 30s. Format: duration string (e.g., "3h", "200s", "15m")
  waitReadyTimeout: 60s
```

  </TabItem>
</Tabs>
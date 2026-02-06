---
id: sandbox-claim
title: Claiming Sandboxes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Claiming Sandboxes

Agent applications can obtain a sandbox from OpenKruise Agents in the following ways.

> If there are sandboxes with available status in the warm pool, the delivery speed is sub-second. Otherwise, it will wait for sandbox replenishment and readiness, and the delivery efficiency is affected by cluster performance.

## Claiming Sandboxes via E2B SDK

> ⚠️ Note: Before using the E2B SDK, please refer to the [E2B SDK Integration Documentation](../developer-manuals/e2b-client.md) and choose the appropriate
> E2B integration method based on your domain name, certificate, and other conditions, and correctly configure the `E2B_DOMAIN` for both client and server.

[E2B](https://e2b.dev) is an open-source sandbox SDK. It provides Python and JavaScript clients for users to conveniently and quickly manage sandboxes.
The `sandbox-manager` component of `OpenKruise Agents` provides backend services compatible with both native E2B protocol and customized E2B protocol, allowing users to claim and operate sandboxes programmatically.

Here is an example of claiming a sandbox using the E2B Python SDK:

```python
from e2b_code_interpreter import Sandbox

with Sandbox.create(template="demo") as sbx:
    print(sbx.get_info())
```

Description:

- **template parameter**: The name of the `SandboxSet`. If there are `SandboxSet`s with the same name in multiple namespaces, one will be selected randomly. Therefore, it is recommended to avoid using
  `SandboxSet`s with the same name, or ensure that `SandboxSet`s with the same name have the same configuration.
- The full functionality of E2B requires `agent-runtime` support, and the `run_code` API requires a dedicated `code_interpreter`
  image. For details, please refer to [e2b-code-interpreter](../best-practices/running-e2b-for-code-interpreter.md).

## Claiming Sandboxes via SandboxClaim

`SandboxClaim` CRD allows users to claim sandboxes declaratively. You can claim a sandbox using this simplest SandboxClaim:

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

This SandboxClaim will claim a sandbox from the SandboxSet in the **same namespace**. You can check the progress of the claim with the following command:

```shell
$ kubectl get sbc
NAME                 PHASE       TEMPLATE   DESIRED   CLAIMED   AGE
demo-sandbox-claim   Completed   demo       1         1         41s
```

When you find that `PHASE` becomes `Completed`, it means the claim has successfully claimed the sandbox. You can get the allocated sandbox using the following label for subsequent use:

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
- **ttlAfterCompleted**: Specifies the TTL time after the claim completes. After the claim task completes and the TTL time passes, the SandboxClaim
  resource will be deleted (the claimed sandboxes will not be deleted).

Batch claiming is a best-effort, gradual delivery feature. That means:

- Due to factors such as warm pool inventory and cluster resources, it may not be possible to claim the specified number of sandboxes eventually.
- Before the task completes (or times out), sandboxes that have been claimed will be delivered gradually. The `agents.kruise.io/claim-name=<sbc-name>` label can be used to filter all delivered sandboxes in real-time.

## Advanced Features

The sandbox claiming functionality of `OpenKruise Agents` includes a series of advanced features that can be used through `E2B` and `SandboxClaim` respectively.

### Sandbox Timeout

You can specify a timeout when claiming a sandbox. The sandbox will be automatically deleted after reaching the timeout.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", timeout=600)  # timeout in seconds
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

Auto pause is similar to sandbox timeout. When the sandbox reaches the specified time, it will automatically enter a paused state.

> Currently, auto pause functionality is only supported through E2B. If your E2B client doesn't have the `auto_pause` parameter, please upgrade to the latest version.

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.beta_create(template="demo", timeout=600, auto_pause=True)  # auto pause in seconds
```

  </TabItem>

</Tabs>

### Adding Metadata

You can add some metadata (labels or annotations) to the `Sandbox` resource when claiming a sandbox, to categorize sandboxes claimed multiple times or add some custom information.

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

### In-Place Upgrade

You can specify an image to perform an in-place upgrade of the sandbox's main container when claiming a sandbox, replacing the prewarmed container image with the specified image. This is very useful in some reinforcement learning scenarios. Using in-place upgrade will affect
the delivery speed of the create interface and may not be able to complete delivery at sub-second level.

> Currently, in-place upgrade functionality is only supported through E2B.

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/image` is an OpenKruise Agents extension field and will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", metadata={
    "e2b.agents.kruise.io/image": "new-image:latest"
})
```

  </TabItem>
</Tabs>

### Dynamic Persistent Volume Mounting

You can dynamically mount a PV when claiming a sandbox, specifying a separate mount volume for each sandbox. This capability relies on `agent-runtime` injected into the Sandbox
and will also affect delivery efficiency to some extent.

> Currently, dynamic persistent volume mounting functionality is only supported through E2B.

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/csi-volume-name` and `e2b.agents.kruise.io/csi-mount-point` are OpenKruise Agents extension fields and
> will not be added to the Sandbox resource as metadata.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-name": "oss-pv-test",
    "e2b.agents.kruise.io/csi-mount-point": "/data"
})
```

  </TabItem>
</Tabs>
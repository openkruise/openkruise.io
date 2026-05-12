---
id: pause-resume
title: Pausing and Resuming
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pausing and Resuming

OpenKruise Agents allows you to **pause** a running sandbox so that it stops consuming CPU / memory, and later
**resume** it back to a running state, keeping the sandbox identity (same `sandboxID`, same Pod) intact.

> ⚠️ This area is still evolving. The underlying capture mechanism (whether memory state is preserved, whether the
> filesystem is checkpointed, etc.) depends on the cluster environment (e.g. memory-state preservation is currently
> only supported on Alibaba Cloud ACS). This document focuses on how to use the API; for state-preservation
> guarantees, see your platform runbook.

## Overview

Two parallel interfaces are provided, both acting on the same underlying `Sandbox` resource:

| Interface                | Audience                                                     | Typical scenarios                                     |
|--------------------------|--------------------------------------------------------------|-------------------------------------------------------|
| E2B SDK (pause/connect)  | Application code running on top of E2B Python / JavaScript   | Programmatic pause before idle, resume on demand      |
| Kubernetes CRD           | Cluster ops, declarative GitOps, `kubectl` or custom control | Toggle `spec.paused` or schedule `spec.pauseTime`     |

Pause/Resume is one-to-one: the sandbox ID stays the same across the pause → resume cycle. If you need a one-to-many
"snapshot and fork" workflow, see [Snapshot Management](./checkpoint.md).

## How It Works (summary)

1. **Pause** freezes the sandbox Pod. Active WebSocket / PTY / command-stream connections are dropped; clients must
   reconnect after resume.
2. **Resume** brings the Pod back to the running state. The sandbox ID is preserved.
3. The exact capture scope (memory / filesystem) depends on the runtime platform and the configuration on the
   backing `SandboxSpec`.

## Pausing a Sandbox

<Tabs>
<TabItem value="E2B" label="E2B SDK">

The E2B SDK exposes a `pause()` method on a sandbox handle. It calls the `POST /sandboxes/{sandboxID}/pause`
endpoint under the hood.

```python
from e2b_code_interpreter import Sandbox

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    sbx.run_code("a = 1")
    sbx.pause()  # sandbox is now paused; sandboxID is retained
```

```ts
import { Sandbox } from 'e2b'

const sbx = await Sandbox.create({ template: 'code-interpreter', timeoutMs: 300_000 })
await sbx.betaPause()
```

Notes:

- Pausing a sandbox that is not in `running` state returns `409 Conflict`.
- Paused sandboxes are kept indefinitely — the auto-shutdown timer is disabled while paused.

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

Set `spec.paused: true` on the `Sandbox` CR. The controller drives the Pod into the paused state.

```shell
kubectl patch sbx my-sandbox -n default --type=merge -p '{"spec":{"paused":true}}'
```

You can also schedule an automatic pause via `spec.pauseTime`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  pauseTime: "2026-05-13T10:00:00Z"   # RFC3339; absolute time to auto-pause
```

Check the status phase:

```shell
kubectl get sbx my-sandbox -n default -o jsonpath='{.status.phase}'
# → Paused
```

</TabItem>
</Tabs>

## Auto Pause

In addition to calling `pause` explicitly, you can declare that the sandbox should **auto-transition into `paused`
on expiry** at creation time — when the timer fires the sandbox is not killed, it moves into the `paused` state with
its identity preserved, waiting for a later resume.

<Tabs>
<TabItem value="E2B" label="E2B SDK">

Follow the [E2B docs — Auto-pause](https://e2b.dev/docs/sandbox/persistence#auto-pause): set
`lifecycle.on_timeout` to `"pause"` when creating the sandbox.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(
    template="demo",
    timeout=600,  # 10 minutes; on expiry go to paused instead of being killed
    lifecycle={
        "on_timeout": "pause",
        "auto_resume": False,  # see note below
    },
)
```

```ts
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create({
  template: 'demo',
  timeoutMs: 10 * 60 * 1000, // 10 minutes; on expiry go to paused
  lifecycle: {
    onTimeout: 'pause',
    autoResume: false, // see note below
  },
})
```

> ⚠️ **`auto_resume` is not yet implemented in OpenKruise Agents.** Even if you set it to `true`, a paused sandbox
> will **not** be woken up automatically; clients must still call `Sandbox.connect(sandbox_id, ...)` explicitly when
> they need it (see the next section). Set it to `false` to make the semantics explicit.

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

Set `spec.pauseTime` on a `SandboxClaim` (or on the underlying `Sandbox` CR). When the absolute time is reached the
controller drives the sandbox into `paused`.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 absolute time; the controller auto-pauses the sandbox on expiry.
  # It is recommended to set this field programmatically, for example:
  # sbc.Spec.PauseTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  pauseTime: "2026-02-06T07:33:30Z"
```

> The `Sandbox` CR itself also has a `spec.pauseTime` field (see the previous section). The CRD path uses an
> **absolute time** rather than the "pause when the timeout expires" offset semantics of the E2B SDK — use the E2B
> SDK if you need the latter.

</TabItem>
</Tabs>

## Resuming a Sandbox

The recommended interface on the E2B SDK side is `Sandbox.connect(...)` — it implicitly resumes a paused sandbox and
at the same time refreshes its timeout. The legacy `resume` endpoint still exists for backward compatibility but
should not be used by new code.

<Tabs>
<TabItem value="E2B" label="E2B SDK">

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.connect(sandbox_id, timeout=300)  # resumes if paused, and extends the timeout
sbx.run_code("print(a)")
```

```ts
import { Sandbox } from 'e2b'

const sbx = await Sandbox.connect(sandboxId, { timeoutMs: 300_000 })
```

Notes:

- If the sandbox is already running, `connect` only refreshes the timeout. The refresh is **extend-only**: the
  timeout will never be shortened. (Exception: a paused → running resume applies the requested timeout directly.)
- `connect` on a sandbox that does not exist or is owned by another API key returns `404 Not Found`.

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

Clear `spec.paused` (set it back to `false`). The controller will resume the Pod. You can also adjust
`spec.pauseTime` / `spec.shutdownTime` in the **same patch** to effectively "refresh the timeout while resuming":

```shell
kubectl patch sbx my-sandbox -n default --type=merge -p '{"spec":{"paused":false}}'

# Resume and also push the next auto-shutdown one hour out (example)
kubectl patch sbx my-sandbox -n default --type=merge \
  -p '{"spec":{"paused":false,"shutdownTime":"2026-05-13T11:00:00Z"}}'
```

> **The CRD path has no extend-only guard.** The E2B SDK's `connect + timeoutMs` only extends, never shortens, the
> remaining lifetime while running; the CRD path takes the user-written value verbatim and can shorten it. Pick the
> path that matches your intent.

</TabItem>
</Tabs>

## Capability Matrix

| Capability                                                           | E2B SDK                       | Kubernetes CRD                       |
|----------------------------------------------------------------------|-------------------------------|--------------------------------------|
| Pause a running sandbox                                              | ✅ `sbx.beta_pause()`          | ✅ `spec.paused: true`                |
| Resume a paused sandbox                                              | ✅ `Sandbox.connect(id, ...)`  | ✅ `spec.paused: false`               |
| Auto-pause when the timeout expires                                  | ✅ `lifecycle.on_timeout='pause'` | ❌                                |
| Auto-pause at a specific absolute time                               | ❌                             | ✅ `spec.pauseTime`                   |
| Auto-resume a paused sandbox                                         | ❌ not yet supported           | ❌ not yet supported                  |
| Set / refresh the sandbox timeout together with resume               | ✅ `Sandbox.connect(id, timeout=...)` | ✅ write `spec.shutdownTime` / `spec.pauseTime` in the same patch |
| Extend-only guard on timeout refresh while running                   | ✅                             | ❌ user-written value may shorten    |
| Observe paused/running state                                         | via SDK response              | `status.phase` (`Paused` / `Running`)|

If you need "extend-only, never shorten" timeout semantics, use the E2B SDK. The CRD path is better suited for
declarative / GitOps control over the paused/running bit plus absolute scheduling times.

## Notes

- **Connection drop.** The Pod is frozen on pause; all active streams (WebSocket / PTY / command streams) disconnect.
  Clients must reconnect after resume.
- **Timeout during pause.** Paused sandboxes are not auto-deleted by the idle timeout. Auto-delete is controlled
  separately by `spec.shutdownTime`.
- **Old SDKs.** The legacy `POST /sandboxes/{sandboxID}/resume` endpoint is kept for old SDK compatibility only. New
  code should always use `Sandbox.connect(...)`.
- **State-preservation caveats.** Whether memory is preserved across pause/resume depends on the runtime platform.
  If you need explicit memory + filesystem snapshots that can also be cloned into brand-new sandboxes, use
  [Snapshot Management](./checkpoint.md) instead.

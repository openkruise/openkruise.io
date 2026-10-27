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

For `SandboxSet`-level automatic lifecycle management — pause strategies, idle-based auto-pause, scheduled wake-up, and
wake-up on inbound traffic — see [Automatic Pause and Resume](./auto-pause-resume.md).

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
- The lifetime of a paused sandbox is controlled separately from its running timeout. `sandbox-manager` uses the
  `forever` paused-retention policy by default; you can configure a shorter window as described in
  [Retaining a Paused Sandbox](#retaining-a-paused-sandbox).

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
        "auto_resume": True,
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
    autoResume: true,
  },
})
```

With `auto_resume` enabled, an incoming request routed through `sandbox-gateway` resumes a paused sandbox before the
request is forwarded. The gateway configuration must enable `enable-wake-on-traffic`; otherwise the request does not
wake the sandbox.

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

## Waking on Ingress Traffic

Wake-on-traffic is useful for auto-paused sandboxes that should become available again on the next data-plane request.
The E2B `auto_resume` option is persisted as `spec.autoPausePolicy.resume.onIngressTraffic`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  autoPausePolicy:
    resume:
      onIngressTraffic:
        pauseTimeout: 5m
```

When `pauseTimeout` is positive and the sandbox already uses auto-pause, a successful traffic wake schedules the next
pause for that duration after the wake. Omit it to leave the resumed sandbox running until another pause or deletion.
Concurrent requests share the same resume operation. The triggering request waits for the sandbox to become ready and
fails if resume times out; clients should retry failed requests according to their normal idempotency policy.

## Retaining a Paused Sandbox

`reserve-paused-sandbox-duration` controls how long a timed Sandbox is retained **after its pause transition is
applied**. When the Sandbox pauses, OpenKruise Agents recalculates `spec.shutdownTime` as:

```text
pause transition time + reserve-paused-sandbox-duration
```

The value must be a positive [Go duration](https://pkg.go.dev/time#ParseDuration), such as `30m`, `2h`, or `168h`.
The special value `forever` selects the built-in **100-year** retention window; it does not create a truly infinite
deadline. Values such as `0`, negative durations, and `1d` are invalid (`time.ParseDuration` does not support a `d`
unit).

This policy only recalculates an existing timeout. A Sandbox created with the `never-timeout` extension has no
`shutdownTime`, so paused retention does not introduce one.

<Tabs>
<TabItem value="E2B" label="E2B SDK">

Set the persisted retention policy at creation time with the
`e2b.agents.kruise.io/reserve-paused-sandbox-duration` metadata extension. It applies to auto-pause and to later
manual pauses:

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(
    template="demo",
    timeout=600,
    lifecycle={"on_timeout": "pause", "auto_resume": False},
    metadata={
        "e2b.agents.kruise.io/reserve-paused-sandbox-duration": "2h",
    },
)
```

To override the persisted value for a manual pause, pass the
`x-e2b-kruise-reserve-paused-sandbox-duration` request header. The accepted override is persisted for subsequent
pause operations when that request performs the running-to-paused transition:

```python
sbx.pause(
    headers={
        "x-e2b-kruise-reserve-paused-sandbox-duration": "30m",
    }
)
```

The resolution order is **pause request header → persisted policy → `forever` default**. If the creation metadata
or pause header contains an invalid value, `sandbox-manager` returns `400 Bad Request`. Manager-created Sandboxes
without an explicit value use `forever`, which is persisted as the internal
`agents.kruise.io/reserve-paused-sandbox-duration` annotation.

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

For controller-driven auto-pause, add the `agents.kruise.io/reserve-paused-sandbox-duration` annotation and set both
`spec.pauseTime` and `spec.shutdownTime`. The annotation tells the controller to let the due pause run before
deletion and then replace `shutdownTime` with the pause transition time plus the retention window:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
  annotations:
    agents.kruise.io/reserve-paused-sandbox-duration: "2h"
spec:
  pauseTime: "2026-05-13T10:00:00Z"
  shutdownTime: "2026-05-13T10:00:00Z"
```

The direct CRD path intentionally has no default-when-absent policy: without the annotation, the controller does not
recalculate `shutdownTime`. If an explicitly present annotation is invalid, the controller logs the error and uses
the `forever` 100-year window for that auto-pause without rewriting the invalid annotation.

The annotation is evaluated when `spec.pauseTime` triggers auto-pause. It does **not** calculate a retention window
for a direct `spec.paused: true` patch; for a manual CRD pause, write the desired absolute `spec.shutdownTime` in the
same patch.

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

## Lifecycle Hooks (prePause / postResume)

Lifecycle hooks are available since **v0.7.0**.

OpenKruise Agents lets you attach **user-defined commands** to the pause and resume transitions of a sandbox:

- **`prePause`** runs inside the still-running sandbox **before** the Pod is paused — flush buffers, commit
  transactions, close external connections, or write application state to disk.
- **`postResume`** runs **after** the resumed Pod is Ready and runtime/credential/storage initialization has
  completed, **before** the sandbox reports `Ready` externally — rebuild connection pools, re-initialise
  applications, or validate restored state.

Hooks share the same execution path for every pause/resume source: manual pause (`spec.paused`), timeout-driven
auto-pause, `PauseTime` expiry, probe-driven auto-pause, and every normal resume (SDK `connect`, wake-on-traffic,
scheduled resume).

### Configuring Hooks

Hooks are declared in `spec.lifecycle` on the `Sandbox` (or, for pool-created sandboxes, on the `SandboxSet`):

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo-hooks
  namespace: default
spec:
  lifecycle:
    prePause:
      exec:
        command: ["/bin/bash", "-c", "/workspace/flush.sh"]
      timeoutSeconds: 10
    postResume:
      exec:
        command: ["/bin/bash", "-c", "/workspace/reconnect.sh"]
      timeoutSeconds: 10
  # ... template etc.
```

| Field            | Behavior                                                                                                                                    |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `exec.command`   | Required. The first element is the executable, the rest are arguments. Request a shell explicitly, e.g. `["/bin/bash", "-c", "..."]`.         |
| `timeoutSeconds` | Optional, default `60`, allowed range `1–60`. Bounds a single execution — the command is killed server-side when it expires.                  |

Notes:

- Hooks run as `root` inside the sandbox (the same identity upgrade hooks use).
- A `prePause` hook runs **before** the Pod is deleted (and before any checkpoint is captured on platforms that
  checkpoint), so its effects are included in the captured state. A `postResume` hook runs only after the runtime
  has been re-initialized; it never runs on initial sandbox creation.
- Pool-level configuration: `SandboxSet.spec.lifecycle` is copied to every pool-created sandbox and participates in
  the revision hash — changing pool-level hooks triggers a rolling update of unclaimed pool members. Claimed
  sandboxes are never silently overwritten; update them (or use [Sandbox Update](./sandbox-update.md)) explicitly.
  Because the copied `spec.lifecycle` is part of the sandbox itself, hooks configured at the pool level **are**
  triggered by any pause source, including the E2B SDK (`beta_pause`) and timeout-driven auto-pause; only the
  *declaration* of hooks is Kubernetes-API-only.

### Failure Semantics

Hook failure is **terminal and non-blocking**: each hook executes **once** per pause/resume cycle, and a failed
execution records the result and lets the lifecycle transition continue — the pause still completes after a failed
`prePause`, and the sandbox still becomes `Ready` after a failed `postResume`.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo-hooks
  namespace: default
status:
  phase: Paused
  conditions:
    - type: PrePauseHook
      status: "False"
      reason: Failed
      message: "hook failed: execution error; lifecycle transition continues"
    - type: SandboxPaused
      status: "True"
      reason: StopPauseSucceed
```

- Results are observable on the `PrePauseHook` / `PostResumeHook` conditions (`Succeeded`, `Failed`, `Skipped`) and
  through Warning events; the condition survives the completed transition as the record of the cycle.
- `prePause` records `Skipped` when the Pod is already gone (e.g. deleted out-of-band) — the pause continues
  without executing anything.
- Retrying failed hooks is not supported in the current release; write hooks so that a single run either succeeds
  or fails fast.

### Writing Hook Scripts

> **Commands must be idempotent.** The controller may replay a hook whose outcome is uncertain (for example, a
> controller crash between command execution and persisting the result). Guard non-idempotent work with locks or
> markers inside the sandbox.

- Prefer atomic writes (write to a temp file, rename) so a timeout cannot leave half-written state.
- If a hook forks background children, terminate them explicitly on exit — the timeout kills the command process,
  not the whole process tree. Take mutual-exclusion locks (e.g. `flock`) in scripts that must not overlap
  themselves.
- Keep `timeoutSeconds` short (10 s is a good default) and remember that pause/resume latency includes one hook
  execution; wake-on-traffic requests should budget for Pod start + initialization + hook runtime.

## Capability Matrix

| Capability                                                           | E2B SDK                       | Kubernetes CRD                       |
|----------------------------------------------------------------------|-------------------------------|--------------------------------------|
| Pause a running sandbox                                              | ✅ `sbx.beta_pause()`          | ✅ `spec.paused: true`                |
| Resume a paused sandbox                                              | ✅ `Sandbox.connect(id, ...)`  | ✅ `spec.paused: false`               |
| Auto-pause when the timeout expires                                  | ✅ `lifecycle.on_timeout='pause'` | ❌                                |
| Auto-pause at a specific absolute time                               | ❌                             | ✅ `spec.pauseTime`                   |
| Auto-resume a paused sandbox on ingress traffic                      | ✅ `lifecycle.auto_resume=true` | ✅ `spec.autoPausePolicy.resume.onIngressTraffic` |
| Configure deletion after entering paused                            | ✅ creation metadata or pause header | ✅ annotation for auto-pause; write `spec.shutdownTime` for a manual pause |
| Set / refresh the sandbox timeout together with resume               | ✅ `Sandbox.connect(id, timeout=...)` | ✅ write `spec.shutdownTime` / `spec.pauseTime` in the same patch |
| Extend-only guard on timeout refresh while running                   | ✅                             | ❌ user-written value may shorten    |
| Observe paused/running state                                         | via SDK response              | `status.phase` (`Paused` / `Running`)|
| Run a command before pause (`prePause`)                              | ❌ (SDK has no hook fields)   | ✅ `spec.lifecycle.prePause`          |
| Run a command after resume (`postResume`)                            | ❌ (SDK has no hook fields)   | ✅ `spec.lifecycle.postResume`        |

If you need "extend-only, never shorten" timeout semantics, use the E2B SDK. The CRD path is better suited for
declarative / GitOps control over the paused/running bit plus absolute scheduling times.

## Notes

- **Connection drop.** The Pod is frozen on pause; all active streams (WebSocket / PTY / command streams) disconnect.
  Clients must reconnect after resume.
- **Timeout during pause.** The running timeout does not continue counting down unchanged after pause. Auto-delete is
  controlled by `spec.shutdownTime`, which paused retention can recalculate from the pause transition time.
- **Old SDKs.** The legacy `POST /sandboxes/{sandboxID}/resume` endpoint is kept for old SDK compatibility only. New
  code should always use `Sandbox.connect(...)`.
- **State-preservation caveats.** Whether memory is preserved across pause/resume depends on the runtime platform. To
  control what the filesystem preserves across pause, configure a pause strategy on the `SandboxSet` (see
  [Pause Strategies](./auto-pause-resume.md#pause-strategies)). If you need explicit memory + filesystem snapshots
  that can also be cloned into brand-new sandboxes, use [Snapshot Management](./checkpoint.md) instead.
- **Hooks are CRD-only.** The E2B SDK exposes no hook fields; hooks apply to every pause/resume regardless of which
  interface triggered it, but can only be declared through the Kubernetes API.
- **Hooks travel with snapshots.** A sandbox created from a checkpoint or snapshot inherits the captured
  `prePause` / `postResume` configuration, so cloned sandboxes pause and resume with the same hooks. Upgrade hooks
  (`preUpgrade` / `postUpgrade`) are never copied into clones.

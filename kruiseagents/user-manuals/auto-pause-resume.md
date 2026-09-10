---
id: auto-pause-resume
title: Automatic Pause and Resume
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Automatic Pause and Resume

When AI agent workloads run at scale, idle sandboxes still occupy CPU and memory. OpenKruise Agents can pause a
sandbox automatically after it reports idle for a sustained period, and wake it up before the next scheduled task or
when inbound traffic arrives, improving cluster resource utilization and reducing the cost of idle compute.

Automatic pause/resume is configured on the `SandboxSet` through runtime probes and lifecycle policies. This document
also covers pause strategies, which control what is preserved when a sandbox pauses. For pausing and waking an
individual sandbox on demand — the E2B SDK `pause()` / `connect()` methods, the `Sandbox` CR `spec.paused` field, and
timeout-based auto-pause — see [Pausing and Resuming](./pause-resume.md).

## Prerequisites

- A `SandboxSet` has been created and its sandboxes have been claimed by agents. See
  [Warm Pool Management](./warmpool-management.md) and [Sandbox Claim](./sandbox-claim.md).
- Probe-driven automatic pause and scheduled wake-up require the `AutoPauseController` feature gate to be enabled on
  `sandbox-controller`.
- Inbound-traffic wake-up only takes effect for requests routed to the sandbox through the
  [Sandbox Gateway](../architecture.md#sandbox-gateway), and the gateway must be configured with
  `enable-wake-on-traffic` enabled.

## Pause Strategies

`spec.pauseStrategy` is an optional field of `SandboxSet.spec`. It specifies how a sandbox is paused when
`spec.paused` is set to `true`. When it is not configured, the default strategy is used, which is identical to the
existing behavior — existing configurations require no change.

| Strategy                | Configuration                                                            | What is preserved                                                                           |
|-------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Default                 | Omit `spec.pauseStrategy`                                                | Before pausing, the sandbox filesystem (`rootfs`) is persisted to the volume backing the sandbox. |
| Stop                    | `pauseStrategy.type: Stop`                                               | Nothing is saved. Only PVC data is retained; the `rootfs` filesystem is lost.               |
| Snapshot                | `pauseStrategy.type: Hibernate` with `hibernateStrategy.type: Snapshot`  | Before pausing, the sandbox filesystem (`rootfs`) is persisted to a snapshot.               |

Configure the `Stop` strategy:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: code-interpreter
  namespace: default
spec:
  replicas: 4
  pauseStrategy:
    type: Stop
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
          resources:
            limits:
              cpu: "1"
              memory: 1Gi
            requests:
              cpu: "1"
              memory: 1Gi
```

Configure the `Snapshot` strategy:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: code-interpreter
  namespace: default
spec:
  replicas: 4
  pauseStrategy:
    type: Hibernate
    hibernateStrategy:
      type: Snapshot
  persistentContents:   # only `filesystem` (rootfs) is currently supported
    - filesystem
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
          resources:
            limits:
              cpu: "1"
              memory: 1Gi
            requests:
              cpu: "1"
              memory: 1Gi
```

:::note
`probes`, `autoPausePolicy`, `pauseStrategy`, and `persistentContents` are all top-level fields of `SandboxSet.spec`.
Only container, resource, and scheduling fields belong in `spec.template.spec`.
:::

Pausing a sandbox releases its compute resources to reduce cost. Trigger a pause only when there are no active
requests or long-lived connections; see [Caveats](#caveats).

## How Probes and Policies Work

`spec.probes` is a top-level field of `SandboxSet.spec` that defines probes executed periodically while the sandbox
runs. A probe only runs a command and reports the result — it does not itself decide whether the sandbox pauses or
wakes up. `spec.autoPausePolicy` references probe results by name and interprets their standard output:

- **Pause rules** use `messageRegex` to match probe output and detect whether the agent is idle.
- **Resume rules** use `timeFormat` to parse probe output as the time of the next task.

`spec.probes` works independently of `autoPausePolicy`: probes run even without any policy configured, and their
results can be inspected through `Sandbox` conditions. Once a policy is configured, it reads the condition of the
referenced probe by name. The same probe can be referenced by one or more policies, but idle detection and scheduled
wake-up usually require different output formats — define separate probes for them, such as the `Active` and `Cron`
probes in the examples below.

Only `exec` probes are currently supported.

| Field            | Required | Description                                                                                                                                                                                    |
|------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`           | Yes      | Name of the probe. Must be unique within the same `SandboxSet` and must exactly match the `probe` field of `autoPausePolicy`. The probe result is reported in the `Sandbox` condition of type `agents.kruise.io/<name>`. |
| `containerName`  | No       | Container in which the probe runs. Defaults to the first container in the Pod.                                                                                                                  |
| `exec.command`   | Yes      | Command and arguments executed in the target container. The command is not run through a shell; for pipes, redirections, or conditionals, invoke the shell explicitly with `sh -c` as in the examples. |
| `periodSeconds`  | No       | Interval between probe executions, in seconds. `30` means the probe runs every 30 seconds. Setting it explicitly is recommended.                                                                |
| `timeoutSeconds` | No       | Timeout of a single probe execution, in seconds. `5` means the command is considered failed once it runs longer than 5 seconds. Setting it explicitly is recommended.                           |

When a probe command exits with code `0`, the condition `status` is `True` and the standard output is recorded in the
condition `message`. Output of failed or timed-out probes is never used to trigger automatic pause or wake-up.
Express both business state and task times through standard output only, and keep debug logs out of it.

## Auto Pause When Idle

The following `SandboxSet` checks whether the agent is active every 30 seconds. A claimed sandbox is paused
automatically after the `Active` probe reports idle for 10 consecutive minutes.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: agent-sandbox-pool
  namespace: default
spec:
  replicas: 4
  probes:
    - name: Active
      containerName: sandbox
      periodSeconds: 30
      timeoutSeconds: 5
      exec:
        command:
          - sh
          - -c
          - |
            # Example only; define the idle state according to your business.
            if openclaw sessions list --active 900 2>/dev/null | grep -q .; then
              echo "active"
            else
              echo "inactive"
            fi
  autoPausePolicy:
    pause:
      whenProbedIdleState:
        probe: Active
        messageRegex: "^inactive$"
        thresholdDuration: 10m
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
```

- The `Active` probe runs the idle-detection command in the `sandbox` container every 30 seconds. Its name matches
  the value of `autoPausePolicy.pause.whenProbedIdleState.probe`.
- The example command lists sessions active within the last 900 seconds (15 minutes); `grep -q .` checks for non-empty
  output — the probe prints `active` if any session is active and `inactive` otherwise. `2>/dev/null` keeps error
  messages out of the probe's standard output. Adjust the `900` window to match how your business defines idle.
- A probe should exit with code `0` and print only `active` or `inactive` to standard output. The condition `status`
  tells whether the probe ran successfully; the business state is carried by `message`.
- `pause.whenProbedIdleState.probe` references the `Active` probe defined in `spec.probes`, and
  `messageRegex: "^inactive$"` matches its idle output.
- `thresholdDuration` is required and cannot be negative. With `10m`, the timer starts when the probe first reports
  `inactive`, and the sandbox pauses after 10 consecutive minutes of `inactive`. With `0`, the sandbox pauses as soon
  as the probe reports `inactive` once. In this example the activity window is 15 minutes and the threshold is 10
  minutes, so it typically takes about 25 minutes from the last session activity to the pause.

When the idle probe times out, fails, or the configuration is invalid, the system keeps the sandbox running as the
conservative fallback. Warm sandboxes managed by the `SandboxSet` but not yet claimed still run probes, but they do
not participate in automatic pause decisions; the policy takes effect once a sandbox is claimed.

The following status shows a sandbox that is still running while waiting for the idle threshold to elapse. After the
`Active` probe first reports `inactive`, the controller computes the expected pause time from the condition's
`lastTransitionTime` plus `thresholdDuration` and writes it into `nextPauseTime`. For example, with the probe
reporting idle continuously from `2026-09-09T10:00:00Z` and a `thresholdDuration` of 10 minutes:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
status:
  phase: Running
  conditions:
    - type: agents.kruise.io/Active
      status: "True"
      reason: Succeeded
      message: inactive
      lastTransitionTime: "2026-09-09T10:00:00Z"
  schedules:
    - reason: probedIdle
      nextPauseTime: "2026-09-09T10:10:00Z"
```

- The condition `type` is the fixed prefix `agents.kruise.io/` plus the probe name `Active`; renaming the probe
  changes the condition type accordingly.
- `status: "True"` means the probe executed successfully; the business state is in `message: inactive`.
- `nextPauseTime` is the predicted pause time and does not mean the pause has been triggered. If the probe reports
  `active` before that time, the controller clears `nextPauseTime` and the sandbox keeps running; if the probe keeps
  reporting `inactive` until then, the controller pauses the sandbox and clears `nextPauseTime`.

## Auto Wake Before Scheduled Tasks

The following `SandboxSet` obtains the time of the next scheduled task as a Unix timestamp in seconds every 30
seconds, and wakes a paused sandbox 5 minutes before the task.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: agent-sandbox-pool
  namespace: default
spec:
  replicas: 4
  probes:
    - name: Cron
      containerName: sandbox
      periodSeconds: 30
      timeoutSeconds: 5
      exec:
        command:
          - sh
          - -c
          - |
            # Example only; obtain the next task time according to your business.
            NEXT_MS=$(openclaw cron list --json 2>/dev/null \
              | jq -r '[.[] | select(.enabled != false) | .nextRunAtMs] | map(select(. != null)) | sort | .[0]')
            if [ -n "$NEXT_MS" ] && [ "$NEXT_MS" != "null" ]; then
              echo $((NEXT_MS / 1000))
            else
              echo "none"
            fi
  autoPausePolicy:
    resume:
      whenProbedScheduleTime:
        probe: Cron
        timeFormat: unix
        leadTime: 5m
  template:
    spec:
      containers:
        - name: sandbox
          image: <YOUR_IMAGE>
```

- The `Cron` probe obtains the next task time in the `sandbox` container every 30 seconds. Its name matches the value
  of `autoPausePolicy.resume.whenProbedScheduleTime.probe`.
- The example command lists scheduled tasks, filters enabled tasks that have a `nextRunAtMs` value, sorts them by
  time, and takes the earliest. `nextRunAtMs` is a Unix timestamp in milliseconds, so it must be divided by 1000
  before being printed.
- A probe should exit with code `0` and print exactly one value to standard output. With `timeFormat: unix`, the
  value must be a Unix timestamp in seconds as a positive integer, such as `1788516000`. The controller trims
  leading and trailing whitespace and newlines, but cannot parse millisecond timestamps, values with units, date
  strings, JSON, or interleaved log output.
- When there is no next task, the script prints `none`. This tells the controller that no task time is available, and
  no wake-up schedule is created.
- `resume.whenProbedScheduleTime.probe` references the `Cron` probe defined in `spec.probes`.
- `timeFormat` specifies how the probe output is parsed. `unix` (also the default) parses a Unix timestamp in
  seconds; `datetime` parses an RFC3339 time that carries a timezone.
- `leadTime` specifies how far ahead of the task the sandbox wakes up. The default is `5m`; `0` wakes the sandbox
  exactly at the task time; negative values are invalid.

This example only configures automatic wake-up: the sandbox must first be paused manually, via `spec.pauseTime`, or
through other pause rules. To combine idle auto-pause with scheduled wake-up, merge the `pause` and `resume`
configurations of the two examples.

When the wake-up probe is unavailable or fails, no wake-up schedule is created; if automatic pause rules are
configured at the same time, automatic pause is not triggered either. When the probe succeeds but its output cannot
be parsed, no wake-up schedule is created, while the idle rules can still pause the sandbox.

The following status shows the sandbox after the `Cron` probe reports the next task time. `1788516000` is
`2026-09-04T10:00:00Z`; with a `leadTime` of 5 minutes, the controller writes the predicted wake-up time into
`nextResumeTime`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
status:
  phase: Running
  conditions:
    - type: agents.kruise.io/Cron
      status: "True"
      reason: Succeeded
      message: "1788516000"
      lastTransitionTime: "2026-09-04T09:50:00Z"
  schedules:
    - reason: probedSchedule
      nextResumeTime: "2026-09-04T09:55:00Z"
```

- The condition `type` is the fixed prefix `agents.kruise.io/` plus the probe name `Cron`.
- `status: "True"` means the probe executed successfully; `message` is its standard output.
- `nextResumeTime` is the predicted wake-up time computed from the task time and `leadTime`. Once the sandbox pauses,
  the controller uses the recorded `nextResumeTime` to trigger the wake-up. If the probe later reports a new task
  time, the value is recomputed; if the output is `none` or otherwise unparseable, the value is cleared.

### Time and Timezone Requirements for Scheduled Wake-up

The wake-up time is computed as *the probed next task time minus `leadTime`*. `leadTime` is a plain duration — the
default is 5 minutes, it can be set to `0`, but it cannot be negative.

- `timeFormat: unix` — the probe must print a Unix timestamp in seconds as a positive integer, such as `1788516000`.
  A Unix timestamp denotes one absolute instant since `1970-01-01T00:00:00Z` and carries no timezone, so the wake-up
  moment is not affected by the timezone or region the controller runs in.
- `timeFormat: datetime` — the probe must print an RFC3339 time **with** a timezone, such as
  `2026-09-04T18:00:00+08:00` or `2026-09-04T10:00:00Z` (both denote the same instant). A value like
  `2026-09-04 18:00:00` — no timezone and not RFC3339 — cannot be parsed.

The main timezone risk is converting local business time into a Unix timestamp inside the probe. For example, when
converting the local time `2026-09-04 18:00:00` in UTC+8, the conversion must explicitly use the `+08:00` offset or
the `Asia/Shanghai` timezone; parsing it as UTC introduces an 8-hour offset. A correctly generated Unix timestamp is
no longer affected by the controller's timezone.

Also double-check the timestamp unit: JavaScript's `Date.now()` and `nextRunAtMs` in the example return milliseconds
and must be divided by 1000 before being printed. The controller neither recognizes nor converts millisecond
timestamps automatically.

Using `unix` and printing a seconds-level positive integer directly from the probe is recommended. If the next task
happens at `2026-09-04T18:00:00+08:00`, whose Unix timestamp is `1788516000`, the sandbox is woken at
`2026-09-04T17:55:00+08:00` on the same absolute timeline with a `leadTime` of 5 minutes.

## How autoPausePolicy, pauseTime and E2B timeout Relate

- `spec.autoPausePolicy` is an always-on, probe-driven policy: it can pause the sandbox based on idle state and wake
  it based on the next task time.
- `Sandbox.spec.pauseTime` is a one-shot absolute pause time in RFC3339 format. When the time is reached, the
  controller sets `spec.paused` to `true`.
- The two can be configured together and take effect independently — whichever condition is satisfied first triggers
  the pause. An expired `pauseTime` is not cancelled even if the probes report the agent as active.
- When creating a sandbox with the E2B SDK, the client only passes a relative `timeout` in seconds. With
  `lifecycle.on_timeout` set to `pause`, `sandbox-manager` converts it into `spec.pauseTime` as *the server's current
  time plus timeout*; the E2B client never reads or sets `pauseTime` directly.
- If pausing should be fully decided by probe policies, do not set `spec.pauseTime` on the `Sandbox` CR. When
  creating or claiming a sandbox through the E2B SDK, set the `"e2b.agents.kruise.io/never-timeout": "true"` metadata
  extension so that no `pauseTime` or `shutdownTime` is generated — this does not prevent `autoPausePolicy` from
  toggling `spec.paused`.

## Auto Wake on Inbound Traffic

A paused sandbox can also be woken up automatically by inbound requests. This capability only applies to agent
traffic routed through the Sandbox Gateway.

<Tabs>
<TabItem value="E2B" label="E2B SDK">

Set `lifecycle.on_timeout` to `pause` and `lifecycle.auto_resume` to `True` when creating the sandbox:

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox.create(
    template="code-interpreter",
    timeout=600,
    lifecycle={
        "on_timeout": "pause",
        "auto_resume": True,
    },
)

# Get the sandbox hostname for a given port
host = sandbox.get_host(3000)
print(f"https://{host}")
```

The sandbox pauses automatically after the timeout. While it is paused, sending a request to its hostname wakes it
up — no `Sandbox.connect()` call is needed first. After the wake-up, the auto-pause countdown restarts from the
wake-up moment using the `timeout` set at creation; positive values smaller than 5 minutes are treated as 5 minutes.

`auto_resume` currently only wakes the sandbox on inbound traffic addressed to the sandbox hostname. SDK operations
such as `sandbox.commands` or `sandbox.files` do not trigger the wake-up; call `Sandbox.connect(...)` first for
those.

</TabItem>
<TabItem value="CRD" label="SandboxSet CRD">

Configure `spec.autoPausePolicy.resume.onIngressTraffic`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
spec:
  autoPausePolicy:
    resume:
      onIngressTraffic:
        pauseTimeout: 5m
```

`pauseTimeout` re-arms the timeout-based auto-pause countdown after a traffic wake-up. It only applies to sandboxes
with `spec.pauseTime` configured; if it is unset or not greater than 0, the countdown is not reset. Positive values
smaller than 5 minutes are treated as 5 minutes.

</TabItem>
</Tabs>

For how clients resolve sandbox hostnames and domains, see [E2B Client](./e2b-client.md). For configuring traffic
wake-up on an individual `Sandbox` CR, and for how concurrent requests share one resume operation, see
[Pausing and Resuming](./pause-resume.md#waking-on-ingress-traffic).

## Verify Automatic Pause and Resume

Inspect probe results and the next scheduled pause/wake-up times. Replace `<RESOURCE_NAME>` and `<NAMESPACE>` with
your values:

```shell
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.conditions}'
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.schedules}'
```

When a probe runs successfully, the corresponding condition has `status` `True` and its `message` holds the probe's
standard output. While idle matching is in progress, `status.schedules` shows `nextPauseTime`; when a valid scheduled
task exists, it shows `nextResumeTime`.

## Observe Paused Sandboxes

Pods of paused sandboxes do not consume cluster CPU or memory. Check the sandbox phase with:

```shell
kubectl get sandbox <RESOURCE_NAME> -n <NAMESPACE> -o jsonpath='{.status.phase}'
# → Paused
```

To observe the resource usage of sandbox pods, use your monitoring stack, for example a Prometheus-based dashboard.

## Delete a Paused Sandbox

To remove a paused sandbox completely, delete the `Sandbox` resource.

<Tabs>
<TabItem value="E2B" label="E2B SDK">

Replace `<YOUR_SANDBOX_ID>` with the actual sandbox ID:

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox.connect("<YOUR_SANDBOX_ID>")
sandbox.kill()
```

</TabItem>
<TabItem value="CRD" label="Kubernetes CRD">

```shell
kubectl -n <NAMESPACE> delete sandbox <RESOURCE_NAME>
```

</TabItem>
</Tabs>

## Caveats

- **Wake-up may fail.** Pausing reclaims the sandbox's compute resources (CPU and memory); waking it up may fail if
  the cluster cannot schedule the required resources at that moment. Retry later, or adjust the resource
  requirements.
- **Request interruption and lost long connections.** Pausing freezes the sandbox CPU immediately — in-flight
  requests fail. Long connections (WebSocket, SSE, gRPC) are not restored after wake-up; clients must reconnect.
  Trigger a pause only after confirming there are no active requests or long connections.
- **Data loss with the Stop strategy.** With `pauseStrategy.type: Stop`, neither the `rootfs` nor the in-memory
  state is preserved; data not written to a PVC before pausing is lost after wake-up. To preserve the container
  filesystem across pause, use the default or the Snapshot strategy (see [Pause Strategies](#pause-strategies)).

## Further Reading

- [Pausing and Resuming](./pause-resume.md) — manual pause/wake-up, timeout-based auto-pause, and paused-sandbox
  retention.
- [Warm Pool Management](./warmpool-management.md) — creating and managing sandboxes with `SandboxSet`.
- [Snapshot Management](./checkpoint.md) — checkpoint and fork workflows for sandboxes.
- [E2B Client](./e2b-client.md) — connecting the E2B SDK to `sandbox-manager`.

# Warm Pool Autoscaling

PoolAutoscaler automatically adjusts the size of a warm pool. Based on the number of unclaimed Sandboxes and user-configured Cron schedules, it modifies the `spec.replicas` of a SandboxSet: replenishing the pool when available Sandboxes run low, shrinking it when too many sit idle, and pre-warming ahead of known peaks.

Unlike CPU- or QPS-based autoscaling, PoolAutoscaler does not collect business metrics or predict traffic. It only manages warm pool capacity; the business lifecycle of a claimed Sandbox is still handled by the Agent Sandbox service. For warm pool fundamentals, see [Warm Pool Management](./warmpool-management.md).

## Background and Use Cases

This capability is suited to the following scenarios:

- **Fluctuating request volume**: for example, users create, use, and release Sandboxes through the E2B API, and you always want a certain number of available instances on hand to reduce claim latency.
- **Predictable peak hours**: for example, ahead of weekday mornings, scheduled tasks, or events, the pool can be pre-warmed at a specified time.
- **Both traffic types coexist**: capacity policy replenishes the pool day-to-day, while Cron policies set the warm-up target for known peaks.

## Prerequisites and Limitations

Before you begin, confirm that:

1. `agent-sandbox-controller` is installed at a version that supports PoolAutoscaler: newer versions enable it by default with no extra configuration; older versions require the startup flag `--feature-gates=PoolAutoscaler=true` (see [Installation](../installation.md)).
2. A target SandboxSet has been created following [Warm Pool Management](./warmpool-management.md), and the SandboxSet controller is running normally.
3. Within a namespace, a SandboxSet can be managed by at most one PoolAutoscaler.
4. At least one policy is configured: `capacityPolicy` or `cronPolicies`.

PoolAutoscaler only modifies `spec.replicas` of the target SandboxSet. Do not let HPA, AHPA, scripts, or other controllers write the same field concurrently. PoolAutoscaler also does not create or delete Pods directly.

## Scenario 1: Replenish the Pool by Available Capacity

This scenario suits businesses whose request volume is hard to predict but that need consistently low claim latency. For example, the business continuously creates Sandboxes through the E2B API, runs code or commands, and releases them when done. Each claim consumes an available Sandbox in the pool; the capacity policy replenishes the pool accordingly.

### Step 1: Create the Warm Pool via SandboxSet

Users who have already created a SandboxSet following [Warm Pool Management](./warmpool-management.md) can reuse it directly. The following is a minimal example; field meanings are in the comments. Replace the fields marked "MUST REPLACE" with values verified in your cluster.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: sandbox-pool        # SandboxSet name, referenced by PoolAutoscaler later; change as needed
  namespace: default        # deployment namespace; PoolAutoscaler must live in the same namespace
spec:
  replicas: 2               # initial pool size; the PoolAutoscaler takes over once applied, so keep it small to reduce cost
  runtimes:
    - name: agent-runtime   # injects the envd-compatible runtime required by E2B code execution / files / commands
  template:
    spec:
      containers:
        - name: sandbox
          image: <your-agent-sandbox-image>   # MUST REPLACE: an Agent Sandbox runtime image that can be pulled in-cluster
          resources:
            requests:         # scheduling requests, affecting per-instance cost and schedulable node range
              cpu: "1"
              memory: 1Gi
            limits:           # resource limits; tune to your runtime — too large wastes warm-up cost, too small causes startup to fail
              cpu: "1"
              memory: 1Gi
```

:::note
The `runtimes: agent-runtime` entry is required for the E2B verification in Step 3 (`run_code`, file reads/writes, command execution all rely on the injected envd runtime). For how runtime injection works and its dependency on the `sandbox-injection-config` ConfigMap, see [Runtime Injection](./runtime-injection.md).
:::

```bash
kubectl apply -f sandboxset.yaml
kubectl get sandboxset sandbox-pool -n default
```

### Step 2: Configure the PoolAutoscaler

The following policy maintains the pool proportionally: the target availability ratio is 50% with the default 10% tolerance, so it scales up when the recent average availability drops below 40%, scales down above 60%, and makes no change in between. Percentage watermarks stretch with pool size, suited to fluctuating workloads.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: PoolAutoscaler
metadata:
  name: sandbox-pool-autoscaler   # PoolAutoscaler name, for identification and later kubectl queries; change as needed
  namespace: default              # must be in the same namespace as the target SandboxSet
spec:
  scaleTargetRef:
    apiVersion: agents.kruise.io/v1alpha1
    kind: SandboxSet              # only SandboxSet is supported
    name: sandbox-pool            # the SandboxSet created in Step 1
  minReplicas: 2                 # pool lower bound; percentage targets must satisfy scale-down reachability, see below
  maxReplicas: 50                 # pool upper bound; set based on peak concurrency and cluster capacity
  capacityPolicy:
    targetAvailable: "50%"        # target ratio of available (unclaimed) Sandboxes to replicas, stretching with pool size
    # tolerance defaults to 10% when unset, combining with the target into a no-action range of 40% to 60%
    scaleUp:
      stabilizationWindowSeconds: 60    # minimum interval between consecutive scale-ups; a smaller value refills the pool faster but scales more aggressively
    scaleDown:
      stabilizationWindowSeconds: 300   # minimum interval between consecutive scale-downs; a longer value avoids recycling the pool during nightly dips
```

```bash
kubectl apply -f pool-autoscaler.yaml
kubectl get poolautoscaler sandbox-pool-autoscaler -n default
```

`minReplicas` and `maxReplicas` are always enforced: every replica count computed by any policy is clamped to this range. The values of `targetAvailable`, `tolerance`, and `minReplicas` together determine whether an idle pool can shrink to `minReplicas`; see [Capacity Policy Parameters and Scale-Down Reachability](#capacity-policy-parameters-and-scale-down-reachability).

### Step 3: Verify with E2B Business Traffic

The following single-file script simulates real business traffic: each concurrent loop claims a Sandbox from the pool, runs code, writes and reads a file, runs a command, holds it briefly, then releases it. Pool scaling can be observed separately with the commands in Step 4.

Preparation:

1. Python 3.9+ is installed locally, and the target cluster's kubeconfig is configured (for observing state with kubectl).
2. Install the E2B SDK: `pip install e2b-code-interpreter`.
3. Prepare an accessible E2B service domain, a self-signed CA certificate (if the cluster uses one), and an API Key.

Save the script as `poolautoscaler-verify.py`:

```python
#!/usr/bin/env python3
"""Generate E2B business traffic against a PoolAutoscaler-managed pool.

Usage:
  E2B_API_KEY='<api-key>' \
  E2B_DOMAIN='<e2b-domain>' \
  SSL_CERT_FILE='<ca-file>' \
  python poolautoscaler-verify.py --template sandbox-pool
"""
import argparse, os, sys, threading, time
from concurrent.futures import ThreadPoolExecutor

stop = threading.Event()


def business_loop(loop_id, template, hold, startup_timeout, deadline):
    """One worker: claim a sandbox, run business calls, hold, then release."""
    from e2b_code_interpreter import Sandbox
    seq = 0
    while time.monotonic() < deadline and not stop.is_set():
        seq += 1
        try:
            sandbox = Sandbox.create(template=template, timeout=startup_timeout)
            sandbox.run_code(f"print('loop={loop_id} seq={seq}')")
            path = f"verify-{loop_id}-{seq}.txt"
            content = f"loop={loop_id} seq={seq}\n"
            sandbox.files.write(path, content)
            assert sandbox.files.read(path) == content, "file content mismatch"
            assert sandbox.commands.run(f"cat {path}").stdout == content
            stop.wait(hold)          # simulate the business holding the sandbox
            sandbox.kill()
        except Exception as exc:
            print(f"loop {loop_id} seq {seq} failed: "
                  f"{type(exc).__name__}: {exc}", file=sys.stderr, flush=True)
            stop.wait(5)             # back off before the next attempt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--template", default="sandbox-pool",
                        help="SandboxSet name, i.e. the E2B template")
    parser.add_argument("--concurrency", type=int, default=10,
                        help="simultaneous business sandboxes; each consumes one pool slot")
    parser.add_argument("--duration-seconds", type=int, default=300)
    parser.add_argument("--hold-seconds", type=int, default=30,
                        help="how long each loop holds its sandbox before releasing")
    parser.add_argument("--startup-timeout", type=int, default=600,
                        help="seconds to wait for each sandbox to start")
    args = parser.parse_args()
    if not os.getenv("E2B_API_KEY"):
        parser.error("E2B_API_KEY must be set")

    deadline = time.monotonic() + args.duration_seconds
    print(f"load: {args.concurrency} loops x {args.duration_seconds}s, "
          f"hold={args.hold_seconds}s (Ctrl+C stops early)", flush=True)
    try:
        with ThreadPoolExecutor(max_workers=args.concurrency) as pool:
            futures = [pool.submit(business_loop, i, args.template,
                                   args.hold_seconds, args.startup_timeout, deadline)
                       for i in range(args.concurrency)]
            for future in futures:
                future.result()
    except KeyboardInterrupt:
        print("interrupted; waiting for in-flight sandboxes to settle...", flush=True)
    finally:
        stop.set()
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

Run it (open another terminal with the `kubectl get ... -w` command from Step 4 to watch the scale-up live):

```bash
E2B_API_KEY='<api-key>' \
E2B_DOMAIN='<e2b-domain>' \
SSL_CERT_FILE='<ca-file>' \
python poolautoscaler-verify.py \
  --template sandbox-pool \
  --concurrency 10 \
  --duration-seconds 300 \
  --hold-seconds 30
```

Parameter notes:

- `--concurrency`: number of concurrent business loops. Each loop holds one business Sandbox at a time, capping the claim rate from the pool; a larger value drains the pool faster and makes the scale-up more visible. Make sure `maxReplicas` exceeds this value, otherwise the pool cannot refill.
- `--hold-seconds`: how long each Sandbox is held for business work; longer means fewer claims per unit time.
- `--duration-seconds`: total load duration; at least 3x the scale-up stabilization window (default 60 seconds) is recommended, to observe at least two rounds of scale-up.
- `--startup-timeout`: per-Sandbox creation timeout, default 600 seconds; increase when the underlying supply is slow.

Expected result: while the load runs, the commands in Step 4 show `currentCapacity.available` dropping and `desiredReplicas` climbing, which means the capacity policy detects claim-driven consumption and replenishes the pool.

Verify scale-down (optional): after the load ends, manually lower `targetAvailable` and watch the pool converge:

```bash
kubectl patch poolautoscaler sandbox-pool-autoscaler -n default \
  --type merge -p '{"spec":{"capacityPolicy":{"targetAvailable":"10%"}}}'
kubectl get sandboxset sandbox-pool -n default -w
```

The pool should gradually shrink to `minReplicas` (2 in this example). Afterward, restore `targetAvailable` to its original value.

### Step 4: Observe Scaling Rhythm and Startup Protection

```bash
kubectl get poolautoscaler sandbox-pool-autoscaler -n default -o yaml
kubectl get sandboxset sandbox-pool -n default -o yaml
kubectl describe poolautoscaler sandbox-pool-autoscaler -n default
```

Focus on `status.currentReplicas`, `status.desiredReplicas`, `status.currentCapacity.available`, and `status.conditions`. These reflect the most recent reconciliation and may briefly lag the SandboxSet's live state.

The capacity policy decides based on the average availability over a recent observation period, smoothing out transient fluctuation. The first scale action executes immediately; subsequent actions follow the stabilization windows: scale-up defaults to a 60-second interval, scale-down to 300 seconds, both adjustable via `stabilizationWindowSeconds` (see [Parameter Validation Constraints](#parameter-validation-constraints)). The default scale-up interval already includes a safety margin for the pending timeout; when a larger value is configured, the configured value wins.

When the SandboxSet's current-generation `ScalingLimited` condition is `True`, PoolAutoscaler pauses further scale-up. This avoids raising the target while the startup budget is exhausted due to startup failures or pending timeouts. Scale-down is unaffected. The creation concurrency of in-flight Sandboxes is controlled by the SandboxSet — PoolAutoscaler does not manage Pods directly. For trigger conditions, recovery, and troubleshooting of the limiter, see [Failure Scenario: Scale-Up Throttling, Trigger and Recovery](#failure-scenario-scale-up-throttling-trigger-and-recovery).

Tuning advice: start small — use lower `minReplicas` and `maxReplicas` and a longer scale-down interval — then adjust gradually based on startup success rate, claim latency, and warm-up cost. To temporarily observe or take manual control, suspend autoscaling (resume by setting `false` or removing the field):

```bash
kubectl patch poolautoscaler sandbox-pool-autoscaler -n default \
  --type merge -p '{"spec":{"suspend":true}}'
```

### Step 5 (Optional): Delete the Policy

This step is optional. When autoscaling is no longer needed (for example, the business is decommissioned or switched to a fixed size), delete the PoolAutoscaler. The SandboxSet and existing Sandboxes are retained, and the SandboxSet replica count stays at the value before deletion with no further automatic scale-down; to reclaim the pool, manually adjust `spec.replicas` or delete the SandboxSet.

```bash
kubectl delete poolautoscaler sandbox-pool-autoscaler -n default
```

## Scenario 2: Pre-Warm on a Schedule

This scenario suits businesses with well-known peak hours, for example heavy sandbox creation ahead of 09:00 on workdays. A Cron policy sets the pool target directly ahead of the peak, instead of waiting for available instances to be depleted.

The following example sets the pool to 30 replicas at 08:30 on workdays and back to 5 at 20:00:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: PoolAutoscaler
metadata:
  name: sandbox-pool-schedule   # for identification only, change as needed
  namespace: default            # must be in the same namespace as the target SandboxSet
spec:
  scaleTargetRef:
    apiVersion: agents.kruise.io/v1alpha1
    kind: SandboxSet            # only SandboxSet is supported
    name: sandbox-pool          # MUST REPLACE: the created SandboxSet name
  minReplicas: 2               # platform lower bound; Cron targets are clamped to this range too
  maxReplicas: 50              # platform upper bound; must cover the largest targetReplicas across cron policies
  cronPolicies:
    - name: weekday-peak        # policy name, unique within the same PoolAutoscaler
      timeZone: Asia/Shanghai   # defaults to the controller's timezone when unset; setting it explicitly is recommended
      schedule: "30 8 * * 1-5"  # five-field cron: minute hour day month weekday; here 08:30 on workdays
      targetReplicas: 30        # sets the pool directly to 30 when triggered; must not exceed maxReplicas
    - name: weekday-offpeak
      timeZone: Asia/Shanghai
      schedule: "0 20 * * 1-5"  # shrink back to the night size at 20:00 on workdays
      targetReplicas: 5
```

The `cronPolicies` field uses five-field cron expressions: minute, hour, day of month, month, day of week. When `timeZone` is unset, the controller manager's timezone applies. When triggered, Cron takes priority over the capacity policy and is not subject to the capacity stabilization windows; the final replica count is still clamped to `minReplicas` and `maxReplicas`, and scale-up is also subject to the SandboxSet startup protection (see [Failure Scenario: Scale-Up Throttling, Trigger and Recovery](#failure-scenario-scale-up-throttling-trigger-and-recovery)).

When both are configured, the capacity policy replenishes the pool while no Cron policy is triggered, and the Cron target wins when one triggers. Cron policies set the target replica count directly, unconstrained by capacity watermarks or scale-down reachability, but they still respect scale-up throttling: raising the target while the SandboxSet startup budget is exhausted is also blocked until the budget recovers.

## Failure Scenario: Scale-Up Throttling, Trigger and Recovery

Scale-up throttling is the SandboxSet's startup protection: when too many Sandboxes are failing to start or pending for too long simultaneously, further replica increases are paused to avoid creating more instances that cannot start in a broken state. PoolAutoscaler reads this signal and pauses scale-up.

### What Triggers Throttling

The SandboxSet's `spec.scaleStrategy.maxUnavailable` doubles as the startup budget; when unset it defaults to the current replica count (equivalent to 100%, i.e. no cap on concurrent scale-up). Note that this is a different field from `updateStrategy.maxUnavailable` (for rolling updates, default 20%). Sandboxes in the Creating phase are counted against the budget using two counters:

- **Failed**: Ready condition is `False` with reason `StartContainerFailed` or `PodCreateFailed` — a definitive startup failure (container startup failure, image/config errors, Pod creation API failures, etc.).
- **TimedOut**: stuck in Creating/ResourcePending longer than 50 seconds (the built-in pending timeout) without becoming Ready.

When `Failed + TimedOut >= startup budget`, the SandboxSet writes:

```yaml
status:
  conditions:
    - type: ScalingLimited
      status: "True"
      reason: StartupBudgetExhausted
      message: '2 of 2 startup slots are blocked: Timeout=1, Failed=1'
```

and emits a Warning-level `ScalingLimited` event. On detecting this condition, PoolAutoscaler:

- Pauses scale-up: `status.desiredReplicas` stops rising even when availability is below the lower watermark; while waiting, it periodically emits Normal-level `ScaleBlocked` events.
- Leaves scale-down unaffected: upper-watermark scale-downs proceed as usual.
- The controller fails open: only an explicit `True` reported against the SandboxSet's current generation blocks scaling; a missing, stale, or `Unknown` condition is treated as no signal so upgrades and first-time reconciles do not stall scale-up.

Note the two same-named conditions: this `ScalingLimited` exists in the **SandboxSet** status and means the startup budget is exhausted; the PoolAutoscaler's own `ScalingLimited` (see the CRD field reference) means the desired replica count has hit the `minReplicas`/`maxReplicas` bound — different semantics.

### How Throttling Recovers

Recovery needs no manual intervention; the budget is freed automatically once either happens:

- A failed Sandbox is deleted (manually or by the business side), or its Pod returns to Running and its Ready condition flips to `True`;
- A pending-timed-out Sandbox finishes starting and enters Running, or is deleted.

When `Failed + TimedOut` falls back below the budget, the SandboxSet's next reconciliation flips `ScalingLimited` back to `False`, and PoolAutoscaler resumes scale-up and keeps replenishing the pool.

### Troubleshooting

```bash
# Inspect the throttling state and Timeout/Failed counters
kubectl get sandboxset sandbox-pool -n default -o jsonpath='{.status.conditions[?(@.type=="ScalingLimited")]}'
kubectl describe sandboxset sandbox-pool -n default

# List throttling and blocked events
kubectl get events -n default --field-selector involvedObject.name=sandbox-pool

# List Sandboxes in the pool and their status
kubectl get sandbox -n default -l agents.kruise.io/sandbox-pool=sandbox-pool

# Inspect the Ready condition of a failed instance for the specific reason
kubectl get sandbox <name> -n default -o jsonpath='{.status.conditions[?(@.type=="Ready")]}'
```

Triage based on the counters in `message`:

- **Mostly Failed**: usually image pull failures, resource misconfiguration, or quota exhaustion. Check the failed Sandbox's Ready condition message for the specific reason, fix the SandboxSet configuration, then delete the failed instance:

```bash
kubectl delete sandbox <name> -n default
```

The SandboxSet recreates a new instance automatically; if the configuration is not fixed, the new instance fails again and re-triggers throttling.

- **Mostly TimedOut**: the underlying creation speed cannot keep up with the scaling rate. Lower the SandboxSet's `scaleStrategy.maxUnavailable` to reduce the per-batch creation volume, or contact the cluster administrator to evaluate underlying supply capacity.

## Capacity Policy Parameters and Scale-Down Reachability

The capacity policy computes lower and upper watermarks from "target + tolerance":

- When `targetAvailable` is an absolute number (e.g. `10`): lower watermark = target − tolerance, upper watermark = target + tolerance.
- When `targetAvailable` is a percentage (e.g. `"60%"`): based on the recent average replica count, the target and tolerance percentages are combined first and then rounded up, i.e. lower = ceil(average replicas × (target − tolerance)%), upper = ceil(average replicas × (target + tolerance)%).
- When `tolerance` is unset it defaults to `10%`. For a percentage target it combines as percentages; for an absolute target the default tolerance is 10% of that target rounded up (e.g. tolerance is 1 for target 10, and 2 for target 15).

When average availability drops below the lower watermark it scales up, refilling toward the target; above the upper watermark it scales down; in between it makes no change.

:::caution
Especially avoid `targetAvailable: "100%"`: availability can at most equal the replica count, so it never strictly exceeds the upper watermark. Regardless of tolerance (including 0), an idle pool never scales down — it only grows. Only use a 100% target if you deliberately want a grow-only pool.
:::

### Ensure an Idle Pool Can Shrink to minReplicas

A capacity policy should guarantee that an idle pool shrinks to `minReplicas`; otherwise the pool settles above `minReplicas` and idle resources never get reclaimed to the intended floor. The test is the final scale-down step: at `minReplicas + 1` replicas, the upper watermark must be no greater than `minReplicas` for that step to trigger.

- Absolute target `T` with resolved tolerance `D` (including the default): require `T + D <= minReplicas`. When satisfied, the idle pool's stable size is exactly `minReplicas`.
- Percentage target `p%` with percentage tolerance `q%` (including the default): require `p + q <= 100 × minReplicas / (minReplicas + 1)`. Percentage watermarks shrink with the pool, converging to `minReplicas` when idle.
- Percentage target with absolute tolerance `D`: evaluated at `minReplicas + 1` replicas, require `ceil((minReplicas + 1) × p%) + D <= minReplicas`.
- Absolute target `T` with percentage tolerance `q%`: tolerance resolves as `ceil(T × q%)`, require `T + ceil(T × q%) <= minReplicas`.

Common configurations and their effects:

| minReplicas | targetAvailable | tolerance | Upper watermark at minReplicas+1 | Effect |
| --- | --- | --- | --- | --- |
| 1 | `"40%"` | default (`"10%"`) | 1 | Can shrink from 2 to 1 replica |
| 1 | `"50%"` | default (`"10%"`) | 2 | Upper watermark is 2, settles at 2 replicas |
| 1 | `1` | `0` | 1 | Fixed floor of 1 available Sandbox |
| 1 | `1` | default (`"10%"`) | 2 | Default tolerance lifts the upper watermark to 2, settles at 2 replicas |
| 2 | `"50%"` | default (`"10%"`) | 2 | Can shrink from 3 to 2 replicas (Scenario 1 example) |
| 1 | `"100%"` | any (incl. `0`) | `>= replicas` | Availability at most equals replicas, never exceeds the upper watermark; idle pool never shrinks |
| 4 | `"70%"` | `"10%"` | 4 | Can shrink from 5 to 4 replicas |

Scenario 1 demonstrates the percentage-target style: watermarks stretch with pool size, suited to fluctuating workloads. For a fixed-size pool, switch to an absolute target with `tolerance: 0`, keeping `minReplicas` no smaller than the target. Either way, verify `minReplicas` against the rules above.

If the pool remains above `minReplicas` for a long time and `status.conditions` shows no anomaly, the rules above are usually not met: lower `targetAvailable` or `tolerance`, or raise `minReplicas`, then watch whether `status.desiredReplicas` and `status.currentCapacity.available` converge.

## Parameter Validation Constraints

On create or update, the webhook validates the following rules; violations are rejected (HTTP 422) with the specific reason.

### General Constraints

| Field | Constraint |
| --- | --- |
| `spec.scaleTargetRef.kind` | Only `SandboxSet` is supported. |
| `spec.scaleTargetRef.name` | Required, pointing to an existing SandboxSet in the same namespace. |
| `spec.maxReplicas` | Required and must be greater than 0. |
| `spec.minReplicas` | Must be `>= 0` and no greater than `maxReplicas`. |
| `spec.capacityPolicy` / `spec.cronPolicies` | At least one must be configured; otherwise no policy drives scaling. |
| Namespace uniqueness | A SandboxSet may be managed by only one PoolAutoscaler. |

### Capacity Policy Constraints

| Field | Constraint |
| --- | --- |
| `targetAvailable` | An absolute value must be `>= 0` and `<= maxReplicas` (beyond that the target can never be reached); a percentage must be of the form `"<number>%"` with the number in 0 to 100. |
| Percentage `targetAvailable` | Requires `minReplicas >= 1`; otherwise all watermarks resolve to 0 on an empty pool and the pool cannot bootstrap itself. |
| `tolerance` | Same format constraints as `targetAvailable`; and must be **less than** `targetAvailable` (statically decidable when both are percentages or both are absolute), otherwise the lower watermark is clamped to 0 and scale-up never triggers. For an absolute target with a percentage tolerance, the tolerance percentage must be below 100%. |
| `scaleUp.stabilizationWindowSeconds` | Defaults to 60 seconds when unset; explicit values must be between 60 and 3600 seconds. |
| `scaleDown.stabilizationWindowSeconds` | Defaults to 300 seconds when unset; explicit values must be between 60 and 3600 seconds. |

Scale-down reachability is not a hard validation in the current version, but a bad configuration leaves the pool unable to shrink to `minReplicas`; verify against the rules in [Ensure an Idle Pool Can Shrink to minReplicas](#ensure-an-idle-pool-can-shrink-to-minreplicas).

Cron policy validation rules (at most 20 entries, unique names, valid five-field cron expressions, valid timezones, `targetReplicas >= 0`) are documented in the CRD field reference below and are not repeated here.

## CRD Field Reference

| Field | Description |
| --- | --- |
| `spec.scaleTargetRef` | Reference to the managed SandboxSet; `kind` must be `SandboxSet`, and the target must be in the same namespace as the PoolAutoscaler. |
| `spec.minReplicas` / `spec.maxReplicas` | Lower and upper bounds of the pool. `maxReplicas` must be greater than 0, and `minReplicas` must not exceed `maxReplicas`. The capacity policy must be able to shrink an idle pool to `minReplicas`; see [Capacity Policy Parameters and Scale-Down Reachability](#capacity-policy-parameters-and-scale-down-reachability). |
| `spec.capacityPolicy.targetAvailable` | Target available Sandbox count, as an absolute number or percentage, e.g. `10`, `"60%"`. Percentages are based on the recent average replica count; a percentage target requires `minReplicas: 1` or greater. Values must jointly satisfy scale-down reachability with `tolerance` and `minReplicas`; see [Capacity Policy Parameters and Scale-Down Reachability](#capacity-policy-parameters-and-scale-down-reachability). |
| `spec.capacityPolicy.tolerance` | Allowed deviation from the target, as an absolute number or percentage; defaults to `10%` when unset. For example, with target 10 and tolerance 2: scale up below 8, scale down above 12. Resolution rules and reachability constraints: see [Capacity Policy Parameters and Scale-Down Reachability](#capacity-policy-parameters-and-scale-down-reachability). |
| `spec.capacityPolicy.scaleUp.stabilizationWindowSeconds` | Interval between consecutive scale-ups. Explicit values must be within 60 to 3600 seconds; defaults to 60 seconds. |
| `spec.capacityPolicy.scaleDown.stabilizationWindowSeconds` | Interval between consecutive scale-downs. Explicit values must be within 60 to 3600 seconds; defaults to 300 seconds. |
| `spec.cronPolicies` | List of scheduled policies. At most 20 entries are allowed; validation is enforced by the webhook: `name` is required and unique within the list; `schedule` is required and must be a valid five-field cron expression (minute hour day month weekday); `timeZone` is optional and must be a valid timezone (e.g. `Asia/Shanghai`) when set; `targetReplicas` must be `>= 0` and is clamped to `maxReplicas` when exceeded. |
| `spec.suspend` | Set to `true` to suspend further autoscaling; existing Sandboxes are not deleted. Resume by setting `false` or removing the field. |
| `status.currentReplicas` | The most recently observed replica count of the target SandboxSet. |
| `status.desiredReplicas` | The most recently computed desired replica count. |
| `status.currentCapacity.available` | The most recently observed available Sandbox count. |
| `status.conditions` | `ScalingActive` reports whether the controller is active, `AbleToScale` whether a desired count can be computed and written, `ScalingLimited` whether the replica bound is hit. |
| `status.appliedCronPolicies` | Last successful execution time of each cron policy. |

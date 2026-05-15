# FAQ

## General

### What is OpenKruise Agents?

OpenKruise Agents is a Kubernetes-native sandbox orchestration system designed for AI agent infrastructure. It provides sub-second sandbox delivery through a pre-warming pool mechanism and is compatible with the [E2B](https://e2b.dev/) SDK. It is a sub-project of the [OpenKruise](https://openkruise.io) ecosystem under CNCF.

### What Kubernetes versions are supported?

OpenKruise Agents requires Kubernetes **>= 1.28**. See [Installation](../installation.md) for the full compatibility matrix.

### Which cloud providers are supported?

OpenKruise Agents is cloud-agnostic. It runs on any conformant Kubernetes cluster, including self-managed clusters and managed offerings from Alibaba Cloud, AWS, GCP, Azure, and others. China Mirror images are available from Alibaba Cloud Container Registry for users in restricted network environments. See [Installation — Using China Mirror Registry](../installation.md#using-china-mirror-registry).

### Is OpenKruise Agents compatible with the E2B SDK?

Yes. `sandbox-manager` implements the E2B protocol, so existing code using the `e2b_code_interpreter` or `e2b_desktop` Python SDKs works without modification—just point `E2B_DOMAIN` and `E2B_API_KEY` at your own cluster. See [E2B Client](../user-manuals/e2b-client.md) for configuration details.

---

## Installation & Upgrade

### What is the correct installation order for the components?

Always install **Sandbox Controller first**, then **Sandbox Manager**. The Controller provides the CRDs that the Manager depends on. When uninstalling, reverse the order: uninstall the Manager before the Controller.

### Why aren't CRDs updated automatically during `helm upgrade`?

Helm does not update CRDs located in the `crds/` directory during `helm upgrade` — this is standard Helm behavior. You must manually apply updated CRDs before running `helm upgrade`. For example:

```bash
helm pull openkruise/agents-sandbox-controller --version <new-version> --untar
kubectl apply -f agents-sandbox-controller/crds/
rm -rf agents-sandbox-controller
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system --version <new-version>
```

### What changed in 0.2.0 that requires extra attention during upgrade?

Version 0.2.0 introduced significant CRD changes (new `Checkpoint` CRD, new `runtimes` field, new `updateStrategy` in `SandboxSet`) and an independent `Sandbox Gateway` Deployment. Key upgrade actions:

1. Manually apply the new CRDs before running `helm upgrade`.
2. Specify `ingress.className` explicitly — its default changed from `nginx` to an empty string.
3. Specify `e2b.adminApiKey` explicitly — its default changed from `admin-987654321` to an empty string.
4. Verify Ingress routing: data-plane traffic now routes to `sandbox-gateway` instead of the Manager Service.

See [Upgrading from 0.1.0 to 0.2.0](../installation.md#upgrading-from-010-to-020).

---

## Warm Pool & SandboxSet

### How does the warm pool work?

A `SandboxSet` keeps a pool of pre-created `Sandbox` instances (Pods) in an `available` state. When a sandbox is claimed, one is handed out immediately (sub-second), and `SandboxSet` automatically scales up to replenish the pool. The `replicas` field controls the target pool size and does **not** count already-allocated sandboxes.

### How do I choose the right warm pool size?

Set `replicas` slightly larger than your expected peak burst. For example, if your application claims up to 20 sandboxes within a short window, a pool of 25–30 is a reasonable starting point. Monitor `status.availableReplicas`; if it frequently drops to 0, increase `replicas`.

### What happens if the warm pool is empty when a sandbox is claimed?

The claim waits for a new sandbox to be created and become ready. Delivery time then depends on cluster performance (Pod scheduling, image pull, container startup) rather than sub-second. To avoid this, keep `replicas` large enough for your workload, or use `createOnNoStock: true` to bypass the warm pool entirely.

### How do I update a running SandboxSet without disrupting existing sandboxes?

Update the `SandboxSet` spec. Since v0.2.0, `SandboxSet` supports a rolling update strategy via the `updateStrategy.maxUnavailable` field, which controls how many warm sandboxes may be unavailable at once during an update. Already-allocated (claimed) sandboxes are **not** affected by a SandboxSet update.

---

## Sandbox Claiming

### What is the difference between claiming via E2B SDK and via SandboxClaim CRD?

Both methods claim sandboxes from the same warm pool.

- **E2B SDK** (`e2b_code_interpreter.Sandbox.create(...)`) is the programmatic path, designed for Agent applications that need sandboxes on demand.
- **SandboxClaim CRD** is the declarative Kubernetes path, useful for infrastructure teams managing batch workloads or integrating with GitOps pipelines.

### Can I claim multiple sandboxes at once?

Yes. Set `replicas` on `SandboxClaim` (or use the E2B batch API). Batch claiming is best-effort: sandboxes are delivered gradually as they become available, up to the `claimTimeout`. Use the label `agents.kruise.io/claim-name=<sbc-name>` to list all sandboxes delivered by a claim.

### How do I set a timeout so a sandbox is automatically deleted?

Pass `timeout=<seconds>` to `Sandbox.create()` in the E2B SDK, or set `shutdownTime` (RFC 3339 absolute timestamp) in the `SandboxClaim` spec. To prevent a sandbox from ever timing out, set the extension metadata key `e2b.agents.kruise.io/never-timeout: "true"`.

### Can I inject environment variables into a sandbox?

Yes, via `envs={...}` in the E2B SDK or `envVars` in `SandboxClaim`. Note: these variables are currently passed to `agent-runtime` for initialization and are available only in the `commands.run` API, not as process-level environment variables in the main container.

---

## Networking & Ports

### Which port does agent-runtime use?

`agent-runtime` communicates with `sandbox-manager` and `sandbox-controller` over port **49983**. If your cluster uses firewalls or security groups, ensure this port is open for all Sandbox Pods.

### Why can't I access the remote desktop stream?

Ensure port **6080** is open in your cloud security group. The E2B Desktop SDK streams the remote desktop over this port. See [Running E2B Desktop Sandbox](../best-practices/running-e2b-for-desktop.md).

### What does Sandbox Gateway do, and when should I scale it?

`sandbox-gateway` (introduced in v0.2.0) is an Envoy-based data-plane gateway that proxies traffic to sandbox Pods. It is independently scalable (`gateway.replicaCount`) from the Sandbox Manager. Scale it when you observe high connection counts or latency in the gateway's Envoy metrics.

---

## Troubleshooting

### A sandbox claim is stuck in a non-Completed phase. How do I debug it?

1. Check `kubectl describe sbc <name>` for events and status conditions.
2. Check `kubectl get sbx -l agents.kruise.io/claim-name=<sbc-name>` to see the state of allocated sandboxes.
3. Check sandbox-manager logs: `kubectl logs -n sandbox-system -l app=sandbox-manager`.
4. If the sandbox Pod exists but is not becoming ready, check `kubectl describe pod <sandbox-pod>` for scheduling or image pull errors.

### How do I preserve a failed sandbox for debugging?

Set the metadata key `e2b.agents.kruise.io/reserve-failed-sandbox: "true"` in the E2B SDK, or set `reserveFailedSandbox: true` in `SandboxClaim`. By default, failed sandbox instances are deleted and a retry is attempted.

### The Helm uninstall removed the controllers but Sandbox Pods are still running. Is this expected?

Yes. `helm uninstall` does not delete CRDs, Sandbox CRs, or the `sandbox-system` namespace. The running Pods belong to Sandbox CRs that still exist. To fully clean up, delete the CRDs manually (which cascades to all CRs and their Pods) and then delete the namespace:

```bash
kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd
kubectl delete ns sandbox-system
```

> **Warning**: Deleting CRDs is irreversible and destroys all sandbox instances.

---

## Contributing

### How do I contribute to OpenKruise Agents?

See the [Contribution Guide](./contribution.md) for development setup, code style, and the pull request process. You can also join the community DingTalk group (ID: 44862615) or reach the maintainers via the [OpenKruise GitHub organization](https://github.com/openkruise).

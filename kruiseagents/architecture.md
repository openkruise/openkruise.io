---
title: Architecture
---

The overall architecture of OpenKruise Agents is shown as below:

![alt](/img/kruiseagents/architecture.png)

## sandbox-manager

`sandbox-manager` is a stateless backend management component. It serves the E2B-compatible
northbound API and owns sandbox lifecycle, quota, and route & traffic-token orchestration.

## sandbox-controller

`sandbox-controller` contains a group of controllers responsible for the reconciliation of
resources such as Sandbox, SandboxSet, SandboxClaim and warm pools. It also provides the
admission webhooks for the related CRD resources.

## sandbox-gateway

`sandbox-gateway` is the data plane, built as Envoy Go filters:

- The ingress gateway proxies user traffic to the sandboxes, with host/path routing,
  access tokens and wake-on-traffic.
- The egress gateway proxies outbound sandbox traffic with policy-enforced L7 egress.

## agent-runtime

`agent-runtime` is a sidecar injected into the Sandbox that provides utility services for the
sandbox, including E2B envd-compatible command, file and port (49983) operations.

## traffic-proxy

`traffic-proxy` is a sidecar that acts as the in-pod L4 enforcement point for egress traffic
policies.

## csi

The CSI sidecar provides on-demand storage mounts for the sandbox.

## traffic-control-plane

The traffic control plane configures and enforces egress policy:

- `istiod` distributes xDS configuration to the gateways and the in-pod proxies.
- The egress policy enforcer applies L7 policy, MCP ACL and token injection on egress traffic.

# API

OpenKruise Agents exposes northbound APIs in two forms: the E2B-compatible API and the
Kubernetes API (CRDs).

## K8S APIs

OpenKruise Agents provides  **Kubernetes API** in the forms of CRD，and they're targeting for platform builders and infrastructure teams.
They cover the core sandbox resources (Sandbox, SandboxSet, SandboxClaim, SandboxTemplate,
PoolAutoscaler, SandboxUpdateOps, Checkpoint) as well as traffic and security policy resources
(TrafficPolicy, GlobalTrafficPolicy, SecurityProfile, GlobalSecurityProfile).

```shell script
$ kubectl get crd | grep kruise.io
checkpoints.agents.kruise.io                             2026-05-19T03:49:36Z
commits.agents.kruise.io                                 2026-05-19T03:49:36Z
globalsecurityprofiles.agents.kruise.io                  2026-05-19T03:49:36Z
globaltrafficpolicies.agents.kruise.io                   2026-05-19T03:49:36Z
poolautoscalers.agents.kruise.io                         2026-05-19T03:49:36Z
sandboxclaims.agents.kruise.io                           2026-05-19T03:49:36Z
sandboxes.agents.kruise.io                               2026-05-19T03:49:36Z
sandboxsets.agents.kruise.io                             2026-05-19T03:49:37Z
sandboxtemplates.agents.kruise.io                        2026-05-19T03:49:37Z
sandboxupdateops.agents.kruise.io                        2026-05-19T03:49:37Z
securityprofiles.agents.kruise.io                        2026-05-19T03:49:37Z
trafficpolicies.agents.kruise.io                         2026-05-19T03:49:37Z
```

## E2B APIs
OpenKruise Agents provides E2B protocol-compatible APIs

### E2B Compatibility

> ⚠️ **Important**: The `commands.run` (command execution) and file system `read/write` APIs require the `agent-runtime` component to be injected into the Sandbox. Please ensure that your SandboxSet has configured `runtimes: [{name: agent-runtime}]`. For details, refer to the [Runtime Injection](./user-manuals/runtime-injection.md) documentation.

| API Category         | API                                                    | Compatibility Level  | Notes                                                                                                               |
|----------------------|--------------------------------------------------------|----------------------|---------------------------------------------------------------------------------------------------------------------|
| Lifecycle Management | create                                                 | Partially Compatible | Network access control is supported; see [E2B Network Controls](./user-manuals/security/e2b-network-controls.md). Resource management implementation pending. |
|                      | get\_info                                              | Fully Compatible     |                                                                                                                     |
|                      | list                                                   | Fully Compatible     |                                                                                                                     |
|                      | kill                                                   | Fully Compatible     |                                                                                                                     |
|                      | pause                                                  | Fully Compatible     | Due to container ecosystem efficiency considerations, current pause implementation is asynchronous                  |
|                      | resume                                                 | Fully Compatible     |                                                                                                                     |
|                      | connect                                                | Fully Compatible     |                                                                                                                     |
|                      | set\_timeout                                           | Fully Compatible     | Set the sandbox timeout (TTL), equivalent to E2B's `Refresh sandbox` API                                           |
| Code Execution       | run\_code                                              | Fully Compatible     | Requires e2b-code-interpreter running in main container                                                             |
| Command Execution    | commands.run                                           | Fully Compatible     | Requires runtime injection of agent-runtime component                                                               |
| File System          | read/write                                             | Fully Compatible     | Requires runtime injection of agent-runtime component                                                               |
|                      | upload\_url/download\_url                              | Not Supported        | Upload/download via pre-signed URL implementation pending                                                           |
| Logs                 | logs                                                   | Not Supported        | Sandbox logs retrieval implementation pending                                                                       |
| Metrics              | metrics                                                | Not Supported        | Sandbox metrics retrieval implementation pending                                                                    |
| Network              | network                                                | Partially Compatible | `allowOut`, `denyOut`, and `rules` are supported; `egressProxy` and `maskRequestHost` are rejected. See [E2B Network Controls](./user-manuals/security/e2b-network-controls.md). |
| Lifecycle Events     | `https://api.e2b.app/events/sandboxes/{sbx.sandbox_id}` | Not Supported        | Lifecycle events implementation pending                                                                             |
| Snapshot Management  | snapshots                                              | Fully Compatible     | Specific snapshot behavior depends on Checkpoint implementation                                                     |
| Template Management  |                                                        | Partially Compatible | Template read supported, template write is not supported by design, recommend using container images as alternative |
| API Keys Management  | teams, api-keys                                        | Fully Compatible     | OpenKruise Agents extension: multi-tenant API key management with team-based access control                        |
| Volumes              | volumes                                                | Not Supported        | Persistent volume management implementation pending                                                                 |

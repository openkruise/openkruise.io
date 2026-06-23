---
title: Architecture
---

The overall architecture of OpenKruise Agents is shown as below:

![alt](/img/kruiseagents/architecture.png)

## sandbox-manager

`sandbox-manager` is a stateless backend management component that provides E2B APIs and MCP APIs for
managing and operating sandbox instances.

## sandbox-gateway

`sandbox-gateway` is a lightweight and efficient gateway that proxy incoming traffic to the sandboxes, `sandbox-gateway` is built as an envoy filter.

## sandbox-controller
`sandbox-controller` contains a group of controllers responsible for the reconcilation of resources such as sandboxset and sandboxclaim, it also provides the admission webhooks for related CRD resources。

## agent-runtime

`agent-runtime` is a Sidecar injected into the Sandbox that provides utilty services for the sandbox,
including E2B envd-compatible command and file operations, dynamic CSI mounting, etc.

# API

OpenKruise Agents provides K8S, E2B and MCP apis.

## K8S APIs

OpenKruise Agents provides  **Kubernetes API** in the forms of CRD，and they're targeting for platform builders and infrastructure teams.

```shell script
$ kubectl get crd | grep kruise.io
checkpoints.agents.kruise.io                             2026-05-19T03:49:36Z
sandboxclaims.agents.kruise.io                           2026-05-19T03:49:36Z
sandboxes.agents.kruise.io                               2026-05-19T03:49:36Z
sandboxsets.agents.kruise.io                             2026-05-19T03:49:37Z
sandboxtemplates.agents.kruise.io                        2026-05-19T03:49:37Z
sandboxupdateops.agents.kruise.io                        2026-05-19T03:49:37Z
```

## E2B APIs
OpenKruise Agents provides E2B protocol-compatible APIs

### E2B Compatibility

> ⚠️ **Important**: The `commands.run` (command execution) and file system `read/write` APIs require the `agent-runtime` component to be injected into the Sandbox. Please ensure that your SandboxSet has configured `runtimes: [{name: agent-runtime}]`. For details, refer to the [Runtime Injection](./user-manuals/runtime-injection.md) documentation.

| API Category         | API                                                    | Compatibility Level  | Notes                                                                                                               |
|----------------------|--------------------------------------------------------|----------------------|---------------------------------------------------------------------------------------------------------------------|
| Lifecycle Management | create                                                 | Partially Compatible | Network access control and resource management implementation pending                                               |
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
| Network              | network                                                | Not Supported        | Sandbox network configuration (egress rules) implementation pending                                                 |
| Lifecycle Events     | `https://api.e2b.app/events/sandboxes/{sbx.sandbox_id}` | Not Supported        | Lifecycle events implementation pending                                                                             |
| Snapshot Management  | snapshots                                              | Fully Compatible     | Specific snapshot behavior depends on Checkpoint implementation                                                     |
| Template Management  |                                                        | Partially Compatible | Template read supported, template write is not supported by design, recommend using container images as alternative |
| API Keys Management  | teams, api-keys                                        | Fully Compatible     | OpenKruise Agents extension: multi-tenant API key management with team-based access control                        |
| Volumes              | volumes                                                | Not Supported        | Persistent volume management implementation pending                                                                 |

---
title: Architecture
---

The overall architecture of OpenKruise Agents is shown as below:

![alt](/img/kruiseagents/architecture.svg)

### sandbox-manager

`sandbox-manager` is a stateless backend management component that provides E2B APIs and MCP APIs for
managing and operating sandbox instances.

### sandbox-gateway

`sandbox-gateway` is a lightweight and efficient gateway that proxy incoming traffic to the sandboxes, `sandbox-gateway` is built as an envoy filter.

### sandbox-controller
`sandbox-controller` contains a group of controllers responsible for the reconcilation of resources such as sandboxset and sandboxclaim, it also provides the admission webhooks for related CRD resources。

### agent-runtime

`agent-runtime` is a Sidecar injected into the Sandbox that provides utilty services for the sandbox,
including E2B envd-compatible command and file operations, dynamic CSI mounting, etc.

## API

OpenKruise Agents provides K8S, E2B and MCP apis.

### K8S APIs

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

### E2B APIs
OpenKruise Agents provides E2B protocol-compatible APIs

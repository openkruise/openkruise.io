---
id: sandbox-access
title: Accessing Sandboxes
---

# Accessing Sandboxes

Once a Sandbox is delivered (see [Sandbox Claim](./sandbox-claim.md)), clients send traffic into it to run code,
execute commands, read and write files, or reach a service listening on a port inside the Sandbox. This page explains
how inbound traffic reaches a Sandbox, which credentials protect it, and the three SDKs you can use to connect, plus
how to port-forward traffic to your local machine for debugging.

For domain, TLS, and multi-domain deployment details, see [Using the E2B SDK](./e2b-client.md). This page focuses on
the access path itself and links there instead of repeating it.

## Inbound Traffic Architecture

OpenKruise Agents splits inbound traffic into a **control plane** and a **data plane** so that a control-plane problem
never interrupts traffic that is already flowing to running Sandboxes.

| Plane | Component | Responsibility | Native address | Private-protocol address |
|-------|-----------|----------------|----------------|--------------------------|
| Control | `sandbox-manager` | E2B/MCP management APIs: create, kill, pause, resume, connect, list, API keys | `api.<domain>` | `<domain>/kruise/api` |
| Data | `sandbox-gateway` | Proxies traffic into a running Sandbox (envoy filter) | `<port>-<sandboxID>.<domain>` | `<domain>/kruise/<sandboxID>/<port>` |

```text
                          Control plane (management)
   E2B / Runtime SDK ───────► api.<domain> ──► sandbox-manager ──► Kubernetes API
                                                     │
                                                     │ delivers / looks up Sandbox
                                                     ▼
                          Data plane (into the Sandbox)
   E2B / Runtime SDK ───► <port>-<sandboxID>.<domain> ──► sandbox-gateway ──► agent-runtime (envd) : 49983
```

- The **control plane** authenticates with an [API key](./api-keys-and-teams.md) and returns the Sandbox address and
  its data-plane credentials.
- The **data plane** carries the actual command, file, code-execution, and custom-service traffic. `sandbox-gateway`
  routes each request to the target Sandbox and, by default, to the `agent-runtime` (envd) sidecar listening on port
  `49983`. Commands and file operations require `agent-runtime` to be injected; see
  [Runtime Injection](./runtime-injection.md).
- When control-plane requests arrive at `sandbox-gateway`, it forwards them to `sandbox-manager`. The gateway Service
  therefore works as a single entrypoint for both planes on port `7788`.

### Routing on the data plane

`sandbox-gateway` resolves the target Sandbox in priority order:

1. **Header-based (preferred).** Set `e2b-sandbox-id` (required) and `e2b-sandbox-port` (optional, defaults to the
   envd port `49983`). Header routing does not depend on DNS wildcard resolution and is what the SDKs use under the
   hood.
2. **Domain-based (fallback).** The native hostname `<port>-<sandboxID>.<domain>`, or the private-protocol path
   `<domain>/kruise/<sandboxID>/<port>`.

`<sandboxID>` is `namespace--name` by default, or the opaque short ID when
[Short Sandbox IDs](./sandbox-id.md) are enabled. Treat it as an exact-match opaque value.

> Native hostname-based routing needs wildcard DNS (`*.<domain>`) and a wildcard certificate. The private protocol
> needs only a single domain and a single certificate, which lowers the deployment barrier for testing and fast
> integration.

## Access Credentials

Different credentials protect different planes. All of them are treated as secrets: do not log them or store them in
Sandbox metadata.

| Credential | Protects | Header / env | Source |
|------------|----------|--------------|--------|
| API key | Control plane | `X-API-KEY` header, `E2B_API_KEY` env | Bootstrapped as `adminApiKey`, or issued per team via the [API key endpoints](./api-keys-and-teams.md) |
| envd access token | Data plane (static) | `X-Access-Token` | Returned in the create response as `envdAccessToken`; tied to the Sandbox lifecycle |
| Traffic access token | Data plane (JWT) | `E2B-Traffic-Access-Token` | Short-lived, refreshable JWT; see [Traffic Access Token Rotation](./security/traffic-access-token.md) |
| Runtime token | Data plane (direct envd) | `X-Access-Token` | Stored on the Sandbox CR annotation `agents.kruise.io/runtime-access-token` |

- **API key.** Every management call to `sandbox-manager` sets `X-API-KEY`. The native E2B SDK reads it from
  `E2B_API_KEY`. The admin key has elevated privileges; prefer scoped per-team keys for daily work. E2B SDK >= 2.25.0
  validates the `e2b_[0-9a-f]+` key format client-side; see
  [API Keys and Teams](./api-keys-and-teams.md#e2b-sdk-key-format-compatibility) for legacy-key handling.
- **envd access token (static).** A long-lived opaque token bound to the Sandbox. The native E2B SDK injects it
  automatically for `run_code`, `commands`, and `files` calls, so most clients never handle it directly. It stays
  valid until the Sandbox is deleted.
- **Traffic access token (JWT).** An optional, short-lived, refreshable replacement for the static token, enabled per
  Sandbox. It limits replay exposure to the JWT validity window. Refresh behavior and client requirements are covered
  in [Traffic Access Token Rotation](./security/traffic-access-token.md).
- **Runtime token.** Used only by the [Runtime SDK](#3-runtime-sdk-direct-envd), which talks to envd directly. The
  runtime client can read it straight from the Sandbox CR annotation when it has kubeconfig or in-cluster access.

## Access Methods

Choose an SDK by how you deploy and how much of the E2B surface you need.

| Method | Package | Routing | Best for |
|--------|---------|---------|----------|
| Native E2B SDK | `e2b`, `e2b-code-interpreter` | Domain / header | Standard production integration, full E2B API |
| Private-protocol SDK | `kruise_agents.patch_e2b` | Path (`/kruise/...`) | Single-domain deployment, testing, fast integration |
| Runtime SDK | `github.com/openkruise/agents-api/runtime` | Direct envd | Command and file operations straight against a running Sandbox |

Install the Python clients:

```bash
# Native E2B SDK
pip install "e2b" "e2b-code-interpreter"

# OpenKruise Agents private-protocol extension, from the agents-api repository.
# Replace <version> with an agents-api release tag.
pip install "git+https://github.com/openkruise/agents-api.git@<version>#subdirectory=e2b/python"
```

### 1. Native E2B SDK

The standard integration. The client resolves the Sandbox from the control plane and sends data-plane traffic through
`*.<domain>` (or the equivalent headers). Set the domain and API key, then use the SDK as usual:

```shell
export E2B_DOMAIN=your.domain.com
export E2B_API_KEY=<your-api-key>
```

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="code-interpreter")
print("sandbox id:", sbx.sandbox_id)

execution = sbx.run_code("print('hello, world')")
print("run code result:", execution)

# URL of a service listening on port 8000 inside the Sandbox
print(sbx.get_host(8000))

sbx.kill()
```

The `envdAccessToken` is returned automatically and injected into `run_code`, `commands`, and `files` calls, so no
manual token handling is required. Native deployments need wildcard DNS and a wildcard certificate; see
[Using the E2B SDK](./e2b-client.md#1-integration-using-native-protocol).

### 2. Private-protocol SDK

The private protocol keeps a single domain and routes by path (`<domain>/kruise/<sandboxID>/<port>`), so you only need
one certificate. Apply the patch **before** importing the E2B Sandbox class:

```shell
export E2B_DOMAIN=your.domain.com
export E2B_API_KEY=<your-api-key>
```

```python
from kruise_agents.patch_e2b import patch_e2b
patch_e2b(https=True)   # HTTPS from outside the cluster

from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="code-interpreter")
execution = sbx.run_code("print('hello, world')")
print(execution)
sbx.kill()
```

- Use `patch_e2b(https=False)` for in-cluster or local port-forward access where TLS is terminated elsewhere.
- To reuse a legacy (non-`e2b_`) API key with E2B SDK >= 2.25.0, pass `validate_key=False`:
  `patch_e2b(https=True, validate_key=False)`.
- For automatic JWT refresh, add the traffic-token patch after `patch_e2b`; see
  [Traffic Access Token Rotation](./security/traffic-access-token.md).

### 3. Runtime SDK (direct envd)

The Runtime SDK bypasses the E2B protocol and operates the envd service inside a running Sandbox directly, for command
execution and file operations. It uses only `Scheme` + `Domain` (no protocol path) and authenticates with the runtime
token via `X-Access-Token`. This is a Go client; see
[Runtime Client](../developer-manuals/runtime-client.md) for the full API and
[Runtime Client (Java)](../developer-manuals/runtime-client-java.md) for the Java binding.

```go
package main

import (
	"context"
	"fmt"

	"github.com/openkruise/agents-api/runtime"
)

func main() {
	ctx := context.Background()

	// In-cluster: "sandbox-gateway.sandbox-system.svc:7788"
	// Local debugging: "127.0.0.1:7788" (after port-forward)
	domain := "sandbox-gateway.sandbox-system.svc:7788"

	// NewFromK8s resolves sandboxID and the runtime token from the Sandbox CR
	// annotation agents.kruise.io/runtime-access-token.
	c, err := runtime.NewFromK8s(ctx, "default", "your-sandbox-name",
		runtime.WithDomain(domain),
	)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	res, _ := c.Commands.Run(ctx, "uname -a")
	fmt.Println(res.Stdout)
}
```

When you do not have kubeconfig access, build the client with `runtime.New` and pass the token explicitly with
`runtime.WithRuntimeToken(<token>)`.

## Port-Forward for Local Debugging

Port-forwarding maps a cluster Service to `localhost` so you can iterate from your workstation without public DNS or a
certificate.

### E2B / private-protocol clients

`sandbox-gateway` forwards control-plane requests to `sandbox-manager`, so forwarding the gateway Service alone covers
both planes. Point the E2B URL parameters at the single local address (see
[Using the E2B SDK](./e2b-client.md#3-external-access-using-e2b-url-parameters)):

```shell
export E2B_API_KEY=<your-api-key>
# One forward covers both planes: the gateway passes control traffic to sandbox-manager.
export E2B_API_URL="http://localhost:7788"
export E2B_SANDBOX_URL="http://localhost:7788"

kubectl port-forward services/sandbox-gateway 7788:7788 -n sandbox-system
```

```python
from e2b import Sandbox

sbx = Sandbox.create(template="code-interpreter")
print(sbx.commands.run("echo hello").stdout)   # data plane via the forwarded gateway
sbx.kill()
```

:::note
The upper-level `e2b-code-interpreter` and `e2b-desktop` libraries do not read `E2B_API_URL` / `E2B_SANDBOX_URL`, so
use the base `e2b` Sandbox for this local-debugging setup.
:::

### Runtime SDK clients

The same forward works here; point the client at the local address:

```shell
kubectl port-forward services/sandbox-gateway 7788:7788 -n sandbox-system
```

```go
c, _ := runtime.NewFromK8s(ctx, "default", "your-sandbox-name",
	runtime.WithDomain("127.0.0.1:7788"),
	runtime.WithScheme("http"),
)
```

## Related Documentation

- [Using the E2B SDK](./e2b-client.md) — domains, TLS, multi-domain, and all integration modes
- [API Keys and Teams](./api-keys-and-teams.md) — control-plane credentials and key management
- [Traffic Access Token Rotation](./security/traffic-access-token.md) — JWT data-plane tokens and refresh
- [E2B Network Controls](./security/e2b-network-controls.md) — outbound restrictions and header transforms
- [Runtime Injection](./runtime-injection.md) — enabling `agent-runtime` for command and file APIs
- [Runtime Client](../developer-manuals/runtime-client.md) — full Runtime SDK reference

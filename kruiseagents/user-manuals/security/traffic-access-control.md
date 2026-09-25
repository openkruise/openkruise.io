---
id: traffic-access-control
title: Traffic Access Control
---

# Traffic Access Control

Sandboxes execute agent-generated and often untrusted code, so their outbound traffic needs explicit control.
OpenKruise Agents separates egress control into two policy layers: `TrafficPolicy` decides at L3/L4 whether a
destination is reachable, and `SecurityProfile` inspects individual HTTP requests at L7. See
[Architecture](../../architecture.md) for the component model behind them.

## How Enforcement Works

A Sandbox with the TrafficProxy sidecar has its outbound traffic captured and evaluated before it leaves the cluster:

```text
Sandbox application container
  -> TrafficProxy in-pod capture
  -> egress gateway chosen by egress routing
  -> Envoy external processing
  -> Egress Policy Enforcer decision
  -> external service, or a blocked response
```

The Egress Policy Enforcer (EPE) compiles `TrafficPolicy` and `GlobalTrafficPolicy` and distributes them to the data
plane, so a rejected destination is dropped before the gateway. EPE also evaluates `SecurityProfile` and
`GlobalSecurityProfile`, and the egress gateway calls it only for gateway-routed HTTP requests. Requests on the direct
passthrough path never reach EPE, and EPE cannot override a `TrafficPolicy` rejection.

## Enroll a Sandbox

Traffic inspection is a runtime contract rather than an annotation. Add the `traffic-proxy` runtime, which injects the
TrafficProxy sidecar, to a Sandbox, or to the SandboxTemplate or SandboxSet it derives from:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: traffic-sample
  namespace: default
spec:
  runtimes:
    - name: traffic-proxy
  template:
    metadata:
      labels:
        app: traffic-sample
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

The `traffic-proxy` entry in the `sandbox-injection-config` ConfigMap defines what the runtime injects, so confirm that
your distribution provides it before you reference the runtime. See [Runtime Injection](../runtime-injection.md) for
how runtimes are declared and propagated.

Policy selectors match the Sandbox's effective labels. A pooled Sandbox is published as a policy subject only while it
is claimed, and a binding is accepted only when the Pod UID reported by the data plane matches the identity derived
from the Sandbox; ambiguous or stale bindings fail closed.

## Layer 4 Destination Control

`TrafficPolicy` selects calling Pods and holds an ordered egress rule list. Every egress rule must declare `to`, and
may declare `action` (`allow` or `reject`) and a `ports` list. A peer accepts `fqdn`, `cidr`, `service`, or
`workload`, and multiple peers are ORed.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: TrafficPolicy
metadata:
  name: sandbox-egress
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  egress:
    rules:
      - action: allow
        to:
          - service:
              name: kube-dns
              namespace: kube-system
      - action: allow
        to:
          - fqdn: api.example.com
      - action: reject
        ports:
          - protocol: TCP
            port: 443
        to:
          - cidr: 10.0.0.0/8
```

Once a policy selects a Pod, outbound traffic that matches no allow rule is rejected. A rule missing its peer field is
skipped by the compiler and does not establish a default deny. Always allow the cluster DNS Service, otherwise
hostname resolution fails. The `spec` requires at least one of `ingress` or `egress`.

## Layer 7 Request Control

`SecurityProfile` matches HTTP requests and applies actions. `spec.selector` is required and selects calling Pods, not
the external service; an empty selector matches every Pod in the namespace.

Each rule has a unique `name`, at least one `match` clause, and `actions`. Clauses in `match` are ORed, and every
populated field inside one clause is ANDed. `domains` is required in each clause:

| Field | Behavior |
| --- | --- |
| `domains` | `*` matches any host. `*.example.com` matches subdomains but not `example.com`. Host matching is case-insensitive. |
| `paths` | ORed. `Prefix` is the default; `Exact` and RE2 `Regex` are supported. The query string is excluded. |
| `methods` | ORed and case-insensitive. |
| `ports` | ORed. Uses the authority port, then the inferred HTTP/HTTPS port, then the destination port. Port `0` never matches a non-empty list. |
| `schemes` | ORed and case-insensitive, such as `http` and `https`. |
| `headers` | ANDed. Names are lowercased; `Exact` is the default, with `Prefix` and RE2 `Regex`. |
| `queryParams` | ANDed. Values are percent-decoded, and only the first value of a repeated key is considered. |

Available actions:

| Action | Terminal | Behavior |
| --- | --- | --- |
| `block` | Yes | Returns `statusCode` (default `403`) with an optional `body` without forwarding upstream, and discards pending mutations. |
| `bypass` | Yes | Forwards the request and skips every remaining action and rule, preserving mutations already applied. |
| `mcpToolPolicy` | No | Allows or denies MCP JSON-RPC `tools/call` requests by tool name. |
| `headerManipulation` | No | Sets or removes plaintext request headers. Values are stored verbatim, so do not use it for credentials. |
| `tokenTransformation` | No | Rewrites a request credential from a Secret or a credential provider. Governed by `failStrategy`, which defaults to `Block`. |
| `audit` | No | Sends an asynchronous webhook event and never changes the request decision. |

## Evaluation Order

Matching profiles are merged into one order: lower `spec.priority` first (default `1000`), then earlier creation time,
name, and namespace. Global and namespaced profiles share this order, and an exact tie places the global profile first
because its namespace is empty.

EPE then evaluates every matching rule from the first profile through the last, preserving rule order inside each
profile. Matching is not first-rule-wins, so a later rule can still match after a broad earlier rule. A terminal action
stops the remaining chain.

Within one rule, actions run in the fixed registration order `bypass`, `block`, `mcpToolPolicy`,
`headerManipulation`, then `tokenTransformation`; YAML key order does not change it. Keep a terminal action in a
separate rule when a transformation must run before a later policy decision. `audit` is not part of this chain: it runs
at stream end after the final decision is known.

## Cluster-Wide Policy

`GlobalSecurityProfile` has the same `spec` but is cluster-scoped and can select Pods in every namespace. Use it for
centrally owned baselines, and set `priority` deliberately because it competes in the same order as namespaced
profiles. Do not set `metadata.namespace`.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: GlobalSecurityProfile
metadata:
  name: cluster-baseline
spec:
  selector:
    matchLabels:
      app: traffic-sample
  priority: 50
  rules:
    - name: deny-metadata-endpoint
      match:
        - domains:
            - metadata.internal
      actions:
        block:
          statusCode: 403
          body: '{"error":"metadata endpoint is blocked by the cluster baseline"}'
```

Because a global profile has no namespace of its own, a ConfigMap input must specify one, and a Secret credential
reference without a namespace falls back to each selected Pod's namespace. `GlobalTrafficPolicy` is the equivalent
cluster-scoped L4 resource.

## Common Scenarios

### Block Management Paths

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: deny-management-paths
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: deny-management-paths
      match:
        - domains:
            - "*"
          paths:
            - type: Prefix
              value: /admin
            - type: Prefix
              value: /console
            - type: Prefix
              value: /dashboard
      actions:
        block:
          statusCode: 403
          body: '{"error":"management paths are blocked"}'
```

### Prevent Access to Internal Endpoints

Prompt-injected code commonly attempts server-side request forgery against internal services and metadata endpoints.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: deny-internal-endpoints
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: deny-internal-and-metadata
      match:
        - domains:
            - "*.internal.company.com"
            - "*.corp.net"
            - metadata.internal
      actions:
        block:
          statusCode: 403
          body: '{"error":"access to internal services is forbidden"}'
```

### Enforce Read-Only Access

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: read-only-egress
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: read-only-mode
      match:
        - domains:
            - "*"
          methods:
            - POST
            - PUT
            - DELETE
            - PATCH
      actions:
        block:
          statusCode: 405
          body: '{"error":"write operations are not allowed in read-only mode"}'
```

### Allowlist Domains

Combine `bypass` and `block` in one rule chain. The allowlist rule must come before the catch-all rule.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: domain-allowlist
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: allow-public-api
      match:
        - domains:
            - api.example.com
            - "*.cdn.example.com"
      actions:
        bypass: true
    - name: deny-all
      match:
        - domains:
            - "*"
      actions:
        block:
          statusCode: 403
          body: '{"error":"access denied: domain is not in the allowlist"}'
```

`bypass` preserves mutations from actions that already ran, so it is not a general-purpose allow rule. Prefer
`TrafficPolicy` when the intent is destination reachability rather than skipping later L7 inspection.

### Restrict MCP Tool Calls

`mcpToolPolicy` governs only JSON-RPC `tools/call` and matches the exact `params.name` tool name. Other methods,
including `tools/list` and `initialize`, pass through.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: mcp-tool-whitelist
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: protect-mcp-tools
      match:
        - domains:
            - mcp.example.com
          schemes:
            - https
          paths:
            - type: Prefix
              value: /mcp
      actions:
        mcpToolPolicy:
          defaultAction: deny
          unsupportedVersionAction: deny
          denyResponse:
            statusCode: 403
            body: MCP tool is not permitted
          rules:
            - method: tools/call
              toolNames:
                - read_file
                - search_docs
              action: allow
```

Rules are considered in document order and the first match wins. An empty `toolNames` list matches every tool name for
that method. Use `defaultAction: deny` for a whitelist: with `defaultAction: allow`, an unreadable body or an
unnameable tool call is allowed by design.

### Audit Blocked Requests

Audit actions belong to `SecurityProfile` and `GlobalSecurityProfile`, never to `TrafficPolicy`: they record the
outcome of L7 rule evaluation. The profile-level `audit` list is inherited by every matched rule, and a non-empty
`rules[].actions.audit` list replaces the inherited list for that rule.

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: audit-blocked-admin
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  audit:
    - name: blocked-request
      when: result == "blocked"
      webhook:
        url: https://audit-receiver.example.com/v1/events
        timeout: 2s
        request:
          method: POST
          headers:
            - name: X-Audit-Type
              value: blocked-request
          body:
            json:
              result: "{{ .Result }}"
              profile: "{{ .Profile.Name }}"
              rule: "{{ .Rule.Name }}"
              host: "{{ .Request.Host }}"
              path: "{{ .Request.Path }}"
              method: "{{ .Request.Method }}"
  rules:
    - name: deny-admin
      match:
        - domains:
            - api.example.com
          methods:
            - GET
          paths:
            - type: Exact
              value: /admin
      actions:
        block:
          statusCode: 403
          body: request blocked by policy
```

The `when` condition is CEL and sees the final `result` (`passthrough`, `mutated`, `blocked`, `bypassed`, or `error`)
plus `request`, `pod`, `profile`, `rule`, and `response`; an omitted `when` always fires. Webhook bodies render string
leaves as Go templates over the same data.

Events are rendered after the final decision and delivered asynchronously. EPE does not retry: a full queue, a render
failure, or a body over 64 KiB drops the event, and a failed delivery never changes the request decision. Timeouts
default to `2s` and are limited to `500ms` through `30s`.

## Per-Sandbox Rules

A rule chain can be attached to one Sandbox through the `agents.kruise.io/security-rules` annotation, which holds the
same rule objects as `spec.rules`. Per-Sandbox rules are evaluated after the selector-matched profiles. The E2B create
API exposes the annotation through the reserved `e2b.agents.kruise.io/security-rules` metadata key; see
[E2B Network Controls](./e2b-network-controls.md).

Per-Sandbox rules obey the same compile contract as a profile. A Sandbox whose annotation fails to compile keeps its
previous rules when it has any and enforces none otherwise, reported by the `epe_profile_stale` and
`epe_profile_unenforced` metrics under `scope="pod"`.

## Limitations

- EPE applies only to gateway-routed traffic. A request on the direct passthrough path is never inspected, and a
  `SecurityProfile` cannot force it to visit EPE.
- HTTPS inspection requires the gateway to terminate TLS for that host, a configured signing CA, and a workload that
  trusts the CA. Otherwise the connection stays on the gateway's TCP path and bypasses the HTTP filter chain.
- EPE needs the caller identity that the gateway sends as external-processing attributes. If that identity is absent,
  EPE cannot select a profile and the request passes through unmodified. Validate enforcement with real traffic rather
  than with `kubectl get`.
- Every compile-time error rejects the new profile version and retains the last known good one. Without a previous
  valid version, the selected Pods have no protection from that profile.
- Containers running as root or with capabilities such as `NET_ADMIN` or `SYS_ADMIN` can bypass the ACLs. Isolate
  Sandboxes with independent network isolation in addition to the egress policy, such as Kubernetes network policies,
  host firewall rules, or cloud security group rules that restrict Sandbox egress at the infrastructure layer.
- The TrafficProxy sidecar reserves ports `15001`, `15006`, `15012`, `15020`, `15021`, and `15090`, and runs as
  UID/GID `1337`. Sandbox containers must not bind these ports, and outbound traffic from UID `1337` skips inspection
  to avoid a self-interception loop.
- Clients can forge a `Host` header to evade L4 rules. Mitigate this by explicitly denying the sensitive domains in a
  `SecurityProfile`.
- `mcpToolPolicy` buffers the complete request body. Decoded bodies over 8 MiB, JSON-RPC batches, and unsupported
  content encodings are unreadable and follow `defaultAction`. Supported MCP protocol versions are `2025-06-18`,
  `2025-11-25`, and `2026-07-28`.
- EPE is a network hop on every gateway-routed request, so size its Deployment independently of the gateway and
  monitor its logs and metrics.

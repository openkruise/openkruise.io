---
id: e2b-network-controls
title: E2B Network Controls
---

# E2B Network Controls

The E2B create and network-update APIs can restrict outbound destinations and transform request headers per domain.
The controls are stored with the Sandbox, so pooled Sandboxes receive the rules selected for their current delivery.

Each section below shows the raw API JSON and the equivalent E2B Python SDK call. The SDK serializes the snake_case
fields `allow_out`, `deny_out`, and `rules` into the camelCase `allowOut`, `denyOut`, and `rules` used by the API, so the
two forms describe the same policy. See [Python Client](../e2b-client.md) for SDK installation and for connecting the
client to `sandbox-manager`.

## Prerequisites

The rules below are enforced by the TrafficProxy data plane, so the target Sandbox must run the `traffic-proxy`
runtime. Declare it on the Sandbox, or on the SandboxTemplate or SandboxSet it derives from, as described in
[Enroll a Sandbox](./traffic-access-control.md#enroll-a-sandbox):

```yaml
spec:
  runtimes:
    - name: traffic-proxy
```

For pooled Sandboxes, declare the runtime in the template. A sidecar cannot be injected when a Sandbox is claimed
from the pool, so a pool whose template omits `traffic-proxy` produces Sandboxes that never enforce these rules.

:::caution
Without the `traffic-proxy` runtime, `sandbox-manager` still accepts and stores the `network` and `security-rules`
configurations, and the create and update calls return success. The rules are **not enforced** — outbound traffic that
should have been denied still succeeds. Confirm the sidecar is running before relying on these controls.
:::

## Create with Network Rules

The `network` object accepts L4 reachability lists and per-domain L7 transforms:

```json
{
  "templateID": "code-interpreter",
  "network": {
    "allowOut": ["api.example.com"],
    "denyOut": ["10.0.0.0/8"],
    "rules": {
      "api.example.com": [
        {"transform": {"headers": {"X-Tenant": "demo"}}}
      ]
    }
  }
}
```

`allowOut` accepts IP addresses, CIDRs, and concrete FQDNs; wildcard domains are rejected. `denyOut` accepts only IP
addresses and CIDRs. A `rules` entry transforms matching HTTP traffic but does not grant network reachability by itself,
so allow the destination separately when the platform has no administrator-level policy for it.

Header names from `network.rules` are normalized to lowercase. Setting a header replaces an existing header with the
same case-insensitive name.

The equivalent Python SDK call passes the same policy through the `network` argument of `Sandbox.create`:

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    template="code-interpreter",
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["10.0.0.0/8"],
        "rules": {
            "api.example.com": [
                {"transform": {"headers": {"X-Tenant": "demo"}}}
            ]
        },
    },
)
```

## Egress Patterns

Because `deny_out` accepts only IP addresses and CIDRs, hostname filtering is expressed as an allow-list: name the
destinations you want in `allow_out`, then deny all remaining traffic with `0.0.0.0/0`. Allow entries take precedence
over deny entries, so the listed destinations stay reachable.

Allow only a single hostname and block everything else:

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
    }
)
```

Mix hostnames, single IPs, and CIDRs in the allow-list:

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com", "storage.example.com", "8.8.8.8", "1.1.1.0/24"],
        "deny_out": ["0.0.0.0/0"],
    }
)
```

Block only a specific range while leaving the rest of the internet reachable:

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "deny_out": ["10.0.0.0/8", "169.254.169.254"],
    }
)
```

:::caution Wildcard domains are rejected
Unlike upstream E2B, `allow_out` does not accept wildcard patterns such as `*.example.com`. List every concrete FQDN you
need to reach. The unsupported upstream fields `egressProxy` and `maskRequestHost` are rejected as well.
:::

When a destination is reachable, add a per-domain transform under `rules` to inject headers. A `rules` entry does not
grant reachability on its own, so keep the host in `allow_out` too:

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
        "rules": {
            "api.example.com": [
                {"transform": {"headers": {"X-Tenant": "demo"}}}
            ]
        },
    }
)
```

## Remove Headers at Creation

For removal or an explicit ordered rule chain, pass a JSON array through the reserved
`e2b.agents.kruise.io/security-rules` metadata key:

```json
[
  {
    "name": "sanitize-example",
    "match": [{"domains": ["api.example.com"]}],
    "actions": {
      "headerManipulation": {
        "set": [{"name": "x-tenant", "value": "demo"}],
        "remove": ["x-debug-token"]
      }
    }
  }
]
```

Header values are stored verbatim, so do not use this mechanism for credentials. Rule names must be unique. Header
names in the explicit form must already be lowercase, and one name cannot appear in both `set` and `remove`.

Metadata values are strings, so serialize the rule chain with `json.dumps` and pass it through the `metadata` argument:

```python
import json

from e2b import Sandbox

security_rules = [
    {
        "name": "sanitize-example",
        "match": [{"domains": ["api.example.com"]}],
        "actions": {
            "headerManipulation": {
                "set": [{"name": "x-tenant", "value": "demo"}],
                "remove": ["x-debug-token"],
            }
        },
    }
]

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
    },
    metadata={
        "e2b.agents.kruise.io/security-rules": json.dumps(security_rules),
    },
)
```

## Update a Running Sandbox

Send `PUT /sandboxes/{sandboxID}/network` through the E2B management API. The body can replace `allowOut`, `denyOut`,
and `rules`:

```json
{
  "allowOut": ["api.example.com", "storage.example.com"],
  "denyOut": ["10.0.0.0/8"],
  "rules": {
    "api.example.com": [
      {"transform": {"headers": {"X-Tenant": "production"}}}
    ]
  }
}
```

For updates, an omitted `rules` field keeps the existing L7 chain, `{}` clears it, and a non-empty object replaces it.
Validation completes before the Sandbox is modified. The unsupported upstream fields `egressProxy` and
`maskRequestHost` are rejected instead of being silently ignored.

The `update_network` method sends the same body to `PUT /sandboxes/{sandboxID}/network`:

```python
# Replace the allow-list, deny-list, and L7 rules together
sandbox.update_network({
    "allow_out": ["api.example.com", "storage.example.com"],
    "deny_out": ["10.0.0.0/8"],
    "rules": {
        "api.example.com": [
            {"transform": {"headers": {"X-Tenant": "production"}}}
        ]
    },
})

# Tighten egress on the running Sandbox without recreating it
sandbox.update_network({
    "allow_out": ["api.example.com"],
    "deny_out": ["0.0.0.0/0"],
})

# Keep the existing allow/deny lists but clear the L7 transform chain
sandbox.update_network({"rules": {}})
```

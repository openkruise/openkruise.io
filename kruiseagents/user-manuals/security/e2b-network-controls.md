---
id: e2b-network-controls
title: E2B Network Controls
---

# E2B Network Controls

The E2B create and network-update APIs can restrict outbound destinations and transform request headers per domain.
The controls are stored with the Sandbox, so pooled Sandboxes receive the rules selected for their current delivery.

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

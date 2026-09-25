---
id: credential-injection
title: Credential Injection
---

# Credential Injection

Credential injection lets a Sandbox call an upstream API with a long-lived provider credential that never enters the
Sandbox. The egress proxy resolves the credential from a Kubernetes Secret and rewrites the matching outbound request
just before it leaves the cluster, so the workload and the agent code only ever see their own placeholder header.

Injection is configured by the platform administrator through a `SecurityProfile` (namespaced) or
`GlobalSecurityProfile` (cluster-scoped). Both share the same `tokenTransformation` action and the same Secret-based
credential source.

## How It Works

1. The administrator stores the upstream credential in a Kubernetes Secret.
2. A `SecurityProfile` selects the Sandbox Pods and defines a `tokenTransformation` rule whose `credentialRef.secret`
   points at that Secret.
3. On each matching outbound request, the egress proxy reads the Secret, renders the target header value, and replaces
   the request header before forwarding it upstream.

Because the credential is resolved per request at the proxy, it is not written into the Pod spec, the Sandbox
environment, or Sandbox metadata, and rotating the Secret takes effect without restarting the Sandbox.

## Create the Credential Secret

For an `ApiKey` transformation, the Secret carries the credential under the data key `apiKey`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-api-credentials
  namespace: agent-demo
type: Opaque
stringData:
  apiKey: "sk-example-1234567890"
```

## Configure a SecurityProfile

The profile below selects Pods labeled `app: agent` and injects the Secret value into the `authorization` header of
HTTPS requests to `api.example.com` under the `/v1/` prefix:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: example-api-credentials
  namespace: agent-demo
spec:
  selector:
    matchLabels:
      app: agent
  rules:
    - name: inject-example-api-key
      match:
        - domains:
            - api.example.com
          schemes:
            - https
          paths:
            - type: Prefix
              value: /v1/
      actions:
        tokenTransformation:
          type: ApiKey
          failStrategy: Block
          credentialRef:
            secret:
              name: example-api-credentials
          apiKey:
            targetHeaders:
              names:
                - authorization
            value:
              template: "Bearer {{ .Token }}"
```

Key fields:

- `credentialRef.secret.name` is the Secret to read. `credentialRef.secret.namespace` is optional: when omitted, a
  `SecurityProfile` uses its own namespace and a `GlobalSecurityProfile` uses the selected Pod's namespace. Set exactly
  one of `secret` or `credentialProvider` under `credentialRef`; this page covers `secret` only.
- `apiKey.targetHeaders.names` lists the request headers to overwrite. `targetHeaders.cel` selects header names
  dynamically instead.
- `apiKey.value.template` renders the replacement value. `{{ .Token }}` is the credential resolved from the Secret, and
  the template can also read `.Header`, `.Request`, `.Pod`, `.Profile`, `.Rule`, and `.Inputs`.
- `failStrategy` defaults to `Block` (fail closed): if the Secret cannot be resolved, the request is rejected rather than
  forwarded without a credential.

## Fine-grained, Per-sandbox Injection

Injection is scoped at two levels. The profile's `selector` chooses which Sandboxes (Pods) it applies to, so each
Sandbox only receives the credentials selected for it. Within a Sandbox, a rule's `match` block scopes injection to
specific traffic, so one Secret is only ever attached to the requests that should carry it:

- `domains` is required and supports an exact host (`api.example.com`) or a single leading wildcard (`*.example.com`).
- `paths`, `methods`, `schemes`, `ports`, `headers`, and `queryParams` further restrict the match. Fields inside one
  `match` entry are ANDed; multiple `match` entries are ORed.

This per-host granularity mirrors the E2B **per-host request transforms** model, where transforms are keyed by the
destination host. When you drive Sandboxes through the E2B interface, you express the same host-level scoping in the
`network.rules` field:

```json
{
  "templateID": "code-interpreter",
  "network": {
    "allowOut": ["api.example.com"],
    "rules": {
      "api.example.com": [
        {"transform": {"headers": {"X-Tenant": "demo"}}}
      ]
    }
  }
}
```

Use the two mechanisms together by host: the administrator-defined `SecurityProfile` injects the credential into the
selected hosts, while the E2B per-host transform sets non-sensitive, host-scoped headers for the same destination.

:::caution
The native E2B per-host transform stores header values verbatim, and `tokenTransformation` is rejected in inline E2B
rules. Per-host request transforms are therefore for non-credential headers only; always inject credentials from a
Secret through a `SecurityProfile`. See [E2B Network Controls](./e2b-network-controls.md).
:::

## Clean Up

Delete the profile to stop injection:

```console
$ kubectl delete securityprofile example-api-credentials --namespace agent-demo
```

Deleting the profile stops rewriting requests but does not revoke a credential that was already issued. Keep Secret
values short-lived where possible and rotate them at the provider for emergency response.

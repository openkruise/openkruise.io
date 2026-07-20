---
title: Python Client
---

# Using the E2B SDK

The sandbox-manager component of OpenKruise Agents supports two E2B integration protocols: native E2B protocol and
private protocol.

> The daily E2E regression tests for sandbox-manager are conducted with e2b-code-interpreter == 2.4.1 / e2b == 2.8.1,
> while compatibility is tested with the latest version.
> New features in updated versions will be adapted gradually. If you have feature requests, please submit an issue via
> GitHub.

Comparison between private protocol and native protocol:

> Assuming your configured E2B_DOMAIN is `your.domain.com`

| Native Protocol                  | Private Protocol                        | 
|----------------------------------|-----------------------------------------|
| api.your.domain.com              | your.domain.com/kruise/api              | 
| \<port\>-\<sid\>.your.domain.com | your.domain.com/kruise/\<sid\>/\<port\> |

## Configure E2B domains

Domain-based client integrations set `E2B_DOMAIN`. On the server, `sandbox-manager` supports two domain modes:

- **Dynamic resolution (default when the flag is omitted)**: When `--e2b-domain` is empty, `sandbox-manager` derives
  the response domain from each request's HTTP `Host`. Native requests remove the leading `api.` from the host, while
  private-protocol requests preserve the host. This allows one `sandbox-manager` deployment to serve multiple domains.
- **Static override**: When `--e2b-domain` is non-empty, its value is returned exactly and the request host is ignored.
  Use this mode when every client accesses `sandbox-manager` through the same domain.

For example, with dynamic resolution, clients configured with `E2B_DOMAIN=example1.com` and
`E2B_DOMAIN=example2.com` can share the same `sandbox-manager`. Requests to `api.example1.com` return Sandbox
addresses under `example1.com`, while requests to `api.example2.com` return addresses under `example2.com`.

:::note
Dynamic resolution uses the HTTP `Host` header and does not trust `X-Forwarded-Host`. Configure each reverse proxy to
preserve or rewrite `Host` to the public authority expected by the client.
:::

### Configure the server

The default manifests use dynamic resolution and do not pass `--e2b-domain`. If your Helm chart or existing Deployment
sets a domain, clear it (for example, `--set-string e2b.domain=""`) or remove the `--e2b-domain` argument to enable
dynamic resolution.

To retain a static domain when installing or upgrading Sandbox Manager with Helm, set `e2b.domain` explicitly:

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --set e2b.domain=your.domain.com \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

When a static override is configured, it must match the client's `E2B_DOMAIN`.

### Configure the client

You can configure the client-side E2B_DOMAIN by setting environment variables

```shell
export E2B_DOMAIN=your.domain.com
```

### Special Scenarios

#### 1. Domain with Port

For scenarios where the Ingress gateway does not use default HTTP ports (80 or 443). For example, if the domain is
`your.domain.com:8080`:

- Client-side: Set `E2B_DOMAIN=your.domain.com:8080`.
- Dynamic server-side resolution preserves the port from the request host automatically.
- For a static server-side override, set `--e2b-domain=your.domain.com:8080`.
- In Ingress host rules, use `your.domain.com` without the port.

#### 2. Multiple domains

To expose one `sandbox-manager` through multiple domains:

1. Enable dynamic server-side resolution by leaving `--e2b-domain` empty.
2. Configure DNS and Ingress routing for every public endpoint. Native protocol deployments using the default
   hostname-based routing need `api.<domain>` and `*.<domain>`; private protocol deployments need the base domain.
3. Provision a certificate that covers every endpoint. The [self-signed certificate](../best-practices/use-self-signed-cert.md)
   and [cert-manager](../best-practices/cert-manager.md) guides include multi-domain examples.
4. Set each client's `E2B_DOMAIN` to the domain through which that client connects.

Do not configure a static `--e2b-domain` in this setup, because a static value overrides every request host.

## How to install a certificate

If you need to access sandbox-manager via HTTPS, you need to install a TLS certificate. It is recommended to use a
trusted certificate. If you don't have a trusted certificate, you can use a self-signed one, refer to the following
docs:

- [use-self-signed-cert.md](../best-practices/use-self-signed-cert.md)
- [cert-manager.md](../best-practices/cert-manager.md)

You can install your certificate with the following command:

```shell
# ingress-nginx example, adjust according to your ingress controller
kubectl create secret tls sandbox-manager-tls \
          --cert=fullchain.pem \
          --key=privkey.pem -n sandbox-system
```

## Recommended sandbox-manager integration methods

### 1. Integration using native protocol

> This is the most standard, native integration method, but also has the highest configuration threshold, generally
> requiring manual deployment.

1. Client configuration environment variables:
    ```shell
    # A static server-side E2B domain, if configured, must use the same value
    export E2B_DOMAIN=your.domain.com
    export E2B_API_KEY=<your-api-key>
    ```
2. Resolve wildcard domain `*.your.domain.com` to sandbox-manager ingress endpoint with your DNS provider

3. Install wildcard certificate `*.your.domain.com`

### 2. Private protocol HTTPS access from outside cluster

> This approach lowers the deployment barrier by replacing wildcard domain with a single domain.

1. Client configuration environment variables:
    ```shell
    # A static server-side E2B domain, if configured, must use the same value
    export E2B_DOMAIN=your.domain.com
    export E2B_API_KEY=<your-api-key>
    ```
2. Patch client:
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=True)
    ```
3. Resolve single domain `your.domain.com` to sandbox-manager ingress endpoint with your DNS provider
4. Install single domain certificate `your.domain.com`

### 3. External access using E2B URL parameters

> Use the E2B SDK's native URL parameters to access `sandbox-manager` and `sandbox-gateway` from outside the cluster,
> without wildcard DNS or a private protocol patch. Requires `e2b >= 2.7.0`.

1. Prepare two public hostnames and route them to the corresponding Ingress endpoints:
   - `api.your.domain.com`: Control-plane hostname routed to `sandbox-manager`. The `api.` prefix is required and cannot
     be replaced with another subdomain.
   - `gateway.your.domain.com`: Data-plane hostname routed to `sandbox-gateway`. This hostname may use any subdomain;
     `gateway` is recommended.
2. Install a TLS certificate that covers both `api.your.domain.com` and `gateway.your.domain.com`.
3. Configure the client environment variables:
    ```shell
    export E2B_API_URL="https://api.your.domain.com"
    export E2B_SANDBOX_URL="https://gateway.your.domain.com"
    export E2B_API_KEY=<your-api-key>
    ```
4. Create a Sandbox using the E2B SDK without additional patching:
    ```python
    from e2b import Sandbox

    # E2B_API_URL and E2B_SANDBOX_URL are automatically read from environment variables
    sandbox = Sandbox()
    print(sandbox.get_host(8000))  # Get the access URL for a service inside the Sandbox
    sandbox.kill()
    ```

:::tip In-cluster configuration
When the client, `sandbox-manager`, and `sandbox-gateway` are in the same cluster, use their Kubernetes Service URLs
directly. This avoids public DNS configuration:

```shell
export E2B_API_URL="http://sandbox-manager.sandbox-system.svc.cluster.local:8080"
export E2B_SANDBOX_URL="http://sandbox-gateway.sandbox-system.svc.cluster.local:7788"
export E2B_API_KEY=<your-api-key>
```

If the external `sandbox-gateway` is not installed, `E2B_SANDBOX_URL` can use `sandbox-manager` instead to continue
using its built-in traffic proxy, although this is not recommended.
:::

> ⚠️ **Limitation**: The following extended features in the upper-level libraries `e2b-code-interpreter` and
> `e2b-desktop` do not read the `E2B_API_URL` / `E2B_SANDBOX_URL` environment variables, and therefore do not support
> this URL-parameter access method:
>
> **e2b-code-interpreter:**
> - `Sandbox.run_code`
> - `Sandbox.create_code_context`
> - `Sandbox.remove_code_context`
> - `Sandbox.list_code_contexts`
> - `Sandbox.restart_code_context`
>
> **e2b-desktop:**
> - `desktop.stream.get_url`
> - `desktop.stream.start`

### 4. Private protocol in-cluster access

> This approach enables rapid automated deployment without requiring domain and certificate configuration. Recommended
> for E2E testing scenarios only, or after rigorous evaluation.

1. Ensure client(agent) and sandbox-manager are in the same cluster.
2. Client configuration environment variables:
    ```shell
    # A static server-side E2B domain, if configured, must use the same value
    export E2B_DOMAIN=sandbox-manager.sandbox-system.svc.cluster.local
    export E2B_API_KEY=<your-api-key>
    ```
3. Patch client and disable HTTPS:
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=False)
    ```

### 5. Port forward sandbox-manager to local machine

1. Client configuration environment variables:
    ```shell
    # A static server-side E2B domain, if configured, must use the same value
    export E2B_DOMAIN=localhost
    export E2B_API_KEY=<your-api-key>
    ```
2. Port forward sandbox-manager to local machine:
   ```shell
   sudo kubectl port-forward services/sandbox-manager 80:7788 -n sandbox-system
   ```
3. Patch client:
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=False)
    ```

# Managing sandbox-manager Self-Signed Certificates with cert-manager

The Sandbox Controller and Sandbox Manager charts support cert-manager natively: all certificate issuance is gated by
`enableTLS` (default `false`), which requires cert-manager and — for the CA Bundle — trust-manager in the cluster.
This document walks through enabling the integration and verifying the issued certificates. For the full list of TLS
switches, see [TLS (cert-manager / trust-manager)](../installation.md#tls-cert-manager--trust-manager).

## Prerequisites

1. Sandbox Controller and Sandbox Manager are installed in the **same namespace** (default `sandbox-system`). The
   Sandbox Controller chart owns the shared root CA; the Sandbox Manager chart only references the CA Issuer by name.
2. Ensure the kubectl and helm command-line tools are available with appropriate permissions.

## Step 1: Install cert-manager and trust-manager

If you haven't installed them yet, refer to the official documentation:

- [cert-manager installation](https://cert-manager.io/docs/installation/)
- [trust-manager installation](https://cert-manager.io/docs/trust/trust-manager/installation/)

trust-manager distributes the shared CA as a `ca.crt` ConfigMap through a Bundle resource, so workloads can reuse it
as a trust anchor.

## Step 2: Enable TLS in the Charts

### 2.1 Create the shared root CA (Sandbox Controller)

Upgrade the Sandbox Controller with `enableTLS=true`. With the default `tls.createCA=true`, the chart creates the
shared root CA:

```bash
helm upgrade --install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --set enableTLS=true
```

This provisions:

- The self-signed bootstrap Issuer `sandbox-selfsigned-issuer` → CA Certificate `sandbox-ca` → signing Issuer
  `sandbox-signing-issuer`, which signs every leaf certificate.
- The CA key pair Secret `sandbox-ca-key-pair` (`tls.crt` / `tls.key`).
- The trust-manager Bundle `sandbox-ca-bundle`, distributing the CA as a `ca.crt` ConfigMap.

### 2.2 Issue the ingress certificate (Sandbox Manager)

Upgrade the Sandbox Manager in the same namespace with `enableTLS=true`:

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --set enableTLS=true \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

This creates the Certificate `sandbox-manager-ingress-cert`, stored in the Secret `sandbox-manager-tls`
(`ingress.certSecretName`) that the Ingress already references in its `spec.tls` block. The certificate covers
`api.<domain>`, `*.<domain>`, and `<domain>`; for multiple domains, add
`--set e2b.extraDomains={example2.com}` instead of editing `dnsNames` by hand.

Leaf certificates are issued for 90 days (`tls.certDuration: 2160h`) and renewed 15 days before expiry
(`tls.certRenewBefore: 360h`); cert-manager renews them automatically, so no manual rotation is required.

:::note
`enableTLS=true` alone only provisions the ingress certificate. Runtime mTLS, peer mTLS, and the EPE certificate are
independent opt-in switches — see
[TLS (cert-manager / trust-manager)](../installation.md#tls-cert-manager--trust-manager).
:::

## Step 3: Verify Certificate Status

Check if certificates are created and issued correctly:

```bash
kubectl get certificates -n sandbox-system
kubectl describe certificate sandbox-manager-ingress-cert -n sandbox-system
kubectl describe secret sandbox-manager-tls -n sandbox-system
```

Check Ingress status:

```bash
kubectl get ingress sandbox-manager -n sandbox-system
kubectl describe ingress sandbox-manager -n sandbox-system
```

## Step 4: Configure Client Trust

Since you are using self-signed certificates, clients need to trust the root CA certificate.

### 4.1 Obtain CA Certificate

```bash
kubectl get secret sandbox-ca-key-pair -n sandbox-system -o jsonpath='{.data.tls\.crt}' | base64 -d > ca.crt
```

### 4.2 Configure Client

Clients need to set the environment variable `SSL_CERT_FILE` to the path of the obtained CA certificate:

```bash
export SSL_CERT_FILE=/path/to/ca.crt
```

# Managing sandbox-manager Self-Signed Certificates with cert-manager

This document provides a best practice for managing and deploying sandbox-manager self-signed certificates using
cert-manager.

## Prerequisites

1. sandbox-manager is installed in the cluster
2. Ensure kubectl command-line tool is available with appropriate permissions

## Step 1: Install cert-manager

If you haven't installed cert-manager yet, please refer to
the [official documentation](https://cert-manager.io/docs/installation/) for installation.

## Step 2: Automatic Certificate Management with cert-manager

1. Choose an example:
   - For one domain, replace `your.domain.com` and `*.your.domain.com` in
     [cert-manager.yaml](https://github.com/openkruise/agents/blob/master/docs/best-practices/cert-manager.yaml).
   - For multiple domains, replace the entries under `dnsNames` in
     [cert-manager-multi-domain.yaml](https://github.com/openkruise/agents/blob/master/docs/best-practices/cert-manager-multi-domain.yaml).
     Include both the base and wildcard name for every native E2B domain.
2. Apply the selected configuration, for example: `kubectl apply -f cert-manager-multi-domain.yaml`.

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

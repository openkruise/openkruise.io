# Accessing sandbox-manager via E2B Protocol with Self-Signed Certificates

This document provides a best practice for accessing sandbox-manager via self-signed certificates, including how to
create certificates through an optimized script, how to install certificates in the cluster, and how to configure the
E2B client.

## Prerequisites

1. `sandbox-manager` is installed in the cluster
2. Ensure the `sandbox-manager` ingress is active (has an entrypoint). You can confirm this using the following command.
   The Address column should not be empty:

```shell
$ kubectl get ingress sandbox-manager -n sandbox-system
```

## Step 1: Create Certificates

Create self-signed certificates using the script [generate-certificate.sh](https://github.com/openkruise/agents/blob/master/hack/generate-certificates.sh). 
You can view the script usage with the following command.

```shell
$ bash generate-certificates.sh --help

Usage: generate-certificates.sh [OPTIONS]

Options:
  -d, --domain DOMAIN     Add a base domain; may be specified multiple times
                          DOMAIN and *.DOMAIN will both be added
  -o, --output DIR        Specify output directory (default: .)
  -D, --days DAYS         Specify certificate validity days (default: 365)
      --ca-key PATH       Reuse an existing CA private key
      --ca-cert PATH      Reuse the matching existing CA certificate; it must
                          be authorized to sign and valid for --days
  -h, --help              Show this help message

Examples:
  generate-certificates.sh -d example1.com -d example2.com
  generate-certificates.sh --domain example1.com --domain example2.com --days 730
  generate-certificates.sh -d example.com --ca-key ca-key.pem --ca-cert ca-cert.pem
```

After completing certificate generation, you will obtain the following files:

- fullchain.pem: Server certificate public key
- privkey.pem: Server certificate private key
- ca-fullchain.pem: CA certificate public key
- ca-privkey.pem: CA certificate private key

For every base domain passed with `--domain`, the script adds both the base domain and its wildcard name to the
certificate SANs. For example, `-d example1.com -d example2.com` covers `example1.com`, `*.example1.com`,
`example2.com`, and `*.example2.com`. This supports multiple native and private E2B endpoints served by the same
`sandbox-manager`.

By default, each run creates a new CA. To issue another server certificate from the same trust root, pass the existing
CA key and certificate together with `--ca-key` and `--ca-cert`. The CA must be valid for the requested lifetime and
authorized to sign certificates.

## Step 2: Install Certificates

Mount the server certificate to the cluster's Ingress using the following command:

```shell
$ kubectl create secret tls sandbox-manager-tls \
          --cert=fullchain.pem \
          --key=privkey.pem -n sandbox-system
```

Certificate activation may have some delay, depending on your ingress controller's efficiency.

## Step 3: Configure Client Trust

The client needs to set the environment variable `SSL_CERT_FILE` to the path of the CA public key file (
ca-fullchain.pem) generated in Step 1:

```shell
$ export SSL_CERT_FILE=/path/to/ca-fullchain.pem
```

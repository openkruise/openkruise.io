---
title: Installation
---

## Overview

Kruise Agents is installed through two Helm charts, which deploy the Sandbox Controller and the Sandbox Manager —
together with the Sandbox Gateway bundled in the Manager chart — forming a complete Sandbox runtime environment.

- **Sandbox Controller** (`agents-sandbox-controller` chart) is the control plane that manages all Sandbox CRD
  resources. The chart contains:
  - Eight `agents.kruise.io` CRDs: Sandbox, SandboxSet, SandboxClaim, SandboxTemplate, SandboxUpdateOps, Checkpoint,
    Commit, and PoolAutoscaler.
  - The sandbox-controller Deployment that reconciles these resources: sandbox lifecycle management, warm pool
    maintenance, claiming, in-place updates, Checkpoint/Commit, and pool autoscaling.
  - Mutating and validating webhooks, RBAC, the ServiceAccount, and the metrics Service.
  - The `sandbox-injection-config` ConfigMap, defining the in-pod injection templates for the `agent-runtime`
    sidecar and the per-sandbox `traffic-proxy`.
  - Optional TLS resources when `enableTLS=true`: the shared root CA, the runtime client and server certificates,
    and the trust-manager CA bundle.
- **Sandbox Manager** (`agents-sandbox-manager` chart) is the sandbox data plane component and also provides the
  E2B API adaptation service. The chart contains:
  - The sandbox-manager Deployment, along with the chart's Service, Secret, and Ingress resources.
  - The Sandbox Gateway Deployment: an Envoy + Golang Filter data plane responsible for traffic routing, load
    balancing, and circuit-breaking protection, scaling independently from the Manager.
  - An optional ServiceMonitor for Manager and Gateway metrics when `prometheus.enabled=true`.
  - Optional TLS resources when `enableTLS=true`: the ingress server certificate, the runtime client certificates,
    and the manager↔gateway peer certificates.
  - An optional embedded Agentio stack for sandbox ingress/egress control (`agentio.enabled`, disabled by default):
    the `agentiod` control plane, the EPE traffic extension, and the egress gateway.
  - The `TrafficPolicy`, `GlobalTrafficPolicy`, `SecurityProfile`, and `GlobalSecurityProfile` CRDs describing
    sandbox ingress/egress policies, installed with the chart.

---

## Version Compatibility

| Sandbox Component Version | Kubernetes Version | E2B Version |
|---------------------------|--------------------|-------------|
| 0.6.0                 | `>= 1.28`          | `>= 2.8.0`  |

> **Note**:
> - The `agent-runtime` sidecar injection requires Kubernetes >= 1.29 (native sidecar containers), see
>   [Agent Runtime Injection](#agent-runtime-injection).
> - `enableTLS=true` requires [cert-manager](https://cert-manager.io/) and, for the CA bundle, trust-manager to be
>   installed in the cluster.

---

## Prerequisites

1. Kubernetes cluster version >= 1.28 (>= 1.29 if you use agent-runtime sidecar injection)
2. Helm v3.5+ installed
3. Namespace created manually (see installation steps below)
4. cert-manager and trust-manager installed in the cluster if you enable TLS (`enableTLS=true`)

---

## Install via Helm

### 1. Add OpenKruise Charts Repository

```bash
## Add openkruise charts repository
helm repo add openkruise https://openkruise.github.io/charts/

## Update repository (if openkruise charts repository was previously installed)
helm repo update
```

### 2. Install Sandbox Controller

**Manually Create Namespace**

```bash
kubectl create ns sandbox-system
```

> **Installation Order**: Sandbox Controller **must** be installed before Sandbox Manager, as it provides the CRD
> resources required by Sandbox Manager.

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0
```

> ⚠️ **Server-side apply is not supported**: The sandbox-controller manages the `template` annotation on the mutating
> and validating webhook configurations at runtime under its own field manager (`manager`). Applying the chart with
> Kubernetes server-side apply competes for that same annotation and fails with a field-ownership conflict such as
> `Apply failed with 1 conflict: conflict with "manager"`. Do **not** pass `--server-side` to `helm install` /
> `helm upgrade` (Helm 3 uses client-side apply by default). If you use Helm 4 or another tool that applies with SSA by
> default, turn SSA off.

### 3. Install Sandbox Manager

> **Required Parameters**: The following parameters must be explicitly specified during installation:
> - `e2b.domain`: E2B protocol domain (the Ingress is created for `api.<domain>`, `*.<domain>`, and `<domain>`)
> - `e2b.adminApiKey`: E2B admin API Key for authentication
> - `ingress.className`: Ingress controller class name (e.g., `nginx`, `alb`, etc., depending on your cluster's Ingress
    implementation)

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

> **Note**: The Sandbox Manager chart also deploys Sandbox Gateway, no additional installation required. The Ingress
> routes control-plane traffic (`api.<domain>`) to the Sandbox Manager Service (port 8080) and data-plane traffic
> (`<domain>` and `*.<domain>`) to the Sandbox Gateway Service (port 7788).

---

## Using China Mirror Registry

Due to network restrictions, users in China may not be able to pull images directly from Docker Hub. It is recommended
to use China mirrors provided by Alibaba Cloud Container Registry.

### China Mirror Addresses

| Component          | Image Address                                                                         | Version        |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.6.0` |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.6.0` |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.6.0` |

### Install with China Mirrors

All images in both charts resolve through the chart-wide `image.registry`, so a single parameter switches every image
(Controller, Manager, Gateway, plus auxiliary images such as `agent-runtime` and the Commit job) to the China mirror.

**Install Sandbox Controller (using China mirror)**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --set image.registry=openkruise-registry.cn-shanghai.cr.aliyuncs.com
```

**Install Sandbox Manager (using China mirror)**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set image.registry=openkruise-registry.cn-shanghai.cr.aliyuncs.com
```

> **Note**:
> - Agentio images resolve their registry through `agentio.global.registry` first and fall back to `image.registry`
>   when both are unset.
> - An image whose repository already starts with a host (for example
>   `registry.cn-beijing.aliyuncs.com/acs/busybox`) bypasses the chart-wide registry, which is handy when the mirror
>   does not carry an auxiliary image.
> - To enable the Gateway init container with a mirror-hosted `busybox`, add the following:
>   ```bash
>   --set gateway.initContainer.enabled=true \
>   --set gateway.initContainer.image.repository=registry.cn-beijing.aliyuncs.com/acs/busybox \
>   --set gateway.initContainer.image.tag=1.36.1
>   ```

---

## Upgrade via Helm

### Upgrade Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --server-side=false
```

### Upgrade Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0
```

> **Note:**
> 1. Upgrade order: **Upgrade Sandbox Controller first, then Sandbox Manager** to ensure CRD compatibility.
> 2. Before upgrading, you **must** read the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
     to ensure you understand the incompatible changes in the new version.
> 3. If you want to reset parameters used in previous versions or configure new parameters, it is recommended to
     add `--reset-values` to the `helm upgrade` command.
> 4. You **must** pass `--server-side=false`. The sandbox-controller manages the webhook `template` annotation at
     runtime under its own field manager (`manager`), so a server-side apply competes for the same annotation and
     fails with a field-ownership conflict (`Apply failed with 1 conflict: conflict with "manager" ...`). Helm 3
     applies client-side by default, but Helm 4 and some CI tooling default to server-side apply, so set the flag
     explicitly to force client-side apply.

### Manually Update CRDs (Required)

Helm upgrade **will not automatically update** CRD definitions under the `crds/` directory, so you **must manually
apply the new CRDs before running `helm upgrade`**, otherwise new features will not work properly. The 0.6.0 release
adds the `Commit` and `PoolAutoscaler` CRDs and updates the schemas of existing CRDs.

```bash
# Extract CRDs from chart package and apply (online installation example)
helm pull openkruise/agents-sandbox-controller --version 0.6.0 --untar
kubectl apply -f agents-sandbox-controller/crds/
rm -rf agents-sandbox-controller
```

Key CRD changes in 0.6.0 include:
- **New Commit CRD** (`commits.agents.kruise.io`): Commit sandbox filesystem state to a container image through a job
- **New PoolAutoscaler CRD** (`poolautoscalers.agents.kruise.io`): Capacity-based and cron-driven SandboxSet pool
  autoscaling
- **SandboxSet enhancements**: `PauseStrategy` (Stop / Snapshot / CloudDisk) configuration

> **Note**: The traffic and security CRDs shipped by the Sandbox Manager chart (`trafficpolicies.agents.kruise.io`,
> `globaltrafficpolicies.agents.kruise.io`, `securityprofiles.agents.kruise.io`,
> `globalsecurityprofiles.agents.kruise.io`) are rendered as templates rather than `crds/` files, so they are updated
> automatically during `helm upgrade` and need no manual step.

---

## Manual Chart Download

If you cannot connect to `https://openkruise.github.io/charts/` in your production environment, you can manually
download the chart package from [GitHub Releases](https://github.com/openkruise/charts/releases) and then install or
upgrade it to your cluster.

```bash
helm install/upgrade agents-sandbox-controller /PATH/TO/CONTROLLER/CHART -n sandbox-system
helm install/upgrade agents-sandbox-manager /PATH/TO/MANAGER/CHART -n sandbox-system
```

---

## Options

### Sandbox Controller Installation Parameters

The following tables list the configurable parameters of the Sandbox Controller chart and their default values.

#### Common Parameters

| Parameter                | Description                                                          | Default                                |
|--------------------------|----------------------------------------------------------------------|----------------------------------------|
| `replicaCount`           | Number of sandbox-controller replicas                                | `2`                                    |
| `image.registry`         | Registry prepended to every image in this chart                      | `docker.io`                            |
| `image.repository`       | sandbox-controller image repository                                  | `openkruise/agent-sandbox-controller`  |
| `image.tag`              | sandbox-controller image tag                                         | `v0.6.0`                        |
| `image.pullPolicy`       | Controller image pull policy                                         | `IfNotPresent`                         |
| `imagePullSecrets`       | Image pull secrets list                                              | `[]`                                   |
| `namespace.name`         | Namespace name for deployment                                        | `sandbox-system`                       |
| `resources.limits.cpu`   | Controller CPU resource limit                                        | `2`                                    |
| `resources.limits.memory`| Controller memory resource limit                                     | `4Gi`                                  |
| `resources.requests.cpu` | Controller CPU resource request                                      | `2`                                    |
| `resources.requests.memory` | Controller memory resource request                                | `4Gi`                                  |
| `webhook.port`           | Webhook service port                                                 | `9443`                                 |
| `metrics.port`           | Metrics service port (HTTPS with authn/authz delegation to kube-apiserver) | `8443`                           |
| `healthProbe.port`       | Health probe port                                                    | `8081`                                 |
| `controller.featureGates`| Comma-separated `--feature-gates` key=value pairs (e.g. `Foo=true,Bar=false`); empty sets no flag | `""` |

> **Note**: To pass **multiple feature gates** with `--set`, escape every comma inside the value as `\,` and wrap
> the whole argument in single quotes so the shell preserves the backslashes:
>
> ```bash
> --set 'controller.featureGates=Commit=true\,KruiseIntegration=true'
> ```
>
> `--set` splits its argument on unescaped commas, so without the escape Helm reads `KruiseIntegration=true` as a
> separate top-level assignment and the gate is silently dropped from `controller.featureGates`.

#### Advanced Parameters

All remaining parameters are optional. Sensible defaults apply and most installs do not need to change them.

| Parameter                                | Description                                                                | Default                                                                                                                 |
|------------------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `controller.workers.sandboxWorkers`      | Concurrent workers for the Sandbox reconciler                              | `200`                                                                                                                   |
| `controller.workers.sandboxsetWorkers`   | Concurrent workers for the SandboxSet reconciler                           | `10`                                                                                                                    |
| `controller.workers.sandboxclaimWorkers` | Concurrent workers for the SandboxClaim reconciler                         | `200`                                                                                                                   |
| `controller.workers.sandboxupdateopsWorkers` | Concurrent workers for the SandboxUpdateOps reconciler                 | `5`                                                                                                                     |
| `controller.workers.poolautoscalerWorkers` | Concurrent workers for the PoolAutoscaler reconciler                     | `3`                                                                                                                     |
| `controller.workers.commitWorkers`       | Concurrent workers for the Commit reconciler                               | `5`                                                                                                                     |
| `controller.clientQPS`                   | Kubernetes API client QPS rate limit                                       | `30000`                                                                                                                 |
| `controller.clientBurst`                 | Kubernetes API client burst limit                                          | `60000`                                                                                                                 |
| `metrics.rbac.create`                    | Create a ClusterRole granting `get` on the `/metrics` nonResourceURL; bind it to your Prometheus / ARMS scraper ServiceAccount | `true`                                                                |
| `nameOverride`                           | Override Chart name                                                        | `""`                                                                                                                    |
| `fullnameOverride`                       | Override full name                                                         | `""`                                                                                                                    |
| `serviceAccount.create`                  | Whether to create ServiceAccount                                           | `true`                                                                                                                  |
| `serviceAccount.automount`               | Whether to automount ServiceAccount Token                                  | `true`                                                                                                                  |
| `serviceAccount.annotations`             | ServiceAccount annotations                                                 | `{}`                                                                                                                    |
| `serviceAccount.name`                    | ServiceAccount name to use                                                 | `""`                                                                                                                    |
| `rbac.create`                            | Whether to create RBAC resources                                           | `true`                                                                                                                  |
| `podAnnotations`                         | Pod annotations                                                            | `{}`                                                                                                                    |
| `podLabels`                              | Pod labels                                                                 | `{}`                                                                                                                    |
| `podSecurityContext`                     | Pod security context                                                       | `{runAsNonRoot: true, seccompProfile: {type: RuntimeDefault}}`                                                          |
| `securityContext`                        | Container security context                                                 | `{allowPrivilegeEscalation: false, capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true}` |
| `nodeSelector`                           | Node selector for Pod scheduling                                           | `{}`                                                                                                                    |
| `tolerations`                            | Tolerations for Pod scheduling                                             | `[]`                                                                                                                    |
| `affinity`                               | Affinity for Pod scheduling                                                | `{}`                                                                                                                    |
| `agentRuntime.image.repository`          | Injected agent-runtime sidecar image repository                            | `openkruise/agent-runtime`                                                                                              |
| `agentRuntime.image.tag`                 | Injected agent-runtime sidecar image tag                                   | `v0.3.0`                                                                                                                |
| `agentRuntime.image.pullPolicy`          | Injected agent-runtime sidecar image pull policy                           | `IfNotPresent`                                                                                                          |
| `commitJob.image.repository`             | Image repository of the Commit job pods                                    | `openkruise/commit-job`                                                                                                 |
| `commitJob.image.tag`                    | Image tag of the Commit job pods                                           | `v0.6.0`                                                                                                                |
| `enableTLS`                              | Master switch for cert-manager / trust-manager based TLS provisioning; when `false` nothing under `templates/tls/` renders and the controller keeps plaintext runtime behavior | `false`                             |
| `tls.createCA`                           | Create the shared root CA (selfSigned Issuer → CA Certificate → CA Issuer). The controller chart owns the CA; the sandbox-manager chart sets this to `false` and references the Issuer by name | `true`                                                |
| `tls.selfSignedIssuerName`               | Self-signed bootstrap Issuer name                                          | `sandbox-selfsigned-issuer`                                                                                             |
| `tls.caCertificateName`                  | CA Certificate resource name                                               | `sandbox-ca`                                                                                                            |
| `tls.caSecretName`                       | Secret holding the CA key pair (`tls.crt`/`tls.key`); also the trust-manager Bundle source and the CA Issuer's signing material | `sandbox-ca-key-pair`                                                                             |
| `tls.signingIssuerName`                  | CA Issuer name used to sign leaf certificates                              | `sandbox-signing-issuer`                                                                                                |
| `tls.caCommonName`                       | CA certificate common name                                                 | `sandbox-ca`                                                                                                            |
| `tls.caOrganization`                     | CA certificate organization                                                | `openkruise`                                                                                                            |
| `tls.caDuration`                         | CA certificate lifetime                                                    | `87600h` (10 years)                                                                                                     |
| `tls.certDuration`                       | Leaf certificate lifetime                                                  | `2160h` (90 days)                                                                                                       |
| `tls.certRenewBefore`                    | Leaf certificate renewal window                                            | `360h` (15 days)                                                                                                        |
| `tls.runtime.enabled`                    | Issue the runtime client/server certificates and activate the client-side TLS paths (`--runtime-client-cert-dir` plus the agent-runtime sidecar TLS env). Fails against an agent-runtime that does not serve TLS; requires `enableTLS` | `false`                                                       |
| `tls.runtimeClientCertName`              | Controller → agent-runtime client Certificate resource name                | `sandbox-controller-runtime-client`                                                                                     |
| `tls.runtimeClientCertSecretName`        | Controller client certificate Secret name                                  | `sandbox-controller-runtime-client-cert`                                                                                |
| `tls.runtimeClientCommonName`            | Controller client certificate common name                                  | `system:sandbox-controller-manager`                                                                                     |
| `tls.runtimeClientCertDir`               | Mount point for `--runtime-client-cert-dir`; the volume remaps `tls.crt`/`tls.key`/`ca.crt` to `client.crt`/`client.key`/`ca.crt` | `/etc/agent-runtime-client/certs`                                                                |
| `tls.agentRuntimeServerCertName`         | agent-runtime server Certificate resource name                             | `sandbox-agent-runtime-server`                                                                                          |
| `tls.agentRuntimeServerCertSecretName`   | agent-runtime server certificate Secret name                               | `sandbox-agent-runtime-server-certs`                                                                                    |
| `tls.agentRuntimeServerSAN`              | SAN the gateway/controller/manager use to reach the runtime                | `agentruntime.sandbox.agents.kruise.io`                                                                                 |
| `tls.bundle.enabled`                     | Create the trust-manager Bundle distributing the CA as a `ca.crt` ConfigMap | `true`                                                                                                                 |
| `tls.bundle.name`                        | trust-manager Bundle name                                                  | `sandbox-ca-bundle`                                                                                                     |
| `tls.bundle.configMapKey`                | Key holding the CA in the distributed ConfigMap                            | `ca.crt`                                                                                                                |
| `tls.bundle.namespaceSelector`           | Namespace selector limiting where the CA ConfigMap is written; empty selects every namespace | `{}`                                                                                                  |
| `agentio.trafficProxy.controlPlaneNamespace` | Namespace containing the Agentio control plane                         | `sandbox-system`                                                                                                        |
| `agentio.trafficProxy.controlPlaneService` | Agentio control-plane Service name                                       | `agentiod`                                                                                                              |
| `agentio.trafficProxy.xdsAddress`        | Explicit XDS address; generated from service and namespace when empty      | `""`                                                                                                                    |
| `agentio.trafficProxy.caAddress`         | Explicit CA address; generated from service and namespace when empty       | `""`                                                                                                                    |
| `agentio.trafficProxy.caCertConfigMap`   | CA ConfigMap mounted in injected workload namespaces                       | `agentio-ca-root-cert`                                                                                                  |
| `agentio.trafficProxy.clusterId`         | Cluster identifier reported to the control plane                           | `Kubernetes`                                                                                                            |
| `agentio.trafficProxy.clusterDomain`     | Kubernetes service DNS domain                                              | `cluster.local`                                                                                                         |
| `agentio.trafficProxy.tokenAudience`     | Projected workload token audience                                          | `agentio-ca`                                                                                                            |
| `agentio.trafficProxy.includeInboundPorts` | Inbound ports captured by the traffic proxy                              | `*`                                                                                                                     |
| `agentio.trafficProxy.includeOutboundIPRanges` | Outbound IP ranges captured by the traffic proxy                       | `*`                                                                                                                     |
| `agentio.trafficProxy.includeOutboundPorts` | Outbound ports captured by the traffic proxy                             | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeInboundPorts` | Inbound ports excluded from capture                                      | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeOutboundIPRanges` | Outbound IP ranges excluded from capture                             | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeOutboundPorts` | Outbound ports excluded from capture                                     | `""`                                                                                                                    |
| `agentio.trafficProxy.enableFirewallRules` | Enable traffic-proxy firewall rules                                      | `true`                                                                                                                  |
| `agentio.trafficProxy.firewallBackend`   | Firewall backend selection                                                 | `auto`                                                                                                                  |
| `agentio.trafficProxy.imagePullPolicy`   | Traffic-proxy image pull policy                                            | `IfNotPresent`                                                                                                          |
| `agentio.trafficProxy.healthProbeRewrite` | Rewrite health probes for injected traffic proxies                        | `true`                                                                                                                  |
| `agentio.trafficProxy.dnsCapture`        | Enable DNS capture                                                         | `true`                                                                                                                  |
| `agentio.trafficProxy.image.registry`    | Injected ztunnel image registry; empty inherits `image.registry`           | `""`                                                                                                                    |
| `agentio.trafficProxy.image.repository`  | Injected ztunnel image repository                                          | `openkruise/ztunnel`                                                                                                    |
| `agentio.trafficProxy.image.tag`         | Injected ztunnel image tag                                                 | `0.2.0`                                                                                                                 |
| `agentio.trafficProxy.image.digest`      | Optional digest override; takes precedence over tag                        | `""`                                                                                                                    |
| `agentio.trafficProxy.initImage.registry` | Injected iptables init image registry; empty inherits `image.registry`    | `""`                                                                                                                    |
| `agentio.trafficProxy.initImage.repository` | Injected iptables init image repository                                 | `openkruise/proxy-init`                                                                                                 |
| `agentio.trafficProxy.initImage.tag`     | Injected iptables init image tag                                           | `0.2.0`                                                                                                                 |
| `agentio.trafficProxy.initImage.digest`  | Optional digest override; takes precedence over tag                        | `""`                                                                                                                    |
| `agentio.trafficProxy.resources`         | Injected ztunnel resources                                                 | `requests: 100m/64Mi, limits: 200m/128Mi`                                                                               |
| `agentio.trafficProxy.initResources`     | Injected iptables init resources                                           | `requests: 100m/128Mi, limits: 1/1Gi`                                                                                   |

### Sandbox Manager Installation Parameters

The following tables list the configurable parameters of the Sandbox Manager chart and their default values.

#### Common Parameters

| Parameter                  | Description                                                | Default                      |
|----------------------------|------------------------------------------------------------|------------------------------|
| `replicaCount`             | Number of sandbox-manager replicas                         | `2`                          |
| `image.registry`           | Registry prepended to every image in this chart            | `docker.io`                  |
| `imagePullSecrets`         | Image pull secrets list                                    | `{}`                         |
| `controller.repository`    | sandbox-manager controller image repository                | `openkruise/sandbox-manager` |
| `controller.tag`           | sandbox-manager controller image tag                       | `v0.6.0`              |
| `controller.pullPolicy`    | Controller container image pull policy                     | `IfNotPresent`               |
| `controller.resources.cpu` | Controller container CPU resource                          | `2`                          |
| `controller.resources.memory` | Controller container memory resource                    | `4Gi`                        |
| `e2b.domain`               | E2B protocol domain (required)                             | `"your.domain.com"`          |
| `e2b.enableAuth`           | Whether to enable E2B authentication                       | `true`                       |
| `e2b.adminApiKey`          | E2B admin API key (required)                               | `""`                         |
| `ingress.className`        | Ingress class name (required)                              | `""`                         |
| `ingress.annotations`      | Ingress annotations                                        | `{}`                         |
| `prometheus.enabled`       | Create a ServiceMonitor for manager and gateway metrics    | `false`                      |
| `gateway.replicaCount`     | Number of sandbox-gateway replicas                         | `2`                          |
| `gateway.image.repository` | sandbox-gateway image repository                           | `openkruise/sandbox-gateway` |
| `gateway.image.tag`        | sandbox-gateway image tag                                  | `v0.6.0`              |
| `gateway.image.pullPolicy` | sandbox-gateway image pull policy                          | `IfNotPresent`               |
| `gateway.resources.cpu`    | sandbox-gateway container CPU resources                    | `2`                          |
| `gateway.resources.memory` | sandbox-gateway container memory resources                 | `4Gi`                        |

#### Advanced Parameters

All remaining parameters are optional. Sensible defaults apply and most installs do not need to change them.

| Parameter                              | Description                                                                    | Default                                |
|----------------------------------------|--------------------------------------------------------------------------------|----------------------------------------|
| `controller.logLevel`                  | Controller log level                                                           | `5`                                    |
| `controller.infra`                     | Sandbox manager infrastructure type                                            | `sandbox-cr`                           |
| `controller.hostNetwork`               | Whether controller uses host network                                           | `false`                                |
| `controller.maxClaimWorkers`           | Maximum claim worker threads                                                   | `100`                                  |
| `controller.maxCreateQPS`              | Maximum QPS for creating sandboxes                                             | `200`                                  |
| `controller.extProcMaxConcurrency`     | Maximum concurrency for external processors                                    | `10000`                                |
| `controller.enableShortSandboxId`      | Enable short, human-friendly sandbox identifiers                               | `true`                                 |
| `controller.shortSandboxIdPrefix`      | Optional prefix for short sandbox ids; only applied when non-empty             | `""`                                   |
| `e2b.extraDomains`                     | Extra domains added to the Ingress host list alongside `e2b.domain`            | `[]`                                   |
| `e2b.maxTimeout`                       | E2B maximum timeout (seconds)                                                  | `2592000`                              |
| `e2b.keyStorage.mode`                  | Where E2B API keys are stored: `secret` (the `e2b-key-store` Secret) or `mysql` | `secret`                              |
| `e2b.keyStorage.mysql.dsn`             | MySQL DSN; required (non-empty) when `keyStorage.mode=mysql`, validated at startup | `""`                                |
| `e2b.keyStorage.mysql.hashPepper`      | MySQL key-hash pepper; required (non-empty) when `keyStorage.mode=mysql`, validated at startup | `""`                    |
| `quota.enabled`                        | Enable Redis-backed quota accounting                                           | `false`                                |
| `quota.redis.addr`                     | Redis address for quota; only passed to the manager when enabled               | `""`                                   |
| `quota.redis.db`                       | Redis database number for quota                                                | `0`                                    |
| `quota.redis.username`                 | Redis username (rendered into the manager Secret)                              | `""`                                   |
| `quota.redis.password`                 | Redis password (rendered into the manager Secret)                              | `""`                                   |
| `service.type`                         | sandbox-manager service type                                                   | `ClusterIP`                            |
| `ingress.dataplaneService`             | Dataplane backend service name for Ingress                                     | `sandbox-gateway`                      |
| `ingress.certSecretName`               | Ingress TLS certificate Secret name                                            | `sandbox-manager-tls`                  |
| `nameOverride`                         | Override Chart name                                                            | `""`                                   |
| `fullnameOverride`                     | Override full name                                                             | `""`                                   |
| `serviceAccount.automount`             | Whether to automount ServiceAccount Token                                      | `true`                                 |
| `serviceAccount.annotations`           | ServiceAccount annotations                                                     | `{}`                                   |
| `serviceAccount.name`                  | ServiceAccount name to use                                                     | `""`                                   |
| `podAnnotations`                       | Pod annotations                                                                | `{}`                                   |
| `podLabels`                            | Pod labels                                                                     | `{}`                                   |
| `podSecurityContext`                   | Pod security context                                                           | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `securityContext`                      | Container security context                                                     | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`                         | Node selector for Pod scheduling                                               | `{}`                                                                                                                                                          |
| `tolerations`                          | Tolerations for Pod scheduling                                                 | `[]`                                                                                                                                                          |
| `affinity`                             | Affinity for Pod scheduling                                                    | Preferred Pod anti-affinity (`preferredDuringSchedulingIgnoredDuringExecution`), spread across hostnames                                                       |
| `gracefulShutdown.preStopSleepSeconds` | Sleep in the preStop hook before termination; also raises `terminationGracePeriodSeconds` when > 0 | `0`                                                                                                                        |
| `gateway.imagePullSecrets`             | Gateway image pull secrets list                                                | `[]`                                                                                                                    |
| `gateway.nameOverride`                 | Override gateway name                                                          | `""`                                                                                                                    |
| `gateway.serviceAccount.annotations`   | Gateway ServiceAccount annotations                                             | `{}`                                                                                                                    |
| `gateway.serviceAccount.name`          | Gateway ServiceAccount name to use                                             | `""`                                                                                                                    |
| `gateway.podAnnotations`               | Gateway pod annotations                                                        | `{}`                                                                                                                    |
| `gateway.podSecurityContext`           | Gateway pod security context                                                   | `{}`                                                                                                                    |
| `gateway.securityContext`              | Gateway container security context                                             | `{}`                                                                                                                    |
| `gateway.initContainer.enabled`        | Whether to enable gateway initContainer                                        | `false`                                                                                                                 |
| `gateway.initContainer.image.repository` | initContainer image repository                                               | `busybox`                                                                                                               |
| `gateway.initContainer.image.tag`      | initContainer image tag                                                        | `1.36.1`                                                                                                                |
| `gateway.initContainer.image.pullPolicy` | initContainer image pull policy                                              | `IfNotPresent`                                                                                                          |
| `gateway.initContainer.securityContext` | initContainer security context                                                | `{capabilities: {drop: [ALL], add: [SYS_ADMIN]}}`                                                                       |
| `gateway.service.type`                 | sandbox-gateway service type                                                   | `ClusterIP`                                                                                                             |
| `gateway.service.port`                 | sandbox-gateway service port                                                   | `7788`                                                                                                                  |
| `gateway.service.targetPort`           | sandbox-gateway service target port                                            | `7788`                                                                                                                  |
| `gateway.service.annotations`          | Gateway service annotations                                                    | `{}`                                                                                                                    |
| `gateway.service.labels`               | Gateway service labels                                                         | `{}`                                                                                                                    |
| `gateway.nodeSelector`                 | Node selector for gateway pod scheduling                                       | `{}`                                                                                                                    |
| `gateway.tolerations`                  | Tolerations for gateway pod scheduling                                         | `[]`                                                                                                                    |
| `gateway.affinity`                     | Affinity for gateway pod scheduling                                            | `{}`                                                                                                                    |
| `gateway.livenessProbe`                | Gateway liveness probe (TCP on port 7788)                                      | `initialDelay: 10s, period: 10s, timeout: 5s, failureThreshold: 3`                                                      |
| `gateway.readinessProbe`               | Gateway readiness probe (TCP on port 7788)                                     | `initialDelay: 5s, period: 5s, timeout: 3s, failureThreshold: 3`                                                        |
| `gateway.podAntiAffinity`              | Gateway pod anti-affinity                                                      | `soft, weight: 100, topologyKey: kubernetes.io/hostname`                                                                |
| `gateway.envoy.admin.address`          | Envoy admin interface address                                                  | `127.0.0.1`                                                                                                             |
| `gateway.envoy.admin.port`             | Envoy admin interface port                                                     | `9901`                                                                                                                  |
| `gateway.envoy.prometheus.enabled`     | Expose Envoy Prometheus metrics externally (proxies admin `/stats/prometheus`) | `false`                                                                                                                 |
| `gateway.envoy.prometheus.address`     | Envoy Prometheus listener address                                              | `0.0.0.0`                                                                                                               |
| `gateway.envoy.prometheus.port`        | Envoy Prometheus listener port                                                 | `9902`                                                                                                                  |
| `gateway.envoy.prometheus.path`        | Envoy Prometheus metrics path                                                  | `/metrics`                                                                                                              |
| `gateway.envoy.listener.address`       | Envoy listener address                                                         | `0.0.0.0`                                                                                                               |
| `gateway.envoy.listener.port`          | Envoy listener port                                                            | `7788`                                                                                                                  |
| `gateway.envoy.logLevel`               | Envoy log level                                                                | `warn`                                                                                                                  |
| `gateway.envoy.concurrency`            | Envoy worker thread concurrency; empty falls back to `gateway.resources.cpu`   | `""`                                                                                                                    |
| `gateway.envoy.drainTimeSeconds`       | Envoy drain time on shutdown                                                   | `30`                                                                                                                    |
| `gateway.envoy.streamIdleTimeout`      | Envoy stream idle timeout                                                      | `600s`                                                                                                                  |
| `gateway.envoy.connectTimeout`         | Envoy upstream connect timeout                                                 | `5s`                                                                                                                    |
| `gateway.envoy.useDownstreamProtocolConfig` | Apply the downstream protocol config to upstream connections               | `false`                                                                                                                 |
| `gateway.envoy.perConnectionBufferLimitBytes` | Per-connection buffer limit                                             | `1048576`                                                                                                               |
| `gateway.envoy.circuitBreakers`        | Envoy circuit-breaker thresholds                                               | `enabled: true, maxConnections: 80000, maxPendingRequests: 32768, maxRequests: 80000, maxRetries: 5`                     |
| `gateway.envoy.tcpKeepalive`           | Envoy upstream TCP keepalive                                                   | `enabled: false, keepaliveProbes: 3, keepaliveTime: 60, keepaliveInterval: 10`                                          |
| `gateway.envoy.golangFilter`           | Gateway golang filter library                                                  | `libraryId/pluginName: sandbox-gateway, libraryPath: /etc/envoy/sandbox-gateway.so`                                     |
| `gateway.envoy.pluginConfig.hostHeaderName` | Header carrying the upstream host                                         | `Host`                                                                                                                  |
| `gateway.envoy.pluginConfig.sandboxHeaderName` | Header carrying the sandbox id                                         | `e2b-sandbox-id`                                                                                                        |
| `gateway.envoy.pluginConfig.sandboxPortHeader` | Header carrying the sandbox port                                       | `e2b-sandbox-port`                                                                                                      |
| `gateway.envoy.pluginConfig.defaultPort` | Port used when no sandbox port header is present                            | `"49983"`                                                                                                               |
| `gateway.envoy.pluginConfig.enableAuth` | Enforce traffic access-token auth in the gateway plugin                      | `true`                                                                                                                  |
| `gateway.envoy.pluginConfig.trafficAccessTokenHeader` | Header carrying the traffic access token                     | `e2b-traffic-access-token`                                                                                              |
| `gateway.envoy.pluginConfig.enableJwtAuth` | Enable OIDC/JWT verification; requires `tls.oidc.discoveryUrl` to be set  | `false`                                                                                                                 |
| `gateway.envoy.pluginConfig.wakeTimeoutSeconds` | Timeout waiting for a sleeping sandbox to wake                       | `60`                                                                                                                    |
| `enableTLS`                            | Master switch for cert-manager/trust-manager TLS. Issues the ingress server certificate, the manager/gateway runtime client certificates, the peer certificates, and turns on runtime mTLS in the gateway envoy config. The shared root CA is owned by the sandbox-controller chart, which must be installed in the same namespace | `false`                    |
| `tls.signingIssuerName`                | CA Issuer created by the sandbox-controller chart (same namespace); not created here | `sandbox-signing-issuer`                                                                                             |
| `tls.signingIssuerKind`                | Kind of the referenced issuer                                                  | `Issuer`                                                                                                                |
| `tls.caCommonName`                     | Ingress certificate common name; also the subject organization on issued certificates | `sandbox-ca`                                                                                                     |
| `tls.caOrganization`                   | Subject organization on issued certificates                                    | `openkruise`                                                                                                            |
| `tls.certDuration`                     | Leaf certificate lifetime                                                      | `2160h`                                                                                                                 |
| `tls.certRenewBefore`                  | Leaf certificate renewal window                                                | `360h`                                                                                                                  |
| `tls.ingressCertName`                  | Ingress server Certificate resource; its Secret name must match `ingress.certSecretName`. Provisioned by `enableTLS` alone and safe against a plaintext runtime | `sandbox-manager-ingress-cert`                                               |
| `tls.runtime.enabled`                  | Issue the manager/gateway runtime client certificates and activate `--runtime-client-cert-secret` plus the gateway enable-runtime-mtls/transport_socket. Fails against an agent-runtime that does not serve TLS; requires `enableTLS`; set together with the controller chart's `tls.runtime.enabled` | `false`                                                                |
| `tls.managerRuntimeClientCertName`     | Manager runtime client Certificate name                                        | `sandbox-manager-runtime-client`                                                                                        |
| `tls.managerRuntimeClientCertSecretName` | Manager runtime client certificate Secret name                              | `sandbox-manager-runtime-client-cert`                                                                                   |
| `tls.managerRuntimeClientCommonName`   | Manager runtime client certificate common name                                 | `system:sandbox-manager`                                                                                                |
| `tls.gatewayRuntimeClientCertName`     | Gateway runtime client Certificate name                                        | `sandbox-gateway-runtime-client`                                                                                        |
| `tls.gatewayRuntimeClientCertSecretName` | Gateway runtime client certificate Secret name                              | `sandbox-gateway-runtime-client-cert`                                                                                   |
| `tls.gatewayRuntimeClientCommonName`   | Gateway runtime client certificate common name                                 | `system:sandbox-gateway`                                                                                                |
| `tls.gatewayRuntimeMtlsDir`            | Directory where the gateway runtime mTLS Secret is mounted; referenced by the envoy transport_socket | `/var/run/sandbox-gateway/runtime-mtls`                                                              |
| `tls.agentRuntimeServerSAN`            | SAN the agent-runtime server certificate carries; used as envoy SNI and validated via auto_sni_san_validation. Must match the controller chart | `agentruntime.sandbox.agents.kruise.io`                                                            |
| `tls.peer.enabled`                     | Peer mTLS + memberlist gossip encryption for the manager↔gateway control-plane cluster. Independent of the agent-runtime data path; requires `enableTLS` and images including openkruise/agents#967 (older sandbox-manager images crash on the unknown `--peer-*` flags) | `false`                                                   |
| `tls.peer.serverCertName` / `serverCertSecretName` | Peer TLS server certificate shared by manager and gateway (server auth only; SAN fixed to `tls.agentRuntimeServerSAN`) | `sandbox-peer-server` / `sandbox-peer-server-cert`                                              |
| `tls.peer.managerClientCertName` / `managerClientCertSecretName` / `managerClientCommonName` | Manager peer client certificate (client auth only) | `sandbox-peer-manager-client` / `sandbox-peer-manager-client-cert` / `system:sandbox-manager`                     |
| `tls.peer.gatewayClientCertName` / `gatewayClientCertSecretName` / `gatewayClientCommonName` | Gateway peer client certificate (client auth only) | `sandbox-peer-gateway-client` / `sandbox-peer-gateway-client-cert` / `system:sandbox-gateway`                     |
| `tls.peer.keySecretName`               | Existing Secret (data key `key`, exactly 32 bytes) for memberlist gossip encryption; empty disables. cert-manager cannot create it; provide it out-of-band, referenced by both manager and gateway | `""`                                                                        |
| `tls.peer.allowedClientCNs`            | Optional comma-separated inbound allow-list matched against the client certificate CN or DNS SANs; empty accepts any client trusted by the peer server CA | `""`                                                                             |
| `tls.oidc.discoveryUrl`                | Absolute HTTPS discovery URL of the token issuer; required when JWT auth is enabled, the verifier fails to initialize while empty | `""`                                                                                |
| `tls.oidc.caConfigMapName` / `caConfigMapKey` | ConfigMap holding the CA verifying the issuer's TLS certificate; defaults point at the trust-manager Bundle created by the controller chart | `sandbox-ca-bundle` / `ca.crt`                                                          |
| `tls.oidc.clockSkew`                   | Optional token clock-skew override (e.g. `1m`); empty uses the default         | `""`                                                                                                                    |
| `tls.epe.enabled`                      | Issue the traffic-extension (EPE) credential-provider client certificate; requires `agentio.epe.mode=managed` and `agentio.epe.credentialProvider.mtls.source=files` | `false`                                                       |
| `tls.epe.certificateName` / `commonName` | Certificate resource / common name; empty defaults to `<epe-fullname>-mtls-client-cert` / `system:<epe-fullname>` | `""`                                                                                          |
| `tls.epe.issuerName` / `issuerKind` / `issuerGroup` | Issuer signing the EPE client certificate; the namespaced default Issuer only works when the agentio namespace also holds the CA Issuer | `sandbox-signing-issuer` / `Issuer` / `cert-manager.io`                                       |
| `tls.epe.duration` / `renewBefore`     | EPE certificate lifetime / renewal window                                      | `2160h` / `360h`                                                                                                        |
| `agentio.enabled`                      | Deploy the embedded Agentio control plane                                      | `false`                                                                                                                 |
| `agentio.global.registry`              | Default registry for Agentio images; empty inherits `image.registry`           | `""`                                                                                                                    |
| `agentio.global.tag`                   | Default tag for Agentio images, overridable per component                      | `0.2.0`                                                                                                                 |
| `agentio.global.imagePullPolicy`       | Default pull policy for Agentio images                                         | `IfNotPresent`                                                                                                          |
| `agentio.global.imagePullSecrets`      | Default pull secrets for Agentio images                                        | `[]`                                                                                                                    |
| `agentio.global.namespace`             | Agentio control-plane namespace                                                | `sandbox-system`                                                                                                        |
| `agentio.global.createNamespace`       | Create the Agentio control-plane namespace                                     | `true`                                                                                                                  |
| `agentio.global.trustDomain`           | Agentio workload identity trust domain                                         | `cluster.local`                                                                                                         |
| `agentio.global.clusterDomain`         | Kubernetes service DNS domain                                                  | `cluster.local`                                                                                                         |
| `agentio.global.clusterId`             | Agentio cluster identifier                                                     | `Kubernetes`                                                                                                            |
| `agentio.global.caCertConfigMap`       | ConfigMap distributing the Agentio mesh root CA                                | `agentio-ca-certs`                                                                                                      |
| `agentio.agentiod.ca.trustBundleConfigMapName` | CA trust bundle distributed to traffic proxies                         | `agentio-ca-root-cert`                                                                                                  |
| `agentio.agentiod.replicaCount`        | Agentio control-plane replicas                                                 | `1`                                                                                                                     |
| `agentio.agentiod.image.registry`      | Agentio control-plane image registry; empty inherits `agentio.global.registry` | `""`                                                                                                                    |
| `agentio.agentiod.image.repository`    | Agentio control-plane image repository                                         | `openkruise/agentiod`                                                                                                   |
| `agentio.agentiod.image.tag`           | Agentio control-plane image tag                                                | `0.2.0`                                                                                                                 |
| `agentio.agentiod.image.digest`        | Optional digest override; takes precedence over tag                            | `""`                                                                                                                    |
| `agentio.agentiod.resources`           | Control-plane resource requests                                                | `500m CPU, 512Mi`                                                                                                       |
| `agentio.epe.mode`                     | EPE deployment mode: disabled, managed, or external                            | `managed`                                                                                                               |
| `agentio.epe.image.registry`           | EPE image registry; empty inherits `agentio.global.registry`                   | `""`                                                                                                                    |
| `agentio.epe.image.repository`         | EPE image repository                                                           | `openkruise/agentio-epe`                                                                                                |
| `agentio.epe.image.tag`                | EPE image tag                                                                  | `0.2.0`                                                                                                                 |
| `agentio.epe.image.digest`             | Optional digest override; takes precedence over tag                            | `""`                                                                                                                    |
| `agentio.egressGateway.mode`           | Gateway mode: disabled, static, or gatewayAPI                                  | `static`                                                                                                                |
| `agentio.egressGateway.image.registry` | Egress gateway proxy image registry; empty inherits `agentio.global.registry`  | `""`                                                                                                                    |
| `agentio.egressGateway.image.repository` | Egress gateway proxy image repository                                        | `openkruise/proxyv2`                                                                                                    |
| `agentio.egressGateway.image.tag`      | Egress gateway proxy image tag                                                 | `0.2.0`                                                                                                                 |
| `agentio.egressGateway.image.digest`   | Optional digest override; takes precedence over tag                            | `""`                                                                                                                    |
| `agentio.agentiod.config.values`       | Raw overrides for the Agentio configuration                                    | `{}`                                                                                                                    |

These parameters can be set via `--set key=value[,key=value]` in the `helm install` or `helm upgrade` commands.

**Gateway Default Probe Configuration Reference:**

```yaml
# Liveness probe
gateway.livenessProbe:
  tcpSocket:
    port: 7788
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# Readiness probe
gateway.readinessProbe:
  tcpSocket:
    port: 7788
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**Gateway Default Circuit Breaker Configuration Reference:**

```yaml
gateway.envoy.circuitBreakers:
  enabled: true
  maxConnections: 80000
  maxPendingRequests: 32768
  maxRequests: 80000
  maxRetries: 5
```

### Image Registry

Images render as `<registry>/<repository>:<tag>` or, with a digest override, `<registry>/<repository>@<digest>`. The
`registry` defaults to the chart-wide `image.registry`. Agentio images resolve their registry through a longer chain:
their own `image.registry`, then `agentio.global.registry`, then `image.registry`. Agentio images use the fixed `0.2.0`
tag by default; an optional `digest` overrides the tag.

The registry prefix is dropped when the first path segment of a repository already names a host (it contains a `.` or a
`:`), so setting `controller.repository` to `myreg.io/openkruise/sandbox-manager` or
`image.repository` to `myreg.io/openkruise/agent-sandbox-controller` keeps working without also clearing
`image.registry`.

### TLS (cert-manager / trust-manager)

All certificate issuance is gated by `enableTLS` (default `false`), which requires cert-manager (and trust-manager,
for the CA Bundle) in the cluster. The shared root CA (Issuer and CA Certificate) is owned by the Sandbox Controller
chart and must be installed in the same namespace; the Sandbox Manager chart only references the
`tls.signingIssuerName` Issuer by name.

The switches are independent and can be adopted incrementally:

- **`enableTLS=true`** provisions the ingress server certificate (`tls.ingressCertName`, wired into
  `ingress.certSecretName`). External client → ingress HTTPS is independent of the agent-runtime, so this is safe and
  effective today, even with a plaintext runtime.
- **`tls.runtime.enabled=true`** additionally issues the manager, gateway, and controller runtime certificates and
  activates `--runtime-client-cert-secret` plus the gateway enable-runtime-mtls/transport_socket. Those client paths
  fail against an agent-runtime that does not yet serve TLS — enable only once the agent-runtime image supports
  runtime TLS, and set it together with `tls.runtime.enabled` in the controller chart for the full runtime path.
- **`tls.peer.enabled=true`** secures the manager↔gateway route-sync/gossip channel (peer mTLS plus optional
  memberlist gossip encryption via `tls.peer.keySecretName`). It is independent of the agent-runtime data path and
  safe to enable on its own, but requires manager/gateway images that include
  [openkruise/agents#967](https://github.com/openkruise/agents/pull/967): an older sandbox-manager crashes on the
  unknown `--peer-*` flags. Verify the image before enabling.
- **`tls.epe.enabled=true`** issues the EPE credential-provider client certificate. Requires
  `agentio.epe.mode=managed` with `agentio.epe.credentialProvider.mtls.source=files`; the certificate is written into
  the same files Secret EPE mounts with keys remapped to `client.crt`/`client.key`/`ca.crt`. Mesh workload
  certificates (egress gateway, traffic-proxy/ztunnel mTLS) are not issued here — agentiod/pilot issues them on demand
  as SPIFFE SVIDs.
- **`gateway.envoy.pluginConfig.enableJwtAuth=true`** (with `enableTLS`) turns on OIDC/JWT verification at the
  gateway. Requires `tls.oidc.discoveryUrl`; the verifier reads its CA from the `tls.oidc.caConfigMapName` ConfigMap
  through the API server, so that ConfigMap must exist in this namespace (the defaults point at the trust-manager
  Bundle created by the controller chart).

### Agent Runtime Injection

The `sandbox-injection-config` ConfigMap ships an `agent-runtime` entry. It is applied only to sandboxes that
explicitly opt in by declaring the runtime in `Sandbox.spec.runtimes`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo
spec:
  runtimes:
    - name: agent-runtime
  # ... pod template
```

When the runtime is declared, the controller injects a native sidecar container named `agent-runtime` (built from
`agentRuntime.image.*`, default `openkruise/agent-runtime:v0.3.0`), `ENVD_DIR`/`GODEBUG`/`POD_UID` environment
variables, the `envd-volume` mount at `/mnt/envd`, and a `postStart` hook into the first business container.

Requirements:

- **Kubernetes >= 1.29.** The `agent-runtime` container is injected as a native sidecar (an init container with
  `restartPolicy: Always`), which requires the `SidecarContainers` feature to be enabled by default. On older
  clusters the injected pod will be rejected or the sidecar will not restart as expected.
- **The first business container image must contain `bash`.** The injected `postStart` hook runs
  `bash /mnt/envd/envd-run.sh` inside that container, so images without a `bash` binary (for example plain
  `distroless` or `busybox` based images) will fail to start.

The Controller chart intentionally ships only the `traffic-proxy` and `agent-runtime` injection entries. The TLS /
helper runtime and the CSI runtime are not included; deploy those components separately if your environment needs
them.

---

## Third-Party Dependencies

Neither chart requires any of the components below to run. Each component only backs a specific feature: install it
and turn on the corresponding switch when you need that feature.

### cert-manager / trust-manager

- **Dependent feature**: TLS termination. With `enableTLS=true`, cert-manager issues the ingress server certificate
  plus the manager/gateway/controller runtime and peer certificates, and trust-manager distributes the shared CA as
  a `ca.crt` ConfigMap.
- **How to enable**: install cert-manager (and trust-manager for the CA Bundle) in the cluster, then set
  `enableTLS=true` on both charts — the Sandbox Controller chart owns the root CA Issuer and Certificate, the
  Sandbox Manager chart only references the Issuer by name. See
  [TLS (cert-manager / trust-manager)](#tls-cert-manager--trust-manager) for the individual switches.

### OpenKruise

- **Dependent feature**: probe-driven auto pause/resume on real nodes. With the `KruiseIntegration` feature gate
  enabled, the controller creates OpenKruise `PodProbeMarker` resources and kruise-daemon executes the probes
  defined in `Sandbox.spec.probes` inside the sandbox pod. Without the gate, real-node probe conditions stay
  `Unknown` and auto-pause decisions fail closed — probes on virtual-kubelet nodes still run through the
  `kruise.io/podprobe` annotation.
- **How to enable**: install OpenKruise in the cluster, then install or upgrade the Sandbox Controller with the
  gate enabled: `--set 'controller.featureGates=KruiseIntegration=true'`.

### Redis

- **Dependent feature**: quota accounting. With `quota.enabled=true`, the manager keeps quota counters in Redis.
- **How to enable**: deploy a Redis instance, then install or upgrade the Sandbox Manager with
  `--set quota.enabled=true --set quota.redis.addr=<host:port>`, plus `quota.redis.db`, `quota.redis.username`, and
  `quota.redis.password` as needed.

### MySQL

- **Dependent feature**: E2B API key storage. With `e2b.keyStorage.mode=mysql`, API keys are stored in MySQL
  instead of the default `e2b-key-store` Secret.
- **How to enable**: prepare the database and the DSN, then install or upgrade the Sandbox Manager with
  `--set e2b.keyStorage.mode=mysql --set e2b.keyStorage.mysql.dsn=<dsn> --set e2b.keyStorage.mysql.hashPepper=<pepper>`.
  Both the DSN and the pepper are required and validated at manager startup.

### Prometheus

- **Dependent feature**: metrics collection.
- **How to enable**:
  - **Manager and gateway**: `--set prometheus.enabled=true` creates a ServiceMonitor for both; requires the
    Prometheus Operator CRDs in the cluster.
  - **Gateway Envoy**: `--set gateway.envoy.prometheus.enabled=true` exposes the Envoy admin `/stats/prometheus` on
    port 9902.
  - **Controller**: the chart grants `get` on the `/metrics` nonResourceURL through `metrics.rbac.create` (default
    `true`); bind the generated ClusterRole to your Prometheus scraper ServiceAccount.

### Ingress Controller

- **Dependent feature**: external access. `ingress.className` is required to expose the manager API
  (`api.<domain>`) and the gateway (`*.<domain>`) through an Ingress.
- **How to enable**: install an Ingress controller (for example ALB or nginx), then install or upgrade the Sandbox
  Manager with `--set ingress.className=<alb|nginx>`. See
  [Expose Service via Ingress](#expose-service-via-ingress) for a full example.

---

## Best Practices

### Custom Resource Configuration

Based on your cluster scale, it is recommended to adjust the following resource parameters:

**Sandbox Controller resource adjustment**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway resource adjustment**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set controller.resources.cpu=4 \
  --set controller.resources.memory=8Gi \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### Configure E2B Domain and Authentication

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### Expose Service via Ingress

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls
```

### Configure Gateway High Availability

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set gateway.replicaCount=3 \
  --set gateway.podAntiAffinity.type=hard \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### Enable Gateway Init Container

If special initialization operations are needed (such as sysctl tuning, etc.), you can enable the init container:

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set gateway.initContainer.enabled=true \
  --set gateway.initContainer.image.repository=busybox \
  --set gateway.initContainer.image.tag=1.36.1
```

---

## Uninstall

> **Note:**
> - `helm uninstall` will delete Deployments, Services, Webhook Configurations, and other chart-managed resources, but
    **will not delete CRDs**.
    > This is standard Helm behavior — CRDs are located in the `crds/` directory, and Helm only creates them during
    initial installation, leaving them untouched during uninstall and upgrade.
> - CRDs not being deleted means that already created Sandbox, SandboxSet, and other CR resources along with their
    associated Pods **will be retained**.
> - The Namespace will not be automatically deleted either. For a complete cleanup, refer to the "Complete Cleanup"
    section below.

**Uninstall order**: Uninstall Sandbox Manager first, then Sandbox Controller.

### Uninstall Sandbox Manager

```bash
helm uninstall agents-sandbox-manager -n sandbox-system
```

### Uninstall Sandbox Controller

```bash
helm uninstall agents-sandbox-controller -n sandbox-system
```

### Complete Cleanup (Optional)

To completely clean up all resources, including CRDs and Namespace:

```bash
# Delete all Sandbox-related CRDs (will cascade delete all Sandbox CRs and corresponding Pods)
kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd

# Delete the Namespace
kubectl delete ns sandbox-system
```

> ⚠️ **Warning**: Deleting CRDs will irreversibly destroy all Sandbox instances and their associated Pods. Make sure
> data is backed up before proceeding.

---

## Version Update Notes

### Major Changes in 0.6.0 Compared to 0.3.0

| Category                        | Changes                                                                                                                                                                                                                                                                                                                                                                          |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **New CRDs**                    | New `Commit` (`commits.agents.kruise.io`) and `PoolAutoscaler` (`poolautoscalers.agents.kruise.io`) CRDs from the Controller chart; new `TrafficPolicy`, `GlobalTrafficPolicy`, `SecurityProfile`, and `GlobalSecurityProfile` CRDs from the Manager chart for sandbox ingress/egress control. Controller CRDs must be manually updated during upgrade; the Manager chart's CRDs are updated automatically by `helm upgrade` |
| **Chart Architecture**          | The Manager Pod no longer runs an Envoy sidecar; the data plane is served solely by the Sandbox Gateway Deployment (Service port 7788), and the Manager Service listens on port 8080. All images resolve through a chart-wide `image.registry`. The Controller chart no longer supports server-side apply                                                                                                                                            |
| **Checkpoint, Pause & Commit**  | New `CheckpointControl` lifecycle with `PersistentContents` filesystem checkpoints and selectable checkpoint labels; pause waits for active checkpoints; new `Commit` CRD with registry authentication and a nerdctl-based commit/push job                                                                                                                                                                                                          |
| **Cost Optimization**           | Sandbox recycle (return-to-pool) to avoid cold starts; probe-driven auto-pause (`AutoPausePolicy`) and wake-on-traffic resume (`OnIngressTraffic`); `PauseStrategy` (Stop / Snapshot / CloudDisk) on SandboxSet; `PoolAutoscaler` for capacity-based and cron-driven scaling                                                                                                                                                                        |
| **Security & Egress Control**   | TrafficPolicy / SecurityProfile driven egress control (protocol and scheme matching, inline E2B L7 rules), MCP tool access control, header manipulation, and hardened CRD admission validation                                                                                                                                                                                                                                                       |
| **Identity & Tokens**           | FeatureGate-controlled Security Identity Provider issuing and propagating tokens across the sandbox lifecycle; tokens issued at claim time and re-issued after resume; proactive rotation via a SecurityTokenRefresh reconciler                                                                                                                                                                                                                     |
| **Gateway & Transport**         | Gateway JWT verification with optional runtime mTLS; CA bundle injection framework; the CSI mount and `/init` handshake move to TLS-capable transports; traffic access token header aligned with the E2B SDK                                                                                                                                                                                                                                           |
| **Upgrade & In-Place Update**   | Paused sandboxes can be upgraded via `SandboxUpdateOps` (two-phase flow) and the `CheckpointRestore` strategy; sandbox memory can be resized during claims; in-place resource resize checks relaxed                                                                                                                                                                                                                                                  |
| **E2B Compatibility**           | Claude Code support; pod-IP metadata; E2B >= v2.25.0 API key encoding; named cloned sandboxes; dynamically resolved sandbox domains; Volume API and Network API (Volume management endpoints temporarily disabled); dimension-aware API key quota                                                                                                                                                                                                     |
| **Controller & SandboxSet**     | SandboxSet auto-creates SandboxTemplate; a legacy revision hash prevents sandbox recreation on upgrade; `maxUnavailable` scoped to a startup-failure budget; scale-down candidates sorted by priority                                                                                                                                                                                                                                                |
| **Identifiers & CLI**           | Short, stable sandbox IDs reduce identifier length while preserving uniqueness across lifecycle operations; new `okactl` CLI for sandbox operations; multi-arch image publishing                                                                                                                                                                                                                                                                      |
| **Observability**               | New metrics for abnormal runtime containers; events and conditions for Pod creation failures and sandbox lifecycle; lifecycle tracing for controller and manager                                                                                                                                                                                                                                                                                     |

For detailed changes, please refer to the
[Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md#v060-alpha1).

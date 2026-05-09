---
title: Installation
---

## Overview

Sandbox Controller, Sandbox Manager, and Sandbox Gateway are three core components in the OpenKruise ecosystem that together form a complete Sandbox runtime environment:

- **Sandbox Controller**: Manages CRD resources related to Sandbox, including lifecycle management of SandboxSet, Sandbox, SandboxClaim, and SandboxTemplate.
- **Sandbox Manager**: Provides API services and control plane for Sandbox, responsible for scheduling, creating, and recycling Sandbox instances, supporting E2B protocol access.
- **Sandbox Gateway** (new in 0.2.0): An independent data plane gateway service built on Envoy + Golang Filter, responsible for traffic routing, load balancing, and circuit breaking protection, supporting independent scaling.

---

## Version Compatibility

| Component          | Chart Version | Image Version | Kubernetes Compatibility |
|--------------------|---------------|---------------|--------------------------|
| Sandbox Controller | 0.2.0         | v0.2.0        | `>= 1.28`                |
| Sandbox Manager    | 0.2.0         | v0.2.0        | `>= 1.28`                |
| Sandbox Gateway    | —             | v0.2.1        | `>= 1.28`                |

> **Note**: Sandbox Gateway is deployed together with the Sandbox Manager chart and does not require separate installation.

---

## Prerequisites

1. Kubernetes cluster version >= 1.28
2. Helm v3.5+ installed
3. Namespace created manually (see installation steps below)

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

> **Installation Order**: Sandbox Controller **must** be installed before Sandbox Manager, as it provides the CRD resources required by Sandbox Manager.

```bash
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0
```

### 3. Install Sandbox Manager

> **Required Parameters**: The following parameters must be explicitly specified during installation:
> - `e2b.adminApiKey`: E2B admin API Key for authentication
> - `ingress.className`: Ingress controller class name (e.g., `nginx`, `alb`, etc., depending on your cluster's Ingress implementation)

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

> **Note**: The 0.2.0 version of the Sandbox Manager chart will also deploy Sandbox Gateway, no additional installation required.

---

## Using China Mirror Registry

Due to network restrictions, users in China may not be able to pull images directly from Docker Hub. It is recommended to use China mirrors provided by Alibaba Cloud Container Registry.

### China Mirror Addresses

| Component          | Image Address                                                                         | Version        |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.2.0`       |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.2.0`       |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.2.1`       |
| Envoy Proxy        | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy`                    | `v1.33-latest` |

### Install with China Mirrors

**Install Sandbox Controller (using China mirror)**

```bash
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0 \
  --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller
```

**Install Sandbox Manager (using China mirror)**

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set controller.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager \
  --set proxy.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy \
  --set proxy.tag=v1.33-latest \
  --set gateway.image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway
```

> **Note**: To enable the Gateway init container, add the following:
> ```bash
> --set gateway.initContainer.enabled=true \
> --set gateway.initContainer.image.repository=registry.cn-beijing.aliyuncs.com/acs/busybox \
> --set gateway.initContainer.image.tag=1.36.1
> ```

---

## Upgrade via Helm

### Upgrade Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0
```

### Upgrade Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0
```

> **Note:**
> 1. Upgrade order: **Upgrade Sandbox Controller first, then Sandbox Manager** to ensure CRD compatibility.
> 2. Before upgrading, you **must** read the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
     to ensure you understand the incompatible changes in the new version.
> 3. If you want to reset parameters used in previous versions or configure new parameters, it is recommended to
     add `--reset-values` to the `helm upgrade` command.

### Upgrading from 0.1.0 to 0.2.0

Version 0.2.0 introduces an independent Sandbox Gateway component and multiple CRD changes. Please note the following during upgrade:

1. **Manually Update CRDs (Required)**: Helm upgrade **will not automatically update** CRD definitions under the `crds/` directory. Version 0.2.0 has significant CRD changes, and **new CRDs must be manually applied before running `helm upgrade`**, otherwise new features will not work properly.

   ```bash
   # Extract CRDs from chart package and apply (online installation example)
   helm pull openkruise/kruise-agents-sandbox-controller --version 0.2.0 --untar
   kubectl apply -f kruise-agents-sandbox-controller/crds/
   rm -rf kruise-agents-sandbox-controller
   ```

   Key CRD changes in 0.2.0 include:
    - **New Checkpoint CRD** (`checkpoints.agents.kruise.io`): For sandbox state checkpoint/snapshot management
    - **New `runtimes` field in all CRDs**: Sandbox, SandboxSet, SandboxClaim, and SandboxTemplate all have new runtime configuration
    - **New `updateStrategy` in SandboxSet**: Supports rolling update strategy configuration (`maxUnavailable`), along with `updatedReplicas` and `updatedAvailableReplicas` status fields
    - **SandboxClaim enhancements**: New dynamic volume mount (`dynamicVolumesMount`), in-place resource update (`inplaceUpdate.resources`), skip init runtime (`skipInitRuntime`); `ttlAfterCompleted` default changed from `5m` to `60m`
    - **Webhook enhancements**: New ValidatingWebhook for Pod Delete and Pod Eviction

2. **New Gateway Deployment**: 0.2.0 adds an independent Sandbox Gateway Deployment on top of the existing Envoy Sidecar in the Manager Pod, which can be scaled independently based on traffic pressure.
3. **Ingress Routing Changes**: 0.2.0 adds the `ingress.dataplaneService` parameter (default `sandbox-gateway`), and data plane traffic will be routed to the Gateway Service instead of the Manager Service. Please ensure your Ingress configuration is correctly updated.
4. **New Required Parameters**: `ingress.className` has an empty string default in 0.2.0 and must be explicitly specified.

---

## Manual Chart Download

If you cannot connect to `https://openkruise.github.io/charts/` in your production environment, you can manually download the chart package from [GitHub Releases](https://github.com/openkruise/charts/releases) and then install or upgrade it to your cluster.

```bash
helm install/upgrade agents-sandbox-controller /PATH/TO/CONTROLLER/CHART -n sandbox-system
helm install/upgrade agents-sandbox-manager /PATH/TO/MANAGER/CHART -n sandbox-system
```

---

## Options

### Sandbox Controller Installation Parameters

The following table shows all configurable parameters for the Sandbox Controller chart and their default values:

| Parameter                    | Description                                | Default                                                                                                                 |
|------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller replica count                   | `2`                                                                                                                     |
| `image.repository`           | Controller image repository                | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller image version                   | `v0.2.0`                                                                                                                |
| `image.pullPolicy`           | Image pull policy                          | `IfNotPresent`                                                                                                          |
| `webhook.port`               | Webhook service port                       | `9443`                                                                                                                  |
| `metrics.port`               | Metrics service port                       | `8443`                                                                                                                  |
| `healthProbe.port`           | Health check port                          | `8081`                                                                                                                  |
| `resources.limits.cpu`       | CPU resource limit                         | `2`                                                                                                                     |
| `resources.limits.memory`    | Memory resource limit                      | `4Gi`                                                                                                                   |
| `resources.requests.cpu`     | CPU resource request                       | `2`                                                                                                                     |
| `resources.requests.memory`  | Memory resource request                    | `4Gi`                                                                                                                   |
| `namespace.name`             | Deployment namespace                       | `sandbox-system`                                                                                                        |
| `serviceAccount.create`      | Whether to create ServiceAccount           | `true`                                                                                                                  |
| `serviceAccount.automount`   | Whether to auto-mount ServiceAccount Token | `true`                                                                                                                  |
| `serviceAccount.annotations` | ServiceAccount annotations                 | `{}`                                                                                                                    |
| `serviceAccount.name`        | ServiceAccount name to use                 | `""`                                                                                                                    |
| `rbac.create`                | Whether to create RBAC resources           | `true`                                                                                                                  |
| `imagePullSecrets`           | Image pull secrets list                    | `[]`                                                                                                                    |
| `nameOverride`               | Override Chart name                        | `""`                                                                                                                    |
| `fullnameOverride`           | Override full name                         | `""`                                                                                                                    |
| `podAnnotations`             | Pod annotations                            | `{}`                                                                                                                    |
| `podLabels`                  | Pod labels                                 | `{}`                                                                                                                    |
| `podSecurityContext`         | Pod security context                       | `{runAsNonRoot: true, seccompProfile: {type: RuntimeDefault}}`                                                          |
| `securityContext`            | Container security context                 | `{allowPrivilegeEscalation: false, capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true}` |
| `nodeSelector`               | Node selector for Pod scheduling           | `{}`                                                                                                                    |
| `tolerations`                | Tolerations for Pod scheduling             | `[]`                                                                                                                    |
| `affinity`                   | Affinity for Pod scheduling                | `{}`                                                                                                                    |

### Sandbox Manager Installation Parameters

The following table shows all configurable parameters for the Sandbox Manager chart and their default values:

#### Controller Parameters

| Parameter                          | Description                        | Default                      |
|------------------------------------|------------------------------------|------------------------------|
| `replicaCount`                     | Manager replica count              | `2`                          |
| `controller.repository`            | Controller image repository        | `openkruise/sandbox-manager` |
| `controller.tag`                   | Controller image version           | `v0.2.0`                     |
| `controller.pullPolicy`            | Image pull policy                  | `IfNotPresent`               |
| `controller.logLevel`              | Log level                          | `5`                          |
| `controller.infra`                 | Sandbox infrastructure type        | `sandbox-cr`                 |
| `controller.hostNetwork`           | Whether to use Host Network        | `false`                      |
| `controller.maxClaimWorkers`       | Maximum Claim worker threads       | `100`                        |
| `controller.maxCreateQPS`          | Maximum QPS for creating Sandbox   | `200`                        |
| `controller.extProcMaxConcurrency` | External processor max concurrency | `3000`                       |
| `controller.resources.cpu`         | Controller CPU resource limit      | `2`                          |
| `controller.resources.memory`      | Controller memory resource limit   | `4Gi`                        |

#### Proxy (Envoy) Parameters

| Parameter          | Description                  | Default            |
|--------------------|------------------------------|--------------------|
| `proxy.repository` | Envoy proxy image repository | `envoyproxy/envoy` |
| `proxy.tag`        | Envoy proxy image version    | `v1.33-latest`     |
| `proxy.pullPolicy` | Image pull policy            | `IfNotPresent`     |

#### Gateway Parameters (New)

| Parameter                             | Description                    | Default                      |
|---------------------------------------|--------------------------------|------------------------------|
| `gateway.replicaCount`                | Gateway replica count          | `2`                          |
| `gateway.image.repository`            | Gateway image repository       | `openkruise/sandbox-gateway` |
| `gateway.image.tag`                   | Gateway image version          | `v0.2.1`                     |
| `gateway.image.pullPolicy`            | Gateway image pull policy      | `IfNotPresent`               |
| `gateway.resources.cpu`               | Gateway CPU resources          | `2`                          |
| `gateway.resources.memory`            | Gateway memory resources       | `4Gi`                        |
| `gateway.livenessProbe`               | Liveness probe configuration   | See configuration below      |
| `gateway.readinessProbe`              | Readiness probe configuration  | See configuration below      |
| `gateway.envoy.admin.address`         | Envoy admin interface address  | `127.0.0.1`                  |
| `gateway.envoy.admin.port`            | Envoy admin interface port     | `9901`                       |
| `gateway.envoy.listener.address`      | Envoy listener address         | `0.0.0.0`                    |
| `gateway.envoy.listener.port`         | Envoy listener port            | `10000`                      |
| `gateway.envoy.logLevel`              | Envoy log level                | `warn`                       |
| `gateway.envoy.concurrency`           | Envoy concurrency              | `4`                          |
| `gateway.envoy.circuitBreakers`       | Circuit breaker configuration  | See configuration below      |
| `gateway.service.type`                | Gateway Service type           | `ClusterIP`                  |
| `gateway.service.port`                | Gateway Service port           | `7788`                       |
| `gateway.service.targetPort`          | Gateway Service target port    | `10000`                      |
| `gateway.podAntiAffinity.type`        | Pod anti-affinity type         | `soft`                       |
| `gateway.podAntiAffinity.weight`      | Pod anti-affinity weight       | `100`                        |
| `gateway.podAntiAffinity.topologyKey` | Pod anti-affinity topology key | `kubernetes.io/hostname`     |
| `gateway.initContainer.enabled`       | Whether to enable init container | `false`                    |

#### E2B Protocol Parameters

| Parameter         | Description                          | Default           |
|-------------------|--------------------------------------|-------------------|
| `e2b.domain`      | E2B protocol domain                  | `your.domain.com` |
| `e2b.enableAuth`  | Whether to enable E2B authentication | `true`            |
| `e2b.adminApiKey` | E2B admin API Key                    | `""`              |
| `e2b.maxTimeout`  | E2B max timeout (seconds)            | `2592000`         |

#### Service and Ingress Parameters

| Parameter                  | Description                         | Default               |
|----------------------------|-------------------------------------|-----------------------|
| `service.type`             | Manager Service type                | `ClusterIP`           |
| `service.port`             | Manager Service port                | `7788`                |
| `ingress.className`        | Ingress controller class name       | `""`                  |
| `ingress.annotations`      | Ingress annotations                 | `{}`                  |
| `ingress.certSecretName`   | Ingress TLS certificate Secret name | `sandbox-manager-tls` |
| `ingress.dataplaneService` | Data plane Service name             | `sandbox-gateway`     |

#### Other Parameters

| Parameter                    | Description                                | Default                                                                                                                                                       |
|------------------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagePullSecrets`           | Image pull secrets                         | `{}`                                                                                                                                                          |
| `nameOverride`               | Override Chart name                        | `""`                                                                                                                                                          |
| `fullnameOverride`           | Override full name                         | `""`                                                                                                                                                          |
| `serviceAccount.automount`   | Whether to auto-mount ServiceAccount Token | `true`                                                                                                                                                        |
| `serviceAccount.annotations` | ServiceAccount annotations                 | `{}`                                                                                                                                                          |
| `serviceAccount.name`        | ServiceAccount name                        | `""`                                                                                                                                                          |
| `podAnnotations`             | Pod annotations                            | `{}`                                                                                                                                                          |
| `podLabels`                  | Pod labels                                 | `{}`                                                                                                                                                          |
| `podSecurityContext`         | Pod security context                       | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `securityContext`            | Container security context                 | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`               | Node selector for Pod scheduling           | `{}`                                                                                                                                                          |
| `tolerations`                | Tolerations for Pod scheduling             | `[]`                                                                                                                                                          |
| `affinity`                   | Affinity for Pod scheduling                | Default soft Pod anti-affinity (`preferredDuringSchedulingIgnoredDuringExecution`), spread by hostname                                                        |

These parameters can be set via `--set key=value[,key=value]` in the `helm install` or `helm upgrade` commands.

**Gateway Default Probe Configuration Reference:**

```yaml
# Liveness probe
gateway.livenessProbe:
  tcpSocket:
    port: 10000
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# Readiness probe
gateway.readinessProbe:
  tcpSocket:
    port: 10000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**Gateway Default Circuit Breaker Configuration Reference:**

```yaml
gateway.envoy.circuitBreakers:
  enabled: true
  thresholds:
    - priority: DEFAULT
      maxConnections: 32768
      maxPendingRequests: 32768
      maxRequests: 65536
      maxRetries: 5
```

---

## Best Practices

### Custom Resource Configuration

Based on your cluster scale, it is recommended to adjust the following resource parameters:

**Sandbox Controller resource adjustment**

```bash
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway resource adjustment**

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set controller.resources.cpu=4 \
  --set controller.resources.memory=8Gi \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### Configure E2B Domain and Authentication

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### Expose Service via Ingress

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls
```

### Configure Gateway High Availability

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
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
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set gateway.initContainer.enabled=true \
  --set gateway.initContainer.image.repository=busybox \
  --set gateway.initContainer.image.tag=1.36.1
```

---

## Uninstall

> **Note:**
> - `helm uninstall` will delete Deployments, Services, Webhook Configurations, and other chart-managed resources, but **will not delete CRDs**.
>   This is standard Helm behavior — CRDs are located in the `crds/` directory, and Helm only creates them during initial installation, leaving them untouched during uninstall and upgrade.
> - CRDs not being deleted means that already created Sandbox, SandboxSet, and other CR resources along with their associated Pods **will be retained**.
> - The Namespace will not be automatically deleted either. For a complete cleanup, refer to the "Complete Cleanup" section below.

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

> ⚠️ **Warning**: Deleting CRDs will irreversibly destroy all Sandbox instances and their associated Pods. Make sure data is backed up before proceeding.

---

## Version Update Notes

### Major Changes in 0.2.0 Compared to 0.1.0

| Category          | Changes                                                                                                                |
|-------------------|------------------------------------------------------------------------------------------------------------------------|
| **Architecture**  | Added independent Sandbox Gateway Deployment, providing an independently scalable data plane gateway on top of the existing Envoy Sidecar in Manager |
| **CRD Changes**   | New Checkpoint CRD; new `runtimes` field in all CRDs; new `updateStrategy` in SandboxSet; new dynamic volume mount, in-place resource update in SandboxClaim (CRDs must be manually updated during upgrade) |
| **Webhook**       | New ValidatingWebhook for Pod Delete and Pod Eviction, enhancing Pod lifecycle management                              |
| **Log Level**     | Controller log level default changed from `3` to `5` for easier troubleshooting                                        |
| **Ingress**       | New `dataplaneService` parameter; `className` default changed to empty string, must be explicitly specified             |
| **E2B**           | `adminApiKey` default changed to empty string (was `admin-987654321` in 0.1.0), must be explicitly specified during installation |
| **Gateway**       | Complete set of new Gateway configuration options, including replica count, resources, probes, Envoy configuration, circuit breakers, Pod anti-affinity, etc. |
| **Security**      | `podSecurityContextAllowPrivilegeEscalation` parameter removed, now managed uniformly in `securityContext`             |
| **RBAC**          | New permissions for `pods/resize`, `checkpoints`, `sandboxtemplates` resources                                         |

For detailed changes, please refer to the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)

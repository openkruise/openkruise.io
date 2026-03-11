---
title: Installation
---

## Overview

Sandbox Controller and Sandbox Manager are two core components in the OpenKruise ecosystem:

- **Sandbox Controller**: Manages CRD resources related to Sandbox, including lifecycle management of SandboxSet,
  Sandbox, SandboxClaim, and SandboxTemplate.
- **Sandbox Manager**: Provides API services for Sandbox, containing controllers and Envoy proxies, supporting E2B
  protocol access.

---

## Version Compatibility

| Component          | Version | Kubernetes Compatibility |
|--------------------|---------|--------------------------|
| Sandbox Controller | v0.1.0  | `>= 1.24`                |
| Sandbox Manager    | v0.1.0  | `>= 1.24`                |

---

## Prerequisites

1. Kubernetes cluster version >= 1.24
2. Helm v3.5+ installed
3. OpenKruise installed (Sandbox Controller depends on some features of Kruise)
4. Namespace created manually

---

## Install via Helm

### 1. Add OpenKruise Charts Repository

```bash
helm repo add openkruise https://openkruise.github.io/charts/
helm repo update
```

### 2. Install Sandbox Controller

**Manually Create Namespace**

```bash
kubectl create ns <namespace>
```

**Installation Order**: Sandbox Controller must be installed before Sandbox Manager, as it provides the CRD resources
required by Sandbox Manager.

```bash 
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller -n <namespace> --version 0.1.0
```

### 3. Install Sandbox Manager

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager -n <namespace> --version 0.1.0
```

---

## Upgrade via Helm

### Upgrade Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/kruise-agents-sandbox-controller -n <namespace> --version 0.1.0
```

### Upgrade Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/kruise-agents-sandbox-manager -n <namespace> --version 0.1.0
```

**Note:**

1. Before upgrading, you **must** read the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
   to ensure you understand the incompatible changes in the new version.
2. If you want to reset parameters used in previous versions or configure new parameters, it is recommended to
   add `--reset-values` to the `helm upgrade` command.

---

## Manual Chart Download

If you cannot connect to `https://openkruise.github.io/charts/` in your production environment, you can manually
download the chart package from [GitHub Releases](https://github.com/openkruise/charts/releases) and then install or
upgrade it to your cluster.

```bash
helm install/upgrade agents-sandbox-controller /PATH/TO/CONTROLLER/CHART -n <namespace> helm install/upgrade agents-sandbox-manager /PATH/TO/MANAGER/CHART -n <namespace>
```

---

## Options

### Sandbox Controller Installation Parameters

The following table shows all configurable parameters for the Sandbox Controller chart and their default values:

| Parameter                    | Description                                | Default                                                                                                                 |
|------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller replica count                   | `2`                                                                                                                     |
| `image.repository`           | Controller image repository                | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller image version                   | `v0.1.0`                                                                                                                |
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
| `controller.tag`                   | Controller image version           | `v0.1.0`                     |
| `controller.pullPolicy`            | Image pull policy                  | `IfNotPresent`               |
| `controller.logLevel`              | Log level                          | `3`                          |
| `controller.infra`                 | Sandbox infrastructure type        | `sandbox-cr`                 |
| `controller.hostNetwork`           | Whether to use Host Network        | `false`                      |
| `controller.maxClaimWorkers`       | Maximum Claim worker threads       | `100`                        |
| `controller.maxCreateQPS`          | Maximum QPS for creating Sandbox   | `200`                        |
| `controller.extProcMaxConcurrency` | External processor max concurrency | `3000`                       |
| `controller.resources.cpu`         | Controller CPU resource limit      | `2`                          |
| `controller.resources.memory`      | Controller memory resource limit   | `4Gi`                        |

#### Proxy (Envoy) Parameters

| Parameter                | Description                  | Default            |
|--------------------------|------------------------------|--------------------|
| `proxy.repository`       | Envoy proxy image repository | `envoyproxy/envoy` |
| `proxy.tag`              | Envoy proxy image version    | `v1.33-latest`     |
| `proxy.pullPolicy`       | Image pull policy            | `IfNotPresent`     |
| `proxy.resources.cpu`    | Envoy CPU resources          | `2`                |
| `proxy.resources.memory` | Envoy memory resources       | `4Gi`              |

#### E2B Protocol Parameters

| Parameter         | Description                          | Default           |
|-------------------|--------------------------------------|-------------------|
| `e2b.domain`      | E2B protocol domain                  | `your.domain.com` |
| `e2b.enableAuth`  | Whether to enable E2B authentication | `true`            |
| `e2b.adminApiKey` | E2B admin API Key                    | `admin-987654321` |
| `e2b.maxTimeout`  | E2B max timeout (seconds)            | `2592000`         |

#### Service and Ingress Parameters

| Parameter                | Description                         | Default               |
|--------------------------|-------------------------------------|-----------------------|
| `service.type`           | Service type                        | `ClusterIP`           |
| `service.port`           | Envoy proxy service port            | `7788`                |
| `ingress.className`      | Ingress class name                  | `nginx`               |
| `ingress.annotations`    | Ingress annotations                 | `{}`                  |
| `ingress.certSecretName` | Ingress TLS certificate Secret name | `sandbox-manager-tls` |

#### Other Parameters

| Parameter                                    | Description                                | Default                                                                                                                                                       |
|----------------------------------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagePullSecrets`                           | Image pull secrets                         | `{}`                                                                                                                                                          |
| `nameOverride`                               | Override Chart name                        | `""`                                                                                                                                                          |
| `fullnameOverride`                           | Override full name                         | `""`                                                                                                                                                          |
| `serviceAccount.automount`                   | Whether to auto-mount ServiceAccount Token | `true`                                                                                                                                                        |
| `serviceAccount.annotations`                 | ServiceAccount annotations                 | `{}`                                                                                                                                                          |
| `serviceAccount.name`                        | ServiceAccount name                        | `""`                                                                                                                                                          |
| `podAnnotations`                             | Pod annotations                            | `{}`                                                                                                                                                          |
| `podLabels`                                  | Pod labels                                 | `{}`                                                                                                                                                          |
| `podSecurityContext`                         | Pod security context                       | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `podSecurityContextAllowPrivilegeEscalation` | Whether to allow privilege escalation      | `false`                                                                                                                                                       |
| `securityContext`                            | Container security context                 | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`                               | Node selector                              | `{}`                                                                                                                                                          |
| `tolerations`                                | Tolerations                                | `[]`                                                                                                                                                          |
| `affinity`                                   | Affinity                                   | Prefer Pod anti-affinity                                                                                                                                      |

These parameters can be set via `--set key=value[,key=value]` in the `helm install` or `helm upgrade` commands.

---

## Best Practices

### Custom Resource Configuration

Based on your cluster scale, it is recommended to adjust the following resource parameters:

Sandbox Controller resource adjustment

```bash
$ helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
--set resources.limits.cpu=4 \
--set resources.limits.memory=8Gi \
--set resources.requests.cpu=2 \
--set resources.requests.memory=4Gi
```

Sandbox Manager resource adjustment

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set controller.resources.cpu=4 \
--set controller.resources.memory=8Gi
```

### Configure E2B Domain and Authentication

```bash 
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set e2b.domain=sandbox.example.com \
--set e2b.enableAuth=true \
--set e2b.adminApiKey=your-secure-api-key
```

### Expose Service via Ingress

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set ingress.className=nginx \
--set ingress.annotations."cert-manager.io/cluster-issuer"=letsencrypt-prod \
--set ingress.certSecretName=sandbox-manager-tls
```

---

## Uninstall

**Note:** Uninstalling will delete all Sandbox-related resources, including webhook configurations, services, namespace,
instances, and all Pods under Sandbox. Please proceed with caution! (CRDs and namespace will not be deleted)
**CRD Cleanup**: CRD resources and Namespace will not be automatically cleaned up during upgrade and uninstallation.
Please perform manual operations if you need to uninstall or upgrade.

### Uninstall Sandbox Manager

```bash
helm uninstall agents-sandbox-manager
```

### Uninstall Sandbox Controller

```bash 
helm uninstall agents-sandbox-controller
```

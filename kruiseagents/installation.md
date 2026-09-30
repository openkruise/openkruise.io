---
title: Installation
---

## Overview

Sandbox Controller, Sandbox Manager, and Sandbox Gateway are three core components in the OpenKruise ecosystem that
together form a complete Sandbox runtime environment:

- **Sandbox Controller**: Manages CRD resources related to Sandbox, including lifecycle management of SandboxSet,
  Sandbox, SandboxClaim, and SandboxTemplate.
- **Sandbox Manager**: Provides API services and control plane for Sandbox, responsible for scheduling, creating, and
  recycling Sandbox instances, supporting E2B protocol access.
- **Sandbox Gateway** (new in 0.2.0): An independent data plane gateway service built on Envoy + Golang Filter,
  responsible for traffic routing, load balancing, and circuit breaking protection, supporting independent scaling.

This page installs all three components with Helm and verifies the result. Commands are written for bash (Linux,
macOS, or WSL/Git Bash on Windows). Anything written as `<a-placeholder>` is a variable you must resolve first in
[Step 0: Prepare installation parameters](#step-0-prepare-installation-parameters) — running a command while a
placeholder is still literal will fail.

## Version Compatibility

| Component          | Chart Version | Image Version | Kubernetes Compatibility |
|--------------------|---------------|---------------|--------------------------|
| Sandbox Controller | 0.3.0         | v0.3.0        | `>= 1.28`                |
| Sandbox Manager    | 0.3.0         | v0.3.0        | `>= 1.28`                |
| Sandbox Gateway    | —             | v0.3.0        | `>= 1.28`                |

> **Note**: Sandbox Gateway has no chart of its own. It is deployed by the Sandbox Manager chart (0.2.0+) and does not
> require separate installation.

## Prerequisites

Check each requirement with the command in the last column before you start:

| #   | Requirement                                             | Minimum version | How to check                                             |
|-----|---------------------------------------------------------|-----------------|-----------------------------------------------------------|
| 1   | A Kubernetes cluster you can deploy to                  | 1.28            | `kubectl version`                                         |
| 2   | `kubectl` configured against that cluster                | —               | `kubectl version --client` ([install][kubectl-install])     |
| 3   | Helm                                                    | 3.5             | `helm version` ([install][helm-install])                   |
| 4   | An Ingress controller running in the cluster            | —               | `kubectl get ingressclass`                                 |

[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[helm-install]: https://helm.sh/docs/intro/install/

Notes on the Ingress controller:

- The Sandbox Manager chart **always renders an Ingress**, and `ingress.className` is a `required` chart value:
  `helm install` fails immediately if it is empty or omitted. The parameter is mandatory even if you do not expose the
  service through Ingress (for example when you only use `kubectl port-forward` or in-cluster Service URLs).
- If `kubectl get ingressclass` returns nothing, install an Ingress controller first. For example, with ingress-nginx
  (class name `nginx`, needs Internet access to `kubernetes.github.io` and Docker Hub):

  ```bash
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    -n ingress-nginx --create-namespace
  ```

- Accessing the service from outside the cluster over HTTPS additionally requires DNS records and a TLS certificate.
  For a first end-to-end verification you can skip both — use the `kubectl port-forward` path described in
  [E2B SDK integration](./user-manuals/e2b-client.md) instead.

## Install via Helm

### Step 0: Prepare installation parameters

The installation commands below use the placeholders listed here. Resolve every one of them before running Step 3 and
Step 4; each row tells you where the value comes from.

| Placeholder            | Helm value            | What it is                                                                                                                       | How to get a value                                                                                                                                                            |
|------------------------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<your-api-key>`      | `e2b.adminApiKey`     | The admin API key that clients use to authenticate against Sandbox Manager. It is a secret **you generate yourself**; it is unrelated to any e2b.dev account. | Generate one: `openssl rand -hex 32` (or any sufficiently long random string)                                                                                          |
| `<your-ingress-class>`| `ingress.className`   | The Ingress class name of your cluster's Ingress controller (for example `nginx`, `alb`).                                          | `kubectl get ingressclass -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'`                                                                                          |
| `<your-domain>`       | `e2b.domain`          | The E2B protocol domain. It determines both the host rules of the generated Ingress and the domain embedded in the sandbox addresses returned to SDK clients. | See the table below.                                                                                                                                                           |

**Choosing `e2b.domain` (important).** In the 0.3.0 chart, the default value of `e2b.domain` is the unusable
placeholder `your.domain.com`, and the chart passes it to the manager as a static `--e2b-domain`. Keeping the default
makes every sandbox address unresolvable. Pick one of the following instead:

| Scenario                                                                    | Value for `<your-domain>`              | Effect                                                                                                                                                                              |
|-----------------------------------------------------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Production: clients reach the service through a real domain you control     | Your domain, e.g. `sandbox.example.com` | Ingress hosts become `api.sandbox.example.com` / `*.sandbox.example.com` / `sandbox.example.com`; DNS must resolve them to the Ingress endpoint, and a TLS certificate is required for HTTPS. |
| Quick verification, multi-domain setups, or no public domain yet             | Empty string `""`                      | Dynamic resolution: the manager derives the domain from each request's `Host` header. Works with `kubectl port-forward` and in-cluster access without any DNS configuration.            |

> **Note on SDK key format**: OpenKruise admin keys are plain strings, not the `e2b_`-prefixed format that stock E2B
> SDKs validate locally. When you later use the E2B SDK, either wrap the key with `encode_for_e2b_sdk` or disable the
> local check — see [API Keys and Teams](./user-manuals/api-keys-and-teams.md). The key itself always authenticates
> server-side.

### Step 1: Add the OpenKruise Charts Repository

```bash
## Add openkruise charts repository (requires access to openkruise.github.io)
helm repo add openkruise https://openkruise.github.io/charts/

## Update repository (if openkruise charts repository was previously installed)
helm repo update

## Verify both charts are visible and 0.3.0 is listed
helm search repo openkruise/agents-sandbox-controller --versions
helm search repo openkruise/agents-sandbox-manager --versions
```

### Step 2: Create the Namespace

```bash
## Idempotent: succeeds both when the namespace exists and when it does not
kubectl create namespace sandbox-system --dry-run=client -o yaml | kubectl apply -f -
```

### Step 3: Install Sandbox Controller

> **Installation Order**: Sandbox Controller **must** be installed before Sandbox Manager, as it provides the CRD
> resources required by Sandbox Manager.

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0
```

Wait until both replicas are Ready (expect `pod/... condition met`):

```bash
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l app.kubernetes.io/name=agents-sandbox-controller --timeout=300s
```

If the wait times out, check pod events before continuing — see [Troubleshooting](#troubleshooting).

### Step 4: Install Sandbox Manager

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

> **Required parameters**: `e2b.adminApiKey`, `ingress.className`, and `e2b.domain` must be given explicitly. The chart
> rejects an empty `e2b.adminApiKey` or `ingress.className` at render time, and leaving `e2b.domain` at its default
> produces unusable sandbox addresses (see [Step 0](#step-0-prepare-installation-parameters)).
>
> **Note**: The 0.3.0 version of the Sandbox Manager chart also deploys Sandbox Gateway, no additional installation
> required.

Wait until the manager and gateway replicas are Ready:

```bash
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l component=agents-sandbox-manager --timeout=300s
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l app.kubernetes.io/name=sandbox-gateway --timeout=300s
```

## Verify the Installation

Run the following checks after Step 4. All of them must pass before you continue to any sandbox workload.

### 1. Deployments and Pods

```bash
kubectl get deployments,pods -n sandbox-system
```

Expected result — three Deployments, all `READY` counts equal to their `UP-TO-DATE` counts, and all Pods `Running`
and `2/2 READY` (each manager Pod also contains an `envoy-proxy` sidecar container):

| Deployment                | Replicas | Containers per Pod                     |
|---------------------------|----------|-----------------------------------------|
| `agents-sandbox-controller` | 2        | `manager`                               |
| `agents-sandbox-manager`   | 2        | `controller` + `envoy-proxy`            |
| `sandbox-gateway`          | 2        | `envoy` (+ optional init container)     |

### 2. CRDs

```bash
kubectl get crd | grep agents.kruise.io
```

Expected result — exactly these six CRDs:

```text
checkpoints.agents.kruise.io
sandboxclaims.agents.kruise.io
sandboxes.agents.kruise.io
sandboxsets.agents.kruise.io
sandboxtemplates.agents.kruise.io
sandboxupdateops.agents.kruise.io
```

### 3. Services

```bash
kubectl get svc -n sandbox-system
```

Expected result (the names assume the default release names used on this page):

| Service                 | Ports                                   | Purpose                                                     |
|-------------------------|-----------------------------------------|-------------------------------------------------------------|
| `agents-sandbox-manager` | `7788` (envoy data plane), `8080` (E2B management API), `9002` (gRPC) | E2B API endpoint and built-in traffic proxy |
| `sandbox-gateway`       | `7788`                                  | Independent data plane gateway                              |

### 4. Manager API health check

Run a one-off curl Pod in the cluster and expect HTTP `200`:

```bash
kubectl run manager-health-check -n sandbox-system --rm -i --restart=Never \
  --image=curlimages/curl --command -- \
  curl -s -o /dev/null -w '%{http_code}\n' \
  http://agents-sandbox-manager.sandbox-system.svc.cluster.local:8080/health
```

> If the node cannot pull `curlimages/curl` from Docker Hub, substitute any curl image reachable from your nodes, or
> skip this check — checks 1–3 already prove the control plane is up.

### 5. Ingress address (only needed for external domain access)

```bash
kubectl get ingress agents-sandbox-manager -n sandbox-system
kubectl get ingress agents-sandbox-manager -n sandbox-system \
  -o jsonpath='{range .status.loadBalancer.ingress[*]}{.hostname}{.ip}{"\n"}{end}'
```

The second command prints the load balancer address assigned to the Ingress. Point the DNS records for
`api.<your-domain>`, `*.<your-domain>`, and `<your-domain>` at it. If the ADDRESS column stays empty, no Ingress
controller has claimed the Ingress — check [Prerequisites](#prerequisites). For HTTPS access, install a certificate
covering all three hosts: see [Use a self-signed certificate](./best-practices/use-self-signed-cert.md) or
[cert-manager](./best-practices/cert-manager.md).

> The Ingress name is `agents-sandbox-manager` because it follows the Helm release name used on this page. It differs
> if you chose another release name.

## What you still need before creating sandboxes

A green installation only means the control plane is up. Creating and using your first sandbox additionally requires:

1. **A sandbox template** — a `SandboxSet` that pre-warms sandbox instances from a runtime image (for example
   `e2bdev/code-interpreter`). Deploy one in a few minutes with the end-to-end tutorial
   [Running E2B Code Interpreter Sandbox](./best-practices/running-e2b-for-code-interpreter.md).
2. **A client access path** — pick one of the five integration methods (native protocol, private protocol, URL
   parameters, in-cluster, port-forward) in [E2B SDK integration](./user-manuals/e2b-client.md).
3. **API key management** (optional) — team keys and quotas in [API Keys and Teams](./user-manuals/api-keys-and-teams.md).

## Using China Mirror Registry

The default image repositories (Docker Hub: `openkruise/*`, `envoyproxy/envoy`) require Internet access to Docker Hub.
If your nodes are in mainland China and cannot pull from Docker Hub, use the Alibaba Cloud Container Registry mirrors
below for all images of both charts.

### China Mirror Addresses

| Component          | Image Address                                                                         | Version        |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.3.0`       |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.3.0`       |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.3.0`       |
| Envoy Proxy        | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy`                    | `v1.33-latest` |

### Install with China Mirrors

**Install Sandbox Controller (using China mirror)**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0 \
  --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller
```

**Install Sandbox Manager (using China mirror)**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
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

> **Carry your parameters over.** `helm upgrade` does **not** reuse the `--set` values from the previous
> install unless you pass `--reuse-values`. Repeating the required parameters on every upgrade is the
> safe default — without them the upgrade is rejected (`e2b.adminApiKey is required`) or silently resets
> your configuration.

### Upgrade Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0
```

### Upgrade Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

> **Note:**
> 1. Upgrade order: **Upgrade Sandbox Controller first, then Sandbox Manager** to ensure CRD compatibility.
> 2. Before upgrading, you **must** read the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
>     to ensure you understand the incompatible changes in the new version.
> 3. If you want to reset parameters used in previous versions or configure new parameters, it is recommended to
>     add `--reset-values` to the `helm upgrade` command.
> 4. If you upgraded with `--set` options different from the ones shown here, repeat **your** values instead — the
>     placeholders above are the same ones resolved in [Step 0](#step-0-prepare-installation-parameters).

### Upgrading from 0.1.0 to 0.2.0

Version 0.2.0 introduces an independent Sandbox Gateway component and multiple CRD changes. Please note the following
during upgrade:

1. **Manually Update CRDs (Required)**: Helm upgrade **will not automatically update** CRD definitions under the `crds/`
   directory. Version 0.2.0 has significant CRD changes, and **new CRDs must be manually applied before
   running `helm upgrade`**, otherwise new features will not work properly.

   ```bash
   # Extract CRDs from chart package and apply (online installation example)
   helm pull openkruise/agents-sandbox-controller --version 0.2.0 --untar
   kubectl apply -f agents-sandbox-controller/crds/
   rm -rf agents-sandbox-controller
   ```

   Key CRD changes in 0.2.0 include:
    - **New Checkpoint CRD** (`checkpoints.agents.kruise.io`): For sandbox state checkpoint/snapshot management
    - **New `runtimes` field in all CRDs**: Sandbox, SandboxSet, SandboxClaim, and SandboxTemplate all have new runtime
      configuration
    - **New `updateStrategy` in SandboxSet**: Supports rolling update strategy configuration (`maxUnavailable`), along
      with `updatedReplicas` and `updatedAvailableReplicas` status fields
    - **SandboxClaim enhancements**: New dynamic volume mount (`dynamicVolumesMount`), in-place resource update (
      `inplaceUpdate.resources`), skip init runtime (`skipInitRuntime`); `ttlAfterCompleted` default changed from `5m`
      to `60m`
    - **Webhook enhancements**: New ValidatingWebhook for Pod Delete and Pod Eviction

2. **New Gateway Deployment**: 0.2.0 adds an independent Sandbox Gateway Deployment on top of the existing Envoy Sidecar
   in the Manager Pod, which can be scaled independently based on traffic pressure.
3. **Ingress Routing Changes**: 0.2.0 adds the `ingress.dataplaneService` parameter (default `sandbox-gateway`), and
   data plane traffic will be routed to the Gateway Service instead of the Manager Service. Please ensure your Ingress
   configuration is correctly updated.
4. **New Required Parameters**: `ingress.className` has an empty string default in 0.2.0 and must be explicitly
   specified.

### Upgrading from 0.2.0 to 0.3.0

Version 0.3.0 introduces Sandbox batch upgrade capability (SandboxUpdateOps) and Gateway optimizations. Please note the
following during upgrade:

1. **Manually Update CRDs (Required)**: Helm upgrade **will not automatically update** CRD definitions under the `crds/`
   directory. 0.3.0 adds new CRDs and has multiple changes to existing CRDs, and **new CRDs must be manually
   applied before running `helm upgrade`**, otherwise new features will not work properly.

   ```bash
   # Extract CRDs from chart package and apply (online installation example)
   helm pull openkruise/agents-sandbox-controller --version 0.3.0 --untar
   kubectl apply -f agents-sandbox-controller/crds/
   rm -rf agents-sandbox-controller
   ```

   Key CRD changes in 0.3.0 include:
    - **New SandboxUpdateOps CRD** (`sandboxupdateops.agents.kruise.io`): For batch upgrading Sandbox instances,
      supports selecting target sandboxes via label selectors, configuring rolling update strategy (`maxUnavailable`),
      and tracking upgrade progress (`updatedReplicas`, `updatingReplicas`, `failedReplicas`)
    - **New `lifecycle` field in Sandbox**: Supports upgrade lifecycle hooks, including `preUpgrade` (executed before
      upgrade, for backing up workspace data) and `postUpgrade` (executed after upgrade, for restoring workspace data),
      each hook supports `exec` command and `timeoutSeconds` timeout configuration
    - **New `upgradePolicy` field in Sandbox**: Defines sandbox upgrade policy type (e.g., `Recreate`), disabled when
      empty
    - **SandboxClaim enhancements**: `claimTimeout` adds minimum value validation (must be >= 1s); `waitReadyTimeout`
      adds minimum value validation (must be >= 1s);

2. **New Webhook**: New ValidatingWebhook for SandboxUpdateOps resource (`v-suo.kb.io`), validates CREATE and UPDATE
   operations.

3. **RBAC Changes**: Controller adds permissions for `sandboxupdateops` and `sandboxupdateops/status` resources.

4. **Gateway Port Changes**: Gateway listener port changed from `10000` to `7788`, Gateway Service port and target port
   unified to `7788`. If you have hardcoded port `10000` in Ingress or other configurations, **you must update** it to
   `7788`.

5. **Gateway Graceful Shutdown**: Gateway Envoy container adds `preStop` lifecycle hook, drains listener connections (
   `drain_listeners?graceful`) before termination, waits for `drainTimeSeconds` (default 30s) before exiting, avoiding
   traffic interruption during upgrade/scale-down.

6. **Envoy Configuration Enhancements**:
    - New `gateway.envoy.drainTimeSeconds` (drain time, default `30`)
    - New `gateway.envoy.streamIdleTimeout` (stream idle timeout, default `600s`)
    - New `gateway.envoy.connectTimeout` (connection timeout, default `5s`, previously hardcoded as `5s`)
    - `gateway.envoy.concurrency` default changed from `4` to empty string, when not specified, it matches
      `gateway.resources.cpu` value

---

## Manual Chart Download

If you cannot connect to `https://openkruise.github.io/charts/` from the target environment, download the chart
packages from [GitHub Releases](https://github.com/openkruise/charts/releases) (requires access to `github.com`) on a
machine that can, transfer them, and install from the local files. Asset names follow the
`<chart>-<version>.tgz` pattern:

```bash
# Download the two chart packages (requires access to github.com)
curl -L -o agents-sandbox-controller-0.3.0.tgz \
  https://github.com/openkruise/charts/releases/download/agents-sandbox-controller-0.3.0/agents-sandbox-controller-0.3.0.tgz
curl -L -o agents-sandbox-manager-0.3.0.tgz \
  https://github.com/openkruise/charts/releases/download/agents-sandbox-manager-0.3.0/agents-sandbox-manager-0.3.0.tgz

# Install from the local packages — same required parameters as the online install
helm install agents-sandbox-controller ./agents-sandbox-controller-0.3.0.tgz \
  -n sandbox-system
helm install agents-sandbox-manager ./agents-sandbox-manager-0.3.0.tgz \
  -n sandbox-system \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

For upgrades, replace `install` with `upgrade` and keep the same parameters.

---

## Options

### Sandbox Controller Installation Parameters

The following table shows all configurable parameters for the Sandbox Controller chart and their default values:

| Parameter                    | Description                                | Default                                                                                                                 |
|------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller replica count                   | `2`                                                                                                                     |
| `image.repository`           | Controller image repository                | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller image version                   | `v0.3.0`                                                                                                                |
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
| `controller.tag`                   | Controller image version           | `v0.3.0`                     |
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

| Parameter                             | Description                      | Default                                                    |
|---------------------------------------|----------------------------------|------------------------------------------------------------|
| `gateway.replicaCount`                | Gateway replica count            | `2`                                                        |
| `gateway.image.repository`            | Gateway image repository         | `openkruise/sandbox-gateway`                               |
| `gateway.image.tag`                   | Gateway image version            | `v0.3.0`                                                   |
| `gateway.image.pullPolicy`            | Gateway image pull policy        | `IfNotPresent`                                             |
| `gateway.resources.cpu`               | Gateway CPU resources            | `2`                                                        |
| `gateway.resources.memory`            | Gateway memory resources         | `4Gi`                                                      |
| `gateway.livenessProbe`               | Liveness probe configuration     | See configuration below                                    |
| `gateway.readinessProbe`              | Readiness probe configuration    | See configuration below                                    |
| `gateway.envoy.admin.address`         | Envoy admin interface address    | `127.0.0.1`                                                |
| `gateway.envoy.admin.port`            | Envoy admin interface port       | `9901`                                                     |
| `gateway.envoy.listener.address`      | Envoy listener address           | `0.0.0.0`                                                  |
| `gateway.envoy.listener.port`         | Envoy listener port              | `7788`                                                     |
| `gateway.envoy.logLevel`              | Envoy log level                  | `warn`                                                     |
| `gateway.envoy.concurrency`           | Envoy concurrency                | `""` (empty string, falls back to `gateway.resources.cpu`) |
| `gateway.envoy.circuitBreakers`       | Circuit breaker configuration    | See configuration below                                    |
| `gateway.envoy.drainTimeSeconds`      | Envoy drain time (seconds)       | `30`                                                       |
| `gateway.envoy.streamIdleTimeout`     | Stream idle timeout              | `600s`                                                     |
| `gateway.envoy.connectTimeout`        | Connection timeout               | `5s`                                                       |
| `gateway.envoy.pluginConfig`          | Golang Filter plugin config      | See configuration below                                    |
| `gateway.service.type`                | Gateway Service type             | `ClusterIP`                                                |
| `gateway.service.port`                | Gateway Service port             | `7788`                                                     |
| `gateway.service.targetPort`          | Gateway Service target port      | `7788`                                                     |
| `gateway.service.annotations`         | Gateway Service annotations      | `{}`                                                       |
| `gateway.service.labels`              | Gateway Service labels           | `{}`                                                       |
| `gateway.podAntiAffinity.type`        | Pod anti-affinity type           | `soft`                                                     |
| `gateway.podAntiAffinity.weight`      | Pod anti-affinity weight         | `100`                                                      |
| `gateway.podAntiAffinity.topologyKey` | Pod anti-affinity topology key   | `kubernetes.io/hostname`                                   |
| `gateway.initContainer.enabled`       | Whether to enable init container | `false`                                                    |

#### E2B Protocol Parameters

| Parameter         | Description                          | Default                        |
|-------------------|--------------------------------------|--------------------------------|
| `e2b.domain`      | E2B protocol domain                  | `your.domain.com` (placeholder — always replace it, see [Step 0](#step-0-prepare-installation-parameters)) |
| `e2b.enableAuth`  | Whether to enable E2B authentication | `true`                         |
| `e2b.adminApiKey` | E2B admin API Key                    | `""`                           |
| `e2b.maxTimeout`  | E2B max timeout (seconds)            | `2592000`                      |

#### Service and Ingress Parameters

| Parameter                  | Description                         | Default               |
|----------------------------|-------------------------------------|-----------------------|
| `service.type`             | Manager Service type                | `ClusterIP`           |
| `service.port`             | Manager Service port                | `7788`                |
| `ingress.className`        | Ingress controller class name       | `""` (required)       |
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
| `serviceAccount.name`        | ServiceAccount name to use                 | `""`                                                                                                                                                          |
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
  thresholds:
    - priority: DEFAULT
      maxConnections: 32768
      maxPendingRequests: 32768
      maxRequests: 65536
      maxRetries: 5
```

---

## Best Practices

> The commands below use `helm upgrade --install`: it creates the release if it does not exist and upgrades it in
> place otherwise, so re-running a command is safe.

### Custom Resource Configuration

Based on your cluster scale, it is recommended to adjust the following resource parameters:

**Sandbox Controller resource adjustment**

```bash
helm upgrade --install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway resource adjustment**

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set controller.resources.cpu=4 \
  --set controller.resources.memory=8Gi \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### Configure E2B Domain and Authentication

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### Expose Service via Ingress

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls \
  --set e2b.domain=<your-domain>
```

### Configure Gateway High Availability

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set gateway.replicaCount=3 \
  --set gateway.podAntiAffinity.type=hard \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### Enable Gateway Init Container

If special initialization operations are needed (such as sysctl tuning, etc.), you can enable the init container:

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set gateway.initContainer.enabled=true \
  --set gateway.initContainer.image.repository=busybox \
  --set gateway.initContainer.image.tag=1.36.1
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Pod stuck in `ImagePullBackOff` / `ErrImagePull` | Nodes cannot reach Docker Hub | Install with the China mirror registries from [Using China Mirror Registry](#using-china-mirror-registry); for `curlimages/curl` in the health check, substitute a reachable image |
| `helm install` fails with `ingress.className is required` or `e2b.adminApiKey is required` | Required parameters omitted | Pass the values resolved in [Step 0](#step-0-prepare-installation-parameters) |
| `helm upgrade` fails although install worked | `helm upgrade` did not carry over the previous `--set` values | Repeat the parameters on upgrade or add `--reuse-values` — see [Upgrade via Helm](#upgrade-via-helm) |
| `kubectl wait` times out, Pod `Pending` | Insufficient cluster resources (default requests are `2` CPU / `4Gi` per replica and per gateway replica) | Lower the defaults, for example `--set-json 'controller.resources={"cpu":"500m","memory":"512Mi"}' --set-json 'gateway.resources={"cpu":"500m","memory":"512Mi"}'`; diagnose with `kubectl describe pod <pod> -n sandbox-system` |
| `kubectl wait` times out, Pod `Running` but not `Ready` | Image pull slow, probes not passing yet | `kubectl describe pod` + `kubectl logs <pod> -n sandbox-system -c controller` (manager) or `-c envoy` (gateway) |
| Ingress `ADDRESS` stays empty | No Ingress controller matches `ingress.className` | Check `kubectl get ingressclass` against the value you passed; install a controller if none exists — see [Prerequisites](#prerequisites) |
| SDK `create` fails with `Sandbox ... not found` / no template | No `SandboxSet` template deployed yet, or its name does not match the `template` argument | Deploy a template first — see [Running E2B Code Interpreter Sandbox](./best-practices/running-e2b-for-code-interpreter.md) |
| SDK returns `401` / `invalid key` | Key mismatch, or stock SDK rejected the non-`e2b_` key locally | Verify the key equals the installed `e2b.adminApiKey`; wrap it with `encode_for_e2b_sdk` — see [API Keys and Teams](./user-manuals/api-keys-and-teams.md) |

---

## Uninstall

> **Note:**
> - `helm uninstall` will delete Deployments, Services, Webhook Configurations, and other chart-managed resources, but
>     **will not delete CRDs**.
>     This is standard Helm behavior — CRDs are located in the `crds/` directory, and Helm only creates them during
>     initial installation, leaving them untouched during uninstall and upgrade.
> - CRDs not being deleted means that already created Sandbox, SandboxSet, and other CR resources along with their
>     associated Pods **will be retained**.
> - The Namespace will not be automatically deleted either. For a complete cleanup, refer to the "Complete Cleanup"
>     section below.

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
# Delete all Sandbox-related CRDs (cascades to all Sandbox CRs and their Pods).
# Explicit list — works in any shell:
kubectl delete crd \
  checkpoints.agents.kruise.io \
  sandboxclaims.agents.kruise.io \
  sandboxes.agents.kruise.io \
  sandboxsets.agents.kruise.io \
  sandboxtemplates.agents.kruise.io \
  sandboxupdateops.agents.kruise.io

# bash one-liner alternative:
# kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd

# Delete the Namespace
kubectl delete ns sandbox-system
```

> ⚠️ **Warning**: Deleting CRDs will irreversibly destroy all Sandbox instances and their associated Pods. Make sure
> data is backed up before proceeding.

---

## Version Update Notes

### Major Changes in 0.2.0 Compared to 0.1.0

| Category         | Changes                                                                                                                                                                                                     |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Architecture** | Added independent Sandbox Gateway Deployment, providing an independently scalable data plane gateway on top of the existing Envoy Sidecar in Manager                                                        |
| **CRD Changes**  | New Checkpoint CRD; new `runtimes` field in all CRDs; new `updateStrategy` in SandboxSet; new dynamic volume mount, in-place resource update in SandboxClaim (CRDs must be manually updated during upgrade) |
| **Webhook**      | New ValidatingWebhook for Pod Delete and Pod Eviction, enhancing Pod lifecycle management                                                                                                                   |
| **Log Level**    | Controller log level default changed from `3` to `5` for easier troubleshooting                                                                                                                               |
| **Ingress**      | New `dataplaneService` parameter; `className` default changed to empty string, must be explicitly specified                                                                                                 |
| **E2B**          | `adminApiKey` default changed to empty string (was `admin-987654321` in 0.1.0), must be explicitly specified during installation                                                                            |
| **Gateway**      | Complete set of new Gateway configuration options, including replica count, resources, probes, Envoy configuration, circuit breakers, Pod anti-affinity, etc.                                               |
| **Security**     | `podSecurityContextAllowPrivilegeEscalation` parameter removed, now managed uniformly in `securityContext`                                                                                                  |
| **RBAC**         | New permissions for `pods/resize`, `checkpoints`, `sandboxtemplates` resources                                                                                                                              |

### Major Changes in 0.3.0 Compared to 0.2.0

| Category                      | Changes                                                                                                                                                                   |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **New CRD**                   | New SandboxUpdateOps CRD (`sandboxupdateops.agents.kruise.io`) for batch upgrading Sandbox instances, supports rolling update strategy and upgrade progress tracking      |
| **CRD Enhancements**          | Sandbox adds `lifecycle` (preUpgrade/postUpgrade hooks) and `upgradePolicy` fields; SandboxClaim adds `claimTimeout`, `waitReadyTimeout` minimum value validation (>= 1s) |
| **Webhook**                   | New ValidatingWebhook for SandboxUpdateOps (`v-suo.kb.io`), validates CREATE/UPDATE operations                                                                            |
| **RBAC**                      | Controller adds permissions for `sandboxupdateops` and `sandboxupdateops/status` resources                                                                                |
| **Gateway Port**              | Gateway listener port changed from `10000` to `7788`, Gateway Service port and target port unified to `7788`                                                              |
| **Gateway Graceful Shutdown** | New Envoy `preStop` lifecycle hook, drains listener connections and waits for `drainTimeSeconds` (default 30s) before exiting                                             |
| **Envoy Configuration**       | New `drainTimeSeconds`, `streamIdleTimeout`, `connectTimeout` timeout parameters; `concurrency` default changed to empty string, falls back to `gateway.resources.cpu`    |
| **Ingress**                   | New `api.{{ e2b.domain }}` domain matching, supports API subdomain independent routing                                                                                    |
| **Version Upgrade**           | All image versions upgraded to `v0.3.0` (Controller, Manager, Gateway)                                                                                                    |

For detailed changes, please refer to the [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)

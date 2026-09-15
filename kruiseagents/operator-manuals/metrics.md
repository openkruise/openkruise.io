---
title: Metrics
---

# Metrics

OpenKruise Agents exposes Prometheus metrics from two components:

- **Sandbox Controller** — reconciles `Sandbox`, `SandboxSet`, and `SandboxClaim` resources, and emits per-instance
  state, lifecycle, and abnormality metrics.
- **Sandbox Manager** — serves the E2B protocol and the Sandbox routing/proxy data plane, and emits per-request
  claim, lifecycle, routing, and quota metrics.

This page describes the metric endpoints, the Prometheus scrape configuration, and the full list of metrics that
are registered on the `master` branch of [`openkruise/agents`](https://github.com/openkruise/agents).

## Endpoints

| Component         | HTTP path  | Default port                                              | Notes                                                                                                |
|-------------------|------------|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Sandbox Manager   | `/metrics` | `8080` (`--port`)                                         | The `/metrics` handler is mounted on the main service mux. Use `--metrics-port` to expose a separate listener. |
| Sandbox Controller| `/metrics` | `8443` (`--metrics-bind-address`)                       | Standard `controller-runtime` metrics endpoint, served over HTTPS.                                   |

The Sandbox Controller endpoint is protected by `controller-runtime`'s authentication / authorization filters,
so the scraper must present a `ServiceAccount` token that is allowed to call `/metrics`.

## Prometheus scrape configuration

### Self-managed Prometheus (`prometheus.yml`)

```yaml
scrape_configs:
  - job_name: sandbox-manager
    scrape_interval: 30s
    scrape_timeout: 30s
    metrics_path: /metrics
    scheme: http
    kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
            - sandbox-system    # adjust to the namespace where Sandbox Manager is deployed
    relabel_configs:
      - source_labels: [__meta_kubernetes_endpoint_port_name]
        regex: manager
        action: keep

  - job_name: sandbox-controller
    scrape_interval: 30s
    scrape_timeout: 30s
    metrics_path: /metrics
    scheme: https
    authorization:
      credentials_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      insecure_skip_verify: true
    kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
            - sandbox-system
    relabel_configs:
      - source_labels: [__meta_kubernetes_endpoint_port_name]
        regex: https
        action: keep
```

### Prometheus Operator (`ServiceMonitor`)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sandbox-manager
  namespace: sandbox-system
  labels:
    release: prometheus    # must match your Prometheus Operator's serviceMonitorSelector
spec:
  namespaceSelector:
    matchNames:
      - sandbox-system
  selector:
    matchLabels:
      app.kubernetes.io/name: sandbox-manager
  endpoints:
    - port: manager        # the Service port that targets container port 8080
      path: /metrics
      interval: 30s
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sandbox-controller
  namespace: sandbox-system
  labels:
    release: prometheus
spec:
  namespaceSelector:
    matchNames:
      - sandbox-system
  selector:
    matchLabels:
      app.kubernetes.io/name: sandbox-controller
      control-plane: controller-manager
  endpoints:
    - port: https
      path: /metrics
      scheme: https
      interval: 30s
      bearerTokenFile: /var/run/secrets/kubernetes.io/serviceaccount/token
      tlsConfig:
        insecureSkipVerify: true
```

## Metrics reference

All metric names below are exactly as registered in the source — no namespace or subsystem prefix is applied.
Standard `controller-runtime`, `workqueue_*`, `rest_client_*`, `go_*`, and `process_*` metrics are also exposed
by both components and are omitted from the tables for brevity.

### Sandbox Controller

Source: [`pkg/controller/sandbox/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandbox/metrics.go),
[`pkg/controller/sandboxset/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxset/metrics.go),
[`pkg/controller/sandboxclaim/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxclaim/metrics.go),
[`pkg/controller/sandboxclaim/core/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxclaim/core/metrics.go).

#### Sandbox instance state

> State gauges are emitted only while the Sandbox is in the corresponding state.

| Metric                                       | Type   | Labels                            | Description                                                            |
|----------------------------------------------|--------|-----------------------------------|------------------------------------------------------------------------|
| `sandbox_info`                               | Gauge  | `namespace`, `name`, plus user-allowlisted labels | Constant `1` series carrying static metadata about the Sandbox.        |
| `sandbox_labels`                             | Gauge  | dynamic, gated by `--metric-labels-allowlist` | Constant `1` series exposing selected Sandbox labels as Prometheus labels. |
| `sandbox_created`                            | Gauge  | `namespace`, `name`               | Unix timestamp at which the Sandbox was created.                       |
| `sandbox_deletion_timestamp`                 | Gauge  | `namespace`, `name`               | Unix timestamp of `metadata.deletionTimestamp`, if set.                |
| `sandbox_status_phase`                       | Gauge  | `namespace`, `name`, `phase`      | Current `status.phase` (`Pending`, `Running`, `Paused`, `Resuming`, `Failed`, `Succeeded`, `Terminating`). Value `1` for the active phase. |
| `sandbox_status_ready`                       | Gauge  | `namespace`, `name`               | `1` when the Sandbox is Ready, `0` otherwise.                          |
| `sandbox_status_ready_time`                  | Gauge  | `namespace`, `name`               | Unix timestamp of the last transition to Ready.                        |
| `sandbox_status_inplace_updating`            | Gauge  | `namespace`, `name`               | `1` while the `InplaceUpdate` condition is `False` (i.e. an in-place update is in progress). |
| `sandbox_status_inplace_updating_time`       | Gauge  | `namespace`, `name`               | Unix timestamp at which `InplaceUpdate` last became `False`.           |
| `sandbox_status_unpaused`                    | Gauge  | `namespace`, `name`               | `1` while the `SandboxPaused` condition is `False`.                    |
| `sandbox_status_unpaused_time`               | Gauge  | `namespace`, `name`               | Unix timestamp at which `SandboxPaused` last became `False`.           |
| `sandbox_status_unresumed`                   | Gauge  | `namespace`, `name`               | `1` while the `SandboxResumed` condition is `False`.                   |
| `sandbox_status_unresumed_time`              | Gauge  | `namespace`, `name`               | Unix timestamp at which `SandboxResumed` last became `False`.          |
| `sandbox_status_abnormal`                    | Gauge  | `namespace`, `name`, `type`       | `1` when an abnormal condition of the given `type` is observed.        |
| `sandbox_status_abnormal_time`               | Gauge  | `namespace`, `name`, `type`       | Unix timestamp at which the abnormal condition was last observed.      |
| `sandbox_runtime_container_abnormal`         | Gauge  | `namespace`, `name`, `container`  | `1` when a runtime container is in an abnormal state.                  |
| `sandbox_runtime_container_abnormal_time`    | Gauge  | `namespace`, `name`, `container`  | Unix timestamp at which the container abnormal state was last observed.|

#### Sandbox lifecycle counters and histograms

| Metric                                  | Type      | Labels                | Description                                                |
|-----------------------------------------|-----------|-----------------------|------------------------------------------------------------|
| `sandbox_creation_total`                | Counter   | `namespace`, `result` | Sandbox creations attempted, by result.                    |
| `sandbox_creation_duration_seconds`     | Histogram | `namespace`           | Time from Sandbox creation to Ready.                       |
| `sandbox_pause_total`                   | Counter   | `namespace`, `result` | Pause operations performed by the controller.              |
| `sandbox_pause_duration_seconds`        | Histogram | `namespace`           | Time spent in a controller-driven pause operation.         |
| `sandbox_resume_total`                  | Counter   | `namespace`, `result` | Resume operations performed by the controller.             |
| `sandbox_resume_duration_seconds`       | Histogram | `namespace`           | Time spent in a controller-driven resume operation.        |
| `sandbox_inplace_update_duration_seconds`| Histogram | `namespace`          | Time spent in an in-place update.                          |
| `sandbox_deletion_duration_seconds`     | Histogram | `namespace`           | Time from `deletionTimestamp` set to final removal.        |

#### SandboxSet

| Metric                                  | Type    | Labels                | Description                                          |
|-----------------------------------------|---------|-----------------------|------------------------------------------------------|
| `sandboxset_created`                    | Gauge   | `namespace`, `name`   | Unix timestamp at which the SandboxSet was created.  |
| `sandboxset_replicas`                   | Gauge   | `namespace`, `name`   | Current `status.replicas`.                           |
| `sandboxset_available_replicas`         | Gauge   | `namespace`, `name`   | Current `status.availableReplicas`.                  |
| `sandboxset_desired_replicas`           | Gauge   | `namespace`, `name`   | Current `spec.replicas`.                             |
| `sandboxset_updated_replicas`           | Gauge   | `namespace`, `name`   | Current `status.updatedReplicas`.                    |
| `sandboxset_updated_available_replicas` | Gauge   | `namespace`, `name`   | Current `status.updatedAvailableReplicas`.           |
| `sandboxset_sandboxes_created_total`    | Counter | `namespace`, `name`   | Sandboxes created for this SandboxSet.               |
| `sandboxset_sandboxes_claimed_total`    | Counter | `namespace`, `name`   | Sandboxes from this SandboxSet that have been claimed.|

#### SandboxClaim

| Metric                                  | Type      | Labels                              | Description                                                |
|-----------------------------------------|-----------|-------------------------------------|------------------------------------------------------------|
| `sandbox_claim_info`                    | Gauge     | `namespace`, `name`, plus selectors | Constant `1` series carrying static metadata.              |
| `sandbox_claim_created`                 | Gauge     | `namespace`, `name`                 | Unix timestamp at which the SandboxClaim was created.      |
| `sandbox_claim_status_phase`            | Gauge     | `namespace`, `name`, `phase`        | Current phase of the SandboxClaim.                         |
| `sandbox_claim_start_time`              | Gauge     | `namespace`, `name`                 | Unix timestamp at which claiming started.                  |
| `sandbox_claim_completion_time`         | Gauge     | `namespace`, `name`                 | Unix timestamp at which claiming completed.                |
| `sandbox_claim_claimed_replicas`        | Gauge     | `namespace`, `name`                 | Currently claimed replicas.                                |
| `sandbox_claim_desired_replicas`        | Gauge     | `namespace`, `name`                 | Desired replicas from `spec`.                              |
| `sandbox_claim_duration_seconds`        | Histogram | `namespace`                         | End-to-end claim duration measured by the controller.      |
| `sandboxset_claims_total`               | Counter   | `namespace`, `name`                 | Total claim events observed per SandboxSet.                |
| `sandboxclaim_expired_total`            | Counter   | `namespace`                         | SandboxClaims that expired before being satisfied.         |

### Sandbox Manager

Source: [`pkg/sandbox-manager/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/metrics.go),
[`pkg/servers/e2b/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/servers/e2b/metrics.go),
[`pkg/proxy/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/proxy/metrics.go),
[`pkg/sandbox-manager/quota/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/quota/metrics.go),
[`pkg/sandbox-manager/infra/sandboxcr/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/infra/sandboxcr/metrics.go).

#### Claim path

| Metric                                  | Type      | Labels                                | Description                                                        |
|-----------------------------------------|-----------|---------------------------------------|--------------------------------------------------------------------|
| `sandbox_claim_total`                   | Counter   | `namespace`, `result`, `lock_type`    | Claim requests received by Sandbox Manager.                        |
| `sandbox_claim_creation_responses`      | Counter   | `namespace`, `result`                 | Sandbox creations triggered by a claim, by result.                 |
| `sandbox_claim_duration_seconds`        | Histogram | `namespace`                           | End-to-end claim latency observed by Sandbox Manager.              |
| `sandbox_claim_retries`                 | Histogram | `namespace`                           | Number of retries taken to satisfy a claim.                        |

#### Lifecycle operations

| Metric                                  | Type      | Labels                 | Description                                                  |
|-----------------------------------------|-----------|------------------------|--------------------------------------------------------------|
| `sandbox_clone_total`                   | Counter   | `namespace`, `result`  | Sandbox clone requests received.                             |
| `sandbox_clone_duration_seconds`        | Histogram | `namespace`            | Latency of clone operations.                                 |
| `sandbox_delete_responses`              | Counter   | `namespace`, `result`  | Delete requests received.                                    |
| `sandbox_delete_duration_seconds`       | Histogram | `namespace`            | Latency of delete operations.                                |
| `sandbox_pause_responses`               | Counter   | `namespace`, `result`  | Pause requests received by Sandbox Manager.                  |
| `sandbox_pause_duration_seconds`        | Histogram | `namespace`            | Latency of pause operations as observed by Sandbox Manager.  |
| `sandbox_resume_responses`              | Counter   | `namespace`, `result`  | Resume requests received by Sandbox Manager.                 |
| `sandbox_resume_duration_seconds`       | Histogram | `namespace`            | Latency of resume operations as observed by Sandbox Manager. |
| `sandbox_snapshot_total`                | Counter   | `namespace`, `result`  | Snapshot creation requests received via the E2B server.      |
| `sandbox_snapshot_duration_seconds`     | Histogram | `namespace`            | Latency of snapshot creation.                                |

> `sandbox_pause_duration_seconds` and `sandbox_resume_duration_seconds` are registered separately by Sandbox
> Manager and Sandbox Controller. They are different series, scraped from different jobs — keep the `job` label
> when comparing them.

#### Routing and proxy

| Metric                                  | Type      | Labels                          | Description                                              |
|-----------------------------------------|-----------|---------------------------------|----------------------------------------------------------|
| `sandbox_routes`                        | Gauge     | —                               | Current size of the proxy routing table.                 |
| `sandbox_peers`                         | Gauge     | —                               | Number of connected peer nodes.                          |
| `sandbox_route_sync_total`              | Counter   | `namespace`, `type`, `result`   | Route synchronization operations performed.              |
| `sandbox_route_sync_duration_seconds`   | Histogram | `namespace`, `type`             | Latency of route synchronization operations.             |

#### Quota

| Metric                                              | Type      | Labels                          | Description                                              |
|-----------------------------------------------------|-----------|---------------------------------|----------------------------------------------------------|
| `sandbox_manager_quota_acquire_total`               | Counter   | `namespace`, `result`           | Quota acquisitions attempted.                            |
| `sandbox_manager_quota_release_total`               | Counter   | `namespace`, `result`           | Quota releases attempted.                                |
| `sandbox_manager_quota_backend_errors_total`        | Counter   | `namespace`, `error_type`       | Errors returned by the quota backend.                    |
| `sandbox_manager_quota_breaker_state_total`         | Counter   | `namespace`, `from`, `to`       | State transitions of the quota circuit breaker.          |
| `sandbox_manager_quota_breaker_open_duration_seconds` | Histogram | `namespace`                   | Time the quota circuit breaker spent in the open state.  |
| `sandbox_manager_quota_antidrift_skipped_total`     | Counter   | `namespace`, `reason`           | Anti-drift reconciliations skipped.                      |
| `sandbox_manager_quota_antidrift_errors_total`      | Counter   | `namespace`, `error_type`       | Anti-drift reconciliations that errored.                 |
| `sandbox_manager_quota_antidrift_event_release_total` | Counter | `namespace`, `result`           | Anti-drift event-driven quota releases.                  |

#### Infra fallbacks

| Metric                                              | Type    | Labels                          | Description                                                  |
|-----------------------------------------------------|---------|---------------------------------|--------------------------------------------------------------|
| `sandbox_get_claimed_fallback_total`                | Counter | `namespace`, `reason`           | Times the Sandbox Manager fell back when reading claimed Sandboxes. |
| `sandboxcr_quota_source_event_drop_total`           | Counter | `namespace`, `reason`           | Quota-source events dropped while watching `Sandbox` CRs.    |

## Suggested alerts and panels

The following PromQL snippets are starting points; tune thresholds against your own traffic profile.

- **Pool starvation** — `sum(sandboxset_available_replicas) by (namespace, name) == 0` while
  `sum(sandboxset_desired_replicas) by (namespace, name) > 0`.
- **Claim slowness** — `histogram_quantile(0.95, sum(rate(sandbox_claim_duration_seconds_bucket[5m])) by (le, namespace))`.
- **Claim failure rate** — `sum(rate(sandbox_claim_total{result!="success"}[5m])) by (namespace)
  / sum(rate(sandbox_claim_total[5m])) by (namespace)`.
- **Lifecycle regression** — compare p95 of `sandbox_pause_duration_seconds_bucket`,
  `sandbox_resume_duration_seconds_bucket`, and `sandbox_clone_duration_seconds_bucket` week over week.
- **Routing instability** — `rate(sandbox_route_sync_total{result!="success"}[5m]) > 0` or
  `sandbox_peers` dropping below the expected replica count.
- **Quota backend pressure** — `rate(sandbox_manager_quota_backend_errors_total[5m])` sustained above zero, or
  `sandbox_manager_quota_breaker_state_total{to="open"}` increasing.
- **Controller health** — standard `controller_runtime_reconcile_errors_total`,
  `workqueue_unfinished_work_seconds`, and `rest_client_requests_total{code=~"5.."}`.

## Notes

- The metrics surface is contract-stable but not frozen: new metrics may be added in any release. Scrape `/metrics`
  directly to discover the live set for your installed version.
- For design rationale, see
  [`docs/proposals/20260422-sandbox-prometheus-metrics.md`](https://github.com/openkruise/agents/blob/master/docs/proposals/20260422-sandbox-prometheus-metrics.md).

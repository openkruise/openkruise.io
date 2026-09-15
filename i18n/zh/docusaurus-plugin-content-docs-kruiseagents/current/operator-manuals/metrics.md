---
title: 监控指标
---

# 监控指标

OpenKruise Agents 通过两个组件对外暴露 Prometheus 指标：

- **Sandbox Controller** —— 调谐 `Sandbox`、`SandboxSet`、`SandboxClaim` 等资源，输出每个实例的状态、生命周期与异常类指标。
- **Sandbox Manager** —— 提供 E2B 协议接入与 Sandbox 路由 / 代理数据面，输出请求级别的领取（claim）、生命周期、路由与配额指标。

本文介绍指标端点、Prometheus 抓取配置，以及在 [`openkruise/agents`](https://github.com/openkruise/agents) 仓库 `master` 分支上注册的全部指标。

## 端点

| 组件                | HTTP 路径   | 默认端口                                                       | 说明                                                                                              |
|---------------------|-------------|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Sandbox Manager     | `/metrics`  | `8080`（`--port`）                                              | `/metrics` 处理器挂在主服务 mux 上。如需独立监听端口，可使用 `--metrics-port`。                  |
| Sandbox Controller  | `/metrics`  | `8443`（`--metrics-bind-address`）                          | 标准的 `controller-runtime` 指标端点，通过 HTTPS 提供服务。                                          |

Sandbox Controller 的指标端点受 `controller-runtime` 的认证 / 鉴权过滤器保护，抓取端必须提供有权访问 `/metrics` 的 `ServiceAccount` Token。

## Prometheus 抓取配置

### 自建 Prometheus（`prometheus.yml`）

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
            - sandbox-system    # 替换为 Sandbox Manager 实际部署的命名空间
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

### Prometheus Operator（`ServiceMonitor`）

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sandbox-manager
  namespace: sandbox-system
  labels:
    release: prometheus    # 需要与 Prometheus Operator 的 serviceMonitorSelector 匹配
spec:
  namespaceSelector:
    matchNames:
      - sandbox-system
  selector:
    matchLabels:
      app.kubernetes.io/name: sandbox-manager
  endpoints:
    - port: manager        # Service 中指向容器端口 8080 的端口名
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

## 指标清单

下文列出的指标名与源码中注册的名称完全一致，未追加任何 namespace 或 subsystem 前缀。两个组件还会暴露标准的 `controller-runtime`、`workqueue_*`、`rest_client_*`、`go_*`、`process_*` 指标，为节省篇幅不在表中重复列出。

### Sandbox Controller

源码位置：[`pkg/controller/sandbox/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandbox/metrics.go)、
[`pkg/controller/sandboxset/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxset/metrics.go)、
[`pkg/controller/sandboxclaim/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxclaim/metrics.go)、
[`pkg/controller/sandboxclaim/core/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/controller/sandboxclaim/core/metrics.go)。

#### Sandbox 实例状态

> 状态类 Gauge 仅在 Sandbox 处于对应状态时才会输出。

| 指标                                          | 类型    | 标签                                | 说明                                                                  |
|-----------------------------------------------|---------|-------------------------------------|-----------------------------------------------------------------------|
| `sandbox_info`                                | Gauge   | `namespace`、`name`，以及通过白名单透出的标签 | 常量 `1` 序列，承载 Sandbox 的静态元信息。                              |
| `sandbox_labels`                              | Gauge   | 动态，由 `--metric-labels-allowlist` 控制 | 常量 `1` 序列，将选定的 Sandbox 标签透出为 Prometheus 标签。            |
| `sandbox_created`                             | Gauge   | `namespace`、`name`                 | Sandbox 创建时间的 Unix 时间戳。                                        |
| `sandbox_deletion_timestamp`                  | Gauge   | `namespace`、`name`                 | `metadata.deletionTimestamp` 的 Unix 时间戳（若已设置）。                |
| `sandbox_status_phase`                        | Gauge   | `namespace`、`name`、`phase`        | 当前 `status.phase`（`Pending`、`Running`、`Paused`、`Resuming`、`Failed`、`Succeeded`、`Terminating`），活跃 phase 取值为 `1`。 |
| `sandbox_status_ready`                        | Gauge   | `namespace`、`name`                 | Ready 时为 `1`，否则为 `0`。                                            |
| `sandbox_status_ready_time`                   | Gauge   | `namespace`、`name`                 | 上次进入 Ready 状态的 Unix 时间戳。                                     |
| `sandbox_status_inplace_updating`             | Gauge   | `namespace`、`name`                 | `InplaceUpdate` 条件为 `False`（即正在原地升级）时为 `1`。              |
| `sandbox_status_inplace_updating_time`        | Gauge   | `namespace`、`name`                 | `InplaceUpdate` 上次变为 `False` 的 Unix 时间戳。                       |
| `sandbox_status_unpaused`                     | Gauge   | `namespace`、`name`                 | `SandboxPaused` 条件为 `False` 时为 `1`。                               |
| `sandbox_status_unpaused_time`                | Gauge   | `namespace`、`name`                 | `SandboxPaused` 上次变为 `False` 的 Unix 时间戳。                       |
| `sandbox_status_unresumed`                    | Gauge   | `namespace`、`name`                 | `SandboxResumed` 条件为 `False` 时为 `1`。                              |
| `sandbox_status_unresumed_time`               | Gauge   | `namespace`、`name`                 | `SandboxResumed` 上次变为 `False` 的 Unix 时间戳。                      |
| `sandbox_status_abnormal`                     | Gauge   | `namespace`、`name`、`type`         | 观察到指定 `type` 的异常状况时为 `1`。                                  |
| `sandbox_status_abnormal_time`                | Gauge   | `namespace`、`name`、`type`         | 上次观察到该异常状况的 Unix 时间戳。                                    |
| `sandbox_runtime_container_abnormal`          | Gauge   | `namespace`、`name`、`container`    | 运行时容器处于异常状态时为 `1`。                                        |
| `sandbox_runtime_container_abnormal_time`     | Gauge   | `namespace`、`name`、`container`    | 上次观察到容器异常状态的 Unix 时间戳。                                  |

#### Sandbox 生命周期计数与耗时

| 指标                                          | 类型      | 标签                  | 说明                                                          |
|-----------------------------------------------|-----------|-----------------------|---------------------------------------------------------------|
| `sandbox_creation_total`                      | Counter   | `namespace`、`result` | 控制器尝试创建 Sandbox 的次数，按结果区分。                    |
| `sandbox_creation_duration_seconds`           | Histogram | `namespace`           | 从 Sandbox 创建到 Ready 的耗时。                              |
| `sandbox_pause_total`                         | Counter   | `namespace`、`result` | 控制器执行的休眠操作次数。                                    |
| `sandbox_pause_duration_seconds`              | Histogram | `namespace`           | 控制器侧休眠操作的耗时。                                      |
| `sandbox_resume_total`                        | Counter   | `namespace`、`result` | 控制器执行的唤醒操作次数。                                    |
| `sandbox_resume_duration_seconds`             | Histogram | `namespace`           | 控制器侧唤醒操作的耗时。                                      |
| `sandbox_inplace_update_duration_seconds`     | Histogram | `namespace`           | 原地升级的耗时。                                              |
| `sandbox_deletion_duration_seconds`           | Histogram | `namespace`           | 从设置 `deletionTimestamp` 到完全删除的耗时。                  |

#### SandboxSet

| 指标                                          | 类型    | 标签                  | 说明                                              |
|-----------------------------------------------|---------|-----------------------|---------------------------------------------------|
| `sandboxset_created`                          | Gauge   | `namespace`、`name`   | SandboxSet 创建时间的 Unix 时间戳。                |
| `sandboxset_replicas`                         | Gauge   | `namespace`、`name`   | 当前 `status.replicas`。                           |
| `sandboxset_available_replicas`               | Gauge   | `namespace`、`name`   | 当前 `status.availableReplicas`。                  |
| `sandboxset_desired_replicas`                 | Gauge   | `namespace`、`name`   | 当前 `spec.replicas`。                             |
| `sandboxset_updated_replicas`                 | Gauge   | `namespace`、`name`   | 当前 `status.updatedReplicas`。                    |
| `sandboxset_updated_available_replicas`       | Gauge   | `namespace`、`name`   | 当前 `status.updatedAvailableReplicas`。           |
| `sandboxset_sandboxes_created_total`          | Counter | `namespace`、`name`   | 该 SandboxSet 创建的 Sandbox 总数。                |
| `sandboxset_sandboxes_claimed_total`          | Counter | `namespace`、`name`   | 该 SandboxSet 中已被领取的 Sandbox 总数。           |

#### SandboxClaim

| 指标                                          | 类型      | 标签                                  | 说明                                                  |
|-----------------------------------------------|-----------|---------------------------------------|-------------------------------------------------------|
| `sandbox_claim_info`                          | Gauge     | `namespace`、`name`，以及 selector 透出的标签 | 常量 `1` 序列，承载 SandboxClaim 的静态元信息。       |
| `sandbox_claim_created`                       | Gauge     | `namespace`、`name`                   | SandboxClaim 创建时间的 Unix 时间戳。                  |
| `sandbox_claim_status_phase`                  | Gauge     | `namespace`、`name`、`phase`          | SandboxClaim 当前所处的阶段。                          |
| `sandbox_claim_start_time`                    | Gauge     | `namespace`、`name`                   | 开始领取的 Unix 时间戳。                               |
| `sandbox_claim_completion_time`               | Gauge     | `namespace`、`name`                   | 领取完成的 Unix 时间戳。                               |
| `sandbox_claim_claimed_replicas`              | Gauge     | `namespace`、`name`                   | 当前已领取的副本数。                                   |
| `sandbox_claim_desired_replicas`              | Gauge     | `namespace`、`name`                   | `spec` 中期望的副本数。                                |
| `sandbox_claim_duration_seconds`              | Histogram | `namespace`                           | 控制器侧观测到的端到端领取耗时。                       |
| `sandboxset_claims_total`                     | Counter   | `namespace`、`name`                   | 每个 SandboxSet 上观察到的领取事件总数。               |
| `sandboxclaim_expired_total`                  | Counter   | `namespace`                           | 在被满足前过期的 SandboxClaim 数量。                   |

### Sandbox Manager

源码位置：[`pkg/sandbox-manager/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/metrics.go)、
[`pkg/servers/e2b/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/servers/e2b/metrics.go)、
[`pkg/proxy/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/proxy/metrics.go)、
[`pkg/sandbox-manager/quota/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/quota/metrics.go)、
[`pkg/sandbox-manager/infra/sandboxcr/metrics.go`](https://github.com/openkruise/agents/blob/master/pkg/sandbox-manager/infra/sandboxcr/metrics.go)。

#### 领取（Claim）链路

| 指标                                          | 类型      | 标签                                  | 说明                                              |
|-----------------------------------------------|-----------|---------------------------------------|---------------------------------------------------|
| `sandbox_claim_total`                         | Counter   | `namespace`、`result`、`lock_type`    | Sandbox Manager 收到的领取请求数。                 |
| `sandbox_claim_creation_responses`            | Counter   | `namespace`、`result`                 | 由领取触发的 Sandbox 创建次数，按结果区分。        |
| `sandbox_claim_duration_seconds`              | Histogram | `namespace`                           | Sandbox Manager 侧观测到的端到端领取耗时。         |
| `sandbox_claim_retries`                       | Histogram | `namespace`                           | 满足一次领取所需的重试次数。                       |

#### 生命周期操作

| 指标                                          | 类型      | 标签                    | 说明                                                  |
|-----------------------------------------------|-----------|-------------------------|-------------------------------------------------------|
| `sandbox_clone_total`                         | Counter   | `namespace`、`result`   | 收到的 Sandbox 克隆请求数。                            |
| `sandbox_clone_duration_seconds`              | Histogram | `namespace`             | 克隆操作的耗时。                                       |
| `sandbox_delete_responses`                    | Counter   | `namespace`、`result`   | 收到的删除请求数。                                     |
| `sandbox_delete_duration_seconds`             | Histogram | `namespace`             | 删除操作的耗时。                                       |
| `sandbox_pause_responses`                     | Counter   | `namespace`、`result`   | Sandbox Manager 收到的休眠请求数。                     |
| `sandbox_pause_duration_seconds`              | Histogram | `namespace`             | Sandbox Manager 侧观测到的休眠耗时。                   |
| `sandbox_resume_responses`                    | Counter   | `namespace`、`result`   | Sandbox Manager 收到的唤醒请求数。                     |
| `sandbox_resume_duration_seconds`             | Histogram | `namespace`             | Sandbox Manager 侧观测到的唤醒耗时。                   |
| `sandbox_snapshot_total`                      | Counter   | `namespace`、`result`   | E2B Server 收到的快照创建请求数。                      |
| `sandbox_snapshot_duration_seconds`           | Histogram | `namespace`             | 快照创建耗时。                                         |

> `sandbox_pause_duration_seconds` 与 `sandbox_resume_duration_seconds` 在 Sandbox Manager 与 Sandbox Controller 中各自独立注册，是两组不同的序列、由不同的抓取 job 拉取。比较时请保留 `job` 标签。

#### 路由与代理

| 指标                                          | 类型      | 标签                              | 说明                                              |
|-----------------------------------------------|-----------|-----------------------------------|---------------------------------------------------|
| `sandbox_routes`                              | Gauge     | ——                                | 当前代理路由表中的路由数量。                       |
| `sandbox_peers`                               | Gauge     | ——                                | 已连接的 Peer 节点数。                             |
| `sandbox_route_sync_total`                    | Counter   | `namespace`、`type`、`result`     | 已执行的路由同步操作数。                           |
| `sandbox_route_sync_duration_seconds`         | Histogram | `namespace`、`type`               | 路由同步操作的耗时。                               |

#### 配额

| 指标                                                  | 类型      | 标签                              | 说明                                              |
|-------------------------------------------------------|-----------|-----------------------------------|---------------------------------------------------|
| `sandbox_manager_quota_acquire_total`                 | Counter   | `namespace`、`result`             | 尝试获取配额的次数。                               |
| `sandbox_manager_quota_release_total`                 | Counter   | `namespace`、`result`             | 尝试释放配额的次数。                               |
| `sandbox_manager_quota_backend_errors_total`          | Counter   | `namespace`、`error_type`         | 配额后端返回错误的次数。                           |
| `sandbox_manager_quota_breaker_state_total`           | Counter   | `namespace`、`from`、`to`         | 配额熔断器状态切换次数。                           |
| `sandbox_manager_quota_breaker_open_duration_seconds` | Histogram | `namespace`                       | 配额熔断器处于打开状态的累计时长。                 |
| `sandbox_manager_quota_antidrift_skipped_total`       | Counter   | `namespace`、`reason`             | 跳过的反漂移（anti-drift）调谐次数。               |
| `sandbox_manager_quota_antidrift_errors_total`        | Counter   | `namespace`、`error_type`         | 反漂移调谐失败次数。                               |
| `sandbox_manager_quota_antidrift_event_release_total` | Counter   | `namespace`、`result`             | 事件驱动的反漂移配额释放次数。                     |

#### 基础设施回退

| 指标                                                  | 类型     | 标签                              | 说明                                                              |
|-------------------------------------------------------|----------|-----------------------------------|-------------------------------------------------------------------|
| `sandbox_get_claimed_fallback_total`                  | Counter  | `namespace`、`reason`             | Sandbox Manager 在读取已领取 Sandbox 时触发回退的次数。            |
| `sandboxcr_quota_source_event_drop_total`             | Counter  | `namespace`、`reason`             | 监听 `Sandbox` CR 时被丢弃的配额来源事件数。                       |

## 推荐的告警与面板

以下 PromQL 仅作为起点，阈值请结合实际流量画像调整。

- **资源池枯竭** —— `sum(sandboxset_available_replicas) by (namespace, name) == 0` 且 `sum(sandboxset_desired_replicas) by (namespace, name) > 0`。
- **领取耗时** —— `histogram_quantile(0.95, sum(rate(sandbox_claim_duration_seconds_bucket[5m])) by (le, namespace))`。
- **领取失败率** —— `sum(rate(sandbox_claim_total{result!="success"}[5m])) by (namespace) / sum(rate(sandbox_claim_total[5m])) by (namespace)`。
- **生命周期回归** —— 周环比对比 `sandbox_pause_duration_seconds_bucket`、`sandbox_resume_duration_seconds_bucket`、`sandbox_clone_duration_seconds_bucket` 的 p95。
- **路由不稳定** —— `rate(sandbox_route_sync_total{result!="success"}[5m]) > 0`，或 `sandbox_peers` 低于预期副本数。
- **配额后端压力** —— `rate(sandbox_manager_quota_backend_errors_total[5m])` 持续大于 0，或 `sandbox_manager_quota_breaker_state_total{to="open"}` 持续上升。
- **控制器健康度** —— 标准的 `controller_runtime_reconcile_errors_total`、`workqueue_unfinished_work_seconds`、`rest_client_requests_total{code=~"5.."}`。

## 注意事项

- 指标集合保持契约稳定，但并非冻结：每个版本都可能新增指标。请直接抓取 `/metrics` 以获取当前部署版本的真实指标集。
- 设计背景请参考 [`docs/proposals/20260422-sandbox-prometheus-metrics.md`](https://github.com/openkruise/agents/blob/master/docs/proposals/20260422-sandbox-prometheus-metrics.md)。

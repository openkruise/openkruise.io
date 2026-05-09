---
title: 问题排查
---

## 日志分析

OpenKruise 使用 klog 进行日志记录。默认情况下，OpenKruise 的 Helm Chart 设置的日志级别为 4，这已经足够用于日常的故障排查。如果需要更详细的调试信息，可以将日志级别提升至 5 或更高。

从 OpenKruise 1.7 版本开始，我们支持结构化日志（structured logs），原生支持 (key, value) 键值对和对象引用。你还可以通过 Helm 安装时设置 --set manager.loggingFormat=json 来以 JSON 格式输出日志。

例如以下 InfoS 调用：

```
klog.V(3).InfoS("SidecarSet updated status success", "sidecarSet", klog.KObj(sidecarSet), "matchedPods", status.MatchedPods,
"updatedPods", status.UpdatedPods, "readyPods", status.ReadyPods, "updateReadyPods", status.UpdatedReadyPods)
```

将会输出如下日志：

```
I0821 14:22:35.587919       1 sidecarset_processor.go:280] "SidecarSet updated status success" sidecarSet="test-sidecarset" matchedPods=1 updatedPods=1 readyPods=1 updateReadyPods=1
```

如果你使用了 helm install ... --set manager.loggingFormat=json，则输出如下 JSON 格式日志：

```json
{
  "ts": 1724239224606.642,
  "caller": "sidecarset/sidecarset_processor.go:280",
  "msg": "SidecarSet updated status success",
  "v": 3,
  "sidecarSet": {
    "name": "test-sidecarset"
  },
  "matchedPods": 1,
  "updatedPods": 1,
  "readyPods": 0,
  "updateReadyPods": 0
}
```

## 指标分析

### 内置指标

OpenKruise 以 Prometheus 格式暴露指标，这对于监控控制器和受管工作负载的健康状况和性能至关重要。默认情况下，OpenKruise 控制器管理器 (kruise-manager) 在端口 8080 上的 /metrics 端点暴露这些指标。通常在安装时就已经启用（例如通过 Helm）。

验证指标透出：

1.  **将本地端口转发到 kruise-controller-manager 服务:**
    ```bash
    # kubectl get svc -n kruise-system kruise-controller-manager -o jsonpath='{.spec.ports[?(@.name=="metrics")].port}' # to find port
    kubectl port-forward -n kruise-system svc/kruise-controller-manager 8080:8080
    ```

2.  **访问指标端点**
    ```bash
    curl localhost:8080/metrics
    ```

#### 关键指标分类

1. Controller Runtime 指标

   来自 controller-runtime 库的标准指标，反映各控制器的运行情况，这里列出了其中最关键的指标：

| Metric Name                                  | Type      | Description           | Labels           |
|----------------------------------------------|-----------|-----------------------|------------------|
| `controller_runtime_reconcile_total`         | Counter   | 每个控制器的 reconcile 总次数	 | `controller`     |
| `controller_runtime_reconcile_errors_total`  | Counter   | 每个控制器的 reconcile 错误总数 | `controller`     |
| `controller_runtime_reconcile_time_seconds`  | Histogram | 每个控制器的 reconcile 耗时   | `controller`     |
| `workqueue_depth`                            | Gauge     | 每个控制器当前的工作队列长度        | `name`           |
| `controller_runtime_webhook_requests_total`  | Counter   | 各个webhook的请求总数        | `webhook`,`code` |
| `controller_runtime_webhook_latency_seconds` | Histogram | 各个webhook的请求延时        | `webhook`        |

**用途**：可用于识别过载的控制器（如高 `workqueue_depth`、长 `reconcile_time_seconds`）或持续出错的控制器（如`reconcile_errors_total` 持续上升）。

2. OpenKruise 特有指标

| Metric Name                          | Type    | Description                      | Labels                            |
|--------------------------------------|---------|----------------------------------|-----------------------------------|
| `kruise_manager_is_leader`           | Gauge   | 表示当前 kruise-manager 是否为 leader	  |                                   |
| `pod_unavailable_budget`             | Counter | Pod 不可用预算保护机制防止 Pod 扰动的数量        | `kind_namespace_name`, `username` |
| `cloneset_scale_expectation_leakage` | Counter | CloneSet Scale Expectation 超时的次数 | `namespace`,`name`                |
| `namespace_deletion_protection`      | Counter | 命名空间删除保护数量	                      | `name`, `username`                |
| `crd_deletion_protection`            | Counter | 自定义资源定义（CRD）删除保护数量	              | `name`, `username`                |
| `workload_deletion_protection`       | Counter | 工作负载删除保护数量                       | `kind_namespace_name`, `username` |

**用途**：用于识别控制平面问题，以及特性功能性能问题（如 PUB 保护机制）

3. Go 运行时与进程指标

用于高级调试 kruise-controller-manager 资源使用情况的标准 Go 和进程指标。


### Kruise State Metrics

[kruise-state-metrics](https://github.com/openkruise/kruise-state-metrics) 是一个监听 Kubernetes API Server 并生成各类资源状态指标的服务。它不关注 OpenKruise 各组件本身的健康状态，而是关注内部资源（如 CloneSet、Advanced StatefulSet、SidecarSet 等）的状态。

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise-state-metrics --version 0.2.2
```
## 性能问题排查

### 如何启用 pprof

默认情况下，kruise-manager 已经启用了 pprof，而为了安全考虑，kruise-daemon 默认是禁用的。你也可以通过组件启动参数来更改其行为。

| component | pprof enable argument | pprof address argument |
| -------- | ------- | ------- | 
| kruise-manager | --enable-pprof=true (true by default) | --pprof-addr="host:port" (":8090" by default) | 
| kruise-daemon  | --enable-pprof=false(false by default) | --pprof-addr="host:port" (":10222" by default) |

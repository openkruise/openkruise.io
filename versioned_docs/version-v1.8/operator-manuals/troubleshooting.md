---
title: Troubleshooting
---

## Investigate log

OpenKruise uses klog for logging, the kruise chart comes with a default log level of 4, which is verbose enough for most daily trouble shooting. One can further increase the log level to 5 and above to get all the debug informations.

From OpenKruise 1.7, we are adding support for structured logs, which natively support (key, value) pairs and object references. And logs can also be outputted in JSON format using `helm install ... --set manager.loggingFormat=json.`

For example, this invocation of InfoS:

```
klog.V(3).InfoS("SidecarSet updated status success", "sidecarSet", klog.KObj(sidecarSet), "matchedPods", status.MatchedPods,
"updatedPods", status.UpdatedPods, "readyPods", status.ReadyPods, "updateReadyPods", status.UpdatedReadyPods)
```

will result in this log:

```
I0821 14:22:35.587919       1 sidecarset_processor.go:280] "SidecarSet updated status success" sidecarSet="test-sidecarset" matchedPods=1 updatedPods=1 readyPods=1 updateReadyPods=1
```

Or, if `helm install ... --set manager.loggingFormat=json`, it will result in this output:

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

## Investigate metrics

### Built-in metrics

OpenKruise exposes metrics in Prometheus format, crucial for monitoring the health and performance of its controllers and managed workloads. By default, the OpenKruise controller manager (`kruise-manager`) exposes metrics on port `8080` at the `/metrics` endpoint. This is typically enabled during installation (e.g., via Helm).

To verify:

1.  **Port-forward to the `kruise-controller-manager` service:**
    (The service port for metrics is often named `metrics` or is the main service port, e.g., 8080)
    ```bash
    # kubectl get svc -n kruise-system kruise-controller-manager -o jsonpath='{.spec.ports[?(@.name=="metrics")].port}' # to find port
    kubectl port-forward -n kruise-system svc/kruise-controller-manager 8080:8080
    ```

2.  **Query the metrics endpoint:**
    ```bash
    curl localhost:8080/metrics
    ```

#### Key Metrics Categories

1. Controller Runtime Metrics

Standard metrics from `controller-runtime` library, offering insights into individual controller and webhook performance, here are some key metrics to notice:

| Metric Name                                  | Type      | Description                                 | Labels           |
|----------------------------------------------|-----------|---------------------------------------------|------------------|
| `controller_runtime_reconcile_total`         | Counter   | Total reconciliations per controller.       | `controller`     |
| `controller_runtime_reconcile_errors_total`  | Counter   | Total reconciliation errors per controller. | `controller`     |
| `controller_runtime_reconcile_time_seconds`  | Histogram | Reconciliation duration per controller.     | `controller`     |
| `workqueue_depth`                            | Gauge     | Current workqueue depth per controller.     | `name`           |
| `controller_runtime_webhook_requests_total`  | Counter   | Total requests of webhook                   | `code`,`webhook` |
| `controller_runtime_webhook_latency_seconds` | Histogram | latency of webhook request                  | `webhook`        |

**Use to:** Identify overloaded controllers (high `workqueue_depth`, long `controller_runtime_webhook_latency_seconds`) or persistent issues (increasing `reconcile_errors_total`).

2. OpenKruise Specific Metrics

Custom metrics for OpenKruise features.

| Metric Name                          | Type    | Description                                                        | Labels                            |
|--------------------------------------|---------|--------------------------------------------------------------------|-----------------------------------|
| `kruise_manager_is_leader`           | Gauge   | Gauge the leader of kruise-manager                                 |                                   |
| `pod_unavailable_budget`             | Counter | Number of Pod Unavailable Budget protection against pod disruption | `kind_namespace_name`, `username` |
| `cloneset_scale_expectation_leakage` | Counter | Number of CloneSet Scale Expectation Timeout                       | `namespace`,`name`                |
| `namespace_deletion_protection`      | Counter | Number of namespace deletion protection                            | `name`, `username`                |
| `crd_deletion_protection`            | Counter | Number of CustomResourceDefinition deletion protection             | `name`, `username`                |
| `workload_deletion_protection`       | Counter | Number of workload deletion protection                             | `kind_namespace_name`, `username` |

**Use to:** Identify control-plane problem, feature performance (e.g., PUB protections)

3. Go Runtime and Process Metrics

Standard Go and process metrics for advanced debugging of `kruise-controller-manager` resource usage.

### Kruise State Metrics

[kruise-state-metrics](https://github.com/openkruise/kruise-state-metrics) is a simple service that listens to the
Kubernetes API server and generates metrics about the state of the objects.
It is not focused on the health of the individual OpenKruise components, but rather on the health of the various objects
inside, such as clonesets, advanced statefulsets and sidecarsets.

```bash
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise-state-metrics --version 0.2.2
```
## Investigate performance problem

### how to enable pprof
Kruise-manager enables pprof by default, and kruise-daemon disables the pprof by default for security consideration. One can disable pprof or change the pprof address by setting the command line arguments of the component to include the following argument.

| component | pprof enable argument | pprof address argument |
| -------- | ------- | ------- | 
| kruise-manager | --enable-pprof=true (true by default) | --pprof-addr="host:port" (":8090" by default) | 
| kruise-daemon  | --enable-pprof=false(false by default) | --pprof-addr="host:port" (":10222" by default) |

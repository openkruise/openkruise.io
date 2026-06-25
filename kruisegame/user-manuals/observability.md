# Observability

## Overview

Since v1.1.0, OpenKruiseGame provides built-in observability support based on OpenTelemetry, including structured logging, distributed tracing, and performance profiling.

## Structured Logging

OKG supports configurable log format output:

### Log Format

Configure via the `--log-format` flag:
- `console` (default): human-readable console format
- `json`: structured JSON format for log aggregation systems

### JSON Preset

When using JSON format, configure the field layout via `--log-json-preset`:
- `kibana`: traditional Kibana-compatible field layout
- `otel`: OpenTelemetry semantic conventions

### OTLP Log Export

Enable log export to an OpenTelemetry Collector:
- `--enable-otel-logs=true`: enables OTLP log export
- Requires `--otel-collector-endpoint` to be configured

## Distributed Tracing

OKG supports OpenTelemetry distributed tracing to track request flows across controller reconciliation cycles.

### Configuration

| Flag | Description | Default |
|------|-------------|---------|
| `--enable-tracing` | Enable OpenTelemetry tracing | `false` |
| `--otel-collector-endpoint` | OTel Collector OTLP gRPC endpoint | `localhost:4317` |
| `--otel-collector-token` | Authentication token for OTLP endpoint (optional) | `""` |
| `--otel-sampling-rate` | Sampling rate (0.0 to 1.0) | `1.0` |

### Integration with OpenTelemetry Collector

Deploy an OpenTelemetry Collector in your cluster and configure kruise-game to export traces:

```yaml
# Helm values example
kruiseGame:
  tracing:
    enabled: true
    collectorEndpoint: "otel-collector.monitoring:4317"
    samplingRate: 0.5
```

## Performance Profiling (pprof)

OKG supports Go pprof for runtime performance analysis:

- `--pprof-bind-address`: Set the bind address to enable pprof (e.g., `:8083`). Empty value disables pprof.

When enabled, access profiling data at `http://<pod-ip>:8083/debug/pprof/`.

Example usage:
```bash
kubectl port-forward -n kruise-game-system deploy/kruise-game-controller-manager 8083:8083
go tool pprof http://localhost:8083/debug/pprof/heap
```

## Helm Chart Configuration

The following values.yaml parameters correspond to the observability features:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `kruiseGame.logging.format` | Log output format | `console` |
| `kruiseGame.logging.jsonPreset` | JSON log preset | `kibana` |
| `kruiseGame.logging.enableOTelLogs` | Enable OTLP log export | `false` |
| `kruiseGame.tracing.enabled` | Enable tracing | `false` |
| `kruiseGame.tracing.collectorEndpoint` | Collector endpoint | `localhost:4317` |
| `kruiseGame.tracing.collectorToken` | Auth token | `""` |
| `kruiseGame.tracing.samplingRate` | Sampling rate | `1.0` |
| `kruiseGame.pprof.bindAddress` | pprof bind address | `""` |

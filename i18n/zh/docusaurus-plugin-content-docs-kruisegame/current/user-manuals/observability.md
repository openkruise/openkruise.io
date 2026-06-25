# 可观测性

## 概述

自 v1.1.0 起，OpenKruiseGame 提供基于 OpenTelemetry 的内置可观测性支持，包括结构化日志、分布式追踪和性能分析。

## 结构化日志

OKG 支持可配置的日志格式输出：

### 日志格式

通过 `--log-format` 启动参数配置：
- `console`（默认）：人类可读的控制台格式
- `json`：结构化 JSON 格式，适用于日志聚合系统

### JSON 预设

使用 JSON 格式时，通过 `--log-json-preset` 配置字段布局：
- `kibana`：传统的 Kibana 兼容字段布局
- `otel`：OpenTelemetry 语义规范

### OTLP 日志导出

启用向 OpenTelemetry Collector 导出日志：
- `--enable-otel-logs=true`：启用 OTLP 日志导出
- 需要配置 `--otel-collector-endpoint`

## 分布式追踪

OKG 支持 OpenTelemetry 分布式追踪，用于跟踪控制器 Reconcile 循环中的请求流。

### 配置

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--enable-tracing` | 启用 OpenTelemetry 追踪 | `false` |
| `--otel-collector-endpoint` | OTel Collector OTLP gRPC 端点 | `localhost:4317` |
| `--otel-collector-token` | OTLP 端点认证令牌（可选） | `""` |
| `--otel-sampling-rate` | 采样率（0.0 到 1.0） | `1.0` |

### 与 OpenTelemetry Collector 集成

在集群中部署 OpenTelemetry Collector，并配置 kruise-game 导出追踪数据：

```yaml
# Helm values 示例
kruiseGame:
  tracing:
    enabled: true
    collectorEndpoint: "otel-collector.monitoring:4317"
    samplingRate: 0.5
```

## 性能分析 (pprof)

OKG 支持 Go pprof 进行运行时性能分析：

- `--pprof-bind-address`：设置绑定地址以启用 pprof（如 `:8083`）。空值表示禁用 pprof。

启用后，通过 `http://<pod-ip>:8083/debug/pprof/` 访问性能分析数据。

使用示例：
```bash
kubectl port-forward -n kruise-game-system deploy/kruise-game-controller-manager 8083:8083
go tool pprof http://localhost:8083/debug/pprof/heap
```

## Helm Chart 配置

以下 values.yaml 参数对应可观测性功能：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `kruiseGame.logging.format` | 日志输出格式 | `console` |
| `kruiseGame.logging.jsonPreset` | JSON 日志预设 | `kibana` |
| `kruiseGame.logging.enableOTelLogs` | 启用 OTLP 日志导出 | `false` |
| `kruiseGame.tracing.enabled` | 启用追踪 | `false` |
| `kruiseGame.tracing.collectorEndpoint` | Collector 端点 | `localhost:4317` |
| `kruiseGame.tracing.collectorToken` | 认证令牌 | `""` |
| `kruiseGame.tracing.samplingRate` | 采样率 | `1.0` |
| `kruiseGame.pprof.bindAddress` | pprof 绑定地址 | `""` |

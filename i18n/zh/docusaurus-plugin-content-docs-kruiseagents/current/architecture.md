---
title: 架构
---

# 架构
OpenKruise Agents 的整体架构如下所示：

![alt](/img/kruiseagents/architecture.png)

## sandbox-manager
sandbox-manager 是一个无状态的后台管理组件，提供 E2B 兼容的北向 API，负责沙箱生命周期、配额以及路由与流量令牌编排。
## sandbox-controller
sandbox-controller 包含一组控制器，负责协调 Sandbox、SandboxSet、SandboxClaim 和预热池等资源，同时也为相关的 CRD 资源提供准入 Webhook。
## sandbox-gateway
sandbox-gateway 是数据面，基于 Envoy Go Filter 构建：

- 入口网关将用户流量代理到沙箱，支持 host/path 路由、访问令牌和流量唤醒。
- 出口网关代理沙箱的出站流量，提供策略强制的 L7 出口。
## agent-runtime
agent-runtime 是注入到 Sandbox 中的 Sidecar，它为沙箱提供实用工具服务，包括兼容 E2B envd 的命令、文件和端口（49983）操作。
## traffic-proxy
traffic-proxy 是注入到 Sandbox 中的 Sidecar，作为 Pod 内 L4 出口流量策略的执行点。
## csi
CSI Sidecar 为沙箱提供按需存储挂载。
## traffic-control-plane
流量控制面负责出口策略的配置与执行：

- istiod 向网关和 Pod 内代理下发 xDS 配置。
- 出口策略执行器对出口流量应用 L7 策略、MCP ACL 和令牌注入。

# API
OpenKruise Agents 以两种形式提供北向 API：E2B 兼容 API 和 Kubernetes API（CRD）。

## K8S APIs
OpenKruise Agents 以 CRD 的形式提供 Kubernetes API，主要面向平台构建者和基础设施团队。
涵盖核心沙箱资源（Sandbox、SandboxSet、SandboxClaim、SandboxTemplate、PoolAutoscaler、SandboxUpdateOps、Checkpoint）
以及流量与安全策略资源（TrafficPolicy、GlobalTrafficPolicy、SecurityProfile、GlobalSecurityProfile）。


```shell script
$ kubectl get crd | grep kruise.io
checkpoints.agents.kruise.io                             2026-05-19T03:49:36Z
commits.agents.kruise.io                                 2026-05-19T03:49:36Z
globalsecurityprofiles.agents.kruise.io                  2026-05-19T03:49:36Z
globaltrafficpolicies.agents.kruise.io                   2026-05-19T03:49:36Z
poolautoscalers.agents.kruise.io                         2026-05-19T03:49:36Z
sandboxclaims.agents.kruise.io                           2026-05-19T03:49:36Z
sandboxes.agents.kruise.io                               2026-05-19T03:49:36Z
sandboxsets.agents.kruise.io                             2026-05-19T03:49:37Z
sandboxtemplates.agents.kruise.io                        2026-05-19T03:49:37Z
sandboxupdateops.agents.kruise.io                        2026-05-19T03:49:37Z
securityprofiles.agents.kruise.io                        2026-05-19T03:49:37Z
trafficpolicies.agents.kruise.io                         2026-05-19T03:49:37Z
```

## E2B APIs
OpenKruise Agents 提供了兼容E2B协议的API.

### E2B 兼容性说明

> ⚠️ **重要**：`commands.run`（命令执行）和文件系统 `read/write` API 需要在 Sandbox 中注入 `agent-runtime` 组件。请确保你的
> SandboxSet 已配置 `runtimes: [{name: agent-runtime}]`。详情请参考[运行时注入](./user-manuals/runtime-injection.md)文档。

| API分类  | API                                                    | 参数兼容程度 | 说明                                        |
|--------|--------------------------------------------------------|--------|-------------------------------------------|
| 生命周期管理 | create                                                 | 部分兼容   | 网络访问控制已支持，参见[E2B 网络访问控制](./user-manuals/security/e2b-network-controls.md)。MCP 对接功能待实现 |
|        | get\_info                                              | 完全兼容   |                                           |
|        | list                                                   | 完全兼容   |                                           |
|        | kill                                                   | 完全兼容   |                                           |
|        | pause                                                  | 完全兼容   | pause 为同步接口，请求会阻塞直到 Sandbox 进入 Paused 状态            |
|        | resume                                                 | 完全兼容   |                                           |
|        | connect                                                | 完全兼容   |                                           |
|        | set\_timeout                                           | 完全兼容   | 设置 Sandbox 超时时间（TTL），等价于 E2B 的 `Refresh sandbox` API |
| 代码运行   | run\_code                                              | 完全兼容   | 主容器内需要运行e2b-code-interpreter              |
| 命令执行   | commands.run                                           | 完全兼容   | 需要通过运行时注入agent-runtime组件                  |
| 文件系统   | read/write                                             | 完全兼容   | 需要通过运行时注入agent-runtime组件                  |
|        | upload\_url/download\_url                              | 不支持    | 通过预签名url上传下载待实现                           |
| 日志     | logs                                                   | 不支持    | Sandbox 日志获取待实现                            |
| 监控指标   | metrics                                                | 不支持    | Sandbox 监控指标获取待实现                          |
| 网络     | network                                                | 部分兼容   | 已支持 `allowOut`、`denyOut` 和 `rules`；`egressProxy` 和 `maskRequestHost` 会被拒绝。参见[E2B 网络访问控制](./user-manuals/security/e2b-network-controls.md)。 |
| 生命周期事件 | `https://api.e2b.app/events/sandboxes/{sbx.sandbox_id}` | 不支持    | 生命周期事件待实现                                 |
| 快照管理   | snapshots                                              | 完全兼容   | 具体快照效果依赖于 Checkpoint 实现                   |
| 模板管理   |                                                        | 部分兼容   | 模板读操作已支持， 模板写操作推荐使用容器镜像来替代               |
| API密钥管理 | teams, api-keys                                        | 完全兼容   | OpenKruise Agents 扩展：基于团队的多租户 API 密钥管理     |
| 卷管理    | volumes                                                | 不支持    | 持久化卷管理待实现                                 |

---
title: Architecture
---

# 架构
OpenKruise Agents 的整体架构如下所示：

![alt](/img/kruiseagents/architecture.png)

## sandbox-manager
sandbox-manager 是一个无状态的后台管理组件，它为管理和操作沙箱实例提供 E2B API 和 MCP API。
## sandbox-gateway
sandbox-gateway 是一个轻量级且高效网关，用于将传入流量代理到沙箱。它基于 Envoy Filter 构建。
## sandbox-controller
sandbox-controller 包含一组控制器，负责协调 SandboxSet 和 SandboxClaim 等资源，同时也为相关的 CRD 资源提供准入 Webhook。
## agent-runtime
agent-runtime 是注入到 Sandbox 中的 Sidecar，它为沙箱提供实用工具服务，包括兼容 E2B envd 的命令和文件操作、动态 CSI 挂载等。

# API
OpenKruise Agents 提供 K8S、E2B 和 MCP API。

## K8S APIs
OpenKruise Agents 以 CRD 的形式提供 Kubernetes API，主要面向平台构建者和基础设施团队。


```shell script
$ kubectl get crd | grep kruise.io
checkpoints.agents.kruise.io                             2026-05-19T03:49:36Z
sandboxclaims.agents.kruise.io                           2026-05-19T03:49:36Z
sandboxes.agents.kruise.io                               2026-05-19T03:49:36Z
sandboxsets.agents.kruise.io                             2026-05-19T03:49:37Z
sandboxtemplates.agents.kruise.io                        2026-05-19T03:49:37Z
sandboxupdateops.agents.kruise.io                        2026-05-19T03:49:37Z
```

## E2B APIs
OpenKruise Agents 提供了兼容E2B协议的API.

### E2B 兼容性说明

> ⚠️ **重要**：`commands.run`（命令执行）和文件系统 `read/write` API 需要在 Sandbox 中注入 `agent-runtime` 组件。请确保你的
> SandboxSet 已配置 `runtimes: [{name: agent-runtime}]`。详情请参考[运行时注入](./user-manuals/runtime-injection.md)文档。

| API分类  | API                                                    | 参数兼容程度 | 说明                                        |
|--------|--------------------------------------------------------|--------|-------------------------------------------|
| 生命周期管理 | create                                                 | 部分兼容   | 网络访问控制、原地变配待实现                            |
|        | get\_info                                              | 完全兼容   |                                           |
|        | list                                                   | 完全兼容   |                                           |
|        | kill                                                   | 完全兼容   |                                           |
|        | pause                                                  | 完全兼容   | 考虑到容器生态的效率问题，当前 pause 的实现为异步接口            |
|        | resume                                                 | 完全兼容   |                                           |
|        | connect                                                | 完全兼容   |                                           |
|        | set\_timeout                                           | 完全兼容   | 设置 Sandbox 超时时间（TTL），等价于 E2B 的 `Refresh sandbox` API |
| 代码运行   | run\_code                                              | 完全兼容   | 主容器内需要运行e2b-code-interpreter              |
| 命令执行   | commands.run                                           | 完全兼容   | 需要通过运行时注入agent-runtime组件                  |
| 文件系统   | read/write                                             | 完全兼容   | 需要通过运行时注入agent-runtime组件                  |
|        | upload\_url/download\_url                              | 不支持    | 通过预签名url上传下载待实现                           |
| 日志     | logs                                                   | 不支持    | Sandbox 日志获取待实现                            |
| 监控指标   | metrics                                                | 不支持    | Sandbox 监控指标获取待实现                          |
| 网络     | network                                                | 不支持    | Sandbox 网络配置（出口规则）待实现                      |
| 生命周期事件 | `https://api.e2b.app/events/sandboxes/{sbx.sandbox_id}` | 不支持    | 生命周期事件待实现                                 |
| 快照管理   | snapshots                                              | 完全兼容   | 具体快照效果依赖于 Checkpoint 实现                   |
| 模板管理   |                                                        | 部分兼容   | 模板读操作已支持， 模板写操作推荐使用容器镜像来替代               |
| API密钥管理 | teams, api-keys                                        | 完全兼容   | OpenKruise Agents 扩展：基于团队的多租户 API 密钥管理     |
| 卷管理    | volumes                                                | 不支持    | 持久化卷管理待实现                                 |

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
checkpoints.agents.kruise.io                               2026-03-22T08:50:38Z
sandboxclaims.agents.kruise.io                             2026-03-22T08:50:38Z
sandboxes.agents.kruise.io                                 2026-03-22T08:50:38Z
sandboxsets.agents.kruise.io                               2026-03-22T08:50:38Z
sandboxtemplates.agents.kruise.io                          2026-03-22T08:50:38Z
```

## E2B APIs
OpenKruise Agents 提供了兼容E2B协议的API. 


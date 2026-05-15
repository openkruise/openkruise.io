# 常见问题

## 通用

### OpenKruise Agents 是什么？

OpenKruise Agents 是一个面向 AI Agent 基础设施的 Kubernetes 原生沙箱编排系统。它通过预热池机制实现亚秒级沙箱交付，并兼容 [E2B](https://e2b.dev/) SDK。它是 CNCF [OpenKruise](https://openkruise.io) 生态系统下的子项目。

### 支持哪些 Kubernetes 版本？

OpenKruise Agents 要求 Kubernetes **>= 1.28**。完整的兼容性矩阵请参见[安装文档](../installation.md)。

### 支持哪些云服务提供商？

OpenKruise Agents 与云无关，可在任何符合标准的 Kubernetes 集群上运行，包括自建集群以及阿里云、AWS、GCP、Azure 等托管服务。对于网络受限环境的用户，阿里云容器镜像服务提供了国内镜像。详情参见[安装文档 — 使用国内镜像源](../installation.md#using-china-mirror-registry)。

### OpenKruise Agents 是否兼容 E2B SDK？

是的。`sandbox-manager` 实现了 E2B 协议，因此使用 `e2b_code_interpreter` 或 `e2b_desktop` Python SDK 的现有代码无需修改——只需将 `E2B_DOMAIN` 和 `E2B_API_KEY` 指向您自己的集群。详情参见 [E2B 客户端](../user-manuals/e2b-client.md)。

---

## 安装与升级

### 各组件的正确安装顺序是什么？

必须先安装 **Sandbox Controller**，再安装 **Sandbox Manager**。Controller 提供了 Manager 所依赖的 CRD 资源。卸载时顺序相反：先卸载 Manager，再卸载 Controller。

### 为什么 `helm upgrade` 不会自动更新 CRD？

这是 Helm 的标准行为——`helm upgrade` 不会更新位于 `crds/` 目录下的 CRD。您必须在执行 `helm upgrade` 之前手动应用更新的 CRD：

```bash
helm pull openkruise/agents-sandbox-controller --version <新版本号> --untar
kubectl apply -f agents-sandbox-controller/crds/
rm -rf agents-sandbox-controller
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system --version <新版本号>
```

### 从 0.1.0 升级到 0.2.0 需要特别注意什么？

0.2.0 版本引入了重大 CRD 变更（新增 `Checkpoint` CRD、新增 `runtimes` 字段、`SandboxSet` 新增 `updateStrategy`）以及独立的 `Sandbox Gateway` Deployment。升级时的关键操作：

1. 在执行 `helm upgrade` 前，手动应用新的 CRD。
2. 显式指定 `ingress.className`——其默认值从 `nginx` 变更为空字符串。
3. 显式指定 `e2b.adminApiKey`——其默认值从 `admin-987654321` 变更为空字符串。
4. 验证 Ingress 路由：数据面流量现在路由至 `sandbox-gateway`，而非 Manager Service。

详情参见[从 0.1.0 升级到 0.2.0](../installation.md#upgrading-from-010-to-020)。

---

## 预热池与 SandboxSet

### 预热池的工作原理是什么？

`SandboxSet` 维护一个预先创建的处于 `available` 状态的 `Sandbox` 实例（Pod）池。当沙箱被声明（claim）时，系统立即从池中分配一个（亚秒级），`SandboxSet` 随即自动扩容以补充池中的库存。`replicas` 字段控制目标池大小，**不包含**已分配的沙箱数量。

### 如何选择合适的预热池大小？

将 `replicas` 设置为略大于预期的峰值突发量。例如，如果您的应用在短时间内最多声明 20 个沙箱，25–30 是一个合理的起点。监控 `status.availableReplicas`，若该值频繁降至 0，则应增大 `replicas`。

### 如果声明沙箱时预热池为空，会发生什么？

声明操作将等待新沙箱创建并就绪。此时交付时间取决于集群性能（Pod 调度、镜像拉取、容器启动），无法达到亚秒级。为避免此情况，应保持足够大的 `replicas`，或使用 `createOnNoStock: true` 完全绕过预热池。

### 如何在不影响现有沙箱的情况下更新运行中的 SandboxSet？

直接更新 `SandboxSet` 的 spec。自 v0.2.0 起，`SandboxSet` 支持通过 `updateStrategy.maxUnavailable` 字段配置滚动更新策略，用于控制更新期间最多有多少个预热沙箱处于不可用状态。已分配（已声明）的沙箱**不受** SandboxSet 更新的影响。

---

## 沙箱声明

### 通过 E2B SDK 声明和通过 SandboxClaim CRD 声明有什么区别？

两种方式都从同一个预热池中声明沙箱。

- **E2B SDK**（`e2b_code_interpreter.Sandbox.create(...)`）是编程式路径，适用于需要按需获取沙箱的 Agent 应用。
- **SandboxClaim CRD** 是 Kubernetes 声明式路径，适用于管理批量工作负载或与 GitOps 流水线集成的基础设施团队。

### 能否一次声明多个沙箱？

可以。在 `SandboxClaim` 中设置 `replicas`（或使用 E2B 批量 API）。批量声明是尽力而为的：沙箱随着可用性逐步交付，直到 `claimTimeout` 超时为止。使用标签 `agents.kruise.io/claim-name=<sbc-name>` 可列出某次声明交付的所有沙箱。

### 如何设置超时以自动删除沙箱？

在 E2B SDK 中向 `Sandbox.create()` 传入 `timeout=<秒数>`，或在 `SandboxClaim` spec 中设置 `shutdownTime`（RFC 3339 绝对时间戳）。若要防止沙箱超时，设置扩展元数据键 `e2b.agents.kruise.io/never-timeout: "true"`。

### 能否向沙箱注入环境变量？

可以，通过 E2B SDK 的 `envs={...}` 参数或 `SandboxClaim` 中的 `envVars` 字段。注意：这些变量目前仅传递给 `agent-runtime` 用于初始化，仅在 `commands.run` API 中可用，**不会**作为主容器的进程级环境变量存在。

---

## 网络与端口

### agent-runtime 使用哪个端口？

`agent-runtime` 通过端口 **49983** 与 `sandbox-manager` 和 `sandbox-controller` 通信。如果您的集群使用了防火墙或安全组，请确保所有 Sandbox Pod 都开放了该端口。

### 为什么无法访问远程桌面流？

请确保在云平台的安全组中开放了 **6080** 端口。E2B Desktop SDK 通过该端口流式传输远程桌面。详情参见[运行 E2B Desktop 沙箱](../best-practices/running-e2b-for-desktop.md)。

### Sandbox Gateway 的作用是什么？何时需要扩容？

`sandbox-gateway`（v0.2.0 引入）是一个基于 Envoy 的数据面网关，负责将流量代理到 Sandbox Pod。它可以独立于 Sandbox Manager 进行扩容（`gateway.replicaCount`）。当您在 Gateway 的 Envoy 指标中观察到连接数高或延迟升高时，应对其进行扩容。

---

## 故障排查

### 沙箱声明停在非 Completed 状态，如何排查？

1. 执行 `kubectl describe sbc <名称>` 查看事件和状态条件。
2. 执行 `kubectl get sbx -l agents.kruise.io/claim-name=<sbc-name>` 查看已分配沙箱的状态。
3. 查看 sandbox-manager 日志：`kubectl logs -n sandbox-system -l app=sandbox-manager`。
4. 若 Sandbox Pod 存在但未就绪，执行 `kubectl describe pod <sandbox-pod>` 检查调度或镜像拉取错误。

### 如何保留失败的沙箱以便排查问题？

在 E2B SDK 中设置元数据键 `e2b.agents.kruise.io/reserve-failed-sandbox: "true"`，或在 `SandboxClaim` 中设置 `reserveFailedSandbox: true`。默认情况下，失败的沙箱实例会被删除并重试。

### Helm 卸载后控制器已移除，但 Sandbox Pod 仍在运行，这是正常的吗？

是的。`helm uninstall` 不会删除 CRD、Sandbox CR 或 `sandbox-system` 命名空间。运行中的 Pod 属于仍然存在的 Sandbox CR。若要彻底清理，需手动删除 CRD（这会级联删除所有 CR 及其 Pod），然后删除命名空间：

```bash
kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd
kubectl delete ns sandbox-system
```

> **警告**：删除 CRD 是不可逆的，将销毁所有沙箱实例。

---

## 参与贡献

### 如何为 OpenKruise Agents 做贡献？

请参见[贡献指南](./contribution.md)，了解开发环境搭建、代码规范和 PR 流程。您也可以加入社区钉钉群（群号：44862615），或通过 [OpenKruise GitHub 组织](https://github.com/openkruise)联系维护者。

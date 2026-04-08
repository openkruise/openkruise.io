# 运行时注入

## 概述

运行时注入（Runtime Injection）是 OpenKruise Agents 的自动配置注入机制。通过在 Sandbox 相关 CRD（如
SandboxSet、SandboxClaim、SandboxTemplate 或 Sandbox）中配置 `runtimes` 字段，系统会自动向 Sandbox Pod 中注入所需的 Sidecar
容器、环境变量、卷挂载和生命周期钩子，从而避免用户手动编写复杂的 YAML 配置。

运行时注入目前支持以下两种注入类型：

| 注入类型              | `runtimes.name` | 说明                                                                    |
|-------------------|-----------------|-----------------------------------------------------------------------|
| **Agent Runtime** | `agent-runtime` | 注入 `agent-runtime`（兼容 envd）组件，提供 E2B 命令执行（`commands.run`）、文件系统读写等高级功能 |
| **CSI 挂载**        | `csi`           | 注入 CSI 挂载 sidecar，支持[动态持久化卷挂载](./sandbox-claim.md#动态挂载持久化卷)           |

## 工作机制

运行时注入的工作机制如下：

1. **配置来源**：系统从 `sandbox-system` 命名空间下名为 `sandbox-injection-config` 的 ConfigMap 中读取注入配置。该
   ConfigMap 通常由集群管理员或部署工具维护。

2. **注入触发**：当 Sandbox 被创建时，系统检查其 `spec.runtimes` 字段。如果配置了匹配的运行时类型，则执行相应的注入。

3. **注入内容**：对于每种运行时类型，注入包括：
    - **Init 容器**：Sidecar 容器被追加到 Pod 的 `initContainers` 中，在主容器启动之前执行以准备运行时环境。
    - **环境变量**：所需的环境变量被添加到主容器（Pod spec 中的第一个容器）。
    - **卷挂载**：必要的卷挂载被添加到主容器。
    - **卷**：所需的卷被添加到 Pod spec。
    - **生命周期钩子**（仅 agent-runtime）：可能会向主容器添加 `postStart` 生命周期钩子。

4. **传播路径**：`runtimes` 字段通过以下路径传播：
    - `SandboxTemplate` → `SandboxSet` → `Sandbox`（创建时继承）
    - `SandboxClaim` → `Sandbox`（获取时应用）

## 使用方法

### 在 SandboxSet 中配置

最常见的用法是在 SandboxSet 中配置 `runtimes` 字段，这样从该 SandboxSet 创建的所有 Sandbox 都会自动注入配置的运行时。

**仅注入 agent-runtime：**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: agent-runtime
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

**同时注入 agent-runtime 和 CSI 挂载：**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: demo-with-csi
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: agent-runtime
    - name: csi
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

### 在 SandboxTemplate 中配置

如果你使用 `SandboxTemplate` 定义可复用的沙箱模板，可以在其中配置 `runtimes` 字段：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxTemplate
metadata:
  name: demo-template
  namespace: default
spec:
  runtimes:
    - name: agent-runtime
  template:
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

### 在 SandboxClaim 中配置

在获取沙箱时，也可以在 SandboxClaim 中指定 `runtimes` 字段。这在你需要按需自定义运行时配置而不是在预热池级别配置时非常有用：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  runtimes:
    - name: agent-runtime
    - name: csi
```

## 何时使用各运行时类型

### agent-runtime

在以下场景下，你应当配置 `agent-runtime` 注入：

- 需要使用 **E2B SDK 功能**，如 `commands.run`（命令执行）和文件系统 `read/write`
- 需要在获取沙箱时**注入环境变量**
- 需要 `agent-runtime` 提供的**高级沙箱管理**功能

> 大多数依赖 E2B SDK 的使用场景都需要注入 `agent-runtime`。如果不确定是否需要，建议启用。

更多详情请参考 [E2B SDK 接入文档](../developer-manuals/e2b-client.md)。

### csi

在以下场景下，你应当配置 `csi` 注入：

- 需要使用[动态持久化卷挂载](./sandbox-claim.md#动态挂载持久化卷)功能，在获取沙箱时将 PV 挂载到沙箱中

> `csi` 注入通常与 `agent-runtime` 注入一起使用。

## 冲突处理

注入机制包含了多种冲突检测和处理策略以确保安全性：

### 容器名称冲突

注入前，系统会检查待注入的 Sidecar 容器名称是否已存在于 Pod 的 `containers` 或 `initContainers` 中。如果检测到冲突，则**跳过该运行时类型的整个注入**以避免损坏。这意味着：

- 如果你在 SandboxSet 模板中手动定义了与 Sidecar 同名的容器，注入将不会执行。
- 每种运行时类型的注入是独立的：一个的名称冲突不会影响另一个。

### 生命周期钩子冲突（agent-runtime）

注入 `agent-runtime` 时，系统可能需要向主容器添加 `postStart` 生命周期钩子。冲突处理遵循以下规则：

- 如果主容器**没有** `postStart` 钩子，则应用注入的钩子。
- 如果主容器**已经有**有效的 `postStart` 钩子，且注入配置也定义了一个，则**跳过整个注入**（包括环境变量和卷挂载）以防止不一致的状态。
- 如果主容器有 `postStart` 钩子但注入配置没有定义，则环境变量和卷挂载仍会正常注入。

### 环境变量与卷去重

- **CSI 注入**：环境变量和卷挂载按名称去重。如果主容器已有同名的环境变量或卷挂载，则保留现有的。
- **agent-runtime 注入**：环境变量和卷挂载直接追加（不去重）。
- **卷**：在 Pod spec 级别始终按名称去重。已有的同名卷不会被覆盖。

## 注意事项

1. **性能影响**：运行时注入会向 Pod 添加 Init 容器，需要在主容器启动之前运行。这可能会增加沙箱启动时间。

2. **ConfigMap 依赖**：注入机制依赖于 `sandbox-system` 命名空间下的 `sandbox-injection-config` ConfigMap。如果该 ConfigMap
   不存在，注入将被静默跳过。

3. **主容器约定**：注入机制将 `spec.containers` 中的**第一个容器**视为主容器。请确保你的沙箱主容器在列表中排第一位。

4. **跳过注入**：如果你不需要任何运行时注入（例如高度自定义的沙箱配置），只需省略 `runtimes` 字段或将其留空。对于 E2B
   用户，也可以在获取沙箱的过程中[跳过 agent-runtime 初始化](./sandbox-claim.md#跳过-agent-runtime-初始化)。

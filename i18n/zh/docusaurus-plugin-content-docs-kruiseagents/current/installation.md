---
title: 安装
---

## 概述

Sandbox Controller、Sandbox Manager 和 Sandbox Gateway 是 OpenKruise 生态中的三个核心组件，共同构成完整的 Sandbox 运行环境：

- **Sandbox Controller**：负责管理 Sandbox 相关的 CRD 资源，包括 SandboxSet、Sandbox、SandboxClaim 和 SandboxTemplate
  的生命周期管理。
- **Sandbox Manager**：提供 Sandbox 的 API 服务和控制面，负责 Sandbox 实例的调度、创建与回收，支持 E2B 协议访问。
- **Sandbox Gateway**（0.2.0 新增）：独立的数据面网关服务，基于 Envoy + Golang Filter 构建，负责流量路由、负载均衡与熔断保护，支持独立扩缩容。

本页通过 Helm 安装上述三个组件并对部署结果进行验证。命令面向 bash（Linux、macOS 或 Windows 下的 WSL/Git Bash）。
所有以 `<占位符>` 形式书写的内容都是变量，必须先在
[第 0 步：准备安装参数](#第-0-步准备安装参数) 中确定取值——带着字面占位符直接执行命令必定失败。

## 版本兼容性

| 组件                 | Chart 版本 | 镜像版本   | Kubernetes 兼容性 |
|--------------------|----------|--------|----------------|
| Sandbox Controller | 0.3.0    | v0.3.0 | `>= 1.28`      |
| Sandbox Manager    | 0.3.0    | v0.3.0 | `>= 1.28`      |
| Sandbox Gateway    | —        | v0.3.0 | `>= 1.28`      |

> **说明**：Sandbox Gateway 没有独立的 chart，它随 Sandbox Manager chart（0.2.0+）一起部署，无需单独安装。

## 前置条件

开始前，请用最后一列的命令逐项检查：

| #   | 要求                                        | 最低版本        | 检查命令                                                    |
|-----|---------------------------------------------|----------------|-------------------------------------------------------------|
| 1   | 一个可供部署的 Kubernetes 集群               | 1.28           | `kubectl version`                                           |
| 2   | `kubectl` 已配置并指向该集群                  | —              | `kubectl version --client`（[安装][kubectl-install]）        |
| 3   | Helm                                        | 3.5            | `helm version`（[安装][helm-install]）                       |
| 4   | 集群中已运行 Ingress 控制器                  | —              | `kubectl get ingressclass`                                  |

[kubectl-install]: https://kubernetes.io/zh-cn/docs/tasks/tools/
[helm-install]: https://helm.sh/zh/docs/intro/install/

关于 Ingress 控制器的说明：

- Sandbox Manager chart **一定会渲染 Ingress 资源**，且 `ingress.className` 是 chart 的 `required` 值：
  为空或缺失时 `helm install` 会立即失败。即使你不打算通过 Ingress 暴露服务（例如只使用 `kubectl port-forward`
  或集群内 Service URL 访问），该参数也是必填的。
- 如果 `kubectl get ingressclass` 没有任何输出，请先安装 Ingress 控制器。以 ingress-nginx 为例
  （class 名为 `nginx`，需要能访问 `kubernetes.github.io` 和 Docker Hub）：

  ```bash
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    -n ingress-nginx --create-namespace
  ```

- 若要从集群外通过 HTTPS 访问服务，还需要 DNS 解析记录和 TLS 证书。首次端到端验证可以两者都不配——改用
  [E2B SDK 集成](./user-manuals/e2b-client.md) 中的 `kubectl port-forward` 方式即可。

## 通过 Helm 安装

### 第 0 步：准备安装参数

下文安装命令用到以下占位符。在第 3 步和第 4 步之前必须全部确定取值，每一行都说明了取值来源：

| 占位符                  | Helm 值               | 含义                                                                                                  | 取值方法                                                                                                                                                 |
|------------------------|-----------------------|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<your-api-key>`      | `e2b.adminApiKey`     | 客户端访问 Sandbox Manager 时使用的管理员 API Key。这是一个**由你自己生成**的密钥，与 e2b.dev 账号无关。 | 生成一个：`openssl rand -hex 32`（或任意足够长的随机字符串）                                                                                             |
| `<your-ingress-class>`| `ingress.className`   | 集群 Ingress 控制器的 class 名（如 `nginx`、`alb`）。                                                     | `kubectl get ingressclass -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'`                                                                     |
| `<your-domain>`       | `e2b.domain`          | E2B 协议域名。它同时决定所生成 Ingress 的 host 规则，以及返回给 SDK 客户端的沙箱地址中的域名。                 | 见下表。                                                                                                                                                  |

**`e2b.domain` 的选择（重要）。** 0.3.0 chart 中 `e2b.domain` 的默认值是不可用的占位符 `your.domain.com`，且 chart
会将其作为静态 `--e2b-domain` 传给 manager。保留默认值会导致所有沙箱地址无法解析。请从下列方案中选择一个：

| 场景                                                          | `<your-domain>` 的取值        | 效果                                                                                                                                                                |
|---------------------------------------------------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 生产：客户端通过你掌控的真实域名访问服务                        | 你的域名，如 `sandbox.example.com` | Ingress host 变为 `api.sandbox.example.com` / `*.sandbox.example.com` / `sandbox.example.com`；DNS 必须解析到 Ingress 入口，HTTPS 访问需要 TLS 证书。                 |
| 快速验证、多域名场景，或暂无公网域名                            | 空字符串 `""`                  | 动态解析：manager 根据每个请求的 `Host` 头推导域名。配合 `kubectl port-forward` 或集群内访问时无需任何 DNS 配置。                                                          |

> **SDK Key 格式说明**：OpenKruise 管理员 Key 是普通字符串，不是官方 E2B SDK 在本地校验的 `e2b_` 前缀格式。后续使用
> E2B SDK 时，请用 `encode_for_e2b_sdk` 包装该 Key，或关闭本地格式校验——详见
> [API Key 与团队](./user-manuals/api-keys-and-teams.md)。Key 本身的认证始终在服务端完成。

### 第 1 步：添加 OpenKruise Charts 仓库

```bash
## 添加 openkruise charts 仓库（需要能访问 openkruise.github.io）
helm repo add openkruise https://openkruise.github.io/charts/

## 更新仓库（如果已经安装过 openkruise charts 仓库）
helm repo update

## 验证两个 chart 可见且列表中包含 0.3.0
helm search repo openkruise/agents-sandbox-controller --versions
helm search repo openkruise/agents-sandbox-manager --versions
```

### 第 2 步：创建 Namespace

```bash
## 幂等命令：Namespace 无论是否已存在都会执行成功
kubectl create namespace sandbox-system --dry-run=client -o yaml | kubectl apply -f -
```

### 第 3 步：安装 Sandbox Controller

> **安装顺序**：Sandbox Controller **必须**先于 Sandbox Manager 安装，因为它提供了 Sandbox Manager 所需的 CRD 资源。

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0
```

等待两个副本就绪（预期输出 `pod/... condition met`）：

```bash
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l app.kubernetes.io/name=agents-sandbox-controller --timeout=300s
```

如果等待超时，请先检查 Pod 事件再继续——参见[故障排查](#故障排查)。

### 第 4 步：安装 Sandbox Manager

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

> **必填参数**：`e2b.adminApiKey`、`ingress.className` 和 `e2b.domain` 必须显式指定。`e2b.adminApiKey` 或
> `ingress.className` 为空时 chart 在渲染阶段直接拒绝安装；`e2b.domain` 保留默认值则会产生不可用的沙箱地址
> （见[第 0 步](#第-0-步准备安装参数)）。
>
> **说明**：0.3.0 版本的 Sandbox Manager chart 会同时部署 Sandbox Gateway，无需额外安装。

等待 manager 与 gateway 副本就绪：

```bash
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l component=agents-sandbox-manager --timeout=300s
kubectl wait -n sandbox-system --for=condition=Ready pods \
  -l app.kubernetes.io/name=sandbox-gateway --timeout=300s
```

## 验证安装

第 4 步完成后请执行以下检查。在部署任何沙箱负载之前，以下各项必须全部通过。

### 1. Deployment 与 Pod

```bash
kubectl get deployments,pods -n sandbox-system
```

预期结果——三个 Deployment，`READY` 数与副本数一致，所有 Pod `Running` 且 `2/2 READY`
（每个 manager Pod 还包含一个 `envoy-proxy` sidecar 容器）：

| Deployment                | 副本数   | 每个 Pod 的容器                          |
|---------------------------|---------|------------------------------------------|
| `agents-sandbox-controller` | 2       | `manager`                                |
| `agents-sandbox-manager`   | 2       | `controller` + `envoy-proxy`             |
| `sandbox-gateway`          | 2       | `envoy`（+ 可选的 init 容器）             |

### 2. CRD

```bash
kubectl get crd | grep agents.kruise.io
```

预期结果——恰好以下六个 CRD：

```text
checkpoints.agents.kruise.io
sandboxclaims.agents.kruise.io
sandboxes.agents.kruise.io
sandboxsets.agents.kruise.io
sandboxtemplates.agents.kruise.io
sandboxupdateops.agents.kruise.io
```

### 3. Service

```bash
kubectl get svc -n sandbox-system
```

预期结果（名称以本页使用的默认 release 名为准）：

| Service                 | 端口                                                      | 用途                                       |
|-------------------------|-----------------------------------------------------------|--------------------------------------------|
| `agents-sandbox-manager` | `7788`（envoy 数据面）、`8080`（E2B 管理 API）、`9002`（gRPC） | E2B API 入口与内置流量代理                  |
| `sandbox-gateway`       | `7788`                                                    | 独立数据面网关                              |

### 4. Manager API 健康检查

在集群内运行一次性 curl Pod，预期返回 HTTP `200`：

```bash
kubectl run manager-health-check -n sandbox-system --rm -i --restart=Never \
  --image=curlimages/curl --command -- \
  curl -s -o /dev/null -w '%{http_code}\n' \
  http://agents-sandbox-manager.sandbox-system.svc.cluster.local:8080/health
```

> 如果节点无法从 Docker Hub 拉取 `curlimages/curl`，可替换为节点可达的任意 curl 镜像，或跳过本项检查——
> 检查 1–3 已能证明控制面正常运行。

### 5. Ingress 地址（仅集群外域名访问需要）

```bash
kubectl get ingress agents-sandbox-manager -n sandbox-system
kubectl get ingress agents-sandbox-manager -n sandbox-system \
  -o jsonpath='{range .status.loadBalancer.ingress[*]}{.hostname}{.ip}{"\n"}{end}'
```

第二条命令会打印 Ingress 分配到的负载均衡地址。请将 `api.<your-domain>`、`*.<your-domain>` 和 `<your-domain>`
的 DNS 记录解析到该地址。如果 ADDRESS 列一直为空，说明没有 Ingress 控制器接管该 Ingress——请检查
[前置条件](#前置条件)。HTTPS 访问需要安装覆盖全部三个 host 的证书：参见
[使用自签名证书](./best-practices/use-self-signed-cert.md) 或 [cert-manager](./best-practices/cert-manager.md)。

> Ingress 名称是 `agents-sandbox-manager`，因为它跟随本页使用的 Helm release 名。如果你选择了其他 release
> 名称，名称会相应不同。

## 创建沙箱之前还缺什么

安装全部通过只代表控制面已就绪。创建并使用第一个沙箱还需要：

1. **沙箱模板**——一个用运行时镜像（例如 `e2bdev/code-interpreter`）预热沙箱实例的 `SandboxSet`。参考端到端教程
   [运行 E2B Code Interpreter 沙箱](./best-practices/running-e2b-for-code-interpreter.md)，几分钟即可部署一个。
2. **客户端接入方式**——从 [E2B SDK 集成](./user-manuals/e2b-client.md) 的五种方式（原生协议、私有协议、URL
   参数、集群内、端口转发）中选择一种。
3. **API Key 管理**（可选）——团队 Key 与配额见 [API Key 与团队](./user-manuals/api-keys-and-teams.md)。

## 使用国内镜像源

默认镜像仓库（Docker Hub：`openkruise/*`、`envoyproxy/envoy`）要求节点能够访问 Docker Hub。
如果你的节点位于中国大陆且无法直连 Docker Hub，请对两个 chart 的全部镜像使用下方阿里云容器镜像服务的国内镜像。

### 国内镜像地址

| 组件                 | 镜像地址                                                                                  | 版本             |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.3.0`       |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.3.0`       |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.3.0`       |
| Envoy Proxy        | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy`                    | `v1.33-latest` |

### 使用国内镜像安装

**安装 Sandbox Controller（使用国内镜像）**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0 \
  --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller
```

**安装 Sandbox Manager（使用国内镜像）**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set controller.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager \
  --set proxy.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy \
  --set proxy.tag=v1.33-latest \
  --set gateway.image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway
```

> **说明**：如需启用 Gateway 初始化容器，请额外添加：
> ```bash
> --set gateway.initContainer.enabled=true \
> --set gateway.initContainer.image.repository=registry.cn-beijing.aliyuncs.com/acs/busybox \
> --set gateway.initContainer.image.tag=1.36.1
> ```

---

## 通过 Helm 升级

> **参数必须带上。** 除非显式传 `--reuse-values`，`helm upgrade` **不会**复用上次安装时的 `--set`
> 值。每次升级都重复必填参数是安全的默认做法——否则升级会被拒绝（`e2b.adminApiKey is required`），
> 或将你的配置静默重置。

### 升级 Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0
```

### 升级 Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

> **注意：**
> 1. 升级顺序：**先升级 Sandbox Controller，再升级 Sandbox Manager**，确保 CRD 兼容。
> 2. 在升级之前，**必须**先阅读 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
>     ，确保你已经了解新版本的不兼容变化。
> 3. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。
> 4. 如果你安装时使用的 `--set` 参数与本页示例不同，请重复**你自己**的参数——上面的占位符与
>     [第 0 步](#第-0-步准备安装参数) 中解析的取值一致。

### 从 0.1.0 升级到 0.2.0

0.2.0 版本引入了独立的 Sandbox Gateway 组件和多项 CRD 变更，升级时请注意：

1. **手动更新 CRD（必须）**：Helm upgrade **不会自动更新** `crds/` 目录下的 CRD 定义。0.2.0 版本对 CRD 有大量变更，**必须在
   执行 `helm upgrade` 之前手动应用新的 CRD**，否则新功能将无法正常工作。

   ```bash
   # 从 chart 包中提取 CRD 并应用（以在线安装为例）
   helm pull openkruise/agents-sandbox-controller --version 0.2.0 --untar
   kubectl apply -f agents-sandbox-controller/crds/
   rm -rf agents-sandbox-controller
   ```

   0.2.0 版本 CRD 的主要变化包括：
    - **新增 Checkpoint CRD**（`checkpoints.agents.kruise.io`）：用于沙箱状态的检查点/快照管理
    - **所有 CRD 新增 `runtimes` 字段**：Sandbox、SandboxSet、SandboxClaim、SandboxTemplate 均新增运行时配置
    - **SandboxSet 新增 `updateStrategy`**：支持滚动更新策略配置（`maxUnavailable`），以及 `updatedReplicas`、
      `updatedAvailableReplicas` 状态字段
    - **SandboxClaim 功能增强**：新增动态卷挂载（`dynamicVolumesMount`）、原地资源更新（`inplaceUpdate.resources`）、
      跳过初始化运行时（`skipInitRuntime`）；`ttlAfterCompleted` 默认值从 `5m` 调整为 `60m`
    - **Webhook 增强**：新增 Pod Delete 和 Pod Eviction 的 ValidatingWebhook

2. **新增 Gateway Deployment**：0.2.0 在保留 Manager Pod 内 Envoy Sidecar 的基础上，新增了独立的 Sandbox Gateway
   Deployment，
   可根据流量压力单独扩缩容。
3. **Ingress 路由变更**：0.2.0 新增了 `ingress.dataplaneService` 参数（默认 `sandbox-gateway`），数据面流量将路由到 Gateway
   Service 而非 Manager Service。请确认你的 Ingress 配置已正确更新。
4. **新增必填参数**：`ingress.className` 在 0.2.0 中默认值为空字符串，需显式指定。

### 从 0.2.0 升级到 0.3.0

0.3.0 版本引入了 Sandbox 批量升级能力（SandboxUpdateOps）和 Gateway 优化，升级时请注意：

1. **手动更新 CRD（必须）**：Helm upgrade **不会自动更新** `crds/` 目录下的 CRD 定义。0.3.0 版本新增了 CRD 并对现有 CRD
   有多处变更，**必须在执行 `helm upgrade` 之前手动应用新的 CRD**，否则新功能将无法正常工作。

   ```bash
   # 从 chart 包中提取 CRD 并应用（以在线安装为例）
   helm pull openkruise/agents-sandbox-controller --version 0.3.0 --untar
   kubectl apply -f agents-sandbox-controller/crds/
   rm -rf agents-sandbox-controller
   ```

   0.3.0 版本 CRD 的主要变化包括：
    - **新增 SandboxUpdateOps CRD**（`sandboxupdateops.agents.kruise.io`）：用于批量升级 Sandbox
      实例，支持通过标签选择器选择目标沙箱，配置滚动更新策略（`maxUnavailable`），并跟踪升级进度（`updatedReplicas`、
      `updatingReplicas`、`failedReplicas`）
    - **Sandbox 新增 `lifecycle` 字段**：支持升级生命周期钩子，包括 `preUpgrade`（升级前执行，用于备份工作区数据）和
      `postUpgrade`（升级后执行，用于恢复工作区数据），每个钩子支持 `exec` 命令和 `timeoutSeconds` 超时配置
    - **Sandbox 新增 `upgradePolicy` 字段**：定义沙箱升级策略类型（如 `Recreate`），为空时禁用升级
    - **SandboxClaim 增强**：`claimTimeout` 新增最小值校验（必须 >= 1s）；`waitReadyTimeout` 新增最小值校验（必须 >= 1s）；

2. **新增 Webhook**：新增 SandboxUpdateOps 资源的 ValidatingWebhook（`v-suo.kb.io`），对 CREATE 和 UPDATE 操作进行校验。

3. **RBAC 变更**：Controller 新增 `sandboxupdateops` 和 `sandboxupdateops/status` 资源的操作权限。

4. **Gateway 端口变更**：Gateway 监听端口从 `10000` 调整为 `7788`，Gateway Service 的端口和目标端口统一为 `7788`。如果你在
   Ingress 或其他配置中硬编码了端口号 `10000`，**必须更新**为 `7788`。

5. **Gateway 优雅退出**：Gateway Envoy 容器新增 `preStop` 生命周期钩子，在终止前先排空监听器连接（
   `drain_listeners?graceful`），等待 `drainTimeSeconds`（默认 30s）后再退出，避免升级/缩容时流量中断。

6. **Envoy 配置增强**：
    - 新增 `gateway.envoy.drainTimeSeconds`（排水时间，默认 `30`）
    - 新增 `gateway.envoy.streamIdleTimeout`（流空闲超时，默认 `600s`）
    - 新增 `gateway.envoy.connectTimeout`（连接超时，默认 `5s`，此前硬编码为 `5s`）
    - `gateway.envoy.concurrency` 默认值从 `4` 改为空字符串，未指定时，与 `gateway.resources.cpu` 值保持一致

---

## 手工下载 Charts 包

如果目标环境无法连接 `https://openkruise.github.io/charts/`，可在能访问 [GitHub Releases](https://github.com/openkruise/charts/releases)
（需要访问 `github.com`）的机器上下载 chart 包，传输后在本地文件上安装。资产命名遵循
`<chart>-<version>.tgz` 规则：

```bash
# 下载两个 chart 包（需要能访问 github.com）
curl -L -o agents-sandbox-controller-0.3.0.tgz \
  https://github.com/openkruise/charts/releases/download/agents-sandbox-controller-0.3.0/agents-sandbox-controller-0.3.0.tgz
curl -L -o agents-sandbox-manager-0.3.0.tgz \
  https://github.com/openkruise/charts/releases/download/agents-sandbox-manager-0.3.0/agents-sandbox-manager-0.3.0.tgz

# 从本地包安装——必填参数与在线安装相同
helm install agents-sandbox-controller ./agents-sandbox-controller-0.3.0.tgz \
  -n sandbox-system
helm install agents-sandbox-manager ./agents-sandbox-manager-0.3.0.tgz \
  -n sandbox-system \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain>
```

升级时将 `install` 换成 `upgrade` 并保持相同参数。

---

## 可选项

### Sandbox Controller 安装参数

下表展示了 Sandbox Controller chart 所有可配置的参数和它们的默认值：

| Parameter                    | Description                 | Default                                                                                                                 |
|------------------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller 副本数              | `2`                                                                                                                     |
| `image.repository`           | Controller 镜像仓库             | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller 镜像版本             | `v0.3.0`                                                                                                                |
| `image.pullPolicy`           | 镜像拉取策略           | `IfNotPresent`                                                                                                          |
| `webhook.port`               | Webhook 服务端口                | `9443`                                                                                                                  |
| `metrics.port`               | Metrics 服务端口               | `8443`                                                                                                                  |
| `healthProbe.port`           | 健康检查端口                      | `8081`                                                                                                                  |
| `resources.limits.cpu`       | Controller CPU 资源限制         | `2`                                                                                                                     |
| `resources.limits.memory`    | Controller 内存资源限制           | `4Gi`                                                                                                                   |
| `resources.requests.cpu`     | CPU 资源请求                       | `2`                                                                                                                     |
| `resources.requests.memory`  | 内存资源请求                    | `4Gi`                                                                                                                   |
| `namespace.name`             | 部署的命名空间                     | `sandbox-system`                                                                                                        |
| `serviceAccount.create`      | 是否创建 ServiceAccount         | `true`                                                                                                                  |
| `serviceAccount.automount`   | 是否自动挂载 ServiceAccount Token | `true`                                                                                                                  |
| `serviceAccount.annotations` | ServiceAccount 注解           | `{}`                                                                                                                    |
| `serviceAccount.name`        | ServiceAccount 名称            | `""`                                                                                                                    |
| `rbac.create`                | 是否创建 RBAC 资源                | `true`                                                                                                                  |
| `imagePullSecrets`           | 镜像拉取密钥列表                    | `[]`                                                                                                                    |
| `nameOverride`               | 覆盖 Chart 名称                 | `""`                                                                                                                    |
| `fullnameOverride`           | 覆盖完整名称                      | `""`                                                                                                                    |
| `podAnnotations`             | Pod 注解                      | `{}`                                                                                                                    |
| `podLabels`                  | Pod 标签                      | `{}`                                                                                                                    |
| `podSecurityContext`         | Pod 安全上下文                   | `{runAsNonRoot: true, seccompProfile: {type: RuntimeDefault}}`                                                          |
| `securityContext`            | 容器安全上下文                   | `{allowPrivilegeEscalation: false, capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true}` |
| `nodeSelector`               | Pod 调度的节点选择器                | `{}`                                                                                                                    |
| `tolerations`                | Pod 调度的容忍度                  | `[]`                                                                                                                    |
| `affinity`                   | Pod 调度的亲和性                  | `{}`                                                                                                                    |

### Sandbox Manager 安装参数

下表展示了 Sandbox Manager chart 所有可配置的参数和它们的默认值：

#### Controller 参数

| Parameter                          | Description         | Default                      |
|------------------------------------|---------------------|------------------------------|
| `replicaCount`                     | Manager 副本数         | `2`                          |
| `controller.repository`            | Controller 镜像仓库     | `openkruise/sandbox-manager` |
| `controller.tag`                   | Controller 镜像版本     | `v0.3.0`                     |
| `controller.pullPolicy`            | 镜像拉取策略 | `IfNotPresent`               |
| `controller.logLevel`              | 日志级别                | `5`                          |
| `controller.infra`                 | Sandbox 基础设施类型      | `sandbox-cr`                 |
| `controller.hostNetwork`           | 是否使用 Host Network   | `false`                      |
| `controller.maxClaimWorkers`       | 最大 Claim 工作线程数      | `100`                        |
| `controller.maxCreateQPS`          | 创建 Sandbox 的最大 QPS  | `200`                        |
| `controller.extProcMaxConcurrency` | 外部处理器最大并发数          | `3000`                       |
| `controller.resources.cpu`         | Controller CPU 资源限制 | `2`                          |
| `controller.resources.memory`      | Controller 内存资源限制   | `4Gi`                        |

#### Proxy (Envoy) 参数

| Parameter          | Description    | Default            |
|--------------------|----------------|--------------------|
| `proxy.repository` | Envoy 代理镜像仓库   | `envoyproxy/envoy` |
| `proxy.tag`        | Envoy 代理镜像版本   | `v1.33-latest`     |
| `proxy.pullPolicy` | 镜像拉取策略 | `IfNotPresent`     |

#### Gateway 参数（新增）

| Parameter                             | Description          | Default                      |
|---------------------------------------|----------------------|------------------------------|
| `gateway.replicaCount`                | Gateway 副本数          | `2`                          |
| `gateway.image.repository`            | Gateway 镜像仓库         | `openkruise/sandbox-gateway` |
| `gateway.image.tag`                   | Gateway 镜像版本         | `v0.3.0`                     |
| `gateway.image.pullPolicy`            | 镜像拉取策略 | `IfNotPresent`                                             |
| `gateway.resources.cpu`               | Gateway CPU 资源       | `2`                                                        |
| `gateway.resources.memory`            | Gateway 内存资源         | `4Gi`                                                      |
| `gateway.livenessProbe`               | 存活探针配置               | 见下方配置                        |
| `gateway.readinessProbe`              | 就绪探针配置               | 见下方配置                        |
| `gateway.envoy.admin.address`         | Envoy 管理接口地址         | `127.0.0.1`                  |
| `gateway.envoy.admin.port`            | Envoy 管理接口端口         | `9901`                      |
| `gateway.envoy.listener.address`      | Envoy 监听地址           | `0.0.0.0`                    |
| `gateway.envoy.listener.port`         | Envoy 监听端口           | `7788`                       |
| `gateway.envoy.logLevel`              | Envoy 日志级别           | `warn`                       |
| `gateway.envoy.concurrency`           | Envoy 并发数            | `""`（空字符串，回退到 `gateway.resources.cpu`） |
| `gateway.envoy.circuitBreakers`       | 熔断器配置                | 见下方配置                        |
| `gateway.envoy.drainTimeSeconds`      | Envoy 排水时间（秒）        | `30`                         |
| `gateway.envoy.streamIdleTimeout`     | 流空闲超时时间              | `600s`                       |
| `gateway.envoy.connectTimeout`        | 连接超时时间               | `5s`                         |
| `gateway.envoy.pluginConfig`          | Golang Filter 插件配置   | 见下方配置                        |
| `gateway.service.type`                | Gateway Service 类型   | `ClusterIP`                  |
| `gateway.service.port`                | Gateway Service 端口   | `7788`                       |
| `gateway.service.targetPort`          | Gateway Service 目标端口 | `7788`                       |
| `gateway.service.annotations`         | Gateway Service 注解   | `{}`                         |
| `gateway.service.labels`              | Gateway Service 标签   | `{}`                         |
| `gateway.podAntiAffinity.type`        | Pod 反亲和性类型           | `soft`                       |
| `gateway.podAntiAffinity.weight`      | Pod 反亲和性权重           | `100`                        |
| `gateway.podAntiAffinity.topologyKey` | Pod 反亲和性拓扑键          | `kubernetes.io/hostname`     |
| `gateway.initContainer.enabled`       | 是否启用初始化容器            | `false`                      |

#### E2B 协议参数

| Parameter         | Description     | Default                        |
|-------------------|-----------------|--------------------------------|
| `e2b.domain`      | E2B 协议域名        | `your.domain.com`（占位符——必须替换，见[第 0 步](#第-0-步准备安装参数)） |
| `e2b.enableAuth`  | 是否启用 E2B 认证     | `true`                         |
| `e2b.adminApiKey` | E2B 管理员 API Key | `""`                           |
| `e2b.maxTimeout`  | E2B 最大超时时间（秒）   | `2592000`                      |

#### 服务与 Ingress 参数

| Parameter                  | Description              | Default               |
|----------------------------|--------------------------|-----------------------|
| `service.type`             | Manager Service 类型       | `ClusterIP`           |
| `service.port`             | Manager Service 端口       | `7788`                |
| `ingress.className`        | Ingress 控制器类名            | `""`（必填）           |
| `ingress.annotations`      | Ingress 注解               | `{}`                  |
| `ingress.certSecretName`   | Ingress TLS 证书 Secret 名称 | `sandbox-manager-tls` |
| `ingress.dataplaneService` | 数据平面 Service 名称          | `sandbox-gateway`     |

#### 其他参数

| Parameter                    | Description                 | Default                                                                                                                                                       |
|------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagePullSecrets`           | 镜像拉取密钥列表                    | `{}`                                                                                                                                                          |
| `nameOverride`               | 覆盖 Chart 名称                 | `""`                                                                                                                                                          |
| `fullnameOverride`           | 覆盖完整名称                      | `""`                                                                                                                                                          |
| `serviceAccount.automount`   | 是否自动挂载 ServiceAccount Token | `true`                                                                                                                                                        |
| `serviceAccount.annotations` | ServiceAccount 注解           | `{}`                                                                                                                                                          |
| `serviceAccount.name`        | ServiceAccount 名称           | `""`                                                                                                                                                          |
| `podAnnotations`             | Pod 注解                      | `{}`                                                                                                                                                          |
| `podLabels`                  | Pod 标签                      | `{}`                                                                                                                                                          |
| `podSecurityContext`         | Pod 安全上下文                   | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `securityContext`            | 容器安全上下文                   | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`               | Pod 调度的节点选择器                | `{}`                                                                                                                                                          |
| `tolerations`                | Pod 调度的容忍度                  | `[]`                                                                                                                                                          |
| `affinity`                   | Pod 调度的亲和性                  | 默认软性 Pod 反亲和（`preferredDuringSchedulingIgnoredDuringExecution`），按主机名分散调度                                                                                      |

以上参数均可通过 `--set key=value[,key=value]` 在 `helm install` 或 `helm upgrade` 命令中指定。

**Gateway 默认探针配置参考：**

```yaml
# 存活探针
gateway.livenessProbe:
  tcpSocket:
    port: 7788
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# 就绪探针
gateway.readinessProbe:
  tcpSocket:
    port: 7788
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**Gateway 默认熔断器配置参考：**

```yaml
gateway.envoy.circuitBreakers:
  enabled: true
  thresholds:
    - priority: DEFAULT
      maxConnections: 32768
      maxPendingRequests: 32768
      maxRequests: 65536
      maxRetries: 5
```

---

## 最佳实践

> 以下命令使用 `helm upgrade --install`：release 不存在时创建、存在时原地升级，因此重复执行同一条命令是安全的。

### 自定义资源配置

根据你的集群规模，建议调整以下资源参数：

**Sandbox Controller 资源调整**

```bash
helm upgrade --install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.3.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway 资源调整**

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set controller.resources.cpu=4 \
  --set controller.resources.memory=8Gi \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### 配置 E2B 域名和认证

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### 使用 Ingress 暴露服务

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls \
  --set e2b.domain=<your-domain>
```

### 配置 Gateway 高可用

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set gateway.replicaCount=3 \
  --set gateway.podAntiAffinity.type=hard \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### 启用 Gateway 初始化容器

如果需要特殊的初始化操作（如 sysctl 调优等），可以启用初始化容器：

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.3.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set e2b.domain=<your-domain> \
  --set gateway.initContainer.enabled=true \
  --set gateway.initContainer.image.repository=busybox \
  --set gateway.initContainer.image.tag=1.36.1
```

---

## 故障排查

| 症状 | 可能原因 | 处理方法 |
|---|---|---|
| Pod 卡在 `ImagePullBackOff` / `ErrImagePull` | 节点无法访问 Docker Hub | 按[使用国内镜像源](#使用国内镜像源)安装；健康检查中的 `curlimages/curl` 可换成可达的镜像 |
| `helm install` 报 `ingress.className is required` 或 `e2b.adminApiKey is required` | 缺少必填参数 | 传入[第 0 步](#第-0-步准备安装参数)确定的取值 |
| `helm upgrade` 失败，而当初 `helm install` 成功 | `helm upgrade` 没有复用之前的 `--set` 值 | 升级时重复传入参数，或加 `--reuse-values`——见[通过 Helm 升级](#通过-helm-升级) |
| `kubectl wait` 超时，Pod `Pending` | 集群资源不足（默认每个 controller/manager/gateway 副本请求 `2` CPU / `4Gi`） | 调低默认值，例如 `--set-json 'controller.resources={"cpu":"500m","memory":"512Mi"}' --set-json 'gateway.resources={"cpu":"500m","memory":"512Mi"}'`；用 `kubectl describe pod <pod> -n sandbox-system` 诊断 |
| `kubectl wait` 超时，Pod `Running` 但不 `Ready` | 镜像拉取慢，探针尚未通过 | `kubectl describe pod` + `kubectl logs <pod> -n sandbox-system -c controller`（manager）或 `-c envoy`（gateway） |
| Ingress 的 `ADDRESS` 一直为空 | 没有匹配 `ingress.className` 的 Ingress 控制器 | 用 `kubectl get ingressclass` 核对所传值；没有控制器时先安装——见[前置条件](#前置条件) |
| SDK `create` 报 `Sandbox ... not found` / 找不到模板 | 尚未部署 `SandboxSet` 模板，或名称与 `template` 参数不一致 | 先部署模板——见[运行 E2B Code Interpreter 沙箱](./best-practices/running-e2b-for-code-interpreter.md) |
| SDK 返回 `401` / `invalid key` | Key 不匹配，或官方 SDK 在本地拒绝了非 `e2b_` 前缀的 Key | 核对 Key 是否等于安装时的 `e2b.adminApiKey`；用 `encode_for_e2b_sdk` 包装——见 [API Key 与团队](./user-manuals/api-keys-and-teams.md) |

---

## 卸载

> **注意：**
> - `helm uninstall` 会删除 Deployment、Service、Webhook Configurations 等 chart 管理的资源，但 **不会删除 CRD**。
>     这是 Helm 的标准行为——CRD 位于 `crds/` 目录下，Helm 只在首次安装时创建，卸载和升级时均不处理。
> - CRD 不被删除意味着已创建的 Sandbox、SandboxSet 等 CR 资源及其关联的 Pod **会被保留**。
> - Namespace 也不会被自动删除。如需完全清理，请参考下方"完全清理"章节。

**卸载顺序**：先卸载 Sandbox Manager，再卸载 Sandbox Controller。

### 卸载 Sandbox Manager

```bash
helm uninstall agents-sandbox-manager -n sandbox-system
```

### 卸载 Sandbox Controller

```bash
helm uninstall agents-sandbox-controller -n sandbox-system
```

### 完全清理（可选）

如需彻底清理所有资源，包括 CRD 和 Namespace：

```bash
# 删除所有 Sandbox 相关 CRD（会级联删除所有 Sandbox CR 和对应的 Pod）。
# 显式列表——任意 shell 下都可用：
kubectl delete crd \
  checkpoints.agents.kruise.io \
  sandboxclaims.agents.kruise.io \
  sandboxes.agents.kruise.io \
  sandboxsets.agents.kruise.io \
  sandboxtemplates.agents.kruise.io \
  sandboxupdateops.agents.kruise.io

# bash 一行命令替代：
# kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd

# 删除 Namespace
kubectl delete ns sandbox-system
```

> ⚠️ **警告**：删除 CRD 将不可逆地销毁所有 Sandbox 实例及其关联 Pod，请确认数据已备份后再执行。

---

## 版本更新说明

### 0.2.0 相比 0.1.0 的主要变化

| 类别          | 变更内容                                                                                                                |
|-------------|---------------------------------------------------------------------------------------------------------------------|
| **架构变更**    | 新增独立的 Sandbox Gateway Deployment，在保留 Manager 内 Envoy Sidecar 的基础上提供独立可扩展的数据面网关                                      |
| **CRD 变更**  | 新增 Checkpoint CRD；所有 CRD 新增 `runtimes` 字段；SandboxSet 新增 `updateStrategy`；SandboxClaim 新增动态卷挂载、原地资源更新等（升级时需手动更新 CRD） |
| **Webhook** | 新增 Pod Delete 和 Pod Eviction 的 ValidatingWebhook，增强 Pod 生命周期管理                                                      |
| **日志级别**    | Controller 日志级别默认值从 `3` 调整为 `5`，便于排查问题                                                                              |
| **Ingress** | 新增 `dataplaneService` 参数；`className` 默认值改为空字符串，需显式指定                                                                |
| **E2B**     | `adminApiKey` 默认值改为空字符串（0.1.0 为 `admin-987654321`），安装时必须显式指定                                                        |
| **Gateway** | 新增完整的 Gateway 配置项，包括副本数、资源、探针、Envoy 配置、熔断器、Pod 反亲和性等                                                                |
| **安全性**     | `podSecurityContextAllowPrivilegeEscalation` 参数已移除，改为在 `securityContext` 中统一管理                                      |
| **RBAC**    | 新增 `pods/resize`、`checkpoints`、`sandboxtemplates` 资源权限                                                              |

### 0.3.0 相比 0.2.0 的主要变化

| 类别               | 变更内容                                                                                                                                 |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| **CRD 新增**       | 新增 SandboxUpdateOps CRD（`sandboxupdateops.agents.kruise.io`），用于批量升级 Sandbox 实例，支持滚动更新策略和升级进度跟踪                                       |
| **CRD 增强**       | Sandbox 新增 `lifecycle`（preUpgrade/postUpgrade 钩子）和 `upgradePolicy` 字段；SandboxClaim 新增 `claimTimeout`、`waitReadyTimeout` 最小值校验（>= 1s） |
| **Webhook**      | 新增 SandboxUpdateOps 的 ValidatingWebhook（`v-suo.kb.io`），校验 CREATE/UPDATE 操作                                                           |
| **RBAC**         | Controller 新增 `sandboxupdateops` 和 `sandboxupdateops/status` 资源权限                                                                    |
| **Gateway 端口**   | Gateway 监听端口从 `10000` 调整为 `7788`，统一 Gateway Service 端口和目标端口均为 `7788`                                                                 |
| **Gateway 优雅退出** | 新增 Envoy `preStop` 生命周期钩子，排空监听器连接后等待 `drainTimeSeconds`（默认 30s）再退出                                                                   |
| **Envoy 配置增强**   | 新增 `drainTimeSeconds`、`streamIdleTimeout`、`connectTimeout` 超时参数；`concurrency` 默认值改为空，回退到 `gateway.resources.cpu` 值                   |
| **Ingress**      | 新增 `api.{{ e2b.domain }}` 域名匹配，支持 API 子域名独立路由                                                                                      |
| **版本升级**         | 镜像版本全部升级到 `v0.3.0`（Controller、Manager、Gateway）                                                                                       |

详细变更请参考 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)

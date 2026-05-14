---
title: 安装
---

## 概述

Sandbox Controller、Sandbox Manager 和 Sandbox Gateway 是 OpenKruise 生态中的三个核心组件，共同构成完整的 Sandbox 运行环境：

- **Sandbox Controller**：负责管理 Sandbox 相关的 CRD 资源，包括 SandboxSet、Sandbox、SandboxClaim 和 SandboxTemplate
  的生命周期管理。
- **Sandbox Manager**：提供 Sandbox 的 API 服务和控制面，负责 Sandbox 实例的调度、创建与回收，支持 E2B 协议访问。
- **Sandbox Gateway**（0.2.0 新增）：独立的数据面网关服务，基于 Envoy + Golang Filter 构建，负责流量路由、负载均衡与熔断保护，支持独立扩缩容。

---

## 版本兼容性

| 组件                 | Chart 版本 | 镜像版本   | Kubernetes 兼容性 |
|--------------------|----------|--------|----------------|
| Sandbox Controller | 0.2.0    | v0.2.0 | `>= 1.28`      |
| Sandbox Manager    | 0.2.0    | v0.2.0 | `>= 1.28`      |
| Sandbox Gateway    | —        | v0.2.1 | `>= 1.28`      |

> **说明**：Sandbox Gateway 随 Sandbox Manager chart 一起部署，无需单独安装。

---

## 前置条件

1. Kubernetes 集群版本 >= 1.28
2. 已安装 Helm v3.5+
3. 手动创建 Namespace（见下文安装步骤）

---

## 通过 Helm 安装

### 1. 添加 OpenKruise Charts 仓库

```bash
## 添加 openkruise charts 仓库
helm repo add openkruise https://openkruise.github.io/charts/

## 更新仓库（如果已经安装过openkruise charts仓库）
helm repo update
```

### 2. 安装 Sandbox Controller

**手动创建 Namespace**

```bash
kubectl create ns sandbox-system
```

> **安装顺序**：Sandbox Controller **必须**先于 Sandbox Manager 安装，因为它提供了 Sandbox Manager 所需的 CRD 资源。

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0
```

### 3. 安装 Sandbox Manager

> **必填参数说明**：以下参数在安装时必须显式指定：
> - `e2b.adminApiKey`：E2B 管理员 API Key，用于认证
> - `ingress.className`：Ingress 控制器类名（如 `nginx`、`alb` 等，取决于集群的 Ingress 实现）

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

> **说明**：0.2.0 版本的 Sandbox Manager chart 会同时部署 Sandbox Gateway，无需额外安装。

---

## 使用国内镜像源

由于网络原因，国内用户可能无法直接从 Docker Hub 拉取镜像。建议使用阿里云容器镜像服务提供的国内镜像。

### 国内镜像地址

| 组件                 | 镜像地址                                                                                  | 版本             |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.2.0`       |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.2.0`       |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.2.1`       |
| Envoy Proxy        | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy`                    | `v1.33-latest` |

### 使用国内镜像安装

**安装 Sandbox Controller（使用国内镜像）**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0 \
  --set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller
```

**安装 Sandbox Manager（使用国内镜像）**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
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

### 升级 Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0
```

### 升级 Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0
```

> **注意：**
> 1. 升级顺序：**先升级 Sandbox Controller，再升级 Sandbox Manager**，确保 CRD 兼容。
> 2. 在升级之前，**必须**先阅读 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
     ，确保你已经了解新版本的不兼容变化。
> 3. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。

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
4. **新增必填参数**：`ingress.className` `e2b.adminApiKey` 在 0.2.0 中默认值为空字符串，需显式指定。

---

## 手工下载 Charts 包

如果你在生产环境无法连接到 `https://openkruise.github.io/charts/`，可以先在 [GitHub Releases](https://github.com/openkruise/charts/releases)
手工下载 chart 包，再用它安装或更新到集群中。

```bash
helm install/upgrade agents-sandbox-controller /PATH/TO/CONTROLLER/CHART -n sandbox-system
helm install/upgrade agents-sandbox-manager /PATH/TO/MANAGER/CHART -n sandbox-system
```

---

## 可选项

### Sandbox Controller 安装参数

下表展示了 Sandbox Controller chart 所有可配置的参数和它们的默认值：

| Parameter                    | Description                 | Default                                                                                                                 |
|------------------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller 副本数              | `2`                                                                                                                     |
| `image.repository`           | Controller 镜像仓库             | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller 镜像版本             | `v0.2.0`                                                                                                                |
| `image.pullPolicy`           | Controller 镜像拉取策略           | `IfNotPresent`                                                                                                          |
| `webhook.port`               | Webhook 服务端口                | `9443`                                                                                                                  |
| `metrics.port`               | Metrics 服务端口                | `8443`                                                                                                                  |
| `healthProbe.port`           | 健康检查端口                      | `8081`                                                                                                                  |
| `resources.limits.cpu`       | Controller CPU 资源限制         | `2`                                                                                                                     |
| `resources.limits.memory`    | Controller 内存资源限制           | `4Gi`                                                                                                                   |
| `resources.requests.cpu`     | Controller CPU 资源请求         | `2`                                                                                                                     |
| `resources.requests.memory`  | Controller 内存资源请求           | `4Gi`                                                                                                                   |
| `namespace.name`             | 部署的命名空间                     | `sandbox-system`                                                                                                        |
| `serviceAccount.create`      | 是否创建 ServiceAccount         | `true`                                                                                                                  |
| `serviceAccount.automount`   | 是否自动挂载 ServiceAccount Token | `true`                                                                                                                  |
| `serviceAccount.annotations` | ServiceAccount 注解           | `{}`                                                                                                                    |
| `serviceAccount.name`        | ServiceAccount 名称           | `""`                                                                                                                    |
| `rbac.create`                | 是否创建 RBAC 资源                | `true`                                                                                                                  |
| `imagePullSecrets`           | 镜像拉取密钥列表                    | `[]`                                                                                                                    |
| `nameOverride`               | 覆盖 Chart 名称                 | `""`                                                                                                                    |
| `fullnameOverride`           | 覆盖完整名称                      | `""`                                                                                                                    |
| `podAnnotations`             | Pod 注解                      | `{}`                                                                                                                    |
| `podLabels`                  | Pod 标签                      | `{}`                                                                                                                    |
| `podSecurityContext`         | Pod 安全上下文                   | `{runAsNonRoot: true, seccompProfile: {type: RuntimeDefault}}`                                                          |
| `securityContext`            | 容器安全上下文                     | `{allowPrivilegeEscalation: false, capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true}` |
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
| `controller.tag`                   | Controller 镜像版本     | `v0.2.0`                     |
| `controller.pullPolicy`            | Controller 镜像拉取策略   | `IfNotPresent`               |
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
| `proxy.pullPolicy` | Envoy 代理镜像拉取策略 | `IfNotPresent`     |

#### Gateway 参数（新增）

| Parameter                             | Description          | Default                      |
|---------------------------------------|----------------------|------------------------------|
| `gateway.replicaCount`                | Gateway 副本数          | `2`                          |
| `gateway.image.repository`            | Gateway 镜像仓库         | `openkruise/sandbox-gateway` |
| `gateway.image.tag`                   | Gateway 镜像版本         | `v0.2.1`                     |
| `gateway.image.pullPolicy`            | Gateway 镜像拉取策略       | `IfNotPresent`               |
| `gateway.resources.cpu`               | Gateway CPU 资源       | `2`                          |
| `gateway.resources.memory`            | Gateway 内存资源         | `4Gi`                        |
| `gateway.livenessProbe`               | 存活探针配置               | 见下方配置                        |
| `gateway.readinessProbe`              | 就绪探针配置               | 见下方配置                        |
| `gateway.envoy.admin.address`         | Envoy 管理接口地址         | `127.0.0.1`                  |
| `gateway.envoy.admin.port`            | Envoy 管理接口端口         | `9901`                       |
| `gateway.envoy.listener.address`      | Envoy 监听地址           | `0.0.0.0`                    |
| `gateway.envoy.listener.port`         | Envoy 监听端口           | `10000`                      |
| `gateway.envoy.logLevel`              | Envoy 日志级别           | `warn`                       |
| `gateway.envoy.concurrency`           | Envoy 并发数            | `4`                          |
| `gateway.envoy.circuitBreakers`       | 熔断器配置                | 见下方配置                        |
| `gateway.service.type`                | Gateway Service 类型   | `ClusterIP`                  |
| `gateway.service.port`                | Gateway Service 端口   | `7788`                       |
| `gateway.service.targetPort`          | Gateway Service 目标端口 | `10000`                      |
| `gateway.podAntiAffinity.type`        | Pod 反亲和性类型           | `soft`                       |
| `gateway.podAntiAffinity.weight`      | Pod 反亲和性权重           | `100`                        |
| `gateway.podAntiAffinity.topologyKey` | Pod 反亲和性拓扑键          | `kubernetes.io/hostname`     |
| `gateway.initContainer.enabled`       | 是否启用初始化容器            | `false`                      |

#### E2B 协议参数

| Parameter         | Description     | Default           |
|-------------------|-----------------|-------------------|
| `e2b.domain`      | E2B 协议域名        | `your.domain.com` |
| `e2b.enableAuth`  | 是否启用 E2B 认证     | `true`            |
| `e2b.adminApiKey` | E2B 管理员 API Key | `""`              |
| `e2b.maxTimeout`  | E2B 最大超时时间（秒）   | `2592000`         |

#### 服务与 Ingress 参数

| Parameter                  | Description              | Default               |
|----------------------------|--------------------------|-----------------------|
| `service.type`             | Manager Service 类型       | `ClusterIP`           |
| `service.port`             | Manager Service 端口       | `7788`                |
| `ingress.className`        | Ingress 控制器类名            | `""`                  |
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
| `securityContext`            | 容器安全上下文                     | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`               | Pod 调度的节点选择器                | `{}`                                                                                                                                                          |
| `tolerations`                | Pod 调度的容忍度                  | `[]`                                                                                                                                                          |
| `affinity`                   | Pod 调度的亲和性                  | 默认配置软性 Pod 反亲和（`preferredDuringSchedulingIgnoredDuringExecution`），按主机名分散调度                                                                                    |

以上参数均可通过 `--set key=value[,key=value]` 在 `helm install` 或 `helm upgrade` 命令中指定。

**Gateway 默认探针配置参考：**

```yaml
# 存活探针
gateway.livenessProbe:
  tcpSocket:
    port: 10000
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

# 就绪探针
gateway.readinessProbe:
  tcpSocket:
    port: 10000
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

### 自定义资源配置

根据你的集群规模，建议调整以下资源参数：

**Sandbox Controller 资源调整**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.2.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway 资源调整**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set controller.resources.cpu=4 \
  --set controller.resources.memory=8Gi \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### 配置 E2B 域名和认证

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### 使用 Ingress 暴露服务

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls
```

### 配置 Gateway 高可用

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set gateway.replicaCount=3 \
  --set gateway.podAntiAffinity.type=hard \
  --set gateway.resources.cpu=4 \
  --set gateway.resources.memory=8Gi
```

### 启用 Gateway 初始化容器

如果需要特殊的初始化操作（如 sysctl 调优等），可以启用初始化容器：

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.2.0 \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set gateway.initContainer.enabled=true \
  --set gateway.initContainer.image.repository=busybox \
  --set gateway.initContainer.image.tag=1.36.1
```

---

## 卸载

> **注意：**
> - `helm uninstall` 会删除 Deployment、Service、Webhook Configurations 等 chart 管理的资源，但 **不会删除 CRD**。
    >   这是 Helm 的标准行为——CRD 位于 `crds/` 目录下，Helm 只在首次安装时创建，卸载和升级时均不处理。
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
# 删除所有 Sandbox 相关 CRD（会级联删除所有 Sandbox CR 和对应的 Pod）
kubectl get crd | grep agents.kruise.io | awk '{print $1}' | xargs kubectl delete crd

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

详细变更请参考 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
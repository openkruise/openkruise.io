---
title: 安装
---

## 概述

Kruise Agents 通过两个 Helm Chart 安装，分别部署 Sandbox Controller 与 Sandbox Manager，其中 Manager chart 还内置了
Sandbox Gateway，共同构成完整的 Sandbox 运行环境。

- **Sandbox Controller**（`agents-sandbox-controller` chart）是管理全部 Sandbox CRD 资源的控制面，chart 中包含：
  - 8 个 `agents.kruise.io` CRD：Sandbox、SandboxSet、SandboxClaim、SandboxTemplate、SandboxUpdateOps、
    Checkpoint、Commit 和 PoolAutoscaler；
  - 负责调谐这些资源的 sandbox-controller Deployment：Sandbox 生命周期管理、预热池维护、Sandbox 申领、
    原地升级、Checkpoint/Commit 以及池自动扩缩容；
  - Mutating/Validating Webhook、RBAC、ServiceAccount 以及 metrics Service；
  - `sandbox-injection-config` ConfigMap，定义 `agent-runtime` sidecar 与每个 Sandbox 的 `traffic-proxy`
    注入模板；
  - 启用 `enableTLS=true` 时可选创建的 TLS 资源：共享根 CA、运行时客户端/服务端证书以及 trust-manager CA bundle。
- **Sandbox Manager**（`agents-sandbox-manager` chart）是 Sandbox 的数据面组件，同时提供 E2B API 的适配服务，
  chart 中包含：
  - sandbox-manager Deployment 及其 Service、Secret 和 Ingress 资源；
  - Sandbox Gateway Deployment：基于 Envoy + Golang Filter 的数据面，负责流量路由、负载均衡与熔断保护，
    可与 Manager 独立扩缩容；
  - 启用 `prometheus.enabled=true` 时可选创建的 ServiceMonitor，采集 Manager 与 Gateway 指标；
  - 启用 `enableTLS=true` 时可选创建的 TLS 资源：Ingress 服务端证书、运行时客户端证书以及 manager↔gateway
    peer 证书；
  - 可选的嵌入式 Agentio 组件（`agentio.enabled`，默认关闭），提供 Sandbox 出入向流量管控：`agentiod`
    控制面、EPE 流量扩展组件和 egress gateway；
  - 描述 Sandbox 出入向流量策略的 `TrafficPolicy`、`GlobalTrafficPolicy`、`SecurityProfile`、
    `GlobalSecurityProfile` CRD，随 chart 一起安装。

---

## 版本兼容性

| Sandbox 组件版本 | Kubernetes 版本 | E2B 版本   |
|------------------|-----------------|------------|
| 0.6.0        | `>= 1.28`       | `>= 2.8.0` |

> **说明**：
> - `agent-runtime` sidecar 注入需要 Kubernetes >= 1.29（native sidecar containers），参见
>   [Agent Runtime 注入](#agent-runtime-注入)。
> - `enableTLS=true` 需要集群安装 [cert-manager](https://cert-manager.io/)，以及用于 CA bundle 的 trust-manager。

---

## 前置条件

1. Kubernetes 集群版本 >= 1.28（如使用 agent-runtime sidecar 注入则需 >= 1.29）
2. 已安装 Helm v3.5+
3. 手动创建 Namespace（见下文安装步骤）
4. 如果启用 TLS（`enableTLS=true`），集群需安装 cert-manager 和 trust-manager

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
  --version 0.6.0
```

> ⚠️ **不支持 server-side apply**：sandbox-controller 会在运行时以自己的 field manager（`manager`）管理 mutating 和
> validating webhook configuration 上的 `template` annotation。使用 Kubernetes server-side apply 应用 chart 会争抢该
> annotation，并报出 `Apply failed with 1 conflict: conflict with "manager"` 之类的字段所有权冲突。请**不要**给
> `helm install` / `helm upgrade` 传 `--server-side`（Helm 3 默认使用 client-side apply）。如果你使用 Helm 4 或其他
> 默认走 SSA 的工具，请关闭 SSA。

### 3. 安装 Sandbox Manager

> **必填参数说明**：以下参数在安装时必须显式指定：
> - `e2b.domain`：E2B 协议域名（会为 `api.<domain>`、`*.<domain>` 和 `<domain>` 创建 Ingress）
> - `e2b.adminApiKey`：E2B 管理员 API Key，用于认证
> - `ingress.className`：Ingress 控制器类名（如 `nginx`、`alb` 等，取决于集群的 Ingress 实现）

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

> **说明**：Sandbox Manager chart 会同时部署 Sandbox Gateway，无需额外安装。Ingress 将控制面流量（`api.<domain>`）路由到
> Sandbox Manager Service（端口 8080），将数据面流量（`<domain>` 和 `*.<domain>`）路由到 Sandbox Gateway
> Service（端口 7788）。

---

## 使用国内镜像源

由于网络原因，国内用户可能无法直接从 Docker Hub 拉取镜像。建议使用阿里云容器镜像服务提供的国内镜像。

### 国内镜像地址

| 组件                 | 镜像地址                                                                                  | 版本             |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.6.0` |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.6.0` |
| Sandbox Gateway    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-gateway`          | `v0.6.0` |

### 使用国内镜像安装

两个 chart 中的所有镜像都通过 chart 级别的 `image.registry` 解析，因此一个参数即可把所有镜像（Controller、Manager、
Gateway，以及 `agent-runtime`、Commit job 等辅助镜像）切换到国内镜像。

**安装 Sandbox Controller（使用国内镜像）**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --set image.registry=openkruise-registry.cn-shanghai.cr.aliyuncs.com
```

**安装 Sandbox Manager（使用国内镜像）**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class> \
  --set image.registry=openkruise-registry.cn-shanghai.cr.aliyuncs.com
```

> **说明**：
> - Agentio 镜像的 registry 解析会先取 `agentio.global.registry`，两者都未设置时回退到 `image.registry`。
> - 如果镜像 repository 本身已以主机名开头（例如 `registry.cn-beijing.aliyuncs.com/acs/busybox`），则会绕过
>   chart 级别的 registry，这在镜像源不包含某个辅助镜像时非常有用。
> - 如需启用使用国内镜像 `busybox` 的 Gateway 初始化容器，请额外添加：
>   ```bash
>   --set gateway.initContainer.enabled=true \
>   --set gateway.initContainer.image.repository=registry.cn-beijing.aliyuncs.com/acs/busybox \
>   --set gateway.initContainer.image.tag=1.36.1
>   ```

---

## 通过 Helm 升级

### 升级 Sandbox Controller

```bash
helm upgrade agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --server-side=false
```

### 升级 Sandbox Manager

```bash
helm upgrade agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0
```

> **注意：**
> 1. 升级顺序：**先升级 Sandbox Controller，再升级 Sandbox Manager**，确保 CRD 兼容。
> 2. 在升级之前，**必须**先阅读 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
     ，确保你已经了解新版本的不兼容变化。
> 3. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。
> 4. **必须**传 `--server-side=false`。sandbox-controller 在运行时以自己的 field manager（`manager`）管理 webhook 的
     `template` annotation，server-side apply 会竞争同一个 annotation 并因字段所有权冲突而失败（报错形如
     `Apply failed with 1 conflict: conflict with "manager" ...`）。Helm 3 默认使用 client-side apply，但 Helm 4
     和部分 CI 工具默认使用 server-side apply，因此需要显式指定该参数，强制走 client-side apply。

### 手动更新 CRD（必须）

Helm upgrade **不会自动更新** `crds/` 目录下的 CRD 定义，因此**必须在执行 `helm upgrade` 之前手动应用新的
CRD**，否则新功能将无法正常工作。0.6.0 版本新增了 `Commit` 和 `PoolAutoscaler` CRD，并更新了已有 CRD 的 schema。

```bash
# 从 chart 包中提取 CRD 并应用（以在线安装为例）
helm pull openkruise/agents-sandbox-controller --version 0.6.0 --untar
kubectl apply -f agents-sandbox-controller/crds/
rm -rf agents-sandbox-controller
```

0.6.0 版本 CRD 的主要变化包括：
- **新增 Commit CRD**（`commits.agents.kruise.io`）：通过 job 将 Sandbox 文件系统状态提交为容器镜像
- **新增 PoolAutoscaler CRD**（`poolautoscalers.agents.kruise.io`）：基于容量和 cron 驱动的 SandboxSet 池自动扩缩容
- **SandboxSet 增强**：新增 `PauseStrategy`（Stop / Snapshot / CloudDisk）配置

> **说明**：Sandbox Manager chart 提供的流量和安全 CRD（`trafficpolicies.agents.kruise.io`、
> `globaltrafficpolicies.agents.kruise.io`、`securityprofiles.agents.kruise.io`、
> `globalsecurityprofiles.agents.kruise.io`）是以模板形式渲染的，而不是放在 `crds/` 目录下，因此会在
> `helm upgrade` 时自动更新，无需手动处理。

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

下表展示了 Sandbox Controller chart 的可配置参数和它们的默认值。

#### 常用参数

| Parameter                | Description                                                          | Default                                |
|--------------------------|----------------------------------------------------------------------|----------------------------------------|
| `replicaCount`           | Controller 副本数                                                       | `2`                                    |
| `image.registry`         | 应用于本 chart 所有镜像的仓库地址前缀                                                 | `docker.io`                            |
| `image.repository`       | sandbox-controller 镜像仓库                                             | `openkruise/agent-sandbox-controller`  |
| `image.tag`              | sandbox-controller 镜像版本                                             | `v0.6.0`                        |
| `image.pullPolicy`       | Controller 镜像拉取策略                                                    | `IfNotPresent`                         |
| `imagePullSecrets`       | 镜像拉取密钥列表                                                             | `[]`                                   |
| `namespace.name`         | 部署的命名空间                                                              | `sandbox-system`                       |
| `resources.limits.cpu`   | Controller CPU 资源限制                                                  | `2`                                    |
| `resources.limits.memory`| Controller 内存资源限制                                                    | `4Gi`                                  |
| `resources.requests.cpu` | Controller CPU 资源请求                                                  | `2`                                    |
| `resources.requests.memory` | Controller 内存资源请求                                                  | `4Gi`                                  |
| `webhook.port`           | Webhook 服务端口                                                         | `9443`                                 |
| `metrics.port`           | Metrics 服务端口（HTTPS，认证/鉴权委托给 kube-apiserver）                          | `8443`                                 |
| `healthProbe.port`       | 健康检查端口                                                               | `8081`                                 |
| `controller.featureGates`| 逗号分隔的 `--feature-gates` key=value 列表（如 `Foo=true,Bar=false`）；为空时不设置该参数 | `""`                                   |

> **说明**：用 `--set` 指定**多个 feature gate** 时，需要把值里的每个逗号转义为 `\,`，并用单引号把整个参数括起来，
> 让 shell 保留反斜杠：
>
> ```bash
> --set 'controller.featureGates=Commit=true\,KruiseIntegration=true'
> ```
>
> `--set` 会按未被转义的逗号拆分参数，因此不转义时 Helm 会把 `KruiseIntegration=true` 当成另一个顶层赋值处理，
> 该 gate 会被静默丢弃，不会生效。

#### 高级参数

其余参数均为可选，默认值已经过合理设置，大多数安装无需修改。

| Parameter                                | Description                                                                | Default                                                                                                                 |
|------------------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `controller.workers.sandboxWorkers`      | Sandbox reconciler 的并发 worker 数                                            | `200`                                                                                                                   |
| `controller.workers.sandboxsetWorkers`   | SandboxSet reconciler 的并发 worker 数                                         | `10`                                                                                                                    |
| `controller.workers.sandboxclaimWorkers` | SandboxClaim reconciler 的并发 worker 数                                       | `200`                                                                                                                   |
| `controller.workers.sandboxupdateopsWorkers` | SandboxUpdateOps reconciler 的并发 worker 数                               | `5`                                                                                                                     |
| `controller.workers.poolautoscalerWorkers` | PoolAutoscaler reconciler 的并发 worker 数                                  | `3`                                                                                                                     |
| `controller.workers.commitWorkers`       | Commit reconciler 的并发 worker 数                                             | `5`                                                                                                                     |
| `controller.clientQPS`                   | Kubernetes API 客户端 QPS 限流                                                  | `30000`                                                                                                                 |
| `controller.clientBurst`                 | Kubernetes API 客户端 burst 限流                                                | `60000`                                                                                                                 |
| `metrics.rbac.create`                    | 创建 ClusterRole，授予 `/metrics` nonResourceURL 的 `get` 权限；可绑定到你的 Prometheus / ARMS 采集器 ServiceAccount | `true`                                                                |
| `nameOverride`                           | 覆盖 Chart 名称                                                                | `""`                                                                                                                    |
| `fullnameOverride`                       | 覆盖完整名称                                                                     | `""`                                                                                                                    |
| `serviceAccount.create`                  | 是否创建 ServiceAccount                                                         | `true`                                                                                                                  |
| `serviceAccount.automount`               | 是否自动挂载 ServiceAccount Token                                                 | `true`                                                                                                                  |
| `serviceAccount.annotations`             | ServiceAccount 注解                                                           | `{}`                                                                                                                    |
| `serviceAccount.name`                    | ServiceAccount 名称                                                           | `""`                                                                                                                    |
| `rbac.create`                            | 是否创建 RBAC 资源                                                               | `true`                                                                                                                  |
| `podAnnotations`                         | Pod 注解                                                                      | `{}`                                                                                                                    |
| `podLabels`                              | Pod 标签                                                                      | `{}`                                                                                                                    |
| `podSecurityContext`                     | Pod 安全上下文                                                                   | `{runAsNonRoot: true, seccompProfile: {type: RuntimeDefault}}`                                                          |
| `securityContext`                        | 容器安全上下文                                                                     | `{allowPrivilegeEscalation: false, capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true}` |
| `nodeSelector`                           | Pod 调度的节点选择器                                                                | `{}`                                                                                                                    |
| `tolerations`                            | Pod 调度的容忍度                                                                  | `[]`                                                                                                                    |
| `affinity`                               | Pod 调度的亲和性                                                                  | `{}`                                                                                                                    |
| `agentRuntime.image.repository`          | 注入的 agent-runtime sidecar 镜像仓库                                             | `openkruise/agent-runtime`                                                                                              |
| `agentRuntime.image.tag`                 | 注入的 agent-runtime sidecar 镜像版本                                             | `v0.3.0`                                                                                                                |
| `agentRuntime.image.pullPolicy`          | 注入的 agent-runtime sidecar 镜像拉取策略                                           | `IfNotPresent`                                                                                                          |
| `commitJob.image.repository`             | Commit job Pod 的镜像仓库                                                       | `openkruise/commit-job`                                                                                                 |
| `commitJob.image.tag`                    | Commit job Pod 的镜像版本                                                       | `v0.6.0`                                                                                                                |
| `enableTLS`                              | 基于 cert-manager / trust-manager 的 TLS 总开关；为 `false` 时 `templates/tls/` 下的内容不会渲染，Controller 保持明文运行行为 | `false`                             |
| `tls.createCA`                           | 创建共享根 CA（selfSigned Issuer → CA Certificate → CA Issuer）。根 CA 由 Controller chart 持有；sandbox-manager chart 将此值设为 `false` 并通过名称引用该 Issuer | `true`                                                |
| `tls.selfSignedIssuerName`               | 自签名引导 Issuer 名称                                                            | `sandbox-selfsigned-issuer`                                                                                             |
| `tls.caCertificateName`                  | CA Certificate 资源名称                                                        | `sandbox-ca`                                                                                                            |
| `tls.caSecretName`                       | 存放 CA 密钥对的 Secret（`tls.crt`/`tls.key`）；同时作为 trust-manager Bundle 的来源和 CA Issuer 的签名材料 | `sandbox-ca-key-pair`                                                                             |
| `tls.signingIssuerName`                  | 用于签发叶子证书的 CA Issuer 名称                                                       | `sandbox-signing-issuer`                                                                                                |
| `tls.caCommonName`                       | CA 证书 Common Name                                                           | `sandbox-ca`                                                                                                            |
| `tls.caOrganization`                     | CA 证书 Organization                                                          | `openkruise`                                                                                                            |
| `tls.caDuration`                         | CA 证书有效期                                                                   | `87600h`（10 年）                                                                                                          |
| `tls.certDuration`                       | 叶子证书有效期                                                                    | `2160h`（90 天）                                                                                                           |
| `tls.certRenewBefore`                    | 叶子证书续期窗口                                                                   | `360h`（15 天）                                                                                                            |
| `tls.runtime.enabled`                    | 签发 runtime 客户端/服务端证书并启用客户端 TLS 路径（`--runtime-client-cert-dir` 以及 agent-runtime sidecar 的 TLS 环境变量）。对不支持 TLS 的 agent-runtime 会失败；依赖 `enableTLS` | `false`                                                       |
| `tls.runtimeClientCertName`              | Controller → agent-runtime 客户端 Certificate 资源名称                           | `sandbox-controller-runtime-client`                                                                                     |
| `tls.runtimeClientCertSecretName`        | Controller 客户端证书 Secret 名称                                                  | `sandbox-controller-runtime-client-cert`                                                                                |
| `tls.runtimeClientCommonName`            | Controller 客户端证书 Common Name                                                | `system:sandbox-controller-manager`                                                                                     |
| `tls.runtimeClientCertDir`               | `--runtime-client-cert-dir` 的挂载点；该 volume 会把 `tls.crt`/`tls.key`/`ca.crt` 重映射为 `client.crt`/`client.key`/`ca.crt` | `/etc/agent-runtime-client/certs`                                                                |
| `tls.agentRuntimeServerCertName`         | agent-runtime 服务端 Certificate 资源名称                                          | `sandbox-agent-runtime-server`                                                                                          |
| `tls.agentRuntimeServerCertSecretName`   | agent-runtime 服务端证书 Secret 名称                                               | `sandbox-agent-runtime-server-certs`                                                                                    |
| `tls.agentRuntimeServerSAN`              | gateway/controller/manager 访问 runtime 时使用的 SAN                             | `agentruntime.sandbox.agents.kruise.io`                                                                                 |
| `tls.bundle.enabled`                     | 创建 trust-manager Bundle，将 CA 以 `ca.crt` ConfigMap 形式分发                       | `true`                                                                                                                  |
| `tls.bundle.name`                        | trust-manager Bundle 名称                                                      | `sandbox-ca-bundle`                                                                                                     |
| `tls.bundle.configMapKey`                | 分发 ConfigMap 中存放 CA 的 key                                                     | `ca.crt`                                                                                                                |
| `tls.bundle.namespaceSelector`           | 限定 CA ConfigMap 写入范围的 Namespace 选择器；为空表示选择所有 Namespace                       | `{}`                                                                                                                    |
| `agentio.trafficProxy.controlPlaneNamespace` | Agentio 控制面所在的 Namespace                                                  | `sandbox-system`                                                                                                        |
| `agentio.trafficProxy.controlPlaneService` | Agentio 控制面 Service 名称                                                      | `agentiod`                                                                                                              |
| `agentio.trafficProxy.xdsAddress`        | 显式指定 XDS 地址；为空时根据 Service 和 Namespace 生成                                    | `""`                                                                                                                    |
| `agentio.trafficProxy.caAddress`         | 显式指定 CA 地址；为空时根据 Service 和 Namespace 生成                                     | `""`                                                                                                                    |
| `agentio.trafficProxy.caCertConfigMap`   | 挂载到注入工作负载 Namespace 中的 CA ConfigMap                                      | `agentio-ca-root-cert`                                                                                                  |
| `agentio.trafficProxy.clusterId`         | 上报给控制面的集群标识                                                                | `Kubernetes`                                                                                                            |
| `agentio.trafficProxy.clusterDomain`     | Kubernetes Service DNS 域名                                                   | `cluster.local`                                                                                                         |
| `agentio.trafficProxy.tokenAudience`     | Projected workload token 的 audience                                          | `agentio-ca`                                                                                                            |
| `agentio.trafficProxy.includeInboundPorts` | traffic proxy 拦截的入站端口                                                     | `*`                                                                                                                     |
| `agentio.trafficProxy.includeOutboundIPRanges` | traffic proxy 拦截的出站 IP 范围                                             | `*`                                                                                                                     |
| `agentio.trafficProxy.includeOutboundPorts` | traffic proxy 拦截的出站端口                                                    | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeInboundPorts` | 不拦截的入站端口                                                                | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeOutboundIPRanges` | 不拦截的出站 IP 范围                                                          | `""`                                                                                                                    |
| `agentio.trafficProxy.excludeOutboundPorts` | 不拦截的出站端口                                                               | `""`                                                                                                                    |
| `agentio.trafficProxy.enableFirewallRules` | 启用 traffic-proxy 防火墙规则                                                   | `true`                                                                                                                  |
| `agentio.trafficProxy.firewallBackend`   | 防火墙后端选择                                                                    | `auto`                                                                                                                  |
| `agentio.trafficProxy.imagePullPolicy`   | traffic-proxy 镜像拉取策略                                                       | `IfNotPresent`                                                                                                          |
| `agentio.trafficProxy.healthProbeRewrite` | 为注入的 traffic proxy 重写健康检查探针                                                | `true`                                                                                                                  |
| `agentio.trafficProxy.dnsCapture`        | 启用 DNS 拦截                                                                   | `true`                                                                                                                  |
| `agentio.trafficProxy.image.registry`    | 注入的 ztunnel 镜像仓库；为空时继承 `image.registry`                                      | `""`                                                                                                                    |
| `agentio.trafficProxy.image.repository`  | 注入的 ztunnel 镜像仓库                                                            | `openkruise/ztunnel`                                                                                                    |
| `agentio.trafficProxy.image.tag`         | 注入的 ztunnel 镜像版本                                                            | `0.2.0`                                                                                                                 |
| `agentio.trafficProxy.image.digest`      | 可选的 digest 覆盖，优先级高于 tag                                                     | `""`                                                                                                                    |
| `agentio.trafficProxy.initImage.registry` | 注入的 iptables init 镜像仓库；为空时继承 `image.registry`                               | `""`                                                                                                                    |
| `agentio.trafficProxy.initImage.repository` | 注入的 iptables init 镜像仓库                                                   | `openkruise/proxy-init`                                                                                                 |
| `agentio.trafficProxy.initImage.tag`     | 注入的 iptables init 镜像版本                                                      | `0.2.0`                                                                                                                 |
| `agentio.trafficProxy.initImage.digest`  | 可选的 digest 覆盖，优先级高于 tag                                                     | `""`                                                                                                                    |
| `agentio.trafficProxy.resources`         | 注入的 ztunnel 资源                                                             | `requests: 100m/64Mi, limits: 200m/128Mi`                                                                               |
| `agentio.trafficProxy.initResources`     | 注入的 iptables init 资源                                                       | `requests: 100m/128Mi, limits: 1/1Gi`                                                                                   |

### Sandbox Manager 安装参数

下表展示了 Sandbox Manager chart 的可配置参数和它们的默认值。

#### 常用参数

| Parameter                  | Description                                                | Default                      |
|----------------------------|------------------------------------------------------------|------------------------------|
| `replicaCount`             | Manager 副本数                                                | `2`                          |
| `image.registry`           | 应用于本 chart 所有镜像的仓库地址前缀                                     | `docker.io`                  |
| `imagePullSecrets`         | 镜像拉取密钥列表                                                   | `{}`                         |
| `controller.repository`    | sandbox-manager controller 镜像仓库                            | `openkruise/sandbox-manager` |
| `controller.tag`           | sandbox-manager controller 镜像版本                            | `v0.6.0`              |
| `controller.pullPolicy`    | Controller 容器镜像拉取策略                                         | `IfNotPresent`               |
| `controller.resources.cpu` | Controller 容器 CPU 资源                                        | `2`                          |
| `controller.resources.memory` | Controller 容器内存资源                                        | `4Gi`                        |
| `e2b.domain`               | E2B 协议域名（必填）                                                | `"your.domain.com"`          |
| `e2b.enableAuth`           | 是否启用 E2B 认证                                                 | `true`                       |
| `e2b.adminApiKey`          | E2B 管理员 API Key（必填）                                          | `""`                         |
| `ingress.className`        | Ingress 控制器类名（必填）                                            | `""`                         |
| `ingress.annotations`      | Ingress 注解                                                   | `{}`                         |
| `prometheus.enabled`       | 为 manager 和 gateway 指标创建 ServiceMonitor                       | `false`                      |
| `gateway.replicaCount`     | sandbox-gateway 副本数                                         | `2`                          |
| `gateway.image.repository` | sandbox-gateway 镜像仓库                                       | `openkruise/sandbox-gateway` |
| `gateway.image.tag`        | sandbox-gateway 镜像版本                                       | `v0.6.0`              |
| `gateway.image.pullPolicy` | sandbox-gateway 镜像拉取策略                                     | `IfNotPresent`               |
| `gateway.resources.cpu`    | sandbox-gateway 容器 CPU 资源                                  | `2`                          |
| `gateway.resources.memory` | sandbox-gateway 容器内存资源                                     | `4Gi`                        |

#### 高级参数

其余参数均为可选，默认值已经过合理设置，大多数安装无需修改。

| Parameter                              | Description                                                                    | Default                                |
|----------------------------------------|--------------------------------------------------------------------------------|----------------------------------------|
| `controller.logLevel`                  | Controller 日志级别                                                                | `5`                                    |
| `controller.infra`                     | Sandbox Manager 基础设施类型                                                         | `sandbox-cr`                           |
| `controller.hostNetwork`               | Controller 是否使用 Host Network                                                    | `false`                                |
| `controller.maxClaimWorkers`           | 最大 Claim 工作线程数                                                                  | `100`                                  |
| `controller.maxCreateQPS`              | 创建 Sandbox 的最大 QPS                                                              | `200`                                  |
| `controller.extProcMaxConcurrency`     | 外部处理器最大并发数                                                                       | `10000`                                |
| `controller.enableShortSandboxId`      | 启用简短易读的 Sandbox 标识符                                                             | `true`                                 |
| `controller.shortSandboxIdPrefix`      | 短 Sandbox ID 的可选前缀；仅在非空时生效                                                       | `""`                                   |
| `e2b.extraDomains`                     | 在 `e2b.domain` 之外额外加入 Ingress host 列表的域名                                        | `[]`                                   |
| `e2b.maxTimeout`                       | E2B 最大超时时间（秒）                                                                    | `2592000`                              |
| `e2b.keyStorage.mode`                  | E2B API Key 的存储位置：`secret`（`e2b-key-store` Secret）或 `mysql`                       | `secret`                              |
| `e2b.keyStorage.mysql.dsn`             | MySQL DSN；当 `keyStorage.mode=mysql` 时必填（非空），启动时校验                               | `""`                                |
| `e2b.keyStorage.mysql.hashPepper`      | MySQL Key 哈希 pepper；当 `keyStorage.mode=mysql` 时必填（非空），启动时校验                     | `""`                    |
| `quota.enabled`                        | 启用基于 Redis 的配额统计                                                                | `false`                                |
| `quota.redis.addr`                     | 配额使用的 Redis 地址；仅在启用时传给 manager                                                  | `""`                                   |
| `quota.redis.db`                       | 配额使用的 Redis 数据库编号                                                               | `0`                                    |
| `quota.redis.username`                 | Redis 用户名（渲染到 manager Secret 中）                                                 | `""`                                   |
| `quota.redis.password`                 | Redis 密码（渲染到 manager Secret 中）                                                  | `""`                                   |
| `service.type`                         | sandbox-manager Service 类型                                                     | `ClusterIP`                            |
| `ingress.dataplaneService`             | Ingress 的数据面后端 Service 名称                                                       | `sandbox-gateway`                      |
| `ingress.certSecretName`               | Ingress TLS 证书 Secret 名称                                                        | `sandbox-manager-tls`                  |
| `nameOverride`                         | 覆盖 Chart 名称                                                                    | `""`                                   |
| `fullnameOverride`                     | 覆盖完整名称                                                                         | `""`                                   |
| `serviceAccount.automount`             | 是否自动挂载 ServiceAccount Token                                                     | `true`                                 |
| `serviceAccount.annotations`           | ServiceAccount 注解                                                               | `{}`                                   |
| `serviceAccount.name`                  | ServiceAccount 名称                                                               | `""`                                   |
| `podAnnotations`                       | Pod 注解                                                                          | `{}`                                   |
| `podLabels`                            | Pod 标签                                                                          | `{}`                                   |
| `podSecurityContext`                   | Pod 安全上下文                                                                       | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `securityContext`                      | 容器安全上下文                                                                         | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`                         | Pod 调度的节点选择器                                                                    | `{}`                                                                                                                                                          |
| `tolerations`                          | Pod 调度的容忍度                                                                      | `[]`                                                                                                                                                          |
| `affinity`                             | Pod 调度的亲和性                                                                      | 默认配置软性 Pod 反亲和（`preferredDuringSchedulingIgnoredDuringExecution`），按主机名分散调度                                                                                   |
| `gracefulShutdown.preStopSleepSeconds` | 终止前 preStop 钩子中的睡眠时间；大于 0 时同时提升 `terminationGracePeriodSeconds`                    | `0`                                                                                                                        |
| `gateway.imagePullSecrets`             | Gateway 镜像拉取密钥列表                                                               | `[]`                                                                                                                    |
| `gateway.nameOverride`                 | 覆盖 gateway 名称                                                                   | `""`                                                                                                                    |
| `gateway.serviceAccount.annotations`   | Gateway ServiceAccount 注解                                                       | `{}`                                                                                                                    |
| `gateway.serviceAccount.name`          | Gateway ServiceAccount 名称                                                       | `""`                                                                                                                    |
| `gateway.podAnnotations`               | Gateway Pod 注解                                                                  | `{}`                                                                                                                    |
| `gateway.podSecurityContext`           | Gateway Pod 安全上下文                                                              | `{}`                                                                                                                    |
| `gateway.securityContext`              | Gateway 容器安全上下文                                                                 | `{}`                                                                                                                    |
| `gateway.initContainer.enabled`        | 是否启用 Gateway 初始化容器                                                             | `false`                                                                                                                 |
| `gateway.initContainer.image.repository` | 初始化容器镜像仓库                                                                   | `busybox`                                                                                                               |
| `gateway.initContainer.image.tag`      | 初始化容器镜像版本                                                                       | `1.36.1`                                                                                                                |
| `gateway.initContainer.image.pullPolicy` | 初始化容器镜像拉取策略                                                                 | `IfNotPresent`                                                                                                          |
| `gateway.initContainer.securityContext` | 初始化容器安全上下文                                                                   | `{capabilities: {drop: [ALL], add: [SYS_ADMIN]}}`                                                                       |
| `gateway.service.type`                 | sandbox-gateway Service 类型                                                     | `ClusterIP`                                                                                                             |
| `gateway.service.port`                 | sandbox-gateway Service 端口                                                     | `7788`                                                                                                                  |
| `gateway.service.targetPort`           | sandbox-gateway Service 目标端口                                                   | `7788`                                                                                                                  |
| `gateway.service.annotations`          | Gateway Service 注解                                                             | `{}`                                                                                                                    |
| `gateway.service.labels`               | Gateway Service 标签                                                             | `{}`                                                                                                                    |
| `gateway.nodeSelector`                 | Gateway Pod 调度的节点选择器                                                           | `{}`                                                                                                                    |
| `gateway.tolerations`                  | Gateway Pod 调度的容忍度                                                             | `[]`                                                                                                                    |
| `gateway.affinity`                     | Gateway Pod 调度的亲和性                                                             | `{}`                                                                                                                    |
| `gateway.livenessProbe`                | Gateway 存活探针（TCP 端口 7788）                                                      | `initialDelay: 10s, period: 10s, timeout: 5s, failureThreshold: 3`                                                      |
| `gateway.readinessProbe`               | Gateway 就绪探针（TCP 端口 7788）                                                      | `initialDelay: 5s, period: 5s, timeout: 3s, failureThreshold: 3`                                                        |
| `gateway.podAntiAffinity`              | Gateway Pod 反亲和性                                                               | `soft, weight: 100, topologyKey: kubernetes.io/hostname`                                                                |
| `gateway.envoy.admin.address`          | Envoy 管理接口地址                                                                   | `127.0.0.1`                                                                                                             |
| `gateway.envoy.admin.port`             | Envoy 管理接口端口                                                                   | `9901`                                                                                                                  |
| `gateway.envoy.prometheus.enabled`     | 对外暴露 Envoy Prometheus 指标（代理 admin 的 `/stats/prometheus`）                        | `false`                                                                                                                 |
| `gateway.envoy.prometheus.address`     | Envoy Prometheus 监听地址                                                          | `0.0.0.0`                                                                                                               |
| `gateway.envoy.prometheus.port`        | Envoy Prometheus 监听端口                                                          | `9902`                                                                                                                  |
| `gateway.envoy.prometheus.path`        | Envoy Prometheus 指标路径                                                          | `/metrics`                                                                                                              |
| `gateway.envoy.listener.address`       | Envoy 监听地址                                                                     | `0.0.0.0`                                                                                                               |
| `gateway.envoy.listener.port`          | Envoy 监听端口                                                                     | `7788`                                                                                                                  |
| `gateway.envoy.logLevel`               | Envoy 日志级别                                                                     | `warn`                                                                                                                  |
| `gateway.envoy.concurrency`            | Envoy worker 线程并发数；为空时回退到 `gateway.resources.cpu`                                | `""`                                                                                                                    |
| `gateway.envoy.drainTimeSeconds`       | Envoy 关闭时的排水时间                                                                 | `30`                                                                                                                    |
| `gateway.envoy.streamIdleTimeout`      | Envoy 流空闲超时时间                                                                 | `600s`                                                                                                                  |
| `gateway.envoy.connectTimeout`         | Envoy 上游连接超时时间                                                                | `5s`                                                                                                                    |
| `gateway.envoy.useDownstreamProtocolConfig` | 将下游协议配置应用于上游连接                                                              | `false`                                                                                                                 |
| `gateway.envoy.perConnectionBufferLimitBytes` | 单连接缓冲区上限                                                                | `1048576`                                                                                                               |
| `gateway.envoy.circuitBreakers`        | Envoy 熔断阈值                                                                     | `enabled: true, maxConnections: 80000, maxPendingRequests: 32768, maxRequests: 80000, maxRetries: 5`                     |
| `gateway.envoy.tcpKeepalive`           | Envoy 上游 TCP keepalive                                                         | `enabled: false, keepaliveProbes: 3, keepaliveTime: 60, keepaliveInterval: 10`                                          |
| `gateway.envoy.golangFilter`           | Gateway golang filter 库                                                         | `libraryId/pluginName: sandbox-gateway, libraryPath: /etc/envoy/sandbox-gateway.so`                                     |
| `gateway.envoy.pluginConfig.hostHeaderName` | 携带上游 host 的 Header                                                         | `Host`                                                                                                                  |
| `gateway.envoy.pluginConfig.sandboxHeaderName` | 携带 Sandbox ID 的 Header                                                   | `e2b-sandbox-id`                                                                                                        |
| `gateway.envoy.pluginConfig.sandboxPortHeader` | 携带 Sandbox 端口的 Header                                                    | `e2b-sandbox-port`                                                                                                      |
| `gateway.envoy.pluginConfig.defaultPort` | 未携带 sandbox port header 时使用的默认端口                                             | `"49983"`                                                                                                               |
| `gateway.envoy.pluginConfig.enableAuth` | 在 gateway plugin 中强制流量 access-token 认证                                        | `true`                                                                                                                  |
| `gateway.envoy.pluginConfig.trafficAccessTokenHeader` | 携带流量 access token 的 Header                                   | `e2b-traffic-access-token`                                                                                              |
| `gateway.envoy.pluginConfig.enableJwtAuth` | 启用 OIDC/JWT 校验；需要同时配置 `tls.oidc.discoveryUrl`                                | `false`                                                                                                                 |
| `gateway.envoy.pluginConfig.wakeTimeoutSeconds` | 等待休眠 Sandbox 唤醒的超时时间                                               | `60`                                                                                                                    |
| `enableTLS`                            | 基于 cert-manager/trust-manager 的 TLS 总开关。会签发 Ingress 服务端证书、manager/gateway 的 runtime 客户端证书、peer 证书，并在 gateway envoy 配置中启用 runtime mTLS。共享根 CA 由 sandbox-controller chart 持有，必须安装在同一 Namespace | `false`                    |
| `tls.signingIssuerName`                | 由 sandbox-controller chart 创建的 CA Issuer（同一 Namespace）；此处不创建                    | `sandbox-signing-issuer`                                                                                             |
| `tls.signingIssuerKind`                | 引用的 issuer 的 Kind                                                              | `Issuer`                                                                                                                |
| `tls.caCommonName`                     | Ingress 证书 Common Name；同时作为已签发证书的 subject organization                         | `sandbox-ca`                                                                                                     |
| `tls.caOrganization`                   | 已签发证书的 subject organization                                                     | `openkruise`                                                                                                            |
| `tls.certDuration`                     | 叶子证书有效期                                                                        | `2160h`                                                                                                                 |
| `tls.certRenewBefore`                  | 叶子证书续期窗口                                                                       | `360h`                                                                                                                  |
| `tls.ingressCertName`                  | Ingress 服务端 Certificate 资源；其 Secret 名称必须与 `ingress.certSecretName` 一致。仅由 `enableTLS` 即可提供，对明文 runtime 安全 | `sandbox-manager-ingress-cert`                                               |
| `tls.runtime.enabled`                  | 签发 manager/gateway 的 runtime 客户端证书并启用 `--runtime-client-cert-secret` 以及 gateway 的 enable-runtime-mtls/transport_socket。对不支持 TLS 的 agent-runtime 会失败；依赖 `enableTLS`；需与 Controller chart 的 `tls.runtime.enabled` 同步设置 | `false`                                                                |
| `tls.managerRuntimeClientCertName`     | Manager runtime 客户端 Certificate 名称                                             | `sandbox-manager-runtime-client`                                                                                        |
| `tls.managerRuntimeClientCertSecretName` | Manager runtime 客户端证书 Secret 名称                                              | `sandbox-manager-runtime-client-cert`                                                                                   |
| `tls.managerRuntimeClientCommonName`   | Manager runtime 客户端证书 Common Name                                              | `system:sandbox-manager`                                                                                                |
| `tls.gatewayRuntimeClientCertName`     | Gateway runtime 客户端 Certificate 名称                                             | `sandbox-gateway-runtime-client`                                                                                        |
| `tls.gatewayRuntimeClientCertSecretName` | Gateway runtime 客户端证书 Secret 名称                                              | `sandbox-gateway-runtime-client-cert`                                                                                   |
| `tls.gatewayRuntimeClientCommonName`   | Gateway runtime 客户端证书 Common Name                                              | `system:sandbox-gateway`                                                                                                |
| `tls.gatewayRuntimeMtlsDir`            | gateway runtime mTLS Secret 的挂载目录；由 envoy transport_socket 引用                       | `/var/run/sandbox-gateway/runtime-mtls`                                                              |
| `tls.agentRuntimeServerSAN`            | agent-runtime 服务端证书携带的 SAN；用作 envoy SNI 并通过 auto_sni_san_validation 校验。必须与 Controller chart 保持一致 | `agentruntime.sandbox.agents.kruise.io`                                                            |
| `tls.peer.enabled`                     | manager↔gateway 控制面集群的 peer mTLS + memberlist gossip 加密。与 agent-runtime 数据链路相互独立；依赖 `enableTLS` 以及包含 openkruise/agents#967 的镜像（旧版 sandbox-manager 镜像遇到未知的 `--peer-*` 参数会崩溃） | `false`                                                   |
| `tls.peer.serverCertName` / `serverCertSecretName` | manager 与 gateway 共享的 peer TLS 服务端证书（仅服务端认证；SAN 固定为 `tls.agentRuntimeServerSAN`） | `sandbox-peer-server` / `sandbox-peer-server-cert`                                              |
| `tls.peer.managerClientCertName` / `managerClientCertSecretName` / `managerClientCommonName` | Manager peer 客户端证书（仅客户端认证） | `sandbox-peer-manager-client` / `sandbox-peer-manager-client-cert` / `system:sandbox-manager`                     |
| `tls.peer.gatewayClientCertName` / `gatewayClientCertSecretName` / `gatewayClientCommonName` | Gateway peer 客户端证书（仅客户端认证） | `sandbox-peer-gateway-client` / `sandbox-peer-gateway-client-cert` / `system:sandbox-gateway`                     |
| `tls.peer.keySecretName`               | 用于 memberlist gossip 加密的已有 Secret（数据 key 为 `key`，恰好 32 字节）；为空则禁用。cert-manager 无法创建该 Secret，需在带外提供，并由 manager 和 gateway 共同引用 | `""`                                                                        |
| `tls.peer.allowedClientCNs`            | 可选，逗号分隔的入站白名单，与客户端证书 CN 或 DNS SAN 匹配；为空表示接受 peer 服务端 CA 信任的所有客户端 | `""`                                                                             |
| `tls.oidc.discoveryUrl`                | Token 签发方的绝对 HTTPS discovery URL；启用 JWT 认证时必填，为空时 verifier 初始化失败 | `""`                                                                                |
| `tls.oidc.caConfigMapName` / `caConfigMapKey` | 存放用于校验签发方 TLS 证书的 CA 的 ConfigMap；默认指向 Controller chart 创建的 trust-manager Bundle | `sandbox-ca-bundle` / `ca.crt`                                                          |
| `tls.oidc.clockSkew`                   | 可选的 token 时钟偏移覆盖（如 `1m`）；为空时使用默认值                                          | `""`                                                                                                                    |
| `tls.epe.enabled`                      | 签发 traffic-extension（EPE）credential-provider 客户端证书；依赖 `agentio.epe.mode=managed` 和 `agentio.epe.credentialProvider.mtls.source=files` | `false`                                                       |
| `tls.epe.certificateName` / `commonName` | Certificate 资源 / Common Name；为空时默认为 `<epe-fullname>-mtls-client-cert` / `system:<epe-fullname>` | `""`                                                                                          |
| `tls.epe.issuerName` / `issuerKind` / `issuerGroup` | 签发 EPE 客户端证书的 Issuer；命名空间内默认 Issuer 仅在 agentio 命名空间同样持有 CA Issuer 时可用 | `sandbox-signing-issuer` / `Issuer` / `cert-manager.io`                                       |
| `tls.epe.duration` / `renewBefore`     | EPE 证书有效期 / 续期窗口                                                              | `2160h` / `360h`                                                                                                        |
| `agentio.enabled`                      | 部署内置的 Agentio 控制面                                                              | `false`                                                                                                                 |
| `agentio.global.registry`              | Agentio 镜像的默认仓库；为空时继承 `image.registry`                                         | `""`                                                                                                                    |
| `agentio.global.tag`                   | Agentio 镜像的默认 tag，可按组件覆盖                                                        | `0.2.0`                                                                                                                 |
| `agentio.global.imagePullPolicy`       | Agentio 镜像的默认拉取策略                                                              | `IfNotPresent`                                                                                                          |
| `agentio.global.imagePullSecrets`      | Agentio 镜像的默认拉取密钥                                                              | `[]`                                                                                                                    |
| `agentio.global.namespace`             | Agentio 控制面 Namespace                                                          | `sandbox-system`                                                                                                        |
| `agentio.global.createNamespace`       | 创建 Agentio 控制面 Namespace                                                       | `true`                                                                                                                  |
| `agentio.global.trustDomain`           | Agentio 工作负载身份 trust domain                                                     | `cluster.local`                                                                                                         |
| `agentio.global.clusterDomain`         | Kubernetes Service DNS 域名                                                       | `cluster.local`                                                                                                         |
| `agentio.global.clusterId`             | Agentio 集群标识                                                                     | `Kubernetes`                                                                                                            |
| `agentio.global.caCertConfigMap`       | 分发 Agentio mesh 根 CA 的 ConfigMap                                                | `agentio-ca-certs`                                                                                                      |
| `agentio.agentiod.ca.trustBundleConfigMapName` | 分发给 traffic proxy 的 CA trust bundle                                    | `agentio-ca-root-cert`                                                                                                  |
| `agentio.agentiod.replicaCount`        | Agentio 控制面副本数                                                                  | `1`                                                                                                                     |
| `agentio.agentiod.image.registry`      | Agentio 控制面镜像仓库；为空时继承 `agentio.global.registry`                                 | `""`                                                                                                                    |
| `agentio.agentiod.image.repository`    | Agentio 控制面镜像仓库                                                                | `openkruise/agentiod`                                                                                                   |
| `agentio.agentiod.image.tag`           | Agentio 控制面镜像版本                                                                | `0.2.0`                                                                                                                 |
| `agentio.agentiod.image.digest`        | 可选的 digest 覆盖，优先级高于 tag                                                         | `""`                                                                                                                    |
| `agentio.agentiod.resources`           | 控制面资源请求                                                                         | `500m CPU, 512Mi`                                                                                                       |
| `agentio.epe.mode`                     | EPE 部署模式：disabled、managed 或 external                                           | `managed`                                                                                                               |
| `agentio.epe.image.registry`           | EPE 镜像仓库；为空时继承 `agentio.global.registry`                                        | `""`                                                                                                                    |
| `agentio.epe.image.repository`         | EPE 镜像仓库                                                                         | `openkruise/agentio-epe`                                                                                                |
| `agentio.epe.image.tag`                | EPE 镜像版本                                                                         | `0.2.0`                                                                                                                 |
| `agentio.epe.image.digest`             | 可选的 digest 覆盖，优先级高于 tag                                                         | `""`                                                                                                                    |
| `agentio.egressGateway.mode`           | Gateway 模式：disabled、static 或 gatewayAPI                                        | `static`                                                                                                                |
| `agentio.egressGateway.image.registry` | 出口网关代理镜像仓库；为空时继承 `agentio.global.registry`                                      | `""`                                                                                                                    |
| `agentio.egressGateway.image.repository` | 出口网关代理镜像仓库                                                                     | `openkruise/proxyv2`                                                                                                    |
| `agentio.egressGateway.image.tag`      | 出口网关代理镜像版本                                                                       | `0.2.0`                                                                                                                 |
| `agentio.egressGateway.image.digest`   | 可选的 digest 覆盖，优先级高于 tag                                                         | `""`                                                                                                                    |
| `agentio.agentiod.config.values`       | Agentio 配置的原始覆盖值                                                                 | `{}`                                                                                                                    |

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
  maxConnections: 80000
  maxPendingRequests: 32768
  maxRequests: 80000
  maxRetries: 5
```

### 镜像仓库

镜像渲染格式为 `<registry>/<repository>:<tag>`，配置了 digest 覆盖时则为 `<registry>/<repository>@<digest>`。`registry`
默认取 chart 级别的 `image.registry`。Agentio 镜像的 registry 解析链更长：先取自身的 `image.registry`，然后
`agentio.global.registry`，最后 `image.registry`。Agentio 镜像默认使用固定 tag `0.2.0`；可选的 `digest` 会覆盖 tag。

当 repository 的第一段路径已经是主机名（包含 `.` 或 `:`）时会去掉 registry 前缀，因此把 `controller.repository` 设为
`myreg.io/openkruise/sandbox-manager` 或把 `image.repository` 设为
`myreg.io/openkruise/agent-sandbox-controller` 无需同时清空 `image.registry` 也能正常工作。

### TLS（cert-manager / trust-manager）

所有证书签发都由 `enableTLS`（默认 `false`）控制，该开关要求集群安装 cert-manager（以及用于 CA Bundle 的
trust-manager）。共享根 CA（Issuer 和 CA Certificate）由 Sandbox Controller chart 持有，必须安装在同一 Namespace；
Sandbox Manager chart 仅按名称引用 `tls.signingIssuerName` 这个 Issuer。

各开关相互独立，可以逐步启用：

- **`enableTLS=true`**：签发 Ingress 服务端证书（`tls.ingressCertName`，接入 `ingress.certSecretName`）。外部客户端 →
  Ingress HTTPS 与 agent-runtime 无关，因此在 runtime 仍为明文的情况下也可安全生效。
- **`tls.runtime.enabled=true`**：额外签发 manager、gateway 和 controller 的 runtime 证书，并启用
  `--runtime-client-cert-secret` 以及 gateway 的 enable-runtime-mtls/transport_socket。这些客户端路径在不支持
  TLS 的 agent-runtime 上会失败——只有 agent-runtime 镜像支持 runtime TLS 后才能启用，并与 Controller chart 的
  `tls.runtime.enabled` 一起设置，以打通完整的 runtime 链路。
- **`tls.peer.enabled=true`**：保护 manager↔gateway 的 route-sync/gossip 通道（peer mTLS，以及通过
  `tls.peer.keySecretName` 可选的 memberlist gossip 加密）。它与 agent-runtime 数据链路相互独立，可以单独安全启用，但需要
  包含 [openkruise/agents#967](https://github.com/openkruise/agents/pull/967) 的 manager/gateway
  镜像：旧版 sandbox-manager 遇到未知的 `--peer-*` 参数会崩溃。启用前请确认镜像版本。
- **`tls.epe.enabled=true`**：签发 EPE credential-provider 客户端证书。需要 `agentio.epe.mode=managed` 且
  `agentio.epe.credentialProvider.mtls.source=files`；证书会写入 EPE 挂载的同一个 files Secret，key 重映射为
  `client.crt`/`client.key`/`ca.crt`。Mesh 工作负载证书（出口网关、traffic-proxy/ztunnel mTLS）不在此处签发——
  由 agentiod/pilot 按需签发 SPIFFE SVID。
- **`gateway.envoy.pluginConfig.enableJwtAuth=true`**（配合 `enableTLS`）：在 gateway 启用 OIDC/JWT 校验。需要
  `tls.oidc.discoveryUrl`；verifier 通过 API server 从 `tls.oidc.caConfigMapName` ConfigMap 读取 CA，因此该
  ConfigMap 必须存在于本 Namespace（默认指向 Controller chart 创建的 trust-manager Bundle）。

### Agent Runtime 注入

`sandbox-injection-config` ConfigMap 内置一个 `agent-runtime` 条目。只有通过在 `Sandbox.spec.runtimes`
中显式声明该 runtime 的 Sandbox 才会应用：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: demo
spec:
  runtimes:
    - name: agent-runtime
  # ... pod template
```

当声明了该 runtime 时，Controller 会向第一个业务容器注入一个名为 `agent-runtime` 的 native sidecar 容器（按
`agentRuntime.image.*` 构建，默认 `openkruise/agent-runtime:v0.3.0`）、`ENVD_DIR`/`GODEBUG`/`POD_UID`
环境变量、挂载到 `/mnt/envd` 的 `envd-volume`，以及一个 `postStart` 钩子。

要求：

- **Kubernetes >= 1.29。** `agent-runtime` 容器以 native sidecar（`restartPolicy: Always` 的 init
  container）方式注入，要求默认启用 `SidecarContainers` 特性。在更旧的集群上，注入的 Pod 会被拒绝或 sidecar
  无法按预期重启。
- **第一个业务容器镜像必须包含 `bash`。** 注入的 `postStart` 钩子会在该容器内执行
  `bash /mnt/envd/envd-run.sh`，因此不含 `bash` 二进制的镜像（例如纯 `distroless` 或 `busybox` 基础镜像）将无法启动。

Controller chart 有意只内置 `traffic-proxy` 和 `agent-runtime` 两个注入条目。TLS / helper runtime 和 CSI
runtime 不包含在内；如果你的环境需要，请单独部署这些组件。

---

## 第三方依赖

两个 chart 无需以下任何组件即可运行；每个组件只支撑某个特定功能，需要该功能时再安装组件并打开对应开关。

### cert-manager / trust-manager

- **依赖的功能**：TLS 终止。`enableTLS=true` 时，cert-manager 负责签发 Ingress 服务端证书以及
  manager/gateway/controller 的 runtime 和 peer 证书，trust-manager 负责以 ConfigMap 分发共享 CA（`ca.crt`）。
- **开启方法**：在集群中安装 cert-manager（以及用于 CA Bundle 的 trust-manager），然后为两个 chart 都设置
  `enableTLS=true`——根 CA Issuer 和 Certificate 由 Sandbox Controller chart 持有，Sandbox Manager chart 仅按名称
  引用 Issuer。各开关的说明见 [TLS（cert-manager / trust-manager）](#tlscert-manager--trust-manager)。

### OpenKruise

- **依赖的功能**：真实节点上的探针驱动自动暂停/恢复。启用 `KruiseIntegration` feature gate 后，Controller 会创建
  OpenKruise `PodProbeMarker` 资源，由 kruise-daemon 在 Sandbox Pod 内执行 `Sandbox.spec.probes` 中定义的探针。
  不启用该 gate 时，真实节点的探针 condition 会一直处于 `Unknown`，自动暂停决策按失败处理（fail closed）——虚拟
  kubelet 节点上的探针仍可通过 `kruise.io/podprobe` annotation 工作。
- **开启方法**：在集群中安装 OpenKruise，然后安装或升级 Sandbox Controller 时启用该 gate：
  `--set 'controller.featureGates=KruiseIntegration=true'`。

### Redis

- **依赖的功能**：配额统计。`quota.enabled=true` 时，manager 将配额计数存储在 Redis 中。
- **开启方法**：部署一个 Redis 实例，然后安装或升级 Sandbox Manager 时加上
  `--set quota.enabled=true --set quota.redis.addr=<host:port>`，按需再设置 `quota.redis.db`、
  `quota.redis.username` 和 `quota.redis.password`。

### MySQL

- **依赖的功能**：E2B API Key 存储。`e2b.keyStorage.mode=mysql` 时，API Key 存储在 MySQL 中，而不是默认的
  `e2b-key-store` Secret。
- **开启方法**：准备好数据库和 DSN，然后安装或升级 Sandbox Manager 时加上
  `--set e2b.keyStorage.mode=mysql --set e2b.keyStorage.mysql.dsn=<dsn> --set e2b.keyStorage.mysql.hashPepper=<pepper>`。
  DSN 和 pepper 均为必填，manager 启动时会校验。

### Prometheus

- **依赖的功能**：指标采集。
- **开启方法**：
  - **Manager 和 gateway**：`--set prometheus.enabled=true` 会为两者创建 ServiceMonitor；要求集群中已安装
    Prometheus Operator CRD。
  - **Gateway Envoy**：`--set gateway.envoy.prometheus.enabled=true` 会对外暴露 Envoy admin 的
    `/stats/prometheus`（端口 9902）。
  - **Controller**：chart 通过 `metrics.rbac.create`（默认 `true`）授予 `/metrics` nonResourceURL 的 `get` 权限；
    将生成的 ClusterRole 绑定到你的 Prometheus 采集器 ServiceAccount。

### Ingress Controller

- **依赖的功能**：对外访问。需要通过 Ingress 暴露 manager API（`api.<domain>`）和 gateway（`*.<domain>`）时，
  `ingress.className` 是必填项。
- **开启方法**：安装 Ingress 控制器（例如 ALB 或 nginx），然后安装或升级 Sandbox Manager 时加上
  `--set ingress.className=<alb|nginx>`。完整示例见[使用 Ingress 暴露服务](#使用-ingress-暴露服务)。

---

## 最佳实践

### 自定义资源配置

根据你的集群规模，建议调整以下资源参数：

**Sandbox Controller 资源调整**

```bash
helm install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --version 0.6.0 \
  --set resources.limits.cpu=4 \
  --set resources.limits.memory=8Gi \
  --set resources.requests.cpu=2 \
  --set resources.requests.memory=4Gi
```

**Sandbox Manager + Gateway 资源调整**

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
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
  --version 0.6.0 \
  --set e2b.domain=sandbox.example.com \
  --set e2b.enableAuth=true \
  --set e2b.adminApiKey=your-secure-api-key \
  --set ingress.className=<your-ingress-class>
```

### 使用 Ingress 暴露服务

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.certSecretName=sandbox-manager-tls
```

### 配置 Gateway 高可用

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
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
  --version 0.6.0 \
  --set e2b.domain=<your-domain> \
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

### 0.6.0 相比 0.3.0 的主要变化

| 类别                | 变更内容                                                                                                                                                                                                                                                                                                |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **新增 CRD**        | Controller chart 新增 `Commit`（`commits.agents.kruise.io`）和 `PoolAutoscaler`（`poolautoscalers.agents.kruise.io`）CRD；Manager chart 新增 `TrafficPolicy`、`GlobalTrafficPolicy`、`SecurityProfile` 和 `GlobalSecurityProfile` CRD，用于 Sandbox 出入站控制。升级时 Controller CRD 必须手动更新；Manager chart 的 CRD 由 `helm upgrade` 自动更新 |
| **Chart 架构**      | Manager Pod 不再运行 Envoy sidecar；数据面完全由 Sandbox Gateway Deployment 提供（Service 端口 7788），Manager Service 监听 8080 端口。所有镜像都通过 chart 级别的 `image.registry` 解析。Controller chart 不再支持 server-side apply                                                                                                     |
| **Checkpoint、Pause 与 Commit** | 新增 `CheckpointControl` 生命周期，支持 `PersistentContents` 文件系统检查点和可选择的检查点标签；暂停会等待进行中的检查点完成；新增 `Commit` CRD，支持仓库认证和基于 nerdctl 的 commit/push job                                                                                                             |
| **成本优化**          | Sandbox 回收（归还到池）避免冷启动；探针驱动的自动暂停（`AutoPausePolicy`）和流量触发唤醒恢复（`OnIngressTraffic`）；SandboxSet 上的 `PauseStrategy`（Stop / Snapshot / CloudDisk）；`PoolAutoscaler` 支持按容量和 cron 驱动的扩缩容                                                                                                                     |
| **安全与出站控制**       | TrafficPolicy / SecurityProfile 驱动的出站控制（协议和 scheme 匹配、内联 E2B L7 规则）、MCP 工具访问控制、Header 操作以及更严格的 CRD admission 校验                                                                                                                                                                      |
| **身份与 Token**     | FeatureGate 控制的 Security Identity Provider，在 Sandbox 生命周期中签发和传递 token；token 在 claim 时签发，恢复后重新签发；通过 SecurityTokenRefresh reconciler 主动轮换                                                                                                    |
| **Gateway 与传输**   | Gateway JWT 校验，可选 runtime mTLS；CA bundle 注入框架；CSI 挂载和 `/init` 握手迁移到支持 TLS 的传输；traffic access token header 与 E2B SDK 对齐                                                                                                        |
| **升级与原地更新**       | 暂停的 Sandbox 可通过 `SandboxUpdateOps`（两阶段流程）和 `CheckpointRestore` 策略升级；claim 期间可以调整 Sandbox 内存；放宽了原地资源 resize 校验                                                                                                                       |
| **E2B 兼容性**       | 支持 Claude Code；Pod IP 元数据；E2B >= v2.25.0 API Key 编码；命名的克隆 Sandbox；动态解析 Sandbox 域名；Volume API 和 Network API（Volume 管理接口暂时禁用）；维度感知的 API Key 配额                                                                                                         |
| **Controller 与 SandboxSet** | SandboxSet 自动创建 SandboxTemplate；legacy revision hash 避免升级时重建 Sandbox；`maxUnavailable` 限定为启动失败预算；缩容候选按优先级排序                                                                                                                        |
| **标识符与 CLI**      | 简短、稳定的 Sandbox ID 在缩短标识符长度的同时保持跨生命周期操作的唯一性；新增 `okactl` CLI 用于 Sandbox 操作；多架构镜像发布                                                                                                                                               |
| **可观测性**          | 新增异常 runtime 容器指标；Pod 创建失败和 Sandbox 生命周期的事件与 conditions；Controller 和 Manager 的生命周期链路追踪                                                                                                                                             |

详细变更请参考 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md#v060)。

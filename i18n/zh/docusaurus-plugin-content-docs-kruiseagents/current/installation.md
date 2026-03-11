---
title: 安装
---

## 概述

Sandbox Controller 和 Sandbox Manager 是 OpenKruise 生态中的两个核心组件：

- **Sandbox Controller**：负责管理 Sandbox 相关的 CRD 资源，包括 SandboxSet、Sandbox、SandboxClaim 和 SandboxTemplate
  的生命周期管理。
- **Sandbox Manager**：提供 Sandbox 的 API 服务，包含控制器和 Envoy 代理，支持 E2B 协议访问。

---

## 版本兼容性

| 组件                 | 版本     | Kubernetes 兼容性 |
|--------------------|--------|----------------|
| Sandbox Controller | v0.1.0 | `>= 1.24`      |
| Sandbox Manager    | v0.1.0 | `>= 1.24`      |

---

## 前置条件

1. Kubernetes 集群版本 >= 1.24
2. 已安装 Helm v3.5+
3. 已安装 OpenKruise（Sandbox Controller 依赖 Kruise 的部分功能）
4. 手动创建namespace

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
kubectl create ns <namespace>
```

**安装顺序**：Sandbox Controller 必须先于 Sandbox Manager 安装，因为它提供了 Sandbox Manager 所需的 CRD 资源。

```bash
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller -n <namespace> --version 0.1.0
```

### 3. 安装 Sandbox Manager

```bash
$ helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager -n <namespace> --version 0.1.0
```

---

## 使用国内镜像源

由于网络原因，国内用户可能无法直接从 Docker Hub 拉取镜像。建议使用阿里云容器镜像服务提供的国内镜像。

### 国内镜像地址

| 组件                 | 镜像地址                                                                                  | 版本             |
|--------------------|---------------------------------------------------------------------------------------|----------------|
| Sandbox Controller | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller` | `v0.1.0`       |
| Sandbox Manager    | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager`          | `v0.1.0`       |
| Envoy Proxy        | `openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/envoy`                    | `v1.33-latest` |

### 使用国内镜像安装

**安装 Sandbox Controller（使用国内镜像）**

```bash 
helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller -n <namespace> --version 0.1.0 \
--set image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/agent-sandbox-controller
```

**安装 Sandbox Manager（使用国内镜像）**

```bash 
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager -n <namespace> --version 0.1.0 \
--set controller.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/sandbox-manager \
--set proxy.repository=registry-cn-hangzhou.ack.aliyuncs.com/acs/envoy \
--set proxy.tag=v1.4.0-gf4e7213-apsara
```

---

## 通过 Helm 升级

### 升级 Sandbox Controller

```bash 
helm upgrade agents-sandbox-controller openkruise/kruise-agents-sandbox-controller -n <namespace> --version 0.1.0
```

### 升级 Sandbox Manager

```bash 
helm upgrade agents-sandbox-manager openkruise/kruise-agents-sandbox-manager -n <namespace> --version 0.1.0
```

**注意：**

1. 在升级之前，**必须**先阅读 [Change Log](https://github.com/openkruise/agents/blob/master/CHANGELOG.md)
   ，确保你已经了解新版本的不兼容变化。
2. 如果你要重置之前旧版本上用的参数或者配置一些新参数，建议在 `helm upgrade` 命令里加上 `--reset-values`。

---

## 手工下载 Charts 包

如果你在生产环境无法连接到 `https://openkruise.github.io/charts/`，可以先在 [GitHub Releases](https://github.com/openkruise/charts/releases)
手工下载 chart 包，再用它安装或更新到集群中。

```bash 
helm install/upgrade agents-sandbox-controller /PATH/TO/CONTROLLER/CHART -n <namespace>
helm install/upgrade agents-sandbox-manager /PATH/TO/MANAGER/CHART -n <namespace>
```

---

## 可选项

### Sandbox Controller 安装参数

下表展示了 Sandbox Controller chart 所有可配置的参数和它们的默认值：

| Parameter                    | Description                 | Default                                                                                                                 |
|------------------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `replicaCount`               | Controller 副本数              | `2`                                                                                                                     |
| `image.repository`           | Controller 镜像仓库             | `openkruise/agent-sandbox-controller`                                                                                   |
| `image.tag`                  | Controller 镜像版本             | `v0.1.0`                                                                                                                |
| `image.pullPolicy`           | 镜像拉取策略                      | `IfNotPresent`                                                                                                          |
| `webhook.port`               | Webhook 服务端口                | `9443`                                                                                                                  |
| `metrics.port`               | Metrics 服务端口                | `8443`                                                                                                                  |
| `healthProbe.port`           | 健康检查端口                      | `8081`                                                                                                                  |
| `resources.limits.cpu`       | CPU 资源限制                    | `2`                                                                                                                     |
| `resources.limits.memory`    | 内存资源限制                      | `4Gi`                                                                                                                   |
| `resources.requests.cpu`     | CPU 资源请求                    | `2`                                                                                                                     |
| `resources.requests.memory`  | 内存资源请求                      | `4Gi`                                                                                                                   |
| `namespace.name`             | 部署的命名空间                     | `sandbox-system`                                                                                                        |
| `serviceAccount.create`      | 是否创建 ServiceAccount         | `true`                                                                                                                  |
| `serviceAccount.automount`   | 是否自动挂载 ServiceAccount Token | `true`                                                                                                                  |
| `serviceAccount.annotations` | ServiceAccount 注解           | `{}`                                                                                                                    |
| `serviceAccount.name`        | 使用的 ServiceAccount 名称       | `""`                                                                                                                    |
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
| `controller.tag`                   | Controller 镜像版本     | `v0.1.0`                     |
| `controller.pullPolicy`            | 镜像拉取策略              | `IfNotPresent`               |
| `controller.logLevel`              | 日志级别                | `3`                          |
| `controller.infra`                 | Sandbox 基础设施类型      | `sandbox-cr`                 |
| `controller.hostNetwork`           | 是否使用 Host Network   | `false`                      |
| `controller.maxClaimWorkers`       | 最大 Claim 工作线程数      | `100`                        |
| `controller.maxCreateQPS`          | 创建 Sandbox 的最大 QPS  | `200`                        |
| `controller.extProcMaxConcurrency` | 外部处理器最大并发数          | `3000`                       |
| `controller.resources.cpu`         | Controller CPU 资源限制 | `2`                          |
| `controller.resources.memory`      | Controller 内存资源限制   | `4Gi`                        |

#### Proxy (Envoy) 参数

| Parameter                | Description  | Default            |
|--------------------------|--------------|--------------------|
| `proxy.repository`       | Envoy 代理镜像仓库 | `envoyproxy/envoy` |
| `proxy.tag`              | Envoy 代理镜像版本 | `v1.33-latest`     |
| `proxy.pullPolicy`       | 镜像拉取策略       | `IfNotPresent`     |
| `proxy.resources.cpu`    | Envoy CPU 资源 | `2`                |
| `proxy.resources.memory` | Envoy 内存资源   | `4Gi`              |

#### E2B 协议参数

| Parameter         | Description     | Default           |
|-------------------|-----------------|-------------------|
| `e2b.domain`      | E2B 协议域名        | `your.domain.com` |
| `e2b.enableAuth`  | 是否启用 E2B 认证     | `true`            |
| `e2b.adminApiKey` | E2B 管理员 API Key | `admin-987654321` |
| `e2b.maxTimeout`  | E2B 最大超时时间（秒）   | `2592000`         |

#### 服务与 Ingress 参数

| Parameter                | Description              | Default               |
|--------------------------|--------------------------|-----------------------|
| `service.type`           | Service 类型               | `ClusterIP`           |
| `service.port`           | Envoy 代理服务端口             | `7788`                |
| `ingress.className`      | Ingress 类名               | `nginx`               |
| `ingress.annotations`    | Ingress 注解               | `{}`                  |
| `ingress.certSecretName` | Ingress TLS 证书 Secret 名称 | `sandbox-manager-tls` |

#### 其他参数

| Parameter                                    | Description                 | Default                                                                                                                                                       |
|----------------------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagePullSecrets`                           | 镜像拉取密钥                      | `{}`                                                                                                                                                          |
| `nameOverride`                               | 覆盖 Chart 名称                 | `""`                                                                                                                                                          |
| `fullnameOverride`                           | 覆盖完整名称                      | `""`                                                                                                                                                          |
| `serviceAccount.automount`                   | 是否自动挂载 ServiceAccount Token | `true`                                                                                                                                                        |
| `serviceAccount.annotations`                 | ServiceAccount 注解           | `{}`                                                                                                                                                          |
| `serviceAccount.name`                        | ServiceAccount 名称           | `""`                                                                                                                                                          |
| `podAnnotations`                             | Pod 注解                      | `{}`                                                                                                                                                          |
| `podLabels`                                  | Pod 标签                      | `{}`                                                                                                                                                          |
| `podSecurityContext`                         | Pod 安全上下文                   | `{fsGroup: 2000, seccompProfile: {type: RuntimeDefault}}`                                                                                                     |
| `podSecurityContextAllowPrivilegeEscalation` | 是否允许特权提升                    | `false`                                                                                                                                                       |
| `securityContext`                            | 容器安全上下文                     | `{capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 65532}` |
| `nodeSelector`                               | 节点选择器                       | `{}`                                                                                                                                                          |
| `tolerations`                                | 容忍度                         | `[]`                                                                                                                                                          |
| `affinity`                                   | 亲和性                         | 优先 Pod 反亲和性                                                                                                                                                   |

这些参数可以通过 `--set key=value[,key=value]` 参数在 `helm install` 或 `helm upgrade` 命令中生效。

---

## 最佳实践

### 自定义资源配置

根据你的集群规模，建议调整以下资源参数：
Sandbox Controller 资源调整

```bash
$ helm install agents-sandbox-controller openkruise/kruise-agents-sandbox-controller \
--set resources.limits.cpu=4 \
--set resources.limits.memory=8Gi \
--set resources.requests.cpu=2 \
--set resources.requests.memory=4Gi
```

Sandbox Manager 资源调整

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set controller.resources.cpu=4 \
--set controller.resources.memory=8Gi
```

### 配置 E2B 域名和认证

```bash 
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set e2b.domain=sandbox.example.com \
--set e2b.enableAuth=true \
--set e2b.adminApiKey=your-secure-api-key
```

### 使用 Ingress 暴露服务

```bash
helm install agents-sandbox-manager openkruise/kruise-agents-sandbox-manager \
--set ingress.className=nginx \
--set ingress.annotations."cert-manager.io/cluster-issuer"=letsencrypt-prod \
--set ingress.certSecretName=sandbox-manager-tls
```

---

## 卸载

**注意：** 卸载会删除 webhook configurations、services、instances 等 Sandbox 相关资源，但不会删除 Pod。Pod 只有在 CRD
被删除时才会被删除。Namespace 和 CRD 不会被自动删除，如需清理请手动操作。请务必谨慎操作！

### 卸载 Sandbox Manager

```bash
helm uninstall agents-sandbox-manager
```

### 卸载 Sandbox Controller

```bash 
helm uninstall agents-sandbox-controller
```

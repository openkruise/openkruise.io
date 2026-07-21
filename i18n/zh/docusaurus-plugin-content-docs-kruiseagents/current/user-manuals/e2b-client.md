---
title: Python 客户端
---

# 使用 E2B SDK

OpenKruise Agents 的 sandbox-manager 组件支持两种 E2B 接入协议：原生 E2B 协议和私有协议。

> sandbox-manager 的日常 E2E 回归测试通过 e2b-code-interpreter == 2.4.1 / e2b == 2.8.1 进行，同时通过 latest 版本测试兼容性。
> 更新版本的新功能会逐步适配，如果有功能需求，请通过 GitHub 提交 issue。

私有协议与原生协议的对比：

> 假设您配置的 E2B_DOMAIN 是 `your.domain.com`

| 原生协议                             | 私有协议                                    | 
|----------------------------------|-----------------------------------------|
| api.your.domain.com              | your.domain.com/kruise/api              | 
| \<port\>-\<sid\>.your.domain.com | your.domain.com/kruise/\<sid\>/\<port\> |

## 配置 E2B 域名

基于域名接入的客户端需要配置 `E2B_DOMAIN`。服务端 `sandbox-manager` 支持两种域名模式：

- **动态解析（未传入参数时的默认模式）**：当 `--e2b-domain` 为空时，`sandbox-manager` 根据每个请求的 HTTP `Host`
  推导响应域名。原生协议请求会移除主机名开头的 `api.`，私有协议请求则保留完整主机名。因此，同一个
  `sandbox-manager` 可以服务多个域名。
- **静态覆盖**：当 `--e2b-domain` 非空时，服务端会原样返回该值并忽略请求主机名。所有客户端都通过同一个域名访问
  `sandbox-manager` 时，可以使用此模式。

例如，在动态解析模式下，配置了 `E2B_DOMAIN=example1.com` 和 `E2B_DOMAIN=example2.com` 的客户端可以共用
同一个 `sandbox-manager`。发往 `api.example1.com` 的请求会得到 `example1.com` 下的 Sandbox 地址，发往
`api.example2.com` 的请求则会得到 `example2.com` 下的地址。

:::note
动态解析使用 HTTP `Host` 请求头，不信任 `X-Forwarded-Host`。请配置各级反向代理，使其保留 `Host`，或将 `Host`
重写为客户端所使用的公网访问地址。
:::

### 配置服务端

默认部署清单使用动态解析，不传递 `--e2b-domain`。如果 Helm Chart 或已有 Deployment 设置了域名，请将其清空
（例如使用 `--set-string e2b.domain=""`），或移除 `--e2b-domain` 参数以启用动态解析。

如果需要在通过 Helm 安装或升级 Sandbox Manager 时保留静态域名，请显式设置 `e2b.domain`：

```bash
helm install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --set e2b.domain=your.domain.com \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

配置静态覆盖时，该值必须与客户端的 `E2B_DOMAIN` 相同。

### 配置客户端

您可以通过设置环境变量来配置客户端的 E2B_DOMAIN：

```shell
export E2B_DOMAIN=your.domain.com
```

### 特殊场景

#### 1. 带端口的域名

对于 Ingress 网关不使用默认 HTTP 端口（80 或 443）的场景。例如，如果域名是 `your.domain.com:8080`：

- 客户端：设置 `E2B_DOMAIN=your.domain.com:8080`。
- 服务端使用动态解析时，会自动保留请求主机名中的端口。
- 服务端使用静态覆盖时，设置 `--e2b-domain=your.domain.com:8080`。
- Ingress 的主机名规则使用不带端口的 `your.domain.com`。

#### 2. 多域名

如果需要通过多个域名暴露同一个 `sandbox-manager`：

1. 保持 `--e2b-domain` 为空，启用服务端动态解析。
2. 为每个公网入口配置 DNS 和 Ingress 路由。原生协议使用默认的基于主机名的路由时，需要配置 `api.<domain>` 与
   `*.<domain>`；使用私有协议时，需要配置基础域名。
3. 准备覆盖所有入口的证书。[自签名证书](../best-practices/use-self-signed-cert.md)与
   [cert-manager](../best-practices/cert-manager.md) 指南均提供了多域名示例。
4. 将每个客户端的 `E2B_DOMAIN` 设置为该客户端实际连接的域名。

此场景不要设置静态 `--e2b-domain`，因为静态值会覆盖所有请求主机名。

## 如何安装证书

如果您需要通过 HTTPS 访问 sandbox-manager，需要安装 TLS 证书。建议使用可信证书。如果您没有可信证书，可以使用自签名证书，请参考以下文档：

- [使用自签名证书](../best-practices/use-self-signed-cert.md)
- [使用 cert-manager](../best-practices/cert-manager.md)

您可以使用以下命令安装证书：

```shell
# ingress-nginx 示例，根据您的 ingress controller 进行调整
kubectl create secret tls sandbox-manager-tls \
          --cert=fullchain.pem \
          --key=privkey.pem -n sandbox-system
```

## 推荐的 sandbox-manager 集成方式

### 1. 使用原生协议集成

> 这是最标准、最原生的集成方式，但配置门槛也最高，通常需要手动部署。

1. 客户端配置环境变量：
    ```shell
    # 如果服务端配置了静态 E2B 域名，其值必须与客户端相同
    export E2B_DOMAIN=your.domain.com
    export E2B_API_KEY=<your-api-key>
    ```
2. 在您的 DNS 提供商处将通配符域名 `*.your.domain.com` 解析到 sandbox-manager 的 ingress 端点

3. 安装通配符证书 `*.your.domain.com`

### 2. 私有协议从集群外通过 HTTPS 访问

> 这种方式可以降低部署门槛，将泛域名替换为了单域名。

1. 客户端配置环境变量：
    ```shell
    # 如果服务端配置了静态 E2B 域名，其值必须与客户端相同
    export E2B_DOMAIN=your.domain.com
    export E2B_API_KEY=<your-api-key>
    ```
2. 修改客户端：
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=True)
    ```
3. 在您的 DNS 提供商处将单个域名 `your.domain.com` 解析到 sandbox-manager 的 ingress 端点
4. 安装单个域名证书 `your.domain.com`

### 3. 使用 E2B URL 参数实现集群外访问

> 通过 E2B SDK 原生支持的 URL 参数从集群外直接访问 `sandbox-manager` 和 `sandbox-gateway`，无需通配符 DNS 或
> 私有协议 patch。要求 `e2b >= 2.7.0`。

1. 准备两个公网域名，并将其分别路由到对应的 Ingress 端点：
   - `api.your.domain.com`：路由到 `sandbox-manager` 的控制面域名。`api.` 前缀是固定的，不能替换为其他子域名。
   - `gateway.your.domain.com`：路由到 `sandbox-gateway` 的数据面域名。该域名可以使用任意子域名，推荐使用
     `gateway`。
2. 安装同时覆盖 `api.your.domain.com` 和 `gateway.your.domain.com` 的 TLS 证书。
3. 配置客户端环境变量：
    ```shell
    export E2B_API_URL="https://api.your.domain.com"
    export E2B_SANDBOX_URL="https://gateway.your.domain.com"
    export E2B_API_KEY=<your-api-key>
    ```
4. 使用 E2B SDK 创建 Sandbox，无需额外 patch：
    ```python
    from e2b import Sandbox

    # E2B_API_URL 和 E2B_SANDBOX_URL 会自动从环境变量读取
    sandbox = Sandbox()
    print(sandbox.get_host(8000))  # 获取 Sandbox 内服务的访问地址
    sandbox.kill()
    ```

:::tip 集群内配置
当客户端、`sandbox-manager` 和 `sandbox-gateway` 位于同一集群时，可以直接使用 Kubernetes Service 地址，
好处是无需配置公网 DNS 解析：

```shell
export E2B_API_URL="http://sandbox-manager.sandbox-system.svc.cluster.local:8080"
export E2B_SANDBOX_URL="http://sandbox-gateway.sandbox-system.svc.cluster.local:7788"
export E2B_API_KEY=<your-api-key>
```

如果未安装外置的 `sandbox-gateway`，可以将 `E2B_SANDBOX_URL` 改为使用 `sandbox-manager`，继续使用其内置
流量代理，但不推荐这种方式。
:::

> ⚠️ **限制说明**：上层库 `e2b-code-interpreter` 和 `e2b-desktop` 的以下扩展功能不读取 `E2B_API_URL` /
> `E2B_SANDBOX_URL` 环境变量，因此不支持这种 URL 参数接入方式：
>
> **e2b-code-interpreter：**
> - `Sandbox.run_code`
> - `Sandbox.create_code_context`
> - `Sandbox.remove_code_context`
> - `Sandbox.list_code_contexts`
> - `Sandbox.restart_code_context`
>
> **e2b-desktop：**
> - `desktop.stream.get_url`
> - `desktop.stream.start`

### 4. 私有协议集群内访问

> 这种方式可以快速自动化部署，无需配置域名和证书。仅推荐用于 E2E 测试场景，或经过严格评估后使用。

1. 确保客户端（agent）和 sandbox-manager 在同一集群中。
2. 客户端配置环境变量：
    ```shell
    # 如果服务端配置了静态 E2B 域名，其值必须与客户端相同
    export E2B_DOMAIN=sandbox-manager.sandbox-system.svc.cluster.local
    export E2B_API_KEY=<your-api-key>
    ```
3. 修改客户端并禁用 HTTPS：
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=False)
    ```

### 5. 端口转发 sandbox-manager 到本地机器

1. 客户端配置环境变量：
    ```shell
    # 如果服务端配置了静态 E2B 域名，其值必须与客户端相同
    export E2B_DOMAIN=localhost
    export E2B_API_KEY=<your-api-key>
    ```
2. 端口转发 sandbox-manager 到本地机器：
   ```shell
   sudo kubectl port-forward services/sandbox-manager 80:7788 -n sandbox-system
   ```
3. 修改客户端：
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=False)
    ```

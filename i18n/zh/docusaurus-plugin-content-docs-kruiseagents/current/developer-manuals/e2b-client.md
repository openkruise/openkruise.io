# 通过 E2B SDK 使用 OpenKruise Agents Sandbox

OpenKruise Agents 的 sandbox-manager 组件支持两种 E2B 接入协议：原生 E2B 协议和私有协议。

私有协议与原生协议的对比：

> 假设您配置的 E2B_DOMAIN 是 `your.domain.com`

| 原生协议                             | 私有协议                                    | 
|----------------------------------|-----------------------------------------|
| api.your.domain.com              | your.domain.com/kruise/api              | 
| \<port\>-\<sid\>.your.domain.com | your.domain.com/kruise/\<sid\>/\<port\> |

## 关于 E2B_DOMAIN 环境变量的重要说明

**非常重要**：sandbox-manager 的 `E2B_DOMAIN` 环境变量必须与客户端设置相同。
您可以使用 `kubectl edit deploy -n sandbox-system sandbox-manager` 编辑你的 deployment 修改服务端环境变量。

### 如何配置服务端（sandbox-manager）的 E2B_DOMAIN

您可以在运行 `make deploy-sandbox-manager` 之前通过编辑以下文件来配置服务端的 E2B_DOMAIN：

- [configuration_patch.yaml](https://github.com/openkruise/agents/blob/master/config/sandbox-manager/configuration_patch.yaml)
- [ingress_patch.yaml](https://github.com/openkruise/agents/blob/master/config/sandbox-manager/ingress_patch.yaml)

[//]: # (TODO: Add new deployment methods like Helm here when available)

### 如何配置客户端（E2B SDK）的 E2B_DOMAIN

您可以通过设置环境变量来配置客户端的 E2B_DOMAIN：

```shell
export E2B_DOMAIN=your.domain.com
```

### 特殊场景

#### 1. 带端口的域名

对于 Ingress 网关不使用默认 HTTP 端口（80 或 443）的场景。例如，如果域名是 `your.domain.com:8080`：

- 客户端：设置环境变量 `E2B_DOMAIN=your.domain.com:8080`
- 服务端：
  -
  在 [configuration_patch.yaml](https://github.com/openkruise/agents/blob/master/config/sandbox-manager/configuration_patch.yaml)
  中，**保留端口**，将 E2B Domain 设置为 `your.domain.com:8080`
    -
  在 [ingress_patch.yaml](https://github.com/openkruise/agents/blob/master/config/sandbox-manager/ingress_patch.yaml)
  中，**不要保留端口**，将 `replace.with.your.domain` 替换为 `your.domain.com`

## 如何安装证书

如果您需要通过 HTTPS 访问 sandbox-manager，需要安装 TLS 证书。建议使用可信证书。如果您没有可信证书，可以使用自签名证书，请参考以下文档：

- [use-self-signed-cert.md](../best-practices/use-self-signed-cert.md)
- [cert-manager.md](../best-practices/cert-manager.md)

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
    # sandbox-manager 容器的 E2B_DOMAIN 环境变量应设置为相同值
    export E2B_DOMAIN=your.domain.com
    export E2B_API_KEY=<your-api-key>
    ```
2. 在您的 DNS 提供商处将通配符域名 `*.your.domain.com` 解析到 sandbox-manager 的 ingress 端点

3. 安装通配符证书 `*.your.domain.com`

### 2. 私有协议从集群外通过 HTTPS 访问

> 这种方式可以降低部署门槛，将泛域名替换为了单域名。

1. 客户端配置环境变量：
    ```shell
    # sandbox-manager 容器的 E2B_DOMAIN 环境变量应设置为相同值
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

### 3. 私有协议集群内访问

> 这种方式可以快速自动化部署，无需配置域名和证书。仅推荐用于 E2E 测试场景，或经过严格评估后使用。

1. 确保客户端（agent）和 sandbox-manager 在同一集群中。
2. 客户端配置环境变量：
    ```shell
    # sandbox-manager 容器的 E2B_DOMAIN 环境变量应设置为相同值
    export E2B_DOMAIN=sandbox-manager.sandbox-system.svc.cluster.local
    export E2B_API_KEY=<your-api-key>
    ```
3. 修改客户端并禁用 HTTPS：
    ```python
    from kruise_agents.patch_e2b import patch_e2b
    patch_e2b(https=False)
    ```

### 4. 端口转发 sandbox-manager 到本地机器

1. 客户端配置环境变量：
    ```shell
    # sandbox-manager 容器的 E2B_DOMAIN 环境变量应设置为相同值
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

## E2B 兼容性说明

| API分类  | API                                                   | 参数兼容程度 | 说明                             |
|--------|-------------------------------------------------------|--------|--------------------------------|
| 生命周期管理 | create                                                | 部分兼容   | 网络访问控制待实现                      |
|        | get\_info                                             | 完全兼容   |                                |
|        | list                                                  | 完全兼容   |                                |
|        | kill                                                  | 完全兼容   |                                |
|        | pause                                                 | 完全兼容   | 考虑到容器生态的效率问题，当前 pause 的实现为异步接口 |
|        | connect                                               | 完全兼容   |                                |
| 代码运行   | run\_code                                             | 完全兼容   | 主容器内需要运行e2b-code-interpreter   |
| 命令执行   | commands.run                                          | 完全兼容   | 需要通过运行时注入envd组件                |
| 文件系统   | read/write                                            | 完全兼容   | 需要通过运行时注入envd组件                |
|        | upload\_url/download\_url                             | 不支持    | 通过预签名url上传下载待实现                |
| 生命周期事件 | https://api.e2b.app/events/sandboxes/{sbx.sandbox_id} | 不支持    | 生命周期事件待实现                      |
| 模板管理   |                                                       | 不支持    | 模板管理待实现，推荐使用容器镜像来替代模板的功能       |
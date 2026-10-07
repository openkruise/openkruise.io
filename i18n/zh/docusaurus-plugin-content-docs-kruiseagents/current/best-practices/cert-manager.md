# 使用 cert-manager 管理 sandbox-manager 自签证书

Sandbox Controller 与 Sandbox Manager chart 已原生支持 cert-manager：所有证书签发都由 `enableTLS`（默认
`false`）控制，该开关要求集群安装 cert-manager 以及用于 CA Bundle 的 trust-manager。本文介绍如何启用该集成并验证
签发的证书。全部 TLS 开关说明见
[TLS（cert-manager / trust-manager）](../installation.md#tlscert-manager--trust-manager)。

## 前提条件

1. Sandbox Controller 与 Sandbox Manager 已安装在**同一 Namespace**（默认 `sandbox-system`）。共享根 CA 由
   Sandbox Controller chart 持有，Sandbox Manager chart 仅按名称引用 CA Issuer。
2. 确保具备 kubectl 和 helm 命令行工具并具有相应权限。

## 步骤一：安装 cert-manager 与 trust-manager

如果您还没有安装，请参考官方文档：

- [cert-manager 安装](https://cert-manager.io/docs/installation/)
- [trust-manager 安装](https://cert-manager.io/docs/trust/trust-manager/installation/)

trust-manager 通过 Bundle 资源把共享 CA 以 `ca.crt` ConfigMap 的形式分发出去，供工作负载作为信任锚复用。

## 步骤二：在 Chart 中启用 TLS

### 2.1 创建共享根 CA（Sandbox Controller）

为 Sandbox Controller 设置 `enableTLS=true` 进行升级。在默认的 `tls.createCA=true` 下，chart 会创建共享根 CA：

```bash
helm upgrade --install agents-sandbox-controller openkruise/agents-sandbox-controller \
  -n sandbox-system \
  --set enableTLS=true
```

将创建以下资源：

- 自签名引导 Issuer `sandbox-selfsigned-issuer` → CA Certificate `sandbox-ca` → 签发 Issuer
  `sandbox-signing-issuer`，所有叶子证书都由它签发。
- CA 密钥对 Secret `sandbox-ca-key-pair`（`tls.crt` / `tls.key`）。
- trust-manager Bundle `sandbox-ca-bundle`，以 `ca.crt` ConfigMap 分发 CA。

### 2.2 签发 Ingress 证书（Sandbox Manager）

在同一 Namespace 中为 Sandbox Manager 设置 `enableTLS=true` 进行升级：

```bash
helm upgrade --install agents-sandbox-manager openkruise/agents-sandbox-manager \
  -n sandbox-system \
  --set enableTLS=true \
  --set e2b.domain=<your-domain> \
  --set e2b.adminApiKey=<your-api-key> \
  --set ingress.className=<your-ingress-class>
```

将创建 Certificate `sandbox-manager-ingress-cert`，其证书存放在 Ingress 的 `spec.tls` 已引用的 Secret
`sandbox-manager-tls`（`ingress.certSecretName`）中。证书覆盖 `api.<domain>`、`*.<domain>` 和 `<domain>`；使用多个
域名时，通过 `--set e2b.extraDomains={example2.com}` 添加即可，无需手动编辑 `dnsNames`。

叶子证书默认有效期为 90 天（`tls.certDuration: 2160h`），到期前 15 天续期
（`tls.certRenewBefore: 360h`），由 cert-manager 自动完成，无需手动轮换。

:::note
仅设置 `enableTLS=true` 时只会签发 Ingress 证书。runtime mTLS、peer mTLS 和 EPE 证书是相互独立的按需开关，详见
[TLS（cert-manager / trust-manager）](../installation.md#tlscert-manager--trust-manager)。
:::

## 步骤三：验证证书状态

检查证书是否正确创建和颁发：

```bash
kubectl get certificates -n sandbox-system
kubectl describe certificate sandbox-manager-ingress-cert -n sandbox-system
kubectl describe secret sandbox-manager-tls -n sandbox-system
```

检查 Ingress 状态：

```bash
kubectl get ingress sandbox-manager -n sandbox-system
kubectl describe ingress sandbox-manager -n sandbox-system
```

## 步骤四：配置客户端信任

由于您使用的是自签名证书，客户端需要信任根 CA 证书。

### 4.1 获取 CA 证书

```bash
kubectl get secret sandbox-ca-key-pair -n sandbox-system -o jsonpath='{.data.tls\.crt}' | base64 -d > ca.crt
```

### 4.2 配置客户端

客户端需要设置环境变量 `SSL_CERT_FILE` 为获取的 CA 证书路径：

```bash
export SSL_CERT_FILE=/path/to/ca.crt
```

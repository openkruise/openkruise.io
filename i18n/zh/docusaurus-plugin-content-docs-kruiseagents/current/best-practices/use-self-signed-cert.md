# 通过自签名证书以 E2B 协议访问 sandbox-manager

本文给出了一种通过自签证书访问 sandbox-manager 的最佳实践，包括如何通过一个优化的脚本创建证书、如何将证书安装到集群中、如何配置
E2B 客户端。

## 前提条件

1. 集群中已经完成 sandbox-manager 的安装
2. 确保 sandbox-manager 的 ingress 已经生效（具备 entrypoint），您可以通过以下命令确认，Address 列应当不为空：

```shell
$ kubectl get ingress sandbox-manager -n sandbox-system
```

## 步骤一：创建证书

通过脚本 [generate-certificate.sh](https://github.com/openkruise/agents/blob/master/hack/generate-certificates.sh) 创建自签名证书。
您可以通过以下命令查看脚本的使用方法。

```shell
$ bash generate-certificates.sh --help

Usage: generate-certificates.sh [OPTIONS]

Options:
  -d, --domain DOMAIN     Add a base domain; may be specified multiple times
                          DOMAIN and *.DOMAIN will both be added
  -o, --output DIR        Specify output directory (default: .)
  -D, --days DAYS         Specify certificate validity days (default: 365)
      --ca-key PATH       Reuse an existing CA private key
      --ca-cert PATH      Reuse the matching existing CA certificate; it must
                          be authorized to sign and valid for --days
  -h, --help              Show this help message

Examples:
  generate-certificates.sh -d example1.com -d example2.com
  generate-certificates.sh --domain example1.com --domain example2.com --days 730
  generate-certificates.sh -d example.com --ca-key ca-key.pem --ca-cert ca-cert.pem
```

完成证书生成后，您会得到以下文件：

- fullchain.pem：服务器证书公钥
- privkey.pem：服务器证书私钥
- ca-fullchain.pem：CA 证书公钥
- ca-privkey.pem：CA 证书私钥

对于通过 `--domain` 传入的每个基础域名，脚本都会将该域名及其通配符域名加入证书 SAN。例如，
`-d example1.com -d example2.com` 生成的证书会覆盖 `example1.com`、`*.example1.com`、`example2.com` 和
`*.example2.com`，可供同一个 `sandbox-manager` 服务多个原生协议或私有协议 E2B 入口。

默认情况下，每次执行都会创建新的 CA。如果需要使用同一信任根签发新的服务器证书，请同时通过 `--ca-key` 和
`--ca-cert` 传入已有的 CA 私钥与证书。该 CA 必须在所请求的有效期内保持有效，并具备证书签发权限。

## 步骤二：安装证书

通过以下命令将服务器证书挂载到集群的 Ingress 上：

```shell
$ kubectl create secret tls sandbox-manager-tls \
          --cert=fullchain.pem \
          --key=privkey.pem -n sandbox-system
```

证书的生效可能会有一些延迟，具体生效效率由您的 ingress 控制器决定。

## 步骤三：配置客户端信任

客户端需要设置环境变量 `SSL_CERT_FILE` 为步骤一中生成的 CA 公钥（ca-fullchain.pem）文件路径：

```shell
$ export SSL_CERT_FILE=/path/to/ca-fullchain.pem
```

---
id: credential-injection
title: 凭证注入
---

# 凭证注入

凭证注入让 Sandbox 在调用上游 API 时使用一份长期有效的提供方凭证，而该凭证不会进入 Sandbox。出口代理会从
Kubernetes Secret 中解析凭证，并在匹配的出站请求离开集群前改写它，因此工作负载和 Agent 代码只会看到自己的占位
请求头。

注入由平台管理员通过 `SecurityProfile`（命名空间级）或 `GlobalSecurityProfile`（集群级）配置。两者共用相同的
`tokenTransformation` 动作和相同的、基于 Secret 的凭证来源。

## 工作原理

1. 管理员将上游凭证保存在一个 Kubernetes Secret 中。
2. `SecurityProfile` 选择 Sandbox Pod，并定义一条 `tokenTransformation` 规则，其 `credentialRef.secret` 指向该
   Secret。
3. 对每个匹配的出站请求，出口代理读取 Secret、渲染目标请求头的值，并在转发到上游前替换该请求头。

由于凭证是在代理处按请求解析的，它不会写入 Pod spec、Sandbox 环境或 Sandbox metadata，轮换 Secret 也无需重启
Sandbox 即可生效。

## 创建凭证 Secret

对于 `ApiKey` 转换，Secret 在数据键 `apiKey` 下保存凭证：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-api-credentials
  namespace: agent-demo
type: Opaque
stringData:
  apiKey: "sk-example-1234567890"
```

## 配置 SecurityProfile

下面的 Profile 选择带有 `app: agent` 标签的 Pod，并将 Secret 值注入到 `api.example.com` 上 `/v1/` 前缀下 HTTPS
请求的 `authorization` 请求头中：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: example-api-credentials
  namespace: agent-demo
spec:
  selector:
    matchLabels:
      app: agent
  rules:
    - name: inject-example-api-key
      match:
        - domains:
            - api.example.com
          schemes:
            - https
          paths:
            - type: Prefix
              value: /v1/
      actions:
        tokenTransformation:
          type: ApiKey
          failStrategy: Block
          credentialRef:
            secret:
              name: example-api-credentials
          apiKey:
            targetHeaders:
              names:
                - authorization
            value:
              template: "Bearer {{ .Token }}"
```

关键字段：

- `credentialRef.secret.name` 是要读取的 Secret。`credentialRef.secret.namespace` 可选：省略时，`SecurityProfile`
  使用自身所在命名空间，`GlobalSecurityProfile` 使用所选 Pod 的命名空间。`credentialRef` 下只能设置 `secret` 或
  `credentialProvider` 中的一个；本页只介绍 `secret`。
- `apiKey.targetHeaders.names` 列出要覆盖的请求头。`targetHeaders.cel` 则用于动态选择请求头名称。
- `apiKey.value.template` 渲染替换后的值。`{{ .Token }}` 是从 Secret 解析出的凭证，模板还可以读取 `.Header`、
  `.Request`、`.Pod`、`.Profile`、`.Rule` 和 `.Inputs`。
- `failStrategy` 默认为 `Block`（失败即关闭）：如果无法解析 Secret，请求会被拒绝，而不是在不带凭证的情况下转发。

## 细粒度的按 Sandbox 注入

注入在两个层级上限定范围。Profile 的 `selector` 选择其作用到的 Sandbox（Pod），因此每个 Sandbox 只会获得为它选定
的凭证。在单个 Sandbox 内，规则的 `match` 块将注入限定到特定流量，因此一份 Secret 只会附加到应当携带它的请求上：

- `domains` 为必填，支持精确主机（`api.example.com`）或单个前导通配（`*.example.com`）。
- `paths`、`methods`、`schemes`、`ports`、`headers` 和 `queryParams` 可进一步收窄匹配范围。单个 `match` 条目内的
  字段是 AND 关系；多个 `match` 条目之间是 OR 关系。

这种按主机的粒度与 E2B 的 **per-host request transforms（按主机请求转换）** 模型一致，后者也是按目标主机来组织
转换规则。当你通过 E2B 接口驱动 Sandbox 时，可以在 `network.rules` 字段中表达同样的主机级限定：

```json
{
  "templateID": "code-interpreter",
  "network": {
    "allowOut": ["api.example.com"],
    "rules": {
      "api.example.com": [
        {"transform": {"headers": {"X-Tenant": "demo"}}}
      ]
    }
  }
}
```

按主机配合使用这两种机制：管理员定义的 `SecurityProfile` 将凭证注入到选定的主机，而 E2B 的按主机转换为同一目标
设置非敏感的、按主机限定范围的请求头。

:::caution
E2B 原生的按主机转换会按原文保存请求头的值，并且 `tokenTransformation` 在 E2B 内联规则中会被拒绝。因此按主机请求
转换只适用于非凭证请求头；凭证始终应通过 `SecurityProfile` 从 Secret 注入。参见
[E2B 网络访问控制](./e2b-network-controls.md)。
:::

## 清理

删除 Profile 即可停止注入：

```console
$ kubectl delete securityprofile example-api-credentials --namespace agent-demo
```

删除 Profile 会停止改写请求，但不会吊销已经签发的凭证。请尽可能让 Secret 值保持短期有效，并在提供方侧轮换以应对
紧急情况。

---
id: e2b-network-controls
title: E2B 网络访问控制
---

# E2B 网络访问控制

E2B 创建和网络更新 API 可以限制出站目标，并按域名设置或删除请求头。规则会随 Sandbox 保存，因此池化 Sandbox
每次交付时都会使用本次领取所指定的规则。

下文每一节都会同时给出原始 API JSON 和等价的 E2B Python SDK 调用。SDK 会把蛇形命名字段 `allow_out`、`deny_out`
和 `rules` 序列化为 API 使用的驼峰命名 `allowOut`、`denyOut` 和 `rules`，因此两种写法描述的是同一套策略。SDK 安装
以及客户端连接 `sandbox-manager` 的方式见 [Python 客户端](../e2b-client.md)。

## 创建时配置网络规则

`network` 对象同时支持四层可达性列表和按域名生效的七层请求转换：

```json
{
  "templateID": "code-interpreter",
  "network": {
    "allowOut": ["api.example.com"],
    "denyOut": ["10.0.0.0/8"],
    "rules": {
      "api.example.com": [
        {"transform": {"headers": {"X-Tenant": "demo"}}}
      ]
    }
  }
}
```

`allowOut` 支持 IP、CIDR 和具体 FQDN，不支持通配域名；`denyOut` 只支持 IP 和 CIDR。`rules` 仅转换匹配的
HTTP 流量，不会自行放通网络，因此当平台没有管理员级策略时，还需要单独允许目标地址。

`network.rules` 中的请求头名称会被规范为小写。设置请求头时，会替换名称相同且大小写不敏感的已有请求头。

等价的 Python SDK 调用通过 `Sandbox.create` 的 `network` 参数传入同一套策略：

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    template="code-interpreter",
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["10.0.0.0/8"],
        "rules": {
            "api.example.com": [
                {"transform": {"headers": {"X-Tenant": "demo"}}}
            ]
        },
    },
)
```

## 出站策略示例

由于 `deny_out` 只接受 IP 和 CIDR，按域名过滤需要写成允许列表：在 `allow_out` 中列出需要访问的目标，再用
`0.0.0.0/0` 拒绝其余全部流量。允许项优先于拒绝项，因此列出的目标仍可访问。

只允许单个域名，阻断其他所有流量：

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
    }
)
```

在允许列表中混合域名、单个 IP 和 CIDR：

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com", "storage.example.com", "8.8.8.8", "1.1.1.0/24"],
        "deny_out": ["0.0.0.0/0"],
    }
)
```

只阻断特定网段，其余互联网流量仍可访问：

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "deny_out": ["10.0.0.0/8", "169.254.169.254"],
    }
)
```

:::caution 不支持通配域名
与上游 E2B 不同，`allow_out` 不接受 `*.example.com` 这类通配写法，请逐一列出需要访问的具体 FQDN。不支持的上游字段
`egressProxy` 和 `maskRequestHost` 同样会被拒绝。
:::

目标可达后，可在 `rules` 中按域名添加转换规则来注入请求头。`rules` 本身不会放通网络，因此仍需把该域名保留在
`allow_out` 中：

```python
from e2b import Sandbox

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
        "rules": {
            "api.example.com": [
                {"transform": {"headers": {"X-Tenant": "demo"}}}
            ]
        },
    }
)
```

## 创建时删除请求头

如需删除请求头或声明有序规则链，可通过保留的 `e2b.agents.kruise.io/security-rules` metadata 字段传入 JSON
数组：

```json
[
  {
    "name": "sanitize-example",
    "match": [{"domains": ["api.example.com"]}],
    "actions": {
      "headerManipulation": {
        "set": [{"name": "x-tenant", "value": "demo"}],
        "remove": ["x-debug-token"]
      }
    }
  }
]
```

请求头值会按原文保存，不要用该机制传递凭据。规则名称必须唯一；显式规则中的请求头名称必须已是小写，同一名称
不能同时出现在 `set` 和 `remove` 中。

metadata 的值必须是字符串，因此用 `json.dumps` 序列化规则链，再通过 `metadata` 参数传入：

```python
import json

from e2b import Sandbox

security_rules = [
    {
        "name": "sanitize-example",
        "match": [{"domains": ["api.example.com"]}],
        "actions": {
            "headerManipulation": {
                "set": [{"name": "x-tenant", "value": "demo"}],
                "remove": ["x-debug-token"],
            }
        },
    }
]

sandbox = Sandbox.create(
    network={
        "allow_out": ["api.example.com"],
        "deny_out": ["0.0.0.0/0"],
    },
    metadata={
        "e2b.agents.kruise.io/security-rules": json.dumps(security_rules),
    },
)
```

## 更新运行中的 Sandbox

通过 E2B 管理 API 请求 `PUT /sandboxes/{sandboxID}/network`，请求体可以替换 `allowOut`、`denyOut` 和
`rules`：

```json
{
  "allowOut": ["api.example.com", "storage.example.com"],
  "denyOut": ["10.0.0.0/8"],
  "rules": {
    "api.example.com": [
      {"transform": {"headers": {"X-Tenant": "production"}}}
    ]
  }
}
```

更新时，省略 `rules` 会保留已有七层规则，传入 `{}` 会清空规则，非空对象则完整替换规则。所有校验都会在修改
Sandbox 前完成。不支持的上游字段 `egressProxy` 和 `maskRequestHost` 会被明确拒绝，不会被静默忽略。

`update_network` 方法会把同样的请求体发送到 `PUT /sandboxes/{sandboxID}/network`：

```python
# 同时替换允许列表、拒绝列表和七层规则
sandbox.update_network({
    "allow_out": ["api.example.com", "storage.example.com"],
    "deny_out": ["10.0.0.0/8"],
    "rules": {
        "api.example.com": [
            {"transform": {"headers": {"X-Tenant": "production"}}}
        ]
    },
})

# 不重建 Sandbox，直接收紧运行中实例的出站策略
sandbox.update_network({
    "allow_out": ["api.example.com"],
    "deny_out": ["0.0.0.0/0"],
})

# 保留已有允许/拒绝列表，仅清空七层转换规则链
sandbox.update_network({"rules": {}})
```

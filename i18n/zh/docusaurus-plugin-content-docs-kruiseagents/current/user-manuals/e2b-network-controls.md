---
id: e2b-network-controls
title: E2B 网络访问控制
---

# E2B 网络访问控制

E2B 创建和网络更新 API 可以限制出站目标，并按域名设置或删除请求头。规则会随 Sandbox 保存，因此池化 Sandbox
每次交付时都会使用本次领取所指定的规则。

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

---
id: traffic-access-token
title: 流量访问令牌轮换
---

# 流量访问令牌轮换

启用 Traffic JWT 鉴权的 Sandbox 会获得用于数据面请求的流量访问令牌。OpenKruise Agents 可以返回令牌过期时间、
签发替换令牌，并通过定制 E2B 客户端补丁自动刷新令牌。

该能力仅适用于 JWT 流量令牌。旧版不透明令牌仍可使用，但不支持基于过期时间自动刷新。API Key 和 Traffic JWT 的
配置方法请参见 [API Key 与团队管理](../api-keys-and-teams.md)。

## 客户端要求

自动刷新要求 Python 3.10 或更高版本、`e2b>=2.35.0,<2.38.0` 和
`e2b-code-interpreter>=2.9.0,<2.10.0`。在常规 OpenKruise Agents E2B 补丁之后启用独立的令牌补丁：

```python
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.patch_traffic_token import patch_traffic_access_token

patch_e2b(https=False)
patch_traffic_access_token()
```

同步和异步 envd HTTP/RPC 请求以及 Code Interpreter Jupyter 请求都会在发送前读取最新令牌。客户端会在 JWT
过期前刷新，并提供 UTC 格式的过期时间。同一 `sandbox-manager` 实例上同一 Sandbox 的并发刷新会合并为一次签发。

## 主动刷新

应用可以在下一次数据面请求前主动获取新令牌：

```python
token = sandbox.refresh_traffic_access_token(force=True)
print(token.expires_at)

token = await async_sandbox.refresh_traffic_access_token(force=True)
```

私有协议端点为 `POST /kruise/api/sandboxes/{sandboxID}/traffic-access-token`，响应中的
`trafficAccessTokenExpiration` 使用 RFC 3339 格式。调用方必须拥有目标 Sandbox；无权访问和资源不存在均返回
`404`。

## 失败处理与升级顺序

- 刷新失败时，只要旧令牌仍有效，客户端会继续使用旧令牌；令牌过期后，补丁会在本地失败，不发送已失效的凭据。
- `Sandbox.connect(sandbox_id)` 只负责恢复或延长 Sandbox，不签发令牌。连接一个没有令牌的 JWT 鉴权 Sandbox
  后，补丁会在第一次数据面请求前刷新令牌。
- `sandbox-manager` 默认保留旧版的长有效期。缩短 `--traffic-access-token-validity` 前，必须先部署支持刷新的客户端；
  不支持刷新的客户端会在短期令牌过期后失去访问能力。
- 流量令牌属于凭据，不要写入日志或 Sandbox metadata。

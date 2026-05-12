---
id: api-keys-and-teams
title: API Keys 与 Teams
sidebar_label: 用户管理
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 用户管理

`sandbox-manager` 提供了一组兼容 E2B 协议的 HTTP 接口，用于管理 **API Keys** 与 **Teams**。通过这些接口，集群管理员与租户可以
以编程方式颁发 API Key、查询自己所属的 Teams，并吊销不再使用的 Key。

> 这些接口**没有**配套的 E2B SDK，也没有对应的 Kubernetes CRD，必须直接通过 HTTP 协议调用。本文档为每个接口提供了
> `curl` 和 Python `requests` 两种请求示例。

## 概述

### Teams

**Team** 是 API Key 的授权边界。在 OpenKruise Agents 中，Team 的身份由 Team Name 唯一标识，并且
**Team Name 会直接映射到一个 Kubernetes Namespace**：

- 内置的 `admin` Team 是集群级的，由管理员掌控，它所持有的 admin API Key 会随 `sandbox-manager` 启动一同初始化。
- 其他任何 Team Name 都必须对应一个**已经存在**的 Kubernetes Namespace。当租户为 Team `foo` 创建 API Key 时，Namespace
  `foo` 必须预先存在，否则请求会被拒绝。

由于 Namespace 的唯一性已经提供了足够的隔离边界，因此 Team 的 UUID 仅作为展示用元数据保留，**不**参与鉴权和资源查找。

### API Keys

**API Key** 是某个 Team 长期持有的访问凭证。客户端在调用 `sandbox-manager` 任意接口时，都必须通过 `X-API-KEY` 请求头携带它。
API Key 决定了：

- 调用方属于哪个 Team；
- 调用方是普通租户还是集群管理员（即是否属于 `admin` Team）；
- 调用方可以访问哪些 Sandbox——普通租户只能访问由自身 API Key 创建的 Sandbox，管理员则可以访问全部 Sandbox。

### 授权模型

| 角色                 | 列出本 Team 的 Key | 列出 Teams    | 为本 Team 创建 Key | 为其他 Team 创建 Key | 删除本 Team 的 Key | 删除 admin Key |
|--------------------|----------------|-------------|----------------|-----------------|----------------|--------------|
| 管理员（`admin` Team） | ✅              | ✅           | ✅              | ✅               | ✅              | ❌（被拒绝）       |
| 普通租户               | ✅              | ✅（仅自身所在 Team） | ✅              | ❌               | ✅              | ❌            |

内置的 admin Key 出于保护集群可控性的考虑，**在任何情况下都不能被删除**。

## 前置条件

- `sandbox-manager` 必须开启鉴权（默认：`--e2b-enable-auth=true`）。当鉴权关闭时，`/teams` 与 `/api-keys` 系列接口不会被注册。
- 你必须拥有一个合法的 API Key。admin Key 会在 `sandbox-manager` 启动时通过 `--e2b-admin-key` 参数产生或传入；普通租户需要
  由管理员颁发第一个 Key。

## 访问地址约定

`sandbox-manager` 同时支持 **原生 E2B 协议** 与 OpenKruise Agents 的 **私有协议**。下面的示例假设你配置的 `E2B_DOMAIN` 为
`your.domain.com`。

| 协议                  | Base URL                                |
|---------------------|-----------------------------------------|
| 原生 E2B 协议            | `https://api.your.domain.com`           |
| 私有协议（OpenKruise）    | `https://your.domain.com/kruise/api`    |

> 关于域名、证书等更多信息，请参考 [E2B SDK 接入文档](./e2b-client.md)。

下面所有示例默认使用**原生协议**的 URL。如果你使用私有协议，把 Base URL 替换即可，例如
`GET /api-keys` 对应为 `GET https://your.domain.com/kruise/api/api-keys`。

## 接口列表

| Method   | Path             | 说明                                                   |
|----------|------------------|------------------------------------------------------|
| `GET`    | `/teams`         | 列出当前用户可见的 Team                                       |
| `GET`    | `/api-keys`      | 列出当前用户所属 Team 的所有 API Key                            |
| `POST`   | `/api-keys`      | 为当前用户所属 Team 创建 API Key（管理员可以为其他 Team 创建）            |
| `DELETE` | `/api-keys/{id}` | 按 UUID 删除 API Key                                    |

所有请求都必须带上请求头 `X-API-KEY: <your-api-key>`。

### List Teams

返回当前用户可以看到的 Team。普通租户只能看到自己所属的 Team；管理员可以看到所有 Team。

响应体结构：

```json
[
  {
    "teamID":    "550e8400-e29b-41d4-a716-446655449999",
    "name":      "admin",
    "apiKey":    "sk-xxxxxxxx",
    "isDefault": true
  }
]
```

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/teams"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.get(
    "https://api.your.domain.com/teams",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
resp.raise_for_status()
print(resp.json())
```

  </TabItem>
</Tabs>

### List API Keys

返回当前调用方所属 Team 下的所有 API Key。响应中**不会**返回 Key 的原文，只会返回脱敏后的元数据（如
`mask.maskedValuePrefix`、`mask.maskedValueSuffix` 等）。

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/api-keys"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.get(
    "https://api.your.domain.com/api-keys",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
resp.raise_for_status()
for key in resp.json():
    print(key["id"], key["name"], key["mask"])
```

  </TabItem>
</Tabs>

### Create API Key

创建新的 API Key。响应体里的 `key` 字段为刚刚生成的**明文 Key**，且**只返回这一次**，请务必保存——后续无法再通过接口取回。

请求体：

| 字段         | 类型     | 是否必填 | 说明                                                                       |
|------------|--------|------|--------------------------------------------------------------------------|
| `name`     | string | 是    | Key 的可读名称。                                                               |
| `teamName` | string | 否    | 目标 Team 名称。默认为调用者自身所属的 Team；只有 admin 可以把它指向其他 Team。                      |

> 当 `teamName` 指向非 admin 的 Team 时，对应的 Kubernetes Namespace 必须已经存在。

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS -X POST \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"name": "ci-runner", "teamName": "team-a"}' \
  "https://api.your.domain.com/api-keys"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.post(
    "https://api.your.domain.com/api-keys",
    headers={
        "X-API-KEY": os.environ["E2B_API_KEY"],
        "Content-Type": "application/json",
    },
    json={"name": "ci-runner", "teamName": "team-a"},
    timeout=10,
)
resp.raise_for_status()
created = resp.json()
# 请立刻持久化 created["key"]——后续无法再次获取。
print(created["id"], created["key"])
```

  </TabItem>
</Tabs>

### Delete API Key

通过 UUID 删除指定的 API Key。普通租户只能删除本 Team 名下的 Key；管理员可以删除除 admin Key 以外的任何 Key。
尝试删除内置的 admin Key 会返回 `403 Forbidden`。

<Tabs>
  <TabItem value="curl" label="curl">

```shell
API_KEY_ID="<uuid-from-list-api-keys>"

curl -sS -X DELETE \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/api-keys/${API_KEY_ID}"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

api_key_id = "<uuid-from-list-api-keys>"
resp = requests.delete(
    f"https://api.your.domain.com/api-keys/{api_key_id}",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
# 成功时返回 204 No Content。
resp.raise_for_status()
```

  </TabItem>
</Tabs>

## 错误码

| HTTP 状态码 | 场景                                                                  |
|----------|---------------------------------------------------------------------|
| `400`    | 请求体不合法、`teamName` 缺失，或目标 Namespace 不存在                              |
| `401`    | 未携带 `X-API-KEY` 或 Key 无效                                             |
| `403`    | 非管理员对其他 Team 做写操作，或尝试删除 admin Key                                   |
| `404`    | 指定 UUID 的 API Key 不存在                                                |
| `500`    | 后端错误（例如 Kubernetes API 不可用、MySQL 不可达等）                              |

## API Key 存储后端配置

`sandbox-manager` 为 API Key 提供了两种可插拔的存储后端，通过 `sandbox-manager` 的命令行参数选择
（参见 [cmd/sandbox-manager/main.go](https://github.com/openkruise/agents/blob/master/cmd/sandbox-manager/main.go)）。

### 公共参数

| 参数                   | 默认值        | 说明                                                                                                   |
|----------------------|------------|------------------------------------------------------------------------------------------------------|
| `--e2b-enable-auth`  | `true`     | 是否开启 API Key 鉴权。关闭后，`/teams` 和 `/api-keys` 系列接口不会被注册。                                              |
| `--e2b-admin-key`    | *(随机生成)*   | 启动时注入的 admin API Key。为空时会随机生成一个 UUID；生产环境建议固定为一个稳定值。                                              |
| `--e2b-key-storage`  | `secret`   | 存储后端类型。可选：`secret`、`mysql`。                                                                         |

### 后端：`secret`（默认）

将所有 API Key 作为一个名为 `e2b-key-store` 的 Kubernetes `Secret` 存储在 `sandbox-manager` 的系统 Namespace（通常是
`sandbox-system`）下。这是零依赖的默认方案，适用于试用或单租户场景。

示例参数：

```shell
sandbox-manager \
  --e2b-enable-auth=true \
  --e2b-admin-key=sk-admin-xxxx \
  --e2b-key-storage=secret
```

> Secret 的读写使用由 `--system-namespace` 指定的系统 Namespace。

### 后端：`mysql`

通过 GORM 将 API Key 持久化到 MySQL。**MySQL 中只存储 `HMAC-SHA256(pepper, rawKey)` 的哈希，绝不会落盘明文 Key**。
该后端推荐用于需要审计与水平扩容的多租户部署。

| 参数                                            | 来源           | 是否必填 | 说明                                                                                                            |
|-----------------------------------------------|--------------|------|---------------------------------------------------------------------------------------------------------------|
| `--e2b-key-storage=mysql`                     | 命令行参数        | 是    | 选择 MySQL 后端。                                                                                                  |
| `E2B_KEY_STORAGE_DSN`                         | 环境变量         | 是    | GORM 兼容的 MySQL DSN，例如 `user:pass@tcp(mysql:3306)/e2b?charset=utf8mb4&parseTime=True&loc=Local`。                |
| `E2B_KEY_HASH_PEPPER`                         | 环境变量         | 是    | HMAC-SHA256 哈希使用的 pepper。一旦轮换将导致所有存量 Key 失效，请作为长期机密妥善保管。                                                   |
| `--e2b-key-storage-disable-schema-auto-update`| 命令行参数（默认 `false`） | 否    | 为 `true` 时跳过 GORM 的自动迁移，仅保留 admin Team/Key 的初始化逻辑。适用于 DDL 由外部迁移工具管理的场景。                                    |

示例部署（MySQL 模式）：

```shell
export E2B_KEY_STORAGE_DSN='e2b:secretpwd@tcp(mysql.sandbox-system.svc:3306)/e2b?charset=utf8mb4&parseTime=True&loc=Local'
export E2B_KEY_HASH_PEPPER='please-rotate-me-in-production'

sandbox-manager \
  --e2b-enable-auth=true \
  --e2b-admin-key=sk-admin-xxxx \
  --e2b-key-storage=mysql \
  --e2b-key-storage-disable-schema-auto-update=false
```

注意事项：

- `E2B_KEY_STORAGE_DSN` 与 `E2B_KEY_HASH_PEPPER` 必须通过环境变量传入（不通过参数），便于通过 Kubernetes `Secret` 注入而不暴露在
  命令行上。
- 当鉴权关闭（`--e2b-enable-auth=false`）时，上述参数与环境变量都会被忽略，Key 存储后端不会被初始化。
- 当 `--e2b-key-storage=mysql` 但 DSN 或 pepper 为空时，`sandbox-manager` 会在启动时 fail fast。

### 后端选型建议

| 场景                                           | 推荐后端                                                       |
|----------------------------------------------|------------------------------------------------------------|
| 本地开发、试用、单租户                                  | `secret`                                                   |
| 生产多租户、多副本共享同一份 Key 存储                        | `mysql`                                                    |
| Schema 由外部迁移工具管理                             | `mysql` + `--e2b-key-storage-disable-schema-auto-update=true` |

#### `secret` 与 `mysql` 的容量分界线

Kubernetes 对 `Secret` 有单对象 **1 MiB 的硬性上限**，`metadata`、`managedFields` 和 `Data` 共同占用这份配额。
在 `secret` 模式下，每条 API Key 会以 UUID 为 key、JSON 为 value 写入 `Data`，**单条大约 0.4 – 0.6 KB**。扣除
`metadata`/`managedFields` 等开销后，实际可用空间约 **~900 KB**；而且每次增/删都是全量重写 `Secret`，随着写入次数循稀 `managedFields` 还会持续膨胀，在逼近上限前性能就已经越来越差。

考虑未来字段扩展、团队增长等 headroom，保守建议如下：

| API Key 总数       | 建议                                                                  |
|------------------|---------------------------------------------------------------------|
| **≤ 500**        | `secret` 可以安全使用。                                                 |
| **500 – 1000**   | 尚能运行，但应开始规划向 `mysql` 迁移。                                    |
| **> 1000**       | 必须切换到 `mysql`，否则趋近 1 MiB 硬性上限后写入会直接失败。                                 |

> 经验法则：单集群预计 API Key 总数**超过几百条**时，建议从一开始就选 `mysql`，避免后续做破坏性迁移。

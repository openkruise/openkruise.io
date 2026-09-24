---
id: sandbox-access
title: 访问沙箱
---

# 访问沙箱

当 Sandbox 被交付后（参见 [Sandbox 申领](./sandbox-claim.md)），客户端会向其发送流量，用于运行代码、执行命令、
读写文件，或访问 Sandbox 内某个端口上监听的服务。本页介绍入方向流量如何到达 Sandbox、由哪些安全凭证保护，以及可用于
连接的三种 SDK，并说明如何通过端口转发将流量映射到本地进行调试。

域名、TLS 和多域名部署的细节请参见[使用 E2B SDK](./e2b-client.md)。本页聚焦于访问链路本身，相关内容以链接方式引用，
不再重复。

## 入方向流量架构

OpenKruise Agents 将入方向流量拆分为**控制面**和**数据面**，从而保证控制面的问题不会中断已经流向运行中 Sandbox 的
业务流量。

| 平面 | 组件 | 职责 | 原生协议地址 | 私有协议地址 |
|-------|-----------|----------------|----------------|--------------------------|
| 控制面 | `sandbox-manager` | E2B/MCP 管理 API：create、kill、pause、resume、connect、list、API Key | `api.<domain>` | `<domain>/kruise/api` |
| 数据面 | `sandbox-gateway` | 将流量代理进运行中的 Sandbox（envoy filter） | `<port>-<sandboxID>.<domain>` | `<domain>/kruise/<sandboxID>/<port>` |

```text
                          控制面（管理）
   E2B / Runtime SDK ───────► api.<domain> ──► sandbox-manager ──► Kubernetes API
                                                     │
                                                     │ 交付 / 查询 Sandbox
                                                     ▼
                          数据面（进入 Sandbox）
   E2B / Runtime SDK ───► <port>-<sandboxID>.<domain> ──► sandbox-gateway ──► agent-runtime (envd) : 49983
```

- **控制面**使用 [API Key](./api-keys-and-teams.md) 鉴权，返回 Sandbox 地址及其数据面凭证。
- **数据面**承载真正的命令、文件、代码执行以及自定义服务流量。`sandbox-gateway` 将每个请求路由到目标 Sandbox，默认
  转发到监听 `49983` 端口的 `agent-runtime`（envd）sidecar。命令和文件操作需要注入 `agent-runtime`，参见
  [Runtime 注入](./runtime-injection.md)。

### 数据面路由

`sandbox-gateway` 按以下优先级解析目标 Sandbox：

1. **基于 Header（优先）。** 设置 `e2b-sandbox-id`（必填）和 `e2b-sandbox-port`（可选，默认为 envd 端口 `49983`）。
   Header 路由不依赖 DNS 泛解析，也是各 SDK 底层使用的方式。
2. **基于域名（兜底）。** 原生协议主机名 `<port>-<sandboxID>.<domain>`，或私有协议路径
   `<domain>/kruise/<sandboxID>/<port>`。

`<sandboxID>` 默认为 `namespace--name`；启用[短 Sandbox ID](./sandbox-id.md) 后则为不透明的短 ID。请将其视为精确匹配的
不透明值。

> 原生协议基于主机名的路由需要泛域名 DNS（`*.<domain>`）和泛域名证书。私有协议只需要单一域名和单一证书，降低了测试与
> 快速集成的部署门槛。

## 访问凭证

不同凭证保护不同的平面。它们都属于敏感信息：不要写入日志，也不要存进 Sandbox metadata。

| 凭证 | 保护对象 | Header / 环境变量 | 来源 |
|------------|----------|--------------|--------|
| API Key | 控制面 | `X-API-KEY` 头、`E2B_API_KEY` 环境变量 | 以 `adminApiKey` 引导，或通过 [API Key 端点](./api-keys-and-teams.md)按团队签发 |
| envd 访问令牌 | 数据面（静态） | `X-Access-Token` | create 响应中以 `envdAccessToken` 返回；与 Sandbox 生命周期绑定 |
| 流量访问令牌 | 数据面（JWT） | `E2B-Traffic-Access-Token` | 短期、可刷新的 JWT；参见[流量访问令牌轮换](./security/traffic-access-token.md) |
| Runtime 令牌 | 数据面（直连 envd） | `X-Access-Token` | 存储在 Sandbox CR 注解 `agents.kruise.io/runtime-access-token` 上 |

- **API Key。** 每一次对 `sandbox-manager` 的管理调用都要设置 `X-API-KEY`。原生 E2B SDK 从 `E2B_API_KEY` 读取。管理员
  Key 拥有更高权限；日常工作请优先使用按团队划分范围的 Key。E2B SDK >= 2.25.0 会在客户端校验 `e2b_[0-9a-f]+` 的
  Key 格式；旧版 Key 的处理方式参见 [API Key 与团队管理](./api-keys-and-teams.md#e2b-sdk-key-格式兼容性)。
- **envd 访问令牌（静态）。** 与 Sandbox 绑定的长期不透明令牌。原生 E2B SDK 会在 `run_code`、`commands`、`files` 调用中
  自动注入，因此大多数客户端无需直接处理它。它在 Sandbox 被删除前一直有效。
- **流量访问令牌（JWT）。** 静态令牌的可选替代，短期、可刷新，按 Sandbox 启用。它将重放风险限制在 JWT 有效期窗口内。刷新
  行为和客户端要求见[流量访问令牌轮换](./security/traffic-access-token.md)。
- **Runtime 令牌。** 仅由 [Runtime SDK](#3-runtime-sdk直连-envd) 使用，它直连 envd。当具备 kubeconfig 或集群内访问能力时，
  Runtime 客户端可以直接从 Sandbox CR 注解读取该令牌。

## 访问方式

根据部署方式以及所需的 E2B 能力范围选择合适的 SDK。

| 方式 | 包 | 路由 | 适用场景 |
|--------|---------|---------|----------|
| 原生 E2B SDK | `e2b`、`e2b-code-interpreter` | 域名 / Header | 标准生产集成，完整 E2B API |
| 私有协议 SDK | `kruise_agents.patch_e2b` | 路径（`/kruise/...`） | 单域名部署、测试、快速集成 |
| Runtime SDK | `github.com/openkruise/agents-api/runtime` | 直连 envd | 直接对运行中的 Sandbox 执行命令和文件操作 |

安装 Python 客户端：

```bash
# 原生 E2B SDK
pip install "e2b" "e2b-code-interpreter"

# OpenKruise Agents 私有协议扩展，来自 agents-api 仓库。
# 将 <version> 替换为 agents-api 的发布标签。
pip install "git+https://github.com/openkruise/agents-api.git@<version>#subdirectory=e2b/python"
```

### 1. 原生 E2B SDK

标准集成方式。客户端从控制面解析 Sandbox，并通过 `*.<domain>`（或等价的 Header）发送数据面流量。设置域名和 API Key 后，
按常规方式使用 SDK：

```shell
export E2B_DOMAIN=your.domain.com
export E2B_API_KEY=<your-api-key>
```

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="code-interpreter")
print("sandbox id:", sbx.sandbox_id)

execution = sbx.run_code("print('hello, world')")
print("run code result:", execution)

# Sandbox 内监听 8000 端口的服务访问 URL
print(sbx.get_host(8000))

sbx.kill()
```

`envdAccessToken` 会自动返回并注入到 `run_code`、`commands`、`files` 调用中，无需手动处理令牌。原生协议部署需要泛域名 DNS
和泛域名证书，参见[使用 E2B SDK](./e2b-client.md#1-使用原生协议集成)。

### 2. 私有协议 SDK

私有协议只保留单一域名并按路径路由（`<domain>/kruise/<sandboxID>/<port>`），因此只需要一张证书。请在导入 E2B Sandbox 类
**之前**应用补丁：

```shell
export E2B_DOMAIN=your.domain.com
export E2B_API_KEY=<your-api-key>
```

```python
from kruise_agents.patch_e2b import patch_e2b
patch_e2b(https=True)   # 从集群外通过 HTTPS 访问

from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="code-interpreter")
execution = sbx.run_code("print('hello, world')")
print(execution)
sbx.kill()
```

- 对于集群内访问或本地端口转发（TLS 在别处终止）的场景，使用 `patch_e2b(https=False)`。
- 若要在 E2B SDK >= 2.25.0 上复用旧版（非 `e2b_`）API Key，传入 `validate_key=False`：
  `patch_e2b(https=True, validate_key=False)`。
- 若需要自动刷新 JWT，在 `patch_e2b` 之后追加流量令牌补丁，参见
  [流量访问令牌轮换](./security/traffic-access-token.md)。

### 3. Runtime SDK（直连 envd）

Runtime SDK 绕过 E2B 协议，直接操作运行中 Sandbox 内的 envd 服务，用于命令执行和文件操作。它只使用 `Scheme` + `Domain`
（没有协议路径），并通过 `X-Access-Token` 携带 Runtime 令牌鉴权。这是一个 Go 客户端；完整 API 参见
[Runtime 客户端](../developer-manuals/runtime-client.md)，Java 绑定参见
[Runtime 客户端（Java）](../developer-manuals/runtime-client-java.md)。

```go
package main

import (
	"context"
	"fmt"

	"github.com/openkruise/agents-api/runtime"
)

func main() {
	ctx := context.Background()

	// 集群内："sandbox-gateway.sandbox-system.svc:7788"
	// 本地调试："127.0.0.1:7788"（端口转发之后）
	domain := "sandbox-gateway.sandbox-system.svc:7788"

	// NewFromK8s 会从 Sandbox CR 注解 agents.kruise.io/runtime-access-token
	// 解析 sandboxID 和 Runtime 令牌。
	c, err := runtime.NewFromK8s(ctx, "default", "your-sandbox-name",
		runtime.WithDomain(domain),
	)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	res, _ := c.Commands.Run(ctx, "uname -a")
	fmt.Println(res.Stdout)
}
```

当没有 kubeconfig 访问能力时，使用 `runtime.New` 构建客户端，并通过 `runtime.WithRuntimeToken(<token>)` 显式传入令牌。

## 端口转发到本地调试

端口转发将集群内的 Service 映射到 `localhost`，让你无需公网 DNS 和证书即可在本地工作站上迭代。

### E2B / 私有协议客户端

将数据面转发到 `sandbox-gateway` 的本地 80 端口，并保留一个 `sandbox-manager` 转发用于控制面，使 `create`、`connect`、
`kill` 仍能解析。通过 `E2B_API_URL` 和 `E2B_SANDBOX_URL` 将两个平面指向各自的本地地址（参见
[使用 E2B SDK](./e2b-client.md#3-使用-e2b-url-参数实现集群外访问)）：

```shell
export E2B_API_KEY=<your-api-key>
# 控制面（create / connect / kill）-> sandbox-manager
export E2B_API_URL="http://localhost:8080"
# 数据面（命令 / 文件 / 服务端口）-> sandbox-gateway
export E2B_SANDBOX_URL="http://localhost"

kubectl port-forward services/sandbox-manager 8080:8080 -n sandbox-system
sudo kubectl port-forward services/sandbox-gateway 80:7788 -n sandbox-system
```

```python
from e2b import Sandbox

sbx = Sandbox.create(template="code-interpreter")
print(sbx.commands.run("echo hello").stdout)   # 数据面经由转发后的 gateway
sbx.kill()
```

:::note
上层库 `e2b-code-interpreter` 和 `e2b-desktop` 不读取 `E2B_API_URL` / `E2B_SANDBOX_URL`，因此该本地调试配置请使用基础
`e2b` Sandbox。
:::

### Runtime SDK 客户端

转发 `sandbox-gateway`，并让客户端指向本地地址：

```shell
kubectl port-forward services/sandbox-gateway 7788:7788 -n sandbox-system
```

```go
c, _ := runtime.NewFromK8s(ctx, "default", "your-sandbox-name",
	runtime.WithDomain("127.0.0.1:7788"),
	runtime.WithScheme("http"),
)
```

## 相关文档

- [使用 E2B SDK](./e2b-client.md) —— 域名、TLS、多域名及所有集成方式
- [API Key 与团队管理](./api-keys-and-teams.md) —— 控制面凭证与 Key 管理
- [流量访问令牌轮换](./security/traffic-access-token.md) —— JWT 数据面令牌与刷新
- [E2B 网络管控](./security/e2b-network-controls.md) —— 出方向限制与 Header 变换
- [Runtime 注入](./runtime-injection.md) —— 启用 `agent-runtime` 以支持命令和文件 API
- [Runtime 客户端](../developer-manuals/runtime-client.md) —— 完整的 Runtime SDK 参考

---
title: 运行 E2B Code Interpreter 沙箱
---

本教程演示如何通过 OpenKruise Agents 部署 [E2B](https://e2b.dev/) code-interpreter 沙箱，并用 E2B Python SDK
端到端地调用它。本页所有命令与代码片段均可直接复制执行，只需先解析 `<占位符>` 的取值。

## 前置条件

- 已按[安装](../installation.md)文档部署 OpenKruise Agents（Sandbox Controller、Sandbox Manager、Sandbox
  Gateway），并通过安装文档的全部验证检查。请保留安装时设置的 `e2b.adminApiKey`——它就是下文使用的
  `E2B_API_KEY`。
- 运行 SDK 的机器上装有 Python 3.9 或更新版本（`python3 --version`）。
- bash 环境（Linux、macOS 或 WSL）。
- 网络可达性要求：模板部署需要从 Docker Hub 拉取镜像（`e2bdev/code-interpreter`、`openkruise/agent-runtime`）
  并从 `raw.githubusercontent.com` 下载清单；SDK 安装需要访问 PyPI 和 `github.com`。中国大陆无法直连
  Docker Hub 的节点需先配置镜像/仓库代理。

## 1. 部署沙箱模板（SandboxSet）

沙箱从**模板**创建。模板就是一个 `SandboxSet`：`sandbox-manager` 会自动把集群中的每个 `SandboxSet`
识别为模板，模板名等于 `SandboxSet` 的名称（本例为 `code-interpreter`）。部署模板会预热沙箱实例，使
`Sandbox.create` 达到秒级甚至亚秒级返回。

### 1.1 下载并调整 SandboxSet 清单

```bash
# 下载官方示例（需要能访问 raw.githubusercontent.com）
curl -L -o sandboxset.yaml \
  https://raw.githubusercontent.com/openkruise/agents/master/examples/code_interpreter/sandboxset.yaml
```

**应用前必须调整 `storageClassName`（多数集群需要）。** 该示例面向阿里云编写，在 `volumeClaimTemplates`
中固定了 `storageClassName: alicloud-disk-ssd`。在其他任何集群上，PVC 会一直 `Pending`，预热 Pod 永远不会启动。
先查看集群可用的 StorageClass：

```bash
kubectl get storageclass
```

然后编辑 `sandboxset.yaml`：

- 将 `alicloud-disk-ssd` 替换为列表中的某个 StorageClass（例如 kind 的 `standard`、AWS 的 `gp2`/`gp3`），
  或整行删除以使用默认 StorageClass。
- 如果集群完全没有动态存储供给，可以删除整个 `volumeClaimTemplates` 段——本示例中该卷未被任何容器挂载，
  删除不影响教程运行。

> 清单使用了两个 Docker Hub 镜像：`openkruise/agent-runtime:preview-v0.0.2`（注入 E2B `envd` 组件的 init
> 容器）和 `e2bdev/code-interpreter:latest`（沙箱运行时）。请确保你的节点能拉取这两个镜像。

### 1.2 应用并等待预热完成

```bash
kubectl apply -f sandboxset.yaml

# 持续观察，直到 READY 达到 2/2（Ctrl+C 停止观察）：
kubectl get sandboxset code-interpreter -w
```

示例会预热 2 个副本。继续之前确认两者都已运行：

```bash
kubectl get sandboxes
```

### 1.3 使用自定义镜像

`agent-runtime` 提供与 E2B 兼容的接口，支持命令执行、文件操作、代码运行等功能。如果官方镜像不能满足需求，可以替换为自定义镜像。

### 1.4 跨命名空间部署模板

为了在大规模预热时降低集群负载，可以在每个目标命名空间中创建同名 `SandboxSet`，实现跨命名空间的模板部署。

## 2. 接入 E2B SDK

### 2.1 选择接入方式

下文示例使用 `run_code` 等 code-interpreter 扩展功能，这些功能**要求**使用 `E2B_DOMAIN` + 私有协议 patch
的接入方式——`E2B_API_URL`/`E2B_SANDBOX_URL` 方式不支持它们（限制说明见
[E2B SDK 集成](../user-manuals/e2b-client.md)）。

**方式 A —— 用 `kubectl port-forward` 快速验证（无需域名、DNS、证书）。** 在独立终端中保持以下命令运行
（Linux 上绑定 80 端口需要 `sudo`）：

```bash
kubectl port-forward service/agents-sandbox-manager 80:7788 -n sandbox-system
```

在第二个终端配置客户端：

```shell
# port-forward 的目标是 manager Service；以 localhost 作为 E2B 域名
export E2B_DOMAIN=localhost
export E2B_API_KEY=<your-api-key>   # 安装时设置的 e2b.adminApiKey
```

**方式 B —— 生产环境使用真实域名。** 配好 DNS 与 TLS 证书后导出 `E2B_DOMAIN=your.domain.com`，参见
[E2B SDK 集成](../user-manuals/e2b-client.md) 中"集群外私有协议 HTTPS 访问"的说明。

### 2.2 安装 SDK

```bash
python3 -m venv .venv && source .venv/bin/activate

# sandbox-manager 每日 E2E 回归测试所用的版本：
pip install "e2b==2.8.1" "e2b-code-interpreter==2.4.1"

# OpenKruise 私有协议 patch（需要能访问 github.com）：
pip install "git+https://github.com/openkruise/agents-api.git@v0.6.0-alpha2#subdirectory=e2b/python"
```

### 2.3 每个示例必需的前导代码

在每个脚本开头、创建或连接任何沙箱之前运行一次：

```python
import os

from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

# 官方 E2B SDK 会在本地校验 Key 必须以 "e2b_" 开头；OpenKruise 管理员 Key 不是
# 这种格式。encode_for_e2b_sdk 以确定性方式包装该 Key（服务端会解包；原始 Key
# 对其他客户端依然有效）。
os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])

# port-forward 走明文 HTTP，因此 https=False。生产域名配 TLS 时改用 https=True。
patch_e2b(https=False)
```

`patch_e2b` 会在内存中将 SDK 的 URL 重写为 OpenKruise 私有协议（管理 API 走 `<E2B_DOMAIN>/kruise/api`，
沙箱流量走 `<E2B_DOMAIN>/kruise/<sandbox-id>/<port>`）；磁盘上的 E2B 代码不会被修改。如果使用
`e2b>=2.25.0`，也可以向 `patch_e2b` 传 `validate_key=False` 来代替包装 Key。

## 3. 运行示例

### 3.1 创建并删除沙箱

从预热池中分配一个沙箱。分配完成后，`SandboxSet` 会立即创建新的沙箱实例补充池子。

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

# 模板名必须与 SandboxSet 名称一致
sbx = Sandbox.create(template="code-interpreter", timeout=300)
print(f"sandbox id: {sbx.sandbox_id}")

sbx.kill()
print(f"sandbox {sbx.sandbox_id} killed")
```

预期输出（id 每次不同）：

```text
sandbox id: i1234567890abcdef
sandbox i1234567890abcdef killed
```

### 3.2 执行代码

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    sbx.run_code("print('hello world')")
```

预期输出包含 code-interpreter 的执行结果，stdout 中打印 `hello world`。

### 3.3 文件操作

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    with open(os.path.abspath(__file__), "rb") as file:
        sbx.files.write("/home/user/my-file", file)
    file_content = sbx.files.read("/home/user/my-file")
    print(file_content)
```

### 3.4 命令执行

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    result = sbx.commands.run('echo hello; sleep 1; echo world', on_stdout=lambda data: print(data),
                              on_stderr=lambda data: print(data))
    print(result)
```

### 3.5 暂停与恢复

> 注意：目前在暂停与恢复过程中保留内存状态，仅阿里云 ACS 支持

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    # 暂停沙箱
    sbx.run_code("a = 1")
    sbx.beta_pause()

    # 恢复沙箱
    sbx.connect()
    sbx.run_code("print(a)")
```

## 故障排查

| 症状 | 可能原因 | 处理方法 |
|---|---|---|
| `Sandbox.create` 报找不到模板 | 尚未部署 `SandboxSet`，或其名称与 `template` 参数不一致 | `kubectl get sandboxset`——名称必须完全是 `code-interpreter`（或传入你的模板名） |
| 预热 Pod 因 PVC `Pending` 而 `Pending` | 示例中的 `storageClassName` 在集群中不存在 | 按 [1.1](#11-下载并调整-sandboxset-清单) 的说明调整 |
| 预热 Pod `ImagePullBackOff` | 节点无法拉取 Docker Hub 镜像 | 为 `e2bdev/code-interpreter` 与 `openkruise/agent-runtime` 配置可达的镜像仓库/代理 |
| SDK 报 API Key 格式错误 | 缺少 `encode_for_e2b_sdk` 前导代码，或在 `e2b<2.25.0` 上使用了 `validate_key=False` | 补上 [2.3](#23-每个示例必需的前导代码) 的前导代码 |
| 请求超时 | `kubectl port-forward` 未运行，或 `E2B_DOMAIN` 不匹配 | 重新运行 port-forward 命令并导出 `E2B_DOMAIN=localhost`；生产环境必须与安装的 `e2b.domain` 一致 |
| 返回 `401` | `E2B_API_KEY` 与安装时的 `e2b.adminApiKey` 不一致 | 与安装时使用的值核对 |

---
title: Go 客户端
---

## 依赖导入

在你的 `go.mod` 中引入 `agents-api` 依赖：[版本查看](https://github.com/openkruise/agents-api/releases)

```
require github.com/openkruise/agents-api <tag>
```

| 包           | 导入路径                                     | 定位                                                                                                        |
|-------------|------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **e2b**     | `github.com/openkruise/agents-api/e2b`   | **管理客户端（Management Client）**：Sandbox 生命周期管理（Create / Connect / Pause / Kill）+ 容器内操作（Commands / Files / CodeInterpreter） |
| **runtime** | `github.com/openkruise/agents-api/runtime` | **运行时客户端（Runtime Client）**：直接与 sandbox 内的 runtime 服务通信（被 `e2b` 内部使用，也可单独引入）       |

---

## 包结构

```
e2b/
├── api/                              #   OpenAPI 生成的 REST 客户端（sandbox 管理）
├── sandbox.go                        #   Sandbox 结构体：Create / Connect / Pause / Kill
├── sandbox_api.go                    #   底层 REST 客户端（SandboxApi）：List / GetInfo / Kill / ...
└── config.go                         #   ConnectionConfig：Protocol / Scheme / Domain / API URL
```

---

## 快速开始

```go
package main

import (
	"context"
	"fmt"
	"github.com/openkruise/agents-api/e2b"
	"log"
)

func main() {
	ctx := context.Background()

	sb, err := e2b.Create(ctx, "code-interpreter",
		e2b.WithConfig(
			e2b.WithAPIKey("your-api-key"),
			e2b.WithDomain("your.domain.com"),
		),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer sb.Close(ctx)

	res, _ := sb.Commands.Run(ctx, "echo hello")
	fmt.Println(res.Stdout)

	sb.Files.MakeDir(ctx, "/tmp/demo")

	exec, _ := sb.CodeInterpreter.RunCode(ctx, "import math\nmath.sqrt(16)")
	fmt.Println(exec.Text()) // 4
}
```

完整的演示可参考：[管理客户端示例](https://github.com/openkruise/agents-api/blob/master/examples/e2b-example/main.go)

---

## 连接配置

### Scheme 与 Protocol

连接行为通过 `ConnectionConfig` 控制，由 **Scheme** 和 **Protocol** 两个正交维度决定 URL 形态。

#### Protocol（路由协议）

| 值              | 常量                    | API URL                          | Sandbox URL                                     |
|----------------|-----------------------|----------------------------------|-------------------------------------------------|
| **Native（默认）** | `e2b.ProtocolNative`  | `https://api.<domain>`           | `https://<port>-<sandboxID>.<domain>`           |
| **Private**    | `e2b.ProtocolPrivate` | `<scheme>://<domain>/kruise/api` | `<scheme>://<domain>/kruise/<sandboxID>/<port>` |

- **Native**：基于子域名路由，对应原生公网部署
- **Private**：基于路径前缀（`/kruise/...`）通过统一网关路由，适用于私有化或本地端口转发场景

#### Scheme（协议头）

| 值                 | 适用场景              |
|-------------------|-------------------|
| **`"https"`（默认）** | 生产环境 / 公网         |
| **`"http"`**      | 本地端口转发、内网无 TLS 调试 |

#### ConnectionConfigOption 列表

通过 `e2b.NewConnectionConfig(opts...)` 或在 `Create/Connect` 中嵌入 `WithConfig(...)` 应用：

| 选项                                    | 说明                                                |
|---------------------------------------|---------------------------------------------------|
| `WithAPIKey(key string)`              | API Key，写入请求头 `X-API-Key`                         |
| `WithDomain(domain string)`           | 域名，默认 `your.domain.com`                           |
| `WithScheme(scheme string)`           | URL scheme，默认 `https`                             |
| `WithProtocol(p Protocol)`            | 路由协议，默认 `ProtocolNative`                          |
| `WithAPIURL(url string)`              | **最高优先级**：直接覆盖 API base URL，绕过 Protocol/Domain 拼装 |
| `WithSandboxBaseURL(url string)`      | **最高优先级**：直接覆盖 sandbox envd base URL              |
| `WithCodeInterpreterPort(port int)`   | code-interpreter 服务端口，默认 49999                      |
| `WithRequestTimeout(d time.Duration)` | HTTP 请求超时，默认 60s                                  |

#### 优先级

`WithAPIURL` / `WithSandboxBaseURL`（显式覆盖） > `WithProtocol` + `WithDomain` 拼装 > 环境变量 > 默认值

---

## 创建 / 连接 Sandbox

### 创建 Sandbox

从一个模板创建新 sandbox。`template` 为空时默认 `"code-interpreter"`。

```go
package main

import (
	"github.com/openkruise/agents-api/e2b"
)

func main() {
	sb, err := e2b.Create(ctx, "code-interpreter",
		e2b.WithConfig(
			e2b.WithAPIKey("xxx"),
			e2b.WithDomain("example.com"),
			e2b.WithProtocol(e2b.ProtocolPrivate),
		),
		e2b.WithTimeout(600),
		e2b.WithMetadata(map[string]string{"k": "v"}),
		e2b.WithEnvVars(map[string]string{"FOO": "1"}),
		e2b.WithAutoPause(true),
		e2b.WithSecure(true),
	)
}
```

### 连接 Sandbox

连接到已存在 sandbox。

```go
sb, err := e2b.Connect(ctx, "default--xxx-xxx",
e2b.WithConfig(e2b.WithAPIKey("xxx"), e2b.WithDomain("example.com")),
)
```

### SandboxOption 列表

| 选项                           | 说明                            |
|------------------------------|-------------------------------|
| `WithConfig(opts...)`        | 内嵌一组 `ConnectionConfigOption` |
| `WithTimeout(seconds int32)` | sandbox 存活超时，默认 300 秒         |
| `WithMetadata(map)`          | sandbox 元数据                   |
| `WithEnvVars(map)`           | 注入 sandbox 的环境变量              |
| `WithAutoPause(bool)`        | 是否启用自动暂停                      |
| `WithSecure(bool)`           | 启用安全模式                        |

### Sandbox 实例方法

| 方法                                     | 说明                       |
|----------------------------------------|--------------------------|
| `SandboxID() string`                   | 返回 sandbox ID            |
| `TemplateID() string`                  | 返回模板 ID                  |
| `GetInfo(ctx) (*SandboxInfo, error)`   | 获取 sandbox 详情            |
| `SetTimeout(ctx, timeout int32) error` | 修改超时时间                   |
| `Pause(ctx) (string, error)`           | 暂停                       |
| `Kill(ctx) (bool, error)`              | 销毁                       |
| `Close(ctx) error`                     | `Kill` 的别名，方便 `defer` 使用 |

`Sandbox` 暴露三个子模块：

- `sb.Commands` — 命令执行（`*Commands`）
- `sb.Files` — 文件系统（`*Filesystem`）
- `sb.CodeInterpreter` — 代码执行（`*runtime.CodeInterpreter`）

---

## Sandbox 管理 API（SandboxApi）

`SandboxApi` 是底层 REST 客户端，可在不创建具体 Sandbox 实例时单独使用（例如列出所有 sandbox）。

```go
api := e2b.NewSandboxApi(e2b.NewConnectionConfig(
e2b.WithAPIKey("xxx"),
e2b.WithDomain("example.com"),
))
```

| 方法                                                                           | 说明                                  |
|------------------------------------------------------------------------------|-------------------------------------|
| `List(ctx) ([]SandboxInfo, error)`                                           | 列出所有运行中的 sandbox                    |
| `GetInfo(ctx, sandboxID) (*SandboxInfo, error)`                              | 获取 sandbox 详情，404 返回 `not found` 错误 |
| `Kill(ctx, sandboxID) (bool, error)`                                         | 销毁 sandbox；`Debug` 模式下直接返回 `true`   |
| `SetTimeout(ctx, sandboxID, timeout int32) error`                            | 修改超时时间                              |
| `CreateSandbox(ctx, opts CreateSandboxOpts) (*SandboxCreateResponse, error)` | 底层创建接口                              |
| `ConnectSandbox(ctx, sandboxID, timeout int32) (*client.Sandbox, error)`     | 底层连接接口                              |
| `Pause(ctx, sandboxID) (string, error)`                                      | 暂停 sandbox                          |

---

## 命令执行（Commands）

通过 `sb.Commands` 操作容器内进程。底层走 envd 的 `Process` gRPC 服务。

### 方法

| 方法                                                          | 说明                                           |
|-------------------------------------------------------------|----------------------------------------------|
| `Run(ctx, cmd, opts...) (*CommandResult, error)`            | **前台执行**：启动命令并等待完成，返回 stdout/stderr/exitCode |
| `Start(ctx, cmd, opts...) (*CommandHandle, error)`          | **后台启动**：返回 handle，调用方决定何时 `Wait`            |
| `List(ctx) ([]ProcessInfo, error)`                          | 列出所有运行中的进程                                   |
| `Kill(ctx, pid uint32) (bool, error)`                       | 向指定 PID 发送 SIGKILL；进程已不存在返回 `false, nil`     |
| `SendStdin(ctx, pid uint32, data string) error`             | 向指定进程的 stdin 写入数据                            |
| `ConnectToProcess(ctx, pid uint32) (*CommandHandle, error)` | 重新连接到一个已运行的进程，订阅其后续输出                        |

`RunOpts` 字段

```go
type RunOpts struct {
Envs       map[string]string // 进程环境变量
Cwd        string            // 工作目录
Stdin      bool // 是否允许通过 SendStdin 写入
Background bool // 后台执行（保留字段）
OnStdout   func (string) // 流式 stdout 回调（前台执行）
OnStderr   func (string) // 流式 stderr 回调（前台执行）
}
```

> 命令统一通过 `/bin/bash -l -c <cmd>` 执行，保留登录环境。

`CommandHandle`

由 `Start` / `ConnectToProcess` 返回，用于交互或等待：

| 方法                                                 | 说明                                    |
|----------------------------------------------------|---------------------------------------|
| `Pid() uint32`                                     | 返回进程 PID                              |
| `Wait(onStdout, onStderr) (*CommandResult, error)` | 阻塞等待结束；非 0 退出码会附带 `*CommandExitError` |
| `Disconnect()`                                     | 断开订阅但**不杀进程**                         |
| `Kill() bool`                                      | 杀掉进程                                  |

`CommandResult` / `CommandExitError`

```go
type CommandResult struct {
Stdout   string
Stderr   string
ExitCode int32
Error    string
}

// 退出码非 0 时返回此错误（同时返回 *CommandResult）
type CommandExitError struct {
Stdout, Stderr string
ExitCode       int32
ErrorMessage   string
}
```

### 示例

```go
// 前台执行 + 流式输出
res, err := sb.Commands.Run(ctx, "ls -la /tmp", runtime.RunOpts{
Cwd:      "/tmp",
Envs:     map[string]string{"LANG": "C"},
OnStdout: func (line string) { fmt.Print(line) },
})

// 后台启动 + 主动 Kill
h, _ := sb.Commands.Start(ctx, "sleep 60")
fmt.Println("pid =", h.Pid())
h.Kill()
```

---

## 文件系统（Filesystem）

通过 `sb.Files` 操作容器内文件。元数据操作走 envd Filesystem gRPC，文件内容读写走 HTTP `/files` 端点。

### 方法

| 方法                                                                  | 说明                             |
|---------------------------------------------------------------------|--------------------------------|
| `List(ctx, path, depth...) ([]EntryInfo, error)`                    | 列出目录条目；`depth` 默认 1            |
| `Exists(ctx, path) (bool, error)`                                   | 路径是否存在（基于 `Stat`，404 返回 false） |
| `GetInfo(ctx, path) (*EntryInfo, error)`                            | 获取文件 / 目录信息                    |
| `MakeDir(ctx, path) (bool, error)`                                  | 递归创建目录；已存在返回 `false, nil`      |
| `Rename(ctx, oldPath, newPath) (*EntryInfo, error)`                 | 重命名 / 移动                       |
| `Remove(ctx, path) error`                                           | 删除文件或目录                        |
| `Read(ctx, path, user...) ([]byte, error)`                          | 读取文件内容（二进制）；`user` 默认 `"node"` |
| `ReadText(ctx, path, user...) (string, error)`                      | 读取文件内容（文本）                     |
| `Write(ctx, path, data []byte, user...) (*WriteInfo, error)`        | 写入文件内容（二进制）；自动创建父目录            |
| `WriteText(ctx, path, content string, user...) (*WriteInfo, error)` | 写入文件内容（文本）                     |

### 示例

```go
// 目录操作
sb.Files.MakeDir(ctx, "/tmp/work")

entries, _ := sb.Files.List(ctx, "/tmp")
for _, e := range entries {
fmt.Printf("%s %s (%d bytes)\n", e.Type, e.Name, e.Size)
}

sb.Files.Rename(ctx, "/tmp/work", "/tmp/done")
sb.Files.Remove(ctx, "/tmp/done")

// 文件内容读写
sb.Files.WriteText(ctx, "/tmp/hello.txt", "Hello, World!")
content, _ := sb.Files.ReadText(ctx, "/tmp/hello.txt")
fmt.Println(content) // Hello, World!
```

---

## 代码执行（CodeInterpreter）

通过 `sb.CodeInterpreter` 在 sandbox 内执行代码。它对接 code-interpreter 服务（独立端口，默认 49999），消费 NDJSON
事件流：每一行是一个 JSON 事件（stdout、stderr、result、error 等）。

> 被执行代码抛出的错误**不会**以 Go error 形式返回，而是通过 `Execution.Error` 报告；
> 只有传输层错误（HTTP 状态码、网络、ctx 取消）才会产生 Go error。

### 方法

| 方法                                                                     | 说明                                                              |
|------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `RunCode(ctx, code, opts...) (*Execution, error)`                        | **阻塞执行**：等待事件流结束，聚合所有事件到 `Execution`；回调实时触发 |
| `RunCodeStreaming(ctx, code, opts...) error`                             | **纯流式**：事件到达即处理，不缓冲全部输出，适合大规模执行的内存优化 |
| `CreateContext(ctx, cwd, language) (*Context, error)`                    | 创建隔离的执行上下文；空值回退到 `/home/user` 和 `python`               |
| `RemoveContext(ctx, contextID) error`                                   | 删除指定 ID 的上下文                                    |
| `ListContexts(ctx) ([]*Context, error)`                                 | 列出 sandbox 内所有执行上下文                              |

`RunCodeOpts` 字段

```go
type RunCodeOpts struct {
	Language  string            // "python"（默认）、"javascript"、"typescript"、"r"、"java"、"bash"；设置 ContextID 时忽略
	Cwd       string            // 工作目录；空值使用服务端默认
	Envs      map[string]string // 执行时的环境变量
	Timeout   time.Duration     // 服务端执行超时；零值使用服务端默认
	ContextID string            // 在已有上下文中执行（通过 CreateContext 创建）

	OnStdout  func(StdoutEvent)      // 每个 stdout 事件到达时触发
	OnStderr  func(StderrEvent)      // 每个 stderr 事件到达时触发
	OnResult  func(*Result)          // 每个 result 到达时触发
	OnError   func(*ExecutionError)  // 被执行代码抛错时触发
	OnEvent   func(ExecutionEvent)   // 每个流事件都触发
}
```

`Execution`

```go
type Execution struct {
	Results        []*Result       // 按到达顺序的可展示结果（text、html、png、json 等）
	Logs           Logs            // 按到达顺序的 Stdout / Stderr 分块
	Error          *ExecutionError // 被执行代码抛出的错误，成功时为 nil
	ExecutionCount int             // 当前上下文中的历史执行次数
}

// Text() 返回主结果的文本，没有时返回 ""
func (e *Execution) Text() string
```

`Result` 对应 Jupyter notebook 单元格输出，提供多种表示（`Text`、`HTML`、`Markdown`、`SVG`、`PNG`、`JPEG`、`PDF`、
`LaTeX`、`JSON`、`Javascript` 等）；只有被执行代码产生的格式会被填充。

### 上下文

使用相同 `ContextID` 执行的代码跨多次运行共享状态（变量、import）。通过 `CreateContext(ctx, cwd, language)`
创建，将其 `ID` 传入 `RunCodeOpts.ContextID`。设置 `ContextID` 时 `Language` 被忽略，因为上下文已固定语言。

### 示例

```go
// 1. 阻塞执行并聚合结果（Python 为默认语言）
exec, err := sb.CodeInterpreter.RunCode(ctx, "import math\nmath.sqrt(16)")
if err != nil {
	log.Fatal(err) // 仅传输层错误
}
fmt.Println(exec.Text())           // 4
for _, r := range exec.Results {
	fmt.Println(r.Formats())        // 例如 ["text"]
}
if exec.Error != nil {
	fmt.Println(exec.Error.Name)    // 例如 "ValueError"
}

// 2. 选项 + 流式回调（JavaScript）
exec, err = sb.CodeInterpreter.RunCode(ctx, "console.log('js hello, ' + process.env.GREETING)", runtime.RunCodeOpts{
	Language: runtime.LanguageJavaScript,
	Envs:     map[string]string{"GREETING": "from Go SDK"},
	Timeout:  30 * time.Second,
	OnStdout: func(e runtime.StdoutEvent) { fmt.Printf("[stdout] %s", e.Text) },
})

// 3. 纯流式不聚合（低内存）
err = sb.CodeInterpreter.RunCodeStreaming(ctx, "for i in range(3):\n    print(f'line {i}')", runtime.RunCodeOpts{
	OnStdout: func(e runtime.StdoutEvent) { fmt.Printf("[stream] %s", e.Text) },
})

// 4. 上下文生命周期：状态跨运行保留
ctxObj, _ := sb.CodeInterpreter.CreateContext(ctx, "/home/user/proj", runtime.LanguagePython)
sb.CodeInterpreter.RunCode(ctx, "counter = 40", runtime.RunCodeOpts{ContextID: ctxObj.ID})
exec, _ = sb.CodeInterpreter.RunCode(ctx, "counter + 2", runtime.RunCodeOpts{ContextID: ctxObj.ID})
fmt.Println(exec.Text()) // 42

contexts, _ := sb.CodeInterpreter.ListContexts(ctx)
sb.CodeInterpreter.RemoveContext(ctx, ctxObj.ID)
```

完整的演示可参考：[运行时客户端示例](https://github.com/openkruise/agents-api/blob/master/examples/runtime-example/main.go)

### 端口路由

code-interpreter 服务监听独立端口（默认 49999，可通过 `WithCodeInterpreterPort` 配置）。
**Native** 和 **Private** 协议下端口嵌入 sandbox URL；当通过 `WithSandboxBaseURL` 覆盖 sandbox base URL 时，
端口改为通过 `e2b-sandbox-port` 请求头路由。

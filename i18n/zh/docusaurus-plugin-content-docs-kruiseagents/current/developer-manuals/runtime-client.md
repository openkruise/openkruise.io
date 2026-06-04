---
title: Go 客户端
---

## 依赖导入

在你的 `go.mod` 中引入 `agents-api` 依赖：[版本查看](https://github.com/openkruise/agents-api/releases)

```
require github.com/openkruise/agents-api <tag>
```

| 包           | 导入路径                                       | 定位                                                            |
|-------------|--------------------------------------------|---------------------------------------------------------------|
| **runtime** | `github.com/openkruise/agents-api/runtime` | **运行时客户端（Runtime Client）**：直接操作运行中的沙箱容器内的 envd 服务，进行命令执行和文件操作 |

---

## 包结构

```
runtime/
├── client.go                     #   Client 结构体：New / NewWithConfig
├── k8s.go                        #   NewFromK8s：从 K8s 自动解析 sandboxID 和 runtimeToken
├── config.go                     #   Config 与 Options：Domain / Scheme / RuntimeToken / ...
├── commands.go                   #   Commands：Run / Start / Kill / SendStdin / List / ConnectToProcess
├── command_handle.go             #   CommandHandle：Wait / Disconnect / Kill
├── filesystem.go                 #   Filesystem：List / Exists / GetInfo / MakeDir / Rename / Remove / Read / Write
└── envd/                         #   protobuf 生成代码
    ├── process/                  #   envd Process gRPC
    │   ├── process.pb.go
    │   └── processconnect/
    └── filesystem/               #   envd Filesystem gRPC
        ├── filesystem.pb.go
        └── filesystemconnect/
```

---

## 快速开始

在集群内或有 kubeconfig 权限时，使用 `NewFromK8s` 自动从 Sandbox CR 解析 `sandboxID` 和 `runtimeToken`：

```go
package main

import (
	"context"
	"fmt"

	"github.com/openkruise/agents-api/runtime"
)

func main() {
	ctx := context.Background()

	// domain 是 sandbox gateway 的地址。
	// 集群内访问：使用 K8s Service DNS，如 "sandbox-gateway.sandbox-system.svc:7788"
	// 本地开发：使用 port-forward 地址，如 "127.0.0.1:7788"
	domain := "sandbox-gateway.sandbox-system.svc:7788"
	namespace := "default"
	sandboxName := "your-sandbox-name"
	c, err := runtime.NewFromK8s(ctx, namespace, sandboxName,
		runtime.WithDomain(domain),
	)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Runtime URL: %s\n", c.RuntimeURL())

	res, _ := c.Commands.Run(ctx, "uname -a")
	fmt.Println(res.Stdout)
}
```

**关键说明：**

- `NewFromK8s` 查询 Sandbox CR 并从 annotation `agents.kruise.io/runtime-access-token` 提取 `runtimeToken`
- `sandboxID` 格式为 `namespace--name`（双横线连接）
- kubeconfig 解析顺序：`KUBECONFIG` 环境变量 → `~/.kube/config` → in-cluster config

完整的演示可参考：[运行时客户端示例](https://github.com/openkruise/agents-api/blob/master/examples/runtime-example/main.go)

---

## 连接配置

运行时客户端**不涉及 Protocol**，只需 `Scheme` + `Domain` 即可确定 envd 地址（`<scheme>://<domain>`）。

### Option 列表

| 选项                                    | 说明                               |
|---------------------------------------|----------------------------------|
| `WithDomain(domain string)`           | envd 域名，默认 `your.domain.com`     |
| `WithScheme(scheme string)`           | URL scheme，默认 `http`             |
| `WithRuntimeToken(token string)`      | 运行时 Token，写入请求头 `X-Access-Token` |
| `WithRuntimePort(port int)`           | 运行时端口，默认 `49983`                 |
| `WithAPIKey(apiKey string)`           | 可选 API Key                       |
| `WithAuthHeader(header string)`       | 覆盖默认的 Authorization 头            |
| `WithSandboxBaseURL(url string)`      | 完全覆盖 URL 拼装                      |
| `WithHeader(key, value string)`       | 添加单个自定义 header                   |
| `WithHeaders(headers map)`            | 合并多个自定义 headers                  |
| `WithRequestTimeout(d time.Duration)` | HTTP 超时，默认 60s                   |
| `WithConfig(cfg *Config)`             | 传入预构建的 Config 替换默认配置             |

---

## 命令执行（Commands）

通过 `c.Commands` 操作容器内进程。底层走 envd 的 `Process` gRPC 服务。

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
res, err := c.Commands.Run(ctx, "ls -la /tmp", runtime.RunOpts{
Cwd:      "/tmp",
Envs:     map[string]string{"LANG": "C"},
OnStdout: func (line string) { fmt.Print(line) },
})

// 后台启动 + 主动 Kill
h, _ := c.Commands.Start(ctx, "sleep 60")
fmt.Println("pid =", h.Pid())
h.Kill()
```

---

## 文件系统（Filesystem）

通过 `c.Files` 操作容器内文件。元数据操作走 envd Filesystem gRPC，文件内容读写走 HTTP `/files` 端点。

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
c.Files.MakeDir(ctx, "/tmp/work")

entries, _ := c.Files.List(ctx, "/tmp")
for _, e := range entries {
fmt.Printf("%s %s (%d bytes)\n", e.Type, e.Name, e.Size)
}

c.Files.Rename(ctx, "/tmp/work", "/tmp/done")
c.Files.Remove(ctx, "/tmp/done")

// 文件内容读写
c.Files.WriteText(ctx, "/tmp/hello.txt", "Hello, World!")
content, _ := c.Files.ReadText(ctx, "/tmp/hello.txt")
fmt.Println(content) // Hello, World!

// 二进制读写
c.Files.Write(ctx, "/tmp/data.bin", []byte{0x00, 0x01, 0x02})
data, _ := c.Files.Read(ctx, "/tmp/data.bin")
```

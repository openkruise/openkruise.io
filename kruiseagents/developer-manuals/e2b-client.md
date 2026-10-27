---
title: Go Client
---

## Dependency Import

Add the `agents-api` dependency in your `go.mod`: [View Versions](https://github.com/openkruise/agents-api/releases)

```
require github.com/openkruise/agents-api <tag>
```

| Package     | Import Path                              | Description                                                                                                                             |
|-------------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **e2b**     | `github.com/openkruise/agents-api/e2b`   | **Management Client**: Sandbox lifecycle management (Create / Connect / Pause / Kill) + in-container operations (Commands / Files / CodeInterpreter) |
| **runtime** | `github.com/openkruise/agents-api/runtime` | **Runtime Client**: talks directly to the in-sandbox runtime service (used by `e2b` under the hood; can be imported standalone)         |

---

## Package Structure

```
e2b/
├── api/                              #   OpenAPI-generated REST client (sandbox management)
├── sandbox.go                        #   Sandbox struct: Create / Connect / Pause / Kill
├── sandbox_api.go                    #   Low-level REST client (SandboxApi): List / GetInfo / Kill / ...
└── config.go                         #   ConnectionConfig: Protocol / Scheme / Domain / API URL
```

---

## Quick Start

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

For a complete demo,
see: [Management Client Example](https://github.com/openkruise/agents-api/blob/master/examples/e2b-example/main.go)

---

## Connection Configuration

### Scheme and Protocol

Connection behavior is controlled by `ConnectionConfig`, determined by two orthogonal dimensions: **Scheme** and *
*Protocol**.

#### Protocol (Routing Protocol)

| Value                | Constant              | API URL                          | Sandbox URL                                     |
|----------------------|-----------------------|----------------------------------|-------------------------------------------------|
| **Native (default)** | `e2b.ProtocolNative`  | `https://api.<domain>`           | `https://<port>-<sandboxID>.<domain>`           |
| **Private**          | `e2b.ProtocolPrivate` | `<scheme>://<domain>/kruise/api` | `<scheme>://<domain>/kruise/<sandboxID>/<port>` |

- **Native**: Subdomain-based routing, for native public network deployments
- **Private**: Path-prefix-based (`/kruise/...`) routing through a unified gateway, suitable for private or local
  port-forwarding scenarios

#### Scheme (Protocol Header)

| Value                   | Use Case                                    |
|-------------------------|---------------------------------------------|
| **`"https"` (default)** | Production / Public network                 |
| **`"http"`**            | Local port-forwarding, intranet without TLS |

#### ConnectionConfigOption List

Applied via `e2b.NewConnectionConfig(opts...)` or embedded in `Create/Connect` with `WithConfig(...)`:

| Option                                | Description                                                                              |
|---------------------------------------|------------------------------------------------------------------------------------------|
| `WithAPIKey(key string)`              | API Key, set in request header `X-API-Key`                                               |
| `WithDomain(domain string)`           | Domain, defaults to `your.domain.com`                                                    |
| `WithScheme(scheme string)`           | URL scheme, defaults to `https`                                                          |
| `WithProtocol(p Protocol)`            | Routing protocol, defaults to `ProtocolNative`                                           |
| `WithAPIURL(url string)`              | **Highest priority**: directly overrides API base URL, bypasses Protocol/Domain assembly |
| `WithSandboxBaseURL(url string)`      | **Highest priority**: directly overrides sandbox envd base URL                           |
| `WithCodeInterpreterPort(port int)`   | Code-interpreter service port, defaults to 49999                                          |
| `WithRequestTimeout(d time.Duration)` | HTTP request timeout, defaults to 60s                                                    |

#### Priority

`WithAPIURL` / `WithSandboxBaseURL` (explicit override) > `WithProtocol` + `WithDomain` assembly > Environment
variables > Defaults

---

## Creating / Connecting to a Sandbox

### Create Sandbox

Creates a new sandbox from a template. When `template` is empty, it defaults to `"code-interpreter"`.

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

### Connect Sandbox

Connects to an existing sandbox.

```go
sb, err := e2b.Connect(ctx, "default--xxx-xxx",
e2b.WithConfig(e2b.WithAPIKey("xxx"), e2b.WithDomain("example.com")),
)
```

### SandboxOption List

| Option                       | Description                                     |
|------------------------------|-------------------------------------------------|
| `WithConfig(opts...)`        | Embed a set of `ConnectionConfigOption`         |
| `WithTimeout(seconds int32)` | Sandbox TTL, defaults to 300 seconds            |
| `WithMetadata(map)`          | Sandbox metadata                                |
| `WithEnvVars(map)`           | Environment variables injected into the sandbox |
| `WithAutoPause(bool)`        | Enable auto-pause                               |
| `WithSecure(bool)`           | Enable secure mode                              |

### Sandbox Instance Methods

| Method                                 | Description                              |
|----------------------------------------|------------------------------------------|
| `SandboxID() string`                   | Returns the sandbox ID                   |
| `TemplateID() string`                  | Returns the template ID                  |
| `GetInfo(ctx) (*SandboxInfo, error)`   | Gets sandbox details                     |
| `SetTimeout(ctx, timeout int32) error` | Modifies the timeout                     |
| `Pause(ctx) (string, error)`           | Pauses the sandbox                       |
| `Kill(ctx) (bool, error)`              | Destroys the sandbox                     |
| `Close(ctx) error`                     | Alias for `Kill`, convenient for `defer` |

`Sandbox` exposes three sub-modules:

- `sb.Commands` — Command execution (`*Commands`)
- `sb.Files` — Filesystem (`*Filesystem`)
- `sb.CodeInterpreter` — Code execution (`*runtime.CodeInterpreter`)

---

## Sandbox Management API (SandboxApi)

`SandboxApi` is a low-level REST client that can be used independently without creating a specific Sandbox instance (
e.g., listing all sandboxes).

```go
api := e2b.NewSandboxApi(e2b.NewConnectionConfig(
e2b.WithAPIKey("xxx"),
e2b.WithDomain("example.com"),
))
```

| Method                                                                       | Description                                                 |
|------------------------------------------------------------------------------|-------------------------------------------------------------|
| `List(ctx) ([]SandboxInfo, error)`                                           | Lists all running sandboxes                                 |
| `GetInfo(ctx, sandboxID) (*SandboxInfo, error)`                              | Gets sandbox details; returns `not found` error on 404      |
| `Kill(ctx, sandboxID) (bool, error)`                                         | Destroys a sandbox; returns `true` directly in `Debug` mode |
| `SetTimeout(ctx, sandboxID, timeout int32) error`                            | Modifies the timeout                                        |
| `CreateSandbox(ctx, opts CreateSandboxOpts) (*SandboxCreateResponse, error)` | Low-level creation API                                      |
| `ConnectSandbox(ctx, sandboxID, timeout int32) (*client.Sandbox, error)`     | Low-level connection API                                    |
| `Pause(ctx, sandboxID) (string, error)`                                      | Pauses a sandbox                                            |

---

## Command Execution (Commands)

Operate in-container processes via `sb.Commands`. Uses the envd `Process` gRPC service under the hood.

### Methods

| Method                                                      | Description                                                                               |
|-------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `Run(ctx, cmd, opts...) (*CommandResult, error)`            | **Foreground execution**: starts and waits for completion, returns stdout/stderr/exitCode |
| `Start(ctx, cmd, opts...) (*CommandHandle, error)`          | **Background start**: returns a handle, caller decides when to `Wait`                     |
| `List(ctx) ([]ProcessInfo, error)`                          | Lists all running processes                                                               |
| `Kill(ctx, pid uint32) (bool, error)`                       | Sends SIGKILL to the specified PID; returns `false, nil` if process no longer exists      |
| `SendStdin(ctx, pid uint32, data string) error`             | Writes data to the stdin of the specified process                                         |
| `ConnectToProcess(ctx, pid uint32) (*CommandHandle, error)` | Reconnects to a running process and subscribes to its output                              |

`RunOpts` Fields

```go
type RunOpts struct {
Envs       map[string]string // Process environment variables
Cwd        string            // Working directory
Stdin      bool // Whether to allow writing via SendStdin
Background bool // Background execution (reserved field)
OnStdout   func (string) // Streaming stdout callback (foreground execution)
OnStderr   func (string) // Streaming stderr callback (foreground execution)
}
```

> Commands are executed via `/bin/bash -l -c <cmd>`, preserving the login environment.

`CommandHandle`

Returned by `Start` / `ConnectToProcess`, used for interaction or waiting:

| Method                                             | Description                                                              |
|----------------------------------------------------|--------------------------------------------------------------------------|
| `Pid() uint32`                                     | Returns the process PID                                                  |
| `Wait(onStdout, onStderr) (*CommandResult, error)` | Blocks until completion; non-zero exit code includes `*CommandExitError` |
| `Disconnect()`                                     | Disconnects the subscription but **does not kill the process**           |
| `Kill() bool`                                      | Kills the process                                                        |

`CommandResult` / `CommandExitError`

```go
type CommandResult struct {
Stdout   string
Stderr   string
ExitCode int32
Error    string
}

// Returned when exit code is non-zero (along with *CommandResult)
type CommandExitError struct {
Stdout, Stderr string
ExitCode       int32
ErrorMessage   string
}
```

### Examples

```go
// Foreground execution + streaming output
res, err := sb.Commands.Run(ctx, "ls -la /tmp", runtime.RunOpts{
Cwd:      "/tmp",
Envs:     map[string]string{"LANG": "C"},
OnStdout: func (line string) { fmt.Print(line) },
})

// Background start + manual Kill
h, _ := sb.Commands.Start(ctx, "sleep 60")
fmt.Println("pid =", h.Pid())
h.Kill()
```

---

## Filesystem

Operate in-container files via `sb.Files`. Metadata operations use the envd Filesystem gRPC, while file content
read/write uses the HTTP `/files` endpoint.

### Methods

| Method                                                              | Description                                                             |
|---------------------------------------------------------------------|-------------------------------------------------------------------------|
| `List(ctx, path, depth...) ([]EntryInfo, error)`                    | Lists directory entries; `depth` defaults to 1                          |
| `Exists(ctx, path) (bool, error)`                                   | Checks if a path exists (based on `Stat`, returns false on 404)         |
| `GetInfo(ctx, path) (*EntryInfo, error)`                            | Gets file/directory info                                                |
| `MakeDir(ctx, path) (bool, error)`                                  | Recursively creates a directory; returns `false, nil` if already exists |
| `Rename(ctx, oldPath, newPath) (*EntryInfo, error)`                 | Renames/moves a file or directory                                       |
| `Remove(ctx, path) error`                                           | Deletes a file or directory                                             |
| `Read(ctx, path, user...) ([]byte, error)`                          | Reads file content (binary); `user` defaults to `"node"`                |
| `ReadText(ctx, path, user...) (string, error)`                      | Reads file content (text)                                               |
| `Write(ctx, path, data []byte, user...) (*WriteInfo, error)`        | Writes file content (binary); automatically creates parent directories  |
| `WriteText(ctx, path, content string, user...) (*WriteInfo, error)` | Writes file content (text)                                              |

### Examples

```go
// Directory operations
sb.Files.MakeDir(ctx, "/tmp/work")

entries, _ := sb.Files.List(ctx, "/tmp")
for _, e := range entries {
fmt.Printf("%s %s (%d bytes)\n", e.Type, e.Name, e.Size)
}

sb.Files.Rename(ctx, "/tmp/work", "/tmp/done")
sb.Files.Remove(ctx, "/tmp/done")

// File content read/write
sb.Files.WriteText(ctx, "/tmp/hello.txt", "Hello, World!")
content, _ := sb.Files.ReadText(ctx, "/tmp/hello.txt")
fmt.Println(content) // Hello, World!
```

---

## Code Execution (CodeInterpreter)

Execute code inside the sandbox via `sb.CodeInterpreter`. It talks to the code-interpreter service (its own port,
49999 by default) and consumes an NDJSON event stream: each line is one JSON event (stdout, stderr, result, error, ...).

> An error raised by the executed code is **not** returned as a Go error: it is reported via `Execution.Error`.
> Only transport-level failures (HTTP status, network, ctx cancellation) produce a Go error.

### Methods

| Method                                                                       | Description                                                              |
|------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `RunCode(ctx, code, opts...) (*Execution, error)`                            | **Blocking execution**: waits for the stream to finish, aggregates all events into `Execution`; callbacks fire in real time |
| `RunCodeStreaming(ctx, code, opts...) error`                                 | **Pure streaming**: processes events as they arrive without buffering the whole output, keeping memory usage low for large executions |
| `CreateContext(ctx, cwd, language) (*Context, error)`                        | Creates an isolated execution context; empty values fall back to `/home/user` and `python` |
| `RemoveContext(ctx, contextID) error`                                        | Removes the context with the given ID                                    |
| `ListContexts(ctx) ([]*Context, error)`                                      | Lists all execution contexts in the sandbox                              |

`RunCodeOpts` Fields

```go
type RunCodeOpts struct {
	Language  string            // "python" (default), "javascript", "typescript", "r", "java", "bash"; ignored when ContextID is set
	Cwd       string            // Working directory; empty means the service default
	Envs      map[string]string // Environment variables for the execution
	Timeout   time.Duration     // Server-side execution timeout; zero means the service default
	ContextID string            // Execute inside an existing context (created via CreateContext)

	OnStdout  func(StdoutEvent)      // Invoked for every stdout event as it arrives
	OnStderr  func(StderrEvent)      // Invoked for every stderr event as it arrives
	OnResult  func(*Result)          // Invoked for every result as it arrives
	OnError   func(*ExecutionError)  // Invoked when the executed code raises an error
	OnEvent   func(ExecutionEvent)   // Invoked for every stream event
}
```

`Execution`

```go
type Execution struct {
	Results        []*Result       // Displayable results in arrival order (text, html, png, json, ...)
	Logs           Logs            // Stdout / Stderr chunks in arrival order
	Error          *ExecutionError // Error raised by the executed code, nil on success
	ExecutionCount int             // Number of prior executions in the current context
}

// Text() returns the text of the main result, or "" when there is none
func (e *Execution) Text() string
```

`Result` mirrors a Jupyter notebook cell output and exposes multiple representations (`Text`, `HTML`, `Markdown`, `SVG`,
`PNG`, `JPEG`, `PDF`, `LaTeX`, `JSON`, `Javascript`, ...); only the formats produced by the executed code are populated.

### Contexts

Code executed with the same `ContextID` shares state (variables, imports) across runs. Create one via
`CreateContext(ctx, cwd, language)` and pass its `ID` in `RunCodeOpts.ContextID`. When `ContextID` is set, `Language` is
ignored because the context already pins the language.

### Examples

```go
// 1. Blocking execution with aggregated results (Python is the default language)
exec, err := sb.CodeInterpreter.RunCode(ctx, "import math\nmath.sqrt(16)")
if err != nil {
	log.Fatal(err) // transport-level failure only
}
fmt.Println(exec.Text())           // 4
for _, r := range exec.Results {
	fmt.Println(r.Formats())        // e.g. ["text"]
}
if exec.Error != nil {
	fmt.Println(exec.Error.Name)    // e.g. "ValueError"
}

// 2. Options + streaming callbacks (JavaScript)
exec, err = sb.CodeInterpreter.RunCode(ctx, "console.log('js hello, ' + process.env.GREETING)", runtime.RunCodeOpts{
	Language: runtime.LanguageJavaScript,
	Envs:     map[string]string{"GREETING": "from Go SDK"},
	Timeout:  30 * time.Second,
	OnStdout: func(e runtime.StdoutEvent) { fmt.Printf("[stdout] %s", e.Text) },
})

// 3. Pure streaming without aggregation (low memory)
err = sb.CodeInterpreter.RunCodeStreaming(ctx, "for i in range(3):\n    print(f'line {i}')", runtime.RunCodeOpts{
	OnStdout: func(e runtime.StdoutEvent) { fmt.Printf("[stream] %s", e.Text) },
})

// 4. Context lifecycle: state persists across runs
ctxObj, _ := sb.CodeInterpreter.CreateContext(ctx, "/home/user/proj", runtime.LanguagePython)
sb.CodeInterpreter.RunCode(ctx, "counter = 40", runtime.RunCodeOpts{ContextID: ctxObj.ID})
exec, _ = sb.CodeInterpreter.RunCode(ctx, "counter + 2", runtime.RunCodeOpts{ContextID: ctxObj.ID})
fmt.Println(exec.Text()) // 42

contexts, _ := sb.CodeInterpreter.ListContexts(ctx)
sb.CodeInterpreter.RemoveContext(ctx, ctxObj.ID)
```

For a complete demo,
see: [Runtime Client Example](https://github.com/openkruise/agents-api/blob/master/examples/runtime-example/main.go)

### Port Routing

The code-interpreter service listens on its own port (49999 by default, configurable via `WithCodeInterpreterPort`).
Under the **Native** and **Private** protocols the port is embedded in the sandbox URL; when the sandbox base URL is
overridden with `WithSandboxBaseURL`, the port is routed through the `e2b-sandbox-port` header instead.

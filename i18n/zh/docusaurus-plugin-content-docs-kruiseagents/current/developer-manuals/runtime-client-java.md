---
title: Java 客户端
---

## 依赖导入

该包暂未发布到 Maven Central，需要从 [client-java](https://github.com/openkruise/agents-api/tree/master/runtime/java)
手动下载项目并打包成 JAR 文件使用。

---

## 包结构

```
runtime/
├── RuntimeClient.java            # 统一入口：create / newFromK8s
├── RuntimeConfig.java            # Builder 模式配置：domain / scheme / runtimeToken / ...
├── K8sHelper.java                # 从 Sandbox CR annotation 提取 runtimeToken
├── EnvdMethods.java              # envd 服务名和方法名常量
├── commands/                     # 命令执行
│   ├── Commands.java             # run / runBackground / kill / sendInput / list / connect
│   ├── CommandHandle.java        # 后台进程句柄：waitForCompletion / kill / close
│   └── CommandResult.java        # 命令执行结果：stdout / stderr / exitCode
├── filesystem/                   # 文件系统
│   ├── Filesystem.java           # listDir / read / write / makeDir / remove / watchDir / move
│   └── WatchHandle.java          # 目录监听句柄：stop
├── codeinterpreter/              # 代码解释器
│   ├── CodeInterpreter.java      # runCode / runCodeStreaming
│   ├── Execution.java            # 执行结果：results / logs / error
│   ├── RunCodeRequest.java       # 执行请求：code / language / options
│   └── ...                       # 事件类型：StdoutEvent / StderrEvent / ResultEvent 等
├── utils/                        # 工具类
│   ├── ConnectStreamReader.java  # Connect Protocol 流式响应解析
│   └── MessageStream.java        # 流式消息接口（hasNext / next / close）
├── exceptions/                   # 异常
│   ├── SandboxException.java     # 沙箱运行时异常
│   └── K8sOperationException.java # K8s 操作异常
└── envd/                         # protobuf 生成代码
    ├── process/                  # envd Process 服务
    └── filesystem/               # envd Filesystem 服务
```

---

## 快速开始

### 方式一：直接连接

已知 sandbox URL 和 token 时使用：

```java
import io.openkruise.agents.client.runtime.*;
import io.openkruise.agents.client.runtime.commands.CommandResult;

RuntimeConfig config = new RuntimeConfig.Builder()
    .runtimeUrl("http://localhost:49983")
    .runtimeToken("your-token")
    .build();

try (RuntimeClient client = RuntimeClient.create("sandbox-id", config)) {
    CommandResult res = client.commands.run("uname -a");
    System.out.println(res.getStdout());
}
```

### 方式二：K8s 自动发现

在集群内或有 kubeconfig 权限时，使用 `newFromK8s` 自动从 Sandbox CR 解析 `sandboxID` 和 `runtimeToken`：

```java
RuntimeConfig config = new RuntimeConfig.Builder()
    .domain("sandbox-gateway.sandbox-system.svc:7788")
    .scheme("http")
    .build();

try (RuntimeClient client = RuntimeClient.newFromK8s("default", "your-sandbox-name", config)) {
    System.out.println("Runtime URL: " + client.getRuntimeURL());
    CommandResult res = client.commands.run("uname -a");
    System.out.println(res.getStdout());
}
```

**K8s 模式说明：**

- `newFromK8s` 查询 Sandbox CR 并从 annotation `agents.kruise.io/runtime-access-token` 提取 `runtimeToken`
- `sandboxID` 格式为 `namespace--name`（双横线连接）
- kubeconfig 解析顺序：`KUBECONFIG` 环境变量 → `~/.kube/config` → in-cluster config

完整示例：[K8sDirectConnectExample.java](https://github.com/openkruise/agents-api/blob/master/runtime/java/src/main/java/io/openkruise/agents/client/examples/K8sDirectConnectExample.java)

---

## 一、RuntimeClient

`RuntimeClient` 是 Runtime 层的统一入口，提供命令执行和文件操作能力。

### 创建方式

| 方法                                                                                     | 说明            |
|----------------------------------------------------------------------------------------|---------------|
| `RuntimeClient.create(String sandboxID, RuntimeConfig config)`                         | 直接创建          |
| `RuntimeClient.newFromK8s(String namespace, String sandboxName, RuntimeConfig config)` | 从 K8s CR 自动发现 |

### 字段

| 字段                | 类型                | 说明      |
|-------------------|-------------------|---------|
| `commands`        | `Commands`        | 命令执行模块  |
| `files`           | `Filesystem`      | 文件系统模块  |
| `codeInterpreter` | `CodeInterpreter` | 代码解释器模块 |

### 方法

| 方法                | 说明                                         |
|-------------------|--------------------------------------------|
| `getSandboxID()`  | 返回 sandbox ID                              |
| `getRuntimeURL()` | 返回 runtime URL                             |
| `getConfig()`     | 返回 RuntimeConfig                           |
| `close()`         | 关闭 HTTP 连接池 + 释放线程池（支持 try-with-resources） |

> `close()` 只释放本地 HTTP 资源，不会终止远程 sandbox。

---

## 二、连接配置（RuntimeConfig）

运行时客户端只需 `scheme` + `domain` 即可确定 envd 地址（`<scheme>://<domain>`），不涉及 Protocol 路由。

### Builder 方法

| 方法                              | 说明                                          |
|---------------------------------|---------------------------------------------|
| `.domain(String)`               | envd 域名，默认 `domain.app`                     |
| `.scheme(String)`               | URL scheme，默认 `http`                        |
| `.runtimeToken(String)`         | 运行时 Token，写入请求头 `X-Access-Token`            |
| `.runtimeUrl(String)`           | **最高优先级**：直接覆盖 URL，`getSandboxURL()` 直接返回此值 |
| `.apiKey(String)`               | API Key，写入请求头 `X-API-Key`                   |
| `.authHeader(String)`           | 覆盖默认的 Authorization 头                       |
| `.headers(Map<String, String>)` | 合并多个自定义 headers                             |
| `.addHeader(String, String)`    | 添加单个自定义 header                              |
| `.requestTimeoutMs(long)`       | HTTP 超时（毫秒），默认 60000                        |
| `.sandboxPort(int)`             | envd 端口，默认 49983（用于请求头 `e2b-sandbox-port`）  |
| `.codeInterpreterPort(int)`     | 代码解释器端口，默认 49999                            |
| `.urlBuilder(URLBuilder)`       | URL 构建器，支持 E2B 和 Runtime 模式                 |
| `.httpClient(OkHttpClient)`     | 自定义 OkHttpClient，用于所有 HTTP 请求（代理、SSL、超时等）   |

### 优先级

`runtimeUrl`（显式覆盖） > `scheme` + `domain` 拼装 > 默认值

### 自定义 HTTP 客户端

你可以提供自定义的 `OkHttpClient` 来配置代理、SSL 证书、超时、拦截器等：

```java
import okhttp3.OkHttpClient;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.concurrent.TimeUnit;

// 构建自定义客户端，配置代理、SSL、超时等
OkHttpClient customClient = new OkHttpClient.Builder()
    .proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxy.host", 8080)))
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(120, TimeUnit.SECONDS)
    .build();

RuntimeConfig config = new RuntimeConfig.Builder()
    .domain("sandbox-gateway.sandbox-system.svc:7788")
    .scheme("http")
    .httpClient(customClient)  // 使用自定义客户端
    .build();

try (RuntimeClient client = RuntimeClient.create("sandbox-id", config)) {
    CommandResult res = client.commands.run("uname -a");
    System.out.println(res.getStdout());
}
```

**注意**：当提供 `httpClient` 时，它将直接用于所有 HTTP 请求。流式客户端会基于它派生，并设置 `readTimeout=0` 以支持长时间运行的操作。

---

## 三、命令执行（Commands）

通过 `client.commands` 操作容器内进程。底层基于 OkHttp + Connect Protocol，命令统一通过 `/bin/bash -l -c <cmd>` 执行。

### 方法一览

| 方法                                              | 说明                                    |
|-------------------------------------------------|---------------------------------------|
| `run(String cmd)`                               | **前台执行**：启动命令并等待完成，返回 `CommandResult` |
| `run(String cmd, RunOptions options)`           | 前台执行（带选项）                             |
| `runBackground(String cmd, RunOptions options)` | **后台启动**：返回 `CommandHandle`，调用方决定何时等待 |
| `list()`                                        | 列出所有运行中的进程，返回 `List<ProcessInfo>`     |
| `kill(int pid)`                                 | 向指定 PID 发送 SIGKILL                    |
| `sendInput(int pid, String data)`               | 向指定进程的 stdin 写入数据                     |
| `sendSignal(int pid, Signal signal)`            | 向指定进程发送信号                             |
| `closeStdin(int pid)`                           | 关闭指定进程的 stdin                         |
| `connect(int pid)`                              | 重新连接到已运行的进程，订阅其后续输出                   |

### RunOptions

```java
RunOptions opts = new RunOptions()
    .envs(Map.of("LANG", "C"))               // 环境变量
    .cwd("/tmp")                              // 工作目录
    .onStdout(line -> System.out.print(line)) // 流式 stdout 回调
    .onStderr(line -> System.err.print(line));// 流式 stderr 回调
```

### CommandResult

| 字段         | 类型       | 说明   |
|------------|----------|------|
| `stdout`   | `String` | 标准输出 |
| `stderr`   | `String` | 标准错误 |
| `exitCode` | `int`    | 退出码  |

### CommandHandle

由 `runBackground()` / `connect()` 返回，实现 `AutoCloseable`：

| 方法                    | 说明                        |
|-----------------------|---------------------------|
| `getPid()`            | 返回进程 PID                  |
| `isCompleted()`       | 是否已完成                     |
| `waitForCompletion()` | 阻塞等待结束，返回 `CommandResult` |
| `kill()`              | 终止进程                      |
| `close()`             | 关闭流和底层 HTTP 资源            |

### 示例

```java
// 前台执行
CommandResult res = client.commands.run("pwd");
System.out.println(res.getStdout());

// 带选项执行 + 流式输出
CommandResult res2 = client.commands.run("ls -la /tmp",
    new RunOptions().cwd("/tmp").onStdout(System.out::print));

// 后台启动 + 主动 Kill
CommandHandle handle = client.commands.runBackground("sleep 60", new RunOptions());
System.out.println("pid = " + handle.getPid());
handle.kill();
handle.close();

// 列出进程
List<ProcessInfo> procs = client.commands.list();
for (ProcessInfo p : procs) {
    System.out.printf("PID: %d, Cmd: %s%n", p.getPid(), p.getCmd());
}
```

---

## 四、文件系统（Filesystem）

通过 `client.files` 操作容器内文件。元数据操作走 envd Filesystem 服务，文件读写走 HTTP `/files` 端点。

### 方法一览

**目录操作**

| 方法                                     | 说明                   |
|----------------------------------------|----------------------|
| `listDir(String path)`                 | 列出目录条目（depth=1）      |
| `listDir(String path, int depth)`      | 列出目录条目（指定深度）         |
| `makeDir(String path)`                 | 递归创建目录；已存在返回 `false` |
| `move(String oldPath, String newPath)` | 重命名/移动文件或目录          |

**文件信息**

| 方法                     | 说明                       |
|------------------------|--------------------------|
| `exists(String path)`  | 路径是否存在                   |
| `getInfo(String path)` | 获取文件/目录信息，返回 `EntryInfo` |

**文件读写**

| 方法                                                    | 说明                            |
|-------------------------------------------------------|-------------------------------|
| `read(String path)`                                   | 读取文件内容（`byte[]`）              |
| `read(String path, String user)`                      | 读取文件内容（指定用户）                  |
| `readText(String path)`                               | 读取文件内容（`String`，UTF-8）        |
| `readText(String path, String user)`                  | 读取文件内容（指定用户，UTF-8）            |
| `write(String path, byte[] data)`                     | 写入文件（二进制），返回 `WriteInfo`      |
| `write(String path, byte[] data, String user)`        | 写入文件（指定用户），返回 `WriteInfo`     |
| `writeText(String path, String content)`              | 写入文件（文本，UTF-8），返回 `WriteInfo` |
| `writeText(String path, String content, String user)` | 写入文件（指定用户），返回 `WriteInfo`     |

**删除**

| 方法                    | 说明      |
|-----------------------|---------|
| `remove(String path)` | 删除文件或目录 |

**目录监听**

| 方法                                                                            | 说明           |
|-------------------------------------------------------------------------------|--------------|
| `watchDir(String path, Consumer<FilesystemEvent> onEvent)`                    | 监听目录变更事件     |
| `watchDir(String path, boolean recursive, Consumer<FilesystemEvent> onEvent)` | 监听目录变更（支持递归） |

### WatchHandle

| 方法            | 说明                |
|---------------|-------------------|
| `stop()`      | 停止监听并关闭底层 HTTP 资源 |
| `isStopped()` | 是否已停止             |

### 示例

```java
// 目录操作
client.files.makeDir("/tmp/work");
List<EntryInfo> entries = client.files.listDir("/tmp");
client.files.move("/tmp/old.txt", "/tmp/new.txt");
client.files.remove("/tmp/work");

// 文件读写
client.files.writeText("/tmp/hello.txt", "Hello, World!");
String content = client.files.readText("/tmp/hello.txt");

// 二进制读写
WriteInfo info = client.files.write("/tmp/data.bin", new byte[]{0x01, 0x02});
byte[] data = client.files.read("/tmp/data.bin");

// 目录监听
WatchHandle wh = client.files.watchDir("/tmp", true, event ->
    System.out.printf("Event: %s %s%n", event.getType(), event.getName()));
wh.stop();
```

---

## 五、代码解释器（CodeInterpreter）

通过 `client.codeInterpreter` 在沙箱内执行代码。支持 Python、JavaScript、TypeScript、R、Java、Bash 等多种语言。

### 方法一览

| 方法                                                           | 说明                    |
|--------------------------------------------------------------|-----------------------|
| `runCode(String code)`                                       | 执行 Python 代码（默认语言）    |
| `runCode(String code, String language)`                      | 执行指定语言的代码             |
| `runCode(String code, String language, RunCodeOptions)`      | 执行代码（带选项：工作目录、环境变量等）  |
| `runCode(RunCodeRequest request)`                            | 执行代码（完整请求对象）          |
| `runCodeStreaming(RunCodeRequest, Consumer<ExecutionEvent>)` | 流式执行代码，逐事件回调（低内存占用）   |
| `createCodeContext(String cwd, String language)`             | 创建代码执行上下文（可设置工作目录和语言） |
| `removeCodeContext(String contextId)`                        | 删除指定的代码执行上下文          |
| `listCodeContexts()`                                         | 列出所有代码执行上下文           |

### RunCodeOptions

```java
RunCodeOptions opts = new RunCodeOptions()
    .setCwd("/tmp")                              // 工作目录
    .setEnvVars(Map.of("DEBUG", "true"))         // 环境变量
    .setTimeoutMs(30000L)                        // 超时时间（毫秒）
    .setContextId("context-id");                 // 使用指定的上下文（与 language 互斥）
```

### Context（代码执行上下文）

Context 用于维护独立的代码执行环境，每个 Context 有自己的工作目录和语言环境。

| 字段         | 类型       | 说明     |
|------------|----------|--------|
| `id`       | `String` | 上下文 ID |
| `language` | `String` | 编程语言   |
| `cwd`      | `String` | 工作目录   |

**注意**：使用 Context 时，`runCode()` 的 `language` 参数会被忽略（服务端要求 `context_id` 和 `language` 互斥）。

### Execution（执行结果）

| 字段               | 类型               | 说明                          |
|------------------|------------------|-----------------------------|
| `results`        | `List<Result>`   | 执行结果列表（text/html/image 等格式） |
| `logs`           | `Logs`           | 日志输出（stdout/stderr）         |
| `error`          | `ExecutionError` | 执行错误（如有）                    |
| `executionCount` | `Integer`        | 执行次数                        |

### Result（结果格式）

支持多种输出格式，类似 Jupyter notebook：

| 字段           | 类型                    | 说明       |
|--------------|-----------------------|----------|
| `text`       | `String`              | 纯文本输出    |
| `html`       | `String`              | HTML 输出  |
| `markdown`   | `String`              | Markdown |
| `png`        | `String` (base64)     | PNG 图片   |
| `jpeg`       | `String` (base64)     | JPEG 图片  |
| `svg`        | `String`              | SVG 图形   |
| `json`       | `Map<String, Object>` | JSON 数据  |
| `mainResult` | `boolean`             | 是否为主结果   |

### 示例

```java
// 执行 Python 代码
Execution result = client.codeInterpreter.runCode("print('Hello from Python!')");
for (String line : result.getLogs().getStdout()) {
    System.out.println(line);
}

// 执行 JavaScript 代码
Execution jsResult = client.codeInterpreter.runCode(
    "console.log('Hello from JS!');",
    RunCodeLanguage.JAVASCRIPT.getValue()
);

// 带选项执行（环境变量）
RunCodeOptions opts = new RunCodeOptions()
    .setEnvVars(Map.of("API_KEY", "secret"));
Execution result2 = client.codeInterpreter.runCode(
    "import os; print(os.environ.get('API_KEY'))",
    RunCodeLanguage.PYTHON.getValue(),
    opts
);

// 使用 Context 设置工作目录
Context ctx = client.codeInterpreter.createCodeContext("/tmp", "python");
System.out.println("Context created: " + ctx);

RunCodeOptions ctxOpts = new RunCodeOptions()
    .setContextId(ctx.getId());
Execution ctxResult = client.codeInterpreter.runCode(
    "import os; print('CWD:', os.getcwd())",
    RunCodeLanguage.PYTHON.getValue(),
    ctxOpts
);

// 清理 Context
client.codeInterpreter.removeCodeContext(ctx.getId());

// 列出所有 Context
List<Context> contexts = client.codeInterpreter.listCodeContexts();
for (Context c : contexts) {
    System.out.println(c);
}

// 获取主结果文本
String mainText = result2.getText();
System.out.println("Main result: " + mainText);

// 流式执行（逐事件处理）
RunCodeRequest request = new RunCodeRequest("for i in range(5): print(i)", "python");
client.codeInterpreter.runCodeStreaming(request, event -> {
    if (event instanceof StdoutEvent) {
        System.out.print(((StdoutEvent) event).getText());
    } else if (event instanceof ErrorEvent) {
        System.err.println("Error: " + ((ErrorEvent) event).getError());
    }
});
```

---

## 六、异常体系

| 异常类                     | 说明                            |
|-------------------------|-------------------------------|
| `SandboxException`      | 沙箱运行时异常（命令执行失败、流读取错误等）        |
| `K8sOperationException` | K8s 操作异常（CR 查询失败、token 提取失败等） |

---

## 七、资源管理

`RuntimeClient` 实现 `AutoCloseable`，`close()` 会释放：

- OkHttpClient **Dispatcher** 线程池
- OkHttpClient **ConnectionPool** 连接池

推荐使用 try-with-resources：

```java
try (RuntimeClient client = RuntimeClient.create(sandboxID, config)) {
    // 操作...
} // 自动释放 HTTP 资源
```

> `close()` 只释放本地 HTTP 资源，**不会终止远程 sandbox**。
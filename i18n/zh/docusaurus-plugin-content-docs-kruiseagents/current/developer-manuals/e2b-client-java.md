---
title: Java 客户端
---

## 依赖导入

该包暂未发布到 Maven Central，需要从 [e2b/java](https://github.com/openkruise/agents-api/tree/master/e2b/java)
手动下载项目并打包成 JAR 文件使用。

---

## 快速开始

```java
import io.openkruise.agents.client.e2b.*;

ConnectionConfig config = new ConnectionConfig.Builder()
    .apiKey("your-api-key")
    .domain("your.domain.com")
    .build();

SandboxApi api = new SandboxApi(config);

// 创建 → 使用 → 关闭连接 + 显式终止 sandbox
Sandbox sandbox = api.create("code-interpreter");
try (sandbox) {
    sandbox.commands.run("echo hello");
    sandbox.files.writeText("/tmp/demo.txt", "Hello!");
} finally {
    api.kill(sandbox.getSandboxID());  // 显式终止 sandbox
}
```

完整示例：[生命周期管理](https://github.com/openkruise/agents-api/blob/master/e2b/java/src/main/java/io/openkruise/agents/client/examples/SandboxApiManagerExample.java) | [命令操作](https://github.com/openkruise/agents-api/blob/master/e2b/java/src/main/java/io/openkruise/agents/client/examples/SandboxCommandsExample.java) | [文件操作](https://github.com/openkruise/agents-api/blob/master/e2b/java/src/main/java/io/openkruise/agents/client/examples/SandboxFilesExample.java) | [代码解释器](https://github.com/openkruise/agents-api/blob/master/e2b/java/src/main/java/io/openkruise/agents/client/examples/SandboxCodeInterpreterExample.java)

---

## 一、Sandbox 生命周期管理（SandboxApi）

`SandboxApi` 提供 Sandbox 的完整生命周期管理：创建、连接、查询、暂停、恢复和终止。

### 初始化

```java
ConnectionConfig config = new ConnectionConfig.Builder()
    .apiKey("your-api-key")
    .domain("your.domain.com")
    .build();

SandboxApi api = new SandboxApi(config);
```

### API 方法一览

| 方法                                                                                 | 说明                                    |
|------------------------------------------------------------------------------------|---------------------------------------|
| `create(String template)`                                                          | 从模板创建 sandbox                         |
| `create(NewSandbox body)`                                                          | 创建 sandbox（全部参数）                      |
| `connect(String sandboxID)`                                                        | 连接已有 sandbox                          |
| `connect(String sandboxID, int timeout)`                                           | 连接已有 sandbox（指定超时）                    |
| `list()`                                                                           | 列出所有运行中的 sandbox                      |
| `list(String metadata)`                                                            | 按 metadata 过滤列出                       |
| `list(String metadata, List<SandboxState> state, String nextToken, Integer limit)` | 分页 + 状态过滤                             |
| `getInfo(String sandboxID)`                                                        | 获取详情，404 → `SandboxNotFoundException` |
| `kill(String sandboxID)`                                                           | 终止 sandbox；`true` 成功，`false` 未找到      |
| `pause(String sandboxID)`                                                          | 暂停 sandbox，409 视为已暂停                  |
| `setTimeout(String sandboxID, int timeout)`                                        | 修改超时时间（秒）                             |

### 生命周期示例

```java
// ---- 创建 ----
Sandbox sandbox = api.create("code-interpreter");
String id = sandbox.getSandboxID();

// 全参数创建
Sandbox sandbox2 = api.create(new NewSandbox()
    .templateID("code-interpreter")
    .timeout(600)
    .envVars(Map.of("FOO", "1")));

// ---- 查询 ----
SandboxInfo info = api.getInfo(id);
List<SandboxInfo> all = api.list();

// ---- 连接已有 sandbox ----
Sandbox reconnected = api.connect(id);

// ---- 暂停 / 修改超时 ----
api.pause(id);
api.setTimeout(id, 600);

// ---- 终止 ----
api.kill(id);
```

### Sandbox 实例

`SandboxApi.create()` / `connect()` 返回 `Sandbox` 实例，它是数据面操作的入口：

| 方法/字段                | 说明                          |
|----------------------|-----------------------------|
| `sandboxID`          | Sandbox ID                  |
| `commands`           | 命令执行模块（`Commands`）          |
| `files`              | 文件系统模块（`Filesystem`）        |
| `codeInterpreter`    | 代码解释器模块（`CodeInterpreter`）  |
| `getSandboxURL()`    | Sandbox envd URL            |
| `getConfig()`        | 连接配置                        |
| `getRuntimeClient()` | 底层 `RuntimeClient`          |
| `close()`            | 关闭连接（支持 try-with-resources） |

---

## 二、命令执行（Commands）

通过 `sandbox.commands` 操作容器内进程。底层基于 OkHttp + Connect Protocol，命令统一通过 `/bin/bash -l -c <cmd>` 执行。

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
| `close()`             | 关闭流和底层资源                  |

### 示例

```java
// 前台执行
CommandResult res = sandbox.commands.run("pwd");
System.out.println(res.getStdout());

// 带选项执行 + 流式输出
CommandResult res2 = sandbox.commands.run("ls -la /tmp",
    new RunOptions().cwd("/tmp").onStdout(System.out::print));

// 后台启动 + 主动 Kill
CommandHandle handle = sandbox.commands.runBackground("sleep 60", new RunOptions());
System.out.println("pid = " + handle.getPid());
handle.kill();
handle.close();

// 列出进程
List<ProcessInfo> procs = sandbox.commands.list();
for (ProcessInfo p : procs) {
    System.out.printf("PID: %d, Cmd: %s%n", p.getPid(), p.getCmd());
}
```

---

## 三、文件系统（Filesystem）

通过 `sandbox.files` 操作容器内文件。元数据操作走 envd Filesystem 服务，文件读写走 HTTP `/files` 端点。

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
sandbox.files.makeDir("/tmp/work");
List<EntryInfo> entries = sandbox.files.listDir("/tmp");
sandbox.files.move("/tmp/old.txt", "/tmp/new.txt");
sandbox.files.remove("/tmp/work");

// 文件读写
sandbox.files.writeText("/tmp/hello.txt", "Hello, World!");
String content = sandbox.files.readText("/tmp/hello.txt");

// 二进制读写
WriteInfo info = sandbox.files.write("/tmp/data.bin", new byte[]{0x01, 0x02});
byte[] data = sandbox.files.read("/tmp/data.bin");

// 目录监听
WatchHandle wh = sandbox.files.watchDir("/tmp", true, event ->
    System.out.printf("Event: %s %s%n", event.getType(), event.getName()));
wh.stop();
```

---

## 四、SandboxInfo（不可变）

`SandboxInfo` 是 `list()` / `getInfo()` 的返回类型，**不可变对象**（所有字段 `final`，无 setters，`metadata` 和
`volumeMounts` 为 unmodifiable 集合）。

| 字段                    | 类型                         | 说明                  |
|-----------------------|----------------------------|---------------------|
| `sandboxID`           | `String`                   | Sandbox ID          |
| `templateID`          | `String`                   | 模板 ID               |
| `alias`               | `String`                   | 别名                  |
| `clientID`            | `String`                   | 客户端 ID              |
| `startedAt`           | `OffsetDateTime`           | 启动时间                |
| `endAt`               | `OffsetDateTime`           | 结束时间                |
| `cpuCount`            | `Integer`                  | CPU 数量              |
| `memoryMB`            | `Integer`                  | 内存（MB）              |
| `diskSizeMB`          | `Integer`                  | 磁盘（MB）              |
| `envdVersion`         | `String`                   | envd 版本             |
| `metadata`            | `Map<String, String>`      | 元数据（unmodifiable）   |
| `state`               | `String`                   | 状态                  |
| `volumeMounts`        | `List<SandboxVolumeMount>` | 卷挂载（unmodifiable）   |
| `envdAccessToken`     | `String`                   | envd 访问令牌（仅 detail） |
| `domain`              | `String`                   | 域名（仅 detail）        |
| `allowInternetAccess` | `Boolean`                  | 是否允许互联网（仅 detail）   |
| `network`             | `SandboxNetworkConfig`     | 网络配置（仅 detail）      |
| `lifecycle`           | `SandboxLifecycle`         | 生命周期（仅 detail）      |

---

## 五、连接配置（ConnectionConfig）

### Scheme 与 Protocol

连接行为由 **Scheme** 和 **Protocol** 两个正交维度决定 URL 形态。

#### Protocol（路由协议）

| 值              | API URL                          | Sandbox URL                                     |
|----------------|----------------------------------|-------------------------------------------------|
| **Native（默认）** | `https://api.<domain>`           | `https://<port>-<sandboxID>.<domain>`           |
| **Private**    | `<scheme>://<domain>/kruise/api` | `<scheme>://<domain>/kruise/<sandboxID>/<port>` |

- **Native**：基于子域名路由，对应原生公网部署
- **Private**：基于路径前缀通过统一网关路由，适用于私有化或端口转发场景

### Builder 方法

| 方法                              | 说明                                        |
|---------------------------------|-------------------------------------------|
| `.apiKey(String)`               | API Key，写入请求头 `X-API-Key`                 |
| `.accessToken(String)`          | Access Token，写入请求头 `X-Access-Token`       |
| `.domain(String)`               | 域名，默认 `your.domain.com`                   |
| `.scheme(String)`               | URL scheme，默认 `https`                     |
| `.protocol(Protocol)`           | 路由协议，默认 `Protocol.NATIVE`                 |
| `.apiURL(String)`               | **最高优先级**：直接覆盖 API base URL               |
| `.sandboxBaseURL(String)`       | **最高优先级**：直接覆盖 sandbox envd base URL      |
| `.requestTimeoutMs(long)`       | HTTP 请求超时（毫秒），默认 60000                    |
| `.port(int)`                    | envd 端口，默认 49983                          |
| `.codeInterpreterPort(int)`     | 代码解释器端口，默认 49999                          |
| `.debug(boolean)`               | 调试模式，kill/setTimeout 跳过实际调用               |
| `.headers(Map<String, String>)` | 自定义请求头                                    |
| `.addHeader(String, String)`    | 添加单个自定义请求头                                |
| `.httpClient(OkHttpClient)`     | 自定义 OkHttpClient，用于所有 HTTP 请求（代理、SSL、超时等） |

### 优先级

`apiURL` / `sandboxBaseURL`（显式覆盖） > `protocol` + `domain` 拼装 > 环境变量（`E2B_API_KEY`、`E2B_DOMAIN`） > 默认值

### 环境变量

Builder 构造时自动读取以下环境变量作为默认值，之后可通过 Builder 方法显式覆盖：

| 变量            | 说明         |
|---------------|------------|
| `E2B_API_KEY` | 默认 API Key |
| `E2B_DOMAIN`  | 默认域名       |

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

ConnectionConfig config = new ConnectionConfig.Builder()
    .httpClient(customClient)  // 使用自定义客户端
    .build();

SandboxApi api = new SandboxApi(config);
Sandbox sandbox = api.create("code-interpreter");
```

**注意**：当提供 `httpClient` 时，它将直接用于所有 HTTP 请求（包括控制面 API 调用和数据面 Runtime 连接）。

---

## 六、代码解释器（CodeInterpreter）

通过 `sandbox.codeInterpreter` 在沙箱内执行代码。支持 Python、JavaScript、TypeScript、R、Java、Bash 等多种语言。

### 方法一览

| 方法                                                           | 说明                    |
|--------------------------------------------------------------|-----------------------|
| `runCode(String code)`                                       | 执行 Python 代码（默认语言）    |
| `runCode(String code, String language)`                      | 执行指定语言的代码             |
| `runCode(String code, String language, RunCodeOptions)`      | 执行代码（带选项：工作目录、环境变量等）  |
| `runCode(RunCodeRequest request)`                            | 执行代码（完整请求对象）          |
| `runCodeStreaming(RunCodeRequest, Consumer<ExecutionEvent>)` | 流式执行代码，逐事件回调          |
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
Execution result = sandbox.codeInterpreter.runCode("print('Hello from Python!')");
for (String line : result.getLogs().getStdout()) {
    System.out.println(line);
}

// 执行 JavaScript 代码
Execution jsResult = sandbox.codeInterpreter.runCode(
    "console.log('Hello from JS!');",
    RunCodeLanguage.JAVASCRIPT.getValue()
);

// 带选项执行（环境变量）
RunCodeOptions opts = new RunCodeOptions()
    .setEnvVars(Map.of("API_KEY", "secret"));
Execution result2 = sandbox.codeInterpreter.runCode(
    "import os; print(os.environ.get('API_KEY'))",
    RunCodeLanguage.PYTHON.getValue(),
    opts
);

// 使用 Context 设置工作目录
Context ctx = sandbox.codeInterpreter.createCodeContext("/tmp", "python");
System.out.println("Context created: " + ctx);

RunCodeOptions ctxOpts = new RunCodeOptions()
    .setContextId(ctx.getId());
Execution ctxResult = sandbox.codeInterpreter.runCode(
    "import os; print('CWD:', os.getcwd())",
    RunCodeLanguage.PYTHON.getValue(),
    ctxOpts
);

// 清理 Context
sandbox.codeInterpreter.removeCodeContext(ctx.getId());

// 列出所有 Context
List<Context> contexts = sandbox.codeInterpreter.listCodeContexts();
for (Context c : contexts) {
    System.out.println(c);
}

// 获取主结果文本
String mainText = result2.getText();
System.out.println("Main result: " + mainText);

// 流式执行（逐事件处理）
RunCodeRequest request = new RunCodeRequest("for i in range(5): print(i)", "python");
sandbox.codeInterpreter.runCodeStreaming(request, event -> {
    if (event instanceof StdoutEvent) {
        System.out.print(((StdoutEvent) event).getText());
    } else if (event instanceof ErrorEvent) {
        System.err.println("Error: " + ((ErrorEvent) event).getError());
    }
});
```

完整示例：[SandboxCodeInterpreterExample.java](https://github.com/openkruise/agents-api/blob/master/e2b/java/src/main/java/io/openkruise/agents/client/examples/SandboxCodeInterpreterExample.java)

---

## 七、K8s 直连模式

绕过 E2B 控制面，直接连接 K8s 集群内的 sandbox：

```java
import io.openkruise.agents.client.runtime.*;

RuntimeConfig config = new RuntimeConfig.Builder()
    .runtimeUrl("http://localhost:49983")
    .runtimeToken("your-token")
    .build();

RuntimeClient client = RuntimeClient.create("sandbox-id", config);

// 命令执行和文件操作
CommandResult res = client.commands.run("echo hello");
client.files.writeText("/tmp/test.txt", "Hello!");

client.close(); // 关闭连接 + 释放线程池
```

参见 Runtime 层文档：[Runtime 客户端](./runtime-client-java.md)

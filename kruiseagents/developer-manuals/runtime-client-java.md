---
title: Java Client
---

## Dependency Import

This package is not yet published to Maven Central. You need to download the project
from [client-java](https://github.com/openkruise/agents-api/tree/master/k8s/java) and manually build the JAR file.

---

## Package Structure

```
runtime/
├── RuntimeClient.java            # Unified entry: create / newFromK8s
├── RuntimeConfig.java            # Builder-style config: domain / scheme / runtimeToken / ...
├── K8sHelper.java                # Extract runtimeToken from Sandbox CR annotation
├── EnvdMethods.java              # envd service name and method name constants
├── commands/                     # Command execution
│   ├── Commands.java             # run / runBackground / kill / sendInput / list / connect
│   ├── CommandHandle.java        # Background process handle: waitForCompletion / kill / close
│   └── CommandResult.java        # Command execution result: stdout / stderr / exitCode
├── filesystem/                   # Filesystem
│   ├── Filesystem.java           # listDir / read / write / makeDir / remove / watchDir / move
│   └── WatchHandle.java          # Directory watch handle: stop
├── utils/                        # Utilities
│   ├── ConnectStreamReader.java  # Connect Protocol streaming response parser
│   └── MessageStream.java        # Streaming message interface (hasNext / next / close)
├── exceptions/                   # Exceptions
│   ├── SandboxException.java     # Sandbox runtime exception
│   └── K8sOperationException.java # K8s operation exception
└── envd/                         # protobuf generated code
    ├── process/                  # envd Process service
    └── filesystem/               # envd Filesystem service
```

---

## Quick Start

### Method 1: Direct Connection

Use when you already know the sandbox URL and token:

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

### Method 2: K8s Auto Discovery

When running inside a cluster or with kubeconfig access, use `newFromK8s` to automatically resolve `sandboxID` and
`runtimeToken` from the Sandbox CR:

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

**K8s mode notes:**

- `newFromK8s` queries the Sandbox CR and extracts `runtimeToken` from the annotation
  `agents.kruise.io/runtime-access-token`
- `sandboxID` format is `namespace--name` (connected by double hyphens)
- kubeconfig resolution order: `KUBECONFIG` environment variable → `~/.kube/config` → in-cluster config

Full
example: [K8sDirectConnectExample.java](https://github.com/openkruise/agents-api/blob/master/k8s/java/src/main/java/io/openkruise/agents/client/examples/runtime/K8sDirectConnectExample.java)

---

## 1. RuntimeClient

`RuntimeClient` is the unified entry point for the Runtime layer, providing command execution and file operation
capabilities.

### Creation Methods

| Method                                                                                 | Description                |
|----------------------------------------------------------------------------------------|----------------------------|
| `RuntimeClient.create(String sandboxID, RuntimeConfig config)`                         | Direct creation            |
| `RuntimeClient.newFromK8s(String namespace, String sandboxName, RuntimeConfig config)` | Auto-discovery from K8s CR |

### Fields

| Field      | Type         | Description              |
|------------|--------------|--------------------------|
| `commands` | `Commands`   | Command execution module |
| `files`    | `Filesystem` | Filesystem module        |

### Methods

| Method            | Description                                                                    |
|-------------------|--------------------------------------------------------------------------------|
| `getSandboxID()`  | Returns sandbox ID                                                             |
| `getRuntimeURL()` | Returns runtime URL                                                            |
| `getConfig()`     | Returns RuntimeConfig                                                          |
| `close()`         | Close HTTP connection pool + release thread pool (supports try-with-resources) |

> `close()` only releases local HTTP resources, it does not terminate the remote sandbox.

---

## 2. Connection Configuration (RuntimeConfig)

The runtime client only needs `scheme` + `domain` to determine the envd address (`<scheme>://<domain>`), no Protocol
routing is involved.

### Builder Methods

| Method                          | Description                                                                        |
|---------------------------------|------------------------------------------------------------------------------------|
| `.domain(String)`               | envd domain, defaults to `domain.app`                                              |
| `.scheme(String)`               | URL scheme, defaults to `http`                                                     |
| `.runtimeToken(String)`         | Runtime token, set in request header `X-Access-Token`                              |
| `.runtimeUrl(String)`           | **Highest priority**: directly overrides URL; `getSandboxURL()` returns this value |
| `.apiKey(String)`               | API Key, set in request header `X-API-Key`                                         |
| `.authHeader(String)`           | Override default Authorization header                                              |
| `.headers(Map<String, String>)` | Merge multiple custom headers                                                      |
| `.addHeader(String, String)`    | Add a single custom header                                                         |
| `.requestTimeoutMs(long)`       | HTTP timeout (ms), defaults to 60000                                               |

### Priority

`runtimeUrl` (explicit override) > `scheme` + `domain` assembly > defaults

---

## 3. Command Execution (Commands)

Operate in-container processes via `client.commands`. Uses OkHttp + Connect Protocol under the hood. Commands are
executed via `/bin/bash -l -c <cmd>`.

### Methods

| Method                                          | Description                                                                |
|-------------------------------------------------|----------------------------------------------------------------------------|
| `run(String cmd)`                               | **Foreground execution**: start and wait, returns `CommandResult`          |
| `run(String cmd, RunOptions options)`           | Foreground execution (with options)                                        |
| `runBackground(String cmd, RunOptions options)` | **Background start**: returns `CommandHandle`, caller decides when to wait |
| `list()`                                        | List all running processes, returns `List<ProcessInfo>`                    |
| `kill(int pid)`                                 | Send SIGKILL to the specified PID                                          |
| `sendInput(int pid, String data)`               | Write data to the stdin of the specified process                           |
| `sendSignal(int pid, Signal signal)`            | Send a signal to the specified process                                     |
| `closeStdin(int pid)`                           | Close stdin of the specified process                                       |
| `connect(int pid)`                              | Reconnect to a running process, subscribe to its output                    |

### RunOptions

```java
RunOptions opts = new RunOptions()
    .envs(Map.of("LANG", "C"))               // environment variables
    .cwd("/tmp")                              // working directory
    .onStdout(line -> System.out.print(line)) // streaming stdout callback
    .onStderr(line -> System.err.print(line));// streaming stderr callback
```

### CommandResult

| Field      | Type     | Description     |
|------------|----------|-----------------|
| `stdout`   | `String` | Standard output |
| `stderr`   | `String` | Standard error  |
| `exitCode` | `int`    | Exit code       |

### CommandHandle

Returned by `runBackground()` / `connect()`, implements `AutoCloseable`:

| Method                | Description                                     |
|-----------------------|-------------------------------------------------|
| `getPid()`            | Returns process PID                             |
| `isCompleted()`       | Whether completed                               |
| `waitForCompletion()` | Block until completion, returns `CommandResult` |
| `kill()`              | Terminate the process                           |
| `close()`             | Close streams and underlying HTTP resources     |

### Examples

```java
// Foreground execution
CommandResult res = client.commands.run("pwd");
System.out.println(res.getStdout());

// Execution with options + streaming output
CommandResult res2 = client.commands.run("ls -la /tmp",
    new RunOptions().cwd("/tmp").onStdout(System.out::print));

// Background start + manual Kill
CommandHandle handle = client.commands.runBackground("sleep 60", new RunOptions());
System.out.println("pid = " + handle.getPid());
handle.kill();
handle.close();

// List processes
List<ProcessInfo> procs = client.commands.list();
for (ProcessInfo p : procs) {
    System.out.printf("PID: %d, Cmd: %s%n", p.getPid(), p.getCmd());
}
```

---

## 4. Filesystem

Operate in-container files via `client.files`. Metadata operations use the envd Filesystem service; file content
read/write uses the HTTP `/files` endpoint.

### Methods

**Directory Operations**

| Method                                 | Description                                             |
|----------------------------------------|---------------------------------------------------------|
| `listDir(String path)`                 | List directory entries (depth=1)                        |
| `listDir(String path, int depth)`      | List directory entries (custom depth)                   |
| `makeDir(String path)`                 | Recursively create directory; returns `false` if exists |
| `move(String oldPath, String newPath)` | Rename/move a file or directory                         |

**File Information**

| Method                 | Description                                  |
|------------------------|----------------------------------------------|
| `exists(String path)`  | Check if path exists                         |
| `getInfo(String path)` | Get file/directory info, returns `EntryInfo` |

**File Read/Write**

| Method                                                | Description                                      |
|-------------------------------------------------------|--------------------------------------------------|
| `read(String path)`                                   | Read file content (`byte[]`)                     |
| `read(String path, String user)`                      | Read file content (specified user)               |
| `readText(String path)`                               | Read file content (`String`, UTF-8)              |
| `readText(String path, String user)`                  | Read file content (specified user, UTF-8)        |
| `write(String path, byte[] data)`                     | Write file (binary), returns `WriteInfo`         |
| `write(String path, byte[] data, String user)`        | Write file (specified user), returns `WriteInfo` |
| `writeText(String path, String content)`              | Write file (text, UTF-8), returns `WriteInfo`    |
| `writeText(String path, String content, String user)` | Write file (specified user), returns `WriteInfo` |

**Delete**

| Method                | Description                |
|-----------------------|----------------------------|
| `remove(String path)` | Delete a file or directory |

**Directory Watch**

| Method                                                                        | Description                              |
|-------------------------------------------------------------------------------|------------------------------------------|
| `watchDir(String path, Consumer<FilesystemEvent> onEvent)`                    | Watch directory change events            |
| `watchDir(String path, boolean recursive, Consumer<FilesystemEvent> onEvent)` | Watch directory changes (with recursion) |

### WatchHandle

| Method        | Description                                       |
|---------------|---------------------------------------------------|
| `stop()`      | Stop watching and close underlying HTTP resources |
| `isStopped()` | Whether stopped                                   |

### Examples

```java
// Directory operations
client.files.makeDir("/tmp/work");
List<EntryInfo> entries = client.files.listDir("/tmp");
client.files.move("/tmp/old.txt", "/tmp/new.txt");
client.files.remove("/tmp/work");

// File read/write
client.files.writeText("/tmp/hello.txt", "Hello, World!");
String content = client.files.readText("/tmp/hello.txt");

// Binary read/write
WriteInfo info = client.files.write("/tmp/data.bin", new byte[]{0x01, 0x02});
byte[] data = client.files.read("/tmp/data.bin");

// Directory watch
WatchHandle wh = client.files.watchDir("/tmp", true, event ->
    System.out.printf("Event: %s %s%n", event.getType(), event.getName()));
wh.stop();
```

---

## 5. Exception System

| Exception Class         | Description                                                                    |
|-------------------------|--------------------------------------------------------------------------------|
| `SandboxException`      | Sandbox runtime exception (command execution failure, stream read error, etc.) |
| `K8sOperationException` | K8s operation exception (CR query failure, token extraction failure, etc.)     |

---

## 6. Resource Management

`RuntimeClient` implements `AutoCloseable`. `close()` releases:

- OkHttpClient **Dispatcher** thread pool
- OkHttpClient **ConnectionPool** connection pool

Recommended to use try-with-resources:

```java
try (RuntimeClient client = RuntimeClient.create(sandboxID, config)) {
    // operations...
} // HTTP resources automatically released
```

> `close()` only releases local HTTP resources, **it does not terminate the remote sandbox**.

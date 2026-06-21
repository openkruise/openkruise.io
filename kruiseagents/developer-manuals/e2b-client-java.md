---
title: Java Client
---

## Dependency Import

This package is not yet published to Maven Central. You need to download the project
from [client-java](https://github.com/openkruise/agents-api/tree/master/k8s/java) and manually build the JAR file.

---

## Quick Start

```java
import io.openkruise.agents.client.e2b.*;

ConnectionConfig config = new ConnectionConfig.Builder()
    .apiKey("your-api-key")
    .domain("your.domain.com")
    .build();

SandboxApi api = new SandboxApi(config);

// Create → use → close connection + explicitly terminate sandbox
Sandbox sandbox = api.create("code-interpreter");
try (sandbox) {
    sandbox.commands.run("echo hello");
    sandbox.files.writeText("/tmp/demo.txt", "Hello!");
} finally {
    api.kill(sandbox.getSandboxID());  // explicitly terminate sandbox
}
```

Full
examples: [Lifecycle Management](https://github.com/openkruise/agents-api/blob/master/k8s/java/src/main/java/io/openkruise/agents/client/examples/e2b/SandboxApiManagerExample.java) | [Command Operations](https://github.com/openkruise/agents-api/blob/master/k8s/java/src/main/java/io/openkruise/agents/client/examples/e2b/SandboxCommandsExample.java) | [File Operations](https://github.com/openkruise/agents-api/blob/master/k8s/java/src/main/java/io/openkruise/agents/client/examples/e2b/SandboxFilesExample.java)

---

## 1. Sandbox Lifecycle Management (SandboxApi)

`SandboxApi` provides complete lifecycle management for Sandboxes: create, connect, query, pause, resume, and terminate.

### Initialization

```java
ConnectionConfig config = new ConnectionConfig.Builder()
    .apiKey("your-api-key")
    .domain("your.domain.com")
    .build();

SandboxApi api = new SandboxApi(config);
```

### API Methods

| Method                                                                             | Description                                          |
|------------------------------------------------------------------------------------|------------------------------------------------------|
| `create(String template)`                                                          | Create a sandbox from a template                     |
| `create(NewSandbox body)`                                                          | Create a sandbox (full parameters)                   |
| `connect(String sandboxID)`                                                        | Connect to an existing sandbox                       |
| `connect(String sandboxID, int timeout)`                                           | Connect to an existing sandbox (with timeout)        |
| `list()`                                                                           | List all running sandboxes                           |
| `list(String metadata)`                                                            | List with metadata filter                            |
| `list(String metadata, List<SandboxState> state, String nextToken, Integer limit)` | Paginated + state filtering                          |
| `getInfo(String sandboxID)`                                                        | Get details; 404 → `SandboxNotFoundException`        |
| `kill(String sandboxID)`                                                           | Terminate sandbox; `true` success, `false` not found |
| `pause(String sandboxID)`                                                          | Pause sandbox; 409 treated as already paused         |
| `setTimeout(String sandboxID, int timeout)`                                        | Modify timeout (seconds)                             |

### Lifecycle Example

```java
// ---- Create ----
Sandbox sandbox = api.create("code-interpreter");
String id = sandbox.getSandboxID();

// Full-parameter creation
Sandbox sandbox2 = api.create(new NewSandbox()
    .templateID("code-interpreter")
    .timeout(600)
    .envVars(Map.of("FOO", "1")));

// ---- Query ----
SandboxInfo info = api.getInfo(id);
List<SandboxInfo> all = api.list();

// ---- Connect to existing sandbox ----
Sandbox reconnected = api.connect(id);

// ---- Pause / Modify timeout ----
api.pause(id);
api.setTimeout(id, 600);

// ---- Terminate ----
api.kill(id);
```

### Sandbox Instance

`SandboxApi.create()` / `connect()` returns a `Sandbox` instance, which is the entry point for data-plane operations:

| Method/Field         | Description                                    |
|----------------------|------------------------------------------------|
| `sandboxID`          | Sandbox ID                                     |
| `commands`           | Command execution module (`Commands`)          |
| `files`              | Filesystem module (`Filesystem`)               |
| `getSandboxURL()`    | Sandbox envd URL                               |
| `getConfig()`        | Connection config                              |
| `getRuntimeClient()` | Underlying `RuntimeClient`                     |
| `close()`            | Close connection (supports try-with-resources) |

---

## 2. Command Execution (Commands)

Operate in-container processes via `sandbox.commands`. Uses OkHttp + Connect Protocol under the hood. Commands are
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
| `close()`             | Close streams and underlying resources          |

### Examples

```java
// Foreground execution
CommandResult res = sandbox.commands.run("pwd");
System.out.println(res.getStdout());

// Execution with options + streaming output
CommandResult res2 = sandbox.commands.run("ls -la /tmp",
    new RunOptions().cwd("/tmp").onStdout(System.out::print));

// Background start + manual Kill
CommandHandle handle = sandbox.commands.runBackground("sleep 60", new RunOptions());
System.out.println("pid = " + handle.getPid());
handle.kill();
handle.close();

// List processes
List<ProcessInfo> procs = sandbox.commands.list();
for (ProcessInfo p : procs) {
    System.out.printf("PID: %d, Cmd: %s%n", p.getPid(), p.getCmd());
}
```

---

## 3. Filesystem

Operate in-container files via `sandbox.files`. Metadata operations use the envd Filesystem service; file content
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
sandbox.files.makeDir("/tmp/work");
List<EntryInfo> entries = sandbox.files.listDir("/tmp");
sandbox.files.move("/tmp/old.txt", "/tmp/new.txt");
sandbox.files.remove("/tmp/work");

// File read/write
sandbox.files.writeText("/tmp/hello.txt", "Hello, World!");
String content = sandbox.files.readText("/tmp/hello.txt");

// Binary read/write
WriteInfo info = sandbox.files.write("/tmp/data.bin", new byte[]{0x01, 0x02});
byte[] data = sandbox.files.read("/tmp/data.bin");

// Directory watch
WatchHandle wh = sandbox.files.watchDir("/tmp", true, event ->
    System.out.printf("Event: %s %s%n", event.getType(), event.getName()));
wh.stop();
```

---

## 4. SandboxInfo (Immutable)

`SandboxInfo` is the return type of `list()` / `getInfo()`. It is an **immutable object** (all fields `final`, no
setters, `metadata` and `volumeMounts` are unmodifiable collections).

| Field                 | Type                       | Description                           |
|-----------------------|----------------------------|---------------------------------------|
| `sandboxID`           | `String`                   | Sandbox ID                            |
| `templateID`          | `String`                   | Template ID                           |
| `alias`               | `String`                   | Alias                                 |
| `clientID`            | `String`                   | Client ID                             |
| `startedAt`           | `OffsetDateTime`           | Start time                            |
| `endAt`               | `OffsetDateTime`           | End time                              |
| `cpuCount`            | `Integer`                  | CPU count                             |
| `memoryMB`            | `Integer`                  | Memory (MB)                           |
| `diskSizeMB`          | `Integer`                  | Disk (MB)                             |
| `envdVersion`         | `String`                   | envd version                          |
| `metadata`            | `Map<String, String>`      | Metadata (unmodifiable)               |
| `state`               | `String`                   | State                                 |
| `volumeMounts`        | `List<SandboxVolumeMount>` | Volume mounts (unmodifiable)          |
| `envdAccessToken`     | `String`                   | envd access token (detail only)       |
| `domain`              | `String`                   | Domain (detail only)                  |
| `allowInternetAccess` | `Boolean`                  | Internet access allowed (detail only) |
| `network`             | `SandboxNetworkConfig`     | Network config (detail only)          |
| `lifecycle`           | `SandboxLifecycle`         | Lifecycle (detail only)               |

---

## 5. Connection Configuration (ConnectionConfig)

### Scheme and Protocol

Connection behavior is determined by two orthogonal dimensions: **Scheme** and **Protocol**.

#### Protocol (Routing Protocol)

| Value                | API URL                          | Sandbox URL                                     |
|----------------------|----------------------------------|-------------------------------------------------|
| **Native (default)** | `https://api.<domain>`           | `https://<port>-<sandboxID>.<domain>`           |
| **Private**          | `<scheme>://<domain>/kruise/api` | `<scheme>://<domain>/kruise/<sandboxID>/<port>` |

- **Native**: Subdomain-based routing, for native public network deployments
- **Private**: Path-prefix-based routing through a unified gateway, suitable for private or port-forwarding scenarios

### Builder Methods

| Method                          | Description                                                    |
|---------------------------------|----------------------------------------------------------------|
| `.apiKey(String)`               | API Key, set in request header `X-API-Key`                     |
| `.accessToken(String)`          | Access Token, set in request header `X-Access-Token`           |
| `.domain(String)`               | Domain, defaults to `your.domain.com`                          |
| `.scheme(String)`               | URL scheme, defaults to `https`                                |
| `.protocol(Protocol)`           | Routing protocol, defaults to `Protocol.NATIVE`                |
| `.apiURL(String)`               | **Highest priority**: directly overrides API base URL          |
| `.sandboxBaseURL(String)`       | **Highest priority**: directly overrides sandbox envd base URL |
| `.requestTimeoutMs(long)`       | HTTP request timeout (ms), defaults to 60000                   |
| `.port(int)`                    | envd port, defaults to 49983                                   |
| `.debug(boolean)`               | Debug mode; kill/setTimeout skip actual calls                  |
| `.headers(Map<String, String>)` | Custom request headers                                         |
| `.addHeader(String, String)`    | Add a single custom request header                             |

### Priority

`apiURL` / `sandboxBaseURL` (explicit override) > `protocol` + `domain` assembly > environment variables (`E2B_API_KEY`,
`E2B_DOMAIN`) > defaults

### Environment Variables

The Builder automatically reads the following environment variables as defaults during construction, which can then be
overridden by Builder methods:

| Variable      | Description     |
|---------------|-----------------|
| `E2B_API_KEY` | Default API Key |
| `E2B_DOMAIN`  | Default domain  |

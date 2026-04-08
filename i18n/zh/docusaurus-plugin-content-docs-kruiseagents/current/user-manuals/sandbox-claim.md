import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 获取沙箱

Agent 应用可以通过以下方式从 OpenKruise Agents 中获取一个沙箱。

> 如果预热池中存在 available 状态的沙箱，交付速度为亚秒级。否则，将会等待沙箱补充与就绪，交付效率受集群性能影响。

> ⚠️ 注意：OpenKruise Agents 的高级功能依赖于 `agent-runtime` 组件，`sandbox-manager` 或 `sandbox-controller` 通过 `49983` 
> 端口与该组件进行通信。如果您的集群中存在防火墙、安全组等防护机制，请确保对于所有 Sandbox Pod，该端口是开放的。如果您确认不需要注入
> `agent-runtime` 也不需要使用任何高级功能，请参考 [跳过 agent-runtime 初始化](#跳过-agent-runtime-初始化)

## 通过 E2B SDK 获取沙箱

> ⚠️ 注意：使用 E2B SDK 之前，请务必参考 [E2B SDK 接入文档](../developer-manuals/e2b-client.md) ，根据自己的域名、证书等条件，选择合适的
> E2B 接入方式，并正确配置客户端与服务端的 `E2B_DOMAIN`。

[E2B](https://e2b.dev) 是一个开源的沙箱 SDK。它提供了 Python 与 JavaScript 客户端，供用户方便快速地管理沙箱。
`OpenKruise Agents` 的 `sandbox-manager` 组件提供了兼容原生 E2B 协议与定制 E2B 协议的后端服务，允许用户通过编程的方式获取、操作沙箱。

以下是一个通过 E2B Python SDK 获取沙箱的示例：

```python
from e2b_code_interpreter import Sandbox

with Sandbox.create(template="demo") as sbx:
    print(sbx.get_info())
```

说明：

- **template 参数**：`SandboxSet` 的名称。如果在多个 namespace 中存在同名的 `SandboxSet`，则会随机选取。因此，推荐避免使用同名的
  `SandboxSet`，或同名 `SandboxSet` 采取相同的配置。
- E2B 的完整功能需要 `agent-runtime` 支持，`run_code` 功能需要使用专门的 `code_interpreter`
  镜像。具体请参考 [e2b-code-interpreter](../best-practices/running-e2b-for-code-interpreter.md)。

## 通过 SandboxClaim 获取沙箱

`SandboxClaim` CRD 允许用户声明式地获取沙箱。你可以通过下面这个最简单的 SandboxClaim 来获取一个沙箱：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo # SandboxSet name
```

> `SandboxClaim` 的缩写是 `sbc`

这个 SandboxClaim 将会从 **同 namespace** 下的 SandboxSet 中获取一个沙箱。你可以通过以下命令查看 claim 的工作进度：

```shell
$ kubectl get sbc
NAME                 PHASE       TEMPLATE   DESIRED   CLAIMED   AGE
demo-sandbox-claim   Completed   demo       1         1         41s
```

当发现 `PHASE` 变为 `Completed` 时，表示 claim 已经成功获取到沙箱。你可以通过以下 label 获取分配到的沙箱并进行后续使用：

```shell
$ kubectl get sbx -l agents.kruise.io/claim-name=demo-sandbox-claim # short name of Sandbox
NAME   STATUS    AGE   SHUTDOWN_TIME   PAUSE_TIME   MESSAGE
demo   Running   20m                                
```

### 批量获取沙箱

你可以为 `SandboxClaim` 指定 replicas 参数来批量地获取多个沙箱：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo

  # Number of sandboxes to claim (default: 1)
  replicas: 10

  # Optional: Claim timeout (default: 1m)
  claimTimeout: 1m

  # Optional: TTL after completion (auto-delete SandboxClaim resource)
  # The claimed sandboxes will NOT be deleted
  ttlAfterCompleted: 5m
```

参数说明：

- **replicas**：指定获取的沙箱数量。
- **claimTimeout**：指定 claim 的超时时间。最多尝试任务的时间。
- **ttlAfterCompleted**：指定 claim 完成后的 TTL 时间。claim 任务完成后，经过 TTL 时间，SandboxClaim
  资源会被删除（获取到的沙箱不会被删除）。

批量获取是一个尽力而为、逐渐交付的功能。也就是说：

- 受预热池库存、集群资源等因素影响，最终可能无法获取到指定数量的沙箱。
- 任务完成（或超时）前，已经获取到的沙箱会逐渐交付。通过 `agents.kruise.io/claim-name=<sbc-name>` 标签可以实时过滤已交付的所有沙箱。

> 在 E2B 中，通过添加 `e2b.agents.kruise.io/claim-timeout-seconds` 元数据来指定单次 claim 的服务端超时时间，
> 通过 request_timeout 参数指定客户端超时时间。

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", request_timeout=60.0, metadata={
    "e2b.agents.kruise.io/claim-timeout-seconds": "60"
})
```

## 基于模板直接创建沙箱

默认情况下，`OpenKruise Agents` 总是会从模板的预热池中获取沙箱。如果预热池中没有可用的沙箱，将会等待沙箱补充与就绪。
对于一些特殊场景（比如不希望进行沙箱预热、不希望进行原地升级等），用户可以选择基于模板直接创建沙箱，而不需要等待预热池补充。
基于模板直接创建时，sandbox-manager / SandboxClaim controller 将会通过传入的 templateID 检索到 SandboxSet，
并根据其配置创建新的沙箱。

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/create-on-no-stock": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  createOnNoStock: true
```

  </TabItem>

</Tabs>

## 高级功能

`OpenKruise Agents` 的沙箱获取功能包含一系列高级功能，可以分别通过 `E2B` 与 `SandboxClaim` 使用。

### 沙箱超时

你可以在获取沙箱时指定超时时间。沙箱在达到超时时间后，会被自动删除。

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", timeout=600)  # timeout in seconds
```

默认情况下，沙箱在达到超时时间后会被自动删除。如果你希望沙箱永不超时、持续运行，可以使用永不超时扩展。
> `e2b.agents.kruise.io/never-timeout` 为 OpenKruise Agents 扩展字段，
> 不会作为元数据添加到 Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/never-timeout": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 format absolute time to delete the sandboxes claimed。
  # It is recommended to set this field programmatically, for example: 
  # sbc.Spec.ShutdownTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  shutdownTime: 2026-02-06T07:33:30Z
```

  </TabItem>

</Tabs>

### 自动休眠

自动休眠与沙箱超时类似，在沙箱达到指定时间后，会自动进入休眠状态（paused）。

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.beta_create(template="demo", timeout=600, auto_pause=True)  # auto pause in seconds
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # RFC 3339 格式的绝对时间，用于将获取的沙箱自动暂停。
  # 建议通过编程方式设置此字段，例如：
  # sbc.Spec.PauseTime = metav1.NewTime(time.Now().Add(5 * time.Minute))
  pauseTime: 2026-02-06T07:33:30Z
```

  </TabItem>

</Tabs>

### 添加元数据

你可以在获取沙箱的同时，为 `Sandbox` 资源添加一些元数据（labels 或 annotations），以将多次获取的沙箱进行归类或添加一些自定义信息。

<Tabs>
  <TabItem value="E2B" label="E2B">

> 通过 E2B 设置的 metadata 将作为 annotations 存储

```python
from e2b_code_interpreter import Sandbox, SandboxQuery

Sandbox.create(template="demo", metadata={"userId": "alice"})
paginator = Sandbox.list(query=SandboxQuery(metadata={"userId": "alice"}))
print(paginator.next_items())
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  labels:
    userId: "alice"
  annotations:
    foo: "bar"
```

  </TabItem>
</Tabs>

### 替换镜像

你可以在获取沙箱的同时，指定一个镜像替换为沙箱的主容器镜像，这在一些强化学习场景非常有用。该功能的具体行为是：

- 如果从 SandboxSet 预热池中获取，将会执行一次原地升级（inplace update），将运行中的容器镜像替换为指定的镜像。
- 如果基于 SandboxSet 创建，将会直接以指定的镜像创建新的 Sandbox。

使用原地升级会影响 create 接口的交付速度，可能无法在亚秒级完成交付。

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/image` 为 OpenKruise Agents 扩展字段，不会作为元数据添加到 Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", metadata={
    "e2b.agents.kruise.io/image": "new-image:latest"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  inplaceUpdate:
    image: "new-image:latest"
```

  </TabItem>
</Tabs>

### 动态挂载持久化卷

你可以在获取沙箱时动态挂载一个 PV，为每个沙箱指定单独的挂载卷。这个能力依赖注入到 Sandbox 中的 `agent-runtime`
，并且也会一定程度上影响交付效率。

> ⚠️ 要使用动态持久化卷挂载功能，你必须在 SandboxSet 的 `runtimes` 字段中配置 `csi`。详情请参考[运行时注入](./runtime-injection.md)文档。

<Tabs>
  <TabItem value="E2B" label="E2B">

> 以下扩展字段为 OpenKruise Agents 扩展字段，不会作为元数据添加到 Sandbox 资源上。

**单卷挂载：**

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-name": "oss-pv-test",
    "e2b.agents.kruise.io/csi-mount-point": "/data",
    # 可选：指定持久化卷中的子路径
    "e2b.agents.kruise.io/csi-subpath": "sub/dir"
})
```

**多卷挂载：**

如果需要同时挂载多个卷，可以使用 `e2b.agents.kruise.io/csi-volume-config` 扩展字段，传入 JSON 数组：

```python
import json
from e2b_code_interpreter import Sandbox

csi_config = json.dumps([
    {"pvName": "oss-pv-1", "mountPath": "/data1"},
    {"pvName": "oss-pv-2", "mountPath": "/data2", "subPath": "sub/dir", "readOnly": True}
])

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-config": csi_config
})
```

参数说明：

| 扩展字段                                     | 说明                   | 是否必填    |
|------------------------------------------|----------------------|---------|
| `e2b.agents.kruise.io/csi-volume-name`   | 持久化卷名称               | 是（单卷挂载） |
| `e2b.agents.kruise.io/csi-mount-point`   | 容器内挂载目标路径            | 是（单卷挂载） |
| `e2b.agents.kruise.io/csi-subpath`       | 持久化卷中的子路径            | 否       |
| `e2b.agents.kruise.io/csi-volume-config` | JSON 数组格式的挂载配置（多卷挂载） | 是（多卷挂载） |

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  dynamicVolumesMount:
    - pvName: "oss-pv-1"
      mountPath: "/data1"
    - pvName: "oss-pv-2"
      mountPath: "/data2"
      subPath: "sub/dir"
      readOnly: true
```

字段说明：

| 字段          | 说明        | 是否必填 |
|-------------|-----------|------|
| `pvName`    | 持久化卷名称    | 是    |
| `mountPath` | 容器内挂载目标路径 | 是    |
| `subPath`   | 持久化卷中的子路径 | 否    |
| `readOnly`  | 是否以只读方式挂载 | 否    |

  </TabItem>
</Tabs>

### 跳过 agent-runtime 初始化

一般情况下，沙箱中都应当注入 `agent-runtime` 以提供代码执行、远程操作、存储挂载等一系列功能。`OpenKruise Agents` 在获取沙箱的过程中，
会对 `agent-runtime` 进行初始化。如果用户需要高度自定义而不使用 `agent-runtime`，可以在获取沙箱时跳过 `agent-runtime` 的初始化流程。

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/skip-init-runtime` 为 OpenKruise Agents 扩展字段，
> 不会作为元数据添加到 Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/skip-init-runtime": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  skipInitRuntime: true
```

  </TabItem>

</Tabs>


### 问题排查

由于各种原因，在获取沙箱的过程中，可能会发生错误导致获取失败。默认情况下，Sandbox Manager 与 SandboxClaim Controller
会删除发生错误的沙箱，
并重试获取一个新的沙箱。如果你需要保留发生错误的 Sandbox 实例及其对应的 Pod 用于问题排查，可以在获取沙箱时添加以下参数以跳过沙箱的删除：

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/reserve-failed-sandbox` 为 OpenKruise Agents 扩展字段，
> 不会作为元数据添加到 Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/reserve-failed-sandbox": "true"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  reserveFailedSandbox: true
```

  </TabItem>
</Tabs>

### 环境变量注入

你可以在获取沙箱时注入环境变量。这些环境变量将传递给 `agent-runtime` 用于初始化。该功能需要启用 `agent-runtime`。

> ⚠️ 注意：目前通过该功能注入的环境变量仅对 E2B 的 `commands.run` 接口生效，不会作为沙箱主容器的进程级环境变量生效。

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", envs={
    "MY_ENV": "value",
    "API_KEY": "sk-xxx"
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  envVars:
    MY_ENV: "value"
    API_KEY: "sk-xxx"
```

  </TabItem>
</Tabs>

### 等待就绪超时

在获取沙箱的过程中，如果执行了某些操作（如原地升级镜像、创建新沙箱等），沙箱可能需要一段时间才能就绪。你可以指定等待就绪超时时间，控制等待沙箱就绪的最大时长。

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/wait-ready-timeout-seconds` 为 OpenKruise Agents 扩展字段，
> 不会作为元数据添加到 Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo", metadata={
    "e2b.agents.kruise.io/wait-ready-timeout-seconds": "60"  # 最多等待 60 秒
})
```

  </TabItem>
  <TabItem value="SandboxClaim" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-sandbox-claim
  namespace: default
spec:
  templateName: demo
  # 默认值：30s。格式：duration 字符串（如 "3h"、"200s"、"15m"）
  waitReadyTimeout: 60s
```

  </TabItem>
</Tabs>
# 获取沙箱

Agent 应用可以通过以下方式从 OpenKruise Agents 中获取一个沙箱。

> 如果预热池中存在 available 状态的沙箱，交付速度为压秒级。否则，将会等待沙箱补充与就绪，交付效率受集群性能影响。

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
- **claimTimeout**：指定 claim 的超时时间。最多尝试工作的时间。
- **ttlAfterCompleted**：指定 claim 完成后的 TTL 时间。claim 任务完成后，经过 TTL 时间，SandboxClaim
  资源会被删除（获取到的沙箱不会被删除）。

批量获取是一个尽力而为、逐渐交付的功能。也就是说：

- 受预热池库存、集群资源等因素影响，最终可能无法获取到指定数量的沙箱。
- 任务完成（或超时）前，已经获取到的沙箱会逐渐交付。通过 `agents.kruise.io/claim-name=<sbc-name>` 标签可以实时过滤已交付的所有沙箱。

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

> 目前只支持通过 E2B 使用自动休眠功能。如果你的 E2B 客户端没有 `auto_pause` 参数，请升级到最新版本。

<Tabs>
  <TabItem value="E2B" label="E2B">

```python
from e2b_code_interpreter import Sandbox

Sandbox.beta_create(template="demo", timeout=600, auto_pause=True)  # auto pause in seconds
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

### 原地升级

你可以在获取沙箱的同时，指定一个镜像对沙箱的主容器进行原地升级，将预热的容器镜像替换为指定的镜像。这在一些强化学习场景非常有用。使用原地升级会影响
create 接口的交付速度，可能无法在亚秒级完成交付。

> 目前只支持通过 E2B 使用原地升级功能。

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
</Tabs>

### 动态挂载持久化卷

你可以在获取沙箱时动态挂载一个 PV，为每个沙箱指定单独的挂载卷。这个能力依赖注入到 Sandbox 中的 `agent-runtime`
，并且也会一定程度下影响交付效率。

> 目前只支持通过 E2B 使用动态挂载持久化卷功能。

<Tabs>
  <TabItem value="E2B" label="E2B">

> `e2b.agents.kruise.io/csi-volume-name` 与 `e2b.agents.kruise.io/csi-mount-point` 为 OpenKruise Agents 扩展字段，
> 不会作为元数据添加到Sandbox 资源上。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="some-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-name": "oss-pv-test",
    "e2b.agents.kruise.io/csi-mount-point": "/data"
})
```

  </TabItem>
</Tabs>
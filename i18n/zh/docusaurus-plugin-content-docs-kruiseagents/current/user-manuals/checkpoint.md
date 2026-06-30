import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快照管理

## 概述

`Checkpoint` 是 OpenKruise Agents 的一等公民 CRD。每个 `Checkpoint` 对象捕获运行中沙箱 Pod 某一时刻的状态（**内存** 和/或 **文件系统**），之后可以用它作为起点克隆（Fork）出全新的沙箱。

OpenKruise Agents 通过 **两种** 并列的接入方式对外暴露 Checkpoint 能力，底层操作的是同一个 `Checkpoint` CR：

| 接入方式                  | 面向的使用者                                                | 典型场景                                     |
|---------------------------|------------------------------------------------------------|---------------------------------------------|
| Kubernetes CRD            | 集群运维、声明式 GitOps、`kubectl` 或自定义控制器直接使用   | 原生地创建/查看/删除/回收 Checkpoint        |
| E2B SDK（Snapshot API）   | 基于 E2B Python / JavaScript SDK 的应用代码                 | 在沙箱进程内以编程方式管理快照生命周期       |

> E2B SDK 把这一能力称为 **Snapshot**；在 OpenKruise Agents 内部，其底层对象是 `Checkpoint` CR —— E2B 返回的 `snapshotId` 就是 `Checkpoint` 的名称。本文以 Checkpoint 为核心，配套展示两种接入方式的使用方法。

## Checkpoint vs. 休眠/唤醒

Checkpoint 与[休眠/唤醒](./pause-resume.md)底层共享同一套捕获机制，但面向的场景不同：

|                      | 暂停/恢复（Pause/Resume）                      | Checkpoint（快照）                              |
|----------------------|-----------------------------------------------|------------------------------------------------|
| 对源沙箱的影响         | 被暂停（停止运行）                              | 短暂暂停后按配置恢复运行                         |
| 关系                 | 一对一 —— 恢复后仍是同一个沙箱                  | 一对多 —— 一个 Checkpoint 可克隆出多个新沙箱       |
| 操作后沙箱 ID         | 保持不变                                       | 源沙箱 ID 不变；克隆出的新沙箱各自有新的 ID       |
| 典型场景             | 挂起单个沙箱稍后继续使用                        | 检查点、回滚、从运行时状态分叉                   |

## Checkpoint CRD

`Checkpoint` 资源（`agents.kruise.io/v1alpha1`，缩写 `cp`）的关键字段如下：

| 字段                        | 类型       | 说明                                                                                                          |
|----------------------------|------------|---------------------------------------------------------------------------------------------------------------|
| `spec.podName`             | `string`   | 要执行 checkpoint 的目标 Pod 名称，通常等于源沙箱名称。                                                          |
| `spec.sandboxName`         | `string`   | 可选。当仅靠 `podName` 不足以定位源沙箱时使用。                                                                 |
| `spec.keepRunning`         | `bool`     | checkpoint 完成后源 Pod 是否继续 Running，默认 `true`。若为 `false`，Pod 阶段会变为 `Succeeded`。                |
| `spec.persistentContents`  | `[]string` | 要持久化的内容。可选值：`memory`、`filesystem`。为空时默认两者都启用（从源模板继承）。                           |
| `spec.ttlAfterFinished`    | `string`   | Go duration（如 `30m`、`24h`、`30d`）。配置后 Checkpoint CR 到期自动删除；不配置表示保留直到被主动删除。         |
| `status.phase`             | `string`   | `Pending` / `Creating` / `Succeeded` / `Failed` / `Terminating`。                                             |
| `status.checkpointId`      | `string`   | 底层 Checkpoint 驱动中该快照的标识。阶段变为 `Succeeded` 时写入。                                               |
| `status.completionTime`    | `Time`     | 阶段进入 `Succeeded` 或 `Failed` 时写入。                                                                      |

## 创建 Checkpoint

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

对目标 Pod / Sandbox 直接 apply 一个 `Checkpoint` 清单：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Checkpoint
metadata:
  name: checkpoint-code-demo-01
  namespace: default
spec:
  # 目标 Pod Name
  podName: code-interpreter-28rvn
  # checkpoint 之后是否要求 Pod 处于 Running 状态。
  # 如果是 false，Pod 阶段会变为 Succeeded。
  keepRunning: true
  # Checkpoint 回收时间，到期后产品侧会主动删除 Checkpoint CR；
  # 不配置则默认不回收，由用户主动删除 Checkpoint CR 释放底层资源。
  ttlAfterFinished: 30h # 格式，例如 30m、30h、30d
  # 要持久化的内容，目前仅支持 memory 和 filesystem 组合，默认两者都启用。
  persistentContents:
    - memory
    - filesystem
```

查看 Checkpoint 进度：

```shell
$ kubectl get cp
NAME                       STATUS      AGE
checkpoint-code-demo-01    Succeeded   24s
```

当 `STATUS` 变为 `Succeeded` 时，即可作为新沙箱的起点。

</TabItem>
<TabItem value="E2B" label="E2B SDK">

在运行中的沙箱上调用 `createSnapshot`。沙箱会被短暂暂停，写入 Checkpoint 后自动恢复运行。返回的 `snapshotId` 就是底层 Checkpoint 的名称。

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(template="demo")

snapshot = sbx.create_snapshot()
print("Snapshot ID:", snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create('demo')

const snapshot = await sandbox.createSnapshot()
console.log('Snapshot ID:', snapshot.snapshotId)
```

#### OpenKruise Agents 扩展

`createSnapshot` 支持以下通过自定义 HTTP 头传入的 OpenKruise Agents 扩展字段，它们与 `Checkpoint.spec` 字段一一对应，仅在 OpenKruise Agents 部署的 sandbox-manager 上生效。

| HTTP 头                                         | 对应 `Checkpoint.spec` 字段         | 示例                |
|-------------------------------------------------|-------------------------------------|---------------------|
| `x-e2b-kruise-snapshot-keep-running`            | `keepRunning`                       | `true`              |
| `x-e2b-kruise-snapshot-ttl`                     | `ttlAfterFinished`                  | `24h`               |
| `x-e2b-kruise-snapshot-persistent-contents`     | `persistentContents`                | `memory,filesystem` |
| `x-e2b-kruise-snapshot-wait-success-seconds`    | 服务端等待 Checkpoint 达到 `Succeeded` 的时间（秒） | `60`                |

通过 SDK 的客户端工厂注入上述头，或直接调用 REST 接口：

```shell
curl -X POST "https://api.${E2B_DOMAIN}/sandboxes/${SANDBOX_ID}/snapshots" \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  -H "x-e2b-kruise-snapshot-ttl: 24h" \
  -H "x-e2b-kruise-snapshot-persistent-contents: memory,filesystem" \
  -d '{}'
```

</TabItem>
</Tabs>

## 列出 Checkpoint

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

使用缩写 `cp` 直接 `kubectl` 查看（Checkpoint 按 namespace 隔离）：

```shell
$ kubectl get cp -n default
NAME                       STATUS      AGE
checkpoint-code-demo-01    Succeeded   5m
checkpoint-code-demo-02    Creating    10s
```

也可以通过 `agents.kruise.io/sandbox-name` label 按源沙箱过滤（E2B 接口创建的 Checkpoint 会自动带上该 label；CRD 直接创建时可以手动设置）：

```shell
$ kubectl get cp -l agents.kruise.io/sandbox-name=code-interpreter-28rvn
```

</TabItem>
<TabItem value="E2B" label="E2B SDK">

`listSnapshots` 仅返回阶段为 `Succeeded` 且归属当前 API-key 用户的 Checkpoint，按 `CreationTimestamp` 降序排序，支持服务端分页。

```python
from e2b_code_interpreter import Sandbox

paginator = Sandbox.list_snapshots()
snapshots = []
while paginator.has_next:
    snapshots.extend(paginator.next_items())
```

```ts
import { Sandbox } from 'e2b'

const paginator = Sandbox.listSnapshots()
const snapshots = []
while (paginator.hasNext) {
  snapshots.push(...(await paginator.nextItems()))
}
```

按源沙箱过滤：

```python
paginator = Sandbox.list_snapshots(sandbox_id="your-sandbox-id")
```

`GET /snapshots` 支持的查询参数：

| 查询参数      | 说明                                                  | 取值范围 |
|---------------|-------------------------------------------------------|----------|
| `limit`       | 每页最大条数                                          | 1–100    |
| `nextToken`   | 通过响应头 `x-next-token` 返回的下一页游标             | —        |
| `sandboxID`   | 仅返回从指定沙箱创建的 Checkpoint                      | —        |

</TabItem>
</Tabs>

## 删除 Checkpoint

删除 Checkpoint 会同时清理 `Checkpoint` CR 以及其配对的 `SandboxTemplate`。**已经** 从它克隆 / Fork 出的沙箱不受影响。

<Tabs>
<TabItem value="CRD" label="Kubernetes CRD">

```shell
kubectl delete cp checkpoint-code-demo-01 -n default
```

也可以依赖 `spec.ttlAfterFinished` 自动回收。

</TabItem>
<TabItem value="E2B" label="E2B SDK">

`deleteSnapshot` 是 **幂等** 操作 —— 删除不存在的快照也返回成功。

```python
from e2b_code_interpreter import Sandbox

deleted = Sandbox.delete_snapshot(snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const deleted = await Sandbox.deleteSnapshot(snapshot.snapshotId)
```

> E2B 的删除端点不允许删除用户自管的 `SandboxSet` 模板，这类模板必须通过 Kubernetes 管理（参考 [获取沙箱](./sandbox-claim.md)）。

</TabItem>
</Tabs>

## 从 Checkpoint 创建沙箱

状态为 `Succeeded` 的 Checkpoint 可以作为新沙箱的起点，传入其 `Checkpoint.name` 作为模板标识即可。

<Tabs>
<TabItem value="CRD" label="SandboxClaim">

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: demo-from-checkpoint
  namespace: default
spec:
  # 当同 namespace 存在与此同名的 Checkpoint 时，
  # SandboxClaim 会走克隆路径，而不是从 warm pool 获取。
  templateName: checkpoint-code-demo-01
```

</TabItem>
<TabItem value="E2B" label="E2B SDK">

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id)
```

```ts
import { Sandbox } from 'e2b'

const newSandbox = await Sandbox.create(snapshot.snapshotId)
```

</TabItem>
</Tabs>

#### 沙箱命名（v0.3.0+）

:::note
**v0.3.0+**：自定义沙箱命名仅在从 Checkpoint 创建沙箱（克隆路径）时支持。
从 SandboxSet 预热池获取沙箱时**不可用**——请求将被拒绝。
:::

从 Checkpoint 创建沙箱时，可以控制新沙箱的名称，而不必依赖系统自动生成的随机名称。

> `e2b.agents.kruise.io/sandbox-name` 和 `e2b.agents.kruise.io/sandbox-generate-name` 为 OpenKruise Agents
> 扩展字段，不会作为元数据添加到 Sandbox 资源上。

**固定名称：**

使用 `e2b.agents.kruise.io/sandbox-name` 为沙箱指定一个固定名称。名称必须是合法的
[Kubernetes DNS-1123 标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
（最多 63 个字符，小写字母数字或 `-`，必须以字母数字开头和结尾）。

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id, metadata={
    "e2b.agents.kruise.io/sandbox-name": "my-restored-sandbox"
})
```

**自动生成名称：**

使用 `e2b.agents.kruise.io/sandbox-generate-name` 指定名称前缀，系统会自动追加一个 5 位的随机后缀
（如 `fork-` → `fork-abcde`）。前缀必须以 `-` 结尾，并遵循相同的 DNS-1123 标签规则。

```python
from e2b_code_interpreter import Sandbox

new_sbx = Sandbox.create(template=snapshot.snapshot_id, metadata={
    "e2b.agents.kruise.io/sandbox-generate-name": "fork-"
})
# new_sbx.sandbox_id 可能是 "default--fork-x7k9a"
```

> `sandbox-name` 和 `sandbox-generate-name` **互斥**。若同时指定两者，请求将被拒绝并返回错误。

完整的 claim 选项请参考 [获取沙箱](./sandbox-claim.md)。

## Checkpoint vs. SandboxTemplate / SandboxSet

Checkpoint 与模板都能作为沙箱的可复用起点，但解决的问题不同：

|              | `SandboxTemplate` / `SandboxSet`                    | `Checkpoint`（快照）                             |
|--------------|-----------------------------------------------------|-------------------------------------------------|
| 定义方式      | 声明式 CRD + 镜像                                    | 捕获运行中的沙箱                                  |
| 可重现性      | 同一定义始终产出相同沙箱                              | 捕获的是当时的运行时状态                          |
| 适用场景      | 可复用的基础环境、预热池                              | 检查点、回滚、从运行时状态分叉                    |

当希望每个沙箱都从相同的预置基线启动时，使用模板；当需要捕获或分叉依赖执行过程的实时状态时，使用 Checkpoint。

## 注意事项

1. **连接会断开**：捕获期间源沙箱会被短暂暂停，所有活动的 WebSocket、PTY、命令流连接都会断开。客户端必须能够重连。
2. **后端依赖**：具体的 Checkpoint 语义（保留什么内容、速度、体积）取决于集群中配置的 Checkpoint 驱动。
3. **E2B 接入按用户隔离**：`listSnapshots` 与 E2B 的删除路径都按创建它的 API-key 用户隔离；Admin Team 的 API-key 在 `listSnapshots` 中可跨 namespace 查看。
4. **CRD 接入不做用户隔离**：通过 `kubectl` / CRD 直接访问时，只受 Kubernetes RBAC（`checkpoints.agents.kruise.io`）约束，不经过 E2B 的用户维度校验。
5. **E2B `deleteSnapshot` 共用删除端点**：`DELETE /templates/{id}` 同时承担 Checkpoint 与模板的删除路由。Checkpoint 可以通过 E2B 接口删除；`SandboxSet` 形式的模板不允许通过 E2B 接口删除。

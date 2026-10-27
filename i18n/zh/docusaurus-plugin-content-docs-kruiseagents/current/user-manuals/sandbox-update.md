# 升级沙箱

本文档介绍如何升级由 OpenKruise Agents 管理的沙箱，包括 **预热池沙箱**（由 SandboxSet 管理）和 **已认领沙箱**（已分配给用户）。

:::info 版本
基础升级流程（SandboxSet 滚动升级和 SandboxUpdateOps 重建升级）自 **v0.3.0** 起可用。
升级已暂停沙箱（`stateFilter`）以及 `CheckpointRestore` 升级模式需要 **v0.6.0**。
:::

## 概述

OpenKruise Agents 支持两种升级场景：

| 场景 | 目标资源 | 升级方式 | 说明 |
|---|---|---|---|
| 预热池 | SandboxSet | 滚动升级 | 修改 SandboxSet 中的 `spec.template`，触发空闲沙箱的滚动升级 |
| 已认领沙箱 | SandboxUpdateOps | 批量重建 | 创建一个 SandboxUpdateOps 资源，对已被认领并正在运行的沙箱进行批量升级 |

## 前置条件

- 已安装并正在运行 OpenKruise Agents 控制器。
- 集群中已注册 CRD（`Sandbox`、`SandboxSet`、`SandboxUpdateOps`）。
- 对于带有生命周期钩子的已认领沙箱升级，必须启用 `agent-runtime` Sidecar（用于执行升级前/升级后脚本），如果需要持久化存储挂载，则还需启用 `csi`。

## 升级预热池沙箱（SandboxSet）

预热池中的空闲沙箱通过修改 SandboxSet 模板进行升级，模板变更会触发池内沙箱的滚动升级。需要注意的是，控制器会持续将预热池的状态写回 SandboxSet 对象，因此修改副本数必须通过 `scale` 子资源进行，模板变更也必须以 patch 的方式提交，而不是整体更新。

完整的操作说明（包括如何使用 `scale` 子资源和以 patch 方式更新），请参考 [预热池管理](./warmpool-management.md) 中的 [升级预热池沙箱](./warmpool-management.md#升级预热池沙箱)。

## 升级已认领沙箱（SandboxUpdateOps）

### 工作原理

已认领沙箱是已分配给用户并运行了工作负载的沙箱。要升级它们，你需要创建一个 **SandboxUpdateOps** 资源，它会：

1. 通过标签选择器选择目标沙箱。
2. 对每个沙箱的模板应用 Strategic Merge Patch。
3. 可选地设置生命周期钩子（升级前/升级后），用于数据备份和恢复。
4. 然后由沙箱控制器对每个沙箱执行 **Recreate**（重建）升级——执行三阶段生命周期：

```
PreUpgrade（备份） → UpgradePod（删除旧 Pod + 创建新 Pod） → PostUpgrade（恢复）
```

### 重要约束

- **服务中断**：Recreate 升级会删除旧 Pod 并创建新 Pod。沙箱在升级过程中将不可用。
- **内存与 IP 丢失**：在重建过程中内存状态和 IP 地址会丢失（新 Pod 会获得新 IP）。
- **每个命名空间只允许一个活跃的 SandboxUpdateOps**：在同一命名空间内，同一时间只能有一个 SandboxUpdateOps 在主动升级沙箱。
- **生命周期钩子需要 agent-runtime**：升级前/升级后脚本通过 `agent-runtime` Sidecar 执行。请确保目标沙箱配置了 `runtimes: [{name: "agent-runtime"}]`。
- **持久化存储需要 CSI**：如果沙箱需要在升级过程中保留文件系统数据，必须配置 `runtimes: [{name: "csi"}]` 来挂载外部存储。

### 配置

#### 基础示例（仅更新镜像）

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-my-sandboxes
  namespace: default
spec:
  selector:
    matchLabels:
      agents.kruise.io/sandbox-template: my-sandbox-pool
  updateStrategy:
    # 同时进行升级的沙箱最大数量。
    # 可以是绝对值或百分比。
    maxUnavailable: 2
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2
```

#### 带生命周期钩子的完整示例

使用生命周期钩子，可以在升级前备份工作区数据，并在新 Pod 运行后恢复数据：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-with-backup
  namespace: default
spec:
  selector:
    matchLabels:
      agents.kruise.io/sandbox-template: my-sandbox-pool
  updateStrategy:
    maxUnavailable: 1
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2
  lifecycle:
    preUpgrade:
      exec:
        command:
          - /bin/bash
          - -c
          - |
            # 在 Pod 销毁之前，将工作区数据备份到外部存储
            tar czf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace .
            echo "Backup completed"
      timeoutSeconds: 120
    postUpgrade:
      exec:
        command:
          - /bin/bash
          - -c
          - |
            # 在新 Pod 就绪之后，从外部存储恢复工作区数据
            if [ -f /mnt/shared/backup-$(hostname).tar.gz ]; then
              tar xzf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace
              rm -f /mnt/shared/backup-$(hostname).tar.gz
              echo "Restore completed"
            fi
      timeoutSeconds: 120
```

**关于生命周期钩子的说明：**
- `preUpgrade`：在旧 Pod 被删除 **之前** 执行。可用于保存状态（例如将文件备份到外部/共享存储）。
- `postUpgrade`：在新 Pod 运行并就绪 **之后** 执行。可用于恢复状态。
- `timeoutSeconds`：等待钩子完成的最长时间（秒）。默认为 60 秒。
- `exec.command` 通过 agent-runtime（envd）接口在沙箱内部执行。

### Patch 能力

`spec.patch` 字段会以
[Strategic Merge Patch](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
的方式应用到每个被选中的沙箱。它支持以下操作：

- **更新（Update）**：修改已有字段，例如容器镜像或环境变量。
- **新增（Add）**：引入新字段，例如新增一个 volume 或 volume mount。
- **删除（Delete）**：通过使用 `$patch: delete` 及其 merge key 标记某个列表项（如 volume 或 mount）来将其删除。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: patch-demo
  namespace: default
spec:
  patch:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2   # 更新
          env:
            - name: LOG_LEVEL                    # 新增
              value: debug
      volumes:
        - name: legacy-cache                     # 删除
          $patch: delete
```

### 升级模式

:::info 版本
`CheckpointRestore` 模式自 **v0.6.0** 起可用。
:::

`spec.updateStrategy.type` 用于选择每个沙箱的升级方式：

| 模式 | 说明 | 约束 |
|---|---|---|
| `Recreate`（默认） | 删除旧 Pod 并创建新 Pod。**不会**保留 rootfs、内存或 IP。 | 标准升级方式；使用生命周期钩子来备份和恢复数据。 |
| `CheckpointRestore` | 在升级前对 rootfs 做一次 checkpoint，并在升级后恢复，从而保留文件系统状态。 | **不能**修改业务容器镜像。仅支持更新 Sidecar 版本（通过 annotation）或非镜像字段（env、resources、volumes）。 |

:::warning
在 `CheckpointRestore` 模式下修改业务容器镜像会导致 rootfs 丢失。请仅在更新 Sidecar 或非镜像字段时使用 `CheckpointRestore`；当必须修改业务镜像时，请使用 `Recreate`。
:::

**示例：使用 CheckpointRestore 更新 Sidecar**

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-sidecar
  namespace: default
spec:
  updateStrategy:
    type: CheckpointRestore
  patch:
    metadata:
      annotations:
        # 修改此值以触发 Sidecar 版本更新
        agents.kruise.io/upgrade-sidecar: "20260714"
```

### 升级已暂停的沙箱

:::info 版本
升级已暂停沙箱自 **v0.6.0** 起可用。
:::

默认情况下，SandboxUpdateOps 只会升级处于 `Running` 状态的沙箱。若要将已暂停的沙箱纳入升级范围，请在
`spec.stateFilter.states` 中加入 `Paused`。控制器会唤醒每个已暂停的沙箱、对其进行升级，然后在该沙箱的
`spec.paused` 仍为 `true` 时重新将其暂停。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-with-paused
  namespace: default
spec:
  stateFilter:
    states:
      - Running
      - Paused
```

### 应用升级

```bash
kubectl apply -f sandboxupdateops.yaml
```

### 监控进度

查看 SandboxUpdateOps 状态：

```bash
kubectl get sandboxupdateops upgrade-my-sandboxes
```

输出示例：

```
NAME                    PHASE      TOTAL   UPDATED   UPDATING   FAILED   AGE
upgrade-my-sandboxes    Updating   10      3         2          0        5m
```

| 字段 | 说明 |
|---|---|
| `PHASE` | 当前阶段：`Pending`、`Updating`、`Completed` 或 `Failed` |
| `TOTAL` | 选中需要升级的沙箱总数 |
| `UPDATED` | 已成功升级的沙箱数量 |
| `UPDATING` | 当前正在升级的沙箱数量 |
| `FAILED` | 升级失败的沙箱数量 |

在升级过程中查看单个沙箱的状态：

```bash
kubectl get sandbox -l agents.kruise.io/sandbox-template=my-sandbox-pool
```

正在升级的沙箱会显示阶段为 `Upgrading`，升级完成后会回到 `Running` 状态。

### 沙箱升级状态详情

查看特定沙箱的 conditions 来了解升级进度：

```bash
kubectl get sandbox <sandbox-name> -o yaml
```

`Upgrading` condition 标识当前所处的阶段：

| Condition Reason | 说明 |
|---|---|
| `PreUpgrade` | 正在执行升级前生命周期钩子 |
| `PreUpgradeFailed` | 升级前钩子执行失败 |
| `UpgradePod` | 正在删除旧 Pod 并创建新 Pod |
| `UpgradePodFailed` | 新 Pod 启动失败（如镜像拉取错误、容器崩溃） |
| `PostUpgrade` | 正在执行升级后生命周期钩子 |
| `PostUpgradeFailed` | 升级后钩子执行失败 |
| `Succeeded` | 升级成功完成 |

升级过程中的 condition 示例：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: my-sandbox
  namespace: default
spec:
  paused: false
status:
  phase: Upgrading
  conditions:
    - type: Ready
      status: "False"
      reason: Upgrading
      message: "sandbox is upgrading"
    - type: Upgrading
      status: "False"
      reason: UpgradePod
      message: ""
```

## 升级生命周期流程

下图展示了单个沙箱的三阶段 Recreate 升级生命周期：

```
┌─────────────────────────────────────────────────────────────────┐
│                     Sandbox Upgrade Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Template Changed (revision mismatch detected)                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐   success   ┌────────────┐   success   ┌───────┐ │
│  │PreUpgrade├────────────►│ UpgradePod ├────────────►│Post   │ │
│  │ (backup) │             │(delete old │             │Upgrade│ │
│  └────┬─────┘             │ create new)│             │(restore)││
│       │                   └─────┬──────┘             └───┬───┘ │
│       │ fail                    │ fail                    │fail │
│       ▼                         ▼                        ▼     │
│  PreUpgrade              UpgradePod                PostUpgrade  │
│  Failed                  Failed                    Failed       │
│                                                                 │
│  On success of PostUpgrade:                                     │
│    Phase: Upgrading → Running                                   │
│    Ready: False → True                                          │
│    Upgrading condition: Succeeded                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 故障排查

### 诊断升级失败

查看沙箱 conditions 获取详细的错误信息：

```bash
kubectl get sandbox <sandbox-name> -o jsonpath='{.status.conditions}' | jq .
```

### 升级前钩子执行失败

**现象**：沙箱卡在 `Upgrading` 阶段，condition reason 为 `PreUpgradeFailed`。

**解决方法**：
1. 在 `Upgrading` condition 的 message 中查看脚本失败的详细信息。
2. 修复升级前脚本。
3. 删除失败的 SandboxUpdateOps，新建一个进行重试。

如果不需要备份，可以从 SandboxUpdateOps spec 中移除 `lifecycle` 部分。

### UpgradePod 失败

**现象**：沙箱卡在 `Upgrading` 阶段，condition reason 为 `UpgradePodFailed`。

**常见原因**：
- 镜像拉取错误（镜像名错误或镜像仓库认证问题）。
- 容器反复崩溃（应用启动失败）。
- 节点资源不足。

**解决方法**：
1. 在 condition message 中查看容器错误详情。
2. 修复底层问题（镜像、资源等）。
3. 删除失败的 SandboxUpdateOps，新建一个。如果配置了 `postUpgrade` 钩子，可以新建一个仅包含 `postUpgrade` 钩子（不含 `preUpgrade` 和 `patch`）的 SandboxUpdateOps 来完成恢复。

### 升级后钩子执行失败

**现象**：沙箱卡在 `Upgrading` 阶段，condition reason 为 `PostUpgradeFailed`。

**解决方法**：
1. 查看错误信息以获取脚本失败详情。
2. 修复升级后脚本。
3. 删除失败的 SandboxUpdateOps，新建一个仅包含 `postUpgrade` 生命周期（不含 `preUpgrade` 或 `patch`）的 SandboxUpdateOps 来重试恢复步骤。

### 回滚

有两种可用的回滚方式：

- **推荐（当存在 checkpoint 时）**：如果在升级前已经创建了 `Checkpoint`（例如在 `CheckpointRestore` 模式下），可以从该
  Checkpoint 克隆沙箱以恢复到之前的状态。参见
  [快照管理](./checkpoint.md#从-checkpoint-创建沙箱)。
- **使用原配置重建**：新建一个 SandboxUpdateOps，让其 `patch` 回退到原始的镜像/配置。

:::tip
对于在 Pod 已经重建**之后**执行的任何重试（例如从 `UpgradePodFailed` 或 `PostUpgradeFailed` 状态恢复），请移除
`preUpgrade` 钩子，以免再次执行备份步骤。如果仍需要恢复数据，则只保留 `postUpgrade` 钩子。
:::

通过使用原配置重建来回滚：

1. 删除当前的 SandboxUpdateOps：
   ```bash
   kubectl delete sandboxupdateops <name>
   ```

2. 创建一个新的 SandboxUpdateOps，将 patch 改回原配置（设置原镜像/配置）：
   ```yaml
   apiVersion: agents.kruise.io/v1alpha1
   kind: SandboxUpdateOps
   metadata:
     name: rollback-sandboxes
     namespace: default
   spec:
     patch:
       spec:
         containers:
           - name: sandbox
             image: my-registry/sandbox-image:v1  # 回退到之前的版本
     lifecycle:
       postUpgrade:
         exec:
           command:
             - /bin/bash
             - -c
             - |
               # 如有需要，恢复数据
               if [ -f /mnt/shared/backup-$(hostname).tar.gz ]; then
                 tar xzf /mnt/shared/backup-$(hostname).tar.gz -C /home/user/workspace
               fi
         timeoutSeconds: 120
   ```

## 暂停升级操作

你可以暂停一个正在进行的 SandboxUpdateOps，以阻止它继续升级更多的沙箱：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxUpdateOps
metadata:
  name: upgrade-my-sandboxes
  namespace: default
spec:
  paused: true
```

这会阻止新的沙箱被纳入升级，但不会影响已经处于升级中的沙箱。

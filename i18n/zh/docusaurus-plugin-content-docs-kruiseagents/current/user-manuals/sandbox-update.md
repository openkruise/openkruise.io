# 升级沙箱

本文档介绍如何升级由 OpenKruise Agents 管理的沙箱，包括 **预热池沙箱**（由 SandboxSet 管理）和 **已认领沙箱**（已分配给用户）。

:::info 版本
本文档描述的所有特性自 **v0.3.0** 起可用。
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

### 工作原理

当你修改 SandboxSet 的 `spec.template` 字段时，控制器会检测到模板变更并对池中的沙箱执行 **滚动升级**。控制器会：

1. 根据更新后的模板计算出新的 `updateRevision` 哈希。
2. 按批次删除旧版本的沙箱（遵循 `maxUnavailable` 限制）。
3. 使用更新后的模板创建新的沙箱，以维持期望的副本数。

在 **扩容** 时，新创建的沙箱会使用最新的模板。在 **缩容** 时，会优先移除旧版本的沙箱。

### 配置

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: my-sandbox-pool
  namespace: default
spec:
  replicas: 10
  updateStrategy:
    # 在升级过程中允许不可用的沙箱最大数量或百分比。
    # 可以是绝对值（如 5）或百分比（如 "10%"）。
    # 默认值："20%"
    maxUnavailable: "20%"
  template:
    spec:
      containers:
        - name: sandbox
          image: my-registry/sandbox-image:v2   # 在此处更新镜像版本
          resources:
            requests:
              cpu: "1"
              memory: "512Mi"
            limits:
              cpu: "2"
              memory: "1Gi"
```

要触发升级，只需更新 `spec.template` 下的任意字段（如容器镜像、资源、环境变量），然后应用变更：

```bash
kubectl apply -f sandboxset.yaml
```

### 监控进度

通过查看 SandboxSet 状态来监控滚动升级：

```bash
kubectl get sandboxset my-sandbox-pool -o wide
```

输出示例：

```
NAME              REPLICAS   AVAILABLE   UPDATEDREPLICAS   UPDATEDAVAILABLEREPLICAS   UPDATEREVISION   AGE
my-sandbox-pool   10         8           6                 5                          a1b2c3d4         30m
```

| 字段 | 说明 |
|---|---|
| `REPLICAS` | 沙箱总数（创建中 + 可用 + 运行中 + 已暂停） |
| `AVAILABLE` | 可被认领的沙箱数量 |
| `UPDATEDREPLICAS` | 已更新到最新版本的沙箱数量 |
| `UPDATEDAVAILABLEREPLICAS` | 已更新且可用的沙箱数量 |
| `UPDATEREVISION` | 当前期望模板版本的哈希值 |

当 `UPDATEDAVAILABLEREPLICAS` 等于期望的 `REPLICAS` 数量时，滚动升级即告完成。

你也可以查看单个沙箱的版本：

```bash
kubectl get sandboxes -l agents.kruise.io/sandbox-template=my-sandbox-pool -o custom-columns=\
NAME:.metadata.name,\
PHASE:.status.phase,\
REVISION:.status.updateRevision
```

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

回滚一次失败的升级：

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
     selector:
       matchLabels:
         agents.kruise.io/sandbox-template: my-sandbox-pool
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
spec:
  paused: true
```

这会阻止新的沙箱被纳入升级，但不会影响已经处于升级中的沙箱。

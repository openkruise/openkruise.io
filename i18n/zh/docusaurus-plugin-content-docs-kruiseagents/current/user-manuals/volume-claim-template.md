# Volume Claim Templates

本文介绍如何在 `SandboxSet` 中使用 `volumeClaimTemplates`，为 OpenKruise Agents 沙箱提供持久化存储。

## 沙箱存储的作用

默认情况下，容器是临时的，沙箱内部生成或修改的任何数据都会在底层 Pod 终止后丢失。

在 `SandboxSet` API 中引入 `volumeClaimTemplates` 可以解决这一问题：它允许每个沙箱实例动态申请自己的 Persistent Volume Claim（PVC）。借助与 Kubernetes StatefulSet 相同的语义，你只需定义一次存储模板，OpenKruise Agents 就会自动为从该模板生成的每个沙箱创建、挂载并管理独立的存储卷。

常见使用场景包括：

- **缓存依赖**：保存已下载的软件包（例如 `node_modules` 或 pip 缓存），在多次 Agent 运行之间复用，加快执行速度。
- **保留状态**：持久化日志、构建产物或与特定沙箱会话绑定的内部 Agent 数据库。
- **带状态的预热池**：为 `SandboxSet` 预热池挂载持久卷，使沙箱在启动后即可执行重 I/O 操作，无需等待首次存储分配。

## 工作原理

1. 在 `SandboxSet` 中定义 `volumeClaimTemplates` 列表。
2. 当 `SandboxSet` 控制器创建新的沙箱时，卷声明模板会自动透传到各个 `Sandbox` 自定义资源。
3. 控制器随后申请对应的 PVC，并将其合并到底层 Pod 规格中，挂载到容器内部。
4. 当沙箱 Pod 被重建（例如由于节点驱逐或滚动更新）时，同一个 PVC 会被重新挂载到新的 Pod 上，从而保留数据。

## 创建带卷声明的沙箱集

要使用持久化存储，需要在 `SandboxSet` 规格中添加 `volumeClaimTemplates` 数组，并在容器的 `volumeMounts` 中引用该声明名称。

以下示例假设集群中已存在名为 `standard` 的 StorageClass。如果你的集群没有提供默认 StorageClass，请先创建一个，或将 `storageClassName` 替换为可用的存储类。

创建文件 `sandboxset-with-volume.yaml`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: stateful-sandboxset
  namespace: default
spec:
  replicas: 3
  # 1. 在此处定义动态卷配置
  volumeClaimTemplates:
  - metadata:
      name: agent-data
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: standard
      resources:
        requests:
          storage: 1Gi
  # 2. 在容器中引用卷声明的准确名称
  template:
    spec:
      containers:
      - name: sandbox-agent
        image: ubuntu:latest
        command: ["sleep", "infinity"]
        volumeMounts:
        - name: agent-data
          mountPath: /data
```

将模板应用到 Kubernetes 集群：

```bash
kubectl apply -f sandboxset-with-volume.yaml
```

等待预热池就绪：

```bash
kubectl get sbs stateful-sandboxset
```

预期输出：

```text
NAME                  REPLICAS   AVAILABLE   UPDATEREVISION   AGE
stateful-sandboxset   3          3           xxxxxxxx         92s
```

## 通过 SandboxClaim 申请沙箱

预热池就绪后，你可以通过创建 `SandboxClaim` 来申请一个实际的沙箱实例。

创建文件 `sandbox-claim.yaml`：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: my-stateful-sandbox
  namespace: default
spec:
  templateName: stateful-sandboxset
```

应用该声明：

```bash
kubectl apply -f sandbox-claim.yaml
```

等待申请完成：

```bash
kubectl get sbc my-stateful-sandbox
```

预期输出：

```text
NAME                    PHASE       TEMPLATE              DESIRED   CLAIMED   AGE
my-stateful-sandbox     Completed   stateful-sandboxset   1         1         41s
```

## 验证自动分配的存储

当你应用 `SandboxClaim` 后，`SandboxSet` 控制器会自动处理 `volumeClaimTemplates` 定义，创建专属的 PVC，并将其挂载到沙箱 Pod 上。

列出 PVC 以确认卷已创建。PVC 名称由声明名和沙箱 Pod 名组合而成：

```bash
kubectl get pvc
```

你应该能看到一个形如 `agent-data-<sandbox-pod-name>` 的已绑定 PVC。

如果进入沙箱容器内部，可以验证卷已正确挂载到 `/data` 目录：

```bash
kubectl exec -it <sandbox-pod-name> -- df -h /data
```

## 验证数据持久化

为了验证数据持久化，可以删除底层 Pod 来模拟崩溃或驱逐，然后确认控制器重新创建 Pod 后数据仍然保留。

### 1. 向持久卷写入数据

在运行中的沙箱容器内执行命令，在挂载的 `/data` 目录下创建一个文件：

```bash
kubectl exec -it <sandbox-pod-name> -- sh -c "echo 'This data will survive a pod crash!' > /data/evidence.txt"
```

### 2. 确认数据存在

读取文件以确保写入成功：

```bash
kubectl exec -it <sandbox-pod-name> -- cat /data/evidence.txt
```

### 3. 删除 Pod 模拟故障

由于沙箱由 `SandboxSet` 控制器管理，直接删除 Pod 即可模拟意外故障。

```bash
kubectl delete pod <sandbox-pod-name>
```

### 4. 等待控制器重建沙箱

`SandboxSet` 控制器会检测到 Pod 缺失并自动重建。由于 `volumeClaimTemplates` 采用 StatefulSet 类似的语义，控制器会将同一个 PVC 重新挂载到新的 Pod。

观察 Pod 直到新的 Pod 进入运行状态：

```bash
kubectl get pods -w
```

### 5. 确认数据仍然保留

当新的替代 Pod 处于 `Running` 状态后，进入容器并再次读取文件：

```bash
kubectl exec -it <new-sandbox-pod-name> -- cat /data/evidence.txt
```

你应该能在终端中看到文本 `This data will survive a pod crash!`。

## 注意事项

- `volumeClaimTemplates` 字段位于 `SandboxSet` spec 中，与 `template` 同级，而不是嵌套在 `template.spec` 内部。
- 从同一个 `SandboxSet` 生成的每个沙箱都拥有独立的 PVC。若要在多个沙箱之间共享同一个 PVC，需要使用 ReadWriteMany 存储类，本文不做展开。
- 当沙箱通过 `SandboxClaim` 生命周期被删除（例如删除 `SandboxClaim`）时，关联的 PVC 默认会随沙箱一起删除。如果需要保留数据，请通过 StorageClass 配置 PVC 的 `reclaimPolicy`，或在清理前备份数据。

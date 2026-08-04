# On-Demand Volume Mounting

本文介绍如何在申请沙箱时动态挂载已有的 Persistent Volume（PV）。这适用于在多个沙箱之间共享存储，或在不为 `SandboxSet` 模板定义存储的情况下挂载已有数据卷。

## 概述

按需卷挂载允许你在申请沙箱时声明一个或多个 PV 挂载，而不是通过 `volumeClaimTemplates` 为每个沙箱单独申请 PVC。挂载操作由注入到沙箱 Pod 中的 `agent-runtime` 和 CSI Sidecar 完成。

主要特点：

- 申请前 PV 必须已存在于集群中。
- 同一个 PV 可以挂载到多个沙箱中（例如共享数据集或模型缓存）。
- 可以通过 E2B SDK 或 `SandboxClaim` CRD 两种方式请求挂载。

## 前提条件

1. 提供沙箱的 `SandboxSet` 必须启用 `csi` 和 `agent-runtime` 运行时。运行时注入的详细说明请参考 [Runtime Injection](./runtime-injection.md)。
2. 集群中必须已存在一个或多个 PV，并且沙箱所在节点可以访问这些 PV。
3. 如果你的 CSI 驱动需要凭证，请提前创建对应的 Secret 并在 PV 中引用。

## 在 SandboxSet 中开启挂载能力

在 `SandboxSet` 的 `spec.runtimes` 中添加 `csi` 和 `agent-runtime`。框架会自动为从该模板创建的每个沙箱注入所需的 CSI Sidecar 和 `agent-runtime`。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxSet
metadata:
  name: shared-storage-template
  namespace: default
spec:
  replicas: 3
  runtimes:
    - name: csi            # 开启动态卷挂载能力
    - name: agent-runtime  # 挂载编排所需
  template:
    spec:
      containers:
        - name: sandbox
          image: ubuntu:latest
          command: ["sleep", "infinity"]
```

## 准备 PersistentVolume

创建一个由你的存储系统支撑的 PV 对象。以下示例使用通用 CSI 驱动；请将 `driver`、`volumeHandle` 和 `volumeAttributes` 替换为你的 CSI 提供商对应的实际值。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: shared-pv
spec:
  accessModes:
    - ReadWriteMany
  capacity:
    storage: 50Gi
  csi:
    driver: csi-driver.example.com
    volumeHandle: shared-pv
    volumeAttributes:
      server: <STORAGE_SERVER_ADDRESS>
      share: <STORAGE_SHARE_NAME>
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  volumeMode: Filesystem
```

> 请将 CSI 驱动名称和 `volumeAttributes` 替换为你的存储后端实际要求的值。如果 CSI 驱动需要凭证，请按照该驱动的文档进行配置。

## 申请时挂载卷

你可以选择在申请沙箱时通过 E2B SDK 或 `SandboxClaim` 请求挂载。

### 通过 E2B SDK 挂载

请使用 `e2b.agents.kruise.io/csi-volume-config` 扩展，并以 JSON 数组格式声明一个或多个卷挂载。

```python
import json
from e2b_code_interpreter import Sandbox

csi_config = json.dumps([
    {"pvName": "shared-pv-1", "mountPath": "/data1"},
    {"pvName": "shared-pv-2", "mountPath": "/data2", "subPath": "sub/dir", "readOnly": True}
])

sbx = Sandbox.create(template="shared-storage-template", timeout=300, metadata={
    "e2b.agents.kruise.io/csi-volume-config": csi_config
})
```

| 字段 | 类型 | 说明 | 是否必填 |
| --- | --- | --- | --- |
| `pvName` | String | 已存在 PV 的名称 | 是 |
| `mountPath` | String | 容器内挂载目标路径 | 是 |
| `subPath` | String | 持久卷内的子路径 | 否 |
| `readOnly` | Boolean | 是否以只读方式挂载 | 否 |

> 挂载目标路径必须是一个空目录，否则挂载将失败。

### 通过 SandboxClaim 挂载

在 `SandboxClaim` 中声明 `dynamicVolumesMount` 字段：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SandboxClaim
metadata:
  name: shared-storage-claim
  namespace: default
spec:
  templateName: shared-storage-template
  replicas: 1
  claimTimeout: 5m
  dynamicVolumesMount:
    - pvName: "shared-pv-1"
      mountPath: "/data1"
    - pvName: "shared-pv-2"
      mountPath: "/data2"
      subPath: "sub/dir"
      readOnly: true
```

字段说明：

| 字段 | 说明 | 是否必填 |
| --- | --- | --- |
| `pvName` | 已存在 PV 的名称 | 是 |
| `mountPath` | 容器内挂载目标路径 | 是 |
| `subPath` | 持久卷内的子路径 | 否 |
| `readOnly` | 是否以只读方式挂载 | 否 |

## 验证挂载结果

当 `SandboxClaim` 进入 `Completed` 阶段后，列出该声明分配出的沙箱：

```bash
kubectl get sandbox -n default -l agents.kruise.io/claim-name=shared-storage-claim
```

预期输出：

```text
NAME                          STATUS    AGE
shared-storage-template-xxx   Running   22h
```

在沙箱 Pod 内执行命令验证挂载：

```bash
kubectl exec -it <POD_NAME> -- df -h /data1
```

你应该能在请求的路径下看到已挂载的卷。

## 注意事项

- 按需卷挂载依赖 `agent-runtime` 和 CSI Sidecar，相比不带额外挂载的申请，会在一定程度上影响沙箱交付速度。
- 挂载目标目录必须存在于容器镜像中且为空，否则 CSI 挂载将失败。
- 如果指定了 `subPath`，子目录不会自动在存储后端创建。请在挂载前确保该目录已存在，或使用会自动创建缺失目录的存储驱动。
- 该功能目前支持从预热池申请、无库存时新建以及原地镜像升级后的沙箱。通过 Checkpoint 恢复沙箱时，挂载不会被恢复。


---
id: cli-reference
title: kubectl kruise CLI 参考
---

# kubectl kruise CLI 参考

本文提供了 `kubectl kruise` 插件的完整参考，包括所有命令、参数和使用示例。

## 概述

`kubectl kruise` 插件扩展了 kubectl，提供了 OpenKruise 专用功能，用于管理高级工作负载，例如 CloneSet、Advanced StatefulSet 和 Rollout。  
它支持增强的部署策略、发布管理以及工作负载操作。

## 安装

### 通过 Krew（推荐）
```bash
kubectl krew install kruise
````

### 手动安装

1. 从 [releases 页面](https://github.com/openkruise/kruise-tools/releases) 下载二进制文件
2. 解压并移动到系统 PATH：

```bash
tar xvf kubectl-kruise-darwin-amd64.tar.gz
mv darwin-amd64/kubectl-kruise /usr/local/bin/
```

## 全局参数

以下参数适用于所有 `kubectl kruise` 命令：

| 参数             | 简写   | 描述                 | 示例                             |
| -------------- | ---- | ------------------ | ------------------------------ |
| `--kubeconfig` |      | kubeconfig 文件路径    | `--kubeconfig=/path/to/config` |
| `--namespace`  | `-n` | Kubernetes 命名空间    | `-n production`                |
| `--context`    |      | 使用的 kubeconfig 上下文 | `--context=staging`            |
| `--help`       | `-h` | 显示帮助信息             | `-h`                           |
| `--version`    |      | 显示版本信息             | `--version`                    |

## 命令参考

### `expose`

将工作负载暴露为新的 Kubernetes Service。

**语法:**

```bash
kubectl kruise expose <resource-type>/<resource-name> [flags]
```

**参数:**

* `--port`: 暴露的 Service 端口
* `--target-port`: 目标容器端口
* `--type`: Service 类型 (ClusterIP, NodePort, LoadBalancer)
* `--protocol`: 协议 (TCP, UDP)

**示例:**

```bash
# 暴露一个 CloneSet
kubectl kruise expose cloneset nginx --port=80 --target-port=8000

# 使用 NodePort 类型暴露
kubectl kruise expose cloneset webapp --port=80 --type=NodePort
```

### `scale`

设置工作负载的新副本数。

**语法:**

```bash
kubectl kruise scale --replicas=<count> <resource-type>/<resource-name> [flags]
```

**参数:**

* `--replicas`: 目标副本数（必填）
* `--current-replicas`: 当前副本数（用于验证）
* `--resource-version`: 乐观并发控制的资源版本

**示例:**

```bash
kubectl kruise scale --replicas=5 cloneset/nginx
kubectl kruise scale --replicas=3 --current-replicas=2 cloneset/webapp
kubectl kruise scale --replicas=4 statefulsets.apps.kruise.io/database
```

### `rollout`

管理工作负载的发布操作。

**语法:**

```bash
kubectl kruise rollout <subcommand> <resource> [flags]
```

#### 子命令

##### `approve`

手动将 Rollout 推进到下一步。

```bash
kubectl kruise rollout approve rollout-demo -n production
kubectl kruise rollout approve my-rollout
```

##### `undo`

回滚到之前的版本。

```bash
kubectl kruise rollout undo cloneset/nginx
kubectl kruise rollout undo statefulsets/database
kubectl kruise rollout undo deployment/webapp --to-revision=2
```

##### `history`

查看发布历史。

```bash
kubectl kruise rollout history cloneset/nginx
kubectl kruise rollout history statefulsets.apps.kruise.io/database
```

##### `pause`

暂停正在进行的发布。

```bash
kubectl kruise rollout pause cloneset/nginx
kubectl kruise rollout pause rollout/canary-deployment
```

##### `resume`

恢复已暂停的发布。

```bash
kubectl kruise rollout resume cloneset/nginx
kubectl kruise rollout resume rollout/canary-deployment
```

##### `restart`

重新启动发布过程。

```bash
kubectl kruise rollout restart cloneset/nginx
kubectl kruise rollout restart statefulsets.apps.kruise.io/database
```

##### `status`

显示发布状态和进度。

```bash
kubectl kruise rollout status cloneset/nginx
kubectl kruise rollout status statefulsets/database
kubectl kruise rollout status statefulsets.apps.kruise.io/advanced-sts
```

### `describe`

深入检查 Rollout 资源。

```bash
kubectl kruise describe rollout rollouts-demo
kubectl kruise describe rollout rollouts-demo -n production
```

### `set`

更新资源配置。

#### `env`

设置环境变量。

```bash
kubectl kruise set env cloneset/nginx STORAGE_DIR=/local
kubectl kruise set env cloneset/webapp DEBUG=true LOG_LEVEL=info
```

#### `image`

更新容器镜像。

```bash
kubectl kruise set image cloneset/nginx nginx=nginx:1.21.0
kubectl kruise set image cloneset/webapp busybox=busybox:1.35 nginx=nginx:1.21.0
```

#### `resources`

设置资源请求和限制。

```bash
kubectl kruise set resources cloneset/nginx --limits=cpu=500m,memory=512Mi
kubectl kruise set resources cloneset/webapp --requests=cpu=100m,memory=128Mi
```

### `migrate`

在不同类型的工作负载之间迁移。

```bash
kubectl kruise migrate CloneSet --from Deployment -n default --dst-name my-cloneset --create
kubectl kruise migrate CloneSet --from Deployment -n default --dst-name my-cloneset --create --copy
kubectl kruise migrate CloneSet --from Deployment -n default --src-name my-deployment --dst-name my-cloneset --replicas 5 --max-surge=2
```

### `exec`

在 sidecar 容器中执行命令。

```bash
kubectl kruise exec mypod -S sidecar-container -i -t -- bash
kubectl kruise exec webapp-pod -S logging-sidecar -- cat /var/log/app.log
```

### `scaledown`

选择性缩容并删除指定 Pod。

```bash
kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b
kubectl kruise scaledown cloneset/webapp --pods webapp-1,webapp-3 -n production
```

## 常见工作流示例

### 蓝绿部署

```bash
kubectl kruise set image cloneset/app nginx=nginx:1.21.0
kubectl kruise rollout status cloneset/app
kubectl kruise rollout pause cloneset/app
kubectl kruise rollout approve rollout/app-rollout
kubectl kruise rollout undo cloneset/app
```

### 金丝雀部署

```bash
kubectl kruise rollout restart cloneset/app
kubectl kruise rollout status cloneset/app
kubectl kruise rollout approve rollout/app-canary
kubectl kruise describe rollout app-canary
```

### 从 Deployment 迁移到 CloneSet

```bash
kubectl kruise migrate CloneSet --from Deployment --dst-name my-cloneset --create --copy
kubectl kruise rollout status cloneset/my-cloneset
kubectl scale deployment/my-deployment --replicas=0
kubectl delete deployment/my-deployment
```

### 选择性 Pod 管理

```bash
kubectl kruise scaledown cloneset/app --pods app-pod-1,app-pod-3
kubectl kruise scale --replicas=5 cloneset/app
kubectl kruise rollout status cloneset/app
```

## 最佳实践

1. **发布前检查状态**
2. **使用发布历史记录** 便于回滚
3. **先在测试环境中验证**
4. **迁移和扩容时监控资源**
5. **选择性缩容**
6. **利用暂停/恢复实现可控部署**

## 故障排除

**找不到命令:**

* 确保插件已安装: `kubectl krew list | grep kruise`
* 检查 PATH 是否包含插件位置

**权限错误:**

* 检查 OpenKruise 资源的 RBAC 权限
* 验证 kubeconfig 上下文和命名空间访问

**发布卡住:**

* 检查发布状态: `kubectl kruise rollout status <resource>`
* 查看事件: `kubectl describe <resource>`

**迁移失败:**

* 验证源工作负载存在并可访问
* 检查目标命名空间权限
* 确保集群资源充足

更多详细信息请参考 [OpenKruise 文档](https://openkruise.io/docs/) 或 [GitHub issues](https://github.com/openkruise/kruise-tools/issues)。



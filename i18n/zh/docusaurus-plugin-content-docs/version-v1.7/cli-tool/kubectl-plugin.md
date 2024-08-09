---
title: Kubectl Plugin
---

[Kruise-tools](https://github.com/openkruise/kruise-tools) 为 Kruise 的功能提供了一系列命令行工具，包括 `kubectl-kruise`，它的是 `kubectl` 的标准插件。

## 安装
### Install via Krew
1. [Krew](https://krew.sigs.k8s.io/) 是一个 kubectl 的插件，krew 本身可以自举安装和升级。
首先, [安装 krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/)。

2. 执行 `kubectl krew install kruise` 来安装 kruise 插件。

3. 你可以通过 `kubectl-kruise` 或 `kubectl kruise` 来使用。
```bash
$ kubectl-kruise --help

# or
$ kubectl kruise --help
```
### Install manually
1. 你可以从 [releases](https://github.com/openkruise/kruise-tools/releases) 页面下载二进制文件，目前提供 `linux`、`darwin`（OS X）、`windows` 系统以及 `x86_64`、`arm64` 架构。如果你在使用其他的操作系统或架构，需要下载 [kruise-tools](https://github.com/openkruise/kruise-tools) 源码并通过 `make build` 打包。

2. 解压缩，并移动到系统 PATH 路径中。

```bash
$ tar xvf kubectl-kruise-darwin-amd64.tar.gz
$ mv darwin-amd64/kubectl-kruise /usr/local/bin/
```

3. 你可以通过 `kubectl-kruise` 或 `kubectl kruise` 命令来使用。

```bash
$ kubectl-kruise --help

# or
$ kubectl kruise --help
```

## 升级插件 
### 通过 Krew 升级

执行 `kubectl krew upgrade kruise` 即可升级插件。

### 手动升级

手动升级的方式与安装过程一致。

## Usage

### expose

根据一个 workload（如 Deployment、CloneSet）、Service 或 Pod 来生成一个新的 service 对象。

```bash
$ kubectl kruise expose cloneset nginx --port=80 --target-port=8000
```

### scale

为 workload（如 Deployment, ReplicaSet, CloneSet, or Advanced StatefulSet） 设置新的副本数。

```bash
$ kubectl kruise scale --replicas=3 cloneset nginx
```

它的效果与 `kubectl scale --replicas=3 cloneset nginx` 相同，即原生 `kubectl scale` 也适用。

### rollout

可用的子命令: `history`, `pause`, `restart`, `resume`, `status`, `undo`, `approve`。

```bash
$ kubectl kruise rollout undo cloneset/nginx

# built-in statefulsets
$ kubectl kruise rollout status statefulsets/sts1

# kruise statefulsets
$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts2

# approve a kruise rollout resource named "rollout-demo" in "ns-demo" namespace
$ kubectl-kruise rollout approve rollout-demo -n ns-demo
```

### set

可用的子命令: `env`, `image`, `resources`, `selector`, `serviceaccount`, `subject`。

```bash
$ kubectl kruise set env cloneset/nginx STORAGE_DIR=/local

$ kubectl kruise set image cloneset/nginx busybox=busybox nginx=nginx:1.9.1
```
### exec
通过 `exec` 命令直接进入到 Pod 的 sidecar 中。

```bash
# exec sidecar in pod
$ kubectl kruise exec mypod -S sidecar-container -i -t -- bash
```

### migrate

目前支持从 Deployment 迁移到 CloneSet。

```bash
# Create an empty CloneSet from an existing Deployment.
$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create

# Create a same replicas CloneSet from an existing Deployment.
$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create --copy

# Migrate replicas from an existing Deployment to an existing CloneSet.
$ kubectl-kruise migrate CloneSet --from Deployment -n default --src-name cloneset-name --dst-name deployment-name --replicas 10 --max-surge=2
```

### scaledown

对 cloneset 指定 pod 缩容。

```bash
# Scale down 2 with  selective pods
$ kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b
```

它会将 cloneset 设置 **replicas=replicas-2**，并删除指定的两个 pod。

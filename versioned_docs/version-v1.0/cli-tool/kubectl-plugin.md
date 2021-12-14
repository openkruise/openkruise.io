---
title: Kubectl Plugin
---

[Kruise-tools](https://github.com/openkruise/kruise-tools) provides commandline tools for kruise features, such as `kubectl-kruise`, which is a standard plugin of `kubectl`.

## Install

1. You can simply download the binary from the [releases](https://github.com/openkruise/kruise-tools/releases) page. Currently `linux`, `darwin`(OS X), `windows` with `x86_64` and `arm64` are provided. If you are using some other systems or architectures, you have to download the source code and execute `make build` to build the binary.

2. Extract and move it to system PATH.

```bash
$ tar xvf kubectl-kruise-darwin-amd64.tar.gz
$ mv darwin-amd64/kubectl-kruise /usr/local/bin/
```

3. Then you can use it with `kubectl-kruise` or `kubectl kruise`.

```bash
$ kubectl-kruise --help

# or
$ kubectl kruise --help
```

## Usage

### expose

Take a workload(e.g. deployment, cloneset), service or pod and expose it as a new Kubernetes Service.

```bash
$ kubectl kruise expose cloneset nginx --port=80 --target-port=8000
```

### scale

Set a new size for a Deployment, ReplicaSet, CloneSet, or Advanced StatefulSet.

```bash
$ kubectl kruise scale --replicas=3 cloneset nginx
```

It equals to `kubectl scale --replicas=3 cloneset nginx`.

### rollout

Available commands: `history`, `pause`, `restart`, `resume`, `status`, `undo`.

```bash
$ kubectl kruise rollout undo cloneset/nginx

# built-in statefulsets
$ kubectl kruise rollout status statefulsets/sts1

# kruise statefulsets
$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts2
```

### set

Available commands: `env`, `image`, `resources`, `selector`, `serviceaccount`, `subject`.

```bash
$ kubectl kruise set env cloneset/nginx STORAGE_DIR=/local

$ kubectl kruise set image cloneset/nginx busybox=busybox nginx=nginx:1.9.1
```

### migrate

Currently it supports migrate from Deployment to CloneSet.

```bash
# Create an empty CloneSet from an existing Deployment.
$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create

# Create a same replicas CloneSet from an existing Deployment.
$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create --copy

# Migrate replicas from an existing Deployment to an existing CloneSet.
$ kubectl-kruise migrate CloneSet --from Deployment -n default --src-name cloneset-name --dst-name deployment-name --replicas 10 --max-surge=2
```

### scaledown

Scaledown a cloneset with selective Pods.

```bash
# Scale down 2 with  selective pods
$ kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b
```

It will decrease **replicas=replicas-2** of this cloneset and delete the specified pods.

---
title: Kubectl Plugin
---

[Kruise-tools](https://github.com/openkruise/kruise-tools) provides commandline tools for kruise features, such as `kubectl-kruise`, which is a standard plugin of `kubectl`.

## Install
### Install via Krew
1. [Krew](https://krew.sigs.k8s.io/) itself is a kubectl plugin that is installed and updated via Krew (yes, Krew self-hosts).
First, [install krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).

2. Run `kubectl krew install kruise` to install kruise plugin via Krew.

3. Then you can use it with `kubectl-kruise` or `kubectl kruise`.

```bash
$ kubectl-kruise --help

# or
$ kubectl kruise --help
```
### Install manually
1. You can simply download the binary from the [releases](https://github.com/openkruise/kruise-tools/releases) page. Currently `linux`, `darwin`(OS X), `windows` with `x86_64` and `arm64` are provided. If you are using some other systems or architectures, you have to download the  [kruise-tools](https://github.com/openkruise/kruise-tools)  and execute `make build` to build the binary.

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
## Upgrade 
### Upgrade via Krew

Run `kubectl krew upgrade kruise` to upgrade kruise plugin via Krew.

### Upgrade manually
Same to install plugin manually.


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

Manage rollout resources. This command provides deep inspection and control of the Kruise Rollout objects.

**Available Commands:**

* **`approve`**: Manually promotes a Rollout to the next step. When a rollout is paused for manual verification, this command signals that the canary version has been validated and the full rollout can proceed.
* **`undo`**: Rolls back a workload to its previous version. This is a critical command for quickly reverting a deployment if the new version is found to be unstable or buggy.
* **`history`**: View the revision history of a workload.
* **`pause`**: Pause a Rollout.
* **`resume`**: Resume a paused Rollout.
* **`restart`**: Restart a Rollout.
* **`status`**: Display the status of a Rollout.

**Usage Examples:**

```bash
$ kubectl kruise rollout undo cloneset/nginx

# built-in statefulsets
$ kubectl kruise rollout status statefulsets/sts1

# kruise statefulsets
$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts2

# approve a kruise rollout resource named "rollout-demo" in "ns-demo" namespace
$ kubectl-kruise rollout approve rollout-demo -n ns-demo
```
### describe

Perform a deep inspection of a Rollout resource, including its step status, history, conditions, and recent events.

```bash
# Inspect the “rollouts-demo” Rollout in namespace default:
kubectl kruise describe rollout rollouts-demo -n default
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

### exec

Support switch to raw terminal mode, sends stdin to 'bash' in working sidecar container from cloneset myclone or pod and sends stdout/stderr from 'bash' back to the client

```bash
# exec sidecar in pod
$ kubectl kruise exec mypod -S sidecar-container -i -t -- bash
```

### scaledown

Scaledown a cloneset with selective Pods.

```bash
# Scale down 2 with  selective pods
$ kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b
```

It will decrease **replicas=replicas-2** of this cloneset and delete the specified pods.

---
id: cli-reference
title: kubectl kruise CLI Reference
---

# kubectl kruise CLI Reference

This page provides a comprehensive reference for all `kubectl kruise` plugin commands, flags, and usage examples.

## Overview

The `kubectl kruise` plugin extends kubectl with OpenKruise-specific functionality for managing advanced workloads like CloneSets, Advanced StatefulSets, and Rollouts. It provides enhanced deployment strategies, rollout management, and workload operations.

## Installation

### Via Krew (Recommended)
```bash
kubectl krew install kruise
```

### Manual Installation
1. Download the binary from [releases page](https://github.com/openkruise/kruise-tools/releases)
2. Extract and move to system PATH:
```bash
tar xvf kubectl-kruise-darwin-amd64.tar.gz
mv darwin-amd64/kubectl-kruise /usr/local/bin/
```

## Global Flags

These flags are available for all `kubectl kruise` commands:

| Flag | Short | Description | Example |
|------|-------|-------------|---------|
| `--kubeconfig` | | Path to kubeconfig file | `--kubeconfig=/path/to/config` |
| `--namespace` | `-n` | Kubernetes namespace | `-n production` |
| `--context` | | Kubeconfig context to use | `--context=staging` |
| `--help` | `-h` | Display help information | `-h` |
| `--version` | | Display version information | `--version` |

## Commands Reference

### `expose`

Expose a workload as a new Kubernetes Service.

**Syntax:**
```bash
kubectl kruise expose <resource-type>/<resource-name> [flags]
```

**Flags:**
- `--port`: Service port to expose
- `--target-port`: Container port to target
- `--type`: Service type (ClusterIP, NodePort, LoadBalancer)
- `--protocol`: Protocol (TCP, UDP)

**Examples:**
```bash
# Expose a CloneSet
kubectl kruise expose cloneset nginx --port=80 --target-port=8000

# Expose with NodePort type
kubectl kruise expose cloneset webapp --port=80 --type=NodePort
```

### `scale`

Set a new replica count for workloads.

**Syntax:**
```bash
kubectl kruise scale --replicas=<count> <resource-type>/<resource-name> [flags]
```

**Flags:**
- `--replicas`: Number of desired replicas (required)
- `--current-replicas`: Current replica count for validation
- `--resource-version`: Resource version for optimistic concurrency

**Examples:**
```bash
# Scale a CloneSet
kubectl kruise scale --replicas=5 cloneset/nginx

# Scale with current replica validation
kubectl kruise scale --replicas=3 --current-replicas=2 cloneset/webapp

# Scale Advanced StatefulSet
kubectl kruise scale --replicas=4 statefulsets.apps.kruise.io/database
```

### `rollout`

Manage rollout operations for workloads.

**Syntax:**
```bash
kubectl kruise rollout <subcommand> <resource> [flags]
```

#### Subcommands

##### `approve`
Manually promote a Rollout to the next step.

```bash
kubectl kruise rollout approve <rollout-name> [flags]

# Examples
kubectl kruise rollout approve rollout-demo -n production
kubectl kruise rollout approve my-rollout
```

##### `undo`
Roll back a workload to its previous version.

```bash
kubectl kruise rollout undo <resource-type>/<resource-name> [flags]

# Examples
kubectl kruise rollout undo cloneset/nginx
kubectl kruise rollout undo statefulsets/database
kubectl kruise rollout undo deployment/webapp --to-revision=2
```

##### `history`
View revision history of a workload.

```bash
kubectl kruise rollout history <resource-type>/<resource-name> [flags]

# Examples  
kubectl kruise rollout history cloneset/nginx
kubectl kruise rollout history statefulsets.apps.kruise.io/database
```

##### `pause`
Pause an ongoing rollout.

```bash
kubectl kruise rollout pause <resource-type>/<resource-name> [flags]

# Examples
kubectl kruise rollout pause cloneset/nginx
kubectl kruise rollout pause rollout/canary-deployment
```

##### `resume`
Resume a paused rollout.

```bash
kubectl kruise rollout resume <resource-type>/<resource-name> [flags]

# Examples
kubectl kruise rollout resume cloneset/nginx
kubectl kruise rollout resume rollout/canary-deployment
```

##### `restart`
Restart a rollout process.

```bash
kubectl kruise rollout restart <resource-type>/<resource-name> [flags]

# Examples
kubectl kruise rollout restart cloneset/nginx
kubectl kruise rollout restart statefulsets.apps.kruise.io/database
```

##### `status`
Display rollout status and progress.

```bash
kubectl kruise rollout status <resource-type>/<resource-name> [flags]

# Examples
kubectl kruise rollout status cloneset/nginx
kubectl kruise rollout status statefulsets/database
kubectl kruise rollout status statefulsets.apps.kruise.io/advanced-sts
```

### `describe`

Perform deep inspection of Rollout resources.

**Syntax:**
```bash
kubectl kruise describe rollout <rollout-name> [flags]
```

**Examples:**
```bash
# Describe a rollout in default namespace
kubectl kruise describe rollout rollouts-demo

# Describe rollout in specific namespace
kubectl kruise describe rollout rollouts-demo -n production
```

### `set`

Update resource configurations.

**Syntax:**
```bash
kubectl kruise set <subcommand> <resource> [flags]
```

#### Subcommands

##### `env`
Set environment variables.

```bash
kubectl kruise set env <resource-type>/<resource-name> <KEY=VALUE> [flags]

# Examples
kubectl kruise set env cloneset/nginx STORAGE_DIR=/local
kubectl kruise set env cloneset/webapp DEBUG=true LOG_LEVEL=info
```

##### `image`
Update container images.

```bash
kubectl kruise set image <resource-type>/<resource-name> <container>=<image> [flags]

# Examples
kubectl kruise set image cloneset/nginx nginx=nginx:1.21.0
kubectl kruise set image cloneset/webapp busybox=busybox:1.35 nginx=nginx:1.21.0
```

##### `resources`
Set resource requests and limits.

```bash
kubectl kruise set resources <resource-type>/<resource-name> [flags]

# Examples  
kubectl kruise set resources cloneset/nginx --limits=cpu=500m,memory=512Mi
kubectl kruise set resources cloneset/webapp --requests=cpu=100m,memory=128Mi
```

### `migrate`

Migrate workloads between different types.

**Syntax:**
```bash
kubectl kruise migrate <target-type> --from <source-type> [flags]
```

**Flags:**
- `--from`: Source workload type (required)
- `--src-name`: Source workload name
- `--dst-name`: Destination workload name
- `--create`: Create new workload
- `--copy`: Copy replicas during creation
- `--replicas`: Number of replicas to migrate
- `--max-surge`: Maximum surge during migration

**Examples:**
```bash
# Create empty CloneSet from Deployment
kubectl kruise migrate CloneSet --from Deployment -n default --dst-name my-cloneset --create

# Create CloneSet with same replicas
kubectl kruise migrate CloneSet --from Deployment -n default --dst-name my-cloneset --create --copy

# Migrate replicas between existing workloads
kubectl kruise migrate CloneSet --from Deployment -n default --src-name my-deployment --dst-name my-cloneset --replicas 5 --max-surge=2
```

### `exec`

Execute commands in sidecar containers.

**Syntax:**
```bash
kubectl kruise exec <pod-name> [flags] -- <command>
```

**Flags:**
- `-S`: Specify sidecar container name
- `-i`: Keep STDIN open
- `-t`: Allocate TTY

**Examples:**
```bash
# Execute in sidecar container
kubectl kruise exec mypod -S sidecar-container -i -t -- bash

# Run command in sidecar
kubectl kruise exec webapp-pod -S logging-sidecar -- cat /var/log/app.log
```

### `scaledown`

Scale down workloads with selective pod deletion.

**Syntax:**
```bash
kubectl kruise scaledown <resource-type>/<resource-name> --pods <pod-list> [flags]
```

**Flags:**
- `--pods`: Comma-separated list of pod names to delete (required)

**Examples:**
```bash
# Scale down CloneSet by deleting specific pods
kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b

# Scale down with namespace
kubectl kruise scaledown cloneset/webapp --pods webapp-1,webapp-3 -n production
```

## Common Workflow Examples

### Blue-Green Deployment
```bash
# 1. Create new version
kubectl kruise set image cloneset/app nginx=nginx:1.21.0

# 2. Monitor rollout
kubectl kruise rollout status cloneset/app

# 3. Pause for validation
kubectl kruise rollout pause cloneset/app

# 4. Approve after testing
kubectl kruise rollout approve rollout/app-rollout

# 5. Or rollback if needed
kubectl kruise rollout undo cloneset/app
```

### Canary Deployment
```bash
# 1. Start canary with small percentage
kubectl kruise rollout restart cloneset/app

# 2. Check status
kubectl kruise rollout status cloneset/app

# 3. Gradually increase traffic
kubectl kruise rollout approve rollout/app-canary

# 4. Monitor and approve each step
kubectl kruise describe rollout app-canary
```

### Migration from Deployment to CloneSet
```bash
# 1. Create CloneSet from existing Deployment
kubectl kruise migrate CloneSet --from Deployment --dst-name my-cloneset --create --copy

# 2. Verify CloneSet is working
kubectl kruise rollout status cloneset/my-cloneset

# 3. Scale down original Deployment
kubectl scale deployment/my-deployment --replicas=0

# 4. Clean up Deployment when ready
kubectl delete deployment/my-deployment
```

### Selective Pod Management
```bash
# 1. Scale down specific problematic pods
kubectl kruise scaledown cloneset/app --pods app-pod-1,app-pod-3

# 2. Scale back up
kubectl kruise scale --replicas=5 cloneset/app

# 3. Check health
kubectl kruise rollout status cloneset/app
```

## Best Practices

1. **Always check status** before proceeding with rollout operations
2. **Use rollout history** to track changes and enable easy rollbacks
3. **Test in staging** environments before production rollouts
4. **Monitor resources** during migrations and scaling operations
5. **Use selective scaling** for targeted pod replacement
6. **Leverage pause/resume** for controlled deployments

## Troubleshooting

### Common Issues

**Command not found:**
- Ensure plugin is installed: `kubectl krew list | grep kruise`
- Verify PATH includes plugin location

**Permission errors:**
- Check RBAC permissions for OpenKruise resources
- Verify kubeconfig context and namespace access

**Rollout stuck:**
- Check rollout status: `kubectl kruise rollout status <resource>`
- Review resource events: `kubectl describe <resource>`
- Use describe command for detailed inspection

**Migration failures:**
- Verify source workload exists and is accessible
- Check destination namespace permissions
- Ensure sufficient cluster resources

For more detailed troubleshooting, refer to the [OpenKruise documentation](https://openkruise.io/docs/) or check the [GitHub issues](https://github.com/openkruise/kruise-tools/issues).
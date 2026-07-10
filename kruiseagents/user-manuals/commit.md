---
id: commit
title: Commit Sandbox Image
---

# Commit Sandbox Image

## Overview

`Commit` is a namespaced CRD in OpenKruise Agents that saves the writable filesystem of a running Sandbox container as a new container image and pushes it to an image registry.

It is useful when you want to:

- Save a configured development environment as a reusable image.
- Turn changes made inside a running Sandbox into a versioned image.
- Share a Sandbox workspace state with other users or future Sandbox templates.

### What Commit preserves

- Filesystem changes inside the target container's writable layer: installed packages, source code, configuration files, generated artifacts, log files, and similar on-disk content.
- Any data that already resides in the container's root filesystem.

### What Commit does not preserve

- In-memory state of running processes.
- GPU memory, GPU device state, or accelerator context.
- Active network connections, open file descriptors, or process tables.
- External mounts such as PVCs, hostPath volumes, or sidecar-injected volumes not part of the container's writable layer.

Unlike [Snapshot Management](./checkpoint.md), which captures Sandbox runtime state for pause/resume or fork workflows, `Commit` produces a normal container image that can be pulled by any compatible container runtime.

## Feature Gate

`Commit` is controlled by the `Commit` feature gate. In the current community implementation, it is an Alpha feature and is disabled by default.

Enable it on the sandbox controller:

```shell
--feature-gates=Commit=true
```

## Prerequisites

Before creating a `Commit`, make sure that:

- OpenKruise Agents controller is installed and running.
- The `Commit` CRD (`commits.agents.kruise.io`) is registered in the cluster.
- The target Sandbox Pod is running and uses the container runtime supported by the commit job.
- The sandbox controller is configured with `AGENT_JOB_IMAGE`, and that image contains the `commit-job` binary and `nerdctl`.
- The target registry is reachable from the target node.
- If the registry uses a private CA or custom TLS configuration, the node's containerd registry configuration is prepared under `/etc/containerd/certs.d`.
- If the registry requires authentication, a Docker config Secret exists in the same namespace as the `Commit`.

## Commit CRD

The `Commit` resource (`agents.kruise.io/v1alpha1`, short name `cmt`) has the following key fields:

| Field | Type | Description |
|---|---|---|
| `spec.podName` | `string` | Required. Name of the target Sandbox Pod. Immutable after creation. |
| `spec.containerName` | `string` | Required. Name of the container whose filesystem should be committed. Immutable after creation. |
| `spec.image` | `string` | Required. Destination image reference to push, for example `registry.example.com/team/my-env:v1`. Immutable after creation. |
| `spec.squashLayer` | `int32` | Optional. Reserved for future layer squash optimization. `0` means no squashing. Immutable after creation. |
| `spec.timeoutSeconds` | `int32` | Optional. Maximum running time of the commit Job. `0` means no timeout. Immutable after creation. |
| `spec.ttl` | `string` | Optional. How long to retain the `Commit` object after it reaches `Succeeded` or `Failed`, such as `24h` or `168h`. Unset means no auto-deletion. |
| `spec.registryAuth.secrets` | `[]string` | Optional. Names of `kubernetes.io/dockerconfigjson` Secrets in the same namespace. The first valid Secret is mounted into the commit Job for `nerdctl push`. |
| `status.phase` | `string` | `Pending`, `Running`, `Succeeded`, or `Failed`. |
| `status.commitID` | `string` | Commit identifier. Currently set to the `Commit` object name after the commit starts. |
| `status.conditions` | `[]Condition` | Detailed condition information from the commit Job. Condition types include `CommitContainer` and `PushCommittedImage`. |
| `status.startTime` | `Time` | Time when the commit Job starts. |
| `status.completionTime` | `Time` | Time when the commit reaches a terminal phase. |

## Creating a Commit

Create a `Commit` object that points to the running Sandbox Pod and the target container. If the target registry requires authentication, also reference a Docker config Secret via `spec.registryAuth.secrets`.

First create the registry auth Secret in the same namespace as the `Commit`:

```shell
kubectl create secret docker-registry push-secret \
  -n sandbox-system \
  --docker-server=registry.example.com \
  --docker-username=<username> \
  --docker-password=<password>
```

Then create the `Commit`:

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Commit
metadata:
  name: commit-demo-01
  namespace: sandbox-system
spec:
  podName: code-interpreter-28rvn
  containerName: workspace
  image: registry.example.com/team/code-interpreter:demo-01
  registryAuth:
    secrets:
      - push-secret
  timeoutSeconds: 600
  ttl: 168h
```

Apply it:

```shell
kubectl apply -f commit.yaml
```

The controller creates a Kubernetes Job on the same node as the target Pod. The Job performs:

```text
nerdctl commit <container-id> <image>
nerdctl push <image>
```

If `registryAuth` is not set or no valid Secret is found, the commit Job attempts an anonymous push. The `registryAuth.credentials` field is reserved for future use and currently has no effect.

## Monitoring Progress

Use the short name `cmt` to list Commit objects:

```shell
kubectl get cmt -n sandbox-system
```

Example output:

```text
NAME               PHASE       TTL    AGE
commit-demo-01     Running     168h   12s
commit-demo-auth   Succeeded   168h   2m
```

Watch one Commit in detail:

```shell
kubectl get cmt commit-demo-01 -n sandbox-system -o yaml
```

Check the phase directly:

```shell
kubectl get cmt commit-demo-01 -n sandbox-system -o jsonpath='{.status.phase}'
```

Once `status.phase` becomes `Succeeded`, the target image has been committed and pushed successfully.

## Failure Handling

A `Commit` moves to `Failed` when the controller or commit Job cannot complete the workflow. Common causes include:

| Symptom | Condition type | Possible cause | What to check |
|---|---|---|---|
| `Commit` fails quickly | - | Target Pod does not exist or is being deleted | Verify `spec.podName` and namespace. |
| Job generation fails | - | Target container is not found in Pod status, Pod is not scheduled, or `AGENT_JOB_IMAGE` is empty | Check `spec.containerName`, Pod status, and controller environment variables. |
| Image commit fails | `CommitContainer` | `nerdctl commit` failed on the target node | Check job Pod logs and containerd access on the target node. |
| Image push fails | `PushCommittedImage` | Registry authentication, authorization, DNS, network, or TLS configuration problem | Check registry Secret, node network, and `/etc/containerd/certs.d`. |
| Job times out | - | `spec.timeoutSeconds` is too small for the image size or network speed | Increase `timeoutSeconds` or leave it as `0`. |

You can inspect the generated Job and its Pod logs for more details:

```shell
kubectl get job -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
kubectl get pod -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
kubectl logs -n sandbox-system -l agents.kruise.io/commit-name=commit-demo-01
```

## Cleaning Up

Delete the `Commit` object manually:

```shell
kubectl delete cmt commit-demo-01 -n sandbox-system
```

Or set `spec.ttl` so the controller automatically removes the `Commit` object after it reaches a terminal phase:

```yaml
spec:
  ttl: 24h
```

Deleting the `Commit` object does not delete the pushed image from the registry.

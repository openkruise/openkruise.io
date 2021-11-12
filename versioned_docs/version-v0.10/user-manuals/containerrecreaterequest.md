---
title: Container Restart
---

**FEATURE STATE:** Kruise v0.9.0

ContainerRecreateRequest provides a way to let users **restart/recreate** one or more containers in an existing Pod.

Just like the in-place update provided in Kruise, during container recreation, other containers in the same Pod are still running.
Once the recreation is completed, nothing changes in the Pod except that the recreated container's restartCount is increased.
Note that the files written into the **rootfs of the previous container will be lost**, but the data in volume mounts remain.

This feature relies on `kruise-daemon` to stop the container in Pod.
So if the `KruiseDaemon` feature-gate is closed, ContainerRecreateRequest will also be disabled.

## Usage

### Submit request

Create a `ContainerRecreateRequest` (short name `CRR`) for each Pod container recreation:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ContainerRecreateRequest
metadata:
  namespace: pod-namespace
  name: xxx
spec:
  podName: pod-name
  containers:       # list of container name that need to be recreated, at least one
  - name: app
  - name: sidecar
  strategy:
    failurePolicy: Fail                 # or 'Ignore'. If 'Fail', the CRR will abort when one container failed to stop or recreate
    orderedRecreate: false              # 'true' indicates to recreate the next container only if the previous one has recreated completely
    terminationGracePeriodSeconds: 30   # optional duration in seconds to wait the container terminating gracefully
    unreadyGracePeriodSeconds: 3        # duration for the Pod is marked as not ready before its preStop hook is executed and it is stopped
    minStartedSeconds: 10               # the new container will be consider as Succeeded only if it has started over minStartedSeconds
  activeDeadlineSeconds: 300        # the CRR will be marked as Completed immediately if it has ran over deadline duration since created
  ttlSecondsAfterFinished: 1800     # the time CRR remain as completed before the CRR is deleted
```

*All fields in `strategy` and the `activeDeadlineSeconds`/`ttlSecondsAfterFinished` in `spec` are optional.*

1. Typically, containers in list will be stopped one by one, but they may be recreating together, unless the `orderedRecreate` is `true`.
2. The `unreadyGracePeriodSeconds` depends on a new feature-gate named `KruisePodReadinessGate`, which indicates to inject a readinessGate during each Pod creating.
   Otherwise `unreadyGracePeriodSeconds` can only work for those new Pods created by Kruise that have the readinessGate.
3. If users set `ttlSecondsAfterFinished`, then CRR will automatically be deleted after completed over this time.
   Otherwise, users have to delete the CRR manually.

```bash
# for commandline you can
$ kubectl get containerrecreateqequest -n pod-namespace
# or just short name
$ kubectl get crr -n pod-namespace
```

### Check request status

Status of CRR looks like this:

```yaml
status:
  completionTime: "2021-03-22T11:53:48Z"
  containerRecreateStates:
  - name: app
    phase: Succeeded
  - name: sidecar
    phase: Succeeded
  phase: Completed
```

The `status.phase` can be:

- `Pending`: the CRR waits to be executed
- `Recreating`: the CRR is executing
- `Completed`: this CRR has completed, and `status.completionTime` is the timestamp of completion

Note that `status.phase=Completed` does not mean all containers in CRR have recreated successfully.
Users should find the information in `status.containerRecreateStates`.

The `status.containerRecreateStates[x].phase` can be:

- `Pending`: this container waits to recreate
- `Recreating`: this container is recreating
- `Failed`: this container has failed to recreate
- `Succeeded`: this container has succeeded to recreate

**When the CRR has completed, only the containers in `Succeeded` phase are successfully recreated.**

## Implementation

When users create a CRR, Kruise webhook will inject the current containerID and restartCount into `spec.containers[x].statusContext`.
And, when **kruise-daemon** starts to execute, it will skip the container if its containerID is not equal to the one in statusContext or the restartCount has been bigger,
which means the container has already been recreated (maybe by in-place update).

![ContainerRecreateRequest](/img/docs/user-manuals/containerrecreaterequest.png)

Typically, **kruise-daemon** will stop the container with or without preStop hook, then **kubelet** will create a new container and start again.
Finally, **kruise-daemon** will report the container phase as `Succeeded` only if the new container has started over `minStartedSeconds` duration.

If the recreation occurs with an in-place update in the same time:

- If **Kubelet** has stopped or recreated the container because of in-place update, **kruise-daemon** will consider it already recreated.
- If **kruise-daemon** stops the container, **Kubelet** will keep to in-place update the container to the new image.

If multiple ContainerRecreateRequests are submitted for one Pod, they will be executed one by one.

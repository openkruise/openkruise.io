---
title: BroadcastJob
---

This controller distributes a Pod on every node in the cluster.
Like a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/),
a BroadcastJob makes sure a Pod is created and run on all selected nodes once in a cluster.
Like a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/),
a BroadcastJob is expected to run to completion.  

In the end, BroadcastJob does not consume any resources after each Pod succeeds on every node.
This controller is particularly useful when upgrading a software, e.g., Kubelet, or validation check
in every node, which is typically needed only once within a long period of time or
running an adhoc full cluster inspection script.

Optionally, a BroadcastJob can keep alive after all Pods on desired nodes complete
so that a Pod will be automatically launched for every new node after it is added to the cluster.
  
## Spec definition

### Template

`Template` describes the Pod template used to run the job.
Note that for the Pod restart policy, only `Never` or `OnFailure` is allowed for BroadcastJob.

### Parallelism

`Parallelism` specifies the maximal desired number of Pods that should be run at
any given time. By default, there's no limit.

For example, if a cluster has ten nodes and `Parallelism` is set to three, there can only be
three pods running in parallel. A new Pod is created only after one running Pod finishes.

### CompletionPolicy

`CompletionPolicy` specifies the controller behavior when reconciling the BroadcastJob.

#### Always (default)

`Always` policy means the job will eventually complete with either failed or succeeded
condition. The following parameters take effect with this policy:

- `ActiveDeadlineSeconds` specifies the duration in seconds relative to the startTime
  that the job may be active before the system tries to terminate it.
  For example, if `ActiveDeadlineSeconds` is set to 60 seconds, after the BroadcastJob starts
  running for 60 seconds, all the running pods will be deleted and the job will be marked
  as Failed.

- `TTLSecondsAfterFinished` limits the lifetime of a BroadcastJob that has finished execution
  (either Complete or Failed). For example, if TTLSecondsAfterFinished is set to 10 seconds,
  the job will be kept for 10 seconds after it finishes. Then the job along with all the Pods
  will be deleted.

#### Never

`Never` policy means the BroadcastJob will never be marked as Failed or Succeeded even if
all Pods run to completion. This also means above `ActiveDeadlineSeconds`, `TTLSecondsAfterFinished`
and `FailurePolicy.RestartLimit` parameters takes no effect if `Never` policy is used.
For example, if user wants to perform an initial configuration validation for every newly
added node in the cluster, he can deploy a BroadcastJob with `Never` policy.

### FailurePolicy

#### Type

`Type` indicates the type of `FailurePolicyType`.

- `Continue` means the job will be still running, when failed pod is found.
- `FailFast`(default) means the job will be failed, when failed pod is found.
- `Pause` means the job will be paused, when failed pod is found.

#### RestartLimit

- `RestartLimit` specifies the number of retries before marking the pod failed.
  Currently, the number of retries are defined as the aggregated number of restart
  counts across all Pods created by the job, i.e., the sum of the
  [ContainerStatus.RestartCount](https://github.com/kruiseio/kruise/blob/d61c12451d6a662736c4cfc48682fa75c73adcbc/vendor/k8s.io/api/core/v1/types.go#L2314)
  for all containers in every Pod.  If this value exceeds `RestartLimit`, the job is marked
  as Failed and all running Pods are deleted. No limit is enforced if `RestartLimit` is
  not set.

## Examples

### Monitor BroadcastJob status

 Assuming the cluster has only one node, run `kubectl get bcj` (shortcut name for BroadcastJob) and
 we will see the following:

```shell
 NAME                 DESIRED   ACTIVE   SUCCEEDED   FAILED
 broadcastjob-sample  1         0        1           0
```

- `Desired` : The number of desired Pods. This equals to the number of matched nodes in the cluster.
- `Active`: The number of active Pods.
- `SUCCEEDED`: The number of succeeded Pods.
- `FAILED`: The number of failed Pods.

### ttlSecondsAfterFinished

Run a BroadcastJob that each Pod computes a pi, with `ttlSecondsAfterFinished` set to 30.
The job will be deleted in 30 seconds after it is finished.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-ttl
spec:
  template:
    spec:
      containers:
        - name: pi
          image: perl
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  completionPolicy:
    type: Always
    ttlSecondsAfterFinished: 30
```

### activeDeadlineSeconds

Run a BroadcastJob that each Pod sleeps for 50 seconds, with `activeDeadlineSeconds` set to 10 seconds.
The job will be marked as Failed after it runs for 10 seconds, and the running Pods will be deleted.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-active-deadline
spec:
  template:
    spec:
      containers:
        - name: sleep
          image: busybox
          command: ["sleep", "50000"]
      restartPolicy: Never
  completionPolicy:
    type: Always
    activeDeadlineSeconds: 10
```

### completionPolicy

Run a BroadcastJob with `Never` completionPolicy. The job will continue to run even if all Pods have completed on all nodes.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-never-complete
spec:
  template:
    spec:
      containers:
        - name: sleep
          image: busybox
          command: ["sleep", "5"]
      restartPolicy: Never
  completionPolicy:
    type: Never
```

### failurePolicy

#### restartLimit

Run a BroadcastJob with `FailFast` failurePolicy. The job will be failed, when failed pod is found.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: BroadcastJob
metadata:
  name: broadcastjob-restart-limit
spec:
  template:
    spec:
      containers:
        - name: sleep
          image: busybox
          command: ["cat", "/path/not/exist"]
      restartPolicy: Never
  completionPolicy:
    type: Never
  failurePolicy:
    type: FailFast
    restartLimit: 3
```

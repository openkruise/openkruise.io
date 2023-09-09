---
title: Job Sidecar Terminator
---

**FEATURE STATE:** Kruise v1.4.0

In Kubernetes world, for job workload, one may expect pods enter `Completed` phase once the main container exited. However, when these pods have long-running sidecar containers, these sidecars will actually remain running after the main containers completed.

To solve such problem, job sidecar terminator controller watches and terminates sidecar containers for such job-type Pods when its main containers completed.

## Requirements

 - Enabled `JobSidecarTerminator` feature gate when installing/upgrading Kruise (defaults to `disabled`).
 - Enabled `KruiseDaemon` feature gate when installing/upgrading Kruise (defaults to `enabled`).

## Usage

### For Pods Running on Normal Nodes
It is very easily to use this feature if your Pods run on normal nodes, you just need to add a special env to the sidecar containers you want to terminate in the Pods, and Kruise will terminate them using [CRR](containerrecreaterequest.md) at the right time:
```yaml
kind: Job
spec:
  template:
    spec:
      containers:
        - name: sidecar
          env:
            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT
              value: "true"
        - name: main
... ...
```

### For Pods Running on Virtual Nodes
For certain serverless container platforms like [ECI](https://www.aliyun.com/product/eci) and [Fargate](https://aws.amazon.com/cn/fargate/), their Pods run on [Virtual-Kubelet](https://virtual-kubelet.io/#:~:text=Virtual%20Kubelet%20is%20an%20open,as%20serverless%20cloud%20container%20platforms.) instead of normal nodes, which means Kruise cannot terminate its sidecar using CRR because Kruise Daemon cannot run on virtual-kubelet.
However, we can address this issue by utilizing the pod in-place-update mechanism offered by native Kubernetes. If a sidecar container needs to be terminated, we can replace the original sidecar image with an image that exits as soon as it is pulled.

#### Step 1: Prepare a special image
- This image should exit as soon as it is pulled and started.
- This image should be compatible with the commands and args of original sidecar container.

#### Step 2: Config your sidecar container
```yaml
kind: Job
spec:
  template:
    spec:
      containers:
        - name: sidecar
          env:
            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE
              value: "example/quick-exit:v1.0.0"
        - name: main
... ...
```
Replace `"example/quick-exit:v1.0.0"` with your prepared image.

### Notes

- Your sidecar container must respond the `SIGTERM` signal, and the entrypoint should `exit 0` when received this signal.

- This feature can handle the Pods with `Never`/`OnFailure` restart policy, and doesn't care which type of job controllers they're controlled by.

- The conatiner with env `KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT` will be treated as sidecars, the others as main containers.

- The sidecars will be terminated when ALL main containers completed.

- In `Never` restart policy settings, main container will be treated as `completed` once it exit.

- In `OnFailure` restart policy settings, main container will be treated as `completed` once it exit and exit code must be `0`.

- In Pods on real nodes mode, `KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT` has a higher priority than `KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE`

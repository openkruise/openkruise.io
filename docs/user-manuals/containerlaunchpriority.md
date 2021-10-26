---
title: Container Launch Priority
---

**FEATURE STATE:** Kruise v1.0.0

Container Launch Priority provides a way to help users **control the sequence of containers start** in a Pod.

> Usually the sequences of containers start and stop are controlled by Kubelet. Kubernetes used to have a [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/753-sidecar-containers), which plans to add a type field for container to identify the priority of start and stop.
> However, it has been refused because of [sig-node thought it may bring a huge change to code](https://github.com/kubernetes/enhancements/issues/753#issuecomment-713471597).

Note that the feature works for Pod, **no matter what kind of owner it belongs to**, which means Deployment, CloneSet or any other Workloads are all supported.

## Usage

### Start by containers ordinal

It only requires you to add an annotation in Pod:

```yaml
apiVersion: v1
kind: Pod
  labels:
    apps.kruise.io/container-launch-priority: Ordered
spec:
  containers:
  - name: sidecar
    # ...
  - name: main
    # ...
```

Then Kruise will ensure the former container (sidecar) to be started before the later one (main).

### Start by configurable sequence

You should set the priority env `KRUISE_CONTAINER_PRIORITY` in container:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: main
    # ...
  - name: sidecar
    env:
    - name: KRUISE_CONTAINER_PRIORITY
      value: "1"
    # ...
```

1. The range of the value is `[-2147483647, 2147483647]`. Defaults to `0` if no such env exists.
2. The container with higher priority will be guaranteed to start before the others with lower priority.
3. The containers with same priority have no limit to their start sequence.

## Requirement

ContainerLaunchPriority requires `PodWebhook` feature-gate to be enabled, which is the default state.

## Implementation Details

Kruise webhook will admit for all pod creation.
When webhook finds a pod has `apps.kruise.io/container-launch-priority` annotation or `KRUISE_CONTAINER_PRIORITY` in env,
it will inject `KRUISE_CONTAINER_BARRIER` env into containers.

The value of KRUISE_CONTAINER_BARRIER is from a ConfigMap named `{pod-name}-barrier`, and the key is related to the priority of each container.

For example:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: main
    # ...
    env:
    - name: KRUISE_CONTAINER_BARRIER
      valueFrom:
        configMapKeyRef:
          name: {pod-name}-barrier
          key: "p_0"
  - name: sidecar
    env:
    - name: KRUISE_CONTAINER_PRIORITY
      value: "1"
    - name: KRUISE_CONTAINER_BARRIER
      valueFrom:
        configMapKeyRef:
          name: {pod-name}-barrier
          key: "p_1"
    # ...
```

Kruise controller will create an empty ConfigMap for this pod, then add the keys into ConfigMap according to the priorities and containerStatuses of pod.

As the example before, controller will firstly add `p_1` key into ConfigMap, waiting for sidecar container running and ready, and finally add `p_0` into ConfigMap to let Kubelet start main container.

Besides, you may see `CreateContainerConfigError` state when you use `kubectl get` during pod is starting with priority.
It is because Kubelet can't find some keys at that moment, and will be fine after all container in Pod started.

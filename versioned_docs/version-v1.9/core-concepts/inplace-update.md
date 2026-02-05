---
title: InPlace Update
---

In-place Update is one of the key features provided by OpenKruise.

Workloads that support in-place update:

- [CloneSet](/docs/user-manuals/cloneset)
- [Advanced StatefulSet](/docs/user-manuals/advancedstatefulset)
- [Advanced DaemonSet](/docs/user-manuals/advanceddaemonset)
- [SidecarSet](/docs/user-manuals/sidecarset)

Currently `CloneSet`, `Advanced StatefulSet` and `Advanced DaemonSet` re-use the same code package [`./pkg/util/inplaceupdate`](https://github.com/openkruise/kruise/tree/master/pkg/util/inplaceupdate) and have similar behaviours of in-place update. In this article, we would like to introduce the usage and workflow of them.

Note that the in-place update workflow of `SidecarSet` is a little different from the other workloads, such as it will not set Pod to not-ready before update. So the things we talk below do not totally go for `SidecarSet`.

## What is in-place update?

Once we are going to update image in a existing Pod, look at the comparation between *Recreate* and *InPlace* Update:

![alt](/img/docs/core-concepts/inplace-update-comparation.png)

In **ReCreate** way we have to delete the old Pod and create a new Pod:

- Pod name and uid all changed, because they are totally different Pod objects (such as Deployment update)
- Or Pod name may not change but uid changed, because they are still different Pod objects, although re-use the same name (such as StatefulSet update)
- Node name of the Pod changed, because the new Pod is almost impossible to be scheduled to the previous node.
- Pod IP changed, because the new Pod is almost impossible to be allocated the previous IP.

But for **InPlace** way we can re-use the Pod object but only modify the fields in it, so that:

- Avoid additional cost of scheduling, allocating IP, allocating and mounting volumes
- Faster image pulling, because of we can re-use most of image layers pulled by the old image and only to pull several new layers
- When a container is in-place updating, the other containers in Pod will not be affected and remain running.

## Understand *InPlaceIfPossible*

The update type in Kruise workloads is named `InPlaceIfPossible`, which tells Kruise to update Pods in-place as possible, and it should go back to ReCreate Update if impossible.

What changes does it consider to be possible to in-place update?

1. Update `spec.template.metadata.*` in workloads, such as labels and annotations, Kruise will only update the metadata to existing Pods without recreate them.
2. Update `spec.template.spec.containers[x].image` in workloads, Kruise will in-place update the container image in Pods without recreate them.
3. **Since Kruise v1.0 (including v1.0 alpha/beta)**, update `spec.template.metadata.labels/annotations` and there exists container env from the changed labels/annotations, Kruise will in-place update them to renew the env value in containers.
4. **Since Kruise v1.8**, if the Kubernetes cluster has `InPlacePodVerticalScaling` enabled and the Kruise `InPlaceWorkloadVerticalScaling` feature is also enabled, updating `spec.template.spec.containers[x].resources` will trigger Kruise to perform an in-place update of these container resources without recreate them.

Otherwise, the changes to other fields such as `spec.template.spec.containers[x].env` or `spec.template.spec.containers[x].resources`(if the Kruise `InPlaceWorkloadVerticalScaling` feature is disabled) will go back to ReCreate Update.

Take the CloneSet YAML below as an example:

1. Modify `app-image:v1` image, will trigger in-place update.
2. Modify the value of `app-config` in annotations, will trigger in-place update (Read the [Requirements](#requirements) below).
3. Modify the two fields above together, will tigger in-place update both image and environment.
4. Directly modify the value of `APP_NAME` in env or add a new env, will trigger recreate update.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  ...
spec:
  replicas: 1
  template:
    metadata:
      annotations:
        app-config: "... the real env value ..."
    spec:
      containers:
      - name: app
        image: app-image:v1
        env:
        - name: APP_CONFIG
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['app-config']
        - name: APP_NAME
          value: xxx
  updateStrategy:
    type: InPlaceIfPossible
```

## Workflow overview

You can see the whole workflow of in-place update below (*you may need to right click and open it in a new tab*):

![alt](/img/docs/core-concepts/inplace-update-workflow.png)

## InPlace update with launch priorities

**FEATURE STATE:** Kruise v1.1.0

When you in-place update multiple containers at once and the containers have different [launch priorities](/docs/user-manuals/containerlaunchpriority),
Kruise will update the containers by order according to the priorities.

- For pods without container launch priorities, no guarantees of the execution order during in-place update multiple containers.
- For pods with container launch priorities:
  - keep execution order during in-place update multiple containers with different priorities.
  - no guarantees of the execution order during in-place update multiple containers with the same priority.

For example, we have the CloneSet that includes two containers with different priorities:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  ...
spec:
  replicas: 1
  template:
    metadata:
      annotations:
        app-config: "... config v1 ..."
    spec:
      containers:
      - name: sidecar
        env:
        - name: KRUISE_CONTAINER_PRIORITY
          value: "10"
        - name: APP_CONFIG
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['app-config']
      - name: main
        image: main-image:v1
  updateStrategy:
    type: InPlaceIfPossible
```

When we update the CloneSet to change `app-config` annotation and image of main container, which means both sidecar and main containers need to update,
Kruise will firstly in-place update pods that recreates sidecar container with the new env from annotation.

At this moment, we can find the `apps.kruise.io/inplace-update-state` annotation in updated Pod and see its value:

```json
{
  "revision": "{CLONESET_NAME}-{HASH}",         // the target revision name of this in-place update
  "updateTimestamp": "2022-03-22T09:06:55Z",    // the start time of this whole update
  "nextContainerImages": {"main": "main-image:v2"},                // the next containers that should update images
  // "nextContainerRefMetadata": {...},                            // the next containers that should update env from annotations/labels
  "preCheckBeforeNext": {"containersRequiredReady": ["sidecar"]},  // the pre-check must be satisfied before the next containers can update
  "containerBatchesRecord":[
    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]}  // the first batch of containers that have updated (it just means the spec of containers has updated, such as images in pod.spec.container or annotations/labels, but doesn't mean the real containers on node have been updated completely)
  ]
}
```

When the sidecar container has been updated successfully, Kruise will update the next main container. Finally, you will find the `apps.kruise.io/inplace-update-state` annotation looks like:

```json
{
  "revision": "{CLONESET_NAME}-{HASH}",
  "updateTimestamp": "2022-03-22T09:06:55Z",
  "lastContainerStatuses":{"main":{"imageID":"THE IMAGE ID OF OLD MAIN CONTAINER"}},
  "containerBatchesRecord":[
    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]},
    {"timestamp":"2022-03-22T09:07:20Z","containers":["main"]}
  ]
}
```

Usually, users only have to care about the `containerBatchesRecord` to make sure the containers are updated in different batches. If the Pod is blocking during in-place update, you should check the `nextContainerImages/nextContainerRefMetadata` and see if the previous containers in `preCheckBeforeNext` have been updated successfully and ready.

## Requirements

To use InPlace Update for env from metadata, you have to enable `kruise-daemon` (*defaults to be enabled*) and `InPlaceUpdateEnvFromMetadata` feature-gate when install or upgrade Kruise chart. 

Note that if you have some nodes of virtual-kubelet type, kruise-daemon may not work on them and in-place update for env from metadata will not be executed.

## In-Place Update Support for Modifying Resources

**FEATURE STATE:** Kruise v1.8.0

If you have enabled `InPlaceWorkloadVerticalScaling` during [Kruise installation or upgrade](../installation##optional-feature-gate),
Kruise Advanced Workloads support modifying container resources (CPU/Memory) during in-place updates.
This feature allows users to directly update the following fields without triggering Pod recreation:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
spec:
  #...
  template:
    spec:
      containers:
      - name: <container-name>
        resources:
          requests:
            cpu: "2"       # Can be modified
            memory: "2Gi"  # Can be modified
          limits:
            cpu: "4"       # Can be modified
            memory: "4Gi"  # Can be modified
```
### Notes

1. This feature requires the Kubernetes cluster to have the `InPlacePodVerticalScaling` feature-gate enabled. Ensure your cluster supports this capability. For more information, refer to the [Kubernetes documentation](https://kubernetes.io/zh-cn/blog/2023/05/12/in-place-pod-resize-alpha/).

2. **Cgroupv1 Limitations**:
  - In a Cgroupv1 environment, **modifying both image and resource fields simultaneously is prohibited** (e.g., updating both the image and CPU quota at the same time). The operation must be performed in two steps:
    1. First, complete the in-place update for resource modifications.
    2. Then, trigger an in-place update for image changes.
  - For more details, see the community [Issue #127356](https://github.com/kubernetes/kubernetes/issues/127356).

3. **Resource Type Restrictions**:
  - Only modifications to `cpu` and `memory` fields within `requests` and `limits` are supported.
  - Other resource types (e.g., GPU) will trigger Pod recreation.
  - Modifications to resources must not alter the Pod's QoS. If the Pod's QoS changes, it will trigger Pod recreation.

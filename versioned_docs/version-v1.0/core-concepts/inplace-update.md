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

Otherwise, the changes to other fields such as `spec.template.spec.containers[x].env` or `spec.template.spec.containers[x].resources` will go back to ReCreate Update.

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

## Requirements

To use InPlace Update for env from metadata, you have to enable `kruise-daemon` (*defaults to be enabled*) and `InPlaceUpdateEnvFromMetadata` feature-gate when install or upgrade Kruise chart. 

Note that if you have some nodes of virtual-kubelet type, kruise-daemon may not work on them and in-place update for env from metadata will not be executed.

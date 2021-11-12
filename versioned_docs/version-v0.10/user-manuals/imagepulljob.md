---
title: ImagePullJob
---

NodeImage and ImagePullJob are new CRDs provided since Kruise v0.8.0 version.

Kruise will create a NodeImage for each Node, and it contains images that should be downloaded on this Node.

Users can create an ImagePullJob to declare an image should be downloaded on which nodes.

![Image Pulling](/img/docs/user-manuals/imagepulling.png)

Note that the NodeImage is quite **a low-level API**. You should only use it when you prepare to pull an image on a definite Node.
Otherwise, you should **use the ImagePullJob to pull an image on a batch of Nodes.**

## ImagePullJob (high-level)

ImagePullJob is a **namespaced-scope** resource.

API definition: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
metadata:
  name: job-with-always
spec:
  image: nginx:1.9.1   # [required] image to pull
  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1
  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)
    names:
    - node-1
    - node-2
    matchLabels:
      node-type: xxx
  # podSelector:         # [optional] label selector over pods that should pull image on nodes of these pods. Mutually exclusive with selector.
  #  pod-label: xxx
  completionPolicy:
    type: Always                  # [optional] defaults to Always
    activeDeadlineSeconds: 1200   # [optional] no default, only work for Alway type
    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Alway type
  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600
    backoffLimit: 3
    timeoutSeconds: 300
```

You can write the names or label selector in the `selector` field to assign Nodes **(only one of them can be set)**.
If no `selector` is set, the image will be pulled on all Nodes in the cluster.

Or you can write the podSelector to pull image on nodes of these pods. `podSelector` is mutually exclusive with `selector`.

Also, ImagePullJob has two completionPolicy types:

- `Always` means this job will eventually complete with either failed or succeeded.
  - `activeDeadlineSeconds`: timeout duration for this job
  - `ttlSecondsAfterFinished`: after this job finished (including success or failure) over this time, this job will be removed
- `Never` means this job will never complete, it will continuously pull image on the desired Nodes every day.

### configure secrets

If the image is in a private registry, you may want to configure the pull secrets for the image:

```yaml
# ...
spec:
  pullSecrets:
  - secret-name1
  - secret-name2
```

Because of ImagePullJob is a namespaced-scope resource, the secrets should be in the same namespace of this ImagePullJob,
and you should only put the secret names into `pullSecrets` field.

## NodeImage (low-level)

NodeImage is a **cluster-scope** resource.

API definition: https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go

When Kruise has been installed, nodeimage-controller will create NodeImages for Nodes with the same names immediately.
And when a Node has been added or removed, nodeimage-controller will also create or delete NodeImage for this Node.

What's more, nodeimage-controller will also synchronize labels from Node to NodeImage. So the NodeImage and Node always have
the same name and labels. You can get NodeImage with the Node name, or list NodeImage with the Node labels as selector.

Typically, an empty NodeImage looks like this:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: NodeImage
metadata:
  labels:
    kubernetes.io/arch: amd64
    kubernetes.io/os: linux
    # ...
  name: node-xxx
  # ...
spec: {}
status:
  desired: 0
  failed: 0
  pulling: 0
  succeeded: 0
```

If you want to pull an image such as `ubuntu:latest` on this Node, you can:

1. `kubectl edit nodeimage node-xxx` and write below into it (ignore the comments):

```yaml
# ...
spec:
  images:
    ubuntu:  # image name
      tags:
      - tag: latest  # image tag
        pullPolicy:
          ttlSecondsAfterFinished: 300  # [required] after this image pulling finished (including success or failure) over 300s, this task will be removed
          timeoutSeconds: 600           # [optional] timeout duration for once pulling, defaults to 600
          backoffLimit: 3               # [optional] retry times for pulling, defaults to 3
          activeDeadlineSeconds: 1200   # [optional] timeout duration for this task, no default
```

2. `kubectl patch nodeimage node-xxx --type=merge -p '{"spec":{"images":{"ubuntu":{"tags":[{"tag":"latest","pullPolicy":{"ttlSecondsAfterFinished":300}}]}}}}'`

You can read the NodeImage status using `kubectl get nodeimage node-xxx -o yaml`,
and you will find the task removed from spec and status after it has finished over 600s.

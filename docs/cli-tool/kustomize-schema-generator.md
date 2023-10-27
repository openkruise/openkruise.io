---
title: Kustomize Schema Generator
---


[kruise-api](https://github.com/openkruise/kruise-api) provides tools for openkruise to generate `kustomize schema` files that support openkruise CRD, and provides the current available `OpenAPI schema`.

## Schema Generator

When using `kustomize` to manage applications, in order to use `strategic merge patches (SMPs)` to process environment variables or any array type fields in resource definitions when using openkruise resources, the `OpenAPI schema` of openkruise CRD needs to contain the specified `patch strategy`. `Schema Generator` supports the function of quickly generating `kustomize schema` files based on the resource definition of openkruise. The specific way of generating `kustomize schema` files can be viewed in [README.md](https://github.com/openkruise/kruise-api/blob/master/cmd/gen-schema/README.md).

## Schema Usage

### How to specify the schema file

[kruise-api](https://github.com/openkruise/kruise-api) provides available `OpenAPI schema` files, you can use the latest version or specify the version of the `OpenAPI schema` file, just add the configuration block in `kustomization.yaml` like:

Use the latest version

```yaml
openapi:
  path: https://raw.githubusercontent.com/openkruise/kruise-api/master/schema/openkruise_all_k8s_kustomize_schema.json
```

Use the specified version

```yaml
openapi:
  path: https://raw.githubusercontent.com/openkruise/kruise-api/raw/<tag>/schema/openkruise_all_k8s_kustomize_schema.json
```

Or you can download [kruise-api](https://github.com/openkruise/kruise-api) to the local, and specify the local file path in the configuration block:

```yaml
openapi:
  path: <kruise-api-local-path>/schema/openkruise_all_k8s_kustomize_schema.json
```

### Example

Take `sidecarset` as an example to introduce how to use `kustomize OpenAPI schema` to support the merge strategy of openkruise CRD in kustomize.

A complete definition of `sidecarset` is as follows:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  selector:
    matchLabels:
      app: nginx
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 1
  containers:
    - name: sidecar1
      image: centos:6.7
      command: ["sleep", "999d"]
      volumeMounts:
        - name: log-volume1
          mountPath: /var/log
    - name: sidecar2
      image: centos:6.8
      command: ["sleep", "999d"] 
      volumeMounts:
        - name: log-volume2
          mountPath: /var/log
  volumes: 
    - name: log-volume1
      emptyDir: {}
    - name: log-volume2
      emptyDir: {}
```

This `sidecarset` currently has two containers, `sidecar1` and `sidecar2`, which mount two volumes named `log-volume1` and `log-volume2` respectively. Now If you want to add a new container `sidecar3`, mount a new volume named `log-volume3`, delete the `sidecar1` container with corresponding volume, and then make some simple modifications to other fields. Then you can write the `kustomization.yaml` file with the merge strategy as follows:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- sidecarset.yaml

openapi:
  path: https://raw.githubusercontent.com/openkruise/kruise-api/master/schema/openkruise_all_k8s_kustomize_schema.json

patchesStrategicMerge:
- |-
  apiVersion: apps.kruise.io/v1alpha1
  kind: SidecarSet
  metadata:
    name: test-sidecarset
  spec:
    containers:
      - name: sidecar1
        $patch: delete
      - name: sidecar2
        volumeMounts:
          - name: log-volume3
            mountPath: /var/log3
      - name: sidecar3
        image: centos:6.9
        command: ["sleep", "102d"]
        volumeMounts:
          - name: log-volume3
            mountPath: /var/log
    volumes:
      - name: log-volume1
        $patch: delete
      - name: log-volume3
        emptyDir: {}
```

The main thing added here is the `openapi` field and the path to the custom `OpenAPI schema` file. At this time, kustomize will determine the merge strategy of different fields according to the `x-kubernetes-patch-*` key in the `OpenAPI schema` file when patching. After executing the command `kustomize build .`, you can get the following results:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  containers:
  - command:
    - sleep
    - 999d
    image: centos:6.8
    name: sidecar2
    volumeMounts:
    - mountPath: /var/log3
      name: log-volume3
    - mountPath: /var/log
      name: log-volume2
  - command:
    - sleep
    - 102d
    image: centos:6.9
    name: sidecar3
    volumeMounts:
    - mountPath: /var/log
      name: log-volume3
  selector:
    matchLabels:
      app: nginx
  updateStrategy:
    maxUnavailable: 1
    type: RollingUpdate
  volumes:
  - emptyDir: {}
    name: log-volume3
  - emptyDir: {}
    name: log-volume2
```

You can refer to [here](https://github.com/openkruise/kruise-api/tree/master/test/kustomize/kruise) for other common usage examples of openkruise crd merge strategy.


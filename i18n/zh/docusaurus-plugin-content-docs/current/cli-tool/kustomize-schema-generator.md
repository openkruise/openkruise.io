---
title: Kustomize Schema Generator
---


[kruise-api](https://github.com/openkruise/kruise-api)为openkruise的功能提供了工具，用于生成支持openkruise CRD的`kustomize schema`文件，并提供了当前可用的`OpenAPI schema`。

## Schema Generator

在使用`kustomize`管理应用时，为了在使用openkruise资源时能够使用`strategic merge patches (SMPs)`来处理资源定义中的环境变量或任何数组类型字段，需要openkruise CRD的`OpenAPI schema`中包含指定的`patch strategy`。
`Schema Generator`支持了根据openkruise的资源定义快速生成`kustomize schema`文件的功能。`kustomize schema`文件生成的具体方式可以查看[README.md](https://github.com/openkruise/kruise-api/blob/master/cmd/gen-schema/README.md)。

## Schema Usage

### How to specify the schema file

[kruise-api](https://github.com/openkruise/kruise-api)中提供了可用的`OpenAPI schema`文件, 你可以直接使用最新版本或指定版本的`OpenAPI schema`文件，只需在`kustomization.yaml`中添加如下配置块：

使用最新版本

```yaml
openapi:
  path: https://raw.githubusercontent.com/openkruise/kruise-api/master/schema/openkruise_all_k8s_kustomize_schema.json
```

使用指定版本

```yaml
openapi:
  path: https://raw.githubusercontent.com/openkruise/kruise-api/raw/<tag>/schema/openkruise_all_k8s_kustomize_schema.json
```

或者你可以下载[kruise-api](https://github.com/openkruise/kruise-api)到本地，并在配置块中指定本地文件路径即可：

```yaml
openapi:
  path: <kruise-api-local-path>/schema/openkruise_all_k8s_kustomize_schema.json
```

### Example

下面以`sidecarset`为例，介绍如何在kustomize中使用`kustomize OpenAPI schema`来支持openkruise CRD的合并策略。

一个`sidecarset`的完整定义如下所示：

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

当前存在两个容器，分别为 `sidecar1` 和 `sidecar2`，它们分别挂载了两个名为`log-volume1`和`log-volume2`的卷。 现在希望添加一个新的容器`sidecar3`，并挂载一个新增的名为 `log-volume3` 的卷，同时将 `sidecar1` 以及对应 `volume` 删除，然后对一些其他字段做简单修改。那么可以编写如下的采用合并策略的kustomization.yaml文件：

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

这里主要额外添加了openapi字段并指定了自定义 `OpenAPI schema` 文件的路径，此时kustomize在patch时会根据`OpenAPI schema`文件中的 `x-kubernetes-patch-*` 键来决定不同字段的合并策略。
在执行命令 `kustomize build .` 后，可以得到如下结果：

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

其他常用的openkruise crd合并策略的使用案例可以参考[这里](https://github.com/openkruise/kruise-api/tree/master/test/kustomize/kruise)
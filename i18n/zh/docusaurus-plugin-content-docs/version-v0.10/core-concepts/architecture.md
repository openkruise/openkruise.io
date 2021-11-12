---
title: 系统架构
---

OpenKruise 的整体架构如下:

![alt](/img/docs/core-concepts/architecture.png)

## API

所有 OpenKruise 的功能都是通过 **Kubernetes API** 来提供, 比如：

- 新的 CRD 定义，比如

```shell script
$ kubectl get crd | grep kruise.io
advancedcronjobs.apps.kruise.io            2021-09-16T06:02:36Z
broadcastjobs.apps.kruise.io               2021-09-16T06:02:36Z
clonesets.apps.kruise.io                   2021-09-16T06:02:36Z
containerrecreaterequests.apps.kruise.io   2021-09-16T06:02:36Z
daemonsets.apps.kruise.io                  2021-09-16T06:02:36Z
imagepulljobs.apps.kruise.io               2021-09-16T06:02:36Z
nodeimages.apps.kruise.io                  2021-09-16T06:02:36Z
podunavailablebudgets.policy.kruise.io     2021-09-16T06:02:36Z
resourcedistributions.apps.kruise.io       2021-09-16T06:02:36Z
sidecarsets.apps.kruise.io                 2021-09-16T06:02:36Z
statefulsets.apps.kruise.io                2021-09-16T06:02:36Z
uniteddeployments.apps.kruise.io           2021-09-16T06:02:37Z
workloadspreads.apps.kruise.io             2021-09-16T06:02:37Z
# ...
```

- 资源对象中的特定标识（labels, annotations, envs 等），比如

```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    # 保护这个 namespace 下的 Pod 不被整个 ns 级联删除
    policy.kruise.io/delete-protection: Cascading
```

## Manager

Kruise-manager 是一个运行 controller 和 webhook 中心组件，它通过 Deployment 部署在 `kruise-system` 命名空间中。

```bash
$ kubectl get deploy -n kruise-system
NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
kruise-controller-manager   2/2     2            2           4h6m

$ kubectl get pod -n kruise-system -l control-plane=controller-manager
NAME                                         READY   STATUS    RESTARTS   AGE
kruise-controller-manager-68dc6d87cc-k9vg8   1/1     Running   0          4h6m
kruise-controller-manager-68dc6d87cc-w7x82   1/1     Running   0          4h6m
```

<!-- It can be deployed as multiple replicas with Deployment, but only one of them could become leader and start working, others will keep retrying to acquire the lock. -->

逻辑上来说，如 cloneset-controller/sidecarset-controller 这些的 controller 都是独立运行的。不过为了减少复杂度，它们都被打包在一个独立的二进制文件、并运行在 `kruise-controller-manager-xxx` 这个 Pod 中。

除了 controller 之外，`kruise-controller-manager-xxx` 中还包含了针对 Kruise CRD 以及 Pod 资源的 admission webhook。Kruise-manager 会创建一些 webhook configurations 来配置哪些资源需要感知处理、以及提供一个 Service 来给 kube-apiserver 调用。

```bash
$ kubectl get svc -n kruise-system
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kruise-webhook-service   ClusterIP   172.24.9.234   <none>        443/TCP   4h9m
```

上述的 `kruise-webhook-service` 非常重要，是提供给 kube-apiserver 调用的。

## Daemon

这是从 Kruise v0.8.0 版本开始提供的一个新的 daemon 组件。

它通过 DaemonSet 部署到每个 Node 节点上，提供镜像预热、容器重启等功能。

```bash
$ kubectl get pod -n kruise-system -l control-plane=daemon
NAME                  READY   STATUS    RESTARTS   AGE
kruise-daemon-6hw6d   1/1     Running   0          4h7m
kruise-daemon-d7xr4   1/1     Running   0          4h7m
kruise-daemon-dqp8z   1/1     Running   0          4h7m
kruise-daemon-dv96r   1/1     Running   0          4h7m
kruise-daemon-q7594   1/1     Running   0          4h7m
kruise-daemon-vnsbw   1/1     Running   0          4h7m
```

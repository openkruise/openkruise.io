---
title: Container Launch Priority
---

**FEATURE STATE:** Kruise v1.0.0

Container Launch Priority 提供了控制一个 Pod 中容器启动顺序的方法。

> 通常来说 Pod 容器的启动和退出顺序是由 Kubelet 管理的。Kubernetes 曾经有一个 [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/753-sidecar-containers) 计划在 container 中增加一个 type 字段来标识不同类型容器的启停优先级。
> 但是由于[sig-node考虑到对现有代码架构的改动太大](https://github.com/kubernetes/enhancements/issues/753#issuecomment-713471597)，它已经被拒绝了。

注意，这个功能作用在 Pod 对象上，不管它的 owner 是什么类型的，因此可以适用于 Deployment、CloneSet 以及其他的 workload 种类。

## 用法

### 按照 container 顺序启动

只需要在 Pod 中定义一个 annotation 即可：

```yaml
apiVersion: v1
kind: Pod
  annotations:
    apps.kruise.io/container-launch-priority: Ordered
spec:
  containers:
  - name: sidecar
    # ...
  - name: main
    # ...
```

Kruise 会保证前面的容器（sidecar）会在后面容器（main）之前启动。

### 按自定义顺序启动

需要在 Pod container 中添加 `KRUISE_CONTAINER_PRIORITY` 环境变量:

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

1. 值的范围在 `[-2147483647, 2147483647]`，不写默认是 `0`。
2. 权重高的容器，会保证在权重低的容器之前启动。
3. 相同权重的容器不保证启动顺序。

## 使用要求

使用 ContainerLaunchPriority 功能需要打开 `PodWebhook` feature-gate（默认就是打开的，除非显式关闭）。

## 实现细节

Kruise webhook 会处理所有 Pod 创建的请求。
当 webhook 发现 Pod 中带有 `apps.kruise.io/container-launch-priority` annotation 或是 `KRUISE_CONTAINER_PRIORITY` 环境变量，则在它的每个容器中注入 `KRUISE_CONTAINER_BARRIER` 环境变量。

`KRUISE_CONTAINER_BARRIER` 环境变量是 value from 一个名为 `{pod-name}-barrier` 的 ConfigMap，key 是与这个容器的权重所对应。比如：

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

然后 Kruise controller 会创建一个空的 ConfigMap，并按照权重顺序以及 Pod 中容器的启动状态逐渐将 key 加入到 ConfigMap 中。

以上面的例子来看，controller 会先加入 `p_1` key，等待 sidecar 容器启动成功后，再加入 `p_0` key 来允许 Kubelet 启动 main 容器。

另外，在 Pod 启动的过程中，用 kubectl 可能会看到 Pod 处于 `CreateContainerConfigError` 状态，这是由于 Kubelet 没有找到部分容器的 ConfigMap key 导致的，在全部容器启动完成后会消失。

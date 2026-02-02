---
title: SidecarSet 动态资源注入
---
SidecarSet 被广泛地应用于各种代理服务，在某些场景下我们期望 sidecarContainer 的资源能够根据目标 Pod 的资源动态调整。

### 例子

通过配置 sidecarSet 对象的 `spec.containers[i].resourcesPolicy` 和 `spec.initContainers[i].resourcesPolicy` 来控制 kruise sidecarContainer 的资源计算策略。

现在我们期望 sidecarContainer 的 cpu 资源是一个折线图，经过点集 `[[0,0.5], [1,0.5], [2,1], [3,2], [4,3], [5,3]]`，其中每一个点的横坐标代表目标 pod 中其他容器的 cpu 资源 limits 之和，纵坐标代表 sidecarContainer 的 cpu 资源 limits。为协助用户快速生成表达式，我们提供了一套计算器相关的工具，使用方式如下:
```bash
# clone kruise git 仓库
git clone https://github.com/openkruise/kruise.git

# 进入 kruise 目录
cd kruise

# 生成表达式，该命令会返回 min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0)
python3 hack/calculator-helper/generator/generate_expression.py "[[0,0.5], [1,0.5], [2,1], [3,2], [4,3], [5,3]]" -v cpu

# 为进一步确认表达式的正确性，用户可以通过 validator 工具来绘制图片结果，
# 该工具所使用的计算器实现与ResourcePolicy实现一致，能够确保最终结果的一致性

## 构建 validator 工具
cd hack/calculator-helper/validator && go build -o validator

## 验证表达式并生成最终图片
./validator -expr "min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0)" -var cpu -min 0 -max 10500m -output plot.png
```
![sidecarset-resource-policy-plot](/img/docs/best-practices/sidecarset-resource-policy-plot.png)

确认表达式的正确性之后，我们就可以将其应用到 sidecarSet 中了。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
spec:
  containers:
  - name: sidecar1
    image: centos:6.7
    resourcesPolicy:
      targetContainersMode: sum # 表示根据所有目标容器的资源 limits 之和来计算 sidecarContainer 的资源
      targetContainersNameRegex: ^.*$ # 匹配所有容器
      resourcesExpr:
        limits:
          cpu: min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0) # 表达式变量中的 cpu 代表目标容器的 cpu 资源 limits 之和，它值的计算方式通过 targetContainersMode 和 targetContainersNameRegex 来确定
          memory: 200Mi
        requests:
          cpu: 50m
          memory: 100Mi
```

**注意**：
- 支持的表达式运算：
  - 基本算术：`+`、`-`、`*`、`/`
  - 括号：`(` 和 `)`
  - 函数：`max()`、`min()`
  - 百分比：例如 `50%`（表示 0.5）
  - Kubernetes 资源：例如 `40m`（40 毫核）、`100Mi`（100 兆字节）
- 支持的表达式值类型：
  - 整数：例如 `42`
  - 浮点数：例如 `3.14`
  - 百分比：例如 `50%`（自动转换为 0.5）
  - Kubernetes 资源：例如 `200m`、`512Mi`、`1Gi`
- 如果同时配置了 resourcesPolicy 和 resources, kruise validating webhook 将拒绝 Pod 创建请求。
- `targetContainersNameRegex` 是用于匹配目标容器名称的正则表达式模式。如果没有容器名称与此正则表达式匹配，验证 webhook 将拒绝 Pod 创建请求。目标容器包括原生 sidecar 容器和普通容器，不包括 Kruise sidecar 容器。
- `resourcesPolicy` 可以应用于原生 sidecar 容器（`sidecarset.spec.initContainers.resourcesPolicy`）和普通容器（`sidecarset.spec.containers.resourcesPolicy`）。
- 动态资源注入仅在 Pod 创建时生效，不会在 Pod 运行时动态更新。

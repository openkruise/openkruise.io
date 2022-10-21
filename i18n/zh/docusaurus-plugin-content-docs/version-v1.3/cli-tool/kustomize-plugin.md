---
title: Kustomize ResourceDistribution Generator
---

[Kruise-tools](https://github.com/openkruise/kruise-tools) 为 kruise 的功能提供了作为kustomize的第三方插件的generator和transformers。

## ResourceDistribution Generator

> ResourceDistribution Generator插件从 v1.0.0 (alpha/beta) 开始，要求使用 Kustomize >= 4.3.0 的版本，安装参考 [kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/)。

在使用kustomize管理应用时，利用kustomize自带的generator能够直接读取文件作为data内容来创建Configmap或Secret ，避免了手动复制时容易出现的种种格式错误。ResourceDistribution Generator为kustomize的第三方插件，使用该插件可以完成读取文件作为data内容来创建ResourceDistribution的工作。

### 下载ResourceDistribution generaotor

[该页面](https://github.com/openkruise/kruise-tools/releases)提供了常见版本的二进制文件下载路径。目前`linux`, `darwin`(OS X),`windows`提供`x86_64`和`arm64`。如果您使用其他一些系统或架构，则必须下载[源代码](https://github.com/openkruise/kruise-tools/blob/master/cmd/resourcedistributiongenerator)并执行`go build`来构建二进制文件。

### API说明

ResourceDistributionGenerator是kusomize的Exec KRM functions插件，主要由 `resource` 和 `targets` 两个字段构成，构建后会生成对应于ResourceDistribution的`resource` 和 `targets` 内容。`metadata`中的`name`用来设置生成的resourceDistribution的名称，注解`config.kubernetes.io/function`中需要写入本插件在文件系统中的路径，如果使用的是相对路径，需要相对于引用配置文件的kustomization文件。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  name: rdname
  annotations:
    config.kubernetes.io/function: |
      exec:
        path: ./plugins/resourcedistributiongenerator
resource:
	... ...
targets:
	... ...
```

### Resource字段说明

`resource`字段中内容用来生成被分发的资源，`literals`、`files`、`envs`字段的使用和[Configmap或Secret Generator](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/)中用法相同。

- `resourceKind`: 指定分发的资源类型，Secret或ConfigMap
- `resourceName`: 设置分发资源的名称，即Secret或ConfigMap的名称
- `literals`: 使用给定的文字中的键/值对创建data内容
- `files`: 使用给定文件的名称和内容创建data内容
- `envs`: 使用文件中的键/值对创建data内容

一个配置正确的resource字段如下所示：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ... 
resource:
  resourceKind: ConfigMap
  resourceName: cmname
  files:
    - file.properties
  literals:
    - JAVA_HOME=/opt/java/jdk
targets:
	... ...
```

#### ResourceDistribution from File

ResourceDistribution 资源可以从文件中生成 - 例如从一个 java.properties文件。

示例：使用包含文件内容的数据项生成 ResourceDistribution。

ResourceDistribution 将从文件内容中填充数据值。每个文件的内容将显示为 ResourceDistribution 中由文件名作为key的单个数据项。

**File Input**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ... 
resource:
  resourceKind: ConfigMap
  resourceName: cmname
  files:
    - application.properties
targets:
	... ...
```

application.properties

```
FOO=Bar
```

**Build Output**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  ... ...
spec:
  resource:
    apiVersion: v1
    data:
      application.properties: |
        FOO=Bar
    kind: ConfigMap
    metadata:
      name: cmname
  targets:
    ... ...
```

#### ResourceDistribution from Literals

ResourceDistribution 资源可以从文字键值对生成 - 例如JAVA_HOME=/opt/java/jdk.

> - 键/值由 = 分隔（左侧是键）
> - 每个文本的值将显示为 ResourceDistribution 中的一个数据项，该数据项的key即为文本的key

示例：使用从文字生成的 2 个数据项创建一个 ResourceDistribution。

**File Input**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ...
resource:
  resourceKind: ConfigMap
  resourceName: cmname
  literals:
    - JAVA_HOME=/opt/java/jdk
    - JAVA_TOOL_OPTIONS=-agentlib:hprof
targets:
  ... ...
```

**Build Output**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  ... ...
spec:
  resource:
    apiVersion: v1
    data:
      JAVA_HOME: /opt/java/jdk
      JAVA_TOOL_OPTIONS: -agentlib:hprof
    kind: ConfigMap
    metadata:
      name: cmname
  targets:
    ... ...
```

#### ResourceDistribution from env file

ResourceDistribution 资源可以从键值对生成，这与使用文字非常相似，但从env文件中获取键值对。 

> - 环境文件中的键/值对用 = 分隔（左侧是键） 
> - 每行的值将显示为 ResourceDistribution 中由其键作为key的数据项。

示例：使用从env文件生成的 3 个数据项创建一个 ResourceDistribution。

**File Input**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ...
resource:
  resourceKind: ConfigMap
  resourceName: cmname
  envs:
    - tracing.env
targets:
  ... ...
```

tracing.env

```
ENABLE_TRACING=true
SAMPLER_TYPE=probabilistic
SAMPLER_PARAMETERS=0.1
```

**Build Output**

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  ... ...
spec:
  resource:
    apiVersion: v1
    data:
      ENABLE_TRACING: "true"
      SAMPLER_TYPE: "probabilistic"
      SAMPLER_PARAMETERS: "0.1"
    kind: ConfigMap
    metadata:
      name: cmname
  targets:
    ... ...
```

### Targets字段说明

`targets`字段和ResourceDistribution中`targets`字段的用法基本相同，注意`includedNamespaces`和`excludedNamespaces`字段的内容直接是命名空间的名称。

一个配置正确的targets字段如下所示：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ... 
resource:
	... ...
targets:
  allNamespaces: true
  excludedNamespaces:
    - ns-2
  includedNamespaces:
    - ns-1
  namespaceLabelSelector:
    matchLabels:
      group: "test"
```

### Options和ResourceOptions字段说明

`options`和`resourceOptions`字段分别用来为生成的ResourceDistribution和其中的Resource（即ConfigMap或Secret）设置注解或标签。

一个配置正确的`options`和`resourceOptions`字段如下所示：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ... ... 
resource:
  ... ...
  resourceOptions:
    annotations:
      dashboard: "1"
    labels:
      environment: "dev"
targets:
	... ...
options:
  annotations:
    type: "slave"
  labels:
    version: "stable"
```

### 完整用例

1. 创建一个demo目录作为工作空间并进入。将下载的ResourceDistributionGenerator插件放在当前目录，并输入以下命令创建一个名为rdGenerator.yaml的配置文件。

```bash
cat > rdGenerator.yaml <<EOF
#rdGenerator.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  name: rdname
  annotations:
    config.kubernetes.io/function: |
      exec:
        path: ./resourcedistributiongenerator
resource:
  resourceKind: ConfigMap
  resourceName: cmname
  files:
    - application.properties
  literals:
    - JAVA_HOME=/opt/java/jdk
  resourceOptions:
    annotations:
      dashboard: "1"
options:
  labels:
    app.kubernetes.io/name: "app1"
targets:
  includedNamespaces:
    - ns-1
  namespaceLabelSelector:
    matchLabels:
      group: "test"
EOF
```

2. 使用以下命令创建application.properties文件作为文件输入。

```bash
cat > application.properties <<EOF
FOO=Bar
FIRST=1
SECOND=2
LAST=3
EOF
```

3. 使用以下命令创建kustomization文件。

```bash
cat > kustomization.yaml <<EOF
#kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
generators:
- rdGenerator.yaml
EOF
```

4. 使用`kustomize build --enable-alpha-plugins --enable-exec .`命令构建应用，效果如下

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  labels:
    app.kubernetes.io/name: app1
  name: rdname
spec:
  resource:
    apiVersion: v1
    data:
      JAVA_HOME: /opt/java/jdk
      application.properties: |
        FOO=Bar
        FIRST=1
        SECOND=2
        LAST=3
    kind: ConfigMap
    metadata:
      annotations:
        dashboard: "1"
      name: cmname
  targets:
    includedNamespaces:
      list:
      - name: ns-1
    namespaceLabelSelector:
      matchLabels:
        group: test
```

### 在argocd中使用ResourceDistribution generator

在argocd中，kustomize插件的使用方法同上。除此之外，还需为kustomize添加允许第三方插件的构建选项。在kubernetes集群中找到名为argocd-cm的configmap，在`data`字段添加如下内容`kustomize.buildOptions: --enable-alpha-plugins --enable-exec`，即可为默认版本的kustomize添加第三方插件的构建选项。更多内容可参考[ArgoCD](https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/#kustomize-build-optionsparameters)。**你可以直接在argocd中使用这个[样例](https://github.com/openkruise/samples/tree/master/resourcedistribution-generator)**。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
  labels:
    app.kubernetes.io/name: argocd-cm
    app.kubernetes.io/part-of: argocd
data:
    kustomize.buildOptions: --enable-alpha-plugins --enable-exec
```

#### 使用插件

将resourcedistributiongenerator插件添加到argocd的git存储库中，并在注解`config.kubernetes.io/function`填入插件位置

```yaml
#rdGenerator.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistributionGenerator
metadata:
  ...
  annotations:
    config.kubernetes.io/function: |
      exec:
        path: ./resourcedistributiongenerator
```

通过kustomization.yaml的generator字段引用。

```yaml
#kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
generators:
- rdGenerator.yaml
```

上传git仓库后，通过`argocd app sync myapp`命令，或者点击UI中的SYNC按钮，部署项目即可。


![ContainerRecreateRequest](/img/docs/cli-tools/resourcedistributiongenerator.png)


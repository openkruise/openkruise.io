---
title: Kustomize ResourceDistribution Generator
---

[Kruise-tools](https://github.com/openkruise/kruise-tools) provides a series of generators and Transformers for Kruise features, which is a third party plug-in for Kustomize.

## ResourceDistribution Generator

> ResourceDistribution Generator Since v1.0.0 (alpha/beta) requires Kustomize version >= 4.3.0. Please refer to the  [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/) for installation.

When using Kustomize to manage applications, the generator provided with Kustomize can directly read files as data content to create Configmap or Secret, avoiding various format errors that are easy to occur during manual replication. The ResourceDistribution Generator is a third-party plug-in for Kustomize that can be used to create a ResourceDistribution by reading files as data content.

### Download ResourceDistribution generator

[This page](https://github.com/openkruise/kruise-tools/releases) provides the path to download binary files for common versions. Currently `Linux`, `Darwin` (OS X), `Windows` provide `X86_64` and `ARM64 `. If you use some other system or architecture, you must download the [source code](https://github.com/openkruise/kruise-tools/blob/master/cmd/resourcedistributiongenerator) and perform `Go Build` to build the binary

### API Description

ResourceDistributionGenerator is the Exec KRM functions plugin of kusomize. It is mainly composed of `resource` and `targets` fields. After the build, it will generate `resource` and `targets` content corresponding to ResourceDistribution. The `name` in `metadata` is used to set the name of the generated resourceDistribution. The annotation `config.kubernetes.io/function` needs to write the path of this plugin in the file system. If a relative path is used, it needs to be relative to A kustomization file that references the configuration file.

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

### Resource Field

The contents of the `resource` field are used to generate the distributed resources. The `literals`, `files`, and `envs` fields are used in the same way as in [Configmap or Secret](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/) Generator.

- `resourceKind`: Specify the resource kind to distribute, Secret or ConfigMap;
- `resourceName`: Set the name of the distribution resource, that is, the name of the Secret or ConfigMap;
- `literals`: create data content using key/value pairs in the given literals;
- `files`: create data content with the given file name and content;
- `envs`: create data content using key/value pairs in the file;

A correctly configured resource field is as follows:

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

ResourceDistribution Resources may be generated from files - such as a java `.properties`file. 

**Example:** Generate a ResourceDistribution with a data item containing the contents of a file.

The ResourceDistribution will have data values populated from the file contents. The contents of each file will appear as a single data item in the ResourceDistribution keyed by the filename.

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

ResourceDistribution Resources may be generated from literal key-value pairs - such as JAVA_HOME=/opt/java/jdk. 


> - The key/value are separated by a `=` sign (left side is the key)
> - The value of each literal will appear as a data item in the ResourceDistribution keyed by its key.

**Example:** Create a ResourceDistribution with 2 data items generated from literals.

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

ResourceDistribution Resources may be generated from key-value pairs much the same as using the literals option but taking the key-value pairs from an environment file. 

> - The key/value pairs inside of the environment file are separated by a `=` sign (left side is the key)
> - The value of each line will appear as a data item in the ResourceDistribution keyed by its key.

**Example:** Create a ResourceDistribution with 3 data items generated from an environment file.

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


### Targets Field

The usage of the `targets` field is basically the same as that of the `targets` field in ResourceDistribution. Note that the contents of the `includedNamespaces` and `excludedNamespaces` fields are directly the names of the namespaces.

A correctly configured targets field is as follows:

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

### Options and ResourceOptions Field

The `options` and `resourceOptions` fields are used to set annotations or labels for the generated ResourceDistribution and the Resource (ie ConfigMap or Secret) in it, respectively.

A correctly configured `options` and `resourceOptions` fields is as follows:

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

### A Complete Use Case

1. Create a demo directory as a workspace and enter. Place the downloaded ResourceDistributionGenerator plugin in the current directory and enter the following command to create a configuration file named rdGenerator.yaml.

```yaml
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

2. Create the application.properties file using the following command as file input.

```properties
cat > application.properties <<EOF
FOO=Bar
FIRST=1
SECOND=2
LAST=3
EOF
```

3. Create the kustomization file with the following command.

```yaml
cat > kustomization.yaml <<EOF
#kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
generators:
- rdGenerator.yaml
EOF
```

4. Use the `kustomize build --enable-alpha-plugins --enable-exec .` command to build application, the effect is as follows

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

### Use the ResourceDistribution Generator in ArgoCD

In argocd, the usage of the kustomize plugin is the same as above. In addition to that, add a build option to kustomize that allows third-party plugins. Find the configMap named argocd-cm in the kubernetes cluster and add the following to the `data` field `kustomize.buildOptions : --enable-alpha-plugins --enable-exec` to add build options for third-party plugins to the default version of kustomize. See [ArgoCD](https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/#kustomize-build-optionsparameters) for more information. **You can use this [sample](https://github.com/openkruise/samples/tree/master/resourcedistribution-generator) directly in argocd**.

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

#### The use of plug-in

Add the resourcedistributiongenerator plugin to argocd's git repository and fill in the plugin location in the annotation `config.kubernetes.io/function`

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

Referenced by the generator field of kustomization.yaml.

```yaml
#kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
generators:
- rdGenerator.yaml
```

After uploading the Git repository, deploy the project by using the `argocd app sync myapp` command or clicking the Sync button in the UI.


![ContainerRecreateRequest](/img/docs/cli-tools/resourcedistributiongenerator.png)
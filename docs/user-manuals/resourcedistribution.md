---
title: ResourceDistribution
---

For the scenario, where the namespace-scoped resources such as Secret and ConfigMap need to be distributed or synchronized to different namespaces, the native k8s currently only supports manual distribution and synchronization by users one-by-one, which is very inconvenient.

Typical examples:
- When users want to use the imagePullSecrets capability of SidecarSet, they must repeatedly create corresponding Secrets in relevant namespaces, and ensure the correctness and consistency of these Secret configurations;
- When users want to configure some **common** environment variables, they probably need to distribute ConfigMaps to multiple namespaces, and the subsequent modifications of these ConfigMaps might require synchronization among these namespaces.

Therefore, in the face of these scenarios that require the resource distribution and **continuously synchronization across namespaces**, we provide a tool, namely **ResourceDistribution**, to do this automatically.

Currently, ResourceDistribution supports the two kind resources --- **Secret & ConfigMap**.

## Feature-gate
**Since kruise v1.5.0** ResourceDistribution feature is turned off by default due to permissions, if you want to turn it on set feature-gate *ResourceDistributionGate*.

```bash
$ helm install/upgrade kruise https://... --set featureGates="ResourceDistributionGate=true"
```

## API Description

ResourceDistribution is a kind of **cluster-scoped CRD**, which is mainly composed of two fields: **`resource` and `targets`**.

The **`resource`** field is used to describe the resource to be distributed by the user, and **`targets`** is used to describe the destination namespaces.
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
  	... ...
  targets:
  	... ...
```

### Resource Field
The `resource` field must be a **complete** and **correct** resource description in YAML style.

An example of a correctly configuration of `resource` is as follows:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: game-demo
    data:
      game.properties: |
        enemy.types=aliens,monsters
        player.maximum-lives=5
      player_initial_lives: "3"
      ui_properties_file_name: user-interface.properties
      user-interface.properties: |
        color.good=purple
        color.bad=yellow
        allow.textmode=true
  targets:
    ... ...
```
**Tips**: users can first create corresponding resources in a local namespace and test them, and then copy them after confirming that the resource configuration is correct.

### Targets Field

The **`targets`** field currently supports four rules to describe the target namespaces, including `allNamespaces`, `includedNamespaces`, `excludedNamespaces` and `namespaceLabelSelector`:

- `allNamespaces`: match all of the namespaces if it is `true`;

- `includedNamespaces`: match the target namespaces by name;

- `namespaceLabelSelector`: use labelSelector to match the target namespaces;

- `excludedNamespaces`: use name to exclude some namespaces that you do not want to distribute;

**Calculation rule for target namespace:**

1. Initialize target namespace *T* = ∅;

2. Add all namespaces if `allNamespaces=true` to *T*;

2. Add the namespaces listed in `includedNamespaces` to *T*;

3. Add the namespace matching the `namespaceLabelSelector` to *T*;

4. Remove the namespaces listed in `excludedNamespaces` from *T*;

**`AllNamespaces`, `includedNamespaces` and `excludedNamespaces` are *"OR"* relationship, and `excludedNamespaces` will always effect if users set it. By the way, `targets` will always ignore the `kube-system` and `kube-public` namespaces.**

A correctly configured targets field is as follows:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
  	... ...
  targets:
    includedNamespaces:
      list:
      - name: ns-1
      - name: ns-4
    namespaceLabelSelector:
      matchLabels:
        group: test
    excludedNamespaces:
    	list:
      - name: ns-3
```
In the above example, the target namespaces of the ResourceDistribution will contain `ns-1` and `ns-4`, and the namespaces whose labels meet the `namespaceLabelSelector`. However, even if `ns-3` meets the namespaceLabelSelector, it will not be included because it has been explicitly excluded in `excludedNamespaces`.

## A Complete Use Case
### Distribute Resource
When the user correctly configures the `resource` and `targets` fields, the ResourceDistribution controller will execute the distribution, and this resource will be automatically created in each target namespaces.

A complete configuration is as follows:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ResourceDistribution
metadata:
  name: sample
spec:
  resource:
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: game-demo
    data:
      game.properties: |
        enemy.types=aliens,monsters
        player.maximum-lives=5
      player_initial_lives: "3"
      ui_properties_file_name: user-interface.properties
      user-interface.properties: |
        color.good=purple
        color.bad=yellow
        allow.textmode=true
  targets:
    excludedNamespaces:
      list:
      - name: ns-3
    includedNamespaces:
      list:
      - name: ns-1
      - name: ns-4
    namespaceLabelSelector:
      matchLabels:
        group: test
```

### Tracking Failures After The Distribution
Of course, resource distribution may not be always successful.

In the process of distribution, various errors may occur. To this end, we record some conditions of distribution failures in the `status` field so that users can track them.

**First**, the `status` records the total number of target namespaces (desired), the number of successfully distributed target namespaces (succeeded), and the number of failed target namespaces (failed):
```yaml
status:
  Desired:                 3
  Failed:                  1
  Succeeded:               2
```

**Then**, in order to further make users understand the reason and location (namespaces) of the failed distributions, `status` also summarizes the types of distribution errors, which are divided into 6 categories and recorded in `status.conditions`:

- Four types of conditions record the failures of operating resources, that are `Get`, `Create`, `Update` and `Delete` errors;
- A type of condition records the error that the namespace does not exist;
- A type of condition records resource conflicts: If a resource with the same name, kind and apiVersion already exists in the target namespace, this conflicts will be recorded in `status.conditions`.
```yaml
Status:
  Conditions:
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  GetResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  CreateResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  UpdateResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  DeleteResourceFailed
    Last Transition Time:  2021-09-06T08:42:28Z
    Reason:                Succeeded
    Status:                False
    Type:                  ConflictOccurred
    Failed Namespace:
      ns-1
      ns-4
    Last Transition Time:  2021-09-06T08:45:08Z
    Reason:                namespace not found
    Status:                True
    Type:                  NamespaceNotExists
```
The above example shows an error that the target namespaces `ns-1` and `ns-4` do not exist, and both the error type and namespaces are recorded.

### Update/Sync Resource
**ResourceDistribution allows users to update the resource field, and the update will automatically sync to all the target namespaces.**

When a resource is updated, ResourceDistribution will calculate the hash value of the new version of the resource and record it in the `annotations` of the resource CR. When ResourceDistribution finds that the hash value of the resource was changed, it will update it.
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
  annotations:
    kruise.io/resourcedistribution.resource.from: sample
    kruise.io/resourcedistribution.resource.distributed.timestamp: 2021-09-06 08:44:52.7861421 +0000 UTC m=+12896.810364601
    kruise.io/resourcedistribution.resource.hashcode: 0821a13321b2c76b5bd63341a0d97fb46bfdbb2f914e2ad6b613d10632fa4b63
... ...
```

In particular, we **DO NOT** recommend that users bypass the ResourceDistribution and directly modify the resources unless they know what they are doing:

- After modifying resources directly, the hash value of resources will not be calculated automatically. Therefore, **when the `resource` field is modified, ResourceDistribution may overwrite the user's direct modification of these resources;**

- ResourceDistribution judges whether resources are distributed by the itself through `kruise.io/resourcedistribution.resource.from`. If this annotation was changed, the modified resources will be regarded as conflicts, and will not updated it synchronously any more.

### Cascading Deletion
**ResourceDistribution controls the distributed resources through ownerReference. Therefore, it should be noted that when the ResourceDistribution is deleted, all the resources it distributed will also be deleted.**

## Kustomize ResourceDistribution Generator

ResourceDistribution Generator is a third-party plug-in of kustomize, similar to kustomize's configmap generator and secret generator. Using this plug-in, you can complete the work of reading files as data content to create ResourceDistribution. Refer to [this page](/docs/next/cli-tool/kustomize-plugin) for details.

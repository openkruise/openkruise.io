---
title: Deletion Protection
---

**FEATURE STATE:** Kruise v0.9.0

该功能提供了一个安全策略，用来在 Kubernetes 级联删除的机制下保护用户的资源和应用可用性。

## 使用方式

首先，需要在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用 `ResourcesDeletionProtection` feature-gate。

然后，用户可以给一些特定资源对象加上 `policy.kruise.io/delete-protection` 标签，值可以是：
- `Always`: 这个对象禁止被删除，除非上述 label 被去掉
- `Cascading`: 这个对象如果还有可用的下属资源，则禁止被删除

目前支持的资源类型、以及 cascading 级联关系如下：

| Kind                        | Group                  | Version            | **Cascading** judgement           |
| --------------------------- | ---------------------- | ------------------ | -----------------------------------
| `Namespace`                 | core                   | v1                 | namespace 下是否还有正常的 Pod       |
| `CustomResourceDefinition`  | apiextensions.k8s.io   | v1beta1, v1        | CRD 下是否还有存量的 CR              |
| `Deployment`                | apps                   | v1                 | replicas 是否为 0                   |
| `StatefulSet`               | apps                   | v1                 | replicas 是否为 0                   |
| `ReplicaSet`                | apps                   | v1                 | replicas 是否为 0                   |
| `CloneSet`                  | apps.kruise.io         | v1alpha1           | replicas 是否为 0                   |
| `StatefulSet`               | apps.kruise.io         | v1alpha1, v1beta1  | replicas 是否为 0                   |
| `UnitedDeployment`          | apps.kruise.io         | v1alpha1           | replicas 是否为 0                   |

## 风险

通过 [webhook configuration](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#webhook-configuration) 的 `objectSelector` 字段，
Kruise webhook 只会拦截处理带有 `policy.kruise.io/delete-protection` 标签的 `Namespace/CustomResourceDefinition/Deployment/StatefulSet/ReplicaSet` 资源。

因此，如果所有 kruise-manager pod 都挂了或者处于异常的状态，kube-apiserver 调用 deletion webhook 失败，
只有带有 `policy.kruise.io/delete-protection` 标签的上述资源才会暂时无法删除。

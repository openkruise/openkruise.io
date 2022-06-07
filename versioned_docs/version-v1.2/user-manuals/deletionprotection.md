---
title: Deletion Protection
---

**FEATURE STATE:** Kruise v0.9.0

This feature provides a safety policy which could help users protect Kubernetes resources and
applications' availability from the cascading deletion mechanism.

## Usage

Firstly, users have to enable the `ResourcesDeletionProtection` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate).

Then, users can add the label named `policy.kruise.io/delete-protection` to some specific resources. The values can be:
- `Always`: this object will always be forbidden to be deleted, unless the label is removed
- `Cascading`: this object will be forbidden to be deleted, if it has active resources owned

The resources supported and the cascading judgement relationship:

| Kind                        | Group                  | Version            | **Cascading** judgement                            |
| --------------------------- | ---------------------- | ------------------ | ----------------------------------------------------
| `Namespace`                 | core                   | v1                 | whether there is active Pods in this namespace     |
| `CustomResourceDefinition`  | apiextensions.k8s.io   | v1beta1, v1        | whether there is existing CRs of this CRD          |
| `Deployment`                | apps                   | v1                 | whether the replicas is 0                          |
| `StatefulSet`               | apps                   | v1                 | whether the replicas is 0                          |
| `ReplicaSet`                | apps                   | v1                 | whether the replicas is 0                          |
| `CloneSet`                  | apps.kruise.io         | v1alpha1           | whether the replicas is 0                          |
| `StatefulSet`               | apps.kruise.io         | v1alpha1, v1beta1  | whether the replicas is 0                          |
| `UnitedDeployment`          | apps.kruise.io         | v1alpha1           | whether the replicas is 0                          |

## Risk

Using `objectSelector` in [webhook configuration](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#webhook-configuration),
Kruise webhook will only handle those `Namespace/CustomResourceDefinition/Deployment/StatefulSet/ReplicaSet` resources with `policy.kruise.io/delete-protection` label.

So, if all kruise-manager Pods are crashed or in other abnormal states, kube-apiserver fails to call the deletion webhook,
only the resources with `policy.kruise.io/delete-protection` label can not be deleted temporarily.

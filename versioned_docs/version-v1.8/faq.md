---
title: FAQ
---

## Installation and Uninstallation

### Uninstall Protection

#### Q: Get error `job kruise-finalizer failed: BackoffLimitExceeded` when Helm uninstall Kruise 1.7.3 or above

> Uninstallation will lead to the deletion of all resources under Kruise, including webhook configurations, services,
> namespace, CRDs, CRs, and all Pods under Kruise workloads. Please proceed with caution!

A: Since 1.7.3, Kruise installed via Helm will automatically detect the existence of Kruise CRs during uninstallation
using a pre-delete hook. If any CRs exist, the uninstall process will be blocked. You need to manually clean up the
Kruise CRs before you can uninstall Kruise.

You can check which Kruise CRs are blocking the uninstallation in the cluster as follows:

```shell
kubectl get clone -A 
kubectl get asts -A 
kubectl get ads -A
```

If these Kruise workloads and their managed Pods still need to be retained, please carefully evaluate the uninstallation
operation for Kruise.

## Pod Creation/Update Errors

#### **Q**: The operation on the pod fails and the following error occurs. What is the reason?

```bash
Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"
```

**A**: Check whether the kruise-controller-manager pod under kruise-system is in a healthy state. When it is abnormal (
pending/not ready/no instance, etc.), the corresponding validate webhook will not be able to find the corresponding
endpoints, causing the verification to fail, and then the pod operation will fail.
The solution is to restore the kruise-controller-manager pod to a healthy state according to the prompts; or temporarily
delete the validatingwebhookconfiguration named `kruise-validating-webhook-configuration` in the cluster, and then
re-create it after the cluster is normal.

---
title: FAQ
---

**Q**: The operation on the pod fails and the following error occurs. What is the reason?
```bash
Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"
```

**A**: Check whether the kruise-controller-manager pod under kruise-system is in a healthy state. When it is abnormal (pending/not ready/no instance, etc.), the corresponding validate webhook will not be able to find the corresponding endpoints, causing the verification to fail, and then the pod operation will fail.
The solution is to restore the kruise-controller-manager pod to a healthy state according to the prompts; or temporarily delete the validatingwebhookconfiguration named `kruise-validating-webhook-configuration` in the cluster, and then re-create it after the cluster is normal.

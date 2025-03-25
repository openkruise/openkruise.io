---
title: FAQ
---

**Q**: 操作pod失败，出现以下报错什么原因？
```bash
Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"
```

**A**: 检查kruise-system下的 kruise-controller-manager pod是否是健康的状态。当其处于异常（pending/not ready/没有实例等）对应的validate webhook则会找不到对应的endpoints，导致校验失败，进而pod操作失败。
解决方案是根据提示恢复kruise-controller-manager pod为健康状态；或者暂时删除集群中名为 `kruise-validating-webhook-configuration` 的validatingwebhookconfiguration，等集群正常后再重新创建。

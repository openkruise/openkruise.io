---
title: FAQ
---

## 安装和卸载

### 卸载

#### Q: Helm 卸载 Kruise 1.7.3 以上版本时报错 `job kruise-finalizer failed: BackoffLimitExceeded`

A: 从 1.7.3 开始, 通过 Helm 安装的 Kruise 会在卸载时使用 pre-delete hook 自动检测是否存在 Kruise CR，如果存在则会阻塞
uninstall 过程。 你需要手动清理 Kruise CR 才可以通过以下操作卸载 Kruise。


## 创建/更新 pod 报错
#### Q: 操作pod失败，出现以下报错什么原因？
```bash
Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"
```

**A**: 检查kruise-system下的 kruise-controller-manager pod是否是健康的状态。当其处于异常（pending/not ready/没有实例等）对应的validate webhook则会找不到对应的endpoints，导致校验失败，进而pod操作失败。
解决方案是根据提示恢复kruise-controller-manager pod为健康状态；或者暂时删除集群中名为 `kruise-validating-webhook-configuration` 的validatingwebhookconfiguration，等集群正常后再重新创建。


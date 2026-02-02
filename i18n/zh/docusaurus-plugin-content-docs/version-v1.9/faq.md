# 常见问题解答

## 安装与卸载

### 卸载保护

#### Q：当使用 Helm 卸载 Kruise 1.7.3 或更高版本时出现错误 `job kruise-finalizer failed: BackoffLimitExceeded`

> 卸载将导致删除 Kruise 下的所有资源，包括 webhook 配置、服务、命名空间、CRD、CR 和 Kruise 工作负载下的所有 Pod。请谨慎操作！

A：自 1.7.3 版本起，通过 Helm 安装的 Kruise 在卸载过程中会使用预删除钩子自动检测是否存在 Kruise CRs。如果存在任何 CRs，卸载过程将被阻止。您需要手动清理 Kruise CRs 后才能卸载 Kruise。

您可以检查集群中哪些 Kruise CRs 阻止了卸载：

```shell
kubectl get clone -A 
kubectl get asts -A 
kubectl get ads -A
```


如果这些 Kruise 工作负载及其管理的 Pod 仍需保留，请仔细评估 Kruise 的卸载操作。

## Pod 创建/更新错误

#### **Q**：Pod 操作失败并出现以下错误，原因是什么？

```bash
Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"
```


**A**：检查 kruise-system 下的 [kruise-controller-manager](file:///Users/shouchen/git/openkruise.io/openkruise.io/docs/concepts/control-plane.md#L36-L36) pod 是否处于健康状态。当它异常时（pending/not ready/no instance 等），相应的验证 webhook 将无法找到相应的端点，导致验证失败，然后 pod 操作将失败。
解决方案是根据提示将 [kruise-controller-manager](file:///Users/shouchen/git/openkruise.io/openkruise.io/docs/concepts/control-plane.md#L36-L36) pod 恢复到健康状态；或者临时删除集群中名为 `kruise-validating-webhook-configuration` 的 validatingwebhookconfiguration，然后在集群恢复正常后重新创建它。

## 工作负载选择和迁移

#### **Q**：什么时候应该使用 CloneSet 而不是 Deployment？

**A**：在需要以下功能时使用 CloneSet：
- **原地更新**，实现更快的部署且干扰最小
- **高级扩缩策略**，如指定 Pod 删除
- **PVC 支持**，用于需要持久存储的无状态工作负载
- **更细粒度的更新控制**，具有分区和最大不可用配置
- **更好的回滚能力**，具备版本管理

CloneSet 适用于大规模无状态应用，其中更新速度和控制至关重要。

#### **Q**：如何从 Deployment 迁移到 CloneSet？

**A**：使用 [kruise-tools](https://github.com/openkruise/kruise-tools?tab=readme-ov-file#migrate) 命令进行迁移。

#### **Q**：Advanced StatefulSet 和原生 StatefulSet 有什么区别？

**A**：Advanced StatefulSet 提供额外功能：
- **容器和元数据的原地更新**
- **并行 Pod 管理**，实现更快的扩缩
- **带分区支持的选择性 Pod 更新**
- **自定义 Pod 删除**策略
- **增强的生命周期管理**，带有就绪网关

当您需要对有状态工作负载操作有更多控制时使用 Advanced StatefulSet。

## 性能和扩缩

#### **Q**：原地更新如何提高性能？

**A**：原地更新提供显著优势：
- **更快的部署**：仅重启容器，无需重新创建 Pod
- **资源效率**：无调度器开销或 IP 更改
- **减少中断**：保持 Pod 身份和网络连接
- **更低延迟**：无需 CNI/CSI 重新初始化

这在大规模部署中特别有益，因为 Pod 重建开销变得显著。

#### **Q**：原地更新有哪些限制？

**A**：原地更新有一些约束：
- **支持的字段有限**：目前支持容器镜像和来自元数据的环境变量
- **运行时兼容性**：需要兼容的容器运行时
- **回滚复杂性**：可能需要仔细规划回滚

注意：自 v1.8.0 起，当启用 `InPlaceWorkloadVerticalScaling` 功能门时，原地更新还支持修改容器资源（CPU/内存）。

#### **Q**：如何优化 OpenKruise 在大型集群中的性能？

**A**：遵循这些优化实践：
- **调整控制器并发性**：调整 `--concurrent-cloneset-syncs` 及类似标志
- **配置资源限制**：为 [kruise-manager](file:///Users/shouchen/git/openkruise.io/openkruise.io/docs/concepts/control-plane.md#L36-L36) 设置适当的 CPU/内存
- **使用功能门**：禁用未使用的功能以减少开销
- **监控指标**：关注控制器队列深度和协调时间
- **批量操作**：对大规模更改使用分区更新

```bash
# 示例性能调优
helm upgrade kruise openkruise/kruise \
  --set manager.resources.limits.cpu=500m \
  --set manager.resources.limits.memory=1Gi \
  --set featureGates="UnusedFeature=false"
```


## SidecarSet 和容器管理

#### **Q**：如何向现有 Pod 注入边车？

**A**：SidecarSet 自动向匹配的 Pod 注入边车：
1. **创建具有适当选择器的 SidecarSet**
2. **新的 Pod** 将在创建期间立即注入边车
3. **现有 Pod** 可以使用 SidecarSet 的原地更新功能进行更新
4. **使用热升级** 来实现需要零停机时间更新的有状态边车容器

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: logging-sidecar
spec:
  selector:
    matchLabels:
      app: my-app
  containers:
  - name: logging-agent
    image: fluent/fluent-bit:latest
    command: ["fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.conf"]
```


#### **Q**：我可以更新边车容器而不影响主容器吗？

**A**：是的，SidecarSet 支持 **热升级** 实现原地边车更新：
- **独立更新**：边车更新不会重启主容器
- **滚动更新**：通过分区支持进行受控部署
- **镜像更新**：无需重新创建 Pod 即可更改边车镜像
- **配置更新**：更新边车环境变量和卷

这对于日志代理、监控边车和服务网格代理特别有用。

#### **Q**：如何处理边车容器依赖？

**A**：使用 SidecarSet 的容器生命周期管理：
- **Init 容器**：使用 `initContainers` 进行设置依赖
- **容器排序**：使用 `podInjectPolicy`（BeforeAppContainer/AfterAppContainer）配置注入顺序
- **共享卷**：使用卷挂载进行容器间通信
- **环境共享**：使用 `transferEnv` 共享环境变量

## 安全和 RBAC

#### **Q**：OpenKruise 需要什么 RBAC 权限？

**A**：OpenKruise 需要以下权限：
- **核心资源**：Pods、Services、ConfigMaps、Secrets
- **工作负载资源**：Deployments、StatefulSets、DaemonSets
- **自定义资源**：所有 Kruise CRD
- **Webhook 管理**：ValidatingWebhookConfiguration、MutatingWebhookConfiguration
- **节点访问**：用于 kruise-daemon 操作

Helm 图表会自动创建适当的 RBAC 资源。对于自定义安装，请参考图表中的 RBAC 清单。

#### **Q**：如何在生产环境中保护 OpenKruise？

**A**：遵循这些安全最佳实践：
- **网络策略**：限制 kruise-system 命名空间流量
- **Pod 安全性**：使用 Pod Security Standards/Policies
- **RBAC**：应用最小权限原则
- **TLS 证书**：使用 cert-manager 获取 webhook 证书
- **镜像安全性**：扫描 OpenKruise 镜像漏洞
- **审计日志**：为 Kruise 操作启用 Kubernetes 审计日志

```yaml
# 示例网络策略
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: kruise-system-policy
  namespace: kruise-system
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
```


#### **Q**：可以在离线环境中运行 OpenKruise 吗？

**A**：是的，OpenKruise 支持离线部署：
1. **镜像镜像**：将 OpenKruise 镜像复制到私有仓库
2. **更新镜像引用**：修改 Helm 值以使用私有仓库
3. **打包图表**：下载 Helm 图表用于离线安装
4. **配置镜像拉取密钥**：为私有仓库设置认证

```bash
# 示例离线安装
helm install kruise ./kruise-chart \
  --set manager.image.repository=private-registry.com/kruise-manager \
  --set daemon.image.repository=private-registry.com/kruise-daemon \
  --set imagePullSecrets[0].name=private-registry-secret
```


## 监控和可观测性

#### **Q**：如何监控 OpenKruise 工作负载？

**A**：OpenKruise 提供全面的监控功能：
- **内置指标**：端口 8080 上的 Prometheus 指标
- **Kruise State Metrics**：工作负载状态的扩展指标
- **结构化日志**：JSON 格式日志以便更好解析
- **自定义仪表板**：Grafana 仪表板用于可视化

```bash
# 安装 kruise-state-metrics
helm install kruise-state-metrics openkruise/kruise-state-metrics

# 访问指标
kubectl port-forward -n kruise-system svc/kruise-controller-manager 8080:8080
curl localhost:8080/metrics
```


#### **Q**：应该监控 OpenKruise 的哪些指标？

**A**：需要监控的关键指标：
- **控制器性能**：`controller_runtime_reconcile_time_seconds`
- **工作队列深度**：`workqueue_depth`
- **Webhook 延迟**：`controller_runtime_webhook_latency_seconds`
- **错误率**：`controller_runtime_reconcile_errors_total`
- **资源状态**：来自 kruise-state-metrics 的自定义指标

有关详细监控指南，请参阅[故障排除文档](https://openkruise.io/docs/operator-manuals/troubleshooting)。

## 故障排除和调试

#### **Q**：如何调试 CloneSet 更新问题？

**A**：遵循此调试方法：
1. **检查 CloneSet 状态**：`kubectl describe cloneset <name>`
2. **检查 Pod 事件**：`kubectl describe pod <pod-name>`
3. **查看控制器日志**：`kubectl logs -n kruise-system deployment/kruise-controller-manager`
4. **验证更新策略**：检查分区和最大不可用设置
5. **检查资源限制**：确保集群资源充足

常见问题包括资源限制、镜像拉取失败和就绪探针超时。

#### **Q**：为什么我的 Pod 卡在 PreparingUpdate 状态？

**A**：Pod 处于 PreparingUpdate 状态通常表明：
- **镜像预下载**：ImagePullJob 正在下载新镜像（当启用 `PreDownloadImageForInPlaceUpdate` 功能门时）
- **就绪网关**：未满足自定义就绪条件
- **更新限制**：分区或 PodUnavailableBudget 阻止更新

检查工作负载状态和事件以确定具体原因。验证就绪条件是否正确配置以及更新限制是否允许 Pod 继续。

## 集成和生态系统

#### **Q**：OpenKruise 是否与 ArgoCD 等 GitOps 工具配合使用？

**A**：是的，OpenKruise 完全兼容 GitOps 工作流：
- **ArgoCD**：支持 Kruise CRD 并提供适当的健康检查
- **Flux**：使用标准 Kubernetes API 与 Kruise 资源配合
- **Tekton/Jenkins**：可以在 CI/CD 流水线中部署 Kruise 工作负载
- **Helm**：支持原生 Helm 图表模板

有关详细的 ArgoCD 集成，请参阅[ArgoCD 集成最佳实践](https://openkruise.io/docs/best-practices/gitops-with-kruise)。

#### **Q**：可以将 OpenKruise 与服务网格（Istio/Linkerd）一起使用吗？

**A**：OpenKruise 与服务网格无缝配合：
- **自动注入**：SidecarSet 可以注入网格边车
- **流量管理**：原地更新保持服务网格连接
- **可观测性**：网格指标与 Kruise 工作负载配合使用
- **安全策略**：mTLS 和安全策略正常应用

使用 SidecarSet 在工作负载之间进行一致的边车注入。

#### **Q**：如何将 OpenKruise 与 HPA/VPA 一起使用？

**A**：OpenKruise 工作负载支持标准 Kubernetes 自动扩缩：
- **HPA**：适用于 CloneSet、Advanced StatefulSet 和 Advanced DaemonSet
- **VPA**：支持垂直扩缩推荐
- **自定义指标**：使用自定义指标进行高级扩缩决策
- **扩缩策略**：配置扩缩行为以实现平稳操作

有关综合自动扩缩策略，请参阅[自动扩缩最佳实践](https://openkruise.io/docs/best-practices/elastic-deployment)。

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: cloneset-hpa
spec:
  scaleTargetRef:
    apiVersion: apps.kruise.io/v1alpha1
    kind: CloneSet
    name: my-cloneset
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 70
```


## 最佳实践和建议

#### **Q**：生产部署的最佳实践是什么？

**A**：遵循以下生产指导原则：
- **从小开始**：从非关键工作负载开始
- **彻底测试**：在预发布环境中验证
- **密切监控**：设置全面的监控和告警
- **规划回滚**：准备好回滚程序
- **使用功能门**：逐步启用功能
- **定期更新**：保持 OpenKruise 更新以获得安全性和功能
- **文档记录**：记录您的 Kruise 配置和程序

有关详细的生产部署指南，请参阅[高可用性操作手册](https://openkruise.io/docs/operator-manuals/availability)。

#### **Q**：如何为 OpenKruise 规划容量？

**A**：考虑这些容量因素：
- **控制器资源**：根据工作负载数量扩展 [kruise-manager](file:///Users/shouchen/git/openkruise.io/openkruise.io/docs/concepts/control-plane.md#L36-L36) 的规模
- **Webhook 延迟**：监控并调整 Webhook 超时设置
- **etcd 负载**：大规模部署会增加 etcd 压力
- **网络带宽**：原地更新减少网络使用
- **存储**：考虑 CloneSet 工作负载的 PVC 要求

从默认资源配置开始，然后根据监控数据进行扩展。
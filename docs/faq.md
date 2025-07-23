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

## Workload Selection and Migration

#### **Q**: When should I use CloneSet instead of Deployment?

**A**: Use CloneSet when you need:
- **In-place updates** for faster rollouts with minimal disruption
- **Advanced scaling strategies** like specified pod deletion
- **PVC support** for stateless workloads that need persistent storage
- **More granular update control** with partition and maxUnavailable
- **Better rollback capabilities** with revision management

CloneSet is ideal for large-scale stateless applications where update speed and control are critical.

#### **Q**: How do I migrate from Deployment to CloneSet?

**A**: Use the [kruise-tools](https://github.com/openkruise/kruise-tools?tab=readme-ov-file#migrate) command for migration.

#### **Q**: What's the difference between Advanced StatefulSet and native StatefulSet?

**A**: Advanced StatefulSet provides additional features:
- **In-place updates** for containers and metadata
- **Parallel pod management** for faster scaling
- **Selective pod updates** with partition support
- **Custom pod deletion** strategies
- **Enhanced lifecycle management** with readiness gates

Use Advanced StatefulSet when you need more control over stateful workload operations.

## Performance and Scaling

#### **Q**: How does in-place update improve performance?

**A**: In-place updates provide significant benefits:
- **Faster rollouts**: Only container restart, no pod recreation
- **Resource efficiency**: No scheduler overhead or IP changes
- **Reduced disruption**: Maintains pod identity and network connections
- **Lower latency**: No CNI/CSI re-initialization

This is especially beneficial for large-scale deployments where pod recreation overhead becomes significant.

#### **Q**: What are the limitations of in-place updates?

**A**: In-place updates have some constraints:
- **Limited field support**: Currently supports container image and environment variables from metadata
- **Runtime compatibility**: Requires compatible container runtime
- **Rollback complexity**: May need careful planning for rollbacks

Note: Since v1.8.0, in-place updates also support modifying container resources (CPU/Memory) when the `InPlaceWorkloadVerticalScaling` feature gate is enabled.

#### **Q**: How do I optimize OpenKruise performance in large clusters?

**A**: Follow these optimization practices:
- **Tune controller concurrency**: Adjust `--concurrent-cloneset-syncs` and similar flags
- **Configure resource limits**: Set appropriate CPU/memory for kruise-manager
- **Use feature gates**: Disable unused features to reduce overhead
- **Monitor metrics**: Watch controller queue depth and reconciliation time
- **Batch operations**: Use partition updates for large-scale changes

```bash
# Example performance tuning
helm upgrade kruise openkruise/kruise \
  --set manager.resources.limits.cpu=500m \
  --set manager.resources.limits.memory=1Gi \
  --set featureGates="UnusedFeature=false"
```

## SidecarSet and Container Management

#### **Q**: How do I inject sidecars into existing pods?

**A**: SidecarSet automatically injects sidecars into matching pods:
1. **Create a SidecarSet** with appropriate selectors
2. **New pods** will get sidecars injected immediately during creation
3. **Existing pods** can be updated using SidecarSet's in-place update capabilities
4. **Use hot upgrade** for stateful sidecar containers that require zero-downtime updates

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

#### **Q**: Can I update sidecar containers without affecting main containers?

**A**: Yes, SidecarSet supports **hot upgrade** for in-place sidecar updates:
- **Independent updates**: Sidecar updates don't restart main containers
- **Rolling updates**: Controlled rollout with partition support
- **Image updates**: Change sidecar images without pod recreation
- **Configuration updates**: Update sidecar env vars and volumes

This is particularly useful for logging agents, monitoring sidecars, and service mesh proxies.

#### **Q**: How do I handle sidecar container dependencies?

**A**: Use SidecarSet's container lifecycle management:
- **Init containers**: Use `initContainers` for setup dependencies
- **Container ordering**: Configure injection order with `podInjectPolicy` (BeforeAppContainer/AfterAppContainer)
- **Shared volumes**: Use volume mounts for inter-container communication
- **Environment sharing**: Use `transferEnv` to share environment variables

## Security and RBAC

#### **Q**: What RBAC permissions does OpenKruise need?

**A**: OpenKruise requires permissions for:
- **Core resources**: Pods, Services, ConfigMaps, Secrets
- **Workload resources**: Deployments, StatefulSets, DaemonSets
- **Custom resources**: All Kruise CRDs
- **Webhook management**: ValidatingWebhookConfiguration, MutatingWebhookConfiguration
- **Node access**: For kruise-daemon operations

The Helm chart automatically creates appropriate RBAC resources. For custom installations, refer to the RBAC manifests in the charts.

#### **Q**: How do I secure OpenKruise in production?

**A**: Follow these security best practices:
- **Network policies**: Restrict kruise-system namespace traffic
- **Pod security**: Use Pod Security Standards/Policies
- **RBAC**: Apply principle of least privilege
- **TLS certificates**: Use cert-manager for webhook certificates
- **Image security**: Scan OpenKruise images for vulnerabilities
- **Audit logging**: Enable Kubernetes audit logs for Kruise operations

```yaml
# Example network policy
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

#### **Q**: Can I run OpenKruise in air-gapped environments?

**A**: Yes, OpenKruise supports air-gapped deployments:
1. **Mirror images**: Copy OpenKruise images to private registry
2. **Update image references**: Modify Helm values to use private registry
3. **Bundle charts**: Download Helm charts for offline installation
4. **Configure image pull secrets**: Set up authentication for private registry

```bash
# Example air-gapped installation
helm install kruise ./kruise-chart \
  --set manager.image.repository=private-registry.com/kruise-manager \
  --set daemon.image.repository=private-registry.com/kruise-daemon \
  --set imagePullSecrets[0].name=private-registry-secret
```

## Monitoring and Observability

#### **Q**: How do I monitor OpenKruise workloads?

**A**: OpenKruise provides comprehensive monitoring capabilities:
- **Built-in metrics**: Prometheus metrics on port 8080
- **Kruise State Metrics**: Extended metrics for workload states
- **Structured logging**: JSON format logs for better parsing
- **Custom dashboards**: Grafana dashboards for visualization

```bash
# Install kruise-state-metrics
helm install kruise-state-metrics openkruise/kruise-state-metrics

# Access metrics
kubectl port-forward -n kruise-system svc/kruise-controller-manager 8080:8080
curl localhost:8080/metrics
```

#### **Q**: What metrics should I monitor for OpenKruise?

**A**: Key metrics to monitor:
- **Controller performance**: `controller_runtime_reconcile_time_seconds`
- **Workqueue depth**: `workqueue_depth`
- **Webhook latency**: `controller_runtime_webhook_latency_seconds`
- **Error rates**: `controller_runtime_reconcile_errors_total`
- **Resource states**: Custom metrics from kruise-state-metrics

For detailed monitoring guidance, see the [troubleshooting documentation](https://openkruise.io/docs/operator-manuals/troubleshooting).

## Troubleshooting and Debugging

#### **Q**: How do I debug CloneSet update issues?

**A**: Follow this debugging approach:
1. **Check CloneSet status**: `kubectl describe cloneset <name>`
2. **Examine pod events**: `kubectl describe pod <pod-name>`
3. **Review controller logs**: `kubectl logs -n kruise-system deployment/kruise-controller-manager`
4. **Verify update strategy**: Check partition and maxUnavailable settings
5. **Check resource constraints**: Ensure sufficient cluster resources

Common issues include resource limits, image pull failures, and readiness probe timeouts.

#### **Q**: Why are my pods stuck in PreparingUpdate state?

**A**: Pods in PreparingUpdate state typically indicate:
- **Image pre-download**: ImagePullJob is downloading new images (when `PreDownloadImageForInPlaceUpdate` feature gate is enabled)
- **Readiness gates**: Custom readiness conditions not met
- **Update constraints**: Partition or PodUnavailableBudget blocking updates

Check the workload status and events to identify the specific cause. Verify that readiness conditions are properly configured and update constraints allow the pod to proceed.

## Integration and Ecosystem

#### **Q**: Does OpenKruise work with GitOps tools like ArgoCD?

**A**: Yes, OpenKruise is fully compatible with GitOps workflows:
- **ArgoCD**: Supports Kruise CRDs with proper health checks
- **Flux**: Works with Kruise resources using standard Kubernetes APIs
- **Tekton/Jenkins**: Can deploy Kruise workloads in CI/CD pipelines
- **Helm**: Native Helm chart support for templating

For detailed ArgoCD integration, see the [ArgoCD integration best practices](https://openkruise.io/docs/best-practices/gitops-with-kruise).

#### **Q**: Can I use OpenKruise with service mesh (Istio/Linkerd)?

**A**: OpenKruise works seamlessly with service mesh:
- **Automatic injection**: SidecarSet can inject mesh sidecars
- **Traffic management**: In-place updates maintain service mesh connectivity
- **Observability**: Mesh metrics work with Kruise workloads
- **Security policies**: mTLS and security policies apply normally

Use SidecarSet for consistent sidecar injection across workloads.

#### **Q**: How do I use OpenKruise with HPA/VPA?

**A**: OpenKruise workloads support standard Kubernetes autoscaling:
- **HPA**: Works with CloneSet, Advanced StatefulSet, and Advanced DaemonSet
- **VPA**: Supports vertical scaling recommendations
- **Custom metrics**: Use custom metrics for advanced scaling decisions
- **Scaling policies**: Configure scaling behavior for smooth operations

For comprehensive autoscaling strategies, see the [autoscaling best practices](https://openkruise.io/docs/best-practices/elastic-deployment).

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

## Best Practices and Recommendations

#### **Q**: What are the best practices for production deployments?

**A**: Follow these production guidelines:
- **Start small**: Begin with non-critical workloads
- **Test thoroughly**: Validate in staging environments
- **Monitor closely**: Set up comprehensive monitoring and alerting
- **Plan rollbacks**: Have rollback procedures ready
- **Use feature gates**: Enable features gradually
- **Regular updates**: Keep OpenKruise updated for security and features
- **Documentation**: Document your Kruise configurations and procedures

For detailed production deployment guidance, see the [high availability operations manual](https://openkruise.io/docs/operator-manuals/availability).

#### **Q**: How do I plan capacity for OpenKruise?

**A**: Consider these capacity factors:
- **Controller resources**: Scale kruise-manager based on workload count
- **Webhook latency**: Monitor and tune webhook timeout settings
- **etcd load**: Large-scale deployments increase etcd pressure
- **Network bandwidth**: In-place updates reduce network usage
- **Storage**: Consider PVC requirements for CloneSet workloads

Start with default resources and scale based on monitoring data.

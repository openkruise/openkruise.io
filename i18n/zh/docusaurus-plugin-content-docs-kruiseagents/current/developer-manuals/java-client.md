---
title: Java 客户端
---

## 概述

我们提供了 [k8s/java](https://github.com/openkruise/agents-api/tree/master/k8s/java) 仓库，其中包含 Agents 资源的
CRD Java 模型定义，基于 Fabric8 Kubernetes Client 生成。

## 依赖导入

**Maven 仓库**：该包未发布到官方 Maven 仓库，你需要手动下载项目并打包成 JAR 文件使用。

## 可用的 CRD 模型

所有模型位于包 `io.openkruise.agents.client.v2.models`：

| CRD                 | Java 类                | 说明              |
|---------------------|-----------------------|-----------------|
| Sandbox             | `Sandbox`             | 单个 sandbox 实例   |
| SandboxSet          | `SandboxSet`          | 可扩缩的 sandbox 集合 |
| SandboxClaim        | `SandboxClaim`        | sandbox 资源申领    |
| SandboxTemplate     | `SandboxTemplate`     | 可复用的 sandbox 模板 |
| SandboxUpdateOps    | `SandboxUpdateOps`    | sandbox 更新操作    |
| Checkpoint          | `Checkpoint`          | sandbox 检查点/快照  |
| TrafficPolicy       | `TrafficPolicy`       | 流量路由策略          |
| GlobalTrafficPolicy | `GlobalTrafficPolicy` | 集群级流量策略         |
| SecurityProfile     | `SecurityProfile`     | 安全配置定义          |

---

## 使用示例

### 创建 Sandbox

```java
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import io.fabric8.kubernetes.api.model.*;
import io.openkruise.agents.client.v2.models.Sandbox;
import io.openkruise.agents.client.v2.models.SandboxSpec;

public class SandboxExample {

    public static void main(String[] args) {
        try (KubernetesClient client = new KubernetesClientBuilder().build()) {
            String namespace = "default";

            // 构建 Sandbox
            Sandbox sandbox = new Sandbox();
            sandbox.setMetadata(new ObjectMetaBuilder()
                .withName("my-sandbox")
                .withNamespace(namespace)
                .addToLabels("app", "sandbox-example")
                .build());

            // 构建 Spec
            SandboxSpec spec = new SandboxSpec();

            // 方式一：使用内联模板
            PodTemplateSpec template = new PodTemplateSpecBuilder()
                .withNewMetadata()
                    .addToLabels("app", "sandbox-container")
                .endMetadata()
                .withNewSpec()
                    .withRestartPolicy("Never")
                    .addNewContainer()
                        .withName("sandbox")
                        .withImage("nginx:latest")
                        .addNewPort()
                            .withName("http")
                            .withContainerPort(80)
                        .endPort()
                    .endContainer()
                .endSpec()
                .build();
            spec.setTemplate(template);

            // 方式二：使用 templateRef（与 template 互斥）
            // TemplateRef ref = new TemplateRef();
            // ref.setName("my-template");
            // spec.setTemplateRef(ref);

            sandbox.setSpec(spec);

            // 创建 Sandbox
            Sandbox created = client.resources(Sandbox.class)
                .inNamespace(namespace)
                .resource(sandbox)
                .create();

            System.out.println("Created sandbox: " + created.getMetadata().getName());
        }
    }
}
```

### 通过 SandboxClaim 批量创建

SandboxClaim 允许你从模板批量申领多个 sandbox。

```java
import io.openkruise.agents.client.v2.models.SandboxClaim;
import io.openkruise.agents.client.v2.models.SandboxClaimSpec;
import io.fabric8.kubernetes.api.model.KubernetesResourceList;

try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    String namespace = "default";
    String claimName = "demo-claim";
    
    // 构建 SandboxClaim
    SandboxClaim claim = new SandboxClaim();
    claim.setMetadata(new ObjectMetaBuilder()
        .withName(claimName)
        .withNamespace(namespace)
        .build());
    
    SandboxClaimSpec spec = new SandboxClaimSpec();
    spec.setReplicas(2);
    spec.setTemplateName("demo-template");
    claim.setSpec(spec);
    
    // 创建 SandboxClaim
    SandboxClaim created = client.resources(SandboxClaim.class)
        .inNamespace(namespace)
        .resource(claim)
        .create();
    
    System.out.println("Created sandboxclaim: " + created.getMetadata().getName());
    
    // 等待申领完成（轮询）
    long startTime = System.currentTimeMillis();
    long timeout = 60000; // 1 分钟
    boolean completed = false;
    
    while (System.currentTimeMillis() - startTime < timeout) {
        SandboxClaim updated = client.resources(SandboxClaim.class)
            .inNamespace(namespace)
            .withName(claimName)
            .get();
        
        if (updated != null && updated.getStatus() != null) {
            String phase = updated.getStatus().getPhase();
            if ("Completed".equals(phase)) {
                Integer claimedReplicas = updated.getStatus().getClaimedReplicas();
                if (claimedReplicas != null && claimedReplicas.equals(spec.getReplicas())) {
                    completed = true;
                    System.out.println("Claim completed successfully with " + claimedReplicas + " sandboxes");
                    break;
                } else if (claimedReplicas != null && claimedReplicas > 0) {
                    System.out.println("Claim partially completed: " + claimedReplicas + "/" + spec.getReplicas());
                    break;
                } else {
                    System.err.println("Claim failed: no sandboxes claimed");
                    break;
                }
            }
        }
        
        Thread.sleep(1000); // 等待 1 秒后再次检查
    }
    
    if (!completed) {
        System.err.println("Claim did not complete within timeout");
    }
    
    // 列出已申领的 sandbox
    System.out.println("Listing claimed sandboxes:");
    KubernetesResourceList<Sandbox> sandboxList = client.resources(Sandbox.class)
        .inNamespace(namespace)
        .withLabel("agents.kruise.io/claim-name", claimName)
        .list();
    
    for (Sandbox sb : sandboxList.getItems()) {
        System.out.printf("  %s/%s%n", sb.getMetadata().getNamespace(), sb.getMetadata().getName());
    }
}
```

### 列出 Sandbox

```java
import io.fabric8.kubernetes.api.model.KubernetesResourceList;

try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    KubernetesResourceList<Sandbox> sandboxList = client.resources(Sandbox.class)
        .inNamespace("default")
        .list();

    for (Sandbox sb : sandboxList.getItems()) {
        System.out.printf("Sandbox: %s, State: %s%n",
            sb.getMetadata().getName(),
            sb.getStatus() != null ? sb.getStatus().getPhase() : "Unknown");
    }
}
```

### 删除 Sandbox

```java
try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    client.resources(Sandbox.class)
        .inNamespace("default")
        .withName("my-sandbox")
        .delete();

    System.out.println("Sandbox deleted");
}
```

### 监听 Sandbox 变更

```java
try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    client.resources(Sandbox.class)
        .inNamespace("default")
        .watch(new Watcher<Sandbox>() {
            @Override
            public void eventReceived(Action action, Sandbox sandbox) {
                System.out.printf("Event: %s, Sandbox: %s%n",
                    action, sandbox.getMetadata().getName());
            }

            @Override
            public void onClose(WatcherException cause) {
                if (cause != null) {
                    System.err.println("Watch closed: " + cause.getMessage());
                }
            }
        });
}
```

---

## 旧版模型（已废弃）

`io.openkruise.agents.client.models` 中的旧版模型**已废弃**，不再维护。请迁移到
`io.openkruise.agents.client.v2.models`，它使用 Fabric8 Kubernetes Client 注解，提供更好的类型安全性。
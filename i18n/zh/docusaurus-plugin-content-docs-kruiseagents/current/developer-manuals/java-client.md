---
title: Java 客户端
---

## 概述

我们提供了 [client-java](https://github.com/openkruise/agents-api/tree/master/clients/java) 仓库，其中包含 Agents 资源的
Schema 定义。

## 前置条件

使用 Java Client 前，请注意以下事项：

1. **Maven 仓库**：该包未发布到官方 Maven 仓库，你需要手动下载项目并打包成 JAR 文件使用。
2. **依赖要求**：你还需要添加 Kubernetes 官方 Java SDK 的依赖，需要使用 `io.kubernetes:client-java` 包中的 `ApiClient`
   和 `CustomObjectsApi`。

```xml
<dependency>
   <groupId>io.kubernetes</groupId>
   <artifactId>client-java</artifactId>
   <version>19.0.0</version>
</dependency>
```

## 使用示例

以下提供了两个 Demo 进行参考，分别演示了 SandboxSet 和 SandboxClaim 的基本操作。

```
以下代码仅作为简单使用的 Demo 示例。在生产环境中，你需要自行封装高可用的 Client（如连接池管理、超时重试机制等）以及完善的异常处理逻辑。
```

```java
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.util.Config;
import io.openkruise.agents.client.models.V1alpha1SandboxSet;
import io.openkruise.agents.client.models.V1alpha1SandboxSetSpec;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class SandboxSetExample {
    private final CustomObjectsApi api;

    private static final String GROUP = "agents.kruise.io";
    private static final String VERSION = "v1alpha1";
    private static final String PLURAL = "sandboxsets";

    public SandboxSetExample() throws Exception {
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        this.api = new CustomObjectsApi();
    }

    /**
     * Create SandboxSet
     */
    public String createSandboxSet(String namespace, String name, int replicas, String image) {
        try {
            V1alpha1SandboxSet sandboxSet = createSandboxSetObject(namespace, name, replicas, image);
            api.createNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL, sandboxSet, null, null, null
            );
            System.out.println("SandboxSet created: " + name);
            return name;
        } catch (ApiException e) {
            System.err.println("Failed to create sandboxset: " + e.getMessage());
            return null;
        }
    }

    /**
     * Get SandboxSet
     */
    public Object getSandboxSet(String namespace, String name) {
        try {
            Object result = api.getNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL, name
            );
            System.out.println("SandboxSet retrieved: " + name);
            return result;
        } catch (ApiException e) {
            e.printStackTrace();
            System.err.println("Failed to get sandboxset: " + e.getMessage());
            return null;
        }
    }

    /**
     * Delete SandboxSet
     */
    public void deleteSandboxSet(String namespace, String name) {
        try {
            api.deleteNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL, name, null, null, null, null, null
            );
            System.out.println("SandboxSet deleted: " + name);
        } catch (ApiException e) {
            System.err.println("Failed to delete sandboxset: " + e.getMessage());
        }
    }

    /**
     * Build SandboxSet Object
     */
    private V1alpha1SandboxSet createSandboxSetObject(String namespace, String name, int replicas, String image) {
        V1alpha1SandboxSet sandboxSet = new V1alpha1SandboxSet();
        sandboxSet.setApiVersion(GROUP + "/" + VERSION);
        sandboxSet.setKind("SandboxSet");

        // build Metadata
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(name);
        metadata.setNamespace(namespace);
        Map<String, String> labels = new HashMap<>();
        labels.put("sandboxset", "true");
        metadata.setLabels(labels);
        sandboxSet.setMetadata(metadata);

        // build Spec
        V1alpha1SandboxSetSpec spec = new V1alpha1SandboxSetSpec();
        spec.setReplicas(replicas);

        // build PodTemplateSpec
        V1PodTemplateSpec templateSpec = new V1PodTemplateSpec();
        V1ObjectMeta templateMetadata = new V1ObjectMeta();
        templateMetadata.setLabels(Collections.singletonMap("sandboxset", "true"));
        templateSpec.setMetadata(templateMetadata);

        // build PodSpec
        V1PodSpec podSpec = new V1PodSpec();

        // build Container
        V1Container container = new V1Container();
        container.setName("test-container");
        container.setImage(image);

        podSpec.setContainers(Collections.singletonList(container));
        templateSpec.setSpec(podSpec);

        spec.setTemplate(templateSpec);
        sandboxSet.setSpec(spec);

        return sandboxSet;
    }
    
    public static void main(String[] args) throws Exception {
        SandboxSetExample client = new SandboxSetExample();
        String namespace = "default";
        String name = "test-sandboxset-" + System.currentTimeMillis();
        int replicas = 1;
        String image = "nginx:stable-alpine3.23";

        // create
        client.createSandboxSet(namespace, name, replicas, image);

        // get
        client.getSandboxSet(namespace, name);

        // delete
        client.deleteSandboxSet(namespace, name);
    }
}
```

```java
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.util.Config;
import io.openkruise.agents.client.models.V1alpha1SandboxClaim;
import io.openkruise.agents.client.models.V1alpha1SandboxClaimSpec;
import io.openkruise.agents.client.models.V1alpha1SandboxSet;
import io.openkruise.agents.client.models.V1alpha1SandboxSetSpec;

import java.util.Collections;

public class SandboxClaimExample {
    private final CustomObjectsApi api;

    private static final String GROUP = "agents.kruise.io";
    private static final String VERSION = "v1alpha1";
    private static final String PLURAL_SANDBOXSETS = "sandboxsets";
    private static final String PLURAL_SANDBOXCLAIMS = "sandboxclaims";

    public SandboxClaimExample() throws Exception {
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        this.api = new CustomObjectsApi();
    }

    /**
     * Create SandboxSet (pool for claim)
     */
    public String createSandboxSet(String namespace, String name, int replicas, String image) {
        try {
            V1alpha1SandboxSet sandboxSet = createSandboxSetObject(namespace, name, replicas, image);
            api.createNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL_SANDBOXSETS, sandboxSet, null, null, null
            );
            System.out.println("SandboxSet created: " + name);
            return name;
        } catch (ApiException e) {
            System.err.println("Failed to create sandboxset: " + e.getMessage());
            System.err.println("Response body: " + e.getResponseBody());
            return null;
        }
    }

    /**
     * Create SandboxClaim
     */
    public String createSandboxClaim(String namespace, String name, String templateName, int replicas) {
        try {
            V1alpha1SandboxClaim sandboxClaim = createSandboxClaimObject(namespace, name, templateName, replicas);
            api.createNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL_SANDBOXCLAIMS, sandboxClaim, null, null, null
            );
            System.out.println("SandboxClaim created: " + name);
            return name;
        } catch (ApiException e) {
            System.err.println("Failed to create sandboxclaim: " + e.getMessage());
            System.err.println("Response body: " + e.getResponseBody());
            return null;
        }
    }

    /**
     * Get SandboxClaim
     */
    public Object getSandboxClaim(String namespace, String name) {
        try {
            Object result = api.getNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL_SANDBOXCLAIMS, name
            );
            System.out.println("SandboxClaim retrieved: " + name);
            return result;
        } catch (ApiException e) {
            System.err.println("Failed to get sandboxclaim: " + e.getMessage());
            return null;
        }
    }

    /**
     * Delete SandboxClaim
     */
    public void deleteSandboxClaim(String namespace, String name) {
        try {
            api.deleteNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL_SANDBOXCLAIMS, name, null, null, null, null, null
            );
            System.out.println("SandboxClaim deleted: " + name);
        } catch (ApiException e) {
            System.err.println("Failed to delete sandboxclaim: " + e.getMessage());
        }
    }

    /**
     * Delete SandboxSet
     */
    public void deleteSandboxSet(String namespace, String name) {
        try {
            api.deleteNamespacedCustomObject(
                GROUP, VERSION, namespace, PLURAL_SANDBOXSETS, name, null, null, null, null, null
            );
            System.out.println("SandboxSet deleted: " + name);
        } catch (ApiException e) {
            System.err.println("Failed to delete sandboxset: " + e.getMessage());
        }
    }

    /**
     * Build SandboxSet object
     */
    private V1alpha1SandboxSet createSandboxSetObject(String namespace, String name, int replicas, String image) {
        V1alpha1SandboxSet sandboxSet = new V1alpha1SandboxSet();
        sandboxSet.setApiVersion(GROUP + "/" + VERSION);
        sandboxSet.setKind("SandboxSet");

        // build Metadata
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(name);
        metadata.setNamespace(namespace);
        sandboxSet.setMetadata(metadata);

        // build Spec
        V1alpha1SandboxSetSpec spec = new V1alpha1SandboxSetSpec();
        spec.setReplicas(replicas);

        // build PodTemplateSpec
        V1PodTemplateSpec templateSpec = new V1PodTemplateSpec();
        V1ObjectMeta templateMetadata = new V1ObjectMeta();
        templateSpec.setMetadata(templateMetadata);

        // build PodSpec
        V1PodSpec podSpec = new V1PodSpec();

        // build Container
        V1Container container = new V1Container();
        container.setName("test-container");
        container.setImage(image);

        podSpec.setContainers(Collections.singletonList(container));
        templateSpec.setSpec(podSpec);

        spec.setTemplate(templateSpec);
        sandboxSet.setSpec(spec);

        return sandboxSet;
    }

    /**
     * Build SandboxClaim object
     */
    private V1alpha1SandboxClaim createSandboxClaimObject(String namespace, String name, String templateName,
        int replicas) {
        V1alpha1SandboxClaim sandboxClaim = new V1alpha1SandboxClaim();
        sandboxClaim.setApiVersion(GROUP + "/" + VERSION);
        sandboxClaim.setKind("SandboxClaim");

        // build Metadata
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(name);
        metadata.setNamespace(namespace);
        sandboxClaim.setMetadata(metadata);

        // build Spec
        V1alpha1SandboxClaimSpec spec = new V1alpha1SandboxClaimSpec();
        spec.setTemplateName(templateName);
        spec.setReplicas(replicas);

        sandboxClaim.setSpec(spec);

        return sandboxClaim;
    }

    public static void main(String[] args) throws Exception {
        SandboxClaimExample client = new SandboxClaimExample();
        String namespace = "default";

        // Generate unique names
        String sandboxSetName = "test-pool-" + System.currentTimeMillis();
        String sandboxClaimName = "test-claim-" + System.currentTimeMillis();

        int poolReplicas = 5;
        int claimReplicas = 1;
        String image = "nginx:stable-alpine3.23";

        try {
            // Step 1: Create SandboxSet (pool)
            System.out.println("=== Step 1: Creating SandboxSet (pool) ===");
            String createdPool = client.createSandboxSet(namespace, sandboxSetName, poolReplicas, image);
            if (createdPool == null) {
                System.err.println("Failed to create pool, exiting");
                return;
            }

            // Wait for SandboxSet to be ready (in real scenario, should check AvailableReplicas)
            System.out.println("Waiting for SandboxSet to be ready...");
            Thread.sleep(10000);

            // Step 2: Create SandboxClaim
            System.out.println("\n=== Step 2: Creating SandboxClaim ===");
            String createdClaim = client.createSandboxClaim(namespace, sandboxClaimName, sandboxSetName, claimReplicas);
            if (createdClaim == null) {
                System.err.println("Failed to create claim, cleaning up pool");
                client.deleteSandboxSet(namespace, sandboxSetName);
                return;
            }

            // Wait for claim to be processed
            System.out.println("Waiting for claim to be processed...");
            Thread.sleep(5000);

            // Step 3: Get SandboxClaim
            System.out.println("\n=== Step 3: Getting SandboxClaim ===");
            client.getSandboxClaim(namespace, sandboxClaimName);

            // Step 4: Delete SandboxClaim
            System.out.println("\n=== Step 4: Deleting SandboxClaim ===");
            client.deleteSandboxClaim(namespace, sandboxClaimName);

            // Step 5: Cleanup SandboxSet
            System.out.println("\n=== Step 5: Cleaning up SandboxSet ===");
            client.deleteSandboxSet(namespace, sandboxSetName);

            System.out.println("\n=== Example completed successfully ===");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Interrupted: " + e.getMessage());
        }
    }
}
```
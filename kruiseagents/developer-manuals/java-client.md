---
title: Java Client
---

## Overview

We provide a [k8s/java](https://github.com/openkruise/agents-api/tree/master/k8s/java) repository that contains
CRD Java model definitions for Agents resources, generated based on Fabric8 Kubernetes Client.

## Installation

**Maven Repository**: This package is not published to the official Maven repository. You need to manually download
the project and package it as a JAR file.

## Available CRD Models

All models are in package `io.openkruise.agents.client.v2.models`:

| CRD                 | Java Class            | Description                   |
|---------------------|-----------------------|-------------------------------|
| Sandbox             | `Sandbox`             | Individual sandbox instance   |
| SandboxSet          | `SandboxSet`          | Set of sandboxes with scaling |
| SandboxClaim        | `SandboxClaim`        | Claim for sandbox resources   |
| SandboxTemplate     | `SandboxTemplate`     | Reusable sandbox template     |
| SandboxUpdateOps    | `SandboxUpdateOps`    | Sandbox update operations     |
| Checkpoint          | `Checkpoint`          | Sandbox checkpoint/snapshot   |
| TrafficPolicy       | `TrafficPolicy`       | Traffic routing policy        |
| GlobalTrafficPolicy | `GlobalTrafficPolicy` | Cluster-wide traffic policy   |
| SecurityProfile     | `SecurityProfile`     | Security profile definition   |

---

## Usage Examples

### Create a Sandbox

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

            // Build Sandbox
            Sandbox sandbox = new Sandbox();
            sandbox.setMetadata(new ObjectMetaBuilder()
                .withName("my-sandbox")
                .withNamespace(namespace)
                .addToLabels("app", "sandbox-example")
                .build());

            // Build Spec
            SandboxSpec spec = new SandboxSpec();

            // Option 1: Use inline template
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

            // Option 2: Use templateRef (mutually exclusive with template)
            // TemplateRef ref = new TemplateRef();
            // ref.setName("my-template");
            // spec.setTemplateRef(ref);

            sandbox.setSpec(spec);

            // Create the Sandbox
            Sandbox created = client.resources(Sandbox.class)
                .inNamespace(namespace)
                .resource(sandbox)
                .create();

            System.out.println("Created sandbox: " + created.getMetadata().getName());
        }
    }
}
```

### Create Sandboxes via SandboxClaim

SandboxClaim allows you to claim multiple sandboxes from a template in batch.

```java
import io.openkruise.agents.client.v2.models.SandboxClaim;
import io.openkruise.agents.client.v2.models.SandboxClaimSpec;
import io.fabric8.kubernetes.api.model.KubernetesResourceList;

try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    String namespace = "default";
    String claimName = "demo-claim";
    
    // Build SandboxClaim
    SandboxClaim claim = new SandboxClaim();
    claim.setMetadata(new ObjectMetaBuilder()
        .withName(claimName)
        .withNamespace(namespace)
        .build());
    
    SandboxClaimSpec spec = new SandboxClaimSpec();
    spec.setReplicas(2);
    spec.setTemplateName("demo-template");
    claim.setSpec(spec);
    
    // Create the SandboxClaim
    SandboxClaim created = client.resources(SandboxClaim.class)
        .inNamespace(namespace)
        .resource(claim)
        .create();
    
    System.out.println("Created sandboxclaim: " + created.getMetadata().getName());
    
    // Wait for claim to complete (polling)
    long startTime = System.currentTimeMillis();
    long timeout = 60000; // 1 minute
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
        
        Thread.sleep(1000); // Wait 1 second before next check
    }
    
    if (!completed) {
        System.err.println("Claim did not complete within timeout");
    }
    
    // List claimed sandboxes
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

### List Sandboxes

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

### Delete a Sandbox

```java
try (KubernetesClient client = new KubernetesClientBuilder().build()) {
    client.resources(Sandbox.class)
        .inNamespace("default")
        .withName("my-sandbox")
        .delete();

    System.out.println("Sandbox deleted");
}
```

### Watch Sandbox Changes

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

## Legacy Models (Deprecated)

The old models in `io.openkruise.agents.client.models` are **deprecated** and no longer maintained. Please migrate to
`io.openkruise.agents.client.v2.models` which uses Fabric8 Kubernetes Client annotations and provides better type
safety.

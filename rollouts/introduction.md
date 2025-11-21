# Introduction

## What is Kruise Rollouts? 
Kruise Rollouts is a **Bypass** component that offers **Advanced Progressive Delivery Features**.
Its support for canary, blue-green, multi-batch, and A/B testing delivery modes can be helpful in achieving smooth and controlled rollouts of changes to your application, while its compatibility with Gateway API and various Ingress implementations makes it easier to integrate with your existing infrastructure. Overall, Kruise Rollouts is a valuable tool for Kubernetes users looking to optimize their deployment processes!

![kruise-rollout-intro](../static/img/rollouts/intro.png)

## Key Features
- **Rich release strategies**
  - Multi-batch update strategy for Deployment, CloneSet, StatefulSet, DaemonSet, Advanced StatefulSet, Advanced DaemonSet.
  - Canary update strategy for Deployment.
  - Blue-Green update strategy for Deployment, CloneSet.

- **Rich traffic routing management strategies**
  - Traffic fine-grained, weighted traffic shifting when updating workloads.
  - Traffic A/B Testing, traffic shifting based on HTTP Header&Cookie.
  - End-to-End canary deployment
  
- **Rich Traffic Protocol Supports**
  - Ingress controller integration: NGINX, ALB, Higress.
  - Service Mesh integration via GatewayAPI.
  - Pluggable Lua scripts for easily extending to other Kubernetes traffic protocols (even CRD).

## Demo Show
There is a demo of multi-batch update strategy for Deployment.

[![asciicast](https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC.svg)](https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC)

## Kruise Rollouts vs. Other Components

Kruise Rollouts vs. [Argo Rollout](https://argoproj.github.io/rollouts/) and [Flux Flagger](https://fluxcd.io/flagger/).

| Component                   | **Kruise Rollouts**                                          | Argo Rollouts                                      | Flux Flagger                                       |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------- |
| Core Concept                | Enhance your existing workloads                              | Replace your workloads                             | manage your workloads                              |
| Architecture                | Bypass                                                       | A new workload type                                | Bypass                                             |
| Plug and Play, Hot-Swapping | Yes                                                          | No                                                 | No                                                 |
| Release Type                | Multi-Batch, Canary, A/B Testing, End-to-End Canary, Blue-Green | Multi-Batch, Canary, Blue-Green, A/B Testing       | Canary, Blue-Green, A/B Testing                    |
| Workload Type               | Deployment,StatefulSet,CloneSet,Advanced StatefulSet,Advanced DaemonSet | Argo-Rollout                                       | Deployment. DaemonSet                              |
| Traffic Type                | Ingress, GatewayAPI, CRD (Need Lua Script)                   | Ingress, GatewayAPI, APISIX, Traefik, SMI and more | Ingress, GatewayAPI, APISIX, Traefik, SMI and more |
| Migration Costs             | No need migrate your workloads and pods                      | Must migrate your workloads and pods               | Must migrate your pods                             |
| HPA compatible              | Yes                                                          | Yes                                                | No                                                 |

## What's Next
Here are some recommended next steps:
- **[Install](rollouts/installation.md)** Kruise Rollout.

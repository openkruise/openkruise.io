---
title: Introduction
slug: /
---
# What's OpenKruise  
Welcome to OpenKruise!

OpenKruise is an extended component suite for Kubernetes, which mainly focuses on automated management of large-scale applications, such as *deployment, upgrade, ops and availability protection*.

Most features provided by OpenKruise are built primarily based on CRD extensions. They can work in pure Kubernetes clusters without any other dependencies.

## Key features

- **Advanced Workloads**

    OpenKruise contains a set of advanced workloads, such as CloneSet, Advanced StatefulSet, Advanced DaemonSet, BroadcastJob, SidecarSet and UnitedDeployment.

    They all support not only the basic features which are similar to the original Workloads in Kubernetes, but also more advanced abilities like in-place update, configurable scale/upgrade strategies, parallel operations.

    In-place Update is a new methodology to update container images and even environments.
    It only restarts the specific container with the new image and the Pod will not be recreated, which leads to much faster update process and much less side effects on other sub-systems such as scheduler, CNI or CSI.

- **Advanced Day-2 Operations**
    
    OpenKruise also provides high-level operation features to help you manage your applications for better efficiency, better resilience and cost-saving.

    These operations includes image prewarming, container inplace restarts, workload distribution, pod probe & markering and many more. For example, you can use ImagePullJob to download any images on any nodes you want. Or you can even requires one or more containers in an running Pod to be restarted.

- **High-availability Protection**

    OpenKruise works hard on protecting high-availability for applications.

    Now it can prevent your Kubernetes resources from the cascading deletion mechanism, including CRD, Namespace and almost all kinds of Workloads.

    In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or SLA degradation, which is not only compatible with Kubernetes PDB protection for Eviction API, but also able to support the protection ability of above scenarios.

## Relationship

### OpenKruise vs. Kubernetes

Briefly speaking, OpenKruise plays a subsidiary role of Kubernetes.

Kubernetes itself has already provides some features for application deployment and management, such as some [basic Workloads](https://kubernetes.io/docs/concepts/workloads/).
But it is far from enough to deploy and manage lots of applications in large-scale production clusters.

OpenKruise can be easily installed in any Kubernetes clusters.
It makes up for defects of Kubernetes, including but not limited to application deployment, upgrade, protection and operations.

### OpenKruise vs. Platform-as-a-Service (PaaS)

OpenKruise is **not** a PaaS but it provides the **essential building blocks** of PaaS.

PaaS can use the features provided by OpenKruise to make applications deployment and management easier and more powerful. 

## What's Next

Here are some recommended next steps:

- Start to [install OpenKruise](./docs/installation).
- Learn OpenKruise's [Architecture](./docs/core-concepts/architecture).

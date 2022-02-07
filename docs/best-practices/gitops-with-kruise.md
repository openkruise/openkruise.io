---
title: How to publish Kruise workload (CloneSet) using GitOps (Argo-cd)?
---

## What is GitOps？
GitOps is an approach to continuous delivery. Its core idea is to store the declarative infrastructure and applications of an application in a Git repository.

With Git at the core of the delivery pipeline, every developer can submit Pull Requests and use Git to accelerate and simplify application deployment and maintenance tasks for Kubernetes. By using a simple tool like Git, developers can more efficiently focus on creating new features rather than operations-related tasks (e.g., application installation, configuration, migration, etc.).

![argo-cd](/img/docs/best-practices/argocd.jpeg)

## Deploying kruise workloads with argo-cd
### Requirements
- Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16.
- Install argo-cd, Reference [Official Documents](https://argo-cd.readthedocs.io/en/stable/getting_started/)

### Install OpenKruise（Enable: TemplateNoDefaults）
Openkruse installed by default will inject the default value of pod / PVC template, which will conflict with the sync judgment logic of Argo CD.
Therefore, when installing openkruse, you need to open gates **TemplateNoDefaults**, as follows:
```
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"

# Those that have been installed need to be upgraded
$ helm upgrade kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"
```

### Declarative Applications in Git Repository
1. OpenKruise provides a guestbook application [demo](https://github.com/openkruise/samples).
**It consists of guestbook, redis, through openKruise CloneSet to complete the deployment of the application.** As follows:

![guestbook](/img/docs/best-practices/guestbook.png)

```yaml
## CloneSet & Service
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
...
spec:
  replicas: 3
  ...
  template:
  spec:
    containers:
    - name: guestbook
      image: 'k8s.gcr.io/guestbook:v3'
      env:
      - name: "VERSION"
        value: "v1"
      ports:
      - name: http-server
        containerPort: 3000
---
kind: Service
apiVersion: v1
...
spec:
  ports:
  - port: 3000
    targetPort: http-server
  selector:
    app: guestbook
    type: LoadBalancer

### redis master/slave is also similar configuration
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
...
spec:
  replicas: 1
  ...
  template:
    spec:
    containers:
    - name: redis-master
      image: 'k8s.gcr.io/redis:e2e'
      ports:
      - name: redis-server
        containerPort: 6379
---
kind: Service
...
spec:
  ports:
  - port: 6379
    targetPort: redis-server
  selector:
    app: redis
    role: master
```

2. For a variety of environments such as test, pre, and prd, different branches can be used to represent them.
For example, there exists **dev_branch** and **master** corresponding to the git configuration for test and prd environments, as follows:

![git_envs](/img/docs/best-practices/git_envs.png)

### Configuring Argo Application And Resource Health
1. Argo-cd provides a [Declarative Setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/), as follows:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  ## Represents dev env deployment configuration
  name: guestbook-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/zmberg/samples.git
    ## dev branch
    targetRevision: dev_branch
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    ## deploy in default namespace
    namespace: default
```
2. Configuring CloneSet Argo-cd [Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks).
**With this configuration argo-cd is able to perform a healthy check of the CloneSet, such as whether the CloneSet is published and whether the Pods are ready.** as follows:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app.kubernetes.io/name: argocd-cm
    app.kubernetes.io/part-of: argocd
  name: argocd-cm
  namespace: argocd
data:
  resource.customizations.health.apps.kruise.io_CloneSet: |
    hs = {}
    -- if paused
    if obj.spec.updateStrategy.paused then
      hs.status = "Suspended"
      hs.message = "CloneSet is Suspended"
      return hs
    end

    -- check cloneSet status
    if obj.status ~= nil then
      if obj.status.observedGeneration < obj.metadata.generation then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: observed cloneSet generation less then desired generation"
        return hs
      end

      if obj.status.updatedReplicas < obj.spec.replicas then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: replicas hasn't finished updating..."
        return hs
      end

      if obj.status.updatedReadyReplicas < obj.status.updatedReplicas then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: replicas hasn't finished updating..."
        return hs
      end

      hs.status = "Healthy"
      return hs
    end

    -- if status == nil
    hs.status = "Progressing"
    hs.message = "Waiting for cloneSet"
    return hs
```
**OpenKruise internal CRD resources in addition to CloneSet, others such as: Advanced StatefulSet, SidecarSet, etc. can be similar to the above way to achieve Custom Resource Health.**

### Argo-cd Sync (Deploy) The Application
1. Complete the deployment of the guestbook service via the argo-cd command line tool (**argocd app sync guestbook**), as follows:

![guestbook](/img/docs/best-practices/argo_sync_healthy.png)

## Summary
OpenKruise is more of a Kubernetes level extended capability, such as in-place upgrade, preImageDownload, etc. So many community users using OpenKruise in production environments have some additional costs, need to integrate or self-research container PaaS.
The main purpose of this article is to combine some of the best Paas solutions in the community with OpenKruise, so that as many people as possible get to enjoy the dividends of cloud-native at a lower cost.

Argo-cd is a very good product for the community, and it is very user-friendly for OpenKruise's many custom CRD resources. This article is hope that many partners in the community can provide more ideas in "How to use OpenKruise easily", and also we will try to combine it with some CI/CD pipelines later to better practice the devops concept.

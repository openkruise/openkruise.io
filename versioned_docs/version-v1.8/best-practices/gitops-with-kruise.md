---
title: Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet
---

## What is GitOps？
GitOps is an approach to continuous delivery. Its core idea is to store the declarative infrastructure and applications of an application in a Git repository.

With Git at the core of the delivery pipeline, every developer can submit Pull Requests and use Git to accelerate and simplify application deployment and maintenance tasks for Kubernetes. By using a simple tool like Git, developers can more efficiently focus on creating new features rather than operations-related tasks (e.g., application installation, configuration, migration, etc.).

![argo-cd](/img/docs/best-practices/argocd.jpeg)

## GitOps + OpenKruise CloneSet Practice
### Requirements
- Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16.
- Install Tekton, Reference [Official Documents](https://tekton.dev/docs/getting-started/),
Tekton is a Google open source Kubernetes native framework for creating continuous integration and continuous deployment/delivery (CI/CD) systems.
- Install Argo-cd, Reference [Official Documents](https://argo-cd.readthedocs.io/en/stable/getting_started/), Argo-cd is a declarative GitOps continuous delivery tool for Kubernetes.

#### Install OpenKruise（Enable: TemplateNoDefaults）
Openkruise installed by default will inject the default value of pod / PVC template, which will conflict with the sync judgment logic of Argo CD.
Therefore, when installing openkruise, you need to open gates **TemplateNoDefaults**, as follows:
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

### CloneSet Deploy Stateless Application
**CloneSet is the ability provided by OpenKruise to efficiently manage stateless applications, it is similar to the official workload: Deployment,
but offers many enhancements such as InPlace Update, Batch Release, etc.** Please refer to the documentation [CloneSet](https://openkruise.io/docs/user-manuals/cloneset).
This article provides a helloworld http service [demo](https://github.com/zmberg/samples/tree/hello_world/helloworld), It contains Helm Charts, and the cloneSet configuration is shown below:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  name: helloworld-server
  labels:
    app: helloworld-server
spec:
  updateStrategy:
    # CloneSet will try to in-place update Pod instead of recreating them if possible
    type: InPlaceIfPossible
    # Batch release, currently updating only one Pod
    partition: 1
  replicas: 2
  selector:
    matchLabels:
      app: helloworld-server
  template:
    metadata:
      labels:
        app: helloworld-server
    spec:
      containers:
      - name: helloworld
        image: "openkruise/kruise:hello_world-d92ae174b"
```

### Argo-cd CloneSet Health Check
Configure CloneSet Argo-cd [Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks),
**With this configuration argo-cd is able to perform a healthy check of the CloneSet, such as whether the CloneSet is published and whether the Pods are ready,** as follows：

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

### Tekton Pipeline + Argo-cd
Argo-CD together with Tekton Pipeline is a popular DevOps practice and integrate well with CI process.
Such practice requires storing the Argo-cd admin secret in K8S Secret CRD ([method of obtaining secret](https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli)), which in turn can be used in Tekton Pipeline, as follows:

```yaml
apiVersion: v1
data:
  # argo-cd admin secret
  username: xxxxx
  password: xxxxx
  server: xxxxx
kind: Secret
metadata:
  name: argosecret
---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  labels:
    app: helloworld
  name: helloworld-argocd
spec:
  params:
  - name: gitrepositoryurl
    type: string
  - name: branch
    type: string
  - name: short_sha
    type: string
  - name: docker_repo
    type: string
  - name: app_name
    type: string
  - name: app_ns
    type: string
  - name: k8s_server
    type: string
  steps:
  - name: argocd-deploy
    image: argoproj/argocd:latest
    command:
    - sh
    args:
    - '-ce'
    - >
      set -e

      echo "upgrade app $(params.app_name)"; username=`cat /var/secret/username`; password=`cat /var/secret/password`; server=`cat /var/secret/server`;

      argocd login ${server} --insecure --username ${username} --password ${password}

      argocd app create $(params.app_name) --upsert --repo $(params.gitrepositoryurl) --path $(params.app_name)/charts --dest-namespace $(params.app_ns) --dest-server $(params.k8s_server) --revision $(params.branch) --helm-set image.repository=$(params.docker_repo) --helm-set image.tag=$(params.branch)-$(params.short_sha) --helm-set installation.namespace=$(params.app_ns)

      argocd app list; argocd app sync $(params.app_name)

      argocd app wait $(params.app_name) --health
    volumeMounts:
    - name: argocd-secret
      mountPath: "/var/secret"
  volumes:
  - name: argocd-secret
    secret:
      secretName: argosecret
---
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: helloworld-pipeline
spec:
  params:
  - name: gitrepositoryurl
    type: string
  - name: branch
    type: string
  - name: short_sha
    type: string
  - name: docker_repo
    type: string
  - name: app_name
    type: string
  - name: app_ns
    type: string
  - name: k8s_server
    type: string
  # Here you can connect with CI process to realize CI/CD Pipeline
  tasks:
  - name: helloworld-argocd
    taskRef:
      name: helloworld-argocd
    params:
    - name: gitrepositoryurl
      value: $(params.gitrepositoryurl)
    - name: short_sha
      value: $(params.short_sha)
    - name: branch
      value: $(params.branch)
    - name: docker_repo
      value: $(params.docker_repo)
    - name: app_name
      value: $(params.app_name)
    - name: app_ns
      value: $(params.app_ns)
    - name: k8s_server
      value: $(params.k8s_server)
```
### Run Tekton Pipeline
Configure PipelineRun CRD, and kubectl apply -f in k8s cluster to run Pipeline, as follows:
```yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: helloworld-pipeline-run-1
spec:
  pipelineRef:
    name: helloworld-pipeline
  params:
  - name: gitrepositoryurl
    value: https://github.com/zmberg/samples.git
  - name: branch
    value: hello_world
  - name: short_sha
    value: d92ae174b
  - name: docker_repo
    value: zhaomingshan/kruise
  - name: app_name
    value: helloworld
  - name: app_ns
    value: helloworld
  - name: k8s_server
    value: https://kubernetes.default.svc
```
The results can be viewed via the argo-cd cli, as follows:

![guestbook](/img/docs/best-practices/argo_sync_healthy.png)

## Summary
OpenKruise is more of a Kubernetes level extended capability, such as in-place upgrade, preImageDownload, etc.
So many community users using OpenKruise in production environments have some additional costs, need to integrate or self-research container PaaS.
The main purpose of this article is to combine some of the best Paas solutions in the community with OpenKruise,
so that as many people as possible get to enjoy the dividends of cloud-native at a lower cost.

Argo-cd is a very good product for the community, and it integrate well with OpenKruise's CRD resources,
we hope that this article can intrigue more ideas from the community about "How to use OpenKruise easily".
We will try to integrate OpenKruise with other CI/CD pipelines later to better implement DevOps practice.

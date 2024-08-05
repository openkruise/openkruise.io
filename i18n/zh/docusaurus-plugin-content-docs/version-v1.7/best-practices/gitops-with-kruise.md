---
title: 云原生Devops最佳实践（2）：GitOps + OpenKruise CloneSet
---

## 什么是GitOps？
GitOps是一种持续交付的方式。它的核心思想是将应用系统的声明性基础架构和应用程序存放在Git版本库中。

将Git作为交付流水线的核心，每个开发人员都可以提交拉取请求（Pull Request）并使用Git来加速和简化Kubernetes的应用程序部署和运维任务。通过使用像Git这样的简单工具，开发人员可以更高效地将注意力集中在创建新功能而不是运维相关任务上（例如，应用系统安装、配置、迁移等）。

随着gitops越来越深入人心，社区涌现了非常多的优秀产品，例如：Jenkins X、Argo CD、Weave Flux等。本文将以argo-cd为例介绍一下如何使用gitops发布kruise workload，方便社区的用户能够更加方便的使用openKruise。

![argo-cd](/img/docs/best-practices/argocd.jpeg)

## GitOps + OpenKruise CloneSet实践
### 前置条件
- Kubernetes集群，从v1.0.0(alpha/beta)开始，OpenKruise要求在Kubernetes >= 1.16以上版本的集群中安装和使用。
- 安装Tekton, 参考[官方文档](https://tekton.dev/docs/getting-started/)，Tekton是一种适用于创建持续集成和持续部署/交付(CI/CD)系统的谷歌开源的Kubernetes原生框架。
- 安装argo-cd, 参考[官方文档](https://argo-cd.readthedocs.io/en/stable/getting_started/)，Argo-cd是用于Kubernetes的声明性GitOps连续交付工具。

#### Install OpenKruise（Enable: TemplateNoDefaults）
默认安装的OpenKruise会进行pod/pvc template的默认值注入，这个行为会跟argo-cd的sync判断逻辑冲突，所以在安装OpenKruise需要打开Gates **TemplateNoDefaults**，如下：
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
### CloneSet部署无状态应用
**CloneSet是OpenKruise提供的高效管理无状态应用的能力，它可以对标原生的 Deployment，但 CloneSet 提供了很多增强功能，例如：原地升级、分批发布，**请参考文档：[CloneSet](https://openkruise.io/zh/docs/user-manuals/cloneset)。
本篇文章提供了一个hello world服务 [Demo](https://github.com/zmberg/samples/tree/hello_world/helloworld)，它包含Helm charts，其中CloneSet配置如下：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  name: helloworld-server
  labels:
    app: helloworld-server
spec:
  updateStrategy:
  # CloneSet会优先尝试原地升级 Pod，如果不行再采用重建升级
    type: InPlaceIfPossible
  # 分批发布，当前批次只升级1个Pod
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
配置CloneSet Argo-cd [Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks)，
**Argo-cd根据该配置能够实现CloneSet自定义资源的检查，如CloneSet是否发布完成，以及Pod是否ready等，**如下：

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
**kruise内部自定义CRD资源除CloneSet，其它如：Advanced StatefulSet、SidecarSet等都可以类似上面的方式实现Custom Resource Health。**

### Tekton Pipeline + Argo-cd
通过Tekton Pipeline进行Argo-cd部署应用，可以更好的践行Devops思想，与CI流程打通。其中需要将Argo-cd的密钥（[密钥获取方法](https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli)）存储到Secret当中，进而在Tekton Pipeline中使用，如下：

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
  # 此处可以与CI流程打通，实现CI/CD Pipeline
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
### 执行Tekton Pipeline
定义PipelineRun CRD资源，并kubectl apply -f 到k8s集群执行Pipeline，如下：
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
可以通过Argo-cd cli查看部署情况，如下：

![guestbook](/img/docs/best-practices/argo_sync_healthy.png)

## 总结
OpenKruise更多是Kubernetes层面扩展的能力，如 原地升级、镜像预热等，所以很多社区的用户在生产环境使用OpenKruise还有一些额外的成本，需要集成或自研容器PaaS方案。
本文的主要目的是想将社区的一些优秀的Paas方案与OpenKruise结合起来，尽量让更多的人能够更小的成本享受云原生带来的红利。Argo-cd是目前社区非常优秀的一款产品，
并且它对于OpenKruise众多的自定义CRD资源也能够非常便捷的对接，对使用者而言很友好。本文也算是一个抛砖引玉，希望社区的众多小伙伴能够提供更多的思路，后面也会尝试与一些其它CI/CD流水线结合，争取能够更好的践行devops理念。

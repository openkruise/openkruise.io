---
title: 如何使用GitOps（argo-cd）发布Kruise workload（CloneSet）
---

## 什么是GitOps？
GitOps是一种持续交付的方式。它的核心思想是将应用系统的声明性基础架构和应用程序存放在Git版本库中。

将Git作为交付流水线的核心，每个开发人员都可以提交拉取请求（Pull Request）并使用Git来加速和简化Kubernetes的应用程序部署和运维任务。通过使用像Git这样的简单工具，开发人员可以更高效地将注意力集中在创建新功能而不是运维相关任务上（例如，应用系统安装、配置、迁移等）。

随着gitops越来越深入人心，社区涌现了非常多的优秀产品，例如：Jenkins X、Argo CD、Weave Flux等。本文将以argo-cd为例介绍一下如何使用gitops发布kruise workload，方便社区的用户能够更加方便的使用openKruise。

![argo-cd](/img/docs/best-practices/argocd.jpeg)

## 使用argo-cd部署kruise应用
### 前置条件
- Kubernetes集群，从v1.0.0(alpha/beta)开始，OpenKruise要求在Kubernetes >= 1.16以上版本的集群中安装和使用。
- 安装argo-cd, 参考[官方文档](https://argo-cd.readthedocs.io/en/stable/getting_started/)

### Install OpenKruise（Enable: TemplateNoDefaults）
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

### 把应用编排作为Git Repository
1. 本文提供了一个guestbook的[demo](https://github.com/openkruise/samples)，它由guestbook、redis组成，通过kruise cloneSet、service完成应用的部署。如下：

![guestbook](/img/docs/best-practices/guestbook.png)

```yaml
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

### redis master/slave 也是类似的配置
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

2. 针对测试、预发、正式等多种环境，可以使用不同的分之来表示，例如，本示例中就存在**dev_branch**、**master**对应测试、正式环境的git配置，如下：

![git_envs](/img/docs/best-practices/git_envs.png)

### 配置argo Application和Resource Health
1. Argo-cd提供了一种[Declarative Setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)，如下：

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  ## 代表 dev 环境git配置
  name: guestbook-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/zmberg/samples.git
    ## 代表 dev 环境git配置
    targetRevision: dev_branch
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    ## 部署到 default namespace
    namespace: default
```

2. 配置CloneSet Argo-cd [Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks),
**argo-cd根据该配置能够实现CloneSet自定义资源的检查，如CloneSet是否发布完成，以及Pod是否ready等，如下：**

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

### Argo-cd部署Guestbook Application
1. 通过argo-cd命令行工具完成guestbook服务的部署(**argocd app sync guestbook**)，如下：

![guestbook](/img/docs/best-practices/argo_sync_healthy.png)

## 总结
OpenKruise更多是Kubernetes层面扩展的能力，如 原地升级、镜像预热等，所以很多社区的用户在生产环境使用OpenKruise还有一些额外的成本，需要集成或自研容器PaaS方案。
本文的主要目的是想将社区的一些优秀的Paas方案与OpenKruise结合起来，尽量让更多的人能够更小的成本享受云原生带来的红利。Argo-cd是目前社区非常优秀的一款产品，
并且它对于OpenKruise众多的自定义CRD资源也能够非常便捷的对接，对使用者而言很友好。本文也算是一个抛砖引玉，希望社区的众多小伙伴能够提供更多的思路，后面也会尝试与一些CI/CD流水线结合，争取能够更好的践行devops理念。

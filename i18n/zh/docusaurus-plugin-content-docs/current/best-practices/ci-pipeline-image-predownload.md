---
title: 云原生Devops最佳实践（1）：持续集成（CI）+ OpenKruise镜像预热
---

## 什么是Devops？
DevOps 就是开发（Development）、测试（QA）、运维（Operations）这三个领域的合并。DevOps是一种思想、一组最佳实践、以及一种文化。
DevOps是CI/CD思想的延伸，CI/CD是DevOps的基础核心，如果没有CI/CD自动化的工具和流程，DevOps是没有意义的。

![ci/cd pipeline](/img/docs/best-practices/ci_cd_pipeline.png)

## 持续集成（CI）+ OpenKruise镜像预热
### 核心概念
- **持续集成**（CI）是一个将集成提前至开发周期的早期阶段的实践方式，让构建、测试和集成代码更经常反复地发生。
- [**镜像预热**](https://openkruise.io/zh/docs/user-manuals/imagepulljob/)是OpenKruise提供的在应用部署之前提前将应用镜像拉取到具体的Node节点上面，进而达到镜像预热的目的，能够极大的提升应用的部署效率。

### 整体架构
![ci+image pre-download](/img/docs/best-practices/imagepulljob.png)

### 使用场景
- **长期预热公共sidecar镜像、基础镜像，例如：istio envoy、日志采集容器**
- **大规模场景下，提前预热业务app镜像到特定的K8s Node，进而降低部署过程中对镜像仓库的压力，主要针对Deployment、StatefulSet等k8s原生资源**
- **OpenKruise CloneSet原地升级时，内置了镜像预热能力，参考[CloneSet文档](https://openkruise.io/docs/user-manuals/cloneset#pre-download-image-for-in-place-update)。**

**注意：OpenKruise镜像预热能力只能针对常规的Kubelet节点，而virtual kubelet则不能适用。**

## Tekton（CI）+ 镜像预热实践
### 前置条件
- Kubernetes集群，从v1.0.0(alpha/beta)开始，OpenKruise要求在Kubernetes >= 1.16以上版本的集群中安装和使用。
- 安装Tekton, 参考[官方文档](https://tekton.dev/docs/getting-started/)。Tekton是一种适用于创建持续集成和持续部署/交付(CI/CD)系统的谷歌开源的Kubernetes原生框架。
- Helm安装OpenKruise，需要v0.9.0及更新的版本，参考[安装文档](https://openkruise.io/zh/docs/installation)。

### 构建-测试-镜像推送
**1. Git Repo：本文提供了一个helloworld http服务[demo](https://github.com/zmberg/samples/tree/hello_world/helloworld)，其中包含Code、Dockerfile以及Unit Test，如下：**
![git helloworld](/img/docs/best-practices/helloworld.png)

**2. Tekton构建-测试-推送镜像Task，并且需要生成docker registry secret（用于push image），如下：**
```yaml
# docker registry密钥，用于docker push image
apiVersion: v1
data:
  .dockerconfigjson: xxxxxx
kind: Secret
metadata:
  name: dockersecret
type: kubernetes.io/dockerconfigjson
---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  labels:
    app: helloworld
  name: helloworld-build-push
spec:
  stepTemplate:
    workingDir: /workspace
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
  steps:
  # git clone
  - name: git-clone-and-checkout
    image: bitnami/git:latest
    command: ["sh", "-ce"]
    args:
    - >
      set -e

      echo $(params.gitrepositoryurl)

      git clone $(params.gitrepositoryurl) ./ && git checkout $(params.branch)
  # unit test
  - name: auto-test
    image: golang:1.16
    command: [ "sh", "-ce" ]
    args:
    - >
      set -e

      cp -R /workspace/$(params.app_name) /go/src/ && cd /go/src/$(params.app_name) && pwd;

      go test
  # docker build & push registry
  - name: push-to-registry
    image: gcr.io/kaniko-project/executor:latest
    args:
    - --dockerfile=Dockerfile
    - --destination=$(params.docker_repo):$(params.branch)-$(params.short_sha)
    - --context=./$(params.app_name)
    - --cache=true
    - --cache-dir=/cache
    - --use-new-run
    volumeMounts:
    - name: kaniko-secret
      mountPath: "/kaniko/.docker"
  volumes:
  # docker push secret
  - name: kaniko-secret
    secret:
      secretName: dockersecret
      items:
      - key: .dockerconfigjson
        path: config.json
```

### 镜像预热
#### Kruise CloneSet & Advanced StatefulSet原地升级内置镜像预热能力
**Note：此种场景不再需要下发ImagePullJob CRD资源**

如果你在[安装或升级 Kruise](../installation##optional-feature-gate) 的时候启用了 `PreDownloadImageForInPlaceUpdate` feature-gate，
CloneSet & Advanced StatefulSet 控制器会自动在所有旧版本 pod 所在 node 节点上预热你正在灰度发布的新版本镜像。 这对于应用发布加速很有帮助。
```
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/

# [Optional]
$ helm repo update

# Install the latest version.
$ helm install kruise openkruise/kruise --set featureGates="PreDownloadImageForInPlaceUpdate=true"

# Those that have been installed need to be upgraded
$ helm upgrade kruise openkruise/kruise --set featureGates="PreDownloadImageForInPlaceUpdate=true"
```

默认情况下 CloneSet & Advanced StatefulSet 每个新镜像预热时的并发度都是 `1`，也就是一个个节点拉镜像。如果需要调整，你可以在 annotation 上设置并发度：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet/StatefulSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "5"
```

#### Kubernetes原生Workload，例如：Deployment, StatefulSet, DaemonSet, Job等
**1. 配置镜像预热 ImagePullJob CRD资源，并配置到k8s configmap资源中，如下：**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: imagePullJob
data:
  imagepulljob.yaml: |
    apiVersion: apps.kruise.io/v1alpha1
    kind: ImagePullJob
    metadata:
      name: APP_NAME
    spec:
      # 需要预热的镜像地址
      image: APP_IMAGE
      parallelism: 10
      # 你可以在 selector 字段中指定节点的 名字列表 或 标签选择器 (只能设置其中一种)，如果没有设置 selector 则会选择所有节点做预热。
      selector:
        names:
        - node-1
        - node-2
        matchLabels:
          node-type: xxx
      completionPolicy:
        type: Always
        activeDeadlineSeconds: 1200
        ttlSecondsAfterFinished: 300
      pullPolicy:
        backoffLimit: 3
        timeoutSeconds: 300
```
**2. 下发镜像预热 ImagePullJob CRD资源TASK，其中kubeconfig配置存储在secret中，如下：**
```yaml
# kubeconfig配置
apiVersion: v1
data:
  kubeconfig: xxxxxx
kind: Secret
metadata:
  name: kubeconfig
---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  labels:
    app: helloworld
  name: helloworld-image-predownload
spec:
  params:
  - name: branch
    type: string
  - name: short_sha
    type: string
  - name: docker_repo
    type: string
  - name: app_name
    type: string
  steps:
  - name: image-predownload
    image: bitnami/kubectl:latest
    command: [ "sh", "-ce" ]
    args:
    - >
      set -e

      echo "pre download image"

      cat /var/crd/imagepulljob.yaml | sed 's#JOB_NAME#$(params.app_name)-$(params.short_sha)#' | sed 's#APP_IMAGE#$(params.docker_repo):$(params.branch)-$(params.short_sha)#' | kubectl apply --kubeconfig=/var/kube/kubeconfig -f -
    volumeMounts:
    - name: kubeconfig
      mountPath: "/var/kube"
    - name: imagepulljob
      mountPath: "/var/crd"
  volumes:
  - name: kubeconfig
    secret:
      secretName: kubeconfig
  - name: imagepulljob
    configmap:
      name: imagepulljob
```
### 一键执行Tekton Pipeline
**1. 定义tekton pipeline，总共由上面两个task任务组成，并且执行完 构建-测试-推送镜像Task之后，再执行镜像预热Task如下：**
```yaml
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
  tasks:
  - name: helloworld-build-push
    taskRef:
      name: helloworld-build-push
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
  - name: helloworld-image-predownload
  taskRef:
    name: helloworld-image-predownload
    params:
    - name: short_sha
      value: $(params.short_sha)
    - name: branch
      value: $(params.branch)
    - name: docker_repo
      value: $(params.docker_repo)
    - name: app_name
      value: $(params.app_name)
    runAfter:
    - helloworld-build-push
```
**2. 定义PipelineRun CRD资源，并kubectl apply -f 到k8s集群执行Pipeline，如下：**
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
```
**3. 可以通过tekton命令行工具tkn查看执行结果，如下：**

![tekton pipeline](/img/docs/best-practices/tekton_pipeline.png)

## 总结
Tekton是google开源的目前社区非常流行的云原生CI Pipeline工具，本篇文章旨在将OpenKruise提供的镜像预热能力与CI Pipeline结合，进而能够极大的提升用户在应用部署阶段的部署效率，并且能够降低在大规模部署下对于镜像仓库的压力。
后面一篇文章将会聚焦在CD Pipeline应用部署阶段，敬请期待。

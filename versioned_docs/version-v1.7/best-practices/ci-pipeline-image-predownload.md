---
title: Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download
---

## What is Devops？
DevOps is the merging of the three domains of Development, QA, and Operations. DevOps is an idea, a set of best practices, and a culture.
DevOps is an extension of CI/CD, and CI/CD is the core foundation of DevOps. Without CI/CD automation tools and processes, DevOps is meaningless.

![ci/cd pipeline](/img/docs/best-practices/ci_cd_pipeline.png)

## Continuous Integration (CI) + OpenKruise Image Pre-download
### Core Concepts
- **Continuous Integration(CI)** is a hands-on way to bring integration forward to the early stages of the development cycle, allowing builds, tests and integration of code to happen more often and repeatedly.
- **[Image Pre-download](https://openkruise.io/docs/user-manuals/imagepulljob/)** is provided by OpenKruise to pull application images to specific Node nodes in advance of application deployment, which in turn can greatly improve the efficiency of application deployment.

### Architecture
![ci+image predownload](/img/docs/best-practices/imagepulljob.png)

### User Story
- **Long-term pre-download common sidecar images, base images, such as: istio envoy, log collection containers.**
- **In large-scale scenarios, pre-download business app images to a specific K8s Node to reduce the pressure on the image repository during deployment, mainly for Deployment, StatefulSet and other k8s native resources.**
- **OpenKruise CloneSet & Advanced StatefulSet InPlace Update with built-in image pre-download capability, refer to [CloneSet documentation](https://openkruise.io/docs/user-manuals/cloneset#pre-download-image-for-in-place-update).**

**Note: The OpenKruise image pre-download capability is only available for regular kubelet nodes, and not for virtual kubelet.**

## Tekton(CI) + Image Pre-download Practice
### Requirements
- Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16.
- Install Tekton, Reference [Official Documents](https://tekton.dev/docs/getting-started/)。
Tekton is a Google open source Kubernetes native framework for creating continuous integration and continuous deployment/delivery (CI/CD) systems.
- Helm installation of OpenKruise, Since v0.9.0, Reference [Install OpenKruise](https://openkruise.io/zh/docs/installation)。

### Build-Test-Docker Push
**1. Git Repo: This article provides a helloworld http service [demo](https://github.com/zmberg/samples/tree/hello_world/helloworld), It contains Code, Dockerfile, and Unit Test, as follows:**
![git helloworld](/img/docs/best-practices/helloworld.png)

**2. Tekton Build-Test-DockerPush Task, and need to generate the docker registry secret(for docker push image), as follows:**
```yaml
# docker registry secret, for docker push image
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

### Image Pre-download

#### Kruise CloneSet & Advanced StatefulSet InPlace Update Built-in Image Pre-download
**Note: This scenario no longer requires to deploy ImagePullJob CRD**

If you have enabled the `PreDownloadImageForInPlaceUpdate` feature-gate during [Kruise installation or upgrade](../installation#optional-feature-gate),
CloneSet & Advanced StatefulSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.
It is quite useful to accelerate the progress of applications upgrade.
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

The parallelism of each new image pre-downloading by CloneSet & Advanced StatefulSet is `1`, which means the image is downloaded on nodes one by one.
You can change the parallelism using the annotation on CloneSet according to the capability of image registry,
for registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet/StatefulSet
metadata:
  annotations:
    apps.kruise.io/image-predownload-parallelism: "5"
```

#### Kubernetes Native Workload, e.g. Deployment, StatefulSet, DaemonSet, Job etc.
**1. Configure ImagePullJob CRD in k8s configmap, as follows:**
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
      # pre-download image
      image: APP_IMAGE
      parallelism: 10
      # You can write the names or label selector in the selector field to assign Nodes (only one of them can be set).
      # If no selector is set, the image will be pulled on all Nodes in the cluster.
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
**2. Image Pre-download ImagePullJob TASK, and store kubeconfig in secret, as follows:**
```yaml
# kubeconfig
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
  - name: image-pre-download
    image: bitnami/kubectl:latest
    command: [ "sh", "-ce" ]
    args:
    - >
      set -e

      echo "pre-download image"

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
### Tekton Pipeline
**1. configure tekton pipeline, first executing the Build-Test-DockerPush Task, and second Image Pre-download Task, as follows:**
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
**2. Configure PipelineRun CRD, and kubectl apply -f in k8s cluster to run Pipeline, as follows:**
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
**3. The execution results can be viewed via the tekton command line tool tkn, as follows:**

![tekton pipeline](/img/docs/best-practices/tekton_pipeline.png)

## Summary
This article aims to combine the image pre-download capability provided by OpenKruise with CI Pipeline, which can greatly improve the deployment efficiency of users in the application deployment phase and reduce the pressure on image repositories in large-scale deployments.
A later article will focus on the CD Pipeline application deployment phase, so stay tuned.

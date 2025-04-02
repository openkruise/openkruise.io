---
title: 管理日志采集sidecar容器最佳实践
---

## Kubernetes容器日志收集
日志作为任一系统不可或缺的部分，在K8S [官方文档](https://kubernetes.io/docs/concepts/cluster-administration/logging/) 中也介绍了多种的日志采集形式，总结起来主要有下述3种：**原生方式、DaemonSet方式和Sidecar方式**。
三种方式都有利有弊，没有哪种方式能够完美的解决100%问题的，所以要根据场景来贴合。**其中Sidecar方式为每个POD单独部署日志agent，相对资源占用较多，但灵活性以及多租户隔离性较强，建议大型的K8S集群或作为PAAS平台为多个业务方服务的集群使用该方式。**

### EFK整体架构
EFK（ElasticSearch, FileBeat, Kibana）是社区非常流行的、使用非常广泛的日志采集方案，架构如下：
![k8s log sidecar](/img/docs/best-practices/k8s-log-sidecar.png)

### K8S Sidecar模式弊端
如上图所示，FileBeat容器以Sidecar模式与业务app容器部署在同一个Pod内，通过共享volume的方式采集日志上传到ElasticSearch，配置如下：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    volumeMounts:
    # 通过 volumeMounts 与filebeat sidecar容器共享 log 目录
    - mountPath: /var/log/nginx
      name: log
  - name: filebeat
    image: docker.elastic.co/beats/filebeat:7.16.2
    volumeMounts:
    - mountPath: /var/log/nginx
      name: log
  volumes:
  - name: log
    emptyDir: {}
```

**Pod Sidecar模式：**通过在Pod里定义专门容器，来执行主业务容器需要的辅助工作（比如：日志采集容器，流量代理容器）。优势：将辅助能力同业务容器解耦，实现独立发布和能力重用。**但是也有一些弊端，如下：**
- **业务Pod耦合（运维、代理）多种sidecar容器，增加配置的复杂性以及业务开发人员的学习成本**
- **Sidecar容器升级将导致业务Pod重建，由于Sidecar容器一般是独立的中间件团队负责，如果升级会存在极大的业务方阻力**

### SidecarSet管理sidecar容器的利器
**SidecarSet是OpenKruise中针对sidecar容器管理抽象出来的概念**，负责注入和升级k8s集群中的sidecar容器，是OpenKruise的核心workload之一，详细可参考：[SidecarSet文档](https://openkruise.io/zh/docs/user-manuals/sidecarset/)。
- **自动注入Sidecar：将sidecar容器配置与业务Workload（Deployment、CloneSet等）配置解耦，简化用户使用成本**
- **独立升级Sidecar容器：不重建Pod，单独升级Sidecar容器，对业务无感**

## EFK + SidecarSet(FileBeat)实践
### 安装EFK（ElasticSearch、Kibana）
社区中有很多安装部署EFK的文档，本文主要是通过Helm的方式进行部署，参考 [Elastic Helm Charts](https://github.com/elastic/helm-charts)。
首先K8S集群中需要 *StorageClass* 用于ElasticSearch PVC，本文使用已经定义好的 *alibabacloud-cnfs-nas* 如下：
```shell
helm-charts% kubectl get storageclass
NAME                       PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
alibabacloud-cnfs-nas      nasplugin.csi.alibabacloud.com    Delete          Immediate              true                   6d2h
```

Helm一键部署ElasticSearch、Kibana，如下：
```shell
helm-charts% helm repo add elastic https://helm.elastic.co
helm-charts% helm repo update

## 安装 ElasticSearch，设置storage-class为 alibabacloud-cnfs-nas
helm-charts% helm install elasticsearch elastic/elasticsearch --version 7.16.3 --set persistence.annotations."volume.beta.kubernetes.io/storage-class"=alibabacloud-cnfs-nas -n elastic-system

## 安装 Kibana，即可通过kibana service externalIp进行访问
helm-charts% helm install kibana elastic/kibana --version 7.16.3 --set service.type=LoadBalancer -n elastic-system
```

### FileBeat SidecarSet CRD
创建FileBeat采集配置（此ConfigMap需要创建到业务Namespace下面），如下：
```yaml
apiVersion: v1
data:
  filebeat.yml: |
    filebeat.inputs:
    - type: log
      paths:
      - /var/log/*
    output.elasticsearch:
      host: '${NODE_NAME}'
      hosts: '${ELASTICSEARCH_HOSTS:elasticsearch-master.elastic-system:9200}'
kind: ConfigMap
metadata:
  name: filebeat-config
```
定义FileBeat SidecarSet配置，如下：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: filebeat-sidecarset
spec:
  selector:
    # 需要注入 sidecar 容器的 pod labels
    matchLabels:
      kruise.io/inject-filebeat: "true"
  # sidecarSet默认是对整个集群生效，可以通过namespace字段指定生效的范围
 #namespace: ns-xxx
  containers:
  - args:
    - -c
    - /etc/filebeat.yml
    - -e
    env:
    - name: POD_NAMESPACE
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.namespace
    image: docker.elastic.co/beats/filebeat:7.16.2
    livenessProbe:
      exec:
        command:
        - sh
        - -c
        - |
          #!/usr/bin/env bash -e
          curl --fail 127.0.0.1:5066
    name: filebeat
    readinessProbe:
      exec:
        command:
        - sh
        - -c
        - |
          #!/usr/bin/env bash -e
          filebeat test output
    resources:
      limits:
        cpu: "1"
        memory: 200Mi
      requests:
        cpu: 100m
        memory: 100Mi
    volumeMounts:
    - name: config
      mountPath: /etc/filebeat.yml
      readOnly: true
      subPath: filebeat.yml
    - name: varlog
      mountPath: /var/log
      readOnly: true
  volumes:
  - configMap:
      name: filebeat-config
    name: config
  - name: varlog
    emptyDir: {}
```
**针对机器资源不太充足的场景，为减少Pod资源的申请，可以将sidecar container request.cpu=0，此种情况下Pod的Qos将会是 [Burstable](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-burstable)。**

### 自动注入FileBeat Sidecar容器
定义Nginx服务Deployment，只包含 nginx 相关配置，如下：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        # 注入 filebeat sidecar 容器的label
        kruise.io/inject-filebeat: "true"
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        volumeMounts:
        # 通过 volumeMounts 与filebeat sidecar容器共享 log 目录
        - mountPath: /var/log/nginx
          name: log
      volumes:
      - name: log
        emptyDir: {}
```
**将nginx deployment apply到k8s集群后，发现创建的Pod都被注入了 filebeat sidecar 容器，**如下：
```shell
helm-charts% kubectl get pods nginx-5674976569-zdr7l -o yaml
status:
  containerStatuses:
  - containerID: containerd://5330c2b32262de83ed387e5a932f61acc52e3896ddfcb22d626c43d82638faf3
    image: docker.elastic.co/beats/filebeat:7.16.2
    name: filebeat
    state:
      running:
        startedAt: "2022-03-02T12:17:15Z"
  - containerID: containerd://1ad335f39c134f7a66a0370a275dd95f67f5fd3d3f1fe523c955408b14887229
    image: docker.io/library/nginx:latest
    name: nginx
    state:
      running:
        startedAt: "2022-03-02T12:17:16Z"
```

### 独立升级FileBeat Sidecar容器（Version 7.16.2 -> 7.16.3）
下面是两个窗口，右边是访问nginx服务的client请求。**此时将filebeat sidecarSet中的镜像地址从7.16.2变更为7.16.3后，发现Pod并没有重建，
且filebeat sidecar容器镜像升级7.16.3完成过程中，nginx服务并没有中断（该nginx服务只有一个Pod实例），**如下：

![k8s log sidecar](/img/docs/best-practices/update-sidecarset.gif)

该特性依赖Kruise原地升级的能力实现，详情参考文档：[Kruise原地升级](https://openkruise.io/zh/docs/next/core-concepts/inplace-update/)。
不过独立升级sidecar容器也存在一定的风险性，如果sidecar容器升级过程中失败，则将导致Pod Not Ready，进而影响业务，因此SidecarSet本身提供了非常丰富的灰度发布能力来尽量规避该风险，
详情参考文档：[Kruise SidecarSet](https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5)，如下：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    # 最大不可用数量
    maxUnavailable: 20%
    # 分批发布
    partition: 90
    # 金丝雀发布，通过pod labels
    selector:
      matchLabels:
        # Some Pods contain canary labels,
        # or any other labels where a small number of pods can be selected
        deploy-env: canary
```
**另外，如果是类似于ServiceMesh Envoy Mesh类容器则需要借助于SidecarSet热升级特性，**详情请参考：[SidecarSet热升级](https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E7%83%AD%E5%8D%87%E7%BA%A7%E7%89%B9%E6%80%A7)。

### Argo-cd部署SidecarSet（Optional）
如果使用Argo-cd发布Kruise SidecarSet，则需要配置 [SidecarSet Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks)。
Argo-cd根据该配置能够实现SidecarSet自定义资源的检查，如SidecarSet是否发布完成，以及Pod是否ready等，如下：
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
  resource.customizations.health.apps.kruise.io_SidecarSet: |
    hs = {}
    -- if paused
    if obj.spec.updateStrategy.paused then
      hs.status = "Suspended"
      hs.message = "SidecarSet is Suspended"
      return hs
    end

    -- check sidecarSet status
    if obj.status ~= nil then
      if obj.status.observedGeneration < obj.metadata.generation then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: observed sidecarSet generation less then desired generation"
        return hs
      end

      if obj.status.updatedPods < obj.spec.matchedPods then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: replicas hasn't finished updating..."
        return hs
      end

      if obj.status.updatedReadyPods < obj.status.updatedPods then
        hs.status = "Progressing"
        hs.message = "Waiting for rollout to finish: replicas hasn't finished updating..."
        return hs
      end

      hs.status = "Healthy"
      return hs
    end

    -- if status == nil
    hs.status = "Progressing"
    hs.message = "Waiting for sidecarSet"
    return hs
```
## 总结
Pod包含多个container的方式将越来越被更多的开发者接受，进而K8S生态里面急需一种能够有效管理Sidecar容器的方式。
Kruise SidecarSet是在sidecar容器管理上面的一些探索，目前社区也有很多的公司在使用Kruise SidecarSet管理不同类型的sidecar容器。

SidecarSet在带来便利的同时，其实也带来了一些管理上面的成本，例如：Sidecar容器与业务app容器同时发布怎么办？Pod中container属于多个团队，那Pod的所属权到底属于谁？
所以，我们也希望能够与社区的更多开发者一起探索，同时也欢迎大家都能提供一些思路，共同繁荣K8S生态。

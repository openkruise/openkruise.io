---
title: Best Practice for Managing Log Collection Sidecar Containers
---

## Kubernetes Container Log Collection
As an indispensable part of any system, K8S [Official Documentation](https://kubernetes.io/docs/concepts/cluster-administration/logging/) also introduces various forms of log collection, summarizing the following three main types: **Native approach, DaemonSet approach and Sidecar approach**.
All three approaches have advantages and disadvantages, and none of them can perfectly solve 100% of the problems, so they have to be fitted according to the scenarios.

**The Sidecar approach deploys a separate logging agent for each POD**, which is relatively more resource intensive, but more flexible and multi-tenant isolated, and is recommended for large K8S clusters or clusters serving multiple business parties as PAAS platforms.

### EFK Architecture
EFK (ElasticSearch, FileBeat, Kibana) is a very popular and widely used log collection solution in the community, architecture as follows:
![k8s log sidecar](/img/docs/best-practices/k8s-log-sidecar.png)

### K8S Sidecar Model Disadvantage
As shown above, the FileBeat container is deployed in Sidecar mode in the same Pod as the business app container, and the logs are collected and uploaded to ElasticSearch by means of a shared volume, configuration as follows:
```yaml
  spec:
    containers:
    - name: nginx
      image: nginx:latest
      volumeMounts:
      # Share log directory with filebeat sidecar container via volumeMount
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

**Pod Sidecar Model:** By defining specialized containers in Pods to perform the auxiliary work required by business containers (e.g. log collection, traffic proxy).
Advantage: decoupling the auxiliary capacity from the business container, realizing independent release and capacity reuse.** But there are also some disadvantages, as follows:**
- **Business Pod contains (e.g. operation and maintenance, proxy) multiple sidecar containers**, increasing the complexity of Pod configuration and the learning cost of business developers.
- **Sidecar container upgrade will lead to business Pod rebuild**, and since Sidecar containers are generally the responsibility of independent middleware teams, there will be great business-side resistance if upgraded.

### A Powerful Tool for Sidecar Container Management
**SidecarSet is an abstract concept for sidecar container management in OpenKruise**, responsible for injecting and upgrading sidecar containers in k8s cluster, and is one of the core workloads of OpenKruise. For details, please refer to [SidecarSet Document](https://openkruise.io/docs/user-manuals/sidecarset/)
- **Automatic Injection Of Sidecar Container:** Decoupling sidecar container from business Pod configuration, simplifying business development usage cost and learning cost.
- **Upgrade Sidecar Container Independently:** No rebuilding Pod, upgrade Sidecar container alone, no feeling to business service.

## EFK + SidecarSet(FileBeat) Practice
### Install EFK (ElasticSearch, Kibana)
There is a lot of documentation in the community to install EFK, this article is mainly deployed by way of Helm, refer to [Elastic Helm Charts](https://github.com/elastic/helm-charts).
First of all, K8S cluster needs *StorageClass* for ElasticSearch PVC, this article uses the already created *alibabacloud-cnfs-nas*, as follows:
```shell
helm-charts% kubectl get storageclass
NAME                       PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
alibabacloud-cnfs-nas      nasplugin.csi.alibabacloud.com    Delete          Immediate              true                   6d2h
```

Helm deploy ElasticSearch, Kibana, as follows:
```shell
helm-charts% helm repo add elastic https://helm.elastic.co
helm-charts% helm repo update

## Install ElasticSearch，set storage-class is alibabacloud-cnfs-nas
helm-charts% helm install elasticsearch elastic/elasticsearch --version 7.16.3 --set persistence.annotations."volume.beta.kubernetes.io/storage-class"=alibabacloud-cnfs-nas -n elastic-system

## Install Kibana
helm-charts% helm install kibana elastic/kibana --version 7.16.3 --set service.type=LoadBalancer -n elastic-system
```

### FileBeat SidecarSet CRD
Create FileBeat configuration (the ConfigMap be created under business namespace), as follows:
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

FileBeat SidecarSet Configuration, as follows:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: filebeat-sidecarset
spec:
  selector:
    # Pod labels that need to be injected into the sidecar container
    matchLabels:
      kruise.io/inject-filebeat: "true"
  # sidecarSet is effective for the whole cluster by default, you can specify the scope of the effect through the namespace field
 #namespace: ns-xxx
  containers:
  - args:
    - -e
    - -E
    - http.enabled=true
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
    - mountPath: /usr/share/filebeat
      name: filebeat-config
    # Share log directory with app container via volumeMount
    - mountPath: /var/log
      name: log
    volumes:
    - configMap:
        name: filebeat-config
      name: filebeat-config
    - name: log
      emptyDir: {}
```
**For the scenario where machine resources are not sufficient, in order to reduce Pod resource requests, you can set sidecar container request.cpu=0. In this case, the Qos of Pod will be [Burstable](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-burstable).**

### Automatic Injection Of FileBeat Sidecar Container
Nginx Deployment, only contains nginx container configuration, as follows:
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
        # need injection filebeat sidecar label
        kruise.io/inject-filebeat: "true"
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        volumeMounts:
        # Share log directory with filebeat sidecar container via volumeMount
        - mountPath: /var/log/nginx
          name: log
      volumes:
      - name: log
        emptyDir: {}
```
**After applying the nginx deployment to the k8s cluster, it was found that the created Pods were injected with the filebeat sidecar container**, as follows:
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

### Upgrade FileBeat Sidecar Container Independently (Version 7.16.2 -> 7.16.3)
Below are two windows, and on the right is a client request to access the nginx service. At this point, after changing the image in filebeat sidecarSet from 7.16.2 to 7.16.3,
**we find that the Pod is not rebuilt. And the nginx service is not interrupted during the completion of filebeat sidecar container image upgrade 7.16.3 (the nginx service has only one Pod instance)**, as follows:

![k8s log sidecar](/img/docs/best-practices/update-sidecarset.gif)

This feature relies on the ability of [Kruise InPlace Update](https://openkruise.io/docs/next/core-concepts/inplace-update/).
However, upgrading sidecar independently comes with a risk, if the sidecar upgrade process fails, it will make Pod Not Ready and potentially affects the business, so SidecarSet itself provides rich progressive delivery capability to mitigate the risk.
Refer to [Kruise SidecarSet](https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5), as follows:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    # Maximum unavailable quantity
    maxUnavailable: 20%
    # Release in batches
    partition: 90
    # Canary release, via pod labels
    selector:
      matchLabels:
        # Some Pods contain canary labels,
        # or any other labels where a small number of pods can be selected
        deploy-env: canary
```
**In addition, if it is similar to the ServiceMesh Envoy Mesh Container, you need to use the SidecarSet hot upgrade feature,** Refer to [SidecarSet HotUpgrade](https://openkruise.io/docs/next/user-manuals/sidecarset#sidecar%E7%83%AD%E5%8D%87%E7%BA%A7%E7%89%B9%E6%80%A7).

### Argo-cd Deploy SidecarSet (Optional)
If you use Argo-cd to deploy Kruise SidecarSet, you need to configure [Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks).
According to this configuration, Argo-cd can implement SidecarSet Health Check, such as whether the SidecarSet is published or not, and whether the Pod ready, etc., as follows:
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
## Summary
Pod containing multiple containers will be more and more accepted by more and more developers, and thus the K8S ecosystem urgently needs a way to manage sidecar containers effectively.
Kruise SidecarSet is an exploration of sidecar container management, and there are many companies in the community using Kruise SidecarSet to manage different types of sidecar containers.

While SidecarSet brings convenience, it also brings some management costs, such as: what if the Sidecar container is released at the same time with the business app container, and who owns the Pod when the containers in the Pod belong to multiple teams?
Therefore, we also hope to explore with more developers in the community, and welcome everyone to provide some ideas to prosper the K8S ecology together.

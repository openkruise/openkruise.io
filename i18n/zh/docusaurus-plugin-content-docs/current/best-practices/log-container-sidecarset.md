---
title: 管理日志采集sidecar容器最佳实践
---

import logoImageUrl from '/img/docs/best-practices/log-sidecar-logo.jpg';

<p align="center">
  <img src={logoImageUrl} alt="logo" width="450"/>
</p>

## 摘要

在Kubernetes集群中使用Sidecar容器采集业务容器的可观测性数据是一种常见的数据采集部署方式，然而Sidecar容器对业务部署的侵入性和生命周期管理的复杂性使得这种部署模式的管理代价不仅高昂而且容易出错。本文对Sidecar采集容器管理的难点进行分析，使用OpenKruise提供的管理能力逐一解决，并以iLogtail为例给出基于OpenKruise管理可观测数据采集Sidecar容器的最佳实践。

## Sidecar部署方式的使用场景

可观测系统是IT系统的眼睛，在K8S的 [官方文档](https://kubernetes.io/docs/concepts/cluster-administration/logging/)中介绍了多种的可观测数据采集形式，总结起来主要有下述3种：原生方式、DaemonSet方式和Sidecar方式。 三种方式都有利有弊，没有哪种方式能够完美的解决100%问题的，所以要根据场景来贴合。其中Sidecar方式为每个Pod单独部署采集agent，相对资源占用较多，但稳定性、灵活性以及多租户隔离性较强，建议在Job类任务采集场景或作为PaaS平台为多个业务方服务的集群使用该方式。

import archImageUrl from '/img/docs/best-practices/log-sidecar-arch.jpg';

<p align="center">
  <img src={archImageUrl} alt="arch" width="450"/>
</p>

- 稳定性：Sidecar采集方式利用K8s同一个Pod内的容器可以共享存储和网络的特性，无容器发现过程。同时只要采集容器没有退出，共享存储卷上的文件就不会被删除，因此无论是业务容器的生命周期非常短或是日志采集出现延时的情况都可以保证采集数据的完整性。
- 灵活性：作为在每个Pod单独部署的Agent，为其分配多少资源、采集哪些数据都可以根据业务需求定制，甚至不同业务可以因不同采集需求而部署不同种类和版本的Agent。
- 多租户隔离性：各个Sidecar容器内部署的Agent仅能观测到各自Pod内的数据，无法获取其他租户的信息。Agent之间互相独立运行，当某个Agent崩溃或无法正常采集数据时，同节点上的其他Agent仍然可以正常工作。

## K8s Sidecar模式的痛点

使用K8s Sidecar模式采集业务可观测性数据需要修改业务的部署声明，将采集Agent容器与业务App容器部署在同一个Pod内，并通过共享Volume和网络使Agent可以采集数据并上传。如果要做到数据采集在任何情况下都不发生丢失，那么还需要确保Agent进程**在业务App进程启动前启动**、Agent进程**在App进程结束后退出**。对于Job类型的工作负载还需要考虑如何使Agent在App容器完成后**主动退出**的问题。因此，下面以[iLogtail](https://github.com/alibaba/ilogtail)作为采集Agent为例，给出通用的Sidecar采集部署配置。

[iLogtail](https://github.com/alibaba/ilogtail)是阿里云开源的一款高性能的轻量级可观测性数据采集Agent，支持多种Logs、Traces、Metrics可观测数据采集到Kafka、ElasicSearch、ClickHouse等多种下游中，其稳定性已在阿里巴巴以及数万阿里云客户生产中使用验证。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: nginx-mock
  namespace: default
spec:
  template:
    metadata:
      name: nginx-mock
    spec:
      restartPolicy: Never
      containers:
        - name: nginx
          image: registry.cn-hangzhou.aliyuncs.com/log-service/docker-log-test:latest
          command: ["/bin/sh", "-c"]
          args:
            - until [[ -f /tasksite/cornerstone ]]; do sleep 1; done;
              /bin/mock_log --log-type=nginx --path=/var/log/nginx/access.log --total-count=100;
              retcode=$?;
              touch /tasksite/tombstone;
              exit $retcode
              # 通知Sidecar容器业务完成，否则Sidecar不会随业务容器退出
          volumeMounts:
            # 通过volumeMounts与iLogtail sidecar容器共享 log 目录
            - mountPath: /var/log/nginx
              name: log
            # 通过volumeMounts与iLogtail sidecar容器通信进程状态
            - mountPath: /tasksite
              name: tasksite
        # iLogtail Sidecar
        - name: ilogtail
          image: sls-opensource-registry.cn-shanghai.cr.aliyuncs.com/ilogtail-community-edition/ilogtail:latest
          command: ["/bin/sh", "-c"]
          # 第一个`sleep 10`的目的是等待iLogtail开始采集。iLogtail可能需要等从远端成功拉取配置后才开始采集。
          # 第二个`sleep 10`的目的是等待iLogtail完成采集。直到iLogtail将所有收集数据发送给下游才算完成采集。
          args:
            # 通知业务容器Sidecar就绪
            - /usr/local/ilogtail/ilogtail_control.sh start;
              sleep 10;
              touch /tasksite/cornerstone;
              until [[ -f /tasksite/tombstone ]]; do sleep 1; done;
              sleep 10;
              /usr/local/ilogtail/ilogtail_control.sh stop;
          volumeMounts:
            - name: log
              mountPath: /var/log/nginx
            - name: tasksite
              mountPath: /tasksite
            - mountPath: /usr/local/ilogtail/ilogtail_config.json
              name: ilogtail-config
              subPath: ilogtail_config.json
      volumes:
        - name: log
          emptyDir: {}
        - name: tasksite
          emptyDir:
            medium: Memory
        - name: ilogtail-config
          secret:
            defaultMode: 420
            secretName: ilogtail-secret
```

配置中的volumeMounts部分声明了共享存储，其中name为log的用于共享数据，name为tasksite的用于进程协调。args部分大量代码用于控制Sidecar和业务容器间进程的启动及退出顺序。通过以上配置代码可以看到，Sidecar模式存在如下一些弊端：

- 业务Pod耦合（运维、代理）多种Sidecar容器，增加业务开发人员的学习成本。
- Pod中的多个Sidecar容器和业务需要考虑运行依赖关系，增加了配置的复杂性。
- Sidecar容器升级将导致业务Pod重建，由于Sidecar容器一般是独立的中间件团队负责，如果升级会存在极大的业务方阻力。

## OpenKruise管理Sidecar容器的利器[](https://openkruise.io/zh/docs/best-practices/log-container-sidecarset/#sidecarset%E7%AE%A1%E7%90%86sidecar%E5%AE%B9%E5%99%A8%E7%9A%84%E5%88%A9%E5%99%A8)

### SidecarSet

SidecarSet是OpenKruise中针对Sidecar容器管理抽象出来的概念，负责注入和升级K8s集群中的Sidecar容器，是OpenKruise的核心workload之一，详细可参考：[SidecarSet文档](https://openkruise.io/zh/docs/user-manuals/sidecarset/)。

- 自动注入Sidecar：将Sidecar容器配置与业务Workload（Deployment、CloneSet等）配置解耦，简化用户使用成本。
- 独立升级Sidecar容器：不重建Pod，单独升级Sidecar容器，对业务无感。

### Container Launch Priority

Container Launch Priority 提供了控制一个 Pod 中容器启动顺序的方法，详细可参考：[Container Launch Priority文档](https://openkruise.io/zh/docs/user-manuals/containerlaunchpriority)。

- 控制一个 Pod 中容器启动顺序：按声明中的顺序启动或根据自定义顺序启动，简化配置。

### Job Sidecar Terminator

对 Job 类型的 Workload 提供业务主容器完成任务并退出后，通知日志收集等 Sidecar 容器退出的能力，详细可参考：[Job Sidecar Terminator文档](https://openkruise.io/zh/docs/user-manuals/jobsidecarterminator)。

- 提供 Job Sidecar 主动退出能力：主容器退出后通知 Sidecar容器退出，从而使得 Job Controller 能够正确完成，简化配置。

## iLogtail Sidecar部署实践

社区中有很多应用iLogtail部署可观测方案的案例，参考[Kubernetes使用](https://github.com/alibaba/ilogtail/blob/main/docs/cn/installation/start-with-k8s.md)和[iLogtail社区版使用案例](https://github.com/alibaba/ilogtail/blob/main/docs/cn/awesome-ilogtail/use-cases.md)。本文聚焦如何使用OpenKruise的上述能力简化iLogtail Sidecar的管理，如果遇到iLogtail方面的问题请到[GitHub Discussions](https://github.com/alibaba/ilogtail/discussions)提问。

### OpenKruise Feature Gate

在kruise-controller-manager Deployment中启用SidecarTerminator特性，另外两项特性默认打开。

```yaml
    spec:
      containers:
        - args:
            - '--enable-leader-election'
            - '--metrics-addr=:8080'
            - '--health-probe-addr=:8000'
            - '--logtostderr=true'
            - '--leader-election-namespace=kruise-system'
            - '--v=4'
            - '--feature-gates=SidecarTerminator=true'
            - '--sync-period=0'
```

### iLogtail SidecarSet

在[ConfigServer开源版](https://github.com/alibaba/ilogtail/blob/main/docs/cn/config-server/quick-start.md)中创建iLogtail采集配置，如下：

```yaml
enable: true
inputs:
  - Type: file_log
    LogPath: /var/log/nginx
    FilePattern: access.log
flushers:
  - Type: flusher_kafka
    Brokers:
      - <kafka_host>:<kafka_port>
      - <kafka_host>:<kafka_port>
    Topic: nginx-access-log
```

关联到机器组

import agentGroupImageUrl from '/img/docs/best-practices/log-sidecar-agent-group.jpg';

<p align="center">
  <img src={agentGroupImageUrl} alt="agent-group" width="650"/>
</p>

定义iLogtail SidecarSet配置，如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: ilogtail-sidecarset
spec:
  selector:
    # 需要注入 sidecar 容器的 pod labels
    matchLabels:
      kruise.io/inject-ilogtail: "true"
  # SidecarSet默认是对整个集群生效，可以通过namespace字段指定生效的范围
  namespace: default
  containers:
    - command:
        - /bin/sh
        - '-c'
        - '/usr/local/ilogtail/ilogtail_control.sh start_and_block 10'
        # 参数10的目的是等待10秒数据发送完毕后退出
      image: sls-opensource-registry.cn-shanghai.cr.aliyuncs.com/ilogtail-community-edition/ilogtail:edge
      livenessProbe:
        exec:
          command:
            - /usr/local/ilogtail/ilogtail_control.sh
            - status
      name: ilogtail
      env:
        - name: KRUISE_CONTAINER_PRIORITY
          value: '100'
        - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT
          value: 'true'
        - name: ALIYUN_LOGTAIL_USER_DEFINED_ID
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: 'metadata.labels[''ilogtail-tag'']'
      volumeMounts:
        - mountPath: /var/log/nginx
          name: log
        - mountPath: /usr/local/ilogtail/checkpoint
          name: checkpoint
        - mountPath: /usr/local/ilogtail/ilogtail_config.json
          name: ilogtail-config
          subPath: ilogtail_config.json
  volumes:
    - name: log
      emptyDir: {}
    - name: checkpoint
      emptyDir: {}
    - name: ilogtail-config
      secret:
        defaultMode: 420
        secretName: ilogtail-secret
```

注意，此处仅写了livenessProbe，请勿使用readinessProbe，否则后续Sidecar容器升级时会导致Pod状态先变成Not Ready。

针对机器资源不太充足的场景，为减少Pod资源的申请，可以将Sidecar container request.cpu=0，此种情况下Pod的QoS将会是 [Burstable](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-burstable)。

### 自动注入iLogtail Sidecar容器[](https://openkruise.io/zh/docs/best-practices/log-container-sidecarset/#%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%85%A5filebeat-sidecar%E5%AE%B9%E5%99%A8)

定义Nginx Mock Job，只包含 nginx 相关配置，如下：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: nginx-mock
  namespace: default
spec:
  template:
    metadata:
      name: nginx-mock
      labels:
        # 注入 ilogtail sidecar 容器的label
        kruise.io/inject-ilogtail: "true"
    spec:
      restartPolicy: Never
      containers:
        - name: nginx
          image: registry.cn-hangzhou.aliyuncs.com/log-service/docker-log-test:latest
          command: ["/bin/sh", "-c"]
          args:
            - /bin/mock_log --log-type=nginx --path=/var/log/nginx/access.log --total-count=100
          volumeMounts:
          # 通过volumeMounts与iLogtail sidecar容器共享 log 目录
          - mountPath: /var/log/nginx
            name: log
      volumes:
        - name: log
          emptyDir: {}
        - name: tasksite
          emptyDir:
            medium: Memory
```

将Nginx Mock Job Apply到K8s集群后，发现创建的Pod都被注入了 iLogtail Sidecar 容器，说明kruise.io/inject-ilogtail: "true"起到了效果，如下：

![injection](/img/docs/best-practices/log-sidecar-injection.jpg)

若没有此项配置，将只有nginx container而没有ilogtail container。

通过查阅K8s事件可知，ilogtail container优先于nginx container创建，说明KRUISE_CONTAINER_PRIORITY起到了效果，如下：

![priority](/img/docs/best-practices/log-sidecar-priority.jpg)

若没有此项配置，ilogtail container可能晚于nginx container启动，导致采集数据不完整。

通过查阅K8s事件还可知，ilogtail container在nginx container完成后退出，说明KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT起到了效果，如下：

![exit](/img/docs/best-practices/log-sidecar-exit.jpg)

若没有此项配置，Pod将一直处于Running状态，因为Sidecar不会随业务容器退出，除非手动Delete Job。

以上两项Sidecar容器启动和退出的正确顺序保证了iLogtail采集数据的完整性。查询采集到Kafka的数据，从点位计算可知，数据采集完整，共100条（92-40+106-58=100），如下：

![kafka0](/img/docs/best-practices/log-sidecar-kafka0.jpg)
![kafka1](/img/docs/best-practices/log-sidecar-kafka1.jpg)

### 独立升级iLogtail Sidecar容器（edge -> latest）[](https://openkruise.io/zh/docs/best-practices/log-container-sidecarset#%E7%8B%AC%E7%AB%8B%E5%8D%87%E7%BA%A7filebeat-sidecar%E5%AE%B9%E5%99%A8version-7162---7163)

我们将上面iLogtail SidecarSet的配置更新为latest并apply。

```yaml
      image: sls-opensource-registry.cn-shanghai.cr.aliyuncs.com/ilogtail-community-edition/ilogtail:latest
```

通过K8s事件可以发现Pod并没有重建，ilogtail容器由于声明发生了变化进行了重建，而同时nginx容器并没有受影响中断。如下：

![inplace-upgrade](/img/docs/best-practices/log-sidecar-inplace-upgrade.jpg)

该特性依赖Kruise原地升级的能力实现，详情参考文档：[Kruise原地升级](https://openkruise.io/zh/docs/next/core-concepts/inplace-update/)。 不过独立升级sidecar容器也存在一定的风险性，如果sidecar容器升级过程中失败，则将导致Pod Not Ready，进而影响业务，因此SidecarSet本身提供了非常丰富的灰度发布能力来尽量规避该风险， 详情参考文档：[Kruise SidecarSet](https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5)，如下：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    # 升级策略
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

另外，如果是类似于ServiceMesh Envoy Mesh类容器则需要借助于SidecarSet热升级特性，详情请参考：[SidecarSet热升级](https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E7%83%AD%E5%8D%87%E7%BA%A7%E7%89%B9%E6%80%A7)。

### Argo-cd部署SidecarSet（Optional）[](https://openkruise.io/zh/docs/best-practices/log-container-sidecarset#argo-cd%E9%83%A8%E7%BD%B2sidecarsetoptional)

如果使用Argo-cd发布Kruise SidecarSet，则需要配置 [SidecarSet Custom CRD Health Checks](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks)。 Argo-cd根据该配置能够实现SidecarSet自定义资源的检查，如SidecarSet是否发布完成，以及Pod是否ready等，如下：

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

Pod包含多个container的方式将越来越被更多的开发者接受，进而K8S生态里面急需一种能够有效管理Sidecar容器的方式。 Kruise SidecarSet、Container Launch Priority、Job Sidecar Terminator等功能是在Sidecar容器管理上面的一些探索，

使用OpenKruise管理iLogtail日志采集大幅降低了管理Sidecar的难度，解耦了Sidecar和业务容器的配置，使得容器间的启动顺序维护变得清晰，并且支持不重建Pod更新Sidecar容器。但是我们也看到比如Sidecar容器应该分配多少资源、日志路径挂载如何规划、不同业务Pod中的Sidecar的配置如何区分等问题并没有完全解决。 所以，我们也希望能够与社区的更多开发者一起探索，同时也欢迎大家都能提供一些思路，共同繁荣K8S生态。

OpenKruise社区：<https://github.com/openkruise/kruise#community>

iLogtail社区：<https://github.com/alibaba/ilogtail#contact-us>

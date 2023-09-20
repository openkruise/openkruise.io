---
title: PodProbeMarker
---
**FEATURE STATE:** Kruise v1.3.0

Kubernetes提供了三种默认的Pod生命周期管理：
- **Readiness Probe** 用来判断业务容器是否已经准备好响应用户请求，如果检查失败，会将该Pod从Service Endpoints中剔除。
- **Liveness Probe** 用来判断容器的健康状态，如果检查失败，kubelet将会重启该容器。
- **Startup Probe** 用来判断容器是否启动完成，如果定义了该Probe，那么Readiness Probe与Liveness Probe将会在它成功之后再执行。

所以Kubernetes中提供的Probe能力都已经限定了特定的语义以及相关的行为。**除此之外，其实还是存在自定义Probe语义以及相关行为的需求**，例如：
- **GameServer定义 Idle Probe 用来判断该Pod当前是否存在游戏对局**，如果没有，从成本优化的角度，可以将该Pod缩容掉。
- **K8S Operator定义 main-secondary Probe 来判断当前Pod的角色（main or secondary）**，升级的时候，可以优先升级 secondary，进而达到升级过程只有一次选主的行为，降低升级过程中服务抖动时间。

OpenKruise提供了自定义Probe的能力，并将结果返回到Pod Status中，用户可以根据该结果决定后续的行为。

## Feature-gate
PodProbeMarker能力默认是关闭的, 你可以通过 feature-gate *PodProbeMarkerGate* 打开，如下：

```bash
$ helm install kruise https://... --set featureGates="PodProbeMarkerGate=true"
```

## Usage
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: PodProbeMarker
metadata:
  name: game-server-probe
  namespace: ns
spec:
  selector:
    matchLabels:
      app: game-server
  probes:
  - name: Idle
    containerName: game-server
    probe:
      exec: 
        command:
        - /home/game/idle.sh      
      initialDelaySeconds: 10
      timeoutSeconds: 3
      periodSeconds: 10
      successThreshold: 1
      failureThreshold: 3
    markerPolicy:
    - state: Succeeded
      labels:
        gameserver-idle: 'true'
      annotations:
        controller.kubernetes.io/pod-deletion-cost: '-10'
    - state: Failed
      labels:
        gameserver-idle: 'false'
      annotations:
        controller.kubernetes.io/pod-deletion-cost: '10'
    podConditionType: game.io/idle
```

- **spec.selector**: 根据Label选择匹配的Pods，MatchLabels和MatchExpressions都支持。详情请参考：https://kubernetes.io/docs/concepts/overview/working-with-objects/labels。
定义后，该selector不允许修改。
- spec.probes
  - **name**: probe名字，需要在Pod内是唯一的，哪怕不同的容器之间也需要唯一
  - **containerName**: 执行probe的容器
  - **probe**: probe相关的API定义，与原生K8S probe一致（当前只支持 Exec）。详情请参考：https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes
  - **markerPolicy**: 根据Probe执行结果（Succeeded或Failed），在Pod上面打特定的Labels和Annotations。
    - state: probe结果，Succeeded 或 Failed
    - labels: 如果结果满足，打 labels 到Pod上
    - annotations: 如果结果满足，打 annotations 到Pod上
  - **podConditionType**: 将Probe执行结果（Succeeded或Failed）保存到pod condition上。如果该字段为空，probe执行结果将不会同步到pod condition。

**注意：** 如果只定义了一种Marker Policy策略，例如：只定义了 State=Succeeded，Patch Labels[healthy]='true'。当Probe执行成功时，将会Patch Label[healthy]='true' 到Pod上。当Probe执行失败时，Label[healthy]将会被删除。

## How to view Probe results?
### Pod Status Conditions
如果用户定义了podConditionType，将Probe执行结果（Succeeded或Failed）保存到pod condition上，其中**condition.type=podConditionType**，具体如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: game-server
  name: game-server-58cb9f5688-7sbd8
  namespace: ns
...
status:
  conditions:
    # podConditionType
  - type: game.io/idle
    # Probe State 'Succeeded' indicates 'True', and 'Failed' indicates 'False'
    status: "True"
    lastProbeTime: "2022-09-09T07:13:04Z"
    lastTransitionTime: "2022-09-09T07:13:04Z"
    # If the probe fails to execute, the message is stderr
    message: ""
```
该种方式可以与Kubernetes [Readiness Gate](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)结合使用，达到灵活控制Pod是否Ready的效果。

### Pod Metadata
如果用户定义了 MarkerPolicy，OpenKruise将会Patch特定的Metadata到Pod上，如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: game-server
    gameserver-idle: 'true'
  annotations:
    controller.kubernetes.io/pod-deletion-cost: '-10'
  name: game-server-58cb9f5688-7sbd8
  namespace: ns
```
OpenKruise [CloneSet](https://openkruise.io/docs/user-manuals/cloneset#update-sequence) 与
[Advanced StatefulSet](https://openkruise.io/docs/user-manuals/advancedstatefulset#update-sequence) 都支持根据Pod Label控制升级优先级的能力。
与此同时，社区原生Deployment与Kruise CloneSet也支持基于 [Deletion Cost](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost) 的缩容优先级以及升级顺序。
所以Custom Probe MarkerPolicy可以与上面能力相结合，达到缩容或升级优先级的效果。

### Pod Event
通过pod event可以查看历史的probe执行结果，如下：
```
$ kubectl describe pods -n ns game-server-58cb9f5688-7sbd8
Events:
  Type    Reason                Age                From                         Message
  ----    ------                ----               ----                         -------
  Normal  KruiseProbeFailed     37s (x2 over 47s)  kruise-daemon-podprobe
  Normal  KruiseProbeSucceeded  36s (x2 over 37s)  kruise-daemon-podprobe
```

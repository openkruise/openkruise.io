---
title: PodProbeMarker
---
**FEATURE STATE:** Kruise v1.3.0

Kubernetes provides three Pod lifecycle management:
- **Readiness Probe** Used to determine whether the business container is ready to respond to user requests. If the probe fails, the Pod will be removed from Service Endpoints.
- **Liveness Probe** Used to determine the health status of the container. If the probe fails, the kubelet will restart the container.
- **Startup Probe** Used to know when a container application has started. If such a probe is configured, it disables liveness and readiness checks until it succeeds.

So the Probe capabilities provided in Kubernetes have defined specific semantics and related behaviors.
**In addition, there is actually a need to customize Probe semantics and related behaviors**, such as:
- **GameServer defines Idle Probe to determine whether the Pod currently has a game match**, if not, from the perspective of cost optimization, the Pod can be scaled down.
- **K8S Operator defines the main-secondary probe to determine the role of the current Pod (main or secondary)**. When upgrading, the secondary can be upgraded first,
so as to achieve the behavior of selecting the main only once during the upgrade process, reducing the service interruption time during the upgrade process.

OpenKruise provides the ability to customize the Probe and return the result to the Pod Status, and the user can decide the follow-up behavior based on the probe result.

## Feature-gate
PodProbeMarker feature is turned on by default, if you want to turn it off set feature-gate *PodProbeMarkerGate*.

```bash
$ helm install kruise https://... --set featureGates="PodProbeMarkerGate=false"
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

- **spec.selector**: Select matching Pods based on Labels, both MatchLabels and MatchExpressions are supported. For details, please refer to: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels.
Once specified, selector cannot be changed for a PodProbeMarker.
- spec.probes
  - **name**: The probe name needs to be unique within the Pod and between different containers
  - **containerName**: The container that executes the probe
  - **probe**: The API definition related to probe is consistent with the native K8S probe (currently only Exec and tcpSocket is supported). For details, please refer to: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes
  - **markerPolicy**: According to the Probe execution result (Succeeded or Failed), patch specific Labels and Annotations to the Pod.
    - state: probe result, Succeeded or Failed
    - labels: If the result is satisfied, patch labels to the Pod
    - annotations: If the result is satisfied, patch annotations to the Pod
  - **podConditionType**: Save the Probe execution result (Succeeded or Failed) to the pod condition. When probe is Succeeded, pod.status.condition.status=True.
Otherwise, when the probe fails to execute, pod.status.condition.status=False. When podConditionType is empty, probe execution result will not be saved to pod condition.

**Note:** If only one Marker Policy is defined, for example: only define State=Succeeded, Patch Labels[healthy]='true'. When the probe execution success, kruise will patch labels[healthy]='true' to pod.
And when the probe execution fails, Label[healthy] will be deleted.

### Support TcpSocket Probe

**FEATURE STATE:** Kruise v1.6.0

With this configuration, the kruise-daemon will attempt to open a socket to your container on the specified port. If it can establish a connection,
the probe is considered `Succeeded`, if it can't it is considered `Failed`. For example:

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
      tcpSocket:
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 10
```

### Support for Serverless Scenarios

**FEATURE STATE:** Kruise v1.8.0

#### Background

Before Kruise v1.8.0, the probing capabilities of `PodProbeMarker` relied on the `Kruise Daemon` component for implementation.
For typical scenarios such as deploying OKG using serverless resources, Kruise v1.8.0 introduced an extended protocol to support `PodProbeMarker` in serverless environments.

> **Note**: Different serverless container service providers may have varying levels of support for `PodProbeMarker`. Please consult the respective provider for details on their protocol support.

Kruise welcome contributions to the list of providers that support this protocol:
- Alibaba Cloud Container Service [ACS](https://www.aliyun.com/product/acs)

#### Protocol Overview

The ability to use `PodProbeMarker` in serverless environments is disabled by default. You can enable it via the feature-gate *EnablePodProbeMarkerOnServerless*, as shown below:

```shell
helm install kruise https://... --set featureGates="PodProbeMarkerGate=true,EnablePodProbeMarkerOnServerless=true"
```

This feature defines an interaction protocol for `PodProbeMarker` in serverless scenarios:

1. `Kruise-manager` adds the required probes to the serverless Pod using the annotation `kruise.io/podprobe`.
2. The specific implementation of the serverless PodProbeMarker needs to read the probe information from the annotation `kruise.io/podprobe`, execute the probe, and write the results to `.status.conditions[x]` of the Pod.
3. `Kruise-manager` identifies the probe execution results from `.status.conditions[x]` of the serverless Pod and performs the marking operations defined in the `markerPolicy`.

Refer to the example below:
```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    # Records the probes that need to be performed on this Pod
    kruise.io/podprobe: |
      [
      	{
          "containerName": "minecraft",
          "name": "healthy",
          "podConditionType": "game.kruise.io/healthy",
          "probe": {
              "exec": {
                  "command": [
                      "bash",
                      "/data/probe.sh"
                  ]
              }
          }
      	}
      ]
...
status:
  conditions:
  # The result of the probe is recorded in .status.conditions, with type as
  - type: game.kruise.io/healthy
    # Probe State 'Succeeded' indicates 'True', and 'Failed' indicates 'False'
    status: "True"
    lastProbeTime: "2025-03-25T07:13:04Z"
    lastTransitionTime: "2025-03-25T07:13:04Z"
    # If the probe fails to execute, the message is stderr
    message: ""
```

## How to view Probe results?
### Pod Status Conditions
If podConditionType is defined, the probe result will be saved to the pod condition, where **condition.type=podConditionType**, as follows:

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
This method can be used in combination with Kubernetes [Readiness Gate](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate) to flexibly control whether the Pod is Ready.

### Pod Metadata
If the user defines the MarkerPolicy, OpenKruise will patch the specific Metadata to the Pod, as follows:

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
OpenKruise [CloneSet](https://openkruise.io/docs/user-manuals/cloneset#update-sequence) and [Advanced StatefulSet](https://openkruise.io/docs/user-manuals/advancedstatefulset#update-sequence)
support the ability to control upgrade priorities based on Pod Labels. At the same time, community-native Deployment and Kruise CloneSet also support scaling down priority and upgrade order based on [Deletion Cost](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost).
Therefore, the Custom Probe MarkerPolicy can be combined with the above capabilities to achieve the effect of scaling down or upgrading the priority.

### Pod Event
Through the pod event, you can view the historical probe execution results, as follows:
```
$ kubectl describe pods -n ns game-server-58cb9f5688-7sbd8
Events:
  Type    Reason                Age                From                         Message
  ----    ------                ----               ----                         -------
  Normal  KruiseProbeFailed     37s (x2 over 47s)  kruise-daemon-podprobe
  Normal  KruiseProbeSucceeded  36s (x2 over 37s)  kruise-daemon-podprobe
```

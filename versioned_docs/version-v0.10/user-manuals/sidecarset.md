---
title: SidecarSet
---

This controller leverages the admission webhook to automatically
inject a sidecar container for every selected Pod when the Pod is created. The Sidecar
injection process is similar to the automatic sidecar injection mechanism used in
[istio](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/).

Besides injection during Pod creation, SidecarSet controller also provides
additional capabilities such as in-place Sidecar container image upgrade, mounting Sidecar volumes, etc.
Basically, SidecarSet decouples the Sidecar container lifecycle
management from the main container lifecycle management.

The SidecarSet is preferable for managing stateless sidecar containers such as
monitoring tools or operation agents.

## Example

### Create SidecarSet

The `sidecarset.yaml` file below describes a SidecarSet that contains a sidecar container named `sidecar1`:
```yaml
# sidecarset.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  selector:
    matchLabels:
      app: nginx
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 1
  containers:
  - name: sidecar1
    image: centos:6.7
    command: ["sleep", "999d"] # do nothing at all
    volumeMounts:
    - name: log-volume
      mountPath: /var/log
  volumes: # this field will be merged into pod.spec.volumes
  - name: log-volume
    emptyDir: {}
```
Create a SidecarSet based on the YAML file:
```bash
kubectl apply -f sidecarset.yaml
```

### Create a Pod
Create a pod that matches the sidecarset's selector:
```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: nginx # matches the SidecarSet's selector
  name: test-pod
spec:
  containers:
  - name: app
    image: nginx:1.15.1
```
Create this pod and now you will find it's injected with `sidecar1`:
```bash
$ kubectl get pod
NAME       READY   STATUS    RESTARTS   AGE
test-pod   2/2     Running   0          118s
```
In the meantime, the SidecarSet status updated:
```bash
$ kubectl get sidecarset test-sidecarset -o yaml | grep -A4 status
status:
  matchedPods: 1
  observedGeneration: 1
  readyPods: 1
  updatedPods: 1
```
### update sidecar container Image
update sidecarSet's sidecar container image=centos:7
```bash
$ kubectl edit sidecarsets test-sidecarset

# sidecarset.yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  containers:
    - name: sidecar1
      image: centos:7
```
The Sidecar container in the pod has been updated to centos:7, and the pod and other containers have not been restarted.
```bash
$ kubectl get pods |grep test-pod
test-pod                            2/2     Running   1          7m34s

$ kubectl get pods test-pod -o yaml |grep 'image: centos'
    image: centos:7

$ kubectl describe pods test-pod
Events:
  Type    Reason     Age                 From               Message
  ----    ------     ----                ----               -------
  Normal  Killing    5m47s               kubelet            Container sidecar1 definition changed, will be restarted
  Normal  Pulling    5m17s               kubelet            Pulling image "centos:7"
  Normal  Created    5m5s (x2 over 12m)  kubelet            Created container sidecar1
  Normal  Started    5m5s (x2 over 12m)  kubelet            Started container sidecar1
  Normal  Pulled     5m5s                kubelet            Successfully pulled image "centos:7"
```
## SidecarSet features
A sample SidecarSet yaml looks like following:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  selector:
    matchLabels:
      app: sample
  containers:
  - name: nginx
    image: nginx:alpine
  initContainers:
  - name: init-container
    image: busybox:latest
    command: [ "/bin/sh", "-c", "sleep 5 && echo 'init container success'" ]
  updateStrategy:
    type: RollingUpdate
  namespace: ns-1
```
- spec.selector Select the POD that needs to be injected and updated by Label. MatchLabels and MatchExpressions are supported. Please refer to the details: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
- spec.containers Define pod.spec.containers[x] that need to be injected and updated, supporting the full K8S Container field. Please refer to the details: https://kubernetes.io/docs/concepts/containers/
- spec.initContainers Define the pod.spec.initContainers[x] you need to inject, supporting the full K8S InitContainer field. Please refer to the details：https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
    - We will inject those containers by their name in ascending order
    - InitContainers only support injection and do not support POD in-place update
- spec.updateStrategy sidecarSet update strategy, type indicates the upgrade method:
    - NotUpdate No updates, in this type only inject sidecar containers in pod
    - RollingUpdate Injection and rolling update, which contains a rich update strategy, will be described in more detail later
- spec.namespace By default, sidecarset is cluster scope in k8s, that is, for all namespaces (except kube-system, kube-public). When spec.namespace field set, it only applies to pods of that namespace

### sidecar container injection
The injection of sidecar containers happens at Pod creation time and only Pod spec is updated. The workload template spec will not be updated.
In addition to the default K8s Container field, the following fields have been extended to injection:
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  selector:
    matchLabels:
      app: sample
  containers:
    # default K8s Container fields
  - name: nginx
    image: nginx:alpine
    volumeMounts:
    - mountPath: /nginx/conf
      name: nginx.conf
    # extended sidecar container fields
    podInjectPolicy: BeforeAppContainer
    shareVolumePolicy:
      type: disabled | enabled
    transferEnv:
    - sourceContainerName: main
      envName: PROXY_IP    
  volumes:
  - Name: nginx.conf
    hostPath: /data/nginx/conf
```
- podInjectPolicy Define where Containers are injected into pod.spec.containers
    - BeforeAppContainer(default) Inject into the front of the original pod containers
    - AfterAppContainer Inject into the backend of the original pod containers
- data volume sharing
    - Share specific volumes: Use spec.volumes to define the volumes needed by Sidecar itself. See details：https://kubernetes.io/docs/concepts/storage/volumes/
    - Share pod containers volumes: If ShareVolumePolicy.type is enabled, the sidecar container will share the other container's VolumeMounts in the pod(don't contains the injected sidecar container)
- Environment variable sharing
    - Environment variables can be fetched from another container through spec.containers[x].transferenv, and the environment variable named envName from the container named sourceContainerName is copied to this container

#### injection pause
**FEATURE STATE:** Kruise v0.10.0

For existing SidecarSets，users can pause sidecar injection by setting `spec.injectionStrategy.paused=true`：
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ... ...
  injectionStrategy:
    paused: true
```
This feature only works on the newly-created Pods, and has no impact on the sidecar containers that have been injected.

#### imagePullSecrets
**FEATURE STATE:** Kruise v0.10.0

Users can use private images in SidecarSet by configuring [spec.imagePullSecrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).
SidecarSet will inject it in to Pods at injection stage.
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  ... ....
  imagePullSecrets:
  - name: my-secret
```
**Note**: Users must ensure that the corresponding Secrets have already existed in the namespaces where Pods need to pull the private images. Otherwise, pulling private images will not succeed.

### sidecarset update strategy
Sidecarset not only supports the in-place update of Sidecar container, but also provides a very rich upgrade strategy.
#### partition
Partition is the **desired number or percent of Pods in old revisions**, defaults to `0`.  This field does **NOT** imply any update order.

When `partition` is set during update:

- If it is a number: `(replicas - partition)` number of pods will be updated with the new version.
- If it is a percent: `(replicas * (100% - partition))` number of pods will be updated with the new version.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    partition: 90
```
Assuming that the number of PODs associated with this Sidecarset is 100, this upgrade will only upgrade 10 pods to latest and keep 90 pods old versions.

#### MaxUnavailable
MaxUnavailable is the maximum number of PODs that are unavailable at the same time that is guaranteed during the Posting process. The default value is 1.

The user can set it to either an absolute value or a percentage (the percentage is calculated by the controller as the cardinality of the selected pod to calculate the absolute value behind one).
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 20%
```
Note that maxUnavailable and partition are not necessarily related. For example:
- When {matched pod}=100,partition=50,maxUnavailable=10, the controller will update 50 PODS to the new version, and only 10 PODS will be updated at the same time, until the 50 updated is completed.
- When {matched pod}=100,partition=80,maxUnavailable=30, the controller will update 20 PODS to the new version, because the maxUnavailable number is 30, so the 20 PODS will be updated simultaneously.

#### Pause
A user can pause the release by setting pause to true, and the injection capability will remain for newly created, expanded PODS, while updated PODS will remain the updated version, and those that have not been updated will be paused.
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    paused: true
```

#### Selector
For businesses that have Canary update requirements, this can be done through Strategy.selector filed. First: take the canary updated pods on fixed labels [canary. Release] = true, second fix the strategy.selector.MatchLabels to select the pod
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    selector:
      matchLabels:
      - canary.release: true
```

### sidecarset update order
- The PODs of upgrade is sorted by default to ensure the same order of multiple upgrades
- The default priority is (the smaller the higher the priority)： unscheduled < scheduled, pending < unknown < running, not-ready < ready, newer pods < older pods
- scatter order

#### scatter
The scatter policy allows users to define the scatters of PODs that conform to certain tags throughout the publishing process. 
For example, if a SidecarSet manages 10 PODS, if there are 3 PODS below with the tag foo=bar, and the user sets this tag in the shatter policy, then these 3 PODS will be published in the 1st, 6th, and 10th positions.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: sidecarset
spec:
  # ...
  updateStrategy:
    type: RollingUpdate
    scatterStrategy:
    - key: foo
      value: bar
```
**Note: If you use Scatter, it is recommended to set only a pair of key-values for scatter. It will be easier to understand.**

### Hot Upgrade Sidecar
**FEATURE STATE:** Kruise v0.9.0

SidecarSet's in-place upgrade will stop the container of old version first and then create the container of new version. Such method is more suitable for sidecar containers that cannot affects service availability, e.g. logging collector.

But for many proxy or runtime sidecar containers, e.g. Istio Envoy, this upgrade method is problematic. Envoy, as a proxy container in the Pod, proxies all the traffic, and if restarted directly, the availability of service is affected. Complex grace termination and coordination is required if one need to upgrade envoy sidecar independently of the application container. So we provide a new solution for such sidecar container upgrade.

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: hotupgrade-sidecarset
spec:
  selector:
    matchLabels:
      app: hotupgrade
  containers:
  - name: sidecar
    image: openkruise/hotupgrade-sample:sidecarv1
    imagePullPolicy: Always
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - /migrate.sh
    upgradeStrategy:
      upgradeType: HotUpgrade
      hotUpgradeEmptyImage: openkruise/hotupgrade-sample:empty
```
- upgradeType: HotUpgrade indicates hot upgrade for stateful sidecar container.
- hotUpgradeEmptyImage: when upgradeType=HotUpgrade, user needs to provide an empty container for hot upgrades. hotUpgradeEmptyImage has the same configuration as the sidecar container, for example: command, lifecycle, probe, etc, but it doesn't do anything.        
- lifecycle.postStart: State Migration, the process completes the state migration of stateful container, which needs to be provided by the sidecar image developer.

Hot upgrade consists of the following two processes:
- inject hot upgrade sidecar containers
- in-place hot upgrade sidecar container

#### Inject Containers

When the sidecar container upgradeStrategy=HotUpgrade, the SidecarSet Webhook will inject two containers into the Pod:
1. {sidecarContainer.name}-1: as shown in the figure below: envoy-1, the container run the actual working sidecar container, such as envoy:1.16.0
2. {sidecarContainer.name}-2: as shown in the figure below: envoy-2, the container run the hot upgrade empty container, and it doesn't have to deal with any real logic, as long as it stays in place, such as empty:1.0

![sidecarset hotupgrade_injection](/img/docs/user-manuals/sidecarset_hotupgrade_injection.png)

#### Hot Upgrade

The SidecarSet Controller breaks down the hot upgrade pgrocess of the sidecar container into three steps:
1. Upgrade: upgrade the empty container to the new version of the sidecar container, such as envoy-2.Image = envoy:1.17.0
2. Migration: the process completes the state migration of stateful container, which needs to be provided by the sidecar image developer. PostStartHook completes the migration of the above process.
(**Note: PostStartHook must block during the migration, and exit when migration complete.**)
3. Reset: the step resets the old version sidecar container into empty container, such as envoy-1.Image = empty:1.0

The above is the complete hot upgrade process. If a Pod needs to be hot upgraded several times, the above three steps can be repeated.

![sidecarset hotupgrade](/img/docs/user-manuals/sidecarset_hotupgrade.png)

#### Migration Demo
The SidecarSet hot upgrade mechanism not only completes the switching between mesh containers，but also provides a coordination mechanism for old and new versions. Yet this is only the first step of a long journey. The mesh container also needs to provide a PostStartHook script to complete the hot migration of the mesh service itself (the above Migration process), such as Envoy hot restart and Mosn lossless restart.
To facilitate a better understanding of the Migration process, a migration demo is provided below the kruise repository: [Migration Demo](https://github.com/openkruise/samples/tree/master/hotupgrade)

For design documentation, please refer to: [proposals sidecarset hot upgrade](https://github.com/openkruise/kruise/blob/master/docs/proposals/20210305-sidecarset-hotupgrade.md)

Currently known cases that utilize the SidecarSet hot upgrade mechanism:
- [ALIYUN ASM](https://help.aliyun.com/document_detail/193804.html) implements lossless upgrade of Data Plane in Service Mesh.

### SidecarSet Status
When upgrading sidecar containers with a SidecarSet, you can observe the process of upgrading through SidecarSet.Status
```yaml
# kubectl describe sidecarsets sidecarset-example
Name:         sidecarset-example
Kind:         SidecarSet
Status:
  Matched Pods:         10  # The number of PODs injected and managed by the Sidecarset
  Updated Pods:         5   # 5 PODs have been updated to the container version in the latest SidecarSet
  Ready Pods:           8   # Matched Pods pod.status.condition.Ready = true number
  Updated Ready Pods:   3   # Updated Pods && Ready Pods number
```

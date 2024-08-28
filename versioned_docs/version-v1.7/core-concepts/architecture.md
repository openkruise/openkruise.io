---
title: Architecture
---

The overall architecture of OpenKruise is shown as below:

![alt](/img/docs/core-concepts/architecture.png)

## API

All features provided by OpenKruise are following **Kubernetes API**, including:

- CRD definition, such as

```shell script
$ kubectl get crd | grep kruise.io
advancedcronjobs.apps.kruise.io            2021-09-16T06:02:36Z
broadcastjobs.apps.kruise.io               2021-09-16T06:02:36Z
clonesets.apps.kruise.io                   2021-09-16T06:02:36Z
containerrecreaterequests.apps.kruise.io   2021-09-16T06:02:36Z
daemonsets.apps.kruise.io                  2021-09-16T06:02:36Z
imagepulljobs.apps.kruise.io               2021-09-16T06:02:36Z
nodeimages.apps.kruise.io                  2021-09-16T06:02:36Z
podunavailablebudgets.policy.kruise.io     2021-09-16T06:02:36Z
resourcedistributions.apps.kruise.io       2021-09-16T06:02:36Z
sidecarsets.apps.kruise.io                 2021-09-16T06:02:36Z
statefulsets.apps.kruise.io                2021-09-16T06:02:36Z
uniteddeployments.apps.kruise.io           2021-09-16T06:02:37Z
workloadspreads.apps.kruise.io             2021-09-16T06:02:37Z
# ...
```

- Specific identities (e.g. labels, annotations, envs) in resources, such as

```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    # To protect pods in this namespace from cascading deletion.
    policy.kruise.io/delete-protection: Cascading
```

## Manager

Kruise-manager is a control plane component that runs controllers and webhooks, it is deployed by a Deployment in `kruise-system` namespace.

```bash
$ kubectl get deploy -n kruise-system
NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
kruise-controller-manager   2/2     2            2           4h6m

$ kubectl get pod -n kruise-system -l control-plane=controller-manager
NAME                                         READY   STATUS    RESTARTS   AGE
kruise-controller-manager-68dc6d87cc-k9vg8   1/1     Running   0          4h6m
kruise-controller-manager-68dc6d87cc-w7x82   1/1     Running   0          4h6m
```

<!-- It can be deployed as multiple replicas with Deployment, but only one of them could become leader and start working, others will keep retrying to acquire the lock. -->

Logically, each controller like cloneset-controller or sidecarset-controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in the `kruise-controller-manager-xxx` single Pod.

Besides controllers, this Pod also contains the admission webhooks for Kruise CRDs and Pod. It creates webhook configurations to configure which resources should be handled, and provides a Service for kube-apiserver calling.

```bash
$ kubectl get svc -n kruise-system
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kruise-webhook-service   ClusterIP   172.24.9.234   <none>        443/TCP   4h9m
```

The `kruise-webhook-service` is much important for kube-apiserver calling.

## Daemon

This is a new daemon component released since Kruise v0.8.0 version.

It is deployed by DaemonSet, runs on every node and manages things like image pre-download, container restarting.

```bash
$ kubectl get pod -n kruise-system -l control-plane=daemon
NAME                  READY   STATUS    RESTARTS   AGE
kruise-daemon-6hw6d   1/1     Running   0          4h7m
kruise-daemon-d7xr4   1/1     Running   0          4h7m
kruise-daemon-dqp8z   1/1     Running   0          4h7m
kruise-daemon-dv96r   1/1     Running   0          4h7m
kruise-daemon-q7594   1/1     Running   0          4h7m
kruise-daemon-vnsbw   1/1     Running   0          4h7m
```

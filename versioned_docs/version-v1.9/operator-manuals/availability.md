---
title: High availability
---

# Overview
the kruise control-plane kruise-manager has two components: webhook and controller. The webhook is replicated and the traffic is balanced over the replicas using cluster ip service. The controller is main-secondary architecture, and the main instance is leader elected. In the default installation, the webhook is colocated with the controller. However, it is also possible to deploy the webhook and controller independently. 

# How to recover from application abnormal

Entrypoint of the kruise-manager container is the process of kruise-manager, so any panic or oom will restart the container. The readiness probe of kruise-manager will detect whether webhook credential is ready and whether webhook server is reachable, so if the webhook server is not responsive, the traffic will be routed away from the non-responsive kruise-manager instance. The controller component of kruise-manager will periodically update the lease for leader election, if the leader controller panic or hang, other healthy instance of kruise-manager can become the new leader and continue the reconciliation.    

# How to recover from node/zone failure

The kruise-manager instances are scheduled into different nodes prior to 1.8, so that the kruise-manager can tolerate single node failure. After 1.8 the instances are scheduled into different availability zone, so that the kruise-manager can tolerate failure of single availability zone. Note that the topology information may not exist in some bare-metal nodes in the on-prem environment, please add the topology key to the nodes if you want to avoid zone failure. In addition, the topology spread configuration is not required and one can change the `whenUnsatisfiable` to `DoNotSchedule` if strong spread is required.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    control-plane: controller-manager
  name: kruise-controller-manager
spec:
  template:
    spec:
      topologySpreadConstraints:
      - labelSelector:
          matchLabels:
            control-plane: controller-manager
        matchLabelKeys:
        - pod-template-hash
        maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable:  ScheduleAnyway # change to whenUnsatisfiable if strong spread is required.
...
``` 

# How to avoid cyclic dependency problem

kruise-manager contains a webhook for pod, and failure in kruise-manager will block pod creation. To avoid cyclic dependency problem, kruise-manager itself use host network, so that kruise-manager will not rely on any network component. In addition, the webhook of kruise-manager will skip the pod admission in kube-system namespace which are the default installation namespace of common system component, and the namespace where kruise-manager itself are deployed. Note that without the webhook function, some OpenKruise function will not work correctly e.g. SidecarSet and WorkloadSpread. 

# How to avoid failure during component update

To ensure maximum availability during component rollout, kruise-manager always try to create 100% replicas of new pods, and wait for these replicas to be ready before delete the old replicas. Note that these strategy may be problematic if the resource for deployment is not enough. One can adjust the deployment strategy and reduce the value of maxSurge in such case.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    control-plane: controller-manager
  name: kruise-controller-manager
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 100% # reduce maxSurge if the resource for deployment is not adequate
  ...
```



# Gameservers Scale
## The horizontal scaling feature of OpenKruiseGame

### Sequence of scale-down

OpenKruiseGame allows you to set the states of game servers. You can manually set the value of opsState or DeletionPriority for a game server. You can also use the service quality feature to automatically set the value of opsState or DeletionPriority for a game server. During scale-in, a proper GameServerSet workload is selected for scale-down based on the states of game servers. The scale-down rules are as follows:

1. Scale-down game servers based on the opsState values. Scale-down the game servers for which the opsState values are `WaitToBeDeleted`, `None`, and `Maintaining` in sequence.

2. If two or more game servers have the same opsState value, game servers are scaled-down based on the values of DeletionPriority. The game server with the largest DeletionPriority value is deleted first.

3. If two or multiple game servers have the same opsState value and DeletionPriority value, the game server whose name contains the largest sequence number in the end is deleted first.

#### Examples

Deploy a game server with five replicas:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 5
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
EOF
```

Five game servers are generated:

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

Set DeletionPriority to 10 for minecraft-2:

```bash
kubectl edit gs minecraft-2

...
spec:
  DeletionPriority: 10 # Change the value of DeletionPriority from the initial value 0 to 10.
  opsState: None
  updatePriority: 0
...
```

Manually perform scale-down to reduce the number of the game servers to 4:

```bash
kubectl scale gss minecraft --replicas=4
gameserverset.game.kruise.io/minecraft scale
```

The number of the game servers is changed to 4. The following example shows that minecraft-2 is deleted because it has the largest DeletionPriority value.

```bash
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP
minecraft-0   Ready      None       0     0
minecraft-1   Ready      None       0     0
minecraft-2   Deleting   None       10    0
minecraft-3   Ready      None       0     0
minecraft-4   Ready      None       0     0

# After a while
...

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

Set opsState to WaitToBeDeleted for minecraft-3:

```bash
kubectl edit gs minecraft-3

...
spec:
  deletionPriority: 0
  opsState: WaitToBeDeleted # Change the value of opsState from the initial value None to WaitToBeDeleted.
  updatePriority: 0
...
```

Manually perform scale-down to reduce the number of the game servers to 3:

```bash
kubectl scale gss minecraft --replicas=3
gameserverset.game.kruise.io/minecraft scaled
```

The number of replicas for the game server is changed to 3. You can see that minecraft-3 is deleted because its opsState value is WaitToBeDeleted.

```bash
kubectl get gs
NAME          STATE      OPSSTATE          DP    UP
minecraft-0   Ready      None              0     0
minecraft-1   Ready      None              0     0
minecraft-3   Deleting   WaitToBeDeleted   0     0
minecraft-4   Ready      None              0     0

# After a while
...

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

Manually perform scale-up and change the number of replicas for the game server back to 5:

```bash
kubectl scale gss minecraft --replicas=5
gameserverset.game.kruise.io/minecraft scaled
```

The number of replicas for the game server is changed back to 5. You can see that minecraft-2 and minecraft-3 are added for the game server.

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-0   Ready   None       0     0
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
minecraft-3   Ready   None       0     0
minecraft-4   Ready   None       0     0
```

### GameServer ID Reserve

GameServerSet provides the `Spec.ReserveGameServerIds` field. Through this field, the user specifies the ID to delete the corresponding game service; or to avoid the generation of the game service corresponding to this serial number when creating a new game service.

For example, there exist 5 game suits under gss with IDs 0, 1, 2, 3 and 4. At this time, set `ReserveGameServerIds` and fill in 3 and 4, without changing the number of copies, gss will delete 3 and 4 and generate game suits of 5 and 6 at the same time, as follows:

```bash
kubectl edit gss minecraft
...
spec:
  reserveGameServerIds:
  - 3
  - 4
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     79s
minecraft-1   Ready      None       0     0     79s
minecraft-2   Ready      None       0     0     79s
minecraft-3   Deleting   None       0     0     78s
minecraft-4   Deleting   None       0     0     78s
minecraft-5   Ready      None       0     0     23s
minecraft-6   Ready      None       0     0     23s
```

If you fill in the `ReserveGameServerIds` field by adding 5 and 6 while decreasing the number of copies to 3, gss will delete the game service for 5 and 6, as follows:

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 3
  reserveGameServerIds:
  - 3
  - 4
  - 5
  - 6
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     10m
minecraft-1   Ready      None       0     0     10m
minecraft-2   Ready      None       0     0     10m
minecraft-5   Deleting   None       0     0     9m55s
minecraft-6   Deleting   None       0     0     9m55s
```

**When downsizing, OKG will give priority to the game suits that are Reserved, and then follow the downsizing order mentioned above**

### Strategy of scale-down

OKG provides two kinds of scale-down strategies: 1) General; 2) ReserveIds. You can set the corresponding strategy in `GameServerSet.Spec.ScaleStrategy`.

#### General

When the user does not configure the ScaleDownStrategyType field, General is the default configuration. The scale-down behavior is as described above.

#### ReserveIds

The user sets the ScaleDownStrategyType to `ReserveIds`, when the game service is scale-down, the deleted game service tail serial numbers will be recorded in reserveGameServerIds, and these tail serial numbers will not be used again when scale-up; if you want to use these tail serial numbers again, you only need to take them out from reserveGameServerIds and adjust the number of copies at the same time.

#### Examples

For example, there are 5 game services under gss, with IDs 0, 1, 2, 3, 4. Set `GameServerSet.Spec.ScaleStrategy.ScaleDownStrategyType` to `ReserveIds` and reduce the number of copies to 3.

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 3
  scaleStrategy:
    scaleDownStrategyType: ReserveIds
...

# After a while
kubectl get gs
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Ready      None       0     0     10m
minecraft-1   Ready      None       0     0     10m
minecraft-2   Ready      None       0     0     10m
minecraft-3   Deleting   None       0     0     9m55s
minecraft-4   Deleting   None       0     0     9m55s
...

kubectl get gss minecraft -o yaml
spec:
  replicas: 3
  reserveGameServerIds:
  - 3
  - 4
  scaleStrategy:
  scaleDownStrategyType: ReserveIds
```

As you can see, the game services with serial numbers 3 and 4 are backfilled into the `reserveGameServerIds` field. At this point, if you wish to specify the expansion of game service number 4, remove 4 from the reserveGameServerIds and increase the number of copies to 4:

```bash
kubectl edit gss minecraft
...
spec:
  replicas: 4
  reserveGameServerIds:
  - 3
  scaleStrategy:
    scaleDownStrategyType: ReserveIds
...

# After a while

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     17m
minecraft-1   Ready   None       0     0     17m
minecraft-2   Ready   None       0     0     17m
minecraft-4   Ready   None       0     0     6s
```

This function can scale up the game service with the specified serial number.

## Horizontal autoscale of gameserver

Compared to stateless service types, game servers have higher requirements for automatic scaling, especially in terms of scaling down.

The differences between game servers become more and more obvious over time, and the precision requirements for scaling down are extremely high. Coarse-grained scaling mechanisms can easily cause negative effects such as player disconnections, resulting in huge losses for the business.

The horizontal scaling mechanism in native Kubernetes is shown in the following figure:

<img src={require('/static/img/kruisegame/user-manuals/autoscaling-k8s-en.png').default} style={{ height: '400px' , width: '700px'}} />

In the game scenario, its main problems are:

- At the pod level, it is unable to perceive the game server game status and therefore cannot set deletion priority based on game status.
- At the workload level, it cannot select scale-down objects based on game status.
- At the autoscaler level, it cannot accurately calculate the appropriate number of replicas based on the game server game status.

In this way, the automatic scaling mechanism based on native Kubernetes will cause two major problems in the game scenario:

- The number of scale-down is not accurate. It is easy to delete too many or too few game servers.
- The scale-down object is not accurate. It is easy to delete game servers with high game load levels.


The automatic scaling mechanism of OKG is shown in the following figure:

<img src={require('/static/img/kruisegame/user-manuals/autoscaling-okg-en.png').default} style={{ height: '400px' , width: '700px'}} />

- At the game server level, each game server can report its own status and expose whether it is in the WaitToBeDeleted state through custom service quality or external components.
- At the workload level, the GameServerSet can determine the scale-down object based on the business status reported by the game server. As described in [Game Server Horizontal Scaling](gameservers-scale.md), the game server in the WaitToBeDeleted state is the highest priority game server to be deleted during scale-down.
- At the autoscaler level, accurately calculate the number of game servers in the WaitToBeDeleted state, and use it as the scale-down quantity to avoid accidental deletion.

In this way, OKG's automatic scaler will only delete game servers in the WaitToBeDeleted state during the scale-down window, achieving targeted and precise scale-down.

### Usage Example

_**Prerequisites: Install [KEDA](https://keda.sh/docs/2.10/deploy/) in the cluster.**_

Deploy the ScaledObject object to set the automatic scaling strategy. Refer to the [ScaledObject API](https://github.com/kedacore/keda/blob/main/apis/keda/v1alpha1/scaledobject_types.go) for the specific field meanings.

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: minecraft # Fill in the name of the corresponding GameServerSet
spec:
  scaleTargetRef:
    name: minecraft # Fill in the name of the corresponding GameServerSet
    apiVersion: game.kruise.io/v1alpha1 
    kind: GameServerSet
  pollingInterval: 30
  minReplicaCount: 0
  advanced:
    horizontalPodAutoscalerConfig: 
      behavior: # Inherit from HPA behavior, refer to https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior
        scaleDown:
          stabilizationWindowSeconds: 45 # Set the scaling-down stabilization window time to 45 seconds
          policies:
            - type: Percent
              value: 100
              periodSeconds: 15
  triggers:
    - type: external
      metricType: AverageValue
      metadata:
        scalerAddress: kruise-game-external-scaler.kruise-game-system:6000

```

After deployment, change the opsState of the gs minecraft-0 to WaitToBeDeleted (see [Custom Service Quality](service-qualities.md) for automated setting of game server status).

```bash
kubectl edit gs minecraft-0

...
spec:
  deletionPriority: 0 
  opsState: WaitToBeDeleted # Set to None initially, and change it to WaitToBeDeleted
  updatePriority: 0
...

```

After the scale-down window period, the game server minecraft-0 is automatically deleted.

```bash
kubectl get gs
NAME          STATE      OPSSTATE          DP    UP
minecraft-0   Deleting   WaitToBeDeleted   0     0
minecraft-1   Ready      None              0     0
minecraft-2   Ready      None              0     0

# After a while


kubectl get gs
NAME          STATE   OPSSTATE   DP    UP
minecraft-1   Ready   None       0     0
minecraft-2   Ready   None       0     0
```

In addition to setting an automatic scale-down policy, you can also set an automatic scale-up policy. There are many ways to automatically scale-up, for example, using resource metrics or custom metrics for scale-up. the full yaml for using CPU utilization for scale-up is as follows.

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: minecraft # Fill in the name of the corresponding GameServerSet
spec:
  scaleTargetRef:
    name: minecraft # Fill in the name of the corresponding GameServerSet
    apiVersion: game.kruise.io/v1alpha1
    kind: GameServerSet
  pollingInterval: 30
  minReplicaCount: 0
  advanced:
    horizontalPodAutoscalerConfig:
      behavior: # Inherit from HPA behavior, refer to https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior
        scaleDown:
          stabilizationWindowSeconds: 45 # Set the scaling-down stabilization window time to 45 seconds
          policies:
            - type: Percent
              value: 100
              periodSeconds: 15
  triggers:
    - type: external
      metricType: AverageValue
      metadata:
        scalerAddress: kruise-game-external-scaler.kruise-game-system:6000
    - type: cpu
      metricType: Utilization    # Allowed types are 'Utilization' or 'AverageValue'
      metadata:
        value: "50"
```

Pressure testing of the gameserver, you can see that the gameserver began to scale-up

```bash
kubectl get gss
NAME        DESIRED   CURRENT   UPDATED   READY   MAINTAINING   WAITTOBEDELETED   AGE
minecraft   5         5         5         0       0             0                 7s

# After a while

kubectl get gss
NAME        DESIRED   CURRENT   UPDATED   READY   MAINTAINING   WAITTOBEDELETED   AGE
minecraft   20        20        20        20      0             0                 137s
```
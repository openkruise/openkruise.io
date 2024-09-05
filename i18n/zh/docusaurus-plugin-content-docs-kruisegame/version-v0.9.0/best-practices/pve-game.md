# Best Practices for Traditional PvE Games

## Challenges of Implementing PvE Games on Kubernetes

Firstly, PvE server-based games have the following characteristics:

1. Individual servers have longer run times and there should be minimal server shutdowns to enhance player experience. 
2. There are configuration differences when servers are launched. 
3. Containers for individual servers may contain multiple processes, and the quality of server services needs to be defined by the user. 
4. Over time, the status of each server can diverge, requiring targeted management such as changing resource specifications, image versions, or directed server mergers.

When implementing such games on Kubernetes, developers often face a dilemma due to:

- If using Kubernetes native workloads, it is impossible to manage game services with precision, specifically:
  - If using Deployments for management:
    - The generated pods lack a numerical status identifier, resulting in: 1) the inability to perform stateful service discovery based on sequence numbers; 2) inability to differentiate state differences between game servers; 3) state loss upon unexpected restarts, configuration/storage cannot be automatically redirected.
  - If using StatefulSets for management:
    - Although the generated pods have sequence numbers as state identifiers, it means: 1) updates or deletions can only be done from the highest sequence number downward, preventing targeted server management; 2) inability to sense the state differences between game servers.
- If not using Kubernetes native workloads, the capabilities of Kubernetes orchestration cannot be utilized:
  - If using script programs for batch server launches:
    - This is a procedural approach, where parameters cannot be recorded, leading to a high error rate.
  - If using gitops for management:
    - When there are a large number of servers, maintaining a massive amount of yaml files with similar fields is necessary, sometimes even exceeding file length restrictions; batch releases are also very complex.
  - If managing through a self-built PaaS platform:
    - This requires a significant amount of development work and is heavily coupled with business attributes, leading to complex iterations afterward.

This best practice guide will introduce how to manage server-based game services using OKG.


## Hot Updates for Game Servers
The in-place upgrade hot update provided by OKG is a more cloud-native approach to implementing hot updates for game servers. This method enables version management of hot update files for game servers, phased rollouts, update status awareness, and consistency of hot update versions after failure recovery.

For specific implementation methods, please refer to the relevant documentation. https://openkruise.io/kruisegame/user-manuals/hot-update

## Game Server Configuration Management
Game servers managed by GameServerSet have a numerical property, and their names are fixed and unchanging, similar to StatefulSet. Therefore, "GameServerSet name + number" can serve as a unique identifier for the game server, linking to distributed storage or configuration management systems for differentiated configuration management.

### Mounting Object Storage
Through object storage, the different configurations of different game servers are placed under paths named after the game server names, ensuring that the bucket's path corresponds one-to-one with the game servers. This is declared as a PVC (Persistent Volume Claim) on GameServerSet. The schematic diagram for this method is as follows:

<img src={require('/static/img/kruisegame/best-practices/gss-oss-config.png').default} style={{  width: '500px'}} />

GameServerSet Yaml：

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gameserver
  namespace: default
spec:
  replicas: 2
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
      - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
        name: minecraft
        env:
        - name: POD_NAME 
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        volumeMounts:
        - name: pvc-oss 
          mountPath: "/app/sgame.config" 
          subPathExpr: $(POD_NAME)/sgame.config 
      volumes:
      - name: pvc-oss
        persistentVolumeClaim:
          claimName: pvc-oss
```
As such, before launching the server, it is only necessary to prepare the corresponding configurations for the game server and upload them to the respective paths in the bucket. Then, deploy the GameServerSet or adjust the Replicas as needed.

As shown in the diagram, the file contents in the directories gameserver-0 and gameserver-1 are different and will be mounted on the corresponding game servers gameserver-0 and gameserver-1, respectively:

<img src={require('/static/img/kruisegame/best-practices/oss-bucket-dir.jpg').default} style={{  width: '500px'}} />

### Dynamic Retrieval
If there is a configuration center service (such as Nacos) in the business, by utilizing the characteristic that the game server name is fixed and unique, the game server container can pull the corresponding configuration by sending a request to the configuration center with its own name as the request parameter at startup.
The method of obtaining the container's own name is similar to that used in mounting object storage, where it is passed in as an environment variable through the DownwardAPI.

## Custom Service Quality for Game Servers

### Background and Concept
When traditional server-based games are containerized, they often exist in the form of "rich containers," meaning that a single container may have multiple processes, each responsible for different functions of a single server. At this point, the status of a single game server can be quite complex. Native Kubernetes manages business status at the container level and cannot finely perceive the status of specific processes within the container, making it difficult to locate and address faults or anomalies.

OKG believes that the service quality of game servers should be defined by the user. Users can set the status of game servers based on their business needs and handle it in a detailed manner. OKG's "custom service quality" feature detects specific abnormal process states and exposes them to the Kubernetes side. By using components such as kube-event for event notification, alerts can be sent to operations groups, helping operations engineers quickly discover issues, achieving second-level fault localization and minute-level fault resolution.

The diagram below illustrates the custom service quality feature. Based on the results returned by the probe.sh script, the operational status of the GameServer is changed, enabling rapid localization of faults/anomalies:

<img src={require('/static/img/kruisegame/best-practices/service-quality.png').default} style={{  width: '500px'}} />

### Example

Let’s take an example to see how to realize multiple status awareness of the game server through a detection script.

When making a container image, write a script to detect the status of the container. The sample script probe.sh will detect whether the gate process and data process exist.
When the gate process does not exist, it outputs "gate" and exits normally; when the data process does not exist, it outputs "data" and exits normally; when there is no exception, it exits with exit code 1.

The probe.sh script is a detection script within the business container, which is periodically called by OKG.
Its principle is similar to the Kubernetes native liveness/readiness probes. In the aforementioned scenario, the pseudocode for probe.sh is as follows:

```shell
#!/bin/bash

gate=$(ps -ef | grep gate | grep -v grep | wc -l)
data=$(ps -ef | grep data | grep -v grep | wc -l)

if [ $gate != 1 ]
then
  echo "gate"
  exit 0
fi

if [ $data != 1 ]
then
  echo "data"
  exit 0
fi

exit 1
```

The corresponding yaml of GameServerSet is as follows:

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0
          name: minecraft
  serviceQualities:
    - name: healthy
      containerName: minecraft
      permanent: false
      exec:
        command: ["bash", "./probe.sh"]
      serviceQualityAction:
        - state: true
          result: gate
          opsState: GateMaintaining
        - state: true
          result: data
          opsState: DataMaintaining
        - state: false
          opsState: None
```

After the deployment is completed, 3 Pods and GameServer are generated

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     14s
minecraft-1   Ready   None       0     0     14s
minecraft-2   Ready   None       0     0     14s

kubectl get po
NAME          READY   STATUS    RESTARTS   AGE
minecraft-0   1/1     Running   0          15s
minecraft-1   1/1     Running   0          15s
minecraft-2   1/1     Running   0          15s
```

Enter the minecraft-0 container, simulate the gate process failure, and kill its corresponding process number.

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 7

/data# exit
```

Get the opsState of the current gs, which has changed to GateMaintaining

```bash

kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     2m14s
minecraft-1   Ready   None              0     0     2m14s
minecraft-2   Ready   None              0     0     2m14s
```

Enter the minecraft-1 container, simulate the data process failure, and kil its corresponding process number.

```bash
kubectl exec -it minecraft-1 /bin/bash

/data# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh
root           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh
root           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh
root           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.
...

/data# kill -9 8

/data# exit
```

Get the opsState of the current gs, which has changed to DataMaintaining

```bash
kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   GateMaintaining   0     0     3m10s
minecraft-1   Ready   DataMaintaining   0     0     3m10s
minecraft-2   Ready   None              0     0     3m10s
```

Enter minecraft-0 and minecraft-1 respectively, and manually pull up the hung process:

```bash
kubectl exec -it minecraft-0 /bin/bash

/data# bash ./gate.sh &

/data# exit

kubectl exec -it minecraft-1 /bin/bash

/data# bash ./data.sh &

/data# exit
```

At this time, the operation and maintenance status of gs has returned to None.

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     5m6s
minecraft-1   Ready   None       0     0     5m6s
minecraft-2   Ready   None       0     0     5m6s
```

## Game Server Targeted Management
### Setting GameServer Reclaim Policy

There are two types of lifecycle reclaim policies for GameServers — Cascade and Delete, which can be set in GameServerSet.Spec.GameServerTemplate.ReclaimPolicy.

- Cascade: The GameServer is reclaimed when the pod is deleted, keeping it consistent with the pod's lifecycle. Cascade is the default value for ReclaimPolicy.
- Delete: The GameServer is reclaimed when the number of replicas in the GameServerSet is reduced. The GameServer will not be deleted when the corresponding pod is manually deleted, rebuilt after an update, or evicted. 

The Cascade policy is suitable for short-lifecycle game servers, where there is a frequent need for starting and deleting sessions and the state needs to be cleared promptly, such as in most PvP session-based games. The Delete policy, on the other hand, is more suitable for traditional PvE games with dedicated servers, where the game server's state needs to be recorded on the GameServer for a long time to prevent loss of state. It is only reclaimed when the user performs server merging or deletion operations. Explicitly declaring the GameServer reclaim policy as Delete when creating a GameServerSet can better achieve targeted management functions for dedicated server games.

### Targeted Update of Game Server Image and Resource Specification
Scenarios, where targeted updates of game server images are necessary, exist, including:

- In gray-scale or test environments, different regions correspond to different image versions;
- In SLG-type games, the concept of gameplay instances exists, and the gameplay in different regions might differ, each corresponding to a different image.

For such cases, where a single GameServerSet might have multiple versions of an image for game servers, one can specify the update for a specific game server image version by setting the image field in GameServer.Spec.Containers.

Scenarios, where targeted updates of game server images are necessary, include:

- Over time, there might be an increase in the number of players or a loss of players, leading to some regions' computing resources being unable to meet current demands.

For situations where a single GameServerSet might have game servers with various resource specifications, one can specify the specific resource specification for a game server by setting the resources field in GameServer.Spec.Containers.

The diagram illustrating the targeted update of game server image and resource specification is as follows:

<img src={require('/static/img/kruisegame/best-practices/gs-update-images-resources.png').default} style={{  width: '500px'}} />

#### example

Next, an example will be shown to demonstrate how to conduct targeted updates of the game server's image and resource specifications.

Firstly, deploy a GameServerSet with 3 replicas:

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
spec:
  replicas: 3
  gameServerTemplate:
    reclaimPolicy: Delete
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
      maxUnavailable: 100%
```
update image of gs minecraft-0 to registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new

```yaml
kubectl edit gs minecraft-0

...
spec:
  deletionPriority: 0
  opsState: None
  updatePriority: 0
  # add
  containers:
  - name: minecraft
    image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new
...
```

After a while, pod updated(number of restarts add 1 because of inplace-update)

```bash
kubectl get po
NAME                  READY   STATUS    RESTARTS      AGE
minecraft-0           1/1     Running   1 (13s ago)   3m28s
```

At this point, if a pod is deleted, the image of the newly created pod will be based on the spec declared in the GameServer. For example:

```bash
# delete pod
kubectl delete po minecraft-0

# pod state is Terminating, gs state is Deleting
kubectl get gs minecraft-0
NAME          STATE      OPSSTATE   DP    UP    AGE
minecraft-0   Deleting   None       0     0     8m19s

kubectl get po minecraft-0
NAME          READY   STATUS        RESTARTS        AGE
minecraft-0   1/1     Terminating   1 (5m12s ago)   8m19s

# after a while
# pod running again，age of GameServer is different from age of pod
kubectl get po minecraft-0
NAME          READY   STATUS    RESTARTS   AGE
minecraft-0   1/1     Running   0          28s

kubectl get gs minecraft-0
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     9m18s
```

Since the GameServer's recycling policy is set to Delete, the configuration of the game server will not be lost due to the disappearance of the pod. 
The current game server's image remains the updated one: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new.


Next, we will perform a targeted update of the resource specifications for the game server minecraft-1, adjusting the requests to cpu: 500m:

```yaml
kubectl edit gs minecraft-1

...
spec:
  deletionPriority: 0
  opsState: None
  updatePriority: 0
  # add
  containers:
  - name: minecraft
    resources:
      requests:
        cpu: 500m
...
```

The resource configuration will not be updated in place immediately. 
The new resource specifications will take effect once the maintenance period begins, and the operations engineer manually triggers the pod to be rebuilt. 
For example:

```bash
kubectl delete po minecraft-1

# after a while

# gs won't be deleted
kubectl get gs minecraft-1
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-1   Ready   None       0     0     15m

# pod recreated
kubectl get po minecraft-1
NAME          READY   STATUS    RESTARTS   AGE
minecraft-1   1/1     Running   0          11s
```

At this moment, the pod's resource specification for requests has been adjusted to cpu: 500m.

### Game Server Merging
When the player base of a particular game server declines to a certain extent and server merging is required, targeted deletion of game servers can be performed.

- Bulk server merging actions can be implemented by setting ReserveGameServerIds along with replicas. For example, if there are 5 game servers with IDs 0, 1, 2, 3, and 4, and you wish to delete game servers 2 and 3, then set ReserveGameServerIds to 2 and 3, and adjust replicas to 3. For more details, refer to the documentation: [GameServer-scale/gs id reserve](https://openkruise.io/kruisegame/user-manuals/gameservers-scale/#gameserver-id-reserve)

- Quick deletion of a single game server can also be achieved by setting the gs's opsState to Kill. For more details, refer to the documentation: [GameServer-sacle/gs Kill](https://openkruise.io/kruisegame/user-manuals/gameservers-scale/#kill-gameserver)

## Common Questions About Managing PvE Game Servers with OKG

### Q: How to decide the scope of management for a GameServerSet?
First and foremost, it's important to understand that a GameServerSet (abbreviated as gss) is a cluster-level resource and cannot be declared across clusters. Secondly, PvE-type games often involve concepts like zones and groups, which add several dimensions. As such, should a single zone use one gss, or should a single group use one gss? In reality, the decision mainly depends on the initial differences between these game servers.

The considerations for differences can generally be assessed from two aspects:

1. Configuration differences. As mentioned in the configuration management section above, the unique names within the GameServer cluster namespace can mask content differences. Therefore, a single GameServerSet can manage them.
2. Resource specification differences and image version differences. There are two scenarios for these differences: 1) They are consistent initially but diverge over time. 2) They are inconsistent from the start. For the first scenario, a single GameServerSet can manage the game servers, and the targeted update function of OKG mentioned earlier can be used. For the second scenario, a single GameServerSet can also manage the game servers, but the operations required when opening new servers become more complex, involving not just adjusting the number of replicas but also adjusting the Spec of the corresponding GameServer to have its own image or resource configuration. This method is more suitable for a testing environment or a production environment with a smaller number of game servers. In cases where there is a large number of game servers, it is recommended to have specifications defined so that game servers with the same image and the same resource specifications are managed by the same GameServerSet.

### Q: How to open a new game server?
The steps for opening a new game server are as follows:

1. Ensure that the corresponding GameServerSet is deployed in the cluster (initial replica count may be 0).
2. If there are different configurations, prepare the configuration files in advance and upload them to OSS or a custom configuration center (if there is no configuration difference, use the configmap configured when creating the GameServerSet).
3. Find the corresponding gss and adjust the number of replicas to increase the number of game servers to be opened.
4. If the image version/resource specification of the new game server is inconsistent with what is declared in the GameServerSet, you can change the image or resources in the containers field of the corresponding GameServerSpec. It is important to note that if you need to adjust the resource specifications, you will have to manually delete the pod to trigger a rebuild.

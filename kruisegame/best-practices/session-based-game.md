# Best Practice for Session-Based Games(PvP room)

Session-based games refer to a type of game where players are gathered in a specific game scenario within a limited time frame. In general, a session is equivalent to a match, and after the match ends, the game relationship between players also ends, and the session terminates as well. Therefore, in the industry, session-based games are commonly understood as "room-based games," where a room hosts the corresponding game session. These types of games often have the following characteristics:

- Game time is non-continuous, with distinct start and stop time points.
- Commonly found in MOBA, FPS games with high latency requirements.
- At least 2 or more players interacting and battling with each other within a session.
- During peak and off-peak times, there is a significant difference in the number of matches.
- Based on these characteristics, an ideal cloud-native architecture diagram for session-based games is as follows:

<img src={require('/static/img/kruisegame/best-practices/session-based-game-arch.png').default} style={{  width: '500px'}} />

It should have the following capabilities:

- Provide direct network connectivity by assigning independent public network access addresses for each room, allowing players to connect directly.
- Provide game matchmaking functionality to find suitable teammates and opponents for players to form a session match and allocate appropriate game rooms.
- Provide state management functionality to automate the management of the business state and lifecycle of game rooms.
- Provide elastic scaling capabilities to automatically request and release infrastructure resources based on peak and off-peak business demands to control costs.
- Efficient game delivery and operational management with a high degree of automation.

## Direct Network Connectivity
Session-based games require direct network connectivity, and there are usually the following considerations:

- Reduce game latency and enhance player gaming experience.
- Remove unnecessary gateways or proxies to save resource costs and simplify technical architecture.

### Choosing the OpenKruiseGame Networking Model

In the era of traditional game operations, game server business and infrastructure were tightly coupled. Often, when developing server-side programs, an additional port allocation manager was required to avoid port conflicts between different rooms on the same machine. In an ideal state, after cloud-native transformation, game developers no longer need to worry about port allocation for game rooms. Room servers can be horizontally scaled, so each room server should have its own public network access address. However, the native service load balancing model in Kubernetes cannot meet this requirement.

OpenKruiseGame (OKG) provides various networking models to automate the management of public network addresses (EIP + port) for room servers. From then on, game developers do not need to worry about network configuration of the infrastructure, and game operators only need to provide simple parameters to efficiently deploy and automate the management of room server networks. In the OKG mode, each room server corresponds to a pod. For session-based games, the currently available networking models include Kubernetes-HostPort, AlibabaCloud-NATGW, AlibabaCloud-SLB, and AlibabaCloud-EIP. Each networking model has its own characteristics and is suitable for different scenarios.

**Kubernetes-HostPort:**

This model uses the host node's EIP + port as the public network address. This mode is suitable for scenarios where pods are densely deployed on nodes. When the number of small room servers is high, and each node hosts multiple pods, this mode fully utilizes the bandwidth of the EIP on that node, thus maximizing the cost savings of EIP resources.

**AlibabaCloud-SLB:**

This model maps different ports of the same SLB to different room servers, allowing each room server to have an independent public network address. This mode has the simplest configuration and requires very few EIPs. However, note that SLB is limited by the maximum number of backend instances. Each SLB can associate a maximum of 200 room servers. When the number of room servers under GameServerSet is about to exceed 200, additional SLB instances need to be added to meet scaling requirements.

**AlibabaCloud-NATGW:**

This model automates the management of Dnat mapping rules associated with room servers. Users need to install the ack-extend-network-controller component and configure NAT gateway-related parameters. The NATGW model has greater scalability and flexibility compared to the SLB model, but it is also more complex to configure.

**AlibabaCloud-EIP:**

This model assigns a separate EIP for each room server pod. This mode consumes more EIPs and is suitable for scenarios where game servers already have a port manager. The exposed port range of the container is the same as the accessed port range, and there is no mapping behavior.

For detailed explanations and examples, refer to the OKG Networking Model documentation.

### Obtaining Room Server Network Information
Once the game rooms have their own independent public network access addresses, the remaining question is how to provide this address to the player's client. Generally, session-based games have a matching service role, and the matching service commonly perceives the network address of room servers in two ways: 1) Active retrieval; 2) Room server self-registration and reporting.

**Active Retrieval**

The matching service actively retrieves the available room servers in the current cluster and obtains their corresponding public network addresses. It selects the appropriate room server and returns it to the client. In this case, the matching service needs to call the Kubernetes API to retrieve the NetworkStatus of the GameServer object. For GameServer CRUD operations, you can refer to the e2e test cases in the official Kruise-Game repository.

**Registration and Reporting**

Alternatively, the room server business can report its network information. In this case, the network information is passed down to the container using the Kubernetes Downward API mechanism and can be accessed by the business logic within the container. Once the business logic obtains the corresponding address, it can be reported. For specific examples, refer to the documentation.

## Game Matching
The process of game matching in session-based games can be roughly divided into two stages: 1) Players finding teammates/opponents to form a match; 2) Finding a suitable room server for the match and returning the network address to the players.

### Implementing Game Matching Service with OpenMatch
In the open-source community, there are game matching frameworks like Open Match, where users only need to implement the matching logic according to the framework's standards. 
OKG provides the kruise-game-open-match-director component based on Open Match, which mainly helps implement the second stage of the matching process mentioned above - finding a game server for the match and returning the address. 
This way, users only need to focus on the matching logic in the first stage. For a guide on developing matching services using Open Match and OKG, you can watch the Cloud-Native Game series courses. 
You can also join the Cloud-Native Game community group (DingTalk ID: 44862615) to participate in discussions or ask questions.

### Custom Game Matching Service
Of course, if there is a custom matching framework/system, you can also integrate it with OKG through simple secondary development. 
As mentioned in the section on obtaining network information, there are two ways for the matching service to interact with the room servers: actively retrieving the status and network information of the room servers or having the room servers self-register and report. 
However, for the second method, it is important to confirm the status of the corresponding room server before assigning the address to the player's client. This is because the retrieval and assignment of network addresses are asynchronous, and there may be situations where the room server is not available during the process. 
As for the first method, the recommended approach is to use the Kubernetes Informer mechanism to listen to the GameServer objects. When there is a need to assign a room server for a match, you can retrieve the currently available GameServer and return the corresponding network information. 
In this case, the retrieval and assignment of network information are synchronous. For the specific implementation, you can refer to the allocator code in kruise-game-open-match-director.

## State Management

### State Type for Session-Based Games

In the previous section on game matchmaking, we mentioned that the matchmaking service needs to retrieve the status of the game server when assigning the server address to each player's client to ensure that the assigned server is available. So, how should we define the availability of a game server? According to the design principles of OKG, an available game server should be = Infrastructure Runtime State Ready + Infrastructure Network Ready + Business State Ready.

What does "Business State Ready" mean? This involves the definition of the server state based on the game's requirements. We recommend that the game server business state includes at least the following states:

None (No abnormal or special state exists, indicating availability, and this is the default state after the server initialization)
Allocated (Already assigned, indicating that players are currently or about to play the game)
WaitToBeDeleted (About to be deleted, waiting for OKG to recycle the pod)
These three states can be recorded in the GameServer Spec using OpsState. OKG provides two ways to mark the server state:

1. Modifying GameServer.Spec.OpsState directly by calling the Kubernetes API (usually after the matchmaking system assigns the game server, it can be marked as Allocated).
2. Exposing and converting the business state in a container to the corresponding GameServer.Spec.OpsState by [Service Quality](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities).


The simplest state transition model is shown in the figure:

1. The default state after the room server is pulled up is available. At this time, OpsState is **None**
2. When matching requirements are generated, the matching service searches for available (Infrastructure Ready & OpsState is None) room servers, and after allocation, sets its OpsState to **Allocated** (set through Kubernetes API, please refer to [kruise-game -allocator code for open-match-director](https://github.com/CloudNativeGame/kruise-game-open-match-director/blob/main/pkg/allocator.go). Not required if using OKG + Open Match Settings, Director has already done the above work)
3. Setting OpsState as **WaitToBeDeleted** when game over by [Service Quality](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities). 这样对应的pod将被OKG自动进行回收删除，后续弹性伸缩部分将展开介绍。

<img src={require('/static/img/kruisegame/best-practices/session-based-game-state-1.png').default} style={{  width: '150px'}} />

Of course, if you want to start and stop pods less frequently, you can also change OpsState to None after the game. The overall state transformation model is shown in the figure:

1. Same as above, the default state after the room server is pulled up is available, at this time OpsState is **None**
2. Same as above, after assigning the room server, the matching system will set it to **Allocated**
3. When the game ends, set OpsState to **None** through [Customized Service Quality](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities)
4. When the room server status is judged to be None for a long time through the coroutine, the OpsState will be set to ** through [Customized Service Quality](https://openkruise.io/zh/kruisegame/user-manuals/service-qualities) WaitToBeDeleted. **

<img src={require('/static/img/kruisegame/best-practices/session-based-game-state-2.png').default} style={{  width: '200px'}} />

### Reveal the status of room service through service quality

After completing the room server state flow design, we will find that some states are determined by the room server business, and these states also need to be exposed to the Kubernetes level so that they can be linked to the automatic scaler, matching system, etc. Therefore, a mechanism is needed to mark the business status on the Kubernetes object, that is, GameServer, and this is the **Customized Service Quality** function.

Customized service quality automatically marks the room server status on the GameServer through the results of **executing the detection script** and the **detection result corresponding status** set by the user.

The following is a status detection script named waitToBeDeleted.sh, which detects whether the value of the GS_STATE environment variable in the container is WaitToBeDeleted.

```bash
#!/bin/bash
if [ -z "$GS_STATE" ]; then
  exit 1
elif [ "$GS_STATE" = "WaitToBeDeleted" ]; then
  echo "$GS_STATE"
else
  exit 1
fi
```

The corresponding GameServerSet yaml should be as follows

```bash
...
spec:
  ...
  serviceQualities: 
    - name: waitToBeDeleted
      containerName: battle 
      permanent: false
      exec:
        command: ["bash", "./waitToBeDeleted.sh"]
      serviceQualityAction:
        - state: true
          opsState: WaitToBeDeleted
```

Of course, there can be multiple custom service qualities. For example, when the room server needs to reveal its None status, the script named none.sh is as follows:

```bash
#!/bin/bash
if [ -z "$GS_STATE" ]; then
  exit 1
elif [ "$GS_STATE" = "None" ]; then
  echo "$GS_STATE"
else
  exit 1
fi
```

The corresponding GameServerSet yaml should be as follows:

```bash
...
spec:
  ...
  serviceQualities: 
    - name: waitToBeDeleted
      containerName: battle 
      permanent: false
      exec:
        command: ["bash", "./waitToBeDeleted.sh"]
      serviceQualityAction:
        - state: true
          opsState: WaitToBeDeleted
    - name: none
      containerName: battle 
      permanent: false
      exec:
        command: ["bash", "./none.sh"]
      serviceQualityAction:
        - state: true
          opsState: None
```

So far, we have found that the room service business program only needs to set the corresponding GS_STATE environment variable value at the appropriate time node. for example:

- When the room server has just been launched, set GS_STATE=None;
- When a player enters the room server, set GS_STATE=Allocated (although it does not need to be exposed to opsState, you can still make state changes to avoid inconsistency between your own state and what is displayed in Kubernetes);
- When the room server game ends, set GS_STATE=None;
- When the room server is idle for a long time, set GS_STATE=WaitToBeDeleted.

## Elastic scaling

In the previous section, we designed three room server states: None / Allocated / WaitToBeDeleted. In this section, we will perform corresponding elastic scaling configuration based on the above room server status.

The ideal state for elastic scaling of conversational games is that during peak business periods, the number of room servers is sufficient to allow players to access the game in seconds; during low business periods, the number of room servers is reduced to save resource costs. OKG provides an automatic scaler that can sense the status of the room server and automatically adjust the replicas value of GameServerSet to achieve the ideal effect of scaling according to the game business status.

### Room service is automatically reduced

In the state management section, we also mentioned that the GameServer whose opsState is WaitToBeDeleted will be automatically recycled by OKG. In this way, as long as the business decides that it will no longer provide services, it can set WaitToBeDeleted through custom service quality. For specific configuration of the scaling strategy, please refer to [https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#Usage Example](https://openkruise.io/zh/kruisegame/user-manuals /gameservers-scale#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)

### Room service automatically added

OKG's core strategy for providing automatic expansion is to ensure that there is an available and sufficient number of room servers. This number is equivalent to buffer and is determined by the user. In OKG, this parameter is called **minAvailable**.

When the current number of game servers with opsState of None is less than the set **minAvailable** value, OKG will automatically expand new game servers so that the number of game servers with opsState of None meets the set minimum number.

### Resource automatic scaling

Kubernetes elastic scaling covers two levels, application layer elasticity and resource layer elasticity. Among them, OKG provides the flexibility of the room server application layer and automatically adjusts the number of pods corresponding to the room server. Only adjusting the number of pods cannot save resource costs. The number of nodes needs to be automatically adjusted. This is how Kubernetes cluster-autoscaler achieves resource layer elasticity. The core principle of cluster-autoscaler is:

- When a pod is in the pending state due to insufficient resources, the node is automatically ejected.
- Automatically recycle nodes when node utilization is too low/nodes are idle.

For game scenarios, the best practices for automatic scaling are as follows:

- Set OKG **minAvailable** size according to node specifications. The startup of the node takes time, so free and available room servers need to be prepared in advance for players to connect. The idle room server essentially advances the triggering time of node horizontal expansion, making up for the time difference in starting the machine. In this way, the node specification and minAvailable are closely related. For example: the node specification used in the cluster is 8 cores and 16G, and the room service pod running on it requires 1 core and 2G resources, so theoretically the node can Run 7 room servers (nodes will have reserved resources, so not 8). In this case, if minAvailable is set to 7 or more, there will always be an "idle" node in the cluster (idle here does not mean no pods, but no players); if it is set to 14 or more, there will always be an "idle" node in the cluster. With two "idle" nodes, this also converts the **room server spare quantity** into the **node spare quantity**. Users can set specific settings according to business scenarios and cost control perspectives.

- Set the cluster autoscaler to automatically recycle nodes only when the nodes are completely idle to ensure normal game operation. Shrinking based on resource thresholds is not friendly to the game. Since the game is a stateful service, there is a great possibility that the resource load on the node is small but the player is still playing the game, and it cannot be easily deleted.

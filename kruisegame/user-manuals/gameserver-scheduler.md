# GameServer Schedulers

## Index Offset Scheduler

Index Offset Scheduler is a custom kubernetes scheduler. 
It allows pods belonging to the same GameServerSet to be deployed in a rolling manner according to the pod index number, so that the offset/difference of the pod index on each node is as large as possible.
For games with rolling server launch, this is a common requirement scenario:
- Before the game goes online, due to a large number of reservations or traffic, more game services need to be prepared in advance. In the k8s environment, the id of the game service generally corresponds to the pod number.
- After the server is launched, the pod load corresponding to the game server will increase significantly, and the load of the machine will increase significantly. If multiple adjacent pods are located on the same node, such as pod-1 and pod-2, the rapid increase in the pod load in a short period of time may require the node configuration to be prepared according to the maximum resources required by the two pods. After a period of time, as the number of active players decreases, the machine load will decrease again.
- Therefore, in the scenario of traditional machine deployment, the common practice is to prepare multiple machines in advance and deploy the game services in a rolling deployment manner, so that the node can deploy more services and will not face the risk of a single machine carrying the highest load of multiple game servers in the short term. The deployment effect is similar to the distribution below:
    ```
    node1: game-1, game-4...
    node2: game-2, game-5...
    node3: game-3, game-6...
    ```
The default k8s scheduler will ensure that pods are distributed as evenly as possible, but it cannot ensure that the difference between pod numbers on each node is as large as possible. It is even possible that two pods with consecutive index numbers are distributed on the same node. Therefore, it is necessary to implement a custom scheduler to make the offset/difference of the pod index on each node as large as possible.

### Install

```
helm upgrade kruise-game openkruise/kruise-game --version 1.0.0 --set indexOffsetScheduler.enabled=true
```

### Get More

https://github.com/CloudNativeGame/index-offset-scheduler
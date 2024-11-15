# FAQ

### The State and OpsState of GameServer respectively represent what? What is the difference?

State represents the runtime state of the game server, related to the lifecycle of the pod and cannot be customized by the user. The current State includes the following values:

- Creating —— indicates that the pod is being created, equivalent to Pod Pending
- Ready —— indicates that the pod is ready, with the pod ready condition being true
- NotReady —— indicates that the pod is not ready, with the pod ready condition being false
- Crash —— indicates that the pod has failed, equivalent to Pod Failed
- Deleting —— indicates that the pod is being deleted, equivalent to Pod Terminating
- Updating —— indicates that the pod is undergoing in-place upgrade
- PreDelete —— indicates that the pod is in a pre-deletion state. It appears after executing the pod's deletion action with a deletion lifecycle hook set and entering the Deleting state after resolving the deadlock
- PreUpdate —— indicates that the pod is in a pre-upgrade state. It appears after performing an in-place upgrade of the pod with an update lifecycle hook set and entering the Updating state after resolving the deadlock
- Unknown —— all other states not mentioned above

OpsState represents the operational state of the game server, determined by the business and can be freely modified by the user. OKG provides some reserved values with special meanings, including:
- None —— default value, representing no exceptions or special states
- WaitToBeDeleted —— the highest priority for game server scaling down, and will be automatically reclaimed after configuring automatic scaling policy
- Maintaining —— the lowest priority for game server scaling down
- Allocated —— the scaling down priority of the game server is greater than Maintaining but less than None. It usually represents that the game server has been allocated and can be used in game matching scenarios.
- Kill —— game servers with Kill set will be directly deleted by the OKG controller

Users can change the GameServer opsState by calling the K8s API (or kubectl), and can also automatically trigger the corresponding GameServer opsState change by customizing the service quality features within the business container.

### What is the horizontal scaling logic of the GameServer when ReserveId is configured?

In the case of configuring ReserveId, the horizontally scaled GameServer that is being scaled down actually falls into two categories:

1. GameServer explicitly specified by the user with Reserve
2. GameServer scaled down by OKG's horizontal scaling feature.

Here, the former can be called the explicit scaling down list and the latter can be called the implicit scaling down list.

At this point, there are two principles:

1. The explicit list has the highest authority, representing user instructions, and the specified ID will definitely not exist in the cluster. 
2. Try not to make changes to the existing GameServer list to ensure minimal changes.

Here are a few examples:

1. Current IDs are [0, 2, 3, 5], and ReserveId is [4]. If the replicas are adjusted from 4 to 6, the situation after scaling up is: ReserveId is [4], and the existing IDs are [0, 1, 2, 3, 5, 6]. 
   
   Here it is easy to understand that ID 1 belongs to the implicit scaling down list and will be scaled up first when there is a scaling up requirement, while ID 4 belongs to the explicit scaling down list and will not be scaled up as long as it is in the ReserveId.

2. Current IDs are [0, 2, 3, 5], and ReserveId is [4]. If the replicas remain unchanged and the reserve is cleared, the changed situation is: ReserveId is [], and the existing IDs are [0, 2, 3, 5]. 

   It is important to note that, due to the principle of minimal changes, after removing ID 4 from ReserveId, it transitions to the implicit scaling down list, and there is no scaling up or scaling down behavior for the existing GameServers as there is no scaling up requirement at the moment.


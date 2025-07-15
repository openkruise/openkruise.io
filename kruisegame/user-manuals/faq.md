# FAQ

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

### What is the Gss scaling logic for Gs in the PreDelete state?

The actual offline time of a GameServer in the PreDelete state cannot be determined. If the user does not remove the lifecycle card, Gs will remain in the PreDelete state.
At this time, when the number of Gss replicas increases, OKG will not use the GameServer in the PreDelete state as a new expansion object. For example:

Current Gss replicas=1:
```
NAME          STATE        OPSSTATE    DP    UP    AGE
minecraft-0   Ready        None        0     0     40s
minecraft-1   PreDelete    None        0     0     30s
```

Setting Gss replicas to 2 will expand minecraft-2:
```
NAME          STATE        OPSSTATE    DP    UP    AGE
minecraft-0   Ready        None        0     0     50s
minecraft-1   PreDelete    None        0     0     40s
minecraft-2   Ready        None        0     0     10s
```
# Custom Lifecycle Management

Game servers, due to their strong stateful characteristics, have a high demand for graceful shutdown operations. 
A game server typically needs to wait until data is fully persisted to disk and ensured to be safe before it can be thoroughly removed. 
Although Kubernetes natively provides the preStop hook, which allows containers to execute specific actions before they are about to shut down, there is a limitation: once the preset time limit is exceeded, the container will have to be forcibly terminated, regardless of whether the data processing is complete or not. 
In some cases, this approach lacks real gracefulness. We need a more flexible mechanism to ensure that game servers can exit smoothly while protecting all critical states.

OpenKruise has introduced the Lifecycle Hook feature, which provides precise control and waiting mechanisms for game servers at critical lifecycle moments. 
This allows servers to execute the actual deletion or update operations only after meeting specific conditions. 
By providing a configurable Lifecycle field, combined with the ability to customize service quality, OKG ensures that the game server's shutdown process is both graceful and reliable. 
With this advanced feature, maintainers can ensure that all necessary data persistence and internal state synchronization are safely and correctly completed before the server is smoothly removed or updated.

## Usage Example

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  lifecycle:
    preDelete:
      labelsHandler:
        gs-sync/delete-block: "true"
  gameServerTemplate:
    metadata:
      labels:
        gs-sync/delete-block: "true"
    spec:
      containers:
        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0
          name: minecraft
          volumeMounts:
            - name: gsinfo
              mountPath: /etc/gsinfo
      volumes:
        - name: gsinfo
          downwardAPI:
            items:
              - path: "state"
                fieldRef:
                  fieldPath: metadata.labels['game.kruise.io/gs-state']
  serviceQualities:
    - name: healthy
      containerName: minecraft
      permanent: false
      exec:
        command: ["bash", "./probe.sh"]
      serviceQualityAction:
        - state: true
          result: done
          labels:
            gs-sync/delete-block: "false"
        - state: true
          result: WaitToBeDeleted
          opsState: WaitToBeDeleted
        - state: false
          opsState: None
```

The corresponding script is as follows. The script performs the following actions:

- Acquires the current state of gs from /etc/gsinfo/state and determines whether it is "PreDelete"
    - If it is PreDelete, it indicates that the current gs should be in the offline phase. It checks whether the data flushing has been completed (in this example, the presence of a file indicates data flushing completion)
        - If the data flushing is not completed, it executes the data flushing action (in this example, it creates a file)
        - If the data flushing is completed, it outputs "done" and exits with 1.
    - If it is not PreDelete, it indicates that the gs has not entered the offline stage. It uses the number of people in the game server to determine whether it should now go offline.
        - If the number of people on the game server equals 0, it outputs "WaitToBeDeleted" and exits with 1.
        - If the number of people on the game server is not 0, it exits with 0.

```
#!/bin/bash

file_path="/etc/gsinfo/state"
data_flushed_file="/etc/gsinfo/data_flushed"

if [[ ! -f "$file_path" ]]; then
    exit 0
fi

state_content=$(cat "$file_path")

if [[ "$state_content" == "PreDelete" ]]; then
    if [[ -f "$data_flushed_file" ]]; then
        echo "done"
        exit 1
    else
        touch "$data_flushed_file"
        echo "WaitToBeDeleted"
        exit 1
    fi
else
    people_count_file="/etc/gsinfo/people_count"

    people_count=$(cat "$people_count_file")
    
    if [[ "$people_count" -eq 0 ]]; then
        echo "WaitToBeDeleted"
        exit 1
    else
        exit 0
    fi
fi
```

![grace-deletion.png](../../static/img/kruisegame/user-manuals/gs-lifecycle-delete.png)

The process of elegant delete as follow:
1. The game server is running normally, and the number of players is not 0.
2. When the number of players drops to 0, set the opsState to WaitToBeDeleted using custom service quality settings.
3. Through the automatic scaling policy, OKG deletes the GameServer with WaitToBeDeleted opsState. Since the lifecycle hook is configured and the delete-block label will be set to true, the gs is not truly deleted but enters the PreDelete state, and the data flushing process is triggered by custom service quality.
4. Once data flushing is complete, set the delete-block label to false using custom service quality to release the checkpoint.
5. After the checkpoint is released, the PreDelete phase moves into the Delete phase. The gs is then truly deleted.
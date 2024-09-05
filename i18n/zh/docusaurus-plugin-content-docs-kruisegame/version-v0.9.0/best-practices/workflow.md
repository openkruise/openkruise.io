# Best Practices for Game O&M Workflow

## Background
Due to the stateful nature of game servers, for game operations, it often requires corresponding processing based on the current business state to avoid harming the player experience. OKG provides the capacity for game server state awareness and targeted management, with the prerequisite ability to handle differently according to different states. In actual production, an operation process is a combination of multiple operation actions, and operation engineers often need to perform the repetitive actions of "Game Server State Confirmation" → "Game Server Operation", which also leads to a certain level of operational complexity after the game servers become cloud-native.
This article will combine the practical scenario of "Seamless Release of Room Services" to show readers how to effectively combine operations on GameServerSet and GameServer with Argo Workflow, thus building a smooth and efficient operation workflow.

## Examples

### Scenario Description

"Seamless Release of Room Services" needs to meet the following characteristics:

Old version rooms that are in-game are unaffected, while idle old version room services need to be recycled and cleaned up.
Have a certain number of new version rooms available for new players to join at any time. To ensure "room seamless" in the new version release, room services will choose the OnDelete update strategy at the time of delivery, to achieve the effect that existing rooms are not deleted and newly created rooms use a new image. Additionally, the corresponding GameServerSet can achieve automated lifecycle management through configuration of OKG custom service quality and auto-scaling policies. Please refer to https://openkruise.io/kruisegame/best-practices/session-based-game for the best practice document on room services.

### New Version Release Process

Based on the above delivery content, operation engineers will perform the following actions when updating a new version:

1. Update the GameServerSet image; at this time, the room services that are running will not be deleted or rebuilt.
2. Expand the GameServerSet to generate enough new version room services.
3. Confirm whether the new version room services are in a normal service state.
4. Clear idle old version rooms. Next, we will show through an example how to complete the above process with one click.

### Simulate the State of the Legacy Old Version Room Service

_Note: OKG must be installed in the cluster._

There are 3 old version room services in the cluster, with image tag 1.12.2.

```
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    type: OnDelete
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
EOF
```
Among them, minecraft-0 has players.

```
kubectl patch gs minecraft-0 --type=merge -p '{"spec":{"opsState":"Allocated"}}'
```

Current status:

```
kubectl get gs
NAME          STATE   OPSSTATE    DP    UP    AGE
minecraft-0   Ready   Allocated   0     0     27s
minecraft-1   Ready   None        0     0     27s
minecraft-2   Ready   None        0     0     27s
```

### One-Click Release of New Version Through Workflow

_Note: [Argo Workflow component](https://argoproj.github.io/argo-workflows/) must be installed in the cluster._

Deploy the following Yaml, and execute kubectl create -f workflow-demo.yaml.
```
# workflow-demo.yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: workflow-demo-
  namespace: kruise-game-system
spec:
  serviceAccountName: kruise-game-controller-manager
  entrypoint: main
  templates:
    - name: main
      steps:
        - - name: patch-image
            template: patch-image
        - - name: scale-replicas
            template: scale-replicas
        - - name: check-pods-ready
            template: check-pods-ready
        - - name: gs-update
            template: gs-update
    - name: patch-image
      resource:
        action: patch
        mergeStrategy: merge
        manifest: |
          apiVersion: game.kruise.io/v1alpha1
          kind: GameServerSet
          metadata:
            name: minecraft
            namespace: default
          spec:
            gameServerTemplate:
              spec:
                containers:
                - name: minecraft
                  image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new
    - name: scale-replicas
      resource:
        action: patch
        mergeStrategy: merge
        manifest: |
          apiVersion: game.kruise.io/v1alpha1
          kind: GameServerSet
          metadata:
            name: minecraft
            namespace: default
          spec:
            replicas: 6
    - name: check-pods-ready
      retryStrategy:
        retryPolicy: "OnError"
        backoff:
          duration: "10s"
          factor: 2
      script:
        image: registry.cn-beijing.aliyuncs.com/chrisliu95/kubectl:latest
        command: [bash]
        source: |
          #!/bin/bash
          DESIRED_IMAGE="registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new"
          LABEL_SELECTOR="game.kruise.io/owner-gss=minecraft"
          DESIRED_READY_COUNT=3  # The desired count of ready Pods
          NAMESPACE="default"  # Modify the namespace appropriately
          # Use kubectl to get all Pods with the correct labels
          PODS_JSON=$(kubectl get pods -n ${NAMESPACE} -l ${LABEL_SELECTOR} -o json)
          # Initialize the count of ready Pods
          COUNT_READY=0
          # Use the provided JSON information to find matching pods (and their status)
          for pod in $(echo "$PODS_JSON" | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name'); do
            # Get the image of each container in the Pod and check if the Pod is ready
            POD_IMAGES=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\"$pod\") | .spec.containers[].image")
            IS_READY=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\"$pod\") | .status.conditions[] | select(.type==\"Ready\") | .status")
            if [[ "$POD_IMAGES" == *"$DESIRED_IMAGE"* && "$IS_READY" == "True" ]]; then
              COUNT_READY=$((COUNT_READY+1))
            fi
          done
          # Output the count of ready Pods
          echo "Ready Pods with image ${DESIRED_IMAGE}: ${COUNT_READY}"
          # Compare the actual count of ready Pods with the desired count
          if [[ "${COUNT_READY}" -eq "${DESIRED_READY_COUNT}" ]]; then
            echo "The number of ready Pods matches the desired count of ${DESIRED_READY_COUNT}."
          else
            echo "The number of ready Pods (${COUNT_READY}) does not match the desired count of ${DESIRED_READY_COUNT}."
            exit 1
          fi
    - name: gs-update
      container:
        image: registry.cn-beijing.aliyuncs.com/chrisliu95/gs-updater:v1.2
        command:
          - /updater
        args:
          - --gss-name=minecraft
          - --namespace=default
          - --select-opsState=None
          - --select-not-container-image=minecraft/registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new
          - --exp-opsState=WaitToBeDeleted
```

The workflow contains four steps, corresponding to the four steps of the release process mentioned earlier, involving three types of templates:

- resource — Performs operations on K8s objects. In this case, step 1/2 performs a patch operation on the GameServerSet, respectively updating the image version to 1.12.2-new and expanding the service with 3 new version rooms. Note that this workflow is configured with a service account to obtain the necessary permissions to operate cluster resources. For demonstration ease, the service account kruise-game-controller-manager under the kruise-game-system namespace is used.
- script — Launches a container to execute a custom script. In this case, step 3 uses a base container with the kubectl command line to check the status of the newly expanded pods in script form, ensuring accurate Ready numbers before proceeding to the next phase. Here a retry strategy is configured: if execution fails (OnError), it will be verified again with a 10s interval, where the interval duration multiplies by 2.
- container — Launches a container with the corresponding parameters to execute commands. In this case, step 3 uses the [GameServer-Updater](https://github.com/CloudNativeGame/GameServers-Updater) tool, which can batch set the status of gs. At this point, the opsState of the room service, whose version number is not 1.12.2-new and opsState is None, is set to WaitToBeDeleted. This way, subsequent automatic shrinkage can automatically complete the cleanup of the old versions. 

After the workflow execution, four workflow pods will be sequentially created. Room services with numbers 3, 4, and 5 are newly expanded, and the idle old version room services numbered 1 and 2 are set to WaitToBeDeleted:
```
kubectl get workflow -n kruise-game-system
NAME                  STATUS      AGE
workflow-demo-cb56r   Running     8s

kubectl get po -n kruise-game-system | grep workflow
workflow-demo-cb56r-1053258062                    0/1     Completed   0          40s
workflow-demo-cb56r-2754258264                    0/2     Completed   0          10s
workflow-demo-cb56r-3772280549                    0/2     Completed   0          30s
workflow-demo-cb56r-644543209                     0/1     Completed   0          61s

kubectl get gs
NAME          STATE   OPSSTATE          DP    UP    AGE
minecraft-0   Ready   Allocated         0     0     2m18s
minecraft-1   Ready   WaitToBeDeleted   0     0     2m18s
minecraft-2   Ready   WaitToBeDeleted   0     0     2m18s
minecraft-3   Ready   None              0     0     57s
minecraft-4   Ready   None              0     0     57s
minecraft-5   Ready   None              0     0     57s

kubectl get workflow -n kruise-game-system
NAME                  STATUS      AGE
workflow-demo-cb56r   Succeeded   108s
```


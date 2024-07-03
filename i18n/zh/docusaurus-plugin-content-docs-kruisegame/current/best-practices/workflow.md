# 游戏运维工作流最佳实践

## 背景

由于游戏服务器有状态的特性，对于游戏运维而言，通常需要根据当前业务状态进行相应处理，以避免玩家体验受损。OKG提供了游戏服务器状态感知和定向管理的能力，具备根据不同状态进行不同处理的前提条件。在实际生产过程中，一个运维流程是多个运维动作的组合，运维工程师往往需要进行“游戏服状态确认” → “游戏服操作”的往复动作，这也导致游戏服云原生化后依然存在一定的操作复杂度。

本文将结合“房间服无损发布”这一实际场景，向读者展示如何通过Argo Workflow将对GameServerSet和GameServer的运维动作有效组合起来，从而构筑一套既流畅又高效的运维工作流。

## 示例

### 场景说明

“房间服无损发布” 需要满足以下特点：

- 正在游戏的旧版本房间不受影响，而空闲的旧版本房间服需要被回收清理
- 存在一定数量的新版本房间，可让新连接的玩家随时进入

为在新版本发布保证“房间无损”，房间服在交付时会选择 OnDelete 更新策略，以实现存量房间不被删除，新创建的房间使用新的镜像的效果。此外，对应GameServerSet可以通过配置OKG自定义服务质量与自动伸缩策略实现自动化生命周期管理。有关房间服最佳实践文档可参考 https://openkruise.io/zh/kruisegame/best-practices/session-based-game

### 新版发布流程

基于以上交付内容，运维工程师在更新新版本时将进行以下动作：

1. 更新GameServerSet镜像，此时正在运行的房间服不会删除或重建
2. 对GameServerSet进行扩容，扩容出足够多的新版本房间服
3. 确认新版本房间服的状态是否正常提供服务
4. 清理旧版本的空闲房间

接下来我们将通过一个示例展示如何一键式完成以上流程。

### 模拟存量旧版本房间服状态

*注：集群中需安装OKG*

集群中有3个旧版本房间服，版本号为`1.12.2`

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

其中，minecraft-0存在玩家

```
kubectl patch gs minecraft-0 --type=merge -p '{"spec":{"opsState":"Allocated"}}'
```

现状：

```
kubectl get gs
NAME          STATE   OPSSTATE    DP    UP    AGE
minecraft-0   Ready   Allocated   0     0     27s
minecraft-1   Ready   None        0     0     27s
minecraft-2   Ready   None        0     0     27s
```

### 通过Workflow进行新版本一键发布

*注：集群中需要安装[Argo Workflow组件](https://argoproj.github.io/workflows/)*

部署如下Yaml，执行 kubectl create -f workflow-demo.yaml

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
          DESIRED_READY_COUNT=3  # 你期望的就绪 Pod 的数量
          NAMESPACE="default"  # 适当地更改名称空间

          # 使用 kubectl 获取所有包含正确标签的 Pods
          PODS_JSON=$(kubectl get pods -n ${NAMESPACE} -l ${LABEL_SELECTOR} -o json)

          # 初始化就绪的 Pods 数量
          COUNT_READY=0

          # 根据提供的JSON信息来查找匹配的pods（以及它们的状态）
          for pod in $(echo "$PODS_JSON" | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name'); do
            # 获取 Pod 的每个容器的镜像并检查是否 Pod 就绪
            POD_IMAGES=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\"$pod\") | .spec.containers[].image")
            IS_READY=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\"$pod\") | .status.conditions[] | select(.type==\"Ready\") | .status")

            if [[ "$POD_IMAGES" == *"$DESIRED_IMAGE"* && "$IS_READY" == "True" ]]; then
              COUNT_READY=$((COUNT_READY+1))
            fi
          done

          # 输出就绪的 Pods 数量
          echo "Ready Pods with image ${DESIRED_IMAGE}: ${COUNT_READY}"

          # 比较实际就绪的 Pods 数量与期待数量
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

该workflow包含了四个step，分别对应上述发布流程的四个步骤，涉及到三种类型的模版：

- resource —— 对K8s对象进行操作。本例中step 1/2 对GameServerSet进行了patch操作，分别更新镜像版本为`1.12.2-new`、以及扩充了`3`个新版本房间。注意该workflow配置了service account以获取操作集群资源的相应权限，为了方便展示，此处直接使用了 kruise-game-system 命名空间下的 kruise-game-controller-manager 对应的sa。
- script —— 启动容器执行自定义脚本。本例中 step 3 使用了带有kubectl命令行基础容器，以脚本的方式对新扩容出来的pod进行状态校验，确保Ready数量准确时再进入下一阶段。这里配置了重试策略：当执行失败（OnError）后会再次校验，间隔时长为10s，间隔时间延长的倍数为2。
- container —— 启动一个容器执行相应参数命令。本例中 step 3 使用了 [GameServer-Updater](https://github.com/CloudNativeGame/GameServers-Updater) 工具，可以批量设置gs的状态。此时，将版本号不为1.12.2-new且opsState是None的房间服的opsState设置为WaitToBeDeleted。这样后续通过自动缩容，即可完成自动化旧版本清理。

该workflow执行后，依次产生四个workflow pod。房间服新扩容出3、4、5号，且最终将空闲的1、2号的旧版本房间服设置为WaitToBeDeleted：

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
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7500],{28453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>i});var r=t(96540);const a={},o=r.createContext(a);function s(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),r.createElement(o.Provider,{value:n},e.children)}},81634:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"best-practices/workflow","title":"Best Practices for Game O&M Workflow","description":"Background","source":"@site/kruisegame/best-practices/workflow.md","sourceDirName":"best-practices","slug":"/best-practices/workflow","permalink":"/kruisegame/best-practices/workflow","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Best Practices for Agile Delivery and Operations Management of GameServers","permalink":"/kruisegame/best-practices/gameserver-delivery-management"},"next":{"title":"contribution","permalink":"/kruisegame/developer-manuals/contribution"}}');var a=t(74848),o=t(28453);const s={},i="Best Practices for Game O&M Workflow",c={},l=[{value:"Background",id:"background",level:2},{value:"Examples",id:"examples",level:2},{value:"Scenario Description",id:"scenario-description",level:3},{value:"New Version Release Process",id:"new-version-release-process",level:3},{value:"Simulate the State of the Legacy Old Version Room Service",id:"simulate-the-state-of-the-legacy-old-version-room-service",level:3},{value:"One-Click Release of New Version Through Workflow",id:"one-click-release-of-new-version-through-workflow",level:3}];function d(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"best-practices-for-game-om-workflow",children:"Best Practices for Game O&M Workflow"})}),"\n",(0,a.jsx)(n.h2,{id:"background",children:"Background"}),"\n",(0,a.jsx)(n.p,{children:'Due to the stateful nature of game servers, for game operations, it often requires corresponding processing based on the current business state to avoid harming the player experience. OKG provides the capacity for game server state awareness and targeted management, with the prerequisite ability to handle differently according to different states. In actual production, an operation process is a combination of multiple operation actions, and operation engineers often need to perform the repetitive actions of "Game Server State Confirmation" \u2192 "Game Server Operation", which also leads to a certain level of operational complexity after the game servers become cloud-native.\nThis article will combine the practical scenario of "Seamless Release of Room Services" to show readers how to effectively combine operations on GameServerSet and GameServer with Argo Workflow, thus building a smooth and efficient operation workflow.'}),"\n",(0,a.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,a.jsx)(n.h3,{id:"scenario-description",children:"Scenario Description"}),"\n",(0,a.jsx)(n.p,{children:'"Seamless Release of Room Services" needs to meet the following characteristics:'}),"\n",(0,a.jsxs)(n.p,{children:['Old version rooms that are in-game are unaffected, while idle old version room services need to be recycled and cleaned up.\nHave a certain number of new version rooms available for new players to join at any time. To ensure "room seamless" in the new version release, room services will choose the OnDelete update strategy at the time of delivery, to achieve the effect that existing rooms are not deleted and newly created rooms use a new image. Additionally, the corresponding GameServerSet can achieve automated lifecycle management through configuration of OKG custom service quality and auto-scaling policies. Please refer to ',(0,a.jsx)(n.a,{href:"https://openkruise.io/kruisegame/best-practices/session-based-game",children:"https://openkruise.io/kruisegame/best-practices/session-based-game"})," for the best practice document on room services."]}),"\n",(0,a.jsx)(n.h3,{id:"new-version-release-process",children:"New Version Release Process"}),"\n",(0,a.jsx)(n.p,{children:"Based on the above delivery content, operation engineers will perform the following actions when updating a new version:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Update the GameServerSet image; at this time, the room services that are running will not be deleted or rebuilt."}),"\n",(0,a.jsx)(n.li,{children:"Expand the GameServerSet to generate enough new version room services."}),"\n",(0,a.jsx)(n.li,{children:"Confirm whether the new version room services are in a normal service state."}),"\n",(0,a.jsx)(n.li,{children:"Clear idle old version rooms. Next, we will show through an example how to complete the above process with one click."}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"simulate-the-state-of-the-legacy-old-version-room-service",children:"Simulate the State of the Legacy Old Version Room Service"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.em,{children:"Note: OKG must be installed in the cluster."})}),"\n",(0,a.jsx)(n.p,{children:"There are 3 old version room services in the cluster, with image tag 1.12.2."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"cat <<EOF | kubectl apply -f -\napiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    type: OnDelete\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n          name: minecraft\nEOF\n"})}),"\n",(0,a.jsx)(n.p,{children:"Among them, minecraft-0 has players."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'kubectl patch gs minecraft-0 --type=merge -p \'{"spec":{"opsState":"Allocated"}}\'\n'})}),"\n",(0,a.jsx)(n.p,{children:"Current status:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"kubectl get gs\nNAME          STATE   OPSSTATE    DP    UP    AGE\nminecraft-0   Ready   Allocated   0     0     27s\nminecraft-1   Ready   None        0     0     27s\nminecraft-2   Ready   None        0     0     27s\n"})}),"\n",(0,a.jsx)(n.h3,{id:"one-click-release-of-new-version-through-workflow",children:"One-Click Release of New Version Through Workflow"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsxs)(n.em,{children:["Note: ",(0,a.jsx)(n.a,{href:"https://argoproj.github.io/argo-workflows/",children:"Argo Workflow component"})," must be installed in the cluster."]})}),"\n",(0,a.jsx)(n.p,{children:"Deploy the following Yaml, and execute kubectl create -f workflow-demo.yaml."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'# workflow-demo.yaml\napiVersion: argoproj.io/v1alpha1\nkind: Workflow\nmetadata:\n  generateName: workflow-demo-\n  namespace: kruise-game-system\nspec:\n  serviceAccountName: kruise-game-controller-manager\n  entrypoint: main\n  templates:\n    - name: main\n      steps:\n        - - name: patch-image\n            template: patch-image\n        - - name: scale-replicas\n            template: scale-replicas\n        - - name: check-pods-ready\n            template: check-pods-ready\n        - - name: gs-update\n            template: gs-update\n    - name: patch-image\n      resource:\n        action: patch\n        mergeStrategy: merge\n        manifest: |\n          apiVersion: game.kruise.io/v1alpha1\n          kind: GameServerSet\n          metadata:\n            name: minecraft\n            namespace: default\n          spec:\n            gameServerTemplate:\n              spec:\n                containers:\n                - name: minecraft\n                  image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new\n    - name: scale-replicas\n      resource:\n        action: patch\n        mergeStrategy: merge\n        manifest: |\n          apiVersion: game.kruise.io/v1alpha1\n          kind: GameServerSet\n          metadata:\n            name: minecraft\n            namespace: default\n          spec:\n            replicas: 6\n    - name: check-pods-ready\n      retryStrategy:\n        retryPolicy: "OnError"\n        backoff:\n          duration: "10s"\n          factor: 2\n      script:\n        image: registry.cn-beijing.aliyuncs.com/chrisliu95/kubectl:latest\n        command: [bash]\n        source: |\n          #!/bin/bash\n          DESIRED_IMAGE="registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new"\n          LABEL_SELECTOR="game.kruise.io/owner-gss=minecraft"\n          DESIRED_READY_COUNT=3  # The desired count of ready Pods\n          NAMESPACE="default"  # Modify the namespace appropriately\n          # Use kubectl to get all Pods with the correct labels\n          PODS_JSON=$(kubectl get pods -n ${NAMESPACE} -l ${LABEL_SELECTOR} -o json)\n          # Initialize the count of ready Pods\n          COUNT_READY=0\n          # Use the provided JSON information to find matching pods (and their status)\n          for pod in $(echo "$PODS_JSON" | jq -r \'.items[] | select(.status.phase=="Running") | .metadata.name\'); do\n            # Get the image of each container in the Pod and check if the Pod is ready\n            POD_IMAGES=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\\"$pod\\") | .spec.containers[].image")\n            IS_READY=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\\"$pod\\") | .status.conditions[] | select(.type==\\"Ready\\") | .status")\n            if [[ "$POD_IMAGES" == *"$DESIRED_IMAGE"* && "$IS_READY" == "True" ]]; then\n              COUNT_READY=$((COUNT_READY+1))\n            fi\n          done\n          # Output the count of ready Pods\n          echo "Ready Pods with image ${DESIRED_IMAGE}: ${COUNT_READY}"\n          # Compare the actual count of ready Pods with the desired count\n          if [[ "${COUNT_READY}" -eq "${DESIRED_READY_COUNT}" ]]; then\n            echo "The number of ready Pods matches the desired count of ${DESIRED_READY_COUNT}."\n          else\n            echo "The number of ready Pods (${COUNT_READY}) does not match the desired count of ${DESIRED_READY_COUNT}."\n            exit 1\n          fi\n    - name: gs-update\n      container:\n        image: registry.cn-beijing.aliyuncs.com/chrisliu95/gs-updater:v1.2\n        command:\n          - /updater\n        args:\n          - --gss-name=minecraft\n          - --namespace=default\n          - --select-opsState=None\n          - --select-not-container-image=minecraft/registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new\n          - --exp-opsState=WaitToBeDeleted\n'})}),"\n",(0,a.jsx)(n.p,{children:"The workflow contains four steps, corresponding to the four steps of the release process mentioned earlier, involving three types of templates:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"resource \u2014 Performs operations on K8s objects. In this case, step 1/2 performs a patch operation on the GameServerSet, respectively updating the image version to 1.12.2-new and expanding the service with 3 new version rooms. Note that this workflow is configured with a service account to obtain the necessary permissions to operate cluster resources. For demonstration ease, the service account kruise-game-controller-manager under the kruise-game-system namespace is used."}),"\n",(0,a.jsx)(n.li,{children:"script \u2014 Launches a container to execute a custom script. In this case, step 3 uses a base container with the kubectl command line to check the status of the newly expanded pods in script form, ensuring accurate Ready numbers before proceeding to the next phase. Here a retry strategy is configured: if execution fails (OnError), it will be verified again with a 10s interval, where the interval duration multiplies by 2."}),"\n",(0,a.jsxs)(n.li,{children:["container \u2014 Launches a container with the corresponding parameters to execute commands. In this case, step 3 uses the ",(0,a.jsx)(n.a,{href:"https://github.com/CloudNativeGame/GameServers-Updater",children:"GameServer-Updater"})," tool, which can batch set the status of gs. At this point, the opsState of the room service, whose version number is not 1.12.2-new and opsState is None, is set to WaitToBeDeleted. This way, subsequent automatic shrinkage can automatically complete the cleanup of the old versions."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"After the workflow execution, four workflow pods will be sequentially created. Room services with numbers 3, 4, and 5 are newly expanded, and the idle old version room services numbered 1 and 2 are set to WaitToBeDeleted:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"kubectl get workflow -n kruise-game-system\nNAME                  STATUS      AGE\nworkflow-demo-cb56r   Running     8s\n\nkubectl get po -n kruise-game-system | grep workflow\nworkflow-demo-cb56r-1053258062                    0/1     Completed   0          40s\nworkflow-demo-cb56r-2754258264                    0/2     Completed   0          10s\nworkflow-demo-cb56r-3772280549                    0/2     Completed   0          30s\nworkflow-demo-cb56r-644543209                     0/1     Completed   0          61s\n\nkubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   Allocated         0     0     2m18s\nminecraft-1   Ready   WaitToBeDeleted   0     0     2m18s\nminecraft-2   Ready   WaitToBeDeleted   0     0     2m18s\nminecraft-3   Ready   None              0     0     57s\nminecraft-4   Ready   None              0     0     57s\nminecraft-5   Ready   None              0     0     57s\n\nkubectl get workflow -n kruise-game-system\nNAME                  STATUS      AGE\nworkflow-demo-cb56r   Succeeded   108s\n"})})]})}function m(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}}}]);
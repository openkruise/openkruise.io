"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[413],{10106:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"user-manuals/deploy-gameservers","title":"Deploy Gameservers","description":"\u201cHello World\u201d of OKG","source":"@site/kruisegame/user-manuals/deploy-gameservers.md","sourceDirName":"user-manuals","slug":"/user-manuals/deploy-gameservers","permalink":"/kruisegame/user-manuals/deploy-gameservers","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Design Concept","permalink":"/kruisegame/design-concept"},"next":{"title":"Hot Update","permalink":"/kruisegame/user-manuals/hot-update"}}');var r=a(74848),t=a(28453);const i={},o="Deploy Gameservers",c={},l=[{value:"\u201cHello World\u201d of OKG",id:"hello-world-of-okg",level:2},{value:"ID awareness",id:"id-awareness",level:2},{value:"Service discovery of game server stateful instances",id:"service-discovery-of-game-server-stateful-instances",level:2},{value:"Service registration",id:"service-registration",level:3},{value:"DNS",id:"dns",level:3},{value:"Synchronization of Labels/Annotations from GameServer to Pod",id:"synchronization-of-labelsannotations-from-gameserver-to-pod",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"deploy-gameservers",children:"Deploy Gameservers"})}),"\n",(0,r.jsx)(n.h2,{id:"hello-world-of-okg",children:"\u201cHello World\u201d of OKG"}),"\n",(0,r.jsx)(n.p,{children:"You can use GameServerSet to deploy game servers. A simple deployment case is as follows:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cat <<EOF | kubectl apply -f -\napiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n          name: minecraft\nEOF\n"})}),"\n",(0,r.jsx)(n.p,{children:"After the GameServerSet is created, three game servers and three corresponding pods appear in the cluster, because the specified number of replicas is 3."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get gss\nNAME        AGE\nminecraft   9s\n\nkubectl get gs\nNAME          STATE   OPSSTATE   DP    UP   AGE\nminecraft-0   Ready   None       0     0    10s\nminecraft-1   Ready   None       0     0    10s\nminecraft-2   Ready   None       0     0    10s\n\nkubectl get pod\nNAME            READY   STATUS    RESTARTS   AGE\nminecraft-0     1/1     Running   0          10s\nminecraft-1     1/1     Running   0          10s\nminecraft-2     1/1     Running   0          10s\n"})}),"\n",(0,r.jsx)(n.h2,{id:"id-awareness",children:"ID awareness"}),"\n",(0,r.jsx)(n.p,{children:"Due to the stateful nature of game servers, they usually need unique identifiers to distinguish each other. This is why the name of the GameServer managed by GameServerSet ends with an ID number."}),"\n",(0,r.jsx)(n.p,{children:"In some cases, the game server business itself needs to be aware of its own ID, which can be used as a regional server attribute mark or a basis for configuration management.\nAt this time, the corresponding identification ID can be sunk into the container through DownwardAPI. Here's an example:"}),"\n",(0,r.jsx)(n.p,{children:"Deploy a GameServerSet, and the environment variable GS_NAME in the generated game server container will have the corresponding name as its value:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n          name: minecraft\n          env:\n          - name: GS_NAME\n            valueFrom:\n              fieldRef:\n                fieldPath: metadata.name\n"})}),"\n",(0,r.jsx)(n.p,{children:"3 game servers will be generated:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     31s\nminecraft-1   Ready   None       0     0     31s\nminecraft-2   Ready   None       0     0     31s\n"})}),"\n",(0,r.jsx)(n.p,{children:"Check the GS_NAME environment variables of these three game servers separately and find that the GS_NAME of the three game servers corresponds to their own names."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl exec  minecraft-0 -- env | grep GS_NAME\nGS_NAME=minecraft-0\n\nkubectl exec  minecraft-1 -- env | grep GS_NAME\nGS_NAME=minecraft-1\n\nkubectl exec  minecraft-2 -- env | grep GS_NAME\nGS_NAME=minecraft-2\n"})}),"\n",(0,r.jsx)(n.p,{children:"In this way, the game program can perform configuration management and other operations by parsing the GS_NAME environment variable when it is started."}),"\n",(0,r.jsx)(n.h2,{id:"service-discovery-of-game-server-stateful-instances",children:"Service discovery of game server stateful instances"}),"\n",(0,r.jsx)(n.p,{children:"Due to the stateful nature of game servers, access often requires specific pod instances, and the load balancing features of traditional k8s services cannot be used. OKG supports the DNS mechanism of stateful services to achieve interactive access between game servers within the cluster."}),"\n",(0,r.jsx)(n.p,{children:"The following example will involve two services, the minecraft game server and the accessor. Minecraft is called by the accessor."}),"\n",(0,r.jsx)(n.h3,{id:"service-registration",children:"Service registration"}),"\n",(0,r.jsx)(n.p,{children:"Normally, when a game server needs to be accessed internally, it needs to register its own information with the corresponding service so that the accessor can know which pods are accessible; correspondingly, when the game server exits, it also needs corresponding structural actions, such as deregistration. The accessor knows that the pod no longer provides services."}),"\n",(0,r.jsx)(n.p,{children:"As mentioned earlier, the only identifier of the game server is its ID (or name). Use the DownwardAPI mentioned above to sink GS_NAME into the container, and then register it with the corresponding service when the container starts."}),"\n",(0,r.jsx)(n.p,{children:"After the Yaml deployment is completed according to the previous article, there are 3 minecraft pods in the cluster:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get po -owide\n...\nminecraft-0     1/1     Running   0     10s     172.16.0.64     xxx       <none>           2/2\nminecraft-1     1/1     Running   0     10s     172.16.0.6      xxx       <none>           2/2\nminecraft-2     1/1     Running   0     10s     172.16.0.12     xxx       <none>           2/2\n"})}),"\n",(0,r.jsx)(n.h3,{id:"dns",children:"DNS"}),"\n",(0,r.jsx)(n.p,{children:"In order to enable the pod of the game server to be accessed individually, in addition to deploying GameServerSet, it is also necessary to deploy a headless service with the same name as GameServerSet. In this example, its Yaml is as follows:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Service\nmetadata:\n  name: minecraft\nspec:\n  clusterIP: None\n  selector:\n    game.kruise.io/owner-gss: minecraft # Fill in the name of GameServerSet\n"})}),"\n",(0,r.jsx)(n.p,{children:"Deploy a simple accessor Yaml to access the corresponding minecraft pod within the container"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: accessor\n  namespace: default\nspec:\n  replicas: 1\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: busybox\n          name: accessor\n          args:\n            - sleep\n            - "3600"\n          command: ["/bin/sh", "-c", "sleep 3600"]\n'})}),"\n",(0,r.jsx)(n.p,{children:"Enter the accessor container and ping the corresponding minecraft pod (this step simulates the access logic in the real environment. Of course, choosing which pod to access requires certain filtering rules):"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it accessor-0 /bin/sh\n/ # \n/ # ping minecraft-2.minecraft.default.svc.cluster.local\nPING minecraft-2.minecraft.default.svc.cluster.local (172.16.0.12): 56 data bytes\n64 bytes from 172.16.0.12: seq=0 ttl=63 time=0.082 ms\n64 bytes from 172.16.0.12: seq=1 ttl=63 time=0.061 ms\n64 bytes from 172.16.0.12: seq=2 ttl=63 time=0.072 ms\n"})}),"\n",(0,r.jsxs)(n.p,{children:["It can be found that the accessor successfully accessed minecraft-2, and the DNS successfully resolved to the corresponding intranet IP address. The DNS rules here are as follows: ",(0,r.jsx)(n.code,{children:"{pod-name}.{gss-name}.{namespace-name}.svc.cluster.local"})]}),"\n",(0,r.jsx)(n.h2,{id:"synchronization-of-labelsannotations-from-gameserver-to-pod",children:"Synchronization of Labels/Annotations from GameServer to Pod"}),"\n",(0,r.jsx)(n.p,{children:"As mentioned above, through the DownwardAPI, information from pod labels/annotations can be propagated downwards into containers. Sometimes, we wish to synchronize the labels/annotations of a GameServer to its Pod, in order to complete the action of sinking GameServer metadata information."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'kubectl patch gs minecraft-0 --type=\'merge\' -p \'{"metadata":{"annotations":{"gs-sync/test-key":"some-value"}}}\'\ngameserver.game.kruise.io/minecraft-0 patched\n'})}),"\n",(0,r.jsx)(n.p,{children:"Then, we get pod minecraft-0:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get po minecraft-0 -oyaml | grep gs-sync\n    gs-sync/test-key: some-value\n"})})]})}function m(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>o});var s=a(96540);const r={},t=s.createContext(r);function i(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);
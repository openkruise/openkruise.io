"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5867],{28453:(e,n,a)=>{a.d(n,{R:()=>r,x:()=>c});var t=a(96540);const i={},s=t.createContext(i);function r(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(s.Provider,{value:n},e.children)}},86032:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/warning-ding-5b4cdf9f5265811b0852883ce42976b1.png"},94268:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>m,frontMatter:()=>r,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"user-manuals/service-qualities","title":"\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf","description":"\u529f\u80fd\u6982\u8ff0","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/user-manuals/service-qualities.md","sourceDirName":"user-manuals","slug":"/user-manuals/service-qualities","permalink":"/zh/kruisegame/user-manuals/service-qualities","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236","permalink":"/zh/kruisegame/user-manuals/container-startup-sequence-control"},"next":{"title":"\u7f51\u7edc\u6a21\u578b","permalink":"/zh/kruisegame/user-manuals/network"}}');var i=a(74848),s=a(28453);const r={},c="\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf",l={},o=[{value:"\u529f\u80fd\u6982\u8ff0",id:"\u529f\u80fd\u6982\u8ff0",level:2},{value:"\u4f7f\u7528\u8bf4\u660e",id:"\u4f7f\u7528\u8bf4\u660e",level:2},{value:"\u4f7f\u7528\u793a\u4f8b",id:"\u4f7f\u7528\u793a\u4f8b",level:2},{value:"\u4f7f\u7528\u573a\u666f",id:"\u4f7f\u7528\u573a\u666f",level:2},{value:"\u6e38\u620f\u670d\u7a7a\u95f2\u8bbe\u7f6e\u5373\u5c06\u4e0b\u7ebf",id:"\u6e38\u620f\u670d\u7a7a\u95f2\u8bbe\u7f6e\u5373\u5c06\u4e0b\u7ebf",level:3},{value:"\u6e38\u620f\u670d\u72b6\u6001\u5f02\u5e38\u8bbe\u7f6e\u7ef4\u62a4\u4e2d",id:"\u6e38\u620f\u670d\u72b6\u6001\u5f02\u5e38\u8bbe\u7f6e\u7ef4\u62a4\u4e2d",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf",children:"\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf"})}),"\n",(0,i.jsx)(n.h2,{id:"\u529f\u80fd\u6982\u8ff0",children:"\u529f\u80fd\u6982\u8ff0"}),"\n",(0,i.jsx)(n.p,{children:'\u7531\u4e8e\u6e38\u620f\u662f\u6709\u72b6\u6001\u670d\u52a1\uff0c\u5f88\u591a\u65f6\u5019\u6e38\u620f\u670d\u662f\u4ee5\u4e00\u79cd "\u5bcc\u5bb9\u5668" \u7684\u5f62\u6001\u5b58\u5728\u4e8ePod\u4e4b\u4e2d\uff0c\u591a\u4e2a\u8fdb\u7a0b\u5728Pod\u4e2d\u7edf\u4e00\u7ba1\u7406\u3002\n\u7136\u800c\uff0c\u6bcf\u4e2a\u8fdb\u7a0b\u91cd\u8981\u6027\u5374\u6709\u6240\u4e0d\u540c\uff0c\u5bf9\u4e8e"\u8f7b\u91cf\u7ea7\u8fdb\u7a0b"\u9519\u8bef\u7684\u60c5\u51b5\uff0c\u7528\u6237\u5e76\u4e0d\u5e0c\u671b\u5c06\u6574\u4e2apod\u5220\u9664\u91cd\u5efa\uff0c\u50cfk8s\u539f\u751f\u7684liveness probe\u5e76\u4e0d\u80fd\u5f88\u597d\u5730\u6ee1\u8db3\u8fd9\u79cd\u9700\u6c42\uff0c\u8fc7\u4e8e\u50f5\u5316\u7684\u6a21\u5f0f\u4e0e\u6e38\u620f\u573a\u666f\u5e76\u4e0d\u9002\u914d\u3002\nOKG \u8ba4\u4e3a\u6e38\u620f\u670d\u7684\u670d\u52a1\u8d28\u91cf\u6c34\u5e73\u5e94\u8be5\u4ea4\u7531\u6e38\u620f\u5f00\u53d1\u8005\u5b9a\u4e49\uff0c\u5f00\u53d1\u8005\u53ef\u4ee5\u6839\u636e\u4e0d\u540c\u6e38\u620f\u670d\u72b6\u6001\u53bb\u8bbe\u7f6e\u5bf9\u5e94\u7684\u5904\u7406\u52a8\u4f5c\u3002\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u529f\u80fd\u662f\u63a2\u6d4b+\u52a8\u4f5c\u7684\u7ec4\u5408\uff0c\u901a\u8fc7\u8fd9\u79cd\u65b9\u5f0f\u5e2e\u52a9\u7528\u6237\u81ea\u52a8\u5316\u5730\u5904\u7406\u5404\u7c7b\u6e38\u620f\u670d\u72b6\u6001\u95ee\u9898\u3002'}),"\n",(0,i.jsx)(n.h2,{id:"\u4f7f\u7528\u8bf4\u660e",children:"\u4f7f\u7528\u8bf4\u660e"}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7 ",(0,i.jsx)(n.code,{children:"GameServerSet.Spec.ServiceQualities"})," \u4f7f\u7528\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u529f\u80fd\u3002\u5176\u8be6\u7ec6\u7684\u6570\u636e\u7ed3\u6784\u5982\u4e0b\uff1a"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'type GameServerSetSpec struct {\n\t// ...\n\tServiceQualities     []ServiceQuality   `json:"serviceQualities,omitempty"`\n\t// ...\n}\n\ntype ServiceQuality struct {\n\tcorev1.Probe  `json:",inline"`\n\tName          string `json:"name"`\n\tContainerName string `json:"containerName,omitempty"`\n\t// Whether to make GameServerSpec not change after the ServiceQualityAction is executed.\n\t// When Permanent is true, regardless of the detection results, ServiceQualityAction will only be executed once.\n\t// When Permanent is false, ServiceQualityAction can be executed again even though ServiceQualityAction has been executed.\n\tPermanent            bool                   `json:"permanent"`\n\tServiceQualityAction []ServiceQualityAction `json:"serviceQualityAction,omitempty"`\n}\n\ntype ServiceQualityAction struct {\n\tState bool `json:"state"`\n\t// Result indicate the probe message returned by the script.\n\t// When Result is defined, it would exec action only when the according Result is actually returns.\n\tResult         string `json:"result,omitempty"`\n\tGameServerSpec `json:",inline"`\n\tAnnotations    map[string]string `json:"annotations,omitempty"`\n\tLabels         map[string]string `json:"labels,omitempty"`\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"\u7528\u6237\u901a\u8fc7\u5b9e\u73b0\u4e00\u4e2a\u63a2\u6d4b\u811a\u672c\uff0c\u5c06\u5bb9\u5668\u4e2d\u7684\u4e1a\u52a1/\u8fd0\u7ef4\u72b6\u6001\u900f\u51fa\u81f3Kubernetes GameServer\u5bf9\u8c61\u4e0a\u3002\n\u652f\u6301\u591a\u7ed3\u679c\u8f93\u51fa\uff1a\u811a\u672c\u4e2d\u9000\u51fa\u78010 \u5bf9\u5e94 ServiceQualityAction \u7684 State \u4e3a true\uff1b\u811a\u672c\u4e2d\u9000\u51fa\u78011 \u5bf9\u5e94 ServiceQualityAction \u7684 State \u4e3a false\uff1b\u811a\u672c\u4e2d echo \u7684\u5b57\u7b26\u4e32\u5bf9\u5e94 ServiceQualityAction \u7684 Result \u503c\u3002\n\u5f53 State \u4e0e Result \u540c\u65f6\u6ee1\u8db3\u65f6\uff0cGameServer \u7684 GameServerSpec/Annotations/Labels \u5c06\u6309\u7167\u7528\u6237\u586b\u5199\u7684\u53c2\u6570\u8bbe\u7f6e\u3002\u5176\u4e2dGameServerSpec\u5305\u62ec OpsState/NetworkDisabled\u7b49\uff0c\u5177\u4f53\u5b57\u6bb5\u5982\u4e0b\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'type GameServerSpec struct {\n\tOpsState         OpsState            `json:"opsState,omitempty"`\n\tUpdatePriority   *intstr.IntOrString `json:"updatePriority,omitempty"`\n\tDeletionPriority *intstr.IntOrString `json:"deletionPriority,omitempty"`\n\tNetworkDisabled  bool                `json:"networkDisabled,omitempty"`\n\t// Containers can be used to make the corresponding GameServer container fields\n\t// different from the fields defined by GameServerTemplate in GameServerSetSpec.\n\tContainers []GameServerContainer `json:"containers,omitempty"`\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"\u4f7f\u7528\u793a\u4f8b",children:"\u4f7f\u7528\u793a\u4f8b"}),"\n",(0,i.jsx)(n.p,{children:"\u6211\u4eec\u6765\u901a\u8fc7\u4e00\u4e2a\u793a\u4f8b\u770b\u4e0b\u5982\u4f55\u901a\u8fc7\u4e00\u4e2a\u63a2\u6d4b\u811a\u672c\u5b9e\u73b0\u6e38\u620f\u670d\u591a\u79cd\u72b6\u6001\u611f\u77e5\u3002probe.sh \u662f\u4e1a\u52a1\u5bb9\u5668\u4e2d\u63a2\u6d4b\u811a\u672c\uff0c\u5c06\u88abOKG\u5468\u671f\u6027\u8c03\u7528\uff0c\u5176\u811a\u672c\u4ee3\u7801\u5982\u4e0b\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'#!/bin/bash\n\ngate=$(ps -ef | grep gate | grep -v grep | wc -l)\ndata=$(ps -ef | grep data | grep -v grep | wc -l)\n\nif [ $gate != 1 ]\nthen\n  echo "gate"\n  exit 0\nfi\n\nif [ $data != 1 ]\nthen\n  echo "data"\n  exit 0\nfi\n\nexit 1\n'})}),"\n",(0,i.jsx)(n.p,{children:"\u800c\u5bf9\u5e94\u7684GameServerSet\u7684yaml\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      maxUnavailable: 100%\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0\n          name: minecraft\n  serviceQualities:\n    - name: healthy\n      containerName: minecraft\n      permanent: false\n      exec:\n        command: ["bash", "./probe.sh"]\n      serviceQualityAction:\n        - state: true\n          result: gate\n          opsState: GateMaintaining\n        - state: true\n          result: data\n          opsState: DataMaintaining\n        - state: false\n          opsState: None\n'})}),"\n",(0,i.jsx)(n.p,{children:"\u90e8\u7f72\u5b8c\u6210\u540e\uff0c\u751f\u62103\u4e2aPod\u4e0eGameServer"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     14s\nminecraft-1   Ready   None       0     0     14s\nminecraft-2   Ready   None       0     0     14s\n\nkubectl get po\nNAME          READY   STATUS    RESTARTS   AGE\nminecraft-0   1/1     Running   0          15s\nminecraft-1   1/1     Running   0          15s\nminecraft-2   1/1     Running   0          15s\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u8fdb\u5165minecraft-0\u5bb9\u5668\u4e2d\uff0c\u6a21\u62dfgate\u8fdb\u7a0b\u6545\u969c\uff0c\u5c06\u5176\u5bf9\u5e94\u7684\u8fdb\u7a0b\u53f7kil"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-0 /bin/bash\n\n/data# ps -ef\nUID          PID    PPID  C STIME TTY          TIME CMD\nroot           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh\nroot           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh\nroot           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh\nroot           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.\n...\n\n/data# kill -9 7\n\n/data# exit\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u83b7\u53d6\u5f53\u524dgs\u7684opsState\uff0c\u5df2\u7ecf\u53d8\u4e3aGateMaintaining"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"\nkubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   GateMaintaining   0     0     2m14s\nminecraft-1   Ready   None              0     0     2m14s\nminecraft-2   Ready   None              0     0     2m14s\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u8fdb\u5165minecraft-1\u5bb9\u5668\u4e2d\uff0c\u6a21\u62dfdata\u8fdb\u7a0b\u6545\u969c\uff0c\u5c06\u5176\u5bf9\u5e94\u7684\u8fdb\u7a0b\u53f7kil"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-1 /bin/bash\n\n/data# ps -ef\nUID          PID    PPID  C STIME TTY          TIME CMD\nroot           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh\nroot           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh\nroot           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh\nroot           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.\n...\n\n/data# kill -9 8\n\n/data# exit\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u83b7\u53d6\u5f53\u524dgs\u7684opsState\uff0c\u5df2\u7ecf\u53d8\u4e3aDataMaintaining"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   GateMaintaining   0     0     3m10s\nminecraft-1   Ready   DataMaintaining   0     0     3m10s\nminecraft-2   Ready   None              0     0     3m10s\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u5206\u522b\u8fdb\u5165minecraft-0\uff0cminecraft-1\uff0c\u624b\u52a8\u62c9\u8d77\u6302\u6389\u7684\u8fdb\u7a0b\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-0 /bin/bash\n\n/data# bash ./gate.sh &\n\n/data# exit\n\nkubectl exec -it minecraft-1 /bin/bash\n\n/data# bash ./data.sh &\n\n/data# exit\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u6b64\u65f6\uff0cgs\u7684\u8fd0\u7ef4\u72b6\u6001\u5df2\u7ecf\u90fd\u6062\u590d\u4e3aNone"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     5m6s\nminecraft-1   Ready   None       0     0     5m6s\nminecraft-2   Ready   None       0     0     5m6s\n"})}),"\n",(0,i.jsx)(n.h2,{id:"\u4f7f\u7528\u573a\u666f",children:"\u4f7f\u7528\u573a\u666f"}),"\n",(0,i.jsx)(n.h3,{id:"\u6e38\u620f\u670d\u7a7a\u95f2\u8bbe\u7f6e\u5373\u5c06\u4e0b\u7ebf",children:"\u6e38\u620f\u670d\u7a7a\u95f2\u8bbe\u7f6e\u5373\u5c06\u4e0b\u7ebf"}),"\n",(0,i.jsx)(n.p,{children:"\u90e8\u7f72\u4e00\u4e2a\u5e26\u6709\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u7684GameServerSet\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'cat <<EOF | kubectl apply -f -\napiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:idle\n          name: minecraft\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      maxUnavailable: 100%\n  serviceQualities: # \u8bbe\u7f6e\u4e86\u4e00\u4e2aidle\u7684\u670d\u52a1\u8d28\u91cf\n    - name: idle\n      containerName: minecraft\n      permanent: false\n      #\u4e0e\u539f\u751fprobe\u7c7b\u4f3c\uff0c\u672c\u4f8b\u4f7f\u7528\u6267\u884c\u811a\u672c\u7684\u65b9\u5f0f\u63a2\u6d4b\u6e38\u620f\u670d\u662f\u5426\u7a7a\u95f2\uff0c\u4e0d\u5b58\u5728\u73a9\u5bb6\n      exec:\n        command: ["bash", "./idle.sh"]\n      serviceQualityAction:\n          #\u4e0d\u5b58\u5728\u73a9\u5bb6\uff0c\u6807\u8bb0\u8be5\u6e38\u620f\u670d\u8fd0\u7ef4\u72b6\u6001\u4e3aWaitToBeDeleted\n        - state: true\n          opsState: WaitToBeDeleted\n          #\u5b58\u5728\u73a9\u5bb6\uff0c\u6807\u8bb0\u8be5\u6e38\u620f\u670d\u8fd0\u7ef4\u72b6\u6001\u4e3aNone\n        - state: false\n          opsState: None\nEOF\n'})}),"\n",(0,i.jsx)(n.p,{children:"\u90e8\u7f72\u5b8c\u6210\u540e\uff0c\u7531\u4e8e\u8fd8\u672a\u5bfc\u5165\u73a9\u5bb6\uff0c\u6545\u6240\u6709\u6e38\u620f\u670d\u90fd\u4e3a\u7a7a\u95f2\u72b6\u6001\uff0c\u53ef\u4ee5\u4efb\u610f\u88ab\u5220\u9664\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"kubectl get gs\nNAME          STATE   OPSSTATE          DP    UP\nminecraft-0   Ready   WaitToBeDeleted   0     0\nminecraft-1   Ready   WaitToBeDeleted   0     0\nminecraft-2   Ready   WaitToBeDeleted   0     0\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u5f53\u6709\u73a9\u5bb6\u8fdb\u5165\u6e38\u620f\u670dminecraft-1\uff0c\u5219\u6e38\u620f\u670d\u7684\u8fd0\u7ef4\u72b6\u6001\u53d1\u751f\u53d8\u5316\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"kubectl get gs\nNAME          STATE   OPSSTATE          DP    UP\nminecraft-0   Ready   WaitToBeDeleted   0     0\nminecraft-1   Ready   None              0     0\nminecraft-2   Ready   WaitToBeDeleted   0     0\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u6b64\u65f6\u82e5\u53d1\u751f\u7f29\u5bb9\uff0c\u6e38\u620f\u670dminecraft-1\u5c06\u5f97\u5230\u4fdd\u62a4\uff0c\u907f\u514d\u4f18\u5148\u5220\u9664\u3002"}),"\n",(0,i.jsx)(n.h3,{id:"\u6e38\u620f\u670d\u72b6\u6001\u5f02\u5e38\u8bbe\u7f6e\u7ef4\u62a4\u4e2d",children:"\u6e38\u620f\u670d\u72b6\u6001\u5f02\u5e38\u8bbe\u7f6e\u7ef4\u62a4\u4e2d"}),"\n",(0,i.jsx)(n.p,{children:"\u90e8\u7f72\u4e00\u4e2a\u5e26\u6709\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u7684GameServerSet\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'cat <<EOF | kubectl apply -f -\napiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: demo-gs\n  namespace: default\nspec:\n  replicas: 3\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:healthy\n          name: minecraft\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      maxUnavailable: 100%\n  serviceQualities: # \u8bbe\u7f6e\u4e86\u4e00\u4e2ahealthy\u7684\u670d\u52a1\u8d28\u91cf\n    - name: healthy\n      containerName: minecraft\n      permanent: false\n      #\u4e0e\u539f\u751fprobe\u7c7b\u4f3c\uff0c\u672c\u4f8b\u4f7f\u7528\u6267\u884c\u811a\u672c\u7684\u65b9\u5f0f\u63a2\u6d4b\u6e38\u620f\u670d\u662f\u5426\u5065\u5eb7\n      exec:\n        command: ["bash", "./healthy.sh"]\n      serviceQualityAction:\n          #\u63a2\u6d4b\u5065\u5eb7\uff0c\u6807\u8bb0\u8be5\u6e38\u620f\u670d\u8fd0\u7ef4\u72b6\u6001\u4e3aNone\n        - state: true\n          opsState: None\n          #\u63a2\u6d4b\u4e0d\u5065\u5eb7\uff0c\u6807\u8bb0\u8be5\u6e38\u620f\u670d\u8fd0\u7ef4\u72b6\u6001\u4e3aMaintaining\n        - state: false\n          opsState: Maintaining\nEOF\n'})}),"\n",(0,i.jsx)(n.p,{children:"\u90e8\u7f72\u5b8c\u6210\u540e\uff0c\u7531\u4e8e\u4e00\u5207\u6b63\u5e38\uff0c\u6545\u6240\u6709\u6e38\u620f\u670d\u90fd\u4e3aNone\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"kubectl get gs\nNAME        STATE   OPSSTATE   DP    UP\ndemo-gs-0   Ready   None       0     0\ndemo-gs-1   Ready   None       0     0\ndemo-gs-2   Ready   None       0     0\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u6a21\u62dfdemo-gs-0\u67d0\u8fdb\u7a0b\u5b95\u673a\uff0c\u6e38\u620f\u670d\u53d8\u4e3aMaintaining\u72b6\u6001\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"kubectl get gs\nNAME        STATE   OPSSTATE     DP    UP\ndemo-gs-0   Ready   Maintaining  0     0\ndemo-gs-1   Ready   None         0     0\ndemo-gs-2   Ready   None         0     0\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u6b64\u65f6gameserver controller\u4f1a\u53d1\u51fa GameServer demo-gs-0 Warning \u7684 event\uff0c\u914d\u5408",(0,i.jsx)(n.a,{href:"https://github.com/AliyunContainerService/kube-eventer",children:"kube-event\u9879\u76ee"}),"\u53ef\u5b9e\u73b0\u5f02\u5e38\u901a\u77e5\uff1a"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:a(86032).A+"",width:"558",height:"223"})}),"\n",(0,i.jsx)(n.p,{children:"\u6b64\u5916\uff0cOKG \u672a\u6765\u4f1a\u96c6\u6210\u6e38\u620f\u670d\u81ea\u52a8\u6392\u969c/\u6062\u590d\u5de5\u5177\uff0c\u8fdb\u4e00\u6b65\u4e30\u5bcc\u6e38\u620f\u670d\u7684\u81ea\u52a8\u5316\u8fd0\u7ef4\u80fd\u529b\u3002"})]})}function m(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);
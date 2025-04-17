"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5480],{28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>a});var r=s(96540);const o={},t=r.createContext(o);function i(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(t.Provider,{value:n},e.children)}},52172:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"user-manuals/podprobemarker","title":"PodProbeMarker","description":"FEATURE STATE: Kruise v1.3.0","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.8/user-manuals/podprobemarker.md","sourceDirName":"user-manuals","slug":"/user-manuals/podprobemarker","permalink":"/zh/docs/user-manuals/podprobemarker","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/podprobemarker.md","tags":[],"version":"v1.8","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"PodProbeMarker"},"sidebar":"docs","previous":{"title":"PersistentPodState","permalink":"/zh/docs/user-manuals/persistentpodstate"},"next":{"title":"Deletion Protection","permalink":"/zh/docs/user-manuals/deletionprotection"}}');var o=s(74848),t=s(28453);const i={title:"PodProbeMarker"},a=void 0,d={},l=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"Usage",id:"usage",level:2},{value:"\u652f\u6301 TcpSocket Probe",id:"\u652f\u6301-tcpsocket-probe",level:3},{value:"\u652f\u6301 serverless \u573a\u666f",id:"\u652f\u6301-serverless-\u573a\u666f",level:3},{value:"\u80cc\u666f",id:"\u80cc\u666f",level:4},{value:"\u534f\u8bae\u4ecb\u7ecd",id:"\u534f\u8bae\u4ecb\u7ecd",level:4},{value:"How to view Probe results?",id:"how-to-view-probe-results",level:2},{value:"Pod Status Conditions",id:"pod-status-conditions",level:3},{value:"Pod Metadata",id:"pod-metadata",level:3},{value:"Pod Event",id:"pod-event",level:3}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.3.0"]}),"\n",(0,o.jsx)(n.p,{children:"Kubernetes\u63d0\u4f9b\u4e86\u4e09\u79cd\u9ed8\u8ba4\u7684Pod\u751f\u547d\u5468\u671f\u7ba1\u7406\uff1a"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Readiness Probe"})," \u7528\u6765\u5224\u65ad\u4e1a\u52a1\u5bb9\u5668\u662f\u5426\u5df2\u7ecf\u51c6\u5907\u597d\u54cd\u5e94\u7528\u6237\u8bf7\u6c42\uff0c\u5982\u679c\u68c0\u67e5\u5931\u8d25\uff0c\u4f1a\u5c06\u8be5Pod\u4eceService Endpoints\u4e2d\u5254\u9664\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Liveness Probe"})," \u7528\u6765\u5224\u65ad\u5bb9\u5668\u7684\u5065\u5eb7\u72b6\u6001\uff0c\u5982\u679c\u68c0\u67e5\u5931\u8d25\uff0ckubelet\u5c06\u4f1a\u91cd\u542f\u8be5\u5bb9\u5668\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Startup Probe"})," \u7528\u6765\u5224\u65ad\u5bb9\u5668\u662f\u5426\u542f\u52a8\u5b8c\u6210\uff0c\u5982\u679c\u5b9a\u4e49\u4e86\u8be5Probe\uff0c\u90a3\u4e48Readiness Probe\u4e0eLiveness Probe\u5c06\u4f1a\u5728\u5b83\u6210\u529f\u4e4b\u540e\u518d\u6267\u884c\u3002"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"\u6240\u4ee5Kubernetes\u4e2d\u63d0\u4f9b\u7684Probe\u80fd\u529b\u90fd\u5df2\u7ecf\u9650\u5b9a\u4e86\u7279\u5b9a\u7684\u8bed\u4e49\u4ee5\u53ca\u76f8\u5173\u7684\u884c\u4e3a\u3002**\u9664\u6b64\u4e4b\u5916\uff0c\u5176\u5b9e\u8fd8\u662f\u5b58\u5728\u81ea\u5b9a\u4e49Probe\u8bed\u4e49\u4ee5\u53ca\u76f8\u5173\u884c\u4e3a\u7684\u9700\u6c42\n**\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"GameServer\u5b9a\u4e49 Idle Probe \u7528\u6765\u5224\u65ad\u8be5Pod\u5f53\u524d\u662f\u5426\u5b58\u5728\u6e38\u620f\u5bf9\u5c40"}),"\uff0c\u5982\u679c\u6ca1\u6709\uff0c\u4ece\u6210\u672c\u4f18\u5316\u7684\u89d2\u5ea6\uff0c\u53ef\u4ee5\u5c06\u8be5Pod\u7f29\u5bb9\u6389\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"K8S Operator\u5b9a\u4e49 main-secondary Probe \u6765\u5224\u65ad\u5f53\u524dPod\u7684\u89d2\u8272\uff08main or secondary\uff09"}),"\uff0c\u5347\u7ea7\u7684\u65f6\u5019\uff0c\u53ef\u4ee5\u4f18\u5148\u5347\u7ea7\nsecondary\uff0c\u8fdb\u800c\u8fbe\u5230\u5347\u7ea7\u8fc7\u7a0b\u53ea\u6709\u4e00\u6b21\u9009\u4e3b\u7684\u884c\u4e3a\uff0c\u964d\u4f4e\u5347\u7ea7\u8fc7\u7a0b\u4e2d\u670d\u52a1\u6296\u52a8\u65f6\u95f4\u3002"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"OpenKruise\u63d0\u4f9b\u4e86\u81ea\u5b9a\u4e49Probe\u7684\u80fd\u529b\uff0c\u5e76\u5c06\u7ed3\u679c\u8fd4\u56de\u5230Pod Status\u4e2d\uff0c\u7528\u6237\u53ef\u4ee5\u6839\u636e\u8be5\u7ed3\u679c\u51b3\u5b9a\u540e\u7eed\u7684\u884c\u4e3a\u3002"}),"\n",(0,o.jsx)(n.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,o.jsxs)(n.p,{children:["PodProbeMarker\u80fd\u529b\u9ed8\u8ba4\u662f\u5f00\u542f\u7684, \u4f60\u53ef\u4ee5\u901a\u8fc7 feature-gate ",(0,o.jsx)(n.em,{children:"PodProbeMarkerGate"})," \u5173\u95ed\uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="PodProbeMarkerGate=false"\n'})}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PodProbeMarker\nmetadata:\n  name: game-server-probe\n  namespace: ns\nspec:\n  selector:\n    matchLabels:\n      app: game-server\n  probes:\n  - name: Idle\n    containerName: game-server\n    probe:\n      exec:\n        command:\n        - /home/game/idle.sh\n      initialDelaySeconds: 10\n      timeoutSeconds: 3\n      periodSeconds: 10\n      successThreshold: 1\n      failureThreshold: 3\n    markerPolicy:\n    - state: Succeeded\n      labels:\n        gameserver-idle: 'true'\n      annotations:\n        controller.kubernetes.io/pod-deletion-cost: '-10'\n    - state: Failed\n      labels:\n        gameserver-idle: 'false'\n      annotations:\n        controller.kubernetes.io/pod-deletion-cost: '10'\n    podConditionType: game.io/idle\n"})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"spec.selector"}),":\n\u6839\u636eLabel\u9009\u62e9\u5339\u914d\u7684Pods\uff0cMatchLabels\u548cMatchExpressions\u90fd\u652f\u6301\u3002\u8be6\u60c5\u8bf7\u53c2\u8003\uff1a",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels",children:"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels"})," \u3002\n\u5b9a\u4e49\u540e\uff0c\u8be5selector\u4e0d\u5141\u8bb8\u4fee\u6539\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:["spec.probes","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"name"}),": probe\u540d\u5b57\uff0c\u9700\u8981\u5728Pod\u5185\u662f\u552f\u4e00\u7684\uff0c\u54ea\u6015\u4e0d\u540c\u7684\u5bb9\u5668\u4e4b\u95f4\u4e5f\u9700\u8981\u552f\u4e00"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"containerName"}),": \u6267\u884cprobe\u7684\u5bb9\u5668"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"probe"}),": probe\u76f8\u5173\u7684API\u5b9a\u4e49\uff0c\u4e0e\u539f\u751fK8S probe\u4e00\u81f4\uff08\u5f53\u524d\u53ea\u652f\u6301\nExec\uff09\u3002\u8be6\u60c5\u8bf7\u53c2\u8003\uff1a",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes",children:"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes"})]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"markerPolicy"}),": \u6839\u636eProbe\u6267\u884c\u7ed3\u679c\uff08Succeeded\u6216Failed\uff09\uff0c\u5728Pod\u4e0a\u9762\u6253\u7279\u5b9a\u7684Labels\u548cAnnotations\u3002","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"state: probe\u7ed3\u679c\uff0cSucceeded \u6216 Failed"}),"\n",(0,o.jsx)(n.li,{children:"labels: \u5982\u679c\u7ed3\u679c\u6ee1\u8db3\uff0c\u6253 labels \u5230Pod\u4e0a"}),"\n",(0,o.jsx)(n.li,{children:"annotations: \u5982\u679c\u7ed3\u679c\u6ee1\u8db3\uff0c\u6253 annotations \u5230Pod\u4e0a"}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"podConditionType"}),": \u5c06Probe\u6267\u884c\u7ed3\u679c\uff08Succeeded\u6216Failed\uff09\u4fdd\u5b58\u5230pod condition\u4e0a\u3002\u5982\u679c\u8be5\u5b57\u6bb5\u4e3a\u7a7a\uff0cprobe\u6267\u884c\u7ed3\u679c\u5c06\u4e0d\u4f1a\u540c\u6b65\u5230pod\ncondition\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"\u6ce8\u610f\uff1a"})," \u5982\u679c\u53ea\u5b9a\u4e49\u4e86\u4e00\u79cdMarker Policy\u7b56\u7565\uff0c\u4f8b\u5982\uff1a\u53ea\u5b9a\u4e49\u4e86 State=Succeeded\uff0cPatch Labels[healthy]='true'\n\u3002\u5f53Probe\u6267\u884c\u6210\u529f\u65f6\uff0c\u5c06\u4f1aPatch Label[healthy]='true' \u5230Pod\u4e0a\u3002\u5f53Probe\u6267\u884c\u5931\u8d25\u65f6\uff0cLabel[healthy]\u5c06\u4f1a\u88ab\u5220\u9664\u3002"]}),"\n",(0,o.jsx)(n.h3,{id:"\u652f\u6301-tcpsocket-probe",children:"\u652f\u6301 TcpSocket Probe"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,o.jsxs)(n.p,{children:["\u6839\u636e\u5982\u4e0b\u914d\u7f6e\uff0ckruise-daemon \u4f1a\u5c1d\u8bd5\u4e0e\u5bb9\u5668 Port \u5efa\u7acb\u4e00\u4e2asocket\u8fde\u63a5\uff0c\u5982\u679c\u5efa\u7acb\u6210\u529f\uff0c\u5219 Probe \u5c06\u4f1a\u8fd4\u56de ",(0,o.jsx)(n.code,{children:"Succeeded"}),"\uff0c\u5426\u5219\n",(0,o.jsx)(n.code,{children:"Failed"}),"\u3002"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PodProbeMarker\nmetadata:\n  name: game-server-probe\n  namespace: ns\nspec:\n  selector:\n    matchLabels:\n      app: game-server\n  probes:\n    - name: Idle\n      containerName: game-server\n      probe:\n        tcpSocket:\n          port: 8080\n        initialDelaySeconds: 15\n        periodSeconds: 10\n"})}),"\n",(0,o.jsx)(n.h3,{id:"\u652f\u6301-serverless-\u573a\u666f",children:"\u652f\u6301 serverless \u573a\u666f"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.8.0"]}),"\n",(0,o.jsx)(n.h4,{id:"\u80cc\u666f",children:"\u80cc\u666f"}),"\n",(0,o.jsxs)(n.p,{children:["\u5728 Kruise v1.8.0 \u4e4b\u524d\uff0c",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," \u7684\u63a2\u6d4b\u80fd\u529b\u4f9d\u8d56\u4e8e ",(0,o.jsx)(n.code,{children:"Kruise Daemon"})," \u7ec4\u4ef6\u5b9e\u73b0\u3002\n\u9488\u5bf9\u4f7f\u7528 serverless \u8d44\u6e90\u90e8\u7f72 OKG \u7b49\u5178\u578b\u573a\u666f\uff0cKruise v1.8.0 \u5f15\u5165\u4e86\u9488\u5bf9 ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," Serverless \u573a\u666f\u7684\u6269\u5c55\u534f\u8bae\u3002"]}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:["\u6ce8\u610f\uff1a\u4e0d\u540c serverless \u5bb9\u5668\u670d\u52a1\u5382\u5546 \u5bf9 ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," \u7684\u652f\u6301\u5b58\u5728\u5dee\u5f02\uff0c\u9700\u54a8\u8be2\u5bf9\u5e94\u5382\u5546\u8be5\u534f\u8bae\u7684\u652f\u6301\u60c5\u51b5\u3002"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Kriuse \u6b22\u8fce\u6c47\u62a5\u652f\u6301\u8be5\u534f\u8bae\u7684\u5382\u5546\u5217\u8868\uff1a"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["\u963f\u91cc\u4e91\u5bb9\u5668\u8ba1\u7b97\u670d\u52a1 ",(0,o.jsx)(n.a,{href:"https://www.aliyun.com/product/acs",children:"ACS"})]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"\u534f\u8bae\u4ecb\u7ecd",children:"\u534f\u8bae\u4ecb\u7ecd"}),"\n",(0,o.jsxs)(n.p,{children:["\u652f\u6301 serverless PodProbeMarker \u80fd\u529b\u9ed8\u8ba4\u662f\u5173\u95ed\u7684, \u4f60\u53ef\u4ee5\u901a\u8fc7 feature-gate ",(0,o.jsx)(n.em,{children:"EnablePodProbeMarkerOnServerless"})," \u6253\u5f00\uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:'helm install kruise https://... --set featureGates="PodProbeMarkerGate=true,EnablePodProbeMarkerOnServerless=true"\n'})}),"\n",(0,o.jsx)(n.p,{children:"\u8be5\u7279\u6027\u5728 PodProbeMarker \u7684\u5b9a\u4e49\u4e86\u5bf9 serverless \u573a\u666f\u7684\u4ea4\u4e92\u534f\u8bae\uff1a"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Kruise-manager"})," \u901a\u8fc7 annotation ",(0,o.jsx)(n.code,{children:"kruise.io/podprobe"})," \u5728 serverless Pod \u4e0a\u6dfb\u52a0\u9700\u8981\u8fdb\u884c\u7684\u63a2\u6d4b\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:["serverless PodProbeMarker \u5177\u4f53\u5b9e\u73b0\u9700\u8981\u4ece annotation ",(0,o.jsx)(n.code,{children:"kruise.io/podprobe"})," \u4e2d\u8bfb\u53d6\u63a2\u6d4b\u4fe1\u606f\u3001\u6267\u884c\u63a2\u6d4b\uff0c\u5e76\u5c06\u7ed3\u679c\u5199\u5230 Pod \u7684 ",(0,o.jsx)(n.code,{children:".status.conditions[x]"})," \u4e2d\u3002"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Kruise-manager"})," \u901a\u8fc7\u8bc6\u522b serverless Pod \u7684 ",(0,o.jsx)(n.code,{children:".status.conditions[x]"})," \u4e2d\u8bc6\u522b\u5230 Probe \u6267\u884c\u7ed3\u679c\uff0c\u5e76\u6267\u884c markerPolicy \u4e2d\u5b9a\u4e49\u7684\u6807\u8bb0\u64cd\u4f5c\u3002"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"\u793a\u4f8b\u53c2\u8003\u5982\u4e0b\uff1a"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nmetadata:\n  annotations:\n    # \u8bb0\u5f55\u9700\u8981\u5bf9\u8be5 Pod \u8fdb\u884c\u7684\u63a2\u6d4b\uff0c\u7531\u5404\u79cd\u5b9e\u73b0\u8d1f\u8d23\u8bfb\u53d6\u4fe1\u606f\u5e76\u63a2\u6d4b\n    kruise.io/podprobe: |\n      [\n      \t{\n      \t\t"containerName": "minecraft",\n      \t\t"name": "healthy",\n      \t\t"podConditionType": "game.kruise.io/healthy",\n      \t\t"probe": {\n      \t\t\t"exec": {\n      \t\t\t\t"command": [\n      \t\t\t\t\t"bash",\n      \t\t\t\t\t"/data/probe.sh"\n      \t\t\t\t]\n      \t\t\t}\n      \t\t}\n      \t}\n      ]\n...\nstatus:\n  conditions:\n  # \u63a2\u6d4b\u7684\u7ed3\u679c\u8bb0\u5f55\u5728 .status.conditions \u4e2d\uff0ctype \u4e3a podConditionType\n  - type: game.kruise.io/healthy\n    # Probe State \'Succeeded\' indicates \'True\', and \'Failed\' indicates \'False\'\n    status: "True"\n    lastProbeTime: "2025-03-25T07:13:04Z"\n    lastTransitionTime: "2025-03-25T07:13:04Z"\n    # If the probe fails to execute, the message is stderr\n    message: ""\n'})}),"\n",(0,o.jsx)(n.h2,{id:"how-to-view-probe-results",children:"How to view Probe results?"}),"\n",(0,o.jsx)(n.h3,{id:"pod-status-conditions",children:"Pod Status Conditions"}),"\n",(0,o.jsxs)(n.p,{children:["\u5982\u679c\u7528\u6237\u5b9a\u4e49\u4e86podConditionType\uff0c\u5c06Probe\u6267\u884c\u7ed3\u679c\uff08Succeeded\u6216Failed\uff09\u4fdd\u5b58\u5230pod condition\u4e0a\uff0c\u5176\u4e2d*\n",(0,o.jsx)(n.em,{children:"condition.type=podConditionType"}),"*\uff0c\u5177\u4f53\u5982\u4e0b\uff1a"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: game-server\n  name: game-server-58cb9f5688-7sbd8\n  namespace: ns\n...\nstatus:\n  conditions:\n    # podConditionType\n  - type: game.io/idle\n    # Probe State 'Succeeded' indicates 'True', and 'Failed' indicates 'False'\n    status: \"True\"\n    lastProbeTime: \"2022-09-09T07:13:04Z\"\n    lastTransitionTime: \"2022-09-09T07:13:04Z\"\n    # If the probe fails to execute, the message is stderr\n    message: \"\"\n"})}),"\n",(0,o.jsxs)(n.p,{children:["\u8be5\u79cd\u65b9\u5f0f\u53ef\u4ee5\u4e0eKubernetes ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate",children:"Readiness Gate"}),"\n\u7ed3\u5408\u4f7f\u7528\uff0c\u8fbe\u5230\u7075\u6d3b\u63a7\u5236Pod\u662f\u5426Ready\u7684\u6548\u679c\u3002"]}),"\n",(0,o.jsx)(n.h3,{id:"pod-metadata",children:"Pod Metadata"}),"\n",(0,o.jsx)(n.p,{children:"\u5982\u679c\u7528\u6237\u5b9a\u4e49\u4e86 MarkerPolicy\uff0cOpenKruise\u5c06\u4f1aPatch\u7279\u5b9a\u7684Metadata\u5230Pod\u4e0a\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: game-server\n    gameserver-idle: 'true'\n  annotations:\n    controller.kubernetes.io/pod-deletion-cost: '-10'\n  name: game-server-58cb9f5688-7sbd8\n  namespace: ns\n"})}),"\n",(0,o.jsxs)(n.p,{children:["OpenKruise ",(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/cloneset#update-sequence",children:"CloneSet"})," \u4e0e\n",(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/advancedstatefulset#update-sequence",children:"Advanced StatefulSet"})," \u90fd\u652f\u6301\u6839\u636ePod\nLabel\u63a7\u5236\u5347\u7ea7\u4f18\u5148\u7ea7\u7684\u80fd\u529b\u3002\n\u4e0e\u6b64\u540c\u65f6\uff0c\u793e\u533a\u539f\u751fDeployment\u4e0eKruise\nCloneSet\u4e5f\u652f\u6301\u57fa\u4e8e ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost",children:"Deletion Cost"}),"\n\u7684\u7f29\u5bb9\u4f18\u5148\u7ea7\u4ee5\u53ca\u5347\u7ea7\u987a\u5e8f\u3002\n\u6240\u4ee5Custom Probe MarkerPolicy\u53ef\u4ee5\u4e0e\u4e0a\u9762\u80fd\u529b\u76f8\u7ed3\u5408\uff0c\u8fbe\u5230\u7f29\u5bb9\u6216\u5347\u7ea7\u4f18\u5148\u7ea7\u7684\u6548\u679c\u3002"]}),"\n",(0,o.jsx)(n.h3,{id:"pod-event",children:"Pod Event"}),"\n",(0,o.jsx)(n.p,{children:"\u901a\u8fc7pod event\u53ef\u4ee5\u67e5\u770b\u5386\u53f2\u7684probe\u6267\u884c\u7ed3\u679c\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"$ kubectl describe pods -n ns game-server-58cb9f5688-7sbd8\nEvents:\n  Type    Reason                Age                From                         Message\n  ----    ------                ----               ----                         -------\n  Normal  KruiseProbeFailed     37s (x2 over 47s)  kruise-daemon-podprobe\n  Normal  KruiseProbeSucceeded  36s (x2 over 37s)  kruise-daemon-podprobe\n"})})]})}function p(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);
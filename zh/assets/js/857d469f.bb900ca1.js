"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4452],{28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>r});var t=a(96540);const i={},l=t.createContext(i);function s(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(l.Provider,{value:n},e.children)}},64201:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/podunavailablebudget-7ed5c9fff913cf97221663cdd8d7dc62.png"},94734:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>c,frontMatter:()=>s,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"user-manuals/podunavailablebudget","title":"PodUnavailableBudget","description":"FEATURE STATE: Kruise v0.10.0","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/podunavailablebudget.md","sourceDirName":"user-manuals","slug":"/user-manuals/podunavailablebudget","permalink":"/zh/docs/v1.7/user-manuals/podunavailablebudget","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/podunavailablebudget.md","tags":[],"version":"v1.7","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"PodUnavailableBudget"},"sidebar":"docs","previous":{"title":"Deletion Protection","permalink":"/zh/docs/v1.7/user-manuals/deletionprotection"},"next":{"title":"HPA configuration","permalink":"/zh/docs/v1.7/best-practices/hpa-configuration"}}');var i=a(74848),l=a(28453);const s={title:"PodUnavailableBudget"},r=void 0,o={},d=[{value:"API\u5b9a\u4e49",id:"api\u5b9a\u4e49",level:2},{value:"\u652f\u6301\u81ea\u5b9a\u4e49Workload",id:"\u652f\u6301\u81ea\u5b9a\u4e49workload",level:3},{value:"Implementation",id:"implementation",level:2},{value:"Comparison with Kubernetes native PDB",id:"comparison-with-kubernetes-native-pdb",level:2},{value:"feature-gates",id:"feature-gates",level:2},{value:"PodUnavailableBudget Status",id:"podunavailablebudget-status",level:2}];function u(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u8bf8\u591a",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",children:"Voluntary Disruption"})," \u573a\u666f\u4e2d Kubernetes ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/run-application/configure-pdb/",children:"Pod Disruption Budget"}),"\n\u901a\u8fc7\u9650\u5236\u540c\u65f6\u4e2d\u65ad\u7684Pod\u6570\u91cf\uff0c\u6765\u4fdd\u8bc1\u5e94\u7528\u7684\u9ad8\u53ef\u7528\u6027\u3002\u7136\u800c\uff0cPDB\u53ea\u80fd\u9632\u63a7\u901a\u8fc7 ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#eviction-api",children:"Eviction API"})," \u6765\u89e6\u53d1\u7684Pod Disruption\uff0c\u4f8b\u5982\uff1akubectl drain\u9a71\u9010node\u4e0a\u9762\u7684\u6240\u6709Pod\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u4f46\u5728\u5982\u4e0bvoluntary disruption\u573a\u666f\u4e2d\uff0c\u5373\u4fbf\u6709kubernetes PDB\u9632\u62a4\u4f9d\u7136\u5c06\u4f1a\u5bfc\u81f4\u4e1a\u52a1\u4e2d\u65ad\u3001\u670d\u52a1\u964d\u7ea7\uff1a"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"\u5e94\u7528owner\u901a\u8fc7deployment\u6b63\u5728\u8fdb\u884c\u7248\u672c\u5347\u7ea7\uff0c\u4e0e\u6b64\u540c\u65f6\u96c6\u7fa4\u7ba1\u7406\u5458\u7531\u4e8e\u673a\u5668\u8d44\u6e90\u5229\u7528\u7387\u8fc7\u4f4e\u6b63\u5728\u8fdb\u884cnode\u7f29\u5bb9\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u4e2d\u95f4\u4ef6\u56e2\u961f\u5229\u7528sidecarSet\u6b63\u5728\u539f\u5730\u5347\u7ea7\u96c6\u7fa4\u4e2d\u7684sidecar\u7248\u672c\uff08\u4f8b\u5982\uff1aServiceMesh envoy\uff09\uff0c\u540c\u65f6HPA\u6b63\u5728\u5bf9\u540c\u4e00\u6279\u5e94\u7528\u8fdb\u884c\u7f29\u5bb9\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u5e94\u7528owner\u548c\u4e2d\u95f4\u4ef6\u56e2\u961f\u5229\u7528cloneSet\u3001sidecarSet\u539f\u5730\u5347\u7ea7\u7684\u80fd\u529b\uff0c\u6b63\u5728\u5bf9\u540c\u4e00\u6279Pod\u8fdb\u884c\u5347\u7ea7\u3002"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u4e0a\u9762\u8fd9\u4e9b kubernetes PDB \u65e0\u6cd5\u5f88\u597d\u9632\u62a4\u7684\u573a\u666f\u4e2d\uff0cKruise PodUnavailableBudget \u901a\u8fc7\u5bf9Pod Mutating Webhook\u7684\u62e6\u622a\uff0c\u80fd\u591f\u8986\u76d6\u66f4\u591a\u7684Voluntary Disruption\u573a\u666f\uff0c\u8fdb\u800c\u63d0\u4f9b\u5e94\u7528\u66f4\u52a0\u5f3a\u5927\u7684\u9632\u62a4\u80fd\u529b\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"api\u5b9a\u4e49",children:"API\u5b9a\u4e49"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: web-server-pub\n  namespace: web\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    # cloneset, deployment, statefulset etc.\n    kind: CloneSet\n    name: web-server\n  # selector label query over pods managed by the budget\n  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.\n  # selector is commonly used in scenarios where applications are deployed using multiple workloads,\n  # and targetRef is used for protection against a single workload.\n# selector:\n#   matchLabels:\n#     app: web-server\n  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3\n  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect\n  maxUnavailable: 60%\n  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2\n# minAvailable: 40%\n-----------------------\n\napiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  labels:\n    app: web-server\n  name: web-server\n  namespace: web\nspec:\n  replicas: 5\n  selector:\n    matchLabels:\n      app: web-server\n  template:\n    metadata:\n      labels:\n        app: web-server\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:alpine\n"})}),"\n",(0,i.jsx)(n.h3,{id:"\u652f\u6301\u81ea\u5b9a\u4e49workload",children:"\u652f\u6301\u81ea\u5b9a\u4e49Workload"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.2.0"]}),"\n",(0,i.jsx)(n.p,{children:"\u5f88\u591a\u516c\u53f8\u4e3a\u6ee1\u8db3\u590d\u6742\u6027\u66f4\u9ad8\u7684\u5e94\u7528\u90e8\u7f72\u9700\u6c42\uff0c\u5f80\u5f80\u4f1a\u901a\u8fc7\u5b9e\u73b0\u5b9a\u5236\u5316Workload\u7684\u65b9\u5f0f\u6765\u7ba1\u7406\u4e1a\u52a1Pod\u3002\u4ecekruise v1.2.0\u5f00\u59cb\uff0cpub\u80fd\u591f\u9632\u62a4\u5b9e\u73b0\u4e86scale\u5b50\u8d44\u6e90\u7684\u81ea\u5b9a\u4e49Workload\uff0c\u5982\u4e0b\u9632\u62a4Argo-Rollout\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: rollouts-demo\nspec:\n  targetRef:\n    apiVersion: argoproj.io/v1alpha1\n    kind: Rollout\n    name: rollouts-demo\n  minAvailable: 80%\n"})}),"\n",(0,i.jsx)(n.h2,{id:"implementation",children:"Implementation"}),"\n",(0,i.jsxs)(n.p,{children:["PUB\u5b9e\u73b0\u539f\u7406\u5982\u4e0b\uff0c\u8be6\u7ec6\u8bbe\u8ba1\u8bf7\u53c2\u8003\uff1a",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/docs/proposals/20210614-podunavailablebudget.md",children:"Pub Proposal"})]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"PodUnavailableBudget",src:a(64201).A+"",width:"833",height:"680"})}),"\n",(0,i.jsx)(n.h2,{id:"comparison-with-kubernetes-native-pdb",children:"Comparison with Kubernetes native PDB"}),"\n",(0,i.jsxs)(n.p,{children:["Kubernetes PDB\u662f\u901a\u8fc7Eviction API\u63a5\u53e3\u6765\u5b9e\u73b0Pod\u5b89\u5168\u9632\u62a4\uff0c\u800cKruise PDB\u5219\u662f\u62e6\u622a\u4e86Pod Validating Request\u6765\u5b9e\u73b0\u8bf8\u591aVoluntary Disruption\u573a\u666f\u7684\u9632\u62a4\u80fd\u529b\u3002\n",(0,i.jsx)(n.strong,{children:"Kruise PUB\u5305\u542b\u4e86PDB\u7684\u6240\u6709\u80fd\u529b\uff08\u9632\u62a4Pod Eviction\uff09\uff0c\u4e1a\u52a1\u53ef\u4ee5\u6839\u636e\u9700\u8981\u4e24\u8005\u540c\u65f6\u4f7f\u7528\uff0c\u4e5f\u53ef\u4ee5\u5355\u72ec\u4f7f\u7528Kruise PUB\uff08\u63a8\u8350\u65b9\u5f0f\uff09\u3002"})]}),"\n",(0,i.jsx)(n.h2,{id:"feature-gates",children:"feature-gates"}),"\n",(0,i.jsxs)(n.p,{children:["PodUnavailableBudget Pod\u5b89\u5168\u9632\u62a4\u9ed8\u8ba4\u662f\u5173\u95ed\u7684\uff0c\u5982\u679c\u8981\u5f00\u542f\u8bf7\u901a\u8fc7\u8bbe\u7f6e feature-gates ",(0,i.jsx)(n.em,{children:"PodUnavailableBudgetDeleteGate"})," \u548c ",(0,i.jsx)(n.em,{children:"PodUnavailableBudgetUpdateGate"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="PodUnavailableBudgetDeleteGate=true\\,PodUnavailableBudgetUpdateGate=true"\n'})}),"\n",(0,i.jsx)(n.h2,{id:"podunavailablebudget-status",children:"PodUnavailableBudget Status"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"# kubectl describe podunavailablebudgets web-server-pub\nName:         web-server-pub\nKind:         PodUnavailableBudget\nStatus:\n  unavailableAllowed:   3   # unavailableAllowed number of pod unavailable that are currently allowed\n  currentAvailable:     5   # currentAvailable current number of available pods\n  desiredAvailable:     2   # desiredAvailable minimum desired number of available pods\n  totalReplicas:        5   # totalReplicas total number of pods counted by this PUB\n"})})]})}function c(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}}}]);
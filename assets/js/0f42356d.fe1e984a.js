"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6365],{28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>r});var t=a(96540);const i={},o=t.createContext(i);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(o.Provider,{value:n},e.children)}},64201:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/podunavailablebudget-7ed5c9fff913cf97221663cdd8d7dc62.png"},64402:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>s,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"user-manuals/podunavailablebudget","title":"PodUnavailableBudget","description":"FEATURE STATE: Kruise v0.10.0","source":"@site/versioned_docs/version-v1.8/user-manuals/podunavailablebudget.md","sourceDirName":"user-manuals","slug":"/user-manuals/podunavailablebudget","permalink":"/docs/user-manuals/podunavailablebudget","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/podunavailablebudget.md","tags":[],"version":"v1.8","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{"title":"PodUnavailableBudget"},"sidebar":"docs","previous":{"title":"Deletion Protection","permalink":"/docs/user-manuals/deletionprotection"},"next":{"title":"HPA configuration","permalink":"/docs/best-practices/hpa-configuration"}}');var i=a(74848),o=a(28453);const s={title:"PodUnavailableBudget"},r=void 0,l={},d=[{value:"API Definition",id:"api-definition",level:2},{value:"Support Custom Workload",id:"support-custom-workload",level:3},{value:"Support for Custom Workloads Without Scale Sub-Resource",id:"support-for-custom-workloads-without-scale-sub-resource",level:3},{value:"Implementation",id:"implementation",level:2},{value:"Comparison with Kubernetes native PDB",id:"comparison-with-kubernetes-native-pdb",level:2},{value:"feature-gates",id:"feature-gates",level:2},{value:"PodUnavailableBudget Status",id:"podunavailablebudget-status",level:2}];function u(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,i.jsxs)(n.p,{children:["Kubernetes offers ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/run-application/configure-pdb/",children:"Pod Disruption Budget"})," to help you\nrun highly available applications even when you introduce\nfrequent ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",children:"voluntary disruptions"}),".\nPDB limits the number of Pods of a replicated application that are down simultaneously from voluntary disruptions.\nHowever, it can only constrain the voluntary disruption triggered by\nthe ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#eviction-api",children:"Eviction API"}),".\nFor example, when you run kubectl drain, the tool tries to evict all of the Pods on the Node you're taking out of\nservice."]}),"\n",(0,i.jsx)(n.p,{children:"In the following voluntary disruption scenarios, there are still business disruption or SLA degradation situations:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["The application owner update deployment's pod template for general upgrading, while cluster administrator drain nodes\nto scale the cluster down(learn about ",(0,i.jsx)(n.a,{href:"https://github.com/kubernetes/autoscaler/#readme",children:"Cluster Autoscaling"}),")."]}),"\n",(0,i.jsxs)(n.li,{children:["The middleware team is using ",(0,i.jsx)(n.a,{href:"./sidecarset",children:"SidecarSet"})," to rolling upgrade the sidecar containers of the cluster,\ne.g. ServiceMesh envoy, while HPA triggers the scale-down of business applications."]}),"\n",(0,i.jsx)(n.li,{children:"The application owner and middleware team release the same Pods at the same time based on OpenKruise cloneSet,\nsidecarSet in-place upgrades"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or\nSLA degradation, which greatly improves the high availability of application services."}),"\n",(0,i.jsx)(n.h2,{id:"api-definition",children:"API Definition"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: web-server-pub\n  namespace: web\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    # cloneset, deployment, statefulset etc.\n    kind: CloneSet\n    name: web-server\n  # selector label query over pods managed by the budget\n  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.\n  # selector is commonly used in scenarios where applications are deployed using multiple workloads,\n  # and targetRef is used for protection against a single workload.\n# selector:\n#   matchLabels:\n#     app: web-server\n  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3\n  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect\n  maxUnavailable: 60%\n  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2\n# minAvailable: 40%\n  -----------------------\n\napiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  labels:\n    app: web-server\n  name: web-server\n  namespace: web\nspec:\n  replicas: 5\n  selector:\n    matchLabels:\n      app: web-server\n  template:\n    metadata:\n      labels:\n        app: web-server\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:alpine\n"})}),"\n",(0,i.jsx)(n.h3,{id:"support-custom-workload",children:"Support Custom Workload"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.2.0"]}),"\n",(0,i.jsx)(n.p,{children:"Many companies to meet the needs of more complex application deployment, often through the implementation of custom\nWorkload to manage business Pod.\nFrom kruise v1.2.0, PodUnavailableBudget(PUB) support protect any custom workload with scale sub-resource, e.g.\nArgo-Rollout:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: rollouts-demo\nspec:\n  targetRef:\n    apiVersion: argoproj.io/v1alpha1\n    kind: Rollout\n    name: rollouts-demo\n  minAvailable: 80%\n"})}),"\n",(0,i.jsx)(n.h3,{id:"support-for-custom-workloads-without-scale-sub-resource",children:"Support for Custom Workloads Without Scale Sub-Resource"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.8.0"]}),"\n",(0,i.jsx)(n.p,{children:"In certain special scenarios, there may be custom workloads that do not implement the Scale sub-resource but still\nrequire protection. In such cases, users can use an annotation on the PUB resource to specify the total number of\nreplicas to be protected. For example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: crd-demo\n  annotations:\n    # \u901a\u8fc7 annotation \u76f4\u63a5\u58f0\u660e\u76ee\u6807\u9632\u62a4\u526f\u672c\u6570\n    pub.kruise.io/protect-total-replicas: "5"\nspec:\n  ...\n'})}),"\n",(0,i.jsx)(n.h2,{id:"implementation",children:"Implementation"}),"\n",(0,i.jsx)(n.p,{children:"This program customizes the PodUnavailableBudget (later referred to as PUB) CRD resource to describe the desired state\nof the application, and the working mechanism is shown below:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"PodUnavailableBudget",src:a(64201).A+"",width:"833",height:"680"})}),"\n",(0,i.jsx)(n.h2,{id:"comparison-with-kubernetes-native-pdb",children:"Comparison with Kubernetes native PDB"}),"\n",(0,i.jsx)(n.p,{children:"Kubernetes PodDisruptionBudget implements protection against Pod Eviction based on the EvictionREST interface,\nwhile PodUnavailableBudget intercepts all pod modification requests through the admission webhook validating mechanism (\nMany voluntary disruption scenarios can be summarized as modifications to Pod resources),\nand reject the request if the modification does not satisfy the desired state of the PUB."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Pub contains all the protection capabilities of kubernetes PDB, you can use both, or use pub independently to\nimplement your application protection (Recommend)."})}),"\n",(0,i.jsx)(n.h2,{id:"feature-gates",children:"feature-gates"}),"\n",(0,i.jsxs)(n.p,{children:["PodUnavailableBudget protection against Pods is turned off by default, if you want to turn it on set feature-gates\n",(0,i.jsx)(n.em,{children:"PodUnavailableBudgetDeleteGate"})," and ",(0,i.jsx)(n.em,{children:"PodUnavailableBudgetUpdateGate"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="PodUnavailableBudgetDeleteGate=true\\,PodUnavailableBudgetUpdateGate=true"\n'})}),"\n",(0,i.jsx)(n.h2,{id:"podunavailablebudget-status",children:"PodUnavailableBudget Status"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"# kubectl describe podunavailablebudgets web-server-pub\nName: web-server-pub\nKind: PodUnavailableBudget\nStatus:\n  unavailableAllowed: 3   # unavailableAllowed number of pod unavailable that are currently allowed\n  currentAvailable: 5   # currentAvailable current number of available pods\n  desiredAvailable: 2   # desiredAvailable minimum desired number of available pods\n  totalReplicas: 5   # totalReplicas total number of pods counted by this PUB\n"})})]})}function c(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}}}]);
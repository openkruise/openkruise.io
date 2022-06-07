"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6747],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return m}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),u=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(a),m=r,b=c["".concat(s,".").concat(m)]||c[m]||d[m]||o;return a?n.createElement(b,i(i({ref:t},p),{},{components:a})):n.createElement(b,i({ref:t},p))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=a[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},2632:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var n=a(7462),r=a(3366),o=(a(7294),a(3905)),i=["components"],l={title:"PodUnavailableBudget"},s=void 0,u={unversionedId:"user-manuals/podunavailablebudget",id:"user-manuals/podunavailablebudget",title:"PodUnavailableBudget",description:"FEATURE STATE: Kruise v0.10.0",source:"@site/docs/user-manuals/podunavailablebudget.md",sourceDirName:"user-manuals",slug:"/user-manuals/podunavailablebudget",permalink:"/docs/next/user-manuals/podunavailablebudget",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/podunavailablebudget.md",tags:[],version:"current",lastUpdatedBy:"berg",lastUpdatedAt:1654073990,formattedLastUpdatedAt:"6/1/2022",frontMatter:{title:"PodUnavailableBudget"},sidebar:"docs",previous:{title:"Deletion Protection",permalink:"/docs/next/user-manuals/deletionprotection"},next:{title:"HPA configuration",permalink:"/docs/next/best-practices/hpa-configuration"}},p={},d=[{value:"API Definition",id:"api-definition",level:2},{value:"Support Custom Workload",id:"support-custom-workload",level:3},{value:"Implementation",id:"implementation",level:2},{value:"Comparison with Kubernetes native PDB",id:"comparison-with-kubernetes-native-pdb",level:2},{value:"feature-gates",id:"feature-gates",level:2},{value:"PodUnavailableBudget Status",id:"podunavailablebudget-status",level:2}],c={toc:d};function m(e){var t=e.components,l=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},c,l,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.10.0"),(0,o.kt)("p",null,"Kubernetes offers ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/run-application/configure-pdb/"},"Pod Disruption Budget")," to help you run highly available applications even when you introduce frequent ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/pods/disruptions/"},"voluntary disruptions"),".\nPDB limits the number of Pods of a replicated application that are down simultaneously from voluntary disruptions. However, it can only constrain the voluntary disruption triggered by the ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#eviction-api"},"Eviction API"),".\nFor example, when you run kubectl drain, the tool tries to evict all of the Pods on the Node you're taking out of service."),(0,o.kt)("p",null,"In the following voluntary disruption scenarios, there are still business disruption or SLA degradation situations:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"The application owner update deployment's pod template for general upgrading, while cluster administrator drain nodes to scale the cluster down(learn about ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/kubernetes/autoscaler/#readme"},"Cluster Autoscaling"),")."),(0,o.kt)("li",{parentName:"ol"},"The middleware team is using ",(0,o.kt)("a",{parentName:"li",href:"./sidecarset"},"SidecarSet")," to rolling upgrade the sidecar containers of the cluster, e.g. ServiceMesh envoy, while HPA triggers the scale-down of business applications."),(0,o.kt)("li",{parentName:"ol"},"The application owner and middleware team release the same Pods at the same time based on OpenKruise cloneSet, sidecarSet in-place upgrades")),(0,o.kt)("p",null,"In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or SLA degradation, which greatly improves the high availability of application services."),(0,o.kt)("h2",{id:"api-definition"},"API Definition"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: web-server-pub\n  namespace: web\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    # cloneset, deployment, statefulset etc.\n    kind: CloneSet\n    name: web-server\n  # selector label query over pods managed by the budget\n  # selector and TargetReference are mutually exclusive, targetRef is priority to take effect.\n  # selector is commonly used in scenarios where applications are deployed using multiple workloads,\n  # and targetRef is used for protection against a single workload.\n# selector:\n#   matchLabels:\n#     app: web-server\n  # maximum number of Pods unavailable for the current cloneset, the example is cloneset.replicas(5) * 60% = 3\n  # maxUnavailable and minAvailable are mutually exclusive, maxUnavailable is priority to take effect\n  maxUnavailable: 60%\n  # Minimum number of Pods available for the current cloneset, the example is cloneset.replicas(5) * 40% = 2\n# minAvailable: 40%\n-----------------------\n\napiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  labels:\n    app: web-server\n  name: web-server\n  namespace: web\nspec:\n  replicas: 5\n  selector:\n    matchLabels:\n      app: web-server\n  template:\n    metadata:\n      labels:\n        app: web-server\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:alpine\n")),(0,o.kt)("h3",{id:"support-custom-workload"},"Support Custom Workload"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.2.0"),(0,o.kt)("p",null,"Many companies to meet the needs of more complex application deployment, often through the implementation of custom Workload to manage business Pod.\nFrom kruise v1.2.0, PodUnavailableBudget(PUB) support protect any custom workload with scale sub-resource, e.g. Argo-Rollout:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: policy.kruise.io/v1alpha1\nkind: PodUnavailableBudget\nmetadata:\n  name: rollouts-demo\nspec:\n  targetRef:\n    apiVersion: argoproj.io/v1alpha1\n    kind: Rollout\n    name: rollouts-demo\n  minAvailable: 80%\n")),(0,o.kt)("h2",{id:"implementation"},"Implementation"),(0,o.kt)("p",null,"This program customizes the PodUnavailableBudget (later referred to as PUB) CRD resource to describe the desired state of the application, and the working mechanism is shown below:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"PodUnavailableBudget",src:a(2072).Z,width:"833",height:"680"})),(0,o.kt)("h2",{id:"comparison-with-kubernetes-native-pdb"},"Comparison with Kubernetes native PDB"),(0,o.kt)("p",null,"Kubernetes PodDisruptionBudget implements protection against Pod Eviction based on the EvictionREST interface,\nwhile PodUnavailableBudget intercepts all pod modification requests through the admission webhook validating mechanism (Many voluntary disruption scenarios can be summarized as modifications to Pod resources),\nand reject the request if the modification does not satisfy the desired state of the PUB."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Pub contains all the protection capabilities of kubernetes PDB, you can use both, or use pub independently to implement your application protection (Recommend).")),(0,o.kt)("h2",{id:"feature-gates"},"feature-gates"),(0,o.kt)("p",null,"PodUnavailableBudget protection against Pods is turned off by default, if you want to turn it on set feature-gates ",(0,o.kt)("em",{parentName:"p"},"PodUnavailableBudgetDeleteGate")," and ",(0,o.kt)("em",{parentName:"p"},"PodUnavailableBudgetUpdateGate"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install kruise https://... --set featureGates="PodUnavailableBudgetDeleteGate=true\\,PodUnavailableBudgetUpdateGate=true"\n')),(0,o.kt)("h2",{id:"podunavailablebudget-status"},"PodUnavailableBudget Status"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"# kubectl describe podunavailablebudgets web-server-pub\nName:         web-server-pub\nKind:         PodUnavailableBudget\nStatus:\n  unavailableAllowed:   3   # unavailableAllowed number of pod unavailable that are currently allowed\n  currentAvailable:     5   # currentAvailable current number of available pods\n  desiredAvailable:     2   # desiredAvailable minimum desired number of available pods\n  totalReplicas:        5   # totalReplicas total number of pods counted by this PUB\n")))}m.isMDXComponent=!0},2072:function(e,t,a){t.Z=a.p+"assets/images/podunavailablebudget-7ed5c9fff913cf97221663cdd8d7dc62.png"}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3916],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),c=p(n),m=o,k=c["".concat(s,".").concat(m)]||c[m]||u[m]||r;return n?a.createElement(k,l(l({ref:t},d),{},{components:n})):a.createElement(k,l({ref:t},d))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,l=new Array(r);l[0]=c;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var p=2;p<r;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4669:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return i},metadata:function(){return p},toc:function(){return u}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),l=["components"],i={title:"WorkloadSpread"},s=void 0,p={unversionedId:"user-manuals/workloadspread",id:"version-v1.1/user-manuals/workloadspread",title:"WorkloadSpread",description:"FEATURE STATE: Kruise v0.10.0",source:"@site/versioned_docs/version-v1.1/user-manuals/workloadspread.md",sourceDirName:"user-manuals",slug:"/user-manuals/workloadspread",permalink:"/docs/v1.1/user-manuals/workloadspread",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/workloadspread.md",tags:[],version:"v1.1",lastUpdatedBy:"Siyu Wang",lastUpdatedAt:1648620235,formattedLastUpdatedAt:"3/30/2022",frontMatter:{title:"WorkloadSpread"},sidebar:"docs",previous:{title:"SidecarSet",permalink:"/docs/v1.1/user-manuals/sidecarset"},next:{title:"UnitedDeployment",permalink:"/docs/v1.1/user-manuals/uniteddeployment"}},d={},u=[{value:"Demo",id:"demo",level:2},{value:"subsets",id:"subsets",level:2},{value:"sub-fields",id:"sub-fields",level:3},{value:"Schedule strategy",id:"schedule-strategy",level:2},{value:"Requirements",id:"requirements",level:2},{value:"Pod Webhook",id:"pod-webhook",level:3},{value:"deletion-cost feature",id:"deletion-cost-feature",level:3},{value:"Scale order:",id:"scale-order",level:2},{value:"Scale out",id:"scale-out",level:3},{value:"Scale in",id:"scale-in",level:3},{value:"feature-gates",id:"feature-gates",level:2},{value:"Example",id:"example",level:2},{value:"Elastic deployment",id:"elastic-deployment",level:3},{value:"Effect",id:"effect",level:4},{value:"Multi-domain deployment",id:"multi-domain-deployment",level:3}],c={toc:u};function m(e){var t=e.components,n=(0,o.Z)(e,l);return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.10.0"),(0,r.kt)("p",null,"WorkloadSpread can distribute Pods of workload to different types of Node according to some polices, which empowers single workload the abilities for\nmulti-domain deployment and elastic deployment."),(0,r.kt)("p",null,"Some common policies include:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"fault toleration spread (for example, spread evenly among hosts, az, etc)"),(0,r.kt)("li",{parentName:"ul"},"spread according to the specified ratio (for example, deploy Pod to several specified az according to the proportion)"),(0,r.kt)("li",{parentName:"ul"},"subset management with priority, such as",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"deploy Pods to ecs first, and then deploy to eci when its resources are insufficient."),(0,r.kt)("li",{parentName:"ul"},"deploy a fixed number of Pods to ecs first, and the rest Pods are deployed to eci."))),(0,r.kt)("li",{parentName:"ul"},"subset management with customization, such as",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"control how many pods in a workload are deployed in different cpu arch"),(0,r.kt)("li",{parentName:"ul"},"enable pods in different cpu arch to have different resource requirements")))),(0,r.kt)("p",null,"The feature of WorkloadSpread is similar with UnitedDeployment in OpenKruise community. Each WorkloadSpread defines multi-domain\ncalled ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),". Each domain may provide the limit to run the replicas number of pods called ",(0,r.kt)("inlineCode",{parentName:"p"},"maxReplicas"),".\nWorkloadSpread injects the domain configuration into the Pod by Webhook, and it also controls the order of scale in and scale out."),(0,r.kt)("p",null,"Currently, supported workload: ",(0,r.kt)("inlineCode",{parentName:"p"},"CloneSet"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"Deployment"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"ReplicaSet"),"."),(0,r.kt)("h2",{id:"demo"},"Demo"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-demo\nspec:\n  targetRef:\n    apiVersion: apps/v1 | apps.kruise.io/v1alpha1\n    kind: Deployment | CloneSet\n    name: workload-xxx\n  subsets:\n    - name: subset-a\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-a\n    preferredNodeSelectorTerms:\n      - weight: 1\n        preference:\n        matchExpressions:\n          - key: another-node-label-key\n            operator: In\n            values:\n              - another-node-label-value\n      maxReplicas: 3\n      tolertions: []\n      patch:\n        metadata:\n          labels:\n            xxx-specific-label: xxx\n    - name: subset-b\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-b\n  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"targetRef"),": specify the target workload. Can not be mutated\uff0cand one workload can only correspond to one WorkloadSpread."),(0,r.kt)("h2",{id:"subsets"},"subsets"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"subsets")," consists of multiple domain called ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),", and each topology has different configuration."),(0,r.kt)("h3",{id:"sub-fields"},"sub-fields"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"name"),": the name of ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),", it is distinct in a WorkloadSpread, which represents a topology.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"maxReplicas"),"\uff1athe replicas limit of ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),", and must be Integer and >= 0. There is no replicas limit while the ",(0,r.kt)("inlineCode",{parentName:"p"},"maxReplicas")," is nil."),(0,r.kt)("blockquote",{parentName:"li"},(0,r.kt)("p",{parentName:"blockquote"},"Don't support percentage type in current version."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"requiredNodeSelectorTerm"),": match zone hardly\u3002")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"preferredNodeSelectorTerms"),": match zone softly\u3002"))),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Caution"),"\uff1a",(0,r.kt)("inlineCode",{parentName:"p"},"requiredNodeSelectorTerm")," corresponds the ",(0,r.kt)("inlineCode",{parentName:"p"},"requiredDuringSchedulingIgnoredDuringExecution")," of nodeAffinity.\n",(0,r.kt)("inlineCode",{parentName:"p"},"preferredNodeSelectorTerms")," corresponds the ",(0,r.kt)("inlineCode",{parentName:"p"},"preferredDuringSchedulingIgnoredDuringExecution")," of nodeAffinity."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"tolerations"),": the tolerations of Pod in ",(0,r.kt)("inlineCode",{parentName:"li"},"subset"),".")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'tolerations:\n- key: "key1"\n  operator: "Equal"\n  value: "value1"\n  effect: "NoSchedule"\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"patch"),": customize the Pod configuration of ",(0,r.kt)("inlineCode",{parentName:"li"},"subset"),", such as Annotations, Labels, Env. ")),(0,r.kt)("p",null,"Example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'# patch pod with a topology label:\npatch:\n  metadata:\n    labels:\n      topology.application.deploy/zone: "zone-a"\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'# patch pod container resources:\npatch:\n  spec:\n    containers:\n    - name: main\n      resources:\n        limit:\n          cpu: "2"\n          memory: 800Mi\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"# patch pod container env with a zone name:\npatch:\n  spec:\n    containers:\n    - name: main\n      env:\n      - name: K8S_AZ_NAME\n        value: zone-a\n")),(0,r.kt)("h2",{id:"schedule-strategy"},"Schedule strategy"),(0,r.kt)("p",null,"WorkloadSpread provides two kind strategies, the default strategy is ",(0,r.kt)("inlineCode",{parentName:"p"},"Fixed"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Fixed: "),(0,r.kt)("p",{parentName:"li"},"Workload is strictly spread according to the definition of the subset. ")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Adaptive:"),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Reschedule"),": Kruise will check the unschedulable Pods of subset. If it exceeds the defined duration, the failed Pods will be rescheduled to the other ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),"."))),(0,r.kt)("h2",{id:"requirements"},"Requirements"),(0,r.kt)("p",null,"WorkloadSpread defaults to be disabled. You have to configure the feature-gate ",(0,r.kt)("em",{parentName:"p"},"WorkloadSpread")," when install or upgrade Kruise:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n')),(0,r.kt)("h3",{id:"pod-webhook"},"Pod Webhook"),(0,r.kt)("p",null,"WorkloadSpread uses ",(0,r.kt)("inlineCode",{parentName:"p"},"webhook")," to inject fault domain rules."),(0,r.kt)("p",null,"If the ",(0,r.kt)("inlineCode",{parentName:"p"},"PodWebhook")," feature-gate is set to false, WorkloadSpread will also be disabled."),(0,r.kt)("h3",{id:"deletion-cost-feature"},"deletion-cost feature"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"CloneSet")," has supported deletion-cost feature in the latest versions."),(0,r.kt)("p",null,"The other native workload need kubernetes version >= 1.21. (In 1.21, users need to enable PodDeletionCost feature-gate, and since 1.22 it will be enabled by default)"),(0,r.kt)("h2",{id:"scale-order"},"Scale order:"),(0,r.kt)("p",null,"The workload managed by WorkloadSpread will scale according to the defined order in ",(0,r.kt)("inlineCode",{parentName:"p"},"spec.subsets"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"The order of ",(0,r.kt)("inlineCode",{parentName:"strong"},"subset")," in ",(0,r.kt)("inlineCode",{parentName:"strong"},"spec.subsets")," can be changed"),", which can adjust the scale order of workload."),(0,r.kt)("h3",{id:"scale-out"},"Scale out"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The Pods are scheduled in the subset order defined in the ",(0,r.kt)("inlineCode",{parentName:"li"},"spec.subsets"),". It will be scheduled in the next ",(0,r.kt)("inlineCode",{parentName:"li"},"subset")," while the replica number reaches the maxReplicas of ",(0,r.kt)("inlineCode",{parentName:"li"},"subset")," ")),(0,r.kt)("h3",{id:"scale-in"},"Scale in"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"When the replica number of the ",(0,r.kt)("inlineCode",{parentName:"li"},"subset")," is greater than the ",(0,r.kt)("inlineCode",{parentName:"li"},"maxReplicas"),", the extra Pods will be removed in a high priority."),(0,r.kt)("li",{parentName:"ul"},"According to the ",(0,r.kt)("inlineCode",{parentName:"li"},"subset")," order in the ",(0,r.kt)("inlineCode",{parentName:"li"},"spec.subsets"),", the Pods of the ",(0,r.kt)("inlineCode",{parentName:"li"},"subset")," at the back are deleted before the Pods at the front.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    10          10        10\n# deletion order: c -> b -> a\n\n#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    20          20        20\n# deletion order: b -> a -> c\n")),(0,r.kt)("h2",{id:"feature-gates"},"feature-gates"),(0,r.kt)("p",null,"WorkloadSpread feature is turned off by default, if you want to turn it on set feature-gates ",(0,r.kt)("em",{parentName:"p"},"WorkloadSpread"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n')),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("h3",{id:"elastic-deployment"},"Elastic deployment"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"zone-a"),"(ACK) holds 100 Pods, ",(0,r.kt)("inlineCode",{parentName:"p"},"zone-b"),"(ECI) as an elastic zone holds additional Pods."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a WorkloadSpread instance.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadta:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef: # workload in the same namespace\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: workload-xxx\n  subsets:\n  - name: ACK # zone ACK\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - ack\n    maxReplicas: 100\n    patch: # inject label.\n      metadata:\n        labels:\n          deploy/zone: ack\n  - name: ECI # zone ECI\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - eci\n    patch:\n      metadata:\n        labels:\n          deploy/zone: eci\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Creat a corresponding workload, the number of replicas ca be adjusted freely.")),(0,r.kt)("h4",{id:"effect"},"Effect"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"When the number of ",(0,r.kt)("inlineCode",{parentName:"li"},"replicas")," <= 100, the Pods are scheduled in ",(0,r.kt)("inlineCode",{parentName:"li"},"ACK")," zone."),(0,r.kt)("li",{parentName:"ul"},"When the number of ",(0,r.kt)("inlineCode",{parentName:"li"},"replicas")," > 100, the 100 Pods are in ",(0,r.kt)("inlineCode",{parentName:"li"},"ACK")," zone, the extra Pods are scheduled in ",(0,r.kt)("inlineCode",{parentName:"li"},"ECI")," zone."),(0,r.kt)("li",{parentName:"ul"},"The Pods in ",(0,r.kt)("inlineCode",{parentName:"li"},"ECI")," elastic zone are removed first when scaling in.")),(0,r.kt)("h3",{id:"multi-domain-deployment"},"Multi-domain deployment"),(0,r.kt)("p",null,"Deploy 100 Pods to two ",(0,r.kt)("inlineCode",{parentName:"p"},"zone"),"(zone-a, zone-b) separately."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a WorkloadSpread instance.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadta:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: workload-xxx\n  subsets:\n  - name: subset-a\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-a\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          deploy/zone: zone-a\n  - name: subset-b\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-b\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          deploy/zone: zone-b\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Creat a corresponding workload with a 200 replicas, or perform a rolling update on an existing workload.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"If the spread of zone needs to be changed, first adjust the ",(0,r.kt)("inlineCode",{parentName:"p"},"maxReplicas")," of ",(0,r.kt)("inlineCode",{parentName:"p"},"subset"),", and then change the ",(0,r.kt)("inlineCode",{parentName:"p"},"replicas")," of workload."))))}m.isMDXComponent=!0}}]);
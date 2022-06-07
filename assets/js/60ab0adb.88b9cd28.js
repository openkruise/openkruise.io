"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6928],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return h}});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=o.createContext({}),p=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return o.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},c=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=p(n),h=a,m=c["".concat(s,".").concat(h)]||c[h]||u[h]||r;return n?o.createElement(m,i(i({ref:t},d),{},{components:n})):o.createElement(m,i({ref:t},d))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,i=new Array(r);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<r;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}c.displayName="MDXCreateElement"},3052:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var o=n(7462),a=n(3366),r=(n(7294),n(3905)),i=["components"],l={slug:"openkruise-1.2",title:"OpenKruise v1.2, new PersistentPodState feature to achieve IP retention",authors:["FillZpp"],tags:["release"]},s=void 0,p={permalink:"/blog/openkruise-1.2",editUrl:"https://github.com/openkruise/openkruise.io/edit/master/blog/2022-06-07-release-1.2.md",source:"@site/blog/2022-06-07-release-1.2.md",title:"OpenKruise v1.2, new PersistentPodState feature to achieve IP retention",description:"We\u2019re pleased to announce the release of Kubernetes 1.2, which is a CNCF Sandbox level project.",date:"2022-06-07T00:00:00.000Z",formattedDate:"June 7, 2022",tags:[{label:"release",permalink:"/blog/tags/release"}],readingTime:7.065,truncated:!1,authors:[{name:"Siyu Wang",title:"Maintainer of OpenKruise",url:"https://github.com/FillZpp",imageURL:"https://github.com/FillZpp.png",key:"FillZpp"}],frontMatter:{slug:"openkruise-1.2",title:"OpenKruise v1.2, new PersistentPodState feature to achieve IP retention",authors:["FillZpp"],tags:["release"]},nextItem:{title:"OpenKruise v1.1, features enhanced, improve performance in large-scale clusters",permalink:"/blog/openkruise-1.1"}},d={authorsImageUrls:[void 0]},u=[{value:"What&#39;s new?",id:"whats-new",level:2},{value:"1. New CRD and Controller: PersistentPodState",id:"1-new-crd-and-controller-persistentpodstate",level:3},{value:"2. CloneSet percentage partition calculation changed (<strong>breaking</strong>), and a new field in its status",id:"2-cloneset-percentage-partition-calculation-changed-breaking-and-a-new-field-in-its-status",level:3},{value:"3. Able to mark Pod not-ready for lifecycle hook",id:"3-able-to-mark-pod-not-ready-for-lifecycle-hook",level:3},{value:"4. PodUnavailableBudget supports any custom workloads and performance optimization",id:"4-podunavailablebudget-supports-any-custom-workloads-and-performance-optimization",level:3},{value:"5. Other changes",id:"5-other-changes",level:3},{value:"Get Involved",id:"get-involved",level:2}],c={toc:u};function h(e){var t=e.components,n=(0,a.Z)(e,i);return(0,r.kt)("wrapper",(0,o.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"We\u2019re pleased to announce the release of Kubernetes 1.2, which is a CNCF Sandbox level project."),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://openkruise.io"},"OpenKruise")," is an extended component suite for Kubernetes, which mainly focuses on application automations, such as deployment, upgrade, ops and availability protection. Mostly features provided by OpenKruise are built primarily based on CRD extensions. They can work in pure Kubernetes clusters without any other dependences."),(0,r.kt)("h2",{id:"whats-new"},"What's new?"),(0,r.kt)("p",null,"In release v1.2, OpenKruise provides a new CRD named ",(0,r.kt)("inlineCode",{parentName:"p"},"PersistentPodState"),", some new fields of CloneSet status and lifecycle hook, and optimization of PodUnavailableBudget."),(0,r.kt)("p",null,"Here we are going to introduce some changes of it."),(0,r.kt)("h3",{id:"1-new-crd-and-controller-persistentpodstate"},"1. New CRD and Controller: PersistentPodState"),(0,r.kt)("p",null,"With the development of cloud native, more and more companies start to deploy stateful services (e.g., Etcd, MQ) using Kubernetes. K8S StatefulSet is a workload for managing stateful services, and it considers the deployment characteristics of stateful services in many aspects.\nHowever, StatefulSet persistent only limited pod state, such as Pod Name is ordered and unchanging, PVC persistence, and can not cover other states, e.g. Pod IP retention, priority scheduling to previously deployed Nodes, etc. Typical Cases:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Service Discovery Middleware services are exceptionally sensitive to the Pod IP after deployment, requiring that the IP cannot be changed."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Database services persist data to the host disk, and changes to the Node to which they belong will result in data loss.")))),(0,r.kt)("p",null,"In response to the above description, by customizing ",(0,r.kt)("inlineCode",{parentName:"p"},"PersistentPodState"),' CRD, Kruise is able to persistent other states of the Pod, such as "IP Retention".'),(0,r.kt)("p",null,"An object of ",(0,r.kt)("inlineCode",{parentName:"p"},"PersistentPodState")," may look like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: PersistentPodState\nmetadata:\n  name: echoserver\n  namespace: echoserver\nspec:\n  targetRef:\n    # Native k8s or kruise StatefulSet\n    # only support StatefulSet\n    apiVersion: apps.kruise.io/v1beta1\n    kind: StatefulSet\n    name: echoserver\n  # required node affinity. As follows, Pod rebuild will force deployment to the same zone\n  requiredPersistentTopology:\n    nodeTopologyKeys:\n      failure-domain.beta.kubernetes.io/zone[,other node labels]\n  # preferred node affinity. As follows, Pod rebuild will preferred deployment to the same node\n  preferredPersistentTopology:\n    - preference:\n        nodeTopologyKeys:\n          kubernetes.io/hostname[,other node labels]\n      # int [1, 100]\n      weight: 100\n")),(0,r.kt)("p",null,'"IP Retention" should be a common requirement for K8S deployments of stateful services. It does not mean "Specified Pod IP", but requires that the Pod IP does not change after the first deployment, either by service release or by machine eviction.\nTo achieve this, we need the K8S network component to support Pod IP retention and the ability to keep the IP as unchanged as possible.\nIn this article, we have modified the Host-local plugin in the flannel network component so that it can achieve the effect of keeping the Pod IP unchanged under the same Node.\nRelated principles will not be stated here, please refer to the code: ',(0,r.kt)("a",{parentName:"p",href:"https://github.com/openkruise/samples/tree/master/containernetworking/plugins"},"host-local"),"."),(0,r.kt)("p",null,'IP retention seems to be supported by the network component, how is it related with PersistentPodState?\nWell, there are some limitations to the implementation of "Pod IP unchanged" by network components. For example, flannel can only support the same Node to keep the Pod IP unchanged.\nHowever, the most important feature of K8S scheduling is "uncertainty", so "how to ensure that Pods are rebuilt and scheduled to the same Node" is the problem that PersistentPodState solves.'),(0,r.kt)("p",null,"Also you can add the annotations below on your StatefulSet or Advanced StatefulSet, to let Kruise automatically create a ",(0,r.kt)("inlineCode",{parentName:"p"},"PersistentPodState")," object for the StatefulSet. So you don't have to create it manually."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: StatefulSet\nmetadata:\n  annotations:\n    # auto generate PersistentPodState\n    kruise.io/auto-generate-persistent-pod-state: "true"\n    # preferred node affinity, As follows, Pod rebuild will preferred deployment to the same node\n    kruise.io/preferred-persistent-topology: kubernetes.io/hostname[,other node labels]\n    # required node affinity, As follows, Pod rebuild will force deployment to the same zone\n    kruise.io/required-persistent-topology: failure-domain.beta.kubernetes.io/zone[,other node labels]\n')),(0,r.kt)("h3",{id:"2-cloneset-percentage-partition-calculation-changed-breaking-and-a-new-field-in-its-status"},"2. CloneSet percentage partition calculation changed (",(0,r.kt)("strong",{parentName:"h3"},"breaking"),"), and a new field in its status"),(0,r.kt)("p",null,"Previously, CloneSet calculates its ",(0,r.kt)("inlineCode",{parentName:"p"},"partition")," with round up if it is a percentage value, which means\neven you set ",(0,r.kt)("inlineCode",{parentName:"p"},"partition")," to be a percentage less than ",(0,r.kt)("inlineCode",{parentName:"p"},"100%"),", it might update no Pods to the new revision.\nFor example, the real partition of a CloneSet with ",(0,r.kt)("inlineCode",{parentName:"p"},"replicas=8")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"partition=90%")," will be calculated as\n",(0,r.kt)("inlineCode",{parentName:"p"},"8")," because of ",(0,r.kt)("inlineCode",{parentName:"p"},"8 * 90%")," with round up, so it will not update any Pod.\nThis is a little confused, especially when we are using a rollout component like Kruise Rollout or Argo."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"So since v1.2, CloneSet will make sure there is at lease one Pod should be updated when ",(0,r.kt)("inlineCode",{parentName:"strong"},"partition")," is a percentage less than ",(0,r.kt)("inlineCode",{parentName:"strong"},"100%"),", unless the CloneSet has ",(0,r.kt)("inlineCode",{parentName:"strong"},"replicas <= 1"),".")),(0,r.kt)("p",null,"However, it might be difficult for users to understand this arithmetic, but they have to known the expected\nupdated number of Pods after a percentage partition was set."),(0,r.kt)("p",null,"So we also provide a new field ",(0,r.kt)("inlineCode",{parentName:"p"},"expectedUpdatedReplicas")," in CloneSet status, which directly shows the\nexpected updated number of Pods based on the given ",(0,r.kt)("inlineCode",{parentName:"p"},"partition"),".\nUsers only have to compare ",(0,r.kt)("inlineCode",{parentName:"p"},"status.updatedReplicas >= status.expectedUpdatedReplicas"),"\nto decide whether their CloneSet has finished rolling out new revision under partition restriction or not."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nspec:\n  replicas: 8\n  updateStrategy:\n    partition: 90%\nstatus:\n  replicas: 8\n  expectedUpdatedReplicas: 1\n  updatedReplicas: 1\n  updatedReadyReplicas: 1\n")),(0,r.kt)("h3",{id:"3-able-to-mark-pod-not-ready-for-lifecycle-hook"},"3. Able to mark Pod not-ready for lifecycle hook"),(0,r.kt)("p",null,"Kruise has already provided lifecycle hook in previous versions. CloneSet and Advanced StatefulSet support both\nPreDelete and InPlaceUpdate hooks, while Advanced DaemonSet only supports PreDelete hook."),(0,r.kt)("p",null,"Previously, the hooks only pause the operation and allow users to do something\n(for example remove pod from service endpoints) during Pod deleting and before/after in-place update.\nBut the Pod is probably Ready during the hook state, so that removing it from some custom service implementation\nmay break the rule of Kubernetes that we'd better only remove NotReady Pods from the endpoints."),(0,r.kt)("p",null,"So that a new field has been added into the lifecycle hook, ",(0,r.kt)("inlineCode",{parentName:"p"},"markPodNotReady")," indicates the hooked Pod should be\nmarked as NotReady or not."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},'type LifecycleStateType string\n\n// Lifecycle contains the hooks for Pod lifecycle.\ntype Lifecycle struct \n    // PreDelete is the hook before Pod to be deleted. \n    PreDelete *LifecycleHook `json:"preDelete,omitempty"` \n    // InPlaceUpdate is the hook before Pod to update and after Pod has been updated. \n    InPlaceUpdate *LifecycleHook `json:"inPlaceUpdate,omitempty"`\n}\n\ntype LifecycleHook struct {\n    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`\n    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`\n    \n    /**********************  FEATURE STATE: 1.2.0 ************************/\n    // MarkPodNotReady = true means:\n    // - Pod will be set to \'NotReady\' at preparingDelete/preparingUpdate state.\n    // - Pod will be restored to \'Ready\' at Updated state if it was set to \'NotReady\' at preparingUpdate state.\n    // Default to false.\n    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`\n    /*********************************************************************/ \n}\n')),(0,r.kt)("p",null,"For PreDelete hook, it will set Pod to be NotReady during PreparingDelete state if ",(0,r.kt)("inlineCode",{parentName:"p"},"markPodNotReady")," is true,\nand the Pod can not be changed back to normal even if the ",(0,r.kt)("inlineCode",{parentName:"p"},"replicas")," is increased again."),(0,r.kt)("p",null,"For InPlaceUpdate hook, it will set Pod to be NotReady during PreparingUpdate state if ",(0,r.kt)("inlineCode",{parentName:"p"},"markPodNotReady")," is true,\nand the NotReady condition will be removed during Updated state."),(0,r.kt)("h3",{id:"4-podunavailablebudget-supports-any-custom-workloads-and-performance-optimization"},"4. PodUnavailableBudget supports any custom workloads and performance optimization"),(0,r.kt)("p",null,"Kubernetes offers PodDisruptionBudget to help users run highly available applications even when you introduce frequent voluntary disruptions,\nbut it can only constrain the voluntary disruption triggered by the Eviction API."),(0,r.kt)("p",null,"In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or SLA degradation, which greatly improves the high availability of application services.\nIt can not only protect application Pods from eviction but also deletion, in-place update and other operations that could make Pods not ready."),(0,r.kt)("p",null,"Previously, PodUnavailableBudget only supports some specific workloads like CloneSet and Deployment. But it can not recognize unknown workloads that\nmay be defined by users themself."),(0,r.kt)("p",null,"Since v1.2 release, PodUnavailableBudget has supported any custom workloads to protect their Pods from unavailable operations.\nAll you have to do is to declare scale subresource for those custom workloads."),(0,r.kt)("p",null,"It looks like this in CRD:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"    subresources:\n      scale:\n        labelSelectorPath: .status.labelSelector\n        specReplicasPath: .spec.replicas\n        statusReplicasPath: .status.replicas\n")),(0,r.kt)("p",null,"But if you are using kubebuilder or operator-sdk to generate your project, one line comment on your workload struct will be fine:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},"// +kubebuilder:subresource:scale:specpath=.spec.replicas,statuspath=.status.replicas,selectorpath=.status.labelSelector\n")),(0,r.kt)("p",null,"Besides, PodUnavailableBudget also optimizes its performance for large-scale clusters by disable DeepCopy from client list."),(0,r.kt)("h3",{id:"5-other-changes"},"5. Other changes"),(0,r.kt)("p",null,"For more changes, their authors and commits, you can read the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise/releases"},"Github release"),"."),(0,r.kt)("h2",{id:"get-involved"},"Get Involved"),(0,r.kt)("p",null,"Welcome to get involved with OpenKruise by joining us in Github/Slack/DingTalk/WeChat.\nHave something you\u2019d like to broadcast to our community?\nShare your voice at our ",(0,r.kt)("a",{parentName:"p",href:"https://shimo.im/docs/gXqmeQOYBehZ4vqo"},"Bi-weekly community meeting (Chinese)"),", or through the channels below:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Join the community on ",(0,r.kt)("a",{parentName:"li",href:"https://kubernetes.slack.com/channels/openkruise"},"Slack")," (English)."),(0,r.kt)("li",{parentName:"ul"},"Join the community on DingTalk: Search GroupID ",(0,r.kt)("inlineCode",{parentName:"li"},"23330762")," (Chinese)."),(0,r.kt)("li",{parentName:"ul"},"Join the community on WeChat (new): Search User ",(0,r.kt)("inlineCode",{parentName:"li"},"openkruise")," and let the robot invite you (Chinese).")))}h.isMDXComponent=!0}}]);
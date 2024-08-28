"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6967],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return c}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},s=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),m=d(n),c=o,g=m["".concat(p,".").concat(c)]||m[c]||u[c]||l;return n?a.createElement(g,r(r({ref:t},s),{},{components:n})):a.createElement(g,r({ref:t},s))}));function c(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,r=new Array(l);r[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,r[1]=i;for(var d=2;d<l;d++)r[d]=n[d];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5282:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return u}});var a=n(7462),o=n(3366),l=(n(7294),n(3905)),r=["components"],i={title:"Advanced DaemonSet"},p=void 0,d={unversionedId:"user-manuals/advanceddaemonset",id:"version-v1.6/user-manuals/advanceddaemonset",title:"Advanced DaemonSet",description:"This controller enhances the rolling update workflow of Kubernetes DaemonSet",source:"@site/versioned_docs/version-v1.6/user-manuals/advanceddaemonset.md",sourceDirName:"user-manuals",slug:"/user-manuals/advanceddaemonset",permalink:"/docs/v1.6/user-manuals/advanceddaemonset",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advanceddaemonset.md",tags:[],version:"v1.6",lastUpdatedBy:"berg",lastUpdatedAt:1711105168,formattedLastUpdatedAt:"3/22/2024",frontMatter:{title:"Advanced DaemonSet"},sidebar:"docs",previous:{title:"Advanced StatefulSet",permalink:"/docs/v1.6/user-manuals/advancedstatefulset"},next:{title:"BroadcastJob",permalink:"/docs/v1.6/user-manuals/broadcastjob"}},s={},u=[{value:"Enhanced strategies",id:"enhanced-strategies",level:2},{value:"Type for rolling update",id:"type-for-rolling-update",level:3},{value:"Selector for rolling update",id:"selector-for-rolling-update",level:3},{value:"Partition for rolling update and scaling up",id:"partition-for-rolling-update-and-scaling-up",level:3},{value:"Paused for rolling update",id:"paused-for-rolling-update",level:3},{value:"Pre-download image for update",id:"pre-download-image-for-update",level:3},{value:"Lifecycle hook",id:"lifecycle-hook",level:3},{value:"MarkPodNotReady",id:"markpodnotready",level:4},{value:"Example for user controller logic",id:"example-for-user-controller-logic",level:4}],m={toc:u};function c(e){var t=e.components,n=(0,o.Z)(e,r);return(0,l.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"This controller enhances the rolling update workflow of Kubernetes ",(0,l.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/"},"DaemonSet"),"\ncontroller in large-scale scenarios, such as support for image pre-download, in-place upgrade, etc."),(0,l.kt)("p",null,"If you don't know much about the Kubernetes DaemonSet, we strongly recommend you read its documents before learning Advanced DaemonSet."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/"},"Concept of Kubernetes DaemonSet")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/"},"Perform a Rolling Update on a DaemonSet")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/manage-daemon/rollback-daemon-set/"},"Perform a Rollback on a DaemonSet"))),(0,l.kt)("p",null,"Note that Advanced DaemonSet extends the same CRD schema of default DaemonSet with newly added fields.\nThe CRD kind name is still ",(0,l.kt)("inlineCode",{parentName:"p"},"DaemonSet"),".\nThis is done on purpose so that user can easily migrate workload to the Advanced DaemonSet from the\ndefault DaemonSet. For example, one may simply replace the value of ",(0,l.kt)("inlineCode",{parentName:"p"},"apiVersion")," in the DaemonSet yaml\nfile from ",(0,l.kt)("inlineCode",{parentName:"p"},"apps/v1")," to ",(0,l.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/v1alpha1")," after installing Kruise manager."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1alpha1\n   kind: DaemonSet\n   metadata:\n     name: sample-ds\n   spec:\n     #...\n")),(0,l.kt)("h2",{id:"enhanced-strategies"},"Enhanced strategies"),(0,l.kt)("p",null,"These new fields have been added into RollingUpdateDaemonSet:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-go"},'const (\n+    // StandardRollingUpdateType replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.\n+    // this is the default type for RollingUpdate.\n+    StandardRollingUpdateType RollingUpdateType = "Standard"\n\n+    // InplaceRollingUpdateType update container image without killing the pod if possible.\n+    InplaceRollingUpdateType RollingUpdateType = "InPlaceIfPossible"\n)\n\n// Spec to control the desired behavior of daemon set rolling update.\ntype RollingUpdateDaemonSet struct {\n+    // Type is to specify which kind of rollingUpdate.\n+    Type RollingUpdateType `json:"rollingUpdateType,omitempty" protobuf:"bytes,1,opt,name=rollingUpdateType"`\n\n    // ...\n    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty" protobuf:"bytes,2,opt,name=maxUnavailable"`\n\n    // ...\n    MaxSurge *intstr.IntOrString `json:"maxSurge,omitempty" protobuf:"bytes,7,opt,name=maxSurge"`\n\n+    // A label query over nodes that are managed by the daemon set RollingUpdate.\n+    // Must match in order to be controlled.\n+    // It must match the node\'s labels.\n+    Selector *metav1.LabelSelector `json:"selector,omitempty" protobuf:"bytes,3,opt,name=selector"`\n\n+    // The number of DaemonSet pods remained to be old version.\n+    // Default value is 0.\n+    // Maximum value is status.DesiredNumberScheduled, which means no pod will be updated.\n+    // +optional\n+    Partition *int32 `json:"partition,omitempty" protobuf:"varint,4,opt,name=partition"`\n\n+    // Indicates that the daemon set is paused and will not be processed by the\n+    // daemon set controller.\n+    // +optional\n+    Paused *bool `json:"paused,omitempty" protobuf:"varint,5,opt,name=paused"`\n}\n')),(0,l.kt)("h3",{id:"type-for-rolling-update"},"Type for rolling update"),(0,l.kt)("p",null,"Advanced DaemonSet has a ",(0,l.kt)("inlineCode",{parentName:"p"},"rollingUpdateType")," field in ",(0,l.kt)("inlineCode",{parentName:"p"},"spec.updateStrategy.rollingUpdate"),"\nwhich controls the way to rolling update."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"Standard")," (default): controller will update daemon Pods by recreating them. It is the same behavior as upstream DaemonSet.\nYou can use ",(0,l.kt)("inlineCode",{parentName:"li"},"maxUnavailable")," or ",(0,l.kt)("inlineCode",{parentName:"li"},"maxSurge")," to control order of recreating old and new pods."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"InPlaceIfPossible"),": controller will try to in-place update Pod instead of recreating them if possible.\nYou may need to read the ",(0,l.kt)("a",{parentName:"li",href:"../core-concepts/inplace-update"},"concept doc")," for more details of in-place update.\nNote that in this type, you can only use ",(0,l.kt)("inlineCode",{parentName:"li"},"maxUnavailable")," without ",(0,l.kt)("inlineCode",{parentName:"li"},"maxSurge"),".")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      rollingUpdateType: Standard\n")),(0,l.kt)("h3",{id:"selector-for-rolling-update"},"Selector for rolling update"),(0,l.kt)("p",null,"It helps users to update Pods on specific nodes whose labels could be matched with the selector."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      selector:\n        matchLabels:\n          nodeType: canary\n")),(0,l.kt)("h3",{id:"partition-for-rolling-update-and-scaling-up"},"Partition for rolling update and scaling up"),(0,l.kt)("p",null,"This strategy defines rules for calculating the priority of updating pods.\n",(0,l.kt)("strong",{parentName:"p"},"Partition is the number of DaemonSet pods that should be remained to be old version.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      partition: 10\n")),(0,l.kt)("p",null,"And if you put ",(0,l.kt)("inlineCode",{parentName:"p"},'daemonset.kruise.io/progressive-create-pod: "true"')," annotation into Advanced DaemonSet,\nthe ",(0,l.kt)("inlineCode",{parentName:"p"},"partition")," will also control the number of pods to be created when scaling up."),(0,l.kt)("h3",{id:"paused-for-rolling-update"},"Paused for rolling update"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"paused")," indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n")),(0,l.kt)("h3",{id:"pre-download-image-for-update"},"Pre-download image for update"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.3.0"),(0,l.kt)("p",null,"If you have enabled the ",(0,l.kt)("inlineCode",{parentName:"p"},"PreDownloadImageForDaemonSetUpdate")," feature-gate during ",(0,l.kt)("a",{parentName:"p",href:"../installation#optional-feature-gate"},"Kruise installation or upgrade"),",\nDaemonSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.\nIt is quite useful to accelerate the progress of applications upgrade."),(0,l.kt)("p",null,"The parallelism of each new image pre-downloading by DaemonSet is ",(0,l.kt)("inlineCode",{parentName:"p"},"1"),", which means the image is downloaded on nodes one by one.\nYou can change the parallelism using ",(0,l.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/image-predownload-parallelism")," annotation on DaemonSet according to the capability of image registry,\nfor registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n')),(0,l.kt)("h3",{id:"lifecycle-hook"},"Lifecycle hook"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.1.0"),(0,l.kt)("p",null,"This is similar to ",(0,l.kt)("a",{parentName:"p",href:"./cloneset#lifecycle-hook"},"Lifecycle hook of CloneSet"),"."),(0,l.kt)("p",null,"Now Advanced DaemonSet only supports PreDelete hook,\nwhich means it allows users to do something (for example check node resources) before Pod deleting."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-go"},'type LifecycleStateType string\n\n// Lifecycle contains the hooks for Pod lifecycle.\ntype Lifecycle struct {\n    // PreDelete is the hook before Pod to be deleted.\n    PreDelete *LifecycleHook `json:"preDelete,omitempty"`\n}\n\ntype LifecycleHook struct {\n    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`\n    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`\n\n    /**********************  FEATURE STATE: 1.2.0 ************************/\n    // MarkPodNotReady = true means:\n    // - Pod will be set to \'NotReady\' at preparingDelete/preparingUpdate state.\n    // - Pod will be restored to \'Ready\' at Updated state if it was set to \'NotReady\' at preparingUpdate state.\n    // Default to false.\n    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`\n    /*********************************************************************/\n}\n')),(0,l.kt)("p",null,"Examples:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n\n  # define with label\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n')),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"When Advanced DaemonSet delete a Pod (including scale in and recreate update):",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Delete it directly if no lifecycle hook definition or Pod not matched preDelete hook"),(0,l.kt)("li",{parentName:"ul"},"Otherwise, Advanced DaemonSet will firstly update Pod to ",(0,l.kt)("inlineCode",{parentName:"li"},"PreparingDelete")," state and wait for user controller to remove the label/finalizer and Pod not matched preDelete hook")))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    example.io/block-deleting: "true"                   # the pod is hooked by PreDelete hook label\n    lifecycle.apps.kruise.io/state: PreparingDelete     # so we update it to `PreparingDelete` state and wait for user controller to do something and remove the label\n')),(0,l.kt)("h4",{id:"markpodnotready"},"MarkPodNotReady"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.2.0"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"  lifecycle:\n    preDelete:\n      markPodNotReady: true\n      finalizersHandler:\n      - example.io/unready-blocker\n")),(0,l.kt)("p",null,"If you set ",(0,l.kt)("inlineCode",{parentName:"p"},"markPodNotReady=true")," for ",(0,l.kt)("inlineCode",{parentName:"p"},"preDelete"),", Kruise will try to set ",(0,l.kt)("inlineCode",{parentName:"p"},"KruisePodReady")," condition to ",(0,l.kt)("inlineCode",{parentName:"p"},"False")," when Pods enter ",(0,l.kt)("inlineCode",{parentName:"p"},"PreparingDelete")," lifecycle state, and Pods will be ",(0,l.kt)("strong",{parentName:"p"},"NotReady"),", but containers still ",(0,l.kt)("inlineCode",{parentName:"p"},"Running"),"."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"One can use this ",(0,l.kt)("inlineCode",{parentName:"strong"},"markPodNotReady")," feature to drain service traffic before terminating containers.")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: this feature only works when pod has ",(0,l.kt)("inlineCode",{parentName:"em"},"KruisePodReady")," ReadinessGate.")),(0,l.kt)("h4",{id:"example-for-user-controller-logic"},"Example for user controller logic"),(0,l.kt)("p",null,"Same as yaml example above, we should firstly define ",(0,l.kt)("inlineCode",{parentName:"p"},"example.io/block-deleting")," label in template and lifecycle of Advanced DaemonSet."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  template:\n    metadata:\n      labels:\n        example.io/block-deleting: "true"\n  # ...\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n')),(0,l.kt)("p",null,"User controller logic:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"For Pod in ",(0,l.kt)("inlineCode",{parentName:"li"},"PreparingDelete"),", check if its Node existing, do something (for example reserve resources) and then remove the label.")))}c.isMDXComponent=!0}}]);
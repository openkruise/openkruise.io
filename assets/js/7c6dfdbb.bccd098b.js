"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3133],{3092:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>o,toc:()=>d});const o=JSON.parse('{"id":"user-manuals/advanceddaemonset","title":"Advanced DaemonSet","description":"This controller enhances the rolling update workflow of Kubernetes DaemonSet","source":"@site/versioned_docs/version-v1.6/user-manuals/advanceddaemonset.md","sourceDirName":"user-manuals","slug":"/user-manuals/advanceddaemonset","permalink":"/docs/v1.6/user-manuals/advanceddaemonset","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advanceddaemonset.md","tags":[],"version":"v1.6","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{"title":"Advanced DaemonSet"},"sidebar":"docs","previous":{"title":"Advanced StatefulSet","permalink":"/docs/v1.6/user-manuals/advancedstatefulset"},"next":{"title":"BroadcastJob","permalink":"/docs/v1.6/user-manuals/broadcastjob"}}');var t=a(74848),l=a(28453);const r={title:"Advanced DaemonSet"},i=void 0,s={},d=[{value:"Enhanced strategies",id:"enhanced-strategies",level:2},{value:"Type for rolling update",id:"type-for-rolling-update",level:3},{value:"Selector for rolling update",id:"selector-for-rolling-update",level:3},{value:"Partition for rolling update and scaling up",id:"partition-for-rolling-update-and-scaling-up",level:3},{value:"Paused for rolling update",id:"paused-for-rolling-update",level:3},{value:"Pre-download image for update",id:"pre-download-image-for-update",level:3},{value:"Lifecycle hook",id:"lifecycle-hook",level:3},{value:"MarkPodNotReady",id:"markpodnotready",level:4},{value:"Example for user controller logic",id:"example-for-user-controller-logic",level:4}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["This controller enhances the rolling update workflow of Kubernetes ",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",children:"DaemonSet"}),"\ncontroller in large-scale scenarios, such as support for image pre-download, in-place upgrade, etc."]}),"\n",(0,t.jsx)(n.p,{children:"If you don't know much about the Kubernetes DaemonSet, we strongly recommend you read its documents before learning Advanced DaemonSet."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",children:"Concept of Kubernetes DaemonSet"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/",children:"Perform a Rolling Update on a DaemonSet"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/manage-daemon/rollback-daemon-set/",children:"Perform a Rollback on a DaemonSet"})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Note that Advanced DaemonSet extends the same CRD schema of default DaemonSet with newly added fields.\nThe CRD kind name is still ",(0,t.jsx)(n.code,{children:"DaemonSet"}),".\nThis is done on purpose so that user can easily migrate workload to the Advanced DaemonSet from the\ndefault DaemonSet. For example, one may simply replace the value of ",(0,t.jsx)(n.code,{children:"apiVersion"})," in the DaemonSet yaml\nfile from ",(0,t.jsx)(n.code,{children:"apps/v1"})," to ",(0,t.jsx)(n.code,{children:"apps.kruise.io/v1alpha1"})," after installing Kruise manager."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1alpha1\n   kind: DaemonSet\n   metadata:\n     name: sample-ds\n   spec:\n     #...\n"})}),"\n",(0,t.jsx)(n.h2,{id:"enhanced-strategies",children:"Enhanced strategies"}),"\n",(0,t.jsx)(n.p,{children:"These new fields have been added into RollingUpdateDaemonSet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'const (\n+    // StandardRollingUpdateType replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.\n+    // this is the default type for RollingUpdate.\n+    StandardRollingUpdateType RollingUpdateType = "Standard"\n\n+    // InplaceRollingUpdateType update container image without killing the pod if possible.\n+    InplaceRollingUpdateType RollingUpdateType = "InPlaceIfPossible"\n)\n\n// Spec to control the desired behavior of daemon set rolling update.\ntype RollingUpdateDaemonSet struct {\n+    // Type is to specify which kind of rollingUpdate.\n+    Type RollingUpdateType `json:"rollingUpdateType,omitempty" protobuf:"bytes,1,opt,name=rollingUpdateType"`\n\n    // ...\n    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty" protobuf:"bytes,2,opt,name=maxUnavailable"`\n\n    // ...\n    MaxSurge *intstr.IntOrString `json:"maxSurge,omitempty" protobuf:"bytes,7,opt,name=maxSurge"`\n\n+    // A label query over nodes that are managed by the daemon set RollingUpdate.\n+    // Must match in order to be controlled.\n+    // It must match the node\'s labels.\n+    Selector *metav1.LabelSelector `json:"selector,omitempty" protobuf:"bytes,3,opt,name=selector"`\n\n+    // The number of DaemonSet pods remained to be old version.\n+    // Default value is 0.\n+    // Maximum value is status.DesiredNumberScheduled, which means no pod will be updated.\n+    // +optional\n+    Partition *int32 `json:"partition,omitempty" protobuf:"varint,4,opt,name=partition"`\n\n+    // Indicates that the daemon set is paused and will not be processed by the\n+    // daemon set controller.\n+    // +optional\n+    Paused *bool `json:"paused,omitempty" protobuf:"varint,5,opt,name=paused"`\n}\n'})}),"\n",(0,t.jsx)(n.h3,{id:"type-for-rolling-update",children:"Type for rolling update"}),"\n",(0,t.jsxs)(n.p,{children:["Advanced DaemonSet has a ",(0,t.jsx)(n.code,{children:"rollingUpdateType"})," field in ",(0,t.jsx)(n.code,{children:"spec.updateStrategy.rollingUpdate"}),"\nwhich controls the way to rolling update."]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Standard"})," (default): controller will update daemon Pods by recreating them. It is the same behavior as upstream DaemonSet.\nYou can use ",(0,t.jsx)(n.code,{children:"maxUnavailable"})," or ",(0,t.jsx)(n.code,{children:"maxSurge"})," to control order of recreating old and new pods."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"InPlaceIfPossible"}),": controller will try to in-place update Pod instead of recreating them if possible.\nYou may need to read the ",(0,t.jsx)(n.a,{href:"../core-concepts/inplace-update",children:"concept doc"})," for more details of in-place update.\nNote that in this type, you can only use ",(0,t.jsx)(n.code,{children:"maxUnavailable"})," without ",(0,t.jsx)(n.code,{children:"maxSurge"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      rollingUpdateType: Standard\n"})}),"\n",(0,t.jsx)(n.h3,{id:"selector-for-rolling-update",children:"Selector for rolling update"}),"\n",(0,t.jsx)(n.p,{children:"It helps users to update Pods on specific nodes whose labels could be matched with the selector."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      selector:\n        matchLabels:\n          nodeType: canary\n"})}),"\n",(0,t.jsx)(n.h3,{id:"partition-for-rolling-update-and-scaling-up",children:"Partition for rolling update and scaling up"}),"\n",(0,t.jsxs)(n.p,{children:["This strategy defines rules for calculating the priority of updating pods.\n",(0,t.jsx)(n.strong,{children:"Partition is the number of DaemonSet pods that should be remained to be old version."})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      partition: 10\n"})}),"\n",(0,t.jsxs)(n.p,{children:["And if you put ",(0,t.jsx)(n.code,{children:'daemonset.kruise.io/progressive-create-pod: "true"'})," annotation into Advanced DaemonSet,\nthe ",(0,t.jsx)(n.code,{children:"partition"})," will also control the number of pods to be created when scaling up."]}),"\n",(0,t.jsx)(n.h3,{id:"paused-for-rolling-update",children:"Paused for rolling update"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"paused"})," indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n"})}),"\n",(0,t.jsx)(n.h3,{id:"pre-download-image-for-update",children:"Pre-download image for update"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.3.0"]}),"\n",(0,t.jsxs)(n.p,{children:["If you have enabled the ",(0,t.jsx)(n.code,{children:"PreDownloadImageForDaemonSetUpdate"})," feature-gate during ",(0,t.jsx)(n.a,{href:"../installation#optional-feature-gate",children:"Kruise installation or upgrade"}),",\nDaemonSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.\nIt is quite useful to accelerate the progress of applications upgrade."]}),"\n",(0,t.jsxs)(n.p,{children:["The parallelism of each new image pre-downloading by DaemonSet is ",(0,t.jsx)(n.code,{children:"1"}),", which means the image is downloaded on nodes one by one.\nYou can change the parallelism using ",(0,t.jsx)(n.code,{children:"apps.kruise.io/image-predownload-parallelism"})," annotation on DaemonSet according to the capability of image registry,\nfor registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n'})}),"\n",(0,t.jsx)(n.h3,{id:"lifecycle-hook",children:"Lifecycle hook"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.1.0"]}),"\n",(0,t.jsxs)(n.p,{children:["This is similar to ",(0,t.jsx)(n.a,{href:"./cloneset#lifecycle-hook",children:"Lifecycle hook of CloneSet"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"Now Advanced DaemonSet only supports PreDelete hook,\nwhich means it allows users to do something (for example check node resources) before Pod deleting."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'type LifecycleStateType string\n\n// Lifecycle contains the hooks for Pod lifecycle.\ntype Lifecycle struct {\n    // PreDelete is the hook before Pod to be deleted.\n    PreDelete *LifecycleHook `json:"preDelete,omitempty"`\n}\n\ntype LifecycleHook struct {\n    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`\n    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`\n\n    /**********************  FEATURE STATE: 1.2.0 ************************/\n    // MarkPodNotReady = true means:\n    // - Pod will be set to \'NotReady\' at preparingDelete/preparingUpdate state.\n    // - Pod will be restored to \'Ready\' at Updated state if it was set to \'NotReady\' at preparingUpdate state.\n    // Default to false.\n    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`\n    /*********************************************************************/\n}\n'})}),"\n",(0,t.jsx)(n.p,{children:"Examples:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n\n  # define with label\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n'})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["When Advanced DaemonSet delete a Pod (including scale in and recreate update):","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Delete it directly if no lifecycle hook definition or Pod not matched preDelete hook"}),"\n",(0,t.jsxs)(n.li,{children:["Otherwise, Advanced DaemonSet will firstly update Pod to ",(0,t.jsx)(n.code,{children:"PreparingDelete"})," state and wait for user controller to remove the label/finalizer and Pod not matched preDelete hook"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    example.io/block-deleting: "true"                   # the pod is hooked by PreDelete hook label\n    lifecycle.apps.kruise.io/state: PreparingDelete     # so we update it to `PreparingDelete` state and wait for user controller to do something and remove the label\n'})}),"\n",(0,t.jsx)(n.h4,{id:"markpodnotready",children:"MarkPodNotReady"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.2.0"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"  lifecycle:\n    preDelete:\n      markPodNotReady: true\n      finalizersHandler:\n      - example.io/unready-blocker\n"})}),"\n",(0,t.jsxs)(n.p,{children:["If you set ",(0,t.jsx)(n.code,{children:"markPodNotReady=true"})," for ",(0,t.jsx)(n.code,{children:"preDelete"}),", Kruise will try to set ",(0,t.jsx)(n.code,{children:"KruisePodReady"})," condition to ",(0,t.jsx)(n.code,{children:"False"})," when Pods enter ",(0,t.jsx)(n.code,{children:"PreparingDelete"})," lifecycle state, and Pods will be ",(0,t.jsx)(n.strong,{children:"NotReady"}),", but containers still ",(0,t.jsx)(n.code,{children:"Running"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsxs)(n.strong,{children:["One can use this ",(0,t.jsx)(n.code,{children:"markPodNotReady"})," feature to drain service traffic before terminating containers."]})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsxs)(n.em,{children:["Note: this feature only works when pod has ",(0,t.jsx)(n.code,{children:"KruisePodReady"})," ReadinessGate."]})}),"\n",(0,t.jsx)(n.h4,{id:"example-for-user-controller-logic",children:"Example for user controller logic"}),"\n",(0,t.jsxs)(n.p,{children:["Same as yaml example above, we should firstly define ",(0,t.jsx)(n.code,{children:"example.io/block-deleting"})," label in template and lifecycle of Advanced DaemonSet."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  template:\n    metadata:\n      labels:\n        example.io/block-deleting: "true"\n  # ...\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n'})}),"\n",(0,t.jsx)(n.p,{children:"User controller logic:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["For Pod in ",(0,t.jsx)(n.code,{children:"PreparingDelete"}),", check if its Node existing, do something (for example reserve resources) and then remove the label."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},28453:(e,n,a)=>{a.d(n,{R:()=>r,x:()=>i});var o=a(96540);const t={},l=o.createContext(t);function r(e){const n=o.useContext(l);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),o.createElement(l.Provider,{value:n},e.children)}}}]);
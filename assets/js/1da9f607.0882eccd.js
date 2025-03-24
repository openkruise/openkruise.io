"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8073],{28453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>s});var i=t(96540);const o={},a=i.createContext(o);function r(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(a.Provider,{value:n},e.children)}},60575:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var i=t(97173),o=t(74848),a=t(28453);const r={slug:"openkruise-1.1",title:"OpenKruise v1.1, features enhanced, improve performance in large-scale clusters",authors:["FillZpp"],tags:["release"]},s=void 0,l={authorsImageUrls:[void 0]},c=[{value:"What&#39;s new?",id:"whats-new",level:2},{value:"1. Keep containers order for in-place update",id:"1-keep-containers-order-for-in-place-update",level:3},{value:"2. StatefulSetAutoDeletePVC",id:"2-statefulsetautodeletepvc",level:3},{value:"3. Advanced DaemonSet refactor, lifecycle hook",id:"3-advanced-daemonset-refactor-lifecycle-hook",level:3},{value:"4. Improve performance by disable DeepCopy",id:"4-improve-performance-by-disable-deepcopy",level:3},{value:"5. Other changes",id:"5-other-changes",level:3},{value:"Get Involved",id:"get-involved",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"We\u2019re pleased to announce the release of Kubernetes 1.1, which is a CNCF Sandbox level project."}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.a,{href:"https://openkruise.io",children:"OpenKruise"})," is an extended component suite for Kubernetes, which mainly focuses on application automations, such as deployment, upgrade, ops and availability protection. Mostly features provided by OpenKruise are built primarily based on CRD extensions. They can work in pure Kubernetes clusters without any other dependences."]}),"\n",(0,o.jsx)(n.h2,{id:"whats-new",children:"What's new?"}),"\n",(0,o.jsx)(n.p,{children:"In release v1.1, OpenKruise optimizes some existing features, and improves its performance in large-scale clusters.\nHere we are going to introduce some changes of it."}),"\n",(0,o.jsx)(n.p,{children:"Note that OpenKruise v1.1 bumps Kubernetes dependencies to v1.22, which means we can use new fields of up to K8s v1.22 in Pod template of workloads like CloneSet and Advanced StatefulSet.\nBut OpenKruise can still be used in Kubernetes cluster >= 1.16 version."}),"\n",(0,o.jsx)(n.h3,{id:"1-keep-containers-order-for-in-place-update",children:"1. Keep containers order for in-place update"}),"\n",(0,o.jsxs)(n.p,{children:["In the release v1.0 we published last year, OpenKruise has intruduced ",(0,o.jsx)(n.a,{href:"/docs/user-manuals/containerlaunchpriority/",children:"Container Launch Priority"}),",\nwhich supports to define different priorities for containers in a Pod and keeps their start order during Pod creation."]}),"\n",(0,o.jsx)(n.p,{children:"But in v1.0, it can only control the order in Pod creation. If you try to update the containers in-place, they will be updated at the same time."}),"\n",(0,o.jsx)(n.p,{children:"Recently, the community has discussed with some companies such as LinkedIn and get more input from the users.\nIn some scenarios, the containers in Pod may have special relationship, for example base-container should firstly update its configuration before app-container update,\nor we have to forbid multiple containers updating together to avoid log-container losing the logs of app-container."}),"\n",(0,o.jsx)(n.p,{children:"So, OpenKruise supports in-place update with container priorities since v1.1."}),"\n",(0,o.jsxs)(n.p,{children:["There is no extra options, just make sure containers have their launch priorities since Pod creation.\nIf you modify them ",(0,o.jsx)(n.strong,{children:"both in once in-place update"}),", Kruise will firstly update the containers with higher priority.\nThen Kruise will not update the containers with lower priority util the higher one has updated successfully."]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsxs)(n.strong,{children:["The in-place udpate here includes both modification of image and env from metadata, read the ",(0,o.jsx)(n.a,{href:"/docs/core-concepts/inplace-update",children:"concept doc"})," for more details"]})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"For pods without container launch priorities, no guarantees of the execution order during in-place update multiple containers."}),"\n",(0,o.jsxs)(n.li,{children:["For pods with container launch priorities:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"keep execution order during in-place update multiple containers with different priorities."}),"\n",(0,o.jsx)(n.li,{children:"no guarantees of the execution order during in-place update multiple containers with the same priority."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"For example, we have the CloneSet that includes two containers with different priorities:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  ...\nspec:\n  replicas: 1\n  template:\n    metadata:\n      annotations:\n        app-config: "... config v1 ..."\n    spec:\n      containers:\n      - name: sidecar\n        env:\n        - name: KRUISE_CONTAINER_PRIORITY\n          value: "10"\n        - name: APP_CONFIG\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.annotations[\'app-config\']\n      - name: main\n        image: main-image:v1\n  updateStrategy:\n    type: InPlaceIfPossible\n'})}),"\n",(0,o.jsxs)(n.p,{children:["When we update the CloneSet to change ",(0,o.jsx)(n.code,{children:"app-config"})," annotation and image of main container, which means both sidecar and main containers need to update,\nKruise will firstly in-place update pods that recreates sidecar container with the new env from annotation."]}),"\n",(0,o.jsxs)(n.p,{children:["At this moment, we can find the ",(0,o.jsx)(n.code,{children:"apps.kruise.io/inplace-update-state"})," annotation in updated Pod and see its value:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'{\n  "revision": "{CLONESET_NAME}-{HASH}",         // the target revision name of this in-place update\n  "updateTimestamp": "2022-03-22T09:06:55Z",    // the start time of this whole update\n  "nextContainerImages": {"main": "main-image:v2"},                // the next containers that should update images\n  // "nextContainerRefMetadata": {...},                            // the next containers that should update env from annotations/labels\n  "preCheckBeforeNext": {"containersRequiredReady": ["sidecar"]},  // the pre-check must be satisfied before the next containers can update\n  "containerBatchesRecord":[\n    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]}  // the first batch of containers that have updated (it just means the spec of containers has updated, such as images in pod.spec.container or annotaions/labels, but dosn\'t mean the real containers on node have been updated completely)\n  ]\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["When the sidecar container has been updated successfully, Kruise will update the next main container. Finally, you will find the ",(0,o.jsx)(n.code,{children:"apps.kruise.io/inplace-update-state"})," annotation looks like:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'{\n  "revision": "{CLONESET_NAME}-{HASH}",\n  "updateTimestamp": "2022-03-22T09:06:55Z",\n  "lastContainerStatuses":{"main":{"imageID":"THE IMAGE ID OF OLD MAIN CONTAINER"}},\n  "containerBatchesRecord":[\n    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]},\n    {"timestamp":"2022-03-22T09:07:20Z","containers":["main"]}\n  ]\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["Usually, users only have to care about the ",(0,o.jsx)(n.code,{children:"containerBatchesRecord"})," to make sure the containers are updated in different batches. If the Pod is blocking during in-place update, you should check the ",(0,o.jsx)(n.code,{children:"nextContainerImages/nextContainerRefMetadata"})," and see if the previous containers in ",(0,o.jsx)(n.code,{children:"preCheckBeforeNext"})," have been updated successfully and ready."]}),"\n",(0,o.jsx)(n.h3,{id:"2-statefulsetautodeletepvc",children:"2. StatefulSetAutoDeletePVC"}),"\n",(0,o.jsxs)(n.p,{children:["Since Kubernetes v1.23, the upstream StatefulSet has supported StatefulSetAutoDeletePVC feature, it ",(0,o.jsx)(n.strong,{children:"controls if and how PVCs are deleted during the lifecycle of a StatefulSet"}),", refer to ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention",children:"this doc"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["So, Advanced StatefulSet has rebased this feature from upstream, which also requires you to enable ",(0,o.jsx)(n.code,{children:"StatefulSetAutoDeletePVC"})," feature-gate during install/upgrade Kruise."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  ...\n  persistentVolumeClaimRetentionPolicy:  # optional\n    whenDeleted: Retain | Delete\n    whenScaled: Retain | Delete\n"})}),"\n",(0,o.jsx)(n.p,{children:"Once enabled, there are two policies you can configure for each StatefulSet:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"whenDeleted"}),": configures the volume retention behavior that applies when the StatefulSet is deleted."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"whenScaled"}),": configures the volume retention behavior that applies when the replica count of the StatefulSet is reduced; for example, when scaling down the set."]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["For each policy that you can configure, you can set the value to either ",(0,o.jsx)(n.code,{children:"Delete"})," or ",(0,o.jsx)(n.code,{children:"Retain"}),"."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Retain"})," (default): PVCs from the ",(0,o.jsx)(n.code,{children:"volumeClaimTemplate"})," are not affected when their Pod is deleted. This is the behavior before this new feature."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Delete"}),": The PVCs created from the ",(0,o.jsx)(n.code,{children:"volumeClaimTemplate"})," are deleted for each Pod affected by the policy. With the ",(0,o.jsx)(n.code,{children:"whenDeleted"})," policy all PVCs from the ",(0,o.jsx)(n.code,{children:"volumeClaimTemplate"})," are deleted after their Pods have been deleted. With the ",(0,o.jsx)(n.code,{children:"whenScaled"})," policy, only PVCs corresponding to Pod replicas being scaled down are deleted, after their Pods have been deleted."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Note that:"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:["StatefulSetAutoDeletePVC only deletes PVCs created by ",(0,o.jsx)(n.code,{children:"volumeClaimTemplate"})," instead of the PVCs created by user or related to StatefulSet Pod."]}),"\n",(0,o.jsx)(n.li,{children:"The policies only apply when Pods are being removed due to the StatefulSet being deleted or scaled down. For example, if a Pod associated with a StatefulSet fails due to node failure, and the control plane creates a replacement Pod, the StatefulSet retains the existing PVC. The existing volume is unaffected, and the cluster will attach it to the node where the new Pod is about to launch."}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"3-advanced-daemonset-refactor-lifecycle-hook",children:"3. Advanced DaemonSet refactor, lifecycle hook"}),"\n",(0,o.jsx)(n.p,{children:"The behavior of Advanced DaemonSet used to be a little different with the upstream controller,\nsuch as it required extra configuration to choose whether not-ready and unschedulable nodes should be handled,\nwhich makes users confused and hard to understand."}),"\n",(0,o.jsxs)(n.p,{children:["In release v1.1, we have refactored Advanced DaemonSet to make it rebase with upstream.\nNow, the default behavior of Advanced DaemonSet should be same with the upstream DaemonSet,\nwhich means users can conveniently modify the ",(0,o.jsx)(n.code,{children:"apiVersion"})," field to convert a built-in DaemonSet to Advanced DaemonSet."]}),"\n",(0,o.jsx)(n.p,{children:"Meanwhile, we also add lifecycle hook for Advanced DaemonSet.\nCurrently it supports preDelete hook, which allows users to do something (for example check node resources) before Pod deleting."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  ...\n  # define with label\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n'})}),"\n",(0,o.jsx)(n.p,{children:"When Advanced DaemonSet delete a Pod (including scale in and recreate update):"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Delete it directly if no lifecycle hook definition or Pod not matched preDelete hook"}),"\n",(0,o.jsxs)(n.li,{children:["Otherwise, Advanced DaemonSet will firstly update Pod to ",(0,o.jsx)(n.code,{children:"PreparingDelete"})," state and wait for user controller to remove the label/finalizer and Pod not matched preDelete hook"]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"4-improve-performance-by-disable-deepcopy",children:"4. Improve performance by disable DeepCopy"}),"\n",(0,o.jsxs)(n.p,{children:["By default, when we are writing Operator/Controller with controller-runtime and use the Client interface in ",(0,o.jsx)(n.code,{children:"sigs.k8s.io/controller-runtime/pkg/client"})," to get/list typed objects,\nit will always get objects from Informer. That's known by most people."]}),"\n",(0,o.jsx)(n.p,{children:"But what's many people don't know, is that controller-runtime will firstly deep copy all the objects got from Informer and then return the copied objects."}),"\n",(0,o.jsx)(n.p,{children:"This design aims to avoid developers directly modifying the objects in Informer.\nAfter DeepCopy, no matter how developers modify the objected returned by get/list, it will not change the objects in Informer, which are only synced by ListWatch from kube-apiserver."}),"\n",(0,o.jsx)(n.p,{children:"However, in some large-scale clusters, mutliple controllers of OpenKruise and their workers are reconciling together, which may bring so many DeepCopy operations.\nFor example, there are a lot of application CloneSets and some of them have managed thousands of Pods,\nthen each worker will list all Pod of the CloneSet during Reconcile and there exists multiple workers.\nIt brings CPU and Memory pressure to kruise-manager and even sometimes makes it Out-Of-Memory."}),"\n",(0,o.jsxs)(n.p,{children:["So I have submitted and merged ",(0,o.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/controller-runtime/pull/1274",children:"DisableDeepCopy feature"})," in upstream,\nwhich contains in controller-runtime >= v0.10 version.\nIt allows developers to specify some resource types that will directly return the objects from Informer without DeepCopy during get/list."]}),"\n",(0,o.jsxs)(n.p,{children:["For example, we can add cache options when initialize ",(0,o.jsx)(n.code,{children:"Manager"})," in ",(0,o.jsx)(n.code,{children:"main.go"})," to avoid DeepCopy for Pod objects."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"    mgr, err := ctrl.NewManager(cfg, ctrl.Options{\n\t\t...\n\t\tNewCache: cache.BuilderWithOptions(cache.Options{\n\t\t\tUnsafeDisableDeepCopyByObject: map[client.Object]bool{\n\t\t\t\t&v1.Pod{}: true,\n\t\t\t},\n\t\t}),\n\t})\n"})}),"\n",(0,o.jsxs)(n.p,{children:["But in Kruise v1.1, we re-implement ",(0,o.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/pkg/util/client/delegating_client.go",children:"Delegating Client"})," instead of using the feature of controller-runtime.\nIt allows developers to avoid DeepCopy with ",(0,o.jsx)(n.code,{children:"DisableDeepCopy ListOption"})," in any list places, which is more flexible."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'    if err := r.List(context.TODO(), &podList, client.InNamespace("default"), utilclient.DisableDeepCopy); err != nil {\n\t\treturn nil, nil, err\n\t}\n'})}),"\n",(0,o.jsx)(n.h3,{id:"5-other-changes",children:"5. Other changes"}),"\n",(0,o.jsxs)(n.p,{children:["For more changes, their authors and commits, you can read the ",(0,o.jsx)(n.a,{href:"https://github.com/openkruise/kruise/releases",children:"Github release"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"get-involved",children:"Get Involved"}),"\n",(0,o.jsxs)(n.p,{children:["Welcome to get involved with OpenKruise by joining us in Github/Slack/DingTalk/WeChat.\nHave something you\u2019d like to broadcast to our community?\nShare your voice at our ",(0,o.jsx)(n.a,{href:"https://shimo.im/docs/gXqmeQOYBehZ4vqo",children:"Bi-weekly community meeting (Chinese)"}),", or through the channels below:"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Join the community on ",(0,o.jsx)(n.a,{href:"https://kubernetes.slack.com/channels/openkruise",children:"Slack"})," (English)."]}),"\n",(0,o.jsxs)(n.li,{children:["Join the community on DingTalk: Search GroupID ",(0,o.jsx)(n.code,{children:"23330762"})," (Chinese)."]}),"\n",(0,o.jsxs)(n.li,{children:["Join the community on WeChat (new): Search User ",(0,o.jsx)(n.code,{children:"openkruise"})," and let the robot invite you (Chinese)."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},97173:e=>{e.exports=JSON.parse('{"permalink":"/blog/openkruise-1.1","editUrl":"https://github.com/openkruise/openkruise.io/edit/master/blog/2022-03-29-release-1.1.md","source":"@site/blog/2022-03-29-release-1.1.md","title":"OpenKruise v1.1, features enhanced, improve performance in large-scale clusters","description":"We\u2019re pleased to announce the release of Kubernetes 1.1, which is a CNCF Sandbox level project.","date":"2022-03-29T00:00:00.000Z","tags":[{"inline":true,"label":"release","permalink":"/blog/tags/release"}],"readingTime":7.9,"hasTruncateMarker":false,"authors":[{"name":"Siyu Wang","title":"Maintainer of OpenKruise","url":"https://github.com/FillZpp","imageURL":"https://github.com/FillZpp.png","key":"FillZpp","page":null}],"frontMatter":{"slug":"openkruise-1.1","title":"OpenKruise v1.1, features enhanced, improve performance in large-scale clusters","authors":["FillZpp"],"tags":["release"]},"unlisted":false,"prevItem":{"title":"OpenKruise v1.2, new PersistentPodState feature to achieve IP retention","permalink":"/blog/openkruise-1.2"},"nextItem":{"title":"OpenKruise v1.0, Reaching New Peaks of application automation","permalink":"/blog/openkruise-1.0"}}')}}]);
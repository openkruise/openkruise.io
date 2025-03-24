"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3564],{20675:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});const a=JSON.parse('{"id":"core-concepts/inplace-update","title":"InPlace Update","description":"In-place Update is one of the key features provided by OpenKruise.","source":"@site/docs/core-concepts/inplace-update.md","sourceDirName":"core-concepts","slug":"/core-concepts/inplace-update","permalink":"/docs/next/core-concepts/inplace-update","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/core-concepts/inplace-update.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"InPlace Update"},"sidebar":"docs","previous":{"title":"Architecture","permalink":"/docs/next/core-concepts/architecture"},"next":{"title":"CloneSet","permalink":"/docs/next/user-manuals/cloneset"}}');var i=t(74848),s=t(28453);const o={title:"InPlace Update"},l=void 0,r={},d=[{value:"What is in-place update?",id:"what-is-in-place-update",level:2},{value:"Understand <em>InPlaceIfPossible</em>",id:"understand-inplaceifpossible",level:2},{value:"Workflow overview",id:"workflow-overview",level:2},{value:"InPlace update with launch priorities",id:"inplace-update-with-launch-priorities",level:2},{value:"Requirements",id:"requirements",level:2}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"In-place Update is one of the key features provided by OpenKruise."}),"\n",(0,i.jsx)(n.p,{children:"Workloads that support in-place update:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/docs/user-manuals/cloneset",children:"CloneSet"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/docs/user-manuals/advancedstatefulset",children:"Advanced StatefulSet"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/docs/user-manuals/advanceddaemonset",children:"Advanced DaemonSet"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/docs/user-manuals/sidecarset",children:"SidecarSet"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Currently ",(0,i.jsx)(n.code,{children:"CloneSet"}),", ",(0,i.jsx)(n.code,{children:"Advanced StatefulSet"})," and ",(0,i.jsx)(n.code,{children:"Advanced DaemonSet"})," re-use the same code package ",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise/tree/master/pkg/util/inplaceupdate",children:(0,i.jsx)(n.code,{children:"./pkg/util/inplaceupdate"})})," and have similar behaviours of in-place update. In this article, we would like to introduce the usage and workflow of them."]}),"\n",(0,i.jsxs)(n.p,{children:["Note that the in-place update workflow of ",(0,i.jsx)(n.code,{children:"SidecarSet"})," is a little different from the other workloads, such as it will not set Pod to not-ready before update. So the things we talk below do not totally go for ",(0,i.jsx)(n.code,{children:"SidecarSet"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"what-is-in-place-update",children:"What is in-place update?"}),"\n",(0,i.jsxs)(n.p,{children:["Once we are going to update image in a existing Pod, look at the comparation between ",(0,i.jsx)(n.em,{children:"Recreate"})," and ",(0,i.jsx)(n.em,{children:"InPlace"})," Update:"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"alt",src:t(81509).A+"",width:"2080",height:"1754"})}),"\n",(0,i.jsxs)(n.p,{children:["In ",(0,i.jsx)(n.strong,{children:"ReCreate"})," way we have to delete the old Pod and create a new Pod:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Pod name and uid all changed, because they are totally different Pod objects (such as Deployment update)"}),"\n",(0,i.jsx)(n.li,{children:"Or Pod name may not change but uid changed, because they are still different Pod objects, although re-use the same name (such as StatefulSet update)"}),"\n",(0,i.jsx)(n.li,{children:"Node name of the Pod changed, because the new Pod is almost impossible to be scheduled to the previous node."}),"\n",(0,i.jsx)(n.li,{children:"Pod IP changed, because the new Pod is almost impossible to be allocated the previous IP."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["But for ",(0,i.jsx)(n.strong,{children:"InPlace"})," way we can re-use the Pod object but only modify the fields in it, so that:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Avoid additional cost of scheduling, allocating IP, allocating and mounting volumes"}),"\n",(0,i.jsx)(n.li,{children:"Faster image pulling, because of we can re-use most of image layers pulled by the old image and only to pull several new layers"}),"\n",(0,i.jsx)(n.li,{children:"When a container is in-place updating, the other containers in Pod will not be affected and remain running."}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"understand-inplaceifpossible",children:["Understand ",(0,i.jsx)(n.em,{children:"InPlaceIfPossible"})]}),"\n",(0,i.jsxs)(n.p,{children:["The update type in Kruise workloads is named ",(0,i.jsx)(n.code,{children:"InPlaceIfPossible"}),", which tells Kruise to update Pods in-place as possible, and it should go back to ReCreate Update if impossible."]}),"\n",(0,i.jsx)(n.p,{children:"What changes does it consider to be possible to in-place update?"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Update ",(0,i.jsx)(n.code,{children:"spec.template.metadata.*"})," in workloads, such as labels and annotations, Kruise will only update the metadata to existing Pods without recreate them."]}),"\n",(0,i.jsxs)(n.li,{children:["Update ",(0,i.jsx)(n.code,{children:"spec.template.spec.containers[x].image"})," in workloads, Kruise will in-place update the container image in Pods without recreate them."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Since Kruise v1.0 (including v1.0 alpha/beta)"}),", update ",(0,i.jsx)(n.code,{children:"spec.template.metadata.labels/annotations"})," and there exists container env from the changed labels/annotations, Kruise will in-place update them to renew the env value in containers."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Otherwise, the changes to other fields such as ",(0,i.jsx)(n.code,{children:"spec.template.spec.containers[x].env"})," or ",(0,i.jsx)(n.code,{children:"spec.template.spec.containers[x].resources"})," will go back to ReCreate Update."]}),"\n",(0,i.jsx)(n.p,{children:"Take the CloneSet YAML below as an example:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Modify ",(0,i.jsx)(n.code,{children:"app-image:v1"})," image, will trigger in-place update."]}),"\n",(0,i.jsxs)(n.li,{children:["Modify the value of ",(0,i.jsx)(n.code,{children:"app-config"})," in annotations, will trigger in-place update (Read the ",(0,i.jsx)(n.a,{href:"#requirements",children:"Requirements"})," below)."]}),"\n",(0,i.jsx)(n.li,{children:"Modify the two fields above together, will tigger in-place update both image and environment."}),"\n",(0,i.jsxs)(n.li,{children:["Directly modify the value of ",(0,i.jsx)(n.code,{children:"APP_NAME"})," in env or add a new env, will trigger recreate update."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  ...\nspec:\n  replicas: 1\n  template:\n    metadata:\n      annotations:\n        app-config: \"... the real env value ...\"\n    spec:\n      containers:\n      - name: app\n        image: app-image:v1\n        env:\n        - name: APP_CONFIG\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.annotations['app-config']\n        - name: APP_NAME\n          value: xxx\n  updateStrategy:\n    type: InPlaceIfPossible\n"})}),"\n",(0,i.jsx)(n.h2,{id:"workflow-overview",children:"Workflow overview"}),"\n",(0,i.jsxs)(n.p,{children:["You can see the whole workflow of in-place update below (",(0,i.jsx)(n.em,{children:"you may need to right click and open it in a new tab"}),"):"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"alt",src:t(25923).A+"",width:"3654",height:"1778"})}),"\n",(0,i.jsx)(n.h2,{id:"inplace-update-with-launch-priorities",children:"InPlace update with launch priorities"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.1.0"]}),"\n",(0,i.jsxs)(n.p,{children:["When you in-place update multiple containers at once and the containers have different ",(0,i.jsx)(n.a,{href:"/docs/user-manuals/containerlaunchpriority",children:"launch priorities"}),",\nKruise will update the containers by order according to the priorities."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"For pods without container launch priorities, no guarantees of the execution order during in-place update multiple containers."}),"\n",(0,i.jsxs)(n.li,{children:["For pods with container launch priorities:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"keep execution order during in-place update multiple containers with different priorities."}),"\n",(0,i.jsx)(n.li,{children:"no guarantees of the execution order during in-place update multiple containers with the same priority."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"For example, we have the CloneSet that includes two containers with different priorities:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  ...\nspec:\n  replicas: 1\n  template:\n    metadata:\n      annotations:\n        app-config: "... config v1 ..."\n    spec:\n      containers:\n      - name: sidecar\n        env:\n        - name: KRUISE_CONTAINER_PRIORITY\n          value: "10"\n        - name: APP_CONFIG\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.annotations[\'app-config\']\n      - name: main\n        image: main-image:v1\n  updateStrategy:\n    type: InPlaceIfPossible\n'})}),"\n",(0,i.jsxs)(n.p,{children:["When we update the CloneSet to change ",(0,i.jsx)(n.code,{children:"app-config"})," annotation and image of main container, which means both sidecar and main containers need to update,\nKruise will firstly in-place update pods that recreates sidecar container with the new env from annotation."]}),"\n",(0,i.jsxs)(n.p,{children:["At this moment, we can find the ",(0,i.jsx)(n.code,{children:"apps.kruise.io/inplace-update-state"})," annotation in updated Pod and see its value:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "revision": "{CLONESET_NAME}-{HASH}",         // the target revision name of this in-place update\n  "updateTimestamp": "2022-03-22T09:06:55Z",    // the start time of this whole update\n  "nextContainerImages": {"main": "main-image:v2"},                // the next containers that should update images\n  // "nextContainerRefMetadata": {...},                            // the next containers that should update env from annotations/labels\n  "preCheckBeforeNext": {"containersRequiredReady": ["sidecar"]},  // the pre-check must be satisfied before the next containers can update\n  "containerBatchesRecord":[\n    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]}  // the first batch of containers that have updated (it just means the spec of containers has updated, such as images in pod.spec.container or annotaions/labels, but dosn\'t mean the real containers on node have been updated completely)\n  ]\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["When the sidecar container has been updated successfully, Kruise will update the next main container. Finally, you will find the ",(0,i.jsx)(n.code,{children:"apps.kruise.io/inplace-update-state"})," annotation looks like:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "revision": "{CLONESET_NAME}-{HASH}",\n  "updateTimestamp": "2022-03-22T09:06:55Z",\n  "lastContainerStatuses":{"main":{"imageID":"THE IMAGE ID OF OLD MAIN CONTAINER"}},\n  "containerBatchesRecord":[\n    {"timestamp":"2022-03-22T09:06:55Z","containers":["sidecar"]},\n    {"timestamp":"2022-03-22T09:07:20Z","containers":["main"]}\n  ]\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Usually, users only have to care about the ",(0,i.jsx)(n.code,{children:"containerBatchesRecord"})," to make sure the containers are updated in different batches. If the Pod is blocking during in-place update, you should check the ",(0,i.jsx)(n.code,{children:"nextContainerImages/nextContainerRefMetadata"})," and see if the previous containers in ",(0,i.jsx)(n.code,{children:"preCheckBeforeNext"})," have been updated successfully and ready."]}),"\n",(0,i.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,i.jsxs)(n.p,{children:["To use InPlace Update for env from metadata, you have to enable ",(0,i.jsx)(n.code,{children:"kruise-daemon"})," (",(0,i.jsx)(n.em,{children:"defaults to be enabled"}),") and ",(0,i.jsx)(n.code,{children:"InPlaceUpdateEnvFromMetadata"})," feature-gate when install or upgrade Kruise chart."]}),"\n",(0,i.jsx)(n.p,{children:"Note that if you have some nodes of virtual-kubelet type, kruise-daemon may not work on them and in-place update for env from metadata will not be executed."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},25923:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/inplace-update-workflow-7b4d4bb7cfb4e72882f2a6bb76f422f1.png"},28453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>l});var a=t(96540);const i={},s=a.createContext(i);function o(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),a.createElement(s.Provider,{value:n},e.children)}},81509:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/inplace-update-comparation-fc948df195e332f578d4967c34b0c3d3.png"}}]);
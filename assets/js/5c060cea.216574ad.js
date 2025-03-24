"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8244],{4712:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>l,metadata:()=>o,toc:()=>a});const o=JSON.parse('{"id":"best-practices/cloneset-lifecycle","title":"CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle","description":"Due to various historical reasons or objective factors, the existing system architectures of some companies are not compatible with Kubernetes very well. For example, some companies use another service registration and discovery center, which is totally independent with Kubernetes, instead of  Kubernetes Service. Under this architecture, users will encounter many problems if they want to manage their infrastructure and  applications with Kubernetes.","source":"@site/versioned_docs/version-v1.6/best-practices/cloneset-lifecycle.md","sourceDirName":"best-practices","slug":"/best-practices/cloneset-lifecycle","permalink":"/docs/v1.6/best-practices/cloneset-lifecycle","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/cloneset-lifecycle.md","tags":[],"version":"v1.6","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle"},"sidebar":"docs","previous":{"title":"Best Practice for Managing Log Collection Sidecar Containers","permalink":"/docs/v1.6/best-practices/log-container-sidecarset"},"next":{"title":"Extreme Elastic Schedule Solution Based on HPA and WorkloadSpread","permalink":"/docs/v1.6/best-practices/elastic-deployment"}}');var r=n(74848),i=n(28453);const l={title:"CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle"},s=void 0,c={},a=[{value:"Scenario hypothesis",id:"scenario-hypothesis",level:3},{value:"Principle",id:"principle",level:3},{value:"CloneSet Lifecycle Configuration",id:"cloneset-lifecycle-configuration",level:3},{value:"Lifecycle Operator",id:"lifecycle-operator",level:3},{value:"Operator initialization",id:"operator-initialization",level:4},{value:"Controller Logic",id:"controller-logic",level:4},{value:"Operator \u90e8\u7f72",id:"operator-\u90e8\u7f72",level:4}];function d(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["Due to various historical reasons or objective factors, the existing system architectures of some companies are not compatible with Kubernetes very well. For example, some companies use another service registration and discovery center, which is totally independent with Kubernetes, instead of  ",(0,r.jsx)(t.a,{href:"https://kubernetes.io/docs/concepts/services-networking/service/",children:"Kubernetes Service"}),". Under this architecture, users will encounter many problems if they want to manage their infrastructure and  applications with Kubernetes."]}),"\n",(0,r.jsx)(t.p,{children:"For example, whenever Kubernetes successfully creates a Pod, users should register the Pod with the service discovery center so that it can provide services to the outside. Accordingly, when users want to offline a Pod, they usually need to delete it first in the service discovery center before they can gracefully offline the Pod, otherwise it may lead to some traffic routing problems."}),"\n",(0,r.jsx)(t.p,{children:"However, in Kubernetes, if replicas or template field of workloads was changed, the workload controller will immediately create/delete/update the pod. No time is provided for users to do customized operations. Hence, it is difficult for users to manage the life cycle of the pods in this scenarios."}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{alt:"why",src:n(99391).A+"",width:"1974",height:"1172"})}),"\n",(0,r.jsx)(t.p,{children:"Openkruise  CloneSet Lifecycle feature provides such a set of highly-expandable mechanism which allows users do refined and customized management to pod life cycle.\nSpecifically, CloneSet provide some hooks at several important time spots in the Pod life cycle, so that users can insert their customized actions via these hooks. For example, CloneSet allow users to unregister a pod with the service discovery center before the pod upgrade, and then register the pod after the pod upgrade complete."}),"\n",(0,r.jsx)(t.p,{children:"In the following, we will explain this feature in a specific scenario to help you further understand it."}),"\n",(0,r.jsx)(t.h3,{id:"scenario-hypothesis",children:"Scenario hypothesis"}),"\n",(0,r.jsx)(t.p,{children:"We assume the following scenario:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Users do not use Kubernetes Service, and their service discovery system is totally independent of Kubernetes;"}),"\n",(0,r.jsx)(t.li,{children:"Users use CloneSet as the Kubernetes workload to manage their applications."}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"And we make the following reasonable assumptions about the needs of users:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["When the Pod is created\uff1a","\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Register the Pod IP with service discovery center when the pod is available\uff1b"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["When the Pod is upgraded \uff1a","\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Before the upgrade, Unregister the Pod IP from the service discovery center\uff1b"}),"\n",(0,r.jsx)(t.li,{children:"After the upgrade, Register the Pod IP with service discovery center when the pod is available\uff1b"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["When the Pod is deleted\uff1a","\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Before the deletion, Unregister the Pod IP from the service discovery center\uff1b"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Based on the above assumptions, we will describe in detail how to use CloneSet Lifecycle to write a simple operator to implement the user-defined pod life cycle management."}),"\n",(0,r.jsx)(t.h3,{id:"principle",children:"Principle"}),"\n",(0,r.jsx)(t.p,{children:"CloneSet Lifecycle defines the pod life cycle via the following 5 states:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Normal: normal state;"}),"\n",(0,r.jsx)(t.li,{children:"PreparingUpdate: The CloneSet is preparing to update the pod. The pod upgrade will be blocked, so as to wait for users to execute hook and complete some preprocessing operations before upgrading;"}),"\n",(0,r.jsx)(t.li,{children:"Updating: the pod is being upgraded in inPlace way;"}),"\n",(0,r.jsx)(t.li,{children:"Updated: the pod upgrade is completed."}),"\n",(0,r.jsx)(t.li,{children:"PreparingDelete: the CloneSet is preparing to delete the pod. The pod deletion will be blocked, so as to wait for users to execute hook and do some preprocessing operations before deletion;"}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["The transition logic among the above five states is controlled by a state machine, which is explained in detail in [CloneSet official document] (",(0,r.jsx)(t.a,{href:"https://openkruise.io/docs/user-manuals/cloneset/#lifecycle-hook",children:"https://openkruise.io/docs/user-manuals/cloneset/#lifecycle-hook"}),"). Users can select one or more of their concerns, implement an independent operator to manage the pod life cycle states, control the life cycle of pod, and insert customized logic at the time spots they are concerned about."]}),"\n",(0,r.jsx)(t.h3,{id:"cloneset-lifecycle-configuration",children:"CloneSet Lifecycle Configuration"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  namespace: demo\n  name: cloneset-lifecycle-demo\nspec:\n  replicas: 2\n  ##########################################################################\n  ## Lifecycle configuration\n  lifecycle:\n    inPlaceUpdate:\n      labelsHandler:\n        ## define the label that:\n        ##    1. block inPlace update pod operation for cloneset controller\n        ##    2. inform your operator to execute inPlace update hook\n        example.com/unready-blocker-inplace: "true"\n    preDelete:\n      labelsHandler:\n        ## define the label that:\n        ##    1. block deletion pod operation for cloneset controller\n        ##    2. inform your operator to execute preDelete hook\n        example.com/unready-blocker-delete: "true"\n  ##########################################################################\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n        ## this label is useful to judge whether this pod is newly-created.\n        example.com/newly-create: "true"\n        ## corresponding to the spec.lifecycle.inPlaceUpdate.labelsHandler.example.com/unready-blocker-inplace\n        example.com/unready-blocker-inplace: "true"\n        ## corresponding to the spec.lifecycle.preDelete.labelsHandler.example.com/unready-blocker-inplace\n        example.com/unready-blocker-delete: "true"\n    spec:\n      containers:\n        - name: main\n          image: nginx:latest\n          imagePullPolicy: Always\n  updateStrategy:\n    maxUnavailable: 20%\n    type: InPlaceIfPossible\n'})}),"\n",(0,r.jsx)(t.h3,{id:"lifecycle-operator",children:"Lifecycle Operator"}),"\n",(0,r.jsxs)(t.p,{children:["In the OpenKruise repository, we give a complete ",(0,r.jsx)(t.a,{href:"https://github.com/openkruise/samples/tree/master/lifecycle-hook-controller",children:"CloneSet Lifecycle Operator code example"}),".\nTherefore,  we will not repeat some code details in this article, but focus on explaining some key logic of the operation under the hypothetical scenario.\nIf you need to refer to the complete code, you can go directly to see this repository."]}),"\n",(0,r.jsx)(t.h4,{id:"operator-initialization",children:"Operator initialization"}),"\n",(0,r.jsxs)(t.p,{children:["It is recommended to use Kubebuilder to build the operator. Please refer to ",(0,r.jsx)(t.a,{href:"https://book.kubebuilder.io/quick-start.html#create-a-project",children:"Kubebuilder official document"})," for the specific steps."]}),"\n",(0,r.jsx)(t.p,{children:"The directory structure of an initialized operator is similar to the following:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-shell",children:"$ tree\n.\n\u251c\u2500\u2500 Dockerfile\n\u251c\u2500\u2500 LICENSE\n\u251c\u2500\u2500 Makefile\n\u251c\u2500\u2500 PROJECT\n\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 config\n\u2502   \u2514\u2500\u2500 ....\n\u251c\u2500\u2500 controllers\n\u2502\xa0\xa0 \u2514\u2500\u2500 lifecyclehook\n\u2502\xa0\xa0     \u2514\u2500\u2500 lifecyclehook_controller.go\n\u251c\u2500\u2500 go.mod\n\u251c\u2500\u2500 go.sum\n\u251c\u2500\u2500 hack\n\u2502\xa0\xa0 \u2514\u2500\u2500 ....\n\u2514\u2500\u2500 main.go\n"})}),"\n",(0,r.jsx)(t.h4,{id:"controller-logic",children:"Controller Logic"}),"\n",(0,r.jsxs)(t.p,{children:["Lifecycle Hook is implemented in ",(0,r.jsx)(t.code,{children:" Reconcile(req ctrl.Request) (ctrl.Result, error)"})," function in ",(0,r.jsx)(t.code,{children:"lifecyclehook_controller.go"})," file.\nIn our hypothetical scenarios, we implemented the pod life cycle management logic through the following codes:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-go",children:'const (\n\tdeleteHookLabel  = "example.com/unready-blocker-delete"\n\tinPlaceHookLabel = "example.com/unready-blocker-inplace"\n\tnewlyCreateLabel = "example.com/newly-create"\n)\n\nfunc (r *SampleReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {\n  \n\t... ...\n\n\tswitchLabel := func(pod *v1.Pod, key, value string) error {\n\t\tbody := fmt.Sprintf(`{"metadata":{"labels":{"%s":"%s"}}}`, key, value)\n\t\tif err := r.Patch(context.TODO(), pod, client.RawPatch(types.StrategicMergePatchType, []byte(body))); err != nil {\n\t\t\treturn err\n\t\t}\n\t\treturn nil\n\t}\n\n\n\t/*\n\t\tPod Lifecycle Hook Logic\n\t*/\n\tswitch {\n\t// handle newly-created pod\n\tcase IsNewlyCreateHooked(pod):\n\t\t// register this pod to your service discovery center\n\t\tif err := postRegistry(pod); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\tif err := switchLabel(pod, newlyCreateLabel, "false"); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\t\n\t// handle the pod which is preparing to inplace update\n\tcase IsPreUpdateHooked(pod):\n\t\t// let the service discover center fail over this pod \n\t\tif err := postFailOver(pod); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\tif err := switchLabel(pod, inPlaceHookLabel, "false"); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\t\n\t// handle the pod which is updated completely \n\tcase IsUpdatedHooked(pod):\n\t\t// register this pod again to your service discovery center\t\n\t\tif err := postRegistry(pod); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\tif err := switchLabel(pod, inPlaceHookLabel, "true"); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\n\t// handle the pod which is preparing to delete\t\n\tcase IsPreDeleteHooked(pod):\n\t\t// just unregister this pod from your service discovery center\n\t\tif err := postUnregister(pod); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t\tif err := switchLabel(pod, deleteHookLabel, "false"); err != nil {\n\t\t\treturn reconcile.Result{}, err\n\t\t}\n\t}\n\n\treturn ctrl.Result{}, nil\n}\n\nfunc IsNewlyCreateHooked(pod *v1.Pod) bool {\n\treturn kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStateNormal && pod.Labels[newlyCreateLabel] == "true" && IsPodReady(pod)\n}\n\nfunc IsPreUpdateHooked(pod *v1.Pod) bool {\n\treturn kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStatePreparingUpdate && pod.Labels[inPlaceHookLabel] == "true"\n}\n\nfunc IsUpdatedHooked(pod *v1.Pod) bool {\n\treturn kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStateUpdated && pod.Labels[inPlaceHookLabel] == "false" && IsPodReady(pod)\n}\n\nfunc IsPreDeleteHooked(pod *v1.Pod) bool {\n\treturn kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStatePreparingDelete && pod.Labels[DeleteHookLabel] == "true"\n}\n'})}),"\n",(0,r.jsxs)(t.p,{children:["The four ",(0,r.jsx)(t.code,{children:"switch-cases"})," correspond to the four key time spots: after creation, pre-update, updated and pre-delete. Users can implement the corresponding hook according to their needs. In our hypothetical scenario, the implementation of the above hooks are as follows:"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"postRegistry(pod *v1.Pod)"})," : send a http/https request to the service discovery center to register the Pod;"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"postFailOver(pod *v1.Pod)"})," : send a http/https request to the service discovery center to fail over the Pod;"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"postUnregiste(pod *v1.Pod)"}),": send a http/https request to the service discovery center to unregister the Pod;"]}),"\n"]}),"\n",(0,r.jsx)(t.h4,{id:"operator-\u90e8\u7f72",children:"Operator \u90e8\u7f72"}),"\n",(0,r.jsx)(t.p,{children:"When the code of the operator is perfect, the operator needs to be built and deployed to the target cluster. You can refer to the Kubebuilder official document to do that."}),"\n",(0,r.jsx)(t.p,{children:"After the deployment of the operator is completed, the operator will continuously watch the state of pods in the cluster and automatically execute the above hook at the key time spot of pod life cycle, to bridge the gap between Kubernetes and the service discovery center."})]})}function p(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>s});var o=n(96540);const r={},i=o.createContext(r);function l(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),o.createElement(i.Provider,{value:t},e.children)}},99391:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/cloneset_lifecycle-480f3577668bfc0bd7724851982df69c.png"}}]);
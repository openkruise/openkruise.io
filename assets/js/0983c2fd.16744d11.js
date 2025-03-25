"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3008],{1130:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>l,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"user-manuals/uniteddeployment","title":"UnitedDeployment","description":"This controller provides a new way to manage pods in multi-domain by using multiple workloads.","source":"@site/docs/user-manuals/uniteddeployment.md","sourceDirName":"user-manuals","slug":"/user-manuals/uniteddeployment","permalink":"/docs/next/user-manuals/uniteddeployment","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/uniteddeployment.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"UnitedDeployment"},"sidebar":"docs","previous":{"title":"WorkloadSpread","permalink":"/docs/next/user-manuals/workloadspread"},"next":{"title":"Container Restart","permalink":"/docs/next/user-manuals/containerrecreaterequest"}}');var o=t(74848),a=t(28453);const i={title:"UnitedDeployment"},l=void 0,r={},d=[{value:"Capacity Planning For Subsets (MaxReplicas)",id:"capacity-planning-for-subsets-maxreplicas",level:2},{value:"Customize pod configuration of subset",id:"customize-pod-configuration-of-subset",level:2},{value:"HPA UnitedDeployment",id:"hpa-uniteddeployment",level:2},{value:"Pod Distribution Management",id:"pod-distribution-management",level:2},{value:"Pod Update Management",id:"pod-update-management",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:["This controller provides a new way to manage pods in multi-domain by using multiple workloads.\nA high level description about this workload can be found in this ",(0,o.jsx)(n.a,{href:"/blog/uniteddeployment",children:"blog post"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["Different domains in one Kubernetes cluster are represented by multiple groups of\nnodes identified by labels. UnitedDeployment controller provisions one type of workload\nfor each group of with corresponding matching ",(0,o.jsx)(n.code,{children:"NodeSelector"}),", so that\nthe pods created by individual workload will be scheduled to the target domain."]}),"\n",(0,o.jsxs)(n.p,{children:["Each workload managed by UnitedDeployment is called a ",(0,o.jsx)(n.code,{children:"subset"}),".\nEach domain should at least provide the capacity to run the ",(0,o.jsx)(n.code,{children:"replicas"})," number of pods.\nCurrently ",(0,o.jsx)(n.code,{children:"StatefulSet"}),", ",(0,o.jsx)(n.code,{children:"Advanced StatefulSet"}),", ",(0,o.jsx)(n.code,{children:"CloneSet"})," and ",(0,o.jsx)(n.code,{children:"Deployment"})," are the supported workloads."]}),"\n",(0,o.jsxs)(n.p,{children:["API definition: ",(0,o.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go"})]}),"\n",(0,o.jsx)(n.p,{children:"The below sample yaml presents a UnitedDeployment which manages three StatefulSet instances in three domains.\nThe total number of managed pods is 6."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 6\n  revisionHistoryLimit: 10\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    statefulSetTemplate:\n      metadata:\n        labels:\n          app: sample\n      spec:\n        selector:\n          matchLabels:\n            app: sample\n        template:\n          metadata:\n            labels:\n              app: sample\n          spec:\n            containers:\n            - image: nginx:alpine\n              name: nginx\n  topology:\n    subsets:\n    - name: subset-a\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-a\n      replicas: 1\n    - name: subset-b\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-b\n      replicas: 50%\n    - name: subset-c\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-c\n  updateStrategy:\n    manualUpdate:\n      partitions:\n        subset-a: 0\n        subset-b: 0\n        subset-c: 0\n    type: Manual\n...\n"})}),"\n",(0,o.jsx)(n.h2,{id:"capacity-planning-for-subsets-maxreplicas",children:"Capacity Planning For Subsets (MaxReplicas)"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.1"]}),"\n",(0,o.jsxs)(n.p,{children:["UnitedDeployment offer the option to define the ",(0,o.jsx)(n.code,{children:"MaxReplicas"})," for each subset, allowing you to effectively manage your resource allocation.\nFor example, assuming there is an application that typically runs with a maximum of 4 replicas on regular nodes. However, if the number of replicas exceeds 4, the exceeded Pods will automatically scale them to elastic nodes."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 5\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    cloneSetTemplate:\n      ......\n  topology:\n    subsets:\n    - name: normal-nodes\n      maxReplicas: 4\n      ......\n    - name: elastic-nodes\n      maxReplicas: null\n      ......\n"})}),"\n",(0,o.jsxs)(n.p,{children:["The UnitedDeployment controller follows the following rules for scaling each subset if you set ",(0,o.jsx)(n.code,{children:"MaxReplicas"}),":"]}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"When scaling up, the UnitedDeployment controller considers the order specified in the subsets list;"}),"\n",(0,o.jsx)(n.li,{children:"When scaling down, it obeys the reverse order of scaling up."}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["Please ",(0,o.jsx)(n.strong,{children:"Note"})," the following:"]}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:["You can ",(0,o.jsx)(n.strong,{children:"NOT"})," set both ",(0,o.jsx)(n.code,{children:"MaxReplicas"})," and ",(0,o.jsx)(n.code,{children:"Replicas"})," for any subset simultaneously."]}),"\n",(0,o.jsxs)(n.li,{children:["If ",(0,o.jsx)(n.code,{children:"MaxReplicas"})," is left empty (null), there are no limitations imposed on the number of replicas for that particular subset."]}),"\n",(0,o.jsxs)(n.li,{children:["To prevent situations where all ",(0,o.jsx)(n.code,{children:"MaxReplicas"})," requirements are met and no subsets can be scaled up, it is crucial to have ",(0,o.jsx)(n.strong,{children:"at least one"})," subset with an empty(null) ",(0,o.jsx)(n.code,{children:"MaxReplicas"})," value."]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"customize-pod-configuration-of-subset",children:"Customize pod configuration of subset"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,o.jsx)(n.p,{children:"Since v1.5.0, one can customize pod spec field other than nodeSelectorTerm and tolerations, e.g. env, resources."}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note:"})," it is not recommended to customize subset image since it may cause chaos into update function."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 6\n  revisionHistoryLimit: 10\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    statefulSetTemplate:\n      ...\n  topology:\n    subsets:\n    - name: subset-a\n      ...\n      # patch container resources, env:\n      patch:\n        spec:\n          containers:\n          - name: main\n            resources:\n              limits:\n                cpu: "2"\n                memory: 800Mi\n            env:\n            - name: subset\n              value: subset-a\n    - name: subset-b\n      ...\n      # patch container resources, env:\n      patch:\n        spec:\n          containers:\n          - name: main\n            resources:\n              limits:\n                cpu: "2"\n                memory: 800Mi\n            env:\n            - name: subset\n              value: subset-b\n'})}),"\n",(0,o.jsx)(n.h2,{id:"hpa-uniteddeployment",children:"HPA UnitedDeployment"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,o.jsxs)(n.p,{children:["Horizontal Pod Autoscaler can support Custom Resource workload which has ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource",children:"scale subresource"}),".\nSince v1.5.0 you can HPA UnitedDeployment directly, as follows:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: autoscaling/v2beta1\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: example-hpa\n  namespace: default\nspec:\n  minReplicas: 1\n  maxReplicas: 3\n  metrics:\n  - resource:\n      name: cpu\n      targetAverageUtilization: 2\n    type: Resource\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: UnitedDeployment\n    name: sample-ud\n"})}),"\n",(0,o.jsx)(n.h2,{id:"pod-distribution-management",children:"Pod Distribution Management"}),"\n",(0,o.jsxs)(n.p,{children:["This controller provides ",(0,o.jsx)(n.code,{children:"spec.topology"})," to describe the pod distribution specification."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'// Topology defines the spread detail of each subset under UnitedDeployment.\n// A UnitedDeployment manages multiple homogeneous workloads which are called subset.\n// Each of subsets under the UnitedDeployment is described in Topology.\ntype Topology struct {\n    // Contains the details of each subset. Each element in this array represents one subset\n    // which will be provisioned and managed by UnitedDeployment.\n    // +optional\n    Subsets []Subset `json:"subsets,omitempty"`\n}\n\n// Subset defines the detail of a subset.\ntype Subset struct {\n    // Indicates subset name as a DNS_LABEL, which will be used to generate\n    // subset workload name prefix in the format \'<deployment-name>-<subset-name>-\'.\n    // Name should be unique between all of the subsets under one UnitedDeployment.\n    Name string `json:"name"`\n\n    // Indicates the node selector to form the subset. Depending on the node selector,\n    // pods provisioned could be distributed across multiple groups of nodes.\n    // A subset\'s nodeSelectorTerm is not allowed to be updated.\n    // +optional\n    NodeSelectorTerm corev1.NodeSelectorTerm `json:"nodeSelectorTerm,omitempty"`\n\n    // Indicates the tolerations the pods under this subset have.\n    // A subset\'s tolerations is not allowed to be updated.\n    // +optional\n    Tolerations []corev1.Toleration `json:"tolerations,omitempty"`\n\n    // Indicates the number of the pod to be created under this subset. Replicas could also be\n    // percentage like \'10%\', which means 10% of UnitedDeployment replicas of pods will be distributed\n    // under this subset. If nil, the number of replicas in this subset is determined by controller.\n    // Controller will try to keep all the subsets with nil replicas have average pods.\n    // +optional\n    Replicas *intstr.IntOrString `json:"replicas,omitempty"`\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"topology.subsets"})," specifies the desired group of ",(0,o.jsx)(n.code,{children:"subset"}),"s.\nA subset added to or removed from this array will be created or deleted by controller during reconcile.\nEach subset workload is created based on the description of UnitedDeployment ",(0,o.jsx)(n.code,{children:"spec.template"}),".\n",(0,o.jsx)(n.code,{children:"subset"})," provides the necessary topology information to create a subset workload.\nEach subset has a unique name.  A subset workload is created with the name prefix in\nformat of ",(0,o.jsx)(n.code,{children:"<UnitedDeployment-name>-<Subset-name>-"}),". Each subset will also be configured with\nthe ",(0,o.jsx)(n.code,{children:"nodeSelector"}),".\nWhen provisioning a StatefulSet ",(0,o.jsx)(n.code,{children:"subset"}),", the ",(0,o.jsx)(n.code,{children:"nodeSelector"})," will be added\nto the StatefulSet's ",(0,o.jsx)(n.code,{children:"podTemplate"}),", so that the Pods of the StatefulSet will be created with the\nexpected node affinity."]}),"\n",(0,o.jsx)(n.p,{children:"By default, UnitedDeployment's Pods are evenly distributed across all subsets.\nThere are two scenarios the controller does not follow this policy:"}),"\n",(0,o.jsxs)(n.p,{children:["The first one is to customize the distribution policy by indicating ",(0,o.jsx)(n.code,{children:"subset.replicas"}),".\nA valid ",(0,o.jsx)(n.code,{children:"subset.replicas"})," could be integer to represent a ",(0,o.jsx)(n.strong,{children:"real replicas of pods"})," or\n",(0,o.jsx)(n.strong,{children:"string in format of percentage"})," like '40%' to represent a fixed proportion of pods.\nOnce a ",(0,o.jsx)(n.code,{children:"subset.replicas"})," is given, the controller is going to reconcile to make sure\neach subset has the expected replicas.\nThe subsets with empty ",(0,o.jsx)(n.code,{children:"subset.replicas"})," will divide the remaining replicas evenly."]}),"\n",(0,o.jsxs)(n.p,{children:["The other scenario is that the indicated subset replicas policy becomes invalid.\nFor example, the UnitedDeployment's ",(0,o.jsx)(n.code,{children:"spec.replicas"})," is decremented to be less\nthan the sum of all ",(0,o.jsx)(n.code,{children:"subset.replicas"}),".\nIn this case, the indicated ",(0,o.jsx)(n.code,{children:"subset.replicas"})," is ineffective and the controller\nwill automatically scale each subset's replicas to match the total replicas number.\nThe controller will try its best to apply this adjustment smoothly."]}),"\n",(0,o.jsx)(n.h2,{id:"pod-update-management",children:"Pod Update Management"}),"\n",(0,o.jsxs)(n.p,{children:["When ",(0,o.jsx)(n.code,{children:"spec.template"})," is updated, a upgrade progress will be triggered.\nNew template will be patch to each subset workload, which triggers subset controller\nto update their pods.\nFurthermore, if subset workload supports ",(0,o.jsx)(n.code,{children:"partition"}),", like StatefulSet, AdvancedStatefulSet\nis also able to provide ",(0,o.jsx)(n.code,{children:"Manual"})," update strategy."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'// UnitedDeploymentUpdateStrategy defines the update performance\n// when template of UnitedDeployment is changed.\ntype UnitedDeploymentUpdateStrategy struct {\n    // Type of UnitedDeployment update strategy.\n    // Default is Manual.\n    // +optional\n    Type UpdateStrategyType `json:"type,omitempty"`\n    // Includes all of the parameters a Manual update strategy needs.\n    // +optional\n    ManualUpdate *ManualUpdate `json:"manualUpdate,omitempty"`\n}\n\n// ManualUpdate is a update strategy which allows users to control the update progress\n// by providing the partition of each subset.\ntype ManualUpdate struct {\n    // Indicates number of subset partition.\n    // +optional\n    Partitions map[string]int32 `json:"partitions,omitempty"`\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Manual"})," update strategy allows users to control the update progress by indicating\nthe ",(0,o.jsx)(n.code,{children:"partition"})," of each subset. The controller will pass the ",(0,o.jsx)(n.code,{children:"partition"})," to each subset."]})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>l});var s=t(96540);const o={},a=s.createContext(o);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);
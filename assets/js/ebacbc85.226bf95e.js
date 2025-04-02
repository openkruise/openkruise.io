"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6710],{28453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>l});var o=s(96540);const r={},i=o.createContext(r);function a(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(i.Provider,{value:n},e.children)}},58019:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>a,metadata:()=>o,toc:()=>t});const o=JSON.parse('{"id":"user-manuals/workloadspread","title":"WorkloadSpread","description":"FEATURE STATE: Kruise v0.10.0","source":"@site/versioned_docs/version-v1.8/user-manuals/workloadspread.md","sourceDirName":"user-manuals","slug":"/user-manuals/workloadspread","permalink":"/docs/user-manuals/workloadspread","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/workloadspread.md","tags":[],"version":"v1.8","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"WorkloadSpread"},"sidebar":"docs","previous":{"title":"Container Launch Priority","permalink":"/docs/user-manuals/containerlaunchpriority"},"next":{"title":"UnitedDeployment","permalink":"/docs/user-manuals/uniteddeployment"}}');var r=s(74848),i=s(28453);const a={title:"WorkloadSpread"},l=void 0,d={},t=[{value:"Demo",id:"demo",level:2},{value:"subsets",id:"subsets",level:2},{value:"sub-fields",id:"sub-fields",level:3},{value:"Schedule strategy",id:"schedule-strategy",level:2},{value:"Requirements",id:"requirements",level:2},{value:"Pod Webhook",id:"pod-webhook",level:3},{value:"deletion-cost feature",id:"deletion-cost-feature",level:3},{value:"Scale order:",id:"scale-order",level:2},{value:"Scale out",id:"scale-out",level:3},{value:"Scale in",id:"scale-in",level:3},{value:"Use WorkloadSpread with customized workload",id:"use-workloadspread-with-customized-workload",level:2},{value:"Configure the custom workload watch whitelist",id:"configure-the-custom-workload-watch-whitelist",level:3},{value:"Authorize kruise-manager",id:"authorize-kruise-manager",level:3},{value:"Reference the custom workload in WorkloadSpread",id:"reference-the-custom-workload-in-workloadspread",level:3},{value:"Support for AI Workloads",id:"support-for-ai-workloads",level:3},{value:"Typical Scenario Example",id:"typical-scenario-example",level:4},{value:"Configuration Steps",id:"configuration-steps",level:4},{value:"Key Parameter Descriptions",id:"key-parameter-descriptions",level:4},{value:"Expected Behavior",id:"expected-behavior",level:4},{value:"feature-gates",id:"feature-gates",level:2},{value:"Example",id:"example",level:2},{value:"Elastic deployment",id:"elastic-deployment",level:3},{value:"Effect",id:"effect",level:4},{value:"Multi-domain deployment",id:"multi-domain-deployment",level:3}];function c(e){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,r.jsx)(n.p,{children:"WorkloadSpread can distribute Pods of workload to different types of Node according to some polices, which empowers\nsingle workload the abilities for\nmulti-domain deployment and elastic deployment."}),"\n",(0,r.jsx)(n.p,{children:"Some common policies include:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"fault toleration spread (for example, spread evenly among hosts, az, etc)"}),"\n",(0,r.jsx)(n.li,{children:"spread according to the specified ratio (for example, deploy Pod to several specified az according to the proportion)"}),"\n",(0,r.jsxs)(n.li,{children:["subset management with priority, such as","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"deploy Pods to ecs first, and then deploy to eci when its resources are insufficient."}),"\n",(0,r.jsx)(n.li,{children:"deploy a fixed number of Pods to ecs first, and the rest Pods are deployed to eci."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["subset management with customization, such as","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"control how many pods in a workload are deployed in different cpu arch"}),"\n",(0,r.jsx)(n.li,{children:"enable pods in different cpu arch to have different resource requirements"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["The feature of WorkloadSpread is similar with ",(0,r.jsx)(n.strong,{children:"UnitedDeployment"})," in OpenKruise community. Each WorkloadSpread defines\nmulti-domain\ncalled ",(0,r.jsx)(n.code,{children:"subset"}),". Each domain may provide the limit to run the replicas number of pods called ",(0,r.jsx)(n.code,{children:"maxReplicas"}),".\nWorkloadSpread injects the domain configuration into the Pod by Webhook, and it also controls the order of scale in and\nscale out."]}),"\n",(0,r.jsxs)(n.p,{children:["Kruise with version lower than ",(0,r.jsx)(n.code,{children:"1.3.0"})," supports ",(0,r.jsx)(n.code,{children:"CloneSet"}),", ",(0,r.jsx)(n.code,{children:"Deployment"}),", ",(0,r.jsx)(n.code,{children:"ReplicaSet"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Since Kruise ",(0,r.jsx)(n.code,{children:"1.3.0"}),", WorkloadSpread supports ",(0,r.jsx)(n.code,{children:"StatefulSet"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["In particular, for ",(0,r.jsx)(n.code,{children:"StatefulSet"}),", WorkloadSpread supports manage its subsets only when ",(0,r.jsx)(n.code,{children:"scale up"}),". The order of\n",(0,r.jsx)(n.code,{children:"scale down"})," is still controlled by StatefulSet controller. The subset management of StatefulSet is based on ordinals of\nPods, and more details can be\nfound ",(0,r.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/f46097db1fa5a4ed9c002eba050b888344884e11/pkg/util/workloadspread/workloadspread.go#L305",children:"here"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Since Kruise ",(0,r.jsx)(n.code,{children:"1.5.0"}),", WorkloadSpread supports ",(0,r.jsx)(n.code,{children:"customized workloads"})," that\nhave ",(0,r.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource",children:"scale sub-resource"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"demo",children:"Demo"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-demo\nspec:\n  targetRef:\n    apiVersion: apps/v1 | apps.kruise.io/v1alpha1\n    kind: Deployment | CloneSet\n    name: workload-xxx\n  subsets:\n    - name: subset-a\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-a\n      preferredNodeSelectorTerms:\n        - weight: 1\n          preference:\n            matchExpressions:\n              - key: another-node-label-key\n                operator: In\n                values:\n                  - another-node-label-value\n      maxReplicas: 3\n      tolerations: [ ]\n      patch:\n        metadata:\n          labels:\n            xxx-specific-label: xxx\n    - name: subset-b\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-b\n  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"targetRef"}),": specify the target workload. Can not be mutated\uff0cand one workload can only correspond to one WorkloadSpread."]}),"\n",(0,r.jsx)(n.h2,{id:"subsets",children:"subsets"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"subsets"})," consists of multiple domain called ",(0,r.jsx)(n.code,{children:"subset"}),", and each topology has different configuration."]}),"\n",(0,r.jsx)(n.h3,{id:"sub-fields",children:"sub-fields"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"name"}),": the name of ",(0,r.jsx)(n.code,{children:"subset"}),", it is distinct in a WorkloadSpread, which represents a topology."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"maxReplicas"}),": the replicas limit of ",(0,r.jsx)(n.code,{children:"subset"}),", and must be Integer and >= 0. There is no replicas limit while the\n",(0,r.jsx)(n.code,{children:"maxReplicas"})," is nil."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Don't support percentage type in current version."}),"\n"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"minReplicas"}),": The minimum number of replicas expected to be scheduled for this subset, which must be an integer >= 0.\nIf left empty, it indicates no limit on the number of replicas for the subset. For example, when scattering by region,\nyou can use ",(0,r.jsx)(n.code,{children:"minReplicas"})," to ensure that each region has at least one replica, while the remaining replicas are\nelastically deployed according to an adaptive scheduling strategy."]}),"\n"]}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"The percentage type is not supported in the current version."}),"\n"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"requiredNodeSelectorTerm"}),": match zone hardly\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"preferredNodeSelectorTerms"}),": match zone softly\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Caution"}),"\uff1a",(0,r.jsx)(n.code,{children:"requiredNodeSelectorTerm"})," corresponds the ",(0,r.jsx)(n.code,{children:"requiredDuringSchedulingIgnoredDuringExecution"})," of nodeAffinity.\n",(0,r.jsx)(n.code,{children:"preferredNodeSelectorTerms"})," corresponds the ",(0,r.jsx)(n.code,{children:"preferredDuringSchedulingIgnoredDuringExecution"})," of nodeAffinity."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"tolerations"}),": the tolerations of Pod in ",(0,r.jsx)(n.code,{children:"subset"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'tolerations:\n  - key: "key1"\n    operator: "Equal"\n    value: "value1"\n    effect: "NoSchedule"\n'})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"patch"}),": customize the Pod configuration of ",(0,r.jsx)(n.code,{children:"subset"}),", such as Annotations, Labels, Env."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Example:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'# patch pod with a topology label:\npatch:\n  metadata:\n    labels:\n      topology.application.deploy/zone: "zone-a"\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'# patch pod container resources:\npatch:\n  spec:\n    containers:\n      - name: main\n        resources:\n          limit:\n            cpu: "2"\n            memory: 800Mi\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"# patch pod container env with a zone name:\npatch:\n  spec:\n    containers:\n      - name: main\n        env:\n          - name: K8S_AZ_NAME\n            value: zone-a\n"})}),"\n",(0,r.jsx)(n.h2,{id:"schedule-strategy",children:"Schedule strategy"}),"\n",(0,r.jsxs)(n.p,{children:["WorkloadSpread provides two kind strategies, the default strategy is ",(0,r.jsx)(n.code,{children:"Fixed"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Fixed:"}),"\n",(0,r.jsx)(n.p,{children:"Workload is strictly spread according to the definition of the subset."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Adaptive:"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Reschedule"}),": Kruise will check the unschedulable Pods of subset. If it exceeds the defined duration, the failed\nPods will be rescheduled to the other ",(0,r.jsx)(n.code,{children:"subset"}),"."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,r.jsxs)(n.p,{children:["WorkloadSpread defaults to be disabled. You have to configure the feature-gate ",(0,r.jsx)(n.em,{children:"WorkloadSpread"})," when install or upgrade\nKruise:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n'})}),"\n",(0,r.jsx)(n.h3,{id:"pod-webhook",children:"Pod Webhook"}),"\n",(0,r.jsxs)(n.p,{children:["WorkloadSpread uses ",(0,r.jsx)(n.code,{children:"webhook"})," to inject fault domain rules."]}),"\n",(0,r.jsxs)(n.p,{children:["If the ",(0,r.jsx)(n.code,{children:"PodWebhook"})," feature-gate is set to false, WorkloadSpread will also be disabled."]}),"\n",(0,r.jsx)(n.h3,{id:"deletion-cost-feature",children:"deletion-cost feature"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"CloneSet"})," has supported deletion-cost feature in the latest versions."]}),"\n",(0,r.jsx)(n.p,{children:"The other native workload need kubernetes version >= 1.21. (In 1.21, users need to enable PodDeletionCost feature-gate,\nand since 1.22 it will be enabled by default)"}),"\n",(0,r.jsx)(n.h2,{id:"scale-order",children:"Scale order:"}),"\n",(0,r.jsxs)(n.p,{children:["The workload managed by WorkloadSpread will scale according to the defined order in ",(0,r.jsx)(n.code,{children:"spec.subsets"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsxs)(n.strong,{children:["The order of ",(0,r.jsx)(n.code,{children:"subset"})," in ",(0,r.jsx)(n.code,{children:"spec.subsets"})," can be changed"]}),", which can adjust the scale order of workload."]}),"\n",(0,r.jsx)(n.h3,{id:"scale-out",children:"Scale out"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["The Pods are scheduled in the subset order defined in the ",(0,r.jsx)(n.code,{children:"spec.subsets"}),". It will be scheduled in the next ",(0,r.jsx)(n.code,{children:"subset"}),"\nwhile the replica number reaches the maxReplicas of ",(0,r.jsx)(n.code,{children:"subset"})]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"scale-in",children:"Scale in"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["When the replica number of the ",(0,r.jsx)(n.code,{children:"subset"})," is greater than the ",(0,r.jsx)(n.code,{children:"maxReplicas"}),", the extra Pods will be removed in a high\npriority."]}),"\n",(0,r.jsxs)(n.li,{children:["According to the ",(0,r.jsx)(n.code,{children:"subset"})," order in the ",(0,r.jsx)(n.code,{children:"spec.subsets"}),", the Pods of the ",(0,r.jsx)(n.code,{children:"subset"})," at the back are deleted before the\nPods at the front."]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    10          10        10\n# deletion order: c -> b -> a\n\n#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    20          20        20\n# deletion order: b -> a -> c\n"})}),"\n",(0,r.jsx)(n.h2,{id:"use-workloadspread-with-customized-workload",children:"Use WorkloadSpread with customized workload"}),"\n",(0,r.jsxs)(n.p,{children:["If you want to use WorkloadSpread with custom workloads, which is disabled by default, some\nadditional configuration is required. This section uses\nthe ",(0,r.jsx)(n.a,{href:"https://argoproj.github.io/argo-rollouts/",children:"Rollout Workload from the Argo community"})," as an example to\ndemonstrate how to integrate it with WorkloadSpread."]}),"\n",(0,r.jsx)(n.h3,{id:"configure-the-custom-workload-watch-whitelist",children:"Configure the custom workload watch whitelist"}),"\n",(0,r.jsxs)(n.p,{children:["First, you need to add the custom workload to the ",(0,r.jsx)(n.code,{children:"WorkloadSpread_Watch_Custom_Workload_WhiteList"})," to ensure it can be\nread and understood by WorkloadSpread."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: kruise-configuration\n  namespace: kruise-system\ndata:\n  "WorkloadSpread_Watch_Custom_Workload_WhiteList": |\n    {\n      "workloads": [\n        {\n          "Group": "argoproj.io",\n          "Kind": "Rollout",\n          "replicasPath": "spec.replicas",\n        }\n      ]\n    }\n'})}),"\n",(0,r.jsx)(n.p,{children:"The specific configuration items are explained as follows:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Group:"})," ApiGroup of the customized workload."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Kind:"})," Kind of the customized workload."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"subResources:"})," SubResources of the customized workload, including Group and Kind. For example: Deployment's\nReplicaSet. This field is optional, and can be left as empty slice if no sub-workload is used for the customized\nworkload."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"replicasPath:"})," Resource path to the replicas in the resource. For example: spec.replicas."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"authorize-kruise-manager",children:"Authorize kruise-manager"}),"\n",(0,r.jsx)(n.p,{children:"To use WorkloadSpread with custom workloads, you need to grant the kruise-manager service account read permissions for\nthe respective resources."}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Caution"}),": The WorkloadSpread Webhook does not set a deletion cost for Pods created by custom workloads, so it cannot\nensure the scaling-down order of custom workloads."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: kruise-rollouts-access\nrules:\n  - apiGroups: [ "argoproj.io" ]\n    resources: [ "rollouts" ]\n    verbs: [ "get" ]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: kruise-rollouts-access-binding\nsubjects:\n  - kind: ServiceAccount\n    name: kruise-manager\n    namespace: kruise-system\nroleRef:\n  kind: ClusterRole\n  name: kruise-rollouts-access\n  apiGroup: rbac.authorization.k8s.io\n'})}),"\n",(0,r.jsx)(n.h3,{id:"reference-the-custom-workload-in-workloadspread",children:"Reference the custom workload in WorkloadSpread"}),"\n",(0,r.jsxs)(n.p,{children:["Once the configuration is complete, the custom workload can be referenced in the ",(0,r.jsx)(n.code,{children:"targetRef"})," field of WorkloadSpread."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-demo\nspec:\n  targetRef:\n    apiVersion: argoproj.io/v1alpha1\n    kind: Rollout\n    name: rollouts-demo\n  subsets:\n    ...\n"})}),"\n",(0,r.jsx)(n.h3,{id:"support-for-ai-workloads",children:"Support for AI Workloads"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.8.0"]}),"\n",(0,r.jsxs)(n.p,{children:["In AI scenarios, certain workloads (such as Kubeflow's TFJob) include multiple roles (e.g., PS, Worker), and their\nreplica definitions may not align with the standard Scale subresource.\nWorkloadSpread introduces the ",(0,r.jsx)(n.code,{children:"targetFilter"})," field to enable fine-grained resource scattering for such workloads."]}),"\n",(0,r.jsx)(n.h4,{id:"typical-scenario-example",children:"Typical Scenario Example"}),"\n",(0,r.jsx)(n.p,{children:"For example, in a TFJob, you need to distribute the Pods of the Worker role across different zones:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: kubeflow.org/v1\nkind: TFJob\nmetadata:\n  name: tfjob-demo\nspec:\n  tfReplicaSpecs:\n  PS:\n    replicas: 1\n    # ...\n  Worker:\n    replicas: 2\n    # ...\n"})}),"\n",(0,r.jsx)(n.h4,{id:"configuration-steps",children:"Configuration Steps"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Configure Custom Workload Whitelist"}),(0,r.jsx)(n.br,{}),"\n","Refer to the ",(0,r.jsx)(n.a,{href:"#use-workloadspread-with-customized-workload",children:"section: Using WorkloadSpread on Custom Workloads"}),", add TFJob\nto the whitelist, and configure rbac permissions."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Define WorkloadSpread Configuration"})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: ws-tfjob-demo\nspec:\n  targetRef:\n    apiVersion: kubeflow.org/v1alpha1\n    kind: TFJob\n    name: tfjob-demo\n  targetFilter:\n    selector:\n      matchLabels:\n        role: worker\n    replicasPathList:\n      - spec.tfReplicaSpecs.Worker.replicas\n  #...\n"})}),"\n",(0,r.jsx)(n.h4,{id:"key-parameter-descriptions",children:"Key Parameter Descriptions"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Parameter"}),(0,r.jsx)(n.th,{children:"Description"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"targetFilter"})}),(0,r.jsx)(n.td,{children:"Used to filter specific roles (e.g., Worker) in the target workload and specify the path to their replica count."})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"replicasPathList"})}),(0,r.jsxs)(n.td,{children:["Specifies the path to the replica count of the target role in the CRD, e.g., ",(0,r.jsx)(n.code,{children:"spec.tfReplicaSpecs.Worker.replicas"}),"."]})]})]})]}),"\n",(0,r.jsx)(n.h4,{id:"expected-behavior",children:"Expected Behavior"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"WorkloadSpread will only manage the Pod distribution of the Worker role in the TFJob; the Pods of the PS role remain\nunaffected."}),"\n",(0,r.jsxs)(n.li,{children:["During scaling operations, the Worker Pods will be distributed across different zones according to the rules defined\nin ",(0,r.jsx)(n.code,{children:"subsets"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"feature-gates",children:"feature-gates"}),"\n",(0,r.jsxs)(n.p,{children:["WorkloadSpread feature is turned off by default, if you want to turn it on set feature-gates ",(0,r.jsx)(n.em,{children:"WorkloadSpread"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n'})}),"\n",(0,r.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.h3,{id:"elastic-deployment",children:"Elastic deployment"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"zone-a"}),"(ACK) holds 100 Pods, ",(0,r.jsx)(n.code,{children:"zone-b"}),"(ECI) as an elastic zone holds additional Pods."]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Create a WorkloadSpread instance."}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef: # workload in the same namespace\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: workload-xxx\n  subsets:\n  - name: ACK # zone ACK\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - ack\n    maxReplicas: 100\n    patch: # inject label.\n      metadata:\n        labels:\n          deploy/zone: ack\n  - name: ECI # zone ECI\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - eci\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:"Creat a corresponding workload, the number of replicas ca be adjusted freely."}),"\n"]}),"\n",(0,r.jsx)(n.h4,{id:"effect",children:"Effect"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["When the number of ",(0,r.jsx)(n.code,{children:"replicas"})," ","<="," 100, the Pods are scheduled in ",(0,r.jsx)(n.code,{children:"ACK"})," zone."]}),"\n",(0,r.jsxs)(n.li,{children:["When the number of ",(0,r.jsx)(n.code,{children:"replicas"})," ",">"," 100, the 100 Pods are in ",(0,r.jsx)(n.code,{children:"ACK"})," zone, the extra Pods are scheduled in ",(0,r.jsx)(n.code,{children:"ECI"})," zone."]}),"\n",(0,r.jsxs)(n.li,{children:["The Pods in ",(0,r.jsx)(n.code,{children:"ECI"})," elastic zone are removed first when scaling in."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"multi-domain-deployment",children:"Multi-domain deployment"}),"\n",(0,r.jsxs)(n.p,{children:["Deploy 100 Pods to two ",(0,r.jsx)(n.code,{children:"zone"}),"(zone-a, zone-b) separately."]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Create a WorkloadSpread instance."}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: workload-xxx\n  subsets:\n  - name: subset-a\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-a\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          deploy/zone: zone-a\n  - name: subset-b\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-b\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          deploy/zone: zone-b\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Creat a corresponding workload with a 200 replicas, or perform a rolling update on an existing workload."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["If the spread of zone needs to be changed, first adjust the ",(0,r.jsx)(n.code,{children:"maxReplicas"})," of ",(0,r.jsx)(n.code,{children:"subset"}),", and then change the ",(0,r.jsx)(n.code,{children:"replicas"}),"\nof workload."]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}}}]);
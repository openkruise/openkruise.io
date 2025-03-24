"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8293],{28453:(e,o,n)=>{n.d(o,{R:()=>r,x:()=>l});var s=n(96540);const t={},i=s.createContext(t);function r(e){const o=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function l(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(i.Provider,{value:o},e.children)}},30168:e=>{e.exports=JSON.parse('{"permalink":"/blog/workloadspread","editUrl":"https://github.com/openkruise/openkruise.io/edit/master/blog/2021-09-22-workloadspread.md","source":"@site/blog/2021-09-22-workloadspread.md","title":"WorkloadSpread - Interpretation for OpenKruise v0.10.0 new feature","description":"Background","date":"2021-09-22T00:00:00.000Z","tags":[{"inline":true,"label":"workload","permalink":"/blog/tags/workload"},{"inline":true,"label":"workloadspread","permalink":"/blog/tags/workloadspread"},{"inline":true,"label":"multi-domain","permalink":"/blog/tags/multi-domain"}],"readingTime":11.875,"hasTruncateMarker":false,"authors":[{"name":"GuangLei Cao","title":"Contributor of OpenKruise","url":"https://github.com/BoltsLei","imageURL":"https://github.com/BoltsLei.png","key":"BoltsLei","page":null},{"name":"Weixiang Sun","title":"Member of OpenKruise","url":"https://github.com/veophi","imageURL":"https://github.com/veophi.png","key":"veophi","page":null}],"frontMatter":{"slug":"workloadspread","title":"WorkloadSpread - Interpretation for OpenKruise v0.10.0 new feature","authors":["BoltsLei","veophi"],"tags":["workload","workloadspread","multi-domain"]},"unlisted":false,"prevItem":{"title":"OpenKruise v1.0, Reaching New Peaks of application automation","permalink":"/blog/openkruise-1.0"},"nextItem":{"title":"OpenKruise 0.10.0, New features of multi-domain management, application protection","permalink":"/blog/openkruise-0.10.0"}}')},39494:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/case-1-8545e73ad27cbea3f342f0502db2d123.jpg"},70560:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/arch-71cac149618fd28aae6c14d5dee1555f.jpg"},71697:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/case-2-4314e252508aedb388ff524d792b1bda.jpg"},78175:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/case-4-b5a9c883d4656b9cb2928df4bd14fc33.jpg"},80075:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var s=n(30168),t=n(74848),i=n(28453);const r={slug:"workloadspread",title:"WorkloadSpread - Interpretation for OpenKruise v0.10.0 new feature",authors:["BoltsLei","veophi"],tags:["workload","workloadspread","multi-domain"]},l=void 0,a={authorsImageUrls:[void 0,void 0]},d=[{value:"Background",id:"background",level:2},{value:"Introduction",id:"introduction",level:2},{value:"Comparison with related works",id:"comparison-with-related-works",level:2},{value:"\u300c1\u300dPod Topology Spread Constrains",id:"1pod-topology-spread-constrains",level:3},{value:"\u300c2\u300dUnitedDeploymen",id:"2uniteddeploymen",level:3},{value:"Use Case",id:"use-case",level:2},{value:"\u300c1\u300dDeploy 100 pods to normal node pool, rest pods to elastic node pool",id:"1deploy-100-pods-to-normal-node-pool-rest-pods-to-elastic-node-pool",level:3},{value:"\u300c1\u300dDeploy pods to normal node pool first, to elastic resource pool when normal node pool is insufficient",id:"1deploy-pods-to-normal-node-pool-first-to-elastic-resource-pool-when-normal-node-pool-is-insufficient",level:3},{value:"\u300c3\u300dScatter to 3 zones, the scale is 1:1:3",id:"3scatter-to-3-zones-the-scale-is-113",level:3},{value:"\u300c4\u300dConfigures different resource quotas on different CPU architecture",id:"4configures-different-resource-quotas-on-different-cpu-architecture",level:3},{value:"Implementation",id:"implementation",level:2},{value:"\u300c1\u300d How to decide the priority when scaling up?",id:"1-how-to-decide-the-priority-when-scaling-up",level:3},{value:"\u300c2\u300d How to decide the priority when scaling down?",id:"2-how-to-decide-the-priority-when-scaling-down",level:3},{value:"\u300c3\u300d How to solve the counting problems?",id:"3-how-to-solve-the-counting-problems",level:3},{value:"3.1 solving concurrency consistency problem",id:"31-solving-concurrency-consistency-problem",level:4},{value:"3.2 solving data consistency problem",id:"32-solving-data-consistency-problem",level:4},{value:"\u300c4\u300dHow to do if pod schedule failed?",id:"4how-to-do-if-pod-schedule-failed",level:3},{value:"Conclusion",id:"conclusion",level:2},{value:"Reference",id:"reference",level:2}];function c(e){const o={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",hr:"hr",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.h2,{id:"background",children:"Background"}),"\n",(0,t.jsx)(o.p,{children:"Deploying an application in different zones, different hardware types, and even different clusters and cloud vendors is becoming a very common requirement with the development of cloud native techniques.\nFor examples, these are some cases:"}),"\n",(0,t.jsxs)(o.ol,{children:["\n",(0,t.jsx)(o.li,{children:"Cases about disaster tolerant:"}),"\n"]}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsx)(o.li,{children:"Application pods is scattered according to the nodes to avoid stacking."}),"\n",(0,t.jsx)(o.li,{children:"Application pods is scattered according to available zones."}),"\n",(0,t.jsx)(o.li,{children:"Different nodes/zones/domains require different scale of pods."}),"\n"]}),"\n",(0,t.jsxs)(o.ol,{start:"2",children:["\n",(0,t.jsx)(o.li,{children:"Cases about cost control:"}),"\n"]}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsx)(o.li,{children:"People deploy an applications preferentially to their own resource pool, and then deployed to elastic resource pool, such as ECI on Aliyun and Fragate on AWS, when own resources are insufficient. When shrinking, the elastic node is preferred to shrink to save cost."}),"\n"]}),"\n",(0,t.jsxs)(o.p,{children:["In the most of the cases, people always split their application into multiple workloads (such as several ",(0,t.jsx)(o.code,{children:"Deployment"}),") to deploy. However\uff0cthis solution often requires manual management by SRE team, or a deeply customized PAAS to support the careful management of multiple workloads for this one application."]}),"\n",(0,t.jsxs)(o.p,{children:["In order to solve this problem, WorkloadSpread feature has been proposed in version v0.10.0 OpenKruise. It can support multi-kind of workloads, such as ",(0,t.jsx)(o.code,{children:"Deployment"}),", ",(0,t.jsx)(o.code,{children:"Replicaset"}),", ",(0,t.jsx)(o.code,{children:"Job"}),", and ",(0,t.jsx)(o.code,{children:"Cloneset"}),", to manage the partition deployment or elastic scaling. The application scenario and implementation principle of WorkloadSpread will be introduced in detail below to help users better understand this feature."]}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"introduction",children:"Introduction"}),"\n",(0,t.jsxs)(o.p,{children:["More details about WorkloadSpread can be found in ",(0,t.jsx)(o.a,{href:"https://openkruise.io/docs/user-manuals/workloadspread",children:"Offical Document"}),"."]}),"\n",(0,t.jsx)(o.p,{children:'In short, WorkloadSpread can distribute pods of a workload to different types of nodes according to certain rules, so as to meet the above fragmentation and elasticity scenarios. WorkloadSpread is non-invasive, "plug and play", and can be effective for stock workloads.'}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"comparison-with-related-works",children:"Comparison with related works"}),"\n",(0,t.jsx)(o.p,{children:"Let's make a simple comparison with some related works in the community."}),"\n",(0,t.jsx)(o.h3,{id:"1pod-topology-spread-constrains",children:"\u300c1\u300dPod Topology Spread Constrains"}),"\n",(0,t.jsxs)(o.p,{children:[(0,t.jsx)(o.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/",children:"Pod topology spread constraints"})," is a solution provided by Kubernetes community. It can horizontally scatter pods according to topology key. The scheduler will select the node that matches the conditions according to the configuration if users defined this rule."]}),"\n",(0,t.jsxs)(o.p,{children:["Since Pod Topology Spread is evenly dispersed, it ",(0,t.jsx)(o.strong,{children:"cannot"})," support exact customized partition number and proportion configuration. Furthermore, the distribution of pods will be destroyed when scaling down.\nUsing WorkloadSpread can avoid these problems."]}),"\n",(0,t.jsx)(o.h3,{id:"2uniteddeploymen",children:"\u300c2\u300dUnitedDeploymen"}),"\n",(0,t.jsxs)(o.p,{children:[(0,t.jsx)(o.a,{href:"https://openkruise.io/docs/user-manuals/uniteddeployment",children:"UnitedDeployment"})," is a solution provided by the OpenKruise community. It can manage pods in multiple regions by creating and managing multiple workloads."]}),"\n",(0,t.jsx)(o.p,{children:"UnitedDeployment supports the requirements of fragmentation and flexibility very well. But, it is a new workload, and the use cost and migration costs will be relatively high, whereas WorkloadSpread is a lightweight solution, which only needs to apply a simple configuration to associate the workload."}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"use-case",children:"Use Case"}),"\n",(0,t.jsx)(o.p,{children:"In the section, I will list some application scenarios of WorkloadSpread and give corresponding configurations to help users quickly understand the WorkloadSpread feature."}),"\n",(0,t.jsx)(o.h3,{id:"1deploy-100-pods-to-normal-node-pool-rest-pods-to-elastic-node-pool",children:"\u300c1\u300dDeploy 100 pods to normal node pool, rest pods to elastic node pool"}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.img,{alt:"case-1",src:n(39494).A+"",width:"2120",height:"1500"})}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"subsets:\n- name: subset-normal\n  maxReplicas: 100\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: app.deploy/zone\n      operator: In\n      values:\n      - normal\n- name: subset-elastic \n# maxReplicas==nil means no limit for replicas\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: app.deploy/zone\n      operator: In\n      values:\n      - elastic\n"})}),"\n",(0,t.jsx)(o.p,{children:"When the workload has less than 100 replicas, all pods will be deployed to the normal node pool, and more than 100 are deployed to the elastic node pool. When scaling down, the pods on the elastic node will be deleted first."}),"\n",(0,t.jsx)(o.p,{children:"Since workload spread limits the distribution of workload, but does not invade workload. Users can also dynamically adjust the number of replicas according to the resource load in combination with HPA."}),"\n",(0,t.jsx)(o.p,{children:"In this way, it will be automatically scheduled to the elastic node pool when receiving peak flow, and give priority to releasing the resources in the elastic resource pool when the peak gone."}),"\n",(0,t.jsx)(o.h3,{id:"1deploy-pods-to-normal-node-pool-first-to-elastic-resource-pool-when-normal-node-pool-is-insufficient",children:"\u300c1\u300dDeploy pods to normal node pool first, to elastic resource pool when normal node pool is insufficient"}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.img,{alt:"case-2",src:n(71697).A+"",width:"2128",height:"1462"})}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"scheduleStrategy:\n  type: Adaptive\n  adaptive:\n    rescheduleCriticalSeconds: 30\n    disableSimulationSchedule: false\nsubsets:\n- name: subset-normal\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: app.deploy/zone\n      operator: In\n      values:\n      - normal\n- name: subset-elastic\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: app.deploy/zone\n      operator: In\n      values:\n      - elastic\n"})}),"\n",(0,t.jsxs)(o.p,{children:["Both subsets have no limit on the number of replicas, and the ",(0,t.jsx)(o.code,{children:"Adaptive"})," rescheduling policy are enabled.\nThe goal is to preferentially deploy to the normal node pool. When normal resources are insufficient, webhook will select elastic nodes through simulated scheduling. When the pod in the normal node pool is in the pending state and exceeds the 30s threshold, the WorkloadSpread controller will delete the pod to trigger pod reconstruction, and the new pod will be scheduled to the elastic node pool. During volume reduction, the pod on the elastic node is also preferentially reduced to save costs for users."]}),"\n",(0,t.jsx)(o.h3,{id:"3scatter-to-3-zones-the-scale-is-113",children:"\u300c3\u300dScatter to 3 zones, the scale is 1:1:3"}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.img,{alt:"case-3",src:n(83540).A+"",width:"1646",height:"1062"})}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"subsets:\n- name: subset-a\n  maxReplicas: 20%\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: topology.kubernetes.io/zone\n      operator: In\n      values:\n      - zone-a\n- name: subset-b\n  maxReplicas: 20%\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: topology.kubernetes.io/zone\n      operator: In\n      values:\n      - zone-b\n- name: subset-c\n  maxReplicas: 60%\n  requiredNodeSelectorTerm:\n    matchExpressions:\n    - key: topology.kubernetes.io/zone\n      operator: In\n      values:\n      - zone-c   \n"})}),"\n",(0,t.jsx)(o.p,{children:"WorkloadSpread ensures that the pods are scheduled according to the defined proportion when scaling up and down."}),"\n",(0,t.jsx)(o.h3,{id:"4configures-different-resource-quotas-on-different-cpu-architecture",children:"\u300c4\u300dConfigures different resource quotas on different CPU architecture"}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.img,{alt:"case-4",src:n(78175).A+"",width:"2104",height:"1502"})}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:'subsets:\n- name: subset-x86-arch\n  # maxReplicas...\n  # requiredNodeSelectorTerm...\n  patch:\n    metadata:\n      labels:\n        resource.cpu/arch: x86\n    spec: \n      containers:\n      - name: main\n        resources:\n          limits:\n            cpu: "500m"\n            memory: "800Mi"\n- name: subset-arm-arch\n  # maxReplicas...\n  # requiredNodeSelectorTerm...\n  patch:\n    metadata:\n      labels:\n        resource.cpu/arch: arm\n    spec: \n      containers:\n      - name: main\n        resources:\n          limits:\n            cpu: "300m"\n            memory: "600Mi"\n'})}),"\n",(0,t.jsxs)(o.p,{children:["From the above example, we have patched different labels and container ",(0,t.jsx)(o.code,{children:"resources"})," for the pods of two subsets, which is convenient for us to manage the pod more finely. When workload pods are distributed on nodes of different CPU architectures, configure different resource quotas to make better use of hardware resources."]}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"implementation",children:"Implementation"}),"\n",(0,t.jsx)(o.p,{children:"WorkloadSpread is a pure bypass elastic/topology control solution. Users only need to create a corresponding WorkloadSpread config for their Deployment/Cloneset/Job/ReplicaSet Workloads. There is no need to change the them, and users will be no additional cost to use the WorkloadSpread."}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.img,{alt:"arch",src:n(70560).A+"",width:"2146",height:"920"})}),"\n",(0,t.jsx)(o.h3,{id:"1-how-to-decide-the-priority-when-scaling-up",children:"\u300c1\u300d How to decide the priority when scaling up?"}),"\n",(0,t.jsx)(o.p,{children:"Multiple subsets are defined in WorkloadSpread, and each subset represents a logical domain. Users can freely define subsets according to node configuration, hardware type, zone, etc. In particular, we defined the priority of subsets:"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsxs)(o.p,{children:["The priority is defined from high to low in the order from front to back, for example ",(0,t.jsx)(o.code,{children:"subset[i]"})," has higher priority than ",(0,t.jsx)(o.code,{children:"subset[j]"})," if ",(0,t.jsx)(o.code,{children:"i < j"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"The pods will be scheduled to the subsets with higher priority first."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(o.h3,{id:"2-how-to-decide-the-priority-when-scaling-down",children:"\u300c2\u300d How to decide the priority when scaling down?"}),"\n",(0,t.jsx)(o.p,{children:"Theoretically, the bypass solution of WorkloadSpread cannot interfere with the scaling logic in the workload controller."}),"\n",(0,t.jsxs)(o.p,{children:['However, this problem has been solved in the near future. Through the unremitting efforts (feedback) of users, k8s since version 1.21, it has been supported for ReplicaSet (deployment) to specify the "deletion cost" of the pods by setting the annotation ',(0,t.jsx)(o.code,{children:"controller.kubernetes.io/pod-deletion-cost"}),": the higher the deletion cost, the lower the priority of deletion."]}),"\n",(0,t.jsx)(o.p,{children:"Since version v0.9.0 OpenKruise, the deletion cost feature has been supported in cloneset."}),"\n",(0,t.jsx)(o.p,{children:(0,t.jsx)(o.strong,{children:"Therefore, the WorkloadSpread controller controls the scaling down order of the pods by adjusting their deletion cost."})}),"\n",(0,t.jsx)(o.p,{children:"For example, an WorkloadSpread associated a CloneSet with 10 replicas is as follows:"}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"  subsets:\n  - name: subset-a\n    maxReplicas: 8\n  - name: subset-b\n"})}),"\n",(0,t.jsx)(o.p,{children:"Then the deletion cost value and deletion order are as follows:"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsx)(o.li,{children:"8 pods in subset-a will have 200 deletion cost;"}),"\n",(0,t.jsx)(o.li,{children:"2 pods in subset-b will have 100 deletion cost, and will be deleted first;"}),"\n"]}),"\n",(0,t.jsx)(o.p,{children:"If user modify WorkloadSpread as:"}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"  subsets:\n  - name: subset-a\n    maxReplicas: 5 # 8->5, \n  - name: subset-b\n"})}),"\n",(0,t.jsx)(o.p,{children:"Then the deletion cost value and deletion order will also changed as follows:"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsx)(o.li,{children:"5 pods in subset-a will have 200 deletion cost;"}),"\n",(0,t.jsx)(o.li,{children:"3 pods in subset-a will have -100 deletion cost, and will be deleted first;"}),"\n",(0,t.jsx)(o.li,{children:"2 pods in subset-b will have 100 deletion cost;"}),"\n"]}),"\n",(0,t.jsxs)(o.p,{children:["In this way, workload can preferentially scale down those pods that exceed the subset ",(0,t.jsx)(o.code,{children:"maxReplicas"})," limit."]}),"\n",(0,t.jsx)(o.h3,{id:"3-how-to-solve-the-counting-problems",children:"\u300c3\u300d How to solve the counting problems?"}),"\n",(0,t.jsx)(o.p,{children:"How to ensure that webhook injects pod rules in strict accordance with the priority order of subset and the number of maxReplicas is a key problem at the implementation of WorkloadSpread."}),"\n",(0,t.jsx)(o.h4,{id:"31-solving-concurrency-consistency-problem",children:"3.1 solving concurrency consistency problem"}),"\n",(0,t.jsx)(o.p,{children:"Sine there may be several kruise-controller-manager pods and lots of webhook Goroutines to process the same WorkloadSpread, the concurrency consistency problem must exist."}),"\n",(0,t.jsxs)(o.p,{children:["In the status of WorkloadSpread, there are the ",(0,t.jsx)(o.code,{children:"subsetStatuses"})," field corresponding to each subset. The ",(0,t.jsx)(o.code,{children:"missingReplicas"})," field in it indicates the number of pods required by the subset, and - 1 indicates that there is no quantity limit (",(0,t.jsx)(o.code,{children:"subset.maxReplicas == nil"}),")."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-yaml",children:"spec:\n  subsets:\n  - name: subset-a\n    maxReplicas: 1\n  - name: subset-b\n  # ...\nstatus:\n  subsetStatuses:\n  - name: subset-a\n    missingReplicas: 1\n  - name: subset-b\n    missingReplicas: -1\n  # ...\n"})}),"\n",(0,t.jsx)(o.p,{children:"When webhook receives a pod create request:"}),"\n",(0,t.jsxs)(o.ol,{children:["\n",(0,t.jsxs)(o.li,{children:["Find a suitable subset with ",(0,t.jsx)(o.code,{children:"missingReplicas"})," greater than ",(0,t.jsx)(o.code,{children:"0"})," or equals to ",(0,t.jsx)(o.code,{children:"-1"}),"  according to the subset order."]}),"\n",(0,t.jsxs)(o.li,{children:["After finding a suitable subset, if ",(0,t.jsx)(o.code,{children:"missingReplicas"})," is greater than ",(0,t.jsx)(o.code,{children:"0"}),", subtract ",(0,t.jsx)(o.code,{children:"1"})," first and try to update the WorkloadSpread status."]}),"\n",(0,t.jsx)(o.li,{children:"If the update is successful, inject the rules defined by the subset into the pod."}),"\n",(0,t.jsx)(o.li,{children:"If the update fails, get the WorkloadSpread again to get the latest status, and return to step 1 (there is a certain limit on the number of retries)."}),"\n"]}),"\n",(0,t.jsxs)(o.p,{children:["Similarly, when webhook receives a pod delete or eviction request, ",(0,t.jsx)(o.code,{children:"MisingReplicas"})," will add ",(0,t.jsx)(o.code,{children:"1"})," to missingreplicas and update it."]}),"\n",(0,t.jsxs)(o.p,{children:["There is no doubt that we are using optimistic locks to solve update conflicts. ",(0,t.jsx)(o.strong,{children:"However, it is not appropriate to only use optimistic locks"}),", because workload will create a large number of pods in parallel, and APIServer will send many pod create requests to webhook in an instant, resulting in a lot of conflicts in parallel processing.\nAs we all know, optimistic lock is not suitable for too many conflicts, because the retry cost of solving conflicts is very high. To this end, we also added a WorkloadSpread level mutex to limit parallel processing to serial processing. There is a new problem in adding mutex locks, that is, after the current root obtains the lock, it is very likely that the WorkloadSpread obtained from infomer is not up-to-date, and will conflict as well. Therefore, after updating the WorkloadSpread, the Goroutine caches the latest WorkloadSpread and then releases the lock, so that the new Goroutine can directly get the latest WorkloadSpread from the cache after obtaining the lock. Of course, in the case of multiple webhooks, we still need to combine the optimistic lock mechanism to solve the conflict."]}),"\n",(0,t.jsx)(o.h4,{id:"32-solving-data-consistency-problem",children:"3.2 solving data consistency problem"}),"\n",(0,t.jsxs)(o.p,{children:["So, is the ",(0,t.jsx)(o.code,{children:"missingReplicas"})," field controlled by the webhook? The answer is ",(0,t.jsx)(o.strong,{children:"NO"}),", because:"]}),"\n",(0,t.jsxs)(o.ol,{children:["\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"The pod create request received by webhook may not really succeed in the end (for example, pod is illegal or fails in subsequent quota verification)."}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"The pod delete/eviction request received by webhook may not really succeed in the end (for example, it is intercepted by PDB, PUB, etc.)."}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"There are always various possibilities in k8s, leading to the end or disappearance of the pods without going through webhook (for example, phase enters succeeded/failed, or ETCD data is lost, etc.)."}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"At the same time, this is not in line with the end state oriented design concept."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(o.p,{children:"Therefore, the WorkloadSpread status is controlled by webhook in collaboration with the controller:"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsxs)(o.p,{children:["Webhook requests link interception in pod create/delete/ eviction, and modifies the ",(0,t.jsx)(o.code,{children:"missingReplicas"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsxs)(o.p,{children:["At the same time, the controller's reconcile will also get all pods under the current workload, classify them according to the subset, and update ",(0,t.jsx)(o.code,{children:"missingReplicas"})," to the actual missing quantity."]}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsxs)(o.p,{children:["From the above analysis, it is likely that there is a delay for the controller to obtain the pod from the informer, so we also added the ",(0,t.jsx)(o.code,{children:"creatingPods"})," map in the status. When the pod is injected at webhook, the key will be recorded as pod name and value are timestamp to the map, and the controller maintains the real ",(0,t.jsx)(o.code,{children:"missingReplicas"})," in combination with the map. Similarly, there is also a ",(0,t.jsx)(o.code,{children:"deleteingPods"})," map to record the delete/eviction event of the pod."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(o.h3,{id:"4how-to-do-if-pod-schedule-failed",children:"\u300c4\u300dHow to do if pod schedule failed?"}),"\n",(0,t.jsxs)(o.p,{children:["The configuration of reschedule strategy is supported in WorkloadSpread. By default, the type is fixed, that is, the pod is scheduled to the corresponding subset according to the sequence of each subset and the ",(0,t.jsx)(o.code,{children:"maxReplicas"})," limit."]}),"\n",(0,t.jsx)(o.p,{children:"However, in real scenarios, many times, the resources of subset may not fully meet the number of maxReplicas due to some reasons, such as insufficient resources. Users need a more flexible reschedule strategy."}),"\n",(0,t.jsx)(o.p,{children:"The adaptive capabilities provided by WorkloadSpread are logically divided into two types:"}),"\n",(0,t.jsxs)(o.ol,{children:["\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsxs)(o.p,{children:["SimulationSchedule: scheduling records exists in informer, so we want to simulate the scheduling of pods in webhook. That is, simple filtering is performed through ",(0,t.jsx)(o.code,{children:"nodeSelector"}),"/",(0,t.jsx)(o.code,{children:"Affinity"}),", Tolerances, and basic resources resources. (not applicable to virtual-kubelet)"]}),"\n"]}),"\n",(0,t.jsxs)(o.li,{children:["\n",(0,t.jsx)(o.p,{children:"Reschedule: After scheduling the pod to a subset, if the scheduling failure exceeds the rescheduleCriticalSeconds time, mark the subset as unscheduled temporarily, and delete the pod to trigger reconstruction. By default, unscheduled will be reserved for 5min, that is, pod creation within 5min will skip this subset."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,t.jsx)(o.p,{children:"WorkloadSpread combines some existing features of Kubernetes to give workload the ability of elastic and multi-domain deployment in the form of bypass. We hope that users can reduce workload deployment complexity by using WorkloadSpread and effectively reduce costs by taking advantage of its elastic scalability."}),"\n",(0,t.jsx)(o.p,{children:"At present, WorkloadSpread is applied to some project in Alibaba, and adjustments in the use will be fed back to the community in time. In the future, there are some new capability plans for WorkloadSpread, such as managing the existing pods, supporting batch workloads, and even using label to match the pod across different workloads. Some of these capabilities need to actually consider the needs and scenarios of community users. I hope you can participate in kruise community, mention Issues and PRs, help users solve the problems of more cloud native deployment, and build a better community."}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"reference",children:"Reference"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsxs)(o.li,{children:["WorkloadSpread: ",(0,t.jsx)(o.a,{href:"https://openkruise.io/docs/user-manuals/workloadspread",children:"https://openkruise.io/docs/user-manuals/workloadspread"})]}),"\n",(0,t.jsxs)(o.li,{children:["Pod Topology Spread Constrains: ",(0,t.jsx)(o.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/",children:"https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/"})]}),"\n",(0,t.jsxs)(o.li,{children:["UnitedDeployment: ",(0,t.jsx)(o.a,{href:"https://openkruise.io/docs/user-manuals/uniteddeployment",children:"https://openkruise.io/docs/user-manuals/uniteddeployment"})]}),"\n"]})]})}function h(e={}){const{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,t.jsx)(o,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},83540:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/case-3-2d2b48de4fda0972263202b26e504f2e.jpg"}}]);
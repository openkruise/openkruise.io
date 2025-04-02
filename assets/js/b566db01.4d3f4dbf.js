"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[787],{28453:(e,n,i)=>{i.d(n,{R:()=>t,x:()=>a});var s=i(96540);const o={},l=s.createContext(o);function t(e){const n=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),s.createElement(l.Provider,{value:n},e.children)}},49810:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>t,metadata:()=>s,toc:()=>r});const s=JSON.parse('{"id":"user-manuals/broadcastjob","title":"BroadcastJob","description":"This controller distributes a Pod on every node in the cluster.","source":"@site/versioned_docs/version-v1.7/user-manuals/broadcastjob.md","sourceDirName":"user-manuals","slug":"/user-manuals/broadcastjob","permalink":"/docs/v1.7/user-manuals/broadcastjob","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/broadcastjob.md","tags":[],"version":"v1.7","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"BroadcastJob"},"sidebar":"docs","previous":{"title":"Advanced DaemonSet","permalink":"/docs/v1.7/user-manuals/advanceddaemonset"},"next":{"title":"AdvancedCronJob","permalink":"/docs/v1.7/user-manuals/advancedcronjob"}}');var o=i(74848),l=i(28453);const t={title:"BroadcastJob"},a=void 0,d={},r=[{value:"Spec definition",id:"spec-definition",level:2},{value:"Template",id:"template",level:3},{value:"Parallelism",id:"parallelism",level:3},{value:"CompletionPolicy",id:"completionpolicy",level:3},{value:"Always (default)",id:"always-default",level:4},{value:"Never",id:"never",level:4},{value:"FailurePolicy",id:"failurepolicy",level:3},{value:"Type",id:"type",level:4},{value:"RestartLimit",id:"restartlimit",level:4},{value:"Examples",id:"examples",level:2},{value:"Monitor BroadcastJob status",id:"monitor-broadcastjob-status",level:3},{value:"ttlSecondsAfterFinished",id:"ttlsecondsafterfinished",level:3},{value:"activeDeadlineSeconds",id:"activedeadlineseconds",level:3},{value:"completionPolicy",id:"completionpolicy-1",level:3},{value:"failurePolicy",id:"failurepolicy-1",level:3},{value:"restartLimit",id:"restartlimit-1",level:4}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,l.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:["This controller distributes a Pod on every node in the cluster.\nLike a ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",children:"DaemonSet"}),",\na BroadcastJob makes sure a Pod is created and run on all selected nodes once in a cluster.\nLike a ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/",children:"Job"}),",\na BroadcastJob is expected to run to completion."]}),"\n",(0,o.jsx)(n.p,{children:"In the end, BroadcastJob does not consume any resources after each Pod succeeds on every node.\nThis controller is particularly useful when upgrading a software, e.g., Kubelet, or validation check\nin every node, which is typically needed only once within a long period of time or\nrunning an adhoc full cluster inspection script."}),"\n",(0,o.jsx)(n.p,{children:"Optionally, a BroadcastJob can keep alive after all Pods on desired nodes complete\nso that a Pod will be automatically launched for every new node after it is added to the cluster."}),"\n",(0,o.jsx)(n.h2,{id:"spec-definition",children:"Spec definition"}),"\n",(0,o.jsx)(n.h3,{id:"template",children:"Template"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Template"})," describes the Pod template used to run the job.\nNote that for the Pod restart policy, only ",(0,o.jsx)(n.code,{children:"Never"})," or ",(0,o.jsx)(n.code,{children:"OnFailure"})," is allowed for BroadcastJob."]}),"\n",(0,o.jsx)(n.h3,{id:"parallelism",children:"Parallelism"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Parallelism"})," specifies the maximal desired number of Pods that should be run at\nany given time. By default, there's no limit."]}),"\n",(0,o.jsxs)(n.p,{children:["For example, if a cluster has ten nodes and ",(0,o.jsx)(n.code,{children:"Parallelism"})," is set to three, there can only be\nthree pods running in parallel. A new Pod is created only after one running Pod finishes."]}),"\n",(0,o.jsx)(n.h3,{id:"completionpolicy",children:"CompletionPolicy"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"CompletionPolicy"})," specifies the controller behavior when reconciling the BroadcastJob."]}),"\n",(0,o.jsx)(n.h4,{id:"always-default",children:"Always (default)"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Always"})," policy means the job will eventually complete with either failed or succeeded\ncondition. The following parameters take effect with this policy:"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"ActiveDeadlineSeconds"})," specifies the duration in seconds relative to the startTime\nthat the job may be active before the system tries to terminate it.\nFor example, if ",(0,o.jsx)(n.code,{children:"ActiveDeadlineSeconds"})," is set to 60 seconds, after the BroadcastJob starts\nrunning for 60 seconds, all the running pods will be deleted and the job will be marked\nas Failed."]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"TTLSecondsAfterFinished"})," limits the lifetime of a BroadcastJob that has finished execution\n(either Complete or Failed). For example, if TTLSecondsAfterFinished is set to 10 seconds,\nthe job will be kept for 10 seconds after it finishes. Then the job along with all the Pods\nwill be deleted."]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"never",children:"Never"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Never"})," policy means the BroadcastJob will never be marked as Failed or Succeeded even if\nall Pods run to completion. This also means above ",(0,o.jsx)(n.code,{children:"ActiveDeadlineSeconds"}),", ",(0,o.jsx)(n.code,{children:"TTLSecondsAfterFinished"}),"\nand ",(0,o.jsx)(n.code,{children:"FailurePolicy.RestartLimit"})," parameters takes no effect if ",(0,o.jsx)(n.code,{children:"Never"})," policy is used.\nFor example, if user wants to perform an initial configuration validation for every newly\nadded node in the cluster, he can deploy a BroadcastJob with ",(0,o.jsx)(n.code,{children:"Never"})," policy."]}),"\n",(0,o.jsx)(n.h3,{id:"failurepolicy",children:"FailurePolicy"}),"\n",(0,o.jsx)(n.h4,{id:"type",children:"Type"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"Type"})," indicates the type of ",(0,o.jsx)(n.code,{children:"FailurePolicyType"}),"."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Continue"})," means the job will be still running, when failed pod is found."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"FailFast"}),"(default) means the job will be failed, when failed pod is found."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Pause"})," means the job will be paused, when failed pod is found."]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"restartlimit",children:"RestartLimit"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"RestartLimit"})," specifies the number of retries before marking the pod failed.\nCurrently, the number of retries are defined as the aggregated number of restart\ncounts across all Pods created by the job, i.e., the sum of the\n",(0,o.jsx)(n.a,{href:"https://github.com/kruiseio/kruise/blob/d61c12451d6a662736c4cfc48682fa75c73adcbc/vendor/k8s.io/api/core/v1/types.go#L2314",children:"ContainerStatus.RestartCount"}),"\nfor all containers in every Pod.  If this value exceeds ",(0,o.jsx)(n.code,{children:"RestartLimit"}),", the job is marked\nas Failed and all running Pods are deleted. No limit is enforced if ",(0,o.jsx)(n.code,{children:"RestartLimit"})," is\nnot set."]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,o.jsx)(n.h3,{id:"monitor-broadcastjob-status",children:"Monitor BroadcastJob status"}),"\n",(0,o.jsxs)(n.p,{children:["Assuming the cluster has only one node, run ",(0,o.jsx)(n.code,{children:"kubectl get bcj"})," (shortcut name for BroadcastJob) and\nwe will see the following:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:" NAME                 DESIRED   ACTIVE   SUCCEEDED   FAILED\n broadcastjob-sample  1         0        1           0\n"})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Desired"})," : The number of desired Pods. This equals to the number of matched nodes in the cluster."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Active"}),": The number of active Pods."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"SUCCEEDED"}),": The number of succeeded Pods."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"FAILED"}),": The number of failed Pods."]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"ttlsecondsafterfinished",children:"ttlSecondsAfterFinished"}),"\n",(0,o.jsxs)(n.p,{children:["Run a BroadcastJob that each Pod computes a pi, with ",(0,o.jsx)(n.code,{children:"ttlSecondsAfterFinished"})," set to 30.\nThe job will be deleted in 30 seconds after it is finished."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-ttl\nspec:\n  template:\n    spec:\n      containers:\n        - name: pi\n          image: perl\n          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Always\n    ttlSecondsAfterFinished: 30\n'})}),"\n",(0,o.jsx)(n.h3,{id:"activedeadlineseconds",children:"activeDeadlineSeconds"}),"\n",(0,o.jsxs)(n.p,{children:["Run a BroadcastJob that each Pod sleeps for 50 seconds, with ",(0,o.jsx)(n.code,{children:"activeDeadlineSeconds"})," set to 10 seconds.\nThe job will be marked as Failed after it runs for 10 seconds, and the running Pods will be deleted."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-active-deadline\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["sleep", "50000"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Always\n    activeDeadlineSeconds: 10\n'})}),"\n",(0,o.jsx)(n.h3,{id:"completionpolicy-1",children:"completionPolicy"}),"\n",(0,o.jsxs)(n.p,{children:["Run a BroadcastJob with ",(0,o.jsx)(n.code,{children:"Never"})," completionPolicy. The job will continue to run even if all Pods have completed on all nodes."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-never-complete\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["sleep", "5"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Never\n'})}),"\n",(0,o.jsx)(n.h3,{id:"failurepolicy-1",children:"failurePolicy"}),"\n",(0,o.jsx)(n.h4,{id:"restartlimit-1",children:"restartLimit"}),"\n",(0,o.jsxs)(n.p,{children:["Run a BroadcastJob with ",(0,o.jsx)(n.code,{children:"FailFast"})," failurePolicy. The job will be failed, when failed pod is found."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-restart-limit\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["cat", "/path/not/exist"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Never\n  failurePolicy:\n    type: FailFast\n    restartLimit: 3\n'})})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);
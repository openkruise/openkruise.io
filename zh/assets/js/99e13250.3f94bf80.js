"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7943],{28453:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>c});var o=s(96540);const i={},l=o.createContext(i);function d(e){const n=o.useContext(l);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),o.createElement(l.Provider,{value:n},e.children)}},80059:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>d,metadata:()=>o,toc:()=>r});const o=JSON.parse('{"id":"user-manuals/broadcastjob","title":"BroadcastJob","description":"\u8fd9\u4e2a\u63a7\u5236\u5668\u5c06 Pod \u5206\u53d1\u5230\u96c6\u7fa4\u4e2d\u6bcf\u4e2a node \u4e0a\uff0c\u7c7b\u4f3c\u4e8e DaemonSet\uff0c","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/broadcastjob.md","sourceDirName":"user-manuals","slug":"/user-manuals/broadcastjob","permalink":"/zh/docs/v1.7/user-manuals/broadcastjob","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/broadcastjob.md","tags":[],"version":"v1.7","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"BroadcastJob"},"sidebar":"docs","previous":{"title":"Advanced DaemonSet","permalink":"/zh/docs/v1.7/user-manuals/advanceddaemonset"},"next":{"title":"AdvancedCronJob","permalink":"/zh/docs/v1.7/user-manuals/advancedcronjob"}}');var i=s(74848),l=s(28453);const d={title:"BroadcastJob"},c=void 0,a={},r=[{value:"Spec \u5b9a\u4e49",id:"spec-\u5b9a\u4e49",level:2},{value:"Template",id:"template",level:3},{value:"Parallelism",id:"parallelism",level:3},{value:"CompletionPolicy",id:"completionpolicy",level:3},{value:"Always",id:"always",level:4},{value:"Never",id:"never",level:4},{value:"FailurePolicy",id:"failurepolicy",level:3},{value:"\u7c7b\u578b",id:"\u7c7b\u578b",level:4},{value:"\u91cd\u542f\u9650\u5236",id:"\u91cd\u542f\u9650\u5236",level:4},{value:"\u4f8b\u5b50",id:"\u4f8b\u5b50",level:2},{value:"\u76d1\u63a7 BroadcastJob status",id:"\u76d1\u63a7-broadcastjob-status",level:3},{value:"ttlSecondsAfterFinished",id:"ttlsecondsafterfinished",level:3},{value:"activeDeadlineSeconds",id:"activedeadlineseconds",level:3},{value:"completionPolicy",id:"completionpolicy-1",level:3},{value:"failurePolicy",id:"failurepolicy-1",level:3},{value:"restartLimit",id:"restartlimit",level:4}];function t(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["\u8fd9\u4e2a\u63a7\u5236\u5668\u5c06 Pod \u5206\u53d1\u5230\u96c6\u7fa4\u4e2d\u6bcf\u4e2a node \u4e0a\uff0c\u7c7b\u4f3c\u4e8e ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",children:"DaemonSet"}),"\uff0c\n\u4f46\u662f BroadcastJob \u7ba1\u7406\u7684 Pod \u5e76\u4e0d\u662f\u957f\u671f\u8fd0\u884c\u7684 daemon \u670d\u52a1\uff0c\u800c\u662f\u7c7b\u4f3c\u4e8e ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/",children:"Job"})," \u7684\u4efb\u52a1\u7c7b\u578b Pod\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u6700\u7ec8\u5728\u6bcf\u4e2a node \u4e0a\u7684 Pod \u90fd\u6267\u884c\u5b8c\u6210\u9000\u51fa\u540e\uff0cBroadcastJob \u548c\u8fd9\u4e9b Pod \u5e76\u4e0d\u4f1a\u5360\u7528\u96c6\u7fa4\u8d44\u6e90\u3002\n\u8fd9\u4e2a\u63a7\u5236\u5668\u975e\u5e38\u6709\u5229\u4e8e\u505a\u5347\u7ea7\u57fa\u7840\u8f6f\u4ef6\u3001\u5de1\u68c0\u7b49\u8fc7\u4e00\u6bb5\u65f6\u95f4\u9700\u8981\u5728\u6574\u4e2a\u96c6\u7fa4\u4e2d\u8dd1\u4e00\u6b21\u7684\u5de5\u4f5c\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u6b64\u5916\uff0cBroadcastJob \u8fd8\u53ef\u4ee5\u7ef4\u6301\u6bcf\u4e2a node \u8dd1\u6210\u529f\u4e00\u4e2a Pod \u4efb\u52a1\u3002\u5982\u679c\u91c7\u53d6\u8fd9\u79cd\u6a21\u5f0f\uff0c\u5f53\u540e\u7eed\u96c6\u7fa4\u4e2d\u65b0\u589e node \u65f6 BroadcastJob \u4e5f\u4f1a\u5206\u53d1 Pod \u4efb\u52a1\u4e0a\u53bb\u6267\u884c\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"spec-\u5b9a\u4e49",children:"Spec \u5b9a\u4e49"}),"\n",(0,i.jsx)(n.h3,{id:"template",children:"Template"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Template"})," \u63cf\u8ff0\u4e86 Pod \u6a21\u677f\uff0c\u7528\u4e8e\u521b\u5efa\u4efb\u52a1 Pod\u3002\n\u6ce8\u610f\uff0c\u7531\u4e8e\u662f\u4efb\u52a1\u7c7b\u578b\u7684 Pod\uff0c\u5176\u4e2d\u7684 restart policy \u53ea\u80fd\u8bbe\u7f6e\u4e3a ",(0,i.jsx)(n.code,{children:"Never"})," \u6216 ",(0,i.jsx)(n.code,{children:"OnFailure"}),"\uff0c\u4e0d\u5141\u8bb8\u8bbe\u4e3a ",(0,i.jsx)(n.code,{children:"Always"}),"\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"parallelism",children:"Parallelism"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Parallelism"})," \u6307\u5b9a\u4e86\u6700\u591a\u80fd\u5141\u8bb8\u591a\u5c11\u4e2a Pod \u540c\u65f6\u5728\u6267\u884c\u4efb\u52a1\uff0c\u9ed8\u8ba4\u4e0d\u505a\u9650\u5236\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u6bd4\u5982\uff0c\u4e00\u4e2a\u96c6\u7fa4\u91cc\u6709 10 \u4e2a node\u3001\u5e76\u8bbe\u7f6e\u4e86 ",(0,i.jsx)(n.code,{children:"Parallelism"})," \u4e3a 3\uff0c\u90a3\u4e48 BroadcastJob \u4f1a\u4fdd\u8bc1\u540c\u65f6\u53ea\u4f1a\u6709 3 \u4e2a node \u4e0a\u7684 Pod \u5728\u6267\u884c\u3002\u6bcf\u5f53\u4e00\u4e2a Pod \u6267\u884c\u5b8c\u6210\uff0cBroadcastJob \u624d\u4f1a\u521b\u5efa\u4e00\u4e2a\u65b0 Pod \u6267\u884c\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"completionpolicy",children:"CompletionPolicy"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"CompletionPolicy"})," \u652f\u6301\u6307\u5b9a BroadcastJob \u63a7\u5236\u5668\u7684 reconciling \u884c\u4e3a\uff0c\u53ef\u4ee5\u8bbe\u7f6e\u4e3a ",(0,i.jsx)(n.code,{children:"Always"})," \u6216 ",(0,i.jsx)(n.code,{children:"Never"}),"\uff1a"]}),"\n",(0,i.jsx)(n.h4,{id:"always",children:"Always"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Always"})," \u7b56\u7565\u610f\u5473\u7740 job \u6700\u7ec8\u4f1a\u5b8c\u6210\uff0c\u4e0d\u7ba1\u662f\u6267\u884c\u6210\u529f\u8fd8\u662f\u5931\u8d25\u4e86\u3002\u5728 ",(0,i.jsx)(n.code,{children:"Always"})," \u7b56\u7565\u4e0b\u8fd8\u53ef\u4ee5\u8bbe\u7f6e\u4ee5\u4e0b\u53c2\u6570\uff1a"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"ActiveDeadlineSeconds"}),"\uff1a\u6307\u5b9a\u4e00\u4e2a\u8d85\u65f6\u65f6\u95f4\uff0c\u5982\u679c BroadcastJob \u5f00\u59cb\u8fd0\u884c\u8d85\u8fc7\u4e86\u8fd9\u4e2a\u65f6\u95f4\uff0c\u6240\u6709\u8fd8\u5728\u8dd1\u7740\u7684 job \u90fd\u4f1a\u88ab\u505c\u6b62\u3001\u5e76\u6807\u8bb0\u4e3a\u5931\u8d25\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"TTLSecondsAfterFinished"})," \u9650\u5236\u4e86 BroadcastJob \u5728\u5b8c\u6210\u4e4b\u540e\u7684\u5b58\u6d3b\u65f6\u95f4\uff0c\u9ed8\u8ba4\u6ca1\u6709\u9650\u5236\u3002\u6bd4\u5982\u8bbe\u7f6e\u4e86 ",(0,i.jsx)(n.code,{children:"TTLSecondsAfterFinished"})," \u4e3a 10s\uff0c\u90a3\u4e48\u5f53 job \u7ed3\u675f\u540e\u8d85\u8fc7\u4e86 10s\uff0c\u63a7\u5236\u5668\u5c31\u4f1a\u628a job \u548c\u4e0b\u9762\u7684\u6240\u6709 Pod \u5220\u6389\u3002"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"never",children:"Never"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Never"})," \u7b56\u7565\u610f\u5473\u7740 BroadcastJob \u6c38\u8fdc\u90fd\u4e0d\u4f1a\u7ed3\u675f\uff08\u6807\u8bb0\u4e3a Succeeded \u6216 Failed\uff09\uff0c\u5373\u4f7f\u5f53\u524d job \u4e0b\u9762\u7684 Pod \u90fd\u5df2\u7ecf\u6267\u884c\u6210\u529f\u4e86\u3002\n\u8fd9\u4e5f\u610f\u5473\u7740 ",(0,i.jsx)(n.code,{children:"ActiveDeadlineSeconds"}),"\u3001 ",(0,i.jsx)(n.code,{children:"TTLSecondsAfterFinished"}),"\u3001",(0,i.jsx)(n.code,{children:"FailurePolicy.RestartLimit"})," \u8fd9\u4e09\u4e2a\u53c2\u6570\u662f\u4e0d\u80fd\u4f7f\u7528\u7684\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u6bd4\u5982\u8bf4\uff0c\u7528\u6237\u5e0c\u671b\u5bf9\u96c6\u7fa4\u4e2d\u6bcf\u4e2a node \u90fd\u4e0b\u53d1\u4e00\u4e2a\u914d\u7f6e\uff0c\u5305\u62ec\u540e\u7eed\u65b0\u589e\u7684 node \u90fd\u9700\u8981\u505a\uff0c\u90a3\u4e48\u5c31\u53ef\u4ee5\u521b\u5efa\u4e00\u4e2a ",(0,i.jsx)(n.code,{children:"Never"})," \u7b56\u7565\u7684 BroadcastJob\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"failurepolicy",children:"FailurePolicy"}),"\n",(0,i.jsx)(n.h4,{id:"\u7c7b\u578b",children:"\u7c7b\u578b"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Type"})," \u8868\u793a\u7684  ",(0,i.jsx)(n.code,{children:"FailurePolicyType"})," \u7c7b\u578b\u3002"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:'Continue"\uff08\u7ee7\u7eed\uff09\u8868\u793a\u5f53\u53d1\u73b0\u5931\u8d25\u7684 pod \u65f6\uff0c\u4f5c\u4e1a\u4ecd\u5728\u8fd0\u884c\u3002'}),"\n",(0,i.jsx)(n.li,{children:'FailFast"\uff08\u5feb\u901f\u5931\u8d25\uff09\u8868\u793a\u5f53\u53d1\u73b0\u5931\u8d25\u7684 pod \u65f6\uff0c\u4f5c\u4e1a\u5c06\u5931\u8d25\u3002'}),"\n",(0,i.jsx)(n.li,{children:'Pause"\uff08\u6682\u505c\uff09\u8868\u793a\u5f53\u53d1\u73b0\u5931\u8d25\u7684 pod \u65f6\uff0c\u4f5c\u4e1a\u5c06\u88ab\u6682\u505c\u3002'}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"\u91cd\u542f\u9650\u5236",children:"\u91cd\u542f\u9650\u5236"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"RestartLimit"}),"\uff08\u91cd\u542f\u9650\u5236\uff09\u6307\u5b9a\u6807\u8bb0 pod \u5931\u8d25\u524d\u7684\u91cd\u8bd5\u6b21\u6570\u3002\n\u76ee\u524d\uff0c\u91cd\u8bd5\u6b21\u6570\u5b9a\u4e49\u4e3a\u7531 Pod \u5185\u6240\u6709\u5bb9\u5668\u7684\u91cd\u542f\u6b21\u6570 ",(0,i.jsx)(n.a,{href:"https://github.com/kruiseio/kruise/blob/d61c12451d6a662736c4cfc48682fa75c73adcbc/vendor/k8s.io/api/core/v1/types.go#L2314",children:"ContainerStatus.RestartCount"}),"\u4e4b\u548c\u3002\n\u5982\u679c\u8be5\u503c\u8d85\u8fc7 ",(0,i.jsx)(n.code,{children:"RestartLimit"}),"\uff08\u91cd\u542f\u9650\u5236\uff09\uff0c\u8be5\u4efb\u52a1\u5c06\u88ab\u6807\u8bb0\u4e3a\u4e3a\u5931\u8d25\uff0c\u6240\u6709\u6b63\u5728\u8fd0\u884c\u7684 Pod \u5c06\u88ab\u5220\u9664\u3002\u5982\u679c\u672a\u8bbe\u7f6e ",(0,i.jsx)(n.code,{children:"RestartLimit"}),"  \u672a\u8bbe\u7f6e\uff0c\u5219\u4e0d\u6267\u884c\u9650\u5236\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"\u4f8b\u5b50",children:"\u4f8b\u5b50"}),"\n",(0,i.jsx)(n.h3,{id:"\u76d1\u63a7-broadcastjob-status",children:"\u76d1\u63a7 BroadcastJob status"}),"\n",(0,i.jsxs)(n.p,{children:["\u5728\u4e00\u4e2a\u5355 node \u96c6\u7fa4\u4e2d\u521b\u5efa\u4e00\u4e2a BroadcastJob\uff0c\u6267\u884c ",(0,i.jsx)(n.code,{children:"kubectl get bcj"})," \uff08BroadcastJob \u7684 short name\uff09\u770b\u5230\u4ee5\u4e0b\u72b6\u6001\uff1a"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:" NAME                 DESIRED   ACTIVE   SUCCEEDED   FAILED\n broadcastjob-sample  1         0        1           0\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Desired"})," : \u671f\u671b\u7684 Pod \u6570\u91cf\uff08\u7b49\u540c\u4e8e\u5f53\u524d\u96c6\u7fa4\u4e2d\u5339\u914d\u7684 node \u6570\u91cf\uff09"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Active"}),": \u8fd0\u884c\u4e2d\u7684 Pod \u6570\u91cf"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"SUCCEEDED"}),": \u6267\u884c\u6210\u529f\u7684 Pod \u6570\u91cf"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"FAILED"}),": \u6267\u884c\u5931\u8d25\u7684 Pod \u6570\u91cf"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"ttlsecondsafterfinished",children:"ttlSecondsAfterFinished"}),"\n",(0,i.jsxs)(n.p,{children:["\u521b\u5efa BroadcastJob \u914d\u7f6e ",(0,i.jsx)(n.code,{children:"ttlSecondsAfterFinished"})," \u4e3a 30\u3002\n\u8fd9\u4e2a job \u4f1a\u5728\u6267\u884c\u7ed3\u675f\u540e 30s \u88ab\u5220\u9664\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-ttl\nspec:\n  template:\n    spec:\n      containers:\n        - name: pi\n          image: perl\n          command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Always\n    ttlSecondsAfterFinished: 30\n'})}),"\n",(0,i.jsx)(n.h3,{id:"activedeadlineseconds",children:"activeDeadlineSeconds"}),"\n",(0,i.jsxs)(n.p,{children:["\u521b\u5efa BroadcastJob \u914d\u7f6e ",(0,i.jsx)(n.code,{children:"activeDeadlineSeconds"})," \u4e3a 10\u3002\n\u8fd9\u4e2a job \u4f1a\u5728\u8fd0\u884c\u8d85\u8fc7 10s \u4e4b\u540e\u88ab\u6807\u8bb0\u4e3a\u5931\u8d25\uff0c\u5e76\u628a\u4e0b\u9762\u8fd8\u5728\u8fd0\u884c\u7684 Pod \u5220\u9664\u6389\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-active-deadline\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["sleep",  "50000"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Always\n    activeDeadlineSeconds: 10\n'})}),"\n",(0,i.jsx)(n.h3,{id:"completionpolicy-1",children:"completionPolicy"}),"\n",(0,i.jsxs)(n.p,{children:["\u521b\u5efa BroadcastJob \u914d\u7f6e ",(0,i.jsx)(n.code,{children:"completionPolicy"})," \u4e3a ",(0,i.jsx)(n.code,{children:"Never"}),"\u3002\n\u8fd9\u4e2a job \u4f1a\u6301\u7eed\u8fd0\u884c\u5373\u4f7f\u5f53\u524d\u6240\u6709 node \u4e0a\u7684 Pod \u90fd\u6267\u884c\u5b8c\u6210\u4e86\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-never-complete\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["sleep",  "5"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Never\n'})}),"\n",(0,i.jsx)(n.h3,{id:"failurepolicy-1",children:"failurePolicy"}),"\n",(0,i.jsx)(n.h4,{id:"restartlimit",children:"restartLimit"}),"\n",(0,i.jsxs)(n.p,{children:["\u521b\u5efa BroadcastJob \u914d\u7f6e ",(0,i.jsx)(n.code,{children:"failurePolicy"})," \u4e3a ",(0,i.jsx)(n.code,{children:"FailFast"}),"\u3002\n\u5f53\u627e\u5230\u5931\u8d25\u7684pod\u65f6\uff0cjob\u5c06\u5931\u8d25\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: BroadcastJob\nmetadata:\n  name: broadcastjob-restart-limit\nspec:\n  template:\n    spec:\n      containers:\n        - name: sleep\n          image: busybox\n          command: ["cat", "/path/not/exist"]\n      restartPolicy: Never\n  completionPolicy:\n    type: Never\n  failurePolicy:\n    type: FailFast\n    restartLimit: 3\n'})})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(t,{...e})}):t(e)}}}]);
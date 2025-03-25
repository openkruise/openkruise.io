"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2603],{28453:(e,n,a)=>{a.d(n,{R:()=>t,x:()=>i});var s=a(96540);const l={},d=s.createContext(l);function t(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),s.createElement(d.Provider,{value:n},e.children)}},71214:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>r,contentTitle:()=>i,default:()=>p,frontMatter:()=>t,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"user-manuals/advancedstatefulset","title":"Advanced StatefulSet","description":"\u8fd9\u4e2a\u63a7\u5236\u5668\u57fa\u4e8e\u539f\u751f StatefulSet \u4e0a\u589e\u5f3a\u4e86\u53d1\u5e03\u80fd\u529b\uff0c\u6bd4\u5982 maxUnavailable \u5e76\u884c\u53d1\u5e03\u3001\u539f\u5730\u5347\u7ea7\u7b49\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/advancedstatefulset.md","sourceDirName":"user-manuals","slug":"/user-manuals/advancedstatefulset","permalink":"/zh/docs/user-manuals/advancedstatefulset","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advancedstatefulset.md","tags":[],"version":"v1.7","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Advanced StatefulSet"},"sidebar":"docs","previous":{"title":"CloneSet","permalink":"/zh/docs/user-manuals/cloneset"},"next":{"title":"Advanced DaemonSet","permalink":"/zh/docs/user-manuals/advanceddaemonset"}}');var l=a(74848),d=a(28453);const t={title:"Advanced StatefulSet"},i=void 0,r={},c=[{value:"Pod \u6807\u8bc6",id:"pod-\u6807\u8bc6",level:2},{value:"\u5e8f\u53f7\u7d22\u5f15",id:"\u5e8f\u53f7\u7d22\u5f15",level:3},{value:"\u8d77\u59cb\u5e8f\u53f7",id:"\u8d77\u59cb\u5e8f\u53f7",level:3},{value:"User Stories",id:"user-stories",level:4},{value:"Story 1",id:"story-1",level:5},{value:"Story 2",id:"story-2",level:5},{value:"Story 3",id:"story-3",level:5},{value:"\u6269\u7f29\u5bb9\u529f\u80fd",id:"\u6269\u7f29\u5bb9\u529f\u80fd",level:2},{value:"PersistentVolumeClaim \u4fdd\u7559",id:"persistentvolumeclaim-\u4fdd\u7559",level:3},{value:"\u6d41\u5f0f\u6269\u5bb9",id:"\u6d41\u5f0f\u6269\u5bb9",level:3},{value:"\u5e8f\u53f7\u4fdd\u7559\uff08\u8df3\u8fc7\uff09",id:"\u5e8f\u53f7\u4fdd\u7559\u8df3\u8fc7",level:3},{value:"\u6307\u5b9a Pod \u5220\u9664",id:"\u6307\u5b9a-pod-\u5220\u9664",level:3},{value:"\u5347\u7ea7\u529f\u80fd",id:"\u5347\u7ea7\u529f\u80fd",level:2},{value:"\u539f\u5730\u5347\u7ea7",id:"\u539f\u5730\u5347\u7ea7",level:3},{value:"\u539f\u5730\u5347\u7ea7\u81ea\u52a8\u9884\u70ed",id:"\u539f\u5730\u5347\u7ea7\u81ea\u52a8\u9884\u70ed",level:3},{value:"\u5347\u7ea7\u987a\u5e8f",id:"\u5347\u7ea7\u987a\u5e8f",level:3},{value:"\u4f18\u5148\u7ea7\u7b56\u7565",id:"\u4f18\u5148\u7ea7\u7b56\u7565",level:4},{value:"MaxUnavailable \u6700\u5927\u4e0d\u53ef\u7528",id:"maxunavailable-\u6700\u5927\u4e0d\u53ef\u7528",level:3},{value:"\u53d1\u5e03\u6682\u505c",id:"\u53d1\u5e03\u6682\u505c",level:3},{value:"\u751f\u547d\u5468\u671f\u94a9\u5b50",id:"\u751f\u547d\u5468\u671f\u94a9\u5b50",level:2}];function o(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",h5:"h5",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,d.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(n.p,{children:["\u8fd9\u4e2a\u63a7\u5236\u5668\u57fa\u4e8e\u539f\u751f ",(0,l.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",children:"StatefulSet"})," \u4e0a\u589e\u5f3a\u4e86\u53d1\u5e03\u80fd\u529b\uff0c\u6bd4\u5982 maxUnavailable \u5e76\u884c\u53d1\u5e03\u3001\u539f\u5730\u5347\u7ea7\u7b49\u3002"]}),"\n",(0,l.jsx)(n.p,{children:"\u5982\u679c\u4f60\u5bf9\u539f\u751f StatefulSet \u4e0d\u662f\u5f88\u4e86\u89e3\uff0c\u6211\u4eec\u5f3a\u70c8\u5efa\u8bae\u4f60\u5148\u9605\u8bfb\u5b83\u7684\u6587\u6863\uff08\u5728\u5b66\u4e60 Advanced StatefulSet \u4e4b\u524d\uff09\uff1a"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",children:"Concept of Kubernetes StatefulSet"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/",children:"Deploying a stateful application"})}),"\n"]}),"\n",(0,l.jsxs)(n.p,{children:["\u6ce8\u610f ",(0,l.jsx)(n.code,{children:"Advanced StatefulSet"})," \u662f\u4e00\u4e2a CRD\uff0ckind \u540d\u5b57\u4e5f\u662f ",(0,l.jsx)(n.code,{children:"StatefulSet"}),"\uff0c\u4f46\u662f apiVersion \u662f ",(0,l.jsx)(n.code,{children:"apps.kruise.io/v1beta1"}),"\u3002\n\u8fd9\u4e2a CRD \u7684\u6240\u6709\u9ed8\u8ba4\u5b57\u6bb5\u3001\u9ed8\u8ba4\u884c\u4e3a\u4e0e\u539f\u751f StatefulSet \u5b8c\u5168\u4e00\u81f4\uff0c\u9664\u6b64\u4e4b\u5916\u8fd8\u63d0\u4f9b\u4e86\u4e00\u4e9b optional \u5b57\u6bb5\u6765\u6269\u5c55\u589e\u5f3a\u7684\u7b56\u7565\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u56e0\u6b64\uff0c\u7528\u6237\u4ece\u539f\u751f ",(0,l.jsx)(n.code,{children:"StatefulSet"})," \u8fc1\u79fb\u5230 ",(0,l.jsx)(n.code,{children:"Advanced StatefulSet"}),"\uff0c\u53ea\u9700\u8981\u628a ",(0,l.jsx)(n.code,{children:"apiVersion"})," \u4fee\u6539\u540e\u63d0\u4ea4\u5373\u53ef\uff1a"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1beta1\n   kind: StatefulSet\n   metadata:\n     name: sample\n   spec:\n     #...\n"})}),"\n",(0,l.jsxs)(n.p,{children:["\u6ce8\u610f\u4ece Kruise 0.7.0 \u5f00\u59cb\uff0cAdvanced StatefulSet \u7248\u672c\u5347\u7ea7\u5230\u4e86 ",(0,l.jsx)(n.code,{children:"v1beta1"}),"\uff0c\u5e76\u4e0e ",(0,l.jsx)(n.code,{children:"v1alpha1"})," \u517c\u5bb9\u3002\u5bf9\u4e8e\u4f4e\u4e8e v0.7.0 \u7248\u672c\u7684 Kruise\uff0c\u53ea\u80fd\u4f7f\u7528 ",(0,l.jsx)(n.code,{children:"v1alpha1"}),"\u3002"]}),"\n",(0,l.jsx)(n.h2,{id:"pod-\u6807\u8bc6",children:"Pod \u6807\u8bc6"}),"\n",(0,l.jsx)(n.p,{children:"StatefulSet Pod \u5177\u6709\u552f\u4e00\u7684\u6807\u8bc6\uff0c\u8be5\u6807\u8bc6\u5305\u62ec\u987a\u5e8f\u6807\u8bc6\u3001\u7a33\u5b9a\u7684\u7f51\u7edc\u6807\u8bc6\u548c\u7a33\u5b9a\u7684\u5b58\u50a8\u3002 \u8be5\u6807\u8bc6\u548c Pod \u662f\u7ed1\u5b9a\u7684\uff0c\u4e0e\u8be5 Pod \u8c03\u5ea6\u5230\u54ea\u4e2a\u8282\u70b9\u4e0a\u65e0\u5173\u3002"}),"\n",(0,l.jsx)(n.h3,{id:"\u5e8f\u53f7\u7d22\u5f15",children:"\u5e8f\u53f7\u7d22\u5f15"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,l.jsxs)(n.p,{children:["\u5bf9\u4e8e\u5177\u6709 N \u4e2a\u526f\u672c\u7684 StatefulSet\uff0c\u8be5 StatefulSet \u4e2d\u7684\u6bcf\u4e2a Pod \u5c06\u88ab\u5206\u914d\u4e00\u4e2a\u6574\u6570\u5e8f\u53f7\uff0c\u8be5\u5e8f\u53f7\u5728\u6b64 StatefulSet \u4e2d\u662f\u552f\u4e00\u7684\u3002\n\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0c\u8fd9\u4e9b Pod \u5c06\u88ab\u8d4b\u4e88\u4ece 0 \u5230 N-1 \u7684\u5e8f\u53f7\u3002StatefulSet \u63a7\u5236\u5668\u4e5f\u4f1a\u6dfb\u52a0\u4e00\u4e2a\u5305\u542b\u6b64\u7d22\u5f15\u7684 Pod \u6807\u7b7e\uff1a",(0,l.jsx)(n.strong,{children:"apps.kubernetes.io/pod-index"}),"\uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: sample\n    apps.kubernetes.io/pod-index: "0"\n  name: sample-0\n'})}),"\n",(0,l.jsx)(n.h3,{id:"\u8d77\u59cb\u5e8f\u53f7",children:"\u8d77\u59cb\u5e8f\u53f7"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,l.jsxs)(n.p,{children:["Pod \u8d77\u59cb\u5e8f\u53f7\u9ed8\u8ba4\u90fd\u662f\u4ece 0 \u5f00\u59cb\u7684\uff0c\u6b64\u5916\uff0c\u4f60\u4e5f\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e ",(0,l.jsx)(n.strong,{children:".spec.ordinals.start"})," \u5b57\u6bb5\u6765\u8bbe\u7f6e Pod \u8d77\u59cb\u5e8f\u53f7\u3002\u4f7f\u7528\u8be5\u80fd\u529b\uff0c\u4f60\u9700\u8981\u5f00\u542f FeatureGate ",(0,l.jsx)(n.strong,{children:"StatefulSetStartOrdinal=true"}),"\u3002"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"spec.ordinals.start\uff1a\u5982\u679c .spec.ordinals.start \u5b57\u6bb5\u88ab\u8bbe\u7f6e\uff0c\u5219 Pod \u5c06\u88ab\u5206\u914d\u4ece .spec.ordinals.start \u5230 .spec.ordinals.start + .spec.replicas - 1 \u7684\u5e8f\u53f7\u3002\n\u6bd4\u5982\uff1areplicas=5\u3001ordinals.start=3\uff0cPod \u5e8f\u53f7 = [3, 7]\u3002"}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 5\n  ordinals:\n    start: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      containers:\n      - name: main\n        image: nginx:alpine\n"})}),"\n",(0,l.jsx)(n.h4,{id:"user-stories",children:"User Stories"}),"\n",(0,l.jsx)(n.p,{children:"\u8d77\u59cb\u5e8f\u53f7\u80fd\u529b\u4e3b\u8981\u662f\u4e3a\u4e86\u4f7f StatefulSet \u66f4\u52a0\u7075\u6d3b\uff0c\u57fa\u4e8e\u8be5\u80fd\u529b\u6709\u72b6\u6001\u5e94\u7528\u53ef\u4ee5\u81ea\u52a8\u5316\u7684\u65b9\u5f0f\u5728 Kubernetes \u96c6\u7fa4\u95f4\u8fc1\u79fb\u3002\u5982\u4e0b\uff1a"}),"\n",(0,l.jsx)(n.h5,{id:"story-1",children:"Story 1"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"Migrating across namespaces"}),": \u8bb8\u591a\u516c\u53f8\u4f7f\u7528\u547d\u540d\u7a7a\u95f4\u8fdb\u884c\u9694\u79bb\uff0c\u8003\u8651\u5230\u7528\u6237\u6b63\u5728\u5c06 StatefulSet \u8fc1\u79fb\u5230\u96c6\u7fa4\u4e2d\u7684\u65b0\u547d\u540d\u7a7a\u95f4\u3002\n\u8fc1\u79fb\u7684\u539f\u56e0\u53ef\u80fd\u662f\u7ec4\u7ec7\u67b6\u6784\u53d8\u52a8\uff0c\u4e5f\u53ef\u80fd\u662f\u8981\u6c42\u8fc1\u51fa\u5171\u4eab\u547d\u540d\u7a7a\u95f4\u3002\u5982\u4e0b\uff0c\u6709 ",(0,l.jsx)(n.strong,{children:"replicas\uff1a5"})," \u5728\u5171\u4eab\u547d\u540d\u7a7a\u95f4\u4e2d\u8fd0\u884c\uff1a"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"name: my-app\nnamespace: shared\nreplicas: 5\n-----------------------------------------------\n[ nginx-0, nginx-1, nginx-2, nginx-3, nginx-4 ]\n"})}),"\n",(0,l.jsxs)(n.p,{children:["\u4e3a\u4e86\u8fc1\u79fb\u4e24\u4e2apod\uff0c\u53ef\u5c06\u5171\u4eab\u547d\u540d\u7a7a\u95f4\u4e2d\u7684 ",(0,l.jsx)(n.code,{children:"my-app"})," StatefulSet \u7f29\u51cf\u4e3a ",(0,l.jsx)(n.strong,{children:"replicas: 3, ordinals.start: 0"}),"\uff0c",(0,l.jsx)(n.code,{children:"app-team"}),"\u547d\u540d\u7a7a\u95f4\u4e2d\u7684 StatefulSet \u53ef\u8c03\u6574\u4e3a\u4e3a ",(0,l.jsx)(n.strong,{children:"replicas: 2, ordinals.start: 3"})," \uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"name: my-app\t\t\t\t\t\tname: my-app\nnamespace: shared\t\t\t\t\tnamespace: app-team\nreplicas: 3\t\t\t\t\t\t    replicas: 2\nordinals.start: 0\t\t\t\t    ordinals.start: 3\n------------------------------\t\t---------------------\n[ nginx-0, nginx-1, nginx-2 ]\t\t[ nginx-3, nginx-4 ]\n"})}),"\n",(0,l.jsx)(n.h5,{id:"story-2",children:"Story 2"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"Migrating across clusters"}),": \u7531\u4e8e\u5bb9\u91cf\u9650\u5236\u3001\u57fa\u7840\u8bbe\u65bd\u9650\u5236\u6216\u4e3a\u4e86\u66f4\u597d\u5730\u9694\u79bb\u5e94\u7528\u7a0b\u5e8f\uff0c\u91c7\u7528\u591a\u96c6\u7fa4\u7684\u65b9\u5f0f\u53ef\u80fd\u9700\u8981\u5728\u96c6\u7fa4\u95f4\u79fb\u52a8\u5de5\u4f5c\u8d1f\u8f7d\u3002"]}),"\n",(0,l.jsx)(n.h5,{id:"story-3",children:"Story 3"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"Non-Zero Based Indexing:"})," \u7528\u6237\u53ef\u80fd\u5e0c\u671b\u4ece\u5e8f\u53f7 \u201c1 \u201d\u800c\u4e0d\u662f\u5e8f\u53f7 \u201c0 \u201d \u5f00\u59cb\u5bf9\u5176 StatefulSet \u8fdb\u884c\u7f16\u53f7\u3002\u4f7f\u7528 \u201d1 \u201c \u7684\u7f16\u53f7\u53ef\u80fd\u66f4\u5bb9\u6613\u63a8\u7406\u548c\u6982\u5ff5\u5316\uff08\u4f8b\u5982\uff1a\u5e8f\u53f7 \u201dk \u201c \u662f\u7b2c \u201dk \u201c \u4e2a\u526f\u672c\uff0c\u800c\u4e0d\u662f\u7b2c \u201dk+1 \u201c \u4e2a\u526f\u672c\uff09\u3002"]}),"\n",(0,l.jsx)(n.h2,{id:"\u6269\u7f29\u5bb9\u529f\u80fd",children:"\u6269\u7f29\u5bb9\u529f\u80fd"}),"\n",(0,l.jsx)(n.h3,{id:"persistentvolumeclaim-\u4fdd\u7559",children:"PersistentVolumeClaim \u4fdd\u7559"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.1.0"]}),"\n",(0,l.jsxs)(n.p,{children:["\u5982\u679c\u4f60\u5728",(0,l.jsx)(n.a,{href:"../installation##optional-feature-gate",children:"\u5b89\u88c5\u6216\u5347\u7ea7 Kruise"})," \u7684\u65f6\u5019\u542f\u7528\u4e86 ",(0,l.jsx)(n.code,{children:"StatefulSetAutoDeletePVC"})," feature-gate\uff0c\n\u4f60\u53ef\u4ee5\u4f7f\u7528 ",(0,l.jsx)(n.code,{children:".spec.persistentVolumeClaimRetentionPolicy"})," \u5b57\u6bb5\u6765\u63a7\u5236\u5728StatefulSet\u751f\u547d\u5468\u671f\u4e2d\u662f\u5426\u4ee5\u53ca\u4f55\u65f6\u5220\u9664\u5b83\u6240\u521b\u5efa\u7684PVC\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u8fd9\u4e2a\u529f\u80fd\u4e0e\u4e0a\u6e38 StatefulSet (K8s >= 1.23 [alpha]) \u63d0\u4f9b\u7684\u76f8\u540c\uff0c\u53ef\u4ee5\u53c2\u8003",(0,l.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention",children:"\u4e0a\u6e38\u6587\u6863"}),"\u3002"]}),"\n",(0,l.jsx)(n.h3,{id:"\u6d41\u5f0f\u6269\u5bb9",children:"\u6d41\u5f0f\u6269\u5bb9"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,l.jsxs)(n.p,{children:["\u4e3a\u4e86\u907f\u514d\u5728\u4e00\u4e2a\u65b0 Advanced StatefulSet \u521b\u5efa\u540e\u6709\u5927\u91cf\u5931\u8d25\u7684 pod \u88ab\u521b\u5efa\u51fa\u6765\uff0c\u4ece Kruise ",(0,l.jsx)(n.code,{children:"v0.10.0"})," \u7248\u672c\u5f00\u59cb\u5f15\u5165\u4e86\u5728 scale strategy \u4e2d\u7684 ",(0,l.jsx)(n.code,{children:"maxUnavailable"})," \u7b56\u7565\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 100\n  scaleStrategy:\n    maxUnavailable: 10% # percentage or absolute number\n"})}),"\n",(0,l.jsx)(n.p,{children:"\u5f53\u8fd9\u4e2a\u5b57\u6bb5\u88ab\u8bbe\u7f6e\u4e4b\u540e\uff0cAdvanced StatefulSet \u4f1a\u4fdd\u8bc1\u521b\u5efa pod \u4e4b\u540e\u4e0d\u53ef\u7528 pod \u6570\u91cf\u4e0d\u8d85\u8fc7\u8fd9\u4e2a\u9650\u5236\u503c\u3002"}),"\n",(0,l.jsx)(n.p,{children:"\u6bd4\u5982\u8bf4\uff0c\u4e0a\u9762\u8fd9\u4e2a StatefulSet \u4e00\u5f00\u59cb\u53ea\u4f1a\u4e00\u6b21\u6027\u521b\u5efa 10 \u4e2a pod\u3002\u5728\u6b64\u4e4b\u540e\uff0c\u6bcf\u5f53\u4e00\u4e2a pod \u53d8\u4e3a running\u3001ready \u72b6\u6001\u540e\uff0c\u624d\u4f1a\u518d\u521b\u5efa\u4e00\u4e2a\u65b0 pod \u51fa\u6765\u3002"}),"\n",(0,l.jsxs)(n.p,{children:["\u6ce8\u610f\uff0c\u8fd9\u4e2a\u529f\u80fd\u53ea\u5141\u8bb8\u5728 podManagementPolicy \u662f ",(0,l.jsx)(n.code,{children:"Parallel"})," \u7684 StatefulSet \u4e2d\u4f7f\u7528\u3002"]}),"\n",(0,l.jsx)(n.h3,{id:"\u5e8f\u53f7\u4fdd\u7559\u8df3\u8fc7",children:"\u5e8f\u53f7\u4fdd\u7559\uff08\u8df3\u8fc7\uff09"}),"\n",(0,l.jsx)(n.p,{children:"\u4ece Advanced StatefulSet \u7684 v1beta1 \u7248\u672c\u5f00\u59cb\uff08Kruise >= v0.7.0\uff09\uff0c\u652f\u6301\u5e8f\u53f7\u4fdd\u7559\u529f\u80fd\u3002"}),"\n",(0,l.jsxs)(n.p,{children:["\u901a\u8fc7\u5728 ",(0,l.jsx)(n.code,{children:"reserveOrdinals"})," \u5b57\u6bb5\u4e2d\u5199\u5165\u9700\u8981\u4fdd\u7559\u7684\u5e8f\u53f7\uff0cAdvanced StatefulSet \u4f1a\u81ea\u52a8\u8df3\u8fc7\u521b\u5efa\u8fd9\u4e9b\u5e8f\u53f7\u7684 Pod\u3002\u5982\u679c Pod \u5df2\u7ecf\u5b58\u5728\uff0c\u5219\u4f1a\u88ab\u5220\u9664\u3002\n\u6ce8\u610f\uff0c",(0,l.jsx)(n.code,{children:"spec.replicas"})," \u662f\u671f\u671b\u8fd0\u884c\u7684 Pod \u6570\u91cf\uff0c",(0,l.jsx)(n.code,{children:"spec.reserveOrdinals"})," \u662f\u8981\u8df3\u8fc7\u7684\u5e8f\u53f7\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 4\n  reserveOrdinals:\n  - 1\n"})}),"\n",(0,l.jsxs)(n.p,{children:["\u5bf9\u4e8e\u4e00\u4e2a ",(0,l.jsx)(n.code,{children:"replicas=4, reserveOrdinals=[1]"})," \u7684 Advanced StatefulSet\uff0c\u5b9e\u9645\u8fd0\u884c\u7684 Pod \u5e8f\u53f7\u4e3a ",(0,l.jsx)(n.code,{children:"[0,2,3,4]"}),"\u3002"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\u5982\u679c\u8981\u628a Pod-3 \u505a\u8fc1\u79fb\u5e76\u4fdd\u7559\u5e8f\u53f7\uff0c\u5219\u628a ",(0,l.jsx)(n.code,{children:"3"})," \u8ffd\u52a0\u5230 ",(0,l.jsx)(n.code,{children:"reserveOrdinals"})," \u5217\u8868\u4e2d\u3002\u63a7\u5236\u5668\u4f1a\u628a Pod-3 \u5220\u9664\u5e76\u521b\u5efa Pod-5\uff08\u6b64\u65f6\u8fd0\u884c\u4e2d Pod \u4e3a ",(0,l.jsx)(n.code,{children:"[0,2,4,5]"}),"\uff09\u3002"]}),"\n",(0,l.jsxs)(n.li,{children:["\u5982\u679c\u53ea\u60f3\u5220\u9664 Pod-3\uff0c\u5219\u628a ",(0,l.jsx)(n.code,{children:"3"})," \u8ffd\u52a0\u5230 ",(0,l.jsx)(n.code,{children:"reserveOrdinals"})," \u5217\u8868\u5e76\u540c\u65f6\u628a ",(0,l.jsx)(n.code,{children:"replicas"})," \u51cf\u4e00\u4fee\u6539\u4e3a ",(0,l.jsx)(n.code,{children:"3"}),"\u3002\u63a7\u5236\u5668\u4f1a\u628a Pod-3 \u5220\u9664\uff08\u6b64\u65f6\u8fd0\u884c\u4e2d Pod \u4e3a ",(0,l.jsx)(n.code,{children:"[0,2,4]"}),"\uff09\u3002"]}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"\u6307\u5b9a-pod-\u5220\u9664",children:"\u6307\u5b9a Pod \u5220\u9664"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.5, Kruise v1.6.4, Kruise v1.7.2+"]}),"\n",(0,l.jsxs)(n.p,{children:["\u76f8\u6bd4\u4e8e\u624b\u52a8\u76f4\u63a5\u5220\u9664 Pod\uff0c\u4f7f\u7528 ",(0,l.jsx)(n.code,{children:"apps.kruise.io/specified-delete: true"})," \u6307\u5b9a Pod \u5220\u9664\u65b9\u5f0f\u4f1a\u6709 Advanced StatefulSet \u7684 ",(0,l.jsx)(n.code,{children:"maxUnavailable"})," \u6765\u4fdd\u62a4\u5220\u9664\uff0c \u5e76\u4e14\u4f1a\u89e6\u53d1 ",(0,l.jsx)(n.code,{children:"PreparingDelete"})," \u751f\u547d\u5468\u671f hook \uff08\u89c1\u4e0b\u6587\uff09\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    # ...\n    apps.kruise.io/specified-delete: true\nspec:\n  containers:\n  - name: main\n  # ...\n"})}),"\n",(0,l.jsxs)(n.p,{children:["\u5f53\u63a7\u5236\u5668\u6536\u5230\u4e0a\u9762\u8fd9\u4e2a Pod \u66f4\u65b0\u4e4b\u540e\uff0c\u4f1a\u4f18\u5148\u5904\u7406\u5b58\u5728\u6307\u5b9a\u5220\u9664\u6807\u7b7e\u7684 pod \u7684\u5220\u9664\u6d41\u7a0b\uff0c\u5e76\u4fdd\u8bc1\u4e0d\u7a81\u7834 ",(0,l.jsx)(n.code,{children:"maxUnavailable"})," \u7684\u9650\u5236\u3002"]}),"\n",(0,l.jsx)(n.h2,{id:"\u5347\u7ea7\u529f\u80fd",children:"\u5347\u7ea7\u529f\u80fd"}),"\n",(0,l.jsx)(n.h3,{id:"\u539f\u5730\u5347\u7ea7",children:"\u539f\u5730\u5347\u7ea7"}),"\n",(0,l.jsxs)(n.p,{children:["Advanced StatefulSet \u589e\u52a0\u4e86 ",(0,l.jsx)(n.code,{children:"podUpdatePolicy"})," \u6765\u5141\u8bb8\u7528\u6237\u6307\u5b9a\u91cd\u5efa\u5347\u7ea7\u8fd8\u662f\u539f\u5730\u5347\u7ea7\u3002"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"ReCreate"}),": \u63a7\u5236\u5668\u4f1a\u5220\u9664\u65e7 Pod \u548c\u5b83\u7684 PVC\uff0c\u7136\u540e\u7528\u65b0\u7248\u672c\u91cd\u65b0\u521b\u5efa\u51fa\u6765\u3002"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"InPlaceIfPossible"}),": \u63a7\u5236\u5668\u4f1a\u4f18\u5148\u5c1d\u8bd5\u539f\u5730\u5347\u7ea7 Pod\uff0c\u5982\u679c\u4e0d\u884c\u518d\u91c7\u7528\u91cd\u5efa\u5347\u7ea7\u3002\u5177\u4f53\u53c2\u8003\u4e0b\u65b9\u9605\u8bfb\u6587\u6863\u3002"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"InPlaceOnly"}),": \u63a7\u5236\u5668\u53ea\u5141\u8bb8\u91c7\u7528\u539f\u5730\u5347\u7ea7\u3002\u56e0\u6b64\uff0c\u7528\u6237\u53ea\u80fd\u4fee\u6539\u4e0a\u4e00\u6761\u4e2d\u7684\u9650\u5236\u5b57\u6bb5\uff0c\u5982\u679c\u5c1d\u8bd5\u4fee\u6539\u5176\u4ed6\u5b57\u6bb5\u4f1a\u88ab Kruise \u62d2\u7edd\u3002"]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsxs)(n.strong,{children:["\u8bf7\u9605\u8bfb",(0,l.jsx)(n.a,{href:"../core-concepts/inplace-update",children:"\u8be5\u6587\u6863"}),"\u4e86\u89e3\u66f4\u591a\u539f\u5730\u5347\u7ea7\u7684\u7ec6\u8282\u3002"]})}),"\n",(0,l.jsxs)(n.p,{children:["\u6211\u4eec\u8fd8\u5728\u539f\u5730\u5347\u7ea7\u4e2d\u63d0\u4f9b\u4e86 ",(0,l.jsx)(n.strong,{children:"graceful period"})," \u9009\u9879\uff0c\u4f5c\u4e3a\u4f18\u96c5\u539f\u5730\u5347\u7ea7\u7684\u7b56\u7565\u3002\u7528\u6237\u5982\u679c\u914d\u7f6e\u4e86 ",(0,l.jsx)(n.code,{children:"gracePeriodSeconds"})," \u8fd9\u4e2a\u5b57\u6bb5\uff0c\u63a7\u5236\u5668\u5728\u539f\u5730\u5347\u7ea7\u7684\u8fc7\u7a0b\u4e2d\u4f1a\u5148\u628a Pod status \u6539\u4e3a not-ready\uff0c\u7136\u540e\u7b49\u4e00\u6bb5\u65f6\u95f4\uff08",(0,l.jsx)(n.code,{children:"gracePeriodSeconds"}),"\uff09\uff0c\u6700\u540e\u518d\u53bb\u4fee\u6539 Pod spec \u4e2d\u7684\u955c\u50cf\u7248\u672c\u3002\n\u8fd9\u6837\uff0c\u5c31\u4e3a endpoints-controller \u8fd9\u4e9b\u63a7\u5236\u5668\u7559\u51fa\u4e86\u5145\u8db3\u7684\u65f6\u95f4\u6765\u5c06 Pod \u4ece endpoints \u7aef\u70b9\u5217\u8868\u4e2d\u53bb\u9664\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      inPlaceUpdateStrategy:\n        gracePeriodSeconds: 10\n"})}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"\u66f4\u91cd\u8981\u7684\u662f"}),"\uff0c\u5982\u679c\u4f7f\u7528 ",(0,l.jsx)(n.code,{children:"InPlaceIfPossible"})," \u6216 ",(0,l.jsx)(n.code,{children:"InPlaceOnly"})," \u7b56\u7565\uff0c\u5fc5\u987b\u8981\u589e\u52a0\u4e00\u4e2a ",(0,l.jsx)(n.code,{children:"InPlaceUpdateReady"})," readinessGate\uff0c\u7528\u6765\u5728\u539f\u5730\u5347\u7ea7\u7684\u65f6\u5019\u63a7\u5236\u5668\u5c06 Pod \u8bbe\u7f6e\u4e3a NotReady\u3002"]}),"\n",(0,l.jsx)(n.p,{children:"\u4e00\u4e2a\u5b8c\u6574\u7684\u539f\u5730\u5347\u7ea7 StatefulSet \u4f8b\u5b50\u5982\u4e0b\uff1a"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      readinessGates:\n         # A new condition that ensures the pod remains at NotReady state while the in-place update is happening\n      - conditionType: InPlaceUpdateReady\n      containers:\n      - name: main\n        image: nginx:alpine\n  podManagementPolicy: Parallel # allow parallel updates, works together with maxUnavailable\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      # Do in-place update if possible, currently only image update is supported for in-place update\n      podUpdatePolicy: InPlaceIfPossible\n      # Allow parallel updates with max number of unavailable instances equals to 2\n      maxUnavailable: 2\n"})}),"\n",(0,l.jsx)(n.h3,{id:"\u539f\u5730\u5347\u7ea7\u81ea\u52a8\u9884\u70ed",children:"\u539f\u5730\u5347\u7ea7\u81ea\u52a8\u9884\u70ed"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,l.jsxs)(n.p,{children:["\u5982\u679c\u4f60\u5728",(0,l.jsx)(n.a,{href:"../installation##optional-feature-gate",children:"\u5b89\u88c5\u6216\u5347\u7ea7 Kruise"})," \u7684\u65f6\u5019\u542f\u7528\u4e86 ",(0,l.jsx)(n.code,{children:"PreDownloadImageForInPlaceUpdate"})," feature-gate\uff0c\nAdvanced StatefulSet \u63a7\u5236\u5668\u4f1a\u81ea\u52a8\u5728\u6240\u6709\u65e7\u7248\u672c pod \u6240\u5728 node \u8282\u70b9\u4e0a\u9884\u70ed\u4f60\u6b63\u5728\u7070\u5ea6\u53d1\u5e03\u7684\u65b0\u7248\u672c\u955c\u50cf\u3002 \u8fd9\u5bf9\u4e8e\u5e94\u7528\u53d1\u5e03\u52a0\u901f\u5f88\u6709\u5e2e\u52a9\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u9ed8\u8ba4\u60c5\u51b5\u4e0b Advanced StatefulSet \u6bcf\u4e2a\u65b0\u955c\u50cf\u9884\u70ed\u65f6\u7684\u5e76\u53d1\u5ea6\u90fd\u662f ",(0,l.jsx)(n.code,{children:"1"}),"\uff0c\u4e5f\u5c31\u662f\u4e00\u4e2a\u4e2a\u8282\u70b9\u62c9\u955c\u50cf\u3002\n\u5982\u679c\u9700\u8981\u8c03\u6574\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7 ",(0,l.jsx)(n.code,{children:"apps.kruise.io/image-predownload-parallelism"})," annotation \u6765\u8bbe\u7f6e\u5e76\u53d1\u5ea6\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u53e6\u5916\u4ece Kruise v1.1.0 \u5f00\u59cb\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528 ",(0,l.jsx)(n.code,{children:"apps.kruise.io/image-predownload-min-updated-ready-pods"})," \u6765\u63a7\u5236\u5728\u5c11\u91cf\u65b0\u7248\u672c Pod \u5df2\u7ecf\u5347\u7ea7\u6210\u529f\u4e4b\u540e\u518d\u6267\u884c\u955c\u50cf\u9884\u70ed\u3002\u5b83\u7684\u503c\u53ef\u80fd\u662f\u7edd\u5bf9\u503c\u6570\u5b57\u6216\u662f\u767e\u5206\u6bd4\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"\n'})}),"\n",(0,l.jsx)(n.p,{children:"\u6ce8\u610f\uff0c\u4e3a\u4e86\u907f\u514d\u5927\u90e8\u5206\u4e0d\u5fc5\u8981\u7684\u955c\u50cf\u62c9\u53d6\uff0c\u76ee\u524d\u53ea\u9488\u5bf9 replicas > 3 \u7684 Advanced StatefulSet \u505a\u81ea\u52a8\u9884\u70ed\u3002"}),"\n",(0,l.jsx)(n.h3,{id:"\u5347\u7ea7\u987a\u5e8f",children:"\u5347\u7ea7\u987a\u5e8f"}),"\n",(0,l.jsxs)(n.p,{children:["Advanced StatefulSet \u5728 ",(0,l.jsx)(n.code,{children:"spec.updateStrategy.rollingUpdate"})," \u4e0b\u9762\u65b0\u589e\u4e86 ",(0,l.jsx)(n.code,{children:"unorderedUpdate"})," \u7ed3\u6784\uff0c\u63d0\u4f9b\u7ed9\u4e0d\u6309 order \u987a\u5e8f\u7684\u5347\u7ea7\u7b56\u7565\u3002\n\u5982\u679c ",(0,l.jsx)(n.code,{children:"unorderedUpdate"})," \u4e0d\u4e3a\u7a7a\uff0c\u6240\u6709 Pod \u7684\u53d1\u5e03\u987a\u5e8f\u5c31\u4e0d\u4e00\u5b9a\u4f1a\u6309\u7167 order \u987a\u5e8f\u4e86\u3002\u6ce8\u610f\uff0c",(0,l.jsx)(n.code,{children:"unorderedUpdate"})," \u53ea\u80fd\u914d\u5408 Parallel podManagementPolicy \u4f7f\u7528\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u76ee\u524d\uff0c",(0,l.jsx)(n.code,{children:"unorderedUpdate"})," \u4e0b\u9762\u53ea\u5305\u542b ",(0,l.jsx)(n.code,{children:"priorityStrategy"})," \u4e00\u4e2a\u4f18\u5148\u7ea7\u7b56\u7565\u3002"]}),"\n",(0,l.jsx)(n.h4,{id:"\u4f18\u5148\u7ea7\u7b56\u7565",children:"\u4f18\u5148\u7ea7\u7b56\u7565"}),"\n",(0,l.jsxs)(n.p,{children:["\u8fd9\u4e2a\u7b56\u7565\u5b9a\u4e49\u4e86\u63a7\u5236\u5668\u8ba1\u7b97 Pod \u53d1\u5e03\u4f18\u5148\u7ea7\u7684\u89c4\u5219\uff0c\u6240\u6709\u9700\u8981\u66f4\u65b0\u7684 Pod \u90fd\u4f1a\u901a\u8fc7\u8fd9\u4e2a\u4f18\u5148\u7ea7\u89c4\u5219\u8ba1\u7b97\u540e\u6392\u5e8f\u3002\n\u76ee\u524d ",(0,l.jsx)(n.code,{children:"priority"})," \u53ef\u4ee5\u901a\u8fc7 weight(\u6743\u91cd) \u548c order(\u5e8f\u53f7) \u4e24\u79cd\u65b9\u5f0f\u6765\u6307\u5b9a\u3002"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"weight"}),": Pod \u4f18\u5148\u7ea7\u662f\u7531\u6240\u6709 weights \u5217\u8868\u4e2d\u7684 term \u6765\u8ba1\u7b97 match selector \u5f97\u51fa\u3002\u5982\u4e0b\uff1a"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          weightPriority:\n          - weight: 50\n            matchSelector:\n              matchLabels:\n                test-key: foo\n          - weight: 30\n            matchSelector:\n              matchLabels:\n                test-key: bar\n"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"order"}),': Pod \u4f18\u5148\u7ea7\u662f\u7531 orderKey \u7684 value \u51b3\u5b9a\uff0c\u8fd9\u91cc\u8981\u6c42\u5bf9\u5e94\u7684 value \u7684\u7ed3\u5c3e\u80fd\u89e3\u6790\u4e3a int \u503c\u3002\u6bd4\u5982 value "5" \u7684\u4f18\u5148\u7ea7\u662f 5\uff0cvalue "sts-10" \u7684\u4f18\u5148\u7ea7\u662f 10\u3002']}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          orderPriority:\n          - orderedKey: some-label-key\n"})}),"\n",(0,l.jsx)(n.h3,{id:"maxunavailable-\u6700\u5927\u4e0d\u53ef\u7528",children:"MaxUnavailable \u6700\u5927\u4e0d\u53ef\u7528"}),"\n",(0,l.jsxs)(n.p,{children:["Advanced StatefulSet \u5728 ",(0,l.jsx)(n.code,{children:"RollingUpdateStatefulSetStrategy"})," \u4e2d\u65b0\u589e\u4e86 ",(0,l.jsx)(n.code,{children:"maxUnavailable"})," \u7b56\u7565\u6765\u652f\u6301\u5e76\u884c Pod \u53d1\u5e03\uff0c\u5b83\u4f1a\u4fdd\u8bc1\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u6700\u591a\u6709\u591a\u5c11\u4e2a Pod \u5904\u4e8e\u4e0d\u53ef\u7528\u72b6\u6001\u3002\u6ce8\u610f\uff0c",(0,l.jsx)(n.code,{children:"maxUnavailable"})," \u53ea\u80fd\u914d\u5408 podManagementPolicy \u4e3a ",(0,l.jsx)(n.code,{children:"Parallel"})," \u6765\u4f7f\u7528\u3002"]}),"\n",(0,l.jsxs)(n.p,{children:["\u8fd9\u4e2a\u7b56\u7565\u7684\u6548\u679c\u548c ",(0,l.jsx)(n.code,{children:"Deployment"})," \u4e2d\u7684\u7c7b\u4f3c\uff0c\u4f46\u662f\u53ef\u80fd\u4f1a\u5bfc\u81f4\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u7684 order \u987a\u5e8f\u4e0d\u80fd\u4e25\u683c\u4fdd\u8bc1\u3002\n\u5982\u679c\u4e0d\u914d\u7f6e ",(0,l.jsx)(n.code,{children:"maxUnavailable"}),"\uff0c\u5b83\u7684\u9ed8\u8ba4\u503c\u4e3a 1\uff0c\u4e5f\u5c31\u662f\u548c\u539f\u751f ",(0,l.jsx)(n.code,{children:"StatefulSet"})," \u4e00\u6837\u53ea\u80fd one by one \u4e32\u884c\u53d1\u5e03 Pod\uff0c\u5373\u4f7f\u628a podManagementPolicy \u914d\u7f6e\u4e3a ",(0,l.jsx)(n.code,{children:"Parallel"})," \u4e5f\u662f\u8fd9\u6837\u3002"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 20%\n"})}),"\n",(0,l.jsx)(n.p,{children:"\u6bd4\u5982\u8bf4\uff0c\u4e00\u4e2a Advanced StatefulSet \u4e0b\u9762\u6709 P0 \u5230 P4 \u4e94\u4e2a Pod\uff0c\u5e76\u4e14\u5e94\u7528\u80fd\u5bb9\u5fcd 3 \u4e2a\u526f\u672c\u4e0d\u53ef\u7528\u3002\n\u5f53\u6211\u4eec\u628a StatefulSet \u91cc\u7684 Pod \u5347\u7ea7\u7248\u672c\u7684\u65f6\u5019\uff0c\u53ef\u4ee5\u901a\u8fc7\u4ee5\u4e0b\u6b65\u9aa4\u6765\u505a\uff1a"}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsxs)(n.li,{children:["\u8bbe\u7f6e ",(0,l.jsx)(n.code,{children:"maxUnavailable=3"})]}),"\n",(0,l.jsxs)(n.li,{children:["(\u53ef\u9009) \u5982\u679c\u9700\u8981\u7070\u5ea6\u5347\u7ea7\uff0c\u8bbe\u7f6e ",(0,l.jsx)(n.code,{children:"partition=4"}),"\u3002Partition \u9ed8\u8ba4\u7684\u610f\u601d\u662f order \u5927\u4e8e\u7b49\u4e8e\u8fd9\u4e2a\u6570\u503c\u7684 Pod \u624d\u4f1a\u66f4\u65b0\uff0c\u5728\u8fd9\u91cc\u5c31\u53ea\u4f1a\u66f4\u65b0 P4\uff0c\u5373\u4f7f\u6211\u4eec\u8bbe\u7f6e\u4e86 ",(0,l.jsx)(n.code,{children:"maxUnavailable=3"}),"\u3002"]}),"\n",(0,l.jsxs)(n.li,{children:["\u5728 P4 \u5347\u7ea7\u5b8c\u6210\u540e\uff0c\u628a ",(0,l.jsx)(n.code,{children:"partition"})," \u8c03\u6574\u4e3a 0\u3002\u6b64\u65f6\uff0c\u63a7\u5236\u5668\u4f1a\u540c\u65f6\u5347\u7ea7 P1\u3001P2\u3001P3 \u4e09\u4e2a Pod\u3002\u6ce8\u610f\uff0c\u5982\u679c\u662f\u539f\u751f ",(0,l.jsx)(n.code,{children:"StatefulSet"}),"\uff0c\u53ea\u80fd\u4e32\u884c\u5347\u7ea7 P3\u3001P2\u3001P1\u3002"]}),"\n",(0,l.jsx)(n.li,{children:"\u4e00\u65e6\u8fd9\u4e09\u4e2a Pod \u4e2d\u6709\u4e00\u4e2a\u5347\u7ea7\u5b8c\u6210\u4e86\uff0c\u63a7\u5236\u5668\u4f1a\u7acb\u5373\u5f00\u59cb\u5347\u7ea7 P0\u3002"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"\u53d1\u5e03\u6682\u505c",children:"\u53d1\u5e03\u6682\u505c"}),"\n",(0,l.jsx)(n.p,{children:"\u7528\u6237\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e paused \u4e3a true \u6682\u505c\u53d1\u5e03\uff0c\u4e0d\u8fc7\u63a7\u5236\u5668\u8fd8\u662f\u4f1a\u505a replicas \u6570\u91cf\u7ba1\u7406\uff1a"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n"})}),"\n",(0,l.jsx)(n.h2,{id:"\u751f\u547d\u5468\u671f\u94a9\u5b50",children:"\u751f\u547d\u5468\u671f\u94a9\u5b50"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.8.0"]}),"\n",(0,l.jsxs)(n.p,{children:["\u4e0e ",(0,l.jsx)(n.a,{href:"./cloneset#lifecycle-hook",children:"CloneSet \u63d0\u4f9b\u7684\u751f\u547d\u5468\u671f\u94a9\u5b50"})," \u80fd\u529b\u76f8\u4f3c\u3002"]})]})}function p(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}}}]);
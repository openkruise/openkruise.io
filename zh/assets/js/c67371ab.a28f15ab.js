"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7119],{7868:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/architecture-08f2cb3a5b19c102412f9df77b365eef.png"},28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>c});var r=s(96540);const i={},o=r.createContext(i);function t(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),r.createElement(o.Provider,{value:n},e.children)}},81640:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>u,frontMatter:()=>t,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"core-concepts/architecture","title":"\u7cfb\u7edf\u67b6\u6784","description":"OpenKruise \u7684\u6574\u4f53\u67b6\u6784\u5982\u4e0b:","source":"@site/i18n/zh/docusaurus-plugin-content-docs/current/core-concepts/architecture.md","sourceDirName":"core-concepts","slug":"/core-concepts/architecture","permalink":"/zh/docs/next/core-concepts/architecture","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/core-concepts/architecture.md","tags":[],"version":"current","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"\u7cfb\u7edf\u67b6\u6784"},"sidebar":"docs","previous":{"title":"\u5b89\u88c5","permalink":"/zh/docs/next/installation"},"next":{"title":"\u539f\u5730\u5347\u7ea7","permalink":"/zh/docs/next/core-concepts/inplace-update"}}');var i=s(74848),o=s(28453);const t={title:"\u7cfb\u7edf\u67b6\u6784"},c=void 0,a={},l=[{value:"API",id:"api",level:2},{value:"Manager",id:"manager",level:2},{value:"Daemon",id:"daemon",level:2}];function d(e){const n={code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"OpenKruise \u7684\u6574\u4f53\u67b6\u6784\u5982\u4e0b:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"alt",src:s(7868).A+"",width:"3709",height:"1659"})}),"\n",(0,i.jsx)(n.h2,{id:"api",children:"API"}),"\n",(0,i.jsxs)(n.p,{children:["\u6240\u6709 OpenKruise \u7684\u529f\u80fd\u90fd\u662f\u901a\u8fc7 ",(0,i.jsx)(n.strong,{children:"Kubernetes API"})," \u6765\u63d0\u4f9b, \u6bd4\u5982\uff1a"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u65b0\u7684 CRD \u5b9a\u4e49\uff0c\u6bd4\u5982"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",metastring:"script",children:"$ kubectl get crd | grep kruise.io\nadvancedcronjobs.apps.kruise.io            2021-09-16T06:02:36Z\nbroadcastjobs.apps.kruise.io               2021-09-16T06:02:36Z\nclonesets.apps.kruise.io                   2021-09-16T06:02:36Z\ncontainerrecreaterequests.apps.kruise.io   2021-09-16T06:02:36Z\ndaemonsets.apps.kruise.io                  2021-09-16T06:02:36Z\nimagepulljobs.apps.kruise.io               2021-09-16T06:02:36Z\nnodeimages.apps.kruise.io                  2021-09-16T06:02:36Z\npodunavailablebudgets.policy.kruise.io     2021-09-16T06:02:36Z\nresourcedistributions.apps.kruise.io       2021-09-16T06:02:36Z\nsidecarsets.apps.kruise.io                 2021-09-16T06:02:36Z\nstatefulsets.apps.kruise.io                2021-09-16T06:02:36Z\nuniteddeployments.apps.kruise.io           2021-09-16T06:02:37Z\nworkloadspreads.apps.kruise.io             2021-09-16T06:02:37Z\n# ...\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u8d44\u6e90\u5bf9\u8c61\u4e2d\u7684\u7279\u5b9a\u6807\u8bc6\uff08labels, annotations, envs \u7b49\uff09\uff0c\u6bd4\u5982"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Namespace\nmetadata:\n  labels:\n    # \u4fdd\u62a4\u8fd9\u4e2a namespace \u4e0b\u7684 Pod \u4e0d\u88ab\u6574\u4e2a ns \u7ea7\u8054\u5220\u9664\n    policy.kruise.io/delete-protection: Cascading\n"})}),"\n",(0,i.jsx)(n.h2,{id:"manager",children:"Manager"}),"\n",(0,i.jsxs)(n.p,{children:["Kruise-manager \u662f\u4e00\u4e2a\u8fd0\u884c controller \u548c webhook \u4e2d\u5fc3\u7ec4\u4ef6\uff0c\u5b83\u901a\u8fc7 Deployment \u90e8\u7f72\u5728 ",(0,i.jsx)(n.code,{children:"kruise-system"})," \u547d\u540d\u7a7a\u95f4\u4e2d\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get deploy -n kruise-system\nNAME                        READY   UP-TO-DATE   AVAILABLE   AGE\nkruise-controller-manager   2/2     2            2           4h6m\n\n$ kubectl get pod -n kruise-system -l control-plane=controller-manager\nNAME                                         READY   STATUS    RESTARTS   AGE\nkruise-controller-manager-68dc6d87cc-k9vg8   1/1     Running   0          4h6m\nkruise-controller-manager-68dc6d87cc-w7x82   1/1     Running   0          4h6m\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u903b\u8f91\u4e0a\u6765\u8bf4\uff0c\u5982 cloneset-controller/sidecarset-controller \u8fd9\u4e9b\u7684 controller \u90fd\u662f\u72ec\u7acb\u8fd0\u884c\u7684\u3002\u4e0d\u8fc7\u4e3a\u4e86\u51cf\u5c11\u590d\u6742\u5ea6\uff0c\u5b83\u4eec\u90fd\u88ab\u6253\u5305\u5728\u4e00\u4e2a\u72ec\u7acb\u7684\u4e8c\u8fdb\u5236\u6587\u4ef6\u3001\u5e76\u8fd0\u884c\u5728 ",(0,i.jsx)(n.code,{children:"kruise-controller-manager-xxx"})," \u8fd9\u4e2a Pod \u4e2d\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u9664\u4e86 controller \u4e4b\u5916\uff0c",(0,i.jsx)(n.code,{children:"kruise-controller-manager-xxx"})," \u4e2d\u8fd8\u5305\u542b\u4e86\u9488\u5bf9 Kruise CRD \u4ee5\u53ca Pod \u8d44\u6e90\u7684 admission webhook\u3002Kruise-manager \u4f1a\u521b\u5efa\u4e00\u4e9b webhook configurations \u6765\u914d\u7f6e\u54ea\u4e9b\u8d44\u6e90\u9700\u8981\u611f\u77e5\u5904\u7406\u3001\u4ee5\u53ca\u63d0\u4f9b\u4e00\u4e2a Service \u6765\u7ed9 kube-apiserver \u8c03\u7528\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get svc -n kruise-system\nNAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\nkruise-webhook-service   ClusterIP   172.24.9.234   <none>        443/TCP   4h9m\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u4e0a\u8ff0\u7684 ",(0,i.jsx)(n.code,{children:"kruise-webhook-service"})," \u975e\u5e38\u91cd\u8981\uff0c\u662f\u63d0\u4f9b\u7ed9 kube-apiserver \u8c03\u7528\u7684\u3002"]}),"\n",(0,i.jsx)(n.h2,{id:"daemon",children:"Daemon"}),"\n",(0,i.jsx)(n.p,{children:"\u8fd9\u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684\u4e00\u4e2a\u65b0\u7684 daemon \u7ec4\u4ef6\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u5b83\u901a\u8fc7 DaemonSet \u90e8\u7f72\u5230\u6bcf\u4e2a Node \u8282\u70b9\u4e0a\uff0c\u63d0\u4f9b\u955c\u50cf\u9884\u70ed\u3001\u5bb9\u5668\u91cd\u542f\u7b49\u529f\u80fd\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get pod -n kruise-system -l control-plane=daemon\nNAME                  READY   STATUS    RESTARTS   AGE\nkruise-daemon-6hw6d   1/1     Running   0          4h7m\nkruise-daemon-d7xr4   1/1     Running   0          4h7m\nkruise-daemon-dqp8z   1/1     Running   0          4h7m\nkruise-daemon-dv96r   1/1     Running   0          4h7m\nkruise-daemon-q7594   1/1     Running   0          4h7m\nkruise-daemon-vnsbw   1/1     Running   0          4h7m\n"})})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);
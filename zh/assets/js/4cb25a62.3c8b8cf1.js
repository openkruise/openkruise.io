"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1402],{28453:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>c});var i=s(96540);const t={},r=i.createContext(t);function d(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),i.createElement(r.Provider,{value:n},e.children)}},56246:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>d,metadata:()=>i,toc:()=>o});const i=JSON.parse('{"id":"user-manuals/deletionprotection","title":"Deletion Protection","description":"FEATURE STATE: Kruise v0.9.0","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.6/user-manuals/deletionprotection.md","sourceDirName":"user-manuals","slug":"/user-manuals/deletionprotection","permalink":"/zh/docs/v1.6/user-manuals/deletionprotection","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/deletionprotection.md","tags":[],"version":"v1.6","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"Deletion Protection"},"sidebar":"docs","previous":{"title":"PodProbeMarker","permalink":"/zh/docs/v1.6/user-manuals/podprobemarker"},"next":{"title":"PodUnavailableBudget","permalink":"/zh/docs/v1.6/user-manuals/podunavailablebudget"}}');var t=s(74848),r=s(28453);const d={title:"Deletion Protection"},c=void 0,l={},o=[{value:"\u4f7f\u7528\u65b9\u5f0f",id:"\u4f7f\u7528\u65b9\u5f0f",level:2},{value:"\u652f\u6301 Service\u3001Ingress \u8d44\u6e90",id:"\u652f\u6301-serviceingress-\u8d44\u6e90",level:2},{value:"\u98ce\u9669",id:"\u98ce\u9669",level:2}];function a(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.9.0"]}),"\n",(0,t.jsx)(n.p,{children:"\u8be5\u529f\u80fd\u63d0\u4f9b\u4e86\u4e00\u4e2a\u5b89\u5168\u7b56\u7565\uff0c\u7528\u6765\u5728 Kubernetes \u7ea7\u8054\u5220\u9664\u7684\u673a\u5236\u4e0b\u4fdd\u62a4\u7528\u6237\u7684\u8d44\u6e90\u548c\u5e94\u7528\u53ef\u7528\u6027\u3002"}),"\n",(0,t.jsx)(n.h2,{id:"\u4f7f\u7528\u65b9\u5f0f",children:"\u4f7f\u7528\u65b9\u5f0f"}),"\n",(0,t.jsxs)(n.p,{children:["\u9996\u5148\uff0c\u9700\u8981\u5728",(0,t.jsx)(n.a,{href:"../installation##optional-feature-gate",children:"\u5b89\u88c5\u6216\u5347\u7ea7 Kruise"})," \u7684\u65f6\u5019\u542f\u7528 ",(0,t.jsx)(n.code,{children:"ResourcesDeletionProtection"})," feature-gate\u3002"]}),"\n",(0,t.jsxs)(n.p,{children:["\u7136\u540e\uff0c\u7528\u6237\u53ef\u4ee5\u7ed9\u4e00\u4e9b\u7279\u5b9a\u8d44\u6e90\u5bf9\u8c61\u52a0\u4e0a ",(0,t.jsx)(n.code,{children:"policy.kruise.io/delete-protection"})," \u6807\u7b7e\uff0c\u503c\u53ef\u4ee5\u662f\uff1a"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Always"}),": \u8fd9\u4e2a\u5bf9\u8c61\u7981\u6b62\u88ab\u5220\u9664\uff0c\u9664\u975e\u4e0a\u8ff0 label \u88ab\u53bb\u6389"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Cascading"}),": \u8fd9\u4e2a\u5bf9\u8c61\u5982\u679c\u8fd8\u6709\u53ef\u7528\u7684\u4e0b\u5c5e\u8d44\u6e90\uff0c\u5219\u7981\u6b62\u88ab\u5220\u9664"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u76ee\u524d\u652f\u6301\u7684\u8d44\u6e90\u7c7b\u578b\u3001\u4ee5\u53ca cascading \u7ea7\u8054\u5173\u7cfb\u5982\u4e0b\uff1a"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Kind"}),(0,t.jsx)(n.th,{children:"Group"}),(0,t.jsx)(n.th,{children:"Version"}),(0,t.jsxs)(n.th,{children:[(0,t.jsx)(n.strong,{children:"Cascading"})," judgement"]})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"Namespace"})}),(0,t.jsx)(n.td,{children:"core"}),(0,t.jsx)(n.td,{children:"v1"}),(0,t.jsx)(n.td,{children:"namespace \u4e0b\u662f\u5426\u8fd8\u6709\u6b63\u5e38\u7684 Pod"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"CustomResourceDefinition"})}),(0,t.jsx)(n.td,{children:"apiextensions.k8s.io"}),(0,t.jsx)(n.td,{children:"v1beta1, v1"}),(0,t.jsx)(n.td,{children:"CRD \u4e0b\u662f\u5426\u8fd8\u6709\u5b58\u91cf\u7684 CR"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"Deployment"})}),(0,t.jsx)(n.td,{children:"apps"}),(0,t.jsx)(n.td,{children:"v1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"StatefulSet"})}),(0,t.jsx)(n.td,{children:"apps"}),(0,t.jsx)(n.td,{children:"v1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"ReplicaSet"})}),(0,t.jsx)(n.td,{children:"apps"}),(0,t.jsx)(n.td,{children:"v1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"CloneSet"})}),(0,t.jsx)(n.td,{children:"apps.kruise.io"}),(0,t.jsx)(n.td,{children:"v1alpha1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"StatefulSet"})}),(0,t.jsx)(n.td,{children:"apps.kruise.io"}),(0,t.jsx)(n.td,{children:"v1alpha1, v1beta1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"UnitedDeployment"})}),(0,t.jsx)(n.td,{children:"apps.kruise.io"}),(0,t.jsx)(n.td,{children:"v1alpha1"}),(0,t.jsx)(n.td,{children:"replicas \u662f\u5426\u4e3a 0"})]})]})]}),"\n",(0,t.jsx)(n.h2,{id:"\u652f\u6301-serviceingress-\u8d44\u6e90",children:"\u652f\u6301 Service\u3001Ingress \u8d44\u6e90"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,t.jsx)(n.p,{children:"Kruise \u652f\u6301 Service \u548c Ingress \u8d44\u6e90 'Always' \u65b9\u5f0f\u7684\u5220\u9664\u4fdd\u62a4\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Service\nmetadata:\n  labels:\n    policy.kruise.io/delete-protection: Always\n  name: test-web\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u98ce\u9669",children:"\u98ce\u9669"}),"\n",(0,t.jsxs)(n.p,{children:["\u901a\u8fc7 ",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#webhook-configuration",children:"webhook configuration"})," \u7684 ",(0,t.jsx)(n.code,{children:"objectSelector"})," \u5b57\u6bb5\uff0c\nKruise webhook \u53ea\u4f1a\u62e6\u622a\u5904\u7406\u5e26\u6709 ",(0,t.jsx)(n.code,{children:"policy.kruise.io/delete-protection"})," \u6807\u7b7e\u7684 ",(0,t.jsx)(n.code,{children:"Namespace/CustomResourceDefinition/Deployment/StatefulSet/ReplicaSet"})," \u8d44\u6e90\u3002"]}),"\n",(0,t.jsxs)(n.p,{children:["\u56e0\u6b64\uff0c\u5982\u679c\u6240\u6709 kruise-manager pod \u90fd\u6302\u4e86\u6216\u8005\u5904\u4e8e\u5f02\u5e38\u7684\u72b6\u6001\uff0ckube-apiserver \u8c03\u7528 deletion webhook \u5931\u8d25\uff0c\n\u53ea\u6709\u5e26\u6709 ",(0,t.jsx)(n.code,{children:"policy.kruise.io/delete-protection"})," \u6807\u7b7e\u7684\u4e0a\u8ff0\u8d44\u6e90\u624d\u4f1a\u6682\u65f6\u65e0\u6cd5\u5220\u9664\u3002"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}}}]);
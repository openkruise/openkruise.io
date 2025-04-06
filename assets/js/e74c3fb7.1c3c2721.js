"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4106],{28453:(e,s,t)=>{t.d(s,{R:()=>d,x:()=>l});var i=t(96540);const n={},r=i.createContext(n);function d(e){const s=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),i.createElement(r.Provider,{value:s},e.children)}},96613:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>d,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"user-manuals/deletionprotection","title":"Deletion Protection","description":"FEATURE STATE: Kruise v0.9.0","source":"@site/versioned_docs/version-v1.7/user-manuals/deletionprotection.md","sourceDirName":"user-manuals","slug":"/user-manuals/deletionprotection","permalink":"/docs/v1.7/user-manuals/deletionprotection","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/deletionprotection.md","tags":[],"version":"v1.7","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{"title":"Deletion Protection"},"sidebar":"docs","previous":{"title":"PodProbeMarker","permalink":"/docs/v1.7/user-manuals/podprobemarker"},"next":{"title":"PodUnavailableBudget","permalink":"/docs/v1.7/user-manuals/podunavailablebudget"}}');var n=t(74848),r=t(28453);const d={title:"Deletion Protection"},l=void 0,o={},c=[{value:"Usage",id:"usage",level:2},{value:"Deletion Protection of service and ingress",id:"deletion-protection-of-service-and-ingress",level:2},{value:"Risk",id:"risk",level:2}];function a(e){const s={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"FEATURE STATE:"})," Kruise v0.9.0"]}),"\n",(0,n.jsx)(s.p,{children:"This feature provides a safety policy which could help users protect Kubernetes resources and\napplications' availability from the cascading deletion mechanism."}),"\n",(0,n.jsx)(s.h2,{id:"usage",children:"Usage"}),"\n",(0,n.jsxs)(s.p,{children:["Firstly, users have to enable the ",(0,n.jsx)(s.code,{children:"ResourcesDeletionProtection"})," feature-gate during ",(0,n.jsx)(s.a,{href:"../installation#optional-feature-gate",children:"Kruise installation or upgrade"}),"."]}),"\n",(0,n.jsxs)(s.p,{children:["Then, users can add the label named ",(0,n.jsx)(s.code,{children:"policy.kruise.io/delete-protection"})," to some specific resources. The values can be:"]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"Always"}),": this object will always be forbidden to be deleted, unless the label is removed"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"Cascading"}),": this object will be forbidden to be deleted, if it has active resources owned"]}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"The resources supported and the cascading judgement relationship:"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Kind"}),(0,n.jsx)(s.th,{children:"Group"}),(0,n.jsx)(s.th,{children:"Version"}),(0,n.jsxs)(s.th,{children:[(0,n.jsx)(s.strong,{children:"Cascading"})," judgement"]})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"Namespace"})}),(0,n.jsx)(s.td,{children:"core"}),(0,n.jsx)(s.td,{children:"v1"}),(0,n.jsx)(s.td,{children:"whether there is active Pods in this namespace"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"CustomResourceDefinition"})}),(0,n.jsx)(s.td,{children:"apiextensions.k8s.io"}),(0,n.jsx)(s.td,{children:"v1beta1, v1"}),(0,n.jsx)(s.td,{children:"whether there is existing CRs of this CRD"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"Deployment"})}),(0,n.jsx)(s.td,{children:"apps"}),(0,n.jsx)(s.td,{children:"v1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"StatefulSet"})}),(0,n.jsx)(s.td,{children:"apps"}),(0,n.jsx)(s.td,{children:"v1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"ReplicaSet"})}),(0,n.jsx)(s.td,{children:"apps"}),(0,n.jsx)(s.td,{children:"v1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"CloneSet"})}),(0,n.jsx)(s.td,{children:"apps.kruise.io"}),(0,n.jsx)(s.td,{children:"v1alpha1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"StatefulSet"})}),(0,n.jsx)(s.td,{children:"apps.kruise.io"}),(0,n.jsx)(s.td,{children:"v1alpha1, v1beta1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"UnitedDeployment"})}),(0,n.jsx)(s.td,{children:"apps.kruise.io"}),(0,n.jsx)(s.td,{children:"v1alpha1"}),(0,n.jsx)(s.td,{children:"whether the replicas is 0"})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"deletion-protection-of-service-and-ingress",children:"Deletion Protection of service and ingress"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,n.jsxs)(s.p,{children:["Kruise support the deletion protection of service and ingress resources, the strategy only supports ",(0,n.jsx)(s.code,{children:"Always"}),", for example:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Service\nmetadata:\n  labels:\n    policy.kruise.io/delete-protection: Always\n  name: test-web\n"})}),"\n",(0,n.jsx)(s.h2,{id:"risk",children:"Risk"}),"\n",(0,n.jsxs)(s.p,{children:["Using ",(0,n.jsx)(s.code,{children:"objectSelector"})," in ",(0,n.jsx)(s.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#webhook-configuration",children:"webhook configuration"}),",\nKruise webhook will only handle those ",(0,n.jsx)(s.code,{children:"Namespace/CustomResourceDefinition/Deployment/StatefulSet/ReplicaSet"})," resources with ",(0,n.jsx)(s.code,{children:"policy.kruise.io/delete-protection"})," label."]}),"\n",(0,n.jsxs)(s.p,{children:["So, if all kruise-manager Pods are crashed or in other abnormal states, kube-apiserver fails to call the deletion webhook,\nonly the resources with ",(0,n.jsx)(s.code,{children:"policy.kruise.io/delete-protection"})," label can not be deleted temporarily."]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}}}]);
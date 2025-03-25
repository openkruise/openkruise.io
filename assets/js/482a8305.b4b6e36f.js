"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6702],{28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>r});var s=t(96540);const o={},a=s.createContext(o);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:n},e.children)}},74416:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"best-practices/hpa-configuration","title":"HPA configuration","description":"Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,","source":"@site/versioned_docs/version-v1.7/best-practices/hpa-configuration.md","sourceDirName":"best-practices","slug":"/best-practices/hpa-configuration","permalink":"/docs/best-practices/hpa-configuration","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/hpa-configuration.md","tags":[],"version":"v1.7","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{"title":"HPA configuration"},"sidebar":"docs","previous":{"title":"PodUnavailableBudget","permalink":"/docs/user-manuals/podunavailablebudget"},"next":{"title":"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download","permalink":"/docs/best-practices/ci-pipeline-image-predownload"}}');var o=t(74848),a=t(28453);const i={title:"HPA configuration"},r=void 0,c={},l=[{value:"Example",id:"example",level:3}];function d(e){const n={code:"code",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,\nwhich means they allow systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with these resources."}),"\n",(0,o.jsx)(n.h3,{id:"example",children:"Example"}),"\n",(0,o.jsxs)(n.p,{children:["Just set the CloneSet's type and name into ",(0,o.jsx)(n.code,{children:"scaleTargetRef"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: autoscaling/v2beta2\nkind: HorizontalPodAutoscaler\n# ...\nspec:\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: your-cloneset-name\n"})}),"\n",(0,o.jsx)(n.p,{children:"Note that:"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"The HPA's namespace should be same as the namespace of your CloneSet."}),"\n",(0,o.jsxs)(n.li,{children:["The ",(0,o.jsx)(n.code,{children:"apiVersion"})," in ",(0,o.jsx)(n.code,{children:"scaleTargetRef"})," should be same as the ",(0,o.jsx)(n.code,{children:"apiVersion"})," in your workload resource, such as ",(0,o.jsx)(n.code,{children:"apps.kruise.io/v1alpha1"})," or ",(0,o.jsx)(n.code,{children:"apps.kruise.io/v1beta1"}),".\nIt depends on which version you are using for those workloads that have multiple versions, such as Advanced StatefulSet."]}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}}}]);
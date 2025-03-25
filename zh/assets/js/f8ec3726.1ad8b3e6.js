"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7819],{28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>r});var o=t(96540);const s={},i=o.createContext(s);function a(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),o.createElement(i.Provider,{value:n},e.children)}},77710:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"best-practices/hpa-configuration","title":"HPA configuration","description":"Kruise \u4e2d\u7684 Workload\uff0c\u6bd4\u5982 CloneSet\u3001Advanced StatefulSet\u3001UnitedDeployment\uff0c\u90fd\u5b9e\u73b0\u4e86 scale subresource\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.6/best-practices/hpa-configuration.md","sourceDirName":"best-practices","slug":"/best-practices/hpa-configuration","permalink":"/zh/docs/v1.6/best-practices/hpa-configuration","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/hpa-configuration.md","tags":[],"version":"v1.6","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"HPA configuration"},"sidebar":"docs","previous":{"title":"PodUnavailableBudget","permalink":"/zh/docs/v1.6/user-manuals/podunavailablebudget"},"next":{"title":"\u4e91\u539f\u751fDevops\u6700\u4f73\u5b9e\u8df5\uff081\uff09\uff1a\u6301\u7eed\u96c6\u6210\uff08CI\uff09+ OpenKruise\u955c\u50cf\u9884\u70ed","permalink":"/zh/docs/v1.6/best-practices/ci-pipeline-image-predownload"}}');var s=t(74848),i=t(28453);const a={title:"HPA configuration"},r=void 0,c={},l=[{value:"\u4f8b\u5b50",id:"\u4f8b\u5b50",level:3}];function d(e){const n={code:"code",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Kruise \u4e2d\u7684 Workload\uff0c\u6bd4\u5982 CloneSet\u3001Advanced StatefulSet\u3001UnitedDeployment\uff0c\u90fd\u5b9e\u73b0\u4e86 scale subresource\u3002\n\u8fd9\u8868\u793a\u5b83\u4eec\u90fd\u53ef\u4ee5\u9002\u914d HorizontalPodAutoscaler\u3001PodDisruptionBudget \u7b49\u539f\u751f\u64cd\u4f5c\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"\u4f8b\u5b50",children:"\u4f8b\u5b50"}),"\n",(0,s.jsxs)(n.p,{children:["\u53ea\u9700\u8981\u5c06 CloneSet \u7684\u7c7b\u578b\u3001\u540d\u5b57\u5199\u5165 ",(0,s.jsx)(n.code,{children:"scaleTargetRef"})," \u5373\u53ef\uff1a"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: autoscaling/v2beta2\nkind: HorizontalPodAutoscaler\n# ...\nspec:\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: your-cloneset-name\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u6ce8\u610f\uff1a"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"HPA \u7684 namespace \u9700\u8981\u548c\u4f60\u7684 CloneSet \u76f8\u540c\u3002"}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"scaleTargetRef"})," \u4e2d\u7684 ",(0,s.jsx)(n.code,{children:"apiVersion"})," \u9700\u8981\u548c\u4f60\u7684 workload \u4e2d\u7684\u76f8\u540c\uff0c\u6bd4\u5982 ",(0,s.jsx)(n.code,{children:"apps.kruise.io/v1alpha1"})," \u6216 ",(0,s.jsx)(n.code,{children:"apps.kruise.io/v1beta1"}),"\u3002\n\u5bf9\u4e8e Advanced StatefulSet \u8fd9\u79cd\u5b58\u5728\u591a\u4e2a\u7248\u672c\u7684 workload\uff0c\u5b83\u53d6\u51b3\u4e8e\u4f60\u6240\u4f7f\u7528\u7684\u7248\u672c\u3002"]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
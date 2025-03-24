"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8305],{28453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>o});var s=t(96540);const r={},a=s.createContext(r);function l(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),s.createElement(a.Provider,{value:n},e.children)}},29578:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"user-manuals/strategy-multi-batch-update","title":"\u591a\u6279\u6b21\u53d1\u5e03","description":"\u591a\u6279\u6b21\u7b56\u7565\u6d41\u7a0b","source":"@site/i18n/zh/docusaurus-plugin-content-docs-rollouts/current/user-manuals/strategy-multi-batch-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-multi-batch-update","permalink":"/zh/rollouts/user-manuals/strategy-multi-batch-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"\u91d1\u4e1d\u96c0\u53d1\u5e03","permalink":"/zh/rollouts/user-manuals/strategy-canary-update"},"next":{"title":"\u84dd\u7eff\u53d1\u5e03","permalink":"/zh/rollouts/user-manuals/strategy-bluegreen-update"}}');var r=t(74848),a=t(28453);const l={},o="\u591a\u6279\u6b21\u53d1\u5e03",d={},c=[{value:"\u591a\u6279\u6b21\u7b56\u7565\u6d41\u7a0b",id:"\u591a\u6279\u6b21\u7b56\u7565\u6d41\u7a0b",level:2},{value:"\u63a8\u8350\u914d\u7f6e",id:"\u63a8\u8350\u914d\u7f6e",level:2},{value:"\u884c\u4e3a\u89e3\u91ca",id:"\u884c\u4e3a\u89e3\u91ca",level:3}];function i(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u591a\u6279\u6b21\u53d1\u5e03",children:"\u591a\u6279\u6b21\u53d1\u5e03"})}),"\n",(0,r.jsx)(n.h2,{id:"\u591a\u6279\u6b21\u7b56\u7565\u6d41\u7a0b",children:"\u591a\u6279\u6b21\u7b56\u7565\u6d41\u7a0b"}),"\n",(0,r.jsx)(n.p,{children:"\u5206\u6279\u53d1\u5e03\u662f\u4e00\u79cd\u7279\u6b8a\u7684\u91d1\u4e1d\u96c0\u53d1\u5e03\uff0c\u8fd9\u79cd\u91d1\u4e1d\u96c0\u53d1\u5e03\u4e0d\u9700\u8981\u521b\u5efa\u989d\u5916\u7684\u5de5\u4f5c\u8d1f\u8f7d\u3002\u5206\u6279\u53d1\u5e03\u4e00\u822c\u7528\u4e8e\u8fdc\u5927\u4e8e1\u4e2a\u5b9e\u4f8b\u7684\u5e94\u7528\u53d1\u5e03\u4e2d\uff0c\u5e76\u4e14\u901a\u5e38\u4e0d\u7528\u6d41\u91cf\u8c03\u5ea6\u914d\u5408\u7070\u5ea6\u3002"}),"\n",(0,r.jsx)("center",{children:(0,r.jsx)("img",{src:t(40615).A,width:"90%"})}),"\n",(0,r.jsx)(n.h2,{id:"\u63a8\u8350\u914d\u7f6e",children:"\u63a8\u8350\u914d\u7f6e"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u6ce8\u610f\uff1a\u76ee\u524d\uff0c\u591a\u6279\u6b21\u7b56\u7565\u53ef\u7528\u4e8eCloneSet\u3001StatefulSet\u3001Advanced StatefulSet\u548cDeployment\u3002"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-YAML",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: workload-demo\n  strategy:\n    canary:\n      enableExtraWorkloadForCanary: false\n      steps:\n      - replicas: 1\n      - replicas: 50%\n      - replicas: 100%\n"})}),"\n",(0,r.jsx)(n.h3,{id:"\u884c\u4e3a\u89e3\u91ca",children:"\u884c\u4e3a\u89e3\u91ca"}),"\n",(0,r.jsxs)(n.p,{children:["\u5f53\u60a8\u4e3a",(0,r.jsx)(n.code,{children:"workload-demo"}),"\u5e94\u7528\u65b0\u4fee\u8ba2\u7248\u672c\u65f6\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u5728\u7b2c\u4e00\u6279\u4e2d\uff0c\u5c06\u66f4\u65b0",(0,r.jsx)(n.code,{children:"1"}),"\u4e2aPod\uff0c\u800c",(0,r.jsx)(n.code,{children:"replicas-1"}),"\u4e2aPod\u4ecd\u7136\u4fdd\u6301\u5728\u7a33\u5b9a\u7248\u672c\uff0c\u9700\u8981\u624b\u52a8\u786e\u8ba4\u5230\u4e0b\u4e00\u6279\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5728\u7b2c\u4e8c\u6279\u4e2d\uff0c\u5c06\u66f4\u65b0",(0,r.jsx)(n.code,{children:"50%"}),"\u7684Pod\uff0c\u800c",(0,r.jsx)(n.code,{children:"50%"}),"\u7684Pod\u4ecd\u7136\u4fdd\u6301\u5728\u7a33\u5b9a\u7248\u672c\uff0c\u9700\u8981\u624b\u52a8\u786e\u8ba4\u5230\u4e0b\u4e00\u6279\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5728\u7b2c\u4e09\u6279\u4e2d\uff0c\u5c06\u66f4\u65b0",(0,r.jsx)(n.code,{children:"100%"}),"\u7684Pod\uff0c\u800c",(0,r.jsx)(n.code,{children:"0"}),"\u4e2aPod\u4ecd\u7136\u4fdd\u6301\u5728\u7a33\u5b9a\u7248\u672c\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u4e0e",(0,r.jsx)(n.a,{href:"/zh/rollouts/user-manuals/strategy-canary-update",children:"\u91d1\u4e1d\u96c0\u53d1\u5e03\u7b56\u7565"}),"\u4e0d\u540c\uff0c",(0,r.jsx)(n.strong,{children:"\u5728\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u4e0d\u4f1a\u521b\u5efa\u989d\u5916\u7684\u90e8\u7f72"}),"\u3002"]})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},40615:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/multi-batch-9ab654fa21d93c2b4fcfe318e5f66e28.jpg"}}]);
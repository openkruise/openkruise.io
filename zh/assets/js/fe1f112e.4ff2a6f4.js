"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6680],{28453:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>t});var l=s(96540);const r={},i=l.createContext(r);function d(e){const n=l.useContext(i);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),l.createElement(i.Provider,{value:n},e.children)}},55005:(e,n,s)=>{s.d(n,{A:()=>l});const l=s.p+"assets/images/canary_vs_bluegreen-52e625ac19753397cc5376ebccdc218f.png"},63374:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>h,frontMatter:()=>d,metadata:()=>l,toc:()=>o});const l=JSON.parse('{"id":"user-manuals/strategy-bluegreen-update","title":"\u84dd\u7eff\u53d1\u5e03","description":"\u84dd\u7eff\u53d1\u5e03\u6d41\u7a0b","source":"@site/i18n/zh/docusaurus-plugin-content-docs-rollouts/current/user-manuals/strategy-bluegreen-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-bluegreen-update","permalink":"/zh/rollouts/user-manuals/strategy-bluegreen-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"\u591a\u6279\u6b21\u53d1\u5e03","permalink":"/zh/rollouts/user-manuals/strategy-multi-batch-update"},"next":{"title":"A/B \u6d4b\u8bd5","permalink":"/zh/rollouts/user-manuals/strategy-ab-testing"}}');var r=s(74848),i=s(28453);const d={},t="\u84dd\u7eff\u53d1\u5e03",c={},o=[{value:"\u84dd\u7eff\u53d1\u5e03\u6d41\u7a0b",id:"\u84dd\u7eff\u53d1\u5e03\u6d41\u7a0b",level:2},{value:"\u63a8\u8350\u914d\u7f6e",id:"\u63a8\u8350\u914d\u7f6e",level:2},{value:"\u884c\u4e3a\u89e3\u91ca",id:"\u884c\u4e3a\u89e3\u91ca",level:2},{value:"\u548c\u91d1\u4e1d\u96c0/\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b",id:"\u548c\u91d1\u4e1d\u96c0\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b",level:2},{value:"\u56de\u6eda",id:"\u56de\u6eda",level:2},{value:"\u5168\u5c40\u56de\u6eda",id:"\u5168\u5c40\u56de\u6eda",level:3},{value:"\u6d41\u91cf\u56de\u6eda",id:"\u6d41\u91cf\u56de\u6eda",level:3},{value:"\u6ce8\u610f\u4e8b\u9879",id:"\u6ce8\u610f\u4e8b\u9879",level:2},{value:"HPA",id:"hpa",level:3},{value:"PDB",id:"pdb",level:3},{value:"\u8fde\u7eed\u53d1\u5e03",id:"\u8fde\u7eed\u53d1\u5e03",level:3},{value:"\u5df2\u77e5\u95ee\u9898",id:"\u5df2\u77e5\u95ee\u9898",level:2}];function a(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u84dd\u7eff\u53d1\u5e03",children:"\u84dd\u7eff\u53d1\u5e03"})}),"\n",(0,r.jsx)(n.h2,{id:"\u84dd\u7eff\u53d1\u5e03\u6d41\u7a0b",children:"\u84dd\u7eff\u53d1\u5e03\u6d41\u7a0b"}),"\n",(0,r.jsx)("center",{children:(0,r.jsx)("img",{src:s(82994).A,width:"90%"})}),"\n",(0,r.jsx)(n.h2,{id:"\u63a8\u8350\u914d\u7f6e",children:"\u63a8\u8350\u914d\u7f6e"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u6ce8\u610f\uff1a\u84dd\u7eff\u7b56\u7565\u4ec5\u9002\u7528\u4e8eDeployment\u548cCloneSet\uff0c\u4e14\u4ec5\u652f\u6301v1beta1\u7684API\uff0c\u8981\u6c42Rollout\u7248\u672c\u9ad8\u4e8ev0.5.0(\u4e0d\u5305\u62ecv0.5.0)"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-YAML",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: workload-demo\n  strategy:\n    blueGreen:\n      steps:\n      - replicas: 100% # step 1\n        traffic: 0%\n      - replicas: 100% # step 2\n        traffic: 10%\n      - replicas: 100% # step 3\n        traffic:  100%\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n"})}),"\n",(0,r.jsx)(n.h2,{id:"\u884c\u4e3a\u89e3\u91ca",children:"\u884c\u4e3a\u89e3\u91ca"}),"\n",(0,r.jsx)(n.p,{children:"\u5f53\u60a8\u4e3aworkload-demo\u5e94\u7528\u65b0\u4fee\u8ba2\u7248\u672c\u65f6\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u5728\u7b2c\u4e00\u6279\u4e2d\uff0c\u5c06\u6269\u5bb9100%\u7684\u65b0\u7248\u672cPod\uff0c\u7a33\u5b9a\u7248\u672c\u7684Pod\u4e0d\u4f1a\u88ab\u7f29\u5bb9\uff0c\u6b64\u65f6\u6709200%\u7684Pod\uff0c\u6ca1\u6709\u4efb\u4f55\u8bf7\u6c42\u8def\u7531\u5230\u65b0\u7248\u672cPods\uff0c\u9700\u8981\u624b\u52a8\u786e\u8ba4\u5230\u4e0b\u4e00\u6279\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u5728\u7b2c\u4e8c\u6279\u4e2d\uff0c\u5c0610%\u7684\u6d41\u91cf\u8def\u7531\u5230\u65b0\u7248\u672c\uff0c\u9700\u8981\u624b\u52a8\u786e\u8ba4\u5230\u4e0b\u4e00\u6279\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u5728\u7b2c\u4e09\u6279\u4e2d\uff0c\u5c06100%\u7684\u6d41\u91cf\u8def\u7531\u5230\u65b0\u7248\u672c\uff0c\u9700\u8981\u624b\u52a8\u786e\u8ba4\u4ee5\u5b8c\u6210\u53d1\u5e03\u3002\n\u5f53\u60a8\u8ba4\u4e3a\u65b0\u7248\u672c\u5df2\u7ecf\u901a\u8fc7\u9a8c\u8bc1\u5e76\u786e\u8ba4\u8fdb\u884c\u4e0b\u4e00\u6b65\u65f6\uff1a"}),"\n",(0,r.jsx)(n.li,{children:"\u7a33\u5b9a\u7248\u672c\u7684Pods\u5c06\u4f1a\u7f29\u5bb9\uff0c\u53d1\u5e03\u7ed3\u675f"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"\u548c\u91d1\u4e1d\u96c0\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b",children:"\u548c\u91d1\u4e1d\u96c0/\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b"}),"\n",(0,r.jsxs)(n.p,{children:["\u4ece",(0,r.jsx)(n.strong,{children:"API"}),"\u7684\u89d2\u5ea6\uff0c",(0,r.jsx)(n.code,{children:"strategy.blueGreen"}),"\u548c",(0,r.jsx)(n.code,{children:"strategy.canary"}),"\u4e8c\u8005\u7684\u533a\u522b\u5f88\u5c0f\uff0c\u53ea\u4f53\u73b0\u5728\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["blueGreen\u6ca1\u6709",(0,r.jsx)(n.code,{children:"EnableExtraWorkloadForCanary"}),"\u5b57\u6bb5\u3002canary\u501f\u52a9\u8be5\u5b57\u6bb5\u533a\u5206\u662f\u5426\u5bf9Deployment\u521b\u5efa\u989d\u5916\u7684Deployment\uff0c\u5bf9\u5e94Deployment\u7684\u91d1\u4e1d\u96c0\u53d1\u5e03\u548c\u591a\u6279\u6b21\u53d1\u5e03\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["blueGreen\u6ca1\u6709",(0,r.jsx)(n.code,{children:"PatchPodTemplateMetadata"}),"\u5b57\u6bb5\u3002\u76ee\u524d\u53ea\u6709\u91d1\u4e1d\u96c0\u53d1\u5e03\u652f\u6301\u8be5\u5b57\u6bb5\uff0c\u591a\u6279\u6b21\u53d1\u5e03\u548c\u84dd\u7eff\u53d1\u5e03\u90fd\u4e0d\u652f\u6301\u8be5\u5b57\u6bb5\u3002\n\u9664\u6b64\u4e4b\u5916\uff0c\u4e24\u79cd\u53d1\u5e03\u65b9\u5f0f\u5728API\u4e0a\u6ca1\u6709\u8fdb\u4e00\u6b65\u533a\u522b\u3002\u60a8\u53ef\u4ee5\u6ce8\u610f\u5230\uff0c\u84dd\u7eff\u53d1\u5e03\u7684steps\u548ccanary\u7684steps\u6709\u4e00\u81f4\u7684\u7528\u6cd5\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u4ece",(0,r.jsx)(n.strong,{children:"\u53d1\u5e03\u6d41\u7a0b"}),"\u7684\u89d2\u5ea6\uff0c\u84dd\u7eff\u53d1\u5e03\u548c\u91d1\u4e1d\u96c0/\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b\u5728\u4e8e\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u84dd\u7eff\u53d1\u5e03\u4e0d\u4f1a\u521b\u5efa\u989d\u5916\u7684\u5de5\u4f5c\u8d1f\u8f7d\uff0c\u8fd9\u4e00\u70b9\u548c\u591a\u6279\u6b21\u53d1\u5e03\u76f8\u540c\uff0c\u800c\u91d1\u4e1d\u96c0\u53d1\u5e03\u4f1a\u521b\u5efa\u989d\u5916\u7684\u5de5\u4f5c\u8d1f\u8f7d\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u84dd\u7eff\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u65e7\u7248\u672c\u7684\u5b9e\u4f8b\u4e0d\u4f1a\u88ab\u7f29\u5bb9\uff0c\u8fd9\u4e00\u70b9\u548c\u91d1\u4e1d\u96c0\u53d1\u5e03\u76f8\u540c\uff0c\u800c\u591a\u6279\u6b21\u53d1\u5e03\u5728\u6269\u5bb9\u65b0\u7248\u672cPods\u7684\u540c\u65f6\u4f1a\u7f29\u5bb9\u65e7\u7248\u672cPods\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u60a8\u5e94\u8be5\u5f88\u5bb9\u6613\u7406\u89e3\u84dd\u7eff\u53d1\u5e03\u548c\u591a\u6279\u6b21\u53d1\u5e03\u7684\u5dee\u5f02\uff0c\u7136\u800c\u60a8\u4e5f\u53ef\u80fd\u4f1a\u60f3\uff0c\u9664\u4e86\u5e95\u5c42\u662f\u5426\u4f1a\u521b\u5efa\u989d\u5916\u7684\u5de5\u4f5c\u8d1f\u8f7d\u4e4b\u5916\uff0c\u84dd\u7eff\u53d1\u5e03\u548c\u91d1\u4e1d\u96c0\u53d1\u5e03\u4f3c\u4e4e\u6ca1\u4ec0\u4e48\u533a\u522b\u3002\u6216\u8bb8\u60a8\u53ef\u4ee5\u4ece\u4e0b\u56fe\u4e2d\u83b7\u5f97\u89e3\u91ca\uff1a"}),"\n"]}),"\n"]}),"\n",(0,r.jsx)("center",{children:(0,r.jsx)("img",{src:s(55005).A,width:"90%"})}),"\n",(0,r.jsx)(n.p,{children:"\u6ce8\u610f\u5230\uff0c\u5728\u6700\u540e\u4e00\u6279\u53d1\u5e03\u5b8c\u6210\u4e4b\u540e\uff0c\u91d1\u4e1d\u96c0\u53d1\u5e03\u4f1a\u6267\u884c\u4f1a\u5728\u539f\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u6267\u884c\u6eda\u52a8\u53d1\u5e03\uff0c\u800c\u84dd\u7eff\u53d1\u5e03\u53ea\u9700\u8981\u76f4\u63a5\u7f29\u5bb9\u65e7\u7248\u672cPods\u3002\n\u8fd9\u79cd\u5dee\u5f02\u53cd\u5e94\u4e86\u4e24\u79cd\u65b9\u5f0f\u7684\u8bed\u4e49\u4e0a\u7684\u5dee\u5f02\uff1a\u91d1\u4e1d\u96c0\u53d1\u5e03\u4e2d\uff0c\u521b\u5efa\u7684\u5de5\u4f5c\u8d1f\u8f7d\u672c\u8d28\u662f\u7528\u4e8e\u9a8c\u8bc1\u65b0\u7248\u672c\u7684\u201c\u91d1\u4e1d\u96c0\u201d\uff0c\u5728\u9a8c\u8bc1\u901a\u8fc7\u540e\u5373\u88ab\u5220\u9664\u3002\u800c\u84dd\u7eff\u53d1\u5e03\u4e2d\uff0c\u65b0\u65e7\u7248\u672c\u4f1a\u201c\u5171\u5b58\u201d\uff0c\u5141\u8bb8\u5728\u4e24\u4e2a\u7248\u672c\u4e4b\u95f4\u8fdb\u884c\u6d41\u91cf\u5207\u6362\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u5728\u5b9e\u8df5\u4e0a\uff0c\u91d1\u4e1d\u96c0\u53d1\u5e03\u5efa\u8bae\u914d\u7f6e\u5c11\u91cf\u6279\u6b21\uff08\u6bd4\u59821\u6279\uff09\uff0c\u6bcf\u4e2a\u6279\u6b21\u7684replicas\u5e94\u8be5\u6bd4\u8f83\u5c0f\uff0c\u5c3d\u7ba1\u5141\u8bb8\u5c06",(0,r.jsx)(n.code,{children:"replicas"}),"\u914d\u7f6e\u4e3a100%\uff0c\u4f46\u662f\u901a\u5e38\u6ca1\u6709\u5fc5\u8981\u3002\u800c\u5bf9\u4e8e\u84dd\u7eff\u53d1\u5e03\uff0c\u901a\u5e38\u5efa\u8bae\u914d\u7f6e",(0,r.jsx)(n.code,{children:"replicas"}),"\u4e3a100%"]}),"\n",(0,r.jsxs)(n.p,{children:["\u4ece",(0,r.jsx)(n.strong,{children:"\u5e95\u5c42\u5b9e\u73b0"}),"\u7684\u89d2\u5ea6\uff0c\u84dd\u7eff\u53d1\u5e03\u548c\u91d1\u4e1d\u96c0/\u591a\u6279\u6b21\u53d1\u5e03\u7684\u533a\u522b\u5728\u4e8e\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u91d1\u4e1d\u96c0\uff1a\u53ea\u6709Deployment\u652f\u6301\u91d1\u4e1d\u96c0\u53d1\u5e03\uff0c\u53d1\u5e03\u65f6Kruise-Rollout\u4f1a\u521b\u5efa\u540d\u4e3a",(0,r.jsx)(n.code,{children:"[DeploymentName]-canary"}),"\u7684Deployment"]}),"\n",(0,r.jsxs)(n.li,{children:["\u591a\u6279\u6b21\uff1aCloneSet\u53ef\u4ee5\u501f\u52a9\u81ea\u5e26\u7684",(0,r.jsx)(n.code,{children:"Partition"}),"\u5b57\u6bb5\u5b9e\u73b0\u591a\u6279\u6b21\u53d1\u5e03\uff0cDeployment\u5219\u4f9d\u8d56\u5b9a\u5236\u7684Deployment\u63a7\u5236\u5668\u5b9e\u73b0"]}),"\n",(0,r.jsxs)(n.li,{children:["\u84dd\u7eff\uff1aCloneSet\u548cDeployment\u90fd\u662f\u901a\u8fc7\u8bbe\u7f6e",(0,r.jsx)(n.code,{children:"MinReadySeconds"}),"\u3001",(0,r.jsx)(n.code,{children:"MaxSurge"}),"\u4ee5\u53ca",(0,r.jsx)(n.code,{children:"MaxUnavailable"}),"\u5b57\u6bb5\u6765\u5b9e\u73b0\u7684\uff0c\u56e0\u6b64\uff0c\u5982\u679c\u60a8\u5728\u4f7f\u7528\u84dd\u7eff\u53d1\u5e03\u65f6\u53d1\u73b0\u8fd9\u4e9b\u5b57\u6bb5\u88ab\u6539\u53d8\uff0c\u8bf7\u4e0d\u7528\u62c5\u5fc3\uff0c\u8fd9\u662f\u6b63\u5e38\u7684\u884c\u4e3a\uff0c\u5728\u53d1\u5e03\u5b8c\u6210\u540e\u8fd9\u4e9b\u5b57\u6bb5\u4f1a\u590d\u539f\u3002"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u90a3\u4e48\uff0c\u6211\u8be5\u9009\u62e9\u54ea\u79cd\u53d1\u5e03\u65b9\u5f0f\u5462\uff1f\u8fd9\u53d6\u51b3\u4e8e\u60a8\u7684\u4e1a\u52a1\u573a\u666f\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u84dd\u7eff\u53d1\u5e03\u4f1a\u6d88\u8017\u53cc\u500d\u7684\u8d44\u6e90\uff0c\u60a8\u53ef\u80fd\u5728\u9762\u5bf9\u7a33\u5b9a\u6027\u8981\u6c42\u6bd4\u8f83\u9ad8\u7684\u573a\u666f\u65f6\u624d\u4f1a\u4f7f\u7528\u84dd\u7eff\u53d1\u5e03\u3002\u8fd9\u662f\u56e0\u4e3a\u65b0\u65e7\u7248\u672c\u5b9e\u4f8b\u4f1a\u5171\u5b58\uff0c\u60a8\u53ef\u4ee5\u5feb\u901f\u5730\u5c06\u6d41\u91cf\u5207\u6362\u5230\u65b0\u7248\u672c\u6216\u7a33\u5b9a\u7248\u672c\u4e0a\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u5728\u5176\u4ed6\u573a\u666f\uff0c\u60a8\u53ef\u80fd\u4f1a\u9009\u62e9\u91d1\u4e1d\u96c0\u6216\u8005\u591a\u6279\u6b21\u53d1\u5e03\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"\u56de\u6eda",children:"\u56de\u6eda"}),"\n",(0,r.jsx)(n.h3,{id:"\u5168\u5c40\u56de\u6eda",children:"\u5168\u5c40\u56de\u6eda"}),"\n",(0,r.jsx)(n.p,{children:"\u548c\u91d1\u4e1d\u96c0/\u591a\u6279\u6b21\u53d1\u5e03\u76f8\u540c\uff0c\u60a8\u53ef\u4ee5\u76f4\u63a5\u56de\u6eda\u5de5\u4f5c\u8d1f\u8f7d\u89c4\u8303\u4ee5\u56de\u6eda\u5e94\u7528\u7a0b\u5e8f\u3002\u8be6\u89c1\u201c\u57fa\u672c\u4f7f\u7528\u6307\u5357\u201d-\u201c\u5982\u4f55\u56de\u6eda\u201d"}),"\n",(0,r.jsx)(n.h3,{id:"\u6d41\u91cf\u56de\u6eda",children:"\u6d41\u91cf\u56de\u6eda"}),"\n",(0,r.jsx)(n.p,{children:"Rollout\u5f15\u5165\u4e86\u65b0\u7279\u6027\uff0c\u652f\u6301\u6279\u6b21\u7684\u8df3\u8f6c\uff0c\u4f8b\u5982\u5728\u53d1\u5e03\u5230\u7b2c3\u6279\u65f6\uff0c\u6211\u4eec\u53ef\u4ee5\u6267\u884c\u4e0b\u9762\u7684\u547d\u4ee4\u8df3\u8f6c\u5230\u7b2c2\u6279\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'kubectl patch rollout rollouts-demo --type merge --subresource status -p "{\\"status\\":{\\"blueGreenStatus\\":{\\"nextStepIndex\\": 2}}}"\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u5229\u7528\u8fd9\u4e2a\u7279\u6027\uff0c\u53ef\u4ee5\u5bf9\u84dd\u7eff\u53d1\u5e03\u7684\u6d41\u91cf\u8fdb\u884c\u201c\u56de\u6eda\u201d\uff0c\u5728\u63a8\u8350\u914d\u7f6e\u4e2d\u4f8b\u5b50\u4e2d\uff0c\u4ece\u7b2c3\u6279\u8df3\u8f6c\u5230\u7b2c2\u6279\u5c06\u4f7f\u5f97\u6d41\u91cf\u914d\u7f6e\u4ece\u201c100%\u7684\u8bf7\u6c42\u8def\u7531\u5230\u65b0\u7248\u672c\u201d\u53d8\u4e3a\u201c10%\u7684\u8bf7\u6c42\u8def\u7531\u5230\u65b0\u7248\u672c\u201d\uff0c\u5982\u679c\u6211\u4eec\u518d\u8fdb\u4e00\u6b65\u8df3\u8f6c\u5230\u7b2c1\u6279\uff0c\u90a3\u4e48\u5168\u90e8\u8bf7\u6c42\u5c06\u88ab\u8def\u7531\u5230\u7a33\u5b9a\u7248\u672c\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u4e0d\u8fc7\u9700\u8981\u6ce8\u610f\u7684\u662f\uff0c\u5982\u679c\u76ee\u6807step\u7684",(0,r.jsx)(n.code,{children:"replicas"}),"\u5c0f\u4e8e\u5f53\u524dstep\u7684",(0,r.jsx)(n.code,{children:"replicas"}),"\uff0c\u5e76\u4e0d\u4f1a\u6709Pods\u88ab\u7f29\u5bb9\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["\u4e8b\u5b9e\u4e0a\uff0c\u76f4\u63a5\u4fee\u6539Rollout\u8d44\u6e90\u7684",(0,r.jsx)(n.code,{children:"spec.strategy.blueGreen.steps[x].traffic"}),"\u53ef\u4ee5\u8fbe\u5230\u76f8\u4f3c\u6548\u679c\uff0c\u4f8b\u5982\u5c06",(0,r.jsx)(n.code,{children:"spec.strategy.blueGreen.steps[lastBatch].traffic"}),"\u4ece100%\u4fee\u6539\u4e3a10%\uff0c\u4e4b\u540e\u518d\u4ece10%\u4fee\u6539\u4e3a0%\u3002\u4e0d\u8fc7\u76f4\u63a5\u5bf9",(0,r.jsx)(n.code,{children:"spec"}),"\u8fdb\u884c\u4fee\u6539\u53ef\u80fd\u4f1a\u5f71\u54cd\u5230\u4e0b\u6b21\u53d1\u5e03\uff0c\u800c\u4fee\u6539",(0,r.jsx)(n.code,{children:"status"}),"\u53ef\u4ee5\u907f\u514d\u8be5\u95ee\u9898\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u6ce8\u610f\uff1a\u5141\u8bb8\u6279\u6b21\u8df3\u8f6c\u548c\u4fee\u6539\u67d0\u4e00\u6279\u6b21\u7684\u6d41\u91cf\u914d\u7f6e\u90fd\u662f\u4f34\u968f\u7740\u84dd\u7eff\u53d1\u5e03\u800c\u5f15\u5165\u7684\u65b0\u7279\u6027\uff0c\u5bf9Rollout\u7684\u7248\u672c\u6709\u8981\u6c42\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"\u6ce8\u610f\u4e8b\u9879",children:"\u6ce8\u610f\u4e8b\u9879"}),"\n",(0,r.jsx)(n.h3,{id:"hpa",children:"HPA"}),"\n",(0,r.jsxs)(n.p,{children:["\u5728\u84dd\u7eff\u53d1\u5e03\u8fc7\u7a0b\u4e2d\uff0c\u5982\u679c\u5de5\u4f5c\u8d1f\u8f7d\u7ed1\u5b9a\u4e86HPA\uff08HorizontalPodAutoscaler\uff09\uff0cKruise-Rollout\u4f1a\u7981\u6b62\u8be5HPA\uff0c\u4f60\u4f1a\u53d1\u73b0HPA\u7684",(0,r.jsx)(n.code,{children:"scaleTargetRef.name"}),"\u589e\u52a0\u4e86\u540e\u7f00\u201c-DisableByRollout\u201d\uff0c\u5bfc\u81f4\u5de5\u4f5c\u8d1f\u8f7dNot Found\u3002\u84dd\u7eff\u53d1\u5e03\u7ed3\u675f\u540e\uff0c\u540e\u7f00\u4f1a\u88ab\u79fb\u9664\uff0cHPA\u5c06\u4f1a\u518d\u6b21\u751f\u6548\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"pdb",children:"PDB"}),"\n",(0,r.jsxs)(n.p,{children:["\u5728\u84dd\u7eff\u53d1\u5e03\u8fc7\u7a0b\u4e2d\uff0c\u5982\u679c\u5de5\u4f5c\u8d1f\u8f7d\u7ed1\u5b9a\u4e86PDB\uff08PodDisruptionBudget\uff09\uff0c\u7531\u4e8ePDB\u5728\u8ba1\u7b97\u201cAllowed disruptions\u201d\u65f6\u4e0d\u4f1a\u8003\u8651Pod\u7684\u7248\u672c\uff0c\u56e0\u6b64\u5982\u679c\u7528\u6237\u914d\u7f6e\u7684\u662f",(0,r.jsx)(n.code,{children:"maxUnavailable"}),"\uff0c\u5c06\u5bfc\u81f4\u201c\u6b65\u957f\u53d8\u5c0f\uff0c\u8fc7\u4fdd\u62a4\u201d\uff1b\u5982\u679c\u914d\u7f6e\u7684\u662f",(0,r.jsx)(n.code,{children:"minAvailable"}),"\uff0c\u5c06\u5bfc\u81f4\u201d\u6b65\u957f\u53d8\u5927\uff0c\u5f31\u4fdd\u62a4\u201d\u3002\u56e0\u6b64\uff0c\u9664\u975e\u6709\u5fc5\u8981\uff0c\u5c3d\u91cf\u4f7f\u7528minAvailable\uff08\u5b81\u613f\u201c\u8fc7\u4fdd\u62a4\u201d\u4e5f\u4e0d\u8981\u201c\u5f31\u4fdd\u62a4\u201d\uff09\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"\u8fde\u7eed\u53d1\u5e03",children:"\u8fde\u7eed\u53d1\u5e03"}),"\n",(0,r.jsx)(n.p,{children:"\u84dd\u7eff\u53d1\u5e03\u76ee\u524d\u4e0d\u652f\u6301\u8fde\u7eed\u53d1\u5e03\uff0c\u5982\u679c\u4f60\u5728\u53d1\u5e03v2\u7248\u672c\uff08v1->v2)\u7684\u8fc7\u7a0b\u4e2d\uff0c\u60f3\u8981\u53d1\u5e03v3\u7248\u672c\uff0c\u6211\u4eec\u63a8\u8350\u5148\u624b\u52a8\u56de\u6eda\u5230v1\u7248\u672c\uff0c\u7136\u540e\u518d\u53d1\u5e03v3\u7248\u672c\u3002\n\u5982\u679c\u4f60\u5df2\u7ecf\u4e0d\u5c0f\u5fc3\u53d1\u5e03\u4e86v3\u7248\u672c\uff0c\u63a7\u5236\u5668\u5c06\u4e0d\u4f1a\u5de5\u4f5c\uff0cv3\u7248\u672c\u7684Pods\u4e0d\u4f1a\u88ab\u521b\u5efa\uff0cv2\u548cv1\u7248\u672c\u7684Pods\u4e5f\u4e0d\u4f1a\u88ab\u7f29\u5bb9\uff0c\u6b64\u65f6\u5982\u679c\u68c0\u67e5Rollout\u8d44\u6e90\uff0c\u4f60\u4f1a\u6ce8\u610f\u5230\u4e0b\u9762\u7c7b\u4f3c\u7684Message\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                                       AGE\nrollouts-demo   Progressing   1             StepPaused     new version releasing detected in the progress of blue-green release, please rollback first   6d23h\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u6b64\u65f6\u5efa\u8bae\u6267\u884c\u56de\u6eda\u64cd\u4f5c\uff0c\u4f60\u53ef\u4ee5\u56de\u6eda\u5230v1\u7248\u672c\u3002\u7279\u522b\u7684\uff0c\u5982\u679c\u4f60\u4f7f\u7528",(0,r.jsx)(n.code,{children:"kubectl rollout undo"}),"\u547d\u4ee4\u8fdb\u884c\u56de\u6eda\uff0c\u8bf7\u786e\u4fdd\u6307\u5b9a\u6b63\u786e\u7684",(0,r.jsx)(n.code,{children:"--to-revision"}),"\u4ee5\u56de\u6eda\u5230v1\uff0c\u5982\u679c\u6ca1\u6709\u6307\u5b9a",(0,r.jsx)(n.code,{children:"--to-revision"}),"\uff0c\u4f60\u53ef\u80fd\u4f1a\u518d\u6b21\u56de\u5230v2\uff08\u5373\u53d1\u5e03v3\u4e4b\u524d\u7684\u72b6\u6001\uff09\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                         AGE\nrollouts-demo   Progressing   1             StepPaused     Rollout is in step(1/4), and you need manually confirm to enter the next step   7d\n"})}),"\n",(0,r.jsx)(n.h2,{id:"\u5df2\u77e5\u95ee\u9898",children:"\u5df2\u77e5\u95ee\u9898"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u7531\u4e8eCloneSet\u7684\u63a7\u5236\u5668\u4ee3\u7801\u5b58\u5728\u5c1a\u672a\u89e3\u51b3\u7684\u95ee\u9898\uff0c\u5bf9CloneSet\u8fdb\u884c\u84dd\u7eff\u53d1\u5e03\u65f6\uff0c\u6240\u6709\u6279\u6b21\u7684replicas\u90fd\u5e94\u8be5\u8bbe\u7f6e\u4e3a100%\uff0c\u5426\u5219CloneSet\u53ef\u80fd\u65e0\u6cd5\u6269\u5bb9\u3002Deployment\u4e0d\u53d7\u6b64\u9650\u5236\u3002"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},82994:(e,n,s)=>{s.d(n,{A:()=>l});const l=s.p+"assets/images/bluegreen-412715db3507ecf338eb01c03ac01ef1.png"}}]);
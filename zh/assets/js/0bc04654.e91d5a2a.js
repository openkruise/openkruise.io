"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1801],{26840:(n,e,r)=>{r.r(e),r.d(e,{assets:()=>t,contentTitle:()=>c,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"user-manuals/containerlaunchpriority","title":"Container Launch Priority","description":"FEATURE STATE: Kruise v1.0.0","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/containerlaunchpriority.md","sourceDirName":"user-manuals","slug":"/user-manuals/containerlaunchpriority","permalink":"/zh/docs/user-manuals/containerlaunchpriority","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/containerlaunchpriority.md","tags":[],"version":"v1.7","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Container Launch Priority"},"sidebar":"docs","previous":{"title":"Job Sidecar Terminator","permalink":"/zh/docs/user-manuals/jobsidecarterminator"},"next":{"title":"WorkloadSpread","permalink":"/zh/docs/user-manuals/workloadspread"}}');var o=r(74848),s=r(28453);const a={title:"Container Launch Priority"},c=void 0,t={},d=[{value:"\u7528\u6cd5",id:"\u7528\u6cd5",level:2},{value:"\u6309\u7167 container \u987a\u5e8f\u542f\u52a8",id:"\u6309\u7167-container-\u987a\u5e8f\u542f\u52a8",level:3},{value:"\u6309\u81ea\u5b9a\u4e49\u987a\u5e8f\u542f\u52a8",id:"\u6309\u81ea\u5b9a\u4e49\u987a\u5e8f\u542f\u52a8",level:3},{value:"\u4f7f\u7528\u8981\u6c42",id:"\u4f7f\u7528\u8981\u6c42",level:2},{value:"\u5b9e\u73b0\u7ec6\u8282",id:"\u5b9e\u73b0\u7ec6\u8282",level:2}];function l(n){const e={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(e.p,{children:[(0,o.jsx)(e.strong,{children:"FEATURE STATE:"})," Kruise v1.0.0"]}),"\n",(0,o.jsxs)(e.p,{children:["Container Launch Priority \u63d0\u4f9b\u4e86",(0,o.jsx)(e.strong,{children:"\u63a7\u5236\u4e00\u4e2a Pod \u4e2d\u5bb9\u5668\u542f\u52a8\u987a\u5e8f"}),"\u7684\u65b9\u6cd5\u3002"]}),"\n",(0,o.jsxs)(e.blockquote,{children:["\n",(0,o.jsxs)(e.p,{children:["\u901a\u5e38\u6765\u8bf4 Pod \u5bb9\u5668\u7684\u542f\u52a8\u548c\u9000\u51fa\u987a\u5e8f\u662f\u7531 Kubelet \u7ba1\u7406\u7684\u3002Kubernetes \u66fe\u7ecf\u6709\u4e00\u4e2a ",(0,o.jsx)(e.a,{href:"https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/753-sidecar-containers",children:"KEP"})," \u8ba1\u5212\u5728 container \u4e2d\u589e\u52a0\u4e00\u4e2a type \u5b57\u6bb5\u6765\u6807\u8bc6\u4e0d\u540c\u7c7b\u578b\u5bb9\u5668\u7684\u542f\u505c\u4f18\u5148\u7ea7\u3002\n\u4f46\u662f\u7531\u4e8e",(0,o.jsx)(e.a,{href:"https://github.com/kubernetes/enhancements/issues/753#issuecomment-713471597",children:"sig-node\u8003\u8651\u5230\u5bf9\u73b0\u6709\u4ee3\u7801\u67b6\u6784\u7684\u6539\u52a8\u592a\u5927"}),"\uff0c\u5b83\u5df2\u7ecf\u88ab\u62d2\u7edd\u4e86\u3002"]}),"\n"]}),"\n",(0,o.jsxs)(e.p,{children:["\u6ce8\u610f\uff0c\u8fd9\u4e2a\u529f\u80fd\u4f5c\u7528\u5728 Pod \u5bf9\u8c61\u4e0a\uff0c",(0,o.jsx)(e.strong,{children:"\u4e0d\u7ba1\u5b83\u7684 owner \u662f\u4ec0\u4e48\u7c7b\u578b\u7684"}),"\uff0c\u56e0\u6b64\u53ef\u4ee5\u9002\u7528\u4e8e Deployment\u3001CloneSet \u4ee5\u53ca\u5176\u4ed6\u7684 workload \u79cd\u7c7b\u3002"]}),"\n",(0,o.jsxs)(e.p,{children:[(0,o.jsx)(e.strong,{children:"\u6ce8\u610f\uff1a"})," \u5982\u679c K8S \u7248\u672c>=1.28\uff0c\u63a8\u8350\u4f7f\u7528K8S\u539f\u751f\u7684 ",(0,o.jsx)(e.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers",children:"Sidecar Container"})," \u6765\u89e3\u51b3\u4e0a\u8ff0\u95ee\u9898\u3002"]}),"\n",(0,o.jsx)(e.h2,{id:"\u7528\u6cd5",children:"\u7528\u6cd5"}),"\n",(0,o.jsx)(e.h3,{id:"\u6309\u7167-container-\u987a\u5e8f\u542f\u52a8",children:"\u6309\u7167 container \u987a\u5e8f\u542f\u52a8"}),"\n",(0,o.jsx)(e.p,{children:"\u53ea\u9700\u8981\u5728 Pod \u4e2d\u5b9a\u4e49\u4e00\u4e2a annotation \u5373\u53ef\uff1a"}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\n  annotations:\n    apps.kruise.io/container-launch-priority: Ordered\nspec:\n  containers:\n  - name: sidecar\n    # ...\n  - name: main\n    # ...\n"})}),"\n",(0,o.jsx)(e.p,{children:"Kruise \u4f1a\u4fdd\u8bc1\u524d\u9762\u7684\u5bb9\u5668\uff08sidecar\uff09\u4f1a\u5728\u540e\u9762\u5bb9\u5668\uff08main\uff09\u4e4b\u524d\u542f\u52a8\u3002"}),"\n",(0,o.jsx)(e.h3,{id:"\u6309\u81ea\u5b9a\u4e49\u987a\u5e8f\u542f\u52a8",children:"\u6309\u81ea\u5b9a\u4e49\u987a\u5e8f\u542f\u52a8"}),"\n",(0,o.jsxs)(e.p,{children:["\u9700\u8981\u5728 Pod container \u4e2d\u6dfb\u52a0 ",(0,o.jsx)(e.code,{children:"KRUISE_CONTAINER_PRIORITY"})," \u73af\u5883\u53d8\u91cf:"]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nspec:\n  containers:\n  - name: main\n    # ...\n  - name: sidecar\n    env:\n    - name: KRUISE_CONTAINER_PRIORITY\n      value: "1"\n    # ...\n'})}),"\n",(0,o.jsxs)(e.ol,{children:["\n",(0,o.jsxs)(e.li,{children:["\u503c\u7684\u8303\u56f4\u5728 ",(0,o.jsx)(e.code,{children:"[-2147483647, 2147483647]"}),"\uff0c\u4e0d\u5199\u9ed8\u8ba4\u662f ",(0,o.jsx)(e.code,{children:"0"}),"\u3002"]}),"\n",(0,o.jsx)(e.li,{children:"\u6743\u91cd\u9ad8\u7684\u5bb9\u5668\uff0c\u4f1a\u4fdd\u8bc1\u5728\u6743\u91cd\u4f4e\u7684\u5bb9\u5668\u4e4b\u524d\u542f\u52a8\u3002"}),"\n",(0,o.jsx)(e.li,{children:"\u76f8\u540c\u6743\u91cd\u7684\u5bb9\u5668\u4e0d\u4fdd\u8bc1\u542f\u52a8\u987a\u5e8f\u3002"}),"\n"]}),"\n",(0,o.jsx)(e.h2,{id:"\u4f7f\u7528\u8981\u6c42",children:"\u4f7f\u7528\u8981\u6c42"}),"\n",(0,o.jsxs)(e.p,{children:["\u4f7f\u7528 ContainerLaunchPriority \u529f\u80fd\u9700\u8981\u6253\u5f00 ",(0,o.jsx)(e.code,{children:"PodWebhook"})," feature-gate\uff08\u9ed8\u8ba4\u5c31\u662f\u6253\u5f00\u7684\uff0c\u9664\u975e\u663e\u5f0f\u5173\u95ed\uff09\u3002"]}),"\n",(0,o.jsx)(e.h2,{id:"\u5b9e\u73b0\u7ec6\u8282",children:"\u5b9e\u73b0\u7ec6\u8282"}),"\n",(0,o.jsxs)(e.p,{children:["Kruise webhook \u4f1a\u5904\u7406\u6240\u6709 Pod \u521b\u5efa\u7684\u8bf7\u6c42\u3002\n\u5f53 webhook \u53d1\u73b0 Pod \u4e2d\u5e26\u6709 ",(0,o.jsx)(e.code,{children:"apps.kruise.io/container-launch-priority"})," annotation \u6216\u662f ",(0,o.jsx)(e.code,{children:"KRUISE_CONTAINER_PRIORITY"})," \u73af\u5883\u53d8\u91cf\uff0c\u5219\u5728\u5b83\u7684\u6bcf\u4e2a\u5bb9\u5668\u4e2d\u6ce8\u5165 ",(0,o.jsx)(e.code,{children:"KRUISE_CONTAINER_BARRIER"})," \u73af\u5883\u53d8\u91cf\u3002"]}),"\n",(0,o.jsxs)(e.p,{children:[(0,o.jsx)(e.code,{children:"KRUISE_CONTAINER_BARRIER"})," \u73af\u5883\u53d8\u91cf\u662f value from \u4e00\u4e2a\u540d\u4e3a ",(0,o.jsx)(e.code,{children:"{pod-name}-barrier"})," \u7684 ConfigMap\uff0ckey \u662f\u4e0e\u8fd9\u4e2a\u5bb9\u5668\u7684\u6743\u91cd\u6240\u5bf9\u5e94\u3002\u6bd4\u5982\uff1a"]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nspec:\n  containers:\n  - name: main\n    # ...\n    env:\n    - name: KRUISE_CONTAINER_BARRIER\n      valueFrom:\n        configMapKeyRef:\n          name: {pod-name}-barrier\n          key: "p_0"\n  - name: sidecar\n    env:\n    - name: KRUISE_CONTAINER_PRIORITY\n      value: "1"\n    - name: KRUISE_CONTAINER_BARRIER\n      valueFrom:\n        configMapKeyRef:\n          name: {pod-name}-barrier\n          key: "p_1"\n    # ...\n'})}),"\n",(0,o.jsx)(e.p,{children:"\u7136\u540e Kruise controller \u4f1a\u521b\u5efa\u4e00\u4e2a\u7a7a\u7684 ConfigMap\uff0c\u5e76\u6309\u7167\u6743\u91cd\u987a\u5e8f\u4ee5\u53ca Pod \u4e2d\u5bb9\u5668\u7684\u542f\u52a8\u72b6\u6001\u9010\u6e10\u5c06 key \u52a0\u5165\u5230 ConfigMap \u4e2d\u3002"}),"\n",(0,o.jsxs)(e.p,{children:["\u4ee5\u4e0a\u9762\u7684\u4f8b\u5b50\u6765\u770b\uff0ccontroller \u4f1a\u5148\u52a0\u5165 ",(0,o.jsx)(e.code,{children:"p_1"})," key\uff0c\u7b49\u5f85 sidecar \u5bb9\u5668\u542f\u52a8\u6210\u529f\u540e\uff0c\u518d\u52a0\u5165 ",(0,o.jsx)(e.code,{children:"p_0"})," key \u6765\u5141\u8bb8 Kubelet \u542f\u52a8 main \u5bb9\u5668\u3002"]}),"\n",(0,o.jsxs)(e.p,{children:["\u53e6\u5916\uff0c\u5728 Pod \u542f\u52a8\u7684\u8fc7\u7a0b\u4e2d\uff0c\u7528 kubectl \u53ef\u80fd\u4f1a\u770b\u5230 Pod \u5904\u4e8e ",(0,o.jsx)(e.code,{children:"CreateContainerConfigError"})," \u72b6\u6001\uff0c\u8fd9\u662f\u7531\u4e8e Kubelet \u6ca1\u6709\u627e\u5230\u90e8\u5206\u5bb9\u5668\u7684 ConfigMap key \u5bfc\u81f4\u7684\uff0c\u5728\u5168\u90e8\u5bb9\u5668\u542f\u52a8\u5b8c\u6210\u540e\u4f1a\u6d88\u5931\u3002"]})]})}function u(n={}){const{wrapper:e}={...(0,s.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(l,{...n})}):l(n)}},28453:(n,e,r)=>{r.d(e,{R:()=>a,x:()=>c});var i=r(96540);const o={},s=i.createContext(o);function a(n){const e=i.useContext(s);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function c(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(o):n.components||o:a(n.components),i.createElement(s.Provider,{value:e},n.children)}}}]);
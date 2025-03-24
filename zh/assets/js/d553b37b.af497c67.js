"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4216],{21529:(e,n,i)=>{i.d(n,{A:()=>r});const r=i.p+"assets/images/resourcedistributiongenerator-c0493bac80f654213addb9c50fc59743.png"},28453:(e,n,i)=>{i.d(n,{R:()=>t,x:()=>a});var r=i(96540);const s={},o=r.createContext(s);function t(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:t(e.components),r.createElement(o.Provider,{value:n},e.children)}},70508:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>t,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"cli-tool/kustomize-plugin","title":"Kustomize ResourceDistribution Generator","description":"Kruise-tools \u4e3a kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4f5c\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684generator\u548ctransformers\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/cli-tool/kustomize-plugin.md","sourceDirName":"cli-tool","slug":"/cli-tool/kustomize-plugin","permalink":"/zh/docs/cli-tool/kustomize-plugin","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kustomize-plugin.md","tags":[],"version":"v1.7","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"Kustomize ResourceDistribution Generator"},"sidebar":"docs","previous":{"title":"Kubectl Plugin","permalink":"/zh/docs/cli-tool/kubectl-plugin"},"next":{"title":"FAQ","permalink":"/zh/docs/faq"}}');var s=i(74848),o=i(28453);const t={title:"Kustomize ResourceDistribution Generator"},a=void 0,c={},l=[{value:"ResourceDistribution Generator",id:"resourcedistribution-generator",level:2},{value:"\u4e0b\u8f7dResourceDistribution generator",id:"\u4e0b\u8f7dresourcedistribution-generator",level:3},{value:"API\u8bf4\u660e",id:"api\u8bf4\u660e",level:3},{value:"Resource\u5b57\u6bb5\u8bf4\u660e",id:"resource\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"ResourceDistribution from File",id:"resourcedistribution-from-file",level:4},{value:"ResourceDistribution from Literals",id:"resourcedistribution-from-literals",level:4},{value:"ResourceDistribution from env file",id:"resourcedistribution-from-env-file",level:4},{value:"Targets\u5b57\u6bb5\u8bf4\u660e",id:"targets\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"Options\u548cResourceOptions\u5b57\u6bb5\u8bf4\u660e",id:"options\u548cresourceoptions\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"\u5b8c\u6574\u7528\u4f8b",id:"\u5b8c\u6574\u7528\u4f8b",level:3},{value:"\u5728argocd\u4e2d\u4f7f\u7528ResourceDistribution generator",id:"\u5728argocd\u4e2d\u4f7f\u7528resourcedistribution-generator",level:3},{value:"\u4f7f\u7528\u63d2\u4ef6",id:"\u4f7f\u7528\u63d2\u4ef6",level:4}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"Kruise-tools"})," \u4e3a kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4f5c\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684generator\u548ctransformers\u3002"]}),"\n",(0,s.jsx)(n.h2,{id:"resourcedistribution-generator",children:"ResourceDistribution Generator"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["ResourceDistribution Generator\u63d2\u4ef6\u4ece v1.0.0 (alpha/beta) \u5f00\u59cb\uff0c\u8981\u6c42\u4f7f\u7528 Kustomize >= 4.3.0 \u7684\u7248\u672c\uff0c\u5b89\u88c5\u53c2\u8003 ",(0,s.jsx)(n.a,{href:"https://kubectl.docs.kubernetes.io/installation/kustomize/",children:"kustomize"}),"\u3002"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"\u5728\u4f7f\u7528kustomize\u7ba1\u7406\u5e94\u7528\u65f6\uff0c\u5229\u7528kustomize\u81ea\u5e26\u7684generator\u80fd\u591f\u76f4\u63a5\u8bfb\u53d6\u6587\u4ef6\u4f5c\u4e3adata\u5185\u5bb9\u6765\u521b\u5efaConfigmap\u6216Secret \uff0c\u907f\u514d\u4e86\u624b\u52a8\u590d\u5236\u65f6\u5bb9\u6613\u51fa\u73b0\u7684\u79cd\u79cd\u683c\u5f0f\u9519\u8bef\u3002ResourceDistribution Generator\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\uff0c\u4f7f\u7528\u8be5\u63d2\u4ef6\u53ef\u4ee5\u5b8c\u6210\u8bfb\u53d6\u6587\u4ef6\u4f5c\u4e3adata\u5185\u5bb9\u6765\u521b\u5efaResourceDistribution\u7684\u5de5\u4f5c\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"\u4e0b\u8f7dresourcedistribution-generator",children:"\u4e0b\u8f7dResourceDistribution generator"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/releases",children:"\u8be5\u9875\u9762"}),"\u63d0\u4f9b\u4e86\u5e38\u89c1\u7248\u672c\u7684\u4e8c\u8fdb\u5236\u6587\u4ef6\u4e0b\u8f7d\u8def\u5f84\u3002\u76ee\u524d",(0,s.jsx)(n.code,{children:"linux"}),", ",(0,s.jsx)(n.code,{children:"darwin"}),"(OS X),",(0,s.jsx)(n.code,{children:"windows"}),"\u63d0\u4f9b",(0,s.jsx)(n.code,{children:"x86_64"}),"\u548c",(0,s.jsx)(n.code,{children:"arm64"}),"\u3002\u5982\u679c\u60a8\u4f7f\u7528\u5176\u4ed6\u4e00\u4e9b\u7cfb\u7edf\u6216\u67b6\u6784\uff0c\u5219\u5fc5\u987b\u4e0b\u8f7d",(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/blob/master/cmd/resourcedistributiongenerator",children:"\u6e90\u4ee3\u7801"}),"\u5e76\u6267\u884c",(0,s.jsx)(n.code,{children:"go build"}),"\u6765\u6784\u5efa\u4e8c\u8fdb\u5236\u6587\u4ef6\u3002"]}),"\n",(0,s.jsx)(n.h3,{id:"api\u8bf4\u660e",children:"API\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.p,{children:["ResourceDistributionGenerator\u662fkusomize\u7684Exec KRM functions\u63d2\u4ef6\uff0c\u4e3b\u8981\u7531 ",(0,s.jsx)(n.code,{children:"resource"})," \u548c ",(0,s.jsx)(n.code,{children:"targets"})," \u4e24\u4e2a\u5b57\u6bb5\u6784\u6210\uff0c\u6784\u5efa\u540e\u4f1a\u751f\u6210\u5bf9\u5e94\u4e8eResourceDistribution\u7684",(0,s.jsx)(n.code,{children:"resource"})," \u548c ",(0,s.jsx)(n.code,{children:"targets"})," \u5185\u5bb9\u3002",(0,s.jsx)(n.code,{children:"metadata"}),"\u4e2d\u7684",(0,s.jsx)(n.code,{children:"name"}),"\u7528\u6765\u8bbe\u7f6e\u751f\u6210\u7684resourceDistribution\u7684\u540d\u79f0\uff0c\u6ce8\u89e3",(0,s.jsx)(n.code,{children:"config.kubernetes.io/function"}),"\u4e2d\u9700\u8981\u5199\u5165\u672c\u63d2\u4ef6\u5728\u6587\u4ef6\u7cfb\u7edf\u4e2d\u7684\u8def\u5f84\uff0c\u5982\u679c\u4f7f\u7528\u7684\u662f\u76f8\u5bf9\u8def\u5f84\uff0c\u9700\u8981\u76f8\u5bf9\u4e8e\u5f15\u7528\u914d\u7f6e\u6587\u4ef6\u7684kustomization\u6587\u4ef6\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./plugins/resourcedistributiongenerator\nresource:\n\t... ...\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.h3,{id:"resource\u5b57\u6bb5\u8bf4\u660e",children:"Resource\u5b57\u6bb5\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"resource"}),"\u5b57\u6bb5\u4e2d\u5185\u5bb9\u7528\u6765\u751f\u6210\u88ab\u5206\u53d1\u7684\u8d44\u6e90\uff0c",(0,s.jsx)(n.code,{children:"literals"}),"\u3001",(0,s.jsx)(n.code,{children:"files"}),"\u3001",(0,s.jsx)(n.code,{children:"envs"}),"\u5b57\u6bb5\u7684\u4f7f\u7528\u548c",(0,s.jsx)(n.a,{href:"https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/",children:"Configmap\u6216Secret Generator"}),"\u4e2d\u7528\u6cd5\u76f8\u540c\u3002"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"resourceKind"}),": \u6307\u5b9a\u5206\u53d1\u7684\u8d44\u6e90\u7c7b\u578b\uff0cSecret\u6216ConfigMap"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"resourceName"}),": \u8bbe\u7f6e\u5206\u53d1\u8d44\u6e90\u7684\u540d\u79f0\uff0c\u5373Secret\u6216ConfigMap\u7684\u540d\u79f0"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"literals"}),": \u4f7f\u7528\u7ed9\u5b9a\u7684\u6587\u5b57\u4e2d\u7684\u952e/\u503c\u5bf9\u521b\u5efadata\u5185\u5bb9"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"files"}),": \u4f7f\u7528\u7ed9\u5b9a\u6587\u4ef6\u7684\u540d\u79f0\u548c\u5185\u5bb9\u521b\u5efadata\u5185\u5bb9"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"envs"}),": \u4f7f\u7528\u6587\u4ef6\u4e2d\u7684\u952e/\u503c\u5bf9\u521b\u5efadata\u5185\u5bb9"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684resource\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - file.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-file",children:"ResourceDistribution from File"}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u6587\u4ef6\u4e2d\u751f\u6210 - \u4f8b\u5982\u4ece\u4e00\u4e2a java.properties\u6587\u4ef6\u3002"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u793a\u4f8b"}),"\uff1a\u4f7f\u7528\u5305\u542b\u6587\u4ef6\u5185\u5bb9\u7684\u6570\u636e\u9879\u751f\u6210 ResourceDistribution\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution \u5c06\u4ece\u6587\u4ef6\u5185\u5bb9\u4e2d\u586b\u5145\u6570\u636e\u503c\u3002\u6bcf\u4e2a\u6587\u4ef6\u7684\u5185\u5bb9\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7531\u6587\u4ef6\u540d\u4f5c\u4e3akey\u7684\u5355\u4e2a\u6570\u636e\u9879\u3002"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:"application.properties"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"FOO=Bar\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      application.properties: |\n        FOO=Bar\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-literals",children:"ResourceDistribution from Literals"}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u6587\u5b57\u952e\u503c\u5bf9\u751f\u6210 - \u4f8b\u5982JAVA_HOME=/opt/java/jdk."}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u952e/\u503c\u7531 = \u5206\u9694\uff08\u5de6\u4fa7\u662f\u952e\uff09"}),"\n",(0,s.jsx)(n.li,{children:"\u6bcf\u4e2a\u6587\u672c\u7684\u503c\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7684\u4e00\u4e2a\u6570\u636e\u9879\uff0c\u8be5\u6570\u636e\u9879\u7684key\u5373\u4e3a\u6587\u672c\u7684key"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u793a\u4f8b"}),"\uff1a\u4f7f\u7528\u4ece\u6587\u5b57\u751f\u6210\u7684 2 \u4e2a\u6570\u636e\u9879\u521b\u5efa\u4e00\u4e2a ResourceDistribution\u3002"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n    - JAVA_TOOL_OPTIONS=-agentlib:hprof\ntargets:\n  ... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      JAVA_TOOL_OPTIONS: -agentlib:hprof\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-env-file",children:"ResourceDistribution from env file"}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u952e\u503c\u5bf9\u751f\u6210\uff0c\u8fd9\u4e0e\u4f7f\u7528\u6587\u5b57\u975e\u5e38\u76f8\u4f3c\uff0c\u4f46\u4eceenv\u6587\u4ef6\u4e2d\u83b7\u53d6\u952e\u503c\u5bf9\u3002"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u73af\u5883\u6587\u4ef6\u4e2d\u7684\u952e/\u503c\u5bf9\u7528 = \u5206\u9694\uff08\u5de6\u4fa7\u662f\u952e\uff09"}),"\n",(0,s.jsx)(n.li,{children:"\u6bcf\u884c\u7684\u503c\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7531\u5176\u952e\u4f5c\u4e3akey\u7684\u6570\u636e\u9879\u3002"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u793a\u4f8b"}),"\uff1a\u4f7f\u7528\u4eceenv\u6587\u4ef6\u751f\u6210\u7684 3 \u4e2a\u6570\u636e\u9879\u521b\u5efa\u4e00\u4e2a ResourceDistribution\u3002"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  envs:\n    - tracing.env\ntargets:\n  ... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:"tracing.env"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"ENABLE_TRACING=true\nSAMPLER_TYPE=probabilistic\nSAMPLER_PARAMETERS=0.1\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      ENABLE_TRACING: "true"\n      SAMPLER_TYPE: "probabilistic"\n      SAMPLER_PARAMETERS: "0.1"\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n'})}),"\n",(0,s.jsx)(n.h3,{id:"targets\u5b57\u6bb5\u8bf4\u660e",children:"Targets\u5b57\u6bb5\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"targets"}),"\u5b57\u6bb5\u548cResourceDistribution\u4e2d",(0,s.jsx)(n.code,{children:"targets"}),"\u5b57\u6bb5\u7684\u7528\u6cd5\u57fa\u672c\u76f8\u540c\uff0c\u6ce8\u610f",(0,s.jsx)(n.code,{children:"includedNamespaces"}),"\u548c",(0,s.jsx)(n.code,{children:"excludedNamespaces"}),"\u5b57\u6bb5\u7684\u5185\u5bb9\u76f4\u63a5\u662f\u547d\u540d\u7a7a\u95f4\u7684\u540d\u79f0\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684targets\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n\t... ...\ntargets:\n  allNamespaces: true\n  excludedNamespaces:\n    - ns-2\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"options\u548cresourceoptions\u5b57\u6bb5\u8bf4\u660e",children:"Options\u548cResourceOptions\u5b57\u6bb5\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"options"}),"\u548c",(0,s.jsx)(n.code,{children:"resourceOptions"}),"\u5b57\u6bb5\u5206\u522b\u7528\u6765\u4e3a\u751f\u6210\u7684ResourceDistribution\u548c\u5176\u4e2d\u7684Resource\uff08\u5373ConfigMap\u6216Secret\uff09\u8bbe\u7f6e\u6ce8\u89e3\u6216\u6807\u7b7e\u3002"]}),"\n",(0,s.jsxs)(n.p,{children:["\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684",(0,s.jsx)(n.code,{children:"options"}),"\u548c",(0,s.jsx)(n.code,{children:"resourceOptions"}),"\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  ... ...\n  resourceOptions:\n    annotations:\n      dashboard: "1"\n    labels:\n      environment: "dev"\ntargets:\n\t... ...\noptions:\n  annotations:\n    type: "slave"\n  labels:\n    version: "stable"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"\u5b8c\u6574\u7528\u4f8b",children:"\u5b8c\u6574\u7528\u4f8b"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u521b\u5efa\u4e00\u4e2ademo\u76ee\u5f55\u4f5c\u4e3a\u5de5\u4f5c\u7a7a\u95f4\u5e76\u8fdb\u5165\u3002\u5c06\u4e0b\u8f7d\u7684ResourceDistributionGenerator\u63d2\u4ef6\u653e\u5728\u5f53\u524d\u76ee\u5f55\uff0c\u5e76\u8f93\u5165\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efa\u4e00\u4e2a\u540d\u4e3ardGenerator.yaml\u7684\u914d\u7f6e\u6587\u4ef6\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'cat > rdGenerator.yaml <<EOF\n#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n  resourceOptions:\n    annotations:\n      dashboard: "1"\noptions:\n  labels:\n    app.kubernetes.io/name: "app1"\ntargets:\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\nEOF\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"\u4f7f\u7528\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efaapplication.properties\u6587\u4ef6\u4f5c\u4e3a\u6587\u4ef6\u8f93\u5165\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat > application.properties <<EOF\nFOO=Bar\nFIRST=1\nSECOND=2\nLAST=3\nEOF\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"\u4f7f\u7528\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efakustomization\u6587\u4ef6\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat > kustomization.yaml <<EOF\n#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\nEOF\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["\u4f7f\u7528",(0,s.jsx)(n.code,{children:"kustomize build --enable-alpha-plugins --enable-exec ."}),"\u547d\u4ee4\u6784\u5efa\u5e94\u7528\uff0c\u6548\u679c\u5982\u4e0b"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  labels:\n    app.kubernetes.io/name: app1\n  name: rdname\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      application.properties: |\n        FOO=Bar\n        FIRST=1\n        SECOND=2\n        LAST=3\n    kind: ConfigMap\n    metadata:\n      annotations:\n        dashboard: "1"\n      name: cmname\n  targets:\n    includedNamespaces:\n      list:\n      - name: ns-1\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n'})}),"\n",(0,s.jsx)(n.h3,{id:"\u5728argocd\u4e2d\u4f7f\u7528resourcedistribution-generator",children:"\u5728argocd\u4e2d\u4f7f\u7528ResourceDistribution generator"}),"\n",(0,s.jsxs)(n.p,{children:["\u5728argocd\u4e2d\uff0ckustomize\u63d2\u4ef6\u7684\u4f7f\u7528\u65b9\u6cd5\u540c\u4e0a\u3002\u9664\u6b64\u4e4b\u5916\uff0c\u8fd8\u9700\u4e3akustomize\u6dfb\u52a0\u5141\u8bb8\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684\u6784\u5efa\u9009\u9879\u3002\u5728kubernetes\u96c6\u7fa4\u4e2d\u627e\u5230\u540d\u4e3aargocd-cm\u7684configmap\uff0c\u5728",(0,s.jsx)(n.code,{children:"data"}),"\u5b57\u6bb5\u6dfb\u52a0\u5982\u4e0b\u5185\u5bb9",(0,s.jsx)(n.code,{children:"kustomize.buildOptions: --enable-alpha-plugins --enable-exec"}),"\uff0c\u5373\u53ef\u4e3a\u9ed8\u8ba4\u7248\u672c\u7684kustomize\u6dfb\u52a0\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684\u6784\u5efa\u9009\u9879\u3002\u66f4\u591a\u5185\u5bb9\u53ef\u53c2\u8003",(0,s.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/#kustomize-build-optionsparameters",children:"ArgoCD"}),"\u3002",(0,s.jsxs)(n.strong,{children:["\u4f60\u53ef\u4ee5\u76f4\u63a5\u5728argocd\u4e2d\u4f7f\u7528\u8fd9\u4e2a",(0,s.jsx)(n.a,{href:"https://github.com/openkruise/samples/tree/master/resourcedistribution-generator",children:"\u6837\u4f8b"})]}),"\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: argocd-cm\n  namespace: argocd\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\ndata:\n    kustomize.buildOptions: --enable-alpha-plugins --enable-exec\n"})}),"\n",(0,s.jsx)(n.h4,{id:"\u4f7f\u7528\u63d2\u4ef6",children:"\u4f7f\u7528\u63d2\u4ef6"}),"\n",(0,s.jsxs)(n.p,{children:["\u5c06resourcedistributiongenerator\u63d2\u4ef6\u6dfb\u52a0\u5230argocd\u7684git\u5b58\u50a8\u5e93\u4e2d\uff0c\u5e76\u5728\u6ce8\u89e3",(0,s.jsx)(n.code,{children:"config.kubernetes.io/function"}),"\u586b\u5165\u63d2\u4ef6\u4f4d\u7f6e"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ...\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u901a\u8fc7kustomization.yaml\u7684generator\u5b57\u6bb5\u5f15\u7528\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u4e0a\u4f20git\u4ed3\u5e93\u540e\uff0c\u901a\u8fc7",(0,s.jsx)(n.code,{children:"argocd app sync myapp"}),"\u547d\u4ee4\uff0c\u6216\u8005\u70b9\u51fbUI\u4e2d\u7684SYNC\u6309\u94ae\uff0c\u90e8\u7f72\u9879\u76ee\u5373\u53ef\u3002"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"ContainerRecreateRequest",src:i(21529).A+"",width:"2012",height:"1138"})})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
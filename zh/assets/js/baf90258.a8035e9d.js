"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9485],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return k}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),u=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=u(e.components);return r.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=u(t),k=a,d=m["".concat(l,".").concat(k)]||m[k]||c[k]||i;return t?r.createElement(d,o(o({ref:n},p),{},{components:t})):r.createElement(d,o({ref:n},p))}));function k(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<i;u++)o[u]=t[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},2768:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return l},default:function(){return k},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return c}});var r=t(7462),a=t(3366),i=(t(7294),t(3905)),o=["components"],s={title:"Kustomize ResourceDistribution Generator"},l=void 0,u={unversionedId:"cli-tool/kustomize-plugin",id:"version-v1.4/cli-tool/kustomize-plugin",title:"Kustomize ResourceDistribution Generator",description:"Kruise-tools \u4e3a kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4f5c\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684generator\u548ctransformers\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.4/cli-tool/kustomize-plugin.md",sourceDirName:"cli-tool",slug:"/cli-tool/kustomize-plugin",permalink:"/zh/docs/v1.4/cli-tool/kustomize-plugin",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kustomize-plugin.md",tags:[],version:"v1.4",lastUpdatedBy:"berg",lastUpdatedAt:1680507223,formattedLastUpdatedAt:"2023/4/3",frontMatter:{title:"Kustomize ResourceDistribution Generator"},sidebar:"docs",previous:{title:"Kubectl Plugin",permalink:"/zh/docs/v1.4/cli-tool/kubectl-plugin"},next:{title:"FAQ",permalink:"/zh/docs/v1.4/faq"}},p={},c=[{value:"ResourceDistribution Generator",id:"resourcedistribution-generator",level:2},{value:"\u4e0b\u8f7dResourceDistribution generaotor",id:"\u4e0b\u8f7dresourcedistribution-generaotor",level:3},{value:"API\u8bf4\u660e",id:"api\u8bf4\u660e",level:3},{value:"Resource\u5b57\u6bb5\u8bf4\u660e",id:"resource\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"ResourceDistribution from File",id:"resourcedistribution-from-file",level:4},{value:"ResourceDistribution from Literals",id:"resourcedistribution-from-literals",level:4},{value:"ResourceDistribution from env file",id:"resourcedistribution-from-env-file",level:4},{value:"Targets\u5b57\u6bb5\u8bf4\u660e",id:"targets\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"Options\u548cResourceOptions\u5b57\u6bb5\u8bf4\u660e",id:"options\u548cresourceoptions\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"\u5b8c\u6574\u7528\u4f8b",id:"\u5b8c\u6574\u7528\u4f8b",level:3},{value:"\u5728argocd\u4e2d\u4f7f\u7528ResourceDistribution generator",id:"\u5728argocd\u4e2d\u4f7f\u7528resourcedistribution-generator",level:3},{value:"\u4f7f\u7528\u63d2\u4ef6",id:"\u4f7f\u7528\u63d2\u4ef6",level:4}],m={toc:c};function k(e){var n=e.components,s=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},m,s,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise-tools"},"Kruise-tools")," \u4e3a kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4f5c\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684generator\u548ctransformers\u3002"),(0,i.kt)("h2",{id:"resourcedistribution-generator"},"ResourceDistribution Generator"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"ResourceDistribution Generator\u63d2\u4ef6\u4ece v1.0.0 (alpha/beta) \u5f00\u59cb\uff0c\u8981\u6c42\u4f7f\u7528 Kustomize >= 4.3.0 \u7684\u7248\u672c\uff0c\u5b89\u88c5\u53c2\u8003 ",(0,i.kt)("a",{parentName:"p",href:"https://kubectl.docs.kubernetes.io/installation/kustomize/"},"kustomize"),"\u3002")),(0,i.kt)("p",null,"\u5728\u4f7f\u7528kustomize\u7ba1\u7406\u5e94\u7528\u65f6\uff0c\u5229\u7528kustomize\u81ea\u5e26\u7684generator\u80fd\u591f\u76f4\u63a5\u8bfb\u53d6\u6587\u4ef6\u4f5c\u4e3adata\u5185\u5bb9\u6765\u521b\u5efaConfigmap\u6216Secret \uff0c\u907f\u514d\u4e86\u624b\u52a8\u590d\u5236\u65f6\u5bb9\u6613\u51fa\u73b0\u7684\u79cd\u79cd\u683c\u5f0f\u9519\u8bef\u3002ResourceDistribution Generator\u4e3akustomize\u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\uff0c\u4f7f\u7528\u8be5\u63d2\u4ef6\u53ef\u4ee5\u5b8c\u6210\u8bfb\u53d6\u6587\u4ef6\u4f5c\u4e3adata\u5185\u5bb9\u6765\u521b\u5efaResourceDistribution\u7684\u5de5\u4f5c\u3002"),(0,i.kt)("h3",{id:"\u4e0b\u8f7dresourcedistribution-generaotor"},"\u4e0b\u8f7dResourceDistribution generaotor"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise-tools/releases"},"\u8be5\u9875\u9762"),"\u63d0\u4f9b\u4e86\u5e38\u89c1\u7248\u672c\u7684\u4e8c\u8fdb\u5236\u6587\u4ef6\u4e0b\u8f7d\u8def\u5f84\u3002\u76ee\u524d",(0,i.kt)("inlineCode",{parentName:"p"},"linux"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"darwin"),"(OS X),",(0,i.kt)("inlineCode",{parentName:"p"},"windows"),"\u63d0\u4f9b",(0,i.kt)("inlineCode",{parentName:"p"},"x86_64"),"\u548c",(0,i.kt)("inlineCode",{parentName:"p"},"arm64"),"\u3002\u5982\u679c\u60a8\u4f7f\u7528\u5176\u4ed6\u4e00\u4e9b\u7cfb\u7edf\u6216\u67b6\u6784\uff0c\u5219\u5fc5\u987b\u4e0b\u8f7d",(0,i.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise-tools/blob/master/cmd/resourcedistributiongenerator"},"\u6e90\u4ee3\u7801"),"\u5e76\u6267\u884c",(0,i.kt)("inlineCode",{parentName:"p"},"go build"),"\u6765\u6784\u5efa\u4e8c\u8fdb\u5236\u6587\u4ef6\u3002"),(0,i.kt)("h3",{id:"api\u8bf4\u660e"},"API\u8bf4\u660e"),(0,i.kt)("p",null,"ResourceDistributionGenerator\u662fkusomize\u7684Exec KRM functions\u63d2\u4ef6\uff0c\u4e3b\u8981\u7531 ",(0,i.kt)("inlineCode",{parentName:"p"},"resource")," \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"targets")," \u4e24\u4e2a\u5b57\u6bb5\u6784\u6210\uff0c\u6784\u5efa\u540e\u4f1a\u751f\u6210\u5bf9\u5e94\u4e8eResourceDistribution\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"resource")," \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"targets")," \u5185\u5bb9\u3002",(0,i.kt)("inlineCode",{parentName:"p"},"metadata"),"\u4e2d\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"name"),"\u7528\u6765\u8bbe\u7f6e\u751f\u6210\u7684resourceDistribution\u7684\u540d\u79f0\uff0c\u6ce8\u89e3",(0,i.kt)("inlineCode",{parentName:"p"},"config.kubernetes.io/function"),"\u4e2d\u9700\u8981\u5199\u5165\u672c\u63d2\u4ef6\u5728\u6587\u4ef6\u7cfb\u7edf\u4e2d\u7684\u8def\u5f84\uff0c\u5982\u679c\u4f7f\u7528\u7684\u662f\u76f8\u5bf9\u8def\u5f84\uff0c\u9700\u8981\u76f8\u5bf9\u4e8e\u5f15\u7528\u914d\u7f6e\u6587\u4ef6\u7684kustomization\u6587\u4ef6\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./plugins/resourcedistributiongenerator\nresource:\n    ... ...\ntargets:\n    ... ...\n")),(0,i.kt)("h3",{id:"resource\u5b57\u6bb5\u8bf4\u660e"},"Resource\u5b57\u6bb5\u8bf4\u660e"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"resource"),"\u5b57\u6bb5\u4e2d\u5185\u5bb9\u7528\u6765\u751f\u6210\u88ab\u5206\u53d1\u7684\u8d44\u6e90\uff0c",(0,i.kt)("inlineCode",{parentName:"p"},"literals"),"\u3001",(0,i.kt)("inlineCode",{parentName:"p"},"files"),"\u3001",(0,i.kt)("inlineCode",{parentName:"p"},"envs"),"\u5b57\u6bb5\u7684\u4f7f\u7528\u548c",(0,i.kt)("a",{parentName:"p",href:"https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/"},"Configmap\u6216Secret Generator"),"\u4e2d\u7528\u6cd5\u76f8\u540c\u3002"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"resourceKind"),": \u6307\u5b9a\u5206\u53d1\u7684\u8d44\u6e90\u7c7b\u578b\uff0cSecret\u6216ConfigMap"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"resourceName"),": \u8bbe\u7f6e\u5206\u53d1\u8d44\u6e90\u7684\u540d\u79f0\uff0c\u5373Secret\u6216ConfigMap\u7684\u540d\u79f0"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"literals"),": \u4f7f\u7528\u7ed9\u5b9a\u7684\u6587\u5b57\u4e2d\u7684\u952e/\u503c\u5bf9\u521b\u5efadata\u5185\u5bb9"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"files"),": \u4f7f\u7528\u7ed9\u5b9a\u6587\u4ef6\u7684\u540d\u79f0\u548c\u5185\u5bb9\u521b\u5efadata\u5185\u5bb9"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"envs"),": \u4f7f\u7528\u6587\u4ef6\u4e2d\u7684\u952e/\u503c\u5bf9\u521b\u5efadata\u5185\u5bb9")),(0,i.kt)("p",null,"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684resource\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - file.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\ntargets:\n    ... ...\n")),(0,i.kt)("h4",{id:"resourcedistribution-from-file"},"ResourceDistribution from File"),(0,i.kt)("p",null,"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u6587\u4ef6\u4e2d\u751f\u6210 - \u4f8b\u5982\u4ece\u4e00\u4e2a java.properties\u6587\u4ef6\u3002"),(0,i.kt)("p",null,"\u793a\u4f8b\uff1a\u4f7f\u7528\u5305\u542b\u6587\u4ef6\u5185\u5bb9\u7684\u6570\u636e\u9879\u751f\u6210 ResourceDistribution\u3002"),(0,i.kt)("p",null,"ResourceDistribution \u5c06\u4ece\u6587\u4ef6\u5185\u5bb9\u4e2d\u586b\u5145\u6570\u636e\u503c\u3002\u6bcf\u4e2a\u6587\u4ef6\u7684\u5185\u5bb9\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7531\u6587\u4ef6\u540d\u4f5c\u4e3akey\u7684\u5355\u4e2a\u6570\u636e\u9879\u3002"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"File Input")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\ntargets:\n    ... ...\n")),(0,i.kt)("p",null,"application.properties"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"FOO=Bar\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Build Output")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      application.properties: |\n        FOO=Bar\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n")),(0,i.kt)("h4",{id:"resourcedistribution-from-literals"},"ResourceDistribution from Literals"),(0,i.kt)("p",null,"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u6587\u5b57\u952e\u503c\u5bf9\u751f\u6210 - \u4f8b\u5982JAVA_HOME=/opt/java/jdk."),(0,i.kt)("blockquote",null,(0,i.kt)("ul",{parentName:"blockquote"},(0,i.kt)("li",{parentName:"ul"},"\u952e/\u503c\u7531 = \u5206\u9694\uff08\u5de6\u4fa7\u662f\u952e\uff09"),(0,i.kt)("li",{parentName:"ul"},"\u6bcf\u4e2a\u6587\u672c\u7684\u503c\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7684\u4e00\u4e2a\u6570\u636e\u9879\uff0c\u8be5\u6570\u636e\u9879\u7684key\u5373\u4e3a\u6587\u672c\u7684key"))),(0,i.kt)("p",null,"\u793a\u4f8b\uff1a\u4f7f\u7528\u4ece\u6587\u5b57\u751f\u6210\u7684 2 \u4e2a\u6570\u636e\u9879\u521b\u5efa\u4e00\u4e2a ResourceDistribution\u3002"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"File Input")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n    - JAVA_TOOL_OPTIONS=-agentlib:hprof\ntargets:\n  ... ...\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Build Output")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      JAVA_TOOL_OPTIONS: -agentlib:hprof\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n")),(0,i.kt)("h4",{id:"resourcedistribution-from-env-file"},"ResourceDistribution from env file"),(0,i.kt)("p",null,"ResourceDistribution \u8d44\u6e90\u53ef\u4ee5\u4ece\u952e\u503c\u5bf9\u751f\u6210\uff0c\u8fd9\u4e0e\u4f7f\u7528\u6587\u5b57\u975e\u5e38\u76f8\u4f3c\uff0c\u4f46\u4eceenv\u6587\u4ef6\u4e2d\u83b7\u53d6\u952e\u503c\u5bf9\u3002 "),(0,i.kt)("blockquote",null,(0,i.kt)("ul",{parentName:"blockquote"},(0,i.kt)("li",{parentName:"ul"},"\u73af\u5883\u6587\u4ef6\u4e2d\u7684\u952e/\u503c\u5bf9\u7528 = \u5206\u9694\uff08\u5de6\u4fa7\u662f\u952e\uff09 "),(0,i.kt)("li",{parentName:"ul"},"\u6bcf\u884c\u7684\u503c\u5c06\u663e\u793a\u4e3a ResourceDistribution \u4e2d\u7531\u5176\u952e\u4f5c\u4e3akey\u7684\u6570\u636e\u9879\u3002"))),(0,i.kt)("p",null,"\u793a\u4f8b\uff1a\u4f7f\u7528\u4eceenv\u6587\u4ef6\u751f\u6210\u7684 3 \u4e2a\u6570\u636e\u9879\u521b\u5efa\u4e00\u4e2a ResourceDistribution\u3002"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"File Input")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  envs:\n    - tracing.env\ntargets:\n  ... ...\n")),(0,i.kt)("p",null,"tracing.env"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"ENABLE_TRACING=true\nSAMPLER_TYPE=probabilistic\nSAMPLER_PARAMETERS=0.1\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Build Output")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      ENABLE_TRACING: "true"\n      SAMPLER_TYPE: "probabilistic"\n      SAMPLER_PARAMETERS: "0.1"\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n')),(0,i.kt)("h3",{id:"targets\u5b57\u6bb5\u8bf4\u660e"},"Targets\u5b57\u6bb5\u8bf4\u660e"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"targets"),"\u5b57\u6bb5\u548cResourceDistribution\u4e2d",(0,i.kt)("inlineCode",{parentName:"p"},"targets"),"\u5b57\u6bb5\u7684\u7528\u6cd5\u57fa\u672c\u76f8\u540c\uff0c\u6ce8\u610f",(0,i.kt)("inlineCode",{parentName:"p"},"includedNamespaces"),"\u548c",(0,i.kt)("inlineCode",{parentName:"p"},"excludedNamespaces"),"\u5b57\u6bb5\u7684\u5185\u5bb9\u76f4\u63a5\u662f\u547d\u540d\u7a7a\u95f4\u7684\u540d\u79f0\u3002"),(0,i.kt)("p",null,"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684targets\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n    ... ...\ntargets:\n  allNamespaces: true\n  excludedNamespaces:\n    - ns-2\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\n')),(0,i.kt)("h3",{id:"options\u548cresourceoptions\u5b57\u6bb5\u8bf4\u660e"},"Options\u548cResourceOptions\u5b57\u6bb5\u8bf4\u660e"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"options"),"\u548c",(0,i.kt)("inlineCode",{parentName:"p"},"resourceOptions"),"\u5b57\u6bb5\u5206\u522b\u7528\u6765\u4e3a\u751f\u6210\u7684ResourceDistribution\u548c\u5176\u4e2d\u7684Resource\uff08\u5373ConfigMap\u6216Secret\uff09\u8bbe\u7f6e\u6ce8\u89e3\u6216\u6807\u7b7e\u3002"),(0,i.kt)("p",null,"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"options"),"\u548c",(0,i.kt)("inlineCode",{parentName:"p"},"resourceOptions"),"\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  ... ...\n  resourceOptions:\n    annotations:\n      dashboard: "1"\n    labels:\n      environment: "dev"\ntargets:\n    ... ...\noptions:\n  annotations:\n    type: "slave"\n  labels:\n    version: "stable"\n')),(0,i.kt)("h3",{id:"\u5b8c\u6574\u7528\u4f8b"},"\u5b8c\u6574\u7528\u4f8b"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"\u521b\u5efa\u4e00\u4e2ademo\u76ee\u5f55\u4f5c\u4e3a\u5de5\u4f5c\u7a7a\u95f4\u5e76\u8fdb\u5165\u3002\u5c06\u4e0b\u8f7d\u7684ResourceDistributionGenerator\u63d2\u4ef6\u653e\u5728\u5f53\u524d\u76ee\u5f55\uff0c\u5e76\u8f93\u5165\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efa\u4e00\u4e2a\u540d\u4e3ardGenerator.yaml\u7684\u914d\u7f6e\u6587\u4ef6\u3002")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'cat > rdGenerator.yaml <<EOF\n#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n  resourceOptions:\n    annotations:\n      dashboard: "1"\noptions:\n  labels:\n    app.kubernetes.io/name: "app1"\ntargets:\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\nEOF\n')),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efaapplication.properties\u6587\u4ef6\u4f5c\u4e3a\u6587\u4ef6\u8f93\u5165\u3002")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"cat > application.properties <<EOF\nFOO=Bar\nFIRST=1\nSECOND=2\nLAST=3\nEOF\n")),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528\u4ee5\u4e0b\u547d\u4ee4\u521b\u5efakustomization\u6587\u4ef6\u3002")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"cat > kustomization.yaml <<EOF\n#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\nEOF\n")),(0,i.kt)("ol",{start:4},(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528",(0,i.kt)("inlineCode",{parentName:"li"},"kustomize build --enable-alpha-plugins --enable-exec ."),"\u547d\u4ee4\u6784\u5efa\u5e94\u7528\uff0c\u6548\u679c\u5982\u4e0b")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  labels:\n    app.kubernetes.io/name: app1\n  name: rdname\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      application.properties: |\n        FOO=Bar\n        FIRST=1\n        SECOND=2\n        LAST=3\n    kind: ConfigMap\n    metadata:\n      annotations:\n        dashboard: "1"\n      name: cmname\n  targets:\n    includedNamespaces:\n      list:\n      - name: ns-1\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n')),(0,i.kt)("h3",{id:"\u5728argocd\u4e2d\u4f7f\u7528resourcedistribution-generator"},"\u5728argocd\u4e2d\u4f7f\u7528ResourceDistribution generator"),(0,i.kt)("p",null,"\u5728argocd\u4e2d\uff0ckustomize\u63d2\u4ef6\u7684\u4f7f\u7528\u65b9\u6cd5\u540c\u4e0a\u3002\u9664\u6b64\u4e4b\u5916\uff0c\u8fd8\u9700\u4e3akustomize\u6dfb\u52a0\u5141\u8bb8\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684\u6784\u5efa\u9009\u9879\u3002\u5728kubernetes\u96c6\u7fa4\u4e2d\u627e\u5230\u540d\u4e3aargocd-cm\u7684configmap\uff0c\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"data"),"\u5b57\u6bb5\u6dfb\u52a0\u5982\u4e0b\u5185\u5bb9",(0,i.kt)("inlineCode",{parentName:"p"},"kustomize.buildOptions: --enable-alpha-plugins --enable-exec"),"\uff0c\u5373\u53ef\u4e3a\u9ed8\u8ba4\u7248\u672c\u7684kustomize\u6dfb\u52a0\u7b2c\u4e09\u65b9\u63d2\u4ef6\u7684\u6784\u5efa\u9009\u9879\u3002\u66f4\u591a\u5185\u5bb9\u53ef\u53c2\u8003",(0,i.kt)("a",{parentName:"p",href:"https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/#kustomize-build-optionsparameters"},"ArgoCD"),"\u3002",(0,i.kt)("strong",{parentName:"p"},"\u4f60\u53ef\u4ee5\u76f4\u63a5\u5728argocd\u4e2d\u4f7f\u7528\u8fd9\u4e2a",(0,i.kt)("a",{parentName:"strong",href:"https://github.com/openkruise/samples/tree/master/resourcedistribution-generator"},"\u6837\u4f8b")),"\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: argocd-cm\n  namespace: argocd\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\ndata:\n    kustomize.buildOptions: --enable-alpha-plugins --enable-exec\n")),(0,i.kt)("h4",{id:"\u4f7f\u7528\u63d2\u4ef6"},"\u4f7f\u7528\u63d2\u4ef6"),(0,i.kt)("p",null,"\u5c06resourcedistributiongenerator\u63d2\u4ef6\u6dfb\u52a0\u5230argocd\u7684git\u5b58\u50a8\u5e93\u4e2d\uff0c\u5e76\u5728\u6ce8\u89e3",(0,i.kt)("inlineCode",{parentName:"p"},"config.kubernetes.io/function"),"\u586b\u5165\u63d2\u4ef6\u4f4d\u7f6e"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ...\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\n")),(0,i.kt)("p",null,"\u901a\u8fc7kustomization.yaml\u7684generator\u5b57\u6bb5\u5f15\u7528\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\n")),(0,i.kt)("p",null,"\u4e0a\u4f20git\u4ed3\u5e93\u540e\uff0c\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"argocd app sync myapp"),"\u547d\u4ee4\uff0c\u6216\u8005\u70b9\u51fbUI\u4e2d\u7684SYNC\u6309\u94ae\uff0c\u90e8\u7f72\u9879\u76ee\u5373\u53ef\u3002"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"ContainerRecreateRequest",src:t(7088).Z,width:"2012",height:"1138"})))}k.isMDXComponent=!0},7088:function(e,n,t){n.Z=t.p+"assets/images/resourcedistributiongenerator-c0493bac80f654213addb9c50fc59743.png"}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7958],{28453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>c});var i=s(96540);const r={},t=i.createContext(r);function a(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(t.Provider,{value:n},e.children)}},34192:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"user-manuals/resourcedistribution","title":"ResourceDistribution","description":"\u5728\u5bf9 Secret\u3001ConfigMap \u7b49 namespace-scoped \u8d44\u6e90\u8fdb\u884c\u8de8 namespace \u5206\u53d1\u53ca\u540c\u6b65\u7684\u573a\u666f\u4e2d\uff0c\u539f\u751f kubernetes \u76ee\u524d\u53ea\u652f\u6301\u7528\u6237 one-by-one \u5730\u8fdb\u884c\u624b\u52a8\u5206\u53d1\u4e0e\u540c\u6b65\uff0c\u5341\u5206\u5730\u4e0d\u65b9\u4fbf\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/resourcedistribution.md","sourceDirName":"user-manuals","slug":"/user-manuals/resourcedistribution","permalink":"/zh/docs/v1.7/user-manuals/resourcedistribution","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/resourcedistribution.md","tags":[],"version":"v1.7","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"ResourceDistribution"},"sidebar":"docs","previous":{"title":"ImagePullJob","permalink":"/zh/docs/v1.7/user-manuals/imagepulljob"},"next":{"title":"PersistentPodState","permalink":"/zh/docs/v1.7/user-manuals/persistentpodstate"}}');var r=s(74848),t=s(28453);const a={title:"ResourceDistribution"},c=void 0,o={},l=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"API \u8bf4\u660e",id:"api-\u8bf4\u660e",level:2},{value:"Resource \u5b57\u6bb5\u8bf4\u660e",id:"resource-\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"Target \u5b57\u6bb5\u8bf4\u660e",id:"target-\u5b57\u6bb5\u8bf4\u660e",level:3},{value:"\u5b8c\u6574\u7528\u4f8b",id:"\u5b8c\u6574\u7528\u4f8b",level:2},{value:"\u5206\u53d1\u8d44\u6e90",id:"\u5206\u53d1\u8d44\u6e90",level:3},{value:"\u5206\u53d1\u72b6\u6001\u8ddf\u8e2a",id:"\u5206\u53d1\u72b6\u6001\u8ddf\u8e2a",level:3},{value:"\u66f4\u65b0\u5e76\u540c\u6b65\u8d44\u6e90",id:"\u66f4\u65b0\u5e76\u540c\u6b65\u8d44\u6e90",level:3},{value:"\u7ea7\u8054\u5220\u9664",id:"\u7ea7\u8054\u5220\u9664",level:3},{value:"Kustomize ResourceDistribution Generator",id:"kustomize-resourcedistribution-generator",level:2}];function d(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"\u5728\u5bf9 Secret\u3001ConfigMap \u7b49 namespace-scoped \u8d44\u6e90\u8fdb\u884c\u8de8 namespace \u5206\u53d1\u53ca\u540c\u6b65\u7684\u573a\u666f\u4e2d\uff0c\u539f\u751f kubernetes \u76ee\u524d\u53ea\u652f\u6301\u7528\u6237 one-by-one \u5730\u8fdb\u884c\u624b\u52a8\u5206\u53d1\u4e0e\u540c\u6b65\uff0c\u5341\u5206\u5730\u4e0d\u65b9\u4fbf\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5178\u578b\u7684\u6848\u4f8b\u6709\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u5f53\u7528\u6237\u9700\u8981\u4f7f\u7528 SidecarSet \u7684 imagePullSecrets \u80fd\u529b\u65f6\uff0c\u8981\u5148\u91cd\u590d\u5730\u5728\u76f8\u5173 namespaces \u4e2d\u521b\u5efa\u5bf9\u5e94\u7684 Secret\uff0c\u5e76\u4e14\u9700\u8981\u786e\u4fdd\u8fd9\u4e9b Secret \u914d\u7f6e\u7684\u6b63\u786e\u6027\u548c\u4e00\u81f4\u6027\u3002"}),"\n",(0,r.jsxs)(n.li,{children:["\u5f53\u7528\u6237\u60f3\u8981\u91c7\u7528 ConfigMap \u6765\u914d\u7f6e\u4e00\u4e9b",(0,r.jsx)(n.strong,{children:"\u901a\u7528"}),"\u7684\u73af\u5883\u53d8\u91cf\u65f6\uff0c\u5f80\u5f80\u9700\u8981\u5728\u591a\u4e2a namespaces \u505a ConfigMap \u7684\u4e0b\u53d1\uff0c\u5e76\u4e14\u540e\u7eed\u7684\u4fee\u6539\u5f80\u5f80\u4e5f\u8981\u6c42\u591a namespaces \u4e4b\u95f4\u4fdd\u6301\u540c\u6b65\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u56e0\u6b64\uff0c\u9762\u5bf9\u8fd9\u4e9b\u9700\u8981\u8de8 namespaces \u8fdb\u884c\u8d44\u6e90\u5206\u53d1\u548c",(0,r.jsx)(n.strong,{children:"\u591a\u6b21\u540c\u6b65"}),"\u7684\u573a\u666f\uff0c\u6211\u4eec\u671f\u671b\u4e00\u79cd\u66f4\u4fbf\u6377\u7684\u5206\u53d1\u548c\u540c\u6b65\u5de5\u5177\u6765\u81ea\u52a8\u5316\u5730\u53bb\u505a\u8fd9\u4ef6\u4e8b\uff0c\u4e3a\u6b64\u6211\u4eec\u8bbe\u8ba1\u5e76\u5b9e\u73b0\u4e86\u4e00\u4e2a\u65b0\u7684CRD --- ",(0,r.jsx)(n.strong,{children:"ResourceDistribution"}),"\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["ResourceDistribution \u76ee\u524d\u652f\u6301 ",(0,r.jsx)(n.strong,{children:"Secret"})," \u548c ",(0,r.jsx)(n.strong,{children:"ConfigMap"})," \u4e24\u7c7b\u8d44\u6e90\u7684\u5206\u53d1\u548c\u540c\u6b65\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"\u4ecekruise v1.5.0\u7248\u672c\u5f00\u59cb"}),"\uff0c\u57fa\u4e8e\u6743\u9650\u7684\u8003\u8651 ResourceDistribution \u80fd\u529b\u9ed8\u8ba4\u5173\u95ed\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7 feature-gate ",(0,r.jsx)(n.em,{children:"ResourceDistributionGate"})," \u6765\u5f00\u542f\uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'$ helm install/upgrade kruise https://... --set featureGates="ResourceDistributionGate=true"\n'})}),"\n",(0,r.jsx)(n.h2,{id:"api-\u8bf4\u660e",children:"API \u8bf4\u660e"}),"\n",(0,r.jsxs)(n.p,{children:["ResourceDistribution\u662f\u4e00\u7c7b ",(0,r.jsx)(n.strong,{children:"cluster-scoped"})," \u7684 CRD\uff0c\u5176\u4e3b\u8981\u7531 ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"resource"})})," \u548c ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"targets"})})," \u4e24\u4e2a\u5b57\u6bb5\u6784\u6210\uff0c\u5176\u4e2d ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"resource"})})," \u5b57\u6bb5\u7528\u4e8e\u63cf\u8ff0\u7528\u6237\u6240\u8981\u5206\u53d1\u7684\u8d44\u6e90\uff0c",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"targets"})})," \u5b57\u6bb5\u7528\u4e8e\u63cf\u8ff0\u7528\u6237\u6240\u8981\u5206\u53d1\u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n  \t... ...\n  targets:\n  \t... ...\n"})}),"\n",(0,r.jsx)(n.h3,{id:"resource-\u5b57\u6bb5\u8bf4\u660e",children:"Resource \u5b57\u6bb5\u8bf4\u660e"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"resource"})})," \u5b57\u6bb5\u5fc5\u987b\u662f\u4e00\u4e2a",(0,r.jsx)(n.strong,{children:"\u5b8c\u6574"}),"\u3001",(0,r.jsx)(n.strong,{children:"\u6b63\u786e"}),"\u7684\u8d44\u6e90\u63cf\u8ff0\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684 ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"resource"})})," \u4f8b\u5b50\u5982\u4e0b\u6240\u793a\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n    apiVersion: v1\n    kind: ConfigMap\n    metadata:\n      name: game-demo\n    data:\n      game.properties: |\n        enemy.types=aliens,monsters\n        player.maximum-lives=5\n      player_initial_lives: "3"\n      ui_properties_file_name: user-interface.properties\n      user-interface.properties: |\n        color.good=purple\n        color.bad=yellow\n        allow.textmode=true\n  targets:\n    ... ...\n'})}),"\n",(0,r.jsx)(n.p,{children:"Tips: \u7528\u6237\u53ef\u4ee5\u5148\u5728\u672c\u5730\u67d0\u4e2a\u547d\u540d\u7a7a\u95f4\u4e2d\u521b\u5efa\u76f8\u5e94\u8d44\u6e90\u5e76\u8fdb\u884c\u6d4b\u8bd5\uff0c\u786e\u8ba4\u8d44\u6e90\u914d\u7f6e\u6b63\u786e\u540e\u518d\u62f7\u8d1d\u8fc7\u6765\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"target-\u5b57\u6bb5\u8bf4\u660e",children:"Target \u5b57\u6bb5\u8bf4\u660e"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"targets"})})," \u5b57\u6bb5\u76ee\u524d\u652f\u6301\u56db\u79cd\u89c4\u5219\u6765\u63cf\u8ff0\u7528\u6237\u6240\u8981\u5206\u53d1\u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\uff0c\u5305\u62ec ",(0,r.jsx)(n.code,{children:"allNamespaces"}),"\u3001",(0,r.jsx)(n.code,{children:"includedNamespaces"}),"\u3001",(0,r.jsx)(n.code,{children:"namespaceLabelSelector"})," \u4ee5\u53ca ",(0,r.jsx)(n.code,{children:"excludedNamespaces"}),"\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"allNamespaces"}),": bool\u503c\uff0c\u5982\u679c\u4e3a",(0,r.jsx)(n.code,{children:"true"}),"\uff0c\u5219\u5206\u53d1\u81f3\u6240\u6709\u547d\u540d\u7a7a\u95f4\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"includedNamespaces"}),": \u901a\u8fc7 Name \u6765\u5339\u914d\u76ee\u6807\u547d\u540d\u7a7a\u95f4\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"namespaceLabelSelector"}),"\uff1a\u901a\u8fc7 LabelSelector \u6765\u5339\u914d\u76ee\u6807\u547d\u540d\u7a7a\u95f4\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"excludedNamespaces"}),": \u901a\u8fc7 Name \u6765\u6392\u9664\u67d0\u4e9b\u4e0d\u60f3\u5206\u53d1\u7684\u547d\u540d\u7a7a\u95f4\uff1b"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u7684\u8ba1\u7b97\u89c4\u5219\uff1a"})}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\u521d\u59cb\u5316\u76ee\u6807\u547d\u540d\u7a7a\u95f4 ",(0,r.jsx)(n.em,{children:"T"})," = \u2205\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5982\u679c\u7528\u6237\u8bbe\u7f6e\u4e86",(0,r.jsx)(n.code,{children:"allNamespaces=true"}),"\uff0c",(0,r.jsx)(n.em,{children:"T"})," \u5219\u4f1a\u5339\u914d\u6240\u6709\u547d\u540d\u7a7a\u95f4\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5c06",(0,r.jsx)(n.code,{children:"includedNamespaces"}),"\u4e2d\u5217\u51fa\u7684\u547d\u540d\u7a7a\u95f4\u52a0\u5165 ",(0,r.jsx)(n.em,{children:"T"}),"\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5c06\u4e0e",(0,r.jsx)(n.code,{children:"namespaceLabelSelector"}),"\u5339\u914d\u7684\u547d\u540d\u7a7a\u95f4\u52a0\u5165 ",(0,r.jsx)(n.em,{children:"T"}),"\uff1b"]}),"\n",(0,r.jsxs)(n.li,{children:["\u5c06",(0,r.jsx)(n.code,{children:"excludedNamespaces"}),"\u4e2d\u5217\u51fa\u7684\u547d\u540d\u7a7a\u95f4\u4ece ",(0,r.jsx)(n.em,{children:"T"})," \u4e2d\u5254\u9664\uff1b"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.strong,{children:[(0,r.jsx)(n.code,{children:"allNamespaces"}),"\u3001",(0,r.jsx)(n.code,{children:"includedNamespaces"}),"\u3001",(0,r.jsx)(n.code,{children:"namespaceLabelSelector"})," \u4e4b\u95f4\u662f \u6216(OR) \u7684\u5173\u7cfb\uff0c\u800c",(0,r.jsx)(n.code,{children:"excludedNamespaces"}),"\u4e00\u65e6\u88ab\u914d\u7f6e\uff0c\u5219\u4f1a\u663e\u5f0f\u5730\u6392\u9664\u6389\u8fd9\u4e9b\u547d\u540d\u7a7a\u95f4\u3002\u53e6\u5916\uff0ctargets\u8fd8\u5c06\u81ea\u52a8\u5ffd\u7565kube-system \u548c kube-public \u4e24\u4e2a\u547d\u540d\u7a7a\u95f4\u3002"]})}),"\n",(0,r.jsx)(n.p,{children:"\u4e00\u4e2a\u914d\u7f6e\u6b63\u786e\u7684targets\u5b57\u6bb5\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n  \t... ...\n  targets:\n    includedNamespaces:\n      list:\n      - name: ns-1\n      - name: ns-4\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n    excludedNamespaces:\n    \tlist:\n      - name: ns-3\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u4e0a\u4f8b\u4e2d\uff0c\u8be5 ResourceDistribution \u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u4e00\u5b9a\u4f1a\u5305\u542bns-1\u548cns-4\uff0c\u5e76\u4e14Labels\u6ee1\u8db3",(0,r.jsx)(n.code,{children:"namespaceLabelSelector"}),"\u7684\u547d\u540d\u7a7a\u95f4\u4e5f\u4f1a\u88ab\u5305\u542b\u8fdb\u76ee\u6807\u547d\u540d\u7a7a\u95f4\uff0c\u4f46\u662f\uff0c\u5373\u4f7fns-3\u5373\u4f7f\u6ee1\u8db3",(0,r.jsx)(n.code,{children:"namespaceLabelSelector"}),"\u4e5f\u4e0d\u4f1a\u88ab\u5305\u542b\uff0c\u56e0\u4e3a\u5b83\u5df2\u7ecf\u5728",(0,r.jsx)(n.code,{children:"excludedNamespaces"}),"\u4e2d\u88ab\u663e\u5f0f\u5730\u6392\u9664\u4e86\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"\u5b8c\u6574\u7528\u4f8b",children:"\u5b8c\u6574\u7528\u4f8b"}),"\n",(0,r.jsx)(n.h3,{id:"\u5206\u53d1\u8d44\u6e90",children:"\u5206\u53d1\u8d44\u6e90"}),"\n",(0,r.jsx)(n.p,{children:"\u5f53\u7528\u6237\u5c06 ResourceDistribution \u7684 resource \u548c targets \u4e24\u4e2a\u5b57\u6bb5\u6b63\u786e\u914d\u7f6e\uff0c\u5e76\u521b\u5efa\u8fd9\u4e2a ResourceDistribution \u8d44\u6e90\u540e\uff0c\u76f8\u5e94\u7684 Controller \u4f1a\u6267\u884c\u8d44\u6e90\u5206\u53d1\u903b\u8f91\uff0c\u8fd9\u4e00\u8d44\u6e90\u4f1a\u81ea\u52a8\u5730\u5728\u5404\u4e2a\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u4e2d\u521b\u5efa\u3002\u4e00\u4e2a\u5b8c\u6574\u7684\u7528\u4f8b\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n    apiVersion: v1\n    kind: ConfigMap\n    metadata:\n      name: game-demo\n    data:\n      game.properties: |\n        enemy.types=aliens,monsters\n        player.maximum-lives=5\n      player_initial_lives: "3"\n      ui_properties_file_name: user-interface.properties\n      user-interface.properties: |\n        color.good=purple\n        color.bad=yellow\n        allow.textmode=true\n  targets:\n    excludedNamespaces:\n      list:\n      - name: ns-3\n    includedNamespaces:\n      list:\n      - name: ns-1\n      - name: ns-4\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n'})}),"\n",(0,r.jsx)(n.h3,{id:"\u5206\u53d1\u72b6\u6001\u8ddf\u8e2a",children:"\u5206\u53d1\u72b6\u6001\u8ddf\u8e2a"}),"\n",(0,r.jsx)(n.p,{children:"\u5f53\u7136\uff0c\u8d44\u6e90\u5206\u53d1\u5e76\u4e0d\u603b\u662f\u6210\u529f\u7684\uff0c\u5728\u5206\u53d1\u7684\u8fc7\u7a0b\u4e2d\u53ef\u80fd\u4f1a\u9047\u5230\u5404\u79cd\u5404\u6837\u7684\u9519\u8bef\u5bfc\u81f4\u5206\u53d1\u5931\u8d25\u3002\u4e3a\u6b64\uff0c\u6211\u4eec\u5728ResourceDistribution.Status\u5b57\u6bb5\u4e2d\u8bb0\u5f55\u4e86\u8d44\u6e90\u5206\u53d1\u7684\u4e00\u4e9b\u72b6\u6001\uff0c\u4ee5\u4fbf\u7528\u6237\u5bf9\u5176\u8fdb\u884c\u8ffd\u8e2a\u3002\n\u9996\u5148\uff0cStatus\u8bb0\u5f55\u4e86\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u603b\u6570(Desired)\u3001\u6210\u529f\u5206\u53d1\u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u6570\u91cf(Succeeded)\u3001\u4ee5\u53ca\u5931\u8d25\u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u6570\u91cf(Failed)\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"status:\n  Desired:                 3\n  Failed:                  1\n  Succeeded:               2\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u4e3a\u4e86\u8fdb\u4e00\u6b65\u65b9\u4fbf\u7528\u6237\u4e86\u89e3\u5206\u53d1\u5931\u8d25\u7684\u539f\u56e0\u53ca\u5730\u70b9\uff08\u547d\u540d\u7a7a\u95f4\uff09\uff0cResourceDistribution \u8fd8\u5bf9\u5206\u53d1\u9519\u8bef\u7c7b\u578b\u8fdb\u884c\u4e86\u5f52\u7eb3\u6574\u7406\uff0c\u603b\u5171\u5206\u4e3a\u4e86\u516d\u7c7b\uff0c\u5e76\u8bb0\u5f55\u5728status.conditions\u4e4b\u4e2d\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u56db\u7c7b condition \u8bb0\u5f55\u4e86\u64cd\u4f5c\u8d44\u6e90\u65f6\u51fa\u73b0\u5931\u8d25\u7684\u76f8\u5173\u539f\u56e0\uff0c\u5373\u8bb0\u5f55\u8d44\u6e90\u7684 Get\u3001Create\u3001 Update \u548c Delete \u56db\u7c7b\u64cd\u4f5c\u51fa\u73b0\u7684\u9519\u8bef\u4fe1\u606f\u4ee5\u53ca\u5bf9\u5e94\u7684\u5931\u8d25\u547d\u540d\u7a7a\u95f4\uff1b"}),"\n",(0,r.jsx)(n.li,{children:"\u4e00\u7c7b condition \u8bb0\u5f55\u4e86\u547d\u540d\u7a7a\u95f4\u4e0d\u5b58\u5728\u7684\u9519\u8bef\uff1b"}),"\n",(0,r.jsx)(n.li,{children:"\u4e00\u7c7b condition \u8bb0\u5f55\u4e86\u8d44\u6e90\u51b2\u7a81\u7684\u60c5\u51b5\uff0c\u5373\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u4e2d\u5df2\u7ecf\u5b58\u5728Name\u3001Kind\u3001APIVersion\u90fd\u76f8\u540c\u7684\u8d44\u6e90\uff0c\u4e14\u8be5\u8d44\u6e90\u4e0d\u662f\u8be5ResourceDistribution\u5206\u53d1\uff0c\u5219\u4f1a\u53d1\u751f\u8d44\u6e90\u51b2\u7a81\uff0c\u76f8\u5e94\u7684\u547d\u540d\u7a7a\u95f4\u4f1a\u88ab\u8bb0\u5f55\u4e0b\u6765\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"Status:\n  Conditions:\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  GetResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  CreateResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  UpdateResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  DeleteResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  ConflictOccurred\n    Failed Namespace:\n      ns-1\n      ns-4\n    Last Transition Time:  2021-09-06T08:45:08Z\n    Reason:                namespace not found\n    Status:                True\n    Type:                  NamespaceNotExists\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u4e0a\u8ff0\u4f8b\u5b50\u9047\u5230\u76ee\u6807\u547d\u540d\u7a7a\u95f4 ns-1 \u548c ns-4 \u4e0d\u5b58\u5728\u7684\u9519\u8bef\uff0c\u76f8\u5e94\u7684\u9519\u8bef\u7c7b\u578b\u548c\u547d\u540d\u7a7a\u95f4\u88ab\u8bb0\u5f55\u4e86\u4e0b\u6765\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u66f4\u65b0\u5e76\u540c\u6b65\u8d44\u6e90",children:"\u66f4\u65b0\u5e76\u540c\u6b65\u8d44\u6e90"}),"\n",(0,r.jsx)(n.p,{children:"ResourceDistribution \u5141\u8bb8\u7528\u6237\u66f4\u65b0resource\u5b57\u6bb5\uff0c\u5373\u66f4\u65b0\u8d44\u6e90\uff0c\u5e76\u4e14\u4f1a\u81ea\u52a8\u5730\u5bf9\u6240\u6709\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u4e2d\u7684\u8d44\u6e90\u8fdb\u884c\u540c\u6b65\u66f4\u65b0\u3002\n\u6bcf\u4e00\u6b21\u66f4\u65b0\u8d44\u6e90\u65f6\uff0cResourceDistribution \u90fd\u4f1a\u8ba1\u7b97\u65b0\u7248\u672c\u8d44\u6e90\u7684\u54c8\u5e0c\u503c\uff0c\u5e76\u8bb0\u5f55\u5230\u8d44\u6e90\u7684Annotations\u4e4b\u4e2d\uff0c\u5f53 ResourceDistribution \u53d1\u73b0\u65b0\u7248\u672c\u7684\u8d44\u6e90\u4e0e\u76ee\u524d\u8d44\u6e90\u7684\u54c8\u5e0c\u503c\u4e0d\u540c\u65f6\uff0c\u624d\u4f1a\u5bf9\u8d44\u6e90\u8fdb\u884c\u66f4\u65b0\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: game-demo\n  annotations:\n    kruise.io/resourcedistribution.resource.from: sample\n    kruise.io/resourcedistribution.resource.distributed.timestamp: 2021-09-06 08:44:52.7861421 +0000 UTC m=+12896.810364601\n    kruise.io/resourcedistribution.resource.hashcode: 0821a13321b2c76b5bd63341a0d97fb46bfdbb2f914e2ad6b613d10632fa4b63\n... ...\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"\u7279\u522b\u5730\uff0c\u6211\u4eec\u975e\u5e38\u4e0d\u5efa\u8bae\u7528\u6237\u7ed5\u8fc7 ResourceDistribution \u76f4\u63a5\u5bf9\u8d44\u6e90\u8fdb\u884c\u4fee\u6539\uff0c\u9664\u975e\u7528\u6237\u77e5\u9053\u81ea\u5df1\u5728\u505a\u4ec0\u4e48"}),"\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u76f4\u63a5\u4fee\u6539\u8d44\u6e90\u540e\uff0c\u8d44\u6e90\u7684\u54c8\u5e0c\u503c\u4e0d\u4f1a\u88ab\u81ea\u52a8\u8ba1\u7b97\uff0c\u56e0\u6b64\uff0c\u4e0b\u6b21 resource\u5b57\u6bb5\u88ab\u4fee\u6539\u540e\uff0c",(0,r.jsx)(n.strong,{children:"ResourceDistribution \u53ef\u80fd\u5c06\u7528\u6237\u5bf9\u8fd9\u4e9b\u8d44\u6e90\u7684\u76f4\u63a5\u4fee\u6539\u8986\u76d6\u6389"}),"\uff1b"]}),"\n",(0,r.jsx)(n.li,{children:"ResourceDistribution \u901a\u8fc7 kruise.io/resourcedistribution.resource.from \u6765\u5224\u65ad\u8d44\u6e90\u662f\u5426\u7531\u8be5 ResourceDistribution \u5206\u53d1\uff0c\u5982\u679c\u8be5 Annotation \u88ab\u4fee\u6539\u6216\u5220\u9664\uff0c\u5219\u88ab\u4fee\u6539\u7684\u8d44\u6e90\u4f1a\u88ab ResourceDistribution \u5f53\u6210\u51b2\u7a81\u8d44\u6e90\uff0c\u5e76\u4e14\u65e0\u6cd5\u901a\u8fc7  ResourceDistribution \u8fdb\u884c\u540c\u6b65\u66f4\u65b0\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"\u7ea7\u8054\u5220\u9664",children:"\u7ea7\u8054\u5220\u9664"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"ResourceDistribution \u901a\u8fc7 OwnerReference \u6765\u7ba1\u63a7\u6240\u5206\u53d1\u7684\u8d44\u6e90\u3002\u56e0\u6b64\uff0c\u9700\u8981\u7279\u522b\u6ce8\u610f\uff0c\u5f53 ResourceDistribution \u88ab\u5220\u9664\u65f6\uff0c\u5176\u6240\u5206\u53d1\u7684\u6240\u6709\u8d44\u6e90\u4e5f\u4f1a\u88ab\u5220\u9664\u3002"})}),"\n",(0,r.jsx)(n.h2,{id:"kustomize-resourcedistribution-generator",children:"Kustomize ResourceDistribution Generator"}),"\n",(0,r.jsxs)(n.p,{children:["ResourceDistribution Generator \u4e3a kustomize \u7684\u7b2c\u4e09\u65b9\u63d2\u4ef6\uff0c\u7c7b\u4f3c\u4e8e kustomize \u7684 configmap generator \u548c secret generator\uff0c\u4f7f\u7528\u8be5\u63d2\u4ef6\u53ef\u4ee5\u5b8c\u6210\u8bfb\u53d6\u6587\u4ef6\u4f5c\u4e3a data \u5185\u5bb9\u6765\u521b\u5efa ResourceDistribution \u7684\u5de5\u4f5c\u3002\u5177\u4f53\u5185\u5bb9\u53c2\u8003",(0,r.jsx)(n.a,{href:"/zh/docs/next/cli-tool/kustomize-plugin",children:"\u6b64\u9875\u9762"})]})]})}function u(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2365],{12060:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/debug-lua-941e65f925603f43ed7c241c7615cf40.gif"},28453:(e,n,s)=>{s.d(n,{R:()=>l,x:()=>r});var a=s(96540);const i={},t=a.createContext(i);function l(e){const n=a.useContext(t);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),a.createElement(t.Provider,{value:n},e.children)}},62077:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/test-lua-886b3c9ee4711a35e7bea651128e31fb.gif"},69342:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/custom-workflow-50d262e1c57f2046adddd81b26f0b827.png"},79457:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>u,frontMatter:()=>l,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"developer-manuals/custom-network-provider","title":"\u4f7f\u7528Lua\u811a\u672c\u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531","description":"FEATURE STATE: Kruise Rollout v0.5.0","source":"@site/i18n/zh/docusaurus-plugin-content-docs-rollouts/current/developer-manuals/custom-network-provider.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/custom-network-provider","permalink":"/zh/rollouts/developer-manuals/custom-network-provider","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"\u5168\u94fe\u8def\u7070\u5ea6","permalink":"/zh/rollouts/user-manuals/strategy-end2end-canary-update"},"next":{"title":"\u4f7f\u7528Istio\u4f5c\u6d41\u91cf\u8def\u7531","permalink":"/zh/rollouts/best-practices/traffic-routing-istio-api"}}');var i=s(74848),t=s(28453);const l={},r="\u4f7f\u7528Lua\u811a\u672c\u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531",o={},c=[{value:"\u5de5\u4f5c\u539f\u7406",id:"\u5de5\u4f5c\u539f\u7406",level:2},{value:"\u5982\u4f55\u5b9a\u4e49\u60a8\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173Lua \u811a\u672c",id:"\u5982\u4f55\u5b9a\u4e49\u60a8\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173lua-\u811a\u672c",level:2},{value:"\u65b9\u6cd51\uff1a\u4f7f\u7528Kruise Rollout\u5185\u7f6e\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c",id:"\u65b9\u6cd51\u4f7f\u7528kruise-rollout\u5185\u7f6e\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c",level:3},{value:"\u6d4b\u8bd5\u6848\u4f8b\u9700\u8981\u8986\u76d6\u7684\u573a\u666f",id:"\u6d4b\u8bd5\u6848\u4f8b\u9700\u8981\u8986\u76d6\u7684\u573a\u666f",level:4},{value:"\u65b9\u6cd52: \u5728ConfigMap\u4e2d\u5b9a\u4e49Lua\u811a\u672c",id:"\u65b9\u6cd52-\u5728configmap\u4e2d\u5b9a\u4e49lua\u811a\u672c",level:3},{value:"\u7f16\u5199\u81ea\u5df1\u7684\u6d41\u91cf\u7f51\u5173Lua\u811a\u672c\u6765\u63a7\u5236\u6d41\u91cf\u8def\u7531",id:"\u7f16\u5199\u81ea\u5df1\u7684\u6d41\u91cf\u7f51\u5173lua\u811a\u672c\u6765\u63a7\u5236\u6d41\u91cf\u8def\u7531",level:2},{value:"Lua \u8bed\u6cd5",id:"lua-\u8bed\u6cd5",level:3},{value:"Lua \u6570\u636e\u7c7b\u578bs",id:"lua-\u6570\u636e\u7c7b\u578bs",level:4},{value:"Lua Table",id:"lua-table",level:4},{value:"\u516c\u5171\u51fd\u6570",id:"\u516c\u5171\u51fd\u6570",level:4},{value:"\u5904\u7406\u7f51\u5173\u8d44\u6e90",id:"\u5904\u7406\u7f51\u5173\u8d44\u6e90",level:3},{value:"\u8c03\u8bd5\u60a8\u7684Lua Script",id:"\u8c03\u8bd5\u60a8\u7684lua-script",level:3},{value:"\u6388\u6743Kruise Rollout \u8bbf\u95ee\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90",id:"\u6388\u6743kruise-rollout-\u8bbf\u95ee\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\u4f7f\u7528lua\u811a\u672c\u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531",children:"\u4f7f\u7528Lua\u811a\u672c\u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise Rollout v0.5.0"]}),"\n",(0,i.jsxs)(n.p,{children:["Kruise Rollout \u5229\u7528\u4e00\u79cd\u57fa\u4e8eLua\u811a\u672c\u7684\u5b9a\u5236\u65b9\u6cd5\uff0c\u7528\u6765\u63a7\u5236",(0,i.jsx)(n.strong,{children:"\u6d41\u91cf\u7f51\u5173\u8d44\u6e90(\u4f8b\u5982Istio\u7684VirtualService, Apisix\u7684ApisixRoute, Kuma\u7684Traffic Route\u7b49)"}),"\u3002Kruise Rollout \u4f1a\u6839\u636e\u53d1\u5e03\u7b56\u7565\u4ee5\u53ca\u6d41\u91cf\u7f51\u5173\u7684\u539f\u59cb\u914d\u7f6e\uff0c\u901a\u8fc7\u8c03\u7528Lua\u811a\u672c\u6765\u83b7\u53d6\u548c\u66f4\u65b0\u671f\u671b\u7684\u6d41\u91cf\u8def\u7531\u914d\u7f6e\u3002\u8fd9\u79cd\u673a\u5236\u8ba9\u7528\u6237\u53ef\u4ee5\u5c06\u5404\u79cd\u6d41\u91cf\u7f51\u5173\u5b9e\u73b0\u9002\u914d\u5230Kruise Rollout\u4e2d, \u800c\u4e0d\u9700\u8981\u4fee\u6539\u73b0\u6709\u7684Kruise\u4ee3\u7801\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u56e0\u4e3aKruise Rollout \u4e5f\u652f\u6301\u4f7f\u7528Gateway API \u6765\u6307\u5b9a\u6d41\u91cf\u8def\u7531\uff0c\u7528\u6237\u4e5f\u53ef\u4ee5\u4f7f\u7528\u6d41\u91cf\u7f51\u5173\u5bf9\u5e94\u7684Gateway API\u3002 \u7136\u800c\uff0c\u5b9e\u73b0\u4e00\u4e2a\u5b8c\u6574\u7684Gateway API\u5de5\u4f5c\u91cf\u5f88\u5927\uff0c \u5373\u4f7f\u5bf9\u4e8e\u63d0\u4f9b\u4e86K8s CRD\u7684\u63a5\u53e3Gateway API \u63d0\u4f9b\u5546\uff0c\u5f88\u591a\u4e5f\u6ca1\u6709\u63d0\u4f9b\u5bf9\u5e94\u7684Gateway API \u5b9e\u73b0\u7248\u672c\u3002\u901a\u8fc7Lua\u811a\u672c\uff0c \u7528\u6237\u53ef\u4ee5\u4e3a\u4efb\u610f\u7684\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u6765\u6765\u914d\u7f6e\u6d41\u91cf\u8def\u7531\uff0c \u907f\u514d\u4e86\u5f15\u5165Gateway API \u5b9e\u73b0\u7684\u590d\u6742\u6027\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u5de5\u4f5c\u539f\u7406",children:"\u5de5\u4f5c\u539f\u7406"}),"\n",(0,i.jsx)("img",{src:s(69342).A}),"\n",(0,i.jsx)(n.p,{children:"\u4f7f\u7528\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u7684\u53d1\u5e03\u6d41\u7a0b\u5982\u4e0b\uff1a"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"\u7528\u6237\u5b9a\u4e49\u91d1\u4e1d\u96c0\u53d1\u5e03\u7684\u6d41\u91cf\u8def\u7531\u89c4\u5219\uff0c \u4ee5\u53ca\u9700\u8981\u4fee\u6539\u7684\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\uff0c\u4ece\u800c\u53d1\u8d77\u53d1\u5e03"}),"\n",(0,i.jsx)(n.li,{children:"Kruise Rollout \u6839\u636eRollout\u5bf9\u8c61\u7684\u914d\u7f6e\uff0c\u83b7\u53d6\u5bf9\u5e94\u7684\u6d41\u91cf\u7f51\u5173\u8d44\u6e90, \u4ee5\u53ca\u5173\u8054\u7684Lua\u811a\u672c"}),"\n",(0,i.jsxs)(n.li,{children:["\u5f53\u53d1\u5e03\u5f00\u59cb\u65f6\uff0c Kruise Rollout\u9996\u5148\u628a\u5f53\u524d\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684\u914d\u7f6e\u8f6c\u6362\u6210\u5b57\u7b26\u4e32\uff0c \u5e76\u4fdd\u5b58\u5728\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684annotation ",(0,i.jsx)(n.code,{children:"rollouts.kruise.io/original-spec-configuration"})]}),"\n",(0,i.jsx)(n.li,{children:"\u628aRollout\u914d\u7f6e\u4ee5\u53ca\u5bf9\u5e94\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684\u914d\u7f6e\u4f5c\u4e3a\u8f93\u5165\uff0c \u4f20\u9012\u7ed9\u7528\u6237\u914d\u7f6e\u7684Lua\u811a\u672c\uff0cLua\u811a\u672c\u4f1a\u4ea7\u751f\u65b0\u7684\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u914d\u7f6e, \u5e76\u7531Kruise Rolout\u66f4\u65b0\u5230k8s\u4e2d"}),"\n",(0,i.jsxs)(n.li,{children:["\u5f53\u53d1\u5e03\u5b8c\u6210\u540e\uff0c \u4ece\u7f51\u5173\u8d44\u6e90\u7684annotation ",(0,i.jsx)(n.code,{children:"rollouts.kruise.io/original-spec-configuration"})," \u4e2d\u83b7\u53d6\u539f\u6709\u7684\u7f51\u5173\u8d44\u6e90\u914d\u7f6e\uff0c \u5e76\u6062\u590d\u914d\u7f6e\u5230k8s\u4e2d\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u5728Rollout\u8d44\u6e90\u4e2d\uff0c \u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531\u89c4\u5219\u53ef\u4ee5\u6309\u5982\u4e0b\u683c\u5f0f\u914d\u7f6e"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\n...\nspec:\n  strategy:\n    canary:\n      trafficRoutings:\n      - service: <stable-service>\n        customNetworkRefs:\n        - apiVersion: <your-resource-apiVersion>\n          kind: <your-resource-kind>\n          name: <your-resource-name>\n"})}),"\n",(0,i.jsx)(n.p,{children:"API \u5b57\u6bb5\u7684\u8be6\u7ec6\u4ecb\u7ecd\u5982\u4e0b::"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"\u5b57\u6bb5"}),(0,i.jsx)(n.th,{children:"\u7c7b\u578b"}),(0,i.jsx)(n.th,{children:"\u9ed8\u8ba4\u503c"}),(0,i.jsx)(n.th,{children:"\u63cf\u8ff0"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"customNetworkRefs"})}),(0,i.jsx)(n.td,{children:"object"}),(0,i.jsx)(n.td,{children:"nil"}),(0,i.jsx)(n.td,{children:"\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684\u5b9a\u4e49"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"customNetworkRefs.apiVersion"})}),(0,i.jsx)(n.td,{children:"string"}),(0,i.jsx)(n.td,{children:'""'}),(0,i.jsx)(n.td,{children:"\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684API\u7248\u672c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"customNetworkRefs.kind"})}),(0,i.jsx)(n.td,{children:"string"}),(0,i.jsx)(n.td,{children:'""'}),(0,i.jsx)(n.td,{children:"\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684API\u7c7b\u578b"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"customNetworkRefs.name"})}),(0,i.jsx)(n.td,{children:"string"}),(0,i.jsx)(n.td,{children:'""'}),(0,i.jsx)(n.td,{children:"\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684\u540d\u5b57"})]})]})]}),"\n",(0,i.jsx)(n.h2,{id:"\u5982\u4f55\u5b9a\u4e49\u60a8\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173lua-\u811a\u672c",children:"\u5982\u4f55\u5b9a\u4e49\u60a8\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173Lua \u811a\u672c"}),"\n",(0,i.jsx)(n.p,{children:"\u6709\u4e24\u79cd\u65b9\u5f0f\u6765\u5b9a\u4e49\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c:"}),"\n",(0,i.jsx)(n.h3,{id:"\u65b9\u6cd51\u4f7f\u7528kruise-rollout\u5185\u7f6e\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c",children:"\u65b9\u6cd51\uff1a\u4f7f\u7528Kruise Rollout\u5185\u7f6e\u7684\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c"}),"\n",(0,i.jsx)(n.p,{children:"\u60a8\u53ef\u4ee5\u8d21\u732e\u60a8\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u7684Lua\u811a\u672c\u5230\u793e\u533a\uff0c \u4e00\u65e6\u901a\u8fc7\u4e86\u76f8\u5173\u6d4b\u8bd5\u5e76\u88ab\u793e\u533a\u63a5\u53d7\u4e3a\u5185\u7f6e\u7684\u6d41\u91cf\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c\uff0c Lua\u811a\u672c\u4f1a\u548cKruise Rollout\u6253\u5305\u5728\u4e00\u8d77\u3002\u8fd9\u79cd\u811a\u672c\u53ef\u4ee5\u76f4\u63a5\u5728Rollout\u4e2d\u4f7f\u7528\uff1a"}),"\n",(0,i.jsxs)(n.p,{children:["Kruise Rollout \u9ed8\u8ba4\u4f1a\u8c03\u7528\u4f4d\u4e8e",(0,i.jsx)(n.code,{children:"rollouts/lua_configuration"})," \u76ee\u5f55\u7684Lua\u811a\u672c\u3002 \u8fd9\u4e9b\u5185\u7f6e\u7684Lua\u811a\u672c\u9700\u8981\u9075\u5faa\u5982\u4e0b\u7684\u76ee\u5f55\u7ed3\u6784:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-plain",children:"rollouts\n|-- lua_configuration\n|    |-- your.crd.group.io                    # CRD group\n|    |    |-- MyKind                          # Resource kind\n|    |    |    |-- trafficRouting.lua         # Custom traffic routing Lua script\n|    |    |    |-- testdata                   # Directory with test resource YAML definitions\n|\t\t |\t\t|\t\t |\t\t|-- test_case1.yaml       # Lua script test case\n|\t\t |\t\t|\t\t |\t\t|-- test_case2.yaml       # Lua script test case\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u5176\u4e2d\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"trafficRouting.lua"})," \u5b9a\u4e49\u4e86\u5904\u7406\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u7684Lua\u811a\u672c"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"testdata"})," \u76ee\u5f55\u5b9a\u4e49\u4e86\u6d4b\u8bd5\u7684\u76ee\u5f55\uff0c\u6d4b\u8bd5\u76ee\u5f55\u4e2d\u6bcf\u4e2ayaml\u6587\u4ef6\u5305\u542b\u4e86\u5177\u4f53\u7684\u6d4b\u8bd5\u6848\u4f8b\uff0c YAML\u6587\u4ef6\u7684\u683c\u5f0f\u5982\u4e0b"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"rollout:\n\t# Rollout\u8d44\u6e90\u914d\u7f6e\ntrafficRouting:\n        # \u5355\u72ec\u7684trafficRouting\u8d44\u6e90\u914d\u7f6e\u3010\u53ef\u9009\u3011\noriginal:\n\t# \u539f\u6709\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u914d\u7f6e\nexpected:\n\t# \u91d1\u4e1d\u96c0\u8fc7\u7a0b\u4e2d\uff0c\u6d41\u91cf\u8def\u7531\u4fee\u6539\u540e\uff0c\u671f\u671b\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u914d\u7f6e\uff08\u6bcf\u4e2a\u91d1\u4e1d\u96c0\u6b65\u9aa4\u4e00\u4e2a\u914d\u7f6e\uff09\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u811a\u672c\u5fc5\u987b\u63d0\u4f9b\u6d4b\u8bd5\u6848\u4f8b\uff0c\u5e76\u901a\u8fc7\u6d4b\u8bd5\u6765\u8bc1\u660e\u5176\u53ef\u5de5\u4f5c"})," \u4e0b\u9762\u7684\u4f8b\u5b50\u5c55\u793a\u4e86\u5904\u7406Istio\u6d41\u91cf\u7f51\u5173\u8d44\u6e90(",(0,i.jsx)(n.code,{children:"networking.istio.io/VirtualService"}),")\u7684\u811a\u672c\u6d4b\u8bd5\u6848\u4f8b\uff1a"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'rollout:\n  apiVersion: rollouts.kruise.io/v1beta1\n  kind: Rollout\n  metadata:\n    name: rollouts-demo\n  spec:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: deploy-demo\n    strategy:\n      canary:\n        enableExtraWorkloadForCanary: true\n        steps:\n        - matches:\n          - headers:\n            - type: Exact\n              name: user-agent\n              value: pc\n            - type: RegularExpression\n              name: name\n              value: ".*demo"\n        - matches:\n          - headers:\n            - type: Exact\n              name: user-agent\n              value: pc\n          - headers:\n            - type: RegularExpression\n              name: name\n              value: ".*demo"\n        - traffic: 50%\n          replicas: 50%\n        trafficRoutings:\n        - service: svc-demo\n          customNetworkRefs:\n          - apiVersion: networking.istio.io/v1alpha3\n            kind: VirtualService\n            name: vs-demo\noriginal:\n  apiVersion: networking.istio.io/v1alpha3\n  kind: VirtualService\n  metadata:\n    name: vs-demo\n  spec:\n    hosts:\n    - "*"\n    gateways:\n    - nginx-gateway\n    http:\n    - route:\n      - destination:\n          host: svc-demo\nexpected:\n  - apiVersion: networking.istio.io/v1alpha3\n    kind: VirtualService\n    metadata:\n      name: vs-demo\n    spec:\n      hosts:\n      - "*"\n      gateways:\n      - nginx-gateway\n      http:\n      - match:\n        - headers:\n            user-agent:\n              exact: pc\n            name:\n              regex: .*demo\n        route:\n        - destination:\n            host: svc-demo-canary\n      - route:\n        - destination:\n            host: svc-demo\n  - apiVersion: networking.istio.io/v1alpha3\n    kind: VirtualService\n    metadata:\n      name: vs-demo\n    spec:\n      hosts:\n      - "*"\n      gateways:\n      - nginx-gateway\n      http:\n      - match:\n        - headers:\n            name:\n              regex: .*demo\n        route:\n        - destination:\n            host: svc-demo-canary\n      - match:\n        - headers:\n            user-agent:\n              exact: pc\n        route:\n        - destination:\n            host: svc-demo-canary\n      - route:\n        - destination:\n            host: svc-demo\n  - apiVersion: networking.istio.io/v1alpha3\n    kind: VirtualService\n    metadata:\n      name: vs-demo\n    spec:\n      hosts:\n      - "*"\n      gateways:\n      - nginx-gateway\n      http:\n      - route:\n        - destination:\n            host: svc-demo\n          weight: 50\n        - destination:\n            host: svc-demo-canary\n          weight: 50\n'})}),"\n",(0,i.jsxs)(n.p,{children:["\u8fd0\u884c ",(0,i.jsx)(n.code,{children:"go test -v ./pkg/trafficrouting/network/customNetworkProvider/"})," \u6765\u9a8c\u8bc1\u5185\u7f6e\u7684Lua\u811a\u672c\u662f\u5426\u6309\u9884\u671f\u6765\u5de5\u4f5c\u3002 \u5177\u4f53\u7684\uff0c Kruise Rollout\u4f1a\u904d\u5386",(0,i.jsx)(n.code,{children:"./lua_configuration"})," \u76ee\u5f55\u6765\u83b7\u53d6\u81ea\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u7684Lua\u811a\u672c\uff0c\u4ee5\u53ca\u5bf9\u5e94\u7684\u6d4b\u8bd5\u6848\u4f8b\u3002 Kruise Rollout \u4f1a\u5c06Rollout\u914d\u7f6e\uff0c\u4ee5\u53ca\u6d41\u91cf\u7f51\u5173\u7684\u914d\u7f6e\u4f20\u9012\u7ed9Lua\u811a\u672c\uff0c\u5e76\u9a8c\u8bc1Lua\u811a\u672c\u7684\u8f93\u51fa\u7b26\u5408\u5b9a\u4e49\u7684\u9884\u671f\u7ed3\u679c(expected)"]}),"\n",(0,i.jsx)("img",{src:s(62077).A}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openkruise/rollouts/pull/178",children:"PR#178"}),"\u4e2d\u5305\u62ec\u4e86Istio VirtualService\u7684\u5177\u4f53\u4f8b\u5b50"]}),"\n",(0,i.jsx)(n.h4,{id:"\u6d4b\u8bd5\u6848\u4f8b\u9700\u8981\u8986\u76d6\u7684\u573a\u666f",children:"\u6d4b\u8bd5\u6848\u4f8b\u9700\u8981\u8986\u76d6\u7684\u573a\u666f"}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u8bbe\u8ba1\u5355\u6d4b\u6848\u4f8b\u65f6, \u81f3\u5c11\u9700\u8981\u8003\u8651\u5982\u4e0b\u4e09\u79cd\u53d1\u5e03\u573a\u666f:"}),"\n",(0,i.jsx)(n.p,{children:"When designing test cases, at least the release strategies listed below are supposed to be considered:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"A/B \u6d4b\u8bd5\uff0c\u4e5f\u5c31\u662f\u7070\u5ea6\u89c4\u5219\u4e2d\u5305\u62ec\u4e86http\u5934\u7684\u5339\u914d\u89c4\u5219, \u4e14\u5339\u914d\u89c4\u5219\u5b9a\u4e49\u5728\u4e00\u4e2aheaders\u5b57\u6bb5\u4e2d\uff08\u89c4\u5219\u9700\u8981ANDed)"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'# spec.strategy.canary.steps:\n- matches:\n  - headers:\n    - type: Exact\n      name: user-agent\n      value: pc\n    - type: RegularExpression\n      name: name\n      value: ".*demo"\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"A/B \u6d4b\u8bd5\uff0c\u4e5f\u5c31\u662f\u7070\u5ea6\u89c4\u5219\u4e2d\u5305\u62ec\u4e86http\u5934\u7684\u5339\u914d\u89c4\u5219, \u4e14\u5339\u914d\u89c4\u5219\u5b9a\u4e49\u5728\u591a\u4e2aheaders\u5b57\u6bb5\u4e2d\uff08\u89c4\u5219\u9700\u8981ORed)"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'# spec.strategy.canary.steps:\n- matches:\n  - headers:\n    - type: Exact\n      name: user-agent\n      value: pc\n  - headers:\n    - type: RegularExpression\n      name: name\n      value: ".*demo"\n'})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"\u53c2\u89c1"})," ",(0,i.jsx)(n.a,{href:"https://openkruise.io/zh/rollouts/user-manuals/api-specifications",children:"API\u5b9a\u4e49"})," ",(0,i.jsx)(n.strong,{children:"\u6765\u4e86\u89e3\u66f4\u591a\u5173\u4e8e\u8fd9\u4e24\u79cd\u53d1\u5e03\u573a\u666f\u7684\u5dee\u5f02"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u91d1\u4e1d\u96c0\u53d1\u5e03\uff0c\u4e14\u4e0d\u5305\u542bhttp\u5934\u5339\u914d\u89c4\u5219\uff0c \u6d41\u91cf\u6309\u4e00\u5b9a\u7684\u6bd4\u4f8b\u8def\u7531\u5230\u91d1\u4e1d\u96c0\u670d\u52a1"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"# spec.strategy.canary.steps:\n- traffic: 20%\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Special Note:"})," By default, traffic routing strategies defined in Rollout will create a new canary for new pods, while TrafficRouting will not."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"\u65b9\u6cd52-\u5728configmap\u4e2d\u5b9a\u4e49lua\u811a\u672c",children:"\u65b9\u6cd52: \u5728ConfigMap\u4e2d\u5b9a\u4e49Lua\u811a\u672c"}),"\n",(0,i.jsxs)(n.p,{children:["\u5f53\u6d41\u91cf\u7f51\u5173\u5bf9\u5e94\u7684Lua\u811a\u672c\u6ca1\u6709\u5185\u7f6e\u5728Kruise Rollout\u4e2d\u65f6\uff0c\u7528\u6237\u53ef\u4ee5\u5229\u7528ConfigMap\u6765\u5b9a\u4e49\u6d41\u91cf\u7f51\u5173\u7684Lua\u811a\u672c\u3002 \u7279\u522b\u7684\uff0c \u6d41\u91cf\u7f51\u5173\u7684Lua\u811a\u672c\u53ef\u4ee5\u5728 ConfigMap ",(0,i.jsx)(n.code,{children:"kruise-rollout/kruise-rollout-configuration"})," \u7684\u5982\u4e0b\u5b57\u6bb5\u4e2d"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"<lua.traffic.routing.Kind.CRDGroup>: |\n# \u8fd9\u91cc\u5199\u81ea\u5b9a\u4e49Lua\u811a\u672c\u7684\u5b57\u7b26\u4e32\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u4e0b\u9762\u7684\u4f8b\u5b50\u5c55\u793a\u4e86\u5b9a\u4e49Istio\u6d41\u91cf\u7f51\u5173",(0,i.jsx)(n.code,{children:"networking.istio.io/DestinationRule"}),"\u7684\u5bf9\u5e94Lua\u811a\u672c\uff0c\u7c7b\u4f3c\u7684\uff0c\u4f60\u4e5f\u53ef\u4ee5\u5728Configmap\u4e2d\uff0c \u7ed9\u5176\u4ed6\u6d41\u91cf\u7f51\u5173\u8d44\u6e90\u6765\u5b9a\u4e49Lua\u811a\u672c\uff0c\u4f8b\u5982Apisix\u3001Kuma."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'data:\n  "lua.traffic.routing.DestinationRule.networking.istio.io": |\n  \tlocal spec = obj.data.spec\n    local canary = {}\n    canary.labels = {}\n    canary.name = "canary"\n    local podLabelKey = "istio.service.tag"\n    canary.labels[podLabelKey] = "gray\n    table.insert(spec.subsets, canary)\n    return obj.data\n'})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"\u5982\u679cKruise Rollout\u5728\u5185\u7f6e\u7684\u6d41\u91cf\u7f51\u5173\u4e2d\u627e\u4e0d\u5230\u5bf9\u5e94\u7684Lua\u811a\u672c\uff0c\u5c31\u4f1a\u8bd5\u56fe\u4eceConfigmap\u4e2d\u8bfb\u53d6\u5bf9\u5e94\u811a\u672c"})}),"\n",(0,i.jsx)(n.h2,{id:"\u7f16\u5199\u81ea\u5df1\u7684\u6d41\u91cf\u7f51\u5173lua\u811a\u672c\u6765\u63a7\u5236\u6d41\u91cf\u8def\u7531",children:"\u7f16\u5199\u81ea\u5df1\u7684\u6d41\u91cf\u7f51\u5173Lua\u811a\u672c\u6765\u63a7\u5236\u6d41\u91cf\u8def\u7531"}),"\n",(0,i.jsx)(n.p,{children:"\u8fd9\u4e2a\u90e8\u5206\u4f1a\u4ecb\u7ecdLua\u7684\u4e00\u4e9b\u76f8\u5173\u8bed\u6cd5\uff0c\u4ee5\u53ca\u5982\u4f55\u7f16\u5199\u548c\u8c03\u8bd5\u63a7\u5236\u6d41\u91cf\u8def\u7531\u7684Lua\u811a\u672c"}),"\n",(0,i.jsx)(n.h3,{id:"lua-\u8bed\u6cd5",children:"Lua \u8bed\u6cd5"}),"\n",(0,i.jsx)(n.h4,{id:"lua-\u6570\u636e\u7c7b\u578bs",children:"Lua \u6570\u636e\u7c7b\u578bs"}),"\n",(0,i.jsx)(n.p,{children:"Lua \u4e2d\u6709\u51e0\u79cd\u5e38\u89c1\u7684\u6570\u636e\u7c7b\u578b:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Boolean"}),": \u4ee3\u8868\u5e03\u5c14\u7c7b\u578b\u7684\u6570\u636e\uff0c \u4f8b\u5982 true \u6216\u8005 false\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Number"}),": \u4ee3\u8868\u6574\u6570\u6216\u6574\u6570\u7684\u6570\u503c\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"String"}),": \u4ee3\u8868\u6587\u672c\u6570\u636e\uff0c \u8be5\u6570\u636e\u53ef\u4ee5\u901a\u8fc7\u5355\u5f15\u53f7\u6216\u8005\u53cc\u5f15\u53f7\u6765\u5305\u62ec\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Table"}),": Lua\u4e2d\u6700\u91cd\u8981\u7684\u6570\u636e\u7ed3\u679c\uff0c \u53ef\u4ee5\u7528\u6765\u8868\u793a\u5173\u8054\u6570\u7ec4\u3001\u5217\u8868\u3001\u96c6\u5408\u4ee5\u53ca\u5176\u4ed6\u590d\u6742\u7684\u6570\u636e\u7ed3\u6784\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"Function"}),": \u4ee3\u8868\u53ef\u6267\u884c\u7684\u4ee3\u7801\u5757\uff0c\u8fd9\u79cd\u7c7b\u578b\u7684\u6570\u503c\u53ef\u4ee5\u88ab\u8c03\u7528\uff0c\u6216\u8005\u4f5c\u4e3a\u53c2\u6570\u4f20\u9012\u7ed9\u5176\u4ed6\u51fd\u6570\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"lua-table",children:"Lua Table"}),"\n",(0,i.jsx)(n.p,{children:"Lua\u4e2d\u7684table\u7c7b\u578b\u7528\u6765\u5b58\u50a8\u548c\u7ec4\u7ec7\u6570\u636e\uff0c \u5b83\u53ef\u4ee5\u5b58\u50a8\u5404\u79cd\u7c7b\u578b\u7684\u5143\u7d20\uff0c\u4f8b\u5982\u6570\u503c\u3001\u6587\u672c\u751a\u81f3\u5d4c\u5957\u5b58\u50a8\u5176\u4ed6\u7684table\u3002 Lua table\u8868\u793a\u7684\u662f\u5173\u8054\u6570\u7ec4\uff0c \u53ef\u4ee5\u7528\u6570\u7ec4\u7684\u952e\u6765\u8bbf\u95ee\u6570\u7ec4\u5bf9\u5e94\u7684\u5143\u7d20\u7684\u503c\u3002 \u5982\u4e0b\u662ftable\u7c7b\u578b\u7684\u5e38\u89c1\u7279\u6027\u548c\u516c\u5171\u64cd\u4f5c\u3002"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u521b\u5efatable:"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u4f7f\u7528\u82b1\u62ec\u53f7\u6765\u521b\u5efa\u4e00\u4e2a\u7a7a\u7684table: ",(0,i.jsx)(n.code,{children:"myTable = {}"})]}),"\n",(0,i.jsxs)(n.p,{children:["\u4f7f\u7528 ",(0,i.jsx)(n.code,{children:"myTable = table.create()"})," \u6784\u9020\u51fd\u6570\u6765\u521b\u5efa\u7a7atable"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u65b0\u589e\u6216\u8005\u8bbf\u95eetable\u4e2d\u5143\u7d20:"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7\u952e\u540d\u6dfb\u52a0\u5143\u7d20: ",(0,i.jsx)(n.code,{children:"myTable[key] = value"})]}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7\u952e\u540d\u6765\u8bbf\u95ee\u5143\u7d20: ",(0,i.jsx)(n.code,{children:"myTable[key]"})]}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7\u70b9\u8bb0\u53f7\u6765\u8bbf\u95ee\u5143\u7d20: ",(0,i.jsx)(n.code,{children:"myTable.key"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u904d\u5386table:"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7",(0,i.jsx)(n.code,{children:"pairs()"}),"\u51fd\u6570\u6765\u904d\u5386table\u4e2d\u7684\u6240\u6709\u952e\u503c\u5bf9\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:"for key, value in pairs(myTable) do ... end\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7",(0,i.jsx)(n.code,{children:"ipairs()"}),"\u51fd\u6570\u6765\u904d\u5386table\u4e2d\u7684\u6570\u7ec4\u90e8\u5206"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:"for index, value in ipairs(myTable) do ... end\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"\u5220\u9664\u5143\u7d20:"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u4f7f\u7528\u952e\u540d\u6765\u5220\u9664\u4e00\u4e2a\u5143\u7d20: ",(0,i.jsx)(n.code,{children:"myTable[key] = nil"})]}),"\n",(0,i.jsx)(n.h4,{id:"\u516c\u5171\u51fd\u6570",children:"\u516c\u5171\u51fd\u6570"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"table.insert()"}),": \u63d2\u5165\u4e00\u4e2a\u5143\u7d20\u5230table\u4e2d\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"table.remove()"}),": \u5728table\u4e2d\u5220\u9664\u4e00\u4e2a\u5143\u7d20\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"table.concat()"}),": \u628atable\u4e2d\u6240\u6709\u5b57\u7b26\u4e32\u62fc\u63a5\u6210\u4e00\u4e2a\u65b0\u7684\u5b57\u7b26\u4e32\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"ipairs()"}),": \u83b7\u5f97\u4e00\u4e2a\u904d\u5386\u5668\uff0c\u7528\u6765\u904d\u5386table\u4e2d\u7684\u6570\u7ec4\u90e8\u5206\u3002"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"pairs()"}),": \u83b7\u5f97\u4e00\u4e2a\u904d\u5386\u5668\uff0c\u7528\u6765\u904d\u5386talbe\u4e2d\u7684\u952e\u503c\u90e8\u5206\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"\u5904\u7406\u7f51\u5173\u8d44\u6e90",children:"\u5904\u7406\u7f51\u5173\u8d44\u6e90"}),"\n",(0,i.jsxs)(n.p,{children:["\u7f51\u5173\u8d44\u6e90\u7684\u72b6\u6001\u548c\u53d1\u5e03\u7b56\u7565\u76f8\u5173\u6570\u636e\u5728\u4e00\u4e2a\u540d\u53ebLuaData\u7684\u7ed3\u6784\u4e2d\u8bb0\u5f55\uff0c \u5e76\u4e14\u4f1a\u88ab\u8f6c\u5316\u6210\u4e00\u4e2aLua table, \u5e76\u4f5c\u4e3a\u4e00\u4e2a\u5168\u5c40\u7684\u53d8\u91cf ",(0,i.jsx)(n.code,{children:"obj"})," \u6765\u4f9bLua\u811a\u672c\u6765\u8fdb\u4e00\u6b65\u5904\u7406\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'type LuaData struct {\n    Data             Data\n    CanaryWeight     int32\n    StableWeight     int32\n    Matches          []rolloutv1alpha1.HttpRouteMatch\n    CanaryService    string\n    StableService    string\n}\n// Data \u7ed3\u6784\u5305\u542b\u4e86\u5f53\u524d\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u7684\u914d\u7f6e\ntype Data struct {\n\tSpec        interface{}       `json:"spec,omitempty"`\n\tLabels      map[string]string `json:"labels,omitempty"`\n\tAnnotations map[string]string `json:"annotations,omitempty"`\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["\u81ea\u5b9a\u4e49Lua\u811a\u672c\u9700\u8981\u6839\u636e",(0,i.jsx)(n.code,{children:"obj"}),"\uff0c\u6309\u7167\u91d1\u4e1d\u96c0\u53d1\u5e03\u7684\u903b\u8f91\uff0c \u5904\u7406\u81ea\u5b9a\u4e49\u7684\u6d41\u91cf\u8def\u7531\u7b56\u7565\uff0c \u6765\u8fd4\u56de\u4e00\u4e2a\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u7684\u5bf9\u8c61\uff0c \u8fd9\u4e2a\u5bf9\u8c61\u9700\u8981\u5305\u62ec\u4fee\u6539\u540e\u7f51\u5173\u8d44\u6e90\u7684\u65b0spec\u3001labels\u548cannotations\u3002 \u4e00\u79cd\u7b80\u5355\u7684\u65b9\u6cd5\u662f\u4fee\u6539obj.data\u5e76\u4e14\u5728\u811a\u672c\u4e2d\u8fd4\u56de ",(0,i.jsx)(n.code,{children:"obj.data"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:"-- Lua \u53d8\u91cf\u662f\u6309\u5f15\u7528\u6765\u4f20\u9012\u7684\uff0c \u56e0\u6b64\u4fee\u6539 'spec' \u53ef\u4ee5\u540c\u6b65\u5730\u4fee\u6539'obj.data.spec'\nspec = obj.data.spec -- get resource 'spec'\nhosts = spec.hosts\ncanaryService = obj.canaryService\n-- \u4e00\u822c\u8981\u904d\u5386Rollout strategy\u4e2d\u7684http\u5934\u76f8\u5173\u5b57\u6bb5'matches'\nfor _, match in ipairs(obj.matches) do\n\t... -- \u5728\u8fd9\u91cc\u5b9e\u73b0\u4e0d\u540c\u7684matches\u7684\u5904\u7406\u903b\u8f91\nend\n-- \u8fd4\u56de'obj.data'\uff0c Kruise Rollout\u4f1a\u5c06\u4fee\u6539\u540e\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u66f4\u65b0\u5230\u96c6\u7fa4\u4e2d\nreturn obj.data\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u60a8\u4e5f\u53ef\u4ee5\u5b9a\u4e49\u5e76\u8fd4\u56de\u81ea\u5df1\u7684\u53d8\u91cf\uff0c\u53ea\u8981\u8fd9\u8fb9\u53d8\u91cf\u5305\u62ec\u4e86\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u7684\u8def\u7531\u64cd\u4f5c\u540e\u7684\u65b0spec\u3001labels\u548cannotations\uff0c\u4f8b\u5982:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:"...\n-- \u5b9a\u4e49\u81ea\u5df1\u7684\u8fd4\u56de\u53d8\u91cfret\nret = {}\n-- \u8bbe\u7f6eret\u7684annotations, labels \u548c spec\nret.annotations = annotations\nret.labels = labels\nret.spec = spec\nreturn ret\n"})}),"\n",(0,i.jsx)(n.h3,{id:"\u8c03\u8bd5\u60a8\u7684lua-script",children:"\u8c03\u8bd5\u60a8\u7684Lua Script"}),"\n",(0,i.jsxs)(n.p,{children:["\u5982\u679c\u60a8\u9700\u8981\u8c03\u8bd5Lua\u811a\u672c\uff0c\u53ef\u4ee5\u5728lua\u811a\u672c\u4e2d\u5b9a\u4e49\u4e00\u4e2a\u5168\u5c40\u53d8\u91cf",(0,i.jsx)(n.code,{children:"obj"}),"\uff0c \u5e76\u9010\u884c\u8c03\u8bd5\u6765\u68c0\u67e5Lua\u811a\u672c\u662f\u5426\u6309\u9884\u671f\u5de5\u4f5c\u3002\u7279\u522b\u7684\u4e00\u79cd\u529e\u6cd5\u662f\u5b89\u88c5VSCode\u7684",(0,i.jsx)(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=actboy168.lua-debug",children:"Lua Debug"})," \u63d2\u4ef6\u3002 \u5b89\u88c5\u540e\uff0c \u5728\u8c03\u8bd5\u6a21\u5f0f\u5c31\u53ef\u4ee5\u9010\u884c\u6267\u884cLua\u811a\u672c\uff0c\u5e76\u4e14\u68c0\u67e5\u76f8\u5e94\u7684\u53d8\u91cf\u8d4b\u503c\u60c5\u51b5\uff0c \u5177\u4f53\u65b9\u5f0f\u662f\u5728",(0,i.jsx)(n.strong,{children:"Run and Debug"}),"\u76ee\u5f55\u4e2d\u9009\u62e9",(0,i.jsx)(n.strong,{children:"Lua Debug -> Debug Current File"})]}),"\n",(0,i.jsx)("img",{src:s(83122).A,width:"50%"}),"\n",(0,i.jsxs)(n.p,{children:["\u7279\u522b\u7684\uff0c \u4f60\u53ef\u4ee5\u6309\u4e0a\u8ff0\u7684Yaml\u683c\u5f0f\u7f16\u5199\u6d4b\u8bd5\u6848\u4f8b\uff0c \u5e76\u901a\u8fc7\u8fd0\u884c ",(0,i.jsx)(n.code,{children:"go run ./lua_configuration/convert_test_case_to_lua_object.go"})," \u6765\u751f\u6210\u5e76\u4f7f\u7528 ",(0,i.jsx)(n.code,{children:"obj"}),"\u3002 \u8fd9\u4e2a\u7a0b\u5e8f\u4f1a\u83b7\u53d6\u5185\u7f6e\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\uff08",(0,i.jsx)(n.code,{children:"lua_configuration"}),"\uff09\u4e2d\u6d4b\u8bd5\u6848\u4f8b\uff08",(0,i.jsx)(n.code,{children:"testdata"}),"\uff09\u76ee\u5f55\uff0c \u5e76\u8f6c\u5316\u6d4b\u8bd5\u6848\u4f8b\u4e3a\u5168\u5c40\u53d8\u91cf ",(0,i.jsx)(n.code,{children:"obj"})," \u7684\u5f62\u5f0f\uff0c \u5e76\u4fdd\u5b58\u5230\u76f8\u5e94\u7684 ",(0,i.jsx)(n.code,{children:"*_case_obj.lua"}),"\u811a\u672c\u4e2d\u3002 \u5f00\u53d1\u8005\u53ef\u4ee5\u62f7\u8d1d",(0,i.jsx)(n.code,{children:"*_case_obj.lua"}),"\u7684\u5bf9\u8c61\u4e3a ",(0,i.jsx)(n.code,{children:"obj"}),"\uff0c \u5e76\u4f20\u9012\u7ed9\u81ea\u5b9a\u4e49\u7f51\u5173\u7684Lua\u811a\u672c\uff0c \u4ece\u800c\u7528\u6765\u9010\u884c\u8c03\u8bd5\u811a\u672c\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u5982\u4e0b\u662f\u4e00\u4e2a\u7531\u793a\u4f8b\u7684\u6d4b\u8bd5\u6848\u4f8b\u8f93\u51fa\u7684\u5bf9\u8c61\u6587\u4ef6 ",(0,i.jsx)(n.code,{children:"test_case_obj.lua"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:'steps = {\n  \t-- obj of release step_0\n    step_0 = { canaryWeight = -1, stableWeight = 101,\n        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },\n        canaryService = "mocka", stableService = "mocka",\n        data = {\n            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },\n                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }, }\n'})}),"\n",(0,i.jsxs)(n.p,{children:["\u53ea\u8981\u628a ",(0,i.jsx)(n.code,{children:"test_case_obj.lua"})," \u4e2d\u5b9a\u4e49\u7684Lua table\u53d8\u91cf(\u4f8b\u5982step_0) \u5728\u60a8\u7684Lua\u811a\u672c\u4e2d\u62f7\u8d1d\u4e3a\u4e00\u4e2a\u5168\u5c40\u53d8\u91cf ",(0,i.jsx)(n.code,{children:"obj"}),"\uff0c \u5c31\u53ef\u4ee5\u5f00\u59cb\u8c03\u8bd5"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-lua",children:'-- \u4ecetest_case_obj.lua\u4e2d\u62f7\u8d1d\u53d8\u91cfstep_0\u4e3aobj\u53d8\u91cf\nobj = { canaryWeight = -1, stableWeight = 101,\n        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },\n        canaryService = "mocka", stableService = "mocka", },\n        data = {\n            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },\n                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }\nspec = obj.data.spec\n--- \u4ee5\u4e0b\u5b9a\u4e49\u60a8\u81ea\u5df1\u7684\u81ea\u5b9a\u4e49\u7f51\u5173\u7684Lua\u811a\u672c\n'})}),"\n",(0,i.jsx)("img",{src:s(12060).A}),"\n",(0,i.jsx)(n.h3,{id:"\u6388\u6743kruise-rollout-\u8bbf\u95ee\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90",children:"\u6388\u6743Kruise Rollout \u8bbf\u95ee\u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90"}),"\n",(0,i.jsx)(n.p,{children:"\u4e3a\u4e86\u8ba9Kruise Rollout\u53ef\u4ee5\u8bbf\u95ee\u5e76\u66f4\u65b0\u81ea\u5b9a\u4e49\u7f51\u5173\u7684\u8d44\u6e90\uff0c \u9700\u8981\u914d\u7f6e\u76f8\u5e94\u7684RBAC\u89c4\u5219\uff0c\u4ece\u800c\u5bf9Kruise Rollout \u8fdb\u884c\u6388\u6743"}),"\n",(0,i.jsxs)(n.p,{children:["\u63a8\u8350\u5728kruise-rollout\u547d\u540d\u7a7a\u95f4\u4e0b\u65b0\u5efa\u4e00\u4e2arole\uff0c\uff0c \u5e76\u6dfb\u52a0\u4e00\u4e2a\u5305\u542b ",(0,i.jsx)(n.code,{children:"get, list, patch, update, watch"})," \u81ea\u5b9a\u4e49\u7f51\u5173\u8d44\u6e90\u6743\u9650\u7684\u89d2\u8272\uff0c \u5e76\u6388\u6743\u8be5\u89d2\u8272\u7ed9Kruise Rollout\u3002\u4ee5\u4e0b\u662f\u4e00\u4e2aIstio VirtualService \u548cDestinationRule \u7684RBAC \u89c4\u5219\u7684\u793a\u4f8b:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: kruise-rollout-istio-role\n  namespace: kruise-rollout\nrules:\n  - apiGroups:\n    - networking.istio.io\n    resources:\n    - destinationrules\n    - virtualservices\n    verbs:\n    - get\n    - list\n    - patch\n    - update\n    - watch\n  ...\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: kruise-rollout-istio-rolebinding\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: Role\n  name: kruise-rollout-istio-role\nsubjects:\n- kind: ServiceAccount\n  name: controller-manager\n  namespace: kruise-rollout\n"})})]})}function u(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},83122:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/vscode-conf-402152c12f5ad907063732b4f52941d3.png"}}]);
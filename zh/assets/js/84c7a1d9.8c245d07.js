"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[978],{17672:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/kruise-game-api-3-22c3884737a265f124ae47c9d9ec4251.png"},28453:(e,n,a)=>{a.d(n,{R:()=>l,x:()=>t});var s=a(96540);const i={},r=s.createContext(i);function l(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(r.Provider,{value:n},e.children)}},45064:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>o});const s=JSON.parse('{"id":"developer-manuals/kruise-game-api","title":"Kruise Game API","description":"kruise-game-api \u662f\u901a\u8fc7 Golang package\u3001gRPC\u3001REST\u3001\u547d\u4ee4\u884c\u591a\u79cd\u63a5\u53e3\u7c7b\u578b\uff0c\u63d0\u4f9b\u5bf9 OKG \u7684 GSS/GS \u8d44\u6e90\u7684\u67e5\u8be2\u3001\u4fee\u6539\u3001\u5220\u9664\u64cd\u4f5c\uff0c\u4e3b\u8981\u529f\u80fd\u5982\u4e0b\uff1a","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/developer-manuals/kruise-game-api.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/kruise-game-api","permalink":"/zh/kruisegame/developer-manuals/kruise-game-api","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Golang Client","permalink":"/zh/kruisegame/developer-manuals/go-client"},"next":{"title":"\u5c1a\u6e38\u7f51\u7edc\u57fa\u4e8eOpenKruiseGame\u6e38\u620f\u4e91\u539f\u751f\u5316\u5b9e\u8df5","permalink":"/zh/kruisegame/blog-video/kubecon-shangyou-20230926"}}');var i=a(74848),r=a(28453);const l={},t="Kruise Game API",c={},o=[{value:"Golang Package",id:"golang-package",level:2},{value:"REST",id:"rest",level:2},{value:"\u547d\u4ee4\u884c",id:"\u547d\u4ee4\u884c",level:2},{value:"GS \u72b6\u6001\u67e5\u8be2\u4e0e\u4e0a\u62a5",id:"gs-\u72b6\u6001\u67e5\u8be2\u4e0e\u4e0a\u62a5",level:2},{value:"GS \u8def\u7531\u9009\u62e9",id:"gs-\u8def\u7531\u9009\u62e9",level:2},{value:"\u96c6\u6210\u8fdb PaaS \u5e73\u53f0",id:"\u96c6\u6210\u8fdb-paas-\u5e73\u53f0",level:2},{value:"\u4ee3\u66ff kubectl \u5ba2\u6237\u7aef\u7ba1\u7406 GSS&amp;GS",id:"\u4ee3\u66ff-kubectl-\u5ba2\u6237\u7aef\u7ba1\u7406-gssgs",level:2},{value:"\u4f5c\u4e3a CI/workflow \u7684 step \u6267\u884c\u81ea\u52a8\u5316\u8fd0\u7ef4",id:"\u4f5c\u4e3a-ciworkflow-\u7684-step-\u6267\u884c\u81ea\u52a8\u5316\u8fd0\u7ef4",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"kruise-game-api",children:"Kruise Game API"})}),"\n",(0,i.jsx)(n.p,{children:"kruise-game-api \u662f\u901a\u8fc7 Golang package\u3001gRPC\u3001REST\u3001\u547d\u4ee4\u884c\u591a\u79cd\u63a5\u53e3\u7c7b\u578b\uff0c\u63d0\u4f9b\u5bf9 OKG \u7684 GSS/GS \u8d44\u6e90\u7684\u67e5\u8be2\u3001\u4fee\u6539\u3001\u5220\u9664\u64cd\u4f5c\uff0c\u4e3b\u8981\u529f\u80fd\u5982\u4e0b\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\u4f7f\u7528\u7c7b\u4f3c MongoDB \u7684\u7ed3\u6784\u5316\u67e5\u8be2\u8bed\u6cd5 ",(0,i.jsx)(n.a,{href:"https://github.com/CloudNativeGame/structured-filter-go",children:"structured-filter-go"}),"\uff0c\u5b9e\u73b0\u5bf9 GSS/GS \u8f83\u590d\u6742\u7b5b\u9009\u89c4\u5219\u7684\u67e5\u8be2\uff0c\u4f8b\u5982\u6709\u67e5\u8be2\u6ee1\u8db3\u4ee5\u4e0b\u6761\u4ef6\u7684 GS \u7684\u9700\u6c42\uff1a","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"opsState \u4e3a None"}),"\n",(0,i.jsx)(n.li,{children:"status.networkStatus.currentState \u4e3a Ready"}),"\n",(0,i.jsx)(n.li,{children:"\u5305\u542b\u540d\u4e3a nginx \u548c sidecar \u7684\u5bb9\u5668\uff0cnginx \u7684 image \u4e3a nginx:1.27.4\uff0csidecar \u7684 image \u4e3a busybox:1.37.0"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u53ef\u4ee5\u7528\u4ee5\u4e0b filter \u67e5\u8be2\u6ee1\u8db3\u4ee5\u4e0a\u6240\u6709\u6761\u4ef6\u7684 GS \u5217\u8868\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-JSON",children:'{\n  "$and": [\n    {\n      "opsState": "None"\n    },\n    {\n      "currentNetworkState": "Ready"\n    },\n    {\n      "images": {\n        "$all": ["nginx,nginx:1.27.4", "sidecar,busybox:1.37.0"]\n      }\n    }\n  ]\n}\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\u4f7f\u7528 ",(0,i.jsx)(n.a,{href:"https://jsonpatch.com/",children:"JsonPatch"})," \u4f5c\u4e3a\u66f4\u65b0\u8bed\u6cd5\uff0c\u914d\u5408 filter\uff0c\u5b9e\u73b0\u5bf9\u6ee1\u8db3\u4e00\u5b9a\u7b5b\u9009\u89c4\u5219\u7684 GSS/GS \u8fdb\u884c\u72b6\u6001\u66f4\u65b0"]}),"\n",(0,i.jsx)(n.li,{children:"\u63d0\u4f9b Golang Package \u4f7f\u7528\u94fe\u5f0f\u8c03\u7528\u7b80\u5316\u67e5\u8be2\u53ca\u66f4\u65b0\u8bed\u6cd5\uff1a"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-golang",children:'// \u6784\u9020 Filter\nfilter := filterbuilder.NewGsFilterBuilder().OpsState("None")\n\n// \u6784\u9020 JsonPatch\npatcher := jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1)\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u63d0\u4f9b gRPC/REST client \u8fdb\u4e00\u6b65\u7b80\u5316 GSS/GS \u7684\u64cd\u4f5c\uff1a"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-golang",children:'// \u521b\u5efa HttpClient\uff0c\u7528\u4e8e\u5411 kruise-game-api-server \u53d1\u9001\u8bf7\u6c42\nclient := kruisegameapiclient.NewKruiseGameApiHttpClient()\n\n// \u5411 kruise-game-api-server \u53d1\u9001 HTTP \u8bf7\u6c42\uff0c\u5c06 opsState \u4e3a None \u7684 GS \u7684 updatePriority \u8bbe\u7f6e\u4e3a1\nresults, err := client.UpdateGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"),\n    jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1))\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u63d0\u4f9b kruisegamectl \u547d\u4ee4\u884c\u5de5\u5177\uff0c\u5728\u65e0\u9700\u989d\u5916\u90e8\u7f72\u7684\u60c5\u51b5\u4e0b\u5b9e\u73b0 GSS/GS \u7684\u7ed3\u6784\u5316\u67e5\u8be2/\u66f4\u65b0\uff1a"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'# \u5c06 opsState \u4e3a None \u7684 GS \u7684 updatePriority \u8bbe\u7f6e\u4e3a1\nkruisegamectl -k "${kube_config_path}" \\\n    -r gameserver \\\n    -p -f \'{"opsState":"None"}\' \\\n    -j \'[{"op":"replace","path":"/spec/updatePriority","value":3}]\'\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u4f7f\u7528\u65b9\u6cd5",children:"\u4f7f\u7528\u65b9\u6cd5"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\u4ee3\u7801\u793a\u4f8b\uff1a",(0,i.jsx)(n.a,{href:"https://github.com/CloudNativeGame/kruise-game-api/tree/main/examples",children:"https://github.com/CloudNativeGame/kruise-game-api/tree/main/examples"})]}),"\n",(0,i.jsxs)(n.li,{children:["\u66f4\u8be6\u7ec6\u7684\u63a5\u53e3\u8bf4\u660e\uff0c\u4ee5\u53ca\u652f\u6301\u7684 GSS/GS \u7684 filter \u7b49\u5185\u5bb9\u53ef\u4ee5\u53c2\u8003 ",(0,i.jsx)(n.a,{href:"https://github.com/CloudNativeGame/kruise-game-api/blob/main/README.md",children:"README"})]}),"\n",(0,i.jsx)(n.li,{children:"\u4ee5\u4e0b\u662f Golang Package\u3001REST\u3001\u547d\u4ee4\u884c\u51e0\u79cd\u63a5\u53e3\u7c7b\u578b\u7684\u4f7f\u7528\u65b9\u6cd5\uff1a"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"golang-package",children:"Golang Package"}),"\n",(0,i.jsx)(n.p,{children:"\u83b7\u53d6 package\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"go get github.com/CloudNativeGame/kruise-game-api\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u5728\u4ee3\u7801\u4e2d\u4f7f\u7528\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-golang",children:'// \u521b\u5efa GS \u8fc7\u6ee4\u5668\ngsFilter := filter.NewGsFilter(&filter.FilterOption{\n    KubeOption: options.KubeOption{\n        KubeConfigPath:          "~/.kube/config",\n        InformersReSyncInterval: time.Second * 30,\n    },\n})\n\n//rawFilter := "{\\"$and\\":[{\\"opsState\\": \\"None\\"}, {\\"updatePriority\\": 0}]}"\n// \u83b7\u53d6 opsState \u4e3a None \u4e14 updatePriority \u4e3a0\u7684 GS \u5217\u8868\ngameServers, err := gsFilter.GetFilteredGameServers(filterBuilder.And().OpsState("None").UpdatePriority(0).Build())\n'})}),"\n",(0,i.jsx)(n.h2,{id:"rest",children:"REST"}),"\n",(0,i.jsx)(n.p,{children:"\u5c06 kruise-game-api-server \u90e8\u7f72\u5230 kruise-game-system namespace \u4e2d\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"git clone git@github.com:CloudNativeGame/kruise-game-api.git\ncd kruise-game-api/deploy/ && kubectl apply -f .\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u4f7f\u7528 curl \u6216\u63d0\u4f9b\u7684 REST client Golang Package\uff0c\u5728\u4e1a\u52a1\u5bb9\u5668\u5185\u8bf7\u6c42 kruise-game-api-server\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'# \u83b7\u53d6 opsState \u4e3a None \u7684 GS \u5217\u8868\ncurl -G --data-urlencode \'filter={"opsState":"None"}\' http://kruise-game-api-server.kruise-game-system/v1/gameservers\n'})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-golang",children:'// \u521b\u5efa HttpClient\uff0c\u7528\u4e8e\u5411 kruise-game-api-server \u53d1\u9001\u8bf7\u6c42\nclient := kruisegameapiclient.NewKruiseGameApiHttpClient()\n\n// \u5411 kruise-game-api-server \u53d1\u9001 HTTP \u8bf7\u6c42\uff0c\u83b7\u53d6 opsState \u4e3a None \u7684 GS \u5217\u8868\ngameServers, err := client.GetGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"))\n'})}),"\n",(0,i.jsx)(n.h2,{id:"\u547d\u4ee4\u884c",children:"\u547d\u4ee4\u884c"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'go install github.com/CloudNativeGame/kruise-game-api/facade/kruisegamectl@latest\n# go/bin \u76ee\u5f55\u9700\u8981\u6dfb\u52a0\u5230 PATH \u73af\u5883\u53d8\u91cf\nkruisegamectl -k ~/.kube/config -r gameserver -f \'{"opsState":"None"}\'\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u4f7f\u7528\u573a\u666f",children:"\u4f7f\u7528\u573a\u666f"}),"\n",(0,i.jsx)(n.h2,{id:"gs-\u72b6\u6001\u67e5\u8be2\u4e0e\u4e0a\u62a5",children:"GS \u72b6\u6001\u67e5\u8be2\u4e0e\u4e0a\u62a5"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u901a\u8fc7 gRPC/REST \u8bf7\u6c42\u4e0e kruise-game-api-server \u4ea4\u4e92\uff0c\u5b9e\u73b0 GS \u7684\u72b6\u6001\u67e5\u8be2\u4e0e\u4e0a\u62a5\uff0c\u4ee3\u66ff\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u811a\u672c\u7684\u65b9\u5f0f\u66f4\u65b0 GS \u7684\u72b6\u6001\uff0c\u51cf\u5c11\u5bf9\u5e26\u5916\u7cfb\u7edf\u7684\u4f9d\u8d56\u3002"}),"\n",(0,i.jsx)(n.li,{children:"GS \u53ef\u4ee5\u901a\u8fc7 sidecar \u6216 kruise-game-system \u547d\u540d\u7a7a\u95f4\u4e0b\u7684 kruise-game-api-server Service \u8c03\u7528\u8bf7\u6c42\u7ba1\u7406\u81ea\u8eab\u72b6\u6001\u3002"}),"\n"]}),"\n",(0,i.jsx)("img",{src:a(89818).A,style:{width:"800px"}}),"\n",(0,i.jsx)(n.h2,{id:"gs-\u8def\u7531\u9009\u62e9",children:"GS \u8def\u7531\u9009\u62e9"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u53ef\u4ee5\u5728\u7f51\u5173\u7684 sidecar \u4e2d\u4f7f\u7528 kruise-game-api-server \u5e2e\u52a9\u7f51\u5173\u9009\u62e9\u53ca\u5206\u914d\u6ee1\u8db3\u9700\u6c42\u7684 GS\u3002"}),"\n"]}),"\n",(0,i.jsx)("img",{src:a(66065).A,style:{width:"800px"}}),"\n",(0,i.jsx)(n.h2,{id:"\u96c6\u6210\u8fdb-paas-\u5e73\u53f0",children:"\u96c6\u6210\u8fdb PaaS \u5e73\u53f0"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5982\u679c\u4f7f\u7528\u81ea\u7814\u7684 PaaS \u5e73\u53f0\uff0c\u53ef\u4ee5\u5feb\u901f\u96c6\u6210 GSS/GS \u7684\u7b5b\u9009\u3001\u66f4\u65b0\u7b49\u529f\u80fd\uff0c\u4f8b\u5982\u4e0b\u56fe\u4e2d\u7684 GSS \u6839\u636e\u955c\u50cf\u7b49\u6761\u4ef6\u7b5b\u9009\u3001\u5bf9\u7b5b\u9009\u540e\u7684 GSS \u6267\u884c\u66f4\u65b0\u955c\u50cf\u64cd\u4f5c\u7b49\u529f\u80fd\uff1a"}),"\n"]}),"\n",(0,i.jsx)("img",{src:a(17672).A,style:{width:"800px"}}),"\n",(0,i.jsx)(n.h2,{id:"\u4ee3\u66ff-kubectl-\u5ba2\u6237\u7aef\u7ba1\u7406-gssgs",children:"\u4ee3\u66ff kubectl \u5ba2\u6237\u7aef\u7ba1\u7406 GSS&GS"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u63d0\u4f9b kruisegamectl \u547d\u4ee4\u884c\u5de5\u5177\uff0c\u4e0d\u4f9d\u8d56 kruise-game-api-server \u670d\u52a1\u5668\u5b9e\u73b0 GSS/GS \u7684\u7b5b\u9009\u548c\u66f4\u65b0\u3002"}),"\n"]}),"\n",(0,i.jsx)("img",{src:a(97287).A,style:{width:"800px"}}),"\n",(0,i.jsx)(n.h2,{id:"\u4f5c\u4e3a-ciworkflow-\u7684-step-\u6267\u884c\u81ea\u52a8\u5316\u8fd0\u7ef4",children:"\u4f5c\u4e3a CI/workflow \u7684 step \u6267\u884c\u81ea\u52a8\u5316\u8fd0\u7ef4"}),"\n",(0,i.jsx)(n.p,{children:"\u4ee5\u4e0b\u9762\u7684 Argo Workflow \u4e3a\u4f8b\uff0c\u7701\u7565\u4e86\u4e00\u4e9b steps\uff0c\u6700\u540e\u4e00\u6b65 clean-old-none-gs \u7684\u4f5c\u7528\u662f\u5c06\u6ee1\u8db3\u4e00\u5b9a\u6761\u4ef6\uff08opsState \u4e3a None\u3001\u5305\u542b\u5bb9\u5668\u540d\u4e3a game-server \u4e14\u8be5\u5bb9\u5668\u7684\u955c\u50cf\u4e3a nginx:1.27.4\uff09\u7684 GS \u7684 opsState \u8bbe\u7f6e\u4e3a Kill\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'# kubectl create -f workflow.yaml\napiVersion: argoproj.io/v1alpha1\nkind: Workflow\nmetadata:\n  generateName: frame-sync-server-lossless-update-\n  namespace: kruise-game-system\nspec:\n  serviceAccountName: kruise-game-controller-manager\n  entrypoint: main\n  templates:\n    - name: main\n      steps:\n        - - name: clean-old-none-gs\n            template: clean-old-none-gs\n    - name: clean-old-none-gs\n      script:\n          image: crpi-8cm99ihkk1hz8ju9.cn-shenzhen.personal.cr.aliyuncs.com/scottliu/kruisegamectl:v0.0.5\n          command: ["/kruisegamectl"]\n          args:\n              - -r\n              - gameserver\n              - -f\n              - \'{"$and":[{"opsState":"None"},{"images":{"$all":["game-server,nginx:1.27.4"]}}]}\'\n              - -j\n              - \'[{"op":"replace","path":"/spec/opsState","value":"Kill"}]\'\n'})})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},66065:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/kruise-game-api-2-9c0904f58b5a2cef4c4445b115b37c0f.png"},89818:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/kruise-game-api-1-c3264fba8acf4593e818222bd5e66afd.png"},97287:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/kruise-game-api-4-8a9832bc3c141431669b16bf2b53e37a.png"}}]);
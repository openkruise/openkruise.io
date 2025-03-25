"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5812],{4841:(e,n,l)=>{l.r(n),l.d(n,{assets:()=>o,contentTitle:()=>t,default:()=>u,frontMatter:()=>c,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"cli-tool/kubectl-plugin","title":"Kubectl Plugin","description":"Kruise-tools \u4e3a Kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4e00\u7cfb\u5217\u547d\u4ee4\u884c\u5de5\u5177\uff0c\u5305\u62ec kubectl-kruise\uff0c\u5b83\u7684\u662f kubectl \u7684\u6807\u51c6\u63d2\u4ef6\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/current/cli-tool/kubectl-plugin.md","sourceDirName":"cli-tool","slug":"/cli-tool/kubectl-plugin","permalink":"/zh/docs/next/cli-tool/kubectl-plugin","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kubectl-plugin.md","tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Kubectl Plugin"},"sidebar":"docs","previous":{"title":"Other languages","permalink":"/zh/docs/next/developer-manuals/other-languages"},"next":{"title":"Kustomize ResourceDistribution Generator","permalink":"/zh/docs/next/cli-tool/kustomize-plugin"}}');var i=l(74848),r=l(28453);const c={title:"Kubectl Plugin"},t=void 0,o={},d=[{value:"\u5b89\u88c5",id:"\u5b89\u88c5",level:2},{value:"Install via Krew",id:"install-via-krew",level:3},{value:"Install manually",id:"install-manually",level:3},{value:"\u5347\u7ea7\u63d2\u4ef6",id:"\u5347\u7ea7\u63d2\u4ef6",level:2},{value:"\u901a\u8fc7 Krew \u5347\u7ea7",id:"\u901a\u8fc7-krew-\u5347\u7ea7",level:3},{value:"\u624b\u52a8\u5347\u7ea7",id:"\u624b\u52a8\u5347\u7ea7",level:3},{value:"Usage",id:"usage",level:2},{value:"expose",id:"expose",level:3},{value:"scale",id:"scale",level:3},{value:"rollout",id:"rollout",level:3},{value:"set",id:"set",level:3},{value:"exec",id:"exec",level:3},{value:"migrate",id:"migrate",level:3},{value:"scaledown",id:"scaledown",level:3}];function a(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"Kruise-tools"})," \u4e3a Kruise \u7684\u529f\u80fd\u63d0\u4f9b\u4e86\u4e00\u7cfb\u5217\u547d\u4ee4\u884c\u5de5\u5177\uff0c\u5305\u62ec ",(0,i.jsx)(n.code,{children:"kubectl-kruise"}),"\uff0c\u5b83\u7684\u662f ",(0,i.jsx)(n.code,{children:"kubectl"})," \u7684\u6807\u51c6\u63d2\u4ef6\u3002"]}),"\n",(0,i.jsx)(n.h2,{id:"\u5b89\u88c5",children:"\u5b89\u88c5"}),"\n",(0,i.jsx)(n.h3,{id:"install-via-krew",children:"Install via Krew"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://krew.sigs.k8s.io/",children:"Krew"})," \u662f\u4e00\u4e2a kubectl \u7684\u63d2\u4ef6\uff0ckrew \u672c\u8eab\u53ef\u4ee5\u81ea\u4e3e\u5b89\u88c5\u548c\u5347\u7ea7\u3002\n\u9996\u5148, ",(0,i.jsx)(n.a,{href:"https://krew.sigs.k8s.io/docs/user-guide/setup/install/",children:"\u5b89\u88c5 krew"}),"\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["\u6267\u884c ",(0,i.jsx)(n.code,{children:"kubectl krew install kruise"})," \u6765\u5b89\u88c5 kruise \u63d2\u4ef6\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["\u4f60\u53ef\u4ee5\u901a\u8fc7 ",(0,i.jsx)(n.code,{children:"kubectl-kruise"})," \u6216 ",(0,i.jsx)(n.code,{children:"kubectl kruise"})," \u6765\u4f7f\u7528\u3002"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl-kruise --help\n\n# or\n$ kubectl kruise --help\n"})}),"\n",(0,i.jsx)(n.h3,{id:"install-manually",children:"Install manually"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["\u4f60\u53ef\u4ee5\u4ece ",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/releases",children:"releases"})," \u9875\u9762\u4e0b\u8f7d\u4e8c\u8fdb\u5236\u6587\u4ef6\uff0c\u76ee\u524d\u63d0\u4f9b ",(0,i.jsx)(n.code,{children:"linux"}),"\u3001",(0,i.jsx)(n.code,{children:"darwin"}),"\uff08OS X\uff09\u3001",(0,i.jsx)(n.code,{children:"windows"})," \u7cfb\u7edf\u4ee5\u53ca ",(0,i.jsx)(n.code,{children:"x86_64"}),"\u3001",(0,i.jsx)(n.code,{children:"arm64"})," \u67b6\u6784\u3002\u5982\u679c\u4f60\u5728\u4f7f\u7528\u5176\u4ed6\u7684\u64cd\u4f5c\u7cfb\u7edf\u6216\u67b6\u6784\uff0c\u9700\u8981\u4e0b\u8f7d ",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"kruise-tools"})," \u6e90\u7801\u5e76\u901a\u8fc7 ",(0,i.jsx)(n.code,{children:"make build"})," \u6253\u5305\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"\u89e3\u538b\u7f29\uff0c\u5e76\u79fb\u52a8\u5230\u7cfb\u7edf PATH \u8def\u5f84\u4e2d\u3002"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ tar xvf kubectl-kruise-darwin-amd64.tar.gz\n$ mv darwin-amd64/kubectl-kruise /usr/local/bin/\n"})}),"\n",(0,i.jsxs)(n.ol,{start:"3",children:["\n",(0,i.jsxs)(n.li,{children:["\u4f60\u53ef\u4ee5\u901a\u8fc7 ",(0,i.jsx)(n.code,{children:"kubectl-kruise"})," \u6216 ",(0,i.jsx)(n.code,{children:"kubectl kruise"})," \u547d\u4ee4\u6765\u4f7f\u7528\u3002"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl-kruise --help\n\n# or\n$ kubectl kruise --help\n"})}),"\n",(0,i.jsx)(n.h2,{id:"\u5347\u7ea7\u63d2\u4ef6",children:"\u5347\u7ea7\u63d2\u4ef6"}),"\n",(0,i.jsx)(n.h3,{id:"\u901a\u8fc7-krew-\u5347\u7ea7",children:"\u901a\u8fc7 Krew \u5347\u7ea7"}),"\n",(0,i.jsxs)(n.p,{children:["\u6267\u884c ",(0,i.jsx)(n.code,{children:"kubectl krew upgrade kruise"})," \u5373\u53ef\u5347\u7ea7\u63d2\u4ef6\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"\u624b\u52a8\u5347\u7ea7",children:"\u624b\u52a8\u5347\u7ea7"}),"\n",(0,i.jsx)(n.p,{children:"\u624b\u52a8\u5347\u7ea7\u7684\u65b9\u5f0f\u4e0e\u5b89\u88c5\u8fc7\u7a0b\u4e00\u81f4\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.h3,{id:"expose",children:"expose"}),"\n",(0,i.jsx)(n.p,{children:"\u6839\u636e\u4e00\u4e2a workload\uff08\u5982 Deployment\u3001CloneSet\uff09\u3001Service \u6216 Pod \u6765\u751f\u6210\u4e00\u4e2a\u65b0\u7684 service \u5bf9\u8c61\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise expose cloneset nginx --port=80 --target-port=8000\n"})}),"\n",(0,i.jsx)(n.h3,{id:"scale",children:"scale"}),"\n",(0,i.jsx)(n.p,{children:"\u4e3a workload\uff08\u5982 Deployment, ReplicaSet, CloneSet, or Advanced StatefulSet\uff09 \u8bbe\u7f6e\u65b0\u7684\u526f\u672c\u6570\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise scale --replicas=3 cloneset nginx\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u5b83\u7684\u6548\u679c\u4e0e ",(0,i.jsx)(n.code,{children:"kubectl scale --replicas=3 cloneset nginx"})," \u76f8\u540c\uff0c\u5373\u539f\u751f ",(0,i.jsx)(n.code,{children:"kubectl scale"})," \u4e5f\u9002\u7528\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"rollout",children:"rollout"}),"\n",(0,i.jsxs)(n.p,{children:["\u53ef\u7528\u7684\u5b50\u547d\u4ee4: ",(0,i.jsx)(n.code,{children:"history"}),", ",(0,i.jsx)(n.code,{children:"pause"}),", ",(0,i.jsx)(n.code,{children:"restart"}),", ",(0,i.jsx)(n.code,{children:"resume"}),", ",(0,i.jsx)(n.code,{children:"status"}),", ",(0,i.jsx)(n.code,{children:"undo"}),", ",(0,i.jsx)(n.code,{children:"approve"}),"\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'$ kubectl kruise rollout undo cloneset/nginx\n\n# built-in statefulsets\n$ kubectl kruise rollout status statefulsets/sts1\n\n# kruise statefulsets\n$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts2\n\n# approve a kruise rollout resource named "rollout-demo" in "ns-demo" namespace\n$ kubectl-kruise rollout approve rollout-demo -n ns-demo\n'})}),"\n",(0,i.jsx)(n.h3,{id:"set",children:"set"}),"\n",(0,i.jsxs)(n.p,{children:["\u53ef\u7528\u7684\u5b50\u547d\u4ee4: ",(0,i.jsx)(n.code,{children:"env"}),", ",(0,i.jsx)(n.code,{children:"image"}),", ",(0,i.jsx)(n.code,{children:"resources"}),", ",(0,i.jsx)(n.code,{children:"selector"}),", ",(0,i.jsx)(n.code,{children:"serviceaccount"}),", ",(0,i.jsx)(n.code,{children:"subject"}),"\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise set env cloneset/nginx STORAGE_DIR=/local\n\n$ kubectl kruise set image cloneset/nginx busybox=busybox nginx=nginx:1.9.1\n"})}),"\n",(0,i.jsx)(n.h3,{id:"exec",children:"exec"}),"\n",(0,i.jsxs)(n.p,{children:["\u901a\u8fc7 ",(0,i.jsx)(n.code,{children:"exec"})," \u547d\u4ee4\u76f4\u63a5\u8fdb\u5165\u5230 Pod \u7684 sidecar \u4e2d\u3002"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# exec sidecar in pod\n$ kubectl kruise exec mypod -S sidecar-container -i -t -- bash\n"})}),"\n",(0,i.jsx)(n.h3,{id:"migrate",children:"migrate"}),"\n",(0,i.jsx)(n.p,{children:"\u76ee\u524d\u652f\u6301\u4ece Deployment \u8fc1\u79fb\u5230 CloneSet\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Create an empty CloneSet from an existing Deployment.\n$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create\n\n# Create a same replicas CloneSet from an existing Deployment.\n$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create --copy\n\n# Migrate replicas from an existing Deployment to an existing CloneSet.\n$ kubectl-kruise migrate CloneSet --from Deployment -n default --src-name cloneset-name --dst-name deployment-name --replicas 10 --max-surge=2\n"})}),"\n",(0,i.jsx)(n.h3,{id:"scaledown",children:"scaledown"}),"\n",(0,i.jsx)(n.p,{children:"\u5bf9 cloneset \u6307\u5b9a pod \u7f29\u5bb9\u3002"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Scale down 2 with  selective pods\n$ kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u5b83\u4f1a\u5c06 cloneset \u8bbe\u7f6e ",(0,i.jsx)(n.strong,{children:"replicas=replicas-2"}),"\uff0c\u5e76\u5220\u9664\u6307\u5b9a\u7684\u4e24\u4e2a pod\u3002"]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},28453:(e,n,l)=>{l.d(n,{R:()=>c,x:()=>t});var s=l(96540);const i={},r=s.createContext(i);function c(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);
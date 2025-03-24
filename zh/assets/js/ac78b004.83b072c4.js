"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4116],{11520:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>x,frontMatter:()=>i,metadata:()=>l,toc:()=>o});const l=JSON.parse('{"id":"introduction","title":"\u4ecb\u7ecd","description":"\u4ec0\u4e48\u662f Kruise Rollouts\uff1f","source":"@site/i18n/zh/docusaurus-plugin-content-docs-rollouts/current/introduction.md","sourceDirName":".","slug":"/introduction","permalink":"/zh/rollouts/introduction","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{},"sidebar":"rollouts","next":{"title":"\u5b89\u88c5","permalink":"/zh/rollouts/installation"}}');var t=s(74848),r=s(28453);const i={},d="\u4ecb\u7ecd",c={},o=[{value:"\u4ec0\u4e48\u662f Kruise Rollouts\uff1f",id:"\u4ec0\u4e48\u662f-kruise-rollouts",level:2},{value:"\u4e3b\u8981\u7279\u70b9",id:"\u4e3b\u8981\u7279\u70b9",level:2},{value:"\u6f14\u793a\u5c55\u793a",id:"\u6f14\u793a\u5c55\u793a",level:2},{value:"Kruise Rollouts \u4e0e\u5176\u4ed6\u7ec4\u4ef6\u5bf9\u6bd4",id:"kruise-rollouts-\u4e0e\u5176\u4ed6\u7ec4\u4ef6\u5bf9\u6bd4",level:2},{value:"\u63a5\u4e0b\u6765\u7684\u6b65\u9aa4",id:"\u63a5\u4e0b\u6765\u7684\u6b65\u9aa4",level:2}];function h(e){const n={a:"a",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"\u4ecb\u7ecd",children:"\u4ecb\u7ecd"})}),"\n",(0,t.jsx)(n.h2,{id:"\u4ec0\u4e48\u662f-kruise-rollouts",children:"\u4ec0\u4e48\u662f Kruise Rollouts\uff1f"}),"\n",(0,t.jsxs)(n.p,{children:["Kruise Rollouts \u662f\u4e00\u4e2a ",(0,t.jsx)(n.strong,{children:"Bypass(\u65c1\u8def)"})," \u7ec4\u4ef6\uff0c\u63d0\u4f9b ",(0,t.jsx)(n.strong,{children:"\u9ad8\u7ea7\u6e10\u8fdb\u5f0f\u4ea4\u4ed8\u529f\u80fd"}),"\n\u3002\u5b83\u7684\u652f\u6301\u53ef\u4ee5\u5e2e\u52a9\u60a8\u5b9e\u73b0\u5bf9\u5e94\u7528\u7a0b\u5e8f\u7684\u66f4\u5e73\u7a33\u548c\u53d7\u63a7\u7684\u66f4\u6539\u90e8\u7f72\uff0c\u652f\u6301\u91d1\u4e1d\u96c0\u3001\u84dd\u7eff\u3001\u591a\u6279\u6b21\u548cA/B\u6d4b\u8bd5\u4ea4\u4ed8\u6a21\u5f0f\uff0c\u540c\u65f6\u5b83\u517c\u5bb9 Gateway API \u548c\u5404\u79cdIngress \u5b9e\u73b0\uff0c\u4f7f\u5176\u66f4\u5bb9\u6613\u96c6\u6210\u5230\u60a8\u7684\u73b0\u6709\u57fa\u7840\u8bbe\u65bd\u4e2d\u3002\u603b\u7684\u6765\u8bf4\uff0c\u5bf9\u4e8e\u5e0c\u671b\u4f18\u5316\u5176\u90e8\u7f72\u6d41\u7a0b\u7684 Kubernetes \u7528\u6237\u6765\u8bf4\uff0cKruise Rollouts\u662f\u4e00\u4e2a\u6709\u4ef7\u503c\u7684\u5de5\u5177\uff01"]}),"\n",(0,t.jsx)("center",{children:(0,t.jsx)("img",{src:s(88369).A,width:"90%"})}),"\n",(0,t.jsx)(n.h2,{id:"\u4e3b\u8981\u7279\u70b9",children:"\u4e3b\u8981\u7279\u70b9"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"\u4e30\u5bcc\u7684\u53d1\u5e03\u7b56\u7565"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"\u7528\u4e8e Deployment\u3001CloneSet\u3001StatefulSet\u3001Advanced StatefulSet\u3001Advanced DaemonSet \u7684\u591a\u6279\u6b21\u66f4\u65b0\u7b56\u7565\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u7528\u4e8e Deployment \u7684\u91d1\u4e1d\u96c0(Canary)\u66f4\u65b0\u7b56\u7565\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u7528\u4e8e Deployment\u3001CloneSet \u7684\u84dd\u7eff(Blue-Green)\u66f4\u65b0\u7b56\u7565\u3002"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"\u4e30\u5bcc\u7684\u6d41\u91cf\u8def\u7531\u7ba1\u7406\u7b56\u7565"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"\u5728\u66f4\u65b0\u5de5\u4f5c\u8d1f\u8f7d\u65f6\u8fdb\u884c\u6d41\u91cf\u7ec6\u7c92\u5ea6\u3001\u52a0\u6743\u6d41\u91cf\u8f6c\u79fb\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u6d41\u91cfA/B\u6d4b\u8bd5\uff0c\u57fa\u4e8eHTTP\u5934\u548cCookie\u8fdb\u884c\u6d41\u91cf\u8f6c\u79fb\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u7aef\u5230\u7aef\u6d41\u91cf\u7070\u5ea6"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"\u4e30\u5bcc\u7684\u6d41\u91cf\u534f\u8bae\u652f\u6301"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Ingress \u63a7\u5236\u5668\u96c6\u6210\uff1aNGINX\u3001ALB\u3001Higress\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u901a\u8fc7 GatewayAPI \u8fdb\u884c\u670d\u52a1\u7f51\u683c\u96c6\u6210\u3002"}),"\n",(0,t.jsx)(n.li,{children:"\u53ef\u63d2\u62d4\u7684Lua\u811a\u672c\uff0c\u4ee5\u4fbf\u8f7b\u677e\u6269\u5c55\u5230\u5176\u4ed6 Kubernetes \u6d41\u91cf\u534f\u8bae\uff08\u751a\u81f3CRD\uff09\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"\u6f14\u793a\u5c55\u793a",children:"\u6f14\u793a\u5c55\u793a"}),"\n",(0,t.jsx)(n.p,{children:"\u8fd9\u662f\u4e00\u4e2a\u7528\u4e8e Deployment \u7684\u591a\u6279\u6b21\u66f4\u65b0\u7b56\u7565\u7684\u6f14\u793a\u3002"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC",children:(0,t.jsx)(n.img,{src:"https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC.svg",alt:"asciicast"})})}),"\n",(0,t.jsx)(n.h2,{id:"kruise-rollouts-\u4e0e\u5176\u4ed6\u7ec4\u4ef6\u5bf9\u6bd4",children:"Kruise Rollouts \u4e0e\u5176\u4ed6\u7ec4\u4ef6\u5bf9\u6bd4"}),"\n",(0,t.jsxs)(n.p,{children:["Kruise Rollouts \u4e0e ",(0,t.jsx)(n.a,{href:"https://argoproj.github.io/rollouts/",children:"Argo Rollout"})," \u548c ",(0,t.jsx)(n.a,{href:"https://fluxcd.io/flagger/",children:"Flux Flagger"}),"\n\u7684\u5bf9\u6bd4\u3002"]}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"\u7ec4\u4ef6"}),(0,t.jsx)(n.th,{children:(0,t.jsx)(n.strong,{children:"Kruise Rollouts"})}),(0,t.jsx)(n.th,{children:"Argo Rollouts"}),(0,t.jsx)(n.th,{children:"Flux Flagger"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u6838\u5fc3\u6982\u5ff5"}),(0,t.jsx)(n.td,{children:"\u589e\u5f3a\u73b0\u6709\u7684\u5de5\u4f5c\u8d1f\u8f7d"}),(0,t.jsx)(n.td,{children:"\u66ff\u6362\u60a8\u7684\u5de5\u4f5c\u8d1f\u8f7d"}),(0,t.jsx)(n.td,{children:"\u7ba1\u7406\u60a8\u7684\u5de5\u4f5c\u8d1f\u8f7d"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u67b6\u6784"}),(0,t.jsx)(n.td,{children:"Bypass"}),(0,t.jsx)(n.td,{children:"\u65b0\u7684\u5de5\u4f5c\u8d1f\u8f7d\u7c7b\u578b"}),(0,t.jsx)(n.td,{children:"Bypass"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u63d2\u62d4\u548c\u70ed\u5207\u6362"}),(0,t.jsx)(n.td,{children:"\u662f"}),(0,t.jsx)(n.td,{children:"\u5426"}),(0,t.jsx)(n.td,{children:"\u5426"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u53d1\u5e03\u7c7b\u578b"}),(0,t.jsx)(n.td,{children:"\u591a\u6279\u6b21\u3001\u91d1\u4e1d\u96c0\u3001A/B\u6d4b\u8bd5\u3001\u5168\u94fe\u8def\u7070\u5ea6\u3001\u84dd\u7eff"}),(0,t.jsx)(n.td,{children:"\u591a\u6279\u6b21\u3001\u91d1\u4e1d\u96c0\u3001\u84dd\u7eff\u3001A/B\u6d4b\u8bd5"}),(0,t.jsx)(n.td,{children:"\u91d1\u4e1d\u96c0\u3001\u84dd\u7eff\u3001A/B\u6d4b\u8bd5"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u5de5\u4f5c\u8d1f\u8f7d\u7c7b\u578b"}),(0,t.jsx)(n.td,{children:"Deployment\u3001StatefulSet\u3001CloneSet\u3001Advanced StatefulSet\u3001Advanced DaemonSet"}),(0,t.jsx)(n.td,{children:"Agro-Rollout"}),(0,t.jsx)(n.td,{children:"Deployment\u3001DaemonSet"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u6d41\u91cf\u7c7b\u578b"}),(0,t.jsx)(n.td,{children:"Ingress\u3001GatewayAPI\u3001CRD\uff08\u9700\u8981 Lua \u811a\u672c\uff09"}),(0,t.jsx)(n.td,{children:"Ingress\u3001GatewayAPI\u3001APISIX\u3001Traefik\u3001SMI \u7b49\u7b49"}),(0,t.jsx)(n.td,{children:"Ingress\u3001GatewayAPI\u3001APISIX\u3001Traefik\u3001SMI \u7b49\u7b49"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"\u8fc1\u79fb\u6210\u672c"}),(0,t.jsx)(n.td,{children:"\u65e0\u9700\u8fc1\u79fb\u5de5\u4f5c\u8d1f\u8f7d\u548cPods"}),(0,t.jsx)(n.td,{children:"\u5fc5\u987b\u8fc1\u79fb\u5de5\u4f5c\u8d1f\u8f7d\u548cPods"}),(0,t.jsx)(n.td,{children:"\u5fc5\u987b\u8fc1\u79fbPods"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"HPA \u517c\u5bb9\u6027"}),(0,t.jsx)(n.td,{children:"\u662f"}),(0,t.jsx)(n.td,{children:"\u662f"}),(0,t.jsx)(n.td,{children:"\u5426"})]})]})]}),"\n",(0,t.jsx)(n.h2,{id:"\u63a5\u4e0b\u6765\u7684\u6b65\u9aa4",children:"\u63a5\u4e0b\u6765\u7684\u6b65\u9aa4"}),"\n",(0,t.jsx)(n.p,{children:"\u4ee5\u4e0b\u662f\u4e00\u4e9b\u63a8\u8350\u7684\u4e0b\u4e00\u6b65\u64cd\u4f5c\uff1a"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:(0,t.jsx)(n.a,{href:"/zh/rollouts/installation",children:"\u5b89\u88c5"})})," Kruise Rollout"]}),"\n"]})]})}function x(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>d});var l=s(96540);const t={},r=l.createContext(t);function i(e){const n=l.useContext(r);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),l.createElement(r.Provider,{value:n},e.children)}},88369:(e,n,s)=>{s.d(n,{A:()=>l});const l=s.p+"assets/images/intro-b644231356f16367db5486c77bb99a02.png"}}]);
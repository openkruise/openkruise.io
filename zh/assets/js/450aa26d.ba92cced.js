"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5504],{28453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>c});var t=n(96540);const a={},s=t.createContext(a);function i(e){const r=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(s.Provider,{value:r},e.children)}},36566:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>o,contentTitle:()=>c,default:()=>l,frontMatter:()=>i,metadata:()=>t,toc:()=>u});const t=JSON.parse('{"id":"user-manuals/game-matchmaking","title":"\u6e38\u620f\u5339\u914d","description":"\u4f1a\u8bdd\u7c7b\u6e38\u620f\u901a\u5e38\u9700\u8981\u5339\u914d\u670d\u52a1\u8ba9\u73a9\u5bb6\u627e\u5230\u5408\u9002\u7684\u961f\u53cb\u53ca\u5bf9\u624b\u7ec4\u6210\u5bf9\u5c40\uff0c\u5e76\u4e3a\u8be5\u5bf9\u5c40\u5206\u914d\u5408\u9002\u7684\u6e38\u620f\u670d\u3002\u7ec4\u6210\u5bf9\u5c40\u7684\u73a9\u5bb6\u62ff\u5230\u6e38\u620f\u670d\u5730\u5740\u540e\u65b9\u53ef\u8fdb\u5165\u6e38\u620f\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/user-manuals/game-matchmaking.md","sourceDirName":"user-manuals","slug":"/user-manuals/game-matchmaking","permalink":"/zh/kruisegame/user-manuals/game-matchmaking","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u6e38\u620f\u670d\u76d1\u63a7","permalink":"/zh/kruisegame/user-manuals/gameserver-monitor"},"next":{"title":"\u6e38\u620f\u670d\u8fd0\u7ef4\u63a7\u5236\u53f0","permalink":"/zh/kruisegame/user-manuals/game-dashboard"}}');var a=n(74848),s=n(28453);const i={},c="\u6e38\u620f\u5339\u914d",o={},u=[{value:"\u4f7f\u7528\u8bf4\u660e",id:"\u4f7f\u7528\u8bf4\u660e",level:2}];function m(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(r.header,{children:(0,a.jsx)(r.h1,{id:"\u6e38\u620f\u5339\u914d",children:"\u6e38\u620f\u5339\u914d"})}),"\n",(0,a.jsxs)(r.p,{children:["\u4f1a\u8bdd\u7c7b\u6e38\u620f\u901a\u5e38\u9700\u8981",(0,a.jsx)(r.code,{children:"\u5339\u914d\u670d\u52a1"}),"\u8ba9\u73a9\u5bb6\u627e\u5230\u5408\u9002\u7684\u961f\u53cb\u53ca\u5bf9\u624b\u7ec4\u6210\u5bf9\u5c40\uff0c\u5e76\u4e3a\u8be5\u5bf9\u5c40\u5206\u914d\u5408\u9002\u7684\u6e38\u620f\u670d\u3002\u7ec4\u6210\u5bf9\u5c40\u7684\u73a9\u5bb6\u62ff\u5230\u6e38\u620f\u670d\u5730\u5740\u540e\u65b9\u53ef\u8fdb\u5165\u6e38\u620f\u3002"]}),"\n",(0,a.jsxs)(r.p,{children:["OKG\u652f\u6301\u4e91\u539f\u751f\u6e38\u620f\u5339\u914d\u6846\u67b6",(0,a.jsx)(r.a,{href:"https://github.com/googleforgames/open-match",children:"Open Match"}),"\uff0c\n\u5e76\u57fa\u4e8eOpen Match\u6784\u5efa\u4e86",(0,a.jsx)(r.a,{href:"https://github.com/CloudNativeGame/kruise-game-open-match-director",children:"kruise-game-open-match-director"}),"\u7ec4\u4ef6\uff0c\n\u4e3a\u5f62\u6210\u5bf9\u5c40\u7684\u73a9\u5bb6\u5206\u914d\u6e38\u620f\u670d\u5730\u5740\u3002"]}),"\n",(0,a.jsx)(r.h2,{id:"\u4f7f\u7528\u8bf4\u660e",children:"\u4f7f\u7528\u8bf4\u660e"}),"\n",(0,a.jsxs)(r.ul,{children:["\n",(0,a.jsxs)(r.li,{children:["Kubernetes\u96c6\u7fa4\u4e2d\u9700\u8981\u5b89\u88c5 ",(0,a.jsx)(r.code,{children:"OpenKruiseGame"})," \u3001 ",(0,a.jsx)(r.code,{children:"Open Match"})," \u4ee5\u53ca ",(0,a.jsx)(r.code,{children:"kruise-game-open-match-director"})]}),"\n",(0,a.jsxs)(r.li,{children:["\u88abGameServerSet\u7ba1\u7406\u4e14\u5f85\u5339\u914d\u7684\u6e38\u620f\u670d\u9700\u8981\u914d\u7f6eNetwork\u5b57\u6bb5\uff0c\u4f7f\u6e38\u620f\u670d\u5177\u5907\u76f4\u8fde\u7f51\u7edc\u3002\u8be6\u7ec6\u53ef\u53c2\u8003",(0,a.jsx)(r.a,{href:"/zh/kruisegame/user-manuals/network",children:"\u7f51\u7edc\u529f\u80fd\u6587\u6863"})]}),"\n",(0,a.jsx)(r.li,{children:"kruise-game-open-match-director \u5c06\u9009\u62e9\u7f51\u7edc\u53ef\u7528\u4e14OpsState\u4e3aNone\u7684\u6e38\u620f\u670d\uff0c\u83b7\u53d6\u5bf9\u5e94\u7f51\u7edc\u8fde\u63a5\u4fe1\u606f\uff0c\u5206\u914d\u4e88Match\u4e2d\u7684Tickets\u3002"}),"\n",(0,a.jsxs)(r.li,{children:["kruise-game-open-match-director \u5c06\u5df2\u5206\u914d\u7684GameServer\u5bf9\u5e94\u7684OpsState\u5b57\u6bb5\u6807\u8bb0\u4e3aAllocated\uff0c\u6b64\u65f6\u8be5GameServer\u4e0d\u4f1a\u518d\u88ab\u5206\u914d\uff0c\u4e14\u6c34\u5e73\u7f29\u5bb9\u65f6\u4f18\u5148\u7ea7\u8f83\u4f4e\uff0c\u907f\u514d\u88ab\u8f7b\u6613\u5220\u9664\u3002\u6e38\u620f\u670d\u5177\u4f53\u7f29\u5bb9\u987a\u5e8f\u53ef\u53c2\u8003",(0,a.jsx)(r.a,{href:"/zh/kruisegame/user-manuals/gameservers-scale#openkruisegame%E7%9A%84%E6%B0%B4%E5%B9%B3%E4%BC%B8%E7%BC%A9%E7%89%B9%E6%80%A7",children:"\u6e38\u620f\u670d\u4f38\u7f29\u6587\u6863"})]}),"\n",(0,a.jsxs)(r.li,{children:["kruise-game-open-match-director \u66f4\u591a\u529f\u80fd\u8bf7\u53c2\u8003",(0,a.jsx)(r.a,{href:"https://github.com/CloudNativeGame/kruise-game-open-match-director",children:"GitHub"})]}),"\n",(0,a.jsxs)(r.li,{children:["\u5173\u4e8eOKG + Open Match\u66f4\u591a\u793a\u4f8b\u8bf7\u53c2\u8003",(0,a.jsx)(r.a,{href:"https://github.com/CloudNativeGame/kruise-game-open-match-example",children:"GitHub"})]}),"\n"]})]})}function l(e={}){const{wrapper:r}={...(0,s.R)(),...e.components};return r?(0,a.jsx)(r,{...e,children:(0,a.jsx)(m,{...e})}):m(e)}}}]);
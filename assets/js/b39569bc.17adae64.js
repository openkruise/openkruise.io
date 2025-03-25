"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7190],{28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>o});var r=t(96540);const s={},a=r.createContext(s);function i(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(a.Provider,{value:n},e.children)}},93908:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"user-manuals/container-startup-sequence-control","title":"Startup Sequence Control","description":"Feature overview","source":"@site/kruisegame/user-manuals/container-startup-sequence-control.md","sourceDirName":"user-manuals","slug":"/user-manuals/container-startup-sequence-control","permalink":"/kruisegame/user-manuals/container-startup-sequence-control","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Gameservers Scale","permalink":"/kruisegame/user-manuals/gameservers-scale"},"next":{"title":"Service Qualities","permalink":"/kruisegame/user-manuals/service-qualities"}}');var s=t(74848),a=t(28453);const i={},o="Startup Sequence Control",u={},c=[{value:"Feature overview",id:"feature-overview",level:2},{value:"Examples",id:"examples",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"startup-sequence-control",children:"Startup Sequence Control"})}),"\n",(0,s.jsx)(n.h2,{id:"feature-overview",children:"Feature overview"}),"\n",(0,s.jsx)(n.p,{children:"When there are multiple containers in a single game server Pod, sometimes it is necessary to require the startup sequence of the containers, OKG provides the function of custom order startup."}),"\n",(0,s.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,s.jsx)(n.p,{children:"Add KRUISE_CONTAINER_PRIORITY environment variable in GameServerSet.Spec.GameServerTemplate.spec.containers:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\n\n# ...\n\nspec:\n  gameServerTemplate:\n    spec:\n      containers:\n      - name: main\n        # ...\n      - name: sidecar\n        env:\n        - name: KRUISE_CONTAINER_PRIORITY\n          value: "1"\n    \n# ...\n\n'})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The value range is [-2147483647, 2147483647], if not written, the default is 0."}),"\n",(0,s.jsx)(n.li,{children:"Containers with high weights are guaranteed to start before containers with low weights."}),"\n",(0,s.jsx)(n.li,{children:"Containers of the same weight do not guarantee start order."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"In the above example, when the game server starts, because the sidecar has a higher weight, start the sidecar container first, and then start the main container."})]})}function d(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}}}]);
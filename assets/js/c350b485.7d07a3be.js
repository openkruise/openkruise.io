"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8125],{22233:(e,r,t)=>{t.d(r,{A:()=>n});const n=t.p+"assets/images/gra-dash-7bc17dc25d70d2b5d01a73f98d1cf290.png"},28453:(e,r,t)=>{t.d(r,{R:()=>i,x:()=>o});var n=t(96540);const s={},a=n.createContext(s);function i(e){const r=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(a.Provider,{value:r},e.children)}},72322:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"user-manuals/gameserver-monitor","title":"GameServer Monitor","description":"Metrics available","source":"@site/kruisegame/user-manuals/gameserver-monitor.md","sourceDirName":"user-manuals","slug":"/user-manuals/gameserver-monitor","permalink":"/kruisegame/user-manuals/gameserver-monitor","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Custom Lifecycle Management","permalink":"/kruisegame/user-manuals/lifecycle"},"next":{"title":"Game MatchMaking","permalink":"/kruisegame/user-manuals/game-matchmaking"}}');var s=t(74848),a=t(28453);const i={},o="GameServer Monitor",d={},l=[{value:"Metrics available",id:"metrics-available",level:2},{value:"Monitoring Dashboard",id:"monitoring-dashboard",level:2},{value:"Dashboard Import",id:"dashboard-import",level:3},{value:"Dashboard Introduction",id:"dashboard-introduction",level:3}];function c(e){const r={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.header,{children:(0,s.jsx)(r.h1,{id:"gameserver-monitor",children:"GameServer Monitor"})}),"\n",(0,s.jsx)(r.h2,{id:"metrics-available",children:"Metrics available"}),"\n",(0,s.jsx)(r.p,{children:"OKG by default exposes game server related Prometheus metrics, including:"}),"\n",(0,s.jsxs)(r.table,{children:[(0,s.jsx)(r.thead,{children:(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.th,{children:"Name"}),(0,s.jsx)(r.th,{children:"Description"}),(0,s.jsx)(r.th,{children:"Type"})]})}),(0,s.jsxs)(r.tbody,{children:[(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServersStateCount"}),(0,s.jsx)(r.td,{children:"Number of game servers in different states"}),(0,s.jsx)(r.td,{children:"gauge"})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServersOpsStateCount"}),(0,s.jsx)(r.td,{children:"Number of game servers in different ops states"}),(0,s.jsx)(r.td,{children:"gauge"})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServersTotal"}),(0,s.jsx)(r.td,{children:"Total number of game servers that have existed"}),(0,s.jsx)(r.td,{children:"counter"})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServerSetsReplicasCount"}),(0,s.jsx)(r.td,{children:"Number of replicas for each GameServerSet"}),(0,s.jsx)(r.td,{children:"gauge"})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServerDeletionPriority"}),(0,s.jsx)(r.td,{children:"Deletion priority for game servers"}),(0,s.jsx)(r.td,{children:"gauge"})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:"GameServerUpdatePriority"}),(0,s.jsx)(r.td,{children:"Update priority for game servers"}),(0,s.jsx)(r.td,{children:"gauge"})]})]})]}),"\n",(0,s.jsx)(r.h2,{id:"monitoring-dashboard",children:"Monitoring Dashboard"}),"\n",(0,s.jsx)(r.h3,{id:"dashboard-import",children:"Dashboard Import"}),"\n",(0,s.jsxs)(r.ol,{children:["\n",(0,s.jsxs)(r.li,{children:["Import ",(0,s.jsx)(r.a,{href:"https://github.com/openkruise/kruise-game/blob/master/config/prometheus/grafana.json",children:"grafana.json"})," to Grafana"]}),"\n",(0,s.jsx)(r.li,{children:"Choose data source"}),"\n",(0,s.jsx)(r.li,{children:"Replace UID and complete the import"}),"\n"]}),"\n",(0,s.jsx)(r.h3,{id:"dashboard-introduction",children:"Dashboard Introduction"}),"\n",(0,s.jsx)(r.p,{children:"The imported dashboard is shown below:"}),"\n",(0,s.jsx)("img",{src:t(22233).A,width:"90%"}),"\n",(0,s.jsx)(r.p,{children:"From top to bottom, it includes:"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsx)(r.li,{children:"First row: number of GameServers in each current state, and a pie chart showing the proportion of GameServers in each current state"}),"\n",(0,s.jsx)(r.li,{children:"Second row: line chart showing the number of GameServers in each state over time"}),"\n",(0,s.jsx)(r.li,{children:"Third row: line chart showing the changes in deletion and update priorities for GameServers (can be filtered by namespace and gsName in the top-left corner)"}),"\n",(0,s.jsx)(r.li,{children:"Fourth and fifth rows: line charts showing the number of GameServers in different states for each GameServerSet (can be filtered by namespace and gssName in the top-left corner)"}),"\n"]})]})}function h(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}}}]);
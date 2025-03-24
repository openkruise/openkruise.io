"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7600],{28453:(e,t,i)=>{i.d(t,{R:()=>r,x:()=>l});var n=i(96540);const s={},a=n.createContext(s);function r(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),n.createElement(a.Provider,{value:t},e.children)}},47146:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>r,metadata:()=>n,toc:()=>d});const n=JSON.parse('{"id":"user-manuals/faq","title":"FAQ","description":"The State and OpsState of GameServer respectively represent what? What is the difference?","source":"@site/kruisegame/user-manuals/faq.md","sourceDirName":"user-manuals","slug":"/user-manuals/faq","permalink":"/kruisegame/user-manuals/faq","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"CRD Field Description","permalink":"/kruisegame/user-manuals/crd-field-description"},"next":{"title":"Best Practice for Session-Based Games(PvP room)","permalink":"/kruisegame/best-practices/session-based-game"}}');var s=i(74848),a=i(28453);const r={},l="FAQ",o={},d=[{value:"The State and OpsState of GameServer respectively represent what? What is the difference?",id:"the-state-and-opsstate-of-gameserver-respectively-represent-what-what-is-the-difference",level:3},{value:"What is the horizontal scaling logic of the GameServer when ReserveId is configured?",id:"what-is-the-horizontal-scaling-logic-of-the-gameserver-when-reserveid-is-configured",level:3}];function h(e){const t={h1:"h1",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"faq",children:"FAQ"})}),"\n",(0,s.jsx)(t.h3,{id:"the-state-and-opsstate-of-gameserver-respectively-represent-what-what-is-the-difference",children:"The State and OpsState of GameServer respectively represent what? What is the difference?"}),"\n",(0,s.jsx)(t.p,{children:"State represents the runtime state of the game server, related to the lifecycle of the pod and cannot be customized by the user. The current State includes the following values:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Creating \u2014\u2014 indicates that the pod is being created, equivalent to Pod Pending"}),"\n",(0,s.jsx)(t.li,{children:"Ready \u2014\u2014 indicates that the pod is ready, with the pod ready condition being true"}),"\n",(0,s.jsx)(t.li,{children:"NotReady \u2014\u2014 indicates that the pod is not ready, with the pod ready condition being false"}),"\n",(0,s.jsx)(t.li,{children:"Crash \u2014\u2014 indicates that the pod has failed, equivalent to Pod Failed"}),"\n",(0,s.jsx)(t.li,{children:"Deleting \u2014\u2014 indicates that the pod is being deleted, equivalent to Pod Terminating"}),"\n",(0,s.jsx)(t.li,{children:"Updating \u2014\u2014 indicates that the pod is undergoing in-place upgrade"}),"\n",(0,s.jsx)(t.li,{children:"PreDelete \u2014\u2014 indicates that the pod is in a pre-deletion state. It appears after executing the pod's deletion action with a deletion lifecycle hook set and entering the Deleting state after resolving the deadlock"}),"\n",(0,s.jsx)(t.li,{children:"PreUpdate \u2014\u2014 indicates that the pod is in a pre-upgrade state. It appears after performing an in-place upgrade of the pod with an update lifecycle hook set and entering the Updating state after resolving the deadlock"}),"\n",(0,s.jsx)(t.li,{children:"Unknown \u2014\u2014 all other states not mentioned above"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"OpsState represents the operational state of the game server, determined by the business and can be freely modified by the user. OKG provides some reserved values with special meanings, including:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"None \u2014\u2014 default value, representing no exceptions or special states"}),"\n",(0,s.jsx)(t.li,{children:"WaitToBeDeleted \u2014\u2014 the highest priority for game server scaling down, and will be automatically reclaimed after configuring automatic scaling policy"}),"\n",(0,s.jsx)(t.li,{children:"Maintaining \u2014\u2014 the lowest priority for game server scaling down"}),"\n",(0,s.jsx)(t.li,{children:"Allocated \u2014\u2014 the scaling down priority of the game server is greater than Maintaining but less than None. It usually represents that the game server has been allocated and can be used in game matching scenarios."}),"\n",(0,s.jsx)(t.li,{children:"Kill \u2014\u2014 game servers with Kill set will be directly deleted by the OKG controller"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Users can change the GameServer opsState by calling the K8s API (or kubectl), and can also automatically trigger the corresponding GameServer opsState change by customizing the service quality features within the business container."}),"\n",(0,s.jsx)(t.h3,{id:"what-is-the-horizontal-scaling-logic-of-the-gameserver-when-reserveid-is-configured",children:"What is the horizontal scaling logic of the GameServer when ReserveId is configured?"}),"\n",(0,s.jsx)(t.p,{children:"In the case of configuring ReserveId, the horizontally scaled GameServer that is being scaled down actually falls into two categories:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"GameServer explicitly specified by the user with Reserve"}),"\n",(0,s.jsx)(t.li,{children:"GameServer scaled down by OKG's horizontal scaling feature."}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Here, the former can be called the explicit scaling down list and the latter can be called the implicit scaling down list."}),"\n",(0,s.jsx)(t.p,{children:"At this point, there are two principles:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"The explicit list has the highest authority, representing user instructions, and the specified ID will definitely not exist in the cluster."}),"\n",(0,s.jsx)(t.li,{children:"Try not to make changes to the existing GameServer list to ensure minimal changes."}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Here are a few examples:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsx)(t.p,{children:"Current IDs are [0, 2, 3, 5], and ReserveId is [4]. If the replicas are adjusted from 4 to 6, the situation after scaling up is: ReserveId is [4], and the existing IDs are [0, 1, 2, 3, 5, 6]."}),"\n",(0,s.jsx)(t.p,{children:"Here it is easy to understand that ID 1 belongs to the implicit scaling down list and will be scaled up first when there is a scaling up requirement, while ID 4 belongs to the explicit scaling down list and will not be scaled up as long as it is in the ReserveId."}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsx)(t.p,{children:"Current IDs are [0, 2, 3, 5], and ReserveId is [4]. If the replicas remain unchanged and the reserve is cleared, the changed situation is: ReserveId is [], and the existing IDs are [0, 2, 3, 5]."}),"\n",(0,s.jsx)(t.p,{children:"It is important to note that, due to the principle of minimal changes, after removing ID 4 from ReserveId, it transitions to the implicit scaling down list, and there is no scaling up or scaling down behavior for the existing GameServers as there is no scaling up requirement at the moment."}),"\n"]}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);
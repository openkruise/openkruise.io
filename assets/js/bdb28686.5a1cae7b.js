"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5737],{28453:(e,a,n)=>{n.d(a,{R:()=>o,x:()=>l});var t=n(96540);const r={},i=t.createContext(r);function o(e){const a=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function l(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),t.createElement(i.Provider,{value:a},e.children)}},29620:(e,a,n)=>{n.d(a,{A:()=>t});const t=n.p+"assets/images/e2e-a3b7ceca7d351bf273d13c68e308d374.png"},31482:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>u,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"user-manuals/strategy-end2end-canary-update","title":"End to End Canary Release","description":"End to End Canary Release Process","source":"@site/rollouts/user-manuals/strategy-end2end-canary-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-end2end-canary-update","permalink":"/rollouts/user-manuals/strategy-end2end-canary-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"A/B Testing","permalink":"/rollouts/user-manuals/strategy-ab-testing"},"next":{"title":"Extensible Traffic Routing Based on Lua Script","permalink":"/rollouts/developer-manuals/custom-network-provider"}}');var r=n(74848),i=n(28453),o=n(65537),l=n(79329);const s={},c="End to End Canary Release",u={},d=[{value:"End to End Canary Release Process",id:"end-to-end-canary-release-process",level:2},{value:"Common gateway Configuration",id:"common-gateway-configuration",level:2},{value:"Rollout Configuration",id:"rollout-configuration",level:2},{value:"Behavior Explanation",id:"behavior-explanation",level:3}];function p(e){const a={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.header,{children:(0,r.jsx)(a.h1,{id:"end-to-end-canary-release",children:"End to End Canary Release"})}),"\n","\n",(0,r.jsx)(a.h2,{id:"end-to-end-canary-release-process",children:"End to End Canary Release Process"}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.img,{alt:"ab",src:n(29620).A+"",width:"475",height:"512"})}),"\n",(0,r.jsx)(a.p,{children:"End to end canary release is a special kind of canary release. In such canary release, multiple applications in a micro-service system share a common traffic gateway, and the canary replicas of upstream application will pass the traffic to the downstream applications, so that the request will remain in the canary enviroment if available. The end to end canary enviroment is often called traffic swimlane. In such traffic swimlane, requests will go to the replicas of stable version if no canary replicas is available, and go back to canary environment if canary replicas are available again. End to end canary release is often utilized to conduct business evaluation that requires the cooperation of multiple applications."}),"\n",(0,r.jsxs)(a.p,{children:["The usage of end to end canary release can be illustrated using a simple sample system (gateway -> spring-cloud-a -> spring-cloud-b), that is, the requests will be admited by the gateway, and the gateway will pass the traffic first to ",(0,r.jsx)(a.code,{children:"spring-cloud-a"}),", and ",(0,r.jsx)(a.code,{children:"spring-cloud-a"})," will invoke the downstream ",(0,r.jsx)(a.code,{children:"spring-cloud-b"}),"."]}),"\n",(0,r.jsx)(a.h2,{id:"common-gateway-configuration",children:"Common gateway Configuration"}),"\n",(0,r.jsx)(a.p,{children:"Since gateway configuration is shared by multiple applications. The gateway is configured outside of the rollout."}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{className:"language-YAML",children:"\napiVersion: rollouts.kruise.io/v1alpha1\nkind: TrafficRouting\nmetadata:\n  name: mse-traffic\nspec:\n  objectRef:\n  - service: spring-cloud-a\n    ingress:\n      classType: mse\n      name: spring-cloud-a\n  strategy:\n    matches:\n   # optional A/B Testing setting\n    - headers:\n      - type: Exact\n        name: User-Agent\n        value: foo\n   # gray environment will receive 30% traffic \n   #  weight: 20\n    # optional request head modification\n    requestHeaderModifier:\n      set:\n      - name: x-mse-tag\n        value: gray\n"})}),"\n",(0,r.jsx)(a.h2,{id:"rollout-configuration",children:"Rollout Configuration"}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.strong,{children:"Note: v1beta1 available from Kruise Rollout v0.5.0."})}),"\n",(0,r.jsxs)(a.p,{children:["Rollout configuration of multiple applications can share the same traffic routing by referring the traffic routing config name using ",(0,r.jsx)(a.code,{children:"trafficRoutingRef"})," field or the ",(0,r.jsx)(a.code,{children:"rollouts.kruise.io/trafficrouting"})," annotation. In addition, the canary replicas can have different configuration with the normal replicas by changing the metadata of canary replicas using patchPodTemplateMetadata field. The service discovery implementation e.g. micro-service engine or service mesh can utilize the metadata information to guide traffic to different downstream applications accordingly."]}),"\n",(0,r.jsxs)(o.A,{children:[(0,r.jsx)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{className:"language-YAML",children:"# a rollout configuration\napiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollout-a\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: spring-cloud-a\n  strategy:\n    canary:\n      steps:\n      - pause: {}\n        replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n      trafficRoutingRef: mse-traffic      \n---\n# b rollout configuration\napiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollout-b\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n      trafficRoutingRef: mse-traffic\n"})})}),(0,r.jsx)(l.A,{value:"v1alpha1",label:"v1alpha1",children:(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{className:"language-YAML",children:"# a rollout configuration\napiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollout-a\n  annotations:\n    rollouts.kruise.io/trafficrouting: mse-traffic\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: spring-cloud-a\n  strategy:\n    canary:\n      steps:\n      - pause: {}\n        replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n---\n# b rollout configuration\napiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollout-b\n  annotations:\n    rollouts.kruise.io/trafficrouting: mse-traffic\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n"})})})]}),"\n",(0,r.jsx)(a.h3,{id:"behavior-explanation",children:"Behavior Explanation"}),"\n",(0,r.jsxs)(a.p,{children:["When you apply a new revision for ",(0,r.jsx)(a.code,{children:"spring-cloud-a"}),":"]}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsxs)(a.li,{children:["The native rolling update of workload ",(0,r.jsx)(a.code,{children:"spring-cloud-a"})," will be paused to ensure the stable replicas is still available during the canary release."]}),"\n",(0,r.jsxs)(a.li,{children:["A new canary Deployment will be created with 1 replica, and the replica will have additional labels ",(0,r.jsx)(a.code,{children:"alicloud.service.tag: gray"})," and ",(0,r.jsx)(a.code,{children:"opensergo.io/canary-gray: gray"})]}),"\n",(0,r.jsxs)(a.li,{children:["Traffic with header ",(0,r.jsx)(a.code,{children:"User-Agent=foo"})," will be routed to the new canary Deployment pod, in addition an extra header ",(0,r.jsx)(a.code,{children:"x-mse-tag=gray"})," is added to help."]}),"\n",(0,r.jsxs)(a.li,{children:[(0,r.jsx)(a.code,{children:"spring-cloud-a"})," will invoke the canary replicas of downstream application spring-cloud-b if available, and will invoke the stable replicas if no canary spring-cloud-b exists. Note that, this step requires the support of service discovery implementation."]}),"\n"]}),"\n",(0,r.jsx)(a.p,{children:"When you thought the verification of canary is ok, and confirmed to next step:"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsxs)(a.li,{children:["The workload ",(0,r.jsx)(a.code,{children:"spring-cloud-a"})," will be upgraded using native rolling update strategy;"]}),"\n",(0,r.jsx)(a.li,{children:"The traffic will be restored to native load balance strategy."}),"\n",(0,r.jsx)(a.li,{children:"The canary Deployment and Pods will be deleted."}),"\n"]})]})}function h(e={}){const{wrapper:a}={...(0,i.R)(),...e.components};return a?(0,r.jsx)(a,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},65537:(e,a,n)=>{n.d(a,{A:()=>j});var t=n(96540),r=n(34164),i=n(65627),o=n(56347),l=n(50372),s=n(30604),c=n(11861),u=n(78749);function d(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:a}=e;return!!a&&"object"==typeof a&&"value"in a}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:a,children:n}=e;return(0,t.useMemo)((()=>{const e=a??function(e){return d(e).map((e=>{let{props:{value:a,label:n,attributes:t,default:r}}=e;return{value:a,label:n,attributes:t,default:r}}))}(n);return function(e){const a=(0,c.XI)(e,((e,a)=>e.value===a.value));if(a.length>0)throw new Error(`Docusaurus error: Duplicate values "${a.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[a,n])}function h(e){let{value:a,tabValues:n}=e;return n.some((e=>e.value===a))}function f(e){let{queryString:a=!1,groupId:n}=e;const r=(0,o.W6)(),i=function(e){let{queryString:a=!1,groupId:n}=e;if("string"==typeof a)return a;if(!1===a)return null;if(!0===a&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:a,groupId:n});return[(0,s.aZ)(i),(0,t.useCallback)((e=>{if(!i)return;const a=new URLSearchParams(r.location.search);a.set(i,e),r.replace({...r.location,search:a.toString()})}),[i,r])]}function g(e){const{defaultValue:a,queryString:n=!1,groupId:r}=e,i=p(e),[o,s]=(0,t.useState)((()=>function(e){let{defaultValue:a,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(a){if(!h({value:a,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${a}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return a}const t=n.find((e=>e.default))??n[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:a,tabValues:i}))),[c,d]=f({queryString:n,groupId:r}),[g,m]=function(e){let{groupId:a}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(a),[r,i]=(0,u.Dv)(n);return[r,(0,t.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:r}),y=(()=>{const e=c??g;return h({value:e,tabValues:i})?e:null})();(0,l.A)((()=>{y&&s(y)}),[y]);return{selectedValue:o,selectValue:(0,t.useCallback)((e=>{if(!h({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);s(e),d(e),m(e)}),[d,m,i]),tabValues:i}}var m=n(9136);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=n(74848);function v(e){let{className:a,block:n,selectedValue:t,selectValue:o,tabValues:l}=e;const s=[],{blockElementScrollPositionUntilNextRender:c}=(0,i.a_)(),u=e=>{const a=e.currentTarget,n=s.indexOf(a),r=l[n].value;r!==t&&(c(a),o(r))},d=e=>{let a=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=s.indexOf(e.currentTarget)+1;a=s[n]??s[0];break}case"ArrowLeft":{const n=s.indexOf(e.currentTarget)-1;a=s[n]??s[s.length-1];break}}a?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":n},a),children:l.map((e=>{let{value:a,label:n,attributes:i}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:t===a?0:-1,"aria-selected":t===a,ref:e=>{s.push(e)},onKeyDown:d,onClick:u,...i,className:(0,r.A)("tabs__item",y.tabItem,i?.className,{"tabs__item--active":t===a}),children:n??a},a)}))})}function x(e){let{lazy:a,children:n,selectedValue:i}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(a){const e=o.find((e=>e.props.value===i));return e?(0,t.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:o.map(((e,a)=>(0,t.cloneElement)(e,{key:a,hidden:e.props.value!==i})))})}function w(e){const a=g(e);return(0,b.jsxs)("div",{className:(0,r.A)("tabs-container",y.tabList),children:[(0,b.jsx)(v,{...a,...e}),(0,b.jsx)(x,{...a,...e})]})}function j(e){const a=(0,m.A)();return(0,b.jsx)(w,{...e,children:d(e.children)},String(a))}},79329:(e,a,n)=>{n.d(a,{A:()=>o});n(96540);var t=n(34164);const r={tabItem:"tabItem_Ymn6"};var i=n(74848);function o(e){let{children:a,hidden:n,className:o}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,t.A)(r.tabItem,o),hidden:n,children:a})}}}]);
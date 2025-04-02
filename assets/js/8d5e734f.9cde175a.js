"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8357],{15198:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>u,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"user-manuals/strategy-canary-update","title":"Canary Release","description":"Canary Release Process","source":"@site/rollouts/user-manuals/strategy-canary-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-canary-update","permalink":"/rollouts/user-manuals/strategy-canary-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"Basic Usage Guide","permalink":"/rollouts/user-manuals/basic-usage"},"next":{"title":"Multi-Batch Release","permalink":"/rollouts/user-manuals/strategy-multi-batch-update"}}');var t=a(74848),l=a(28453),s=a(65537),o=a(79329);const i={},u="Canary Release",c={},d=[{value:"Canary Release Process",id:"canary-release-process",level:2},{value:"Recommended Configuration",id:"recommended-configuration",level:2},{value:"Behavior Explanation",id:"behavior-explanation",level:3}];function p(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"canary-release",children:"Canary Release"})}),"\n","\n",(0,t.jsx)(n.h2,{id:"canary-release-process",children:"Canary Release Process"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"ab",src:a(93536).A+"",width:"4643",height:"1583"})}),"\n",(0,t.jsx)(n.h2,{id:"recommended-configuration",children:"Recommended Configuration"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Note: v1beta1 available from Kruise Rollout v0.5.0."})}),"\n",(0,t.jsxs)(s.A,{children:[(0,t.jsx)(o.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-YAML",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: workload-demo\n  strategy:\n    canary:\n      enableExtraWorkloadForCanary: true\n      steps:\n      - traffic: 20%\n        replicas: 20%\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n"})})}),(0,t.jsx)(o.A,{value:"v1alpha1",label:"v1alpha1",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-YAML",children:"apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\n  annotations:\n    rollouts.kruise.io/rolling-style: canary\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: workload-demo\n  strategy:\n    canary:\n      steps:\n      - weight: 20\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n"})})})]}),"\n",(0,t.jsx)(n.h3,{id:"behavior-explanation",children:"Behavior Explanation"}),"\n",(0,t.jsxs)(n.p,{children:["When you apply a new revision for ",(0,t.jsx)(n.code,{children:"workload-demo"}),":"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The workload ",(0,t.jsx)(n.code,{children:"workload-demo"})," will be paused, and no Pod is updated;"]}),"\n",(0,t.jsxs)(n.li,{children:['A new canary Deployment will be created, and its replicas is "20%" of ',(0,t.jsx)(n.code,{children:"workload-demo"})," (There will be ",(0,t.jsx)(n.code,{children:"120%"})," Pods totally);"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"20%"})," traffic will be guided to the new canary Deployment Pods."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"When you thought the verification of canary is ok, and confirmed to next step:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The workload ",(0,t.jsx)(n.code,{children:"workload-demo"})," will be upgraded using native rolling update strategy;"]}),"\n",(0,t.jsx)(n.li,{children:"The traffic will be restored to native load balance strategy."}),"\n",(0,t.jsx)(n.li,{children:"The canary Deployment and Pods will be deleted."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>o});var r=a(96540);const t={},l=r.createContext(t);function s(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(l.Provider,{value:n},e.children)}},65537:(e,n,a)=>{a.d(n,{A:()=>w});var r=a(96540),t=a(34164),l=a(65627),s=a(56347),o=a(50372),i=a(30604),u=a(11861),c=a(78749);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:a}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:a,attributes:r,default:t}}=e;return{value:n,label:a,attributes:r,default:t}}))}(a);return function(e){const n=(0,u.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function h(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:a}=e;const t=(0,s.W6)(),l=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,i.aZ)(l),(0,r.useCallback)((e=>{if(!l)return;const n=new URLSearchParams(t.location.search);n.set(l,e),t.replace({...t.location,search:n.toString()})}),[l,t])]}function f(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,l=p(e),[s,i]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=a.find((e=>e.default))??a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:l}))),[u,d]=m({queryString:a,groupId:t}),[f,b]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,l]=(0,c.Dv)(a);return[t,(0,r.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:t}),v=(()=>{const e=u??f;return h({value:e,tabValues:l})?e:null})();(0,o.A)((()=>{v&&i(v)}),[v]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),b(e)}),[d,b,l]),tabValues:l}}var b=a(9136);const v={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=a(74848);function y(e){let{className:n,block:a,selectedValue:r,selectValue:s,tabValues:o}=e;const i=[],{blockElementScrollPositionUntilNextRender:u}=(0,l.a_)(),c=e=>{const n=e.currentTarget,a=i.indexOf(n),t=o[a].value;t!==r&&(u(n),s(t))},d=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;n=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;n=i[a]??i[i.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.A)("tabs",{"tabs--block":a},n),children:o.map((e=>{let{value:n,label:a,attributes:l}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>{i.push(e)},onKeyDown:d,onClick:c,...l,className:(0,t.A)("tabs__item",v.tabItem,l?.className,{"tabs__item--active":r===n}),children:a??n},n)}))})}function x(e){let{lazy:n,children:a,selectedValue:l}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===l));return e?(0,r.cloneElement)(e,{className:(0,t.A)("margin-top--md",e.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==l})))})}function j(e){const n=f(e);return(0,g.jsxs)("div",{className:(0,t.A)("tabs-container",v.tabList),children:[(0,g.jsx)(y,{...n,...e}),(0,g.jsx)(x,{...n,...e})]})}function w(e){const n=(0,b.A)();return(0,g.jsx)(j,{...e,children:d(e.children)},String(n))}},79329:(e,n,a)=>{a.d(n,{A:()=>s});a(96540);var r=a(34164);const t={tabItem:"tabItem_Ymn6"};var l=a(74848);function s(e){let{children:n,hidden:a,className:s}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,r.A)(t.tabItem,s),hidden:a,children:n})}},93536:(e,n,a)=>{a.d(n,{A:()=>r});const r=a.p+"assets/images/canary-cd02349ab581eac50c75ad0a3a1edc35.jpg"}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5160],{2533:(e,n,a)=>{a.d(n,{A:()=>r});const r=a.p+"assets/images/e2e-a3b7ceca7d351bf273d13c68e308d374.png"},28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>o});var r=a(96540);const t={},l=r.createContext(t);function s(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(l.Provider,{value:n},e.children)}},65537:(e,n,a)=>{a.d(n,{A:()=>k});var r=a(96540),t=a(34164),l=a(65627),s=a(56347),o=a(50372),i=a(30604),u=a(11861),c=a(78749);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:a}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:a,attributes:r,default:t}}=e;return{value:n,label:a,attributes:r,default:t}}))}(a);return function(e){const n=(0,u.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function h(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function g(e){let{queryString:n=!1,groupId:a}=e;const t=(0,s.W6)(),l=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,i.aZ)(l),(0,r.useCallback)((e=>{if(!l)return;const n=new URLSearchParams(t.location.search);n.set(l,e),t.replace({...t.location,search:n.toString()})}),[l,t])]}function f(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,l=p(e),[s,i]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=a.find((e=>e.default))??a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:l}))),[u,d]=g({queryString:a,groupId:t}),[f,m]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,l]=(0,c.Dv)(a);return[t,(0,r.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:t}),b=(()=>{const e=u??f;return h({value:e,tabValues:l})?e:null})();(0,o.A)((()=>{b&&i(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),m(e)}),[d,m,l]),tabValues:l}}var m=a(9136);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=a(74848);function x(e){let{className:n,block:a,selectedValue:r,selectValue:s,tabValues:o}=e;const i=[],{blockElementScrollPositionUntilNextRender:u}=(0,l.a_)(),c=e=>{const n=e.currentTarget,a=i.indexOf(n),t=o[a].value;t!==r&&(u(n),s(t))},d=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;n=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;n=i[a]??i[i.length-1];break}}n?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.A)("tabs",{"tabs--block":a},n),children:o.map((e=>{let{value:n,label:a,attributes:l}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>{i.push(e)},onKeyDown:d,onClick:c,...l,className:(0,t.A)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":r===n}),children:a??n},n)}))})}function y(e){let{lazy:n,children:a,selectedValue:l}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===l));return e?(0,r.cloneElement)(e,{className:(0,t.A)("margin-top--md",e.props.className)}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==l})))})}function j(e){const n=f(e);return(0,v.jsxs)("div",{className:(0,t.A)("tabs-container",b.tabList),children:[(0,v.jsx)(x,{...n,...e}),(0,v.jsx)(y,{...n,...e})]})}function k(e){const n=(0,m.A)();return(0,v.jsx)(j,{...e,children:d(e.children)},String(n))}},79329:(e,n,a)=>{a.d(n,{A:()=>s});a(96540);var r=a(34164);const t={tabItem:"tabItem_Ymn6"};var l=a(74848);function s(e){let{children:n,hidden:a,className:s}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,r.A)(t.tabItem,s),hidden:a,children:n})}},81808:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>u,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"user-manuals/strategy-end2end-canary-update","title":"\u5168\u94fe\u8def\u7070\u5ea6","description":"\u5168\u94fe\u8def\u7070\u5ea6\u6d41\u7a0b","source":"@site/i18n/zh/docusaurus-plugin-content-docs-rollouts/current/user-manuals/strategy-end2end-canary-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-end2end-canary-update","permalink":"/zh/rollouts/user-manuals/strategy-end2end-canary-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"A/B \u6d4b\u8bd5","permalink":"/zh/rollouts/user-manuals/strategy-ab-testing"},"next":{"title":"\u4f7f\u7528Lua\u811a\u672c\u81ea\u5b9a\u4e49\u6d41\u91cf\u8def\u7531","permalink":"/zh/rollouts/developer-manuals/custom-network-provider"}}');var t=a(74848),l=a(28453),s=a(65537),o=a(79329);const i={},u="\u5168\u94fe\u8def\u7070\u5ea6",c={},d=[{value:"\u5168\u94fe\u8def\u7070\u5ea6\u6d41\u7a0b",id:"\u5168\u94fe\u8def\u7070\u5ea6\u6d41\u7a0b",level:2},{value:"\u516c\u7528\u7f51\u5173\u7684\u914d\u7f6e",id:"\u516c\u7528\u7f51\u5173\u7684\u914d\u7f6e",level:2},{value:"\u53d1\u5e03\u914d\u7f6e",id:"\u53d1\u5e03\u914d\u7f6e",level:2},{value:"\u6548\u679c\u89e3\u91ca",id:"\u6548\u679c\u89e3\u91ca",level:3},{value:"\u5df2\u77e5\u76ee\u524d\u652f\u6301\u5168\u94fe\u8def\u7070\u5ea6\u7684\u7f51\u5173\u5b9e\u73b0\u5982\u4e0b:",id:"\u5df2\u77e5\u76ee\u524d\u652f\u6301\u5168\u94fe\u8def\u7070\u5ea6\u7684\u7f51\u5173\u5b9e\u73b0\u5982\u4e0b",level:3}];function p(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"\u5168\u94fe\u8def\u7070\u5ea6",children:"\u5168\u94fe\u8def\u7070\u5ea6"})}),"\n","\n",(0,t.jsx)(n.h2,{id:"\u5168\u94fe\u8def\u7070\u5ea6\u6d41\u7a0b",children:"\u5168\u94fe\u8def\u7070\u5ea6\u6d41\u7a0b"}),"\n",(0,t.jsx)("center",{children:(0,t.jsx)("img",{src:a(2533).A,width:"90%"})}),"\n",(0,t.jsx)(n.p,{children:"\u5168\u94fe\u8def\u7070\u5ea6\u53d1\u5e03\u662f\u4e00\u79cd\u7279\u6b8a\u7684\u91d1\u4e1d\u96c0\u53d1\u5e03\u6d41\u7a0b\u3002 \u5728\u8fd9\u79cd\u91d1\u4e1d\u96c0\u53d1\u5e03\u4e2d\uff0c \u4e00\u4e2a\u5fae\u670d\u52a1\u7cfb\u7edf\u4e2d\u7684\u591a\u4e2a\u5e94\u7528\u53ef\u4ee5\u5171\u7528\u4e00\u4e2a\u6d41\u91cf\u7f51\u5173\uff0c\u4e0a\u6e38\u5e94\u7528\u7684\u7070\u5ea6\u526f\u672c\u4f1a\u628a\u6d41\u91cf\u4f20\u9012\u5230\u4e0b\u6e38\u5e94\u7528\u7684\u7070\u5ea6\u526f\u672c\u4e2d\uff0c \u4ece\u800c\u4fdd\u8bc1\u4e00\u4e2a\u8bf7\u6c42\u7684\u5904\u7406\u5c3d\u53ef\u80fd\u7684\u4fdd\u6301\u5728\u4e00\u4e2a\u7aef\u5230\u7aef\u7070\u5ea6\u73af\u5883\u4e2d\u3002 \u8fd9\u79cd\u7070\u5ea6\u73af\u5883\u5f80\u5f80\u88ab\u53eb\u505a\u6d41\u91cf\u6cf3\u9053\uff0c \u5728\u8fd9\u6837\u7684\u6cf3\u9053\u4e2d\uff0c\u5982\u679c\u67d0\u4e2a\u5e94\u7528\u4e0d\u5b58\u5728\u7070\u5ea6\u5b9e\u4f8b\uff0c \u8bf7\u6c42\u4f1a\u5f15\u6d41\u5230\u7a33\u5b9a\u7248\u672c\u7684\u5e94\u7528\u5b9e\u4f8b\u4e2d\u3002 \u4f46\u5f53\u4e0b\u6e38\u5e94\u7528\u53c8\u5b58\u5728\u7070\u5ea6\u5b9e\u4f8b\u7684\u65f6\u5019\uff0c\u53d1\u5f80\u4e0b\u6e38\u7684\u8bf7\u6c42\u53c8\u4f1a\u88ab\u5bfc\u6d41\u5230\u7070\u5ea6\u5b9e\u4f8b\u4e0a\u3002 \u5168\u94fe\u8def\u7070\u5ea6\u5f80\u5f80\u88ab\u7528\u6765\u5728\u9700\u8981\u591a\u4e2a\u5e94\u7528\u534f\u540c\u7684\u573a\u666f\u4e0b\u8fdb\u884c\u4e1a\u52a1\u9a8c\u8bc1\u548c\u7070\u5ea6\u3002"}),"\n",(0,t.jsxs)(n.p,{children:["\u8fd9\u91cc\u901a\u8fc7\u4e00\u4e2a\u7b80\u5355\u7684\u6837\u4f8b\u7cfb\u7edf\u6765\u6f14\u793a\u5168\u94fe\u8def\u7070\u5ea6\uff0c \u8fd9\u4e2a\u7cfb\u7edf\u7684\u7ec4\u6210\u4e3a (gateway -> spring-cloud-a -> spring-cloud-b)\uff0c \u4e5f\u5c31\u662f\u8bf7\u6c42\u7531\u7f51\u5173\u63a5\u5165\uff0c\u7f51\u5173\u4f1a\u628a\u63a5\u5165\u7684\u6d41\u91cf\u53d1\u5f80",(0,t.jsx)(n.code,{children:"spring-cloud-a"}),"\uff0c ",(0,t.jsx)(n.code,{children:"spring-cloud-a"}),"\u63a5\u4e0b\u6765\u4f1a\u8c03\u7528\u4e0b\u6e38\u7cfb\u7edf",(0,t.jsx)(n.code,{children:"spring-cloud-b"}),"\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"\u516c\u7528\u7f51\u5173\u7684\u914d\u7f6e",children:"\u516c\u7528\u7f51\u5173\u7684\u914d\u7f6e"}),"\n",(0,t.jsx)(n.p,{children:"\u56e0\u4e3a\u7f51\u5173\u914d\u7f6e\u9700\u8981\u88ab\u591a\u4e2a\u5e94\u7528\u5171\u4eab\uff0c \u6240\u4ee5\u5177\u4f53\u7684\u7f51\u5173\u914d\u7f6e\u9700\u8981\u5728Rollout\u5916\u8bbe\u7f6e\u3002"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-YAML",children:"\napiVersion: rollouts.kruise.io/v1alpha1\nkind: TrafficRouting\nmetadata:\n  name: mse-traffic\nspec:\n  objectRef:\n  - service: spring-cloud-a\n    ingress:\n      classType: mse\n      name: spring-cloud-a\n  strategy:\n    matches:\n    # optional A/B Testing setting\n    - headers:\n      - type: Exact\n        name: User-Agent\n        value: foo\n    # alternative gray environment will receive 30% traffic \n    # weight: 20\n    # optional request head modification\n    requestHeaderModifier:\n      set:\n      - name: x-mse-tag\n        value: gray\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u53d1\u5e03\u914d\u7f6e",children:"\u53d1\u5e03\u914d\u7f6e"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Note: v1beta1 available from Kruise Rollout v0.5.0."})}),"\n",(0,t.jsxs)(n.p,{children:["\u591a\u4e2a\u5e94\u7528\u7684\u53d1\u5e03\u914d\u7f6e\u901a\u8fc7\u5f15\u7528\u516c\u5171\u7684\u7f51\u5173\u914d\u7f6e\uff0c\u5177\u4f53\u7684\uff0c\u53ef\u4ee5\u901a\u8fc7Rollout\u8d44\u6e90\u7684 ",(0,t.jsx)(n.code,{children:"trafficRoutingRef"})," \u5b57\u6bb5\u6216\u8005",(0,t.jsx)(n.code,{children:"rollouts.kruise.io/trafficrouting"}),"\u6807\u6ce8\u5b8c\u6210\u3002\u6b64\u5916\uff0c\u901a\u8fc7Rollout\u7684",(0,t.jsx)(n.code,{children:"patchPodTemplateMetadata"}),"\u5b57\u6bb5\uff0c\u7070\u5ea6\u7684\u5b9e\u4f8b\u76f8\u6bd4\u7a33\u5b9a\u7248\u672c\u7684\u5b9e\u4f8b\uff0c\u53ef\u4ee5\u6709\u4e0d\u540c\u7684\u5b9e\u4f8b\u5143\u6570\u636e\u3002 \u670d\u52a1\u53d1\u73b0\u7684\u5b9e\u73b0\uff0c\u4f8b\u5982\u5fae\u670d\u52a1\u5f15\u64ce\u6216\u8005\u670d\u52a1\u7f51\u683c\uff0c \u53ef\u4ee5\u5229\u7528\u5b9e\u4f8b\u5143\u6570\u636e\u7684\u5dee\u5f02\uff0c\u5f15\u5bfc\u6d41\u91cf\u5230\u4e0d\u540c\u7684\u4e0b\u6e38\u670d\u52a1\u5b9e\u4f8b\u4e2d\u3002"]}),"\n",(0,t.jsxs)(s.A,{children:[(0,t.jsx)(o.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-YAML",children:"# a rollout configuration\napiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollout-a\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: spring-cloud-a\n  strategy:\n    canary:\n      steps:\n      - pause: {}\n        replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n      trafficRoutingRef: mse-traffic      \n---\n# b rollout configuration\napiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollout-b\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n      trafficRoutingRef: mse-traffic\n"})})}),(0,t.jsx)(o.A,{value:"v1alpha1",label:"v1alpha1",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-YAML",children:"# a rollout configuration\napiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollout-a\n  annotations:\n    rollouts.kruise.io/trafficrouting: mse-traffic\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: spring-cloud-a\n  strategy:\n    canary:\n      steps:\n      - pause: {}\n        replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n---\n# b rollout configuration\napiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollout-b\n  annotations:\n    rollouts.kruise.io/trafficrouting: mse-traffic\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          alicloud.service.tag: gray\n          opensergo.io/canary-gray: gray\n"})})})]}),"\n",(0,t.jsx)(n.h3,{id:"\u6548\u679c\u89e3\u91ca",children:"\u6548\u679c\u89e3\u91ca"}),"\n",(0,t.jsxs)(n.p,{children:["\u5f53\u4e0b\u53d1",(0,t.jsx)(n.code,{children:"spring-cloud-a"}),"\u7684\u65b0\u7248\u672c\u65f6\uff1a"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\u5de5\u4f5c\u8d1f\u8f7d",(0,t.jsx)(n.code,{children:"spring-cloud-a"}),"\u7684\u539f\u751f\u6eda\u52a8\u53d1\u5e03\u884c\u4e3a\u4f1a\u88ab\u6682\u505c\uff0c\u4ece\u800c\u786e\u4fdd\u7a33\u5b9a\u7248\u672c\u7684\u5b9e\u4f8b\u5728\u7070\u5ea6\u8fc7\u7a0b\u4e2d\u4f9d\u7136\u53ef\u7528"]}),"\n",(0,t.jsxs)(n.li,{children:["\u5177\u67091\u4e2a\u5b9e\u4f8b\u7684\u65b0\u7684\u7070\u5ea6Deployment\u4f1a\u88ab\u521b\u5efa\uff0c\u5e76\u4e14\u8fd9\u4e2a\u5b9e\u4f8b\u4f1a\u5177\u6709",(0,t.jsx)(n.code,{children:"alicloud.service.tag: gray"})," \u548c",(0,t.jsx)(n.code,{children:"opensergo.io/canary-gray: gray"}),"\u7684\u6807\u7b7e\u3002"]}),"\n",(0,t.jsxs)(n.li,{children:["\u6d41\u91cf\u8bf7\u6c42\u5934",(0,t.jsx)(n.code,{children:"User-Agent"}),"\u5339\u914d\u4e3afoo\u7684\u5165\u53e3\u6d41\u91cf\u4f1a\u88ab\u5f15\u6d41\u5230\u8fd9\u4e2a\u7070\u5ea6\u5b9e\u4f8b\u4e0a\uff0c\u540c\u65f6\u6d41\u91cf\u4f1a\u65b0\u589e\u4e00\u4e2a\u8bf7\u6c42\u5934",(0,t.jsx)(n.code,{children:"x-mse-tag=gray"}),", \u4fbf\u4e8e\u5fae\u670d\u52a1\u5f15\u64ce\u8bc6\u522b\u7070\u5ea6\u6d41\u91cf\u3002"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"spring-cloud-a"})," \u7684\u7070\u5ea6\u5b9e\u4f8b\u5728\u8c03\u7528\u4e0b\u6e38\u670d\u52a1\u65f6 \uff0c\u4f1a\u5c3d\u91cf\u9009\u53d6",(0,t.jsx)(n.code,{children:"spring-cloud-b"}),"\u76f8\u5e94\u7684\u7070\u5ea6\u5b9e\u4f8b\uff0c\u5f53",(0,t.jsx)(n.code,{children:"spring-cloud-b"}),"\u4e0d\u5b58\u5728\u7070\u5ea6\u5b9e\u4f8b\u65f6\uff0c\u4f1a\u9009\u53d6\u7a33\u5b9a\u7248\u672c\u7684\u5b9e\u4f8b\u3002\u8bf7\u6ce8\u610f\uff0c\u8fd9\u4e2a\u6b65\u9aa4\u9700\u8981\u5bf9\u5e94\u7684\u670d\u52a1\u53d1\u73b0\u5b9e\u73b0\u7684\u652f\u6301"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u5f53\u60a8\u8ba4\u4e3a\u91d1\u4e1d\u96c0\u9a8c\u8bc1\u5df2\u7ecf\u901a\u8fc7\u5e76\u786e\u8ba4\u8fdb\u884c\u4e0b\u4e00\u6b65\u65f6\uff1a"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"spring-cloud-a"}),"\u5de5\u4f5c\u8d1f\u8f7d\u5c06\u4f7f\u7528\u672c\u673a\u6eda\u52a8\u66f4\u65b0\u7b56\u7565\u8fdb\u884c\u5347\u7ea7\uff1b"]}),"\n",(0,t.jsx)(n.li,{children:"\u6d41\u91cf\u5c06\u6062\u590d\u5230\u539f\u59cb\u7684\u8d1f\u8f7d\u5747\u8861\u7b56\u7565\uff1b"}),"\n",(0,t.jsx)(n.li,{children:"\u91d1\u4e1d\u96c0Deployment\u548cPods\u5c06\u88ab\u5220\u9664\u3002"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"\u5df2\u77e5\u76ee\u524d\u652f\u6301\u5168\u94fe\u8def\u7070\u5ea6\u7684\u7f51\u5173\u5b9e\u73b0\u5982\u4e0b",children:"\u5df2\u77e5\u76ee\u524d\u652f\u6301\u5168\u94fe\u8def\u7070\u5ea6\u7684\u7f51\u5173\u5b9e\u73b0\u5982\u4e0b:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://help.aliyun.com/zh/mse/user-guide/implement-mse-based-end-to-end-canary-release-by-using-kruise-rollouts",children:"MSE"}),"(\u963f\u91cc\u4e91\u5fae\u670d\u52a1\u5f15\u64ce)"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9482],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),s=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(n),m=r,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||l;return n?a.createElement(f,o(o({ref:t},c),{},{components:n})):a.createElement(f,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=d;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1104:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return c},default:function(){return b},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=n(5488),i=n(5162),u=["components"],s={},c="A/B Testing",p={unversionedId:"user-manuals/strategy-ab-testing",id:"user-manuals/strategy-ab-testing",title:"A/B Testing",description:"A/B Testing Process",source:"@site/rollouts/user-manuals/strategy-ab-testing.md",sourceDirName:"user-manuals",slug:"/user-manuals/strategy-ab-testing",permalink:"/rollouts/user-manuals/strategy-ab-testing",draft:!1,tags:[],version:"current",lastUpdatedBy:"Zhen Zhang",lastUpdatedAt:1705494569,formattedLastUpdatedAt:"1/17/2024",frontMatter:{},sidebar:"rollouts",previous:{title:"Multi-Batch Release",permalink:"/rollouts/user-manuals/strategy-multi-batch-update"},next:{title:"Extensible Traffic Routing Based on Lua Script",permalink:"/rollouts/developer-manuals/custom-network-provider"}},d={},m=[{value:"A/B Testing Process",id:"ab-testing-process",level:2},{value:"Configuration Example",id:"configuration-example",level:2},{value:"Behavior Explanation",id:"behavior-explanation",level:3}],f={toc:m};function b(e){var t=e.components,s=(0,r.Z)(e,u);return(0,l.kt)("wrapper",(0,a.Z)({},f,s,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"ab-testing"},"A/B Testing"),(0,l.kt)("h2",{id:"ab-testing-process"},"A/B Testing Process"),(0,l.kt)("p",null,"A process of A/B Tesing combing with ",(0,l.kt)("strong",{parentName:"p"},"canary release"),":\n",(0,l.kt)("img",{alt:"ab",src:n(9250).Z,width:"4669",height:"2118"})),(0,l.kt)("h2",{id:"configuration-example"},"Configuration Example"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Note: v1beta1 available from Kruise Rollout v0.5.0.")),(0,l.kt)("p",null,"In fact, A/B Testing need to combine with canary or multi-batch release strategy, as shown in picture above."),(0,l.kt)("p",null,"Next we will give an example about ",(0,l.kt)("strong",{parentName:"p"},"A/B Testing with multi-batch release strategy"),":"),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"v1beta1",label:"v1beta1",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-YAML"},"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: workload-demo\n  strategy:\n    canary:\n      steps:\n      - replicas: 1\n        matches:\n        - headers:\n          - name: user-agent\n            type: Exact\n            value: pc\n      - replicas: 50%\n      - replicas: 100%\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n"))),(0,l.kt)(i.Z,{value:"v1alpha1",label:"v1alpha1",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-YAML"},"apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\n  annotations:\n    rollouts.kruise.io/rolling-style: partition\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: workload-demo\n  strategy:\n    canary:\n      steps:\n      - replicas: 1\n        matches:\n        - headers:\n          - name: user-agent\n            type: Exact\n            value: pc\n      - replicas: 50%\n      - replicas: 100%\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n")))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Note: Currently, A/B Testing strategy can work on CloneSet, StatefulSet, Advanced StatefulSet, and Deployment.")),(0,l.kt)("h3",{id:"behavior-explanation"},"Behavior Explanation"),(0,l.kt)("p",null,"When you apply a new revision for ",(0,l.kt)("inlineCode",{parentName:"p"},"workload-demo"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"1")," Pods will be updated in the 1-st batch, the traffic with HTTP header ",(0,l.kt)("inlineCode",{parentName:"li"},"user-agent=pc")," will be guided into new-version Pod, other traffic will be guided into stable-version Pods. Need manual confirmation to next batch."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"50%")," Pods will be updated in the 2-nd batch, the Header matches rule is cancelled, all traffic will obey original load balance rule. Need manual confirmation to next batch."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"100%")," Pods will be updated in the 3-rd batch, the Header matches rule is cancelled, all traffic will obey original load balance rule.")))}b.isMDXComponent=!0},5162:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294),r=n(6010),l="tabItem_Ymn6";function o(e){var t=e.children,n=e.hidden,o=e.className;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:n},t)}},5488:function(e,t,n){n.d(t,{Z:function(){return m}});var a=n(7462),r=n(7294),l=n(6010),o=n(2389),i=n(7392),u=n(7094),s=n(2466),c="tabList__CuJ",p="tabItem_LNqP";function d(e){var t,n,o=e.lazy,d=e.block,m=e.defaultValue,f=e.values,b=e.groupId,v=e.className,g=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=f?f:g.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,i.l)(h,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===m?m:null!=(t=null!=m?m:null==(n=g.find((function(e){return e.props.default})))?void 0:n.props.value)?t:g[0].props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var w=(0,u.U)(),T=w.tabGroupChoices,N=w.setTabGroupChoices,x=(0,r.useState)(k),E=x[0],O=x[1],P=[],C=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=b){var j=T[b];null!=j&&j!==E&&h.some((function(e){return e.value===j}))&&O(j)}var A=function(e){var t=e.currentTarget,n=P.indexOf(t),a=h[n].value;a!==E&&(C(t),O(a),null!=b&&N(b,String(a)))},Z=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a,r=P.indexOf(e.currentTarget)+1;n=null!=(a=P[r])?a:P[0];break;case"ArrowLeft":var l,o=P.indexOf(e.currentTarget)-1;n=null!=(l=P[o])?l:P[P.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":d},v)},h.map((function(e){var t=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return P.push(e)},onKeyDown:Z,onFocus:A,onClick:A},o,{className:(0,l.Z)("tabs__item",p,null==o?void 0:o.className,{"tabs__item--active":E===t})}),null!=n?n:t)}))),o?(0,r.cloneElement)(g.filter((function(e){return e.props.value===E}))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},g.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function m(e){var t=(0,o.Z)();return r.createElement(d,(0,a.Z)({key:String(t)},e))}},9250:function(e,t,n){t.Z=n.p+"assets/images/ab-testing-e537fc007e1e4a9500eeb07d38faa639.jpg"}}]);
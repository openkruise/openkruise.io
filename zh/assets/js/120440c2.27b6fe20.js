"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5375],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return c}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),u=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=u(e.components);return a.createElement(p.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=u(n),c=r,d=m["".concat(p,".").concat(c)]||m[c]||k[c]||l;return n?a.createElement(d,i(i({ref:t},s),{},{components:n})):a.createElement(d,i({ref:t},s))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=m;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var u=2;u<l;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7070:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return k}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),i=["components"],o={slug:"openkruise-1.0",title:"OpenKruise v1.0\uff1a\u4e91\u539f\u751f\u5e94\u7528\u81ea\u52a8\u5316\u8fbe\u5230\u65b0\u7684\u9ad8\u5cf0",authors:["FillZpp"],tags:["release"]},p=void 0,u={permalink:"/zh/blog/openkruise-1.0",editUrl:"https://github.com/openkruise/openkruise.io/edit/master/blog/2021-12-13-release-1.0.md",source:"@site/i18n/zh/docusaurus-plugin-content-blog/2021-12-13-release-1.0.md",title:"OpenKruise v1.0\uff1a\u4e91\u539f\u751f\u5e94\u7528\u81ea\u52a8\u5316\u8fbe\u5230\u65b0\u7684\u9ad8\u5cf0",description:"\u4e91\u539f\u751f\u5e94\u7528\u81ea\u52a8\u5316\u7ba1\u7406\u5957\u4ef6\u3001CNCF Sandbox \u9879\u76ee -- OpenKruise\uff0c\u8fd1\u671f\u53d1\u5e03\u4e86 v1.0 \u5927\u7248\u672c\u3002",date:"2021-12-13T00:00:00.000Z",formattedDate:"2021\u5e7412\u670813\u65e5",tags:[{label:"release",permalink:"/zh/blog/tags/release"}],readingTime:11.49,truncated:!1,authors:[{name:"Siyu Wang",title:"Maintainer of OpenKruise",url:"https://github.com/FillZpp",imageURL:"https://github.com/FillZpp.png",key:"FillZpp"}],frontMatter:{slug:"openkruise-1.0",title:"OpenKruise v1.0\uff1a\u4e91\u539f\u751f\u5e94\u7528\u81ea\u52a8\u5316\u8fbe\u5230\u65b0\u7684\u9ad8\u5cf0",authors:["FillZpp"],tags:["release"]},prevItem:{title:"OpenKruise v1.1\uff1a\u529f\u80fd\u589e\u5f3a\u4e0e\u4e0a\u6e38\u5bf9\u9f50\uff0c\u5927\u89c4\u6a21\u573a\u666f\u6027\u80fd\u4f18\u5316",permalink:"/zh/blog/openkruise-1.1"},nextItem:{title:"OpenKruise v0.10.0 \u65b0\u7279\u6027WorkloadSpread\u89e3\u8bfb",permalink:"/zh/blog/workloadspread"}},s={authorsImageUrls:[void 0]},k=[{value:"\u7248\u672c\u89e3\u6790",id:"\u7248\u672c\u89e3\u6790",level:2},{value:"1. \u652f\u6301\u73af\u5883\u53d8\u91cf\u539f\u5730\u5347\u7ea7",id:"1-\u652f\u6301\u73af\u5883\u53d8\u91cf\u539f\u5730\u5347\u7ea7",level:3},{value:"2. \u914d\u7f6e\u8de8\u547d\u540d\u7a7a\u95f4\u5206\u53d1",id:"2-\u914d\u7f6e\u8de8\u547d\u540d\u7a7a\u95f4\u5206\u53d1",level:3},{value:"3. \u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236",id:"3-\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236",level:3},{value:"4. <code>kubectl-kruise</code> \u547d\u4ee4\u884c\u5de5\u5177",id:"4-kubectl-kruise-\u547d\u4ee4\u884c\u5de5\u5177",level:3},{value:"5. \u5176\u4f59\u90e8\u5206\u529f\u80fd\u6539\u8fdb\u4e0e\u4f18\u5316",id:"5-\u5176\u4f59\u90e8\u5206\u529f\u80fd\u6539\u8fdb\u4e0e\u4f18\u5316",level:3},{value:"\u793e\u533a\u53c2\u4e0e",id:"\u793e\u533a\u53c2\u4e0e",level:2}],m={toc:k};function c(e){var t=e.components,o=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,a.Z)({},m,o,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u4e91\u539f\u751f\u5e94\u7528\u81ea\u52a8\u5316\u7ba1\u7406\u5957\u4ef6\u3001CNCF Sandbox \u9879\u76ee -- OpenKruise\uff0c\u8fd1\u671f\u53d1\u5e03\u4e86 v1.0 \u5927\u7248\u672c\u3002"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://openkruise.io"},"OpenKruise")," \u662f\u9488\u5bf9 Kubernetes \u7684\u589e\u5f3a\u80fd\u529b\u5957\u4ef6\uff0c\u805a\u7126\u4e8e\u4e91\u539f\u751f\u5e94\u7528\u7684\u90e8\u7f72\u3001\u5347\u7ea7\u3001\u8fd0\u7ef4\u3001\u7a33\u5b9a\u6027\u9632\u62a4\u7b49\u9886\u57df\u3002\u6240\u6709\u7684\u529f\u80fd\u90fd\u901a\u8fc7 CRD \u7b49\u6807\u51c6\u65b9\u5f0f\u6269\u5c55\uff0c\u53ef\u4ee5\u9002\u7528\u4e8e 1.16 \u4ee5\u4e0a\u7248\u672c\u7684\u4efb\u610f Kubernetes \u96c6\u7fa4\u3002\u5355\u6761 helm \u547d\u4ee4\u5373\u53ef\u5b8c\u6210 Kruise \u7684\u4e00\u952e\u90e8\u7f72\uff0c\u65e0\u9700\u66f4\u591a\u914d\u7f6e\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"openkruise-features|center|450x400",src:n(9193).Z,width:"6534",height:"5550"})),(0,l.kt)("p",null,"\u603b\u5f97\u6765\u770b\uff0c\u76ee\u524d OpenKruise \u63d0\u4f9b\u7684\u80fd\u529b\u5206\u4e3a\u51e0\u4e2a\u9886\u57df\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5e94\u7528\u5de5\u4f5c\u8d1f\u8f7d"),"\uff1a\u9762\u5411\u65e0\u72b6\u6001\u3001\u6709\u72b6\u6001\u3001daemon \u7b49\u591a\u79cd\u7c7b\u578b\u5e94\u7528\u7684\u9ad8\u7ea7\u90e8\u7f72\u53d1\u5e03\u7b56\u7565\uff0c\u4f8b\u5982\u539f\u5730\u5347\u7ea7\u3001\u7070\u5ea6\u6d41\u5f0f\u53d1\u5e03\u7b49\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Sidecar \u5bb9\u5668\u7ba1\u7406"),"\uff1a\u652f\u6301\u72ec\u7acb\u5b9a\u4e49 sidecar \u5bb9\u5668\uff0c\u5b8c\u6210\u52a8\u6001\u6ce8\u5165\u3001\u72ec\u7acb\u539f\u5730\u5347\u7ea7\u3001\u70ed\u5347\u7ea7\u7b49\u529f\u80fd\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u589e\u5f3a\u8fd0\u7ef4\u80fd\u529b"),"\uff1a\u5305\u62ec\u5bb9\u5668\u539f\u5730\u91cd\u542f\u3001\u955c\u50cf\u9884\u62c9\u53d6\u3001\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u4fdd\u969c\u7b49\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5e94\u7528\u5206\u533a\u7ba1\u7406"),"\uff1a\u7ba1\u7406\u5e94\u7528\u5728\u591a\u4e2a\u5206\u533a\uff08\u53ef\u7528\u533a\u3001\u4e0d\u540c\u673a\u578b\u7b49\uff09\u4e0a\u7684\u90e8\u7f72\u6bd4\u4f8b\u3001\u987a\u5e8f\u3001\u4f18\u5148\u7ea7\u7b49\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5e94\u7528\u5b89\u5168\u9632\u62a4"),"\uff1a\u5e2e\u52a9\u5e94\u7528\u5728 Kubernetes \u4e4b\u4e0a\u83b7\u5f97\u66f4\u9ad8\u7684\u5b89\u5168\u6027\u4fdd\u969c\u4e0e\u53ef\u7528\u6027\u9632\u62a4\u3002")),(0,l.kt)("h2",{id:"\u7248\u672c\u89e3\u6790"},"\u7248\u672c\u89e3\u6790"),(0,l.kt)("p",null,"\u5728 v1.0 \u5927\u7248\u672c\u4e2d\uff0cOpenKruise \u5e26\u6765\u4e86\u591a\u79cd\u65b0\u7684\u7279\u6027\uff0c\u540c\u65f6\u4e5f\u5bf9\u4e0d\u5c11\u5df2\u6709\u529f\u80fd\u505a\u4e86\u589e\u5f3a\u4e0e\u4f18\u5316\u3002"),(0,l.kt)("p",null,"\u9996\u5148\u8981\u8bf4\u7684\u662f\uff0c\u4ece v1.0 \u5f00\u59cb OpenKruise \u5c06 CRD/WehhookConfiguration \u7b49\u8d44\u6e90\u914d\u7f6e\u7684\u7248\u672c\u4ece ",(0,l.kt)("inlineCode",{parentName:"p"},"v1beta1")," \u5347\u7ea7\u5230 ",(0,l.kt)("inlineCode",{parentName:"p"},"v1"),"\uff0c\u56e0\u6b64\u53ef\u4ee5",(0,l.kt)("strong",{parentName:"p"},"\u652f\u6301 Kubernetes v1.22 \u53ca\u4ee5\u4e0a\u7248\u672c\u7684\u96c6\u7fa4\uff0c\u4f46\u540c\u65f6\u4e5f\u8981\u6c42 Kubernetes \u7684\u7248\u672c\u4e0d\u80fd\u4f4e\u4e8e v1.16"),"\u3002"),(0,l.kt)("p",null,"\u4ee5\u4e0b\u5bf9 v1.0 \u7684\u90e8\u5206\u529f\u80fd\u505a\u7b80\u8981\u4ecb\u7ecd\uff0c\u8be6\u7ec6\u7684 ChangeLog \u5217\u8868\u8bf7\u67e5\u770b OpenKruise Github \u4e0a\u7684 release \u8bf4\u660e\u4ee5\u53ca\u5b98\u7f51\u6587\u6863\u3002"),(0,l.kt)("h3",{id:"1-\u652f\u6301\u73af\u5883\u53d8\u91cf\u539f\u5730\u5347\u7ea7"},"1. \u652f\u6301\u73af\u5883\u53d8\u91cf\u539f\u5730\u5347\u7ea7"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Author: ",(0,l.kt)("a",{parentName:"em",href:"https://github.com/FillZpp"},"@FillZpp"))),(0,l.kt)("p",null,"OpenKruise \u4ece\u65e9\u671f\u7248\u672c\u5f00\u59cb\u5c31\u652f\u6301\u4e86 \u201c\u539f\u5730\u5347\u7ea7\u201d \u529f\u80fd\uff0c\u4e3b\u8981\u5e94\u7528\u4e8e CloneSet \u4e0e Advanced StatefulSet \u4e24\u79cd\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u3002\u7b80\u5355\u6765\u8bf4\uff0c\u539f\u5730\u5347\u7ea7\u4f7f\u5f97\u5e94\u7528\u5728\u5347\u7ea7\u7684\u8fc7\u7a0b\u4e2d\uff0c\u4e0d\u9700\u8981\u5220\u9664\u3001\u65b0\u5efa Pod \u5bf9\u8c61\uff0c\u800c\u662f\u901a\u8fc7\u5bf9 Pod \u4e2d\u5bb9\u5668\u914d\u7f6e\u7684\u4fee\u6539\u6765\u8fbe\u5230\u5347\u7ea7\u7684\u76ee\u7684\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"inplace-update-comparation|center|450x400",src:n(3662).Z,width:"2080",height:"1754"})),(0,l.kt)("p",null,"\u5982\u4e0a\u56fe\u6240\u793a\uff0c\u539f\u5730\u5347\u7ea7\u8fc7\u7a0b\u4e2d\u53ea\u4fee\u6539\u4e86 Pod \u4e2d\u7684\u5b57\u6bb5\uff0c\u56e0\u6b64\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u53ef\u4ee5\u907f\u514d\u5982 ",(0,l.kt)("em",{parentName:"li"},"\u8c03\u5ea6"),"\u3001",(0,l.kt)("em",{parentName:"li"},"\u5206\u914d IP"),"\u3001",(0,l.kt)("em",{parentName:"li"},"\u5206\u914d\u3001\u6302\u8f7d\u76d8")," \u7b49\u989d\u5916\u7684\u64cd\u4f5c\u548c\u4ee3\u4ef7\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u66f4\u5feb\u7684\u955c\u50cf\u62c9\u53d6\uff0c\u56e0\u4e3a\u53ef\u4ee5\u590d\u7528\u5df2\u6709\u65e7\u955c\u50cf\u7684\u5927\u90e8\u5206 layer \u5c42\uff0c\u53ea\u9700\u8981\u62c9\u53d6\u65b0\u955c\u50cf\u53d8\u5316\u7684\u4e00\u4e9b layer\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u5f53\u4e00\u4e2a\u5bb9\u5668\u5728\u539f\u5730\u5347\u7ea7\u65f6\uff0cPod \u7684\u7f51\u7edc\u3001\u6302\u8f7d\u76d8\u3001\u4ee5\u53ca Pod \u4e2d\u7684\u5176\u4ed6\u5bb9\u5668\u4e0d\u4f1a\u53d7\u5230\u5f71\u54cd\uff0c\u4ecd\u7136\u7ef4\u6301\u8fd0\u884c\u3002")),(0,l.kt)("p",null,"\u7136\u800c\uff0cOpenKruise \u8fc7\u53bb\u53ea\u80fd\u5bf9 Pod \u4e2d image \u5b57\u6bb5\u7684\u66f4\u65b0\u505a\u539f\u5730\u5347\u7ea7\uff0c\u5bf9\u4e8e\u5176\u4ed6\u5b57\u6bb5\u4ecd\u7136\u53ea\u80fd\u91c7\u7528\u4e0e Deployment \u76f8\u4f3c\u7684\u91cd\u5efa\u5347\u7ea7\u3002\u4e00\u76f4\u4ee5\u6765\uff0c\u6211\u4eec\u6536\u5230\u5f88\u591a\u7528\u6237\u53cd\u9988\uff0c\u5e0c\u671b\u652f\u6301\u5bf9 env \u7b49\u66f4\u591a\u5b57\u6bb5\u7684\u539f\u5730\u5347\u7ea7 -- \u7531\u4e8e\u53d7\u5230 kube-apiserver \u7684\u9650\u5236\uff0c\u8fd9\u662f\u5f88\u96be\u505a\u5230\u7684\u3002"),(0,l.kt)("p",null,"\u7ecf\u8fc7\u6211\u4eec\u7684\u4e0d\u61c8\u52aa\u529b\uff0cOpenKruise \u7ec8\u4e8e\u5728 v1.0 \u7248\u672c\u4e2d\uff0c\u652f\u6301\u4e86\u901a\u8fc7 Downward API \u7684\u65b9\u5f0f\u652f\u6301\u4e86 env \u73af\u5883\u53d8\u91cf\u7684\u539f\u5730\u5347\u7ea7\u3002\u4f8b\u5982\u5bf9\u4ee5\u4e0bCloneSet YAML\uff0c\u7528\u6237\u5c06\u914d\u7f6e\u5b9a\u4e49\u5728 annotation \u4e2d\u5e76\u5173\u8054\u5230\u5bf9\u5e94 env \u4e2d\u3002\u540e\u7eed\u5728\u4fee\u6539\u914d\u7f6e\u65f6\uff0c\u53ea\u9700\u8981\u66f4\u65b0 annotation value \u4e2d\u7684\u503c\uff0cKruise \u5c31\u4f1a\u5bf9 Pod \u4e2d\u6240\u6709 env \u91cc\u5f15\u7528\u4e86\u8fd9\u4e2a annotation \u7684\u5bb9\u5668\u89e6\u53d1\u539f\u5730\u91cd\u5efa\uff0c\u4ece\u800c\u751f\u6548\u8fd9\u4e2a\u65b0\u7684 value \u914d\u7f6e\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  ...\nspec:\n  replicas: 1\n  template:\n    metadata:\n      annotations:\n        app-config: \"... the real env value ...\"\n    spec:\n      containers:\n      - name: app\n        env:\n        - name: APP_CONFIG\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.annotations['app-config']\n  updateStrategy:\n    type: InPlaceIfPossible\n")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"\u4e0e\u6b64\u540c\u65f6\uff0c\u6211\u4eec\u5728\u8fd9\u4e2a\u7248\u672c\u4e2d\u4e5f\u53bb\u9664\u4e86\u8fc7\u53bb\u5bf9\u955c\u50cf\u539f\u5730\u5347\u7ea7\u7684",(0,l.kt)("inlineCode",{parentName:"em"},"imageID"),"\u9650\u5236\uff0c\u5373\u652f\u6301\u76f8\u540cimageID\u7684\u4e24\u4e2a\u955c\u50cf\u66ff\u6362\u5347\u7ea7\u3002")),(0,l.kt)("p",null,"\u5177\u4f53\u4f7f\u7528\u65b9\u5f0f\u8bf7\u53c2\u8003",(0,l.kt)("a",{parentName:"p",href:"/docs/core-concepts/inplace-update"},"\u6587\u6863"),"\u3002"),(0,l.kt)("h3",{id:"2-\u914d\u7f6e\u8de8\u547d\u540d\u7a7a\u95f4\u5206\u53d1"},"2. \u914d\u7f6e\u8de8\u547d\u540d\u7a7a\u95f4\u5206\u53d1"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Author: ",(0,l.kt)("a",{parentName:"em",href:"https://github.com/veophi"},"@veophi"))),(0,l.kt)("p",null,"\u5728\u5bf9 Secret\u3001ConfigMap \u7b49 namespace-scoped \u8d44\u6e90\u8fdb\u884c\u8de8 namespace \u5206\u53d1\u53ca\u540c\u6b65\u7684\u573a\u666f\u4e2d\uff0c\u539f\u751f kubernetes \u76ee\u524d\u53ea\u652f\u6301\u7528\u6237 one-by-one \u5730\u8fdb\u884c\u624b\u52a8\u5206\u53d1\u4e0e\u540c\u6b65\uff0c\u5341\u5206\u5730\u4e0d\u65b9\u4fbf\u3002"),(0,l.kt)("p",null,"\u5178\u578b\u7684\u6848\u4f8b\u6709\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5f53\u7528\u6237\u9700\u8981\u4f7f\u7528 SidecarSet \u7684 imagePullSecrets \u80fd\u529b\u65f6\uff0c\u8981\u5148\u91cd\u590d\u5730\u5728\u76f8\u5173 namespaces \u4e2d\u521b\u5efa\u5bf9\u5e94\u7684 Secret\uff0c\u5e76\u4e14\u9700\u8981\u786e\u4fdd\u8fd9\u4e9b Secret \u914d\u7f6e\u7684\u6b63\u786e\u6027\u548c\u4e00\u81f4\u6027\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u5f53\u7528\u6237\u60f3\u8981\u91c7\u7528 ConfigMap \u6765\u914d\u7f6e\u4e00\u4e9b",(0,l.kt)("strong",{parentName:"li"},"\u901a\u7528"),"\u7684\u73af\u5883\u53d8\u91cf\u65f6\uff0c\u5f80\u5f80\u9700\u8981\u5728\u591a\u4e2a namespaces \u505a ConfigMap \u7684\u4e0b\u53d1\uff0c\u5e76\u4e14\u540e\u7eed\u7684\u4fee\u6539\u5f80\u5f80\u4e5f\u8981\u6c42\u591a namespaces \u4e4b\u95f4\u4fdd\u6301\u540c\u6b65\u3002")),(0,l.kt)("p",null,"\u56e0\u6b64\uff0c\u9762\u5bf9\u8fd9\u4e9b\u9700\u8981\u8de8 namespaces \u8fdb\u884c\u8d44\u6e90\u5206\u53d1\u548c",(0,l.kt)("strong",{parentName:"p"},"\u591a\u6b21\u540c\u6b65"),"\u7684\u573a\u666f\uff0c\u6211\u4eec\u671f\u671b\u4e00\u79cd\u66f4\u4fbf\u6377\u7684\u5206\u53d1\u548c\u540c\u6b65\u5de5\u5177\u6765\u81ea\u52a8\u5316\u5730\u53bb\u505a\u8fd9\u4ef6\u4e8b\uff0c\u4e3a\u6b64\u6211\u4eec\u8bbe\u8ba1\u5e76\u5b9e\u73b0\u4e86\u4e00\u4e2a\u65b0\u7684CRD --- ",(0,l.kt)("strong",{parentName:"p"},"ResourceDistribution"),"\u3002"),(0,l.kt)("p",null,"ResourceDistribution \u76ee\u524d\u652f\u6301 ",(0,l.kt)("strong",{parentName:"p"},"Secret")," \u548c ",(0,l.kt)("strong",{parentName:"p"},"ConfigMap")," \u4e24\u7c7b\u8d44\u6e90\u7684\u5206\u53d1\u548c\u540c\u6b65\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n    apiVersion: v1\n    kind: ConfigMap\n    metadata:\n      name: game-demo\n    data:\n      ...\n  targets:\n    namespaceLabelSelector:\n      ...\n    # or includedNamespaces, excludedNamespaces\n")),(0,l.kt)("p",null,"\u5982\u4e0a\u8ff0 YAML \u6240\u793a\uff0cResourceDistribution\u662f\u4e00\u7c7b ",(0,l.kt)("strong",{parentName:"p"},"cluster-scoped")," \u7684 CRD\uff0c\u5176\u4e3b\u8981\u7531 ",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"resource"))," \u548c ",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"targets"))," \u4e24\u4e2a\u5b57\u6bb5\u6784\u6210\uff0c\u5176\u4e2d ",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"resource"))," \u5b57\u6bb5\u7528\u4e8e\u63cf\u8ff0\u7528\u6237\u6240\u8981\u5206\u53d1\u7684\u8d44\u6e90\uff0c",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"targets"))," \u5b57\u6bb5\u7528\u4e8e\u63cf\u8ff0\u7528\u6237\u6240\u8981\u5206\u53d1\u7684\u76ee\u6807\u547d\u540d\u7a7a\u95f4\u3002"),(0,l.kt)("p",null,"\u5177\u4f53\u4f7f\u7528\u65b9\u5f0f\u8bf7\u53c2\u8003",(0,l.kt)("a",{parentName:"p",href:"/docs/user-manuals/resourcedistribution"},"\u6587\u6863"),"\u3002"),(0,l.kt)("h3",{id:"3-\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236"},"3. \u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Author: ",(0,l.kt)("a",{parentName:"em",href:"https://github.com/Concurrensee"},"@Concurrensee"))),(0,l.kt)("p",null,"\u5bf9\u4e8e Kubernetes \u7684\u4e00\u4e2a Pod\uff0c\u5176\u4e2d\u7684\u591a\u4e2a\u5bb9\u5668\u53ef\u80fd\u5b58\u5728\u4f9d\u8d56\u5173\u7cfb\uff0c\u6bd4\u5982 \u5bb9\u5668B \u4e2d\u5e94\u7528\u8fdb\u7a0b\u7684\u8fd0\u884c\u4f9d\u8d56\u4e8e \u5bb9\u5668A \u4e2d\u7684\u5e94\u7528\u3002\u56e0\u6b64\uff0c\u591a\u4e2a\u5bb9\u5668\u4e4b\u95f4\u5b58\u5728\u987a\u5e8f\u5173\u7cfb\u7684\u9700\u6c42\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5bb9\u5668A \u5148\u542f\u52a8\uff0c\u542f\u52a8\u6210\u529f\u540e\u624d\u53ef\u4ee5\u542f\u52a8 \u5bb9\u5668B"),(0,l.kt)("li",{parentName:"ul"},"\u5bb9\u5668B \u5148\u9000\u51fa\uff0c\u9000\u51fa\u5b8c\u6210\u540e\u624d\u53ef\u4ee5\u505c\u6b62 \u5bb9\u5668A")),(0,l.kt)("p",null,"\u901a\u5e38\u6765\u8bf4 Pod \u5bb9\u5668\u7684\u542f\u52a8\u548c\u9000\u51fa\u987a\u5e8f\u662f\u7531 Kubelet \u7ba1\u7406\u7684\u3002Kubernetes \u66fe\u7ecf\u6709\u4e00\u4e2a KEP \u8ba1\u5212\u5728 container \u4e2d\u589e\u52a0\u4e00\u4e2a type \u5b57\u6bb5\u6765\u6807\u8bc6\u4e0d\u540c\u7c7b\u578b\u5bb9\u5668\u7684\u542f\u505c\u4f18\u5148\u7ea7\u3002\u4f46\u662f\u7531\u4e8e sig-node \u8003\u8651\u5230\u5bf9\u73b0\u6709\u4ee3\u7801\u67b6\u6784\u7684\u6539\u52a8\u592a\u5927\uff0c\u76ee\u524d\u8fd9\u4e2a KEP \u5df2\u7ecf\u88ab\u62d2\u7edd\u4e86\u3002"),(0,l.kt)("p",null,"\u56e0\u6b64\uff0cOpenKruise \u5728 v1.0 \u4e2d\u63d0\u4f9b\u4e86\u540d\u4e3a ",(0,l.kt)("strong",{parentName:"p"},"Container Launch Priority")," \u7684\u529f\u80fd\uff0c\u7528\u4e8e\u63a7\u5236\u4e00\u4e2a Pod \u4e2d\u591a\u4e2a\u5bb9\u5668\u7684\u5f3a\u5236\u542f\u52a8\u987a\u5e8f\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u5bf9\u4e8e\u4efb\u610f\u4e00\u4e2a Pod \u5bf9\u8c61\uff0c\u53ea\u9700\u8981\u5728 annotations \u4e2d\u5b9a\u4e49 ",(0,l.kt)("inlineCode",{parentName:"li"},"apps.kruise.io/container-launch-priority: Ordered"),"\uff0c\u5219 Kruise \u4f1a\u6309\u7167 Pod \u4e2d ",(0,l.kt)("inlineCode",{parentName:"li"},"containers")," \u5bb9\u5668\u5217\u8868\u7684\u987a\u5e8f\u6765\u4fdd\u8bc1\u5176\u4e2d\u5bb9\u5668\u7684\u4e32\u884c\u542f\u52a8\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u5982\u679c\u8981\u81ea\u5b9a\u4e49 ",(0,l.kt)("inlineCode",{parentName:"li"},"containers")," \u4e2d\u591a\u4e2a\u5bb9\u5668\u7684\u542f\u52a8\u987a\u5e8f\uff0c\u5219\u5728\u5bb9\u5668 env \u4e2d\u6dfb\u52a0 ",(0,l.kt)("inlineCode",{parentName:"li"},"KRUISE_CONTAINER_PRIORITY")," \u73af\u5883\u53d8\u91cf\uff0cvalue \u503c\u662f\u8303\u56f4\u5728 ",(0,l.kt)("inlineCode",{parentName:"li"},"[-2147483647, 2147483647]")," \u7684\u6574\u6570\u3002\u4e00\u4e2a\u5bb9\u5668\u7684 priority \u503c\u8d8a\u5927\uff0c\u4f1a\u4fdd\u8bc1\u8d8a\u5148\u542f\u52a8\u3002")),(0,l.kt)("p",null,"\u5177\u4f53\u4f7f\u7528\u65b9\u5f0f\u8bf7\u53c2\u8003",(0,l.kt)("a",{parentName:"p",href:"/docs/user-manuals/containerlaunchpriority"},"\u6587\u6863"),"\u3002"),(0,l.kt)("h3",{id:"4-kubectl-kruise-\u547d\u4ee4\u884c\u5de5\u5177"},"4. ",(0,l.kt)("inlineCode",{parentName:"h3"},"kubectl-kruise")," \u547d\u4ee4\u884c\u5de5\u5177"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Author: ",(0,l.kt)("a",{parentName:"em",href:"https://github.com/hantmac"},"@hantmac"))),(0,l.kt)("p",null,"\u8fc7\u53bb OpenKruise \u662f\u901a\u8fc7 kruise-api\u3001client-java \u7b49\u4ed3\u5e93\u63d0\u4f9b\u4e86 Go\u3001Java \u7b49\u8bed\u8a00\u7684 Kruise API \u5b9a\u4e49\u4ee5\u53ca\u5ba2\u6237\u7aef\u5c01\u88c5\uff0c\u53ef\u4f9b\u7528\u6237\u5728\u81ea\u5df1\u7684\u5e94\u7528\u7a0b\u5e8f\u4e2d\u5f15\u5165\u4f7f\u7528\u3002\u4f46\u4ecd\u7136\u6709\u4e0d\u5c11\u7528\u6237\u5728\u6d4b\u8bd5\u73af\u5883\u4e0b\u9700\u8981\u7075\u6d3b\u5730\u7528\u547d\u4ee4\u884c\u64cd\u4f5c workload \u8d44\u6e90\u3002"),(0,l.kt)("p",null,"\u7136\u800c\u539f\u751f ",(0,l.kt)("inlineCode",{parentName:"p"},"kubectl")," \u5de5\u5177\u63d0\u4f9b\u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"rollout"),"\u3001",(0,l.kt)("inlineCode",{parentName:"p"},"set image")," \u7b49\u547d\u4ee4\u53ea\u80fd\u9002\u7528\u4e8e\u539f\u751f\u7684 workload \u7c7b\u578b\uff0c\u5982 Deployment\u3001StatefulSet\uff0c\u5e76\u4e0d\u80fd\u8bc6\u522b OpenKruise \u4e2d\u6269\u5c55\u7684 workload \u7c7b\u578b\u3002"),(0,l.kt)("p",null,"\u56e0\u6b64\uff0cOpenKruise \u6700\u65b0\u63d0\u4f9b\u4e86 ",(0,l.kt)("inlineCode",{parentName:"p"},"kubectl-kruise")," \u547d\u4ee4\u884c\u5de5\u5177\uff0c\u5b83\u662f ",(0,l.kt)("inlineCode",{parentName:"p"},"kubectl")," \u7684\u6807\u51c6\u63d2\u4ef6\uff0c\u63d0\u4f9b\u4e86\u8bb8\u591a\u9002\u7528\u4e8e OpenKruise workload \u7684\u529f\u80fd\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# rollout undo cloneset\n$ kubectl kruise rollout undo cloneset/nginx\n\n#  rollout status advanced statefulset\n$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts-demo\n\n# set image of a cloneset\n$ kubectl kruise set image cloneset/nginx busybox=busybox nginx=nginx:1.9.1\n")),(0,l.kt)("p",null,"\u5177\u4f53\u4f7f\u7528\u65b9\u5f0f\u8bf7\u53c2\u8003",(0,l.kt)("a",{parentName:"p",href:"/docs/cli-tool/kubectl-plugin"},"\u6587\u6863"),"\u3002"),(0,l.kt)("h3",{id:"5-\u5176\u4f59\u90e8\u5206\u529f\u80fd\u6539\u8fdb\u4e0e\u4f18\u5316"},"5. \u5176\u4f59\u90e8\u5206\u529f\u80fd\u6539\u8fdb\u4e0e\u4f18\u5316"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"CloneSet:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u901a\u8fc7 ",(0,l.kt)("inlineCode",{parentName:"li"},"scaleStrategy.maxUnavailable")," \u7b56\u7565\u652f\u6301\u6d41\u5f0f\u6269\u5bb9"),(0,l.kt)("li",{parentName:"ul"},"Stable revision \u5224\u65ad\u903b\u8f91\u53d8\u5316\uff0c\u5f53\u6240\u6709 Pod \u7248\u672c\u4e0e updateRevision \u4e00\u81f4\u65f6\u5219\u6807\u8bb0\u4e3a currentRevision")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"WorkloadSpread:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u652f\u6301\u63a5\u7ba1\u5b58\u91cf Pod \u5230\u5339\u914d\u7684 subset \u5206\u7ec4\u4e2d"),(0,l.kt)("li",{parentName:"ul"},"\u4f18\u5316 webhook \u5728 Pod \u6ce8\u5165\u65f6\u7684\u66f4\u65b0\u4e0e\u91cd\u8bd5\u903b\u8f91")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Advanced DaemonSet:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u652f\u6301\u5bf9 Daemon Pod \u505a\u539f\u5730\u5347\u7ea7"),(0,l.kt)("li",{parentName:"ul"},"\u5f15\u5165 progressive annotation \u6765\u9009\u62e9\u662f\u5426\u6309 partition \u9650\u5236 Pod \u521b\u5efa")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"SidecarSet:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u89e3\u51b3 SidecarSet \u8fc7\u6ee4\u5c4f\u853d inactive Pod"),(0,l.kt)("li",{parentName:"ul"},"\u5728 ",(0,l.kt)("inlineCode",{parentName:"li"},"transferenv")," \u4e2d\u65b0\u589e ",(0,l.kt)("inlineCode",{parentName:"li"},"SourceContainerNameFrom")," \u548c ",(0,l.kt)("inlineCode",{parentName:"li"},"EnvNames")," \u5b57\u6bb5\uff0c\u6765\u89e3\u51b3 container name \u4e0d\u4e00\u81f4\u4e0e\u5927\u91cf env \u60c5\u51b5\u4e0b\u7684\u5197\u4f59\u95ee\u9898")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"PodUnavailableBudget:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u65b0\u589e \u201c\u8df3\u8fc7\u4fdd\u62a4\u201d \u6807\u8bc6"),(0,l.kt)("li",{parentName:"ul"},"PodUnavailableBudget controller \u5173\u6ce8 workload \u5de5\u4f5c\u8d1f\u8f7d\u7684 replicas \u53d8\u5316")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"NodeImage:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u52a0\u5165 ",(0,l.kt)("inlineCode",{parentName:"li"},"--nodeimage-creation-delay")," \u53c2\u6570\uff0c\u5e76\u9ed8\u8ba4\u7b49\u5f85\u65b0\u589e Node ready \u4e00\u6bb5\u65f6\u95f4\u540e\u540c\u6b65\u521b\u5efa NodeImage")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"UnitedDeployment:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u89e3\u51b3 ",(0,l.kt)("inlineCode",{parentName:"li"},"NodeSelectorTerms")," \u4e3a nil \u60c5\u51b5\u4e0b Pod ",(0,l.kt)("inlineCode",{parentName:"li"},"NodeSelectorTerms")," \u957f\u5ea6\u4e3a 0 \u7684\u95ee\u9898")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Other optimization:")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"kruise-daemon \u91c7\u7528 protobuf \u534f\u8bae\u64cd\u4f5c Pod \u8d44\u6e90"),(0,l.kt)("li",{parentName:"ul"},"\u66b4\u9732 cache resync \u4e3a\u547d\u4ee4\u884c\u53c2\u6570\uff0c\u5e76\u5728 chart \u4e2d\u8bbe\u7f6e\u9ed8\u8ba4\u503c\u4e3a 0"),(0,l.kt)("li",{parentName:"ul"},"\u89e3\u51b3 certs \u66f4\u65b0\u65f6\u7684 http checker \u5237\u65b0\u95ee\u9898"),(0,l.kt)("li",{parentName:"ul"},"\u53bb\u9664\u5bf9 forked controller-tools \u7684\u4f9d\u8d56\uff0c\u6539\u4e3a\u4f7f\u7528\u539f\u751f controller-tools \u914d\u5408 markers \u6ce8\u89e3")),(0,l.kt)("h2",{id:"\u793e\u533a\u53c2\u4e0e"},"\u793e\u533a\u53c2\u4e0e"),(0,l.kt)("p",null,"\u975e\u5e38\u6b22\u8fce\u4f60\u901a\u8fc7 Github/Slack/\u9489\u9489/\u5fae\u4fe1 \u7b49\u65b9\u5f0f\u52a0\u5165\u6211\u4eec\u6765\u53c2\u4e0e OpenKruise \u5f00\u6e90\u793e\u533a\u3002\n\u4f60\u662f\u5426\u5df2\u7ecf\u6709\u4e00\u4e9b\u5e0c\u671b\u4e0e\u6211\u4eec\u793e\u533a\u4ea4\u6d41\u7684\u5185\u5bb9\u5462\uff1f\n\u53ef\u4ee5\u5728\u6211\u4eec\u7684",(0,l.kt)("a",{parentName:"p",href:"https://shimo.im/docs/gXqmeQOYBehZ4vqo"},"\u793e\u533a\u53cc\u5468\u4f1a"),"\u4e0a\u5206\u4eab\u4f60\u7684\u58f0\u97f3\uff0c\u6216\u901a\u8fc7\u4ee5\u4e0b\u6e20\u9053\u53c2\u4e0e\u8ba8\u8bba\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u52a0\u5165\u793e\u533a ",(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.slack.com/channels/openkruise"},"Slack channel")," (English)"),(0,l.kt)("li",{parentName:"ul"},"\u52a0\u5165\u793e\u533a\u9489\u9489\u7fa4\uff1a\u641c\u7d22\u7fa4\u53f7 ",(0,l.kt)("inlineCode",{parentName:"li"},"23330762")," (Chinese)"),(0,l.kt)("li",{parentName:"ul"},"\u52a0\u5165\u793e\u533a\u5fae\u4fe1\u7fa4\uff1a\u6dfb\u52a0\u7528\u6237 ",(0,l.kt)("inlineCode",{parentName:"li"},"openkruise")," \u5e76\u8ba9\u673a\u5668\u4eba\u62c9\u4f60\u5165\u7fa4 (Chinese)")))}c.isMDXComponent=!0},9193:function(e,t,n){t.Z=n.p+"assets/images/features-zh-8ffa4c48195f95d40dee1f0f7e3565bb.png"},3662:function(e,t,n){t.Z=n.p+"assets/images/inplace-update-comparation-fc948df195e332f578d4967c34b0c3d3.png"}}]);
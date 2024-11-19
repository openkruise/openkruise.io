"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8669],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=r.createContext({}),c=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=c(t),d=a,f=m["".concat(u,".").concat(d)]||m[d]||s[d]||i;return t?r.createElement(f,l(l({ref:n},p),{},{components:t})):r.createElement(f,l({ref:n},p))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,l=new Array(i);l[0]=m;var o={};for(var u in n)hasOwnProperty.call(n,u)&&(o[u]=n[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<i;c++)l[c]=t[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5214:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return s}});var r=t(87462),a=t(63366),i=(t(67294),t(3905)),l=["components"],o={},u="\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565",c={unversionedId:"user-manuals/update-strategy",id:"user-manuals/update-strategy",title:"\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565",description:"\u529f\u80fd\u6982\u8ff0",source:"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/user-manuals/update-strategy.md",sourceDirName:"user-manuals",slug:"/user-manuals/update-strategy",permalink:"/zh/kruisegame/user-manuals/update-strategy",draft:!1,tags:[],version:"current",lastUpdatedBy:"skkkkkkk",lastUpdatedAt:1685069311,formattedLastUpdatedAt:"2023/5/26",frontMatter:{},sidebar:"kruisegame",previous:{title:"\u6e38\u620f\u670d\u70ed\u66f4\u65b0",permalink:"/zh/kruisegame/user-manuals/hot-update"},next:{title:"\u6e38\u620f\u670d\u4f38\u7f29",permalink:"/zh/kruisegame/user-manuals/gameservers-scale"}},p={},s=[{value:"\u529f\u80fd\u6982\u8ff0",id:"\u529f\u80fd\u6982\u8ff0",level:2},{value:"\u4f7f\u7528\u793a\u4f8b",id:"\u4f7f\u7528\u793a\u4f8b",level:2}],m={toc:s};function d(e){var n=e.components,o=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},m,o,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565"},"\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565"),(0,i.kt)("h2",{id:"\u529f\u80fd\u6982\u8ff0"},"\u529f\u80fd\u6982\u8ff0"),(0,i.kt)("p",null,"OKG \u63d0\u4f9b\u4e86\u539f\u5730\u5347\u7ea7\uff08",(0,i.kt)("a",{parentName:"p",href:"/zh/kruisegame/user-manuals/hot-update"},"\u70ed\u66f4\u65b0"),"\uff09\u3001\u6279\u91cf\u66f4\u65b0\u3001\u6309\u4f18\u5148\u7ea7\u66f4\u65b0\u7b49\u591a\u79cd\u66f4\u65b0\u7b56\u7565\u3002"),(0,i.kt)("p",null,"\u7528\u6237\u53ef\u8bbe\u7f6eGameServer\u7684\u66f4\u65b0\u4f18\u5148\u7ea7\uff0c\u914d\u5408partition\u53c2\u6570\uff0c\u5b9e\u73b0\u5728\u5b9e\u9645\u751f\u4ea7\u573a\u666f\u4e0b\uff0c\u628a\u63a7\u66f4\u65b0\u8303\u56f4\u3001\u66f4\u65b0\u987a\u5e8f\u3001\u66f4\u65b0\u8282\u594f\u3002\n\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u63d0\u9ad8\u5e8f\u53f7\u4e3a1\u7684\u6e38\u620f\u670d\u4f18\u5148\u7ea7\uff0c\u540c\u65f6\u8bbe\u7f6epartition\u4e3a2\uff0c\u5219\u4f1a\u4f18\u5148\u66f4\u65b01\u53f7\u6e38\u620f\u670d\uff1b\u968f\u540e\u66f4\u6539partition\u4e3a0\uff0c\u5219\u4f1a\u518d\u66f4\u65b0\u5176\u4f59\u6e38\u620f\u670d\u3002\u8be6\u60c5\u53ef\u53c2\u8003\u4f7f\u7528\u793a\u4f8b\u3002"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"update-priority.png",src:t(49868).Z,width:"667",height:"257"})),(0,i.kt)("h2",{id:"\u4f7f\u7528\u793a\u4f8b"},"\u4f7f\u7528\u793a\u4f8b"),(0,i.kt)("p",null,"\u672c\u793a\u4f8b\u4e2d\u5c06\u4e00\u7ec4\u6e38\u620f\u670d\u5206\u6210\u4e24\u6279\u6b21\u66f4\u65b0\uff0c\u6a21\u62df\u7070\u5ea6\u66f4\u65b0\uff0c\u9010\u6b65\u9a8c\u8bc1\u7684\u573a\u666f\u3002"),(0,i.kt)("p",null,"\u6b64\u65f6GameServerSet\u4e0b\u67093\u4e2a\u6e38\u620f\u670d\u526f\u672c\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get gs\nNAME          STATE      OPSSTATE   DP    UP\nminecraft-0   Ready      None       0     0\nminecraft-1   Ready      None       0     0\nminecraft-2   Ready      None       0     0\n")),(0,i.kt)("p",null,"\u8bbe\u7f6e\u66f4\u65b0\u4f18\u5148\u7ea7\uff0c\u5c061\u53f7\u6e38\u620f\u670d\u4f18\u5148\u7ea7\u8c03\u5927\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl edit gs minecraft-1\n\n...\nspec:\n  deletionPriority: 0\n  opsState: None\n  updatePriority: 10 #\u521d\u59cb\u4e3a0\uff0c\u8c03\u5927\u621010\n...\n")),(0,i.kt)("p",null,"\u63a5\u4e0b\u6765\u8bbe\u7f6e GameServerSet partition\u3001\u4ee5\u53ca\u5373\u5c06\u66f4\u65b0\u7684\u65b0\u955c\u50cf\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl edit gss minecraft\n\n...\n        image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new # \u66f4\u65b0\u955c\u50cf\n        name: gameserver\n...\n  updateStrategy:\n    rollingUpdate:\n      maxUnavailable: 5\n      partition: 2 # \u8bbe\u7f6e\u4fdd\u7559\u7684\u6e38\u620f\u670d\u6570\u76ee\uff0c\u8fd9\u91cc\u53ea\u66f4\u65b0\u4e00\u4e2a\uff0c\u6240\u4ee5\u8981\u4fdd\u7559\u4f59\u4e0b2\u4e2a\n      podUpdatePolicy: InPlaceIfPossible\n...\n\n")),(0,i.kt)("p",null,"\u6b64\u65f6\u53ea\u6709minecraft-1\u5c06\u4f1a\u66f4\u65b0:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get gs\nNAME          STATE      OPSSTATE   DP    UP\nminecraft-0   Ready      None       0     0\nminecraft-1   Updating   None       0     10\nminecraft-2   Ready      None       0     0\n\n\n# \u4e00\u6bb5\u65f6\u95f4\u8fc7\u540e\n...\n\nkubectl get gs\nNAME          STATE      OPSSTATE   DP    UP\nminecraft-0   Ready      None       0     0\nminecraft-1   Ready      None       0     10\nminecraft-2   Ready      None       0     0\n")),(0,i.kt)("p",null,"\u5f85minecraft-1\u9a8c\u8bc1\u901a\u8fc7\u540e\uff0c\u66f4\u65b0\u5176\u4f59\u6e38\u620f\u670d\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl edit gss minecraft\n...\n  updateStrategy:\n    rollingUpdate:\n      maxUnavailable: 5\n      partition: 0 # \u8bbe\u7f6e\u4fdd\u7559\u7684\u6e38\u620f\u670d\u6570\u76ee\uff0c\u5c06\u5176\u8bbe\u7f6e\u4e3a0\uff0c\u66f4\u65b0\u4f59\u4e0b\u5168\u90e8\n      podUpdatePolicy: InPlaceIfPossible\n...\n\n")))}d.isMDXComponent=!0},49868:function(e,n,t){n.Z=t.p+"assets/images/update-priority-6beaaeea676e12846d1c66c854df20b0.png"}}]);
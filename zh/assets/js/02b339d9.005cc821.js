"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7802],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=u(n),f=o,m=d["".concat(l,".").concat(f)]||d[f]||s[f]||a;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2794:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return c},metadata:function(){return u},toc:function(){return s}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],c={title:"HPA configuration"},l=void 0,u={unversionedId:"best-practices/hpa-configuration",id:"version-v1.1/best-practices/hpa-configuration",title:"HPA configuration",description:"Kruise \u4e2d\u7684 Workload\uff0c\u6bd4\u5982 CloneSet\u3001Advanced StatefulSet\u3001UnitedDeployment\uff0c\u90fd\u5b9e\u73b0\u4e86 scale subresource\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.1/best-practices/hpa-configuration.md",sourceDirName:"best-practices",slug:"/best-practices/hpa-configuration",permalink:"/zh/docs/v1.1/best-practices/hpa-configuration",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/hpa-configuration.md",tags:[],version:"v1.1",lastUpdatedBy:"Siyu Wang",lastUpdatedAt:1648620235,formattedLastUpdatedAt:"2022/3/30",frontMatter:{title:"HPA configuration"},sidebar:"docs",previous:{title:"PodUnavailableBudget",permalink:"/zh/docs/v1.1/user-manuals/podunavailablebudget"},next:{title:"\u4e91\u539f\u751fDevops\u6700\u4f73\u5b9e\u8df5\uff081\uff09\uff1a\u6301\u7eed\u96c6\u6210\uff08CI\uff09+ OpenKruise\u955c\u50cf\u9884\u70ed",permalink:"/zh/docs/v1.1/best-practices/ci-pipeline-image-predownload"}},p={},s=[{value:"\u4f8b\u5b50",id:"\u4f8b\u5b50",level:3}],d={toc:s};function f(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Kruise \u4e2d\u7684 Workload\uff0c\u6bd4\u5982 CloneSet\u3001Advanced StatefulSet\u3001UnitedDeployment\uff0c\u90fd\u5b9e\u73b0\u4e86 scale subresource\u3002\n\u8fd9\u8868\u793a\u5b83\u4eec\u90fd\u53ef\u4ee5\u9002\u914d HorizontalPodAutoscaler\u3001PodDisruptionBudget \u7b49\u539f\u751f\u64cd\u4f5c\u3002"),(0,a.kt)("h3",{id:"\u4f8b\u5b50"},"\u4f8b\u5b50"),(0,a.kt)("p",null,"\u53ea\u9700\u8981\u5c06 CloneSet \u7684\u7c7b\u578b\u3001\u540d\u5b57\u5199\u5165 ",(0,a.kt)("inlineCode",{parentName:"p"},"scaleTargetRef")," \u5373\u53ef\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: autoscaling/v2beta2\nkind: HorizontalPodAutoscaler\n# ...\nspec:\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: your-cloneset-name\n")),(0,a.kt)("p",null,"\u6ce8\u610f\uff1a"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"HPA \u7684 namespace \u9700\u8981\u548c\u4f60\u7684 CloneSet \u76f8\u540c\u3002"),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"scaleTargetRef")," \u4e2d\u7684 ",(0,a.kt)("inlineCode",{parentName:"li"},"apiVersion")," \u9700\u8981\u548c\u4f60\u7684 workload \u4e2d\u7684\u76f8\u540c\uff0c\u6bd4\u5982 ",(0,a.kt)("inlineCode",{parentName:"li"},"apps.kruise.io/v1alpha1")," \u6216 ",(0,a.kt)("inlineCode",{parentName:"li"},"apps.kruise.io/v1beta1"),"\u3002\n\u5bf9\u4e8e Advanced StatefulSet \u8fd9\u79cd\u5b58\u5728\u591a\u4e2a\u7248\u672c\u7684 workload\uff0c\u5b83\u53d6\u51b3\u4e8e\u4f60\u6240\u4f7f\u7528\u7684\u7248\u672c\u3002")))}f.isMDXComponent=!0}}]);
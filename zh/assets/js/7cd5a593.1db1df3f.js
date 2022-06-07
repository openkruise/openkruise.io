"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3660],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),c=u(n),m=a,k=c["".concat(p,".").concat(m)]||c[m]||s[m]||l;return n?r.createElement(k,i(i({ref:t},d),{},{components:n})):r.createElement(k,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,i=new Array(l);i[0]=c;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var u=2;u<l;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},1719:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return s}});var r=n(7462),a=n(3366),l=(n(7294),n(3905)),i=["components"],o={title:"Deletion Protection"},p=void 0,u={unversionedId:"user-manuals/deletionprotection",id:"user-manuals/deletionprotection",title:"Deletion Protection",description:"FEATURE STATE: Kruise v0.9.0",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/user-manuals/deletionprotection.md",sourceDirName:"user-manuals",slug:"/user-manuals/deletionprotection",permalink:"/zh/docs/next/user-manuals/deletionprotection",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/deletionprotection.md",tags:[],version:"current",lastUpdatedBy:"FillZpp",lastUpdatedAt:1632468169,formattedLastUpdatedAt:"2021/9/24",frontMatter:{title:"Deletion Protection"},sidebar:"docs",previous:{title:"PersistentPodState",permalink:"/zh/docs/next/user-manuals/persistentpodstate"},next:{title:"PodUnavailableBudget",permalink:"/zh/docs/next/user-manuals/podunavailablebudget"}},d={},s=[{value:"\u4f7f\u7528\u65b9\u5f0f",id:"\u4f7f\u7528\u65b9\u5f0f",level:2},{value:"\u98ce\u9669",id:"\u98ce\u9669",level:2}],c={toc:s};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.9.0"),(0,l.kt)("p",null,"\u8be5\u529f\u80fd\u63d0\u4f9b\u4e86\u4e00\u4e2a\u5b89\u5168\u7b56\u7565\uff0c\u7528\u6765\u5728 Kubernetes \u7ea7\u8054\u5220\u9664\u7684\u673a\u5236\u4e0b\u4fdd\u62a4\u7528\u6237\u7684\u8d44\u6e90\u548c\u5e94\u7528\u53ef\u7528\u6027\u3002"),(0,l.kt)("h2",{id:"\u4f7f\u7528\u65b9\u5f0f"},"\u4f7f\u7528\u65b9\u5f0f"),(0,l.kt)("p",null,"\u9996\u5148\uff0c\u9700\u8981\u5728",(0,l.kt)("a",{parentName:"p",href:"../installation##optional-feature-gate"},"\u5b89\u88c5\u6216\u5347\u7ea7 Kruise")," \u7684\u65f6\u5019\u542f\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"ResourcesDeletionProtection")," feature-gate\u3002"),(0,l.kt)("p",null,"\u7136\u540e\uff0c\u7528\u6237\u53ef\u4ee5\u7ed9\u4e00\u4e9b\u7279\u5b9a\u8d44\u6e90\u5bf9\u8c61\u52a0\u4e0a ",(0,l.kt)("inlineCode",{parentName:"p"},"policy.kruise.io/delete-protection")," \u6807\u7b7e\uff0c\u503c\u53ef\u4ee5\u662f\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"Always"),": \u8fd9\u4e2a\u5bf9\u8c61\u7981\u6b62\u88ab\u5220\u9664\uff0c\u9664\u975e\u4e0a\u8ff0 label \u88ab\u53bb\u6389"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"Cascading"),": \u8fd9\u4e2a\u5bf9\u8c61\u5982\u679c\u8fd8\u6709\u53ef\u7528\u7684\u4e0b\u5c5e\u8d44\u6e90\uff0c\u5219\u7981\u6b62\u88ab\u5220\u9664")),(0,l.kt)("p",null,"\u76ee\u524d\u652f\u6301\u7684\u8d44\u6e90\u7c7b\u578b\u3001\u4ee5\u53ca cascading \u7ea7\u8054\u5173\u7cfb\u5982\u4e0b\uff1a"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Kind"),(0,l.kt)("th",{parentName:"tr",align:null},"Group"),(0,l.kt)("th",{parentName:"tr",align:null},"Version"),(0,l.kt)("th",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"th"},"Cascading")," judgement"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Namespace")),(0,l.kt)("td",{parentName:"tr",align:null},"core"),(0,l.kt)("td",{parentName:"tr",align:null},"v1"),(0,l.kt)("td",{parentName:"tr",align:null},"namespace \u4e0b\u662f\u5426\u8fd8\u6709\u6b63\u5e38\u7684 Pod")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"CustomResourceDefinition")),(0,l.kt)("td",{parentName:"tr",align:null},"apiextensions.k8s.io"),(0,l.kt)("td",{parentName:"tr",align:null},"v1beta1, v1"),(0,l.kt)("td",{parentName:"tr",align:null},"CRD \u4e0b\u662f\u5426\u8fd8\u6709\u5b58\u91cf\u7684 CR")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Deployment")),(0,l.kt)("td",{parentName:"tr",align:null},"apps"),(0,l.kt)("td",{parentName:"tr",align:null},"v1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"StatefulSet")),(0,l.kt)("td",{parentName:"tr",align:null},"apps"),(0,l.kt)("td",{parentName:"tr",align:null},"v1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"ReplicaSet")),(0,l.kt)("td",{parentName:"tr",align:null},"apps"),(0,l.kt)("td",{parentName:"tr",align:null},"v1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"CloneSet")),(0,l.kt)("td",{parentName:"tr",align:null},"apps.kruise.io"),(0,l.kt)("td",{parentName:"tr",align:null},"v1alpha1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"StatefulSet")),(0,l.kt)("td",{parentName:"tr",align:null},"apps.kruise.io"),(0,l.kt)("td",{parentName:"tr",align:null},"v1alpha1, v1beta1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"UnitedDeployment")),(0,l.kt)("td",{parentName:"tr",align:null},"apps.kruise.io"),(0,l.kt)("td",{parentName:"tr",align:null},"v1alpha1"),(0,l.kt)("td",{parentName:"tr",align:null},"replicas \u662f\u5426\u4e3a 0")))),(0,l.kt)("h2",{id:"\u98ce\u9669"},"\u98ce\u9669"),(0,l.kt)("p",null,"\u901a\u8fc7 ",(0,l.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#webhook-configuration"},"webhook configuration")," \u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"objectSelector")," \u5b57\u6bb5\uff0c\nKruise webhook \u53ea\u4f1a\u62e6\u622a\u5904\u7406\u5e26\u6709 ",(0,l.kt)("inlineCode",{parentName:"p"},"policy.kruise.io/delete-protection")," \u6807\u7b7e\u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"Namespace/CustomResourceDefinition/Deployment/StatefulSet/ReplicaSet")," \u8d44\u6e90\u3002"),(0,l.kt)("p",null,"\u56e0\u6b64\uff0c\u5982\u679c\u6240\u6709 kruise-manager pod \u90fd\u6302\u4e86\u6216\u8005\u5904\u4e8e\u5f02\u5e38\u7684\u72b6\u6001\uff0ckube-apiserver \u8c03\u7528 deletion webhook \u5931\u8d25\uff0c\n\u53ea\u6709\u5e26\u6709 ",(0,l.kt)("inlineCode",{parentName:"p"},"policy.kruise.io/delete-protection")," \u6807\u7b7e\u7684\u4e0a\u8ff0\u8d44\u6e90\u624d\u4f1a\u6682\u65f6\u65e0\u6cd5\u5220\u9664\u3002"))}m.isMDXComponent=!0}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8099],{3905:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return c}});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var i=a.createContext({}),d=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},s=function(e){var n=d(e.components);return a.createElement(i.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,l=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=d(t),c=o,k=u["".concat(i,".").concat(c)]||u[c]||m[c]||l;return t?a.createElement(k,r(r({ref:n},s),{},{components:t})):a.createElement(k,r({ref:n},s))}));function c(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var l=t.length,r=new Array(l);r[0]=u;var p={};for(var i in n)hasOwnProperty.call(n,i)&&(p[i]=n[i]);p.originalType=e,p.mdxType="string"==typeof e?e:o,r[1]=p;for(var d=2;d<l;d++)r[d]=t[d];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},6962:function(e,n,t){t.r(n),t.d(n,{assets:function(){return s},contentTitle:function(){return i},default:function(){return c},frontMatter:function(){return p},metadata:function(){return d},toc:function(){return m}});var a=t(7462),o=t(3366),l=(t(7294),t(3905)),r=["components"],p={title:"Advanced DaemonSet"},i=void 0,d={unversionedId:"user-manuals/advanceddaemonset",id:"version-v1.7/user-manuals/advanceddaemonset",title:"Advanced DaemonSet",description:"\u8fd9\u4e2a\u63a7\u5236\u5668\u57fa\u4e8e\u539f\u751f DaemonSet \u4e0a\u589e\u5f3a\u4e86\u53d1\u5e03\u80fd\u529b\uff0c\u6bd4\u5982 \u7070\u5ea6\u5206\u6279\u3001\u6309 Node label \u9009\u62e9\u3001\u6682\u505c\u3001\u70ed\u5347\u7ea7\u7b49\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/advanceddaemonset.md",sourceDirName:"user-manuals",slug:"/user-manuals/advanceddaemonset",permalink:"/zh/docs/user-manuals/advanceddaemonset",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advanceddaemonset.md",tags:[],version:"v1.7",lastUpdatedBy:"berg",lastUpdatedAt:1724814279,formattedLastUpdatedAt:"2024/8/28",frontMatter:{title:"Advanced DaemonSet"},sidebar:"docs",previous:{title:"Advanced StatefulSet",permalink:"/zh/docs/user-manuals/advancedstatefulset"},next:{title:"BroadcastJob",permalink:"/zh/docs/user-manuals/broadcastjob"}},s={},m=[{value:"\u589e\u5f3a\u7b56\u7565",id:"\u589e\u5f3a\u7b56\u7565",level:2},{value:"\u5347\u7ea7\u65b9\u5f0f",id:"\u5347\u7ea7\u65b9\u5f0f",level:3},{value:"Selector \u6807\u7b7e\u9009\u62e9\u5347\u7ea7",id:"selector-\u6807\u7b7e\u9009\u62e9\u5347\u7ea7",level:3},{value:"\u5206\u6279\u7070\u5ea6\u5347\u7ea7\u6216\u6269\u5bb9",id:"\u5206\u6279\u7070\u5ea6\u5347\u7ea7\u6216\u6269\u5bb9",level:3},{value:"\u6682\u505c\u5347\u7ea7",id:"\u6682\u505c\u5347\u7ea7",level:3},{value:"\u5347\u7ea7\u955c\u50cf\u81ea\u52a8\u9884\u70ed",id:"\u5347\u7ea7\u955c\u50cf\u81ea\u52a8\u9884\u70ed",level:3},{value:"\u751f\u547d\u5468\u671f\u94a9\u5b50",id:"\u751f\u547d\u5468\u671f\u94a9\u5b50",level:3},{value:"\u5220\u9664 Pod \u524d\u5c06\u5176\u7f6e\u4e3a NotReady",id:"\u5220\u9664-pod-\u524d\u5c06\u5176\u7f6e\u4e3a-notready",level:4},{value:"\u7528\u6237 controller \u903b\u8f91\u793a\u4f8b",id:"\u7528\u6237-controller-\u903b\u8f91\u793a\u4f8b",level:4}],u={toc:m};function c(e){var n=e.components,t=(0,o.Z)(e,r);return(0,l.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u8fd9\u4e2a\u63a7\u5236\u5668\u57fa\u4e8e\u539f\u751f ",(0,l.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/"},"DaemonSet")," \u4e0a\u589e\u5f3a\u4e86\u53d1\u5e03\u80fd\u529b\uff0c\u6bd4\u5982 \u7070\u5ea6\u5206\u6279\u3001\u6309 Node label \u9009\u62e9\u3001\u6682\u505c\u3001\u70ed\u5347\u7ea7\u7b49\u3002"),(0,l.kt)("p",null,"\u5982\u679c\u4f60\u5bf9\u539f\u751f DaemonSet \u4e0d\u662f\u5f88\u4e86\u89e3\uff0c\u6211\u4eec\u5f3a\u70c8\u5efa\u8bae\u4f60\u5148\u9605\u8bfb\u5b83\u7684\u6587\u6863\uff08\u5728\u5b66\u4e60 Advanced DaemonSet \u4e4b\u524d\uff09\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/"},"Concept of Kubernetes DaemonSet")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/"},"Perform a Rolling Update on a DaemonSet")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/manage-daemon/rollback-daemon-set/"},"Perform a Rollback on a DaemonSet"))),(0,l.kt)("p",null,"\u6ce8\u610f ",(0,l.kt)("inlineCode",{parentName:"p"},"Advanced DaemonSet")," \u662f\u4e00\u4e2a CRD\uff0ckind \u540d\u5b57\u4e5f\u662f ",(0,l.kt)("inlineCode",{parentName:"p"},"DaemonSet"),"\uff0c\u4f46\u662f apiVersion \u662f ",(0,l.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/v1alpha1"),"\u3002\n\u8fd9\u4e2a CRD \u7684\u6240\u6709\u9ed8\u8ba4\u5b57\u6bb5\u3001\u9ed8\u8ba4\u884c\u4e3a\u4e0e\u539f\u751f DaemonSet \u5b8c\u5168\u4e00\u81f4\uff0c\u9664\u6b64\u4e4b\u5916\u8fd8\u63d0\u4f9b\u4e86\u4e00\u4e9b optional \u5b57\u6bb5\u6765\u6269\u5c55\u589e\u5f3a\u7684\u7b56\u7565\u3002"),(0,l.kt)("p",null,"\u56e0\u6b64\uff0c\u7528\u6237\u4ece\u539f\u751f ",(0,l.kt)("inlineCode",{parentName:"p"},"DaemonSet")," \u8fc1\u79fb\u5230 ",(0,l.kt)("inlineCode",{parentName:"p"},"Advanced DaemonSet"),"\uff0c\u53ea\u9700\u8981\u628a ",(0,l.kt)("inlineCode",{parentName:"p"},"apiVersion")," \u4fee\u6539\u540e\u63d0\u4ea4\u5373\u53ef\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1alpha1\n   kind: DaemonSet\n   metadata:\n     name: sample-ds\n   spec:\n     #...\n")),(0,l.kt)("h2",{id:"\u589e\u5f3a\u7b56\u7565"},"\u589e\u5f3a\u7b56\u7565"),(0,l.kt)("p",null,"\u5728 RollingUpdateDaemonSet \u4e2d\u6211\u4eec\u65b0\u589e\u4e86\u4ee5\u4e0b\u5b57\u6bb5\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-go"},'const (\n+    // StandardRollingUpdateType replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.\n+    // this is the default type for RollingUpdate.\n+    StandardRollingUpdateType RollingUpdateType = "Standard"\n\n+    // InplaceRollingUpdateType update container image without killing the pod if possible.\n+    InplaceRollingUpdateType RollingUpdateType = "InPlaceIfPossible"\n)\n\n// Spec to control the desired behavior of daemon set rolling update.\ntype RollingUpdateDaemonSet struct {\n+    // Type is to specify which kind of rollingUpdate.\n+    Type RollingUpdateType `json:"rollingUpdateType,omitempty" protobuf:"bytes,1,opt,name=rollingUpdateType"`\n\n    // ...\n    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty" protobuf:"bytes,2,opt,name=maxUnavailable"`\n\n    // ...\n    MaxSurge *intstr.IntOrString `json:"maxSurge,omitempty" protobuf:"bytes,7,opt,name=maxSurge"`\n\n+    // A label query over nodes that are managed by the daemon set RollingUpdate.\n+    // Must match in order to be controlled.\n+    // It must match the node\'s labels.\n+    Selector *metav1.LabelSelector `json:"selector,omitempty" protobuf:"bytes,3,opt,name=selector"`\n\n+    // The number of DaemonSet pods remained to be old version.\n+    // Default value is 0.\n+    // Maximum value is status.DesiredNumberScheduled, which means no pod will be updated.\n+    // +optional\n+    Partition *int32 `json:"partition,omitempty" protobuf:"varint,4,opt,name=partition"`\n\n+    // Indicates that the daemon set is paused and will not be processed by the\n+    // daemon set controller.\n+    // +optional\n+    Paused *bool `json:"paused,omitempty" protobuf:"varint,5,opt,name=paused"`\n}\n')),(0,l.kt)("h3",{id:"\u5347\u7ea7\u65b9\u5f0f"},"\u5347\u7ea7\u65b9\u5f0f"),(0,l.kt)("p",null,"Advanced DaemonSet \u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"spec.updateStrategy.rollingUpdate")," \u4e2d\u6709\u4e00\u4e2a ",(0,l.kt)("inlineCode",{parentName:"p"},"rollingUpdateType")," \u5b57\u6bb5\uff0c\u6807\u8bc6\u4e86\u5982\u4f55\u8fdb\u884c\u6eda\u52a8\u5347\u7ea7\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"Standard"),": \u5bf9\u4e8e\u6bcf\u4e2a node\uff0c\u63a7\u5236\u5668\u4f1a\u5148\u5220\u9664\u65e7\u7684 daemon Pod\uff0c\u518d\u521b\u5efa\u4e00\u4e2a\u65b0 Pod\uff0c\u548c\u539f\u751f DaemonSet \u884c\u4e3a\u4e00\u81f4\u3002")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"Surging"),": \u5bf9\u4e8e\u6bcf\u4e2a node\uff0c\u63a7\u5236\u5668\u4f1a\u5148\u521b\u5efa\u4e00\u4e2a\u65b0 Pod\uff0c\u7b49\u5b83 ready \u4e4b\u540e\u518d\u5220\u9664\u8001 Pod\u3002")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"Standard")," (\u9ed8\u8ba4): \u63a7\u5236\u5668\u4f1a\u91cd\u5efa\u5347\u7ea7 Pod\uff0c\u4e0e\u539f\u751f DaemonSet \u884c\u4e3a\u4e00\u81f4\u3002\u4f60\u53ef\u4ee5\u901a\u8fc7 ",(0,l.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," \u6216 ",(0,l.kt)("inlineCode",{parentName:"p"},"maxSurge")," \u6765\u63a7\u5236\u91cd\u5efa\u65b0\u65e7 Pod \u7684\u987a\u5e8f\u3002")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"InPlaceIfPossible"),": \u63a7\u5236\u5668\u4f1a\u5c3d\u91cf\u91c7\u7528\u539f\u5730\u5347\u7ea7\u7684\u65b9\u5f0f\uff0c\u5982\u679c\u4e0d\u884c\u5219\u91cd\u5efa\u5347\u7ea7\u3002\u8bf7\u9605\u8bfb",(0,l.kt)("a",{parentName:"p",href:"../core-concepts/inplace-update"},"\u8be5\u6587\u6863"),"\u4e86\u89e3\u66f4\u591a\u539f\u5730\u5347\u7ea7\u7684\u7ec6\u8282\u3002\n\u6ce8\u610f\uff0c\u5728\u8fd9\u4e2a\u7c7b\u578b\u4e0b\uff0c\u53ea\u80fd\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," \u800c\u4e0d\u80fd\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"maxSurge"),"\u3002"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      rollingUpdateType: Standard\n")),(0,l.kt)("h3",{id:"selector-\u6807\u7b7e\u9009\u62e9\u5347\u7ea7"},"Selector \u6807\u7b7e\u9009\u62e9\u5347\u7ea7"),(0,l.kt)("p",null,"\u8fd9\u4e2a\u7b56\u7565\u652f\u6301\u7528\u6237\u901a\u8fc7\u914d\u7f6e node \u6807\u7b7e\u7684 selector\uff0c\u6765\u6307\u5b9a\u7070\u5ea6\u5347\u7ea7\u67d0\u4e9b\u7279\u5b9a\u7c7b\u578b node \u4e0a\u7684 Pod\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      selector:\n        matchLabels:\n          nodeType: canary\n")),(0,l.kt)("h3",{id:"\u5206\u6279\u7070\u5ea6\u5347\u7ea7\u6216\u6269\u5bb9"},"\u5206\u6279\u7070\u5ea6\u5347\u7ea7\u6216\u6269\u5bb9"),(0,l.kt)("p",null,"Partition \u7684\u8bed\u4e49\u662f ",(0,l.kt)("strong",{parentName:"p"},"\u4fdd\u7559\u65e7\u7248\u672c Pod \u7684\u6570\u91cf"),"\uff0c\u9ed8\u8ba4\u4e3a ",(0,l.kt)("inlineCode",{parentName:"p"},"0"),"\u3002\n\u5982\u679c\u5728\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u8bbe\u7f6e\u4e86 ",(0,l.kt)("inlineCode",{parentName:"p"},"partition"),"\uff0c\u5219\u63a7\u5236\u5668\u53ea\u4f1a\u5c06 ",(0,l.kt)("inlineCode",{parentName:"p"},"(status.DesiredNumberScheduled - partition)")," \u6570\u91cf\u7684 Pod \u66f4\u65b0\u5230\u6700\u65b0\u7248\u672c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      partition: 10\n")),(0,l.kt)("p",null,"\u53e6\u5916\u5982\u679c\u4f60\u5728 Advanced DaemonSet \u4e2d\u5b9a\u4e49\u4e86 ",(0,l.kt)("inlineCode",{parentName:"p"},'daemonset.kruise.io/progressive-create-pod: "true"')," annotation\uff0c\n",(0,l.kt)("inlineCode",{parentName:"p"},"partition")," \u540c\u6837\u4f1a\u5728\u6269\u5bb9\u7684\u65f6\u5019\u63a7\u5236\u521b\u5efa\u51fa\u6765 Pod \u7684\u6570\u91cf\u3002"),(0,l.kt)("h3",{id:"\u6682\u505c\u5347\u7ea7"},"\u6682\u505c\u5347\u7ea7"),(0,l.kt)("p",null,"\u7528\u6237\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e paused \u4e3a true \u6682\u505c\u53d1\u5e03\uff0c\u4e0d\u8fc7\u63a7\u5236\u5668\u8fd8\u662f\u4f1a\u505a replicas \u6570\u91cf\u7ba1\u7406\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n")),(0,l.kt)("h3",{id:"\u5347\u7ea7\u955c\u50cf\u81ea\u52a8\u9884\u70ed"},"\u5347\u7ea7\u955c\u50cf\u81ea\u52a8\u9884\u70ed"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.3.0"),(0,l.kt)("p",null,"\u5982\u679c\u4f60\u5728",(0,l.kt)("a",{parentName:"p",href:"../installation##optional-feature-gate"},"\u5b89\u88c5\u6216\u5347\u7ea7 Kruise")," \u7684\u65f6\u5019\u542f\u7528\u4e86 ",(0,l.kt)("inlineCode",{parentName:"p"},"PreDownloadImageForDaemonSetUpdate")," feature-gate\uff0c\nDaemonSet \u63a7\u5236\u5668\u4f1a\u81ea\u52a8\u5728\u6240\u6709\u65e7\u7248\u672c pod \u6240\u5728 node \u8282\u70b9\u4e0a\u9884\u70ed\u4f60\u6b63\u5728\u7070\u5ea6\u53d1\u5e03\u7684\u65b0\u7248\u672c\u955c\u50cf\u3002 \u8fd9\u5bf9\u4e8e\u5e94\u7528\u53d1\u5e03\u52a0\u901f\u5f88\u6709\u5e2e\u52a9\u3002"),(0,l.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b DaemonSet \u6bcf\u4e2a\u65b0\u955c\u50cf\u9884\u70ed\u65f6\u7684\u5e76\u53d1\u5ea6\u90fd\u662f ",(0,l.kt)("inlineCode",{parentName:"p"},"1"),"\uff0c\u4e5f\u5c31\u662f\u4e00\u4e2a\u4e2a\u8282\u70b9\u62c9\u955c\u50cf\u3002\n\u5982\u679c\u9700\u8981\u8c03\u6574\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7 ",(0,l.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/image-predownload-parallelism")," annotation \u6765\u8bbe\u7f6e\u5e76\u53d1\u5ea6\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n')),(0,l.kt)("h3",{id:"\u751f\u547d\u5468\u671f\u94a9\u5b50"},"\u751f\u547d\u5468\u671f\u94a9\u5b50"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.1.0"),(0,l.kt)("p",null,"\u4e0e ",(0,l.kt)("a",{parentName:"p",href:"./cloneset#lifecycle-hook"},"CloneSet \u63d0\u4f9b\u7684\u751f\u547d\u5468\u671f\u94a9\u5b50")," \u80fd\u529b\u76f8\u4f3c\u3002"),(0,l.kt)("p",null,"\u76ee\u524d Advanced DaemonSet \u53ea\u652f\u6301 PreDelete hook\uff0c\u5b83\u5141\u8bb8\u7528\u6237\u5728 daemon Pod \u88ab\u5220\u9664\u524d\u6267\u884c\u4e00\u4e9b\u81ea\u5b9a\u4e49\u7684\u903b\u8f91\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-go"},'type LifecycleStateType string\n\n// Lifecycle contains the hooks for Pod lifecycle.\ntype Lifecycle struct {\n    // PreDelete is the hook before Pod to be deleted.\n    PreDelete *LifecycleHook `json:"preDelete,omitempty"`\n}\n\ntype LifecycleHook struct {\n    LabelsHandler     map[string]string `json:"labelsHandler,omitempty"`\n    FinalizersHandler []string          `json:"finalizersHandler,omitempty"`\n\n    /**********************  FEATURE STATE: 1.2.0 ************************/\n    // MarkPodNotReady = true means:\n    // - Pod will be set to \'NotReady\' at preparingDelete/preparingUpdate state.\n    // - Pod will be restored to \'Ready\' at Updated state if it was set to \'NotReady\' at preparingUpdate state.\n    // Default to false.\n    MarkPodNotReady bool `json:"markPodNotReady,omitempty"`\n    /*********************************************************************/\n}\n')),(0,l.kt)("p",null,"\u4f8b\u5982:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n\n  # define with label\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n')),(0,l.kt)("p",null,"\u5f53 DaemonSet \u5220\u9664\u4e00\u4e2a Pod \u65f6\uff08\u5305\u62ec\u7f29\u5bb9\u548c\u91cd\u5efa\u5347\u7ea7\uff09\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5982\u679c\u6ca1\u6709\u5b9a\u4e49 lifecycle hook \u6216\u8005 Pod \u4e0d\u7b26\u5408 preDelete \u6761\u4ef6\uff0c\u5219\u76f4\u63a5\u5220\u9664"),(0,l.kt)("li",{parentName:"ul"},"\u5426\u5219\uff0c\u4f1a\u5148\u5c06 Pod \u66f4\u65b0\u4e3a ",(0,l.kt)("inlineCode",{parentName:"li"},"PreparingDelete")," \u72b6\u6001\uff0c\u5e76\u7b49\u5f85\u7528\u6237\u7684 controller \u5c06 Pod \u4e2d\u5173\u8054\u7684 label/finalizer \u53bb\u9664\uff0c\u518d\u6267\u884c Pod \u5220\u9664")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    example.io/block-deleting: "true"                   # the pod is hooked by PreDelete hook label\n    lifecycle.apps.kruise.io/state: PreparingDelete     # so we update it to `PreparingDelete` state and wait for user controller to do something and remove the label\n')),(0,l.kt)("h4",{id:"\u5220\u9664-pod-\u524d\u5c06\u5176\u7f6e\u4e3a-notready"},"\u5220\u9664 Pod \u524d\u5c06\u5176\u7f6e\u4e3a NotReady"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.2.0"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},"  lifecycle:\n    preDelete:\n      markPodNotReady: true\n      finalizersHandler:\n      - example.io/unready-blocker\n")),(0,l.kt)("p",null,"\u5982\u679c\u8bbe\u7f6e ",(0,l.kt)("inlineCode",{parentName:"p"},"preDelete.markPodNotReady=true"),", Kruise \u5c06\u4f1a\u5728 Pod \u8fdb\u5165 ",(0,l.kt)("inlineCode",{parentName:"p"},"PreparingDelete")," \u72b6\u6001\u65f6\uff0c\u5c06 ",(0,l.kt)("inlineCode",{parentName:"p"},"KruisePodReady")," \u8fd9\u4e2a Pod Condition \u8bbe\u7f6e\u4e3a ",(0,l.kt)("inlineCode",{parentName:"p"},"False"),", Pod \u5c06\u53d8\u4e3a ",(0,l.kt)("strong",{parentName:"p"},"NotReady"),"\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u7528\u6237\u53ef\u4ee5\u5229\u7528\u8fd9\u4e00\u7279\u6027\uff0c\u5728\u5bb9\u5668\u771f\u6b63\u88ab\u505c\u6b62\u4e4b\u524d\u5c06 Pod \u4e0a\u7684\u6d41\u91cf\u5148\u884c\u6392\u9664\uff0c\u9632\u6b62\u6d41\u91cf\u635f\u5931\u3002")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"\u6ce8\u610f: \u8be5\u7279\u6027\u4ec5\u5728 Pod \u88ab\u6ce8\u5165 ",(0,l.kt)("inlineCode",{parentName:"em"},"KruisePodReady")," \u8fd9\u4e2a ReadinessGate \u65f6\u751f\u6548\u3002")),(0,l.kt)("h4",{id:"\u7528\u6237-controller-\u903b\u8f91\u793a\u4f8b"},"\u7528\u6237 controller \u903b\u8f91\u793a\u4f8b"),(0,l.kt)("p",null,"\u4e0e\u4e0a\u8ff0 yaml \u4f8b\u5b50\u7c7b\u4f3c\uff0c\u6211\u4eec\u9700\u8981\u5148\u5c06 ",(0,l.kt)("inlineCode",{parentName:"p"},"example.io/block-deleting")," label \u5b9a\u4e49\u5728 Advanced DaemonSet \u7684 template \u548c lifecycle \u4e2d\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: DaemonSet\nspec:\n  template:\n    metadata:\n      labels:\n        example.io/block-deleting: "true"\n  # ...\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        example.io/block-deleting: "true"\n')),(0,l.kt)("p",null,"\u7528\u6237\u81ea\u5b9a\u4e49 controller \u7684\u6267\u884c\u903b\u8f91:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5f53\u53d1\u73b0 Pod \u8fdb\u5165 ",(0,l.kt)("inlineCode",{parentName:"li"},"PreparingDelete")," \u72b6\u6001\uff0c\u68c0\u67e5\u5b83\u7684\u8282\u70b9\u662f\u5426\u5b58\u5728\uff0c\u5e76\u6267\u884c\u4e00\u4e9b\u5904\u7406\u903b\u8f91\uff08\u4f8b\u5982\u8d44\u6e90\u9884\u7559\u7b49\uff09\uff0c\u6700\u540e\u5c06 Pod \u4e2d\u7684 ",(0,l.kt)("inlineCode",{parentName:"li"},"example.io/block-deleting")," label \u53bb\u6389\u3002")))}c.isMDXComponent=!0}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1617],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return m}});var t=r(7294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function i(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=t.createContext({}),l=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):i(i({},n),e)),r},u=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=l(r),m=o,k=d["".concat(c,".").concat(m)]||d[m]||p[m]||a;return r?t.createElement(k,i(i({ref:n},u),{},{components:r})):t.createElement(k,i({ref:n},u))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var l=2;l<a;l++)i[l]=r[l];return t.createElement.apply(null,i)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7689:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return u},default:function(){return d}});var t=r(3117),o=r(102),a=(r(7294),r(3905)),i=["components"],s={title:"\u7cfb\u7edf\u67b6\u6784"},c=void 0,l={unversionedId:"core-concepts/architecture",id:"core-concepts/architecture",title:"\u7cfb\u7edf\u67b6\u6784",description:"OpenKruise \u7684\u6574\u4f53\u67b6\u6784\u5982\u4e0b:",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/core-concepts/architecture.md",sourceDirName:"core-concepts",slug:"/core-concepts/architecture",permalink:"/zh/docs/next/core-concepts/architecture",editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/core-concepts/architecture.md",tags:[],version:"current",lastUpdatedBy:"FillZpp",lastUpdatedAt:1632468169,formattedLastUpdatedAt:"2021/9/24",frontMatter:{title:"\u7cfb\u7edf\u67b6\u6784"},sidebar:"docs",previous:{title:"\u5b89\u88c5",permalink:"/zh/docs/next/installation"},next:{title:"\u539f\u5730\u5347\u7ea7",permalink:"/zh/docs/next/core-concepts/inplace-update"}},u=[{value:"API",id:"api",children:[],level:2},{value:"Manager",id:"manager",children:[],level:2},{value:"Daemon",id:"daemon",children:[],level:2}],p={toc:u};function d(e){var n=e.components,s=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,t.Z)({},p,s,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"OpenKruise \u7684\u6574\u4f53\u67b6\u6784\u5982\u4e0b:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"alt",src:r(6579).Z})),(0,a.kt)("h2",{id:"api"},"API"),(0,a.kt)("p",null,"\u6240\u6709 OpenKruise \u7684\u529f\u80fd\u90fd\u662f\u901a\u8fc7 ",(0,a.kt)("strong",{parentName:"p"},"Kubernetes API")," \u6765\u63d0\u4f9b, \u6bd4\u5982\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u65b0\u7684 CRD \u5b9a\u4e49\uff0c\u6bd4\u5982")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell",metastring:"script",script:!0},"$ kubectl get crd | grep kruise.io\nadvancedcronjobs.apps.kruise.io            2021-09-16T06:02:36Z\nbroadcastjobs.apps.kruise.io               2021-09-16T06:02:36Z\nclonesets.apps.kruise.io                   2021-09-16T06:02:36Z\ncontainerrecreaterequests.apps.kruise.io   2021-09-16T06:02:36Z\ndaemonsets.apps.kruise.io                  2021-09-16T06:02:36Z\nimagepulljobs.apps.kruise.io               2021-09-16T06:02:36Z\nnodeimages.apps.kruise.io                  2021-09-16T06:02:36Z\npodunavailablebudgets.policy.kruise.io     2021-09-16T06:02:36Z\nresourcedistributions.apps.kruise.io       2021-09-16T06:02:36Z\nsidecarsets.apps.kruise.io                 2021-09-16T06:02:36Z\nstatefulsets.apps.kruise.io                2021-09-16T06:02:36Z\nuniteddeployments.apps.kruise.io           2021-09-16T06:02:37Z\nworkloadspreads.apps.kruise.io             2021-09-16T06:02:37Z\n# ...\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8d44\u6e90\u5bf9\u8c61\u4e2d\u7684\u7279\u5b9a\u6807\u8bc6\uff08labels, annotations, envs \u7b49\uff09\uff0c\u6bd4\u5982")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\nkind: Namespace\nmetadata:\n  labels:\n    # \u4fdd\u62a4\u8fd9\u4e2a namespace \u4e0b\u7684 Pod \u4e0d\u88ab\u6574\u4e2a ns \u7ea7\u8054\u5220\u9664\n    policy.kruise.io/delete-protection: Cascading\n")),(0,a.kt)("h2",{id:"manager"},"Manager"),(0,a.kt)("p",null,"Kruise-manager \u662f\u4e00\u4e2a\u8fd0\u884c controller \u548c webhook \u4e2d\u5fc3\u7ec4\u4ef6\uff0c\u5b83\u901a\u8fc7 Deployment \u90e8\u7f72\u5728 ",(0,a.kt)("inlineCode",{parentName:"p"},"kruise-system")," \u547d\u540d\u7a7a\u95f4\u4e2d\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get deploy -n kruise-system\nNAME                        READY   UP-TO-DATE   AVAILABLE   AGE\nkruise-controller-manager   2/2     2            2           4h6m\n\n$ kubectl get pod -n kruise-system -l control-plane=controller-manager\nNAME                                         READY   STATUS    RESTARTS   AGE\nkruise-controller-manager-68dc6d87cc-k9vg8   1/1     Running   0          4h6m\nkruise-controller-manager-68dc6d87cc-w7x82   1/1     Running   0          4h6m\n")),(0,a.kt)("p",null,"\u903b\u8f91\u4e0a\u6765\u8bf4\uff0c\u5982 cloneset-controller/sidecarset-controller \u8fd9\u4e9b\u7684 controller \u90fd\u662f\u72ec\u7acb\u8fd0\u884c\u7684\u3002\u4e0d\u8fc7\u4e3a\u4e86\u51cf\u5c11\u590d\u6742\u5ea6\uff0c\u5b83\u4eec\u90fd\u88ab\u6253\u5305\u5728\u4e00\u4e2a\u72ec\u7acb\u7684\u4e8c\u8fdb\u5236\u6587\u4ef6\u3001\u5e76\u8fd0\u884c\u5728 ",(0,a.kt)("inlineCode",{parentName:"p"},"kruise-controller-manager-xxx")," \u8fd9\u4e2a Pod \u4e2d\u3002"),(0,a.kt)("p",null,"\u9664\u4e86 controller \u4e4b\u5916\uff0c",(0,a.kt)("inlineCode",{parentName:"p"},"kruise-controller-manager-xxx")," \u4e2d\u8fd8\u5305\u542b\u4e86\u9488\u5bf9 Kruise CRD \u4ee5\u53ca Pod \u8d44\u6e90\u7684 admission webhook\u3002Kruise-manager \u4f1a\u521b\u5efa\u4e00\u4e9b webhook configurations \u6765\u914d\u7f6e\u54ea\u4e9b\u8d44\u6e90\u9700\u8981\u611f\u77e5\u5904\u7406\u3001\u4ee5\u53ca\u63d0\u4f9b\u4e00\u4e2a Service \u6765\u7ed9 kube-apiserver \u8c03\u7528\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get svc -n kruise-system\nNAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\nkruise-webhook-service   ClusterIP   172.24.9.234   <none>        443/TCP   4h9m\n")),(0,a.kt)("p",null,"\u4e0a\u8ff0\u7684 ",(0,a.kt)("inlineCode",{parentName:"p"},"kruise-webhook-service")," \u975e\u5e38\u91cd\u8981\uff0c\u662f\u63d0\u4f9b\u7ed9 kube-apiserver \u8c03\u7528\u7684\u3002"),(0,a.kt)("h2",{id:"daemon"},"Daemon"),(0,a.kt)("p",null,"\u8fd9\u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684\u4e00\u4e2a\u65b0\u7684 daemon \u7ec4\u4ef6\u3002"),(0,a.kt)("p",null,"\u5b83\u901a\u8fc7 DaemonSet \u90e8\u7f72\u5230\u6bcf\u4e2a Node \u8282\u70b9\u4e0a\uff0c\u63d0\u4f9b\u955c\u50cf\u9884\u70ed\u3001\u5bb9\u5668\u91cd\u542f\u7b49\u529f\u80fd\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get pod -n kruise-system -l control-plane=daemon\nNAME                  READY   STATUS    RESTARTS   AGE\nkruise-daemon-6hw6d   1/1     Running   0          4h7m\nkruise-daemon-d7xr4   1/1     Running   0          4h7m\nkruise-daemon-dqp8z   1/1     Running   0          4h7m\nkruise-daemon-dv96r   1/1     Running   0          4h7m\nkruise-daemon-q7594   1/1     Running   0          4h7m\nkruise-daemon-vnsbw   1/1     Running   0          4h7m\n")))}d.isMDXComponent=!0},6579:function(e,n,r){n.Z="https://cdn.jsdelivr.net/gh/openkruise/openkruise.io@gh-pages"+r.p+"assets/images/architecture-f8bf37df4aa3c2ea2f2485904eb85e5f.png"}}]);
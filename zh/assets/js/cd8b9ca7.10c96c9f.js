"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1172],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=p(n),d=l,g=c["".concat(s,".").concat(d)]||c[d]||m[d]||o;return n?a.createElement(g,r(r({ref:t},u),{},{components:n})):a.createElement(g,r({ref:t},u))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var o=n.length,r=new Array(o);r[0]=c;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:l,r[1]=i;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},7284:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return i},metadata:function(){return p},toc:function(){return m}});var a=n(7462),l=n(3366),o=(n(7294),n(3905)),r=["components"],i={title:"ImagePullJob"},s=void 0,p={unversionedId:"user-manuals/imagepulljob",id:"version-v1.6/user-manuals/imagepulljob",title:"ImagePullJob",description:"NodeImage \u548c ImagePullJob \u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684 CRD\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.6/user-manuals/imagepulljob.md",sourceDirName:"user-manuals",slug:"/user-manuals/imagepulljob",permalink:"/zh/docs/v1.6/user-manuals/imagepulljob",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/imagepulljob.md",tags:[],version:"v1.6",lastUpdatedBy:"berg",lastUpdatedAt:1711105168,formattedLastUpdatedAt:"2024/3/22",frontMatter:{title:"ImagePullJob"},sidebar:"docs",previous:{title:"Container Restart",permalink:"/zh/docs/v1.6/user-manuals/containerrecreaterequest"},next:{title:"ResourceDistribution",permalink:"/zh/docs/v1.6/user-manuals/resourcedistribution"}},u={},m=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"ImagePullJob (high-level)",id:"imagepulljob-high-level",level:2},{value:"\u914d\u7f6e secrets",id:"\u914d\u7f6e-secrets",level:3},{value:"Attach metadata into cri interface",id:"attach-metadata-into-cri-interface",level:3},{value:"\u955c\u50cf\u62c9\u53d6\u652f\u6301 &#39;Always&#39; \u7b56\u7565",id:"\u955c\u50cf\u62c9\u53d6\u652f\u6301-always-\u7b56\u7565",level:3},{value:"ImageListPullJob",id:"imagelistpulljob",level:2},{value:"NodeImage (low-level)",id:"nodeimage-low-level",level:2}],c={toc:m};function d(e){var t=e.components,i=(0,l.Z)(e,r);return(0,o.kt)("wrapper",(0,a.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"NodeImage \u548c ImagePullJob \u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684 CRD\u3002"),(0,o.kt)("p",null,"Kruise \u4f1a\u81ea\u52a8\u4e3a\u6bcf\u4e2a Node \u521b\u5efa\u4e00\u4e2a NodeImage\uff0c\u5b83\u5305\u542b\u4e86\u54ea\u4e9b\u955c\u50cf\u9700\u8981\u5728\u8fd9\u4e2a Node \u4e0a\u505a\u9884\u70ed\u3002"),(0,o.kt)("p",null,"\u7528\u6237\u80fd\u521b\u5efa ImagePullJob \u5bf9\u8c61\uff0c\u6765\u6307\u5b9a\u4e00\u4e2a\u955c\u50cf\u8981\u5728\u54ea\u4e9b Node \u4e0a\u505a\u9884\u70ed\u3002"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Image Pulling",src:n(2587).Z,width:"3053",height:"1653"})),(0,o.kt)("p",null,"\u6ce8\u610f\uff0cNodeImage \u662f\u4e00\u4e2a",(0,o.kt)("strong",{parentName:"p"},"\u504f\u5e95\u5c42\u7684 API"),"\uff0c\u4e00\u822c\u53ea\u5728\u4f60\u8981\u660e\u786e\u5728\u67d0\u4e00\u4e2a\u8282\u70b9\u4e0a\u505a\u4e00\u6b21\u9884\u70ed\u7684\u65f6\u5019\u624d\u4f7f\u7528\uff0c\u5426\u5219\u4f60\u90fd\u5e94\u8be5",(0,o.kt)("strong",{parentName:"p"},"\u4f7f\u7528 ImagePullJob \u6765\u6307\u5b9a\u67d0\u4e2a\u955c\u50cf\u5728\u4e00\u6279\u8282\u70b9\u4e0a\u505a\u9884\u70ed"),"\u3002"),(0,o.kt)("h2",{id:"feature-gate"},"Feature-gate"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u4ecekruise v1.5.0"),"\u7248\u672c\u5f00\u59cb\uff0cImagePullJob/ImageListPullJob \u529f\u80fd\u9ed8\u8ba4\u5173\u95ed\uff0c\u4ee5\u964d\u4f4e\u9ed8\u8ba4\u5b89\u88c5\u7684\u6743\u9650\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7 feature-gate ",(0,o.kt)("em",{parentName:"p"},"ImagePullJobGate")," \u6765\u5f00\u542f\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install/upgrade kruise https://... --set featureGates="ImagePullJobGate=true"\n')),(0,o.kt)("h2",{id:"imagepulljob-high-level"},"ImagePullJob (high-level)"),(0,o.kt)("p",null,"ImagePullJob \u662f\u4e00\u4e2a ",(0,o.kt)("strong",{parentName:"p"},"namespaced-scope")," \u7684\u8d44\u6e90\u3002"),(0,o.kt)("p",null,"API \u5b9a\u4e49: ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go"},"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nmetadata:\n  name: job-with-always\nspec:\n  image: nginx:1.9.1   # [required] \u5b8c\u6574\u7684\u955c\u50cf\u540d name:tag\n  parallelism: 10      # [optional] \u6700\u5927\u5e76\u53d1\u62c9\u53d6\u7684\u8282\u70b9\u68b3\u7406, \u9ed8\u8ba4\u4e3a 1\n  selector:            # [optional] \u6307\u5b9a\u8282\u70b9\u7684 \u540d\u5b57\u5217\u8868 \u6216 \u6807\u7b7e\u9009\u62e9\u5668 (\u53ea\u80fd\u8bbe\u7f6e\u5176\u4e2d\u4e00\u79cd)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n# podSelector:         # [optional] \u901a\u8fc7 podSelector \u5339\u914dPod\uff0c\u5728\u8fd9\u4e9b Pod \u6240\u5728\u8282\u70b9\u4e0a\u62c9\u53d6\u955c\u50cf, \u4e0e selector \u4e0d\u80fd\u540c\u65f6\u8bbe\u7f6e.\n#   matchLabels:\n#     pod-label: xxx\n#   matchExpressions:\n#   - key: pod-label\n#      operator: In\n#        values:\n#        - xxx\n  completionPolicy:\n    type: Always                  # [optional] \u9ed8\u8ba4\u4e3a Always\n    activeDeadlineSeconds: 1200   # [optional] \u65e0\u9ed8\u8ba4\u503c, \u53ea\u5bf9 Always \u7c7b\u578b\u751f\u6548\n    ttlSecondsAfterFinished: 300  # [optional] \u65e0\u9ed8\u8ba4\u503c, \u53ea\u5bf9 Always \u7c7b\u578b\u751f\u6548\n  pullPolicy:                     # [optional] \u9ed8\u8ba4 backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n")),(0,o.kt)("p",null,"\u4f60\u53ef\u4ee5\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"selector")," \u5b57\u6bb5\u4e2d\u6307\u5b9a\u8282\u70b9\u7684 \u540d\u5b57\u5217\u8868 \u6216 \u6807\u7b7e\u9009\u62e9\u5668 ",(0,o.kt)("strong",{parentName:"p"},"(\u53ea\u80fd\u8bbe\u7f6e\u5176\u4e2d\u4e00\u79cd)"),"\uff0c\u5982\u679c\u6ca1\u6709\u8bbe\u7f6e ",(0,o.kt)("inlineCode",{parentName:"p"},"selector")," \u5219\u4f1a\u9009\u62e9\u6240\u6709\u8282\u70b9\u505a\u9884\u70ed\u3002"),(0,o.kt)("p",null,"\u6216\u8005\u4f60\u53ef\u4ee5\u914d\u7f6e ",(0,o.kt)("inlineCode",{parentName:"p"},"podSelector")," \u6765\u5728\u8fd9\u4e9b pod \u6240\u5728\u8282\u70b9\u4e0a\u62c9\u53d6\u955c\u50cf\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"podSelector")," \u4e0e ",(0,o.kt)("inlineCode",{parentName:"p"},"selector")," \u4e0d\u80fd\u540c\u65f6\u8bbe\u7f6e\u3002"),(0,o.kt)("p",null,"\u540c\u65f6\uff0cImagePullJob \u6709\u4e24\u79cd completionPolicy \u7c7b\u578b:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"Always")," \u8868\u793a\u8fd9\u4e2a job \u662f\u4e00\u6b21\u6027\u9884\u70ed\uff0c\u4e0d\u7ba1\u6210\u529f\u3001\u5931\u8d25\u90fd\u4f1a\u7ed3\u675f",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"activeDeadlineSeconds"),": \u6574\u4e2a job \u7684 deadline \u7ed3\u675f\u65f6\u95f4"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"ttlSecondsAfterFinished"),": \u7ed3\u675f\u540e\u8d85\u8fc7\u8fd9\u4e2a\u65f6\u95f4\uff0c\u81ea\u52a8\u6e05\u7406\u5220\u9664 job"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"Never")," \u8868\u793a\u8fd9\u4e2a job \u662f\u957f\u671f\u8fd0\u884c\u3001\u4e0d\u4f1a\u7ed3\u675f\uff0c\u5e76\u4e14\u4f1a\u6bcf\u5929\u90fd\u4f1a\u5728\u5339\u914d\u7684\u8282\u70b9\u4e0a\u91cd\u65b0\u9884\u70ed\u4e00\u6b21\u6307\u5b9a\u7684\u955c\u50cf")),(0,o.kt)("h3",{id:"\u914d\u7f6e-secrets"},"\u914d\u7f6e secrets"),(0,o.kt)("p",null,"\u5982\u679c\u8fd9\u4e2a\u955c\u50cf\u6765\u81ea\u4e00\u4e2a\u79c1\u6709\u4ed3\u5e93\uff0c\u4f60\u53ef\u80fd\u9700\u8981\u914d\u7f6e\u4e00\u4e9b secret\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"# ...\nspec:\n  pullSecrets:\n  - secret-name1\n  - secret-name2\n")),(0,o.kt)("p",null,"\u56e0\u4e3a ImagePullJob \u662f\u4e00\u79cd namespaced-scope \u8d44\u6e90\uff0c\u8fd9\u4e9b secret \u5fc5\u987b\u5b58\u5728 ImagePullJob \u6240\u5728\u7684 namespace \u4e2d\u3002\n\u7136\u540e\u4f60\u53ea\u9700\u8981\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"pullSecrets")," \u5b57\u6bb5\u4e2d\u5199\u4e0a\u8fd9\u4e9b secret \u7684\u540d\u5b57\u5373\u53ef\u3002"),(0,o.kt)("h3",{id:"attach-metadata-into-cri-interface"},"Attach metadata into cri interface"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.4.0"),(0,o.kt)("p",null,"\u5f53 Kubelet \u521b\u5efa Pod \u65f6\uff0cKubelet \u5c06\u4f1a attach metadata \u5230 container runtime cri \u63a5\u53e3\u3002OpenKruise \u955c\u50cf\u9884\u70ed\u540c\u6837\u652f\u6301\u7c7b\u4f3c\u7684\u80fd\u529b\uff0c\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  sandboxConfig:\n    annotations:\n      io.kubernetes.image.metrics.tags: "cluster=cn-shanghai"\n    labels:\n      io.kubernetes.image.app: "foo"\n')),(0,o.kt)("h3",{id:"\u955c\u50cf\u62c9\u53d6\u652f\u6301-always-\u7b56\u7565"},"\u955c\u50cf\u62c9\u53d6\u652f\u6301 'Always' \u7b56\u7565"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.6.0"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"spec.imagePullPolicy=Always")," \u8868\u793a kruise \u6bcf\u6b21\u90fd\u4f1a\u5c1d\u8bd5\u62c9\u53d6\u6700\u65b0\u7684\u955c\u50cf\uff0c\u54ea\u6015\u955c\u50cf\u540d\u5b57\u6ca1\u6709\u6539\u53d8"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"spec.imagePullPolicy=IfNotPresent")," \u8868\u793a kruise \u53ea\u6709\u955c\u50cf\u5728Node\u673a\u5668\u4e0d\u5b58\u5728\u65f6\uff0c\u624d\u4f1a\u62c9\u53d6\u955c\u50cf"),(0,o.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u7b56\u7565\u662f IfNotPresent")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  imagePullPolicy: Always | IfNotPresent\n")),(0,o.kt)("h2",{id:"imagelistpulljob"},"ImageListPullJob"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.5.0"),(0,o.kt)("p",null,"ImagePullJob \u4ec5\u4ec5\u80fd\u652f\u6301\u5355\u4e2a\u955c\u50cf\u7684\u9884\u70ed\uff0c\u4e3a\u4e86\u6ee1\u8db3\u591a\u4e2a\u955c\u50cf\u7684\u9884\u70ed\u9700\u6c42\uff0c\u65b0\u589e\u52a0 CRD ImageListPullJob \u6765\u6ee1\u8db3\u591a\u4e2a\u955c\u50cf\u7684\u9884\u70ed\uff0c\u9664\u4e86 images \u5b83\u7684\u5927\u90e8\u5206\u5b57\u6bb5\u4e0e ImagePullJob \u76f8\u540c\uff0c\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: ImageListPullJob\nmetadata:\n  name: job-with-always\nspec:\n  images:\n  - nginx:1.9.1   # [required] image to pull\n  - busybox:1.29.2\n  - ...\n  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1\n  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n  completionPolicy:\n    type: Always                  # [optional] defaults to Always\n    activeDeadlineSeconds: 1200   # [optional] no default, only work for Always type\n    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Always type\n  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n")),(0,o.kt)("h2",{id:"nodeimage-low-level"},"NodeImage (low-level)"),(0,o.kt)("p",null,"NodeImage \u662f\u4e00\u4e2a ",(0,o.kt)("strong",{parentName:"p"},"cluster-scope")," \u7684\u8d44\u6e90\u3002"),(0,o.kt)("p",null,"API \u5b9a\u4e49: ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go"},"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go")),(0,o.kt)("p",null,"\u5f53 Kruise \u88ab\u5b89\u88c5\u540e\uff0cnodeimage-controller \u4f1a\u81ea\u52a8\u4e3a\u6bcf\u4e2a Node \u521b\u5efa\u4e00\u4e2a\u540c\u540d\u7684 NodeImage\u3002\n\u5e76\u4e14\u5f53 Node \u53d1\u751f\u4f38\u7f29\u65f6\uff0cnodeimage-controller \u4e5f\u4f1a\u5bf9\u5e94\u7684\u521b\u5efa\u6216\u5220\u9664 NodeImage\u3002"),(0,o.kt)("p",null,"\u9664\u6b64\u4e4b\u5916\uff0cnodeimage-controller \u4e5f\u4f1a\u5c06 Node \u4e0a\u7684 labels \u6807\u7b7e\u6301\u7eed\u540c\u6b65\u5230 NodeImage \u4e0a\u9762\uff0c\u56e0\u6b64\u5bf9\u5e94\u7684 NodeImage \u4e0e Node \u62e5\u6709\u76f8\u540c\u7684\u540d\u5b57\u548c\u6807\u7b7e\u3002\n\u7528\u6237\u53ef\u4ee5\u7528 Node \u540d\u5b57\u6765\u67e5\u8be2\u4e00\u4e2a NodeImage\uff0c\u6216\u8005\u7528 Node labels \u505a selector \u6765\u67e5\u8be2\u4e00\u6279 NodeImage\u3002"),(0,o.kt)("p",null,"\u901a\u5e38\u6765\u8bf4\u4e00\u4e2a\u7a7a\u7684 NodeImage \u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: NodeImage\nmetadata:\n  labels:\n    kubernetes.io/arch: amd64\n    kubernetes.io/os: linux\n    # ...\n  name: node-xxx\n  # ...\nspec: {}\nstatus:\n  desired: 0\n  failed: 0\n  pulling: 0\n  succeeded: 0\n")),(0,o.kt)("p",null,"\u5982\u679c\u4f60\u5e0c\u671b\u5728\u8fd9\u4e2a\u8282\u70b9\u4e0a\u62c9\u53bb\u4e00\u4e2a ",(0,o.kt)("inlineCode",{parentName:"p"},"ubuntu:latest")," \u955c\u50cf\uff0c\u4f60\u53ef\u4ee5\u6709\u4e24\u79cd\u65b9\u5f0f"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u6267\u884c ",(0,o.kt)("inlineCode",{parentName:"li"},"kubectl edit nodeimage node-xxx")," \u5e76\u5c06\u4ee5\u4e0b\u5199\u5165\u5176\u4e2d\uff08\u5ffd\u7565\u6ce8\u91ca\uff09:")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"# ...\nspec:\n  images:\n    ubuntu:  # \u955c\u50cf name\n      tags:\n      - tag: latest  # \u955c\u50cf tag\n        pullPolicy:\n          ttlSecondsAfterFinished: 300  # [required] \u62c9\u53d6\u5b8c\u6210\uff08\u6210\u529f\u6216\u5931\u8d25\uff09\u8d85\u8fc7 300s \u540e\uff0c\u5c06\u8fd9\u4e2a\u4efb\u52a1\u4ece NodeImage \u4e2d\u6e05\u9664\n          timeoutSeconds: 600           # [optional] \u6bcf\u4e00\u6b21\u62c9\u53d6\u7684\u8d85\u65f6\u65f6\u95f4, \u9ed8\u8ba4\u4e3a 600\n          backoffLimit: 3               # [optional] \u62c9\u53d6\u7684\u91cd\u8bd5\u6b21\u6570\uff0c\u9ed8\u8ba4\u4e3a 3\n          activeDeadlineSeconds: 1200   # [optional] \u6574\u4e2a\u4efb\u52a1\u7684\u8d85\u65f6\u65f6\u95f4\uff0c\u65e0\u9ed8\u8ba4\u503c\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("inlineCode",{parentName:"li"},'kubectl patch nodeimage node-xxx --type=merge -p \'{"spec":{"images":{"ubuntu":{"tags":[{"tag":"latest","pullPolicy":{"ttlSecondsAfterFinished":300}}]}}}}\''))),(0,o.kt)("p",null,"\u4f60\u53ef\u4ee5\u6267\u884c ",(0,o.kt)("inlineCode",{parentName:"p"},"kubectl get nodeimage node-xxx -o yaml"),"\uff0c\u4ece status \u4e2d\u770b\u5230\u62c9\u53d6\u8fdb\u5ea6\u4ee5\u53ca\u7ed3\u679c\uff0c\u5e76\u4e14\u4f60\u4f1a\u53d1\u73b0\u62c9\u53d6\u5b8c\u6210 600s \u540e\u4efb\u52a1\u4f1a\u88ab\u6e05\u9664\u3002"))}d.isMDXComponent=!0},2587:function(e,t,n){t.Z=n.p+"assets/images/imagepulling-1963144d8f1b12d5603c3606585a0b00.png"}}]);
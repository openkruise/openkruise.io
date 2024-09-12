"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5892],{3905:function(e,a,n){n.d(a,{Zo:function(){return d},kt:function(){return m}});var t=n(67294);function r(e,a,n){return a in e?Object.defineProperty(e,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[a]=n,e}function o(e,a){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?o(Object(n),!0).forEach((function(a){r(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(n,a))}))}return e}function p(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=t.createContext({}),s=function(e){var a=t.useContext(i),n=a;return e&&(n="function"==typeof e?e(a):l(l({},a),e)),n},d=function(e){var a=s(e.components);return t.createElement(i.Provider,{value:a},e.children)},u={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},k=t.forwardRef((function(e,a){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),k=s(n),m=r,c=k["".concat(i,".").concat(m)]||k[m]||u[m]||o;return n?t.createElement(c,l(l({ref:a},d),{},{components:n})):t.createElement(c,l({ref:a},d))}));function m(e,a){var n=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=k;var p={};for(var i in a)hasOwnProperty.call(a,i)&&(p[i]=a[i]);p.originalType=e,p.mdxType="string"==typeof e?e:r,l[1]=p;for(var s=2;s<o;s++)l[s]=n[s];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}k.displayName="MDXCreateElement"},46662:function(e,a,n){n.r(a),n.d(a,{assets:function(){return d},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return p},metadata:function(){return s},toc:function(){return u}});var t=n(87462),r=n(63366),o=(n(67294),n(3905)),l=["components"],p={title:"WorkloadSpread"},i=void 0,s={unversionedId:"user-manuals/workloadspread",id:"version-v1.7/user-manuals/workloadspread",title:"WorkloadSpread",description:"FEATURE STATE: Kruise v0.10.0",source:"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/user-manuals/workloadspread.md",sourceDirName:"user-manuals",slug:"/user-manuals/workloadspread",permalink:"/zh/docs/user-manuals/workloadspread",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/workloadspread.md",tags:[],version:"v1.7",lastUpdatedBy:"Ai Ranthem",lastUpdatedAt:1726143420,formattedLastUpdatedAt:"2024/9/12",frontMatter:{title:"WorkloadSpread"},sidebar:"docs",previous:{title:"Container Launch Priority",permalink:"/zh/docs/user-manuals/containerlaunchpriority"},next:{title:"UnitedDeployment",permalink:"/zh/docs/user-manuals/uniteddeployment"}},d={},u=[{value:"Demo",id:"demo",level:2},{value:"subsets",id:"subsets",level:2},{value:"sub-fields",id:"sub-fields",level:3},{value:"\u8c03\u5ea6\u7b56\u7565",id:"\u8c03\u5ea6\u7b56\u7565",level:2},{value:"\u914d\u7f6e\u8981\u6c42",id:"\u914d\u7f6e\u8981\u6c42",level:2},{value:"Pod Webhook",id:"pod-webhook",level:3},{value:"deletion-cost feature",id:"deletion-cost-feature",level:3},{value:"\u6269\u7f29\u5bb9\u987a\u5e8f\uff1a",id:"\u6269\u7f29\u5bb9\u987a\u5e8f",level:2},{value:"\u6269\u5bb9",id:"\u6269\u5bb9",level:3},{value:"\u7f29\u5bb9",id:"\u7f29\u5bb9",level:3},{value:"\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528 WorkloadSpread",id:"\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528-workloadspread",level:2},{value:"\u914d\u7f6e\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u76d1\u542c\u767d\u540d\u5355",id:"\u914d\u7f6e\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u76d1\u542c\u767d\u540d\u5355",level:3},{value:"\u5411 kruise-manager \u6388\u4e88\u6743\u9650",id:"\u5411-kruise-manager-\u6388\u4e88\u6743\u9650",level:3},{value:"\u6307\u5b9a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d",id:"\u6307\u5b9a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d",level:3},{value:"feature-gates",id:"feature-gates",level:2},{value:"\u4f8b\u5b50",id:"\u4f8b\u5b50",level:2},{value:"\u5f39\u6027\u90e8\u7f72",id:"\u5f39\u6027\u90e8\u7f72",level:3},{value:"\u90e8\u7f72\u6548\u679c",id:"\u90e8\u7f72\u6548\u679c",level:4},{value:"\u591a\u57df\u90e8\u7f72",id:"\u591a\u57df\u90e8\u7f72",level:3}],k={toc:u};function m(e){var a=e.components,n=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,t.Z)({},k,n,{components:a,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.10.0"),(0,o.kt)("p",null,"WorkloadSpread\u80fd\u591f\u5c06workload\u7684Pod\u6309\u4e00\u5b9a\u89c4\u5219\u5206\u5e03\u5230\u4e0d\u540c\u7c7b\u578b\u7684Node\u8282\u70b9\u4e0a\uff0c\u8d4b\u4e88\u5355\u4e00workload\u591a\u533a\u57df\u90e8\u7f72\u548c\u5f39\u6027\u90e8\u7f72\u7684\u80fd\u529b\u3002"),(0,o.kt)("p",null,"\u5e38\u89c1\u7684\u4e00\u4e9b\u89c4\u5219\u5305\u62ec\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u6c34\u5e73\u6253\u6563\uff08\u6bd4\u5982\u6309host\u3001az\u7b49\u7ef4\u5ea6\u7684\u5e73\u5747\u6253\u6563\uff09\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u6309\u6307\u5b9a\u6bd4\u4f8b\u6253\u6563\uff08\u6bd4\u5982\u6309\u6bd4\u4f8b\u90e8\u7f72Pod\u5230\u51e0\u4e2a\u6307\u5b9a\u7684 az \u4e2d\uff09\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u5e26\u4f18\u5148\u7ea7\u7684\u5206\u533a\u7ba1\u7406\uff0c\u6bd4\u5982\uff1a",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\u4f18\u5148\u90e8\u7f72\u5230ecs\uff0c\u8d44\u6e90\u4e0d\u8db3\u65f6\u90e8\u7f72\u5230eci\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u4f18\u5148\u90e8\u7f72\u56fa\u5b9a\u6570\u91cf\u4e2apod\u5230ecs\uff0c\u5176\u4f59\u5230eci\u3002"))),(0,o.kt)("li",{parentName:"ul"},"\u5b9a\u5236\u5316\u5206\u533a\u7ba1\u7406\uff0c\u6bd4\u5982\uff1a",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\u63a7\u5236workload\u90e8\u7f72\u4e0d\u540c\u6570\u91cf\u7684Pod\u5230\u4e0d\u540c\u7684cpu\u67b6\u6784\u4e0a\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u786e\u4fdd\u4e0d\u540c\u7684cpu\u67b6\u6784\u4e0a\u7684Pod\u914d\u6709\u4e0d\u540c\u7684\u8d44\u6e90\u914d\u989d\u3002")))),(0,o.kt)("p",null,"WorkloadSpread\u4e0eOpenKruise\u793e\u533a\u7684UnitedDeployment\u529f\u80fd\u76f8\u4f3c\uff0c\u6bcf\u4e00\u4e2aWorkloadSpread\u5b9a\u4e49\u591a\u4e2a\u533a\u57df\uff08\u5b9a\u4e49\u4e3a",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\uff09\uff0c\n\u6bcf\u4e2a",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u5bf9\u5e94\u4e00\u4e2a",(0,o.kt)("inlineCode",{parentName:"p"},"maxReplicas"),"\u6570\u91cf\u3002WorkloadSpread\u5229\u7528Webhook\u6ce8\u5165",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u5b9a\u4e49\u7684\u57df\u4fe1\u606f\uff0c\u540c\u65f6\u63a7\u5236Pod\u7684\u6269\u7f29\u5bb9\u987a\u5e8f\u3002\n\u4e0eUnitedDeployment",(0,o.kt)("strong",{parentName:"p"},"\u4e0d\u540c"),"\u7684\u662f\uff0cUnitedDeployment\u662f\u5e2e\u52a9\u7528\u6237\u521b\u5efa\u5e76\u7ba1\u7406\u591a\u4e2aworkload\uff0cWorkloadSpread\u4ec5\u4f5c\u7528\u5728\u5355\u4e2aworkload\u4e4b\u4e0a\uff0c\u7528\u6237\u63d0\u4f9bworkload\u5373\u53ef\u3002"),(0,o.kt)("p",null,"\u5f53\u524d\u652f\u6301\u7684workload\u7c7b\u578b\uff1a",(0,o.kt)("inlineCode",{parentName:"p"},"Job"),",",(0,o.kt)("inlineCode",{parentName:"p"},"CloneSet"),"\u3001",(0,o.kt)("inlineCode",{parentName:"p"},"Deployment"),"\u3001",(0,o.kt)("inlineCode",{parentName:"p"},"ReplicaSet"),"\u3001",(0,o.kt)("inlineCode",{parentName:"p"},"StatefulSet"),"\u3002"),(0,o.kt)("p",null,"\u6ce8\uff1a",(0,o.kt)("inlineCode",{parentName:"p"},"StatefulSet")," \u4ece Kruise 1.3.0 \u7248\u672c\u5f00\u59cb\u652f\u6301\u3002"),(0,o.kt)("p",null,"\u7279\u522b\u5730\uff0cWorkloadSpread \u5bf9 ",(0,o.kt)("inlineCode",{parentName:"p"},"StatefulSet")," \u53ea\u652f\u6301\u6269\u5bb9\u7ba1\u7406\uff0c\u7f29\u5bb9\u4ecd\u65e7\u4fdd\u7559 StatefulSet \u56fa\u6709\u7684\u7f29\u5bb9\u987a\u5e8f, \u4e14\u6269\u5bb9\u7ba1\u7406\u65f6\u6309\u7167Pod\u5e8f\u53f7\u8fdb\u884c\u5212\u5206 Subset, \u8be6\u60c5\u53ef\u4ee5\u53c2\u7167",(0,o.kt)("a",{parentName:"p",href:"https://github.com/openkruise/kruise/blob/f46097db1fa5a4ed9c002eba050b888344884e11/pkg/util/workloadspread/workloadspread.go#L305"},"\u6ce8\u91ca"),"\u3002"),(0,o.kt)("p",null,"\u4ece Kruise ",(0,o.kt)("inlineCode",{parentName:"p"},"1.5.0")," \u7248\u672c\u5f00\u59cb\uff0cWorkloadSpread \u652f\u6301\u5305\u542b ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource"},"scale sub-resource")," \u7684\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u3002"),(0,o.kt)("h2",{id:"demo"},"Demo"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-demo\nspec:\n  targetRef:\n    apiVersion: apps/v1 | apps.kruise.io/v1alpha1\n    kind: Deployment | CloneSet\n    name: workload-xxx\n  subsets:\n    - name: subset-a\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-a\n      preferredNodeSelectorTerms:\n        - weight: 1\n          preference:\n            matchExpressions:\n              - key: another-node-label-key\n                operator: In\n                values:\n                  - another-node-label-value\n      maxReplicas: 3\n      tolerations: [ ]\n      patch:\n        metadata:\n          labels:\n            xxx-specific-label: xxx\n    - name: subset-b\n      requiredNodeSelectorTerm:\n        matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n              - zone-b\n  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"targetRef"),": \u6307\u5b9aWorkloadSpread\u7ba1\u7406\u7684workload\u3002\u4e0d\u53ef\u4ee5\u53d8\u66f4\uff0c\u4e14\u4e00\u4e2aworkload\u53ea\u80fd\u5bf9\u5e94\u4e00\u4e2aWorkloadSpread\u3002"),(0,o.kt)("h2",{id:"subsets"},"subsets"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"subsets"),"\u5b9a\u4e49\u4e86\u591a\u4e2a\u533a\u57df(",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"),\u6bcf\u4e2a\u533a\u57df\u914d\u7f6e\u4e0d\u540c\u7684subset\u4fe1\u606f"),(0,o.kt)("h3",{id:"sub-fields"},"sub-fields"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"name"),": subset\u7684\u540d\u79f0\uff0c\u5728\u540c\u4e00\u4e2aWorkloadSpread\u4e0bname\u552f\u4e00\uff0c\u4ee3\u8868\u4e00\u4e2atopology\u533a\u57df\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"maxReplicas"),"\uff1a\u8be5subset\u6240\u671f\u671b\u8c03\u5ea6\u7684\u6700\u5927\u526f\u672c\u6570\uff0c\u9700\u4e3a >= 0\u7684\u6574\u6570\u3002\u82e5\u8bbe\u7f6e\u4e3a\u7a7a\uff0c\u4ee3\u8868\u4e0d\u9650\u5236subset\u7684\u526f\u672c\u6570\u3002"),(0,o.kt)("blockquote",{parentName:"li"},(0,o.kt)("p",{parentName:"blockquote"},"\u5f53\u524d\u7248\u672c\u6682\u4e0d\u652f\u6301\u767e\u5206\u6bd4\u7c7b\u578b\u3002"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"requiredNodeSelectorTerm"),": \u5f3a\u5236\u5339\u914d\u5230\u67d0\u4e2azone\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"preferredNodeSelectorTerms"),": \u5c3d\u91cf\u5339\u914d\u5230\u67d0\u4e2azone\u3002"))),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u6ce8\u610f"),"\uff1arequiredNodeSelectorTerm\u5bf9\u5e94k8s nodeAffinity\u7684requiredDuringSchedulingIgnoredDuringExecution\u3002\npreferredNodeSelectorTerms\u5bf9\u5e94nodeAffinity preferredDuringSchedulingIgnoredDuringExecution\u3002"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"tolerations"),": ",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"Pod\u7684Node\u5bb9\u5fcd\u5ea6\u3002")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'tolerations:\n- key: "key1"\n  operator: "Equal"\n  value: "value1"\n  effect: "NoSchedule"\n')),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"patch"),": \u5b9a\u5236",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u4e2d\u7684Pod\u914d\u7f6e\uff0c\u53ef\u4ee5\u662fAnnotations\u3001Labels\u3001Env\u7b49\u3002")),(0,o.kt)("p",null,"\u4f8b\u5b50\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'# patch pod with a topology label:\npatch:\n  metadata:\n    labels:\n      topology.application.deploy/zone: "zone-a"\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'# patch pod container resources:\npatch:\n  spec:\n    containers:\n    - name: main\n      resources:\n        limit:\n          cpu: "2"\n          memory: 800Mi\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"# patch pod container env with a zone name:\npatch:\n  spec:\n    containers:\n    - name: main\n      env:\n      - name: K8S_AZ_NAME\n        value: zone-a\n")),(0,o.kt)("h2",{id:"\u8c03\u5ea6\u7b56\u7565"},"\u8c03\u5ea6\u7b56\u7565"),(0,o.kt)("p",null,"WorkloadSpread\u63d0\u4f9b\u4e86\u4e24\u79cd\u8c03\u5ea6\u7b56\u7565\uff0c\u9ed8\u8ba4\u4e3a",(0,o.kt)("inlineCode",{parentName:"p"},"Fixed"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"  scheduleStrategy:\n    type: Adaptive | Fixed\n    adaptive:\n      rescheduleCriticalSeconds: 30\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Fixed:"),(0,o.kt)("p",{parentName:"li"},"workload\u4e25\u683c\u6309\u7167",(0,o.kt)("inlineCode",{parentName:"p"},"subsets"),"\u5b9a\u4e49\u5206\u5e03\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Adaptive:"),(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Reschedule"),"\uff1aKruise\u68c0\u67e5",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u4e2d\u8c03\u5ea6\u5931\u8d25\u7684Pod\uff0c\u82e5\u8d85\u8fc7\u7528\u6237\u5b9a\u4e49\u7684\u65f6\u95f4\u5c31\u5c06\u5176\u8c03\u5ea6\u5230\u5176\u4ed6\u6709\u53ef\u7528\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u4e0a\u3002"))),(0,o.kt)("h2",{id:"\u914d\u7f6e\u8981\u6c42"},"\u914d\u7f6e\u8981\u6c42"),(0,o.kt)("p",null,"WorkloadSpread \u529f\u80fd\u9ed8\u8ba4\u662f\u5173\u95ed\u7684\uff0c\u4f60\u9700\u8981\u5728 \u5b89\u88c5/\u5347\u7ea7 Kruise \u7684\u65f6\u5019\u6253\u5f00 feature-gate\uff1a",(0,o.kt)("em",{parentName:"p"},"WorkloadSpread")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n')),(0,o.kt)("h3",{id:"pod-webhook"},"Pod Webhook"),(0,o.kt)("p",null,"WorkloadSpread \u5229\u7528 ",(0,o.kt)("inlineCode",{parentName:"p"},"webhook")," \u5411Pod\u6ce8\u5165\u57df\u89c4\u5219\u3002"),(0,o.kt)("p",null,"\u5982\u679c",(0,o.kt)("inlineCode",{parentName:"p"},"PodWebhook")," feature-gate \u88ab\u8bbe\u7f6e\u4e3a ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),"\uff0cWorkloadSpread \u4e5f\u5c06\u4e0d\u53ef\u7528\u3002"),(0,o.kt)("h3",{id:"deletion-cost-feature"},"deletion-cost feature"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"CloneSet")," \u5df2\u7ecf\u652f\u6301\u8be5\u7279\u6027\u3002"),(0,o.kt)("p",null,"\u5176\u4ed6 native workload \u9700 kubernetes version >= 1.21\u3002\u4e14 1.21 \u7248\u672c\u9700\u8981\u663e\u5f0f\u5f00\u542f ",(0,o.kt)("inlineCode",{parentName:"p"},"PodDeletionCost")," feature-gate\uff0c\u81ea 1.22 \u8d77\u9ed8\u8ba4\u5f00\u542f\u3002"),(0,o.kt)("h2",{id:"\u6269\u7f29\u5bb9\u987a\u5e8f"},"\u6269\u7f29\u5bb9\u987a\u5e8f\uff1a"),(0,o.kt)("p",null,"WorkloadSpread\u6240\u7ba1\u7406\u7684workload\u4f1a\u6309\u7167",(0,o.kt)("inlineCode",{parentName:"p"},"subsets"),"\u4e2d\u5b9a\u4e49\u7684\u987a\u5e8f\u6269\u7f29\u5bb9\uff0c",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"strong"},"subset"),"\u7684\u987a\u5e8f\u5141\u8bb8\u6539\u53d8"),"\uff0c\u5373\u901a\u8fc7\u6539\u53d8",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u7684\u987a\u5e8f\u6765\u8c03\u6574\u6269\u7f29\u5bb9\u7684\u987a\u5e8f\u3002"),(0,o.kt)("p",null,"\u89c4\u5219\u5982\u4e0b\uff1a"),(0,o.kt)("h3",{id:"\u6269\u5bb9"},"\u6269\u5bb9"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u6309\u7167",(0,o.kt)("inlineCode",{parentName:"li"},"spec.subsets"),"\u4e2d",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u5b9a\u4e49\u7684\u987a\u5e8f\u8c03\u5ea6Pod\uff0c\u5f53\u524d",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u7684active Pod\u6570\u91cf\u8fbe\u5230",(0,o.kt)("inlineCode",{parentName:"li"},"maxReplicas"),"\u65f6\u518d\u8c03\u5ea6\u5230\u4e0b\u4e00\u4e2a",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u3002")),(0,o.kt)("h3",{id:"\u7f29\u5bb9"},"\u7f29\u5bb9"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u5f53",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u7684\u526f\u672c\u6570(active)\u5927\u4e8e\u5b9a\u4e49\u7684maxReplicas\u65f6\uff0c\u4f18\u5148\u7f29\u5bb9\u591a\u4f59\u7684Pod\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u4f9d\u636e",(0,o.kt)("inlineCode",{parentName:"li"},"spec.subsets"),"\u4e2d",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u5b9a\u4e49\u7684\u987a\u5e8f\uff0c\u540e\u9762",(0,o.kt)("inlineCode",{parentName:"li"},"subset"),"\u7684Pod\u5148\u4e8e\u524d\u9762\u7684\u88ab\u5220\u9664\u3002")),(0,o.kt)("p",null,"\u4f8b\u5982\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    10          10        10\n# deletion order: c -> b -> a\n\n#             subset-a   subset-b  subset-c\n# maxReplicas    10          10        nil\n# pods number    20          20        20\n# deletion order: b -> a -> c\n")),(0,o.kt)("h2",{id:"\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528-workloadspread"},"\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528 WorkloadSpread"),(0,o.kt)("p",null,"WorkloadSpread \u9ed8\u8ba4\u4e0d\u4f1a\u76d1\u542c\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u3002\u5982\u679c\u60f3\u8981\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528 WorkloadSpread\uff0c\u9700\u8981\u8fdb\u884c\u989d\u5916\u7684\u914d\u7f6e\u3002\u672c\u8282\u4ee5 ",(0,o.kt)("a",{parentName:"p",href:"https://argoproj.github.io/argo-rollouts/"},"Argo\n\u793e\u533a\u7684 Rollout Workload")," \u4e3a\u4f8b\uff0c\u4ecb\u7ecd\u5982\u4f55\u5c06\u5176\u4e0e WorkloadSpread \u914d\u5408\u4f7f\u7528\u3002"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u6ce8\u610f"),"\uff1aWorkloadSpread Webhook \u4e0d\u4f1a\u4e3a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u6240\u521b\u5efa\u7684 Pod \u8bbe\u7f6e deletion cost\uff0c\u56e0\u800c\u65e0\u6cd5\u4fdd\u8bc1\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u7684\u7f29\u5bb9\u987a\u5e8f\u3002"),(0,o.kt)("h3",{id:"\u914d\u7f6e\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u76d1\u542c\u767d\u540d\u5355"},"\u914d\u7f6e\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u76d1\u542c\u767d\u540d\u5355"),(0,o.kt)("p",null,"\u9996\u5148\uff0c\u9700\u8981\u5c06\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u52a0\u5165",(0,o.kt)("inlineCode",{parentName:"p"},"WorkloadSpread_Watch_Custom_Workload_WhiteList")," \u767d\u540d\u5355\uff0c\u4ee5\u4f7f\u5176\u80fd\u591f\u88ab WorkloadSpread \u8bfb\u53d6\u5e76\u7406\u89e3\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: kruise-configuration\n  namespace: kruise-system\ndata:\n  "WorkloadSpread_Watch_Custom_Workload_WhiteList": |\n    {\n      "workloads": [\n        {\n          "Group": "argoproj.io",\n          "Kind": "Rollout",\n          "replicasPath": "spec.replicas",\n        }\n      ]\n    }\n')),(0,o.kt)("p",null,"\u5177\u4f53\u7684\u914d\u7f6e\u9879\u8bf4\u660e\u5982\u4e0b\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Group:")," \u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u7684 ApiGroup\u3002"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Kind:")," \u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u7684 Kind\u3002"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"subResources:")," \u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u7684\u5b50\u8d44\u6e90\uff0c\u5b57\u6bb5\u5305\u62ec Group \u4e0e Kind\u3002\u4f8b\u5982\uff1aDeployment \u7684 ReplicaSet\u3002\u8be5\u5b57\u6bb5\u4e3a\u53ef\u9009\u5b57\u6bb5\uff0c\u5982\u679c\u81ea\u5b9a\u4e49\u8d44\u6e90\u4e0d\u5305\u542b\u5b50\u8d44\u6e90\uff0c\u90a3\u4e48\u53ef\u4ee5\u7559\u7a7a\u3002"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"replicasPath:")," \u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e2d\u7528\u4e8e\u6307\u5b9a\u526f\u672c\u6570\u7684\u8d44\u6e90\u5b57\u6bb5\u8def\u5f84\uff0c\u4f8b\u5982\uff1aspec.replicas\u3002")),(0,o.kt)("h3",{id:"\u5411-kruise-manager-\u6388\u4e88\u6743\u9650"},"\u5411 kruise-manager \u6388\u4e88\u6743\u9650"),(0,o.kt)("p",null,"\u8981\u5728\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u4e0a\u4f7f\u7528 WorkloadSpread\uff0c\u9700\u8981\u7ed9 kruise-manager \u670d\u52a1\u8d26\u53f7\u6388\u4e88\u76f8\u5e94\u8d44\u6e90\u7684\u8bfb\u53d6\u6743\u9650\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: kruise-rollouts-access\nrules:\n  - apiGroups: [ "argoproj.io" ]\n    resources: [ "rollouts" ]\n    verbs: [ "get" ]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: kruise-rollouts-access-binding\nsubjects:\n  - kind: ServiceAccount\n    name: kruise-manager\n    namespace: kruise-system\nroleRef:\n  kind: ClusterRole\n  name: kruise-rollouts-access\n  apiGroup: rbac.authorization.k8s.io\n')),(0,o.kt)("h3",{id:"\u6307\u5b9a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d"},"\u6307\u5b9a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d"),(0,o.kt)("p",null,"\u5f53\u914d\u7f6e\u5b8c\u6210\u540e\uff0c\u5373\u53ef\u5728 WorkloadSpread \u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"targetRef")," \u5b57\u6bb5\u4e2d\u6307\u5b9a\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-demo\nspec:\n  targetRef:\n    apiVersion: argoproj.io/v1alpha1\n    kind: Rollout\n    name: rollouts-demo\n  subsets:\n    ...\n")),(0,o.kt)("h2",{id:"feature-gates"},"feature-gates"),(0,o.kt)("p",null,"WorkloadSpread \u9ed8\u8ba4\u662f\u5173\u95ed\u7684\uff0c\u5982\u679c\u8981\u5f00\u542f\u8bf7\u901a\u8fc7\u8bbe\u7f6e feature-gates ",(0,o.kt)("em",{parentName:"p"},"WorkloadSpread"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'$ helm install kruise https://... --set featureGates="WorkloadSpread=true"\n')),(0,o.kt)("h2",{id:"\u4f8b\u5b50"},"\u4f8b\u5b50"),(0,o.kt)("h3",{id:"\u5f39\u6027\u90e8\u7f72"},"\u5f39\u6027\u90e8\u7f72"),(0,o.kt)("p",null,"zone-a\uff08ack\uff09\u56fa\u5b9a100\u4e2aPod\uff0czone-b\uff08eci\uff09\u505a\u5f39\u6027\u533a\u57df"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u521b\u5efaWorkloadSpread\u5b9e\u4f8b")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef: # \u76f8\u540cnamespace\u4e0b\u7684workload\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: cs-demo\n  subsets:\n  - name: ack # zone ack\uff0c\u6700\u591a100\u4e2a\u526f\u672c\u3002\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - ack\n    maxReplicas: 100\n    patch: # \u6ce8\u5165label\n      metadata:\n        labels:\n          topology.application.deploy/zone: ack\n  - name: eci # \u5f39\u6027\u533a\u57dfeci\uff0c\u526f\u672c\u6570\u91cf\u4e0d\u9650\u3002\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - eci\n    patch:\n      metadata:\n        labels:\n          topology.application.deploy/zone: eci\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u521b\u5efaworkload\uff0c\u526f\u672c\u6570\u53ef\u4ee5\u81ea\u7531\u8c03\u6574\u3002")),(0,o.kt)("h4",{id:"\u90e8\u7f72\u6548\u679c"},"\u90e8\u7f72\u6548\u679c"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u5f53replicas <= 100 \u65f6\uff0cPod\u88ab\u8c03\u5ea6\u5230ack\u4e0a\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u5f53replicas > 100 \u65f6\uff0c100\u4e2a\u5728ack\uff0c\u591a\u4f59\u7684Pod\u5728\u5f39\u6027\u57dfeci\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u7f29\u5bb9\u65f6\u4f18\u5148\u4ece\u5f39\u6027\u57dfeci\u4e0a\u7f29\u5bb9\u3002")),(0,o.kt)("h3",{id:"\u591a\u57df\u90e8\u7f72"},"\u591a\u57df\u90e8\u7f72"),(0,o.kt)("p",null,"\u5206\u522b\u90e8\u7f72100\u4e2a\u526f\u672c\u7684Pod\u5230\u4e24\u4e2a\u673a\u623f\uff08zone-a, zone-b\uff09"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u521b\u5efaWorkloadSpread\u5b9e\u4f8b")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: ws-demo\n  namespace: deploy\nspec:\n  targetRef: # \u76f8\u540cnamespace\u4e0b\u7684workload\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: cs-demo\n  subsets:\n  - name: subset-a # \u533a\u57dfA\uff0c100\u4e2a\u526f\u672c\u3002\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-a\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          topology.application.deploy/zone: zone-a\n  - name: subset-b # \u533a\u57dfB\uff0c100\u4e2a\u526f\u672c\u3002\n    requiredNodeSelectorTerm:\n      matchExpressions:\n      - key: topology.kubernetes.io/zone\n        operator: In\n        values:\n        - zone-b\n    maxReplicas: 100\n    patch:\n      metadata:\n        labels:\n          topology.application.deploy/zone: zone-b\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"\u521b\u5efa\u4e00\u4e2a200\u526f\u672c\u7684\u65b0",(0,o.kt)("inlineCode",{parentName:"p"},"CloneSet"),"\uff0c\u6216\u8005\u5bf9\u73b0\u6709\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"CloneSet"),"\u6267\u884c\u6eda\u52a8\u66f4\u65b0\u3002")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"\u82e5",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u526f\u672c\u5206\u5e03\u9700\u8981\u53d8\u52a8\uff0c\u5148\u8c03\u6574\u5bf9\u5e94",(0,o.kt)("inlineCode",{parentName:"p"},"subset"),"\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"maxReplicas"),"\uff0c\u518d\u8c03\u6574workload\u526f\u672c\u6570\u3002"))))}m.isMDXComponent=!0}}]);
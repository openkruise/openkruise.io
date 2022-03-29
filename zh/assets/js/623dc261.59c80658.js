"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1624],{3905:function(e,n,a){a.d(n,{Zo:function(){return d},kt:function(){return m}});var t=a(7294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function s(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function i(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?s(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function l(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},s=Object.keys(e);for(t=0;t<s.length;t++)a=s[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)a=s[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=t.createContext({}),o=function(e){var n=t.useContext(c),a=n;return e&&(a="function"==typeof e?e(n):i(i({},n),e)),a},d=function(e){var n=o(e.components);return t.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=o(a),m=r,g=u["".concat(c,".").concat(m)]||u[m]||p[m]||s;return a?t.createElement(g,i(i({ref:n},d),{},{components:a})):t.createElement(g,i({ref:n},d))}));function m(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=a.length,i=new Array(s);i[0]=u;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var o=2;o<s;o++)i[o]=a[o];return t.createElement.apply(null,i)}return t.createElement.apply(null,a)}u.displayName="MDXCreateElement"},9577:function(e,n,a){a.r(n),a.d(n,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return o},toc:function(){return d},default:function(){return u}});var t=a(3117),r=a(102),s=(a(7294),a(3905)),i=["components"],l={title:"\u7ba1\u7406\u65e5\u5fd7\u91c7\u96c6sidecar\u5bb9\u5668\u6700\u4f73\u5b9e\u8df5"},c=void 0,o={unversionedId:"best-practices/log-container-sidecarset",id:"best-practices/log-container-sidecarset",title:"\u7ba1\u7406\u65e5\u5fd7\u91c7\u96c6sidecar\u5bb9\u5668\u6700\u4f73\u5b9e\u8df5",description:"Kubernetes\u5bb9\u5668\u65e5\u5fd7\u6536\u96c6",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/best-practices/log-container-sidecarset.md",sourceDirName:"best-practices",slug:"/best-practices/log-container-sidecarset",permalink:"/zh/docs/next/best-practices/log-container-sidecarset",editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/log-container-sidecarset.md",tags:[],version:"current",lastUpdatedBy:"berg",lastUpdatedAt:1646895343,formattedLastUpdatedAt:"2022/3/10",frontMatter:{title:"\u7ba1\u7406\u65e5\u5fd7\u91c7\u96c6sidecar\u5bb9\u5668\u6700\u4f73\u5b9e\u8df5"},sidebar:"docs",previous:{title:"\u4e91\u539f\u751fDevops\u6700\u4f73\u5b9e\u8df5\uff082\uff09\uff1aGitOps + OpenKruise CloneSet",permalink:"/zh/docs/next/best-practices/gitops-with-kruise"},next:{title:"CloneSet Lifecycle\uff1a\u5728 Pod \u751f\u547d\u5468\u671f\u7ba1\u7406\u4e2d\u63d2\u5165\u5b9a\u5236\u5316\u903b\u8f91",permalink:"/zh/docs/next/best-practices/cloneset-lifecycle"}},d=[{value:"Kubernetes\u5bb9\u5668\u65e5\u5fd7\u6536\u96c6",id:"kubernetes\u5bb9\u5668\u65e5\u5fd7\u6536\u96c6",children:[{value:"EFK\u6574\u4f53\u67b6\u6784",id:"efk\u6574\u4f53\u67b6\u6784",children:[],level:3},{value:"K8S Sidecar\u6a21\u5f0f\u5f0a\u7aef",id:"k8s-sidecar\u6a21\u5f0f\u5f0a\u7aef",children:[],level:3},{value:"SidecarSet\u7ba1\u7406sidecar\u5bb9\u5668\u7684\u5229\u5668",id:"sidecarset\u7ba1\u7406sidecar\u5bb9\u5668\u7684\u5229\u5668",children:[],level:3}],level:2},{value:"EFK + SidecarSet(FileBeat)\u5b9e\u8df5",id:"efk--sidecarsetfilebeat\u5b9e\u8df5",children:[{value:"\u5b89\u88c5EFK\uff08ElasticSearch\u3001Kibana\uff09",id:"\u5b89\u88c5efkelasticsearchkibana",children:[],level:3},{value:"FileBeat SidecarSet CRD",id:"filebeat-sidecarset-crd",children:[],level:3},{value:"\u81ea\u52a8\u6ce8\u5165FileBeat Sidecar\u5bb9\u5668",id:"\u81ea\u52a8\u6ce8\u5165filebeat-sidecar\u5bb9\u5668",children:[],level:3},{value:"\u72ec\u7acb\u5347\u7ea7FileBeat Sidecar\u5bb9\u5668\uff08Version 7.16.2 -&gt; 7.16.3\uff09",id:"\u72ec\u7acb\u5347\u7ea7filebeat-sidecar\u5bb9\u5668version-7162---7163",children:[],level:3},{value:"Argo-cd\u90e8\u7f72SidecarSet\uff08Optional\uff09",id:"argo-cd\u90e8\u7f72sidecarsetoptional",children:[],level:3}],level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",children:[],level:2}],p={toc:d};function u(e){var n=e.components,l=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,t.Z)({},p,l,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("h2",{id:"kubernetes\u5bb9\u5668\u65e5\u5fd7\u6536\u96c6"},"Kubernetes\u5bb9\u5668\u65e5\u5fd7\u6536\u96c6"),(0,s.kt)("p",null,"\u65e5\u5fd7\u4f5c\u4e3a\u4efb\u4e00\u7cfb\u7edf\u4e0d\u53ef\u6216\u7f3a\u7684\u90e8\u5206\uff0c\u5728K8S ",(0,s.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/cluster-administration/logging/"},"\u5b98\u65b9\u6587\u6863")," \u4e2d\u4e5f\u4ecb\u7ecd\u4e86\u591a\u79cd\u7684\u65e5\u5fd7\u91c7\u96c6\u5f62\u5f0f\uff0c\u603b\u7ed3\u8d77\u6765\u4e3b\u8981\u6709\u4e0b\u8ff03\u79cd\uff1a",(0,s.kt)("strong",{parentName:"p"},"\u539f\u751f\u65b9\u5f0f\u3001DaemonSet\u65b9\u5f0f\u548cSidecar\u65b9\u5f0f"),"\u3002\n\u4e09\u79cd\u65b9\u5f0f\u90fd\u6709\u5229\u6709\u5f0a\uff0c\u6ca1\u6709\u54ea\u79cd\u65b9\u5f0f\u80fd\u591f\u5b8c\u7f8e\u7684\u89e3\u51b3100%\u95ee\u9898\u7684\uff0c\u6240\u4ee5\u8981\u6839\u636e\u573a\u666f\u6765\u8d34\u5408\u3002",(0,s.kt)("strong",{parentName:"p"},"\u5176\u4e2dSidecar\u65b9\u5f0f\u4e3a\u6bcf\u4e2aPOD\u5355\u72ec\u90e8\u7f72\u65e5\u5fd7agent\uff0c\u76f8\u5bf9\u8d44\u6e90\u5360\u7528\u8f83\u591a\uff0c\u4f46\u7075\u6d3b\u6027\u4ee5\u53ca\u591a\u79df\u6237\u9694\u79bb\u6027\u8f83\u5f3a\uff0c\u5efa\u8bae\u5927\u578b\u7684K8S\u96c6\u7fa4\u6216\u4f5c\u4e3aPAAS\u5e73\u53f0\u4e3a\u591a\u4e2a\u4e1a\u52a1\u65b9\u670d\u52a1\u7684\u96c6\u7fa4\u4f7f\u7528\u8be5\u65b9\u5f0f\u3002")),(0,s.kt)("h3",{id:"efk\u6574\u4f53\u67b6\u6784"},"EFK\u6574\u4f53\u67b6\u6784"),(0,s.kt)("p",null,"EFK\uff08ElasticSearch, FileBeat, Kibana\uff09\u662f\u793e\u533a\u975e\u5e38\u6d41\u884c\u7684\u3001\u4f7f\u7528\u975e\u5e38\u5e7f\u6cdb\u7684\u65e5\u5fd7\u91c7\u96c6\u65b9\u6848\uff0c\u67b6\u6784\u5982\u4e0b\uff1a\n",(0,s.kt)("img",{alt:"k8s log sidecar",src:a(2023).Z})),(0,s.kt)("h3",{id:"k8s-sidecar\u6a21\u5f0f\u5f0a\u7aef"},"K8S Sidecar\u6a21\u5f0f\u5f0a\u7aef"),(0,s.kt)("p",null,"\u5982\u4e0a\u56fe\u6240\u793a\uff0cFileBeat\u5bb9\u5668\u4ee5Sidecar\u6a21\u5f0f\u4e0e\u4e1a\u52a1app\u5bb9\u5668\u90e8\u7f72\u5728\u540c\u4e00\u4e2aPod\u5185\uff0c\u901a\u8fc7\u5171\u4eabvolume\u7684\u65b9\u5f0f\u91c7\u96c6\u65e5\u5fd7\u4e0a\u4f20\u5230ElasticSearch\uff0c\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},"  spec:\n    containers:\n    - name: nginx\n      image: nginx:latest\n      volumeMounts:\n      # \u901a\u8fc7 volumeMounts \u4e0efilebeat sidecar\u5bb9\u5668\u5171\u4eab log \u76ee\u5f55\n      - mountPath: /var/log/nginx\n        name: log\n    - name: filebeat\n      image: docker.elastic.co/beats/filebeat:7.16.2\n      volumeMounts:\n      - mountPath: /var/log/nginx\n        name: log\n    volumes:\n    - name: log\n    emptyDir: {}\n")),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"Pod Sidecar\u6a21\u5f0f\uff1a"),"\u901a\u8fc7\u5728Pod\u91cc\u5b9a\u4e49\u4e13\u95e8\u5bb9\u5668\uff0c\u6765\u6267\u884c\u4e3b\u4e1a\u52a1\u5bb9\u5668\u9700\u8981\u7684\u8f85\u52a9\u5de5\u4f5c\uff08\u6bd4\u5982\uff1a\u65e5\u5fd7\u91c7\u96c6\u5bb9\u5668\uff0c\u6d41\u91cf\u4ee3\u7406\u5bb9\u5668\uff09\u3002\u4f18\u52bf\uff1a\u5c06\u8f85\u52a9\u80fd\u529b\u540c\u4e1a\u52a1\u5bb9\u5668\u89e3\u8026\uff0c\u5b9e\u73b0\u72ec\u7acb\u53d1\u5e03\u548c\u80fd\u529b\u91cd\u7528\u3002",(0,s.kt)("strong",{parentName:"p"},"\u4f46\u662f\u4e5f\u6709\u4e00\u4e9b\u5f0a\u7aef\uff0c\u5982\u4e0b\uff1a")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("strong",{parentName:"li"},"\u4e1a\u52a1Pod\u8026\u5408\uff08\u8fd0\u7ef4\u3001\u4ee3\u7406\uff09\u591a\u79cdsidecar\u5bb9\u5668\uff0c\u589e\u52a0\u914d\u7f6e\u7684\u590d\u6742\u6027\u4ee5\u53ca\u4e1a\u52a1\u5f00\u53d1\u4eba\u5458\u7684\u5b66\u4e60\u6210\u672c")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("strong",{parentName:"li"},"Sidecar\u5bb9\u5668\u5347\u7ea7\u5c06\u5bfc\u81f4\u4e1a\u52a1Pod\u91cd\u5efa\uff0c\u7531\u4e8eSidecar\u5bb9\u5668\u4e00\u822c\u662f\u72ec\u7acb\u7684\u4e2d\u95f4\u4ef6\u56e2\u961f\u8d1f\u8d23\uff0c\u5982\u679c\u5347\u7ea7\u4f1a\u5b58\u5728\u6781\u5927\u7684\u4e1a\u52a1\u65b9\u963b\u529b"))),(0,s.kt)("h3",{id:"sidecarset\u7ba1\u7406sidecar\u5bb9\u5668\u7684\u5229\u5668"},"SidecarSet\u7ba1\u7406sidecar\u5bb9\u5668\u7684\u5229\u5668"),(0,s.kt)("p",null,"SidecarSet\u662fOpenKruise\u4e2d\u9488\u5bf9sidecar\u5bb9\u5668\u7ba1\u7406\u62bd\u8c61\u51fa\u6765\u7684\u6982\u5ff5\uff0c\u8d1f\u8d23\u6ce8\u5165\u548c\u5347\u7ea7k8s\u96c6\u7fa4\u4e2d\u7684sidecar\u5bb9\u5668\uff0c\u662fOpenKruise\u7684\u6838\u5fc3workload\u4e4b\u4e00\uff0c\u8be6\u7ec6\u53ef\u53c2\u8003\uff1a",(0,s.kt)("a",{parentName:"p",href:"https://openkruise.io/zh/docs/user-manuals/sidecarset/"},"SidecarSet\u6587\u6863"),"\u3002"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("strong",{parentName:"li"},"\u81ea\u52a8\u6ce8\u5165Sidecar\uff1a\u5c06sidecar\u5bb9\u5668\u914d\u7f6e\u4e0e\u4e1a\u52a1Workload\uff08Deployment\u3001CloneSet\u7b49\uff09\u914d\u7f6e\u89e3\u8026\uff0c\u7b80\u5316\u7528\u6237\u4f7f\u7528\u6210\u672c")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("strong",{parentName:"li"},"\u72ec\u7acb\u5347\u7ea7Sidecar\u5bb9\u5668\uff1a\u4e0d\u91cd\u5efaPod\uff0c\u5355\u72ec\u5347\u7ea7Sidecar\u5bb9\u5668\uff0c\u5bf9\u4e1a\u52a1\u65e0\u611f"))),(0,s.kt)("h2",{id:"efk--sidecarsetfilebeat\u5b9e\u8df5"},"EFK + SidecarSet(FileBeat)\u5b9e\u8df5"),(0,s.kt)("h3",{id:"\u5b89\u88c5efkelasticsearchkibana"},"\u5b89\u88c5EFK\uff08ElasticSearch\u3001Kibana\uff09"),(0,s.kt)("p",null,"\u793e\u533a\u4e2d\u6709\u5f88\u591a\u5b89\u88c5\u90e8\u7f72EFK\u7684\u6587\u6863\uff0c\u672c\u6587\u4e3b\u8981\u662f\u901a\u8fc7Helm\u7684\u65b9\u5f0f\u8fdb\u884c\u90e8\u7f72\uff0c\u53c2\u8003 ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/elastic/helm-charts"},"Elastic Helm Charts"),"\u3002\n\u9996\u5148K8S\u96c6\u7fa4\u4e2d\u9700\u8981 ",(0,s.kt)("em",{parentName:"p"},"StorageClass")," \u7528\u4e8eElasticSearch PVC\uff0c\u672c\u6587\u4f7f\u7528\u5df2\u7ecf\u5b9a\u4e49\u597d\u7684 ",(0,s.kt)("em",{parentName:"p"},"alibabacloud-cnfs-nas")," \u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-shell"},"helm-charts% kubectl get storageclass\nNAME                       PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE\nalibabacloud-cnfs-nas      nasplugin.csi.alibabacloud.com    Delete          Immediate              true                   6d2h\n")),(0,s.kt)("p",null,"Helm\u4e00\u952e\u90e8\u7f72ElasticSearch\u3001Kibana\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-shell"},'helm-charts% helm repo add elastic https://helm.elastic.co\nhelm-charts% helm repo update\n\n## \u5b89\u88c5 ElasticSearch\uff0c\u8bbe\u7f6estorage-class\u4e3a alibabacloud-cnfs-nas\nhelm-charts% helm install elasticsearch elastic/elasticsearch --version 7.16.3 --set persistence.annotations."volume.beta.kubernetes.io/storage-class"=alibabacloud-cnfs-nas -n elastic-system\n\n## \u5b89\u88c5 Kibana\uff0c\u5373\u53ef\u901a\u8fc7kibana service externalIp\u8fdb\u884c\u8bbf\u95ee\nhelm-charts% helm install kibana elastic/kibana --version 7.16.3 --set service.type=LoadBalancer -n elastic-system\n')),(0,s.kt)("h3",{id:"filebeat-sidecarset-crd"},"FileBeat SidecarSet CRD"),(0,s.kt)("p",null,"\u521b\u5efaFileBeat\u91c7\u96c6\u914d\u7f6e\uff08\u6b64ConfigMap\u9700\u8981\u521b\u5efa\u5230\u4e1a\u52a1Namespace\u4e0b\u9762\uff09\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\ndata:\n  filebeat.yml: |\n    filebeat.inputs:\n    - type: log\n      paths:\n      - /var/log/*\n    output.elasticsearch:\n      host: '${NODE_NAME}'\n      hosts: '${ELASTICSEARCH_HOSTS:elasticsearch-master.elastic-system:9200}'\nkind: ConfigMap\nmetadata:\n  name: filebeat-config\n")),(0,s.kt)("p",null,"\u5b9a\u4e49FileBeat SidecarSet\u914d\u7f6e\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: filebeat-sidecarset\nspec:\n  selector:\n    # \u9700\u8981\u6ce8\u5165 sidecar \u5bb9\u5668\u7684 pod labels\n    matchLabels:\n      kruise.io/inject-filebeat: "true"\n  # sidecarSet\u9ed8\u8ba4\u662f\u5bf9\u6574\u4e2a\u96c6\u7fa4\u751f\u6548\uff0c\u53ef\u4ee5\u901a\u8fc7namespace\u5b57\u6bb5\u6307\u5b9a\u751f\u6548\u7684\u8303\u56f4\n #namespace: ns-xxx\n  containers:\n  - args:\n    - -e\n    - -E\n    - http.enabled=true\n    env:\n    - name: POD_NAMESPACE\n    valueFrom:\n      fieldRef:\n        apiVersion: v1\n          fieldPath: metadata.namespace\n    image: docker.elastic.co/beats/filebeat:7.16.2\n    livenessProbe:\n      exec:\n        command:\n        - sh\n        - -c\n        - |\n          #!/usr/bin/env bash -e\n          curl --fail 127.0.0.1:5066\n    name: filebeat\n    readinessProbe:\n      exec:\n        command:\n        - sh\n        - -c\n        - |\n          #!/usr/bin/env bash -e\n          filebeat test output\n    resources:\n      limits:\n        cpu: "1"\n        memory: 200Mi\n      requests:\n        cpu: 100m\n        memory: 100Mi\n    volumeMounts:\n    - mountPath: /usr/share/filebeat\n      name: filebeat-config\n    # \u901a\u8fc7 volumeMounts \u4e0e\u4e1a\u52a1\u5bb9\u5668\u5171\u4eab log \u76ee\u5f55\n    - mountPath: /var/log\n      name: log\n    volumes:\n    - configMap:\n        name: filebeat-config\n      name: filebeat-config\n    - name: log\n      emptyDir: {}\n')),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"\u9488\u5bf9\u673a\u5668\u8d44\u6e90\u4e0d\u592a\u5145\u8db3\u7684\u573a\u666f\uff0c\u4e3a\u51cf\u5c11Pod\u8d44\u6e90\u7684\u7533\u8bf7\uff0c\u53ef\u4ee5\u5c06sidecar container request.cpu=0\uff0c\u6b64\u79cd\u60c5\u51b5\u4e0bPod\u7684Qos\u5c06\u4f1a\u662f ",(0,s.kt)("a",{parentName:"strong",href:"https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-burstable"},"Burstable"),"\u3002")),(0,s.kt)("h3",{id:"\u81ea\u52a8\u6ce8\u5165filebeat-sidecar\u5bb9\u5668"},"\u81ea\u52a8\u6ce8\u5165FileBeat Sidecar\u5bb9\u5668"),(0,s.kt)("p",null,"\u5b9a\u4e49Nginx\u670d\u52a1Deployment\uff0c\u53ea\u5305\u542b nginx \u76f8\u5173\u914d\u7f6e\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  labels:\n    app: nginx\n  name: nginx\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n        # \u6ce8\u5165 filebeat sidecar \u5bb9\u5668\u7684label\n        kruise.io/inject-filebeat: "true"\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:latest\n        volumeMounts:\n        # \u901a\u8fc7 volumeMounts \u4e0efilebeat sidecar\u5bb9\u5668\u5171\u4eab log \u76ee\u5f55\n        - mountPath: /var/log/nginx\n          name: log\n      volumes:\n      - name: log\n        emptyDir: {}\n')),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"\u5c06nginx deployment apply\u5230k8s\u96c6\u7fa4\u540e\uff0c\u53d1\u73b0\u521b\u5efa\u7684Pod\u90fd\u88ab\u6ce8\u5165\u4e86 filebeat sidecar \u5bb9\u5668\uff0c"),"\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-shell"},'helm-charts% kubectl get pods nginx-5674976569-zdr7l -o yaml\nstatus:\n  containerStatuses:\n  - containerID: containerd://5330c2b32262de83ed387e5a932f61acc52e3896ddfcb22d626c43d82638faf3\n    image: docker.elastic.co/beats/filebeat:7.16.2\n    name: filebeat\n    state:\n      running:\n        startedAt: "2022-03-02T12:17:15Z"\n  - containerID: containerd://1ad335f39c134f7a66a0370a275dd95f67f5fd3d3f1fe523c955408b14887229\n    image: docker.io/library/nginx:latest\n    name: nginx\n    state:\n      running:\n        startedAt: "2022-03-02T12:17:16Z"\n')),(0,s.kt)("h3",{id:"\u72ec\u7acb\u5347\u7ea7filebeat-sidecar\u5bb9\u5668version-7162---7163"},"\u72ec\u7acb\u5347\u7ea7FileBeat Sidecar\u5bb9\u5668\uff08Version 7.16.2 -> 7.16.3\uff09"),(0,s.kt)("p",null,"\u4e0b\u9762\u662f\u4e24\u4e2a\u7a97\u53e3\uff0c\u53f3\u8fb9\u662f\u8bbf\u95eenginx\u670d\u52a1\u7684client\u8bf7\u6c42\u3002",(0,s.kt)("strong",{parentName:"p"},"\u6b64\u65f6\u5c06filebeat sidecarSet\u4e2d\u7684\u955c\u50cf\u5730\u5740\u4ece7.16.2\u53d8\u66f4\u4e3a7.16.3\u540e\uff0c\u53d1\u73b0Pod\u5e76\u6ca1\u6709\u91cd\u5efa\uff0c\n\u4e14filebeat sidecar\u5bb9\u5668\u955c\u50cf\u5347\u7ea77.16.3\u5b8c\u6210\u8fc7\u7a0b\u4e2d\uff0cnginx\u670d\u52a1\u5e76\u6ca1\u6709\u4e2d\u65ad\uff08\u8be5nginx\u670d\u52a1\u53ea\u6709\u4e00\u4e2aPod\u5b9e\u4f8b\uff09\uff0c"),"\u5982\u4e0b\uff1a"),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"k8s log sidecar",src:a(5386).Z})),(0,s.kt)("p",null,"\u8be5\u7279\u6027\u4f9d\u8d56Kruise\u539f\u5730\u5347\u7ea7\u7684\u80fd\u529b\u5b9e\u73b0\uff0c\u8be6\u60c5\u53c2\u8003\u6587\u6863\uff1a",(0,s.kt)("a",{parentName:"p",href:"https://openkruise.io/zh/docs/next/core-concepts/inplace-update/"},"Kruise\u539f\u5730\u5347\u7ea7"),"\u3002\n\u4e0d\u8fc7\u72ec\u7acb\u5347\u7ea7sidecar\u5bb9\u5668\u4e5f\u5b58\u5728\u4e00\u5b9a\u7684\u98ce\u9669\u6027\uff0c\u5982\u679csidecar\u5bb9\u5668\u5347\u7ea7\u8fc7\u7a0b\u4e2d\u5931\u8d25\uff0c\u5219\u5c06\u5bfc\u81f4Pod Not Ready\uff0c\u8fdb\u800c\u5f71\u54cd\u4e1a\u52a1\uff0c\u56e0\u6b64SidecarSet\u672c\u8eab\u63d0\u4f9b\u4e86\u975e\u5e38\u4e30\u5bcc\u7684\u7070\u5ea6\u53d1\u5e03\u80fd\u529b\u6765\u5c3d\u91cf\u89c4\u907f\u8be5\u98ce\u9669\uff0c\n\u8be6\u60c5\u53c2\u8003\u6587\u6863\uff1a",(0,s.kt)("a",{parentName:"p",href:"https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5"},"Kruise SidecarSet"),"\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: sidecarset\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    # \u6700\u5927\u4e0d\u53ef\u7528\u6570\u91cf\n    maxUnavailable: 20%\n    # \u5206\u6279\u53d1\u5e03\n    partition: 90\n    # \u91d1\u4e1d\u96c0\u53d1\u5e03\uff0c\u901a\u8fc7pod labels\n    selector:\n      matchLabels:\n        # Some Pods contain canary labels,\n        # or any other labels where a small number of pods can be selected\n        deploy-env: canary\n")),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"\u53e6\u5916\uff0c\u5982\u679c\u662f\u7c7b\u4f3c\u4e8eServiceMesh Envoy Mesh\u7c7b\u5bb9\u5668\u5219\u9700\u8981\u501f\u52a9\u4e8eSidecarSet\u70ed\u5347\u7ea7\u7279\u6027\uff0c"),"\u8be6\u60c5\u8bf7\u53c2\u8003\uff1a",(0,s.kt)("a",{parentName:"p",href:"https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E7%83%AD%E5%8D%87%E7%BA%A7%E7%89%B9%E6%80%A7"},"SidecarSet\u70ed\u5347\u7ea7"),"\u3002"),(0,s.kt)("h3",{id:"argo-cd\u90e8\u7f72sidecarsetoptional"},"Argo-cd\u90e8\u7f72SidecarSet\uff08Optional\uff09"),(0,s.kt)("p",null,"\u5982\u679c\u4f7f\u7528Argo-cd\u53d1\u5e03Kruise SidecarSet\uff0c\u5219\u9700\u8981\u914d\u7f6e ",(0,s.kt)("a",{parentName:"p",href:"https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks"},"SidecarSet Custom CRD Health Checks"),"\u3002\nArgo-cd\u6839\u636e\u8be5\u914d\u7f6e\u80fd\u591f\u5b9e\u73b0SidecarSet\u81ea\u5b9a\u4e49\u8d44\u6e90\u7684\u68c0\u67e5\uff0c\u5982SidecarSet\u662f\u5426\u53d1\u5e03\u5b8c\u6210\uff0c\u4ee5\u53caPod\u662f\u5426ready\u7b49\uff0c\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\n  name: argocd-cm\n  namespace: argocd\ndata:\n  resource.customizations.health.apps.kruise.io_SidecarSet: |\n    hs = {}\n    -- if paused\n    if obj.spec.updateStrategy.paused then\n      hs.status = "Suspended"\n      hs.message = "SidecarSet is Suspended"\n      return hs\n    end\n\n    -- check sidecarSet status\n    if obj.status ~= nil then\n      if obj.status.observedGeneration < obj.metadata.generation then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: observed sidecarSet generation less then desired generation"\n        return hs\n      end\n\n      if obj.status.updatedPods < obj.spec.matchedPods then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      if obj.status.updatedReadyPods < obj.status.updatedPods then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      hs.status = "Healthy"\n      return hs\n    end\n\n    -- if status == nil\n    hs.status = "Progressing"\n    hs.message = "Waiting for sidecarSet"\n    return hs\n')),(0,s.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,s.kt)("p",null,"Pod\u5305\u542b\u591a\u4e2acontainer\u7684\u65b9\u5f0f\u5c06\u8d8a\u6765\u8d8a\u88ab\u66f4\u591a\u7684\u5f00\u53d1\u8005\u63a5\u53d7\uff0c\u8fdb\u800cK8S\u751f\u6001\u91cc\u9762\u6025\u9700\u4e00\u79cd\u80fd\u591f\u6709\u6548\u7ba1\u7406Sidecar\u5bb9\u5668\u7684\u65b9\u5f0f\u3002\nKruise SidecarSet\u662f\u5728sidecar\u5bb9\u5668\u7ba1\u7406\u4e0a\u9762\u7684\u4e00\u4e9b\u63a2\u7d22\uff0c\u76ee\u524d\u793e\u533a\u4e5f\u6709\u5f88\u591a\u7684\u516c\u53f8\u5728\u4f7f\u7528Kruise SidecarSet\u7ba1\u7406\u4e0d\u540c\u7c7b\u578b\u7684sidecar\u5bb9\u5668\u3002"),(0,s.kt)("p",null,"SidecarSet\u5728\u5e26\u6765\u4fbf\u5229\u7684\u540c\u65f6\uff0c\u5176\u5b9e\u4e5f\u5e26\u6765\u4e86\u4e00\u4e9b\u7ba1\u7406\u4e0a\u9762\u7684\u6210\u672c\uff0c\u4f8b\u5982\uff1aSidecar\u5bb9\u5668\u4e0e\u4e1a\u52a1app\u5bb9\u5668\u540c\u65f6\u53d1\u5e03\u600e\u4e48\u529e\uff1fPod\u4e2dcontainer\u5c5e\u4e8e\u591a\u4e2a\u56e2\u961f\uff0c\u90a3Pod\u7684\u6240\u5c5e\u6743\u5230\u5e95\u5c5e\u4e8e\u8c01\uff1f\n\u6240\u4ee5\uff0c\u6211\u4eec\u4e5f\u5e0c\u671b\u80fd\u591f\u4e0e\u793e\u533a\u7684\u66f4\u591a\u5f00\u53d1\u8005\u4e00\u8d77\u63a2\u7d22\uff0c\u540c\u65f6\u4e5f\u6b22\u8fce\u5927\u5bb6\u90fd\u80fd\u63d0\u4f9b\u4e00\u4e9b\u601d\u8def\uff0c\u5171\u540c\u7e41\u8363K8S\u751f\u6001\u3002"))}u.isMDXComponent=!0},2023:function(e,n,a){n.Z=a.p+"assets/images/k8s-log-sidecar-5f6f7b73b65320bc472ee390052499c6.png"},5386:function(e,n,a){n.Z=a.p+"assets/images/update-sidecarset-36e25423f8c16f60f73edf1a63f19c90.gif"}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3588],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return m}});var a=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=a.createContext({}),c=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},d=function(e){var n=c(e.components);return a.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),u=c(t),m=i,h=u["".concat(l,".").concat(m)]||u[m]||p[m]||r;return t?a.createElement(h,s(s({ref:n},d),{},{components:t})):a.createElement(h,s({ref:n},d))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,s=new Array(r);s[0]=u;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o.mdxType="string"==typeof e?e:i,s[1]=o;for(var c=2;c<r;c++)s[c]=t[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3548:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return p}});var a=t(7462),i=t(3366),r=(t(7294),t(3905)),s=["components"],o={title:"Best Practice for Managing Log Collection Sidecar Containers"},l=void 0,c={unversionedId:"best-practices/log-container-sidecarset",id:"version-v1.2/best-practices/log-container-sidecarset",title:"Best Practice for Managing Log Collection Sidecar Containers",description:"Kubernetes Container Log Collection",source:"@site/versioned_docs/version-v1.2/best-practices/log-container-sidecarset.md",sourceDirName:"best-practices",slug:"/best-practices/log-container-sidecarset",permalink:"/docs/best-practices/log-container-sidecarset",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/log-container-sidecarset.md",tags:[],version:"v1.2",lastUpdatedBy:"Siyu Wang",lastUpdatedAt:1654585589,formattedLastUpdatedAt:"6/7/2022",frontMatter:{title:"Best Practice for Managing Log Collection Sidecar Containers"},sidebar:"docs",previous:{title:"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet",permalink:"/docs/best-practices/gitops-with-kruise"},next:{title:"CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle",permalink:"/docs/best-practices/cloneset-lifecycle"}},d={},p=[{value:"Kubernetes Container Log Collection",id:"kubernetes-container-log-collection",level:2},{value:"EFK Architecture",id:"efk-architecture",level:3},{value:"K8S Sidecar Model Disadvantage",id:"k8s-sidecar-model-disadvantage",level:3},{value:"A Powerful Tool for Sidecar Container Management",id:"a-powerful-tool-for-sidecar-container-management",level:3},{value:"EFK + SidecarSet(FileBeat) Practice",id:"efk--sidecarsetfilebeat-practice",level:2},{value:"Install EFK (ElasticSearch, Kibana)",id:"install-efk-elasticsearch-kibana",level:3},{value:"FileBeat SidecarSet CRD",id:"filebeat-sidecarset-crd",level:3},{value:"Automatic Injection Of FileBeat Sidecar Container",id:"automatic-injection-of-filebeat-sidecar-container",level:3},{value:"Upgrade FileBeat Sidecar Container Independently (Version 7.16.2 -&gt; 7.16.3)",id:"upgrade-filebeat-sidecar-container-independently-version-7162---7163",level:3},{value:"Argo-cd Deploy SidecarSet (Optional)",id:"argo-cd-deploy-sidecarset-optional",level:3},{value:"Summary",id:"summary",level:2}],u={toc:p};function m(e){var n=e.components,o=(0,i.Z)(e,s);return(0,r.kt)("wrapper",(0,a.Z)({},u,o,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"kubernetes-container-log-collection"},"Kubernetes Container Log Collection"),(0,r.kt)("p",null,"As an indispensable part of any system, K8S ",(0,r.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/cluster-administration/logging/"},"Official Documentation")," also introduces various forms of log collection, summarizing the following three main types: ",(0,r.kt)("strong",{parentName:"p"},"Native approach, DaemonSet approach and Sidecar approach"),".\nAll three approaches have advantages and disadvantages, and none of them can perfectly solve 100% of the problems, so they have to be fitted according to the scenarios."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"The Sidecar approach deploys a separate logging agent for each POD"),", which is relatively more resource intensive, but more flexible and multi-tenant isolated, and is recommended for large K8S clusters or clusters serving multiple business parties as PAAS platforms."),(0,r.kt)("h3",{id:"efk-architecture"},"EFK Architecture"),(0,r.kt)("p",null,"EFK (ElasticSearch, FileBeat, Kibana) is a very popular and widely used log collection solution in the community, architecture as follows:\n",(0,r.kt)("img",{alt:"k8s log sidecar",src:t(5323).Z,width:"940",height:"387"})),(0,r.kt)("h3",{id:"k8s-sidecar-model-disadvantage"},"K8S Sidecar Model Disadvantage"),(0,r.kt)("p",null,"As shown above, the FileBeat container is deployed in Sidecar mode in the same Pod as the business app container, and the logs are collected and uploaded to ElasticSearch by means of a shared volume, configuration as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"  spec:\n    containers:\n    - name: nginx\n      image: nginx:latest\n      volumeMounts:\n      # Share log directory with filebeat sidecar container via volumeMount\n      - mountPath: /var/log/nginx\n        name: log\n    - name: filebeat\n      image: docker.elastic.co/beats/filebeat:7.16.2\n      volumeMounts:\n      - mountPath: /var/log/nginx\n        name: log\n    volumes:\n    - name: log\n    emptyDir: {}\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Pod Sidecar Model:")," By defining specialized containers in Pods to perform the auxiliary work required by business containers (e.g. log collection, traffic proxy).\nAdvantage: decoupling the auxiliary capacity from the business container, realizing independent release and capacity reuse.",(0,r.kt)("strong",{parentName:"p"}," But there are also some disadvantages, as follows:")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Business Pod contains (e.g. operation and maintenance, proxy) multiple sidecar containers"),", increasing the complexity of Pod configuration and the learning cost of business developers."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Sidecar container upgrade will lead to business Pod rebuild"),", and since Sidecar containers are generally the responsibility of independent middleware teams, there will be great business-side resistance if upgraded.")),(0,r.kt)("h3",{id:"a-powerful-tool-for-sidecar-container-management"},"A Powerful Tool for Sidecar Container Management"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"SidecarSet is an abstract concept for sidecar container management in OpenKruise"),", responsible for injecting and upgrading sidecar containers in k8s cluster, and is one of the core workloads of OpenKruise. For details, please refer to ",(0,r.kt)("a",{parentName:"p",href:"https://openkruise.io/docs/user-manuals/sidecarset/"},"SidecarSet Document")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Automatic Injection Of Sidecar Container:")," Decoupling sidecar container from business Pod configuration, simplifying business development usage cost and learning cost."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Upgrade Sidecar Container Independently:")," No rebuilding Pod, upgrade Sidecar container alone, no feeling to business service.")),(0,r.kt)("h2",{id:"efk--sidecarsetfilebeat-practice"},"EFK + SidecarSet(FileBeat) Practice"),(0,r.kt)("h3",{id:"install-efk-elasticsearch-kibana"},"Install EFK (ElasticSearch, Kibana)"),(0,r.kt)("p",null,"There is a lot of documentation in the community to install EFK, this article is mainly deployed by way of Helm, refer to ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/elastic/helm-charts"},"Elastic Helm Charts"),".\nFirst of all, K8S cluster needs ",(0,r.kt)("em",{parentName:"p"},"StorageClass")," for ElasticSearch PVC, this article uses the already created ",(0,r.kt)("em",{parentName:"p"},"alibabacloud-cnfs-nas"),", as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"helm-charts% kubectl get storageclass\nNAME                       PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE\nalibabacloud-cnfs-nas      nasplugin.csi.alibabacloud.com    Delete          Immediate              true                   6d2h\n")),(0,r.kt)("p",null,"Helm deploy ElasticSearch, Kibana, as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'helm-charts% helm repo add elastic https://helm.elastic.co\nhelm-charts% helm repo update\n\n## Install ElasticSearch\uff0cset storage-class is alibabacloud-cnfs-nas\nhelm-charts% helm install elasticsearch elastic/elasticsearch --version 7.16.3 --set persistence.annotations."volume.beta.kubernetes.io/storage-class"=alibabacloud-cnfs-nas -n elastic-system\n\n## Install Kibana\nhelm-charts% helm install kibana elastic/kibana --version 7.16.3 --set service.type=LoadBalancer -n elastic-system\n')),(0,r.kt)("h3",{id:"filebeat-sidecarset-crd"},"FileBeat SidecarSet CRD"),(0,r.kt)("p",null,"Create FileBeat configuration (the ConfigMap be created under business namespace), as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\ndata:\n  filebeat.yml: |\n    filebeat.inputs:\n    - type: log\n      paths:\n      - /var/log/*\n    output.elasticsearch:\n      host: '${NODE_NAME}'\n      hosts: '${ELASTICSEARCH_HOSTS:elasticsearch-master.elastic-system:9200}'\nkind: ConfigMap\nmetadata:\n  name: filebeat-config\n")),(0,r.kt)("p",null,"FileBeat SidecarSet Configuration, as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: filebeat-sidecarset\nspec:\n  selector:\n    # Pod labels that need to be injected into the sidecar container\n    matchLabels:\n      kruise.io/inject-filebeat: "true"\n  # sidecarSet is effective for the whole cluster by default, you can specify the scope of the effect through the namespace field\n #namespace: ns-xxx\n  containers:\n  - args:\n    - -e\n    - -E\n    - http.enabled=true\n    env:\n    - name: POD_NAMESPACE\n    valueFrom:\n      fieldRef:\n        apiVersion: v1\n          fieldPath: metadata.namespace\n    image: docker.elastic.co/beats/filebeat:7.16.2\n    livenessProbe:\n      exec:\n        command:\n        - sh\n        - -c\n        - |\n          #!/usr/bin/env bash -e\n          curl --fail 127.0.0.1:5066\n    name: filebeat\n    readinessProbe:\n      exec:\n        command:\n        - sh\n        - -c\n        - |\n          #!/usr/bin/env bash -e\n          filebeat test output\n    resources:\n      limits:\n        cpu: "1"\n        memory: 200Mi\n      requests:\n        cpu: 100m\n        memory: 100Mi\n    volumeMounts:\n    - mountPath: /usr/share/filebeat\n      name: filebeat-config\n    # Share log directory with app container via volumeMount\n    - mountPath: /var/log\n      name: log\n    volumes:\n    - configMap:\n        name: filebeat-config\n      name: filebeat-config\n    - name: log\n      emptyDir: {}\n')),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"For the scenario where machine resources are not sufficient, in order to reduce Pod resource requests, you can set sidecar container request.cpu=0. In this case, the Qos of Pod will be ",(0,r.kt)("a",{parentName:"strong",href:"https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-burstable"},"Burstable"),".")),(0,r.kt)("h3",{id:"automatic-injection-of-filebeat-sidecar-container"},"Automatic Injection Of FileBeat Sidecar Container"),(0,r.kt)("p",null,"Nginx Deployment, only contains nginx container configuration, as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  labels:\n    app: nginx\n  name: nginx\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n        # need injection filebeat sidecar label\n        kruise.io/inject-filebeat: "true"\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:latest\n        volumeMounts:\n        # Share log directory with filebeat sidecar container via volumeMount\n        - mountPath: /var/log/nginx\n          name: log\n      volumes:\n      - name: log\n        emptyDir: {}\n')),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"After applying the nginx deployment to the k8s cluster, it was found that the created Pods were injected with the filebeat sidecar container"),", as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'helm-charts% kubectl get pods nginx-5674976569-zdr7l -o yaml\nstatus:\n  containerStatuses:\n  - containerID: containerd://5330c2b32262de83ed387e5a932f61acc52e3896ddfcb22d626c43d82638faf3\n    image: docker.elastic.co/beats/filebeat:7.16.2\n    name: filebeat\n    state:\n      running:\n        startedAt: "2022-03-02T12:17:15Z"\n  - containerID: containerd://1ad335f39c134f7a66a0370a275dd95f67f5fd3d3f1fe523c955408b14887229\n    image: docker.io/library/nginx:latest\n    name: nginx\n    state:\n      running:\n        startedAt: "2022-03-02T12:17:16Z"\n')),(0,r.kt)("h3",{id:"upgrade-filebeat-sidecar-container-independently-version-7162---7163"},"Upgrade FileBeat Sidecar Container Independently (Version 7.16.2 -> 7.16.3)"),(0,r.kt)("p",null,"Below are two windows, and on the right is a client request to access the nginx service. At this point, after changing the image in filebeat sidecarSet from 7.16.2 to 7.16.3,\n",(0,r.kt)("strong",{parentName:"p"},"we find that the Pod is not rebuilt. And the nginx service is not interrupted during the completion of filebeat sidecar container image upgrade 7.16.3 (the nginx service has only one Pod instance)"),", as follows:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"k8s log sidecar",src:t(7635).Z,width:"706",height:"380"})),(0,r.kt)("p",null,"This feature relies on the ability of ",(0,r.kt)("a",{parentName:"p",href:"https://openkruise.io/docs/next/core-concepts/inplace-update/"},"Kruise InPlace Update"),".\nHowever, upgrading sidecar independently comes with a risk, if the sidecar upgrade process fails, it will make Pod Not Ready and potentially affects the business, so SidecarSet itself provides rich progressive delivery capability to mitigate the risk.\nRefer to ",(0,r.kt)("a",{parentName:"p",href:"https://openkruise.io/zh/docs/next/user-manuals/sidecarset#sidecar%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5"},"Kruise SidecarSet"),", as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: sidecarset\nspec:\n  # ...\n  updateStrategy:\n    type: RollingUpdate\n    # Maximum unavailable quantity\n    maxUnavailable: 20%\n    # Release in batches\n    partition: 90\n    # Canary release, via pod labels\n    selector:\n      matchLabels:\n        # Some Pods contain canary labels,\n        # or any other labels where a small number of pods can be selected\n        deploy-env: canary\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"In addition, if it is similar to the ServiceMesh Envoy Mesh Container, you need to use the SidecarSet hot upgrade feature,")," Refer to ",(0,r.kt)("a",{parentName:"p",href:"https://openkruise.io/docs/next/user-manuals/sidecarset#sidecar%E7%83%AD%E5%8D%87%E7%BA%A7%E7%89%B9%E6%80%A7"},"SidecarSet HotUpgrade"),"."),(0,r.kt)("h3",{id:"argo-cd-deploy-sidecarset-optional"},"Argo-cd Deploy SidecarSet (Optional)"),(0,r.kt)("p",null,"If you use Argo-cd to deploy Kruise SidecarSet, you need to configure ",(0,r.kt)("a",{parentName:"p",href:"https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks"},"Custom CRD Health Checks"),".\nAccording to this configuration, Argo-cd can implement SidecarSet Health Check, such as whether the SidecarSet is published or not, and whether the Pod ready, etc., as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\n  name: argocd-cm\n  namespace: argocd\ndata:\n  resource.customizations.health.apps.kruise.io_SidecarSet: |\n    hs = {}\n    -- if paused\n    if obj.spec.updateStrategy.paused then\n      hs.status = "Suspended"\n      hs.message = "SidecarSet is Suspended"\n      return hs\n    end\n\n    -- check sidecarSet status\n    if obj.status ~= nil then\n      if obj.status.observedGeneration < obj.metadata.generation then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: observed sidecarSet generation less then desired generation"\n        return hs\n      end\n\n      if obj.status.updatedPods < obj.spec.matchedPods then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      if obj.status.updatedReadyPods < obj.status.updatedPods then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      hs.status = "Healthy"\n      return hs\n    end\n\n    -- if status == nil\n    hs.status = "Progressing"\n    hs.message = "Waiting for sidecarSet"\n    return hs\n')),(0,r.kt)("h2",{id:"summary"},"Summary"),(0,r.kt)("p",null,"Pod containing multiple containers will be more and more accepted by more and more developers, and thus the K8S ecosystem urgently needs a way to manage sidecar containers effectively.\nKruise SidecarSet is an exploration of sidecar container management, and there are many companies in the community using Kruise SidecarSet to manage different types of sidecar containers."),(0,r.kt)("p",null,"While SidecarSet brings convenience, it also brings some management costs, such as: what if the Sidecar container is released at the same time with the business app container, and who owns the Pod when the containers in the Pod belong to multiple teams?\nTherefore, we also hope to explore with more developers in the community, and welcome everyone to provide some ideas to prosper the K8S ecology together."))}m.isMDXComponent=!0},5323:function(e,n,t){n.Z=t.p+"assets/images/k8s-log-sidecar-5f6f7b73b65320bc472ee390052499c6.png"},7635:function(e,n,t){n.Z=t.p+"assets/images/update-sidecarset-36e25423f8c16f60f73edf1a63f19c90.gif"}}]);
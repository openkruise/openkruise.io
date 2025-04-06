"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6087],{5323:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/argo-ce028439a3b56a2e4bee243da228f6a0.png"},6345:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/git1-dabecbd800586101ef40e61d25852a78.png"},19002:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>r,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"best-practices/gameserver-delivery-management","title":"Best Practices for Agile Delivery and Operations Management of GameServers","description":"In the traditional operation and maintenance model, the deployment of game servers inevitably leads to the close coupling of business and underlying infrastructure. This process-oriented delivery method often leads to inefficient deployment and difficult troubleshooting in case of problems due to the low degree of automation and lack of effective batch management capabilities.","source":"@site/kruisegame/best-practices/gameserver-delivery-management.md","sourceDirName":"best-practices","slug":"/best-practices/gameserver-delivery-management","permalink":"/kruisegame/best-practices/gameserver-delivery-management","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Best Practice for Shard-Memory of GameServers","permalink":"/kruisegame/best-practices/shared-mem"},"next":{"title":"Best Practices for Game O&M Workflow","permalink":"/kruisegame/best-practices/workflow"}}');var a=n(74848),s=n(28453);const r={},o="Best Practices for Agile Delivery and Operations Management of GameServers",l={},c=[{value:"GameServer Delivery with ArgoCD",id:"gameserver-delivery-with-argocd",level:2},{value:"Connecting to a Git Repository",id:"connecting-to-a-git-repository",level:3},{value:"Delivery of PvE Type GameServers",id:"delivery-of-pve-type-gameservers",level:3},{value:"Delivery of PvP Type GameServers",id:"delivery-of-pvp-type-gameservers",level:3},{value:"Lessons learnt",id:"lessons-learnt",level:3},{value:"GameServer Operation and Maintenance Management",id:"gameserver-operation-and-maintenance-management",level:2},{value:"OKG Dashboard White Screen Proactive O&amp;M",id:"okg-dashboard-white-screen-proactive-om",level:3},{value:"Construction of monitoring and warning mechanisms to enhance the stability of the GameServers",id:"construction-of-monitoring-and-warning-mechanisms-to-enhance-the-stability-of-the-gameservers",level:3}];function h(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"best-practices-for-agile-delivery-and-operations-management-of-gameservers",children:"Best Practices for Agile Delivery and Operations Management of GameServers"})}),"\n",(0,a.jsx)(t.p,{children:"In the traditional operation and maintenance model, the deployment of game servers inevitably leads to the close coupling of business and underlying infrastructure. This process-oriented delivery method often leads to inefficient deployment and difficult troubleshooting in case of problems due to the low degree of automation and lack of effective batch management capabilities."}),"\n",(0,a.jsx)(t.p,{children:"In contrast, cloud-native technologies, with their declarative and consistent delivery characteristics, provide significant efficiency gains for the deployment and operation of game servers. However, in practice, we observe that due to the stateful nature of game servers, their delivery logic differs significantly from that of traditional stateless services. This paper aims to shed light on these differences and propose best practice solutions, with the aim of opening up new ideas for agile deployment and O&M management of game servers in cloud-native environments."}),"\n",(0,a.jsx)(t.h2,{id:"gameserver-delivery-with-argocd",children:"GameServer Delivery with ArgoCD"}),"\n",(0,a.jsx)(t.p,{children:"Before we get into the specifics of publishing the example, let's take a look at the idea of cloud-native delivery - declarative rather than process-oriented, which means that cloud-native application delivery is not concerned with the deployment process of the application but rather with the definition of the application. The definition of the application is Yaml, which describes what the application should look like in a configuration parameterised way. Therefore, all changes and releases to the application are really changes to the application description (Yaml). At this point we have found that we need a repository to keep a record of the current description of the application and to be able to trace and audit past changes to the Yaml. At this point, I believe you will find that the git repo is a natural fit for this feature. Ops engineers can upload Yaml to the repository by submitting Commit and Merge Requests, and the permissions management and auditing follow the git specification. Ideally, we only need to maintain a set of Yaml describing the game service, and trigger the release of the game service in multiple regions around the world with one click, without the need to operate the cluster one by one for the process to perform deployment actions. This is the idea behind GitOps."}),"\n",(0,a.jsx)(t.p,{children:"The most challenging thing in landing GitOps is actually the abstraction of the description of a GameServer application; a GameServerSet is a collection of GameServers with the same attributes, which belongs to the GameServer management oriented workload in Kubernetes, and therefore each GameServerSet cannot be deployed across Kubernetes clusters. Therefore, in some scenarios, such as multi-cluster scenarios, each cluster needs at least one GameServerSet, and the description of each GameServerSet is more or less different, so it seems difficult to summarise all the game servers in a single Yaml. As an example, consider the scenario of a global launch - the launch is planned for Shanghai, Tokyo and Frankfurt, so we need infrastructure resources in all three regions. In Shanghai I want to publish 10 game regions, while in Frankfurt I only want to publish 3. In this case, a single Yaml will not be able to describe the game servers for the different geographies because of the differences in the replicas field. Do we need to maintain a Yaml for each locale? This is also not a reasonable approach, when making non-differentiated field changes (e.g., tagging a game server for all geographies), we need to perform multiple Yaml changes repeatedly, which is easy to miss or make mistakes when there are a lot of clusters, which is not in line with the cloud-native delivery idea."}),"\n",(0,a.jsxs)(t.p,{children:["In fact, we can perform further abstraction of the GameServer application by using Helm Chart to extract the discrepancies as Values. In our current example (",(0,a.jsx)(t.a,{href:"https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game",children:"https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game"}),"), we abstract such discrepancy fields:"]}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Main image \u2014\u2014 There may be differences in the Main image for each zone/cluster"}),"\n",(0,a.jsx)(t.li,{children:"Sidecar image \u2014\u2014 Sidecar image may vary per zone/cluster"}),"\n",(0,a.jsx)(t.li,{children:"GameServer replicas \u2014\u2014 The number of game server released per zone/cluster may vary"}),"\n",(0,a.jsx)(t.li,{children:"Whether to enable auto-scale or not \u2014\u2014 Requirements for auto-scale may vary per zone/cluster"}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"Other than that, all other fields remain consistent, meaning that there is no zone disparity impact."}),"\n",(0,a.jsxs)(t.p,{children:["ArgoCD (",(0,a.jsx)(t.a,{href:"https://argo-cd.readthedocs.io/en/stable/",children:"https://argo-cd.readthedocs.io/en/stable/"}),") as a community mature cloud-native delivery tool, which inherits the idea of GitOps very well, this paper will use ArgoCD for the practical operation of game service delivery. Next we start the specific operation:"]}),"\n",(0,a.jsx)(t.h3,{id:"connecting-to-a-git-repository",children:"Connecting to a Git Repository"}),"\n",(0,a.jsx)(t.p,{children:"We need to connect the Git repository that describes the GameServer application. The steps to do this are as follows:"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"select Settings in the left navigation bar of the ArgoCD UI and then select Repositories > + Connect Repo"}),"\n",(0,a.jsx)(t.li,{children:"Configure the following information in the pop-up panel and click CONNECT to add the connection"}),"\n"]}),"\n",(0,a.jsxs)(t.table,{children:[(0,a.jsx)(t.thead,{children:(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.th,{children:"Zone"}),(0,a.jsx)(t.th,{children:"Parameter"}),(0,a.jsx)(t.th,{children:"Value"})]})}),(0,a.jsxs)(t.tbody,{children:[(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"Choose your connection method"}),(0,a.jsx)(t.td,{children:"Number of game servers in different states"}),(0,a.jsx)(t.td,{children:"VIA HTTPS"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"CONNECT REPO USING HTTPS"}),(0,a.jsx)(t.td,{children:"Number of game servers in different ops states"}),(0,a.jsx)(t.td,{children:"git"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Project"}),(0,a.jsx)(t.td,{children:"default"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Repository URL"}),(0,a.jsx)(t.td,{children:(0,a.jsx)(t.a,{href:"https://github.com/AliyunContainerService/gitops-demo.git",children:"https://github.com/AliyunContainerService/gitops-demo.git"})})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Skip server verification"}),(0,a.jsx)(t.td,{children:"tick"})]})]})]}),"\n",(0,a.jsx)("img",{src:n(6345).A,style:{width:"800px"}}),"\n",(0,a.jsx)("img",{src:n(75378).A,style:{width:"800px"}}),"\n",(0,a.jsx)(t.h3,{id:"delivery-of-pve-type-gameservers",children:"Delivery of PvE Type GameServers"}),"\n",(0,a.jsxs)(t.p,{children:["PvE games usually have the concept of zones, and in most cases, the operation engineers will manually control the number of game server opened in each region. For PvE game cloud biochemistry best practices, please refer to OKG PvE Game Best Practices document (",(0,a.jsx)(t.a,{href:"https://openkruise.io/kruisegame/best-practices/pve-game",children:"https://openkruise.io/kruisegame/best-practices/pve-game"}),").\nWhen trying ArgoCD for the first time, we can use the white screen console to create separate Applications for each geographic cluster:"]}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"Select Applications in the left navigation bar of the ArgoCD UI and click + NEW APP"}),"\n",(0,a.jsx)(t.li,{children:"Configure the following information in the pop-up panel and click CREATE to create. (Take opengame-demo-shanghai-dev for example)"}),"\n"]}),"\n",(0,a.jsxs)(t.table,{children:[(0,a.jsx)(t.thead,{children:(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.th,{children:"Zone"}),(0,a.jsx)(t.th,{children:"Parameter"}),(0,a.jsx)(t.th,{children:"Value"})]})}),(0,a.jsxs)(t.tbody,{children:[(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"GENERAL"}),(0,a.jsx)(t.td,{children:"Application Name"}),(0,a.jsx)(t.td,{children:"opengame-demo-shanghai-dev"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Project Name"}),(0,a.jsx)(t.td,{children:"default"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"SYNC POLICY"}),(0,a.jsx)(t.td,{children:"Select Automatic in the drop-down list. the parameter values are as follows:"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"Manual: Manually Synchronising Git Repository Changes"}),(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"Automatic: Automatically synchronise Git repository changes at 3min intervals"}),(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"SYNC OPTIONS"}),(0,a.jsx)(t.td,{children:"Tick AUTO-CREATE NAMESPACE"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"SOURCE"}),(0,a.jsx)(t.td,{children:"Repository URL"}),(0,a.jsxs)(t.td,{children:["Select an existing Git Repo in the drop-down list, here select ",(0,a.jsx)(t.a,{href:"https://github.com/AliyunContainerService/gitops-demo.git",children:"https://github.com/AliyunContainerService/gitops-demo.git"})]})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Revision"}),(0,a.jsx)(t.td,{children:"HEAD"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Path"}),(0,a.jsx)(t.td,{children:"manifests/helm/open-game"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"DESTINATION"}),(0,a.jsx)(t.td,{children:"Cluster URL/Cluster Name"}),(0,a.jsx)(t.td,{children:"Select the target cluster in the drop-down list"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"Namespace"}),(0,a.jsx)(t.td,{children:"opengame"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"HELM"}),(0,a.jsx)(t.td,{children:"VALUES FILES"}),(0,a.jsx)(t.td,{children:"values.yaml"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:"PARAMETERS"}),(0,a.jsx)(t.td,{children:"replicas"}),(0,a.jsx)(t.td,{children:"3 #Release of three Gameserver"})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{}),(0,a.jsx)(t.td,{children:"scaled.enabled"}),(0,a.jsx)(t.td,{children:"false # Automatic elastic expansion without switching on"})]})]})]}),"\n",(0,a.jsxs)(t.ol,{start:"3",children:["\n",(0,a.jsx)(t.li,{children:"After creation, you can see the application status of opengame-demo-shanghai-dev in the Application page. If the SYNC POLICY selection is Manual, you need to click SYNC manually to deploy the application synchronously to the target cluster. The Status of the application is Healthy and Synced, which means it has been successfully synchronised."}),"\n"]}),"\n",(0,a.jsx)("img",{src:n(5323).A,style:{width:"850px"}}),"\n",(0,a.jsxs)(t.ol,{start:"4",children:["\n",(0,a.jsx)(t.li,{children:"Click the opengame-demo-shanghai-dev application name to view the application details, showing the topology and corresponding status of the Kubernetes resources associated with the application."}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"Once we are familiar with ArgoCD, we can also publish game servers with a single click through the ApplicationSet object. The difference between each cluster is abstracted by elements, for example, in the following Yaml, three fields are abstracted in terms of cluster dimension: cluster cluster name is used to distinguish the name of the application; url is used to distinguish the address of the target cluster; and replicas is used to distinguish the number of game apparel published by different clusters.\nAfter writing the ApplicationSet Yaml, deploy it to the ACK One fleet cluster to automatically create four applications."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl apply -f pve.yaml -n argocd\n\n# The contents of pve.yaml are as follows\uff1a\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: minecraft\nspec:\n  generators:\n  - list:\n      elements:\n      - cluster: shanghai-dev\n        url: <https://47.100.237.xxx:6443>\n        replicas: '1'\n      - cluster: shanghai-prod\n        url: <https://47.101.214.xxx:6443>\n        replicas: '3'\n      - cluster: frankfurt-prod\n        url: <https://8.209.103.xxx:6443>\n        replicas: '2'\n      - cluster: japan-prod\n        url: <https://10.0.0.xxx:6443>\n        replicas: '2'\n  template:\n    metadata:\n      name: '{{cluster}}-minecraft'\n    spec:\n      project: default\n      source:\n        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'\n        targetRevision: HEAD\n        path: manifests/helm/open-game\n        helm:\n          valueFiles:\n          - values.yaml\n          parameters: #Corresponds to the value parameter extracted from the helm chart.\n          - name: replicas\n            value: '{{replicas}}'\n          - name: scaled.enabled \n            value: 'false'\n      destination:\n        server: '{{url}}'\n        namespace: game-server #Deploy to the game-server namespace of the corresponding cluster.\n      syncPolicy:\n        syncOptions:\n          - CreateNamespace=true #If the namespace does not exist in the cluster, it is automatically created.\n"})}),"\n",(0,a.jsx)(t.p,{children:"In this Yaml, all image have the same version. If you want to have differences in the version of the mirrors across clusters, you can follow the example of replicas and add a new parameter parameter."}),"\n",(0,a.jsx)(t.h3,{id:"delivery-of-pvp-type-gameservers",children:"Delivery of PvP Type GameServers"}),"\n",(0,a.jsxs)(t.p,{children:["For PvP type games, the number of rooms is provisioned by its own scaler rather than manually specified by the Ops Engineer. Best practices for cloud-based biochemistry for PvP-type games can be found in the OKG Best Practices for PvP Games document (",(0,a.jsx)(t.a,{href:"https://openkruise.io/kruisegame/best-practices/session-based-game",children:"https://openkruise.io/kruisegame/best-practices/session-based-game"}),")."]}),"\n",(0,a.jsx)(t.p,{children:"In OKG we enable flexible scaling of game servers by configuring a ScaledObject object for the GameServerSet. Therefore, scaled.enabled in Helm Chart Value needs to be turned on in this scenario. In addition, there are 2 controllers, ArgoCD and OKG, for the number of copies of the rooms to conflict, which can be solved by having ArgoCD ignore the changes in the number of copies of the GameServerSet resource, by setting the corresponding field in spec.ignoreDifferences. Considering the above, the pvp.yaml looks like this:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl apply -f pvp.yaml -n argocd\n\n# The contents of pvp.yaml are as follows\uff1a\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: pvp\nspec:\n  generators:\n  - list:\n      elements:\n      - cluster: shanghai-dev\n        url: <https://47.100.237.xxx:6443>\n      - cluster: shanghai-prod\n        url: <https://47.101.214.xxx:6443>\n      - cluster: frankfurt-prod\n        url: <https://8.209.103.xxx:6443>\n      - cluster: japan-prod\n        url: <https://10.0.0.xxx:6443>\n  template:\n    metadata:\n      name: '{{cluster}}-pvp'\n    spec:\n      project: defaultminecraft\n      ignoreDifferences: # Set GameServerSet number of minecraft replicas to be controlled by the cluster itself\n      - group: game.kruise.io\n        kind: GameServerSet\n        name: minecraft\n        namespace: game\n        jsonPointers:\n        - /spec/replicas\n      source:\n        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'\n        targetRevision: HEAD\n        path: manifests/helm/open-game\n        helm:\n          valueFiles:\n          - values.yaml\n      destination:\n        server: '{{url}}'\n        namespace: pvp-server\n      syncPolicy:\n        syncOptions:\n          - CreateNamespace=true\n"})}),"\n",(0,a.jsx)(t.p,{children:"In this Yaml, all mirrors have the same version. If you want to have differences in the version of the mirrors across clusters, you can follow the example of replicas and add a new parameter parameter."}),"\n",(0,a.jsx)(t.h3,{id:"lessons-learnt",children:"Lessons learnt"}),"\n",(0,a.jsx)(t.p,{children:"Through the above example, we will find that good application abstraction is the key to agile delivery of GameServerSet. We need to try to keep most of the fields in GameServerSet consistent, and extract the fields that have differences, so that we only need to change and maintain specific corresponding fields for different environments to truly achieve agile delivery."}),"\n",(0,a.jsx)(t.h2,{id:"gameserver-operation-and-maintenance-management",children:"GameServer Operation and Maintenance Management"}),"\n",(0,a.jsx)(t.p,{children:"Even for the same workload (GameServerSet), there is variability in the state between game servers. In this case, the delivered GameServer also require continuous targeted O&M management, which is the biggest difference from stateless business."}),"\n",(0,a.jsx)(t.h3,{id:"okg-dashboard-white-screen-proactive-om",children:"OKG Dashboard White Screen Proactive O&M"}),"\n",(0,a.jsx)(t.p,{children:"Usually, we need to proactively operate and maintain the game service -- statistics and query the game service status; directional changes to the game service version, resource specifications, operation and maintenance status, and so on. With OKG Dashboard, you can realise the proactive operation and maintenance of the game service:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["Instructions for using the OKG Dashboard can be found at: ",(0,a.jsx)(t.a,{href:"https://openkruise.io/kruisegame/user-manuals/game-dashboard",children:"https://openkruise.io/kruisegame/user-manuals/game-dashboard"})]}),"\n",(0,a.jsxs)(t.li,{children:["More requirements for OKG Dashboard can be commented under issue: ",(0,a.jsx)(t.a,{href:"https://github.com/openkruise/kruise-game/issues/139",children:"https://github.com/openkruise/kruise-game/issues/139"})]}),"\n"]}),"\n",(0,a.jsx)(t.h3,{id:"construction-of-monitoring-and-warning-mechanisms-to-enhance-the-stability-of-the-gameservers",children:"Construction of monitoring and warning mechanisms to enhance the stability of the GameServers"}),"\n",(0,a.jsx)(t.p,{children:"In addition to proactive O&M, we need to establish a subscription mechanism for stability issues. When the game service is not running as expected, the operation and maintenance engineers can respond and deal with it in a timely manner."}),"\n",(0,a.jsx)(t.p,{children:"OKG provides the ability to customise the quality of service, which can be used flexibly to achieve targeted game service anomalies and alerts. Read the documentation:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"https://openkruise.io/kruisegame/user-manuals/service-qualities/#set-the-om-status-of-unhealthy-game-servers-to-maintaining",children:"https://openkruise.io/kruisegame/user-manuals/service-qualities/#set-the-om-status-of-unhealthy-game-servers-to-maintaining"})}),"\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"https://openkruise.io/kruisegame/best-practices/pve-game/#custom-service-quality-for-game-servers",children:"https://openkruise.io/kruisegame/best-practices/pve-game/#custom-service-quality-for-game-servers"})}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"In addition, if you want GameServer to implement targeted alerts by monitoring metrics, you can also determine the value of GameServer OpsState by calling the Prometheus API in a custom Quality of Service script (pod name can be obtained using the DownwardAPI) and comparing the metric thresholds."})]})}function d(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var i=n(96540);const a={},s=i.createContext(a);function r(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:t},e.children)}},75378:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/git2-52c9070f418f443e5c54227ebf40b7e8.png"}}]);
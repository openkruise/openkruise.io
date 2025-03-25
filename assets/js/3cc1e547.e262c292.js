"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4596],{20408:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/socket2-5a39c7e6c00e67aa74b5f0938a3d1c2d.png"},28453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>r});var t=s(96540);const a={},i=t.createContext(a);function o(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(i.Provider,{value:n},e.children)}},53560:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/oom-c048e6ba8f5e188d145028f71244299a.png"},55375:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/higress-config-22ad3d7df41b264c12c42f4da680d685.png"},69640:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/nginx-config-update-50f073933ef630704ac07e084c5e4c8b.jpg"},77414:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/gss-workload-comparison-b6bda3c854960f1d02d217f7a23a183f.png"},79030:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>g,frontMatter:()=>o,metadata:()=>t,toc:()=>h});const t=JSON.parse('{"id":"blog-video/higress","title":"Best Practice for Gaming Gateway of Higress \xd7 OpenKruiseGame","description":"Author: Weiji Zhao/ChrisLiu/Tianyi Zhang","source":"@site/kruisegame/blog-video/higress.md","sourceDirName":"blog-video","slug":"/blog-video/higress","permalink":"/kruisegame/blog-video/higress","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Upgrading Game Cloud-Native Architecture with OpenKrusieGame","permalink":"/kruisegame/blog-video/guanying-20231129"},"next":{"title":"Cloud Forward | Cloud Native Game Solution","permalink":"/kruisegame/blog-video/cloud-forward-okg"}}');var a=s(74848),i=s(28453);const o={},r="Best Practice for Gaming Gateway of Higress \xd7 OpenKruiseGame",c={},h=[{value:"Higress Seamless Access OKG",id:"higress-seamless-access-okg",level:2},{value:"Nginx Reload Does Not Grace Hot Updates",id:"nginx-reload-does-not-grace-hot-updates",level:2},{value:"How Higress Achieves Elegant Hot Updates",id:"how-higress-achieves-elegant-hot-updates",level:2}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"best-practice-for-gaming-gateway-of-higress--openkruisegame",children:"Best Practice for Gaming Gateway of Higress \xd7 OpenKruiseGame"})}),"\n",(0,a.jsxs)(n.blockquote,{children:["\n",(0,a.jsx)(n.p,{children:"Author: Weiji Zhao/ChrisLiu/Tianyi Zhang"}),"\n",(0,a.jsx)(n.p,{children:"Time: 2024-01-24"}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"OpenKruiseGame (OKG) is an open source game service Kubernetes workload for multi-cloud, which is a sub-project of CNCF's workload open source project OpenKruise in the gaming domain, and it provides common game service management functions such as hot update, in-situ upgrade, and targeted management. As a typical traffic-intensive scenario, gaming puts high demands on the ingress gateway in terms of throughput, latency performance, elasticity and security."}),"\n",(0,a.jsx)(n.p,{children:"Higress is a next-generation cloud-native gateway built on the open source Istio and Envoy, based on more than two years of Envoy gateway practice within Ali, Higress realises a three-layer gateway, namely, security gateway, traffic gateway, and microservices gateway, which significantly reduces gateway deployment and operation and maintenance costs. Higress can be used as an Ingress entry gateway for K8s clusters, and is compatible with a large number of K8s Nginx Ingress annotations, allowing for a smooth migration from K8s Nginx Ingress to Higress, and also supports the K8s Gateway API standard, which allows for a smooth migration from the Ingress API to the Gateway API."}),"\n",(0,a.jsx)(n.p,{children:"In this article, we will demonstrate how Higress seamlessly interfaces with OKG Gaming Services, and the outstanding features it brings to the table."}),"\n",(0,a.jsx)(n.h2,{id:"higress-seamless-access-okg",children:"Higress Seamless Access OKG"}),"\n",(0,a.jsx)(n.p,{children:"Preceding Steps:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"/kruisegame/installation",children:"Install OpenKruiseGame"}),"\u3002"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"https://higress.io/en-us/docs/user/quickstart/",children:"Install Higress"}),"."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"OKG provides a number of excellent features for hot updating and scaling game services, which makes it easy for game operators to manage the full life cycle of game services. Gaming is different from stateless services in that the network traffic of player battles is not allowed to be load balanced, so each game service needs a separate access address."}),"\n",(0,a.jsx)(n.p,{children:"When using native workloads (such as Deployment or StatefulSet), Ops engineers need to configure the access layer network for each of the many game suits, which undoubtedly hampers the efficiency of the service launch, and manual configuration invariably increases the probability of failures. gameServerSet workloads provided by OKG automate the management of the access network of game suits, greatly reducing the burden on Ops engineers. This greatly reduces the burden on operation and maintenance engineers."}),"\n",(0,a.jsx)(n.p,{children:"For TCP/UDP network games, OKG provides network models such as HostPort, SLB, NATGW, etc. For H5/WebSocket type network games, OKG also provides Ingress network models accordingly, such as Higress, Nginx, ALB, etc."}),"\n",(0,a.jsx)("img",{src:s(77414).A}),"\n",(0,a.jsx)(n.p,{children:'This article uses an open source game Posio to build a demo game suit. In the following configuration, IngressClassName="higress" specifies Higress as the network layer of the game service. Higress can seamlessly access the Posio game service through the following configuration, and can implement the higher-order traffic management defined by Higress based on the Annotation. Example Yaml As shown below, the GameServerSet generates the access domain name for the game service associated with the game service ID.'}),"\n",(0,a.jsx)(n.p,{children:"In this example, game 0 is accessed from the domain name game0.postio.example.com, and game 1 is accessed from the domain name game1.postio.example.com. This is how the client accesses the different games."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'piVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: postio\n  namespace: default\nspec:\n  replicas: 1\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n  network:\n    networkType: Kubernetes-Ingress\n    networkConf:\n    - name: IngressClassName\n      value: "higress"\n    - name: Port\n      value: "5000"\n    - name: Path\n      value: /\n    - name: PathType\n      value: Prefix\n    - name: Host\n      value: game<id>.postio.example.com\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/posio:8-24\n          name: postio\n'})}),"\n",(0,a.jsxs)(n.p,{children:["OKG ",(0,a.jsx)(n.a,{href:"/kruisegame/user-manuals/gameservers-scale",children:"horizontal scaling"})," provides automatic scaling, scaling according to the OpsState of the game service, scaling according to the DeletionPriority, scaling according to the serial number of the game service, and so on, in order to support the business requirements of the game operation and maintenance. While the horizontal scaling feature brings convenience to game developers, it also puts forward higher requirements for the entry gateway: the entry gateway must have the ability to hot update the configuration and complete the smooth distribution of routing configuration.\nThe reason is that when expanding the game service, OKG will create Ingress and other related network resources synchronously to ensure the automatic launch of the game service. If the ingress gateway does not have the ability to configure hot updates, online players will experience disconnections during expansion, which will affect their playing experience."]}),"\n",(0,a.jsx)(n.h2,{id:"nginx-reload-does-not-grace-hot-updates",children:"Nginx Reload Does Not Grace Hot Updates"}),"\n",(0,a.jsx)(n.p,{children:"In the event of expansion of the game service or a change in the defined routing policy, a configuration change in Nginx triggers a reload, which results in both upstream and downstream connections being disconnected and triggering a reconnect."}),"\n",(0,a.jsx)(n.p,{children:"Let's take the Posio game service as an example to simulate the problem that occurs when Nginx+OKG expands the game service.The Posio server relies on socket connections to communicate with clients. When the game service expands, it triggers the creation of the corresponding Ingress resource, at which time Nginx-ingress-controller listens to the Ingress resource change and triggers its own reload mechanism, at which time the original connection with the game service (such as the Socket connection in this example) will be disconnected. The physical sensation on the player's side of the game is that there is abnormal lag."}),"\n",(0,a.jsx)(n.p,{children:"To visualise the impact of the Nginx Ingress reload, we made some changes to the Nginx default configuration parameters:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"kubectl edit configmap nginx-configuration -n kube-system\n\ndata:\n  ...\n  worker-shutdown-timeout: 30s # A difficult configuration to weigh.\n\n"})}),"\n",(0,a.jsx)(n.p,{children:"The Nginx configuration parameter worker-shutdown-timeout is a timeout for the Nginx worker process to gracefully go offline. The worker process will first stop receiving new connections and wait for the old connections to be gradually closed, and only after the timeout has been reached will the worker process forcefully shut down all the current connections, completing the exit of the process."}),"\n",(0,a.jsx)(n.p,{children:"If this parameter is configured too small, it will cause a lot of active connections to be disconnected instantly; if this parameter is configured too large, it will cause long websocket connections to always maintain the Nginx process, and when frequent reloads occur, it will generate a large number of shutting down worker processes, and the memory occupied by the old workers will not be freed up, which may lead to OOM. This can lead to online failures:"}),"\n",(0,a.jsx)("img",{src:s(53560).A}),"\n",(0,a.jsx)(n.p,{children:"The actual playing process is as follows: the client accesses the game service and plays normally. During this process, we triggered the expansion of the game service through OKG capability, and checked the response of the client at this time. Through the web developer tool, we can see that there are two socket connections, one is established by the original browser accessing the game service, and the other is a socket connection generated by Nginx disconnecting and then reconnecting."}),"\n",(0,a.jsx)("img",{src:s(69640).A,style:{height:"400px",width:"700px"}}),"\n",(0,a.jsx)(n.p,{children:"The timestamp of the last packet received by the original connection is 15:10:26."}),"\n",(0,a.jsx)("img",{src:s(94899).A}),"\n",(0,a.jsx)(n.p,{children:"The time between the creation of the new connection and the acquisition of the first normal game package was 15:10:37, and the disconnection between the web page and the game service lasted about 5s."}),"\n",(0,a.jsx)("img",{src:s(20408).A}),"\n",(0,a.jsx)(n.p,{children:"In addition to the player's playing experience is affected, this mechanism will also give the overall stability of the business mine. In high concurrency scenarios, because the connection is instantly broken, resulting in a large number of concurrent client reconnections, will lead to an instantaneous spike in the CPU of Nginx; and the back-end game servers need to deal with more business logic, the general demand for resources than the gateway is higher, so a large number of concurrent reconnections transmitted by Nginx is more likely to defeat the back-end, resulting in an avalanche of business."}),"\n",(0,a.jsx)(n.h2,{id:"how-higress-achieves-elegant-hot-updates",children:"How Higress Achieves Elegant Hot Updates"}),"\n",(0,a.jsx)(n.p,{children:"Higress supports the use of K8s Ingress to expose the external IP ports of the game server for players to connect to. Higress supports hot updating of routing configurations when the gaming service scales or defined routing configurations change to ensure stability of player connectivity."}),"\n",(0,a.jsx)("img",{src:s(55375).A}),"\n",(0,a.jsx)(n.p,{children:"Higress' precise configuration change management based on Envoy enables real dynamic hot update of configuration. downstream corresponds to listener configuration in Envoy and upstream corresponds to cluster configuration in LDS. In Envoy, downstream corresponds to the listener configuration, which is handed over to LDS for configuration discovery, while upstream corresponds to the cluster configuration, which is handed over to CDS for configuration discovery. downstream connection will only be disconnected when the listener configuration is updated and rebuilt, and will not affect the upstream connection; The downstream and upstream configurations can be changed independently without affecting each other. Further, the certificate, filter plugin and router under listener can be changed independently, so that no matter the certificate/plugin/route configuration is changed, it will no longer cause the downstream connection to be disconnected."}),"\n",(0,a.jsx)(n.p,{children:"Precise configuration change mechanism, in addition to Envoy can achieve real hot update, also makes the Envoy architecture more reliable, Envoy configuration management from the beginning of the design for the separation of the data plane (DP) and the control plane (CP) designed for, so the use of gRPC to achieve the remote configuration of the dynamic pull, and with the help of the proto to standardise the configuration fields, and to maintain the version of the compatibility. This design enhances the security of the architecture by separating the security domains of the data plane and the control plane."}),"\n",(0,a.jsx)(n.p,{children:"After using OKG to access Higress, the following simulation still simulates the client accessing the game service and playing normally. During this process, the OKG capability triggers the expansion of the game service, and we can see the response of the client at this time. As you can see from the web developer tool, the connection between the client and the game service is stable and unaffected during this process."}),"\n",(0,a.jsx)("img",{src:s(79035).A,style:{height:"400px",width:"700px"}}),"\n",(0,a.jsxs)(n.p,{children:["In addition, in a large-scale game server scenario, each game server corresponds to a separate Ingress, which generates a large amount of Ingress resources, and we tested that at a scale of 1k, it takes minutes for Nginx Ingress to take effect in order to expand a game server, whereas Higress can take effect in seconds.This problem with Nginx Ingress was also addressed by This issue with Nginx Ingress was also addressed by Sealos, and was eventually resolved by switching to Higress, which you can read about in this article:",(0,a.jsx)(n.a,{href:"https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247561453&idx=1&sn=de22e31a1ab59311072b468de907e282&scene=21#wechat_redirect",children:"\u300a\u4e91\u539f\u751f\u7f51\u5173\u54ea\u5bb6\u5f3a\uff1aSealos \u7f51\u5173\u8840\u6cea\u53f2\u300b"})]})]})}function g(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},79035:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/router-config-update-b529e24a5cc95d74dcdcbc5972e98418.jpg"},94899:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/socket1-1de44c9894b25a14102ab1c8eadd9ca7.png"}}]);
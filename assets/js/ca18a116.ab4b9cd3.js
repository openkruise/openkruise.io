"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9563],{23446:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>a,contentTitle:()=>d,default:()=>h,frontMatter:()=>l,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"installation","title":"Installation","description":"Install OpenKruiseGame\uff08OKG)","source":"@site/kruisegame/installation.md","sourceDirName":".","slug":"/installation","permalink":"/kruisegame/installation","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Introduction","permalink":"/kruisegame/introduction"},"next":{"title":"Design Concept","permalink":"/kruisegame/design-concept"}}');var i=r(74848),t=r(28453);const l={},d="Installation",a={},c=[{value:"Install OpenKruiseGame\uff08OKG)",id:"install-openkruisegameokg",level:2},{value:"Installation Instructions",id:"installation-instructions",level:3},{value:"Install Kruise",id:"install-kruise",level:3},{value:"Install Kruise-Game",id:"install-kruise-game",level:3},{value:"Upgrade Kruise-Game",id:"upgrade-kruise-game",level:3},{value:"Options",id:"options",level:3},{value:"Optional: install/upgrade with customized configurations",id:"optional-installupgrade-with-customized-configurations",level:4},{value:"Optional: the local image for China",id:"optional-the-local-image-for-china",level:4},{value:"Uninstall OpenKruiseGame\uff08OKG\uff09",id:"uninstall-openkruisegameokg",level:2},{value:"FAQ",id:"faq",level:2},{value:"What&#39;s Next",id:"whats-next",level:2}];function o(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.header,{children:(0,i.jsx)(s.h1,{id:"installation",children:"Installation"})}),"\n",(0,i.jsx)(s.h2,{id:"install-openkruisegameokg",children:"Install OpenKruiseGame\uff08OKG)"}),"\n",(0,i.jsx)(s.h3,{id:"installation-instructions",children:"Installation Instructions"}),"\n",(0,i.jsx)(s.p,{children:"Installing OpenKruiseGame requires Kruise and Kruise-Game to be installed and Kubernetes version >= 1.18."}),"\n",(0,i.jsx)(s.h3,{id:"install-kruise",children:"Install Kruise"}),"\n",(0,i.jsx)(s.p,{children:"We recommend that you use Helm V3.5 or later to install Kruise."}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"# Firstly add openkruise charts repository if you haven't do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n# [Optional]\n$ helm repo update\n# Install the latest version.\n$ helm install kruise openkruise/kruise --version 1.7.0\n"})}),"\n",(0,i.jsx)(s.h3,{id:"install-kruise-game",children:"Install Kruise-Game"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"$ helm install kruise-game openkruise/kruise-game --version 0.10.0\n"})}),"\n",(0,i.jsx)(s.h3,{id:"upgrade-kruise-game",children:"Upgrade Kruise-Game"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"$ helm upgrade kruise-game openkruise/kruise-game --version 0.10.0 [--force]\n"})}),"\n",(0,i.jsx)(s.h3,{id:"options",children:"Options"}),"\n",(0,i.jsx)(s.h4,{id:"optional-installupgrade-with-customized-configurations",children:"Optional: install/upgrade with customized configurations"}),"\n",(0,i.jsx)(s.p,{children:"The following table lists the configurable parameters of the kruise-game chart and their default values."}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Parameter"}),(0,i.jsx)(s.th,{children:"Description"}),(0,i.jsx)(s.th,{children:"Default"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"installation.namespace"})}),(0,i.jsx)(s.td,{children:"Namespace for kruise-game operation installation"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruise-game-system"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"installation.createNamespace"})}),(0,i.jsx)(s.td,{children:"Whether to create the installation.namespace"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"true"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.fullname"})}),(0,i.jsx)(s.td,{children:"Nick name for kruise-game deployment and other configurations"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruise-game-controller-manager"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.healthBindPort"})}),(0,i.jsx)(s.td,{children:"Port for checking health of kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"8082"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.webhook.port"})}),(0,i.jsx)(s.td,{children:"Port of webhook served by kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"443"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.webhook.targetPort"})}),(0,i.jsx)(s.td,{children:"ObjectSelector for workloads in MutatingWebhookConfigurations"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"9876"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.apiServerQps"})}),(0,i.jsx)(s.td,{children:"Maximum sustained queries per second to send to the API server of kruise-game-controller-manager"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"5"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"kruiseGame.apiServerQpsBurst"})}),(0,i.jsx)(s.td,{children:"Maximum burst queries per second to send to the API server of kruise-game-controller-manager"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"10"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"replicaCount"})}),(0,i.jsx)(s.td,{children:"Replicas of kruise-game deployment"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"1"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"image.repository"})}),(0,i.jsx)(s.td,{children:"Repository for kruise-game image"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"openkruise/kruise-game-manager"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"image.tag"})}),(0,i.jsx)(s.td,{children:"Tag for kruise-game image"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"v0.10.0"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"image.pullPolicy"})}),(0,i.jsx)(s.td,{children:"ImagePullPolicy for kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"Always"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"serviceAccount.annotations"})}),(0,i.jsx)(s.td,{children:"The annotations for serviceAccount of kruise-game"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:" "})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"resources.limits.cpu"})}),(0,i.jsx)(s.td,{children:"CPU resource limit of kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"500m"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"resources.limits.memory"})}),(0,i.jsx)(s.td,{children:"Memory resource limit of kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"1Gi"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"resources.requests.cpu"})}),(0,i.jsx)(s.td,{children:"CPU resource request of kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"10m"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"resources.requests.memory"})}),(0,i.jsx)(s.td,{children:"Memory resource request of kruise-game container"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"64Mi"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"prometheus.enabled"})}),(0,i.jsx)(s.td,{children:"Whether to bind metric endpoint"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"true"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"prometheus.monitorService.port"})}),(0,i.jsx)(s.td,{children:"Port of the monitorservice bind to"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"8080"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"scale.service.port"})}),(0,i.jsx)(s.td,{children:"Port of the external scaler server binds to"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"6000"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"scale.service.targetPort"})}),(0,i.jsx)(s.td,{children:"TargetPort of the external scaler server binds to"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"6000"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"network.totalWaitTime"})}),(0,i.jsx)(s.td,{children:"Maximum time to wait for network ready, the unit is seconds"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"60"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"network.probeIntervalTime"})}),(0,i.jsx)(s.td,{children:"Time interval for detecting network status, the unit is seconds"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"5"})})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"cloudProvider.installCRD"})}),(0,i.jsx)(s.td,{children:"Whether to install CloudProvider CRD"}),(0,i.jsx)(s.td,{children:(0,i.jsx)(s.code,{children:"true"})})]})]})]}),"\n",(0,i.jsxs)(s.p,{children:["Specify each parameter using the ",(0,i.jsx)(s.code,{children:"--set key=value[,key=value]"})," argument to ",(0,i.jsx)(s.code,{children:"helm install"}),". For example,"]}),"\n",(0,i.jsx)(s.h4,{id:"optional-the-local-image-for-china",children:"Optional: the local image for China"}),"\n",(0,i.jsx)(s.p,{children:"If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-bash",children:"$ helm install kruise-game https://... --set image.repository=registry-cn-hangzhou.ack.aliyuncs.com/acs/kruise-game-manager\n"})}),"\n",(0,i.jsx)(s.h2,{id:"uninstall-openkruisegameokg",children:"Uninstall OpenKruiseGame\uff08OKG\uff09"}),"\n",(0,i.jsx)(s.p,{children:"Note that this will lead to all resources created by kruise-game, including webhook configurations, services, namespace, CRDs and CR instances kruise-game controller, to be deleted!"}),"\n",(0,i.jsx)(s.p,{children:"Please do this ONLY when you fully understand the consequence."}),"\n",(0,i.jsx)(s.p,{children:"To uninstall kruise-game if it is installed with helm charts:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-bash",children:'$ helm uninstall kruise-game\nrelease "kruise-game" uninstalled\n'})}),"\n",(0,i.jsx)(s.h2,{id:"faq",children:"FAQ"}),"\n",(0,i.jsxs)(s.p,{children:["Q: Error ",(0,i.jsx)(s.code,{children:'no matches for kind "ServiceMonitor" in version "monitoring.coreos.com/v1"'}),"\nA: This is because the cluster does not have the prometheus operator installed. enabling the playsuit monitoring feature requires the prometheus operator to be installed on the Kubernetes cluster. If you do not use this feature, you can set prometheus.enabled to false during installation (the default is true)"]}),"\n",(0,i.jsxs)(s.p,{children:["Q: Error ",(0,i.jsx)(s.code,{children:'CustomResourceDefinition "poddnats.alibabacloud.com" in namespace "" exists and cannot be imported into the cureent release'}),"\nA: This is because the CRD is already installed in the cluster and you can set cloudProvider.installCRD to false during installation (default is true)"]}),"\n",(0,i.jsx)(s.h2,{id:"whats-next",children:"What's Next"}),"\n",(0,i.jsx)(s.p,{children:"Here are some recommended next steps:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Learn kruise-game's ",(0,i.jsx)(s.a,{href:"/kruisegame/user-manuals/deploy-gameservers",children:"Deploy GameServers"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(o,{...e})}):o(e)}},28453:(e,s,r)=>{r.d(s,{R:()=>l,x:()=>d});var n=r(96540);const i={},t=n.createContext(i);function l(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),n.createElement(t.Provider,{value:s},e.children)}}}]);
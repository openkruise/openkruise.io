"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2388],{28453:(e,r,s)=>{s.d(r,{R:()=>l,x:()=>c});var i=s(96540);const n={},d=i.createContext(n);function l(e){const r=i.useContext(d);return i.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),i.createElement(d.Provider,{value:r},e.children)}},81334:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>t,contentTitle:()=>c,default:()=>o,frontMatter:()=>l,metadata:()=>i,toc:()=>h});const i=JSON.parse('{"id":"installation","title":"\u5b89\u88c5","description":"\u5b89\u88c5OpenKruiseGame\uff08OKG\uff09","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/installation.md","sourceDirName":".","slug":"/installation","permalink":"/zh/kruisegame/installation","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"OpenKruiseGame\u7b80\u4ecb","permalink":"/zh/kruisegame/introduction"},"next":{"title":"\u8bbe\u8ba1\u7406\u5ff5","permalink":"/zh/kruisegame/design-concept"}}');var n=s(74848),d=s(28453);const l={},c="\u5b89\u88c5",t={},h=[{value:"\u5b89\u88c5OpenKruiseGame\uff08OKG\uff09",id:"\u5b89\u88c5openkruisegameokg",level:2},{value:"\u5b89\u88c5\u8bf4\u660e",id:"\u5b89\u88c5\u8bf4\u660e",level:3},{value:"\u5b89\u88c5Kruise",id:"\u5b89\u88c5kruise",level:3},{value:"\u5b89\u88c5Kruise-Game",id:"\u5b89\u88c5kruise-game",level:3},{value:"\u5347\u7ea7 Kruise-Game",id:"\u5347\u7ea7-kruise-game",level:3},{value:"\u53ef\u9009\u9879",id:"\u53ef\u9009\u9879",level:3},{value:"\u53ef\u9009\uff1a\u4f7f\u7528\u81ea\u5b9a\u4e49\u914d\u7f6e\u5b89\u88c5/\u5347\u7ea7",id:"\u53ef\u9009\u4f7f\u7528\u81ea\u5b9a\u4e49\u914d\u7f6e\u5b89\u88c5\u5347\u7ea7",level:4},{value:"\u53ef\u9009\uff1a\u4e2d\u56fd\u5730\u533a\u7684\u955c\u50cf",id:"\u53ef\u9009\u4e2d\u56fd\u5730\u533a\u7684\u955c\u50cf",level:4},{value:"\u5378\u8f7dOpenKruiseGame\uff08OKG\uff09",id:"\u5378\u8f7dopenkruisegameokg",level:2},{value:"\u5e38\u89c1\u95ee\u9898",id:"\u5e38\u89c1\u95ee\u9898",level:2},{value:"What&#39;s Next",id:"whats-next",level:2}];function a(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"\u5b89\u88c5",children:"\u5b89\u88c5"})}),"\n",(0,n.jsx)(r.h2,{id:"\u5b89\u88c5openkruisegameokg",children:"\u5b89\u88c5OpenKruiseGame\uff08OKG\uff09"}),"\n",(0,n.jsx)(r.h3,{id:"\u5b89\u88c5\u8bf4\u660e",children:"\u5b89\u88c5\u8bf4\u660e"}),"\n",(0,n.jsx)(r.p,{children:"\u5b89\u88c5OpenKruiseGame\u9700\u5b89\u88c5Kruise\u4e0eKruise-Game\uff0c\u4e14\u8981\u6c42 Kubernetes\u7248\u672c >= 1.18\u3002"}),"\n",(0,n.jsx)(r.h3,{id:"\u5b89\u88c5kruise",children:"\u5b89\u88c5Kruise"}),"\n",(0,n.jsx)(r.p,{children:"\u5efa\u8bae\u91c7\u7528 helm v3.5+ \u6765\u5b89\u88c5 Kruise\u3002"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-shell",children:"# Firstly add openkruise charts repository if you haven't do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n# [Optional]\n$ helm repo update\n# Install the latest version.\n$ helm install kruise openkruise/kruise --version 1.7.0\n"})}),"\n",(0,n.jsx)(r.h3,{id:"\u5b89\u88c5kruise-game",children:"\u5b89\u88c5Kruise-Game"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-shell",children:"$ helm install kruise-game openkruise/kruise-game --version 0.10.0\n"})}),"\n",(0,n.jsx)(r.h3,{id:"\u5347\u7ea7-kruise-game",children:"\u5347\u7ea7 Kruise-Game"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-shell",children:"$ helm upgrade kruise-game openkruise/kruise-game --version 0.10.0 [--force]\n"})}),"\n",(0,n.jsx)(r.h3,{id:"\u53ef\u9009\u9879",children:"\u53ef\u9009\u9879"}),"\n",(0,n.jsx)(r.h4,{id:"\u53ef\u9009\u4f7f\u7528\u81ea\u5b9a\u4e49\u914d\u7f6e\u5b89\u88c5\u5347\u7ea7",children:"\u53ef\u9009\uff1a\u4f7f\u7528\u81ea\u5b9a\u4e49\u914d\u7f6e\u5b89\u88c5/\u5347\u7ea7"}),"\n",(0,n.jsx)(r.p,{children:"\u4e0b\u8868\u5217\u51fa\u4e86 kruise-game \u7684\u53ef\u914d\u7f6e\u53c2\u6570\u53ca\u5176\u9ed8\u8ba4\u503c\u3002"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Description"}),(0,n.jsx)(r.th,{children:"Default"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"installation.namespace"})}),(0,n.jsx)(r.td,{children:"kruise-game \u5b89\u88c5\u5230\u7684 namespace\uff0c\u4e00\u822c\u4e0d\u5efa\u8bae\u4fee\u6539"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruise-game-system"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"installation.createNamespace"})}),(0,n.jsx)(r.td,{children:"\u662f\u5426\u9700\u8981\u521b\u5efa\u4e0a\u8ff0 namespace\uff0c\u4e00\u822c\u4e0d\u5efa\u8bae\u4fee\u6539\uff0c\u9664\u975e\u6307\u5b9a\u5b89\u88c5\u5230\u5df2\u6709\u7684 ns \u4e2d"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"true"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.fullname"})}),(0,n.jsx)(r.td,{children:"kruise-game \u90e8\u7f72\u548c\u5176\u4ed6\u914d\u7f6e\u7684\u540d\u79f0"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruise-game-controller-manager"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.healthBindPort"})}),(0,n.jsx)(r.td,{children:"\u7528\u4e8e\u68c0\u67e5 kruise-game \u5bb9\u5668\u5065\u5eb7\u68c0\u67e5\u7684\u7aef\u53e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"8082"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.webhook.port"})}),(0,n.jsx)(r.td,{children:"kruise-game \u5bb9\u5668\u670d\u52a1\u7684 webhook \u7aef\u53e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"443"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.webhook.targetPort"})}),(0,n.jsx)(r.td,{children:"\u7528\u4e8e MutatingWebhookConfigurations \u4e2d\u5de5\u4f5c\u8d1f\u8f7d\u7684 ObjectSelector"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"9876"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.apiServerQps"})}),(0,n.jsx)(r.td,{children:"kruise-game-controller-manager \u6bcf\u79d2\u53d1\u9001\u5230 API server\u7684\u6700\u5927\u6301\u7eed\u67e5\u8be2\u6570"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"5"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"kruiseGame.apiServerQpsBurst"})}),(0,n.jsx)(r.td,{children:"kruise-game-controller-manager \u6bcf\u79d2\u53d1\u9001\u5230 API server\u7684\u6700\u5927\u7a81\u53d1\u67e5\u8be2\u6570"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"10"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"replicaCount"})}),(0,n.jsx)(r.td,{children:"kruise-game \u7684\u671f\u671b\u526f\u672c\u6570"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"1"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"image.repository"})}),(0,n.jsx)(r.td,{children:"kruise-game \u7684\u955c\u50cf\u4ed3\u5e93"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"openkruise/kruise-game-manager"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"image.tag"})}),(0,n.jsx)(r.td,{children:"kruise-game \u7684\u955c\u50cf\u7248\u672c"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"v0.10.0"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"image.pullPolicy"})}),(0,n.jsx)(r.td,{children:"kruise-game \u7684\u955c\u50cf\u62c9\u53d6\u7b56\u7565"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"Always"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"serviceAccount.annotations"})}),(0,n.jsx)(r.td,{children:"kruise-game\u7684serviceAccount\u6ce8\u89e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:" "})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"resources.limits.cpu"})}),(0,n.jsx)(r.td,{children:"kruise-game\u5bb9\u5668\u7684CPU\u8d44\u6e90\u9650\u5236"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"500m"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"resources.limits.memory"})}),(0,n.jsx)(r.td,{children:"kruise-game\u5bb9\u5668\u7684\u5185\u5b58\u8d44\u6e90\u9650\u5236"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"1Gi"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"resources.requests.cpu"})}),(0,n.jsx)(r.td,{children:"kruise-game\u5bb9\u5668\u7684CPU\u8d44\u6e90\u8bf7\u6c42"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"10m"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"resources.requests.memory"})}),(0,n.jsx)(r.td,{children:"kruise-game\u5bb9\u5668\u7684\u5185\u5b58\u8d44\u6e90\u8bf7\u6c42"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"64Mi"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"prometheus.enabled"})}),(0,n.jsx)(r.td,{children:"\u662f\u5426\u521b\u5efa\u6307\u6807\u76d1\u63a7\u670d\u52a1"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"true"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"prometheus.monitorService.port"})}),(0,n.jsx)(r.td,{children:"monitorService\u7684\u76d1\u542c\u7aef\u53e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"8080"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"scale.service.port"})}),(0,n.jsx)(r.td,{children:"\u4f38\u7f29\u670d\u52a1\u76d1\u542c\u7aef\u53e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"6000"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"scale.service.targetPort"})}),(0,n.jsx)(r.td,{children:"\u4f38\u7f29\u670d\u52a1\u76ee\u6807\u7aef\u53e3"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"6000"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"network.totalWaitTime"})}),(0,n.jsx)(r.td,{children:"\u7b49\u5f85\u7f51\u7edcReady\u7684\u6700\u957f\u65f6\u95f4\uff0c\u5355\u4f4d\u662f\u79d2"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"60"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"network.probeIntervalTime"})}),(0,n.jsx)(r.td,{children:"\u63a2\u6d4b\u7f51\u7edc\u72b6\u6001\u7684\u65f6\u95f4\u95f4\u9694\uff0c\u5355\u4f4d\u662f\u79d2"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"5"})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"cloudProvider.installCRD"})}),(0,n.jsx)(r.td,{children:"\u662f\u5426\u5b89\u88c5 CloudProvider \u76f8\u5173CRD\u8d44\u6e90"}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"true"})})]})]})]}),"\n",(0,n.jsxs)(r.p,{children:["\u4f7f\u7528 ",(0,n.jsx)(r.code,{children:"--set key=value[,key=value]"})," \u53c2\u6570\u6307\u5b9a\u6bcf\u4e2a\u53c2\u6570\u5230 ",(0,n.jsx)(r.code,{children:"helm install"}),",\u4f8b\u5982,"]}),"\n",(0,n.jsx)(r.h4,{id:"\u53ef\u9009\u4e2d\u56fd\u5730\u533a\u7684\u955c\u50cf",children:"\u53ef\u9009\uff1a\u4e2d\u56fd\u5730\u533a\u7684\u955c\u50cf"}),"\n",(0,n.jsx)(r.p,{children:"\u5982\u679c\u4f60\u5728\u4e2d\u56fd\u5e76\u4e14\u65e0\u6cd5\u4ece\u5b98\u65b9 DockerHub \u62c9\u53d6\u955c\u50cf\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528\u6258\u7ba1\u5728\u963f\u91cc\u4e91\u4e0a\u7684\u955c\u50cf:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"$ helm install kruise-game https://... --set image.repository=registry-cn-hangzhou.ack.aliyuncs.com/acs/kruise-game-manager\n"})}),"\n",(0,n.jsx)(r.h2,{id:"\u5378\u8f7dopenkruisegameokg",children:"\u5378\u8f7dOpenKruiseGame\uff08OKG\uff09"}),"\n",(0,n.jsx)(r.p,{children:"\u8bf7\u6ce8\u610f\uff0c\u8fd9\u5c06\u5bfc\u81f4\u5220\u9664 kruise-game \u521b\u5efa\u7684\u6240\u6709\u8d44\u6e90\uff0c\u5305\u62ec webhook \u914d\u7f6e\u3001\u670d\u52a1\u3001\u547d\u540d\u7a7a\u95f4\u3001CRD \u548c CR \u5b9e\u4f8b kruise-game \u63a7\u5236\u5668\uff01\n\u8bf7\u4ec5\u5728\u60a8\u5b8c\u5168\u4e86\u89e3\u540e\u679c\u540e\u624d\u8fd9\u6837\u505a\u3002\n\u5982\u679c\u5b89\u88c5\u4e86 helm charts\uff0c\u5219\u5378\u8f7d kruise-game:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:'$ helm uninstall kruise-game\nrelease "kruise-game" uninstalled\n'})}),"\n",(0,n.jsx)(r.h2,{id:"\u5e38\u89c1\u95ee\u9898",children:"\u5e38\u89c1\u95ee\u9898"}),"\n",(0,n.jsxs)(r.p,{children:["Q: \u51fa\u73b0\u9519\u8bef ",(0,n.jsx)(r.code,{children:'no matches for kind "ServiceMonitor" in version "monitoring.coreos.com/v1"'}),"\nA: \u8fd9\u662f\u56e0\u4e3a\u96c6\u7fa4\u5e76\u6ca1\u6709\u5b89\u88c5prometheus operator\u3002\u542f\u7528\u6e38\u620f\u670d\u76d1\u63a7\u529f\u80fd\u9700\u8981\u5b89\u88c5prometheus operator\u4e8eKubernetes\u96c6\u7fa4\u3002\u82e5\u60a8\u4e0d\u4f7f\u7528\u8be5\u529f\u80fd\uff0c\u53ef\u4ee5\u5728\u5b89\u88c5\u65f6\u5c06 prometheus.enabled \u8bbe\u7f6e\u4e3afalse\uff08\u9ed8\u8ba4\u4e3atrue\uff09"]}),"\n",(0,n.jsxs)(r.p,{children:["Q: \u51fa\u73b0\u9519\u8bef ",(0,n.jsx)(r.code,{children:'CustomResourceDefinition "poddnats.alibabacloud.com" in namespace "" exists and cannot be imported into the cureent release'}),"\nA: \u8fd9\u662f\u56e0\u4e3a\u5728\u96c6\u7fa4\u4e2d\u5df2\u7ecf\u5b89\u88c5\u4e86\u8be5CRD\uff0c\u60a8\u53ef\u4ee5\u5728\u5b89\u88c5\u65f6\u5c06cloudProvider.installCRD\u8bbe\u7f6e\u4e3afalse\uff08\u9ed8\u8ba4\u4e3atrue\uff09"]}),"\n",(0,n.jsx)(r.h2,{id:"whats-next",children:"What's Next"}),"\n",(0,n.jsx)(r.p,{children:"\u63a5\u4e0b\u6765\uff0c\u6211\u4eec\u63a8\u8350\u4f60:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["\u4e86\u89e3 kruise-game \u7684 ",(0,n.jsx)(r.a,{href:"/zh/kruisegame/user-manuals/deploy-gameservers",children:"\u90e8\u7f72\u6e38\u620f\u670d"}),"."]}),"\n"]})]})}function o(e={}){const{wrapper:r}={...(0,d.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}}}]);
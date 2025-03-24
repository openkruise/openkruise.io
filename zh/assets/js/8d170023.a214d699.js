"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4118],{19173:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/elasticd-deployment-show-3-5d95b9304548b48ddb66d73d2d03a94c.gif"},28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>l});var r=s(96540);const a={},t=r.createContext(a);function i(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(t.Provider,{value:n},e.children)}},31957:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/elasticd-deployment-arch-4226f0f7969bfd1761a6a291812abfd8.jpg"},41610:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/elasticd-deployment-show-0-db2511481b9915be5c021141de80952d.gif"},54727:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"best-practices/elastic-deployment","title":"\u57fa\u4e8eHPA\u7684\u6781\u81f4\u5f39\u6027\u8c03\u5ea6\u6700\u4f73\u5b9e\u8df5","description":"\u81ea 0.10.0 \u7248\u672c\u5f00\u59cb\uff0cOpenKruise \u63d0\u51fa\u4e86\u4e00\u79cd\u57fa\u4e8e\u65c1\u8def\uff08by-pass\uff09\u67b6\u6784\u7684\u591a\u57df\u7ba1\u7406\u7ec4\u4ef6 --- WorkloadSpread\u3002\u5b83\u5141\u8bb8\u7528\u6237\u5c06 Workload \u7684\u526f\u672c\u5728\u4e0d\u540c\u8282\u70b9\u3001\u4e0d\u540c\u673a\u623f\u3001\u751a\u81f3\u4e0d\u540c\u4e91\u5382\u5546\u4e2d\u8fdb\u884c\u591a\u57df\u5316\u7f16\u6392\uff0c\u5e76\u5141\u8bb8\u7528\u6237\u5bf9\u4e0d\u540c\u57df\u7684\u526f\u672c\u8fdb\u884c\u5dee\u5f02\u5316\u914d\u7f6e\u3002WorkloadSpread \u53ef\u4ee5\u4ee5\u65e0\u4fb5\u5165\u7684\u65b9\u5f0f\uff0c\u8d4b\u4e88\u5b58\u91cf\u7684/\u589e\u91cf\u7684 Workload \u591a\u57df\u6253\u6563\u3001\u5f39\u6027\u8c03\u5ea6\u3001\u7cbe\u7ec6\u5316\u7ba1\u7406\u7684\u80fd\u529b\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/current/best-practices/elastic-deployment.md","sourceDirName":"best-practices","slug":"/best-practices/elastic-deployment","permalink":"/zh/docs/next/best-practices/elastic-deployment","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/elastic-deployment.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"\u57fa\u4e8eHPA\u7684\u6781\u81f4\u5f39\u6027\u8c03\u5ea6\u6700\u4f73\u5b9e\u8df5"},"sidebar":"docs","previous":{"title":"CloneSet Lifecycle\uff1a\u5728 Pod \u751f\u547d\u5468\u671f\u7ba1\u7406\u4e2d\u63d2\u5165\u5b9a\u5236\u5316\u903b\u8f91","permalink":"/zh/docs/next/best-practices/cloneset-lifecycle"},"next":{"title":"BroadcastJob + Advanced CronJob \u5b9a\u671f\u6e05\u7406\u8282\u70b9\u78c1\u76d8","permalink":"/zh/docs/next/best-practices/acronjob+broadcastjob"}}');var a=s(74848),t=s(28453);const i={title:"\u57fa\u4e8eHPA\u7684\u6781\u81f4\u5f39\u6027\u8c03\u5ea6\u6700\u4f73\u5b9e\u8df5"},l=void 0,o={},c=[{value:"\u65b9\u6848",id:"\u65b9\u6848",level:2},{value:"\u65b9\u6848\u67b6\u6784",id:"\u65b9\u6848\u67b6\u6784",level:3},{value:"\u65b9\u6848\u76ee\u6807",id:"\u65b9\u6848\u76ee\u6807",level:3},{value:"\u73af\u5883\u914d\u7f6e",id:"\u73af\u5883\u914d\u7f6e",level:2},{value:"\u5b89\u88c5 OpenKruise",id:"\u5b89\u88c5-openkruise",level:3},{value:"\u5b89\u88c5 KEDA",id:"\u5b89\u88c5-keda",level:3},{value:"\u5b89\u88c5 Ingress-Nginx-Controller",id:"\u5b89\u88c5-ingress-nginx-controller",level:3},{value:"\u5b89\u88c5 Nginx-Prometheus-Exporter",id:"\u5b89\u88c5-nginx-prometheus-exporter",level:3},{value:"\u5b89\u88c5 Prometheus-Operator",id:"\u5b89\u88c5-prometheus-operator",level:3},{value:"\u6d4b\u8bd5\u73af\u5883\u914d\u7f6e\u662f\u5426\u6b63\u786e",id:"\u6d4b\u8bd5\u73af\u5883\u914d\u7f6e\u662f\u5426\u6b63\u786e",level:3},{value:"\u6d4b\u8bd5 Nginx Status \u63a5\u53e3\u662f\u5426\u6b63\u5e38",id:"\u6d4b\u8bd5-nginx-status-\u63a5\u53e3\u662f\u5426\u6b63\u5e38",level:4},{value:"\u6d4b\u8bd5 Prometheus \u6570\u636e\u91c7\u96c6\u662f\u5426\u6b63\u5e38",id:"\u6d4b\u8bd5-prometheus-\u6570\u636e\u91c7\u96c6\u662f\u5426\u6b63\u5e38",level:4},{value:"\u5f39\u6027\u90e8\u7f72",id:"\u5f39\u6027\u90e8\u7f72",level:2},{value:"\u5e94\u7528\u90e8\u7f72",id:"\u5e94\u7528\u90e8\u7f72",level:3},{value:"\u90e8\u7f72 WorkloadSpread",id:"\u90e8\u7f72-workloadspread",level:3},{value:"\u90e8\u7f72 ScaleObject",id:"\u90e8\u7f72-scaleobject",level:3},{value:"\u6548\u679c\u5c55\u793a",id:"\u6548\u679c\u5c55\u793a",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"\u81ea 0.10.0 \u7248\u672c\u5f00\u59cb\uff0cOpenKruise \u63d0\u51fa\u4e86\u4e00\u79cd\u57fa\u4e8e\u65c1\u8def\uff08by-pass\uff09\u67b6\u6784\u7684\u591a\u57df\u7ba1\u7406\u7ec4\u4ef6 --- WorkloadSpread\u3002\u5b83\u5141\u8bb8\u7528\u6237\u5c06 Workload \u7684\u526f\u672c\u5728\u4e0d\u540c\u8282\u70b9\u3001\u4e0d\u540c\u673a\u623f\u3001\u751a\u81f3\u4e0d\u540c\u4e91\u5382\u5546\u4e2d\u8fdb\u884c\u591a\u57df\u5316\u7f16\u6392\uff0c\u5e76\u5141\u8bb8\u7528\u6237\u5bf9\u4e0d\u540c\u57df\u7684\u526f\u672c\u8fdb\u884c\u5dee\u5f02\u5316\u914d\u7f6e\u3002WorkloadSpread \u53ef\u4ee5\u4ee5\u65e0\u4fb5\u5165\u7684\u65b9\u5f0f\uff0c\u8d4b\u4e88\u5b58\u91cf\u7684/\u589e\u91cf\u7684 Workload \u591a\u57df\u6253\u6563\u3001\u5f39\u6027\u8c03\u5ea6\u3001\u7cbe\u7ec6\u5316\u7ba1\u7406\u7684\u80fd\u529b\u3002"}),"\n",(0,a.jsx)(n.p,{children:"\u63a5\u4e0b\u6765\uff0c\u672c\u6587\u5c06\u57fa\u4e8e WorkloadSpread \u7684\u7279\u6027\uff0c\u4ee5\u4e00\u4e2a\u7b80\u5355\u7684 Web \u5e94\u7528\u4e3a\u4f8b\uff0c\u7ed3\u5408 KEDA\u3001Prometheus\u3001\u963f\u91cc\u4e91\u5f39\u6027\u5b9e\u4f8b\u7b49\uff0c\u6765\u5e2e\u52a9\u7528\u6237\u6784\u5efa\u4e00\u4e2a\u57fa\u4e8e\u81ea\u5b9a\u4e49\u6307\u6807\u7684\u81ea\u52a8\u5316\u6781\u81f4\u5f39\u6027\u8c03\u5ea6\u65b9\u6848\u3002"}),"\n",(0,a.jsx)(n.h2,{id:"\u65b9\u6848",children:"\u65b9\u6848"}),"\n",(0,a.jsx)(n.h3,{id:"\u65b9\u6848\u67b6\u6784",children:"\u65b9\u6848\u67b6\u6784"}),"\n",(0,a.jsxs)(n.p,{children:["\u672c\u6587\u5c06\u4f1a\u4ee5\u4e00\u4e2a PHP \u5b9e\u73b0\u7684 Hello-World Web \u7a0b\u5e8f\u6765\u6a21\u62df\u7528\u6237\u5e94\u7528\uff0c\u6574\u4f53\u65b9\u6848\u67b6\u6784\u5982\u4e0b\uff1a\n",(0,a.jsx)(n.img,{alt:"arch",src:s(31957).A+"",width:"696",height:"662"})]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"\u7279\u522b\u8bf4\u660e:"})}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"\u5728\u8be5\u65b9\u6848\u4e2d\uff0cHPA \u901a\u8fc7 KEDA \u8fdb\u884c\u7ba1\u7406\u3002KEDA \u662f\u4e00\u4e2a\u57fa\u4e8e Kubernetes HPA \u5b9e\u73b0\u7684\u52a0\u5f3a\u7248\u81ea\u52a8\u5316\u4f38\u7f29\u7ec4\u4ef6\uff0c\u76f8\u8f83\u4e8e\u539f\u751f\u7684 HPA \u7ec4\u4ef6\uff0c\u5b83\u9002\u914d\u4e86\u66f4\u4e30\u5bcc\u7684\u81ea\u5b9a\u4e49\u6307\u6807\u5ea6\u91cf\u63a5\u53e3\u3002"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"\u5728\u8be5\u65b9\u6848\u4e2d\uff0cPrometheus \u91c7\u96c6 Ingress-Nginx \u800c\u4e0d\u662f Web Pod \u7684\u6307\u6807\u6570\u636e\uff0c\u5176\u5b9e\u662f\u4e00\u4e2a\u53d6\u5de7\u7684\u64cd\u4f5c\u3002\u8fd9\u662f\u56e0\u4e3a\uff0c\u4e1a\u52a1\u63a5\u5165 Prometheus \u9700\u8981\u8fdb\u884c\u4e00\u5b9a\u7684\u4e1a\u52a1\u6539\u9020\uff0c\u8f83\u4e3a\u7e41\u7410\uff0c\u800c Nginx \u6709\u66b4\u9732\u94fe\u63a5\u6570\u76ee\u7b49\u6307\u6807\u7684\u6a21\u5757\uff0c\u5e76\u4e14\u6709\u5b98\u65b9\u5f00\u6e90\u7684 Exporter\u3002\u6700\u91cd\u8981\u7684\u662f\uff0c\u8fdb\u5165 Web Pod \u7684\u6d41\u91cf\u4e00\u5b9a\u8981\u7ecf\u8fc7 Ingress-Nginx\uff0c\u6240\u4ee5\u672c\u6587\u76f4\u63a5\u4ee5 Ingress-Nginx \u7684\u6307\u6807\u4f5c\u4e3a\u6807\u51c6\uff0c\u5bf9\u63a5 KEDA \u7ec4\u4ef6\u5b9e\u73b0\u81ea\u52a8\u5316\u6269\u7f29\u5bb9\u3002"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"\u7531\u4e8e WorkloadSpread \u9700\u8981 1.21 \u53ca\u4ee5\u4e0a\u7684 Kubernetes \u7248\u672c\u624d\u80fd\u652f\u6301 Deployment\uff08\u56e0\u4e3a\u9700\u8981 APIServer PodDeletionCost \u7279\u6027\uff0c\u8be5\u7279\u6027\u5728 1.21 \u5f00\u59cb\u652f\u6301\uff0c\u9ed8\u8ba4\u5173\u95ed\uff0c\u5728 1.22 \u7248\u672c\u5f00\u59cb\u9ed8\u8ba4\u5f00\u542f\uff09\u3002\u7136\u800c\uff0c\u672c\u6587\u91c7\u7528\u7684 ACK Kubernetes \u96c6\u7fa4\u76ee\u524d\u6700\u9ad8\u652f\u6301\u5230 1.20 \u7248\u672c\uff0c\u56e0\u6b64\uff0c\u672c\u6587\u4ee5 CloneSet \u4e3a\u4f8b\u8fdb\u884c\u6f14\u793a\uff08CloneSet \u5728 OpenKruise 0.9.0 \u5f00\u59cb\u652f\u6301 PodDeletionCost \u7279\u6027\uff09\u3002"}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u65b9\u6848\u76ee\u6807",children:"\u65b9\u6848\u76ee\u6807"}),"\n",(0,a.jsx)(n.p,{children:"\u8be5\u65b9\u6848\u5c06\u57fa\u4e8e\u4e00\u6bb5\u65f6\u95f4\u7a97\u53e3\u5185 Nginx \u6240\u5904\u7406\u8fde\u63a5\u6570\u4f5c\u4e3a\u6307\u6807\uff1a"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\u5f53\u6d41\u91cf\u9ad8\u5cf0\u5230\u6765\uff0c\u8be5\u6307\u6807\u8d85\u8fc7\u4e86\u6307\u6807\uff08\u8fd9\u91cc\u7684",(0,a.jsx)(n.strong,{children:"\u6307\u6807"})," \u53ef\u4ee5\u6839\u636e\u5b9e\u9645\u9700\u8981\u81ea\u884c\u8fdb\u884c\u5b9a\u4e49\uff09\uff0c\u5219\u8ba4\u4e3a\u9700\u8981\u8fdb\u884c\u81ea\u52a8\u6269\u5bb9\uff1b","\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\u5f53",(0,a.jsx)(n.strong,{children:"\u6269\u7f29"}),"\u65f6\uff0c\u4f18\u5148\u5c06 Pod \u6269\u5bb9\u81f3\u957f\u671f\u6301\u6709\u7684\u56fa\u5b9a\u8d44\u6e90\u6c60\uff0c\u5f53\u56fa\u5b9a\u8d44\u6e90\u6c60\u7684\u8d44\u6e90\u4e0d\u8db3\u6216 Pod \u6570\u91cf\u8fbe\u5230\u8bbe\u5b9a\u9608\u503c\u65f6\uff0c\u5219\u81ea\u52a8\u5f39\u6027\u6269\u5bb9\u5230\u5f39\u6027\u8d44\u6e90\u6c60\uff1b"]}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\u5f53\u6d41\u91cf\u9ad8\u5cf0\u8fc7\u53bb\uff0c\u5173\u6ce8\u7684\u6307\u6807\u4f4e\u4e8e\u4e86\u9608\u503c\uff0c\u5219\u8ba4\u4e3a\u9700\u8981\u8fdb\u884c\u81ea\u52a8\u7f29\u5bb9\uff1b","\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\u5f53",(0,a.jsx)(n.strong,{children:"\u7f29\u5bb9"}),"\u65f6\uff0c\u4f18\u5148\u7f29\u5bb9\u5f39\u6027\u8d44\u6e90\u6c60\u4e2d\u7684\u526f\u672c\uff1b"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"\u73af\u5883\u914d\u7f6e",children:"\u73af\u5883\u914d\u7f6e"}),"\n",(0,a.jsx)(n.p,{children:"\u672c\u6587\u5c06\u57fa\u4e8e\u963f\u91cc\u4e91 ACK \u96c6\u7fa4\u8fdb\u884c\u6f14\u793a\uff0c\u5176\u4e2d\u5171\u5305\u542b 3 \u4e2aECS\u8282\u70b9\uff0c\u6a21\u62df\u56fa\u5b9a\u8d44\u6e90\u6c60\uff0c1\u4e2a Virtual-Kubelet \u8282\u70b9\uff0c\u7528\u4e8e\u7533\u8bf7\u548c\u7ba1\u7406\u5f39\u6027\u5b9e\u4f8b\uff0c\u6a21\u62df\u5f39\u6027\u8d44\u6e90\u6c60:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ k get node\nNAME                         STATUS   ROLES    AGE    VERSION\nus-west-1.192.168.0.47       Ready    <none>   153d   v1.20.11-aliyun.1\nus-west-1.192.168.0.48       Ready    <none>   153d   v1.20.11-aliyun.1\nus-west-1.192.168.0.49       Ready    <none>   153d   v1.20.11-aliyun.1\nvirtual-kubelet-us-west-1a   Ready    agent    19d    v1.20.11-aliyun.1\n"})}),"\n",(0,a.jsx)(n.h3,{id:"\u5b89\u88c5-openkruise",children:"\u5b89\u88c5 OpenKruise"}),"\n",(0,a.jsxs)(n.p,{children:["\u66f4\u591a\u5b89\u88c5\u7ec6\u8282\u8bf7\u53c2\u8003",(0,a.jsx)(n.a,{href:"https://openkruise.io/docs/installation",children:"\u5b98\u65b9\u5b89\u88c5\u6587\u6863"}),"\uff0c\u8fd9\u91cc\u5efa\u8bae\u5b89\u88c5\u6700\u65b0\u7248\u672c\u3002"]}),"\n",(0,a.jsx)(n.h3,{id:"\u5b89\u88c5-keda",children:"\u5b89\u88c5 KEDA"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ helm repo add kedacore https://kedacore.github.io/charts\n\n$ helm repo update\n\n$ kubectl create namespace keda\n\n$ helm install keda kedacore/keda --namespace keda\n"})}),"\n",(0,a.jsx)(n.h3,{id:"\u5b89\u88c5-ingress-nginx-controller",children:"\u5b89\u88c5 Ingress-Nginx-Controller"}),"\n",(0,a.jsx)(n.p,{children:"\u9996\u5148\uff0c\u521b\u5efa\u76f8\u5e94\u7684 Namespace:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ kubectl create ns ingress-nginx\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u56e0\u4e3a Exporter \u9700\u8981\u80fd\u591f\u8bbf\u95ee Nginx Status \u63a5\u53e3\uff0c\u4ee5\u4fbf\u83b7\u53d6\u8fde\u63a5\u6570\u7b49\u57fa\u7840\u6570\u636e\u3002\u56e0\u6b64\uff0c\u5728\u5b89\u88c5\u8be5 Controller \u4e4b\u524d\uff0c\u6211\u4eec\u9700\u8981\u5148\u4e0b\u53d1\u4e00\u4e2a Nginx Configuration \u76f8\u5173\u7684 ConfigMap\uff0c\u76ee\u7684\u662f\u628a\u9ed8\u8ba4\u7684\u4e00\u4e9b\u914d\u7f6e\u8fdb\u884c\u8986\u76d6\uff0c\u5c06 Status \u63a5\u53e3\u66b4\u9732\u51fa\u6765\uff0c\u4f9b Nginx-Prometheus-Exporter \u6d88\u8d39:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\ndata:\n  allow-snippet-annotations: "true"\n  http-snippet: |\n    server {\n      listen 8080;\n      server_name _ ;\n      location /stub_status {\n        stub_status on;\n      }\n\n      location / {\n        return 404;\n      }\n    }\nkind: ConfigMap\nmetadata:\n  annotations:\n    meta.helm.sh/release-name: ingress-nginx\n    meta.helm.sh/release-namespace: ingress-nginx\n  labels:\n    app.kubernetes.io/component: controller\n    app.kubernetes.io/instance: ingress-nginx\n    app.kubernetes.io/managed-by: Helm\n    app.kubernetes.io/name: ingress-nginx\n    app.kubernetes.io/version: 1.1.0\n    helm.sh/chart: ingress-nginx-4.0.13\n  name: ingress-nginx-controller\n  namespace: ingress-nginx\n'})}),"\n",(0,a.jsxs)(n.p,{children:["\u51c6\u5907\u4e00\u4e2a ",(0,a.jsx)(n.code,{children:"values.yaml"})," \u6587\u4ef6\uff0c\u4ee5\u4fbf\u5728\u90e8\u7f72 Ingress-Nginx-Controller Deployment \u65f6\u5c06 8080 \u7aef\u53e3\u66b4\u9732\u51fa\u6765:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"# values.yaml\ncontroller:\n  containerPort:\n    http: 80\n    https: 443\n    status: 8080\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u5b89\u88c5\u90e8\u7f72 Ingress-Nginx-Controller:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --values values.yaml\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u56e0\u4e3a Ingress-Nginx-Controller 80 \u548c 443 \u7aef\u53e3\u662f\u5bf9\u5916\u63d0\u4f9b\u670d\u52a1\uff0c\u4f7f\u7528\u7684\u662f LoadBalancer \u7c7b\u578b\u7684Service\uff0c\u800c 8080 \u7aef\u53e3\u53ea\u662f\u4e3a\u4e86\u66b4\u9732\u7ed9 Exporter\uff0c\u800c Exporter \u548c Prometheus \u5b8c\u5168\u53ef\u4ee5\u90e8\u7f72\u5728\u96c6\u7fa4\u5185\u90e8\uff0c\u53ea\u5bf9\u5185\u63d0\u4f9b\u670d\u52a1\uff0c\u56e0\u6b64\u6b64\u5904\u5e94\u4f7f\u7528 ClusterIP \u7c7b\u578b Service \u6765\u5bf9\u63a5 Nginx 8080 \u7aef\u53e3\uff0c\u4f7f\u5176\u53ea\u5728\u96c6\u7fa4\u5185\u90e8\u66b4\u9732:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"kind: Service\napiVersion: v1\nmetadata:\n  name: ingress-nginx-controller-8080\n  namespace: ingress-nginx\nspec:\n  selector:\n    app.kubernetes.io/component: controller\n    app.kubernetes.io/instance: ingress-nginx\n    app.kubernetes.io/name: ingress-nginx\n  type:  ClusterIP\n  ports:\n  - name: myapp\n    port:  8080\n    targetPort: status\n"})}),"\n",(0,a.jsx)(n.h3,{id:"\u5b89\u88c5-nginx-prometheus-exporter",children:"\u5b89\u88c5 Nginx-Prometheus-Exporter"}),"\n",(0,a.jsx)(n.p,{children:"nginx \u66b4\u9732\u51fa\u7684 Status \u6570\u636e\u5e76\u672a\u9075\u5faa Prometheus \u7684\u683c\u5f0f\u6807\u51c6\uff0c\u56e0\u6b64\u9700\u8981\u4e00\u4e2a Exporter \u7ec4\u4ef6\u8fdb\u884c\u6570\u636e\u91c7\u96c6\u548c\u683c\u5f0f\u8f6c\u6362\uff0c\u6b64\u5904\u91c7\u7528 Nginx \u5b98\u65b9\u63d0\u4f9b\u7684 Nginx-Prometheus-Exporter:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ingress-nginx-exporter\n  namespace: ingress-nginx\n  labels:\n    app: ingress-nginx-exporter\nspec:\n  selector:\n    matchLabels:\n      app: ingress-nginx-exporter\n  strategy:\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 1\n    type: RollingUpdate\n  template:\n    metadata:\n      labels:\n        app: ingress-nginx-exporter\n    spec:\n      containers:\n      - image: nginx/nginx-prometheus-exporter:0.10\n        imagePullPolicy: IfNotPresent\n        args:\n        - -nginx.scrape-uri=http://ingress-nginx-controller-8080.ingress-nginx.svc.cluster.local:8080/stub_status\n        name: main\n        ports:\n        - name: http\n          containerPort: 9113\n          protocol: TCP\n        resources:\n          limits:\n            cpu: "200m"\n            memory: "256Mi"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"\u5b89\u88c5-prometheus-operator",children:"\u5b89\u88c5 Prometheus-Operator"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts\n\n$ helm repo update\n\n$ helm install [RELEASE]  prometheus-community/kube-prometheus-stack --namespace prometheus --create-namespace\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\u672c\u6587 ",(0,a.jsx)(n.code,{children:"[RELEASE]"})," \u8bbe\u7f6e\u4e3a ",(0,a.jsx)(n.code,{children:"kube-prometheus-stack-1640678515"}),", \u8fd9\u4e32\u5b57\u7b26\u51b3\u5b9a\u4e86\u540e\u7eed\u7684\u4e00\u4e9b\u914d\u7f6e\uff0c\u5982\u9700\u6539\u52a8\uff0c\u540e\u7eed\u4e00\u4e9b yaml \u6587\u4ef6\u4e2d\u7684\u4e00\u4e9b\u914d\u7f6e\u4e5f\u9700\u6539\u52a8\u3002"]}),"\n",(0,a.jsx)(n.p,{children:"Prometheus \u5b89\u88c5\u5b8c\u6210\u540e\u4e0b\u53d1 ServiceMonitor, \u6765\u76d1\u63a7 Ingress-Nginx \u66b4\u9732\u51fa\u7684\u6307\u6807:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  labels:\n    release: kube-prometheus-stack-1640678515\n  name: ingress-nginx-monitor\n  namespace: ingress-nginx\nspec:\n  selector:\n    matchLabels:\n      app: ingress-nginx-exporter\n  endpoints:\n  - interval: 10s\n    port: exporter\n"})}),"\n",(0,a.jsx)(n.h3,{id:"\u6d4b\u8bd5\u73af\u5883\u914d\u7f6e\u662f\u5426\u6b63\u786e",children:"\u6d4b\u8bd5\u73af\u5883\u914d\u7f6e\u662f\u5426\u6b63\u786e"}),"\n",(0,a.jsx)(n.p,{children:"\u4e0a\u8ff0\u73af\u5883\u5b89\u88c5\u914d\u7f6e\u5b8c\u6210\u540e\uff0c\u6211\u4eec\u9700\u8981\u5148\u68c0\u67e5\u4e00\u4e0b\u73af\u5883\u914d\u7f6e\u7684\u6b63\u786e\u6027\u3002"}),"\n",(0,a.jsx)(n.h4,{id:"\u6d4b\u8bd5-nginx-status-\u63a5\u53e3\u662f\u5426\u6b63\u5e38",children:"\u6d4b\u8bd5 Nginx Status \u63a5\u53e3\u662f\u5426\u6b63\u5e38"}),"\n",(0,a.jsx)(n.p,{children:"\u9996\u5148\uff0c\u6211\u4eec\u968f\u4fbf\u62c9\u8d77\u4e00\u4e2a\u5e26 shell \u548c curl \u7b49\u5de5\u5177\u7684 Pod\uff0c\u4f8b\u5982:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nmetadata:\n  name: centos\n  namespace: ingress-nginx\nspec:\n  containers:\n  - name: main\n    image: centos:latest\n    command: ["/bin/sh", "-c", "sleep 100000000"]\n    resources:\n      limits:\n        memory: "512Mi"\n        cpu: "500m"\n    ports:\n      - containerPort: 8080\n'})}),"\n",(0,a.jsx)(n.p,{children:"\u7136\u540e\uff0c\u767b\u5165\u8be5 Pod main \u5bb9\u5668\u8fdb\u884c\u8fde\u63a5\u6d4b\u8bd5:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:"$ k exec busybox -n ingress-nginx -it -- /bin/sh\nsh-4.4# curl -L http://ingress-nginx-controller-8080.ingress-nginx.svc.cluster.local:8080/stub_status\n\nActive connections: 6\nserver accepts handled requests\n 12092 12092 23215\nReading: 0 Writing: 1 Waiting: 5\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u5982\u6267\u884c\u4e0a\u8ff0 curl \u540e\u8f93\u51fa\u7c7b\u4f3c\u5185\u5bb9\uff0c\u5219\u8868\u793a\u63a5\u53e3\u6b63\u5e38\u3002"}),"\n",(0,a.jsx)(n.h4,{id:"\u6d4b\u8bd5-prometheus-\u6570\u636e\u91c7\u96c6\u662f\u5426\u6b63\u5e38",children:"\u6d4b\u8bd5 Prometheus \u6570\u636e\u91c7\u96c6\u662f\u5426\u6b63\u5e38"}),"\n",(0,a.jsx)(n.p,{children:"\u6211\u4eec\u901a\u8fc7 Helm \u5b89\u88c5 Prometheus-Operator \u65f6\uff0c\u5176\u5b9e\u4e5f\u5df2\u7ecf\u5c06 Grafana \u5b89\u88c5\u4e0a\u4e86\u3002\u56e0\u6b64\uff0c\u6211\u4eec\u53ef\u4ee5\u767b\u5165 Grafana \u8fd9\u4e2a\u53ef\u89c6\u5316\u5de5\u5177\uff0c\u6765\u67e5\u770b\u6211\u4eec\u60f3\u8981\u7684 Nginx \u7684\u6307\u6807\u6709\u6ca1\u6709\u88ab\u91c7\u96c6\u5230\u3002\n\u56e0\u4e3a Grafana \u4e5f\u90e8\u7f72\u5728 ACK \u96c6\u7fa4\uff0c\u8282\u70b9\u5728\u8fdc\u7aef\uff0c\u56e0\u6b64\u60f3\u8981\u4f7f\u7528\u672c\u5730\u6d4f\u89c8\u5668\u8bbf\u95ee Grafana\uff0c\u6211\u4eec\u9700\u8981\u6539\u52a8\u4e00\u4e0b Grafana Service Type\uff0c\u5c06\u5176\u6539\u4e3a LoadBalancer \u7c7b\u578b\uff0c\u8fd9\u6837 ACK \u4f1a\u81ea\u52a8\u7ed9 Grafana \u5206\u914d\u4e00\u4e2a\u5916\u90e8\u5730\u5740\u3002\u62ff\u5230\u8fd9\u4e2a\u5916\u90e8\u5730\u5740\uff0c\u6211\u4eec\u5c31\u53ef\u4ee5\u4f7f\u7528\u672c\u5730\u6d4f\u89c8\u5668\u8bbf\u95ee Grafana\u3002 Grafana \u521d\u59cb\u8d26\u53f7\u5bc6\u7801\u53ef\u4ee5\u4ece\u76f8\u5e94\u7684 Secret \u4e2d\u89e3\u6790\u5f97\u5230:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"user: admin\npassword: prom-operator\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u767b\u5165 Grafana \u540e\uff0c\u70b9\u51fb\u5de6\u4fa7\u5bfc\u822a\u680f\u4e2d\u7684 Explore \uff0c\u5728 Metrics browser \u4e2d\u53ef\u4ee5\u770b\u5230 Prometheus \u91c7\u96c6\u5b58\u50a8\u7684\u6307\u6807\u5217\u8868\uff0c\u5982\u679c\u6211\u4eec\u5173\u6ce8\u7684\u6307\u6807\u5b58\u5728\uff0c\u5219\u8868\u793a\u91c7\u96c6\u6210\u529f\u3002"}),"\n",(0,a.jsx)(n.h2,{id:"\u5f39\u6027\u90e8\u7f72",children:"\u5f39\u6027\u90e8\u7f72"}),"\n",(0,a.jsx)(n.p,{children:"\u5b8c\u6210\u4e0a\u8ff0\u73af\u5883\u51c6\u5907\u5c31\u7eea\uff0c\u5e76\u786e\u8ba4\u4e00\u5207\u6b63\u5e38\u540e\uff0c\u63a5\u4e0b\u6765\u4fbf\u53ef\u4ee5\u90e8\u7f72\u5e94\u7528\u4ee5\u53ca\u5f39\u6027\u7ec4\u4ef6\u3002"}),"\n",(0,a.jsx)(n.h3,{id:"\u5e94\u7528\u90e8\u7f72",children:"\u5e94\u7528\u90e8\u7f72"}),"\n",(0,a.jsx)(n.p,{children:"\u4ee5 Hello-Web \u5e94\u7528\u4e3a\u4f8b\uff0c\u8bbf\u95ee\u8be5\u5e94\u7528\u4f1a\u8fd4\u56de\u4e00\u4e2a\u7b80\u5355\u7684 html \u9875\u9762\uff0c\u5185\u5bb9\u7c7b\u4f3c\u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"Hello Web\nCurrent Backend Server Info\nServer Name: hello-web-57b767f456-bnw24\nServer IP: 47.89.252.93\nServer Port: 80\nCurrent Client Request Info\nRequest Time Float: 1640766227.537\nClient IP: 10.64.0.65\nClient Port: 52230\nUser Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36\nRequest Method: GET\nThank you for using PHP.\nRequest URI: /\n"})}),"\n",(0,a.jsx)(n.p,{children:"\u4f7f\u7528 CloneSet \u5c06\u5176\u8fdb\u884c\u90e8\u7f72\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  name: hello-web\n  namespace: ingress-nginx\n  labels:\n    app: hello-web\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: hello-web\n  template:\n    metadata:\n      labels:\n        app: hello-web\n    spec:\n      containers:\n      - name: hello-web\n        image: zhangsean/hello-web\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            cpu: "1"\n            memory: "256Mi"\n          limits:\n            cpu: "2"\n            memory: "512Mi"\n---\nkind: Service\napiVersion: v1\nmetadata:\n  name: hello-web\n  namespace: ingress-nginx\nspec:\n  type: ClusterIP\n  selector:\n    app: hello-web\n  ports:\n  - protocol: TCP\n    port: 80\n    targetPort: 80\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: ingress-web\n  namespace: ingress-nginx\nspec:\n  rules:\n  - http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: hello-web\n            port:\n              number: 80\n  ingressClassName: nginx\n'})}),"\n",(0,a.jsx)(n.h3,{id:"\u90e8\u7f72-workloadspread",children:"\u90e8\u7f72 WorkloadSpread"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-sample\n  namespace: ingress-nginx\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: ingress-nginx-controller\n  scheduleStrategy:\n    type: Adaptive\n    adaptive:\n      rescheduleCriticalSeconds: 2\n  subsets:\n  - name: fixed-resource-pool\n    requiredNodeSelectorTerm:\n      matchExpressions:\n        - key: type\n          operator: NotIn\n          values:\n          - virtual-kubelet\n    patch:\n      metadata:\n        labels:\n          resource-pool: fixed\n  - name: elastic-resource-pool\n    requiredNodeSelectorTerm:\n      matchExpressions:\n        - key: type\n          operator: In\n          values:\n          - virtual-kubelet\n    tolerations:\n    - effect: NoSchedule\n      key: virtual-kubelet.io/provider\n      operator: Exists\n    patch:\n      metadata:\n        labels:\n          resource-pool: elastic\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\u4e0a\u8ff0 WorkloadSpread \u5171\u5305\u542b\u4e24\u4e2a Subset\uff0c\u5206\u522b\u5bf9\u5e94\u56fa\u5b9a\u8d44\u6e90\u6c60\u548c\u5f39\u6027\u8d44\u6e90\u6c60\u3002\u6211\u4eec\u671f\u671b\u540d\u4e3a ",(0,a.jsx)(n.code,{children:"hello-web"})," \u7684 CloneSet \u5c3d\u91cf\u5730\u5148\u5c06 Pod \u5f80\u56fa\u5b9a\u8d44\u6e90\u6c60\u53bb\u8c03\u5ea6\uff0c\u5f53\u8be5\u8d44\u6e90\u6c60\u4e0d\u53ef\u8c03\u5ea6\u65f6\uff0c\u518d\u5f80\u5f39\u6027\u8d44\u6e90\u6c60\u53bb\u8c03\u5ea6\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["WorkloadSpread \u7684\u5927\u6982\u539f\u7406\u662f\u5229\u7528\u4e86 Kubernetes \u7684 Webhook \u673a\u5236\u3002\u5f53 APIServer \u6536\u5230\u76f8\u5e94 Pod \u7684\u521b\u5efa\u8bf7\u6c42\u65f6\uff0c\u4f1a\u8c03\u7528 Kruise Webhook\uff0c\u5c06\u76f8\u5e94\u7684 WorkloadSpread \u7684\u8c03\u5ea6\u89c4\u5219\u6ce8\u5165\u5230 Pod\u3002WorkloadSpread \u5728\u6ce8\u5165\u65f6\u91c7\u7528\u7684\u662f\u8ffd\u52a0\u673a\u5236\uff0c\u800c\u4e0d\u662f\u66ff\u6362\u673a\u5236\u3002\u4f8b\u5982\uff0c\u5047\u8bbe Pod \u672c\u8eab\u5df2\u7ecf\u6709\u4e86\u4e00\u4e9b ",(0,a.jsx)(n.code,{children:"requiredNodeSelectorTerm"})," \u6216\u8005 ",(0,a.jsx)(n.code,{children:"Tolerations"})," \u89c4\u5219\u5b9a\u4e49\uff0c WorkloadSpread \u4f1a\u5728\u8fd9\u4e9b\u5df2\u6709\u914d\u7f6e\u7684\u57fa\u7840\u4e0a\uff0c\u628a Subset \u4e2d\u7684\u8c03\u5ea6\u89c4\u5219 ",(0,a.jsx)(n.code,{children:"append"})," \u4e0a\u53bb\u3002\n\u56e0\u6b64\uff0c\u6211\u4eec\u5efa\u8bae\uff1a"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\u5c06\u4e00\u4e9b ",(0,a.jsx)(n.strong,{children:"\u5171\u6709\u7684"}),"\u3001",(0,a.jsx)(n.strong,{children:"\u4e0d\u8f7b\u6613\u6539\u53d8"})," \u7684\u8c03\u5ea6\u89c4\u5219\u5199\u5230 Workload\uff0c\u6700\u597d\u80fd\u4fdd\u8bc1\u4e0d\u7ecf\u8fc7 WorkloadSpread \u4e5f\u80fd\u8c03\u5ea6\u6210\u529f;"]}),"\n",(0,a.jsx)(n.li,{children:"\u5c06 Subset \u4e2a\u6027\u5316\u7684\u8c03\u5ea6\u89c4\u5219\uff0c\u914d\u7f6e\u5230 WorkloadSpread Subset\uff1b"}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u90e8\u7f72-scaleobject",children:"\u90e8\u7f72 ScaleObject"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: ingress-nginx-scaledobject\n  namespace: ingress-nginx\nspec:\n  maxReplicaCount: 10\n  minReplicaCount: 1\n  pollingInterval: 10\n  cooldownPeriod:  2\n  advanced:\n    horizontalPodAutoscalerConfig:\n      behavior:\n        scaleDown:\n          stabilizationWindowSeconds: 10\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: hello-web\n  triggers:\n  - type: prometheus\n    metadata:\n      serverAddress: http://kube-prometheus-stack-1640-prometheus.prometheus:9090/\n      metricName: nginx_http_requests_total\n      query: sum(rate(nginx_http_requests_total{job=\"ingress-nginx-exporter\"}[12s]))\n      threshold: '100'\n"})}),"\n",(0,a.jsx)(n.h2,{id:"\u6548\u679c\u5c55\u793a",children:"\u6548\u679c\u5c55\u793a"}),"\n",(0,a.jsx)(n.p,{children:"\u9996\u5148\uff0c\u68c0\u67e5\u4e00\u4e0b\u914d\u7f6e\u662f\u5426\u90fd\u5df2\u7ecf\u4e0b\u53d1:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"result-show-0",src:s(41610).A+"",width:"720",height:"450"})}),"\n",(0,a.jsxs)(n.p,{children:["\u7136\u540e\uff0c\u4f7f\u7528 ",(0,a.jsx)(n.a,{href:"https://github.com/link1st/go-stress-testing",children:"go-stress-testing"})," \u538b\u6d4b\u5de5\u5177\u5bf9\u4e0a\u8ff0\u5e94\u7528\u8fdb\u884c\u538b\u6d4b\u3002"]}),"\n",(0,a.jsx)(n.p,{children:"\u5f53\u7b2c\u4e00\u6ce2\u6d41\u91cf\u5230\u6765\uff0c\u53ef\u4ee5\u770b\u5230\u5e94\u7528\u6b63\u5728\u81ea\u52a8\u6269\u5bb9\uff0c\u5e76\u4e14\u6269\u5bb9\u5230\u56fa\u5b9a\u8d44\u6e90\u6c60:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"result-show-1",src:s(81203).A+"",width:"720",height:"450"})}),"\n",(0,a.jsx)(n.p,{children:"\u5f53\u7b2c\u4e8c\u6ce2\u6d41\u91cf\u9ad8\u5cf0\u5230\u6765\uff0c\u56fa\u5b9a\u8d44\u6e90\u6c60\u7684\u8d44\u6e90\u9010\u6e10\u4e0d\u8db3\uff0c\u5f00\u59cb\u6269\u5bb9\u5230\u5f39\u6027\u8d44\u6e90\u6c60:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"result-show-2",src:s(90508).A+"",width:"720",height:"450"})}),"\n",(0,a.jsx)(n.p,{children:"\u9ad8\u5cf0\u6d41\u91cf\u8fc7\u53bb\uff0c\u5e94\u7528\u5f00\u59cb\u81ea\u52a8\u7f29\u5bb9\uff0c\u9996\u5148\u4f1a\u7f29\u6389\u5f39\u6027\u8d44\u6e90\u6c60\u4e2d\u7684\u526f\u672c\uff0c\u7b49\u5f39\u6027\u8d44\u6e90\u7f29\u5bb9\u5b8c\u6bd5\uff0c\u518d\u7f29\u5bb9\u56fa\u5b9a\u8d44\u6e90\u6c60\u4e2d\u7684\u526f\u672c:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"result-show-3",src:s(19173).A+"",width:"720",height:"450"})})]})}function p(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},81203:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/elasticd-deployment-show-1-28efe334596ab3b8cd920652bfaaf443.gif"},90508:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/elasticd-deployment-show-2-2422476e73ec3a34da0d9a24baa605cb.gif"}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3918],{20408:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/socket2-5a39c7e6c00e67aa74b5f0938a3d1c2d.png"},25516:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>t,default:()=>g,frontMatter:()=>a,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"blog-video/higress","title":"Higress \xd7 OpenKruiseGame \u6e38\u620f\u7f51\u5173\u6700\u4f73\u5b9e\u8df5","description":"\u4f5c\u8005\uff1a\u8d75\u4f1f\u57fa/\u5218\u79cb\u9633/\u5f20\u6dfb\u7ffc","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/blog-video/higress.md","sourceDirName":"blog-video","slug":"/blog-video/higress","permalink":"/zh/kruisegame/blog-video/higress","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u51a0\u8d62\u4e92\u5a31\u57fa\u4e8eOpenKrusieGame\u5b9e\u73b0\u6e38\u620f\u4e91\u539f\u751f\u67b6\u6784\u5347\u7ea7","permalink":"/zh/kruisegame/blog-video/guanying-20231129"},"next":{"title":"Cloud Forward | \u4e91\u539f\u751f\u6e38\u620f\u7cfb\u5217\u89c6\u9891","permalink":"/zh/kruisegame/blog-video/cloud-forward-okg"}}');var i=n(74848),o=n(28453);const a={},t="Higress \xd7 OpenKruiseGame \u6e38\u620f\u7f51\u5173\u6700\u4f73\u5b9e\u8df5",c={},l=[{value:"Higress \u65e0\u7f1d\u63a5\u5165 OKG",id:"higress-\u65e0\u7f1d\u63a5\u5165-okg",level:2},{value:"Nginx reload \u65e0\u6cd5\u4f18\u96c5\u70ed\u66f4\u65b0",id:"nginx-reload-\u65e0\u6cd5\u4f18\u96c5\u70ed\u66f4\u65b0",level:2},{value:"Higress \u5982\u4f55\u5b9e\u73b0\u4f18\u96c5\u70ed\u66f4\u65b0",id:"higress-\u5982\u4f55\u5b9e\u73b0\u4f18\u96c5\u70ed\u66f4\u65b0",level:2}];function d(e){const s={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.header,{children:(0,i.jsx)(s.h1,{id:"higress--openkruisegame-\u6e38\u620f\u7f51\u5173\u6700\u4f73\u5b9e\u8df5",children:"Higress \xd7 OpenKruiseGame \u6e38\u620f\u7f51\u5173\u6700\u4f73\u5b9e\u8df5"})}),"\n",(0,i.jsxs)(s.blockquote,{children:["\n",(0,i.jsx)(s.p,{children:"\u4f5c\u8005\uff1a\u8d75\u4f1f\u57fa/\u5218\u79cb\u9633/\u5f20\u6dfb\u7ffc"}),"\n",(0,i.jsx)(s.p,{children:"\u65f6\u95f4\uff1a2024-01-24"}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"OpenKruiseGame\uff08OKG\uff09\u662f\u4e00\u4e2a\u9762\u5411\u591a\u4e91\u7684\u5f00\u6e90\u6e38\u620f\u670d Kubernetes \u5de5\u4f5c\u8d1f\u8f7d\uff0c\u662f CNCF \u5de5\u4f5c\u8d1f\u8f7d\u5f00\u6e90\u9879\u76ee OpenKruise \u5728\u6e38\u620f\u9886\u57df\u7684\u5b50\u9879\u76ee\uff0c\u5176\u63d0\u4f9b\u4e86\u70ed\u66f4\u65b0\u3001\u539f\u5730\u5347\u7ea7\u3001\u5b9a\u5411\u7ba1\u7406\u7b49\u5e38\u7528\u7684\u6e38\u620f\u670d\u7ba1\u7406\u529f\u80fd\u3002\u800c\u6e38\u620f\u4f5c\u4e3a\u5178\u578b\u7684\u6d41\u91cf\u5bc6\u96c6\u578b\u573a\u666f\uff0c\u5728\u541e\u5410\u91cf\u3001\u5ef6\u8fdf\u6027\u80fd\u3001\u5f39\u6027\u4e0e\u5b89\u5168\u6027\u7b49\u65b9\u9762\u5bf9\u5165\u53e3\u7f51\u5173\u63d0\u51fa\u4e86\u5f88\u9ad8\u7684\u8981\u6c42\u3002"}),"\n",(0,i.jsx)(s.p,{children:"Higress \u662f\u57fa\u4e8e\u963f\u91cc\u5185\u90e8\u4e24\u5e74\u591a\u7684 Envoy \u7f51\u5173\u5b9e\u8df5\u6c89\u6dc0\uff0c\u4ee5\u5f00\u6e90 Istio \u4e0e Envoy \u4e3a\u6838\u5fc3\u6784\u5efa\u7684\u4e0b\u4e00\u4ee3\u4e91\u539f\u751f\u7f51\u5173\u3002Higress \u5b9e\u73b0\u4e86\u5b89\u5168\u9632\u62a4\u7f51\u5173\u3001\u6d41\u91cf\u7f51\u5173\u3001\u5fae\u670d\u52a1\u7f51\u5173\u4e09\u5c42\u7f51\u5173\u5408\u4e00\uff0c\u53ef\u4ee5\u663e\u8457\u964d\u4f4e\u7f51\u5173\u7684\u90e8\u7f72\u548c\u8fd0\u7ef4\u6210\u672c\u3002Higress \u53ef\u4ee5\u4f5c\u4e3a K8s \u96c6\u7fa4\u7684 Ingress \u5165\u53e3\u7f51\u5173\uff0c\u5e76\u4e14\u517c\u5bb9\u4e86\u5927\u91cf K8s Nginx Ingress \u7684\u6ce8\u89e3\uff0c\u53ef\u4ee5\u4ece K8s Nginx Ingress \u5feb\u901f\u5e73\u6ed1\u8fc1\u79fb\u5230 Higress\u3002\u540c\u65f6\u4e5f\u652f\u6301 K8s Gateway API \u6807\u51c6\uff0c\u652f\u6301\u7528\u6237\u4ece Ingress API \u5e73\u6ed1\u8fc1\u79fb\u5230 Gateway API\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u672c\u6587\u5c06\u6f14\u793a Higress \u5982\u4f55\u65e0\u7f1d\u5bf9\u63a5 OKG \u6e38\u620f\u670d\uff0c\u5e76\u4e3a\u5176\u5e26\u6765\u7684\u4f18\u79c0\u7279\u6027"}),"\n",(0,i.jsx)(s.h2,{id:"higress-\u65e0\u7f1d\u63a5\u5165-okg",children:"Higress \u65e0\u7f1d\u63a5\u5165 OKG"}),"\n",(0,i.jsx)(s.p,{children:"\u524d\u7f6e\u6b65\u9aa4\uff1a"}),"\n",(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.a,{href:"/zh/kruisegame/installation",children:"\u5b89\u88c5 OpenKruiseGame"}),"\u3002"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.a,{href:"https://higress.io/zh-cn/docs/user/quickstart/",children:"\u5b89\u88c5 Higress"}),"\u3002"]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"OKG \u63d0\u4f9b\u8bf8\u591a\u6e38\u620f\u670d\u70ed\u66f4\u65b0\u548c\u6e38\u620f\u670d\u4f38\u7f29\u7684\u4f18\u79c0\u7279\u6027\uff0c\u4fbf\u4e8e\u6e38\u620f\u8fd0\u7ef4\u4eba\u5458\u7ba1\u7406\u6e38\u620f\u670d\u7684\u5168\u751f\u547d\u5468\u671f\u3002\u6e38\u620f\u4e0d\u540c\u4e8e\u65e0\u72b6\u6001\u7c7b\u578b\u7684\u670d\u52a1\uff0c\u73a9\u5bb6\u6218\u6597\u7684\u7f51\u7edc\u6d41\u91cf\u662f\u4e0d\u5141\u8bb8\u88ab\u8d1f\u8f7d\u5747\u8861\u7684\uff0c\u56e0\u6b64\u6bcf\u4e00\u4e2a\u6e38\u620f\u670d\u9700\u8981\u72ec\u7acb\u7684\u8bbf\u95ee\u5730\u5740\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u4f7f\u7528\u539f\u751f\u5de5\u4f5c\u8d1f\u8f7d\uff08\u5982 Deployment \u6216 StatefulSet\uff09\u65f6\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u9700\u8981\u4e3a\u4f17\u591a\u6e38\u620f\u670d\u4e00\u4e00\u914d\u7f6e\u63a5\u5165\u5c42\u7f51\u7edc\uff0c\u8fd9\u65e0\u7591\u963b\u788d\u4e86\u5f00\u670d\u6548\u7387\uff0c\u540c\u65f6\u624b\u52a8\u914d\u7f6e\u4e5f\u65e0\u5f62\u4e2d\u589e\u52a0\u4e86\u6545\u969c\u7684\u6982\u7387\u3002OKG \u63d0\u4f9b\u7684 GameServerSet \u5de5\u4f5c\u8d1f\u8f7d\u53ef\u4ee5\u81ea\u52a8\u5316\u5730\u7ba1\u7406\u6e38\u620f\u670d\u7684\u63a5\u5165\u7f51\u7edc\uff0c\u5927\u5e45\u5ea6\u964d\u4f4e\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u7684\u8d1f\u62c5\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u5bf9\u4e8e TCP/UDP \u7f51\u7edc\u6e38\u620f\uff0cOKG \u63d0\u4f9b\u4e86\u8bf8\u5982 HostPort\u3001SLB\u3001NATGW \u7b49\u7f51\u7edc\u6a21\u578b\uff1b\u800c\u5bf9\u4e8e H5/WebSocket \u7c7b\u578b\u7684\u7f51\u7edc\u6e38\u620f\uff0cOKG \u4e5f\u76f8\u5e94\u63d0\u4f9b\u4e86 Ingress \u7f51\u7edc\u6a21\u578b\uff0c\u5982 Higress\u3001Nginx\u3001ALB \u7b49\u3002"}),"\n",(0,i.jsx)("img",{src:n(77414).A}),"\n",(0,i.jsx)(s.p,{children:'\u672c\u6587\u91c7\u7528\u4e86\u4e00\u6b3e\u5f00\u6e90\u6e38\u620f Posio \u6765\u6784\u5efa demo \u6e38\u620f\u670d\u3002\u4e0b\u8ff0\u914d\u7f6e\u4e2d\uff0cIngressClassName="higress" \u6307\u5b9a\u4e86 Higress \u4f5c\u4e3a\u6e38\u620f\u670d\u7684\u7f51\u7edc\u5c42\uff0cHigress \u901a\u8fc7\u4e0b\u9762\u914d\u7f6e\u53ef\u4ee5\u65e0\u7f1d\u63a5\u5165 Posio \u6e38\u620f\u670d\uff0c\u5e76\u4e14\u53ef\u4ee5\u57fa\u4e8e Annotation \u5b9e\u73b0 Higress \u5b9a\u4e49\u7684\u9ad8\u9636\u6d41\u91cf\u6cbb\u7406\u7b49\u529f\u80fd\u3002\u793a\u4f8b Yaml \u5982\u4e0b\u6240\u793a\uff0cGameServerSet \u751f\u6210\u7684\u6e38\u620f\u670d\u5bf9\u5e94\u7684\u8bbf\u95ee\u57df\u540d\u4e0e\u6e38\u620f\u670d ID \u76f8\u5173\u3002'}),"\n",(0,i.jsx)(s.p,{children:"\u5728\u6b64\u4f8b\u4e2d\uff0c\u6e38\u620f\u670d 0 \u7684\u8bbf\u95ee\u57df\u540d\u4e3a game0.postio.example.com\uff0c\u6e38\u620f\u670d 1 \u7684\u8bbf\u95ee\u57df\u540d\u4e3a game1.postio.example.com. \u5ba2\u6237\u7aef\u4ee5\u6b64\u6765\u8bbf\u95ee\u4e0d\u540c\u7684\u6e38\u620f\u670d\u3002"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:'piVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: postio\n  namespace: default\nspec:\n  replicas: 1\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n  network:\n    networkType: Kubernetes-Ingress\n    networkConf:\n    - name: IngressClassName\n      value: "higress"\n    - name: Port\n      value: "5000"\n    - name: Path\n      value: /\n    - name: PathType\n      value: Prefix\n    - name: Host\n      value: game<id>.postio.example.com\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/posio:8-24\n          name: postio\n'})}),"\n",(0,i.jsxs)(s.p,{children:["OKG ",(0,i.jsx)(s.a,{href:"/zh/kruisegame/user-manuals/gameservers-scale",children:"\u6c34\u5e73\u4f38\u7f29"}),"\u63d0\u4f9b\u81ea\u52a8\u6269\u5bb9\u3001\u6839\u636e\u6e38\u620f\u670d\u7684 OpsState \u7f29\u5bb9\u3001\u6839\u636e DeletionPriority \u7f29\u5bb9\u3001\u6839\u636e\u6e38\u620f\u670d\u5e8f\u53f7\u7f29\u5bb9\u7b49\u529f\u80fd\u6765\u652f\u6301\u6e38\u620f\u8fd0\u7ef4\u7684\u4e1a\u52a1\u9700\u6c42\u3002\u6c34\u5e73\u4f38\u7f29\u7684\u7279\u6027\u5728\u7ed9\u6e38\u620f\u5f00\u53d1\u8005\u5e26\u6765\u4fbf\u5229\u7684\u540c\u65f6\uff0c\u4e5f\u5bf9\u5165\u53e3\u7f51\u5173\u63d0\u51fa\u4e86\u66f4\u9ad8\u7684\u8981\u6c42\uff1a\u5165\u53e3\u7f51\u5173\u5fc5\u987b\u5177\u5907\u914d\u7f6e\u70ed\u66f4\u65b0\u7684\u80fd\u529b\uff0c\u5b8c\u6210\u8def\u7531\u914d\u7f6e\u7684\u5e73\u6ed1\u4e0b\u53d1\u3002\n\u539f\u56e0\u5728\u4e8e\uff1a\u5728\u8fdb\u884c\u6e38\u620f\u670d\u7684\u6269\u5bb9\u65f6\uff0cOKG \u4f1a\u540c\u6b65\u521b\u5efa Ingress \u7b49\u76f8\u5173\u7f51\u7edc\u76f8\u5173\u8d44\u6e90\uff0c\u4ee5\u6b64\u6765\u4fdd\u969c\u6e38\u620f\u670d\u7684\u81ea\u52a8\u4e0a\u7ebf\u3002\u5982\u679c\u5165\u53e3\u7f51\u5173\u4e0d\u5177\u5907\u914d\u7f6e\u70ed\u66f4\u65b0\u7684\u80fd\u529b\uff0c\u5728\u6269\u5bb9\u65f6\u5c31\uff0c\u7ebf\u4e0a\u73a9\u5bb6\u5c31\u4f1a\u9047\u5230\u8fde\u63a5\u65ad\u5f00\u7b49\u95ee\u9898\uff0c\u5f71\u54cd\u6e38\u73a9\u4f53\u9a8c\u3002"]}),"\n",(0,i.jsx)(s.h2,{id:"nginx-reload-\u65e0\u6cd5\u4f18\u96c5\u70ed\u66f4\u65b0",children:"Nginx reload \u65e0\u6cd5\u4f18\u96c5\u70ed\u66f4\u65b0"}),"\n",(0,i.jsx)(s.p,{children:"\u5728\u6e38\u620f\u670d\u51fa\u73b0\u6269\u5bb9\uff0c\u6216\u8005\u5b9a\u4e49\u7684\u8def\u7531\u7b56\u7565\u53d1\u751f\u53d8\u66f4\u65f6\uff0cNginx \u7684\u914d\u7f6e\u53d8\u66f4\u4f1a\u89e6\u53d1 reload\uff0c\u5bfc\u81f4\u4e0a\u4e0b\u6e38\u7684\u8fde\u63a5\u90fd\u65ad\u5f00\u5e76\u89e6\u53d1\u91cd\u8fde\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u6211\u4eec\u4ee5 Posio \u6e38\u620f\u670d\u4e3a\u4f8b\uff0c\u6a21\u62df Nginx+OKG \u5728\u6e38\u620f\u670d\u6269\u5bb9\u65f6\u51fa\u73b0\u7684\u95ee\u9898\u3002Posio \u670d\u52a1\u7aef\u4f9d\u8d56\u4e8e Socket \u8fde\u63a5\u4e0e\u5ba2\u6237\u7aef\u901a\u4fe1\u3002\u6e38\u620f\u670d\u6269\u5bb9\u65f6\uff0c\u89e6\u53d1\u5bf9\u5e94\u7684 Ingress \u8d44\u6e90\u521b\u5efa\uff0c\u6b64\u65f6 Nginx-ingress-controller \u76d1\u542c\u5230 Ingress \u8d44\u6e90\u53d8\u66f4\uff0c\u89e6\u53d1\u81ea\u8eab reload \u673a\u5236\uff0c\u6b64\u65f6\u539f\u6765\u4e0e\u6e38\u620f\u670d\u5efa\u7acb\u7684\u8fde\u63a5\uff08\u5982\u672c\u4f8b\u4e2d\u7684 Socket \u8fde\u63a5\u4f1a\u88ab\u65ad\u5f00\uff09\u3002\u5728\u6b63\u5728\u6e38\u620f\u7684\u73a9\u5bb6\u4fa7\u7684\u4f53\u611f\u4fbf\u662f\u51fa\u73b0\u4e86\u5f02\u5e38\u5361\u987f\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u4e3a\u4e86\u76f4\u89c2\u7684\u5c55\u793a Nginx Ingress reload \u5e26\u6765\u7684\u5f71\u54cd\uff0c\u6211\u4eec\u5bf9 Nginx \u9ed8\u8ba4\u914d\u7f6e\u53c2\u6570\u8fdb\u884c\u4e00\u4e9b\u66f4\u6539\uff1a"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"kubectl edit configmap nginx-configuration -n kube-system\n\ndata:\n  ...\n  worker-shutdown-timeout: 30s # \u4e00\u4e2a\u5f88\u96be\u505a\u6743\u8861\u7684\u914d\u7f6e\n\n"})}),"\n",(0,i.jsx)(s.p,{children:"Nginx \u914d\u7f6e\u53c2\u6570\u4e2d worker-shutdown-timeout \u662f Nginx \u7684 worker \u8fdb\u7a0b\u4f18\u96c5\u4e0b\u7ebf\u7684\u8d85\u65f6\u914d\u7f6e\uff0cworker \u8fdb\u7a0b\u4f1a\u5148\u505c\u6b62\u63a5\u6536\u65b0\u7684\u8fde\u63a5\uff0c\u5e76\u7b49\u5f85\u8001\u7684\u8fde\u63a5\u9010\u6e10\u5173\u95ed\uff0c\u8fbe\u5230\u8d85\u65f6\u65f6\u95f4\u540e\uff0c\u624d\u4f1a\u53bb\u5f3a\u5236\u5173\u95ed\u5f53\u524d\u7684\u6240\u6709\u8fde\u63a5\uff0c\u5b8c\u6210\u8fdb\u7a0b\u9000\u51fa\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u6b64\u53c2\u6570\u914d\u7f6e\u8fc7\u5c0f\uff0c\u4f1a\u5bfc\u81f4\u5927\u91cf\u6d3b\u8dc3\u8fde\u63a5\u77ac\u95f4\u65ad\u5f00\uff1b\u800c\u6b64\u53c2\u6570\u914d\u7f6e\u8fc7\u5927\u65f6\uff0c\u53c8\u4f1a\u5bfc\u81f4 websocket \u957f\u8fde\u63a5\u59cb\u7ec8\u7ef4\u6301\u4f4f Nginx \u8fdb\u7a0b\uff0c\u5f53\u53d1\u751f\u9891\u7e41 reload \u65f6\u4f1a\u4ea7\u751f\u5927\u91cf shutting down \u72b6\u6001\u7684 worker \u8fdb\u7a0b\uff0c\u8001 worker \u5360\u6709\u7684\u5185\u5b58\u8fdf\u8fdf\u5f97\u4e0d\u5230\u91ca\u653e\uff0c\u53ef\u80fd\u4f1a\u5bfc\u81f4 OOM \u5f15\u53d1\u7ebf\u4e0a\u6545\u969c\uff1a"}),"\n",(0,i.jsx)("img",{src:n(53560).A}),"\n",(0,i.jsx)(s.p,{children:"\u5b9e\u9645\u6e38\u73a9\u7684\u6d4b\u8bd5\u8fc7\u7a0b\u5982\u4e0b\uff1a\u5ba2\u6237\u7aef\u8bbf\u95ee\u6e38\u620f\u670d\uff0c\u8fdb\u884c\u6b63\u5e38\u6e38\u73a9\u3002\u5728\u6b64\u8fc7\u7a0b\u4e2d\u901a\u8fc7 OKG \u80fd\u529b\u89e6\u53d1\u6e38\u620f\u670d\u6269\u5bb9\uff0c\u67e5\u770b\u6b64\u65f6\u5ba2\u6237\u7aef\u7684\u54cd\u5e94\u3002\u901a\u8fc7\u7f51\u9875\u5f00\u53d1\u8005\u5de5\u5177\u53ef\u4ee5\u770b\u5230\uff0c\u51fa\u73b0\u4e86\u4e24\u6761 Socket \u8fde\u63a5\uff0c\u4e00\u6761\u662f\u539f\u5148\u6d4f\u89c8\u5668\u8bbf\u95ee\u6e38\u620f\u670d\u5efa\u7acb\uff0c\u53e6\u4e00\u6761\u662f\u7531\u4e8e Nginx \u65ad\u8fde\u540e\u91cd\u8fde\u4ea7\u751f\u7684 Socket \u8fde\u63a5\u3002"}),"\n",(0,i.jsx)("img",{src:n(69640).A,style:{height:"400px",width:"700px"}}),"\n",(0,i.jsx)(s.p,{children:"\u539f\u6709\u8fde\u63a5\u6536\u5230\u7684\u6700\u540e\u4e00\u4e2a\u5305\u65f6\u95f4\u6233\u662f 15:10:26\u3002"}),"\n",(0,i.jsx)("img",{src:n(94899).A}),"\n",(0,i.jsx)(s.p,{children:"\u800c\u65b0\u5efa\u8fde\u63a5\u5230\u83b7\u53d6\u7b2c\u4e00\u4e2a\u6b63\u5e38\u6e38\u620f\u5305\u7684\u65f6\u95f4\u662f 15:10:37\uff0c\u7f51\u9875\u4e0e\u6e38\u620f\u670d\u7684\u65ad\u8fde\u5927\u6982\u6301\u7eed 5s \u5de6\u53f3\u3002"}),"\n",(0,i.jsx)("img",{src:n(20408).A}),"\n",(0,i.jsx)(s.p,{children:"\u9664\u4e86\u73a9\u5bb6\u7684\u6e38\u73a9\u4f53\u9a8c\u53d7\u5f71\u54cd\uff0c\u8fd9\u4e2a\u673a\u5236\u4e5f\u4f1a\u7ed9\u4e1a\u52a1\u6574\u4f53\u7a33\u5b9a\u6027\u57cb\u96f7\u3002\u5728\u9ad8\u5e76\u53d1\u573a\u666f\u4e0b\uff0c\u56e0\u4e3a\u8fde\u63a5\u77ac\u65ad\uff0c\u5bfc\u81f4\u5927\u6279\u91cf\u5ba2\u6237\u7aef\u7684\u5e76\u53d1\u91cd\u8fde\uff0c\u4f1a\u5bfc\u81f4 Nginx \u7684 CPU \u77ac\u95f4\u98d9\u5347\uff1b\u800c\u540e\u7aef\u6e38\u620f\u670d\u52a1\u5668\u9700\u8981\u5904\u7406\u66f4\u591a\u4e1a\u52a1\u903b\u8f91\uff0c\u4e00\u822c\u6bd4\u7f51\u5173\u7684\u8d44\u6e90\u9700\u6c42\u66f4\u9ad8\uff0c\u56e0\u6b64 Nginx \u900f\u4f20\u8fc7\u6765\u7684\u5927\u91cf\u5e76\u53d1\u91cd\u8fde\uff0c\u4e5f\u66f4\u5bb9\u6613\u6253\u57ae\u540e\u7aef\uff0c\u9020\u6210\u4e1a\u52a1\u96ea\u5d29\u3002"}),"\n",(0,i.jsx)(s.h2,{id:"higress-\u5982\u4f55\u5b9e\u73b0\u4f18\u96c5\u70ed\u66f4\u65b0",children:"Higress \u5982\u4f55\u5b9e\u73b0\u4f18\u96c5\u70ed\u66f4\u65b0"}),"\n",(0,i.jsx)(s.p,{children:"Higress \u652f\u6301\u91c7\u7528 K8s Ingress \u66b4\u9732\u6e38\u620f\u670d\u5916\u90e8 IP \u7aef\u53e3\uff0c\u4f9b\u73a9\u5bb6\u8fde\u63a5\u8bbf\u95ee\u3002\u5f53\u6e38\u620f\u670d\u4f38\u7f29\u6216\u8005\u5b9a\u4e49\u7684\u8def\u7531\u914d\u7f6e\u53d1\u751f\u53d8\u5316\u65f6\uff0cHigress \u652f\u6301\u8def\u7531\u914d\u7f6e\u7684\u70ed\u66f4\u65b0\uff0c\u4ee5\u6b64\u4fdd\u969c\u73a9\u5bb6\u8fde\u63a5\u7684\u7a33\u5b9a\u6027\u3002"}),"\n",(0,i.jsx)("img",{src:n(55375).A}),"\n",(0,i.jsx)(s.p,{children:"Higress \u57fa\u4e8e Envoy \u7684\u7cbe\u786e\u914d\u7f6e\u53d8\u66f4\u7ba1\u7406\uff0c\u505a\u5230\u4e86\u771f\u6b63\u7684\u914d\u7f6e\u52a8\u6001\u70ed\u66f4\u65b0\u3002\u5728  Envoy \u4e2d downstream \u5bf9\u5e94 listener \u914d\u7f6e\uff0c\u4ea4\u7531 LDS \u5b9e\u73b0\u914d\u7f6e\u53d1\u73b0\uff1bupstream \u5bf9\u5e94 cluster \u914d\u7f6e\uff0c\u4ea4\u7531 CDS \u5b9e\u73b0\u914d\u7f6e\u53d1\u73b0\u3002listener \u914d\u7f6e\u66f4\u65b0\u91cd\u5efa\uff0c\u53ea\u4f1a\u5bfc\u81f4 downstream \u8fde\u63a5\u65ad\u5f00\uff0c\u4e0d\u4f1a\u5f71\u54cd upstream \u7684\u8fde\u63a5\uff1bdownstream \u548c upstream \u7684\u914d\u7f6e\u53ef\u4ee5\u72ec\u7acb\u53d8\u66f4\uff0c\u4e92\u4e0d\u5f71\u54cd\u3002\u518d\u8fdb\u4e00\u6b65\uff0clistener \u4e0b\u7684\u8bc1\u4e66(cert)\uff0c\u8fc7\u6ee4\u5668\u63d2\u4ef6(filter)\uff0c\u8def\u7531(router)\u5747\u53ef\u4ee5\u5b9e\u73b0\u914d\u7f6e\u72ec\u7acb\u53d8\u66f4\uff0c\u8fd9\u6837\u4e0d\u8bba\u662f\u8bc1\u4e66/\u63d2\u4ef6/\u8def\u7531\u914d\u7f6e\u53d8\u66f4\u90fd\u4e0d\u518d\u4f1a\u5f15\u8d77 downstream \u8fde\u63a5\u65ad\u5f00\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u7cbe\u786e\u7684\u914d\u7f6e\u53d8\u66f4\u673a\u5236\uff0c\u9664\u4e86\u8ba9 Envoy \u53ef\u4ee5\u5b9e\u73b0\u771f\u6b63\u7684\u70ed\u66f4\u65b0\uff0c\u4e5f\u8ba9 Envoy \u7684\u67b6\u6784\u53d8\u7684\u66f4\u53ef\u9760\uff0cEnvoy \u914d\u7f6e\u7ba1\u7406\u4ece\u8bbe\u8ba1\u4e4b\u521d\u5c31\u662f\u4e3a\u6570\u636e\u9762(DP)\u548c\u63a7\u5236\u9762(CP)\u5206\u79bb\u800c\u8bbe\u8ba1\u7684\uff0c\u56e0\u6b64\u4f7f\u7528 gRPC \u5b9e\u73b0\u8fdc\u7a0b\u914d\u7f6e\u52a8\u6001\u62c9\u53d6\uff0c\u5e76\u501f\u52a9 proto \u6765\u89c4\u8303\u914d\u7f6e\u5b57\u6bb5\uff0c\u5e76\u4fdd\u6301\u7248\u672c\u517c\u5bb9\u3002\u8fd9\u4e2a\u8bbe\u8ba1\u5b9e\u73b0\u4e86\u6570\u636e\u9762\u548c\u63a7\u5236\u9762\u7684\u5b89\u5168\u57df\u9694\u79bb\uff0c\u589e\u5f3a\u4e86\u67b6\u6784\u7684\u5b89\u5168\u6027\u3002"}),"\n",(0,i.jsx)(s.p,{children:"\u4f7f\u7528 OKG \u63a5\u5165 Higress \u540e\uff0c\u4e0b\u9762\u4f9d\u7136\u6a21\u62df\u5ba2\u6237\u7aef\u8bbf\u95ee\u6e38\u620f\u670d\uff0c\u8fdb\u884c\u6b63\u5e38\u6e38\u73a9\u3002\u5728\u6b64\u8fc7\u7a0b\u4e2d\u901a\u8fc7 OKG \u80fd\u529b\u89e6\u53d1\u6e38\u620f\u670d\u6269\u5bb9\uff0c\u67e5\u770b\u6b64\u65f6\u5ba2\u6237\u7aef\u7684\u54cd\u5e94\u3002\u901a\u8fc7\u7f51\u9875\u5f00\u53d1\u8005\u5de5\u5177\u53ef\u4ee5\u770b\u5230\uff0c\u5728\u6b64\u8fc7\u7a0b\u4e2d\u5ba2\u6237\u7aef\u4e0e\u6e38\u620f\u670d\u5efa\u7acb\u7684\u8fde\u63a5\u7a33\u5b9a\u4e0d\u53d7\u5f71\u54cd\u3002"}),"\n",(0,i.jsx)("img",{src:n(79035).A,style:{height:"400px",width:"700px"}}),"\n",(0,i.jsxs)(s.p,{children:["\u6b64\u5916\uff0c\u5728\u5927\u89c4\u6a21\u6e38\u620f\u670d\u573a\u666f\u4e0b\uff0c\u6bcf\u4e2a\u6e38\u620f\u670d\u5bf9\u5e94\u4e00\u4e2a\u72ec\u7acb\u7684 Ingress\uff0c\u4f1a\u4ea7\u751f\u5927\u91cf\u7684 Ingress \u8d44\u6e90\uff0c\u6211\u4eec\u6d4b\u8bd5\u5728\u8fbe\u5230 1k \u7ea7\u522b\u89c4\u6a21\u65f6\uff0cNginx Ingress \u8981\u65b0\u6269\u4e00\u4e2a\u6e38\u620f\u670d\u9700\u8981\u5206\u949f\u7ea7\u751f\u6548\uff0c\u800c Higress \u53ef\u4ee5\u5728\u79d2\u7ea7\u751f\u6548\u3002Nginx Ingress \u7684\u8fd9\u4e00\u95ee\u9898\u4e5f\u88ab Sealos \u8e29\u5751\uff0c\u5e76\u6700\u7ec8\u901a\u8fc7\u5207\u6362\u5230 Higress \u89e3\u51b3\uff0c\u6709\u5174\u8da3\u53ef\u4ee5\u9605\u8bfb\u8fd9\u7bc7\u6587\u7ae0\u4e86\u89e3\uff1a",(0,i.jsx)(s.a,{href:"https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247561453&idx=1&sn=de22e31a1ab59311072b468de907e282&scene=21#wechat_redirect",children:"\u300a\u4e91\u539f\u751f\u7f51\u5173\u54ea\u5bb6\u5f3a\uff1aSealos \u7f51\u5173\u8840\u6cea\u53f2\u300b"})]})]})}function g(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>a,x:()=>t});var r=n(96540);const i={},o=r.createContext(i);function a(e){const s=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(o.Provider,{value:s},e.children)}},53560:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/oom-c048e6ba8f5e188d145028f71244299a.png"},55375:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/higress-config-22ad3d7df41b264c12c42f4da680d685.png"},69640:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/nginx-config-update-50f073933ef630704ac07e084c5e4c8b.jpg"},77414:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/gss-workload-comparison-b6bda3c854960f1d02d217f7a23a183f.png"},79035:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/router-config-update-b529e24a5cc95d74dcdcbc5972e98418.jpg"},94899:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/socket1-1de44c9894b25a14102ab1c8eadd9ca7.png"}}]);
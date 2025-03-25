"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5118],{6868:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>t,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"best-practices/pve-game","title":"\u4f20\u7edf\u533a\u670d\u7c7b\u6e38\u620f\uff08PvE\uff09\u6700\u4f73\u5b9e\u8df5","description":"PvE\u533a\u670d\u7c7b\u6e38\u620f\u843d\u5730Kubernetes\u7684\u6311\u6218","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/best-practices/pve-game.md","sourceDirName":"best-practices","slug":"/best-practices/pve-game","permalink":"/zh/kruisegame/best-practices/pve-game","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u4f1a\u8bdd\u7c7b\u6e38\u620f\uff08PvP\u5f00\u623f\u95f4\uff09\u6700\u4f73\u5b9e\u8df5","permalink":"/zh/kruisegame/best-practices/session-based-game"},"next":{"title":"\u6e38\u620f\u670d\u5171\u4eab\u5185\u5b58\u6700\u4f73\u5b9e\u8df5","permalink":"/zh/kruisegame/best-practices/shared-mem"}}');var r=a(74848),i=a(28453);const t={},l="\u4f20\u7edf\u533a\u670d\u7c7b\u6e38\u620f\uff08PvE\uff09\u6700\u4f73\u5b9e\u8df5",c={},d=[{value:"PvE\u533a\u670d\u7c7b\u6e38\u620f\u843d\u5730Kubernetes\u7684\u6311\u6218",id:"pve\u533a\u670d\u7c7b\u6e38\u620f\u843d\u5730kubernetes\u7684\u6311\u6218",level:2},{value:"\u6e38\u620f\u670d\u70ed\u66f4\u65b0",id:"\u6e38\u620f\u670d\u70ed\u66f4\u65b0",level:2},{value:"\u6e38\u620f\u670d\u914d\u7f6e\u7ba1\u7406",id:"\u6e38\u620f\u670d\u914d\u7f6e\u7ba1\u7406",level:2},{value:"\u6302\u8f7d\u5bf9\u8c61\u5b58\u50a8",id:"\u6302\u8f7d\u5bf9\u8c61\u5b58\u50a8",level:3},{value:"\u52a8\u6001\u62c9\u53d6",id:"\u52a8\u6001\u62c9\u53d6",level:3},{value:"\u6e38\u620f\u670d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf",id:"\u6e38\u620f\u670d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf",level:2},{value:"\u80cc\u666f\u4e0e\u6982\u5ff5",id:"\u80cc\u666f\u4e0e\u6982\u5ff5",level:3},{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:3},{value:"\u6e38\u620f\u670d\u5b9a\u5411\u7ba1\u7406",id:"\u6e38\u620f\u670d\u5b9a\u5411\u7ba1\u7406",level:2},{value:"\u8bbe\u7f6eGameServer\u56de\u6536\u7b56\u7565",id:"\u8bbe\u7f6egameserver\u56de\u6536\u7b56\u7565",level:3},{value:"\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c",id:"\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c",level:3},{value:"\u793a\u4f8b\u8bf4\u660e",id:"\u793a\u4f8b\u8bf4\u660e",level:4},{value:"\u6e38\u620f\u670d\u5408\u670d",id:"\u6e38\u620f\u670d\u5408\u670d",level:3},{value:"OKG\u7ba1\u7406PvE\u6e38\u620f\u670d\u5e38\u89c1\u95ee\u9898",id:"okg\u7ba1\u7406pve\u6e38\u620f\u670d\u5e38\u89c1\u95ee\u9898",level:2},{value:"Q\uff1a\u5982\u4f55\u51b3\u5b9aGameServerSet\u7684\u7eb3\u7ba1\u8303\u56f4\uff1f",id:"q\u5982\u4f55\u51b3\u5b9agameserverset\u7684\u7eb3\u7ba1\u8303\u56f4",level:3},{value:"Q\uff1a\u5982\u4f55\u8fdb\u884c\u5f00\u65b0\u670d\uff1f",id:"q\u5982\u4f55\u8fdb\u884c\u5f00\u65b0\u670d",level:3}];function m(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u4f20\u7edf\u533a\u670d\u7c7b\u6e38\u620fpve\u6700\u4f73\u5b9e\u8df5",children:"\u4f20\u7edf\u533a\u670d\u7c7b\u6e38\u620f\uff08PvE\uff09\u6700\u4f73\u5b9e\u8df5"})}),"\n",(0,r.jsx)(n.h2,{id:"pve\u533a\u670d\u7c7b\u6e38\u620f\u843d\u5730kubernetes\u7684\u6311\u6218",children:"PvE\u533a\u670d\u7c7b\u6e38\u620f\u843d\u5730Kubernetes\u7684\u6311\u6218"}),"\n",(0,r.jsx)(n.p,{children:"\u9996\u5148\uff0cPvE\u533a\u670d\u7c7b\u6e38\u620f\u6709\u4ee5\u4e0b\u7279\u70b9\uff1a"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"\u5355\u4e2a\u533a\u670d\u8fd0\u884c\u65f6\u95f4\u8f83\u957f\uff0c\u5e94\u5c3d\u91cf\u907f\u514d\u505c\u670d\u64cd\u4f5c\uff0c\u5229\u4e8e\u73a9\u5bb6\u6e38\u620f\u4f53\u9a8c"}),"\n",(0,r.jsx)(n.li,{children:"\u5f00\u670d\u65f6\uff08\u6216\uff09\u5b58\u5728\u914d\u7f6e\u5dee\u5f02"}),"\n",(0,r.jsx)(n.li,{children:"\u5355\u533a\u670d\u5bb9\u5668\u4e2d\uff08\u6216\uff09\u5b58\u5728\u591a\u8fdb\u7a0b\uff0c\u533a\u670d\u670d\u52a1\u8d28\u91cf\u9700\u7531\u7528\u6237\u5b9a\u4e49"}),"\n",(0,r.jsx)(n.li,{children:"\u968f\u7740\u65f6\u95f4\u63a8\u79fb\uff0c\u5404\u533a\u670d\u72b6\u6001\u5b58\u5728\u5dee\u5f02\uff0c\u9700\u5b9a\u5411\u7ba1\u7406\uff0c\u5982\u66f4\u6539\u8d44\u6e90\u89c4\u683c\u3001\u955c\u50cf\u7248\u672c\u3001\u5b9a\u5411\u5408\u670d\u7b49"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u8be5\u7c7b\u6e38\u620f\u5728\u843d\u5730Kubernetes\u901a\u5e38\u9047\u5230",(0,r.jsx)(n.strong,{children:"\u5de6\u53f3\u4e3a\u96be"}),"\u7684\u56f0\u5883\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4f7f\u7528Kubernetes\u539f\u751fworkload\uff0c\u5219\u65e0\u6cd5\u8fdb\u884c\u6e38\u620f\u670d\u7cbe\u7ec6\u5316\u7ba1\u7406\uff0c\u5177\u4f53\u5730\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4f7f\u7528Deployment\u7ba1\u7406\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u751f\u6210\u7684pod\u6ca1\u6709\u7c7b\u4f3c\u5e8f\u53f7\u7684\u72b6\u6001\u6807\u8bc6\uff0c\u5bfc\u81f4\uff1a1\uff09\u65e0\u6cd5\u57fa\u4e8e\u5e8f\u53f7\u8fdb\u884c\u6709\u72b6\u6001\u7684\u670d\u52a1\u53d1\u73b0\u4e86\uff1b2\uff09\u65e0\u6cd5\u533a\u522b\u6e38\u620f\u670d\u4e4b\u95f4\u72b6\u6001\u5dee\u5f02\u6027\uff1b3\uff09\u5f02\u5e38\u91cd\u542f\u65f6\u72b6\u6001\u4e22\u5931\uff0c\u914d\u7f6e/\u5b58\u50a8\u7b49\u65e0\u6cd5\u81ea\u52a8\u91cd\u5b9a\u5411\u3002"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4f7f\u7528StatefulSet\u7ba1\u7406\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u751f\u6210\u7684pod\u867d\u7136\u6709\u5e8f\u53f7\u4f5c\u4e3a\u72b6\u6001\u6807\u8bc6\uff0c\u4f46\u662f\uff1a1\uff09\u53ea\u80fd\u4ece\u5e8f\u53f7\u5927\u5230\u5c0f\u8fdb\u884c\u66f4\u65b0\u6216\u5220\u9664\uff0c\u65e0\u6cd5\u5b9a\u5411\u7ba1\u7406\u6e38\u620f\u670d\uff1b2\uff09\u65e0\u6cd5\u611f\u77e5\u6e38\u620f\u670d\u4e4b\u95f4\u7684\u72b6\u6001\u5dee\u5f02\u7279\u6027\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4e0d\u4f7f\u7528Kubernetes\u539f\u751fworkload\uff0c\u5219\u65e0\u6cd5\u5229\u7528\u4e0aK8s\u7684\u7f16\u6392\u80fd\u529b\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4f7f\u7528\u811a\u672c\u7a0b\u5e8f\u6279\u91cf\u5f00\u670d\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u5c5e\u4e8e\u9762\u5411\u8fc7\u7a0b\u7684\u65b9\u5f0f\uff0c\u53c2\u6570\u65e0\u6cd5\u843d\u76d8\uff0c\u51fa\u9519\u7387\u9ad8\u3002"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\u82e5\u4f7f\u7528gitops\u7ba1\u7406\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u533a\u670d\u6570\u91cf\u8f83\u591a\u65f6\u9700\u8981\u7ef4\u62a4\u5927\u91cf\u6709\u7740\u76f8\u540c\u5b57\u6bb5\u7684yaml\u6587\u4ef6\uff0c\u6709\u65f6\u751a\u81f3\u8d85\u8fc7\u6587\u4ef6\u957f\u5ea6\u9650\u5236\uff1b\u6279\u91cf\u53d1\u5e03\u65f6\u4e5f\u5341\u5206\u590d\u6742\u3002"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\u82e5\u901a\u8fc7\u81ea\u5efaPaaS\u5e73\u53f0\u7ba1\u7406\uff1a","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u9700\u8981\u5f15\u5165\u5927\u91cf\u5f00\u53d1\u5de5\u4f5c\uff0c\u4e14\u4e0e\u4e1a\u52a1\u5c5e\u6027\u8026\u5408\u8f83\u91cd\uff0c\u5bfc\u81f4\u540e\u7eed\u8fed\u4ee3\u590d\u6742"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u672c\u7bc7\u6700\u4f73\u5b9e\u8df5\u5c06\u4ecb\u7ecd\u5982\u4f55\u5229\u7528OKG\u7ba1\u7406\u533a\u670d\u7c7b\u6e38\u620f\u670d\u52a1\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"\u6e38\u620f\u670d\u70ed\u66f4\u65b0",children:"\u6e38\u620f\u670d\u70ed\u66f4\u65b0"}),"\n",(0,r.jsxs)(n.p,{children:["OKG\u63d0\u4f9b\u7684\u539f\u5730\u5347\u7ea7\u70ed\u66f4\u65b0\u662f\u4e00\u79cd\u66f4\u52a0\u4e91\u539f\u751f\u7684\u6e38\u620f\u670d\u70ed\u66f4\u843d\u5730\u65b9\u5f0f\uff0c\u901a\u8fc7\u8be5\u65b9\u5f0f\u53ef\u4ee5\u5b9e\u73b0\u6e38\u620f\u670d\u70ed\u66f4\u6587\u4ef6\u7684\u7248\u672c\u5316\u7ba1\u7406\u3001\u7070\u5ea6\u66f4\u65b0\u3001\u66f4\u65b0\u72b6\u6001\u611f\u77e5\u3001\u4ee5\u53ca\u6545\u969c\u6062\u590d\u540e\u70ed\u66f4\u7248\u672c\u4e00\u81f4\u6027\u3002\n\u5177\u4f53\u5b9e\u73b0\u65b9\u5f0f\u53ef\u53c2\u8003\u76f8\u5e94\u6587\u6863 ",(0,r.jsx)(n.a,{href:"https://openkruise.io/zh/kruisegame/user-manuals/hot-update",children:"https://openkruise.io/zh/kruisegame/user-manuals/hot-update"})]}),"\n",(0,r.jsx)(n.h2,{id:"\u6e38\u620f\u670d\u914d\u7f6e\u7ba1\u7406",children:"\u6e38\u620f\u670d\u914d\u7f6e\u7ba1\u7406"}),"\n",(0,r.jsx)(n.p,{children:"GameServerSet\u7ba1\u7406\u7684GameServer\u5177\u6709\u5e8f\u53f7\u5c5e\u6027\uff0c\u5176\u540d\u79f0\u662f\u56fa\u5b9a\u4e0d\u53d8\u7684\uff0c\u8fd9\u4e00\u70b9\u4e0eStatefulSet\u76f8\u540c\u3002\u56e0\u6b64\uff0c\u300cGameServerSet\u540d\u79f0+\u5e8f\u53f7\u300d\u53ef\u4f5c\u4e3a\u6e38\u620f\u670d\u7684\u552f\u4e00\u6807\u8bc6\uff0c\u8054\u52a8\u5206\u5e03\u5f0f\u5b58\u50a8\u6216\u914d\u7f6e\u7ba1\u7406\u7cfb\u7edf\u8fdb\u884c\u914d\u7f6e\u7684\u5dee\u5f02\u5316\u7ba1\u7406\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u6302\u8f7d\u5bf9\u8c61\u5b58\u50a8",children:"\u6302\u8f7d\u5bf9\u8c61\u5b58\u50a8"}),"\n",(0,r.jsx)(n.p,{children:"\u901a\u8fc7\u5bf9\u8c61\u5b58\u50a8\uff0c\u5c06\u4e0d\u540c\u6e38\u620f\u670d\u7684\u4e0d\u540c\u914d\u7f6e\u5206\u522b\u653e\u5728\u4ee5\u6e38\u620f\u670d\u540d\u79f0\u547d\u540d\u7684\u8def\u5f84\u4e0b\uff0c\u4fdd\u8bc1bucket\u7684\u8def\u5f84\u4e0e\u6e38\u620f\u670d\u4e00\u4e00\u5bf9\u5e94\uff0c\u4ee5PVC\u5728GameServerSet\u4e0a\u58f0\u660e\u3002\u8be5\u65b9\u5f0f\u793a\u610f\u56fe\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)("img",{src:a(92574).A,style:{width:"500px"}}),"\n",(0,r.jsx)(n.p,{children:"GameServerSet Yaml\u793a\u4f8b\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: gameserver\n  namespace: default\nspec:\n  replicas: 2\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n  gameServerTemplate:\n    spec:\n      containers:\n      - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n        name: minecraft\n        env:\n        - name: POD_NAME #\u628apod name\u4f5c\u4e3a\u73af\u5883\u53d8\u91cf\u4f20\u5165\n          valueFrom:\n            fieldRef:\n              apiVersion: v1\n              fieldPath: metadata.name\n        volumeMounts:\n        - name: pvc-oss #\u6302\u8f7doss\u5bf9\u5e94pvc\n          mountPath: "/app/sgame.config" #\u5bb9\u5668\u4e2d\u7684\u76ee\u5f55\u53ca\u6587\u4ef6\n          subPathExpr: $(POD_NAME)/sgame.config #\u5bf9\u5e94oss\u76ee\u5f55\u53ca\u6587\u4ef6\n      volumes:\n      - name: pvc-oss\n        persistentVolumeClaim:\n          claimName: pvc-oss\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u8fd9\u6837\u4e00\u6765\uff0c\u5f00\u670d\u524d\u53ea\u9700\u51c6\u5907\u597d\u6e38\u620f\u670d\u5bf9\u5e94\u914d\u7f6e\u5e76\u4e0a\u4f20\u5230bucket\u5bf9\u5e94\u8def\u5f84\u4e2d\uff0c\u518d\u90e8\u7f72GameServerSet\u6216\u8c03\u6574Replicas\u5373\u53ef\u3002\n\u5982\u56fe\u6240\u793a\uff0cgameserver-0 \u4e0e gameserver-1\u4e24\u4e2a\u76ee\u5f55\u4e0b\u7684\u6587\u4ef6\u5185\u5bb9\u4e0d\u540c\uff0c\u5c06\u5206\u522b\u6302\u8f7d\u5230\u5bf9\u5e94\u7684\u6e38\u620f\u670dgameserver-0 \u4e0e gameserver-1\u4e0a\uff1a"}),"\n",(0,r.jsx)("img",{src:a(18582).A,style:{width:"500px"}}),"\n",(0,r.jsx)(n.h3,{id:"\u52a8\u6001\u62c9\u53d6",children:"\u52a8\u6001\u62c9\u53d6"}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u4e1a\u52a1\u5b58\u5728\u914d\u7f6e\u4e2d\u5fc3\u670d\u52a1\uff08\u5982Nacos\uff09\uff0c\u53ef\u4ee5\u901a\u8fc7\u6e38\u620f\u670d\u540d\u79f0\u662f\u56fa\u5b9a\u4e14\u552f\u4e00\u7684\u7279\u6027\uff0c\u5728\u6e38\u620f\u670d\u5bb9\u5668\u542f\u52a8\u65f6\uff0c\u5c06\u81ea\u8eab\u7684\u540d\u79f0\u4f5c\u4e3a\u8bf7\u6c42\u53c2\u6570\u5411\u914d\u7f6e\u4e2d\u5fc3\u53d1\u751f\u8bf7\u6c42\u62c9\u53d6\u5bf9\u5e94\u914d\u7f6e\u3002\n\u5bb9\u5668\u81ea\u8eab\u540d\u79f0\u7684\u83b7\u53d6\u65b9\u5f0f\u4e0e\u6302\u8f7d\u5bf9\u8c61\u5b58\u50a8\u4e2d\u7c7b\u4f3c\uff0c\u901a\u8fc7 DownwardAPI\u5c06\u5176\u4f5c\u4e3a\u73af\u5883\u53d8\u91cf\u4f20\u5165\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"\u6e38\u620f\u670d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf",children:"\u6e38\u620f\u670d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf"}),"\n",(0,r.jsx)(n.h3,{id:"\u80cc\u666f\u4e0e\u6982\u5ff5",children:"\u80cc\u666f\u4e0e\u6982\u5ff5"}),"\n",(0,r.jsx)(n.p,{children:"\u4f20\u7edf\u533a\u670d\u7c7b\u6e38\u620f\u5bb9\u5668\u5316\u843d\u5730\u65f6\u5f80\u5f80\u4ee5\u201c\u5bcc\u5bb9\u5668\u201d\u7684\u5f62\u6001\u5b58\u5728\uff0c\u4e5f\u5c31\u662f\u4e00\u4e2a\u5bb9\u5668\u4e2d\u5b58\u5728\u7740\u591a\u79cd\u8fdb\u7a0b\uff0c\u6bcf\u4e2a\u8fdb\u7a0b\u8d1f\u8d23\u5355\u4e2a\u533a\u670d\u7684\u4e0d\u540c\u529f\u80fd\u3002\u6b64\u65f6\u5355\u4e2a\u6e38\u620f\u670d\u7684\u72b6\u6001\u9519\u7efc\u590d\u6742\u3002\u800c\u539f\u751f Kubernetes \u5bf9\u4e1a\u52a1\u72b6\u6001\u7ba1\u7406\u505c\u7559\u5728\u5bb9\u5668\u5c42\u9762\uff0c\u65e0\u6cd5\u7cbe\u7ec6\u5316\u611f\u77e5\u5bb9\u5668\u4e2d\u7279\u5b9a\u8fdb\u7a0b\u72b6\u6001\uff0c\u9020\u6210\u6545\u969c\u6216\u5f02\u5e38\u96be\u4ee5\u5b9a\u4f4d\u5904\u7406\u3002"}),"\n",(0,r.jsx)(n.p,{children:"OKG \u8ba4\u4e3a\u6e38\u620f\u670d\u7684\u670d\u52a1\u8d28\u91cf\u5e94\u7531\u7528\u6237\u5b9a\u4e49\uff0c\u7528\u6237\u53ef\u6839\u636e\u4e1a\u52a1\u9488\u5bf9\u6027\u5730\u8bbe\u7f6e\u6e38\u620f\u670d\u6240\u5904\u7684\u72b6\u6001\uff0c\u5e76\u7cbe\u7ec6\u5316\u5730\u8fdb\u884c\u76f8\u5e94\u5904\u7406\u3002\u901a\u8fc7 OKG \u7684\u201d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u201c\u63a2\u6d4b\u5230\u5177\u4f53\u8fdb\u7a0b\u5f02\u5e38\u72b6\u6001\uff0c\u5e76\u5c06\u5176\u900f\u51fa\u81f3 Kubernetes \u4fa7\uff0c\u518d\u5229\u7528 kube-event \u7b49\u4e8b\u4ef6\u901a\u77e5\u7ec4\u4ef6\u5c06\u5f02\u5e38\u544a\u8b66\u81f3\u8fd0\u7ef4\u7fa4\u4e2d\uff0c\u5e2e\u52a9\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u5feb\u901f\u53d1\u73b0\u95ee\u9898\uff0c\u5b9e\u73b0\u79d2\u7ea7\u6545\u969c\u5b9a\u4f4d\uff0c\u5206\u949f\u7ea7\u7684\u6545\u969c\u5904\u7406\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u4e0b\u56fe\u662f\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u529f\u80fd\u793a\u610f\u56fe\uff0c\u901a\u8fc7 probe.sh \u811a\u672c\u7684\u8fd4\u56de\u7ed3\u679c\uff0c\u5bf9\u5e94\u66f4\u6539GameServer\u7684\u8fd0\u7ef4\u72b6\u6001\uff0c\u5b9e\u73b0\u6545\u969c/\u5f02\u5e38\u7684\u5feb\u901f\u5b9a\u4f4d\uff1a"}),"\n",(0,r.jsx)("img",{src:a(17011).A,style:{width:"500px"}}),"\n",(0,r.jsx)(n.h3,{id:"\u793a\u4f8b",children:"\u793a\u4f8b"}),"\n",(0,r.jsx)(n.p,{children:"\u6211\u4eec\u6765\u901a\u8fc7\u4e00\u4e2a\u793a\u4f8b\u770b\u4e0b\u5982\u4f55\u901a\u8fc7\u4e00\u4e2a\u63a2\u6d4b\u811a\u672c\u5b9e\u73b0\u6e38\u620f\u670d\u591a\u79cd\u72b6\u6001\u611f\u77e5\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5728\u5236\u4f5c\u5bb9\u5668\u955c\u50cf\u65f6\uff0c\u7f16\u5199\u63a2\u6d4b\u5bb9\u5668\u72b6\u6001\u7684\u811a\u672c\u3002\u8be5\u793a\u4f8b\u811a\u672c probe.sh \u5c06\u63a2\u6d4bgate\u8fdb\u7a0b\u3001data\u8fdb\u7a0b\u662f\u5426\u5b58\u5728\u3002\n\u5f53gate\u8fdb\u7a0b\u4e0d\u5b58\u5728\u5219\u8f93\u51fa\u201cgate\u201d\uff0c\u5e76\u6b63\u5e38\u9000\u51fa\uff1b\u5f53data\u8fdb\u7a0b\u4e0d\u5b58\u5728\u5219\u8f93\u51fa\u201cdata\u201d\uff0c\u5e76\u6b63\u5e38\u9000\u51fa\uff1b\u5f53\u4e0d\u5b58\u5728\u5f02\u5e38\uff0c\u4ee5\u9000\u51fa\u78011\u9000\u51fa\u3002"}),"\n",(0,r.jsx)(n.p,{children:"probe.sh \u662f\u4e1a\u52a1\u5bb9\u5668\u4e2d\u63a2\u6d4b\u811a\u672c\uff0c\u5c06\u88abOKG\u5468\u671f\u6027\u8c03\u7528\uff0c\u539f\u7406\u7c7b\u4f3c\u4e8eKubernetes\u539f\u751f\u7684liveness/readiness\u63a2\u9488\u3002\u5728\u4e0a\u8ff0\u573a\u666f\u4e0b\uff0c\u5176\u4ee3\u7801\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'#!/bin/bash\n\ngate=$(ps -ef | grep gate | grep -v grep | wc -l)\ndata=$(ps -ef | grep data | grep -v grep | wc -l)\n\nif [ $gate != 1 ]\nthen\n  echo "gate"\n  exit 0\nfi\n\nif [ $data != 1 ]\nthen\n  echo "data"\n  exit 0\nfi\n\nexit 1\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u800c\u5bf9\u5e94\u7684GameServerSet\u7684yaml\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      maxUnavailable: 100%\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0\n          name: minecraft\n  serviceQualities:\n    - name: healthy\n      containerName: minecraft\n      permanent: false\n      exec:\n        command: ["bash", "./probe.sh"]\n      serviceQualityAction:\n        - state: true\n          result: gate\n          opsState: GateMaintaining\n        - state: true\n          result: data\n          opsState: DataMaintaining\n        - state: false\n          opsState: None\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u90e8\u7f72\u5b8c\u6210\u540e\uff0c\u751f\u62103\u4e2aPod\u4e0eGameServer"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     14s\nminecraft-1   Ready   None       0     0     14s\nminecraft-2   Ready   None       0     0     14s\n\nkubectl get po\nNAME          READY   STATUS    RESTARTS   AGE\nminecraft-0   1/1     Running   0          15s\nminecraft-1   1/1     Running   0          15s\nminecraft-2   1/1     Running   0          15s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165minecraft-0\u5bb9\u5668\u4e2d\uff0c\u6a21\u62dfgate\u8fdb\u7a0b\u6545\u969c\uff0c\u5c06\u5176\u5bf9\u5e94\u7684\u8fdb\u7a0b\u53f7kil"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-0 /bin/bash\n\n/data# ps -ef\nUID          PID    PPID  C STIME TTY          TIME CMD\nroot           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh\nroot           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh\nroot           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh\nroot           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.\n...\n\n/data# kill -9 7\n\n/data# exit\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u83b7\u53d6\u5f53\u524dgs\u7684opsState\uff0c\u5df2\u7ecf\u53d8\u4e3aGateMaintaining"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"\nkubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   GateMaintaining   0     0     2m14s\nminecraft-1   Ready   None              0     0     2m14s\nminecraft-2   Ready   None              0     0     2m14s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165minecraft-1\u5bb9\u5668\u4e2d\uff0c\u6a21\u62dfdata\u8fdb\u7a0b\u6545\u969c\uff0c\u5c06\u5176\u5bf9\u5e94\u7684\u8fdb\u7a0b\u53f7kil"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-1 /bin/bash\n\n/data# ps -ef\nUID          PID    PPID  C STIME TTY          TIME CMD\nroot           1       0  0 03:00 ?        00:00:00 /bin/bash ./start.sh\nroot           7       1  0 03:00 ?        00:00:00 /bin/bash ./gate.sh\nroot           8       1  0 03:00 ?        00:00:00 /bin/bash ./data.sh\nroot           9       1 99 03:00 ?        00:00:24 java -jar /minecraft_server.\n...\n\n/data# kill -9 8\n\n/data# exit\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u83b7\u53d6\u5f53\u524dgs\u7684opsState\uff0c\u5df2\u7ecf\u53d8\u4e3aDataMaintaining"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   GateMaintaining   0     0     3m10s\nminecraft-1   Ready   DataMaintaining   0     0     3m10s\nminecraft-2   Ready   None              0     0     3m10s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u5206\u522b\u8fdb\u5165minecraft-0\uff0cminecraft-1\uff0c\u624b\u52a8\u62c9\u8d77\u6302\u6389\u7684\u8fdb\u7a0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl exec -it minecraft-0 /bin/bash\n\n/data# bash ./gate.sh &\n\n/data# exit\n\nkubectl exec -it minecraft-1 /bin/bash\n\n/data# bash ./data.sh &\n\n/data# exit\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u6b64\u65f6\uff0cgs\u7684\u8fd0\u7ef4\u72b6\u6001\u5df2\u7ecf\u90fd\u6062\u590d\u4e3aNone"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get gs\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     5m6s\nminecraft-1   Ready   None       0     0     5m6s\nminecraft-2   Ready   None       0     0     5m6s\n"})}),"\n",(0,r.jsx)(n.h2,{id:"\u6e38\u620f\u670d\u5b9a\u5411\u7ba1\u7406",children:"\u6e38\u620f\u670d\u5b9a\u5411\u7ba1\u7406"}),"\n",(0,r.jsx)(n.h3,{id:"\u8bbe\u7f6egameserver\u56de\u6536\u7b56\u7565",children:"\u8bbe\u7f6eGameServer\u56de\u6536\u7b56\u7565"}),"\n",(0,r.jsx)(n.p,{children:"GameServer\u5b58\u5728\u4e24\u79cd\u751f\u547d\u5468\u671f\u56de\u6536\u7b56\u7565 \u2014\u2014 Cascade \u4e0e Delete\uff0c\u5728GameServerSet.Spec.GameServerTemplate.ReclaimPolicy\u8bbe\u7f6e\u3002"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Cascade\uff1aGameServer\u5728pod\u5220\u9664\u65f6\u88ab\u56de\u6536\uff0c\u4e0epod\u751f\u547d\u5468\u671f\u4fdd\u6301\u4e00\u81f4\u3002Cascade\u4e3aReclaimPolicy\u7684\u9ed8\u8ba4\u503c\u3002"}),"\n",(0,r.jsx)(n.li,{children:"Delete\uff1aGameServer\u5728GameServerSet\u526f\u672c\u6570\u7f29\u5c0f\u65f6\u88ab\u56de\u6536\u3002\u5f53\u5bf9\u5e94\u7684pod\u88ab\u624b\u52a8\u5220\u9664\u3001\u66f4\u65b0\u91cd\u5efa\u3001\u88ab\u9a71\u9010\u65f6\uff0cGameServer\u90fd\u4e0d\u4f1a\u88ab\u5220\u9664\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"Cascade"}),"\u7b56\u7565\u9002\u5408\u77ed\u751f\u547d\u5468\u671f\u6e38\u620f\u670d\uff0c\u5b58\u5728\u9891\u7e41\u542f\u52a8\u5220\u9664\u800c\u72b6\u6001\u9700\u8981\u53ca\u65f6\u6e05\u7a7a\u7684\u60c5\u666f\uff0c\u5982\u5927\u90e8\u5206\u7684PvP\u4f1a\u8bdd\u7c7b\u6e38\u620f\u3002\n\u800c",(0,r.jsx)(n.code,{children:"Delete"}),"\u7b56\u7565\u66f4\u9002\u5408\u4f20\u7edf\u533a\u670d\u7c7bPvE\u6e38\u620f\uff0c\u6e38\u620f\u670d\u7684\u72b6\u6001\u9700\u8981\u957f\u671f\u88ab\u8bb0\u5f55\u5728GameServer\u4e0a\uff0c\u907f\u514d\u72b6\u6001\u4e22\u5931\u3002\u53ea\u6709\u7528\u6237\u6267\u884c\u5408\u670d/\u5220\u670d\u64cd\u4f5c\u65f6\u624d\u4f1a\u5c06\u5176\u56de\u6536\u3002\n\u5728\u521b\u5efaGameServerSet\u65f6\u663e\u5f0f\u58f0\u660eGameServer\u56de\u6536\u7b56\u7565\u4e3aDelete\uff0c\u80fd\u591f\u66f4\u597d\u5730\u5b9e\u73b0\u533a\u670d\u7c7b\u6e38\u620f\u7684\u5b9a\u5411\u7ba1\u7406\u529f\u80fd\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c",children:"\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c"}),"\n",(0,r.jsx)(n.p,{children:"\u5b58\u5728\u5bf9\u7279\u5b9a\u6e38\u620f\u670d\u5b58\u5728\u5b9a\u5411\u66f4\u65b0\u955c\u50cf\u7684\u573a\u666f\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u5728\u7070\u5ea6\u6216\u6d4b\u8bd5\u73af\u5883\u4e2d\uff0c\u4e0d\u540c\u533a\u5bf9\u5e94\u7740\u4e0d\u540c\u7684\u955c\u50cf\u7248\u672c\uff1b"}),"\n",(0,r.jsx)(n.li,{children:"SLG\u7c7b\u578b\u6e38\u620f\u5b58\u5728\u73a9\u6cd5\u526f\u672c\u7684\u6982\u5ff5\uff0c\u4e0d\u540c\u533a\u7684\u73a9\u6cd5\u53ef\u80fd\u4e0d\u5c3d\u76f8\u540c\uff0c\u5bf9\u5e94\u7740\u4e0d\u540c\u7684\u955c\u50cf\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u9488\u5bf9\u8fd9\u79cd\u4e00\u4e2aGameServerSet\u4e0b\u53ef\u80fd\u5b58\u5728\u591a\u4e2a\u7248\u672c\u7684\u955c\u50cf\u6e38\u620f\u670d\uff0c\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6eGameServer.Spec.Containers\u4e2dimage\u5b57\u6bb5\u6765\u6307\u5b9a\u66f4\u65b0\u7279\u5b9a\u6e38\u620f\u670d\u955c\u50cf\u7248\u672c\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5b58\u5728\u5bf9\u7279\u5b9a\u6e38\u620f\u670d\u5b58\u5728\u5b9a\u5411\u66f4\u65b0\u955c\u50cf\u7684\u573a\u666f\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u968f\u7740\u65f6\u95f4\u589e\u957f\uff0c\u51fa\u73b0\u73a9\u5bb6\u589e\u52a0\u8fc7\u591a\u3001\u6216\u8005\u6d41\u5931\u7684\u60c5\u51b5\uff0c\u67d0\u4e9b\u533a\u670d\u7684\u8ba1\u7b97\u8d44\u6e90\u65e0\u6cd5\u6ee1\u8db3\u5f53\u524d\u9700\u6c42\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u9488\u5bf9\u8fd9\u79cd\u4e00\u4e2aGameServerSet\u4e0b\u53ef\u80fd\u5b58\u5728\u591a\u79cd\u8d44\u6e90\u89c4\u683c\u6e38\u620f\u670d\uff0c\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6eGameServer.Spec.Containers\u4e2dresources\u5b57\u6bb5\u6765\u6307\u5b9a\u6e38\u620f\u670d\u7279\u5b9a\u8d44\u6e90\u89c4\u683c\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c\u7684\u793a\u610f\u56fe\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)("img",{src:a(20179).A,style:{width:"500px"}}),"\n",(0,r.jsx)(n.h4,{id:"\u793a\u4f8b\u8bf4\u660e",children:"\u793a\u4f8b\u8bf4\u660e"}),"\n",(0,r.jsx)(n.p,{children:"\u63a5\u4e0b\u6765\u901a\u8fc7\u4e00\u4e2a\u793a\u4f8b\u6765\u5c55\u793a\u5982\u4f55\u8fdb\u884c\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670d\u7684\u955c\u50cf\u4e0e\u8d44\u6e90\u89c4\u683c\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u9996\u5148\u90e8\u7f72\u4e00\u4e2a3\u526f\u672c\u7684GameServerSet"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\nspec:\n  replicas: 3\n  gameServerTemplate:\n    reclaimPolicy: Delete\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n          name: minecraft\n  updateStrategy:\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      maxUnavailable: 100%\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u5b9a\u5411\u66f4\u65b0minecraft-0\u7684\u955c\u50cf\uff0c\u5c06\u5176\u6539\u4e3a registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"kubectl edit gs minecraft-0\n\n...\nspec:\n  deletionPriority: 0\n  opsState: None\n  updatePriority: 0\n  # \u65b0\u589econtainers\n  containers:\n  - name: minecraft\n    image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new\n...\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u4fdd\u5b58\u9000\u51fa\u540e\uff0c\u8fc7\u4e00\u6bb5\u65f6\u95f4\u8fc7\u540e\uff0cpod\u5b8c\u6210\u66f4\u65b0\uff08\u7531\u4e8e\u6307\u5b9a\u539f\u5730\u5347\u7ea7\u7b56\u7565\uff0c\u6545\u5bb9\u5668\u91cd\u542f\u6b21\u6570+1\uff09\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl get po\nNAME                  READY   STATUS    RESTARTS      AGE\nminecraft-0           1/1     Running   1 (13s ago)   3m28s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u6b64\u65f6\uff0c\u5047\u5982pod\u6545\u969c/\u6216\u88ab\u624b\u52a8\u5220\u9664\uff0c\u751f\u6210\u7684pod\u955c\u50cf\u4f1a\u4ee5GameServer\u58f0\u660e\u7684spec\u4e3a\u51c6\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# delete pod\nkubectl delete po minecraft-0\n\n# pod state is Terminating, gs state is Deleting\nkubectl get gs minecraft-0\nNAME          STATE      OPSSTATE   DP    UP    AGE\nminecraft-0   Deleting   None       0     0     8m19s\n\nkubectl get po minecraft-0\nNAME          READY   STATUS        RESTARTS        AGE\nminecraft-0   1/1     Terminating   1 (5m12s ago)   8m19s\n\n# after a while\n# pod running again\uff0cage of GameServer is different from age of pod\nkubectl get po minecraft-0\nNAME          READY   STATUS    RESTARTS   AGE\nminecraft-0   1/1     Running   0          28s\n\nkubectl get gs minecraft-0\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-0   Ready   None       0     0     9m18s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u7531\u4e8e\u8bbe\u7f6e\u4e86gs\u56de\u6536\u7b56\u7565\u4e3aDelete\uff0c\u6240\u4ee5\u6e38\u620f\u670d\u7684\u8bbe\u7f6e\u7684\u72b6\u6001\u4e0d\u4f1a\u56e0\u4e3apod\u7684\u6d88\u5931\u800c\u6d88\u5931\u3002\n\u5f53\u524d\u6e38\u620f\u670d\u7684\u955c\u50cf\u4f9d\u7136\u662f\u66f4\u65b0\u540e\u7684registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new"}),"\n",(0,r.jsx)(n.p,{children:"\u63a5\u4e0b\u6765\u5b9a\u5411\u66f4\u65b0\u6e38\u620f\u670dminecraft-1\u7684\u8d44\u6e90\u89c4\u683c\uff0c\u5c06requests\u8c03\u6574\u4e3acpu: 500m\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"kubectl edit gs minecraft-1\n\n...\nspec:\n  deletionPriority: 0\n  opsState: None\n  updatePriority: 0\n  # \u65b0\u589econtainers\n  containers:\n  - name: minecraft\n    resources:\n      requests:\n        cpu: 500m\n...\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8d44\u6e90\u914d\u7f6e\u4e0d\u4f1a\u7acb\u5373\u539f\u5730\u66f4\u65b0\u3002\u7b49\u5f85\u505c\u670d\u7ef4\u62a4\u65f6\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u624b\u52a8\u4f7fpod\u91cd\u5efa\uff0c\u65b0\u7684\u8d44\u6e90\u89c4\u683c\u5373\u53ef\u751f\u6548\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl delete po minecraft-1\n\n# after a while\n\n# gs won't be deleted\nkubectl get gs minecraft-1\nNAME          STATE   OPSSTATE   DP    UP    AGE\nminecraft-1   Ready   None       0     0     15m\n\n# pod recreated\nkubectl get po minecraft-1\nNAME          READY   STATUS    RESTARTS   AGE\nminecraft-1   1/1     Running   0          11s\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u6b64\u65f6\uff0cpod\u7684\u8d44\u6e90\u89c4\u683crequests\u8c03\u6574\u4e3acpu: 500m"}),"\n",(0,r.jsx)(n.h3,{id:"\u6e38\u620f\u670d\u5408\u670d",children:"\u6e38\u620f\u670d\u5408\u670d"}),"\n",(0,r.jsx)(n.p,{children:"\u5f53\u67d0\u4e00\u533a\u670d\u6e38\u620f\u73a9\u5bb6\u6d41\u5931\u5230\u4e00\u5b9a\u7a0b\u5ea6\uff0c\u9700\u8981\u8fdb\u884c\u5408\u670d\u64cd\u4f5c\uff0c\u6b64\u65f6\u53ef\u4ee5\u5b9a\u5411\u5c06\u6e38\u620f\u670d\u8fdb\u884c\u5220\u9664\u3002"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u901a\u8fc7ReserveGameServerIds\u4e0ereplicas\u8bbe\u7f6e\u53ef\u4ee5\u5b9e\u73b0\u6279\u91cf\u5408\u670d\u52a8\u4f5c\uff0c\u4f8b\u5982\uff0c\u5b58\u57285\u4e2a\u6e38\u620f\u670d\uff0cid\u5206\u522b\u4e3a0\u30011\u30012\u30013\u30014\uff0c\u5e0c\u671b\u5220\u9664\u6e38\u620f\u670d2\u30013\uff0c\u5219\u8bbe\u7f6eReserveGameServerIds\u4e3a2\u548c3\uff0c\u540c\u65f6replicas\u8c03\u6574\u4e3a3\u5373\u53ef\u3002\u8be6\u60c5\u53ef\u53c2\u8003\u6587\u6863\uff1a",(0,r.jsx)(n.a,{href:"https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#%E6%B8%B8%E6%88%8F%E6%9C%8D-id-reserve",children:"\u6e38\u620f\u670d\u4f38\u7f29\u6587\u6863/\u6e38\u620f\u670d id reserve"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u800c\u901a\u8fc7\u8bbe\u7f6egs\u7684opsState\u4e3aKill\u4e5f\u53ef\u4ee5\u5b9e\u73b0\u5feb\u901f\u5bf9\u4e00\u4e2a\u6e38\u620f\u670d\u8fdb\u884c\u5220\u9664\u64cd\u4f5c\u3002\u8be6\u60c5\u53ef\u53c2\u8003\u6587\u6863\uff1a",(0,r.jsx)(n.a,{href:"https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale#%E6%B8%B8%E6%88%8F%E6%9C%8D-kill",children:"\u6e38\u620f\u670d\u4f38\u7f29\u6587\u6863/\u6e38\u620f\u670dKill"})]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"okg\u7ba1\u7406pve\u6e38\u620f\u670d\u5e38\u89c1\u95ee\u9898",children:"OKG\u7ba1\u7406PvE\u6e38\u620f\u670d\u5e38\u89c1\u95ee\u9898"}),"\n",(0,r.jsx)(n.h3,{id:"q\u5982\u4f55\u51b3\u5b9agameserverset\u7684\u7eb3\u7ba1\u8303\u56f4",children:"Q\uff1a\u5982\u4f55\u51b3\u5b9aGameServerSet\u7684\u7eb3\u7ba1\u8303\u56f4\uff1f"}),"\n",(0,r.jsx)(n.p,{children:"\u9996\u5148\u9700\u8981\u660e\u786e\u7684\u662fGameServerSet(\u7b80\u79f0gss)\u662f\u96c6\u7fa4\u7ef4\u5ea6\u7684\u8d44\u6e90\uff0c\u4e0d\u53ef\u8de8\u96c6\u7fa4\u58f0\u660e\u3002\u5176\u6b21\uff0cPvE\u7c7b\u578b\u6e38\u620f\u901a\u5e38\u4f1a\u6d89\u53ca\u5230zone\u3001group\u7b49\u6982\u5ff5\uff0c\u7ef4\u5ea6\u8f83\u591a\u3002\u8fd9\u6837\u4e00\u6765\uff0c\u540c\u4e2azone\u4f7f\u7528\u4e00\u4e2agss\uff1f\u8fd8\u662f\u540c\u4e2agroup\u4f7f\u7528\u4e00\u4e2agss\u5462\uff1f\u5b9e\u9645\u4e0a\uff0c\u5224\u65ad\u6761\u4ef6\u4e3b\u8981\u53d6\u51b3\u4e8e\u8fd9\u4e9b\u6e38\u620f\u670d\u521d\u59cb\u7684\u5dee\u5f02\u6027\u5982\u4f55\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5dee\u5f02\u6027\u7684\u8003\u91cf\u4e00\u822c\u53ef\u4ee5\u4ece\u4e24\u4e2a\u65b9\u9762\u6765\u770b\uff1a"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"\u914d\u7f6e\u5dee\u5f02\u6027\u3002\u5982\u4e0a\u6587\u914d\u7f6e\u7ba1\u7406\u6240\u8ff0\uff0c\u53ef\u4ee5\u901a\u8fc7\u6e38\u620f\u670dGameServer\u96c6\u7fa4\u547d\u540d\u7a7a\u95f4\u5185\u552f\u4e00\u540d\u79f0\u7684\u7279\u6027\u5c4f\u853d\u6389\u5185\u5bb9\u7684\u5dee\u5f02\u3002\u6545\u53ef\u4ee5\u4f7f\u7528\u540c\u4e00\u4e2aGameServerSet\u7ba1\u7406\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u8d44\u6e90\u89c4\u683c\u5dee\u5f02\u6027\u4e0e\u955c\u50cf\u7248\u672c\u5dee\u5f02\u6027\u3002\u8fd9\u7c7b\u5dee\u5f02\u6027\u5b58\u5728\u4e24\u79cd\u60c5\u51b5\uff1a1\uff09\u521d\u59cb\u65f6\u4e00\u81f4\uff0c\u968f\u7740\u65f6\u95f4\u62c9\u957f\u5f00\u59cb\u51fa\u73b0\u5dee\u5f02\u6027\u30022\uff09\u521d\u59cb\u5c31\u4e0d\u4e00\u81f4\u3002\u5bf9\u4e8e\u60c5\u51b51\uff0c\u4f7f\u7528\u4f7f\u7528\u540c\u4e00\u4e2aGameServerSet\u7ba1\u7406\u6e38\u620f\u670d\uff0c\u518d\u5229\u7528\u4e0a\u6587\u63d0\u5230\u7684OKG\u5b9a\u5411\u66f4\u65b0\u529f\u80fd\u5373\u53ef\u3002\u5bf9\u4e8e\u60c5\u51b52\uff0c\u5b9e\u9645\u4e0a\u4e5f\u53ef\u4ee5\u4f7f\u7528\u540c\u4e00\u4e2aGameServerSet\u7ba1\u7406\u6e38\u620f\u670d\uff0c\u53ea\u4e0d\u8fc7\u5728\u5f00\u65b0\u670d\u65f6\uff0c\u505a\u7684\u64cd\u4f5c\u5c31\u66f4\u52a0\u590d\u6742\u4e00\u4e9b\uff0c\u4e0d\u4ec5\u9700\u8981\u8c03\u6574\u526f\u672c\u6570\u76ee\uff0c\u8fd8\u9700\u8981\u8c03\u6574\u5bf9\u5e94\u7684GameServer\u7684Spec\uff0c\u4f7f\u5176\u62e5\u6709\u72ec\u7acb\u7684\u955c\u50cf\u6216\u8d44\u6e90\u914d\u7f6e\u3002\u8fd9\u79cd\u65b9\u5f0f\u6bd4\u8f83\u9002\u5408\u6d4b\u8bd5\u73af\u5883\u6216\u533a\u670d\u6570\u76ee\u8f83\u5c11\u7684\u751f\u4ea7\u73af\u5883\u3002\u5728\u533a\u670d\u6570\u76ee\u89c4\u6a21\u8f83\u5927\u65f6\uff0c\u5efa\u8bae\u8fdb\u884c\u89c4\u683c\u9650\u5b9a\uff0c\u4f7f\u540c\u79cd\u955c\u50cf\u540c\u79cd\u8d44\u6e90\u89c4\u683c\u7684\u6e38\u620f\u670d\u7528\u540c\u4e00\u4e2aGameServerSet\u7ba1\u7406\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"q\u5982\u4f55\u8fdb\u884c\u5f00\u65b0\u670d",children:"Q\uff1a\u5982\u4f55\u8fdb\u884c\u5f00\u65b0\u670d\uff1f"}),"\n",(0,r.jsx)(n.p,{children:"\u65b0\u5f00\u670d\u7684\u6b65\u9aa4\u5982\u4e0b\uff1a"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"\u786e\u4fdd\u96c6\u7fa4\u4e2d\u90e8\u7f72\u4e86\u76f8\u5e94\u7684GameServerSet\uff08\u521d\u59cb\u526f\u672c\u6570\u76ee\u6216\u4e3a0\uff09"}),"\n",(0,r.jsx)(n.li,{children:"\u82e5\u5b58\u5728\u5dee\u5f02\u914d\u7f6e\uff0c\u5219\u63d0\u524d\u5c06\u914d\u7f6e\u6587\u4ef6\u51c6\u5907\u597d\u5e76\u4e0a\u4f20\u81f3oss\u6216\u7528\u6237\u81ea\u5b9a\u4e49\u914d\u7f6e\u4e2d\u5fc3\uff08\u82e5\u4e0d\u5b58\u5728\u5dee\u5f02\u6027\u914d\u7f6e\uff0c\u5219\u4f7f\u7528\u521b\u5efaGameServerSet\u65f6\u914d\u7f6econfigmap\u5373\u53ef\uff09"}),"\n",(0,r.jsx)(n.li,{children:"\u627e\u5230\u5bf9\u5e94\u7684gss\uff0c\u8c03\u6574\u526f\u672c\u6570\u76ee\u4f7f\u589e\u52a0\u76f8\u5e94\u5f00\u670d\u7684\u6570\u91cf"}),"\n",(0,r.jsx)(n.li,{children:"\u82e5\u5f00\u65b0\u670d\u7684\u955c\u50cf\u7248\u672c/\u8d44\u6e90\u89c4\u683c\u4e0eGameServerSet\u4e2d\u58f0\u660e\u7684\u4e0d\u4e00\u81f4\uff0c\u5219\u53ef\u4ee5\u66f4\u6539\u5bf9\u5e94\u7684GameServerSpec\u7684containers\u5b57\u6bb5\u7684\u955c\u50cf\u6216\u8d44\u6e90\u3002\u9700\u8981\u6ce8\u610f\u7684\u662f\uff0c\u5982\u679c\u8981\u8c03\u6574\u8d44\u6e90\u89c4\u683c\uff0c\u9700\u8981\u624b\u52a8\u5220\u9664pod\uff0c\u4f7f\u5176\u5b8c\u6210\u4e00\u6b21\u91cd\u5efa\u3002"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},17011:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/service-quality-6a85ac35076d49fe51b2831687889b74.png"},18582:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/oss-bucket-dir-3da27b35ab914e79052494ea34c4fcc8.jpg"},20179:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/gs-update-images-resources-efb341d5625395dad21d7dc33fcce384.png"},28453:(e,n,a)=>{a.d(n,{R:()=>t,x:()=>l});var s=a(96540);const r={},i=s.createContext(r);function t(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),s.createElement(i.Provider,{value:n},e.children)}},92574:(e,n,a)=>{a.d(n,{A:()=>s});const s=a.p+"assets/images/gss-oss-config-232c4704ef92d655db215be6c09dc6e2.png"}}]);
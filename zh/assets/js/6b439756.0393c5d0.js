"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4561],{25743:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/workload-cbf2f03992217aa38733716ae37e750d.png"},28453:(e,n,r)=>{r.d(n,{R:()=>a,x:()=>t});var s=r(96540);const i={},l=s.createContext(i);function a(e){const n=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(l.Provider,{value:n},e.children)}},35376:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/arch-2bffaf0865dc1539c02a6aed71478b70.png"},42300:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>o});const s=JSON.parse('{"id":"design-concept","title":"\u8bbe\u8ba1\u7406\u5ff5","description":"\u5f00\u6e90OpenKruiseGame\uff08OKG)\u7684\u521d\u8877","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/design-concept.md","sourceDirName":".","slug":"/design-concept","permalink":"/zh/kruisegame/design-concept","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u5b89\u88c5","permalink":"/zh/kruisegame/installation"},"next":{"title":"\u90e8\u7f72\u6e38\u620f\u670d","permalink":"/zh/kruisegame/user-manuals/deploy-gameservers"}}');var i=r(74848),l=r(28453);const a={},t="\u8bbe\u8ba1\u7406\u5ff5",c={},o=[{value:"\u5f00\u6e90OpenKruiseGame\uff08OKG)\u7684\u521d\u8877",id:"\u5f00\u6e90openkruisegameokg\u7684\u521d\u8877",level:2},{value:"\u4e3a\u4ec0\u4e48OpenKruiseGame\uff08OKG\uff09\u662f\u4e00\u4e2a\u5de5\u4f5c\u8d1f\u8f7d",id:"\u4e3a\u4ec0\u4e48openkruisegameokg\u662f\u4e00\u4e2a\u5de5\u4f5c\u8d1f\u8f7d",level:2},{value:"OpenKruiseGame\uff08OKG\uff09\u7684\u8bbe\u8ba1\u7406\u5ff5",id:"openkruisegameokg\u7684\u8bbe\u8ba1\u7406\u5ff5",level:2},{value:"OpenKruiseGame\uff08OKG\uff09\u7684\u90e8\u7f72\u67b6\u6784",id:"openkruisegameokg\u7684\u90e8\u7f72\u67b6\u6784",level:2}];function u(e){const n={blockquote:"blockquote",br:"br",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\u8bbe\u8ba1\u7406\u5ff5",children:"\u8bbe\u8ba1\u7406\u5ff5"})}),"\n",(0,i.jsx)(n.h2,{id:"\u5f00\u6e90openkruisegameokg\u7684\u521d\u8877",children:"\u5f00\u6e90OpenKruiseGame\uff08OKG)\u7684\u521d\u8877"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\u6211\u662f\u4ece2015\u5e74\u5f00\u59cb\u505a\u4e91\u539f\u751f\u4ea7\u54c1\u7684\uff0c\u4ece\u6700\u5f00\u59cb\u7684Swarm\u5230\u540e\u6765\u7684Kubernetes\uff0c\u5728\u5bb9\u5668\u96c6\u7fa4\u4e4b\u4e0a\u8fd0\u884c\u7684\u8d1f\u8f7d\u7c7b\u578b\u4ece\u65e9\u671f\u7684\u7f51\u7ad9\u3001API\u670d\u52a1\u5230\u540e\u6765\u7684\u8f6c\u7801\u3001AI\u8bad\u7ec3\u518d\u5230\u5143\u5b87\u5b99\u3001Web3\u3001\u56fe\u5f62\u5316\u5e94\u7528\u3002\u6211\u4eec\u89c1\u8bc1\u4e86\u4e91\u539f\u751f\u6280\u672f\u5728\u6539\u53d8\u4e00\u4e2a\u53c8\u4e00\u4e2a\u884c\u4e1a\u3002\u4f46\u662f\uff0c\u6e38\u620f\u662f\u4e00\u4e2a\u975e\u5e38\u7279\u6b8a\u7684\u884c\u4e1a\uff0c\u4e00\u4e2a\u5927\u578b\u7684\u6e38\u620f\uff0c\u5305\u542b\u7f51\u5173\u3001\u5e73\u53f0\u670d\u3001\u6e38\u620f\u670d\u3001\u5339\u914d\u670d\u7b49\u4e0d\u540c\u79cd\u89d2\u8272\u3002\u5f88\u591a\u6e38\u620f\u516c\u53f8\u65e9\u5df2\u5c06\u5e73\u53f0\u670d\u3001\u7f51\u5173\u7b49\u4e1a\u52a1\u8fdb\u884c\u4e86\u4e91\u539f\u751f\u5316\u6539\u9020\uff0c\u4f46\u662f\uff0c\u6e38\u620f\u670d\u7684\u5bb9\u5668\u5316\u8fdb\u5c55\u90fd\u6bd4\u8f83\u7f13\u6162\u3002\u901a\u8fc7\u548c\u5927\u91cf\u7684\u6e38\u620f\u5f00\u53d1\u8005/\u8fd0\u7ef4\u4eba\u5458\u8fdb\u884c\u4ea4\u6d41\uff0c\u5927\u81f4\u53ef\u4ee5\u5f52\u7eb3\u4e3a\u5982\u4e0b\u4e09\u4e2a\u91cd\u8981\u7684\u539f\u56e0\u3002"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"\u8fd0\u884c\u4e2d\u7684\u6e38\u620f\u670d\u66f4\u6362\u90e8\u7f72\u67b6\u6784\u7684\u98ce\u9669\u6536\u76ca\u6bd4\u8fc7\u9ad8\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u8fc7\u7a0b\u4e2d\u5b58\u5728\u7f3a\u5931\u7684\u6838\u5fc3\u529f\u80fd\uff0c\u4f8b\u5982\uff1a\u6e38\u620f\u70ed\u66f4\u65b0\uff0c\u5b9a\u5411\u5408\u670d/\u505c\u670d\u7b49\u3002"}),"\n",(0,i.jsx)(n.li,{children:"\u7f3a\u5c11\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u7684\u6700\u4f73\u5b9e\u8df5\u4e0e\u6210\u529f\u6848\u4f8b\u3002"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u4e3a\u4e86\u89e3\u51b3\u4e0a\u8ff0\u95ee\u9898\uff0c\u6211\u4eec\u8054\u5408\u4e86\u7075\u7280\u4e92\u5a31\u7b49\u591a\u5bb6\u6e38\u620f\u516c\u53f8\uff0c\u5c06\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u573a\u666f\u4e0b\u7684\u901a\u7528\u80fd\u529b\u8fdb\u884c\u4e86\u62bd\u8c61\uff0c\u5f00\u6e90\u4e86OpenKruiseGame\u9879\u76ee\u3002\u5e0c\u671b\u80fd\u591f\u901a\u8fc7\u4e00\u4e2a\u4e91\u5382\u5546\u65e0\u5173\u7684\u5f00\u6e90\u9879\u76ee\uff0c\u5c06\u6e38\u620f\u670d\u7684\u4e91\u539f\u751f\u5316\u6700\u4f73\u5b9e\u8df5\u4ea4\u4ed8\u7ed9\u66f4\u591a\u7684\u6e38\u620f\u5f00\u53d1\u8005\u3002\u540c\u65f6\uff0c\u6211\u4eec\u4e5f\u5e0c\u671b\u8d8a\u6765\u8d8a\u591a\u7684\u6e38\u620f\u516c\u53f8/\u5de5\u4f5c\u5ba4/\u5f00\u53d1\u8005\u53ef\u4ee5\u53c2\u4e0e\u5230\u793e\u533a\uff0c\u5c06\u9047\u5230\u7684\u96be\u9898\u3001\u573a\u666f\u548c\u5927\u5bb6\u4e00\u8d77\u8ba8\u8bba\uff0c\u5206\u4eab\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u7684\u7ecf\u9a8c\u3002"}),"\n"]}),"\n",(0,i.jsx)("p",{align:"right",children:"\u6765\u81ea  \u5218\u4e2d\u5dcd\uff0c\u963f\u91cc\u4e91\u5bb9\u5668\u670d\u52a1\uff0cOpenKruiseGame\u9879\u76ee\u53d1\u8d77\u4eba"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\u7075\u7280\u4e92\u5a31\u5df2\u5168\u9762\u62e5\u62b1\u4e91\u539f\u751f\u67b6\u6784\uff0c\u5728\u4e91\u539f\u751f\u5316\u8fc7\u7a0b\u4e2d\u6211\u4eec\u6e05\u695a\u5730\u8ba4\u8bc6\u5230\uff0c\u6e38\u620f\u670d\u4e0d\u540c\u4e8e\u5176\u4ed6Web\u7c7b\u578b\u5e94\u7528\uff0c\u5728k8s\u96c6\u7fa4\u4e4b\u4e2d\u5bf9\u5176\u7684\u7ba1\u7406\u662f\u975e\u5e38\u590d\u6742\u7684\u3002\u539f\u751fk8s workload \u63d0\u4f9b\u7684\u7ba1\u7406\u529f\u80fd\u5f88\u96be\u6ee1\u8db3\u6e38\u620f\u670d\u65e5\u5e38\u8fd0\u7ef4\u9700\u6c42\uff0cDeployment \u65e0\u6cd5\u56fa\u5b9aID\u4e0d\u9002\u914d\u6709\u72b6\u6001\u7684\u7279\u6027\u3001\u800cStatefulSet\u53c8\u7f3a\u4e4f\u5b9a\u5411\u7ba1\u7406\u7684\u7075\u6d3b\u6027\uff0c\u4e3a\u6b64\u6211\u4eec\u81ea\u7814\u4e86Paas\u5e73\u53f0\uff0c\u63d0\u4f9b\u5bf9\u6e38\u620f\u670d\u7684\u7f16\u6392\u7ba1\u7406\u7684\u80fd\u529b\uff0c\u4ee5\u5b9e\u73b0\u9ad8\u6548\u5f00\u670d/\u66f4\u65b0\u7b49\u6e38\u620f\u670d\u8fd0\u7ef4\u64cd\u4f5c\u3002"}),"\n"]}),"\n",(0,i.jsx)("p",{align:"right",children:"  \u6765\u81ea \u51af\u8c0b\u6770 \u963f\u91cc\u7075\u7280\u4e92\u5a31\u5bb9\u5668\u4e91\u8d1f\u8d23\u4eba"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\u4f5c\u4e3a\u4e00\u4e2a\u5927\u578b\u7684\u6e38\u620f\u5206\u53d1\u5e73\u53f0\uff0cB\u7ad9\u6709\u7740\u6d77\u91cf\u4e14\u5f02\u6784\u67b6\u6784\u7684\u5185\u5916\u90e8\u6e38\u620f\u9879\u76ee\u9700\u8981\u7ba1\u7406\u7ef4\u62a4\uff0c\u5728\u5f53\u524d\u964d\u672c\u589e\u6548\u7684\u5927\u73af\u5883\u4e0b\uff0c\u6e38\u620f\u9879\u76ee\u4ece\u4f20\u7edf\u865a\u62df\u673a\u8fc1\u79fb\u81f3k8s\u52bf\u5728\u5fc5\u884c\u3002\u4f46\u662f\u539f\u751f\u7684k8s\u9762\u5bf9\u6e38\u620f\u70ed\u66f4\u3001\u591a\u73af\u5883\u7ba1\u7406\u3001\u6eda\u670d\u6e38\u620f\u7684\u533a\u670d\u62bd\u8c61\u3001\u4e1a\u52a1\u63a5\u6d41\u7b49\u573a\u666f\u662f\u6bd4\u8f83\u75b2\u8f6f\u7684\u3002\u9700\u8981\u4e00\u4e2a\u6210\u672c\u4f4e\u5ec9\u3001\u9ad8\u6548\u7684\u8de8\u4e91\u89e3\u51b3\u65b9\u6848\u4e3a\u4e0a\u8ff0\u95ee\u9898\u63d0\u4f9b\u652f\u6301\uff0c\u57fa\u4e8eOpenKruise\u884d\u751f\u7684OpenKruiseGame\u6240\u63d0\u4f9b\u7684\u56fa\u5b9aid\u3001\u539f\u5730\u5347\u7ea7\u7b49\u529f\u80fd\u5bf9\u6e38\u620f\u573a\u666f\u6709\u7740\u5f88\u5927\u7684\u5438\u5f15\u529b\uff0c\u7ed9\u6e38\u620f\u7684\u5bb9\u5668\u5316\u589e\u52a0\u4e86\u4e00\u79cd\u9009\u62e9\u3002"}),"\n"]}),"\n",(0,i.jsx)("p",{align:"right",children:"\t\u6765\u81ea \u674e\u5b81 bilibili\u6e38\u620f\u8fd0\u7ef4\u8d1f\u8d23\u4eba"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\u5728\u5c1d\u8bd5\u5bf9\u6e38\u620f\u670d\u8fdb\u884c\u4e91\u539f\u751f\u5316\u6539\u9020\u7684\u8fc7\u7a0b\u4e2d\uff0c\u7f51\u7edc\u662f\u9996\u8981\u8003\u8651\u7684\u95ee\u9898\u3002\u7531\u4e8e\u6e38\u620f\u670d\u4ece\u865a\u62df\u673a\u8fc1\u79fb\u81f3\u5bb9\u5668\uff0c\u57fa\u4e8e\u673a\u5668IP\u7684\u8fd0\u7ef4\u65b9\u5f0f\u5728k8s\u4e2d\u96be\u4ee5\u4fdd\u969c\uff0c\u884d\u751f\u51fa\u56fa\u5b9aIP\u7684\u9700\u6c42\uff1b\u5bf9\u5916\u670d\u52a1\u7684\u65b9\u5f0f\u4e5f\u4e0d\u50cf\u76f4\u63a5\u5728\u865a\u62df\u673a\u66b4\u9732\u7aef\u53e3\u90a3\u4e48\u7b80\u5355\uff0c\u589e\u52a0\u4e86\u8bb8\u591a\u590d\u6742\u6027\u3002\u9664\u4e86\u7f51\u7edc\u95ee\u9898\u4e4b\u5916\uff0c\u4e00\u4e2a\u6e38\u620f\u670d\u7684\u5404\u4e2a\u8fdb\u7a0b\u5728pod\u4e2d\u7684\u72b6\u6001\u96be\u4ee5\u611f\u77e5\uff0c\u539f\u751fk8s\u91cd\u5efa\u7684\u7b56\u7565\u592a\u8fc7\u201c\u7c97\u66b4\u201d\uff0c\u4e0d\u5229\u4e8e\u6e38\u620f\u7a33\u5b9a\u8fd0\u884c\uff0c\u4e9f\u9700\u4e00\u79cd\u9488\u5bf9\u6027\u7684\u611f\u77e5\u7b56\u7565\uff0c\u9488\u5bf9\u4e0d\u540c\u7684\u63a2\u6d4b\u7ed3\u679c\u6267\u884c\u4e0d\u540c\u7684\u52a8\u4f5c\u3002"}),"\n"]}),"\n",(0,i.jsx)("p",{align:"right",children:"\t\u6765\u81ea \u76db\u6d69 \u51a0\u8d62\u4e92\u5a31\u6e38\u620f\u4e91\u5e73\u53f0\u8d1f\u8d23\u4eba"}),"\n",(0,i.jsx)(n.h2,{id:"\u4e3a\u4ec0\u4e48openkruisegameokg\u662f\u4e00\u4e2a\u5de5\u4f5c\u8d1f\u8f7d",children:"\u4e3a\u4ec0\u4e48OpenKruiseGame\uff08OKG\uff09\u662f\u4e00\u4e2a\u5de5\u4f5c\u8d1f\u8f7d"}),"\n",(0,i.jsx)("img",{src:r(25743).A,width:"90%"}),"\n",(0,i.jsx)(n.p,{children:"\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u6838\u5fc3\u8981\u89e3\u51b3\u4e24\u4e2a\u95ee\u9898\uff0c\u6e38\u620f\u670d\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\u4e0e\u6e38\u620f\u670d\u7684\u8fd0\u7ef4\u7ba1\u7406\u3002Kubernetes\u5185\u7f6e\u4e86\u4e00\u4e9b\u901a\u7528\u7684\u5de5\u4f5c\u8d1f\u8f7d\u6a21\u578b\uff0c\u4f8b\u5982\uff1a\u65e0\u72b6\u6001\uff08Deployment\uff09\u3001\u6709\u72b6\u6001\uff08StatefulSet\uff09\u3001\u4efb\u52a1\uff08Job\uff09\u7b49\u3002\u4f46\u662f\uff0c\u6e38\u620f\u670d\u7684\u72b6\u6001\u7ba1\u7406\u4e0d\u8bba\u4ece\u7c92\u5ea6\u8fd8\u662f\u786e\u5b9a\u6027\u4e0a\u9762\u90fd\u6709\u66f4\u9ad8\u7684\u8981\u6c42\u3002\u4f8b\u5982\uff1a\u6e38\u620f\u670d\u9700\u8981\u70ed\u66f4\u65b0\u7684\u673a\u5236\u6765\u786e\u4fdd\u66f4\u77ed\u7684\u6e38\u620f\u4e2d\u65ad\uff1b\u6e38\u620f\u670d\u9700\u8981\u539f\u5730\u66f4\u65b0\u786e\u4fdd\u5143\u6570\u636e\u4fe1\u606f\uff08\u7f51\u7edc\u4e3a\u4e3b\uff09\u4e0d\u53d8\uff1b\u6e38\u620f\u670d\u9700\u8981\u786e\u4fdd\u5728\u81ea\u52a8\u4f38\u7f29\u8fc7\u7a0b\u4e2d\u53ea\u67090\u73a9\u5bb6\u7684\u6e38\u620f\u670d\u53ef\u4ee5\u4e0b\u7ebf\uff1b\u9700\u8981\u5177\u5907\u624b\u52a8\u8fd0\u7ef4/\u8bca\u65ad/\u9694\u79bb\u4efb\u610f\u4e00\u4e2a\u6e38\u620f\u670d\u7684\u80fd\u529b\u7b49\u3002\u8fd9\u4e9b\u90fd\u662fKubernetes\u5185\u7f6e\u8d1f\u8f7d\u4e0d\u80fd\u591f\u89e3\u51b3\u7684\u95ee\u9898\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u6b64\u5916\uff0cKubernetes\u4e2d\u7684\u5de5\u4f5c\u8d1f\u8f7d\u8fd8\u627f\u62c5\u4e86\u4e0e\u57fa\u7840\u8bbe\u65bd\u65e0\u7f1d\u6574\u5408\u7684\u91cd\u8981\u67a2\u7ebd\u89d2\u8272\u3002\u4f8b\u5982\uff1a\u901a\u8fc7Annotations\u4e2d\u7684\u5b57\u6bb5\uff0c\u81ea\u52a8\u5b9e\u73b0\u76d1\u63a7\u7cfb\u7edf\u3001\u65e5\u5fd7\u7cfb\u7edf\u4e0e\u5e94\u7528\u7684\u5bf9\u63a5\uff1b\u901a\u8fc7nodeSelector\u5b57\u6bb5\uff0c\u5b9e\u73b0\u5e94\u7528\u4e0e\u5e95\u5c42\u8d44\u6e90\u7684\u8c03\u5ea6\u7ed1\u5b9a\u5173\u7cfb\uff1b\u901a\u8fc7labels\u4e2d\u7684\u5b57\u6bb5\uff0c\u8bb0\u5f55\u5206\u7ec4\u7b49\u5143\u6570\u636e\u4fe1\u606f\uff0c\u66ff\u4ee3\u4f20\u7edf\u7684CMDB\u7cfb\u7edf\u3002\u8fd9\u4e9b\u90fd\u8ba9\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d\u6210\u4e3a\u4e86Kubernetes\u4e2d\u9002\u914d\u4e0d\u540c\u7c7b\u578b\u5e94\u7528\u7684\u6700\u4f73\u65b9\u5f0f\uff0cOpenKruiseGame\uff08OKG\uff09\u662f\u4e00\u4e2a\u5b8c\u5168\u9762\u5411\u6e38\u620f\u573a\u666f\u7684Kubernetes\u5de5\u4f5c\u8d1f\u8f7d\uff0c\u901a\u8fc7OpenKruiseGame\uff08OKG\uff09\uff0c\u5f00\u53d1\u8005\u4e0d\u6b62\u53ef\u4ee5\u83b7\u5f97\u66f4\u597d\u7684\u6e38\u620f\u670d\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\u548c\u6e38\u620f\u670d\u7684\u8fd0\u7ef4\u7ba1\u7406\uff0c\u8fd8\u53ef\u4ee5\u4ee5OpenKruiseGame\uff08OKG\uff09\u4e3a\u7ebd\u5e26\uff0c\u65e0\u9700\u5f00\u53d1\u989d\u5916\u7684\u4ee3\u7801\uff0c\u5145\u5206\u53d1\u6325\u4e91\u4ea7\u54c1\u5e26\u6765\u7684\u5f3a\u5927\u80fd\u529b\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"openkruisegameokg\u7684\u8bbe\u8ba1\u7406\u5ff5",children:"OpenKruiseGame\uff08OKG\uff09\u7684\u8bbe\u8ba1\u7406\u5ff5"}),"\n",(0,i.jsx)(n.p,{children:"OpenKruiseGame\uff08OKG\uff09\u53ea\u5305\u542b\u4e24\u4e2aCRD\u5bf9\u8c61\uff1aGameServerSet\u4e0eGameServer\u3002OpenKruiseGame\uff08OKG\uff09\u7684\u8bbe\u8ba1\u7406\u5ff5\u662f\u57fa\u4e8e\u72b6\u6001\u63a7\u5236\u7684\uff0c\u5c06\u4e0d\u540c\u7684\u804c\u8d23\u5212\u5206\u5728\u4e0d\u540c\u7684\u5de5\u4f5c\u8d1f\u8f7d\u7ef4\u5ea6\u6765\u63a7\u5236\u3002"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["GameServerSet\uff08\u751f\u547d\u5468\u671f\u7ba1\u7406\uff09",(0,i.jsx)(n.br,{}),"\n","\u5bf9\u4e00\u7ec4GameServer\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\u7684\u62bd\u8c61\uff0c\u4e3b\u8981\u7528\u4e8e\u526f\u672c\u6570\u76ee\u7ba1\u7406\u3001\u6e38\u620f\u670d\u53d1\u5e03\u7b49\u751f\u547d\u5468\u671f\u63a7\u5236\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["GameServer\uff08\u5b9a\u5411\u7ba1\u7406\u8fd0\u7ef4\u52a8\u4f5c\uff09",(0,i.jsx)(n.br,{}),"\n","\u5bf9\u4e00\u4e2aGameServer\u7684\u8fd0\u7ef4/\u7ba1\u7406\u52a8\u4f5c\u7684\u62bd\u8c61\uff0c\u4e3b\u8981\u7528\u4e8e\u66f4\u65b0\u987a\u5e8f\u63a7\u5236\u3001\u6e38\u620f\u670d\u72b6\u6001\u63a7\u5236\u3001\u6e38\u620f\u670d\u7f51\u7edc\u53d8\u66f4\u7b49\u5b9a\u5411\u8fd0\u7ef4\u7ba1\u7406\u52a8\u4f5c\u3002"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u5f53\u6211\u4eec\u7406\u89e3\u4e86OpenKruiseGame\uff08OKG\uff09\u7684\u8bbe\u8ba1\u7406\u5ff5\u540e\uff0c\u4e00\u4e9b\u975e\u5e38\u6709\u8da3\u7684\u63a8\u8bba\u5c31\u53ef\u4ee5\u5feb\u901f\u7684\u5f97\u51fa\uff0c\u4f8b\u5982\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5f53\u4e0d\u5c0f\u5fc3\u5220\u9664GameServer\u7684\u65f6\u5019\u4f1a\u89e6\u53d1\u6e38\u620f\u670d\u7684\u5220\u9664\u5417\uff1f"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u4e0d\u4f1a\uff0cGameServer\u53ea\u662f\u6e38\u620f\u670d\u7684\u5dee\u5f02\u6027\u8fd0\u7ef4\u52a8\u4f5c\u7684\u72b6\u6001\u8bb0\u5f55\uff0c\u5982\u679c\u5220\u9664GameServer\u4e4b\u540e\uff0c\u4f1a\u91cd\u65b0\u521b\u5efa\u4e00\u4e2a\u4f7f\u7528\u9ed8\u8ba4\u914d\u7f6e\u7684GameServer\u5bf9\u8c61\u3002\u6b64\u65f6\uff0c\u4f60\u7684GameServer\u4e5f\u4f1a\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u5b9a\u4e49\u5728GameServerSet\u4e2d\u7684\u6e38\u620f\u670d\u6a21\u677f\u914d\u7f6e\u3002"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"\u5982\u4f55\u8ba9\u5339\u914d\u670d\u52a1\u4e0e\u81ea\u52a8\u4f38\u7f29\u66f4\u597d\u7684\u914d\u5408\u9632\u6b62\u51fa\u73b0\u73a9\u5bb6\u88ab\u5f3a\u5236\u4e0b\u7ebf\uff1f"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u53ef\u4ee5\u901a\u8fc7\u670d\u52a1\u8d28\u91cf\u80fd\u529b\uff0c\u5c06\u6e38\u620f\u7684\u73a9\u5bb6\u4efb\u52a1\u8f6c\u6362\u4e3aGameServer\u7684\u72b6\u6001\uff0c\u5339\u914d\u6846\u67b6\u611f\u77e5GameServer\u7684\u72b6\u6001\u5e76\u63a7\u5236\u4f38\u7f29\u7684\u526f\u672c\u6570\u76ee\uff0cGameServerSet\u4e5f\u4f1a\u6839\u636eGameServer\u7684\u72b6\u6001\u6765\u5224\u65ad\u5220\u9664\u7684\u987a\u5e8f\uff0c\u4ece\u800c\u5b9e\u73b0\u4f18\u96c5\u4e0b\u7ebf\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"openkruisegameokg\u7684\u90e8\u7f72\u67b6\u6784",children:"OpenKruiseGame\uff08OKG\uff09\u7684\u90e8\u7f72\u67b6\u6784"}),"\n",(0,i.jsx)("img",{src:r(35376).A,width:"90%"}),"\n",(0,i.jsx)(n.p,{children:"OpenKruiseGame\uff08OKG\uff09\u7684\u90e8\u7f72\u6a21\u578b\u5206\u4e3a\u4e09\u4e2a\u90e8\u5206\uff1a"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["OpenKruiseGame\uff08OKG\uff09\u63a7\u5236\u5668",(0,i.jsx)(n.br,{}),"\n","\u8d1f\u8d23\u7ba1\u7406GameServerSet\u4e0eGameServer\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\uff0c\u5728OpenKruiseGame\u63a7\u5236\u5668\u4e2d\uff0c\u5185\u7f6e\u4e00\u4e2aCloud Provider\u6a21\u5757\uff0c\u7528\u6765\u9002\u914d\u4e0d\u540c\u4e91\u670d\u52a1\u5382\u5546\u5728\u7f51\u7edc\u63d2\u4ef6\u7b49\u573a\u666f\u4e0b\u7684\u5dee\u5f02\uff0c\u8ba9OpenKruiseGame\u53ef\u4ee5\u771f\u6b63\u505a\u5230\u4e00\u5957\u4ee3\u7801\u65e0\u5dee\u5f02\u90e8\u7f72\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["OpenKruise\u63a7\u5236\u5668",(0,i.jsx)(n.br,{}),"\n","\u8d1f\u8d23\u7ba1\u7406Pod\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\uff0c\u662fOpenKruiseGame\uff08OKG\uff09\u7684\u4f9d\u8d56\u7ec4\u4ef6\uff0c\u5bf9OpenKruiseGame\uff08OKG\uff09\u4f7f\u7528\u8005/\u5f00\u53d1\u8005\u662f\u65e0\u611f\u7684\u3002"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["OpenKruiseGame\uff08OKG\uff09\u8fd0\u7ef4\u540e\u53f0",(0,i.jsx)(n.br,{}),"\n","\u9488\u5bf9\u5e0c\u671b\u767d\u5c4f\u5316\u4f7f\u7528OpenKruiseGame\uff08OKG\uff09\u7684\u5f00\u53d1\u8005\u63d0\u4f9b\u7684\u8fd0\u7ef4\u540e\u53f0\u4e0eAPI\uff0c\u4e3b\u8981\u63d0\u4f9b\u6e38\u620f\u670d\u7684\u751f\u547d\u5468\u671f\u7ba1\u7406\u548c\u7f16\u6392\u80fd\u529b\u3002"]}),"\n"]}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}}}]);
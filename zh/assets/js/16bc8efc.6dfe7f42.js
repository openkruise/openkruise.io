"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7531],{5323:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/argo-ce028439a3b56a2e4bee243da228f6a0.png"},6345:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/git1-dabecbd800586101ef40e61d25852a78.png"},28453:(e,s,n)=>{n.d(s,{R:()=>a,x:()=>l});var r=n(96540);const t={},i=r.createContext(t);function a(e){const s=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),r.createElement(i.Provider,{value:s},e.children)}},75378:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/git2-52c9070f418f443e5c54227ebf40b7e8.png"},80591:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>l,default:()=>o,frontMatter:()=>a,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"best-practices/gameserver-delivery-management","title":"\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u4e0e\u8fd0\u7ef4\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5","description":"\u5728\u4f20\u7edf\u7684\u8fd0\u7ef4\u6a21\u5f0f\u4e2d\uff0c\u6e38\u620f\u670d\u52a1\u5668\u7684\u90e8\u7f72\u4e0d\u53ef\u907f\u514d\u5730\u5bfc\u81f4\u4e1a\u52a1\u4e0e\u5e95\u5c42\u57fa\u7840\u8bbe\u65bd\u7684\u7d27\u5bc6\u8026\u5408\u3002\u8fd9\u79cd\u9762\u5411\u8fc7\u7a0b\u7684\u4ea4\u4ed8\u65b9\u5f0f\uff0c\u7531\u4e8e\u81ea\u52a8\u5316\u7a0b\u5ea6\u4e0d\u9ad8\u548c\u7f3a\u4e4f\u6709\u6548\u7684\u6279\u91cf\u7ba1\u7406\u80fd\u529b\uff0c\u5e38\u5e38\u5bfc\u81f4\u90e8\u7f72\u6548\u7387\u4f4e\u4e0b\u5e76\u4e14\u4e00\u65e6\u51fa\u73b0\u95ee\u9898\uff0c\u6392\u969c\u53d8\u5f97\u5f02\u5e38\u56f0\u96be\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/best-practices/gameserver-delivery-management.md","sourceDirName":"best-practices","slug":"/best-practices/gameserver-delivery-management","permalink":"/zh/kruisegame/best-practices/gameserver-delivery-management","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u6e38\u620f\u670d\u5171\u4eab\u5185\u5b58\u6700\u4f73\u5b9e\u8df5","permalink":"/zh/kruisegame/best-practices/shared-mem"},"next":{"title":"\u6e38\u620f\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u6700\u4f73\u5b9e\u8df5","permalink":"/zh/kruisegame/best-practices/workflow"}}');var t=n(74848),i=n(28453);const a={},l="\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u4e0e\u8fd0\u7ef4\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5",d={},c=[{value:"\u4f7f\u7528ArgoCD\u8fdb\u884c\u6e38\u620f\u670d\u4ea4\u4ed8",id:"\u4f7f\u7528argocd\u8fdb\u884c\u6e38\u620f\u670d\u4ea4\u4ed8",level:2},{value:"\u8fde\u63a5Git\u4ed3\u5e93",id:"\u8fde\u63a5git\u4ed3\u5e93",level:3},{value:"PvE\u7c7b\u578b\u6e38\u620f\u53d1",id:"pve\u7c7b\u578b\u6e38\u620f\u53d1",level:3},{value:"PvP\u7c7b\u578b\u6e38\u620f\u53d1\u5e03",id:"pvp\u7c7b\u578b\u6e38\u620f\u53d1\u5e03",level:3},{value:"\u7ecf\u9a8c\u603b\u7ed3",id:"\u7ecf\u9a8c\u603b\u7ed3",level:3},{value:"\u6e38\u620f\u670d\u8fd0\u7ef4\u7ba1\u7406",id:"\u6e38\u620f\u670d\u8fd0\u7ef4\u7ba1\u7406",level:2},{value:"OKG Dashboard \u767d\u5c4f\u5316\u4e3b\u52a8\u8fd0\u7ef4",id:"okg-dashboard-\u767d\u5c4f\u5316\u4e3b\u52a8\u8fd0\u7ef4",level:3},{value:"\u5efa\u8bbe\u76d1\u63a7\u544a\u8b66\u673a\u5236\uff0c\u52a0\u5f3a\u6e38\u620f\u670d\u7a33\u5b9a\u6027",id:"\u5efa\u8bbe\u76d1\u63a7\u544a\u8b66\u673a\u5236\u52a0\u5f3a\u6e38\u620f\u670d\u7a33\u5b9a\u6027",level:3}];function h(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u4e0e\u8fd0\u7ef4\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5",children:"\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u4e0e\u8fd0\u7ef4\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5"})}),"\n",(0,t.jsx)(s.p,{children:"\u5728\u4f20\u7edf\u7684\u8fd0\u7ef4\u6a21\u5f0f\u4e2d\uff0c\u6e38\u620f\u670d\u52a1\u5668\u7684\u90e8\u7f72\u4e0d\u53ef\u907f\u514d\u5730\u5bfc\u81f4\u4e1a\u52a1\u4e0e\u5e95\u5c42\u57fa\u7840\u8bbe\u65bd\u7684\u7d27\u5bc6\u8026\u5408\u3002\u8fd9\u79cd\u9762\u5411\u8fc7\u7a0b\u7684\u4ea4\u4ed8\u65b9\u5f0f\uff0c\u7531\u4e8e\u81ea\u52a8\u5316\u7a0b\u5ea6\u4e0d\u9ad8\u548c\u7f3a\u4e4f\u6709\u6548\u7684\u6279\u91cf\u7ba1\u7406\u80fd\u529b\uff0c\u5e38\u5e38\u5bfc\u81f4\u90e8\u7f72\u6548\u7387\u4f4e\u4e0b\u5e76\u4e14\u4e00\u65e6\u51fa\u73b0\u95ee\u9898\uff0c\u6392\u969c\u53d8\u5f97\u5f02\u5e38\u56f0\u96be\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u76f8\u8f83\u4e4b\u4e0b\uff0c\u4e91\u539f\u751f\u6280\u672f\u4ee5\u5176\u58f0\u660e\u5f0f\u548c\u4e00\u81f4\u6027\u4ea4\u4ed8\u7684\u7279\u6027\uff0c\u4e3a\u6e38\u620f\u670d\u52a1\u5668\u7684\u90e8\u7f72\u4e0e\u8fd0\u7ef4\u63d0\u4f9b\u4e86\u663e\u8457\u7684\u6548\u7387\u63d0\u5347\u3002\u7136\u800c\uff0c\u5728\u5b9e\u9645\u7684\u5e94\u7528\u8fc7\u7a0b\u4e2d\uff0c\u6211\u4eec\u89c2\u5bdf\u5230\uff0c\u7531\u4e8e\u6e38\u620f\u670d\u52a1\u5668\u5177\u6709\u72b6\u6001\u6027\u7684\u7279\u8d28\uff0c\u5176\u4ea4\u4ed8\u903b\u8f91\u4e0e\u4f20\u7edf\u7684\u65e0\u72b6\u6001\u670d\u52a1\u5b58\u5728\u663e\u8457\u7684\u5dee\u522b\u3002\u672c\u6587\u65e8\u5728\u9610\u660e\u8fd9\u4e9b\u5dee\u5f02\uff0c\u5e76\u63d0\u51fa\u6700\u4f73\u5b9e\u8df5\u65b9\u6848\uff0c\u65e8\u5728\u4e3a\u4e91\u539f\u751f\u73af\u5883\u4e0b\u6e38\u620f\u670d\u52a1\u5668\u7684\u654f\u6377\u90e8\u7f72\u548c\u8fd0\u7ef4\u7ba1\u7406\u5f00\u8f9f\u65b0\u7684\u601d\u8def\u3002"}),"\n",(0,t.jsx)(s.h2,{id:"\u4f7f\u7528argocd\u8fdb\u884c\u6e38\u620f\u670d\u4ea4\u4ed8",children:"\u4f7f\u7528ArgoCD\u8fdb\u884c\u6e38\u620f\u670d\u4ea4\u4ed8"}),"\n",(0,t.jsxs)(s.p,{children:["\u5728\u6267\u884c\u793a\u4f8b\u5177\u4f53\u7684\u53d1\u5e03\u64cd\u4f5c\u4e4b\u524d\uff0c\u6211\u4eec\u4e00\u8d77\u8ba4\u8bc6\u4e0b\u4e91\u539f\u751f\u7684\u4ea4\u4ed8\u601d\u60f3 \u2014\u2014 \u58f0\u660e\u5f0f\u800c\u975e\u9762\u5411\u8fc7\u7a0b\uff0c\u8fd9\u4e5f\u5c31\u610f\u5473\u7740\u4e91\u539f\u751f\u5f0f\u7684\u5e94\u7528\u4ea4\u4ed8\u5173\u6ce8\u7684\u5e76\u4e0d\u662f\u5e94\u7528\u7684\u90e8\u7f72\u8fc7\u7a0b\u800c\u662f\u5bf9\u5e94\u7528\u7684\u5b9a\u4e49\u3002\u800c\u5e94\u7528\u7684\u5b9a\u4e49\u5c31\u662fYaml\uff0c\u5b83\u901a\u8fc7\u914d\u7f6e\u53c2\u6570\u5316\u7684\u65b9\u5f0f\u63cf\u8ff0\u8fd9\u4e2a\u5e94\u7528\u8be5\u662f\u4ec0\u4e48\u6837\u5b50\u3002\u56e0\u6b64\uff0c\u4e00\u5207\u6709\u5173\u5e94\u7528\u7684\u53d8\u66f4\u548c\u53d1\u5e03\u5b9e\u9645\u4e0a\u90fd\u662f\u5bf9\u5e94\u7528\u63cf\u8ff0\uff08Yaml\uff09\u7684\u66f4\u6539\u3002\u81f3\u6b64\u6211\u4eec\u53d1\u73b0\uff0c\u6211\u4eec\u9700\u8981\u4e00\u4e2a\u4ed3\u5e93\u5c06Yaml\u843d\u76d8\uff0c\u8bb0\u5f55\u5f53\u524d\u5bf9\u5e94\u7528\u7684\u63cf\u8ff0\uff0c\u5e76\u4e14\u80fd\u591f\u8ffd\u6eaf\u548c\u5ba1\u8ba1\u8fc7\u53bbYaml\u7684\u53d8\u66f4\u3002\u8bf4\u5230\u8fd9\u91cc\u6211\u76f8\u4fe1\u5927\u5bb6\u4f1a\u53d1\u73b0git repo\u5929\u7136\u7b26\u5408\u8be5\u7279\u70b9\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u53ef\u4ee5\u901a\u8fc7\u63d0\u4ea4Commit\u548cMerge Request\u7684\u65b9\u5f0f\u5c06Yaml\u4e0a\u4f20\u5e76\u843d\u76d8\uff0c\u6743\u9650\u7ba1\u7406\u3001\u5ba1\u8ba1\u90fd\u9075\u5faagit\u89c4\u8303\u3002\u5728\u7406\u60f3\u72b6\u6001\u4e0b\uff0c\u6211\u4eec\u53ea\u9700\u8981\u7ef4\u62a4\u4e00\u5957\u5bf9\u6e38\u620f\u670d\u63cf\u8ff0\u7684Yaml\uff0c\u4e00\u952e\u89e6\u53d1\u5168\u7403\u591a\u5730\u57df\u7684\u6e38\u620f\u670d\u53d1\u5e03\uff0c\u65e0\u9700\u9762\u5411\u8fc7\u7a0b\u4e00\u4e00\u64cd\u4f5c\u96c6\u7fa4\uff0c\u53bb\u6267\u884c\u90e8\u7f72\u52a8\u4f5c\u3002\u8fd9\u5c31\u662fGitOps\u7684\u601d\u60f3\u3002\n\u5728GitOps\u843d\u5730\u8fc7\u7a0b\u4e2d\u6700\u5bcc\u6709\u6311\u6218\u7684\u4e8b\u60c5\u5b9e\u9645\u4e0a\u662f\u5bf9\u6e38\u620f\u670d\u5e94\u7528\u7684\u63cf\u8ff0\u62bd\u8c61\u3002GameServerSet\u662f\u4e00\u6279\u540c\u5c5e\u6027\u7684\u6e38\u620f\u670d\u96c6\u5408\uff0c\u5c5e\u4e8eKubernetes\u4e2d\u7684\u9762\u5411\u6e38\u620f\u670d\u7ba1\u7406\u7684\u5de5\u4f5c\u8d1f\u8f7d\uff0c\u56e0\u6b64\u6bcf\u4e2aGameServerSet\u662f\u65e0\u6cd5\u8de8Kubernetes\u96c6\u7fa4\u90e8\u7f72\u7684\u3002\u56e0\u6b64\u5728\u67d0\u4e9b\u60c5\u5883\uff0c\u6bd4\u5982\u591a\u96c6\u7fa4\u7684\u573a\u666f\u4e0b\uff0c\u6bcf\u4e00\u4e2a\u96c6\u7fa4\u9700\u8981\u81f3\u5c11\u4e00\u4e2aGameServerSet\uff0c\u4e14\u6bcf\u4e2aGameServerSet\u7684\u63cf\u8ff0\u6216\u591a\u6216\u5c11\u5b58\u5728\u7740\u4e00\u4e9b\u5dee\u5f02\uff0c\u4f3c\u4e4e\u96be\u4ee5\u901a\u8fc7\u4e00\u4e2aYaml\u5c06\u6240\u6709\u6e38\u620f\u670d\u90fd\u6982\u62ec\u3002\u4e3e\u4e2a\u4f8b\u5b50\uff0c\u8003\u8651\u5168\u7403\u5f00\u670d\u7684\u573a\u666f \u2014\u2014 \u8ba1\u5212\u5728\u4e0a\u6d77\u3001\u4e1c\u4eac\u3001\u6cd5\u5170\u514b\u798f\u4e09\u5730\u5f00\u670d\uff0c\u56e0\u6b64\u6211\u4eec\u9700\u8981\u8fd9\u4e09\u4e2a\u5730\u533a\u7684\u57fa\u7840\u8bbe\u65bd\u8d44\u6e90\u3002\u5728\u4e0a\u6d77\u6211\u5e0c\u671b\u53d1\u5e0310\u4e2a\u6e38\u620f\u533a\u670d\uff0c\u800c\u5728\u6cd5\u5170\u514b\u798f\u6211\u53ea\u5e0c\u671b\u53d1\u5e033\u4e2a\u533a\u670d\uff0c\u8fd9\u6837\u4e00\u6765\uff0c\u4e00\u4e2aYaml\u56e0\u4e3areplicas\u5b57\u6bb5\u7684\u5dee\u5f02\u5c31\u65e0\u6cd5\u63cf\u8ff0\u4e0d\u540c\u5730\u57df\u7684\u6e38\u620f\u670d\u3002\u96be\u9053\u6211\u4eec\u9700\u8981\u4e3a\u6bcf\u4e00\u4e2a\u5730\u57df\u7ef4\u62a4\u4e00\u4e2aYaml\u5417\uff1f\u8fd9\u6837\u4e5f\u975e\u5408\u7406\u7684\u505a\u6cd5\uff0c\u5f53\u8fdb\u884c\u975e\u5dee\u5f02\u6027\u5b57\u6bb5\u53d8\u66f4\u65f6\uff08\u4f8b\u5982\uff0c\u4e3a\u6240\u6709\u5730\u57df\u7684\u6e38\u620f\u670d\u6253\u4e0a\u4e00\u4e2a\u6807\u7b7e\uff09\uff0c\u6211\u4eec\u9700\u8981\u91cd\u590d\u5730\u6267\u884c\u591a\u4e2aYaml\u7684\u66f4\u6539\uff0c\u96c6\u7fa4\u6570\u91cf\u591a\u7684\u65f6\u5019\u5bb9\u6613\u9020\u6210\u9057\u6f0f\u6216\u8005\u9519\u8bef\uff0c\u8fd9\u5e76\u4e0d\u7b26\u5408\u4e91\u539f\u751f\u4ea4\u4ed8\u601d\u60f3\u3002\n\u5b9e\u9645\u4e0a\uff0c\u6211\u4eec\u53ef\u4ee5\u901a\u8fc7Helm Chart\u8fdb\u884c\u6e38\u620f\u670d\u5e94\u7528\u7684\u8fdb\u4e00\u6b65\u62bd\u8c61\uff0c\u5c06\u5dee\u5f02\u6027\u7684\u90e8\u5206\u4f5c\u4e3aValue\u63d0\u53d6\u51fa\u6765\u3002\u5728\u6211\u4eec\u672c\u6b21\u7684\u793a\u4f8b\u4e2d(",(0,t.jsx)(s.a,{href:"https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game",children:"https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game"}),"),\n\u6211\u4eec\u62bd\u8c61\u51fa\u8fd9\u6837\u51e0\u4e2a\u5dee\u5f02\u6027\u5b57\u6bb5\uff1a"]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"\u4e3b\u955c\u50cf \u2014\u2014 \u6bcf\u4e2a\u5730\u57df/\u96c6\u7fa4\u7684\u4e3b\u955c\u50cf\u53ef\u80fd\u5b58\u5728\u5dee\u5f02"}),"\n",(0,t.jsx)(s.li,{children:"sidecar\u955c\u50cf \u2014\u2014 \u6bcf\u4e2a\u5730\u57df/\u96c6\u7fa4\u7684sidecar\u955c\u50cf\u53ef\u80fd\u5b58\u5728\u5dee\u5f02"}),"\n",(0,t.jsx)(s.li,{children:"\u526f\u672c\u6570 \u2014\u2014 \u6bcf\u4e2a\u5730\u57df/\u96c6\u7fa4\u7684\u53d1\u5e03\u7684\u6e38\u620f\u670d\u6570\u91cf\u53ef\u80fd\u5b58\u5728\u5dee\u5f02"}),"\n",(0,t.jsx)(s.li,{children:"\u662f\u5426\u81ea\u52a8\u4f38\u7f29 \u2014\u2014 \u6bcf\u4e2a\u5730\u57df/\u96c6\u7fa4\u5bf9\u4e8e\u81ea\u52a8\u4f38\u7f29\u7684\u8981\u6c42\u53ef\u80fd\u5b58\u5728\u5dee\u5f02"}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["\u9664\u6b64\u4e4b\u5916\u7684\u5176\u4ed6\u5b57\u6bb5\u90fd\u4fdd\u6301\u4e00\u81f4\uff0c\u610f\u5473\u7740\u4e0d\u5b58\u5728\u5730\u57df\u5dee\u5f02\u6027\u5f71\u54cd\u3002\nArgoCD(",(0,t.jsx)(s.a,{href:"https://argo-cd.readthedocs.io/en/stable/",children:"https://argo-cd.readthedocs.io/en/stable/"}),"),\n\u5176\u5f88\u597d\u5730\u7ee7\u627f\u4e86GitOps\u7684\u601d\u60f3\uff0c\u672c\u6587\u5c06\u5229\u7528ArgoCD\u8fdb\u884c\u6e38\u620f\u670d\u4ea4\u4ed8\u7684\u5b9e\u64cd\u3002\u63a5\u4e0b\u6765\u6211\u4eec\u5c55\u5f00\u5177\u4f53\u7684\u64cd\u4f5c\uff1a"]}),"\n",(0,t.jsx)(s.h3,{id:"\u8fde\u63a5git\u4ed3\u5e93",children:"\u8fde\u63a5Git\u4ed3\u5e93"}),"\n",(0,t.jsx)(s.p,{children:"\u6211\u4eec\u9700\u8981\u5c06\u63cf\u8ff0\u4e86\u6e38\u620f\u670d\u5e94\u7528\u7684Git\u4ed3\u5e93\u8fde\u63a5\u8d77\u6765\u3002\u64cd\u4f5c\u6b65\u9aa4\u5982\u4e0b\uff1a"}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsx)(s.li,{children:"\u5728ArgoCD UI\u5de6\u4fa7\u5bfc\u822a\u680f\u9009\u62e9Settings\uff0c\u7136\u540e\u9009\u62e9Repositories > + Connect Repo"}),"\n",(0,t.jsx)(s.li,{children:"\u5728\u5f39\u51fa\u7684\u9762\u677f\u4e2d\u914d\u7f6e\u4ee5\u4e0b\u4fe1\u606f\uff0c\u7136\u540e\u5355\u51fbCONNECT\u6dfb\u52a0\u8fde\u63a5"}),"\n"]}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"\u533a\u57df"}),(0,t.jsx)(s.th,{children:"\u53c2\u6570"}),(0,t.jsx)(s.th,{children:"\u53c2\u6570\u503c"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"Choose your connection method"}),(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"VIA HTTPS"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"CONNECT REPO USING HTTPS"}),(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"git"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Project"}),(0,t.jsx)(s.td,{children:"default"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Repository URL"}),(0,t.jsx)(s.td,{children:(0,t.jsx)(s.a,{href:"https://github.com/AliyunContainerService/gitops-demo.git",children:"https://github.com/AliyunContainerService/gitops-demo.git"})})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Skip server verification"}),(0,t.jsx)(s.td,{children:"\u52fe\u9009"})]})]})]}),"\n",(0,t.jsx)("img",{src:n(6345).A,style:{width:"800px"}}),"\n",(0,t.jsx)("img",{src:n(75378).A,style:{width:"800px"}}),"\n",(0,t.jsx)(s.h3,{id:"pve\u7c7b\u578b\u6e38\u620f\u53d1",children:"PvE\u7c7b\u578b\u6e38\u620f\u53d1"}),"\n",(0,t.jsxs)(s.p,{children:["PvE \u7c7b\u578b\u6e38\u620f\u901a\u5e38\u5b58\u5728\u533a\u670d\u6982\u5ff5\uff0c\u5927\u591a\u60c5\u51b5\u4e0b\u7531\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u624b\u52a8\u63a7\u5236\u5404\u5730\u57df\u7684\u5f00\u670d\u6570\u91cf\u3002\u5173\u4e8e PvE \u6e38\u620f\u4e91\u539f\u751f\u5316\u6700\u4f73\u5b9e\u8df5\u53ef\u53c2\u8003 OKG PvE \u6e38\u620f\u6700\u4f73\u5b9e\u8df5\u6587\u6863\uff08",(0,t.jsx)(s.a,{href:"https://openkruise.io/zh/kruisegame/best-practices/pve-game",children:"https://openkruise.io/zh/kruisegame/best-practices/pve-game"}),")\n\u5728\u521d\u6b21\u5c1d\u8bd5ArgoCD\u65f6\uff0c\u6211\u4eec\u53ef\u4ee5\u4f7f\u7528\u767d\u5c4f\u63a7\u5236\u53f0\u4e3a\u6bcf\u4e2a\u5730\u57df\u7684\u96c6\u7fa4\u5206\u522b\u521b\u5efaApplication\uff1a"]}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsx)(s.li,{children:"\u5728ArgoCD UI\u5de6\u4fa7\u5bfc\u822a\u680f\u9009\u62e9Applications\uff0c\u7136\u540e\u5355\u51fb+ NEW APP"}),"\n",(0,t.jsx)(s.li,{children:"\u5728\u5f39\u51fa\u7684\u9762\u677f\u914d\u7f6e\u4ee5\u4e0b\u4fe1\u606f\uff0c\u7136\u540e\u5355\u51fbCREATE\u8fdb\u884c\u521b\u5efa\u3002\uff08\u4ee5opengame-demo-shanghai-dev\u4e3a\u4f8b\uff09"}),"\n"]}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"\u533a\u57df"}),(0,t.jsx)(s.th,{children:"\u53c2\u6570"}),(0,t.jsx)(s.th,{children:"\u53c2\u6570\u503c"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"GENERAL"}),(0,t.jsx)(s.td,{children:"Application Name"}),(0,t.jsx)(s.td,{children:"opengame-demo-shanghai-dev"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Project Name"}),(0,t.jsx)(s.td,{children:"default"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"SYNC POLICY"}),(0,t.jsx)(s.td,{children:"\u5728\u4e0b\u62c9\u5217\u8868\u4e2d\u9009\u62e9Automatic\u3002\u53c2\u6570\u53d6\u503c\u5982\u4e0b\uff1a"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"Manual\uff1a\u624b\u52a8\u540c\u6b65Git\u4ed3\u5e93\u53d8\u5316"}),(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"Automatic\uff1a\u81ea\u52a8\u540c\u6b65Git\u4ed3\u5e93\u53d8\u5316\uff0c\u95f4\u96943min"}),(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"SYNC OPTIONS"}),(0,t.jsx)(s.td,{children:"\u52fe\u9009AUTO-CREATE NAMESPACE"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"SOURCE"}),(0,t.jsx)(s.td,{children:"Repository URL"}),(0,t.jsxs)(s.td,{children:["\u5728\u4e0b\u62c9\u5217\u8868\u9009\u62e9\u5df2\u6709Git Repo\uff0c\u6b64\u5904\u9009\u62e9",(0,t.jsx)(s.a,{href:"https://github.com/AliyunContainerService/gitops-demo.git",children:"https://github.com/AliyunContainerService/gitops-demo.git"})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Revision"}),(0,t.jsx)(s.td,{children:"HEAD"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Path"}),(0,t.jsx)(s.td,{children:"manifests/helm/open-game"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"DESTINATION"}),(0,t.jsx)(s.td,{children:"Cluster URL/Cluster Name"}),(0,t.jsx)(s.td,{children:"\u5728\u4e0b\u62c9\u5217\u8868\u4e2d\u9009\u62e9\u76ee\u6807\u96c6\u7fa4"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"Namespace"}),(0,t.jsx)(s.td,{children:"opengame"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"HELM"}),(0,t.jsx)(s.td,{children:"VALUES FILES"}),(0,t.jsx)(s.td,{children:"values.yaml"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"PARAMETERS"}),(0,t.jsx)(s.td,{children:"replicas"}),(0,t.jsx)(s.td,{children:"3 #\u53d1\u5e03\u4e09\u4e2a\u6e38\u620f\u670d"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{}),(0,t.jsx)(s.td,{children:"scaled.enabled"}),(0,t.jsx)(s.td,{children:"false # \u4e0d\u5f00\u542f\u81ea\u52a8\u5f39\u6027\u4f38\u7f29"})]})]})]}),"\n",(0,t.jsxs)(s.ol,{start:"3",children:["\n",(0,t.jsx)(s.li,{children:"\u521b\u5efa\u5b8c\u6210\u540e\uff0c\u5728Application\u9875\u9762\uff0c\u5373\u53ef\u770b\u5230opengame-demo-shanghai-dev\u7684\u5e94\u7528\u72b6\u6001\u3002\u5982\u679cSYNC POLICY\u9009\u62e9\u7684\u662fManual\u65b9\u5f0f\uff0c\u9700\u8981\u624b\u52a8\u70b9\u51fbSYNC\uff0c\u5c06\u5e94\u7528\u540c\u6b65\u90e8\u7f72\u81f3\u76ee\u6807\u96c6\u7fa4\u3002\u5e94\u7528\u7684Status\u4e3aHealthy\u548cSynced\uff0c\u8868\u793a\u5df2\u7ecf\u6210\u529f\u540c\u6b65\u3002"}),"\n"]}),"\n",(0,t.jsx)("img",{src:n(5323).A,style:{width:"850px"}}),"\n",(0,t.jsxs)(s.ol,{start:"4",children:["\n",(0,t.jsx)(s.li,{children:"\u5355\u51fbopengame-demo-shanghai-dev\u5e94\u7528\u540d\u79f0\uff0c\u5373\u53ef\u67e5\u770b\u5e94\u7528\u8be6\u60c5\uff0c\u5c55\u793a\u5e94\u7528\u76f8\u5173\u7684Kubernetes\u8d44\u6e90\u7684\u62d3\u6251\u7ed3\u6784\u53ca\u76f8\u5e94\u72b6\u6001\u3002"}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"\u5bf9ArgoCD\u6709\u6240\u719f\u6089\u4e86\u4e4b\u540e\uff0c\u6211\u4eec\u4e5f\u53ef\u4ee5\u901a\u8fc7ApplicationSet\u5bf9\u8c61\u6765\u4e00\u952e\u53d1\u5e03\u6e38\u620f\u670d\u3002\u5404\u4e2a\u96c6\u7fa4\u7684\u5dee\u5f02\u6027\u901a\u8fc7elements\u62bd\u8c61\u51fa\u6765\uff0c\u4f8b\u5982\u4e0b\u9762Yaml\u4e2d\uff0c\u4ee5\u96c6\u7fa4\u7ef4\u5ea6\u62bd\u8c61\u51fa\u4e09\u4e2a\u5b57\u6bb5\uff1acluster\u96c6\u7fa4\u540d\u79f0\u7528\u4e8e\u533a\u5206Application\u540d\u79f0\uff1burl\u7528\u4e8e\u533a\u5206\u76ee\u6807\u96c6\u7fa4\u5730\u5740\uff1breplicas\u7528\u4e8e\u533a\u522b\u4e0d\u540c\u96c6\u7fa4\u53d1\u5e03\u7684\u6e38\u620f\u670d\u6570\u91cf\u3002\n\u7f16\u5199\u5b8c\u6210\u8be5ApplicationSet Yaml \u540e\uff0c\u5c06\u5176\u90e8\u7f72\u5230ACK One\u8230\u961f\u96c6\u7fa4\u5373\u53ef\u81ea\u52a8\u521b\u5efa\u51fa\u56db\u4e2aApplication\u3002"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl apply -f pve.yaml -n argocd\n\n# pve.yaml \u5185\u5bb9\u5982\u4e0b\uff1a\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: minecraft\nspec:\n  generators:\n  - list:\n      elements:\n      - cluster: shanghai-dev\n        url: <https://47.100.237.xxx:6443>\n        replicas: '1'\n      - cluster: shanghai-prod\n        url: <https://47.101.214.xxx:6443>\n        replicas: '3'\n      - cluster: frankfurt-prod\n        url: <https://8.209.103.xxx:6443>\n        replicas: '2'\n      - cluster: japan-prod\n        url: <https://10.0.0.xxx:6443>\n        replicas: '2'\n  template:\n    metadata:\n      name: '{{cluster}}-minecraft'\n    spec:\n      project: default\n      source:\n        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'\n        targetRevision: HEAD\n        path: manifests/helm/open-game\n        helm:\n          valueFiles:\n          - values.yaml\n          parameters: #\u5bf9\u5e94helm chart\u4e2d\u63d0\u53d6\u7684value\u53c2\u6570\n          - name: replicas\n            value: '{{replicas}}'\n          - name: scaled.enabled \n            value: 'false'\n      destination:\n        server: '{{url}}'\n        namespace: game-server #\u90e8\u7f72\u5230\u5bf9\u5e94\u96c6\u7fa4\u7684game-server\u547d\u540d\u7a7a\u95f4\u4e0b\n      syncPolicy:\n        syncOptions:\n          - CreateNamespace=true #\u82e5\u96c6\u7fa4\u4e2d\u547d\u540d\u7a7a\u95f4\u4e0d\u5b58\u5728\u5219\u81ea\u52a8\u521b\u5efa\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u5728\u8be5Yaml\u4e2d\uff0c\u6240\u6709\u7684\u955c\u50cf\u7248\u672c\u90fd\u4e00\u81f4\uff0c\u82e5\u5e0c\u671b\u5404\u96c6\u7fa4\u955c\u50cf\u7248\u672c\u51fa\u73b0\u5dee\u5f02\uff0c\u53ef\u4ee5\u4eff\u7167replicas\u7684\u65b9\u5f0f\uff0c\u6dfb\u52a0\u65b0\u7684parameters\u53c2\u6570\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"pvp\u7c7b\u578b\u6e38\u620f\u53d1\u5e03",children:"PvP\u7c7b\u578b\u6e38\u620f\u53d1\u5e03"}),"\n",(0,t.jsxs)(s.p,{children:["\u5bf9\u4e8e PvP \u7c7b\u578b\u7684\u6e38\u620f\uff0c\u623f\u95f4\u670d\u7684\u6570\u91cf\u7531\u81ea\u8eab\u4f38\u7f29\u5668\u8c03\u914d\uff0c\u800c\u975e\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u624b\u52a8\u6307\u5b9a\u3002\u6709\u5173 PvP \u7c7b\u578b\u6e38\u620f\u7684\u4e91\u539f\u751f\u5316\u6700\u4f73\u5b9e\u8df5\u53ef\u53c2\u8003 OKG PvP \u6e38\u620f\u6700\u4f73\u5b9e\u8df5\u6587\u6863\uff08",(0,t.jsx)(s.a,{href:"https://openkruise.io/zh/kruisegame/best-practices/session-based-game",children:"https://openkruise.io/zh/kruisegame/best-practices/session-based-game"}),")"]}),"\n",(0,t.jsx)(s.p,{children:"\u5728 OKG \u4e2d\u6211\u4eec\u901a\u8fc7\u4e3a GameServerSet \u914d\u7f6e ScaledObject \u5bf9\u8c61\u6765\u5b9e\u73b0\u623f\u95f4\u670d\u7684\u5f39\u6027\u4f38\u7f29\u3002\u56e0\u6b64\uff0cHelm Chart Value\u4e2d\u7684scaled.enabled \u5728\u6b64\u573a\u666f\u4e0b\u9700\u8981\u5f00\u542f\u3002\u6b64\u5916\uff0c\u623f\u95f4\u670d\u7684\u526f\u672c\u6570\u6709 ArgoCD \u548c OKG 2 \u4e2a\u63a7\u5236\u8005\u800c\u51b2\u7a81\uff0c\u53ef\u4ee5\u901a\u8fc7\u8ba9 ArgoCD \u5ffd\u7565 GameServerSet \u8d44\u6e90\u7684\u526f\u672c\u6570\u53d8\u5316\u6765\u89e3\u51b3\uff0c\u5177\u4f53\u5728 spec.ignoreDifferences \u8bbe\u7f6e\u76f8\u5e94\u5b57\u6bb5\u5373\u53ef\u3002\u8003\u8651\u4ee5\u4e0a\u60c5\u51b5\uff0c\u8be5 pvp.yaml \u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl apply -f pvp.yaml -n argocd\n\n# pvp.yaml \u5185\u5bb9\u5982\u4e0b\uff1a\n\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: pvp\nspec:\n  generators:\n  - list:\n      elements:\n      - cluster: shanghai-dev\n        url: <https://47.100.237.xxx:6443>\n      - cluster: shanghai-prod\n        url: <https://47.101.214.xxx:6443>\n      - cluster: frankfurt-prod\n        url: <https://8.209.103.xxx:6443>\n      - cluster: japan-prod\n        url: <https://10.0.0.xxx:6443>\n  template:\n    metadata:\n      name: '{{cluster}}-pvp'\n    spec:\n      project: defaultminecraft\n      ignoreDifferences: # \u8bbe\u7f6e GameServerSet minecraft\u526f\u672c\u6570\u76ee\u7531\u96c6\u7fa4\u81ea\u63a7\u5236\n      - group: game.kruise.io\n        kind: GameServerSet\n        name: minecraft\n        namespace: game\n        jsonPointers:\n        - /spec/replicas\n      source:\n        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'\n        targetRevision: HEAD\n        path: manifests/helm/open-game\n        helm:\n          valueFiles:\n          - values.yaml\n      destination:\n        server: '{{url}}'\n        namespace: pvp-server\n      syncPolicy:\n        syncOptions:\n          - CreateNamespace=true\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u5728\u8be5Yaml\u4e2d\uff0c\u6240\u6709\u7684\u955c\u50cf\u7248\u672c\u90fd\u4e00\u81f4\uff0c\u82e5\u5e0c\u671b\u5404\u96c6\u7fa4\u955c\u50cf\u7248\u672c\u51fa\u73b0\u5dee\u5f02\uff0c\u53ef\u4ee5\u4eff\u7167replicas\u7684\u65b9\u5f0f\uff0c\u6dfb\u52a0\u65b0\u7684parameters\u53c2\u6570\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u7ecf\u9a8c\u603b\u7ed3",children:"\u7ecf\u9a8c\u603b\u7ed3"}),"\n",(0,t.jsx)(s.p,{children:"\u901a\u8fc7\u4e0a\u9762\u7684\u793a\u4f8b\uff0c\u6211\u4eec\u4f1a\u53d1\u73b0\u505a\u597d\u5e94\u7528\u7684\u62bd\u8c61\u662f\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u7684\u5173\u952e\u4e4b\u5904\u3002\u6211\u4eec\u9700\u8981\u5c3d\u91cf\u4fdd\u6301GameServerSet\u5927\u591a\u5b57\u6bb5\u4e00\u81f4\uff0c\u5c06\u6709\u5dee\u5f02\u6027\u7684\u5b57\u6bb5\u63d0\u53d6\u51fa\u6765\uff0c\u8fd9\u6837\u53ea\u9700\u8981\u9488\u5bf9\u4e0d\u540c\u73af\u5883\u66f4\u6539\u7ef4\u62a4\u7279\u5b9a\u7684\u76f8\u5e94\u5b57\u6bb5\u5373\u53ef\uff0c\u771f\u6b63\u505a\u5230\u654f\u6377\u4ea4\u4ed8\u3002"}),"\n",(0,t.jsx)(s.h2,{id:"\u6e38\u620f\u670d\u8fd0\u7ef4\u7ba1\u7406",children:"\u6e38\u620f\u670d\u8fd0\u7ef4\u7ba1\u7406"}),"\n",(0,t.jsx)(s.p,{children:"\u5373\u4f7f\u662f\u540c\u4e2a\u5de5\u4f5c\u8d1f\u8f7d\uff08GameServerSet\uff09\uff0c\u6e38\u620f\u670d\u4e4b\u95f4\u7684\u72b6\u6001\u4e5f\u662f\u5b58\u5728\u5dee\u5f02\u6027\u7684\u3002\u5728\u8fd9\u79cd\u60c5\u51b5\u4e0b\uff0c\u4ea4\u4ed8\u540e\u7684\u6e38\u620f\u670d\u4e5f\u9700\u8981\u6301\u7eed\u5730\u8fdb\u884c\u5b9a\u5411\u8fd0\u7ef4\u7ba1\u7406\uff0c\u8fd9\u662f\u4e0e\u65e0\u72b6\u6001\u4e1a\u52a1\u6700\u5927\u7684\u4e0d\u540c\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"okg-dashboard-\u767d\u5c4f\u5316\u4e3b\u52a8\u8fd0\u7ef4",children:"OKG Dashboard \u767d\u5c4f\u5316\u4e3b\u52a8\u8fd0\u7ef4"}),"\n",(0,t.jsx)(s.p,{children:"\u901a\u5e38\uff0c\u6211\u4eec\u9700\u8981\u4e3b\u52a8\u8fd0\u7ef4\u6e38\u620f\u670d \u2014\u2014 \u7edf\u8ba1\u548c\u67e5\u8be2\u6e38\u620f\u670d\u72b6\u6001\uff1b\u5b9a\u5411\u66f4\u6539\u6e38\u620f\u670d\u7248\u672c\u3001\u8d44\u6e90\u89c4\u683c\u3001\u8fd0\u7ef4\u72b6\u6001\u7b49\u3002\u901a\u8fc7OKG Dashboard\u53ef\u4ee5\u5b9e\u73b0\u6e38\u620f\u670d\u7684\u4e3b\u52a8\u8fd0\u7ef4\uff1a"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\u6709\u5173OKG Dashboard\u4f7f\u7528\u8bf4\u660e\u53ef\u53c2\u8003\uff1a",(0,t.jsx)(s.a,{href:"https://openkruise.io/zh/kruisegame/user-manuals/game-dashboard",children:"https://openkruise.io/zh/kruisegame/user-manuals/game-dashboard"})]}),"\n",(0,t.jsxs)(s.li,{children:["\u5bf9OKG Dashboard\u7684\u66f4\u591a\u9700\u6c42\u53ef\u5728issue\u4e0b\u8bc4\u8bba\uff1a",(0,t.jsx)(s.a,{href:"https://github.com/openkruise/kruise-game/issues/139",children:"https://github.com/openkruise/kruise-game/issues/139"})]}),"\n"]}),"\n",(0,t.jsx)(s.h3,{id:"\u5efa\u8bbe\u76d1\u63a7\u544a\u8b66\u673a\u5236\u52a0\u5f3a\u6e38\u620f\u670d\u7a33\u5b9a\u6027",children:"\u5efa\u8bbe\u76d1\u63a7\u544a\u8b66\u673a\u5236\uff0c\u52a0\u5f3a\u6e38\u620f\u670d\u7a33\u5b9a\u6027"}),"\n",(0,t.jsx)(s.p,{children:"\u9664\u4e86\u4e3b\u52a8\u8fd0\u7ef4\u4ee5\u5916\uff0c\u6211\u4eec\u9700\u8981\u5efa\u7acb\u7a33\u5b9a\u6027\u95ee\u9898\u8ba2\u9605\u673a\u5236\u3002\u5f53\u6e38\u620f\u670d\u975e\u9884\u671f\u8fd0\u884c\u65f6\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u80fd\u591f\u53ca\u65f6\u54cd\u5e94\u5e76\u5904\u7406\u3002\nOKG\u63d0\u4f9b\u4e86\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u7684\u529f\u80fd\uff0c\u7075\u6d3b\u8fd0\u7528\u6b64\u529f\u80fd\u53ef\u4ee5\u5b9e\u73b0\u5b9a\u5411\u6e38\u620f\u670d\u5f02\u5e38\u72b6\u6001\u900f\u51fa\u5e76\u544a\u8b66\u3002\u53ef\u9605\u8bfb\u6587\u6863\uff1a"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:(0,t.jsx)(s.a,{href:"https://openkruise.io/zh/kruisegame/user-manuals/service-qualities#%E6%B8%B8%E6%88%8F%E6%9C%8D%E7%8A%B6%E6%80%81%E5%BC%82%E5%B8%B8%E8%AE%BE%E7%BD%AE%E7%BB%B4%E6%8A%A4%E4%B8%AD",children:"https://openkruise.io/zh/kruisegame/user-manuals/service-qualities#%E6%B8%B8%E6%88%8F%E6%9C%8D%E7%8A%B6%E6%80%81%E5%BC%82%E5%B8%B8%E8%AE%BE%E7%BD%AE%E7%BB%B4%E6%8A%A4%E4%B8%AD"})}),"\n",(0,t.jsx)(s.li,{children:(0,t.jsx)(s.a,{href:"https://openkruise.io/zh/kruisegame/best-practices/pve-game#%E6%B8%B8%E6%88%8F%E6%9C%8D%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E8%B4%A8%E9%87%8F",children:"https://openkruise.io/zh/kruisegame/best-practices/pve-game#%E6%B8%B8%E6%88%8F%E6%9C%8D%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E8%B4%A8%E9%87%8F"})}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"\u6b64\u5916\uff0c\u82e5\u5e0c\u671b\u6e38\u620f\u670d\u901a\u8fc7\u76d1\u63a7\u6307\u6807\u6765\u5b9e\u73b0\u5b9a\u5411\u544a\u8b66\uff0c\u4e5f\u53ef\u4ee5\u901a\u8fc7\u5728\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u811a\u672c\u4e2d\u8c03\u7528prometheus API\uff08pod name\u53ef\u5229\u7528DownwardAPI\u83b7\u53d6\uff09\uff0c\u5bf9\u6bd4\u6307\u6807\u9608\u503c\u6765\u51b3\u5b9aGameServer OpsState\u7684\u503c\u3002"})]})}function o(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7822],{4163:function(e){e.exports=JSON.parse('{"pluginId":"kruisegame","version":"current","label":"Next","banner":null,"badge":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"kruisegame":[{"type":"category","label":"\u5feb\u901f\u5f00\u59cb","collapsed":false,"items":[{"type":"link","label":"OpenKruiseGame\u7b80\u4ecb","href":"/zh/kruisegame/introduction","docId":"introduction"},{"type":"link","label":"\u5b89\u88c5","href":"/zh/kruisegame/installation","docId":"installation"},{"type":"link","label":"\u8bbe\u8ba1\u7406\u5ff5","href":"/zh/kruisegame/design-concept","docId":"design-concept"}],"collapsible":true},{"type":"category","label":"\u7528\u6237\u624b\u518c","collapsed":false,"items":[{"type":"link","label":"\u90e8\u7f72\u6e38\u620f\u670d","href":"/zh/kruisegame/user-manuals/deploy-gameservers","docId":"user-manuals/deploy-gameservers"},{"type":"link","label":"\u6e38\u620f\u670d\u70ed\u66f4\u65b0","href":"/zh/kruisegame/user-manuals/hot-update","docId":"user-manuals/hot-update"},{"type":"link","label":"\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565","href":"/zh/kruisegame/user-manuals/update-strategy","docId":"user-manuals/update-strategy"},{"type":"link","label":"\u6e38\u620f\u670d\u4f38\u7f29","href":"/zh/kruisegame/user-manuals/gameservers-scale","docId":"user-manuals/gameservers-scale"},{"type":"link","label":"\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236","href":"/zh/kruisegame/user-manuals/container-startup-sequence-control","docId":"user-manuals/container-startup-sequence-control"},{"type":"link","label":"\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf","href":"/zh/kruisegame/user-manuals/service-qualities","docId":"user-manuals/service-qualities"},{"type":"link","label":"\u7f51\u7edc\u6a21\u578b","href":"/zh/kruisegame/user-manuals/network","docId":"user-manuals/network"},{"type":"link","label":"\u6e38\u620f\u670d\u76d1\u63a7","href":"/zh/kruisegame/user-manuals/gameserver-monitor","docId":"user-manuals/gameserver-monitor"},{"type":"link","label":"\u6e38\u620f\u5339\u914d","href":"/zh/kruisegame/user-manuals/game-matchmaking","docId":"user-manuals/game-matchmaking"},{"type":"link","label":"\u6e38\u620f\u670d\u8fd0\u7ef4\u63a7\u5236\u53f0","href":"/zh/kruisegame/user-manuals/game-dashboard","docId":"user-manuals/game-dashboard"},{"type":"link","label":"CRD\u5b57\u6bb5\u8bf4\u660e","href":"/zh/kruisegame/user-manuals/crd-field-description","docId":"user-manuals/crd-field-description"}],"collapsible":true},{"type":"category","label":"\u6700\u4f73\u5b9e\u8df5","collapsed":false,"items":[{"type":"link","label":"\u4f1a\u8bdd\u7c7b\u6e38\u620f\uff08PvP\u5f00\u623f\u95f4\uff09\u6700\u4f73\u5b9e\u8df5","href":"/zh/kruisegame/best-practices/session-based-game","docId":"best-practices/session-based-game"}],"collapsible":true},{"type":"category","label":"\u5f00\u53d1\u8005\u624b\u518c","collapsed":false,"items":[{"type":"link","label":"\u9879\u76ee\u8d21\u732e","href":"/zh/kruisegame/developer-manuals/contribution","docId":"developer-manuals/contribution"},{"type":"link","label":"FAQ","href":"/zh/kruisegame/developer-manuals/faq","docId":"developer-manuals/faq"}],"collapsible":true},{"type":"category","label":"\u535a\u5ba2\u4e0e\u89c6\u9891","collapsed":false,"items":[{"type":"link","label":"\u5c1a\u6e38\u7f51\u7edc\u57fa\u4e8eOpenKruiseGame\u6e38\u620f\u4e91\u539f\u751f\u5316\u5b9e\u8df5","href":"/zh/kruisegame/blog-video/kubecon-shangyou-20230926","docId":"blog-video/kubecon-shangyou-20230926"},{"type":"link","label":"OpenKruiseGame \u52a9\u529b\u6e38\u620f\u8fd0\u7ef4\u7ba1\u7406\u63d0\u6548","href":"/zh/kruisegame/blog-video/meetup-guangzhou-20231125","docId":"blog-video/meetup-guangzhou-20231125"},{"type":"link","label":"\u51a0\u8d62\u4e92\u5a31\u57fa\u4e8eOpenKrusieGame\u5b9e\u73b0\u6e38\u620f\u4e91\u539f\u751f\u67b6\u6784\u5347\u7ea7","href":"/zh/kruisegame/blog-video/guanying-20231129","docId":"blog-video/guanying-20231129"}],"collapsible":true}]},"docs":{"best-practices/session-based-game":{"id":"best-practices/session-based-game","title":"\u4f1a\u8bdd\u7c7b\u6e38\u620f\uff08PvP\u5f00\u623f\u95f4\uff09\u6700\u4f73\u5b9e\u8df5","description":"\u4f1a\u8bdd\u7c7b\uff08session based\uff09\u6e38\u620f\uff0c\u662f\u6307\u5728\u6709\u9650\u7684\u65f6\u95f4\u5185\uff0c\u5c06\u73a9\u5bb6\u6c47\u805a\u5230\u7279\u5b9a\u6e38\u620f\u573a\u666f\u4e0b\u7684\u6e38\u620f\u7c7b\u578b\u3002\u5728\u901a\u5e38\u610f\u4e49\u4e0b\uff0c\u4f1a\u8bdd\u7b49\u540c\u5bf9\u5c40\uff0c\u4e00\u5c40\u7ed3\u675f\u540e\uff0c\u73a9\u5bb6\u95f4\u7684\u6e38\u620f\u5173\u7cfb\u4e5f\u5728\u6b64\u7ed3\u675f\uff0c\u8be5\u4f1a\u8bdd\u4e5f\u540c\u65f6\u7ed3\u675f\u3002\u56e0\u6b64\uff0c\u5728\u4e1a\u754c\u4e5f\u4f1a\u5c06\u4f1a\u8bdd\u7c7b\u6e38\u620f\u901a\u4fd7\u7684\u7406\u89e3\u4e3a\u201c\u5f00\u623f\u95f4\u6e38\u620f\u201d\uff0c\u4e00\u4e2a\u623f\u95f4\u627f\u8f7d\u4e86\u5bf9\u5e94\u7684\u6e38\u620f\u4f1a\u8bdd\u3002\u8fd9\u7c7b\u6e38\u620f\u5f80\u5f80\u5b58\u5728\u7740\u4ee5\u4e0b\u7279\u70b9\uff1a","sidebar":"kruisegame"},"blog-video/guanying-20231129":{"id":"blog-video/guanying-20231129","title":"\u51a0\u8d62\u4e92\u5a31\u57fa\u4e8eOpenKrusieGame\u5b9e\u73b0\u6e38\u620f\u4e91\u539f\u751f\u67b6\u6784\u5347\u7ea7","description":"\u6458\u8981\uff1a\u4f20\u7edf\u533a\u670dPvE\u7c7b\u578b\u6e38\u620f\u5e73\u6ed1\u843d\u5730Kubernetes\u7684\u5b9e\u8df5","sidebar":"kruisegame"},"blog-video/kubecon-shangyou-20230926":{"id":"blog-video/kubecon-shangyou-20230926","title":"\u5c1a\u6e38\u7f51\u7edc\u57fa\u4e8eOpenKruiseGame\u6e38\u620f\u4e91\u539f\u751f\u5316\u5b9e\u8df5","description":"KubeCon & CloudNativeCon 2023","sidebar":"kruisegame"},"blog-video/meetup-guangzhou-20231125":{"id":"blog-video/meetup-guangzhou-20231125","title":"OpenKruiseGame \u52a9\u529b\u6e38\u620f\u8fd0\u7ef4\u7ba1\u7406\u63d0\u6548","description":"KubeSphere\u793e\u533a \u4e91\u539f\u751fMeetup \u5e7f\u5dde\u7ad9","sidebar":"kruisegame"},"design-concept":{"id":"design-concept","title":"\u8bbe\u8ba1\u7406\u5ff5","description":"\u5f00\u6e90OpenKruiseGame\uff08OKG)\u7684\u521d\u8877","sidebar":"kruisegame"},"developer-manuals/contribution":{"id":"developer-manuals/contribution","title":"\u9879\u76ee\u8d21\u732e","description":"\u6b22\u8fce\u6765\u5230 OpenKruiseGame \u793e\u533a\u3002\u968f\u65f6\u63d0\u4f9b\u5e2e\u52a9\u3001\u62a5\u544a\u95ee\u9898\u3001\u63d0\u9ad8\u6587\u6863\u8d28\u91cf\u3001\u4fee\u590d\u9519\u8bef\u6216\u5f15\u5165\u65b0\u529f\u80fd\u3002\u6709\u5173\u5982\u4f55\u5411 OpenKruiseGame \u63d0\u4ea4\u5185\u5bb9\u7684\u8be6\u7ec6\u4fe1\u606f\uff0c\u8bf7\u53c2\u89c1\u4e0b\u6587\u3002","sidebar":"kruisegame"},"developer-manuals/faq":{"id":"developer-manuals/faq","title":"FAQ","description":"\u5982\u4f55\u8c03\u8bd5\u4f60\u7684\u4ee3\u7801","sidebar":"kruisegame"},"installation":{"id":"installation","title":"\u5b89\u88c5","description":"\u5b89\u88c5OpenKruiseGame\uff08OKG\uff09","sidebar":"kruisegame"},"introduction":{"id":"introduction","title":"OpenKruiseGame\u7b80\u4ecb","description":"\u2b50 If you like OpenKruiseGame, give it a star on GitHub!","sidebar":"kruisegame"},"user-manuals/container-startup-sequence-control":{"id":"user-manuals/container-startup-sequence-control","title":"\u5bb9\u5668\u542f\u52a8\u987a\u5e8f\u63a7\u5236","description":"\u529f\u80fd\u6982\u8ff0","sidebar":"kruisegame"},"user-manuals/crd-field-description":{"id":"user-manuals/crd-field-description","title":"CRD\u5b57\u6bb5\u8bf4\u660e","description":"GameServerSet","sidebar":"kruisegame"},"user-manuals/deploy-gameservers":{"id":"user-manuals/deploy-gameservers","title":"\u90e8\u7f72\u6e38\u620f\u670d","description":"\u529f\u80fd\u6982\u8ff0","sidebar":"kruisegame"},"user-manuals/game-dashboard":{"id":"user-manuals/game-dashboard","title":"\u6e38\u620f\u670d\u8fd0\u7ef4\u63a7\u5236\u53f0","description":"OpenKruiseGame\u57fa\u4e8eKubeSphere 4.0 LuBan\u67b6\u6784\u63d0\u4f9b\u4e86\u6e38\u620f\u670d\u767d\u5c4f\u5316\u7ba1\u7406\u63a7\u5236\u53f0\u3002\u672c\u6587\u4ecb\u7ecd\u5982\u4f55\u5b89\u88c5KubeSphere \u4e0e OKG \u6e38\u620f\u670d\u8fd0\u7ef4\u63a7\u5236\u53f0\uff0c\u4ee5\u53ca\u5bf9\u5e94\u7684\u4f7f\u7528\u8bf4\u660e\u3002","sidebar":"kruisegame"},"user-manuals/game-matchmaking":{"id":"user-manuals/game-matchmaking","title":"\u6e38\u620f\u5339\u914d","description":"\u4f1a\u8bdd\u7c7b\u6e38\u620f\u901a\u5e38\u9700\u8981\u5339\u914d\u670d\u52a1\u8ba9\u73a9\u5bb6\u627e\u5230\u5408\u9002\u7684\u961f\u53cb\u53ca\u5bf9\u624b\u7ec4\u6210\u5bf9\u5c40\uff0c\u5e76\u4e3a\u8be5\u5bf9\u5c40\u5206\u914d\u5408\u9002\u7684\u6e38\u620f\u670d\u3002\u7ec4\u6210\u5bf9\u5c40\u7684\u73a9\u5bb6\u62ff\u5230\u6e38\u620f\u670d\u5730\u5740\u540e\u65b9\u53ef\u8fdb\u5165\u6e38\u620f\u3002","sidebar":"kruisegame"},"user-manuals/gameserver-monitor":{"id":"user-manuals/gameserver-monitor","title":"\u6e38\u620f\u670d\u76d1\u63a7","description":"\u53ef\u7528\u6307\u6807","sidebar":"kruisegame"},"user-manuals/gameservers-scale":{"id":"user-manuals/gameservers-scale","title":"\u6e38\u620f\u670d\u4f38\u7f29","description":"OpenKruiseGame\u7684\u6c34\u5e73\u4f38\u7f29\u7279\u6027","sidebar":"kruisegame"},"user-manuals/hot-update":{"id":"user-manuals/hot-update","title":"\u6e38\u620f\u670d\u70ed\u66f4\u65b0","description":"\u6e38\u620f\u670d\u66f4\u65b0\u662f\u6e38\u620f\u670d\u5e94\u7528\u4ea4\u4ed8\u4e2d\u5c24\u4e3a\u91cd\u8981\u7684\u4e00\u73af\u3002\u4f5c\u4e3a\u6709\u72b6\u6001\u7c7b\u578b\u4e1a\u52a1\uff0c\u6e38\u620f\u670d\u7684\u66f4\u65b0\u5f80\u5f80\u5bf9\u4e91\u539f\u751f\u57fa\u7840\u8bbe\u65bd\u6709\u7740\u66f4\u9ad8\u7684\u8981\u6c42\u3002\u672c\u6587\u4e3b\u8981\u4ecb\u7ecd\u5982\u4f55\u5229\u7528OKG\u7684\u539f\u5730\u5347\u7ea7\u80fd\u529b\u5b9e\u73b0\u6e38\u620f\u670d\u70ed\u66f4\u65b0\u3002","sidebar":"kruisegame"},"user-manuals/network":{"id":"user-manuals/network","title":"\u7f51\u7edc\u6a21\u578b","description":"\u529f\u80fd\u6982\u8ff0","sidebar":"kruisegame"},"user-manuals/service-qualities":{"id":"user-manuals/service-qualities","title":"\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf","description":"\u529f\u80fd\u6982\u8ff0","sidebar":"kruisegame"},"user-manuals/update-strategy":{"id":"user-manuals/update-strategy","title":"\u6e38\u620f\u670d\u66f4\u65b0\u7b56\u7565","description":"\u529f\u80fd\u6982\u8ff0","sidebar":"kruisegame"}}}')}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6925],{28453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>l});var a=r(96540);const t={},s=a.createContext(t);function i(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(s.Provider,{value:n},e.children)}},29958:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>u,frontMatter:()=>i,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"developer-manuals/go-client","title":"Golang Client","description":"\u5982\u679c\u8981\u5728\u4e00\u4e2a Golang \u9879\u76ee\u4e2d\u5bf9 OKG \u7684\u8d44\u6e90\u505a create/get/update/delete \u8fd9\u4e9b\u64cd\u4f5c\u3001\u6216\u8005\u901a\u8fc7 informer \u505a list-watch\uff0c\u4f60\u9700\u8981\u4e00\u4e2a\u652f\u6301 OKG \u7684 client\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/developer-manuals/go-client.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/go-client","permalink":"/zh/kruisegame/developer-manuals/go-client","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"FAQ","permalink":"/zh/kruisegame/developer-manuals/faq"},"next":{"title":"Kruise Game API","permalink":"/zh/kruisegame/developer-manuals/kruise-game-api"}}');var t=r(74848),s=r(28453);const i={},l="Golang Client",o={},c=[{value:"\u4f7f\u7528\u65b9\u5f0f",id:"\u4f7f\u7528\u65b9\u5f0f",level:2},{value:"\u4f7f\u7528 OKG api",id:"\u4f7f\u7528-okg-api",level:3},{value:"RABC",id:"rabc",level:3},{value:"\u4ee3\u7801\u793a\u4f8b",id:"\u4ee3\u7801\u793a\u4f8b",level:2}];function m(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"golang-client",children:"Golang Client"})}),"\n",(0,t.jsx)(n.p,{children:"\u5982\u679c\u8981\u5728\u4e00\u4e2a Golang \u9879\u76ee\u4e2d\u5bf9 OKG \u7684\u8d44\u6e90\u505a create/get/update/delete \u8fd9\u4e9b\u64cd\u4f5c\u3001\u6216\u8005\u901a\u8fc7 informer \u505a list-watch\uff0c\u4f60\u9700\u8981\u4e00\u4e2a\u652f\u6301 OKG \u7684 client\u3002"}),"\n",(0,t.jsxs)(n.p,{children:["\u4f60\u9700\u8981\u5728\u4f60\u7684\u9879\u76ee\u4e2d\u5f15\u5165 ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-game",children:"kruise-game"})," \u4ed3\u5e93"]}),"\n",(0,t.jsx)(n.h2,{id:"\u4f7f\u7528\u65b9\u5f0f",children:"\u4f7f\u7528\u65b9\u5f0f"}),"\n",(0,t.jsxs)(n.p,{children:["\u9996\u5148\uff0c\u5728\u4f60\u7684 ",(0,t.jsx)(n.code,{children:"go.mod"})," \u4e2d\u5f15\u5165 ",(0,t.jsx)(n.code,{children:"kruise-game"})," \u4f9d\u8d56 \uff08\u7248\u672c\u53f7\u6700\u597d\u548c\u4f60\u5b89\u88c5\u7684 kruise-game \u7248\u672c\u76f8\u540c\uff09\uff1a"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"require github.com/openkruise/kruise-game v0.7.0\n"})}),"\n",(0,t.jsx)(n.p,{children:"\u4f7f\u7528kruise-game\u8981\u6c42Kubernetes\u7248\u672c>= 1.16\u3002"}),"\n",(0,t.jsx)(n.h3,{id:"\u4f7f\u7528-okg-api",children:"\u4f7f\u7528 OKG api"}),"\n",(0,t.jsx)(n.p,{children:"\u8fd9\u91cc\u6211\u4eec\u4f7f\u7528GameServerSet\u4f5c\u4e3a\u793a\u4f8b\uff0cGameServer\u7684\u4f7f\u7528\u65b9\u6cd5\u4e0eGameServerSet\u76f8\u540c"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"\u4f7f\u7528\u60a8\u7684rest config\u65b0\u5efa kruise-game \u5ba2\u6237\u7aef:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'kruisegameclientset "github.com/openkruise/kruise-game/pkg/client/clientset/versioned"\n\n// cfg \u662f\u5728client-go\u4e2d\u5b9a\u4e49\u7684rest config\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528 kubeconfig \u6216 serviceaccount \u83b7\u53d6\nkruisegameClient := kruisegameclientset.NewForConfigOrDie(cfg)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"\u67e5\u8be2/\u5217\u51fa kruise-game \u8d44\u6e90:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'gamekruiseiov1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"\n\ngameServerSet, err := kruisegameClient.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})\n\n// gss \u662f GameServerSet \u5bf9\u8c61\ngssName := gss.GetName()\n\n// labelSelector\u7528\u4e8e\u8fc7\u6ee4 GameServer\uff0c\u793a\u4f8b\u4e2d\u6211\u4eec\u4f7f\u7528GameServerSet\u540d\u79f0\u7b5b\u9009\u51fa\u5f52\u5c5eGameServerSet\u7ba1\u7406\u7684GameServer\uff0c\u4f60\u4e5f\u53ef\u4ee5\u4f7f\u7528\u81ea\u5b9a\u4e49\u7684labelSelector\u3002\nlabelSelector := labels.SelectorFromSet(map[string]string{\ngamekruiseiov1alpha1.GameServerOwnerGssKey: gssName,\n}).String()\n\ngameServerList, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).List(context.TODO(), metav1.ListOptions{LabelSelector: labelSelector})\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"\u521b\u5efa/\u66f4\u65b0 kruise-game resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import gameKruiseV1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"\n\ncloneSet := &gameKruiseV1alpha1.GameServerSet{\n    // ...\n}\ngameServerSet, err = kruisegameclientset.GameV1alpha1().GameServerSet(namespace).Create(context.TODO(), cloneSet, metav1.CreateOptions{})\n'})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'\ngameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})\nif err != nil {\n    return err\n}\n\n// \u4fee\u6539\u5bf9\u8c61, \u4f8b\u5982\u526f\u672c\u6570\ngameServerSet.Spec.Replicas = pointer.Int32Ptr(3)\n\nnewGameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Update(context.TODO(), gameServerSet, metav1.UpdateOptions{})\nif err != nil{\nreturn err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"\u5220\u9664\u73b0\u6709\u7684GameServerSet:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'// \u5220\u9664 gss\nerr := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Delete(context.TODO(), "GameServerSetName", metav1.DeleteOptions{})\nif err != nil {\nreturn err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"5",children:["\n",(0,t.jsx)(n.li,{children:"\u76d1\u6d4bKruise-Game\u8d44\u6e90:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import gameinformer "github.com/openkruise/kruise-api/client/informers/externalversions"\n\ngameInformerFactory := gameinformer.NewSharedInformerFactory(kruisegameclientset, 0)\ngameInformerFactory.Game().V1alpha1().GameServerSets().Informer().AddEventHandler(...)\ngameInformerFactory.Start(...)\n'})}),"\n",(0,t.jsx)(n.h3,{id:"rabc",children:"RABC"}),"\n",(0,t.jsx)(n.p,{children:"\u5f53\u60a8\u7684\u7ec4\u4ef6\u90e8\u7f72\u5728k8s\u96c6\u7fa4\u5185\u90e8\u65f6\uff0c\u60a8\u9700\u8981\u8d4b\u4e88\u7ec4\u4ef6\u64cd\u4f5c OKG \u8d44\u6e90\u7684\u6743\u9650"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  creationTimestamp: null\n  name: okg-role\nrules:\n- apiGroups:\n  - game.kruise.io\n  resources:\n  - gameserversets\n  verbs:\n  - create\n  - delete\n  - get\n  - list\n  - patch\n  - update\n  - watch\n- apiGroups:\n  - game.kruise.io\n  resources:\n  - gameservers\n  verbs:\n  - create\n  - delete\n  - get\n  - list\n  - patch\n  - update\n  - watch\n---\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: okg-sa       # \u4e3a\u4f60\u7684pod\u8bbe\u7f6eserviceAccount\u540d\u5b57\n  namespace: kube-system\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: okg-rolebinding\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: okg-role\nsubjects:\n- kind: ServiceAccount\n  name: okg-sa\n  namespace: kube-system\n\n"})}),"\n",(0,t.jsx)(n.h2,{id:"\u4ee3\u7801\u793a\u4f8b",children:"\u4ee3\u7801\u793a\u4f8b"}),"\n",(0,t.jsx)(n.p,{children:"\u4ee5\u4e0b\u9879\u76ee\u90fd\u4f7f\u7528\u4e86OKG API\uff0c\u5f00\u53d1\u8005\u53ef\u4f5c\u4e3a\u793a\u4f8b\u9605\u8bfb\u6e90\u7801\u53c2\u8003\uff1a"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/aigc-gateway",children:"https://github.com/CloudNativeGame/aigc-gateway"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/kruise-game-open-match-director",children:"https://github.com/CloudNativeGame/kruise-game-open-match-director"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/palworld-okg-playground",children:"https://github.com/CloudNativeGame/palworld-okg-playground"})}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}}}]);
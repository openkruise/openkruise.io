"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7569],{28453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>o});var a=r(96540);const t={},s=a.createContext(t);function i(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(s.Provider,{value:n},e.children)}},42244:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"developer-manuals/go-client","title":"Golang Client","description":"If you want to create/get/update/delete those OKG resources in a Golang project or list-watch them using informer,","source":"@site/kruisegame/developer-manuals/go-client.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/go-client","permalink":"/kruisegame/developer-manuals/go-client","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"FAQ","permalink":"/kruisegame/developer-manuals/faq"},"next":{"title":"Kruise Game API","permalink":"/kruisegame/developer-manuals/kruise-game-api"}}');var t=r(74848),s=r(28453);const i={},o="Golang Client",l={},c=[{value:"Usage",id:"usage",level:2},{value:"Use OKG api",id:"use-okg-api",level:3},{value:"RBAC",id:"rbac",level:3},{value:"Code Example",id:"code-example",level:2}];function m(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"golang-client",children:"Golang Client"})}),"\n",(0,t.jsx)(n.p,{children:"If you want to create/get/update/delete those OKG resources in a Golang project or list-watch them using informer,\nyou may need a Golang client for OKG."}),"\n",(0,t.jsxs)(n.p,{children:["In that way, you should use the ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-game",children:"kruise-game"})," repository"]}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsxs)(n.p,{children:["Firstly, import ",(0,t.jsx)(n.code,{children:"kruise-game"})," into your ",(0,t.jsx)(n.code,{children:"go.mod"})," file (the version better to be the kruise-game version you installed):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"require github.com/openkruise/kruise-game v0.7.0\n"})}),"\n",(0,t.jsx)(n.p,{children:"Using the kruise-game api requires Kubernetes version >= 1.16."}),"\n",(0,t.jsx)(n.h3,{id:"use-okg-api",children:"Use OKG api"}),"\n",(0,t.jsx)(n.p,{children:"Here we use GameServerSet as an example, GameServer is used in the same way as GameServerSet"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"New kruise-game client using your rest config:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'kruisegameclientset "github.com/openkruise/kruise-game/pkg/client/clientset/versioned"\n\n// cfg is the rest config defined in client-go, you should get it using kubeconfig or serviceaccount\nkruisegameClient := kruisegameclientset.NewForConfigOrDie(cfg)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"Get/List Kruise-Game resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'gamekruiseiov1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"\n\ngameServerSet, err := kruisegameClient.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})\n\n// gss is a GameServerSet object\ngssName := gss.GetName()\n\n// The labelSelector is used to filter GameServers, in the example we use the name of the GameServerSet to filter out the GameServers it manages, you can also use a custom labelSelector.\nlabelSelector := labels.SelectorFromSet(map[string]string{\ngamekruiseiov1alpha1.GameServerOwnerGssKey: gssName,\n}).String()\n\ngameServerList, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).List(context.TODO(), metav1.ListOptions{})\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Create/Update kruise-game resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import gameKruiseV1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"\n\ncloneSet := &gameKruiseV1alpha1.GameServerSet{\n    // ...\n}\ngameServerSet, err = kruisegameclientset.GameV1alpha1().GameServerSet(namespace).Create(context.TODO(), cloneSet, metav1.CreateOptions{})\n'})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'\ngameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Get(context.TODO(), "GameServerSetName", metav1.GetOptions{})\nif err != nil {\n    return err\n}\n\n// Modify object, such as replicas\ngameServerSet.Spec.Replicas = pointer.Int32Ptr(3)\n\nnewGameServerSet, err := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Update(context.TODO(), gameServerSet, metav1.UpdateOptions{})\nif err != nil{\nreturn err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Delete an existing GameServerSet:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'// delete gss\nerr := kruisegameclientset.GameV1alpha1().GameServerSets(namespace).Delete(context.TODO(), "GameServerSetName", metav1.DeleteOptions{})\nif err != nil {\nreturn err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"5",children:["\n",(0,t.jsx)(n.li,{children:"Watch Kruise-Game resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import gameinformer "github.com/openkruise/kruise-api/client/informers/externalversions"\n\ngameInformerFactory := gameinformer.NewSharedInformerFactory(kruisegameclientset, 0)\ngameInformerFactory.Game().V1alpha1().GameServerSets().Informer().AddEventHandler(...)\ngameInformerFactory.Start(...)\n'})}),"\n",(0,t.jsx)(n.h3,{id:"rbac",children:"RBAC"}),"\n",(0,t.jsx)(n.p,{children:"When your component is deployed inside a kubernetes cluster, you need to give the component permission to operate OKG resources"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  creationTimestamp: null\n  name: okg-role\nrules:\n- apiGroups:\n  - game.kruise.io\n  resources:\n  - gameserversets\n  verbs:\n  - create\n  - delete\n  - get\n  - list\n  - patch\n  - update\n  - watch\n- apiGroups:\n  - game.kruise.io\n  resources:\n  - gameservers\n  verbs:\n  - create\n  - delete\n  - get\n  - list\n  - patch\n  - update\n  - watch\n---\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: okg-sa      # Set the serviceAccount Name for your pod\n  namespace: kube-system\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: okg-rolebinding\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: okg-role\nsubjects:\n- kind: ServiceAccount\n  name: okg-sa\n  namespace: kube-system\n\n"})}),"\n",(0,t.jsx)(n.h2,{id:"code-example",children:"Code Example"}),"\n",(0,t.jsx)(n.p,{children:"The following projects all use the OKG API, and developers can read the source code reference as an example:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/aigc-gateway",children:"https://github.com/CloudNativeGame/aigc-gateway"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/kruise-game-open-match-director",children:"https://github.com/CloudNativeGame/kruise-game-open-match-director"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/palworld-okg-playground",children:"https://github.com/CloudNativeGame/palworld-okg-playground"})}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}}}]);
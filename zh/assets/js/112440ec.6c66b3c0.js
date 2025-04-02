"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3139],{20608:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>a});const i=JSON.parse('{"id":"developer-manuals/go-client","title":"Golang client","description":"\u5982\u679c\u8981\u5728\u4e00\u4e2a Golang \u9879\u76ee\u4e2d\u5bf9 OpenKruise \u7684\u8d44\u6e90\u505a create/get/update/delete \u8fd9\u4e9b\u64cd\u4f5c\u3001\u6216\u8005\u901a\u8fc7 informer \u505a list-watch\uff0c\u4f60\u9700\u8981\u4e00\u4e2a\u652f\u6301 OpenKruise \u7684 client\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.7/developer-manuals/go-client.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/go-client","permalink":"/zh/docs/v1.7/developer-manuals/go-client","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/developer-manuals/go-client.md","tags":[],"version":"v1.7","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"Golang client"},"sidebar":"docs","previous":{"title":"BroadcastJob + Advanced CronJob \u5b9a\u671f\u6e05\u7406\u8282\u70b9\u78c1\u76d8","permalink":"/zh/docs/v1.7/best-practices/acronjob+broadcastjob"},"next":{"title":"Java client","permalink":"/zh/docs/v1.7/developer-manuals/java-client"}}');var t=r(74848),s=r(28453);const l={title:"Golang client"},o=void 0,c={},a=[{value:"\u4f7f\u7528\u65b9\u5f0f",id:"\u4f7f\u7528\u65b9\u5f0f",level:2},{value:"\u76f4\u63a5\u4f7f\u7528",id:"\u76f4\u63a5\u4f7f\u7528",level:3},{value:"\u901a\u8fc7 controller-runtime \u4f7f\u7528",id:"\u901a\u8fc7-controller-runtime-\u4f7f\u7528",level:3}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"\u5982\u679c\u8981\u5728\u4e00\u4e2a Golang \u9879\u76ee\u4e2d\u5bf9 OpenKruise \u7684\u8d44\u6e90\u505a create/get/update/delete \u8fd9\u4e9b\u64cd\u4f5c\u3001\u6216\u8005\u901a\u8fc7 informer \u505a list-watch\uff0c\u4f60\u9700\u8981\u4e00\u4e2a\u652f\u6301 OpenKruise \u7684 client\u3002"}),"\n",(0,t.jsxs)(n.p,{children:["\u4f60\u9700\u8981\u5728\u4f60\u7684\u9879\u76ee\u4e2d\u5f15\u5165 ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api",children:"kruise-api"})," \u4ed3\u5e93\uff0c\u5b83\u5305\u542b\u4e86 Kruise \u7684 schema \u5b9a\u4e49\u4ee5\u53ca clientset \u7b49\u5de5\u5177\u3002"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\u4e0d\u8981"}),"\u76f4\u63a5\u5f15\u5165\u6574\u4e2a ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise",children:"kruise"})," \u4ed3\u5e93\u4f5c\u4e3a\u4f9d\u8d56\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"\u4f7f\u7528\u65b9\u5f0f",children:"\u4f7f\u7528\u65b9\u5f0f"}),"\n",(0,t.jsxs)(n.p,{children:["\u9996\u5148\uff0c\u5728\u4f60\u7684 ",(0,t.jsx)(n.code,{children:"go.mod"})," \u4e2d\u5f15\u5165 ",(0,t.jsx)(n.code,{children:"kruise-api"})," \u4f9d\u8d56 \uff08\u7248\u672c\u53f7\u6700\u597d\u548c\u4f60\u5b89\u88c5\u7684 Kruise \u7248\u672c\u76f8\u540c\uff09\uff1a"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"require github.com/openkruise/kruise-api v1.7.0\n"})}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Kubernetes Version in your Project"}),(0,t.jsx)(n.th,{children:(0,t.jsx)(n.code,{children:"Import Kruise-api < v0.10"})}),(0,t.jsx)(n.th,{children:(0,t.jsx)(n.code,{children:"Import Kruise-api >= v0.10"})})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"< 1.18"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y (x <= 9)"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y-legacy (x >= 10)"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:">= 1.18"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y-1.18 (7 <= x <= 9)"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y (x >= 10)"})})]})]})]}),"\n",(0,t.jsxs)(n.p,{children:["\u7136\u540e\uff0c\u6709\u4e24\u79cd\u65b9\u5f0f\u5728\u4f60\u7684\u4ee3\u7801\u4e2d\u4f7f\u7528 ",(0,t.jsx)(n.code,{children:"kruise-api"}),"\uff1a\u76f4\u63a5\u4f7f\u7528 \u6216 \u901a\u8fc7 ",(0,t.jsx)(n.code,{children:"controller-runtime"})," \u4f7f\u7528\u3002"]}),"\n",(0,t.jsxs)(n.p,{children:["\u5982\u679c\u4f60\u7684\u9879\u76ee\u662f\u901a\u8fc7 ",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," \u6216 ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"})," \u751f\u6210\u7684\uff0c\n\u90a3\u4e48\u5efa\u8bae\u4f60\u901a\u8fc7 ",(0,t.jsx)(n.code,{children:"controller-runtime"})," \u4f7f\u7528\u3002\u5426\u5219\uff0c\u4f60\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u3002"]}),"\n",(0,t.jsx)(n.h3,{id:"\u76f4\u63a5\u4f7f\u7528",children:"\u76f4\u63a5\u4f7f\u7528"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"New Kruise client using your rest config:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseclientset "github.com/openkruise/kruise-api/client/clientset/versioned"\n\n// cfg is the rest config defined in client-go, you should get it using kubeconfig or serviceaccount\nkruiseClient := kruiseclientset.NewForConfigOrDie(cfg)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"Get/List Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"cloneSet, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).Get(name, metav1.GetOptions{})\ncloneSetList, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).List(metav1.ListOptions{})\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Create/Update Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\ncloneSet := kruiseappsv1alpha1.CloneSet{\n    // ...\n}\nerr = kruiseClient.AppsV1alpha1().CloneSets(namespace).Create(&cloneSet, metav1.CreateOptions)\n'})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"// Get first\ncloneSet, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).Get(name, metav1.GetOptions{})\nif err != nil {\n    return err\n}\n\n// Modify object, such as replicas or template\ncloneSet.Spec.Replicas = utilpointer.Int32Ptr(5)\n\n// Update\n// This might get conflict, should retry it\nif err = kruiseClient.AppsV1alpha1().CloneSets(namespace).Update(&cloneSet, metav1.UpdateOptions); err != nil {\n    return err\n}\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Watch Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseinformer "github.com/openkruise/kruise-api/client/informers/externalversions"\n\nkruiseInformerFactory := kruiseinformer.NewSharedInformerFactory(kruiseClient, 0)\nkruiseInformerFactory.Apps().V1alpha1().CloneSets().Informer().AddEventHandler(...)\nkruiseInformerFactory.Start(...)\n'})}),"\n",(0,t.jsx)(n.h3,{id:"\u901a\u8fc7-controller-runtime-\u4f7f\u7528",children:"\u901a\u8fc7 controller-runtime \u4f7f\u7528"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Add kruise apis into the scheme in your ",(0,t.jsx)(n.code,{children:"main.go"})]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseapi "github.com/openkruise/kruise-api"\n\n// ...\n_ = kruiseapi.AddToScheme(scheme)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"New client"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"This is needed when use controller-runtime client directly."}),"\n",(0,t.jsxs)(n.p,{children:["If your project is generated by ",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," or ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"}),",\nyou should get the client from ",(0,t.jsx)(n.code,{children:"mgr.GetClient()"})," instead of the example below."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import "sigs.k8s.io/controller-runtime/pkg/client"\n\napiClient, err := client.New(c, client.Options{Scheme: scheme})\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Get/List"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import (\n    kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n    "sigs.k8s.io/controller-runtime/pkg/client"\n)\n\ncloneSet := kruiseappsv1alpha1.CloneSet{}\nerr = apiClient.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: name}, &cloneSet)\n\ncloneSetList := kruiseappsv1alpha1.CloneSetList{}\nerr = apiClient.List(context.TODO(), &cloneSetList, client.InNamespace(instance.Namespace))\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Create/Update/Delete"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Create a new CloneSet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\ncloneSet := kruiseappsv1alpha1.CloneSet{\n    // ...\n}\nerr = apiClient.Create(context.TODO(), &cloneSet)\n'})}),"\n",(0,t.jsx)(n.p,{children:"Update an existing CloneSet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\n// Get first\ncloneSet := kruiseappsv1alpha1.CloneSet{}\nif err = apiClient.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: name}, &cloneSet); err != nil {\n    return err\n}\n\n// Modify object, such as replicas or template\ncloneSet.Spec.Replicas = utilpointer.Int32Ptr(5)\n\n// Update\n// This might get conflict, should retry it\nif err = apiClient.Update(context.TODO(), &cloneSet); err != nil {\n    return err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"5",children:["\n",(0,t.jsx)(n.li,{children:"List watch and informer"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If your project is generated by ",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," or ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"})," and get the client from ",(0,t.jsx)(n.code,{children:"mgr.GetClient()"}),",\nthen methods like ",(0,t.jsx)(n.code,{children:"Get"}),"/",(0,t.jsx)(n.code,{children:"List"})," have already queried from informer instead of apiserver."]})]})}function p(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>l,x:()=>o});var i=r(96540);const t={},s=i.createContext(t);function l(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);
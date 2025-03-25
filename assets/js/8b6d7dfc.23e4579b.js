"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7443],{28453:(e,n,r)=>{r.d(n,{R:()=>o,x:()=>l});var i=r(96540);const t={},s=i.createContext(t);function o(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(s.Provider,{value:n},e.children)}},82103:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"developer-manuals/go-client","title":"Golang client","description":"If you want to create/get/update/delete those OpenKruise resources in a Golang project or list-watch them using informer,","source":"@site/versioned_docs/version-v1.7/developer-manuals/go-client.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/go-client","permalink":"/docs/developer-manuals/go-client","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/developer-manuals/go-client.md","tags":[],"version":"v1.7","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{"title":"Golang client"},"sidebar":"docs","previous":{"title":"BroadcastJob + Advanced CronJob Help You Maintain Kubernetes Nodes","permalink":"/docs/best-practices/acronjob+broadcastjob"},"next":{"title":"Java client","permalink":"/docs/developer-manuals/java-client"}}');var t=r(74848),s=r(28453);const o={title:"Golang client"},l=void 0,a={},c=[{value:"Usage",id:"usage",level:2},{value:"Use kruise-api directly",id:"use-kruise-api-directly",level:3},{value:"Use kruise-api with controller-runtime",id:"use-kruise-api-with-controller-runtime",level:3}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"If you want to create/get/update/delete those OpenKruise resources in a Golang project or list-watch them using informer,\nyou may need a Golang client for OpenKruise."}),"\n",(0,t.jsxs)(n.p,{children:["In that way, you should use the ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api",children:"kruise-api"})," repository,\nwhich only includes schema definition and clientsets of Kruise."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"DO NOT"})," bring the whole ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise",children:"kruise"})," repository as dependency into your project."]}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsxs)(n.p,{children:["Firstly, import ",(0,t.jsx)(n.code,{children:"kruise-api"})," into your ",(0,t.jsx)(n.code,{children:"go.mod"})," file (the version better to be the Kruise version you installed):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"require github.com/openkruise/kruise-api v1.7.0\n"})}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Kubernetes Version in your Project"}),(0,t.jsxs)(n.th,{children:["Import Kruise-api ",(0,t.jsx)(n.code,{children:"< v0.10"})]}),(0,t.jsxs)(n.th,{children:["Import Kruise-api ",(0,t.jsx)(n.code,{children:">= v0.10"})]})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"< 1.18"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y (x <= 9)"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y-legacy (x >= 10)"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:">= 1.18"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y-1.18 (7 <= x <= 9)"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"v0.x.y (x >= 10)"})})]})]})]}),"\n",(0,t.jsxs)(n.p,{children:["Then, there are two ways to use ",(0,t.jsx)(n.code,{children:"kruise-api"})," in your code: use it directly or with ",(0,t.jsx)(n.code,{children:"controller-runtime"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["It is recommended that you can use it with ",(0,t.jsx)(n.code,{children:"controller-runtime"})," if your project is generated by\n",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," or ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"}),",\nwhich means ",(0,t.jsx)(n.code,{children:"controller-runtime"})," is already imported in your project.\nOtherwise, you may use it directly."]}),"\n",(0,t.jsx)(n.h3,{id:"use-kruise-api-directly",children:"Use kruise-api directly"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"New Kruise client using your rest config:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseclientset "github.com/openkruise/kruise-api/client/clientset/versioned"\n\n// cfg is the rest config defined in client-go, you should get it using kubeconfig or serviceaccount\nkruiseClient := kruiseclientset.NewForConfigOrDie(cfg)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"Get/List Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"cloneSet, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).Get(name, metav1.GetOptions{})\ncloneSetList, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).List(metav1.ListOptions{})\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Create/Update Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\ncloneSet := kruiseappsv1alpha1.CloneSet{\n    // ...\n}\nerr = kruiseClient.AppsV1alpha1().CloneSets(namespace).Create(&cloneSet, metav1.CreateOptions)\n'})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"// Get first\ncloneSet, err := kruiseClient.AppsV1alpha1().CloneSets(namespace).Get(name, metav1.GetOptions{})\nif err != nil {\n    return err\n}\n\n// Modify object, such as replicas or template\ncloneSet.Spec.Replicas = utilpointer.Int32Ptr(5)\n\n// Update\n// This might get conflict, should retry it\nif err = kruiseClient.AppsV1alpha1().CloneSets(namespace).Update(&cloneSet, metav1.UpdateOptions); err != nil {\n    return err\n}\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Watch Kruise resources:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseinformer "github.com/openkruise/kruise-api/client/informers/externalversions"\n\nkruiseInformerFactory := kruiseinformer.NewSharedInformerFactory(kruiseClient, 0)\nkruiseInformerFactory.Apps().V1alpha1().CloneSets().Informer().AddEventHandler(...)\nkruiseInformerFactory.Start(...)\n'})}),"\n",(0,t.jsx)(n.h3,{id:"use-kruise-api-with-controller-runtime",children:"Use kruise-api with controller-runtime"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Add kruise apis into the scheme in your ",(0,t.jsx)(n.code,{children:"main.go"})]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseapi "github.com/openkruise/kruise-api"\n\n// ...\n_ = kruiseapi.AddToScheme(scheme)\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"New client"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"This is needed when use controller-runtime client directly."}),"\n",(0,t.jsxs)(n.p,{children:["If your project is generated by ",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," or ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"}),",\nyou should get the client from ",(0,t.jsx)(n.code,{children:"mgr.GetClient()"})," instead of the example below."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import "sigs.k8s.io/controller-runtime/pkg/client"\n\napiClient, err := client.New(c, client.Options{Scheme: scheme})\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Get/List"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import (\n    kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n    "sigs.k8s.io/controller-runtime/pkg/client"\n)\n\ncloneSet := kruiseappsv1alpha1.CloneSet{}\nerr = apiClient.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: name}, &cloneSet)\n\ncloneSetList := kruiseappsv1alpha1.CloneSetList{}\nerr = apiClient.List(context.TODO(), &cloneSetList, client.InNamespace(instance.Namespace))\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Create/Update/Delete"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Create a new CloneSet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\ncloneSet := kruiseappsv1alpha1.CloneSet{\n    // ...\n}\nerr = apiClient.Create(context.TODO(), &cloneSet)\n'})}),"\n",(0,t.jsx)(n.p,{children:"Update an existing CloneSet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'import kruiseappsv1alpha1 "github.com/openkruise/kruise-api/apps/v1alpha1"\n\n// Get first\ncloneSet := kruiseappsv1alpha1.CloneSet{}\nif err = apiClient.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: name}, &cloneSet); err != nil {\n    return err\n}\n\n// Modify object, such as replicas or template\ncloneSet.Spec.Replicas = utilpointer.Int32Ptr(5)\n\n// Update\n// This might get conflict, should retry it\nif err = apiClient.Update(context.TODO(), &cloneSet); err != nil {\n    return err\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"5",children:["\n",(0,t.jsx)(n.li,{children:"List watch and informer"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If your project is generated by ",(0,t.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/kubebuilder",children:"kubebuilder"})," or ",(0,t.jsx)(n.a,{href:"https://github.com/operator-framework/operator-sdk",children:"operator-sdk"})," and get the client from ",(0,t.jsx)(n.code,{children:"mgr.GetClient()"}),",\nthen methods like ",(0,t.jsx)(n.code,{children:"Get"}),"/",(0,t.jsx)(n.code,{children:"List"})," have already queried from informer instead of apiserver."]})]})}function p(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}}}]);
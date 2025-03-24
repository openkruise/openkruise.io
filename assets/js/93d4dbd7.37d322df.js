"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3362],{5251:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/workqueue-starve-9821348cf485c42d23682a8a14fdbcb1.png"},19149:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/workqueue-e607402bb269a71112baa4c9870fb109.png"},28453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var o=t(96540);const r={},i=o.createContext(r);function s(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(i.Provider,{value:n},e.children)}},80261:e=>{e.exports=JSON.parse('{"permalink":"/blog/learning-concurrent-reconciling","editUrl":"https://github.com/openkruise/openkruise.io/edit/master/blog/2019-11-10-learning-concurrent-reconciling.md","source":"@site/blog/2019-11-10-learning-concurrent-reconciling.md","title":"Learning Concurrent Reconciling","description":"The concept of controller in Kubernete is one of the most important reasons that make it successful.","date":"2019-11-10T00:00:00.000Z","tags":[{"inline":true,"label":"workload","permalink":"/blog/tags/workload"},{"inline":true,"label":"reconcile","permalink":"/blog/tags/reconcile"},{"inline":true,"label":"controller","permalink":"/blog/tags/controller"}],"readingTime":3.915,"hasTruncateMarker":false,"authors":[{"name":"Fei Guo","title":"Maintainer of OpenKruise","url":"https://github.com/Fei-Guo","imageURL":"https://github.com/Fei-Guo.png","key":"Fei-Guo","page":null}],"frontMatter":{"slug":"learning-concurrent-reconciling","title":"Learning Concurrent Reconciling","authors":["Fei-Guo"],"tags":["workload","reconcile","controller"]},"unlisted":false,"prevItem":{"title":"UnitedDeploymemt - Supporting Multi-domain Workload Management","permalink":"/blog/uniteddeployment"},"nextItem":{"title":"Kruise Workload Classification Guidance","permalink":"/blog/workload-classification-guidance"}}')},98524:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>a});var o=t(80261),r=t(74848),i=t(28453);const s={slug:"learning-concurrent-reconciling",title:"Learning Concurrent Reconciling",authors:["Fei-Guo"],tags:["workload","reconcile","controller"]},c=void 0,l={authorsImageUrls:[void 0]},a=[];function d(e){const n={a:"a",code:"code",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"The concept of controller in Kubernete is one of the most important reasons that make it successful.\nController is the core mechanism that supports Kubernetes APIs to ensure the system reaches\nthe desired state. By leveraging CRDs/controllers and operators, it is fairly easy for\nother systems to integrate with Kubernetes."}),"\n",(0,r.jsxs)(n.p,{children:["Controller runtime library and the corresponding controller tool ",(0,r.jsx)(n.a,{href:"https://book.kubebuilder.io/introduction.html",children:"KubeBuilder"}),'\nare widely used by many developers to build their customized Kubernetes controllers. In Kruise project,\nwe also use Kubebuilder to generate scaffolding codes that implement the "reconciling" logic.\nIn this blog post, I will share some learnings from\nKruise controller development, particularly, about concurrent reconciling.']}),"\n",(0,r.jsxs)(n.p,{children:["Some people may already notice that controller runtime supports concurrent reconciling.\nCheck for the options (",(0,r.jsx)(n.a,{href:"https://github.com/kubernetes-sigs/controller-runtime/blob/81842d0e78f7111f0566156189806e2801e3adf1/pkg/controller/controller.go#L32",children:"source"}),")\nused to create new controller:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"type Options struct {\n\t// MaxConcurrentReconciles is the maximum number of concurrent Reconciles which can be run. Defaults to 1.\n\tMaxConcurrentReconciles int\n\n\t// Reconciler reconciles an object\n\tReconciler reconcile.Reconciler\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"Concurrent reconciling is quite useful when the states of the controller's watched objects change so\nfrequently that a large amount of reconcile requests are sent to and queued in the reconcile queue.\nMultiple reconcile loops do help drain the reconcile queue much more quickly compared to the default single\nreconcile loop case. Although this is a great feature for performance, without digging into the code,\nan immediate concern that a developer may raise is that will this introduce consistency issue?\ni.e., is it possible that two reconcile loops handle the same object at the same time?"}),"\n",(0,r.jsxs)(n.p,{children:['The answer is NO, as you may expect. The "magic" is enforced by the workqueue\nimplementation in Kubernetes ',(0,r.jsx)(n.code,{children:"client-go"}),", which is used by controller runtime reconcile queue.\nThe workqueue algorithm (",(0,r.jsx)(n.a,{href:"https://github.com/kubernetes/client-go/blob/a57d0056dbf1d48baaf3cee876c123bea745591f/util/workqueue/queue.go#L65",children:"source"}),")\nis demonstrated in Figure 1."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"workqueue",src:t(19149).A+"",width:"670",height:"808"})}),"\n",(0,r.jsxs)(n.p,{children:["Basically, the workqueue uses a ",(0,r.jsx)(n.code,{children:"queue"})," and two ",(0,r.jsx)(n.code,{children:"sets"})," to coordinate the process of handling multiple reconciling\nrequests against the same object. Figure 1(a) presents the initial state of handling four reconcile requests,\ntwo of which target the same object A. When a request arrives, the target object is first added to the ",(0,r.jsx)(n.code,{children:"dirty set"}),"\nor dropped if it presents in ",(0,r.jsx)(n.code,{children:"dirty set"}),",  and then pushed to the ",(0,r.jsx)(n.code,{children:"queue"})," only if it is not presented in\n",(0,r.jsx)(n.code,{children:"processing set"}),". Figure 1(b) shows the case of adding three requests consecutively.\nWhen a reconciling loop is ready to serve a request, it gets the target object from the ",(0,r.jsx)(n.code,{children:"front"})," of the queue. The\nobject is also added to the ",(0,r.jsx)(n.code,{children:"processing set"})," and removed from the ",(0,r.jsx)(n.code,{children:"dirty set"})," (Figure 1(c)).\nNow if a request of the processing object arrives, the object is only added to the ",(0,r.jsx)(n.code,{children:"dirty set"}),", not\nto the ",(0,r.jsx)(n.code,{children:"queue"})," (Figure 1(d)). This guarantees that an object is only handled by one reconciling\nloop. When reconciling is done, the object is removed from the ",(0,r.jsx)(n.code,{children:"processing set"}),". If the object is also\nshown in the ",(0,r.jsx)(n.code,{children:"dirty set"}),", it is added back to the ",(0,r.jsx)(n.code,{children:"back"})," of the ",(0,r.jsx)(n.code,{children:"queue"})," (Figure 1(e))."]}),"\n",(0,r.jsx)(n.p,{children:"The above algorithm has following implications:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"It avoids concurrent reconciling for the same object."}),"\n",(0,r.jsxs)(n.li,{children:["The object processing order can be different from arriving order even if there is only one reconciling thread.\nThis usually would not be a problem since the controller still reconciles to the final cluster state. However,\nthe out of order reconciling may cause a significant delay for a request.\n",(0,r.jsx)(n.img,{alt:"workqueue-starve",src:t(5251).A+"",width:"665",height:"556"}),".... For example, as illustrated in\nFigure 2, assuming there is only one reconciling thread and two requests targeting the same object A arrive, one of\nthem will be processed and object A will be added to the ",(0,r.jsx)(n.code,{children:"dirty set"})," (Figure 2(b)).\nIf the reconciling takes a long time and during which a large number of new reconciling requests arrive,\nthe queue will be filled up by the new requests (Figure 2(c)). When reconciling is done, object A will be\nadded to the ",(0,r.jsx)(n.code,{children:"back"})," of the ",(0,r.jsx)(n.code,{children:"queue"})," (Figure 2(d)). It would not be handled until all the requests coming after had been\nhandled, which can cause a noticeable long delay. The workaround is actually simple - ",(0,r.jsx)(n.strong,{children:"USE CONCURRENT RECONCILES"}),".\nSince the cost of an idle go routine is fairly small, the overhead of having multiple reconcile threads is\nlow even if the controller is idle. It seems that the ",(0,r.jsx)(n.code,{children:"MaxConcurrentReconciles"})," value should\nbe overwritten to a value larger than the default 1 (CloneSet uses 10 for example)."]}),"\n",(0,r.jsxs)(n.li,{children:["Last but not the least, reconcile requests can be dropped (if the target exists in ",(0,r.jsx)(n.code,{children:"dirty set"}),"). This means\nthat we cannot assume that the controller can track all the object state change events. Recalling a presentation\ngiven by ",(0,r.jsx)(n.a,{href:"https://speakerdeck.com/thockin/edge-vs-level-triggered-logic",children:"Tim Hockin"}),", Kubernetes controller\nis level triggered, not edge triggered. It reconciles for state, not for events."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Thanks for reading the post, hope it helps."})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}}}]);
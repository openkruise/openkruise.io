"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2475],{7868:(e,n,s)=>{s.d(n,{A:()=>r});const r=s.p+"assets/images/architecture-08f2cb3a5b19c102412f9df77b365eef.png"},9065:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>t,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"core-concepts/architecture","title":"Architecture","description":"The overall architecture of OpenKruise is shown as below:","source":"@site/docs/core-concepts/architecture.md","sourceDirName":"core-concepts","slug":"/core-concepts/architecture","permalink":"/docs/next/core-concepts/architecture","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/core-concepts/architecture.md","tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Architecture"},"sidebar":"docs","previous":{"title":"Installation","permalink":"/docs/next/installation"},"next":{"title":"InPlace Update","permalink":"/docs/next/core-concepts/inplace-update"}}');var i=s(74848),o=s(28453);const t={title:"Architecture"},a=void 0,c={},l=[{value:"API",id:"api",level:2},{value:"Manager",id:"manager",level:2},{value:"Daemon",id:"daemon",level:2}];function d(e){const n={code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"The overall architecture of OpenKruise is shown as below:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"alt",src:s(7868).A+"",width:"3709",height:"1659"})}),"\n",(0,i.jsx)(n.h2,{id:"api",children:"API"}),"\n",(0,i.jsxs)(n.p,{children:["All features provided by OpenKruise are following ",(0,i.jsx)(n.strong,{children:"Kubernetes API"}),", including:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"CRD definition, such as"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",metastring:"script",children:"$ kubectl get crd | grep kruise.io\nadvancedcronjobs.apps.kruise.io            2021-09-16T06:02:36Z\nbroadcastjobs.apps.kruise.io               2021-09-16T06:02:36Z\nclonesets.apps.kruise.io                   2021-09-16T06:02:36Z\ncontainerrecreaterequests.apps.kruise.io   2021-09-16T06:02:36Z\ndaemonsets.apps.kruise.io                  2021-09-16T06:02:36Z\nimagepulljobs.apps.kruise.io               2021-09-16T06:02:36Z\nnodeimages.apps.kruise.io                  2021-09-16T06:02:36Z\npodunavailablebudgets.policy.kruise.io     2021-09-16T06:02:36Z\nresourcedistributions.apps.kruise.io       2021-09-16T06:02:36Z\nsidecarsets.apps.kruise.io                 2021-09-16T06:02:36Z\nstatefulsets.apps.kruise.io                2021-09-16T06:02:36Z\nuniteddeployments.apps.kruise.io           2021-09-16T06:02:37Z\nworkloadspreads.apps.kruise.io             2021-09-16T06:02:37Z\n# ...\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Specific identities (e.g. labels, annotations, envs) in resources, such as"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Namespace\nmetadata:\n  labels:\n    # To protect pods in this namespace from cascading deletion.\n    policy.kruise.io/delete-protection: Cascading\n"})}),"\n",(0,i.jsx)(n.h2,{id:"manager",children:"Manager"}),"\n",(0,i.jsxs)(n.p,{children:["Kruise-manager is a control plane component that runs controllers and webhooks, it is deployed by a Deployment in ",(0,i.jsx)(n.code,{children:"kruise-system"})," namespace."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get deploy -n kruise-system\nNAME                        READY   UP-TO-DATE   AVAILABLE   AGE\nkruise-controller-manager   2/2     2            2           4h6m\n\n$ kubectl get pod -n kruise-system -l control-plane=controller-manager\nNAME                                         READY   STATUS    RESTARTS   AGE\nkruise-controller-manager-68dc6d87cc-k9vg8   1/1     Running   0          4h6m\nkruise-controller-manager-68dc6d87cc-w7x82   1/1     Running   0          4h6m\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Logically, each controller like cloneset-controller or sidecarset-controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in the ",(0,i.jsx)(n.code,{children:"kruise-controller-manager-xxx"})," single Pod."]}),"\n",(0,i.jsx)(n.p,{children:"Besides controllers, this Pod also contains the admission webhooks for Kruise CRDs and Pod. It creates webhook configurations to configure which resources should be handled, and provides a Service for kube-apiserver calling."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get svc -n kruise-system\nNAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\nkruise-webhook-service   ClusterIP   172.24.9.234   <none>        443/TCP   4h9m\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"kruise-webhook-service"})," is much important for kube-apiserver calling."]}),"\n",(0,i.jsx)(n.h2,{id:"daemon",children:"Daemon"}),"\n",(0,i.jsx)(n.p,{children:"This is a new daemon component released since Kruise v0.8.0 version."}),"\n",(0,i.jsx)(n.p,{children:"It is deployed by DaemonSet, runs on every node and manages things like image pre-download, container restarting."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl get pod -n kruise-system -l control-plane=daemon\nNAME                  READY   STATUS    RESTARTS   AGE\nkruise-daemon-6hw6d   1/1     Running   0          4h7m\nkruise-daemon-d7xr4   1/1     Running   0          4h7m\nkruise-daemon-dqp8z   1/1     Running   0          4h7m\nkruise-daemon-dv96r   1/1     Running   0          4h7m\nkruise-daemon-q7594   1/1     Running   0          4h7m\nkruise-daemon-vnsbw   1/1     Running   0          4h7m\n"})})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>a});var r=s(96540);const i={},o=r.createContext(i);function t(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1914],{28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>a});var l=s(96540);const i={},r=l.createContext(i);function t(e){const n=l.useContext(r);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),l.createElement(r.Provider,{value:n},e.children)}},68435:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>t,metadata:()=>l,toc:()=>o});const l=JSON.parse('{"id":"cli-tool/kubectl-plugin","title":"Kubectl Plugin","description":"Kruise-tools provides commandline tools for kruise features, such as kubectl-kruise, which is a standard plugin of kubectl.","source":"@site/versioned_docs/version-v1.7/cli-tool/kubectl-plugin.md","sourceDirName":"cli-tool","slug":"/cli-tool/kubectl-plugin","permalink":"/docs/cli-tool/kubectl-plugin","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kubectl-plugin.md","tags":[],"version":"v1.7","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"Kubectl Plugin"},"sidebar":"docs","previous":{"title":"Other languages","permalink":"/docs/developer-manuals/other-languages"},"next":{"title":"Kustomize ResourceDistribution Generator","permalink":"/docs/cli-tool/kustomize-plugin"}}');var i=s(74848),r=s(28453);const t={title:"Kubectl Plugin"},a=void 0,c={},o=[{value:"Install",id:"install",level:2},{value:"Install via Krew",id:"install-via-krew",level:3},{value:"Install manually",id:"install-manually",level:3},{value:"Upgrade",id:"upgrade",level:2},{value:"Upgrade via Krew",id:"upgrade-via-krew",level:3},{value:"Upgrade manually",id:"upgrade-manually",level:3},{value:"Usage",id:"usage",level:2},{value:"expose",id:"expose",level:3},{value:"scale",id:"scale",level:3},{value:"rollout",id:"rollout",level:3},{value:"set",id:"set",level:3},{value:"migrate",id:"migrate",level:3},{value:"exec",id:"exec",level:3},{value:"scaledown",id:"scaledown",level:3}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"Kruise-tools"})," provides commandline tools for kruise features, such as ",(0,i.jsx)(n.code,{children:"kubectl-kruise"}),", which is a standard plugin of ",(0,i.jsx)(n.code,{children:"kubectl"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"install",children:"Install"}),"\n",(0,i.jsx)(n.h3,{id:"install-via-krew",children:"Install via Krew"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://krew.sigs.k8s.io/",children:"Krew"})," itself is a kubectl plugin that is installed and updated via Krew (yes, Krew self-hosts).\nFirst, ",(0,i.jsx)(n.a,{href:"https://krew.sigs.k8s.io/docs/user-guide/setup/install/",children:"install krew"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Run ",(0,i.jsx)(n.code,{children:"kubectl krew install kruise"})," to install kruise plugin via Krew."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Then you can use it with ",(0,i.jsx)(n.code,{children:"kubectl-kruise"})," or ",(0,i.jsx)(n.code,{children:"kubectl kruise"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl-kruise --help\n\n# or\n$ kubectl kruise --help\n"})}),"\n",(0,i.jsx)(n.h3,{id:"install-manually",children:"Install manually"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["You can simply download the binary from the ",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/releases",children:"releases"})," page. Currently ",(0,i.jsx)(n.code,{children:"linux"}),", ",(0,i.jsx)(n.code,{children:"darwin"}),"(OS X), ",(0,i.jsx)(n.code,{children:"windows"})," with ",(0,i.jsx)(n.code,{children:"x86_64"})," and ",(0,i.jsx)(n.code,{children:"arm64"})," are provided. If you are using some other systems or architectures, you have to download the  ",(0,i.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"kruise-tools"}),"  and execute ",(0,i.jsx)(n.code,{children:"make build"})," to build the binary."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Extract and move it to system PATH."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ tar xvf kubectl-kruise-darwin-amd64.tar.gz\n$ mv darwin-amd64/kubectl-kruise /usr/local/bin/\n"})}),"\n",(0,i.jsxs)(n.ol,{start:"3",children:["\n",(0,i.jsxs)(n.li,{children:["Then you can use it with ",(0,i.jsx)(n.code,{children:"kubectl-kruise"})," or ",(0,i.jsx)(n.code,{children:"kubectl kruise"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl-kruise --help\n\n# or\n$ kubectl kruise --help\n"})}),"\n",(0,i.jsx)(n.h2,{id:"upgrade",children:"Upgrade"}),"\n",(0,i.jsx)(n.h3,{id:"upgrade-via-krew",children:"Upgrade via Krew"}),"\n",(0,i.jsxs)(n.p,{children:["Run ",(0,i.jsx)(n.code,{children:"kubectl krew upgrade kruise"})," to upgrade kruise plugin via Krew."]}),"\n",(0,i.jsx)(n.h3,{id:"upgrade-manually",children:"Upgrade manually"}),"\n",(0,i.jsx)(n.p,{children:"Same to install plugin manually."}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.h3,{id:"expose",children:"expose"}),"\n",(0,i.jsx)(n.p,{children:"Take a workload(e.g. deployment, cloneset), service or pod and expose it as a new Kubernetes Service."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise expose cloneset nginx --port=80 --target-port=8000\n"})}),"\n",(0,i.jsx)(n.h3,{id:"scale",children:"scale"}),"\n",(0,i.jsx)(n.p,{children:"Set a new size for a Deployment, ReplicaSet, CloneSet, or Advanced StatefulSet."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise scale --replicas=3 cloneset nginx\n"})}),"\n",(0,i.jsxs)(n.p,{children:["It equals to ",(0,i.jsx)(n.code,{children:"kubectl scale --replicas=3 cloneset nginx"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"rollout",children:"rollout"}),"\n",(0,i.jsxs)(n.p,{children:["Available commands: ",(0,i.jsx)(n.code,{children:"history"}),", ",(0,i.jsx)(n.code,{children:"pause"}),", ",(0,i.jsx)(n.code,{children:"restart"}),", ",(0,i.jsx)(n.code,{children:"resume"}),", ",(0,i.jsx)(n.code,{children:"status"}),", ",(0,i.jsx)(n.code,{children:"undo"}),", ",(0,i.jsx)(n.code,{children:"approve"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'$ kubectl kruise rollout undo cloneset/nginx\n\n# built-in statefulsets\n$ kubectl kruise rollout status statefulsets/sts1\n\n# kruise statefulsets\n$ kubectl kruise rollout status statefulsets.apps.kruise.io/sts2\n\n# approve a kruise rollout resource named "rollout-demo" in "ns-demo" namespace\n$ kubectl-kruise rollout approve rollout-demo -n ns-demo\n'})}),"\n",(0,i.jsx)(n.h3,{id:"set",children:"set"}),"\n",(0,i.jsxs)(n.p,{children:["Available commands: ",(0,i.jsx)(n.code,{children:"env"}),", ",(0,i.jsx)(n.code,{children:"image"}),", ",(0,i.jsx)(n.code,{children:"resources"}),", ",(0,i.jsx)(n.code,{children:"selector"}),", ",(0,i.jsx)(n.code,{children:"serviceaccount"}),", ",(0,i.jsx)(n.code,{children:"subject"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl kruise set env cloneset/nginx STORAGE_DIR=/local\n\n$ kubectl kruise set image cloneset/nginx busybox=busybox nginx=nginx:1.9.1\n"})}),"\n",(0,i.jsx)(n.h3,{id:"migrate",children:"migrate"}),"\n",(0,i.jsx)(n.p,{children:"Currently it supports migrate from Deployment to CloneSet."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Create an empty CloneSet from an existing Deployment.\n$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create\n\n# Create a same replicas CloneSet from an existing Deployment.\n$ kubectl kruise migrate CloneSet --from Deployment -n default --dst-name deployment-name --create --copy\n\n# Migrate replicas from an existing Deployment to an existing CloneSet.\n$ kubectl-kruise migrate CloneSet --from Deployment -n default --src-name cloneset-name --dst-name deployment-name --replicas 10 --max-surge=2\n"})}),"\n",(0,i.jsx)(n.h3,{id:"exec",children:"exec"}),"\n",(0,i.jsx)(n.p,{children:"Support switch to raw terminal mode, sends stdin to 'bash' in working sidecar container from cloneset myclone or pod and sends stdout/stderr from 'bash' back to the client"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# exec sidecar in pod\n$ kubectl kruise exec mypod -S sidecar-container -i -t -- bash\n"})}),"\n",(0,i.jsx)(n.h3,{id:"scaledown",children:"scaledown"}),"\n",(0,i.jsx)(n.p,{children:"Scaledown a cloneset with selective Pods."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Scale down 2 with  selective pods\n$ kubectl kruise scaledown cloneset/nginx --pods pod-a,pod-b\n"})}),"\n",(0,i.jsxs)(n.p,{children:["It will decrease ",(0,i.jsx)(n.strong,{children:"replicas=replicas-2"})," of this cloneset and delete the specified pods."]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9976],{24756:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"user-manuals/containerlaunchpriority","title":"Container Launch Priority","description":"FEATURE STATE: Kruise v1.0.0","source":"@site/docs/user-manuals/containerlaunchpriority.md","sourceDirName":"user-manuals","slug":"/user-manuals/containerlaunchpriority","permalink":"/docs/next/user-manuals/containerlaunchpriority","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/containerlaunchpriority.md","tags":[],"version":"current","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{"title":"Container Launch Priority"},"sidebar":"docs","previous":{"title":"Job Sidecar Terminator","permalink":"/docs/next/user-manuals/jobsidecarterminator"},"next":{"title":"WorkloadSpread","permalink":"/docs/next/user-manuals/workloadspread"}}');var i=t(74848),o=t(28453);const a={title:"Container Launch Priority"},s=void 0,c={},l=[{value:"Usage",id:"usage",level:2},{value:"Start by containers ordinal",id:"start-by-containers-ordinal",level:3},{value:"Start by configurable sequence",id:"start-by-configurable-sequence",level:3},{value:"Requirement",id:"requirement",level:2},{value:"Implementation Details",id:"implementation-details",level:2}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.0.0"]}),"\n",(0,i.jsxs)(n.p,{children:["Container Launch Priority provides a way to help users ",(0,i.jsx)(n.strong,{children:"control the sequence of containers start"})," in a Pod."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Usually the sequences of containers start and stop are controlled by Kubelet. Kubernetes used to have a ",(0,i.jsx)(n.a,{href:"https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/753-sidecar-containers",children:"KEP"}),", which plans to add a type field for container to identify the priority of start and stop.\nHowever, it has been refused because of ",(0,i.jsx)(n.a,{href:"https://github.com/kubernetes/enhancements/issues/753#issuecomment-713471597",children:"sig-node thought it may bring a huge change to code"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Note that the feature works for Pod, ",(0,i.jsx)(n.strong,{children:"no matter what kind of owner it belongs to"}),", which means Deployment, CloneSet or any other Workloads are all supported."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Note:"})," If your kubernetes version >= 1.28, it is recommended that you use k8s native ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers",children:"Sidecar Container"})," to solve the above problem."]}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.h3,{id:"start-by-containers-ordinal",children:"Start by containers ordinal"}),"\n",(0,i.jsx)(n.p,{children:"It only requires you to add an annotation in Pod:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  annotations:\n    apps.kruise.io/container-launch-priority: Ordered\nspec:\n  containers:\n  - name: sidecar\n    # ...\n  - name: main\n    # ...\n"})}),"\n",(0,i.jsx)(n.p,{children:"Then Kruise will ensure the former container (sidecar) to be started before the later one (main)."}),"\n",(0,i.jsx)(n.h3,{id:"start-by-configurable-sequence",children:"Start by configurable sequence"}),"\n",(0,i.jsxs)(n.p,{children:["You should set the priority env ",(0,i.jsx)(n.code,{children:"KRUISE_CONTAINER_PRIORITY"})," in container:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nspec:\n  containers:\n  - name: main\n    # ...\n  - name: sidecar\n    env:\n    - name: KRUISE_CONTAINER_PRIORITY\n      value: "1"\n    # ...\n'})}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["The range of the value is ",(0,i.jsx)(n.code,{children:"[-2147483647, 2147483647]"}),". Defaults to ",(0,i.jsx)(n.code,{children:"0"})," if no such env exists."]}),"\n",(0,i.jsx)(n.li,{children:"The container with higher priority will be guaranteed to start before the others with lower priority."}),"\n",(0,i.jsx)(n.li,{children:"The containers with same priority have no limit to their start sequence."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"requirement",children:"Requirement"}),"\n",(0,i.jsxs)(n.p,{children:["ContainerLaunchPriority requires ",(0,i.jsx)(n.code,{children:"PodWebhook"})," feature-gate to be enabled, which is the default state."]}),"\n",(0,i.jsx)(n.h2,{id:"implementation-details",children:"Implementation Details"}),"\n",(0,i.jsxs)(n.p,{children:["Kruise webhook will admit for all pod creation.\nWhen webhook finds a pod has ",(0,i.jsx)(n.code,{children:"apps.kruise.io/container-launch-priority"})," annotation or ",(0,i.jsx)(n.code,{children:"KRUISE_CONTAINER_PRIORITY"})," in env,\nit will inject ",(0,i.jsx)(n.code,{children:"KRUISE_CONTAINER_BARRIER"})," env into containers."]}),"\n",(0,i.jsxs)(n.p,{children:["The value of KRUISE_CONTAINER_BARRIER is from a ConfigMap named ",(0,i.jsx)(n.code,{children:"{pod-name}-barrier"}),", and the key is related to the priority of each container."]}),"\n",(0,i.jsx)(n.p,{children:"For example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nspec:\n  containers:\n  - name: main\n    # ...\n    env:\n    - name: KRUISE_CONTAINER_BARRIER\n      valueFrom:\n        configMapKeyRef:\n          name: {pod-name}-barrier\n          key: "p_0"\n  - name: sidecar\n    env:\n    - name: KRUISE_CONTAINER_PRIORITY\n      value: "1"\n    - name: KRUISE_CONTAINER_BARRIER\n      valueFrom:\n        configMapKeyRef:\n          name: {pod-name}-barrier\n          key: "p_1"\n    # ...\n'})}),"\n",(0,i.jsx)(n.p,{children:"Kruise controller will create an empty ConfigMap for this pod, then add the keys into ConfigMap according to the priorities and containerStatuses of pod."}),"\n",(0,i.jsxs)(n.p,{children:["As the example before, controller will firstly add ",(0,i.jsx)(n.code,{children:"p_1"})," key into ConfigMap, waiting for sidecar container running and ready, and finally add ",(0,i.jsx)(n.code,{children:"p_0"})," into ConfigMap to let Kubelet start main container."]}),"\n",(0,i.jsxs)(n.p,{children:["Besides, you may see ",(0,i.jsx)(n.code,{children:"CreateContainerConfigError"})," state when you use ",(0,i.jsx)(n.code,{children:"kubectl get"})," during pod is starting with priority.\nIt is because Kubelet can't find some keys at that moment, and will be fine after all container in Pod started."]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>s});var r=t(96540);const i={},o=r.createContext(i);function a(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5321],{28453:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>o});var r=i(96540);const s={},t=r.createContext(s);function a(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),r.createElement(t.Provider,{value:n},e.children)}},39028:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"user-manuals/jobsidecarterminator","title":"Job Sidecar Terminator","description":"FEATURE STATE: Kruise v1.4.0","source":"@site/docs/user-manuals/jobsidecarterminator.md","sourceDirName":"user-manuals","slug":"/user-manuals/jobsidecarterminator","permalink":"/docs/next/user-manuals/jobsidecarterminator","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/jobsidecarterminator.md","tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Job Sidecar Terminator"},"sidebar":"docs","previous":{"title":"SidecarSet","permalink":"/docs/next/user-manuals/sidecarset"},"next":{"title":"Container Launch Priority","permalink":"/docs/next/user-manuals/containerlaunchpriority"}}');var s=i(74848),t=i(28453);const a={title:"Job Sidecar Terminator"},o=void 0,d={},c=[{value:"Requirements",id:"requirements",level:2},{value:"Usage",id:"usage",level:2},{value:"For Pods Running on Normal Nodes",id:"for-pods-running-on-normal-nodes",level:3},{value:"For Pods Running on Virtual Nodes",id:"for-pods-running-on-virtual-nodes",level:3},{value:"Step 1: Prepare a special image",id:"step-1-prepare-a-special-image",level:4},{value:"Step 2: Config your sidecar container",id:"step-2-config-your-sidecar-container",level:4},{value:"Ignore sidecar container with non-zero exit code",id:"ignore-sidecar-container-with-non-zero-exit-code",level:3},{value:"Notes",id:"notes",level:3}];function l(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.4.0"]}),"\n",(0,s.jsxs)(n.p,{children:["In Kubernetes world, for job workload, one may expect pods enter ",(0,s.jsx)(n.code,{children:"Completed"})," phase once the main container exited. However, when these pods have long-running sidecar containers, these sidecars will actually remain running after the main containers completed."]}),"\n",(0,s.jsx)(n.p,{children:"To solve such problem, job sidecar terminator controller watches and terminates sidecar containers for such job-type Pods when its main containers completed."}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Note:"})," If your kubernetes version >= 1.28, it is recommended that you use k8s native ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers",children:"Sidecar Container"})," to solve the above problem."]}),"\n",(0,s.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Enabled ",(0,s.jsx)(n.code,{children:"SidecarTerminator"})," feature gate when installing/upgrading Kruise (defaults to ",(0,s.jsx)(n.code,{children:"disabled"}),")."]}),"\n",(0,s.jsxs)(n.li,{children:["Enabled ",(0,s.jsx)(n.code,{children:"KruiseDaemon"})," feature gate when installing/upgrading Kruise (defaults to ",(0,s.jsx)(n.code,{children:"enabled"}),")."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(n.h3,{id:"for-pods-running-on-normal-nodes",children:"For Pods Running on Normal Nodes"}),"\n",(0,s.jsxs)(n.p,{children:["It is very easily to use this feature if your Pods run on normal nodes, you just need to add a special env to the sidecar containers you want to terminate in the Pods, and Kruise will terminate them using ",(0,s.jsx)(n.a,{href:"/docs/next/user-manuals/containerrecreaterequest",children:"CRR"})," at the right time:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'kind: Job\nspec:\n  template:\n    spec:\n      containers:\n        - name: sidecar\n          env:\n            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT\n              value: "true"\n        - name: main\n... ...\n'})}),"\n",(0,s.jsx)(n.h3,{id:"for-pods-running-on-virtual-nodes",children:"For Pods Running on Virtual Nodes"}),"\n",(0,s.jsxs)(n.p,{children:["For certain serverless container platforms like ",(0,s.jsx)(n.a,{href:"https://www.aliyun.com/product/eci",children:"ECI"})," and ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/cn/fargate/",children:"Fargate"}),", their Pods run on ",(0,s.jsx)(n.a,{href:"https://virtual-kubelet.io/#:~:text=Virtual%20Kubelet%20is%20an%20open,as%20serverless%20cloud%20container%20platforms.",children:"Virtual-Kubelet"})," instead of normal nodes, which means Kruise cannot terminate its sidecar using CRR because Kruise Daemon cannot run on virtual-kubelet.\nHowever, we can address this issue by utilizing the pod in-place-update mechanism offered by native Kubernetes. If a sidecar container needs to be terminated, we can replace the original sidecar image with an image that exits as soon as it is pulled."]}),"\n",(0,s.jsx)(n.h4,{id:"step-1-prepare-a-special-image",children:"Step 1: Prepare a special image"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"This image should exit as soon as it is pulled and started."}),"\n",(0,s.jsx)(n.li,{children:"This image should be compatible with the commands and args of original sidecar container."}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"step-2-config-your-sidecar-container",children:"Step 2: Config your sidecar container"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'kind: Job\nspec:\n  template:\n    spec:\n      containers:\n        - name: sidecar\n          env:\n            - name: KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE\n              value: "example/quick-exit:v1.0.0"\n        - name: main\n... ...\n'})}),"\n",(0,s.jsxs)(n.p,{children:["Replace ",(0,s.jsx)(n.code,{children:'"example/quick-exit:v1.0.0"'})," with your prepared image."]}),"\n",(0,s.jsx)(n.h3,{id:"ignore-sidecar-container-with-non-zero-exit-code",children:"Ignore sidecar container with non-zero exit code"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,s.jsxs)(n.p,{children:["In previous versions, the sidecar container was required to be able to accept the ",(0,s.jsx)(n.code,{children:"SIGTERM"})," signal and to ensure that the exit code was ",(0,s.jsx)(n.code,{children:"0"}),".\nIf the sidecar container had non-zero exit code, it would result in Pod Phase=Failed."]}),"\n",(0,s.jsx)(n.p,{children:"As of Kruise 1.6.0, Kruise will ignore sidecar container with non-zero exit code, and Pod Phase only depend on the success or failure of the main containers."}),"\n",(0,s.jsx)(n.h3,{id:"notes",children:"Notes"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Your sidecar container must respond the ",(0,s.jsx)(n.code,{children:"SIGTERM"})," signal, and the entrypoint should ",(0,s.jsx)(n.code,{children:"exit 0"})," when received this signal."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["This feature can handle the Pods with ",(0,s.jsx)(n.code,{children:"Never"}),"/",(0,s.jsx)(n.code,{children:"OnFailure"})," restart policy, and doesn't care which type of job controllers they're controlled by."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The container with env ",(0,s.jsx)(n.code,{children:"KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT"})," will be treated as sidecars, the others as main containers."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The sidecars will be terminated when ",(0,s.jsx)(n.strong,{children:"ALL"})," main containers completed."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["In ",(0,s.jsx)(n.code,{children:"Never"})," restart policy settings, main container will be treated as ",(0,s.jsx)(n.code,{children:"completed"})," once it exit."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["In ",(0,s.jsx)(n.code,{children:"OnFailure"})," restart policy settings, main container will be treated as ",(0,s.jsx)(n.code,{children:"completed"})," once it exit and exit code must be ",(0,s.jsx)(n.code,{children:"0"}),"."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["In Pods on real nodes mode, ",(0,s.jsx)(n.code,{children:"KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT"})," has a higher priority than ",(0,s.jsx)(n.code,{children:"KRUISE_TERMINATE_SIDECAR_WHEN_JOB_EXIT_WITH_IMAGE"})]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}}}]);
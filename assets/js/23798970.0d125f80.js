"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2726],{6394:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/containerrecreaterequest-f690e891609591c68e231c23212204ca.png"},23577:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"user-manuals/containerrecreaterequest","title":"Container Restart","description":"FEATURE STATE: Kruise v0.9.0","source":"@site/versioned_docs/version-v1.7/user-manuals/containerrecreaterequest.md","sourceDirName":"user-manuals","slug":"/user-manuals/containerrecreaterequest","permalink":"/docs/user-manuals/containerrecreaterequest","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/containerrecreaterequest.md","tags":[],"version":"v1.7","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{"title":"Container Restart"},"sidebar":"docs","previous":{"title":"UnitedDeployment","permalink":"/docs/user-manuals/uniteddeployment"},"next":{"title":"ImagePullJob","permalink":"/docs/user-manuals/imagepulljob"}}');var r=t(74848),i=t(28453);const a={title:"Container Restart"},o=void 0,c={},d=[{value:"Usage",id:"usage",level:2},{value:"Submit request",id:"submit-request",level:3},{value:"Check request status",id:"check-request-status",level:3},{value:"Implementation",id:"implementation",level:2}];function l(e){const n={code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.9.0"]}),"\n",(0,r.jsxs)(n.p,{children:["ContainerRecreateRequest provides a way to let users ",(0,r.jsx)(n.strong,{children:"restart/recreate"})," one or more containers in an existing Pod."]}),"\n",(0,r.jsxs)(n.p,{children:["Just like the in-place update provided in Kruise, during container recreation, other containers in the same Pod are still running.\nOnce the recreation is completed, nothing changes in the Pod except that the recreated container's restartCount is increased.\nNote that the files written into the ",(0,r.jsx)(n.strong,{children:"rootfs of the previous container will be lost"}),", but the data in volume mounts remain."]}),"\n",(0,r.jsxs)(n.p,{children:["This feature relies on ",(0,r.jsx)(n.code,{children:"kruise-daemon"})," to stop the container in Pod.\nSo if the ",(0,r.jsx)(n.code,{children:"KruiseDaemon"})," feature-gate is closed, ContainerRecreateRequest will also be disabled."]}),"\n",(0,r.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(n.h3,{id:"submit-request",children:"Submit request"}),"\n",(0,r.jsxs)(n.p,{children:["Create a ",(0,r.jsx)(n.code,{children:"ContainerRecreateRequest"})," (short name ",(0,r.jsx)(n.code,{children:"CRR"}),") for each Pod container recreation:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ContainerRecreateRequest\nmetadata:\n  namespace: pod-namespace\n  name: xxx\nspec:\n  podName: pod-name\n  containers:       # list of container name that need to be recreated, at least one\n  - name: app\n  - name: sidecar\n  strategy:\n    failurePolicy: Fail                 # or 'Ignore'. If 'Fail', the CRR will abort when one container failed to stop or recreate\n    orderedRecreate: false              # 'true' indicates to recreate the next container only if the previous one has recreated completely\n    terminationGracePeriodSeconds: 30   # optional duration in seconds to wait the container terminating gracefully\n    unreadyGracePeriodSeconds: 3        # duration for the Pod is marked as not ready before its preStop hook is executed and it is stopped\n    minStartedSeconds: 10               # the new container will be consider as Succeeded only if it has started over minStartedSeconds\n  activeDeadlineSeconds: 300        # the CRR will be marked as Completed immediately if it has ran over deadline duration since created\n  ttlSecondsAfterFinished: 1800     # the time CRR remain as completed before the CRR is deleted\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.em,{children:["All fields in ",(0,r.jsx)(n.code,{children:"strategy"})," and the ",(0,r.jsx)(n.code,{children:"activeDeadlineSeconds"}),"/",(0,r.jsx)(n.code,{children:"ttlSecondsAfterFinished"})," in ",(0,r.jsx)(n.code,{children:"spec"})," are optional."]})}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Typically, containers in list will be stopped one by one, but they may be recreating together, unless the ",(0,r.jsx)(n.code,{children:"orderedRecreate"})," is ",(0,r.jsx)(n.code,{children:"true"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["The ",(0,r.jsx)(n.code,{children:"unreadyGracePeriodSeconds"})," depends on a new feature-gate named ",(0,r.jsx)(n.code,{children:"KruisePodReadinessGate"}),", which indicates to inject a readinessGate during each Pod creating.\nOtherwise ",(0,r.jsx)(n.code,{children:"unreadyGracePeriodSeconds"})," can only work for those new Pods created by Kruise that have the readinessGate."]}),"\n",(0,r.jsxs)(n.li,{children:["If users set ",(0,r.jsx)(n.code,{children:"ttlSecondsAfterFinished"}),", then CRR will automatically be deleted after completed over this time.\nOtherwise, users have to delete the CRR manually."]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# for commandline you can\n$ kubectl get containerrecreaterequest -n pod-namespace\n# or just short name\n$ kubectl get crr -n pod-namespace\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.4.0"]}),"\n",(0,r.jsx)(n.p,{children:"When creating CRR resources, if the container is still in the process of starting, CRR will not restart the container again.\nIf you want to force a container restart, you can use the following field:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ContainerRecreateRequest\nspec:\n  ...\n   strategy:\n     forceRecreate: true # ForceRecreate indicates whether to force kill the container even if the previous container is starting.\n"})}),"\n",(0,r.jsx)(n.h3,{id:"check-request-status",children:"Check request status"}),"\n",(0,r.jsx)(n.p,{children:"Status of CRR looks like this:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'status:\n  completionTime: "2021-03-22T11:53:48Z"\n  containerRecreateStates:\n  - name: app\n    phase: Succeeded\n  - name: sidecar\n    phase: Succeeded\n  phase: Completed\n'})}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"status.phase"})," can be:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Pending"}),": the CRR waits to be executed"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Recreating"}),": the CRR is executing"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Completed"}),": this CRR has completed, and ",(0,r.jsx)(n.code,{children:"status.completionTime"})," is the timestamp of completion"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Note that ",(0,r.jsx)(n.code,{children:"status.phase=Completed"})," does not mean all containers in CRR have recreated successfully.\nUsers should find the information in ",(0,r.jsx)(n.code,{children:"status.containerRecreateStates"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"status.containerRecreateStates[x].phase"})," can be:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Pending"}),": this container waits to recreate"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Recreating"}),": this container is recreating"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Failed"}),": this container has failed to recreate"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Succeeded"}),": this container has succeeded to recreate"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.strong,{children:["When the CRR has completed, only the containers in ",(0,r.jsx)(n.code,{children:"Succeeded"})," phase are successfully recreated."]})}),"\n",(0,r.jsx)(n.h2,{id:"implementation",children:"Implementation"}),"\n",(0,r.jsxs)(n.p,{children:["When users create a CRR, Kruise webhook will inject the current containerID and restartCount into ",(0,r.jsx)(n.code,{children:"spec.containers[x].statusContext"}),".\nAnd, when ",(0,r.jsx)(n.strong,{children:"kruise-daemon"})," starts to execute, it will skip the container if its containerID is not equal to the one in statusContext or the restartCount has been bigger,\nwhich means the container has already been recreated (maybe by in-place update)."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"ContainerRecreateRequest",src:t(6394).A+"",width:"1924",height:"986"})}),"\n",(0,r.jsxs)(n.p,{children:["Typically, ",(0,r.jsx)(n.strong,{children:"kruise-daemon"})," will stop the container with or without preStop hook, then ",(0,r.jsx)(n.strong,{children:"kubelet"})," will create a new container and start again.\nFinally, ",(0,r.jsx)(n.strong,{children:"kruise-daemon"})," will report the container phase as ",(0,r.jsx)(n.code,{children:"Succeeded"})," only if the new container has started over ",(0,r.jsx)(n.code,{children:"minStartedSeconds"})," duration."]}),"\n",(0,r.jsx)(n.p,{children:"If the recreation occurs with an in-place update in the same time:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["If ",(0,r.jsx)(n.strong,{children:"Kubelet"})," has stopped or recreated the container because of in-place update, ",(0,r.jsx)(n.strong,{children:"kruise-daemon"})," will consider it already recreated."]}),"\n",(0,r.jsxs)(n.li,{children:["If ",(0,r.jsx)(n.strong,{children:"kruise-daemon"})," stops the container, ",(0,r.jsx)(n.strong,{children:"Kubelet"})," will keep to in-place update the container to the new image."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"If multiple ContainerRecreateRequests are submitted for one Pod, they will be executed one by one."})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>o});var s=t(96540);const r={},i=s.createContext(r);function a(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);
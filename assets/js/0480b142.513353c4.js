"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8070],{28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>s});var o=t(96540);const i={},r=o.createContext(i);function a(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),o.createElement(r.Provider,{value:n},e.children)}},85585:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>o,toc:()=>c});const o=JSON.parse('{"id":"faq","title":"FAQ","description":"Installation and Uninstallation","source":"@site/docs/faq.md","sourceDirName":".","slug":"/faq","permalink":"/docs/next/faq","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/faq.md","tags":[],"version":"current","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"FAQ"},"sidebar":"docs","previous":{"title":"Kustomize Schema Generator","permalink":"/docs/next/cli-tool/kustomize-schema-generator"}}');var i=t(74848),r=t(28453);const a={title:"FAQ"},s=void 0,l={},c=[{value:"Installation and Uninstallation",id:"installation-and-uninstallation",level:2},{value:"Uninstall Protection",id:"uninstall-protection",level:3},{value:"Q: Get error <code>job kruise-finalizer failed: BackoffLimitExceeded</code> when Helm uninstall Kruise 1.7.3 or above",id:"q-get-error-job-kruise-finalizer-failed-backofflimitexceeded-when-helm-uninstall-kruise-173-or-above",level:4},{value:"Pod Creation/Update Errors",id:"pod-creationupdate-errors",level:2},{value:"<strong>Q</strong>: The operation on the pod fails and the following error occurs. What is the reason?",id:"q-the-operation-on-the-pod-fails-and-the-following-error-occurs-what-is-the-reason",level:4}];function d(e){const n={blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"installation-and-uninstallation",children:"Installation and Uninstallation"}),"\n",(0,i.jsx)(n.h3,{id:"uninstall-protection",children:"Uninstall Protection"}),"\n",(0,i.jsxs)(n.h4,{id:"q-get-error-job-kruise-finalizer-failed-backofflimitexceeded-when-helm-uninstall-kruise-173-or-above",children:["Q: Get error ",(0,i.jsx)(n.code,{children:"job kruise-finalizer failed: BackoffLimitExceeded"})," when Helm uninstall Kruise 1.7.3 or above"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"Uninstallation will lead to the deletion of all resources under Kruise, including webhook configurations, services,\nnamespace, CRDs, CRs, and all Pods under Kruise workloads. Please proceed with caution!"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"A: Since 1.7.3, Kruise installed via Helm will automatically detect the existence of Kruise CRs during uninstallation\nusing a pre-delete hook. If any CRs exist, the uninstall process will be blocked. You need to manually clean up the\nKruise CRs before you can uninstall Kruise."}),"\n",(0,i.jsx)(n.p,{children:"You can check which Kruise CRs are blocking the uninstallation in the cluster as follows:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"kubectl get clone -A \nkubectl get asts -A \nkubectl get ads -A\n"})}),"\n",(0,i.jsx)(n.p,{children:"If these Kruise workloads and their managed Pods still need to be retained, please carefully evaluate the uninstallation\noperation for Kruise."}),"\n",(0,i.jsx)(n.h2,{id:"pod-creationupdate-errors",children:"Pod Creation/Update Errors"}),"\n",(0,i.jsxs)(n.h4,{id:"q-the-operation-on-the-pod-fails-and-the-following-error-occurs-what-is-the-reason",children:[(0,i.jsx)(n.strong,{children:"Q"}),": The operation on the pod fails and the following error occurs. What is the reason?"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'Error from server (InternalError): Internal error occurred: failed calling webhook "vpod.kb.io": failed to call webhook: Post "https://kruise-webhook-service.kruise-system.svc:443/validate-pod?timeout=10s": no endpoints available for service "kruise-webhook-service"\n'})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"A"}),": Check whether the kruise-controller-manager pod under kruise-system is in a healthy state. When it is abnormal (\npending/not ready/no instance, etc.), the corresponding validate webhook will not be able to find the corresponding\nendpoints, causing the verification to fail, and then the pod operation will fail.\nThe solution is to restore the kruise-controller-manager pod to a healthy state according to the prompts; or temporarily\ndelete the validatingwebhookconfiguration named ",(0,i.jsx)(n.code,{children:"kruise-validating-webhook-configuration"})," in the cluster, and then\nre-create it after the cluster is normal."]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);
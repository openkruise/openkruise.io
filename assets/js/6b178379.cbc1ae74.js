"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6424],{28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>o});var s=t(96540);const a={},r=s.createContext(a);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:n},e.children)}},56143:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>p});const s=JSON.parse('{"id":"best-practices/gitops-with-kruise","title":"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet","description":"What is GitOps\uff1f","source":"@site/versioned_docs/version-v1.7/best-practices/gitops-with-kruise.md","sourceDirName":"best-practices","slug":"/best-practices/gitops-with-kruise","permalink":"/docs/v1.7/best-practices/gitops-with-kruise","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/gitops-with-kruise.md","tags":[],"version":"v1.7","lastUpdatedBy":"ls-2018","lastUpdatedAt":1743941661000,"frontMatter":{"title":"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet"},"sidebar":"docs","previous":{"title":"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download","permalink":"/docs/v1.7/best-practices/ci-pipeline-image-predownload"},"next":{"title":"Best Practice for Managing Log Collection Sidecar Containers","permalink":"/docs/v1.7/best-practices/log-container-sidecarset"}}');var a=t(74848),r=t(28453);const i={title:"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet"},o=void 0,l={},p=[{value:"What is GitOps\uff1f",id:"what-is-gitops",level:2},{value:"GitOps + OpenKruise CloneSet Practice",id:"gitops--openkruise-cloneset-practice",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Install OpenKruise\uff08Enable: TemplateNoDefaults\uff09",id:"install-openkruiseenable-templatenodefaults",level:4},{value:"CloneSet Deploy Stateless Application",id:"cloneset-deploy-stateless-application",level:3},{value:"Argo-cd CloneSet Health Check",id:"argo-cd-cloneset-health-check",level:3},{value:"Tekton Pipeline + Argo-cd",id:"tekton-pipeline--argo-cd",level:3},{value:"Run Tekton Pipeline",id:"run-tekton-pipeline",level:3},{value:"Summary",id:"summary",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h2,{id:"what-is-gitops",children:"What is GitOps\uff1f"}),"\n",(0,a.jsx)(n.p,{children:"GitOps is an approach to continuous delivery. Its core idea is to store the declarative infrastructure and applications of an application in a Git repository."}),"\n",(0,a.jsx)(n.p,{children:"With Git at the core of the delivery pipeline, every developer can submit Pull Requests and use Git to accelerate and simplify application deployment and maintenance tasks for Kubernetes. By using a simple tool like Git, developers can more efficiently focus on creating new features rather than operations-related tasks (e.g., application installation, configuration, migration, etc.)."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"argo-cd",src:t(61010).A+"",width:"1080",height:"712"})}),"\n",(0,a.jsx)(n.h2,{id:"gitops--openkruise-cloneset-practice",children:"GitOps + OpenKruise CloneSet Practice"}),"\n",(0,a.jsx)(n.h3,{id:"requirements",children:"Requirements"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16."}),"\n",(0,a.jsxs)(n.li,{children:["Install Tekton, Reference ",(0,a.jsx)(n.a,{href:"https://tekton.dev/docs/getting-started/",children:"Official Documents"}),",\nTekton is a Google open source Kubernetes native framework for creating continuous integration and continuous deployment/delivery (CI/CD) systems."]}),"\n",(0,a.jsxs)(n.li,{children:["Install Argo-cd, Reference ",(0,a.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/stable/getting_started/",children:"Official Documents"}),", Argo-cd is a declarative GitOps continuous delivery tool for Kubernetes."]}),"\n"]}),"\n",(0,a.jsx)(n.h4,{id:"install-openkruiseenable-templatenodefaults",children:"Install OpenKruise\uff08Enable: TemplateNoDefaults\uff09"}),"\n",(0,a.jsxs)(n.p,{children:["Openkruise installed by default will inject the default value of pod / PVC template, which will conflict with the sync judgment logic of Argo CD.\nTherefore, when installing openkruise, you need to open gates ",(0,a.jsx)(n.strong,{children:"TemplateNoDefaults"}),", as follows:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'# Firstly add openkruise charts repository if you haven\'t do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Install the latest version.\n$ helm install kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"\n\n# Those that have been installed need to be upgraded\n$ helm upgrade kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"cloneset-deploy-stateless-application",children:"CloneSet Deploy Stateless Application"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"CloneSet is the ability provided by OpenKruise to efficiently manage stateless applications, it is similar to the official workload: Deployment,\nbut offers many enhancements such as InPlace Update, Batch Release, etc."})," Please refer to the documentation ",(0,a.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/cloneset",children:"CloneSet"}),".\nThis article provides a helloworld http service ",(0,a.jsx)(n.a,{href:"https://github.com/zmberg/samples/tree/hello_world/helloworld",children:"demo"}),", It contains Helm Charts, and the cloneSet configuration is shown below:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  name: helloworld-server\n  labels:\n    app: helloworld-server\nspec:\n  updateStrategy:\n    # CloneSet will try to in-place update Pod instead of recreating them if possible\n    type: InPlaceIfPossible\n    # Batch release, currently updating only one Pod\n    partition: 1\n  replicas: 2\n  selector:\n    matchLabels:\n      app: helloworld-server\n  template:\n    metadata:\n      labels:\n        app: helloworld-server\n    spec:\n      containers:\n      - name: helloworld\n        image: "openkruise/kruise:hello_world-d92ae174b"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"argo-cd-cloneset-health-check",children:"Argo-cd CloneSet Health Check"}),"\n",(0,a.jsxs)(n.p,{children:["Configure CloneSet Argo-cd ",(0,a.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks",children:"Custom CRD Health Checks"}),",\n",(0,a.jsx)(n.strong,{children:"With this configuration argo-cd is able to perform a healthy check of the CloneSet, such as whether the CloneSet is published and whether the Pods are ready,"})," as follows\uff1a"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\n  name: argocd-cm\n  namespace: argocd\ndata:\n  resource.customizations.health.apps.kruise.io_CloneSet: |\n    hs = {}\n    -- if paused\n    if obj.spec.updateStrategy.paused then\n      hs.status = "Suspended"\n      hs.message = "CloneSet is Suspended"\n      return hs\n    end\n\n    -- check cloneSet status\n    if obj.status ~= nil then\n      if obj.status.observedGeneration < obj.metadata.generation then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: observed cloneSet generation less then desired generation"\n        return hs\n      end\n\n      if obj.status.updatedReplicas < obj.spec.replicas then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      if obj.status.updatedReadyReplicas < obj.status.updatedReplicas then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      hs.status = "Healthy"\n      return hs\n    end\n\n    -- if status == nil\n    hs.status = "Progressing"\n    hs.message = "Waiting for cloneSet"\n    return hs\n'})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"OpenKruise internal CRD resources in addition to CloneSet, others such as: Advanced StatefulSet, SidecarSet, etc. can be similar to the above way to achieve Custom Resource Health."})}),"\n",(0,a.jsx)(n.h3,{id:"tekton-pipeline--argo-cd",children:"Tekton Pipeline + Argo-cd"}),"\n",(0,a.jsxs)(n.p,{children:["Argo-CD together with Tekton Pipeline is a popular DevOps practice and integrate well with CI process.\nSuch practice requires storing the Argo-cd admin secret in K8S Secret CRD (",(0,a.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli",children:"method of obtaining secret"}),"), which in turn can be used in Tekton Pipeline, as follows:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\ndata:\n  # argo-cd admin secret\n  username: xxxxx\n  password: xxxxx\n  server: xxxxx\nkind: Secret\nmetadata:\n  name: argosecret\n---\napiVersion: tekton.dev/v1beta1\nkind: Task\nmetadata:\n  labels:\n    app: helloworld\n  name: helloworld-argocd\nspec:\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  - name: app_ns\n    type: string\n  - name: k8s_server\n    type: string\n  steps:\n  - name: argocd-deploy\n    image: argoproj/argocd:latest\n    command:\n    - sh\n    args:\n    - \'-ce\'\n    - >\n      set -e\n\n      echo "upgrade app $(params.app_name)"; username=`cat /var/secret/username`; password=`cat /var/secret/password`; server=`cat /var/secret/server`;\n\n      argocd login ${server} --insecure --username ${username} --password ${password}\n\n      argocd app create $(params.app_name) --upsert --repo $(params.gitrepositoryurl) --path $(params.app_name)/charts --dest-namespace $(params.app_ns) --dest-server $(params.k8s_server) --revision $(params.branch) --helm-set image.repository=$(params.docker_repo) --helm-set image.tag=$(params.branch)-$(params.short_sha) --helm-set installation.namespace=$(params.app_ns)\n\n      argocd app list; argocd app sync $(params.app_name)\n\n      argocd app wait $(params.app_name) --health\n    volumeMounts:\n    - name: argocd-secret\n      mountPath: "/var/secret"\n  volumes:\n  - name: argocd-secret\n    secret:\n      secretName: argosecret\n---\napiVersion: tekton.dev/v1beta1\nkind: Pipeline\nmetadata:\n  name: helloworld-pipeline\nspec:\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  - name: app_ns\n    type: string\n  - name: k8s_server\n    type: string\n  # Here you can connect with CI process to realize CI/CD Pipeline\n  tasks:\n  - name: helloworld-argocd\n    taskRef:\n      name: helloworld-argocd\n    params:\n    - name: gitrepositoryurl\n      value: $(params.gitrepositoryurl)\n    - name: short_sha\n      value: $(params.short_sha)\n    - name: branch\n      value: $(params.branch)\n    - name: docker_repo\n      value: $(params.docker_repo)\n    - name: app_name\n      value: $(params.app_name)\n    - name: app_ns\n      value: $(params.app_ns)\n    - name: k8s_server\n      value: $(params.k8s_server)\n'})}),"\n",(0,a.jsx)(n.h3,{id:"run-tekton-pipeline",children:"Run Tekton Pipeline"}),"\n",(0,a.jsx)(n.p,{children:"Configure PipelineRun CRD, and kubectl apply -f in k8s cluster to run Pipeline, as follows:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: tekton.dev/v1beta1\nkind: PipelineRun\nmetadata:\n  name: helloworld-pipeline-run-1\nspec:\n  pipelineRef:\n    name: helloworld-pipeline\n  params:\n  - name: gitrepositoryurl\n    value: https://github.com/zmberg/samples.git\n  - name: branch\n    value: hello_world\n  - name: short_sha\n    value: d92ae174b\n  - name: docker_repo\n    value: zhaomingshan/kruise\n  - name: app_name\n    value: helloworld\n  - name: app_ns\n    value: helloworld\n  - name: k8s_server\n    value: https://kubernetes.default.svc\n"})}),"\n",(0,a.jsx)(n.p,{children:"The results can be viewed via the argo-cd cli, as follows:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"guestbook",src:t(93086).A+"",width:"1226",height:"628"})}),"\n",(0,a.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,a.jsx)(n.p,{children:"OpenKruise is more of a Kubernetes level extended capability, such as in-place upgrade, preImageDownload, etc.\nSo many community users using OpenKruise in production environments have some additional costs, need to integrate or self-research container PaaS.\nThe main purpose of this article is to combine some of the best Paas solutions in the community with OpenKruise,\nso that as many people as possible get to enjoy the dividends of cloud-native at a lower cost."}),"\n",(0,a.jsx)(n.p,{children:'Argo-cd is a very good product for the community, and it integrate well with OpenKruise\'s CRD resources,\nwe hope that this article can intrigue more ideas from the community about "How to use OpenKruise easily".\nWe will try to integrate OpenKruise with other CI/CD pipelines later to better implement DevOps practice.'})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},61010:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/argocd-9b2263b3527910a6a839509239e3ebbf.jpeg"},93086:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/argo_sync_healthy-47754891eaf67731ab458189bd61ce7b.png"}}]);
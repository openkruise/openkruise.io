"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[3637],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=p(n),m=r,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||s;return n?a.createElement(h,o(o({ref:t},c),{},{components:n})):a.createElement(h,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var p=2;p<s;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5096:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var a=n(3117),r=n(102),s=(n(7294),n(3905)),o=["components"],i={title:"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet"},l=void 0,p={unversionedId:"best-practices/gitops-with-kruise",id:"best-practices/gitops-with-kruise",title:"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet",description:"What is GitOps\uff1f",source:"@site/docs/best-practices/gitops-with-kruise.md",sourceDirName:"best-practices",slug:"/best-practices/gitops-with-kruise",permalink:"/docs/next/best-practices/gitops-with-kruise",editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/gitops-with-kruise.md",tags:[],version:"current",lastUpdatedBy:"berg",lastUpdatedAt:1646895462,formattedLastUpdatedAt:"3/10/2022",frontMatter:{title:"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet"},sidebar:"docs",previous:{title:"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download",permalink:"/docs/next/best-practices/ci-pipeline-image-predownload"},next:{title:"Best Practice for Managing Log Collection Sidecar Containers",permalink:"/docs/next/best-practices/log-container-sidecarset"}},c=[{value:"What is GitOps\uff1f",id:"what-is-gitops",children:[],level:2},{value:"GitOps + OpenKruise CloneSet Practice",id:"gitops--openkruise-cloneset-practice",children:[{value:"Requirements",id:"requirements",children:[{value:"Install OpenKruise\uff08Enable: TemplateNoDefaults\uff09",id:"install-openkruiseenable-templatenodefaults",children:[],level:4}],level:3},{value:"CloneSet Deploy Stateless Application",id:"cloneset-deploy-stateless-application",children:[],level:3},{value:"Argo-cd CloneSet Health Check",id:"argo-cd-cloneset-health-check",children:[],level:3},{value:"Tekton Pipeline + Argo-cd",id:"tekton-pipeline--argo-cd",children:[],level:3},{value:"Run Tekton Pipeline",id:"run-tekton-pipeline",children:[],level:3}],level:2},{value:"Summary",id:"summary",children:[],level:2}],u={toc:c};function d(e){var t=e.components,i=(0,r.Z)(e,o);return(0,s.kt)("wrapper",(0,a.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h2",{id:"what-is-gitops"},"What is GitOps\uff1f"),(0,s.kt)("p",null,"GitOps is an approach to continuous delivery. Its core idea is to store the declarative infrastructure and applications of an application in a Git repository."),(0,s.kt)("p",null,"With Git at the core of the delivery pipeline, every developer can submit Pull Requests and use Git to accelerate and simplify application deployment and maintenance tasks for Kubernetes. By using a simple tool like Git, developers can more efficiently focus on creating new features rather than operations-related tasks (e.g., application installation, configuration, migration, etc.)."),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"argo-cd",src:n(4421).Z})),(0,s.kt)("h2",{id:"gitops--openkruise-cloneset-practice"},"GitOps + OpenKruise CloneSet Practice"),(0,s.kt)("h3",{id:"requirements"},"Requirements"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16."),(0,s.kt)("li",{parentName:"ul"},"Install Tekton, Reference ",(0,s.kt)("a",{parentName:"li",href:"https://tekton.dev/docs/getting-started/"},"Official Documents"),",\nTekton is a Google open source Kubernetes native framework for creating continuous integration and continuous deployment/delivery (CI/CD) systems."),(0,s.kt)("li",{parentName:"ul"},"Install Argo-cd, Reference ",(0,s.kt)("a",{parentName:"li",href:"https://argo-cd.readthedocs.io/en/stable/getting_started/"},"Official Documents"),", Argo-cd is a declarative GitOps continuous delivery tool for Kubernetes.")),(0,s.kt)("h4",{id:"install-openkruiseenable-templatenodefaults"},"Install OpenKruise\uff08Enable: TemplateNoDefaults\uff09"),(0,s.kt)("p",null,"Openkruse installed by default will inject the default value of pod / PVC template, which will conflict with the sync judgment logic of Argo CD.\nTherefore, when installing openkruse, you need to open gates ",(0,s.kt)("strong",{parentName:"p"},"TemplateNoDefaults"),", as follows:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},'# Firstly add openkruise charts repository if you haven\'t do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Install the latest version.\n$ helm install kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"\n\n# Those that have been installed need to be upgraded\n$ helm upgrade kruise openkruise/kruise --set featureGates="TemplateNoDefaults=true"\n')),(0,s.kt)("h3",{id:"cloneset-deploy-stateless-application"},"CloneSet Deploy Stateless Application"),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"CloneSet is the ability provided by OpenKruise to efficiently manage stateless applications, it is similar to the official workload: Deployment,\nbut offers many enhancements such as InPlace Update, Batch Release, etc.")," Please refer to the documentation ",(0,s.kt)("a",{parentName:"p",href:"https://openkruise.io/docs/user-manuals/cloneset"},"CloneSet"),".\nThis article provides a helloworld http service ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/zmberg/samples/tree/hello_world/helloworld"},"demo"),", It contains Helm Charts, and the cloneSet configuration is shown below:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  name: helloworld-server\n  labels:\n    app: helloworld-server\nspec:\n  updateStrategy:\n    # CloneSet will try to in-place update Pod instead of recreating them if possible\n    type: InPlaceIfPossible\n    # Batch release, currently updating only one Pod\n    partition: 1\n  replicas: 2\n  selector:\n    matchLabels:\n      app: helloworld-server\n  template:\n    metadata:\n      labels:\n        app: helloworld-server\n    spec:\n      containers:\n      - name: helloworld\n        image: "openkruise/kruise:hello_world-d92ae174b"\n')),(0,s.kt)("h3",{id:"argo-cd-cloneset-health-check"},"Argo-cd CloneSet Health Check"),(0,s.kt)("p",null,"Configure CloneSet Argo-cd ",(0,s.kt)("a",{parentName:"p",href:"https://argo-cd.readthedocs.io/en/stable/operator-manual/health/#custom-health-checks"},"Custom CRD Health Checks"),",\n",(0,s.kt)("strong",{parentName:"p"},"With this configuration argo-cd is able to perform a healthy check of the CloneSet, such as whether the CloneSet is published and whether the Pods are ready,")," as follows\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\n  name: argocd-cm\n  namespace: argocd\ndata:\n  resource.customizations.health.apps.kruise.io_CloneSet: |\n    hs = {}\n    -- if paused\n    if obj.spec.updateStrategy.paused then\n      hs.status = "Suspended"\n      hs.message = "CloneSet is Suspended"\n      return hs\n    end\n\n    -- check cloneSet status\n    if obj.status ~= nil then\n      if obj.status.observedGeneration < obj.metadata.generation then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: observed cloneSet generation less then desired generation"\n        return hs\n      end\n\n      if obj.status.updatedReplicas < obj.spec.replicas then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      if obj.status.updatedReadyReplicas < obj.status.updatedReplicas then\n        hs.status = "Progressing"\n        hs.message = "Waiting for rollout to finish: replicas hasn\'t finished updating..."\n        return hs\n      end\n\n      hs.status = "Healthy"\n      return hs\n    end\n\n    -- if status == nil\n    hs.status = "Progressing"\n    hs.message = "Waiting for cloneSet"\n    return hs\n')),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"OpenKruise internal CRD resources in addition to CloneSet, others such as: Advanced StatefulSet, SidecarSet, etc. can be similar to the above way to achieve Custom Resource Health.")),(0,s.kt)("h3",{id:"tekton-pipeline--argo-cd"},"Tekton Pipeline + Argo-cd"),(0,s.kt)("p",null,"Argo-CD together with Tekton Pipeline is a popular DevOps practice and integrate well with CI process.\nSuch practice requires storing the Argo-cd admin secret in K8S Secret CRD (",(0,s.kt)("a",{parentName:"p",href:"https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli"},"method of obtaining secret"),"), which in turn can be used in Tekton Pipeline, as follows:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\ndata:\n  # argo-cd admin secret\n  username: xxxxx\n  password: xxxxx\n  server: xxxxx\nkind: Secret\nmetadata:\n  name: argosecret\n---\napiVersion: tekton.dev/v1beta1\nkind: Task\nmetadata:\n  labels:\n    app: helloworld\n  name: helloworld-argocd\nspec:\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  - name: app_ns\n    type: string\n  - name: k8s_server\n    type: string\n  steps:\n  - name: argocd-deploy\n    image: argoproj/argocd:latest\n    command:\n    - sh\n    args:\n    - \'-ce\'\n    - >\n      set -e\n\n      echo "upgrade app $(params.app_name)"; username=`cat /var/secret/username`; password=`cat /var/secret/password`; server=`cat /var/secret/server`;\n\n      argocd login ${server} --insecure --username ${username} --password ${password}\n\n      argocd app create $(params.app_name) --upsert --repo $(params.gitrepositoryurl) --path $(params.app_name)/charts --dest-namespace $(params.app_ns) --dest-server $(params.k8s_server) --revision $(params.branch) --helm-set image.repository=$(params.docker_repo) --helm-set image.tag=$(params.branch)-$(params.short_sha) --helm-set installation.namespace=$(params.app_ns)\n\n      argocd app list; argocd app sync $(params.app_name)\n\n      argocd app wait $(params.app_name) --health\n    volumeMounts:\n    - name: argocd-secret\n      mountPath: "/var/secret"\n  volumes:\n  - name: argocd-secret\n    secret:\n      secretName: argosecret\n---\napiVersion: tekton.dev/v1beta1\nkind: Pipeline\nmetadata:\n  name: helloworld-pipeline\nspec:\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  - name: app_ns\n    type: string\n  - name: k8s_server\n    type: string\n  # Here you can connect with CI process to realize CI/CD Pipeline\n  tasks:\n  - name: helloworld-argocd\n    taskRef:\n      name: helloworld-argocd\n    params:\n    - name: gitrepositoryurl\n      value: $(params.gitrepositoryurl)\n    - name: short_sha\n      value: $(params.short_sha)\n    - name: branch\n      value: $(params.branch)\n    - name: docker_repo\n      value: $(params.docker_repo)\n    - name: app_name\n      value: $(params.app_name)\n    - name: app_ns\n      value: $(params.app_ns)\n    - name: k8s_server\n      value: $(params.k8s_server)\n')),(0,s.kt)("h3",{id:"run-tekton-pipeline"},"Run Tekton Pipeline"),(0,s.kt)("p",null,"Configure PipelineRun CRD, and kubectl apply -f in k8s cluster to run Pipeline, as follows:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: tekton.dev/v1beta1\nkind: PipelineRun\nmetadata:\n  name: helloworld-pipeline-run-1\nspec:\n  pipelineRef:\n    name: helloworld-pipeline\n  params:\n  - name: gitrepositoryurl\n    value: https://github.com/zmberg/samples.git\n  - name: branch\n    value: hello_world\n  - name: short_sha\n    value: d92ae174b\n  - name: docker_repo\n    value: zhaomingshan/kruise\n  - name: app_name\n    value: helloworld\n  - name: app_ns\n    value: helloworld\n  - name: k8s_server\n    value: https://kubernetes.default.svc\n")),(0,s.kt)("p",null,"The results can be viewed via the argo-cd cli, as follows:"),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"guestbook",src:n(8909).Z})),(0,s.kt)("h2",{id:"summary"},"Summary"),(0,s.kt)("p",null,"OpenKruise is more of a Kubernetes level extended capability, such as in-place upgrade, preImageDownload, etc.\nSo many community users using OpenKruise in production environments have some additional costs, need to integrate or self-research container PaaS.\nThe main purpose of this article is to combine some of the best Paas solutions in the community with OpenKruise,\nso that as many people as possible get to enjoy the dividends of cloud-native at a lower cost."),(0,s.kt)("p",null,'Argo-cd is a very good product for the community, and it integrate well with OpenKruise\'s CRD resources,\nwe hope that this article can intrigue more ideas from the community about "How to use OpenKruise easily".\nWe will try to integrate OpenKruise with other CI/CD pipelines later to better implement DevOps practice.'))}d.isMDXComponent=!0},8909:function(e,t,n){t.Z=n.p+"assets/images/argo_sync_healthy-47754891eaf67731ab458189bd61ce7b.png"},4421:function(e,t,n){t.Z=n.p+"assets/images/argocd-9b2263b3527910a6a839509239e3ebbf.jpeg"}}]);
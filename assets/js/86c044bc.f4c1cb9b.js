"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2501],{10268:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/ci_cd_pipeline-5a5af4826d9617c6d0f4890f07507d77.png"},10275:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/helloworld-570f327bedc9fe2c77218f9728025ffb.png"},28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>r});var t=a(96540);const o={},i=t.createContext(o);function s(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),t.createElement(i.Provider,{value:n},e.children)}},31564:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/imagepulljob-ac04817d1f28ee088deaa785eaeed33d.png"},51622:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>p,frontMatter:()=>s,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"best-practices/ci-pipeline-image-predownload","title":"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download","description":"What is Devops\uff1f","source":"@site/docs/best-practices/ci-pipeline-image-predownload.md","sourceDirName":"best-practices","slug":"/best-practices/ci-pipeline-image-predownload","permalink":"/docs/next/best-practices/ci-pipeline-image-predownload","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/ci-pipeline-image-predownload.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download"},"sidebar":"docs","previous":{"title":"HPA configuration","permalink":"/docs/next/best-practices/hpa-configuration"},"next":{"title":"Cloud-Native Devops Best Practices(2) - GitOps + OpenKruise CloneSet","permalink":"/docs/next/best-practices/gitops-with-kruise"}}');var o=a(74848),i=a(28453);const s={title:"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download"},r=void 0,l={},d=[{value:"What is Devops\uff1f",id:"what-is-devops",level:2},{value:"Continuous Integration (CI) + OpenKruise Image Pre-download",id:"continuous-integration-ci--openkruise-image-pre-download",level:2},{value:"Core Concepts",id:"core-concepts",level:3},{value:"Architecture",id:"architecture",level:3},{value:"User Story",id:"user-story",level:3},{value:"Tekton(CI) + Image Pre-download Practice",id:"tektonci--image-pre-download-practice",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Build-Test-Docker Push",id:"build-test-docker-push",level:3},{value:"Image Pre-download",id:"image-pre-download",level:3},{value:"Kruise CloneSet &amp; Advanced StatefulSet InPlace Update Built-in Image Pre-download",id:"kruise-cloneset--advanced-statefulset-inplace-update-built-in-image-pre-download",level:4},{value:"Kubernetes Native Workload, e.g. Deployment, StatefulSet, DaemonSet, Job etc.",id:"kubernetes-native-workload-eg-deployment-statefulset-daemonset-job-etc",level:4},{value:"Tekton Pipeline",id:"tekton-pipeline",level:3},{value:"Summary",id:"summary",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h2,{id:"what-is-devops",children:"What is Devops\uff1f"}),"\n",(0,o.jsx)(n.p,{children:"DevOps is the merging of the three domains of Development, QA, and Operations. DevOps is an idea, a set of best practices, and a culture.\nDevOps is an extension of CI/CD, and CI/CD is the core foundation of DevOps. Without CI/CD automation tools and processes, DevOps is meaningless."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"ci/cd pipeline",src:a(10268).A+"",width:"880",height:"339"})}),"\n",(0,o.jsx)(n.h2,{id:"continuous-integration-ci--openkruise-image-pre-download",children:"Continuous Integration (CI) + OpenKruise Image Pre-download"}),"\n",(0,o.jsx)(n.h3,{id:"core-concepts",children:"Core Concepts"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Continuous Integration(CI)"})," is a hands-on way to bring integration forward to the early stages of the development cycle, allowing builds, tests and integration of code to happen more often and repeatedly."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/imagepulljob/",children:"Image Pre-download"})})," is provided by OpenKruise to pull application images to specific Node nodes in advance of application deployment, which in turn can greatly improve the efficiency of application deployment."]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"architecture",children:"Architecture"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"ci+image predownload",src:a(31564).A+"",width:"1009",height:"457"})}),"\n",(0,o.jsx)(n.h3,{id:"user-story",children:"User Story"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.strong,{children:"Long-term pre-download common sidecar images, base images, such as: istio envoy, log collection containers."})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.strong,{children:"In large-scale scenarios, pre-download business app images to a specific K8s Node to reduce the pressure on the image repository during deployment, mainly for Deployment, StatefulSet and other k8s native resources."})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsxs)(n.strong,{children:["OpenKruise CloneSet & Advanced StatefulSet InPlace Update with built-in image pre-download capability, refer to ",(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/cloneset#pre-download-image-for-in-place-update",children:"CloneSet documentation"}),"."]})}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Note: The OpenKruise image pre-download capability is only available for regular kubelet nodes, and not for virtual kubelet."})}),"\n",(0,o.jsx)(n.h2,{id:"tektonci--image-pre-download-practice",children:"Tekton(CI) + Image Pre-download Practice"}),"\n",(0,o.jsx)(n.h3,{id:"requirements",children:"Requirements"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Install Kubernetes Cluster, Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16."}),"\n",(0,o.jsxs)(n.li,{children:["Install Tekton, Reference ",(0,o.jsx)(n.a,{href:"https://tekton.dev/docs/getting-started/",children:"Official Documents"}),"\u3002\nTekton is a Google open source Kubernetes native framework for creating continuous integration and continuous deployment/delivery (CI/CD) systems."]}),"\n",(0,o.jsxs)(n.li,{children:["Helm installation of OpenKruise, Since v0.9.0, Reference ",(0,o.jsx)(n.a,{href:"https://openkruise.io/zh/docs/installation",children:"Install OpenKruise"}),"\u3002"]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"build-test-docker-push",children:"Build-Test-Docker Push"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsxs)(n.strong,{children:["1. Git Repo: This article provides a helloworld http service ",(0,o.jsx)(n.a,{href:"https://github.com/zmberg/samples/tree/hello_world/helloworld",children:"demo"}),", It contains Code, Dockerfile, and Unit Test, as follows:"]}),"\n",(0,o.jsx)(n.img,{alt:"git helloworld",src:a(10275).A+"",width:"1250",height:"426"})]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"2. Tekton Build-Test-DockerPush Task, and need to generate the docker registry secret(for docker push image), as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'# docker registry secret, for docker push image\napiVersion: v1\ndata:\n  .dockerconfigjson: xxxxxx\nkind: Secret\nmetadata:\n  name: dockersecret\ntype: kubernetes.io/dockerconfigjson\n---\napiVersion: tekton.dev/v1beta1\nkind: Task\nmetadata:\n  labels:\n    app: helloworld\n  name: helloworld-build-push\nspec:\n  stepTemplate:\n    workingDir: /workspace\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  steps:\n  # git clone\n  - name: git-clone-and-checkout\n    image: bitnami/git:latest\n    command: ["sh", "-ce"]\n    args:\n    - >\n      set -e\n\n      echo $(params.gitrepositoryurl)\n\n      git clone $(params.gitrepositoryurl) ./ && git checkout $(params.branch)\n  # unit test\n  - name: auto-test\n    image: golang:1.16\n    command: [ "sh", "-ce" ]\n    args:\n    - >\n      set -e\n\n      cp -R /workspace/$(params.app_name) /go/src/ && cd /go/src/$(params.app_name) && pwd;\n\n      go test\n  # docker build & push registry\n  - name: push-to-registry\n    image: gcr.io/kaniko-project/executor:latest\n    args:\n    - --dockerfile=Dockerfile\n    - --destination=$(params.docker_repo):$(params.branch)-$(params.short_sha)\n    - --context=./$(params.app_name)\n    - --cache=true\n    - --cache-dir=/cache\n    - --use-new-run\n    volumeMounts:\n    - name: kaniko-secret\n      mountPath: "/kaniko/.docker"\n  volumes:\n  # docker push secret\n  - name: kaniko-secret\n    secret:\n      secretName: dockersecret\n      items:\n      - key: .dockerconfigjson\n        path: config.json\n'})}),"\n",(0,o.jsx)(n.h3,{id:"image-pre-download",children:"Image Pre-download"}),"\n",(0,o.jsx)(n.h4,{id:"kruise-cloneset--advanced-statefulset-inplace-update-built-in-image-pre-download",children:"Kruise CloneSet & Advanced StatefulSet InPlace Update Built-in Image Pre-download"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Note: This scenario no longer requires to deploy ImagePullJob CRD"})}),"\n",(0,o.jsxs)(n.p,{children:["If you have enabled the ",(0,o.jsx)(n.code,{children:"PreDownloadImageForInPlaceUpdate"})," feature-gate during ",(0,o.jsx)(n.a,{href:"../installation#optional-feature-gate",children:"Kruise installation or upgrade"}),",\nCloneSet & Advanced StatefulSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.\nIt is quite useful to accelerate the progress of applications upgrade."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'# Firstly add openkruise charts repository if you haven\'t do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Install the latest version.\n$ helm install kruise openkruise/kruise --set featureGates="PreDownloadImageForInPlaceUpdate=true"\n\n# Those that have been installed need to be upgraded\n$ helm upgrade kruise openkruise/kruise --set featureGates="PreDownloadImageForInPlaceUpdate=true"\n'})}),"\n",(0,o.jsxs)(n.p,{children:["The parallelism of each new image pre-downloading by CloneSet & Advanced StatefulSet is ",(0,o.jsx)(n.code,{children:"1"}),", which means the image is downloaded on nodes one by one.\nYou can change the parallelism using the annotation on CloneSet according to the capability of image registry,\nfor registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet/StatefulSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "5"\n'})}),"\n",(0,o.jsx)(n.h4,{id:"kubernetes-native-workload-eg-deployment-statefulset-daemonset-job-etc",children:"Kubernetes Native Workload, e.g. Deployment, StatefulSet, DaemonSet, Job etc."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"1. Configure ImagePullJob CRD in k8s configmap, as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: imagePullJob\ndata:\n  imagepulljob.yaml: |\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: ImagePullJob\n    metadata:\n      name: APP_NAME\n    spec:\n      # pre-download image\n      image: APP_IMAGE\n      parallelism: 10\n      # You can write the names or label selector in the selector field to assign Nodes (only one of them can be set).\n      # If no selector is set, the image will be pulled on all Nodes in the cluster.\n      selector:\n        names:\n        - node-1\n        - node-2\n        matchLabels:\n          node-type: xxx\n      completionPolicy:\n        type: Always\n        activeDeadlineSeconds: 1200\n        ttlSecondsAfterFinished: 300\n      pullPolicy:\n        backoffLimit: 3\n        timeoutSeconds: 300\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"2. Image Pre-download ImagePullJob TASK, and store kubeconfig in secret, as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'# kubeconfig\napiVersion: v1\ndata:\n  kubeconfig: xxxxxx\nkind: Secret\nmetadata:\n  name: kubeconfig\n---\napiVersion: tekton.dev/v1beta1\nkind: Task\nmetadata:\n  labels:\n    app: helloworld\n  name: helloworld-image-predownload\nspec:\n  params:\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  steps:\n  - name: image-pre-download\n    image: bitnami/kubectl:latest\n    command: [ "sh", "-ce" ]\n    args:\n    - >\n      set -e\n\n      echo "pre-download image"\n\n      cat /var/crd/imagepulljob.yaml | sed \'s#JOB_NAME#$(params.app_name)-$(params.short_sha)#\' | sed \'s#APP_IMAGE#$(params.docker_repo):$(params.branch)-$(params.short_sha)#\' | kubectl apply --kubeconfig=/var/kube/kubeconfig -f -\n    volumeMounts:\n    - name: kubeconfig\n      mountPath: "/var/kube"\n    - name: imagepulljob\n      mountPath: "/var/crd"\n  volumes:\n  - name: kubeconfig\n    secret:\n      secretName: kubeconfig\n  - name: imagepulljob\n    configmap:\n      name: imagepulljob\n'})}),"\n",(0,o.jsx)(n.h3,{id:"tekton-pipeline",children:"Tekton Pipeline"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"1. configure tekton pipeline, first executing the Build-Test-DockerPush Task, and second Image Pre-download Task, as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: tekton.dev/v1beta1\nkind: Pipeline\nmetadata:\n  name: helloworld-pipeline\nspec:\n  params:\n  - name: gitrepositoryurl\n    type: string\n  - name: branch\n    type: string\n  - name: short_sha\n    type: string\n  - name: docker_repo\n    type: string\n  - name: app_name\n    type: string\n  tasks:\n  - name: helloworld-build-push\n    taskRef:\n      name: helloworld-build-push\n    params:\n    - name: gitrepositoryurl\n      value: $(params.gitrepositoryurl)\n    - name: short_sha\n      value: $(params.short_sha)\n    - name: branch\n      value: $(params.branch)\n    - name: docker_repo\n      value: $(params.docker_repo)\n    - name: app_name\n      value: $(params.app_name)\n  - name: helloworld-image-predownload\n    taskRef:\n      name: helloworld-image-predownload\n    params:\n    - name: short_sha\n      value: $(params.short_sha)\n    - name: branch\n      value: $(params.branch)\n    - name: docker_repo\n      value: $(params.docker_repo)\n    - name: app_name\n      value: $(params.app_name)\n    runAfter:\n    - helloworld-build-push\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"2. Configure PipelineRun CRD, and kubectl apply -f in k8s cluster to run Pipeline, as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: tekton.dev/v1beta1\nkind: PipelineRun\nmetadata:\n  name: helloworld-pipeline-run-1\nspec:\n  pipelineRef:\n    name: helloworld-pipeline\n    params:\n    - name: gitrepositoryurl\n      value: https://github.com/zmberg/samples.git\n    - name: branch\n      value: hello_world\n    - name: short_sha\n      value: d92ae174b\n    - name: docker_repo\n      value: zhaomingshan/kruise\n    - name: app_name\n      value: helloworld\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"3. The execution results can be viewed via the tekton command line tool tkn, as follows:"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"tekton pipeline",src:a(77551).A+"",width:"1572",height:"557"})}),"\n",(0,o.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,o.jsx)(n.p,{children:"This article aims to combine the image pre-download capability provided by OpenKruise with CI Pipeline, which can greatly improve the deployment efficiency of users in the application deployment phase and reduce the pressure on image repositories in large-scale deployments.\nA later article will focus on the CD Pipeline application deployment phase, so stay tuned."})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},77551:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/tekton_pipeline-0a1ffac26f87a5a1a38520724b9f861d.png"}}]);
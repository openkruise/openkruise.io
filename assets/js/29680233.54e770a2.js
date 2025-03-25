"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9878],{21529:(e,n,i)=>{i.d(n,{A:()=>r});const r=i.p+"assets/images/resourcedistributiongenerator-c0493bac80f654213addb9c50fc59743.png"},28453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>a});var r=i(96540);const s={},t=r.createContext(s);function o(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(t.Provider,{value:n},e.children)}},52561:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"cli-tool/kustomize-plugin","title":"Kustomize ResourceDistribution Generator","description":"Kruise-tools provides a series of generators and Transformers for Kruise features, which is a third party plug-in for Kustomize.","source":"@site/versioned_docs/version-v1.6/cli-tool/kustomize-plugin.md","sourceDirName":"cli-tool","slug":"/cli-tool/kustomize-plugin","permalink":"/docs/v1.6/cli-tool/kustomize-plugin","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kustomize-plugin.md","tags":[],"version":"v1.6","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"Kustomize ResourceDistribution Generator"},"sidebar":"docs","previous":{"title":"Kubectl Plugin","permalink":"/docs/v1.6/cli-tool/kubectl-plugin"},"next":{"title":"FAQ","permalink":"/docs/v1.6/faq"}}');var s=i(74848),t=i(28453);const o={title:"Kustomize ResourceDistribution Generator"},a=void 0,l={},c=[{value:"ResourceDistribution Generator",id:"resourcedistribution-generator",level:2},{value:"Download ResourceDistribution generator",id:"download-resourcedistribution-generator",level:3},{value:"API Description",id:"api-description",level:3},{value:"Resource Field",id:"resource-field",level:3},{value:"ResourceDistribution from File",id:"resourcedistribution-from-file",level:4},{value:"ResourceDistribution from Literals",id:"resourcedistribution-from-literals",level:4},{value:"ResourceDistribution from env file",id:"resourcedistribution-from-env-file",level:4},{value:"Targets Field",id:"targets-field",level:3},{value:"Options and ResourceOptions Field",id:"options-and-resourceoptions-field",level:3},{value:"A Complete Use Case",id:"a-complete-use-case",level:3},{value:"Use the ResourceDistribution Generator in ArgoCD",id:"use-the-resourcedistribution-generator-in-argocd",level:3},{value:"The use of plug-in",id:"the-use-of-plug-in",level:4}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools",children:"Kruise-tools"})," provides a series of generators and Transformers for Kruise features, which is a third party plug-in for Kustomize."]}),"\n",(0,s.jsx)(n.h2,{id:"resourcedistribution-generator",children:"ResourceDistribution Generator"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["ResourceDistribution Generator Since v1.0.0 (alpha/beta) requires Kustomize version >= 4.3.0. Please refer to the  ",(0,s.jsx)(n.a,{href:"https://kubectl.docs.kubernetes.io/installation/kustomize/",children:"Kustomize"})," for installation."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"When using Kustomize to manage applications, the generator provided with Kustomize can directly read files as data content to create Configmap or Secret, avoiding various format errors that are easy to occur during manual replication. The ResourceDistribution Generator is a third-party plug-in for Kustomize that can be used to create a ResourceDistribution by reading files as data content."}),"\n",(0,s.jsx)(n.h3,{id:"download-resourcedistribution-generator",children:"Download ResourceDistribution generator"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/releases",children:"This page"})," provides the path to download binary files for common versions. Currently ",(0,s.jsx)(n.code,{children:"Linux"}),", ",(0,s.jsx)(n.code,{children:"Darwin"})," (OS X), ",(0,s.jsx)(n.code,{children:"Windows"})," provide ",(0,s.jsx)(n.code,{children:"X86_64"})," and ",(0,s.jsx)(n.code,{children:"ARM64 "}),". If you use some other system or architecture, you must download the ",(0,s.jsx)(n.a,{href:"https://github.com/openkruise/kruise-tools/blob/master/cmd/resourcedistributiongenerator",children:"source code"})," and perform ",(0,s.jsx)(n.code,{children:"Go Build"})," to build the binary"]}),"\n",(0,s.jsx)(n.h3,{id:"api-description",children:"API Description"}),"\n",(0,s.jsxs)(n.p,{children:["ResourceDistributionGenerator is the Exec KRM functions plugin of kusomize. It is mainly composed of ",(0,s.jsx)(n.code,{children:"resource"})," and ",(0,s.jsx)(n.code,{children:"targets"})," fields. After the build, it will generate ",(0,s.jsx)(n.code,{children:"resource"})," and ",(0,s.jsx)(n.code,{children:"targets"})," content corresponding to ResourceDistribution. The ",(0,s.jsx)(n.code,{children:"name"})," in ",(0,s.jsx)(n.code,{children:"metadata"})," is used to set the name of the generated resourceDistribution. The annotation ",(0,s.jsx)(n.code,{children:"config.kubernetes.io/function"})," needs to write the path of this plugin in the file system. If a relative path is used, it needs to be relative to A kustomization file that references the configuration file."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./plugins/resourcedistributiongenerator\nresource:\n\t... ...\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.h3,{id:"resource-field",children:"Resource Field"}),"\n",(0,s.jsxs)(n.p,{children:["The contents of the ",(0,s.jsx)(n.code,{children:"resource"})," field are used to generate the distributed resources. The ",(0,s.jsx)(n.code,{children:"literals"}),", ",(0,s.jsx)(n.code,{children:"files"}),", and ",(0,s.jsx)(n.code,{children:"envs"})," fields are used in the same way as in ",(0,s.jsx)(n.a,{href:"https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/",children:"Configmap or Secret"})," Generator."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"resourceKind"}),": Specify the resource kind to distribute, Secret or ConfigMap;"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"resourceName"}),": Set the name of the distribution resource, that is, the name of the Secret or ConfigMap;"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"literals"}),": create data content using key/value pairs in the given literals;"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"files"}),": create data content with the given file name and content;"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"envs"}),": create data content using key/value pairs in the file;"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"A correctly configured resource field is as follows:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - file.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-file",children:"ResourceDistribution from File"}),"\n",(0,s.jsxs)(n.p,{children:["ResourceDistribution Resources may be generated from files - such as a java ",(0,s.jsx)(n.code,{children:".properties"}),"file."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Example:"})," Generate a ResourceDistribution with a data item containing the contents of a file."]}),"\n",(0,s.jsx)(n.p,{children:"The ResourceDistribution will have data values populated from the file contents. The contents of each file will appear as a single data item in the ResourceDistribution keyed by the filename."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\ntargets:\n\t... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:"application.properties"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"FOO=Bar\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      application.properties: |\n        FOO=Bar\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-literals",children:"ResourceDistribution from Literals"}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution Resources may be generated from literal key-value pairs - such as JAVA_HOME=/opt/java/jdk."}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The key/value are separated by a ",(0,s.jsx)(n.code,{children:"="})," sign (left side is the key)"]}),"\n",(0,s.jsx)(n.li,{children:"The value of each literal will appear as a data item in the ResourceDistribution keyed by its key."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Example:"})," Create a ResourceDistribution with 2 data items generated from literals."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n    - JAVA_TOOL_OPTIONS=-agentlib:hprof\ntargets:\n  ... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      JAVA_TOOL_OPTIONS: -agentlib:hprof\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n"})}),"\n",(0,s.jsx)(n.h4,{id:"resourcedistribution-from-env-file",children:"ResourceDistribution from env file"}),"\n",(0,s.jsx)(n.p,{children:"ResourceDistribution Resources may be generated from key-value pairs much the same as using the literals option but taking the key-value pairs from an environment file."}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The key/value pairs inside of the environment file are separated by a ",(0,s.jsx)(n.code,{children:"="})," sign (left side is the key)"]}),"\n",(0,s.jsx)(n.li,{children:"The value of each line will appear as a data item in the ResourceDistribution keyed by its key."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Example:"})," Create a ResourceDistribution with 3 data items generated from an environment file."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"File Input"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ...\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  envs:\n    - tracing.env\ntargets:\n  ... ...\n"})}),"\n",(0,s.jsx)(n.p,{children:"tracing.env"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"ENABLE_TRACING=true\nSAMPLER_TYPE=probabilistic\nSAMPLER_PARAMETERS=0.1\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Build Output"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  ... ...\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      ENABLE_TRACING: "true"\n      SAMPLER_TYPE: "probabilistic"\n      SAMPLER_PARAMETERS: "0.1"\n    kind: ConfigMap\n    metadata:\n      name: cmname\n  targets:\n    ... ...\n'})}),"\n",(0,s.jsx)(n.h3,{id:"targets-field",children:"Targets Field"}),"\n",(0,s.jsxs)(n.p,{children:["The usage of the ",(0,s.jsx)(n.code,{children:"targets"})," field is basically the same as that of the ",(0,s.jsx)(n.code,{children:"targets"})," field in ResourceDistribution. Note that the contents of the ",(0,s.jsx)(n.code,{children:"includedNamespaces"})," and ",(0,s.jsx)(n.code,{children:"excludedNamespaces"})," fields are directly the names of the namespaces."]}),"\n",(0,s.jsx)(n.p,{children:"A correctly configured targets field is as follows:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n\t... ...\ntargets:\n  allNamespaces: true\n  excludedNamespaces:\n    - ns-2\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"options-and-resourceoptions-field",children:"Options and ResourceOptions Field"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"options"})," and ",(0,s.jsx)(n.code,{children:"resourceOptions"})," fields are used to set annotations or labels for the generated ResourceDistribution and the Resource (ie ConfigMap or Secret) in it, respectively."]}),"\n",(0,s.jsxs)(n.p,{children:["A correctly configured ",(0,s.jsx)(n.code,{children:"options"})," and ",(0,s.jsx)(n.code,{children:"resourceOptions"})," fields is as follows:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ... ... \nresource:\n  ... ...\n  resourceOptions:\n    annotations:\n      dashboard: "1"\n    labels:\n      environment: "dev"\ntargets:\n\t... ...\noptions:\n  annotations:\n    type: "slave"\n  labels:\n    version: "stable"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"a-complete-use-case",children:"A Complete Use Case"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Create a demo directory as a workspace and enter. Place the downloaded ResourceDistributionGenerator plugin in the current directory and enter the following command to create a configuration file named rdGenerator.yaml."}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'cat > rdGenerator.yaml <<EOF\n#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  name: rdname\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\nresource:\n  resourceKind: ConfigMap\n  resourceName: cmname\n  files:\n    - application.properties\n  literals:\n    - JAVA_HOME=/opt/java/jdk\n  resourceOptions:\n    annotations:\n      dashboard: "1"\noptions:\n  labels:\n    app.kubernetes.io/name: "app1"\ntargets:\n  includedNamespaces:\n    - ns-1\n  namespaceLabelSelector:\n    matchLabels:\n      group: "test"\nEOF\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Create the application.properties file using the following command as file input."}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-properties",children:"cat > application.properties <<EOF\nFOO=Bar\nFIRST=1\nSECOND=2\nLAST=3\nEOF\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Create the kustomization file with the following command."}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"cat > kustomization.yaml <<EOF\n#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\nEOF\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["Use the ",(0,s.jsx)(n.code,{children:"kustomize build --enable-alpha-plugins --enable-exec ."})," command to build application, the effect is as follows"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  labels:\n    app.kubernetes.io/name: app1\n  name: rdname\nspec:\n  resource:\n    apiVersion: v1\n    data:\n      JAVA_HOME: /opt/java/jdk\n      application.properties: |\n        FOO=Bar\n        FIRST=1\n        SECOND=2\n        LAST=3\n    kind: ConfigMap\n    metadata:\n      annotations:\n        dashboard: "1"\n      name: cmname\n  targets:\n    includedNamespaces:\n      list:\n      - name: ns-1\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n'})}),"\n",(0,s.jsx)(n.h3,{id:"use-the-resourcedistribution-generator-in-argocd",children:"Use the ResourceDistribution Generator in ArgoCD"}),"\n",(0,s.jsxs)(n.p,{children:["In argocd, the usage of the kustomize plugin is the same as above. In addition to that, add a build option to kustomize that allows third-party plugins. Find the configMap named argocd-cm in the kubernetes cluster and add the following to the ",(0,s.jsx)(n.code,{children:"data"})," field ",(0,s.jsx)(n.code,{children:"kustomize.buildOptions : --enable-alpha-plugins --enable-exec"})," to add build options for third-party plugins to the default version of kustomize. See ",(0,s.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/#kustomize-build-optionsparameters",children:"ArgoCD"})," for more information. ",(0,s.jsxs)(n.strong,{children:["You can use this ",(0,s.jsx)(n.a,{href:"https://github.com/openkruise/samples/tree/master/resourcedistribution-generator",children:"sample"})," directly in argocd"]}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: argocd-cm\n  namespace: argocd\n  labels:\n    app.kubernetes.io/name: argocd-cm\n    app.kubernetes.io/part-of: argocd\ndata:\n    kustomize.buildOptions: --enable-alpha-plugins --enable-exec\n"})}),"\n",(0,s.jsx)(n.h4,{id:"the-use-of-plug-in",children:"The use of plug-in"}),"\n",(0,s.jsxs)(n.p,{children:["Add the resourcedistributiongenerator plugin to argocd's git repository and fill in the plugin location in the annotation ",(0,s.jsx)(n.code,{children:"config.kubernetes.io/function"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"#rdGenerator.yaml\napiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistributionGenerator\nmetadata:\n  ...\n  annotations:\n    config.kubernetes.io/function: |\n      exec:\n        path: ./resourcedistributiongenerator\n"})}),"\n",(0,s.jsx)(n.p,{children:"Referenced by the generator field of kustomization.yaml."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"#kustomization.yaml\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\ngenerators:\n- rdGenerator.yaml\n"})}),"\n",(0,s.jsxs)(n.p,{children:["After uploading the Git repository, deploy the project by using the ",(0,s.jsx)(n.code,{children:"argocd app sync myapp"})," command or clicking the Sync button in the UI."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"ContainerRecreateRequest",src:i(21529).A+"",width:"2012",height:"1138"})})]})}function u(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
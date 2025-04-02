"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4530],{28453:(e,r,s)=>{s.d(r,{R:()=>d,x:()=>l});var n=s(96540);const t={},i=n.createContext(t);function d(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function l(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),n.createElement(i.Provider,{value:r},e.children)}},47011:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>d,metadata:()=>n,toc:()=>o});const n=JSON.parse('{"id":"installation","title":"Installation","description":"- Since v1.0.0 (alpha/beta), OpenKruise requires Kubernetes version >= 1.16.","source":"@site/versioned_docs/version-v1.7/installation.md","sourceDirName":".","slug":"/installation","permalink":"/docs/v1.7/installation","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/installation.md","tags":[],"version":"v1.7","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"Installation"},"sidebar":"docs","previous":{"title":"Introduction","permalink":"/docs/v1.7/"},"next":{"title":"Architecture","permalink":"/docs/v1.7/core-concepts/architecture"}}');var t=s(74848),i=s(28453);const d={title:"Installation"},l=void 0,a={},o=[{value:"Install with helm",id:"install-with-helm",level:2},{value:"Upgrade with helm",id:"upgrade-with-helm",level:2},{value:"Optional: download charts manually",id:"optional-download-charts-manually",level:2},{value:"Options",id:"options",level:2},{value:"Optional: chart parameters",id:"optional-chart-parameters",level:3},{value:"setup parameters",id:"setup-parameters",level:4},{value:"manager parameters",id:"manager-parameters",level:4},{value:"daemon parameters",id:"daemon-parameters",level:4},{value:"other parameters",id:"other-parameters",level:4},{value:"Optional: feature-gate",id:"optional-feature-gate",level:3},{value:"Optional: the local image for China",id:"optional-the-local-image-for-china",level:3},{value:"Best Practices",id:"best-practices",level:2},{value:"Installation parameters for K3s",id:"installation-parameters-for-k3s",level:3},{value:"Installation parameters for AWS EKS",id:"installation-parameters-for-aws-eks",level:3},{value:"Support webhook CA injection using external certification management tool",id:"support-webhook-ca-injection-using-external-certification-management-tool",level:3},{value:"Structured Logs",id:"structured-logs",level:3},{value:"Uninstall",id:"uninstall",level:2},{value:"Kruise State Metrics",id:"kruise-state-metrics",level:2}];function c(e){const r={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["Since v1.0.0 (alpha/beta), OpenKruise requires ",(0,t.jsx)(r.strong,{children:"Kubernetes version >= 1.16"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["Since v1.5.0(alpha/beta), OpenKruise no longer supports dockershim. If you still use Docker Engine to run containers in Kubernetes,\nyou can ",(0,t.jsx)(r.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/",children:"Migrate Docker Engine nodes from dockershim to cri-dockerd."})]}),"\n"]}),"\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["Since v1.6.0 (alpha/beta), OpenKruise requires ",(0,t.jsx)(r.strong,{children:"Kubernetes version >= 1.18"}),'. However it\'s still possible to use OpenKruise with Kubernetes versions 1.16 and 1.17 as long as KruiseDaemon is not enabled(install/upgrade kruise charts with featureGates="KruiseDaemon=false")']}),"\n"]}),"\n",(0,t.jsxs)(r.li,{children:["\n",(0,t.jsxs)(r.p,{children:["Since v1.6.0 (alpha/beta), KruiseDaemon will ",(0,t.jsx)(r.strong,{children:"no longer support v1alpha2 CRI runtimes"}),'. However, it is still possible to use OpenKruise on Kubernetes clusters with nodes that only support v1alpha2 CRI, as long as KruiseDaemon is not enabled (install/upgrade Kruise charts with featureGates="KruiseDaemon=false").']}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(r.h2,{id:"install-with-helm",children:"Install with helm"}),"\n",(0,t.jsxs)(r.p,{children:["Kruise can be simply installed by helm v3.5+, which is a simple command-line tool and you can get it from ",(0,t.jsx)(r.a,{href:"https://github.com/helm/helm/releases",children:"here"}),"."]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:"# Firstly add openkruise charts repository if you haven't do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Install the latest version.\n$ helm install kruise openkruise/kruise --version 1.7.1\n"})}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"Note:"})," ",(0,t.jsx)(r.a,{href:"https://github.com/openkruise/kruise/blob/master/CHANGELOG.md",children:"Changelog"}),"."]}),"\n",(0,t.jsx)(r.h2,{id:"upgrade-with-helm",children:"Upgrade with helm"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:"# Firstly add openkruise charts repository if you haven't do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Upgrade to the latest version.\n$ helm upgrade kruise openkruise/kruise --version 1.7.1 [--force]\n"})}),"\n",(0,t.jsx)(r.p,{children:"Note that:"}),"\n",(0,t.jsxs)(r.ol,{children:["\n",(0,t.jsxs)(r.li,{children:["Before upgrade, you ",(0,t.jsx)(r.strong,{children:"must"})," firstly read the ",(0,t.jsx)(r.a,{href:"https://github.com/openkruise/kruise/blob/master/CHANGELOG.md",children:"Change Log"}),"\nto make sure that you have understand the breaking changes in the new version."]}),"\n",(0,t.jsxs)(r.li,{children:["If you want to drop the chart parameters you configured for the old release or set some new parameters,\nit is recommended to add ",(0,t.jsx)(r.code,{children:"--reset-values"})," flag in ",(0,t.jsx)(r.code,{children:"helm upgrade"})," command.\nOtherwise you should use ",(0,t.jsx)(r.code,{children:"--reuse-values"})," flag to reuse the last release's values."]}),"\n",(0,t.jsxs)(r.li,{children:["If you are ",(0,t.jsx)(r.strong,{children:"upgrading Kruise from 0.x to 1.x"}),", you must add ",(0,t.jsx)(r.code,{children:"--force"})," for upgrade command. Otherwise it is an optional flag."]}),"\n"]}),"\n",(0,t.jsx)(r.h2,{id:"optional-download-charts-manually",children:"Optional: download charts manually"}),"\n",(0,t.jsxs)(r.p,{children:["If you have problem with connecting to ",(0,t.jsx)(r.code,{children:"https://openkruise.github.io/charts/"})," in production, you might need to download the chart from ",(0,t.jsx)(r.a,{href:"https://github.com/openkruise/charts/releases",children:"here"})," manually and install or upgrade with it."]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:"$ helm install/upgrade kruise /PATH/TO/CHART\n"})}),"\n",(0,t.jsx)(r.h2,{id:"options",children:"Options"}),"\n",(0,t.jsx)(r.p,{children:"Note that installing this chart directly means it will use the default template values for Kruise."}),"\n",(0,t.jsx)(r.p,{children:"You may have to set your specific configurations if it is deployed into a production cluster, or you want to configure feature-gates."}),"\n",(0,t.jsx)(r.h3,{id:"optional-chart-parameters",children:"Optional: chart parameters"}),"\n",(0,t.jsx)(r.p,{children:"The following table lists the configurable parameters of the chart and their default values."}),"\n",(0,t.jsx)(r.h4,{id:"setup-parameters",children:"setup parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Parameter"}),(0,t.jsx)(r.th,{children:"Description"}),(0,t.jsx)(r.th,{children:"Default"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"featureGates"})}),(0,t.jsx)(r.td,{children:"Feature gates for Kruise, empty string means all enabled"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:'""'})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"installation.namespace"})}),(0,t.jsx)(r.td,{children:"Namespace for kruise installation"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"kruise-system"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"installation.createNamespace"})}),(0,t.jsx)(r.td,{children:"Whether to create the installation.namespace"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"installation.roleListGroups"})}),(0,t.jsx)(r.td,{children:"ApiGroups which kruise is permit to list, default set to be all"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"*"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"crds.managed"})}),(0,t.jsx)(r.td,{children:"Kruise will not install CRDs with chart if this is false"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"imagePullSecrets"})}),(0,t.jsx)(r.td,{children:"The list of image pull secrets for kruise image"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"[]"})})]})]})]}),"\n",(0,t.jsx)(r.h4,{id:"manager-parameters",children:"manager parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Parameter"}),(0,t.jsx)(r.th,{children:"Description"}),(0,t.jsx)(r.th,{children:"Default"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.log.level"})}),(0,t.jsx)(r.td,{children:"Log level that kruise-manager printed"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"4"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.replicas"})}),(0,t.jsx)(r.td,{children:"Replicas of kruise-controller-manager deployment"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"2"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.image.repository"})}),(0,t.jsx)(r.td,{children:"Repository for kruise-manager image"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"openkruise/kruise-manager"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.image.tag"})}),(0,t.jsx)(r.td,{children:"Tag for kruise-manager image"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"v1.7.2"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.resources.limits.cpu"})}),(0,t.jsx)(r.td,{children:"CPU resource limit of kruise-manager container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"200m"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.resources.limits.memory"})}),(0,t.jsx)(r.td,{children:"Memory resource limit of kruise-manager container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"512Mi"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.resources.requests.cpu"})}),(0,t.jsx)(r.td,{children:"CPU resource request of kruise-manager container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"100m"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.resources.requests.memory"})}),(0,t.jsx)(r.td,{children:"Memory resource request of kruise-manager container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"256Mi"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.metrics.port"})}),(0,t.jsx)(r.td,{children:"Port of metrics served"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"8080"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.webhook.port"})}),(0,t.jsx)(r.td,{children:"Port of webhook served"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"9443"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.pprofAddr"})}),(0,t.jsx)(r.td,{children:"Address of pprof served"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"localhost:8090"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.nodeAffinity"})}),(0,t.jsx)(r.td,{children:"Node affinity policy for kruise-manager pod"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"{}"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.nodeSelector"})}),(0,t.jsx)(r.td,{children:"Node labels for kruise-manager pod"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"{}"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.tolerations"})}),(0,t.jsx)(r.td,{children:"Tolerations for kruise-manager pod"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"[]"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.resyncPeriod"})}),(0,t.jsx)(r.td,{children:"Resync period of informer kruise-manager, defaults no resync"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"0"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.hostNetwork"})}),(0,t.jsx)(r.td,{children:"Whether kruise-manager pod should run with hostnetwork"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"manager.loggingFormat"})}),(0,t.jsxs)(r.td,{children:["Logging format, valid formats includes ",(0,t.jsx)(r.code,{children:" "}),"(plain text), ",(0,t.jsx)(r.code,{children:"json"})]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:" "})})]})]})]}),"\n",(0,t.jsx)(r.h4,{id:"daemon-parameters",children:"daemon parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Parameter"}),(0,t.jsx)(r.th,{children:"Description"}),(0,t.jsx)(r.th,{children:"Default"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.extraEnvs"})}),(0,t.jsx)(r.td,{children:"Extra environment variables that will be pass onto pods"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"[]"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.log.level"})}),(0,t.jsx)(r.td,{children:"Log level that kruise-daemon printed"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"4"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.port"})}),(0,t.jsx)(r.td,{children:"Port of metrics and healthz that kruise-daemon served"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"10221"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.pprofAddr"})}),(0,t.jsx)(r.td,{children:"Address of pprof served"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"localhost:10222"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.resources.limits.cpu"})}),(0,t.jsx)(r.td,{children:"CPU resource limit of kruise-daemon container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"50m"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.resources.limits.memory"})}),(0,t.jsx)(r.td,{children:"Memory resource limit of kruise-daemon container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"128Mi"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.resources.requests.cpu"})}),(0,t.jsx)(r.td,{children:"CPU resource request of kruise-daemon container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"0"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.resources.requests.memory"})}),(0,t.jsx)(r.td,{children:"Memory resource request of kruise-daemon container"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"0"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.affinity"})}),(0,t.jsx)(r.td,{children:"Affinity policy for kruise-daemon pod"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"{}"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.socketLocation"})}),(0,t.jsx)(r.td,{children:"Location of the container manager control socket"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"/var/run"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.socketFile"})}),(0,t.jsxs)(r.td,{children:["Specify the socket file name in ",(0,t.jsx)(r.code,{children:"socketLocation"})," (if you are not using containerd/docker/pouch/cri-o)"]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:" "})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.credentialProvider.enable"})}),(0,t.jsx)(r.td,{children:"Whether to enable credential provider for image pull job"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.credentialProvider.hostPath"})}),(0,t.jsx)(r.td,{children:"node dir of the credential provider plugin, kruise-daemon will mount the dir as a hostpath volume"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"credential-provider-plugin"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.credentialProvider.configmap"})}),(0,t.jsx)(r.td,{children:"configmap name of the credential provider in kruise-system ns"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"credential-provider-config"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"daemon.credentialProvider.awsCredentialsDir"})}),(0,t.jsxs)(r.td,{children:["aws credentials dir if using AWS, for example: ",(0,t.jsx)(r.code,{children:"/root/.aws"})]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:" "})})]})]})]}),"\n",(0,t.jsx)(r.h4,{id:"other-parameters",children:"other parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Parameter"}),(0,t.jsx)(r.th,{children:"Description"}),(0,t.jsx)(r.th,{children:"Default"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"enableKubeCacheMutationDetector"})}),(0,t.jsx)(r.td,{children:"Whether to enable KUBE_CACHE_MUTATION_DETECTOR"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"webhookConfiguration.timeoutSeconds"})}),(0,t.jsx)(r.td,{children:"The timeoutSeconds for all webhook configuration"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"30"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"serviceAccount.annotations"})}),(0,t.jsx)(r.td,{children:"Annotations to patch for serviceAccounts"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"{}"})})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"externalCerts.annotations"})}),(0,t.jsxs)(r.td,{children:["Annotations to patch for webhook configuration and crd when featuregate ",(0,t.jsx)(r.code,{children:"EnableExternalCerts"})," is enabled. For example, ",(0,t.jsx)(r.code,{children:"cert-manager.io/inject-ca-from: kruise-system/kruise-webhook-certs"}),"."]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"{}"})})]})]})]}),"\n",(0,t.jsxs)(r.p,{children:["Specify each parameter using the ",(0,t.jsx)(r.code,{children:"--set key=value[,key=value]"})," argument to ",(0,t.jsx)(r.code,{children:"helm install"})," or ",(0,t.jsx)(r.code,{children:"helm upgrade"}),"."]}),"\n",(0,t.jsx)(r.h3,{id:"optional-feature-gate",children:"Optional: feature-gate"}),"\n",(0,t.jsx)(r.p,{children:"Feature-gate controls some influential features in Kruise:"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Name"}),(0,t.jsx)(r.th,{children:"Description"}),(0,t.jsx)(r.th,{children:"Default"}),(0,t.jsx)(r.th,{children:"Effect (if closed)"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PodWebhook"})}),(0,t.jsxs)(r.td,{children:["Whether to open a webhook for Pod ",(0,t.jsx)(r.strong,{children:"create"})]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"SidecarSet/KruisePodReadinessGate disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"KruiseDaemon"})}),(0,t.jsxs)(r.td,{children:["Whether to deploy ",(0,t.jsx)(r.code,{children:"kruise-daemon"})," DaemonSet"]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"ImagePulling/ContainerRecreateRequest disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"DaemonWatchingPod"})}),(0,t.jsxs)(r.td,{children:["Should each ",(0,t.jsx)(r.code,{children:"kruise-daemon"})," watch pods on the same node"]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"For in-place update with same imageID or env from labels/annotations"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"CloneSetShortHash"})}),(0,t.jsx)(r.td,{children:"Enables CloneSet controller only set revision hash name to pod label"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"CloneSet name can not be longer than 54 characters"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"KruisePodReadinessGate"})}),(0,t.jsx)(r.td,{children:"Enables Kruise webhook to inject 'KruisePodReady' readiness-gate to all Pods during creation"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"The readiness-gate will only be injected to Pods created by Kruise workloads"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PreDownloadImageForInPlaceUpdate"})}),(0,t.jsx)(r.td,{children:"Enables CloneSet controller to create ImagePullJobs to pre-download images for in-place update"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"No image pre-download for in-place update"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"CloneSetPartitionRollback"})}),(0,t.jsx)(r.td,{children:"Enables CloneSet controller to rollback Pods to currentRevision when number of updateRevision pods is bigger than (replicas - partition)"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"CloneSet will only update Pods to updateRevision"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"ResourcesDeletionProtection"})}),(0,t.jsx)(r.td,{children:"Enables protection for resources deletion"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"No protection for resources deletion"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"TemplateNoDefaults"})}),(0,t.jsx)(r.td,{children:"Whether to disable defaults injection for pod/pvc template in workloads"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"Should not close this feature if it has open"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PodUnavailableBudgetDeleteGate"})}),(0,t.jsx)(r.td,{children:"Enables PodUnavailableBudget for pod deletion, eviction"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"No protection for pod deletion, eviction"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PodUnavailableBudgetUpdateGate"})}),(0,t.jsx)(r.td,{children:"Enables PodUnavailableBudget for pod.Spec update"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"No protection for in-place update"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"WorkloadSpread"})}),(0,t.jsx)(r.td,{children:"Enables WorkloadSpread to manage multi-domain and elastic deploy"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"WorkloadSpread disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"InPlaceUpdateEnvFromMetadata"})}),(0,t.jsx)(r.td,{children:"Enables Kruise to in-place update a container in Pod when its env from labels/annotations changed and pod is in-place updating"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"Only container image can be in-place update"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"StatefulSetAutoDeletePVC"})}),(0,t.jsx)(r.td,{children:"Enables policies controlling deletion of PVCs created by a StatefulSet"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"No deletion of PVCs by StatefulSet"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PreDownloadImageForDaemonSetUpdate"})}),(0,t.jsx)(r.td,{children:"Enables DaemonSet controller to create ImagePullJobs to pre-download images for in-place update"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"No image pre-download for in-place update"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"PodProbeMarkerGate"})}),(0,t.jsx)(r.td,{children:"Whether to turn on PodProbeMarker ability"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"true"})}),(0,t.jsx)(r.td,{children:"PodProbeMarker disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"SidecarSetPatchPodMetadataDefaultsAllowed"})}),(0,t.jsx)(r.td,{children:"Allow SidecarSet patch any annotations to Pod Object"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"Annotations are not allowed to patch randomly and need to be configured via SidecarSet_PatchPodMetadata_WhiteList"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"SidecarTerminator"})}),(0,t.jsx)(r.td,{children:"SidecarTerminator enables SidecarTerminator to stop sidecar containers when all main containers exited"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"SidecarTerminator disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"CloneSetEventHandlerOptimization"})}),(0,t.jsx)(r.td,{children:"CloneSetEventHandlerOptimization enable optimization for cloneset-controller to reduce the queuing frequency cased by pod update"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"optimization for cloneset-controller to reduce the queuing frequency cased by pod update disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"ImagePullJobGate"})}),(0,t.jsx)(r.td,{children:"Enables ImagePullJob to pre-download images"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"ImagePullJob disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"ResourceDistributionGate"})}),(0,t.jsx)(r.td,{children:"Enables ResourceDistribution to distribute configmaps or secret resources"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"ResourceDistribution disabled"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"DeletionProtectionForCRDCascadingGate"})}),(0,t.jsx)(r.td,{children:"Enables DeletionProtection for crd cascading deletion"}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"false"})}),(0,t.jsx)(r.td,{children:"DeletionProtection for crd cascading deletion disabled"})]})]})]}),"\n",(0,t.jsx)(r.p,{children:"If you want to configure the feature-gate, just set the parameter when install or upgrade. Such as:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="ResourcesDeletionProtection=true\\,PreDownloadImageForInPlaceUpdate=true"\n'})}),"\n",(0,t.jsxs)(r.p,{children:["If you want to enable all feature-gates, set the parameter as ",(0,t.jsx)(r.code,{children:"featureGates=AllAlpha=true"}),"."]}),"\n",(0,t.jsx)(r.h3,{id:"optional-the-local-image-for-china",children:"Optional: the local image for China"}),"\n",(0,t.jsx)(r.p,{children:"If you are in China and have problem to pull image from official DockerHub, you can use the registry hosted on Alibaba Cloud:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:"$ helm install kruise https://... --set  manager.image.repository=openkruise-registry.cn-shanghai.cr.aliyuncs.com/openkruise/kruise-manager\n"})}),"\n",(0,t.jsx)(r.h2,{id:"best-practices",children:"Best Practices"}),"\n",(0,t.jsx)(r.h3,{id:"installation-parameters-for-k3s",children:"Installation parameters for K3s"}),"\n",(0,t.jsxs)(r.p,{children:["Usually K3s has the different runtime path from the default ",(0,t.jsx)(r.code,{children:"/var/run"}),". So you have to set ",(0,t.jsx)(r.code,{children:"daemon.socketLocation"})," to the real runtime socket path on your K3s node (e.g. ",(0,t.jsx)(r.code,{children:"/run/k3s"})," or ",(0,t.jsx)(r.code,{children:"/var/run/k3s/"}),")."]}),"\n",(0,t.jsx)(r.h3,{id:"installation-parameters-for-aws-eks",children:"Installation parameters for AWS EKS"}),"\n",(0,t.jsx)(r.p,{children:"When using a custom CNI (such as Weave or Calico) on EKS, the webhook cannot be reached by default. This happens because the control plane cannot be configured to run on a custom CNI on EKS, so the CNIs differ between control plane and worker nodes."}),"\n",(0,t.jsxs)(r.p,{children:["To address this, the webhook can be run in the host network so it can be reached, by setting ",(0,t.jsx)(r.code,{children:"--set manager.hostNetwork=true"})," when use helm install or upgrade."]}),"\n",(0,t.jsx)(r.h3,{id:"support-webhook-ca-injection-using-external-certification-management-tool",children:"Support webhook CA injection using external certification management tool"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,t.jsx)(r.p,{children:"Kruise needs certificates to enable mutating, validating and conversion webhooks. By default, kruise will generate self-signed certificates for webhook server.\nIf you want to use external certification management tool, e.g. cert-manager, you can follow these steps when install or upgrade:"}),"\n",(0,t.jsxs)(r.ol,{children:["\n",(0,t.jsxs)(r.li,{children:["Install external certification management tool, e.g. ",(0,t.jsx)(r.a,{href:"https://cert-manager.io/docs/installation/helm/",children:"cert-manager"}),"."]}),"\n",(0,t.jsx)(r.li,{children:"Create issuer and certificate resources if you have not done this before."}),"\n"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-yaml",children:"apiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: kruise-webhook-certs\n  # consistent with installation.namespace\n  namespace: kruise-system\nspec:\n  # where to store the certificates\n  # cert-manager would generate a secret kruise-system/kruise-webhook-certs with the certificates\n  # DO NOT CHANGE THE SECRET NAME SINCE KRUISE READ CERTS FROM THIS SECRET\n  secretName: kruise-webhook-certs\n  dnsNames:\n  - kruise-webhook-service.kruise-system.svc\n  - localhost\n  issuerRef:\n    name: selfsigned-kruise\n    kind: Issuer\n---\napiVersion: cert-manager.io/v1\nkind: Issuer\nmetadata:\n  name: selfsigned-kruise\n  namespace: kruise-system\nspec:\n  selfSigned: {}\n"})}),"\n",(0,t.jsxs)(r.ol,{start:"3",children:["\n",(0,t.jsx)(r.li,{children:"During installation and upgrade, enable external certs support by setting featureGates=EnableExternalCerts=true and specify extra annotations that should be added to webhookconfiguration and CRD."}),"\n"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{children:'helm install kruise https://... --set featureGates="EnableExternalCerts=true" --set-json externalCerts.annotations=\'{"cert-manager.io/inject-ca-from":"kruise-system/kruise-webhook-certs"}\'\n'})}),"\n",(0,t.jsxs)(r.p,{children:["Visit ",(0,t.jsx)(r.a,{href:"https://cert-manager.io/docs/concepts/ca-injector/",children:"CA Injector - cert manager"})," for more details."]}),"\n",(0,t.jsx)(r.h3,{id:"structured-logs",children:"Structured Logs"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,t.jsx)(r.p,{children:"Logs are an essential aspect of observability and a critical tool for debugging. But OpenKruise logs have traditionally been unstructured strings, making any automated parsing difficult and any downstream processing, analysis, or querying challenging to do reliably."}),"\n",(0,t.jsxs)(r.p,{children:["From OpenKruise 1.7, we are adding support for structured logs, which natively support (key, value) pairs and object references.\nAnd logs can also be outputted in JSON format using ",(0,t.jsx)(r.code,{children:"helm install ... --set manager.loggingFormat=json"}),"."]}),"\n",(0,t.jsx)(r.p,{children:"For example, this invocation of InfoS:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{children:'klog.V(3).InfoS("SidecarSet updated status success", "sidecarSet", klog.KObj(sidecarSet), "matchedPods", status.MatchedPods,\n"updatedPods", status.UpdatedPods, "readyPods", status.ReadyPods, "updateReadyPods", status.UpdatedReadyPods)\n'})}),"\n",(0,t.jsx)(r.p,{children:"will result in this log:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{children:'I0821 14:22:35.587919       1 sidecarset_processor.go:280] "SidecarSet updated status success" sidecarSet="test-sidecarset" matchedPods=1 updatedPods=1 readyPods=1 updateReadyPods=1\n'})}),"\n",(0,t.jsxs)(r.p,{children:["Or, if ",(0,t.jsx)(r.code,{children:"helm install ... --set manager.loggingFormat=json"}),", it will result in this output:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-json",children:'{\n  "ts": 1724239224606.642,\n  "caller": "sidecarset/sidecarset_processor.go:280",\n  "msg": "SidecarSet updated status success",\n  "v": 3,\n  "sidecarSet": {\n    "name": "test-sidecarset"\n  },\n  "matchedPods": 1,\n  "updatedPods": 1,\n  "readyPods": 0,\n  "updateReadyPods": 0\n}\n'})}),"\n",(0,t.jsx)(r.h2,{id:"uninstall",children:"Uninstall"}),"\n",(0,t.jsx)(r.p,{children:"Note that this will lead to all resources created by Kruise, including webhook configurations, services, namespace, CRDs, CR instances and Pods managed by Kruise controller, to be deleted!"}),"\n",(0,t.jsx)(r.p,{children:"Please do this ONLY when you fully understand the consequence."}),"\n",(0,t.jsx)(r.p,{children:"To uninstall kruise if it is installed with helm charts:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:'$ helm uninstall kruise\nrelease "kruise" uninstalled\n'})}),"\n",(0,t.jsx)(r.h2,{id:"kruise-state-metrics",children:"Kruise State Metrics"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://github.com/openkruise/kruise-state-metrics",children:"kruise-state-metrics"})," is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.\nIt is not focused on the health of the individual OpenKruise components, but rather on the health of the various objects inside, such as clonesets, advanced statefulsets and sidecarsets."]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-bash",children:"# Firstly add openkruise charts repository if you haven't do this.\n$ helm repo add openkruise https://openkruise.github.io/charts/\n\n# [Optional]\n$ helm repo update\n\n# Install the latest version.\n$ helm install kruise openkruise/kruise-state-metrics --version 0.1.0\n"})})]})}function h(e={}){const{wrapper:r}={...(0,i.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}}}]);
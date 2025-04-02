"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1033],{28453:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>o});var l=a(96540);const t={},s=l.createContext(t);function i(e){const n=l.useContext(s);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),l.createElement(s.Provider,{value:n},e.children)}},65537:(e,n,a)=>{a.d(n,{A:()=>w});var l=a(96540),t=a(34164),s=a(65627),i=a(56347),o=a(50372),r=a(30604),d=a(11861),c=a(78749);function u(e){return l.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,l.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:a}=e;return(0,l.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:a,attributes:l,default:t}}=e;return{value:n,label:a,attributes:l,default:t}}))}(a);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function m(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:a}=e;const t=(0,i.W6)(),s=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,r.aZ)(s),(0,l.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(t.location.search);n.set(s,e),t.replace({...t.location,search:n.toString()})}),[s,t])]}function g(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,s=h(e),[i,r]=(0,l.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const l=a.find((e=>e.default))??a[0];if(!l)throw new Error("Unexpected error: 0 tabValues");return l.value}({defaultValue:n,tabValues:s}))),[d,u]=p({queryString:a,groupId:t}),[g,f]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,s]=(0,c.Dv)(a);return[t,(0,l.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:t}),b=(()=>{const e=d??g;return m({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{b&&r(b)}),[b]);return{selectedValue:i,selectValue:(0,l.useCallback)((e=>{if(!m({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);r(e),u(e),f(e)}),[u,f,s]),tabValues:s}}var f=a(9136);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=a(74848);function v(e){let{className:n,block:a,selectedValue:l,selectValue:i,tabValues:o}=e;const r=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.a_)(),c=e=>{const n=e.currentTarget,a=r.indexOf(n),t=o[a].value;t!==l&&(d(n),i(t))},u=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=r.indexOf(e.currentTarget)+1;n=r[a]??r[0];break}case"ArrowLeft":{const a=r.indexOf(e.currentTarget)-1;n=r[a]??r[r.length-1];break}}n?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.A)("tabs",{"tabs--block":a},n),children:o.map((e=>{let{value:n,label:a,attributes:s}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:l===n?0:-1,"aria-selected":l===n,ref:e=>{r.push(e)},onKeyDown:u,onClick:c,...s,className:(0,t.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":l===n}),children:a??n},n)}))})}function j(e){let{lazy:n,children:a,selectedValue:s}=e;const i=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===s));return e?(0,l.cloneElement)(e,{className:(0,t.A)("margin-top--md",e.props.className)}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,l.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function y(e){const n=g(e);return(0,x.jsxs)("div",{className:(0,t.A)("tabs-container",b.tabList),children:[(0,x.jsx)(v,{...n,...e}),(0,x.jsx)(j,{...n,...e})]})}function w(e){const n=(0,f.A)();return(0,x.jsx)(y,{...e,children:u(e.children)},String(n))}},79329:(e,n,a)=>{a.d(n,{A:()=>i});a(96540);var l=a(34164);const t={tabItem:"tabItem_Ymn6"};var s=a(74848);function i(e){let{children:n,hidden:a,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,l.A)(t.tabItem,i),hidden:a,children:n})}},81985:(e,n,a)=>{a.d(n,{A:()=>l});const l=a.p+"assets/images/imagepulling-1963144d8f1b12d5603c3606585a0b00.png"},92336:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>d});const l=JSON.parse('{"id":"user-manuals/imagepulljob","title":"ImagePullJob","description":"NodeImage and ImagePullJob are new CRDs provided since Kruise v0.8.0 version.","source":"@site/versioned_docs/version-v1.8/user-manuals/imagepulljob.md","sourceDirName":"user-manuals","slug":"/user-manuals/imagepulljob","permalink":"/docs/user-manuals/imagepulljob","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/imagepulljob.md","tags":[],"version":"v1.8","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"ImagePullJob"},"sidebar":"docs","previous":{"title":"Container Restart","permalink":"/docs/user-manuals/containerrecreaterequest"},"next":{"title":"ResourceDistribution","permalink":"/docs/user-manuals/resourcedistribution"}}');var t=a(74848),s=a(28453);a(65537),a(79329);const i={title:"ImagePullJob"},o=void 0,r={},d=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"ImagePullJob (high-level)",id:"imagepulljob-high-level",level:2},{value:"Configure secrets",id:"configure-secrets",level:3},{value:"Configure image credential provider",id:"configure-image-credential-provider",level:3},{value:"a. Configure image credential provider on AWS:",id:"a-configure-image-credential-provider-on-aws",level:4},{value:"Attach metadata into cri interface",id:"attach-metadata-into-cri-interface",level:3},{value:"Image Pull Policy support &#39;Always&#39;",id:"image-pull-policy-support-always",level:3},{value:"ImageListPullJob",id:"imagelistpulljob",level:2},{value:"NodeImage (low-level)",id:"nodeimage-low-level",level:2},{value:"FAQ",id:"faq",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"NodeImage and ImagePullJob are new CRDs provided since Kruise v0.8.0 version."}),"\n",(0,t.jsx)(n.p,{children:"Kruise will create a NodeImage for each Node, and it contains images that should be downloaded on this Node."}),"\n",(0,t.jsx)(n.p,{children:"Users can create an ImagePullJob to declare an image should be downloaded on which nodes."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Image Pulling",src:a(81985).A+"",width:"3053",height:"1653"})}),"\n",(0,t.jsxs)(n.p,{children:["Note that the NodeImage is quite ",(0,t.jsx)(n.strong,{children:"a low-level API"}),". You should only use it when you prepare to pull an image on a definite Node.\nOtherwise, you should ",(0,t.jsx)(n.strong,{children:"use the ImagePullJob to pull an image on a batch of Nodes."})]}),"\n",(0,t.jsx)(n.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Since kruise v1.5.0"})," ImagePullJob/ImageListPullJob feature is turned off by default to reduce the privilege of default installation. One can turn it on by setting feature-gate ImagePullJobGate."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:'$ helm install/upgrade kruise https://... --set featureGates="ImagePullJobGate=true"\n'})}),"\n",(0,t.jsx)(n.h2,{id:"imagepulljob-high-level",children:"ImagePullJob (high-level)"}),"\n",(0,t.jsxs)(n.p,{children:["ImagePullJob is a ",(0,t.jsx)(n.strong,{children:"namespaced-scope"})," resource."]}),"\n",(0,t.jsxs)(n.p,{children:["API definition: ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nmetadata:\n  name: job-with-always\nspec:\n  image: nginx:1.9.1   # [required] image to pull\n  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1\n  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n# podSelector:         # [optional] label selector over pods that should pull image on nodes of these pods. Mutually exclusive with selector.\n#   matchLabels:\n#     pod-label: xxx\n#   matchExpressions:\n#   - key: pod-label\n#     operator: In\n#     values:\n#     - xxx\n  completionPolicy:\n    type: Always                  # [optional] defaults to Always\n    activeDeadlineSeconds: 1200   # [optional] no default, only work for Always type\n    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Always type\n  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You can write the names or label selector in the ",(0,t.jsx)(n.code,{children:"selector"})," field to assign Nodes ",(0,t.jsx)(n.strong,{children:"(only one of them can be set)"}),".\nIf no ",(0,t.jsx)(n.code,{children:"selector"})," is set, the image will be pulled on all Nodes in the cluster."]}),"\n",(0,t.jsxs)(n.p,{children:["Or you can write the podSelector to pull image on nodes of these pods. ",(0,t.jsx)(n.code,{children:"podSelector"})," is mutually exclusive with ",(0,t.jsx)(n.code,{children:"selector"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"Also, ImagePullJob has two completionPolicy types:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Always"})," means this job will eventually complete with either failed or succeeded.","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"activeDeadlineSeconds"}),": timeout duration for this job"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"ttlSecondsAfterFinished"}),": after this job finished (including success or failure) over this time, this job will be removed"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Never"})," means this job will never complete, it will continuously pull image on the desired Nodes every day."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"configure-secrets",children:"Configure secrets"}),"\n",(0,t.jsx)(n.p,{children:"If the image is in a private registry, you may want to configure the pull secrets for the image:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\nspec:\n  pullSecrets:\n  - secret-name1\n  - secret-name2\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Because of ImagePullJob is a namespaced-scope resource, the secrets should be in the same namespace of this ImagePullJob,\nand you should only put the secret names into ",(0,t.jsx)(n.code,{children:"pullSecrets"})," field."]}),"\n",(0,t.jsxs)(n.p,{children:["You can also use ",(0,t.jsx)(n.strong,{children:"Configure image credential provider"})," for private registry."]}),"\n",(0,t.jsx)(n.h3,{id:"configure-image-credential-provider",children:"Configure image credential provider"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,t.jsxs)(n.p,{children:["Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry using exec plugins. Refer ",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/kubelet-credential-provider/",children:"Community Documentation"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"OpenKruise also supports the same way for pre-download image with the following steps:"}),"\n",(0,t.jsx)(n.h4,{id:"a-configure-image-credential-provider-on-aws",children:"a. Configure image credential provider on AWS:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Install ",(0,t.jsx)(n.a,{href:"https://github.com/awslabs/amazon-ecr-credential-helper",children:"AWS"}),"'s credential provisioning plugin on k8s nodes."]}),"\n",(0,t.jsx)(n.li,{children:"Create credential-provider-config Configmap in K8S:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: credential-provider-config\n  namespace: kruise-system\ndata:\n  CredentialProviderPlugin.yaml: |\n    apiVersion: kubelet.config.k8s.io/v1\n    kind: CredentialProviderConfig\n    providers:\n    # name is the required name of the credential provider.\n    - name: ecr-credential-provider\n      matchImages:\n      - "*.dkr.ecr.*.amazonaws.com"\n      - "*.dkr.ecr.*.amazonaws.com.cn"\n      - "*.dkr.ecr-fips.*.amazonaws.com"\n      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"\n      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"\n      defaultCacheDuration: "12h"\n      apiVersion: credentialprovider.kubelet.k8s.io/v1\n      env:\n      - name: AWS_PROFILE\n        value: temp\n\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsxs)(n.li,{children:["Install kruise with AWS ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html",children:"Shared Credentials File"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"If you have a shared credentials file($HOME/.aws/credentials) on every machine, you can mount the directory to kruise-daemon for authentication, as follows:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"helm install kruise https://... --set installation.createNamespace=false --set daemon.credentialProvider.enable=true --set daemon.credentialProvider.hostPath=/etc/eks/image-credential-provider --set daemon.credentialProvider.configmap=credential-provider-config --set daemon.credentialProvider.awsCredentialsDir=/root/.aws\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsx)(n.li,{children:"Create an ImagePullJob, authenticate the image repository via the above plugin, and complete pre-download image."}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Note:"})," If other cloud vendors (e.g., Tencent Cloud) have a similar mechanism, it should work. If you have similar needs, please contact us."]}),"\n",(0,t.jsx)(n.h3,{id:"attach-metadata-into-cri-interface",children:"Attach metadata into cri interface"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.4.0"]}),"\n",(0,t.jsx)(n.p,{children:"When kubelet creates pods, kubelet will attach pod metadata as podSandboxConfig params in the PullImage CRI interface.\nThe OpenKruise ImagePullJob also supports the similar capability, as follows:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  sandboxConfig:\n    annotations:\n      io.kubernetes.image.metrics.tags: "cluster=cn-shanghai"\n    labels:\n      io.kubernetes.image.app: "foo"\n'})}),"\n",(0,t.jsx)(n.h3,{id:"image-pull-policy-support-always",children:"Image Pull Policy support 'Always'"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"spec.imagePullPolicy=Always"})," means that kruise always attempts to pull the latest image, even if with the name as previous one."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"spec.imagePullPolicy=IfNotPresent"})," means that kruise only pull the image if it isn't present on node."]}),"\n",(0,t.jsx)(n.li,{children:"Defaults is IfNotPresent."}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  imagePullPolicy: Always | IfNotPresent\n"})}),"\n",(0,t.jsx)(n.h2,{id:"imagelistpulljob",children:"ImageListPullJob"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,t.jsx)(n.p,{children:"ImagePullJob can only support a single image pre-download, one can use multiple ImagePullJob to download multiple images, or use ImageListPullJob to pre-download multiple images in a single job, as follows:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImageListPullJob\nmetadata:\n  name: job-with-always\nspec:\n  images:\n  - nginx:1.9.1   # [required] image to pull\n  - busybox:1.29.2\n  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1\n  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n  completionPolicy:\n    type: Always                  # [optional] defaults to Always\n    activeDeadlineSeconds: 1200   # [optional] no default, only work for Always type\n    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Always type\n  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n"})}),"\n",(0,t.jsx)(n.h2,{id:"nodeimage-low-level",children:"NodeImage (low-level)"}),"\n",(0,t.jsxs)(n.p,{children:["NodeImage is a ",(0,t.jsx)(n.strong,{children:"cluster-scope"})," resource."]}),"\n",(0,t.jsxs)(n.p,{children:["API definition: ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go"})]}),"\n",(0,t.jsx)(n.p,{children:"When Kruise has been installed, nodeimage-controller will create NodeImages for Nodes with the same names immediately.\nAnd when a Node has been added or removed, nodeimage-controller will also create or delete NodeImage for this Node."}),"\n",(0,t.jsx)(n.p,{children:"What's more, nodeimage-controller will also synchronize labels from Node to NodeImage. So the NodeImage and Node always have\nthe same name and labels. You can get NodeImage with the Node name, or list NodeImage with the Node labels as selector."}),"\n",(0,t.jsx)(n.p,{children:"Typically, an empty NodeImage looks like this:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: NodeImage\nmetadata:\n  labels:\n    kubernetes.io/arch: amd64\n    kubernetes.io/os: linux\n    # ...\n  name: node-xxx\n  # ...\nspec: {}\nstatus:\n  desired: 0\n  failed: 0\n  pulling: 0\n  succeeded: 0\n"})}),"\n",(0,t.jsxs)(n.p,{children:["If you want to pull an image such as ",(0,t.jsx)(n.code,{children:"ubuntu:latest"})," on this Node, you can:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"kubectl edit nodeimage node-xxx"})," and write below into it (ignore the comments):"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\nspec:\n  images:\n    ubuntu:  # image name\n      tags:\n      - tag: latest  # image tag\n        pullPolicy:\n          ttlSecondsAfterFinished: 300  # [required] after this image pulling finished (including success or failure) over 300s, this task will be removed\n          timeoutSeconds: 600           # [optional] timeout duration for once pulling, defaults to 600\n          backoffLimit: 3               # [optional] retry times for pulling, defaults to 3\n          activeDeadlineSeconds: 1200   # [optional] timeout duration for this task, no default\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.code,{children:'kubectl patch nodeimage node-xxx --type=merge -p \'{"spec":{"images":{"ubuntu":{"tags":[{"tag":"latest","pullPolicy":{"ttlSecondsAfterFinished":300}}]}}}}\''})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["You can read the NodeImage status using ",(0,t.jsx)(n.code,{children:"kubectl get nodeimage node-xxx -o yaml"}),",\nand you will find the task removed from spec and status after it has finished over 300s."]}),"\n",(0,t.jsx)(n.h2,{id:"faq",children:"FAQ"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"If ImagePullJob failed, as follows:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"% kubectl get imagepulljob\n\nNAME              TOTAL   ACTIVE   SUCCEED   FAILED   AGE     MESSAGE\njob-with-always   4       0        0         4        9m49s   job has completed\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"You can find out the failed node.name from imagePullJob.status, as follows:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'% kubectl get imagepulljob job-with-always -oyaml\n\napiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nstatus:\n  active: 0\n  completionTime: "2024-08-09T10:06:26Z"\n  desired: 4\n  failed: 4\n  failedNodes:\n  - cn-hangzhou.x.125\n  - cn-hangzhou.x.126\n  - cn-hangzhou.x.127\n  - cn-hangzhou.x.128\n  message: job has completed\n  startTime: "2024-08-09T10:03:52Z"\n  succeeded: 0\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"You can see the exact cause of failure via NodeImage, as follows:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'% kubectl get nodeimage cn-hangzhou.x.125 -oyaml\n\napiVersion: apps.kruise.io/v1alpha1\nkind: NodeImage\nstatus:\n  desired: 1\n  failed: 1\n  imageStatuses:\n    nginx:\n      tags:\n      - completionTime: "2024-08-09T10:06:22Z"\n        message: \'Failed to pull image reference "nginx:1.9.1": rpc error: code =\n          DeadlineExceeded desc = failed to pull and unpack image "docker.io/library/nginx:1.9.1":\n          failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://production.cloudflare.docker.com/registry-v2/docker/registry/v2/blobs/sha256/c5/c5dd085dcc7c78a296c80b87916831fd19a3f447d94b99580ccd19a052720211/data?verify=1723200943-x6RCoD1a2P3aEdh1%!B(MISSING)XcQSFe2h%!B(MISSING)U%!D(MISSING)":\n          dial tcp 10.1.1.1:443: i/o timeout\'\n        phase: Failed\n        startTime: "2024-08-09T10:03:52Z"\n        tag: 1.9.1\n  pulling: 0\n  succeeded: 0\n'})})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}}}]);
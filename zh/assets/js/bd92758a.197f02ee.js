"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5565],{13637:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>t,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>d});const l=JSON.parse('{"id":"user-manuals/imagepulljob","title":"ImagePullJob","description":"NodeImage \u548c ImagePullJob \u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684 CRD\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/version-v1.8/user-manuals/imagepulljob.md","sourceDirName":"user-manuals","slug":"/user-manuals/imagepulljob","permalink":"/zh/docs/user-manuals/imagepulljob","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/imagepulljob.md","tags":[],"version":"v1.8","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"ImagePullJob"},"sidebar":"docs","previous":{"title":"Container Restart","permalink":"/zh/docs/user-manuals/containerrecreaterequest"},"next":{"title":"ResourceDistribution","permalink":"/zh/docs/user-manuals/resourcedistribution"}}');var a=s(74848),i=s(28453);const o={title:"ImagePullJob"},r=void 0,t={},d=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"ImagePullJob (high-level)",id:"imagepulljob-high-level",level:2},{value:"\u914d\u7f6e secrets",id:"\u914d\u7f6e-secrets",level:3},{value:"\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",id:"\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",level:3},{value:"a. AWS\u4e0a\u9762\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",id:"a-aws\u4e0a\u9762\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",level:4},{value:"Attach metadata into cri interface",id:"attach-metadata-into-cri-interface",level:3},{value:"\u955c\u50cf\u62c9\u53d6\u652f\u6301 &#39;Always&#39; \u7b56\u7565",id:"\u955c\u50cf\u62c9\u53d6\u652f\u6301-always-\u7b56\u7565",level:3},{value:"ImageListPullJob",id:"imagelistpulljob",level:2},{value:"NodeImage (low-level)",id:"nodeimage-low-level",level:2},{value:"FAQ",id:"faq",level:2}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"NodeImage \u548c ImagePullJob \u662f\u4ece Kruise v0.8.0 \u7248\u672c\u5f00\u59cb\u63d0\u4f9b\u7684 CRD\u3002"}),"\n",(0,a.jsx)(n.p,{children:"Kruise \u4f1a\u81ea\u52a8\u4e3a\u6bcf\u4e2a Node \u521b\u5efa\u4e00\u4e2a NodeImage\uff0c\u5b83\u5305\u542b\u4e86\u54ea\u4e9b\u955c\u50cf\u9700\u8981\u5728\u8fd9\u4e2a Node \u4e0a\u505a\u9884\u70ed\u3002"}),"\n",(0,a.jsx)(n.p,{children:"\u7528\u6237\u80fd\u521b\u5efa ImagePullJob \u5bf9\u8c61\uff0c\u6765\u6307\u5b9a\u4e00\u4e2a\u955c\u50cf\u8981\u5728\u54ea\u4e9b Node \u4e0a\u505a\u9884\u70ed\u3002"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image Pulling",src:s(81985).A+"",width:"3053",height:"1653"})}),"\n",(0,a.jsxs)(n.p,{children:["\u6ce8\u610f\uff0cNodeImage \u662f\u4e00\u4e2a",(0,a.jsx)(n.strong,{children:"\u504f\u5e95\u5c42\u7684 API"}),"\uff0c\u4e00\u822c\u53ea\u5728\u4f60\u8981\u660e\u786e\u5728\u67d0\u4e00\u4e2a\u8282\u70b9\u4e0a\u505a\u4e00\u6b21\u9884\u70ed\u7684\u65f6\u5019\u624d\u4f7f\u7528\uff0c\u5426\u5219\u4f60\u90fd\u5e94\u8be5",(0,a.jsx)(n.strong,{children:"\u4f7f\u7528 ImagePullJob \u6765\u6307\u5b9a\u67d0\u4e2a\u955c\u50cf\u5728\u4e00\u6279\u8282\u70b9\u4e0a\u505a\u9884\u70ed"}),"\u3002"]}),"\n",(0,a.jsx)(n.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"\u4ecekruise v1.5.0"}),"\u7248\u672c\u5f00\u59cb\uff0cImagePullJob/ImageListPullJob \u529f\u80fd\u9ed8\u8ba4\u5173\u95ed\uff0c\u4ee5\u964d\u4f4e\u9ed8\u8ba4\u5b89\u88c5\u7684\u6743\u9650\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7 feature-gate ",(0,a.jsx)(n.em,{children:"ImagePullJobGate"})," \u6765\u5f00\u542f\u3002"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'$ helm install/upgrade kruise https://... --set featureGates="ImagePullJobGate=true"\n'})}),"\n",(0,a.jsx)(n.h2,{id:"imagepulljob-high-level",children:"ImagePullJob (high-level)"}),"\n",(0,a.jsxs)(n.p,{children:["ImagePullJob \u662f\u4e00\u4e2a ",(0,a.jsx)(n.strong,{children:"namespaced-scope"})," \u7684\u8d44\u6e90\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["API \u5b9a\u4e49: ",(0,a.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/imagepulljob_types.go"})]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nmetadata:\n  name: job-with-always\nspec:\n  image: nginx:1.9.1   # [required] \u5b8c\u6574\u7684\u955c\u50cf\u540d name:tag\n  parallelism: 10      # [optional] \u6700\u5927\u5e76\u53d1\u62c9\u53d6\u7684\u8282\u70b9\u68b3\u7406, \u9ed8\u8ba4\u4e3a 1\n  selector:            # [optional] \u6307\u5b9a\u8282\u70b9\u7684 \u540d\u5b57\u5217\u8868 \u6216 \u6807\u7b7e\u9009\u62e9\u5668 (\u53ea\u80fd\u8bbe\u7f6e\u5176\u4e2d\u4e00\u79cd)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n# podSelector:         # [optional] \u901a\u8fc7 podSelector \u5339\u914dPod\uff0c\u5728\u8fd9\u4e9b Pod \u6240\u5728\u8282\u70b9\u4e0a\u62c9\u53d6\u955c\u50cf, \u4e0e selector \u4e0d\u80fd\u540c\u65f6\u8bbe\u7f6e.\n#   matchLabels:\n#     pod-label: xxx\n#   matchExpressions:\n#   - key: pod-label\n#      operator: In\n#        values:\n#        - xxx\n  completionPolicy:\n    type: Always                  # [optional] \u9ed8\u8ba4\u4e3a Always\n    activeDeadlineSeconds: 1200   # [optional] \u65e0\u9ed8\u8ba4\u503c, \u53ea\u5bf9 Always \u7c7b\u578b\u751f\u6548\n    ttlSecondsAfterFinished: 300  # [optional] \u65e0\u9ed8\u8ba4\u503c, \u53ea\u5bf9 Always \u7c7b\u578b\u751f\u6548\n  pullPolicy:                     # [optional] \u9ed8\u8ba4 backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\u4f60\u53ef\u4ee5\u5728 ",(0,a.jsx)(n.code,{children:"selector"})," \u5b57\u6bb5\u4e2d\u6307\u5b9a\u8282\u70b9\u7684 \u540d\u5b57\u5217\u8868 \u6216 \u6807\u7b7e\u9009\u62e9\u5668 ",(0,a.jsx)(n.strong,{children:"(\u53ea\u80fd\u8bbe\u7f6e\u5176\u4e2d\u4e00\u79cd)"}),"\uff0c\u5982\u679c\u6ca1\u6709\u8bbe\u7f6e ",(0,a.jsx)(n.code,{children:"selector"})," \u5219\u4f1a\u9009\u62e9\u6240\u6709\u8282\u70b9\u505a\u9884\u70ed\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["\u6216\u8005\u4f60\u53ef\u4ee5\u914d\u7f6e ",(0,a.jsx)(n.code,{children:"podSelector"})," \u6765\u5728\u8fd9\u4e9b pod \u6240\u5728\u8282\u70b9\u4e0a\u62c9\u53d6\u955c\u50cf\uff0c",(0,a.jsx)(n.code,{children:"podSelector"})," \u4e0e ",(0,a.jsx)(n.code,{children:"selector"})," \u4e0d\u80fd\u540c\u65f6\u8bbe\u7f6e\u3002"]}),"\n",(0,a.jsx)(n.p,{children:"\u540c\u65f6\uff0cImagePullJob \u6709\u4e24\u79cd completionPolicy \u7c7b\u578b:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"Always"})," \u8868\u793a\u8fd9\u4e2a job \u662f\u4e00\u6b21\u6027\u9884\u70ed\uff0c\u4e0d\u7ba1\u6210\u529f\u3001\u5931\u8d25\u90fd\u4f1a\u7ed3\u675f","\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"activeDeadlineSeconds"}),": \u6574\u4e2a job \u7684 deadline \u7ed3\u675f\u65f6\u95f4"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"ttlSecondsAfterFinished"}),": \u7ed3\u675f\u540e\u8d85\u8fc7\u8fd9\u4e2a\u65f6\u95f4\uff0c\u81ea\u52a8\u6e05\u7406\u5220\u9664 job"]}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"Never"})," \u8868\u793a\u8fd9\u4e2a job \u662f\u957f\u671f\u8fd0\u884c\u3001\u4e0d\u4f1a\u7ed3\u675f\uff0c\u5e76\u4e14\u4f1a\u6bcf\u5929\u90fd\u4f1a\u5728\u5339\u914d\u7684\u8282\u70b9\u4e0a\u91cd\u65b0\u9884\u70ed\u4e00\u6b21\u6307\u5b9a\u7684\u955c\u50cf"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u914d\u7f6e-secrets",children:"\u914d\u7f6e secrets"}),"\n",(0,a.jsx)(n.p,{children:"\u5982\u679c\u8fd9\u4e2a\u955c\u50cf\u6765\u81ea\u4e00\u4e2a\u79c1\u6709\u4ed3\u5e93\uff0c\u4f60\u53ef\u80fd\u9700\u8981\u914d\u7f6e\u4e00\u4e9b secret\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"# ...\nspec:\n  pullSecrets:\n  - secret-name1\n  - secret-name2\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\u56e0\u4e3a ImagePullJob \u662f\u4e00\u79cd namespaced-scope \u8d44\u6e90\uff0c\u8fd9\u4e9b secret \u5fc5\u987b\u5b58\u5728 ImagePullJob \u6240\u5728\u7684 namespace \u4e2d\u3002\n\u7136\u540e\u4f60\u53ea\u9700\u8981\u5728 ",(0,a.jsx)(n.code,{children:"pullSecrets"})," \u5b57\u6bb5\u4e2d\u5199\u4e0a\u8fd9\u4e9b secret \u7684\u540d\u5b57\u5373\u53ef\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["\u6b64\u5916\uff0c\u4f60\u4e5f\u53ef\u4ee5\u4f7f\u7528 ",(0,a.jsx)(n.strong,{children:"\u514d\u5bc6\u63d2\u4ef6\u65b9\u5f0f"})," \u6765\u8ba4\u8bc1\u79c1\u6709\u4ed3\u5e93\u3002"]}),"\n",(0,a.jsx)(n.h3,{id:"\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",children:"\u652f\u6301\u514d\u5bc6\u63d2\u4ef6"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,a.jsxs)(n.p,{children:["\u4ece Kubernetes v1.20 \u5f00\u59cb\uff0ckubelet \u53ef\u4ee5\u4f7f\u7528 exec \u63d2\u4ef6\u52a8\u6001\u83b7\u5f97\u9488\u5bf9\u67d0\u5bb9\u5668\u955c\u50cf\u5e93\u7684\u51ed\u636e\uff0c\u53c2\u8003",(0,a.jsx)(n.a,{href:"https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/",children:"\u793e\u533a\u6587\u6863"}),"\u3002"]}),"\n",(0,a.jsx)(n.p,{children:"OpenKruise\u4e5f\u652f\u6301\u7c7b\u4f3c\u7684\u65b9\u5f0f\u6765\u8fdb\u884c\u955c\u50cf\u9884\u70ed\uff0c\u6b65\u9aa4\u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.h4,{id:"a-aws\u4e0a\u9762\u652f\u6301\u514d\u5bc6\u63d2\u4ef6",children:"a. AWS\u4e0a\u9762\u652f\u6301\u514d\u5bc6\u63d2\u4ef6"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\u8282\u70b9\u4e0a\u9762\u5b89\u88c5 ",(0,a.jsx)(n.a,{href:"https://github.com/awslabs/amazon-ecr-credential-helper",children:"AWS"})," \u7684\u51ed\u636e\u63d0\u4f9b\u63d2\u4ef6\u3002"]}),"\n",(0,a.jsx)(n.li,{children:"\u521b\u5efa credential-provider-config Configmap\uff1a"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: credential-provider-config\n  namespace: kruise-system\ndata:\n  CredentialProviderPlugin.yaml: |\n    apiVersion: kubelet.config.k8s.io/v1\n    kind: CredentialProviderConfig\n    providers:\n    # \u9700\u4e0e\u514d\u5bc6\u62c9\u53d6\u63d2\u4ef6\u7684\u540d\u79f0\u76f8\u540c\n    - name: ecr-credential-provider\n      matchImages:\n      - "*.dkr.ecr.*.amazonaws.com"\n      - "*.dkr.ecr.*.amazonaws.com.cn"\n      - "*.dkr.ecr-fips.*.amazonaws.com"\n      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"\n      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"\n      defaultCacheDuration: "12h"\n      apiVersion: credentialprovider.kubelet.k8s.io/v1\n      env:\n      - name: AWS_PROFILE\n        value: temp\n'})}),"\n",(0,a.jsxs)(n.ol,{start:"3",children:["\n",(0,a.jsxs)(n.li,{children:["\u57fa\u4e8e ",(0,a.jsx)(n.a,{href:"https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html",children:"AWS\u5171\u4eab\u51ed\u8bc1\u6587\u4ef6\u65b9\u5f0f"})," \u5b89\u88c5 OpenKruise\uff1a"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"\u5982\u679c AWS Worker \u673a\u5668\u5df2\u7ecf\u5305\u542b\u51ed\u8bc1\u6587\u4ef6($HOME/.aws/credentials)\uff0c\u4f60\u53ef\u4ee5\u76f4\u63a5\u5c06 $HOME/.aws \u76ee\u5f55\u914d\u7f6e\u5230 kruise-daemon \u4e0a\u8fdb\u884c\u8ba4\u8bc1\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"helm install kruise https://... --set installation.createNamespace=false --set daemon.credentialProvider.enable=true --set daemon.credentialProvider.hostPath=/etc/eks/image-credential-provider --set daemon.credentialProvider.configmap=credential-provider-config --set daemon.credentialProvider.awsCredentialsDir=/root/.aws\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"4",children:["\n",(0,a.jsx)(n.li,{children:"\u521b\u5efa ImagePullJob\uff0c\u901a\u8fc7\u4e0a\u8ff0\u63d2\u4ef6\u8fdb\u884c\u955c\u50cf\u4ed3\u5e93\u8ba4\u8bc1\uff0c\u5b8c\u6210\u955c\u50cf\u9884\u70ed\u3002"}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"\u8bf4\u660e\uff1a"})," \u5982\u679c\u5176\u5b83\u7684\u4e91\u5382\u5546\uff08\u6bd4\u5982\uff1a\u817e\u8baf\u4e91\uff09\u6709\u7c7b\u4f3c\u7684\u673a\u5236\uff0c\u5e94\u8be5\u4e5f\u662f\u53ef\u4ee5\u5de5\u4f5c\u7684\u3002\u5982\u679c\u4f60\u6709\u7c7b\u4f3c\u7684\u573a\u666f\uff0c\u8bf7\u8054\u7cfb\u6211\u4eec\u3002"]}),"\n",(0,a.jsx)(n.h3,{id:"attach-metadata-into-cri-interface",children:"Attach metadata into cri interface"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.4.0"]}),"\n",(0,a.jsx)(n.p,{children:"\u5f53 Kubelet \u521b\u5efa Pod \u65f6\uff0cKubelet \u5c06\u4f1a attach metadata \u5230 container runtime cri \u63a5\u53e3\u3002OpenKruise \u955c\u50cf\u9884\u70ed\u540c\u6837\u652f\u6301\u7c7b\u4f3c\u7684\u80fd\u529b\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  sandboxConfig:\n    annotations:\n      io.kubernetes.image.metrics.tags: "cluster=cn-shanghai"\n    labels:\n      io.kubernetes.image.app: "foo"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"\u955c\u50cf\u62c9\u53d6\u652f\u6301-always-\u7b56\u7565",children:"\u955c\u50cf\u62c9\u53d6\u652f\u6301 'Always' \u7b56\u7565"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"spec.imagePullPolicy=Always"})," \u8868\u793a kruise \u6bcf\u6b21\u90fd\u4f1a\u5c1d\u8bd5\u62c9\u53d6\u6700\u65b0\u7684\u955c\u50cf\uff0c\u54ea\u6015\u955c\u50cf\u540d\u5b57\u6ca1\u6709\u6539\u53d8"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"spec.imagePullPolicy=IfNotPresent"})," \u8868\u793a kruise \u53ea\u6709\u955c\u50cf\u5728Node\u673a\u5668\u4e0d\u5b58\u5728\u65f6\uff0c\u624d\u4f1a\u62c9\u53d6\u955c\u50cf"]}),"\n",(0,a.jsx)(n.li,{children:"\u9ed8\u8ba4\u7b56\u7565\u662f IfNotPresent"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nspec:\n  ...\n  image: nginx:1.9.1\n  imagePullPolicy: Always | IfNotPresent\n"})}),"\n",(0,a.jsx)(n.h2,{id:"imagelistpulljob",children:"ImageListPullJob"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,a.jsx)(n.p,{children:"ImagePullJob \u4ec5\u4ec5\u80fd\u652f\u6301\u5355\u4e2a\u955c\u50cf\u7684\u9884\u70ed\uff0c\u4e3a\u4e86\u6ee1\u8db3\u591a\u4e2a\u955c\u50cf\u7684\u9884\u70ed\u9700\u6c42\uff0c\u65b0\u589e\u52a0 CRD ImageListPullJob \u6765\u6ee1\u8db3\u591a\u4e2a\u955c\u50cf\u7684\u9884\u70ed\uff0c\u9664\u4e86 images \u5b83\u7684\u5927\u90e8\u5206\u5b57\u6bb5\u4e0e ImagePullJob \u76f8\u540c\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ImageListPullJob\nmetadata:\n  name: job-with-always\nspec:\n  images:\n  - nginx:1.9.1   # [required] image to pull\n  - busybox:1.29.2\n  - ...\n  parallelism: 10      # [optional] the maximal number of Nodes that pull this image at the same time, defaults to 1\n  selector:            # [optional] the names or label selector to assign Nodes (only one of them can be set)\n    names:\n    - node-1\n    - node-2\n    matchLabels:\n      node-type: xxx\n  completionPolicy:\n    type: Always                  # [optional] defaults to Always\n    activeDeadlineSeconds: 1200   # [optional] no default, only work for Always type\n    ttlSecondsAfterFinished: 300  # [optional] no default, only work for Always type\n  pullPolicy:                     # [optional] defaults to backoffLimit=3, timeoutSeconds=600\n    backoffLimit: 3\n    timeoutSeconds: 300\n"})}),"\n",(0,a.jsx)(n.h2,{id:"nodeimage-low-level",children:"NodeImage (low-level)"}),"\n",(0,a.jsxs)(n.p,{children:["NodeImage \u662f\u4e00\u4e2a ",(0,a.jsx)(n.strong,{children:"cluster-scope"})," \u7684\u8d44\u6e90\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["API \u5b9a\u4e49: ",(0,a.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/nodeimage_types.go"})]}),"\n",(0,a.jsx)(n.p,{children:"\u5f53 Kruise \u88ab\u5b89\u88c5\u540e\uff0cnodeimage-controller \u4f1a\u81ea\u52a8\u4e3a\u6bcf\u4e2a Node \u521b\u5efa\u4e00\u4e2a\u540c\u540d\u7684 NodeImage\u3002\n\u5e76\u4e14\u5f53 Node \u53d1\u751f\u4f38\u7f29\u65f6\uff0cnodeimage-controller \u4e5f\u4f1a\u5bf9\u5e94\u7684\u521b\u5efa\u6216\u5220\u9664 NodeImage\u3002"}),"\n",(0,a.jsx)(n.p,{children:"\u9664\u6b64\u4e4b\u5916\uff0cnodeimage-controller \u4e5f\u4f1a\u5c06 Node \u4e0a\u7684 labels \u6807\u7b7e\u6301\u7eed\u540c\u6b65\u5230 NodeImage \u4e0a\u9762\uff0c\u56e0\u6b64\u5bf9\u5e94\u7684 NodeImage \u4e0e Node \u62e5\u6709\u76f8\u540c\u7684\u540d\u5b57\u548c\u6807\u7b7e\u3002\n\u7528\u6237\u53ef\u4ee5\u7528 Node \u540d\u5b57\u6765\u67e5\u8be2\u4e00\u4e2a NodeImage\uff0c\u6216\u8005\u7528 Node labels \u505a selector \u6765\u67e5\u8be2\u4e00\u6279 NodeImage\u3002"}),"\n",(0,a.jsx)(n.p,{children:"\u901a\u5e38\u6765\u8bf4\u4e00\u4e2a\u7a7a\u7684 NodeImage \u5982\u4e0b\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: NodeImage\nmetadata:\n  labels:\n    kubernetes.io/arch: amd64\n    kubernetes.io/os: linux\n    # ...\n  name: node-xxx\n  # ...\nspec: {}\nstatus:\n  desired: 0\n  failed: 0\n  pulling: 0\n  succeeded: 0\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\u5982\u679c\u4f60\u5e0c\u671b\u5728\u8fd9\u4e2a\u8282\u70b9\u4e0a\u62c9\u53bb\u4e00\u4e2a ",(0,a.jsx)(n.code,{children:"ubuntu:latest"})," \u955c\u50cf\uff0c\u4f60\u53ef\u4ee5\u6709\u4e24\u79cd\u65b9\u5f0f"]}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\u6267\u884c ",(0,a.jsx)(n.code,{children:"kubectl edit nodeimage node-xxx"})," \u5e76\u5c06\u4ee5\u4e0b\u5199\u5165\u5176\u4e2d\uff08\u5ffd\u7565\u6ce8\u91ca\uff09:"]}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"# ...\nspec:\n  images:\n    ubuntu:  # \u955c\u50cf name\n      tags:\n      - tag: latest  # \u955c\u50cf tag\n        pullPolicy:\n          ttlSecondsAfterFinished: 300  # [required] \u62c9\u53d6\u5b8c\u6210\uff08\u6210\u529f\u6216\u5931\u8d25\uff09\u8d85\u8fc7 300s \u540e\uff0c\u5c06\u8fd9\u4e2a\u4efb\u52a1\u4ece NodeImage \u4e2d\u6e05\u9664\n          timeoutSeconds: 600           # [optional] \u6bcf\u4e00\u6b21\u62c9\u53d6\u7684\u8d85\u65f6\u65f6\u95f4, \u9ed8\u8ba4\u4e3a 600\n          backoffLimit: 3               # [optional] \u62c9\u53d6\u7684\u91cd\u8bd5\u6b21\u6570\uff0c\u9ed8\u8ba4\u4e3a 3\n          activeDeadlineSeconds: 1200   # [optional] \u6574\u4e2a\u4efb\u52a1\u7684\u8d85\u65f6\u65f6\u95f4\uff0c\u65e0\u9ed8\u8ba4\u503c\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.code,{children:'kubectl patch nodeimage node-xxx --type=merge -p \'{"spec":{"images":{"ubuntu":{"tags":[{"tag":"latest","pullPolicy":{"ttlSecondsAfterFinished":300}}]}}}}\''})}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["\u4f60\u53ef\u4ee5\u6267\u884c ",(0,a.jsx)(n.code,{children:"kubectl get nodeimage node-xxx -o yaml"}),"\uff0c\u4ece status \u4e2d\u770b\u5230\u62c9\u53d6\u8fdb\u5ea6\u4ee5\u53ca\u7ed3\u679c\uff0c\u5e76\u4e14\u4f60\u4f1a\u53d1\u73b0\u62c9\u53d6\u5b8c\u6210 600s \u540e\u4efb\u52a1\u4f1a\u88ab\u6e05\u9664\u3002"]}),"\n",(0,a.jsx)(n.h2,{id:"faq",children:"FAQ"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"\u5982\u679c ImagePullJob \u5931\u8d25\u4e86\uff1a"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"% kubectl get imagepulljob\n\nNAME              TOTAL   ACTIVE   SUCCEED   FAILED   AGE     MESSAGE\njob-with-always   4       0        0         4        9m49s   job has completed\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsx)(n.li,{children:"\u4f60\u53ef\u4ee5\u901a\u8fc7 imagePullJob.status \u77e5\u9053\u5931\u8d25\u7684 Node \u540d\u5b57\uff1a"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'% kubectl get imagepulljob job-with-always -oyaml\n\napiVersion: apps.kruise.io/v1alpha1\nkind: ImagePullJob\nstatus:\n  active: 0\n  completionTime: "2024-08-09T10:06:26Z"\n  desired: 4\n  failed: 4\n  failedNodes:\n  - cn-hangzhou.x.125\n  - cn-hangzhou.x.126\n  - cn-hangzhou.x.127\n  - cn-hangzhou.x.128\n  message: job has completed\n  startTime: "2024-08-09T10:03:52Z"\n  succeeded: 0\n'})}),"\n",(0,a.jsxs)(n.ol,{start:"3",children:["\n",(0,a.jsx)(n.li,{children:"\u901a\u8fc7 NodeImage \u4f60\u53ef\u4ee5\u4e86\u89e3\u5230\u5177\u4f53\u7684\u5931\u8d25\u539f\u56e0\uff1a"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'% kubectl get nodeimage cn-hangzhou.x.125 -oyaml\n\napiVersion: apps.kruise.io/v1alpha1\nkind: NodeImage\nstatus:\n  desired: 1\n  failed: 1\n  imageStatuses:\n    nginx:\n      tags:\n      - completionTime: "2024-08-09T10:06:22Z"\n        message: \'Failed to pull image reference "nginx:1.9.1": rpc error: code =\n          DeadlineExceeded desc = failed to pull and unpack image "docker.io/library/nginx:1.9.1":\n          failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://production.cloudflare.docker.com/registry-v2/docker/registry/v2/blobs/sha256/c5/c5dd085dcc7c78a296c80b87916831fd19a3f447d94b99580ccd19a052720211/data?verify=1723200943-x6RCoD1a2P3aEdh1%!B(MISSING)XcQSFe2h%!B(MISSING)U%!D(MISSING)":\n          dial tcp 10.1.1.1:443: i/o timeout\'\n        phase: Failed\n        startTime: "2024-08-09T10:03:52Z"\n        tag: 1.9.1\n  pulling: 0\n  succeeded: 0\n'})})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>r});var l=s(96540);const a={},i=l.createContext(a);function o(e){const n=l.useContext(i);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),l.createElement(i.Provider,{value:n},e.children)}},81985:(e,n,s)=>{s.d(n,{A:()=>l});const l=s.p+"assets/images/imagepulling-1963144d8f1b12d5603c3606585a0b00.png"}}]);
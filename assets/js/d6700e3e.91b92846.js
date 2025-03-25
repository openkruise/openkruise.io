"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4593],{28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>r});var o=s(96540);const t={},a=o.createContext(t);function i(e){const n=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),o.createElement(a.Provider,{value:n},e.children)}},80835:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"cli-tool/kustomize-schema-generator","title":"Kustomize Schema Generator","description":"kruise-api provides tools for openkruise to generate kustomize schema files that support openkruise CRD, and provides the current available OpenAPI schema.","source":"@site/docs/cli-tool/kustomize-schema-generator.md","sourceDirName":"cli-tool","slug":"/cli-tool/kustomize-schema-generator","permalink":"/docs/next/cli-tool/kustomize-schema-generator","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/cli-tool/kustomize-schema-generator.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"Kustomize Schema Generator"},"sidebar":"docs","previous":{"title":"Kustomize ResourceDistribution Generator","permalink":"/docs/next/cli-tool/kustomize-plugin"},"next":{"title":"FAQ","permalink":"/docs/next/faq"}}');var t=s(74848),a=s(28453);const i={title:"Kustomize Schema Generator"},r=void 0,c={},l=[{value:"Schema Generator",id:"schema-generator",level:2},{value:"Schema Usage",id:"schema-usage",level:2},{value:"How to specify the schema file",id:"how-to-specify-the-schema-file",level:3},{value:"Example",id:"example",level:3}];function m(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api",children:"kruise-api"})," provides tools for openkruise to generate ",(0,t.jsx)(n.code,{children:"kustomize schema"})," files that support openkruise CRD, and provides the current available ",(0,t.jsx)(n.code,{children:"OpenAPI schema"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"schema-generator",children:"Schema Generator"}),"\n",(0,t.jsxs)(n.p,{children:["When using ",(0,t.jsx)(n.code,{children:"kustomize"})," to manage applications, in order to use ",(0,t.jsx)(n.code,{children:"strategic merge patches (SMPs)"})," to process environment variables or any array type fields in resource definitions when using openkruise resources, the ",(0,t.jsx)(n.code,{children:"OpenAPI schema"})," of openkruise CRD needs to contain the specified ",(0,t.jsx)(n.code,{children:"patch strategy"}),". ",(0,t.jsx)(n.code,{children:"Schema Generator"})," supports the function of quickly generating ",(0,t.jsx)(n.code,{children:"kustomize schema"})," files based on the resource definition of openkruise. The specific way of generating ",(0,t.jsx)(n.code,{children:"kustomize schema"})," files can be viewed in ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api/blob/master/cmd/gen-schema/README.md",children:"README.md"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"schema-usage",children:"Schema Usage"}),"\n",(0,t.jsx)(n.h3,{id:"how-to-specify-the-schema-file",children:"How to specify the schema file"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api",children:"kruise-api"})," provides available ",(0,t.jsx)(n.code,{children:"OpenAPI schema"})," files, you can use the latest version or specify the version of the ",(0,t.jsx)(n.code,{children:"OpenAPI schema"})," file, just add the configuration block in ",(0,t.jsx)(n.code,{children:"kustomization.yaml"})," like:"]}),"\n",(0,t.jsx)(n.p,{children:"Use the latest version"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"openapi:\n  path: https://raw.githubusercontent.com/openkruise/kruise-api/master/schema/openkruise_all_k8s_kustomize_schema.json\n"})}),"\n",(0,t.jsx)(n.p,{children:"Use the specified version"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"openapi:\n  path: https://raw.githubusercontent.com/openkruise/kruise-api/raw/<tag>/schema/openkruise_all_k8s_kustomize_schema.json\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Or you can download ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api",children:"kruise-api"})," to the local, and specify the local file path in the configuration block:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"openapi:\n  path: <kruise-api-local-path>/schema/openkruise_all_k8s_kustomize_schema.json\n"})}),"\n",(0,t.jsx)(n.h3,{id:"example",children:"Example"}),"\n",(0,t.jsxs)(n.p,{children:["Take ",(0,t.jsx)(n.code,{children:"sidecarset"})," as an example to introduce how to use ",(0,t.jsx)(n.code,{children:"kustomize OpenAPI schema"})," to support the merge strategy of openkruise CRD in kustomize."]}),"\n",(0,t.jsxs)(n.p,{children:["A complete definition of ",(0,t.jsx)(n.code,{children:"sidecarset"})," is as follows:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: test-sidecarset\nspec:\n  selector:\n    matchLabels:\n      app: nginx\n  updateStrategy:\n    type: RollingUpdate\n    maxUnavailable: 1\n  containers:\n    - name: sidecar1\n      image: centos:6.7\n      command: ["sleep", "999d"]\n      volumeMounts:\n        - name: log-volume1\n          mountPath: /var/log\n    - name: sidecar2\n      image: centos:6.8\n      command: ["sleep", "999d"] \n      volumeMounts:\n        - name: log-volume2\n          mountPath: /var/log\n  volumes: \n    - name: log-volume1\n      emptyDir: {}\n    - name: log-volume2\n      emptyDir: {}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["This ",(0,t.jsx)(n.code,{children:"sidecarset"})," currently has two containers, ",(0,t.jsx)(n.code,{children:"sidecar1"})," and ",(0,t.jsx)(n.code,{children:"sidecar2"}),", which mount two volumes named ",(0,t.jsx)(n.code,{children:"log-volume1"})," and ",(0,t.jsx)(n.code,{children:"log-volume2"})," respectively. Now If you want to add a new container ",(0,t.jsx)(n.code,{children:"sidecar3"}),", mount a new volume named ",(0,t.jsx)(n.code,{children:"log-volume3"}),", delete the ",(0,t.jsx)(n.code,{children:"sidecar1"})," container with corresponding volume, and then make some simple modifications to other fields. Then you can write the ",(0,t.jsx)(n.code,{children:"kustomization.yaml"})," file with the merge strategy as follows:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\n\nresources:\n- sidecarset.yaml\n\nopenapi:\n  path: https://raw.githubusercontent.com/openkruise/kruise-api/master/schema/openkruise_all_k8s_kustomize_schema.json\n\npatchesStrategicMerge:\n- |-\n  apiVersion: apps.kruise.io/v1alpha1\n  kind: SidecarSet\n  metadata:\n    name: test-sidecarset\n  spec:\n    containers:\n      - name: sidecar1\n        $patch: delete\n      - name: sidecar2\n        volumeMounts:\n          - name: log-volume3\n            mountPath: /var/log3\n      - name: sidecar3\n        image: centos:6.9\n        command: ["sleep", "102d"]\n        volumeMounts:\n          - name: log-volume3\n            mountPath: /var/log\n    volumes:\n      - name: log-volume1\n        $patch: delete\n      - name: log-volume3\n        emptyDir: {}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["The main thing added here is the ",(0,t.jsx)(n.code,{children:"openapi"})," field and the path to the custom ",(0,t.jsx)(n.code,{children:"OpenAPI schema"})," file. At this time, kustomize will determine the merge strategy of different fields according to the ",(0,t.jsx)(n.code,{children:"x-kubernetes-patch-*"})," key in the ",(0,t.jsx)(n.code,{children:"OpenAPI schema"})," file when patching. After executing the command ",(0,t.jsx)(n.code,{children:"kustomize build ."}),", you can get the following results:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nmetadata:\n  name: test-sidecarset\nspec:\n  containers:\n  - command:\n    - sleep\n    - 999d\n    image: centos:6.8\n    name: sidecar2\n    volumeMounts:\n    - mountPath: /var/log3\n      name: log-volume3\n    - mountPath: /var/log\n      name: log-volume2\n  - command:\n    - sleep\n    - 102d\n    image: centos:6.9\n    name: sidecar3\n    volumeMounts:\n    - mountPath: /var/log\n      name: log-volume3\n  selector:\n    matchLabels:\n      app: nginx\n  updateStrategy:\n    maxUnavailable: 1\n    type: RollingUpdate\n  volumes:\n  - emptyDir: {}\n    name: log-volume3\n  - emptyDir: {}\n    name: log-volume2\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You can refer to ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/kruise-api/tree/master/test/kustomize/kruise",children:"here"})," for other common usage examples of openkruise crd merge strategy."]})]})}function d(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}}}]);
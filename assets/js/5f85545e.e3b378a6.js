"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6338],{4545:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"user-manuals/resourcedistribution","title":"ResourceDistribution","description":"For the scenario, where the namespace-scoped resources such as Secret and ConfigMap need to be distributed or synchronized to different namespaces, the native k8s currently only supports manual distribution and synchronization by users one-by-one, which is very inconvenient.","source":"@site/versioned_docs/version-v1.6/user-manuals/resourcedistribution.md","sourceDirName":"user-manuals","slug":"/user-manuals/resourcedistribution","permalink":"/docs/v1.6/user-manuals/resourcedistribution","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/resourcedistribution.md","tags":[],"version":"v1.6","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{"title":"ResourceDistribution"},"sidebar":"docs","previous":{"title":"ImagePullJob","permalink":"/docs/v1.6/user-manuals/imagepulljob"},"next":{"title":"PersistentPodState","permalink":"/docs/v1.6/user-manuals/persistentpodstate"}}');var i=n(74848),t=n(28453);const a={title:"ResourceDistribution"},o=void 0,c={},d=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"API Description",id:"api-description",level:2},{value:"Resource Field",id:"resource-field",level:3},{value:"Targets Field",id:"targets-field",level:3},{value:"A Complete Use Case",id:"a-complete-use-case",level:2},{value:"Distribute Resource",id:"distribute-resource",level:3},{value:"Tracking Failures After The Distribution",id:"tracking-failures-after-the-distribution",level:3},{value:"Update/Sync Resource",id:"updatesync-resource",level:3},{value:"Cascading Deletion",id:"cascading-deletion",level:3},{value:"Kustomize ResourceDistribution Generator",id:"kustomize-resourcedistribution-generator",level:2}];function l(e){const s={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.p,{children:"For the scenario, where the namespace-scoped resources such as Secret and ConfigMap need to be distributed or synchronized to different namespaces, the native k8s currently only supports manual distribution and synchronization by users one-by-one, which is very inconvenient."}),"\n",(0,i.jsx)(s.p,{children:"Typical examples:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"When users want to use the imagePullSecrets capability of SidecarSet, they must repeatedly create corresponding Secrets in relevant namespaces, and ensure the correctness and consistency of these Secret configurations;"}),"\n",(0,i.jsxs)(s.li,{children:["When users want to configure some ",(0,i.jsx)(s.strong,{children:"common"})," environment variables, they probably need to distribute ConfigMaps to multiple namespaces, and the subsequent modifications of these ConfigMaps might require synchronization among these namespaces."]}),"\n"]}),"\n",(0,i.jsxs)(s.p,{children:["Therefore, in the face of these scenarios that require the resource distribution and ",(0,i.jsx)(s.strong,{children:"continuously synchronization across namespaces"}),", we provide a tool, namely ",(0,i.jsx)(s.strong,{children:"ResourceDistribution"}),", to do this automatically."]}),"\n",(0,i.jsxs)(s.p,{children:["Currently, ResourceDistribution supports the two kind resources --- ",(0,i.jsx)(s.strong,{children:"Secret & ConfigMap"}),"."]}),"\n",(0,i.jsx)(s.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Since kruise v1.5.0"})," ResourceDistribution feature is turned off by default due to permissions, if you want to turn it on set feature-gate ",(0,i.jsx)(s.em,{children:"ResourceDistributionGate"}),"."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-bash",children:'$ helm install/upgrade kruise https://... --set featureGates="ResourceDistributionGate=true"\n'})}),"\n",(0,i.jsx)(s.h2,{id:"api-description",children:"API Description"}),"\n",(0,i.jsxs)(s.p,{children:["ResourceDistribution is a kind of ",(0,i.jsx)(s.strong,{children:"cluster-scoped CRD"}),", which is mainly composed of two fields: ",(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"resource"})," and ",(0,i.jsx)(s.code,{children:"targets"})]}),"."]}),"\n",(0,i.jsxs)(s.p,{children:["The ",(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"resource"})})," field is used to describe the resource to be distributed by the user, and ",(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"targets"})})," is used to describe the destination namespaces."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n  \t... ...\n  targets:\n  \t... ...\n"})}),"\n",(0,i.jsx)(s.h3,{id:"resource-field",children:"Resource Field"}),"\n",(0,i.jsxs)(s.p,{children:["The ",(0,i.jsx)(s.code,{children:"resource"})," field must be a ",(0,i.jsx)(s.strong,{children:"complete"})," and ",(0,i.jsx)(s.strong,{children:"correct"})," resource description in YAML style."]}),"\n",(0,i.jsxs)(s.p,{children:["An example of a correctly configuration of ",(0,i.jsx)(s.code,{children:"resource"})," is as follows:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n    apiVersion: v1\n    kind: ConfigMap\n    metadata:\n      name: game-demo\n    data:\n      game.properties: |\n        enemy.types=aliens,monsters\n        player.maximum-lives=5\n      player_initial_lives: "3"\n      ui_properties_file_name: user-interface.properties\n      user-interface.properties: |\n        color.good=purple\n        color.bad=yellow\n        allow.textmode=true\n  targets:\n    ... ...\n'})}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Tips"}),": users can first create corresponding resources in a local namespace and test them, and then copy them after confirming that the resource configuration is correct."]}),"\n",(0,i.jsx)(s.h3,{id:"targets-field",children:"Targets Field"}),"\n",(0,i.jsxs)(s.p,{children:["The ",(0,i.jsx)(s.strong,{children:(0,i.jsx)(s.code,{children:"targets"})})," field currently supports four rules to describe the target namespaces, including ",(0,i.jsx)(s.code,{children:"allNamespaces"}),", ",(0,i.jsx)(s.code,{children:"includedNamespaces"}),", ",(0,i.jsx)(s.code,{children:"excludedNamespaces"})," and ",(0,i.jsx)(s.code,{children:"namespaceLabelSelector"}),":"]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.code,{children:"allNamespaces"}),": match all of the namespaces if it is ",(0,i.jsx)(s.code,{children:"true"}),";"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.code,{children:"includedNamespaces"}),": match the target namespaces by name;"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.code,{children:"namespaceLabelSelector"}),": use labelSelector to match the target namespaces;"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.code,{children:"excludedNamespaces"}),": use name to exclude some namespaces that you do not want to distribute;"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"Calculation rule for target namespace:"})}),"\n",(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Initialize target namespace ",(0,i.jsx)(s.em,{children:"T"})," = \u2205;"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Add all namespaces if ",(0,i.jsx)(s.code,{children:"allNamespaces=true"})," to ",(0,i.jsx)(s.em,{children:"T"}),";"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Add the namespaces listed in ",(0,i.jsx)(s.code,{children:"includedNamespaces"})," to ",(0,i.jsx)(s.em,{children:"T"}),";"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Add the namespace matching the ",(0,i.jsx)(s.code,{children:"namespaceLabelSelector"})," to ",(0,i.jsx)(s.em,{children:"T"}),";"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Remove the namespaces listed in ",(0,i.jsx)(s.code,{children:"excludedNamespaces"})," from ",(0,i.jsx)(s.em,{children:"T"}),";"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsxs)(s.strong,{children:[(0,i.jsx)(s.code,{children:"AllNamespaces"}),", ",(0,i.jsx)(s.code,{children:"includedNamespaces"})," and ",(0,i.jsx)(s.code,{children:"excludedNamespaces"})," are ",(0,i.jsx)(s.em,{children:'"OR"'})," relationship, and ",(0,i.jsx)(s.code,{children:"excludedNamespaces"})," will always effect if users set it. By the way, ",(0,i.jsx)(s.code,{children:"targets"})," will always ignore the ",(0,i.jsx)(s.code,{children:"kube-system"})," and ",(0,i.jsx)(s.code,{children:"kube-public"})," namespaces."]})}),"\n",(0,i.jsx)(s.p,{children:"A correctly configured targets field is as follows:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n  \t... ...\n  targets:\n    includedNamespaces:\n      list:\n      - name: ns-1\n      - name: ns-4\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n    excludedNamespaces:\n    \tlist:\n      - name: ns-3\n"})}),"\n",(0,i.jsxs)(s.p,{children:["In the above example, the target namespaces of the ResourceDistribution will contain ",(0,i.jsx)(s.code,{children:"ns-1"})," and ",(0,i.jsx)(s.code,{children:"ns-4"}),", and the namespaces whose labels meet the ",(0,i.jsx)(s.code,{children:"namespaceLabelSelector"}),". However, even if ",(0,i.jsx)(s.code,{children:"ns-3"})," meets the namespaceLabelSelector, it will not be included because it has been explicitly excluded in ",(0,i.jsx)(s.code,{children:"excludedNamespaces"}),"."]}),"\n",(0,i.jsx)(s.h2,{id:"a-complete-use-case",children:"A Complete Use Case"}),"\n",(0,i.jsx)(s.h3,{id:"distribute-resource",children:"Distribute Resource"}),"\n",(0,i.jsxs)(s.p,{children:["When the user correctly configures the ",(0,i.jsx)(s.code,{children:"resource"})," and ",(0,i.jsx)(s.code,{children:"targets"})," fields, the ResourceDistribution controller will execute the distribution, and this resource will be automatically created in each target namespaces."]}),"\n",(0,i.jsx)(s.p,{children:"A complete configuration is as follows:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: ResourceDistribution\nmetadata:\n  name: sample\nspec:\n  resource:\n    apiVersion: v1\n    kind: ConfigMap\n    metadata:\n      name: game-demo\n    data:\n      game.properties: |\n        enemy.types=aliens,monsters\n        player.maximum-lives=5\n      player_initial_lives: "3"\n      ui_properties_file_name: user-interface.properties\n      user-interface.properties: |\n        color.good=purple\n        color.bad=yellow\n        allow.textmode=true\n  targets:\n    excludedNamespaces:\n      list:\n      - name: ns-3\n    includedNamespaces:\n      list:\n      - name: ns-1\n      - name: ns-4\n    namespaceLabelSelector:\n      matchLabels:\n        group: test\n'})}),"\n",(0,i.jsx)(s.h3,{id:"tracking-failures-after-the-distribution",children:"Tracking Failures After The Distribution"}),"\n",(0,i.jsx)(s.p,{children:"Of course, resource distribution may not be always successful."}),"\n",(0,i.jsxs)(s.p,{children:["In the process of distribution, various errors may occur. To this end, we record some conditions of distribution failures in the ",(0,i.jsx)(s.code,{children:"status"})," field so that users can track them."]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"First"}),", the ",(0,i.jsx)(s.code,{children:"status"})," records the total number of target namespaces (desired), the number of successfully distributed target namespaces (succeeded), and the number of failed target namespaces (failed):"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:"status:\n  Desired:                 3\n  Failed:                  1\n  Succeeded:               2\n"})}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Then"}),", in order to further make users understand the reason and location (namespaces) of the failed distributions, ",(0,i.jsx)(s.code,{children:"status"})," also summarizes the types of distribution errors, which are divided into 6 categories and recorded in ",(0,i.jsx)(s.code,{children:"status.conditions"}),":"]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Four types of conditions record the failures of operating resources, that are ",(0,i.jsx)(s.code,{children:"Get"}),", ",(0,i.jsx)(s.code,{children:"Create"}),", ",(0,i.jsx)(s.code,{children:"Update"})," and ",(0,i.jsx)(s.code,{children:"Delete"})," errors;"]}),"\n",(0,i.jsx)(s.li,{children:"A type of condition records the error that the namespace does not exist;"}),"\n",(0,i.jsxs)(s.li,{children:["A type of condition records resource conflicts: If a resource with the same name, kind and apiVersion already exists in the target namespace, this conflicts will be recorded in ",(0,i.jsx)(s.code,{children:"status.conditions"}),"."]}),"\n"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:"Status:\n  Conditions:\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  GetResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  CreateResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  UpdateResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  DeleteResourceFailed\n    Last Transition Time:  2021-09-06T08:42:28Z\n    Reason:                Succeeded\n    Status:                False\n    Type:                  ConflictOccurred\n    Failed Namespace:\n      ns-1\n      ns-4\n    Last Transition Time:  2021-09-06T08:45:08Z\n    Reason:                namespace not found\n    Status:                True\n    Type:                  NamespaceNotExists\n"})}),"\n",(0,i.jsxs)(s.p,{children:["The above example shows an error that the target namespaces ",(0,i.jsx)(s.code,{children:"ns-1"})," and ",(0,i.jsx)(s.code,{children:"ns-4"})," do not exist, and both the error type and namespaces are recorded."]}),"\n",(0,i.jsx)(s.h3,{id:"updatesync-resource",children:"Update/Sync Resource"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"ResourceDistribution allows users to update the resource field, and the update will automatically sync to all the target namespaces."})}),"\n",(0,i.jsxs)(s.p,{children:["When a resource is updated, ResourceDistribution will calculate the hash value of the new version of the resource and record it in the ",(0,i.jsx)(s.code,{children:"annotations"})," of the resource CR. When ResourceDistribution finds that the hash value of the resource was changed, it will update it."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: game-demo\n  annotations:\n    kruise.io/resourcedistribution.resource.from: sample\n    kruise.io/resourcedistribution.resource.distributed.timestamp: 2021-09-06 08:44:52.7861421 +0000 UTC m=+12896.810364601\n    kruise.io/resourcedistribution.resource.hashcode: 0821a13321b2c76b5bd63341a0d97fb46bfdbb2f914e2ad6b613d10632fa4b63\n... ...\n"})}),"\n",(0,i.jsxs)(s.p,{children:["In particular, we ",(0,i.jsx)(s.strong,{children:"DO NOT"})," recommend that users bypass the ResourceDistribution and directly modify the resources unless they know what they are doing:"]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["After modifying resources directly, the hash value of resources will not be calculated automatically. Therefore, ",(0,i.jsxs)(s.strong,{children:["when the ",(0,i.jsx)(s.code,{children:"resource"})," field is modified, ResourceDistribution may overwrite the user's direct modification of these resources;"]})]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["ResourceDistribution judges whether resources are distributed by the itself through ",(0,i.jsx)(s.code,{children:"kruise.io/resourcedistribution.resource.from"}),". If this annotation was changed, the modified resources will be regarded as conflicts, and will not updated it synchronously any more."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"cascading-deletion",children:"Cascading Deletion"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"ResourceDistribution controls the distributed resources through ownerReference. Therefore, it should be noted that when the ResourceDistribution is deleted, all the resources it distributed will also be deleted."})}),"\n",(0,i.jsx)(s.h2,{id:"kustomize-resourcedistribution-generator",children:"Kustomize ResourceDistribution Generator"}),"\n",(0,i.jsxs)(s.p,{children:["ResourceDistribution Generator is a third-party plug-in of kustomize, similar to kustomize's configmap generator and secret generator. Using this plug-in, you can complete the work of reading files as data content to create ResourceDistribution. Refer to ",(0,i.jsx)(s.a,{href:"/docs/next/cli-tool/kustomize-plugin",children:"this page"})," for details."]})]})}function u(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>a,x:()=>o});var r=n(96540);const i={},t=r.createContext(i);function a(e){const s=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(t.Provider,{value:s},e.children)}}}]);
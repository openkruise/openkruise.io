"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[7546],{4194:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>r,contentTitle:()=>i,default:()=>p,frontMatter:()=>l,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"user-manuals/uniteddeployment","title":"UnitedDeployment","description":"\u8fd9\u4e2a\u63a7\u5236\u5668\u63d0\u4f9b\u4e86\u4e00\u4e2a\u65b0\u6a21\u5f0f\u6765\u901a\u8fc7\u591a\u4e2a workload \u7ba1\u7406\u591a\u4e2a\u533a\u57df\u4e0b\u7684 Pod\u3002","source":"@site/i18n/zh/docusaurus-plugin-content-docs/current/user-manuals/uniteddeployment.md","sourceDirName":"user-manuals","slug":"/user-manuals/uniteddeployment","permalink":"/zh/docs/next/user-manuals/uniteddeployment","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/uniteddeployment.md","tags":[],"version":"current","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742781051000,"frontMatter":{"title":"UnitedDeployment"},"sidebar":"docs","previous":{"title":"WorkloadSpread","permalink":"/zh/docs/next/user-manuals/workloadspread"},"next":{"title":"Container Restart","permalink":"/zh/docs/next/user-manuals/containerrecreaterequest"}}');var a=s(74848),o=s(28453);const l={title:"UnitedDeployment"},i=void 0,r={},d=[{value:"Subset\u5bb9\u91cf\u7cbe\u7ec6\u89c4\u5212 (MaxReplicas)",id:"subset\u5bb9\u91cf\u7cbe\u7ec6\u89c4\u5212-maxreplicas",level:2},{value:"\u652f\u6301 Customize \u4e0d\u540c subset \u7684 Pod Template",id:"\u652f\u6301-customize-\u4e0d\u540c-subset-\u7684-pod-template",level:2},{value:"HPA UnitedDeployment",id:"hpa-uniteddeployment",level:2},{value:"Pod \u5206\u53d1\u7ba1\u7406",id:"pod-\u5206\u53d1\u7ba1\u7406",level:2},{value:"Pod \u66f4\u65b0\u7ba1\u7406",id:"pod-\u66f4\u65b0\u7ba1\u7406",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.p,{children:["\u8fd9\u4e2a\u63a7\u5236\u5668\u63d0\u4f9b\u4e86\u4e00\u4e2a\u65b0\u6a21\u5f0f\u6765\u901a\u8fc7\u591a\u4e2a workload \u7ba1\u7406\u591a\u4e2a\u533a\u57df\u4e0b\u7684 Pod\u3002\n\u8fd9\u7bc7 ",(0,a.jsx)(n.a,{href:"/blog/uniteddeployment",children:"\u535a\u5ba2\u6587\u7ae0"})," \u63d0\u4f9b\u4e86\u5bf9 UnitedDeployment \u4e00\u4e2a\u9ad8\u5c42\u9762\u7684\u63cf\u8ff0\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["\u5728\u4e00\u4e2a Kubernetes \u96c6\u7fa4\u4e2d\u53ef\u80fd\u5b58\u5728\u4e0d\u540c\u7684 node \u7c7b\u578b\uff0c\u6bd4\u5982\u591a\u4e2a\u53ef\u7528\u533a\u3001\u6216\u4e0d\u540c\u7684\u8282\u70b9\u6280\u672f\uff08\u6bd4\u5982 Virtual kueblet\uff09\u7b49\uff0c\u8fd9\u4e9b\u4e0d\u540c\u7c7b\u578b\u7684 node \u4e0a\u6709 label/taint \u6807\u8bc6\u3002\nUnitedDeployment \u63a7\u5236\u5668\u53ef\u4ee5\u63d0\u4f9b\u4e00\u4e2a\u6a21\u677f\u6765\u5b9a\u4e49\u5e94\u7528\uff0c\u5e76\u901a\u8fc7\u7ba1\u7406\u591a\u4e2a workload \u6765\u5339\u914d\u4e0b\u9762\u4e0d\u540c\u7684\u533a\u57df\u3002\n\u6bcf\u4e2a UnitedDeployment \u4e0b\u6bcf\u4e2a\u533a\u57df\u7684 workload \u88ab\u79f0\u4e3a ",(0,a.jsx)(n.code,{children:"subset"}),"\uff0c\u6709\u4e00\u4e2a\u671f\u671b\u7684 ",(0,a.jsx)(n.code,{children:"replicas"})," Pod \u6570\u91cf\u3002\n\u76ee\u524d subset \u652f\u6301\u4f7f\u7528 ",(0,a.jsx)(n.code,{children:"StatefulSet"}),"\u3001",(0,a.jsx)(n.code,{children:"Advanced StatefulSet"}),"\u3001",(0,a.jsx)(n.code,{children:"CloneSet"}),"\u3001",(0,a.jsx)(n.code,{children:"Deployment"}),"\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["API \u5b9a\u4e49: ",(0,a.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go",children:"https://github.com/openkruise/kruise/blob/master/apis/apps/v1alpha1/uniteddeployment_types.go"})]}),"\n",(0,a.jsx)(n.p,{children:"\u4e0b\u9762\u7528\u4e00\u4e2a\u7b80\u5355\u4f8b\u5b50\u6765\u6f14\u793a\u5982\u4f55\u5b9a\u4e49\u4e00\u4e2a UnitedDeployment \u6765\u7ba1\u7406\u4e0b\u9762\u4e09\u4e2a\u533a\u57df\u7684 StatefulSet\uff0c\u6240\u6709\u533a\u57df\u7684 Pod \u603b\u6570\u4e3a 6\u3002"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 6\n  revisionHistoryLimit: 10\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    statefulSetTemplate:\n      metadata:\n        labels:\n          app: sample\n      spec:\n        selector:\n          matchLabels:\n            app: sample\n        template:\n          metadata:\n            labels:\n              app: sample\n          spec:\n            containers:\n            - image: nginx:alpine\n              name: nginx\n  topology:\n    subsets:\n    - name: subset-a\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-a\n      replicas: 1\n    - name: subset-b\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-b\n      replicas: 50%\n    - name: subset-c\n      nodeSelectorTerm:\n        matchExpressions:\n        - key: node\n          operator: In\n          values:\n          - zone-c\n  updateStrategy:\n    manualUpdate:\n      partitions:\n        subset-a: 0\n        subset-b: 0\n        subset-c: 0\n    type: Manual\n...\n"})}),"\n",(0,a.jsx)(n.h2,{id:"subset\u5bb9\u91cf\u7cbe\u7ec6\u89c4\u5212-maxreplicas",children:"Subset\u5bb9\u91cf\u7cbe\u7ec6\u89c4\u5212 (MaxReplicas)"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.1"]}),"\n",(0,a.jsx)(n.p,{children:"\u60a8\u53ef\u4ee5\u4e3a\u6bcf\u4e2asubset\u89c4\u5212\u526f\u672c\u6570\u91cf\u7684\u4e0a\u4e0b\u9650\uff0c\u4ece\u800c\u5e2e\u52a9\u4f60\u66f4\u52a0\u7cbe\u7ec6\u5316\u5730\u7ba1\u7406\u60a8\u7684\u8d44\u6e90\u4f7f\u7528\u3002\n\u4f8b\u5982\uff0c\u4e00\u4e2a\u5e94\u7528\u5728\u5e38\u89c4\u8282\u70b9\u6c60\u4e0a\u6700\u591a\u8fd0\u884c4\u4e2a\u526f\u672c\uff0c\u5982\u679c\u526f\u672c\u6570\u91cf\u8d85\u8fc74\u4e2a\uff0c\u8d85\u51fa\u7684Pod\u5c06\u81ea\u52a8\u8c03\u5ea6\u5230\u5f39\u6027\u8282\u70b9\u3002\n\u7c7b\u4f3c\u573a\u666f\u4e0b\uff0c\u60a8\u53ef\u4ee5\u53c2\u8003\u4ee5\u4e0b\u914d\u7f6e\u65b9\u5f0f\uff1a"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 5\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    cloneSetTemplate:\n      ......\n  topology:\n    subsets:\n    - name: normal-nodes\n      maxReplicas: 4\n      ......\n    - name: elastic-nodes\n      maxReplicas: null\n      ......\n"})}),"\n",(0,a.jsxs)(n.p,{children:["UnitedDeployment \u63a7\u5236\u5668\u9075\u5faa\u4ee5\u4e0b\u89c4\u5219\u6765\u5bf9\u5404\u4e2a Subset \u505a\u6269\u7f29\u5bb9\uff0c\u5f53\u7136\u524d\u63d0\u662f\u60a8\u5df2\u8bbe\u7f6e\u4e86 ",(0,a.jsx)(n.code,{children:"MaxReplicas"}),"\uff1a"]}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"\u5728\u6269\u5bb9\u65f6\uff0cUnitedDeployment \u63a7\u5236\u5668\u4f1a\u6309\u7167 Subset \u5217\u8868\u7684\u987a\u5e8f\u8fdb\u884c\u6269\u5bb9\uff1b"}),"\n",(0,a.jsx)(n.li,{children:"\u5728\u7f29\u5bb9\u65f6\uff0cUnitedDeployment \u63a7\u5236\u5668\u4f1a\u6309\u7167 Subset \u5217\u8868\u76f8\u53cd\u987a\u5e8f\u8fdb\u884c\u7f29\u5bb9\u3002"}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"\u5176\u4ed6\u91cd\u8981\u6ce8\u610f\u4e8b\u9879\uff1a"})}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\u5f53\u524d Subset \u7684 ",(0,a.jsx)(n.code,{children:"MaxReplicas"})," \u548c ",(0,a.jsx)(n.code,{children:"Replicas"})," \u7684\u914d\u7f6e\u76ee\u524d\u662f\u4e92\u65a5\u7684\uff0c\u60a8\u53ea\u80fd\u914d\u7f6e\u5176\u4e2d\u7684\u4e00\u79cd\u3002"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"MaxReplicas"}),"\u4e3a\u7a7a\u8868\u793a\u8be5 Subset \u6ca1\u6709\u526f\u672c\u6570\u91cf\u9650\u5236\u3002"]}),"\n",(0,a.jsxs)(n.li,{children:["\u4e3a\u4e86\u907f\u514d\u6240\u6709 Subset \u7684 ",(0,a.jsx)(n.code,{children:"MaxReplicas"})," \u8981\u6c42\u90fd\u5f97\u5230\u6ee1\u8db3\u540e\uff0c\u5bfc\u81f4\u65e0\u6cd5\u6269\u5bb9\u4efb\u4f55 Subset\uff0c\u60a8\u9700\u8981\u4fdd\u8bc1",(0,a.jsx)(n.strong,{children:"\u81f3\u5c11\u6709\u4e00\u4e2a Subset"})," \u7684 ",(0,a.jsx)(n.code,{children:"MaxReplicas"})," \u503c\u4e3a\u7a7a\u3002"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"\u652f\u6301-customize-\u4e0d\u540c-subset-\u7684-pod-template",children:"\u652f\u6301 Customize \u4e0d\u540c subset \u7684 Pod Template"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,a.jsx)(n.p,{children:"\u4ece kruise v1.5.0\u7248\u672c\u5f00\u59cb\uff0c\u4f60\u53ef\u4ee5 customize \u4efb\u610f pod.spec \u5b57\u6bb5\uff0c\u6bd4\u5982\uff1aenv\u3001resources\u3002"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Note:"})," \u5efa\u8bae\u4e0d\u8981\u5728 subset \u4e2d customize image \u5b57\u6bb5\uff0c\u5b83\u53ef\u80fd\u4f1a\u5bfc\u81f4\u53d1\u5e03\u7684\u5f02\u5e38\u3002"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: UnitedDeployment\nmetadata:\n  name: sample-ud\nspec:\n  replicas: 6\n  revisionHistoryLimit: 10\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    # statefulSetTemplate or advancedStatefulSetTemplate or cloneSetTemplate or deploymentTemplate\n    statefulSetTemplate:\n      ...\n  topology:\n    subsets:\n    - name: subset-a\n      ...\n      # patch container resources, env:\n      patch:\n        spec:\n          containers:\n          - name: main\n            resources:\n              limits:\n                cpu: "2"\n                memory: 800Mi\n            env:\n            - name: subset\n              value: subset-a\n    - name: subset-b\n      ...\n      # patch container resources, env:\n      patch:\n        spec:\n          containers:\n          - name: main\n            resources:\n              limits:\n                cpu: "2"\n                memory: 800Mi\n            env:\n            - name: subset\n              value: subset-b\n'})}),"\n",(0,a.jsx)(n.h2,{id:"hpa-uniteddeployment",children:"HPA UnitedDeployment"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.0"]}),"\n",(0,a.jsxs)(n.p,{children:["Horizontal Pod Autoscaler \u80fd\u591f\u652f\u6301\u5305\u542b ",(0,a.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource",children:"scale subresource"})," \u7684\u81ea\u5b9a\u4e49\u5de5\u4f5c\u8d1f\u8f7d.\n\u4ece kruise v1.5.0\u7248\u672c\u5f00\u59cb\uff0c\u4f60\u53ef\u4ee5\u76f4\u63a5 HPA UnitedDeployment\uff0c\u5982\u4e0b\uff1a"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: autoscaling/v2beta1\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: example-hpa\n  namespace: default\nspec:\n  minReplicas: 1\n  maxReplicas: 3\n  metrics:\n  - resource:\n      name: cpu\n      targetAverageUtilization: 2\n    type: Resource\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: UnitedDeployment\n    name: sample-ud\n"})}),"\n",(0,a.jsx)(n.h2,{id:"pod-\u5206\u53d1\u7ba1\u7406",children:"Pod \u5206\u53d1\u7ba1\u7406"}),"\n",(0,a.jsxs)(n.p,{children:["\u4e0a\u8ff0\u4f8b\u5b50\u4e2d\u53ef\u4ee5\u770b\u5230\uff0c",(0,a.jsx)(n.code,{children:"spec.topology"})," \u4e2d\u53ef\u4ee5\u5b9a\u4e49 Pod \u5206\u53d1\u7684\u89c4\u5219\uff1a"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-go",children:'// Topology defines the spread detail of each subset under UnitedDeployment.\n// A UnitedDeployment manages multiple homogeneous workloads which are called subset.\n// Each of subsets under the UnitedDeployment is described in Topology.\ntype Topology struct {\n    // Contains the details of each subset. Each element in this array represents one subset\n    // which will be provisioned and managed by UnitedDeployment.\n    // +optional\n    Subsets []Subset `json:"subsets,omitempty"`\n}\n\n// Subset defines the detail of a subset.\ntype Subset struct {\n    // Indicates subset name as a DNS_LABEL, which will be used to generate\n    // subset workload name prefix in the format \'<deployment-name>-<subset-name>-\'.\n    // Name should be unique between all of the subsets under one UnitedDeployment.\n    Name string `json:"name"`\n\n    // Indicates the node selector to form the subset. Depending on the node selector,\n    // pods provisioned could be distributed across multiple groups of nodes.\n    // A subset\'s nodeSelectorTerm is not allowed to be updated.\n    // +optional\n    NodeSelectorTerm corev1.NodeSelectorTerm `json:"nodeSelectorTerm,omitempty"`\n\n    // Indicates the tolerations the pods under this subset have.\n    // A subset\'s tolerations is not allowed to be updated.\n    // +optional\n    Tolerations []corev1.Toleration `json:"tolerations,omitempty"`\n\n    // Indicates the number of the pod to be created under this subset. Replicas could also be\n    // percentage like \'10%\', which means 10% of UnitedDeployment replicas of pods will be distributed\n    // under this subset. If nil, the number of replicas in this subset is determined by controller.\n    // Controller will try to keep all the subsets with nil replicas have average pods.\n    // +optional\n    Replicas *intstr.IntOrString `json:"replicas,omitempty"`\n}\n'})}),"\n",(0,a.jsxs)(n.p,{children:["\u5728 ",(0,a.jsx)(n.code,{children:"topology.subsets"})," \u91cc\u9762\u6211\u4eec\u6307\u5b9a\u4e86\u591a\u4e2a ",(0,a.jsx)(n.code,{children:"subset"})," \u7ec4\uff0c\u6bcf\u4e2a subset \u5176\u5b9e\u5bf9\u5e94\u4e86\u4e00\u4e2a\u4e0b\u5c5e\u7684 workload\u3002\n\u5f53\u4e00\u4e2a subset \u4ece\u8fd9\u4e2a\u5217\u8868\u91cc\u589e\u52a0\u6216\u53bb\u9664\u65f6\uff0cUnitedDeployment \u63a7\u5236\u5668\u4f1a\u521b\u5efa\u6216\u5220\u9664\u76f8\u5e94\u7684 subset workload\u3002"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["\u6bcf\u4e2a subset workload \u6709\u4e00\u4e2a\u72ec\u7acb\u7684\u540d\u5b57\uff0c\u524d\u7f00\u662f ",(0,a.jsx)(n.code,{children:"<UnitedDeployment-name>-<Subset-name>-"}),"\u3002"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["subset workload \u662f\u6839\u636e UnitedDeployment \u7684 ",(0,a.jsx)(n.code,{children:"spec.template"})," \u505a\u57fa\u7840\u6765\u521b\u5efa\uff0c\u540c\u65f6\u5c06 ",(0,a.jsx)(n.code,{children:"subset"})," \u4e2d\u5b9a\u4e49\u7684\u4e00\u4e9b\u7279\u6b8a\u914d\u7f6e\uff08\u5982 ",(0,a.jsx)(n.code,{children:"nodeSelector"}),", ",(0,a.jsx)(n.code,{children:"replicas"}),"\uff09\u5408\u5e76\u8fdb\u53bb\u6210\u4e3a\u4e00\u4e2a\u5b8c\u6574\u7684 workload\u3002"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"subset.replicas"})," \u53ef\u4ee5\u8bbe\u7f6e",(0,a.jsx)(n.strong,{children:"\u7edd\u5bf9\u503c"}),"\u6216",(0,a.jsx)(n.strong,{children:"\u767e\u5206\u6bd4"}),"\u3002\u5176\u4e2d\uff0c\u767e\u5206\u6bd4\u4f1a\u6839\u636e UnitedDeployment \u7684 ",(0,a.jsx)(n.code,{children:"replicas"})," \u603b\u6570\u8ba1\u7b97\u51fa\u6765 subset \u9700\u8981\u7684\u6570\u91cf\uff1b\u800c\u5982\u679c\u4e0d\u8bbe\u7f6e\u8fd9\u4e2a ",(0,a.jsx)(n.code,{children:"subset.replicas"}),"\uff0c\u63a7\u5236\u5668\u4f1a\u6839\u636e\u603b\u6570\u5212\u5206\u7ed9\u6bcf\u4e2a subset \u5bf9\u5e94\u7684\u6570\u91cf\u3002"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"subset.nodeSelector"})," \u4f1a\u5408\u5e76\u5230 subset workload \u7684 ",(0,a.jsx)(n.code,{children:"spec.template"})," \u4e0b\u9762\uff0c\u56e0\u6b64\u8fd9\u4e2a workload \u521b\u5efa\u51fa\u6765\u7684 Pod \u90fd\u5e26\u6709\u5bf9\u5e94\u7684\u8c03\u5ea6\u89c4\u5219\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"pod-\u66f4\u65b0\u7ba1\u7406",children:"Pod \u66f4\u65b0\u7ba1\u7406"}),"\n",(0,a.jsxs)(n.p,{children:["\u5982\u679c\u7528\u6237\u4fee\u6539\u4e86 ",(0,a.jsx)(n.code,{children:"spec.template"})," \u4e0b\u9762\u7684\u5b57\u6bb5\uff0c\u76f8\u5f53\u4e8e\u89e6\u53d1\u4e86\u5347\u7ea7\u6d41\u7a0b\u3002\n\u63a7\u5236\u5668\u4f1a\u628a\u65b0\u7684 template \u66f4\u65b0\u5230\u5404\u4e2a subset workload \u91cc\u9762\uff0c\u6765\u89e6\u53d1 subset \u63a7\u5236\u5668\u5347\u7ea7 Pod\u3002"]}),"\n",(0,a.jsxs)(n.p,{children:["\u540c\u65f6\uff0c\u5982\u679c subset workload \u652f\u6301 ",(0,a.jsx)(n.code,{children:"partition"})," \u7b56\u7565\uff08\u76ee\u524d\u53ef\u7528\u7684 ",(0,a.jsx)(n.code,{children:"AdvancedStatefulSet"}),", ",(0,a.jsx)(n.code,{children:"StatefulSet"})," \u90fd\u662f\u652f\u6301\u7684\uff09\uff0c\u8fd8\u53ef\u4ee5\u4f7f\u7528 ",(0,a.jsx)(n.code,{children:"manual"})," \u5347\u7ea7\u7b56\u7565\u3002"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-go",children:'// UnitedDeploymentUpdateStrategy defines the update performance\n// when template of UnitedDeployment is changed.\ntype UnitedDeploymentUpdateStrategy struct {\n    // Type of UnitedDeployment update strategy.\n    // Default is Manual.\n    // +optional\n    Type UpdateStrategyType `json:"type,omitempty"`\n    // Includes all of the parameters a Manual update strategy needs.\n    // +optional\n    ManualUpdate *ManualUpdate `json:"manualUpdate,omitempty"`\n}\n\n// ManualUpdate is a update strategy which allows users to control the update progress\n// by providing the partition of each subset.\ntype ManualUpdate struct {\n    // Indicates number of subset partition.\n    // +optional\n    Partitions map[string]int32 `json:"partitions,omitempty"`\n}\n'})}),"\n",(0,a.jsxs)(n.p,{children:["\u901a\u8fc7 ",(0,a.jsx)(n.code,{children:"manual"})," \u5347\u7ea7\u7b56\u7565\uff0c\u7528\u6237\u53ef\u4ee5\u6307\u5b9a UnitedDeployment \u4e0b\u9762\u6bcf\u4e2a subset workload \u7684\u7070\u5ea6\u5347\u7ea7\u6570\u91cf\uff0c\u63a7\u5236\u5668\u4f1a\u628a\u4e0d\u540c\u7684 ",(0,a.jsx)(n.code,{children:"partition"})," \u6570\u503c\u540c\u6b65\u7ed9\u5bf9\u5e94\u7684 subset workload \u91cc\u9762\u3002"]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>l,x:()=>i});var t=s(96540);const a={},o=t.createContext(a);function l(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:l(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);
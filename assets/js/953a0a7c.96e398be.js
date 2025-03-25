"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5902],{13179:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>x,frontMatter:()=>o,metadata:()=>r,toc:()=>h});const r=JSON.parse('{"id":"user-manuals/api-specifications","title":"API Specifications","description":"A basic example for Kruise Rollouts resource YAML:","source":"@site/rollouts/user-manuals/api-specifications.md","sourceDirName":"user-manuals","slug":"/user-manuals/api-specifications","permalink":"/rollouts/user-manuals/api-specifications","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"Installation","permalink":"/rollouts/installation"},"next":{"title":"Basic Usage Guide","permalink":"/rollouts/user-manuals/basic-usage"}}');var a=t(74848),s=t(28453),i=t(65537),l=t(79329);const o={},d="API Specifications",c={},h=[{value:"API Details",id:"api-details",level:2},{value:"Workload Binding API (Mandatory)",id:"workload-binding-api-mandatory",level:3},{value:"Traffic Binding API (Optional)",id:"traffic-binding-api-optional",level:3},{value:"Strategy API (Mandatory)",id:"strategy-api-mandatory",level:3},{value:"Canary",id:"canary",level:4},{value:"blueGreen",id:"bluegreen",level:4},{value:"Special Annotations of Workload (Optional)",id:"special-annotations-of-workload-optional",level:3},{value:"Rollout Status You Should Know",id:"rollout-status-you-should-know",level:3},{value:"Canary",id:"canary-1",level:4},{value:"Blue-Green",id:"blue-green",level:4}];function u(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"api-specifications",children:"API Specifications"})}),"\n","\n",(0,a.jsx)(n.p,{children:"A basic example for Kruise Rollouts resource YAML:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Note: v1beta1 available from Kruise Rollout v0.5.0."})}),"\n",(0,a.jsxs)(i.A,{children:[(0,a.jsx)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\n  # The rollout resource needs to be in the same namespace as the corresponding workload\n  namespace: default\nspec:\n  # rollout of published workloads, currently only supports Deployment, CloneSet, StatefulSet, Advanced StatefulSet and Advanced DaemonSet\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: echoserver\n  strategy:\n    canary:\n      steps:\n      ### the 1-st batch ###\n      # routing 5% traffics to the new version\n      - traffic: 5%\n        # Need Manual confirmation before enter to next batch\n        pause: {}\n        # optional, The first step of released replicas. If not set, the default is to use 'weight', as shown above is 5%.\n        replicas: 1\n      ### the 2-nd batch ###\n      - traffic: 50%\n        replicas: 50%\n        # Automatically enter the next batch after waiting 2 hours\n        pause:\n          duration: 7200\n      ### the 3-rd batch ###\n      - traffic: 100%\n        replicas: 100%\n      trafficRoutings:\n      # service name that is related with the workload\n      - service: echoserver\n        # ingress name that is related with the service\n        ingress:\n          name: echoserver\n"})})}),(0,a.jsx)(l.A,{value:"v1alpha1",label:"v1alpha1",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\n  # The rollout resource needs to be in the same namespace as the corresponding workload\n  namespace: default\n  # This annotation can help us upgrade the Deployment using partition, just like StatefulSet/CloneSet.\n  annotations:\n    rollouts.kruise.io/rolling-style: partition\nspec:\n  objectRef:\n    # rollout of published workloads, currently only supports Deployment, CloneSet, StatefulSet, Advanced StatefulSet and Advanced DaemonSet\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: echoserver\n  strategy:\n    canary:\n      steps:\n      ### the 1-st batch ###\n      # routing 5% traffics to the new version\n      - weight: 5\n        # Need Manual confirmation before enter to next batch\n        pause: {}\n        # optional, The first step of released replicas. If not set, the default is to use 'weight', as shown above is 5%.\n        replicas: 1\n      ### the 2-nd batch ###\n      - replicas: 50%\n        # Automatically enter the next batch after waiting 2 hours\n        pause:\n          duration: 7200\n      ### the 3-rd batch ###\n      - replicas: 100%\n      trafficRoutings:\n      # service name that is related with the workload\n      - service: echoserver\n        # ingress name that is related with the service\n        ingress:\n          name: echoserver\n"})})})]}),"\n",(0,a.jsx)(n.p,{children:"There are 3 major parts of api specifications you should pay attention to:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Binding your workload: Tell Rollout which workload it should work on;"}),"\n",(0,a.jsx)(n.li,{children:"Binding your traffic configuration: Tell Rollout which traffic configuration it should focus on."}),"\n",(0,a.jsx)(n.li,{children:"Config your deployment strategy before releasing: Tell Rollout how to roll your workload and traffic."}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"api-details",children:"API Details"}),"\n",(0,a.jsx)(n.h3,{id:"workload-binding-api-mandatory",children:"Workload Binding API (Mandatory)"}),"\n",(0,a.jsx)(n.p,{children:"Tell Kruise Rollout which workload should be bounded:"}),"\n",(0,a.jsxs)(i.A,{children:[(0,a.jsx)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: StatefulSet\n    name: <your-workload-name>\n"})})}),(0,a.jsx)(l.A,{value:"v1alpha1",label:"v1alpha1",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: StatefulSet\n      name: <your-workload-name>\n"})})})]}),"\n",(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Fields"}),(0,a.jsx)(n.th,{children:"Type"}),(0,a.jsx)(n.th,{children:"Defaults"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"apiVersion"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Workload APIVersion"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"kind"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Workload Kind"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"name"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Workload Name"})]})]})]}),"\n",(0,a.jsx)(n.p,{children:"Currently, Kruise Rollout supports Deployment, CloneSet, StatefulSet, Advanced StatefulSet and Advanced DaemonSet."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Note: The workload should be at the same namespace as the Rollout."})}),"\n",(0,a.jsx)(n.h3,{id:"traffic-binding-api-optional",children:"Traffic Binding API (Optional)"}),"\n",(0,a.jsx)(n.p,{children:'Different from "Workload Binding", Traffic Binding is not necessary. If you do not set the following specifications, the traffic configuration will keep their native behavior, for example, keeping load balance for all versioned Pods.'}),"\n",(0,a.jsx)(n.p,{children:"If you need do something special for traffic routings, just tell Kruise Rollout which traffic configurations should be bound:"}),"\n",(0,a.jsxs)(i.A,{children:[(0,a.jsx)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  strategy:\n    canary:\n      trafficRoutings:\n      - service: <service-name-that-is-related-your-workload>\n        ingress: # alternative\uff1a ingress,gateway,customNetworkRefs\n          classType: <traffic-type> # example: nginx | higress, defaults to "nginx"\n          name: <ingress-name-that-is-related-the-service>\n        gracePeriodSeconds: 10\n      - service: <service-name-that-is-related-your-workload>\n        gateway:\n          httpRouteName: <gateway-api-httpRoute-name>\n        gracePeriodSeconds: 10\n      - service: <service-name-that-is-related-your-workload>\n        customNetworkRefs:\n        - apiVersion: <your-resource-apiVersion>\n          kind: <your-resource-kind>\n          name: <your-resource-name>\n        gracePeriodSeconds: 10\n'})})}),(0,a.jsx)(l.A,{value:"v1alpha1",label:"v1alpha1",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  strategy:\n    canary:\n      trafficRoutings:\n      - service: <service-name-that-is-related-your-workload>\n        ingress: # alternative\uff1a ingress,gateway,customNetworkRefs\n          classType: <traffic-type> # example: nginx | higress, defaults to "nginx"\n          name: <ingress-name-that-is-related-the-service>\n        gracePeriodSeconds: 10\n      - service: <service-name-that-is-related-your-workload>\n        gateway: \n          httpRouteName: <gateway-api-httpRoute-name>\n      - service: <service-name-that-is-related-your-workload>\n        customNetworkRefs:\n        - apiVersion: <your-resource-apiVersion>\n          kind: <your-resource-kind>\n          name: <your-resource-name>\n'})})})]}),"\n",(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Fields"}),(0,a.jsx)(n.th,{children:"Type"}),(0,a.jsx)(n.th,{children:"Defaults"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"service"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Name of service that select the pods of bounded workload"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"ingress"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Description of the Ingress object you want to bind"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"gateway"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsxs)(n.td,{children:["(optional) Description of the ",(0,a.jsx)(n.a,{href:"https://gateway-api.sigs.k8s.io/",children:"Gateway API"})," resources you want to bind"]})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"customNetworkRefs    "})}),(0,a.jsx)(n.td,{children:"Array"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsxs)(n.td,{children:["(optional) Definitions of ",(0,a.jsx)(n.a,{href:"https://openkruisyye.io/rollouts/developer-manuals/custom-network-provider",children:"customize API Gateway resources"})]})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"ingress.classType"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'"nginx"'}),(0,a.jsx)(n.td,{children:'Ingress type, such as "nginx", "higress", or others'})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"ingress.name"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Name of ingress resource that bounded the service"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"gateway.httpRouteName"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsxs)(n.td,{children:["Name of ",(0,a.jsx)(n.a,{href:"https://gateway-api.sigs.k8s.io/concepts/api-overview/#httproute",children:"HTTPRoute"})," resource of Gateway API"]})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"gracePeriodSeconds"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"3"}),(0,a.jsx)(n.td,{children:"Duration in seconds that kruise rollout wait for the traffic routing configuration changes to take effects in each step"})]})]})]}),"\n",(0,a.jsxs)(n.p,{children:["*",(0,a.jsxs)(n.em,{children:["Note: if you decide to use ",(0,a.jsx)(n.code,{children:"trafficRoutings"}),", one and only one of ",(0,a.jsx)(n.code,{children:"ingress"}),",",(0,a.jsx)(n.code,{children:"gateway"}),",",(0,a.jsx)(n.code,{children:"customNetworkRefs"})," can be present in one trafficRouting element"]})]}),"\n",(0,a.jsx)(n.p,{children:"Alternatively, one can also define traffic routing strategy independently. and reference declared traffic routing config in the Rollout resource. Such usage is often used in the end-to-end canary cases."}),"\n",(0,a.jsx)(n.p,{children:"Here is an example of independent traffic routing definition:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1alpha1\nkind: TrafficRouting\nmetadata:\n  name: mse-traffic\nspec:\n  objectRef:\n  # config is the same as the traffic routing element in canary.trafficRoutings\n  - service: spring-cloud-a\n    ingress:\n      classType: mse\n      name: spring-cloud-a\n    gracePeriodSeconds: 10\n  strategy:\n    matches:\n    - headers:\n      - type: Exact\n        name: User-Agent\n        value: Andriod\n    requestHeaderModifier:\n      set:\n      - name: x-mse-tag\n        value: gray\n"})}),"\n",(0,a.jsx)(n.p,{children:"Here is an example to reference the traffic routing in Rollout resource:"}),"\n",(0,a.jsxs)(i.A,{children:[(0,a.jsx)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollout-b\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          opensergo.io/canary-gray: gray\n    # refer to the traffic routing config called mse-traffic\n    trafficRoutingRef: mse-traffic\n"})})}),(0,a.jsx)(l.A,{value:"v1alpha1",label:"v1alpha1",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: rollout-b\n  annotations:\n    # refer to the mse-traffic traffic routing config\n    rollouts.kruise.io/trafficrouting: mse-traffic\nspec:\n  objectRef:\n    workloadRef:\n      apiVersion: apps/v1\n      kind: Deployment\n      name: spring-cloud-b\n  strategy:\n    canary:\n      steps:\n        - pause: {}\n          replicas: 1\n      patchPodTemplateMetadata:\n        labels:\n          opensergo.io/canary-gray: gray\n"})})})]}),"\n",(0,a.jsx)(n.h3,{id:"strategy-api-mandatory",children:"Strategy API (Mandatory)"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"canary"}),"  is used for canary strategy and multi-batch strategy, while ",(0,a.jsx)(n.code,{children:"blueGreen"})," is used for blue-green strategy. These two are mutually exclusive; they cannot both be empty or both be non-empty. The ",(0,a.jsx)(n.code,{children:"blueGreen"})," strategy was introduced in Kruise-Rollout versions higher than v0.5.0 and is not supported in the v1alpha1 API."]}),"\n",(0,a.jsx)(n.h4,{id:"canary",children:"Canary"}),"\n",(0,a.jsx)(n.p,{children:"Describe your strategy of rollout:"}),"\n",(0,a.jsxs)(i.A,{children:[(0,a.jsxs)(l.A,{value:"v1beta1",label:"v1beta1",default:!0,children:[(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  strategy:\n    canary:\n      enableExtraWorkloadForCanary: true\n      steps:\n      # the first step\n      - traffic: 5%\n        replicas: 1 or 10%\n        pause:\n          duration: 0\n        matches:\n        - headers:\n          - type: Exact # or "RegularExpression"\n            name: <matched-header-name>\n            value: <matched-header-value, or reg-expression>\n      # the second step\n      - traffic: 10%\n        ... ....\n      patchPodTemplateMetadata:\n        labels:\n          opensergo.io/canary-gray: gray\n'})}),(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Fields"}),(0,a.jsx)(n.th,{children:"Type"}),(0,a.jsx)(n.th,{children:"Defaults"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"enableExtraWorkloadForCanary"})}),(0,a.jsx)(n.td,{children:"boolean"}),(0,a.jsx)(n.td,{children:"false"}),(0,a.jsx)(n.td,{children:"Whether to create extra workload for canary update,  the extra workload be deleted after rollout completions; if it is set to false, multi-batch update strategy will be used for workload"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].traffic"})}),(0,a.jsx)(n.td,{children:"*string"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Percent weight of canary traffic for new-version Pods."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].replicas"})}),(0,a.jsx)(n.td,{children:"*integer or *string"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"Absolute number or Percent of new-version Pods."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].pause"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{}),(0,a.jsx)(n.td,{children:"(optional) Manual confirmation or auto confirmation before enter the next step."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].pause.duration"})}),(0,a.jsx)(n.td,{children:"*integer"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Duration time before auto confirmation. if nil, means need manual confirmation."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].matches"})}),(0,a.jsx)(n.td,{children:"[]object"}),(0,a.jsx)(n.td,{children:"[]"}),(0,a.jsx)(n.td,{children:"(optional) The HTTP header match rules you want to traffic to new-version Pods."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].requestHeaderModifier"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{children:"[]"}),(0,a.jsx)(n.td,{children:"(optional)  overwrites the request with the given header (name, value)"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].type"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'"Exact"'}),(0,a.jsx)(n.td,{children:'"Exact" or "RegularExpression" rule to match key and value'})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].name"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Matched HTTP header name. (And-Relationship between headers[i] and headers[j])"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].value"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Matched HTTP header value."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"patchPodTemplateMetadata"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Add extra pod meta data by patch podTemplate of the canary workload"})]})]})]})]}),(0,a.jsxs)(l.A,{value:"v1alpha1",label:"v1alpha1",children:[(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rollouts.kruise.io/v1alpha1\nkind: Rollout\nmetadata:\n  namespace: <your-workload-ns>\nspec:\n  strategy:\n    canary:\n      steps:\n      # the first step\n      - weight: 5\n        replicas: 1 or 10%\n        pause:\n          duration: 0\n        matches:\n        - headers:\n          - type: Exact # or "RegularExpression"\n            name: <matched-header-name>\n            value: <matched-header-value, or reg-expression>\n      # the second step\n      - weight: 10\n        ... ....\n      patchPodTemplateMetadata:\n        labels:\n          opensergo.io/canary-gray: gray\n'})}),(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Fields"}),(0,a.jsx)(n.th,{children:"Type"}),(0,a.jsx)(n.th,{children:"Defaults"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].weight"})}),(0,a.jsx)(n.td,{children:"*integer"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Percent weight of canary traffic for new-version Pods."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].replicas"})}),(0,a.jsx)(n.td,{children:"*integer or *string"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Absolute number or Percent of new-version Pods. If nil, the default is to use 'weight' as replicas."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].pause"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{}),(0,a.jsx)(n.td,{children:"(optional) Manual confirmation or auto confirmation before enter the next step."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].pause.duration"})}),(0,a.jsx)(n.td,{children:"*integer"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Duration time before auto confirmation. if nil, means need manual confirmation."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"steps[x].matches"})}),(0,a.jsx)(n.td,{children:"[]object"}),(0,a.jsx)(n.td,{children:"[]"}),(0,a.jsx)(n.td,{children:"(optional) The HTTP header match rules you want to traffic to new-version Pods."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].type"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'"Exact"'}),(0,a.jsx)(n.td,{children:'"Exact" or "RegularExpression" rule to match key and value'})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].name"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Matched HTTP header name. (And-Relationship between headers[i] and headers[j])"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"headers[x].value"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"Matched HTTP header value."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"patchPodTemplateMetadata"})}),(0,a.jsx)(n.td,{children:"object"}),(0,a.jsx)(n.td,{children:"nil"}),(0,a.jsx)(n.td,{children:"(optional) Add extra pod meta data by patch podTemplate of the canary workload"})]})]})]})]})]}),"\n",(0,a.jsx)(n.p,{children:"Note:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"steps[x].replicas"})," can not be nil."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"steps[x].matches[i] and steps[x].matches[j]"})," have ",(0,a.jsx)(n.strong,{children:"Or"}),"-relationship."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"steps[x].matches[y].headers[i] and steps[x].matches[y].header[j]"})," have ",(0,a.jsx)(n.strong,{children:"And"}),"-relationship."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"patchPodTemplateMetadata"})," can be set only if enableExtraWorkloadForCanary=true"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"enableExtraWorkloadForCanary"})," is available in v1beta Rollout resource; In v1alpha1 Rollout resource, one can use the annotation of Rollout ",(0,a.jsx)(n.code,{children:"rollouts.kruise.io/rolling-type"}),'="canary" to enable ',(0,a.jsx)(n.code,{children:"enableExtraWorkloadForCanary"})]}),"\n"]}),"\n",(0,a.jsx)(n.h4,{id:"bluegreen",children:"blueGreen"}),"\n",(0,a.jsx)(n.p,{children:"Describe your strategy of rollout:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  namespace: your-workload-ns\nspec:\n  strategy:\n    blueGreen:\n      steps:\n      # the first step\n      - replicas: 100%\n      \ttraffic: 0%\n        pause:\n          duration: {}\n      # the second step\n      - replicas: 100%\n        matches:\n        - headers:\n          - type: Exact # or "RegularExpression"\n            name: matched-header-name\n            value: matched-header-value # value or reg-expression\n    # the third step\n      - replicas: 100%\n      \ttraffic: 100%\n\n'})}),"\n",(0,a.jsx)(n.p,{children:"Note:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["Except for the absence of the ",(0,a.jsx)(n.code,{children:"patchPodTemplateMetadata"})," and ",(0,a.jsx)(n.code,{children:"enableExtraWorkloadForCanary"})," fields, the configuration for ",(0,a.jsx)(n.code,{children:"blueGreen"})," and ",(0,a.jsx)(n.code,{children:"canary"})," are identical and follow the same precautions as ",(0,a.jsx)(n.code,{children:"canary"}),"."]}),"\n",(0,a.jsx)(n.li,{children:'For the differences between blue-green strategy and other strategies, please refer to "Release Strategies" - "Blue-Green Release."'}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"special-annotations-of-workload-optional",children:"Special Annotations of Workload (Optional)"}),"\n",(0,a.jsx)(n.p,{children:"There are some special annotations in Bounded Workload to enable specific abilities."}),"\n",(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Annotations"}),(0,a.jsx)(n.th,{children:"Value"}),(0,a.jsx)(n.th,{children:"Defaults"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsx)(n.tbody,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"rollouts.kruise.io/rollout-id"})}),(0,a.jsx)(n.td,{children:"any string"}),(0,a.jsx)(n.td,{children:'""'}),(0,a.jsx)(n.td,{children:"The concept is similar to the release order number. To solve the problem that users should know whether the current changes of workload is observed by Kruise Rollout controller."})]})})]}),"\n",(0,a.jsx)(n.h3,{id:"rollout-status-you-should-know",children:"Rollout Status You Should Know"}),"\n",(0,a.jsx)(n.h4,{id:"canary-1",children:"Canary"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'kind: Rollout\nstatus:\n  phase: Healthy\n  observedGeneration: 2\n  canaryStatus:\n    canaryReplicas: 10\n    canaryReadyReplicas: 10\n    canaryRevision: 76fd76f75b\n    currentStepIndex: 3\n    currentStepState: Completed\n    observedRolloutID: "20230313093823"\n    observedWorkloadGeneration: 20\n    podTemplateHash: 76fd76f75b\n    stableRevision: b76b6f48f\n'})}),"\n",(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:"Fields"}),(0,a.jsx)(n.th,{children:"Type"}),(0,a.jsx)(n.th,{children:"Mode"}),(0,a.jsx)(n.th,{children:"Explanation"})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"phase"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:'"Initial" means no bounded workload; "Healthy" means bounded workload is promoted; "Progressing" means rollout is working.'})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"observedGeneration"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"Observed rollout spec generation."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus"})}),(0,a.jsx)(n.td,{children:"*object"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"Information about rollout progressing."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.canaryReplicas"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"workload updated replicas"})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.canaryReadyReplicas"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"workload updated ready replicas."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.podTemplateHash"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"workload update(new) revision hash."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.canaryRevision"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"workload update(new) revision hash calculated by Kruise Rollout controller."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.stableRevision"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"workload stable(old) revision hash recorded before progressing."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.observedRolloutID"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsxs)(n.td,{children:["corresponding to workload ",(0,a.jsx)(n.code,{children:"rollouts.kruise.io/rollout-id"})," annotations. if they are equal, it means rollout controller watched workload changes."]})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.currentStepIndex"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"read-only"}),(0,a.jsx)(n.td,{children:"rollout current step index. Start from 1."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.nextStepIndex"})}),(0,a.jsx)(n.td,{children:"integer"}),(0,a.jsx)(n.td,{children:"read&write"}),(0,a.jsxs)(n.td,{children:["Indicates the next step to execute. If the current batch is the last batch or the release has ended, its value is set to -1. In other cases, it is typically equal to ",(0,a.jsx)(n.code,{children:"canaryStatus.currentStepIndex"})," + 1. Users can modify it to a reasonable positive number to enable non-sequential step execution."]})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.code,{children:"canaryStatus.currentStepState"})}),(0,a.jsx)(n.td,{children:"string"}),(0,a.jsx)(n.td,{children:"read&write"}),(0,a.jsx)(n.td,{children:'rollout current step state. Both "StepReady" and "Complete" mean current step is ready.'})]})]})]}),"\n",(0,a.jsx)(n.h4,{id:"blue-green",children:"Blue-Green"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'kind: Rollout\nstatus:\n  blueGreenStatus:\n    currentStepIndex: 1\n    currentStepState: StepPaused\n    lastUpdateTime: "2025-01-03T09:20:29Z"\n    message: BatchRelease is at state Ready, rollout-id , step 1\n    nextStepIndex: 2\n    observedWorkloadGeneration: 4\n    podTemplateHash: 64c6f99459\n    rolloutHash: 7w8dxcdc49wv4w49c469b27c6c7xb4f4c4dvf8dwd4b6zb5z4zcc852c7w9vf5dv\n    stableRevision: 65f957664d\n    updatedReadyReplicas: 10\n    updatedReplicas: 10\n    updatedRevision: 64448b955c\n'})}),"\n",(0,a.jsxs)(n.p,{children:["Just like ",(0,a.jsx)(n.code,{children:"canaryStatus"}),", ",(0,a.jsx)(n.code,{children:"blueGreenStatus"})," has ",(0,a.jsx)(n.strong,{children:"exactly the same"})," status fields, and their meanings are identical."]})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>l});var r=t(96540);const a={},s=r.createContext(a);function i(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(s.Provider,{value:n},e.children)}},65537:(e,n,t)=>{t.d(n,{A:()=>w});var r=t(96540),a=t(34164),s=t(65627),i=t(56347),l=t(50372),o=t(30604),d=t(11861),c=t(78749);function h(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return h(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:a}}=e;return{value:n,label:t,attributes:r,default:a}}))}(t);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function x(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:t}=e;const a=(0,i.W6)(),s=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o.aZ)(s),(0,r.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(a.location.search);n.set(s,e),a.replace({...a.location,search:n.toString()})}),[s,a])]}function j(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,s=u(e),[i,o]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!x({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:s}))),[d,h]=p({queryString:t,groupId:a}),[j,f]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,s]=(0,c.Dv)(t);return[a,(0,r.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:a}),m=(()=>{const e=d??j;return x({value:e,tabValues:s})?e:null})();(0,l.A)((()=>{m&&o(m)}),[m]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!x({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);o(e),h(e),f(e)}),[h,f,s]),tabValues:s}}var f=t(9136);const m={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=t(74848);function y(e){let{className:n,block:t,selectedValue:r,selectValue:i,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.a_)(),c=e=>{const n=e.currentTarget,t=o.indexOf(n),a=l[t].value;a!==r&&(d(n),i(a))},h=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":t},n),children:l.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>{o.push(e)},onKeyDown:h,onClick:c,...s,className:(0,a.A)("tabs__item",m.tabItem,s?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function b(e){let{lazy:n,children:t,selectedValue:s}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function v(e){const n=j(e);return(0,g.jsxs)("div",{className:(0,a.A)("tabs-container",m.tabList),children:[(0,g.jsx)(y,{...n,...e}),(0,g.jsx)(b,{...n,...e})]})}function w(e){const n=(0,f.A)();return(0,g.jsx)(v,{...e,children:h(e.children)},String(n))}},79329:(e,n,t)=>{t.d(n,{A:()=>i});t(96540);var r=t(34164);const a={tabItem:"tabItem_Ymn6"};var s=t(74848);function i(e){let{children:n,hidden:t,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.A)(a.tabItem,i),hidden:t,children:n})}}}]);
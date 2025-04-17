"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[408],{28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>a});var s=t(96540);const o={},r=s.createContext(o);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(r.Provider,{value:n},e.children)}},33543:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"user-manuals/persistentpodstate","title":"PersistentPodState","description":"FEATURE STATE: Kruise v1.2.0","source":"@site/versioned_docs/version-v1.7/user-manuals/persistentpodstate.md","sourceDirName":"user-manuals","slug":"/user-manuals/persistentpodstate","permalink":"/docs/v1.7/user-manuals/persistentpodstate","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/persistentpodstate.md","tags":[],"version":"v1.7","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"PersistentPodState"},"sidebar":"docs","previous":{"title":"ResourceDistribution","permalink":"/docs/v1.7/user-manuals/resourcedistribution"},"next":{"title":"PodProbeMarker","permalink":"/docs/v1.7/user-manuals/podprobemarker"}}');var o=t(74848),r=t(28453);const i={title:"PersistentPodState"},a=void 0,d={},l=[{value:"Usage",id:"usage",level:2},{value:"Annotation Auto Generate PersistentPodState",id:"annotation-auto-generate-persistentpodstate",level:3},{value:"Define PersistentPodState CRD",id:"define-persistentpodstate-crd",level:3},{value:"IP Retention Practice",id:"ip-retention-practice",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.2.0"]}),"\n",(0,o.jsx)(n.p,{children:"With the development of cloud native, more and more companies start to deploy stateful services (e.g., Etcd, MQ) using Kubernetes. K8S StatefulSet is a workload for managing stateful services, and it considers the deployment characteristics of stateful services in many aspects.\nHowever, StatefulSet persistent only limited pod state, such as Pod Name is ordered and unchanging, PVC persistence, and can not cover other states, e.g. Pod IP retention, priority scheduling to previously deployed Nodes, etc. Typical Cases:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Service Discovery Middleware services are exceptionally sensitive to the Pod IP after deployment, requiring that the IP cannot be changed."})}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Database services persist data to the host disk, and changes to the Node to which they belong will result in data loss."})}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:'In response to the above description, by customizing PersistentPodState CRD, Kruise is able to persistent other states of the Pod, such as "IP Retention".'}),"\n",(0,o.jsxs)(n.p,{children:["For detailed design, please refer to: ",(0,o.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/docs/proposals/20220421-persistent-pod-state.md",children:"PPS Proposal"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.h3,{id:"annotation-auto-generate-persistentpodstate",children:"Annotation Auto Generate PersistentPodState"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: StatefulSet\nmetadata:\n  annotations:\n    # auto generate PersistentPodState\n    kruise.io/auto-generate-persistent-pod-state: "true"\n    # preferred node affinity, As follows, Pod rebuild will preferred deployment to the same node\n    kruise.io/preferred-persistent-topology: kubernetes.io/hostname[,other node labels]\n    # required node affinity, As follows, Pod rebuild will force deployment to the same zone\n    kruise.io/required-persistent-topology: failure-domain.beta.kubernetes.io/zone[,other node labels]\n'})}),"\n",(0,o.jsx)(n.p,{children:"Some common PersistentPodState can be generated by annotation to satisfy most of the scenarios. For some complex scenarios, you can use PersistentPodState CRD to define them directly."}),"\n",(0,o.jsx)(n.h3,{id:"define-persistentpodstate-crd",children:"Define PersistentPodState CRD"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PersistentPodState\nmetadata:\n  name: echoserver\n  namespace: echoserver\nspec:\n  targetRef:\n    # Native k8s or kruise StatefulSet\n    # only support StatefulSet\n    apiVersion: apps.kruise.io/v1beta1\n    kind: StatefulSet\n    name: echoserver\n  # required node affinity. As follows, Pod rebuild will force deployment to the same zone\n  requiredPersistentTopology:\n    nodeTopologyKeys:\n      - failure-domain.beta.kubernetes.io/zone[,other node labels]\n  # preferred node affinity. As follows, Pod rebuild will preferred deployment to the same node\n  preferredPersistentTopology:\n    - preference:\n        nodeTopologyKeys:\n          - kubernetes.io/hostname[,other node labels]\n      # int [1, 100]\n      weight: 100\n"})}),"\n",(0,o.jsx)(n.h2,{id:"ip-retention-practice",children:"IP Retention Practice"}),"\n",(0,o.jsxs)(n.p,{children:['"IP Retention" should be a common requirement for K8S deployments of stateful services. It does not mean "Specified Pod IP", but requires that the Pod IP does not change after the first deployment, either by service release or by machine eviction.\nTo achieve this, we need the K8S network component to support Pod IP retention and the ability to keep the IP as unchanged as possible.\nIn this article, we have modified the Host-local plugin in the flannel network component so that it can achieve the effect of keeping the Pod IP unchanged under the same Node.\nRelated principles will not be stated here, please refer to the code: ',(0,o.jsx)(n.a,{href:"https://github.com/openkruise/samples/tree/master/containernetworking/plugins",children:"host-local"}),"."]}),"\n",(0,o.jsx)(n.p,{children:'IP retention seems to be supported by the network component, how is it related with PersistentPodState?\nWell, there are some limitations to the implementation of "Pod IP unchanged" by network components. For example, flannel can only support the same Node to keep the Pod IP unchanged.\nHowever, the most important feature of K8S scheduling is "uncertainty", so "how to ensure that Pods are rebuilt and scheduled to the same Node" is the problem that PersistentPodState solves.'}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:'1. Deploy stateful service echoserver, declaring "IP Retention" via annotations, as follows:'})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: StatefulSet\nmetadata:\n  name: echoserver\n  labels:\n    app: echoserver\n  annotations:\n    kruise.io/auto-generate-persistent-pod-state: "true"\n    kruise.io/preferred-persistent-topology: kubernetes.io/hostname\nspec:\n  serviceName: echoserver\n  replicas: 2\n  selector:\n    matchLabels:\n      app: echoserver\n  template:\n    metadata:\n      labels:\n        app: echoserver\n      annotations:\n        # Notify the flannel network component that the Pod rebuild keeps the IP unchanged and "10" means the Pod is deleted until the next successful dispatch, with a maximum of 10 minutes in between\n        # Mainly consider scenarios such as deletion, capacity reduction, etc.\n        io.kubernetes.cri/reserved-ip-duration: "10"\n    spec:\n      terminationGracePeriodSeconds: 5\n      containers:\n      - name: echoserver\n        image: cilium/echoserver:latest\n        imagePullPolicy: IfNotPresent\n'})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"2. According to the above configuration, kruise automatically generates PersistentPodState and records the node status of the first deployment of Pod in PersistentPodState.Status."})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PersistentPodState\nmetadata:\n  name: configserver\n  namespace: configserver\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1beta1\n    kind: StatefulSet\n    name: configserver\n  preferredPersistentTopology:\n  - preference:\n      nodeTopologyKeys:\n        - kubernetes.io/hostname\n    weight: 100\nstatus:\n  podStates:\n    # Record that pod-0 is deployed on worker2 node and pod-1 is deployed on worker1 node\n    configserver-0:\n      nodeName: worker2\n      nodeTopologyLabels:\n        kubernetes.io/hostname: worker2\n    configserver-1:\n      nodeName: worker1\n      nodeTopologyLabels:\n        kubernetes.io/hostname: worker1\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"3. After Pod rebuild due to service release or Node eviction, etc., kruise injects the recorded Pod node information into Pod NodeAffinity, which in turn enables the Pod IP to remain unchanged, as follows:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  name: configserver-0\n  namespace: configserver\n  annotations:\n    io.kubernetes.cri/reserved-ip-duration: 10\nspec:\n  # kruise webhook injection\n  affinity:\n    nodeAffinity:\n      preferredDuringSchedulingIgnoredDuringExecution:\n      - preference:\n          matchExpressions:\n          - key: kubernetes.io/hostname\n            operator: In\n            values:\n            - worker2\n        weight: 100\n  containers:\n  ...\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"staticIP",src:t(90551).A+"",width:"1268",height:"275"})})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},90551:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/static-ip-5b79470281bcd567a2aaf1e60f2cfb34.png"}}]);
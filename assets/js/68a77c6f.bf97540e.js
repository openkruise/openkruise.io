"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[1471],{28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>a});var s=n(96540);const o={},i=s.createContext(o);function r(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),s.createElement(i.Provider,{value:t},e.children)}},35957:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/uniteddeployment-2-0d3d6b19dee0e0cd3fe5bf6f121db109.png"},50399:e=>{e.exports=JSON.parse('{"permalink":"/blog/uniteddeployment","editUrl":"https://github.com/openkruise/openkruise.io/edit/master/blog/2019-11-20-uniteddeployment.md","source":"@site/blog/2019-11-20-uniteddeployment.md","title":"UnitedDeploymemt - Supporting Multi-domain Workload Management","description":"Ironically, probably every cloud user knew (or should realized that) failures in Cloud resources","date":"2019-11-20T00:00:00.000Z","tags":[{"inline":true,"label":"workload","permalink":"/blog/tags/workload"},{"inline":true,"label":"uniteddeployment","permalink":"/blog/tags/uniteddeployment"}],"readingTime":6.005,"hasTruncateMarker":false,"authors":[{"name":"Fei Guo","title":"Maintainer of OpenKruise","url":"https://github.com/Fei-Guo","imageURL":"https://github.com/Fei-Guo.png","key":"Fei-Guo","page":null}],"frontMatter":{"slug":"uniteddeployment","title":"UnitedDeploymemt - Supporting Multi-domain Workload Management","authors":["Fei-Guo"],"tags":["workload","uniteddeployment"]},"unlisted":false,"prevItem":{"title":"OpenKruise 0.8.0, A Powerful Tool for Sidecar Container Management","permalink":"/blog/sidecarset"},"nextItem":{"title":"Learning Concurrent Reconciling","permalink":"/blog/learning-concurrent-reconciling"}}')},68606:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/uniteddeployment-1-55a005182c47c03e50d0607235d9403e.png"},71315:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var s=n(50399),o=n(74848),i=n(28453);const r={slug:"uniteddeployment",title:"UnitedDeploymemt - Supporting Multi-domain Workload Management",authors:["Fei-Guo"],tags:["workload","uniteddeployment"]},a=void 0,l={authorsImageUrls:[void 0]},d=[{value:"Using <code>Subsets</code> to describe domain topology",id:"using-subsets-to-describe-domain-topology",level:2},{value:"Customized subset rollout <code>Partitions</code>",id:"customized-subset-rollout-partitions",level:2},{value:"Multi-Cluster application management (In future)",id:"multi-cluster-application-management-in-future",level:2},{value:"Summary",id:"summary",level:2}];function c(e){const t={a:"a",code:"code",h2:"h2",img:"img",p:"p",pre:"pre",strong:"strong",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.p,{children:"Ironically, probably every cloud user knew (or should realized that) failures in Cloud resources\nare inevitable. Hence, high availability is probably one of the most desirable features that\nCloud Provider offers for cloud users. For example, in AWS, each geographic region has\nmultiple isolated locations known as Availability Zones (AZs).\nAWS provides various AZ-aware solutions to allow the compute or storage resources of the user\napplications to be distributed across multiple AZs in order to tolerate AZ failure, which indeed\nhappened in the past."}),"\n",(0,o.jsxs)(t.p,{children:["In Kubernetes, the concept of AZ is not realized by an API object. Instead,\nan AZ is usually represented by a group of hosts that have the same location label.\nAlthough hosts within the same AZ can be identified by labels, the capability of distributing Pods across\nAZs was missing in Kubernetes default scheduler. Hence it was difficult to use single\n",(0,o.jsx)(t.code,{children:"StatefulSet"})," or ",(0,o.jsx)(t.code,{children:"Deployment"})," to perform  AZ-aware Pods deployment. Fortunately,\nin Kubernetes 1.16, a new feature called ",(0,o.jsx)(t.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/",children:'"Pod Topology Spread Constraints"'}),"\nwas introduced. Users now can add new constraints in the Pod Spec, and scheduler\nwill enforce the constraints so that Pods can be distributed across failure\ndomains such as AZs, regions or nodes, in a uniform fashion."]}),"\n",(0,o.jsxs)(t.p,{children:["In Kruise, ",(0,o.jsx)(t.strong,{children:"UnitedDeploymemt"})," provides an alternative to achieve high availability in\na cluster that consists of multiple fault domains - that is, managing multiple homogeneous\nworkloads, and each workload is dedicated to a single ",(0,o.jsx)(t.code,{children:"Subset"}),". Pod distribution across AZs is\ndetermined by the replica number of each workload.\nSince each ",(0,o.jsx)(t.code,{children:"Subset"})," is associated with a workload, UnitedDeployment can support\nfiner-grained rollout and deployment strategies.\nIn addition, UnitedDeploymemt can be further extended to support\nmultiple clusters! Let us reveal how UnitedDeployment is designed."]}),"\n",(0,o.jsxs)(t.h2,{id:"using-subsets-to-describe-domain-topology",children:["Using ",(0,o.jsx)(t.code,{children:"Subsets"})," to describe domain topology"]}),"\n",(0,o.jsxs)(t.p,{children:["UnitedDeploymemt uses ",(0,o.jsx)(t.code,{children:"Subset"})," to represent a failure domain. ",(0,o.jsx)(t.code,{children:"Subset"})," API\nprimarily specifies the nodes that forms the domain and the number of replicas, or\nthe percentage of total replicas, run in this domain. UnitedDeployment manages\nsubset workloads against a specific domain topology, described by a ",(0,o.jsx)(t.code,{children:"Subset"})," array."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"type Topology struct {\n\t// Contains the details of each subset.\n\tSubsets []Subset\n}\n\ntype Subset struct {\n\t// Indicates the name of this subset, which will be used to generate\n\t// subset workload name prefix in the format '<deployment-name>-<subset-name>-'.\n\tName string\n\n\t// Indicates the node select strategy to form the subset.\n\tNodeSelector corev1.NodeSelector\n\n\t// Indicates the number of the subset replicas or percentage of it on the\n\t// UnitedDeployment replicas.\n\tReplicas *intstr.IntOrString\n}\n"})}),"\n",(0,o.jsxs)(t.p,{children:["The specification of the subset workload is saved in ",(0,o.jsx)(t.code,{children:"Spec.Template"}),". UnitedDeployment\nonly supports ",(0,o.jsx)(t.code,{children:"StatefulSet"})," subset workload as of now. An interesting part of ",(0,o.jsx)(t.code,{children:"Subset"}),"\ndesign is that now user can specify ",(0,o.jsx)(t.strong,{children:"customized Pod distribution"})," across AZs, which is not\nnecessarily a uniform distribution in some cases. For example, if the AZ\nutilization or capacity are not homogeneous, evenly distributing Pods may lead to Pod deployment\nfailure due to lack of resources. If users have prior knowledge about AZ resource capacity/usage,\nUnitedDeployment can help to apply an optimal Pod distribution to ensure overall\ncluster utilization remains balanced. Of course, if not specified, a uniform Pod distribution\nwill be applied to maximize availability."]}),"\n",(0,o.jsxs)(t.h2,{id:"customized-subset-rollout-partitions",children:["Customized subset rollout ",(0,o.jsx)(t.code,{children:"Partitions"})]}),"\n",(0,o.jsxs)(t.p,{children:["User can update all the UnitedDeployment subset workloads by providing a\nnew version of subset workload template.\nNote that UnitedDeployment does not control\nthe entire rollout process of all subset workloads, which is typically done by another rollout\ncontroller built on top of it. Since the replica number in each ",(0,o.jsx)(t.code,{children:"Subset"})," can be different,\nit will be much more convenient to allow user to specify the individual rollout ",(0,o.jsx)(t.code,{children:"Partition"})," of each\nsubset workload instead of using one ",(0,o.jsx)(t.code,{children:"Partition"})," to rule all, so that they can be upgraded in the same pace.\nUnitedDeployment provides ",(0,o.jsx)(t.code,{children:"ManualUpdate"})," strategy to customize per subset rollout ",(0,o.jsx)(t.code,{children:"Partition"}),"."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"type UnitedDeploymentUpdateStrategy struct {\n\t// Type of UnitedDeployment update.\n\tType UpdateStrategyType\n\t// Indicates the partition of each subset.\n\tManualUpdate *ManualUpdate\n}\n\ntype ManualUpdate struct {\n\t// Indicates number of subset partition.\n\tPartitions map[string]int32\n}\n"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"multi-cluster controller",src:n(68606).A+"",width:"670",height:"420"})}),"\n",(0,o.jsxs)(t.p,{children:["This makes it fairly easy to coordinate multiple subsets rollout. For example,\nas illustrated in Figure 1, assuming UnitedDeployment manages three subsets and\ntheir replica numbers are 4, 2, 2 respectively, a rollout\ncontroller can realize a canary release plan of upgrading 50% of Pods in each\nsubset at a time by setting subset partitions to 2, 1, 1 respectively.\nThe same cannot be easily achieved by using a single workload controller like ",(0,o.jsx)(t.code,{children:"StatefulSet"}),"\nor ",(0,o.jsx)(t.code,{children:"Deployment"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"multi-cluster-application-management-in-future",children:"Multi-Cluster application management (In future)"}),"\n",(0,o.jsxs)(t.p,{children:["UnitedDeployment can be extended to support multi-cluster workload\nmanagement. The idea is that ",(0,o.jsx)(t.code,{children:"Subsets"})," may not only\nreside in one cluster, but also spread over multiple clusters.\nMore specifically, domain topology specification will associate\na ",(0,o.jsx)(t.code,{children:"ClusterRegistryQuerySpec"}),", which describes the clusters that UnitedDeployment\nmay distribute Pods to. Each cluster is represented by a custom resource managed by a\nClusterRegistry controller using Kubernetes ",(0,o.jsx)(t.a,{href:"https://github.com/kubernetes/cluster-registry",children:"cluster registry APIs"}),"."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"type Topology struct {\n  // ClusterRegistryQuerySpec is used to find the all the clusters that\n  // the workload may be deployed to. \n  ClusterRegistry *ClusterRegistryQuerySpec\n  // Contains the details of each subset including the target cluster name and\n  // the node selector in target cluster.\n  Subsets []Subset\n}\n\ntype ClusterRegistryQuerySpec struct {\n  // Namespaces that the cluster objects reside.\n  // If not specified, default namespace is used.\n  Namespaces []string\n  // Selector is the label matcher to find all qualified clusters.\n  Selector   map[string]string\n  // Describe the kind and APIversion of the cluster object.\n  ClusterType metav1.TypeMeta\n}\n\ntype Subset struct {\n  Name string\n\n  // The name of target cluster. The controller will validate that\n  // the TargetCluster exits based on Topology.ClusterRegistry.\n  TargetCluster *TargetCluster\n\n  // Indicate the node select strategy in the Subset.TargetCluster.\n  // If Subset.TargetCluster is not set, node selector strategy refers to\n  // current cluster.\n  NodeSelector corev1.NodeSelector\n\n  Replicas *intstr.IntOrString \n}\n\ntype TargetCluster struct {\n  // Namespace of the target cluster CRD\n  Namespace string\n  // Target cluster name\n  Name string\n}\n"})}),"\n",(0,o.jsxs)(t.p,{children:["A new ",(0,o.jsx)(t.code,{children:"TargetCluster"})," field is added to the ",(0,o.jsx)(t.code,{children:"Subset"})," API. If it presents, the\n",(0,o.jsx)(t.code,{children:"NodeSelector"})," indicates the node selection logic in the target cluster. Now\nUnitedDeployment controller can distribute application Pods to multiple clusters by\ninstantiating a ",(0,o.jsx)(t.code,{children:"StatefulSet"})," workload in each target cluster with a specific\nreplica number (or a percentage of total replica), as illustrated in Figure 2."]}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"multi-cluster\tcontroller",src:n(35957).A+"",width:"658",height:"547"})}),"\n",(0,o.jsxs)(t.p,{children:["At a first glance, UnitedDeployment looks more like a federation\ncontroller following the design pattern of ",(0,o.jsx)(t.a,{href:"https://github.com/kubernetes-sigs/kubefed",children:"Kubefed"}),",\nbut it isn't. The fundamental difference is that Kubefed focuses on propagating arbitrary\nobject types to remote clusters instead of managing an application across clusters.\nIn this example, had a Kubefed style controller been used, each ",(0,o.jsx)(t.code,{children:"StatefulSet"})," workload in\nindividual cluster would have a replica of 100. UnitedDeployment focuses more on\nproviding the ability of managing multiple workloads in multiple clusters on behalf\nof one application, which is absent in Kubernetes community to the best of our\nknowledge."]}),"\n",(0,o.jsx)(t.h2,{id:"summary",children:"Summary"}),"\n",(0,o.jsx)(t.p,{children:"This blog post introduces UnitedDeployment, a new controller which helps managing\napplication spread over multiple domains (in arbitrary clusters).\nIt not only allows evenly distributing Pods over AZs,\nwhich arguably can be more efficiently done using the new Pod Topology Spread\nConstraint APIs though, but also enables flexible workload deployment/rollout and\nsupports multi-cluster use cases in the future."})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);
"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[8386],{6394:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/containerrecreaterequest-f690e891609591c68e231c23212204ca.png"},28453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>o});var i=t(96540);const r={},a=i.createContext(r);function s(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),i.createElement(a.Provider,{value:n},e.children)}},28823:e=>{e.exports=JSON.parse('{"permalink":"/blog/openkruise-0.9.0","editUrl":"https://github.com/openkruise/openkruise.io/edit/master/blog/2021-05-20-release-0.9.0.md","source":"@site/blog/2021-05-20-release-0.9.0.md","title":"OpenKruise 0.9.0, Supports Pod Restart and Deletion Protection","description":"On May 20, 2021, OpenKruise released the latest version v0.9.0, with new features, such as Pod restart and resource cascading deletion protection. This article provides an overview of this new version.","date":"2021-05-20T00:00:00.000Z","tags":[{"inline":true,"label":"release","permalink":"/blog/tags/release"}],"readingTime":12.315,"hasTruncateMarker":false,"authors":[{"name":"Siyu Wang","title":"Maintainer of OpenKruise","url":"https://github.com/FillZpp","imageURL":"https://github.com/FillZpp.png","key":"FillZpp","page":null}],"frontMatter":{"slug":"openkruise-0.9.0","title":"OpenKruise 0.9.0, Supports Pod Restart and Deletion Protection","authors":["FillZpp"],"tags":["release"]},"unlisted":false,"prevItem":{"title":"OpenKruise 0.9.0, SidecarSet Helps Mesh Container Hot Upgrade","permalink":"/blog/sidecarset-hotupdate"},"nextItem":{"title":"OpenKruise 0.8.0, A Powerful Tool for Sidecar Container Management","permalink":"/blog/sidecarset"}}')},43646:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>i,toc:()=>d});var i=t(28823),r=t(74848),a=t(28453);const s={slug:"openkruise-0.9.0",title:"OpenKruise 0.9.0, Supports Pod Restart and Deletion Protection",authors:["FillZpp"],tags:["release"]},o=void 0,l={authorsImageUrls:[void 0]},d=[{value:"Pod Restart and Recreation",id:"pod-restart-and-recreation",level:2},{value:"Cascading Deletion Protection",id:"cascading-deletion-protection",level:2},{value:"New Features of CloneSet",id:"new-features-of-cloneset",level:2},{value:"Deletion Priority",id:"deletion-priority",level:3},{value:"Image Pre-Download for In-Place Update",id:"image-pre-download-for-in-place-update",level:3},{value:"Pod Replacement by Scale Out and Scale In",id:"pod-replacement-by-scale-out-and-scale-in",level:3},{value:"Efficient Rollback Based on Partition Final State",id:"efficient-rollback-based-on-partition-final-state",level:3},{value:"Short Hash",id:"short-hash",level:3},{value:"New Features of SidecarSet",id:"new-features-of-sidecarset",level:2},{value:"Sidecar Hot Upgrade Function",id:"sidecar-hot-upgrade-function",level:3},{value:"More",id:"more",level:2}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"On May 20, 2021, OpenKruise released the latest version v0.9.0, with new features, such as Pod restart and resource cascading deletion protection. This article provides an overview of this new version."}),"\n",(0,r.jsx)(n.h2,{id:"pod-restart-and-recreation",children:"Pod Restart and Recreation"}),"\n",(0,r.jsx)(n.p,{children:"Restarting container is a necessity in daily operation and a common technical method for recovery. In the native Kubernetes, the container granularity is inoperable. Pod, as the minimum operation unit, can only be created or deleted."}),"\n",(0,r.jsxs)(n.p,{children:["Some may ask: ",(0,r.jsx)(n.em,{children:"why do users still need to pay attention to the operation such as container restart in the cloud-native era? Aren't the services the only thing for users to focus on in the ideal Serverless model?"})]}),"\n",(0,r.jsxs)(n.p,{children:["To answer this question, we need to see the differences between cloud-native architecture and traditional infrastructures. In the era of traditional physical and virtual machines, multiple application instances are deployed and run on one machine, but the lifecycles of the machine and applications are separated. Thus, application instance restart may only require a ",(0,r.jsx)(n.code,{children:"systemctl"})," or ",(0,r.jsx)(n.code,{children:"supervisor"})," command but not the restart of the entire machine. However, in the era of containers and cloud-native, the lifecycle of the application is bound to that of the Pod container. In other words, under normal circumstances, one container only runs one application process, and one Pod provides services for only one application instance."]}),"\n",(0,r.jsxs)(n.p,{children:["Due to these restrictions, current native Kubernetes provides no API for the container (application) restart for upper-layer services. OpenKruise v0.9.0 supports restarting containers in a single Pod, compatible with standard Kubernetes clusters of version 1.16 or later. After installing or upgrading OpenKruise, users only need to create a ",(0,r.jsx)(n.code,{children:"ContainerRecreateRequest"})," (CRR) object to initiate a restart process. The simplest YAML file is listed below:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: ContainerRecreateRequest\nmetadata:\n  namespace: pod-namespace\n  name: xxx\nspec:\n  podName: pod-name\n  containers:\n  - name: app\n  - name: sidecar\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The value of namespace must be the same as the namespace of the Pod to be operated. The name can be set as needed. The ",(0,r.jsx)(n.code,{children:"podName"})," in the spec clause indicates the Pod name. The containers indicate a list that specifies one or more container names in the Pod to restart."]}),"\n",(0,r.jsx)(n.p,{children:"In addition to the required fields above, CRR also provides a variety of optional restart policies:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"spec:\n  # ...\n  strategy:\n    failurePolicy: Fail\n    orderedRecreate: false\n    terminationGracePeriodSeconds: 30\n    unreadyGracePeriodSeconds: 3\n    minStartedSeconds: 10\n  activeDeadlineSeconds: 300\n  ttlSecondsAfterFinished: 1800\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"failurePolicy"}),": Values: Fail or Ignore. Default value: Fail. If any container stops or fails to recreate, CRR ends immediately."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"orderedRecreate"}),": Default value: false. Value true indicates when the list contains multiple containers, the new container will only be recreated after the previous recreation is finished."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"terminationGracePeriodSeconds"}),": The time for the container to gracefully exit. If this parameter is not specified, the time defined for the Pod is used."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"unreadyGracePeriodSeconds"}),": Set the Pod to the unready state before recreation and wait for the time expiration to execute recreation.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Note"}),": This feature needs the feature-gate ",(0,r.jsx)(n.code,{children:"KruisePodReadinessGate"})," to be enabled, which will inject a readinessGate when a Pod is created. Otherwise, only the pods created by the OpenKruise workload are injected with readinessGate by default. It means only these Pods can use the ",(0,r.jsx)(n.code,{children:"unreadyGracePeriodSeconds"})," parameter during the CRR recreation."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"minStartedSeconds"}),": The minimal period that the new container remains running to judge whether the container is recreated successfully."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"activeDeadlineSeconds"}),": The expiration period set for CRR execution to mark as ended (unfinished container will be marked as failed.)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"ttlSecondsAfterFinished"}),": The period after which the CRR will be deleted automatically after the execution ends."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"How it works under the hood:"})," After it is created, a CRR is processed by the kruise-manager. Then, it will be sent to the kruise-daemon (contained by the node where Pod resides) for execution. The execution process is listed below:"]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["If ",(0,r.jsx)(n.code,{children:"preStop"})," is specified for a Pod, the kruise-daemon will first call the CRI to run the command specified by ",(0,r.jsx)(n.code,{children:"preStop"})," in the container."]}),"\n",(0,r.jsxs)(n.li,{children:["If no ",(0,r.jsx)(n.code,{children:"preStop"})," exists or ",(0,r.jsx)(n.code,{children:"preStop"})," execution is completed, the kruise-daemon will call the CRI to stop the container."]}),"\n",(0,r.jsxs)(n.li,{children:['When the kubelet detects the container exiting, it creates a new container with an increasing "serial number" and starts it. ',(0,r.jsx)(n.code,{children:"postStart"})," will be executed at the same time."]}),"\n",(0,r.jsx)(n.li,{children:"When the kruise-daemon detects the start of the new container, it reports to CRR that the restart is completed."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"ContainerRecreateRequest",src:t(6394).A+"",width:"1924",height:"986"})}),"\n",(0,r.jsxs)(n.p,{children:['The container "serial number" corresponds to the ',(0,r.jsx)(n.code,{children:"restartCount"})," reported by kubelet in the Pod status. Therefore, the ",(0,r.jsx)(n.code,{children:"restartCount"})," of the Pod increases after the container is restarted. Temporary files written to the ",(0,r.jsx)(n.code,{children:"rootfs"})," in the old container will be lost due to the container recreation, but data in the volume mount remains."]}),"\n",(0,r.jsx)(n.h2,{id:"cascading-deletion-protection",children:"Cascading Deletion Protection"}),"\n",(0,r.jsx)(n.p,{children:"The level triggered automation of Kubernetes is a double-edged sword. It brings declarative deployment capabilities to applications while potentially enlarging the influence of mistakes at a final-state scale. For example, with the cascading deletion mechanism, once an owning resource is deleted under normal circumstances (non-orphan deletion), all owned resources associated will be deleted by the following rules:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"If a CRD is deleted, all its corresponding CR will be cleared."}),"\n",(0,r.jsx)(n.li,{children:"If a namespace is deleted, all resources in this namespace, including Pods, will be cleared."}),"\n",(0,r.jsx)(n.li,{children:"If a workload (Deployment, StatefulSet, etc) is deleted, all Pods under it will be cleared."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Due to failures caused by cascading deletion, we have heard many complaints from Kubernetes users and developers in the community. It is unbearable for any enterprise to mistakenly delete objects at such a large scale in the production environment."}),"\n",(0,r.jsxs)(n.p,{children:["Therefore, in OpenKruise v0.9.0, we applied the feature of cascading deletion protection to community in the hope of ensuring stability for more users. If you want to use this feature in the current version, the feature-gate of ",(0,r.jsx)(n.code,{children:"ResourcesDeletionProtection"})," needs to be explicitly enabled when installing or upgrading OpenKruise."]}),"\n",(0,r.jsxs)(n.p,{children:["A label of ",(0,r.jsx)(n.code,{children:"policy.kruise.io/delete-protection"})," can be given on the resource objects that require protection. Its value can be the following two things:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Always"}),": The object cannot be deleted unless the label is removed."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Cascading"}),": The object cannot be deleted if any subordinate resources are available."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The following table lists the supported resource types and cascading relationships:"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Kind"}),(0,r.jsx)(n.th,{children:"Group"}),(0,r.jsx)(n.th,{children:"Version"}),(0,r.jsxs)(n.th,{children:[(0,r.jsx)(n.strong,{children:"Cascading"})," judgement"]})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"Namespace"})}),(0,r.jsx)(n.td,{children:"core"}),(0,r.jsx)(n.td,{children:"v1"}),(0,r.jsx)(n.td,{children:"whether there is active Pods in this namespace"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"CustomResourceDefinition"})}),(0,r.jsx)(n.td,{children:"apiextensions.k8s.io"}),(0,r.jsx)(n.td,{children:"v1beta1, v1"}),(0,r.jsx)(n.td,{children:"whether there is existing CRs of this CRD"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"Deployment"})}),(0,r.jsx)(n.td,{children:"apps"}),(0,r.jsx)(n.td,{children:"v1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"StatefulSet"})}),(0,r.jsx)(n.td,{children:"apps"}),(0,r.jsx)(n.td,{children:"v1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"ReplicaSet"})}),(0,r.jsx)(n.td,{children:"apps"}),(0,r.jsx)(n.td,{children:"v1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"CloneSet"})}),(0,r.jsx)(n.td,{children:"apps.kruise.io"}),(0,r.jsx)(n.td,{children:"v1alpha1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"StatefulSet"})}),(0,r.jsx)(n.td,{children:"apps.kruise.io"}),(0,r.jsx)(n.td,{children:"v1alpha1, v1beta1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"UnitedDeployment"})}),(0,r.jsx)(n.td,{children:"apps.kruise.io"}),(0,r.jsx)(n.td,{children:"v1alpha1"}),(0,r.jsx)(n.td,{children:"whether the replicas is 0"})]})]})]}),"\n",(0,r.jsx)(n.h2,{id:"new-features-of-cloneset",children:"New Features of CloneSet"}),"\n",(0,r.jsx)(n.h3,{id:"deletion-priority",children:"Deletion Priority"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"controller.kubernetes.io/pod-deletion-cost"})," annotation was added to Kubernetes after version 1.21. ",(0,r.jsx)(n.code,{children:"ReplicaSet"})," will sort the Kubernetes resources according to this cost value during scale in. CloneSet has supported the same feature since OpenKruise v0.9.0."]}),"\n",(0,r.jsx)(n.p,{children:"Users can configure this annotation in the pod. The int type of its value indicates the deletion cost of a certain pod compared to other pods under the same CloneSet. Pods with a lower cost have a higher deletion priority. If this annotation is not set, the deletion cost of the pod is 0 by default."}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.em,{children:"Note"}),": This deletion order is not determined solely by deletion cost. The real order serves like this:"]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Not scheduled < scheduled"}),"\n",(0,r.jsx)(n.li,{children:"PodPending < PodUnknown < PodRunning"}),"\n",(0,r.jsx)(n.li,{children:"Not ready < ready"}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Smaller pod-deletion cost < larger pod-deletion cost"})}),"\n",(0,r.jsx)(n.li,{children:"Period in the Ready state: short < long"}),"\n",(0,r.jsx)(n.li,{children:"Containers restart: more times < fewer times"}),"\n",(0,r.jsx)(n.li,{children:"Creation time: short < long"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"image-pre-download-for-in-place-update",children:"Image Pre-Download for In-Place Update"}),"\n",(0,r.jsx)(n.p,{children:"When CloneSet is used for the in-place update of an application, only the container image is updated, while the Pod is not rebuilt. This ensures that the node where the Pod is located will not change. Therefore, if the CloneSet pulls the new image from all the Pod nodes in advance, the Pod in-place update speed will be improved substantially in subsequent batch releases."}),"\n",(0,r.jsxs)(n.p,{children:["If you want to use this feature in the current version, the feature-gate of ",(0,r.jsx)(n.code,{children:"PreDownloadImageForInPlaceUpdate"})," needs to be explicitly enabled when installing or upgrading OpenKruise. If you update the images in the CloneSet template and the publish policy supports in-place update, CloneSet will create an ",(0,r.jsx)(n.code,{children:"ImagePullJob"})," object automatically (the batch image pre-download function provided by OpenKruise) to download new images in advance on the node where the Pod is located."]}),"\n",(0,r.jsxs)(n.p,{children:["By default, CloneSet sets the parallelism to 1 for ",(0,r.jsx)(n.code,{children:"ImagePullJob"}),", which means images are pulled for one node and then another. For any adjustment, you can set the parallelism in the CloneSet annotation by executing the following code:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "5"\n'})}),"\n",(0,r.jsx)(n.h3,{id:"pod-replacement-by-scale-out-and-scale-in",children:"Pod Replacement by Scale Out and Scale In"}),"\n",(0,r.jsxs)(n.p,{children:["In previous versions, the ",(0,r.jsx)(n.code,{children:"maxUnavailable"})," and ",(0,r.jsx)(n.code,{children:"maxSurge"})," policies of CloneSet only take effect during the application release process. In OpenKruise v0.9.0 and later versions, these two policies also function when deleting a specified Pod."]}),"\n",(0,r.jsxs)(n.p,{children:["When the user specifies one or more Pods to be deleted through ",(0,r.jsx)(n.code,{children:"podsToDelete"})," or ",(0,r.jsx)(n.code,{children:"apps.kruise.io/specified-delete"}),": true, CloneSet will only execute deletion when the number of unavailable Pods (of the total replicas) is less than the value of ",(0,r.jsx)(n.code,{children:"maxUnavailable"}),". In addition, if the user has configured the ",(0,r.jsx)(n.code,{children:"maxSurge"})," policy, the CloneSet will possibly create a new Pod first, wait for the new Pod to be ready, and then delete the old specified Pod."]}),"\n",(0,r.jsx)(n.p,{children:"The replacement method depends on the value of maxUnavailable and the number of unavailable Pods. For example:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["For a CloneSet, ",(0,r.jsx)(n.code,{children:"maxUnavailable=2, maxSurge=1"})," and only ",(0,r.jsx)(n.code,{children:"pod-a"})," is unavailable. If you specify ",(0,r.jsx)(n.code,{children:"pod-b"})," to be deleted, CloneSet will delete it promptly and create a new Pod."]}),"\n",(0,r.jsxs)(n.li,{children:["For a CloneSet, ",(0,r.jsx)(n.code,{children:"maxUnavailable=1, maxSurge=1"})," and only ",(0,r.jsx)(n.code,{children:"pod-a"})," is unavailable. If you specify ",(0,r.jsx)(n.code,{children:"pod-b"})," to be deleted, CloneSet will create a new Pod, wait for it to be ready, and then delete the pod-b."]}),"\n",(0,r.jsxs)(n.li,{children:["For a CloneSet, ",(0,r.jsx)(n.code,{children:"maxUnavailable=1, maxSurge=1"})," and only ",(0,r.jsx)(n.code,{children:"pod-a"})," is unavailable. If you specify this ",(0,r.jsx)(n.code,{children:"pod-a"})," to be deleted, CloneSet will delete it promptly and create a new Pod."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"efficient-rollback-based-on-partition-final-state",children:"Efficient Rollback Based on Partition Final State"}),"\n",(0,r.jsx)(n.p,{children:"In the native workload, Deployment does not support phased release, while StatefulSet provides partition semantics to allow users to control the times of gray scale upgrades. OpenKruise workloads, such as CloneSet and Advanced StatefulSet, also provide partitions to support phased release."}),"\n",(0,r.jsxs)(n.p,{children:["For CloneSet, the semantics of Partition is ",(0,r.jsx)(n.strong,{children:"the number or percentage of Pods remaining in the old version"}),". For example, for a CloneSet with 100 replicas, if the partition value is changed in the sequence of 80 ","\u27a1\ufe0f"," 60 ","\u27a1\ufe0f"," 40 ","\u27a1\ufe0f"," 20 ","\u27a1\ufe0f"," 0 by steps during the image upgrade, the CloneSet is released in five batches."]}),"\n",(0,r.jsx)(n.p,{children:"However, in the past, whether it is Deployment, StatefulSet, or CloneSet, if rollback is required during the release process, the template information (image) must be changed back to the old version. During the phased release of StatefulSet and CloneSet, reducing partition value will trigger the upgrade to a new version. Increasing partition value will not trigger rollback to the old version."}),"\n",(0,r.jsxs)(n.p,{children:['The partition of CloneSet supports the "final state rollback" function after v0.9.0. If the feature-gate ',(0,r.jsx)(n.code,{children:"CloneSetPartitionRollback"})," is enabled when installing or upgrading OpenKruise, increasing the partition value will trigger CloneSet to roll back the corresponding number of new Pods to the old version."]}),"\n",(0,r.jsxs)(n.p,{children:['There is a clear advantage here. During the phased release, only the partition value needs to be adjusted to flexibly control the numbers of old and new versions. However, the "old and new versions" for CloneSet correspond to ',(0,r.jsx)(n.code,{children:"updateRevision"})," and ",(0,r.jsx)(n.code,{children:"currentRevision"})," in its status:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"updateRevision: The version of the template defined by the current CloneSet."}),"\n",(0,r.jsxs)(n.li,{children:["currentRevision: The template version of CloneSet during the ",(0,r.jsx)(n.strong,{children:"previous successful full release"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"short-hash",children:"Short Hash"}),"\n",(0,r.jsxs)(n.p,{children:["By default, the value of ",(0,r.jsx)(n.code,{children:"controller-revision-hash"})," in Pod label set by CloneSet is the full name of the ",(0,r.jsx)(n.code,{children:"ControllerRevision"}),". For example:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    controller-revision-hash: demo-cloneset-956df7994\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The name is concatenated with the CloneSet name and the ",(0,r.jsx)(n.code,{children:"ControllerRevision"})," hash value. Generally, the hash value is 8 to 10 characters in length. In Kubernetes, a label cannot exceed 63 characters in length. Therefore, the name of CloneSet cannot exceed 52 characters in length, or the Pod cannot be created."]}),"\n",(0,r.jsxs)(n.p,{children:["In v0.9.0, the new feature-gate ",(0,r.jsx)(n.code,{children:"CloneSetShortHash"})," is introduced. If it is enabled, CloneSet will set the value of ",(0,r.jsx)(n.code,{children:"controller-revision-hash"})," in the Pod to a hash value only, like 956df7994. Therefore, the length restriction of the CloneSet name is eliminated. (CloneSet can still recognize and manage the Pod with revision labels in the full format, even if this function is enabled.)"]}),"\n",(0,r.jsx)(n.h2,{id:"new-features-of-sidecarset",children:"New Features of SidecarSet"}),"\n",(0,r.jsx)(n.h3,{id:"sidecar-hot-upgrade-function",children:"Sidecar Hot Upgrade Function"}),"\n",(0,r.jsxs)(n.p,{children:["SidecarSet is a workload provided by OpenKruise to manage sidecar containers separately. Users can inject and upgrade specified sidecar containers within a certain range of Pods using ",(0,r.jsx)(n.code,{children:"SidecarSet"}),"."]}),"\n",(0,r.jsx)(n.p,{children:"By default, for the independent in-place sidecar upgrade, the sidecar stops the container of the old version first and then creates a container of the new version. This method applies to sidecar containers that do not affect the Pod service availability, such as the log collection agent. However, for sidecar containers acting as a proxy such as Istio Envoy, this upgrade method is defective. Envoy, as a proxy container in the Pod, handles all the traffic. If users restart and upgrade directly, service availability will be affected. Thus, you need a complex grace termination and coordination mechanism to upgrade the envoy sidecar separately. Therefore, we offer a new solution for the upgrade of this kind of sidecar containers, namely, hot upgrade:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: SidecarSet\nspec:\n  # ...\n  containers:\n  - name: nginx-sidecar\n    image: nginx:1.18\n    lifecycle:\n      postStart:\n        exec:\n          command:\n          - /bin/bash\n          - -c\n          - /usr/local/bin/nginx-agent migrate\n    upgradeStrategy:\n      upgradeType: HotUpgrade\n      hotUpgradeEmptyImage: empty:1.0.0\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"upgradeType"}),": ",(0,r.jsx)(n.code,{children:"HotUpgrade"})," indicates that the type of the sidecar container is a hot upgrade, so the hot upgrade solution, ",(0,r.jsx)(n.code,{children:"hotUpgradeEmptyImage"}),", will be executed. When performing a hot upgrade on the sidecar container, an empty container is required to switch services during the upgrade. The empty container has almost the same configuration as the sidecar container, except the image address, for example, command, lifecycle, and probe, but it does no actual work."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"lifecycle.postStart"}),": State migration. This procedure completes the state migration during the hot upgrade. The script needs to be executed according to business characteristics. For example, NGINX hot upgrade requires shared Listen FD and traffic reloading."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"more",children:"More"}),"\n",(0,r.jsxs)(n.p,{children:["For more changes, please refer to the ",(0,r.jsx)(n.a,{href:"https://github.com/openkruise/kruise/releases",children:"release page"})," or ",(0,r.jsx)(n.a,{href:"https://github.com/openkruise/kruise/blob/master/CHANGELOG.md",children:"ChangeLog"}),"."]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}}}]);
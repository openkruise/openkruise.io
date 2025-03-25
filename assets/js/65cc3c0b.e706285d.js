"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[9458],{28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>r});var t=a(96540);const i={},l=t.createContext(i);function s(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(l.Provider,{value:n},e.children)}},83290:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>p,frontMatter:()=>s,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"user-manuals/advancedstatefulset","title":"Advanced StatefulSet","description":"This controller enhances the rolling update workflow of Kubernetes StatefulSet","source":"@site/docs/user-manuals/advancedstatefulset.md","sourceDirName":"user-manuals","slug":"/user-manuals/advancedstatefulset","permalink":"/docs/next/user-manuals/advancedstatefulset","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advancedstatefulset.md","tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{"title":"Advanced StatefulSet"},"sidebar":"docs","previous":{"title":"CloneSet","permalink":"/docs/next/user-manuals/cloneset"},"next":{"title":"Advanced DaemonSet","permalink":"/docs/next/user-manuals/advanceddaemonset"}}');var i=a(74848),l=a(28453);const s={title:"Advanced StatefulSet"},r=void 0,d={},o=[{value:"Pod Identity",id:"pod-identity",level:2},{value:"Ordinal Index",id:"ordinal-index",level:3},{value:"Start ordinal",id:"start-ordinal",level:3},{value:"User Stories",id:"user-stories",level:4},{value:"Story 1",id:"story-1",level:5},{value:"Story 2",id:"story-2",level:5},{value:"Story 3",id:"story-3",level:5},{value:"Scale features",id:"scale-features",level:2},{value:"PersistentVolumeClaim retention",id:"persistentvolumeclaim-retention",level:3},{value:"Scaling with rate limiting",id:"scaling-with-rate-limiting",level:3},{value:"Ordinals reserve(skip)",id:"ordinals-reserveskip",level:3},{value:"Specified Pod Deletion",id:"specified-pod-deletion",level:3},{value:"Update features",id:"update-features",level:2},{value:"In-Place Update",id:"in-place-update",level:3},{value:"Pre-download image for in-place update",id:"pre-download-image-for-in-place-update",level:3},{value:"Update sequence",id:"update-sequence",level:3},{value:"Priority strategy",id:"priority-strategy",level:4},{value:"MaxUnavailable",id:"maxunavailable",level:3},{value:"Paused update",id:"paused-update",level:3},{value:"Lifecycle hook",id:"lifecycle-hook",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",h5:"h5",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["This controller enhances the rolling update workflow of ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",children:"Kubernetes StatefulSet"}),"\ncontroller in large-scale scenarios, such as adding maxUnavailable and introducing in-place update strategy."]}),"\n",(0,i.jsx)(n.p,{children:"If you don't know much about the Kubernetes StatefulSet, we strongly recommend you read its documents before learning Advanced StatefulSet."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",children:"Concept of Kubernetes StatefulSet"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/",children:"Deploying a stateful application"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Note that Advanced StatefulSet extends the same CRD schema of default StatefulSet with newly added fields.\nThe CRD kind name is still ",(0,i.jsx)(n.code,{children:"StatefulSet"}),".\nThis is done on purpose so that user can easily migrate workload to the Advanced StatefulSet from the\ndefault StatefulSet. For example, one may simply replace the value of ",(0,i.jsx)(n.code,{children:"apiVersion"})," in the StatefulSet yaml\nfile from ",(0,i.jsx)(n.code,{children:"apps/v1"})," to ",(0,i.jsx)(n.code,{children:"apps.kruise.io/v1beta1"})," after installing Kruise manager."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1beta1\n   kind: StatefulSet\n   metadata:\n     name: sample\n   spec:\n     #...\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Note that since Kruise v0.7.0, Advanced StatefulSet has been promoted to ",(0,i.jsx)(n.code,{children:"v1beta1"}),", which is compatible with ",(0,i.jsx)(n.code,{children:"v1alpha1"}),".\nAnd for Kruise version lower than v0.7.0, you can only use ",(0,i.jsx)(n.code,{children:"v1alpha1"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"pod-identity",children:"Pod Identity"}),"\n",(0,i.jsx)(n.p,{children:"StatefulSet Pods have a unique identity that consists of an ordinal, a stable network identity, and stable storage. The identity sticks to the Pod, regardless of which node it's (re)scheduled on."}),"\n",(0,i.jsx)(n.h3,{id:"ordinal-index",children:"Ordinal Index"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,i.jsxs)(n.p,{children:["For a StatefulSet with N replicas, each Pod in the StatefulSet will be assigned an integer ordinal, that is unique over the Set. By default, pods will be assigned ordinals from 0 up through N-1. The StatefulSet controller will also add a pod label with this index: ",(0,i.jsx)(n.strong,{children:"apps.kubernetes.io/pod-index"}),", as follows:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: sample\n    apps.kubernetes.io/pod-index: "0"\n  name: sample-0\n'})}),"\n",(0,i.jsx)(n.h3,{id:"start-ordinal",children:"Start ordinal"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.7.0"]}),"\n",(0,i.jsxs)(n.p,{children:["Pod start ordinal numbers start at 0 by default, and you can also set the pod start ordinal number by setting the ",(0,i.jsx)(n.strong,{children:".spec.ordinals.start"})," field. To use this capability, you need to enable FeatureGate ",(0,i.jsx)(n.strong,{children:"StatefulSetStartOrdinal=true"}),"."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:".spec.ordinals.start: If the .spec.ordinals.start field is set, Pods will be assigned ordinals from .spec.ordinals.start up through .spec.ordinals.start + .spec.replicas - 1.\nFor example: replicas=5, ordinals.start=3, Pod Range = [3, 7]."}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 5\n  ordinals:\n    start: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      containers:\n      - name: main\n        image: nginx:alpine\n"})}),"\n",(0,i.jsx)(n.h4,{id:"user-stories",children:"User Stories"}),"\n",(0,i.jsx)(n.p,{children:"The main motivation of this feature is to support a more flexible StatefulSet, a building block in an ecosystem where Stateful applications can be migrated across Kubernetes clusters with more automation. As follows:"}),"\n",(0,i.jsx)(n.h5,{id:"story-1",children:"Story 1"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Migrating across namespaces"}),": Many organizations use namespaces for team isolation. Consider a team that is migrating a ",(0,i.jsx)(n.code,{children:"StatefulSet"})," to a new namespace in a cluster. Migration could be motivated by a branding change, or a requirement to move out of a shared namespace. Consider the StatefulSet ",(0,i.jsx)(n.code,{children:"my-app"})," with ",(0,i.jsx)(n.code,{children:"replicas: 5"}),", running in a shared namespace."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"name: my-app\nnamespace: shared\nreplicas: 5\n-----------------------------------------------\n[ nginx-0, nginx-1, nginx-2, nginx-3, nginx-4 ]\n"})}),"\n",(0,i.jsxs)(n.p,{children:["To move two pods, the ",(0,i.jsx)(n.code,{children:"my-app"})," StatefulSet in the ",(0,i.jsx)(n.code,{children:"shared"})," namespace can be scaled down to ",(0,i.jsx)(n.code,{children:"replicas: 3, ordinals.start: 0"}),", and an analogous StatefulSet in the ",(0,i.jsx)(n.code,{children:"app-team"})," namespace scaled up to ",(0,i.jsx)(n.code,{children:"replicas: 2, ordinals.start: 3"}),". This allows for pod ordinals to be managed during migration. The application operator should manage network connectivity, volumes and slice orchestration (when to migrate and by how many replicas)."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"name: my-app\t\t\t\t\t\tname: my-app\nnamespace: shared\t\t\t\t\tnamespace: app-team\nreplicas: 3\t\t\t\t\t\t    replicas: 2\nordinals.start: 0\t\t\t\t    ordinals.start: 3\n------------------------------\t\t---------------------\n[ nginx-0, nginx-1, nginx-2 ]\t\t[ nginx-3, nginx-4 ]\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"replicasStatefulSet"})," and ",(0,i.jsx)(n.code,{children:"replicas"})," fields should be updated jointly, depending on the requirements of the migration."]}),"\n",(0,i.jsx)(n.h5,{id:"story-2",children:"Story 2"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Migrating across clusters"}),": Organizations taking a multi cluster approach may need to move workloads across clusters due to capacity constraints, infrastructure constraints, or for better application isolation. Similar to namespace migration, the application operator should manage network connectivity, volumes and slice orchestration."]}),"\n",(0,i.jsx)(n.h5,{id:"story-3",children:"Story 3"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Non-Zero Based Indexing:"})," A user may want to number their StatefulSet starting from ordinal ",(0,i.jsx)(n.code,{children:"1"}),", rather than ordinal ",(0,i.jsx)(n.code,{children:"0"}),". Using\n",(0,i.jsx)(n.code,{children:"1"})," based numbering may be easier to reason about and conceptualize (eg: ordinal ",(0,i.jsx)(n.code,{children:"k"})," is the ",(0,i.jsx)(n.code,{children:"k"}),"'th replica, not the ",(0,i.jsx)(n.code,{children:"k+1"}),"'th replica)."]}),"\n",(0,i.jsx)(n.h2,{id:"scale-features",children:"Scale features"}),"\n",(0,i.jsx)(n.h3,{id:"persistentvolumeclaim-retention",children:"PersistentVolumeClaim retention"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.1.0"]}),"\n",(0,i.jsxs)(n.p,{children:["If you have enabled the ",(0,i.jsx)(n.code,{children:"StatefulSetAutoDeletePVC"})," feature-gate during ",(0,i.jsx)(n.a,{href:"../installation#optional-feature-gate",children:"Kruise installation or upgrade"}),",\nyou can use ",(0,i.jsx)(n.code,{children:".spec.persistentVolumeClaimRetentionPolicy"})," field to control if and how PVCs are deleted during the lifecycle of a StatefulSet."]}),"\n",(0,i.jsxs)(n.p,{children:["This is same to the upstream StatefulSet (K8s >= 1.23 [alpha]), please refer to ",(0,i.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention",children:"the upstream document for it"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"scaling-with-rate-limiting",children:"Scaling with rate limiting"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,i.jsxs)(n.p,{children:["To avoid creating all failure pods at once when a new CloneSet applied, a ",(0,i.jsx)(n.code,{children:"maxUnavailable"})," field for scale strategy has been added since Kruise ",(0,i.jsx)(n.code,{children:"v0.10.0"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 100\n  scaleStrategy:\n    maxUnavailable: 10% # percentage or absolute number\n"})}),"\n",(0,i.jsx)(n.p,{children:"When this field has been set, Advanced StatefulSet will create pods with the guarantee that the number of unavailable pods during the update cannot exceed this value."}),"\n",(0,i.jsx)(n.p,{children:"For example, the StatefulSet will firstly create 10 pods. After that, it will create one more pod only if one pod created has been running and ready."}),"\n",(0,i.jsx)(n.p,{children:"Note that it can just be allowed to work with Parallel podManagementPolicy."}),"\n",(0,i.jsx)(n.h3,{id:"ordinals-reserveskip",children:"Ordinals reserve(skip)"}),"\n",(0,i.jsxs)(n.p,{children:["Since Advanced StatefulSet ",(0,i.jsx)(n.code,{children:"v1beta1"})," (Kruise >= v0.7.0), it supports ordinals reserve."]}),"\n",(0,i.jsxs)(n.p,{children:["By adding the ordinals to reserve into ",(0,i.jsx)(n.code,{children:"reserveOrdinals"})," fields, Advanced StatefulSet will skip to create Pods with those ordinals.\nIf these Pods have already existed, controller will delete them.\nNote that ",(0,i.jsx)(n.code,{children:"spec.replicas"})," is the expectation number of running Pods and ",(0,i.jsx)(n.code,{children:"spec.reserveOrdinals"})," is the ordinals that should be skipped."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 4\n  reserveOrdinals:\n  - 1\n"})}),"\n",(0,i.jsxs)(n.p,{children:["For an Advanced StatefulSet with ",(0,i.jsx)(n.code,{children:"replicas=4, reserveOrdinals=[1]"}),", the ordinals of running Pods will be ",(0,i.jsx)(n.code,{children:"[0,2,3,4]"}),"."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["If you want to migrate Pod-3 and reserve this ordinal, just append ",(0,i.jsx)(n.code,{children:"3"})," into ",(0,i.jsx)(n.code,{children:"reserveOrdinals"})," list.\nThen controller will delete Pod-3 and create Pod-5 (existing Pods will be ",(0,i.jsx)(n.code,{children:"[0,2,4,5]"}),")."]}),"\n",(0,i.jsxs)(n.li,{children:["If you just want to delete Pod-3, you should append ",(0,i.jsx)(n.code,{children:"3"})," into ",(0,i.jsx)(n.code,{children:"reserveOrdinals"})," list and set ",(0,i.jsx)(n.code,{children:"replicas"})," to ",(0,i.jsx)(n.code,{children:"3"}),".\nThen controller will delete Pod-3 (existing Pods will be ",(0,i.jsx)(n.code,{children:"[0,2,4]"}),")."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"specified-pod-deletion",children:"Specified Pod Deletion"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.5.5, Kruise v1.6.4, Kruise v1.7.2+"]}),"\n",(0,i.jsxs)(n.p,{children:["Compared to manually deleting a Pod directly, pod deletion by labeling pod with ",(0,i.jsx)(n.code,{children:"apps.kruise.io/specified-delete: true"})," will be protected by the ",(0,i.jsx)(n.code,{children:"maxUnavailable"})," of the Advanced StatefulSet during deletion,\nand it will trigger the ",(0,i.jsx)(n.code,{children:"PreparingDelete"})," lifecycle hook (see below)."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    # ...\n    apps.kruise.io/specified-delete: true\nspec:\n  containers:\n  - name: main\n  # ...\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When the controller receives the above Pod update, it will trigger the deletion process of the pod with specified deletion label and ensure that the ",(0,i.jsx)(n.code,{children:"maxUnavailable"})," limit is not exceeded.\nThe pod will be re-built by the workload if the ordinal is not reserved."]}),"\n",(0,i.jsx)(n.h2,{id:"update-features",children:"Update features"}),"\n",(0,i.jsx)(n.h3,{id:"in-place-update",children:"In-Place Update"}),"\n",(0,i.jsxs)(n.p,{children:["Advanced StatefulSet adds a ",(0,i.jsx)(n.code,{children:"podUpdatePolicy"})," field in ",(0,i.jsx)(n.code,{children:"spec.updateStrategy.rollingUpdate"}),"\nwhich controls recreate or in-place update for Pods."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"ReCreate"})," controller will delete old Pods and create new ones. This is the same behavior as default StatefulSet."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"InPlaceIfPossible"})," controller will try to in-place update Pod instead of recreating them if possible. Please ready the concept doc below."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"InPlaceOnly"})," controller will in-place update Pod instead of recreating them. With ",(0,i.jsx)(n.code,{children:"InPlaceOnly"})," policy, user cannot modify any fields other than the fields that supported to in-place update."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsxs)(n.strong,{children:["You may need to read the ",(0,i.jsx)(n.a,{href:"../core-concepts/inplace-update",children:"concept doc"})," for more details of in-place update."]})}),"\n",(0,i.jsxs)(n.p,{children:["We also bring ",(0,i.jsx)(n.strong,{children:"graceful period"})," into in-place update. Advanced StatefulSet has supported ",(0,i.jsx)(n.code,{children:"gracePeriodSeconds"}),", which is a period\nduration between controller update pod status and update pod images.\nSo that endpoints-controller could have enough time to remove this Pod from endpoints."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      inPlaceUpdateStrategy:\n        gracePeriodSeconds: 10\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"More importantly"}),", a readiness-gate named ",(0,i.jsx)(n.code,{children:"InPlaceUpdateReady"})," must be  added into ",(0,i.jsx)(n.code,{children:"template.spec.readinessGates"}),"\nwhen using ",(0,i.jsx)(n.code,{children:"InPlaceIfPossible"})," or ",(0,i.jsx)(n.code,{children:"InPlaceOnly"}),". The condition ",(0,i.jsx)(n.code,{children:"InPlaceUpdateReady"})," in podStatus will be updated to False before in-place\nupdate and updated to True after the update is finished. This ensures that pod remain at NotReady state while the in-place\nupdate is happening."]}),"\n",(0,i.jsx)(n.p,{children:"An example for StatefulSet using in-place update:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      readinessGates:\n         # A new condition that ensures the pod remains at NotReady state while the in-place update is happening\n      - conditionType: InPlaceUpdateReady\n      containers:\n      - name: main\n        image: nginx:alpine\n  podManagementPolicy: Parallel # allow parallel updates, works together with maxUnavailable\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      # Do in-place update if possible, currently only image update is supported for in-place update\n      podUpdatePolicy: InPlaceIfPossible\n      # Allow parallel updates with max number of unavailable instances equals to 2\n      maxUnavailable: 2\n"})}),"\n",(0,i.jsx)(n.h3,{id:"pre-download-image-for-in-place-update",children:"Pre-download image for in-place update"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.10.0"]}),"\n",(0,i.jsxs)(n.p,{children:["If you have enabled the ",(0,i.jsx)(n.code,{children:"PreDownloadImageForInPlaceUpdate"})," feature-gate during ",(0,i.jsx)(n.a,{href:"../installation#optional-feature-gate",children:"Kruise installation or upgrade"}),",\nAdvanced StatefulSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.\nIt is quite useful to accelerate the progress of applications upgrade."]}),"\n",(0,i.jsxs)(n.p,{children:["The parallelism of each new image pre-downloading by Advanced StatefulSet is ",(0,i.jsx)(n.code,{children:"1"}),", which means the image is downloaded on nodes one by one.\nYou can change the parallelism using ",(0,i.jsx)(n.code,{children:"apps.kruise.io/image-predownload-parallelism"})," annotation on Advanced StatefulSet according to the capability of image registry,\nfor registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process."]}),"\n",(0,i.jsxs)(n.p,{children:["Since Kruise v1.1.0, you can use ",(0,i.jsx)(n.code,{children:"apps.kruise.io/image-predownload-min-updated-ready-pods"})," to make sure the new image starting pre-download after a few new Pods have been updated ready. Its value can be absolute number or percentage."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Note that to avoid most unnecessary image downloading, now controller will only pre-download images for Advanced StatefulSet with replicas > ",(0,i.jsx)(n.code,{children:"3"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"update-sequence",children:"Update sequence"}),"\n",(0,i.jsxs)(n.p,{children:["Advanced StatefulSet adds a ",(0,i.jsx)(n.code,{children:"unorderedUpdate"})," field in ",(0,i.jsx)(n.code,{children:"spec.updateStrategy.rollingUpdate"}),", which contains strategies for non-ordered update.\nIf ",(0,i.jsx)(n.code,{children:"unorderedUpdate"})," is not nil, pods will be updated with non-ordered sequence. Noted that UnorderedUpdate can only be allowed to work with Parallel podManagementPolicy."]}),"\n",(0,i.jsxs)(n.p,{children:["Currently ",(0,i.jsx)(n.code,{children:"unorderedUpdate"})," only contains one field: ",(0,i.jsx)(n.code,{children:"priorityStrategy"}),"."]}),"\n",(0,i.jsx)(n.h4,{id:"priority-strategy",children:"Priority strategy"}),"\n",(0,i.jsxs)(n.p,{children:["This strategy defines rules for calculating the priority of updating pods.\nAll update candidates will be applied with the priority terms.\n",(0,i.jsx)(n.code,{children:"priority"})," can be calculated either by weight or by order."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"weight"}),": Priority is determined by the sum of weights for terms that match selector. For example,"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          weightPriority:\n          - weight: 50\n            matchSelector:\n              matchLabels:\n                test-key: foo\n          - weight: 30\n            matchSelector:\n              matchLabels:\n                test-key: bar\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"order"}),': Priority will be determined by the value of the orderKey. The update candidates are sorted based on the "int" part of the value string. For example, 5 in string "5" and 10 in string "sts-10".']}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          orderPriority:\n          - orderedKey: some-label-key\n"})}),"\n",(0,i.jsx)(n.h3,{id:"maxunavailable",children:"MaxUnavailable"}),"\n",(0,i.jsxs)(n.p,{children:["Advanced StatefulSet adds a ",(0,i.jsx)(n.code,{children:"maxUnavailable"})," capability in the ",(0,i.jsx)(n.code,{children:"RollingUpdateStatefulSetStrategy"})," to allow parallel Pod\nupdates with the guarantee that the number of unavailable pods during the update cannot exceed this value.\nIt is only allowed to use when the podManagementPolicy is ",(0,i.jsx)(n.code,{children:"Parallel"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["This feature achieves similar update efficiency like Deployment for cases where the order of\nupdate is not critical to the workload. Without this feature, the native ",(0,i.jsx)(n.code,{children:"StatefulSet"})," controller can only\nupdate Pods one by one even if the podManagementPolicy is ",(0,i.jsx)(n.code,{children:"Parallel"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 20%\n"})}),"\n",(0,i.jsxs)(n.p,{children:["For example, assuming an Advanced StatefulSet has five Pods named P0 to P4, and the application can\ntolerate losing three replicas temporally. If we want to update the StatefulSet Pod spec from v1 to\nv2, we can perform the following steps using the ",(0,i.jsx)(n.code,{children:"MaxUnavailable"})," feature for fast update."]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Set ",(0,i.jsx)(n.code,{children:"MaxUnavailable"})," to 3 to allow three unavailable Pods maximally."]}),"\n",(0,i.jsxs)(n.li,{children:["Optionally, Set ",(0,i.jsx)(n.code,{children:"Partition"})," to 4 in case canary update is needed. Partition means all Pods with an ordinal that is\ngreater than or equal to the partition will be updated. In this case P4 will be updated even though ",(0,i.jsx)(n.code,{children:"MaxUnavailable"}),"\nis 3."]}),"\n",(0,i.jsxs)(n.li,{children:["After P4 finish update, change ",(0,i.jsx)(n.code,{children:"Partition"})," to 0. The controller will update P1,P2 and P3 concurrently.\nNote that with default StatefulSet, the Pods will be updated sequentially in the order of P3, P2, P1."]}),"\n",(0,i.jsx)(n.li,{children:"Once one of P1, P2 and P3 finishes update, P0 will be updated immediately."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"paused-update",children:"Paused update"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"paused"})," indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n"})}),"\n",(0,i.jsx)(n.h2,{id:"lifecycle-hook",children:"Lifecycle hook"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v0.8.0"]}),"\n",(0,i.jsxs)(n.p,{children:["This is similar to ",(0,i.jsx)(n.a,{href:"./cloneset#lifecycle-hook",children:"Lifecycle hook of CloneSet"}),"."]})]})}function p(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}}}]);
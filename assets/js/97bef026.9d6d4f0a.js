"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5110],{3905:function(e,t,a){a.d(t,{Zo:function(){return d},kt:function(){return m}});var n=a(67294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},d=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,i=e.originalType,p=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),c=s(a),m=l,h=c["".concat(p,".").concat(m)]||c[m]||u[m]||i;return a?n.createElement(h,r(r({ref:t},d),{},{components:a})):n.createElement(h,r({ref:t},d))}));function m(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var i=a.length,r=new Array(i);r[0]=c;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:l,r[1]=o;for(var s=2;s<i;s++)r[s]=a[s];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},39731:function(e,t,a){a.r(t),a.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return u}});var n=a(87462),l=a(63366),i=(a(67294),a(3905)),r=["components"],o={title:"Advanced StatefulSet"},p=void 0,s={unversionedId:"user-manuals/advancedstatefulset",id:"version-v1.7/user-manuals/advancedstatefulset",title:"Advanced StatefulSet",description:"This controller enhances the rolling update workflow of Kubernetes StatefulSet",source:"@site/versioned_docs/version-v1.7/user-manuals/advancedstatefulset.md",sourceDirName:"user-manuals",slug:"/user-manuals/advancedstatefulset",permalink:"/docs/user-manuals/advancedstatefulset",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advancedstatefulset.md",tags:[],version:"v1.7",lastUpdatedBy:"Abner",lastUpdatedAt:1728563186,formattedLastUpdatedAt:"10/10/2024",frontMatter:{title:"Advanced StatefulSet"},sidebar:"docs",previous:{title:"CloneSet",permalink:"/docs/user-manuals/cloneset"},next:{title:"Advanced DaemonSet",permalink:"/docs/user-manuals/advanceddaemonset"}},d={},u=[{value:"Pod Identity",id:"pod-identity",level:2},{value:"Ordinal Index",id:"ordinal-index",level:3},{value:"Start ordinal",id:"start-ordinal",level:3},{value:"User Stories",id:"user-stories",level:4},{value:"Story 1",id:"story-1",level:5},{value:"Story 2",id:"story-2",level:5},{value:"Story 3",id:"story-3",level:5},{value:"Scale features",id:"scale-features",level:2},{value:"PersistentVolumeClaim retention",id:"persistentvolumeclaim-retention",level:3},{value:"Scaling with rate limiting",id:"scaling-with-rate-limiting",level:3},{value:"Ordinals reserve(skip)",id:"ordinals-reserveskip",level:3},{value:"Specified Pod Deletion",id:"specified-pod-deletion",level:3},{value:"Update features",id:"update-features",level:2},{value:"In-Place Update",id:"in-place-update",level:3},{value:"Pre-download image for in-place update",id:"pre-download-image-for-in-place-update",level:3},{value:"Update sequence",id:"update-sequence",level:3},{value:"Priority strategy",id:"priority-strategy",level:4},{value:"MaxUnavailable",id:"maxunavailable",level:3},{value:"Paused update",id:"paused-update",level:3},{value:"Lifecycle hook",id:"lifecycle-hook",level:2}],c={toc:u};function m(e){var t=e.components,a=(0,l.Z)(e,r);return(0,i.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This controller enhances the rolling update workflow of ",(0,i.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/"},"Kubernetes StatefulSet"),"\ncontroller in large-scale scenarios, such as adding maxUnavailable and introducing in-place update strategy."),(0,i.kt)("p",null,"If you don't know much about the Kubernetes StatefulSet, we strongly recommend you read its documents before learning Advanced StatefulSet."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/"},"Concept of Kubernetes StatefulSet")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/"},"Deploying a stateful application"))),(0,i.kt)("p",null,"Note that Advanced StatefulSet extends the same CRD schema of default StatefulSet with newly added fields.\nThe CRD kind name is still ",(0,i.kt)("inlineCode",{parentName:"p"},"StatefulSet"),".\nThis is done on purpose so that user can easily migrate workload to the Advanced StatefulSet from the\ndefault StatefulSet. For example, one may simply replace the value of ",(0,i.kt)("inlineCode",{parentName:"p"},"apiVersion")," in the StatefulSet yaml\nfile from ",(0,i.kt)("inlineCode",{parentName:"p"},"apps/v1")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/v1beta1")," after installing Kruise manager."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"-  apiVersion: apps/v1\n+  apiVersion: apps.kruise.io/v1beta1\n   kind: StatefulSet\n   metadata:\n      name: sample\n   spec:\n   #...\n")),(0,i.kt)("p",null,"Note that since Kruise v0.7.0, Advanced StatefulSet has been promoted to ",(0,i.kt)("inlineCode",{parentName:"p"},"v1beta1"),", which is compatible with ",(0,i.kt)("inlineCode",{parentName:"p"},"v1alpha1"),".\nAnd for Kruise version lower than v0.7.0, you can only use ",(0,i.kt)("inlineCode",{parentName:"p"},"v1alpha1"),"."),(0,i.kt)("h2",{id:"pod-identity"},"Pod Identity"),(0,i.kt)("p",null,"StatefulSet Pods have a unique identity that consists of an ordinal, a stable network identity, and stable storage. The identity sticks to the Pod, regardless of which node it's (re)scheduled on."),(0,i.kt)("h3",{id:"ordinal-index"},"Ordinal Index"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.7.0"),(0,i.kt)("p",null,"For a StatefulSet with N replicas, each Pod in the StatefulSet will be assigned an integer ordinal, that is unique over the Set. By default, pods will be assigned ordinals from 0 up through N-1. The StatefulSet controller will also add a pod label with this index: ",(0,i.kt)("strong",{parentName:"p"},"apps.kubernetes.io/pod-index"),", as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: sample\n    apps.kubernetes.io/pod-index: "0"\n  name: sample-0\n')),(0,i.kt)("h3",{id:"start-ordinal"},"Start ordinal"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.7.0"),(0,i.kt)("p",null,"Pod start ordinal numbers start at 0 by default, and you can also set the pod start ordinal number by setting the ",(0,i.kt)("strong",{parentName:"p"},".spec.ordinals.start")," field. To use this capability, you need to enable FeatureGate ",(0,i.kt)("strong",{parentName:"p"},"StatefulSetStartOrdinal=true"),"."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},".spec.ordinals.start: If the .spec.ordinals.start field is set, Pods will be assigned ordinals from .spec.ordinals.start up through .spec.ordinals.start + .spec.replicas - 1.\nFor example: replicas=5, ordinals.start=3, Pod Range = ","[3, 7]",".")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 5\n  ordinals:\n    start: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      containers:\n      - name: main\n        image: nginx:alpine\n")),(0,i.kt)("h4",{id:"user-stories"},"User Stories"),(0,i.kt)("p",null,"The main motivation of this feature is to support a more flexible StatefulSet, a building block in an ecosystem where Stateful applications can be migrated across Kubernetes clusters with more automation. As follows:"),(0,i.kt)("h5",{id:"story-1"},"Story 1"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Migrating across namespaces"),": Many organizations use namespaces for team isolation. Consider a team that is migrating a ",(0,i.kt)("inlineCode",{parentName:"p"},"StatefulSet")," to a new namespace in a cluster. Migration could be motivated by a branding change, or a requirement to move out of a shared namespace. Consider the StatefulSet ",(0,i.kt)("inlineCode",{parentName:"p"},"my-app")," with ",(0,i.kt)("inlineCode",{parentName:"p"},"replicas: 5"),", running in a shared namespace."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"name: my-app\nnamespace: shared\nreplicas: 5\n-----------------------------------------------\n[ nginx-0, nginx-1, nginx-2, nginx-3, nginx-4 ]\n")),(0,i.kt)("p",null,"To move two pods, the ",(0,i.kt)("inlineCode",{parentName:"p"},"my-app")," StatefulSet in the ",(0,i.kt)("inlineCode",{parentName:"p"},"shared")," namespace can be scaled down to ",(0,i.kt)("inlineCode",{parentName:"p"},"replicas: 3, ordinals.start: 0"),", and an analogous StatefulSet in the ",(0,i.kt)("inlineCode",{parentName:"p"},"app-team")," namespace scaled up to ",(0,i.kt)("inlineCode",{parentName:"p"},"replicas: 2, ordinals.start: 3"),". This allows for pod ordinals to be managed during migration. The application operator should manage network connectivity, volumes and slice orchestration (when to migrate and by how many replicas)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"name: my-app                        name: my-app\nnamespace: shared                   namespace: app-team\nreplicas: 3                         replicas: 2\nordinals.start: 0                   ordinals.start: 3\n------------------------------      ---------------------\n[ nginx-0, nginx-1, nginx-2 ]       [ nginx-3, nginx-4 ]\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"replicasStatefulSet")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"replicas")," fields should be updated jointly, depending on the requirements of the migration."),(0,i.kt)("h5",{id:"story-2"},"Story 2"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Migrating across clusters"),": Organizations taking a multi cluster approach may need to move workloads across clusters due to capacity constraints, infrastructure constraints, or for better application isolation. Similar to namespace migration, the application operator should manage network connectivity, volumes and slice orchestration."),(0,i.kt)("h5",{id:"story-3"},"Story 3"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Non-Zero Based Indexing:")," A user may want to number their StatefulSet starting from ordinal ",(0,i.kt)("inlineCode",{parentName:"p"},"1"),", rather than ordinal ",(0,i.kt)("inlineCode",{parentName:"p"},"0"),". Using\n",(0,i.kt)("inlineCode",{parentName:"p"},"1")," based numbering may be easier to reason about and conceptualize (eg: ordinal ",(0,i.kt)("inlineCode",{parentName:"p"},"k")," is the ",(0,i.kt)("inlineCode",{parentName:"p"},"k"),"'th replica, not the ",(0,i.kt)("inlineCode",{parentName:"p"},"k+1"),"'th replica)."),(0,i.kt)("h2",{id:"scale-features"},"Scale features"),(0,i.kt)("h3",{id:"persistentvolumeclaim-retention"},"PersistentVolumeClaim retention"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.1.0"),(0,i.kt)("p",null,"If you have enabled the ",(0,i.kt)("inlineCode",{parentName:"p"},"StatefulSetAutoDeletePVC")," feature-gate during ",(0,i.kt)("a",{parentName:"p",href:"../installation#optional-feature-gate"},"Kruise installation or upgrade"),",\nyou can use ",(0,i.kt)("inlineCode",{parentName:"p"},".spec.persistentVolumeClaimRetentionPolicy")," field to control if and how PVCs are deleted during the lifecycle of a StatefulSet."),(0,i.kt)("p",null,"This is same to the upstream StatefulSet (K8s >= 1.23 ","[alpha]","), please refer to ",(0,i.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention"},"the upstream document for it"),"."),(0,i.kt)("h3",{id:"scaling-with-rate-limiting"},"Scaling with rate limiting"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.10.0"),(0,i.kt)("p",null,"To avoid creating all failure pods at once when a new CloneSet applied, a ",(0,i.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," field for scale strategy has been added since Kruise ",(0,i.kt)("inlineCode",{parentName:"p"},"v0.10.0"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 100\n  scaleStrategy:\n    maxUnavailable: 10% # percentage or absolute number\n")),(0,i.kt)("p",null,"When this field has been set, Advanced StatefulSet will create pods with the guarantee that the number of unavailable pods during the update cannot exceed this value."),(0,i.kt)("p",null,"For example, the StatefulSet will firstly create 10 pods. After that, it will create one more pod only if one pod created has been running and ready."),(0,i.kt)("p",null,"Note that it can just be allowed to work with Parallel podManagementPolicy."),(0,i.kt)("h3",{id:"ordinals-reserveskip"},"Ordinals reserve(skip)"),(0,i.kt)("p",null,"Since Advanced StatefulSet ",(0,i.kt)("inlineCode",{parentName:"p"},"v1beta1")," (Kruise >= v0.7.0), it supports ordinals reserve."),(0,i.kt)("p",null,"By adding the ordinals to reserve into ",(0,i.kt)("inlineCode",{parentName:"p"},"reserveOrdinals")," fields, Advanced StatefulSet will skip to create Pods with those ordinals.\nIf these Pods have already existed, controller will delete them.\nNote that ",(0,i.kt)("inlineCode",{parentName:"p"},"spec.replicas")," is the expectation number of running Pods and ",(0,i.kt)("inlineCode",{parentName:"p"},"spec.reserveOrdinals")," is the ordinals that should be skipped."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  replicas: 4\n  reserveOrdinals:\n  - 1\n")),(0,i.kt)("p",null,"For an Advanced StatefulSet with ",(0,i.kt)("inlineCode",{parentName:"p"},"replicas=4, reserveOrdinals=[1]"),", the ordinals of running Pods will be ",(0,i.kt)("inlineCode",{parentName:"p"},"[0,2,3,4]"),"."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"If you want to migrate Pod-3 and reserve this ordinal, just append ",(0,i.kt)("inlineCode",{parentName:"li"},"3")," into ",(0,i.kt)("inlineCode",{parentName:"li"},"reserveOrdinals")," list.\nThen controller will delete Pod-3 and create Pod-5 (existing Pods will be ",(0,i.kt)("inlineCode",{parentName:"li"},"[0,2,4,5]"),")."),(0,i.kt)("li",{parentName:"ul"},"If you just want to delete Pod-3, you should append ",(0,i.kt)("inlineCode",{parentName:"li"},"3")," into ",(0,i.kt)("inlineCode",{parentName:"li"},"reserveOrdinals")," list and set ",(0,i.kt)("inlineCode",{parentName:"li"},"replicas")," to ",(0,i.kt)("inlineCode",{parentName:"li"},"3"),".\nThen controller will delete Pod-3 (existing Pods will be ",(0,i.kt)("inlineCode",{parentName:"li"},"[0,2,4]"),").")),(0,i.kt)("h3",{id:"specified-pod-deletion"},"Specified Pod Deletion"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v1.5.5, Kruise v1.6.4, Kruise v1.7.2+"),(0,i.kt)("p",null,"Compared to manually deleting a Pod directly, pod deletion by labeling pod with ",(0,i.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/specified-delete: true")," will be protected by the ",(0,i.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," of the Advanced StatefulSet during deletion,\nand it will trigger the ",(0,i.kt)("inlineCode",{parentName:"p"},"PreparingDelete")," lifecycle hook (see below)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    # ...\n    apps.kruise.io/specified-delete: true\nspec:\n  containers:\n  - name: main\n  # ...\n")),(0,i.kt)("p",null,"When the controller receives the above Pod update, it will trigger the deletion process of the pod with specified deletion label and ensure that the ",(0,i.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," limit is not exceeded.\nThe pod will be re-built by the workload if the ordinal is not reserved."),(0,i.kt)("h2",{id:"update-features"},"Update features"),(0,i.kt)("h3",{id:"in-place-update"},"In-Place Update"),(0,i.kt)("p",null,"Advanced StatefulSet adds a ",(0,i.kt)("inlineCode",{parentName:"p"},"podUpdatePolicy")," field in ",(0,i.kt)("inlineCode",{parentName:"p"},"spec.updateStrategy.rollingUpdate"),"\nwhich controls recreate or in-place update for Pods."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ReCreate")," controller will delete old Pods and create new ones. This is the same behavior as default StatefulSet."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"InPlaceIfPossible")," controller will try to in-place update Pod instead of recreating them if possible. Please ready the concept doc below."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"InPlaceOnly")," controller will in-place update Pod instead of recreating them. With ",(0,i.kt)("inlineCode",{parentName:"li"},"InPlaceOnly")," policy, user cannot modify any fields other than the fields that supported to in-place update.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"You may need to read the ",(0,i.kt)("a",{parentName:"strong",href:"../core-concepts/inplace-update"},"concept doc")," for more details of in-place update.")),(0,i.kt)("p",null,"We also bring ",(0,i.kt)("strong",{parentName:"p"},"graceful period")," into in-place update. Advanced StatefulSet has supported ",(0,i.kt)("inlineCode",{parentName:"p"},"gracePeriodSeconds"),", which is a period\nduration between controller update pod status and update pod images.\nSo that endpoints-controller could have enough time to remove this Pod from endpoints."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      podUpdatePolicy: InPlaceIfPossible\n      inPlaceUpdateStrategy:\n        gracePeriodSeconds: 10\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"More importantly"),", a readiness-gate named ",(0,i.kt)("inlineCode",{parentName:"p"},"InPlaceUpdateReady")," must be  added into ",(0,i.kt)("inlineCode",{parentName:"p"},"template.spec.readinessGates"),"\nwhen using ",(0,i.kt)("inlineCode",{parentName:"p"},"InPlaceIfPossible")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"InPlaceOnly"),". The condition ",(0,i.kt)("inlineCode",{parentName:"p"},"InPlaceUpdateReady")," in podStatus will be updated to False before in-place\nupdate and updated to True after the update is finished. This ensures that pod remain at NotReady state while the in-place\nupdate is happening."),(0,i.kt)("p",null,"An example for StatefulSet using in-place update:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  name: sample\nspec:\n  replicas: 3\n  serviceName: fake-service\n  selector:\n    matchLabels:\n      app: sample\n  template:\n    metadata:\n      labels:\n        app: sample\n    spec:\n      readinessGates:\n         # A new condition that ensures the pod remains at NotReady state while the in-place update is happening\n      - conditionType: InPlaceUpdateReady\n      containers:\n      - name: main\n        image: nginx:alpine\n  podManagementPolicy: Parallel # allow parallel updates, works together with maxUnavailable\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      # Do in-place update if possible, currently only image update is supported for in-place update\n      podUpdatePolicy: InPlaceIfPossible\n      # Allow parallel updates with max number of unavailable instances equals to 2\n      maxUnavailable: 2\n")),(0,i.kt)("h3",{id:"pre-download-image-for-in-place-update"},"Pre-download image for in-place update"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.10.0"),(0,i.kt)("p",null,"If you have enabled the ",(0,i.kt)("inlineCode",{parentName:"p"},"PreDownloadImageForInPlaceUpdate")," feature-gate during ",(0,i.kt)("a",{parentName:"p",href:"../installation#optional-feature-gate"},"Kruise installation or upgrade"),",\nAdvanced StatefulSet controller will automatically pre-download the image you want to update to the nodes of all old Pods.\nIt is quite useful to accelerate the progress of applications upgrade."),(0,i.kt)("p",null,"The parallelism of each new image pre-downloading by Advanced StatefulSet is ",(0,i.kt)("inlineCode",{parentName:"p"},"1"),", which means the image is downloaded on nodes one by one.\nYou can change the parallelism using ",(0,i.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/image-predownload-parallelism")," annotation on Advanced StatefulSet according to the capability of image registry,\nfor registries with more bandwidth and P2P image downloading ability, a larger parallelism can speed up the pre-download process."),(0,i.kt)("p",null,"Since Kruise v1.1.0, you can use ",(0,i.kt)("inlineCode",{parentName:"p"},"apps.kruise.io/image-predownload-min-updated-ready-pods")," to make sure the new image starting pre-download after a few new Pods have been updated ready. Its value can be absolute number or percentage."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nmetadata:\n  annotations:\n    apps.kruise.io/image-predownload-parallelism: "10"\n    apps.kruise.io/image-predownload-min-updated-ready-pods: "3"\n')),(0,i.kt)("p",null,"Note that to avoid most unnecessary image downloading, now controller will only pre-download images for Advanced StatefulSet with replicas > ",(0,i.kt)("inlineCode",{parentName:"p"},"3"),"."),(0,i.kt)("h3",{id:"update-sequence"},"Update sequence"),(0,i.kt)("p",null,"Advanced StatefulSet adds a ",(0,i.kt)("inlineCode",{parentName:"p"},"unorderedUpdate")," field in ",(0,i.kt)("inlineCode",{parentName:"p"},"spec.updateStrategy.rollingUpdate"),", which contains strategies for non-ordered update.\nIf ",(0,i.kt)("inlineCode",{parentName:"p"},"unorderedUpdate")," is not nil, pods will be updated with non-ordered sequence. Noted that UnorderedUpdate can only be allowed to work with Parallel podManagementPolicy."),(0,i.kt)("p",null,"Currently ",(0,i.kt)("inlineCode",{parentName:"p"},"unorderedUpdate")," only contains one field: ",(0,i.kt)("inlineCode",{parentName:"p"},"priorityStrategy"),"."),(0,i.kt)("h4",{id:"priority-strategy"},"Priority strategy"),(0,i.kt)("p",null,"This strategy defines rules for calculating the priority of updating pods.\nAll update candidates will be applied with the priority terms.\n",(0,i.kt)("inlineCode",{parentName:"p"},"priority")," can be calculated either by weight or by order."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"weight"),": Priority is determined by the sum of weights for terms that match selector. For example,")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          weightPriority:\n          - weight: 50\n            matchSelector:\n              matchLabels:\n                test-key: foo\n          - weight: 30\n            matchSelector:\n              matchLabels:\n                test-key: bar\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"order"),': Priority will be determined by the value of the orderKey. The update candidates are sorted based on the "int" part of the value string. For example, 5 in string "5" and 10 in string "sts-10".')),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      unorderedUpdate:\n        priorityStrategy:\n          orderPriority:\n          - orderedKey: some-label-key\n")),(0,i.kt)("h3",{id:"maxunavailable"},"MaxUnavailable"),(0,i.kt)("p",null,"Advanced StatefulSet adds a ",(0,i.kt)("inlineCode",{parentName:"p"},"maxUnavailable")," capability in the ",(0,i.kt)("inlineCode",{parentName:"p"},"RollingUpdateStatefulSetStrategy")," to allow parallel Pod\nupdates with the guarantee that the number of unavailable pods during the update cannot exceed this value.\nIt is only allowed to use when the podManagementPolicy is ",(0,i.kt)("inlineCode",{parentName:"p"},"Parallel"),"."),(0,i.kt)("p",null,"This feature achieves similar update efficiency like Deployment for cases where the order of\nupdate is not critical to the workload. Without this feature, the native ",(0,i.kt)("inlineCode",{parentName:"p"},"StatefulSet")," controller can only\nupdate Pods one by one even if the podManagementPolicy is ",(0,i.kt)("inlineCode",{parentName:"p"},"Parallel"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  podManagementPolicy: Parallel\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 20%\n")),(0,i.kt)("p",null,"For example, assuming an Advanced StatefulSet has five Pods named P0 to P4, and the application can\ntolerate losing three replicas temporally. If we want to update the StatefulSet Pod spec from v1 to\nv2, we can perform the following steps using the ",(0,i.kt)("inlineCode",{parentName:"p"},"MaxUnavailable")," feature for fast update."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Set ",(0,i.kt)("inlineCode",{parentName:"li"},"MaxUnavailable")," to 3 to allow three unavailable Pods maximally."),(0,i.kt)("li",{parentName:"ol"},"Optionally, Set ",(0,i.kt)("inlineCode",{parentName:"li"},"Partition")," to 4 in case canary update is needed. Partition means all Pods with an ordinal that is\ngreater than or equal to the partition will be updated. In this case P4 will be updated even though ",(0,i.kt)("inlineCode",{parentName:"li"},"MaxUnavailable"),"\nis 3."),(0,i.kt)("li",{parentName:"ol"},"After P4 finish update, change ",(0,i.kt)("inlineCode",{parentName:"li"},"Partition")," to 0. The controller will update P1,P2 and P3 concurrently.\nNote that with default StatefulSet, the Pods will be updated sequentially in the order of P3, P2, P1."),(0,i.kt)("li",{parentName:"ol"},"Once one of P1, P2 and P3 finishes update, P0 will be updated immediately.")),(0,i.kt)("h3",{id:"paused-update"},"Paused update"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"paused")," indicates that Pods updating is paused, controller will not update Pods but just maintain the number of replicas."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps.kruise.io/v1beta1\nkind: StatefulSet\nspec:\n  # ...\n  updateStrategy:\n    rollingUpdate:\n      paused: true\n")),(0,i.kt)("h2",{id:"lifecycle-hook"},"Lifecycle hook"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"FEATURE STATE:")," Kruise v0.8.0"),(0,i.kt)("p",null,"This is similar to ",(0,i.kt)("a",{parentName:"p",href:"./cloneset#lifecycle-hook"},"Lifecycle hook of CloneSet"),"."))}m.isMDXComponent=!0}}]);
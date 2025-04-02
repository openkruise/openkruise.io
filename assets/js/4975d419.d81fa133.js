"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5336],{6120:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>i,default:()=>h,frontMatter:()=>l,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"user-manuals/strategy-bluegreen-update","title":"Blue-Green Release","description":"Blue-Green Release Process","source":"@site/rollouts/user-manuals/strategy-bluegreen-update.md","sourceDirName":"user-manuals","slug":"/user-manuals/strategy-bluegreen-update","permalink":"/rollouts/user-manuals/strategy-bluegreen-update","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"Multi-Batch Release","permalink":"/rollouts/user-manuals/strategy-multi-batch-update"},"next":{"title":"A/B Testing","permalink":"/rollouts/user-manuals/strategy-ab-testing"}}');var r=t(74848),o=t(28453);const l={},i="Blue-Green Release",a={},c=[{value:"Blue-Green Release Process",id:"blue-green-release-process",level:2},{value:"Recommended Configuration",id:"recommended-configuration",level:2},{value:"Behavior Explanation",id:"behavior-explanation",level:2},{value:"Differences from Other Strategies",id:"differences-from-other-strategies",level:2},{value:"Which Release Method Should I Choose?",id:"which-release-method-should-i-choose",level:3},{value:"Rollback",id:"rollback",level:2},{value:"Global Rollback",id:"global-rollback",level:3},{value:"Traffic Rollback",id:"traffic-rollback",level:3},{value:"Considerations",id:"considerations",level:2},{value:"HPA",id:"hpa",level:3},{value:"PDB",id:"pdb",level:3},{value:"Successive Release",id:"successive-release",level:3},{value:"Known Issues",id:"known-issues",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"blue-green-release",children:"Blue-Green Release"})}),"\n",(0,r.jsx)(n.h2,{id:"blue-green-release-process",children:"Blue-Green Release Process"}),"\n",(0,r.jsx)("center",{children:(0,r.jsx)("img",{src:t(82994).A,width:"90%"})}),"\n",(0,r.jsx)(n.h2,{id:"recommended-configuration",children:"Recommended Configuration"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Note: The blue-green strategy is only applicable to Deployment and CloneSet, supports only the v1beta1 API, and requires a Rollout version higher than v0.5.0 (excluding v0.5.0)."})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-YAML",children:"apiVersion: rollouts.kruise.io/v1beta1\nkind: Rollout\nmetadata:\n  name: rollouts-demo\nspec:\n  workloadRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: workload-demo\n  strategy:\n    blueGreen:\n      steps:\n      - replicas: 100% # step 1\n        traffic: 0%\n      - replicas: 100% # step 2\n        traffic: 10%\n      - replicas: 100% # step 3\n        traffic:  100%\n      trafficRoutings:\n      - service: service-demo\n        ingress:\n          classType: nginx\n          name: ingress-demo\n"})}),"\n",(0,r.jsx)(n.h2,{id:"behavior-explanation",children:"Behavior Explanation"}),"\n",(0,r.jsxs)(n.p,{children:["When you apply a new revision to ",(0,r.jsx)(n.code,{children:"workload-demo"}),":"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"First Batch:"})," 100% of the new version Pods are scaled up, and the stable version Pods are not scaled down. At this point, there are 200% of the Pods, but no traffic is routed to the new version Pods. Manual confirmation is required to proceed to the next batch."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Second Batch:"})," 10% of the traffic is routed to the new version. Manual confirmation is required to proceed to the next batch."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Third Batch:"})," 100% of the traffic is routed to the new version. Manual confirmation is required to complete the release."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Once you verify that the new version is validated and confirm to proceed:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"The stable version Pods will be scaled down, and the release will be completed."}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"differences-from-other-strategies",children:"Differences from Other Strategies"}),"\n",(0,r.jsxs)(n.p,{children:["From the ",(0,r.jsx)(n.strong,{children:"API"})," perspective, the differences between ",(0,r.jsx)(n.code,{children:"strategy.blueGreen"})," and ",(0,r.jsx)(n.code,{children:"strategy.canary"})," are minimal and mainly include:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"strategy.blueGreen"})," does not have the ",(0,r.jsx)(n.code,{children:"EnableExtraWorkloadForCanary"})," field. ",(0,r.jsx)(n.code,{children:"strategy.canary"}),"  uses this field to distinguish whether to create an additional Deployment, corresponding to canary strategy and multi-batch strategy of the Deployment."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"strategy.blueGreen"})," does not have the ",(0,r.jsx)(n.code,{children:"PatchPodTemplateMetadata"})," field. Only canary strategy support this field; multi-batch and blue-Green strategy do not."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Apart from these, there are no further differences in the API. You may notice that the steps in Blue-Green strategy are used similarly to those in canary strategy."}),"\n",(0,r.jsxs)(n.p,{children:["From the perspective of ",(0,r.jsx)(n.strong,{children:"release process"}),", the differences between Blue-Green strategy and other strategies are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Blue-Green strategy do not create additional workloads, similar to multi-batch strategy, whereas canary strategy create additional workload for Deployment."}),"\n",(0,r.jsx)(n.li,{children:"In the blue-green release process, Pods of the old version won't be scaled down, which is the same as in canary strategy. In contrast, multi-batch strategy scale up new version Pods while simultaneously scaling down old version Pods."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"You can easily understand the differences between blue-green and multi-batch strategies. However, you might also think that aside from whether additional workload is created at the low level, there seems to be little difference between blue-green and canary. Perhaps the following diagram can provide clarification:"}),"\n",(0,r.jsx)("center",{children:(0,r.jsx)("img",{src:t(55005).A,width:"90%"})}),"\n",(0,r.jsx)(n.p,{children:'Notice that after the final batch is completed, canary strategy perform a rolling update on the original workload, whereas blue-green deployments simply scale down the old version Pods directly. This difference reflects the semantic differences between the two strategies: in canary strategy, the created workload essentially serves as a "canary" to validate the new version and is deleted after validation. In blue-green strategy, the old and new versions "coexist," allowing traffic to be switched between the two versions.'}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"In practice:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Canary Release are recommended to configure a small number of batches (e.g., 1 batch), with each batch having a relatively small number of replicas. Although configuring replicas as 100% is allowed, it is usually unnecessary."}),"\n",(0,r.jsx)(n.li,{children:"For blue-green deployments, it is generally recommended to configure replicas as 100%."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["From the perspective of ",(0,r.jsx)(n.strong,{children:"underlying implementation"})," , the differences between blue-green strategy  and other strategies are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Canary:"}),' Only Deployment support canary strategy. During release, Kruise-Rollout creates a Deployment named "[DeploymentName]-canary".']}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Multi-Batch:"})," CloneSets can utilize their inherent ",(0,r.jsx)(n.code,{children:"partition"})," field to implement multi-batch strategy, while Deployment relies on a customized controller."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Blue-Green:"})," Both CloneSet and Deployment achieve blue-green release by setting the ",(0,r.jsx)(n.code,{children:"MinReadySeconds"}),", ",(0,r.jsx)(n.code,{children:"MaxSurge"}),", and ",(0,r.jsx)(n.code,{children:"MaxUnavailable"})," fields. Therefore, if you notice these fields being changed while using blue-green strategy, there is no need to worry. This is normal behavior, and these fields will be restored after the release is done."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"which-release-method-should-i-choose",children:"Which Release Method Should I Choose?"}),"\n",(0,r.jsx)(n.p,{children:"It depends on your scenarios:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Blue-Green Release consumes double the resources. You might opt for blue-green strategy in scenarios with high stability requirements because the old and new version instances coexist, allowing you to quickly switch traffic to either the new or stable version."}),"\n",(0,r.jsx)(n.li,{children:"In other scenarios, you might choose canary or multi-batch strategies."}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"rollback",children:"Rollback"}),"\n",(0,r.jsx)(n.h3,{id:"global-rollback",children:"Global Rollback"}),"\n",(0,r.jsx)(n.p,{children:'Similar to canary/multi-batch strategies, you can directly rollback the workload specification to rollback the application. For details, refer to the "Basic Usage Guide" \u2192 "How to Rollback".'}),"\n",(0,r.jsx)(n.h3,{id:"traffic-rollback",children:"Traffic Rollback"}),"\n",(0,r.jsx)(n.p,{children:"Rollout has introduced a new feature that supports jumping between steps. For example, when deploying to the third batch, you can execute the following command to jump back to the second batch:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'kubectl patch rollout rollouts-demo --type merge --subresource status -p "{\\"status\\":{\\"blueGreenStatus\\":{\\"nextStepIndex\\": 2}}}"\n'})}),"\n",(0,r.jsx)(n.p,{children:'Using this feature, you can "rollback" the traffic of a blue-green release. In the recommended configuration example, jumping from the third step to the second step will change the traffic configuration from "100% of requests routed to the new version" to "10% of requests routed to the new version." If you further jump to the first step, all requests will be routed to the stable version.'}),"\n",(0,r.jsxs)(n.p,{children:["However, it is important to note that if the ",(0,r.jsx)(n.code,{children:"replicas"})," of the target step are less than those of the current step, no Pods will be scaled down."]}),"\n",(0,r.jsxs)(n.p,{children:["In fact, directly modifying the ",(0,r.jsx)(n.code,{children:"spec.strategy.blueGreen.steps[x].traffic"})," of the Rollout resource can achieve a similar effect. For example, changing ",(0,r.jsx)(n.code,{children:"spec.strategy.blueGreen.steps[lastBatch].traffic"})," from 100% to 10%, and then from 10% to 0%. However, directly modifying the spec may affect the next release, whereas modifying the status can avoid this issue."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Note:"})," Allowing step-jumping and modifying the traffic configuration of a specific step are new features introduced with blue-green release and require specific Rollout versions."]}),"\n",(0,r.jsx)(n.h2,{id:"considerations",children:"Considerations"}),"\n",(0,r.jsx)(n.h3,{id:"hpa",children:"HPA"}),"\n",(0,r.jsxs)(n.p,{children:["During the blue-green release process, if the workload is bound to an HPA(Horizontal Pod Autoscaler), Kruise-Rollout will disable the HPA. You will notice that the HPA's ",(0,r.jsx)(n.code,{children:"scaleTargetRef.name"}),' is appended with the suffix "-DisableByRollout," causing the workload to be marked as Not Found. After the blue-green release is done, the suffix will be removed, and the HPA will become active again.']}),"\n",(0,r.jsx)(n.h3,{id:"pdb",children:"PDB"}),"\n",(0,r.jsxs)(n.p,{children:['During the blue-green release process, If the workload is bound to a PDB(Pod Disruption Budget), since the PDB does not consider the version of the Pods when calculating "Allowed disruptions," configuring ',(0,r.jsx)(n.code,{children:"maxUnavailable"}),' will lead to "smaller step sizes and over-protection," whereas configuring ',(0,r.jsx)(n.code,{children:"minAvailable"}),' will result in "larger step sizes and under-protection." Therefore, unless necessary, it is recommended to use ',(0,r.jsx)(n.code,{children:"minAvailable "}),'(prefer "over-protection" rather than "under-protection").']}),"\n",(0,r.jsx)(n.h3,{id:"successive-release",children:"Successive Release"}),"\n",(0,r.jsx)(n.p,{children:"The Blue-Green strategy does not support successive releases. If you are in the progress of releasing version v2 (upgrading from v1 to v2) and then attempt to release version v3, we recommend that you first manually roll back to version v1 and then proceed to deploy version v3.\nIf you have accidentally released version v3, the controller will not function as expected. The Pods for version v3 will not be created, and the Pods for versions v2 and v1 will not be scaled down. If you check the Rollout resource at this point, you will notice a message similar to the following:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                                       AGE\nrollouts-demo   Progressing   1             StepPaused     new version releasing detected in the progress of blue-green release, please rollback first   6d23h\n"})}),"\n",(0,r.jsxs)(n.p,{children:["It is recommended to perform a rollback operation at this time. You can roll back to version v1. Specifically, if you use the ",(0,r.jsx)(n.code,{children:"kubectl rollout undo"})," command to perform the rollback, please ensure you specify the correct ",(0,r.jsx)(n.code,{children:"--to-revision"})," to revert to version v1. If you do not specify ",(0,r.jsx)(n.code,{children:"--to-revision"}),", you might revert back to version v2 (i.e., the state before deploying version v3):"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                         AGE\nrollouts-demo   Progressing   1             StepPaused     Rollout is in step(1/4), and you need manually confirm to enter the next step   7d\n"})}),"\n",(0,r.jsx)(n.h2,{id:"known-issues",children:"Known Issues"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Due to unresolved issues in the CloneSet controller code, when performing blue-green strategy on CloneSets, all steps' replicas should be set to 100%. Otherwise, CloneSets may fail to scale up. Deployment is not subject to this restriction."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>i});var s=t(96540);const r={},o=s.createContext(r);function l(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),s.createElement(o.Provider,{value:n},e.children)}},55005:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/canary_vs_bluegreen-52e625ac19753397cc5376ebccdc218f.png"},82994:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/bluegreen-412715db3507ecf338eb01c03ac01ef1.png"}}]);
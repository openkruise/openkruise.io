"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[5511],{28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>a});var r=s(96540);const o={},t=r.createContext(o);function i(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(t.Provider,{value:n},e.children)}},49829:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"user-manuals/podprobemarker","title":"PodProbeMarker","description":"FEATURE STATE: Kruise v1.3.0","source":"@site/docs/user-manuals/podprobemarker.md","sourceDirName":"user-manuals","slug":"/user-manuals/podprobemarker","permalink":"/docs/next/user-manuals/podprobemarker","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/podprobemarker.md","tags":[],"version":"current","lastUpdatedBy":"Abner","lastUpdatedAt":1743593191000,"frontMatter":{"title":"PodProbeMarker"},"sidebar":"docs","previous":{"title":"PersistentPodState","permalink":"/docs/next/user-manuals/persistentpodstate"},"next":{"title":"Deletion Protection","permalink":"/docs/next/user-manuals/deletionprotection"}}');var o=s(74848),t=s(28453);const i={title:"PodProbeMarker"},a=void 0,d={},l=[{value:"Feature-gate",id:"feature-gate",level:2},{value:"Usage",id:"usage",level:2},{value:"Support TcpSocket Probe",id:"support-tcpsocket-probe",level:3},{value:"Support for Serverless Scenarios",id:"support-for-serverless-scenarios",level:3},{value:"Background",id:"background",level:4},{value:"Protocol Overview",id:"protocol-overview",level:4},{value:"How to view Probe results?",id:"how-to-view-probe-results",level:2},{value:"Pod Status Conditions",id:"pod-status-conditions",level:3},{value:"Pod Metadata",id:"pod-metadata",level:3},{value:"Pod Event",id:"pod-event",level:3}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.3.0"]}),"\n",(0,o.jsx)(n.p,{children:"Kubernetes provides three Pod lifecycle management:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Readiness Probe"})," Used to determine whether the business container is ready to respond to user requests. If the probe fails, the Pod will be removed from Service Endpoints."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Liveness Probe"})," Used to determine the health status of the container. If the probe fails, the kubelet will restart the container."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Startup Probe"})," Used to know when a container application has started. If such a probe is configured, it disables liveness and readiness checks until it succeeds."]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["So the Probe capabilities provided in Kubernetes have defined specific semantics and related behaviors.\n",(0,o.jsx)(n.strong,{children:"In addition, there is actually a need to customize Probe semantics and related behaviors"}),", such as:"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"GameServer defines Idle Probe to determine whether the Pod currently has a game match"}),", if not, from the perspective of cost optimization, the Pod can be scaled down."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"K8S Operator defines the main-secondary probe to determine the role of the current Pod (main or secondary)"}),". When upgrading, the secondary can be upgraded first,\nso as to achieve the behavior of selecting the main only once during the upgrade process, reducing the service interruption time during the upgrade process."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"OpenKruise provides the ability to customize the Probe and return the result to the Pod Status, and the user can decide the follow-up behavior based on the probe result."}),"\n",(0,o.jsx)(n.h2,{id:"feature-gate",children:"Feature-gate"}),"\n",(0,o.jsxs)(n.p,{children:["PodProbeMarker feature is turned on by default, if you want to turn it off set feature-gate ",(0,o.jsx)(n.em,{children:"PodProbeMarkerGate"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'$ helm install kruise https://... --set featureGates="PodProbeMarkerGate=false"\n'})}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PodProbeMarker\nmetadata:\n  name: game-server-probe\n  namespace: ns\nspec:\n  selector:\n    matchLabels:\n      app: game-server\n  probes:\n  - name: Idle\n    containerName: game-server\n    probe:\n      exec:\n        command:\n        - /home/game/idle.sh\n      initialDelaySeconds: 10\n      timeoutSeconds: 3\n      periodSeconds: 10\n      successThreshold: 1\n      failureThreshold: 3\n    markerPolicy:\n    - state: Succeeded\n      labels:\n        gameserver-idle: 'true'\n      annotations:\n        controller.kubernetes.io/pod-deletion-cost: '-10'\n    - state: Failed\n      labels:\n        gameserver-idle: 'false'\n      annotations:\n        controller.kubernetes.io/pod-deletion-cost: '10'\n    podConditionType: game.io/idle\n"})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"spec.selector"}),": Select matching Pods based on Labels, both MatchLabels and MatchExpressions are supported. For details, please refer to: ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels",children:"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels"}),".\nOnce specified, selector cannot be changed for a PodProbeMarker."]}),"\n",(0,o.jsxs)(n.li,{children:["spec.probes","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"name"}),": The probe name needs to be unique within the Pod and between different containers"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"containerName"}),": The container that executes the probe"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"probe"}),": The API definition related to probe is consistent with the native K8S probe (currently only Exec and tcpSocket is supported). For details, please refer to: ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes",children:"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes"})]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"markerPolicy"}),": According to the Probe execution result (Succeeded or Failed), patch specific Labels and Annotations to the Pod.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"state: probe result, Succeeded or Failed"}),"\n",(0,o.jsx)(n.li,{children:"labels: If the result is satisfied, patch labels to the Pod"}),"\n",(0,o.jsx)(n.li,{children:"annotations: If the result is satisfied, patch annotations to the Pod"}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"podConditionType"}),": Save the Probe execution result (Succeeded or Failed) to the pod condition. When probe is Succeeded, pod.status.condition.status=True.\nOtherwise, when the probe fails to execute, pod.status.condition.status=False. When podConditionType is empty, probe execution result will not be saved to pod condition."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note:"})," If only one Marker Policy is defined, for example: only define State=Succeeded, Patch Labels[healthy]='true'. When the probe execution success, kruise will patch labels[healthy]='true' to pod.\nAnd when the probe execution fails, Label[healthy] will be deleted."]}),"\n",(0,o.jsx)(n.h3,{id:"support-tcpsocket-probe",children:"Support TcpSocket Probe"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.6.0"]}),"\n",(0,o.jsxs)(n.p,{children:["With this configuration, the kruise-daemon will attempt to open a socket to your container on the specified port. If it can establish a connection,\nthe probe is considered ",(0,o.jsx)(n.code,{children:"Succeeded"}),", if it can't it is considered ",(0,o.jsx)(n.code,{children:"Failed"}),". For example:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: PodProbeMarker\nmetadata:\n  name: game-server-probe\n  namespace: ns\nspec:\n  selector:\n    matchLabels:\n      app: game-server\n  probes:\n  - name: Idle\n    containerName: game-server\n    probe:\n      tcpSocket:\n        port: 8080\n      initialDelaySeconds: 15\n      periodSeconds: 10\n"})}),"\n",(0,o.jsx)(n.h3,{id:"support-for-serverless-scenarios",children:"Support for Serverless Scenarios"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.8.0"]}),"\n",(0,o.jsx)(n.h4,{id:"background",children:"Background"}),"\n",(0,o.jsxs)(n.p,{children:["Before Kruise v1.8.0, the probing capabilities of ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," relied on the ",(0,o.jsx)(n.code,{children:"Kruise Daemon"})," component for implementation.\nFor typical scenarios such as deploying OKG using serverless resources, Kruise v1.8.0 introduced an extended protocol to support ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," in serverless environments."]}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note"}),": Different serverless container service providers may have varying levels of support for ",(0,o.jsx)(n.code,{children:"PodProbeMarker"}),". Please consult the respective provider for details on their protocol support."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Kruise welcome contributions to the list of providers that support this protocol:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Alibaba Cloud Container Service ",(0,o.jsx)(n.a,{href:"https://www.aliyun.com/product/acs",children:"ACS"})]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"protocol-overview",children:"Protocol Overview"}),"\n",(0,o.jsxs)(n.p,{children:["The ability to use ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," in serverless environments is disabled by default. You can enable it via the feature-gate ",(0,o.jsx)(n.em,{children:"EnablePodProbeMarkerOnServerless"}),", as shown below:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:'helm install kruise https://... --set featureGates="PodProbeMarkerGate=true,EnablePodProbeMarkerOnServerless=true"\n'})}),"\n",(0,o.jsxs)(n.p,{children:["This feature defines an interaction protocol for ",(0,o.jsx)(n.code,{children:"PodProbeMarker"})," in serverless scenarios:"]}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Kruise-manager"})," adds the required probes to the serverless Pod using the annotation ",(0,o.jsx)(n.code,{children:"kruise.io/podprobe"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:["The specific implementation of the serverless PodProbeMarker needs to read the probe information from the annotation ",(0,o.jsx)(n.code,{children:"kruise.io/podprobe"}),", execute the probe, and write the results to ",(0,o.jsx)(n.code,{children:".status.conditions[x]"})," of the Pod."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Kruise-manager"})," identifies the probe execution results from ",(0,o.jsx)(n.code,{children:".status.conditions[x]"})," of the serverless Pod and performs the marking operations defined in the ",(0,o.jsx)(n.code,{children:"markerPolicy"}),"."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Refer to the example below:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nmetadata:\n  annotations:\n    # Records the probes that need to be performed on this Pod\n    kruise.io/podprobe: |\n      [\n      \t{\n          "containerName": "minecraft",\n          "name": "healthy",\n          "podConditionType": "game.kruise.io/healthy",\n          "probe": {\n              "exec": {\n                  "command": [\n                      "bash",\n                      "/data/probe.sh"\n                  ]\n              }\n          }\n      \t}\n      ]\n...\nstatus:\n  conditions:\n  # The result of the probe is recorded in .status.conditions, with type as\n  - type: game.kruise.io/healthy\n    # Probe State \'Succeeded\' indicates \'True\', and \'Failed\' indicates \'False\'\n    status: "True"\n    lastProbeTime: "2025-03-25T07:13:04Z"\n    lastTransitionTime: "2025-03-25T07:13:04Z"\n    # If the probe fails to execute, the message is stderr\n    message: ""\n'})}),"\n",(0,o.jsx)(n.h2,{id:"how-to-view-probe-results",children:"How to view Probe results?"}),"\n",(0,o.jsx)(n.h3,{id:"pod-status-conditions",children:"Pod Status Conditions"}),"\n",(0,o.jsxs)(n.p,{children:["If podConditionType is defined, the probe result will be saved to the pod condition, where ",(0,o.jsx)(n.strong,{children:"condition.type=podConditionType"}),", as follows:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: game-server\n  name: game-server-58cb9f5688-7sbd8\n  namespace: ns\n...\nstatus:\n  conditions:\n    # podConditionType\n  - type: game.io/idle\n    # Probe State 'Succeeded' indicates 'True', and 'Failed' indicates 'False'\n    status: \"True\"\n    lastProbeTime: \"2022-09-09T07:13:04Z\"\n    lastTransitionTime: \"2022-09-09T07:13:04Z\"\n    # If the probe fails to execute, the message is stderr\n    message: \"\"\n"})}),"\n",(0,o.jsxs)(n.p,{children:["This method can be used in combination with Kubernetes ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate",children:"Readiness Gate"})," to flexibly control whether the Pod is Ready."]}),"\n",(0,o.jsx)(n.h3,{id:"pod-metadata",children:"Pod Metadata"}),"\n",(0,o.jsx)(n.p,{children:"If the user defines the MarkerPolicy, OpenKruise will patch the specific Metadata to the Pod, as follows:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Pod\nmetadata:\n  labels:\n    app: game-server\n    gameserver-idle: 'true'\n  annotations:\n    controller.kubernetes.io/pod-deletion-cost: '-10'\n  name: game-server-58cb9f5688-7sbd8\n  namespace: ns\n"})}),"\n",(0,o.jsxs)(n.p,{children:["OpenKruise ",(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/cloneset#update-sequence",children:"CloneSet"})," and ",(0,o.jsx)(n.a,{href:"https://openkruise.io/docs/user-manuals/advancedstatefulset#update-sequence",children:"Advanced StatefulSet"}),"\nsupport the ability to control upgrade priorities based on Pod Labels. At the same time, community-native Deployment and Kruise CloneSet also support scaling down priority and upgrade order based on ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost",children:"Deletion Cost"}),".\nTherefore, the Custom Probe MarkerPolicy can be combined with the above capabilities to achieve the effect of scaling down or upgrading the priority."]}),"\n",(0,o.jsx)(n.h3,{id:"pod-event",children:"Pod Event"}),"\n",(0,o.jsx)(n.p,{children:"Through the pod event, you can view the historical probe execution results, as follows:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"$ kubectl describe pods -n ns game-server-58cb9f5688-7sbd8\nEvents:\n  Type    Reason                Age                From                         Message\n  ----    ------                ----               ----                         -------\n  Normal  KruiseProbeFailed     37s (x2 over 47s)  kruise-daemon-podprobe\n  Normal  KruiseProbeSucceeded  36s (x2 over 37s)  kruise-daemon-podprobe\n"})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);
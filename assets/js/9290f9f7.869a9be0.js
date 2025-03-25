"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4819],{28453:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>r});var s=n(96540);const i={},a=s.createContext(i);function l(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(a.Provider,{value:t},e.children)}},72170:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/gs-lifecycle-delete-de81e2e95059bd06761bd6bbe55bc3a0.png"},97625:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>d,frontMatter:()=>l,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"user-manuals/lifecycle","title":"Custom Lifecycle Management","description":"Game servers, due to their strong stateful characteristics, have a high demand for graceful shutdown operations.","source":"@site/kruisegame/user-manuals/lifecycle.md","sourceDirName":"user-manuals","slug":"/user-manuals/lifecycle","permalink":"/kruisegame/user-manuals/lifecycle","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"Network","permalink":"/kruisegame/user-manuals/network"},"next":{"title":"GameServer Monitor","permalink":"/kruisegame/user-manuals/gameserver-monitor"}}');var i=n(74848),a=n(28453);const l={},r="Custom Lifecycle Management",o={},c=[{value:"Usage Example",id:"usage-example",level:2}];function h(e){const t={code:"code",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"custom-lifecycle-management",children:"Custom Lifecycle Management"})}),"\n",(0,i.jsx)(t.p,{children:"Game servers, due to their strong stateful characteristics, have a high demand for graceful shutdown operations.\nA game server typically needs to wait until data is fully persisted to disk and ensured to be safe before it can be thoroughly removed.\nAlthough Kubernetes natively provides the preStop hook, which allows containers to execute specific actions before they are about to shut down, there is a limitation: once the preset time limit is exceeded, the container will have to be forcibly terminated, regardless of whether the data processing is complete or not.\nIn some cases, this approach lacks real gracefulness. We need a more flexible mechanism to ensure that game servers can exit smoothly while protecting all critical states."}),"\n",(0,i.jsx)(t.p,{children:"OpenKruise has introduced the Lifecycle Hook feature, which provides precise control and waiting mechanisms for game servers at critical lifecycle moments.\nThis allows servers to execute the actual deletion or update operations only after meeting specific conditions.\nBy providing a configurable Lifecycle field, combined with the ability to customize service quality, OKG ensures that the game server's shutdown process is both graceful and reliable.\nWith this advanced feature, maintainers can ensure that all necessary data persistence and internal state synchronization are safely and correctly completed before the server is smoothly removed or updated."}),"\n",(0,i.jsx)(t.h2,{id:"usage-example",children:"Usage Example"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:'apiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  lifecycle:\n    preDelete:\n      labelsHandler:\n        gs-sync/delete-block: "true"\n  gameServerTemplate:\n    metadata:\n      labels:\n        gs-sync/delete-block: "true"\n    spec:\n      containers:\n        - image: registry.cn-beijing.aliyuncs.com/chrisliu95/minecraft-demo:probe-v0\n          name: minecraft\n          volumeMounts:\n            - name: gsinfo\n              mountPath: /etc/gsinfo\n      volumes:\n        - name: gsinfo\n          downwardAPI:\n            items:\n              - path: "state"\n                fieldRef:\n                  fieldPath: metadata.labels[\'game.kruise.io/gs-state\']\n  serviceQualities:\n    - name: healthy\n      containerName: minecraft\n      permanent: false\n      exec:\n        command: ["bash", "./probe.sh"]\n      serviceQualityAction:\n        - state: false\n          result: done\n          labels:\n            gs-sync/delete-block: "false"\n        - state: false\n          result: WaitToBeDeleted\n          opsState: WaitToBeDeleted\n        - state: true\n          opsState: None\n'})}),"\n",(0,i.jsx)(t.p,{children:"The corresponding script is as follows. The script performs the following actions:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:['Acquires the current state of gs from /etc/gsinfo/state and determines whether it is "PreDelete"',"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["If it is PreDelete, it indicates that the current gs should be in the offline phase. It checks whether the data flushing has been completed (in this example, the presence of a file indicates data flushing completion)","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"If the data flushing is not completed, it executes the data flushing action (in this example, it creates a file)"}),"\n",(0,i.jsx)(t.li,{children:'If the data flushing is completed, it outputs "done" and exits with 1.'}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["If it is not PreDelete, it indicates that the gs has not entered the offline stage. It uses the number of people in the game server to determine whether it should now go offline.","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:'If the number of people on the game server equals 0, it outputs "WaitToBeDeleted" and exits with 1.'}),"\n",(0,i.jsx)(t.li,{children:"If the number of people on the game server is not 0, it exits with 0."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:'#!/bin/bash\n\nfile_path="/etc/gsinfo/state"\ndata_flushed_file="/etc/gsinfo/data_flushed"\n\nif [[ ! -f "$file_path" ]]; then\n    exit 0\nfi\n\nstate_content=$(cat "$file_path")\n\nif [[ "$state_content" == "PreDelete" ]]; then\n    if [[ -f "$data_flushed_file" ]]; then\n        echo "done"\n        exit 1\n    else\n        touch "$data_flushed_file"\n        echo "WaitToBeDeleted"\n        exit 1\n    fi\nelse\n    people_count_file="/etc/gsinfo/people_count"\n\n    people_count=$(cat "$people_count_file")\n    \n    if [[ "$people_count" -eq 0 ]]; then\n        echo "WaitToBeDeleted"\n        exit 1\n    else\n        exit 0\n    fi\nfi\n'})}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"grace-deletion.png",src:n(72170).A+"",width:"2000",height:"465"})}),"\n",(0,i.jsx)(t.p,{children:"The process of elegant delete as follow:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"The game server is running normally, and the number of players is not 0."}),"\n",(0,i.jsx)(t.li,{children:"When the number of players drops to 0, set the opsState to WaitToBeDeleted using custom service quality settings."}),"\n",(0,i.jsx)(t.li,{children:"Through the automatic scaling policy, OKG deletes the GameServer with WaitToBeDeleted opsState. Since the lifecycle hook is configured and the delete-block label will be set to true, the gs is not truly deleted but enters the PreDelete state, and the data flushing process is triggered by custom service quality."}),"\n",(0,i.jsx)(t.li,{children:"Once data flushing is complete, set the delete-block label to false using custom service quality to release the checkpoint."}),"\n",(0,i.jsx)(t.li,{children:"After the checkpoint is released, the PreDelete phase moves into the Delete phase. The gs is then truly deleted."}),"\n"]})]})}function d(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);
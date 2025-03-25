"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2974],{28453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>c});var a=r(96540);const t={},s=a.createContext(t);function i(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(s.Provider,{value:n},e.children)}},66414:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>a,toc:()=>l});const a=JSON.parse('{"id":"best-practices/workflow","title":"\u6e38\u620f\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u6700\u4f73\u5b9e\u8df5","description":"\u80cc\u666f","source":"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/best-practices/workflow.md","sourceDirName":"best-practices","slug":"/best-practices/workflow","permalink":"/zh/kruisegame/best-practices/workflow","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742897500000,"frontMatter":{},"sidebar":"kruisegame","previous":{"title":"\u6e38\u620f\u670d\u654f\u6377\u4ea4\u4ed8\u4e0e\u8fd0\u7ef4\u7ba1\u7406\u6700\u4f73\u5b9e\u8df5","permalink":"/zh/kruisegame/best-practices/gameserver-delivery-management"},"next":{"title":"\u9879\u76ee\u8d21\u732e","permalink":"/zh/kruisegame/developer-manuals/contribution"}}');var t=r(74848),s=r(28453);const i={},c="\u6e38\u620f\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u6700\u4f73\u5b9e\u8df5",o={},l=[{value:"\u80cc\u666f",id:"\u80cc\u666f",level:2},{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:2},{value:"\u573a\u666f\u8bf4\u660e",id:"\u573a\u666f\u8bf4\u660e",level:3},{value:"\u65b0\u7248\u53d1\u5e03\u6d41\u7a0b",id:"\u65b0\u7248\u53d1\u5e03\u6d41\u7a0b",level:3},{value:"\u6a21\u62df\u5b58\u91cf\u65e7\u7248\u672c\u623f\u95f4\u670d\u72b6\u6001",id:"\u6a21\u62df\u5b58\u91cf\u65e7\u7248\u672c\u623f\u95f4\u670d\u72b6\u6001",level:3},{value:"\u901a\u8fc7Workflow\u8fdb\u884c\u65b0\u7248\u672c\u4e00\u952e\u53d1\u5e03",id:"\u901a\u8fc7workflow\u8fdb\u884c\u65b0\u7248\u672c\u4e00\u952e\u53d1\u5e03",level:3}];function d(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"\u6e38\u620f\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u6700\u4f73\u5b9e\u8df5",children:"\u6e38\u620f\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u6700\u4f73\u5b9e\u8df5"})}),"\n",(0,t.jsx)(n.h2,{id:"\u80cc\u666f",children:"\u80cc\u666f"}),"\n",(0,t.jsx)(n.p,{children:"\u7531\u4e8e\u6e38\u620f\u670d\u52a1\u5668\u6709\u72b6\u6001\u7684\u7279\u6027\uff0c\u5bf9\u4e8e\u6e38\u620f\u8fd0\u7ef4\u800c\u8a00\uff0c\u901a\u5e38\u9700\u8981\u6839\u636e\u5f53\u524d\u4e1a\u52a1\u72b6\u6001\u8fdb\u884c\u76f8\u5e94\u5904\u7406\uff0c\u4ee5\u907f\u514d\u73a9\u5bb6\u4f53\u9a8c\u53d7\u635f\u3002OKG\u63d0\u4f9b\u4e86\u6e38\u620f\u670d\u52a1\u5668\u72b6\u6001\u611f\u77e5\u548c\u5b9a\u5411\u7ba1\u7406\u7684\u80fd\u529b\uff0c\u5177\u5907\u6839\u636e\u4e0d\u540c\u72b6\u6001\u8fdb\u884c\u4e0d\u540c\u5904\u7406\u7684\u524d\u63d0\u6761\u4ef6\u3002\u5728\u5b9e\u9645\u751f\u4ea7\u8fc7\u7a0b\u4e2d\uff0c\u4e00\u4e2a\u8fd0\u7ef4\u6d41\u7a0b\u662f\u591a\u4e2a\u8fd0\u7ef4\u52a8\u4f5c\u7684\u7ec4\u5408\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u5f80\u5f80\u9700\u8981\u8fdb\u884c\u201c\u6e38\u620f\u670d\u72b6\u6001\u786e\u8ba4\u201d \u2192 \u201c\u6e38\u620f\u670d\u64cd\u4f5c\u201d\u7684\u5f80\u590d\u52a8\u4f5c\uff0c\u8fd9\u4e5f\u5bfc\u81f4\u6e38\u620f\u670d\u4e91\u539f\u751f\u5316\u540e\u4f9d\u7136\u5b58\u5728\u4e00\u5b9a\u7684\u64cd\u4f5c\u590d\u6742\u5ea6\u3002"}),"\n",(0,t.jsx)(n.p,{children:"\u672c\u6587\u5c06\u7ed3\u5408\u201c\u623f\u95f4\u670d\u65e0\u635f\u53d1\u5e03\u201d\u8fd9\u4e00\u5b9e\u9645\u573a\u666f\uff0c\u5411\u8bfb\u8005\u5c55\u793a\u5982\u4f55\u901a\u8fc7Argo Workflow\u5c06\u5bf9GameServerSet\u548cGameServer\u7684\u8fd0\u7ef4\u52a8\u4f5c\u6709\u6548\u7ec4\u5408\u8d77\u6765\uff0c\u4ece\u800c\u6784\u7b51\u4e00\u5957\u65e2\u6d41\u7545\u53c8\u9ad8\u6548\u7684\u8fd0\u7ef4\u5de5\u4f5c\u6d41\u3002"}),"\n",(0,t.jsx)(n.h2,{id:"\u793a\u4f8b",children:"\u793a\u4f8b"}),"\n",(0,t.jsx)(n.h3,{id:"\u573a\u666f\u8bf4\u660e",children:"\u573a\u666f\u8bf4\u660e"}),"\n",(0,t.jsx)(n.p,{children:"\u201c\u623f\u95f4\u670d\u65e0\u635f\u53d1\u5e03\u201d \u9700\u8981\u6ee1\u8db3\u4ee5\u4e0b\u7279\u70b9\uff1a"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"\u6b63\u5728\u6e38\u620f\u7684\u65e7\u7248\u672c\u623f\u95f4\u4e0d\u53d7\u5f71\u54cd\uff0c\u800c\u7a7a\u95f2\u7684\u65e7\u7248\u672c\u623f\u95f4\u670d\u9700\u8981\u88ab\u56de\u6536\u6e05\u7406"}),"\n",(0,t.jsx)(n.li,{children:"\u5b58\u5728\u4e00\u5b9a\u6570\u91cf\u7684\u65b0\u7248\u672c\u623f\u95f4\uff0c\u53ef\u8ba9\u65b0\u8fde\u63a5\u7684\u73a9\u5bb6\u968f\u65f6\u8fdb\u5165"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["\u4e3a\u5728\u65b0\u7248\u672c\u53d1\u5e03\u4fdd\u8bc1\u201c\u623f\u95f4\u65e0\u635f\u201d\uff0c\u623f\u95f4\u670d\u5728\u4ea4\u4ed8\u65f6\u4f1a\u9009\u62e9 OnDelete \u66f4\u65b0\u7b56\u7565\uff0c\u4ee5\u5b9e\u73b0\u5b58\u91cf\u623f\u95f4\u4e0d\u88ab\u5220\u9664\uff0c\u65b0\u521b\u5efa\u7684\u623f\u95f4\u4f7f\u7528\u65b0\u7684\u955c\u50cf\u7684\u6548\u679c\u3002\u6b64\u5916\uff0c\u5bf9\u5e94GameServerSet\u53ef\u4ee5\u901a\u8fc7\u914d\u7f6eOKG\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u4e0e\u81ea\u52a8\u4f38\u7f29\u7b56\u7565\u5b9e\u73b0\u81ea\u52a8\u5316\u751f\u547d\u5468\u671f\u7ba1\u7406\u3002\u6709\u5173\u623f\u95f4\u670d\u6700\u4f73\u5b9e\u8df5\u6587\u6863\u53ef\u53c2\u8003 ",(0,t.jsx)(n.a,{href:"https://openkruise.io/zh/kruisegame/best-practices/session-based-game",children:"https://openkruise.io/zh/kruisegame/best-practices/session-based-game"})]}),"\n",(0,t.jsx)(n.h3,{id:"\u65b0\u7248\u53d1\u5e03\u6d41\u7a0b",children:"\u65b0\u7248\u53d1\u5e03\u6d41\u7a0b"}),"\n",(0,t.jsx)(n.p,{children:"\u57fa\u4e8e\u4ee5\u4e0a\u4ea4\u4ed8\u5185\u5bb9\uff0c\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u5728\u66f4\u65b0\u65b0\u7248\u672c\u65f6\u5c06\u8fdb\u884c\u4ee5\u4e0b\u52a8\u4f5c\uff1a"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"\u66f4\u65b0GameServerSet\u955c\u50cf\uff0c\u6b64\u65f6\u6b63\u5728\u8fd0\u884c\u7684\u623f\u95f4\u670d\u4e0d\u4f1a\u5220\u9664\u6216\u91cd\u5efa"}),"\n",(0,t.jsx)(n.li,{children:"\u5bf9GameServerSet\u8fdb\u884c\u6269\u5bb9\uff0c\u6269\u5bb9\u51fa\u8db3\u591f\u591a\u7684\u65b0\u7248\u672c\u623f\u95f4\u670d"}),"\n",(0,t.jsx)(n.li,{children:"\u786e\u8ba4\u65b0\u7248\u672c\u623f\u95f4\u670d\u7684\u72b6\u6001\u662f\u5426\u6b63\u5e38\u63d0\u4f9b\u670d\u52a1"}),"\n",(0,t.jsx)(n.li,{children:"\u6e05\u7406\u65e7\u7248\u672c\u7684\u7a7a\u95f2\u623f\u95f4"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u63a5\u4e0b\u6765\u6211\u4eec\u5c06\u901a\u8fc7\u4e00\u4e2a\u793a\u4f8b\u5c55\u793a\u5982\u4f55\u4e00\u952e\u5f0f\u5b8c\u6210\u4ee5\u4e0a\u6d41\u7a0b\u3002"}),"\n",(0,t.jsx)(n.h3,{id:"\u6a21\u62df\u5b58\u91cf\u65e7\u7248\u672c\u623f\u95f4\u670d\u72b6\u6001",children:"\u6a21\u62df\u5b58\u91cf\u65e7\u7248\u672c\u623f\u95f4\u670d\u72b6\u6001"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"\u6ce8\uff1a\u96c6\u7fa4\u4e2d\u9700\u5b89\u88c5OKG"})}),"\n",(0,t.jsxs)(n.p,{children:["\u96c6\u7fa4\u4e2d\u67093\u4e2a\u65e7\u7248\u672c\u623f\u95f4\u670d\uff0c\u7248\u672c\u53f7\u4e3a",(0,t.jsx)(n.code,{children:"1.12.2"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"cat <<EOF | kubectl apply -f -\napiVersion: game.kruise.io/v1alpha1\nkind: GameServerSet\nmetadata:\n  name: minecraft\n  namespace: default\nspec:\n  replicas: 3\n  updateStrategy:\n    type: OnDelete\n  gameServerTemplate:\n    spec:\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2\n          name: minecraft\nEOF\n"})}),"\n",(0,t.jsx)(n.p,{children:"\u5176\u4e2d\uff0cminecraft-0\u5b58\u5728\u73a9\u5bb6"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'kubectl patch gs minecraft-0 --type=merge -p \'{"spec":{"opsState":"Allocated"}}\'\n'})}),"\n",(0,t.jsx)(n.p,{children:"\u73b0\u72b6\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"kubectl get gs\nNAME          STATE   OPSSTATE    DP    UP    AGE\nminecraft-0   Ready   Allocated   0     0     27s\nminecraft-1   Ready   None        0     0     27s\nminecraft-2   Ready   None        0     0     27s\n"})}),"\n",(0,t.jsx)(n.h3,{id:"\u901a\u8fc7workflow\u8fdb\u884c\u65b0\u7248\u672c\u4e00\u952e\u53d1\u5e03",children:"\u901a\u8fc7Workflow\u8fdb\u884c\u65b0\u7248\u672c\u4e00\u952e\u53d1\u5e03"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsxs)(n.em,{children:["\u6ce8\uff1a\u96c6\u7fa4\u4e2d\u9700\u8981\u5b89\u88c5",(0,t.jsx)(n.a,{href:"https://argoproj.github.io/workflows/",children:"Argo Workflow\u7ec4\u4ef6"})]})}),"\n",(0,t.jsx)(n.p,{children:"\u90e8\u7f72\u5982\u4e0bYaml\uff0c\u6267\u884c kubectl create -f workflow-demo.yaml"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'# workflow-demo.yaml\napiVersion: argoproj.io/v1alpha1\nkind: Workflow\nmetadata:\n  generateName: workflow-demo-\n  namespace: kruise-game-system\nspec:\n  serviceAccountName: kruise-game-controller-manager\n  entrypoint: main\n  templates:\n    - name: main\n      steps:\n        - - name: patch-image\n            template: patch-image\n        - - name: scale-replicas\n            template: scale-replicas\n        - - name: check-pods-ready\n            template: check-pods-ready\n        - - name: gs-update\n            template: gs-update\n    - name: patch-image\n      resource:\n        action: patch\n        mergeStrategy: merge\n        manifest: |\n          apiVersion: game.kruise.io/v1alpha1\n          kind: GameServerSet\n          metadata:\n            name: minecraft\n            namespace: default\n          spec:\n            gameServerTemplate:\n              spec:\n                containers:\n                - name: minecraft\n                  image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new\n    - name: scale-replicas\n      resource:\n        action: patch\n        mergeStrategy: merge\n        manifest: |\n          apiVersion: game.kruise.io/v1alpha1\n          kind: GameServerSet\n          metadata:\n            name: minecraft\n            namespace: default\n          spec:\n            replicas: 6\n    - name: check-pods-ready\n      retryStrategy:\n        retryPolicy: "OnError"\n        backoff:\n          duration: "10s"\n          factor: 2\n      script:\n        image: registry.cn-beijing.aliyuncs.com/chrisliu95/kubectl:latest\n        command: [bash]\n        source: |\n          #!/bin/bash\n\n          DESIRED_IMAGE="registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new"\n          LABEL_SELECTOR="game.kruise.io/owner-gss=minecraft"\n          DESIRED_READY_COUNT=3  # \u4f60\u671f\u671b\u7684\u5c31\u7eea Pod \u7684\u6570\u91cf\n          NAMESPACE="default"  # \u9002\u5f53\u5730\u66f4\u6539\u540d\u79f0\u7a7a\u95f4\n\n          # \u4f7f\u7528 kubectl \u83b7\u53d6\u6240\u6709\u5305\u542b\u6b63\u786e\u6807\u7b7e\u7684 Pods\n          PODS_JSON=$(kubectl get pods -n ${NAMESPACE} -l ${LABEL_SELECTOR} -o json)\n\n          # \u521d\u59cb\u5316\u5c31\u7eea\u7684 Pods \u6570\u91cf\n          COUNT_READY=0\n\n          # \u6839\u636e\u63d0\u4f9b\u7684JSON\u4fe1\u606f\u6765\u67e5\u627e\u5339\u914d\u7684pods\uff08\u4ee5\u53ca\u5b83\u4eec\u7684\u72b6\u6001\uff09\n          for pod in $(echo "$PODS_JSON" | jq -r \'.items[] | select(.status.phase=="Running") | .metadata.name\'); do\n            # \u83b7\u53d6 Pod \u7684\u6bcf\u4e2a\u5bb9\u5668\u7684\u955c\u50cf\u5e76\u68c0\u67e5\u662f\u5426 Pod \u5c31\u7eea\n            POD_IMAGES=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\\"$pod\\") | .spec.containers[].image")\n            IS_READY=$(echo "$PODS_JSON" | jq -r ".items[] | select(.metadata.name==\\"$pod\\") | .status.conditions[] | select(.type==\\"Ready\\") | .status")\n\n            if [[ "$POD_IMAGES" == *"$DESIRED_IMAGE"* && "$IS_READY" == "True" ]]; then\n              COUNT_READY=$((COUNT_READY+1))\n            fi\n          done\n\n          # \u8f93\u51fa\u5c31\u7eea\u7684 Pods \u6570\u91cf\n          echo "Ready Pods with image ${DESIRED_IMAGE}: ${COUNT_READY}"\n\n          # \u6bd4\u8f83\u5b9e\u9645\u5c31\u7eea\u7684 Pods \u6570\u91cf\u4e0e\u671f\u5f85\u6570\u91cf\n          if [[ "${COUNT_READY}" -eq "${DESIRED_READY_COUNT}" ]]; then\n            echo "The number of ready Pods matches the desired count of ${DESIRED_READY_COUNT}."\n          else\n            echo "The number of ready Pods (${COUNT_READY}) does not match the desired count of ${DESIRED_READY_COUNT}."\n            exit 1\n          fi\n    - name: gs-update\n      container:\n        image: registry.cn-beijing.aliyuncs.com/chrisliu95/gs-updater:v1.2\n        command:\n          - /updater\n        args:\n          - --gss-name=minecraft\n          - --namespace=default\n          - --select-opsState=None\n          - --select-not-container-image=minecraft/registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2-new\n          - --exp-opsState=WaitToBeDeleted\n'})}),"\n",(0,t.jsx)(n.p,{children:"\u8be5workflow\u5305\u542b\u4e86\u56db\u4e2astep\uff0c\u5206\u522b\u5bf9\u5e94\u4e0a\u8ff0\u53d1\u5e03\u6d41\u7a0b\u7684\u56db\u4e2a\u6b65\u9aa4\uff0c\u6d89\u53ca\u5230\u4e09\u79cd\u7c7b\u578b\u7684\u6a21\u7248\uff1a"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["resource \u2014\u2014 \u5bf9K8s\u5bf9\u8c61\u8fdb\u884c\u64cd\u4f5c\u3002\u672c\u4f8b\u4e2dstep 1/2 \u5bf9GameServerSet\u8fdb\u884c\u4e86patch\u64cd\u4f5c\uff0c\u5206\u522b\u66f4\u65b0\u955c\u50cf\u7248\u672c\u4e3a",(0,t.jsx)(n.code,{children:"1.12.2-new"}),"\u3001\u4ee5\u53ca\u6269\u5145\u4e86",(0,t.jsx)(n.code,{children:"3"}),"\u4e2a\u65b0\u7248\u672c\u623f\u95f4\u3002\u6ce8\u610f\u8be5workflow\u914d\u7f6e\u4e86service account\u4ee5\u83b7\u53d6\u64cd\u4f5c\u96c6\u7fa4\u8d44\u6e90\u7684\u76f8\u5e94\u6743\u9650\uff0c\u4e3a\u4e86\u65b9\u4fbf\u5c55\u793a\uff0c\u6b64\u5904\u76f4\u63a5\u4f7f\u7528\u4e86 kruise-game-system \u547d\u540d\u7a7a\u95f4\u4e0b\u7684 kruise-game-controller-manager \u5bf9\u5e94\u7684sa\u3002"]}),"\n",(0,t.jsx)(n.li,{children:"script \u2014\u2014 \u542f\u52a8\u5bb9\u5668\u6267\u884c\u81ea\u5b9a\u4e49\u811a\u672c\u3002\u672c\u4f8b\u4e2d step 3 \u4f7f\u7528\u4e86\u5e26\u6709kubectl\u547d\u4ee4\u884c\u57fa\u7840\u5bb9\u5668\uff0c\u4ee5\u811a\u672c\u7684\u65b9\u5f0f\u5bf9\u65b0\u6269\u5bb9\u51fa\u6765\u7684pod\u8fdb\u884c\u72b6\u6001\u6821\u9a8c\uff0c\u786e\u4fddReady\u6570\u91cf\u51c6\u786e\u65f6\u518d\u8fdb\u5165\u4e0b\u4e00\u9636\u6bb5\u3002\u8fd9\u91cc\u914d\u7f6e\u4e86\u91cd\u8bd5\u7b56\u7565\uff1a\u5f53\u6267\u884c\u5931\u8d25\uff08OnError\uff09\u540e\u4f1a\u518d\u6b21\u6821\u9a8c\uff0c\u95f4\u9694\u65f6\u957f\u4e3a10s\uff0c\u95f4\u9694\u65f6\u95f4\u5ef6\u957f\u7684\u500d\u6570\u4e3a2\u3002"}),"\n",(0,t.jsxs)(n.li,{children:["container \u2014\u2014 \u542f\u52a8\u4e00\u4e2a\u5bb9\u5668\u6267\u884c\u76f8\u5e94\u53c2\u6570\u547d\u4ee4\u3002\u672c\u4f8b\u4e2d step 3 \u4f7f\u7528\u4e86 ",(0,t.jsx)(n.a,{href:"https://github.com/CloudNativeGame/GameServers-Updater",children:"GameServer-Updater"})," \u5de5\u5177\uff0c\u53ef\u4ee5\u6279\u91cf\u8bbe\u7f6egs\u7684\u72b6\u6001\u3002\u6b64\u65f6\uff0c\u5c06\u7248\u672c\u53f7\u4e0d\u4e3a1.12.2-new\u4e14opsState\u662fNone\u7684\u623f\u95f4\u670d\u7684opsState\u8bbe\u7f6e\u4e3aWaitToBeDeleted\u3002\u8fd9\u6837\u540e\u7eed\u901a\u8fc7\u81ea\u52a8\u7f29\u5bb9\uff0c\u5373\u53ef\u5b8c\u6210\u81ea\u52a8\u5316\u65e7\u7248\u672c\u6e05\u7406\u3002"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u8be5workflow\u6267\u884c\u540e\uff0c\u4f9d\u6b21\u4ea7\u751f\u56db\u4e2aworkflow pod\u3002\u623f\u95f4\u670d\u65b0\u6269\u5bb9\u51fa3\u30014\u30015\u53f7\uff0c\u4e14\u6700\u7ec8\u5c06\u7a7a\u95f2\u76841\u30012\u53f7\u7684\u65e7\u7248\u672c\u623f\u95f4\u670d\u8bbe\u7f6e\u4e3aWaitToBeDeleted\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"kubectl get workflow -n kruise-game-system\nNAME                  STATUS      AGE\nworkflow-demo-cb56r   Running     8s\n\nkubectl get po -n kruise-game-system | grep workflow\nworkflow-demo-cb56r-1053258062                    0/1     Completed   0          40s\nworkflow-demo-cb56r-2754258264                    0/2     Completed   0          10s\nworkflow-demo-cb56r-3772280549                    0/2     Completed   0          30s\nworkflow-demo-cb56r-644543209                     0/1     Completed   0          61s\n\nkubectl get gs\nNAME          STATE   OPSSTATE          DP    UP    AGE\nminecraft-0   Ready   Allocated         0     0     2m18s\nminecraft-1   Ready   WaitToBeDeleted   0     0     2m18s\nminecraft-2   Ready   WaitToBeDeleted   0     0     2m18s\nminecraft-3   Ready   None              0     0     57s\nminecraft-4   Ready   None              0     0     57s\nminecraft-5   Ready   None              0     0     57s\n\nkubectl get workflow -n kruise-game-system\nNAME                  STATUS      AGE\nworkflow-demo-cb56r   Succeeded   108s\n"})})]})}function m(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}}}]);
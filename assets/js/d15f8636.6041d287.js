"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2798],{28453:(e,n,o)=>{o.d(n,{R:()=>r,x:()=>i});var a=o(96540);const t={},s=a.createContext(t);function r(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),a.createElement(s.Provider,{value:n},e.children)}},49404:(e,n,o)=>{o.d(n,{A:()=>a});const a=o.p+"assets/images/advancedcronjob-2667633566977804a6b7e323ef3d3139.png"},61676:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>a,toc:()=>l});const a=JSON.parse('{"id":"user-manuals/advancedcronjob","title":"AdvancedCronJob","description":"AdvancedCronJob is an enhanced version of CronJob.","source":"@site/docs/user-manuals/advancedcronjob.md","sourceDirName":"user-manuals","slug":"/user-manuals/advancedcronjob","permalink":"/docs/next/user-manuals/advancedcronjob","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/user-manuals/advancedcronjob.md","tags":[],"version":"current","lastUpdatedBy":"skkkkkkk","lastUpdatedAt":1744872985000,"frontMatter":{"title":"AdvancedCronJob"},"sidebar":"docs","previous":{"title":"BroadcastJob","permalink":"/docs/next/user-manuals/broadcastjob"},"next":{"title":"SidecarSet","permalink":"/docs/next/user-manuals/sidecarset"}}');var t=o(74848),s=o(28453);const r={title:"AdvancedCronJob"},i=void 0,c={},l=[{value:"Example",id:"example",level:2},{value:"Time zones",id:"time-zones",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"AdvancedCronJob is an enhanced version of CronJob.\nThe original CronJob creates Job periodically according to schedule rule, but AdvancedCronJob provides template supported multiple job resources."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: AdvancedCronJob\nspec:\n  template:\n\n    # Option 1: use jobTemplate, which is equivalent to original CronJob\n    jobTemplate:\n      # ...\n\n    # Option 2: use broadcastJobTemplate, which will create a BroadcastJob object when cron schedule triggers\n    broadcastJobTemplate:\n      # ...\n\n    # Options 3(future): ...\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"jobTemplate\uff1acreate Jobs periodically, which is equivalent to original CronJob"}),"\n",(0,t.jsxs)(n.li,{children:["broadcastJobTemplate\uff1acreate ",(0,t.jsx)(n.a,{href:"./broadcastjob",children:"BroadcastJobs"})," periodically, which support to dispatch Jobs on every node"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"AdvancedCronjob",src:o(49404).A+"",width:"2106",height:"1346"})}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: AdvancedCronJob\nmetadata:\n  name: acj-test\nspec:\n  schedule: "*/1 * * * *"\n  template:\n    broadcastJobTemplate:\n      spec:\n        template:\n          spec:\n            containers:\n              - name: pi\n                image: perl\n                command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]\n            restartPolicy: Never\n        completionPolicy:\n          type: Always\n          ttlSecondsAfterFinished: 30\n'})}),"\n",(0,t.jsx)(n.p,{children:"The YAML below defines an AdvancedCronJob. It will create a BroadcastJob every minute, which will run a job on every node."}),"\n",(0,t.jsx)(n.h2,{id:"time-zones",children:"Time zones"}),"\n",(0,t.jsx)(n.p,{children:"All CronJob schedule: times are based on the timezone of the kruise-controller-manager by default,\nwhich means the timezone set for the kruise-controller-manager container determines the timezone that the cron job controller uses."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise v1.3.0"]}),"\n",(0,t.jsxs)(n.p,{children:["However, we have introduce a ",(0,t.jsx)(n.code,{children:"spec.timeZone"})," field in v1.3.0.\nYou can set it to the name of a valid time zone name. For example, setting ",(0,t.jsx)(n.code,{children:'spec.timeZone: "Etc/UTC"'})," instructs Kruise to interpret the schedule relative to Coordinated Universal Time."]}),"\n",(0,t.jsx)(n.p,{children:"A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system."})]})}function p(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}}}]);
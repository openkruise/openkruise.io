"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6667],{12060:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/debug-lua-941e65f925603f43ed7c241c7615cf40.gif"},28453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>o});var s=r(96540);const t={},a=s.createContext(t);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),s.createElement(a.Provider,{value:n},e.children)}},62077:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/test-lua-886b3c9ee4711a35e7bea651128e31fb.gif"},69342:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/custom-workflow-50d262e1c57f2046adddd81b26f0b827.png"},71505:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"developer-manuals/custom-network-provider","title":"Extensible Traffic Routing Based on Lua Script","description":"FEATURE STATE: Kruise Rollout v0.5.0","source":"@site/rollouts/developer-manuals/custom-network-provider.md","sourceDirName":"developer-manuals","slug":"/developer-manuals/custom-network-provider","permalink":"/rollouts/developer-manuals/custom-network-provider","draft":false,"unlisted":false,"tags":[],"version":"current","lastUpdatedBy":"ChrisLiu","lastUpdatedAt":1742896773000,"frontMatter":{},"sidebar":"rollouts","previous":{"title":"End to End Canary Release","permalink":"/rollouts/user-manuals/strategy-end2end-canary-update"},"next":{"title":"Traffic Routing with Istio","permalink":"/rollouts/best-practices/traffic-routing-istio-api"}}');var t=r(74848),a=r(28453);const i={},o="Extensible Traffic Routing Based on Lua Script",c={},l=[{value:"How it Works",id:"how-it-works",level:2},{value:"Define Your Custom Traffic Routing Lua Script",id:"define-your-custom-traffic-routing-lua-script",level:2},{value:"Way1: Contribute a Custom Traffic Routing",id:"way1-contribute-a-custom-traffic-routing",level:3},{value:"Recommanded Test Case Designation",id:"recommanded-test-case-designation",level:4},{value:"Way2: Define in ConfigMap",id:"way2-define-in-configmap",level:3},{value:"Write Your Custom Traffic Routing Lua Script",id:"write-your-custom-traffic-routing-lua-script",level:2},{value:"Lua Syntax",id:"lua-syntax",level:3},{value:"Lua Data Types",id:"lua-data-types",level:4},{value:"Lua Table",id:"lua-table",level:4},{value:"Common functions",id:"common-functions",level:4},{value:"Handle the Resource",id:"handle-the-resource",level:3},{value:"Debug Your Lua Script",id:"debug-your-lua-script",level:3},{value:"Add RBAC Permissions for Gateway Resources",id:"add-rbac-permissions-for-gateway-resources",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"extensible-traffic-routing-based-on-lua-script",children:"Extensible Traffic Routing Based on Lua Script"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"FEATURE STATE:"})," Kruise Rollout v0.5.0"]}),"\n",(0,t.jsxs)(n.p,{children:["Kruise Rollout utilizes a Lua-script-based customization approach for ",(0,t.jsx)(n.strong,{children:"Gateway resources (Istio VirtualService, Apisix ApisixRoute, Kuma TrafficRoute and etc.)"}),". Kruise Rollout involves invoking Lua scripts to retrieve and update the desired configurations of gateway resources based on ",(0,t.jsx)(n.strong,{children:"release strategies and the original configurations of gateway resources (including spec, labels, and annotations)"}),". It enables users to easily adapt and integrate various types of Gateway resources without modifying existing code and configurations."]}),"\n",(0,t.jsx)(n.p,{children:"Since Kruise Rollout also support using Gateway API to configure traffic routing, one can also use corresponding Gateway API implementation for specific gateway resource. However, it is hard to implement a full blown Gateway API implementation, and many gateway providers who provides k8s CRD API still lack the offical support for Gateway API. Using Lua script, one can manipulate arbitary gateway resources for traffic routing\r\nonly and avoid the complexity of introducing Gateway API."}),"\n",(0,t.jsx)(n.h2,{id:"how-it-works",children:"How it Works"}),"\n",(0,t.jsx)("img",{src:r(69342).A}),"\n",(0,t.jsx)(n.p,{children:"The entire process of can be described as follows:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Users define Rollout traffic canary rules and the gateway resources that need modification, initiating the canary deployment."}),"\n",(0,t.jsx)(n.li,{children:"Obtain specified gateway resources based on Rollout configurations."}),"\n",(0,t.jsx)(n.li,{children:"Get the Lua scripts corresponding to the gateway resources."}),"\n",(0,t.jsxs)(n.li,{children:["When release started, first convert the current configurations of the gateway resources into a string and store it in the resource annotation",(0,t.jsx)(n.code,{children:"rollouts.kruise.io/original-spec-configuration"}),"."]}),"\n",(0,t.jsx)(n.li,{children:"Feed the gateway resource configuration along with the Rollout configurations to the Lua script. Then utilize the Lua script to process the current resource configurations and Rollout configurations to get the new configurations and update the resources accordingly."}),"\n",(0,t.jsxs)(n.li,{children:["After the release is completed, retrieve the original configurations of the resources from the ",(0,t.jsx)(n.code,{children:"rollouts.kruise.io/original-spec-configuration"})," annotation and restore them."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Custom traffic routing can be configured in Rollout as below:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rollouts.kruise.io/v1beta1\r\nkind: Rollout\r\n...\r\nspec:\r\n  strategy:\r\n    canary:\r\n      trafficRoutings:\r\n      - service: <stable-service>\r\n        customNetworkRefs:\r\n        - apiVersion: <your-resource-apiVersion>\r\n          kind: <your-resource-kind>\r\n          name: <your-resource-name>\n"})}),"\n",(0,t.jsx)(n.p,{children:"The api details are shown as below:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Fields"}),(0,t.jsx)(n.th,{children:"Type"}),(0,t.jsx)(n.th,{children:"Defaults"}),(0,t.jsx)(n.th,{children:"Explanation"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"customNetworkRefs"})}),(0,t.jsx)(n.td,{children:"object"}),(0,t.jsx)(n.td,{children:"nil"}),(0,t.jsx)(n.td,{children:"Definitions of  gateway resources"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"customNetworkRefs.apiVersion"})}),(0,t.jsx)(n.td,{children:"string"}),(0,t.jsx)(n.td,{children:'""'}),(0,t.jsx)(n.td,{children:"ApiVersion of a gateway resource"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"customNetworkRefs.kind"})}),(0,t.jsx)(n.td,{children:"string"}),(0,t.jsx)(n.td,{children:'""'}),(0,t.jsx)(n.td,{children:"Kind of a gateway resource"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"customNetworkRefs.name"})}),(0,t.jsx)(n.td,{children:"string"}),(0,t.jsx)(n.td,{children:'""'}),(0,t.jsx)(n.td,{children:"Name of a gateway resource"})]})]})]}),"\n",(0,t.jsx)(n.h2,{id:"define-your-custom-traffic-routing-lua-script",children:"Define Your Custom Traffic Routing Lua Script"}),"\n",(0,t.jsx)(n.p,{children:"There are two ways to define and use your custom traffic routing Lua script to handle the gateway resources, the next two sections describe those ways."}),"\n",(0,t.jsx)(n.h3,{id:"way1-contribute-a-custom-traffic-routing",children:"Way1: Contribute a Custom Traffic Routing"}),"\n",(0,t.jsx)(n.p,{children:"You can contribute Lua scripts for custom resources and the scripts can be bundled into Kruise Rollout after passing the tests. These Lua scripts can then be directly invoked within the Rollout."}),"\n",(0,t.jsxs)(n.p,{children:["Kruise Rollout by default invoke Lua scripts in the ",(0,t.jsx)(n.code,{children:"rollouts/lua_configuration"})," directory. The bundled Lua scripts should follow the following directory structure:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plain",children:"rollouts\r\n|-- lua_configuration\r\n|    |-- your.crd.group.io                    # CRD group\r\n|    |    |-- MyKind                          # Resource kind\r\n|    |    |    |-- trafficRouting.lua         # Custom traffic routing Lua script\r\n|    |    |    |-- testdata                   # Directory with test resource YAML definitions\r\n|\t\t |\t\t|\t\t |\t\t|-- test_case1.yaml       # Lua script test case\r\n|\t\t |\t\t|\t\t |\t\t|-- test_case2.yaml       # Lua script test case\n"})}),"\n",(0,t.jsx)(n.p,{children:"Where:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"trafficRouting.lua"})," defines how to process gateway resources."]}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"testdata"})," directory contains test cases, and the structure of test cases is as follows:"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"rollout:\r\n\t# rollout configuration\r\ntrafficRouting:\r\n  # trafficRouting configuration\r\noriginal:\r\n\t# original resource configuration\r\nexpected:\r\n\t# expected resource configurations in every step of release plan\n"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Custom traffic routing Lua script must pass the tests to prove it can work as expected"}),". The following example demonstrates a custom traffic routing test for ",(0,t.jsx)(n.code,{children:"networking.istio.io/VirtualService"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'rollout:\r\n  apiVersion: rollouts.kruise.io/v1beta1\r\n  kind: Rollout\r\n  metadata:\r\n    name: rollouts-demo\r\n  spec:\r\n    workloadRef:\r\n      apiVersion: apps/v1\r\n      kind: Deployment\r\n      name: deploy-demo\r\n    strategy:\r\n      canary:\r\n        enableExtraWorkloadForCanary: true\r\n        steps:\r\n        - matches:\r\n          - headers:\r\n            - type: Exact\r\n              name: user-agent\r\n              value: pc\r\n            - type: RegularExpression\r\n              name: name\r\n              value: ".*demo"\r\n        - matches:\r\n          - headers:\r\n            - type: Exact\r\n              name: user-agent\r\n              value: pc\r\n          - headers:\r\n            - type: RegularExpression\r\n              name: name\r\n              value: ".*demo"\r\n        - traffic: 50%\r\n          replicas: 50%\r\n        trafficRoutings:\r\n        - service: svc-demo\r\n          customNetworkRefs:\r\n          - apiVersion: networking.istio.io/v1alpha3\r\n            kind: VirtualService\r\n            name: vs-demo\r\noriginal:\r\n  apiVersion: networking.istio.io/v1alpha3\r\n  kind: VirtualService\r\n  metadata:\r\n    name: vs-demo\r\n  spec:\r\n    hosts:\r\n    - "*"\r\n    gateways:\r\n    - nginx-gateway\r\n    http:\r\n    - route:\r\n      - destination:\r\n          host: svc-demo\r\nexpected:\r\n  - apiVersion: networking.istio.io/v1alpha3\r\n    kind: VirtualService\r\n    metadata:\r\n      name: vs-demo\r\n    spec:\r\n      hosts:\r\n      - "*"\r\n      gateways:\r\n      - nginx-gateway\r\n      http:\r\n      - match:\r\n        - headers:\r\n            user-agent:\r\n              exact: pc\r\n            name:\r\n              regex: .*demo\r\n        route:\r\n        - destination:\r\n            host: svc-demo-canary\r\n      - route:\r\n        - destination:\r\n            host: svc-demo\r\n  - apiVersion: networking.istio.io/v1alpha3\r\n    kind: VirtualService\r\n    metadata:\r\n      name: vs-demo\r\n    spec:\r\n      hosts:\r\n      - "*"\r\n      gateways:\r\n      - nginx-gateway\r\n      http:\r\n      - match:\r\n        - headers:\r\n            name:\r\n              regex: .*demo\r\n        route:\r\n        - destination:\r\n            host: svc-demo-canary\r\n      - match:\r\n        - headers:\r\n            user-agent:\r\n              exact: pc\r\n        route:\r\n        - destination:\r\n            host: svc-demo-canary\r\n      - route:\r\n        - destination:\r\n            host: svc-demo\r\n  - apiVersion: networking.istio.io/v1alpha3\r\n    kind: VirtualService\r\n    metadata:\r\n      name: vs-demo\r\n    spec:\r\n      hosts:\r\n      - "*"\r\n      gateways:\r\n      - nginx-gateway\r\n      http:\r\n      - route:\r\n        - destination:\r\n            host: svc-demo\r\n          weight: 50\r\n        - destination:\r\n            host: svc-demo-canary\r\n          weight: 50\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Run ",(0,t.jsx)(n.code,{children:"go test -v ./pkg/trafficrouting/network/customNetworkProvider/"})," to test if the Lua scripts are working as expected. Kruise Rollout will walk the ",(0,t.jsx)(n.code,{children:"./lua_configuration"})," directory to retrieve all Lua scripts and test cases. Kruise Rollout will then perform tests based on the defined release strategies in the Rollout to check if the original configuration of the resource, after being processed by the Lua script, matches the expected configuration."]}),"\n",(0,t.jsx)("img",{src:r(62077).A}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.a,{href:"https://github.com/openkruise/rollouts/pull/178",children:"PR#178"}),"is an example for Istio VirtualService."]}),"\n",(0,t.jsx)(n.h4,{id:"recommanded-test-case-designation",children:"Recommanded Test Case Designation"}),"\n",(0,t.jsx)(n.p,{children:"When designing test cases, at least the release strategies listed below are supposed to be considered:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Release strategy with header matches, and the rules are defined in one ",(0,t.jsx)(n.code,{children:"headers"})," filed."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'# spec.strategy.canary.steps:\r\n- matches:\r\n  - headers:\r\n    - type: Exact\r\n      name: user-agent\r\n      value: pc\r\n    - type: RegularExpression\r\n      name: name\r\n      value: ".*demo"\n'})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Release strategy with header matches, and the rules are defined in different ",(0,t.jsx)(n.code,{children:"headers"})," filed."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'# spec.strategy.canary.steps:\r\n- matches:\r\n  - headers:\r\n    - type: Exact\r\n      name: user-agent\r\n      value: pc\r\n  - headers:\r\n    - type: RegularExpression\r\n      name: name\r\n      value: ".*demo"\n'})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Please visit"})," ",(0,t.jsx)(n.a,{href:"https://openkruise.io/zh/rollouts/user-manuals/api-specifications",children:"API Specifications | OpenKruise"})," ",(0,t.jsx)(n.strong,{children:"for more information about the difference of the above mentioned two release strategies."})]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Release strategy without header matches, and the traffic is routed to canary service with a certain weight."}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# spec.strategy.canary.steps:\r\n- traffic: 20%\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Special Note:"})," By default, traffic routing strategies defined in Rollout will create a new canary for new pods, while TrafficRouting will not."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"way2-define-in-configmap",children:"Way2: Define in ConfigMap"}),"\n",(0,t.jsx)(n.p,{children:"When the expected traffic routing Lua scripts are not bundled in Kruise Rollout, users could utilize ConfigMap to define and use Lua script to handle gateway resources. Custom traffic routing lua script can be defined in"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"<lua.traffic.routing.Kind.CRDGroup>: |\r\n# define your lua script below\n"})}),"\n",(0,t.jsxs)(n.p,{children:["field of ConfigMap ",(0,t.jsx)(n.code,{children:"kruise-rollout/kruise-rollout-configuration"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["The following example demonstrates a traffic routing for ",(0,t.jsx)(n.code,{children:"networking.istio.io/DestinationRule"}),", you can also define your own Lua script for gateway resources of other groups for example Apisix and Kuma in the ConfigMap."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'data:\r\n  "lua.traffic.routing.DestinationRule.networking.istio.io": |\r\n  \tlocal spec = obj.data.spec\r\n    local canary = {}\r\n    canary.labels = {}\r\n    canary.name = "canary"\r\n    local podLabelKey = "istio.service.tag"\r\n    canary.labels[podLabelKey] = "gray\r\n    table.insert(spec.subsets, canary)\r\n    return obj.data\n'})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Then if the expected Lua script is not existed locally, Kruise Rollout will get the script from ConfigMap."})}),"\n",(0,t.jsx)(n.h2,{id:"write-your-custom-traffic-routing-lua-script",children:"Write Your Custom Traffic Routing Lua Script"}),"\n",(0,t.jsx)(n.p,{children:"Designing a Lua script is the key of custom traffic routing. In the following sections, we will introduce some syntax of Lua as well as writing and debugging a custom traffic routing Lua script."}),"\n",(0,t.jsx)(n.h3,{id:"lua-syntax",children:"Lua Syntax"}),"\n",(0,t.jsx)(n.h4,{id:"lua-data-types",children:"Lua Data Types"}),"\n",(0,t.jsx)(n.p,{children:"In Lua, data can be represented using different data types. Here are the common data types in Lua:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Boolean"}),": Represents true or false values."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Number"}),": Represents integers or floating-point numbers."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"String"}),": Represents textual data and can be enclosed in single or double quotes."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Table"}),": The most important data structure in Lua, used to represent associative arrays, lists, sets, and other complex data structures."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"Function"}),": Represents executable code blocks that can be called and passed parameters."]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"lua-table",children:"Lua Table"}),"\n",(0,t.jsx)(n.p,{children:"As mentioned above, table is the most import data structure in Lua. In Lua, a table is used to store and organize data. It can store values of different types, such as numbers, strings, and other tables. Lua tables are associative arrays that allow access and manipulation of values using keys. Here are some features and common operations of tables in Lua:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Creating a table:"})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Create an empty table using curly braces: ",(0,t.jsx)(n.code,{children:"myTable = {}"})]}),"\n",(0,t.jsxs)(n.p,{children:["Create an empty table using the table.create() constructor: ",(0,t.jsx)(n.code,{children:"myTable = table.create()"})]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Adding and accessing elements:"})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Add elements using keys: ",(0,t.jsx)(n.code,{children:"myTable[key] = value"})]}),"\n",(0,t.jsxs)(n.p,{children:["Access elements using keys: ",(0,t.jsx)(n.code,{children:"myTable[key]"})]}),"\n",(0,t.jsxs)(n.p,{children:["Access elements using dot notation: ",(0,t.jsx)(n.code,{children:"myTable.key"})]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Iterating over a table:"})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Iterate over all key-value pairs using the ",(0,t.jsx)(n.code,{children:"pairs()"})," function:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:"for key, value in pairs(myTable) do ... end\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Iterate over the array part of the table using the ",(0,t.jsx)(n.code,{children:"ipairs()"})," function:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:"for index, value in ipairs(myTable) do ... end\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"Deleting elements:"})}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Delete an element using keys: ",(0,t.jsx)(n.code,{children:"myTable[key] = nil"})]}),"\n",(0,t.jsx)(n.h4,{id:"common-functions",children:"Common functions"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"table.insert()"}),": Inserts a value into a table."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"table.remove()"}),": Removes a value from a table."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"table.concat()"}),": Concatenates the strings in a table into a new string."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"ipairs()"}),": Iterator for looping through the array part of a table."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"pairs()"}),": Iterator for looping through all key-value pairs of a table."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"handle-the-resource",children:"Handle the Resource"}),"\n",(0,t.jsxs)(n.p,{children:["The resource status and release strategy in Kruise Rollout are defined using the LuaData structure and converted into a Lua table. This Lua table is then passed as a global variable ",(0,t.jsx)(n.code,{children:"obj"})," into the Lua script for further processing."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:'type LuaData struct {\r\n    Data             Data\r\n    CanaryWeight     int32\r\n    StableWeight     int32\r\n    Matches          []rolloutv1alpha1.HttpRouteMatch\r\n    CanaryService    string\r\n    StableService    string\r\n}\r\n// Data struct contains current configurations of a resource\r\ntype Data struct {\r\n\tSpec        interface{}       `json:"spec,omitempty"`\r\n\tLabels      map[string]string `json:"labels,omitempty"`\r\n\tAnnotations map[string]string `json:"annotations,omitempty"`\r\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["You should handle ",(0,t.jsx)(n.code,{children:"obj"})," in Lua script and ",(0,t.jsx)(n.strong,{children:"must retrun an object contains expected spec, labels and annotations"})," of the gateway resource, a simple way is to return ",(0,t.jsx)(n.code,{children:"obj.data"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:"-- Lua variables are assigned by reference,\r\n-- so updates to 'spec' can be synchronized to 'obj.data.spec'.\r\nspec = obj.data.spec -- get resource 'spec'\r\nhosts = spec.hosts\r\ncanaryService = obj.canaryService\r\n-- traverse header 'matches' defined in Rollout strategy\r\nfor _, match in ipairs(obj.matches) do\r\n\t... -- define how to handle matches\r\nend\r\n-- return 'obj.data' and Kruise Rollout will update the resource\r\nreturn obj.data\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Or you can define your own variable as return value as long as it ",(0,t.jsx)(n.strong,{children:"contains expected spec, labels and annotations"}),", an example is:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:"...\r\n-- define the return variable\r\nret = {}\r\n-- set annotations, labels and spec of ret\r\nret.annotations = annotations\r\nret.labels = labels\r\nret.spec = spec\r\nreturn ret\n"})}),"\n",(0,t.jsx)(n.h3,{id:"debug-your-lua-script",children:"Debug Your Lua Script"}),"\n",(0,t.jsxs)(n.p,{children:["If you need to debug Lua scripts, you can achieve this by installing the ",(0,t.jsx)(n.a,{href:"https://marketplace.visualstudio.com/items?itemName=actboy168.lua-debug",children:"Lua Debug"})," extension in VSCode. Once installed, you can execute Lua scripts in a step-by-step debugging mode and view variable values by selecting ",(0,t.jsx)(n.strong,{children:"Lua Debug -> Debug Current File"})," from the Run and Debug menu."]}),"\n",(0,t.jsx)("img",{src:r(83122).A,width:"50%"}),"\n",(0,t.jsxs)(n.p,{children:["Afterwards, define the global variable ",(0,t.jsx)(n.code,{children:"obj"})," in the Lua script to enable step-by-step debugging and test if the Lua script is working as expected."]}),"\n",(0,t.jsxs)(n.p,{children:["You can generate and use the ",(0,t.jsx)(n.code,{children:"obj"})," for debugging by running ",(0,t.jsx)(n.code,{children:"go run ./lua_configuration/convert_test_case_to_lua_object.go"}),". This program will automatically retrieve the test cases from the ",(0,t.jsx)(n.code,{children:"testdata"})," directory of all custom Gateway resources in the ",(0,t.jsx)(n.code,{children:"lua_configuration"})," folder, convert them into the form of the global variable ",(0,t.jsx)(n.code,{children:"obj"})," that passes to Lua script, and save them in ",(0,t.jsx)(n.code,{children:"test_case_obj.lua"}),". This makes it convenient for users to pass ",(0,t.jsx)(n.code,{children:"obj"})," to their Lua scripts and execute step-by-step debugging."]}),"\n",(0,t.jsxs)(n.p,{children:["An example of ",(0,t.jsx)(n.code,{children:"test_case_obj.lua"})," is shown as below:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:'steps = {\r\n  \t-- obj of release step_0\r\n    step_0 = { canaryWeight = -1, stableWeight = 101,\r\n        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },\r\n        canaryService = "mocka", stableService = "mocka",\r\n        data = {\r\n            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },\r\n                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }, }\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Pass the Lua table defined in ",(0,t.jsx)(n.code,{children:"test_case_obj.lua"})," as global variable ",(0,t.jsx)(n.code,{children:"obj"})," in your Lua script then you can start debugging."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-lua",children:'-- define obj in your Lua script, copied from test_case_obj.lua\r\nobj = { canaryWeight = -1, stableWeight = 101,\r\n        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },\r\n        canaryService = "mocka", stableService = "mocka", },\r\n        data = {\r\n            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },\r\n                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }\r\nspec = obj.data.spec\r\n--- define your lua script below\n'})}),"\n",(0,t.jsx)("img",{src:r(12060).A}),"\n",(0,t.jsx)(n.h3,{id:"add-rbac-permissions-for-gateway-resources",children:"Add RBAC Permissions for Gateway Resources"}),"\n",(0,t.jsx)(n.p,{children:"In order to enable Kruise Rollout to access and update the gateway resources, you need to add the RBAC permissions of the gateway resources for Kruise Rollout."}),"\n",(0,t.jsxs)(n.p,{children:["It is suggested to create a new role for Kruise Rollout under kruise-rollout namesapce, and to add ",(0,t.jsx)(n.code,{children:"get, list, patch, update, watch"})," permissions for gateway resource in the RBAC role. An example for Istio VirtualService and DestinationRule is shown as below:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: rbac.authorization.k8s.io/v1\r\nkind: Role\r\nmetadata:\r\n  name: kruise-rollout-istio-role\r\n  namespace: kruise-rollout\r\nrules:\r\n  - apiGroups:\r\n    - networking.istio.io\r\n    resources:\r\n    - destinationrules\r\n    - virtualservices\r\n    verbs:\r\n    - get\r\n    - list\r\n    - patch\r\n    - update\r\n    - watch\r\n  ...\r\n---\r\napiVersion: rbac.authorization.k8s.io/v1\r\nkind: RoleBinding\r\nmetadata:\r\n  name: kruise-rollout-istio-rolebinding\r\nroleRef:\r\n  apiGroup: rbac.authorization.k8s.io\r\n  kind: Role\r\n  name: kruise-rollout-istio-role\r\nsubjects:\r\n- kind: ServiceAccount\r\n  name: controller-manager\r\n  namespace: kruise-rollout\n"})})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},83122:(e,n,r)=>{r.d(n,{A:()=>s});const s=r.p+"assets/images/vscode-conf-402152c12f5ad907063732b4f52941d3.png"}}]);
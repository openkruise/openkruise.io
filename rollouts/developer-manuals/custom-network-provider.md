# Extensible Traffic Routing Based on Lua Script

**FEATURE STATE:** Kruise Rollout v0.5.0

Kruise Rollout utilizes a Lua-script-based customization approach for **Gateway resources (Istio VirtualService, Apisix ApisixRoute, Kuma TrafficRoute and etc.)**. Kruise Rollout involves invoking Lua scripts to retrieve and update the desired configurations of gateway resources based on **release strategies and the original configurations of gateway resources (including spec, labels, and annotations)**. It enables users to easily adapt and integrate various types of Gateway resources without modifying existing code and configurations.

Since Kruise Rollout also support using Gateway API to configure traffic routing, one can also use corresponding Gateway API implementation for specific gateway resource. However, it is hard to implement a full blown Gateway API implementation, and many gateway providers who provides k8s CRD API still lack the official support for Gateway API. Using Lua script, one can manipulate arbitrary gateway resources for traffic routing
only and avoid the complexity of introducing Gateway API. 

## How it Works

<img src={require('../../static/img/rollouts/custom-workflow.png').default} />

The entire process of can be described as follows:

1. Users define Rollout traffic canary rules and the gateway resources that need modification, initiating the canary deployment.
2. Obtain specified gateway resources based on Rollout configurations.
3. Get the Lua scripts corresponding to the gateway resources.
4. When release started, first convert the current configurations of the gateway resources into a string and store it in the resource annotation`rollouts.kruise.io/original-spec-configuration`.
5. Feed the gateway resource configuration along with the Rollout configurations to the Lua script. Then utilize the Lua script to process the current resource configurations and Rollout configurations to get the new configurations and update the resources accordingly.
6. After the release is completed, retrieve the original configurations of the resources from the `rollouts.kruise.io/original-spec-configuration` annotation and restore them.

Custom traffic routing can be configured in Rollout as below:

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
...
spec:
  strategy:
    canary:
      trafficRoutings:
      - service: <stable-service>
        customNetworkRefs:
        - apiVersion: <your-resource-apiVersion>
          kind: <your-resource-kind>
          name: <your-resource-name>
```

The api details are shown as below:

| Fields                         | Type   | Defaults | Explanation                          |
| ------------------------------ | ------ | -------- | ------------------------------------ |
| `customNetworkRefs`            | object | nil      | Definitions of  gateway resources |
| `customNetworkRefs.apiVersion` | string | ""       | ApiVersion of a gateway resource |
| `customNetworkRefs.kind`       | string | ""       | Kind of a gateway resource       |
| `customNetworkRefs.name`       | string | ""       | Name of a gateway resource       |

## Define Your Custom Traffic Routing Lua Script

There are two ways to define and use your custom traffic routing Lua script to handle the gateway resources, the next two sections describe those ways.

### Way1: Contribute a Custom Traffic Routing

You can contribute Lua scripts for custom resources and the scripts can be bundled into Kruise Rollout after passing the tests. These Lua scripts can then be directly invoked within the Rollout.

Kruise Rollout by default invoke Lua scripts in the `rollouts/lua_configuration` directory. The bundled Lua scripts should follow the following directory structure:

```plain
rollouts
|-- lua_configuration
|    |-- your.crd.group.io                    # CRD group
|    |    |-- MyKind                          # Resource kind
|    |    |    |-- trafficRouting.lua         # Custom traffic routing Lua script
|    |    |    |-- testdata                   # Directory with test resource YAML definitions
|		 |		|		 |		|-- test_case1.yaml       # Lua script test case
|		 |		|		 |		|-- test_case2.yaml       # Lua script test case
```

Where:

- `trafficRouting.lua` defines how to process gateway resources.
- The `testdata` directory contains test cases, and the structure of test cases is as follows:

```yaml
rollout:
	# rollout configuration
trafficRouting:
  # trafficRouting configuration
original:
	# original resource configuration
expected:
	# expected resource configurations in every step of release plan
```

**Custom traffic routing Lua script must pass the tests to prove it can work as expected**. The following example demonstrates a custom traffic routing test for `networking.istio.io/VirtualService`.

```yaml
rollout:
  apiVersion: rollouts.kruise.io/v1beta1
  kind: Rollout
  metadata:
    name: rollouts-demo
  spec:
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: deploy-demo
    strategy:
      canary:
        enableExtraWorkloadForCanary: true
        steps:
        - matches:
          - headers:
            - type: Exact
              name: user-agent
              value: pc
            - type: RegularExpression
              name: name
              value: ".*demo"
        - matches:
          - headers:
            - type: Exact
              name: user-agent
              value: pc
          - headers:
            - type: RegularExpression
              name: name
              value: ".*demo"
        - traffic: 50%
          replicas: 50%
        trafficRoutings:
        - service: svc-demo
          customNetworkRefs:
          - apiVersion: networking.istio.io/v1alpha3
            kind: VirtualService
            name: vs-demo
original:
  apiVersion: networking.istio.io/v1alpha3
  kind: VirtualService
  metadata:
    name: vs-demo
  spec:
    hosts:
    - "*"
    gateways:
    - nginx-gateway
    http:
    - route:
      - destination:
          host: svc-demo
expected:
  - apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: vs-demo
    spec:
      hosts:
      - "*"
      gateways:
      - nginx-gateway
      http:
      - match:
        - headers:
            user-agent:
              exact: pc
            name:
              regex: .*demo
        route:
        - destination:
            host: svc-demo-canary
      - route:
        - destination:
            host: svc-demo
  - apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: vs-demo
    spec:
      hosts:
      - "*"
      gateways:
      - nginx-gateway
      http:
      - match:
        - headers:
            name:
              regex: .*demo
        route:
        - destination:
            host: svc-demo-canary
      - match:
        - headers:
            user-agent:
              exact: pc
        route:
        - destination:
            host: svc-demo-canary
      - route:
        - destination:
            host: svc-demo
  - apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: vs-demo
    spec:
      hosts:
      - "*"
      gateways:
      - nginx-gateway
      http:
      - route:
        - destination:
            host: svc-demo
          weight: 50
        - destination:
            host: svc-demo-canary
          weight: 50
```

Run `go test -v ./pkg/trafficrouting/network/customNetworkProvider/` to test if the Lua scripts are working as expected. Kruise Rollout will walk the `./lua_configuration` directory to retrieve all Lua scripts and test cases. Kruise Rollout will then perform tests based on the defined release strategies in the Rollout to check if the original configuration of the resource, after being processed by the Lua script, matches the expected configuration.

<img src={require('../../static/img/rollouts/test-lua.gif').default} />

The [PR#178](https://github.com/openkruise/rollouts/pull/178)is an example for Istio VirtualService.

#### Recommanded Test Case Designation

When designing test cases, at least the release strategies listed below are supposed to be considered:

- Release strategy with header matches, and the rules are defined in one `headers` filed.

```yaml
# spec.strategy.canary.steps:
- matches:
  - headers:
    - type: Exact
      name: user-agent
      value: pc
    - type: RegularExpression
      name: name
      value: ".*demo"
```

- Release strategy with header matches, and the rules are defined in different `headers` filed.

```yaml
# spec.strategy.canary.steps:
- matches:
  - headers:
    - type: Exact
      name: user-agent
      value: pc
  - headers:
    - type: RegularExpression
      name: name
      value: ".*demo"
```

**Please visit** [API Specifications | OpenKruise](https://openkruise.io/zh/rollouts/user-manuals/api-specifications) **for more information about the difference of the above mentioned two release strategies.**

- Release strategy without header matches, and the traffic is routed to canary service with a certain weight.

```yaml
# spec.strategy.canary.steps:
- traffic: 20%
```

- **Special Note:** By default, traffic routing strategies defined in Rollout will create a new canary for new pods, while TrafficRouting will not.

### Way2: Define in ConfigMap

When the expected traffic routing Lua scripts are not bundled in Kruise Rollout, users could utilize ConfigMap to define and use Lua script to handle gateway resources. Custom traffic routing lua script can be defined in

```yaml
<lua.traffic.routing.Kind.CRDGroup>: |
# define your lua script below
```

field of ConfigMap `kruise-rollout/kruise-rollout-configuration`.

The following example demonstrates a traffic routing for `networking.istio.io/DestinationRule`, you can also define your own Lua script for gateway resources of other groups for example Apisix and Kuma in the ConfigMap.

```yaml
data:
  "lua.traffic.routing.DestinationRule.networking.istio.io": |
  	local spec = obj.data.spec
    local canary = {}
    canary.labels = {}
    canary.name = "canary"
    local podLabelKey = "istio.service.tag"
    canary.labels[podLabelKey] = "gray
    table.insert(spec.subsets, canary)
    return obj.data
```

**Then if the expected Lua script does not exist locally, Kruise Rollout will get the script from ConfigMap.**

## Write Your Custom Traffic Routing Lua Script

Designing a Lua script is the key of custom traffic routing. In the following sections, we will introduce some syntax of Lua as well as writing and debugging a custom traffic routing Lua script.

### Lua Syntax

#### Lua Data Types

In Lua, data can be represented using different data types. Here are the common data types in Lua:

- `Boolean`: Represents true or false values.
- `Number`: Represents integers or floating-point numbers.
- `String`: Represents textual data and can be enclosed in single or double quotes.
- `Table`: The most important data structure in Lua, used to represent associative arrays, lists, sets, and other complex data structures.
- `Function`: Represents executable code blocks that can be called and passed parameters.

#### Lua Table

As mentioned above, table is the most import data structure in Lua. In Lua, a table is used to store and organize data. It can store values of different types, such as numbers, strings, and other tables. Lua tables are associative arrays that allow access and manipulation of values using keys. Here are some features and common operations of tables in Lua:

- **Creating a table:**

Create an empty table using curly braces: `myTable = {}`

Create an empty table using the table.create() constructor: `myTable = table.create()`

- **Adding and accessing elements:**

Add elements using keys: `myTable[key] = value`

Access elements using keys: `myTable[key]`

Access elements using dot notation: `myTable.key`

- **Iterating over a table:**

Iterate over all key-value pairs using the `pairs()` function:

```lua
for key, value in pairs(myTable) do ... end
```

Iterate over the array part of the table using the `ipairs()` function:

```lua
for index, value in ipairs(myTable) do ... end
```

- **Deleting elements:**

Delete an element using keys: `myTable[key] = nil`

#### Common functions

- `table.insert()`: Inserts a value into a table.
- `table.remove()`: Removes a value from a table.
- `table.concat()`: Concatenates the strings in a table into a new string.
- `ipairs()`: Iterator for looping through the array part of a table.
- `pairs()`: Iterator for looping through all key-value pairs of a table.

### Handle the Resource

The resource status and release strategy in Kruise Rollout are defined using the LuaData structure and converted into a Lua table. This Lua table is then passed as a global variable `obj` into the Lua script for further processing.

```go
type LuaData struct {
    Data             Data
    CanaryWeight     int32
    StableWeight     int32
    Matches          []rolloutv1alpha1.HttpRouteMatch
    CanaryService    string
    StableService    string
}
// Data struct contains current configurations of a resource
type Data struct {
	Spec        interface{}       `json:"spec,omitempty"`
	Labels      map[string]string `json:"labels,omitempty"`
	Annotations map[string]string `json:"annotations,omitempty"`
}
```

You should handle `obj` in Lua script and **must retrun an object contains expected spec, labels and annotations** of the gateway resource, a simple way is to return `obj.data`.

```lua
-- Lua variables are assigned by reference,
-- so updates to 'spec' can be synchronized to 'obj.data.spec'.
spec = obj.data.spec -- get resource 'spec'
hosts = spec.hosts
canaryService = obj.canaryService
-- traverse header 'matches' defined in Rollout strategy
for _, match in ipairs(obj.matches) do
	... -- define how to handle matches
end
-- return 'obj.data' and Kruise Rollout will update the resource
return obj.data
```

Or you can define your own variable as return value as long as it **contains expected spec, labels and annotations**, an example is:

```lua
...
-- define the return variable
ret = {}
-- set annotations, labels and spec of ret
ret.annotations = annotations
ret.labels = labels
ret.spec = spec
return ret
```

### Debug Your Lua Script

If you need to debug Lua scripts, you can achieve this by installing the [Lua Debug](https://marketplace.visualstudio.com/items?itemName=actboy168.lua-debug) extension in VSCode. Once installed, you can execute Lua scripts in a step-by-step debugging mode and view variable values by selecting **Lua Debug -> Debug Current File** from the Run and Debug menu.

<img src={require('../../static/img/rollouts/vscode-conf.png').default} width="50%" />

Afterwards, define the global variable `obj` in the Lua script to enable step-by-step debugging and test if the Lua script is working as expected.

You can generate and use the `obj` for debugging by running `go run ./lua_configuration/convert_test_case_to_lua_object.go`. This program will automatically retrieve the test cases from the `testdata` directory of all custom Gateway resources in the `lua_configuration` folder, convert them into the form of the global variable `obj` that passes to Lua script, and save them in `test_case_obj.lua`. This makes it convenient for users to pass `obj` to their Lua scripts and execute step-by-step debugging.

An example of `test_case_obj.lua` is shown as below:

```lua
steps = {
  	-- obj of release step_0
    step_0 = { canaryWeight = -1, stableWeight = 101,
        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },
        canaryService = "mocka", stableService = "mocka",
        data = {
            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },
                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }, }
```

Pass the Lua table defined in `test_case_obj.lua` as global variable `obj` in your Lua script then you can start debugging.

```lua
-- define obj in your Lua script, copied from test_case_obj.lua
obj = { canaryWeight = -1, stableWeight = 101,
        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },
        canaryService = "mocka", stableService = "mocka", },
        data = {
            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },
                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }
spec = obj.data.spec
--- define your lua script below
```

<img src={require('../../static/img/rollouts/debug-lua.gif').default} />
### Add RBAC Permissions for Gateway Resources
In order to enable Kruise Rollout to access and update the gateway resources, you need to add the RBAC permissions of the gateway resources for Kruise Rollout.

It is suggested to create a new role for Kruise Rollout under kruise-rollout namesapce, and to add `get, list, patch, update, watch` permissions for gateway resource in the RBAC role. An example for Istio VirtualService and DestinationRule is shown as below:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kruise-rollout-istio-role
  namespace: kruise-rollout
rules:
  - apiGroups:
    - networking.istio.io
    resources:
    - destinationrules
    - virtualservices
    verbs:
    - get
    - list
    - patch
    - update
    - watch
  ...
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kruise-rollout-istio-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kruise-rollout-istio-role
subjects:
- kind: ServiceAccount
  name: controller-manager
  namespace: kruise-rollout
```

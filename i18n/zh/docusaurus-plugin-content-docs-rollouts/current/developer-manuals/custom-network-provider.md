# 使用Lua脚本自定义流量路由

**FEATURE STATE:** Kruise Rollout v0.5.0

Kruise Rollout 利用一种基于Lua脚本的定制方法，用来控制**流量网关资源(例如Istio的VirtualService, Apisix的ApisixRoute, Kuma的Traffic Route等)**。Kruise Rollout 会根据发布策略以及流量网关的原始配置，通过调用Lua脚本来获取和更新期望的流量路由配置。这种机制让用户可以将各种流量网关实现适配到Kruise Rollout中, 而不需要修改现有的Kruise代码。 

因为Kruise Rollout 也支持使用Gateway API 来指定流量路由，用户也可以使用流量网关对应的Gateway API。 然而，实现一个完整的Gateway API工作量很大， 即使对于提供了K8s CRD的接口Gateway API 提供商，很多也没有提供对应的Gateway API 实现版本。通过Lua脚本， 用户可以为任意的流量网关资源来来配置流量路由， 避免了引入Gateway API 实现的复杂性。 

## 工作原理

<img src={require('/static/img/rollouts/custom-workflow.png').default} />

使用自定义流量网关的发布流程如下：

1. 用户定义金丝雀发布的流量路由规则， 以及需要修改的流量网关资源，从而发起发布
2. Kruise Rollout 根据Rollout对象的配置，获取对应的流量网关资源, 以及关联的Lua脚本
3. 当发布开始时， Kruise Rollout首先把当前流量网关资源的配置转换成字符串， 并保存在流量网关资源的annotation `rollouts.kruise.io/original-spec-configuration`
4. 把Rollout配置以及对应流量网关资源的配置作为输入， 传递给用户配置的Lua脚本，Lua脚本会产生新的流量网关资源配置, 并由Kruise Rolout更新到k8s中
5. 当发布完成后， 从网关资源的annotation `rollouts.kruise.io/original-spec-configuration` 中获取原有的网关资源配置， 并恢复配置到k8s中。 

在Rollout资源中， 自定义流量路由规则可以按如下格式配置

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

API 字段的详细介绍如下::

| 字段                         | 类型   | 默认值 | 描述                          |
| ------------------------------ | ------ | -------- | ------------------------------------ |
| `customNetworkRefs`            | object | nil      | 流量网关资源的定义 |
| `customNetworkRefs.apiVersion` | string | ""       | 流量网关资源的API版本 |
| `customNetworkRefs.kind`       | string | ""       | 流量网关资源的API类型       |
| `customNetworkRefs.name`       | string | ""       | 流量网关资源的名字       |

## 如何定义您的自定义流量网关Lua 脚本

有两种方式来定义自定义流量网关脚本:

### 方法1：使用Kruise Rollout内置的自定义流量网关脚本

您可以贡献您的自定义网关资源的Lua脚本到社区， 一旦通过了相关测试并被社区接受为内置的流量自定义流量网关脚本， Lua脚本会和Kruise Rollout打包在一起。这种脚本可以直接在Rollout中使用：

Kruise Rollout 默认会调用位于`rollouts/lua_configuration` 目录的Lua脚本。 这些内置的Lua脚本需要遵循如下的目录结构:

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

其中：

- `trafficRouting.lua` 定义了处理自定义流量网关资源的Lua脚本
- `testdata` 目录定义了测试的目录，测试目录中每个yaml文件包含了具体的测试案例， YAML文件的格式如下

```yaml
rollout:
	# Rollout资源配置
trafficRouting:
        # 单独的trafficRouting资源配置【可选】
original:
	# 原有的自定义网关资源配置
expected:
	# 金丝雀过程中，流量路由修改后，期望的自定义网关资源配置（每个金丝雀步骤一个配置）
```

**自定义流量网关脚本必须提供测试案例，并通过测试来证明其可工作** 下面的例子展示了处理Istio流量网关资源(`networking.istio.io/VirtualService`)的脚本测试案例：

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

运行 `go test -v ./pkg/trafficrouting/network/customNetworkProvider/` 来验证内置的Lua脚本是否按预期来工作。 具体的， Kruise Rollout会遍历`./lua_configuration` 目录来获取自定义流量网关的Lua脚本，以及对应的测试案例。 Kruise Rollout 会将Rollout配置，以及流量网关的配置传递给Lua脚本，并验证Lua脚本的输出符合定义的预期结果(expected)

<img src={require('/static/img/rollouts/test-lua.gif').default} />

[PR#178](https://github.com/openkruise/rollouts/pull/178)中包括了Istio VirtualService的具体例子

#### 测试案例需要覆盖的场景

在设计单测案例时, 至少需要考虑如下三种发布场景:

When designing test cases, at least the release strategies listed below are supposed to be considered:

- A/B 测试，也就是灰度规则中包括了http头的匹配规则, 且匹配规则定义在一个headers字段中（规则需要ANDed)

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

- A/B 测试，也就是灰度规则中包括了http头的匹配规则, 且匹配规则定义在多个headers字段中（规则需要ORed)

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

**参见** [API定义](https://openkruise.io/zh/rollouts/user-manuals/api-specifications) **来了解更多关于这两种发布场景的差异**

- 金丝雀发布，且不包含http头匹配规则， 流量按一定的比例路由到金丝雀服务

```yaml
# spec.strategy.canary.steps:
- traffic: 20%
```

- **Special Note:** By default, traffic routing strategies defined in Rollout will create a new canary for new pods, while TrafficRouting will not.

### 方法2: 在ConfigMap中定义Lua脚本

当流量网关对应的Lua脚本没有内置在Kruise Rollout中时，用户可以利用ConfigMap来定义流量网关的Lua脚本。 特别的， 流量网关的Lua脚本可以在 ConfigMap `kruise-rollout/kruise-rollout-configuration` 的如下字段中

```yaml
<lua.traffic.routing.Kind.CRDGroup>: |
# 这里写自定义Lua脚本的字符串
```

下面的例子展示了定义Istio流量网关`networking.istio.io/DestinationRule`的对应Lua脚本，类似的，你也可以在Configmap中， 给其他流量网关资源来定义Lua脚本，例如Apisix、Kuma.  

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

**如果Kruise Rollout在内置的流量网关中找不到对应的Lua脚本，就会试图从Configmap中读取对应脚本**

## 编写自己的流量网关Lua脚本来控制流量路由

这个部分会介绍Lua的一些相关语法，以及如何编写和调试控制流量路由的Lua脚本

### Lua 语法

#### Lua 数据类型s

Lua 中有几种常见的数据类型:

- `Boolean`: 代表布尔类型的数据， 例如 true 或者 false。
- `Number`: 代表整数或整数的数值。
- `String`: 代表文本数据， 该数据可以通过单引号或者双引号来包括。  
- `Table`: Lua中最重要的数据结果， 可以用来表示关联数组、列表、集合以及其他复杂的数据结构。
- `Function`: 代表可执行的代码块，这种类型的数值可以被调用，或者作为参数传递给其他函数。

#### Lua Table

Lua中的table类型用来存储和组织数据， 它可以存储各种类型的元素，例如数值、文本甚至嵌套存储其他的table。 Lua table表示的是关联数组， 可以用数组的键来访问数组对应的元素的值。 如下是table类型的常见特性和公共操作。 

- **创建table:**

使用花括号来创建一个空的table: `myTable = {}`

使用 `myTable = table.create()` 构造函数来创建空table

- **新增或者访问table中元素:**

通过键名添加元素: `myTable[key] = value`

通过键名来访问元素: `myTable[key]`

通过点记号来访问元素: `myTable.key`

- **遍历table:**

通过`pairs()`函数来遍历table中的所有键值对。 

```lua
for key, value in pairs(myTable) do ... end
```

通过`ipairs()`函数来遍历table中的数组部分

```lua
for index, value in ipairs(myTable) do ... end
```

- **删除元素:**

使用键名来删除一个元素: `myTable[key] = nil`

#### 公共函数

- `table.insert()`: 插入一个元素到table中。
- `table.remove()`: 在table中删除一个元素。
- `table.concat()`: 把table中所有字符串拼接成一个新的字符串。 
- `ipairs()`: 获得一个遍历器，用来遍历table中的数组部分。 
- `pairs()`: 获得一个遍历器，用来遍历talbe中的键值部分。 

### 处理网关资源

网关资源的状态和发布策略相关数据在一个名叫LuaData的结构中记录， 并且会被转化成一个Lua table, 并作为一个全局的变量 `obj` 来供Lua脚本来进一步处理。 

```go
type LuaData struct {
    Data             Data
    CanaryWeight     int32
    StableWeight     int32
    Matches          []rolloutv1alpha1.HttpRouteMatch
    CanaryService    string
    StableService    string
}
// Data 结构包含了当前自定义网关资源的配置
type Data struct {
	Spec        interface{}       `json:"spec,omitempty"`
	Labels      map[string]string `json:"labels,omitempty"`
	Annotations map[string]string `json:"annotations,omitempty"`
}
```
自定义Lua脚本需要根据`obj`，按照金丝雀发布的逻辑， 处理自定义的流量路由策略， 来返回一个自定义网关资源的对象， 这个对象需要包括修改后网关资源的新spec、labels和annotations。 一种简单的方法是修改obj.data并且在脚本中返回 `obj.data`

```lua
-- Lua 变量是按引用来传递的， 因此修改 'spec' 可以同步地修改'obj.data.spec'
spec = obj.data.spec -- get resource 'spec'
hosts = spec.hosts
canaryService = obj.canaryService
-- 一般要遍历Rollout strategy中的http头相关字段'matches'
for _, match in ipairs(obj.matches) do
	... -- 在这里实现不同的matches的处理逻辑
end
-- 返回'obj.data'， Kruise Rollout会将修改后的自定义网关资源更新到集群中
return obj.data
```

您也可以定义并返回自己的变量，只要这边变量包括了自定义网关资源的路由操作后的新spec、labels和annotations，例如:  

```lua
...
-- 定义自己的返回变量ret
ret = {}
-- 设置ret的annotations, labels 和 spec
ret.annotations = annotations
ret.labels = labels
ret.spec = spec
return ret
```

### 调试您的Lua Script

如果您需要调试Lua脚本，可以在lua脚本中定义一个全局变量`obj`， 并逐行调试来检查Lua脚本是否按预期工作。特别的一种办法是安装VSCode的[Lua Debug](https://marketplace.visualstudio.com/items?itemName=actboy168.lua-debug) 插件。 安装后， 在调试模式就可以逐行执行Lua脚本，并且检查相应的变量赋值情况， 具体方式是在**Run and Debug**目录中选择**Lua Debug -> Debug Current File**

<img src={require('/static/img/rollouts/vscode-conf.png').default} width="50%" />


特别的， 你可以按上述的Yaml格式编写测试案例， 并通过运行 `go run ./lua_configuration/convert_test_case_to_lua_object.go` 来生成并使用 `obj`。 这个程序会获取内置的自定义网关资源（`lua_configuration`）中测试案例（`testdata`）目录， 并转化测试案例为全局变量 `obj` 的形式， 并保存到相应的 `*_case_obj.lua`脚本中。 开发者可以拷贝`*_case_obj.lua`的对象为 `obj`， 并传递给自定义网关的Lua脚本， 从而用来逐行调试脚本。 


如下是一个由示例的测试案例输出的对象文件 `test_case_obj.lua`:

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

只要把 `test_case_obj.lua` 中定义的Lua table变量(例如step_0) 在您的Lua脚本中拷贝为一个全局变量 `obj`， 就可以开始调试

```lua
-- 从test_case_obj.lua中拷贝变量step_0为obj变量
obj = { canaryWeight = -1, stableWeight = 101,
        matches = { { headers = { { value = "demo", type = "Exact", name = "destination", }, }, }, },
        canaryService = "mocka", stableService = "mocka", },
        data = {
            spec = { subsets = { { labels = { version = "base", }, name = "version-base", }, },
                trafficPolicy = { loadBalancer = { simple = "ROUND_ROBIN", }, }, host = "svc-a", }, }, }
spec = obj.data.spec
--- 以下定义您自己的自定义网关的Lua脚本
```

<img src={require('/static/img/rollouts/debug-lua.gif').default} />
### 授权Kruise Rollout 访问自定义网关资源
为了让Kruise Rollout可以访问并更新自定义网关的资源， 需要配置相应的RBAC规则，从而对Kruise Rollout 进行授权

推荐在kruise-rollout命名空间下新建一个role，， 并添加一个包含 `get, list, patch, update, watch` 自定义网关资源权限的角色， 并授权该角色给Kruise Rollout。以下是一个Istio VirtualService 和DestinationRule 的RBAC 规则的示例:

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

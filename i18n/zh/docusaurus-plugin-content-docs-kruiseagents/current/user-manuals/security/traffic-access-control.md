---
id: traffic-access-control
title: 流量访问控制
---

# 流量访问控制

Sandbox 执行的是 Agent 生成且通常不受信任的代码，因此其出站流量需要被显式管控。OpenKruise Agents 把出口管控
拆分为两层策略：`TrafficPolicy` 在三层/四层决定目标是否可达，`SecurityProfile` 在七层检查单个 HTTP 请求。组件
模型见[架构](../../architecture.md)。

## 策略执行流程

注入了 TrafficProxy Sidecar 的 Sandbox，其出站流量会在离开集群前被捕获并完成评估：

```text
Sandbox application container
  -> TrafficProxy in-pod capture
  -> egress gateway chosen by egress routing
  -> Envoy external processing
  -> Egress Policy Enforcer decision
  -> external service, or a blocked response
```

出口策略执行器（EPE）负责编译 `TrafficPolicy` 和 `GlobalTrafficPolicy` 并下发到数据面，因此被拒绝的目标在到达
网关前就会被丢弃。EPE 同时负责评估 `SecurityProfile` 和 `GlobalSecurityProfile`，网关只在流量被路由到网关的
HTTP 请求上调用它。走直接透传路径的请求永远不会到达 EPE，EPE 也无法覆盖 `TrafficPolicy` 的拒绝结果。

## 接入 Sandbox

流量检查通过运行时约定生效，而不是通过注解。在 Sandbox，或在其派生来源 SandboxTemplate、SandboxSet 上添加
`traffic-proxy` 运行时，该运行时会注入 TrafficProxy Sidecar：

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: Sandbox
metadata:
  name: traffic-sample
  namespace: default
spec:
  runtimes:
    - name: traffic-proxy
  template:
    metadata:
      labels:
        app: traffic-sample
    spec:
      containers:
        - name: sandbox
          image: your-sandbox-image:latest
```

`sandbox-injection-config` ConfigMap 中的 `traffic-proxy` 条目定义了该运行时会注入的内容，因此在引用之前，请确认
你的发行版已提供该条目。运行时的声明与传播方式见 [运行时注入](../runtime-injection.md)。

策略选择器匹配的是 Sandbox 的有效标签。池化 Sandbox 只有在被领取期间才会作为策略主体发布；并且只有当数据面
上报的 Pod UID 与由 Sandbox 推导出的身份一致时，该绑定才会被接受；身份模糊或过期的绑定会按失败关闭处理。

## 四层目标控制

`TrafficPolicy` 选择发起调用的 Pod，并持有一组有序的出口规则。每条出口规则都必须声明 `to`，还可以声明
`action`（`allow` 或 `reject`）和 `ports` 列表。单个对端支持 `fqdn`、`cidr`、`service` 或 `workload`，多个对端
之间是或的关系。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: TrafficPolicy
metadata:
  name: sandbox-egress
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  egress:
    rules:
      - action: allow
        to:
          - service:
              name: kube-dns
              namespace: kube-system
      - action: allow
        to:
          - fqdn: api.example.com
      - action: reject
        ports:
          - protocol: TCP
            port: 443
        to:
          - cidr: 10.0.0.0/8
```

一旦某个策略选中了 Pod，未匹配到任何放行规则的出站流量都会被拒绝。缺少对端字段的规则会被编译器跳过，也不会
形成默认拒绝。请务必放行集群 DNS Service，否则域名解析会失败。`spec` 要求 `ingress` 和 `egress` 至少声明其中
一个。

## 七层请求控制

`SecurityProfile` 匹配 HTTP 请求并执行动作。`spec.selector` 是必填字段，它选择的是发起调用的 Pod，而不是外部
服务；空选择器会匹配该命名空间下的所有 Pod。

每条规则都有唯一的 `name`、至少一个 `match` 子句和 `actions`。`match` 中的多个子句是或的关系，单个子句内所有已
填写的字段是与的关系。每个子句都必须提供 `domains`：

| 字段 | 行为 |
| --- | --- |
| `domains` | `*` 匹配任意主机名。`*.example.com` 匹配子域名，但不匹配 `example.com`。主机名匹配大小写不敏感。 |
| `paths` | 或的关系。默认 `Prefix`，也支持 `Exact` 和 RE2 `Regex`。查询字符串不参与匹配。 |
| `methods` | 或的关系，大小写不敏感。 |
| `ports` | 或的关系。依次取 authority 端口、推断出的 HTTP/HTTPS 端口、目标端口。端口 `0` 永远不会匹配非空列表。 |
| `schemes` | 或的关系，大小写不敏感，例如 `http` 和 `https`。 |
| `headers` | 与的关系。名称统一转小写；默认 `Exact`，也支持 `Prefix` 和 RE2 `Regex`。 |
| `queryParams` | 与的关系。取值会先做百分号解码，重复键只考虑第一个值。 |

可用动作：

| 动作 | 是否终止 | 行为 |
| --- | --- | --- |
| `block` | 是 | 返回 `statusCode`（默认 `403`）和可选的 `body`，不向上游转发，并丢弃待生效的修改。 |
| `bypass` | 是 | 转发请求并跳过后续所有动作和规则，保留已经生效的修改。 |
| `mcpToolPolicy` | 否 | 按工具名放行或拒绝 MCP JSON-RPC `tools/call` 请求。 |
| `headerManipulation` | 否 | 设置或移除明文请求头。取值按原文保存，不要用它传递凭据。 |
| `tokenTransformation` | 否 | 用 Secret 或凭据提供方改写请求凭据。受 `failStrategy` 控制，默认值为 `Block`。 |
| `audit` | 否 | 异步发送 Webhook 事件，绝不改变请求的判定结果。 |

## 评估顺序

所有匹配的策略会合并为一个顺序：先按 `spec.priority` 升序（默认 `1000`），再按创建时间、名称、命名空间排序。
集群级与命名空间级策略共用这一个顺序，完全相同时集群级策略排在前面，因为它的命名空间为空。

随后 EPE 会从第一个策略到最后一个策略依次评估所有匹配的规则，并保留每个策略内部的规则顺序。匹配不是首条命中
即停止，因此宽泛规则之后，后续规则仍然可能命中。终止动作会中断剩余的执行链。

在同一条规则内，动作按固定的注册顺序执行：`bypass`、`block`、`mcpToolPolicy`、`headerManipulation`、
`tokenTransformation`；YAML 中的键顺序不会改变它。如果某个转换必须在后续策略判定之前执行，请把终止动作拆到
单独的规则中。`audit` 不属于这条执行链：它在流结束时、最终判定已经确定之后才执行。

## 集群级策略

`GlobalSecurityProfile` 的 `spec` 与之相同，但作用域是集群级，可以选择任意命名空间中的 Pod。它适合承载集中管理
的基线策略，并且需要谨慎设置 `priority`，因为它与命名空间级策略处于同一评估顺序中。不要设置
`metadata.namespace`。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: GlobalSecurityProfile
metadata:
  name: cluster-baseline
spec:
  selector:
    matchLabels:
      app: traffic-sample
  priority: 50
  rules:
    - name: deny-metadata-endpoint
      match:
        - domains:
            - metadata.internal
      actions:
        block:
          statusCode: 403
          body: '{"error":"metadata endpoint is blocked by the cluster baseline"}'
```

由于集群级策略没有自己的命名空间，ConfigMap 输入必须显式指定命名空间；未指定命名空间的 Secret 凭据引用会回退
到每个被选中 Pod 所在的命名空间。`GlobalTrafficPolicy` 是与之对应的集群级四层资源。

## 常见场景

### 屏蔽管理路径

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: deny-management-paths
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: deny-management-paths
      match:
        - domains:
            - "*"
          paths:
            - type: Prefix
              value: /admin
            - type: Prefix
              value: /console
            - type: Prefix
              value: /dashboard
      actions:
        block:
          statusCode: 403
          body: '{"error":"management paths are blocked"}'
```

### 阻止访问内部端点

被提示词注入的代码通常会尝试对内部服务和元数据端点发起服务端请求伪造。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: deny-internal-endpoints
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: deny-internal-and-metadata
      match:
        - domains:
            - "*.internal.company.com"
            - "*.corp.net"
            - metadata.internal
      actions:
        block:
          statusCode: 403
          body: '{"error":"access to internal services is forbidden"}'
```

### 强制只读访问

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: read-only-egress
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: read-only-mode
      match:
        - domains:
            - "*"
          methods:
            - POST
            - PUT
            - DELETE
            - PATCH
      actions:
        block:
          statusCode: 405
          body: '{"error":"write operations are not allowed in read-only mode"}'
```

### 域名白名单

在同一条规则链中组合使用 `bypass` 和 `block`。白名单规则必须排在兜底规则之前。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: domain-allowlist
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: allow-public-api
      match:
        - domains:
            - api.example.com
            - "*.cdn.example.com"
      actions:
        bypass: true
    - name: deny-all
      match:
        - domains:
            - "*"
      actions:
        block:
          statusCode: 403
          body: '{"error":"access denied: domain is not in the allowlist"}'
```

`bypass` 会保留此前已生效的修改，因此它并不是通用的放行规则。如果意图是控制目标可达性，而不是跳过后续的七层
检查，请优先使用 `TrafficPolicy`。

### 限制 MCP 工具调用

`mcpToolPolicy` 只管控 JSON-RPC `tools/call`，并按 `params.name` 精确匹配工具名。其他方法（包括 `tools/list`
和 `initialize`）都会直接放行。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: mcp-tool-whitelist
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  rules:
    - name: protect-mcp-tools
      match:
        - domains:
            - mcp.example.com
          schemes:
            - https
          paths:
            - type: Prefix
              value: /mcp
      actions:
        mcpToolPolicy:
          defaultAction: deny
          unsupportedVersionAction: deny
          denyResponse:
            statusCode: 403
            body: MCP tool is not permitted
          rules:
            - method: tools/call
              toolNames:
                - read_file
                - search_docs
              action: allow
```

规则按文档顺序评估，首条命中即生效。空的 `toolNames` 列表会匹配该方法下的所有工具名。做白名单时请使用
`defaultAction: deny`：若设为 `defaultAction: allow`，无法读取的请求体和无法取到工具名的调用会被设计为放行。

### 审计被拦截的请求

审计动作属于 `SecurityProfile` 和 `GlobalSecurityProfile`，而不属于 `TrafficPolicy`：它记录的是七层规则评估的
结果。策略级 `audit` 列表会被所有匹配的规则继承；非空的 `rules[].actions.audit` 列表会在该规则上替换继承来的
列表。

```yaml
apiVersion: agents.kruise.io/v1alpha1
kind: SecurityProfile
metadata:
  name: audit-blocked-admin
  namespace: default
spec:
  selector:
    matchLabels:
      app: traffic-sample
  audit:
    - name: blocked-request
      when: result == "blocked"
      webhook:
        url: https://audit-receiver.example.com/v1/events
        timeout: 2s
        request:
          method: POST
          headers:
            - name: X-Audit-Type
              value: blocked-request
          body:
            json:
              result: "{{ .Result }}"
              profile: "{{ .Profile.Name }}"
              rule: "{{ .Rule.Name }}"
              host: "{{ .Request.Host }}"
              path: "{{ .Request.Path }}"
              method: "{{ .Request.Method }}"
  rules:
    - name: deny-admin
      match:
        - domains:
            - api.example.com
          methods:
            - GET
          paths:
            - type: Exact
              value: /admin
      actions:
        block:
          statusCode: 403
          body: request blocked by policy
```

`when` 条件是 CEL 表达式，可以看到最终的 `result`（`passthrough`、`mutated`、`blocked`、`bypassed` 或 `error`）
以及 `request`、`pod`、`profile`、`rule` 和 `response`；省略 `when` 时总是触发。Webhook 请求体中的字符串叶子会按
同一份数据以 Go 模板渲染。

事件在最终判定之后渲染并异步投递。EPE 不做重试：队列已满、渲染失败或请求体超过 64 KiB 都会丢弃事件，投递失败也
绝不改变请求的判定结果。超时时间默认 `2s`，取值范围为 `500ms` 到 `30s`。

## 单个 Sandbox 的规则

规则链可以通过 `agents.kruise.io/security-rules` 注解绑定到单个 Sandbox，注解中的规则对象与 `spec.rules` 完全
一致。单个 Sandbox 的规则会在选择器匹配的策略之后评估。E2B 创建 API 通过保留的
`e2b.agents.kruise.io/security-rules` metadata 字段暴露该注解，详见
[E2B 网络访问控制](./e2b-network-controls.md)。

单个 Sandbox 的规则遵循与策略相同的编译约定。若某个 Sandbox 的注解编译失败，在已有规则时会保留上一版规则，
否则不生效任何规则，并通过 `scope="pod"` 下的 `epe_profile_stale` 和 `epe_profile_unenforced` 指标上报。

## 限制说明

- EPE 只对被路由到网关的流量生效。走直接透传路径的请求不会被检查，`SecurityProfile` 也无法强制它经过 EPE。
- HTTPS 检查要求网关为该主机名终止 TLS、配置签发 CA，并且工作负载信任该 CA。否则连接会停留在网关的 TCP 路径
  上，绕过 HTTP 过滤器链。
- EPE 依赖网关以外部处理属性下发的调用方身份。身份缺失时，EPE 无法选择策略，请求会原样放行。请通过真实流量
  验证策略是否生效，而不是通过 `kubectl get`。
- 任何编译期错误都会拒绝新版本策略并保留上一个已知可用版本。若此前没有可用版本，被选中的 Pod 将不受该策略
  保护。
- 以 root 运行，或具备 `NET_ADMIN`、`SYS_ADMIN` 等能力的容器可以绕过 ACL。除出口策略外，还应通过独立的网络隔离
  机制隔离 Sandbox，例如 Kubernetes 网络策略、主机防火墙规则，或在基础设施层限制 Sandbox 出站流量的云安全组规则。
- TrafficProxy Sidecar 会占用 `15001`、`15006`、`15012`、`15020`、`15021` 和 `15090` 端口，并以 UID/GID
  `1337` 运行。Sandbox 容器不能绑定这些端口；来自 UID `1337` 的出站流量会跳过检查，以避免形成自拦截循环。
- 客户端可以伪造 `Host` 头以规避四层规则。可通过在 `SecurityProfile` 中显式拒绝敏感域名来缓解。
- `mcpToolPolicy` 会缓存完整请求体。解码后超过 8 MiB 的请求体、JSON-RPC 批量请求以及不支持的内容编码都视为
  不可读，并按 `defaultAction` 处理。支持的 MCP 协议版本为 `2025-06-18`、`2025-11-25` 和 `2026-07-28`。
- EPE 是每个网关路由请求上的一个网络跳点，因此应独立于网关评估其 Deployment 的容量，并监控其日志和指标。

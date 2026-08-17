# Sandbox ID

OpenKruise Agents 中的每个沙箱都通过 **Sandbox ID** 来标识。默认情况下，ID 由底层 `Sandbox` CR 的 Kubernetes namespace
和名称拼接而成。此外，还可以启用可选的 **短 Sandbox ID**：新交付的沙箱会获得一个短小且稳定的标识符，避免因过长而无法放入 E2B
的 DNS 主机名。

短 Sandbox ID 自 **v0.7.0** 起支持。关于开启该特性前后旧版 ID 的行为，请参考[旧版 ID 兼容性](#旧版-id-兼容性)。

## 旧版 Sandbox ID

不做任何额外配置时，沙箱 ID 的格式为：

```text
<namespace>--<sandbox-name>
```

例如，namespace `default` 下名为 `demo` 的 `Sandbox`，其 ID 为 `default--demo`。

这种格式可读性好，但长度会随着两个 Kubernetes 名称的增长而变长。E2B 原生流量会把 Sandbox ID 嵌入域名 （
`https://<port>-<sandboxID>.<domain>`），即使 namespace 和沙箱名称本身都合法，拼出的地址仍可能超出 DNS label 的长度限制。

## 短 Sandbox ID

启用后，每次成功的 [Claim](./sandbox-claim.md) 或 Clone 交付都会为沙箱分配一个如下格式的短 ID：

```text
<operator-prefix><13-character suffix>
```

例如，前缀配置为 `prod-` 时，某个被认领的沙箱可能获得：

```text
prod-aae57hpxaaqac
```

后缀固定为 13 个字符，由 sandbox-manager 生成，仅包含小写字母 `[a-z2-7]`。分配出的 ID 会以系统保留 label 的形式持久化在
`Sandbox` CR 上：

```yaml
metadata:
  labels:
    agents.kruise.io/sandbox-id: aae57hpxaaqac
```

关键特性：

- **同一时刻只有一个生效 ID。** 沙箱不会同时持有旧版 ID 和短 ID；短 ID 一旦分配，就是本次交付中唯一的 ID。
- **同一次交付内保持稳定。** ID 标识的是一次用户交付，而不是可复用的 `Sandbox` CR。同一次交付内的休眠、唤醒、
  更新和 [Checkpoint](./checkpoint.md) 操作都不会改变 ID；沙箱被回收进预热池时，该 ID 随之失效。
- **克隆总是获得全新 ID。** 从沙箱或 Checkpoint 克隆时不会继承源沙箱的 ID，每个克隆都会获得新分配的 ID。
- **短 ID 不可反解。** Sandbox ID 只用于精确匹配，无法从短 ID 还原出 namespace 和名称；如需定位底层 CR，请使用下文的 label
  查询方式。
- **不做后台迁移。** 存量的未打标沙箱继续使用旧版 ID，label 只在沙箱成功被认领或克隆时写入。

### 保留 label

`agents.kruise.io/sandbox-id` 由 sandbox-manager 独占管理：

- E2B 兼容请求会拒绝用户传入 `agents.kruise.io/` 前缀下的任何 label，客户端无法伪造或覆盖 Sandbox ID。
- 从资源池或模板创建沙箱时，不会把该 label 复制到新沙箱上。
- 当前交付结束时，回收流程会清除该 label。

请勿绕过系统手动修改这个 label，它只应由受支持的流程写入。

## 启用短 Sandbox ID

短 ID 分配 **默认关闭**，由 sandbox-manager 的两个启动参数控制：

| 参数                        | 默认值  | 说明                                       |
|-----------------------------|---------|--------------------------------------------|
| `--enable-short-sandbox-id` | `false` | 为成功认领或克隆的沙箱分配短 ID            |
| `--short-sandbox-id-prefix` | `""`    | 拼接在每个新分配短 ID 前面的前缀，原样使用 |

例如：

```shell
sandbox-manager --enable-short-sandbox-id=true --short-sandbox-id-prefix=prod- ...
```

前缀和后缀之间不会自动插入分隔符：如果希望对外呈现 `prod-`，需要在配置值里自带连字符。所有 sandbox-manager 副本必须使用相同的前缀。

### 前缀规则

非空前缀必须满足：

- 以小写字母或数字开头；
- 其余字符只能是小写字母、数字和连字符；
- 不能包含旧版 ID 的分隔符 `--`，使短 ID 与旧版 ID 两种格式不会混淆；
- 长度不超过 **50 个字符**，保证前缀加 13 字符后缀后仍在 Kubernetes label 值的 63 字符上限内。

此外还有两点部署约束：

- 使用 E2B 原生动态域名（`<port>-<sandbox-id>.<domain>`）时，前缀应控制在 **44 个字符以内**， 确保五位端口号、分隔符和 ID
  能放进同一个 DNS label。定制化 `/kruise/*` 路径不受此限制。
- 新旧版本 sandbox-manager 混合滚动升级期间，前缀应控制在 **37 个字符以内**。

即使未启用分配，前缀也会在启动时校验。修改前缀只影响之后新交付的沙箱，已有 label 不会重新生成。

## 旧版 ID 兼容性

短 ID 是一个增量特性：旧版 `<namespace>--<name>` 格式继续得到完整支持，也不会有后台迁移去改写存量沙箱。

### ID 解析规则

所有组件都按同样的两个分支解析沙箱当前的 ID：

| Sandbox 元数据                       | 解析出的 ID             |
|--------------------------------------|-------------------------|
| label `agents.kruise.io/sandbox-id` 非空 | 原样使用该 label 的值   |
| label 缺失或为空                     | `<namespace>--<name>`   |

查找、路由和鉴权路径都把 Sandbox ID 当作精确匹配的不透明值。服务端不会反解旧版 ID 来还原 namespace
和名称；namespace/name 诊断信息只会通过[通过 ID 查询沙箱](#通过-id-查询沙箱)中描述的授权渠道补充。

### 开启前：分配关闭

这是默认行为，与没有短 ID 支持的版本完全一致：

- 所有沙箱都使用旧版 ID，Claim 和 Clone 不会写入 label。
- 沙箱被回收后 namespace/name 不变，因此同一个 `Sandbox` CR 的每次交付都继续使用同一个旧版 ID。
- 由于旧版 ID 以 `--` 作为分隔符，在旧版 ID 仍受支持期间，包含 `--` 的 namespace 依然不受支持。

### 开启后：分配启用

- **存量未打标沙箱继续使用旧版 ID。** 没有后台迁移；在沙箱再次被认领或克隆之前，其旧版 ID 在查找、
  路由和客户端连接中始终有效。
- **Claim 和 Clone 原子地切换 ID。** 沙箱成功被认领或克隆时，系统分配新的短 ID，旧版 ID 在同一步骤内
  随即失效：继续使用旧版 ID 的请求会收到 not-found。一个沙箱同一时刻只有一个生效 ID，旧版 ID 和短 ID
  不会同时作为两个别名存在。
- **直接创建的 `Sandbox` CR**（不经过 Claim/Clone）不会获得 label，会一直使用旧版 ID。
- **回收会清除 label。** 已打标的沙箱回到预热池时，其短 ID 失效，沙箱以未打标状态入池并重新解析为
  旧版 ID，直到下一次交付分配新的短 ID。

开关只决定 *新交付*的沙箱写入哪种 ID，不会改变活跃沙箱的读取方式：

| 分配状态 | 未打标的池化沙箱 | 此前已打标的池化沙箱          |
|----------|------------------|-------------------------------|
| 关闭     | 使用旧版 ID      | 旧 ID 失效，新交付使用旧版 ID |
| 开启     | 获得新的短 ID    | 旧 ID 被新的短 ID 替换        |

关闭 `--enable-short-sandbox-id` 可以安全地停止分配新的短 ID，但这并不会回滚已有数据：

- 已打标的活跃沙箱在本次交付结束前继续使用短 ID。
- 沙箱被回收、重新入池之前，其 label 会被清除。
- 之后在关闭状态下发起的认领，继续使用旧版 ID。

由于旧版 ID 由可复用的 namespace/name 派生，同一个 `Sandbox` CR 被多次复用时，关闭模式下每次交付的 ID 都相同。如果业务上要求每次交付的
ID 唯一，启用后请不要再次关闭分配。

### 行为对照表

| 场景                          | 分配关闭                         | 分配启用               |
|-------------------------------|----------------------------------|------------------------|
| 新 Claim / Clone 返回的 ID    | 旧版 ID                          | 新分配的短 ID          |
| 用旧版 ID 查找未打标沙箱      | 可用                             | 可用                   |
| 用旧版 ID 查找已打标沙箱      | 不涉及                           | 查不到，需使用短 ID    |
| 回收沙箱再次交付              | 仍是同一个旧版 ID                | 每次交付都是新的短 ID  |
| E2B 动态主机名长度            | 名称较长时可能超出 DNS 限制      | 始终在 DNS 限制内      |

### 客户端使用建议

- 请把 Sandbox ID 当作不透明字符串，不要按 `--` 拆分或从 ID 推导 namespace 和名称；一旦沙箱获得短 ID，
  这类逻辑就会失效。
- 如果流程中确实需要 namespace 和名称，请使用 E2B 兼容 API 返回的
  `e2b.agents.kruise.io/sandbox-resource` 元数据，或通过 `kubectl` 查询保留 label。
- 直接接收 namespace 和名称的 SDK 路径（如 runtime 客户端的
  `newFromK8s(namespace, sandboxName, ...)`）不受该特性影响。
- 开启前持久化的 ID（例如业务记录或 Checkpoint 中的 ID）在对应交付存续期间始终有效，不会被改写。

## 通过 ID 查询沙箱

短 ID 无法反解出对应的 CR，可以通过保留 label 查询：

```shell
kubectl get sbx -A -l agents.kruise.io/sandbox-id=<sandbox-id>
```

### E2B 诊断信息

使用短 ID 时，E2B 兼容响应有意不暴露 namespace 和名称。只有在沙箱查找成功且通过归属鉴权之后，这些信息才会补充到响应中：

- 成功返回的沙箱元数据中会包含
  `e2b.agents.kruise.io/sandbox-resource: <namespace>/<name>`。
- 来自下游 runtime、网关、Checkpoint 和生命周期操作的错误信息会附加
  `sandboxResource=<namespace>/<name>`。

未找到和未授权的响应不会泄露 namespace 或名称。

## 上线与回滚

推荐按以下阶段上线：

1. 先升级到能够识别 `agents.kruise.io/sandbox-id` label 的 sandbox-manager 和 sandbox-gateway 镜像，此时短 ID 分配保持
   **关闭**。这一阶段两个组件可以按任意顺序滚动升级。
2. 排空旧副本及其在途流量。
3. 确认新副本的 informer 已完成同步。
4. 在 sandbox-manager 上启用 `--enable-short-sandbox-id`。

回滚注意事项：

- 一旦集群中已有沙箱持久化了短 ID，就不要回滚到不识别该 label 的旧版本：旧版本会把 ID 重新拼成旧版格式， 与已持久化的短 ID
  不一致。
- 如果集群中曾有旧版本 sandbox-manager 在相同前缀下生成过短 ID（早期实现采用不同的编码布局），在启用当前
  实现前，请改用该集群从未使用过的新前缀。

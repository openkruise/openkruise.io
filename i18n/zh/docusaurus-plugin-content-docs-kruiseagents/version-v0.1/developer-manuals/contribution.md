# 为 OpenKruise Agents 做贡献

## 开发环境

作为贡献者，如果您想为 OpenKruise Agents 做出任何贡献，我们应该对开发环境中使用的工具版本达成一致。以下是一些具有特定版本的依赖项：

对于 agent-sandbox-controller：

- Golang : v1.24+
- kubernetes: v1.28+

> 您可以使用 `go mod vendor` 来避免由 go mod list 失败导致的 IDE 崩溃。

## 开发指南

### 生成代码和清单

如果修改了 API，您必须运行以下命令来生成代码和清单。

```bash
# 生成代码和清单，例如 CRD、RBAC YAML 文件等
make generate manifests
```

### 运行测试

您可以使用命令 `make test` 来运行单元测试。

对于 JetBrains IDE 用户，您可以找到一些预配置的配置来直接运行测试。它们存储在 [.run](https://github.com/openkruise/agents/blob/master/.run) 目录中。

### 构建镜像

OpenKruise Agents 由两个组件组成：

- agent-sandbox-controller：一个用于 agent CRD 的 k8s operator，包括 Sandbox、SandboxSet 等。
- sandbox-manager：一个用于沙箱管理的服务器，兼容 E2B API。

您可以使用以下命令通过 [Dockerfiles](https://github.com/openkruise/agents/blob/master/dockerfiles) 构建镜像。

```shell
make docker-build-controller # 构建 agent-sandbox-controller
make docker-build-manager # 构建 sandbox-manager
make docker-build-runtime # 构建 agent-runtime
```

### 部署到 Kubernetes

建议通过 kustomize 将 OpenKruise Agents 部署到 Kubernetes 集群进行测试。任何 Kubernetes 集群都可以，但我们推荐使用 [kind](https://kind.sigs.k8s.io/) 创建本地集群。

1. 使用您自己的镜像修改以下补丁文件。
    1. [agent-sandbox-controller](https://github.com/openkruise/agents/blob/master/config/default/image_patch.yaml)
    2. [sandbox-manager](https://github.com/openkruise/agents/blob/master/config/sandbox-manager/image_patch.yaml)
2. 部署组件
   ```shell
   make deploy-agent-sandbox-controller
   make deploy-sandbox-manager
   ```

#### 通过 E2B 客户端测试 OpenKruise Agents

建议使用定制客户端通过自定义 e2b 协议接入，以避免通配符域名解析和证书的复杂性。

1. 创建一个名为 `code-interpreter` 的 [SandboxSet](https://github.com/openkruise/agents/blob/master/examples/code_interpreter/sandboxset.yaml) 作为 E2B 模板
   ```shell
   kubectl apply -f examples/code_interpreter/sandboxset.yaml
   ```

2. 安装 [E2B](https://e2b.dev) python SDK
   ```shell
   pip install e2b-code-interpreter
   ```

3. 端口转发 sandbox-manager
   ```shell
   sudo kubectl port-forward services/sandbox-manager 80:7788 -n sandbox-system
   ```

4. 创建一个新终端，并设置环境变量
   ```shell
   export E2B_DOMAIN=localhost
   export E2B_API_KEY=some-api-key # 在 config/sandbox-manager/configuration_patch.yaml 中配置
   ```

5. 使用定制客户端（参考此文档）
    1. 将 [patch_e2b.py](https://github.com/openkruise/agents/blob/master/sdk/customized_e2b/kruise_agents/patch_e2b.py) 复制到您的 python 项目中
    2. 在使用 E2B SDK 之前对其进行补丁
       ```python
       from patch_e2b import patch_e2b
       from e2b_code_interpreter import Sandbox
       
       patch_e2b(False)
       with Sandbox.create(template="code-interpreter") as sbx:
           sbx.run_code("print('hello world')")
       ```

## 提案

如果您打算贡献一个带有新 API 的功能或需要付出重大努力，请先在 [./docs/proposals/](https://github.com/openkruise/agents/blob/master/docs/proposals) 中提交提案。


# 运行 AgentScope Agent

本示例演示如何使用内置的 Kruise Deployer 将 AgentScope Runtime Agent 部署为 **Kruise Sandbox 自定义资源**（`agents.kruise.io/v1alpha1`）。

> **[Original link](https://github.com/agentscope-ai/agentscope-runtime/tree/main/examples/deployments/kruise_deploy)**

## 概述

`app_deploy_to_kruise.py` 脚本展示了如何：
- 配置用于存储 Docker 镜像的容器镜像仓库
- 设置 Kubernetes 连接和命名空间
- 使用 AgentApp 通过 endpoint 部署一个 LLM Agent
- 自动创建 LoadBalancer 类型的 Service 以供外部访问
- 通过 endpoint 测试已部署的服务
- 使用完毕后清理资源（Kruise Sandbox CR + Service）

## 前置条件

在运行本示例之前，请确保满足以下条件：

1. **Kubernetes 集群访问**：拥有一个正在运行的 Kubernetes 集群，并已配置好 kubectl
2. **已安装 Sandbox CRD**：集群中必须已安装 Sandbox CRD（`agents.kruise.io/v1alpha1`）
3. **容器镜像仓库访问权限**：可以访问容器镜像仓库（Docker Hub、ACR 等）
4. **Python 环境**：已安装 Python 3.10+ 并安装了 agentscope-runtime
5. **API Keys**：已准备好 LLM 提供商所需的 API Key（如 Qwen 所需的 `DASHSCOPE_API_KEY`）

## 环境准备

1. **安装依赖**：
   ```bash
   pip install "agentscope-runtime[ext]>=1.0.0"
   ```

2. **设置环境变量**：
   ```bash
   export DASHSCOPE_API_KEY="your-api-key"
   ```

3. **配置 Kubernetes 访问**：
   确保 `kubeconfig` 已正确配置：
   ```bash
   kubectl cluster-info
   ```

4. **验证 Kruise Sandbox 已安装**：
   **`Kruise Agents`**：https://github.com/openkruise/agents
   ```bash
   kubectl get crd sandboxes.agents.kruise.io
   ```

## 配置参数

### 镜像仓库配置

```python
registry_config = RegistryConfig(
    registry_url="your-registry-url",
    namespace="your-namespace",
)
```

- **`registry_url`**：Docker 镜像将被推送到的容器镜像仓库地址
    - 示例：`docker.io`、`gcr.io/project-id`、`your-registry.com`
- **`namespace`**：镜像仓库中用于组织镜像的命名空间/仓库名

### Kubernetes 配置

```python
k8s_config = K8sConfig(
    k8s_namespace="agentscope-runtime",
    kubeconfig_path="your-kubeconfig-local-path",
)
```

- **`k8s_namespace`**：资源将被部署到的 Kubernetes 命名空间
- **`kubeconfig_path`**：kubeconfig 文件路径（为 None 时使用默认的 kubectl 配置）

### 运行时配置

```python
runtime_config = {
    "resources": {
        "requests": {"cpu": "200m", "memory": "512Mi"},
        "limits": {"cpu": "1000m", "memory": "2Gi"},
    },
    "image_pull_policy": "IfNotPresent",
    # 可选：
    # "node_selector": {"node-type": "gpu"},
    # "tolerations": [...]
}
```

#### 资源管理
- **`requests`**：容器保证获得的资源
    - `cpu`：CPU 单位（200m = 0.2 个 CPU 核）
    - `memory`：内存分配（512Mi = 512 MB）
- **`limits`**：容器可使用的最大资源
    - `cpu`：最大 CPU（1000m = 1 个 CPU 核）
    - `memory`：最大内存（2Gi = 2 GB）

#### 镜像拉取策略
- **`IfNotPresent`**：仅当本地不存在镜像时才拉取
- **`Always`**：始终拉取最新镜像
- **`Never`**：从不拉取镜像（仅使用本地镜像）

### Kruise 配置

```python
kruise_config = {
    # 基础设置
    "port": "8080",
    "image_tag": "linux-amd64-1",
    "image_name": "agent_app",
    "annotations": {},
    "labels": {},

    # 依赖
    "requirements": ["agentscope", "fastapi", "uvicorn"],
    "extra_packages": [
      os.path.join(os.path.dirname(__file__), "others", "other_project.py"),
    ],
    "base_image": "python:3.10-slim-bookworm",

    # 环境变量
    "environment": {
        "PYTHONPATH": "/app",
        "LOG_LEVEL": "INFO",
        "DASHSCOPE_API_KEY": os.environ.get("DASHSCOPE_API_KEY"),
    },

    # 运行时与部署
    "runtime_config": runtime_config,
    "deploy_timeout": 300,
    "health_check": True,
    "platform": "linux/amd64",
    "push_to_registry": True,
}
```

#### 基础配置
- **`port`**：Web 服务使用的容器端口
- **`image_tag`**：Docker 镜像的 tag 标识
- **`image_name`**：Docker 镜像的基础名称
- **`annotations`**：Kruise Sandbox CR 的 annotations
- **`labels`**：Kruise Sandbox CR 的 labels（Deployer 会自动添加 `app: <resource_name>` 作为 Service 的 selector）

#### 依赖配置
- **`requirements`**：通过 pip 安装的 Python 包
- **`extra_packages`**：额外包含到镜像中的本地 Python 文件
- **`base_image`**：基础 Docker 镜像（Python 运行时）

#### 部署设置
- **`deploy_timeout`**：等待沙箱就绪的最大时长（秒）
- **`platform`**：目标平台架构
- **`push_to_registry`**：是否将构建好的镜像推送到镜像仓库

## 执行部署

1. **自定义配置**：
   编辑 `app_deploy_to_kruise.py` 以匹配你的环境：
    - 将 `registry_url` 更新为你的容器镜像仓库
    - 如有需要，修改 `k8s_namespace`
    - 根据集群容量调整资源配额
    - 设置合适的环境变量

2. **运行部署**：
   ```bash
   cd examples/deployments/kruise_deploy
   python app_deploy_to_kruise.py
   ```

3. **监控部署**：
   脚本会输出：
    - Deploy ID 和状态
    - 用于访问 Agent 的 Service URL
    - Kubernetes 中的资源名称
    - 用于验证的测试命令

4. **测试已部署的服务**：
   ```bash
   # 健康检查
   curl http://your-service-url/health

   # 同步请求
   curl -X POST http://your-service-url/sync \
     -H "Content-Type: application/json" \
     -d '{"input": [{"role": "user", "content": [{"type": "text", "text": "Hello!"}]}], "session_id": "123"}'

   # 异步请求
   curl -X POST http://your-service-url/async \
     -H "Content-Type: application/json" \
     -d '{"input": [{"role": "user", "content": [{"type": "text", "text": "Hello!"}]}], "session_id": "123"}'

   # 流式请求
   curl -X POST http://your-service-url/stream_async \
     -H "Content-Type: application/json" \
     -H "Accept: text/event-stream" \
     --no-buffer \
     -d '{"input": [{"role": "user", "content": [{"type": "text", "text": "Tell me a story"}]}], "session_id": "123"}'
   ```

5. **查看 Kubernetes 资源**：
   ```bash
   kubectl get sandbox -n agentscope-runtime
   kubectl get svc -n agentscope-runtime
   kubectl get pods -n agentscope-runtime
   kubectl logs -l app=<resource_name> -n agentscope-runtime
   ```

6. **清理**：
   脚本会提示你按下 Enter 自动清理资源。
   你也可以使用 CLI：
   ```bash
   agentscope stop <deploy_id>
   ```

## 故障排查

### 常见问题

1. **未找到 Kruise Sandbox CRD**：
   ```bash
   kubectl get crd sandboxes.agents.kruise.io
   # 如果不存在，请先安装 Kruise Sandbox Operator
   ```

2. **镜像仓库认证**：
   ```bash
   docker login your-registry-url
   ```

3. **Kubernetes 权限**：
   ```bash
   kubectl auth can-i create sandboxes.agents.kruise.io --namespace=agentscope-runtime
   ```

4. **资源限制**：
   ```bash
   kubectl describe nodes
   kubectl get resourcequota -n agentscope-runtime
   ```

5. **镜像拉取错误**：
   ```bash
   kubectl describe pod <pod-name> -n agentscope-runtime
   ```

### 日志与调试

- 查看 Pod 日志：`kubectl logs <pod-name> -n agentscope-runtime`
- 查看 Kruise Sandbox 详情：`kubectl describe sandbox <name> -n agentscope-runtime`
- 检查 Service endpoints：`kubectl get endpoints -n agentscope-runtime`

## 文件结构

- `app_deploy_to_kruise.py`：基于 AgentApp 并包含多个 endpoint 的主部署脚本
- `kruise_deploy_config.yaml`：YAML 配置示例
- `kruise_deploy_config.json`：JSON 配置示例

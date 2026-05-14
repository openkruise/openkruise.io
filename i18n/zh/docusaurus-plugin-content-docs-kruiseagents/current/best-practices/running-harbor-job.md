# 在 ACK 上运行 Harbor 任务

## 1. 基础环境

使用以下基础镜像启动你的容器实例， 作为Harbor的开发环境：

```
alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/python:3.11.1
```

> 该镜像已预装 Python 3.11。Harbor 要求 Python >= 3.12，将通过 `uv` 进行安装。

## 2. 环境初始化

> **版本要求：** 必须使用 `feat/add-ack-environment` 分支：  
> https://github.com/alibaba/harbor/tree/feat/add-ack-environment

在你的实例上执行以下命令来初始化环境：

```bash
yum install git vim -y
curl -LsSf https://astral.sh/uv/install.sh | sh
curl -sL "https://github.com/moby/buildkit/releases/download/v0.18.2/buildkit-v0.18.2.linux-amd64.tar.gz" | \
    tar -xz -C /usr/local/bin --strip-components=1 bin/buildctl

git clone https://github.com/alibaba/harbor.git
cd harbor
git checkout feat/add-ack-environment
source $HOME/.local/bin/env
uv venv --python=3.12
source .venv/bin/activate
uv pip install -e .
uv pip install kubernetes
export BAILIAN_API_KEY=<YOUR API KEY>
mkdir ~/.kube
cat > ~/.kube/config << EOF
apiVersion: v1
clusters:
- cluster:
   ...
EOF
```

## 3. 启动 BuildKit 服务（可选）

如果使用 BuildKit 进行镜像构建（推荐），请在你的实例上启动 BuildKit 守护进程：

```bash
# 安装 buildkitd
curl -sL "https://github.com/moby/buildkit/releases/download/v0.18.2/buildkit-v0.18.2.linux-amd64.tar.gz" | \
    tar -xz -C /usr/local/bin --strip-components=1 bin/buildkitd

# 启动 BuildKit 守护进程（监听 1234 端口）
buildkitd --addr tcp://0.0.0.0:1234 &
```

## 4. 提交 Harbor 任务

环境准备就绪后，提交一个 SWE-Bench Verified 评测任务：

```bash
OPENAI_API_KEY=$BAILIAN_API_KEY \
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1 \
harbor run \
  -d swe-bench/swe-bench-verified \
  -a swe-agent \
  --ak total_cost_limit=0 \
  --ak per_instance_cost_limit=0 \
  -m openai/qwen-max \
  -e ack \
  --ek kubeconfig=~/.kube/config \
  --ek namespace=default \
  --ek registry=registry.cn-hongkong.aliyuncs.com/swe-bench \
  --ek use_sandbox_claim=true \
  --ek use_buildkit=true \
  --ek buildkit_address=tcp://<buildkit service> \
  --ek image_pull_secret=acr-registry \
  -n 1 \
  -l 1 \
  --force-build \
  --debug
```

### 参数说明

| 参数 | 说明                                          |
|-----------|------------------------------------------------------|
| `-d swe-bench/swe-bench-verified` | 数据集：SWE-Bench Verified                          |
| `-a swe-agent` | Agent：SWE-Agent                                     |
| `--ak total_cost_limit=0` | 取消总成本限制（无限制）                  |
| `--ak per_instance_cost_limit=0` | 取消单实例成本限制（无限制）           |
| `-m openai/qwen-max` | 模型：通过百炼 OpenAI 兼容接口调用 Qwen-Max |
| `-e ack` | 环境类型：ACK（Kubernetes）                   |
| `--ek kubeconfig=~/.kube/config` | K8s kubeconfig 路径                                  |
| `--ek namespace=default` | K8s 命名空间                                        |
| `--ek registry=...` | 镜像仓库地址（香港 ACR）                   |
| `--ek use_sandbox_claim=true` | 启用 OpenKruise SandboxClaim 以使用预热沙箱    |
| `--ek use_buildkit=true` | 启用 BuildKit 进行镜像构建                   |
| `--ek buildkit_address=...` | BuildKit 守护进程地址                              |
| `--ek image_pull_secret=acr-registry` | 私有镜像仓库拉取凭证名称                    |
| `-n 1` | 并发试验数                          |
| `-l 1` | 仅运行 1 个任务（用于调试）                      |
| `--force-build` | 强制重新构建镜像                              |
| `--debug` | 启用调试日志                                 |


:::info 版本
* `--ek use_sandbox_claim=true` 是启用 openkruise agents 的关键参数
* `-e ack` 表示在 ACK 集群中运行 openkruise agents
:::

# Running Harbor Job in ACK

## 1. Base Environment

Start your container instance for development using the following base image:

```
alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/python:3.11.1
```

> This image comes with Python 3.11 pre-installed. Harbor requires Python >= 3.12, which will be installed via `uv`.

## 2. Environment Initialization

> **Version requirement:** You must use the `feat/add-ack-environment` branch:  
> https://github.com/alibaba/harbor/tree/feat/add-ack-environment

Run the following commands on your instance to set up the environment:

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

## 3. Start BuildKit Service (Optional)

If using BuildKit for image building (recommended), start the BuildKit daemon on your instance:

```bash
# Install buildkitd
curl -sL "https://github.com/moby/buildkit/releases/download/v0.18.2/buildkit-v0.18.2.linux-amd64.tar.gz" | \
    tar -xz -C /usr/local/bin --strip-components=1 bin/buildkitd

# Start BuildKit daemon (listening on port 1234)
buildkitd --addr tcp://0.0.0.0:1234 &
```

## 4. Submit a Harbor Job

Once the environment is ready, submit a SWE-Bench Verified evaluation job:

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

### Parameter Reference

| Parameter | Description                                          |
|-----------|------------------------------------------------------|
| `-d swe-bench/swe-bench-verified` | Dataset: SWE-Bench Verified                          |
| `-a swe-agent` | Agent: SWE-Agent                                     |
| `--ak total_cost_limit=0` | Remove total cost limit (unlimited)                  |
| `--ak per_instance_cost_limit=0` | Remove per-instance cost limit (unlimited)           |
| `-m openai/qwen-max` | Model: Qwen-Max via Bailian OpenAI-compatible endpoint |
| `-e ack` | Environment type: ACK (Kubernetes)                   |
| `--ek kubeconfig=~/.kube/config` | K8s kubeconfig path                                  |
| `--ek namespace=default` | K8s namespace                                        |
| `--ek registry=...` | Image registry URL (Hong Kong ACR)                   |
| `--ek use_sandbox_claim=true` | Enable OpenKruise SandboxClaim for warm sandboxes    |
| `--ek use_buildkit=true` | Enable BuildKit for image building                   |
| `--ek buildkit_address=...` | BuildKit daemon address                              |
| `--ek image_pull_secret=acr-registry` | Private registry pull secret name                    |
| `-n 1` | Number of concurrent trials                          |
| `-l 1` | Run only 1 task (for debugging)                      |
| `--force-build` | Force rebuild the image                              |
| `--debug` | Enable debug logging                                 |


:::info Version
* `--ek use_sandbox_claim=true` is the key to enable openkruise agents
* `-e ack` running openkruise agents in ACK cluster
:::
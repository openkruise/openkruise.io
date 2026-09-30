---
title: Running E2B Code Interpreter Sandbox
---

This tutorial demonstrates how to deploy an [E2B](https://e2b.dev/) code-interpreter sandbox through OpenKruise Agents
and invoke it end-to-end with the E2B Python SDK. Every command and snippet on this page can be copied and executed
as-is; only the `<placeholders>` need to be resolved first.

## Prerequisites

- OpenKruise Agents (Sandbox Controller, Sandbox Manager, Sandbox Gateway) is installed and has passed all checks in
  [Installation](../installation.md). Keep the `e2b.adminApiKey` you installed with — it is the `E2B_API_KEY` used
  below.
- Python 3.9 or newer on the machine that runs the SDK (`python3 --version`).
- A bash shell (Linux, macOS, or WSL).
- Network reachability: the template step pulls images from Docker Hub (`e2bdev/code-interpreter`,
  `openkruise/agent-runtime`) and the manifest from `raw.githubusercontent.com`; the SDK install reaches PyPI and
  `github.com`. Nodes in mainland China that cannot reach Docker Hub need a mirror/registry workaround first.

## 1. Deploy a sandbox template (SandboxSet)

Sandboxes are created from **templates**. A template is simply a `SandboxSet`: `sandbox-manager` automatically
recognizes every `SandboxSet` in the cluster as a template whose name equals the `SandboxSet` name (here:
`code-interpreter`). Deploying the template pre-warms sandbox instances so that `Sandbox.create` returns in
sub-second time.

### 1.1 Download and adjust the SandboxSet manifest

```bash
# Download the official example (requires access to raw.githubusercontent.com)
curl -L -o sandboxset.yaml \
  https://raw.githubusercontent.com/openkruise/agents/master/examples/code_interpreter/sandboxset.yaml
```

**Adjust `storageClassName` before applying (required on most clusters).** The example was written for Alibaba Cloud
and pins `storageClassName: alicloud-disk-ssd` inside `volumeClaimTemplates`. On any other cluster the PVC stays
`Pending` and the pre-warm Pods never start. List the storage classes available in your cluster:

```bash
kubectl get storageclass
```

Then edit `sandboxset.yaml`:

- Replace `alicloud-disk-ssd` with a storage class from the list (for example `standard` on kind, `gp2`/`gp3` on
  AWS), or delete it entirely to use the default storage class.
- If the cluster has no dynamic storage provisioning at all, delete the whole `volumeClaimTemplates` block — the
  volume is not mounted by any container in this example, so removing it does not affect the tutorial.

> The manifest uses two images from Docker Hub: `openkruise/agent-runtime:preview-v0.0.2` (an init container that
> injects the E2B `envd` component) and `e2bdev/code-interpreter:latest` (the sandbox runtime). Make sure your nodes
> can pull both.

### 1.2 Apply and wait for pre-warming

```bash
kubectl apply -f sandboxset.yaml

# Watch until READY reaches 2/2 (Ctrl+C stops watching):
kubectl get sandboxset code-interpreter -w
```

The example pre-warms 2 replicas. Confirm both are running before continuing:

```bash
kubectl get sandboxes
```

### 1.3 Using custom images

`agent-runtime` provides E2B-compatible interfaces that support its command execution, file operations, code running,
and other functions. If the official images do not meet your requirements, you can replace them with custom images.

### 1.4 Cross-namespace template deployment

To reduce cluster load during large-scale pre-warming, you can deploy templates across namespaces by creating
identically named `SandboxSet` resources in each target namespace.

## 2. Connect the E2B SDK

### 2.1 Choose an access method

The examples below use `run_code` and other code-interpreter extensions, which **require** the `E2B_DOMAIN` +
private-protocol patch integration — the `E2B_API_URL`/`E2B_SANDBOX_URL` style does not support them (see the
limitation notes in [E2B SDK integration](../user-manuals/e2b-client.md)).

**Option A — quick verification with `kubectl port-forward` (no domain, DNS, or certificate needed).** Keep this
running in its own terminal (on Linux, binding port 80 requires `sudo`):

```bash
kubectl port-forward service/agents-sandbox-manager 80:7788 -n sandbox-system
```

In a second terminal, configure the client:

```shell
# The port-forward target is the manager Service; localhost is used as the E2B domain
export E2B_DOMAIN=localhost
export E2B_API_KEY=<your-api-key>   # the e2b.adminApiKey set during installation
```

**Option B — production with a real domain.** Export `E2B_DOMAIN=your.domain.com` with DNS and a TLS certificate in
place, as described for private-protocol HTTPS access in [E2B SDK integration](../user-manuals/e2b-client.md).

### 2.2 Install the SDKs

```bash
python3 -m venv .venv && source .venv/bin/activate

# The versions used by the daily E2E regression of sandbox-manager:
pip install "e2b==2.8.1" "e2b-code-interpreter==2.4.1"

# The OpenKruise private-protocol patch (requires access to github.com):
pip install "git+https://github.com/openkruise/agents-api.git@v0.6.0-alpha2#subdirectory=e2b/python"
```

### 2.3 Preamble required by every example

Run this once at the start of each script, before creating or connecting any sandbox:

```python
import os

from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

# Stock E2B SDKs validate locally that keys start with "e2b_"; OpenKruise admin keys
# do not. encode_for_e2b_sdk wraps the key deterministically (the server unwraps it;
# the raw key keeps working for other clients).
os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])

# Port-forward serves plain HTTP, hence https=False. A production domain with TLS
# uses https=True instead.
patch_e2b(https=False)
```

`patch_e2b` rewrites the SDK URLs in memory to the OpenKruise private protocol (management API under
`<E2B_DOMAIN>/kruise/api`, sandbox traffic under `<E2B_DOMAIN>/kruise/<sandbox-id>/<port>`); no E2B code is modified
on disk. With `e2b>=2.25.0` you may pass `validate_key=False` to `patch_e2b` instead of wrapping the key.

## 3. Run the examples

### 3.1 Create and delete a sandbox

Allocates a sandbox from the pre-warmed pool. Upon completion of allocation, the `SandboxSet` immediately creates a
new sandbox instance for replenishment.

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

# The template name must match the SandboxSet name
sbx = Sandbox.create(template="code-interpreter", timeout=300)
print(f"sandbox id: {sbx.sandbox_id}")

sbx.kill()
print(f"sandbox {sbx.sandbox_id} killed")
```

Expected output (ids differ):

```text
sandbox id: i1234567890abcdef
sandbox i1234567890abcdef killed
```

### 3.2 Execute code

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    sbx.run_code("print('hello world')")
```

Expected output contains the code-interpreter result with `hello world` printed to stdout.

### 3.3 File operations

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    with open(os.path.abspath(__file__), "rb") as file:
        sbx.files.write("/home/user/my-file", file)
    file_content = sbx.files.read("/home/user/my-file")
    print(file_content)
```

### 3.4 Command execution

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    result = sbx.commands.run('echo hello; sleep 1; echo world', on_stdout=lambda data: print(data),
                              on_stderr=lambda data: print(data))
    print(result)
```

### 3.5 Pause and resume

> Note: Currently, memory state preservation during pausing and resuming is only supported on Alibaba Cloud ACS

```python
import os

from e2b_code_interpreter import Sandbox
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.keys import encode_for_e2b_sdk

os.environ["E2B_API_KEY"] = encode_for_e2b_sdk(os.environ["E2B_API_KEY"])
patch_e2b(https=False)

with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    # Pause the sandbox
    sbx.run_code("a = 1")
    sbx.beta_pause()

    # Resume the sandbox
    sbx.connect()
    sbx.run_code("print(a)")
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Sandbox.create` fails with template not found | `SandboxSet` not deployed yet, or its name differs from the `template` argument | `kubectl get sandboxset` — the name must be exactly `code-interpreter` (or pass your template's name) |
| Pre-warm Pods `Pending` because PVC is `Pending` | `storageClassName` from the example does not exist in your cluster | Adjust it as described in [1.1](#11-download-and-adjust-the-sandboxset-manifest) |
| Pre-warm Pods `ImagePullBackOff` | Nodes cannot pull from Docker Hub | Configure a reachable registry/mirror for `e2bdev/code-interpreter` and `openkruise/agent-runtime` |
| SDK raises an API-key format error | `encode_for_e2b_sdk` preamble missing, or `validate_key=False` used with `e2b<2.25.0` | Add the preamble from [2.3](#23-preamble-required-by-every-example) |
| Requests time out | `kubectl port-forward` not running, or `E2B_DOMAIN` mismatch | Re-run the port-forward command and export `E2B_DOMAIN=localhost`; production setups must match the installed `e2b.domain` |
| `401` responses | `E2B_API_KEY` differs from the installed `e2b.adminApiKey` | Compare with the value used at installation |

# Running E2B Code Interpreter Sandbox

This example demonstrates how to deploy an [E2B](https://e2b.dev/) code-interpreter sandbox through OpenKruise Agents
and invoke it via the E2B SDK.

## 0. Basic Concepts

### Sandbox

`Sandbox` is the core CRD of OpenKruise Agents. It manages the lifecycle of a sandbox instance (such as a Pod) and
provides advanced features including Pause, Resume, Checkpoint, Fork, and in-place upgrades.

### SandboxSet

`SandboxSet` is the workload that manages `Sandbox`. Its function is similar to a `ReplicaSet` that manages Pods.
It enables sub-second sandbox startup by pre-warming a pool of sandbox instances. Optimized specifically for scaling
performance, `SandboxSet` can rapidly replenish sandboxes as they are consumed.

### sandbox-manager

`sandbox-manager` is a stateless backend management component that provides a set of E2B protocol-compatible APIs for
managing and operating sandbox instances.

### agent-runtime

`agent-runtime` is a Sidecar injected into the Sandbox that provides a series of advanced features for the sandbox,
including E2B envd-compatible remote operation interfaces, dynamic CSI mounting, etc.

## 1. Defining Templates

OpenKruise Agents provides the E2B protocol-compatible backend management component `sandbox-manager`, allowing users to
directly manage and operate sandboxes through the native E2B SDK. In this example, we will deploy an official E2B
code-interpreter template in the K8s cluster.

### 1.1 Deploying a Pre-warmed template via SandboxSet

`SandboxSet`, as the workload managing `Sandbox`, will be automatically recognized as a template by `sandbox-manager`.
You can refer
to [sandboxset.yaml](https://github.com/openkruise/agents/blob/master/examples/code_interpreter/sandboxset.yaml) to
create a `SandboxSet` in K8s to create a template named `code-interpreter`.

### 1.2 Using Custom Images

`agent-runtime` provides E2B-compatible interfaces that support its command execution, file operations, code running,
and other functions. If the official images do not meet your requirements, you can replace them with custom images.

### 1.3 Cross-Namespace Template Deployment

To reduce cluster load during large-scale pre-warming, you can deploy templates across namespaces by creating
identically
named `SandboxSet` resources in each target namespace.

## 2. Using Sandboxes via E2B Python SDK

You can connect the native E2B Python SDK and JavaScript SDK to `sandbox-manager` through the following environment
variables. In this section, we will use the Python SDK as an example for introduction.

> Domain name and initial API Token should be configured via helm values during installation

```shell
export E2B_DOMAIN=your.domain
export E2B_API_TOKEN=your-token
```

You can install the E2B code interpreter Python SDK with the following command:

```shell
pip install e2b-code-interpreter
```

### 2.1 E2B Standard Capabilities

`sandbox-manager` is compatible with E2B's standard capabilities, including management and sandbox instance operations.
The following example demonstrates creating sandboxes, executing code, operating files, executing commands, and other
functions through the E2B SDK.

#### 2.1.1 Creation and Deletion

The following code can quickly allocate a sandbox instance from the pre-warming pool. Upon completion of allocation,
`SandboxSet` will immediately create a new sandbox instance for replenishment.

```python
import os

# Import the E2B SDK
from e2b_code_interpreter import Sandbox

# Create a sandbox using the E2B Python SDK
# The template name here must match the SandboxSet name
sbx = Sandbox.create(template="code-interpreter", timeout=300)
print(f"sandbox id: {sbx.sandbox_id}")

sbx.kill()
print(f"sandbox {sbx.sandbox_id} killed")
```

#### 2.1.2 Code Execution

```python
with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    sbx.run_code("print('hello world')")
```

#### 2.1.3 File Operations

```python
with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    with open(os.path.abspath(__file__), "rb") as file:
        sbx.files.write("/home/user/my-file", file)
    file_content = sbx.files.read("/home/user/my-file")
    print(file_content)
```

#### 2.1.4 Command Execution

```python
with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    result = sbx.commands.run('echo hello; sleep 1; echo world', on_stdout=lambda data: print(data),
                              on_stderr=lambda data: print(data))
    print(result)
```

#### 2.1.5 Pausing and Resuming

> Note: Currently, memory state preservation during pausing and resuming is only supported on Alibaba Cloud ACS

```python
with Sandbox.create(template="code-interpreter", timeout=300) as sbx:
    # Pause the sandbox
    sbx.run_code("a = 1")
    sbx.beta_pause()

    # Resume the sandbox
    sbx.connect()
    sbx.run_code("print(a)")
```

---
title: Dynamic Resource Injection with SidecarSet
---
SidecarSet is widely used for various proxy services. In certain scenarios, you may want the sidecar container's resources to dynamically adjust based on the resources of the target Pod.

### Example

You can control the resource calculation strategy for Kruise sidecar containers by configuring `spec.containers[i].resourcesPolicy` and `spec.initContainers[i].resourcesPolicy` in the SidecarSet object.

Let's say we want the sidecar container's CPU resources to follow a piecewise linear function defined by the points `[[0,0.5], [1,0.5], [2,1], [3,2], [4,3], [5,3]]`, where the x-coordinate represents the sum of CPU limits from other containers in the target Pod, and the y-coordinate represents the sidecar container's CPU limit. To help you quickly generate the expression, we provide a set of calculator tools:

```bash
# Clone the Kruise Git repository
git clone https://github.com/openkruise/kruise.git

# Navigate to the Kruise directory
cd kruise

# Generate the expression - this command will return: min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0)
python3 hack/calculator-helper/generator/generate_expression.py "[[0,0.5], [1,0.5], [2,1], [3,2], [4,3], [5,3]]" -v cpu

# To verify the expression is correct, you can use the validator tool to generate a visual plot
# The validator uses the same calculator implementation as ResourcePolicy, ensuring consistent results

## Build the validator tool
cd hack/calculator-helper/validator && go build -o validator

## Validate the expression and generate the plot
./validator -expr "min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0)" -var cpu -min 0 -max 10500m -output plot.png
```
![sidecarset-resource-policy-plot](/img/docs/best-practices/sidecarset-resource-policy-plot.png)

Once you've verified the expression is correct, you can apply it to your SidecarSet:

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
spec:
  containers:
  - name: sidecar1
    image: centos:6.7
    resourcesPolicy:
      targetContainerMode: sum # Calculate sidecar resources based on the sum of all target container limits
      targetContainersNameRegex: ^.*$ # Match all containers
      resourceExpr:
        limits:
          cpu: min(max(max(max(0.5,0.5*cpu),cpu-1.0),cpu-1.0),3.0) # The 'cpu' variable represents the sum of target container CPU limits, calculated according to targetContainerMode and targetContainersNameRegex
          memory: 200Mi
        requests:
          cpu: 50m
          memory: 100Mi
```

**Important Notes**:
- Supported expression operators:
  - Basic arithmetic: `+`, `-`, `*`, `/`
  - Parentheses: `(` and `)`
  - Functions: `max()`, `min()`
  - Percentages: e.g., `50%` (equals 0.5)
  - Kubernetes resources: e.g., `40m` (40 millicores), `100Mi` (100 mebibytes)
- Supported expression value types:
  - Integers: e.g., `42`
  - Floating-point numbers: e.g., `3.14`
  - Percentages: e.g., `50%` (automatically converted to 0.5)
  - Kubernetes resources: e.g., `200m`, `512Mi`, `1Gi`
- If both `resourcesPolicy` and `resources` are configured, the Kruise validating webhook will reject the Pod creation request.
- `targetContainersNameRegex` is a regular expression pattern for matching target container names. If no container names match this regex, the validating webhook will reject the Pod creation request. Target containers include native sidecar containers and regular containers, but exclude Kruise sidecar containers.
- `resourcesPolicy` can be applied to both native sidecar containers (`sidecarset.spec.initContainers.resourcesPolicy`) and regular containers (`sidecarset.spec.containers.resourcesPolicy`).
- Injection only happened when pod creating, and will not be updated when pod running.

# API Specifications

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A basic example for Kruise Rollouts resource YAML:

**Note: v1beta1 available from Kruise Rollout v0.5.0.**

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollouts-demo
  # The rollout resource needs to be in the same namespace as the corresponding workload
  namespace: default
spec:
  # rollout of published workloads, currently only supports Deployment, CloneSet, StatefulSet, Advanced StatefulSet and Advanced DaemonSet
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: echoserver
  strategy:
    canary:
      enableExtraWorkloadForCanary: true
      steps:
      ### the 1-st batch ###
      # routing 5% traffics to the new version
      - traffic: 5%
        # Need Manual confirmation before enter to next batch
        pause: {}
        # optional, The first step of released replicas. If not set, the default is to use 'weight', as shown above is 5%.
        replicas: 1
      ### the 2-nd batch ###
      - traffic: 50%
        replicas: 50%
        # Automatically enter the next batch after waiting 2 hours
        pause:
          duration: 7200
      ### the 3-rd batch ###
      - traffic: 100%
        replicas: 100%
      trafficRoutings:
      # service name that is related with the workload
      - service: echoserver
        # ingress name that is related with the service
        ingress:
          name: echoserver
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollouts-demo
  # The rollout resource needs to be in the same namespace as the corresponding workload
  namespace: default
  # This annotation can help us upgrade the Deployment using partition, just like StatefulSet/CloneSet.
  annotations:
    rollouts.kruise.io/rolling-style: partition
spec:
  objectRef:
    # rollout of published workloads, currently only supports Deployment, CloneSet, StatefulSet, Advanced StatefulSet and Advanced DaemonSet
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: echoserver
  strategy:
    canary:
      steps:
      ### the 1-st batch ###
      # routing 5% traffics to the new version
      - weight: 5
        # Need Manual confirmation before enter to next batch
        pause: {}
        # optional, The first step of released replicas. If not set, the default is to use 'weight', as shown above is 5%.
        replicas: 1
      ### the 2-nd batch ###
      - replicas: 50%
        # Automatically enter the next batch after waiting 2 hours
        pause:
          duration: 7200
      ### the 3-rd batch ###
      - replicas: 100%
      trafficRoutings:
      # service name that is related with the workload
      - service: echoserver
        # ingress name that is related with the service
        ingress:
          name: echoserver
```

  </TabItem>
</Tabs>

There are 3 major parts of api specifications you should pay attention to:
- Binding your workload: Tell Rollout which workload it should work on;
- Binding your traffic configuration: Tell Rollout which traffic configuration it should focus on.
- Config your deployment strategy before releasing: Tell Rollout how to roll your workload and traffic.

## API Details

### Rollout Spec Fields

| Field             | Type    | Default | Description                                                              |
|-------------------|---------|---------|--------------------------------------------------------------------------|
| `disabled`        | boolean | false   | When true, completely disables Rollout reconciliation                    |
| `workloadRef`     | Object  |         | Reference to the workload being managed                                  |
| `strategy`        | Object  |         | Rollout strategy configuration (canary or blue‑green)                     |

### Workload Binding API (Mandatory)
Tell Kruise Rollout which workload should be bounded:

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: <your-workload-name>
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: StatefulSet
      name: <your-workload-name>
```

  </TabItem>
</Tabs>

| Fields       | Type   | Defaults | Explanation         |
|--------------|--------|----------|---------------------|
| `apiVersion` | string | ""       | Workload APIVersion |
| `kind`       | string | ""       | Workload Kind       |
| `name`       | string | ""       | Workload Name       |

Currently, Kruise Rollout supports Deployment, CloneSet, StatefulSet, DaemonSet, Advanced StatefulSet and Advanced DaemonSet.

**Note: The workload should be at the same namespace as the Rollout.**

### Traffic Binding API (Optional)
Different from "Workload Binding", Traffic Binding is not necessary. If you do not set the following specifications, the traffic configuration will keep their native behavior, for example, keeping load balance for all versioned Pods.

If you need do something special for traffic routings, just tell Kruise Rollout which traffic configurations should be bound:

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      trafficRoutings:
      - service: <service-name-that-is-related-your-workload>
        ingress: # alternative： ingress,gateway,customNetworkRefs
          classType: <traffic-type> # example: nginx | higress, defaults to "nginx"
          name: <ingress-name-that-is-related-the-service>
        gracePeriodSeconds: 10
      - service: <service-name-that-is-related-your-workload>
        gateway:
          httpRouteName: <gateway-api-httpRoute-name>
        gracePeriodSeconds: 10
      - service: <service-name-that-is-related-your-workload>
        customNetworkRefs:
        - apiVersion: <your-resource-apiVersion>
          kind: <your-resource-kind>
          name: <your-resource-name>
        gracePeriodSeconds: 10
```

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      trafficRoutings:
      - service: <service-name-that-is-related-your-workload>
        ingress: # alternative： ingress,gateway,customNetworkRefs
          classType: <traffic-type> # example: nginx | higress, defaults to "nginx"
          name: <ingress-name-that-is-related-the-service>
        gracePeriodSeconds: 10
      - service: <service-name-that-is-related-your-workload>
        gateway: 
          httpRouteName: <gateway-api-httpRoute-name>
      - service: <service-name-that-is-related-your-workload>
        customNetworkRefs:
        - apiVersion: <your-resource-apiVersion>
          kind: <your-resource-kind>
          name: <your-resource-name>
```

  </TabItem>
</Tabs>

| Fields                  | Type   | Defaults | Explanation                                                                                                   |
|-------------------------|--------|----------|---------------------------------------------------------------------------------------------------------------|
| `service`               | string | ""       | Name of service that select the pods of bounded workload                                                      |
| `ingress`               | object | nil      | (optional) Description of the Ingress object you want to bind                                                 |
| `gateway`               | object | nil      | (optional) Description of the [Gateway API](https://gateway-api.sigs.k8s.io/) resources you want to bind      |
| `customNetworkRefs    ` | Array  | ""       | (optional) Definitions of [customize API Gateway resources](https://openkruisyye.io/rollouts/developer-manuals/custom-network-provider) | 
| `ingress.classType`     | string | "nginx"  | Ingress type, such as "nginx", "higress", or others                                                           |
| `ingress.name`          | string | ""       | Name of ingress resource that bounded the service                                                             |
| `gateway.httpRouteName` | string | ""       | Name of [HTTPRoute](https://gateway-api.sigs.k8s.io/concepts/api-overview/#httproute) resource of Gateway API |
| `gracePeriodSeconds`    | integer| 3        | Duration in seconds that kruise rollout wait for the traffic routing configuration changes to take effects in each step |

**Note: if you decide to use `trafficRoutings`, one and only one of `ingress`,`gateway`,`customNetworkRefs` can be present in one trafficRouting element*

Alternatively, one can also define traffic routing strategy independently. and reference declared traffic routing config in the Rollout resource. Such usage is often used in the end-to-end canary cases.

Here is an example of independent traffic routing definition:
```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: TrafficRouting
metadata:
  name: mse-traffic
spec:
  objectRef:
  # config is the same as the traffic routing element in canary.trafficRoutings
  - service: spring-cloud-a
    ingress:
      classType: mse
      name: spring-cloud-a
    gracePeriodSeconds: 10
  strategy:
    matches:
    - headers:
      - type: Exact
        name: User-Agent
        value: Andriod
    requestHeaderModifier:
      set:
      - name: x-mse-tag
        value: gray
```

Here is an example to reference the traffic routing in Rollout resource:

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollout-b
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: spring-cloud-b
  strategy:
    canary:
      steps:
        - pause: {}
          replicas: 1
      patchPodTemplateMetadata:
        labels:
          opensergo.io/canary-gray: gray
    # refer to the traffic routing config called mse-traffic
    trafficRoutingRef: mse-traffic
```
  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  name: rollout-b
  annotations:
    # refer to the mse-traffic traffic routing config
    rollouts.kruise.io/trafficrouting: mse-traffic
spec:
  objectRef:
    workloadRef:
      apiVersion: apps/v1
      kind: Deployment
      name: spring-cloud-b
  strategy:
    canary:
      steps:
        - pause: {}
          replicas: 1
      patchPodTemplateMetadata:
        labels:
          opensergo.io/canary-gray: gray
```
  </TabItem>
</Tabs>

### Strategy API (Mandatory)

| Field        | Type    | Default | Description                                                  |
|--------------|---------|---------|--------------------------------------------------------------|
| `paused`     | boolean | false   | When true, pauses rollout progression until manually resumed |
| `canary`     | Object  | nil     | Canary strategy configuration                                |
| `blueGreen`  | Object  | nil     | Blue-green strategy configuration (requires v0.6.0+)         |

**Note: Difference between Disabled and Paused**
- **Disabled**: Stops all Rollout reconciliation and routes all traffic to the stable workload; the controller will ignore this Rollout until re-enabled, it is equivalent to deleting the Rollout object.
- **Paused**: Keeps the Rollout active but halts progression between steps. Useful for inspections or troubleshooting. 

`canary`  is used for canary strategy and multi-batch strategy, while `blueGreen` is used for blue-green strategy. These two are mutually exclusive; they cannot both be empty or both be non-empty. The `blueGreen` strategy was introduced in Kruise-Rollout versions higher than v0.5.0 and is not supported in the v1alpha1 API.

#### Canary

Describe your strategy of rollout:

<Tabs>
  <TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      enableExtraWorkloadForCanary: true
      steps:
      # the first step
      - traffic: 5%
        replicas: 1 or 10%
        pause:
          duration: 0
        matches:
        - headers:
          - type: Exact # or "RegularExpression"
            name: <matched-header-name>
            value: <matched-header-value, or reg-expression>
      # the second step
      - traffic: 10%
        ... ....
      patchPodTemplateMetadata:
        labels:
          opensergo.io/canary-gray: gray
```

| Fields                    | Type                | Defaults  | Explanation                                                                                                    |
|---------------------------|---------------------|-----------|----------------------------------------------------------------------------------------------------------------|
| `enableExtraWorkloadForCanary` | boolean          | false     | Whether to create extra workload for canary update,  the extra workload be deleted after rollout completions; if it is set to false, multi-batch update strategy will be used for workload | 
| `steps[x].traffic`         | *string            | nil       | (optional) Percent weight of canary traffic for new-version Pods.                                              |
| `steps[x].replicas`       | *integer or *string | nil       | Absolute number or Percent of new-version Pods.                                                                 |
| `steps[x].pause`          | object              | {}        | (optional) Manual confirmation or auto confirmation before enter the next step.                                |
| `steps[x].pause.duration` | *integer            | nil       | (optional) Duration time before auto confirmation. if nil, means need manual confirmation.                     |
| `steps[x].matches`        | []object            | []        | (optional) The HTTP header match rules you want to traffic to new-version Pods.                                |
| `steps[x].requestHeaderModifier`        | object            | []        | (optional)  overwrites the request with the given header (name, value)                             |
| `headers[x].type`         | string              | "Exact"   | "Exact" or "RegularExpression" rule to match key and value                                                     |
| `headers[x].name`         | string              | ""        | Matched HTTP header name. (And-Relationship between headers[i] and headers[j])                                  |
| `headers[x].value`        | string              | ""        | Matched HTTP header value.                                                                                     |
| `patchPodTemplateMetadata` | object    | nil       | (optional) Add extra pod meta data by patch podTemplate of the canary workload                                 |

  </TabItem>
  <TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: rollouts.kruise.io/v1alpha1
kind: Rollout
metadata:
  namespace: <your-workload-ns>
spec:
  strategy:
    canary:
      steps:
      # the first step
      - weight: 5
        replicas: 1 or 10%
        pause:
          duration: 0
        matches:
        - headers:
          - type: Exact # or "RegularExpression"
            name: <matched-header-name>
            value: <matched-header-value, or reg-expression>
      # the second step
      - weight: 10
        ... ....
      patchPodTemplateMetadata:
        labels:
          opensergo.io/canary-gray: gray
```

| Fields                    | Type                | Defaults  | Explanation                                                                                                    |
|---------------------------|---------------------|-----------|----------------------------------------------------------------------------------------------------------------|
| `steps[x].weight`         | *integer            | nil       | (optional) Percent weight of canary traffic for new-version Pods.                                              |
| `steps[x].replicas`       | *integer or *string | nil       | (optional) Absolute number or Percent of new-version Pods. If nil, the default is to use 'weight' as replicas. |
| `steps[x].pause`          | object              | {}        | (optional) Manual confirmation or auto confirmation before enter the next step.                                |
| `steps[x].pause.duration` | *integer            | nil       | (optional) Duration time before auto confirmation. if nil, means need manual confirmation.                     |
| `steps[x].matches`        | []object            | []        | (optional) The HTTP header match rules you want to traffic to new-version Pods.                                |
| `headers[x].type`         | string              | "Exact"   | "Exact" or "RegularExpression" rule to match key and value                                                     |
| `headers[x].name`         | string              | ""        | Matched HTTP header name. (And-Relationship between headers[i] and headers[j])                                  |
| `headers[x].value`        | string              | ""        | Matched HTTP header value.                                                                                     |
| `patchPodTemplateMetadata` | object    | nil       | (optional) Add extra pod meta data by patch podTemplate of the canary workload                                 |
  </TabItem>
</Tabs>

Note:
- `steps[x].replicas` cannot be nil.
- `steps[x].matches[i] and steps[x].matches[j]` have **Or**-relationship.
- `steps[x].matches[y].headers[i] and steps[x].matches[y].header[j]` have **And**-relationship. 
- `patchPodTemplateMetadata` can be set only if enableExtraWorkloadForCanary=true
- `enableExtraWorkloadForCanary` is available in v1beta Rollout resource; In v1alpha1 Rollout resource, one can use the annotation of Rollout `rollouts.kruise.io/rolling-type`="canary" to enable `enableExtraWorkloadForCanary`

#### blueGreen

Describe your strategy of rollout:

```yaml
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  namespace: your-workload-ns
spec:
  strategy:
    blueGreen:
      steps:
      # the first step
      - replicas: 100%
      	traffic: 0%
        pause:
          duration: {}
      # the second step
      - replicas: 100%
        matches:
        - headers:
          - type: Exact # or "RegularExpression"
            name: matched-header-name
            value: matched-header-value # value or reg-expression
    # the third step
      - replicas: 100%
      	traffic: 100%

```

Note:

- Except for the absence of the `patchPodTemplateMetadata` and `enableExtraWorkloadForCanary` fields, the configuration for `blueGreen` and `canary` are identical and follow the same precautions as `canary`.
- For the differences between blue-green strategy and other strategies, please refer to "Release Strategies" - "Blue-Green Release."



### Special Annotations of Workload (Optional)

There are some special annotations in Bounded Workload to enable specific abilities.

| Annotations                     | Value      | Defaults | Explanation                                                  |
| ------------------------------- | ---------- | -------- | ------------------------------------------------------------ |
| `rollouts.kruise.io/rollout-id` | any string | ""       | The concept is similar to the release order number. To solve the problem that users should know whether the current changes of workload is observed by Kruise Rollout controller. |

### Rollout Status You Should Know

#### Canary

```yaml
kind: Rollout
status:
  phase: Healthy
  observedGeneration: 2
  canaryStatus:
    canaryReplicas: 10
    canaryReadyReplicas: 10
    canaryRevision: 76fd76f75b
    currentStepIndex: 3
    currentStepState: Completed
    observedRolloutID: "20230313093823"
    observedWorkloadGeneration: 20
    podTemplateHash: 76fd76f75b
    stableRevision: b76b6f48f
```
| Fields                             | Type    | Mode       | Explanation                                                  |
| ---------------------------------- | ------- | ---------- | ------------------------------------------------------------ |
| `phase`                            | string  | read-only  | "Initial" means no bounded workload; "Healthy" means bounded workload is promoted; "Progressing" means rollout is working. |
| `observedGeneration`               | integer | read-only  | Observed rollout spec generation.                            |
| `canaryStatus`                     | *object | read-only  | Information about rollout progressing.                       |
| `canaryStatus.canaryReplicas`      | integer | read-only  | workload updated replicas                                    |
| `canaryStatus.canaryReadyReplicas` | integer | read-only  | workload updated ready replicas.                             |
| `canaryStatus.podTemplateHash`     | string  | read-only  | workload update(new) revision hash.                          |
| `canaryStatus.canaryRevision`      | string  | read-only  | workload update(new) revision hash calculated by Kruise Rollout controller. |
| `canaryStatus.stableRevision`      | string  | read-only  | workload stable(old) revision hash recorded before progressing. |
| `canaryStatus.observedRolloutID`   | string  | read-only  | corresponding to workload `rollouts.kruise.io/rollout-id` annotations. if they are equal, it means rollout controller watched workload changes. |
| `canaryStatus.currentStepIndex`    | integer | read-only  | rollout current step index. Start from 1.                    |
| `canaryStatus.nextStepIndex`       | integer | read&write | Indicates the next step to execute. If the current batch is the last batch or the release has ended, its value is set to -1. In other cases, it is typically equal to `canaryStatus.currentStepIndex` + 1. Users can modify it to a reasonable positive number to enable non-sequential step execution. |
| `canaryStatus.currentStepState`    | string  | read&write | rollout current step state. Both "StepReady" and "Complete" mean current step is ready. |

#### Blue-Green

```yaml
kind: Rollout
status:
  blueGreenStatus:
    currentStepIndex: 1
    currentStepState: StepPaused
    lastUpdateTime: "2025-01-03T09:20:29Z"
    message: BatchRelease is at state Ready, rollout-id , step 1
    nextStepIndex: 2
    observedWorkloadGeneration: 4
    podTemplateHash: 64c6f99459
    rolloutHash: 7w8dxcdc49wv4w49c469b27c6c7xb4f4c4dvf8dwd4b6zb5z4zcc852c7w9vf5dv
    stableRevision: 65f957664d
    updatedReadyReplicas: 10
    updatedReplicas: 10
    updatedRevision: 64448b955c
```

Just like `canaryStatus`, `blueGreenStatus` has **exactly the same** status fields, and their meanings are identical.

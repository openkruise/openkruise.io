# Blue-Green Release

## Blue-Green Release Process

<center><img src={require('/static/img/rollouts/bluegreen.png').default} width="90%" /></center>

## Recommended Configuration

**Note: The blue-green strategy is only applicable to Deployment and CloneSet, supports only the v1beta1 API, and requires a Rollout version higher than v0.5.0 (excluding v0.5.0).**

```YAML
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: rollouts-demo
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: workload-demo
  strategy:
    blueGreen:
      steps:
      - replicas: 100% # step 1
        traffic: 0%
      - replicas: 100% # step 2
        traffic: 10%
      - replicas: 100% # step 3
        traffic:  100%
      trafficRoutings:
      - service: service-demo
        ingress:
          classType: nginx
          name: ingress-demo
```

## Behavior Explanation
When you apply a new revision to `workload-demo`:

- **First Batch:** 100% of the new version Pods are scaled up, and the stable version Pods are not scaled down. At this point, there are 200% of the Pods, but no traffic is routed to the new version Pods. Manual confirmation is required to proceed to the next batch.
- **Second Batch:** 10% of the traffic is routed to the new version. Manual confirmation is required to proceed to the next batch.
- **Third Batch:** 100% of the traffic is routed to the new version. Manual confirmation is required to complete the release.

Once you verify that the new version is validated and confirm to proceed:

- The stable version Pods will be scaled down, and the release will be completed.

## Differences from Other Strategies

From the **API** perspective, the differences between `strategy.blueGreen` and `strategy.canary` are minimal and mainly include:

- `strategy.blueGreen` does not have the `EnableExtraWorkloadForCanary` field. `strategy.canary`  uses this field to distinguish whether to create an additional Deployment, corresponding to canary strategy and multi-batch strategy of the Deployment.
- `strategy.blueGreen` does not have the `PatchPodTemplateMetadata` field. Only canary strategy support this field; multi-batch and blue-Green strategy do not.

Apart from these, there are no further differences in the API. You may notice that the steps in Blue-Green strategy are used similarly to those in canary strategy.

From the perspective of **release process**, the differences between Blue-Green strategy and other strategies are:

- Blue-Green strategy do not create additional workloads, similar to multi-batch strategy, whereas canary strategy create additional workload for Deployment.
- In the blue-green release process, Pods of the old version won't be scaled down, which is the same as in canary strategy. In contrast, multi-batch strategy scale up new version Pods while simultaneously scaling down old version Pods.

You can easily understand the differences between blue-green and multi-batch strategies. However, you might also think that aside from whether additional workload is created at the low level, there seems to be little difference between blue-green and canary. Perhaps the following diagram can provide clarification:

<center><img src={require('/static/img/rollouts/canary_vs_bluegreen.png').default} width="90%" /></center>

Notice that after the final batch is completed, canary strategy perform a rolling update on the original workload, whereas blue-green deployments simply scale down the old version Pods directly. This difference reflects the semantic differences between the two strategies: in canary strategy, the created workload essentially serves as a "canary" to validate the new version and is deleted after validation. In blue-green strategy, the old and new versions "coexist," allowing traffic to be switched between the two versions.

**In practice:**

- Canary Release are recommended to configure a small number of batches (e.g., 1 batch), with each batch having a relatively small number of replicas. Although configuring replicas as 100% is allowed, it is usually unnecessary.
- For blue-green deployments, it is generally recommended to configure replicas as 100%.

From the perspective of **underlying implementation** , the differences between blue-green strategy  and other strategies are:

- **Canary:** Only Deployment support canary strategy. During release, Kruise-Rollout creates a Deployment named "[DeploymentName]-canary".
- **Multi-Batch:** CloneSets can utilize their inherent `partition` field to implement multi-batch strategy, while Deployment relies on a customized controller.
- **Blue-Green:** Both CloneSet and Deployment achieve blue-green release by setting the `MinReadySeconds`, `MaxSurge`, and `MaxUnavailable` fields. Therefore, if you notice these fields being changed while using blue-green strategy, there is no need to worry. This is normal behavior, and these fields will be restored after the release is done.

### Which Release Method Should I Choose?

It depends on your scenarios:

- Blue-Green Release consumes double the resources. You might opt for blue-green strategy in scenarios with high stability requirements because the old and new version instances coexist, allowing you to quickly switch traffic to either the new or stable version.
- In other scenarios, you might choose canary or multi-batch strategies.

## Rollback

### Global Rollback

Similar to canary/multi-batch strategies, you can directly rollback the workload specification to rollback the application. For details, refer to the "Basic Usage Guide" → "How to Rollback".

### Traffic Rollback

Rollout has introduced a new feature that supports jumping between steps. For example, when deploying to the third batch, you can execute the following command to jump back to the second batch:

```shell
kubectl patch rollout rollouts-demo --type merge --subresource status -p "{\"status\":{\"blueGreenStatus\":{\"nextStepIndex\": 2}}}"
```

Using this feature, you can "rollback" the traffic of a blue-green release. In the recommended configuration example, jumping from the third step to the second step will change the traffic configuration from "100% of requests routed to the new version" to "10% of requests routed to the new version." If you further jump to the first step, all requests will be routed to the stable version.

However, it is important to note that if the `replicas` of the target step are less than those of the current step, no Pods will be scaled down.

In fact, directly modifying the `spec.strategy.blueGreen.steps[x].traffic` of the Rollout resource can achieve a similar effect. For example, changing `spec.strategy.blueGreen.steps[lastBatch].traffic` from 100% to 10%, and then from 10% to 0%. However, directly modifying the spec may affect the next release, whereas modifying the status can avoid this issue.

**Note:** Allowing step-jumping and modifying the traffic configuration of a specific step are new features introduced with blue-green release and require specific Rollout versions.

## Considerations

### HPA

During the blue-green release process, if the workload is bound to an HPA(Horizontal Pod Autoscaler), Kruise-Rollout will disable the HPA. You will notice that the HPA's `scaleTargetRef.name` is appended with the suffix "-DisableByRollout," causing the workload to be marked as Not Found. After the blue-green release is done, the suffix will be removed, and the HPA will become active again.

### PDB
During the blue-green release process, If the workload is bound to a PDB(Pod Disruption Budget), since the PDB does not consider the version of the Pods when calculating "Allowed disruptions," configuring `maxUnavailable` will lead to "smaller step sizes and over-protection," whereas configuring `minAvailable` will result in "larger step sizes and under-protection." Therefore, unless necessary, it is recommended to use `minAvailable `(prefer "over-protection" rather than "under-protection").

### Successive Release
The Blue-Green strategy does not support successive releases. If you are in the progress of releasing version v2 (upgrading from v1 to v2) and then attempt to release version v3, we recommend that you first manually roll back to version v1 and then proceed to deploy version v3.
If you have accidentally released version v3, the controller will not function as expected. The Pods for version v3 will not be created, and the Pods for versions v2 and v1 will not be scaled down. If you check the Rollout resource at this point, you will notice a message similar to the following:
```shell
NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                                       AGE
rollouts-demo   Progressing   1             StepPaused     new version releasing detected in the progress of blue-green release, please rollback first   6d23h
```
It is recommended to perform a rollback operation at this time. You can roll back to version v1. Specifically, if you use the `kubectl rollout undo` command to perform the rollback, please ensure you specify the correct `--to-revision` to revert to version v1. If you do not specify `--to-revision`, you might revert back to version v2 (i.e., the state before deploying version v3):
```shell
NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                         AGE
rollouts-demo   Progressing   1             StepPaused     Rollout is in step(1/4), and you need manually confirm to enter the next step   7d
``` 

## Known Issues

- Due to unresolved issues in the CloneSet controller code, when performing blue-green strategy on CloneSets, all steps' replicas should be set to 100%. Otherwise, CloneSets may fail to scale up. Deployment is not subject to this restriction.
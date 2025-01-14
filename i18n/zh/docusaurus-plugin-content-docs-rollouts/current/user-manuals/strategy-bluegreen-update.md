# 蓝绿发布

## 蓝绿发布流程

<center><img src={require('/static/img/rollouts/bluegreen.png').default} width="90%" /></center>

## 推荐配置

**注意：蓝绿策略仅适用于Deployment和CloneSet，且仅支持v1beta1的API，要求Rollout版本高于v0.5.0(不包括v0.5.0)**

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

## 行为解释
当您为workload-demo应用新修订版本时：
- 在第一批中，将扩容100%的新版本Pod，稳定版本的Pod不会被缩容，此时有200%的Pod，没有任何请求路由到新版本Pods，需要手动确认到下一批。
- 在第二批中，将10%的流量路由到新版本，需要手动确认到下一批。
- 在第三批中，将100%的流量路由到新版本，需要手动确认以完成发布。
当您认为新版本已经通过验证并确认进行下一步时：
- 稳定版本的Pods将会缩容，发布结束

## 和金丝雀/多批次发布的区别
从**API**的角度，`strategy.blueGreen`和`strategy.canary`二者的区别很小，只体现在：
- blueGreen没有`EnableExtraWorkloadForCanary`字段。canary借助该字段区分是否对Deployment创建额外的Deployment，对应Deployment的金丝雀发布和多批次发布。
- blueGreen没有`PatchPodTemplateMetadata`字段。目前只有金丝雀发布支持该字段，多批次发布和蓝绿发布都不支持该字段。
除此之外，两种发布方式在API上没有进一步区别。您可以注意到，蓝绿发布的steps和canary的steps有一致的用法。

从**发布流程**的角度，蓝绿发布和金丝雀/多批次发布的区别在于：
- 蓝绿发布不会创建额外的工作负载，这一点和多批次发布相同，而金丝雀发布会创建额外的工作负载。

- 蓝绿发布过程中旧版本的实例不会被缩容，这一点和金丝雀发布相同，而多批次发布在扩容新版本Pods的同时会缩容旧版本Pods。

  您应该很容易理解蓝绿发布和多批次发布的差异，然而您也可能会想，除了底层是否会创建额外的工作负载之外，蓝绿发布和金丝雀发布似乎没什么区别。或许您可以从下图中获得解释：

<center><img src={require('/static/img/rollouts/canary_vs_bluegreen.png').default} width="90%" /></center>

注意到，在最后一批发布完成之后，金丝雀发布会执行会在原工作负载上执行滚动发布，而蓝绿发布只需要直接缩容旧版本Pods。
这种差异反应了两种方式的语义上的差异：金丝雀发布中，创建的工作负载本质是用于验证新版本的“金丝雀”，在验证通过后即被删除。而蓝绿发布中，新旧版本会“共存”，允许在两个版本之间进行流量切换。

在实践上，金丝雀发布建议配置少量批次（比如1批），每个批次的replicas应该比较小，尽管允许将`replicas`配置为100%，但是通常没有必要。而对于蓝绿发布，通常建议配置`replicas`为100%

从**底层实现**的角度，蓝绿发布和金丝雀/多批次发布的区别在于：
- 金丝雀：只有Deployment支持金丝雀发布，发布时Kruise-Rollout会创建名为`[DeploymentName]-canary`的Deployment
- 多批次：CloneSet可以借助自带的`Partition`字段实现多批次发布，Deployment则依赖定制的Deployment控制器实现
- 蓝绿：CloneSet和Deployment都是通过设置`MinReadySeconds`、`MaxSurge`以及`MaxUnavailable`字段来实现的，因此，如果您在使用蓝绿发布时发现这些字段被改变，请不用担心，这是正常的行为，在发布完成后这些字段会复原。

那么，我该选择哪种发布方式呢？这取决于您的业务场景：
- 蓝绿发布会消耗双倍的资源，您可能在面对稳定性要求比较高的场景时才会使用蓝绿发布。这是因为新旧版本实例会共存，您可以快速地将流量切换到新版本或稳定版本上。
- 在其他场景，您可能会选择金丝雀或者多批次发布。


## 回滚
### 全局回滚
和金丝雀/多批次发布相同，您可以直接回滚工作负载规范以回滚应用程序。详见“基本使用指南”-“如何回滚”

### 流量回滚
Rollout引入了新特性，支持批次的跳转，例如在发布到第3批时，我们可以执行下面的命令跳转到第2批：

```shell
kubectl patch rollout rollouts-demo --type merge --subresource status -p "{\"status\":{\"blueGreenStatus\":{\"nextStepIndex\": 2}}}"
```

利用这个特性，可以对蓝绿发布的流量进行“回滚”，在推荐配置中例子中，从第3批跳转到第2批将使得流量配置从“100%的请求路由到新版本”变为“10%的请求路由到新版本”，如果我们再进一步跳转到第1批，那么全部请求将被路由到稳定版本。

不过需要注意的是，如果目标step的`replicas`小于当前step的`replicas`，并不会有Pods被缩容。

事实上，直接修改Rollout资源的`spec.strategy.blueGreen.steps[x].traffic`可以达到相似效果，例如将`spec.strategy.blueGreen.steps[lastBatch].traffic`从100%修改为10%，之后再从10%修改为0%。不过直接对`spec`进行修改可能会影响到下次发布，而修改`status`可以避免该问题。

注意：允许批次跳转和修改某一批次的流量配置都是伴随着蓝绿发布而引入的新特性，对Rollout的版本有要求。

## 注意事项
### HPA
在蓝绿发布过程中，如果工作负载绑定了HPA（HorizontalPodAutoscaler），Kruise-Rollout会禁止该HPA，你会发现HPA的`scaleTargetRef.name`增加了后缀“-DisableByRollout”，导致工作负载Not Found。蓝绿发布结束后，后缀会被移除，HPA将会再次生效。

### PDB
在蓝绿发布过程中，如果工作负载绑定了PDB（PodDisruptionBudget），由于PDB在计算“Allowed disruptions”时不会考虑Pod的版本，因此如果用户配置的是`maxUnavailable`，将导致“步长变小，过保护”；如果配置的是`minAvailable`，将导致”步长变大，弱保护”。因此，除非有必要，尽量使用minAvailable（宁愿“过保护”也不要“弱保护”）。

### 连续发布
蓝绿发布目前不支持连续发布，如果你在发布v2版本（v1->v2)的过程中，想要发布v3版本，我们推荐先手动回滚到v1版本，然后再发布v3版本。
如果你已经不小心发布了v3版本，控制器将不会工作，v3版本的Pods不会被创建，v2和v1版本的Pods也不会被缩容，此时如果检查Rollout资源，你会注意到下面类似的Message：
```shell
NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                                       AGE
rollouts-demo   Progressing   1             StepPaused     new version releasing detected in the progress of blue-green release, please rollback first   6d23h
```
此时建议执行回滚操作，你可以回滚到v1版本。特别的，如果你使用`kubectl rollout undo`命令进行回滚，请确保指定正确的`--to-revision`以回滚到v1，如果没有指定`--to-revision`，你可能会再次回到v2（即发布v3之前的状态）：
```shell
NAME            STATUS        CANARY_STEP   CANARY_STATE   MESSAGE                                                                         AGE
rollouts-demo   Progressing   1             StepPaused     Rollout is in step(1/4), and you need manually confirm to enter the next step   7d
```


## 已知问题
- 由于CloneSet的控制器代码存在尚未解决的问题，对CloneSet进行蓝绿发布时，所有批次的replicas都应该设置为100%，否则CloneSet可能无法扩容。Deployment不受此限制。
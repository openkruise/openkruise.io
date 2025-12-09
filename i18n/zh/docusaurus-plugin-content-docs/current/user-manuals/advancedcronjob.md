---
title: AdvancedCronJob
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**注意：v1beta1 从 Kruise v1.9.0 版本开始可用**

AdvancedCronJob 是对于原生 CronJob 的扩展版本。
后者根据用户设置的 schedule 规则，周期性创建 Job 执行任务，而 AdvancedCronJob 的 template 支持多种不同的 job 资源：

<Tabs>
<TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: AdvancedCronJob
spec:
  template:

    # Option 1: use jobTemplate, which is equivalent to original CronJob
    jobTemplate:
      # ...

    # Option 2: use broadcastJobTemplate, which will create a BroadcastJob object when cron schedule triggers
    broadcastJobTemplate:
      # ...

    # Option 3: use imageListPullJobTemplate, which will create an ImageListPullJobTemplate object when cron schedule triggers
    imageListPullJobTemplate:
    # ...

    # Option 4(future): ...
```

</TabItem>
<TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: AdvancedCronJob
spec:
  template:

    # Option 1: use jobTemplate, which is equivalent to original CronJob
    jobTemplate:
      # ...

    # Option 2: use broadcastJobTemplate, which will create a BroadcastJob object when cron schedule triggers
    broadcastJobTemplate:
      # ...

    # Option 3(future):...
```
</TabItem>
</Tabs>

- jobTemplate：与原生 CronJob 一样创建 Job 执行任务
- broadcastJobTemplate：周期性创建 [BroadcastJob](./broadcastjob) 执行任务
- imageListPullJobTemplate：周期性创建 [ImageListPullJob](./imagepulljob) 执行任务

![AdvancedCronjob](/img/docs/user-manuals/advancedcronjob.png)

## 用例

### BroadcastJob的定时任务
<Tabs>
<TabItem value="v1beta1" label="v1beta1" default>

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: AdvancedCronJob
metadata:
  name: acj-test
spec:
  schedule: "*/1 * * * *"
  template:
    broadcastJobTemplate:
      spec:
        template:
          spec:
            containers:
              - name: pi
                image: perl
                command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
            restartPolicy: Never
        completionPolicy:
          type: Always
          ttlSecondsAfterFinished: 30
```

</TabItem>
<TabItem value="v1alpha1" label="v1alpha1">

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: AdvancedCronJob
metadata:
  name: acj-test
spec:
  schedule: "*/1 * * * *"
  template:
    broadcastJobTemplate:
      spec:
        template:
          spec:
            containers:
              - name: pi
                image: perl
                command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
            restartPolicy: Never
        completionPolicy:
          type: Always
          ttlSecondsAfterFinished: 30
```
</TabItem>
</Tabs>

上述 YAML 定义了一个 AdvancedCronJob，每分钟创建一个 BroadcastJob 对象，这个 BroadcastJob 会在所有节点上运行一个 job 任务。

### ImageListPullJob的定时任务

```yaml
apiVersion: apps.kruise.io/v1beta1
kind: AdvancedCronJob
metadata:
  name: acj-test
spec:
  schedule: "0 */2 * * *"
  concurrencyPolicy: Replace
  template:
    imageListPullJobTemplate:
      spec:
        parallelism: 5
        images:
        - nginx:1.14.2
        - busybox:latest
        pullSecrets:
        - default-secret
        selector:
          names:
          - node1
          - node2
        pullPolicy:
          timeoutSeconds: 60
        imagePullPolicy: IfNotPresent
```

上述 YAML 定义了一个 AdvancedCronJob，每2小时创建一个 ImageListPullJob 对象，这个 ImageListPullJob 会在所选节点上下载指定的镜像。

**FEATURE STATE:** Kruise v1.9.0
在 v1.9.0 版本中，我们引入了 `spec.template.imageListPullJobTemplate` 字段。
你可以设置它来定时下载指定镜像的到所选节点上。

## 时区

默认情况下，所有 AdvancedCronJob schedule 调度时，都是基于 kruise-controller-manager 容器本地的时区所计算的。

**FEATURE STATE:** Kruise v1.3.0

不过，在 v1.3.0 版本中我们引入了 `spec.timeZone` 字段，你可以将它设置为任意合法时区的名字。例如，设置 `spec.timeZone: "Asia/Shanghai"` 则 Kruise 会根据国内的时区计算 schedule 任务触发时间。

Go 标准库中内置了时区数据库，作为在容器的系统环境中没有外置数据库时的 fallback 选择。

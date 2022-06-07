---
title: AdvancedCronJob
---

AdvancedCronJob 是对于原生 CronJob 的扩展版本。
后者根据用户设置的 schedule 规则，周期性创建 Job 执行任务，而 AdvancedCronJob 的 template 支持多种不同的 job 资源：

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: AdvancedCronJob
spec:
  template:

    # Option 1: use jobTemplate, which is equivalent to original CronJob
    jobTemplate:
      # ...

    # Option 2: use broadcastJobTemplate, which will create a BroadcastJob object when cron schedule triggers
    broadcastJobTemplate:
      # ...

    # Options 3(future): ...
```

- jobTemplate：与原生 CronJob 一样创建 Job 执行任务
- broadcastJobTemplate：周期性创建 [BroadcastJob](./broadcastjob) 执行任务

![AdvancedCronjob](/img/docs/user-manuals/advancedcronjob.png)

## 用例

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

上述 YAML 定义了一个 AdvancedCronJob，每分钟创建一个 BroadcastJob 对象，这个 BroadcastJob 会在所有节点上运行一个 job 任务。

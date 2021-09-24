---
title: AdvancedCronJob
---

AdvancedCronJob is an enhanced version of CronJob.
The original CronJob creates Job reriodically according to schedule rule, but AdvancedCronJob provides template supported multpile job resources.

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

- jobTemplate：create Jobs reriodically, which is equivalent to original CronJob
- broadcastJobTemplate：create [BroadcastJobs](./broadcastjob) reriodically, which support to dispatch Jobs on every node

![AdvancedCronjob](/img/docs/user-manuals/advancedcronjob.png)

## Example

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

The YAML below defines an AdvancedCronJob. It will create a BroadcastJob every minute, which will run a job on every node.

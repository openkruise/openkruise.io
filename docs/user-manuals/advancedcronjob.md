---
title: AdvancedCronJob
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Note: v1beta1 available from Kruise v1.9.0**

AdvancedCronJob is an enhanced version of CronJob.
The original CronJob creates Job periodically according to schedule rule, but AdvancedCronJob provides template supported multiple job resources.

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

    # Options 3(future): ...
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

    # Option 3: use imageListPullJobTemplate, which will create an ImageListPullJobTemplate object when cron schedule triggers
    imageListPullJobTemplate:
      # ...

    # Options 4(future): ...
```
</TabItem>
</Tabs>

- jobTemplate：create Jobs periodically, which is equivalent to original CronJob
- broadcastJobTemplate：create [BroadcastJobs](./broadcastjob) periodically, which support to dispatch Jobs on every node
- imageListPullJobTemplate: create [ImageListPullJobs](./imagepulljob) periodically, which support to pull images on every node

![AdvancedCronjob](/img/docs/user-manuals/advancedcronjob.png)

## Example

### CronJob for BroadcastJob
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

The YAML above defines an AdvancedCronJob. It will create a BroadcastJob every minute, which will run a job on every node.

### CronJob for ImageListPullJob

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

The YAML above defines an AdvancedCronJob. It will create an ImageListPullJob every 2 hours, which will pull special images on the selected nodes.

**FEATURE STATE:** Kruise v1.9.0

We have introduce a `spec.template.imageListPullJobTemplate` field in v1.9.0.
You can set it to periodically schedule pulling images job on the selected nodes.

## Time zones

All CronJob schedule: times are based on the timezone of the kruise-controller-manager by default,
which means the timezone set for the kruise-controller-manager container determines the timezone that the cron job controller uses.

**FEATURE STATE:** Kruise v1.3.0

However, we have introduce a `spec.timeZone` field in v1.3.0.
You can set it to the name of a valid time zone name. For example, setting `spec.timeZone: "Etc/UTC"` instructs Kruise to interpret the schedule relative to Coordinated Universal Time.

A time zone database from the Go standard library is included in the binaries and used as a fallback in case an external database is not available on the system.

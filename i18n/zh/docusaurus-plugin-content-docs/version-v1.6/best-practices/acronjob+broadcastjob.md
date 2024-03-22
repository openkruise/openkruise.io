---
title: BroadcastJob + Advanced CronJob 定期清理节点磁盘
---
相较于 CPU、内存这类具有较高灵活性的资源，节点磁盘存储可用空间在 Kubernetes 原生体系中基本上处于一种单调递减的宿命，磁盘压力检测和控制成为节点运维必不可少的一环，否则过大的磁盘压力可能导致该节点无法调度，甚至导致节点上的 Pod 被驱逐等等一系列副作用，影响集群的稳定性。

Kubernetes Job 的作业模式显然非常合适做这类一次性的临时工作，因为它不像常驻宿主机的 Agent 需要消耗节点资源，Job 只需要临时地占用一些节点资源，任务执行完毕后会自动释放。然而 Kubernetes 原生 Job 在节点运维这类场景下，存在以下限制：
1. 默认的调度规则是随机的，一个节点上可能创建多个 Pod，造成重复作业的问题；
2. 无法自适应集群节点的规模，当集群中添加/删除一个节点时，需要运维人员手动调整 Job 的配置。

OpenKruise BroadcastJob 则很好地克服了原生 Job 在节点运维场景中的不足之处。它允许用户以类似 DaemonSet 调度的方式来编排 Pod，当用户创建 BroadcastJob 后，它会默认在集群的每一个 worker 节点创建一个 Pod，执行完成之后会自动对 Pod 进行清理。同时，搭配 Advanced CronJob，可以将 BroadcastJob 进行定时发下，从而实现定时清理节点磁盘的能力。本文会以定期清理节点中存储的无用镜像这一场景来进行演示如何使用 Advanced CronJob 和 BroadcastJob。

## 环境说明
受资源所限，我们在一台 ECS（宿主机）上面部署了一个 [kind](https://kind.sigs.k8s.io/)  集群进行演示（节点均采用 containerd）。 该 Kind 集群共包含三个节点，其中一个 master 节点，两个 worker 节点:
```shell
$ k get node
NAME                   STATUS   ROLES                  AGE   VERSION
control-plane   Ready    control-plane,master   42d   v1.21.1
worker          Ready    <none>                 42d   v1.21.1
worker2         Ready    <none>                 42d   v1.21.1
```

在演示之前，_我们可以先来看一下_ ECS（宿主机）的磁盘压力情况，方便跟清理之后的效果进行对比：
```shell
root@kruise:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            7.7G     0  7.7G   0% /dev
tmpfs           1.6G  1.4M  1.6G   1% /run
/dev/vda1        79G   63G   13G  84% /
tmpfs           7.7G     0  7.7G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           7.7G     0  7.7G   0% /sys/fs/cgroup
tmpfs           1.6G     0  1.6G   0% /run/user/0
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/94e3ec1c3a45a43e4ffa34c654bc3639007eb2fb5d4e9724fed056c6bb8d119f/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/7718d5a17be239ade398f907f82acf2c90fb7752a90a667114a573c60757d23b/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/0f78036c619c03fb37ec8029e5718bb206472971169bb2711bee06af21228763/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/029e008a7c5b754e4246c8fc55bf189c83a0b8b1df50c2ecb67d1734095b935b/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/899a50ca07b4e2de08d627dbb1e6f1cc9e1eb0c048a71c4905854f31bf51f056/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/c72de0669810b5dcbf4b2726c0c32765fbbb1e4c21826f59533414fb474c826a/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/af8c22b65e7ae64f15f0132baed91550adfe81cd4e088e2bb84e01476619340a/merged
overlay          79G   63G   13G  84% /var/lib/docker/overlay2/454a7e90cb3c723dc6b22b0d54e60714700b4c0bcf947b29206d882c6a2c25fe/merged
```

我们也来查看一下 worker 节点存储镜像的情况, 可以看到该节点目前有 125 个 images：
```shell
root@kruise:~# docker exec -it worker /bin/sh
$ crictl images | wc -l
125
$ crictl images
REPOSITORY                                TAG                  IMAGE ID          SIZE
docker.io/minchou/cleaner                 v1                   7e36ca8e9d40      68.6MB
docker.io/minchou/rollout                 v0.7.3               120dc8c670ef      57MB
docker.io/minchou/rollout                 v0.7.2               2f1f320cd94a      57MB
docker.io/minchou/rollout                 v0.7.1               c90679a2e4ff      57MB
docker.io/minchou/rollout                 v0.7.0               a81db48ec891      57MB
docker.io/minchou/rollout                 v0.6.2               af5ef616c30e      55.9MB
docker.io/minchou/rollout                 v0.6.1               71ba2e84e92e      55.9MB
docker.io/minchou/rollout                 v0.6.0               3fe9eb8f0144      55.9MB
... .... ... ....
```

## Advanced Cron Job 配置
job.yaml
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: AdvancedCronJob
metadata:
  name: acj-test
spec:
  schedule: "*/5 * * * *"
  startingDeadlineSeconds: 60
  template:
    broadcastJobTemplate:
      spec:
        template:
          spec:
            containers:
              - name: node-cleaner
                image: minchou/cleaner:v1
                imagePullPolicy: IfNotPresent
                env:
                # crictl use this env to find container runtime socket
                # this value should consistent with the path of mounted 
                # container runtime socket file 
                - name: CONTAINER_RUNTIME_ENDPOINT
                  value: unix:///var/run/containerd/containerd.sock
                volumeMounts:
                  # mount container runtime socket file to this path
                - name: containerd
                  mountPath: /var/run/containerd
            volumes:
            - name: containerd
              hostPath:
                path: /var/run/containerd
            restartPolicy: OnFailure
        completionPolicy:
          type: Always
          ttlSecondsAfterFinished: 90
        failurePolicy:
          type: Continue
          restartLimit: 3
```
因为需要拿到宿主机上的 containerd.socket 才能执行 `crictl rmi` 之类的镜像清理命令，因此此处需要以 hostPath 的方式将该 `containerd.sock` 文件进行挂载。如果你的宿主机上使用的是其他类型的容器运行时，也需要将其以这种方式挂载到 Pod。

类似的，如果你应用的日志也是直接写在宿主机目录下面，也可以用这种方式将其挂载到 `/temp/logs` Pod 目录下，一并进行清理。

为了更方便我们观察 job 运行的情况，这里将 CronJob 定义成每隔 5 分钟执行一次清除动作，即，定义 Advanced CronJob 的 `schedule` 字段为`"*/5 * * * *"`。实际上，真实的场景中，我们可以每隔几天甚至几周清理一次，具体配置方法参见 [Cron 表达式](https://pkg.go.dev/github.com/robfig/cron)。


## 镜像构建

文件目录结构：
```
$ tree
.
├── Dockerfile
├── cleaner.sh
└── crictl-v1.23.0-linux-amd64.tar.gz
```

为了打镜像快一点，我们将 [crictl-v1.23.0-linux-amd64.tar.gz](https://github.com/kubernetes-sigs/cri-tools/releases) 文件提前下载好，并放在与 Dockerfile 同一目录下。

### cleaner.sh 脚本示例

**注意：如果在生产环境中使用，请严格校验好自己的清除脚本！**

```shell
#!/bin/sh

echo "container runtime endpoint:" $CONTAINER_RUNTIME_ENDPOINT

# clean up docker resources if have
crictl ps > /dev/null
if [ $? -eq 0 ]
then
    # Implement your customized script here, such as
    # get the images that is used, these images cannot be deleted
    crictl ps | awk '{if(NR>1){print $2}}' > used-images.txt

    # @@ You can choose the images you want to clean according to your requirement @@
    # **      Here, we will clean all images from my docker.io/minchou repo!       **
    crictl images | grep -i "docker.io/minchou"| awk '{print $3}' > target-images.txt

    # filter out the used images and delete these unused images
    sort target-images.txt used-images.txt used-images.txt| uniq -u | xargs -r crictl rmi 
else
    echo "crictl does not exist"
fi

exit 0
```

### Dockerfile 示例
```shell
FROM alpine

COPY crictl-v1.23.0-linux-amd64.tar.gz ./
RUN  tar zxvf crictl-v1.23.0-linux-amd64.tar.gz -C /bin && rm crictl-v1.23.0-linux-amd64.tar.gz

COPY cleaner.sh /bin/
RUN chmod +x /bin/cleaner.sh 

CMD ["bash", "/bin/cleaner.sh"]
```

## 效果展示
打包镜像并上传至自己的镜像仓库，此处以我自己的 docker hub 仓库为例:
```
$ docker build . -t minchou/cleaner:v1 && docker push minchou/cleaner:v1
```

然后下发 Advanced CronJob 配置：
```
$ kubectl apply -f job.yaml
advancedcronjob.apps.kruise.io/acj-test created
```

可以在 Kruise 的日志中看到该 job 的下一次执行的时间为 2022-03-24 08:50:00 +0000 UTC：
```
$ kubectl -n kruise-system logs kruise-controller-manager-745594ff76-9nwwx --tail 1000 | grep "no upcoming scheduled times, sleeping until next now"
I0324 08:45:08.131928       1 advancedcronjob_broadcastjob_controller.go:290] no upcoming scheduled times, sleeping until next now 2022-03-24 08:45:08.131896998 +0000 UTC m=+535162.957711312 and next run 2022-03-24 08:50:00 +0000 UTC default/acj-test
```

到时间后，Advanced CronJob 开始执行。 我们来看一下 worker 节点的 Pod 日志：
```shell
$ kubectl logs acj-test-1648111800-8t8bx
container runtime endpoint: unix:///var/run/containerd/containerd.sock
Deleted: docker.io/minchou/rollout:v0.2.7
Deleted: docker.io/minchou/rollout:v0.4.1
Deleted: docker.io/minchou/rollout:v0.7.3
Deleted: docker.io/minchou/rollout:br-5
Deleted: docker.io/minchou/rollout:v0.4.2
Deleted: docker.io/minchou/kruiserollout:br-f
Deleted: docker.io/minchou/rollout:v0.7.2
Deleted: docker.io/minchou/rollout:v0.4.0
Deleted: docker.io/minchou/rollout:v0.3.8
Deleted: docker.io/minchou/rollout:v0.3.0
Deleted: docker.io/minchou/kruiserollout:br-2
Deleted: docker.io/minchou/rollout:br-3
... ... ... ...
```
可见 `cleaner.sh` 脚本起作用了，目标镜像已经被删除，然后我们再看一下 ECS（宿主机）的磁盘压力：

```shell
root@kruise011162126109:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            7.7G     0  7.7G   0% /dev
tmpfs           1.6G  1.4M  1.6G   1% /run
/dev/vda1        79G   44G   32G  59% /
tmpfs           7.7G     0  7.7G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           7.7G     0  7.7G   0% /sys/fs/cgroup
tmpfs           1.6G     0  1.6G   0% /run/user/0
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/94e3ec1c3a45a43e4ffa34c654bc3639007eb2fb5d4e9724fed056c6bb8d119f/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/7718d5a17be239ade398f907f82acf2c90fb7752a90a667114a573c60757d23b/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/0f78036c619c03fb37ec8029e5718bb206472971169bb2711bee06af21228763/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/029e008a7c5b754e4246c8fc55bf189c83a0b8b1df50c2ecb67d1734095b935b/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/899a50ca07b4e2de08d627dbb1e6f1cc9e1eb0c048a71c4905854f31bf51f056/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/c72de0669810b5dcbf4b2726c0c32765fbbb1e4c21826f59533414fb474c826a/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/af8c22b65e7ae64f15f0132baed91550adfe81cd4e088e2bb84e01476619340a/merged
overlay          79G   44G   32G  59% /var/lib/docker/overlay2/454a7e90cb3c723dc6b22b0d54e60714700b4c0bcf947b29206d882c6a2c25fe/merged
```

可以看到磁盘压力已经从之前的 84% 下降到了 59%，下降还是较为显著的。 最后我们再从 kruise 的日志中捞一下下一次的执行时间，可以看到下次执行确实是 5 分钟后（2022-03-24 08:55:00 +0000 UTC）：
```
$ kubectl -n kruise-system logs kruise-controller-manager-745594ff76-9nwwx --tail 1000 | grep "no upcoming scheduled times, sleeping until next now"
I0324 08:50:02.226008       1 advancedcronjob_broadcastjob_controller.go:290] no upcoming scheduled times, sleeping until next now 2022-03-24 08:50:02.225973654 +0000 UTC m=+535457.051787976 and next run 2022-03-24 08:55:00 +0000 UTC default/acj-test
```


## 总结
通过上面的例子可以看到 Advanced CronJob + BroadcastJob + 自定义脚本的组合可以轻松地做到定时清理节点无用镜像的能力。当然，这也只是一个简单的节点运维示例，如果你遇到其他类似的需要定期运维节点的需求，希望上述示例会对你有所启发和帮助。




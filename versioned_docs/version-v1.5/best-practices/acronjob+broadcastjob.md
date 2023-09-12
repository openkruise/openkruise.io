---
title: BroadcastJob + Advanced CronJob Help You Maintain Kubernetes Nodes
---
Kubernetes node operation and maintenance is always a tedious work. For example, the available storage space in node is basically in a nearly monotonous decreasing trend in the native Kubernetes system. However, excessive disk pressure may lead to a series of problems, such as un-schedule of the nodes, and the eviction of pods, affecting the stability of the cluster.

Kubernetes job is obviously very suitable for this kind of one-time temporary work, such as cleaning up disk, because unlike the agent process running in host,  Kubernetes job only needs to temporarily use some resources, and it will be automatically released the resources after the task is completed. But, Kubernetes native jobs have the following limitations in the scenarios of node operation and maintenance:
1. Its default scheduling rule is unsuitable. Multiple pods may be scheduled to the same node, causing the problem of repeated execution of jobs;
2. It cannot automatically perceive the scale of cluster nodes. When a node is added/deleted to/from the cluster, the job configuration must be updated manually.

Openkruise provides BroadcastJob and Advanced CronJob features to solve such problems. BroadcastJob allows users to schedule the pods in a way similar to DaemonSet. When a user apply a BroadcastJob, it will create pods for each worker node of the cluster by default, and these pods will be cleaned up automatically when the task is completed. Furthermore, Advanced CronJob can create the BroadcastJob periodically. This article will demonstrate how to use Advanced CronJob and BroadcastJob to periodically clean up useless images stored in Kubernetes nodes to help you understand these features.

## Environment
We deployed a [kind](https://kind.sigs.k8s.io/) cluster on an ECS (host), and all kind nodes adopt containerd as container runtime. The kind cluster consists of three nodes, including one master node and two worker nodes:
```shell
$ k get node
NAME                   STATUS   ROLES                  AGE   VERSION
control-plane   Ready    control-plane,master   42d   v1.21.1
worker1         Ready    <none>                 42d   v1.21.1
worker2         Ready    <none>                 42d   v1.21.1
```

Before the demonstration, we should take a look at the disk pressure of ECS (host), to compare with the effect after demonstration:
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

Also, Let's take a look at the images in the worker1 node. We can see that this node currently has 125 images:
```shell
root@kruise:~# docker exec -it worker1 /bin/sh
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

## Advanced Cron Job Configuration
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
                # crictl use this env to find conatiner runtime socket.
                # this value should consistent with the path of mounted 
                # container runtime socket file.
                - name: CONTAINER_RUNTIME_ENDPOINT
                  value: unix:///var/run/containerd/containerd.sock
                volumeMounts:
                  # mount container runtime socket file to this path.
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
Because we need to get the containerd.socket to execute image cleaning commands such as `crictl rmi ` in the pod. Therefore, the containerd socket file of host must be mounted to the pod in the way of `hostPath`. If other types of containers are used on your host, you also need to mount them to the pods in this way.

Similarly, if your application log is also written directly under the host path, you can also mount it  in this way and clean it together.

In order to make it easier for us to observe the operation of Advanced CronJob, we define its schedule period 5 minutes, that is, the `schedule` field is defined as `* / 5 * * *`. In fact, in the real scene, we can clean it every few days or weeks instead of 5 minutes. You can refer to [cron expression](https://pkg.go.dev/github.com/robfig/cron) to customize the schedule.


## Build Image

File directory structure:
```
$ tree
.
├── Dockerfile
├── cleaner.sh
└── crictl-v1.23.0-linux-amd64.tar.gz
```

In order to build the image faster, we downloaded [crictl-v1.23.0-linux-amd64.tar.gz](https://github.com/kubernetes-sigs/cri-tools/releases) and put it in the same directory as `Dockerfile`.

### Script Sample 
**Note: if it is used in the production, please strictly verify your script!**

cleaner.sh
```shell
#!/bin/sh

echo "container runtime endpoint:" $CONTAINER_RUNTIME_ENDPOINT

# clean up docker resources if have
crictl ps > /dev/null
if [ $? -eq 0 ]
then
    # Implement your customized script here, such as:
    
    # get the images that is used, these images cannot be deleted
    crictl ps | awk '{if(NR>1){print $2}}' > used-images.txt

    # @@ You can choose the images you want to clean according to your requirement @@
    # **      Here, we will clean all images from my docker.io/minchou repo!       **
    crictl images | grep -i "docker.io/minchou"| awk '{print $3}' > target-images.txt

    # filter out the used images and delete thoese unused images
    sort target-images.txt used-images.txt used-images.txt| uniq -u | xargs -r crictl rmi 
else
    echo "crictl does not exist"
fi

exit 0
```

### Dockerfile Sample
```shell
FROM alpine

COPY crictl-v1.23.0-linux-amd64.tar.gz ./
RUN  tar zxvf crictl-v1.23.0-linux-amd64.tar.gz -C /bin && rm crictl-v1.23.0-linux-amd64.tar.gz

COPY cleaner.sh /bin/
RUN chmod +x /bin/cleaner.sh 

CMD ["bash", "/bin/cleaner.sh"]
```

## Results Show
Build the image and upload it to your own image repo. Here, take my own docker hub repo as an example:

```
$ docker build . -t minchou/cleaner:v1 && docker push minchou/cleaner:v1
```

Then apply the Advanced CronJob configuration:
```
$ kubectl apply -f job.yaml
advancedcronjob.apps.kruise.io/acj-test created
```

We can see that the next execution time is 2022-03-24 08:50:00 +0000 UTC in kruise log：
```
$ kubectl -n kruise-system logs kruise-controller-manager-745594ff76-9nwwx --tail 1000 | grep "no upcoming scheduled times, sleeping until next now"
I0324 08:45:08.131928       1 advancedcronjob_broadcastjob_controller.go:290] no upcoming scheduled times, sleeping until next now 2022-03-24 08:45:08.131896998 +0000 UTC m=+535162.957711312 and next run 2022-03-24 08:50:00 +0000 UTC default/acj-test
```


When the time is up, the advanced cronjob applied a BroadcastJob, and let's take a look at the log of the pod that is created by BroadcastJob for worker1 node:
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
we can see that `cleaner.sh` script works, the target image has been deleted. Then, let's take a look at the disk pressure of ECS (host):
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

It can be seen that the disk pressure has decreased from 84% to 59%, which is very significant. Finally, we also can find out the next execution time from kruise's log, the next execution is really 5 minutes later (2022-03-24 08:55:00 + 0000 UTC):
```
$ kubectl -n kruise-system logs kruise-controller-manager-745594ff76-9nwwx --tail 1000 | grep "no upcoming scheduled times, sleeping until next now"
I0324 08:50:02.226008       1 advancedcronjob_broadcastjob_controller.go:290] no upcoming scheduled times, sleeping until next now 2022-03-24 08:50:02.225973654 +0000 UTC m=+535457.051787976 and next run 2022-03-24 08:55:00 +0000 UTC default/acj-test
```


## Conclusion
From the above demonstration, we can see that the `Advanced Cronjob + BroadcastJob + Customized Script` can help you clean up useless images of nodes periodically. Of course, this is just a simple example of node operation and maintenance. If you encounter the similar problems, I hope this article can help and inspire you.




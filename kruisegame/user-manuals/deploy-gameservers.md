# Deploy Gameservers

## “Hello World” of OKG
You can use GameServerSet to deploy game servers. A simple deployment case is as follows:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
EOF
```

After the GameServerSet is created, three game servers and three corresponding pods appear in the cluster, because the specified number of replicas is 3.

```bash
kubectl get gss
NAME        AGE
minecraft   9s

kubectl get gs
NAME          STATE   OPSSTATE   DP    UP   AGE
minecraft-0   Ready   None       0     0    10s
minecraft-1   Ready   None       0     0    10s
minecraft-2   Ready   None       0     0    10s

kubectl get pod
NAME            READY   STATUS    RESTARTS   AGE
minecraft-0     1/1     Running   0          10s
minecraft-1     1/1     Running   0          10s
minecraft-2     1/1     Running   0          10s
```


## ID awareness

Due to the stateful nature of game servers, they usually need unique identifiers to distinguish each other. This is why the name of the GameServer managed by GameServerSet ends with an ID number.

In some cases, the game server business itself needs to be aware of its own ID, which can be used as a regional server attribute mark or a basis for configuration management.
At this time, the corresponding identification ID can be sunk into the container through DownwardAPI. Here's an example:

Deploy a GameServerSet, and the environment variable GS_NAME in the generated game server container will have the corresponding name as its value:

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: minecraft
  namespace: default
spec:
  replicas: 3
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
          name: minecraft
          env:
          - name: GS_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
```

3 game servers will be generated:

```bash
kubectl get gs
NAME          STATE   OPSSTATE   DP    UP    AGE
minecraft-0   Ready   None       0     0     31s
minecraft-1   Ready   None       0     0     31s
minecraft-2   Ready   None       0     0     31s
```

Check the GS_NAME environment variables of these three game servers separately and find that the GS_NAME of the three game servers corresponds to their own names.

```bash
kubectl exec  minecraft-0 -- env | grep GS_NAME
GS_NAME=minecraft-0

kubectl exec  minecraft-1 -- env | grep GS_NAME
GS_NAME=minecraft-1

kubectl exec  minecraft-2 -- env | grep GS_NAME
GS_NAME=minecraft-2
```

In this way, the game program can perform configuration management and other operations by parsing the GS_NAME environment variable when it is started.

## Service discovery of game server stateful instances

Due to the stateful nature of game servers, access often requires specific pod instances, and the load balancing features of traditional k8s services cannot be used. OKG supports the DNS mechanism of stateful services to achieve interactive access between game servers within the cluster.

The following example will involve two services, the minecraft game server and the accessor. Minecraft is called by the accessor.

### Service registration

Normally, when a game server needs to be accessed internally, it needs to register its own information with the corresponding service so that the accessor can know which pods are accessible; correspondingly, when the game server exits, it also needs corresponding structural actions, such as deregistration. The accessor knows that the pod no longer provides services.

As mentioned earlier, the only identifier of the game server is its ID (or name). Use the DownwardAPI mentioned above to sink GS_NAME into the container, and then register it with the corresponding service when the container starts.

After the Yaml deployment is completed according to the previous article, there are 3 minecraft pods in the cluster:

```bash
kubectl get po -owide
...
minecraft-0     1/1     Running   0     10s     172.16.0.64     xxx       <none>           2/2
minecraft-1     1/1     Running   0     10s     172.16.0.6      xxx       <none>           2/2
minecraft-2     1/1     Running   0     10s     172.16.0.12     xxx       <none>           2/2
```

### DNS

In order to enable the pod of the game server to be accessed individually, in addition to deploying GameServerSet, it is also necessary to deploy a headless service with the same name as GameServerSet. In this example, its Yaml is as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minecraft
spec:
  clusterIP: None
  selector:
    game.kruise.io/owner-gss: minecraft # Fill in the name of GameServerSet
```

Deploy a simple accessor Yaml to access the corresponding minecraft pod within the container

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: accessor
  namespace: default
spec:
  replicas: 1
  gameServerTemplate:
    spec:
      containers:
        - image: busybox
          name: accessor
          args:
            - sleep
            - "3600"
          command: ["/bin/sh", "-c", "sleep 3600"]
```

Enter the accessor container and ping the corresponding minecraft pod (this step simulates the access logic in the real environment. Of course, choosing which pod to access requires certain filtering rules):

```bash
kubectl exec -it accessor-0 /bin/sh
/ # 
/ # ping minecraft-2.minecraft.default.svc.cluster.local
PING minecraft-2.minecraft.default.svc.cluster.local (172.16.0.12): 56 data bytes
64 bytes from 172.16.0.12: seq=0 ttl=63 time=0.082 ms
64 bytes from 172.16.0.12: seq=1 ttl=63 time=0.061 ms
64 bytes from 172.16.0.12: seq=2 ttl=63 time=0.072 ms
```

It can be found that the accessor successfully accessed minecraft-2, and the DNS successfully resolved to the corresponding intranet IP address. The DNS rules here are as follows: `{pod-name}.{gss-name}.{namespace-name}.svc.cluster.local`

## Synchronization of Labels/Annotations from GameServer to Pod

As mentioned above, through the DownwardAPI, information from pod labels/annotations can be propagated downwards into containers. Sometimes, we wish to synchronize the labels/annotations of a GameServer to its Pod, in order to complete the action of sinking GameServer metadata information.

```bash
kubectl patch gs minecraft-0 --type='merge' -p '{"metadata":{"annotations":{"gs-sync/test-key":"some-value"}}}'
gameserver.game.kruise.io/minecraft-0 patched
```

Then, we get pod minecraft-0:

```bash
kubectl get po minecraft-0 -oyaml | grep gs-sync
    gs-sync/test-key: some-value
```

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

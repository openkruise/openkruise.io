# Best Practice for Shard-Memory of GameServers

## Background

Memory-sensitive game services refer specifically to game servers that require large memory resources. They often need to load many resources into the memory during startup to improve the player's game interaction experience. But precisely because of this, it has brought about 1) the problem of slow startup speed of game servers and low efficiency during version updates; 2) the same memory data exists between game servers but cannot be used, and node memory resources are excessively wasted.

Game developers often use shared memory technology to solve the above problems to improve game server startup efficiency and memory resource efficiency. Usually, there is an init process that performs the function of initializing the loading of the game server and writing data to the shared memory; after that, all newly created game servers on the machine do not need to repeat the process and only need to read the same address. The corresponding memory data is enough, the startup speed is improved, and the memory resources are reused, without causing waste of resources.

This article will focus on the shared memory usage of containerized game servers and provide best practices.

## Solution Introduction

The solution involves two types of processes. For example, the init process mentioned above writes memory; the gs process reads memory at startup.

<img src={require('/static/img/kruisegame/best-practices/shm-arch.png').default} style={{  width: '500px'}} />

As shown in the architecture diagram above, the init process is managed using DaemonSet, and each game server node deploys one init; while the gs process is managed using GameServerSet, and each node can have multiple gs. When the DaemonSet deployment is completed and the corresponding init pod is successfully executed, deploy the GameServerSet and start the game server. At this time, gs will start quickly, and gs on the same node will initially reuse the same memory space.

## Example

### 1. init process program example (write memory)

Use the following code to create a shared memory, and then write id data to the memory every second. The id will increase by one every second.

```cpp
#include<sys/ipc.h>
#include<sys/types.h>
#include<sys/shm.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

typedef struct _msg
{
    int  id;
    char str[64];
}MSG;

int main()
{
    MSG* msg;

    key_t key = ftok("./",2015);
    if(key == -1)
    {
        perror("ftok");
        exit(-1);
    }

	int shd = shmget(key,sizeof(MSG),IPC_CREAT | 0666);
    if(shd == -1)
    {
        perror("shmget");
        exit(-1);
    }

    msg = (MSG*)shmat(shd,NULL,0);
    if(msg == (MSG*)-1)
    {
        perror("shmat");
        exit(-1);
    }

    memset((void*)msg,0,sizeof(MSG));
    for(int i = 0;i < 100000;i++)
    {
        msg->id = i;
        printf("msg->id = %d\n",msg->id);
        sleep(1);
    }

    system("ipcs -m");

    return 0;
}
```

### 2. gs process program example (reading memory)

The following is the code for reading shared memory. The code obtains the shared memory data with shm_id 0 and prints the id data in a loop.

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/shm.h>

int main() {
    int shm_id;
    void *shared_memory;

    shm_id = 0;
    printf("shm_id: %d\n", shm_id);
//    if (shm_id == -1) {
//        perror("shmget failed");
//        exit(1);
//    }

    shared_memory = shmat(shm_id, NULL, 0);
    if (shared_memory == (void *) -1) {
        perror("shmat failed");
        exit(1);
    }

    while(1) {
        printf("Value from shared memory: %d\n", *((int *)shared_memory));
    }

    if (shmdt(shared_memory) == -1) {
        perror("shmdt failed");
        exit(1);
    }

    return 0;
}
```

### 3. Make Container Images

The Dockerfile of gs process is as follows (init process is similar):

```docker
FROM gcc:latest

WORKDIR /usr/src/myapp
COPY . .

RUN gcc -o read read.c

USER root

RUN chmod 777 /usr/src/myapp/read

EntryPoint ["/usr/src/myapp/read"]

CMD ["sleep 300000"]
```

### 4. Deploy init process

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: shm-daemonset
  namespace: default
spec:
  selector:
    matchLabels:
      name: init
  template:
    metadata:
      labels:
        name: init
    spec:
      hostIPC: true #When hostIPC: true is set, the Pod will use the IPC namespace of the host. Pods using the host IPC can access the shared memory segment on the host.
      nodeSelector:
        app: shared-mem #Select the nodes using shared memory by labels.
      containers:
      - name: init
        image: registry.cn-hangzhou.aliyuncs.com/skkk/testc:write27_v2
        volumeMounts:
        - name: shm
          mountPath: /dev/shm
      volumes:
      - name: shm
        hostPath:
          path: /dev/shm
          type: Directory
```

After creating ds, you can see the created shared memory on the host
<img src={require('/static/img/kruisegame/best-practices/shm-host-ipcs.png').default} style={{  width: '500px'}} />


You can see in the container log that the value of the id is modified every second
<img src={require('/static/img/kruisegame/best-practices/shm-init-log.png').default} style={{  width: '200px'}} />


### 5. Deploy gs process

Create gs to read the value of id from shared memory

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gameserver
  namespace: default
spec:
  replicas: 2
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  gameServerTemplate:
    spec:
      hostIPC: true
      nodeSelector:
        app: shared-mem
      containers:
      - image: registry.cn-hangzhou.aliyuncs.com/skkk/testc:readtest
        imagePullPolicy: Always
        name: gs
        volumeMounts:
          - name: shm
            mountPath: /dev/shm
      volumes:
        - hostPath:
            path: /dev/shm
            type: Directory
          name: shm
```

After successful deployment, you can see in the container log that the ID value in the shared memory has been obtained.
<img src={require('/static/img/kruisegame/best-practices/shm-gs-log.png').default} style={{  width: '200px'}} />

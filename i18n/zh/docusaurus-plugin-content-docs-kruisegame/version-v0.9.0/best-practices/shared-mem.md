# 游戏服共享内存最佳实践

## 背景说明

内存敏感型游戏服务，特指对于内存资源需求较大的游戏服，在启动时往往需要加载众多资源到内存之中以提升玩家游戏交互体验。但也正因于此，带来了1）游戏服启动速度慢、版本更新时效率低；2）游戏服之间存在相同内存数据但无法被服用，节点内存资源被过度浪费的问题。

游戏开发者往往使用共享内存技术来解决上述问题，以提升游戏服启动效率和内存资源效率。通常，存在一个init进程，执行游戏服初始化加载的功能，将数据写入共享内存；在此之后，在该机器上新创建的所有游戏服都无需重复执行该过程，只需读取同一块地址对应的内存数据即可，启动速度提升了，且内存资源被复用，不会造成资源浪费。

本文将关注容器化游戏服共享内存使用方案，提供最佳实践。

## 方案介绍

方案涉及到两种类型的进程，如上文中提到的init进程，进行写内存；gs进程在启动时进行读内存。

<img src={require('/static/img/kruisegame/best-practices/shm-arch.png').default} style={{  width: '500px'}} />


架构图若上所示，init进程使用DaemonSet进行管理，每个游戏服节点部署一个init；而gs进程使用GameServerSet进行管理，每个节点可以有多个gs。当DaemonSet部署完成并且对应的init pod成功执行后，进行GameServerSet部署，开启游戏服。此时，gs将快速启动，并且同一个节点上的gs会初始时复用同一块内存空间。

## 实践示例

### 1. init进程程序示例（写内存）

使用下面代码创建一块共享内存，然后每隔一秒向内存写入id数据，id每秒递增加一

```cpp
/* study.cpp 写端代码 */
#include<sys/ipc.h>
#include<sys/types.h>
#include<sys/shm.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

/* 用于传递消息的结构体 */
typedef struct _msg
{
    int  id;
    char str[64];
}MSG;

int main()
{
    MSG* msg;

    /* 获取键值 */
    key_t key = ftok("./",2015);
    if(key == -1)
    {
        perror("ftok");
        exit(-1);
    }

    /* 创建或打开一块共享内存，并返回内存标识符 */
	int shd = shmget(key,sizeof(MSG),IPC_CREAT | 0666);
    if(shd == -1)
    {
        perror("shmget");
        exit(-1);
    }

    /* 映射内存地址到当前进程，并返回内存块的地址 */
    msg = (MSG*)shmat(shd,NULL,0);
    if(msg == (MSG*)-1)
    {
        perror("shmat");
        exit(-1);
    }

    /* 改变内存地址的数据 */
    memset((void*)msg,0,sizeof(MSG));
    for(int i = 0;i < 100000;i++)
    {
        msg->id = i;
        printf("msg->id = %d\n",msg->id);
        sleep(1);
    }

    /* 查看系统中的共享内存 */
    system("ipcs -m");

    return 0;
}
```

### 2. gs进程程序示例（读内存）

以下为读取共享内存的代码, 代码获取shm_id为0的共享内存数据，循环打印id数据。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/shm.h>

int main() {
    int shm_id;
    void *shared_memory;

    // 获取共享内存标识符
    shm_id = 0;
    printf("shm_id: %d\n", shm_id);
//    if (shm_id == -1) {
//        perror("shmget failed");
//        exit(1);
//    }

    // 连接共享内存
    shared_memory = shmat(shm_id, NULL, 0);
    if (shared_memory == (void *) -1) {
        perror("shmat failed");
        exit(1);
    }

    // 读取共享内存数据
    while(1) {
        printf("Value from shared memory: %d\n", *((int *)shared_memory));
    }

    // 断开与共享内存的连接
    if (shmdt(shared_memory) == -1) {
        perror("shmdt failed");
        exit(1);
    }

    return 0;
}
```

### 3. 制作镜像

gs的Dockerfile如下（init 与之类似）：

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

### 4. 部署init进程

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
      hostIPC: true #设置 hostIPC: true 时，Pod将使用宿主机的IPC命名空间,使用宿主IPC的Pod可以访问宿主机上的共享内存段
      nodeSelector:
        app: shared-mem #通过标签控制共享内存作用的节点范围
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

创建ds后，可以在宿主机上看到创建的共享内存
<img src={require('/static/img/kruisegame/best-practices/shm-host-ipcs.png').default} style={{  width: '500px'}} />


可以在容器日志中看到每隔一秒修改id的值
<img src={require('/static/img/kruisegame/best-practices/shm-init-log.png').default} style={{  width: '200px'}} />


### 5. 部署gs进程

创建gs从共享内存中读取id的值

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

部署成功后在容器日志中可以看到已经获取到共享内存中的id值
<img src={require('/static/img/kruisegame/best-practices/shm-gs-log.png').default} style={{  width: '200px'}} />

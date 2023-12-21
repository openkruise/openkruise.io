# 游戏服运维控制台

OpenKruiseGame基于KubeSphere 4.0 LuBan架构提供了游戏服白屏化管理控制台。本文介绍如何安装KubeSphere 与 OKG 游戏服运维控制台，以及对应的使用说明。

当前OKG Dashboard版本：0.1.0



## 安装KubeSphere 与 OKG Dashboard

### 安装KubeSphere 4.0

通过helm安装:

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-0.4.0.tgz
```

显示以下信息，则为安装成功：

```
Release "ks-core" does not exist. Installing it now.

NAME: ks-core
LAST DEPLOYED: Wed Dec 20 19:59:19 2023
NAMESPACE: kubesphere-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Please wait for several seconds for KubeSphere deployment to complete.

1. Make sure KubeSphere components are running:

     kubectl get pods -n kubesphere-system

2. Then you should be able to visit the console NodePort:

     Console: http://xxx.xx.x.xx:30880

3. To login to your KubeSphere console:

     Account: admin
     Password: "P@88w0rd"
     NOTE: Please change the default password after login.

For more details, please visit https://kubesphere.io.
```

默认情况下，ks-console暴露方式是nodeport，若希望更改暴露方式，则安装后编辑对应svc，如更改为LoadBalancer：
```
kubectl edit svc ks-console -n kubesphere-system
...
  type: LoadBalancer
...
```

有关KubeSphere更多安装说明，请参考：https://docs.kubesphere.com.cn/v4.0/03-install-and-uninstall/01-install-ks-core

### 安装OKG Dashboard

安装KubeSphere完成后，访问控制台，点击扩展市场：

![](/img/kruisegame/user-manuals/dash-mainpage.png)

选择OKG Dashboard，点击订阅。OKG Dashboard完全免费，提交订单即可。支付成功后返回扩展市场，此时订阅按钮已转变为管理按钮：

![](/img/kruisegame/user-manuals/dash-okg.png)

进入OKG Dashboard管理页面，点击安装：

![](/img/kruisegame/user-manuals/dash-management.png)

根据弹出的窗口，依次 1）选择版本点击下一步；2）开始安装：

![](/img/kruisegame/user-manuals/dash-version-select.png)

![](/img/kruisegame/user-manuals/dash-begin-install.png)

安装成功后，可以看到界面显示已安装，并处于启用状态：

![](/img/kruisegame/user-manuals/dash-installed.png)

## 使用说明

OKG Dashboard 为集群级别组件。选择要操作的集群，进入后，看到左边导航栏，点击“游戏服运维管理”：

![](/img/kruisegame/user-manuals/dash-ops.png)

### 概览页

点击“游戏服运维管理”后，默认进入概览页。概览页统计了当前集群中游戏服处于不同状态的数量

![](/img/kruisegame/user-manuals/dash-overview.jpg)

字段说明

- 总数：当前集群中，GameServer的总计数量
- 正在创建：当前集群中，State 为 Creating 的 GameServer数量
- 正在更新：当前集群中，State 为 Updating 的 GameServer数量
- 正在删除：当前集群中，State 为 Deleting 的 GameServer数量
- Ready：当前集群中，State 为 Ready 的 GameServer数量
- NotReady：当前集群中，State 为 NotReady 的 GameServer数量
- 使用OKG网络：当前集群中，使用了OKG网络模型 的 GameServer数量
- 网络Ready：当前集群中，使用了OKG网络模型 且 NetworkState 为 Ready 的 GameServer数量
- 默认运维状态：当前集群中，opsState 为 None 的 GameServer数量
- 已被分配：当前集群中，opsState 为 Allocated 的 GameServer数量
- 待删除：当前集群中，opsState 为 WaitToBeDeleted 的 GameServer数量
- 正在维护：当前集群中，opsState 为 Maintaining 的 GameServer数量


### 游戏服部署集列表页

点击“游戏服部署集”，查看当前集群所有GameServerSet

![](/img/kruisegame/user-manuals/dash-gss.png)

字段说明
- 模版镜像：GameServerTemplate设置的Image。格式为： {容器名称} -> {镜像名称及版本}
- 模版资源配置：GameServerTemplate设置的Resources。格式为： {容器名称} -> { cpu request / mem request / cpu limit / mem limit }，留白意味着未设置对应字段。

操作
- 跳转资源页查看详情
  ![](/img/kruisegame/user-manuals/dash-gss-jump.png)
  在GameServerSet详情页，可以编辑对应Yaml，或者删除对应对象：
  ![](/img/kruisegame/user-manuals/dash-gss-ops.png)


### 游戏服列表页

点击“游戏服”，查看当前集群所有GameServer

![](/img/kruisegame/user-manuals/dash-gs.png)

字段说明

- 运行镜像：当前游戏服运行的镜像及版本，可能与对应GameServerSet的GameServerTemplate设置的镜像不同。格式为： {容器名称} -> {镜像名称及版本}
- 游戏服异常情况：GameServerStatus Condition State 为 False 的情况将在此显示。

操作
- 跳转资源页查看详情
  ![](/img/kruisegame/user-manuals/dash-gs-jump.png)
  在GameServer详情页，可以编辑对应Yaml，或者删除对应对象：
  ![](/img/kruisegame/user-manuals/dash-gs-ops.png)
- 更新运维状态
  ![](/img/kruisegame/user-manuals/dash-gs-update-opsState.png)
  弹窗显示后，输入希望更改的opsState，点击OK即可更新：
  ![](/img/kruisegame/user-manuals/dash-gs-opsState-updated.png)

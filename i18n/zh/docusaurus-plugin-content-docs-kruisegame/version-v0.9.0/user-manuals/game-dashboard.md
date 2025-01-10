# 游戏服运维控制台

OpenKruiseGame基于KubeSphere 4.0 LuBan架构提供了游戏服白屏化管理控制台。本文介绍如何安装KubeSphere 与 OKG 游戏服运维控制台，以及对应的使用说明。

当前OKG Dashboard版本：2.0.0

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

OpenKruise Dashboard 2.0 是一个复杂的基于 Web 的界面，旨在管理跨 Kubernetes 集群的游戏服务器部署。
该仪表板充当综合管理工具，为用户提供监视、配置和控制游戏服务器基础设施各个方面的能力，专为游戏部署场景量身定制。

### 多集群模式

#### 核心概念

##### 部署单元
- **定义**：DeployUnit 代表一个 Kubernetes 集群或一组部署游戏服务器的集群。每个 DeployUnit 都是一个托管环境，在其中创建和维护 GameServerSet 和 GameServer。
- **特征**：
  - **集群管理**：查看和管理指定为 DeployUnit 的多个 Kubernetes 集群。
  - **资源分配**：监控和分配 CPU 和内存等资源，以确保每个 DeployUnit 内游戏服务器的最佳性能。
  - **部署控制**：管理每个 DeployUnit 内游戏服务器部署的生命周期。

##### 项目
- **定义**：OKG 仪表板中的项目是 GameServerSet 的逻辑分组，代表完整的游戏或需要隔离管理的游戏的特定部分。
- **特征**：
  - **有组织的管理**：按逻辑对 GameServerSet 和 GameServer 进行分组，将它们作为单个游戏项目的一部分进行管理。
  - **隔离**：项目为游戏的不同部分或不同的游戏提供隔离，并且允许集中管理。
  - **资源监控**：跟踪项目内所有 GameServerSet 的资源使用情况，确保平衡和高效的使用。

##### 全局配置页
- **用途**：全局配置页面允许用户设置和管理影响整个 OKG 仪表板的全局设置。这包括定义项目标签、配置 DeployUnit 和设置全局策略。
- **特征**：
  - **项目标签键**：定义用于标识 GameServerSet 和 Gameserver 属于哪个项目的标签键。这对于跨 DeployUnit 组织 GameServerSet 和 GameServer 至关重要。
    - **注意**：确保此处定义的项目标签键与部署 GameServerSets 时使用的标签键匹配。 GameServerSet YAML 文件中的项目名称应与全局配置中的配置保持一致，以确保正确的组织和功能。

    **GameServerSet 的 YAML 示例**：

      ```yaml
        apiVersion: game.kruise.io/v1alpha1
        kind: GameServerSet
        metadata:
          labels:
            # The GameServerSets that have this label can be recognized by the Dashboard.
            project-name: project-new
          name: game-new
          namespace: default
        spec:
          replicas: 5
          updateStrategy:
            rollingUpdate:
              podUpdatePolicy: InPlaceIfPossible
          gameServerTemplate:
            reclaimPolicy: Delete
            metadata:
              labels:
                # The GameServers that have this label can be recognized by the Dashboard.
                project-name: project-new
            spec:
              containers:
                - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
                  name: minecraft

  - **DeployUnits 配置**：通过在仪表板中指定要视为 DeployUnit 的集群来管理 DeployUnit 列表。

- **用户操作**：
  - **标签配置**：设置和更新项目标签键以确保 GameServerSet 和 GameServer 的正确组织。
  - **DeployUnit 管理**：在 DeployUnit 列表中添加或删除集群，以控制 GameServerSet 的部署位置。

![](/img/kruisegame/user-manuals/dash-config.png)

#### 项目页面
- **用途**：OKG 仪表板中的项目页面充当中心枢纽，用于组织和管理跨不同逻辑分组（称为项目）的游戏服务器部署。此页面旨在为用户提供所有项目的深入视图，从而实现跨多个 DeployUnit 的资源的高效管理和监控。
- **特征**：
  - **项目清单**：
    - 项目页面以表格形式显示所有项目，其中每一行或每张卡片代表一个项目。为每个项目提供的关键信息包括：
      - **项目名称**：项目的标识符。
      - **GameServerSet Count**：与项目关联的 GameServerSet 数量。
      - **GameServer Count**：项目内运行的 GameServer 总数。
      - **DeployUnits**：列出部署项目的 DeployUnit（Kubernetes 集群）的数组。
  - **跨 DeployUnit 管理**：项目页面使用户能够在单个项目中跨多个 DeployUnit 管理 GameServerSet 和 GameServer。此功能可确保根据项目的需求一致地管理和部署资源，无论底层基础设施如何。
- **用户操作**：
  - **项目导航**：用户可以从列表中选择任何项目来查看其 GameServerSet 和 GameServer 的详细概述。此详细视图允许用户深入了解项目的特定方面，全面了解其部署状态。
  - **资源监控**：项目页面允许用户监控每个项目内的资源分配和使用情况。这确保了项目有效地利用集群资源，防止过度分配或资源匮乏。
  - **操作控制**：用户可以对项目内的GameServerSet和GameServer执行各种操作，包括：
    - **扩展 GameServerSets**：调整副本数量以满足当前需求。
    - **更新容器映像**：在整个项目中推出新的容器映像以部署更新的游戏服务器版本。
    - **推出新配置**：实施新配置或更新现有配置以优化性能。
    - **批量和项目操作**：用户可以执行批量操作，例如更新资源、删除 GameServer 或 GameServerSet、更新网络策略以及修改副本。

![](/img/kruisegame/user-manuals/dash-project.png)

#### 部署单元页面
- **用途**：DeployUnits 页面充当集中式界面，用于查看和管理 OKG 仪表板中的所有 DeployUnit（Kubernetes 集群）。它提供了部署环境的全面概述，使用户能够监控集群的运行状况和性能，并有效管理跨多个 DeployUnit 的游戏服务器部署。
- **特征**：
  - **部署单元概述**：
    - 该页面列出了 OKG 仪表板中管理的所有 DeployUnit，提供详细信息，例如：
      - **DeployUnit Name**：每个 Kubernetes 集群的标识符。
      - **GameServerSet Count**：部署在 DeployUnit 内的 GameServerSet 总数。
      - **GameServer Count**：DeployUnit 中运行的 GameServer 总数。
      - **Projects**：表示与每个 DeployUnit 关联的项目的数组。
  - **跨集群管理**：该页面允许用户跨多个DeployUnit管理GameServerSet，确保游戏服务器的一致性和可用性。此功能对于维护稳定且可扩展的部署环境至关重要。
- **用户操作**：
  - **详细的 DeployUnit 管理**：通过单击任何 DeployUnit，用户可以访问该特定集群的详细概述。此详细视图允许用户管理所选 DeployUnit 内的 GameServer 和 GameServerSet，执行扩展、更新配置或故障排除等操作。
  - **DeployUnit 配置**：用户可以在 OKG 仪表板的管理中添加或删除 DeployUnit。此控件允许用户定义游戏服务器的部署位置，从而更精确地管理其部署环境。

![](/img/kruisegame/user-manuals/dash-deployunit.png)

#### 添加资源页面
- **目的**：添加资源页面旨在简化在 OKG 仪表板中添加新 Kubernetes 资源的过程。此页面允许用户通过上传现有 YAML 文件或直接在仪表板中创建新文件来创建和部署 GameServerSets、GameServers、StatefulSets 或 DaemonSets 等资源。
- **用户操作**：
  - **资源创建**：
    - 用户可以通过在内置编辑器中编写 YAML 文件或从系统上传现有 YAML 文件来创建新资源。这种灵活性允许：
      - **直接输入**：在仪表板中从头开始手动创建和自定义资源。
      - **文件上传**：上传外部创建的 YAML 文件，提供集成现有配置的简单方法。
  - **下载和部署**：
    - 编写或上传 YAML 文件后，用户可以：
      - **下载**：将 YAML 文件保存到其系统中以供备份或以后使用。
      - **部署**：只需单击一下即可通过仪表板直接部署配置的资源，使流程无缝且高效。


![](/img/kruisegame/user-manuals/dash-addresource.png)

#### 项目页面中的 GameServerSet 表

**用途**：GameServerSet 表页面提供所选项目中所有 GameServerSet 的详细视图。此页面旨在精细地管理和监控游戏服务器的部署。

**特征**：
- **综合列表**：查看所选项目内的所有 GameServerSet，其中列显示关键信息，例如副本数量、更新策略、状态、标签等。
- **搜索和过滤**：使用搜索和过滤工具根据名称等条件快速找到特定的 GameServerSet。
- **批量操作**：对多个 GameServerSet 执行批量操作，例如更新容器镜像和删除多个 GameServerSet。
- **项目操作**：对各个 GameServerSet 执行项目操作，例如删除 GameServerSet、更新容器映像和更新副本计数。

**用户操作**：
- **GameServerSet 管理**：选择单个 GameServerSet 进行详细管理，包括扩展、更新和推出新配置。
- **批量操作**：跨多个 GameServerSet 执行批量操作以简化更新和扩展。
- **搜索和过滤**：使用高级搜索和过滤选项快速查找和管理特定的 GameServerSet。

![](/img/kruisegame/user-manuals/dash-gss-project.png)

#### 项目页面中的 GameServer 表页面

**用途**：GameServer 表页列出了选定项目中的所有单独 GameServer。该页面允许对每个 GameServer 实例进行详细管理和监控。

**特征**：
- **游戏服务器列表**：查看所选上下文中所有游戏服务器的列表，包含运行状态、资源使用情况和操作状态等详细信息。
- **运行状况和状态监控**：监控每个游戏服务器的运行状况和状态。
- **实例级控制**：单独管理每个游戏服务器，包括重新启动、更新或删除特定实例等操作。

**用户操作**：
- **游戏服务器管理**：对各个游戏服务器进行详细管理，包括删除服务器、更新容器镜像、更新网络策略、调整资源分配等。
- **监控和故障排除**：监控每个游戏服务器的运行状况并解决实例级别的问题。
- **搜索和过滤**：使用高级搜索和过滤选项快速查找和管理特定的 GameServerSet。

**批量操作**：
- **用户可以同时对多个GameServer进行批量操作**，包括：
  - **删除游戏服务器**：一次删除多个游戏服务器以简化清理过程。
  - **更新容器镜像**：将新的容器镜像一次应用到多个游戏服务器。
  - **更新操作状态（opsState）**：更改多个 GameServer 的操作状态以调整其行为或维护状态。
  - **更新资源**：修改多个游戏服务器的CPU和内存资源，可以选择：
    - **重新创建 Pod**：选中一个复选框以使用更新的配置重新创建 Pod，确保更改生效。

**项目操作**：
- 对于单个游戏服务器，用户可以：
  - **删除特定游戏服务器**：删除不再需要或有问题的单个游戏服务器。
  - **更新镜像**：更改特定游戏服务器的容器镜像，应用新的配置或版本。

![](/img/kruisegame/user-manuals/dash-gs-project.png)

### 单集群模式

OKG Dashboard v0.1.0 为集群级别组件(v2.0.0 兼容 v0.1.0)。选择要操作的集群，进入后，看到左边导航栏，点击“游戏服运维管理”：

![](/img/kruisegame/user-manuals/dash-ops.png)

#### 概览页

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


#### 游戏服部署集列表页

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


#### 游戏服列表页

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

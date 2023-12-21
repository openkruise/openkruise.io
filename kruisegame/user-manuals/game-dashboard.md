# OKG Dashboard

OpenKruiseGame provides a console for game servers based on KubeSphere 4.0 LuBan architecture. This article introduces how to install KubeSphere and OKG Dashboard, as well as the corresponding usage instructions.

Current OKG Dashboard version: 0.1.0

## Install KubeSphere and OKG Dashboard

### Install KubeSphere 4.0

Install by helm:

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-0.4.0.tgz
```

If the following information is displayed, the installation is successful:

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

By default, the ks-console exposure method is nodeport. If you want to change the exposure method, edit the corresponding svc after installation, such as changing it to LoadBalancer:
```
kubectl edit svc ks-console -n kubesphere-system
...
  type: LoadBalancer
...
```

For more installation instructions on KubeSphere, please refer to:
https://docs.kubesphere.com.cn/v4.0/03-install-and-uninstall/01-install-ks-core

### Install OKG Dashboard

After installing KubeSphere, access the console and click Extension Market:

![](/img/kruisegame/user-manuals/dash-mainpage.png)

Select OKG Dashboard and click Subscribe. OKG Dashboard is completely free, just submit an order. After the payment is successful, return to the extended market. At this time, the subscription button has been transformed into a management button:

![](/img/kruisegame/user-manuals/dash-okg.png)

Enter the OKG Dashboard management page and click Install:

![](/img/kruisegame/user-manuals/dash-management.png)

According to the pop-up window, 1) Select the version and click Next; 2) Start the installation:

![](/img/kruisegame/user-manuals/dash-version-select.png)

![](/img/kruisegame/user-manuals/dash-begin-install.png)

After the installation is successful, you can see that the interface shows that it is installed and enabled:

![](/img/kruisegame/user-manuals/dash-installed.png)

## Instructions for use

OKG Dashboard is a cluster-level component. Select the cluster you want to operate. After entering, see the left navigation bar and click "Game Server Operation and Maintenance Management":

![](/img/kruisegame/user-manuals/dash-ops.png)

### Overview page

After clicking "Game Server Operation and Maintenance Management", you will enter the overview page by default. The overview page counts the number of game servers in different states in the current cluster.

![](/img/kruisegame/user-manuals/dash-overview.jpg)

Field description

- num_total: The total number of GameServers in the current cluster
- num_creating: The number of GameServers in the current cluster with the State of Creating
- num_updating: The number of GameServers in the current cluster whose State is Updating
- num_deleting: the number of GameServers in the current cluster whose State is Deleting
- num_ready: The number of GameServers in the current cluster whose State is Ready
- num_notReady: Number of GameServers in the current cluster whose State is NotReady
- num_network: Number of GameServers using the OKG network model in the current cluster
- num_network_ready: In the current cluster, the number of GameServers that use the OKG network model and whose NetworkState is Ready
- num_none: the number of GameServers in the current cluster with opsState of None
- num_allocated: the number of GameServers in the current cluster with opsState of Allocated
- num_waitToBeDeleted: the number of GameServers in the current cluster whose opsState is WaitToBeDeleted
- num_maintaining: the number of GameServers in the current cluster with opsState of Maintaining


### GameServerSets page

Click "GameServerSets" to view all GameServerSets in the current cluster

![](/img/kruisegame/user-manuals/dash-gss.png)

Field description
- templateImages: Image set by GameServerTemplate. The format is: {container name} -> {image name and version}
- templateResources: Resources set by GameServerTemplate. The format is: {container name} -> { cpu request / mem request / cpu limit / mem limit }, leaving blank means that the corresponding field is not set.

operate
- Jump to the resource page to view details
  ![](/img/kruisegame/user-manuals/dash-gss-jump.png)
  On the GameServerSet details page, you can edit the corresponding Yaml or delete the corresponding object:
  ![](/img/kruisegame/user-manuals/dash-gss-ops.png)


### GameServers page

Click "GameServer" to view all GameServers in the current cluster

![](/img/kruisegame/user-manuals/dash-gs.png)


Field description

- images: The image and version currently running on the game server may be different from the image set by the GameServerTemplate of the corresponding GameServerSet. The format is: {container name} -> {image name and version}
- conditions: GameServerStatus Condition State is False will be displayed here.

operate
- Jump to the resource page to view details
  ![](/img/kruisegame/user-manuals/dash-gs-jump.png)
  On the GameServer details page, you can edit the corresponding Yaml or delete the corresponding object:
  ![](/img/kruisegame/user-manuals/dash-gs-ops.png)
- Update OpsState
  ![](/img/kruisegame/user-manuals/dash-gs-update-opsState.png)
  After the pop-up window is displayed, enter the opsState you want to change and click OK to update:
  ![](/img/kruisegame/user-manuals/dash-gs-opsState-updated.png)


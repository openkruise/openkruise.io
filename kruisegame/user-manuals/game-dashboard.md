# OKG Dashboard

OpenKruiseGame provides a console for game servers based on KubeSphere 4.0 LuBan architecture. This article introduces how to install KubeSphere and OKG Dashboard, as well as the corresponding usage instructions.

Current OKG Dashboard version: 2.0.0

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

![KubeSphere console main page showing Extension Market](/img/kruisegame/user-manuals/dash-mainpage.png)

Select OKG Dashboard and click Subscribe. OKG Dashboard is completely free, just submit an order. After the payment is successful, return to the extended market. At this time, the subscription button has been transformed into a management button:

![OKG Dashboard extension showing management button](/img/kruisegame/user-manuals/dash-okg.png)

Enter the OKG Dashboard management page and click Install:

![OKG Dashboard management page with install button](/img/kruisegame/user-manuals/dash-management.png)

According to the pop-up window, 1) Select the version and click Next; 2) Start the installation:

![Version selection dialog for OKG Dashboard](/img/kruisegame/user-manuals/dash-version-select.png)

![Installation confirmation dialog](/img/kruisegame/user-manuals/dash-begin-install.png)

After the installation is successful, you can see that the interface shows that it is installed and enabled:

![OKG Dashboard showing installed and enabled status](/img/kruisegame/user-manuals/dash-installed.png)

## Instructions for use

The OpenKruise Dashboard 2.0 is a sophisticated web-based interface designed to manage game server deployments across Kubernetes clusters. 
This dashboard serves as a comprehensive management tool, providing users with the ability to monitor, configure, and control various aspects of game server infrastructure, tailored specifically for game deployment scenarios.

### Multi-Clusters Mode

#### Core Concepts

##### DeployUnit
- **Definition**: A DeployUnit represents a Kubernetes cluster or a group of clusters where game servers are deployed. Each DeployUnit is a managed environment where GameServerSets and GameServers are created and maintained.
- **Features**:
  - **Cluster Management**: View and manage multiple Kubernetes clusters designated as DeployUnits.
  - **Resource Allocation**: Monitor and allocate resources like CPU and memory to ensure optimal performance of game servers within each DeployUnit.
  - **Deployment Control**: Manage the lifecycle of game server deployments within each DeployUnit.

##### Project
- **Definition**: A Project in the OKG Dashboard is a logical grouping of GameServerSets, representing a complete game or a specific part of a game that needs isolated management.
- **Features**:
  - **Organized Management**: Group GameServerSets and GameServers logically to manage them as part of a single game project.
  - **Isolation**: Projects provide isolation for different parts of a game or different games altogether, allowing focused management.
  - **Resource Monitoring**: Track resource usage across all GameServerSets within a project, ensuring balanced and efficient use.

##### Global Configuration Page
- **Purpose**: The Global Configuration page allows users to set up and manage the global settings that affect the entire OKG Dashboard. This includes defining project labels, configuring DeployUnits, and setting global policies.
- **Features**:
  - **Project Label Key**: Define the label key used to identify which project a GameServerSet and Gameserver belongs to. This is crucial for organizing GameServerSets and GameServers across DeployUnits.
    - **Note**: Ensure that the project label key defined here matches the label key used when deploying GameServerSets. The project name in the GameServerSet YAML file should align with the configuration in the Global Configuration to ensure proper organization and functionality.

    **Example YAML for GameServerSet**:

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

    
  - **DeployUnits Configuration**: Manage the list of DeployUnits by specifying the clusters to be treated as DeployUnits within the dashboard.
- **User Operations**:
  - **Label Configuration**: Set and update the project label key to ensure proper organization of GameServerSets and GameServers.
  - **DeployUnit Management**: Add or remove clusters from the DeployUnits list to control where GameServerSets are deployed.

![Global configuration page for project labels and DeployUnits](/img/kruisegame/user-manuals/dash-config.png)

#### Project Page
- **Purpose**: The Project Page within the OKG Dashboard serves as the central hub for organizing and managing the deployment of game servers across different logical groupings, referred to as projects. This page is designed to give users an in-depth view of all projects, allowing for efficient management and monitoring of resources across multiple DeployUnits.
- **Features**:
  - **Project List**:
    - The Project Page displays all projects in a table format, where each row or card represents a project. Key information provided for each project includes:
      - **Project Name**: The identifier for the project.
      - **GameServerSet Count**: The number of GameServerSets associated with the project.
      - **GameServer Count**: The total number of GameServers running within the project.
      - **DeployUnits**: An array that lists the DeployUnits (Kubernetes clusters) where the project is deployed.
  - **Cross-DeployUnit Management**: The Project Page enables users to manage GameServerSets and GameServers across multiple DeployUnits within a single project. This feature ensures that resources are consistently managed and deployed according to the project’s needs, regardless of the underlying infrastructure.
- **User Operations**:
  - **Project Navigation**: Users can select any project from the list to view a detailed overview of its GameServerSets and GameServers. This detailed view allows users to drill down into specific aspects of the project, gaining a comprehensive understanding of its deployment status.
  - **Resource Monitoring**: The Project Page allows users to monitor resource allocation and usage within each project. This ensures that the project is utilizing cluster resources efficiently, preventing over-allocation or resource starvation.
  - **Operational Control**: Users have the ability to perform various operations on GameServerSets and GameServers within a project, including:
    - **Scaling GameServerSets**: Adjust the number of replicas to match the current demand.
    - **Updating Container Images**: Roll out new container images across the project to deploy updated game server versions.
    - **Rolling Out New Configurations**: Implement new configurations or update existing ones to optimize performance.
    - **Batch and Item Actions**: Users can perform bulk operations, such as updating resources, deleting GameServers or GameServerSets, updating network policies, and modifying replicas.

![Project page showing list of projects with GameServerSets and GameServers](/img/kruisegame/user-manuals/dash-project.png)

#### DeployUnits Page
- **Purpose**: The DeployUnits page serves as a centralized interface for viewing and managing all DeployUnits (Kubernetes clusters) within the OKG Dashboard. It provides a comprehensive overview of the deployment environment, enabling users to monitor the health and performance of their clusters and efficiently manage game server deployments across multiple DeployUnits.
- **Features**:
  - **DeployUnit Overview**:
    - The page lists all DeployUnits managed within the OKG Dashboard, providing detailed information such as:
      - **DeployUnit Name**: The identifier for each Kubernetes cluster.
      - **GameServerSet Count**: The total number of GameServerSets deployed within the DeployUnit.
      - **GameServer Count**: The total number of GameServers running in the DeployUnit.
      - **Projects**: An array representing the projects associated with each DeployUnit.
  - **Cross-Cluster Management**: The page allows users to manage GameServerSets across multiple DeployUnits, ensuring consistency and availability of game servers. This feature is essential for maintaining a stable and scalable deployment environment.
- **User Operations**:
  - **Detailed DeployUnit Management**: By clicking on any DeployUnit, users can access a detailed overview of that specific cluster. This detailed view allows users to manage GameServers and GameServerSets within the selected DeployUnit, performing operations such as scaling, updating configurations, or troubleshooting issues.
  - **DeployUnit Configuration**: Users have the ability to add or remove DeployUnits from the OKG Dashboard’s management. This control allows users to define where game servers are deployed, enabling more precise management of their deployment environment.

![DeployUnits page displaying Kubernetes clusters with GameServerSets and projects](/img/kruisegame/user-manuals/dash-deployunit.png)

#### Add Resource Page
- **Purpose**: The Add Resource Page is designed to streamline the process of adding new Kubernetes resources within the OKG Dashboard. This page allows users to create and deploy resources like GameServerSets, GameServers, StatefulSets, or DaemonSets by either uploading an existing YAML file or creating a new one directly within the dashboard.
- **User Operations**:
  - **Resource Creation**:
    - Users can create new resources by either writing a YAML file in the built-in editor or uploading an existing YAML file from their system. This flexibility allows for:
      - **Direct Input**: Manually create and customize resources from scratch within the dashboard.
      - **File Upload**: Upload YAML files created externally, providing an easy way to integrate existing configurations.
  - **Download and Deployment**:
    - After writing or uploading a YAML file, users can:
      - **Download**: Save the YAML file to their system for backup or later use.
      - **Deploy**: Deploy the configured resource directly through the dashboard with a single click, making the process seamless and efficient.


![Add resource page with YAML editor for creating new resources](/img/kruisegame/user-manuals/dash-addresource.png)

#### GameServerSet Table in Project Page

**Purpose**: The GameServerSet Table Page provides a detailed view of all GameServerSets within a selected project. This page is designed for managing and monitoring the deployment of game servers at a granular level.

**Features**:
- **Comprehensive List**: View all GameServerSets within the selected project, with columns displaying key information such as replica count, update strategy, status, labels, etc.
- **Search and Filtering**: Use search and filtering tools to quickly locate specific GameServerSets based on criteria like name.
- **Batch Operations**: Perform batch operations on multiple GameServerSets, like updating container images and deleting multiple GameServerSets.
- **Item Operations**: Perform item operations on individual GameServerSets, like deleting a GameServerSet, updating container images, and updating replica count.

**User Operations**:
- **GameServerSet Management**: Select individual GameServerSets for detailed management, including scaling, updating, and rolling out new configurations.
- **Batch Operations**: Execute batch operations across multiple GameServerSets to streamline updates and scaling.
- **Search and Filter**: Use advanced search and filter options to quickly find and manage specific GameServerSets.

![GameServerSet table showing list of GameServerSets within a project](/img/kruisegame/user-manuals/dash-gss-project.png)

#### GameServer Table Page in Project Page

**Purpose**: The GameServer Table Page lists all individual GameServers within a selected project. This page allows for detailed management and monitoring of each GameServer instance.

**Features**:
- **GameServer List**: View a list of all GameServers within the selected context, with detailed information such as running status, resource usage, and operational status.
- **Health and Status Monitoring**: Monitor the health and status of each GameServer.
- **Instance-Level Control**: Manage each GameServer individually, with operations like restarting, updating, or deleting specific instances.

**User Operations**:
- **GameServer Management**: Perform detailed management of individual GameServers, including deleting servers, updating container images, updating network policies, and adjusting resource allocations.
- **Monitoring and Troubleshooting**: Monitor the health of each GameServer and troubleshoot issues at the instance level.
- **Search and Filter**: Use advanced search and filter options to quickly find and manage specific GameServerSets.

**Batch Operations**:
- **Users can perform batch operations on multiple GameServers simultaneously**, including:
  - **Deleting GameServers**: Remove multiple GameServers in one action to streamline cleanup processes.
  - **Updating Container Images**: Apply new container images to multiple GameServers at once.
  - **Updating Operational State (opsState)**: Change the operational state of multiple GameServers to adjust their behavior or maintenance status.
  - **Updating Resources**: Modify CPU and memory resources for multiple GameServers, with the option to:
    - **Recreate Pods**: Select a checkbox to recreate pods with the updated configuration, ensuring that changes take effect.

**Item Actions**:
- For individual GameServers, users can:
  - **Delete Specific GameServer**: Remove a single GameServer that is no longer required or is problematic.
  - **Update Image**: Change the container image of a specific GameServer, applying new configurations or versions.

![GameServer table displaying individual GameServers within a project](/img/kruisegame/user-manuals/dash-gs-project.png)

### Single-Cluster Mode

OKG Dashboard 0.1.0 is a cluster-level component(v2.0.0 is compatible with v0.1.0). 
Select the cluster you want to operate. After entering, see the left navigation bar and click "Game Server Operation and Maintenance Management":

![Dashboard navigation showing Game Server Operations menu](/img/kruisegame/user-manuals/dash-ops.png)

#### Overview page

After clicking "Game Server Operation and Maintenance Management", you will enter the overview page by default. The overview page counts the number of game servers in different states in the current cluster.

![Overview page showing GameServer statistics and counts by state](/img/kruisegame/user-manuals/dash-overview.jpg)

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


#### GameServerSets page

Click "GameServerSets" to view all GameServerSets in the current cluster

![GameServerSets page listing all GameServerSets with template images and resources](/img/kruisegame/user-manuals/dash-gss.png)

Field description
- templateImages: Image set by GameServerTemplate. The format is: `{container name} -> {image name and version}`
- templateResources: Resources set by GameServerTemplate. The format is: `{container name} -> { cpu request / mem request / cpu limit / mem limit }, leaving blank means that the corresponding field is not set.`

operate
- Jump to the resource page to view details
  ![GameServerSet detail page navigation link](/img/kruisegame/user-manuals/dash-gss-jump.png)
  On the GameServerSet details page, you can edit the corresponding Yaml or delete the corresponding object:
  ![GameServerSet details page with edit and delete options](/img/kruisegame/user-manuals/dash-gss-ops.png)


#### GameServers page

Click "GameServer" to view all GameServers in the current cluster

![GameServers page showing all GameServers with images and conditions](/img/kruisegame/user-manuals/dash-gs.png)


Field description

- images: The image and version currently running on the game server may be different from the image set by the GameServerTemplate of the corresponding GameServerSet. The format is: `{container name} -> {image name and version}`
- conditions: GameServerStatus Condition State is False will be displayed here.

operate
- Jump to the resource page to view details
  ![GameServer detail page navigation link](/img/kruisegame/user-manuals/dash-gs-jump.png)
  On the GameServer details page, you can edit the corresponding Yaml or delete the corresponding object:
  ![GameServer details page with edit and delete options](/img/kruisegame/user-manuals/dash-gs-ops.png)
- Update OpsState
  ![Update opsState dialog box](/img/kruisegame/user-manuals/dash-gs-update-opsState.png)
  After the pop-up window is displayed, enter the opsState you want to change and click OK to update:
  ![GameServer with updated opsState confirmation](/img/kruisegame/user-manuals/dash-gs-opsState-updated.png)


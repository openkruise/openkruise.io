# Best Practices for Agile Delivery and Operations Management of GameServers

In the traditional operation and maintenance model, the deployment of game servers inevitably leads to the close coupling of business and underlying infrastructure. This process-oriented delivery method often leads to inefficient deployment and difficult troubleshooting in case of problems due to the low degree of automation and lack of effective batch management capabilities.

In contrast, cloud-native technologies, with their declarative and consistent delivery characteristics, provide significant efficiency gains for the deployment and operation of game servers. However, in practice, we observe that due to the stateful nature of game servers, their delivery logic differs significantly from that of traditional stateless services. This paper aims to shed light on these differences and propose best practice solutions, with the aim of opening up new ideas for agile deployment and O&M management of game servers in cloud-native environments.

## GameServer Delivery with ArgoCD

Before we get into the specifics of publishing the example, let's take a look at the idea of cloud-native delivery - declarative rather than process-oriented, which means that cloud-native application delivery is not concerned with the deployment process of the application but rather with the definition of the application. The definition of the application is Yaml, which describes what the application should look like in a configuration parameterised way. Therefore, all changes and releases to the application are really changes to the application description (Yaml). At this point we have found that we need a repository to keep a record of the current description of the application and to be able to trace and audit past changes to the Yaml. At this point, I believe you will find that the git repo is a natural fit for this feature. Ops engineers can upload Yaml to the repository by submitting Commit and Merge Requests, and the permissions management and auditing follow the git specification. Ideally, we only need to maintain a set of Yaml describing the game service, and trigger the release of the game service in multiple regions around the world with one click, without the need to operate the cluster one by one for the process to perform deployment actions. This is the idea behind GitOps.

The most challenging thing in landing GitOps is actually the abstraction of the description of a GameServer application; a GameServerSet is a collection of GameServers with the same attributes, which belongs to the GameServer management oriented workload in Kubernetes, and therefore each GameServerSet cannot be deployed across Kubernetes clusters. Therefore, in some scenarios, such as multi-cluster scenarios, each cluster needs at least one GameServerSet, and the description of each GameServerSet is more or less different, so it seems difficult to summarise all the game servers in a single Yaml. As an example, consider the scenario of a global launch - the launch is planned for Shanghai, Tokyo and Frankfurt, so we need infrastructure resources in all three regions. In Shanghai I want to publish 10 game regions, while in Frankfurt I only want to publish 3. In this case, a single Yaml will not be able to describe the game servers for the different geographies because of the differences in the replicas field. Do we need to maintain a Yaml for each locale? This is also not a reasonable approach, when making non-differentiated field changes (e.g., tagging a game server for all geographies), we need to perform multiple Yaml changes repeatedly, which is easy to miss or make mistakes when there are a lot of clusters, which is not in line with the cloud-native delivery idea.

In fact, we can perform further abstraction of the GameServer application by using Helm Chart to extract the discrepancies as Values. In our current example (https://github.com/AliyunContainerService/gitops-demo/tree/main/manifests/helm/open-game), we abstract such discrepancy fields:

* Main image —— There may be differences in the Main image for each zone/cluster
* Sidecar image —— Sidecar image may vary per zone/cluster
* GameServer replicas —— The number of game server released per zone/cluster may vary
* Whether to enable auto-scale or not —— Requirements for auto-scale may vary per zone/cluster

Other than that, all other fields remain consistent, meaning that there is no zone disparity impact.

ArgoCD (https://argo-cd.readthedocs.io/en/stable/) as a community mature cloud-native delivery tool, which inherits the idea of GitOps very well, this paper will use ArgoCD for the practical operation of game service delivery. Next we start the specific operation:

### Connecting to a Git Repository
We need to connect the Git repository that describes the GameServer application. The steps to do this are as follows:
1. select Settings in the left navigation bar of the ArgoCD UI and then select Repositories > + Connect Repo
2. Configure the following information in the pop-up panel and click CONNECT to add the connection

| Zone                          | Parameter                                           | Value                                                     |
|-------------------------------|-----------------------------------------------------|-----------------------------------------------------------|
| Choose your connection method | Number of game servers in different states          | VIA HTTPS                                                 |
| CONNECT REPO USING HTTPS      | Number of game servers in different ops states      | git                                                       |
|                               | Project                                             | default                                                   |
|                               | Repository URL                                      | https://github.com/AliyunContainerService/gitops-demo.git |
|                               | Skip server verification                            | tick                                                      |

<img src={require('/static/img/kruisegame/best-practices/git1.png').default} style={{  width: '800px'}} />
<img src={require('/static/img/kruisegame/best-practices/git2.png').default} style={{  width: '800px'}} />

### Delivery of PvE Type GameServers

PvE games usually have the concept of zones, and in most cases, the operation engineers will manually control the number of game server opened in each region. For PvE game cloud biochemistry best practices, please refer to OKG PvE Game Best Practices document (https://openkruise.io/kruisegame/best-practices/pve-game).
When trying ArgoCD for the first time, we can use the white screen console to create separate Applications for each geographic cluster:
1. Select Applications in the left navigation bar of the ArgoCD UI and click + NEW APP
2. Configure the following information in the pop-up panel and click CREATE to create. (Take opengame-demo-shanghai-dev for example)

| Zone                                                                          | Parameter                  | Value                                                                                                                        |
|-------------------------------------------------------------------------------|----------------------------|------------------------------------------------------------------------------------------------------------------------------|
| GENERAL                                                                       | Application Name           | opengame-demo-shanghai-dev                                                                                                   |
|                                                                               | Project Name               | default                                                                                                                      |
|                                                                               | SYNC POLICY                | Select Automatic in the drop-down list. the parameter values are as follows:                                                 |
| Manual: Manually Synchronising Git Repository Changes                         |                            |                                                                                                                              |
| Automatic: Automatically synchronise Git repository changes at 3min intervals |                            |                                                                                                                              |
|                                                                               | SYNC OPTIONS               | Tick AUTO-CREATE NAMESPACE                                                                                                   |
| SOURCE                                                                        | Repository URL             | Select an existing Git Repo in the drop-down list, here select https://github.com/AliyunContainerService/gitops-demo.git     |
|                                                                               | Revision                   | HEAD                                                                                                                         |
|                                                                               | Path                       | manifests/helm/open-game                                                                                                     |
| DESTINATION                                                                   | Cluster URL/Cluster Name   | Select the target cluster in the drop-down list                                                                              |
|                                                                               | Namespace                  | opengame                                                                                                                     |
| HELM                                                                          | VALUES FILES               | values.yaml                                                                                                                  |
| PARAMETERS                                                                    | replicas                   | 3 #Release of three Gameserver                                                                                               |
|                                                                               | scaled.enabled             | false # Automatic elastic expansion without switching on                                                                     |
3. After creation, you can see the application status of opengame-demo-shanghai-dev in the Application page. If the SYNC POLICY selection is Manual, you need to click SYNC manually to deploy the application synchronously to the target cluster. The Status of the application is Healthy and Synced, which means it has been successfully synchronised.

<img src={require('/static/img/kruisegame/best-practices/argo.png').default} style={{  width: '850px'}} />

4. Click the opengame-demo-shanghai-dev application name to view the application details, showing the topology and corresponding status of the Kubernetes resources associated with the application.

Once we are familiar with ArgoCD, we can also publish game servers with a single click through the ApplicationSet object. The difference between each cluster is abstracted by elements, for example, in the following Yaml, three fields are abstracted in terms of cluster dimension: cluster cluster name is used to distinguish the name of the application; url is used to distinguish the address of the target cluster; and replicas is used to distinguish the number of game apparel published by different clusters.
After writing the ApplicationSet Yaml, deploy it to the ACK One fleet cluster to automatically create four applications.
```bash
kubectl apply -f pve.yaml -n argocd

# The contents of pve.yaml are as follows：
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: minecraft
spec:
  generators:
  - list:
      elements:
      - cluster: shanghai-dev
        url: <https://47.100.237.xxx:6443>
        replicas: '1'
      - cluster: shanghai-prod
        url: <https://47.101.214.xxx:6443>
        replicas: '3'
      - cluster: frankfurt-prod
        url: <https://8.209.103.xxx:6443>
        replicas: '2'
      - cluster: japan-prod
        url: <https://10.0.0.xxx:6443>
        replicas: '2'
  template:
    metadata:
      name: '{{cluster}}-minecraft'
    spec:
      project: default
      source:
        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'
        targetRevision: HEAD
        path: manifests/helm/open-game
        helm:
          valueFiles:
          - values.yaml
          parameters: #Corresponds to the value parameter extracted from the helm chart.
          - name: replicas
            value: '{{replicas}}'
          - name: scaled.enabled 
            value: 'false'
      destination:
        server: '{{url}}'
        namespace: game-server #Deploy to the game-server namespace of the corresponding cluster.
      syncPolicy:
        syncOptions:
          - CreateNamespace=true #If the namespace does not exist in the cluster, it is automatically created.
```
In this Yaml, all image have the same version. If you want to have differences in the version of the mirrors across clusters, you can follow the example of replicas and add a new parameter parameter.



### Delivery of PvP Type GameServers

For PvP type games, the number of rooms is provisioned by its own scaler rather than manually specified by the Ops Engineer. Best practices for cloud-based biochemistry for PvP-type games can be found in the OKG Best Practices for PvP Games document (https://openkruise.io/kruisegame/best-practices/session-based-game).

In OKG we enable flexible scaling of game servers by configuring a ScaledObject object for the GameServerSet. Therefore, scaled.enabled in Helm Chart Value needs to be turned on in this scenario. In addition, there are 2 controllers, ArgoCD and OKG, for the number of copies of the rooms to conflict, which can be solved by having ArgoCD ignore the changes in the number of copies of the GameServerSet resource, by setting the corresponding field in spec.ignoreDifferences. Considering the above, the pvp.yaml looks like this:

```bash
kubectl apply -f pvp.yaml -n argocd

# The contents of pvp.yaml are as follows：
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: pvp
spec:
  generators:
  - list:
      elements:
      - cluster: shanghai-dev
        url: <https://47.100.237.xxx:6443>
      - cluster: shanghai-prod
        url: <https://47.101.214.xxx:6443>
      - cluster: frankfurt-prod
        url: <https://8.209.103.xxx:6443>
      - cluster: japan-prod
        url: <https://10.0.0.xxx:6443>
  template:
    metadata:
      name: '{{cluster}}-pvp'
    spec:
      project: defaultminecraft
      ignoreDifferences: # Set GameServerSet number of minecraft replicas to be controlled by the cluster itself
      - group: game.kruise.io
        kind: GameServerSet
        name: minecraft
        namespace: game
        jsonPointers:
        - /spec/replicas
      source:
        repoURL: '<https://github.com/AliyunContainerService/gitops-demo.git>'
        targetRevision: HEAD
        path: manifests/helm/open-game
        helm:
          valueFiles:
          - values.yaml
      destination:
        server: '{{url}}'
        namespace: pvp-server
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
```

In this Yaml, all mirrors have the same version. If you want to have differences in the version of the mirrors across clusters, you can follow the example of replicas and add a new parameter parameter.

### Lessons learnt
Through the above example, we will find that good application abstraction is the key to agile delivery of GameServerSet. We need to try to keep most of the fields in GameServerSet consistent, and extract the fields that have differences, so that we only need to change and maintain specific corresponding fields for different environments to truly achieve agile delivery.

## GameServer Operation and Maintenance Management
Even for the same workload (GameServerSet), there is variability in the state between game servers. In this case, the delivered GameServer also require continuous targeted O&M management, which is the biggest difference from stateless business.

### OKG Dashboard White Screen Proactive O&M
Usually, we need to proactively operate and maintain the game service -- statistics and query the game service status; directional changes to the game service version, resource specifications, operation and maintenance status, and so on. With OKG Dashboard, you can realise the proactive operation and maintenance of the game service:
* Instructions for using the OKG Dashboard can be found at: https://openkruise.io/kruisegame/user-manuals/game-dashboard
* More requirements for OKG Dashboard can be commented under issue: https://github.com/openkruise/kruise-game/issues/139

### Construction of monitoring and warning mechanisms to enhance the stability of the GameServers
In addition to proactive O&M, we need to establish a subscription mechanism for stability issues. When the game service is not running as expected, the operation and maintenance engineers can respond and deal with it in a timely manner.

OKG provides the ability to customise the quality of service, which can be used flexibly to achieve targeted game service anomalies and alerts. Read the documentation:
* https://openkruise.io/kruisegame/user-manuals/service-qualities/#set-the-om-status-of-unhealthy-game-servers-to-maintaining
* https://openkruise.io/kruisegame/best-practices/pve-game/#custom-service-quality-for-game-servers

In addition, if you want GameServer to implement targeted alerts by monitoring metrics, you can also determine the value of GameServer OpsState by calling the Prometheus API in a custom Quality of Service script (pod name can be obtained using the DownwardAPI) and comparing the metric thresholds.
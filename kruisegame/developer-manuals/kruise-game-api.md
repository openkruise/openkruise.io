# Kruise Game API

kruise-game-api provides query, modification, and deletion operations on the GSS/GS resources of OKG through multiple interface types such as Golang package, gRPC, REST, and command line. The main functions are as follows:
* Using a structured query syntax [structured-filter-go](https://github.com/CloudNativeGame/structured-filter-go) similar to MongoDB, it realizes the query of relatively complex filtering rules for GSS/GS. For example, there is a requirement to query GSs that meet the following conditions:
  * The opsState is None.
  * The status.networkStatus.currentState is Ready.
  * It contains containers named nginx and sidecar, where the image of nginx is nginx:1.27.4 and the image of sidecar is busybox:1.37.0.

You can use the following filter to query the list of GSs that meet all the above conditions:

```JSON
{
  "$and": [
    {
      "opsState": "None"
    },
    {
      "currentNetworkState": "Ready"
    },
    {
      "images": {
        "$all": ["nginx,nginx:1.27.4", "sidecar,busybox:1.37.0"]
      }
    }
  ]
}
```

* Using [JsonPatch](https://jsonpatch.com/) as the update syntax and combining it with the filter, it realizes the state update of GSS/GS that meet certain filtering rules.
* Providing a Golang Package to simplify the query and update syntax using chained calls:

```golang
// Construct the Filter
filter := filterbuilder.NewGsFilterBuilder().OpsState("None")

// Construct the JsonPatch
patcher := jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1)
```

* Providing gRPC/REST clients to further simplify the operations of GSS/GS:

```golang
// Create an HttpClient to send requests to the kruise-game-api-server
client := kruisegameapiclient.NewKruiseGameApiHttpClient()

// Send an HTTP request to the kruise-game-api-server to set the updatePriority of GSs with opsState as None to 1
results, err := client.UpdateGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"),
    jsonpatchbuilder.NewGsJsonPatchBuilder().ReplaceUpdatePriority(1))
```

* Providing the kruisegamectl command-line tool to achieve structured query/update of GSS/GS without additional deployment:

```shell
# Set the updatePriority of GSs with opsState as None to 1
kruisegamectl -k "${kube_config_path}" \
    -r gameserver \
    -p -f '{"opsState":"None"}' \
    -j '[{"op":"replace","path":"/spec/updatePriority","value":3}]'
```

# Usage

* Code examples: https://github.com/CloudNativeGame/kruise-game-api/tree/main/examples
* For more detailed interface descriptions and supported GSS/GS filters, etc., please refer to [README](https://github.com/CloudNativeGame/kruise-game-api/blob/main/README.md)
* The following are the usage methods of several interface types such as Golang Package, REST, and command line:

## Golang Package

Get the package:

```shell
go get github.com/CloudNativeGame/kruise-game-api
```

Use it in the code:

```golang
// Create a GS filter
gsFilter := filter.NewGsFilter(&filter.FilterOption{
    KubeOption: options.KubeOption{
        KubeConfigPath:          "~/.kube/config",
        InformersReSyncInterval: time.Second * 30,
    },
})

//rawFilter := "{\"$and\":[{\"opsState\": \"None\"}, {\"updatePriority\": 0}]}"
// Get the list of GSs with opsState as None and updatePriority as 0
gameServers, err := gsFilter.GetFilteredGameServers(filterBuilder.And().OpsState("None").UpdatePriority(0).Build())
```

## REST

Deploy the kruise-game-api-server to the kruise-game-system namespace:

```shell
git clone git@github.com:CloudNativeGame/kruise-game-api.git
cd kruise-game-api/deploy/ && kubectl apply -f .
```

Use curl or the provided REST client Golang Package to request the kruise-game-api-server in the business container:

```shell
# Get the list of GSs with opsState as None
curl -G --data-urlencode 'filter={"opsState":"None"}' http://kruise-game-api-server.kruise-game-system/v1/gameservers
```

```golang
// Create an HttpClient to send requests to the kruise-game-api-server
client := kruisegameapiclient.NewKruiseGameApiHttpClient()

// Send an HTTP request to the kruise-game-api-server to get the list of GSs with opsState as None
gameServers, err := client.GetGameServers(filterbuilder.NewGsFilterBuilder().OpsState("None"))
```

## Command Line

```shell
go install github.com/CloudNativeGame/kruise-game-api/facade/kruisegamectl@latest
# The go/bin directory needs to be added to the PATH environment variable
kruisegamectl -k ~/.kube/config -r gameserver -f '{"opsState":"None"}'
```

# Use Cases

## GS Status Query and Reporting

* Interact with the kruise-game-api-server through gRPC/REST requests to implement GS status query and reporting, replacing the way of updating GS status with custom service quality scripts and reducing the dependence on out-of-band systems.
* GS can call requests through the sidecar or the kruise-game-api-server Service in the kruise-game-system namespace to manage its own status.

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-1.png').default} style={{ width: '800px'}} />

## GS Routing Selection

The kruise-game-api-server can be used in the sidecar of the gateway to help the gateway select and allocate GSs that meet the requirements.

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-2.png').default} style={{ width: '800px'}} />

## Integration into PaaS Platform

If a self-developed PaaS platform is used, the functions such as filtering and updating of GSS/GS can be quickly integrated. For example, in the following figure, the GSSs can be filtered according to the image and the other conditions, and the images update of the filtered GSSs can be performed:

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-3.png').default} style={{ width: '800px'}} />

## Replace kubectl Client to Manage GSS&GS

Provide the kruisegamectl command-line tool to implement the filtering and updating of GSS/GS without relying on the kruise-game-api-server.

<img src={require('/static/img/kruisegame/developer-manuals/kruise-game-api-4.png').default} style={{ width: '800px'}} />

## Perform Automated Operations as a Step in CI/Workflow

Take the following Argo Workflow as an example. Some steps are omitted. The last step, clean-old-none-gs, is to set the opsState of GSs that meet certain conditions (opsState is None, containing a container named game-server and the image of this container is nginx:1.27.4) to Kill:

```yaml
# kubectl create -f workflow.yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: frame-sync-server-lossless-update-
  namespace: kruise-game-system
spec:
  serviceAccountName: kruise-game-controller-manager
  entrypoint: main
  templates:
    - name: main
      steps:
        - - name: clean-old-none-gs
            template: clean-old-none-gs
    - name: clean-old-none-gs
      script:
          image: crpi-8cm99ihkk1hz8ju9.cn-shenzhen.personal.cr.aliyuncs.com/scottliu/kruisegamectl:v0.0.5
          command: ["/kruisegamectl"]
          args:
              - -r
              - gameserver
              - -f
              - '{"$and":[{"opsState":"None"},{"images":{"$all":["game-server,nginx:1.27.4"]}}]}'
              - -j
              - '[{"op":"replace","path":"/spec/opsState","value":"Kill"}]'
```

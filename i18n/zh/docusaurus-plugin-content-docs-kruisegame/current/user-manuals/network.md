# 网络模型

## 功能概述

如[OKG设计理念](../design-concept.md)中提到的，游戏服接入层网络是游戏开发者非常关注的问题。
非网关架构下，游戏开发者需要考虑如何暴露游戏服的外部IP端口，供玩家连接访问。
在不同场景下，往往需要不同的网络产品，而有时网络产品由云厂商提供。OKG 的 Cloud Provider & Network Plugin 源于此而诞生。
OKG 会集成不同云提供商的不同网络插件，用户可通过GameServerSet设置游戏服的网络参数，并在生成的GameServer中查看网络状态信息，极大降低了游戏服接入网络的复杂度。

## 网络插件附录

各云厂商的网络插件按 provider 拆分到独立页面；按你的部署环境选择对应页面查看。

- [Kubernetes 网络插件](network/kubernetes.md)
- [AlibabaCloud 网络插件](network/alibabacloud.md)
- [Volcengine 网络插件](network/volcengine.md)
- [AmazonWebServices 网络插件](network/amazonwebservices.md)
- [TencentCloud 网络插件](network/tencentcloud.md)
- [JdCloud 网络插件](network/jdcloud.md)
- [HwCloud 网络插件](network/hwcloud.md)

## 网络隔离

考虑以下场景，如：

- 游戏服发生重大异常，需要避免玩家连入
- 版本更新前，切断玩家网络连接
- 其他临时有关服的需求，待运维处理后再次开服

相对直接将游戏服Pod删除的方式，在接入层进行网络隔离是更简便、轻量的操作，可以保留Pod与GameServer元数据信息，无需重建，提高再开服效率。

### 使用方法

GameServer.Spec 具有 NetworkDisabled 字段。 GameServerSet部署生成的GameServers，其默认的 NetworkDisabled 为 false，意味着游戏服部署时都不会设置网络隔离。

当游戏服具有网络隔离的需求时，可以通过 手动(kubectl/K8s API) / 自定义服务质量 的方式设置 GameServer.Spec.NetworkDisabled 为 true，则开始进行网络隔离；置为false时，再恢复网络。

需要注意的是，网络隔离功能由各个网络插件提供，需要用户在使用网络插件的时候查阅对应插件是否支持网络隔离功能。

## 获取网络信息

GameServer Network Status可以通过两种方式获取

### k8s API
调用K8s API，获取GameServer对象。该方式适用于中心组件，通常在匹配服务获取游戏服网络信息，用于路由选择等。

### DownwardAPI
通过DownwardAPI，将网络信息下沉至业务容器中，供游戏服业务容器使用

该方法的示例如下:

```yaml
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet
metadata:
  name: gs-slb
  namespace: default
spec:
  replicas: 1
  updateStrategy:
    rollingUpdate:
      podUpdatePolicy: InPlaceIfPossible
  network:
    networkType: AlibabaCloud-SLB
    networkConf:
    - name: SlbIds
      value: "xxx"
    - name: PortProtocols
      value: "xxx"
    - name: Fixed
      value: "true"
  gameServerTemplate:
    spec:
      containers:
        - image: registry.cn-hangzhou.aliyuncs.com/gs-demo/gameserver:network
          name: gameserver
          volumeMounts:
            - name: podinfo
              mountPath: /etc/podinfo
      volumes:
        - name: podinfo
          downwardAPI:
            items:
              - path: "network"
                fieldRef:
                  fieldPath: metadata.annotations['game.kruise.io/network-status']
```

字段说明:
- 在对应container字段中声明 volumeMounts，定义访问路径，此例中为 /etc/podinfo
- 在 gameServerTemplate.spec 里声明downwardAPI，文件名设置为 “network“，并指定使用 “game.kruise.io/network-status” 该annotation。注意annotation的key要使用单引号''，双引号pod将创建失败。

业务pod及容器创建成功后，在对应的/etc/podinfo路径下存在 network 文件，其中记录了序列化后的网络信息，该信息可通过json解码成对应structure，在程序获取相应字段使用。解码的sample如下（golang版本）

```go
package demo
import (
	"encoding/json"
	"github.com/openkruise/kruise-game/apis/v1alpha1"
    "os"
)

func getNetwork()  {
	network, err := os.ReadFile("/etc/podinfo/network")
	if err != nil {
		return
	}
	
	networkStatus := &v1alpha1.NetworkStatus{}

	err = json.Unmarshal(network, networkStatus)
	if err != nil {
		return
	}
	
	// 访问networkStatus各个字段
}

```

在获取网络信息时，可能面临着网络状态未准备好的情况，可以在程序中加入一个循环，持续检测网络状态，直至网络状态为Ready后获取网络信息数据。以下是相应的shell脚本。

```shell
# 初始化JSON字符串为空
json=''

# 循环直到拿到数据
while [ -z "$json" ]; do
    # 从文件中读取JSON字符串
    json=$(cat /etc/podinfo/network)

    # 检查currentNetworkState是否为Ready
    currentNetworkState=$(echo $json | jq -r '.currentNetworkState')
    if [ "$currentNetworkState" != "Ready" ]; then
        echo "currentNetworkState is not Ready, sleeping 1 second..."
        sleep 1
        json=''
    fi
done

# 解析externalAddresses的ip和port
echo "externalAddresses:"
ip=$(echo $json | jq -r '.externalAddresses[0].ip')
port=$(echo $json | jq -r '.externalAddresses[0].ports[0].port')
echo " IP: $ip, Port: $port"
```

## FAQ

Q: 如何更改网络插件配置?

A: 可以通过编辑kruise-game-system命名空间下的configmap对默认参数进行更改。更改后重建kruise-game-manager，使配置生效。建议集群游戏服已使用OKG网络插件的情况下不轻易更改相应配置，应提前做好合理的网络规划。

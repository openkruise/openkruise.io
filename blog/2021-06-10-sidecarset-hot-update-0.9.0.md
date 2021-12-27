---
slug: SidecarSet
title: OpenKruise 0.9.0, SidecarSet Helps Mesh Container Hot Upgrade
authors: [zmberg]
tags: [workload, sidecar, istio, mosn, HotUpgrade]
---

# Preface
OpenKruise is an open source management suite developed by Alibaba Cloud for cloud native application automation. It is currently a Sandbox project hosted under the Cloud Native Computing Foundation (CNCF). Based on years of Alibaba's experience in container and cloud native technologies, OpenKruise is a Kubernetes-based standard extension component that has been widely used in the Alibaba internal production environment, together with technical concepts and best practices for large-scale Internet scenarios.

OpenKruise released v0.8.0 on March 4, 2021, with enhanced SidecarSet capabilities, especially for log management of Sidecar.

# Background - How to Upgrading Mesh Containers Independently
SidecarSet is a workload provided by Kruise to manage sidecar containers. Users can complete **automatic injection** and **independent upgrades** conveniently using SidecarSet.

By default, sidecar upgrade will first stop the old container and start a new one. This method is particularly suitable for sidecar containers that do not affect Pod service availability, such as log collection agents. However, for many proxies or sidecar containers for runtime, such as Istio Envoy, this upgrade method does not work. Envoy functions as a Proxy container in the Pod to handle all traffic. If users restart in this scenario to upgrade directly, the service availability of the Pod will be affected. Therefore, the release and capacity of the application should be taken into consideration. The sidecar release cannot be independent of the application.

![how update mesh sidecar](../static/img/blog/2021-06-10-sidecarset-hot-update/how_update_mesh.png)

Tens of thousands of pods in Alibaba Group communicate with each other based on Service Mesh. Mesh container upgrades may make business pods unavailable. Therefore, the upgrade of the mesh containers hinders the iteration of Service Mesh. To address this scenario, we worked with the Service Mesh team to implement the hot upgrade capability of the mesh container. This article focuses on the important role SidecarSet is playing during the implementation of the hot upgrade capability of mesh containers.

# SidecarSet Helps Lossless Hot Upgrade of Mesh Containers
Mesh containers cannot perform direct in-place upgrades like the log collection class container. The mesh container must provide services without interruption, but an independent upgrade will make the mesh service unavailable for some time. Some well-known mesh services in the community, such as Envoy and Mosn, provide smooth upgrade capabilities by default. However, these upgrade methods cannot be integrated properly with cloud-native, and Kubernetes does not have an upgrade solution for such sidecar containers.

**OpenKruise SidecarSet provides the sidecar hot upgrade mechanism for the mesh container**. Thus, lossless Mesh container hot upgrade can be implemented in a cloud-native manner.
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: hotupgrade-sidecarset
spec:
  selector:
    matchLabels:
      app: hotupgrade
  containers:
  - name: sidecar
    image: openkruise/hotupgrade-sample:sidecarv1
    imagePullPolicy: Always
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - /migrate.sh
    upgradeStrategy:
      upgradeType: HotUpgrade
      hotUpgradeEmptyImage: openkruise/hotupgrade-sample:empty
```
- upgradeType: “HotUpgrade” indicates this type of sidecar container, which is hot upgrade.
- hotUpgradeEmptyImage: When performing hot upgrade on sidecar containers, businesses need to provide an empty container for container switchover. The Empty container has the same configuration as the sidecar container (except for the image address), such as command, lifecycle, and probe.

The SidecarSet hot upgrade mechanism includes two steps: injection of Sidecar containers of the hot upgrade type and Mesh container smooth upgrade.

## Inject Sidecar Containers of the Hot Upgrade Type
For Sidecar containers of the hot upgrade type, two containers will be injected by SidercarSet Webhook when creating the Pod:
- {sidecar.name}-1: As shown in the following figure, envoy-1 represents a running sidecar container, for example, envoy:1.16.0.
- {sidecar.name}-2: As shown in the following figure, envoy-2 represents the “hotUpgradeEmptyImage” container provided by the business, for example, empty:1.0.

![inject sidecar](../static/img/blog/2021-06-10-sidecarset-hot-update/inject_sidecar.png)

This Empty container does not have any practical work while running the Mesh container.

## Smooth Mesh Container Upgrade
The hot upgrade process is divided into three steps:
1. **Upgrade:** Replace the Empty container with the sidecar container of the latest version, for example, ```envoy-2.Image = envoy:1.17.0```
2. **Migration:** Run the “PostStartHook” script of the sidecar container to upgrade the mesh service smoothly
3. **Reset:** After the mesh service is upgraded, replace the sidecar container of the earlier version with an Empty container, for example, ```envoy-1.Image = empty:1.0```

![update sidecar](../static/img/blog/2021-06-10-sidecarset-hot-update/update_sidecar.png)

The preceding three steps represent the entire process of the hot upgrade. If multiple hot upgrades on a Pod are required, users only need to repeat the three steps listed above.

## Core Logic of Migration
The SidecarSet hot upgrade mechanism completes the mesh container switching and provides the coordination mechanism (```PostStartHook```) for containers of old and new versions. However, this is only the first step. The Mesh container also needs to provide the ```PostStartHook``` script to upgrade the mesh service smoothly (please see the preceding migration process), such as Envoy hot restart and Mosn lossless restart.

Mesh containers generally provide external services by listening to a fixed port. The migration process of mesh containers can be summarized as: pass ListenFD through UDS, stop Accept, and start drainage. For mesh containers that do not support hot restart, you can follow this process to modify the mesh containers. The logic is listed below:

![migration](../static/img/blog/2021-06-10-sidecarset-hot-update/migration.png)

## Migration Demo
Different mesh containers provide different services and have different internal implementation logics, so the specific Migrations are also different. The preceding logic only presents some important points, with hopes to benefit everyone in need. We have also provided a [hot upgrade Migration Demo](https://github.com/openkruise/samples) on GitHub for reference. Next, we will introduce some of the key codes:
1. **Consultation Mechanism**
First, users must **check whether it is the first startup or hot upgrade smooth migration** to start the Mesh container. Kruise injects two environment variables called ```SIDECARSET_VERSION``` and ```SIDECARSET_VERSION_ALT``` to two sidecar containers to reduce the communication cost of the mesh container. The two environment variables determine whether it is running the hot upgrade process and whether the current sidecar container version is new or old.
```
// return two parameters:
// 1. (bool) indicates whether it is hot upgrade process
// 2. (bool ) when isHotUpgrading=true, the current sidecar is newer or older
func isHotUpgradeProcess() (bool, bool) {
  // Version of the current sidecar container
  version := os.Getenv("SIDECARSET_VERSION")
  // Version of the peer sidecar container
  versionAlt := os.Getenv("SIDECARSET_VERSION_ALT")
  // If the version of the peer sidecar container is "0", hot upgrade is not underway
  if versionAlt == "0" {
    return false, false
  }
  // Hot upgrade is underway
  versionInt, _ := strconv.Atoi(version)
  versionAltInt, _ := strconv.Atoi(versionAlt)
  // version is of int type and monotonically increases, which means the version value of the new-version container will be greater
  return true, versionInt > versionAltInt
}
```

2. **ListenFD Migration**
Use the Unix Domain Socket to migrate ListenFD between containers. This step is also a critical step in the hot upgrade. The code example is listed below:
```
  // For code conciseness, all failures will not be captured

  /* The old sidecar migrates ListenFD to the new sidecar through Unix Domain Socket */
  // tcpLn *net.TCPListener
  f, _ := tcpLn.File()
  fdnum := f.Fd()
  data := syscall.UnixRights(int(fdnum))
  // Establish a connection with the new sidecar container through Unix Domain Socket
  raddr, _ := net.ResolveUnixAddr("unix", "/dev/shm/migrate.sock")
  uds, _ := net.DialUnix("unix", nil, raddr)
  // Use UDS to send ListenFD to the new sidecar container
  uds.WriteMsgUnix(nil, data, nil)
  // Stop receiving new requests and start the drainage phase, for example, http2 GOAWAY
  tcpLn.Close()

  /* The new sidecar receives ListenFD and starts to provide external services */
  // Listen to UDS
  addr, _ := net.ResolveUnixAddr("unix", "/dev/shm/migrate.sock")
  unixLn, _ := net.ListenUnix("unix", addr)
  conn, _ := unixLn.AcceptUnix()
  buf := make([]byte, 32)
  oob := make([]byte, 32)
  // Receive ListenFD
  _, oobn, _, _, _ := conn.ReadMsgUnix(buf, oob)
  scms, _ := syscall.ParseSocketControlMessage(oob[:oobn])
  if len(scms) > 0 {
    // Parse FD and convert to *net.TCPListener
    fds, _ := syscall.ParseUnixRights(&(scms[0]))
    f := os.NewFile(uintptr(fds[0]), "")
    ln, _ := net.FileListener(f)
    tcpLn, _ := ln.(*net.TCPListener)
    // Start to provide external services based on the received Listener. The http service is used as an example
    http.Serve(tcpLn, serveMux)
  }

```

# Successful Mesh Container Hot Upgrade Cases
[Alibaba Cloud Service Mesh](https://www.alibabacloud.com/product/servicemesh) (ASM) provides a fully managed service mesh platform compatible with open-source Istio service mesh from the community. Currently, ASM implements the Sidecar hot upgrade capability (Beta) in the data plane based on the hot upgrade capability of OpenKruise SidecarSet. Users can upgrade the data plane version of service mesh without affecting applications.

In addition to hot upgrades, ASM supports capabilities, such as configuration diagnosis, operation audit, log access, monitoring, and service registration, to improve the user experience of service mesh. You are welcome to try it out!

# Summary
The hot upgrade of mesh containers in cloud-native has always been an urgent but thorny problem. The solution in this article is only one exploration of Alibaba Group, giving feedback to the community with hopes of encouraging better ideas. We also welcome everyone to participate in the [OpenKruise](https://github.com/openkruise/kruise) community. Together, we can build mature Kubernetes application management, delivery, and extension capabilities that can be applied to more large-scale, complex, and high-performance scenarios.

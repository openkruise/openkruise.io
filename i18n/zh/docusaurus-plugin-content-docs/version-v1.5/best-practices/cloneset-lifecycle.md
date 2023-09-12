---
title: CloneSet Lifecycle：在 Pod 生命周期管理中插入定制化逻辑
---

因为各种各样的历史原因和客观因素，有些用户可能无法将自己公司的整套体系架构 Kubernetes 化，比如有些用户暂时无法使用 Kubernetes 本身提供的服务发现机制(Service)，而是使用了独立于 Kubernetes 之外的另外一套服务注册和发现体系。在这种架构下，如果用户对服务进行 Kubernetes 化改造，可能会遇到诸多问题。
例如，每当 Kubernetes 成功创建出一个 Pod，都需要自行将该 Pod 注册到服务发现中心，以便能够对内对外提供服务；相应的，想要下线一个 Pod，也通常先要将其在服务发现中心删除，才能将 Pod 优雅下线，否则就可能导致流量损失。但是在原生的 Kubernetes 体系中， Pod 的生命周期由 Workload 管理（例如 Deployment），
当这些 Workload 的 Replicas 字段发生变化后，相应的 Controller 会立即添加或删除掉 Pod，用户很难定制化地去管理 Pod 的生命周期。

面对这类问题，摆在用户面前的往往无非就这两种解决思路：一是约束 Kubernetes 的弹性能力，
例如规定只能由特定的链路对 Workload 进行扩缩容，以保证在删除 Pod 前先把 Pod IP 在服务注册中心摘除，
但这样一来会制约 Kubernetes 本身的弹性能力, 并且也增加了链路管控的难度和风险。
二是在根本上改造现有的服务发现体系，显然这是一个更加漫长和高风险的事情。

![why](/img/docs/best-practices/cloneset_lifecycle.png)

那么有没有一种既能够充分利用 Kubernetes 弹性能力，又避免对既有服务发现体系进行改造，快速弥补两个系统之间 Gap 的方法呢？答案是肯定的。

OpenKruise CloneSet 就提供了这样一组高度可定制化的扩展能力来专门应对此类场景，让用户能够对 Pod 生命周期做更精细化、定制化的管理。
CloneSet 在 Pod 生命周期中几个重要的时间节点预留了 Hook，使得用户可以在这些时间节点插入一些定制化的扩展动作。
比如，在 Pod 升级前，将 Pod IP 在服务发现中心删除，升级完成后再将 Pod IP 注册到服务发现中心，或者做一些特殊的嗅探和监控动作。
在下文中，我们将会在一个具体的场景对这项能力进行展开讲解，帮你你进一步深入理解这一机制。

### 场景假设
我们假设场景如下：
- 用户不使用 Kubernetes Service 作为基本的服务发现机制，服务发现体系完全独立于 Kubernetes；
- 使用 CloneSet 作为 Kubernetes 工作负载。

并且对具体的需求做如下合理假设：
- 当 Kubernetes Pod 被创建时：
  - 在创建成功，且 Pod Ready 之后，将 Pod IP 注册到服务发现中心；
- 当 Kubernetes Pod 原地升级时：
  - 在升级之前，需要将 Pod IP 从服务发现中心删除（或主动 FailOver）；
  - 在升级完成，且 Pod Ready 之后，将 Pod IP 再次注册到服务发现中心；
- 当 Kubernetes Pod 被删除时：
  - 在删除之前，需要先将 Pod IP 从服务发现中心删除；

基于以上假设，本文将详细讲述如何利用 CloneSet LifeCycle 编写一个简单的 Operator 来实现用户定义的 Pod 生命周期管理机制。

### 原理说明
CloneSet LifeCycle 将 Pod 的生命周期定义为以下 5 种状态：
- Normal：正常状态；
- PreparingUpdate：准备原地升级，通过 Lifecycle 机制阻拦 CloneSet 对 Pod 的升级操作，以便等待用户执行 Hook，完成升级前的一些预处理操作；
- Updating：正在原地升级；
- Updated：原地升级完成，通知用户 Pod 升级完成，可以做一些收尾工作；
- PreparingDelete：准备删除，通过 Lifecycle 机制阻拦 CloneSet 对 Pod 的删除操作，以便等待用户执行 Hook，完成删除前的一些预处理操作；

以上 5 种状态之间的转换逻辑由一个状态机所控制，[CloneSet 官方文档](https://openkruise.io/zh/docs/user-manuals/cloneset/#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90) 中对此进行了详细解释。 用户可以只选择自己所关心的一种或多种，编写一个独立的 Operator 来实现这些状态的转换，控制 Pod 的生命周期，并在所关心的时间节点插入自己的定制化逻辑。

### CloneSet LifeCycle 配置
```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  namespace: demo
  name: cloneset-lifecycle-demo
spec:
  replicas: 2
  ##########################################################################
  ## Lifecycle configuration
  lifecycle:
    inPlaceUpdate:
      labelsHandler:
        ## define the label that:
        ##    1. block inPlace update pod operation for cloneset controller
        ##    2. inform your operator to execute inPlace update hook
        example.com/unready-blocker-inplace: "true"
    preDelete:
      labelsHandler:
        ## define the label that:
        ##    1. block deletion pod operation for cloneset controller
        ##    2. inform your operator to execute preDelete hook
        example.com/unready-blocker-delete: "true"
  ##########################################################################
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        ## this label is useful to judge whether this pod is newly-created.
        example.com/newly-create: "true"
        ## corresponding to the spec.lifecycle.inPlaceUpdate.labelsHandler.example.com/unready-blocker-inplace
        example.com/unready-blocker-inplace: "true"
        ## corresponding to the spec.lifecycle.preDelete.labelsHandler.example.com/unready-blocker-inplace
        example.com/unready-blocker-delete: "true"
      containers:
        - name: main
          image: nginx:latest
          imagePullPolicy: Always
  updateStrategy:
    maxUnavailable: 20%
    type: InPlaceIfPossible
```

### LifeCycle Operator 构建
在 OpenKruise Github 仓库中，我们给出了一个完整的 [CloneSet LifeCycle Operator 代码示例](https://github.com/openkruise/samples/tree/master/lifecycle-hook-controller)。
因此在本文中，我们不再赘述一些代码细节，而是主要结合场景对一些关键的代码逻辑进行讲解，如果需要参考完整的代码，可以直接到该仓库中去找。

#### Operator 初始化
推荐使用 Kubebuilder 构建 Operator，具体构建步骤请参考 [Kubebuilder 官方文档](https://book.kubebuilder.io/quick-start.html#create-a-project)。
初始化完成的 Operator 目录结构类似如下:

```shell
$ tree
.
├── Dockerfile
├── LICENSE
├── Makefile
├── PROJECT
├── README.md
├── config
│   └── ....
├── controllers
│   └── lifecyclehook
│       └── lifecyclehook_controller.go
├── go.mod
├── go.sum
├── hack
│   └── ....
└── main.go
```

#### Controller 逻辑编写
Pod 生命周期状态管理逻辑都会在 `lifecyclehook_controller.go` 文件的 ` Reconcile(req ctrl.Request) (ctrl.Result, error)`  方法中编写。

例如在本文的假设的场景中，我们可以将 Pod 的生命周期管理逻辑通过以下代码来实现：

```go

const (
	deleteHookLabel  = "example.com/unready-blocker-delete"
	inPlaceHookLabel = "example.com/unready-blocker-inplace"
	newlyCreateLabel = "example.com/newly-create"
)

func (r *SampleReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
  
	... ...

	switchLabel := func(pod *v1.Pod, key, value string) error {
		body := fmt.Sprintf(`{"metadata":{"labels":{"%s":"%s"}}}`, key, value)
		if err := r.Patch(context.TODO(), pod, client.RawPatch(types.StrategicMergePatchType, []byte(body))); err != nil {
			return err
		}
		return nil
	}


	/*
		Pod LifeCycle Hook Logic
	*/
	switch {
	// handle newly-created pod
	case IsNewlyCreateHooked(pod):
		// register this pod to your service discovery center
		if err := postRegistry(pod); err != nil {
			return reconcile.Result{}, err
		}
		if err := switchLabel(pod, newlyCreateLabel, "false"); err != nil {
			return reconcile.Result{}, err
		}
		
	// handle the pod which is preparing to inplace update
	case IsPreUpdateHooked(pod):
		// let the service discover center fail over this pod 
		if err := postFailOver(pod); err != nil {
			return reconcile.Result{}, err
		}
		if err := switchLabel(pod, inPlaceHookLabel, "false"); err != nil {
			return reconcile.Result{}, err
		}
		
	// handle the pod which is updated completely 
	case IsUpdatedHooked(pod):
		// register this pod again to your service discovery center	
		if err := postRegistry(pod); err != nil {
			return reconcile.Result{}, err
		}
		if err := switchLabel(pod, inPlaceHookLabel, "true"); err != nil {
			return reconcile.Result{}, err
		}

	// handle the pod which is preparing to delete	
	case IsPreDeleteHooked(pod):
		// just unregister this pod from your service discovery center
		if err := postUnregister(pod); err != nil {
			return reconcile.Result{}, err
		}
		if err := switchLabel(pod, deleteHookLabel, "false"); err != nil {
			return reconcile.Result{}, err
		}
	}

	return ctrl.Result{}, nil
}

func IsNewlyCreateHooked(pod *v1.Pod) bool {
	return kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStateNormal && pod.Labels[newlyCreateLabel] == "true" && IsPodReady(pod)
}

func IsPreUpdateHooked(pod *v1.Pod) bool {
	return kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStatePreparingUpdate && pod.Labels[inPlaceHookLabel] == "true"
}

func IsUpdatedHooked(pod *v1.Pod) bool {
	return kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStateUpdated && pod.Labels[inPlaceHookLabel] == "false" && IsPodReady(pod)
}

func IsPreDeleteHooked(pod *v1.Pod) bool {
	return kruiseappspub.LifecycleStateType(pod.Labels[kruiseappspub.LifecycleStateKey]) == kruiseappspub.LifecycleStatePreparingDelete && pod.Labels[DeleteHookLabel] == "true"
}
```

上述代码中四个 case 分别从上到下对应 Pod 的创建后、升级前、升级后、删除前等四个重要声明周期节点，用户需要根据自己的需要来完善相应的 Hook。在本文的场景中，上述几个 Hook 的行为具体为：
- `postRegistry(pod *v1.Pod)` : 发送请求通知服务发现中心注册该 Pod 服务；
- `postFailOver(pod *v1.Pod)` : 发送请求通知服务发现中心 Fail Over 该 Pod 服务；
- `postUnregiste(pod *v1.Pod)`: 发送请求通知服务发现中心将该 Pod 服务注销。

#### Operator 部署
当该 Operator 代码逻辑完善后，需要将该 Operator 部署到目标集群，部署方式可参考 Kubebuilder 官方文档，此处不再赘述。

Operator 部署完成后，该 Operator 将持续监听集群中 Pod 的状态，并在每个 Pod 的关键生命周期节点自动执行上述 Hook，从而将 Kubernetes 与你的服务发现中心进行衔接，弥合两者的 Gap。

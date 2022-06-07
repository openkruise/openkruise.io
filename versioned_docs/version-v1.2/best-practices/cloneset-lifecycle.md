---
title: CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle 
---
Due to various historical reasons or objective factors, the existing system architectures of some companies are not compatible with Kubernetes very well. For example, some companies use another service registration and discovery center, which is totally independent with Kubernetes, instead of  [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/). Under this architecture, users will encounter many problems if they want to manage their infrastructure and  applications with Kubernetes.

For example, whenever Kubernetes successfully creates a Pod, users should register the Pod with the service discovery center so that it can provide services to the outside. Accordingly, when users want to offline a Pod, they usually need to delete it first in the service discovery center before they can gracefully offline the Pod, otherwise it may lead to some traffic routing problems.

However, in Kubernetes, if replicas or template field of workloads was changed, the workload controller will immediately create/delete/update the pod. No time is provided for users to do customized operations. Hence, it is difficult for users to manage the life cycle of the pods in this scenarios.

![why](/img/docs/best-practices/cloneset_lifecycle.png)

Openkruise  CloneSet Lifecycle feature provides such a set of highly-expandable mechanism which allows users do refined and customized management to pod life cycle.
Specifically, CloneSet provide some hooks at several important time spots in the Pod life cycle, so that users can insert their customized actions via these hooks. For example, CloneSet allow users to unregister a pod with the service discovery center before the pod upgrade, and then register the pod after the pod upgrade complete.

In the following, we will explain this feature in a specific scenario to help you further understand it.

### Scenario hypothesis

We assume the following scenario:
- Users do not use Kubernetes Service, and their service discovery system is totally independent of Kubernetes;
- Users use CloneSet as the Kubernetes workload to manage their applications.

And we make the following reasonable assumptions about the needs of users:
- When the Pod is created：
  - Register the Pod IP with service discovery center when the pod is available；
- When the Pod is upgraded ：
  - Before the upgrade, Unregister the Pod IP from the service discovery center；
  - After the updrade, Register the Pod IP with service discovery center when the pod is available；
- When the Pod is deleted：
  - Before the deleteion, Unregister the Pod IP from the service discovery center； 

Based on the above assumptions, we will describe in detail how to use CloneSet Lifecycle to write a simple operator to implement the user-defined pod life cycle management.

### Principle
CloneSet Lifecycle defines the pod life cycle via the following 5 states:
- Normal: normal state;
- PreparingUpdate: The CloneSet is preparing to update the pod. The pod upgrade will be blocked, so as to wait for users to execute hook and complete some preprocessing operations before upgrading;
- Updating: the pod is being upgraded in inPlace way;
- Updated: the pod upgrade is completed.
- PreparingDelete: the CloneSet is preparing to delete the pod. The pod deletion will be blocked, so as to wait for users to execute hook and do some preprocessing operations before deletion;

The transition logic among the above five states is controlled by a state machine, which is explained in detail in [CloneSet official document] (https://openkruise.io/docs/user-manuals/cloneset/#lifecycle-hook). Users can select one or more of their concerns, implement an independent operator to manage the pod life cycle states, control the life cycle of pod, and insert customized logic at the time spots they are concerned about.

### CloneSet Lifecycle Configuration
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

### Lifecycle Operator 
In the OpenKruise repository, we give a complete [CloneSet Lifecycle Operator code example](https://github.com/openkruise/samples/tree/master/lifecycle-hook-controller).
Therefore,  we will not repeat some code details in this article, but focus on explaining some key logic of the operation under the hypothetical scenario. 
If you need to refer to the complete code, you can go directly to see this repository.

#### Operator initialization
It is recommended to use Kubebuilder to build the operator. Please refer to [Kubebuilder official document](https://book.kubebuilder.io/quick-start.html#create-a-project) for the specific steps.

The directory structure of an initialized operator is similar to the following:

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

#### Controller Logic
Lifecycle Hook is implenmented in ` Reconcile(req ctrl.Request) (ctrl.Result, error)` function in `lifecyclehook_controller.go` file. 
In our hypothetical scenarios, we implemented the pod life cycle management logic through the following codes:

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
		Pod Lifecycle Hook Logic
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

The four `switch-cases` correspond to the four key time spots: after creation, pre-update, updated and pre-delete. Users can implement the corresponding hook according to their needs. In our hypothetical scenario, the implementation of the above hooks are as follows:
- `postRegistry(pod *v1.Pod)` : send a http/https request to the service discovery center to register the Pod; 
- `postFailOver(pod *v1.Pod)` : send a http/https request to the service discovery center to fail over the Pod; 
- `postUnregiste(pod *v1.Pod)`: send a http/https request to the service discovery center to unregister the Pod; 

#### Operator 部署
When the code of the operator is perfect, the operator needs to be built and deployed to the target cluster. You can refer to the Kubebuilder official document to do that.

After the deployment of the operator is completed, the operator will continuously watch the state of pods in the cluster and automatically execute the above hook at the key time spot of pod life cycle, to bridge the gap between Kubernetes and the service discovery center.

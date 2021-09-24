---
slug: learning-concurrent-reconciling
title: Learning Concurrent Reconciling
authors: [Fei-Guo]
tags: [workload, reconcile, controller]
---

The concept of controller in Kubernete is one of the most important reasons that make it successful.
Controller is the core mechanism that supports Kubernetes APIs to ensure the system reaches 
the desired state. By leveraging CRDs/controllers and operators, it is fairly easy for 
other systems to integrate with Kubernetes. 

Controller runtime library and the corresponding controller tool [KubeBuilder](https://book.kubebuilder.io/introduction.html)
are widely used by many developers to build their customized Kubernetes controllers. In Kruise project,
we also use Kubebuilder to generate scaffolding codes that implement the "reconciling" logic. 
In this blog post, I will share some learnings from
Kruise controller development, particularly, about concurrent reconciling. 

Some people may already notice that controller runtime supports concurrent reconciling.
Check for the options ([source](https://github.com/kubernetes-sigs/controller-runtime/blob/81842d0e78f7111f0566156189806e2801e3adf1/pkg/controller/controller.go#L32))
used to create new controller:  

```
type Options struct {
	// MaxConcurrentReconciles is the maximum number of concurrent Reconciles which can be run. Defaults to 1.
	MaxConcurrentReconciles int

	// Reconciler reconciles an object
	Reconciler reconcile.Reconciler
}
```

Concurrent reconciling is quite useful when the states of the controller's watched objects change so
frequently that a large amount of reconcile requests are sent to and queued in the reconcile queue.
Multiple reconcile loops do help drain the reconcile queue much more quickly compared to the default single
reconcile loop case. Although this is a great feature for performance, without digging into the code,
an immediate concern that a developer may raise is that will this introduce consistency issue? 
i.e., is it possible that two reconcile loops handle the same object at the same time?

The answer is NO, as you may expect. The "magic" is enforced by the workqueue
implementation in Kubernetes `client-go`, which is used by controller runtime reconcile queue. 
The workqueue algorithm ([source](https://github.com/kubernetes/client-go/blob/a57d0056dbf1d48baaf3cee876c123bea745591f/util/workqueue/queue.go#L65))
is demonstrated in Figure 1.

![workqueue](/img/blog/2019-11-10-learning-concurrent-reconciling/workqueue.png)

Basically, the workqueue uses a `queue` and two `sets` to coordinate the process of handling multiple reconciling 
requests against the same object. Figure 1(a) presents the initial state of handling four reconcile requests,
two of which target the same object A. When a request arrives, the target object is first added to the `dirty set`
or dropped if it presents in `dirty set`,  and then pushed to the `queue` only if it is not presented in
`processing set`. Figure 1(b) shows the case of adding three requests consecutively. 
When a reconciling loop is ready to serve a request, it gets the target object from the `front` of the queue. The
object is also added to the `processing set` and removed from the `dirty set` (Figure 1(c)).
Now if a request of the processing object arrives, the object is only added to the `dirty set`, not
to the `queue` (Figure 1(d)). This guarantees that an object is only handled by one reconciling
loop. When reconciling is done, the object is removed from the `processing set`. If the object is also
shown in the `dirty set`, it is added back to the `back` of the `queue` (Figure 1(e)).

The above algorithm has following implications:
* It avoids concurrent reconciling for the same object.
* The object processing order can be different from arriving order even if there is only one reconciling thread.
This usually would not be a problem since the controller still reconciles to the final cluster state. However,
the out of order reconciling may cause a significant delay for a request. 
![workqueue-starve](/img/blog/2019-11-10-learning-concurrent-reconciling/workqueue-starve.png).... For example, as illustrated in 
Figure 2, assuming there is only one reconciling thread and two requests targeting the same object A arrive, one of
them will be processed and object A will be added to the `dirty set` (Figure 2(b)). 
If the reconciling takes a long time and during which a large number of new reconciling requests arrive,
the queue will be filled up by the new requests (Figure 2(c)). When reconciling is done, object A will be
added to the `back` of the `queue` (Figure 2(d)). It would not be handled until all the requests coming after had been
handled, which can cause a noticeable long delay. The workaround is actually simple - **USE CONCURRENT RECONCILES**.
Since the cost of an idle go routine is fairly small, the overhead of having multiple reconcile threads is
low even if the controller is idle. It seems that the `MaxConcurrentReconciles` value should
be overwritten to a value larger than the default 1 (CloneSet uses 10 for example).
* Last but not the least, reconcile requests can be dropped (if the target exists in `dirty set`). This means
that we cannot assume that the controller can track all the object state change events. Recalling a presentation
given by [Tim Hockin](https://speakerdeck.com/thockin/edge-vs-level-triggered-logic), Kubernetes controller
is level triggered, not edge triggered. It reconciles for state, not for events. 

Thanks for reading the post, hope it helps.

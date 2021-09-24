---
slug: workload-classification-guidance
title: Kruise Workload Classification Guidance
authors: [Fei-Guo, FillZpp]
tags: [workload]
---

Kubernetes does not provide a clear guidance about which controller is the best fit for
a user application. Sometimes, this does not seem to be a big problem if users understand
both the application and workload well. For example, users usually know when to choose
`Job/CronJob` or `DaemonSet` since the concepts of these workload are straightforward -
the former is designed for temporal batch style applications and the latter is suitable
for long running Pod which is distributed in every node. On the other hand, the usage
boundary between `Deployment` and `StatefulSet` is vague. An application managed by
a `Deployment` conceptually can be managed by a `StatefulSet` as well, the opposite may
also apply as long as the Pod `OrderedReady` capability of `StatefulSet` is not mandatory.
Furthermore, as more and more customized controllers/operators become available in Kubernetes
community, finding suitable controller can be a nonnegligible user problem especially
when some controllers have functional overlaps.

Kruise attempts to mitigate the problem from two aspects:
* Carefully design the new controllers in the Kruise suite to avoid unnecessary functional
duplications that may confuse users.
* Establish a classification mechanism for existing workload controllers so that user
can more easily understand the use cases of them. We will elaborate this more in this
post. The first and most intuitive criterion for classification is the controller name.

### Controller Name Convention
An easily understandable controller name can certainly help adoption. After consulting
with many internal/external Kubernetes users, we decide to use the following naming
conventions in Kruise. Note that these conventions are not contradicted with the controller
names used in upstream controllers.

* **Set** -suffix names: This type of controller manages Pods directly. Examples
include `CloneSet`, `ReplicaSet` and `SidecarSet`. It supports
various depolyment/rollout strategies in Pod level.

* **Deployment** -suffix names: This type of controller does not manage Pods
directly. Instead, it manages one or many **Set** -suffix workload instances which are
created on behalf of one application. The controller can provide capabilities
to orchestrate the deployment/rollout of multiple instances. For example, `Deployment`
manages `ReplicaSet` and provides rollout capability which is not available in `ReplicaSet`.
`UnitedDeployment` (planned in [M3 release](https://github.com/openkruise/kruise/projects))
manages multiple `StatefulSet` created in respect of multiple domains
(i.e., fault domains) within one cluster.

* **Job** -suffix names: This type of controller manages batch style applications with
different depolyment/rollout strategies. For example, `BroadcastJob` distributes a
job style Pod to every node in the cluster.

**Set**, **Deployment** and **Job** are widely adopted terms in Kubernetes community.
Kruise leverages them with certain extensions.

Can we further distinguish controllers with the same name suffix? Normally the string prior to
the suffix should be self-explainable, but in many cases it is hard to find a right word to
describe what the controller does. Check to see how `StatefulSet` is originated in
this [thread](https://github.com/kubernetes/kubernetes/issues/27430). It takes four
months for community to decide to use the name `StatefulSet` to replace the original
name `PetSet` although the new name still confuse people by looking
at its API documentation. This example showcases that sometimes a well-thought-out name
may not be helpful to identify controller. Again, Kruise does not plan to resolve
this problem. As an incremental effort, Kruise considers the following criterion to help classify
**Set** -suffix controllers.


### Fixed Pod Name
One unique property of `StatefulSet` is that it maintains consistent identities for
Pod network and storage. Essentially, this is done by fixing Pod names.
Pod name can identify both network and storage since it is part of DNS record and
can be used to name Pod volume claim. Why is this property needed given that all Pods in
`StatefulSet` are created from the same Pod template?
A well known use case is to manage distributed coordination server application such as
etcd or Zookeeper. This type of application requires the cluster member
(i.e., the Pod) to access the same data (in Pod volume) whenever a member is
reconstructed upon failure, in order to function correctly. To differentiate the term
`State` in `StatefulSet` from the same term used in other computer science areas,
I'd like to associate `State` with Pod name in this document. That being said, controllers
like `ReplicaSet` and `DaemonSet` are `Stateless` since they don't require to reuse the
old Pod name when a Pod is recreated.

Supporting `Stateful` does lead to inflexibility for controller. `StatefulSet` relies on ordinal
numbers to realize fixing Pod names. The workload rollout and scaling
has to be done in a strict order. As a consequence, some useful enhancements to `StatefulSet`
become impossible. For example,
* Selective Pod upgrade and Pod deletion (when scale in). These features can be helpful
when Pods are spread across different regions or fault domains.
* The ability of taking control over existing Pods with arbitrary names. There are
cases where Pod creation is done by one controller but Pod lifecycle management
is done by another controller (e.g., `StatefulSet`).

We found that many containerized applications do not require the `Stateful` property
of fixing Pod names, and `StatefulSet` is hard to be extended for those
applications in many cases. To fill the gap, Kruise has released a new controller
called `CloneSet` to manage the `Stateless` applications. In a nutshell, `CloneSet`
provides PVC support and enriched rollout and management capabilities.
The following table roughly compares Advanced StatefulSet and CloneSet in a few aspects.

| Features   |     Advanced StatefulSet      |  CloneSet |
|----------|:-------------:|:------:|
| PVC | Yes | Yes |
| Pod name | Ordered | Random |
| Inplace upgrade | Yes | Yes |
| Max unavailable | Yes | Yes |
| Selective deletion | No | Yes |
| Selective upgrade | No | Yes |
| Change Pod ownership | No | Yes |

Now, a clear recommendation to Kruise users is if your applications require fixed Pod names (identities for Pod network and storage), you can start with `Advanced StatefulSet`.
Otherwise, `CloneSet` is the primary choice of **Set** -suffix controllers (if `DaemonSet` is not
applicable).

### Summary
Kruise aims to provide intuitive names for new controllers. As a supplement, this post
provides additional guidance for Kruise users to pick the right controller for their
applications. Hope it helps!

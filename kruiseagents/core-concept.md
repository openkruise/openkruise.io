# Core Concept

### Sandbox

`Sandbox` is the core CRD of OpenKruise Agents. It manages the lifecycle of a sandbox instance (such as a Pod) and
provides advanced features including Pause, Resume, Checkpoint, Fork, and in-place upgrades.

### SandboxSet

`SandboxSet` is the workload that manages `Sandbox`. Its function is similar to a `ReplicaSet` that manages Pods.
It enables sub-second sandbox startup by pre-warming a pool of sandbox instances. Optimized specifically for scaling 
performance, `SandboxSet` can rapidly replenish sandboxes as they are consumed.

### SandboxClaim

`SandboxClaim` is the request to claim an un-used Sandbox from SandboxSet. Once a Sandbox is claimed, it is not available for other claim requests, and will undergo a series of postprocessing including inplace-update, dynamic storage mounting. 


### SandboxTemplate
`SandboxTemplate` is an immutable resource that represents a revision of sandbox templates, a `SandboxSet` may contain multiple `SandboxTemplate` if its template is being changed. 

### Checkpoint
`Checkpoint` is a snapshot of sandbox intermediates states which may includes memory, rootfs etc. A checkpoint can be made from a running Sandbox, and can be used to clone multiple sandboxes. A checkpoint is related the SandboxTemplate of the Sandbox from which the Checkpoint is being made. 


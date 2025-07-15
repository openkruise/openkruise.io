# State & OpsState

## GameServer State

State represents the runtime state of the game server, related to the lifecycle of the pod and cannot be customized by the user. The current State includes the following values:

- Creating —— indicates that the pod is being created, equivalent to Pod Pending
- Ready —— indicates that the pod is ready, with the pod ready condition being true
- NotReady —— indicates that the pod is not ready, with the pod ready condition being false
- Crash —— indicates that the pod has failed, equivalent to Pod Failed
- Deleting —— indicates that the pod is being deleted, equivalent to Pod Terminating
- Updating —— indicates that the pod is undergoing in-place upgrade
- PreDelete —— indicates that the pod is in a pre-deletion state. It appears after executing the pod's deletion action with a deletion lifecycle hook set and entering the Deleting state after resolving the deadlock
- PreUpdate —— indicates that the pod is in a pre-upgrade state. It appears after performing an in-place upgrade of the pod with an update lifecycle hook set and entering the Updating state after resolving the deadlock
- Unknown —— all other states not mentioned above

Annotation "game.kruise.io/state-last-changed-time" records the time when the state was last changed. Users can use DownwardAPI to sink it into the container for business applications to obtain.

## GameServer OpsState

OpsState represents the operational state of the game server, determined by the business and can be freely modified by the user. OKG provides some reserved values with special meanings, including:

- None —— default value, representing no exceptions or special states
- WaitToBeDeleted —— the highest priority for game server scaling down, and will be automatically reclaimed after configuring automatic scaling policy
- Maintaining —— the lowest priority for game server scaling down
- Allocated —— the scaling down priority of the game server is greater than Maintaining but less than None. It usually represents that the game server has been allocated and can be used in game matching scenarios.
- Kill —— game servers with Kill set will be directly deleted by the OKG controller

Users can change the GameServer opsState by calling the K8s API (or kubectl), and can also automatically trigger the corresponding GameServer opsState change by customizing the service quality features within the business container.

Annotation "game.kruise.io/opsState-last-changed-time" records the time when the state was last changed. Users can use DownwardAPI to sink it into the container for business applications to obtain.

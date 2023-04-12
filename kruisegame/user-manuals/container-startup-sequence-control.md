# Startup Sequence Control
## Feature overview

When there are multiple containers in a single game server Pod, sometimes it is necessary to require the startup sequence of the containers, OKG provides the function of custom order startup.

## Examples

Add KRUISE_CONTAINER_PRIORITY environment variable in GameServerSet.Spec.GameServerTemplate.spec.containers:

```
apiVersion: game.kruise.io/v1alpha1
kind: GameServerSet

# ...

spec:
  gameServerTemplate:
    spec:
      containers:
      - name: main
        # ...
      - name: sidecar
        env:
        - name: KRUISE_CONTAINER_PRIORITY
          value: "1"
    
# ...

```

- The value range is [-2147483647, 2147483647], if not written, the default is 0.
- Containers with high weights are guaranteed to start before containers with low weights.
- Containers of the same weight do not guarantee start order.

In the above example, when the game server starts, because the sidecar has a higher weight, start the sidecar container first, and then start the main container.
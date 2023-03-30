# FAQ

## How to debug your code

### Compile & Deploy with Yaml

0) Edit Makefile. Change the value of the IMG field to the repository address of Makefile.

1) Compile and package the images of kruise-game-manager.

```bash
make docker-build
```

2) Upload the packaged image to the image repository.

```bash
make docker-push
```

3) Deploy the kruise-game-manager component in a Kubernetes cluster (~/.kube/conf).

```bash
make deploy
```



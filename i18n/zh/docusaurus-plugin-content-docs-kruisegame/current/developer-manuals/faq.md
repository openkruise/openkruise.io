# FAQ

## 如何调试你的代码


0) 编辑Makefile，将IMG字段的值修改为Makefile的仓库地址。

1) 编译打包kruise-game-manager镜像。

```bash
make docker-build
```

2) 将打包后的镜像上传到镜像仓库。

```bash
make docker-push
```

3) 在 Kubernetes 集群 (~/.kube/conf) 中部署 kruise-game-manager 组件。

```bash
make deploy
```


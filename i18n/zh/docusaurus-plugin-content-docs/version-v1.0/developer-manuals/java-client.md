---
title: Java client
---

目前我们有一个 [client-java](https://github.com/openkruise/client-java) 仓库提供了 Kruise 资源的 schema 定义。
不过，这个它已经不太推荐使用，我们仍然强烈建议你使用 [Golang Client](./go-client)。

如果你需要使用 client-java，要注意：

1. 它的 schema 定义可能会落后于最新的 Kruise 版本，我们不会为它生成每个 release 版本。
2. 这个包没有上传到官方的 maven 仓库中，你需要手动下载这个项目并打包为 jar 包使用。

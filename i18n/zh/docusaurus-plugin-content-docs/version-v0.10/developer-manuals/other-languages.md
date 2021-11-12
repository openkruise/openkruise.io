---
title: Other languages
---

目前，Kruise 没有提供除了 Golang 和 Java 之外语言的 SDK，事实上我们也只推荐你使用 [Golang Client](./go-client)，它是保证了最新版本和稳定性。

如果你要使用其他编程语言比如 Python，你只能使用它们的官方 K8s client 比如 [kubernetes-client/python](https://github.com/kubernetes-client/python)。
通常来说，它们都会提供一些让你操作任意 CR 自定义资源的方法。

---
title: Java client
---

We do have a [client-java](https://github.com/openkruise/client-java) repository,
which only includes schema definition and clientsets of Kruise.

However, it is someway deprecated. We strongly recommend you to use the [Golang Client](./go-client).

If you have to use the [client-java](https://github.com/openkruise/client-java), please note that:

1. The schema definition in it may be an older version of Kruise, which means we will not dump each release version for it.
2. This package has not been uploaded to the officail maven repository, which means you should manually download this repo and package it to use.

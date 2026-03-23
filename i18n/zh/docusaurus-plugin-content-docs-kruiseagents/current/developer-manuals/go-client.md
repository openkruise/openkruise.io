---
title: Go 客户端
---

如果你需要在一个 Golang 项目中对 Agents 的资源（如 SandboxClaim、Sandbox 等）进行 create/get/update/delete 操作，或者通过
informer 进行 list-watch，你需要使用支持 Agents 的客户端。

你需要在你的项目中引入 [agents-api](https://github.com/openkruise/agents-api) 仓库，它包含了 Agents 的 schema 定义以及
clientset 等工具。

## 使用方式

首先，在你的 `go.mod` 中引入 `agents-api` 依赖：

```
require github.com/openkruise/agents-api v0.1.0
```

然后，你可以直接使用 `agents-api` 提供的 clientset 来操作 Agents 资源。

## 完整示例

以下是一个完整的示例，展示了如何创建 SandboxClaim、等待其就绪并列出分配的
Sandbox。更多关于创建沙箱的基本操作，请参考 [README](https://github.com/openkruise/agents-api/blob/master/examples/sandboxclaim-example/README.md)。

```go
package main

import (
	"context"
	"flag"
	"fmt"
	"path/filepath"
	"time"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	appsv1alpha1 "github.com/openkruise/agents-api/agents/v1alpha1"
	kruiseclient "github.com/openkruise/agents-api/client/clientset/versioned"
)

func main() {
	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err)
	}

	clientset, err := kruiseclient.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	claim := appsv1alpha1.SandboxClaim{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: "demo",
		},

		Spec: appsv1alpha1.SandboxClaimSpec{
			Replicas:     int32Ptr(2),
			TemplateName: "demo",
		},
	}
	result, err := clientset.AgentsV1alpha1().
		SandboxClaims("demo").
		Create(context.TODO(), &claim, metav1.CreateOptions{})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Created sandboxclaim %q.\n", result.GetObjectMeta().GetName())

	// wait for sandboxclaim
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()

	err = wait.PollUntilContextTimeout(ctx, time.Second, 1*time.Minute, true, func(ctx context.Context) (done bool, err error) {
		updated, err := clientset.AgentsV1alpha1().SandboxClaims("demo").Get(ctx, result.Name, metav1.GetOptions{})
		if updated.Status.Phase != appsv1alpha1.SandboxClaimPhaseCompleted {
			return false, nil
		}

		if claim.Spec.Replicas != nil && updated.Status.ClaimedReplicas != *claim.Spec.Replicas {
			return true, fmt.Errorf("partial claimed")
		} else if updated.Status.ClaimedReplicas == 0 {
			return true, fmt.Errorf("none claimed")
		}
		return true, nil
	})

	if err != nil {
		panic(err)
	}

	// List claimed sandboxes
	fmt.Printf("Listing sandboxes in namespace %q:\n", "demo")
	list, err := clientset.AgentsV1alpha1().
		Sandboxes("demo").
		List(context.TODO(), metav1.ListOptions{
			LabelSelector: fmt.Sprintf("agents.kruise.io/claim-name=%v", result.Name),
		})
	if err != nil {
		panic(err)
	}
	for _, d := range list.Items {
		fmt.Printf(" claimed sandboxes %s/%s\n", d.Namespace, d.Name)
	}
}

func int32Ptr(i int32) *int32 { return &i }
```

---
title: Go Client
---

If you need to perform create/get/update/delete operations on Agents resources (such as SandboxClaim, Sandbox, etc.) in
a Golang project, or perform list-watch via informer, you need to use a client that supports Agents.

You need to import the [agents-api](https://github.com/openkruise/agents-api) repository in your project, which contains
the schema definitions for Agents as well as tools like clientset.

## Usage

First, add the `agents-api` dependency in your `go.mod`:

```
require github.com/openkruise/agents-api v0.1.0
```

Then, you can directly use the clientset provided by `agents-api` to operate on Agents resources.

## Complete Example

Below is a complete example demonstrating how to create a SandboxClaim, wait for it to be ready, and list the allocated
Sandboxes. For more basic operations on creating sandboxes, please refer to
the [README](https://github.com/openkruise/agents-api/blob/master/examples/sandboxclaim-example/README.md).

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

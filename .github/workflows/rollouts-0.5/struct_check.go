package main

import (
	"check/utils"
	kruiseRolloutApi "github.com/openkruise/rollouts/api"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
)

func main() {
	kruiseRolloutApi.AddToScheme(clientgoscheme.Scheme)
	utils.Handle()
}

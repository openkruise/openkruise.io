package main

import (
	"check/utils"
	kruiseGamev1alpha1 "github.com/openkruise/kruise-game/apis/v1alpha1"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
)

func main() {
	kruiseGamev1alpha1.AddToScheme(clientgoscheme.Scheme)
	utils.Handle()
}

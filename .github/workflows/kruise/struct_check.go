package main

import (
	"check/utils"
	kruiseApi "github.com/openkruise/kruise/apis"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
)

func main() {
	kruiseApi.AddToScheme(clientgoscheme.Scheme)
	utils.Handle()
}

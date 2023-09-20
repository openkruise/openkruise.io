package main

import (
	"encoding/base64"
	"fmt"
	"log"

	//kruise "github.com/openkruise/kruise-api"
	"io/fs"
	"io/ioutil"

	kruise "github.com/openkruise/kruise/apis"
	"github.com/pkg/errors"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/runtime/serializer/json"
	"k8s.io/apimachinery/pkg/util/yaml"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"

	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// VerifyUnmarshalStrict takes a slice of schemes, a JSON/YAML byte slice and a GroupVersionKind
// and verifies if the schema is known and if the byte slice unmarshals with strict mode.
func VerifyUnmarshalStrict(schemes []*runtime.Scheme, gvk schema.GroupVersionKind, bytes []byte) error {
	var scheme *runtime.Scheme
	for _, s := range schemes {
		if _, err := s.New(gvk); err == nil {
			scheme = s
			break
		}
	}
	if scheme == nil {
		return nil
	}
	opt := json.SerializerOptions{Yaml: true, Pretty: false, Strict: true}
	serializer := json.NewSerializerWithOptions(json.DefaultMetaFactory, scheme, scheme, opt)
	_, _, err := serializer.Decode(bytes, &gvk, nil)
	if err != nil {
		return errors.Wrapf(err, "error unmarshaling configuration %#v", gvk)
	}
	return nil
}

var compile, _ = regexp.Compile("```(?is)(.*?)```")

func main() {
	kruise.AddToScheme(clientgoscheme.Scheme)
	hasError := false
	filepath.WalkDir("../..", func(path string, d fs.DirEntry, err error) error {
		if !strings.HasSuffix(path, ".md") {
			return nil
		}
		fmt.Println(path)
		file, _ := ioutil.ReadFile(path)
		for _, item := range compile.FindAllStringSubmatch(string(file), -1) {
			if len(item) <= 1 {
				continue
			}
			_data := strings.ReplaceAll(strings.TrimPrefix(item[1], "yaml"), "...", "")
			for _, data := range strings.Split(_data, yamlSeparator) {
				t := map[string]interface{}{}
				yaml.Unmarshal([]byte(data), &(t))
				gvk, _ := getGroupVersionKind(t)
				if !strings.Contains(gvk.Group, "kruise") {
					continue
				}
				err := VerifyUnmarshalStrict([]*runtime.Scheme{clientgoscheme.Scheme}, gvk, []byte(data))
				switch _err := err.(type) {
				case base64.CorruptInputError:
				case nil:
				default:
					log.Fatalln(_err)
					fmt.Println("file://" + path)
					fmt.Println(data)
					hasError = true
				}
			}
		}
		return nil
	})

	if hasError {
		os.Exit(1)
	}

}

// getGroupVersionKind returns the GroupVersionKind of the object
func getGroupVersionKind(config map[string]interface{}) (schema.GroupVersionKind, error) {
	gvk := schema.GroupVersionKind{}
	if gv, found := config["apiVersion"]; found {
		casted, ok := gv.(string)
		if !ok {
			return gvk, fmt.Errorf("Expected string for apiVersion, found %T", gv)
		}
		s := strings.Split(casted, "/")
		if len(s) != 1 {
			gvk.Group = s[0]
		}
		gvk.Version = s[len(s)-1]
	} else {
		return gvk, fmt.Errorf("missing apiVersion in Kind %v", config)
	}
	if k, found := config["kind"]; found {
		casted, ok := k.(string)
		if !ok {
			return gvk, fmt.Errorf("expected string for kind, found %T", k)
		}
		gvk.Kind = casted
	} else {
		return gvk, fmt.Errorf("Missing kind in Kind %v", config)
	}
	return gvk, nil
}

const yamlSeparator = "\n---"

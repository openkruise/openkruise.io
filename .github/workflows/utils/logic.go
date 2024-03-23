package utils

import (
	"check/utils/yaml"
	"encoding/base64"
	rawJson "encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"io/ioutil"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/runtime/serializer/json"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
	"k8s.io/klog"
	"os"
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

func RemoveInvalidCharacter(txt string) string {
	_data := txt
	for i := 10; i >= 3; i-- {
		_data = strings.ReplaceAll(_data, strings.Repeat(".", i), "")
	}
	_data = strings.Trim(_data, " \n")

	if strings.HasPrefix(strings.ToLower(_data), "yaml") {
		_data = _data[4:]
	} else if strings.HasPrefix(strings.ToLower(_data), "yml") {
		_data = _data[3:]
	}
	if strings.HasPrefix(strings.ToLower(_data), "shell\n") {
		_data = strings.TrimPrefix(_data, "shell\n")
	}
	if strings.HasPrefix(strings.ToLower(_data), "cat ") {
		_data = strings.Join(strings.Split(_data, "\n")[1:], "\n")
	}

	_data = strings.TrimSuffix(_data, "\nEOF")
	return _data
}

type Item struct {
	Yaml string `json:"yaml"`
	Path string `json:"path"`
}

func Handle() {
	jsonFilePath := os.Args[1]
	file, _ := ioutil.ReadFile(jsonFilePath)
	var fs []Item
	rawJson.Unmarshal(file, &fs)
	pan := false
	for _, it := range fs {
		tmpYaml := RemoveInvalidCharacter(it.Yaml)
		t := map[string]interface{}{}
		yaml.Unmarshal([]byte(tmpYaml), &(t))
		gvk, _ := getGroupVersionKind(t)
		if !strings.Contains(strings.ToLower(tmpYaml), "apiversion") {
			continue
		}
		if !strings.Contains(gvk.Group, "kruise") {
			continue
		}
		err := VerifyUnmarshalStrict([]*runtime.Scheme{clientgoscheme.Scheme}, gvk, []byte(tmpYaml))
		switch _err := err.(type) {
		case base64.CorruptInputError:
		case nil:
		default:
			pan = true
		    klog.Errorln(it.Path)
			klog.Errorln(it.Yaml, _err)
		}
	}
	if pan {
		klog.Fatalln("")
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

import json
import os
import re
import subprocess
import sys
from collections import defaultdict
from typing import Dict, List, Tuple

kruise_version_map = defaultdict(list)
kruise_game_version_map = defaultdict(list)
rollouts_version_map = defaultdict(list)

kruise_api_version_map = {
    "policy.kruise.io/v1alpha1": "master",
    "policy.kruise.io/v1beta1": "master",
    "policy.kruise.io/v1": "master",
    "apps.kruise.io/v1alpha1": "master",
    "apps.kruise.io/v1beta1": "master",
    "apps.kruise.io/v1": "master",
}
rollouts_api_version_map = {
    "rollouts.kruise.io/v1alpha1": "master",
    "rollouts.kruise.io/v1beta1": "master",
    "rollouts.kruise.io/v1": "master",
}
game_api_version_map = {
    "game.kruise.io/v1alpha1": "master",
    "game.kruise.io/v1beta1": "master",
    "game.kruise.io/v1": "master",
}


def fill_version_map() -> None:
    def find_apiVersion(txt):
        for item in txt.split('\n'):
            if item.strip().lower().startswith('apiversion:'):
                return item[len('apiversion:'):].strip()

    def read_file(path, _d, v_m):
        with open(path, 'r', encoding='utf8') as f:
            text = f.read()

            for match in re.finditer(r'```yaml(.*?)```', text, re.DOTALL):
                content = match.group(1)

                for yamlTxt in content.split('\n---'):
                    apiVersion = find_apiVersion(yamlTxt)
                    if apiVersion != "":
                        _d[v_m.get(apiVersion, 'master')].append(dict(yaml=content, path=path))

    for cwd, dirs, files in os.walk('../..'):
        for file in files:
            p = os.path.join(cwd, file)
            if not p.endswith('.md'):
                continue
            if 'rollouts' in p.lower():
                read_file(p, rollouts_version_map, rollouts_api_version_map)
            elif 'game' in p.lower():
                read_file(p, kruise_game_version_map, game_api_version_map)
            else:
                read_file(p, kruise_version_map, kruise_api_version_map)


def _exec(command: str) -> None:
    print(command)
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    stdout, stderr = process.communicate()

    print("stdout:", stdout.decode())
    print("stderr:", stderr.decode())
    returncode = process.returncode
    if returncode != 0:
        sys.exit(returncode)


def _download_version(_f: str, version: str) -> Tuple[int, str]:
    cmd = _f.format(version=version)
    print(cmd)
    code, out = subprocess.getstatusoutput(cmd)
    print(out)
    if code != 0:
        sys.exit(code)
    return code, out


kruise_format = 'cd ./kruise && ' \
                'rm -rf go.* && ' \
                'wget https://raw.githubusercontent.com/openkruise/kruise/{version}/go.mod && ' \
                'go mod edit -module=check && ' \
                'go get github.com/openkruise/kruise@{version} && ' \
                'go mod edit -replace=github.com/openkruise/kruise=github.com/openkruise/kruise@{version} && ' \
                'go get k8s.io/klog/v2 && ' \
                'go get sigs.k8s.io/json && ' \
                'go get sigs.k8s.io/yaml && ' \
                'go mod tidy'

game_format = 'cd ./game && ' \
              'rm -rf go.* && ' \
              'wget https://raw.githubusercontent.com/openkruise/kruise-game/{version}/go.mod && ' \
              'go mod edit -module=check && ' \
              'go get github.com/openkruise/kruise-game@{version} && ' \
              'go mod edit -replace=github.com/openkruise/kruise-game=github.com/openkruise/kruise-game@{version} && ' \
              'go get k8s.io/klog/v2 && ' \
              'go get sigs.k8s.io/yaml && ' \
              'go get sigs.k8s.io/json && ' \
              'go mod tidy'

rollouts_format = 'cd ./rollouts && ' \
                  'rm -rf go.* && ' \
                  'wget https://raw.githubusercontent.com/openkruise/rollouts/{version}/go.mod && ' \
                  'go mod edit -module=check && ' \
                  'go get github.com/openkruise/rollouts@{version} && ' \
                  'go mod edit -replace=github.com/openkruise/rollouts=github.com/openkruise/rollouts@{version} && ' \
                  'go get k8s.io/klog/v2 && ' \
                  'go get sigs.k8s.io/json && ' \
                  'go get sigs.k8s.io/yaml && ' \
                  'go mod tidy'
rollouts_0_5_format = 'cd ./rollouts-0.5 && ' \
                      'rm -rf go.* && ' \
                      'wget https://raw.githubusercontent.com/openkruise/rollouts/{version}/go.mod && ' \
                      'go mod edit -module=check && ' \
                      'go get github.com/openkruise/rollouts@{version} && ' \
                      'go mod edit -replace=github.com/openkruise/rollouts=github.com/openkruise/rollouts@{version} && ' \
                      'go get k8s.io/klog/v2 && ' \
                      'go get sigs.k8s.io/json && ' \
                      'go get sigs.k8s.io/yaml && ' \
                      'go mod tidy'

tmp_file_path = '/tmp/files.json'


def write_info(files):
    with open(tmp_file_path, 'w', encoding='utf8') as f:
        f.write(json.dumps(files, ensure_ascii=False, indent=4))


def handle() -> None:
    for version, files in rollouts_version_map.items():
        if version and version != 'master':
            print(version)
            less_0_5 = False
            for item in ['0.1', '0.2', '0.3', '0.4']:
                if version.startswith(item):
                    less_0_5 = True
            if less_0_5:
                _download_version(rollouts_format, "v" + version)
            else:
                _download_version(rollouts_0_5_format, "v" + version)
        else:
            print("master")
            os.system(rollouts_format.format(version="master"))
        write_info(files)
        _exec('cd ./rollouts && go run . ' + tmp_file_path)

    for version, files in kruise_game_version_map.items():
        if version and version != 'master':
            print(version)
            _download_version(game_format, "v" + version)
        else:
            print("master")
            _exec(game_format.format(version="master"))
        write_info(files)
        _exec('cd ./game && go run . ' + tmp_file_path)

    for version, files in kruise_version_map.items():
        if version and version != 'master':
            print(version)
            _download_version(kruise_format, "v" + version)
        else:
            print("master")
            _exec(kruise_format.format(version="master"))
        write_info(files)
        _exec('cd ./kruise && go run . ' + tmp_file_path)


if __name__ == '__main__':
    fill_version_map()
    handle()

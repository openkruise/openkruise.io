import glob
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from collections import defaultdict

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
                    if apiVersion:
                        _d[v_m.get(apiVersion, 'master')].append(dict(yaml=yamlTxt, path=path))

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


def _run(cmd, cwd="."):
    """Run a command as a list of arguments without shell=True."""
    print(f"Running: {' '.join(cmd)} (in {cwd})")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    print("stdout:", result.stdout)
    print("stderr:", result.stderr)
    if result.returncode != 0:
        sys.exit(result.returncode)


def setup_go_module(directory, repo, version):
    """Download go.mod and configure the Go module for struct validation.

    This replaces the duplicated shell strings (kruise_format, game_format,
    rollouts_format, rollouts_0_5_format) that previously chained wget,
    go mod edit, go get, and go mod tidy via shell=True.
    """
    go_mod_url = (
        f"https://raw.githubusercontent.com/openkruise/{repo}/{version}/go.mod"
    )
    go_mod_path = os.path.join(directory, "go.mod")

    # Clean previous Go module files (equivalent to: rm -rf go.*)
    for f in glob.glob(os.path.join(directory, "go.*")):
        os.remove(f)

    # Download go.mod using urllib (replaces wget dependency)
    print(f"Downloading: {go_mod_url}")
    urllib.request.urlretrieve(go_mod_url, go_mod_path)

    # Run Go module setup commands individually with proper error handling
    go_commands = [
        ["go", "mod", "edit", "-module=check"],
        ["go", "get", f"github.com/openkruise/{repo}@{version}"],
        ["go", "mod", "edit",
         f"-replace=github.com/openkruise/{repo}="
         f"github.com/openkruise/{repo}@{version}"],
        ["go", "get", "k8s.io/klog/v2"],
        ["go", "get", "sigs.k8s.io/json"],
        ["go", "get", "sigs.k8s.io/yaml"],
        ["go", "mod", "tidy"],
    ]
    for cmd in go_commands:
        _run(cmd, cwd=directory)


tmp_file_path = os.path.join(tempfile.gettempdir(), 'version_struct_files.json')


def write_info(files):
    with open(tmp_file_path, 'w', encoding='utf8') as f:
        f.write(json.dumps(files, ensure_ascii=False, indent=4))


def handle() -> None:
    # --- Rollouts: write_info BEFORE download (preserving original ordering) ---
    for version, files in rollouts_version_map.items():
        write_info(files)
        if version and version != 'master':
            print(version)
            less_0_5 = any(version.startswith(v) for v in ['0.1', '0.2', '0.3', '0.4'])
            if less_0_5:
                setup_go_module('./rollouts', 'rollouts', 'v' + version)
                _run(['go', 'run', '.', tmp_file_path], cwd='./rollouts')
            else:
                setup_go_module('./rollouts-0.5', 'rollouts', 'v' + version)
                _run(['go', 'run', '.', tmp_file_path], cwd='./rollouts-0.5')
        else:
            print("master")
            # Master always uses ./rollouts (not ./rollouts-0.5)
            setup_go_module('./rollouts', 'rollouts', 'master')
            _run(['go', 'run', '.', tmp_file_path], cwd='./rollouts')

    # --- Game: write_info AFTER download (preserving original ordering) ---
    for version, files in kruise_game_version_map.items():
        if version and version != 'master':
            print(version)
            setup_go_module('./game', 'kruise-game', 'v' + version)
        else:
            print("master")
            setup_go_module('./game', 'kruise-game', 'master')
        write_info(files)
        _run(['go', 'run', '.', tmp_file_path], cwd='./game')

    # --- Kruise: write_info AFTER download (preserving original ordering) ---
    for version, files in kruise_version_map.items():
        if version and version != 'master':
            print(version)
            setup_go_module('./kruise', 'kruise', 'v' + version)
        else:
            print("master")
            setup_go_module('./kruise', 'kruise', 'master')
        write_info(files)
        _run(['go', 'run', '.', tmp_file_path], cwd='./kruise')


if __name__ == '__main__':
    fill_version_map()
    handle()

import os
import subprocess
from pathlib import Path

from agent.collect import collect_inventory


def _write_md(path: Path, title: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"---\ntitle: {title}\n---\n\nBody\n")


def _init_git(repo_root: Path):
    env = os.environ.copy()
    env.update(
        {
            "GIT_AUTHOR_NAME": "Test",
            "GIT_AUTHOR_EMAIL": "test@example.com",
            "GIT_COMMITTER_NAME": "Test",
            "GIT_COMMITTER_EMAIL": "test@example.com",
        }
    )
    subprocess.run(["git", "init"], cwd=repo_root, check=True, env=env)
    subprocess.run(["git", "add", "."], cwd=repo_root, check=True, env=env)
    subprocess.run(["git", "commit", "-m", "init"], cwd=repo_root, check=True, env=env)


def test_collect_inventory(tmp_path: Path):
    _write_md(tmp_path / "docs" / "a.md", "A")
    _write_md(tmp_path / "versioned_docs" / "b.md", "B")
    _write_md(tmp_path / "blog" / "c.md", "C")
    _write_md(tmp_path / "kruisegame" / "d.md", "D")

    _init_git(tmp_path)

    data = collect_inventory(tmp_path, tmp_path / "inventory.json")
    assert data["schema_version"] == 1
    assert data["generated_at"].endswith("+00:00")
    assert "errors" in data
    assert "files" in data
    assert len(data["files"]) == 4

    for item in data["files"]:
        assert item["path"].endswith(".md")
        assert item["sha"]
        assert item["last_commit_date"]
        assert isinstance(item["age_days"], int)
        assert item["age_days"] >= 0
        assert item["collected_at"].endswith("+00:00")

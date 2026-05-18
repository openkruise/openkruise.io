from __future__ import annotations

import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


def _run_git(args: list[str], cwd: Path) -> Optional[str]:
    result = subprocess.run(
        ["git", "-C", str(cwd), *args],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )
    output = result.stdout.strip()
    return output or None


def _repo_root(path: Path) -> Optional[Path]:
    path = path.resolve()
    cwd = path if path.is_dir() else path.parent
    root = _run_git(["rev-parse", "--show-toplevel"], cwd)
    return Path(root) if root else None


def get_last_commit_sha(path: Path) -> Optional[str]:
    """Return the last commit SHA for a path, or None."""
    repo_root = _repo_root(path)
    if not repo_root:
        return None
    rel = path.resolve().relative_to(repo_root).as_posix()
    return _run_git(["log", "-n", "1", "--format=%H", "--", rel], repo_root)


def get_last_commit_date(path: Path) -> Optional[str]:
    """Return the last commit date in ISO format for a path, or None."""
    repo_root = _repo_root(path)
    if not repo_root:
        return None
    rel = path.resolve().relative_to(repo_root).as_posix()
    return _run_git(["log", "-n", "1", "--format=%cI", "--", rel], repo_root)


def get_age_days(path: Path) -> Optional[int]:
    """Return the age in days since the last commit, or None."""
    last_commit = get_last_commit_date(path)
    if not last_commit:
        return None
    try:
        commit_dt = datetime.fromisoformat(last_commit.replace("Z", "+00:00"))
    except ValueError:
        return None
    now = datetime.now(timezone.utc)
    return max(0, (now - commit_dt).days)

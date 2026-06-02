#!/usr/bin/env python3
"""Staleness checker.

Scans every Markdown file under ``docs_dir`` and reports any file whose
*last git commit* is older than ``STALE_AFTER_DAYS`` days. The last-modified
date is taken from git history (committer date) rather than the filesystem
mtime, because a fresh checkout rewrites mtimes and would hide real staleness.

Files with no git history (newly added, not yet committed) are skipped:
they are new, not stale.
"""

from __future__ import annotations

import os
import subprocess
from datetime import datetime, timezone

STALE_AFTER_DAYS = 180


def _iter_md_files(docs_dir: str):
    """Yield absolute paths of every ``.md`` file under ``docs_dir``."""
    for root, _dirs, files in os.walk(docs_dir):
        for name in sorted(files):
            if name.endswith(".md"):
                yield os.path.join(root, name)


def _git_repo_root(path: str) -> str | None:
    """Return the git top-level directory containing ``path``, or None."""
    try:
        out = subprocess.run(
            ["git", "-C", path, "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, check=True,
        )
        return out.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


def _last_commit_iso(repo_root: str, file_path: str) -> str | None:
    """Return the ISO-8601 committer date of the last commit touching a file."""
    try:
        out = subprocess.run(
            ["git", "-C", repo_root, "log", "-1", "--format=%cI", "--", file_path],
            capture_output=True, text=True, check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    stamp = out.stdout.strip()
    return stamp or None


def run(docs_dir: str) -> list[dict]:
    """Scan ``docs_dir`` and return files whose last commit is too old."""
    repo_root = _git_repo_root(docs_dir)
    if repo_root is None:
        # Not a git repository (or git unavailable) — nothing we can assess.
        return []

    now = datetime.now(timezone.utc)
    findings: list[dict] = []

    for md_file in _iter_md_files(docs_dir):
        stamp = _last_commit_iso(repo_root, md_file)
        if not stamp:  # no commit history -> newly added, not stale
            continue

        committed = datetime.fromisoformat(stamp.replace("Z", "+00:00"))
        days_since = (now - committed).days
        if days_since > STALE_AFTER_DAYS:
            findings.append({
                "file": md_file,
                "last_modified": committed.date().isoformat(),
                "days_since": days_since,
            })

    return findings


if __name__ == "__main__":
    import json
    import sys

    target = sys.argv[1] if len(sys.argv) > 1 else "docs"
    print(json.dumps(run(target), indent=2))

from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml
from github import Github
from github.GithubException import GithubException


def load_config(path: Path) -> dict:
    """Load YAML config for PR creation."""
    if not path.exists():
        return {}
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    return data or {}


def _artifact_references(artifacts_dir: Path, staging_dir: Path, report_dir: Path) -> list[str]:
    """Return artifact path references for the PR body."""
    refs = []
    for path in [
        artifacts_dir / "scorecard.json",
        staging_dir / "suggestions.patch",
        staging_dir / "suggestions.preview.html",
        report_dir / "summary.md",
        report_dir / "report.json",
    ]:
        refs.append(path.as_posix())
    return refs


def create_draft_pr(
    *,
    repo_root: Path,
    config: dict,
    create_pr: bool,
    dry_run: bool,
    summary_path: Path,
    artifacts_dir: Path,
    staging_dir: Path,
    report_dir: Path,
) -> dict:
    """Create a draft pull request when explicitly enabled."""
    if not create_pr:
        return {"status": "noop", "reason": "create_pr flag is false"}

    if not config.get("open_pr"):
        return {"status": "noop", "reason": "config open_pr is false"}

    if dry_run:
        return {"status": "noop", "reason": "dry_run"}

    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return {"status": "noop", "reason": "missing GITHUB_TOKEN"}

    repo_name = config.get("github_repo") or os.getenv("GITHUB_REPO")
    if not repo_name:
        return {"status": "noop", "reason": "missing github_repo"}

    summary = ""
    try:
        summary = summary_path.read_text(encoding="utf-8").strip()
    except OSError:
        summary = ""

    refs = _artifact_references(artifacts_dir, staging_dir, report_dir)
    body = "## Summary\n\n"
    body += (summary + "\n\n") if summary else "(summary missing)\n\n"
    body += "## Artifacts\n\n"
    body += "\n".join(f"- {ref}" for ref in refs) + "\n"

    gh = Github(token)
    repo = gh.get_repo(repo_name)
    base = repo.default_branch

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    branch_name = f"doc-agent/{timestamp}"
    ref_name = f"refs/heads/{branch_name}"

    try:
        base_ref = repo.get_git_ref(f"heads/{base}")
        repo.create_git_ref(ref_name, base_ref.object.sha)
    except GithubException as exc:
        if exc.status != 422:
            raise

    title = f"[Doc Agent] Report {timestamp}"

    try:
        pr = repo.create_pull(
            title=title,
            body=body,
            base=base,
            head=branch_name,
            draft=True,
        )
    except GithubException as exc:
        return {"status": "error", "reason": str(exc)}

    try:
        pr.add_to_labels("doc-agent", "needs-review")
    except GithubException:
        pass

    return {
        "status": "created",
        "url": pr.html_url,
        "number": pr.number,
        "branch": branch_name,
    }

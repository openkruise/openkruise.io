import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import frontmatter

from .gitmeta import get_age_days, get_last_commit_date, get_last_commit_sha


def _iter_markdown_files(repo_root: Path) -> list[Path]:
    """Return a sorted list of markdown files under target directories."""
    targets = [
        repo_root / "docs",
        repo_root / "versioned_docs",
        repo_root / "blog",
    ]
    targets.extend([p for p in repo_root.glob("kruise*") if p.is_dir()])

    files = []
    for base in targets:
        if not base.exists():
            continue
        files.extend(base.rglob("*.md"))
    return sorted(files, key=lambda p: p.as_posix())


def _is_binary(path: Path) -> bool:
    """Return True if the file appears to be binary."""
    try:
        data = path.read_bytes()
    except OSError:
        return True
    return b"\x00" in data


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
    temp_path.replace(path)


def collect_inventory(repo_root: Path, output_path: Path = Path("inventory.json")) -> dict:
    """Collect inventory metadata and write inventory.json."""
    repo_root = repo_root.resolve()
    files = []
    errors = []
    generated_at = datetime.now(timezone.utc).isoformat()

    for path in _iter_markdown_files(repo_root):
        rel_path = path.relative_to(repo_root).as_posix()
        if _is_binary(path):
            errors.append({"path": rel_path, "error": "binary_file"})
            continue
        try:
            frontmatter.load(path)
        except Exception:
            errors.append({"path": rel_path, "error": "frontmatter_parse_failed"})

        sha = get_last_commit_sha(path)
        last_commit_date = get_last_commit_date(path)
        age_days = get_age_days(path)

        files.append(
            {
                "path": rel_path,
                "sha": sha,
                "last_commit_date": last_commit_date,
                "age_days": age_days,
                "collected_at": generated_at,
            }
        )

    files = sorted(files, key=lambda item: item["path"])

    data = {
        "schema_version": 1,
        "generated_at": generated_at,
        "files": files,
        "errors": errors,
    }
    output_path = (repo_root / output_path).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    _atomic_write_json(output_path, data)
    return data

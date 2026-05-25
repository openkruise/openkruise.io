"""
Generate Docusaurus-compatible blog post drafts from release changelog data.
Output goes to agent/staging/blog/ — maintainers decide what gets published.
"""
from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path
from typing import Any


_PROSE_FALLBACK = (
    "This release includes bug fixes, stability improvements, and dependency updates. "
    "See the [full release notes]({url}) for details."
)


def _sanitize_body(body: str) -> str:
    """Strip GitHub-flavoured diff markers and excessive blank lines."""
    body = re.sub(r"^```.*?^```", "", body, flags=re.DOTALL | re.MULTILINE)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def generate_blog_post(record: dict[str, Any], output_dir: Path) -> Path:
    """
    Write a single blog post draft for one release record.

    Args:
        record:     A staleness record from fetch_release_staleness().
        output_dir: Destination directory (e.g. agent/staging/blog/).

    Returns:
        Path to the written file.
    """
    name = record["name"]
    tag = record.get("tag", "unknown")
    published_at = record.get("published_at", "")
    changelog = record.get("changelog", "")
    repo = record.get("repo", "")

    try:
        date_str = datetime.fromisoformat(published_at.replace("Z", "+00:00")).strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        date_str = datetime.now().strftime("%Y-%m-%d")

    if changelog:
        body_section = _sanitize_body(changelog)
    else:
        release_url = f"https://github.com/{repo}/releases/tag/{tag}"
        body_section = _PROSE_FALLBACK.format(url=release_url)

    frontmatter = (
        f"---\n"
        f'title: "OpenKruise {name.title()} {tag} Released"\n'
        f"date: {date_str}\n"
        f"authors: [openkruise]\n"
        f"tags: [{name}, release]\n"
        f"---\n"
    )
    content = f"{frontmatter}\n## What's New in {tag}\n\n{body_section}\n"

    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{date_str}-{name}-{tag.lstrip('v')}.md"
    out_path = output_dir / filename
    out_path.write_text(content, encoding="utf-8")
    return out_path


def generate_blog_posts(records: list[dict[str, Any]], output_dir: Path) -> list[Path]:
    """Generate blog post drafts for all records that have a tag (no errors)."""
    written: list[Path] = []
    for record in records:
        if "error" in record or "tag" not in record:
            continue
        written.append(generate_blog_post(record, output_dir))
    return written

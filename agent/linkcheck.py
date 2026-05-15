import re
from pathlib import Path


_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
_HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)


def _slugify(text: str) -> str:
    """Create a deterministic anchor slug from heading text."""
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def _extract_anchors(content: str) -> set[str]:
    """Extract anchor slugs from markdown headings."""
    anchors = set()
    for match in _HEADING_RE.finditer(content):
        heading = match.group(2).strip()
        heading = re.sub(r"\s+#*$", "", heading).strip()
        if heading:
            anchors.add(_slugify(heading))
    return anchors


def _normalize_url(raw: str) -> tuple[str, str | None, bool]:
    """Normalize markdown link targets and flag external URLs."""
    url = raw.strip()
    if not url:
        return "", None, True
    if url.startswith("<") and url.endswith(">"):
        url = url[1:-1]
    if " " in url:
        url = url.split()[0]
    lower = url.lower()
    if lower.startswith("http://") or lower.startswith("https://") or lower.startswith("mailto:"):
        return "", None, True
    if "://" in lower:
        return "", None, True
    if url.startswith("#"):
        return "", url[1:], False
    if "#" in url:
        path_part, anchor = url.split("#", 1)
        return path_part, anchor, False
    return url, None, False


def _resolve_path(path_part: str, current_file: Path, repo_root: Path) -> Path:
    """Resolve a relative markdown link target to an absolute path."""
    if not path_part:
        return current_file
    if path_part.startswith("/"):
        return (repo_root / path_part.lstrip("/")).resolve()
    return (current_file.parent / path_part).resolve()


def _resolve_markdown_path(target: Path) -> Path | None:
    """Resolve a markdown file path, honoring .md and .mdx extensions."""
    if target.suffix in {".md", ".mdx"}:
        return target
    if target.suffix:
        return None
    md = target.with_suffix(".md")
    if md.exists():
        return md
    mdx = target.with_suffix(".mdx")
    if mdx.exists():
        return mdx
    if target.exists():
        return target
    return None


def check_links(markdown_content: str, current_file: Path, repo_root: Path) -> dict[str, list[str] | list[dict]]:
    """Check local markdown links and image references."""
    repo_root = repo_root.resolve()
    current_file = current_file.resolve()

    missing_files = set()
    missing_anchors = set()
    missing_images = set()
    valid_links = set()
    evidence = set()

    anchor_cache: dict[Path, set[str]] = {current_file: _extract_anchors(markdown_content)}

    def anchors_for(path: Path) -> set[str]:
        if path in anchor_cache:
            return anchor_cache[path]
        try:
            content = path.read_text(encoding="utf-8")
        except OSError:
            anchor_cache[path] = set()
            return anchor_cache[path]
        anchor_cache[path] = _extract_anchors(content)
        return anchor_cache[path]

    for line_no, line in enumerate(markdown_content.splitlines(), start=1):
        for match in _LINK_RE.finditer(line):
            raw = match.group(1)
            is_image = line[match.start()] == "!"
            path_part, anchor, ignored = _normalize_url(raw)
            if ignored:
                continue

            target = _resolve_path(path_part, current_file, repo_root)
            if is_image:
                if not target.exists():
                    try:
                        rel = target.relative_to(repo_root).as_posix()
                    except ValueError:
                        rel = target.as_posix()
                    missing_images.add(rel)
                    evidence.add(("missing_image", current_file.relative_to(repo_root).as_posix(), rel, line_no))
                else:
                    try:
                        rel = target.relative_to(repo_root).as_posix()
                    except ValueError:
                        rel = target.as_posix()
                    valid_links.add(rel)
                continue

            resolved = _resolve_markdown_path(target)
            if resolved is None:
                if not path_part:
                    continue
                fallback = target if target.suffix in {".md", ".mdx"} else target.with_suffix(".md")
                try:
                    rel = fallback.relative_to(repo_root).as_posix()
                except ValueError:
                    rel = fallback.as_posix()
                missing_files.add(rel)
                evidence.add(("missing_internal_link", current_file.relative_to(repo_root).as_posix(), rel, line_no))
                continue

            try:
                rel = resolved.relative_to(repo_root).as_posix()
            except ValueError:
                rel = resolved.as_posix()

            if not resolved.exists():
                missing_files.add(rel)
                evidence.add(("missing_internal_link", current_file.relative_to(repo_root).as_posix(), rel, line_no))
                continue

            if anchor:
                anchors = anchors_for(resolved)
                if anchor not in anchors:
                    missing_anchors.add(f"{rel}#{anchor}")
                    evidence.add(("missing_anchor", current_file.relative_to(repo_root).as_posix(), f"{rel}#{anchor}", line_no))
                else:
                    valid_links.add(f"{rel}#{anchor}")
            else:
                valid_links.add(rel)

    return {
        "missing_files": sorted(missing_files),
        "missing_anchors": sorted(missing_anchors),
        "missing_images": sorted(missing_images),
        "valid_links": sorted(valid_links),
        "evidence": [
            {"type": item[0], "source": item[1], "target": item[2], "line": item[3]}
            for item in sorted(evidence)
        ],
    }

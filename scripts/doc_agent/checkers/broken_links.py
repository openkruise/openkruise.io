#!/usr/bin/env python3
"""Broken-link checker.

Scans every Markdown file under ``docs_dir`` and reports inline links that
are either:

* **empty_link**   — ``[text]()`` (no destination at all)
* **missing_file** — ``[text](./relative/path.md)`` pointing at a local file
  that does not exist on disk

External links (http/https/mailto/...), protocol-relative links, pure
anchors (``#section``) and site-absolute Docusaurus routes (``/foo/bar``)
are intentionally skipped: they cannot be validated from the filesystem
alone, and flagging them would produce false positives.
"""

from __future__ import annotations

import os
import re

# Capture an optional leading "!" (so we can skip images), the link text,
# and the destination. Whitespace around the destination is tolerated.
_LINK_RE = re.compile(r"(!?)\[([^\]]*)\]\(\s*([^)]*?)\s*\)")

# Destinations we never try to resolve on disk.
_EXTERNAL_SCHEMES = ("http://", "https://", "ftp://", "mailto:", "tel:")


def _iter_md_files(docs_dir: str):
    """Yield absolute paths of every ``.md`` file under ``docs_dir``."""
    for root, _dirs, files in os.walk(docs_dir):
        for name in sorted(files):
            if name.endswith(".md"):
                yield os.path.join(root, name)


def _is_external(dest: str) -> bool:
    """True for links we should not resolve against the filesystem."""
    lowered = dest.lower()
    if lowered.startswith(_EXTERNAL_SCHEMES):
        return True
    if dest.startswith("//"):  # protocol-relative
        return True
    if dest.startswith("#"):  # pure in-page anchor
        return True
    # Site-absolute Docusaurus route (e.g. "/kruise/installation"): not a
    # filesystem path, so resolving it here is unreliable -> skip.
    if dest.startswith("/"):
        return True
    return False


def _resolves(dest: str, source_file: str) -> bool:
    """Return True if a local destination maps to a file that exists.

    Handles the common Docusaurus shapes: an explicit ``.md``/``.mdx`` file,
    an extensionless path, or a directory with an ``index``/``README``.
    """
    # Strip anchor / query fragments before touching the filesystem.
    path = re.split(r"[#?]", dest, maxsplit=1)[0].strip()
    if not path:  # destination was only an anchor/query
        return True

    base_dir = os.path.dirname(source_file)
    target = os.path.normpath(os.path.join(base_dir, path))

    candidates = [
        target,
        target + ".md",
        target + ".mdx",
        os.path.join(target, "index.md"),
        os.path.join(target, "index.mdx"),
        os.path.join(target, "README.md"),
    ]
    return any(os.path.isfile(c) for c in candidates)


def run(docs_dir: str) -> list[dict]:
    """Scan ``docs_dir`` and return a list of broken-link findings."""
    findings: list[dict] = []

    for md_file in _iter_md_files(docs_dir):
        try:
            with open(md_file, encoding="utf-8") as fh:
                lines = fh.readlines()
        except OSError:
            continue

        for lineno, line in enumerate(lines, start=1):
            for match in _LINK_RE.finditer(line):
                is_image, text, dest = match.group(1), match.group(2), match.group(3)
                if is_image:  # ![alt](src) is an image, not a link
                    continue

                if dest == "" or dest.strip() == "":
                    findings.append({
                        "file": md_file,
                        "line": lineno,
                        "link_text": text.strip(),
                        "issue_type": "empty_link",
                    })
                    continue

                if _is_external(dest):
                    continue

                if not _resolves(dest, md_file):
                    findings.append({
                        "file": md_file,
                        "line": lineno,
                        "link_text": text.strip(),
                        "issue_type": "missing_file",
                    })

    return findings


if __name__ == "__main__":
    import json
    import sys

    target = sys.argv[1] if len(sys.argv) > 1 else "docs"
    print(json.dumps(run(target), indent=2))

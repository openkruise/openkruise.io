#!/usr/bin/env python3
"""TODO / FIXME / XXX scanner.

Scans every Markdown file under ``docs_dir`` for unfinished-work markers.
Matching is case-sensitive on the conventional upper-case spellings
(``TODO``, ``FIXME``, ``XXX``) with word boundaries, so ordinary prose such
as "to do this" or "fix me" does not generate noise.

Two sources of false positives are deliberately excluded:

* **Fenced code blocks** (```` ``` ````/``~~~``). Markers inside example
  code are part of the sample, not documentation work items — e.g. the Go
  client docs are full of legitimate ``context.TODO()`` calls.
* **Function-call forms** like ``TODO(`` — these are API calls
  (``context.TODO()``), not annotations.
"""

from __future__ import annotations

import os
import re

_MARKER_RE = re.compile(r"\b(TODO|FIXME|XXX)\b")

# A line that opens or closes a fenced code block.
_FENCE_RE = re.compile(r"^\s*(```|~~~)")

# Keep report rows readable.
_CONTEXT_MAX = 120


def _iter_md_files(docs_dir: str):
    """Yield absolute paths of every ``.md`` file under ``docs_dir``."""
    for root, _dirs, files in os.walk(docs_dir):
        for name in sorted(files):
            if name.endswith(".md"):
                yield os.path.join(root, name)


def run(docs_dir: str) -> list[dict]:
    """Scan ``docs_dir`` and return every TODO/FIXME/XXX occurrence."""
    findings: list[dict] = []

    for md_file in _iter_md_files(docs_dir):
        try:
            with open(md_file, encoding="utf-8") as fh:
                lines = fh.readlines()
        except OSError:
            continue

        in_code_fence = False
        for lineno, line in enumerate(lines, start=1):
            if _FENCE_RE.match(line):
                in_code_fence = not in_code_fence
                continue
            if in_code_fence:
                continue

            context = line.strip()
            if len(context) > _CONTEXT_MAX:
                context = context[:_CONTEXT_MAX].rstrip() + "…"

            for match in _MARKER_RE.finditer(line):
                # Skip API-call forms like `context.TODO()` — not annotations.
                if line[match.end():match.end() + 1] == "(":
                    continue

                findings.append({
                    "file": md_file,
                    "line": lineno,
                    "marker": match.group(1),
                    "context": context,
                })

    return findings


if __name__ == "__main__":
    import json
    import sys

    target = sys.argv[1] if len(sys.argv) > 1 else "docs"
    print(json.dumps(run(target), indent=2))

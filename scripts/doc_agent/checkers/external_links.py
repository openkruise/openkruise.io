#!/usr/bin/env python3
"""External-link checker.

Scans every Markdown file under ``docs_dir`` for external ``http(s)`` links
(the ``[text](https://...)`` form) and verifies each one is reachable.

Behaviour
---------
* **HEAD request**, 10 second timeout, redirects followed — a link that
  301/302s to a healthy page is considered fine.
* A link is reported when the final response is **not 2xx**, or the request
  **times out / fails to connect**.
* If the server answers a HEAD with **405 Method Not Allowed**, the URL is
  retried once with a lightweight streaming GET. Many CDNs disallow HEAD but
  serve GET correctly; reporting them would be a false positive.
* Requests are **rate-limited to one per second** to stay polite to hosts.
* Each unique URL is checked **once**, even if it appears in many files, so
  the report stays small and no host is hammered.
* Set the ``SKIP_EXTERNAL_LINKS`` environment variable to skip the check
  entirely (offline / CI mode). ``run()`` then returns an empty list.

Returns a list of ``{file, line, url, status}`` dicts (``file``/``line`` is
the first place each broken URL was seen).
"""

from __future__ import annotations

import os
import re
import time

import requests

# Markdown inline link whose destination is an absolute http(s) URL.
_URL_RE = re.compile(r"\[[^\]]*\]\(\s*(https?://[^)\s]+?)\s*\)")

_TIMEOUT = 10  # seconds, per the requirements
_RATE_LIMIT_SECONDS = 1.0  # at most one request per second
_HEADERS = {"User-Agent": "openkruise-doc-agent-linkcheck"}

SKIP_ENV_VAR = "SKIP_EXTERNAL_LINKS"


def _iter_md_files(docs_dir: str):
    """Yield absolute paths of every ``.md`` file under ``docs_dir``."""
    for root, _dirs, files in os.walk(docs_dir):
        for name in sorted(files):
            if name.endswith(".md"):
                yield os.path.join(root, name)


def _collect_links(docs_dir: str) -> dict[str, tuple[str, int]]:
    """Map each unique external URL to the first (file, line) it appears at."""
    seen: dict[str, tuple[str, int]] = {}
    for md_file in _iter_md_files(docs_dir):
        try:
            with open(md_file, encoding="utf-8") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        for lineno, line in enumerate(lines, start=1):
            for match in _URL_RE.finditer(line):
                url = match.group(1)
                seen.setdefault(url, (md_file, lineno))
    return seen


def _check(url: str) -> tuple[bool, str]:
    """Return (ok, status) for a single URL."""
    try:
        resp = requests.head(
            url, allow_redirects=True, timeout=_TIMEOUT, headers=_HEADERS
        )
        # Some servers reject HEAD outright — retry once with GET.
        if resp.status_code in (403, 405):
            resp = requests.get(
                url, allow_redirects=True, timeout=_TIMEOUT,
                headers=_HEADERS, stream=True,
            )
            resp.close()
        ok = 200 <= resp.status_code < 300
        return ok, str(resp.status_code)
    except requests.Timeout:
        return False, "timeout"
    except requests.RequestException as exc:
        return False, f"error: {type(exc).__name__}"


def run(docs_dir: str) -> list[dict]:
    """Scan ``docs_dir`` and return unreachable external links.

    Honours ``SKIP_EXTERNAL_LINKS``: when set, returns ``[]`` without making
    any network request.
    """
    if os.environ.get(SKIP_ENV_VAR):
        return []

    links = _collect_links(docs_dir)
    findings: list[dict] = []

    for index, (url, (md_file, lineno)) in enumerate(sorted(links.items())):
        if index > 0:  # rate-limit: one request per second (none before the first)
            time.sleep(_RATE_LIMIT_SECONDS)

        ok, status = _check(url)
        if not ok:
            findings.append({
                "file": md_file,
                "line": lineno,
                "url": url,
                "status": status,
            })

    return findings


if __name__ == "__main__":
    import json
    import sys

    target = sys.argv[1] if len(sys.argv) > 1 else "docs"
    print(json.dumps(run(target), indent=2))

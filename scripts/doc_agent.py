#!/usr/bin/env python3
"""
OpenKruise Document Agent
=========================

An intelligent documentation agent for the OpenKruise website.

What it does
------------
1. Fetches the latest releases / changelogs for the OpenKruise sub-projects
   directly from the public GitHub Releases API (no auth token required).
2. Extracts the latest release tag, release date and changelog body.
3. Evaluates documentation freshness (a release older than STALE_AFTER_DAYS
   days is flagged as STALE).
4. Auto-generates a Docusaurus-compatible blog post for each sub-project.
5. Writes a consolidated freshness report.
6. Evaluates the existing `docs/` folder (broken links, stale pages,
   TODO/FIXME markers) and writes a documentation evaluation report.

Full pipeline: fetch releases -> generate blogs -> evaluate docs ->
write all reports.

Dependencies: Python standard library + `requests`.

Run:
    python scripts/doc_agent.py
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import sys
from datetime import datetime, timezone

import requests

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

# Sub-projects we track. `key` is used for filenames/tags, `name` for display.
SUB_PROJECTS = [
    {"key": "kruise",             "name": "Kruise",             "repo": "openkruise/kruise"},
    {"key": "rollouts",           "name": "Rollouts",           "repo": "openkruise/rollouts"},
    {"key": "kruise-game",        "name": "Kruise-Game",        "repo": "openkruise/kruise-game"},
    {"key": "kruise-rollout-api", "name": "Kruise-Rollout-API", "repo": "openkruise/kruise-rollout-api"},
]

GITHUB_API = "https://api.github.com/repos/{repo}/releases"

# A release whose publish date is older than this many days is considered stale.
STALE_AFTER_DAYS = 30

# Output locations.
OUTPUT_ROOT = "agent-output"
BLOG_DIR = os.path.join(OUTPUT_ROOT, "blogs")
FRESHNESS_REPORT = os.path.join(OUTPUT_ROOT, "freshness-report.md")
EVAL_REPORT = os.path.join(OUTPUT_ROOT, "docs-evaluation-report.md")

# Documentation evaluation. Paths are anchored to this script's location so
# the docs scan works no matter what the current working directory is.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(_SCRIPT_DIR)
DOCS_DIR = os.path.join(REPO_ROOT, "docs")
EVALUATE_PY = os.path.join(_SCRIPT_DIR, "doc_agent", "evaluate.py")

# Network behaviour.
REQUEST_TIMEOUT = 30  # seconds
REQUEST_HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "openkruise-doc-agent",
}


# --------------------------------------------------------------------------- #
# GitHub fetching
# --------------------------------------------------------------------------- #

def fetch_latest_release(repo: str) -> dict | None:
    """Fetch the most recent published, non-draft release for a repo.

    Returns a normalized dict, or None if the repo has no usable release.
    Network / API failures are caught and reported so a single bad repo
    does not abort the whole run.
    """
    url = GITHUB_API.format(repo=repo)
    try:
        resp = requests.get(url, headers=REQUEST_HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        releases = resp.json()
    except requests.RequestException as exc:
        print(f"  ! Failed to fetch releases for {repo}: {exc}", file=sys.stderr)
        return None
    except json.JSONDecodeError as exc:
        print(f"  ! Invalid JSON from GitHub for {repo}: {exc}", file=sys.stderr)
        return None

    if not isinstance(releases, list) or not releases:
        print(f"  ! No releases found for {repo}", file=sys.stderr)
        return None

    # Skip drafts; published_at is null for drafts anyway. Pick the newest by
    # published_at so we are not relying solely on API ordering.
    published = [r for r in releases if not r.get("draft") and r.get("published_at")]
    if not published:
        print(f"  ! No published releases for {repo}", file=sys.stderr)
        return None

    latest = max(published, key=lambda r: r["published_at"])

    return {
        "tag": latest.get("tag_name", "unknown"),
        "name": latest.get("name") or latest.get("tag_name", "unknown"),
        "published_at": latest["published_at"],
        "body": latest.get("body") or "",
        "html_url": latest.get("html_url", f"https://github.com/{repo}/releases"),
    }


# --------------------------------------------------------------------------- #
# Freshness evaluation
# --------------------------------------------------------------------------- #

def parse_iso8601(value: str) -> datetime:
    """Parse a GitHub ISO-8601 timestamp (e.g. 2024-01-01T12:00:00Z)."""
    # Python's fromisoformat handles the trailing 'Z' from 3.11+, but we
    # normalize it explicitly for safety on older interpreters.
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def evaluate_freshness(published_at: str, now: datetime) -> tuple[int, str]:
    """Return (days_since_release, status) where status is FRESH or STALE."""
    released = parse_iso8601(published_at)
    days_since = (now - released).days
    status = "STALE" if days_since > STALE_AFTER_DAYS else "FRESH"
    return days_since, status


# --------------------------------------------------------------------------- #
# Changelog parsing
# --------------------------------------------------------------------------- #

def extract_highlights(body: str, limit: int = 5) -> list[str]:
    """Extract the top `limit` bullet points from a release body.

    Release notes vary a lot in format, so we look for markdown list items
    (`-`, `*`, `+`) and clean them up: strip markdown links to plain text,
    drop bold/inline-code markers, and skip empty or noise lines.
    """
    highlights: list[str] = []

    for raw_line in body.splitlines():
        line = raw_line.strip()
        match = re.match(r"^[-*+]\s+(.*)", line)
        if not match:
            continue

        text = match.group(1).strip()

        # Convert markdown links [text](url) -> text
        text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
        # Drop bold/italic/inline-code markers.
        text = re.sub(r"[`*_]+", "", text)
        # Collapse internal whitespace.
        text = re.sub(r"\s+", " ", text).strip()

        # Skip empties and pure-noise lines (e.g. "..." or bare links).
        if not text or len(text) < 3:
            continue

        highlights.append(text)
        if len(highlights) >= limit:
            break

    return highlights


def extract_prose_summary(body: str, max_sentences: int = 3) -> str:
    """Fallback when a release body has no bullet points.

    Some releases (e.g. point releases that just link to a CHANGELOG) carry
    only prose. We take the first meaningful paragraph, drop markdown
    headings / changelog footers / bare links, flatten links to plain text,
    and keep at most `max_sentences` sentences.
    """
    paragraph: list[str] = []

    for raw_line in body.splitlines():
        line = raw_line.strip()

        # Skip blanks once we've started collecting -> end of first paragraph.
        if not line:
            if paragraph:
                break
            continue
        # Skip markdown headings and the GitHub auto-generated changelog footer.
        if line.startswith("#") or line.lower().startswith("**full changelog"):
            continue

        paragraph.append(line)

    text = " ".join(paragraph)
    # Flatten markdown links [text](url) -> text, then strip emphasis markers.
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[`*_]+", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    if not text:
        return ""

    # Keep at most `max_sentences` sentences.
    sentences = re.split(r"(?<=[.!?])\s+", text)
    return " ".join(sentences[:max_sentences]).strip()


# --------------------------------------------------------------------------- #
# Output generation
# --------------------------------------------------------------------------- #

def generate_blog_post(project: dict, release: dict, now: datetime) -> str:
    """Build a Docusaurus-compatible blog post for one sub-project release."""
    release_date = parse_iso8601(release["published_at"]).date().isoformat()
    version = release["tag"]
    title = f'OpenKruise {project["name"]} {version} Released'

    highlights = extract_highlights(release["body"], limit=5)
    if highlights:
        highlights_md = "\n".join(f"- {h}" for h in highlights)
    else:
        # No bullet points in the release body — fall back to a prose summary.
        prose = extract_prose_summary(release["body"])
        highlights_md = prose or "_See the linked release notes for full details._"

    # Built line-by-line (not via textwrap.dedent) because dedent fails to
    # find a common indent once multi-line highlights inject a zero-indent
    # line, which would leave the YAML front matter indented and unparseable.
    return "\n".join(
        [
            "---",
            f'title: "{title}"',
            f"date: {release_date}",
            "author: OpenKruise Community",
            f'tags: [{project["key"]}, release]',
            "---",
            "",
            f"## What's New in {version}",
            "",
            highlights_md,
            "",
            f'For the full changelog, see the [release notes]({release["html_url"]}).',
            "",
        ]
    )


def write_blog_posts(results: list[dict], now: datetime) -> list[str]:
    """Write one blog post per sub-project. Returns list of written paths."""
    os.makedirs(BLOG_DIR, exist_ok=True)
    written = []

    for item in results:
        if not item["release"]:
            continue
        project, release = item["project"], item["release"]
        release_date = parse_iso8601(release["published_at"]).date().isoformat()

        # Docusaurus blog convention: YYYY-MM-DD-slug.md
        filename = f'{release_date}-{project["key"]}-{release["tag"]}.md'
        path = os.path.join(BLOG_DIR, filename)

        with open(path, "w", encoding="utf-8") as fh:
            fh.write(generate_blog_post(project, release, now))

        written.append(path)
        print(f"  + Blog post written: {path}")

    return written


def write_freshness_report(results: list[dict], now: datetime) -> str:
    """Write the consolidated freshness report markdown table."""
    os.makedirs(OUTPUT_ROOT, exist_ok=True)

    lines = [
        "# OpenKruise Documentation Freshness Report",
        "",
        f"_Generated on {now.strftime('%Y-%m-%d %H:%M UTC')} "
        f"by the OpenKruise Document Agent._",
        "",
        f"A release is flagged **STALE** when its publish date is more than "
        f"{STALE_AFTER_DAYS} days old.",
        "",
        "| Sub-Project | Latest Version | Release Date | Days Since Release | Status |",
        "| ----------- | -------------- | ------------ | ------------------ | ------ |",
    ]

    for item in results:
        project = item["project"]
        release = item["release"]
        if not release:
            lines.append(
                f'| {project["name"]} | _n/a_ | _n/a_ | _n/a_ | ⚠️ UNKNOWN |'
            )
            continue

        days_since, status = evaluate_freshness(release["published_at"], now)
        release_date = parse_iso8601(release["published_at"]).date().isoformat()
        badge = "🟢 FRESH" if status == "FRESH" else "🔴 STALE"
        lines.append(
            f'| {project["name"]} | {release["tag"]} | {release_date} '
            f"| {days_since} | {badge} |"
        )

    lines.append("")
    content = "\n".join(lines)

    with open(FRESHNESS_REPORT, "w", encoding="utf-8") as fh:
        fh.write(content)

    print(f"  + Freshness report written: {FRESHNESS_REPORT}")
    return content


# --------------------------------------------------------------------------- #
# Documentation evaluation
# --------------------------------------------------------------------------- #

def run_docs_evaluation() -> dict | None:
    """Run the docs evaluation module against this repo's `docs/` folder.

    `evaluate.py` lives in the `scripts/doc_agent/` package directory, which
    shares a base name with this file (`scripts/doc_agent.py`). To avoid that
    import ambiguity entirely, we load it directly by file path rather than
    via `import doc_agent.evaluate`.
    """
    if not os.path.isfile(EVALUATE_PY):
        print(f"  ! Evaluation module not found: {EVALUATE_PY}",
              file=sys.stderr)
        return None
    if not os.path.isdir(DOCS_DIR):
        print(f"  ! docs/ directory not found: {DOCS_DIR}", file=sys.stderr)
        return None

    spec = importlib.util.spec_from_file_location("doc_agent_evaluate",
                                                  EVALUATE_PY)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    results = module.run_evaluation(DOCS_DIR, EVAL_REPORT)
    print(f"  + Docs evaluation written: {EVAL_REPORT}")
    print(
        f"    broken links: {len(results['broken_links'])}  |  "
        f"stale docs: {len(results['staleness'])}  |  "
        f"TODO/FIXME/XXX: {len(results['todos'])}"
    )
    return results


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #

def main() -> int:
    now = datetime.now(timezone.utc)
    print(f"OpenKruise Document Agent — run at {now.isoformat()}\n")

    results = []
    print("Fetching releases from GitHub ...")
    for project in SUB_PROJECTS:
        print(f"  - {project['repo']}")
        release = fetch_latest_release(project["repo"])
        results.append({"project": project, "release": release})

    print("\nGenerating outputs ...")
    write_blog_posts(results, now)
    report = write_freshness_report(results, now)

    print("\nEvaluating existing documentation ...")
    run_docs_evaluation()

    print("\n" + "=" * 60)
    print(report)

    # Exit non-zero if any sub-project could not be fetched, so CI surfaces it.
    failed = [r["project"]["name"] for r in results if not r["release"]]
    if failed:
        print(f"\nWARNING: could not fetch releases for: {', '.join(failed)}",
              file=sys.stderr)
        return 1

    print("\nDone. All sub-projects processed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

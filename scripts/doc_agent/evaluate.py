#!/usr/bin/env python3
"""Documentation evaluation aggregator.

Runs every checker in ``scripts/doc_agent/checkers/`` against a docs folder
and writes a single consolidated Markdown report.

Can be used two ways:

* **Standalone** ::

      python scripts/doc_agent/evaluate.py [docs_dir] [output_path]

* **Imported** by ``scripts/doc_agent.py`` as the final agent step::

      run_evaluation(docs_dir, output_path) -> dict
"""

from __future__ import annotations

import os
import sys
from datetime import datetime, timezone

# Make the sibling ``checkers`` package importable regardless of the current
# working directory or how this file is loaded (CLI or importlib-by-path).
_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from checkers import broken_links, staleness, todo_scan  # noqa: E402

# Repo root = .../scripts/doc_agent/evaluate.py -> up three levels.
_REPO_ROOT = os.path.dirname(os.path.dirname(_HERE))

DEFAULT_DOCS_DIR = os.path.join(_REPO_ROOT, "docs")
DEFAULT_OUTPUT = os.path.join(
    _REPO_ROOT, "agent-output", "docs-evaluation-report.md"
)


def _count_md_files(docs_dir: str) -> int:
    total = 0
    for _root, _dirs, files in os.walk(docs_dir):
        total += sum(1 for n in files if n.endswith(".md"))
    return total


def _rel(path: str, base: str) -> str:
    """Display path relative to ``base`` (falls back to the raw path)."""
    try:
        return os.path.relpath(path, base)
    except ValueError:
        return path


def _cell(text: str) -> str:
    """Escape a value so it is safe inside a Markdown table cell."""
    return str(text).replace("|", "\\|").replace("\n", " ").strip()


def _table(headers: list[str], rows: list[list[str]]) -> list[str]:
    out = ["| " + " | ".join(headers) + " |",
           "| " + " | ".join("---" for _ in headers) + " |"]
    out += ["| " + " | ".join(_cell(c) for c in row) + " |" for row in rows]
    return out


def _build_report(docs_dir: str, results: dict, now: datetime) -> str:
    base = os.path.dirname(os.path.abspath(docs_dir.rstrip("/")))
    n_files = _count_md_files(docs_dir)

    links = results["broken_links"]
    stale = results["staleness"]
    todos = results["todos"]

    lines: list[str] = [
        "# OpenKruise Documentation Evaluation Report",
        "",
        f"_Generated on {now.strftime('%Y-%m-%d %H:%M UTC')} "
        f"by the OpenKruise Document Agent._",
        "",
        f"**Scanned:** `{_rel(docs_dir, _REPO_ROOT)}/` — "
        f"{n_files} Markdown files",
        "",
        "## Summary",
        "",
    ]
    lines += _table(
        ["Check", "Issues"],
        [
            ["🔗 Broken links", str(len(links))],
            ["🕒 Stale docs (> 180 days)", str(len(stale))],
            ["📝 TODO / FIXME / XXX", str(len(todos))],
        ],
    )

    # --- Broken links ----------------------------------------------------- #
    lines += ["", f"## 🔗 Broken Links ({len(links)})", ""]
    if links:
        lines += _table(
            ["File", "Line", "Link Text", "Issue"],
            [
                [_rel(i["file"], base), i["line"],
                 i["link_text"] or "_(empty)_", i["issue_type"]]
                for i in links
            ],
        )
    else:
        lines.append("✅ No broken links found.")

    # --- Stale docs ------------------------------------------------------- #
    lines += ["", f"## 🕒 Stale Documentation ({len(stale)})", "",
              "_Files whose last git commit is more than "
              f"{staleness.STALE_AFTER_DAYS} days old._", ""]
    if stale:
        lines += _table(
            ["File", "Last Modified", "Days Since"],
            [
                [_rel(i["file"], base), i["last_modified"], i["days_since"]]
                for i in sorted(stale, key=lambda x: -x["days_since"])
            ],
        )
    else:
        lines.append("✅ No stale documentation found.")

    # --- TODO / FIXME / XXX ---------------------------------------------- #
    lines += ["", f"## 📝 TODO / FIXME / XXX Markers ({len(todos)})", ""]
    if todos:
        lines += _table(
            ["File", "Line", "Marker", "Context"],
            [
                [_rel(i["file"], base), i["line"], i["marker"], i["context"]]
                for i in todos
            ],
        )
    else:
        lines.append("✅ No TODO/FIXME/XXX markers found.")

    lines.append("")
    return "\n".join(lines)


def run_evaluation(docs_dir: str, output_path: str) -> dict:
    """Run all checkers, write the report, and return the aggregated results."""
    now = datetime.now(timezone.utc)

    results = {
        "broken_links": broken_links.run(docs_dir),
        "staleness": staleness.run(docs_dir),
        "todos": todo_scan.run(docs_dir),
    }

    report = _build_report(docs_dir, results, now)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        fh.write(report)

    results["report"] = report
    results["output_path"] = output_path
    return results


def main() -> int:
    docs_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_DOCS_DIR
    output_path = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT

    if not os.path.isdir(docs_dir):
        print(f"ERROR: docs directory not found: {docs_dir}", file=sys.stderr)
        return 1

    results = run_evaluation(docs_dir, output_path)
    print(f"Evaluation report written: {output_path}")
    print(
        f"  broken links: {len(results['broken_links'])}  |  "
        f"stale docs: {len(results['staleness'])}  |  "
        f"TODO/FIXME/XXX: {len(results['todos'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

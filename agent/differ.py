import json
from difflib import HtmlDiff, unified_diff
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _suggestion_lines(scorecard: dict[str, Any]) -> list[str]:
    lines = ["Doc Agent Suggestions", "Source: scorecard.json", "", "High Priority"]

    files = scorecard.get("files", {})
    high = []
    medium = []
    for path, info in files.items():
        if info.get("priority") == "high":
            high.append((path, info))
        elif info.get("priority") == "medium":
            medium.append((path, info))

    for path, info in sorted(high, key=lambda item: item[0]):
        reason = "; ".join(info.get("evidence", [])) or "review"
        lines.append(f"- {path} - {reason}. Suggestion: repair links, assets, or frontmatter.")

    lines.append("")
    lines.append("Medium Priority")

    for path, info in sorted(medium, key=lambda item: item[0]):
        reason = "; ".join(info.get("evidence", [])) or "review"
        lines.append(f"- {path} - {reason}. Suggestion: review and update content.")

    return lines


def _atomic_write_text(path: Path, content: str) -> None:
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(content, encoding="utf-8")
    temp_path.replace(path)


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
    temp_path.replace(path)


def generate_patch(scorecard: dict[str, Any], output_path: Path) -> str:
    """Generate a unified diff patch with remediation suggestions."""
    new_lines = [line + "\n" for line in _suggestion_lines(scorecard)]
    diff = unified_diff([], new_lines, fromfile="a/doc-agent-suggestions.txt", tofile="b/doc-agent-suggestions.txt")
    diff_text = "".join(diff)
    if not diff_text.startswith("--- a/"):
        raise ValueError("invalid patch format")
    _atomic_write_text(output_path, diff_text)

    files = scorecard.get("files", {})
    counts = {"high": 0, "medium": 0, "low": 0}
    for info in files.values():
        priority = info.get("priority")
        if priority in counts:
            counts[priority] += 1

    meta_path = output_path.with_suffix(output_path.suffix + ".meta.json")
    meta = {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_files": len(files),
        "high_priority": counts["high"],
        "medium_priority": counts["medium"],
        "low_priority": counts["low"],
    }
    _atomic_write_json(meta_path, meta)
    return diff_text


def generate_html_preview(scorecard: dict[str, Any], output_path: Path) -> str:
    """Generate an HTML diff preview for the suggestions."""
    lines = _suggestion_lines(scorecard)
    html = HtmlDiff().make_file([], lines, fromdesc="before", todesc="after", context=True)
    css = "<style>body{font-family:Arial,Helvetica,sans-serif}table.diff{width:100%}td,th{padding:4px}</style>"
    html = html.replace("</head>", f"{css}</head>")
    _atomic_write_text(output_path, html)
    return html

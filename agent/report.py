import json
from pathlib import Path
from typing import Any


def _evidence_summary(evidence: list[str]) -> str:
    if not evidence:
        return "No issues detected"
    return "; ".join(evidence)


def _table_rows(items: list[tuple[str, Any]]) -> list[str]:
    rows = ["| File | Priority | Score | Evidence |", "| --- | --- | --- | --- |"]
    for path, info in items:
        evidence = _evidence_summary(info.get("evidence", []))
        rows.append(f"| {path} | {info.get('priority')} | {info.get('score')} | {evidence} |")
    return rows


def _atomic_write_text(path: Path, content: str) -> None:
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(content, encoding="utf-8")
    temp_path.replace(path)


def generate_report(scorecard_path: Path, output_dir: Path) -> Path:
    """Generate summary.md and report.json from a scorecard."""
    scorecard = json.loads(scorecard_path.read_text(encoding="utf-8"))
    output_dir.mkdir(parents=True, exist_ok=True)

    files: dict[str, Any] = scorecard.get("files", {})
    high = []
    medium = []
    low = []
    for path, info in files.items():
        if info.get("priority") == "high":
            high.append((path, info))
        elif info.get("priority") == "medium":
            medium.append((path, info))
        else:
            low.append((path, info))

    summary = scorecard.get("summary", {})

    lines = [
        "Doc Agent Report",
        "",
        "[INFO] Summary",
        f"Schema version: {scorecard.get('schema_version', 1)}",
        f"Generated at: {scorecard.get('generated_at', '')}",
        f"Total files: {summary.get('total_files', len(files))}",
        f"High priority: {summary.get('high_priority', len(high))}",
        f"Medium priority: {summary.get('medium_priority', len(medium))}",
        f"Low priority: {summary.get('low_priority', len(low))}",
        "",
        "[WARN] High Priority",
    ]
    lines.extend(_table_rows(sorted(high, key=lambda item: item[0])))

    lines.append("")
    lines.append("[WARN] Medium Priority")
    lines.extend(_table_rows(sorted(medium, key=lambda item: item[0])))

    lines.append("")
    lines.append("[OK] Low Priority")
    lines.extend(_table_rows(sorted(low, key=lambda item: item[0])))

    summary_path = output_dir / "summary.md"
    _atomic_write_text(summary_path, "\n".join(lines) + "\n")

    report_path = output_dir / "report.json"
    _atomic_write_text(report_path, json.dumps(scorecard, indent=2, sort_keys=True))

    return report_path

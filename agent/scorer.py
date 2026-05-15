import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_CONFIG = {
    "weights": {
        "missing_files": 3,
        "missing_images": 3,
        "missing_anchors": 2,
        "missing_frontmatter": 2,
        "stale": 1,
    },
    "priority_thresholds": {"high": 4, "medium": 7},
}


def _load_config(input_dir: Path) -> dict[str, Any]:
    config_path = input_dir / "scorer_config.json"
    if not config_path.exists():
        return DEFAULT_CONFIG
    try:
        data = json.loads(config_path.read_text(encoding="utf-8"))
        return {
            "weights": {**DEFAULT_CONFIG["weights"], **data.get("weights", {})},
            "priority_thresholds": {
                **DEFAULT_CONFIG["priority_thresholds"],
                **data.get("priority_thresholds", {}),
            },
        }
    except json.JSONDecodeError:
        return DEFAULT_CONFIG


def _load_evaluations(eval_dir: Path) -> list[dict[str, Any]]:
    """Load evaluation JSON files from the evaluations directory."""
    if not eval_dir.exists():
        return []
    evaluations = []
    for path in sorted(eval_dir.glob("*.json")):
        try:
            evaluations.append(json.loads(path.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            continue
    return evaluations


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
    temp_path.replace(path)


def _score_evaluation(evaluation: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    """Score a single evaluation record deterministically."""
    linkcheck = evaluation.get("linkcheck", {})
    frontmatter = evaluation.get("frontmatter", {})
    age_days = evaluation.get("age_days")

    missing_files = len(linkcheck.get("missing_files", []))
    missing_images = len(linkcheck.get("missing_images", []))
    missing_anchors = len(linkcheck.get("missing_anchors", []))
    missing_frontmatter = len(frontmatter.get("missing", []))

    severe_count = missing_files + missing_images + missing_anchors
    medium_count = missing_frontmatter
    stale = age_days is not None and age_days > 90

    weights = config["weights"]
    penalty = (
        missing_files * weights["missing_files"]
        + missing_images * weights["missing_images"]
        + missing_anchors * weights["missing_anchors"]
        + missing_frontmatter * weights["missing_frontmatter"]
        + (weights["stale"] if stale else 0)
    )

    score = max(0, 10 - penalty)

    evidence = []
    if missing_files:
        evidence.append(f"Missing markdown targets ({missing_files})")
    if missing_images:
        evidence.append(f"Missing image assets ({missing_images})")
    if missing_anchors:
        evidence.append(f"Missing anchors ({missing_anchors})")
    if missing_frontmatter:
        evidence.append(f"Missing frontmatter keys ({missing_frontmatter})")
    if stale:
        evidence.append(f"Stale content ({age_days} days)")

    thresholds = config["priority_thresholds"]
    if score <= thresholds["high"] or severe_count > 0:
        priority = "high"
    elif score <= thresholds["medium"] or medium_count > 0 or stale:
        priority = "medium"
    else:
        priority = "low"

    return {
        "score": score,
        "priority": priority,
        "evidence": evidence,
        "subscores": {
            "missing_files": missing_files,
            "missing_images": missing_images,
            "missing_anchors": missing_anchors,
            "missing_frontmatter": missing_frontmatter,
            "stale": stale,
            "penalty": penalty,
        },
    }


def score_evaluations(input_dir: Path, output_path: Path) -> dict[str, Any]:
    """Score evaluation artifacts and write scorecard.json."""
    eval_dir = input_dir / "evaluations"
    evaluations = _load_evaluations(eval_dir)
    config = _load_config(input_dir)

    files = {}
    high_priority = 0
    medium_priority = 0
    low_priority = 0

    for evaluation in sorted(evaluations, key=lambda e: e.get("path", "")):
        path = evaluation.get("path")
        if not path:
            continue
        score_entry = _score_evaluation(evaluation, config)
        files[path] = score_entry
        if score_entry["priority"] == "high":
            high_priority += 1
        elif score_entry["priority"] == "medium":
            medium_priority += 1
        else:
            low_priority += 1

    scorecard = {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "files": files,
        "summary": {
            "total_files": len(files),
            "high_priority": high_priority,
            "medium_priority": medium_priority,
            "low_priority": low_priority,
        },
    }

    _atomic_write_json(output_path, scorecard)
    return scorecard

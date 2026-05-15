import json
from pathlib import Path

from agent.scorer import score_evaluations


def test_scorer_deterministic_scores(tmp_path: Path):
    eval_dir = tmp_path / "artifacts" / "evaluations"
    eval_dir.mkdir(parents=True, exist_ok=True)

    eval_a = {
        "path": "docs/a.md",
        "linkcheck": {"missing_files": ["docs/missing.md"], "missing_images": [], "missing_anchors": []},
        "frontmatter": {"missing": ["title"], "warnings": [], "valid": False},
        "age_days": 120,
    }
    eval_b = {
        "path": "docs/b.md",
        "linkcheck": {"missing_files": [], "missing_images": [], "missing_anchors": []},
        "frontmatter": {"missing": [], "warnings": [], "valid": True},
        "age_days": 1,
    }

    (eval_dir / "a.json").write_text(json.dumps(eval_a))
    (eval_dir / "b.json").write_text(json.dumps(eval_b))

    output_path = tmp_path / "artifacts" / "scorecard.json"
    scorecard = score_evaluations(tmp_path / "artifacts", output_path)

    assert scorecard["files"]["docs/a.md"]["score"] == 4
    assert scorecard["files"]["docs/a.md"]["priority"] == "high"
    assert scorecard["files"]["docs/b.md"]["score"] == 10
    assert scorecard["files"]["docs/b.md"]["priority"] == "low"
    assert scorecard["schema_version"] == 1
    assert scorecard["summary"]["total_files"] == 2
    assert scorecard["summary"]["high_priority"] == 1
    assert scorecard["summary"]["medium_priority"] == 0
    assert scorecard["summary"]["low_priority"] == 1

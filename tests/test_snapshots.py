import json
from pathlib import Path

from agent.differ import generate_patch
from agent.report import generate_report
from agent.scorer import score_evaluations


def test_scorecard_snapshot(tmp_path: Path):
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

    (eval_dir / "a.json").write_text(json.dumps(eval_a), encoding="utf-8")
    (eval_dir / "b.json").write_text(json.dumps(eval_b), encoding="utf-8")

    output_path = tmp_path / "artifacts" / "scorecard.json"
    scorecard = score_evaluations(tmp_path / "artifacts", output_path)

    expected = json.loads(
        (Path(__file__).parent / "fixtures" / "snapshots" / "scorecard.json").read_text(encoding="utf-8")
    )
    scorecard["generated_at"] = expected["generated_at"]
    scorecard["schema_version"] = expected["schema_version"]
    assert scorecard == expected


def test_report_and_patch_snapshots(tmp_path: Path):
    scorecard_path = Path(__file__).parent / "fixtures" / "snapshots" / "scorecard.json"
    scorecard = json.loads(scorecard_path.read_text(encoding="utf-8"))

    artifacts_dir = tmp_path / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    report_path = generate_report(scorecard_path, artifacts_dir)

    patch_path = tmp_path / "suggestions.patch"
    generate_patch(scorecard, patch_path)

    expected_summary = (Path(__file__).parent / "fixtures" / "snapshots" / "summary.md").read_text(
        encoding="utf-8"
    )
    expected_patch = (Path(__file__).parent / "fixtures" / "snapshots" / "suggestions.patch").read_text(
        encoding="utf-8"
    )

    assert report_path.exists()
    assert patch_path.read_text(encoding="utf-8") == expected_patch
    assert (artifacts_dir / "summary.md").read_text(encoding="utf-8") == expected_summary

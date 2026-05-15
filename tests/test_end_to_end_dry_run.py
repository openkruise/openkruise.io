import os
import subprocess
from pathlib import Path

from click.testing import CliRunner

from agent.cli import cli


def _init_git(repo_root: Path):
    env = os.environ.copy()
    env.update(
        {
            "GIT_AUTHOR_NAME": "Test",
            "GIT_AUTHOR_EMAIL": "test@example.com",
            "GIT_COMMITTER_NAME": "Test",
            "GIT_COMMITTER_EMAIL": "test@example.com",
        }
    )
    subprocess.run(["git", "init"], cwd=repo_root, check=True, env=env)
    subprocess.run(["git", "add", "."], cwd=repo_root, check=True, env=env)
    subprocess.run(["git", "commit", "-m", "init"], cwd=repo_root, check=True, env=env)


def test_end_to_end_dry_run(tmp_path: Path):
    repo_root = tmp_path
    docs = repo_root / "docs"
    docs.mkdir(parents=True, exist_ok=True)

    content = (
        "---\n"
        "title: A\n"
        "sidebar_position: 1\n"
        "slug: /a\n"
        "---\n\n"
        "# Top\n"
        "See [Missing](missing.md).\n"
        "![](img/missing.png)\n"
    )
    (docs / "a.md").write_text(content)

    _init_git(repo_root)

    runner = CliRunner()
    artifacts = repo_root / "artifacts"
    staging = repo_root / "staging"
    reports = repo_root / "reports"

    result_collect = runner.invoke(
        cli, ["collect", "--repo-root", str(repo_root), "--output", str(repo_root / "inventory.json")]
    )
    assert result_collect.exit_code == 0

    result_eval = runner.invoke(cli, ["evaluate", "--repo-root", str(repo_root), "--output-dir", str(artifacts)])
    assert result_eval.exit_code == 0

    result_score = runner.invoke(cli, ["score", "--input-dir", str(artifacts), "--output", "scorecard.json"])
    assert result_score.exit_code == 0

    result_stage = runner.invoke(cli, ["stage", "--input-dir", str(artifacts), "--output-dir", str(staging)])
    assert result_stage.exit_code == 0

    result_report = runner.invoke(cli, ["report", "--input-dir", str(artifacts), "--output-dir", str(reports)])
    assert result_report.exit_code == 0

    assert (artifacts / "scorecard.json").exists()
    assert (staging / "suggestions.patch").exists()
    assert (staging / "suggestions.preview.html").exists()
    assert (staging / "suggestions.patch.meta.json").exists()
    assert (reports / "summary.md").exists()
    assert (reports / "report.json").exists()

    scorecard = (artifacts / "scorecard.json").read_text()
    assert "files" in scorecard
    summary = (reports / "summary.md").read_text()
    assert "Doc Agent Report" in summary
    assert "[INFO] Summary" in summary
    assert "Schema version: 1" in summary
    assert "| File | Priority | Score | Evidence |" in summary

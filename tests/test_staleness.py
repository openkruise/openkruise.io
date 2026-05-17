"""Tests for the staleness checker.

Git is never actually invoked: ``subprocess.run`` is mocked so the tests are
deterministic and fast, and so they work even outside a git checkout.
"""

import types
from datetime import datetime, timedelta, timezone
from subprocess import CalledProcessError
from unittest import mock

from checkers import staleness


def _completed(stdout):
    """Stand-in for the subprocess.CompletedProcess the real calls return."""
    return types.SimpleNamespace(stdout=stdout, stderr="", returncode=0)


def _iso(days_ago):
    dt = datetime.now(timezone.utc) - timedelta(days=days_ago)
    return dt.isoformat()


def _git_mock(repo_root, dates_by_suffix):
    """Build a subprocess.run side-effect.

    ``git rev-parse`` -> repo root; ``git log`` -> the ISO date chosen by
    matching the trailing file path against ``dates_by_suffix``.
    """
    def fake_run(cmd, *args, **kwargs):
        if "rev-parse" in cmd:
            return _completed(repo_root + "\n")
        target = cmd[-1]  # the file path after "--"
        for suffix, iso in dates_by_suffix.items():
            if target.endswith(suffix):
                return _completed((iso + "\n") if iso else "")
        return _completed("")
    return fake_run


def test_stale_file_flagged_fresh_file_ignored(tmp_path):
    (tmp_path / "fresh.md").write_text("x", encoding="utf-8")
    (tmp_path / "stale.md").write_text("y", encoding="utf-8")

    side_effect = _git_mock(
        str(tmp_path),
        {"fresh.md": _iso(10), "stale.md": _iso(400)},
    )
    with mock.patch.object(staleness.subprocess, "run", side_effect=side_effect):
        result = staleness.run(str(tmp_path))

    files = [r["file"] for r in result]
    assert any(f.endswith("stale.md") for f in files)
    assert not any(f.endswith("fresh.md") for f in files)

    stale = next(r for r in result if r["file"].endswith("stale.md"))
    assert stale["days_since"] >= 399  # ~400, allow for clock skew
    # last_modified is an ISO date string (YYYY-MM-DD)
    datetime.strptime(stale["last_modified"], "%Y-%m-%d")


def test_boundary_exactly_180_days_is_not_stale(tmp_path):
    (tmp_path / "edge.md").write_text("z", encoding="utf-8")

    side_effect = _git_mock(str(tmp_path), {"edge.md": _iso(180)})
    with mock.patch.object(staleness.subprocess, "run", side_effect=side_effect):
        result = staleness.run(str(tmp_path))

    # Threshold is strictly "> 180 days", so exactly 180 is still fresh.
    assert result == []


def test_file_without_git_history_is_skipped(tmp_path):
    (tmp_path / "new.md").write_text("z", encoding="utf-8")

    side_effect = _git_mock(str(tmp_path), {"new.md": None})  # empty git log
    with mock.patch.object(staleness.subprocess, "run", side_effect=side_effect):
        assert staleness.run(str(tmp_path)) == []


def test_not_a_git_repo_returns_empty(tmp_path):
    (tmp_path / "a.md").write_text("z", encoding="utf-8")

    def boom(cmd, *args, **kwargs):
        raise CalledProcessError(128, cmd)

    with mock.patch.object(staleness.subprocess, "run", side_effect=boom):
        assert staleness.run(str(tmp_path)) == []

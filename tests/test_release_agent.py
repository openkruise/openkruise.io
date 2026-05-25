"""Tests for release_staleness, blog_generator, and scorer release_stale integration."""
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from agent.tools.release_staleness import fetch_release_staleness, _days_since, STALE_THRESHOLD_DAYS
from agent.tools.blog_generator import generate_blog_post, generate_blog_posts
from agent.scorer import score_evaluations


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_release_payload(tag: str, days_ago: int, body: str = "") -> dict:
    published = (datetime.now(timezone.utc) - timedelta(days=days_ago)).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {"tag_name": tag, "published_at": published, "body": body}


def _mock_response(payload: dict, status: int = 200) -> MagicMock:
    resp = MagicMock()
    resp.status_code = status
    resp.json.return_value = payload
    resp.raise_for_status = MagicMock()
    return resp


# ---------------------------------------------------------------------------
# release_staleness
# ---------------------------------------------------------------------------

class TestDaysSince:
    def test_recent(self):
        ts = (datetime.now(timezone.utc) - timedelta(days=5)).strftime("%Y-%m-%dT%H:%M:%SZ")
        assert _days_since(ts) == 5

    def test_zero_floor(self):
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        assert _days_since(ts) == 0


class TestFetchReleaseStaleness:
    def test_fresh_release(self):
        payload = _make_release_payload("v1.0.0", days_ago=10, body="## Changes\n- fix bug")
        repos = [{"name": "kruise", "repo": "openkruise/kruise"}]
        with patch("agent.tools.release_staleness._requests") as mock_req:
            mock_req.get.return_value = _mock_response(payload)
            results = fetch_release_staleness(repos)
        assert len(results) == 1
        r = results[0]
        assert r["tag"] == "v1.0.0"
        assert r["stale"] is False
        assert r["days_since"] == 10
        assert "fix bug" in r["changelog"]

    def test_stale_release(self):
        payload = _make_release_payload("v0.9.0", days_ago=STALE_THRESHOLD_DAYS + 1)
        repos = [{"name": "rollouts", "repo": "openkruise/rollouts"}]
        with patch("agent.tools.release_staleness._requests") as mock_req:
            mock_req.get.return_value = _mock_response(payload)
            results = fetch_release_staleness(repos)
        assert results[0]["stale"] is True

    def test_404_returns_error(self):
        repos = [{"name": "kruise-game", "repo": "openkruise/kruise-game"}]
        with patch("agent.tools.release_staleness._requests") as mock_req:
            mock_req.get.return_value = _mock_response({}, status=404)
            results = fetch_release_staleness(repos)
        assert "error" in results[0]
        assert results[0]["error"] == "no_release"

    def test_network_error_returns_error(self):
        repos = [{"name": "kruise", "repo": "openkruise/kruise"}]
        with patch("agent.tools.release_staleness._requests") as mock_req:
            mock_req.get.side_effect = Exception("timeout")
            results = fetch_release_staleness(repos)
        assert "error" in results[0]
        assert "timeout" in results[0]["error"]

    def test_multiple_repos(self):
        repos = [
            {"name": "a", "repo": "org/a"},
            {"name": "b", "repo": "org/b"},
        ]
        payloads = [
            _make_release_payload("v1.0.0", days_ago=5),
            _make_release_payload("v2.0.0", days_ago=60),
        ]
        responses = [_mock_response(p) for p in payloads]
        with patch("agent.tools.release_staleness._requests") as mock_req:
            mock_req.get.side_effect = responses
            results = fetch_release_staleness(repos)
        assert results[0]["stale"] is False
        assert results[1]["stale"] is True


# ---------------------------------------------------------------------------
# blog_generator
# ---------------------------------------------------------------------------

class TestGenerateBlogPost:
    def test_writes_file_with_frontmatter(self, tmp_path: Path):
        record = {
            "name": "kruise",
            "repo": "openkruise/kruise",
            "tag": "v1.8.3",
            "published_at": "2026-02-25T10:00:00Z",
            "changelog": "## Changes\n- fix: restrict host field",
        }
        out = generate_blog_post(record, tmp_path)
        assert out.exists()
        content = out.read_text()
        assert 'title: "OpenKruise Kruise v1.8.3 Released"' in content
        assert "date: 2026-02-25" in content
        assert "tags: [kruise, release]" in content
        assert "restrict host field" in content

    def test_prose_fallback_when_no_changelog(self, tmp_path: Path):
        record = {
            "name": "rollouts",
            "repo": "openkruise/rollouts",
            "tag": "v0.6.2",
            "published_at": "2025-12-22T00:00:00Z",
            "changelog": "",
        }
        out = generate_blog_post(record, tmp_path)
        content = out.read_text()
        assert "releases/tag/v0.6.2" in content

    def test_filename_format(self, tmp_path: Path):
        record = {
            "name": "kruise-game",
            "repo": "openkruise/kruise-game",
            "tag": "v1.0.0",
            "published_at": "2025-07-21T00:00:00Z",
            "changelog": "initial release",
        }
        out = generate_blog_post(record, tmp_path)
        assert out.name == "2025-07-21-kruise-game-1.0.0.md"

    def test_skips_error_records(self, tmp_path: Path):
        records = [
            {"name": "kruise", "repo": "openkruise/kruise", "error": "no_release"},
            {
                "name": "rollouts",
                "repo": "openkruise/rollouts",
                "tag": "v0.6.2",
                "published_at": "2025-12-22T00:00:00Z",
                "changelog": "fix",
            },
        ]
        written = generate_blog_posts(records, tmp_path)
        assert len(written) == 1
        assert written[0].name.endswith("rollouts-0.6.2.md")


# ---------------------------------------------------------------------------
# scorer — release_stale integration
# ---------------------------------------------------------------------------

class TestScorerReleaseStaleness:
    def _write_eval(self, eval_dir: Path, name: str, data: dict):
        (eval_dir / name).write_text(json.dumps(data), encoding="utf-8")

    def test_release_stale_adds_penalty(self, tmp_path: Path):
        eval_dir = tmp_path / "evaluations"
        eval_dir.mkdir(parents=True)
        self._write_eval(eval_dir, "a.json", {
            "path": "rollouts/introduction.md",
            "linkcheck": {"missing_files": [], "missing_images": [], "missing_anchors": []},
            "frontmatter": {"missing": [], "warnings": [], "valid": True},
            "age_days": 10,
            "release_stale": True,
            "release_days_since": 146,
        })
        scorecard = score_evaluations(tmp_path, tmp_path / "scorecard.json")
        entry = scorecard["files"]["rollouts/introduction.md"]
        # base 10 - release_stale weight(2) = 8
        assert entry["score"] == 8
        assert entry["priority"] == "medium"
        assert any("Upstream release" in e for e in entry["evidence"])
        assert entry["subscores"]["release_stale"] is True

    def test_no_release_stale_no_penalty(self, tmp_path: Path):
        eval_dir = tmp_path / "evaluations"
        eval_dir.mkdir(parents=True)
        self._write_eval(eval_dir, "b.json", {
            "path": "docs/introduction.md",
            "linkcheck": {"missing_files": [], "missing_images": [], "missing_anchors": []},
            "frontmatter": {"missing": [], "warnings": [], "valid": True},
            "age_days": 5,
            "release_stale": False,
        })
        scorecard = score_evaluations(tmp_path, tmp_path / "scorecard.json")
        entry = scorecard["files"]["docs/introduction.md"]
        assert entry["score"] == 10
        assert entry["priority"] == "low"
        assert entry["subscores"]["release_stale"] is False

    def test_release_stale_absent_defaults_false(self, tmp_path: Path):
        """Evaluations without release_stale key are unaffected (backward compat)."""
        eval_dir = tmp_path / "evaluations"
        eval_dir.mkdir(parents=True)
        self._write_eval(eval_dir, "c.json", {
            "path": "docs/faq.md",
            "linkcheck": {"missing_files": [], "missing_images": [], "missing_anchors": []},
            "frontmatter": {"missing": [], "warnings": [], "valid": True},
            "age_days": 20,
        })
        scorecard = score_evaluations(tmp_path, tmp_path / "scorecard.json")
        entry = scorecard["files"]["docs/faq.md"]
        assert entry["score"] == 10
        assert entry["subscores"]["release_stale"] is False

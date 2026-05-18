"""
Fetch the latest release for each tracked sub-project via the GitHub Releases API
and return a staleness record per repo.  No authentication required (uses the
public unauthenticated endpoint; 4 requests per run, well within the 60 req/hr
unauthenticated budget).
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

try:
    import requests as _requests
except ImportError:  # pragma: no cover
    _requests = None  # type: ignore[assignment]

TRACKED_REPOS: list[dict[str, str]] = [
    {"name": "kruise",            "repo": "openkruise/kruise"},
    {"name": "rollouts",          "repo": "openkruise/rollouts"},
    {"name": "kruise-game",       "repo": "openkruise/kruise-game"},
    {"name": "kruise-rollout-api","repo": "openkruise/kruise-rollout-api"},
]

STALE_THRESHOLD_DAYS = 30
_API_BASE = "https://api.github.com/repos/{repo}/releases/latest"


def _fetch_latest_release(repo: str, timeout: int = 10) -> dict[str, Any] | None:
    if _requests is None:
        raise ImportError("requests is required: pip install requests")
    url = _API_BASE.format(repo=repo)
    resp = _requests.get(url, headers={"Accept": "application/vnd.github+json"}, timeout=timeout)
    if resp.status_code == 404:
        return None
    resp.raise_for_status()
    return resp.json()


def _days_since(published_at: str) -> int:
    dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
    return max(0, (datetime.now(timezone.utc) - dt).days)


def fetch_release_staleness(repos: list[dict[str, str]] | None = None) -> list[dict[str, Any]]:
    """
    Return a list of staleness records, one per tracked sub-project.

    Each record:
        {
            "name":          str,   # short name, e.g. "kruise"
            "repo":          str,   # "owner/repo"
            "tag":           str,   # e.g. "v1.8.3"
            "published_at":  str,   # ISO-8601
            "days_since":    int,
            "stale":         bool,  # True when days_since > STALE_THRESHOLD_DAYS
            "changelog":     str,   # raw release body (may be empty)
        }
    """
    repos = repos or TRACKED_REPOS
    results: list[dict[str, Any]] = []
    for entry in repos:
        try:
            data = _fetch_latest_release(entry["repo"])
        except Exception as exc:
            results.append({
                "name": entry["name"],
                "repo": entry["repo"],
                "error": str(exc),
            })
            continue

        if data is None:
            results.append({"name": entry["name"], "repo": entry["repo"], "error": "no_release"})
            continue

        days = _days_since(data["published_at"])
        results.append({
            "name":         entry["name"],
            "repo":         entry["repo"],
            "tag":          data.get("tag_name", ""),
            "published_at": data["published_at"],
            "days_since":   days,
            "stale":        days > STALE_THRESHOLD_DAYS,
            "changelog":    (data.get("body") or "").strip(),
        })
    return results


if __name__ == "__main__":
    print(json.dumps(fetch_release_staleness(), indent=2))

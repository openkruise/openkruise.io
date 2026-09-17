"""
Staleness checker — flags documentation pages that haven't been updated
within configurable thresholds.
"""

from __future__ import annotations

import os
import subprocess
from datetime import datetime, timezone

from scripts.doc_agent.models import Finding, Severity, BaseChecker


class StalenessChecker(BaseChecker):
    @property
    def name(self) -> str:
        return "staleness"

    def check(self, config: dict, files: list[str]) -> list[Finding]:
        """Flag files that haven't been modified recently."""
        repo_root = config.get("_repo_root", os.getcwd())
        warning_days = config.get("staleness_warning_days", 180)
        critical_days = config.get("staleness_critical_days", 365)
        now = datetime.now(timezone.utc)

        findings: list[Finding] = []

        for filepath in files:
            rel_path = os.path.relpath(filepath, repo_root)
            last_modified = self._get_last_modified(filepath, repo_root)

            if last_modified is None:
                continue

            age_days = (now - last_modified).days

            if age_days >= critical_days:
                findings.append(Finding(
                    checker=self.name,
                    file=rel_path,
                    line=0,
                    severity=Severity.CRITICAL,
                    message=(
                        f"Document is critically stale: last modified {age_days} days ago "
                        f"({last_modified.strftime('%Y-%m-%d')})"
                    ),
                    suggestion="Review and update this document or confirm it is still accurate.",
                    metadata={
                        "last_modified": last_modified.isoformat(),
                        "age_days": age_days,
                        "threshold": critical_days,
                    },
                ))
            elif age_days >= warning_days:
                findings.append(Finding(
                    checker=self.name,
                    file=rel_path,
                    line=0,
                    severity=Severity.WARNING,
                    message=(
                        f"Document may be stale: last modified {age_days} days ago "
                        f"({last_modified.strftime('%Y-%m-%d')})"
                    ),
                    suggestion="Consider reviewing this document for accuracy.",
                    metadata={
                        "last_modified": last_modified.isoformat(),
                        "age_days": age_days,
                        "threshold": warning_days,
                    },
                ))

        return findings

    def _get_last_modified(self, filepath: str, repo_root: str) -> datetime | None:
        """Get the last git commit date for a file."""
        try:
            result = subprocess.run(
                ["git", "log", "--format=%aI", "-1", "--", filepath],
                capture_output=True,
                text=True,
                cwd=repo_root,
                timeout=10,
            )
            date_str = result.stdout.strip()
            if not date_str:
                return None
            return datetime.fromisoformat(date_str)
        except (subprocess.SubprocessError, ValueError):
            return None

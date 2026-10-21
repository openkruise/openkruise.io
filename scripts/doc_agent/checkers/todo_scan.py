"""
TODO/FIXME/PLACEHOLDER marker scanner.
"""

from __future__ import annotations

import os
import re

from scripts.doc_agent.models import Finding, Severity, BaseChecker

_DEFAULT_MARKERS = ["TODO", "FIXME", "PLACEHOLDER", "TBD"]


class TodoScanChecker(BaseChecker):
    @property
    def name(self) -> str:
        return "todo_scan"

    def check(self, config: dict, files: list[str]) -> list[Finding]:
        """Scan files for TODO-style markers."""
        repo_root = config.get("_repo_root", os.getcwd())
        markers = config.get("todo_markers", _DEFAULT_MARKERS)

        pattern = re.compile(
            r'\b(' + '|'.join(re.escape(m) for m in markers) + r')\b',
            re.IGNORECASE,
        )

        findings: list[Finding] = []

        for filepath in files:
            rel_path = os.path.relpath(filepath, repo_root)

            try:
                with open(filepath, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.readlines()
            except OSError:
                continue

            for line_num, line in enumerate(lines, start=1):
                matches = pattern.findall(line)
                if matches:
                    unique_markers = sorted(set(m.upper() for m in matches))
                    findings.append(Finding(
                        checker=self.name,
                        file=rel_path,
                        line=line_num,
                        severity=Severity.WARNING,
                        message=(
                            f"Found marker(s) {', '.join(unique_markers)}: "
                            f"{line.strip()[:120]}"
                        ),
                        suggestion="Resolve or remove the marker before publishing.",
                        metadata={"markers": unique_markers},
                    ))

        return findings

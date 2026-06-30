"""
Structure checker — validates document structure and completeness.
"""

from __future__ import annotations

import os
import re

from scripts.doc_agent.models import Finding, Severity, BaseChecker

_HEADING_RE = re.compile(r'^(#{1,6})\s+(.+)$')
_FRONTMATTER_DELIM = "---"


class StructureChecker(BaseChecker):
    @property
    def name(self) -> str:
        return "structure"

    def check(self, config: dict, files: list[str]) -> list[Finding]:
        """Validate structural quality of Markdown files."""
        repo_root = config.get("_repo_root", os.getcwd())
        min_content_length = config.get("min_content_length", 50)

        findings: list[Finding] = []

        for filepath in files:
            rel_path = os.path.relpath(filepath, repo_root)

            try:
                with open(filepath, "r", encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except OSError:
                continue

            body = self._strip_frontmatter(content)
            body_stripped = body.strip()

            if len(body_stripped) < min_content_length:
                findings.append(Finding(
                    checker=self.name,
                    file=rel_path,
                    line=0,
                    severity=Severity.WARNING,
                    message=(
                        f"File has very little content ({len(body_stripped)} chars, "
                        f"threshold: {min_content_length})"
                    ),
                    suggestion="Add meaningful content or remove the file.",
                    metadata={"content_length": len(body_stripped)},
                ))

            lines = body.split("\n")
            for i, line in enumerate(lines):
                heading_match = _HEADING_RE.match(line)
                if not heading_match:
                    continue

                has_content = False
                for j in range(i + 1, len(lines)):
                    stripped = lines[j].strip()
                    if not stripped:
                        continue
                    if _HEADING_RE.match(stripped):
                        break
                    has_content = True
                    break

                if not has_content:
                    actual_line = self._frontmatter_line_count(content) + i + 1
                    findings.append(Finding(
                        checker=self.name,
                        file=rel_path,
                        line=actual_line,
                        severity=Severity.INFO,
                        message=f"Heading with no content: {heading_match.group(2).strip()}",
                        suggestion="Add content under this heading or remove it.",
                    ))

        return findings

    def _strip_frontmatter(self, content: str) -> str:
        """Remove YAML frontmatter (--- delimited block at start of file)."""
        if not content.startswith(_FRONTMATTER_DELIM):
            return content

        end_idx = content.find(
            f"\n{_FRONTMATTER_DELIM}", len(_FRONTMATTER_DELIM)
        )
        if end_idx == -1:
            return content

        after = end_idx + 1 + len(_FRONTMATTER_DELIM)
        return content[after:]

    def _frontmatter_line_count(self, content: str) -> int:
        """Count the number of lines occupied by frontmatter (including delimiters)."""
        if not content.startswith(_FRONTMATTER_DELIM):
            return 0

        end_idx = content.find(
            f"\n{_FRONTMATTER_DELIM}", len(_FRONTMATTER_DELIM)
        )
        if end_idx == -1:
            return 0

        frontmatter_block = content[:end_idx + 1 + len(_FRONTMATTER_DELIM)]
        return frontmatter_block.count("\n") + 1

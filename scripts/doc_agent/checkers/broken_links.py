"""
Broken link checker — validates internal and external hyperlinks in Markdown.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass

from scripts.doc_agent.models import Finding, Severity, BaseChecker

_MD_LINK_RE = re.compile(r'(?<!!)\[([^\]]*)\]\(([^)]+)\)')
_HTML_HREF_RE = re.compile(r'<a\s[^>]*href=["\']([^"\']+)["\']', re.IGNORECASE)


class BrokenLinksChecker(BaseChecker):
    @property
    def name(self) -> str:
        return "broken_links"

    def check(self, config: dict, files: list[str]) -> list[Finding]:
        """Scan Markdown files for broken internal and external links."""
        repo_root = config.get("_repo_root", os.getcwd())
        check_external = config.get("link_check_external", False)
        timeout = config.get("link_check_timeout_seconds", 10)
        retries = config.get("link_check_retries", 1)

        findings: list[Finding] = []

        for filepath in files:
            rel_path = os.path.relpath(filepath, repo_root)
            file_dir = os.path.dirname(filepath)

            try:
                with open(filepath, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.readlines()
            except OSError:
                continue

            for line_num, line in enumerate(lines, start=1):
                urls: list[str] = []
                for match in _MD_LINK_RE.finditer(line):
                    urls.append(match.group(2))
                for match in _HTML_HREF_RE.finditer(line):
                    urls.append(match.group(1))

                for url in urls:
                    if url.startswith("#") or url.startswith("mailto:"):
                        continue
                    if "{{" in url or "{%" in url:
                        continue

                    if url.startswith("http://") or url.startswith("https://"):
                        if check_external:
                            finding = self._check_external_link(
                                url, rel_path, line_num, timeout, retries
                            )
                            if finding:
                                findings.append(finding)
                    else:
                        finding = self._check_internal_link(
                            url, rel_path, line_num, file_dir, repo_root
                        )
                        if finding:
                            findings.append(finding)

        return findings

    def _check_internal_link(
        self,
        url: str,
        rel_path: str,
        line_num: int,
        file_dir: str,
        repo_root: str,
    ) -> Finding | None:
        """Validate an internal link against the file tree."""
        path_part = url.split("#")[0]
        if not path_part:
            return None

        path_part = path_part.split("?")[0]

        if path_part.startswith("/"):
            target = os.path.join(repo_root, path_part.lstrip("/"))
        else:
            target = os.path.join(file_dir, path_part)

        target = os.path.normpath(target)

        if os.path.exists(target):
            return None
        if os.path.exists(target + ".md"):
            return None
        if os.path.exists(target + ".mdx"):
            return None
        if os.path.isdir(target) and (
            os.path.exists(os.path.join(target, "index.md"))
            or os.path.exists(os.path.join(target, "README.md"))
        ):
            return None

        return Finding(
            checker=self.name,
            file=rel_path,
            line=line_num,
            severity=Severity.WARNING,
            message=f"Internal link target not found: {url}",
            suggestion=f"Verify the path exists or fix the reference.",
            metadata={"url": url, "resolved_target": target},
        )

    def _check_external_link(
        self,
        url: str,
        rel_path: str,
        line_num: int,
        timeout: int,
        retries: int,
    ) -> Finding | None:
        """Validate an external URL via HTTP HEAD with GET fallback."""
        try:
            import requests
        except ImportError:
            return Finding(
                checker=self.name,
                file=rel_path,
                line=line_num,
                severity=Severity.INFO,
                message=f"Skipped external link check (requests not installed): {url}",
            )

        attempts = 1 + retries
        last_error = ""

        for attempt in range(attempts):
            try:
                resp = requests.head(
                    url, timeout=timeout, allow_redirects=True,
                    headers={"User-Agent": "openkruise-doc-agent/1.0"}
                )
                if resp.status_code == 405:
                    resp = requests.get(
                        url, timeout=timeout, allow_redirects=True,
                        headers={"User-Agent": "openkruise-doc-agent/1.0"}
                    )

                if resp.status_code >= 400:
                    return Finding(
                        checker=self.name,
                        file=rel_path,
                        line=line_num,
                        severity=Severity.WARNING,
                        message=f"External link returned HTTP {resp.status_code}: {url}",
                        metadata={"url": url, "status_code": resp.status_code},
                    )

                if resp.history:
                    return Finding(
                        checker=self.name,
                        file=rel_path,
                        line=line_num,
                        severity=Severity.INFO,
                        message=f"External link redirected ({len(resp.history)} hop(s)): {url}",
                        metadata={
                            "url": url,
                            "final_url": resp.url,
                            "redirect_count": len(resp.history),
                        },
                    )

                return None

            except requests.RequestException as e:
                last_error = str(e)
                continue

        return Finding(
            checker=self.name,
            file=rel_path,
            line=line_num,
            severity=Severity.WARNING,
            message=f"External link unreachable after {attempts} attempt(s): {url}",
            metadata={"url": url, "error": last_error},
        )

"""
Data model for evaluation findings and base checker interface.
"""

from __future__ import annotations

import abc
import enum
from dataclasses import dataclass, field, asdict
from typing import Any


class Severity(enum.Enum):
    """Severity levels mirror conventional log levels."""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


@dataclass
class Finding:
    """A single issue discovered by a checker.

    Attributes:
        checker:     Name of the checker that produced this finding.
        file:        Relative path to the file (from repo root).
        line:        Line number (1-indexed), or 0 if not applicable.
        severity:    How urgent the issue is.
        message:     Human-readable description of the problem.
        suggestion:  Optional machine-actionable fix hint.
        metadata:    Arbitrary extra data (e.g. HTTP status code, days stale).
    """
    checker: str
    file: str
    line: int
    severity: Severity
    message: str
    suggestion: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        """Serialize to a JSON-friendly dict."""
        d = asdict(self)
        d["severity"] = self.severity.value
        return d


class BaseChecker(abc.ABC):
    """Base interface for all Document Agent checkers."""
    
    @property
    @abc.abstractmethod
    def name(self) -> str:
        """Return the unique string identifier for this checker."""
        pass
        
    @abc.abstractmethod
    def check(self, config: dict, files: list[str]) -> list[Finding]:
        """
        Evaluate documentation files and return findings.

        Args:
            config: Parsed config.json contents.
            files:  Absolute paths to Markdown files to scan.

        Returns:
            List of Finding instances representing identified issues.
        """
        pass

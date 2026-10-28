#!/usr/bin/env python3
"""
Document Agent — Main evaluation entry point.

Discovers Markdown files, dynamically loads enabled checkers, and generates reports.
Designed to run both locally and in GitHub Actions.

Usage:
    python3 scripts/doc_agent/evaluate.py [--config PATH] [--dry-run] [--auto-fix]
"""

from __future__ import annotations

import argparse
import importlib
import inspect
import json
import os
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Path setup: ensure imports work when invoked from the repo root
# (e.g. `python3 scripts/doc_agent/evaluate.py`)
# ---------------------------------------------------------------------------
_SCRIPT_DIR = Path(__file__).resolve().parent
_REPO_ROOT = _SCRIPT_DIR.parent.parent  # scripts/doc_agent/../../

# Add repo root to sys.path so we can import scripts.doc_agent.*
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from scripts.doc_agent.models import Finding, BaseChecker
from scripts.doc_agent.reporter import generate_reports


DEFAULT_CONFIG_PATH = _SCRIPT_DIR / "config.json"


def load_checkers(enabled_checkers: list[str]) -> list[BaseChecker]:
    """Dynamically load checker classes based on configuration.
    
    Each checker is expected to be a module in scripts.doc_agent.checkers
    containing a class that implements BaseChecker.
    """
    checkers = []
    for name in enabled_checkers:
        module_name = f"scripts.doc_agent.checkers.{name}"
        try:
            module = importlib.import_module(module_name)
            # Find all classes in the module that inherit from BaseChecker
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if (
                    inspect.isclass(attr) 
                    and issubclass(attr, BaseChecker) 
                    and attr is not BaseChecker
                ):
                    checkers.append(attr())
        except (ImportError, AttributeError) as e:
            print(f"[doc-agent] WARNING: Failed to load checker '{name}': {e}")
    return checkers


def main() -> int:
    """CLI entry point. Returns 0 on success, 1 on failure."""
    args = _parse_args()

    # Load configuration
    config = _load_config(args.config)
    config["_repo_root"] = str(_REPO_ROOT)

    # Override auto-fix from environment (GitHub Actions sets this)
    if os.environ.get("ENABLE_AUTO_FIX", "").lower() == "true":
        config["enable_auto_fix"] = True
    if args.auto_fix:
        config["enable_auto_fix"] = True

    # Discover Markdown files
    md_files = _discover_files(config)
    print(f"[doc-agent] Discovered {len(md_files)} Markdown files")

    # Dynamically load enabled checkers
    enabled = config.get("enabled_checkers", [])
    if not enabled:
        print("[doc-agent] WARNING: No checkers enabled in config.")
        return 0
        
    checkers = load_checkers(enabled)
    all_findings: list[Finding] = []

    for checker in checkers:
        print(f"[doc-agent] Running checker: {checker.name}")
        try:
            findings = checker.check(config, md_files)
            all_findings.extend(findings)
            print(f"[doc-agent]   → {len(findings)} finding(s)")
        except Exception as e:
            print(f"[doc-agent] ERROR in checker '{checker.name}': {e}")
            # Continue with other checkers — don't fail the whole run

    # Generate reports
    output_dir = os.path.join(str(_REPO_ROOT), config.get("report_output_dir", "docs/reports"))
    dry_run = args.dry_run or os.environ.get("DRY_RUN", "").lower() == "true"

    report = generate_reports(all_findings, config, output_dir, dry_run=dry_run)

    if dry_run:
        print("\n" + "=" * 60)
        print("DRY RUN — Report (not written to disk):")
        print("=" * 60 + "\n")
        print(report)
    else:
        print(f"\n[doc-agent] Reports written to {output_dir}/")

    # Print summary
    from collections import Counter
    from scripts.doc_agent.models import Severity
    counts = Counter(f.severity for f in all_findings)
    print(f"\n[doc-agent] Summary: "
          f"{counts.get(Severity.CRITICAL, 0)} critical, "
          f"{counts.get(Severity.WARNING, 0)} warnings, "
          f"{counts.get(Severity.INFO, 0)} info")

    # Auto-fix (PR 4): Apply trivial fixes if enabled
    if config.get("enable_auto_fix", False) and not dry_run:
        _apply_auto_fixes(all_findings, config)

    return 0


def _parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Document Agent — evaluate documentation health",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--config",
        default=str(DEFAULT_CONFIG_PATH),
        help="Path to config.json (default: %(default)s)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print report to stdout without writing files",
    )
    parser.add_argument(
        "--auto-fix",
        action="store_true",
        help="Apply trivial auto-fixes (e.g. broken internal link corrections)",
    )
    return parser.parse_args()


def _load_config(config_path: str) -> dict:
    """Load and validate the config file."""
    path = Path(config_path)
    if not path.exists():
        print(f"[doc-agent] Config not found at {config_path}, using defaults")
        return {}

    with open(path, "r", encoding="utf-8") as f:
        config = json.load(f)

    print(f"[doc-agent] Loaded config from {config_path}")
    return config


def _discover_files(config: dict) -> list[str]:
    """Find all Markdown files in the configured doc paths.

    Returns absolute paths sorted alphabetically for deterministic output.
    """
    repo_root = config.get("_repo_root", str(_REPO_ROOT))
    doc_paths = config.get("doc_paths", ["docs"])
    versioned_paths = config.get("versioned_doc_paths", [])

    all_paths = doc_paths + versioned_paths
    md_files: list[str] = []

    for rel_dir in all_paths:
        abs_dir = os.path.join(repo_root, rel_dir)
        if not os.path.isdir(abs_dir):
            print(f"[doc-agent] WARNING: Configured path not found: {rel_dir}")
            continue

        for root, _dirs, filenames in os.walk(abs_dir):
            for fname in filenames:
                if fname.endswith((".md", ".mdx")):
                    md_files.append(os.path.join(root, fname))

    return sorted(md_files)


def _apply_auto_fixes(findings: list[Finding], config: dict) -> None:
    """Apply trivial, deterministic fixes based on findings.

    Currently supports:
    - (Placeholder for future auto-fix logic)
    """
    print("[doc-agent] Auto-fix is enabled but no fixes are implemented yet.")


if __name__ == "__main__":
    sys.exit(main())

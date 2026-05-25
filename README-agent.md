Doc Agent

Purpose
Deterministic documentation evaluation pipeline that produces scorecards, reports, and patch suggestions.

Architecture overview
- collect -> evaluate -> score -> stage -> report
- deterministic, offline evaluation of markdown links, anchors, and frontmatter
- outputs are artifacts only; no doc edits are performed

Determinism
- local file system only
- fixed scoring weights and ordered outputs
- reproducible artifacts from the same inputs

NO AUTO-MERGE
- this system never merges
- draft PRs only
- PR creation is opt-in and gated by config and flags

Safety guarantees
- no direct doc edits
- no network calls during evaluation
- explicit opt-in for PR creation

Local setup
- python -m pip install -r requirements.txt

Example CLI usage
- python -m agent.cli collect --repo-root . --output inventory.json
- python -m agent.cli evaluate --repo-root . --output-dir agent/artifacts
- python -m agent.cli score --input-dir agent/artifacts --output scorecard.json
- python -m agent.cli stage --input-dir agent/artifacts --output-dir agent/staging
- python -m agent.cli report --input-dir agent/artifacts --output-dir agent/reports

Artifacts
- inventory.json: file metadata snapshot
- scorecard.json: per-file scores and priorities
- summary.md: human-readable report
- suggestions.patch: remediation suggestions only
- suggestions.preview.html: diff preview
- suggestions.patch.meta.json: patch metadata

Sample outputs
- agent/examples/sample_inventory.json
- agent/examples/sample_scorecard.json
- agent/examples/sample_summary.md
- agent/examples/sample.patch

Demo outputs
- agent/demo/demo_inventory.json
- agent/demo/demo_scorecard.json
- agent/demo/demo_summary.md
- agent/demo/demo.patch
- agent/demo/demo.preview.html

Demo fixture
- tests/fixtures/demo_docs/ contains realistic broken and valid samples

Maintainer review flow
- inspect summary.md for high-priority files
- open suggestions.patch for proposed remediation notes
- use suggestions.preview.html for quick visual review

Workflows
- doc-agent-schedule.yml runs weekly and uploads artifacts (dry-run only)
- doc-agent-manual.yml supports workflow_dispatch and optional draft PR creation
- ci-agent-tests.yml runs pytest on push and pull_request

Testing
- pytest -q

Docs
- ARCHITECTURE.md
- docs/architecture/
- docs/research/
- docs/demo/

Limitations
- local link and asset checks only
- no automatic documentation edits
- PR creation requires explicit flags and config

Future work
- richer evaluation heuristics
- sidebar orphan detection
- content freshness warnings by section

FAQ
- Why no auto-merge? Safety and maintainability require human review.
- Why no AI-first automation? Determinism and trust are prioritized.

Contributing

Local setup
- python -m pip install -r requirements.txt

Run tests
- pytest -q

Run dry-run pipeline
- python -m agent.cli collect --repo-root . --output inventory.json
- python -m agent.cli evaluate --repo-root . --output-dir agent/artifacts
- python -m agent.cli score --input-dir agent/artifacts --output scorecard.json
- python -m agent.cli stage --input-dir agent/artifacts --output-dir agent/staging
- python -m agent.cli report --input-dir agent/artifacts --output-dir agent/reports

Review generated patches
- open agent/reports/summary.md for priority overview
- open agent/staging/suggestions.patch for remediation notes
- open agent/staging/suggestions.preview.html for visual review

Adding new evaluators
- keep evaluators deterministic and offline
- prefer pure functions that accept content and paths
- add tests and snapshot updates for all new outputs
- do not modify docs in evaluators

Coding standards
- Python 3.10+
- deterministic ordering for outputs
- explicit UTF-8 encoding for file IO
- use atomic writes where possible

Deterministic testing rules
- no network access in tests
- no time-dependent assertions without normalization
- fixed fixtures under tests/fixtures/

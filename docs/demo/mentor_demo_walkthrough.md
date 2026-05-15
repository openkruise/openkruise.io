Mentor Demo Walkthrough

Purpose
- Show deterministic documentation evaluation
- Demonstrate safe, artifact-only outputs

Run the demo
- python -m agent.cli collect --repo-root . --output inventory.json
- python -m agent.cli evaluate --repo-root . --output-dir agent/artifacts
- python -m agent.cli score --input-dir agent/artifacts --output scorecard.json
- python -m agent.cli stage --input-dir agent/artifacts --output-dir agent/staging
- python -m agent.cli report --input-dir agent/artifacts --output-dir agent/reports

Review flow
- summary.md shows priorities
- suggestions.patch provides remediation notes
- preview HTML is screenshot-friendly

Safety guarantees
- no auto-merge
- no doc edits
- draft PRs only when gated

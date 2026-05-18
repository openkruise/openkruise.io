Architecture

Diagrams
- docs/architecture/high_level.png
- docs/architecture/low_level.png
- docs/architecture/ci_pipeline.png
- docs/architecture/data_flow.png
- docs/architecture/security_model.png

High-level architecture
The system runs a deterministic CLI pipeline from collection to reporting, producing artifacts only. GitHub Actions triggers the CLI for scheduled dry runs, manual runs, and tests.

Low-level responsibilities
- collect.py: inventory of markdown files with commit metadata
- linkcheck.py: local link, anchor, and image validation
- frontmatter_check.py: required metadata checks
- scorer.py: deterministic scoring with fixed weights
- differ.py: patch and preview generation
- report.py: human-readable summary and JSON report
- pr.py: gated draft PR creation

Deterministic evaluation philosophy
- local filesystem only
- sorted iteration order
- explicit UTF-8 encoding
- fixed scoring weights and thresholds

Why maintainers can trust the system
- no auto-merge
- no doc edits
- artifacts are reviewable and auditable
- PR creation is opt-in and gated by config

Why this avoids AI slop
- no content generation
- no model inference
- no heuristic rewriting

Safety-first patch generation model
- patches contain suggestions only
- no direct modifications to docs
- review is mandatory

CI/CD workflow explanation
- schedule workflow runs weekly, uploads artifacts
- manual workflow runs on demand and can open a draft PR
- test workflow runs pytest for validation

Artifact lifecycle
inventory.json -> evaluations/*.json -> scorecard.json -> suggestions.patch/preview -> summary.md/report.json

Error handling strategy
- resilient file reads
- missing files reported as evidence
- atomic writes for artifacts
- clear CLI errors for missing inputs

Deterministic guarantees
- fixed schema versions
- stable JSON sorting
- repeatable outputs from same inputs

Scalability discussion
- linear scan of markdown files
- evaluation artifacts are per file
- scoring is O(n)

Why Python was chosen
- standard library coverage for file IO and JSON
- fast iteration for tooling
- easy integration with GitHub Actions

Tradeoffs considered
- no auto-fix to maintain safety
- no external link validation to avoid network variance

Why no auto-merge
- documentation quality requires human review
- patches are advisory only

Future roadmap
- sidebar orphan detection
- richer stale-content signals
- report trend comparisons

ASCII sequence diagram

User -> CLI: collect
CLI -> Git: read commit metadata
CLI -> inventory.json: write
User -> CLI: evaluate
CLI -> evaluations/*.json: write
User -> CLI: score
CLI -> scorecard.json: write
User -> CLI: stage
CLI -> suggestions.patch: write
CLI -> suggestions.preview.html: write
User -> CLI: report
CLI -> summary.md/report.json: write

JSON artifact example
{
  "schema_version": 1,
  "generated_at": "2026-05-18T00:00:00+00:00",
  "files": {
    "docs/example.md": {
      "score": 7,
      "priority": "medium",
      "evidence": ["Missing anchors (1)"],
      "subscores": {"missing_anchors": 1}
    }
  },
  "summary": {"total_files": 1, "high_priority": 0, "medium_priority": 1, "low_priority": 0}
}

Evaluator lifecycle
- load markdown
- extract anchors
- check local links and images
- validate frontmatter
- emit evaluation JSON

Scoring example
- missing file: -3
- missing frontmatter: -2
- stale: -1
- score starts at 10

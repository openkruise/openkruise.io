Design Decisions

Determinism over automation
- All analysis is local and repeatable
- No network access during evaluation
- Stable ordering and schema versions

Safety-first PR model
- Draft PRs only
- Explicit config and flags
- No auto-merge

Artifacts as the contract
- inventory.json for metadata
- evaluations/*.json for detailed findings
- scorecard.json for priorities
- suggestions.patch as advisory notes
- summary.md/report.json for maintainers

Why no AI-first features
- Avoids non-deterministic outputs
- Keeps review load predictable
- Reduces risk of low-quality auto-edits

Tradeoffs
- External link validation omitted for stability
- Patch output is advisory rather than automatic

Mentor Walkthrough

What the system does
- Collects deterministic inventory of docs
- Evaluates links, anchors, and frontmatter
- Scores files and produces artifacts

Why maintainers need it
- Flags broken docs early
- Centralizes review in reports and patches
- Keeps the process deterministic and auditable

Deterministic guarantees
- Ordered file traversal
- Fixed scoring weights
- No network access during evaluation

Safety guarantees
- No auto-merge
- No direct doc edits
- Draft PRs only when explicitly enabled

Sample outputs
- demo_summary.md
- demo.patch
- demo.preview.html

CI workflow explanation
- Schedule workflow generates artifacts weekly
- Manual workflow can open draft PRs
- Tests run on push and pull_request

Future roadmap
- Sidebar orphan detection
- Extended consistency checks

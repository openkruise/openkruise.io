Related Work

Automated maintenance tools
- Dependabot and Renovate: automated dependency updates with review workflows
- CodeQL: static analysis with structured findings
- Vale: offline documentation linting
- MegaLinter: CI-based multi-language linting with report artifacts
- semantic-release: automated release pipeline with strict conventions

Why this project differs
- Focuses on documentation quality and freshness
- Produces only artifacts and advisory patches
- Avoids auto-merge and direct edits
- Emphasizes deterministic, local analysis

Safety-first automation patterns
- Scheduled dry-run pipelines
- Manual gating for draft PRs
- Artifact-only outputs for review

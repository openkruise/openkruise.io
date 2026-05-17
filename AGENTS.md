# OpenKruise Document Agent

An intelligent documentation agent for the OpenKruise website. It keeps the
documentation site in sync with upstream sub-project releases by checking
GitHub for new releases, scoring how fresh the docs are, and auto-drafting
release blog posts.

This was built as a proof-of-concept for an LFX mentorship application.

## What it does

| Step | Action |
| ---- | ------ |
| 1 | Fetches the latest release for each tracked OpenKruise sub-project from the public GitHub Releases API. |
| 2 | Extracts the latest release tag, publish date, and changelog body. |
| 3 | Evaluates **documentation freshness** — a release older than 30 days is flagged `STALE`. |
| 4 | Auto-generates a Docusaurus-compatible blog post for each sub-project's latest release. |
| 5 | Writes a consolidated freshness report. |

## Tracked sub-projects

- [`openkruise/kruise`](https://github.com/openkruise/kruise)
- [`openkruise/rollouts`](https://github.com/openkruise/rollouts)
- [`openkruise/kruise-game`](https://github.com/openkruise/kruise-game)
- [`openkruise/kruise-rollout-api`](https://github.com/openkruise/kruise-rollout-api)

To track more, add an entry to `SUB_PROJECTS` in `scripts/doc_agent.py`.

## Tools & dependencies

- **Python 3.9+** (uses standard library: `json`, `os`, `re`, `sys`,
  `textwrap`, `datetime`).
- **[`requests`](https://pypi.org/project/requests/)** — the only third-party
  dependency, used for GitHub API calls.
- **GitHub Releases API** — public endpoints, no authentication token
  required (subject to GitHub's unauthenticated rate limit of 60 req/hour,
  well within the agent's 4 requests per run).

## How to run

```bash
pip install requests
python scripts/doc_agent.py
```

## Outputs

All generated files are written to `agent-output/` (kept separate from the
live `blog/` directory so a human can review before publishing):

```
agent-output/
├── blogs/
│   ├── <date>-kruise-<tag>.md
│   ├── <date>-rollouts-<tag>.md
│   ├── <date>-kruise-game-<tag>.md
│   └── <date>-kruise-rollout-<tag>.md
└── freshness-report.md
```

### Blog post format

Each generated post uses Docusaurus blog front matter:

```markdown
---
title: "OpenKruise Kruise v1.x.x Released"
date: 2026-05-18
author: OpenKruise Community
tags: [kruise, release]
---

## What's New in vX.X.X

- ... (top 5 highlights parsed from the GitHub release body)

For the full changelog, see the [release notes](<github release url>).
```

### Exit codes

- `0` — all sub-projects fetched and processed successfully.
- `1` — one or more sub-projects could not be fetched (the run still
  produces output for the successful ones; CI surfaces the failure).

## Automation

The agent runs via GitHub Actions
([`.github/workflows/doc-agent.yml`](.github/workflows/doc-agent.yml)):

- **Scheduled:** every Monday at 09:00 UTC (`cron: "0 9 * * 1"`).
- **Manual:** via `workflow_dispatch` from the Actions tab.

Generated files are uploaded as the `doc-agent-output` build artifact for
review.

## How it works internally

1. `fetch_latest_release()` — calls the GitHub Releases API per repo, skips
   drafts, and picks the newest by `published_at` (not relying solely on API
   ordering). Network/JSON errors are caught per-repo so one bad repo does
   not abort the run.
2. `evaluate_freshness()` — compares the release date to "now" (UTC) and
   returns days-since-release plus a `FRESH`/`STALE` status.
3. `extract_highlights()` — parses the release body for markdown bullet
   points, strips links/formatting, and keeps the top 5. When a release has
   no bullets, `extract_prose_summary()` falls back to the first meaningful
   paragraph so the post still has real content.
4. `generate_blog_post()` / `write_freshness_report()` — render the
   Docusaurus markdown and the report table.

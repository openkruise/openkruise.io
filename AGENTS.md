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
| 6 | **Evaluates the existing `docs/` folder** — broken links, stale pages, and TODO/FIXME/XXX markers — and writes a documentation evaluation report. |

Full pipeline: **fetch releases → generate blogs → evaluate docs → write all
reports.**

## Tracked sub-projects

- [`openkruise/kruise`](https://github.com/openkruise/kruise)
- [`openkruise/rollouts`](https://github.com/openkruise/rollouts)
- [`openkruise/kruise-game`](https://github.com/openkruise/kruise-game)
- [`openkruise/kruise-rollout-api`](https://github.com/openkruise/kruise-rollout-api)

To track more, add an entry to `SUB_PROJECTS` in `scripts/doc_agent.py`.

## Tools & dependencies

- **Python 3.9+** (standard library only: `json`, `os`, `re`, `sys`,
  `datetime`, `importlib` for the main agent; `subprocess` for the
  staleness checker's `git log` calls).
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

## Documentation evaluation layer

In addition to generating blog posts from upstream releases, the agent
**evaluates the documentation already in this repo's `docs/` folder**. This
is a separate, pluggable layer that lives in the `scripts/doc_agent/`
package:

```
scripts/
├── doc_agent.py              # main agent (entry point)
└── doc_agent/
    ├── evaluate.py           # runs all checkers, writes the report
    └── checkers/
        ├── broken_links.py   # empty links + links to missing local files
        ├── staleness.py      # pages whose last git commit is > 180 days old
        └── todo_scan.py      # TODO / FIXME / XXX markers in docs
```

Each checker exposes one uniform entry point — `run(docs_dir: str) ->
list[dict]` — and is fully independent, so checkers can be run or unit-tested
in isolation:

```bash
python scripts/doc_agent/checkers/broken_links.py docs   # JSON to stdout
python scripts/doc_agent/evaluate.py                      # full report
```

| Checker | Detects |
| ------- | ------- |
| `broken_links` | `[text]()` (empty) and `[text](./missing.md)` (link to a non-existent local file). External/anchor/site-absolute links are skipped to avoid false positives. |
| `staleness` | Pages whose **last git commit** is more than 180 days old (uses `git log` via `subprocess`, not filesystem mtime, which a fresh checkout would reset). |
| `todo_scan` | `TODO`, `FIXME`, `XXX` markers (case-sensitive, word-boundary) with surrounding context. |

`evaluate.py` aggregates all three into
`agent-output/docs-evaluation-report.md`. Note: `scripts/doc_agent.py` (file)
and `scripts/doc_agent/` (package) share a base name, so the main agent loads
`evaluate.py` by file path via `importlib` rather than a normal import, which
sidesteps that ambiguity.

## Outputs

All generated files are written to `agent-output/` (kept separate from the
live `blog/` directory so a human can review before publishing):

```
agent-output/
├── blogs/
│   ├── <date>-kruise-<tag>.md
│   ├── <date>-rollouts-<tag>.md
│   ├── <date>-kruise-game-<tag>.md
│   └── <date>-kruise-rollout-api-<tag>.md
├── freshness-report.md
└── docs-evaluation-report.md
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
5. `run_docs_evaluation()` — loads `scripts/doc_agent/evaluate.py` by path,
   which runs the three checkers against `docs/` and writes
   `agent-output/docs-evaluation-report.md`. This step always runs, even if
   a release fetch failed, so the docs report is still produced.

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
| 6 | **Evaluates the existing `docs/` folder** — broken internal links, broken external links (live HTTP check), stale pages, and TODO/FIXME/XXX markers — and writes a documentation evaluation report. |

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
  runtime dependency, used for GitHub API calls and the external-link check.
- **[`pytest`](https://pypi.org/project/pytest/)** — test-only dependency
  (not needed to run the agent). See [Testing](#testing).
- **GitHub Releases API** — public endpoints, no authentication token
  required (subject to GitHub's unauthenticated rate limit of 60 req/hour,
  well within the agent's 4 requests per run).

## How to run

```bash
pip install requests
python scripts/doc_agent.py

# Offline / CI: skip the live external-link HTTP checks
SKIP_EXTERNAL_LINKS=1 python scripts/doc_agent.py
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
    ├── evaluate.py            # runs all checkers, writes the report
    └── checkers/
        ├── broken_links.py    # empty links + links to missing local files
        ├── external_links.py  # live HTTP check of external http(s) links
        ├── staleness.py       # pages whose last git commit is > 180 days old
        └── todo_scan.py       # TODO / FIXME / XXX markers in docs
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
| `external_links` | External `http(s)` links that are unreachable: HEAD request (10s timeout, redirects followed, retries GET on 403/405), reported on non-2xx or timeout. Rate-limited to 1 req/s; each unique URL checked once. Set `SKIP_EXTERNAL_LINKS` to skip (offline/CI). |
| `staleness` | Pages whose **last git commit** is more than 180 days old (uses `git log` via `subprocess`, not filesystem mtime, which a fresh checkout would reset). |
| `todo_scan` | `TODO` / `FIXME` (case-insensitive) and `XXX` (upper-case only) markers, word-boundary, with surrounding context. Code fences and `context.TODO()`-style call forms are skipped. |

`evaluate.py` aggregates all four into
`agent-output/docs-evaluation-report.md` (a Summary table plus one section
per checker). Note: `scripts/doc_agent.py` (file) and `scripts/doc_agent/`
(package) share a base name, so the main agent loads `evaluate.py` by file
path via `importlib` rather than a normal import, which sidesteps that
ambiguity.

## Testing

Unit tests for the checkers live in [`tests/`](tests/) and use `pytest`
with `unittest.mock` (git calls are mocked — no network, no git needed).
The whole suite runs in well under a second.

```bash
pip install pytest
python -m pytest tests/          # or: python -m pytest tests/ -q
```

| Test file | Covers |
| --------- | ------ |
| `test_broken_links.py` | empty hrefs, missing local files, extensionless resolution, skipping external/anchor/site-absolute links, images-not-links, line numbers. |
| `test_staleness.py` | mocked `git` output for fresh vs. stale files, the strict `> 180` boundary, no-history files, and "not a git repo". |
| `test_todo_scan.py` | upper-case detection, TODO/FIXME case-insensitivity, `XXX` case-sensitivity, context capture, code-fence / call-form skipping, multiple markers per line. |

The live `external_links` checker is intentionally **not** unit-tested
against the network; run it offline via `SKIP_EXTERNAL_LINKS=1`, or point it
at a single file ad hoc: `python scripts/doc_agent/checkers/external_links.py docs`.

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
   which runs the four checkers against `docs/` and writes
   `agent-output/docs-evaluation-report.md`. This step always runs, even if
   a release fetch failed, so the docs report is still produced. The
   external-link checker self-skips when `SKIP_EXTERNAL_LINKS` is set, and
   the report shows that section as *skipped* rather than "0 issues".

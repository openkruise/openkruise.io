# AGENTS.md

Guidance for AI agents working on the OpenKruise documentation website.

## Scope and precedence

- This file applies repository-wide. Nested `AGENTS.md` files add only local rules; follow both, with the nearest file taking precedence for local details.
- Keep this tree boundary-based instead of repeating the same workflow in topic subdirectories.
- `.docusaurus/`, `build/`, `node_modules/`, `venv/`, and `.qoder/` are generated content, dependencies, or tool instructions—not documentation sources.

## Content map

The Docusaurus site uses English as the default locale and Simplified Chinese as the second locale.

| Content | English source | Simplified Chinese mirror | Navigation |
| --- | --- | --- | --- |
| Kruise | `docs/` | `i18n/zh/docusaurus-plugin-content-docs/current/` | `sidebars.js` |
| Kruise Rollouts | `rollouts/` | `i18n/zh/docusaurus-plugin-content-docs-rollouts/current/` | `sidebars-rollouts.js` |
| OpenKruiseGame | `kruisegame/` | `i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/` | `sidebars-kruisegame.js` |
| Kruise Agents | `kruiseagents/` | `i18n/zh/docusaurus-plugin-content-docs-kruiseagents/current/` | `sidebars-kruiseagents.js` |
| Blog | `blog/` | `i18n/zh/docusaurus-plugin-content-blog/` | Blog metadata/front matter |
| Released Kruise docs | `versioned_docs/version-vX.Y/` | `i18n/zh/docusaurus-plugin-content-docs/version-vX.Y/` | `versioned_sidebars/` |
| Standalone pages | `src/pages/` | `src/pages/zh/` | File-based routing |

The four product documentation roots are independent plugins with separate routes and sidebars. Do not move content between them merely because topics are related.

## Bilingual contract

- Treat each user-facing Markdown or MDX file and its same-relative-path counterpart as one bilingual document. Add, rename, move, edit, or delete both in the same change.
- Keep behavior, defaults, limitations, examples, and release scope semantically equivalent. Translate prose naturally; preserve commands, API names, YAML fields, resource names, URLs, and code identifiers unless a localized equivalent is intentional.
- Keep structure aligned: heading hierarchy and count, links and intended targets, emphasis, inline code, admonitions, tabs, code blocks, and route-defining front matter.
- Apply semantic corrections to both languages. If a counterpart intentionally should not exist, explain why in the change description; historical gaps do not justify new drift.

## Authoring rules

- Use Docusaurus-compatible Markdown/MDX and preserve existing component and admonition syntax.
- Keep existing routes stable unless the task changes them. Align route-defining front matter such as `id`, `slug`, and positions; translate user-facing titles and descriptions where appropriate.
- Use fenced `yaml` blocks for Kubernetes examples and include `apiVersion`; CI validates their fields against upstream Go structs.
- Use valid repository-relative or route links. Keep shared assets under the matching `static/img/` area unless a localized image is needed.
- Register new product documentation pages in the matching sidebar unless they are intentionally direct-link-only.
- Make focused edits; do not reformat unrelated prose, examples, or translations.

## Version boundaries

- `docs/` and its Chinese `current/` mirror describe the unreleased Kruise version.
- Released documents and sidebars are snapshots. Change them only for an explicit backport, updating the matching English and Chinese version together.
- Create versions through Docusaurus versioning commands rather than manually copying snapshot trees.

## Validation

```bash
git diff --check
npm run build
```

Before finishing, inspect the changed-file list for missing bilingual counterparts and address warnings introduced by the change. Run relevant `.github/workflows/` checks when changing consistency tooling.

The `struct-check` CI job (`.github/workflows/version_struct_check.py`, Python 3.10 + Go) extracts every YAML example from the docs, groups them by `apiVersion`, downloads the matching Go struct definitions from the OpenKruise `kruise`, `kruise-game`, and `rollouts` repos, and validates that the YAML fields match the actual struct fields.

## Safeguards

- Do not edit `.docusaurus/`, `build/`, backup lockfiles, or generated content.
- Do not edit `versioned_docs/` or `versioned_sidebars/` directly unless backporting a fix to a released version.
- Use npm; update `package-lock.json` only when dependencies change. Never commit credentials or `.env` files.
- Commit only when asked, using `git commit -s`.

# AGENTS.md

Guidance for AI agents working on the OpenKruise documentation website.

## Project Overview

This is the official documentation website for [OpenKruise](https://openkruise.io), hosted at `https://openkruise.io`. It is built with **Docusaurus 3** and covers four related products, each with its own docs section, sidebar, and route prefix:

| Product | Docs directory | Route prefix | Sidebar file | i18n plugin id |
|---------|---------------|--------------|--------------|----------------|
| Kruise (core) | `docs/` | `/docs` | `sidebars.js` | `content-docs` |
| Kruise Rollouts | `rollouts/` | `/rollouts` | `sidebars-rollouts.js` | `content-docs-rollouts` |
| OpenKruiseGame | `kruisegame/` | `/kruisegame` | `sidebars-kruisegame.js` | `content-docs-kruisegame` |
| Kruise Agents | `kruiseagents/` | `/kruiseagents` | `sidebars-kruiseagents.js` | `content-docs-kruiseagents` |

The site supports two locales: **English** (`en`, default) and **Simplified Chinese** (`zh`).

## Tech Stack

- **Framework**: Docusaurus 3 (`@docusaurus/core` ^3.9.2)
- **Preset**: `@docusaurus/preset-classic`
- **UI**: React 19, Infima CSS framework (Docusaurus classic theme)
- **Search**: Algolia DocSearch (`@docusaurus/theme-search-algolia`)
- **Syntax highlighting**: prism-react-renderer (themes: github/dracula)
- **Package manager**: npm (lockfile: `package-lock.json`)
- **Node version**: 20 (as required by CI)

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start dev server (English)
npm run start

# Start dev server (Chinese)
npm run start -- --locale zh

# Production build (outputs to build/)
npm run build

# Serve the built site locally
npm run serve

# Deploy to GitHub Pages (requires SSH + GIT_USER)
GIT_USER=<username> USE_SSH=true npm run deploy

# Clear Docusaurus cache (.docusaurus, .cache-loader)
npm run clear

# Generate translation files
npm run write-translations

# Generate heading IDs for docs
npm run write-heading-ids
```

## Repository Structure

```
.
├── docusaurus.config.js      # Main site configuration (navbar, footer, i18n, plugins)
├── versions.json             # Released doc versions (e.g. ["v1.9","v1.8","v1.7","v1.6"])
├── sidebars.js               # Kruise core sidebar
├── sidebars-rollouts.js      # Rollouts sidebar
├── sidebars-kruisegame.js    # KruiseGame sidebar
├── sidebars-kruiseagents.js  # Kruise Agents sidebar
├── docs/                     # Kruise core docs (English, current/unreleased version)
├── rollouts/                 # Rollouts docs (English)
├── kruisegame/               # OpenKruiseGame docs (English)
├── kruiseagents/             # Kruise Agents docs (English)
├── versioned_docs/           # Snapshot of docs for each released version (v1.5–v1.9)
├── versioned_sidebars/       # Sidebars for each released version
├── blog/                     # Blog posts (English)
├── i18n/zh/                  # Chinese translations
│   ├── docusaurus-plugin-content-docs/
│   │   ├── current/          # ZH translation of docs/ (current version)
│   │   └── version-vX.Y/     # ZH translation of versioned_docs/version-vX.Y/
│   ├── docusaurus-plugin-content-docs-rollouts/current/
│   ├── docusaurus-plugin-content-docs-kruisegame/current/
│   ├── docusaurus-plugin-content-docs-kruiseagents/current/
│   ├── docusaurus-plugin-content-blog/       # ZH blog translations
│   ├── docusaurus-theme-classic/             # navbar.json, footer.json
│   └── code.json                             # UI string translations
├── src/
│   ├── pages/                # React pages (index.js, adopters.js, zh/adopters.js)
│   ├── components/           # React components (HomepageFeatures, LatestRelease, SupportersSection)
│   ├── css/custom.css        # Custom theme overrides (Infima CSS variables)
│   └── data/adopters.js      # Adopters list data
├── static/                   # Static assets (images, CNAME, favicon, verification files)
├── .github/workflows/        # CI pipeline (build, typo-check, struct-check)
└── babel.config.js
```

## Documentation Versioning

Versions are managed via `versions.json`. The config (`docusaurus.config.js`) shows only the 3 most recent released versions plus `current` (next/unreleased):

```js
onlyIncludeVersions: ['current', ...versions.slice(0, 3)]
```

The "current" version label is auto-computed as the next minor (e.g., if latest is `v1.9`, current shows `v1.10 🚧`).

To cut a new version:
```bash
npm run docusaurus docs:version v1.10
```
This snapshots `docs/` into `versioned_docs/version-v1.10/` and creates `versioned_sidebars/version-v1.10-sidebars.json`. Then add `"v1.10"` to the top of `versions.json`.

## Internationalization (i18n)

- **Default locale**: `en`
- **Supported locales**: `en`, `zh`
- English docs live in the product directories (`docs/`, `rollouts/`, etc.)
- Chinese docs live under `i18n/zh/docusaurus-plugin-content-docs-*/current/` mirroring the same file paths
- When editing or adding a doc, **always update both English and Chinese** versions
- UI strings are translated in `i18n/zh/code.json`
- Navbar/footer labels: `i18n/zh/docusaurus-theme-classic/navbar.json` and `footer.json`

### Editing docs

When you add or modify a markdown doc:
1. Edit the English file (e.g., `docs/user-manuals/cloneset.md`)
2. Update the corresponding Chinese file (e.g., `i18n/zh/docusaurus-plugin-content-docs/current/user-manuals/cloneset.md`)
3. If adding a new doc, register it in the appropriate sidebar file (`sidebars.js`, `sidebars-rollouts.js`, etc.)
4. For versioned docs, the same doc exists in `versioned_docs/version-vX.Y/` and `i18n/zh/docusaurus-plugin-content-docs/version-vX.Y/`

## CI Pipeline

The CI workflow (`.github/workflows/documentation.yaml`) runs on PRs and pushes to `master` with three jobs:

### 1. Test Build (`checks`)
Runs `npm ci && npm run build` on Node 20. Fails if the Docusaurus build fails (broken links, invalid MDX, etc.).

### 2. Typo Check (`typo-check`)
Runs `.github/workflows/diff.py` (Python 3.12). Compares English and Chinese docs for consistency:
- **Title count**: headings (h1–h6) must match between EN and ZH (code blocks excluded)
- **Link count**: all URLs must match between EN and ZH
- **Highlight count**: `**bold**` markup must match
- **Inline code count**: `` `code` `` spans must match
- **Spelling**: English text is checked with `language_tool_python`; TYPOS category issues fail CI

Check modes:
- **Strict** (fails CI): versioned docs (`versioned_docs/` ↔ `i18n/zh/docusaurus-plugin-content-docs/version-*`)
- **Advisory** (warnings only): current docs (`docs/`, `rollouts/`, `kruisegame/`, `kruiseagents/` ↔ their ZH `current/` dirs)

False-positive spellings can be added to `.github/workflows/pre_dict.json`.

### 3. Struct Check (`struct-check`)
Runs `.github/workflows/version_struct_check.py` (Python 3.10 + Go). Extracts all YAML examples from markdown docs, groups them by `apiVersion`, downloads the corresponding Go struct definitions from the OpenKruise/kruise, kruise-game, and rollouts repos, and validates that the YAML fields match the actual Go struct fields.

## Key Configuration Details

### `docusaurus.config.js`
- `url`: `https://openkruise.io`, `baseUrl`: `/`
- `trailingSlash: false`
- `onBrokenLinks: 'warn'` (warnings, not errors)
- `onBrokenMarkdownLinks: 'warn'`
- Algolia search config reads `Algolia_API_KEY` and `Algolia_APP_ID` from env (with fallback defaults)
- `editUrl` functions generate GitHub edit links per locale and product
- Prism additional languages: `bash`, `diff`, `json`

### Environment Variables
- `Algolia_API_KEY` / `ALGOLIA_API_KEY` — Algolia search API key
- `Algolia_APP_ID` / `ALGOLIA_APP_ID` — Algolia application ID
- `GIT_USER` — GitHub username for deploy
- `USE_SSH` — Use SSH for deploy
- `DEPLOYMENT_BRANCH` — Branch to deploy to (default: `gh-pages`)

## Coding Conventions

### Markdown docs
- Use standard Markdown with Docusaurus features (admonitions, MDX components)
- YAML examples in fenced code blocks with ` ```yaml ` language tag
- Include `apiVersion` in YAML examples (checked by struct-check CI)
- Keep headings, links, bold text, and inline code consistent between EN and ZH

### React components (`src/`)
- Use `.js`/`.jsx` for components (no TypeScript in src)
- CSS modules use `.module.css` convention
- Custom theme overrides go in `src/css/custom.css` using Infima CSS variables

### Sidebar files
- Explicitly defined (not autogenerated)
- Categories use `type: 'category'` with `collapsed` and `items`
- Sub-categories use plain object shorthand: `{ 'Subgroup Name': ['doc-id-1', 'doc-id-2'] }`

## Common Tasks

### Add a new documentation page
1. Create the English markdown file in the appropriate product directory
2. Create the Chinese translation in the matching `i18n/zh/` path
3. Add the doc ID to the sidebar file
4. Run `npm run build` to verify no broken links

### Update an existing doc
1. Edit the English file
2. Sync the Chinese file (same structural changes: headings, links, code blocks)
3. If the doc is versioned, check whether the change applies to released versions too

### Add a blog post
1. Create `blog/YYYY-MM-DD-post-name.md` with frontmatter (title, authors, tags, date)
2. Create the Chinese version in `i18n/zh/docusaurus-plugin-content-blog/`
3. Register authors in `blog/authors.yml`

## Behavior rules

- Do not edit files under `.docusaurus/` — it is a generated cache
- Do not edit `versioned_docs/` or `versioned_sidebars/` directly unless backporting a fix to a released version
- Do not commit `.env` (it is gitignored; only `.env.local` patterns are tracked in `.gitignore`)
- Do not modify `package-lock.json.back` or `yarn.lock.back` — they are backups
- Avoid breaking the EN/ZH consistency checks (titles, links, highlights, inline code counts must match)
- Always commit with sign-off (e.g. `git commit -s`)


---
name: blog-for-release
description: Write and submit release blog posts for OpenKruise and its sub-projects (Kruise Rollouts, KruiseGame, Kruise Agents). Use when creating release announcements, drafting version blog posts, or when the user mentions release blog, version announcement, or changelog summary.
---

# Blog for Release

End-to-end workflow for writing release blog posts (EN + ZH) for OpenKruise and its sub-projects on the Docusaurus documentation site.

## Workflow Overview

```
1. Research      → Fetch changelog, read docs, identify features
2. Plan          → Map features to blog sections
3. Write EN      → Draft with user scenarios + YAML examples
4. Write ZH      → Mirror structure with matching element counts
5. Verify        → Consistency check + npm run build
6. Submit PR     → Commit, push, create PR to master
```

## Step 1: Identify the Product

Determine which product's release blog you're writing:

| Product | Docs dir | GitHub repo | Changelog URL | Chart dir in `openkruise/charts` |
|---------|----------|-------------|---------------|----------------------------------|
| **Kruise (core)** | `docs/` | `openkruise/kruise` | `openkruise/kruise/blob/master/CHANGELOG.md` | `versions/kruise/<version>/` |
| **Kruise Rollouts** | `rollouts/` | `openkruise/rollouts` | `openkruise/rollouts/blob/master/CHANGELOG.md` | `versions/kruise-rollout/<version>/` |
| **KruiseGame** | `kruisegame/` | `openkruise/kruise-game` | `openkruise/kruise-game/blob/master/CHANGELOG.md` | `versions/kruise-game/<version>/` |
| **Kruise Agents** | `kruiseagents/` | `openkruise/agents` | `openkruise/agents/blob/master/CHANGELOG.md` | `versions/kruise-agents-sandbox-controller/<version>/` + `versions/kruise-agents-sandbox-manager/<version>/` |

## Step 2: Research

Gather source material:

- **Changelog**: Fetch from the product's GitHub repo (see table above)
- **Helm chart updates**: Check the product's chart directory in `https://github.com/openkruise/charts` for installation changes:
  - **`Chart.yaml`**: Check `appVersion`, chart `version`, and `annotations.artifacthub.io/changes` for a curated change summary
  - **`values.yaml`**: Compare the new version's `values.yaml` against the previous version to identify new/changed/removed configuration options (e.g., new feature gates, new controller settings, changed defaults)
  - Fetch via raw URL: `https://raw.githubusercontent.com/openkruise/charts/master/versions/<chart-dir>/<version>/Chart.yaml` (and `values.yaml`)
- **Existing docs**: Read the product's `user-manuals/` directory for feature details
- **API changes**: Read `config/crd/bases` folder of each product's repo for field-level change info
- **Master branch**: Check GitHub for upcoming features (e.g., proposals, PRs) for the "What's Next" section

Compare changelog Key Features and chart changes against documented features to identify gaps that need new documentation. Chart `values.yaml` changes often reveal new configuration options that need to be highlighted in the blog's Upgrade Notice or Key Features section.

## Step 3: Plan Blog Structure

Use this exact section structure:

| Section                   | Content                                                                  | Detail Level  |
|---------------------------|--------------------------------------------------------------------------|---------------|
| **Upgrade Notice**        | K8s/Go dependency changes, API changes (field changes + YAML examples)   | Medium        |
| **Key Features**          | 5 official changelog Key Features with user scenarios, YAML, limitations | Detailed      |
| **Other Notable Changes** | Additional features as 1-2 sentence bullet points                        | Brief         |
| **Other Improvements**    | Bug fix summary with changelog link                                      | One paragraph |
| **What's Next in **       | Upcoming major features from master                                      | Brief         |

### Key Feature Writing Pattern

Each Key Feature section must include:

1. **User scenario**: Why this feature matters — real operational pain point
2. **YAML example**: Practical, copy-pasteable configuration
3. **Limitation/Note**: Known constraints or caveats

Example structure:
```markdown
### Feature Name

[User scenario paragraph explaining the problem and solution]

```yaml
apiVersion: ...
kind: ...
spec:
  ...
```

[Explanation of what the YAML does]

**Limitation**: [Known constraints]

### What's Next Section

Preview upcoming features from the master branch:
- APIs planned for v1beta1 promotion
- New CRDs under development (include spec preview if available)
- Add **Note** that APIs/features may change before release

## Step 4: Write English Blog Post

### Filename and Frontmatter

**Kruise (core):**
```
blog/YYYY-MM-DD-release-X.Y.md
```
```yaml
---
slug: openkruise-X.Y
title: "<Product Name> vX.Y.Z: [Highlights]"
tags: [release]
---
```

**Sub-projects (Rollouts / Game / Agents):**
```
blog/YYYY-MM-DD-<product>-vX.Y.Z.md
```
```yaml
---
title: "<Product Name> vX.Y.Z: [Highlights]"
date: YYYY-MM-DD
tags: [release]
---
```

Product name mappings:
- `rollouts` → "Kruise Rollouts"
- `game` → "OpenKruiseGame"
- `agents` → "OpenKruise Agents"

**Date**: Use the actual release date. Confirm with the user before writing.

**Intro paragraph**: Brief overview linking to changelog, mentioning key themes.

**Content rules**:
- Include real-world operational rationale (e.g., "nodes GC images due to disk pressure in large model clusters")
- Use `apiVersion` in all YAML examples (required by CI struct-check)
- Keep YAML examples concise but realistic

## Step 5: Write Chinese Blog Post

Create `i18n/zh/docusaurus-plugin-content-blog/YYYY-MM-DD-release-X.Y.md` with:
- Identical structure to EN version
- Same heading/link/bold/inline-code counts (critical for CI)
- Translated YAML comments but same field names

## Step 6: Verify

### Consistency Check

Run the consistency checker:

```bash
python3 scripts/check_consistency.py blog/YYYY-MM-DD-release-X.Y.md \
  i18n/zh/docusaurus-plugin-content-blog/YYYY-MM-DD-release-X.Y.md
```

Expected output: `Match: True` with identical counts for headings, links, bold, and inline code.

If mismatched:
1. Find the discrepancy (often a stray backtick in one language)
2. Fix the file with the extra element
3. Re-run until matched

### Build Check

```bash
npm run build 2>&1 | tail -5
```

Must show `[SUCCESS]`. Pre-existing broken anchor warnings are acceptable.

## Step 7: Submit PR

```bash
git checkout -b docs/vX.Y.Z-release
git add blog/YYYY-MM-DD-release-X.Y.md \
  i18n/zh/docusaurus-plugin-content-blog/YYYY-MM-DD-release-X.Y.md \
  [other modified doc files...]
git commit -s -m "docs: add vX.Y.Z release documentation and blog post"
git push <fork> docs/vX.Y.Z-release
gh pr create --repo openkruise/openkruise.io --base master \
  --head <user>:docs/vX.Y.Z-release \
  --title "docs: add vX.Y.Z release documentation and blog post" \
  --body "..."
```

## Editorial Guidelines (from community feedback)

1. **Don't translate the changelog** — write user-centric content with scenarios, examples and values
2. **Key Features = detailed** — user scenarios, practical YAML, limitations
3. **Other features = brief** — one or two sentences only
4. **Include ALL changelog Key Features** — not just undocumented ones
5. **API changes goes in Upgrade Notice** — not as a standalone Key Feature
6. **What's Next section** — immediately before Get Involved, preview next version
7. **Use actual release date** — verify with the user before writing

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| EN/ZH inline code count mismatch | Watch for stray backticks in one language (e.g., `` `v1beta1` `` vs `v1beta1`) |
| Wrong blog filename date | Confirm release date with user; filename must match |
| API migration as Key Feature | Place in Upgrade Notice section |
| Missing apiVersion in YAML | Always include `apiVersion` — CI struct-check requires it |
| Stale changelog Key Features | Fetch fresh from GitHub, don't rely on memory |

## Reference Files

- Blog directory: `blog/`
- ZH blog directory: `i18n/zh/docusaurus-plugin-content-blog/`
- Upgrade guide (Kruise core): `docs/operator-manuals/upgrade.md`
- blog example: `blog/2023-04-18-release-1.4.md` (v1.4 format reference)
- Consistency script: `scripts/check_consistency.py`

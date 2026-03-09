---
name: sync-doc-translation
description: Synchronize document changes from one language to another. When the user edits documents in one language directory and wants to sync the changes to the corresponding directory in another language, use git commands to find the exact changes, then translate and apply them to the target directory. Use this skill when the user says "sync translation", "sync doc", "同步翻译", "同步文档", "翻译文档变更".
---

# Sync Doc Translation

## Workflow

### Step 1: Detect Changed Files

Use git commands to find changed files in the user-specified source directory.

**Always pipe git output through `| tail -xxx` to force terminal output and prevent git from opening vi/vim interactively.**

Check in this priority order:

```bash
# 1. Unstaged changes (highest priority)
git diff --name-only -- <source-dir> | tail -50

# 2. Staged changes
git diff --cached --name-only -- <source-dir> | tail -50

# 3. Latest commit (fallback if no uncommitted changes)
git diff HEAD~1 --name-only -- <source-dir> | tail -50
```

Use unstaged changes first, then staged, then fall back to the latest commit only when there are no uncommitted changes at all.

### Step 2: Get Diff Content

For each changed file, retrieve the detailed diff:

```bash
# Unstaged diff for a specific file
git diff -- <file-path> | tail -300

# Staged diff for a specific file
git diff --cached -- <file-path> | tail -300

# Latest commit diff for a specific file
git diff HEAD~1 -- <file-path> | tail -300
```

Analyze the diff to understand:
- What content was added
- What content was removed
- What content was modified

### Step 3: Locate Target File

Infer the target file path from the source file path and the target directory provided by the user. For example:
- Source file: `docs/user-manuals/cloneset.md`
- Target directory: `i18n/zh/docusaurus-plugin-content-docs/current/`
- Target file: `i18n/zh/docusaurus-plugin-content-docs/current/user-manuals/cloneset.md`

Read the target file with `read_file` to understand its current content and locate the corresponding sections.

### Step 4: Apply Translated Changes

Based on the diff, update the target file:
- **Added content**: translate and insert at the corresponding position
- **Removed content**: find the corresponding translated text and remove it
- **Modified content**: find the corresponding translated text and update it

Translation principles:
- Chinese → English: concise and professional, maintain technical documentation style
- English → Chinese: fluent and natural, follow Chinese expression conventions
- Keep all code blocks, commands, and YAML examples untranslated
- Preserve Markdown structure (heading levels, lists, code fences, etc.)
- Keep all link URLs unchanged; only translate the link text
- Keep proper nouns untranslated (e.g. CloneSet, SidecarSet, OpenKruise)

Hyperlink handling (CRITICAL):
- **Relative paths**: Must maintain the same relative path structure. For example, if source file `foo/doc.md` contains a link `[text](example/test.md)`, the target file `bar/doc.md` must also use `[text](example/test.md)` to point to `bar/example/test.md`
- **Absolute URLs**: Must be preserved exactly as-is (e.g., `https://github.com/example/test.md` remains unchanged)
- After translation, verify that all relative links in the target document point to existing files. If a target file does not exist for a relative link, report it to the user as a warning

### Step 5: Report Results

After processing all changed files, summarize:
- Which files were processed
- What changes were made to each file

## Notes

- If the target file does not exist, ask the user whether to create it
- If the target file path cannot be determined, ask the user to confirm
- Translate code comments only if the target language differs from the source

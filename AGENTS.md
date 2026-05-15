# OpenKruise Documentation Agent

This repository uses an AI-powered agent to evaluate and update documentation to ensure it stays current and accurate. 
This file outlines the rules, tools, and structure for the agent.

## Repository Structure

The OpenKruise website is built using Docusaurus 3. The documentation is split across several directories for different sub-projects:

- `docs/`: OpenKruise core documentation (English)
- `kruisegame/`: KruiseGame sub-project documentation
- `kruiseagents/`: KruiseAgents sub-project documentation
- `rollouts/`: Rollouts sub-project documentation
- `blog/`: Blog posts
- `i18n/zh/`: Chinese translations of all the above
- `versioned_docs/`: Frozen, older versions of documentation
- `static/`: Static assets (images, etc.)
- `src/`: Docusaurus source components and pages

## Rules for Updating Docs

When the AI agent modifies documentation, it must adhere to the following rules:

1. **Tone and Style**: Keep the tone technical, concise, and professional. Avoid marketing language.
2. **Frontmatter Format**: Preserve all existing Docusaurus frontmatter (e.g., title, sidebar_position, date, etc.). Do not remove or alter existing keys unless correcting a factual error in the version reference.
3. **Immutability of Versioned Docs**: **NEVER** modify any files within the `versioned_docs/` directory. These are historical snapshots.
4. **Translations**: The agent evaluates and updates English content. Chinese content in `i18n/zh/` should be updated separately only after the English updates are merged and confirmed. The agent should flag Chinese files that need manual translation.
5. **No Structural Changes**: Do not change documentation structure or sidebar configurations (`sidebars*.js`). Do not touch `docusaurus.config.js` or `package.json`.
6. **Age Limit**: Do not automatically rewrite content that has been modified within the last 3 months unless specifically instructed.

## Available Agent Tools

The agent relies on a suite of tools located in the `agent/tools/` directory:

- `fetch_upstream.py`: Fetches the latest documentation content from the upstream OpenKruise GitHub repositories.
- `check_staleness.py`: Scans the repository documentation, compares it to upstream sources (when applicable) and file age, and outputs a list of stale files with a staleness score (0-100).
- `evaluate_doc.py`: Uses an LLM to read a single document and scores it on Accuracy, Completeness, Clarity, and Link validity.
- `draft_update.py`: Uses an LLM to draft an updated version of a stale document to fix issues identified during evaluation.
- `open_pr.py`: Uses the GitHub API to open a Draft Pull Request containing the proposed documentation updates.

## Pull Request Guidelines

- **Always Draft**: All Pull Requests opened by the agent must be created as Draft PRs.
- **Labels**: PRs must include the `doc-agent` label.
- **Titles and Descriptions**: PRs should have a clear title (e.g., `[Doc Agent] Update {filename}`) and a description summarizing the changes made and the reasons for those changes based on the evaluation report.
- **Human Review**: A human maintainer must review the Draft PR, verify accuracy, and merge it. The agent will **never** auto-merge PRs.

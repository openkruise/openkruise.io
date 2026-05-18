## Summary

Doc Agent detected high-priority issues in demo fixtures. No documentation changes are applied automatically.

## Evidence
- tests/fixtures/demo_docs/broken.md: missing internal link
- tests/fixtures/demo_docs/broken.md: missing image asset
- tests/fixtures/demo_docs/broken.md: missing frontmatter key

## Artifacts
- agent/demo/demo_summary.md
- agent/demo/demo.patch
- agent/demo/demo.preview.html

## Safety
- Draft PR only
- No auto-merge
- No direct doc edits

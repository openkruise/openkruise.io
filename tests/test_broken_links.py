"""Tests for the internal broken-link checker.

All tests are filesystem-only (no network), so the suite stays fast.
"""

from checkers import broken_links


def _md(tmp_path, name, text):
    p = tmp_path / name
    p.write_text(text, encoding="utf-8")
    return p


def test_empty_href_is_flagged(tmp_path):
    _md(tmp_path, "a.md", "Please read the [docs]() carefully.\n")

    result = broken_links.run(str(tmp_path))

    assert len(result) == 1
    assert result[0]["issue_type"] == "empty_link"
    assert result[0]["link_text"] == "docs"
    assert result[0]["line"] == 1


def test_missing_local_file_is_flagged(tmp_path):
    _md(tmp_path, "a.md", "See [the guide](./missing.md) for details.\n")

    result = broken_links.run(str(tmp_path))

    assert [r["issue_type"] for r in result] == ["missing_file"]
    assert result[0]["link_text"] == "the guide"


def test_existing_local_file_is_ok(tmp_path):
    _md(tmp_path, "target.md", "# Target\n")
    _md(tmp_path, "a.md", "Link to [target](./target.md).\n")

    assert broken_links.run(str(tmp_path)) == []


def test_extensionless_link_resolves_to_md(tmp_path):
    # Docusaurus-style link without the .md suffix should still resolve.
    _md(tmp_path, "target.md", "# Target\n")
    _md(tmp_path, "a.md", "Link to [target](./target).\n")

    assert broken_links.run(str(tmp_path)) == []


def test_external_anchor_and_site_absolute_are_skipped(tmp_path):
    _md(
        tmp_path,
        "a.md",
        "[ext](https://example.com) "
        "[anchor](#section) "
        "[mail](mailto:dev@example.com) "
        "[abs](/kruise/installation)\n",
    )

    # None of these can be validated from the filesystem -> no findings.
    assert broken_links.run(str(tmp_path)) == []


def test_images_are_not_treated_as_links(tmp_path):
    # `![alt](src)` is an image, not a link, even if the target is missing.
    _md(tmp_path, "a.md", "![diagram](./missing.png)\n")

    assert broken_links.run(str(tmp_path)) == []


def test_line_numbers_are_reported(tmp_path):
    _md(tmp_path, "a.md", "line one\n\n[bad](./nope.md)\n")

    result = broken_links.run(str(tmp_path))

    assert result[0]["line"] == 3

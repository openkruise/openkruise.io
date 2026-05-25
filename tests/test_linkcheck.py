from pathlib import Path

from agent.linkcheck import check_links


def test_linkcheck_detects_missing_and_valid_links(tmp_path: Path):
    repo_root = tmp_path
    docs = repo_root / "docs"
    docs.mkdir(parents=True, exist_ok=True)

    current = docs / "current.md"
    other = docs / "other.md"

    other.write_text("# Exists\n\n## Section\n")

    content = (
        "# Top\n"
        "See [Missing](missing.md).\n"
        "See [Missing Anchor](other.md#nope).\n"
        "See [Valid](other.md#exists).\n"
        "See [Local](#top).\n"
        "![](img/missing.png)\n"
    )
    current.write_text(content)

    result = check_links(content, current, repo_root)

    assert "docs/missing.md" in result["missing_files"]
    assert "docs/other.md#nope" in result["missing_anchors"]
    assert "docs/img/missing.png" in result["missing_images"]
    assert "docs/other.md#exists" in result["valid_links"]
    assert "docs/current.md#top" in result["valid_links"]

    evidence = result["evidence"]
    assert {
        "type": "missing_internal_link",
        "source": "docs/current.md",
        "target": "docs/missing.md",
        "line": 2,
    } in evidence
    assert {
        "type": "missing_anchor",
        "source": "docs/current.md",
        "target": "docs/other.md#nope",
        "line": 3,
    } in evidence
    assert {
        "type": "missing_image",
        "source": "docs/current.md",
        "target": "docs/img/missing.png",
        "line": 6,
    } in evidence


def test_linkcheck_fixtures(tmp_path: Path):
    repo_root = tmp_path
    fixtures = Path(__file__).parent / "fixtures" / "linkcheck"
    target_dir = repo_root / "docs"
    target_dir.mkdir(parents=True, exist_ok=True)

    for name in ["malformed.md", "missing_image.md", "broken_anchor.md", "other.md"]:
        (target_dir / name).write_text((fixtures / name).read_text(encoding="utf-8"), encoding="utf-8")

    malformed = (target_dir / "malformed.md").read_text(encoding="utf-8")
    result = check_links(malformed, target_dir / "malformed.md", repo_root)
    assert result["missing_files"] == []

    missing_image = (target_dir / "missing_image.md").read_text(encoding="utf-8")
    result = check_links(missing_image, target_dir / "missing_image.md", repo_root)
    assert "docs/assets/missing.png" in result["missing_images"]

    broken_anchor = (target_dir / "broken_anchor.md").read_text(encoding="utf-8")
    result = check_links(broken_anchor, target_dir / "broken_anchor.md", repo_root)
    assert "docs/other.md#missing-anchor" in result["missing_anchors"]

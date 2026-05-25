from pathlib import Path

import frontmatter

from agent.frontmatter_check import validate_frontmatter


def test_frontmatter_all_present():
    result = validate_frontmatter({"title": "A", "sidebar_position": 1, "slug": "/a"})
    assert result["valid"] is True
    assert result["missing"] == []


def test_frontmatter_missing_title():
    result = validate_frontmatter({"sidebar_position": 1, "slug": "/a"})
    assert result["valid"] is False
    assert "title" in result["missing"]


def test_frontmatter_missing_sidebar_position():
    result = validate_frontmatter({"title": "A", "slug": "/a"})
    assert result["valid"] is False
    assert "sidebar_position" in result["missing"]


def test_frontmatter_invalid_fixture():
    fixture_path = Path(__file__).parent / "fixtures" / "frontmatter" / "invalid.md"
    post = frontmatter.load(fixture_path)
    result = validate_frontmatter(post.metadata)
    assert result["valid"] is False
    assert "title" in result["missing"]

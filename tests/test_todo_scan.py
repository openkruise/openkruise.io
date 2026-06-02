"""Tests for the TODO / FIXME / XXX scanner.

Casing policy under test (hybrid):
* TODO / FIXME — case-insensitive, normalised to upper-case in output.
* XXX          — upper-case only (lower-case ``xxx`` is ignored).
"""

from checkers import todo_scan


def _md(tmp_path, text, name="a.md"):
    p = tmp_path / name
    p.write_text(text, encoding="utf-8")
    return p


def test_detects_all_uppercase_markers(tmp_path):
    _md(tmp_path, "- TODO: wire cache\n- FIXME race here\n- XXX hack\n")

    markers = sorted(r["marker"] for r in todo_scan.run(str(tmp_path)))

    assert markers == ["FIXME", "TODO", "XXX"]


def test_todo_and_fixme_are_case_insensitive(tmp_path):
    _md(tmp_path, "a lowercase todo line\nthis is a fixme thing\nMixed FixMe\n")

    markers = sorted(r["marker"] for r in todo_scan.run(str(tmp_path)))

    # All normalised to canonical upper-case.
    assert markers == ["FIXME", "FIXME", "TODO"]


def test_xxx_is_case_sensitive(tmp_path):
    _md(tmp_path, "lowercase xxx should be ignored\nUPPER XXX is kept\n")

    result = todo_scan.run(str(tmp_path))

    assert [r["marker"] for r in result] == ["XXX"]
    assert result[0]["line"] == 2


def test_context_is_captured_and_trimmed(tmp_path):
    _md(tmp_path, "   TODO: implement the retry backoff   \n")

    result = todo_scan.run(str(tmp_path))

    assert result[0]["context"] == "TODO: implement the retry backoff"
    assert result[0]["line"] == 1
    assert result[0]["file"].endswith("a.md")


def test_code_fences_and_call_forms_are_skipped(tmp_path):
    _md(
        tmp_path,
        "```go\nctx := context.TODO()\n```\n"   # fenced -> skipped
        "bare := context.TODO()\n"               # `TODO(` call form -> skipped
        "real TODO: do this\n",                  # the only real marker
    )

    result = todo_scan.run(str(tmp_path))

    assert len(result) == 1
    assert result[0]["marker"] == "TODO"
    assert "real TODO" in result[0]["context"]


def test_multiple_markers_on_one_line(tmp_path):
    _md(tmp_path, "TODO and also FIXME on the same line\n")

    markers = sorted(r["marker"] for r in todo_scan.run(str(tmp_path)))

    assert markers == ["FIXME", "TODO"]

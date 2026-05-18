import json
import os.path
import re
import sys
from collections import Counter

import language_tool_python
import markdown
from bs4 import BeautifulSoup
from html2markdown import convert


result = False
pre_dict = set()
pre_dict_increment = set()

# Initialize LanguageTool
# https://github.com/jxmorris12/language_tool_python
en_tool = language_tool_python.LanguageTool(
    'en-US',
    config={
        'cacheSize': 100000,
        'pipelineCaching': True,
    }
)

# Load pre_dict.json
dict_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pre_dict.json')
try:
    if os.path.exists(dict_path):
        with open(dict_path, 'r', encoding='utf8') as f:
            pre_dict = set(json.loads(f.read()))
except Exception:
    pass


def log(*args) -> None:
    global result
    result = True
    print(' '.join([str(item) for item in args]))


def warn(*args) -> None:
    """Log a warning without triggering a CI failure."""
    print('[WARN]', ' '.join([str(item) for item in args]))


# pip install bs4 markdown html2markdown language-tool-python
def ignore_code_blocks(md_file):
    """Extract headings from a markdown file, ignoring code blocks."""
    try:
        with open(md_file, 'r', encoding='utf8') as file:
            content = file.read()
        # Use 'extra' extension to properly handle fenced code blocks (```...```)
        # Without this, lines like "## comment" inside code blocks are parsed as headings
        html = markdown.markdown(content, extensions=['extra'])
        # Remove code blocks and inline code
        filtered_html = re.sub(r'<pre>.*?</pre>', '', html, flags=re.DOTALL)
        filtered_html = re.sub(r'<code>.*?</code>', '', filtered_html, flags=re.DOTALL)

        soup = BeautifulSoup(filtered_html, 'html.parser')
        return [convert(str(item)) for item in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]
    except Exception as e:
        print(f"Error processing {md_file}: {e}")
        return []


# Check that the number of links in EN and ZH documents is consistent
def link(e_path, z_path, strict=True):
    if not os.path.exists(z_path):
        return
    reg = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+'
    with open(e_path, 'r', encoding='utf8') as f:
        en_links = re.findall(reg, f.read(), re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        zn_links = re.findall(reg, f.read(), re.S)
    if dict(Counter(en_links)) != dict(Counter(zn_links)):
        msg = (f"Inconsistent link count: {e_path} ({len(en_links)}) vs {z_path} ({len(zn_links)})")
        if strict:
            log(msg)
        else:
            warn(msg)


# Check that the number of highlighted strings (**bold**) is consistent
def highlight(e_path, z_path, strict=True):
    if not os.path.exists(z_path):
        return
    reg = r'\*\*.*?\*\*'
    with open(e_path, 'r', encoding='utf8') as f:
        en_emphasizes = re.findall(reg, f.read(), re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        cn_emphasizes = re.findall(reg, f.read(), re.S)
    if len(cn_emphasizes) != len(en_emphasizes):
        msg = (f"Inconsistent highlight count: {e_path} ({len(en_emphasizes)}) vs {z_path} ({len(cn_emphasizes)})")
        if strict:
            log(msg)
        else:
            warn(msg)


# Check that the number of titles in EN and ZH documents is consistent
def title_count(e_path, z_path, strict=True):
    if not os.path.exists(z_path):
        return

    en_titles = ignore_code_blocks(e_path)
    zn_titles = ignore_code_blocks(z_path)
    if len(en_titles) != len(zn_titles):
        msg = f"Inconsistent title count: {e_path} ({len(en_titles)}) vs {z_path} ({len(zn_titles)})"
        if strict:
            log(msg)
        else:
            warn(msg)


# Check that the number of inline code blocks is consistent
# NOTE: Disabled due to high false-positive rate (kept for reference)
# def inline_count(e_path, z_path, strict=True):
#     if not os.path.exists(z_path):
#         return
#     reg = r'`+.*?`+'
#     with open(e_path, 'r', encoding='utf8') as f:
#         en_ins = re.findall(reg, f.read(), re.S)
#     with open(z_path, 'r', encoding='utf8') as f:
#         zn_ins = re.findall(reg, f.read(), re.S)
#     zn_ins = list(filter(lambda x: not x.startswith('``'), zn_ins))
#     en_ins = list(filter(lambda x: not x.startswith('``'), en_ins))
#     if len(en_ins) != len(zn_ins):
#         msg = f"Inconsistent inline code count: {e_path} ({len(en_ins)}) vs {z_path} ({len(zn_ins)})"
#         if strict:
#             log(msg)
#         else:
#             warn(msg)


# Check English spelling
def lexical_analysis(e_path, _, strict=True):
    with open(e_path, 'r', encoding='utf8') as f:
        content = f.read()
        # Filter out code blocks to avoid checking technical terms
        content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        content = re.sub(r'`.*?`', '', content, flags=re.DOTALL)

        matches = en_tool.check(content)
        for item in filter(lambda x: x.category == 'TYPOS', matches):
            if item.matched_text not in pre_dict:
                pre_dict.add(item.matched_text)
                pre_dict_increment.add(item.matched_text)
                msg = f"Typo in {e_path}: {item.matched_text}"
                if strict:
                    log(msg)
                else:
                    warn(msg)


# Strict handlers: same checks the old script ran (title_count + lexical_analysis).
# These are used for versioned docs where issues are regressions.
strict_handlers = [title_count, lexical_analysis]

# Advisory handlers: all checks including link and highlight.
# These are used for newly covered doc sets where pre-existing issues
# should be surfaced as warnings, not CI failures.
advisory_handlers = [title_count, link, highlight, lexical_analysis]
# NOTE: inline_count is disabled due to high false-positive rate


def walk_and_check(en_base, zh_base, strict=True):
    """Walk an EN doc directory and run all checks against corresponding ZH files."""
    if not os.path.exists(en_base):
        return

    handlers = strict_handlers if strict else advisory_handlers

    for root, _, files in os.walk(en_base):
        for file in files:
            if not file.endswith('.md') and not file.endswith('.mdx'):
                continue

            en_path = os.path.join(root, file)
            rel_path = os.path.relpath(en_path, en_base)
            zh_path = os.path.join(zh_base, rel_path)

            for func in handlers:
                func(en_path, zh_path, strict=strict)


if __name__ == '__main__':
    project_path = os.path.abspath(".")

    # Strict checks: versioned docs were checked by the old script,
    # so any issues here are regressions and should fail CI.
    strict_doc_sets = []

    # Advisory checks: these doc sets are newly covered by this refactor.
    # Issues are reported as warnings but do NOT fail CI, since they are
    # pre-existing inconsistencies that should be fixed in separate PRs.
    advisory_doc_sets = [
        ("docs", "i18n/zh/docusaurus-plugin-content-docs/current"),
        ("rollouts", "i18n/zh/docusaurus-plugin-content-docs-rollouts/current"),
        ("kruisegame", "i18n/zh/docusaurus-plugin-content-docs-kruisegame/current"),
        ("kruiseagents", "i18n/zh/docusaurus-plugin-content-docs-kruiseagents/current"),
    ]

    # Versioned docs (strict — these were always checked by the old script)
    versioned_base = os.path.join(project_path, 'versioned_docs')
    if os.path.exists(versioned_base):
        for version_dir in os.listdir(versioned_base):
            if os.path.isdir(os.path.join(versioned_base, version_dir)):
                en_v_path = os.path.join(versioned_base, version_dir)
                zh_v_path = os.path.join(project_path, "i18n/zh/docusaurus-plugin-content-docs", version_dir)
                strict_doc_sets.append((en_v_path, zh_v_path))

    # Run strict checks (fail CI on issues)
    for en_path, zh_path in strict_doc_sets:
        en_full = en_path if os.path.isabs(en_path) else os.path.join(project_path, en_path)
        zh_full = zh_path if os.path.isabs(zh_path) else os.path.join(project_path, zh_path)
        print(f"Checking [strict]: {en_path} -> {zh_path}")
        walk_and_check(en_full, zh_full, strict=True)

    # Run advisory checks (warn only, don't fail CI)
    for en_path, zh_path in advisory_doc_sets:
        en_full = os.path.join(project_path, en_path)
        zh_full = os.path.join(project_path, zh_path)
        print(f"Checking [advisory]: {en_path} -> {zh_path}")
        walk_and_check(en_full, zh_full, strict=False)

    en_tool.close()

    # Save pre_dict.json if there are new words
    if pre_dict_increment:
        try:
            with open(dict_path, 'w', encoding='utf8') as f:
                f.write(json.dumps(sorted(list(pre_dict)), ensure_ascii=False, indent=4))
            print("Updated pre_dict.json with new abnormal words.")
        except Exception:
            pass

    if result:
        print("\nFound issues. Please check the logs above.")
        print("If these are false positives, add them to pre_dict.json.")
        sys.exit(1)
    else:
        print("\nAll checks passed!")

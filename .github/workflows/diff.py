import json
import os.path
import re
import sys
from collections import Counter

import language_tool_python
import markdown
from bs4 import BeautifulSoup
from html2markdown import convert

handler = {}
result = False
pre_dict = set()
pre_dict_increment = set()
en_tool = language_tool_python.LanguageTool(
    'en-US',
    config={
        'cacheSize': 100000,
        'pipelineCaching': True,
        'fasttextModel': 'en',
    }
)
#  https://github.com/jxmorris12/language_tool_python
try:
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pre_dict.json'), 'r', encoding='utf8') as f:
        pre_dict = set(json.loads(f.read()))
except Exception:
    pass
try:
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pre_dict.json'), 'w', encoding='utf8') as f:
        f.write(json.dumps(sorted(pre_dict), ensure_ascii=False, indent=4))
except Exception:
    pass


# pip install bs4 markdown html2markdown language-tool-python
def ignore_code_blocks(md_file):
    with open(md_file, 'r') as file:
        content = file.read()
    html = markdown.markdown(content)
    filtered_html = re.sub(r'<pre>.*?</pre>', '', html, flags=re.DOTALL)

    soup = BeautifulSoup(filtered_html, 'html.parser')
    return [convert(str(item)) for item in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]


def log(*args) -> None:
    global result
    result = True
    print(' '.join([str(item) for item in args]))


# Check that the number of highlighted strings is consistent across all English and Chinese documents
def highlight(e_path: str, z_path: str) -> None:
    reg = r'\*\*.*?\*\*'
    with open(e_path, 'r', encoding='utf8') as f:
        data = f.read()
        en_emphasizes = re.findall(reg, data, re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        data = f.read()
        cn_emphasizes = re.findall(reg, data, re.S)
    if len(cn_emphasizes) != len(en_emphasizes):
        log("The number of highlighted strings in the Chinese and English documents is inconsistent. "
            "The details of file paths, quantities and contents are as follows. 🔽🔽🔽")
        log("file://" + e_path)
        log(len(en_emphasizes), json.dumps(dict(Counter(en_emphasizes)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(cn_emphasizes), json.dumps(dict(Counter(cn_emphasizes)), indent=4, ensure_ascii=False))


#  Check that the number of links in all English and Chinese documents is consistent
def link(e_path: str, z_path: str) -> None:
    reg = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+'
    with open(e_path, 'r', encoding='utf8') as f:
        data = f.read()
        en_links = re.findall(reg, data, re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        data = f.read()
        zn_links = re.findall(reg, data, re.S)
    if dict(Counter(en_links)) != dict(Counter(zn_links)):
        log("The number of links in the Chinese and English documents is inconsistent. "
            "The details of file paths, quantities and contents are as follows. 🔽🔽🔽")
        log("file://" + e_path)
        log(len(en_links), json.dumps(dict(Counter(en_links)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(zn_links), json.dumps(dict(Counter(zn_links)), indent=4, ensure_ascii=False))


#  Check that the number of titles in all English and Chinese documents is consistent
def title_count(e_path, z_path):
    en_titles = ignore_code_blocks(e_path)
    zn_titles = ignore_code_blocks(z_path)
    if len(en_titles) != len(zn_titles):
        log("The number of titles in the Chinese and English documents is inconsistent. "
            "The details of file paths, quantities and contents are as follows. 🔽🔽🔽")
        log("file://" + e_path)
        log(len(en_titles), json.dumps(dict(Counter(en_titles)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(zn_titles), json.dumps(dict(Counter(zn_titles)), indent=4, ensure_ascii=False))


#  Check that the number of inline code in all English and Chinese documents is consistent
def inline_count(e_path, z_path):
    reg = r'`+.*?`+'
    with open(e_path, 'r', encoding='utf8') as f:
        data = f.read()
        en_ins = re.findall(reg, data, re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        data = f.read()
        zn_ins = re.findall(reg, data, re.S)
    zn_ins = list(filter(lambda x: not x.startswith('``'), zn_ins))
    en_ins = list(filter(lambda x: not x.startswith('``'), en_ins))

    if len(en_ins) != len(zn_ins):
        log("The number of code block in the Chinese and English documents is inconsistent. "
            "The details of file paths, quantities and contents are as follows. 🔽🔽🔽")
        log("file://" + e_path)
        log(len(en_ins), json.dumps(list(set(en_ins) - set(zn_ins)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(zn_ins), json.dumps(list(set(zn_ins) - set(en_ins)), indent=4, ensure_ascii=False))
        print('\n')


# Check the word for correctness
def lexical_analysis(e_path, _):
    with open(e_path, 'r', encoding='utf8') as f:
        for item in list(filter(lambda x: x.category == 'TYPOS', en_tool.check(f.read()))):
            if item.matchedText not in pre_dict:
                pre_dict.add(item.matchedText)
                pre_dict_increment.add(item.matchedText)
                log(item.matchedText)


handler['title_count'] = title_count
handler['lexical_analysis'] = lexical_analysis
# handler['inline_count'] = inline_count  # Presence of false positives

if __name__ == '__main__':
    project_path = os.path.abspath(".")
    multi_version_dirs = os.path.join(project_path, 'versioned_docs')
    _, versions, files = list(os.walk(multi_version_dirs))[0]
    for version in versions:
        for current_dir, _, files in os.walk(multi_version_dirs, version):
            for file in files:
                en_path = os.path.join(current_dir, file)
                zn_path = os.path.join(
                    project_path,
                    "i18n/zh/docusaurus-plugin-content-docs",
                    os.path.relpath(en_path, multi_version_dirs),
                )
                for name, func in handler.items():
                    func(en_path, zn_path)

    if result:
        print("Please add these abnormal words to pre_dict.json :",json.dumps(sorted(list(pre_dict_increment))))
        sys.exit(1)

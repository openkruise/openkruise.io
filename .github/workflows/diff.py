import json
import markdown
import os.path
import re
import sys
from bs4 import BeautifulSoup
from collections import Counter
from html2markdown import convert

handler = {}
result = False


# pip install bs4 markdown html2markdown

def ignore_code_blocks(md_file):
    with open(md_file, 'r') as file:
        content = file.read()
    html = markdown.markdown(content)
    filtered_html = re.sub(r'<pre>.*?</pre>', '', html, flags=re.DOTALL)

    soup = BeautifulSoup(filtered_html, 'html.parser')
    return [convert(str(item)) for item in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]


def log(*args):
    global result
    result = True
    print(' '.join([str(item) for item in args]))


# Check that the number of highlighted strings is consistent across all English and Chinese documents
def highlight(e_path, z_path):
    reg = r'\*\*.*?\*\*'
    with open(e_path, 'r', encoding='utf8') as f:
        data = f.read()
        en_emphasizes = re.findall(reg, data, re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        data = f.read()
        cn_emphasizes = re.findall(reg, data, re.S)
    if len(cn_emphasizes) != len(en_emphasizes):
        log("file://" + e_path)
        log(len(en_emphasizes), json.dumps(dict(Counter(en_emphasizes)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(cn_emphasizes), json.dumps(dict(Counter(cn_emphasizes)), indent=4, ensure_ascii=False))


#  Check that the number of links in all English and Chinese documents is consistent
def link(e_path, z_path):
    reg = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+'
    with open(e_path, 'r', encoding='utf8') as f:
        data = f.read()
        en_links = re.findall(reg, data, re.S)
    with open(z_path, 'r', encoding='utf8') as f:
        data = f.read()
        zn_links = re.findall(reg, data, re.S)
    if dict(Counter(en_links)) != dict(Counter(zn_links)):
        log("file://" + e_path)
        log(len(en_links), json.dumps(dict(Counter(en_links)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(zn_links), json.dumps(dict(Counter(zn_links)), indent=4, ensure_ascii=False))
        log('\n')


#  Check that the number of titles in all English and Chinese documents is consistent
def title_count(e_path, z_path):
    en_titles = ignore_code_blocks(e_path)
    zn_titles = ignore_code_blocks(z_path)
    if len(en_titles) != len(zn_titles):
        log("file://" + e_path)
        log(len(en_titles), json.dumps(dict(Counter(en_titles)), indent=4, ensure_ascii=False))
        log("file://" + z_path)
        log(len(zn_titles), json.dumps(dict(Counter(zn_titles)), indent=4, ensure_ascii=False))
        log('\n')


handler['highlight'] = highlight
handler['link'] = link
handler['title_count'] = title_count

if __name__ == '__main__':
    project_path = "."
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
        print(result)
        sys.exit(1)

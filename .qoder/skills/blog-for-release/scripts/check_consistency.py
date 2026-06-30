#!/usr/bin/env python3
"""Check EN/ZH blog post consistency for CI typo-check compliance.

Compares heading counts, link counts, bold text counts, and inline code counts
between English and Chinese versions of a blog post.

Usage:
    python3 check_consistency.py <en_file> <zh_file>

Exit codes:
    0 = Match (all counts identical)
    1 = Mismatch (at least one count differs)
    2 = File not found
"""
import re
import sys


def analyze(path):
    with open(path, "r") as f:
        content = f.read()

    # Remove fenced code blocks (``` ... ```)
    content_no_code = re.sub(r"```[\s\S]*?```", "", content)

    headings = len(re.findall(r"^#{1,6}\s", content_no_code, re.MULTILINE))
    links = len(re.findall(r"\[([^\]]*)\]\(([^)]+)\)", content_no_code))
    bold = len(re.findall(r"\*\*[^*]+\*\*", content_no_code))
    inline = len(re.findall(r"`[^`]+`", content_no_code))

    return (headings, links, bold, inline)


def main():
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <en_file> <zh_file>", file=sys.stderr)
        sys.exit(2)

    en_path, zh_path = sys.argv[1], sys.argv[2]

    try:
        en = analyze(en_path)
    except FileNotFoundError:
        print(f"EN file not found: {en_path}", file=sys.stderr)
        sys.exit(2)

    try:
        zh = analyze(zh_path)
    except FileNotFoundError:
        print(f"ZH file not found: {zh_path}", file=sys.stderr)
        sys.exit(2)

    print(
        f"EN: headings={en[0]}, links={en[1]}, bold={en[2]}, inline={en[3]}"
    )
    print(
        f"ZH: headings={zh[0]}, links={zh[1]}, bold={zh[2]}, inline={zh[3]}"
    )

    if en == zh:
        print("Match: True")
        sys.exit(0)
    else:
        print("Match: False")
        # Show which counts differ
        labels = ["headings", "links", "bold", "inline"]
        for i, label in enumerate(labels):
            if en[i] != zh[i]:
                print(f"  MISMATCH: {label} EN={en[i]} ZH={zh[i]} (diff={abs(en[i] - zh[i])})")
        sys.exit(1)


if __name__ == "__main__":
    main()

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from llm_client import generate_completion

def draft_update(file_path, evaluation_json):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    prompt = f"""You are a technical writer for OpenKruise, a Kubernetes workload 
management project. Update this documentation to fix the issues 
identified. Preserve the existing structure and frontmatter. 
Only change what is outdated or incomplete. Output the full 
updated markdown.

Issues identified:
{evaluation_json}

Original Document content:
{content}
"""
    try:
        text = generate_completion(prompt)
        if text.startswith('```markdown'):
            text = text[11:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text.strip() + '\n')
            
        return text.strip()
    except Exception as e:
        print(f"Error drafting update: {e}", file=sys.stderr)
        return content

if __name__ == "__main__":
    if len(sys.argv) > 2:
        draft_update(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python draft_update.py <file_path> <evaluation_json>")

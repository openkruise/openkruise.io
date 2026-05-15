import os
import json
import sys
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from llm_client import generate_completion

def evaluate_doc(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    prompt = f"""You are a technical documentation evaluator. Score this doc on:
1. Accuracy (are version numbers current?)
2. Completeness (are all sections present?)
3. Clarity (is it easy to follow?)
4. Links (flag any that look broken or outdated)

Give a score 0-10 for each and a brief reason. Return the result strictly as a JSON object with this structure:
{{
  "Accuracy": {{"score": 8, "reason": "..."}},
  "Completeness": {{"score": 9, "reason": "..."}},
  "Clarity": {{"score": 7, "reason": "..."}},
  "Links": {{"score": 10, "reason": "..."}}
}}

Document content:
{content[:5000]}
"""
    try:
        text = generate_completion(prompt)
        match = re.search(r'```(?:json)?(.*?)```', text, re.DOTALL)
        if match:
            text = match.group(1).strip()
        result = json.loads(text)
        return result
    except Exception as e:
        print(f"Error calling LLM: {e}", file=sys.stderr)
        # Fallback mock for testing without keys
        return {
            "Accuracy": {"score": 5, "reason": f"Mock evaluation due to error: {e}"},
            "Completeness": {"score": 6, "reason": "Mock evaluation."},
            "Clarity": {"score": 7, "reason": "Mock evaluation."},
            "Links": {"score": 8, "reason": "Mock evaluation."}
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(json.dumps(evaluate_doc(sys.argv[1]), indent=2))
    else:
        print("Please provide a file path.")

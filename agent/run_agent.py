import os
import json
import datetime
from tools.check_staleness import check_staleness
from tools.evaluate_doc import evaluate_doc
from tools.draft_update import draft_update
from tools.open_pr import open_pr

def main():
    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    print("Checking staleness...")
    stale_files = check_staleness(repo_path)
    
    stale_files.sort(key=lambda x: x["score"], reverse=True)
    
    top_priorities = ""
    detailed_scores = ""
    actions_taken = ""
    
    for i, item in enumerate(stale_files[:5]):
        file_path = os.path.join(repo_path, item["file"])
        print(f"Evaluating {item['file']} (score: {item['score']})...")
        
        evaluation = evaluate_doc(file_path)
        if not evaluation:
            continue
            
        total_eval_score = sum(eval_item.get("score", 0) for eval_item in evaluation.values())
        avg_eval_score = total_eval_score / len(evaluation) if evaluation else 0
        
        detailed_scores += f"### {item['file']}\n"
        detailed_scores += f"- **Average Score**: {avg_eval_score:.1f}/10\n"
        for category, details in evaluation.items():
            detailed_scores += f"- **{category}**: {details.get('score')}/10 - {details.get('reason')}\n"
        detailed_scores += "\n"
        
        top_priorities += f"- `{item['file']}` (Staleness: {item['score']}, Eval: {avg_eval_score:.1f}/10)\n"
        
        if avg_eval_score < 6.0:
            print(f"Drafting update for {item['file']}...")
            draft_update(file_path, json.dumps(evaluation))
            actions_taken += f"- Drafted update for `{item['file']}`\n"
            
            print(f"Opening PR for {item['file']}...")
            pr_url = open_pr(file_path, json.dumps(evaluation, indent=2))
            if pr_url:
                actions_taken += f"  - Opened PR: {pr_url}\n"
        else:
            actions_taken += f"- `{item['file']}` scored >= 6.0 ({avg_eval_score:.1f}), no update needed.\n"

    report_template_path = os.path.join(os.path.dirname(__file__), "report_template.md")
    with open(report_template_path, "r", encoding="utf-8") as f:
        template = f.read()
        
    report = template.format(
        date=datetime.datetime.now().strftime("%Y-%m-%d"),
        total_files=len(stale_files),
        top_priorities=top_priorities or "None",
        detailed_scores=detailed_scores or "None",
        actions_taken=actions_taken or "None"
    )
    
    print("\n" + "="*50 + "\n")
    print(report)
    
    with open(os.path.join(os.path.dirname(__file__), "sample_report.md"), "w", encoding="utf-8") as f:
        f.write(report)
        
if __name__ == "__main__":
    main()

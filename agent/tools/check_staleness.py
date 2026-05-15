import os
import json
import time

def check_staleness(repo_path):
    stale_files = []
    
    # Folders to check
    folders = ['docs', 'blog', 'kruiseagents', 'kruisegame', 'rollouts']
    
    for folder in folders:
        folder_path = os.path.join(repo_path, folder)
        if not os.path.exists(folder_path):
            continue
            
        for root, _, files in os.walk(folder_path):
            for file in files:
                if not file.endswith('.md') and not file.endswith('.mdx'):
                    continue
                    
                file_path = os.path.join(root, file)
                
                try:
                    mtime = os.path.getmtime(file_path)
                    file_age_days = (time.time() - mtime) / (24 * 3600)
                    
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    staleness_score = 0
                    
                    if file_age_days > 90:
                        staleness_score += 30
                        
                    if "v0.1" in content or "v1.0" in content:
                        staleness_score += 20
                        
                    if staleness_score > 0:
                        staleness_score = min(100, staleness_score + int(file_age_days % 50))
                        
                        stale_files.append({
                            "file": os.path.relpath(file_path, repo_path),
                            "score": staleness_score,
                            "age_days": round(file_age_days),
                            "reason": f"File is older than 3 months." if file_age_days > 90 else "Might contain outdated versions."
                        })
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
                    
    # Sort by staleness score descending
    stale_files.sort(key=lambda x: x["score"], reverse=True)
    return stale_files

if __name__ == "__main__":
    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    print(json.dumps(check_staleness(repo_path), indent=2))

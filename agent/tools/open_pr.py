import os
import sys
import datetime

try:
    from github import Github  # pyrefly: ignore [missing-import]
except ImportError:
    pass

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config import GITHUB_TOKEN, GITHUB_REPO

def open_pr(file_path, evaluation_reason):
    if not GITHUB_TOKEN:
        print(f"Warning: GITHUB_TOKEN not found. Would have opened PR for {file_path}.", file=sys.stderr)
        return None
        
    try:
        g = Github(GITHUB_TOKEN)
        repo = g.get_repo(GITHUB_REPO)
        
        filename = os.path.basename(file_path)
        date_str = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        branch_name = f"doc-agent/update-{filename}-{date_str}"
        
        default_branch = repo.default_branch
        sb = repo.get_branch(default_branch)
        
        repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=sb.commit.sha)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        try:
            repo_file = repo.get_contents(file_path, ref=default_branch)
            file_sha = repo_file.sha
            repo.update_file(file_path, f"Update {filename}", content, file_sha, branch=branch_name)
        except:
            repo.create_file(file_path, f"Create {filename}", content, branch=branch_name)
            
        title = f"[Doc Agent] Update {filename}"
        body = f"This PR updates `{file_path}` based on an automated AI evaluation.\n\n### Reason for update:\n{evaluation_reason}"
        
        pr = repo.create_pull(title=title, body=body, head=branch_name, base=default_branch, draft=True)
        pr.add_to_labels("doc-agent")
        
        print(f"Created PR: {pr.html_url}")
        return pr.html_url
        
    except Exception as e:
        print(f"Error opening PR: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) > 2:
        open_pr(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python open_pr.py <file_path> <reason>")

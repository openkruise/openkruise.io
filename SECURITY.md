Security

Guarantees
- no auto-merge
- draft PRs only when explicitly enabled
- evaluation produces artifacts only
- dry-run defaults for PR creation

Least-privilege tokens
- use short-lived tokens with repo:read/write only when creating PRs
- do not grant org admin scopes

Offline safety model
- evaluation is local only
- no network access during tests
- external links are ignored

Responsible disclosure
- report security issues privately to maintainers
- include reproduction steps and impact assessment

# Kruise Agents documentation

- Verify Sandbox API fields, lifecycle states, commands, and configuration keys against Kruise Agents.
- Keep architecture, manuals, best practices, user cases, and developer guides in this plugin even when they reference other OpenKruise products.
- When E2B-related APIs change (added, removed, renamed, or a shift in support/notes), check the E2B Compatibility matrix in `architecture.md` and update the English and Chinese tables together.

## AI-executable documentation standard

These pages are read by end users and their AI assistants (ChatGPT, Claude, Cursor, Tongyi, ...), which execute the steps directly. When writing or editing any page in this plugin, keep it executable by an AI that has only the page content as context:

- **Resolve every placeholder.** Each `<placeholder>` must come with a table or note explaining what it is and how to derive a value (generation command, query command such as `kubectl get ingressclass`, or a decision table). Never assume the reader knows the value.
- **State prerequisites as checkable commands.** Give version floors plus the command that verifies them (`kubectl version`, `helm version`, `python3 --version`); link official install docs for missing tools.
- **Close every step with verification.** After install/upgrade/apply steps, provide `kubectl wait`/`kubectl get` commands and the expected output, so failures surface at the step that caused them.
- **Make commands idempotent or say they are not.** Prefer `kubectl create ns ... --dry-run=client -o yaml | kubectl apply -f -` and `helm upgrade --install`; repeat all `--set` values on `helm upgrade` (values do not carry over) and mention `--reuse-values`.
- **Use real resource names.** Resource/Service names must match what the default Helm release actually produces (verify against chart templates: `agents-sandbox-manager`, `sandbox-gateway`, pod labels). Add a note whenever a name depends on the release name.
- **Pin SDK versions and flag network reachability.** For SDK installs, pin the versions used by the daily E2E regression (`e2b==2.8.1`, `e2b-code-interpreter==2.4.1`) or state the minimum version a feature requires; mark which commands need Docker Hub, GitHub, PyPI, or the Alibaba Cloud mirrors.
- **Keep a no-domain quick path.** Deployment and tutorial pages must include a verification path that works without DNS or TLS (for example `kubectl port-forward` + `E2B_DOMAIN=localhost`).
- **Cross-link the full journey.** End each page with the next action (deploy a SandboxSet template, pick an SDK integration method, manage API keys) instead of stopping at "installed".
- Apply all changes to both the English source and its Chinese mirror in the same edit, keeping heading structure and anchors aligned.

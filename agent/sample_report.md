# OpenKruise Doc Agent Evaluation Report

**Run Date**: 2026-05-11
**Total Files Evaluated**: 23

## Top Priorities for Update

- `docs/installation.md` (Staleness: 20, Eval: 7.5/10)
- `docs/cli-tool/kustomize-plugin.md` (Staleness: 20, Eval: 6.5/10)
- `docs/developer-manuals/go-client.md` (Staleness: 20, Eval: 7.5/10)
- `docs/user-manuals/advancedstatefulset.md` (Staleness: 20, Eval: 7.0/10)
- `docs/user-manuals/workloadspread.md` (Staleness: 20, Eval: 5.2/10)


## Detailed Evaluation Scores

### docs/installation.md
- **Average Score**: 7.5/10
- **Accuracy**: 6/10 - The version matrix is outdated, as OpenKruise releases have progressed beyond 1.9.0. Referencing 1.32 as a high-end Kubernetes target is also dated given current Kubernetes releases.
- **Completeness**: 7/10 - The document cuts off mid-table in the 'Options' section. It lacks critical configuration examples, uninstallation steps, and verification procedures.
- **Clarity**: 8/10 - The content is well-structured and logical. Use of code blocks and tables makes the installation process easy to follow, though some sentences are slightly wordy.
- **Links**: 9/10 - Most links are functional and correctly directed. However, the Helm repository URL structure for OpenKruise has changed in more recent documentation (moving to artifacts.openkruise.io), which may lead to deprecation warnings for users.

### docs/cli-tool/kustomize-plugin.md
- **Average Score**: 6.5/10
- **Accuracy**: 6/10 - The document references Kustomize v4.3.0 as a baseline, which is significantly outdated; modern Kustomize versions are well beyond this, and the plugin ecosystem has evolved.
- **Completeness**: 5/10 - The document ends abruptly in the middle of a code block in the final section, leaving the 'targets' explanation and the conclusion unfinished.
- **Clarity**: 7/10 - The explanation of the KRM function mechanism is helpful, but the tone is inconsistent and some terminology is slightly clunky, likely due to translation.
- **Links**: 8/10 - Most links are functional. However, the link to the source code (cmd/resourcedistributiongenerator) points to a non-existent path in the current repo structure, making it a dead link.

### docs/developer-manuals/go-client.md
- **Average Score**: 7.5/10
- **Accuracy**: 6/10 - The version compatibility table is outdated (referencing K8s 1.18), and the example suggests v1.8.0 while OpenKruise is currently on v1.x, making the table confusing for users on modern K8s versions.
- **Completeness**: 7/10 - Covers the essential setup, but the code snippet for 'Update' under the controller-runtime section is cut off, leaving the documentation incomplete.
- **Clarity**: 8/10 - The structure is logical and easy to navigate. Distinguishing between 'direct' and 'controller-runtime' usage is very helpful for developers.
- **Links**: 9/10 - All links provided correctly point to the respective GitHub repositories and documentation sites.

### docs/user-manuals/advancedstatefulset.md
- **Average Score**: 7.0/10
- **Accuracy**: 6/10 - The document references Kruise v0.7.0 and v1.7.0, but mentions v1beta1 API compatibility without verifying current stability. It is missing information on newer v1beta1/v1 revisions often found in modern Kruise releases.
- **Completeness**: 5/10 - The document ends abruptly in the middle of 'Story 3' (the sentence is cut off). It lacks a conclusion, full API specification, or links to troubleshooting/FAQ sections.
- **Clarity**: 7/10 - The explanation of ordinal migration and the YAML examples are clear and helpful. However, the abrupt ending significantly degrades the overall professional quality.
- **Links**: 10/10 - All provided external links (Kubernetes documentation) are valid and point to the correct, relevant resources.

### docs/user-manuals/workloadspread.md
- **Average Score**: 5.2/10
- **Accuracy**: 4/10 - The documentation references 'Kruise v0.10.0' as the current state, which is significantly outdated given that OpenKruise is currently on version 1.7.x+. References to 1.3.0 and 1.5.0 features are accurate but presented in a way that suggests the feature state is still pegged to v0.10.0.
- **Completeness**: 6/10 - The document provides a good overview of functionality but cuts off mid-sentence under the 'patch pod container resources' section. It lacks a 'Prerequisites', 'Installation', or 'Troubleshooting' section typically required for feature docs.
- **Clarity**: 6/10 - The explanation of concepts (subsets, adaptive/fixed) is clear. However, there are grammatical errors ('Each WorkloadSpread defines multi-domain called subset'), and the YAML demo includes pseudo-syntax like 'apiVersion: apps/v1 | apps.kruise.io/v1alpha1' which is not valid Kubernetes configuration.
- **Links**: 5/10 - The link to the source code includes a specific commit hash (f46097d...), which is prone to becoming outdated or broken if the repository structure changes. It is better to use a branch-based permalink or a generic link to the file.



## Actions Taken

- `docs/installation.md` scored >= 6.0 (7.5), no update needed.
- `docs/cli-tool/kustomize-plugin.md` scored >= 6.0 (6.5), no update needed.
- `docs/developer-manuals/go-client.md` scored >= 6.0 (7.5), no update needed.
- `docs/user-manuals/advancedstatefulset.md` scored >= 6.0 (7.0), no update needed.
- Drafted update for `docs/user-manuals/workloadspread.md`


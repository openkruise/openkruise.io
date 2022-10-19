/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'introduction',
        'installation',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'core-concepts/architecture',
        'core-concepts/inplace-update'
      ],
    },
    {
      type: 'category',
      label: 'User Manuals',
      collapsed: true,
      items: [
        {
          'Typical Workloads': [
            'user-manuals/cloneset',
            'user-manuals/advancedstatefulset',
            'user-manuals/advanceddaemonset',
          ],
          'Job Workloads': [
            'user-manuals/broadcastjob',
            'user-manuals/advancedcronjob',
          ],
          'Sidecar container Management': [
            'user-manuals/sidecarset',
          ],
          'Multi-domain Management': [
            'user-manuals/workloadspread',
            'user-manuals/uniteddeployment',
          ],
          'Enhanced Operations': [
            'user-manuals/containerrecreaterequest',
            'user-manuals/imagepulljob',
            'user-manuals/containerlaunchpriority',
            "user-manuals/resourcedistribution",
            "user-manuals/persistentpodstate",
            "user-manuals/podprobemarker",
          ],
          "Application Protection": [
            'user-manuals/deletionprotection',
            'user-manuals/podunavailablebudget',
          ]
        },
      ],
    },
    {
      type: 'category',
      label: 'Best Practices',
      collapsed: true,
      items: [
        'best-practices/hpa-configuration',
        'best-practices/ci-pipeline-image-predownload',
        'best-practices/gitops-with-kruise',
        'best-practices/log-container-sidecarset',
        'best-practices/cloneset-lifecycle',
        'best-practices/elastic-deployment',
        'best-practices/acronjob+broadcastjob',
      ],
    },
    {
      type: 'category',
      label: 'Developer Manuals',
      collapsed: true,
      items: [
        'developer-manuals/go-client',
        'developer-manuals/java-client',
        'developer-manuals/other-languages',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        {
          'CLI tools': [
            "cli-tool/kubectl-plugin",
            "cli-tool/kustomize-plugin",
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'faq'
    },
  ],
};

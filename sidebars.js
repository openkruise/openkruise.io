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
        'core-concepts/architecture'
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
      type: 'doc',
      id: 'faq'
    },
  ],
};

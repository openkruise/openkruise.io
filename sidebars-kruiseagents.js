/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
    kruiseagents: [
        {
            type: 'category',
            label: 'Getting Started',
            collapsed: false,
            items: [
                'introduction',
                'installation',
                'core-concept',
                'architecture'
            ],
        },
        {
            type: 'category',
            label: 'User Manuals',
            collapsed: false,
            items: [
                'user-manuals/warmpool-management',
                'user-manuals/sandbox-claim',
                'user-manuals/runtime-injection'
            ],
        },
        {
            type: 'category',
            label: 'Best Practices',
            collapsed: false,
            items: [
                'best-practices/running-e2b-for-code-interpreter',
                'best-practices/running-e2b-for-desktop',
                'best-practices/use-self-signed-cert',
                'best-practices/cert-manager',
            ],
        },
        {
            type: 'category',
            label: 'Developer Manuals',
            collapsed: true,
            items: [
                'developer-manuals/contribution',
                'developer-manuals/e2b-client',
                {
                   'K8S SDK': [
                     "developer-manuals/go-client",
                     "developer-manuals/python-client",
                     "developer-manuals/java-client",
                   ],
                },
                'developer-manuals/faq',
            ],
        },
  ],
};

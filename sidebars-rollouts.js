/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
    rollouts: [
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
            label: 'User Manuals',
            collapsed: false,
            items: [
                'user-manuals/api-specifications',
                'user-manuals/basic-usage',
                {
                    'Release Strategies': [
                        'user-manuals/strategy-canary-update',
                        'user-manuals/strategy-multi-batch-update',
                        'user-manuals/strategy-ab-testing'
                    ]
                }
            ],
        },
        {
            type: 'category',
            label: 'Developer manuals',
            collapsed: false,
            items: [
                'developer-manuals/custom-network-provider'
            ],
        },
        {
            type: 'category',
            label: 'Best Practices',
            collapsed: false,
            items: [
                'best-practices/traffic-routing-istio-api'
            ],
        },
  ],
};

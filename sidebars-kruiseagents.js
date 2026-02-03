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
                'design-concept'
            ],
        },
        {
            type: 'category',
            label: 'User Manuals',
            collapsed: false,
            items: [
                'user-manuals/warmpool-management',
                'user-manuals/sandbox-claim'
            ],
        },
        {
            type: 'category',
            label: 'Best Practices',
            collapsed: false,
            items: [
                'best-practices/running-e2b-for-code-interpreter',
                'best-practices/running-e2b-for-desktop'
            ],
        },
        {
            type: 'category',
            label: 'Developer Manuals',
            collapsed: false,
            items: [
                'developer-manuals/contribution',
                'developer-manuals/faq',
                'developer-manuals/e2b-client',
                'developer-manuals/go-client',
                'developer-manuals/python-client',
            ],
        ,
  ],
};

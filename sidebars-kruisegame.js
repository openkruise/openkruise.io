/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
    kruisegame: [
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
                'user-manuals/deploy-gameservers',
                'user-manuals/hot-update',
                'user-manuals/update-strategy',
                'user-manuals/gameservers-scale',
                'user-manuals/container-startup-sequence-control',
                'user-manuals/service-qualities',
                'user-manuals/network',
                'user-manuals/gameserver-monitor',
                'user-manuals/crd-field-description',
            ],
        },
        {
            type: 'category',
            label: 'Developer Manuals',
            collapsed: false,
            items: [
                'developer-manuals/contribution',
                'developer-manuals/faq'
            ],
        },
  ],
};

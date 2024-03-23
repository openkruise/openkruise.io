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
                'user-manuals/game-matchmaking',
                'user-manuals/game-dashboard',
                'user-manuals/crd-field-description',
            ],
        },
        {
            type: 'category',
            label: 'Best Practices',
            collapsed: false,
            items: [
                'best-practices/session-based-game',
                'best-practices/pve-game',
                'best-practices/shared-mem'
            ],
        },
        {
            type: 'category',
            label: 'Developer Manuals',
            collapsed: false,
            items: [
                'developer-manuals/contribution',
                'developer-manuals/faq',
                'developer-manuals/go-client'
            ],
        },
        {
            type: 'category',
            label: 'Blog & Video',
            collapsed: false,
            items: [
                'blog-video/kubecon-shangyou-20230926',
                'blog-video/meetup-guangzhou-20231125',
                'blog-video/guanying-20231129',
                'blog-video/higress'
            ],
        }
  ],
};

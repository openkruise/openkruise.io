const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'OpenKruise',
  tagline: 'Automate application management on Kubernetes.',
  url: 'https://openkruise.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/openkruise.ico',
  organizationName: 'openkruise',
  projectName: 'openkruise.io',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:  `https://github.com/openkruise/openkruise.io/tree/master`,
          editUrl: function ({
            locale,
            docPath,
          }) {
            return `https://github.com/openkruise/openkruise.io/edit/master/docs/${docPath}`;
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
          lastVersion: 'v0.10.0',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/openkruise/openkruise.io/tree/master/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '简体中文',
      },
    },
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'start',
        content:
          '⭐️ If you like OpenKruise, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/openkruise/kruise">GitHub</a>! ⭐️',
      },
      navbar: {
        title: 'OpenKruise',
        logo: {
          alt: 'OpenKruise',
          src: 'img/openkruise.ico',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            to: "docs/",
            position: 'left',
            label: 'Documentation',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/openkruise/kruise',
            className: 'header-github-link',
            position: 'right'
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/installation',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Kubernetes Slack ( #openkruise channel )',
                href: 'https://kubernetes.slack.com/channels/openkruise',
              },
              {
                label: 'DingTalk (Group ID: 23330762 )',
                href: 'https://www.dingtalk.com/',
              },
              {
                label: 'Bi-week Meeting (APAC, Chinese)',
                href: 'https://shimo.im/docs/gXqmeQOYBehZ4vqo',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/openkruise/kruise',
              },
              {
                label: 'Community Membership',
                href: 'https://github.com/openkruise/community/blob/master/community-membership.md',
              },
            ],
          },
        ],
        copyright: `
        <br />
        <strong>© ${new Date().getFullYear()} The OpenKruise Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.</strong
        `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});

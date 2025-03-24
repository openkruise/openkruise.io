const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;
const versions = require('./versions.json');

function getNextVersionName() {
  const expectedPrefix = 'v1.';

  const lastReleasedVersion = versions[0];
  if (!lastReleasedVersion.includes(expectedPrefix)) {
    throw new Error(
      'this code is only meant to be used during the 2.0 phase.',
    );
  }
  const version = parseInt(lastReleasedVersion.replace(expectedPrefix, ''), 10);
  return `${expectedPrefix}${version + 1}`;
}

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'OpenKruise',
  tagline: 'Automate application management on Kubernetes.',
  url: 'https://openkruise.io',
  baseUrl: '/',
  onBrokenLinks: 'warn',
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
          lastVersion: undefined,
          onlyIncludeVersions: (() => {
            return ['current', ...versions.slice(0, 2)];
          })(),
          versions: {
            current: {
              label: `${getNextVersionName()} 🚧`,
            },
          },
        },
        blog: {
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/openkruise/openkruise.io/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'rollouts',
        path: 'rollouts',
        routeBasePath: 'rollouts',
        include: ['**/*.md'],
        sidebarPath: require.resolve('./sidebars-rollouts.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'kruisegame',
        path: 'kruisegame',
        routeBasePath: 'kruisegame',
        include: ['**/*.md'],
        sidebarPath: require.resolve('./sidebars-kruisegame.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
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
      algolia: {
        apiKey: '72ec0a3c892141cf32490c676bb66628',
        indexName: 'openkruise',
        appId: 'FKASWWQYOP',
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
            label: 'Kruise',
          },
          {
            to: 'rollouts/introduction',
            position: 'left',
            label: 'Rollouts',
            activeBasePath: 'rollouts',
          },
          {
            to: 'kruisegame/introduction',
            position: 'left',
            label: 'Kruise-Game',
            activeBasePath: 'kruisegame',
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
                label: 'DingTalk (GroupID: 23330762 )',
                href: '.',
              },
              {
                label: 'WeChat (User: openkruise )',
                href: '.',
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
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
    }),
});

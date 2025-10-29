import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ÉquiSettle Technical Documentation',
  tagline: 'Comprehensive platform documentation for developers',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },


  // Set the production url of your site here
  url: 'https://equisettle-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'twosvn', // Usually your GitHub org/user name.
  projectName: 'equisettle-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          // Remove edit links for security
        },
        blog: false, // Disable blog for documentation site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ÉquiSettle Docs',
      logo: {
        alt: 'ÉquiSettle Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'backendSidebar',
          position: 'left',
          label: 'Backend',
        },
        {
          type: 'docSidebar',
          sidebarId: 'frontendSidebar',
          position: 'left',
          label: 'Frontend',
        },
        {
          type: 'docSidebar',
          sidebarId: 'deploymentSidebar',
          position: 'left',
          label: 'Deployment',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Backend API',
              to: '/docs/backend/overview',
            },
            {
              label: 'Frontend Guide',
              to: '/docs/frontend/overview',
            },
            {
              label: 'Deployment',
              to: '/docs/deployment/overview',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Live Platform',
              href: 'https://equisettle.twosvn.co.uk',
            },
            {
              label: 'Staging Environment',
              href: 'https://staging.equisettle.twosvn.co.uk',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Twosvn Agency',
              href: 'https://twosvn.co.uk',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ÉquiSettle by Twosvn Agency. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

// @ts-check
// Note: type annotations allow type checking and IDE autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: 'M7Schools',
  tagline: 'Your Professional IT Learning Platform',
  favicon: 'img/logo-light.png',

  url: 'https://M7Schools.vercel.app',
  baseUrl: '/',

  organizationName: 'omar-maarouf',
  projectName: 'M7Schools',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      "@cmfcmf/docusaurus-search-local",
      

      {
        language: "fr",
        indexBlog: false,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    navbar: {
      title: '',
      logo: {
        alt: 'M7Schools Logo',
        src: 'img/logo-light.png',
      },

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'coursSidebar',
          position: 'left',
          label: 'Cours',
        },
        
        {
          type: 'docSidebar',
          sidebarId: 'quizzesSidebar',
          position: 'left',
          label: 'QCM',
        },
        {
          type: 'docSidebar',
          sidebarId: 'TpSidebar',
          position: 'left',
          label: 'TP',
        },
        {
          type: 'docSidebar',
          sidebarId: 'EfmsSidebar',
          position: 'left',
          label: 'EFMs',
        },
        {
          href: 'https://github.com/omaarouf/M7Schools',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
  style: 'dark',

  logo: {
    alt: 'M7Schools Logo',
    src: 'img/logo-light.png',
    width: 100,
  },

  links: [
    {
      title: 'Cours',
      items: [
        {
          label: 'Conception Reseau',
          to: '/cours/networking/intro',
        },
        {
          label: 'Administration Windows',
          to: '/cours/windows/intro',
        },
        {
          label: 'Administration Linux',
          to: '/cours/linux/intro',
        },
      ],
    },
    {
      title: 'Pratique',
      items: [
        {
          label: 'Quiz interactifs',
          to: '/quizzes/quizzes-intro',
        },
        {
          label: 'Travaux Pratiques',
          to: '/TP/tp-intro',
        },
        {
          label: 'Examens de Fin de Module',
          to: '/EFMs/efms-intro',
        },
      ],
    },
    {
      title: 'Contact',
      items: [
        {
          html: `
            <div style="display:flex;flex-direction:column;gap:8px;">
              <a href="mailto:omar.maarouf.it@gmail.com" style="display:flex;align-items:center;gap:8px;color:#ccc;text-decoration:none;font-size:14px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                omar.maarouf.it@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/omar-maarouf-840605407/" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:8px;color:#ccc;text-decoration:none;font-size:14px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn - Omar Maarouf
              </a>
              <a href="https://github.com/omaarouf/M7Schools" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:8px;color:#ccc;text-decoration:none;font-size:14px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub - M7Schools
              </a>
            </div>
          `,
        },
      ],
    },
  ],

  copyright: `
    <div style=”border-top: 1px solid #ffffff22; margin-top: 24px; padding-top: 20px; text-align: center;”>
      <p style=”font-size: 13px; color: #aaa; max-width: 700px; margin: 0 auto 12px;”>
        M7Schools est une plateforme pedagogique destinee aux etudiants en informatique.
        Les contenus sont regulierement mis a jour pour refleter les meilleures pratiques
        de l industrie. Les exemples peuvent etre simplifies pour faciliter la comprehension.
      </p>
      <p style=”font-size: 12px; color: #666;”>
        Copyright ${new Date().getFullYear()} M7Schools  Concu et developpe par Omar Maarouf  Construit avec Docusaurus.
      </p>
    </div>
  `,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['bash', 'powershell', 'json', 'yaml'],
    },
  },
};

module.exports = config;
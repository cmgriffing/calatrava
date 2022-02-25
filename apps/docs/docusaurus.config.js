// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/nightOwlLight");
const darkCodeTheme = require("prism-react-renderer/themes/synthwave84");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Calatrava",
  tagline:
    "A wrapper around Architect that adds some needed bells and whistles",
  url: "https://cmgriffing.github.io/calatrava",
  baseUrl: "/calatrava/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "cmgriffing",
  projectName: "calatrava",
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/cmgriffing/calatrava/tree/main/apps/docs/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/cmgriffing/calatrava/tree/main/apps/docs/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Calatrava",
        logo: {
          alt: "Calatrava",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "/docs/intro",
            // type: "doc",
            // docId: "intro",
            position: "left",
            label: "Tutorial",
          },
          {
            to: "/docs/cli",
            // type: "doc",
            // docId: "cli",
            position: "left",
            label: "CLI",
          },
          {
            to: "/docs/packages",
            // type: "doc",
            // docId: "packages",
            position: "left",
            label: "Packages",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/cmgriffing/calatrava",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
              {
                label: "CLI",
                to: "/docs/cli",
              },
              {
                label: "Packages",
                to: "/docs/packages",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/calatrava",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/cmgriffing/calatrava",
              },
              {
                label: "Attribution",
                to: "/attribution",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Calatrava, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

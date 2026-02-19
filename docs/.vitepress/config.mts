import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CrowJS",
  description: "A lightweight GUI framework for p5.js",
  lang: 'en-US',

  // canonical site URL (used for Open Graph / JSON-LD / sitemap)
  // update if you host at a different domain

  cleanUrls: true,

  sitemap: {
    hostname: 'https://crow-js.vercel.app',
  },

  head: [
    ['link', { rel: 'icon', href: '/crowjs_favicon.png' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js', defer: '' }],

    // Basic SEO
    ['link', { rel: 'canonical', href: 'https://crow-js.vercel.app/' }],
    ['meta', { name: 'keywords', content: 'CrowJS, p5.js, GUI, UI, JavaScript, canvas, components' }],
    ['meta', { name: 'author', content: 'Usman Ali' }],
    ['meta', { name: 'robots', content: 'index,follow' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'CrowJS — lightweight GUI for p5.js' }],
    ['meta', { property: 'og:description', content: 'A lightweight GUI framework for p5.js' }],
    ['meta', { property: 'og:url', content: 'https://crow-js.vercel.app/' }],
    ['meta', { property: 'og:image', content: '/crow.png' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],

    // Twitter card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'CrowJS — lightweight GUI for p5.js' }],
    ['meta', { name: 'twitter:description', content: 'A lightweight GUI framework for p5.js' }],
    ['meta', { name: 'twitter:image', content: '/crow.png' }],

    // Geo tags (optional; edit to target a specific region/city)
    ['meta', { name: 'geo.region', content: 'PK' }],
    ['meta', { name: 'geo.placename', content: 'Karachi, Pakistan' }],
    ['meta', { name: 'geo.position', content: '24.8607;67.0011' }],

    // JSON-LD structured data for the project
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "CrowJS",
      "url": "https://crow-js.vercel.app/",
      "description": "A lightweight GUI framework for p5.js",
      "author": { "@type": "Person", "name": "Usman Ali" },
      "license": "https://opensource.org/licenses/MIT",
      "applicationCategory": "GraphicsApplication",
      "operatingSystem": "All"
    })]
  ],

  markdown: {
    image: {
      lazyLoading: true
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  themeConfig: {
    logo: '/crowjs_favicon.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/root' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Label', link: '/guide/components/label' },
            { text: 'Button', link: '/guide/components/button' },
            { text: 'TextField', link: '/guide/components/text-field' },
            { text: 'Icon', link: '/guide/components/icon' },
          ]
        },
        {
          text: 'Frames (Layout)',
          items: [
            { text: 'Frame', link: '/guide/frames/frame' },
            { text: 'ScrollFrame', link: '/guide/frames/scroll-frame' },
            { text: 'GridFrame', link: '/guide/frames/grid-frame' },
          ]
        },
        {
          text: 'Events',
          items: [
            { text: 'Event System', link: '/guide/events' },
          ]
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Vercel Web Analytics', link: '/guide/vercel-web-analytics' },
          ]
        },
      ],
      '/api/': [
        {
          text: 'Core',
          items: [
            { text: 'Root', link: '/api/root' },
            { text: 'Component', link: '/api/component' },
          ]
        },
        {
          text: 'Events',
          items: [
            { text: 'GUIEvent', link: '/api/gui-event' },
            { text: 'MouseEvent', link: '/api/mouse-event' },
            { text: 'KeyboardEvent', link: '/api/keyboard-event' },
          ]
        },
        {
          text: 'Frames',
          items: [
            { text: 'Frame', link: '/api/frame' },
            { text: 'ScrollFrame', link: '/api/scroll-frame' },
            { text: 'GridFrame', link: '/api/grid-frame' },
          ]
        },
        {
          text: 'UI Components',
          items: [
            { text: 'UIComponent', link: '/api/ui-component' },
            { text: 'TextComponent', link: '/api/text-component' },
            { text: 'Label', link: '/api/label' },
            { text: 'Button', link: '/api/button' },
            { text: 'Icon', link: '/api/icon' },
            { text: 'Input', link: '/api/input' },
            { text: 'TextField', link: '/api/text-field' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/UsmanAli404/CrowJS' }
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
          },
        },
      },
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Usman Ali'
    }
  }
})

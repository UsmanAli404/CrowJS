import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CrowJS",
  description: "CrowJS Documentation",
  head: [
    ['link', { rel: 'icon', href: '/crowjs_favicon.png' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js', defer: '' }]
  ],
  themeConfig: {
    logo: '/crowjs_favicon.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/get-started' },
          { text: 'Runtime API Examples', link: '/examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/UsmanAli404/CrowJS' }
    ]
  }
})

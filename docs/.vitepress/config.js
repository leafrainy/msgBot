import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MsgBot",
  description: "自建消息通知机器人",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/deploy' }
    ],

    sidebar: [
      {
        text: '文档',
        items: [
          { text: '搭建部署', link: '/deploy' },
          { text: '接口调用', link: '/api' },
          { text: '版本记录', link: '/version' },
          { text: '致谢', link: '/thanks' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leafrainy' }
    ],

    footer: {
      copyright: 'Copyright © 2023 MsgBot by Leafrainy'
    }
  }
})

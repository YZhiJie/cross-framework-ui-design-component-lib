import { defineConfig } from 'vitepress';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// 纯数据清单（零组件依赖），供 Node 端程序化生成侧边栏 / 上一页下一页
import { CATEGORIES, COMPONENT_LIST } from '../src/content/component-list';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// GitHub Pages 项目站点 base 路径（https://YZhiJie.github.io/xui-design-docs/）
const base = process.env.DOCS_BASE ?? '/';
const REPO = 'https://github.com/YZhiJie/cross-framework-ui-design-component-lib';

// ---------- 双语静态文案（config 端持有导航 / 指南 / 搜索翻译，页面内容仍以 meta 为单一来源） ----------

const localeText = {
  'zh-CN': {
    navHome: '首页',
    navGuide: '指南',
    navComponents: '组件',
    guideSection: '开始',
    guides: { theme: '主题定制', i18n: '国际化', floating: '浮层视口避让' },
    outlineLabel: '本页目录',
    docFooterPrev: '上一篇',
    docFooterNext: '下一篇',
    lastUpdated: '最后更新于',
    returnToTop: '回到顶部',
    langLabel: '语言',
    searchNoResult: '没有找到相关结果',
    searchNoResultAdvice: '尝试调整关键词或换个说法',
  },
  'en-US': {
    navHome: 'Home',
    navGuide: 'Guide',
    navComponents: 'Components',
    guideSection: 'Getting Started',
    guides: { theme: 'Theming', i18n: 'Internationalization', floating: 'Floating Positioning' },
    outlineLabel: 'On this page',
    docFooterPrev: 'Previous',
    docFooterNext: 'Next',
    lastUpdated: 'Last updated',
    returnToTop: 'Back to top',
    langLabel: 'Language',
    searchNoResult: 'No results found',
    searchNoResultAdvice: 'Try different keywords or rephrase your query',
  },
} as const;

type Lang = keyof typeof localeText;

const sidebarLinkOf = (lang: Lang, slug: string) =>
  `${lang === 'zh-CN' ? '' : '/en'}/components/${slug}`;

/** 程序化生成侧边栏：指南 + 24 组件按分类分组（与 registry 单一来源同步） */
function buildSidebar(lang: Lang) {
  const text = localeText[lang];
  const labelOf = (slug: string) => {
    const item = COMPONENT_LIST.find((entry) => entry.slug === slug)!;
    return lang === 'zh-CN' ? `${item.title} ${item.name}` : item.name;
  };
  return [
    {
      text: text.guideSection,
      items: [
        { text: text.guides.theme, link: `${lang === 'zh-CN' ? '' : '/en'}/guide/theme` },
        { text: text.guides.i18n, link: `${lang === 'zh-CN' ? '' : '/en'}/guide/i18n` },
        { text: text.guides.floating, link: `${lang === 'zh-CN' ? '' : '/en'}/guide/floating` },
      ],
    },
    ...CATEGORIES.map((category) => ({
      text: category.title[lang],
      items: COMPONENT_LIST.filter((item) => item.category === category.key).map((item) => ({
        text: labelOf(item.slug),
        link: sidebarLinkOf(lang, item.slug),
      })),
    })),
  ];
}

/** 扁平化侧边栏得到全站页面顺序，供 transformPageData 推导上一页 / 下一页 */
function flattenSidebarPages(lang: Lang): { text: string; link: string }[] {
  const pages: { text: string; link: string }[] = [];
  for (const group of buildSidebar(lang)) {
    for (const item of group.items) pages.push({ text: item.text, link: item.link });
  }
  return pages;
}

const zhSearchTranslations = {
  button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
  modal: {
    displayDetails: '显示详细列表',
    resetButtonTitle: '清除查询条件',
    backButtonTitle: '关闭搜索',
    noResultsText: '没有找到相关结果',
    noResultsAdvice: '尝试调整关键词或换个说法',
    footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
  },
};

export default defineConfig({
  lang: 'zh-CN',
  title: 'XUI',
  description: '一套核心契约，Vue 3 与 React 19 双端同构的通用组件库',
  // GitHub Pages 项目站点 base；产物输出至 apps/docs/dist（与部署工作流保持一致）
  base,
  outDir: 'dist',
  lastUpdated: true,
  cleanUrls: false,
  appearance: true,
  // 包自述文件不作为文档页面渲染（避免孤儿页混入搜索索引）
  srcExclude: ['**/README.md'],
  // 代码块统一 github-dark（明暗主题一致，与 demo 源码 CodeBlock 视觉统一）
  markdown: { theme: 'github-dark' },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon-32x32.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }],
    // 首屏主题同步：VP 内联脚本负责 <html> 的 dark 类，这里同步写组件库消费的
    // data-theme 属性，保证 demo 组件首屏即与文档主题一致（无闪变）
    [
      'script',
      {},
      `;(function(){try{var m=localStorage.getItem('vitepress-theme-appearance');var d=m==='dark'||((!m||m==='auto')&&matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.removeAttribute('data-theme')}}catch(e){}})()`,
    ],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: localeText['zh-CN'].navGuide, link: '/guide/theme' },
          { text: localeText['zh-CN'].navComponents, link: '/components/button' },
        ],
        sidebar: buildSidebar('zh-CN'),
        outline: { level: [2, 3], label: localeText['zh-CN'].outlineLabel },
        docFooter: {
          prev: localeText['zh-CN'].docFooterPrev,
          next: localeText['zh-CN'].docFooterNext,
        },
        lastUpdated: { text: localeText['zh-CN'].lastUpdated },
        returnToTopLabel: localeText['zh-CN'].returnToTop,
        sidebarMenuLabel: localeText['zh-CN'].langLabel,
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: localeText['en-US'].navGuide, link: '/en/guide/theme' },
          { text: localeText['en-US'].navComponents, link: '/en/components/button' },
        ],
        sidebar: buildSidebar('en-US'),
        outline: { level: [2, 3], label: localeText['en-US'].outlineLabel },
        docFooter: {
          prev: localeText['en-US'].docFooterPrev,
          next: localeText['en-US'].docFooterNext,
        },
        lastUpdated: { text: localeText['en-US'].lastUpdated },
        returnToTopLabel: localeText['en-US'].returnToTop,
        sidebarMenuLabel: localeText['en-US'].langLabel,
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
      },
    },
  },
  themeConfig: {
    // 明暗切换使用 VP 内置导航栏开关；Layout 中 watch(isDark) 联动组件库 data-theme
    logo: `${base}logo-512.png`,
    socialLinks: [{ icon: 'github', link: REPO }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: { translations: zhSearchTranslations },
          en: {},
        },
      },
    },
  },
  transformPageData(pageData) {
    // 首页 / 自定义布局页不需要上一页下一页
    if (pageData.frontmatter.layout === 'home' || pageData.frontmatter.layout === false) return;
    const lang: Lang = pageData.frontmatter.lang === 'en-US' ? 'en-US' : 'zh-CN';
    const pages = flattenSidebarPages(lang);
    const path = `/${pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')}`;
    const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
    const index = pages.findIndex((page) => page.link === normalized);
    if (index === -1) return;
    const prev = pages[index - 1];
    const next = pages[index + 1];
    pageData.frontmatter.prev = prev ?? false;
    pageData.frontmatter.next = next ?? false;
  },
  vite: {
    plugins: [react()],
    resolve: {
      alias: {
        '@xui-design/vue': resolve(rootDir, '../../../packages/vue/src/index.ts'),
        '@xui-design/react': resolve(rootDir, '../../../packages/react/src/index.ts'),
        '@xui-design/core': resolve(rootDir, '../../../packages/core/src/index.ts'),
        '@xui-design/styles': resolve(rootDir, '../../../packages/styles/src/index.scss'),
      },
    },
  },
});

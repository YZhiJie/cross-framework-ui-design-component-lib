import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ClickVue from './demos/click.vue';
import BasicReact from './demos/basic';
import ClickReact from './demos/click';

import basicVueSource from './demos/basic.vue?raw';
import clickVueSource from './demos/click.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import clickReactSource from './demos/click.tsx?raw';

export const breadcrumbMeta: ComponentMeta = {
  name: 'Breadcrumb',
  slug: 'breadcrumb',
  title: '面包屑',
  category: 'navigation',
  summary: {
    'zh-CN': '显示当前页面层级路径，支持链接项 / 可点击项与自定义分隔符。',
    'en-US':
      'Shows the hierarchical path of the current page, supporting link items / clickable items and a custom separator.',
  },
  features: [
    {
      'zh-CN': 'items 配置层级，最后一项自动视为当前页（不可点击）',
      'en-US':
        'items configures the hierarchy; the last item is automatically treated as the current page (not clickable)',
    },
    {
      'zh-CN':
        "item 存在 href 时渲染为 <a>，否则渲染为可点击 <span>；separator 自定义分隔符（默认 '/'）",
      'en-US':
        "An item with href renders as <a>, otherwise as a clickable <span>; separator customizes the delimiter (defaults to '/')",
    },
    {
      'zh-CN': 'disabled 项与末项不触发 itemClick',
      'en-US': 'Disabled items and the last item do not fire itemClick',
    },
  ],
  scenarios: [
    {
      'zh-CN': '详情页层级返回、管理系统内容分区定位等场景。',
      'en-US':
        'Scenarios such as hierarchical back-navigation on detail pages or section location in admin systems.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础与分隔符', 'en-US': 'Basic & Separator' },
      description: {
        'zh-CN': '末项为当前页；separator 可替换默认斜杠。',
        'en-US': 'The last item is the current page; separator can replace the default slash.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'click',
      title: { 'zh-CN': '点击与禁用', 'en-US': 'Click & Disabled' },
      description: {
        'zh-CN': '无 href 的项点击触发 itemClick；disabled 项与末项被忽略。',
        'en-US':
          'Clicking an item without href fires itemClick; disabled items and the last item are ignored.',
      },
      vueComponent: ClickVue,
      reactComponent: ClickReact,
      vueSource: clickVueSource,
      reactSource: clickReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'items',
        type: 'BreadcrumbItem[]',
        default: '[]',
        description: {
          'zh-CN': '面包屑项列表（末项视为当前页）',
          'en-US': 'Breadcrumb item list (the last item is treated as the current page)',
        },
      },
      {
        name: 'separator',
        type: 'string',
        default: `'/'`,
        description: { 'zh-CN': '分隔符', 'en-US': 'Separator' },
      },
      {
        name: 'onItemClick',
        type: '(item: BreadcrumbItem, index: number) => void',
        default: '—',
        description: {
          'zh-CN': '点击可导航项回调（末项 / disabled 不触发）',
          'en-US':
            'Callback for clicking a navigable item (not fired for the last item or disabled ones)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Custom class name appended to the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义样式',
          'en-US': 'Custom styles appended to the root element',
        },
      },
    ],
    events: [
      {
        vue: 'itemClick',
        react: 'onItemClick',
        payload: 'item: BreadcrumbItem, index: number',
        description: { 'zh-CN': '点击导航项', 'en-US': 'Navigable item clicked' },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN': '自定义内容区（覆盖 items 渲染）',
          'en-US': 'Custom content area (overrides items rendering)',
        },
      },
    ],
    types: [
      {
        name: 'BreadcrumbItem',
        definition: `interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}`,
        description: {
          'zh-CN': '面包屑层级项；href 存在渲染为链接。',
          'en-US': 'Breadcrumb hierarchy item; renders as a link when href is present.',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '组件本身不拦截链接默认导航（对齐 Element Plus），SPA 内路由拦截由应用层负责。',
      'en-US':
        'The component does not intercept the default link navigation (aligned with Element Plus); route interception in an SPA is handled by the application layer.',
    },
    {
      'zh-CN': '在 hash 路由应用中若不希望改变地址，可省略 href，改用 itemClick 处理跳转。',
      'en-US':
        'In hash-routed apps, omit href and handle navigation via itemClick if you do not want to change the address.',
    },
  ],
  a11y: [
    {
      'zh-CN': '根节点使用 nav + aria-label="面包屑"，当前页以 aria-current 标识。',
      'en-US':
        'The root uses nav with aria-label="面包屑", and the current page is marked with aria-current.',
    },
  ],
};

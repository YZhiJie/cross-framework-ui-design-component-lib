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
  summary: '显示当前页面层级路径，支持链接项 / 可点击项与自定义分隔符。',
  features: [
    'items 配置层级，最后一项自动视为当前页（不可点击）',
    "item 存在 href 时渲染为 <a>，否则渲染为可点击 <span>；separator 自定义分隔符（默认 '/'）",
    'disabled 项与末项不触发 itemClick',
  ],
  scenarios: ['详情页层级返回、管理系统内容分区定位等场景。'],
  demos: [
    {
      id: 'basic',
      title: '基础与分隔符',
      description: '末项为当前页；separator 可替换默认斜杠。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'click',
      title: '点击与禁用',
      description: '无 href 的项点击触发 itemClick；disabled 项与末项被忽略。',
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
        description: '面包屑项列表（末项视为当前页）',
      },
      { name: 'separator', type: 'string', default: `'/'`, description: '分隔符' },
      {
        name: 'onItemClick',
        type: '(item: BreadcrumbItem, index: number) => void',
        default: '—',
        description: '点击可导航项回调（末项 / disabled 不触发）',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的自定义样式',
      },
    ],
    events: [
      {
        vue: 'itemClick',
        react: 'onItemClick',
        payload: 'item: BreadcrumbItem, index: number',
        description: '点击导航项',
      },
    ],
    slots: [{ vue: 'default', react: 'children', description: '自定义内容区（覆盖 items 渲染）' }],
    types: [
      {
        name: 'BreadcrumbItem',
        definition: `interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}`,
        description: '面包屑层级项；href 存在渲染为链接。',
      },
    ],
  },
  notes: [
    '组件本身不拦截链接默认导航（对齐 Element Plus），SPA 内路由拦截由应用层负责。',
    '在 hash 路由应用中若不希望改变地址，可省略 href，改用 itemClick 处理跳转。',
  ],
  a11y: ['根节点使用 nav + aria-label="面包屑"，当前页以 aria-current 标识。'],
};

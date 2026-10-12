import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const skeletonMeta: ComponentMeta = {
  name: 'Skeleton',
  slug: 'skeleton',
  title: '骨架屏',
  category: 'display',
  summary: {
    'zh-CN': '数据加载中的占位屏，在内容就绪前提供结构感知，支持头像占位与自定义行数。',
    'en-US':
      'Placeholder screen shown while data is loading, conveying structure before content is ready, with avatar placeholder and customizable row count.',
  },
  features: [
    {
      'zh-CN': 'loading 控制骨架 / 真实内容切换，false 时渲染默认插槽内容',
      'en-US':
        'loading toggles between skeleton and real content; renders the default slot when false',
    },
    {
      'zh-CN': 'avatar 显示头部头像占位，rows 配置段落行数（收敛为正整数，默认 3）',
      'en-US':
        'avatar shows a leading avatar placeholder; rows sets the paragraph line count (coerced to a positive integer, defaults to 3)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '卡片 / 列表 / 详情页首次加载、弱网等待数据等场景。',
      'en-US': 'First-load of cards / lists / detail pages, or waiting for data on slow networks.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '加载切换', 'en-US': 'Loading Toggle' },
      description: {
        'zh-CN': 'loading=true 显示骨架，false 渲染插槽中的真实内容。',
        'en-US': 'loading=true shows the skeleton; false renders the real content in the slot.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: { 'zh-CN': '头像占位与行数', 'en-US': 'Avatar Placeholder & Rows' },
      description: {
        'zh-CN': 'avatar 渲染圆形头像占位；rows 控制文本段落条数。',
        'en-US': 'avatar renders a circular avatar placeholder; rows controls the text line count.',
      },
      vueComponent: VariantsVue,
      reactComponent: VariantsReact,
      vueSource: variantsVueSource,
      reactSource: variantsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'loading',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '加载中状态（true 渲染骨架，false 渲染插槽内容）',
          'en-US': 'Loading state (true renders the skeleton, false renders the slot content)',
        },
      },
      {
        name: 'avatar',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否显示头部头像占位',
          'en-US': 'Whether to show the leading avatar placeholder',
        },
      },
      {
        name: 'rows',
        type: 'number',
        default: '3',
        description: {
          'zh-CN': '段落行数（收敛为正整数）',
          'en-US': 'Paragraph line count (coerced to a positive integer)',
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
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN': '真实内容（loading=false 时渲染）',
          'en-US': 'Real content (rendered when loading=false)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': 'rows 传入 0 或负数等非法值会收敛为 1，保证至少渲染一行。',
      'en-US':
        'Invalid rows values such as 0 or negatives are coerced to 1, guaranteeing at least one line.',
    },
  ],
  a11y: [
    {
      'zh-CN': '骨架区域标记为忙碌状态（aria-busy），读屏可感知内容正在加载。',
      'en-US':
        'The skeleton region is marked busy (aria-busy) so screen readers can sense that content is loading.',
    },
  ],
};

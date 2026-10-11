import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ImageVue from './demos/image.vue';
import BasicReact from './demos/basic';
import ImageReact from './demos/image';

import basicVueSource from './demos/basic.vue?raw';
import imageVueSource from './demos/image.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import imageReactSource from './demos/image.tsx?raw';

export const emptyMeta: ComponentMeta = {
  name: 'Empty',
  slug: 'empty',
  title: '空状态',
  category: 'display',
  summary: '空数据 / 无结果时的占位展示，内置默认插画，支持自定义描述、插画与操作区。',
  features: [
    '内置默认插画，description 提供描述文案（空白时不渲染描述，避免内置 i18n）',
    'image 插槽 / renderImage 自定义插画，default 插槽放置操作按钮',
  ],
  scenarios: ['列表无数据、搜索无结果、首次使用引导等场景。'],
  demos: [
    {
      id: 'basic',
      title: '描述与操作',
      description: '默认插槽放置"去创建"等引导动作。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'image',
      title: '自定义插画与纯默认',
      description: 'image 插槽覆盖默认插画；不传 description 时仅展示插画。',
      vueComponent: ImageVue,
      reactComponent: ImageReact,
      vueSource: imageVueSource,
      reactSource: imageReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'description',
        type: 'string',
        default: '—',
        description: '空状态描述文案（未提供或空白时不渲染）',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的自定义样式',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '底部动作区（如"去创建"按钮）' },
      { vue: 'image', react: 'renderImage', description: '自定义插画（覆盖默认插画）' },
    ],
  },
  notes: ['组件不内置任何文案，description 完全由使用方决定，便于国际化。'],
  a11y: ['空状态作为说明性区域，描述文本可被读屏朗读，装饰性插画标注为装饰图。'],
};

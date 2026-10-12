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
  summary: {
    'zh-CN': '空数据 / 无结果时的占位展示，内置默认插画，支持自定义描述、插画与操作区。',
    'en-US':
      'Placeholder for empty data or no results, with a built-in default illustration and customizable description, illustration, and action area.',
  },
  features: [
    {
      'zh-CN': '内置默认插画，description 提供描述文案（空白时不渲染描述，避免内置 i18n）',
      'en-US':
        'Built-in default illustration; description provides the text (not rendered when blank, avoiding built-in i18n)',
    },
    {
      'zh-CN': 'image 插槽 / renderImage 自定义插画，default 插槽放置操作按钮',
      'en-US':
        'Customize the illustration via the image slot / renderImage; place action buttons in the default slot',
    },
  ],
  scenarios: [
    {
      'zh-CN': '列表无数据、搜索无结果、首次使用引导等场景。',
      'en-US': 'Scenarios such as empty lists, no search results, or first-use onboarding.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '描述与操作', 'en-US': 'Description & Action' },
      description: {
        'zh-CN': '默认插槽放置"去创建"等引导动作。',
        'en-US': 'The default slot holds guiding actions such as "Create".',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'image',
      title: { 'zh-CN': '自定义插画与纯默认', 'en-US': 'Custom Illustration & Pure Default' },
      description: {
        'zh-CN': 'image 插槽覆盖默认插画；不传 description 时仅展示插画。',
        'en-US':
          'The image slot overrides the default illustration; when description is omitted, only the illustration is shown.',
      },
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
        description: {
          'zh-CN': '空状态描述文案（未提供或空白时不渲染）',
          'en-US': 'Description text of the empty state (not rendered when omitted or blank)',
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
          'zh-CN': '底部动作区（如"去创建"按钮）',
          'en-US': 'Bottom action area (e.g., a "Create" button)',
        },
      },
      {
        vue: 'image',
        react: 'renderImage',
        description: {
          'zh-CN': '自定义插画（覆盖默认插画）',
          'en-US': 'Custom illustration (overrides the default one)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '组件不内置任何文案，description 完全由使用方决定，便于国际化。',
      'en-US':
        'The component ships no built-in text; description is fully controlled by the consumer, which simplifies internationalization.',
    },
  ],
  a11y: [
    {
      'zh-CN': '空状态作为说明性区域，描述文本可被读屏朗读，装饰性插画标注为装饰图。',
      'en-US':
        'The empty state acts as a descriptive region: the description text can be read by screen readers, and the decorative illustration is marked as decorative.',
    },
  ],
};

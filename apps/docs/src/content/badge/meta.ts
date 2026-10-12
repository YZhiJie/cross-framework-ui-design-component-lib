import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const badgeMeta: ComponentMeta = {
  name: 'Badge',
  slug: 'badge',
  title: '徽标数',
  category: 'display',
  summary: {
    'zh-CN': '以角标形式展示消息数量或状态红点，可包裹任意内容，也可独立使用。',
    'en-US':
      'Shows a message count or status dot as a corner badge; can wrap any content or be used standalone.',
  },
  features: [
    {
      'zh-CN': '包裹模式：徽标悬浮于内容右上角；无子内容时独立渲染',
      'en-US':
        'Wrapper mode: the badge floats at the top-right corner of the content; renders standalone without children',
    },
    {
      'zh-CN': 'count 超过 max 时显示 `${max}+`（max 默认 99）',
      'en-US': 'Shows `${max}+` when count exceeds max (max defaults to 99)',
    },
    {
      'zh-CN': 'dot 点状徽标，忽略具体数值；showZero 控制 count 为 0 时是否显示',
      'en-US':
        'dot renders a dot badge ignoring the numeric value; showZero controls whether a count of 0 is shown',
    },
  ],
  scenarios: [
    {
      'zh-CN': '未读消息 / 通知数量、有新内容的状态红点等场景。',
      'en-US': 'Unread message / notification counts, status dots for new content, and more.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '计数与上限', 'en-US': 'Count & Max' },
      description: {
        'zh-CN': 'count 动态变化，超过 max 后折叠为 99+。',
        'en-US': 'count changes dynamically and collapses to 99+ once it exceeds max.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: { 'zh-CN': '红点 / 零值 / 独立', 'en-US': 'Dot / Zero / Standalone' },
      description: {
        'zh-CN': 'dot 仅提示有更新；showZero 决定 0 是否展示；无包裹内容时独立显示。',
        'en-US':
          'dot only hints that there are updates; showZero decides whether 0 is shown; renders standalone without wrapped content.',
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
        name: 'count',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '徽标数值（未提供时不显示；dot 模式仅作无障碍语义）',
          'en-US':
            'Badge count (hidden when not provided; only serves as accessibility semantics in dot mode)',
        },
      },
      {
        name: 'max',
        type: 'number',
        default: '99',
        description: {
          'zh-CN': '数值上限（超出显示 `${max}+`）',
          'en-US': 'Maximum value (shows `${max}+` when exceeded)',
        },
      },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '点状徽标（忽略 count 与 max）',
          'en-US': 'Dot badge (ignores count and max)',
        },
      },
      {
        name: 'showZero',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': 'count 为 0 时是否显示徽标（默认隐藏）',
          'en-US': 'Whether to show the badge when count is 0 (hidden by default)',
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
          'zh-CN': '徽标包裹的内容（未提供时徽标独立渲染）',
          'en-US': 'Content wrapped by the badge (the badge renders standalone when not provided)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '纯展示组件，无事件；count 为 0 且未开启 showZero 时徽标不占位。',
      'en-US':
        'A purely presentational component with no events; the badge takes up no space when count is 0 and showZero is off.',
    },
  ],
  a11y: [
    {
      'zh-CN': '数值徽标以可读文本暴露数量语义；dot 模式作为状态提示，装饰性内容对读屏隐藏。',
      'en-US':
        'Numeric badges expose the count as readable text; dot mode acts as a status hint, and decorative content is hidden from screen readers.',
    },
  ],
};

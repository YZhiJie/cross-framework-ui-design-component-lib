import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import WrapperVue from './demos/wrapper.vue';
import BasicReact from './demos/basic';
import WrapperReact from './demos/wrapper';

import basicVueSource from './demos/basic.vue?raw';
import wrapperVueSource from './demos/wrapper.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import wrapperReactSource from './demos/wrapper.tsx?raw';

export const spinMeta: ComponentMeta = {
  name: 'Spin',
  slug: 'spin',
  title: '加载中',
  category: 'feedback',
  summary: {
    'zh-CN': '加载状态指示器，可独立使用，也可包裹内容以遮罩形式表示区块加载。',
    'en-US':
      'A loading indicator that works standalone or wraps content with a mask to indicate block-level loading.',
  },
  features: [
    {
      'zh-CN': 'size 支持 sm / md / lg（默认 md），tip 显示指示器下方提示文案',
      'en-US': 'size supports sm / md / lg (default md); tip shows hint text below the indicator',
    },
    {
      'zh-CN': '包裹内容时由 spinning 控制半透明遮罩显隐（默认 true）',
      'en-US': 'When wrapping content, spinning toggles the translucent mask (default true)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '局部数据加载、按钮 / 卡片等待状态、全屏或区块加载占位等场景。',
      'en-US':
        'Local data loading, button / card pending states, full-screen or block-level loading placeholders.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '尺寸与提示', 'en-US': 'Sizes & Tip' },
      description: {
        'zh-CN': '独立使用的三档指示器，tip 附带文字说明。',
        'en-US': 'Three standalone indicator sizes, with tip adding a text hint.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'wrapper',
      title: { 'zh-CN': '包裹内容', 'en-US': 'Wrapping Content' },
      description: {
        'zh-CN': 'spinning 时在内容上覆盖遮罩并阻止交互，结束后恢复。',
        'en-US':
          'While spinning, a mask covers the content and blocks interaction; it is restored when finished.',
      },
      vueComponent: WrapperVue,
      reactComponent: WrapperReact,
      vueSource: wrapperVueSource,
      reactSource: wrapperReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: { 'zh-CN': '尺寸', 'en-US': 'Size' },
      },
      {
        name: 'spinning',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '加载中状态（包裹内容时控制遮罩显隐）',
          'en-US': 'Loading state (toggles the mask when wrapping content)',
        },
      },
      {
        name: 'tip',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '提示文案（显示在指示器下方，空串不渲染）',
          'en-US': 'Tip text (shown below the indicator; an empty string renders nothing)',
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
          'zh-CN': '包裹内容（spinning 时覆盖半透明遮罩）',
          'en-US': 'Wrapped content (covered by a translucent mask while spinning)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '纯展示组件，无事件；指示器动画由样式驱动，可通过 prefers-reduced-motion 减弱。',
      'en-US':
        'A purely presentational component with no events; the indicator animation is CSS-driven and can be reduced via prefers-reduced-motion.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '加载指示器携带 aria-live 区域与 busy 状态，读屏可感知"加载中"；tip 作为可朗读说明。',
      'en-US':
        'The indicator carries an aria-live region and busy state so screen readers can perceive "loading"; tip serves as a readable description.',
    },
  ],
};

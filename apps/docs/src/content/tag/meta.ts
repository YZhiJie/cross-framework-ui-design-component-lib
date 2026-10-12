import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ClosableVue from './demos/closable.vue';
import BasicReact from './demos/basic';
import ClosableReact from './demos/closable';

import basicVueSource from './demos/basic.vue?raw';
import closableVueSource from './demos/closable.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import closableReactSource from './demos/closable.tsx?raw';

export const tagMeta: ComponentMeta = {
  name: 'Tag',
  slug: 'tag',
  title: '标签',
  category: 'display',
  summary: {
    'zh-CN': '用于标记和分类的小型标签，支持五种语义类型、两种尺寸与可关闭交互。',
    'en-US':
      'A small tag for labeling and categorization, with five semantic types, two sizes, and closable interaction.',
  },
  features: [
    {
      'zh-CN': '五种语义类型：default / primary / success / warning / danger',
      'en-US': 'Five semantic types: default / primary / success / warning / danger',
    },
    {
      'zh-CN': 'sm / md 两种尺寸',
      'en-US': 'Two sizes: sm / md',
    },
    {
      'zh-CN': 'closable 显示关闭按钮，点击后组件自动隐藏并触发 close',
      'en-US': 'closable shows a close button; clicking it hides the component and fires close',
    },
  ],
  scenarios: [
    {
      'zh-CN': '分类标记、可删除的筛选条件、状态简要标识等场景。',
      'en-US': 'Category labels, removable filter criteria, brief status indicators, and more.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '语义类型', 'en-US': 'Semantic Types' },
      description: {
        'zh-CN': '通过 type 切换五种内置色彩语义。',
        'en-US': 'Use type to switch between the five built-in color semantics.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'closable',
      title: { 'zh-CN': '可关闭标签', 'en-US': 'Closable Tag' },
      description: {
        'zh-CN': 'closable 标签关闭后自动隐藏；由外部在 close 中同步数据源。',
        'en-US':
          'A closable tag hides itself after closing; sync the data source externally in the close handler.',
      },
      vueComponent: ClosableVue,
      reactComponent: ClosableReact,
      vueSource: closableVueSource,
      reactSource: closableReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'type',
        type: `'default' | 'primary' | 'success' | 'warning' | 'danger'`,
        default: `'default'`,
        description: { 'zh-CN': '语义类型', 'en-US': 'Semantic type' },
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: { 'zh-CN': '尺寸', 'en-US': 'Size' },
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否可关闭（显示关闭按钮）',
          'en-US': 'Whether the tag is closable (shows a close button)',
        },
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '关闭回调（组件隐藏后触发）',
          'en-US': 'Close callback (fired after the component hides)',
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
        vue: 'close',
        react: 'onClose',
        payload: '—',
        description: {
          'zh-CN': '点击关闭按钮、组件隐藏后触发',
          'en-US': 'Fired after the close button is clicked and the component hides',
        },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '标签内容', 'en-US': 'Tag content' },
      },
      {
        vue: 'closeIcon',
        react: 'renderCloseIcon',
        description: {
          'zh-CN': '自定义关闭图标（替换内置 close）',
          'en-US': 'Custom close icon (replaces the built-in close)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '点击关闭后组件内部先隐藏再回调；如需"恢复显示"（如重置示例），需重新挂载组件（Vue 用 key、React 重挂载）。',
      'en-US':
        'After the close click, the component hides internally before firing the callback; to "bring it back" (e.g. resetting a demo), remount the component (via key in Vue or a remount in React).',
    },
  ],
  a11y: [
    {
      'zh-CN': '关闭按钮具备按钮语义与可读的"关闭"文本，键盘可聚焦操作。',
      'en-US':
        'The close button has button semantics and a readable "Close" label, and is keyboard-focusable.',
    },
  ],
};

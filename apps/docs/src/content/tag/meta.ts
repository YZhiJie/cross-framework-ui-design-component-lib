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
  summary: '用于标记和分类的小型标签，支持五种语义类型、两种尺寸与可关闭交互。',
  features: [
    '五种语义类型：default / primary / success / warning / danger',
    'sm / md 两种尺寸',
    'closable 显示关闭按钮，点击后组件自动隐藏并触发 close',
  ],
  scenarios: ['分类标记、可删除的筛选条件、状态简要标识等场景。'],
  demos: [
    {
      id: 'basic',
      title: '语义类型',
      description: '通过 type 切换五种内置色彩语义。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'closable',
      title: '可关闭标签',
      description: 'closable 标签关闭后自动隐藏；由外部在 close 中同步数据源。',
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
        description: '语义类型',
      },
      { name: 'size', type: `'sm' | 'md'`, default: `'md'`, description: '尺寸' },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        description: '是否可关闭（显示关闭按钮）',
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: '关闭回调（组件隐藏后触发）',
      },
    ],
    events: [
      { vue: 'close', react: 'onClose', payload: '—', description: '点击关闭按钮、组件隐藏后触发' },
    ],
    slots: [{ vue: 'default', react: 'children', description: '标签内容' }],
  },
  notes: [
    '点击关闭后组件内部先隐藏再回调；如需"恢复显示"（如重置示例），需重新挂载组件（Vue 用 key、React 重挂载）。',
  ],
  a11y: ['关闭按钮具备按钮语义与可读的"关闭"文本，键盘可聚焦操作。'],
};

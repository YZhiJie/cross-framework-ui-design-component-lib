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
  summary: '加载状态指示器，可独立使用，也可包裹内容以遮罩形式表示区块加载。',
  features: [
    'size 支持 sm / md / lg（默认 md），tip 显示指示器下方提示文案',
    '包裹内容时由 spinning 控制半透明遮罩显隐（默认 true）',
  ],
  scenarios: ['局部数据加载、按钮 / 卡片等待状态、全屏或区块加载占位等场景。'],
  demos: [
    {
      id: 'basic',
      title: '尺寸与提示',
      description: '独立使用的三档指示器，tip 附带文字说明。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'wrapper',
      title: '包裹内容',
      description: 'spinning 时在内容上覆盖遮罩并阻止交互，结束后恢复。',
      vueComponent: WrapperVue,
      reactComponent: WrapperReact,
      vueSource: wrapperVueSource,
      reactSource: wrapperReactSource,
    },
  ],
  api: {
    props: [
      { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: '尺寸' },
      {
        name: 'spinning',
        type: 'boolean',
        default: 'true',
        description: '加载中状态（包裹内容时控制遮罩显隐）',
      },
      {
        name: 'tip',
        type: 'string',
        default: '—',
        description: '提示文案（显示在指示器下方，空串不渲染）',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '包裹内容（spinning 时覆盖半透明遮罩）' },
    ],
  },
  notes: ['纯展示组件，无事件；指示器动画由样式驱动，可通过 prefers-reduced-motion 减弱。'],
  a11y: ['加载指示器携带 aria-live 区域与 busy 状态，读屏可感知"加载中"；tip 作为可朗读说明。'],
};

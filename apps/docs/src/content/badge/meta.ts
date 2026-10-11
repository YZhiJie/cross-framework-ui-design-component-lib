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
  summary: '以角标形式展示消息数量或状态红点，可包裹任意内容，也可独立使用。',
  features: [
    '包裹模式：徽标悬浮于内容右上角；无子内容时独立渲染',
    'count 超过 max 时显示 `${max}+`（max 默认 99）',
    'dot 点状徽标，忽略具体数值；showZero 控制 count 为 0 时是否显示',
  ],
  scenarios: ['未读消息 / 通知数量、有新内容的状态红点等场景。'],
  demos: [
    {
      id: 'basic',
      title: '计数与上限',
      description: 'count 动态变化，超过 max 后折叠为 99+。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: '红点 / 零值 / 独立',
      description: 'dot 仅提示有更新；showZero 决定 0 是否展示；无包裹内容时独立显示。',
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
        description: '徽标数值（未提供时不显示；dot 模式仅作无障碍语义）',
      },
      { name: 'max', type: 'number', default: '99', description: '数值上限（超出显示 `${max}+`）' },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: '点状徽标（忽略 count 与 max）',
      },
      {
        name: 'showZero',
        type: 'boolean',
        default: 'false',
        description: 'count 为 0 时是否显示徽标（默认隐藏）',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '徽标包裹的内容（未提供时徽标独立渲染）' },
    ],
  },
  notes: ['纯展示组件，无事件；count 为 0 且未开启 showZero 时徽标不占位。'],
  a11y: ['数值徽标以可读文本暴露数量语义；dot 模式作为状态提示，装饰性内容对读屏隐藏。'],
};

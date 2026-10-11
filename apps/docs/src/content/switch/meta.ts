import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const switchMeta: ComponentMeta = {
  name: 'Switch',
  slug: 'switch',
  title: '开关',
  category: 'form',
  summary: '布尔值开关选择器，支持受控 / 非受控双模式与加载态。',
  features: [
    '受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value',
    'sm / md 两种尺寸',
    'disabled 禁用、loading 加载态（加载中切换被忽略，滑块显示 Spinner）',
    '通过 ref 暴露 focus() 命令式聚焦',
  ],
  scenarios: ['通知开关、功能启停、协议同意等布尔设置的即时切换场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控用法',
      description: '绑定 value 并监听 change 同步外部状态，Vue 端推荐 v-model:value。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '尺寸与状态',
      description: '小尺寸、非受控默认开启、禁用与加载态。',
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'boolean', default: '—', description: '受控选中状态（提供即受控）' },
      { name: 'defaultValue', type: 'boolean', default: 'false', description: '非受控初始状态' },
      { name: 'size', type: `'sm' | 'md'`, default: `'md'`, description: '尺寸' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用' },
      { name: 'loading', type: 'boolean', default: 'false', description: '加载中（切换被忽略）' },
      {
        name: 'onChange',
        type: '(value: boolean) => void',
        default: '—',
        description: '状态变更回调',
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
      { vue: 'change', react: 'onChange', payload: 'boolean', description: '切换后的选中值' },
      { vue: 'update:value', react: '—', payload: 'boolean', description: 'v-model:value 回写' },
    ],
    slots: [],
  },
  notes: [
    '受控模式下组件不自改状态，仅通过 change / update:value 回调通知外部同步。',
    'loading 为 true 时点击切换被忽略，但不禁用样式，适合"切换中等待异步结果"场景。',
  ],
  a11y: [
    '渲染为 role="switch" 的按钮，携带 aria-checked；禁用时携带 disabled，支持空格 / 回车切换。',
  ],
};

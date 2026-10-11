import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const checkboxMeta: ComponentMeta = {
  name: 'Checkbox',
  slug: 'checkbox',
  title: '复选框',
  category: 'form',
  summary: '在一组可选项中进行多选，或单独使用表示两种状态的切换，支持半选态。',
  features: [
    '受控 / 非受控双模式，Vue 端支持 v-model:value',
    'indeterminate 半选态（常用于"全选"联动，点击后切换为全选）',
    'disabled 禁用；label 文案通过默认插槽 / children 传入',
  ],
  scenarios: ['协议勾选、条件筛选、表格行选择与全选联动等场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控复选框',
      description: '绑定布尔值，监听 change 获取切换后的选中状态。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '半选态与禁用',
      description: 'indeterminate 表示"部分选中"；disabled 下点击无效。',
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
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: '半选状态（点击后切换为全选）',
      },
      {
        name: 'onChange',
        type: '(value: boolean) => void',
        default: '—',
        description: '状态变更回调（载荷为切换后的选中值）',
      },
    ],
    events: [
      { vue: 'change', react: 'onChange', payload: 'value: boolean', description: '选中状态变更' },
      { vue: 'update:value', react: '—', payload: 'boolean', description: 'v-model:value 回写' },
    ],
    slots: [{ vue: 'default', react: 'children', description: '标签内容' }],
  },
  notes: [
    '半选（indeterminate）仅是视觉状态，表示"部分选中"；点击后半选消除并切换为全选。',
    '实现"全选 / 全不选 / 半选"三态联动时，需由外部根据子项选中数量计算 indeterminate 与 value。',
  ],
  a11y: ['底层使用原生 checkbox 输入语义，键盘空格可切换，禁用状态携带 disabled 属性。'],
};

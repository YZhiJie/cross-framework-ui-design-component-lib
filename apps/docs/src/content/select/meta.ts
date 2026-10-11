import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const selectMeta: ComponentMeta = {
  name: 'Select',
  slug: 'select',
  title: '下拉选择',
  category: 'form',
  summary: '从弹出的选项面板中选择一个值，支持禁用项、清空与完整的键盘操作。',
  features: [
    '受控 / 非受控双模式，Vue 端支持 v-model:value',
    'options 配置数组驱动渲染，单个选项可 disabled',
    'clearable 已选中时显示清空按钮；整组件 disabled 不可交互',
    '键盘支持：上下方向键移动高亮（跳过禁用项）、Enter 确认、Esc 关闭',
  ],
  scenarios: ['选项数量较多、不适合用 Radio 平铺的单选表单字段。'],
  demos: [
    {
      id: 'basic',
      title: '受控与清空',
      description: 'options 中可对单项设置 disabled；clearable 支持一键清空。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '默认值与禁用',
      description: 'defaultValue 指定初始选中；disabled 禁用整个选择器。',
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'string', default: '—', description: '受控选中值（提供即受控）' },
      { name: 'defaultValue', type: 'string', default: '—', description: '非受控初始选中值' },
      {
        name: 'options',
        type: 'SelectOption[]',
        default: '—',
        required: true,
        description: '选项数组',
      },
      { name: 'placeholder', type: 'string', default: '—', description: '占位文案' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: '是否显示清空按钮（仅已选中时）',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: '选中值变更回调',
      },
      { name: 'onClear', type: '() => void', default: '—', description: '清空回调' },
    ],
    events: [
      { vue: 'change', react: 'onChange', payload: 'value: string', description: '选中值变更' },
      { vue: 'clear', react: 'onClear', payload: '—', description: '清空选中值' },
      { vue: 'update:value', react: '—', payload: 'string', description: 'v-model:value 回写' },
    ],
    types: [
      {
        name: 'SelectOption',
        definition: `interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}`,
        description: '下拉选项配置。',
      },
    ],
  },
  notes: [
    '禁用选项不响应点击与键盘高亮，选中禁用项的操作会被静默忽略。',
    '点击组件外部会收起面板且不改变选中值。',
  ],
  a11y: ['选择器可通过 Tab 聚焦，方向键 / Enter / Esc 完成全部键盘操作；禁用项携带禁用语义。'],
};

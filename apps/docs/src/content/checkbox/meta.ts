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
  summary: {
    'zh-CN': '在一组可选项中进行多选，或单独使用表示两种状态的切换，支持半选态。',
    'en-US':
      'Select multiple options from a set, or use standalone as a two-state toggle, with indeterminate state support.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式，Vue 端支持 v-model:value',
      'en-US': 'Controlled and uncontrolled modes; v-model:value on Vue',
    },
    {
      'zh-CN': 'indeterminate 半选态（常用于"全选"联动，点击后切换为全选）',
      'en-US':
        'Indeterminate state via indeterminate (often used for "select all"; clicking switches to fully checked)',
    },
    {
      'zh-CN': 'disabled 禁用；label 文案通过默认插槽 / children 传入',
      'en-US': 'Disabled state; label text is passed via the default slot / children',
    },
  ],
  scenarios: [
    {
      'zh-CN': '协议勾选、条件筛选、表格行选择与全选联动等场景。',
      'en-US':
        'Agreement checkboxes, conditional filtering, table row selection with select-all linkage, and similar scenarios.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控复选框', 'en-US': 'Controlled Checkbox' },
      description: {
        'zh-CN': '绑定布尔值，监听 change 获取切换后的选中状态。',
        'en-US': 'Bind a boolean and listen to change for the checked state after toggle.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '半选态与禁用', 'en-US': 'Indeterminate & Disabled' },
      description: {
        'zh-CN': 'indeterminate 表示"部分选中"；disabled 下点击无效。',
        'en-US': 'indeterminate means "partially selected"; clicks have no effect when disabled.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'boolean',
        default: '—',
        description: {
          'zh-CN': '受控选中状态（提供即受控）',
          'en-US': 'Controlled checked state (controlled when provided)',
        },
      },
      {
        name: 'defaultValue',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '非受控初始状态', 'en-US': 'Uncontrolled initial state' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '半选状态（点击后切换为全选）',
          'en-US': 'Indeterminate state (clicking switches to fully checked)',
        },
      },
      {
        name: 'onChange',
        type: '(value: boolean) => void',
        default: '—',
        description: {
          'zh-CN': '状态变更回调（载荷为切换后的选中值）',
          'en-US': 'State change callback (payload is the checked value after toggle)',
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
        vue: 'change',
        react: 'onChange',
        payload: 'value: boolean',
        description: { 'zh-CN': '选中状态变更', 'en-US': 'Fired when the checked state changes' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'boolean',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '标签内容', 'en-US': 'Label content' },
      },
      {
        vue: 'checkIcon',
        react: 'renderCheckIcon',
        description: {
          'zh-CN': '自定义选中勾选图标',
          'en-US': 'Custom checked checkmark icon',
        },
      },
      {
        vue: 'indeterminateIcon',
        react: 'renderIndeterminateIcon',
        description: {
          'zh-CN': '自定义半选图标',
          'en-US': 'Custom indeterminate icon',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '半选（indeterminate）仅是视觉状态，表示"部分选中"；点击后半选消除并切换为全选。',
      'en-US':
        'Indeterminate is only a visual state meaning "partially selected"; clicking clears it and switches to fully checked.',
    },
    {
      'zh-CN':
        '实现"全选 / 全不选 / 半选"三态联动时，需由外部根据子项选中数量计算 indeterminate 与 value。',
      'en-US':
        'For "all / none / partial" tri-state linkage, compute indeterminate and value externally from the number of selected children.',
    },
  ],
  a11y: [
    {
      'zh-CN': '底层使用原生 checkbox 输入语义，键盘空格可切换，禁用状态携带 disabled 属性。',
      'en-US':
        'Built on native checkbox input semantics; toggles with the Space key and carries the disabled attribute when disabled.',
    },
  ],
};

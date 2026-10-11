import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const inputMeta: ComponentMeta = {
  name: 'Input',
  slug: 'input',
  title: '输入框',
  category: 'basic',
  summary: '基础文本输入框，支持受控 / 非受控、清除按钮、前后缀与多种原生类型。',
  features: [
    '受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value',
    '支持 text / password / number / email / search / tel / url 原生类型',
    'disabled 禁用、readonly 只读、maxLength 最大长度',
    'clearable 显示清除按钮；prefix / suffix 前后缀内容可定制',
    '通过 ref 暴露 focus() 命令式聚焦',
  ],
  scenarios: ['表单文本录入、搜索框、带图标的复合输入等场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控用法',
      description: '绑定 value 同步外部状态，clearable 提供一键清空。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '禁用 / 只读 / 前缀',
      description: '禁用与只读均透传原生属性；prefix 插槽可放置图标等前置内容。',
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'string', default: '—', description: '受控值（提供即受控）' },
      { name: 'defaultValue', type: 'string', default: '—', description: '非受控初始值' },
      {
        name: 'type',
        type: `'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url'`,
        default: `'text'`,
        description: '原生 input 类型',
      },
      { name: 'placeholder', type: 'string', default: '—', description: '占位文本' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: '只读状态（双端 prop 同名，内部映射 DOM readOnly）',
      },
      { name: 'maxLength', type: 'number', default: '—', description: '最大输入长度' },
      { name: 'clearable', type: 'boolean', default: 'false', description: '是否显示清除图标' },
      {
        name: 'onInput',
        type: '(value: string) => void',
        default: '—',
        description: '输入回调（每次键入）',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: '值变更提交回调（失焦或回车）',
      },
      {
        name: 'onFocus',
        type: '(event: FocusEvent) => void',
        default: '—',
        description: '聚焦回调',
      },
      {
        name: 'onBlur',
        type: '(event: FocusEvent) => void',
        default: '—',
        description: '失焦回调',
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: '清空回调（点击清除图标）',
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
      { vue: 'input', react: 'onInput', payload: 'string', description: '每次键入触发' },
      { vue: 'change', react: 'onChange', payload: 'string', description: '失焦或回车提交时触发' },
      { vue: 'focus', react: 'onFocus', payload: 'FocusEvent', description: '获得焦点' },
      { vue: 'blur', react: 'onBlur', payload: 'FocusEvent', description: '失去焦点' },
      { vue: 'clear', react: 'onClear', payload: '—', description: '点击清除图标' },
      { vue: 'update:value', react: '—', payload: 'string', description: 'v-model:value 回写' },
    ],
    slots: [
      { vue: 'prefix', react: 'renderPrefix', description: '前置内容（如图标）' },
      { vue: 'suffix', react: 'renderSuffix', description: '后置内容' },
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: '自定义清除图标（clearable 模式）',
      },
    ],
  },
  notes: [
    'input 事件在每次键入时触发；change 事件在失焦或回车时触发，二者语义不同，注意按需监听。',
    'readonly 允许聚焦与复制但不可编辑，disabled 完全不可交互且不会随表单提交。',
  ],
  a11y: ['渲染为原生 <input>，disabled / readonly 透传原生属性，保留原生焦点与键盘输入行为。'],
};

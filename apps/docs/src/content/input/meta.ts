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
  summary: {
    'zh-CN': '基础文本输入框，支持受控 / 非受控、清除按钮、前后缀与多种原生类型。',
    'en-US':
      'A basic text input with controlled / uncontrolled modes, a clear button, prefix / suffix, and multiple native types.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes (controlled when value is provided); v-model:value on Vue',
    },
    {
      'zh-CN': '支持 text / password / number / email / search / tel / url 原生类型',
      'en-US': 'Supports native types: text / password / number / email / search / tel / url',
    },
    {
      'zh-CN': 'disabled 禁用、readonly 只读、maxLength 最大长度',
      'en-US': 'Disabled state, read-only state, and maxLength limit',
    },
    {
      'zh-CN': 'clearable 显示清除按钮；prefix / suffix 前后缀内容可定制',
      'en-US': 'Clear button via clearable; customizable prefix / suffix content',
    },
    {
      'zh-CN': '通过 ref 暴露 focus() 命令式聚焦',
      'en-US': 'Imperative focus() exposed via ref',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单文本录入、搜索框、带图标的复合输入等场景。',
      'en-US': 'Form text entry, search boxes, composite inputs with icons, and similar scenarios.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控用法', 'en-US': 'Controlled Usage' },
      description: {
        'zh-CN': '绑定 value 同步外部状态，clearable 提供一键清空。',
        'en-US': 'Bind value to sync external state; clearable offers one-click clearing.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '禁用 / 只读 / 前缀', 'en-US': 'Disabled / Readonly / Prefix' },
      description: {
        'zh-CN': '禁用与只读均透传原生属性；prefix 插槽可放置图标等前置内容。',
        'en-US':
          'Disabled and readonly pass through to native attributes; the prefix slot holds leading content such as icons.',
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
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '受控值（提供即受控）',
          'en-US': 'Controlled value (controlled when provided)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '非受控初始值', 'en-US': 'Uncontrolled initial value' },
      },
      {
        name: 'type',
        type: `'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url'`,
        default: `'text'`,
        description: { 'zh-CN': '原生 input 类型', 'en-US': 'Native input type' },
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '占位文本', 'en-US': 'Placeholder text' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '只读状态（双端 prop 同名，内部映射 DOM readOnly）',
          'en-US': 'Read-only state (same prop name on both frameworks; mapped to DOM readOnly)',
        },
      },
      {
        name: 'maxLength',
        type: 'number',
        default: '—',
        description: { 'zh-CN': '最大输入长度', 'en-US': 'Maximum input length' },
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '是否显示清除图标', 'en-US': 'Whether to show the clear icon' },
      },
      {
        name: 'onInput',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '输入回调（每次键入）',
          'en-US': 'Input callback (on every keystroke)',
        },
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '值变更提交回调（失焦或回车）',
          'en-US': 'Value commit callback (on blur or Enter)',
        },
      },
      {
        name: 'onFocus',
        type: '(event: FocusEvent) => void',
        default: '—',
        description: { 'zh-CN': '聚焦回调', 'en-US': 'Focus callback' },
      },
      {
        name: 'onBlur',
        type: '(event: FocusEvent) => void',
        default: '—',
        description: { 'zh-CN': '失焦回调', 'en-US': 'Blur callback' },
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '清空回调（点击清除图标）',
          'en-US': 'Clear callback (fired when the clear icon is clicked)',
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
        vue: 'input',
        react: 'onInput',
        payload: 'string',
        description: { 'zh-CN': '每次键入触发', 'en-US': 'Fired on every keystroke' },
      },
      {
        vue: 'change',
        react: 'onChange',
        payload: 'string',
        description: {
          'zh-CN': '失焦或回车提交时触发',
          'en-US': 'Fired when the value is committed on blur or Enter',
        },
      },
      {
        vue: 'focus',
        react: 'onFocus',
        payload: 'FocusEvent',
        description: { 'zh-CN': '获得焦点', 'en-US': 'Fired on focus' },
      },
      {
        vue: 'blur',
        react: 'onBlur',
        payload: 'FocusEvent',
        description: { 'zh-CN': '失去焦点', 'en-US': 'Fired on blur' },
      },
      {
        vue: 'clear',
        react: 'onClear',
        payload: '—',
        description: { 'zh-CN': '点击清除图标', 'en-US': 'Fired when the clear icon is clicked' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'prefix',
        react: 'renderPrefix',
        description: { 'zh-CN': '前置内容（如图标）', 'en-US': 'Leading content (e.g. an icon)' },
      },
      {
        vue: 'suffix',
        react: 'renderSuffix',
        description: { 'zh-CN': '后置内容', 'en-US': 'Trailing content' },
      },
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: {
          'zh-CN': '自定义清除图标（clearable 模式）',
          'en-US': 'Custom clear icon (in clearable mode)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'input 事件在每次键入时触发；change 事件在失焦或回车时触发，二者语义不同，注意按需监听。',
      'en-US':
        'The input event fires on every keystroke, while change fires on blur or Enter; they have different semantics, so listen as needed.',
    },
    {
      'zh-CN': 'readonly 允许聚焦与复制但不可编辑，disabled 完全不可交互且不会随表单提交。',
      'en-US':
        'readonly allows focus and copying but not editing; disabled blocks all interaction and is excluded from form submission.',
    },
  ],
  a11y: [
    {
      'zh-CN': '渲染为原生 <input>，disabled / readonly 透传原生属性，保留原生焦点与键盘输入行为。',
      'en-US':
        'Renders as a native <input> with disabled / readonly passed through, preserving native focus and keyboard input behavior.',
    },
  ],
};

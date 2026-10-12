import type { ComponentMeta } from '../types';

import TypeVue from './demos/type.vue';
import SizeVue from './demos/size.vue';
import StateVue from './demos/state.vue';
// React demo 导入不带扩展名（同目录 .vue / .tsx 基名相同，TS/Vite 解析 .tsx）
import TypeReact from './demos/type';
import SizeReact from './demos/size';
import StateReact from './demos/state';

import typeVueSource from './demos/type.vue?raw';
import sizeVueSource from './demos/size.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import typeReactSource from './demos/type.tsx?raw';
import sizeReactSource from './demos/size.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const buttonMeta: ComponentMeta = {
  name: 'Button',
  slug: 'button',
  title: '按钮',
  category: 'basic',
  summary: {
    'zh-CN': '基础按钮组件，支持多种语义类型、尺寸、加载与禁用状态。',
    'en-US':
      'A basic button component with multiple semantic types, sizes, loading and disabled states.',
  },
  features: [
    {
      'zh-CN': '四种语义类型：default / primary / danger / link',
      'en-US': 'Four semantic types: default / primary / danger / link',
    },
    {
      'zh-CN': '三种尺寸：sm / md（默认）/ lg',
      'en-US': 'Three sizes: sm / md (default) / lg',
    },
    {
      'zh-CN': 'disabled 禁用、loading 加载态（加载中点击被忽略）',
      'en-US': 'Disabled state and loading state (clicks are ignored while loading)',
    },
    {
      'zh-CN': 'block 块级按钮（宽度撑满容器）',
      'en-US': 'Block-level button that stretches to the container width',
    },
    {
      'zh-CN': '前置图标与加载图标均可通过插槽 / 回调自定义',
      'en-US': 'Leading icon and loading icon are customizable via slot / render callback',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单提交、操作触发、导航跳转等一切需要点击交互的场景。',
      'en-US':
        'Any click-driven interaction such as form submission, action triggering, or navigation.',
    },
  ],
  demos: [
    {
      id: 'type',
      title: { 'zh-CN': '按钮类型', 'en-US': 'Button Types' },
      description: {
        'zh-CN': '通过 type 指定语义类型，默认 default。',
        'en-US': 'Use type to set the semantic type; defaults to default.',
      },
      vueComponent: TypeVue,
      reactComponent: TypeReact,
      vueSource: typeVueSource,
      reactSource: typeReactSource,
    },
    {
      id: 'size',
      title: { 'zh-CN': '尺寸与块级', 'en-US': 'Sizes & Block' },
      description: {
        'zh-CN': 'sm / md / lg 三档尺寸；block 使按钮宽度撑满父容器。',
        'en-US':
          'Three sizes: sm / md / lg. The block prop stretches the button to its parent width.',
      },
      vueComponent: SizeVue,
      reactComponent: SizeReact,
      vueSource: sizeVueSource,
      reactSource: sizeReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '禁用与加载', 'en-US': 'Disabled & Loading' },
      description: {
        'zh-CN': 'disabled 完全禁用交互；loading 时显示加载图标且点击被忽略，适合异步提交场景。',
        'en-US':
          'disabled turns off all interaction; loading shows a spinner and ignores clicks, ideal for async submissions.',
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
        name: 'type',
        type: `'default' | 'primary' | 'danger' | 'link'`,
        default: `'default'`,
        description: { 'zh-CN': '按钮语义类型', 'en-US': 'Semantic type of the button' },
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: { 'zh-CN': '按钮尺寸', 'en-US': 'Button size' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '加载状态（显示加载图标，点击被忽略）',
          'en-US': 'Loading state (shows a spinner; clicks are ignored)',
        },
      },
      {
        name: 'block',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '块级按钮（宽度撑满容器）',
          'en-US': 'Block button (stretches to container width)',
        },
      },
      {
        name: 'onClick',
        type: '(event: MouseEvent) => void',
        default: '—',
        description: {
          'zh-CN': '点击回调（由适配层桥接为框架事件）',
          'en-US': 'Click callback (bridged to framework events by the adapter)',
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
        vue: 'click',
        react: 'onClick',
        payload: 'MouseEvent',
        description: {
          'zh-CN': '点击按钮时触发（disabled / loading 状态下不触发）',
          'en-US': 'Fired on click (not fired while disabled or loading)',
        },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '按钮内容', 'en-US': 'Button content' },
      },
      {
        vue: 'icon',
        react: 'renderIcon',
        description: {
          'zh-CN': '前置图标（loading 时隐藏）',
          'en-US': 'Leading icon (hidden while loading)',
        },
      },
      {
        vue: 'loadingIcon',
        react: 'renderLoadingIcon',
        description: {
          'zh-CN': '加载态图标（默认为旋转 Spinner）',
          'en-US': 'Loading icon (defaults to a spinning spinner)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': 'loading 状态下点击事件被忽略，避免异步提交期间重复触发。',
      'en-US':
        'Clicks are ignored while loading to prevent duplicate triggers during async submission.',
    },
    {
      'zh-CN': 'type="link" 仅表现为链接样式，语义仍是 button 元素；需要原生导航请自行包裹 <a>。',
      'en-US':
        'type="link" only looks like a link; the element is still a button. Wrap an <a> yourself when native navigation is needed.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '渲染为原生 <button>，disabled / loading 时携带 disabled 属性，键盘与读屏行为与原生按钮一致。',
      'en-US':
        'Renders as a native <button> with the disabled attribute applied when disabled or loading, matching native keyboard and screen-reader behavior.',
    },
  ],
};

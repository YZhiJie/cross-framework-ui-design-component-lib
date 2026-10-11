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
  summary: '基础按钮组件，支持多种语义类型、尺寸、加载与禁用状态。',
  features: [
    '四种语义类型：default / primary / danger / link',
    '三种尺寸：sm / md（默认）/ lg',
    'disabled 禁用、loading 加载态（加载中点击被忽略）',
    'block 块级按钮（宽度撑满容器）',
    '前置图标与加载图标均可通过插槽 / 回调自定义',
  ],
  scenarios: ['表单提交、操作触发、导航跳转等一切需要点击交互的场景。'],
  demos: [
    {
      id: 'type',
      title: '按钮类型',
      description: '通过 type 指定语义类型，默认 default。',
      vueComponent: TypeVue,
      reactComponent: TypeReact,
      vueSource: typeVueSource,
      reactSource: typeReactSource,
    },
    {
      id: 'size',
      title: '尺寸与块级',
      description: 'sm / md / lg 三档尺寸；block 使按钮宽度撑满父容器。',
      vueComponent: SizeVue,
      reactComponent: SizeReact,
      vueSource: sizeVueSource,
      reactSource: sizeReactSource,
    },
    {
      id: 'state',
      title: '禁用与加载',
      description: 'disabled 完全禁用交互；loading 时显示加载图标且点击被忽略，适合异步提交场景。',
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
        description: '按钮语义类型',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: '按钮尺寸',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: '加载状态（显示加载图标，点击被忽略）',
      },
      { name: 'block', type: 'boolean', default: 'false', description: '块级按钮（宽度撑满容器）' },
      {
        name: 'onClick',
        type: '(event: MouseEvent) => void',
        default: '—',
        description: '点击回调（由适配层桥接为框架事件）',
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
      {
        vue: 'click',
        react: 'onClick',
        payload: 'MouseEvent',
        description: '点击按钮时触发（disabled / loading 状态下不触发）',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '按钮内容' },
      { vue: 'icon', react: 'renderIcon', description: '前置图标（loading 时隐藏）' },
      {
        vue: 'loadingIcon',
        react: 'renderLoadingIcon',
        description: '加载态图标（默认为旋转 Spinner）',
      },
    ],
  },
  notes: [
    'loading 状态下点击事件被忽略，避免异步提交期间重复触发。',
    'type="link" 仅表现为链接样式，语义仍是 button 元素；需要原生导航请自行包裹 <a>。',
  ],
  a11y: [
    '渲染为原生 <button>，disabled / loading 时携带 disabled 属性，键盘与读屏行为与原生按钮一致。',
  ],
};

import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';
import TextVue from './demos/text.vue';
import TextReact from './demos/text';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import textVueSource from './demos/text.vue?raw';
import textReactSource from './demos/text.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const switchMeta: ComponentMeta = {
  name: 'Switch',
  slug: 'switch',
  title: '开关',
  category: 'form',
  summary: {
    'zh-CN': '布尔值开关选择器，支持受控 / 非受控双模式与加载态。',
    'en-US': 'A boolean toggle switch with controlled / uncontrolled modes and a loading state.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes (controlled when value is provided); v-model:value on Vue',
    },
    { 'zh-CN': 'sm / md 两种尺寸', 'en-US': 'Two sizes: sm / md' },
    {
      'zh-CN': 'disabled 禁用、loading 加载态（加载中切换被忽略，滑块显示 Spinner）',
      'en-US':
        'Disabled state and loading state (toggles are ignored while loading; the thumb shows a spinner)',
    },
    {
      'zh-CN':
        'checkedText / uncheckedText 双态文本：显示在轨道内滑块对侧，超长自动截断（title 提示）',
      'en-US':
        'Dual-state text via checkedText / uncheckedText: shown inside the track on the opposite side of the thumb, auto-truncated when too long (with a title tooltip)',
    },
    {
      'zh-CN': 'checkedColor / uncheckedColor 自定义开 / 关背景色（CSS 颜色值，透传 CSS 变量）',
      'en-US':
        'checkedColor / uncheckedColor customize the on / off background colors (CSS color values, passed via CSS variables)',
    },
    {
      'zh-CN': 'beforeChange 切换前钩子：返回 false 或 reject 的 Promise 可阻止切换',
      'en-US':
        'beforeChange pre-toggle hook: returning false or a rejected promise prevents the toggle',
    },
    {
      'zh-CN': '通过 ref 暴露 focus() 命令式聚焦',
      'en-US': 'Imperative focus() exposed via ref',
    },
  ],
  scenarios: [
    {
      'zh-CN': '通知开关、功能启停、协议同意等布尔设置的即时切换场景。',
      'en-US':
        'Instant toggling of boolean settings such as notification switches, feature flags, and agreement consent.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控用法', 'en-US': 'Controlled Usage' },
      description: {
        'zh-CN': '绑定 value 并监听 change 同步外部状态，Vue 端推荐 v-model:value。',
        'en-US':
          'Bind value and listen to change to sync external state; v-model:value is recommended on Vue.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '尺寸与状态', 'en-US': 'Sizes & States' },
      description: {
        'zh-CN': '小尺寸、非受控默认开启、禁用与加载态。',
        'en-US': 'Small size, uncontrolled default-on, disabled, and loading states.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
    {
      id: 'text',
      title: { 'zh-CN': '双态文本', 'en-US': 'Dual-State Text' },
      description: {
        'zh-CN': 'checkedText / uncheckedText 显示在轨道内；不传保持纯开关模式。',
        'en-US':
          'checkedText / uncheckedText are shown inside the track; omit them for a plain switch.',
      },
      vueComponent: TextVue,
      reactComponent: TextReact,
      vueSource: textVueSource,
      reactSource: textReactSource,
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
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: { 'zh-CN': '尺寸', 'en-US': 'Switch size' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用', 'en-US': 'Disabled state' },
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '加载中（切换被忽略）',
          'en-US': 'Loading state (toggles are ignored)',
        },
      },
      {
        name: 'checkedText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '开启态文本（轨道内滑块左侧；空串视为未提供；超长截断 + title）',
          'en-US':
            'On-state text (left of the thumb inside the track; an empty string is treated as not provided; truncated with a title tooltip when too long)',
        },
      },
      {
        name: 'uncheckedText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '关闭态文本（轨道内滑块右侧；空串视为未提供；超长截断 + title）',
          'en-US':
            'Off-state text (right of the thumb inside the track; an empty string is treated as not provided; truncated with a title tooltip when too long)',
        },
      },
      {
        name: 'checkedColor',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '开启态背景色（CSS 颜色值，通过 --xui-switch-checked-color 透传）',
          'en-US':
            'On-state background color (CSS color value, passed via --xui-switch-checked-color)',
        },
      },
      {
        name: 'uncheckedColor',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '关闭态背景色（CSS 颜色值，通过 --xui-switch-unchecked-color 透传）',
          'en-US':
            'Off-state background color (CSS color value, passed via --xui-switch-unchecked-color)',
        },
      },
      {
        name: 'beforeChange',
        type: '(value: boolean) => boolean | Promise<boolean>',
        default: '—',
        description: {
          'zh-CN': '切换前钩子，返回 false 或 reject 的 Promise 可阻止切换',
          'en-US': 'Pre-toggle hook; returning false or a rejected promise prevents the toggle',
        },
      },
      {
        name: 'onChange',
        type: '(value: boolean) => void',
        default: '—',
        description: { 'zh-CN': '状态变更回调', 'en-US': 'State change callback' },
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
        payload: 'boolean',
        description: {
          'zh-CN': '切换后的选中值',
          'en-US': 'Fired with the checked value after toggle',
        },
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
        vue: 'loadingIcon',
        react: 'renderLoadingIcon',
        description: {
          'zh-CN': '自定义加载图标（替换内置 Spinner）',
          'en-US': 'Custom loading icon (replaces the built-in spinner)',
        },
      },
      {
        vue: 'checkedIcon',
        react: 'renderCheckedIcon',
        description: {
          'zh-CN': '自定义开启态滑块内图标（替换默认对勾）',
          'en-US': 'Custom on-state thumb icon (replaces the default checkmark)',
        },
      },
      {
        vue: 'uncheckedIcon',
        react: 'renderUncheckedIcon',
        description: {
          'zh-CN': '自定义关闭态滑块内图标（替换默认关闭图标）',
          'en-US': 'Custom off-state thumb icon (replaces the default close icon)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '受控模式下组件不自改状态，仅通过 change / update:value 回调通知外部同步。',
      'en-US':
        'In controlled mode the component never changes its own state; it only notifies the external side via change / update:value.',
    },
    {
      'zh-CN': 'loading 为 true 时点击切换被忽略，但不禁用样式，适合"切换中等待异步结果"场景。',
      'en-US':
        'When loading is true, click toggles are ignored but the disabled styling is not applied — ideal for "waiting for an async result after toggling" scenarios.',
    },
    {
      'zh-CN':
        'beforeChange 返回 false 或 reject 的 Promise 时阻止切换；返回 true 或 resolve(true) 时正常切换。',
      'en-US':
        'beforeChange returning false or a rejected promise prevents the toggle; returning true or resolving to true allows it.',
    },
    {
      'zh-CN':
        '双态文本对读屏隐藏（状态由 role="switch" + aria-checked 传达），两文本常驻 DOM 并以 CSS Grid 重叠，轨道宽度自适应较宽文本，切换时无宽度抖动。',
      'en-US':
        'Dual-state text is hidden from screen readers (state is conveyed via role="switch" + aria-checked); both texts stay in the DOM overlapped with CSS Grid, the track width adapts to the wider text, and no width jitter occurs on toggle.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '渲染为 role="switch" 的按钮，携带 aria-checked；禁用时携带 disabled，支持空格 / 回车切换。',
      'en-US':
        'Renders as a button with role="switch" and aria-checked; carries disabled when disabled, and toggles with Space / Enter.',
    },
  ],
};

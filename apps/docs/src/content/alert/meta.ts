import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ClosableVue from './demos/closable.vue';
import BasicReact from './demos/basic';
import ClosableReact from './demos/closable';

import basicVueSource from './demos/basic.vue?raw';
import closableVueSource from './demos/closable.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import closableReactSource from './demos/closable.tsx?raw';

export const alertMeta: ComponentMeta = {
  name: 'Alert',
  slug: 'alert',
  title: '警告提示',
  category: 'feedback',
  summary: {
    'zh-CN': '静态内嵌的提示横幅，用于展示需用户关注的信息，支持四种语义、图标与关闭。',
    'en-US':
      'A static inline banner for information that needs user attention, with four semantic types, icon and closable support.',
  },
  features: [
    {
      'zh-CN': '四种语义类型：info / success / warning / error',
      'en-US': 'Four semantic types: info / success / warning / error',
    },
    {
      'zh-CN': 'title 标题 + description 描述（描述也可用默认插槽 / children）',
      'en-US': 'title plus description (description can also use the default slot / children)',
    },
    {
      'zh-CN': 'showIcon 显示类型图标，closable 可手动关闭（隐藏后触发 close）',
      'en-US':
        'showIcon shows the type icon; closable allows manual close (close fires after hiding)',
    },
    {
      'zh-CN': 'title / icon 均提供插槽，可完全自定义（React 对应 renderTitle / renderIcon）',
      'en-US':
        'title and icon both offer slots for full customization (renderTitle / renderIcon in React)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单校验汇总、页面级通知、操作后果说明等常驻提示场景。',
      'en-US':
        'Persistent inline notices such as form validation summaries, page-level notifications, and consequence explanations.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '四种语义', 'en-US': 'Four Semantic Types' },
      description: {
        'zh-CN': '通过 type 切换 info / success / warning / error 配色与语义。',
        'en-US':
          'Use type to switch between info / success / warning / error colors and semantics.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'closable',
      title: { 'zh-CN': '图标 / 关闭 / 自定义标题', 'en-US': 'Icon / Closable / Custom Title' },
      description: {
        'zh-CN': 'showIcon + closable，标题通过 title 插槽自定义。',
        'en-US': 'showIcon plus closable; the title is customized via the title slot.',
      },
      vueComponent: ClosableVue,
      reactComponent: ClosableReact,
      vueSource: closableVueSource,
      reactSource: closableReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'type',
        type: `'info' | 'success' | 'warning' | 'error'`,
        default: `'info'`,
        description: { 'zh-CN': '语义类型', 'en-US': 'Semantic type' },
      },
      {
        name: 'title',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '标题', 'en-US': 'Title' },
      },
      {
        name: 'description',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '辅助描述（默认插槽的回退内容）',
          'en-US': 'Supporting description (fallback for the default slot)',
        },
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '是否可关闭', 'en-US': 'Whether it is closable' },
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '是否显示类型图标', 'en-US': 'Whether to show the type icon' },
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '关闭回调（组件隐藏后触发）',
          'en-US': 'Close callback (fired after the component hides)',
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
        vue: 'close',
        react: 'onClose',
        payload: '—',
        description: {
          'zh-CN': '点击关闭按钮、提示隐藏后触发',
          'en-US': 'Fired when the close button is clicked and the alert has hidden',
        },
      },
    ],
    slots: [
      {
        vue: 'closeIcon',
        react: 'renderCloseIcon',
        description: {
          'zh-CN': '自定义关闭图标（替换内置 close）',
          'en-US': 'Custom close icon (replaces the built-in close icon)',
        },
      },
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN': '描述内容（覆盖 description prop）',
          'en-US': 'Description content (overrides the description prop)',
        },
      },
      {
        vue: 'title',
        react: 'renderTitle',
        description: {
          'zh-CN': '标题（覆盖 title prop）',
          'en-US': 'Title (overrides the title prop)',
        },
      },
      {
        vue: 'icon',
        react: 'renderIcon',
        description: {
          'zh-CN': '类型图标（覆盖默认图标，showIcon 开启时生效）',
          'en-US': 'Type icon (overrides the default icon when showIcon is on)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': 'Alert 为页面内静态提示（非浮层）；需要自动消失的全局浮层请使用 Message。',
      'en-US':
        'Alert is a static in-page notice, not a floating layer. Use Message for auto-dismissing global toasts.',
    },
  ],
  a11y: [
    {
      'zh-CN': '提示区域按类型携带 role="status" / "alert" 等语义，关闭按钮可键盘操作。',
      'en-US':
        'The alert region carries role="status" / "alert" semantics per type; the close button is keyboard operable.',
    },
  ],
};

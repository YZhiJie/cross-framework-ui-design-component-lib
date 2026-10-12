import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const popconfirmMeta: ComponentMeta = {
  name: 'Popconfirm',
  slug: 'popconfirm',
  title: '气泡确认',
  category: 'feedback',
  summary: {
    'zh-CN': '点击元素弹出轻量确认气泡，适合"删除"等需要二次确认但不必打断整页的操作。',
    'en-US':
      'A lightweight confirmation bubble triggered by clicking an element, ideal for actions like "delete" that need a second confirmation without interrupting the whole page.',
  },
  features: [
    {
      'zh-CN': '点击触发元素切换气泡，确定 / 取消按钮在收起后分别回调 confirm / cancel',
      'en-US':
        'Clicking the trigger toggles the bubble; the OK / cancel buttons fire confirm / cancel after the bubble closes',
    },
    {
      'zh-CN':
        'confirmText / cancelText 自定义按钮文本（未提供时取全局语言包，zh-CN 默认"确定"/"取消"），placement 控制四方位',
      'en-US':
        'confirmText / cancelText customize the button labels (falling back to the global locale, zh-CN defaults to "确定"/"取消"); placement controls the four directions',
    },
    {
      'zh-CN': 'content 属性或 content 插槽 / renderContent 自定义确认文案；disabled 关闭交互',
      'en-US':
        'Confirmation text via the content prop or the content slot / renderContent; disabled turns off interaction',
    },
    {
      'zh-CN': '点击气泡外部仅收起，不触发任何回调',
      'en-US': 'Clicking outside only closes the bubble without firing any callback',
    },
  ],
  scenarios: [
    {
      'zh-CN': '删除 / 提交等轻量二次确认、危险操作前置拦截等场景。',
      'en-US':
        'Lightweight second confirmations for delete / submit actions, or pre-interception of dangerous operations.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '删除确认', 'en-US': 'Delete Confirmation' },
      description: {
        'zh-CN': '点击触发元素弹出确认，确定与取消分别触发不同回调。',
        'en-US':
          'Click the trigger to pop up the confirmation; OK and cancel fire separate callbacks.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: { 'zh-CN': '方位 / 按钮文本 / 禁用', 'en-US': 'Placement / Button Text / Disabled' },
      description: {
        'zh-CN': 'placement 右侧弹出并自定义按钮文案；disabled 下点击无效。',
        'en-US':
          'placement pops to the right with custom button text; clicks do nothing when disabled.',
      },
      vueComponent: VariantsVue,
      reactComponent: VariantsReact,
      vueSource: variantsVueSource,
      reactSource: variantsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'content',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '确认文案（content 插槽 / renderContent 可覆盖）',
          'en-US': 'Confirmation text (can be overridden by the content slot / renderContent)',
        },
      },
      {
        name: 'confirmText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '确认按钮文本；未提供时取全局语言包（zh-CN：确定）',
          'en-US': 'OK button text; falls back to the global locale when omitted (zh-CN: 确定)',
        },
      },
      {
        name: 'cancelText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '取消按钮文本；未提供时取全局语言包（zh-CN：取消）',
          'en-US': 'Cancel button text; falls back to the global locale when omitted (zh-CN: 取消)',
        },
      },
      {
        name: 'placement',
        type: `'top' | 'bottom' | 'left' | 'right'`,
        default: `'top'`,
        description: { 'zh-CN': '气泡方位', 'en-US': 'Bubble placement' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '禁用状态（运行时禁用会收起已开气泡）',
          'en-US': 'Disabled state (disabling at runtime closes an open bubble)',
        },
      },
      {
        name: 'onConfirm',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '点击确定回调（气泡收起后触发）',
          'en-US': 'OK click callback (fired after the bubble closes)',
        },
      },
      {
        name: 'onCancel',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '点击取消回调（气泡收起后触发）',
          'en-US': 'Cancel click callback (fired after the bubble closes)',
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
        vue: 'confirm',
        react: 'onConfirm',
        payload: '—',
        description: {
          'zh-CN': '点击确定（气泡收起后触发）',
          'en-US': 'Fired on OK click (after the bubble closes)',
        },
      },
      {
        vue: 'cancel',
        react: 'onCancel',
        payload: '—',
        description: {
          'zh-CN': '点击取消（气泡收起后触发）',
          'en-US': 'Fired on cancel click (after the bubble closes)',
        },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '触发元素', 'en-US': 'Trigger element' },
      },
      {
        vue: 'content',
        react: 'renderContent',
        description: {
          'zh-CN': '确认文案内容（覆盖 content prop）',
          'en-US': 'Confirmation content (overrides the content prop)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '点击外部关闭只收起气泡，不会触发 confirm 或 cancel，便于用户无副作用地放弃操作。',
      'en-US':
        'Clicking outside only closes the bubble without firing confirm or cancel, letting users back out with no side effects.',
    },
    {
      'zh-CN': '气泡为 CSS 包裹定位，与 Tooltip 类似，需注意父容器 overflow 裁剪。',
      'en-US':
        'The bubble uses CSS wrapper positioning like Tooltip, so watch out for clipping by parent overflow.',
    },
    {
      'zh-CN':
        '自带视口避让：首选方位空间不足时自动翻转（箭头跟随），溢出视口边缘时自动钳制，滚动与窗口 resize 时实时重算。',
      'en-US':
        'Built-in viewport collision handling: flips when the preferred placement lacks space (the arrow follows), clamps at viewport edges, and recalculates on scroll and window resize.',
    },
  ],
  a11y: [
    {
      'zh-CN': '确认 / 取消为原生按钮可键盘操作，气泡打开后焦点进入弹层，Esc 可取消关闭。',
      'en-US':
        'The OK / cancel buttons are native and keyboard operable; focus moves into the popup when it opens, and Esc cancels and closes it.',
    },
  ],
};

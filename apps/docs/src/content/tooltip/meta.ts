import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import TriggerVue from './demos/trigger.vue';
import BasicReact from './demos/basic';
import TriggerReact from './demos/trigger';

import basicVueSource from './demos/basic.vue?raw';
import triggerVueSource from './demos/trigger.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import triggerReactSource from './demos/trigger.tsx?raw';

export const tooltipMeta: ComponentMeta = {
  name: 'Tooltip',
  slug: 'tooltip',
  title: '文字提示',
  category: 'feedback',
  summary: {
    'zh-CN':
      '鼠标悬停或聚焦时展示的简单文字气泡，CSS 包裹定位（非 portal），支持四方位与两种触发。',
    'en-US':
      'A simple text bubble shown on hover or focus, positioned with a CSS wrapper (no portal), supporting four placements and two triggers.',
  },
  features: [
    {
      'zh-CN': 'placement 支持 top / bottom / left / right 四个方位',
      'en-US': 'placement supports top / bottom / left / right',
    },
    {
      'zh-CN': 'trigger 支持 hover（默认）与 focus；disabled 后不再响应触发',
      'en-US': 'trigger supports hover (default) and focus; disabled stops responding to triggers',
    },
    {
      'zh-CN': 'content 属性或 content 插槽 / renderContent 自定义提示内容',
      'en-US': 'Tooltip content via the content prop or the content slot / renderContent',
    },
  ],
  scenarios: [
    {
      'zh-CN': '图标按钮说明、字段含义解释、快捷操作提示等轻量辅助说明场景。',
      'en-US':
        'Lightweight hints such as icon button labels, field explanations, and shortcut tips.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '四个方位', 'en-US': 'Four Placements' },
      description: {
        'zh-CN': '鼠标悬停（或键盘聚焦）触发元素查看对应方位的气泡。',
        'en-US':
          'Hover (or keyboard-focus) the trigger elements to see the bubble at each placement.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'trigger',
      title: { 'zh-CN': 'focus 触发与禁用', 'en-US': 'Focus Trigger & Disabled' },
      description: {
        'zh-CN': 'trigger="focus" 适合输入框；disabled 完全关闭提示能力。',
        'en-US': 'trigger="focus" suits input fields; disabled turns the tooltip off entirely.',
      },
      vueComponent: TriggerVue,
      reactComponent: TriggerReact,
      vueSource: triggerVueSource,
      reactSource: triggerReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'content',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '提示内容（content 插槽 / renderContent 优先）',
          'en-US': 'Tooltip content (the content slot / renderContent takes precedence)',
        },
      },
      {
        name: 'placement',
        type: `'top' | 'bottom' | 'left' | 'right'`,
        default: `'top'`,
        description: { 'zh-CN': '弹出位置', 'en-US': 'Popup placement' },
      },
      {
        name: 'trigger',
        type: `'hover' | 'focus'`,
        default: `'hover'`,
        description: { 'zh-CN': '触发方式', 'en-US': 'Trigger mode' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '禁用状态（禁用后不响应触发）',
          'en-US': 'Disabled state (stops responding to triggers)',
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
          'zh-CN': '提示内容（优先于 content prop）',
          'en-US': 'Tooltip content (takes precedence over the content prop)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow: hidden 时可能被裁剪，布局时需留意。',
      'en-US':
        'The bubble uses CSS wrapper positioning instead of a portal, so it can be clipped by a parent with overflow: hidden; mind your layout.',
    },
    {
      'zh-CN':
        '自带视口避让：首选方位空间不足时自动翻转到对侧，横向 / 纵向溢出视口边缘时自动钳制，滚动与窗口 resize 时实时重算。',
      'en-US':
        'Built-in viewport collision handling: flips to the opposite side when the preferred placement lacks space, clamps at viewport edges horizontally / vertically, and recalculates on scroll and window resize.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        'focus 触发天然支持键盘；hover 触发元素同样可聚焦，提示与触发元素通过 aria-describedby 关联。',
      'en-US':
        'The focus trigger is keyboard-friendly by nature; hover triggers are also focusable, and the tooltip is linked to its trigger via aria-describedby.',
    },
  ],
};

import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import UncontrolledVue from './demos/uncontrolled.vue';
import BasicReact from './demos/basic';
import UncontrolledReact from './demos/uncontrolled';

import basicVueSource from './demos/basic.vue?raw';
import uncontrolledVueSource from './demos/uncontrolled.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import uncontrolledReactSource from './demos/uncontrolled.tsx?raw';

export const tabsMeta: ComponentMeta = {
  name: 'Tabs',
  slug: 'tabs',
  title: '标签页',
  category: 'navigation',
  summary: {
    'zh-CN': '在同一区域切换多个平级内容面板，配置化标签项，支持受控 / 非受控与键盘切换。',
    'en-US':
      'Switches between multiple peer content panels in the same area, with configurable tab items, controlled / uncontrolled modes, and keyboard navigation.',
  },
  features: [
    {
      'zh-CN': 'items 配置标签项（label / value / disabled），受控 value / 非受控 defaultValue',
      'en-US':
        'items configures tabs (label / value / disabled); controlled value or uncontrolled defaultValue',
    },
    {
      'zh-CN':
        '面板内容通过作用域插槽获取当前激活项：Vue #default="{ item }"，React renderPanel(item)',
      'en-US':
        'Panel content receives the active item via a scoped slot: Vue #default="{ item }", React renderPanel(item)',
    },
    {
      'zh-CN': '禁用标签不可激活；方向键在可用标签间循环移动',
      'en-US': 'Disabled tabs cannot be activated; arrow keys cycle through enabled tabs',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单分区、详情页多视图、设置项分类等内容平级切换场景。',
      'en-US':
        'Switching between peer content such as form sections, multi-view detail pages, or grouped settings.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控与禁用项', 'en-US': 'Controlled & Disabled Tabs' },
      description: {
        'zh-CN': '外部维护激活 value，disabled 标签不可点击也不参与键盘循环。',
        'en-US':
          'The active value is maintained externally; disabled tabs are not clickable and are skipped in keyboard cycling.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'uncontrolled',
      title: { 'zh-CN': '非受控', 'en-US': 'Uncontrolled' },
      description: {
        'zh-CN': '仅提供 defaultValue 指定初始激活项，切换由组件内部管理。',
        'en-US':
          'Only defaultValue sets the initially active tab; switching is managed internally.',
      },
      vueComponent: UncontrolledVue,
      reactComponent: UncontrolledReact,
      vueSource: uncontrolledVueSource,
      reactSource: uncontrolledReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '受控激活值（提供即受控）',
          'en-US': 'Controlled active value (providing it makes the component controlled)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '非受控初始激活值',
          'en-US': 'Uncontrolled initial active value',
        },
      },
      {
        name: 'items',
        type: 'TabItem[]',
        default: '—',
        required: true,
        description: { 'zh-CN': '标签页配置', 'en-US': 'Tab items configuration' },
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '激活项变更回调',
          'en-US': 'Callback fired when the active tab changes',
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
        payload: 'value: string',
        description: { 'zh-CN': '激活标签变更', 'en-US': 'Active tab changed' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'v-model:value write-back' },
      },
    ],
    slots: [
      {
        vue: 'default="{ item }"',
        react: 'renderPanel(item)',
        description: {
          'zh-CN': '面板内容（作用域参数为当前激活的 TabItem）',
          'en-US': 'Panel content (scoped param is the currently active TabItem)',
        },
      },
    ],
    types: [
      {
        name: 'TabItem',
        definition: `interface TabItem {
  label: string
  value: string
  disabled?: boolean
}`,
        description: { 'zh-CN': '标签页项配置。', 'en-US': 'Tab item configuration.' },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'Vue 端面板是 default 作用域插槽（#default="{ item }"），不存在名为 item 的具名插槽。',
      'en-US':
        'On Vue the panel is the default scoped slot (#default="{ item }"); there is no named slot called item.',
    },
    {
      'zh-CN': '点击禁用标签与通过键盘切换时都会跳过禁用项。',
      'en-US': 'Disabled tabs are skipped both when clicked and when switching via keyboard.',
    },
  ],
  a11y: [
    {
      'zh-CN': '标签栏具备 tablist / tab 语义，aria-selected 标识激活项，左右方向键可切换焦点。',
      'en-US':
        'The tab bar has tablist / tab semantics; aria-selected marks the active tab, and left/right arrow keys move focus.',
    },
  ],
};

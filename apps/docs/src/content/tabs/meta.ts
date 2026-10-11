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
  summary: '在同一区域切换多个平级内容面板，配置化标签项，支持受控 / 非受控与键盘切换。',
  features: [
    'items 配置标签项（label / value / disabled），受控 value / 非受控 defaultValue',
    '面板内容通过作用域插槽获取当前激活项：Vue #default="{ item }"，React renderPanel(item)',
    '禁用标签不可激活；方向键在可用标签间循环移动',
  ],
  scenarios: ['表单分区、详情页多视图、设置项分类等内容平级切换场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控与禁用项',
      description: '外部维护激活 value，disabled 标签不可点击也不参与键盘循环。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'uncontrolled',
      title: '非受控',
      description: '仅提供 defaultValue 指定初始激活项，切换由组件内部管理。',
      vueComponent: UncontrolledVue,
      reactComponent: UncontrolledReact,
      vueSource: uncontrolledVueSource,
      reactSource: uncontrolledReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'string', default: '—', description: '受控激活值（提供即受控）' },
      { name: 'defaultValue', type: 'string', default: '—', description: '非受控初始激活值' },
      { name: 'items', type: 'TabItem[]', default: '—', required: true, description: '标签页配置' },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: '激活项变更回调',
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
      { vue: 'change', react: 'onChange', payload: 'value: string', description: '激活标签变更' },
      { vue: 'update:value', react: '—', payload: 'string', description: 'v-model:value 回写' },
    ],
    slots: [
      {
        vue: 'default="{ item }"',
        react: 'renderPanel(item)',
        description: '面板内容（作用域参数为当前激活的 TabItem）',
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
        description: '标签页项配置。',
      },
    ],
  },
  notes: [
    'Vue 端面板是 default 作用域插槽（#default="{ item }"），不存在名为 item 的具名插槽。',
    '点击禁用标签与通过键盘切换时都会跳过禁用项。',
  ],
  a11y: ['标签栏具备 tablist / tab 语义，aria-selected 标识激活项，左右方向键可切换焦点。'],
};

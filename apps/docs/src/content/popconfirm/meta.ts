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
  summary: '点击元素弹出轻量确认气泡，适合"删除"等需要二次确认但不必打断整页的操作。',
  features: [
    '点击触发元素切换气泡，确定 / 取消按钮在收起后分别回调 confirm / cancel',
    'confirmText / cancelText 自定义按钮文本（默认"确定"/"取消"），placement 控制四方位',
    'content 属性或 content 插槽 / renderContent 自定义确认文案；disabled 关闭交互',
    '点击气泡外部仅收起，不触发任何回调',
  ],
  scenarios: ['删除 / 提交等轻量二次确认、危险操作前置拦截等场景。'],
  demos: [
    {
      id: 'basic',
      title: '删除确认',
      description: '点击触发元素弹出确认，确定与取消分别触发不同回调。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: '方位 / 按钮文本 / 禁用',
      description: 'placement 右侧弹出并自定义按钮文案；disabled 下点击无效。',
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
        description: '确认文案（content 插槽 / renderContent 可覆盖）',
      },
      { name: 'confirmText', type: 'string', default: `'确定'`, description: '确认按钮文本' },
      { name: 'cancelText', type: 'string', default: `'取消'`, description: '取消按钮文本' },
      {
        name: 'placement',
        type: `'top' | 'bottom' | 'left' | 'right'`,
        default: `'top'`,
        description: '气泡方位',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: '禁用状态（运行时禁用会收起已开气泡）',
      },
      {
        name: 'onConfirm',
        type: '() => void',
        default: '—',
        description: '点击确定回调（气泡收起后触发）',
      },
      {
        name: 'onCancel',
        type: '() => void',
        default: '—',
        description: '点击取消回调（气泡收起后触发）',
      },
    ],
    events: [
      {
        vue: 'confirm',
        react: 'onConfirm',
        payload: '—',
        description: '点击确定（气泡收起后触发）',
      },
      { vue: 'cancel', react: 'onCancel', payload: '—', description: '点击取消（气泡收起后触发）' },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '触发元素' },
      { vue: 'content', react: 'renderContent', description: '确认文案内容（覆盖 content prop）' },
    ],
  },
  notes: [
    '点击外部关闭只收起气泡，不会触发 confirm 或 cancel，便于用户无副作用地放弃操作。',
    '气泡为 CSS 包裹定位，与 Tooltip 类似，需注意父容器 overflow 裁剪。',
  ],
  a11y: ['确认 / 取消为原生按钮可键盘操作，气泡打开后焦点进入弹层，Esc 可取消关闭。'],
};

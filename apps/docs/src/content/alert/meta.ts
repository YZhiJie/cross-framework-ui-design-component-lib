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
  summary: '静态内嵌的提示横幅，用于展示需用户关注的信息，支持四种语义、图标与关闭。',
  features: [
    '四种语义类型：info / success / warning / error',
    'title 标题 + description 描述（描述也可用默认插槽 / children）',
    'showIcon 显示类型图标，closable 可手动关闭（隐藏后触发 close）',
    'title / icon 均提供插槽，可完全自定义（React 对应 renderTitle / renderIcon）',
  ],
  scenarios: ['表单校验汇总、页面级通知、操作后果说明等常驻提示场景。'],
  demos: [
    {
      id: 'basic',
      title: '四种语义',
      description: '通过 type 切换 info / success / warning / error 配色与语义。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'closable',
      title: '图标 / 关闭 / 自定义标题',
      description: 'showIcon + closable，标题通过 title 插槽自定义。',
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
        description: '语义类型',
      },
      { name: 'title', type: 'string', default: '—', description: '标题' },
      {
        name: 'description',
        type: 'string',
        default: '—',
        description: '辅助描述（默认插槽的回退内容）',
      },
      { name: 'closable', type: 'boolean', default: 'false', description: '是否可关闭' },
      { name: 'showIcon', type: 'boolean', default: 'false', description: '是否显示类型图标' },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: '关闭回调（组件隐藏后触发）',
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
      { vue: 'close', react: 'onClose', payload: '—', description: '点击关闭按钮、提示隐藏后触发' },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '描述内容（覆盖 description prop）' },
      { vue: 'title', react: 'renderTitle', description: '标题（覆盖 title prop）' },
      {
        vue: 'icon',
        react: 'renderIcon',
        description: '类型图标（覆盖默认图标，showIcon 开启时生效）',
      },
    ],
  },
  notes: ['Alert 为页面内静态提示（非浮层）；需要自动消失的全局浮层请使用 Message。'],
  a11y: ['提示区域按类型携带 role="status" / "alert" 等语义，关闭按钮可键盘操作。'],
};

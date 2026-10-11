import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import RefVue from './demos/ref.vue';
import BasicReact from './demos/basic';
import RefReact from './demos/ref';

import basicVueSource from './demos/basic.vue?raw';
import refVueSource from './demos/ref.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import refReactSource from './demos/ref.tsx?raw';

export const modalMeta: ComponentMeta = {
  name: 'Modal',
  slug: 'modal',
  title: '对话框',
  category: 'basic',
  summary: '模态对话框，承载需要用户明确处理的信息或操作，支持受控与 ref 命令式两种用法。',
  features: [
    '受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible',
    'title 标题、width 自定义宽度（数字按 px，字符串原样输出）',
    'closable 关闭按钮、maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭',
    'default / title / footer 三个插槽（React 对应 children / renderTitle / renderFooter）',
    '通过 ref 暴露 open() / close() 命令式方法（类型 ModalRef）',
  ],
  scenarios: ['操作确认、表单编辑、详情展示等需要打断主流程并聚焦用户注意力的场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控对话框',
      description: '外部维护 visible 状态，footer 插槽自定义底部按钮。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'ref',
      title: 'ref 命令式打开',
      description: '无需维护 visible，直接调用实例 open() / close()。',
      vueComponent: RefVue,
      reactComponent: RefReact,
      vueSource: refVueSource,
      reactSource: refReactSource,
    },
  ],
  api: {
    props: [
      { name: 'visible', type: 'boolean', default: '—', description: '受控可见性' },
      {
        name: 'defaultVisible',
        type: 'boolean',
        default: 'false',
        description: '非受控初始可见性',
      },
      { name: 'title', type: 'string', default: '—', description: '标题' },
      {
        name: 'width',
        type: 'number | string',
        default: '520',
        description: '宽度（数字按 px，字符串原样输出）',
      },
      { name: 'closable', type: 'boolean', default: 'true', description: '是否显示右上角关闭按钮' },
      { name: 'maskClosable', type: 'boolean', default: 'true', description: '点击遮罩是否关闭' },
      { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '按 ESC 是否关闭' },
      { name: 'onOpen', type: '() => void', default: '—', description: '打开回调' },
      { name: 'onClose', type: '() => void', default: '—', description: '关闭回调' },
      { name: 'onOk', type: '() => void', default: '—', description: '确认回调（触发后自动关闭）' },
      {
        name: 'onCancel',
        type: '() => void',
        default: '—',
        description: '取消回调（触发后自动关闭）',
      },
    ],
    events: [
      { vue: 'open', react: 'onOpen', payload: '—', description: '对话框打开' },
      { vue: 'close', react: 'onClose', payload: '—', description: '对话框关闭' },
      { vue: 'ok', react: 'onOk', payload: '—', description: '点击确认' },
      { vue: 'cancel', react: 'onCancel', payload: '—', description: '点击取消' },
      {
        vue: 'update:visible',
        react: '—',
        payload: 'boolean',
        description: 'v-model:visible 回写',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '弹窗内容' },
      { vue: 'title', react: 'renderTitle', description: '标题（覆盖 title prop）' },
      { vue: 'footer', react: 'renderFooter', description: '底部操作区' },
    ],
  },
  notes: [
    'onOk / onCancel 触发后组件自动关闭；若使用自定义 footer，需自行调用 close() 或更新 visible。',
    'ref 实例类型为 ModalRef，提供 open() 与 close() 两个方法。',
  ],
  a11y: ['对话框打开时聚焦于弹层，支持 ESC 关闭（closeOnEsc），遮罩阻断背景内容交互。'],
};

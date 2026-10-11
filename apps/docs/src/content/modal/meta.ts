import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import CustomVue from './demos/custom.vue';
import RefVue from './demos/ref.vue';
import BasicReact from './demos/basic';
import CustomReact from './demos/custom';
import RefReact from './demos/ref';

import basicVueSource from './demos/basic.vue?raw';
import customVueSource from './demos/custom.vue?raw';
import refVueSource from './demos/ref.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import customReactSource from './demos/custom.tsx?raw';
import refReactSource from './demos/ref.tsx?raw';

export const modalMeta: ComponentMeta = {
  name: 'Modal',
  slug: 'modal',
  title: '对话框',
  category: 'basic',
  summary:
    '模态对话框，承载需要用户明确处理的信息或操作；支持焦点陷阱 / 焦点恢复、自定义底部文案与受控、ref 命令式两种用法。',
  features: [
    '受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible',
    'title 标题、width 自定义宽度（数字按 px，字符串原样输出）',
    'closable 关闭按钮、maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭',
    '焦点陷阱：打开期间 Tab 循环约束在弹窗内（trapFocus 可关闭）；关闭后焦点恢复到打开前元素',
    'okText / cancelText 自定义默认底部按钮文案（默认 确认 / 取消）',
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
      id: 'custom',
      title: '自定义按钮文案',
      description: 'okText / cancelText 定制底部文案；ESC、遮罩、关闭按钮均可退出。',
      vueComponent: CustomVue,
      reactComponent: CustomReact,
      vueSource: customVueSource,
      reactSource: customReactSource,
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
      {
        name: 'okText',
        type: 'string',
        default: "'确认'",
        description: '确认按钮文案（默认 footer 生效）',
      },
      {
        name: 'cancelText',
        type: 'string',
        default: "'取消'",
        description: '取消按钮文案（默认 footer 生效）',
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        description: '打开期间 Tab 焦点是否循环约束在弹窗内',
      },
      { name: 'onOpen', type: '() => void', default: '—', description: '打开回调' },
      { name: 'onClose', type: '() => void', default: '—', description: '关闭回调' },
      { name: 'onOk', type: '() => void', default: '—', description: '确认回调（触发后自动关闭）' },
      {
        name: 'onCancel',
        type: '() => void',
        default: '—',
        description: '取消回调（触发后自动关闭）',
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: '附加到对话框面板的自定义类名',
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到对话框面板的自定义样式',
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
      {
        vue: 'closeIcon',
        react: 'renderCloseIcon',
        description: '自定义关闭图标（替换右上角内置 close）',
      },
      { vue: 'default', react: 'children', description: '弹窗内容' },
      { vue: 'title', react: 'renderTitle', description: '标题（覆盖 title prop）' },
      { vue: 'footer', react: 'renderFooter', description: '底部操作区' },
    ],
  },
  notes: [
    'onOk / onCancel 触发后组件自动关闭；若使用自定义 footer，需自行调用 close() 或更新 visible。',
    'ref 实例类型为 ModalRef，提供 open() 与 close() 两个方法。',
    '自定义 footer 插槽时 okText / cancelText 不生效（底部完全由插槽接管）。',
    'trapFocus 打开且面板内无可聚焦元素时，焦点锁定在面板自身（tabindex=-1）。',
  ],
  a11y: [
    '面板携带 role="dialog" + aria-modal="true"；打开时聚焦面板，Tab / Shift+Tab 循环约束在弹窗内。',
    '关闭后焦点恢复到打开前的元素，键盘用户不会丢失位置；支持 ESC 关闭（closeOnEsc）。',
  ],
};

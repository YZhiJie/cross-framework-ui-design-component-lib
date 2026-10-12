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
  summary: {
    'zh-CN':
      '模态对话框，承载需要用户明确处理的信息或操作；支持焦点陷阱 / 焦点恢复、自定义底部文案与受控、ref 命令式两种用法。',
    'en-US':
      'A modal dialog for information or actions that require explicit handling, with focus trap / focus restore, customizable footer text, and both controlled and ref-based imperative usage.',
  },
  features: [
    {
      'zh-CN': '受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible',
      'en-US': 'Controlled visible or uncontrolled defaultVisible; v-model:visible on Vue',
    },
    {
      'zh-CN': 'title 标题、width 自定义宽度（数字按 px，字符串原样输出）',
      'en-US': 'Title and custom width (numbers are treated as px; strings are applied as-is)',
    },
    {
      'zh-CN': 'closable 关闭按钮、maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭',
      'en-US':
        'Close button via closable, mask click to close via maskClosable, and ESC to close via closeOnEsc',
    },
    {
      'zh-CN':
        '焦点陷阱：打开期间 Tab 循环约束在弹窗内（trapFocus 可关闭）；关闭后焦点恢复到打开前元素',
      'en-US':
        'Focus trap: Tab cycles within the dialog while open (can be disabled with trapFocus); focus returns to the pre-open element after close',
    },
    {
      'zh-CN':
        'okText / cancelText 自定义默认底部按钮文案（未提供时取全局语言包，zh-CN 默认 确认 / 取消）',
      'en-US':
        'Custom default footer button text via okText / cancelText (falls back to the global locale; zh-CN defaults to 确认 / 取消)',
    },
    {
      'zh-CN':
        'default / title / footer 三个插槽（React 对应 children / renderTitle / renderFooter）',
      'en-US':
        'Three slots: default / title / footer (children / renderTitle / renderFooter in React)',
    },
    {
      'zh-CN': '通过 ref 暴露 open() / close() 命令式方法（类型 ModalRef）',
      'en-US': 'Imperative open() / close() methods exposed via ref (type ModalRef)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '操作确认、表单编辑、详情展示等需要打断主流程并聚焦用户注意力的场景。',
      'en-US':
        'Confirmations, form editing, detail views, and other scenarios that interrupt the main flow to focus user attention.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控对话框', 'en-US': 'Controlled Dialog' },
      description: {
        'zh-CN': '外部维护 visible 状态，footer 插槽自定义底部按钮。',
        'en-US': 'Maintain visible externally; customize footer buttons via the footer slot.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'custom',
      title: { 'zh-CN': '自定义按钮文案', 'en-US': 'Custom Button Text' },
      description: {
        'zh-CN': 'okText / cancelText 定制底部文案；ESC、遮罩、关闭按钮均可退出。',
        'en-US':
          'Customize footer text with okText / cancelText; ESC, mask click, and the close button all dismiss the dialog.',
      },
      vueComponent: CustomVue,
      reactComponent: CustomReact,
      vueSource: customVueSource,
      reactSource: customReactSource,
    },
    {
      id: 'ref',
      title: { 'zh-CN': 'ref 命令式打开', 'en-US': 'Imperative Open via ref' },
      description: {
        'zh-CN': '无需维护 visible，直接调用实例 open() / close()。',
        'en-US': 'No need to maintain visible; call open() / close() on the instance directly.',
      },
      vueComponent: RefVue,
      reactComponent: RefReact,
      vueSource: refVueSource,
      reactSource: refReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'visible',
        type: 'boolean',
        default: '—',
        description: { 'zh-CN': '受控可见性', 'en-US': 'Controlled visibility' },
      },
      {
        name: 'defaultVisible',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '非受控初始可见性', 'en-US': 'Uncontrolled initial visibility' },
      },
      {
        name: 'title',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '标题', 'en-US': 'Dialog title' },
      },
      {
        name: 'width',
        type: 'number | string',
        default: '520',
        description: {
          'zh-CN': '宽度（数字按 px，字符串原样输出）',
          'en-US': 'Dialog width (numbers are treated as px; strings are applied as-is)',
        },
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '是否显示右上角关闭按钮',
          'en-US': 'Whether to show the close button in the top-right corner',
        },
      },
      {
        name: 'maskClosable',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '点击遮罩是否关闭',
          'en-US': 'Whether clicking the mask closes the dialog',
        },
      },
      {
        name: 'closeOnEsc',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '按 ESC 是否关闭',
          'en-US': 'Whether pressing ESC closes the dialog',
        },
      },
      {
        name: 'okText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '确认按钮文案；未提供时取全局语言包（zh-CN：确认 / en-US：OK）',
          'en-US': 'OK button text; falls back to the global locale (zh-CN: 确认 / en-US: OK)',
        },
      },
      {
        name: 'cancelText',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '取消按钮文案；未提供时取全局语言包（zh-CN：取消 / en-US：Cancel）',
          'en-US':
            'Cancel button text; falls back to the global locale (zh-CN: 取消 / en-US: Cancel)',
        },
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '打开期间 Tab 焦点是否循环约束在弹窗内',
          'en-US': 'Whether Tab focus cycles within the dialog while open',
        },
      },
      {
        name: 'onOpen',
        type: '() => void',
        default: '—',
        description: { 'zh-CN': '打开回调', 'en-US': 'Open callback' },
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: { 'zh-CN': '关闭回调', 'en-US': 'Close callback' },
      },
      {
        name: 'onOk',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '确认回调（触发后自动关闭）',
          'en-US': 'OK callback (the dialog closes automatically afterwards)',
        },
      },
      {
        name: 'onCancel',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '取消回调（触发后自动关闭）',
          'en-US': 'Cancel callback (the dialog closes automatically afterwards)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到对话框面板的自定义类名',
          'en-US': 'Custom class name appended to the dialog panel',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到对话框面板的自定义样式',
          'en-US': 'Custom styles appended to the dialog panel',
        },
      },
    ],
    events: [
      {
        vue: 'open',
        react: 'onOpen',
        payload: '—',
        description: { 'zh-CN': '对话框打开', 'en-US': 'Fired when the dialog opens' },
      },
      {
        vue: 'close',
        react: 'onClose',
        payload: '—',
        description: { 'zh-CN': '对话框关闭', 'en-US': 'Fired when the dialog closes' },
      },
      {
        vue: 'ok',
        react: 'onOk',
        payload: '—',
        description: { 'zh-CN': '点击确认', 'en-US': 'Fired when OK is clicked' },
      },
      {
        vue: 'cancel',
        react: 'onCancel',
        payload: '—',
        description: { 'zh-CN': '点击取消', 'en-US': 'Fired when Cancel is clicked' },
      },
      {
        vue: 'update:visible',
        react: '—',
        payload: 'boolean',
        description: {
          'zh-CN': 'v-model:visible 回写',
          'en-US': 'Write-back for v-model:visible',
        },
      },
    ],
    slots: [
      {
        vue: 'closeIcon',
        react: 'renderCloseIcon',
        description: {
          'zh-CN': '自定义关闭图标（替换右上角内置 close）',
          'en-US': 'Custom close icon (replaces the built-in top-right close)',
        },
      },
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '弹窗内容', 'en-US': 'Dialog content' },
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
        vue: 'footer',
        react: 'renderFooter',
        description: { 'zh-CN': '底部操作区', 'en-US': 'Footer action area' },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'onOk / onCancel 触发后组件自动关闭；若使用自定义 footer，需自行调用 close() 或更新 visible。',
      'en-US':
        'The dialog closes automatically after onOk / onCancel; with a custom footer, call close() or update visible yourself.',
    },
    {
      'zh-CN': 'ref 实例类型为 ModalRef，提供 open() 与 close() 两个方法。',
      'en-US': 'The ref instance is of type ModalRef, providing open() and close() methods.',
    },
    {
      'zh-CN': '自定义 footer 插槽时 okText / cancelText 不生效（底部完全由插槽接管）。',
      'en-US':
        'okText / cancelText have no effect when a custom footer slot is used (the slot fully takes over the footer).',
    },
    {
      'zh-CN': 'trapFocus 打开且面板内无可聚焦元素时，焦点锁定在面板自身（tabindex=-1）。',
      'en-US':
        'With trapFocus enabled and no focusable elements inside, focus is locked on the panel itself (tabindex=-1).',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '面板携带 role="dialog" + aria-modal="true"；打开时聚焦面板，Tab / Shift+Tab 循环约束在弹窗内。',
      'en-US':
        'The panel carries role="dialog" + aria-modal="true"; it receives focus on open, and Tab / Shift+Tab cycle within the dialog.',
    },
    {
      'zh-CN': '关闭后焦点恢复到打开前的元素，键盘用户不会丢失位置；支持 ESC 关闭（closeOnEsc）。',
      'en-US':
        'Focus returns to the pre-open element after close so keyboard users keep their place; ESC to close is supported (closeOnEsc).',
    },
  ],
};

import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import PlacementVue from './demos/placement.vue';
import RefVue from './demos/ref.vue';
import BasicReact from './demos/basic';
import PlacementReact from './demos/placement';
import RefReact from './demos/ref';

import basicVueSource from './demos/basic.vue?raw';
import placementVueSource from './demos/placement.vue?raw';
import refVueSource from './demos/ref.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import placementReactSource from './demos/placement.tsx?raw';
import refReactSource from './demos/ref.tsx?raw';

export const drawerMeta: ComponentMeta = {
  name: 'Drawer',
  slug: 'drawer',
  title: '抽屉',
  category: 'basic',
  summary: {
    'zh-CN':
      '从屏幕边缘滑出的抽屉面板，承载表单、详情等次级内容；支持四个方向、自定义尺寸、焦点陷阱 / 焦点恢复与 ref 命令式控制。',
    'en-US':
      'A drawer panel sliding in from a screen edge for forms, details, and other secondary content, with four placements, custom size, focus trap / focus restore, and ref-based imperative control.',
  },
  features: [
    {
      'zh-CN': '受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible',
      'en-US': 'Controlled visible or uncontrolled defaultVisible; v-model:visible on Vue',
    },
    {
      'zh-CN': 'placement 四个滑入方向：left / right / top / bottom（默认 right）',
      'en-US': 'Four slide-in placements: left / right / top / bottom (defaults to right)',
    },
    {
      'zh-CN':
        'size 自定义尺寸：左右方向为宽度，上下方向为高度（数字按 px，字符串原样输出，默认 378）',
      'en-US':
        'Custom size: width for left/right, height for top/bottom (numbers are treated as px; strings are applied as-is; defaults to 378)',
    },
    {
      'zh-CN': 'mask 可关闭遮罩；maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭',
      'en-US':
        'Mask can be hidden via mask; mask click to close via maskClosable, and ESC to close via closeOnEsc',
    },
    {
      'zh-CN':
        '焦点陷阱：打开期间 Tab 循环约束在抽屉内（trapFocus 可关闭）；关闭后焦点恢复到打开前元素',
      'en-US':
        'Focus trap: Tab cycles within the drawer while open (can be disabled with trapFocus); focus returns to the pre-open element after close',
    },
    {
      'zh-CN':
        'default / title / footer / closeIcon 插槽（React 对应 children / renderTitle / renderFooter / renderCloseIcon）',
      'en-US':
        'Slots: default / title / footer / closeIcon (children / renderTitle / renderFooter / renderCloseIcon in React)',
    },
    {
      'zh-CN': '通过 ref 暴露 open() / close() / toggle() 命令式方法（类型 DrawerRef）',
      'en-US': 'Imperative open() / close() / toggle() methods exposed via ref (type DrawerRef)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单编辑、详情查看、筛选面板等不打断主流程但需要较大展示面积的场景。',
      'en-US':
        'Form editing, detail views, filter panels, and other scenarios that need a larger area without fully interrupting the main flow.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控抽屉', 'en-US': 'Controlled Drawer' },
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
      id: 'placement',
      title: { 'zh-CN': '四个方向', 'en-US': 'Placements' },
      description: {
        'zh-CN': 'placement 控制抽屉从左 / 右 / 上 / 下哪个边缘滑入。',
        'en-US':
          'placement controls which edge (left / right / top / bottom) the drawer slides in from.',
      },
      vueComponent: PlacementVue,
      reactComponent: PlacementReact,
      vueSource: placementVueSource,
      reactSource: placementReactSource,
    },
    {
      id: 'ref',
      title: { 'zh-CN': 'ref 命令式控制', 'en-US': 'Imperative Control via ref' },
      description: {
        'zh-CN': '无需维护 visible，直接调用实例 open() / close() / toggle()。',
        'en-US':
          'No need to maintain visible; call open() / close() / toggle() on the instance directly.',
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
        name: 'placement',
        type: "'left' | 'right' | 'top' | 'bottom'",
        default: "'right'",
        description: { 'zh-CN': '抽屉滑入方向', 'en-US': 'Edge the drawer slides in from' },
      },
      {
        name: 'size',
        type: 'number | string',
        default: '378',
        description: {
          'zh-CN': '左右方向为宽度，上下方向为高度（数字按 px，字符串原样输出）',
          'en-US':
            'Width for left/right, height for top/bottom (numbers are treated as px; strings are applied as-is)',
        },
      },
      {
        name: 'title',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '标题', 'en-US': 'Drawer title' },
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
        name: 'mask',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '是否显示遮罩（关闭时抽屉直接吸附在视口边缘）',
          'en-US': 'Whether to show the mask (the drawer docks to the viewport edge when off)',
        },
      },
      {
        name: 'maskClosable',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '点击遮罩是否关闭（mask 关闭时不生效）',
          'en-US': 'Whether clicking the mask closes the drawer (no effect when mask is off)',
        },
      },
      {
        name: 'closeOnEsc',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '按 ESC 是否关闭',
          'en-US': 'Whether pressing ESC closes the drawer',
        },
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '打开期间 Tab 焦点是否循环约束在抽屉内',
          'en-US': 'Whether Tab focus cycles within the drawer while open',
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
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到抽屉面板的自定义类名',
          'en-US': 'Custom class name appended to the drawer panel',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到抽屉面板的自定义样式',
          'en-US': 'Custom styles appended to the drawer panel',
        },
      },
    ],
    events: [
      {
        vue: 'open',
        react: 'onOpen',
        payload: '—',
        description: { 'zh-CN': '抽屉打开', 'en-US': 'Fired when the drawer opens' },
      },
      {
        vue: 'close',
        react: 'onClose',
        payload: '—',
        description: { 'zh-CN': '抽屉关闭', 'en-US': 'Fired when the drawer closes' },
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
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '抽屉内容', 'en-US': 'Drawer content' },
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
      {
        vue: 'closeIcon',
        react: 'renderCloseIcon',
        description: {
          'zh-CN': '自定义关闭图标（替换右上角内置 close）',
          'en-US': 'Custom close icon (replaces the built-in top-right close)',
        },
      },
    ],
    methods: [
      {
        name: 'open',
        signature: '() => void',
        description: { 'zh-CN': '打开抽屉（ref 命令式）', 'en-US': 'Open the drawer (via ref)' },
      },
      {
        name: 'close',
        signature: '() => void',
        description: { 'zh-CN': '关闭抽屉（ref 命令式）', 'en-US': 'Close the drawer (via ref)' },
      },
      {
        name: 'toggle',
        signature: '() => void',
        description: { 'zh-CN': '切换显隐（ref 命令式）', 'en-US': 'Toggle visibility (via ref)' },
      },
    ],
  },
  notes: [
    {
      'zh-CN': 'footer 无默认按钮（与 Modal 不同），底部操作区完全由 footer 插槽接管。',
      'en-US':
        'Unlike Modal, there is no default footer; the footer area is fully controlled by the footer slot.',
    },
    {
      'zh-CN': 'ref 实例类型为 DrawerRef，提供 open() / close() / toggle() 三个方法。',
      'en-US': 'The ref instance is of type DrawerRef, providing open() / close() / toggle().',
    },
    {
      'zh-CN': 'size 作用于交叉轴：left/right 方向设置 width，top/bottom 方向设置 height。',
      'en-US': 'size applies to the cross axis: width for left/right, height for top/bottom.',
    },
    {
      'zh-CN':
        '进出场自带过渡动画：遮罩淡入淡出，面板按 placement 方向滑入滑出（240ms）；退场期间保留 DOM 且不可交互，动画结束后才卸载，期间重新打开会取消卸载。系统开启「减少动态效果」时动画缩短至 1ms。',
      'en-US':
        'Open/close is animated: the overlay fades while the panel slides along its placement direction (240ms). During the leave animation the DOM is kept but non-interactive, then unmounted; reopening mid-animation cancels the unmount. With prefers-reduced-motion the animation is shortened to 1ms.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '面板携带 role="dialog"（mask 开启时附加 aria-modal="true"）；打开时聚焦面板，Tab / Shift+Tab 循环约束在抽屉内。',
      'en-US':
        'The panel carries role="dialog" (plus aria-modal="true" when mask is on); it receives focus on open, and Tab / Shift+Tab cycle within the drawer.',
    },
    {
      'zh-CN': '关闭后焦点恢复到打开前的元素，键盘用户不会丢失位置；支持 ESC 关闭（closeOnEsc）。',
      'en-US':
        'Focus returns to the pre-open element after close so keyboard users keep their place; ESC to close is supported (closeOnEsc).',
    },
  ],
};

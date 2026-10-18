import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const dropdownMeta: ComponentMeta = {
  name: 'Dropdown',
  slug: 'dropdown',
  title: '下拉菜单',
  category: 'navigation',
  summary: {
    'zh-CN':
      '把一组动作收纳到触发元素的下拉菜单里，支持悬停 / 点击两种触发方式、四方位弹出与视口避让。',
    'en-US':
      'Collapses a group of actions into a dropdown menu anchored to a trigger, with hover / click triggers, four placements and viewport collision handling.',
  },
  features: [
    {
      'zh-CN':
        'trigger 支持悬停（默认，带 100ms 展开 / 150ms 收起防抖）与点击两种方式，收起后回调 select 并携带 key 与完整菜单项',
      'en-US':
        'trigger supports hover (default, with a 100ms open / 150ms close debounce) and click; select fires after the menu closes with the key and the full option',
    },
    {
      'zh-CN':
        'menu 数组驱动渲染：disabled 禁用项点击无效、danger 危险项红色文案、divided 分隔线、icon 内置图标',
      'en-US':
        'menu is array-driven: disabled items ignore clicks, danger items render red, divided adds a separator, icon renders a built-in icon',
    },
    {
      'zh-CN': 'placement 控制四方位弹出，空间不足自动翻转、溢出视口自动钳制，滚动与 resize 实时重算',
      'en-US':
        'placement controls the four directions; flips when space is tight, clamps at viewport edges, and recalculates on scroll and resize',
    },
    {
      'zh-CN': '点击菜单外部或按 Esc 仅收起菜单，不触发 select；onVisibleChange 通知展开 / 收起',
      'en-US':
        'Clicking outside or pressing Esc only closes the menu without firing select; onVisibleChange reports open state changes',
    },
  ],
  scenarios: [
    {
      'zh-CN':
        '工具栏“更多操作”聚合、用户头像菜单、表格行操作过多需要收纳等场景。',
      'en-US':
        'Toolbar "more actions" overflow, avatar menus, or table row actions that are too many to display inline.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN': '悬停触发元素展开菜单，点击菜单项后收起并回调 select。',
        'en-US':
          'Hover the trigger to open the menu; clicking an item closes it and fires select.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: { 'zh-CN': '点击触发 / 菜单项变体 / 禁用', 'en-US': 'Click Trigger / Item Variants / Disabled' },
      description: {
        'zh-CN': 'trigger 切换为点击，placement 右侧弹出；菜单项演示禁用、分隔线、危险项与图标；disabled 下悬停点击均无效。',
        'en-US':
          'trigger switches to click and placement pops to the right; items demo disabled, divided, danger and icon; hover and click do nothing when disabled.',
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
        name: 'menu',
        type: 'DropdownOption[]',
        default: '—',
        description: {
          'zh-CN': '菜单项数组（key / label / disabled / danger / divided / icon）',
          'en-US': 'Menu items (key / label / disabled / danger / divided / icon)',
        },
      },
      {
        name: 'trigger',
        type: `'hover' | 'click'`,
        default: `'hover'`,
        description: {
          'zh-CN': '触发方式：hover 悬停（防抖）/ click 点击',
          'en-US': 'Trigger mode: hover (debounced) / click',
        },
      },
      {
        name: 'placement',
        type: `'top' | 'bottom' | 'left' | 'right'`,
        default: `'bottom'`,
        description: { 'zh-CN': '菜单弹出方位', 'en-US': 'Menu placement' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '禁用状态（运行时禁用会收起已开菜单）',
          'en-US': 'Disabled state (disabling at runtime closes an open menu)',
        },
      },
      {
        name: 'onSelect',
        type: '(key: string, option: DropdownOption) => void',
        default: '—',
        description: {
          'zh-CN': '菜单项点击回调（菜单收起后触发；禁用项不触发）',
          'en-US': 'Item click callback (fired after the menu closes; disabled items never fire)',
        },
      },
      {
        name: 'onVisibleChange',
        type: '(open: boolean) => void',
        default: '—',
        description: {
          'zh-CN': '菜单展开 / 收起回调（含运行时禁用导致的收起）',
          'en-US':
            'Open state change callback (including closes caused by runtime disabling)',
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
        vue: 'select',
        react: 'onSelect',
        payload: '(key: string, option: DropdownOption)',
        description: {
          'zh-CN': '点击菜单项（菜单收起后触发；禁用项不触发）',
          'en-US': 'Fired on item click (after the menu closes; disabled items never fire)',
        },
      },
      {
        vue: 'visible-change',
        react: 'onVisibleChange',
        payload: '(open: boolean)',
        description: {
          'zh-CN': '菜单展开 / 收起时触发',
          'en-US': 'Fired when the menu opens or closes',
        },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: { 'zh-CN': '触发元素', 'en-US': 'Trigger element' },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'hover 触发内置 100ms 展开 / 150ms 收起防抖，鼠标划过触发器与菜单之间 8px 间隙不会误收起；click 触发时悬停无效。',
      'en-US':
        'Hover trigger ships with a 100ms open / 150ms close debounce, so crossing the 8px gap between trigger and menu never mis-closes; hover is a no-op with click trigger.',
    },
    {
      'zh-CN':
        '菜单为 CSS 包裹定位（同 Tooltip / Popconfirm），需注意父容器 overflow 裁剪；ref 命令式 API 提供 show / hide / toggle。',
      'en-US':
        'The menu uses CSS wrapper positioning (like Tooltip / Popconfirm), so watch out for clipping by parent overflow; the ref exposes show / hide / toggle.',
    },
    {
      'zh-CN':
        'icon 取值为 @xui-design/icons 的图标名（如 user / calendar / close），未知名静默忽略不渲染。',
      'en-US':
        'icon takes an @xui-design/icons name (e.g. user / calendar / close); unknown names are silently ignored.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '菜单容器 role="menu"、菜单项 role="menuitem"，禁用项带 aria-disabled；Esc 可收起菜单。方向键在菜单项间移动暂未支持。',
      'en-US':
        'The menu container has role="menu" and items role="menuitem" with aria-disabled on disabled entries; Esc closes the menu. Arrow-key navigation is not supported yet.',
    },
  ],
};

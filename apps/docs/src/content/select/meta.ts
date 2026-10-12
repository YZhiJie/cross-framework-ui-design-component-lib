import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import AdvancedVue from './demos/advanced.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';
import AdvancedReact from './demos/advanced';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import advancedVueSource from './demos/advanced.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';
import advancedReactSource from './demos/advanced.tsx?raw';

export const selectMeta: ComponentMeta = {
  name: 'Select',
  slug: 'select',
  title: '下拉选择',
  category: 'form',
  summary: {
    'zh-CN':
      '从弹出的选项面板中选择值，支持单选 / 多选 / 可搜索 / 虚拟滚动，键盘操作与 ARIA 语义完整。',
    'en-US':
      'Pick values from a pop-up option panel, with single / multiple selection, search, and virtual scrolling, plus full keyboard support and ARIA semantics.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式，Vue 端支持 v-model:value',
      'en-US': 'Controlled and uncontrolled modes; v-model:value on Vue',
    },
    {
      'zh-CN': 'multiple 多选：选中值为 string[]，点击选项切换选中且面板不关闭，tag 可单独移除',
      'en-US':
        'Multiple selection via multiple: the value is a string[], clicking an option toggles it without closing the panel, and tags can be removed individually',
    },
    {
      'zh-CN': 'searchable 可搜索：面板顶部搜索框按选项文案过滤（大小写不敏感）',
      'en-US':
        'Searchable mode: a search box at the top of the panel filters options by label (case-insensitive)',
    },
    {
      'zh-CN': 'virtual 虚拟滚动：1000+ 选项仅渲染可视窗口，maxHeight 控制面板视口高度',
      'en-US':
        'Virtual scrolling via virtual: 1000+ options render only the visible window; maxHeight controls the panel viewport height',
    },
    {
      'zh-CN': 'clearable 已选中时显示清空按钮（多选清空全部）；disabled 整体禁用',
      'en-US':
        'Clear button via clearable when a value is selected (clears all in multiple mode); disabled disables the whole select',
    },
    {
      'zh-CN': '键盘支持：上下方向键移动高亮（跳过禁用项）、Enter 确认、Esc 关闭',
      'en-US':
        'Keyboard support: ArrowUp / ArrowDown move the highlight (skipping disabled options), Enter confirms, Esc closes',
    },
  ],
  scenarios: [
    {
      'zh-CN': '选项数量较多、不适合用 Radio 平铺的单选 / 多选表单字段。',
      'en-US': 'Single / multiple form fields with too many options to lay out with Radio.',
    },
    {
      'zh-CN': '选项上千条的大数据量选择场景（配合 virtual 虚拟滚动）。',
      'en-US': 'Large datasets with thousands of options (with virtual scrolling).',
    },
    {
      'zh-CN': '需要按文案快速定位选项的检索式选择场景（配合 searchable）。',
      'en-US': 'Search-driven selection to quickly locate options by label (with searchable).',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控与清空', 'en-US': 'Controlled & Clearable' },
      description: {
        'zh-CN': 'options 中可对单项设置 disabled；clearable 支持一键清空。',
        'en-US':
          'Individual options can be disabled in options; clearable offers one-click clearing.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '默认值与禁用', 'en-US': 'Default Value & Disabled' },
      description: {
        'zh-CN': 'defaultValue 指定初始选中；disabled 禁用整个选择器。',
        'en-US': 'defaultValue sets the initial selection; disabled disables the whole select.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
    {
      id: 'advanced',
      title: { 'zh-CN': '多选 / 可搜索 / 虚拟滚动', 'en-US': 'Multiple / Searchable / Virtual' },
      description: {
        'zh-CN':
          'multiple 以 tag 展示选中项；searchable 按文案过滤；virtual 渲染 1000 项仅维护可视窗口。',
        'en-US':
          'multiple shows selections as tags; searchable filters by label; virtual renders 1000 items while maintaining only the visible window.',
      },
      vueComponent: AdvancedVue,
      reactComponent: AdvancedReact,
      vueSource: advancedVueSource,
      reactSource: advancedReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'string | string[]',
        default: '—',
        description: {
          'zh-CN': '受控选中值（提供即受控）；多选模式为 string[]',
          'en-US':
            'Controlled selected value (controlled when provided); a string[] in multiple mode',
        },
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        default: '—',
        description: {
          'zh-CN': '非受控初始选中值',
          'en-US': 'Uncontrolled initial selected value',
        },
      },
      {
        name: 'options',
        type: 'SelectOption[]',
        default: '—',
        required: true,
        description: { 'zh-CN': '选项数组', 'en-US': 'Options array' },
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '占位文案', 'en-US': 'Placeholder text' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否显示清空按钮（仅已选中时；多选清空全部）',
          'en-US':
            'Whether to show the clear button (only when a value is selected; clears all in multiple mode)',
        },
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '多选模式：选中值为数组，点击选项切换选中且面板不关闭',
          'en-US':
            'Multiple mode: the value is an array; clicking an option toggles it without closing the panel',
        },
      },
      {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '可搜索模式：面板顶部显示搜索框，按选项文案过滤',
          'en-US':
            'Searchable mode: shows a search box at the top of the panel and filters options by label',
        },
      },
      {
        name: 'virtual',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '虚拟滚动模式（大数据量选项）',
          'en-US': 'Virtual scrolling mode (for large option sets)',
        },
      },
      {
        name: 'maxHeight',
        type: 'number',
        default: '264',
        description: {
          'zh-CN': '下拉面板最大高度（px）；虚拟模式下即视口高度',
          'en-US': 'Maximum height of the dropdown panel (px); the viewport height in virtual mode',
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
          'zh-CN': '附加到根节点的内联样式（支持 CSS 自定义属性）',
          'en-US':
            'Custom inline styles appended to the root element (CSS custom properties supported)',
        },
      },
      {
        name: 'onChange',
        type: '(value: string | string[]) => void',
        default: '—',
        description: {
          'zh-CN': '选中值变更回调（多选载荷为 string[]）',
          'en-US': 'Selected value change callback (payload is a string[] in multiple mode)',
        },
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: { 'zh-CN': '清空回调', 'en-US': 'Clear callback' },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: string | string[]',
        description: {
          'zh-CN': '选中值变更（多选为最新数组）',
          'en-US': 'Fired when the selected value changes (the latest array in multiple mode)',
        },
      },
      {
        vue: 'clear',
        react: 'onClear',
        payload: '—',
        description: { 'zh-CN': '清空选中值', 'en-US': 'Fired when the selected value is cleared' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string | string[]',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: {
          'zh-CN': '自定义清除图标（触发器 clear 与多选标签删除按钮共用）',
          'en-US':
            'Custom clear icon (shared by the trigger clear button and the multiple-mode tag remove button)',
        },
      },
      {
        vue: 'suffixIcon',
        react: 'renderSuffixIcon',
        description: {
          'zh-CN': '自定义下拉箭头图标',
          'en-US': 'Custom dropdown arrow icon',
        },
      },
    ],
    types: [
      {
        name: 'SelectOption',
        definition: `interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}`,
        description: {
          'zh-CN': '下拉选项配置。',
          'en-US': 'Configuration of a dropdown option.',
        },
      },
      {
        name: 'SelectValue',
        definition: `type SelectValue = string | string[];`,
        description: {
          'zh-CN': '选中值：单选为 string，多选为 string[]（向后兼容：单选行为与旧版一致）。',
          'en-US':
            'Selected value: a string in single mode and a string[] in multiple mode (backward compatible: single-select behavior matches the old version).',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '禁用选项不响应点击与键盘高亮，选中禁用项的操作会被静默忽略。',
      'en-US':
        'Disabled options do not respond to clicks or keyboard highlighting; attempts to select them are silently ignored.',
    },
    {
      'zh-CN': '点击组件外部会收起面板且不改变选中值；多选模式点击选项后面板保持展开。',
      'en-US':
        'Clicking outside closes the panel without changing the value; in multiple mode the panel stays open after an option is clicked.',
    },
    {
      'zh-CN':
        '虚拟模式要求选项行高固定（默认 30px，可用 CSS 变量 --xui-select-item-height 对齐调整）。',
      'en-US':
        'Virtual mode requires a fixed option row height (30px by default; align it via the --xui-select-item-height CSS variable).',
    },
    {
      'zh-CN': '多选删除某个 tag 即切换取消该项，触发 onChange 携带最新数组。',
      'en-US':
        'Removing a tag in multiple mode toggles that option off and fires onChange with the latest array.',
    },
    {
      'zh-CN':
        '自带视口避让：视口下方空间不足时面板自动向上展开（根元素加 is-drop-up），滚动与窗口 resize 时实时重算；overflow: hidden 祖先仍可能裁剪面板。',
      'en-US':
        'Built-in viewport avoidance: the panel flips upward when space below is insufficient (is-drop-up is added to the root), recalculated in real time on scroll and window resize; an overflow: hidden ancestor may still clip the panel.',
    },
  ],
  a11y: [
    {
      'zh-CN': '选择器可通过 Tab 聚焦，方向键 / Enter / Esc 完成全部键盘操作；禁用项携带禁用语义。',
      'en-US':
        'The select is focusable via Tab; arrow keys / Enter / Esc cover all keyboard operations, and disabled options carry disabled semantics.',
    },
    {
      'zh-CN': '多选面板携带 aria-multiselectable；搜索框独立 role=searchbox。',
      'en-US':
        'The multiple panel carries aria-multiselectable; the search box has its own role=searchbox.',
    },
  ],
};

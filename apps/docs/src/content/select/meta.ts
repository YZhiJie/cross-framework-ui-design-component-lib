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
  summary:
    '从弹出的选项面板中选择值，支持单选 / 多选 / 可搜索 / 虚拟滚动，键盘操作与 ARIA 语义完整。',
  features: [
    '受控 / 非受控双模式，Vue 端支持 v-model:value',
    'multiple 多选：选中值为 string[]，点击选项切换选中且面板不关闭，tag 可单独移除',
    'searchable 可搜索：面板顶部搜索框按选项文案过滤（大小写不敏感）',
    'virtual 虚拟滚动：1000+ 选项仅渲染可视窗口，maxHeight 控制面板视口高度',
    'clearable 已选中时显示清空按钮（多选清空全部）；disabled 整体禁用',
    '键盘支持：上下方向键移动高亮（跳过禁用项）、Enter 确认、Esc 关闭',
  ],
  scenarios: [
    '选项数量较多、不适合用 Radio 平铺的单选 / 多选表单字段。',
    '选项上千条的大数据量选择场景（配合 virtual 虚拟滚动）。',
    '需要按文案快速定位选项的检索式选择场景（配合 searchable）。',
  ],
  demos: [
    {
      id: 'basic',
      title: '受控与清空',
      description: 'options 中可对单项设置 disabled；clearable 支持一键清空。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '默认值与禁用',
      description: 'defaultValue 指定初始选中；disabled 禁用整个选择器。',
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
    {
      id: 'advanced',
      title: '多选 / 可搜索 / 虚拟滚动',
      description:
        'multiple 以 tag 展示选中项；searchable 按文案过滤；virtual 渲染 1000 项仅维护可视窗口。',
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
        description: '受控选中值（提供即受控）；多选模式为 string[]',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        default: '—',
        description: '非受控初始选中值',
      },
      {
        name: 'options',
        type: 'SelectOption[]',
        default: '—',
        required: true,
        description: '选项数组',
      },
      { name: 'placeholder', type: 'string', default: '—', description: '占位文案' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: '是否显示清空按钮（仅已选中时；多选清空全部）',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: '多选模式：选中值为数组，点击选项切换选中且面板不关闭',
      },
      {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description: '可搜索模式：面板顶部显示搜索框，按选项文案过滤',
      },
      {
        name: 'virtual',
        type: 'boolean',
        default: 'false',
        description: '虚拟滚动模式（大数据量选项）',
      },
      {
        name: 'maxHeight',
        type: 'number',
        default: '264',
        description: '下拉面板最大高度（px）；虚拟模式下即视口高度',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的内联样式（支持 CSS 自定义属性）',
      },
      {
        name: 'onChange',
        type: '(value: string | string[]) => void',
        default: '—',
        description: '选中值变更回调（多选载荷为 string[]）',
      },
      { name: 'onClear', type: '() => void', default: '—', description: '清空回调' },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: string | string[]',
        description: '选中值变更（多选为最新数组）',
      },
      { vue: 'clear', react: 'onClear', payload: '—', description: '清空选中值' },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string | string[]',
        description: 'v-model:value 回写',
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: '自定义清除图标（触发器 clear 与多选标签删除按钮共用）',
      },
      { vue: 'suffixIcon', react: 'renderSuffixIcon', description: '自定义下拉箭头图标' },
    ],
    types: [
      {
        name: 'SelectOption',
        definition: `interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}`,
        description: '下拉选项配置。',
      },
      {
        name: 'SelectValue',
        definition: `type SelectValue = string | string[];`,
        description: '选中值：单选为 string，多选为 string[]（向后兼容：单选行为与旧版一致）。',
      },
    ],
  },
  notes: [
    '禁用选项不响应点击与键盘高亮，选中禁用项的操作会被静默忽略。',
    '点击组件外部会收起面板且不改变选中值；多选模式点击选项后面板保持展开。',
    '虚拟模式要求选项行高固定（默认 30px，可用 CSS 变量 --xui-select-item-height 对齐调整）。',
    '多选删除某个 tag 即切换取消该项，触发 onChange 携带最新数组。',
    '自带视口避让：视口下方空间不足时面板自动向上展开（根元素加 is-drop-up），滚动与窗口 resize 时实时重算；overflow: hidden 祖先仍可能裁剪面板。',
  ],
  a11y: [
    '选择器可通过 Tab 聚焦，方向键 / Enter / Esc 完成全部键盘操作；禁用项携带禁用语义。',
    '多选面板携带 aria-multiselectable；搜索框独立 role=searchbox。',
  ],
};

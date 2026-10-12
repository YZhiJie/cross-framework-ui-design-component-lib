import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const inputNumberMeta: ComponentMeta = {
  name: 'InputNumber',
  slug: 'input-number',
  title: '数字输入框',
  category: 'form',
  summary: {
    'zh-CN': '通过步进按钮或直接键入输入数字，自动完成范围收敛、步长对齐与精度处理。',
    'en-US':
      'Enter numbers via stepper buttons or direct typing, with automatic range clamping, step alignment, and precision handling.',
  },
  features: [
    {
      'zh-CN':
        '受控 / 非受控双模式，值为 number | null（清空或非法输入为 null），Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes; the value is number | null (null when cleared or invalid); supports v-model:value on the Vue side',
    },
    {
      'zh-CN': 'min / max 边界收敛，step 步长（非正数回退 1），上下步进按钮循环对齐',
      'en-US':
        'min / max boundary clamping and step increments (non-positive values fall back to 1); up / down steppers keep values aligned to step multiples',
    },
    {
      'zh-CN': 'precision 小数位数（0-20），提交时统一格式化；非法 / 越界输入自动回退或 clamp',
      'en-US':
        'precision decimal places (0-20), formatted uniformly on commit; invalid or out-of-range input automatically falls back or is clamped',
    },
    {
      'zh-CN': 'disabled 禁用与 placeholder 占位文本',
      'en-US': 'disabled state and placeholder text',
    },
  ],
  scenarios: [
    {
      'zh-CN': '数量、金额、比例等需要精确数字输入与步进调节的场景。',
      'en-US':
        'Scenarios requiring precise numeric input with stepper adjustment, such as quantities, amounts, and ratios.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '范围 / 步长 / 精度', 'en-US': 'Range / Step / Precision' },
      description: {
        'zh-CN': '0-10 范围、0.5 步长、两位小数，步进与键入都会自动收敛。',
        'en-US':
          'Range 0-10, step 0.5, two decimal places; both stepping and typing are clamped automatically.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '非受控与禁用', 'en-US': 'Uncontrolled & Disabled' },
      description: {
        'zh-CN': 'defaultValue 提供初始值；越界值在提交时 clamp 到边界。',
        'en-US':
          'defaultValue provides the initial value; out-of-range values are clamped to the bounds on commit.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'number | null',
        default: '—',
        description: {
          'zh-CN': '受控值（null 表示空值；非法输入回退 null）',
          'en-US': 'Controlled value (null means empty; invalid input falls back to null)',
        },
      },
      {
        name: 'defaultValue',
        type: 'number | null',
        default: '—',
        description: { 'zh-CN': '非受控初始值', 'en-US': 'Uncontrolled initial value' },
      },
      {
        name: 'min',
        type: 'number',
        default: '-Infinity',
        description: { 'zh-CN': '最小值', 'en-US': 'Minimum value' },
      },
      {
        name: 'max',
        type: 'number',
        default: 'Infinity',
        description: { 'zh-CN': '最大值', 'en-US': 'Maximum value' },
      },
      {
        name: 'step',
        type: 'number',
        default: '1',
        description: {
          'zh-CN': '步长（非正数回退 1）',
          'en-US': 'Step increment (non-positive values fall back to 1)',
        },
      },
      {
        name: 'precision',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '小数位数（0-20，缺省不应用精度）',
          'en-US': 'Decimal places (0-20; no precision applied when omitted)',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '占位文案', 'en-US': 'Placeholder text' },
      },
      {
        name: 'onChange',
        type: '(value: number | null) => void',
        default: '—',
        description: {
          'zh-CN': '值变更回调（清空 / 非法输入载荷为 null）',
          'en-US': 'Value change callback (payload is null when cleared or invalid)',
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
        vue: 'change',
        react: 'onChange',
        payload: 'value: number | null',
        description: { 'zh-CN': '值提交时触发', 'en-US': 'Fired when a value is committed' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'number | null',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'v-model:value write-back' },
      },
    ],
    slots: [
      {
        vue: 'upIcon',
        react: 'renderUpIcon',
        description: { 'zh-CN': '自定义步进递增图标', 'en-US': 'Custom increment stepper icon' },
      },
      {
        vue: 'downIcon',
        react: 'renderDownIcon',
        description: { 'zh-CN': '自定义步进递减图标', 'en-US': 'Custom decrement stepper icon' },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '输入文本在失焦或回车时提交：空串 / 非法内容收敛为 null，合法值先 clamp 到 [min, max] 再按 precision 格式化。',
      'en-US':
        'Typed text is committed on blur or Enter: empty or invalid input falls back to null, while valid values are clamped to [min, max] and then formatted by precision.',
    },
    {
      'zh-CN': '步进结果始终是 step 的整数倍并按精度显示；到达边界继续步进为 no-op。',
      'en-US':
        'Stepping always lands on a multiple of step and displays at the configured precision; stepping past a boundary is a no-op.',
    },
  ],
  a11y: [
    {
      'zh-CN': '步进按钮为可聚焦的原生按钮，输入区为 number 语义，禁用状态透传 disabled。',
      'en-US':
        'Stepper buttons are focusable native buttons, the input carries number semantics, and the disabled state passes through the disabled attribute.',
    },
  ],
};

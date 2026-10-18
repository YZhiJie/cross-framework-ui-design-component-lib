import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const timePickerMeta: ComponentMeta = {
  name: 'TimePicker',
  slug: 'time-picker',
  title: '时间选择',
  category: 'form',
  summary: {
    'zh-CN': '从时 / 分 / 秒三列面板中选择时间，值为 HH:mm:ss 格式字符串，支持步长与格式配置。',
    'en-US':
      'Pick a time from hour / minute / second columns; the value is a HH:mm:ss string with configurable steps and format.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式，值为 HH:mm:ss 字符串，Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes; the value is a HH:mm:ss string; supports v-model:value on Vue',
    },
    {
      'zh-CN': 'format 支持 HH:mm:ss（默认）与 HH:mm（隐藏秒列）',
      'en-US': 'format supports HH:mm:ss (default) and HH:mm (second column hidden)',
    },
    {
      'zh-CN': 'hourStep / minuteStep / secondStep 自定义各列步长',
      'en-US': 'hourStep / minuteStep / secondStep customize each column step',
    },
    {
      'zh-CN': 'clearable 已选中时显示清空按钮；disabled 整体禁用',
      'en-US':
        'clearable shows a clear button when a value is selected; disabled disables the picker',
    },
    {
      'zh-CN': '确认-取消交互：面板内选择仅更新待选值，点击「确认」提交并收起，「取消」放弃修改',
      'en-US':
        'Confirm-cancel interaction: picking in the panel only updates a pending value; "OK" commits and closes, "Cancel" discards',
    },
  ],
  scenarios: [
    {
      'zh-CN': '需要精确选择时分秒的表单字段，如预约时间、日程时间。',
      'en-US':
        'Form fields requiring precise hour / minute / second selection, such as appointments.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '默认 HH:mm:ss 格式，三列滚动选择，支持 clearable。',
        'en-US': 'Default HH:mm:ss format with three scrollable columns; supports clearable.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '格式与步长', 'en-US': 'Format & Steps' },
      description: {
        'zh-CN': 'format="HH:mm" 仅显示时分；hourStep=2，minuteStep=10。',
        'en-US': 'format="HH:mm" shows hours & minutes only; hourStep=2, minuteStep=10.',
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
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '受控选中时间（HH:mm:ss，提供即受控）',
          'en-US': 'Controlled selected time (HH:mm:ss; controlled when provided)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '非受控初始时间（HH:mm:ss）',
          'en-US': 'Uncontrolled initial time (HH:mm:ss)',
        },
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
          'zh-CN': '是否显示清空按钮（仅已选中时）',
          'en-US': 'Whether to show the clear button (only when a value is selected)',
        },
      },
      {
        name: 'format',
        type: "'HH:mm:ss' | 'HH:mm'",
        default: "'HH:mm:ss'",
        description: {
          'zh-CN': '显示格式（HH:mm 不渲染秒列）',
          'en-US': 'Display format (HH:mm hides the second column)',
        },
      },
      {
        name: 'hourStep',
        type: 'number',
        default: '1',
        description: {
          'zh-CN': '小时步长（范围 1-23）',
          'en-US': 'Hour step (range 1-23)',
        },
      },
      {
        name: 'minuteStep',
        type: 'number',
        default: '1',
        description: {
          'zh-CN': '分钟步长（范围 1-59）',
          'en-US': 'Minute step (range 1-59)',
        },
      },
      {
        name: 'secondStep',
        type: 'number',
        default: '1',
        description: {
          'zh-CN': '秒步长（范围 1-59）',
          'en-US': 'Second step (range 1-59)',
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
          'zh-CN': '附加到根节点的内联样式',
          'en-US': 'Custom inline styles appended to the root element',
        },
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '选中值变更回调',
          'en-US': 'Selected value change callback',
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
        payload: 'value: string',
        description: {
          'zh-CN': '选中值变更',
          'en-US': 'Fired when the selected value changes',
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
        payload: 'string',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: { 'zh-CN': '自定义清除图标', 'en-US': 'Custom clear icon' },
      },
      {
        vue: 'clockIcon',
        react: 'renderClockIcon',
        description: { 'zh-CN': '自定义时钟图标', 'en-US': 'Custom clock icon' },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '值统一为 HH:mm:ss 字符串；当 format 为 HH:mm 时，秒固定为 00。',
      'en-US':
        'The value is always a HH:mm:ss string; when format is HH:mm, the seconds are fixed to 00.',
    },
    {
      'zh-CN':
        '面板内点击时间项仅更新待选值（高亮跟随），点击「确认」提交并收起面板、触发 onChange；点击「取消」、外部点击或 Esc 收起面板并放弃未确认的修改，重新展开时回退到已选值。',
      'en-US':
        'Clicking a time item only updates the pending value (highlight follows); "OK" commits it, closes the panel, and fires onChange; "Cancel", clicking outside, or Esc closes the panel and discards uncommitted changes — reopening restores the selected value.',
    },
  ],
  a11y: [
    {
      'zh-CN': '触发器 role=combobox，面板 role=dialog；Enter/Space 展开，Esc 收起。',
      'en-US':
        'The trigger has role=combobox and the panel role=dialog; Enter/Space opens and Esc closes.',
    },
  ],
};

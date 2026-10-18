import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';

export const datePickerMeta: ComponentMeta = {
  name: 'DatePicker',
  slug: 'date-picker',
  title: '日期选择',
  category: 'form',
  summary: {
    'zh-CN': '点击弹出月历面板选择单个日期，值统一为 YYYY-MM-DD 字符串，零日期依赖。',
    'en-US':
      'Click to open a month calendar and pick a single date; the value is always a YYYY-MM-DD string, with zero date dependencies.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式，Vue 端支持 v-model:value',
      'en-US': 'Controlled and uncontrolled modes; supports v-model:value on the Vue side',
    },
    {
      'zh-CN': "值格式统一为 'YYYY-MM-DD' 字符串（序列化友好），非法值回退 null",
      'en-US':
        "Values are always 'YYYY-MM-DD' strings (serialization-friendly); invalid values fall back to null",
    },
    {
      'zh-CN': '月历面板支持上个月 / 下个月切换（跨年自动滚动），42 格完整周视图',
      'en-US':
        'The calendar panel switches between previous / next month (scrolling across years automatically), with a full 42-cell week view',
    },
    {
      'zh-CN': '面板采用草稿 + 确认 / 取消模式：点选仅更新草稿，点击确认才提交值，取消或点击外部丢弃草稿',
      'en-US':
        'The panel uses a draft + confirm / cancel mode: picking a date only updates the draft; the value is committed on confirm, while cancel or outside click discards the draft',
    },
    {
      'zh-CN': 'clearable 清空、disabled 禁用；确认、取消或点击外部后自动收起',
      'en-US':
        'A clearable clear button and disabled state; the panel closes on confirm, cancel, or outside click',
    },
  ],
  scenarios: [
    {
      'zh-CN': '生日、预约、查询时间范围等需要选择某一天的表单场景。',
      'en-US':
        'Form scenarios that pick a specific day, such as birthdays, reservations, or date-range queries.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控选择', 'en-US': 'Controlled Selection' },
      description: {
        'zh-CN': '外部维护 YYYY-MM-DD 字符串，可一键清空。',
        'en-US': 'The YYYY-MM-DD string is maintained externally and can be cleared in one click.',
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
        'zh-CN': 'defaultValue 定位初始日期；disabled 下不可打开面板。',
        'en-US': 'defaultValue sets the initial date; the panel cannot be opened when disabled.',
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
          'zh-CN': "受控选中日期（'YYYY-MM-DD'）",
          'en-US': "Controlled selected date ('YYYY-MM-DD')",
        },
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': "非受控初始日期（'YYYY-MM-DD'）",
          'en-US': "Uncontrolled initial date ('YYYY-MM-DD')",
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
          'en-US': 'Whether to show the clear button (only when a date is selected)',
        },
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '选中值变更回调',
          'en-US': 'Callback when the selected value changes',
        },
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: { 'zh-CN': '清空回调', 'en-US': 'Callback on clear' },
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
        payload: 'value: string',
        description: { 'zh-CN': '选中日期变更', 'en-US': 'Fired when the selected date changes' },
      },
      {
        vue: 'clear',
        react: 'onClear',
        payload: '—',
        description: { 'zh-CN': '清空日期', 'en-US': 'Fired when the date is cleared' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'v-model:value write-back' },
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: { 'zh-CN': '自定义清除图标', 'en-US': 'Custom clear icon' },
      },
      {
        vue: 'calendarIcon',
        react: 'renderCalendarIcon',
        description: { 'zh-CN': '自定义日历图标', 'en-US': 'Custom calendar icon' },
      },
      {
        vue: 'prevIcon',
        react: 'renderPrevIcon',
        description: { 'zh-CN': '自定义上一月图标', 'en-US': 'Custom previous-month icon' },
      },
      {
        vue: 'nextIcon',
        react: 'renderNextIcon',
        description: { 'zh-CN': '自定义下一月图标', 'en-US': 'Custom next-month icon' },
      },
    ],
  },
  notes: [
    {
      'zh-CN': "契约只接受 / 输出 'YYYY-MM-DD' 字符串，不引入 Date 对象；非法字符串回退为 null。",
      'en-US':
        "The contract only accepts / emits 'YYYY-MM-DD' strings with no Date objects involved; invalid strings fall back to null.",
    },
    {
      'zh-CN': '面板打开时视图自动定位到选中日期所在月份，无选中值时定位到当前月。',
      'en-US':
        'When the panel opens, the view jumps to the month of the selected date, or to the current month when nothing is selected.',
    },
  ],
  a11y: [
    {
      'zh-CN': '日期按钮可通过键盘聚焦与选择，月份切换与日期格具备可读的文本语义。',
      'en-US':
        'Date buttons are keyboard-focusable and selectable; month switches and date cells carry readable text semantics.',
    },
  ],
};

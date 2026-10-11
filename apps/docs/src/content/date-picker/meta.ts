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
  summary: '点击弹出月历面板选择单个日期，值统一为 YYYY-MM-DD 字符串，零日期依赖。',
  features: [
    '受控 / 非受控双模式，Vue 端支持 v-model:value',
    "值格式统一为 'YYYY-MM-DD' 字符串（序列化友好），非法值回退 null",
    '月历面板支持上个月 / 下个月切换（跨年自动滚动），42 格完整周视图',
    'clearable 清空、disabled 禁用；点击外部或选中后自动收起',
  ],
  scenarios: ['生日、预约、查询时间范围等需要选择某一天的表单场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控选择',
      description: '外部维护 YYYY-MM-DD 字符串，可一键清空。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '默认值与禁用',
      description: 'defaultValue 定位初始日期；disabled 下不可打开面板。',
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'string', default: '—', description: "受控选中日期（'YYYY-MM-DD'）" },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: "非受控初始日期（'YYYY-MM-DD'）",
      },
      { name: 'placeholder', type: 'string', default: '—', description: '占位文案' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: '是否显示清空按钮（仅已选中时）',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: '选中值变更回调',
      },
      { name: 'onClear', type: '() => void', default: '—', description: '清空回调' },
    ],
    events: [
      { vue: 'change', react: 'onChange', payload: 'value: string', description: '选中日期变更' },
      { vue: 'clear', react: 'onClear', payload: '—', description: '清空日期' },
      { vue: 'update:value', react: '—', payload: 'string', description: 'v-model:value 回写' },
    ],
  },
  notes: [
    "契约只接受 / 输出 'YYYY-MM-DD' 字符串，不引入 Date 对象；非法字符串回退为 null。",
    '面板打开时视图自动定位到选中日期所在月份，无选中值时定位到当前月。',
  ],
  a11y: ['日期按钮可通过键盘聚焦与选择，月份切换与日期格具备可读的文本语义。'],
};

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
  summary: '通过步进按钮或直接键入输入数字，自动完成范围收敛、步长对齐与精度处理。',
  features: [
    '受控 / 非受控双模式，值为 number | null（清空或非法输入为 null），Vue 端支持 v-model:value',
    'min / max 边界收敛，step 步长（非正数回退 1），上下步进按钮循环对齐',
    'precision 小数位数（0-20），提交时统一格式化；非法 / 越界输入自动回退或 clamp',
    'disabled 禁用与 placeholder 占位文本',
  ],
  scenarios: ['数量、金额、比例等需要精确数字输入与步进调节的场景。'],
  demos: [
    {
      id: 'basic',
      title: '范围 / 步长 / 精度',
      description: '0-10 范围、0.5 步长、两位小数，步进与键入都会自动收敛。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: '非受控与禁用',
      description: 'defaultValue 提供初始值；越界值在提交时 clamp 到边界。',
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
        description: '受控值（null 表示空值；非法输入回退 null）',
      },
      { name: 'defaultValue', type: 'number | null', default: '—', description: '非受控初始值' },
      { name: 'min', type: 'number', default: '-Infinity', description: '最小值' },
      { name: 'max', type: 'number', default: 'Infinity', description: '最大值' },
      { name: 'step', type: 'number', default: '1', description: '步长（非正数回退 1）' },
      {
        name: 'precision',
        type: 'number',
        default: '—',
        description: '小数位数（0-20，缺省不应用精度）',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'placeholder', type: 'string', default: '—', description: '占位文案' },
      {
        name: 'onChange',
        type: '(value: number | null) => void',
        default: '—',
        description: '值变更回调（清空 / 非法输入载荷为 null）',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的自定义样式',
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: number | null',
        description: '值提交时触发',
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'number | null',
        description: 'v-model:value 回写',
      },
    ],
  },
  notes: [
    '输入文本在失焦或回车时提交：空串 / 非法内容收敛为 null，合法值先 clamp 到 [min, max] 再按 precision 格式化。',
    '步进结果始终是 step 的整数倍并按精度显示；到达边界继续步进为 no-op。',
  ],
  a11y: ['步进按钮为可聚焦的原生按钮，输入区为 number 语义，禁用状态透传 disabled。'],
};

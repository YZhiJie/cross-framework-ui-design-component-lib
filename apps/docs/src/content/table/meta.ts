import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import CustomVue from './demos/custom.vue';
import BasicReact from './demos/basic';
import CustomReact from './demos/custom';

import basicVueSource from './demos/basic.vue?raw';
import customVueSource from './demos/custom.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import customReactSource from './demos/custom.tsx?raw';

export const tableMeta: ComponentMeta = {
  name: 'Table',
  slug: 'table',
  title: '表格',
  category: 'display',
  summary: '结构化数据表格，支持列定义、非受控排序、自定义单元格与空态。',
  features: [
    'columns 列定义 + dataSource 数据驱动，rowKey 指定行唯一键',
    '列级排序：点击表头循环 升序 → 降序 → 取消（非受控内部排序）',
    'columns[].render(record, index) 自定义单元格内容（返回字符串）',
    'stripe 斑马纹 / border 边框模式',
    '空数据态支持插槽 / 回调覆盖默认"暂无数据"',
  ],
  scenarios: ['列表页、详情面板、后台管理等结构化数据的展示场景。'],
  demos: [
    {
      id: 'basic',
      title: '基础表格',
      description: '列宽、对齐、斑马纹、边框与可排序列；点击"年龄"表头体验排序循环。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'custom',
      title: '自定义单元格与空态',
      description: 'render 返回自定义文本；无数据时通过插槽 / renderEmpty 渲染自定义空态。',
      vueComponent: CustomVue,
      reactComponent: CustomReact,
      vueSource: customVueSource,
      reactSource: customReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'columns',
        type: 'TableColumn[]',
        default: '—',
        description: '列定义数组（必填）',
        required: true,
      },
      {
        name: 'dataSource',
        type: 'TableRow[]',
        default: '—',
        description: '行数据数组（必填）',
        required: true,
      },
      {
        name: 'rowKey',
        type: 'string',
        default: '—',
        description: '行唯一键字段名（缺省用行下标）',
      },
      { name: 'stripe', type: 'boolean', default: 'false', description: '斑马纹' },
      { name: 'border', type: 'boolean', default: 'false', description: '边框模式' },
      {
        name: 'onSortChange',
        type: '(sort: TableSort) => void',
        default: '—',
        description: '排序变更回调',
      },
    ],
    events: [
      {
        vue: 'sortChange',
        react: 'onSortChange',
        payload: 'TableSort',
        description: '点击表头排序时触发',
      },
    ],
    slots: [
      { vue: 'empty', react: 'renderEmpty', description: '空数据内容（覆盖默认"暂无数据"）' },
    ],
    types: [
      {
        name: 'TableColumn',
        definition: `type TableColumn = {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (record: TableRow, index: number) => string;
};`,
        description: '列定义。width 数字按 px、字符串原样；render 返回字符串覆盖默认取值。',
      },
      {
        name: 'TableSort',
        definition: `type TableSort = {
  key: string;
  order: 'asc' | 'desc' | null;
};`,
        description: '排序事件载荷，order 为 null 表示已取消排序。',
      },
    ],
  },
  notes: [
    '非受控排序：排序状态由组件内部维护，外部仅通过 sortChange 感知，不修改传入的原数组。',
    '排序比较：同为 number 按数值比较，否则按字符串（码点序）稳定排序。',
    'render 返回值仅支持字符串；单元格取值为 null / undefined 时显示为空字符串。',
  ],
  a11y: [
    '可排序列表头携带 aria-sort（ascending / descending），未排序时省略。',
    '表头使用 scope="col" 与数据行关联。',
  ],
};

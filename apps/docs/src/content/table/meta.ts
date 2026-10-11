import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import CustomVue from './demos/custom.vue';
import VirtualVue from './demos/virtual.vue';
import BasicReact from './demos/basic';
import CustomReact from './demos/custom';
import VirtualReact from './demos/virtual';

import basicVueSource from './demos/basic.vue?raw';
import customVueSource from './demos/custom.vue?raw';
import virtualVueSource from './demos/virtual.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import customReactSource from './demos/custom.tsx?raw';
import virtualReactSource from './demos/virtual.tsx?raw';

export const tableMeta: ComponentMeta = {
  name: 'Table',
  slug: 'table',
  title: '表格',
  category: 'display',
  summary: '结构化数据表格，支持列定义、非受控排序、行选择、虚拟滚动、自定义单元格与空态。',
  features: [
    'columns 列定义 + dataSource 数据驱动，rowKey 指定行唯一键',
    '列级排序：点击表头循环 升序 → 降序 → 取消（非受控内部排序）',
    'columns[].render(record, index) 自定义单元格内容（返回字符串）',
    'rowSelection 行选择：全选 / 半选联动、受控 selectedRowKeys、getCheckboxDisabled 禁用行',
    'virtual 虚拟滚动：1000+ 行仅渲染可视窗口，height / rowHeight 控制视口与行高',
    'onRowClick 行点击事件；className / style 自定义透传（支持 CSS 变量）',
    'stripe 斑马纹 / border 边框模式；空数据态支持插槽 / 回调覆盖',
  ],
  scenarios: [
    '列表页、详情面板、后台管理等结构化数据的展示场景。',
    '大数据量表格浏览场景（配合 virtual 虚拟滚动，仅渲染可视窗口）。',
    '需要勾选批量操作的列表场景（配合 rowSelection 行选择）。',
  ],
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
    {
      id: 'virtual',
      title: '虚拟滚动与行选择',
      description:
        '1000 行数据仅渲染可视窗口，滚动流畅；配合 rowSelection 勾选行，滚动时勾选状态保持。',
      vueComponent: VirtualVue,
      reactComponent: VirtualReact,
      vueSource: virtualVueSource,
      reactSource: virtualReactSource,
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
        description: '行唯一键字段名（缺省用行下标；行选择建议提供）',
      },
      { name: 'stripe', type: 'boolean', default: 'false', description: '斑马纹' },
      { name: 'border', type: 'boolean', default: 'false', description: '边框模式' },
      {
        name: 'virtual',
        type: 'boolean',
        default: 'false',
        description: '虚拟滚动模式（需提供 rowKey；建议同时设置 height 与 rowHeight）',
      },
      {
        name: 'height',
        type: 'number | string',
        default: '—',
        description: '表格主体固定高度（px）',
      },
      {
        name: 'rowHeight',
        type: 'number',
        default: '40',
        description: '虚拟模式行高（px，须与实际行高一致）',
      },
      {
        name: 'rowSelection',
        type: 'TableRowSelection',
        default: '—',
        description: '行选择配置：selectedRowKeys（受控）/ onChange / getCheckboxDisabled',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的内联样式（支持 CSS 变量如 --xui-table-row-height）',
      },
      {
        name: 'onSortChange',
        type: '(sort: TableSort) => void',
        default: '—',
        description: '排序变更回调',
      },
      {
        name: 'onRowClick',
        type: '(record: TableRow, index: number) => void',
        default: '—',
        description: '行点击回调（选择列点击不触发）',
      },
    ],
    events: [
      {
        vue: 'sortChange',
        react: 'onSortChange',
        payload: 'TableSort',
        description: '点击表头排序时触发',
      },
      {
        vue: 'rowClick',
        react: 'onRowClick',
        payload: 'record: TableRow, index: number',
        description: '点击数据行时触发（选择列点击不冒泡）',
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
      {
        name: 'TableRowSelection',
        definition: `type TableRowSelection = {
  selectedRowKeys?: TableRowKey[];
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};`,
        description:
          '行选择配置。提供 selectedRowKeys 即受控（内部状态不变，仅回调）；未全选含半选时点击全选选中全部可选行。',
      },
      {
        name: 'TableRowKey',
        definition: `type TableRowKey = string | number;`,
        description: '行唯一键（rowKey 字段取值）。',
      },
    ],
  },
  notes: [
    '非受控排序：排序状态由组件内部维护，外部仅通过 sortChange 感知，不修改传入的原数组。',
    '排序比较：同为 number 按数值比较，否则按字符串（码点序）稳定排序。',
    'render 返回值仅支持字符串；单元格取值为 null / undefined 时显示为空字符串。',
    '虚拟模式采用固定行高 + spacer 占位方案，保持原生 table 语义；行高必须与 rowHeight 一致。',
    '行选择未提供 selectedRowKeys 时为非受控（内部维护）；禁用行（getCheckboxDisabled）不参与全选。',
  ],
  a11y: [
    '可排序列表头携带 aria-sort（ascending / descending），未排序时省略。',
    '表头使用 scope="col" 与数据行关联；全选框同步 indeterminate 半选语义。',
  ],
};

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
  summary: {
    'zh-CN': '结构化数据表格，支持列定义、非受控排序、行选择、虚拟滚动、自定义单元格与空态。',
    'en-US':
      'A structured data table with column definitions, uncontrolled sorting, row selection, virtual scrolling, custom cells, and an empty state.',
  },
  features: [
    {
      'zh-CN': 'columns 列定义 + dataSource 数据驱动，rowKey 指定行唯一键',
      'en-US': 'Driven by columns definitions and dataSource, with rowKey as the unique row key',
    },
    {
      'zh-CN': '列级排序：点击表头循环 升序 → 降序 → 取消（非受控内部排序）',
      'en-US':
        'Column sorting: clicking the header cycles ascending → descending → cleared (uncontrolled internal sorting)',
    },
    {
      'zh-CN': 'columns[].render(record, index) 自定义单元格内容（返回字符串）',
      'en-US': 'columns[].render(record, index) customizes cell content (returns a string)',
    },
    {
      'zh-CN':
        'rowSelection 行选择：全选 / 半选联动、受控 selectedRowKeys、getCheckboxDisabled 禁用行',
      'en-US':
        'rowSelection row selection: linked select-all / indeterminate states, controlled selectedRowKeys, and getCheckboxDisabled for disabled rows',
    },
    {
      'zh-CN': 'virtual 虚拟滚动：1000+ 行仅渲染可视窗口，height / rowHeight 控制视口与行高',
      'en-US':
        'virtual scrolling: 1000+ rows render only the visible window; height / rowHeight control the viewport and row height',
    },
    {
      'zh-CN': 'onRowClick 行点击事件；className / style 自定义透传（支持 CSS 变量）',
      'en-US':
        'onRowClick row-click event; className / style pass-through customization (CSS variables supported)',
    },
    {
      'zh-CN': 'stripe 斑马纹 / border 边框模式；空数据态支持插槽 / 回调覆盖',
      'en-US':
        'stripe zebra striping / border mode; the empty state can be overridden via slot / render callback',
    },
  ],
  scenarios: [
    {
      'zh-CN': '列表页、详情面板、后台管理等结构化数据的展示场景。',
      'en-US': 'Displaying structured data in list pages, detail panels, admin consoles, and more.',
    },
    {
      'zh-CN': '大数据量表格浏览场景（配合 virtual 虚拟滚动，仅渲染可视窗口）。',
      'en-US':
        'Browsing large datasets (with virtual scrolling rendering only the visible window).',
    },
    {
      'zh-CN': '需要勾选批量操作的列表场景（配合 rowSelection 行选择）。',
      'en-US': 'Lists that need batch operations on checked rows (with rowSelection).',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础表格', 'en-US': 'Basic Table' },
      description: {
        'zh-CN': '列宽、对齐、斑马纹、边框与可排序列；点击"年龄"表头体验排序循环。',
        'en-US':
          'Column width, alignment, zebra striping, borders, and sortable columns; click the "Age" header to try the sort cycle.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'custom',
      title: { 'zh-CN': '自定义单元格与空态', 'en-US': 'Custom Cells & Empty State' },
      description: {
        'zh-CN': 'render 返回自定义文本；无数据时通过插槽 / renderEmpty 渲染自定义空态。',
        'en-US':
          'render returns custom text; when there is no data, use the slot / renderEmpty to render a custom empty state.',
      },
      vueComponent: CustomVue,
      reactComponent: CustomReact,
      vueSource: customVueSource,
      reactSource: customReactSource,
    },
    {
      id: 'virtual',
      title: { 'zh-CN': '虚拟滚动与行选择', 'en-US': 'Virtual Scrolling & Row Selection' },
      description: {
        'zh-CN':
          '1000 行数据仅渲染可视窗口，滚动流畅；配合 rowSelection 勾选行，滚动时勾选状态保持。',
        'en-US':
          'Only the visible window of 1000 rows is rendered for smooth scrolling; with rowSelection, checked state is preserved while scrolling.',
      },
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
        description: { 'zh-CN': '列定义数组（必填）', 'en-US': 'Column definitions (required)' },
        required: true,
      },
      {
        name: 'dataSource',
        type: 'TableRow[]',
        default: '—',
        description: { 'zh-CN': '行数据数组（必填）', 'en-US': 'Row data array (required)' },
        required: true,
      },
      {
        name: 'rowKey',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '行唯一键字段名（缺省用行下标；行选择建议提供）',
          'en-US':
            'Field name of the unique row key (falls back to row index; recommended for row selection)',
        },
      },
      {
        name: 'stripe',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '斑马纹', 'en-US': 'Zebra striping' },
      },
      {
        name: 'border',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '边框模式', 'en-US': 'Border mode' },
      },
      {
        name: 'virtual',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '虚拟滚动模式（需提供 rowKey；建议同时设置 height 与 rowHeight）',
          'en-US':
            'Virtual scrolling mode (requires rowKey; setting height and rowHeight is recommended)',
        },
      },
      {
        name: 'height',
        type: 'number | string',
        default: '—',
        description: {
          'zh-CN': '表格主体固定高度（px）',
          'en-US': 'Fixed height of the table body (px)',
        },
      },
      {
        name: 'rowHeight',
        type: 'number',
        default: '40',
        description: {
          'zh-CN': '虚拟模式行高（px，须与实际行高一致）',
          'en-US': 'Row height in virtual mode (px; must match the actual row height)',
        },
      },
      {
        name: 'rowSelection',
        type: 'TableRowSelection',
        default: '—',
        description: {
          'zh-CN': '行选择配置：selectedRowKeys（受控）/ onChange / getCheckboxDisabled',
          'en-US':
            'Row selection config: selectedRowKeys (controlled) / onChange / getCheckboxDisabled',
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
          'zh-CN': '附加到根节点的内联样式（支持 CSS 变量如 --xui-table-row-height）',
          'en-US':
            'Inline styles appended to the root element (CSS variables such as --xui-table-row-height supported)',
        },
      },
      {
        name: 'onSortChange',
        type: '(sort: TableSort) => void',
        default: '—',
        description: { 'zh-CN': '排序变更回调', 'en-US': 'Callback fired when sorting changes' },
      },
      {
        name: 'onRowClick',
        type: '(record: TableRow, index: number) => void',
        default: '—',
        description: {
          'zh-CN': '行点击回调（选择列点击不触发）',
          'en-US': 'Row-click callback (clicks on the selection column do not trigger it)',
        },
      },
    ],
    events: [
      {
        vue: 'sortChange',
        react: 'onSortChange',
        payload: 'TableSort',
        description: {
          'zh-CN': '点击表头排序时触发',
          'en-US': 'Fired when a header click changes the sorting',
        },
      },
      {
        vue: 'rowClick',
        react: 'onRowClick',
        payload: 'record: TableRow, index: number',
        description: {
          'zh-CN': '点击数据行时触发（选择列点击不冒泡）',
          'en-US':
            'Fired when a data row is clicked (clicks on the selection column do not bubble)',
        },
      },
    ],
    slots: [
      {
        vue: 'sortIcon',
        react: 'renderSortIcon',
        description: {
          'zh-CN': "自定义排序图标（作用域参数 order: 'asc' | 'desc'）",
          'en-US': "Custom sort icon (scoped param order: 'asc' | 'desc')",
        },
      },
      {
        vue: 'empty',
        react: 'renderEmpty',
        description: {
          'zh-CN': '空数据内容（覆盖默认语言包 table.empty，zh-CN："暂无数据"）',
          'en-US':
            'Empty-data content (overrides the default locale entry table.empty, zh-CN: "暂无数据")',
        },
      },
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
        description: {
          'zh-CN': '列定义。width 数字按 px、字符串原样；render 返回字符串覆盖默认取值。',
          'en-US':
            'Column definition. A numeric width is treated as px while strings are used as-is; render returns a string to override the default cell value.',
        },
      },
      {
        name: 'TableSort',
        definition: `type TableSort = {
  key: string;
  order: 'asc' | 'desc' | null;
};`,
        description: {
          'zh-CN': '排序事件载荷，order 为 null 表示已取消排序。',
          'en-US': 'Sort event payload; order set to null means sorting has been cleared.',
        },
      },
      {
        name: 'TableRowSelection',
        definition: `type TableRowSelection = {
  selectedRowKeys?: TableRowKey[];
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};`,
        description: {
          'zh-CN':
            '行选择配置。提供 selectedRowKeys 即受控（内部状态不变，仅回调）；未全选含半选时点击全选选中全部可选行。',
          'en-US':
            'Row selection config. Providing selectedRowKeys makes it controlled (internal state stays unchanged; callbacks only). When not all rows are selected (including the indeterminate state), clicking select-all selects every selectable row.',
        },
      },
      {
        name: 'TableRowKey',
        definition: `type TableRowKey = string | number;`,
        description: {
          'zh-CN': '行唯一键（rowKey 字段取值）。',
          'en-US': 'Unique row key (value of the rowKey field).',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '非受控排序：排序状态由组件内部维护，外部仅通过 sortChange 感知，不修改传入的原数组。',
      'en-US':
        'Uncontrolled sorting: sort state is maintained internally; the outside only observes it via sortChange, and the original array passed in is never mutated.',
    },
    {
      'zh-CN': '排序比较：同为 number 按数值比较，否则按字符串（码点序）稳定排序。',
      'en-US':
        'Sort comparison: two numbers compare numerically; otherwise values are stably sorted as strings (by code point).',
    },
    {
      'zh-CN': 'render 返回值仅支持字符串；单元格取值为 null / undefined 时显示为空字符串。',
      'en-US':
        'render only supports returning strings; a cell value of null / undefined renders as an empty string.',
    },
    {
      'zh-CN':
        '虚拟模式采用固定行高 + spacer 占位方案，保持原生 table 语义；行高必须与 rowHeight 一致。',
      'en-US':
        'Virtual mode uses fixed row height plus a spacer placeholder while keeping native table semantics; the actual row height must match rowHeight.',
    },
    {
      'zh-CN':
        '行选择未提供 selectedRowKeys 时为非受控（内部维护）；禁用行（getCheckboxDisabled）不参与全选。',
      'en-US':
        'Row selection is uncontrolled (internally maintained) without selectedRowKeys; disabled rows (getCheckboxDisabled) are excluded from select-all.',
    },
  ],
  a11y: [
    {
      'zh-CN': '可排序列表头携带 aria-sort（ascending / descending），未排序时省略。',
      'en-US':
        'Sortable column headers carry aria-sort (ascending / descending), omitted when unsorted.',
    },
    {
      'zh-CN': '表头使用 scope="col" 与数据行关联；全选框同步 indeterminate 半选语义。',
      'en-US':
        'Headers use scope="col" to associate with data rows; the select-all checkbox syncs the indeterminate semantics.',
    },
  ],
};

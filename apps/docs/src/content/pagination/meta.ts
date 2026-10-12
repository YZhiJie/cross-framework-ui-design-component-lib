import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const paginationMeta: ComponentMeta = {
  name: 'Pagination',
  slug: 'pagination',
  title: '分页',
  category: 'navigation',
  summary: {
    'zh-CN': '数据分页导航，页码从 1 开始，自动计算总页数并收敛越界操作。',
    'en-US':
      'Data pagination navigation with 1-based page numbers, automatically computing the total page count and clamping out-of-range operations.',
  },
  features: [
    {
      'zh-CN': '受控 value / 非受控 defaultValue，页码从 1 开始，Vue 端支持 v-model:value',
      'en-US':
        'Controlled value / uncontrolled defaultValue, 1-based page numbers, and v-model:value support on Vue',
    },
    {
      'zh-CN': 'total 总条数 + pageSize 每页条数（默认 10）自动计算总页数',
      'en-US':
        'total item count plus pageSize per-page count (default 10) automatically computes the total page count',
    },
    {
      'zh-CN': '上一页 / 下一页在边界自动 no-op，越界页码自动 clamp',
      'en-US':
        'Prev / next become no-ops at boundaries; out-of-range page numbers are clamped automatically',
    },
    {
      'zh-CN': 'disabled 禁用整个分页器',
      'en-US': 'disabled turns off the whole paginator',
    },
  ],
  scenarios: [
    {
      'zh-CN': '长列表 / 表格 / 搜索结果等数据量较大需要分页浏览的场景。',
      'en-US':
        'Browsing large datasets page by page, such as long lists, tables, or search results.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控分页', 'en-US': 'Controlled Pagination' },
      description: {
        'zh-CN': '285 条数据、每页 10 条共 29 页，外部同步当前页码。',
        'en-US': '285 items at 10 per page make 29 pages, with the current page synced externally.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: { 'zh-CN': '每页条数与禁用', 'en-US': 'Page Size & Disabled' },
      description: {
        'zh-CN': 'pageSize 改变分页粒度；disabled 下所有翻页操作无效。',
        'en-US':
          'pageSize changes the paging granularity; all paging operations are inert while disabled.',
      },
      vueComponent: VariantsVue,
      reactComponent: VariantsReact,
      vueSource: variantsVueSource,
      reactSource: variantsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '受控当前页（从 1 开始）',
          'en-US': 'Controlled current page (1-based)',
        },
      },
      {
        name: 'defaultValue',
        type: 'number',
        default: '1',
        description: { 'zh-CN': '非受控初始页码', 'en-US': 'Uncontrolled initial page number' },
      },
      {
        name: 'total',
        type: 'number',
        default: '—',
        required: true,
        description: { 'zh-CN': '数据总条数', 'en-US': 'Total number of items' },
      },
      {
        name: 'pageSize',
        type: 'number',
        default: '10',
        description: { 'zh-CN': '每页条数', 'en-US': 'Items per page' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'onChange',
        type: '(page: number) => void',
        default: '—',
        description: { 'zh-CN': '页码变更回调', 'en-US': 'Callback fired when the page changes' },
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
        payload: 'page: number',
        description: { 'zh-CN': '页码变更', 'en-US': 'Page changed' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'number',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'v-model:value write-back' },
      },
    ],
    slots: [
      {
        vue: 'prevIcon',
        react: 'renderPrevIcon',
        description: { 'zh-CN': '自定义上一页图标', 'en-US': 'Custom previous-page icon' },
      },
      {
        vue: 'nextIcon',
        react: 'renderNextIcon',
        description: { 'zh-CN': '自定义下一页图标', 'en-US': 'Custom next-page icon' },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '当前页超出总页数时（如 total 变小）会自动 clamp 到有效范围并触发一次 change。',
      'en-US':
        'When the current page exceeds the total page count (e.g., total shrinks), it is clamped to the valid range and one change is fired.',
    },
    {
      'zh-CN': 'total 变化后总页数自动重算，无需外部维护页数。',
      'en-US':
        'The total page count is recomputed automatically when total changes, so no external page-count bookkeeping is needed.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '导航区域具备分页语义，页码按钮可键盘聚焦，当前页携带 aria-current，边界按钮自动禁用。',
      'en-US':
        'The nav region has pagination semantics; page buttons are keyboard-focusable, the current page carries aria-current, and boundary buttons disable automatically.',
    },
  ],
};

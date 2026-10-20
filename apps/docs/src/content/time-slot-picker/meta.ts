import type { ComponentMeta } from '../types';
import BasicVue from './demos/basic.vue';
import BasicTsx from './demos/basic';
import ActionsVue from './demos/actions.vue';
import ActionsTsx from './demos/actions';
import RectangleVue from './demos/rectangle.vue';
import RectangleTsx from './demos/rectangle';
import UncontrolledVue from './demos/uncontrolled.vue';
import UncontrolledTsx from './demos/uncontrolled';
import CustomVue from './demos/custom.vue';
import CustomTsx from './demos/custom';

import basicVueSource from './demos/basic.vue?raw';
import basicTsxSource from './demos/basic.tsx?raw';
import actionsVueSource from './demos/actions.vue?raw';
import actionsTsxSource from './demos/actions.tsx?raw';
import rectangleVueSource from './demos/rectangle.vue?raw';
import rectangleTsxSource from './demos/rectangle.tsx?raw';
import uncontrolledVueSource from './demos/uncontrolled.vue?raw';
import uncontrolledTsxSource from './demos/uncontrolled.tsx?raw';
import customVueSource from './demos/custom.vue?raw';
import customTsxSource from './demos/custom.tsx?raw';

export const timeSlotPickerMeta: ComponentMeta = {
  name: 'TimeSlotPicker',
  slug: 'time-slot-picker',
  title: '投放时段',
  category: 'form',
  summary: {
    'zh-CN': '热力图形式的时段选择器，支持按日、周、月、年四种粒度选择，点击切换 + 拖拽矩形框选。',
    'en-US':
      'Heatmap-style time slot selector supporting day/week/month/year granularities with click toggle and rectangular drag selection.',
  },
  features: [
    {
      'zh-CN': '支持四种粒度切换：日（小时格）/ 周（周 × 小时格）/ 月（日历格）/ 年（整年热力图）',
      'en-US':
        'Four granularities: day (hours), week (week × hours), month (calendar), year (full-year heatmap)',
    },
    {
      'zh-CN':
        '两种选择交互：点击切换单个，按住鼠标拖拽按矩形区域批量选中/取消（锚点与当前格子围成矩形，mouseup 提交）',
      'en-US':
        'Two selection modes: click to toggle single, or drag to select/deselect a rectangular region (anchor and current cell form the rectangle, committed on mouseup)',
    },
    {
      'zh-CN': '受控 / 非受控双模式兼容，支持 v-model / value + onValueChange 两种绑定形式',
      'en-US':
        'Controlled and uncontrolled modes; supports v-model for Vue and value + onChange for React',
    },
    {
      'zh-CN': '参考日期决定月视图和年视图，默认参考当天日期',
      'en-US': 'referenceDate determines the month/year view, defaults to the current date',
    },
    {
      'zh-CN': '底部可选显示统计与图例，显示当前粒度下已选 / 总格子数',
      'en-US': 'Optional footer with stats and legend showing selected/total slots',
    },
    {
      'zh-CN': '提供命令式 API 供外部操作：clear / selectAll / toggle',
      'en-US': 'Imperative API for external control: clear / selectAll / toggle',
    },
  ],
  scenarios: [
    {
      'zh-CN': '广告投放时段选择、预约可预约时段、排班表时段选择',
      'en-US': 'Ad delivery scheduling, appointment time selection, shift scheduling',
    },
    {
      'zh-CN': '统计热力图形式的日期/时段勾选',
      'en-US': 'Checkbox selection on heatmap-style date/time grids',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN':
          '四种粒度切换，点击切换单个时段，或按住鼠标拖拽矩形区域批量选中/取消，支持 v-model 双向绑定。',
        'en-US':
          'Switch between four granularities. Click to toggle a slot, or drag a rectangle to select/deselect a region. Two-way binding with v-model.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicTsx,
      vueSource: basicVueSource,
      reactSource: basicTsxSource,
    },
    {
      id: 'actions',
      title: { 'zh-CN': '命令式 API', 'en-US': 'Imperative API' },
      description: {
        'zh-CN': '通过 ref 调用 selectAll 全选当前月份，clear 清空所有选择。',
        'en-US':
          'Call selectAll to select the entire current month and clear to unselect all via ref.',
      },
      vueComponent: ActionsVue,
      reactComponent: ActionsTsx,
      vueSource: actionsVueSource,
      reactSource: actionsTsxSource,
    },
    {
      id: 'rectangle',
      title: { 'zh-CN': '矩形框选', 'en-US': 'Rectangular Selection' },
      description: {
        'zh-CN':
          '月视图中按住鼠标拖拽，锚点与当前格子围成矩形并半透明预览，松开鼠标后一次性提交；从已选格子开始拖拽则批量取消。',
        'en-US':
          'In the month view, hold and drag: the anchor and current cell form a translucent preview rectangle, committed on mouseup. Dragging from a selected cell deselects the rectangle.',
      },
      vueComponent: RectangleVue,
      reactComponent: RectangleTsx,
      vueSource: rectangleVueSource,
      reactSource: rectangleTsxSource,
    },
    {
      id: 'uncontrolled',
      title: { 'zh-CN': '非受控用法', 'en-US': 'Uncontrolled Usage' },
      description: {
        'zh-CN':
          '通过 defaultValue 设置初始值，组件内部维护选中状态，仅通过 change / onChange 向外通知；配合 showFooter=false 隐藏底部统计。',
        'en-US':
          'Set the initial value with defaultValue; the component owns the state and emits change / onChange. showFooter=false hides the footer stats.',
      },
      vueComponent: UncontrolledVue,
      reactComponent: UncontrolledTsx,
      vueSource: uncontrolledVueSource,
      reactSource: uncontrolledTsxSource,
    },
    {
      id: 'custom',
      title: { 'zh-CN': '禁用与自定义样式', 'en-US': 'Disabled & Custom Style' },
      description: {
        'zh-CN':
          'disabled 禁用全部交互；通过 style 传入组件级 CSS 变量，可单独调整格子尺寸、间距与主题色，不影响其他实例。',
        'en-US':
          'disabled blocks all interactions. Pass component-level CSS variables via style to adjust cell size, gap and theme color for this instance only.',
      },
      vueComponent: CustomVue,
      reactComponent: CustomTsx,
      vueSource: customVueSource,
      reactSource: customTsxSource,
    },
  ],
  api: {
    props: [
      {
        name: 'granularity',
        type: "'day' | 'week' | 'month' | 'year'",
        default: "'week'",
        description: {
          'zh-CN': '可选时段粒度',
          'en-US': 'Granularity of selectable slots',
        },
      },
      {
        name: 'value',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '受控选中时段 key 数组（格式见下方 key 规则）',
          'en-US': 'Controlled selected slot keys (see key format below)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string[]',
        default: '[]',
        description: {
          'zh-CN': '非受控初始选中时段 key 数组',
          'en-US': 'Initial uncontrolled selected slot keys',
        },
      },
      {
        name: 'referenceDate',
        type: 'string (YYYY-MM-DD)',
        default: '当前日期',
        description: {
          'zh-CN': '月视图和年视图的参考日期，决定展示哪个月或哪一年，默认取当天日期',
          'en-US': 'Reference date for month/year views; determines which month/year to display',
        },
      },
      {
        name: 'showFooter',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '是否显示底部统计与图例',
          'en-US': 'Whether to show the footer stats and legend',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否禁用全部交互',
          'en-US': 'Whether to disable all interactions',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Extra class on the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的内联样式（支持 CSS 自定义属性）',
          'en-US': 'Inline style on the root element (CSS custom properties supported)',
        },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'string[]',
        description: {
          'zh-CN': '选中时段变更时触发（点击/矩形框选/命令式 API 操作后）',
          'en-US': 'Fires when selected slots change (after click/drag/imperative API)',
        },
      },
    ],
    methods: [
      {
        name: 'clear',
        signature: '() => void',
        description: {
          'zh-CN': '清空当前粒度下的全部选中项',
          'en-US': 'Clear all selected slots for the current granularity',
        },
      },
      {
        name: 'selectAll',
        signature: '() => void',
        description: {
          'zh-CN': '选中当前粒度下的全部时段',
          'en-US': 'Select all slots for the current granularity',
        },
      },
      {
        name: 'toggle',
        signature: '(key: string) => void',
        description: {
          'zh-CN': '切换单个指定时段的选中状态',
          'en-US': 'Toggle the selected state of a single slot',
        },
      },
    ],
    types: [],
  },
  notes: [
    {
      'zh-CN': 'key 格式规则：day → `h:HH`；week → `w:W:HH`；month/year → `YYYY-MM-DD`。',
      'en-US':
        'Key format: day → `h:HH`; week → `w:W:HH`; month/year → `YYYY-MM-DD` (weekday 1-7, 1 = Monday).',
    },
    {
      'zh-CN':
        '矩形框选：按下鼠标的格子作为锚点，与当前悬停格子围成矩形；拖拽期间以半透明预览，松开鼠标后一次性提交。锚点为未选 → 矩形内全部选中；锚点已选 → 矩形内全部取消。',
      'en-US':
        'Rectangular selection: the pressed cell is the anchor and, together with the hovered cell, defines a rectangle. Cells preview translucently while dragging and commit on mouseup. An unselected anchor selects the whole rectangle; a selected anchor deselects it.',
    },
    {
      'zh-CN':
        '年份视图为周一开头的列布局，第一行是周一，最后一行是周日，列头标注每个月第一天所在列。',
      'en-US':
        'Year view uses a column layout starting on Monday (first row Monday, last row Sunday). The column headers mark the column containing the first day of each month.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '根节点 role=group，aria-label 标注区域；每个格子为 button 元素，aria-pressed 表示选中状态；键盘可聚焦切换。',
      'en-US':
        'Root uses role=group with an aria-label; each cell is a button with aria-pressed indicating selected state; keyboard focus navigation supported.',
    },
  ],
};

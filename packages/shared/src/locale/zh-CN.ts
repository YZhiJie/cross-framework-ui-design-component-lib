/**
 * 中文（简体）语言包（默认语言）
 *
 * 文案与历史硬编码默认值逐字一致，保证升级前后零行为变化。
 */

import { DATE_WEEKDAY_LABELS } from '../components/date-picker/create-date-picker-logic';
import type { XuiLocaleData } from './locale';

export const zhCN: XuiLocaleData = {
  modal: { ok: '确认', cancel: '取消' },
  popconfirm: { confirm: '确定', cancel: '取消' },
  table: {
    empty: '暂无数据',
    selectAll: '全选',
    selectRow: (index) => `选择第 ${index + 1} 行`,
  },
  pagination: { nav: '分页', prev: '上一页', next: '下一页' },
  datePicker: {
    panel: '选择日期',
    prevMonth: '上个月',
    nextMonth: '下个月',
    titleFormat: (year, month) => `${year} 年 ${String(month).padStart(2, '0')} 月`,
    weekdays: DATE_WEEKDAY_LABELS,
    placeholder: '请选择日期',
    confirm: '确认',
    cancel: '取消',
  },
  skeleton: { loading: '加载中' },
  breadcrumb: { nav: '面包屑' },
  select: {
    searchPlaceholder: '搜索...',
    searchAriaLabel: '搜索选项',
    triggerPlaceholder: '请选择',
  },
  timePicker: {
    panel: '选择时间',
    placeholder: '请选择时间',
    confirm: '确认',
    cancel: '取消',
  },
  cascader: {
    panel: '请选择',
    placeholder: '请选择',
  },
  treeSelect: {
    panel: '请选择',
    placeholder: '请选择',
  },
  carousel: {
    region: '轮播图',
    prev: '上一张',
    next: '下一张',
    goTo: (index) => `第 ${index} 张`,
  },
  timeSlotPicker: {
    region: '投放时段',
    hint: '点击或拖拽选择投放时段',
    summary: (selected, total) => `已选 ${selected} / ${total} 个时段`,
    unselected: '未选',
    selected: '已选',
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: [
      '1 月',
      '2 月',
      '3 月',
      '4 月',
      '5 月',
      '6 月',
      '7 月',
      '8 月',
      '9 月',
      '10 月',
      '11 月',
      '12 月',
    ],
    hour: (hour) => `${String(hour).padStart(2, '0')}:00`,
    dateLabel: (year, month, day) => `${year} 年 ${month} 月 ${day} 日`,
  },
};

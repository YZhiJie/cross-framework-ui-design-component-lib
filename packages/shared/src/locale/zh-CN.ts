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
};

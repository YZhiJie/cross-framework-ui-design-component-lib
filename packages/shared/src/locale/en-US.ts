/**
 * English (US) 语言包
 */

import type { XuiLocaleData } from './locale';

/** 英文月份名（面板标题用，month 1 起始） */
const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const enUS: XuiLocaleData = {
  modal: { ok: 'OK', cancel: 'Cancel' },
  popconfirm: { confirm: 'OK', cancel: 'Cancel' },
  table: {
    empty: 'No data',
    selectAll: 'Select all',
    selectRow: (index) => `Select row ${index + 1}`,
  },
  pagination: { nav: 'Pagination', prev: 'Previous page', next: 'Next page' },
  datePicker: {
    panel: 'Select date',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    titleFormat: (year, month) => `${EN_MONTHS[month - 1]} ${year}`,
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    placeholder: 'Select date',
  },
  skeleton: { loading: 'Loading' },
  breadcrumb: { nav: 'Breadcrumb' },
  select: {
    searchPlaceholder: 'Search...',
    searchAriaLabel: 'Search options',
    triggerPlaceholder: 'Select',
  },
  timePicker: {
    panel: 'Select time',
    placeholder: 'Select time',
  },
  cascader: {
    panel: 'Please select',
    placeholder: 'Please select',
  },
};

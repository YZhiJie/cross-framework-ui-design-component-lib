/**
 * DatePicker 纯逻辑工厂
 *
 * 状态：value / draft / open / viewYear / viewMonth / rangeStage / rangeStart / disabled
 * 交互：toggleOpen / close / prevMonth / nextMonth / select / selectShortcut / confirm / clear
 * 确认-取消模式（与 TimePicker 对齐）：面板打开时 draft 从 value 拷贝，面板内
 * select / selectShortcut 仅更新草稿，confirm 提交草稿并收起面板（触发 onChange），
 * close（含取消/外部点击/Esc）丢弃草稿。
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 *
 * 模式：
 * - type='date'（默认）：单选，select 更新草稿
 * - type='range'：范围选择，第一次 select 设置 rangeStart（rangeStage='end'），
 *   第二次 select 设置 end，若 end < start 自动交换并写入草稿
 *
 * 契约：date 模式 value 为 'YYYY-MM-DD' 字符串，range 模式为 [start, end]。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 星期表头（周日起始，双端适配层共用） */
export const DATE_WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 选择模式 */
export type DatePickerType = 'date' | 'range';

/** DatePicker 值 */
export type DatePickerValue = string | [string, string];

/** 快捷选项 */
export type DateShortcut = { label: string; value: DatePickerValue };

/** 日期单元格（月矩阵 42 格：上月尾 + 本月 + 下月头） */
export type DateCell = {
  /** 'YYYY-MM-DD' */
  date: string;
  /** 几号（1-31） */
  day: number;
  /** 是否属于当前视图月份 */
  inMonth: boolean;
  /** 是否今天 */
  isToday: boolean;
};

/** DatePicker 逻辑配置（由适配层从 Props 中提取注入） */
export type DatePickerLogicOptions = {
  type?: DatePickerType;
  /** 受控选中值（提供时进入受控模式） */
  value?: DatePickerValue;
  /** 非受控初始值 */
  defaultValue?: DatePickerValue;
  disabled?: boolean;
  shortcuts?: DateShortcut[];
  onChange?: (value: DatePickerValue) => void;
  onClear?: () => void;
};

/** DatePicker 状态快照 */
export type DatePickerState = {
  value: DatePickerValue | null;
  /** 面板内待确认的草稿值（打开面板时从 value 拷贝，confirm 提交，close 丢弃） */
  draft: DatePickerValue | null;
  open: boolean;
  viewYear: number;
  viewMonth: number;
  /** range 模式当前选择阶段 */
  rangeStage: 'start' | 'end' | null;
  /** range 模式已选起始值 */
  rangeStart: string | null;
  disabled: boolean;
};

/** DatePicker 逻辑实例 */
export interface DatePickerLogicInstance extends LogicInstance<
  DatePickerLogicOptions,
  DatePickerState
> {
  /** 展开 / 收起面板（disabled 时忽略）；展开时草稿从 value 拷贝并定位视图，收起时丢弃草稿 */
  toggleOpen: () => void;
  /** 收起面板并丢弃未确认的草稿（取消按钮 / 外部点击 / Esc 同路径） */
  close: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  /** 选中日期：仅更新草稿（date 直接写入；range 先 start 后 end），不收起面板、不触发 onChange */
  select: (date: string) => void;
  /** 选中快捷选项：仅更新草稿，不收起面板、不触发 onChange */
  selectShortcut: (value: DatePickerValue) => void;
  /** 确认草稿：草稿非空且与 value 不同时提交（非受控更新 value，触发 onChange），随后收起面板 */
  confirm: () => void;
  clear: () => void;
}

/** 补零格式化 'YYYY-MM-DD' */
export function formatDateParts(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/** 校验 'YYYY-MM-DD' 是否为真实日期 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** 解析 'YYYY-MM-DD' 为年月日 */
export function parseDateString(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!isValidDateString(value)) return null;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  return { year, month, day };
}

/** 今天的 'YYYY-MM-DD' */
export function todayString(): string {
  const now = new Date();
  return formatDateParts(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * 生成月矩阵（42 格：视图月第一天所在周的周日开始，连续 6 周）
 */
export function getMonthMatrix(year: number, month: number): DateCell[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const today = todayString();
  const cells: DateCell[] = [];
  for (let offset = 0; offset < 42; offset += 1) {
    const date = new Date(year, month - 1, 1 - firstWeekday + offset);
    const dateStr = formatDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
    cells.push({
      date: dateStr,
      day: date.getDate(),
      inMonth: date.getMonth() === month - 1,
      isToday: dateStr === today,
    });
  }
  return cells;
}

/** 字符串日期比较：a < b 返回 -1，相等 0，a > b 返回 1 */
export function compareDate(a: string, b: string): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** 规整初始值：按 mode 校验，非法回退 null */
function normalizeValue(
  raw: DatePickerValue | undefined,
  type: DatePickerType,
): DatePickerValue | null {
  if (raw === undefined) return null;
  if (type === 'range') {
    if (!Array.isArray(raw)) return null;
    if (!isValidDateString(raw[0]) || !isValidDateString(raw[1])) return null;
    // 保证 start <= end
    const [a, b] = raw;
    return compareDate(a, b) <= 0 ? [a, b] : [b, a];
  }
  return isValidDateString(raw) ? raw : null;
}

/** 值等价比较 */
function valueEquals(a: DatePickerValue | null, b: DatePickerValue | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a[0] === b[0] && a[1] === b[1];
  }
  return a === b;
}

export function createDatePickerLogic(
  options: DatePickerLogicOptions = {},
): DatePickerLogicInstance {
  const type: DatePickerType = options.type === 'range' ? 'range' : 'date';
  const controlled = options.value !== undefined;

  const initialValue = normalizeValue(options.value ?? options.defaultValue, type);
  const initialParts =
    initialValue && typeof initialValue === 'string'
      ? parseDateString(initialValue)
      : initialValue && Array.isArray(initialValue)
        ? parseDateString(initialValue[0])
        : null;
  const now = new Date();

  const state: DatePickerState = {
    value: initialValue,
    draft: initialValue,
    open: false,
    viewYear: initialParts?.year ?? now.getFullYear(),
    viewMonth: initialParts?.month ?? now.getMonth() + 1,
    rangeStage: null,
    rangeStart: null,
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  const listeners = new Set<StateListener<DatePickerState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 展开面板时将视图定位到选中值所在月（未选中则今天） */
  const syncView = () => {
    const v = state.value;
    const target = v && typeof v === 'string' ? v : v && Array.isArray(v) ? v[0] : null;
    const parts = target ? parseDateString(target) : null;
    const today = new Date();
    state.viewYear = parts?.year ?? today.getFullYear();
    state.viewMonth = parts?.month ?? today.getMonth() + 1;
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      const nextDisabled = next.disabled ?? state.disabled;
      if (nextDisabled !== state.disabled) {
        state.disabled = nextDisabled;
        changed = true;
        if (state.disabled && state.open) state.open = false;
      }

      if (next.value !== undefined) {
        const nextValue = normalizeValue(next.value, type);
        if (!valueEquals(nextValue, state.value)) {
          state.value = nextValue;
          // 草稿跟随最新选中值
          state.draft = nextValue;
          changed = true;
          // 受控值变化时重置 range 暂存
          state.rangeStart = null;
          state.rangeStage = null;
          if (state.open) syncView();
        }
      }

      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      if (!state.open) {
        syncView();
        // 展开：草稿从当前选中值拷贝，重置 range 暂存
        state.draft = state.value;
        state.rangeStart = null;
        state.rangeStage = type === 'range' ? 'start' : null;
      } else {
        // 收起：丢弃未确认草稿
        state.draft = state.value;
      }
      state.open = !state.open;
      notify();
    },

    close() {
      if (!state.open) return;
      state.open = false;
      // 丢弃未确认的草稿（取消 / 外部点击 / Esc 同路径）
      state.draft = state.value;
      state.rangeStart = null;
      state.rangeStage = null;
      notify();
    },

    prevMonth() {
      if (state.viewMonth === 1) {
        state.viewMonth = 12;
        state.viewYear -= 1;
      } else {
        state.viewMonth -= 1;
      }
      notify();
    },

    nextMonth() {
      if (state.viewMonth === 12) {
        state.viewMonth = 1;
        state.viewYear += 1;
      } else {
        state.viewMonth += 1;
      }
      notify();
    },

    select(date) {
      if (state.disabled || !isValidDateString(date)) return;

      // date 模式：仅更新草稿，等待 confirm 提交
      if (type === 'date') {
        state.draft = date;
        notify();
        return;
      }

      // range 模式
      if (state.rangeStage === 'start' || state.rangeStart === null) {
        // 第一次点击：设置 start
        state.rangeStart = date;
        state.rangeStage = 'end';
        notify();
        return;
      }

      // 第二次点击：确定 end，写入草稿（面板保持展开，等待 confirm 提交）
      const start = state.rangeStart!;
      const cmp = compareDate(start, date);
      const range: [string, string] = cmp <= 0 ? [start, date] : [date, start];

      state.draft = range;
      state.rangeStart = null;
      state.rangeStage = null;
      notify();
    },

    selectShortcut(value) {
      if (state.disabled) return;
      const normalized = normalizeValue(value, type);
      if (normalized === null) return;

      // 仅更新草稿，等待 confirm 提交
      state.draft = normalized;
      state.rangeStart = null;
      state.rangeStage = null;
      notify();
    },

    confirm() {
      if (state.disabled) return;
      if (!state.open) return;
      const next = state.draft;
      state.open = false;
      state.rangeStart = null;
      state.rangeStage = null;
      // 草稿为空（未选择）或与当前值相同：直接收起，不触发 onChange
      if (next === null || valueEquals(next, state.value)) {
        state.draft = state.value;
        notify();
        return;
      }
      if (!controlled) {
        state.value = next;
      }
      notify();
      onChange?.(next);
    },

    clear() {
      if (state.disabled) return;
      if (state.value === null) return;
      if (!controlled) {
        state.value = null;
        state.rangeStart = null;
        state.rangeStage = null;
      }
      state.draft = null;
      notify();
      // 受控模式下通过 onChange 通知外部清空：date→''，range→['','']
      onChange?.(type === 'range' ? (['', ''] as [string, string]) : '');
      onClear?.();
    },
  };
}

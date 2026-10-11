/**
 * DatePicker 纯逻辑工厂
 *
 * 状态：value / open / viewYear / viewMonth / disabled
 * 交互：toggleOpen / close / prevMonth / nextMonth / select / clear
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 契约：value 为 'YYYY-MM-DD' 字符串，非法值回退 null。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 星期表头（周日起始，双端适配层共用） */
export const DATE_WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

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
  /** 受控选中日期（提供时进入受控模式） */
  value?: string;
  /** 非受控初始日期 */
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

/** DatePicker 状态快照 */
export type DatePickerState = {
  /** 当前选中日期（'YYYY-MM-DD'，null 表示未选中） */
  value: string | null;
  /** 面板展开状态 */
  open: boolean;
  /** 面板当前展示年份 */
  viewYear: number;
  /** 面板当前展示月份（1-12） */
  viewMonth: number;
  disabled: boolean;
};

/** DatePicker 逻辑实例 */
export interface DatePickerLogicInstance extends LogicInstance<
  DatePickerLogicOptions,
  DatePickerState
> {
  /** 展开 / 收起面板（disabled 时忽略；展开时视图定位到选中值或今天） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 视图切换到上个月（跨年自动滚动） */
  prevMonth: () => void;
  /** 视图切换到下个月（跨年自动滚动） */
  nextMonth: () => void;
  /** 选中日期：非法值忽略；非受控更新 value；受控仅回调；选中后收起面板 */
  select: (date: string) => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
}

/** 补零格式化 'YYYY-MM-DD'（内部使用） */
export function formatDateParts(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/** 校验 'YYYY-MM-DD' 是否为真实日期（拦截 2024-02-31 之类） */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** 解析 'YYYY-MM-DD' 为年月日（非法返回 null） */
export function parseDateString(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!isValidDateString(value)) return null;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  return { year, month, day };
}

/** 今天的 'YYYY-MM-DD'（本地时区） */
export function todayString(): string {
  const now = new Date();
  return formatDateParts(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * 生成月矩阵（纯函数，双端适配层共用）
 *
 * 42 格：视图月第一天所在周的周日开始，连续 6 周；
 * 含上月尾 / 下月头格子（inMonth=false），isToday 以本地时区当天标记。
 * month 参数为 1-12。
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

export function createDatePickerLogic(
  options: DatePickerLogicOptions = {},
): DatePickerLogicInstance {
  const controlled = options.value !== undefined;

  // 非法初始值回退 null
  const initialValue = isValidDateString(options.value ?? options.defaultValue)
    ? (options.value ?? options.defaultValue)!
    : null;

  const initialParts = initialValue
    ? (parseDateString(initialValue) as { year: number; month: number })
    : null;
  const now = new Date();

  const state: DatePickerState = {
    value: initialValue,
    open: false,
    viewYear: initialParts?.year ?? now.getFullYear(),
    viewMonth: initialParts?.month ?? now.getMonth() + 1,
    disabled: options.disabled ?? false,
  };

  const onChange = options.onChange;
  const onClear = options.onClear;
  const listeners = new Set<StateListener<DatePickerState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  // 展开面板时将视图定位到选中值所在月（未选中则定位到今天）
  const syncView = () => {
    const parts = state.value ? parseDateString(state.value) : null;
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
        // 运行时禁用：收起面板
        if (state.disabled && state.open) {
          state.open = false;
        }
      }

      // 受控值同步（非法值回退 null）
      if (next.value !== undefined) {
        const nextValue = isValidDateString(next.value) ? next.value : null;
        if (nextValue !== state.value) {
          state.value = nextValue;
          changed = true;
          if (state.open) syncView();
        }
      }

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      state.open = !state.open;
      if (state.open) syncView();
      notify();
    },

    close() {
      if (!state.open) return;
      state.open = false;
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
      if (!controlled) {
        state.value = date;
      }
      state.open = false;
      notify();
      onChange?.(date);
    },

    clear() {
      if (!controlled && state.value !== null) {
        state.value = null;
        notify();
      }
      onClear?.();
    },
  };
}

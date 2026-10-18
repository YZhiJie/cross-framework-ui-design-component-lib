/**
 * TimePicker 纯逻辑工厂
 *
 * 状态：value / draft / open / disabled
 * 交互：toggleOpen / close / selectDraft / confirm / clear
 * 确认-取消模式：面板打开时 draft 从 value 拷贝，面板内 selectDraft 仅更新草稿，
 * confirm 提交草稿并收起面板（触发 onChange），close（含取消/外部点击/Esc）丢弃草稿。
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 契约：value 为 'HH:mm:ss' 字符串，非法值回退 null。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 时间格式 */
export type TimeFormat = 'HH:mm:ss' | 'HH:mm';

/** 时间逻辑配置（由适配层从 Props 中提取注入） */
export type TimePickerLogicOptions = {
  /** 受控选中时间（提供时进入受控模式） */
  value?: string;
  /** 非受控初始时间 */
  defaultValue?: string;
  disabled?: boolean;
  format?: TimeFormat;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

/** TimePicker 状态快照 */
export type TimePickerState = {
  /** 当前选中时间（'HH:mm:ss'，null 表示未选中） */
  value: string | null;
  /** 面板内待确认的草稿时间（打开面板时从 value 拷贝，confirm 提交，close 丢弃） */
  draft: string | null;
  /** 面板展开状态 */
  open: boolean;
  disabled: boolean;
};

/** TimePicker 逻辑实例 */
export interface TimePickerLogicInstance extends LogicInstance<
  TimePickerLogicOptions,
  TimePickerState
> {
  /** 展开 / 收起面板（disabled 时忽略）；展开时草稿从 value 拷贝，收起时丢弃草稿 */
  toggleOpen: () => void;
  /** 收起面板并丢弃未确认的草稿（取消按钮 / 外部点击 / Esc 同路径） */
  close: () => void;
  /** 更新面板内草稿：非法值忽略；仅更新 draft，不收起面板、不触发 onChange */
  selectDraft: (hour: number, minute: number, second: number) => void;
  /** 确认草稿：草稿合法且与 value 不同时提交（非受控更新 value，触发 onChange），随后收起面板 */
  confirm: () => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
}

/** 补零格式化 'HH:mm:ss' */
export function formatTime(hour: number, minute: number, second: number): string {
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/** 校验 'HH:mm:ss' 是否为真实时间（拦截 25:00:00 / 12:60:00 之类） */
export function isValidTimeString(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute, second] = value.split(':').map(Number) as [number, number, number];
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59;
}

/** 解析 'HH:mm:ss' 为时分秒（非法返回 null） */
export function parseTimeString(
  value: string,
): { hour: number; minute: number; second: number } | null {
  if (!isValidTimeString(value)) return null;
  const [hour, minute, second] = value.split(':').map(Number) as [number, number, number];
  return { hour, minute, second };
}

/** 当前本地时间的 'HH:mm:ss' */
export function nowTimeString(): string {
  const now = new Date();
  return formatTime(now.getHours(), now.getMinutes(), now.getSeconds());
}

/**
 * 生成时间列的可选值数组（纯函数，双端适配层共用）
 *
 * max 为上界（不含），step 为步长。例如 hours = genTimeColumn(24, 1) → [0..23]。
 */
export function genTimeColumn(max: number, step: number): number[] {
  const safeStep = Math.max(1, Math.floor(step || 1));
  const result: number[] = [];
  for (let i = 0; i < max; i += safeStep) {
    result.push(i);
  }
  return result;
}

/** 把选中值规整到最近的步长值（用于面板回显时高亮最近项） */
export function snapToStep(value: number, step: number, max: number): number {
  const safeStep = Math.max(1, Math.floor(step || 1));
  const snapped = Math.round(value / safeStep) * safeStep;
  return Math.min(max - 1, Math.max(0, snapped));
}

export function createTimePickerLogic(
  options: TimePickerLogicOptions = {},
): TimePickerLogicInstance {
  const controlled = options.value !== undefined;

  // 非法初始值回退 null
  const initialValue = isValidTimeString(options.value ?? options.defaultValue)
    ? (options.value ?? options.defaultValue)!
    : null;

  const state: TimePickerState = {
    value: initialValue,
    draft: initialValue,
    open: false,
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  const listeners = new Set<StateListener<TimePickerState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
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

      // 受控值同步（非法值回退 null）；草稿跟随最新选中值
      if (next.value !== undefined) {
        const nextValue = isValidTimeString(next.value) ? next.value : null;
        if (nextValue !== state.value) {
          state.value = nextValue;
          state.draft = nextValue;
          changed = true;
        }
      }

      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      state.open = !state.open;
      // 展开：草稿从当前选中值拷贝；收起：丢弃未确认草稿
      state.draft = state.value;
      notify();
    },

    close() {
      if (!state.open) return;
      state.open = false;
      // 丢弃未确认的草稿（取消 / 外部点击 / Esc 同路径）
      state.draft = state.value;
      notify();
    },

    selectDraft(hour, minute, second) {
      if (state.disabled) return;
      // 范围校验
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        return;
      }
      // 仅更新草稿，不收起面板、不触发 onChange，等待 confirm 提交
      state.draft = formatTime(hour, minute, second);
      notify();
    },

    confirm() {
      if (state.disabled) return;
      if (!state.open) return;
      const next = isValidTimeString(state.draft) ? state.draft : null;
      state.open = false;
      // 草稿为空（未选择）或与当前值相同：直接收起，不触发 onChange
      if (next === null || next === state.value) {
        state.draft = state.value;
        notify();
        return;
      }
      if (!controlled) {
        state.value = next;
      }
      state.draft = next;
      notify();
      onChange?.(next);
    },

    clear() {
      if (state.disabled) return;
      if (state.value === null) return;
      if (!controlled) {
        state.value = null;
      }
      state.draft = null;
      notify();
      // 受控模式下需通过 onChange 通知外部清空（适配层 emit update:value），
      // 非受控模式同样广播值变化，保持双端语义一致
      onChange?.('');
      onClear?.();
    },
  };
}

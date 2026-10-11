/**
 * Select 纯逻辑工厂
 *
 * 状态：value / open / activeIndex / disabled
 * 交互：toggleOpen / close / select / clear / moveHighlight / confirmHighlight
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 下拉选项（与 @xui/core 的 SelectOption 结构一致；shared 不依赖 core，本地定义） */
export type SelectOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（组内唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

/** Select 逻辑配置（由适配层从 Props 中提取注入） */
export type SelectLogicOptions = {
  /** 受控选中值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  /** 选项数组（用于键盘高亮跳过禁用项） */
  options?: SelectOption[];
  disabled?: boolean;
  clearable?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

/** Select 状态快照 */
export type SelectState = {
  /** 当前选中值（null 表示未选中） */
  value: string | null;
  /** 下拉面板展开状态 */
  open: boolean;
  /** 键盘高亮项下标（-1 表示无高亮） */
  activeIndex: number;
  disabled: boolean;
};

/** Select 逻辑实例 */
export interface SelectLogicInstance extends LogicInstance<SelectLogicOptions, SelectState> {
  /** 展开 / 收起下拉面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起下拉面板 */
  close: () => void;
  /** 选中指定值：禁用项忽略；非受控更新 value；受控仅回调 */
  select: (value: string) => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
  /** 键盘移动高亮项（+1 / -1，跳过禁用项） */
  moveHighlight: (delta: 1 | -1) => void;
  /** 确认当前高亮项（无高亮时忽略） */
  confirmHighlight: () => void;
}

export function createSelectLogic(options: SelectLogicOptions = {}): SelectLogicInstance {
  const controlled = options.value !== undefined;

  const state: SelectState = {
    value: options.value ?? options.defaultValue ?? null,
    open: false,
    activeIndex: -1,
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  let optionList: SelectOption[] = options.options ?? [];
  let clearable = options.clearable ?? false;
  const listeners = new Set<StateListener<SelectState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /**
   * 找到从 from 起 delta 方向的第一个可用项下标（循环跳过禁用项）
   * from 为 -1（无高亮/未选中）时：delta=1 从头开始，delta=-1 从尾开始
   */
  const nextEnabledIndex = (from: number, delta: 1 | -1): number => {
    const total = optionList.length;
    if (total === 0) return -1;
    const begin = from === -1 ? (delta === 1 ? 0 : total - 1) : from + delta;
    for (let step = 0; step < total; step += 1) {
      const index = (((begin + delta * step) % total) + total) % total;
      if (!optionList[index]?.disabled) return index;
    }
    return -1;
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

      if (next.value !== undefined && next.value !== state.value) {
        state.value = next.value;
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        if (state.disabled) {
          state.open = false;
          state.activeIndex = -1;
        }
        changed = true;
      }
      if (next.options !== undefined) optionList = next.options;
      if (next.clearable !== undefined) clearable = next.clearable;
      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      if (state.open) {
        state.open = false;
        state.activeIndex = -1;
      } else {
        state.open = true;
        // 展开时高亮当前选中项，未选中则定位第一个可用项
        const selectedIndex = optionList.findIndex((option) => option.value === state.value);
        state.activeIndex =
          selectedIndex !== -1 && !optionList[selectedIndex]?.disabled
            ? selectedIndex
            : nextEnabledIndex(-1, 1);
      }
      notify();
    },

    close() {
      if (!state.open && state.activeIndex === -1) return;
      state.open = false;
      state.activeIndex = -1;
      notify();
    },

    select(value) {
      if (state.disabled) return;
      const option = optionList.find((item) => item.value === value);
      if (!option || option.disabled) return;

      state.open = false;
      state.activeIndex = -1;

      if (state.value !== value) {
        if (!controlled) {
          state.value = value;
          notify();
        }
        onChange?.(value);
      } else {
        // 重复选中相同值：仅收起面板
        notify();
      }
    },

    clear() {
      if (state.disabled || !clearable || state.value === null) return;
      if (!controlled) {
        state.value = null;
        notify();
      }
      onClear?.();
    },

    moveHighlight(delta) {
      if (state.disabled || !state.open || optionList.length === 0) return;
      const next = nextEnabledIndex(state.activeIndex, delta);
      if (next !== -1 && next !== state.activeIndex) {
        state.activeIndex = next;
        notify();
      }
    },

    confirmHighlight() {
      if (state.activeIndex === -1) return;
      const option = optionList[state.activeIndex];
      if (option) this.select(option.value);
    },
  };
}

/**
 * Checkbox 纯逻辑工厂
 *
 * 状态：checked / disabled / indeterminate
 * 交互：toggle（disabled 时静默忽略；半选状态点击后切换为全选）
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中态，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Checkbox 逻辑配置（由适配层从 Props 中提取注入） */
export type CheckboxLogicOptions = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (value: boolean) => void;
};

/** Checkbox 状态快照 */
export type CheckboxState = {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
};

/** Checkbox 逻辑实例 */
export interface CheckboxLogicInstance extends LogicInstance<CheckboxLogicOptions, CheckboxState> {
  /** 切换处理：disabled 时不更新状态、不触发回调 */
  toggle: () => void;
}

export function createCheckboxLogic(options: CheckboxLogicOptions = {}): CheckboxLogicInstance {
  const controlled = options.value !== undefined;

  const state: CheckboxState = {
    checked: options.value ?? options.defaultValue ?? false,
    disabled: options.disabled ?? false,
    indeterminate: options.indeterminate ?? false,
  };

  let onChange = options.onChange;
  const listeners = new Set<StateListener<CheckboxState>>();

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

      if (next.value !== undefined && next.value !== state.checked) {
        state.checked = next.value;
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.indeterminate !== undefined && next.indeterminate !== state.indeterminate) {
        state.indeterminate = next.indeterminate;
        changed = true;
      }
      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed) notify();
    },

    toggle() {
      if (state.disabled) return;
      const next = state.indeterminate ? true : !state.checked;
      if (!controlled) {
        state.checked = next;
        // 手动切换后半选状态清除（语义与原生 checkbox 一致）
        if (state.indeterminate) state.indeterminate = false;
        notify();
      }
      onChange?.(next);
    },
  };
}

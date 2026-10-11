/**
 * Switch 纯逻辑工厂
 *
 * 状态：checked / disabled / loading
 * 交互：toggle（disabled / loading 时静默忽略）
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中态，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Switch 逻辑配置（由适配层从 Props 中提取注入） */
export type SwitchLogicOptions = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: boolean) => void;
};

/** Switch 状态快照 */
export type SwitchState = {
  checked: boolean;
  disabled: boolean;
  loading: boolean;
};

/** Switch 逻辑实例 */
export interface SwitchLogicInstance extends LogicInstance<SwitchLogicOptions, SwitchState> {
  /** 切换处理：disabled / loading 时不更新状态、不触发回调 */
  toggle: () => void;
}

export function createSwitchLogic(options: SwitchLogicOptions = {}): SwitchLogicInstance {
  const controlled = options.value !== undefined;

  const state: SwitchState = {
    checked: options.value ?? options.defaultValue ?? false,
    disabled: options.disabled ?? false,
    loading: options.loading ?? false,
  };

  let onChange = options.onChange;
  const listeners = new Set<StateListener<SwitchState>>();

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
      if (next.loading !== undefined && next.loading !== state.loading) {
        state.loading = next.loading;
        changed = true;
      }
      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed) notify();
    },

    toggle() {
      if (state.disabled || state.loading) return;
      const next = !state.checked;
      if (!controlled) {
        state.checked = next;
        notify();
      }
      onChange?.(next);
    },
  };
}

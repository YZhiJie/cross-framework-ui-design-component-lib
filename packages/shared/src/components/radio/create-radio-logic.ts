/**
 * Radio 纯逻辑工厂
 *
 * 状态：disabled
 * Radio 是 RadioGroup 的子项组件：选中态由组上下文派生（不进入逻辑层），
 * 逻辑层仅负责 disabled 状态与 Props 同步。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Radio 逻辑配置（由适配层从 Props 中提取注入） */
export type RadioLogicOptions = {
  disabled?: boolean;
};

/** Radio 状态快照 */
export type RadioState = {
  disabled: boolean;
};

/** Radio 逻辑实例 */
export type RadioLogicInstance = LogicInstance<RadioLogicOptions, RadioState>;

export function createRadioLogic(options: RadioLogicOptions = {}): RadioLogicInstance {
  const state: RadioState = {
    disabled: options.disabled ?? false,
  };

  const listeners = new Set<StateListener<RadioState>>();

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
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        notify();
      }
    },
  };
}

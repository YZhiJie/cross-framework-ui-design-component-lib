/**
 * Button 纯逻辑工厂
 *
 * 状态：disabled / loading
 * 交互：handleClick（禁用或加载中时静默忽略）
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Button 逻辑配置（由适配层从 Props 中提取注入） */
export type ButtonLogicOptions = {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
};

/** Button 状态快照 */
export type ButtonState = {
  disabled: boolean;
  loading: boolean;
};

/** Button 逻辑实例 */
export interface ButtonLogicInstance extends LogicInstance<ButtonLogicOptions, ButtonState> {
  /** 点击处理：disabled 或 loading 时不触发回调 */
  handleClick: (event: MouseEvent) => void;
}

export function createButtonLogic(options: ButtonLogicOptions = {}): ButtonLogicInstance {
  const state: ButtonState = {
    disabled: options.disabled ?? false,
    loading: options.loading ?? false,
  };

  let onClick = options.onClick;
  const listeners = new Set<StateListener<ButtonState>>();

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

      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.loading !== undefined && next.loading !== state.loading) {
        state.loading = next.loading;
        changed = true;
      }
      if (next.onClick !== undefined) {
        onClick = next.onClick;
      }

      if (changed) notify();
    },

    handleClick(event) {
      if (state.disabled || state.loading) return;
      onClick?.(event);
    },
  };
}

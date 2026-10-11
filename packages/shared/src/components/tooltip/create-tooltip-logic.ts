/**
 * Tooltip 纯逻辑工厂
 *
 * 状态：open / disabled
 * 交互：show / hide（禁用时静默忽略）
 * placement / trigger 为纯展示配置，由适配层直接从 Props 读取，
 * 逻辑层仅管理展开状态。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Tooltip 逻辑配置（由适配层从 Props 中提取注入） */
export type TooltipLogicOptions = {
  disabled?: boolean;
};

/** Tooltip 状态快照 */
export type TooltipState = {
  /** 提示框展开状态 */
  open: boolean;
  disabled: boolean;
};

/** Tooltip 逻辑实例 */
export interface TooltipLogicInstance extends LogicInstance<TooltipLogicOptions, TooltipState> {
  /** 展开提示框：disabled 时不展开 */
  show: () => void;
  /** 收起提示框：未展开时为 no-op */
  hide: () => void;
}

export function createTooltipLogic(options: TooltipLogicOptions = {}): TooltipLogicInstance {
  const state: TooltipState = {
    open: false,
    disabled: options.disabled ?? false,
  };

  const listeners = new Set<StateListener<TooltipState>>();

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
        // 运行时禁用：收起已展开的提示框
        if (state.disabled && state.open) {
          state.open = false;
        }
      }

      if (changed) notify();
    },

    show() {
      if (state.disabled || state.open) return;
      state.open = true;
      notify();
    },

    hide() {
      if (!state.open) return;
      state.open = false;
      notify();
    },
  };
}

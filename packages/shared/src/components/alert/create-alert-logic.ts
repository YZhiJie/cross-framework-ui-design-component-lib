/**
 * Alert 纯逻辑工厂
 *
 * 状态：visible / closable
 * 交互：handleClose（隐藏提示并触发 close 回调）
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Alert 逻辑配置（由适配层从 Props 中提取注入） */
export type AlertLogicOptions = {
  /** 是否可关闭 */
  closable?: boolean;
  onClose?: () => void;
};

/** Alert 状态快照 */
export type AlertState = {
  visible: boolean;
  closable: boolean;
};

/** Alert 逻辑实例 */
export interface AlertLogicInstance extends LogicInstance<AlertLogicOptions, AlertState> {
  /** 关闭处理：已隐藏时重复调用被忽略 */
  handleClose: () => void;
}

export function createAlertLogic(options: AlertLogicOptions = {}): AlertLogicInstance {
  const state: AlertState = {
    visible: true,
    closable: options.closable ?? false,
  };

  let onClose = options.onClose;
  const listeners = new Set<StateListener<AlertState>>();

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

      if (next.closable !== undefined && next.closable !== state.closable) {
        state.closable = next.closable;
        changed = true;
      }
      if (next.onClose !== undefined) {
        onClose = next.onClose;
      }

      if (changed) notify();
    },

    handleClose() {
      if (!state.visible) return;
      state.visible = false;
      notify();
      onClose?.();
    },
  };
}

/**
 * Popconfirm 纯逻辑工厂
 *
 * 状态：open（开关）/ placement（收敛到四方位）/ disabled
 * 交互：toggle（disabled no-op）/ confirm / cancel（收起 + 回调）/ close（收起无回调）。
 * 运行时禁用收起已开气泡。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 方位 */
export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Popconfirm 逻辑配置（由适配层从 Props 中提取注入） */
export type PopconfirmLogicOptions = {
  placement?: PopconfirmPlacement;
  disabled?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

/** Popconfirm 状态快照 */
export type PopconfirmState = {
  open: boolean;
  placement: PopconfirmPlacement;
  disabled: boolean;
};

/** Popconfirm 逻辑实例 */
export type PopconfirmLogicInstance = LogicInstance<
  PopconfirmLogicOptions,
  PopconfirmState
> & {
  /** 点击触发元素切换开关（disabled no-op） */
  toggle: () => void;
  /** 点击确定：收起并触发 onConfirm */
  confirm: () => void;
  /** 点击取消：收起并触发 onCancel */
  cancel: () => void;
  /** 点击外部收起（不触发回调） */
  close: () => void;
};

/** 与 core spec defaults 保持一致 */
const PLACEMENTS: PopconfirmPlacement[] = ['top', 'bottom', 'left', 'right'];

/** 收敛 placement：非法值 → 'top' */
function normalizePlacement(raw: PopconfirmPlacement | undefined): PopconfirmPlacement {
  return raw !== undefined && PLACEMENTS.includes(raw) ? raw : 'top';
}

export function createPopconfirmLogic(
  options: PopconfirmLogicOptions = {},
): PopconfirmLogicInstance {
  const state: PopconfirmState = {
    open: false,
    placement: normalizePlacement(options.placement),
    disabled: options.disabled ?? false,
  };

  const listeners = new Set<StateListener<PopconfirmState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 收起气泡（幂等：未开 no-op） */
  function collapse() {
    if (!state.open) return false;
    state.open = false;
    notify();
    return true;
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      const nextPlacement =
        next.placement !== undefined ? normalizePlacement(next.placement) : state.placement;
      const nextDisabled = next.disabled !== undefined ? next.disabled : state.disabled;

      // 运行时禁用收起已开气泡
      let changed = nextPlacement !== state.placement || nextDisabled !== state.disabled;
      state.placement = nextPlacement;
      state.disabled = nextDisabled;
      if (nextDisabled && state.open) {
        state.open = false;
        changed = true;
      }
      if (changed) notify();
    },

    toggle() {
      if (state.disabled) return;
      state.open = !state.open;
      notify();
    },

    confirm() {
      if (!collapse()) return;
      options.onConfirm?.();
    },

    cancel() {
      if (!collapse()) return;
      options.onCancel?.();
    },

    close() {
      collapse();
    },
  };
}

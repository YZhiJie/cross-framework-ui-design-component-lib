/**
 * Switch 纯逻辑工厂
 *
 * 状态：checked / disabled / loading
 * 交互：toggle（disabled / loading 时静默忽略；beforeChange 返回 false / reject 时中止）
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
  beforeChange?: (value: boolean) => boolean | Promise<boolean>;
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
  /** 切换处理：disabled / loading 时不更新状态、不触发回调；beforeChange 返回 false / reject 时中止 */
  toggle: () => void | Promise<void>;
}

export function createSwitchLogic(options: SwitchLogicOptions = {}): SwitchLogicInstance {
  const controlled = options.value !== undefined;

  const state: SwitchState = {
    checked: options.value ?? options.defaultValue ?? false,
    disabled: options.disabled ?? false,
    loading: options.loading ?? false,
  };

  /** beforeChange 异步期间的内部 pending 标志，合并到 loading 展示 */
  let pending = false;
  let beforeChange = options.beforeChange;
  let onChange = options.onChange;
  const listeners = new Set<StateListener<SwitchState>>();

  const snapshot = (): SwitchState => ({
    ...state,
    loading: state.loading || pending,
  });

  const notify = () => {
    listeners.forEach((listener) => listener(snapshot()));
  };

  const applyChange = (next: boolean) => {
    if (!controlled) {
      state.checked = next;
    }
    onChange?.(next);
    notify();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: snapshot,

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
      if (next.beforeChange !== undefined) {
        beforeChange = next.beforeChange;
      }
      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed || pending) notify();
    },

    toggle() {
      if (state.disabled || state.loading || pending) return;
      const next = !state.checked;
      const result = beforeChange?.(next);

      // 同步拒绝：直接中止
      if (result === false) return;

      // 异步：进入 pending（展示为 loading），等待结果
      if (result instanceof Promise) {
        pending = true;
        notify();
        return result
          .then((allowed) => {
            pending = false;
            if (allowed !== false) applyChange(next);
            else notify();
          })
          .catch(() => {
            pending = false;
            notify();
          });
      }

      // 同步允许（true 或 undefined）
      applyChange(next);
      return;
    },
  };
}

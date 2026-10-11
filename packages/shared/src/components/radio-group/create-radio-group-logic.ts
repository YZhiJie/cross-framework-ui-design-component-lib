/**
 * RadioGroup 纯逻辑工厂
 *
 * 状态：value / disabled
 * 交互：select（disabled 时静默忽略；非受控模式内部更新选中值）
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** RadioGroup 逻辑配置（由适配层从 Props 中提取注入） */
export type RadioGroupLogicOptions = {
  /** 受控选中值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

/** RadioGroup 状态快照 */
export type RadioGroupState = {
  /** 当前选中值（null 表示未选中任何项） */
  value: string | null;
  disabled: boolean;
};

/** RadioGroup 逻辑实例 */
export interface RadioGroupLogicInstance extends LogicInstance<
  RadioGroupLogicOptions,
  RadioGroupState
> {
  /** 选中处理：disabled 时不更新状态、不触发回调 */
  select: (value: string) => void;
}

export function createRadioGroupLogic(
  options: RadioGroupLogicOptions = {},
): RadioGroupLogicInstance {
  const controlled = options.value !== undefined;

  const state: RadioGroupState = {
    value: options.value ?? options.defaultValue ?? null,
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  const listeners = new Set<StateListener<RadioGroupState>>();

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

      if (next.value !== undefined && next.value !== state.value) {
        state.value = next.value;
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed) notify();
    },

    select(value) {
      if (state.disabled) return;
      if (!controlled && state.value !== value) {
        state.value = value;
        notify();
      }
      onChange?.(value);
    },
  };
}

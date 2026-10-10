/**
 * Input 纯逻辑工厂
 *
 * 状态：value / focused / disabled / readonly
 * 交互：handleInput / handleChange / handleFocus / handleBlur / handleClear
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新 value，由外部通过 updateOptions 同步。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Input 逻辑配置（由适配层从 Props 中提取注入） */
export type InputLogicOptions = {
  /** 受控值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClear?: () => void;
};

/** Input 状态快照 */
export type InputState = {
  value: string;
  focused: boolean;
  disabled: boolean;
  readonly: boolean;
};

/** Input 逻辑实例 */
export interface InputLogicInstance
  extends LogicInstance<InputLogicOptions, InputState> {
  /** 输入处理：disabled / readonly 时忽略 */
  handleInput: (value: string) => void;
  /** 值变更提交（失焦或回车） */
  handleChange: (value: string) => void;
  handleFocus: (event: FocusEvent) => void;
  handleBlur: (event: FocusEvent) => void;
  /** 清空处理（clearable 模式下点击清除图标） */
  handleClear: () => void;
}

export function createInputLogic(
  options: InputLogicOptions = {},
): InputLogicInstance {
  const controlled = options.value !== undefined;

  const state: InputState = {
    value: options.value ?? options.defaultValue ?? '',
    focused: false,
    disabled: options.disabled ?? false,
    readonly: options.readonly ?? false,
  };

  let onInput = options.onInput;
  let onChange = options.onChange;
  let onFocus = options.onFocus;
  let onBlur = options.onBlur;
  let onClear = options.onClear;

  const listeners = new Set<StateListener<InputState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  const canEdit = () => !state.disabled && !state.readonly;

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
      if (next.readonly !== undefined && next.readonly !== state.readonly) {
        state.readonly = next.readonly;
        changed = true;
      }
      if (next.onInput !== undefined) onInput = next.onInput;
      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onFocus !== undefined) onFocus = next.onFocus;
      if (next.onBlur !== undefined) onBlur = next.onBlur;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    handleInput(value) {
      if (!canEdit()) return;
      if (!controlled) {
        state.value = value;
        notify();
      }
      onInput?.(value);
    },

    handleChange(value) {
      if (!canEdit()) return;
      onChange?.(value);
    },

    handleFocus(event) {
      state.focused = true;
      notify();
      onFocus?.(event);
    },

    handleBlur(event) {
      state.focused = false;
      notify();
      onBlur?.(event);
    },

    handleClear() {
      if (!canEdit()) return;
      if (!controlled) {
        state.value = '';
        notify();
      }
      onInput?.('');
      onClear?.();
    },
  };
}

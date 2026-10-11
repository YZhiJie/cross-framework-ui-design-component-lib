/**
 * Input 契约类型
 *
 * Props / Events / Slots / State / Logic
 */

import type { LogicInstance } from '../../types';

/** Input Props（Vue 与 React 共用） */
export type InputProps = {
  /** 受控值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 原生 input 类型 */
  type?: 'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url';
  /** 占位文本 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 只读状态 */
  readonly?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 是否显示清除图标 */
  clearable?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 输入回调（每次键入） */
  onInput?: (value: string) => void;
  /** 值变更提交回调（失焦或回车） */
  onChange?: (value: string) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  /** 清空回调（点击清除图标） */
  onClear?: () => void;
};

/** Input 事件契约 */
export type InputEvents = {
  input: (value: string) => void;
  change: (value: string) => void;
  focus: (event: FocusEvent) => void;
  blur: (event: FocusEvent) => void;
  clear: () => void;
};

/** Input 插槽契约 */
export type InputSlots = {
  /** 前置内容 */
  prefix: Record<string, never>;
  /** 后置内容 */
  suffix: Record<string, never>;
  /** 清除图标（clearable 模式） */
  clearIcon: Record<string, never>;
};

/** Input 状态快照（由逻辑层暴露） */
export type InputState = {
  value: string;
  focused: boolean;
  disabled: boolean;
  readonly: boolean;
};

/** Input 逻辑实例（通用接口 + 交互方法） */
export type InputLogic = LogicInstance<InputProps, InputState> & {
  handleInput: (value: string) => void;
  handleChange: (value: string) => void;
  handleFocus: (event: FocusEvent) => void;
  handleBlur: (event: FocusEvent) => void;
  handleClear: () => void;
};

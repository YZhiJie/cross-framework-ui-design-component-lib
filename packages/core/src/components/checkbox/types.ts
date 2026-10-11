/** Checkbox 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Checkbox Props（Vue 与 React 共用） */
export type CheckboxProps = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 半选状态（点击后切换为全选） */
  indeterminate?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 状态变更回调（载荷为切换后的选中值） */
  onChange?: (value: boolean) => void;
};

/** Checkbox 事件契约 */
export type CheckboxEvents = {
  change: (value: boolean) => void;
};

/** Checkbox 插槽契约 */
export type CheckboxSlots = {
  /** 标签内容 */
  default: Record<string, never>;
  /** 自定义选中勾选图标（替换内置 check，内容为任意节点） */
  checkIcon: Record<string, never>;
  /** 自定义半选图标（替换内置 minus，内容为任意节点） */
  indeterminateIcon: Record<string, never>;
};

/** Checkbox 状态快照（由逻辑层暴露） */
export type CheckboxState = {
  /** 当前选中状态 */
  checked: boolean;
  disabled: boolean;
  /** 当前半选状态 */
  indeterminate: boolean;
};

/** Checkbox 逻辑实例（通用接口 + 交互方法） */
export type CheckboxLogic = LogicInstance<CheckboxProps, CheckboxState> & {
  /** 切换选中状态（disabled 时忽略；半选状态点击后切换为全选） */
  toggle: () => void;
};

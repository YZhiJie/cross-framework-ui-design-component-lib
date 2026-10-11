/** Radio 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * Radio 是 RadioGroup 的子项组件（通过组上下文受控），
 * 自身不维护选中状态、不对外发事件，选中变更统一由 RadioGroup 触发 change。
 */

import type { LogicInstance } from '../../types';

/** Radio Props（Vue 与 React 共用） */
export type RadioProps = {
  /** 单选项取值（组内唯一，与 RadioGroup 的 value 做相等比较） */
  value: string;
  /** 禁用当前选项（与 RadioGroup 的 disabled 叠加生效） */
  disabled?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Radio 事件契约（选中变更统一由 RadioGroup 触发 change） */
export type RadioEvents = Record<string, never>;

/** Radio 插槽契约 */
export type RadioSlots = {
  /** 选项文案 */
  default: Record<string, never>;
};

/** Radio 状态快照（由逻辑层暴露） */
export type RadioState = {
  disabled: boolean;
};

/** Radio 逻辑实例（通用接口；选中态由组上下文派生，不进入逻辑层） */
export type RadioLogic = LogicInstance<RadioProps, RadioState>;

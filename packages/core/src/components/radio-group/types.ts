/** RadioGroup 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 单选项配置（options 数组渲染模式） */
export type RadioOption = {
  /** 选项文案 */
  label: string;
  /** 选项取值 */
  value: string;
  /** 禁用当前选项 */
  disabled?: boolean;
};

/** RadioGroup Props（Vue 与 React 共用） */
export type RadioGroupProps = {
  /** 受控选中值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  /** 禁用整组 */
  disabled?: boolean;
  /** 选项数组（提供后按 options 渲染，忽略 default 插槽） */
  options?: RadioOption[];
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（载荷为选中的选项值） */
  onChange?: (value: string) => void;
};

/** RadioGroup 事件契约 */
export type RadioGroupEvents = {
  change: (value: string) => void;
};

/** RadioGroup 插槽契约 */
export type RadioGroupSlots = {
  /** 自定义选项（渲染 Radio 子项；提供 options 时忽略） */
  default: Record<string, never>;
};

/** RadioGroup 状态快照（由逻辑层暴露） */
export type RadioGroupState = {
  /** 当前选中值（null 表示未选中任何项） */
  value: string | null;
  disabled: boolean;
};

/** RadioGroup 逻辑实例（通用接口 + 交互方法） */
export type RadioGroupLogic = LogicInstance<RadioGroupProps, RadioGroupState> & {
  /** 选中指定值（disabled 时忽略；非受控模式内部更新选中值） */
  select: (value: string) => void;
};

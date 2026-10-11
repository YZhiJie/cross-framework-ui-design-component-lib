/** InputNumber 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** InputNumber Props（Vue 与 React 共用） */
export type InputNumberProps = {
  /** 当前值（提供即受控，null 表示空值；非法输入回退 null） */
  value?: number | null;
  /** 非受控初始值 */
  defaultValue?: number | null;
  /** 最小值（默认 -Infinity） */
  min?: number;
  /** 最大值（默认 +Infinity） */
  max?: number;
  /** 步长（默认 1，非正数回退 1） */
  step?: number;
  /** 小数位数（0-20 整数，缺省不应用精度） */
  precision?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 占位文案 */
  placeholder?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 值变更回调（提交时触发；清空 / 非法输入载荷为 null） */
  onChange?: (value: number | null) => void;
};

/** InputNumber 事件契约 */
export type InputNumberEvents = {
  change: (value: number | null) => void;
};

/** InputNumber 插槽契约（无插槽） */
export type InputNumberSlots = {
  /** 自定义步进递增图标（替换内置 arrow-up，内容为任意节点） */
  upIcon: Record<string, never>;
  /** 自定义步进递减图标（替换内置 arrow-down，内容为任意节点） */
  downIcon: Record<string, never>;
};

/** InputNumber 状态快照（由逻辑层暴露） */
export type InputNumberState = {
  value: number | null;
  disabled: boolean;
  /** 收敛后的下界 */
  min: number;
  /** 收敛后的上界 */
  max: number;
  /** 收敛后的步长（正数） */
  step: number;
  /** 收敛后的小数位数（null 表示不应用精度） */
  precision: number | null;
};

/** InputNumber 逻辑实例（通用接口 + 交互方法） */
export type InputNumberLogic = LogicInstance<InputNumberProps, InputNumberState> & {
  /** 步进：direction 为 1（上）/ -1（下）；disabled / 值不变时 no-op */
  stepValue: (direction: 1 | -1) => void;
  /** 提交输入文本：空串或非法输入收敛为 null，合法值 clamp + precision */
  commitText: (text: string) => void;
};

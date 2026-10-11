/** Tooltip 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 弹出位置（CSS 包裹定位，非 portal） */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** 触发方式 */
export type TooltipTrigger = 'hover' | 'focus';

/** Tooltip Props（Vue 与 React 共用） */
export type TooltipProps = {
  /** 提示内容（content 插槽 / renderContent 回调优先） */
  content?: string;
  /** 弹出位置 */
  placement?: TooltipPlacement;
  /** 触发方式 */
  trigger?: TooltipTrigger;
  /** 禁用状态（禁用后不响应触发） */
  disabled?: boolean;
  /** 自定义类名（应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
};

/** Tooltip 事件契约（无契约事件） */
export type TooltipEvents = Record<string, never>;

/** Tooltip 插槽契约 */
export type TooltipSlots = {
  /** 触发元素 */
  default: Record<string, never>;
  /** 提示内容（Vue #content ↔ React renderContent 回调） */
  content: Record<string, never>;
};

/** Tooltip 状态快照（由逻辑层暴露） */
export type TooltipState = {
  /** 提示框展开状态 */
  open: boolean;
  disabled: boolean;
};

/** Tooltip 逻辑实例（通用接口 + 交互方法） */
export type TooltipLogic = LogicInstance<TooltipProps, TooltipState> & {
  /** 展开提示框（disabled 时忽略） */
  show: () => void;
  /** 收起提示框（未展开时为 no-op） */
  hide: () => void;
};

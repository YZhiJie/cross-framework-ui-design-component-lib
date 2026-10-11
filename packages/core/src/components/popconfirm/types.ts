/** Popconfirm 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 方位 */
export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Popconfirm Props（Vue 与 React 共用） */
export type PopconfirmProps = {
  /** 确认文案（content 插槽 / renderContent 可覆盖） */
  content?: string;
  /** 确认按钮文本（默认 '确定'） */
  confirmText?: string;
  /** 取消按钮文本（默认 '取消'） */
  cancelText?: string;
  /** 气泡方位 */
  placement?: PopconfirmPlacement;
  /** 禁用状态（禁用后点击触发元素无效，运行时禁用收起已开气泡） */
  disabled?: boolean;
  /** 自定义类名（应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  /** 点击确定回调（气泡收起后触发） */
  onConfirm?: () => void;
  /** 点击取消回调（气泡收起后触发） */
  onCancel?: () => void;
};

/** Popconfirm 事件契约 */
export type PopconfirmEvents = {
  confirm: () => void;
  cancel: () => void;
};

/** Popconfirm 插槽契约 */
export type PopconfirmSlots = {
  /** 触发元素 */
  default: Record<string, never>;
  /** 确认文案内容（覆盖 content prop） */
  content: Record<string, never>;
};

/** Popconfirm 状态快照（由逻辑层暴露） */
export type PopconfirmState = {
  open: boolean;
  placement: PopconfirmPlacement;
  disabled: boolean;
};

/** Popconfirm 逻辑实例（通用接口 + 交互方法） */
export type PopconfirmLogic = LogicInstance<PopconfirmProps, PopconfirmState> & {
  /** 点击触发元素切换开关（disabled no-op） */
  toggle: () => void;
  /** 点击确定：收起并触发 onConfirm */
  confirm: () => void;
  /** 点击取消：收起并触发 onCancel */
  cancel: () => void;
  /** 点击外部收起（不触发回调） */
  close: () => void;
};

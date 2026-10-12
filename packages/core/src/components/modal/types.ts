/**
 * Modal 契约类型
 *
 * Props / Events / Slots / State / Logic
 */

import type { LogicInstance } from '../../types';

/** Modal Props（Vue 与 React 共用） */
export type ModalProps = {
  /** 受控可见性（变更时由适配层同步给逻辑层） */
  visible?: boolean;
  /** 非受控初始可见性 */
  defaultVisible?: boolean;
  /** 标题 */
  title?: string;
  /** 宽度（数字按 px，字符串原样输出） */
  width?: number | string;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnEsc?: boolean;
  /** 确认按钮文案（默认 footer 生效；未提供时取全局语言包 modal.ok） */
  okText?: string;
  /** 取消按钮文案（默认 footer 生效；未提供时取全局语言包 modal.cancel） */
  cancelText?: string;
  /** 打开时是否将 Tab 焦点循环约束在弹窗内（默认 true） */
  trapFocus?: boolean;
  /** 自定义类名（Modal 应用于对话框面板；Tooltip/Popconfirm 应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  onOpen?: () => void;
  onClose?: () => void;
  /** 确认回调（触发后自动关闭） */
  onOk?: () => void;
  /** 取消回调（触发后自动关闭） */
  onCancel?: () => void;
};

/** Modal 事件契约 */
export type ModalEvents = {
  open: () => void;
  close: () => void;
  ok: () => void;
  cancel: () => void;
};

/** Modal 插槽契约 */
export type ModalSlots = {
  /** 弹窗内容 */
  default: Record<string, never>;
  /** 标题（覆盖 title prop） */
  title: Record<string, never>;
  /** 底部操作区 */
  footer: Record<string, never>;
  /** 自定义关闭图标（替换右上角内置 close，内容为任意节点） */
  closeIcon: Record<string, never>;
};

/** Modal 状态快照（由逻辑层暴露） */
export type ModalState = {
  visible: boolean;
  closable: boolean;
};

/** Modal 逻辑实例（通用接口 + 交互方法） */
export type ModalLogic = LogicInstance<ModalProps, ModalState> & {
  open: () => void;
  close: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  handleMaskClick: () => void;
  handleEsc: () => void;
};
